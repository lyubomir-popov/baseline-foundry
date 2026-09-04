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
  source: {
    package: "@canonical/design-tokens";
    repository: string;
    commit: string;
    resolver: string;
  };
  products: Record<CanonicalProduct, ResolvedDtcgSpacing>;
}

interface CompatibilityOverlay {
  removeAfter: string;
  reason: string;
  products: Partial<Record<CanonicalProduct, Partial<ResolvedDtcgSpacing>>>;
}

export const canonicalSpacingSourceCommit = "18f57b95b1aa1dfe85a45746016b055c807d6628";
const canonicalSpacingSourceRepository = "https://github.com/canonical/design-tokens";
const canonicalSpacingResolver = "tokens/canonical/canonical.resolver.json";

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

const expectedOverlayPoints = new Set([
  "docs:spacing.inset.action.inline",
  "docs:spacing.inset.continuation.inline",
  "app:spacing.gap.mark.inline",
  "app:spacing.inset.action.inline",
  "app:spacing.inset.continuation.inline",
  "os:spacing.inset.action.inline",
  "os:spacing.inset.continuation.inline"
]);

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const defaultArtifactPath = path.resolve(moduleDir, "..", "config", "canonical-spacing.resolved.json");
const defaultOverlayPath = path.resolve(moduleDir, "..", "config", "canonical-spacing.compatibility-overlay.json");

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

function validateArtifact(value: unknown): asserts value is ResolvedDtcgSpacingArtifact {
  if (!isRecord(value) || value.format !== "canonical-resolver-apply-spacing-v1" || !isRecord(value.source) || !isRecord(value.products)) {
    throw new Error("Canonical spacing artifact has an unsupported shape.");
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
}

function validateOverlay(value: unknown): asserts value is CompatibilityOverlay {
  if (!isRecord(value) || typeof value.removeAfter !== "string" || typeof value.reason !== "string" || !isRecord(value.products)) {
    throw new Error("BF spacing compatibility overlay has an unsupported shape.");
  }
  if (value.removeAfter !== "BF 020a spacing-value adoption" || value.reason.trim() === "") {
    throw new Error("BF spacing compatibility overlay must retain its bounded 020a removal condition.");
  }

  const actualProducts = Object.keys(value.products).sort();
  const expectedProducts = ["app", "docs", "os"];
  if (JSON.stringify(actualProducts) !== JSON.stringify(expectedProducts)) {
    throw new Error("BF spacing compatibility overlay must contain exactly the docs, app, and os products with deferred values.");
  }

  const actualPoints = new Set<string>();
  for (const [product, tokens] of Object.entries(value.products)) {
    if (!(product === "site" || product === "docs" || product === "app" || product === "os") || !isRecord(tokens)) {
      throw new Error(`BF spacing compatibility overlay contains an unsupported product "${product}".`);
    }
    for (const [id, token] of Object.entries(tokens)) {
      if (!dtcgSpacingTokenIds.includes(id as DtcgSpacingTokenId)) {
        throw new Error(`BF spacing compatibility overlay contains an unsupported token "${id}".`);
      }
      validateDimensionToken(token, `${product}:${id}`);
      actualPoints.add(`${product}:${id}`);
    }
  }

  if (actualPoints.size !== expectedOverlayPoints.size || [...actualPoints].some(point => !expectedOverlayPoints.has(point))) {
    throw new Error("BF spacing compatibility overlay must contain exactly the seven approved deferred 020a points.");
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
    "spacing.gap.mark.inline": value(config.components.fieldGapBaselineUnits * config.baselineUnit),
    "spacing.gap.group.block": value(config.layout.sectionSpaceShallowBaselineUnits * config.baselineUnit),
    "spacing.gap.pattern.block": value(config.layout.sectionSpaceBaselineUnits * config.baselineUnit),
    "spacing.gap.region.block": value(config.layout.sectionSpaceDeepBaselineUnits * config.baselineUnit),
    "spacing.inset.field.inline": value(config.components.inlineInsetFieldRem),
    "spacing.inset.action.inline": value(config.components.inlineInsetActionRem),
    "spacing.inset.continuation.inline": value(config.components.inlineInsetContinuationRem),
    "spacing.inset.surface.inline": value(config.components.panelPaddingInlineBaselineUnits * config.baselineUnit),
    "spacing.inset.surface.block": value(config.components.panelPaddingBlockBaselineUnits * config.baselineUnit),
    "spacing.inset.strip.block": value(config.layout.stripSpaceBaselineUnits * config.baselineUnit)
  };
}

export async function readCanonicalSpacingProduct(
  product: CanonicalProduct,
  options: { artifactPath?: string; overlayPath?: string; applyCompatibilityOverlay?: boolean; } = {}
): Promise<ResolvedDtcgSpacing> {
  const artifact = await readJson(options.artifactPath ?? defaultArtifactPath);
  validateArtifact(artifact);
  const canonical = structuredClone(artifact.products[product]);

  if (options.applyCompatibilityOverlay === false) {
    return canonical;
  }

  const overlay = await readJson(options.overlayPath ?? defaultOverlayPath);
  validateOverlay(overlay);
  return {
    ...canonical,
    ...(overlay.products[product] ?? {})
  };
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
