import fs from "node:fs/promises";
import path from "node:path";
import { generateFoundryCss } from "./css.js";
import type { BuiltInThemeName, PresetName, TierName } from "./presets.js";
import { presetNames, resolveBuiltInThemePath, resolvePresetPath, resolveTierPath, tierNames } from "./presets.js";
import type {
  BaselineGeneratorElementToken,
  BaselineGeneratorTokens,
  BuildThemeResult,
  ComponentTokens,
  DeriveBaselineTokensResult,
  ThemeConfig,
  ThemeElementConfig,
  ThemeTokens,
  TierOverride,
  TypographyToken
} from "./types.js";

function parseRem(remValue: string): number {
  return Number.parseFloat(remValue.replace("rem", ""));
}

function roundRemValue(value: number): number {
  return Math.round(value * 100000) / 100000;
}

function toRem(value: number): string {
  return `${roundRemValue(value)}rem`;
}

async function ensureDirectory(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

function validateConfig(config: ThemeConfig): void {
  if (!config.fontFiles.length) {
    throw new Error("Theme config requires at least one font file.");
  }

  if (!config.fontFiles.some(fontFile => !fontFile.runtimeOnly)) {
    throw new Error("Theme config requires at least one build-time font file.");
  }

  if (!config.elements.length) {
    throw new Error("Theme config requires at least one typography element.");
  }

  if (!config.roles.body) {
    throw new Error('Theme config requires a "body" role.');
  }

  if (!config.components) {
    throw new Error("Theme config requires a components block.");
  }

  const identifiers = new Set(config.elements.map(element => element.identifier));
  for (const [roleName, identifier] of Object.entries(config.roles)) {
    if (!identifiers.has(identifier)) {
      throw new Error(`Role "${roleName}" points to missing element "${identifier}".`);
    }
  }
}

export async function readThemeConfig(configPath: string): Promise<ThemeConfig> {
  const raw = await fs.readFile(configPath, "utf8");
  const config = JSON.parse(raw) as ThemeConfig;
  validateConfig(config);
  return config;
}

function createBaselineConfig(
  config: ThemeConfig,
  sourceConfigPath: string,
  baselineConfigPath: string
): Pick<ThemeConfig, "baselineUnit" | "fontFiles" | "elements"> {
  const sourceConfigDir = path.dirname(sourceConfigPath);
  const baselineConfigDir = path.dirname(baselineConfigPath);

  return {
    baselineUnit: config.baselineUnit,
    fontFiles: config.fontFiles.filter(fontFile => !fontFile.runtimeOnly).map(fontFile => {
      const absoluteFontPath = path.resolve(sourceConfigDir, fontFile.path);
      const relativeFontPath = path.relative(baselineConfigDir, absoluteFontPath).replace(/\\/g, "/");

      return {
        family: fontFile.family,
        path: relativeFontPath
      };
    }),
    elements: config.elements.map((element: ThemeElementConfig) => ({
      identifier: element.identifier,
      fontSize: element.fontSize,
      lineHeight: element.lineHeight,
      spaceAfter: element.spaceAfter,
      fontFamily: element.fontFamily,
      fontWeight: element.fontWeight,
      fontStyle: element.fontStyle
    }))
  };
}

function createRuntimeFontFiles(config: ThemeConfig, sourceConfigPath: string, outputDir: string): ThemeConfig["fontFiles"] {
  const sourceConfigDir = path.dirname(sourceConfigPath);

  return config.fontFiles.map(fontFile => {
    const absoluteFontPath = path.resolve(sourceConfigDir, fontFile.path);
    const relativeFontPath = path.relative(outputDir, absoluteFontPath).replace(/\\/g, "/");

    return {
      ...fontFile,
      path: relativeFontPath
    };
  });
}

async function generateBaselineTokens(baselineConfigPath: string, outputDir: string): Promise<BaselineGeneratorTokens> {
  const moduleNamespace = await import("@lyubomir-popov/baseline-nudge-generator") as Record<string, unknown>;
  const generateFromConfig = (moduleNamespace.generateFromConfig ?? (moduleNamespace.default as Record<string, unknown> | undefined)?.generateFromConfig) as
    | ((configPath: string, outputDir?: string) => Promise<unknown>)
    | undefined;

  if (!generateFromConfig) {
    throw new Error("Unable to load generateFromConfig from @lyubomir-popov/baseline-nudge-generator.");
  }

  await generateFromConfig(baselineConfigPath, outputDir);
  const tokensPath = path.join(outputDir, "tokens.json");
  const raw = await fs.readFile(tokensPath, "utf8");
  return JSON.parse(raw) as BaselineGeneratorTokens;
}

function toTypographyToken(identifier: string, token: BaselineGeneratorElementToken, config: ThemeConfig): TypographyToken {
  const elementConfig = config.elements.find(element => element.identifier === identifier);
  const fontFamily = token.fontFamily ?? config.fontFiles[0]?.family ?? "sans";
  const fontStack = config.fontStacks[fontFamily] ?? fontFamily;
  const marginBottom = toRem(parseRem(token.spaceAfter) - parseRem(token.nudgeTop));

  return {
    ...token,
    identifier,
    fontFamily,
    fontStack,
    marginBottom,
    fontVariantCaps: elementConfig?.fontVariantCaps,
    letterSpacing: elementConfig?.letterSpacing,
    textTransform: elementConfig?.textTransform
  };
}

function buildComponentTokens(config: ThemeConfig): ComponentTokens {
  return {
    borderWidth: `${config.components.borderWidthPx}px`,
    radius: toRem(config.components.radiusRem),
    controlInlinePadding: toRem(config.components.controlInlinePaddingRem),
    controlVisualSize: toRem(config.components.controlVisualSizeRem),
    fieldGap: toRem(config.components.fieldGapBaselineUnits * config.baselineUnit),
    panelPaddingInline: toRem(config.components.panelPaddingInlineBaselineUnits * config.baselineUnit),
    panelPaddingBlock: toRem(config.components.panelPaddingBlockBaselineUnits * config.baselineUnit),
    accordionIndent: toRem(config.components.accordionIndentBaselineUnits * config.baselineUnit),
    controlMinBlockSize: toRem(config.components.controlMinBlockSizeBaselineUnits * config.baselineUnit),
    controlMinBlockSizeDense: toRem(
      (config.components.controlMinBlockSizeDenseBaselineUnits ?? config.components.controlMinBlockSizeBaselineUnits) * config.baselineUnit
    )
  };
}

function buildThemeTokens(config: ThemeConfig, baselineTokens: BaselineGeneratorTokens): ThemeTokens {
  const elements = Object.fromEntries(
    Object.entries(baselineTokens.elements).map(([identifier, token]) => [identifier, toTypographyToken(identifier, token, config)])
  );

  const roles = Object.fromEntries(
    Object.entries(config.roles).map(([roleName, identifier]) => {
      const roleToken = elements[identifier];
      if (!roleToken) {
        throw new Error(`Missing generated token for role "${roleName}" / identifier "${identifier}".`);
      }
      return [roleName, roleToken];
    })
  );

  return {
    baselineUnit: baselineTokens.baselineUnit,
    fontFiles: config.fontFiles,
    fontStacks: config.fontStacks,
    roles,
    elements,
    layout: {
      contentMaxWidth: toRem(config.layout.contentMaxWidthRem),
      contentPaddingInline: toRem(config.layout.contentPaddingInlineRem),
      measure: toRem(config.layout.measureRem),
      sectionSpace: toRem(config.layout.sectionSpaceBaselineUnits * config.baselineUnit),
      sectionSpaceShallow: toRem(config.layout.sectionSpaceShallowBaselineUnits * config.baselineUnit),
      sectionSpaceDeep: toRem(config.layout.sectionSpaceDeepBaselineUnits * config.baselineUnit),
      stripSpace: toRem(config.layout.stripSpaceBaselineUnits * config.baselineUnit),
      gridGapInline: toRem(config.layout.gridGapInlineBaselineUnits * config.baselineUnit),
      gridGapBlock: toRem(config.layout.gridGapBlockBaselineUnits * config.baselineUnit),
      pageMargin: toRem(config.layout.pageMarginBaselineUnits * config.baselineUnit)
    },
    components: buildComponentTokens(config)
  };
}

function inferBuiltInPresetName(resolvedConfigPath: string): BuiltInThemeName | undefined {
  for (const tierName of tierNames) {
    if (resolvedConfigPath === resolveTierPath(tierName)) {
      return tierName;
    }
  }

  for (const presetName of presetNames) {
    if (resolvedConfigPath === resolveBuiltInThemePath(presetName)) {
      return presetName;
    }
  }

  return undefined;
}

function buildZeroNudgeTierTokens(config: ThemeConfig): ThemeTokens {
  const roles: Record<string, TypographyToken> = {};
  const elements: Record<string, TypographyToken> = {};

  for (const element of config.elements) {
    const fontFamily = element.fontFamily ?? config.fontFiles[0]?.family ?? "sans";
    const fontStack = config.fontStacks[fontFamily] ?? fontFamily;
    const lineHeight = toRem(element.lineHeight * config.baselineUnit);
    const spaceAfter = toRem(element.spaceAfter * config.baselineUnit);

    const token: TypographyToken = {
      identifier: element.identifier,
      fontSize: `${element.fontSize}rem`,
      lineHeight,
      fontFamily,
      fontStack,
      fontWeight: element.fontWeight,
      fontStyle: element.fontStyle,
      spaceAfter,
      nudgeTop: "0rem",
      marginBottom: spaceAfter,
      fontVariantCaps: element.fontVariantCaps,
      letterSpacing: element.letterSpacing,
      textTransform: element.textTransform
    };

    elements[element.identifier] = token;
  }

  for (const [roleName, identifier] of Object.entries(config.roles)) {
    const token = elements[identifier];
    if (token) roles[roleName] = token;
  }

  return {
    baselineUnit: toRem(config.baselineUnit),
    fontFiles: config.fontFiles,
    fontStacks: config.fontStacks,
    roles,
    elements,
    layout: {
      contentMaxWidth: toRem(config.layout.contentMaxWidthRem),
      contentPaddingInline: toRem(config.layout.contentPaddingInlineRem),
      measure: toRem(config.layout.measureRem),
      sectionSpace: toRem(config.layout.sectionSpaceBaselineUnits * config.baselineUnit),
      sectionSpaceShallow: toRem(config.layout.sectionSpaceShallowBaselineUnits * config.baselineUnit),
      sectionSpaceDeep: toRem(config.layout.sectionSpaceDeepBaselineUnits * config.baselineUnit),
      stripSpace: toRem(config.layout.stripSpaceBaselineUnits * config.baselineUnit),
      gridGapInline: toRem(config.layout.gridGapInlineBaselineUnits * config.baselineUnit),
      gridGapBlock: toRem(config.layout.gridGapBlockBaselineUnits * config.baselineUnit),
      pageMargin: toRem(config.layout.pageMarginBaselineUnits * config.baselineUnit)
    },
    components: buildComponentTokens(config)
  };
}

async function buildTierOverrides(resolvedConfigPath: string): Promise<TierOverride[]> {
  const overrides: TierOverride[] = [];
  const currentTier = inferBuiltInPresetName(resolvedConfigPath);

  for (const tierName of tierNames) {
    if (tierName === currentTier || (currentTier === "prose" && tierName === "editorial") || (currentTier === "app-tier" && tierName === "app")) {
      continue;
    }
    const tierConfigPath = resolveTierPath(tierName);
    const tierConfig = await readThemeConfig(tierConfigPath);
    const tierTokens = buildZeroNudgeTierTokens(tierConfig);
    overrides.push({
      className: `bf-tier-${tierName}`,
      roles: tierTokens.roles,
      baselineUnit: tierTokens.baselineUnit,
      tokens: tierTokens
    });
  }

  return overrides;
}

async function buildTheme(
  resolvedConfigPath: string,
  distDir: string,
  baselineDir: string
): Promise<BuildThemeResult> {
  const resolvedDistDir = path.resolve(distDir);
  const resolvedBaselineDir = path.resolve(baselineDir);

  await ensureDirectory(resolvedDistDir);
  await ensureDirectory(resolvedBaselineDir);

  const config = await readThemeConfig(resolvedConfigPath);
  const runtimeConfig: ThemeConfig = {
    ...config,
    fontFiles: createRuntimeFontFiles(config, resolvedConfigPath, resolvedDistDir)
  };
  const baselineConfigPath = path.join(resolvedBaselineDir, "foundation-theme.baseline.json");
  await fs.writeFile(
    baselineConfigPath,
    `${JSON.stringify(createBaselineConfig(config, resolvedConfigPath, baselineConfigPath), null, 2)}\n`,
    "utf8"
  );

  const baselineTokens = await generateBaselineTokens(baselineConfigPath, resolvedBaselineDir);
  const tokens = buildThemeTokens(runtimeConfig, baselineTokens);
  const tierOverrides = await buildTierOverrides(resolvedConfigPath);
  const css = generateFoundryCss(tokens, { presetName: inferBuiltInPresetName(resolvedConfigPath), tierOverrides });

  const tokensPath = path.join(resolvedDistDir, "tokens.json");
  const cssPath = path.join(resolvedDistDir, "styles.css");
  await fs.writeFile(tokensPath, `${JSON.stringify(tokens, null, 2)}\n`, "utf8");
  await fs.writeFile(cssPath, css, "utf8");

  return {
    configPath: resolvedConfigPath,
    baselineConfigPath,
    baselineTokensPath: path.join(resolvedBaselineDir, "tokens.json"),
    tokensPath,
    cssPath,
    tokens,
    css
  };
}

export async function buildThemeFromConfig(
  configPath = path.resolve("config/tiers/editorial.json"),
  options: { distDir?: string; baselineDir?: string; } = {}
): Promise<BuildThemeResult> {
  const resolvedConfigPath = path.resolve(configPath);
  const distDir = options.distDir ?? "dist";
  const baselineDir = options.baselineDir ?? "generated/baseline";
  return buildTheme(resolvedConfigPath, distDir, baselineDir);
}

export async function buildThemeFromTier(tier: TierName): Promise<BuildThemeResult> {
  return buildThemeFromConfig(resolveTierPath(tier), {
    distDir: path.join("dist", "tiers", tier),
    baselineDir: path.join("generated", "baseline", "tiers", tier)
  });
}

export async function buildThemeFromPreset(preset: PresetName): Promise<BuildThemeResult> {
  return buildThemeFromConfig(resolvePresetPath(preset), {
    distDir: path.join("dist", "presets", preset),
    baselineDir: path.join("generated", "baseline", preset)
  });
}

export async function deriveBaselineTokensFromConfig(
  configPath = path.resolve("config/tiers/editorial.json"),
  options: { baselineDir?: string; } = {}
): Promise<DeriveBaselineTokensResult> {
  const resolvedConfigPath = path.resolve(configPath);
  const baselineDir = options.baselineDir ?? "generated/baseline";
  const resolvedBaselineDir = path.resolve(baselineDir);

  await ensureDirectory(resolvedBaselineDir);

  const config = await readThemeConfig(resolvedConfigPath);
  const baselineConfigFileName = `${path.parse(resolvedConfigPath).name}.baseline.json`;
  const baselineConfigPath = path.join(resolvedBaselineDir, baselineConfigFileName);

  await fs.writeFile(
    baselineConfigPath,
    `${JSON.stringify(createBaselineConfig(config, resolvedConfigPath, baselineConfigPath), null, 2)}\n`,
    "utf8"
  );

  const tokens = await generateBaselineTokens(baselineConfigPath, resolvedBaselineDir);

  return {
    configPath: resolvedConfigPath,
    baselineConfigPath,
    baselineTokensPath: path.join(resolvedBaselineDir, "tokens.json"),
    tokens
  };
}
