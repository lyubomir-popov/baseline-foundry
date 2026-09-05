import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { BuiltInThemeName, TierName } from "./tier-registry.js";
import type { ThemeConfig } from "./types.js";

export const dtcgSpacingTokenIds = [
  "spacing.baseline",
  "spacing.gap.field.block",
  "spacing.gap.mark.inline",
  "spacing.gap.group.block",
  "spacing.gap.pattern.block",
  "spacing.gap.region.block",
  "spacing.inset.field.inline",
  "spacing.inset.action.inline",
  "spacing.inset.continuation.inline",
  "spacing.inset.surface.inline",
  "spacing.inset.surface.block",
  "spacing.inset.strip.block"
] as const;

export type DtcgSpacingTokenId = (typeof dtcgSpacingTokenIds)[number];
export type CanonicalProduct = "site" | "docs" | "app" | "os";

export interface ResolvedDtcgDimensionToken {
  $type: "dimension";
  $value: {
    value: number;
    unit: "rem";
  };
}

export type ResolvedDtcgSpacing = Record<DtcgSpacingTokenId, ResolvedDtcgDimensionToken>;

interface ResolvedDtcgSpacingArtifact {
  format: "canonical-resolver-apply-spacing-v1";
  integrity: {
    algorithm: "sha256";
    canonicalProducts: string;
  };
  source: {
    package: "@canonical/design-tokens";
    repository: string;
    commit: string;
    resolver: string;
  };
  products: Record<CanonicalProduct, ResolvedDtcgSpacing>;
}

export const canonicalSpacingSourceCommit = "18f57b95b1aa1dfe85a45746016b055c807d6628";
export const canonicalSpacingProductsSha256 = "97cffe22691cebbe29d786d2fbe10d04d014d412ed35ccaca386ca41e73bd571";
const canonicalSpacingSourceRepository = "https://github.com/canonical/design-tokens";
const canonicalSpacingResolver = "tokens/canonical/canonical.resolver.json";
const canonicalProductOrder: CanonicalProduct[] = ["site", "docs", "app", "os"];

export const bfSpacingCompatibilityAliases: Record<DtcgSpacingTokenId, string> = {
  "spacing.baseline": "--bf-baseline",
  "spacing.gap.field.block": "--bf-field-gap",
  "spacing.gap.mark.inline": "--bf-leading-mark-gap",
  "spacing.gap.group.block": "--bf-section-space-shallow",
  "spacing.gap.pattern.block": "--bf-section-space",
  "spacing.gap.region.block": "--bf-section-space-deep",
  "spacing.inset.field.inline": "--bf-component-inline-inset-field",
  "spacing.inset.action.inline": "--bf-component-inline-inset-action",
  "spacing.inset.continuation.inline": "--bf-component-inline-inset-continuation",
  "spacing.inset.surface.inline": "--bf-panel-padding-inline",
  "spacing.inset.surface.block": "--bf-panel-padding-block",
  "spacing.inset.strip.block": "--bf-strip-space"
};

const productByTier: Record<TierName, CanonicalProduct> = {
  editorial: "site",
  documentation: "docs",
  app: "app",
  os: "os"
};

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const defaultArtifactPath = path.resolve(moduleDir, "..", "config", "canonical-spacing.resolved.json");

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateDimensionToken(value: unknown, location: string): asserts value is ResolvedDtcgDimensionToken {
  if (!isRecord(value) || value.$type !== "dimension" || !isRecord(value.$value)) {
    throw new Error(`Resolved spacing token "${location}" must use the DTCG dimension token shape.`);
  }

  const magnitude = value.$value.value;
  if (typeof magnitude !== "number" || !Number.isFinite(magnitude) || magnitude < 0 || value.$value.unit !== "rem") {
    throw new Error(`Resolved spacing token "${location}" must contain a finite non-negative rem value.`);
  }
}

function validateTokenSet(value: unknown, location: string): asserts value is ResolvedDtcgSpacing {
  if (!isRecord(value)) {
    throw new Error(`Resolved spacing product "${location}" must be an object.`);
  }

  const actualIds = Object.keys(value).sort();
  const expectedIds = [...dtcgSpacingTokenIds].sort();
  if (JSON.stringify(actualIds) !== JSON.stringify(expectedIds)) {
    throw new Error(`Resolved spacing product "${location}" must contain exactly the twelve approved v1 token IDs.`);
  }

  for (const id of dtcgSpacingTokenIds) {
    validateDimensionToken(value[id], `${location}:${id}`);
  }
}

function canonicalProductsDigest(products: Record<CanonicalProduct, ResolvedDtcgSpacing>): string {
  const payload = JSON.stringify(canonicalProductOrder.map(product => [
    product,
    dtcgSpacingTokenIds.map(id => [
      id,
      products[product][id].$type,
      products[product][id].$value.value,
      products[product][id].$value.unit
    ])
  ]));
  return createHash("sha256").update(payload).digest("hex");
}

export function validateCanonicalSpacingArtifact(value: unknown): asserts value is ResolvedDtcgSpacingArtifact {
  if (
    !isRecord(value) ||
    value.format !== "canonical-resolver-apply-spacing-v1" ||
    !isRecord(value.integrity) ||
    !isRecord(value.source) ||
    !isRecord(value.products)
  ) {
    throw new Error("Canonical spacing artifact has an unsupported shape.");
  }
  if (
    value.integrity.algorithm !== "sha256" ||
    value.integrity.canonicalProducts !== canonicalSpacingProductsSha256
  ) {
    throw new Error(`Canonical spacing artifact must declare product digest ${canonicalSpacingProductsSha256}.`);
  }
  if (
    value.source.package !== "@canonical/design-tokens" ||
    value.source.repository !== canonicalSpacingSourceRepository ||
    value.source.commit !== canonicalSpacingSourceCommit ||
    value.source.resolver !== canonicalSpacingResolver
  ) {
    throw new Error(`Canonical spacing artifact must pin design-tokens ${canonicalSpacingSourceCommit}.`);
  }

  const actualProducts = Object.keys(value.products).sort();
  const expectedProducts = ["app", "docs", "os", "site"];
  if (JSON.stringify(actualProducts) !== JSON.stringify(expectedProducts)) {
    throw new Error("Canonical spacing artifact must contain exactly site, docs, app, and os products.");
  }

  for (const product of expectedProducts as CanonicalProduct[]) {
    validateTokenSet(value.products[product], product);
  }

  const actualDigest = canonicalProductsDigest(value.products as Record<CanonicalProduct, ResolvedDtcgSpacing>);
  if (actualDigest !== canonicalSpacingProductsSha256) {
    throw new Error(`Canonical spacing artifact product digest changed: expected ${canonicalSpacingProductsSha256}, received ${actualDigest}.`);
  }
}

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await fs.readFile(filePath, "utf8")) as unknown;
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

export function legacyThemeConfigSpacing(config: ThemeConfig): ResolvedDtcgSpacing {
  const value = (magnitude: number): ResolvedDtcgDimensionToken => ({
    $type: "dimension",
    $value: { value: magnitude, unit: "rem" }
  });

  return {
    "spacing.baseline": value(config.baselineUnit),
    "spacing.gap.field.block": value(config.components.fieldGapBaselineUnits * config.baselineUnit),
    "spacing.gap.mark.inline": value(config.components.markGapInlineUnits * config.inlineUnitRem),
    "spacing.gap.group.block": value(config.layout.sectionSpaceShallowBaselineUnits * config.baselineUnit),
    "spacing.gap.pattern.block": value(config.layout.sectionSpaceBaselineUnits * config.baselineUnit),
    "spacing.gap.region.block": value(config.layout.sectionSpaceDeepBaselineUnits * config.baselineUnit),
    "spacing.inset.field.inline": value(config.components.inlineInsetFieldUnits * config.inlineUnitRem),
    "spacing.inset.action.inline": value(config.components.inlineInsetActionUnits * config.inlineUnitRem),
    "spacing.inset.continuation.inline": value(config.components.inlineInsetContinuationUnits * config.inlineUnitRem),
    "spacing.inset.surface.inline": value(config.components.panelPaddingInlineUnits * config.inlineUnitRem),
    "spacing.inset.surface.block": value(config.components.panelPaddingBlockBaselineUnits * config.baselineUnit),
    "spacing.inset.strip.block": value(config.layout.stripSpaceBaselineUnits * config.baselineUnit)
  };
}

export async function readCanonicalSpacingProduct(
  product: CanonicalProduct,
  options: { artifactPath?: string; } = {}
): Promise<ResolvedDtcgSpacing> {
  const artifact = await readJson(options.artifactPath ?? defaultArtifactPath);
  validateCanonicalSpacingArtifact(artifact);
  return structuredClone(artifact.products[product]);
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
