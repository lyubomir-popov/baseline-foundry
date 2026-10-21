import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { BuiltInThemeName, TierName } from "./tier-registry.js";
import type { ThemeConfig } from "./types.js";

export const dtcgSpacingTokenIds = [
  "spacing.baseline",
  "spacing.gap.mark.inline",
  "spacing.gap.item.inline",
  "spacing.gap.item.block",
  "spacing.gap.group.block",
  "spacing.gap.section.block",
  "spacing.inset.action.inline",
  "spacing.inset.input.inline",
  "spacing.inset.control.block",
  "spacing.inset.surface.compact.inline",
  "spacing.inset.surface.compact.block",
  "spacing.inset.surface.standard.inline",
  "spacing.inset.surface.standard.block"
] as const;

export type DtcgSpacingTokenId = (typeof dtcgSpacingTokenIds)[number];
export type CanonicalProduct = "site" | "docs" | "app" | "os";

export const publicDtcgSpacingTokenIds = dtcgSpacingTokenIds.filter(
  id => id !== "spacing.baseline"
) as Exclude<DtcgSpacingTokenId, "spacing.baseline">[];

export interface ResolvedDtcgDimensionToken {
  $type: "dimension";
  $value: {
    value: number;
    unit: "rem";
  };
}

export type ResolvedDtcgSpacing = Record<DtcgSpacingTokenId, ResolvedDtcgDimensionToken>;

export interface ResolvedDtcgSpacingDensity {
  controlBlockDefault: ResolvedDtcgDimensionToken;
  controlBlockDense: ResolvedDtcgDimensionToken;
}

export interface ResolvedDtcgSpacingProduct {
  spacing: ResolvedDtcgSpacing;
  density: ResolvedDtcgSpacingDensity;
}

interface ProviderArtifact {
  path: string;
  sha256: string;
}

interface Spec024SpacingManifest {
  format: "spec-024-generated-css-spacing-v1";
  source: {
    repository: "canonical/DS-specs";
    commit: string;
    spec: "024-semantic-spacing-token-schema";
    status: "accepted private prototype";
  };
  provider: {
    primitives: ProviderArtifact;
    modifiers: ProviderArtifact;
    metadata: ProviderArtifact;
  };
  publicTokenIds: string[];
  externalTokenIds: ["spacing.baseline"];
  products: Record<CanonicalProduct, { selector: string; }>;
}

export const canonicalSpacingSourceCommit = "d7eaba0517800ba7461b6ca824dcd5b2c5408e5a";
const canonicalSpacingSourceRepository = "canonical/DS-specs";
const canonicalProductOrder: CanonicalProduct[] = ["site", "docs", "app", "os"];
const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const defaultArtifactPath = path.resolve(moduleDir, "..", "config", "canonical-spacing.resolved.json");

export const bfSpacingCompatibilityAliases: Record<DtcgSpacingTokenId, string> = {
  "spacing.baseline": "--bf-baseline",
  "spacing.gap.mark.inline": "--bf-leading-mark-gap",
  "spacing.gap.item.inline": "--bf-element-gap-inline",
  "spacing.gap.item.block": "--bf-field-gap",
  "spacing.gap.group.block": "--bf-section-space-shallow",
  "spacing.gap.section.block": "--bf-section-space",
  "spacing.inset.action.inline": "--bf-component-inline-inset-action",
  "spacing.inset.input.inline": "--bf-component-inline-inset-field",
  "spacing.inset.control.block": "--bf-control-block-inset",
  "spacing.inset.surface.compact.inline": "--bf-surface-compact-inset-inline",
  "spacing.inset.surface.compact.block": "--bf-surface-compact-inset-block",
  "spacing.inset.surface.standard.inline": "--bf-panel-padding-inline",
  "spacing.inset.surface.standard.block": "--bf-panel-padding-block"
};

const productByTier: Record<TierName, CanonicalProduct> = {
  editorial: "site",
  documentation: "docs",
  app: "app",
  os: "os"
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function validateProviderArtifact(value: unknown, label: string): asserts value is ProviderArtifact {
  if (!isRecord(value) || typeof value.path !== "string" || !value.path || typeof value.sha256 !== "string" || !/^[a-f0-9]{64}$/.test(value.sha256)) {
    throw new Error(`Spec 024 spacing manifest ${label} must name a relative path and SHA-256.`);
  }
  if (path.isAbsolute(value.path) || value.path.split(/[\\/]/).includes("..")) {
    throw new Error(`Spec 024 spacing manifest ${label} must stay inside config.`);
  }
}

export function validateCanonicalSpacingArtifact(value: unknown): asserts value is Spec024SpacingManifest {
  if (!isRecord(value) || value.format !== "spec-024-generated-css-spacing-v1" || !isRecord(value.source) || !isRecord(value.provider) || !isRecord(value.products)) {
    throw new Error("Spec 024 spacing manifest has an unsupported shape.");
  }
  if (
    value.source.repository !== canonicalSpacingSourceRepository ||
    value.source.commit !== canonicalSpacingSourceCommit ||
    value.source.spec !== "024-semantic-spacing-token-schema" ||
    value.source.status !== "accepted private prototype"
  ) {
    throw new Error(`Spec 024 spacing manifest must pin accepted private source ${canonicalSpacingSourceCommit}.`);
  }
  validateProviderArtifact(value.provider.primitives, "primitives");
  validateProviderArtifact(value.provider.modifiers, "modifiers");
  validateProviderArtifact(value.provider.metadata, "metadata");
  if (JSON.stringify(value.publicTokenIds) !== JSON.stringify(publicDtcgSpacingTokenIds)) {
    throw new Error("Spec 024 spacing manifest must list the twelve public semantic records in contract order.");
  }
  if (JSON.stringify(value.externalTokenIds) !== JSON.stringify(["spacing.baseline"])) {
    throw new Error("Spec 024 spacing manifest must identify baseline as the external thirteenth input.");
  }
  if (JSON.stringify(Object.keys(value.products)) !== JSON.stringify(canonicalProductOrder)) {
    throw new Error("Spec 024 spacing manifest must declare site, docs, app, and os in contract order.");
  }
  for (const product of canonicalProductOrder) {
    if (!isRecord(value.products[product]) || value.products[product].selector !== `.${product}`) {
      throw new Error(`Spec 024 spacing manifest must bind ${product} to .${product}.`);
    }
  }
}

function declarationsForSelector(css: string, selector: string): Map<string, string> {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`(?:^|\\n)\\s*${escaped}\\s*\\{([^{}]*)\\}`, "m").exec(css);
  if (!match) throw new Error(`Generated Spec 024 CSS is missing ${selector}.`);
  const declarations = new Map<string, string>();
  for (const declaration of match[1].matchAll(/^\s*(--[a-z0-9_-]+)\s*:\s*([^;]+);/gmi)) {
    declarations.set(declaration[1], declaration[2].trim());
  }
  return declarations;
}

function resolveRemProperty(properties: Map<string, string>, property: string, stack: string[] = []): number {
  if (stack.includes(property)) throw new Error(`Generated Spec 024 CSS contains a reference cycle at ${[...stack, property].join(" -> ")}.`);
  const value = properties.get(property);
  if (!value) throw new Error(`Generated Spec 024 CSS is missing ${property}.`);
  const reference = /^var\((--[a-z0-9_-]+)\)$/.exec(value);
  if (reference) return resolveRemProperty(properties, reference[1], [...stack, property]);
  const resolved = /^(\d+(?:\.\d+)?)rem$/.exec(value);
  if (!resolved) throw new Error(`Generated Spec 024 CSS ${property} must resolve to a non-negative rem value, got ${value}.`);
  return Number.parseFloat(resolved[1]);
}

function dimension(value: number): ResolvedDtcgDimensionToken {
  return { $type: "dimension", $value: { value, unit: "rem" } };
}

export function resolveCanonicalSpacingCssProduct(
  primitivesCss: string,
  modifiersCss: string,
  product: CanonicalProduct
): ResolvedDtcgSpacingProduct {
  const properties = new Map([
    ...declarationsForSelector(primitivesCss, ":root"),
    ...declarationsForSelector(modifiersCss, `.${product}`)
  ]);
  const spacing = Object.fromEntries(dtcgSpacingTokenIds.map(id => [
    id,
    dimension(resolveRemProperty(properties, dtcgSpacingCssProperty(id)))
  ])) as ResolvedDtcgSpacing;
  const density = {
    controlBlockDefault: dimension(resolveRemProperty(properties, "--_spacing-inset-control-block-default")),
    controlBlockDense: dimension(resolveRemProperty(properties, "--_spacing-inset-control-block-dense"))
  };
  if (dtcgSpacingValue(density.controlBlockDefault) !== dtcgSpacingValue(spacing["spacing.inset.control.block"])) {
    throw new Error(`Generated Spec 024 CSS ${product} default density member must equal spacing.inset.control.block.`);
  }
  return { spacing, density };
}

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await fs.readFile(filePath, "utf8")) as unknown;
}

function artifactPath(manifestPath: string, artifact: ProviderArtifact): string {
  return path.resolve(path.dirname(manifestPath), artifact.path);
}

async function readVerifiedArtifact(manifestPath: string, artifact: ProviderArtifact, label: string): Promise<string> {
  const value = await fs.readFile(artifactPath(manifestPath, artifact), "utf8");
  const actual = sha256(value);
  if (actual !== artifact.sha256) {
    throw new Error(`Spec 024 spacing ${label} provider changed: expected ${artifact.sha256}, received ${actual}.`);
  }
  return value;
}

function validatePublicMetadata(value: unknown): void {
  if (!isRecord(value)) throw new Error("Spec 024 public spacing metadata must be an object.");
  const expectedProperties = publicDtcgSpacingTokenIds.map(dtcgSpacingCssProperty).sort();
  if (JSON.stringify(Object.keys(value).sort()) !== JSON.stringify(expectedProperties)) {
    throw new Error("Spec 024 public spacing metadata must contain exactly the twelve public semantic records.");
  }
  for (const id of publicDtcgSpacingTokenIds) {
    const property = dtcgSpacingCssProperty(id);
    const record = value[property];
    if (!isRecord(record) || record.id !== id || record.cssVar !== property || record.visibility !== "public" || Object.hasOwn(record, "$value") || Object.hasOwn(record, "value")) {
      throw new Error(`Spec 024 public spacing metadata ${property} must describe ${id} without carrying a value.`);
    }
  }
}

export function canonicalProductForBuiltInTheme(name: BuiltInThemeName): CanonicalProduct {
  if (name === "prose") return "site";
  if (name === "app-tier") return "app";
  return productByTier[name];
}

export function dtcgSpacingValue(token: ResolvedDtcgDimensionToken): string {
  return `${token.$value.value}rem`;
}

export function dtcgSpacingCssProperty(id: DtcgSpacingTokenId): string {
  return `--${id.replaceAll(".", "-")}`;
}

export function legacyThemeConfigSpacing(config: ThemeConfig): ResolvedDtcgSpacingProduct {
  const baseline = config.baselineUnit;
  const inlineUnit = config.inlineUnitRem;
  const itemInline = config.components.markGapInlineUnits * inlineUnit;
  const itemBlock = config.components.fieldGapBaselineUnits * baseline;
  const actionInline = config.components.inlineInsetActionUnits * inlineUnit;
  const inputInline = config.components.inlineInsetFieldUnits * inlineUnit;
  const controlBlock = config.components.controlBlockInsetBaselineUnits * baseline;
  return {
    spacing: {
      "spacing.baseline": dimension(baseline),
      "spacing.gap.mark.inline": dimension(itemInline),
      "spacing.gap.item.inline": dimension(itemInline),
      "spacing.gap.item.block": dimension(itemBlock),
      "spacing.gap.group.block": dimension(config.layout.sectionSpaceShallowBaselineUnits * baseline),
      "spacing.gap.section.block": dimension(config.layout.sectionSpaceBaselineUnits * baseline),
      "spacing.inset.action.inline": dimension(actionInline),
      "spacing.inset.input.inline": dimension(inputInline),
      "spacing.inset.control.block": dimension(controlBlock),
      "spacing.inset.surface.compact.inline": dimension(inputInline),
      "spacing.inset.surface.compact.block": dimension(controlBlock),
      "spacing.inset.surface.standard.inline": dimension(config.components.panelPaddingInlineUnits * inlineUnit),
      "spacing.inset.surface.standard.block": dimension(config.components.panelPaddingBlockBaselineUnits * baseline)
    },
    density: {
      controlBlockDefault: dimension(controlBlock),
      controlBlockDense: dimension(config.baselineUnit / 2)
    }
  };
}

export async function readCanonicalSpacingProduct(
  product: CanonicalProduct,
  options: { artifactPath?: string; } = {}
): Promise<ResolvedDtcgSpacingProduct> {
  const manifestPath = options.artifactPath ?? defaultArtifactPath;
  const manifest = await readJson(manifestPath);
  validateCanonicalSpacingArtifact(manifest);
  const [primitivesCss, modifiersCss, metadataJson] = await Promise.all([
    readVerifiedArtifact(manifestPath, manifest.provider.primitives, "primitive CSS"),
    readVerifiedArtifact(manifestPath, manifest.provider.modifiers, "modifier CSS"),
    readVerifiedArtifact(manifestPath, manifest.provider.metadata, "public metadata")
  ]);
  validatePublicMetadata(JSON.parse(metadataJson) as unknown);
  return resolveCanonicalSpacingCssProduct(primitivesCss, modifiersCss, product);
}

export function assertSpacingSetsEqual(
  actual: ResolvedDtcgSpacing,
  expected: ResolvedDtcgSpacing,
  label: string
): void {
  for (const id of dtcgSpacingTokenIds) {
    const actualValue = dtcgSpacingValue(actual[id]);
    const expectedValue = dtcgSpacingValue(expected[id]);
    if (actualValue !== expectedValue) {
      throw new Error(`${label} changed ${id}: expected ${expectedValue}, received ${actualValue}.`);
    }
  }
}
