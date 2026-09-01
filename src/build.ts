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

async function emptyDirectory(dirPath: string): Promise<void> {
  await ensureDirectory(dirPath);

  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      await emptyDirectory(entryPath);
      continue;
    }

    await fs.rm(entryPath, { recursive: true, force: true });
  }
}

async function writeJsonFileAtomic(filePath: string, value: unknown): Promise<void> {
  const tempFilePath = `${filePath}.tmp`;
  await fs.writeFile(tempFilePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await fs.rm(filePath, { force: true });
  await fs.rename(tempFilePath, filePath);
}

function assertFiniteNumberConfigField(value: unknown, fieldPath: string): void {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Theme config field "${fieldPath}" must be a finite number.`);
  }
}

const REQUIRED_LAYOUT_FIELDS = [
  "contentMaxWidthRem",
  "contentPaddingInlineRem",
  "measureRem",
  "sectionSpaceBaselineUnits",
  "sectionSpaceShallowBaselineUnits",
  "sectionSpaceDeepBaselineUnits",
  "stripSpaceBaselineUnits",
  "gridGapInlineBaselineUnits",
  "gridGapBlockBaselineUnits",
  "pageMarginBaselineUnits"
] as const satisfies readonly (keyof ThemeConfig["layout"])[];

const REQUIRED_COMPONENT_FIELDS = [
  "borderWidthRem",
  "radiusRem",
  "inlineInsetFieldRem",
  "inlineInsetActionRem",
  "inlineInsetContinuationRem",
  "controlVisualSizeRem",
  "fieldGapBaselineUnits",
  "panelPaddingInlineBaselineUnits",
  "panelPaddingBlockBaselineUnits"
] as const satisfies readonly (keyof ThemeConfig["components"])[];

function assertNoDuplicateRoleKeys(raw: string, configPath: string): void {
  const rolesMatch = raw.match(/"roles"\s*:\s*\{([\s\S]*?)\}/);
  if (!rolesMatch) {
    throw new Error(`Theme config "${configPath}" requires a roles object.`);
  }

  const seen = new Set<string>();
  for (const match of rolesMatch[1].matchAll(/^\s*"([^"]+)"\s*:/gm)) {
    const roleName = match[1];
    if (seen.has(roleName)) {
      throw new Error(`Theme config "${configPath}" contains duplicate role key "${roleName}".`);
    }
    seen.add(roleName);
  }
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

  assertFiniteNumberConfigField(config.baselineUnit, "baselineUnit");
  if (config.baselineUnit <= 0) {
    throw new Error('Theme config field "baselineUnit" must be greater than zero.');
  }

  for (const field of REQUIRED_LAYOUT_FIELDS) {
    assertFiniteNumberConfigField(config.layout[field], `layout.${field}`);
  }

  for (const field of REQUIRED_COMPONENT_FIELDS) {
    assertFiniteNumberConfigField(config.components[field], `components.${field}`);
  }

  if (config.components.borderWidthRem <= 0 || config.components.controlVisualSizeRem <= 0) {
    throw new Error("Component border width and control visual size must be greater than zero.");
  }

  if (
    config.components.radiusRem < 0 ||
    config.components.inlineInsetFieldRem < 0 ||
    config.components.inlineInsetActionRem < 0 ||
    config.components.inlineInsetContinuationRem < 0 ||
    config.components.fieldGapBaselineUnits < 0 ||
    config.components.panelPaddingInlineBaselineUnits < 0 ||
    config.components.panelPaddingBlockBaselineUnits < 0
  ) {
    throw new Error("Component radius, inline insets, gaps, and surface padding must be non-negative.");
  }

  if (config.components.inlineInsetActionRem < config.components.borderWidthRem) {
    throw new Error("Component action inset must contain its bordered action edge.");
  }

  const elementIdentifiers = new Set<string>();
  for (const [index, element] of config.elements.entries()) {
    if (elementIdentifiers.has(element.identifier)) {
      throw new Error(`Theme config contains duplicate element identifier "${element.identifier}".`);
    }
    elementIdentifiers.add(element.identifier);
    assertFiniteNumberConfigField(element.fontSize, `elements[${index}].fontSize`);
    assertFiniteNumberConfigField(element.lineHeight, `elements[${index}].lineHeight`);
    assertFiniteNumberConfigField(element.spaceAfter, `elements[${index}].spaceAfter`);
    if (element.fontWeight !== undefined) {
      assertFiniteNumberConfigField(element.fontWeight, `elements[${index}].fontWeight`);
    }
    if (element.fontSize <= 0 || element.lineHeight <= 0) {
      throw new Error(`Theme element "${element.identifier}" requires positive fontSize and lineHeight values.`);
    }
    if (element.spaceAfter < 1) {
      throw new Error(`Theme element "${element.identifier}" requires spaceAfter >= 1 baseline unit so semantic margin is non-negative.`);
    }
  }

  for (const [roleName, identifier] of Object.entries(config.roles)) {
    if (!elementIdentifiers.has(identifier)) {
      throw new Error(`Role "${roleName}" points to missing element "${identifier}".`);
    }
  }
}

export async function readThemeConfig(configPath: string): Promise<ThemeConfig> {
  const raw = await fs.readFile(configPath, "utf8");
  assertNoDuplicateRoleKeys(raw, configPath);
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
  const marginBottom = toRem(config.baselineUnit - parseRem(token.nudgeTop));

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
    borderWidth: toRem(config.components.borderWidthRem),
    // Vanilla's shared $bar-thickness is represented as 0.1875rem so emphasis
    // bars and thin borders both scale with root text sizing.
    barThickness: toRem(3 / 16),
    radius: toRem(config.components.radiusRem),
    inlineInsetField: toRem(config.components.inlineInsetFieldRem),
    inlineInsetAction: toRem(config.components.inlineInsetActionRem),
    inlineInsetContinuation: toRem(config.components.inlineInsetContinuationRem),
    controlVisualSize: toRem(config.components.controlVisualSizeRem),
    fieldGap: toRem(config.components.fieldGapBaselineUnits * config.baselineUnit),
    panelPaddingInline: toRem(config.components.panelPaddingInlineBaselineUnits * config.baselineUnit),
    panelPaddingBlock: toRem(config.components.panelPaddingBlockBaselineUnits * config.baselineUnit)
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

  const body = roles.body;
  if (!body) {
    throw new Error('Theme tokens require a generated "body" role.');
  }

  const nestedLineHeight = parseRem(body.lineHeight) - parseRem(baselineTokens.baselineUnit);
  if (nestedLineHeight < parseRem(body.fontSize)) {
    throw new Error(
      `Nested line ${toRem(nestedLineHeight)} cannot contain the body font ${body.fontSize}.`
    );
  }
  if (nestedLineHeight < config.components.controlVisualSizeRem) {
    throw new Error(
      `Nested line ${toRem(nestedLineHeight)} cannot contain the control visual ${toRem(config.components.controlVisualSizeRem)}.`
    );
  }
  const nestedFramedPaint = nestedLineHeight + (config.components.borderWidthRem * 2);
  if (nestedFramedPaint > parseRem(body.lineHeight)) {
    throw new Error(
      `Nested framed controls require ${toRem(nestedFramedPaint)}, which exceeds the body line ${body.lineHeight}.`
    );
  }

  const leadingMarkNeed = config.components.controlVisualSizeRem +
    (config.components.fieldGapBaselineUnits * config.baselineUnit);
  if (config.components.inlineInsetContinuationRem < leadingMarkNeed) {
    throw new Error(
      `Continuation inset ${toRem(config.components.inlineInsetContinuationRem)} cannot contain the leading mark and gap ${toRem(leadingMarkNeed)}.`
    );
  }

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
        engine: surface.engine,
        tokens: surface.tokens,
        metrics: surface.metrics
      }])
    )
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
    engine?: string;
  } = {}
): Promise<ThemeSurface> {
  const config = await readThemeConfig(resolvedConfigPath);
  const resolvedBaselineDir = path.resolve(baselineDir);
  const resolvedOutputDir = path.resolve(outputDir);

  await ensureDirectory(resolvedBaselineDir);

  const baselineConfigFileName = `${path.parse(resolvedConfigPath).name}.baseline.json`;
  const baselineConfigPath = path.join(resolvedBaselineDir, baselineConfigFileName);

  await writeJsonFileAtomic(baselineConfigPath, createBaselineConfig(config, resolvedConfigPath, baselineConfigPath));

  const baselineTokens = await generateBaselineTokens(baselineConfigPath, resolvedBaselineDir);
  const runtimeConfig: ThemeConfig = {
    ...config,
    fontFiles: createRuntimeFontFiles(config, resolvedConfigPath, resolvedOutputDir)
  };

  return {
    name,
    label: options.label,
    className: options.className,
    engine: options.engine ?? "metrics-compensated",
    configPath: resolvedConfigPath,
    baselineConfigPath,
    baselineTokensPath: path.join(resolvedBaselineDir, "tokens.json"),
    tokens: buildThemeTokens(runtimeConfig, baselineTokens),
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
        className: `bf-tier-${tierName}`
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
        label: surfaceConfig.label
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
  await emptyDirectory(resolvedBaselineDir);

  const builtInName = inferBuiltInPresetName(resolvedConfigPath);
  const defaultSurfaceName = inferSurfaceName(resolvedConfigPath);
  const defaultSurface = await buildThemeSurface(
    defaultSurfaceName,
    resolvedConfigPath,
    resolvedBaselineDir,
    resolvedDistDir,
    {
      label: options.surfaceLabel,
      className: surfaceClassName(defaultSurfaceName)
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

  await emptyDirectory(resolvedBaselineDir);

  const config = await readThemeConfig(resolvedConfigPath);
  const baselineConfigFileName = `${path.parse(resolvedConfigPath).name}.baseline.json`;
  const baselineConfigPath = path.join(resolvedBaselineDir, baselineConfigFileName);

  await writeJsonFileAtomic(baselineConfigPath, createBaselineConfig(config, resolvedConfigPath, baselineConfigPath));

  const tokens = await generateBaselineTokens(baselineConfigPath, resolvedBaselineDir);

  return {
    configPath: resolvedConfigPath,
    baselineConfigPath,
    baselineTokensPath: path.join(resolvedBaselineDir, "tokens.json"),
    tokens
  };
}
