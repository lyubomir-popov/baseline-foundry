import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { canonicalSpacingProductsSha256, validateCanonicalSpacingArtifact } from "../../src/dtcg-spacing.ts";
import { validateThemeConfig } from "../../src/build.ts";
import type { ThemeConfig } from "../../src/types.ts";
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
  const inlineUnit = config.inlineUnitRem as number;
  const layout = config.layout as Record<string, number>;
  const components = config.components as Record<string, number>;
  return {
    "spacing.baseline": baseline,
    "spacing.gap.field.block": components.fieldGapBaselineUnits * baseline,
    "spacing.gap.mark.inline": components.markGapInlineUnits * inlineUnit,
    "spacing.gap.group.block": layout.sectionSpaceShallowBaselineUnits * baseline,
    "spacing.gap.pattern.block": layout.sectionSpaceBaselineUnits * baseline,
    "spacing.gap.region.block": layout.sectionSpaceDeepBaselineUnits * baseline,
    "spacing.inset.field.inline": components.inlineInsetFieldUnits * inlineUnit,
    "spacing.inset.action.inline": components.inlineInsetActionUnits * inlineUnit,
    "spacing.inset.continuation.inline": components.inlineInsetContinuationUnits * inlineUnit,
    "spacing.inset.surface.inline": components.panelPaddingInlineUnits * inlineUnit,
    "spacing.inset.surface.block": components.panelPaddingBlockBaselineUnits * baseline,
    "spacing.inset.strip.block": layout.stripSpaceBaselineUnits * baseline
  };
}

export async function validateDtcgSpacingContracts(
  tierArtifacts: Record<Tier, { tokens: Record<string, unknown>; css: string; }>,
  sharedEditorialCss: string,
  customThemeArtifact: { tokens: Record<string, unknown>; css: string; }
): Promise<void> {
  const artifact = JSON.parse(await fs.readFile(path.resolve("config/canonical-spacing.resolved.json"), "utf8")) as Record<string, unknown>;
  const source = artifact.source as Record<string, unknown>;
  const integrity = artifact.integrity as Record<string, unknown>;
  const products = artifact.products as Record<Product, Record<string, unknown>>;

  assert(artifact.format === "canonical-resolver-apply-spacing-v1", "Expected BF to consume the bounded resolved Canonical spacing artifact shape.");
  assert(
    integrity.algorithm === "sha256" && integrity.canonicalProducts === canonicalSpacingProductsSha256,
    "Expected the resolved artifact to carry the production-pinned digest of all 48 Canonical product values."
  );
  validateCanonicalSpacingArtifact(artifact);
  assert(
    source.package === "@canonical/design-tokens" &&
      source.repository === "https://github.com/canonical/design-tokens" &&
      source.commit === SOURCE_COMMIT &&
      source.resolver === "tokens/canonical/canonical.resolver.json",
    `Expected the resolved spacing artifact to pin the exact design-tokens ${SOURCE_COMMIT} provider and resolver.`
  );
  assert(JSON.stringify(Object.keys(products).sort()) === JSON.stringify(["app", "docs", "os", "site"]), "Expected the resolved spacing artifact to contain exactly four products.");
  assert(!existsSync(path.resolve("config/canonical-spacing.compatibility-overlay.json")), "Expected 020a to remove the temporary BF compatibility overlay file.");

  for (const [product, productTokens] of Object.entries(products) as Array<[Product, Record<string, unknown>]>) {
    for (const id of TOKEN_IDS) {
      const mutated = structuredClone(artifact);
      const mutatedProducts = mutated.products as Record<Product, Record<string, { $value: { value: number; }; }>>;
      mutatedProducts[product][id].$value.value += 0.125;
      let rejected = false;
      try {
        validateCanonicalSpacingArtifact(mutated);
      } catch {
        rejected = true;
      }
      assert(rejected, `Expected production validation to reject Canonical value drift at ${product}:${id}, including overlaid points.`);
    }
  }

  for (const [tier, product] of Object.entries(PRODUCT_BY_TIER) as Array<[Tier, Product]>) {
    const productTokens = products[product];
    assert(JSON.stringify(Object.keys(productTokens).sort()) === JSON.stringify([...TOKEN_IDS].sort()), `Expected ${product} to contain exactly the twelve approved v1 spacing IDs.`);

    const config = JSON.parse(await fs.readFile(path.resolve("config/tiers", `${tier}.json`), "utf8")) as Record<string, unknown>;
    assert(config.inlineUnitRem === 0.25, `Expected ${tier} to author the shared 0.25rem inline unit.`);
    const configComponents = config.components as Record<string, unknown>;
    for (const field of ["inlineInsetFieldUnits", "inlineInsetActionUnits", "inlineInsetContinuationUnits", "markGapInlineUnits", "panelPaddingInlineUnits"]) {
      assert(Number.isInteger(configComponents[field]) && (configComponents[field] as number) >= 0, `Expected ${tier} components.${field} to be a non-negative whole inline-unit count.`);
    }
    assert(!Object.hasOwn(configComponents, "inlineInsetFieldRem") && !Object.hasOwn(configComponents, "panelPaddingInlineBaselineUnits"), `Expected ${tier} not to retain pre-020a horizontal authoring fields.`);
    const before = legacyConfigValues(config);
    const adapted = tierArtifacts[tier].tokens.spacing as Record<string, unknown>;
    const builtCanonical = tierArtifacts[tier].tokens.canonicalSpacing as Record<string, unknown>;
    const directDeclarations = declarationsForSelector(tierArtifacts[tier].css, ":where(.bf-theme)");
    const classSelector = tier === "editorial" ? ":where(.bf-theme)" : `:where(.bf-theme.bf-tier-${tier})`;
    const classDeclarations = declarationsForSelector(sharedEditorialCss, classSelector);

    for (const id of TOKEN_IDS) {
      const canonicalValue = tokenMagnitude(productTokens[id], `Canonical ${product}:${id}`);
      assert(canonicalValue === FINAL_MATRIX[product][id], `Expected Canonical ${product}:${id} to retain the approved final matrix value.`);
      assert(before[id] === canonicalValue, `Expected authored ${tier}:${id} to equal Canonical ${canonicalValue}rem, got ${before[id]}rem.`);
      assert(tokenMagnitude(adapted[id], `built ${tier}:${id}`) === canonicalValue, `Expected effective ${tier}:${id} to equal Canonical ${canonicalValue}rem.`);
      assert(tokenMagnitude(builtCanonical[id], `built canonical ${tier}:${id}`) === canonicalValue, `Expected built Canonical ${tier}:${id} to equal effective spacing.`);

      const property = cssProperty(id);
      const canonicalLiteral = `${FINAL_MATRIX[product][id]}rem`;
      assert(JSON.stringify(directDeclarations.get(property)) === JSON.stringify([canonicalLiteral]), `Expected direct ${tier} ${property} to have one final-matrix ${canonicalLiteral} owner.`);
      assert(JSON.stringify(directDeclarations.get(BF_ALIASES[id])) === JSON.stringify([`var(${property})`]), `Expected direct ${tier} ${BF_ALIASES[id]} to alias Canonical after 020a.`);
      assert(JSON.stringify(classDeclarations.get(property)) === JSON.stringify([canonicalLiteral]), `Expected class-switched ${tier} ${property} to have one final-matrix ${canonicalLiteral} owner.`);
      assert(JSON.stringify(classDeclarations.get(BF_ALIASES[id])) === JSON.stringify([`var(${property})`]), `Expected class-switched ${tier} ${BF_ALIASES[id]} to alias Canonical after 020a.`);
    }
    assert(JSON.stringify(adapted) === JSON.stringify(builtCanonical), `Expected effective and canonical spacing records to be identical after 020a for ${tier}.`);
  }

  const validConfig = JSON.parse(await fs.readFile(path.resolve("config/tiers/editorial.json"), "utf8")) as ThemeConfig;
  const invalidCases: Array<[string, (config: ThemeConfig) => void]> = [
    ["missing inline unit", config => { delete (config as Partial<ThemeConfig>).inlineUnitRem; }],
    ["non-finite inline unit", config => { config.inlineUnitRem = Number.NaN; }],
    ["negative inline count", config => { config.components.markGapInlineUnits = -1; }],
    ["fractional inline count", config => { config.components.inlineInsetActionUnits = 3.5; }],
    ["misordered inline insets", config => { config.components.inlineInsetFieldUnits = config.components.inlineInsetActionUnits + 1; }],
    ["continuation fit", config => { config.components.inlineInsetContinuationUnits = 5; }]
  ];
  for (const [label, mutate] of invalidCases) {
    const invalid = structuredClone(validConfig);
    mutate(invalid);
    let rejected = false;
    try {
      validateThemeConfig(invalid);
    } catch {
      rejected = true;
    }
    assert(rejected, `Expected config validation to reject ${label}.`);
  }

  assert(!Object.hasOwn(customThemeArtifact.tokens, "canonicalSpacing"), "Expected a BF-local custom theme not to claim a Canonical spacing record.");
  const customDeclarations = declarationsForSelector(customThemeArtifact.css, ":where(.bf-theme)");
  const customSpacing = customThemeArtifact.tokens.spacing as Record<string, unknown>;
  for (const id of TOKEN_IDS) {
    assert(!customDeclarations.has(cssProperty(id)), `Expected custom themes not to publish unnamespaced Canonical property ${cssProperty(id)}.`);
    assert(
      JSON.stringify(customDeclarations.get(BF_ALIASES[id])) === JSON.stringify([`${tokenMagnitude(customSpacing[id], `custom ${id}`)}rem`]),
      `Expected custom themes to retain ${BF_ALIASES[id]} as a BF-owned literal.`
    );
  }

  const osTokens = products.os;
  assert(Object.keys(osTokens).every(id => id.startsWith("spacing.")), "Expected the OS adapter input to remain spacing-only and not assume a Canonical .os typography reset.");
  const osClassDeclarations = declarationsForSelector(sharedEditorialCss, ":where(.bf-theme.bf-tier-os)");
  assert(osClassDeclarations.has("--spacing-baseline"), "Expected BF's OS class surface to receive its spacing contract explicitly despite Canonical's intentionally omitted identical .os typography reset.");
}
