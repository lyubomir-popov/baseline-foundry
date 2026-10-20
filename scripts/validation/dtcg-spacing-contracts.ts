import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { buildThemeFromConfig } from "../../src/build.ts";
import { createSpacingProviderProbeOption } from "../../src/internal/spacing-provider-probe.ts";
import {
  assertSpacingSetsEqual,
  bfSpacingCompatibilityAliases,
  canonicalProductForBuiltInTheme,
  dtcgSpacingCssProperty,
  dtcgSpacingTokenIds,
  dtcgSpacingValue,
  legacyThemeConfigSpacing,
  readCanonicalSpacingProduct,
  validateCanonicalSpacingArtifact,
  type CanonicalProduct,
  type ResolvedDtcgSpacing
} from "../../src/dtcg-spacing.ts";
import type { ThemeConfig } from "../../src/types.ts";
import { parseCss } from "../css-ast-helpers.ts";
import { assert } from "../validation-assert.ts";

type Tier = "editorial" | "documentation" | "app" | "os";

const PRODUCT_BY_TIER: Record<Tier, CanonicalProduct> = {
  editorial: "site",
  documentation: "docs",
  app: "app",
  os: "os"
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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

function tokenMagnitude(spacing: ResolvedDtcgSpacing, id: keyof ResolvedDtcgSpacing): number {
  return spacing[id].$value.value;
}

async function validateProviderBindingProbe(): Promise<void> {
  const temporaryRoot = await fs.mkdtemp(path.resolve("generated/bf-spacing-provider-"));
  try {
    const providerDir = path.join(temporaryRoot, "spec-024-spacing");
    await fs.cp(path.resolve("config/spec-024-spacing"), providerDir, { recursive: true });
    const sourceManifest = JSON.parse(await fs.readFile(path.resolve("config/canonical-spacing.resolved.json"), "utf8")) as Record<string, unknown>;
    const manifest = structuredClone(sourceManifest);
    const modifiersPath = path.join(providerDir, "modifiers.spacing.css");
    const modifiers = await fs.readFile(modifiersPath, "utf8");
    const siteStart = modifiers.indexOf("  .site {");
    const siteEnd = modifiers.indexOf("\n  .os {", siteStart);
    assert(siteStart >= 0 && siteEnd > siteStart, "Expected the temporary provider copy to contain a bounded Site rule.");
    const siteRule = modifiers.slice(siteStart, siteEnd);
    const mutatedSiteRule = siteRule.replace(
      "    --spacing-gap-mark-inline: var(--dimension-100);",
      "    --spacing-gap-mark-inline: var(--dimension-150);"
    );
    assert(mutatedSiteRule !== siteRule, "Expected the provider probe to mutate only Site mark gap in its temporary copy.");
    const mutatedModifiers = `${modifiers.slice(0, siteStart)}${mutatedSiteRule}${modifiers.slice(siteEnd)}`;
    await fs.writeFile(modifiersPath, mutatedModifiers, "utf8");
    const provider = manifest.provider;
    assert(isRecord(provider) && isRecord(provider.modifiers), "Expected the provider manifest to expose modifier integrity metadata.");
    provider.modifiers.sha256 = createHash("sha256").update(mutatedModifiers).digest("hex");
    const manifestPath = path.join(temporaryRoot, "canonical-spacing.resolved.json");
    await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    const result = await buildThemeFromConfig(path.resolve("config/tiers/editorial.json"), {
      distDir: path.join(temporaryRoot, "dist"),
      baselineDir: path.join(temporaryRoot, "baseline"),
      ...createSpacingProviderProbeOption(manifestPath)
    });
    const root = declarationsForSelector(result.css, ":where(.bf-theme)");
    const switchConsumer = declarationsForSelector(result.css, ":where(.bf-theme) :where(.bf-switch)");
    const accordionConsumer = declarationsForSelector(result.css, ":where(.bf-theme) :where(.bf-accordion-panel)");
    assert(
      tokenMagnitude(result.tokens.spacing, "spacing.gap.mark.inline") === 0.75 &&
      JSON.stringify(root.get("--spacing-gap-mark-inline")) === JSON.stringify(["0.75rem"]) &&
      JSON.stringify(root.get("--bf-leading-mark-gap")) === JSON.stringify(["var(--spacing-gap-mark-inline)"]) &&
      JSON.stringify(switchConsumer.get("gap")) === JSON.stringify(["var(--bf-leading-mark-gap)"]),
      "Expected a temporary generated-provider mutation to reach the real BF Switch gap consumer through its direct alias binding."
    );
    assert(
      result.tokens.components.inlineInsetContinuation === "2.25rem" &&
      JSON.stringify(root.get("--bf-component-inline-inset-continuation")) === JSON.stringify(["2.25rem"]) &&
      JSON.stringify(accordionConsumer.get("padding-inline-start")) === JSON.stringify(["var(--bf-component-inline-inset-continuation)"]),
      "Expected the mutated semantic mark gap to change the BF-derived continuation inset and its Accordion consumer."
    );
  } finally {
    await fs.rm(temporaryRoot, { recursive: true, force: true });
  }
}

export async function validateDtcgSpacingContracts(
  tierArtifacts: Record<Tier, { tokens: Record<string, unknown>; css: string; }>,
  sharedEditorialCss: string,
  customThemeArtifact: { tokens: Record<string, unknown>; css: string; }
): Promise<void> {
  const manifest = JSON.parse(await fs.readFile(path.resolve("config/canonical-spacing.resolved.json"), "utf8")) as unknown;
  validateCanonicalSpacingArtifact(manifest);
  assert(!JSON.stringify(manifest).includes("$value"), "Expected the BF spacing manifest to contain provider metadata only, with no authored value matrix.");

  for (const [tier, product] of Object.entries(PRODUCT_BY_TIER) as Array<[Tier, CanonicalProduct]>) {
    const config = JSON.parse(await fs.readFile(path.resolve("config/tiers", `${tier}.json`), "utf8")) as ThemeConfig;
    const legacy = legacyThemeConfigSpacing(config);
    const provider = await readCanonicalSpacingProduct(product);
    assertSpacingSetsEqual(provider.spacing, legacy.spacing, `Spec 024 ${product} provider geometry`);
    assert(
      dtcgSpacingValue(provider.density.controlBlockDefault) === dtcgSpacingValue(legacy.density.controlBlockDefault) &&
      dtcgSpacingValue(provider.density.controlBlockDense) === (tier === "os" ? "0rem" : "0.25rem"),
      `Expected ${product} default/dense control members to preserve the accepted BF table geometry.`
    );

    const builtSpacing = tierArtifacts[tier].tokens.spacing as ResolvedDtcgSpacing;
    const builtCanonical = tierArtifacts[tier].tokens.canonicalSpacing as ResolvedDtcgSpacing;
    assert(JSON.stringify(builtSpacing) === JSON.stringify(provider.spacing), `Expected built ${tier} spacing to come from the generated provider.`);
    assert(JSON.stringify(builtCanonical) === JSON.stringify(provider.spacing), `Expected built ${tier} canonical spacing to retain the provider record.`);
    assert(JSON.stringify(tierArtifacts[tier].tokens.spacingDensity) === JSON.stringify(provider.density), `Expected built ${tier} density members to come from the generated provider.`);

    const direct = declarationsForSelector(tierArtifacts[tier].css, ":where(.bf-theme)");
    const scopedSelector = tier === "editorial" ? ":where(.bf-theme)" : `:where(.bf-theme.bf-tier-${tier})`;
    const scoped = declarationsForSelector(sharedEditorialCss, scopedSelector);
    for (const id of dtcgSpacingTokenIds) {
      const property = dtcgSpacingCssProperty(id);
      const value = dtcgSpacingValue(provider.spacing[id]);
      const alias = bfSpacingCompatibilityAliases[id];
      assert(JSON.stringify(direct.get(property)) === JSON.stringify([value]), `Expected direct ${tier} ${property} to equal provider ${value}.`);
      assert(JSON.stringify(direct.get(alias)) === JSON.stringify([`var(${property})`]), `Expected direct ${tier} ${alias} to bind ${property}.`);
      assert(JSON.stringify(scoped.get(property)) === JSON.stringify([value]), `Expected scoped ${tier} ${property} to equal provider ${value}.`);
      assert(JSON.stringify(scoped.get(alias)) === JSON.stringify([`var(${property})`]), `Expected scoped ${tier} ${alias} to bind ${property}.`);
    }
    const expectedDefault = dtcgSpacingValue(provider.density.controlBlockDefault);
    const expectedDense = dtcgSpacingValue(provider.density.controlBlockDense);
    for (const declarations of [direct, scoped]) {
      assert(JSON.stringify(declarations.get("--_spacing-inset-control-block-default")) === JSON.stringify([expectedDefault]), `Expected ${tier} provider default member ${expectedDefault}.`);
      assert(JSON.stringify(declarations.get("--_spacing-inset-control-block-dense")) === JSON.stringify([expectedDense]), `Expected ${tier} provider dense member ${expectedDense}.`);
      assert(JSON.stringify(declarations.get("--bf-control-block-inset-comfortable")) === JSON.stringify(["var(--_spacing-inset-control-block-default)"]), `Expected ${tier} comfortable table member to bind the provider default.`);
      assert(JSON.stringify(declarations.get("--bf-control-block-inset-dense")) === JSON.stringify(["var(--_spacing-inset-control-block-dense)"]), `Expected ${tier} dense table member to bind the provider member.`);
    }

    const layout = tierArtifacts[tier].tokens.layout as Record<string, unknown>;
    const components = tierArtifacts[tier].tokens.components as Record<string, unknown>;
    const bodyIdentifier = config.roles.body;
    const body = config.elements.find(element => element.identifier === bodyIdentifier);
    assert(body, `Expected ${tier} body config while checking preserved BF-owned geometry.`);
    const continuation = tokenMagnitude(provider.spacing, "spacing.inset.input.inline") + body.fontSize + tokenMagnitude(provider.spacing, "spacing.gap.mark.inline");
    assert(layout.sectionSpaceDeep === `${config.layout.sectionSpaceDeepBaselineUnits * config.baselineUnit}rem`, `Expected ${tier} deep layout gap to remain BF-owned.`);
    assert(layout.stripSpace === `${config.layout.stripSpaceBaselineUnits * config.baselineUnit}rem`, `Expected ${tier} strip inset to remain BF-owned.`);
    assert(components.inlineInsetContinuation === `${continuation}rem`, `Expected ${tier} continuation inset to remain BF-derived.`);
  }

  assert(!Object.hasOwn(customThemeArtifact.tokens, "canonicalSpacing"), "Expected a BF-local custom theme not to claim Spec 024 spacing provenance.");
  const customDeclarations = declarationsForSelector(customThemeArtifact.css, ":where(.bf-theme)");
  const customSpacing = customThemeArtifact.tokens.spacing as ResolvedDtcgSpacing;
  for (const id of dtcgSpacingTokenIds) {
    const property = dtcgSpacingCssProperty(id);
    const alias = bfSpacingCompatibilityAliases[id];
    assert(!customDeclarations.has(property), `Expected custom themes not to publish unnamespaced semantic property ${property}.`);
    assert(JSON.stringify(customDeclarations.get(alias)) === JSON.stringify([dtcgSpacingValue(customSpacing[id])]), `Expected custom ${alias} to remain BF-owned.`);
  }

  assert(canonicalProductForBuiltInTheme("editorial") === "site", "Expected Editorial to bind the Site provider product.");
  await validateProviderBindingProbe();
}
