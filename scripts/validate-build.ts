import fs from "node:fs/promises";
import path from "node:path";
import { BASELINE_GRID_DARK_THEME_COLOR, BASELINE_GRID_DEFAULT_COLOR, BASELINE_GRID_LIGHT_THEME_COLOR } from "../src/baseline-grid-theme.js";
import { tierNames } from "../src/presets.ts";
import { componentPages } from "./component-demo-shared.ts";
import { assert, getCheckCount } from "./validation-assert.ts";
import { parseCss, assertRuleHasDecl } from "./css-ast-helpers.ts";

function runInvariant(name: string, fn: () => void): void {
  const before = getCheckCount();
  fn();
  const ran = getCheckCount() - before;
  console.log(`  \u2713 ${name}: ${ran} checks`);
}

async function runInvariantAsync(name: string, fn: () => Promise<void>): Promise<void> {
  const before = getCheckCount();
  await fn();
  const ran = getCheckCount() - before;
  console.log(`  \u2713 ${name}: ${ran} checks`);
}

async function assertExists(filePath: string): Promise<void> {
  await fs.access(filePath);
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readThemeArtifacts(baseDir: string): Promise<{
  tokens: Record<string, unknown>;
  css: string;
  surfaces: Record<string, unknown>;
}> {
  const tokensPath = path.join(baseDir, "tokens.json");
  const cssPath = path.join(baseDir, "styles.css");
  const surfacesPath = path.join(baseDir, "surfaces.json");

  await assertExists(tokensPath);
  await assertExists(cssPath);
  await assertExists(surfacesPath);

  return {
    tokens: JSON.parse(await fs.readFile(tokensPath, "utf8")) as Record<string, unknown>,
    css: await fs.readFile(cssPath, "utf8"),
    surfaces: JSON.parse(await fs.readFile(surfacesPath, "utf8")) as Record<string, unknown>
  };
}

async function readTextArtifact(filePath: string): Promise<string> {
  await assertExists(filePath);
  return fs.readFile(filePath, "utf8");
}

function assertRelativeFontFilePaths(fontFiles: Array<Record<string, unknown>>, label: string): void {
  for (const fontFile of fontFiles) {
    const fontPath = fontFile.path;

    assert(typeof fontPath === "string" && fontPath.length > 0, `Expected ${label} to include a non-empty font file path.`);
    assert(!path.isAbsolute(fontPath), `Expected ${label} font file path "${fontPath}" to stay relative so published manifests remain portable.`);
  }
}

function validatePackageExports(packageJson: Record<string, unknown>): void {
  const exportsField = (packageJson.exports ?? {}) as Record<string, unknown>;
  for (const tierName of tierNames) {
    const expectedTierExports = {
      [`./tiers/${tierName}.css`]: `./dist/tiers/${tierName}/styles.css`,
      [`./tiers/${tierName}.tokens.json`]: `./dist/tiers/${tierName}/tokens.json`,
      [`./tiers/${tierName}.surfaces.json`]: `./dist/tiers/${tierName}/surfaces.json`
    };

    for (const [exportKey, exportPath] of Object.entries(expectedTierExports)) {
      assert(exportsField[exportKey] === exportPath, `Expected package.json to export ${exportKey} from ${exportPath}.`);
    }
  }

  assert(typeof exportsField["./presets"] === "object", "Expected package.json to expose the public tier registry subpath.");
  assert(typeof exportsField["./types"] === "object", "Expected package.json to expose the public manifest/type subpath.");

  assert(!("./presets/panel.css" in exportsField), "Expected package.json to stop exporting the removed panel preset CSS path.");
  assert(!("./presets/panel.tokens.json" in exportsField), "Expected package.json to stop exporting the removed panel preset tokens path.");
  assert(!("./presets/panel.surfaces.json" in exportsField), "Expected package.json to stop exporting the removed panel preset surfaces path.");
}

function validateSurfacesManifestDocs(docsMd: string, readmeMd: string): void {
  // Top-level shape and keys consumers depend on must remain documented.
  const requiredFragments = [
    "# Surfaces manifest (`surfaces.json`)",
    "## Top-level shape",
    "`defaultSurface`",
    "## Surface entry (`ThemeSurfaceManifestEntry`)",
    "### Engine values",
    "`metrics-compensated`",
    "`cap-formula`",
    "## `tokens` \u2014 `ThemeTokens`",
    "## `metrics` \u2014 `BaselineGeneratorTokens`",
    "## Font asset contract",
    "## Stability guarantees",
    "## Consumer recipes"
  ];
  for (const fragment of requiredFragments) {
    assert(docsMd.includes(fragment), `Expected docs/surfaces-manifest.md to document "${fragment}".`);
  }
  assert(
    readmeMd.includes("docs/surfaces-manifest.md"),
    "Expected README.md to link to docs/surfaces-manifest.md so consumers can find the manifest schema."
  );
  assert(!docsMd.includes("presets/panel.surfaces.json"), "Expected docs/surfaces-manifest.md to drop the removed panel preset manifest path.");
  assert(!readmeMd.includes("baseline-foundry/presets/panel.css"), "Expected README.md to drop the removed panel preset CSS export.");
}

function escapeForRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseRemValue(value: unknown): number {
  return typeof value === "string" ? Number.parseFloat(value.replace("rem", "")) : Number.NaN;
}

function customPropertiesForSelector(css: string, selector: string): Map<string, string> {
  const properties = new Map<string, string>();
  parseCss(css).each(node => {
    if (node.type !== "rule" || node.selector !== selector) return;
    node.walkDecls(/^--bf-/, declaration => {
      if (!properties.has(declaration.prop)) {
        properties.set(declaration.prop, declaration.value);
      }
    });
  });
  return properties;
}

const LAYOUT_TOKEN_PROPERTIES: Record<string, string> = {
  contentMaxWidth: "--bf-content-max-width",
  contentPaddingInline: "--bf-content-padding-inline",
  measure: "--bf-measure",
  sectionSpace: "--bf-section-space",
  sectionSpaceShallow: "--bf-section-space-shallow",
  sectionSpaceDeep: "--bf-section-space-deep",
  stripSpace: "--bf-strip-space",
  gridGapInline: "--bf-grid-gap-inline",
  gridGapBlock: "--bf-grid-gap-block",
  pageMargin: "--bf-page-margin"
};

const COMPONENT_TOKEN_PROPERTIES: Record<string, string> = {
  borderWidth: "--bf-border-width",
  barThickness: "--bf-bar-thickness",
  radius: "--bf-radius",
  controlBlockPadding: "--bf-control-block-padding",
  controlCompactBlockPadding: "--bf-control-block-padding-compact",
  controlInlinePadding: "--bf-control-inline-padding",
  controlInlinePaddingAction: "--bf-control-inline-padding-action",
  controlInlinePaddingField: "--bf-control-inline-padding-field",
  controlVisualSize: "--bf-control-visual-size",
  fieldGap: "--bf-field-gap",
  panelPaddingInline: "--bf-panel-padding-inline",
  panelPaddingBlock: "--bf-panel-padding-block",
  accordionIndent: "--bf-accordion-indent"
};

function expectedTierProperties(tokens: Record<string, unknown>): Map<string, string> {
  const expected = new Map<string, string>();
  const layout = (tokens.layout ?? {}) as Record<string, unknown>;
  const components = (tokens.components ?? {}) as Record<string, unknown>;
  const roles = (tokens.roles ?? {}) as Record<string, Record<string, unknown>>;

  expected.set("--bf-baseline", String(tokens.baselineUnit));
  for (const [tokenName, propertyName] of Object.entries(LAYOUT_TOKEN_PROPERTIES)) {
    expected.set(propertyName, String(layout[tokenName]));
  }
  for (const [tokenName, propertyName] of Object.entries(COMPONENT_TOKEN_PROPERTIES)) {
    expected.set(propertyName, String(components[tokenName]));
  }
  for (const [roleName, token] of Object.entries(roles)) {
    expected.set(`--bf-${roleName}-font-size`, String(token.fontSize));
    expected.set(`--bf-${roleName}-line-height`, String(token.lineHeight));
    expected.set(`--bf-${roleName}-space-after`, String(token.spaceAfter));
    expected.set(`--bf-${roleName}-margin-bottom`, String(token.marginBottom));
    expected.set(`--bf-${roleName}-nudge-start`, String(token.nudgeTop));
  }
  return expected;
}

function validateTierSurfaceParity(
  sharedCss: string,
  tierArtifacts: Record<string, { tokens: Record<string, unknown>; css: string; }>
): void {
  for (const tierName of tierNames) {
    const artifact = tierArtifacts[tierName];
    assert(artifact, `Expected generated artifacts for tier "${tierName}".`);
    const expected = expectedTierProperties(artifact.tokens);
    const directProperties = customPropertiesForSelector(artifact.css, ":where(.bf-theme)");
    const scopedProperties = customPropertiesForSelector(sharedCss, `:where(.bf-theme.bf-tier-${tierName})`);

    for (const [propertyName, value] of expected) {
      assert(directProperties.get(propertyName) === value, `Expected ${tierName} direct CSS ${propertyName} to equal token value ${value}, got ${directProperties.get(propertyName)}.`);
      assert(scopedProperties.get(propertyName) === value, `Expected ${tierName} class-switched CSS ${propertyName} to equal direct/token value ${value}, got ${scopedProperties.get(propertyName)}.`);
    }

    const baselineUnit = parseRemValue(artifact.tokens.baselineUnit);
    const roles = (artifact.tokens.roles ?? {}) as Record<string, Record<string, unknown>>;
    for (const [roleName, token] of Object.entries(roles)) {
      const marginBottom = parseRemValue(token.marginBottom);
      const semanticMargin = parseRemValue(token.spaceAfter) - baselineUnit;
      assert(Number.isFinite(marginBottom) && marginBottom >= 0, `Expected ${tierName}/${roleName} manifest marginBottom to be finite and non-negative.`);
      assert(Math.abs(marginBottom - semanticMargin) <= 0.00001, `Expected ${tierName}/${roleName} manifest marginBottom to equal spaceAfter - baselineUnit.`);
    }
  }
}

async function validatePublicRuntimeAndTypes(indexDts: string): Promise<void> {
  const publicApi = await import("../dist/index.js");
  assert(Array.isArray(publicApi.tierNames), "Expected the package root runtime to export tierNames.");
  assert(JSON.stringify(publicApi.tierNames) === JSON.stringify(tierNames), "Expected public tierNames to expose the complete built-in registry.");
  assert(typeof publicApi.isTierName === "function" && publicApi.isTierName("os"), "Expected the package root runtime to export isTierName.");
  for (const typeName of ["TierName", "BuiltInThemeName", "ThemeSurface", "ThemeSurfaceManifest", "ThemeSurfaceManifestEntry"]) {
    assert(indexDts.includes(typeName), `Expected dist/index.d.ts to export public type ${typeName}.`);
  }
}

function validateRenewalComponentContracts(
  css: string,
  pageCatalogJs: string,
  componentAtlasHtml: string,
  patternAtlasHtml: string,
  componentDemoJs: string,
  pages: Record<string, string>,
  indexDts: string
): void {
  const ast = parseCss(css);
  const selectorFragments = [
    ".bf-top-navigation.is-grid-aligned",
    ".bf-top-navigation-logo.is-canonical-tagged",
    ".bf-docs-layout",
    "body.bf-theme.bf-page-shell",
    ".bf-tiered-list.is-triple",
    ".bf-tiered-list.is-flush",
    ".bf-tiered-list-item-role",
    ".bf-aspect.is-4-3",
    ".bf-aspect.is-contain",
    ".bf-notice.is-information",
    ".bf-notice.is-positive",
    ".bf-notice.is-caution",
    ".bf-notice.is-negative",
    ".bf-eyebrow",
    ".bf-article-pagination",
    ".bf-article-pagination-link.is-previous",
    ".bf-article-pagination-link.is-next",
    ".bf-control-row",
    ".bf-data-spotlight",
    ".bf-data-spotlight-items",
    ".bf-data-spotlight-item",
    ".bf-data-spotlight-stat",
    ".bf-data-spotlight-headline",
    ".bf-data-spotlight-action",
    ".bf-divided-section",
    ".bf-divided-section-layout",
    ".bf-divided-section-rule",
    ".bf-divided-section-header",
    ".bf-divided-section-content",
    ".bf-divided-section-list",
    ".bf-divided-section-item",
    ".bf-basic-section",
    ".bf-basic-section-layout",
    ".bf-basic-section-rule",
    ".bf-basic-section-header",
    ".bf-basic-section-content",
    ".bf-cta-section",
    ".bf-cta-section-layout",
    ".bf-cta-section-content",
    ".bf-text-spotlight",
    ".bf-text-spotlight-layout",
    ".bf-text-spotlight-rule",
    ".bf-text-spotlight-header",
    ".bf-text-spotlight-content",
    ".bf-text-spotlight-items",
    ".bf-text-spotlight-item",
    ".bf-hero",
    ".bf-hero-layout",
    ".bf-hero-copy",
    ".bf-hero-chip",
    ".bf-hero-media",
    ".bf-hero-signpost",
    ".bf-hero-intro",
    ".bf-quote-wrapper",
    ".bf-quote-wrapper-header",
    ".bf-quote-wrapper-layout",
    ".bf-quote-wrapper-prose",
    ".bf-quote-wrapper-citation",
    ".bf-quote-wrapper-signpost",
    ".bf-quote-wrapper-media",
    ".bf-quote-wrapper-quote-row",
    ".bf-in-page-navigation",
    ".bf-in-page-navigation-nav",
    ".bf-in-page-navigation-toggle",
    ".bf-table-of-contents",
    ".bf-table-of-contents-link",
    ".bf-top-navigation.is-reduced",
    ".bf-credential",
    ".bf-password-reveal",
    ".bf-credential-validation",
    ".bf-notification",
    ".bf-notification-content",
    ".bf-notification-meta",
    ".bf-notification-close",
    ".bf-logo-section",
    ".bf-logo-section-items",
    ".bf-logo-section-item",
    ".bf-logo-section-link",
    ".bf-logo-section-logo",
    ".bf-media-object",
    ".bf-media-object-layout",
    ".bf-media-object-media",
    ".bf-media-object-content",
    ".bf-media-object-meta-list",
    ".bf-media-object-meta",
    ".bf-content-card-wrapper",
    ".bf-content-card",
    ".bf-content-card-frame",
    ".bf-content-card-media",
    ".bf-content-card-image",
    ".bf-content-card-content",
    ".bf-content-card-body",
    ".bf-content-card-title",
    ".bf-content-card-main-link",
    ".bf-content-card-description",
    ".bf-content-card-footer",
    ".bf-content-card-footer-inner",
    ".bf-content-card-resource",
    ".bf-fluid-breakout",
    ".bf-fluid-breakout-main",
    ".bf-fluid-breakout-item",
    ".bf-fluid-breakout-aside",
    ".bf-fluid-breakout-toolbar",
    ".bf-fluid-breakout-toolbar-items",
    ".bf-table.is-sortable",
    ".bf-table-sort-button",
    ".bf-table.is-expanding",
    ".bf-table-expand-toggle",
    ".bf-table-expanding-row",
    ".bf-table-expanding-cell",
    ".bf-table-mobile-card-frame",
    ".bf-table.is-mobile-card",
    ".bf-table-card-label"
  ];
  const emittedSelectors: string[] = [];
  ast.walkRules(rule => emittedSelectors.push(rule.selector));
  for (const fragment of selectorFragments) {
    assert(emittedSelectors.some(selector => selector.includes(fragment)), `Expected generated CSS to include the renewal contract selector ${fragment}.`);
  }
  assert(css.includes(":where(.bf-theme) :where(.bf-top-navigation-row) {\n  padding-block: 0;"), "Expected the navigation layout contract to remove row-owned vertical padding.");
  assert(css.includes("background: var(--bf-color-brand);"), "Expected the tagged navigation brand block to use the Ubuntu-orange semantic token.");
  assert(css.includes("block-size: var(--bf-top-navigation-logo-tag-block-size);"), "Expected the tagged navigation block to preserve its fixed 38px tag height.");
  assert(css.includes("padding-block: 0 var(--bf-top-navigation-logo-icon-bottom-offset);"), "Expected the tagged navigation mark to preserve its fixed tag-bottom inset.");
  assert(css.includes("transform: translateX(var(--bf-top-navigation-logo-icon-optical-offset-inline));"), "Expected the Circle of Friends to compensate for its asymmetric source bounds.");
  assert(!css.includes("block-size: calc(var(--bf-body-line-height) + (var(--bf-top-navigation-link-padding-block) * 2));"), "Expected tagged navigation not to stretch its tag to the full occupied row.");
  assert(!css.includes("--bf-top-navigation-brand-region"), "Expected generated tier CSS to remove the fixed top-navigation brand-region token.");
  assert(css.includes("grid-template-columns: repeat(8, minmax(0, 1fr));") && css.includes("grid-column: 1 / span 2;") && css.includes("grid-column: 3 / -1;"), "Expected grid-aligned navigation to share the eight-column page grid and begin primary navigation at column three.");
  assert(css.includes("--bf-bar-thickness: 0.1875rem;"), "Expected generated tier CSS to expose the shared rem-based 3px emphasis-bar token.");
  assert(css.includes("border-inline-start: var(--bf-bar-thickness) solid var(--bf-notification-accent);") && css.includes("border-bottom: var(--bf-bar-thickness) solid transparent;") && css.includes("block-size: var(--bf-bar-thickness);"), "Expected notifications, tabs, and highlight rules to consume the shared emphasis-bar token.");
  assert(css.includes("container-name: bf-article-pagination;") && css.includes("grid-template-columns: auto minmax(0, 1fr);") && css.includes("inline-size: calc((100cqi - var(--bf-space-2)) / 2);"), "Expected article pagination to retain its named container and persistent equal-half structure.");
  assert(css.includes("column-gap: var(--bf-space-2);") && css.includes("row-gap: var(--bf-space-half);"), "Expected article pagination to map Vanilla's medium and x-small spacing to BF rhythm tokens.");
  assert(css.includes("padding-block: calc(var(--bf-space-2) + (var(--bf-baseline) / 4) - var(--bf-border-width));"), "Expected article pagination to use semantic medium padding with metric baseline compensation.");
  assert(!css.includes("padding-block: calc(var(--bf-panel-padding-block) + (var(--bf-baseline) / 4) - var(--bf-border-width));"), "Expected article pagination not to inherit panel-density padding.");
  assert(css.includes("@container bf-article-pagination (width < 28.75rem)") && css.includes("inline-size: calc(var(--bf-space-6) + var(--bf-space-1));"), "Expected article pagination to retain Vanilla's compact previous-link threshold and mapped width.");
  assert(css.includes("@container (width >= 38.75rem)") && css.includes(".bf-data-spotlight.is-three-blocks") && css.includes(".bf-divided-section.is-split-medium"), "Expected static content ports to expose their medium container-query compositions.");
  assert(css.includes("grid-row: span 5;") && css.includes("grid-template-rows: subgrid;"), "Expected data spotlight subgrids to reserve distinct rows for the highlight rule, statistic, headline, description, and action.");
  assert(css.includes("@container (width >= 64.75rem)") && css.includes(".bf-data-spotlight.is-two-blocks") && css.includes(".bf-divided-section) :where(.bf-divided-section-layout)"), "Expected static content ports to expose their large container-query compositions.");
  assert(!css.includes("bf-muted-heading"), "Expected the deprecated muted-heading port to remain absent from generated CSS.");
  assert(css.includes("container-name: bf-basic-section;") && css.includes("@container bf-basic-section (width >= 38.75rem)") && css.includes("@container bf-basic-section (width >= 64.75rem)"), "Expected basic section to establish medium and large container-query breakpoints.");
  assert(css.includes(".bf-basic-section.is-split-medium) :where(.bf-basic-section-layout)") && css.includes(".bf-basic-section:not(.is-split-medium)) :where(.bf-basic-section-layout)"), "Expected basic section 50/50 layout rules to target the layout descendant at both breakpoints.");
  assert(css.includes("container-name: bf-cta-section;") && css.includes("padding-block: calc(var(--bf-section-space-deep) / 2);") && css.includes("padding-block: var(--bf-section-space-deep);"), "Expected CTA section to preserve half-deep narrow padding and full-deep wide descendant padding.");
  assert(css.includes(".bf-cta-section.is-offset) :where(.bf-cta-section-layout)") && css.includes("grid-template-columns: minmax(0, 1fr) minmax(0, 3fr);") && css.includes(".bf-cta-section.is-offset) :where(.bf-cta-section-content)"), "Expected CTA section to expose the wide 25/75 offset content rail on descendants.");
  assert(css.includes("container-name: bf-text-spotlight;") && css.includes(".bf-text-spotlight-layout) {") && css.includes("grid-template-columns: minmax(0, 1fr) minmax(0, 3fr);"), "Expected text spotlight to expose its 25/75 descendant layout.");
  assert(css.includes("container-name: bf-hero;") && css.includes("padding-block-end: calc(var(--bf-section-space) / 2);") && css.includes("padding-block-start: var(--bf-space-2);"), "Expected hero to preserve Vanilla's half/full regular section exit and compact space-2 top boundary.");
  assert(css.includes("padding-block-end: var(--bf-section-space);") && css.includes("padding-block-start: var(--bf-space-3);"), "Expected hero to use the wide full section exit and space-3 top boundary.");
  assert(css.includes(".bf-hero-layout) {") && css.includes(".bf-hero.is-25-75) :where(.bf-hero-layout)") && css.includes(".bf-hero.is-75-25) :where(.bf-hero-layout)"), "Expected hero composition queries to target the layout descendant for 50/50, 25/75, and 75/25 tracks.");
  assert(css.includes("@container bf-hero (width >= 38.75rem)") && css.includes("@container bf-hero (width >= 64.75rem)") && css.includes(".bf-hero.is-fallback) :where(.bf-hero-intro)"), "Expected hero to expose medium/large descendant queries and the fallback introduction rail.");
  assert(css.includes(".bf-hero-chip.bf-chip") && css.includes("column-gap: var(--bf-space-1);"), "Expected hero chip composition to map the Vanilla icon/value gap to the BF chip and space-1 tokens.");
  assert(css.includes("container-name: bf-quote-wrapper;") && css.includes("grid-template-columns: minmax(0, 1fr) minmax(0, 3fr);"), "Expected quote wrapper to preserve the 25/75 signpost/content rail.");
  assert(css.includes(".bf-quote-wrapper-quote-row)"), "Expected quote wrapper to expose a dedicated quote/citation rail.");
  assert(css.includes("@container bf-quote-wrapper (width >= 38.75rem)") && css.includes("@container bf-quote-wrapper (width >= 64.75rem)") && css.includes("grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);"), "Expected quote wrapper to retune quote/citation proportions at the large container threshold.");
  assert(!css.includes(".bf-basic-section.is-asymmetric") && !/\b(?:p|ui)-(?:basic-section|cta-section|text-spotlight)[-_]/.test(css) && !/\b(?:basic-section|cta-section|text-spotlight)(?:__|--)[a-z]/.test(css), "Expected Sites foundation CSS to reject asymmetric, legacy span, and Jinja compatibility APIs.");
  assert(!css.includes("bf-muted-heading") && !/\b(?:p|ui)-(?:hero|quote-wrapper)[-_]/.test(css) && !/\b(?:hero|quote-wrapper)(?:__|--)[a-z]/.test(css), "Expected hero and quote wrapper CSS to reject muted-heading, Jinja, and legacy span compatibility APIs.");
  assert(!css.includes(".bf-navigation-reduced"), "Expected reduced navigation to remain a modifier of bf-top-navigation rather than a standalone API.");
  assert(css.includes(".bf-password-reveal[aria-pressed='true']") && css.includes(".bf-notification[hidden]"), "Expected interactive feedback CSS to expose stateful reveal and dismissal contracts.");
  assert(css.includes("margin-block: calc(var(--bf-space-1) * -1);") && css.includes("padding-block: var(--bf-space-1);"), "Expected logo section to retain Vanilla's small negative row pull and matching wrapper compensation.");
  assert(css.includes("margin-block: calc(var(--bf-space-2) * -1);") && css.includes("padding-block: var(--bf-space-2);"), "Expected logo section to retain Vanilla's large negative row pull and matching wrapper compensation.");
  assert(css.includes("block-size: calc(var(--bf-space-8) + var(--bf-space-1));") && css.includes("block-size: calc(var(--bf-space-12) + var(--bf-space-1));"), "Expected logo section marks to use intrinsic small and large BF slot sizes.");
  assert(css.includes("grid-template-columns: auto minmax(0, 1fr);") && css.includes(".bf-media-object-layout"), "Expected media object to keep a persistent side-by-side intrinsic media/content grid.");
  assert(!css.includes("@container bf-media-object") && !css.includes("container-name: bf-media-object;"), "Expected media object not to introduce a collapsing container-query API.");
  assert(css.includes("container-name: bf-content-card;") && css.includes(".bf-content-card-wrapper") && css.includes(".bf-content-card-footer-inner"), "Expected content-card to expose its named allocation container, wrapper, and footer rail contracts.");
  assert(css.includes("@container bf-content-card (width >= 28.75rem)") && css.includes("@container bf-content-card (width >= 60rem)"), "Expected content-card to preserve intrinsic horizontal and feature reflow thresholds.");
  assert(css.includes("-webkit-line-clamp: 3;") && css.includes("-webkit-line-clamp: 2;"), "Expected content-card to retain the Vanilla title/description clamp contracts.");
  assert(!css.includes(".bf-content-card.has-image") && !css.includes(".bf-content-card.has-description"), "Expected content-card styling to use only is-* modifiers.");
  assert(!/\b(?:p|ui)-(?:content-card)[-_]/.test(css) && !/\bcontent-card(?:__|--)[a-z]/.test(css), "Expected content-card CSS to reject legacy Jinja/BEM compatibility APIs.");
  assert(!/\.(?:bf-logo-block|is-dense|has-misaligned)(?:\b|[-_])/.test(css), "Expected generated CSS to reject deprecated logo-block, dense, and misaligned compatibility APIs.");
  assert(!/\[data-[^\]]+\]|\.(?:p|ui)-[a-z][a-z0-9_-]*/.test(css), "Expected generated CSS to avoid styled data-* selectors and deprecated p-/ui-* APIs.");
  assert(css.includes(".bf-table.is-sortable th[aria-sort]") && css.includes(".bf-table-sort-button:focus-visible"), "Expected sortable tables to expose semantic sort-header and keyboard-focus states.");
  assert(css.includes(".bf-table.is-expanding .bf-table-expand-toggle") && css.includes(".bf-table-expanding-row[hidden]"), "Expected expanding tables to expose controlled toggle and hidden-row states.");
  assert(css.includes(".bf-table-mobile-card-frame") && css.includes(".bf-table.is-mobile-card") && css.includes(".bf-table-card-label"), "Expected mobile-card tables to expose the responsive frame, table modifier, and generated heading-label contracts.");
  assert(!/\.bf-table[^{}]*\[data-[^\]]+\]/.test(css), "Expected interactive table CSS to keep data-* attributes as runtime/test hooks rather than styling selectors.");
  assert(css.includes(".bf-fluid-breakout") && css.includes(".bf-fluid-breakout-main") && css.includes(".bf-fluid-breakout-aside") && css.includes(".bf-fluid-breakout-toolbar"), "Expected fluid breakout to expose bounded centre, logical aside, toolbar, and main layout contracts.");
  assert(css.includes("--bf-fluid-breakout-aside-width: 14rem;") && css.includes("--bf-fluid-breakout-item-min-width: 13rem;"), "Expected fluid breakout to retain Vanilla's 14rem aside and 13rem auto-fit minimum tokens.");
  assert(css.includes("@media (width >= 38.75rem)") && css.includes("@media (width >= 64.75rem)"), "Expected fluid breakout to retain the 620px toolbar and 1036px three-track transitions.");
  assert(css.includes("grid-template-columns:\n      minmax(var(--bf-fluid-breakout-aside-width), 1fr)"), "Expected fluid breakout to expose three logical tracks at the wide transition.");
  assert(!/\.(?:p|ui)-[a-z][a-z0-9_-]*/.test(css) && !/\b(?:fluid-breakout)(?:__|--)[a-z]/.test(css), "Expected fluid breakout CSS to reject legacy span and BEM compatibility APIs.");
  assert(indexDts.includes("export { initInteractiveFeedback, initNotificationDismissals, initPasswordReveals }"), "Expected public runtime exports to include the interactive feedback initializers.");
  assert(indexDts.includes("export { initExpandingTables, initInteractiveTables, initMobileCardTables, initSortableTables }"), "Expected public runtime exports to include the interactive table initializers.");
  assert(indexDts.includes("export { initInPageNavigations }"), "Expected public runtime exports to include the in-page navigation initializer.");
  for (const typeName of ["PasswordRevealInitOptions", "NotificationDismissInitOptions", "InteractiveFeedbackInitOptions"]) {
    assert(indexDts.includes(typeName), `Expected public type exports to include ${typeName}.`);
  }
  for (const typeName of ["ExpandingTableInitOptions", "InteractiveTablesInitOptions", "MobileCardTableInitOptions", "SortableTableInitOptions", "TableSortCompare", "TableSortContext", "TableSortDirection"]) {
    assert(indexDts.includes(typeName), `Expected public type exports to include ${typeName}.`);
  }
  assert(indexDts.includes("InPageNavigationInitOptions"), "Expected public type exports to include InPageNavigationInitOptions.");
  assert(componentDemoJs.includes("initInteractiveTables();"), "Expected component-demo.js to initialize interactive table behavior on fixture pages.");

  const registeredRoutes = new Set(componentPages.map(page => page.route));
  for (const [pageName, title, atlas] of [
    ["docs-layout", "Documentation layout", "component"],
    ["page-shell", "Page shell", "component"],
    ["article-pagination", "Article pagination", "pattern"],
    ["notice", "Notice", "component"],
    ["data-spotlight", "Data spotlight", "pattern"],
    ["divided-section", "Divided section", "pattern"],
    ["in-page-navigation", "In-page navigation", "pattern"],
    ["navigation-reduced", "Reduced navigation", "pattern"],
    ["table-of-contents", "Table of contents", "pattern"],
    ["credential-validation", "Password reveal and validation", "pattern"],
    ["notification", "Notification", "pattern"],
    ["logo-section", "Logo section", "pattern"],
    ["linked-logo-section", "Linked logo section", "pattern"],
    ["media-object", "Media object", "pattern"],
    ["content-card", "Content card", "pattern"],
    ["table-sortable", "Sortable table", "pattern"],
    ["table-expanding", "Expanding table", "pattern"],
    ["table-mobile-card", "Mobile card table", "pattern"],
    ["basic-section", "Basic section", "pattern"],
    ["cta-section", "CTA section", "pattern"],
    ["text-spotlight", "Text spotlight", "pattern"],
    ["hero", "Hero", "pattern"],
    ["quote-wrapper", "Quote wrapper", "pattern"],
    ["rich-list-horizontal", "Rich horizontal list", "pattern"],
    ["rich-list-vertical", "Rich vertical list", "pattern"],
    ["fluid-breakout", "Fluid breakout layout", "pattern"],
    ["tab-section", "Tab section", "pattern"],
    ["sticky-footer", "Sticky footer layout", "pattern"],
    ["equal-heights", "Equal-heights composition", "pattern"],
    ["empty-state", "Empty state recipes", "pattern"]
  ] as const) {
    const route = `/demo/components/${pageName}.html`;
    assert(registeredRoutes.has(route), `Expected the component QA catalog to register ${route}.`);
    assert(pageCatalogJs.includes(`{ title: "${title}", href: "${route}" }`), `Expected the page catalog to register ${title}.`);
    if (atlas === "pattern") {
      assert(patternAtlasHtml.includes(`href="../components/${pageName}.html"`), `Expected the pattern atlas to link ${pageName}.html.`);
      assert(!componentAtlasHtml.includes(`href="./${pageName}.html"`), `Expected the component atlas not to duplicate pattern ${pageName}.html.`);
    } else {
      assert(componentAtlasHtml.includes(`href="./${pageName}.html"`), `Expected the component atlas to link ${pageName}.html.`);
    }
  }

  const articlePaginationHtml = pages["article-pagination"] ?? "";
  assert(articlePaginationHtml.includes('rel="prev"') && articlePaginationHtml.includes('rel="next"'), "Expected article pagination to expose prev/next relationship semantics.");
  assert(articlePaginationHtml.includes('dir="rtl"') && articlePaginationHtml.includes("article-pagination-demo-narrow"), "Expected article pagination to cover RTL and narrow-container specimens.");
  assert(articlePaginationHtml.includes("bf-article-pagination-direction") && articlePaginationHtml.includes("bf-icon is-chevron-left") && articlePaginationHtml.includes("bf-icon is-chevron-right"), "Expected article pagination to use accessible-markup decorative BF icons instead of generated text glyphs.");
  assert(articlePaginationHtml.includes("data-overflow-check"), "Expected article pagination to participate in overflow QA.");

  const docsLayoutHtml = pages["docs-layout"] ?? "";
  assert(docsLayoutHtml.includes("bf-docs-layout-navigation") && docsLayoutHtml.includes("bf-docs-layout-content"), "Expected docs layout to expose navigation and content slots.");
  assert(docsLayoutHtml.includes("data-overflow-check"), "Expected docs layout to participate in overflow QA.");

  const pageShellHtml = pages["page-shell"] ?? "";
  assert(pageShellHtml.includes('<body class="bf-theme bf-page-shell'), "Expected page shell demo to opt into the scoped body reset.");
  assert(pageShellHtml.includes('class="bf-top-navigation is-grid-aligned"'), "Expected page shell to compose the grid-aligned top navigation.");
  assert(!pageShellHtml.includes("component-shell.css"), "Expected page shell to prove BF's scoped reset without the component-shell reset.");

  const noticeHtml = pages.notice ?? "";
  assert(noticeHtml.includes("bf-notice is-information") && noticeHtml.includes("bf-notice is-negative"), "Expected notice demo to cover semantic variants.");
  assert(!noticeHtml.includes('role="alert"'), "Expected static notice specimens not to announce themselves as live alerts.");

  const aspectHtml = pages.aspect ?? "";
  assert(aspectHtml.includes('class="bf-aspect is-4-3"') && aspectHtml.includes('class="bf-aspect is-4-3 is-contain"'), "Expected aspect demo to prove orthogonal 4:3 and contain modifiers.");
  assert(aspectHtml.match(/src="\.\.\/assets\/aspect-wide\.svg"/g)?.length === 2, "Expected cover and contain specimens to use the same media asset.");

  const tieredListHtml = pages["tiered-list"] ?? "";
  assert(tieredListHtml.includes("bf-tiered-list is-flush") && tieredListHtml.includes("bf-tiered-list is-triple"), "Expected tiered-list demo to cover flush and triple layouts.");
  assert(tieredListHtml.includes("bf-tiered-list-item-role"), "Expected tiered-list demo to cover the role slot.");
  assert((tieredListHtml.match(/<hr class="bf-rule is-muted" data-baseline-check="flow">/g) ?? []).length >= 4, "Expected compact tiered-list demo rows to render and baseline-check their direct-child divider contract.");
  assert(css.includes(".bf-tiered-list:not(.is-list-full-width):not(.is-flush):not(.is-triple)"), "Expected hanging-indent tiered-list geometry to exclude the independent flush and triple variants.");

  const searchAndFilterHtml = pages["search-and-filter"] ?? "";
  assert(searchAndFilterHtml.includes('class="bf-control-row"') && searchAndFilterHtml.includes("data-overflow-check"), "Expected the search/filter demo to cover the overflow-safe control row.");

  const dataSpotlightHtml = pages["data-spotlight"] ?? "";
  assert(dataSpotlightHtml.includes("data-component-capture") && dataSpotlightHtml.includes("data-baseline-check") && dataSpotlightHtml.includes("data-overflow-check"), "Expected data spotlight to expose capture, baseline, and overflow fixture markers.");
  assert(dataSpotlightHtml.includes("bf-data-spotlight is-two-blocks") && dataSpotlightHtml.includes("bf-data-spotlight is-three-blocks") && dataSpotlightHtml.includes("bf-data-spotlight is-four-blocks"), "Expected data spotlight to cover all three block-count modifiers.");
  assert((dataSpotlightHtml.match(/bf-data-spotlight-rule bf-rule is-highlighted/g) ?? []).length === 9, "Expected every data spotlight item to expose its required shared-thickness highlight rule.");
  assert(!dataSpotlightHtml.includes("muted-heading"), "Expected data spotlight not to introduce the deprecated muted-heading port.");

  const dividedSectionHtml = pages["divided-section"] ?? "";
  assert(dividedSectionHtml.includes("data-component-capture") && dividedSectionHtml.includes("data-baseline-check") && dividedSectionHtml.includes("data-overflow-check"), "Expected divided section to expose capture, baseline, and overflow fixture markers.");
  assert(dividedSectionHtml.includes("bf-divided-section-layout") && dividedSectionHtml.includes("bf-divided-section-rule") && dividedSectionHtml.includes("bf-divided-section-list"), "Expected divided section to cover its layout, rule, and list slots.");
  assert(!dividedSectionHtml.includes("muted-heading"), "Expected divided section not to introduce the deprecated muted-heading port.");

  for (const [pageName, requiredClass] of [
    ["basic-section", "bf-basic-section"],
    ["cta-section", "bf-cta-section"],
    ["text-spotlight", "bf-text-spotlight"]
  ] as const) {
    const pageHtml = pages[pageName] ?? "";
    assert(pageHtml.includes("data-component-capture") && pageHtml.includes("data-baseline-check") && pageHtml.includes("data-overflow-check"), `Expected ${pageName} to expose capture, baseline, and overflow fixture markers.`);
    assert(pageHtml.includes(`class="${requiredClass}`), `Expected ${pageName} to exercise ${requiredClass}.`);
    assert(!pageHtml.includes("is-asymmetric") && !/\b(?:p|ui)-(?:basic-section|cta-section|text-spotlight)[-_]/.test(pageHtml) && !/\b(?:basic-section|cta-section|text-spotlight)(?:__|--)[a-z]/.test(pageHtml), `Expected ${pageName} markup to avoid legacy span and Jinja compatibility APIs.`);
  }
  const basicSectionHtml = pages["basic-section"] ?? "";
  assert(basicSectionHtml.includes("bf-basic-section-layout") && basicSectionHtml.includes("is-split-medium") && basicSectionHtml.includes("bf-eyebrow"), "Expected basic section to cover its layout, medium split, and BF eyebrow title slots.");
  const ctaSectionHtml = pages["cta-section"] ?? "";
  assert(ctaSectionHtml.includes("bf-cta-section-layout") && ctaSectionHtml.includes("bf-cta-section-content") && ctaSectionHtml.includes("is-offset"), "Expected CTA section to cover full and offset descendant content slots.");
  const textSpotlightHtml = pages["text-spotlight"] ?? "";
  assert(textSpotlightHtml.includes("bf-text-spotlight-layout") && textSpotlightHtml.includes("bf-text-spotlight-items") && textSpotlightHtml.includes("class=\"bf-eyebrow\""), "Expected text spotlight to cover its 25/75 title rail, item list, and BF eyebrow title.");

  const heroHtml = pages.hero ?? "";
  assert(heroHtml.includes("data-component-capture") && heroHtml.includes("data-baseline-check") && heroHtml.includes("data-overflow-check"), "Expected hero to expose capture, baseline, and overflow fixture markers.");
  assert(heroHtml.includes("bf-hero-layout") && heroHtml.includes("bf-hero-copy") && heroHtml.includes("bf-hero-media") && heroHtml.includes("bf-hero-chip"), "Expected hero to cover copy, media, chip, and layout slots.");
  assert(heroHtml.includes("is-25-75") && heroHtml.includes("is-75-25") && heroHtml.includes("is-fallback") && heroHtml.includes("is-split-medium"), "Expected hero to cover 50/50, 25/75, 75/25, and fallback compositions.");
  assert(heroHtml.includes('dir="rtl"') && heroHtml.includes("long copy") && heroHtml.includes("<figure") && heroHtml.includes("bf-eyebrow") === false, "Expected hero to cover RTL, long-copy, and image fixtures without introducing the deprecated muted-heading API.");
  assert(!/class="[^"]*\b(?:p|ui)-[a-z][a-z0-9_-]*/.test(heroHtml) && !/\b(?:hero)(?:__|--)[a-z]/.test(heroHtml), "Expected hero markup to avoid Jinja and legacy span APIs.");

  const quoteWrapperHtml = pages["quote-wrapper"] ?? "";
  assert(quoteWrapperHtml.includes("data-component-capture") && quoteWrapperHtml.includes("data-baseline-check") && quoteWrapperHtml.includes("data-overflow-check"), "Expected quote wrapper to expose capture, baseline, and overflow fixture markers.");
  assert(quoteWrapperHtml.includes("bf-quote-wrapper-layout") && quoteWrapperHtml.includes("bf-quote-wrapper-quote-row") && quoteWrapperHtml.includes("bf-quote-wrapper-citation") && quoteWrapperHtml.includes("bf-quote-wrapper-signpost") && quoteWrapperHtml.includes("bf-quote-wrapper-media"), "Expected quote wrapper to cover its 25/75, quote, citation, signpost, and image slots.");
  assert(quoteWrapperHtml.includes("bf-prose") && quoteWrapperHtml.includes("<blockquote") && quoteWrapperHtml.includes("class=\"bf-eyebrow\""), "Expected quote wrapper to use a real BF prose blockquote and BF eyebrow heading slots.");
  assert(quoteWrapperHtml.includes('dir="rtl"') && quoteWrapperHtml.includes("long") && quoteWrapperHtml.includes("citation"), "Expected quote wrapper to cover RTL, long-copy, and citation fixtures.");
  assert(!quoteWrapperHtml.includes("muted-heading") && !/class="[^"]*\b(?:p|ui)-[a-z][a-z0-9_-]*/.test(quoteWrapperHtml) && !/\b(?:quote-wrapper)(?:__|--)[a-z]/.test(quoteWrapperHtml), "Expected quote wrapper markup to reject muted-heading, Jinja, and legacy span APIs.");

  const richHorizontalHtml = pages["rich-list-horizontal"] ?? "";
  assert(richHorizontalHtml.includes("data-component-capture") && richHorizontalHtml.includes("data-baseline-check") && richHorizontalHtml.includes("data-overflow-check"), "Expected rich horizontal list to expose capture, baseline, and overflow fixture markers.");
  assert(richHorizontalHtml.includes("bf-rich-list is-horizontal") && richHorizontalHtml.includes("bf-rich-list is-horizontal is-50-50") && richHorizontalHtml.includes("bf-rich-list-visual") && richHorizontalHtml.includes("bf-rich-list-support"), "Expected rich horizontal list to cover full and 50/50 media/support compositions.");
  assert(richHorizontalHtml.includes("bf-rich-list-list") && richHorizontalHtml.includes("is-ticked") && richHorizontalHtml.includes("is-bulleted") && richHorizontalHtml.includes("<ol") && richHorizontalHtml.includes("bf-rich-list-cta"), "Expected rich horizontal list to cover tick, bullet, ordered, ruled and CTA slots.");
  assert(css.includes("@container bf-rich-horizontal-items (width >= 66ch)") && css.includes("@container bf-rich-horizontal-items (width >= 100ch)"), "Expected rich horizontal list CSS to retain the 66ch and 100ch item-grid thresholds.");
  assert(!/class="[^"]*\b(?:p|ui)-[a-z][a-z0-9_-]*/.test(richHorizontalHtml) && !richHorizontalHtml.includes("muted-heading") && !/\brich-list(?:__|--)[a-z]/.test(richHorizontalHtml), "Expected rich horizontal list markup to reject legacy span, deprecated, and Jinja/BEM APIs.");

  const richVerticalHtml = pages["rich-list-vertical"] ?? "";
  assert(richVerticalHtml.includes("data-component-capture") && richVerticalHtml.includes("data-baseline-check") && richVerticalHtml.includes("data-overflow-check"), "Expected rich vertical list to expose capture, baseline, and overflow fixture markers.");
  assert(richVerticalHtml.includes("bf-rich-list is-vertical") && richVerticalHtml.includes("is-flipped") && richVerticalHtml.includes("is-narrow-3-2") && richVerticalHtml.includes("is-wide-2-3") && richVerticalHtml.includes("is-narrow-square") && richVerticalHtml.includes("is-wide-square"), "Expected rich vertical list to cover vertical, flipped, landscape, portrait, and square media ratios.");
  assert(richVerticalHtml.includes("is-contain") && richVerticalHtml.includes("is-video") && richVerticalHtml.includes("is-auto-height") && richVerticalHtml.includes("long copy"), "Expected rich vertical list to cover contain, video, auto-height, and long-copy pressure states.");
  assert(!/class="[^"]*\b(?:p|ui)-[a-z][a-z0-9_-]*/.test(richVerticalHtml) && !richVerticalHtml.includes("muted-heading") && !/\brich-list(?:__|--)[a-z]/.test(richVerticalHtml), "Expected rich vertical list markup to reject legacy span, deprecated, and Jinja/BEM APIs.");

  const fluidBreakoutHtml = pages["fluid-breakout"] ?? "";
  assert(fluidBreakoutHtml.includes("data-component-capture") && fluidBreakoutHtml.includes("data-baseline-check") && fluidBreakoutHtml.includes("data-overflow-check"), "Expected fluid breakout to expose capture, baseline, and overflow fixture markers.");
  assert(fluidBreakoutHtml.includes("bf-fluid-breakout-main is-full-width") && fluidBreakoutHtml.includes("bf-fluid-breakout-main is-no-aside") && fluidBreakoutHtml.includes("bf-fluid-breakout-toolbar") && fluidBreakoutHtml.includes("is-scrollable"), "Expected fluid breakout to cover full-width, no-aside, toolbar, and locally scrollable content states.");
  assert((fluidBreakoutHtml.match(/bf-fluid-breakout-aside/g) ?? []).length >= 3 && fluidBreakoutHtml.includes('dir="rtl"'), "Expected fluid breakout to cover start/end logical asides and RTL source-order mirroring.");
  assert(!/class="[^"]*\b(?:p|ui)-[a-z][a-z0-9_-]*/.test(fluidBreakoutHtml) && !/\bfluid-breakout(?:__|--)[a-z]/.test(fluidBreakoutHtml), "Expected fluid breakout markup to reject legacy span and BEM compatibility APIs.");

  const tabSectionHtml = pages["tab-section"] ?? "";
  assert(tabSectionHtml.includes("data-component-capture") && tabSectionHtml.includes("data-baseline-check") && tabSectionHtml.includes("data-overflow-check"), "Expected tab section to expose capture, baseline, and overflow fixture markers.");
  assert(tabSectionHtml.includes("bf-tab-section") && tabSectionHtml.includes("is-50-50") && tabSectionHtml.includes("is-25-75") && tabSectionHtml.includes("is-shallow") && tabSectionHtml.includes("is-deep"), "Expected tab section to cover full, 50/50, 25/75, shallow, and deep compositions.");
  assert((tabSectionHtml.match(/bf-tab-section-rule/g) ?? []).length === 2, "Expected tab section to cover the optional rule omission state.");
  assert(tabSectionHtml.includes('role="tablist"') && tabSectionHtml.includes('role="tab"') && tabSectionHtml.includes('aria-selected="true"') && tabSectionHtml.includes('aria-hidden="false"') && tabSectionHtml.includes("bf-quote-wrapper") && tabSectionHtml.includes("bf-divided-section") && tabSectionHtml.includes("bf-basic-section") && tabSectionHtml.includes("bf-logo-section"), "Expected tab section to compose accessible tabs with BF-owned nested quote, divided, basic and logo content.");
  assert(tabSectionHtml.includes('dir="rtl"') && !/class="[^"]*\b(?:p|ui)-[a-z][a-z0-9_-]*/.test(tabSectionHtml) && !tabSectionHtml.includes("muted-heading") && !/\btab-section(?:__|--)[a-z]/.test(tabSectionHtml), "Expected tab section markup to cover RTL and reject deprecated, Jinja, and BEM APIs.");

  for (const [pageName, requiredClass] of [
    ["in-page-navigation", "bf-in-page-navigation"],
    ["navigation-reduced", "bf-top-navigation is-reduced"],
    ["table-of-contents", "bf-table-of-contents"]
  ] as const) {
    const pageHtml = pages[pageName] ?? "";
    assert(pageHtml.includes("data-component-capture"), `Expected ${pageName} to expose a component capture marker.`);
    assert(pageHtml.includes("data-baseline-check"), `Expected ${pageName} to expose baseline-check fixture markers.`);
    assert(pageHtml.includes("data-overflow-check") || pageHtml.includes("data-overflow-container"), `Expected ${pageName} to expose an overflow fixture marker.`);
    assert(pageHtml.includes(`class="${requiredClass}"`), `Expected ${pageName} to exercise ${requiredClass}.`);
  }
  assert(!((pages["navigation-reduced"] ?? "").includes("bf-navigation-reduced")), "Expected navigation-reduced.html not to invent a standalone reduced-navigation class.");
  assert(!pageCatalogJs.includes("muted-heading") && !componentAtlasHtml.includes("muted-heading"), "Expected route and atlas catalogs to omit the deprecated muted-heading port.");

  const credentialValidationHtml = pages["credential-validation"] ?? "";
  assert(credentialValidationHtml.includes("data-component-capture") && credentialValidationHtml.includes("data-baseline-check") && credentialValidationHtml.includes("data-overflow-container"), "Expected credential validation to expose capture, baseline, and overflow fixture markers.");
  assert(credentialValidationHtml.includes("bf-password-reveal") && credentialValidationHtml.includes("bf-credential-validation") && credentialValidationHtml.includes("aria-controls"), "Expected credential validation to cover reveal and repeated-validation contracts.");
  assert(!/class="[^"]*\b(?:p|ui)-[a-z][a-z0-9_-]*/.test(credentialValidationHtml), "Expected credential validation markup to avoid deprecated p-/ui-* APIs.");

  const notificationHtml = pages.notification ?? "";
  assert(notificationHtml.includes("data-component-capture") && notificationHtml.includes("data-baseline-check") && notificationHtml.includes("data-overflow-container"), "Expected notification to expose capture, baseline, and overflow fixture markers.");
  assert(notificationHtml.includes("bf-notification is-information") && notificationHtml.includes("bf-notification is-positive") && notificationHtml.includes("bf-notification is-caution") && notificationHtml.includes("bf-notification is-negative"), "Expected notification to cover all severity variants.");
  assert(notificationHtml.includes("bf-notification-meta") && notificationHtml.includes("bf-notification-actions") && notificationHtml.includes("bf-notification-close"), "Expected notification to cover metadata, actions, and dismissal contracts.");
  assert(!/class="[^"]*\b(?:p|ui)-[a-z][a-z0-9_-]*/.test(notificationHtml), "Expected notification markup to avoid deprecated p-/ui-* APIs.");

  const logoSectionHtml = pages["logo-section"] ?? "";
  assert(logoSectionHtml.includes("data-component-capture") && logoSectionHtml.includes("data-baseline-check") && logoSectionHtml.includes("data-overflow-check"), "Expected logo section to expose capture, baseline, and overflow fixture markers.");
  assert(logoSectionHtml.includes("bf-logo-section-items") && logoSectionHtml.includes("bf-logo-section-item bf-logo-section-link") && logoSectionHtml.includes("bf-logo-section-logo") && logoSectionHtml.includes("bf-logo-section is-contained"), "Expected logo section to cover intrinsic links, marks, and contained-ratio fixtures.");
  assert(!/<[^>]+class="[^"]*(?:logo-block|\bis-dense\b|\bhas-misaligned\b)/.test(logoSectionHtml), "Expected logo section markup to reject deprecated logo-block, dense, and misaligned compatibility APIs.");

  const mediaObjectHtml = pages["media-object"] ?? "";
  assert(mediaObjectHtml.includes("data-component-capture") && mediaObjectHtml.includes("data-baseline-check") && mediaObjectHtml.includes("data-overflow-check"), "Expected media object to expose capture, baseline, and overflow fixture markers.");
  assert(mediaObjectHtml.includes("bf-media-object-layout") && mediaObjectHtml.includes("bf-media-object-media") && mediaObjectHtml.includes("bf-media-object-content") && mediaObjectHtml.includes("bf-media-object-meta-list"), "Expected media object to cover persistent grid, media, content, and metadata slots.");
  assert(mediaObjectHtml.includes("bf-media-object is-media-end") && mediaObjectHtml.includes("bf-media-object is-large"), "Expected media object to cover directional and large intrinsic-size fixtures.");

  const contentCardHtml = pages["content-card"] ?? "";
  assert(contentCardHtml.includes("data-component-capture") && contentCardHtml.includes("data-baseline-check") && contentCardHtml.includes("data-overflow-check"), "Expected content-card to expose capture, baseline, and overflow fixture markers.");
  assert(contentCardHtml.includes("bf-content-card-wrapper is-cols-2") && contentCardHtml.includes("bf-content-card-wrapper is-cols-4") && contentCardHtml.includes("bf-content-card-wrapper is-cols-6") && contentCardHtml.includes("bf-content-card-wrapper is-cols-8"), "Expected content-card to cover 2/4/6/8 allocated wrapper spans.");
  assert(contentCardHtml.includes("bf-content-card is-cols-2 is-image is-description-reveal") && contentCardHtml.includes("bf-content-card is-cols-4 is-image is-description-reveal") && contentCardHtml.includes("bf-content-card is-cols-4 is-image is-image-top") && contentCardHtml.includes("bf-content-card is-cols-8 is-image is-description-reveal"), "Expected content-card to cover image, description-reveal, image-top, and feature variants.");
  assert(contentCardHtml.includes("bf-content-card-main-link") && contentCardHtml.includes("bf-content-card-author-date") && contentCardHtml.includes("bf-content-card-footer-inner") && contentCardHtml.includes("dir=\"rtl\""), "Expected content-card to cover primary actions, author metadata, footer rails, and RTL pressure.");
  assert(!/class="[^"]*\bhas-(?:image|description)[^"]*/.test(contentCardHtml) && !/class="[^"]*\b(?:p|ui)-[a-z][a-z0-9_-]*/.test(contentCardHtml) && !/\bcontent-card(?:__|--)[a-z]/.test(contentCardHtml), "Expected content-card markup to reject has-* modifiers and legacy Jinja/BEM APIs.");

  const linkedLogoSectionHtml = pages["linked-logo-section"] ?? "";
  assert(linkedLogoSectionHtml.includes("data-component-capture") && linkedLogoSectionHtml.includes("data-baseline-check") && linkedLogoSectionHtml.includes("data-overflow-container"), "Expected linked-logo section to expose capture, baseline, and overflow fixture markers.");
  assert(linkedLogoSectionHtml.includes("bf-linked-logo-section is-full") && linkedLogoSectionHtml.includes("bf-linked-logo-section is-50-50") && linkedLogoSectionHtml.includes("bf-linked-logo-section is-25-75"), "Expected linked-logo section to cover full, 50/50, and 25/75 Sites rails.");
  assert((linkedLogoSectionHtml.match(/bf-linked-logo-section-card/g) ?? []).length >= 12 && linkedLogoSectionHtml.includes("bf-linked-logo-section-mark") && linkedLogoSectionHtml.includes("viewBox=\"0 0 160 90\""), "Expected linked-logo section to cover linked cards, 16:9 mark fixtures, and accessible destination copy.");
  assert(!/class="[^\"]*\b(?:p|ui)-[a-z][a-z0-9_-]*/.test(linkedLogoSectionHtml) && !linkedLogoSectionHtml.includes("logo-block"), "Expected linked-logo section markup to avoid legacy Jinja span and logo-block APIs.");

  const stickyFooterHtml = pages["sticky-footer"] ?? "";
  assert(stickyFooterHtml.includes("data-component-capture") && stickyFooterHtml.includes("data-baseline-check") && stickyFooterHtml.includes("data-overflow-container"), "Expected sticky-footer to expose capture, baseline, and overflow fixture markers.");
  assert((stickyFooterHtml.match(/bf-page-shell is-site-layout/g) ?? []).length === 2 && (stickyFooterHtml.match(/bf-site-footer is-sticky/g) ?? []).length === 2, "Expected sticky-footer to cover both short and long opt-in site shells.");
  assert(stickyFooterHtml.includes("short sticky site shell") && stickyFooterHtml.includes("long sticky site shell"), "Expected sticky-footer to distinguish short-content and long-content placement fixtures.");
  assert(!/class="[^\"]*\b(?:p|ui)-[a-z][a-z0-9_-]*/.test(stickyFooterHtml), "Expected sticky-footer markup to avoid legacy span APIs.");

  const equalHeightsHtml = pages["equal-heights"] ?? "";
  assert(equalHeightsHtml.includes("data-component-capture") && equalHeightsHtml.includes("data-baseline-check") && equalHeightsHtml.includes("data-overflow-container"), "Expected equal-heights to expose capture, baseline, and overflow fixture markers.");
  assert((equalHeightsHtml.match(/bf-equal-height-row/g) ?? []).length >= 3 && equalHeightsHtml.includes("bf-equal-height-row is-wrap") && equalHeightsHtml.includes("is-columns-3") && equalHeightsHtml.includes("is-columns-2"), "Expected equal-heights to compose the existing equal-height row with wrap, three-column, and two-column recipes.");
  assert(!equalHeightsHtml.includes("bf-equal-heights") && !equalHeightsHtml.includes("equal-heights__") && !equalHeightsHtml.includes("equal-heights--"), "Expected equal-heights to avoid inventing a duplicate component selector family.");

  const emptyStateHtml = pages["empty-state"] ?? "";
  assert(emptyStateHtml.includes("data-component-capture") && emptyStateHtml.includes("data-baseline-check") && emptyStateHtml.includes("data-overflow-container"), "Expected empty-state recipes to expose capture, baseline, and overflow fixture markers.");
  assert((emptyStateHtml.match(/data-baseline-label="(?:no content empty state|user triggered empty state|error empty state)"/g) ?? []).length === 3, "Expected empty-state to cover no-content, user-triggered, and error recipes.");
  assert(!emptyStateHtml.includes("bf-empty-state"), "Expected empty-state recipes to remain pure composition without a dedicated bf-empty-state selector.");
  assert(emptyStateHtml.includes("bf-search-box") && emptyStateHtml.includes('type="search"') && emptyStateHtml.includes("bf-button") && emptyStateHtml.includes('role="alert"') && emptyStateHtml.includes("bf-notice is-negative"), "Expected empty-state recipes to use real search, action, and negative-notice primitives.");

  const sortableTableHtml = pages["table-sortable"] ?? "";
  assert(sortableTableHtml.includes("data-component-capture") && sortableTableHtml.includes("data-baseline-check") && sortableTableHtml.includes("data-overflow-check"), "Expected sortable table to expose capture, baseline, and overflow fixture markers.");
  assert(sortableTableHtml.includes("bf-table is-sortable") && sortableTableHtml.includes("bf-table-sort-button") && sortableTableHtml.includes("aria-sort") && sortableTableHtml.includes('dir="rtl"'), "Expected sortable table to cover semantic sort controls and RTL pressure fixtures.");
  assert(!/class="[^"]*\b(?:p|ui)-[a-z][a-z0-9_-]*/.test(sortableTableHtml), "Expected sortable table markup to avoid deprecated p-/ui-* APIs.");

  const expandingTableHtml = pages["table-expanding"] ?? "";
  assert(expandingTableHtml.includes("data-component-capture") && expandingTableHtml.includes("data-baseline-check") && expandingTableHtml.includes("data-overflow-check"), "Expected expanding table to expose capture, baseline, and overflow fixture markers.");
  assert(expandingTableHtml.includes("bf-table is-expanding") && expandingTableHtml.includes("bf-table-expand-toggle") && expandingTableHtml.includes("aria-controls") && expandingTableHtml.includes("bf-table-expanding-row"), "Expected expanding table to cover controlled toggles and detail rows.");
  assert(!/class="[^"]*\b(?:p|ui)-[a-z][a-z0-9_-]*/.test(expandingTableHtml), "Expected expanding table markup to avoid deprecated p-/ui-* APIs.");

  const mobileCardTableHtml = pages["table-mobile-card"] ?? "";
  assert(mobileCardTableHtml.includes("data-component-capture") && mobileCardTableHtml.includes("data-baseline-check") && mobileCardTableHtml.includes("data-overflow-container") && mobileCardTableHtml.includes("data-overflow-check"), "Expected mobile-card table to expose capture, baseline, and overflow fixture markers.");
  assert(mobileCardTableHtml.includes("bf-table-mobile-card-frame") && mobileCardTableHtml.includes("bf-table is-mobile-card") && mobileCardTableHtml.includes('dir="rtl"'), "Expected mobile-card table to cover responsive frames, the table modifier, and RTL pressure fixtures.");
  assert(!/class="[^"]*\b(?:p|ui)-[a-z][a-z0-9_-]*/.test(mobileCardTableHtml), "Expected mobile-card table markup to avoid deprecated p-/ui-* APIs.");
}

function assertSelectorUsesBodyTypography(css: string, selector: string, label: string): void {
  const fontSizePattern = new RegExp(`${escapeForRegex(selector)}\\s*\\{[\\s\\S]*?font-size: var\\(--bf-body-font-size,`);
  const lineHeightPattern = new RegExp(`${escapeForRegex(selector)}\\s*\\{[\\s\\S]*?line-height: var\\(--bf-body-line-height,`);

  assert(fontSizePattern.test(css), `Expected ${label} to resolve font-size from the active body role.`);
  assert(lineHeightPattern.test(css), `Expected ${label} to resolve line-height from the active body role.`);
}

function assertNoDuplicateClassAttributes(filePath: string, html: string): void {
  const duplicateClassAttribute = html.match(/<[^>]*\bclass\s*=\s*["'][^"']*["'][^>]*\bclass\s*=/);

  assert(!duplicateClassAttribute, `Expected ${filePath} to avoid duplicate class attributes. Found: ${duplicateClassAttribute?.[0]}`);
}

function assertNoStyledDataSelectors(filePath: string, css: string): void {
  const styledDataSelector = css.match(/\[[^\]\n{};]*\bdata-[a-z0-9_-]+[^\]\n{};]*\]/i);

  assert(!styledDataSelector, `Expected ${filePath} to avoid styled data-* CSS selectors. Found: ${styledDataSelector?.[0]}`);
}

function assertExampleClassUsesRequiredPrimitive(filePath: string, html: string, exampleClass: string, requiredClass: string): void {
  const classAttributePattern = new RegExp(`class="([^"]*\\b${exampleClass}\\b[^"]*)"`, "g");
  const requiredClassPattern = new RegExp(`\\b${requiredClass}\\b`);

  for (const match of html.matchAll(classAttributePattern)) {
    const classValue = match[1] ?? "";
    assert(requiredClassPattern.test(classValue), `Expected ${filePath} to use ${requiredClass} alongside ${exampleClass}. Found: class="${classValue}"`);
  }
}

function assertPortableSurfaceEntries(surfaces: Record<string, Record<string, unknown>>): void {
  for (const [surfaceName, surface] of Object.entries(surfaces)) {
    assert(!("configPath" in surface), `Expected the "${surfaceName}" surface manifest entry to omit build-machine configPath data.`);
    assert(!("baselineConfigPath" in surface), `Expected the "${surfaceName}" surface manifest entry to omit build-machine baselineConfigPath data.`);
    assert(!("baselineTokensPath" in surface), `Expected the "${surfaceName}" surface manifest entry to omit build-machine baselineTokensPath data.`);

    const runtimeTokens = (surface.tokens ?? {}) as Record<string, unknown>;
    const metrics = (surface.metrics ?? {}) as Record<string, unknown>;
    assertRelativeFontFilePaths((runtimeTokens.fontFiles ?? []) as Array<Record<string, unknown>>, `the "${surfaceName}" runtime surface`);
    assertRelativeFontFilePaths((metrics.fontFiles ?? []) as Array<Record<string, unknown>>, `the "${surfaceName}" metric surface`);
  }
}

function validateThemeConfigWatcher(viteConfigTs: string): void {
  assert(viteConfigTs.includes('name: "baseline-foundry-theme-config-watcher"'), "Expected vite.config.ts to register the JSON-config theme rebuild watcher.");
  assert(viteConfigTs.includes("build:theme"), "Expected vite.config.ts to rerun npm run build:theme when config JSON changes.");
  assert(viteConfigTs.includes('type: "full-reload"'), "Expected vite.config.ts to trigger a full reload after rebuilding theme artifacts.");
}

async function validateLegacyPanelPresetRemoval(): Promise<void> {
  assert(!(await pathExists(path.resolve("dist", "presets", "panel"))), "Expected build output to remove the deleted panel preset directory.");
  assert(!(await pathExists(path.resolve("generated", "baseline", "panel"))), "Expected build output to remove the deleted panel baseline directory.");
}

function validateBfOnlyDemoPage(pageName: string, html: string): void {
  assertNoDuplicateClassAttributes(`demo/components/${pageName}`, html);
  assert(html.includes('<body class="bf-theme is-dark"'), `Expected ${pageName} to dogfood the bf-theme root.`);
  assert(html.includes("data-component-capture"), `Expected ${pageName} to expose a data-component-capture root for screenshot and baseline tooling.`);
  assert(!/class="[^"]*\bhas-[a-z][a-z0-9_-]*\b/.test(html), `Expected ${pageName} to avoid deprecated has-* helper classes and stay fully bf-* / is-* dogfooded.`);
  assert(!/\bp-[a-z][a-z0-9_-]*/.test(html), `Expected ${pageName} to avoid deprecated p-* markup and stay fully bf-* dogfooded.`);
  assert(!/\bvr-[a-z][a-z0-9_-]*/.test(html), `Expected ${pageName} to avoid deprecated vr-* markup and stay fully bf-* dogfooded.`);
}

function validateAppTierDemoPage(pageName: string, html: string): void {
  assertNoDuplicateClassAttributes(`demo/components/${pageName}`, html);
  assert(html.includes('../../dist/tiers/editorial/styles.css'), `Expected ${pageName} to bootstrap from the shared tier stylesheet instead of a preset-specific bundle.`);
  assert(html.includes('<body class="bf-theme bf-tier-app is-light"'), `Expected ${pageName} to dogfood the bf-theme + bf-tier-app root.`);
  assert(html.includes("data-component-capture"), `Expected ${pageName} to expose a data-component-capture root for screenshot and baseline tooling.`);
  assert(!html.includes('is-dark'), `Expected ${pageName} to avoid the dark demo tone now that it is an app-tier parity surface.`);
  assert(!/class="[^"]*\bhas-[a-z][a-z0-9_-]*\b/.test(html), `Expected ${pageName} to avoid deprecated has-* helper classes and stay fully bf-* / is-* dogfooded.`);
  assert(!/\bp-[a-z][a-z0-9_-]*/.test(html), `Expected ${pageName} to avoid deprecated p-* markup and stay fully bf-* dogfooded.`);
  assert(!/\bvr-[a-z][a-z0-9_-]*/.test(html), `Expected ${pageName} to avoid deprecated vr-* markup and stay fully bf-* dogfooded.`);
}

async function validateComponentPageTierConsistency(componentDemoJs: string): Promise<void> {
  assert(componentDemoJs.includes('const TIER_OPTIONS = ['), "Expected component-demo.js to expose the shared built-in tier list.");
  assert(componentDemoJs.includes('{ value: "os", label: "OS" }'), "Expected component-demo.js to expose OS as a first-class built-in tier option.");
  assert(!componentDemoJs.includes('{ value: "panel", label: "Panel" }'), "Expected component-demo.js to avoid exposing panel as a global tier option.");
  assert(!componentDemoJs.includes("cacheBust"), "Expected class-switched tier changes not to trigger an unnecessary stylesheet reload.");
  assert(componentDemoJs.includes('document.body.classList.add(`bf-tier-${tierName}`)'), "Expected standard component pages to switch tiers through the shared bundle's body classes.");
  assert(componentDemoJs.includes('tierAriaLabel: "Tier"'), "Expected standard component pages to label the shared header select as a tier control.");
  assert(componentDemoJs.includes('tierAriaLabel: "Font surface"'), "Expected locked-manifest experiments to label their page-specific selector explicitly as a font-surface control.");

  const componentDir = path.resolve("demo/components");
  const componentPageNames = (await fs.readdir(componentDir)).filter(fileName => fileName.endsWith(".html"));

  for (const fileName of componentPageNames) {
    const html = await readTextArtifact(path.join(componentDir, fileName));

    assertNoDuplicateClassAttributes(`demo/components/${fileName}`, html);
    assert(!/class="[^"]*\bhas-[a-z][a-z0-9_-]*\b/.test(html), `Expected ${fileName} to avoid deprecated has-* helper classes and stay fully bf-* / is-* dogfooded.`);

    if (fileName === "engine-smoke.html" || fileName === "engine-illustration.html") {
      assert(html.includes('../../dist/experiments/ibm-plex-engine-smoke/styles.css'), `Expected ${fileName} to keep its experiment-specific stylesheet bundle.`);
      continue;
    }

    assert(html.includes('../../dist/tiers/editorial/styles.css'), `Expected ${fileName} to bootstrap from the shared built-in tier stylesheet.`);
    assert(!html.includes('dist/presets/panel/styles.css'), `Expected ${fileName} to avoid the old panel preset bootstrap path.`);
    assert(!html.includes('dist/presets/app-tier/styles.css'), `Expected ${fileName} to avoid the old app-tier preset bootstrap path.`);
  }
}

function validateDemoCssSelectorHygiene(demoCssFiles: Record<string, string>): void {
  for (const [filePath, css] of Object.entries(demoCssFiles)) {
    assertNoStyledDataSelectors(filePath, css);
  }
}

async function validateExampleDogfooding(): Promise<void> {
  const exampleDirs = [path.resolve("examples/grid"), path.resolve("examples/spacing")];

  for (const exampleDir of exampleDirs) {
    const fileNames = (await fs.readdir(exampleDir)).filter(fileName => fileName.endsWith(".html"));

    for (const fileName of fileNames) {
      const filePath = path.join(exampleDir, fileName);
      const html = await readTextArtifact(filePath);

      assertNoDuplicateClassAttributes(path.relative(process.cwd(), filePath), html);
      assert(html.includes('data-example-grid-target'), `Expected ${path.relative(process.cwd(), filePath)} to expose the page capture target explicitly.`);
      assert(!/class="[^"]*\b(?:example|spacing)-(?:frame|fixed-width|hero|stack|actions|card|surface|callout|span-demo|span-row|tier-group|nested-specimens|stage-shell|stage-header|density-card|baseline-box|defaults|inline-row)(?![a-z0-9_-])/.test(html), `Expected ${path.relative(process.cwd(), filePath)} to use bf-* primitives instead of the removed generic example wrappers.`);

      if (path.basename(filePath) === "column-span-rule.html") {
        assertExampleClassUsesRequiredPrimitive(path.relative(process.cwd(), filePath), html, "example-span-bar", "bf-card");
      }

      if (path.basename(filePath) === "app-provisions.html") {
        assertExampleClassUsesRequiredPrimitive(path.relative(process.cwd(), filePath), html, "spacing-header-bar", "bf-card");
        assertExampleClassUsesRequiredPrimitive(path.relative(process.cwd(), filePath), html, "spacing-header-bar", "bf-cluster");
        assertExampleClassUsesRequiredPrimitive(path.relative(process.cwd(), filePath), html, "spacing-status-bar", "bf-cluster");
      }

      if (path.basename(filePath) === "app-panels.html") {
        assert(html.includes('class="bf-application example-application-frame"'), `Expected ${path.relative(process.cwd(), filePath)} to dogfood the shared bf-application shell.`);
        assert(html.includes('class="bf-navigation is-pinned"'), `Expected ${path.relative(process.cwd(), filePath)} to dogfood the shared pinned navigation shell.`);
        assert(html.includes('class="bf-main bf-grid-scope"'), `Expected ${path.relative(process.cwd(), filePath)} to dogfood the shared bf-main surface.`);
        assert(html.includes('class="bf-aside is-overlay is-medium"'), `Expected ${path.relative(process.cwd(), filePath)} to dogfood the shared overlay aside shell.`);
        assert(html.includes('data-application-layout-toggle') && html.includes('data-panel-drawer-toggle'), `Expected ${path.relative(process.cwd(), filePath)} to use the shared navigation and drawer triggers.`);
      }

      if (path.basename(filePath) === "panel-reflow.html") {
        assert(html.includes('class="bf-application example-panel-reflow-application"'), `Expected ${path.relative(process.cwd(), filePath)} to dogfood the shared bf-application shell.`);
        assert(html.includes('class="bf-aside is-pinned is-small example-panel-sidebar"'), `Expected ${path.relative(process.cwd(), filePath)} to dogfood the shared pinned aside shell.`);
        assert(html.includes('class="bf-main bf-grid-scope"'), `Expected ${path.relative(process.cwd(), filePath)} to dogfood the shared bf-main surface.`);
      }
    }
  }

  const examplePageJs = await readTextArtifact(path.resolve("demo/example-page.js"));

  const gridExamplesCss = await readTextArtifact(path.resolve("examples/grid/grid-examples.css"));
  const spacingExamplesCss = await readTextArtifact(path.resolve("examples/spacing/spacing-examples.css"));

  assert(examplePageJs.includes('initApplicationLayouts') && examplePageJs.includes('initPanelDrawers'), 'Expected demo/example-page.js to initialize the shared application-layout and panel-drawer runtimes for example pages.');
  assertNoStyledDataSelectors("examples/grid/grid-examples.css", gridExamplesCss);
  assertNoStyledDataSelectors("examples/spacing/spacing-examples.css", spacingExamplesCss);
  assert(!/\.(?:example)-(?:frame|fixed-width|hero|stack|actions|card|surface|callout|span-demo|span-row|tier-group|nested-specimens|stage-shell|stage-header)(?![a-z0-9_-])/.test(gridExamplesCss), "Expected grid examples CSS to avoid generic non-dogfooded wrapper/card classes.");
  assert(!/\.(?:spacing)-(?:fixed-width|hero|stack|actions|card|surface|density-card|baseline-box|defaults|inline-row)(?![a-z0-9_-])/.test(spacingExamplesCss), "Expected spacing examples CSS to avoid generic non-dogfooded wrapper/card classes.");
}

function validateCommonCss(css: string): void {
  // PostCSS-parsed view of the same bundle. New assertions and migrated
  // legacy ones should prefer the AST helpers (assertRuleHasDecl, etc.) over
  // brittle multi-line substring checks. See scripts/css-ast-helpers.ts.
  const ast = parseCss(css);
  assert(!css.includes("@font-face"), "Expected built-in CSS to leave runtime font URLs to the consumer-owned font declaration.");
  assert(!css.includes("UbuntuSans[wdth,wght].ttf"), "Expected built-in CSS to avoid a runtime URL to the unbundled development font.");
  assert(css.includes("@container (width >= 38.75rem)"), "Expected CSS to use the Canonical 620px threshold for the 8-column grid.");
  assert(css.includes("@container (width >= 105.0625rem)"), "Expected CSS to use the Canonical 1681px threshold for the 16-column grid.");
  assert(css.includes("@media (width >= 38.75rem)"), "Expected CSS to use the Canonical 620px viewport breakpoint for gutters and outer margins.");
  assert(css.includes("@media (width >= 64.75rem)"), "Expected CSS to use the Canonical 1036px viewport breakpoint for large outer margins.");
  assert(css.includes(":where(.bf-theme.bf-tier-app) :where(.bf-page) {\n  max-inline-size: none;"), "Expected app-tier page to be fluid (no max-width cap).");
  assert(css.includes(":where(.bf-theme) :where(.bf-page.is-fill) {\n  min-block-size: 100vh;\n  padding-block-end: var(--bf-section-space);"), "Expected shared CSS to expose the fill-height bf-page modifier used by the spec and controls shells.");
  assert(css.includes(":where(.bf-theme) :where(.bf-inline-size) {\n  --bf-inline-size: 18rem;\n  flex: 0 1 var(--bf-inline-size);\n  inline-size: min(100%, var(--bf-inline-size));\n  min-inline-size: min(100%, var(--bf-inline-size));"), "Expected shared CSS to expose the BF-owned bounded inline-size utility used by clustered inspection rows.");
  assert(css.includes(":where(.bf-theme) :where(.bf-inline-size.is-compact) {\n  --bf-inline-size: 12rem;"), "Expected shared CSS to expose the compact bounded inline-size modifier.");
  assert(css.includes(":where(.bf-theme) :where(.bf-inline-size.is-regular) {\n  --bf-inline-size: 18rem;"), "Expected shared CSS to expose the regular bounded inline-size modifier.");
  assert(css.includes(":where(.bf-theme) :where(.bf-inline-size.is-medium) {\n  --bf-inline-size: 20rem;"), "Expected shared CSS to expose the medium bounded inline-size modifier.");
  assert(css.includes(":where(.bf-theme) :where(.bf-inline-size.is-wide) {\n  --bf-inline-size: 24rem;"), "Expected shared CSS to expose the wide bounded inline-size modifier.");
  assert(css.includes(":where(.bf-theme) :where(.bf-inline-size.is-x-wide) {\n  --bf-inline-size: 28rem;"), "Expected shared CSS to expose the x-wide bounded inline-size modifier.");
  assert(css.includes(":where(.bf-theme) :where(ul.bf-grid, ol.bf-grid) {\n  list-style: none;\n  margin: 0;\n  padding: 0;"), "Expected shared CSS to let bf-grid act as an unstyled list container without page-local resets.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-grid) :where(.bf-fixed-width)", {
    "padding-inline": "0",
  }, "nested fixed-width wrappers inside bf-grid avoid adding a second page gutter");
  assert(css.includes(":where(.bf-theme) :where(.bf-grid.is-guide) > * {\n  background: color-mix(in srgb, var(--bf-color-accent) 18%, var(--bf-color-background-default));"), "Expected shared CSS to expose the BF-owned grid guide modifier for breakpoint specimens.");
  assert(css.includes("--bf-grid-gap-inline: 1rem;"), "Expected CSS to define the default 240-619px x-small 16px inline gutter without a separate 460px switch.");
  assert(css.includes("--bf-grid-gap-block: 1rem;"), "Expected CSS to define the default 240-619px x-small 16px block-gap token for non-bf-grid layouts.");
  assert(css.includes("--bf-page-margin: 1rem;"), "Expected CSS to define the default 240-619px x-small 16px outer margin without a separate 460px switch.");
  assert(css.includes("--bf-grid-gap-inline: 1.5rem;"), "Expected CSS to define the small-and-up 24px grid gutter.");
  assert(css.includes("--bf-page-margin: 1.5rem;"), "Expected CSS to define the small 24px outer margin.");
  assert(css.includes("gap: 0 var(--bf-grid-gap-inline);"), "Expected bf-grid to keep row-gap at 0 and use only the inline gutter token.");
  assert(css.includes("@media (width >= 64.75rem) {\n  :where(.bf-theme) {\n    --bf-grid-gap-inline: 2rem;\n    --bf-grid-gap-block: 2rem;\n    --bf-page-margin: 2rem;"), "Expected CSS to widen the default editorial gutter to 32px at large breakpoints.");
  assert(css.includes(":where(.bf-theme.bf-tier-app) {\n    --bf-grid-gap-inline: 1.5rem;\n    --bf-grid-gap-block: 1.5rem;"), "Expected CSS to keep app-tier gutters at 24px inside the large-breakpoint override.");
  assert(css.includes("--bf-page-margin: 2rem;"), "Expected CSS to define the large-and-up 32px outer margin.");
  assert(!css.includes("@container (width >= 42rem) {\n  .bf-grid"), "Expected grid CSS to avoid the older 42rem 8-column threshold.");
  assert(!css.includes("@container (width >= 72rem) {\n  .bf-grid"), "Expected grid CSS to avoid the older 72rem 16-column threshold.");
  assert(!css.includes(".u-fixed-width"), "Expected generated CSS to omit the old fixed-width alias.");
  assert(css.includes("--vf-color-background-default: #ffffff;"), "Expected generated CSS to define the Vanilla light background token.");
  assert(css.includes("--vf-color-background-alt: #f7f7f7;"), "Expected generated CSS to define the Vanilla light alt background token.");
  assert(css.includes("--vf-color-link-default: #0066cc;"), "Expected generated CSS to define the Vanilla light link token.");
  assert(css.includes("--vf-color-link-visited: #7d42b8;"), "Expected generated CSS to define the Vanilla visited-link token.");
  assert(css.includes("--vf-color-focus: #2e96ff;"), "Expected generated CSS to define the Vanilla light focus token.");
  assert(css.includes("--vf-color-border-neutral: #707070;"), "Expected generated CSS to define the Vanilla light neutral border token.");
  assert(css.includes("--vf-color-button-positive-default: #0e8420;"), "Expected generated CSS to define the Vanilla light positive button token.");
  assert(css.includes("--vf-color-button-positive-hover: #0c6d1a;"), "Expected generated CSS to define the Vanilla light positive button hover token.");
  assert(css.includes("--vf-color-button-negative-default: #c7162b;"), "Expected generated CSS to define the Vanilla light negative button token.");
  assert(css.includes("--vf-color-button-negative-hover: #b01326;"), "Expected generated CSS to define the Vanilla light negative button hover token.");
  assert(css.includes("--vf-color-accent: #0f95a1;"), "Expected generated CSS to define the Vanilla light accent token.");
  assert(css.includes("--vf-color-brand: #e95420;"), "Expected generated CSS to define the Ubuntu brand-orange token.");
  assert(css.includes(":where(.bf-theme.is-dark)"), "Expected generated CSS to include a core dark-tone override.");
  assert(css.includes("--vf-color-background-default: #262626;"), "Expected generated CSS to define the Vanilla dark background token.");
  assert(css.includes("--vf-color-background-alt: #202020;"), "Expected generated CSS to define the Vanilla dark alt background token.");
  assert(css.includes("--vf-color-link-default: #6699cc;"), "Expected generated CSS to define the Vanilla dark link token.");
  assert(css.includes("--vf-color-focus: #99ccff;"), "Expected generated CSS to define the Vanilla dark focus token.");
  assert(css.includes("--vf-color-border-neutral: hsl(0deg 0% 65%);"), "Expected generated CSS to define the Vanilla dark neutral border token.");
  assert(css.includes("--vf-color-button-positive-default: #008013;"), "Expected generated CSS to define the Vanilla dark positive button token.");
  assert(css.includes("--vf-color-button-positive-hover: #00670f;"), "Expected generated CSS to define the Vanilla dark positive button hover token.");
  assert(css.includes("--vf-color-button-negative-default: #a11223;"), "Expected generated CSS to define the Vanilla dark negative button token.");
  assert(css.includes("--vf-color-button-negative-hover: #8a0f1e;"), "Expected generated CSS to define the Vanilla dark negative button hover token.");
  assert(css.includes("--vf-color-accent: #70bbc2;"), "Expected generated CSS to define the Vanilla dark accent token.");
  assert(css.includes("--bf-color-positive: var(--vf-color-border-positive, #0e8420);"), "Expected generated CSS to expose a public positive foreground alias from the semantic positive border token.");
  assert(css.includes("--bf-color-positive-background: var(--vf-color-background-positive-default, hsl(129deg 90% 39% / 10%));"), "Expected generated CSS to expose a public positive background alias from the semantic positive background token.");
  assert(css.includes("--bf-color-negative: var(--vf-color-border-negative, #c7162b);"), "Expected generated CSS to expose a public negative foreground alias from the semantic negative border token.");
  assert(css.includes("--bf-color-negative-background: var(--vf-color-background-negative-default, hsl(354deg 100% 39% / 10%));"), "Expected generated CSS to expose a public negative background alias from the semantic negative background token.");
  assert(css.includes("--bf-font-size-small: var(--bf-body-font-size,"), "Expected generated CSS to expose a public small-font alias from the active body role.");
  assert(css.includes("--bf-color-rule: var(--vf-color-border-low-contrast, rgba(0, 0, 0, 0.1));"), "Expected generated CSS to map Foundry separators to Vanilla's low-contrast border token.");
  assert(css.includes("--bf-color-accent: var(--vf-color-accent, #0f95a1);"), "Expected generated CSS to expose Foundry accent from Vanilla's semantic accent token.");
  assert(css.includes("--bf-color-brand: var(--vf-color-brand, #e95420);"), "Expected generated CSS to expose the Foundry brand token from Ubuntu orange.");
  assert(!css.includes("--bf-color-accent: var(--bf-color-link);"), "Expected generated CSS to avoid collapsing the accent token back onto the link token.");
  assert(css.includes(":where(.bf-theme) :where(a:visited) {\n  color: var(--bf-color-link-visited);"), "Expected generated CSS to style visited links through the semantic theme token.");
  assert(css.includes(":where(.bf-theme) :where(a:focus-visible) {\n  outline: 2px solid var(--bf-color-focus);"), "Expected generated CSS to style raw link focus with the semantic focus token.");
  assert(!css.includes("#f5f1e8"), "Expected generated CSS to avoid the old paper-like default background fallback.");
  assert(!css.includes("#0f62fe"), "Expected generated CSS to avoid the old non-Vanilla light link fallback.");
  assert(css.includes(`--bf-baseline-grid-color: ${BASELINE_GRID_DEFAULT_COLOR};`), "Expected baseline-grid overlays to declare a default line color.");
  assert(css.includes(`:where(.bf-theme).u-baseline-grid,\n:where(.bf-theme) .u-baseline-grid {\n  --bf-baseline-grid-color: ${BASELINE_GRID_LIGHT_THEME_COLOR};`), "Expected light themes to provide a subtle baseline-grid line color, even when the grid class is on the theme root.");

  if (css.includes(":where(.bf-theme.bf-tier-app) {")) {
    assert(!css.includes(":where(.bf-theme.bf-tier-app) :where(.bf-section),"), "Expected app tier to retain explicit bf-section boundaries.");
    assert(!css.includes(":where(.bf-theme.bf-tier-app) :where(.bf-stack) > *"), "Expected app stacks not to erase child rhythm.");
    assert(!css.includes(":where(.bf-theme.bf-tier-app) :where(.bf-cluster) > *"), "Expected app clusters not to erase child rhythm.");
    assert(!css.includes(":where(.bf-theme.bf-tier-app) :where(.bf-prose > *)"), "Expected app prose not to erase child rhythm.");
    assert(!css.includes(":where(.bf-theme.bf-tier-app) :where(.bf-stack.is-section)"), "Expected app stacks not to impersonate bf-section boundaries.");
  }
  assert(css.includes(`:where(.bf-theme.is-dark).u-baseline-grid,\n:where(.bf-theme.is-dark) .u-baseline-grid {\n  --bf-baseline-grid-color: ${BASELINE_GRID_DARK_THEME_COLOR};`), "Expected dark themes to provide a subtle baseline-grid line color, even when the grid class is on the theme root.");
  assert(css.includes(":where(.bf-theme) :where(img, picture, svg, video) {\n  block-size: auto;\n  display: block;\n  inline-size: auto;\n  max-inline-size: 100%;"), "Expected shared media to stay fluid inside narrow containers.");
  assert(css.includes("--bf-grid-columns: 16;"), "Expected the grid CSS to include the 16-column mode.");
  assert(css.includes(".bf-span-16"), "Expected the grid CSS to include the 16-column span class.");
  assert(!css.includes(".bf-span-12"), "Expected the grid CSS to omit the old 12-column span class.");
  assert(css.includes(":where(.bf-theme) :where(thead th) {\n  font-family: var(--bf-body-font-family"), "Expected CSS to style table headers as body-role text.");
  assert(css.includes("--bf-table-row-padding: var(--bf-body-nudge-start"), "Expected generated CSS to derive symmetric table row padding from the body nudge in nudged tiers.");
  assert(css.includes("--bf-table-row-line-height: calc(var(--bf-table-row-block-size) - (var(--bf-table-row-padding) * 2) - var(--bf-table-row-border-size));"), "Expected table row line-height to be solved from the row block size, symmetric padding, and in-box border.");
  assert(css.includes(":where(.bf-theme) :where(th, td) {\n  border: 0;\n  border-block-end: var(--bf-table-row-border-size) solid transparent;"), "Expected table cells to reserve border space inside the row box instead of relying on inset shadows.");
  assert(css.includes("padding-block: var(--bf-table-row-padding);"), "Expected table cells to use symmetric block padding from the shared table row padding variable.");
  assert(css.includes(":where(.bf-engine-cap)"), "Expected generated CSS to include the cap-engine demo override selector.");
  assert(css.includes(":where(.bf-theme.bf-tier-app)"), "Expected generated CSS to include the app-tier runtime flag selector.");
  assert(!css.includes("--bf-body-nudge-start: 0rem;\n  --bf-body-nudge-end: 0rem;"), "Expected built-in tiers to retain metric-derived body nudges.");
  assert(css.includes("--bf-body-nudge-start:") && css.includes("--bf-body-nudge-end:"), "Expected generated CSS to define body alignment nudge variables.");
  assert(css.includes("--bf-h6-nudge-start:") && css.includes("--bf-h6-nudge-end:"), "Expected generated CSS to define h6 alignment nudge variables.");
  assert(css.includes(":where(.bf-theme) :where(.bf-prose > :last-child) {\n  margin-bottom: 0;"), "Expected prose flow boundaries to trim semantic trailing space now that baseline compensation lives inside the element box.");
  assert(css.includes(".bf-prose li"), "Expected CSS to include list item selectors.");
  assert(css.includes(":where(.bf-theme) :where(.bf-prose li) {\n  margin: 0;\n  padding-block-end:"), "Expected list items to use literal baseline compensation.");
  assert(css.includes(":where(.bf-theme) :where(.bf-prose ul, .bf-prose ol) {\n  margin-bottom:"), "Expected list containers to use literal semantic spacing.");
  assert(!css.includes(".bf-prose li + li"), "Expected list spacing to avoid the old ad hoc inter-item margin.");
  for (const retiredModifier of ["is-extra-dense", "is-dense", "is-loose", "is-section-shallow", "is-section", "is-section-deep"]) {
    assert(!css.includes(`.bf-stack.${retiredModifier}`), `Expected retired stack modifier ${retiredModifier} to stay absent from every tier.`);
  }
  assert(css.includes("margin: 0 0 -1px;"), "Expected rules to cancel their 1px thickness so the next element keeps its own role-owned padding-block-start without an extra gap.");
  assert(css.includes("padding-block-end: var(--bf-strip-space);"), "Expected strip rhythm to live on the bottom edge only.");
  assert(!css.includes("padding-block: var(--bf-strip-space);"), "Expected strip rhythm to avoid symmetric top-and-bottom padding.");
  assert(css.includes(".bf-grid"), "Expected CSS to include grid selectors.");
  assert(css.includes(".bf-section"), "Expected CSS to include section selectors.");
  assert(css.includes(".bf-stack"), "Expected CSS to include stack selectors.");
  assert(!css.includes("NaN"), "Expected generated CSS to avoid NaN values from incomplete surface configuration.");
  assert(css.includes(".bf-stage-shell"), "Expected CSS to include the stage-shell helper.");
  assert(css.includes(".u-baseline-grid"), "Expected CSS to include the baseline grid utility.");
  assert(!css.includes("min-inline-size: 8em;"), "Expected text-like controls to avoid hard minimum widths that break narrow panels.");
  assert(css.includes("input[type='file'])::file-selector-button"), "Expected generated CSS to include dense file input styling.");
  assert(css.includes(":where(.bf-control) {\n  display: grid;\n  gap: var(--bf-field-gap);\n  min-inline-size: 0;"), "Expected form controls to allow shrinking inside narrow containers.");
  assert(css.includes(":where(.bf-field.is-checkbox) :where(.bf-control) {\n  gap: 0;"), "Expected checkbox field controls to avoid downstream gap overrides.");
  assert(css.includes("--bf-slider-track-offset: calc(var(--bf-body-nudge-start"), "Expected generated CSS to derive slider rail placement from the active body line geometry.");
  assert(css.includes("--bf-switch-track-offset: calc(var(--bf-body-nudge-start"), "Expected generated CSS to place switch geometry from the active body line geometry.");
  assert(css.includes("--bf-tick-box-offset: calc(var(--bf-body-nudge-start"), "Expected generated CSS to place tick geometry from the active body line geometry.");
  assert(css.includes("--bf-tick-label-offset: calc(var(--bf-control-visual-size) + var(--bf-control-inline-padding-field));"), "Expected generated CSS to derive tick label spacing from the field inline padding token.");
  assert(css.includes("min-block-size: var(--bf-tick-row-block-size);"), "Expected checkbox and radio rows to use the shared tick-row block-size variable.");
  assert(css.includes("--bf-control-block-padding:"), "Expected generated CSS to define the regular control block padding token.");
  assert(css.includes("--bf-control-block-padding-compact:"), "Expected generated CSS to define the compact control block padding token.");
  assert(css.includes("--bf-input-block-padding:"), "Expected generated CSS to define the tier-selectable input block padding token.");
  assert(css.includes("--bf-button-block-padding:"), "Expected generated CSS to define the tier-selectable button block padding token.");
  assert(css.includes("--bf-control-box-size: calc(var(--bf-body-line-height) + (var(--bf-control-block-padding) * 2));"), "Expected generated CSS to derive regular control box size from the control block padding token.");
  assert(css.includes("padding-block: max(0rem, calc(var(--bf-input-block-padding) - var(--bf-border-width)));"), "Expected bordered inputs to resolve block padding from the tier-selectable input padding token.");
  assert(css.includes("padding-block: max(0rem, calc(var(--bf-button-block-padding) - var(--bf-border-width)));"), "Expected bordered buttons to resolve block padding from the tier-selectable button padding token.");
  assert(css.includes(":where(.bf-theme) :where(.bf-button.is-positive) {\n  background-color: var(--bf-color-button-positive-default);"), "Expected generated CSS to define the bf-button.is-positive surface from the themed positive tokens.");
  assert(css.includes(":where(.bf-theme) :where(.bf-button.is-positive:hover) {\n  background-color: var(--bf-color-button-positive-hover);"), "Expected bf-button.is-positive to surface the themed positive hover token.");
  assert(css.includes(":where(.bf-theme) :where(.bf-button.is-positive:is(:active, [aria-pressed='true'])) {\n  background-color: var(--bf-color-button-positive-active);"), "Expected bf-button.is-positive to surface the themed positive active token.");
  assert(css.includes(":where(.bf-theme) :where(.bf-button.is-negative) {\n  background-color: var(--bf-color-button-negative-default);"), "Expected generated CSS to define the bf-button.is-negative surface from the themed negative tokens.");
  assert(css.includes(":where(.bf-theme) :where(.bf-button.is-negative:hover) {\n  background-color: var(--bf-color-button-negative-hover);"), "Expected bf-button.is-negative to surface the themed negative hover token.");
  assert(css.includes(":where(.bf-theme) :where(.bf-button.is-negative:is(:active, [aria-pressed='true'])) {\n  background-color: var(--bf-color-button-negative-active);"), "Expected bf-button.is-negative to surface the themed negative active token.");
  assert(css.includes(":where(.bf-theme) :where(.bf-button.is-link) {\n  background-color: transparent;\n  border: 0;\n  border-radius: 0;\n  color: var(--bf-color-link-default);"), "Expected generated CSS to define the bf-button.is-link surface from the shared link tokens.");
  assert(css.includes(":where(.bf-theme) :where(.bf-button.is-link:hover) {\n  background-color: transparent;\n  color: var(--bf-color-link-default);\n  text-decoration: underline;"), "Expected bf-button.is-link hover state to keep transparent chrome and restore underline treatment.");
  assert(css.includes(":where(.bf-theme) :where(.bf-button.is-icon) > :where(.bf-icon) {\n  margin: 0;"), "Expected generated CSS to keep button icons free of ambiguous text-node-sensitive edge margins.");
  assert(css.includes(":where(.bf-theme) :where(.bf-button.is-icon) {\n  align-items: center;\n  column-gap: var(--bf-space-1);"), "Expected bf-button.is-icon to use the shared spacing token for its explicit icon/label relationship.");
  assert(css.includes(":where(.bf-theme) :where(.bf-button-label) {\n  min-inline-size: 0;"), "Expected icon buttons to expose an explicit label slot so leading and trailing icons have identical spacing.");
  assert(css.includes(":where(.bf-theme) :where(.bf-cta-block) {\n  align-items: baseline;\n  column-gap: var(--bf-space-2);\n  display: flex;\n  flex-wrap: wrap;\n  margin-block-end: var(--bf-section-space-shallow);"), "Expected generated CSS to define the bf-cta-block element-owned layout.");
  assert(css.includes(":where(.bf-theme) :where(.bf-cta-block.is-bordered) {\n  border-block-start: var(--bf-border-width) solid var(--bf-color-border-low-contrast);\n  padding-block-start: calc(var(--bf-space-1) - var(--bf-border-width));"), "Expected bf-cta-block.is-bordered to add a top divider with snapped padding.");
  assert(css.includes(":where(.bf-theme) :where(.bf-equal-height-row) {\n  container-type: inline-size;\n  display: grid;\n  gap: var(--bf-grid-gap-block) var(--bf-grid-gap-inline);\n  /* Keep the logical track system on the query container itself."), "Expected generated CSS to define the bf-equal-height-row query container without an invalid self-query.");
  assert(css.includes("grid-template-columns: repeat(8, minmax(0, 1fr));"), "Expected bf-equal-height-row to expose its eight logical tracks at every width.");
  assert(css.includes(":where(.bf-theme) :where(.bf-equal-height-row-col) {\n  border-block-start: var(--bf-border-width) solid var(--bf-color-border-low-contrast);\n  display: grid;\n  grid-column: 1 / -1;\n  grid-row: span 4;\n  grid-template-rows: subgrid;"), "Expected bf-equal-height-row-col to span the narrow row and opt into subgrid alignment.");
  assert(css.includes(":where(.bf-theme) :where(.bf-equal-height-row-col.is-borderless) {\n  border-block-start: 0;\n}"), "Expected bf-equal-height-row-col.is-borderless modifier to drop the top border.");
  assert(css.includes(":where(.bf-theme) :where(.bf-equal-height-row.is-divider-1)::before {\n  grid-row: 2;\n}"), "Expected bf-equal-height-row.is-divider-1 to draw a cross-column rule on subgrid row 2.");
  assert(css.includes(":where(.bf-theme) :where(.bf-equal-height-row.is-divider-2)::after {\n  grid-row: 3;\n}"), "Expected bf-equal-height-row.is-divider-2 to draw a cross-column rule on subgrid row 3.");
  assert(!css.includes("bf-equal-heights") && !css.includes(".equal-heights"), "Expected equal-heights Sites recipe to reuse bf-equal-height-row without a duplicate CSS family.");
  assert(css.includes(":where(.bf-theme) :where(.bf-figure) {\n  display: block;\n  inline-size: 100%;\n  margin: 0 0 var(--bf-section-space-shallow);\n}"), "Expected bf-figure to own its bottom spacing via section-space-shallow.");
  assert(css.includes(":where(.bf-theme) :where(.bf-figure) > :where(img, picture, video, canvas) {\n  block-size: auto;\n  display: block;\n  inline-size: 100%;"), "Expected bf-figure to size embedded media to 100% of its container.");
  assert(css.includes(":where(.bf-theme) :where(.bf-figure-caption) {\n  color: var(--bf-color-text-default);\n  display: block;\n  font-style: italic;"), "Expected bf-figure-caption to render as an italic block beneath the media.");
  assert(css.includes(":where(.bf-theme) :where(.bf-aspect) {\n  aspect-ratio: 16 / 9;"), "Expected generated CSS to define the bf-aspect default 16:9 slot.");
  assert(css.includes(":where(.bf-theme) :where(.bf-aspect.is-16-9) {\n  aspect-ratio: 16 / 9;"), "Expected bf-aspect.is-16-9 modifier to apply the 16:9 ratio.");
  assert(css.includes(":where(.bf-theme) :where(.bf-aspect.is-3-2) {\n  aspect-ratio: 3 / 2;"), "Expected bf-aspect.is-3-2 modifier to apply the 3:2 ratio.");
  assert(css.includes(":where(.bf-theme) :where(.bf-aspect.is-2-3) {\n  aspect-ratio: 2 / 3;"), "Expected bf-aspect.is-2-3 modifier to apply the 2:3 ratio.");
  assert(css.includes(":where(.bf-theme) :where(.bf-aspect.is-cinematic) {\n  aspect-ratio: 12 / 5;"), "Expected bf-aspect.is-cinematic modifier to apply the 12:5 (2.4:1) ratio.");
  assert(css.includes(":where(.bf-theme) :where(.bf-aspect.is-square) {\n  aspect-ratio: 1 / 1;"), "Expected bf-aspect.is-square modifier to apply the 1:1 ratio.");
  assert(css.includes(":where(.bf-theme) :where(.bf-aspect) > :where(img, picture, video, canvas, iframe) {"), "Expected bf-aspect to make embedded media fill the slot.");
  assert(css.includes("padding-block: var(--bf-control-block-padding-compact);"), "Expected compact inline surfaces to use the compact control block padding token.");
  assert(css.includes(":where(.bf-theme) :where(.bf-grid.bf-grid.is-controls) {\n  container-type: inline-size;\n  gap: var(--bf-field-gap);"), "Expected grid CSS to include the dense control-grid recipe on top of bf-grid.");
  assert(css.includes(":where(.bf-theme):where(.bf-page, .bf-grid-scope,"), "Expected grid CSS to include a compound selector so container-type applies when the theme scope and grid-scope are on the same element.");
  assert(css.includes(":where(.bf-theme) :where(.bf-grid.bf-grid.is-controls) > :where(.bf-grid-item.is-control, .bf-grid-item.is-control-pair) {\n  grid-column: auto / span 4;"), "Expected grid CSS to include the default dense control-grid recipe spans.");
  assert(css.includes(":where(.bf-theme) :where(.bf-grid.bf-grid.is-controls) > :where(.bf-grid-item.is-control) {\n    grid-column: auto / span 2;"), "Expected the control-grid recipe to map compact field cells onto the 8-column grid.");
  assert(css.includes(":where(.bf-theme) :where(.bf-grid.bf-grid.is-controls) > :where(.bf-grid-item.is-control-pair) {\n    grid-column: auto / span 8;"), "Expected the control-grid recipe to keep paired inspector surfaces at half width on the 16-column grid.");
  assert(!css.includes(".bf-control-grid"), "Expected generated CSS to omit the deprecated bf-control-grid helper.");
  assert(css.includes(":where(.bf-theme) :where(.bf-field.is-range) {\n  align-items: start;\n  column-gap: calc(var(--bf-baseline) * 2);\n  display: grid;"), "Expected inline range fields to use the dedicated two-column field layout.");
  assert(css.includes(":where(.bf-theme) :where(.bf-slider.is-stacked),\n:where(.bf-theme) :where(.bf-field.is-range.is-stacked) :where(.bf-slider) {\n  align-items: stretch;\n  display: grid;\n  gap: var(--bf-field-gap);"), "Expected stacked slider pairs and stacked range fields to share the same stacked layout.");
  assert(!css.includes(".slider-pair"), "Expected compat CSS to omit the downstream slider wrapper aliases.");
  assert(!css.includes(".slider-pair--stacked"), "Expected compat CSS to omit the downstream stacked-slider alias.");
  assert(css.includes("inline-size: min(100%, 5rem);"), "Expected slider number inputs to use the compact PVR width.");
  assert(css.includes("flex-wrap: nowrap;"), "Expected inline slider pairs to stay on a single row until the field switches to the stacked variant.");
  assert(css.includes("flex: 0 1 5rem;"), "Expected slider number inputs to shrink before overflowing.");
  assert(!css.includes("min-inline-size: 5rem;"), "Expected slider number inputs to avoid a hard minimum width.");
  assert(css.includes(":where(.bf-switch-slider)"), "Expected generated CSS to include switch styling.");
  assert(css.includes(":where(.bf-validation-message)"), "Expected generated CSS to include validation message styling.");
  assert(!css.includes(".has-error"), "Expected generated CSS to omit the deprecated has-error validation alias.");
  assert(!css.includes(".has-success"), "Expected generated CSS to omit the deprecated has-success validation alias.");
  assert(!css.includes(".has-warning"), "Expected generated CSS to omit the deprecated has-warning validation alias.");
  assert(!/\.has-[a-z][a-z0-9-]*/.test(css), "Expected generated CSS to omit deprecated has-* helper selectors.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-card, .bf-card.is-highlighted, .bf-card.is-overlay, .bf-card.is-muted)", {
    "display": "flex",
    "flex-direction": "column",
    "gap": "var(--bf-field-gap)",
    "overflow": "auto"
  }, "card surfaces keep the shared stacked surface contract");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(a.bf-card, a.bf-card.is-highlighted, a.bf-card.is-overlay, a.bf-card.is-muted)", {
    "color": "inherit",
    "cursor": "pointer",
    "text-decoration": "none"
  }, "cards can act as linked surfaces without losing inherited text color");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-card-preview)", {
    "display": "grid",
    "overflow": "hidden",
    "position": "relative"
  }, "card preview slot stays available for the component atlas");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-card-preview-image)", {
    "display": "block",
    "object-fit": "contain",
    "object-position": "center"
  }, "card preview images stay centered inside the atlas preview slot");
  assert(css.includes(":where(.bf-segmented-control-button, .bf-tab-buttons-button)"), "Expected generated CSS to include segmented control buttons.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-breadcrumbs-items)", {
    "display": "flex",
    "flex-wrap": "wrap",
    "gap": "calc(var(--bf-baseline) * 0.5) calc(var(--bf-baseline) * 1.25)",
    "list-style": "none",
    "padding": "0"
  }, "breadcrumbs keep the canonical wrapped trail layout");
  assert(css.includes(":where(.bf-pagination-items)"), "Expected generated CSS to include pagination styling.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(table, .bf-table)", {
    "border-collapse": "separate",
    "caption-side": "bottom",
    "table-layout": "auto",
    "width": "100%"
  }, "tables keep the canonical BF table layout contract");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(th.is-icon-placeholder, td.is-icon-placeholder, .bf-table-cell.is-icon-placeholder)", {
    "padding-inline-start": "calc((var(--bf-baseline) * 0.75) + var(--bf-leading-icon-size) + var(--bf-leading-icon-gap))"
  }, "table icon-placeholder cells keep the leading-icon gutter");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-chip, .bf-chip.is-positive, .bf-chip.is-caution, .bf-chip.is-negative, .bf-chip.is-information)", {
    "--bf-ui-chip-border": "var(--bf-color-border-neutral)",
    "--bf-ui-chip-background": "var(--bf-color-background-neutral-default)",
    "display": "inline-flex",
    "white-space": "nowrap"
  }, "chips keep the canonical neutral token defaults and inline chip layout");
  assert(!css.includes("--bf-ui-chip-border: var(--bf-color-border-default);"), "Expected generated CSS to avoid using the generic default border token for neutral chips.");
  assert(!css.includes("--bf-ui-chip-background: var(--bf-color-background-hover);"), "Expected generated CSS to avoid using the generic hover background token for neutral chips.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-badge, .bf-badge.is-negative)", {
    "display": "inline-block",
    "text-align": "center",
    "text-indent": "0"
  }, "badges keep the canonical body-sized pill geometry");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-status-label, .bf-status-label.is-positive, .bf-status-label.is-caution, .bf-status-label.is-information, .bf-status-label.is-negative)", {
    "display": "inline-block",
    "text-decoration": "none",
    "white-space": "nowrap"
  }, "status labels keep the canonical inline label treatment");
  assert(css.includes("--bf-ui-badge-padding-inline: calc(var(--bf-body-line-height"), "Expected badge geometry to scale from the active body line-height rather than an h5 fallback.");
  assert(css.includes("min-width: calc(var(--bf-body-line-height"), "Expected badge minimum width to scale from the active body line-height.");
  assertSelectorUsesBodyTypography(css, ":where(.bf-theme) :where(.bf-chip-lead + .bf-chip-value)::before", "chip value separators");
  assertSelectorUsesBodyTypography(css, ":where(.bf-theme) :where(.bf-badge, .bf-badge.is-negative)", "badges");
  assertSelectorUsesBodyTypography(css, ":where(.bf-theme) :where(.bf-status-label, .bf-status-label.is-positive, .bf-status-label.is-caution, .bf-status-label.is-information, .bf-status-label.is-negative)", "status labels");
  assert(!css.includes(".bf-label"), "Expected generated CSS to omit the deprecated bf-label alias.");
  assert(css.includes(":where(.bf-modal.is-workflow)"), "Expected generated CSS to include the workflow modal variant.");
  assert(css.includes(":where(.bf-modal.is-workflow.is-resizable)"), "Expected generated CSS to include the resizable workflow modal modifier.");
  assert(css.includes("grid-template-rows: auto minmax(0, 1fr) auto;"), "Expected generated CSS to support the workflow modal fixed-header scrolling-body layout.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-panel.is-fill)", {
    "block-size": "100%",
    "max-inline-size": "none",
    "min-block-size": "0",
    "resize": "none"
  }, "fill-height panels resolve against the shell height instead of an unbounded minimum block size");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-panel.is-fill) > :where(.bf-panel-content)", {
    "min-block-size": "0",
    "overflow": "auto",
    "overscroll-behavior": "contain"
  }, "fill-height panel bodies scroll internally");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-search-box)", {
    "--bf-search-box-action-inline-size": "calc(1rem + (var(--bf-control-inline-padding-field) * 2))",
    "--bf-search-box-trailing-inline-size": "calc((var(--bf-search-box-action-inline-size) * 2) + var(--bf-border-width))",
    "display": "flex",
    "position": "relative"
  }, "search boxes keep the canonical inline search layout");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-search-box-input)", {
    "padding-inline-end": "var(--bf-search-box-trailing-inline-size)"
  }, "search boxes reserve trailing space from the field padding token rather than a hard-coded baseline multiple");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-search-and-filter)", {
    "display": "grid"
  }, "search-and-filter keeps the canonical outer grid shell");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-search-and-filter-box)", {
    "--bf-search-and-filter-action-inline-size": "calc(1rem + (var(--bf-control-inline-padding-field) * 2))",
    "--bf-search-and-filter-trailing-inline-size": "calc(var(--bf-search-and-filter-action-inline-size) * 2)",
    "display": "inline-flex",
    "flex": "1 1 12rem",
    "max-inline-size": "100%",
    "min-inline-size": "0"
  }, "search-and-filter boxes shrink inside narrow rails");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-search-and-filter-input)", {
    "padding-inline-end": "var(--bf-search-and-filter-trailing-inline-size)"
  }, "search-and-filter inputs reserve their trailing affordance space from the field padding token");
  assert(css.includes("--bf-disclosure-gap: 1rem;"), "Expected generated CSS to define the shared disclosure text-gap token.");
  assert(css.includes("--bf-disclosure-icon-inline-size: 1rem;"), "Expected generated CSS to define the shared disclosure icon-size token.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-side-navigation-accordion-button)", {
    "gap": "var(--bf-disclosure-gap)"
  }, "side-navigation accordion buttons use the shared disclosure gap instead of the generic compact row gap");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-accordion-tab)", {
    "gap": "var(--bf-disclosure-gap)"
  }, "accordion tabs use the shared disclosure gap instead of a pseudo-element margin");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-accordion-tab)::before", {
    "inline-size": "var(--bf-disclosure-icon-inline-size)"
  }, "accordion disclosure chevrons size from the shared disclosure icon token");
  assert(css.includes(":where(.bf-code-snippet)"), "Expected generated CSS to include code-snippet styling.");
  assert(css.includes(":where(.bf-code-snippet-block.is-icon) {\n  cursor: copy;"), "Expected generated CSS to include copyable code-snippet blocks.");
  assert(css.includes(":where(.bf-theme) :where(.bf-top-navigation-dropdown) {"), "Expected generated CSS to include the top-navigation dropdown container styling.");
  assert(css.includes(":where(.bf-theme) :where(.bf-top-navigation-dropdown-toggle)::after {"), "Expected generated CSS to include the top-navigation dropdown chevron styling.");
  assert(css.includes(":where(.bf-theme) :where(button.bf-top-navigation-dropdown-item) {"), "Expected generated CSS to include the top-navigation action-button dropdown item styling.");
  assert(css.includes(":where(.bf-theme) :where(.bf-top-navigation-dropdown-item-label) {"), "Expected generated CSS to include the top-navigation dropdown item label slot styling.");
  assert(css.includes(":where(.bf-theme) :where(.bf-top-navigation-dropdown-item-shortcut) {"), "Expected generated CSS to include the top-navigation dropdown item shortcut slot styling.");
  assert(css.includes(":where(.bf-theme) :where(.bf-top-navigation-dropdown > li.is-divider) {"), "Expected generated CSS to include the top-navigation dropdown divider styling.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-top-navigation-search-toggle)", {
    "min-inline-size": "var(--bf-top-navigation-search-toggle-inline-size)"
  }, "top-navigation search toggles size the icon-only action from the field padding token rather than a baseline multiple");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-top-navigation-dropdown-toggle)", {
    "padding-inline-end": "calc(var(--bf-top-navigation-link-padding-inline) + var(--bf-top-navigation-end-slot-inline-size))"
  }, "top-navigation dropdown toggles reserve their chevron slot from the shared end-slot token");
  // One baseline split across the row edges keeps the complete navigation bar
  // on each tier's own baseline, including the 4px app and OS tiers.
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-top-navigation-row)", {
    "display": "flex",
    "flex-direction": "column",
    "min-block-size": "var(--bf-navigation-bar-min-block-size)",
    "min-inline-size": "0",
    "padding-block": "calc(var(--bf-baseline) / 2)"
  }, "top-navigation row reserves one complete baseline across its block edges");
  assert(css.includes("transform: rotate(0deg);\n  transition: transform 160ms ease;"), "Expected closed top-navigation chevrons to point downward before expansion.");
  assert(css.includes(":where(.bf-theme) :where(.bf-top-navigation-item.is-dropdown-toggle.is-active) > :where(.bf-top-navigation-dropdown-toggle)::after {\n  transform: rotate(180deg);\n}"), "Expected active top-navigation chevrons to rotate upward after expansion.");
  assert(css.includes(":where(.bf-theme) :where(.bf-top-navigation-item.is-dropdown-toggle.is-active) > :where(.bf-top-navigation-dropdown) {"), "Expected generated CSS to include the active top-navigation dropdown reveal styling.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-icon)", {
    "background-size": "contain",
    "display": "inline-block",
    "transform": "var(--bf-icon-transform)"
  }, "icon base styling keeps the shared image-sized inline-block contract");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-icon.is-search)", {
    "--bf-icon-image": "var(--bf-ui-icon-search)"
  }, "search icons resolve from the shared search glyph token");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-icon.is-error-grey)", {
    "--bf-icon-image": "var(--bf-ui-icon-error-grey)"
  }, "error-grey icons resolve from the shared semantic glyph token");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-icon.is-success-grey)", {
    "--bf-icon-image": "var(--bf-ui-icon-success-grey)"
  }, "success-grey icons resolve from the shared semantic glyph token");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-icon.is-chevron-up)", {
    "--bf-icon-transform": "rotate(180deg)"
  }, "upward chevrons reuse the shared down glyph and rotate it in place");
  assert(css.includes(":where(.bf-theme) :where(.bf-list)"), "Expected generated CSS to include the base list styling.");
    assert(css.includes(":where(.bf-theme) :where(.bf-list-item.is-ticked, .bf-list-item.is-crossed) {"), "Expected generated CSS to include ticked and crossed list-item styling.");
  assert(css.includes(":where(.bf-theme) :where(.bf-inline-list)"), "Expected generated CSS to include the inline-list styling.");
  assert(css.includes(":where(.bf-theme) :where(.bf-skip-link)"), "Expected generated CSS to include the skip-link styling.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-list-tree)", {
    "list-style": "none"
  }, "list-tree root keeps list semantics reset");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-list-tree) :where(.bf-list-tree[aria-hidden='false'])", {
    "display": "block"
  }, "expanded list-tree branches reveal nested lists");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-list-tree-toggle[aria-expanded='true'])::before", {
    "transform": "rotate(0deg)"
  }, "expanded list-tree toggles rotate the chevron into the open state");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-tabs.is-equal)", {
    "--bf-ui-tabs-equal-min": "8rem"
  }, "equal-width tabs expose the canonical minimum track variable");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-tabs.is-equal) :where(.bf-tabs-list)", {
    "display": "grid",
    "gap": "calc(var(--bf-baseline) * 2)",
    "grid-template-columns": "repeat(auto-fit, minmax(min(100%, var(--bf-ui-tabs-equal-min)), 1fr))",
    "overflow": "visible",
    "white-space": "normal"
  }, "equal-width tabs keep the canonical auto-fit grid contract");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-choice-row)", {
    "display": "grid",
    "grid-template-columns": "auto minmax(0, 1fr) auto",
    "gap": "calc(var(--bf-baseline) * 0.75)",
    "padding-inline": "var(--bf-control-inline-padding-field)"
  }, "choice rows keep the canonical selection-row layout while tightening with the field padding token");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-inline-options)", {
    "border-bottom": "var(--bf-border-width) solid var(--bf-color-border-default)",
    "display": "grid",
    "gap": "var(--bf-field-gap)",
    "padding-inline": "var(--bf-panel-padding-inline)"
  }, "inline options keep the canonical stacked options panel layout");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-option-grid)", {
    "display": "grid",
    "grid-template-columns": "repeat(auto-fit, minmax(min(100%, 10rem), 1fr))"
  }, "option-grid keeps the canonical auto-fit card layout");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-option-card)", {
    "display": "grid",
    "min-block-size": "calc((var(--bf-control-box-size) * 2) + var(--bf-baseline))",
    "text-align": "left"
  }, "option-card keeps the canonical stacked selection-card treatment");
  assert(css.includes(":where(.bf-form-help.is-tight)"), "Expected generated CSS to include the tight helper-text modifier.");
  assert(css.includes("input[type='color'].bf-color-input"), "Expected generated CSS to include the compact color-input treatment.");
  assert(css.includes(":where(.bf-actions)"), "Expected generated CSS to include the canonical actions-row helper.");
  assert(!css.includes(".config-tabs"), "Expected compat CSS to omit the downstream equal-tab aliases.");
  assert(!css.includes(".output-profile-tabs"), "Expected compat CSS to omit the downstream output-profile tab alias.");
  assert(!css.includes(".preset-radio-row"), "Expected compat CSS to omit the downstream choice-row alias.");
  assert(!css.includes(".style-palette"), "Expected compat CSS to omit the downstream option-grid alias.");
  assert(!css.includes(".operator-selector"), "Expected compat CSS to omit the downstream inline-options alias.");
  assert(!css.includes(".control-help"), "Expected compat CSS to omit the downstream helper-text alias.");
  assert(!css.includes(".control-color"), "Expected compat CSS to omit the downstream color-input alias.");
  assert(!css.includes(".main-actions"), "Expected compat CSS to omit the downstream actions-row alias.");
  assert(!css.includes(".playback-export-actions"), "Expected compat CSS to omit the downstream nowrap-actions alias.");
  assert(!css.includes(".drawer-panel"), "Expected compat CSS to omit the downstream fill-height panel alias.");
  assert(css.includes(":where(.bf-contextual-menu, .bf-contextual-menu.is-left, .bf-contextual-menu.is-center)"), "Expected generated CSS to include contextual-menu styling.");
  assert(css.includes(":where(.bf-tooltip)"), "Expected generated CSS to include flat tooltip styling.");
  assert(!css.includes("[class*='bf-tooltip--']"), "Expected generated CSS to omit the retired BEM tooltip compatibility selector.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-panel-toggle)", {
    "appearance": "none",
    "background": "transparent",
    "border": "0",
    "display": "inline-flex",
    "padding-block": "var(--bf-control-block-padding-compact)"
  }, "panel toggle styling stays on the shared compact control contract");
  assert(css.includes(":where(.bf-application-overlay)"), "Expected generated CSS to include application drawer overlay styling.");
  assert(css.includes(":where(.bf-aside.is-overlay, .bf-aside.is-drawer)"), "Expected generated CSS to include overlay drawer aside styling.");
  assert(css.includes(".is-drawer-expanded"), "Expected compat CSS to include the drawer-expanded application state.");
  assert(css.includes("--bf-app-drawer-width-small: 15rem;"), "Expected generated CSS to expose the Canonical small drawer width.");
  assert(css.includes("--bf-app-drawer-width-small-max: 20rem;"), "Expected generated CSS to expose the Canonical small drawer maximum.");
  assert(css.includes("--bf-app-drawer-width-medium: 29.0625rem;"), "Expected generated CSS to expose the Canonical medium drawer width.");
  assert(css.includes("--bf-app-drawer-width-medium-max: 40rem;"), "Expected generated CSS to expose the Canonical medium drawer maximum.");
  assert(css.includes("--bf-app-drawer-width-large: min(100vw, max(40rem, 50vw));"), "Expected generated CSS to expose the Canonical large drawer width.");
  assert(css.includes("--bf-app-aside-width-min: var(--bf-app-drawer-width-small);"), "Expected generated CSS to expose the pinned-aside minimum width.");
  assert(css.includes("--bf-app-aside-width-max: var(--bf-app-drawer-width-medium-max);"), "Expected generated CSS to expose the pinned-aside maximum width.");
  assert(css.includes("--bf-application-aside-width-min: var(--bf-app-aside-width-min);"), "Expected generated CSS to expose the pinned-aside minimum width through the runtime alias.");
  assert(css.includes("--bf-application-aside-width-max: var(--bf-app-aside-width-max);"), "Expected generated CSS to expose the pinned-aside maximum width through the runtime alias.");
  assert(css.includes(".bf-aside.is-overlay.is-small"), "Expected generated CSS to expose the Canonical small overlay modifier.");
  assert(css.includes(".bf-aside.is-overlay.is-medium"), "Expected generated CSS to expose the Canonical medium overlay modifier.");
  assert(css.includes(".bf-aside.is-overlay.is-large"), "Expected generated CSS to expose the Canonical large overlay modifier.");
  assert(!css.includes(".bf-aside.is-overlay.is-narrow"), "Expected generated CSS to omit the old narrow overlay modifier.");
  assert(!css.includes(".bf-aside.is-overlay.is-wide"), "Expected generated CSS to omit the old wide overlay modifier.");
  assert(css.includes(":where(.bf-application-aside-resize-handle)"), "Expected generated CSS to include the pinned-aside resize handle selector.");
  assert(css.includes(":where(.bf-theme) :where(.bf-application-aside-resize-handle):focus-visible {\n  outline: 2px solid var(--bf-application-resize-handle-focus-ring);"), "Expected the pinned-aside resize handle to expose the shared authoring focus-ring token.");
  assert(css.includes("background: var(--bf-application-resize-handle-active);"), "Expected the pinned-aside resize handle active state to use the shared authoring accent token.");
  assert(css.includes("cursor: ew-resize;"), "Expected generated CSS to make the resize handle advertise horizontal resizing.");
  assert(css.includes("touch-action: none;"), "Expected generated CSS to make the resize handle safe for pointer dragging.");
  assert(css.includes(":where(.bf-application.is-resizing-aside)"), "Expected generated CSS to expose the resizing application state.");
  assert(!css.includes(".l-application"), "Expected generated CSS to omit legacy l-* application selectors.");
  assert(!css.includes(".l-navigation"), "Expected generated CSS to omit legacy l-* navigation selectors.");
  assert(!css.includes(".l-aside"), "Expected generated CSS to omit legacy l-* aside selectors.");
  assert(!css.includes(".l-main"), "Expected generated CSS to omit legacy l-* main-area selectors.");
  assert(!css.includes(".p-"), "Expected generated CSS to omit deprecated p-* selectors.");
  assert(!css.includes(".vr-"), "Expected generated CSS to omit deprecated vr-* selectors.");
  assert(!css.includes("[class*='p-"), "Expected generated CSS to omit deprecated p-* wildcard selectors.");
  assert(!css.includes("[class*='vr-"), "Expected generated CSS to omit deprecated vr-* wildcard selectors.");
  assert(!css.includes("--vr-"), "Expected generated CSS to omit deprecated vr-* runtime variables.");
}

function validateCommonTokens(tokens: Record<string, unknown>): {
  roles: Record<string, Record<string, unknown>>;
  layout: Record<string, unknown>;
  components: Record<string, unknown>;
  fontFiles: Array<Record<string, unknown>>;
} {
  const roles = (tokens.roles ?? {}) as Record<string, Record<string, unknown>>;
  const layout = (tokens.layout ?? {}) as Record<string, unknown>;
  const components = (tokens.components ?? {}) as Record<string, unknown>;
  const fontFiles = (tokens.fontFiles ?? []) as Array<Record<string, unknown>>;
  const roleNames = Object.keys(roles);

  assert(roleNames.length > 0, "Expected generated tokens to include typography roles.");
  assert(roleNames.every(roleName => roleName === "body" || /^h[1-6]$/.test(roleName)), "Expected generated tokens to stay on the canonical body + h1-h6 role set.");
  assert(roles.body, 'Expected generated tokens to include a "body" role.');
  assert(roles.h1 && roles.h2 && roles.h3 && roles.h4 && roles.h5 && roles.h6, "Expected generated tokens to include the standard heading roles.");
  assert(fontFiles.length > 0, "Expected generated tokens to include at least one font file.");
  assert(components.borderWidth, "Expected generated tokens to include component border width.");
  assert(components.barThickness === "0.1875rem", "Expected generated tokens to include the shared rem-based 3px emphasis-bar thickness.");
  assert(!("topNavigationBrandRegion" in components), "Expected generated tokens to remove the obsolete fixed navigation brand region.");
  assert(components.controlBlockPadding, "Expected generated tokens to include regular control block padding.");
  assert(components.controlCompactBlockPadding, "Expected generated tokens to include compact control block padding.");
  assert(components.controlInlinePadding, "Expected generated tokens to include component padding.");
  assert(components.controlInlinePaddingAction, "Expected generated tokens to include action-surface inline padding.");
  assert(components.controlInlinePaddingField, "Expected generated tokens to include field-surface inline padding.");
  assert(components.controlVisualSize, "Expected generated tokens to include component visual size.");
  assert(!("controlMinBlockSize" in components), "Expected generated tokens to stop exposing legacy control height tokens.");
  assert(!("controlMinBlockSizeDense" in components), "Expected generated tokens to stop exposing legacy dense control height tokens.");

  return { roles, layout, components, fontFiles };
}

function validateAppTierCss(css: string): void {
  assert(!css.includes("@font-face"), "Expected built-in app CSS to leave runtime font loading to consumers.");
  assert(!css.includes('UbuntuSans[wdth,wght].ttf'), "Expected built-in app CSS to avoid a URL to the unbundled development font.");
  assert(css.includes(':where(.bf-theme.bf-tier-app) {'), "Expected the app-tier preset CSS to expose the app-tier runtime selector.");
  assert(css.includes('--bf-app-demo-page-bg: var(--vf-color-background-alt, #f7f7f7);'), "Expected the app-tier preset CSS to expose the light application page background token through the shared semantic background token.");
  assert(css.includes(':where(.bf-theme.bf-tier-app) :where(.bf-form-label, .bf-form-help, .bf-button, .bf-button.is-base, .bf-status-label, .bf-chip, .bf-checkbox-label, .bf-radio-label, .bf-tabs-link, .bf-accordion-tab, .bf-validation-message)'), "Expected the app-tier preset CSS to restyle app controls toward the Canonical body-text treatment.");
  assert(css.includes(':where(.bf-panel.is-fill)'), "Expected the app-tier CSS to include the canonical fill-height panel helper.");
  assert(!css.includes('--bf-app-panel-shadow:'), "Expected the app-tier preset CSS to avoid a shared panel shadow token now that bf-panel no longer carries card chrome.");
  assert(!css.includes('box-shadow: var(--bf-app-panel-shadow);'), "Expected the app-tier preset CSS to avoid applying panel box shadows through bf-panel.");
  assert(!css.includes('.p-'), "Expected the app-tier preset CSS to omit deprecated p-* selectors.");
  assert(!css.includes('.vr-'), "Expected the app-tier preset CSS to omit deprecated vr-* selectors.");
}

function validateAppTierTheme(tokens: Record<string, unknown>, css: string): void {
  const roles = (tokens.roles ?? {}) as Record<string, Record<string, unknown>>;
  const layout = (tokens.layout ?? {}) as Record<string, unknown>;
  const components = (tokens.components ?? {}) as Record<string, unknown>;
  const fontFiles = (tokens.fontFiles ?? []) as Array<Record<string, unknown>>;

  assert(roles.body, 'Expected the app-tier preset tokens to include a "body" role.');
  assert(fontFiles.some(fontFile => fontFile.family === 'ubuntu-sans'), "Expected the app-tier preset tokens to include Ubuntu Sans font metadata.");
  const ubuntuFontFile = fontFiles.find(fontFile => fontFile.family === "ubuntu-sans") ?? {};
  assert(ubuntuFontFile.fontWeight === "100 800", "Expected app Ubuntu metadata to match the supported variable font weight axis.");
  assert(ubuntuFontFile.fontStretch === "75% 100%", "Expected app Ubuntu metadata to match the supported variable font width axis.");
  assert(ubuntuFontFile.emitFontFace === false, "Expected app built-in metadata to keep runtime font loading consumer-owned.");
  assert(roles.body.fontFamily === 'ubuntu-sans', "Expected the app-tier preset body role to use Ubuntu Sans.");
  assert(roles.body.fontSize === '0.875rem', "Expected the app-tier preset body role font size to be 0.875rem.");
  assert(roles.body.lineHeight === '1.25rem', "Expected the app-tier preset body role line height to be 1.25rem.");

  assert(roles.h1.fontSize === '1.5rem', "Expected the app-tier preset h1 role font size to be 1.5rem.");
  assert(roles.h2.fontWeight === 300, "Expected the app-tier preset h2 to use the lighter Ubuntu Sans pairing.");
  assert(layout.gridGapInline === '1.5rem', "Expected the app-tier preset inline grid gap token to stay at the 24px application gutter.");
  assert(layout.pageMargin === '2rem', "Expected the app-tier preset page margin token to follow the 32px application outer margin.");
  assert(components.controlBlockPadding === '0.5rem', "Expected the app-tier preset regular control block padding to preserve the 2.25rem control box height without a dedicated block-size token.");
  assert(components.controlCompactBlockPadding === '0.375rem', "Expected the app-tier preset compact control block padding to preserve the legacy 2rem inline control box height.");
  assert(components.controlInlinePadding === '0.5rem', "Expected the app-tier preset compatibility control padding alias to match the action-surface spacing.");
  assert(components.controlInlinePaddingAction === '0.5rem', "Expected the app-tier preset action padding to tighten for top-level commands.");
  assert(components.controlInlinePaddingField === '0.25rem', "Expected the app-tier preset field padding to tighten for dense data entry.");
  assert(!("controlMinBlockSize" in components), "Expected the app-tier preset tokens to stop exposing legacy control height tokens.");
  assert(!("controlMinBlockSizeDense" in components), "Expected the app-tier preset tokens to stop exposing legacy dense control height tokens.");
  assert(css.includes('.bf-h1'), "Expected the app-tier preset CSS to emit role utility selectors like the other presets.");
}

function validateIbmPlexEngineSmokeTheme(tokens: Record<string, unknown>, css: string): void {
  const { roles, layout } = validateCommonTokens(tokens);
  const fontFiles = (tokens.fontFiles ?? []) as Array<Record<string, unknown>>;

  assert(fontFiles.some(fontFile => fontFile.family === "ibm-plex-sans"), "Expected the IBM Plex smoke tokens to include IBM Plex Sans font metadata.");
  assert(roles.body.fontFamily === "ibm-plex-sans", "Expected the IBM Plex smoke body role to use IBM Plex Sans.");
  assert(roles.h1.fontSize === "8rem", "Expected the IBM Plex smoke h1 role font size to be 8rem.");
  assert(roles.h1.lineHeight === "9rem", "Expected the IBM Plex smoke h1 line height to be 9rem.");
  assert(roles.h2.fontSize === "4rem", "Expected the IBM Plex smoke h2 role font size to be 4rem.");
  assert(roles.h2.lineHeight === "5rem", "Expected the IBM Plex smoke h2 line height to be 5rem.");
  assert(layout.contentMaxWidth === "120rem", "Expected the IBM Plex smoke surface to widen the page for the large comparison headings.");
  assert(css.includes('font-family: "IBM Plex Sans";'), "Expected the IBM Plex smoke CSS to register the IBM Plex Sans family.");
  assert(css.includes('IBMPlexSansVar-Roman.woff'), "Expected the IBM Plex smoke CSS to point to the IBM Plex Sans variable font asset.");
  assert(css.includes('font-family: "Ubuntu Sans";'), "Expected the IBM Plex smoke CSS bundle to also register the Ubuntu Sans family for the alternate surface.");
  assert(css.includes('UbuntuSans[wdth,wght].ttf'), "Expected the IBM Plex smoke CSS bundle to point to the Ubuntu Sans variable font asset for the alternate surface.");
  assert(css.includes(':where(.bf-theme.bf-surface-ubuntu-engine-smoke) {'), "Expected the IBM Plex smoke CSS bundle to include the alternate Ubuntu scoped surface selector.");
}

function validateSurfaceManifest(manifest: Record<string, unknown>, expectedDefaultSurface: string): void {
  const defaultSurface = manifest.defaultSurface;
  const surfaces = (manifest.surfaces ?? {}) as Record<string, Record<string, unknown>>;
  const appSurface = surfaces.app ?? {};
  const appTokens = (appSurface.tokens ?? {}) as Record<string, unknown>;
  const appRoles = (appTokens.roles ?? {}) as Record<string, Record<string, unknown>>;
  const appMetrics = (appSurface.metrics ?? {}) as Record<string, unknown>;
  const appMetricElements = (appMetrics.elements ?? {}) as Record<string, Record<string, unknown>>;
  const osSurface = surfaces.os ?? {};
  const osTokens = (osSurface.tokens ?? {}) as Record<string, unknown>;
  const osRoles = (osTokens.roles ?? {}) as Record<string, Record<string, unknown>>;

  assertPortableSurfaceEntries(surfaces);
  assert(defaultSurface === expectedDefaultSurface, `Expected surfaces.json to default to "${expectedDefaultSurface}".`);
  assert(Object.keys(surfaces).length > 0, "Expected surfaces.json to expose at least one named surface.");
  assert(surfaces[expectedDefaultSurface], `Expected surfaces.json to include the default "${expectedDefaultSurface}" surface entry.`);
  assert(surfaces.editorial, 'Expected surfaces.json to include the "editorial" surface entry.');
  assert(surfaces.documentation, 'Expected surfaces.json to include the "documentation" surface entry.');
  assert(surfaces.app, 'Expected surfaces.json to include the "app" surface entry.');
  assert(surfaces.os, 'Expected surfaces.json to include the "os" surface entry.');
  assert(surfaces.editorial.className === "bf-tier-editorial", 'Expected the editorial surface to expose the bf-tier-editorial class hook.');
  assert(surfaces.documentation.className === "bf-tier-documentation", 'Expected the documentation surface to expose the bf-tier-documentation class hook.');
  assert(surfaces.app.className === "bf-tier-app", 'Expected the app surface to expose the bf-tier-app class hook.');
  assert(surfaces.os.className === "bf-tier-os", 'Expected the OS surface to expose the bf-tier-os class hook.');
  assert(surfaces.editorial.engine === "metrics-compensated", 'Expected the editorial surface engine to be "metrics-compensated".');
  assert(surfaces.documentation.engine === "metrics-compensated", 'Expected the documentation surface engine to be "metrics-compensated".');
  assert(surfaces.app.engine === "metrics-compensated", 'Expected the app surface engine to be "metrics-compensated".');
  assert(surfaces.os.engine === "metrics-compensated", 'Expected the OS surface engine to be "metrics-compensated".');
  assert(appRoles.body?.nudgeTop && appRoles.body.nudgeTop !== "0rem", "Expected the app surface runtime to retain its metric-derived body nudge.");
  assert(appRoles.body?.nudgeTop === appMetricElements.body?.nudgeTop, "Expected the app runtime body nudge to match its computed metric artifact.");
  assert(typeof osRoles.body?.nudgeTop === "string" && osRoles.body.nudgeTop !== "0rem", "Expected the OS surface runtime tokens to retain metrics-derived body nudges.");
}

function validateCustomSurfaceManifest(manifest: Record<string, unknown>, expectedDefaultSurface: string): void {
  const defaultSurface = manifest.defaultSurface;
  const surfaces = (manifest.surfaces ?? {}) as Record<string, Record<string, unknown>>;
  const expectedSurface = surfaces[expectedDefaultSurface] ?? {};
  const expectedMetrics = (expectedSurface.metrics ?? {}) as Record<string, unknown>;
  const expectedMetricElements = (expectedMetrics.elements ?? {}) as Record<string, Record<string, unknown>>;
  const ubuntuSurface = surfaces["ubuntu-engine-smoke"] ?? {};
  const ubuntuMetrics = (ubuntuSurface.metrics ?? {}) as Record<string, unknown>;
  const ubuntuMetricElements = (ubuntuMetrics.elements ?? {}) as Record<string, Record<string, unknown>>;
  const ubuntuTokens = (ubuntuSurface.tokens ?? {}) as Record<string, unknown>;
  const ubuntuRoles = (ubuntuTokens.roles ?? {}) as Record<string, Record<string, unknown>>;

  assertPortableSurfaceEntries(surfaces);
  assert(defaultSurface === expectedDefaultSurface, `Expected surfaces.json to default to "${expectedDefaultSurface}".`);
  assert(Object.keys(surfaces).length === 2, `Expected the custom experiment manifest to expose exactly two surfaces, got ${Object.keys(surfaces).length}.`);
  assert(expectedSurface, `Expected surfaces.json to include the custom "${expectedDefaultSurface}" surface entry.`);
  assert(expectedSurface.label === "IBM Plex Sans", "Expected the default custom experiment surface to expose the IBM Plex Sans label.");
  assert(expectedSurface.engine === "metrics-compensated", 'Expected the custom experiment default surface engine to be "metrics-compensated".');
  assert(expectedMetricElements.h1?.nudgeTop !== undefined, "Expected the custom experiment manifest to include the computed h1 metric entry.");
  assert(expectedMetricElements.h2?.nudgeTop !== undefined, "Expected the custom experiment manifest to include the computed h2 metric entry.");
  assert(expectedMetricElements.body?.nudgeTop && expectedMetricElements.body.nudgeTop !== "0rem", "Expected the custom experiment manifest to retain a non-zero body metric nudge.");
  assert(expectedMetricElements.h3?.nudgeTop && expectedMetricElements.h3.nudgeTop !== "0rem", "Expected the custom experiment manifest to retain a non-zero intermediate heading nudge.");
  assert(ubuntuSurface.label === "Ubuntu Sans", "Expected the alternate custom experiment surface to expose the Ubuntu Sans label.");
  assert(ubuntuSurface.className === "bf-surface-ubuntu-engine-smoke", "Expected the alternate custom experiment surface to expose the Ubuntu scoped class hook.");
  assert(ubuntuRoles.body?.fontFamily === "ubuntu-sans", "Expected the alternate custom experiment surface to use Ubuntu Sans body tokens.");
  assert(ubuntuRoles.h1?.fontSize === "8rem", "Expected the alternate custom experiment surface to keep the shared 8rem h1 scale.");
  assert(ubuntuRoles.h2?.lineHeight === "5rem", "Expected the alternate custom experiment surface to keep the shared 5rem h2 line-height.");
  assert(ubuntuMetricElements.h1?.nudgeTop !== undefined, "Expected the alternate custom experiment surface to include the computed h1 metric entry.");
  assert(ubuntuMetricElements.h2?.nudgeTop !== undefined, "Expected the alternate custom experiment surface to include the computed h2 metric entry.");
  assert(ubuntuMetricElements.body?.nudgeTop && ubuntuMetricElements.body.nudgeTop !== "0rem", "Expected the alternate custom experiment surface to retain a non-zero body metric nudge.");
}

function validateDocumentationTheme(tokens: Record<string, unknown>, css: string): void {
  const { roles, layout, components } = validateCommonTokens(tokens);
  const fontSizes = new Set(Object.values(roles).map(role => role.fontSize).filter(Boolean));

  assert(roles.body.fontFamily === "ubuntu-sans", "Expected the documentation tier body role to use ubuntu-sans.");
  assert(roles.body.fontSize === "0.875rem", "Expected the documentation tier body role font size to be 0.875rem.");
  assert(roles.body.lineHeight === "1.25rem", "Expected the documentation tier body line height to be 1.25rem.");
  assert(roles.h1.fontSize === "2rem", "Expected the documentation tier h1 role font size to be 2rem.");
  assert(roles.h2.fontWeight === 300, "Expected the documentation tier h2 to keep the lighter paired weight.");
  assert(roles.h3.fontSize === "1.5rem", "Expected the documentation tier h3 role font size to be 1.5rem.");
  assert(roles.h4.fontSize === "1.5rem", "Expected the documentation tier h4 role font size to be 1.5rem.");
  assert(roles.h5.fontSize === "1.125rem", "Expected the documentation tier h5 role font size to be 1.125rem.");
  assert(roles.h6.fontSize === "1.125rem", "Expected the documentation tier h6 role font size to be 1.125rem.");
  assert(fontSizes.size === 4, "Expected the documentation tier to expose distinct heading and body font sizes.");
  assert(layout.contentMaxWidth === "96rem", "Expected the documentation tier content width to widen to 96rem.");
  assert(layout.measure === "38rem", "Expected the documentation tier reading measure to tighten to 38rem.");
  assert(layout.gridGapInline === "1.5rem", "Expected the documentation tier inline grid gap token to be 1.5rem.");
  assert(layout.gridGapBlock === "1.5rem", "Expected the documentation tier block grid gap token to be 1.5rem.");
  assert(layout.pageMargin === "1.5rem", "Expected the documentation tier page margin token to be 1.5rem.");
  assert(layout.sectionSpace === "3rem", "Expected the documentation tier section rhythm to be 3rem.");
  assert(layout.sectionSpaceDeep === "6rem", "Expected the documentation tier deep section rhythm to be 6rem.");
  assert(components.controlBlockPadding === "0.5rem", "Expected the documentation tier regular control block padding to preserve the 2.25rem control box height without a dedicated block-size token.");
  assert(components.controlCompactBlockPadding === "0.375rem", "Expected the documentation tier compact control block padding to preserve the legacy 2rem inline control box height.");
  assert(components.controlInlinePadding === "1rem", "Expected the documentation tier compatibility control padding alias to match the action spacing.");
  assert(components.controlInlinePaddingAction === "1rem", "Expected the documentation tier action padding to stay comfortable.");
  assert(components.controlInlinePaddingField === "0.5rem", "Expected the documentation tier field padding to tighten relative to actions.");
  assert(components.controlVisualSize === "0.875rem", "Expected the documentation tier visual control size to tighten slightly.");
  assert(css.includes('.bf-h1'), "Expected the documentation tier CSS to emit role utility selectors.");
}

function validateLivingSpecHome(html: string): void {
  assert(html.includes('data-page-tier-options="editorial,documentation,app,os"'), "Expected index.html to declare the supported shared-bar tiers.");
  assert(html.includes('./dist/tiers/editorial/styles.css'), "Expected index.html to load the editorial tier output by default.");
  assert(html.includes('class="bf-grid is-guide"'), "Expected index.html to include BF-owned grid guide specimens.");
  assert(html.includes('bf-grid-scope'), "Expected index.html to include bf-grid-scope container query scopes.");
  assert(html.includes('class="bf-stack bf-grid-scope specimen-grid-scope is-grid-4"'), "Expected index.html to expose the 4-column breakpoint specimen through the shared resizable specimen classes.");
  assert(html.includes('class="bf-stack bf-grid-scope specimen-grid-scope is-grid-8"'), "Expected index.html to expose the 8-column breakpoint specimen through the shared resizable specimen classes.");
  assert(html.includes('class="bf-stack bf-grid-scope specimen-grid-scope is-grid-16"'), "Expected index.html to expose the 16-column breakpoint specimen through the shared resizable specimen classes.");
  assert(html.includes('bf-span-1'), "Expected index.html to include bf-span column spans.");
  assert(html.includes('<main class="bf-page is-fill"'), "Expected index.html to use the shared fill-height bf-page container.");
  assert(!html.includes('pc-grid-guide'), "Expected index.html to stop using the page-local pc-grid-guide helper.");
  assert(!html.includes('data-spec-chapter-nav'), "Expected index.html to stop behaving like a chapter overview page.");
  assert(!html.includes('bf-card'), "Expected index.html to avoid card framing on the screenshot-first home surface.");
  assert(!html.includes('Simple tier-switched specimens for the specs.'), "Expected index.html to avoid the old explanatory intro copy.");
  assert(!html.includes('Current tier snapshot'), "Expected index.html to avoid the old tier snapshot block.");
  assert(!html.includes('data-spec-tier-description'), "Expected index.html to avoid the old tier description text block.");
  assert(!html.includes('data-spec-tier-detail'), "Expected index.html to avoid the old tier detail text block.");
  assert(!html.includes('data-spec-status'), "Expected index.html to avoid the old live status text block.");
  assert(!html.includes('data-spec-token-list'), "Expected index.html to avoid the old token snapshot list.");
  assert(!html.includes('data-spec-card'), "Expected index.html to avoid ad hoc data-spec-card surfaces.");
  assert(!html.includes('data-spec-surface'), "Expected index.html to avoid boxed surface wrappers on the home page.");
  assert(!html.includes('data-spec-grid-stage'), "Expected index.html to avoid old data-spec-grid-stage specimens.");
}

function validateLivingSpecControls(html: string, css: string): void {
  assert(html.includes('data-page-tier-options="editorial,documentation,app,os"'), "Expected demo/controls.html to declare the supported shared-bar tiers.");
  assert(html.includes('../dist/tiers/app/styles.css'), "Expected demo/controls.html to default to the app tier output.");
  assert(html.includes('<main class="bf-page is-fill" id="controls-grid-target">'), "Expected demo/controls.html to use the shared fill-height bf-page container.");
  assert(html.includes('<h2>Core fields</h2>'), "Expected demo/controls.html to expose the core fields section heading.");
  assert(!html.includes('data-controls-hero'), "Expected demo/controls.html hero section to be removed.");
  assert(!html.includes('data-controls-summary'), "Expected demo/controls.html summary aside to be removed.");
  assert(html.includes('class="bf-search-and-filter"'), "Expected demo/controls.html to include the search-and-filter control family.");
  assert(html.includes('class="bf-segmented-control"'), "Expected demo/controls.html to include the segmented-control family.");
  assert(html.includes('bf-contextual-menu'), "Expected demo/controls.html to include the contextual-menu family.");
  assert(html.includes('class="bf-modal is-workflow is-resizable"'), "Expected demo/controls.html to include the workflow modal contract.");
  assert(html.includes('class="bf-controls-group"'), "Expected demo/controls.html to group controls with a demo-owned layout primitive instead of bf-panel wrappers.");
  assert(!html.includes('class="bf-panel"'), "Expected demo/controls.html to stop using decorative bf-panel wrappers.");
  assert(html.includes('src="./controls-page.js"'), "Expected demo/controls.html to boot through the dedicated controls-page runtime.");
  assert(!/\bp-[a-z][a-z0-9_-]*/.test(html), "Expected demo/controls.html to avoid deprecated p-* markup and stay fully bf-* dogfooded.");
  assert(!/\bvr-[a-z][a-z0-9_-]*/.test(html), "Expected demo/controls.html to avoid deprecated vr-* markup and stay fully bf-* dogfooded.");

  assert(css.includes('.bf-controls-panels {'), "Expected demo/controls-shell.css to define the top-level control-panel grid.");
  assert(css.includes('.bf-controls-group {'), "Expected demo/controls-shell.css to provide a plain layout wrapper for each controls group.");
  assert(!css.includes('.bf-controls-panel :where(.bf-panel) {'), "Expected demo/controls-shell.css to stop styling controls pages through bf-panel wrappers.");
  assert(css.includes('.bf-controls-menu-panel {'), "Expected demo/controls-shell.css to reserve extra space for contextual-menu dropdowns.");
  assert(!css.includes('.bf-controls-modal {'), "Expected demo/controls-shell.css to stop using a local modal width wrapper once workflow modal sizing ships upstream.");
}

function validateDefaultTheme(tokens: Record<string, unknown>, css: string): void {
  const { roles, layout, components } = validateCommonTokens(tokens);
  const fontSizes = new Set(Object.values(roles).map(role => role.fontSize).filter(Boolean));

  assert(roles.body.fontSize === "1rem", "Expected the prose default body role font size to be 1rem.");
  assert(roles.body.fontFamily === "ubuntu-sans", "Expected the prose default body role font family to be ubuntu-sans.");
  assert(roles.h1.fontSize === "2.625rem", "Expected the prose default h1 role font size to be 2.625rem.");
  assert(roles.h2.fontSize === "2.625rem", "Expected the prose default h2 role font size to be 2.625rem.");
  assert(roles.h3.fontSize === "1.5rem", "Expected the prose default h3 role font size to be 1.5rem.");
  assert(roles.h4.fontSize === "1.5rem", "Expected the prose default h4 role font size to be 1.5rem.");
  assert(roles.h5.fontSize === "1rem", "Expected the prose default h5 role font size to stay at the body size.");
  assert(roles.h6.fontSize === "1rem", "Expected the prose default h6 role font size to stay at the body size.");
  assert(roles.h1.fontWeight === 500, "Expected the prose default h1 to be the heavier member of the top pair.");
  assert(roles.h2.fontWeight === 200, "Expected the prose default h2 to sit 300 weight units below h1.");
  assert(roles.h3.fontWeight === 500, "Expected the prose default h3 to be the heavier member of the middle pair.");
  assert(roles.h4.fontWeight === 300, "Expected the prose default h4 to sit 200 weight units below h3.");
  assert(roles.h5.fontWeight === 550, "Expected the prose default h5 to use the canonical semi-bold weight.");
  assert(roles.h6.fontWeight === 550, "Expected the prose default h6 to use the canonical semi-bold weight.");
  assert(!roles.h5.textTransform, "Expected the prose default h5 to avoid uppercase now that canonical weights are used.");
  assert(roles.h5.fontVariantCaps === "all-small-caps", "Expected the prose default h5 to use true small-caps.");
  assert(!roles.h5.letterSpacing, "Expected the prose default h5 to avoid letterSpacing now that canonical weights are used.");
  assert(fontSizes.size === 3, "Expected the prose default theme to expose distinct heading and body font sizes.");
  assert(layout.gridGapInline === "1rem", "Expected the prose default inline grid gap token to provide the x-small 16px gutter.");
  assert(layout.gridGapBlock === "1rem", "Expected the prose default block grid gap token to provide the x-small 16px gap.");
  assert(layout.pageMargin === "1rem", "Expected the prose default page margin token to provide the x-small 16px margin.");
  assert(layout.sectionSpace === "4rem", "Expected the prose default section rhythm to be 4rem.");
  assert(components.radius === "0rem", "Expected the prose default controls to stay square, matching the compat visual direction.");
  assert(components.controlBlockPadding === "0.5rem", "Expected the prose default regular control block padding to preserve the 2.5rem editorial control box height without a dedicated block-size token.");
  assert(components.controlCompactBlockPadding === "0.25rem", "Expected the prose default compact control block padding to support tighter inline surfaces.");
  assert(components.controlVisualSize === "1rem", "Expected the prose default control glyphs to use a dedicated 1rem visual size.");

  for (const roleName of Object.keys(roles)) {
    assert(css.includes(`.bf-${roleName}`), `Expected generated CSS to include the configured "${roleName}" utility selector.`);
  }

  assert(!css.includes(".bf-lead"), "Expected CSS to avoid generating an implicit lead alias when no lead role is configured.");
  assert(css.includes(":where(.bf-theme) :where(.bf-eyebrow) {"), "Expected CSS to include the explicit editorial eyebrow component contract.");
  assert(!css.includes(".bf-meta"), "Expected CSS to avoid generating an implicit meta alias when no meta role is configured.");
}

function validateOsTheme(tokens: Record<string, unknown>, css: string): void {
  const { roles, layout, components, fontFiles } = validateCommonTokens(tokens);
  const fontSizes = new Set(Object.values(roles).map(role => role.fontSize).filter(Boolean));
  const ubuntuFontFile = fontFiles.find(fontFile => fontFile.family === "ubuntu-sans") ?? {};

  assert(roles.body.fontSize === "0.75rem", "Expected the OS tier body role font size to be 0.75rem.");
  assert(roles.body.lineHeight === "1rem", "Expected the OS tier body line height to be 1rem.");
  assert(roles.h1.fontSize === "1.5rem", "Expected the OS tier h1 role font size to be 1.5rem.");
  assert(roles.h2.fontSize === "1.5rem", "Expected the OS tier h2 role font size to be 1.5rem.");
  assert(roles.h1.lineHeight === "1.5rem", "Expected the OS tier h1 line height to be 1.5rem.");
  assert(roles.h2.lineHeight === "1.5rem", "Expected the OS tier h2 line height to be 1.5rem.");
  assert(roles.h3.fontSize === "1rem", "Expected the OS tier h3 role font size to be 1rem.");
  assert(roles.h4.fontSize === "1rem", "Expected the OS tier h4 role font size to be 1rem.");
  assert(roles.h3.lineHeight === "1rem", "Expected the OS tier h3 line height to be 1rem.");
  assert(roles.h4.lineHeight === "1rem", "Expected the OS tier h4 line height to be 1rem.");
  assert(roles.h5.fontSize === "0.75rem", "Expected the OS tier h5 role font size to stay at the compact body size.");
  assert(roles.h6.fontSize === "0.75rem", "Expected the OS tier h6 role font size to stay at the compact body size.");
  assert(roles.body.fontStack === '"Ubuntu Sans", "Segoe UI", system-ui, sans-serif', "Expected the OS tier body stack to match the other built-in tiers.");
  assert(ubuntuFontFile.fontWeight === "100 800", "Expected OS Ubuntu metadata to match the supported variable font weight axis.");
  assert(ubuntuFontFile.fontStretch === "75% 100%", "Expected OS Ubuntu metadata to match the supported variable font width axis.");
  assert(ubuntuFontFile.emitFontFace === false, "Expected OS built-in metadata to keep runtime font loading consumer-owned.");
  assert(roles.h1.fontWeight === 500, "Expected the OS tier h1 to be the heavier member of the top pair.");
  assert(roles.h2.fontWeight === 200, "Expected the OS tier h2 to sit 300 weight units below h1.");
  assert(roles.h3.fontWeight === 500, "Expected the OS tier h3 to be the heavier member of the middle pair.");
  assert(roles.h4.fontWeight === 300, "Expected the OS tier h4 to sit 200 weight units below h3.");
  assert(roles.h5.fontWeight === 550, "Expected the OS tier h5 to use the canonical semi-bold weight.");
  assert(roles.h6.fontWeight === 550, "Expected the OS tier h6 to use the canonical semi-bold weight.");
  assert(!roles.h5.textTransform, "Expected the OS tier h5 to avoid uppercase now that canonical weights are used.");
  assert(roles.h5.fontVariantCaps === "all-small-caps", "Expected the OS tier h5 to keep the editorial small-caps convention.");
  assert(!roles.h5.letterSpacing, "Expected the OS tier h5 to avoid extra letterSpacing.");
  assert(!roles.h6.fontVariantCaps, "Expected the OS tier h6 to remain plain text rather than small-caps.");
  assert(fontSizes.size === 3, "Expected the OS tier to stay on the canonical three-step editorial size ladder at denser values.");
  assert(layout.measure === "30rem", "Expected the OS tier reading measure to scale down to 30rem.");
  assert(layout.sectionSpace === "3rem", "Expected the OS tier section rhythm to scale down to 3rem.");
  assert(layout.sectionSpaceDeep === "6rem", "Expected the OS tier deep section rhythm to scale down to 6rem.");
  assert(layout.gridGapInline === "1rem", "Expected the OS tier inline grid gap token to provide the x-small 16px gutter.");
  assert(layout.gridGapBlock === "1rem", "Expected the OS tier block grid gap token to provide the x-small 16px gap.");
  assert(layout.pageMargin === "1rem", "Expected the OS tier page margin token to provide the x-small 16px margin.");
  assert(components.radius === "0rem", "Expected the OS tier controls to stay square like PVR/Vanilla.");
  assert(components.controlInlinePadding === "0.5rem", "Expected the OS tier compatibility control padding alias to match the action spacing.");
  assert(components.controlInlinePaddingAction === "0.5rem", "Expected the OS tier action padding to use the dense command target value.");
  assert(components.controlInlinePaddingField === "0.25rem", "Expected the OS tier field padding to stay tighter than action surfaces.");
  assert(components.controlVisualSize === "0.75rem", "Expected the OS tier checkbox/radio/thumb glyphs to use a dedicated 0.75rem visual size.");
  assert(components.fieldGap === "0.25rem", "Expected the OS tier field gap to come from the dense components block.");
  assert(components.panelPaddingInline === "1rem", "Expected the OS tier panel padding to come from the dense components block.");
  assert(components.panelPaddingBlock === "1rem", "Expected the OS tier panel padding to come from the dense components block.");
  assert(components.accordionIndent === "0.75rem", "Expected the OS tier accordion indent to come from the dense components block.");
  assert(components.controlBlockPadding === "0.375rem", "Expected the OS tier regular control block padding to preserve the legacy 1.75rem control box height without a dedicated block-size token.");
  assert(components.controlCompactBlockPadding === "0.25rem", "Expected the OS tier compact control block padding to preserve the legacy 1.5rem inline control box height.");

  assert(typeof roles.body.nudgeTop === "string" && css.includes(`--bf-body-nudge-start: ${roles.body.nudgeTop};`), "Expected compact list items to expose the OS tier body nudge.");
  assert(css.includes("padding-block: var(--bf-control-block-padding-compact);"), "Expected compact list items to use the compact control block padding token.");
  assert(css.includes("--bf-control-visual-size: 0.75rem;"), "Expected the OS tier CSS to expose a dedicated visual control size token.");
  assert(css.includes("block-size: var(--bf-control-visual-size);"), "Expected checkbox/radio/thumb visuals to size from the dedicated control visual token.");
}

function validateDemoContracts(engineSmokeHtml: string, componentShellCss: string, specShellCss: string, pageChromeCss: string): void {
  assertNoDuplicateClassAttributes("demo/components/engine-smoke.html", engineSmokeHtml);
  assert(engineSmokeHtml.includes('<body class="bf-theme is-dark" data-component-capture data-page-surface-mode="locked-manifest">'), "Expected engine-smoke.html to pin the generated IBM Plex manifest while still using the shared component chrome.");
  assert(engineSmokeHtml.includes('../../dist/experiments/ibm-plex-engine-smoke/styles.css'), "Expected engine-smoke.html to load the generated IBM Plex smoke stylesheet.");
  assert(engineSmokeHtml.includes('<title>Font Engine Smoke Demo</title>'), "Expected engine-smoke.html to describe the shared multi-font surface instead of a single IBM Plex page.");
  assert(engineSmokeHtml.includes('<strong>IBM Plex Sans</strong>') && engineSmokeHtml.includes('<strong>Ubuntu Sans</strong>'), "Expected engine-smoke.html to describe the IBM Plex and Ubuntu surface switch.");
  assert(engineSmokeHtml.includes('H1 = 8rem / 9rem') && engineSmokeHtml.includes('H2 = 4rem / 5rem'), "Expected engine-smoke.html to describe the oversized IBM Plex comparison scale.");
  assert(engineSmokeHtml.includes('class="bf-engine-metrics bf-span-4"'), "Expected engine-smoke.html to include the metrics runtime contract on the first specimen section.");
  assert(engineSmokeHtml.includes('class="bf-engine-cap bf-span-4"'), "Expected engine-smoke.html to include the cap runtime contract on the second specimen section.");
  assert(!engineSmokeHtml.includes("bf-tier-app"), "Expected engine-smoke.html to stay on its locked experiment manifest rather than a built-in tier.");
  assert(!/\bcomponent-demo-/.test(engineSmokeHtml), "Expected engine-smoke.html to avoid component-demo parasite classes.");
  assert(!/\bp-[a-z][a-z0-9_-]*/.test(engineSmokeHtml), "Expected engine-smoke.html to avoid deprecated p-* markup and stay fully bf-* dogfooded.");
  assert(!/\bvr-[a-z][a-z0-9_-]*/.test(engineSmokeHtml), "Expected engine-smoke.html to avoid deprecated vr-* markup and stay fully bf-* dogfooded.");
  assert(!componentShellCss.includes('.p-'), "Expected the sample-shell CSS to omit deprecated p-* selectors.");
  assert(!componentShellCss.includes('--vr-'), "Expected the sample-shell CSS to omit deprecated vr-* variables.");
  assert(!componentShellCss.includes('.demo-index-'), "Expected component-shell.css to stop carrying the component-atlas demo-index helper family.");
  assert(!specShellCss.includes('.spec-shell {'), "Expected the living-spec shell to stop carrying page framing through the local .spec-shell selector.");
  assert(!specShellCss.includes('.pc-grid-guide'), "Expected spec-shell.css to stop carrying the page-local pc-grid-guide helper.");
  assert(!specShellCss.includes("[data-spec-card]"), "Expected the living-spec shell to avoid ad hoc data-spec-card selectors.");
  assert(!specShellCss.includes("[data-spec-grid-card]"), "Expected the living-spec shell to avoid ad hoc grid-card selectors.");
  assert(!specShellCss.includes("[data-spec-surface]"), "Expected the living-spec shell to avoid boxed surface wrappers.");
  assert(!specShellCss.includes("[data-spec-home]"), "Expected the living-spec shell to avoid old data-spec-home selectors.");
  assert(!specShellCss.includes("[data-spec-switches]"), "Expected the living-spec shell to avoid old data-spec-switches selectors.");
  assert(!specShellCss.includes("[data-spec-grid-stage]"), "Expected the living-spec shell to avoid old data-spec-grid-stage selectors.");
  assert(/\.pc-controls\s*\{\s*flex-wrap:\s*nowrap;/.test(pageChromeCss), "Expected shared page-chrome controls to stay on one row when space is available.");
  assert(/@media\s*\(max-width:\s*56rem\)\s*\{[\s\S]*?\.pc-controls\s*\{\s*flex-wrap:\s*wrap;/.test(pageChromeCss), "Expected shared page-chrome controls to restore wrapping in the narrow-width fallback.");
}

function validateEngineIllustrationPage(pageCatalogJs: string, componentAtlasHtml: string, engineIllustrationHtml: string, componentShellCss: string): void {
  assertNoDuplicateClassAttributes("demo/components/index.html", componentAtlasHtml);
  assertNoDuplicateClassAttributes("demo/components/engine-illustration.html", engineIllustrationHtml);
  assert(pageCatalogJs.includes('{ title: "Baseline engine illustration", href: "/demo/components/engine-illustration.html" }'), "Expected the page catalog to register the baseline engine illustration page.");
  assert(componentAtlasHtml.includes('<a href="./engine-illustration.html"'), "Expected demo/components/index.html to link the baseline engine illustration page.");
  assert(engineIllustrationHtml.includes('<body class="bf-theme is-dark" data-page-surface-mode="locked-manifest">'), "Expected engine-illustration.html to pin the generated multi-font manifest while still using the shared component chrome.");
  assert(engineIllustrationHtml.includes('data-component-capture'), "Expected engine-illustration.html to expose a capture root for screenshot tooling.");
  assert(engineIllustrationHtml.includes('../../dist/experiments/ibm-plex-engine-smoke/styles.css'), "Expected engine-illustration.html to load the generated IBM Plex smoke stylesheet.");
  assert(engineIllustrationHtml.includes('<title>Baseline Engine Illustration</title>'), "Expected engine-illustration.html to expose the blog-companion page title.");
  assert(engineIllustrationHtml.includes('data-engine-mode="raw"') && engineIllustrationHtml.includes('data-engine-mode="metrics"') && engineIllustrationHtml.includes('data-engine-mode="cap"'), "Expected engine-illustration.html to expose raw, compensated, and cap comparison lanes.");
  assert(engineIllustrationHtml.includes('class="bf-card is-overlay bf-inline-size is-wide"'), "Expected engine-illustration.html to build the comparison lanes from BF-owned card primitives.");
  assert(engineIllustrationHtml.includes('data-engine-role-card="h1"') && engineIllustrationHtml.includes('data-engine-role-card="h2"'), "Expected engine-illustration.html to cover both H1 and H2 display roles.");
  assert(engineIllustrationHtml.includes('class="bf-card is-muted u-baseline-grid"'), "Expected engine-illustration.html to use the shared baseline-grid utility for specimen stages.");
  assert(engineIllustrationHtml.includes('class="bf-status-label is-caution"') && engineIllustrationHtml.includes('class="bf-status-label is-information"') && engineIllustrationHtml.includes('class="bf-status-label is-negative"'), "Expected engine-illustration.html to express lane states through BF-owned status-label variants.");
  assert(engineIllustrationHtml.includes('src="../engine-illustration.js"'), "Expected engine-illustration.html to boot the page-local comparison runtime.");
  assert(engineIllustrationHtml.includes('Largest cap delta'), "Expected engine-illustration.html to expose the numeric summary row.");
  assert(engineIllustrationHtml.includes('Not a buildable surface'), "Expected engine-illustration.html to describe itself as a static illustration rather than a shipped engine.");
  assert(!/class="[^"]*\bengine-illustration(?:-[a-z0-9_-]+)?\b/.test(engineIllustrationHtml), "Expected engine-illustration.html to stop using page-local engine-illustration helper classes.");
  assert(!componentShellCss.includes('.engine-illustration'), "Expected component-shell.css to stop carrying the page-local engine-illustration helper family.");
  assert(!engineIllustrationHtml.includes('bf-tier-app'), "Expected engine-illustration.html to stay off the app tier because it is a locked-manifest experiment page.");
  assert(!/\bp-[a-z][a-z0-9_-]*/.test(engineIllustrationHtml), "Expected engine-illustration.html to avoid deprecated p-* markup and stay fully bf-* dogfooded.");
  assert(!/\bvr-[a-z][a-z0-9_-]*/.test(engineIllustrationHtml), "Expected engine-illustration.html to avoid deprecated vr-* markup and stay fully bf-* dogfooded.");
}

function validateRangePage(rangeHtml: string, componentShellCss: string): void {
  validateBfOnlyDemoPage("range.html", rangeHtml);
  assert(rangeHtml.includes('class="bf-inline-size is-compact" data-overflow-container data-baseline-ignore="true"'), "Expected range.html to use the shared compact inline-size utility for the stacked rail wrapper.");
  assert(!/class="[^"]*\brange-demo-rail\b/.test(rangeHtml), "Expected range.html to stop using the page-local range-demo-rail helper class.");
  assert(!componentShellCss.includes('.range-demo-rail'), "Expected component-shell.css to stop carrying the page-local range-demo-rail helper.");
}

function validateComponentAtlasPage(componentAtlasHtml: string, componentAtlasJs: string): void {
  assert(componentAtlasHtml.includes('data-component-atlas-item'), "Expected demo/components/index.html to expose JS-only data hooks for atlas item enhancement.");
  assert(componentAtlasHtml.includes('<ul class="bf-grid">'), "Expected demo/components/index.html to use plain bf-grid lists instead of page-local atlas list wrappers.");
  assert(!componentAtlasHtml.includes('demo-index-'), "Expected demo/components/index.html to stop using the page-local demo-index helper classes.");
  assert(componentAtlasJs.includes('querySelectorAll("[data-component-atlas-item]")'), "Expected component-atlas.js to target atlas items through JS-only data hooks.");
  assert(componentAtlasJs.includes('link.classList.add("bf-card", "is-overlay", "is-preview")'), "Expected component-atlas.js to build atlas items from BF-owned card primitives.");
  assert(componentAtlasJs.includes('preview.classList.add("bf-card-preview")'), "Expected component-atlas.js to use the BF card preview slot.");
  assert(componentAtlasJs.includes('image.classList.add("bf-card-preview-image")'), "Expected component-atlas.js to use the BF card preview image slot.");
  assert(!componentAtlasJs.includes('demo-index-'), "Expected component-atlas.js to stop emitting the page-local demo-index helper classes.");
}

function validatePatternAtlasPage(
  patternAtlasHtml: string,
  componentAtlasHtml: string,
  componentAtlasJs: string,
  pageCatalogJs: string
): void {
  assertNoDuplicateClassAttributes("demo/patterns/index.html", patternAtlasHtml);
  assert(patternAtlasHtml.includes('<body class="bf-theme is-dark"'), "Expected the pattern atlas to dogfood the BF theme root.");
  assert(patternAtlasHtml.includes('data-component-capture'), "Expected the pattern atlas to expose a capture root.");
  assert(patternAtlasHtml.includes('data-demo-baseline-toggle'), "Expected the pattern atlas to expose the shared baseline-grid control.");
  assert(pageCatalogJs.includes('export const patternSections = ['), "Expected the page catalog to own a distinct patternSections registry.");
  assert(pageCatalogJs.includes('{ title: "Pattern atlas", href: "/demo/patterns/index.html" }'), "Expected the Pattern Atlas to be globally discoverable from the overview catalog.");
  assert(pageCatalogJs.includes('...patternSections,'), "Expected shared page chrome to include the pattern registry.");
  assert(componentAtlasHtml.includes('<a href="../patterns/index.html">Pattern atlas</a>'), "Expected the Component Atlas to link directly to the Pattern Atlas.");
  assert(componentAtlasJs.includes('querySelectorAll("[data-pattern-atlas-item]")'), "Expected the atlas enhancer to support semantic pattern items.");

  const expectedPatterns = [
    "article-pagination",
    "content-card",
    "data-spotlight",
    "divided-section",
    "credential-validation",
    "in-page-navigation",
    "logo-section",
    "media-object",
    "navigation-reduced",
    "notification",
    "table-expanding",
    "table-mobile-card",
    "table-of-contents",
    "table-sortable",
    "basic-section",
    "cta-section",
    "hero",
    "linked-logo-section",
    "quote-wrapper",
    "rich-list-horizontal",
    "rich-list-vertical",
    "tab-section",
    "text-spotlight",
    "empty-state",
    "equal-heights",
    "sticky-footer",
    "fluid-breakout"
  ];
  const patternLinks = [...patternAtlasHtml.matchAll(/data-pattern-atlas-item><a href="\.\.\/components\/([^"/]+)\.html"/g)].map(match => match[1]);
  assert(patternLinks.length === expectedPatterns.length, `Expected ${expectedPatterns.length} Pattern Atlas links; found ${patternLinks.length}.`);
  assert(new Set(patternLinks).size === patternLinks.length, "Expected Pattern Atlas routes to be unique.");
  for (const pattern of expectedPatterns) {
    assert(patternLinks.includes(pattern), `Expected the Pattern Atlas to expose ${pattern}.`);
    assert(!componentAtlasHtml.includes(`href="./${pattern}.html"`), `Expected ${pattern} to live only in the Pattern Atlas taxonomy.`);
  }

  for (const heading of ["Patterns", "Site compositions", "Recipes and layouts", "Documented exclusions"]) {
    assert(patternAtlasHtml.includes(`>${heading}<`), `Expected the Pattern Atlas to include the ${heading} group.`);
  }
  const exclusions = patternAtlasHtml.slice(patternAtlasHtml.indexOf('aria-labelledby="pattern-exclusions-title"'));
  assert(exclusions.length > 0 && !exclusions.includes('<a href='), "Expected exclusion dispositions to remain visible but unlinked.");
  for (const exclusion of ["Divider", "heading-icon", "matrix", "pull-quotes", "p-button--brand", "logo-block", "full-width layout"]) {
    assert(exclusions.includes(exclusion), `Expected the Pattern Atlas to document the ${exclusion} disposition.`);
  }
  assert(!/class="[^"]*\b(?:p|vr)-[a-z][a-z0-9_-]*/.test(patternAtlasHtml), "Expected the Pattern Atlas to avoid deprecated compatibility markup.");
}

function validateFormAtlasPage(formAtlasHtml: string, componentAtlasHtml: string, componentShellCss: string): void {
  validateBfOnlyDemoPage("form-atlas.html", formAtlasHtml);
  assert(formAtlasHtml.includes('<main class="bf-page" data-component-capture data-overflow-container>'), "Expected form-atlas.html to use the shared bf-page capture root instead of a page-local shell wrapper.");
  assert(formAtlasHtml.includes('class="bf-section is-shallow bf-cluster"'), "Expected form-atlas.html to use BF section/cluster rows instead of page-local layout wrappers.");
  assert(formAtlasHtml.includes('class="bf-inline-size is-compact bf-stack is-flush"'), "Expected form-atlas.html to use the shared bf-inline-size utility for bounded reference columns.");
  assert(formAtlasHtml.includes('class="bf-control bf-inline-size is-compact"'), "Expected form-atlas.html to use the shared bf-inline-size utility for compact control columns.");
  assert(formAtlasHtml.includes('class="bf-search-box bf-inline-size is-regular"'), "Expected form-atlas.html to use the shared bf-inline-size utility for paired search controls.");
  assert(!/class="[^"]*\bform-atlas(?:-[a-z0-9_-]+)?\b/.test(formAtlasHtml), "Expected form-atlas.html to stop using the page-local form-atlas helper classes.");
  assert(!componentShellCss.includes('.form-atlas'), "Expected component-shell.css to stop carrying the page-local form-atlas helper family.");
  assert(componentAtlasHtml.includes('data-demo-meta="Reference paragraph plus BF cluster rows for quick control baseline inspection."'), "Expected the component atlas to describe form-atlas through the BF cluster-row contract.");
}

function validateButtonDemo(buttonHtml: string): void {
  validateBfOnlyDemoPage("button.html", buttonHtml);
  assert(buttonHtml.includes('data-baseline-label="icon-only button stacked 1"'), "Expected button.html to include an icon-only button specimen for dense-surface verification.");
  assert(buttonHtml.includes('data-baseline-label="icon-only button stacked 2"'), "Expected button.html to include a second icon-only button specimen so both neutral and negative icon-only states stay visible in QA.");
}

function validateBfOnlyDemoFamily(demoPages: Record<string, string>): void {
  validateBfOnlyDemoPage("tabs.html", demoPages.tabs);
  validateBfOnlyDemoPage("panel-tabs.html", demoPages.panelTabs);
  validateBfOnlyDemoPage("accordion.html", demoPages.accordion);
  validateBfOnlyDemoPage("contextual-menu.html", demoPages.contextualMenu);
  validateBfOnlyDemoPage("tooltip.html", demoPages.tooltip);
  validateBfOnlyDemoPage("icon.html", demoPages.icon);
  validateBfOnlyDemoPage("list.html", demoPages.list);
  validateBfOnlyDemoPage("inline-list.html", demoPages.inlineList);
  validateBfOnlyDemoPage("tiered-list.html", demoPages.tieredList);
  validateBfOnlyDemoPage("cta-block.html", demoPages.ctaBlock);
  validateBfOnlyDemoPage("equal-height-row.html", demoPages.equalHeightRow);
  validateBfOnlyDemoPage("figure.html", demoPages.figure);
  validateBfOnlyDemoPage("aspect.html", demoPages.aspect);
  validateBfOnlyDemoPage("table.html", demoPages.table);
  validateBfOnlyDemoPage("list-tree.html", demoPages.listTree);
  validateBfOnlyDemoPage("code-snippet.html", demoPages.codeSnippet);
  validateBfOnlyDemoPage("skip-link.html", demoPages.skipLink);
  validateBfOnlyDemoPage("top-navigation.html", demoPages.topNavigation);
}

function validateParitySurfaceDemos(iconHtml: string, listHtml: string, tableHtml: string): void {
  assert(iconHtml.includes("is-success-grey"), "Expected icon.html to demo the success-grey glyph.");
  assert(iconHtml.includes("is-error-grey"), "Expected icon.html to demo the error-grey glyph.");
  assert(listHtml.includes("is-ticked"), "Expected list.html to demo ticked list items.");
  assert(listHtml.includes("is-crossed"), "Expected list.html to demo crossed list items.");
  assert(tableHtml.includes("is-icon-placeholder"), "Expected table.html to demo icon-placeholder cells.");
}

function validateTopNavigationDemo(topNavigationHtml: string): void {
  assert(topNavigationHtml.includes('class="bf-top-navigation is-grid-aligned is-sticky"'), "Expected top-navigation.html to exercise the grid-aligned navigation contract.");
  assert(topNavigationHtml.includes('class="bf-top-navigation-logo is-canonical-tagged"'), "Expected top-navigation.html to exercise the canonical tagged-logo contract.");
  assert(topNavigationHtml.includes('viewBox="0 0 60.45 57.87"'), "Expected the tagged-logo demo to use a proportionate Circle of Friends source shape.");
  assert(topNavigationHtml.includes("bf-top-navigation-dropdown-toggle"), "Expected top-navigation.html to demo dropdown toggles.");
  assert(topNavigationHtml.includes("bf-top-navigation-dropdown"), "Expected top-navigation.html to demo dropdown containers.");
  assert(topNavigationHtml.includes("bf-top-navigation-dropdown-item"), "Expected top-navigation.html to demo dropdown items.");
  assert(topNavigationHtml.includes("bf-top-navigation-dropdown-item-label"), "Expected top-navigation.html to demo dropdown action labels.");
  assert(topNavigationHtml.includes("bf-top-navigation-dropdown-item-shortcut"), "Expected top-navigation.html to demo dropdown action shortcuts.");
  assert(topNavigationHtml.includes('class="is-divider" role="separator"'), "Expected top-navigation.html to demo dropdown separators.");
  assert(topNavigationHtml.includes("<button class=\"bf-top-navigation-dropdown-item\" type=\"button\">"), "Expected top-navigation.html to demo button-based dropdown action rows.");
  assert(topNavigationHtml.includes("bf-top-navigation-dropdown is-right"), "Expected top-navigation.html to demo the right-aligned dropdown variant.");
}

function validateApplicationShellDemo(applicationShellHtml: string): void {
  assert(applicationShellHtml.includes('class="bf-panel is-fill"'), "Expected application-shell.html to demo the canonical fill-height panel modifier in a pinned-aside shell.");
  assert(applicationShellHtml.includes('block-size:calc(var(--bf-baseline)*72);min-block-size:calc(var(--bf-baseline)*72)'), "Expected application-shell.html to keep a fixed shell height so the fill-height panel contract is observable.");
  assert(applicationShellHtml.includes('Recent exports'), "Expected application-shell.html to include enough inspector content to exercise the internal panel scroll path.");
}

function validateTypographicSpecimen(pageCatalogJs: string, specimenHtml: string): void {
  assert(pageCatalogJs.includes('{ title: "Typographic specimen", href: "/demo/spec/typographic-specimen.html" }'), "Expected the page catalog to register the typographic specimen chapter.");
  assert(specimenHtml.includes('<body class="bf-theme bf-tier-editorial" data-page-tier-options="editorial,documentation,app,os">'), "Expected typographic-specimen.html to boot as a shared tier-switching spec page.");
  assert(specimenHtml.includes('<main class="bf-page is-fill" id="spec-grid-target">'), "Expected typographic-specimen.html to use the shared fill-height bf-page container.");
  assert(specimenHtml.includes('<a href="./typographic-specimen.html" aria-current="page">Specimen</a>'), "Expected typographic-specimen.html to expose the current-page spec nav link.");
  assert(specimenHtml.includes('<a href="../panel.html">OS tier</a>'), "Expected typographic-specimen.html to link the first-class OS tier from the local spec nav.");
  assert(specimenHtml.includes('class="bf-fixed-width"'), "Expected typographic-specimen.html to use the shared fixed-width wrapper for the hero prose block.");
  assert(specimenHtml.includes('class="bf-fixed-width bf-grid-scope"'), "Expected typographic-specimen.html to use the shared fixed-width grid-scope wrapper for multi-column specimen sections.");
  assert(specimenHtml.includes('class="bf-span-4 bf-prose"'), "Expected typographic-specimen.html to use shared grid spans for the specimen columns.");
  assert(!specimenHtml.includes('specimen-hero'), "Expected typographic-specimen.html to stop using the page-local specimen-hero helper.");
  assert(!specimenHtml.includes('specimen-meta'), "Expected typographic-specimen.html to stop using the page-local specimen-meta helper.");
  assert(!specimenHtml.includes('specimen-columns'), "Expected typographic-specimen.html to stop using the page-local specimen-columns helper.");
  assert(!specimenHtml.includes('specimen-column'), "Expected typographic-specimen.html to stop using the page-local specimen-column helper.");
  assert(!specimenHtml.includes('bf-panel'), "Expected typographic-specimen.html to avoid decorative panel wrappers.");
  assert(!specimenHtml.includes('bf-card'), "Expected typographic-specimen.html to avoid decorative card wrappers.");
}

function validateGridSpecPage(gridSpecHtml: string, specShellCss: string): void {
  assert(gridSpecHtml.includes('<body class="bf-theme bf-tier-editorial" data-page-tier-options="editorial,documentation,app,os">'), "Expected grid.html to boot as a shared tier-switching spec page.");
  assert(gridSpecHtml.includes('class="bf-stack bf-grid-scope specimen-grid-scope is-grid-4"'), "Expected grid.html to expose the 4-column breakpoint specimen through an explicit specimen class.");
  assert(gridSpecHtml.includes('class="bf-stack bf-grid-scope specimen-grid-scope is-grid-8"'), "Expected grid.html to expose the 8-column breakpoint specimen through an explicit specimen class.");
  assert(gridSpecHtml.includes('class="bf-stack bf-grid-scope specimen-grid-scope is-grid-16"'), "Expected grid.html to expose the 16-column breakpoint specimen through an explicit specimen class.");
  assert(gridSpecHtml.includes('class="bf-grid is-guide"'), "Expected grid.html to use the BF-owned grid guide modifier on breakpoint specimens.");
  assert(specShellCss.includes('.specimen-grid-scope {'), "Expected spec-shell.css to define the shared resizable breakpoint specimen shell.");
  assert(specShellCss.includes('resize: horizontal;'), "Expected spec-shell.css to keep the breakpoint specimen resizable.");
  assert(specShellCss.includes('overflow: hidden;'), "Expected spec-shell.css to keep the breakpoint specimen resizable by clipping overflow.");
  assert(specShellCss.includes('min-inline-size: 15rem;'), "Expected spec-shell.css to keep the breakpoint specimen minimum width.");
  assert(/\.specimen-grid-scope\.is-grid-4\s*\{\s*inline-size:\s*38\.6875rem;/.test(specShellCss), "Expected spec-shell.css to seed the 4-column specimen at the 619px breakpoint edge.");
  assert(/\.specimen-grid-scope\.is-grid-8\s*\{\s*inline-size:\s*64\.6875rem;/.test(specShellCss), "Expected spec-shell.css to seed the 8-column specimen at the 1035px breakpoint edge.");
  assert(/\.specimen-grid-scope\.is-grid-16\s*\{\s*inline-size:\s*105\.0625rem;/.test(specShellCss), "Expected spec-shell.css to seed the 16-column specimen at the 1681px breakpoint edge.");
  assert(!gridSpecHtml.includes('pc-grid-guide'), "Expected grid.html to stop using the page-local pc-grid-guide helper.");
}

function validateOsTierPage(pageCatalogJs: string, panelHtml: string): void {
  assert(pageCatalogJs.includes('{ title: "OS tier", href: "/demo/panel.html" }'), "Expected the page catalog to register the OS tier page.");
  assert(panelHtml.includes('<title>Baseline Foundry OS Tier</title>'), "Expected demo/panel.html to present the OS tier title.");
  assert(panelHtml.includes('../dist/tiers/editorial/styles.css'), "Expected demo/panel.html to bootstrap from the shared built-in tier stylesheet.");
  assert(!panelHtml.includes('dist/presets/panel/styles.css'), "Expected demo/panel.html to stop bootstrapping from the legacy panel preset bundle.");
  assert(panelHtml.includes('<body class="bf-theme bf-tier-os" data-page-tier-options="editorial,documentation,app,os" data-page-tier-default="os" data-page-baseline-default="on">'), "Expected demo/panel.html to boot as the OS tier under the shared header contract.");
  assert(panelHtml.includes('data-spec-artifact="css"'), "Expected demo/panel.html to expose the active stylesheet artifact link.");
  assert(panelHtml.includes('data-spec-artifact="tokens"'), "Expected demo/panel.html to expose the active tokens artifact link.");
  assert(panelHtml.includes('data-spec-role-list'), "Expected demo/panel.html to expose the shared spec role list hook.");
  assert(panelHtml.includes('data-spec-status'), "Expected demo/panel.html to expose the shared spec status hook.");
  assert(panelHtml.includes('src="./spec-shell.js"'), "Expected demo/panel.html to boot through the shared spec runtime.");
  assert(!panelHtml.includes('fetch("../dist/presets/panel/tokens.json")'), "Expected demo/panel.html to drop its old page-local panel token fetch.");
}

async function main(): Promise<void> {
  const packageJson = JSON.parse(await readTextArtifact(path.resolve("package.json"))) as Record<string, unknown>;
  const viteConfigTs = await readTextArtifact(path.resolve("vite.config.ts"));
  const surfacesManifestDoc = await readTextArtifact(path.resolve("docs/surfaces-manifest.md"));
  const readmeMd = await readTextArtifact(path.resolve("README.md"));
  const defaultTheme = await readThemeArtifacts(path.resolve("dist"));
  const editorialTier = await readThemeArtifacts(path.resolve("dist/tiers/editorial"));
  const documentationTier = await readThemeArtifacts(path.resolve("dist/tiers/documentation"));
  const appTier = await readThemeArtifacts(path.resolve("dist/tiers/app"));
  const osTier = await readThemeArtifacts(path.resolve("dist/tiers/os"));
  const prosePreset = await readThemeArtifacts(path.resolve("dist/presets/prose"));
  const appTierPreset = await readThemeArtifacts(path.resolve("dist/presets/app-tier"));
  const ibmPlexEngineSmoke = await readThemeArtifacts(path.resolve("dist/experiments/ibm-plex-engine-smoke"));
  const indexDts = await readTextArtifact(path.resolve("dist/index.d.ts"));
  const renewalComponentPages = Object.fromEntries(await Promise.all([
    "article-pagination",
    "aspect",
    "basic-section",
    "cta-section",
    "data-spotlight",
    "divided-section",
    "docs-layout",
    "in-page-navigation",
    "navigation-reduced",
    "notice",
    "credential-validation",
    "notification",
    "logo-section",
    "linked-logo-section",
    "media-object",
    "content-card",
    "table-sortable",
    "table-expanding",
    "table-mobile-card",
    "page-shell",
    "search-and-filter",
    "table-of-contents",
    "text-spotlight",
    "tiered-list",
    "hero",
    "quote-wrapper",
    "rich-list-horizontal",
    "rich-list-vertical",
    "fluid-breakout",
    "tab-section",
    "sticky-footer",
    "equal-heights",
    "empty-state"
  ].map(async pageName => [pageName, await readTextArtifact(path.resolve("demo/components", `${pageName}.html`))])));
  const [engineSmokeHtml, engineIllustrationHtml, formAtlasHtml, rangeHtml, buttonHtml, componentAtlasJs, componentDemoJs, componentShellCss, specShellCss, pageChromeCss, pageCatalogJs, controlsShellCss, applicationShellHtml, applicationLayoutHtml, tabsHtml, panelTabsHtml, accordionHtml, sideNavigationHtml, topNavigationHtml, contextualMenuHtml, tooltipHtml, iconHtml, listHtml, inlineListHtml, tieredListHtml, ctaBlockHtml, equalHeightRowHtml, figureHtml, aspectHtml, tableHtml, listTreeHtml, codeSnippetHtml, skipLinkHtml, demoIndexHtml, componentAtlasHtml, patternAtlasHtml, demoControlsHtml, typographicSpecimenHtml, gridSpecHtml, panelHtml] = await Promise.all([
    readTextArtifact(path.resolve("demo/components/engine-smoke.html")),
    readTextArtifact(path.resolve("demo/components/engine-illustration.html")),
    readTextArtifact(path.resolve("demo/components/form-atlas.html")),
    readTextArtifact(path.resolve("demo/components/range.html")),
    readTextArtifact(path.resolve("demo/components/button.html")),
    readTextArtifact(path.resolve("demo/component-atlas.js")),
    readTextArtifact(path.resolve("demo/component-demo.js")),
    readTextArtifact(path.resolve("demo/component-shell.css")),
    readTextArtifact(path.resolve("demo/spec-shell.css")),
    readTextArtifact(path.resolve("demo/page-chrome.css")),
    readTextArtifact(path.resolve("demo/page-catalog.js")),
    readTextArtifact(path.resolve("demo/controls-shell.css")),
    readTextArtifact(path.resolve("demo/components/application-shell.html")),
    readTextArtifact(path.resolve("demo/components/application-layout.html")),
    readTextArtifact(path.resolve("demo/components/tabs.html")),
    readTextArtifact(path.resolve("demo/components/panel-tabs.html")),
    readTextArtifact(path.resolve("demo/components/accordion.html")),
    readTextArtifact(path.resolve("demo/components/side-navigation.html")),
    readTextArtifact(path.resolve("demo/components/top-navigation.html")),
    readTextArtifact(path.resolve("demo/components/contextual-menu.html")),
    readTextArtifact(path.resolve("demo/components/tooltip.html")),
    readTextArtifact(path.resolve("demo/components/icon.html")),
    readTextArtifact(path.resolve("demo/components/list.html")),
    readTextArtifact(path.resolve("demo/components/inline-list.html")),
    readTextArtifact(path.resolve("demo/components/tiered-list.html")),
    readTextArtifact(path.resolve("demo/components/cta-block.html")),
    readTextArtifact(path.resolve("demo/components/equal-height-row.html")),
    readTextArtifact(path.resolve("demo/components/figure.html")),
    readTextArtifact(path.resolve("demo/components/aspect.html")),
    readTextArtifact(path.resolve("demo/components/table.html")),
    readTextArtifact(path.resolve("demo/components/list-tree.html")),
    readTextArtifact(path.resolve("demo/components/code-snippet.html")),
    readTextArtifact(path.resolve("demo/components/skip-link.html")),
    readTextArtifact(path.resolve("index.html")),
    readTextArtifact(path.resolve("demo/components/index.html")),
    readTextArtifact(path.resolve("demo/patterns/index.html")),
    readTextArtifact(path.resolve("demo/controls.html")),
    readTextArtifact(path.resolve("demo/spec/typographic-specimen.html")),
    readTextArtifact(path.resolve("demo/spec/grid.html")),
    readTextArtifact(path.resolve("demo/panel.html"))
  ]);

  runInvariant("Common CSS (default)", () => validateCommonCss(defaultTheme.css));
  runInvariant("Common CSS (editorial)", () => validateCommonCss(editorialTier.css));
  runInvariant("Common CSS (documentation)", () => validateCommonCss(documentationTier.css));
  runInvariant("Common CSS (OS)", () => validateCommonCss(osTier.css));
  runInvariant("Common CSS (prose preset)", () => validateCommonCss(prosePreset.css));
  runInvariant("App tier CSS (app)", () => validateAppTierCss(appTier.css));
  runInvariant("App tier CSS (app preset)", () => validateAppTierCss(appTierPreset.css));
  runInvariant("Default theme (default)", () => validateDefaultTheme(defaultTheme.tokens, defaultTheme.css));
  runInvariant("Default theme (editorial)", () => validateDefaultTheme(editorialTier.tokens, editorialTier.css));
  runInvariant("Documentation theme", () => validateDocumentationTheme(documentationTier.tokens, documentationTier.css));
  runInvariant("App tier theme (app)", () => validateAppTierTheme(appTier.tokens, appTier.css));
  runInvariant("OS tier theme", () => validateOsTheme(osTier.tokens, osTier.css));
  runInvariant("Default theme (prose preset)", () => validateDefaultTheme(prosePreset.tokens, prosePreset.css));
  runInvariant("App tier theme (app preset)", () => validateAppTierTheme(appTierPreset.tokens, appTierPreset.css));
  runInvariant("IBM Plex engine smoke theme", () => validateIbmPlexEngineSmokeTheme(ibmPlexEngineSmoke.tokens, ibmPlexEngineSmoke.css));
  runInvariant("Surface manifest (default)", () => validateSurfaceManifest(defaultTheme.surfaces, "editorial"));
  runInvariant("Surface manifest (editorial)", () => validateSurfaceManifest(editorialTier.surfaces, "editorial"));
  runInvariant("Surface manifest (documentation)", () => validateSurfaceManifest(documentationTier.surfaces, "documentation"));
  runInvariant("Surface manifest (app)", () => validateSurfaceManifest(appTier.surfaces, "app"));
  runInvariant("Surface manifest (OS)", () => validateSurfaceManifest(osTier.surfaces, "os"));
  runInvariant("Surface manifest (prose preset)", () => validateSurfaceManifest(prosePreset.surfaces, "editorial"));
  runInvariant("Surface manifest (app preset)", () => validateSurfaceManifest(appTierPreset.surfaces, "app"));
  runInvariant("Custom surface manifest (IBM Plex)", () => validateCustomSurfaceManifest(ibmPlexEngineSmoke.surfaces, "ibm-plex-engine-smoke"));
  runInvariant("Four-tier CSS/token parity", () => validateTierSurfaceParity(defaultTheme.css, {
    editorial: editorialTier,
    documentation: documentationTier,
    app: appTier,
    os: osTier
  }));
  runInvariant("Published package exports", () => validatePackageExports(packageJson));
  await runInvariantAsync("Public runtime and types", () => validatePublicRuntimeAndTypes(indexDts));
  runInvariant("Surfaces manifest docs", () => validateSurfacesManifestDocs(surfacesManifestDoc, readmeMd));
  runInvariant("Theme config watcher", () => validateThemeConfigWatcher(viteConfigTs));
  await runInvariantAsync("Legacy panel preset removed", () => validateLegacyPanelPresetRemoval());
  runInvariant("Demo CSS selector hygiene", () => validateDemoCssSelectorHygiene({
    "demo/component-shell.css": componentShellCss,
    "demo/spec-shell.css": specShellCss,
    "demo/page-chrome.css": pageChromeCss,
    "demo/controls-shell.css": controlsShellCss
  }));
  await runInvariantAsync("Example dogfooding", () => validateExampleDogfooding());
  runInvariant("Demo contracts", () => validateDemoContracts(engineSmokeHtml, componentShellCss, specShellCss, pageChromeCss));
  runInvariant("Engine illustration page", () => validateEngineIllustrationPage(pageCatalogJs, componentAtlasHtml, engineIllustrationHtml, componentShellCss));
  runInvariant("Range page", () => validateRangePage(rangeHtml, componentShellCss));
  runInvariant("Button demo", () => validateButtonDemo(buttonHtml));
  runInvariant("Component atlas page", () => validateComponentAtlasPage(componentAtlasHtml, componentAtlasJs));
  runInvariant("Pattern atlas page", () => validatePatternAtlasPage(patternAtlasHtml, componentAtlasHtml, componentAtlasJs, pageCatalogJs));
  runInvariant("Form atlas page", () => validateFormAtlasPage(formAtlasHtml, componentAtlasHtml, componentShellCss));
  runInvariant("Living spec home", () => validateLivingSpecHome(demoIndexHtml));
  runInvariant("Living spec controls", () => validateLivingSpecControls(demoControlsHtml, controlsShellCss));
  runInvariant("Application shell demo", () => validateApplicationShellDemo(applicationShellHtml));
  runInvariant("App tier demo (application-layout)", () => validateAppTierDemoPage("application-layout.html", applicationLayoutHtml));
  runInvariant("App tier demo (side-navigation)", () => validateAppTierDemoPage("side-navigation.html", sideNavigationHtml));
  runInvariant("Parity surface demos", () => validateParitySurfaceDemos(iconHtml, listHtml, tableHtml));
  runInvariant("Top navigation demo", () => validateTopNavigationDemo(topNavigationHtml));
  runInvariant("Renewal component contracts", () => validateRenewalComponentContracts(defaultTheme.css, pageCatalogJs, componentAtlasHtml, patternAtlasHtml, componentDemoJs, renewalComponentPages, indexDts));
  runInvariant("Typographic specimen", () => validateTypographicSpecimen(pageCatalogJs, typographicSpecimenHtml));
  runInvariant("Grid spec page", () => validateGridSpecPage(gridSpecHtml, specShellCss));
  runInvariant("OS tier page", () => validateOsTierPage(pageCatalogJs, panelHtml));
  await runInvariantAsync("Component page tier consistency", () => validateComponentPageTierConsistency(componentDemoJs));
  runInvariant("bf-only demo family", () => validateBfOnlyDemoFamily({
    applicationLayout: applicationLayoutHtml,
    tabs: tabsHtml,
    panelTabs: panelTabsHtml,
    accordion: accordionHtml,
    sideNavigation: sideNavigationHtml,
    topNavigation: topNavigationHtml,
    contextualMenu: contextualMenuHtml,
    tooltip: tooltipHtml,
    icon: iconHtml,
    list: listHtml,
    inlineList: inlineListHtml,
    tieredList: tieredListHtml,
    ctaBlock: ctaBlockHtml,
    equalHeightRow: equalHeightRowHtml,
    figure: figureHtml,
    aspect: aspectHtml,
    table: tableHtml,
    listTree: listTreeHtml,
    codeSnippet: codeSnippetHtml,
    skipLink: skipLinkHtml
  }));

  console.log(`\nBuild validation passed: ${getCheckCount()} total checks.`);
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
