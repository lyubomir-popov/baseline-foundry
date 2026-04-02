import fs from "node:fs/promises";
import path from "node:path";
import { generateFoundryCss } from "./css.js";
import type { BuiltInThemeName, PresetName, TierName } from "./presets.js";
import { normalizeBuiltInThemeName, presetNames, resolveBuiltInThemePath, resolvePresetPath, resolveTierPath, tierNames } from "./presets.js";
import type {
  BaselineGeneratorElementToken,
  BaselineGeneratorTokens,
  BuildThemeResult,
  ComponentTokens,
  DeriveBaselineTokensResult,
  ThemeConfig,
  ThemeElementConfig,
  ThemeSurface,
  ThemeSurfaceManifest,
  ThemeTokens,
  TypographyToken
} from "./types.js";

export interface AdditionalThemeSurfaceBuildConfig {
  name: string;
  configPath: string;
  className?: string;
  label?: string;
  zeroNudge?: boolean;
}

export interface BuildThemeFromConfigOptions {
  distDir?: string;
  baselineDir?: string;
  surfaceLabel?: string;
  additionalSurfaces?: AdditionalThemeSurfaceBuildConfig[];
}

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
    controlBlockPadding: toRem(config.components.controlBlockPaddingRem),
    controlCompactBlockPadding: toRem(
      config.components.controlCompactBlockPaddingRem ?? config.components.controlBlockPaddingRem
    ),
    controlInlinePadding: toRem(config.components.controlInlinePaddingRem),
    controlVisualSize: toRem(config.components.controlVisualSizeRem),
    fieldGap: toRem(config.components.fieldGapBaselineUnits * config.baselineUnit),
    panelPaddingInline: toRem(config.components.panelPaddingInlineBaselineUnits * config.baselineUnit),
    panelPaddingBlock: toRem(config.components.panelPaddingBlockBaselineUnits * config.baselineUnit),
    accordionIndent: toRem(config.components.accordionIndentBaselineUnits * config.baselineUnit)
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

function inferSurfaceName(resolvedConfigPath: string): string {
  const builtInName = inferBuiltInPresetName(resolvedConfigPath);
  if (builtInName) {
    return normalizeBuiltInThemeName(builtInName);
  }

  return path.parse(resolvedConfigPath).name;
}

function surfaceClassName(surfaceName: string): string | undefined {
  return tierNames.includes(surfaceName as TierName) ? `bf-tier-${surfaceName}` : undefined;
}

function runtimeMetricsTokens(
  baselineTokens: BaselineGeneratorTokens,
  runtimeFontFiles: ThemeConfig["fontFiles"]
): BaselineGeneratorTokens {
  const metricFamilies = new Set(
    Object.values(baselineTokens.elements)
      .map(token => token.fontFamily)
      .filter((family): family is string => typeof family === "string")
  );

  return {
    ...baselineTokens,
    fontFiles: runtimeFontFiles
      .filter(fontFile => !fontFile.runtimeOnly)
      .filter(fontFile => metricFamilies.size === 0 || metricFamilies.has(fontFile.family))
      .map(fontFile => ({ ...fontFile }))
  };
}

function buildSurfaceManifest(defaultSurface: string, surfaces: ThemeSurface[]): ThemeSurfaceManifest {
  return {
    defaultSurface,
    surfaces: Object.fromEntries(
      surfaces.map(surface => [surface.name, {
        label: surface.label,
        className: surface.className,
        configPath: surface.configPath,
        baselineConfigPath: surface.baselineConfigPath,
        baselineTokensPath: surface.baselineTokensPath,
        tokens: surface.tokens,
        metrics: surface.metrics
      }])
    )
  };
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

async function buildThemeSurface(
  name: string,
  resolvedConfigPath: string,
  baselineDir: string,
  outputDir: string,
  options: {
    className?: string;
    label?: string;
    zeroNudge?: boolean;
  } = {}
): Promise<ThemeSurface> {
  const config = await readThemeConfig(resolvedConfigPath);
  const resolvedBaselineDir = path.resolve(baselineDir);
  const resolvedOutputDir = path.resolve(outputDir);

  await ensureDirectory(resolvedBaselineDir);

  const baselineConfigFileName = `${path.parse(resolvedConfigPath).name}.baseline.json`;
  const baselineConfigPath = path.join(resolvedBaselineDir, baselineConfigFileName);

  await fs.writeFile(
    baselineConfigPath,
    `${JSON.stringify(createBaselineConfig(config, resolvedConfigPath, baselineConfigPath), null, 2)}\n`,
    "utf8"
  );

  const baselineTokens = await generateBaselineTokens(baselineConfigPath, resolvedBaselineDir);
  const runtimeConfig: ThemeConfig = {
    ...config,
    fontFiles: createRuntimeFontFiles(config, resolvedConfigPath, resolvedOutputDir)
  };

  return {
    name,
    label: options.label,
    className: options.className,
    configPath: resolvedConfigPath,
    baselineConfigPath,
    baselineTokensPath: path.join(resolvedBaselineDir, "tokens.json"),
    tokens: options.zeroNudge ? buildZeroNudgeTierTokens(runtimeConfig) : buildThemeTokens(runtimeConfig, baselineTokens),
    metrics: runtimeMetricsTokens(baselineTokens, runtimeConfig.fontFiles)
  };
}

async function buildRelatedTierSurfaces(
  resolvedConfigPath: string,
  currentSurfaceName: string,
  baselineDir: string,
  outputDir: string
): Promise<ThemeSurface[]> {
  if (!inferBuiltInPresetName(resolvedConfigPath)) {
    return [];
  }

  const surfaces: ThemeSurface[] = [];

  for (const tierName of tierNames) {
    if (tierName === currentSurfaceName) {
      continue;
    }

    surfaces.push(await buildThemeSurface(
      tierName,
      resolveTierPath(tierName),
      path.join(baselineDir, "surfaces", tierName),
      outputDir,
      {
        className: `bf-tier-${tierName}`,
        zeroNudge: tierName === "app"
      }
    ));
  }

  return surfaces;
}

async function buildAdditionalThemeSurfaces(
  surfaceConfigs: AdditionalThemeSurfaceBuildConfig[],
  baselineDir: string,
  outputDir: string
): Promise<ThemeSurface[]> {
  const surfaces: ThemeSurface[] = [];

  for (const surfaceConfig of surfaceConfigs) {
    surfaces.push(await buildThemeSurface(
      surfaceConfig.name,
      path.resolve(surfaceConfig.configPath),
      path.join(baselineDir, "surfaces", surfaceConfig.name),
      outputDir,
      {
        className: surfaceConfig.className,
        label: surfaceConfig.label,
        zeroNudge: surfaceConfig.zeroNudge
      }
    ));
  }

  return surfaces;
}

function assertUniqueSurfaceNames(surfaces: ThemeSurface[]): void {
  const names = new Set<string>();

  for (const surface of surfaces) {
    if (names.has(surface.name)) {
      throw new Error(`Duplicate surface name "${surface.name}" in build output.`);
    }

    names.add(surface.name);
  }
}

async function buildTheme(
  resolvedConfigPath: string,
  distDir: string,
  baselineDir: string,
  options: {
    surfaceLabel?: string;
    additionalSurfaces?: AdditionalThemeSurfaceBuildConfig[];
  } = {}
): Promise<BuildThemeResult> {
  const resolvedDistDir = path.resolve(distDir);
  const resolvedBaselineDir = path.resolve(baselineDir);

  await ensureDirectory(resolvedDistDir);
  await ensureDirectory(resolvedBaselineDir);

  const builtInName = inferBuiltInPresetName(resolvedConfigPath);
  const defaultSurfaceName = inferSurfaceName(resolvedConfigPath);
  const defaultSurface = await buildThemeSurface(
    defaultSurfaceName,
    resolvedConfigPath,
    resolvedBaselineDir,
    resolvedDistDir,
    {
      label: options.surfaceLabel,
      className: surfaceClassName(defaultSurfaceName),
      zeroNudge: normalizeBuiltInThemeName(builtInName ?? defaultSurfaceName as BuiltInThemeName) === "app" && builtInName !== undefined
    }
  );
  const relatedSurfaces = await buildRelatedTierSurfaces(
    resolvedConfigPath,
    defaultSurfaceName,
    resolvedBaselineDir,
    resolvedDistDir
  );
  const additionalSurfaces = await buildAdditionalThemeSurfaces(
    options.additionalSurfaces ?? [],
    resolvedBaselineDir,
    resolvedDistDir
  );
  const surfaces = [defaultSurface, ...relatedSurfaces, ...additionalSurfaces];
  assertUniqueSurfaceNames(surfaces);
  const surfaceManifest = buildSurfaceManifest(defaultSurfaceName, surfaces);
  const css = generateFoundryCss(defaultSurface.tokens, {
    presetName: builtInName,
    themeSurfaces: surfaces.filter(surface => surface.className)
  });

  const tokensPath = path.join(resolvedDistDir, "tokens.json");
  const cssPath = path.join(resolvedDistDir, "styles.css");
  const surfaceManifestPath = path.join(resolvedDistDir, "surfaces.json");
  await fs.writeFile(tokensPath, `${JSON.stringify(defaultSurface.tokens, null, 2)}\n`, "utf8");
  await fs.writeFile(cssPath, css, "utf8");
  await fs.writeFile(surfaceManifestPath, `${JSON.stringify(surfaceManifest, null, 2)}\n`, "utf8");

  return {
    configPath: resolvedConfigPath,
    baselineConfigPath: defaultSurface.baselineConfigPath,
    baselineTokensPath: defaultSurface.baselineTokensPath,
    tokensPath,
    cssPath,
    surfaceManifestPath,
    tokens: defaultSurface.tokens,
    css,
    surfaces: surfaceManifest
  };
}

export async function buildThemeFromConfig(
  configPath = path.resolve("config/tiers/editorial.json"),
  options: BuildThemeFromConfigOptions = {}
): Promise<BuildThemeResult> {
  const resolvedConfigPath = path.resolve(configPath);
  const distDir = options.distDir ?? "dist";
  const baselineDir = options.baselineDir ?? "generated/baseline";
  return buildTheme(resolvedConfigPath, distDir, baselineDir, {
    surfaceLabel: options.surfaceLabel,
    additionalSurfaces: options.additionalSurfaces
  });
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
