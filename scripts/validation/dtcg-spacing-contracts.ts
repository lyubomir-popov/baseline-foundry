import fs from "node:fs/promises";
import path from "node:path";
import { parseCss } from "../css-ast-helpers.ts";
import { assert } from "../validation-assert.ts";

const SOURCE_COMMIT = "18f57b95b1aa1dfe85a45746016b055c807d6628";
const TOKEN_IDS = [
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
type TokenId = (typeof TOKEN_IDS)[number];
type Product = "site" | "docs" | "app" | "os";
type Tier = "editorial" | "documentation" | "app" | "os";
type Matrix = Record<Product, Record<TokenId, number>>;

const PRODUCT_BY_TIER: Record<Tier, Product> = {
  editorial: "site",
  documentation: "docs",
  app: "app",
  os: "os"
};

const FINAL_MATRIX: Matrix = {
  site: {
    "spacing.baseline": 0.5,
    "spacing.gap.field.block": 0.5,
    "spacing.gap.mark.inline": 0.5,
    "spacing.gap.group.block": 1.5,
    "spacing.gap.pattern.block": 4,
    "spacing.gap.region.block": 8,
    "spacing.inset.field.inline": 0.5,
    "spacing.inset.action.inline": 1,
    "spacing.inset.continuation.inline": 2,
    "spacing.inset.surface.inline": 1,
    "spacing.inset.surface.block": 1,
    "spacing.inset.strip.block": 4
  },
  docs: {
    "spacing.baseline": 0.25,
    "spacing.gap.field.block": 0.5,
    "spacing.gap.mark.inline": 0.5,
    "spacing.gap.group.block": 1.5,
    "spacing.gap.pattern.block": 3,
    "spacing.gap.region.block": 6,
    "spacing.inset.field.inline": 0.5,
    "spacing.inset.action.inline": 0.75,
    "spacing.inset.continuation.inline": 1.5,
    "spacing.inset.surface.inline": 1,
    "spacing.inset.surface.block": 1,
    "spacing.inset.strip.block": 3
  },
  app: {
    "spacing.baseline": 0.25,
    "spacing.gap.field.block": 0.5,
    "spacing.gap.mark.inline": 0.25,
    "spacing.gap.group.block": 0.5,
    "spacing.gap.pattern.block": 1,
    "spacing.gap.region.block": 2,
    "spacing.inset.field.inline": 0.25,
    "spacing.inset.action.inline": 0.75,
    "spacing.inset.continuation.inline": 1.5,
    "spacing.inset.surface.inline": 0.75,
    "spacing.inset.surface.block": 0.75,
    "spacing.inset.strip.block": 3
  },
  os: {
    "spacing.baseline": 0.25,
    "spacing.gap.field.block": 0.25,
    "spacing.gap.mark.inline": 0.25,
    "spacing.gap.group.block": 1.5,
    "spacing.gap.pattern.block": 3,
    "spacing.gap.region.block": 6,
    "spacing.inset.field.inline": 0.25,
    "spacing.inset.action.inline": 0.5,
    "spacing.inset.continuation.inline": 1.25,
    "spacing.inset.surface.inline": 0.5,
    "spacing.inset.surface.block": 0.5,
    "spacing.inset.strip.block": 2
  }
};

const CURRENT_MATRIX: Matrix = {
  ...FINAL_MATRIX,
  docs: {
    ...FINAL_MATRIX.docs,
    "spacing.inset.action.inline": 1,
    "spacing.inset.continuation.inline": 2
  },
  app: {
    ...FINAL_MATRIX.app,
    "spacing.gap.mark.inline": 0.5,
    "spacing.inset.action.inline": 1,
    "spacing.inset.continuation.inline": 2
  },
  os: {
    ...FINAL_MATRIX.os,
    "spacing.inset.action.inline": 1,
    "spacing.inset.continuation.inline": 2
  }
};

const BF_ALIASES: Record<TokenId, string> = {
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

const DEFERRED_POINTS = [
  "docs:spacing.inset.action.inline",
  "docs:spacing.inset.continuation.inline",
  "app:spacing.gap.mark.inline",
  "app:spacing.inset.action.inline",
  "app:spacing.inset.continuation.inline",
  "os:spacing.inset.action.inline",
  "os:spacing.inset.continuation.inline"
].sort();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function tokenMagnitude(value: unknown, label: string): number {
  assert(isRecord(value) && value.$type === "dimension" && isRecord(value.$value), `Expected ${label} to retain the resolved DTCG dimension shape.`);
  const magnitude = value.$value.value;
  assert(typeof magnitude === "number" && Number.isFinite(magnitude) && value.$value.unit === "rem", `Expected ${label} to expose a finite rem value.`);
  return magnitude;
}

function cssProperty(id: TokenId): string {
  return `--${id.replaceAll(".", "-")}`;
}

function declarationsForSelector(css: string, selector: string): Map<string, string[]> {
  const declarations = new Map<string, string[]>();
  parseCss(css).each(node => {
    if (node.type !== "rule" || node.selector !== selector) return;
    node.walkDecls(declaration => {
      declarations.set(declaration.prop, [...(declarations.get(declaration.prop) ?? []), declaration.value]);
    });
  });
  return declarations;
}

function legacyConfigValues(config: Record<string, unknown>): Record<TokenId, number> {
  const baseline = config.baselineUnit as number;
  const layout = config.layout as Record<string, number>;
  const components = config.components as Record<string, number>;
  return {
    "spacing.baseline": baseline,
    "spacing.gap.field.block": components.fieldGapBaselineUnits * baseline,
    "spacing.gap.mark.inline": components.fieldGapBaselineUnits * baseline,
    "spacing.gap.group.block": layout.sectionSpaceShallowBaselineUnits * baseline,
    "spacing.gap.pattern.block": layout.sectionSpaceBaselineUnits * baseline,
    "spacing.gap.region.block": layout.sectionSpaceDeepBaselineUnits * baseline,
    "spacing.inset.field.inline": components.inlineInsetFieldRem,
    "spacing.inset.action.inline": components.inlineInsetActionRem,
    "spacing.inset.continuation.inline": components.inlineInsetContinuationRem,
    "spacing.inset.surface.inline": components.panelPaddingInlineBaselineUnits * baseline,
    "spacing.inset.surface.block": components.panelPaddingBlockBaselineUnits * baseline,
    "spacing.inset.strip.block": layout.stripSpaceBaselineUnits * baseline
  };
}

export async function validateDtcgSpacingContracts(
  tierArtifacts: Record<Tier, { tokens: Record<string, unknown>; css: string; }>,
  sharedEditorialCss: string
): Promise<void> {
  const artifact = JSON.parse(await fs.readFile(path.resolve("config/canonical-spacing.resolved.json"), "utf8")) as Record<string, unknown>;
  const overlay = JSON.parse(await fs.readFile(path.resolve("config/canonical-spacing.compatibility-overlay.json"), "utf8")) as Record<string, unknown>;
  const source = artifact.source as Record<string, unknown>;
  const products = artifact.products as Record<Product, Record<string, unknown>>;
  const overlayProducts = overlay.products as Partial<Record<Product, Record<string, unknown>>>;

  assert(artifact.format === "canonical-resolver-apply-spacing-v1", "Expected BF to consume the bounded resolved Canonical spacing artifact shape.");
  assert(
    source.package === "@canonical/design-tokens" &&
      source.repository === "https://github.com/canonical/design-tokens" &&
      source.commit === SOURCE_COMMIT &&
      source.resolver === "tokens/canonical/canonical.resolver.json",
    `Expected the resolved spacing artifact to pin the exact design-tokens ${SOURCE_COMMIT} provider and resolver.`
  );
  assert(JSON.stringify(Object.keys(products).sort()) === JSON.stringify(["app", "docs", "os", "site"]), "Expected the resolved spacing artifact to contain exactly four products.");
  assert(overlay.removeAfter === "BF 020a spacing-value adoption", "Expected the temporary BF compatibility overlay to retain its explicit 020a removal bound.");
  assert(JSON.stringify(Object.keys(overlayProducts).sort()) === JSON.stringify(["app", "docs", "os"]), "Expected the temporary BF compatibility overlay to contain only products with deferred values.");

  const actualOverlayPoints = Object.entries(overlayProducts).flatMap(([product, tokens]) =>
    Object.keys(tokens ?? {}).map(id => `${product}:${id}`)
  ).sort();
  assert(JSON.stringify(actualOverlayPoints) === JSON.stringify(DEFERRED_POINTS), "Expected the BF-local compatibility overlay to contain exactly the seven deferred 020a points.");

  for (const [tier, product] of Object.entries(PRODUCT_BY_TIER) as Array<[Tier, Product]>) {
    const productTokens = products[product];
    assert(JSON.stringify(Object.keys(productTokens).sort()) === JSON.stringify([...TOKEN_IDS].sort()), `Expected ${product} to contain exactly the twelve approved v1 spacing IDs.`);

    const config = JSON.parse(await fs.readFile(path.resolve("config/tiers", `${tier}.json`), "utf8")) as Record<string, unknown>;
    const before = legacyConfigValues(config);
    const adapted = tierArtifacts[tier].tokens.spacing as Record<string, unknown>;
    const directDeclarations = declarationsForSelector(tierArtifacts[tier].css, ":where(.bf-theme)");
    const classSelector = tier === "editorial" ? ":where(.bf-theme)" : `:where(.bf-theme.bf-tier-${tier})`;
    const classDeclarations = declarationsForSelector(sharedEditorialCss, classSelector);

    for (const id of TOKEN_IDS) {
      const canonicalValue = tokenMagnitude(productTokens[id], `Canonical ${product}:${id}`);
      const overlayValue = overlayProducts[product]?.[id];
      const expectedCurrent = CURRENT_MATRIX[product][id];
      assert(canonicalValue === FINAL_MATRIX[product][id], `Expected Canonical ${product}:${id} to retain the approved final matrix value.`);
      assert(before[id] === expectedCurrent, `Expected pre-adapter ${tier}:${id} to equal ${expectedCurrent}rem, got ${before[id]}rem.`);
      assert((overlayValue ? tokenMagnitude(overlayValue, `overlay ${product}:${id}`) : canonicalValue) === expectedCurrent, `Expected overlaid ${product}:${id} to preserve ${expectedCurrent}rem.`);
      assert(tokenMagnitude(adapted[id], `built ${tier}:${id}`) === expectedCurrent, `Expected post-adapter ${tier}:${id} to preserve ${expectedCurrent}rem.`);

      const property = cssProperty(id);
      const expectedLiteral = `${expectedCurrent}rem`;
      assert(JSON.stringify(directDeclarations.get(property)) === JSON.stringify([expectedLiteral]), `Expected direct ${tier} ${property} to have one ${expectedLiteral} owner.`);
      assert(JSON.stringify(directDeclarations.get(BF_ALIASES[id])) === JSON.stringify([`var(${property})`]), `Expected direct ${tier} ${BF_ALIASES[id]} to be only a compatibility alias to ${property}.`);
      assert(JSON.stringify(classDeclarations.get(property)) === JSON.stringify([expectedLiteral]), `Expected class-switched ${tier} ${property} to have one ${expectedLiteral} owner.`);
      assert(JSON.stringify(classDeclarations.get(BF_ALIASES[id])) === JSON.stringify([`var(${property})`]), `Expected class-switched ${tier} ${BF_ALIASES[id]} to alias ${property}.`);
    }
  }

  const canonicalDifferences = (Object.entries(PRODUCT_BY_TIER) as Array<[Tier, Product]>).flatMap(([, product]) =>
    TOKEN_IDS.filter(id => FINAL_MATRIX[product][id] !== CURRENT_MATRIX[product][id]).map(id => `${product}:${id}`)
  ).sort();
  assert(JSON.stringify(canonicalDifferences) === JSON.stringify(DEFERRED_POINTS), "Expected exactly seven Canonical/BF value differences before 020a.");

  const osTokens = products.os;
  assert(Object.keys(osTokens).every(id => id.startsWith("spacing.")), "Expected the OS adapter input to remain spacing-only and not assume a Canonical .os typography reset.");
  const osClassDeclarations = declarationsForSelector(sharedEditorialCss, ":where(.bf-theme.bf-tier-os)");
  assert(osClassDeclarations.has("--spacing-baseline"), "Expected BF's OS class surface to receive its spacing contract explicitly despite Canonical's intentionally omitted identical .os typography reset.");
}
