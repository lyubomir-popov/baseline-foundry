import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { BASELINE_GRID_DARK_THEME_COLOR, BASELINE_GRID_DEFAULT_COLOR, BASELINE_GRID_LIGHT_THEME_COLOR } from "../src/baseline-grid-theme.js";
import { nestedFieldSelector, nestedTextInputTypes } from "../src/css-components/nested-controls.js";
import { componentDensityPolicy } from "../src/component-density-policy.js";
import { tierNames } from "../src/presets.ts";
import { componentPages } from "./component-demo-shared.ts";
import { assert, getCheckCount } from "./validation-assert.ts";
import { parseCss, assertRuleHasDecl, assertRuleMissingDecl } from "./css-ast-helpers.ts";
import { validateRenewalComponentContracts } from "./validation/renewal-component-contracts.ts";
import { validateDtcgSpacingContracts } from "./validation/dtcg-spacing-contracts.ts";
import { assertNoDuplicateClassAttributes } from "./validation/html-contract-helpers.ts";
import {
  validateAppTierDemoPage,
  validateActionsDemo,
  validateApplicationShellDemo,
  validateBfOnlyDemoFamily,
  validateButtonDemo,
  validateComponentAtlasPage,
  validateDemoContracts,
  validateEngineIllustrationPage,
  validateFormAtlasPage,
  validateGridSpecPage,
  validateLivingSpecControls,
  validateLivingSpecHome,
  validateOsTierPage,
  validateParitySurfaceDemos,
  validatePatternAtlasPage,
  validateRangePage,
  validateSpacingSpecPage,
  validateTopNavigationDemo,
  validateTypographicSpecimen
} from "./validation/demo-contracts.ts";

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

async function validateSpec028ReviewDemo(html: string, css: string, runtime: string, provenanceText: string, pageCatalogJs: string): Promise<void> {
  const provenance = JSON.parse(provenanceText) as {
    before: { sourceCommit: string; manifestSha256: string; bundles: Record<string, string> };
    after: { semanticSourceCommit: string; bundleSourceCommit: string; bundles: Record<string, string> };
  };
  const hashFile = async (filePath: string): Promise<string> => createHash("sha256").update(await fs.readFile(filePath)).digest("hex");

  assert(pageCatalogJs.includes('{ title: "Spec 028 before/after review", href: "/demo/spec-028/index.html" }'), "Expected the catalog to route the Spec 028 comparison page.");
  assert(html.includes('<link id="review-bundle" rel="stylesheet" href="./before/editorial.css" />') && html.includes('<link rel="stylesheet" href="../demo-fonts.css" />') && html.includes('<link rel="stylesheet" href="./review.css" />'), "Expected the review page to load one switched BF bundle, the verified demo font face, and the non-product review shell.");
  for (const control of ['name="version" value="before"', 'name="version" value="after"', "data-review-tier-select", "data-review-tone-select", "data-review-width-select", "data-review-baseline", "data-review-boxes", "data-review-status"]) {
    assert(html.includes(control), `Expected the review page to expose ${control}.`);
  }
  for (const specimen of ["bf-field-boundary", "bf-tooltip-text", "bf-side-navigation-context-switcher", "bf-table is-sortable", "data-review-popup", "data-containing-owner", "data-containing-child", "data-focus-specimen", "review-filled-child"]) {
    assert(html.includes(specimen), `Expected the review page to include the real/negative ${specimen} specimen.`);
  }
  assert(css.includes(".review-controls {") && css.includes("position: sticky;") && css.includes("top: var(--review-controls-height, 0rem);"), "Expected long-page review controls and provenance to remain sticky without a hard-coded wrapped-control height.");
  assert(css.includes(".review-canvas {\n  display: grid;\n  gap: clamp(2rem, 6vw, 4.5rem);") && !css.includes(".review-canvas > * + *"), "Expected the demo scaffold to own section relationships through a parent gap.");
  assert(css.includes("grid-template-columns: minmax(0, 1fr);") && css.includes("overflow-wrap: anywhere;"), "Expected mobile provenance hashes and DOM signatures to wrap without widening the document.");
  assert(!css.includes("[data-popup-card] { z-index:"), "Expected the popup escape specimen not to raise its Card through fixture CSS.");
  assert(css.includes(".review-filled-child") && css.includes("inset: 0;") && css.includes("position: absolute;"), "Expected the filled-child pressure specimen to cover the actual owner edges without wrapper or z-index normalization.");
  assert(runtime.includes('return version === "before" ? `./before/${tier}.css` : `../../dist/tiers/${tier}/styles.css`;') && runtime.includes('headers: { Accept: "text/css" }'), "Expected the runtime to switch only between pinned base and feature BF CSS and hash the actual CSS response bytes.");
  assert(runtime.includes("const specimens = canvas.innerHTML;") && runtime.includes("const markupUnchanged = canvas.innerHTML === specimens;") && runtime.includes("updateSequence"), "Expected the runtime to verify identical specimen markup and suppress stale asynchronous bundle updates.");
  assert(runtime.includes('canvas.dataset.popupCheck = "not-measured"') && runtime.includes('window.addEventListener("scroll", runNegativeChecks') && runtime.includes("new ResizeObserver"), "Expected offscreen negatives to stay unmeasured until visible and sticky offsets to follow the rendered control height.");
  assert(provenance.before.sourceCommit === "6deca99776f35b85afde01b68bb0fffe817e29aa" && provenance.before.manifestSha256 === "e9004646356afe62f7f53307305ba0e2ff57064a379b96ec9e52b3ccab6b80fc", "Expected Before provenance to pin the independently built base source and build manifest.");
  assert(/^[0-9a-f]{40}$/.test(provenance.after.semanticSourceCommit) && provenance.after.bundleSourceCommit === provenance.after.semanticSourceCommit, "Expected After provenance to pin one full Git-resolvable source commit for the corrected feature bundles.");
  for (const tier of ["editorial", "documentation", "app", "os"]) {
    const beforeHash = await hashFile(path.resolve("demo/spec-028/before", `${tier}.css`));
    const afterHash = await hashFile(path.resolve("dist/tiers", tier, "styles.css"));
    assert(beforeHash === provenance.before.bundles[tier], `Expected ${tier} Before CSS bytes to match review provenance.`);
    assert(afterHash === provenance.after.bundles[tier], `Expected ${tier} After CSS bytes to match review provenance.`);
  }
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
  const filesField = Array.isArray(packageJson.files) ? packageJson.files : [];
  const publishConfig = (packageJson.publishConfig ?? {}) as Record<string, unknown>;
  const repository = (packageJson.repository ?? {}) as Record<string, unknown>;

  assert(packageJson.name === "baseline-foundry", "Expected the unscoped package name to preserve existing downstream imports.");
  assert(packageJson.license === "MIT" && filesField.includes("LICENSE"), "Expected the public package to ship its declared MIT license.");
  assert(publishConfig.access === "public", "Expected npm publication to be explicitly public; private npm access would still require collaborators.");
  assert(repository.url === "git+https://github.com/lyubomir-popov/baseline-foundry.git", "Expected npm metadata to identify the canonical repository.");

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

/* Generated-bundle hygiene only: declaration existence is intentionally
   scope-blind, fallback-bearing references remain optional, and demo CSS or
   inline demo styles are outside the artifact set passed to this validator. */
function findUndeclaredBfVariableReferences(css: string): string[] {
  const ast = parseCss(css);
  const declarations = new Set<string>();
  const referencesWithoutFallback = new Set<string>();

  ast.walkDecls(declaration => {
    if (declaration.prop.startsWith("--bf-")) {
      declarations.add(declaration.prop);
    }

    for (const match of declaration.value.matchAll(/var\(\s*(--bf-[a-z0-9-]+)\s*([,)])/g)) {
      if (match[2] === ")") {
        referencesWithoutFallback.add(match[1]);
      }
    }
  });

  ast.walkAtRules(atRule => {
    for (const match of atRule.params.matchAll(/var\(\s*(--bf-[a-z0-9-]+)\s*([,)])/g)) {
      if (match[2] === ")") {
        referencesWithoutFallback.add(match[1]);
      }
    }
  });

  return [...referencesWithoutFallback]
    .filter(reference => !declarations.has(reference))
    .sort();
}

function validateDeclaredBfVariableReferences(css: string): void {
  const undeclared = findUndeclaredBfVariableReferences(css);
  assert(
    undeclared.length === 0,
    `Expected every fallback-free var(--bf-*) reference to have a declaration in the same bundle; missing ${undeclared.join(", ")}.`
  );
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
  inlineInsetField: "--bf-component-inline-inset-field",
  inlineInsetAction: "--bf-component-inline-inset-action",
  inlineInsetContinuation: "--bf-component-inline-inset-continuation",
  controlVisualSize: "--bf-control-visual-size",
  fieldGap: "--bf-field-gap",
  panelPaddingInline: "--bf-panel-padding-inline",
  panelPaddingBlock: "--bf-panel-padding-block"
};

const CANONICAL_SPACING_BY_BF_ALIAS: Record<string, string> = {
  "--bf-baseline": "--spacing-baseline",
  "--bf-field-gap": "--spacing-gap-field-block",
  "--bf-leading-mark-gap": "--spacing-gap-mark-inline",
  "--bf-section-space-shallow": "--spacing-gap-group-block",
  "--bf-section-space": "--spacing-gap-pattern-block",
  "--bf-section-space-deep": "--spacing-gap-region-block",
  "--bf-component-inline-inset-field": "--spacing-inset-field-inline",
  "--bf-component-inline-inset-action": "--spacing-inset-action-inline",
  "--bf-component-inline-inset-continuation": "--spacing-inset-continuation-inline",
  "--bf-panel-padding-inline": "--spacing-inset-surface-inline",
  "--bf-panel-padding-block": "--spacing-inset-surface-block",
  "--bf-strip-space": "--spacing-inset-strip-block"
};

function expectedTierProperties(tokens: Record<string, unknown>): Map<string, string> {
  const expected = new Map<string, string>();
  const layout = (tokens.layout ?? {}) as Record<string, unknown>;
  const components = (tokens.components ?? {}) as Record<string, unknown>;
  const roles = (tokens.roles ?? {}) as Record<string, Record<string, unknown>>;

  expected.set("--bf-baseline", String(tokens.baselineUnit));
  expected.set("--bf-inline-unit", String(tokens.inlineUnit));
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

function validateHorizontalAxisSeparation(css: string, label: string): void {
  const horizontalLonghands = new Set([
    "padding-inline",
    "padding-inline-start",
    "padding-inline-end",
    "padding-left",
    "padding-right",
    "margin-inline",
    "margin-inline-start",
    "margin-inline-end",
    "margin-left",
    "margin-right",
    "column-gap",
    "inset-inline",
    "inset-inline-start",
    "inset-inline-end",
    "left",
    "right"
  ]);
  const horizontalShorthands = new Set(["padding", "margin", "inset"]);
  const verticalSpacingReference = /var\(--bf-(?:baseline|space-)/;
  const splitTopLevelWhitespace = (value: string): string[] => {
    const parts: string[] = [];
    let current = "";
    let depth = 0;
    for (const character of value.trim()) {
      if (character === "(") depth += 1;
      else if (character === ")") depth -= 1;
      if (/\s/.test(character) && depth === 0) {
        if (current) {
          parts.push(current);
          current = "";
        }
      } else {
        current += character;
      }
    }
    if (current) parts.push(current);
    return parts;
  };
  const shorthandInlineValues = (value: string): string[] => {
    const parts = splitTopLevelWhitespace(value);
    if (parts.length === 1) return parts;
    if (parts.length === 2 || parts.length === 3) return [parts[1]];
    return [parts[1], parts[3]];
  };
  const inlineValuesForDeclaration = (property: string, value: string): string[] | undefined => horizontalLonghands.has(property)
    ? [value]
    : horizontalShorthands.has(property)
      ? shorthandInlineValues(value)
      : undefined;
  if (label === "default") {
    assert(inlineValuesForDeclaration("padding", "0 calc(var(--bf-baseline) * 2)")?.some(value => verticalSpacingReference.test(value)), "Expected the axis audit to detect vertical baseline provenance in padding shorthand inline operands.");
    assert(inlineValuesForDeclaration("padding-left", "calc(var(--bf-baseline) * 2)")?.some(value => verticalSpacingReference.test(value)), "Expected the axis audit to detect vertical baseline provenance in physical padding longhands.");
    assert(inlineValuesForDeclaration("margin", "var(--bf-space-1) var(--bf-component-inline-inset-action)")?.every(value => !verticalSpacingReference.test(value)), "Expected the axis audit to allow vertical spacing in a shorthand block operand when the inline operand has an inline owner.");
    assert(inlineValuesForDeclaration("inset", "var(--bf-space-1) var(--bf-inline-unit) 0 var(--bf-component-inline-inset-field)")?.every(value => !verticalSpacingReference.test(value)), "Expected the axis audit to inspect both inline operands of a four-value shorthand independently.");
  }
  let declarations = 0;
  parseCss(css).walkDecls(declaration => {
    const values = inlineValuesForDeclaration(declaration.prop, declaration.value);
    if (!values) return;
    declarations += 1;
    assert(
      values.every(value => !verticalSpacingReference.test(value)),
      `Expected ${label} ${declaration.prop} inline value(s) to avoid vertical-baseline spacing provenance, got ${declaration.value}.`
    );
  });
  assert(declarations > 0, `Expected ${label} axis audit to inspect horizontal spacing declarations.`);
  assert(css.includes("--bf-inline-unit: 0.25rem;"), `Expected ${label} to emit the independently authored 0.25rem inline unit.`);
  assert(
    css.includes("gap: calc(var(--bf-baseline) * 0.5) var(--bf-leading-mark-gap);"),
    `Expected ${label} breadcrumb shorthand to separate its vertical row gap from the horizontal mark gap.`
  );
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
      const canonicalProperty = CANONICAL_SPACING_BY_BF_ALIAS[propertyName];
      const expectedCssValue = canonicalProperty ? `var(${canonicalProperty})` : value;
      assert(directProperties.get(propertyName) === expectedCssValue, `Expected ${tierName} direct CSS ${propertyName} to equal ${expectedCssValue}, got ${directProperties.get(propertyName)}.`);
      assert(scopedProperties.get(propertyName) === expectedCssValue, `Expected ${tierName} class-switched CSS ${propertyName} to equal direct value ${expectedCssValue}, got ${scopedProperties.get(propertyName)}.`);
    }

    const baselineUnit = parseRemValue(artifact.tokens.baselineUnit);
    const roles = (artifact.tokens.roles ?? {}) as Record<string, Record<string, unknown>>;
    for (const [roleName, token] of Object.entries(roles)) {
      const marginBottom = parseRemValue(token.marginBottom);
      const lineHeight = parseRemValue(token.lineHeight);
      const nudge = parseRemValue(token.nudgeTop);
      const baselineCompensation = (Math.ceil(((lineHeight + (2 * nudge)) / baselineUnit) - 1e-10) * baselineUnit) - lineHeight - nudge;
      assert(Number.isFinite(marginBottom) && marginBottom >= 0, `Expected ${tierName}/${roleName} manifest marginBottom to be finite and non-negative.`);
      assert(marginBottom + 0.00001 >= nudge, `Expected ${tierName}/${roleName} manifest marginBottom to be at least its metric nudge.`);
      assert(Math.abs(marginBottom - baselineCompensation) <= 0.00001, `Expected ${tierName}/${roleName} manifest marginBottom to be the smallest grid-closing compensation at least equal to its nudge.`);
    }
  }
}

function validateTierContentCaps(
  sharedCss: string,
  tierArtifacts: Record<string, { tokens: Record<string, unknown>; css: string; }>
): void {
  const expectedCaps = new Map([
    ["editorial", "90rem"],
    ["documentation", "80rem"],
    ["app", "60rem"],
    ["os", "60rem"]
  ]);
  const resolvedCaps: number[] = [];

  for (const tierName of tierNames) {
    const artifact = tierArtifacts[tierName];
    assert(artifact, `Expected generated artifacts for tier "${tierName}" while validating content caps.`);
    const layout = (artifact.tokens.layout ?? {}) as Record<string, unknown>;
    const expected = expectedCaps.get(tierName);
    const direct = customPropertiesForSelector(artifact.css, ":where(.bf-theme)").get("--bf-content-max-width");
    const scoped = customPropertiesForSelector(sharedCss, `:where(.bf-theme.bf-tier-${tierName})`).get("--bf-content-max-width");

    assert(layout.contentMaxWidth === expected, `Expected ${tierName} content cap to resolve to ${expected}, got ${layout.contentMaxWidth}.`);
    assert(direct === expected && scoped === expected, `Expected ${tierName} direct/scoped content caps to both resolve to ${expected}; direct=${direct}, scoped=${scoped}.`);
    resolvedCaps.push(parseRemValue(layout.contentMaxWidth));
  }

  assert(resolvedCaps.every((cap, index) => index === 0 || cap <= resolvedCaps[index - 1]), `Expected tier caps to be non-increasing in editorial/documentation/app/os order, got ${resolvedCaps.join(" >= ")}rem.`);
  assert(tierArtifacts.app.css.includes(":where(.bf-theme.bf-tier-app) :where(.bf-page) {\n  max-inline-size: none;"), "Expected the direct App bundle to preserve fluid bf-page geometry despite its 60rem fixed-width token.");
  assert(tierArtifacts.app.css.includes(":where(.bf-theme) :where(.bf-page),\n:where(.bf-theme.bf-tier-app) :where(.bf-page) {\n  max-inline-size: none;"), "Expected the direct App bundle's unscoped default surface to preserve fluid bf-page geometry.");
  assert(sharedCss.includes(":where(.bf-theme.bf-tier-app) :where(.bf-page) {\n  max-inline-size: none;"), "Expected shared App class switching to preserve fluid bf-page geometry despite its 60rem fixed-width token.");
}

function validateBuiltInSquareCorners(
  sharedCss: string,
  tierArtifacts: Record<string, { tokens: Record<string, unknown>; css: string; }>
): void {
  for (const tierName of tierNames) {
    const artifact = tierArtifacts[tierName];
    assert(artifact, `Expected generated artifacts for tier "${tierName}" while validating square corners.`);
    const components = (artifact.tokens.components ?? {}) as Record<string, unknown>;
    const direct = customPropertiesForSelector(artifact.css, ":where(.bf-theme)").get("--bf-radius");
    const scoped = customPropertiesForSelector(sharedCss, `:where(.bf-theme.bf-tier-${tierName})`).get("--bf-radius");

    assert(components.radius === "0rem", `Expected ${tierName} to publish a zero component radius, got ${components.radius}.`);
    assert(direct === "0rem" && scoped === "0rem", `Expected ${tierName} direct/scoped CSS radii to both resolve to 0rem; direct=${direct}, scoped=${scoped}.`);
  }
}

function validateTierPanelPaddingProgression(
  sharedCss: string,
  tierArtifacts: Record<string, { tokens: Record<string, unknown>; css: string; }>
): void {
  const expectedPadding = new Map([
    ["editorial", "1rem"],
    ["documentation", "0.75rem"],
    ["app", "0.75rem"],
    ["os", "0.5rem"]
  ]);
  const resolvedInline: number[] = [];
  const resolvedBlock: number[] = [];

  for (const tierName of tierNames) {
    const artifact = tierArtifacts[tierName];
    assert(artifact, `Expected generated artifacts for tier "${tierName}" while validating panel padding.`);
    const components = (artifact.tokens.components ?? {}) as Record<string, unknown>;
    const expected = expectedPadding.get(tierName);
    const direct = customPropertiesForSelector(artifact.css, ":where(.bf-theme)");
    const scoped = customPropertiesForSelector(sharedCss, `:where(.bf-theme.bf-tier-${tierName})`);

    assert(components.panelPaddingInline === expected && components.panelPaddingBlock === expected, `Expected ${tierName} panel padding tokens to resolve to ${expected}; inline=${components.panelPaddingInline}, block=${components.panelPaddingBlock}.`);
    assert(direct.get("--bf-panel-padding-inline") === "var(--spacing-inset-surface-inline)" && direct.get("--bf-panel-padding-block") === "var(--spacing-inset-surface-block)", `Expected direct ${tierName} panel fallback padding properties to alias the canonical surface insets.`);
    assert(scoped.get("--bf-panel-padding-inline") === "var(--spacing-inset-surface-inline)" && scoped.get("--bf-panel-padding-block") === "var(--spacing-inset-surface-block)", `Expected scoped ${tierName} panel fallback padding properties to alias the canonical surface insets.`);
    resolvedInline.push(parseRemValue(components.panelPaddingInline));
    resolvedBlock.push(parseRemValue(components.panelPaddingBlock));
  }

  assert(resolvedInline.every((padding, index) => index === 0 || padding <= resolvedInline[index - 1]), `Expected inline panel padding not to increase across denser tiers, got ${resolvedInline.join(" >= ")}rem.`);
  assert(resolvedBlock.every((padding, index) => index === 0 || padding <= resolvedBlock[index - 1]), `Expected block panel padding not to increase across denser tiers, got ${resolvedBlock.join(" >= ")}rem.`);
}

function validateTierStripSpaceProgression(
  sharedCss: string,
  tierArtifacts: Record<string, { tokens: Record<string, unknown>; css: string; }>
): void {
  const expectedSpacing = new Map([
    ["editorial", "4rem"],
    ["documentation", "3rem"],
    ["app", "3rem"],
    ["os", "2rem"]
  ]);
  const resolved: number[] = [];

  for (const tierName of tierNames) {
    const artifact = tierArtifacts[tierName];
    assert(artifact, `Expected generated artifacts for tier "${tierName}" while validating strip spacing.`);
    const layout = (artifact.tokens.layout ?? {}) as Record<string, unknown>;
    const expected = expectedSpacing.get(tierName);
    const direct = customPropertiesForSelector(artifact.css, ":where(.bf-theme)").get("--bf-strip-space");
    const scoped = customPropertiesForSelector(sharedCss, `:where(.bf-theme.bf-tier-${tierName})`).get("--bf-strip-space");

    assert(layout.stripSpace === expected, `Expected ${tierName} strip spacing token to resolve to ${expected}, got ${layout.stripSpace}.`);
    assert(direct === "var(--spacing-inset-strip-block)" && scoped === "var(--spacing-inset-strip-block)", `Expected ${tierName} direct/scoped strip spacing to alias the canonical strip inset; direct=${direct}, scoped=${scoped}.`);
    resolved.push(parseRemValue(layout.stripSpace));
  }

  assert(resolved.every((space, index) => index === 0 || space <= resolved[index - 1]), `Expected strip spacing not to increase across editorial/documentation/app/os, got ${resolved.join(" >= ")}rem.`);
}

async function validatePublicRuntimeAndTypes(indexDts: string, readmeMd: string): Promise<void> {
  const publicApi = await import("../dist/index.js");
  assert(Array.isArray(publicApi.tierNames), "Expected the package root runtime to export tierNames.");
  assert(JSON.stringify(publicApi.tierNames) === JSON.stringify(tierNames), "Expected public tierNames to expose the complete built-in registry.");
  assert(typeof publicApi.isTierName === "function" && publicApi.isTierName("os"), "Expected the package root runtime to export isTierName.");
  for (const typeName of ["TierName", "BuiltInThemeName", "ThemeSurface", "ThemeSurfaceManifest", "ThemeSurfaceManifestEntry"]) {
    assert(indexDts.includes(typeName), `Expected dist/index.d.ts to export public type ${typeName}.`);
  }

  const publicApiSection = readmeMd.match(/## Public API([\s\S]*?)(?=\n## |$)/)?.[1] ?? "";
  for (const [exportName, exportValue] of Object.entries(publicApi)) {
    if (typeof exportValue === "function") {
      assert(publicApiSection.includes(`\`${exportName}\``), `Expected README.md Public API to document runtime export ${exportName}.`);
    }
  }

  const screenshotOnlyPages = componentPages.filter(page => page.verification === "screenshot-only");
  assert(screenshotOnlyPages.length === 1 && screenshotOnlyPages[0]?.name === "engine-illustration", "Expected only the static engine illustration to opt out of baseline verification explicitly.");
}

function assertSelectorUsesBodyTypography(css: string, selector: string, label: string): void {
  const fontSizePattern = new RegExp(`${escapeForRegex(selector)}\\s*\\{[\\s\\S]*?font-size: var\\(--bf-body-font-size,`);
  const lineHeightPattern = new RegExp(`${escapeForRegex(selector)}\\s*\\{[\\s\\S]*?line-height: var\\(--bf-body-line-height,`);

  assert(fontSizePattern.test(css), `Expected ${label} to resolve font-size from the active body role.`);
  assert(lineHeightPattern.test(css), `Expected ${label} to resolve line-height from the active body role.`);
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
  assert(viteConfigTs.includes("watch:") && viteConfigTs.includes("usePolling: true"), "Expected the demo server to poll the Windows/WSL-shared workspace so long-running browser review does not retain a stale module graph.");
}

async function validateLegacyPanelPresetRemoval(): Promise<void> {
  assert(!(await pathExists(path.resolve("dist", "presets", "panel"))), "Expected build output to remove the deleted panel preset directory.");
  assert(!(await pathExists(path.resolve("generated", "baseline", "panel"))), "Expected build output to remove the deleted panel baseline directory.");
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
    assert(!html.includes("bf-eyebrow"), `Expected ${fileName} to use the canonical BF H5 role instead of a duplicate eyebrow alias.`);

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

function extractGeneratedSelectors(css: string): string[] {
  return css
    .split("{")
    .map(chunk => chunk.slice(chunk.lastIndexOf("}") + 1).trim())
    .filter(prelude => prelude.length > 0 && !prelude.startsWith("@"))
    .flatMap(prelude => prelude.split(",").map(selector => selector.trim()));
}

function validateTypographySelectorOwnership(css: string): void {
  const selectors = extractGeneratedSelectors(css);
  const proseBoundarySelector = ":where(.bf-theme) :where(.bf-prose) > :last-child:not(:where(ul)):not(:where(ol))";

  for (const element of ["p", "h1", "h2", "h3", "h4", "h5", "h6", "figcaption"]) {
    const proseElementPattern = new RegExp(`\\.bf-prose(?:\\s+|>\\s*)(?::(?:where|is)\\(\\s*)?${element}(?=$|[.#:[\\s)>+~])`);
    assert(!selectors.some(selector => proseElementPattern.test(selector)), `Expected ${element} typography to remain role-owned instead of being duplicated under .bf-prose.`);
  }

  for (const element of ["p", "h1", "h2", "h3", "h4", "h5", "h6"]) {
    assert(selectors.includes(`:where(.bf-theme) :where(${element})`), `Expected generated CSS to retain the semantic ${element} typography selector.`);
  }

  for (const role of ["body", "h1", "h2", "h3", "h4", "h5", "h6"]) {
    assert(selectors.includes(`:where(.bf-theme) .bf-${role}`), `Expected generated CSS to retain the explicit .bf-${role} visual-role selector.`);
  }

  assert(!selectors.includes(proseBoundarySelector), "Expected prose flow to preserve final-child baseline compensation instead of trimming a semantic margin.");
  assert(!selectors.includes(":where(.bf-theme) :where(.bf-prose > :last-child)"), "Expected prose flow not to reintroduce a broad last-child reset.");
  assert(!selectors.includes(":where(.bf-theme) :where(.bf-prose) > :last-child"), "Expected final prose children to keep their metric bottom-margin compensation.");
}

async function validateExampleDogfooding(): Promise<void> {
  const exampleDirs = [path.resolve("examples/grid")];

  for (const exampleDir of exampleDirs) {
    const fileNames = (await fs.readdir(exampleDir)).filter(fileName => fileName.endsWith(".html"));

    for (const fileName of fileNames) {
      const filePath = path.join(exampleDir, fileName);
      const html = await readTextArtifact(filePath);

      assertNoDuplicateClassAttributes(path.relative(process.cwd(), filePath), html);
      assert(html.includes('data-example-grid-target'), `Expected ${path.relative(process.cwd(), filePath)} to expose the page capture target explicitly.`);
      assert(/<body[^>]*>\s*<script src="\.\.\/\.\.\/demo\/example-page-init\.js"><\/script>\s*<main/.test(html), `Expected ${path.relative(process.cwd(), filePath)} to apply saved example preferences synchronously before rendering page content.`);
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

      if (path.basename(filePath) === "nested-grid.html") {
        assert(!html.includes('class="bf-grid bf-grid-scope example-nested-inner"'), `Expected ${path.relative(process.cwd(), filePath)} not to query a grid against its wider ancestor by placing bf-grid-scope on the grid itself.`);
        assert((html.match(/class="bf-grid-scope">\s*<div class="bf-grid example-nested-inner">/g) ?? []).length === 3, `Expected ${path.relative(process.cwd(), filePath)} to wrap every nested grid in its own query scope.`);
      }

    }
  }

  const examplePageJs = await readTextArtifact(path.resolve("demo/example-page.js"));

  const gridExamplesCss = await readTextArtifact(path.resolve("examples/grid/grid-examples.css"));
  assert(examplePageJs.includes('initApplicationLayouts') && examplePageJs.includes('initPanelDrawers'), 'Expected demo/example-page.js to initialize the shared application-layout and panel-drawer runtimes for example pages.');
  assertNoStyledDataSelectors("examples/grid/grid-examples.css", gridExamplesCss);
  assert(!/\.(?:example)-(?:frame|fixed-width|hero|stack|actions|card|surface|callout|span-demo|span-row|tier-group|nested-specimens|stage-shell|stage-header)(?![a-z0-9_-])/.test(gridExamplesCss), "Expected grid examples CSS to avoid generic non-dogfooded wrapper/card classes.");
}

function validateCommonCss(css: string): void {
  // PostCSS-parsed view of the same bundle. New assertions and migrated
  // legacy ones should prefer the AST helpers (assertRuleHasDecl, etc.) over
  // brittle multi-line substring checks. See scripts/css-ast-helpers.ts.
  const ast = parseCss(css);
  const ownedBlockStartMarginExceptions = new Set<string>();
  ast.walkDecls(declaration => {
    if (!["margin", "margin-block", "margin-block-start", "margin-top"].includes(declaration.prop)) return;
    const firstValue = declaration.value.trim().split(/\s+/)[0];
    if (/^0(?:rem|px|em|%)?$/.test(firstValue)) return;
    const selector = ((declaration.parent as { selector?: string }).selector ?? "").replace(/\s+/g, " ");
    const key = `${selector}|${declaration.prop}|${declaration.value}`;
    const isOwnedException =
      (selector === ":where(.bf-theme) :where(input[type='range'])::-webkit-slider-thumb" && declaration.prop === "margin-top" && declaration.value === "calc((var(--bf-slider-track-size) - var(--bf-control-visual-size)) / 2)") ||
      (selector === ":where(.bf-theme) :where(.bf-modal)" && declaration.prop === "margin" && declaration.value === "auto") ||
      (selector.includes(".bf-article-pagination-link.is-previous:not(:only-child) .bf-article-pagination-label") && declaration.prop === "margin" && declaration.value === "-0.0625rem") ||
      (selector.includes(".bf-equal-height-row.is-divider-1") && selector.includes(".is-divider-2") && declaration.prop === "margin" && declaration.value === "auto");
    assert(isOwnedException, `Expected ${selector} ${declaration.prop}:${declaration.value} not to allocate an unowned block-start margin.`);
    ownedBlockStartMarginExceptions.add(key);
  });
  assert(ownedBlockStartMarginExceptions.size === 4, `Expected exactly four named native/accessibility/structural block-start margin exceptions, got ${JSON.stringify([...ownedBlockStartMarginExceptions])}.`);
  const splitMarginValues = (value: string): string[] => {
    const parts: string[] = [];
    let current = "";
    let depth = 0;
    for (const character of value.trim()) {
      if (character === "(") depth += 1;
      else if (character === ")") depth -= 1;
      if (/\s/.test(character) && depth === 0) {
        if (current) {
          parts.push(current);
          current = "";
        }
      } else {
        current += character;
      }
    }
    if (current) parts.push(current);
    return parts;
  };
  const blockEndMarginValue = (property: string, value: string): string | undefined => {
    if (property === "margin-block-end" || property === "margin-bottom") return value.trim();
    const parts = splitMarginValues(value);
    if (property === "margin-block") return parts.length === 1 ? parts[0] : parts[1];
    if (property !== "margin") return undefined;
    if (parts.length === 1 || parts.length === 2) return parts[0];
    return parts[2];
  };
  const ownedBlockEndMarginExceptions = new Set<string>();
  ast.walkDecls(declaration => {
    const value = blockEndMarginValue(declaration.prop, declaration.value);
    if (!value || /^0(?:rem|px|em|%)?$/.test(value)) return;
    const selector = ((declaration.parent as { selector?: string }).selector ?? "").replace(/\s+/g, " ");
    const isMetricCompensation = /var\(--bf-(?:body|h[1-6])-margin-bottom(?:,|\))/.test(value) || value === "var(--bf-interface-row-compensation-block-end)";
    if (isMetricCompensation) return;
    const key = `${selector}|${declaration.prop}|${declaration.value}`;
    const isOwnedException =
      (selector === ":where(.bf-theme) :where(.bf-linked-logo-section-mark)" && declaration.prop === "margin-block-end" && value.replace(/\s+/g, "").startsWith("calc(round(up,")) ||
      (selector === ":where(.bf-theme) :where(hr)" && declaration.prop === "margin" && value === "calc(var(--bf-field-gap) - 0.0625rem)") ||
      (selector === ":where(.bf-theme) :where(hr.is-highlighted)" && declaration.prop === "margin-block-end" && value === "calc(var(--bf-field-gap) - var(--bf-bar-thickness))") ||
      (selector.includes(".bf-article-pagination-link.is-previous:not(:only-child) .bf-article-pagination-label") && declaration.prop === "margin" && value === "-0.0625rem") ||
      (selector === ":where(.bf-theme) :where(.bf-modal)" && declaration.prop === "margin" && value === "auto") ||
      (selector.includes(".bf-equal-height-row.is-divider-1") && selector.includes(".is-divider-2") && declaration.prop === "margin" && value === "auto");
    assert(isOwnedException, `Expected ${selector} ${declaration.prop}:${declaration.value} to use metric/grid compensation or a named native/accessibility/divider exception at block end.`);
    ownedBlockEndMarginExceptions.add(key);
  });
  assert(ownedBlockEndMarginExceptions.size === 6, `Expected exactly six named block-end exceptions beyond metric/grid compensation, got ${JSON.stringify([...ownedBlockEndMarginExceptions])}.`);
  const inlineMarginValues = (property: string, value: string): string[] => {
    if (property === "margin-inline" || property === "margin-left" || property === "margin-right") return [value.trim()];
    if (property === "margin-inline-start" || property === "margin-inline-end") return [value.trim()];
    if (property !== "margin") return [];
    const parts = splitMarginValues(value);
    if (parts.length === 1) return [parts[0]];
    if (parts.length === 2 || parts.length === 3) return [parts[1]];
    return [parts[1], parts[3]];
  };
  const namedInlineMarginExceptions = new Set<string>();
  ast.walkDecls(declaration => {
    const values = inlineMarginValues(declaration.prop, declaration.value).filter(value => !/^0(?:rem|px|em|%)?$/.test(value));
    if (values.length === 0) return;
    const selector = ((declaration.parent as { selector?: string }).selector ?? "").replace(/\s+/g, " ");
    const key = `${selector}|${declaration.prop}|${declaration.value}`;
    const isStructuralAutoAlignment = values.every(value => value === "auto") && [
      ".bf-page",
      ".bf-notification-actions",
      ".bf-panel-controls",
      ".bf-top-navigation-item.is-right-shifted",
      ".bf-side-navigation-status",
      ".bf-code-snippet-dropdowns",
      ".bf-equal-height-row.is-columns-2",
      ".bf-equal-height-row.is-columns-3",
      ".bf-fixed-width"
    ].some(fragment => selector.includes(fragment));
    const isNativeOpticalOrTargetException =
      (selector.includes("input[type='file']") && selector.includes("::file-selector-button") && declaration.prop === "margin-inline-end" && declaration.value === "var(--bf-field-gap)") ||
      (selector.includes(".bf-button.is-icon:not(.is-nested)") && declaration.prop === "margin-inline" && declaration.value === "var(--bf-action-target-overflow)") ||
      (selector.includes(".bf-table-sort-button") && declaration.prop === "margin-inline" && declaration.value.includes("* -1")) ||
      (selector.includes(".is-icon-placeholder") && selector.includes(".bf-icon:first-child") && (declaration.prop === "margin-inline-start" || declaration.prop === "margin-inline-end")) ||
      (selector.includes(".bf-article-pagination-link.is-previous:not(:only-child) .bf-article-pagination-label") && declaration.prop === "margin" && declaration.value === "-0.0625rem") ||
      (selector === ":where(.bf-theme) :where(.bf-modal)" && declaration.prop === "margin" && declaration.value === "auto") ||
      (selector.includes(".bf-equal-height-row.is-divider-1") && selector.includes(".is-divider-2") && declaration.prop === "margin" && declaration.value === "auto");
    assert(isStructuralAutoAlignment || isNativeOpticalOrTargetException, `Expected ${selector} ${declaration.prop}:${declaration.value} to avoid inline relationship margins or match one named structural/native/optical/target exception.`);
    namedInlineMarginExceptions.add(key);
  });
  assert(namedInlineMarginExceptions.size === 18, `Expected exactly 18 named inline structural/native/optical/target margin exceptions, got ${JSON.stringify([...namedInlineMarginExceptions])}.`);
  assert(!css.includes("@font-face"), "Expected built-in CSS to leave runtime font URLs to the consumer-owned font declaration.");
  assert(!css.includes("UbuntuSans[wdth,wght].ttf"), "Expected built-in CSS to avoid a runtime URL to the unbundled development font.");
  const normativeTargetMinimums = css.match(/24px\b/g) ?? [];
  assert(
    normativeTargetMinimums.length === 1 &&
    !/-?(?:\d+(?:\.\d+)?|\.\d+)px\b/.test(css.replaceAll("24px", "")),
    "Expected generated CSS lengths to use scalable rem units or shared rem-based tokens except for one shared 24 CSS-pixel target-minimum input.",
  );
  assert(css.includes("@container (width >= 38.75rem)"), "Expected CSS to use the Canonical 38.75rem threshold for the 8-column grid.");
  assert(css.includes("@container (width >= 105.0625rem)"), "Expected CSS to use the Canonical 105.0625rem threshold for the 16-column grid.");
  assert(css.includes("@media (width >= 38.75rem)"), "Expected CSS to use the Canonical 38.75rem viewport breakpoint for gutters and outer margins.");
  assert(css.includes("@media (width >= 64.75rem)"), "Expected CSS to use the Canonical 64.75rem viewport breakpoint for large outer margins.");
  assert(css.includes(":where(.bf-theme.bf-tier-app) :where(.bf-page) {\n  max-inline-size: none;"), "Expected app-tier page to be fluid (no max-width cap).");
  assert(css.includes(":where(.bf-theme) :where(.bf-page.is-fill) {\n  min-block-size: 100vh;\n  padding-block-end: var(--bf-section-space);"), "Expected shared CSS to expose the fill-height bf-page modifier used by the spec and controls shells.");
  assert(css.includes(":where(.bf-theme) :where(.bf-inline-size) {\n  --bf-inline-size: 18rem;\n  flex: 0 1 var(--bf-inline-size);\n  inline-size: min(100%, var(--bf-inline-size));\n  min-inline-size: min(100%, var(--bf-inline-size));"), "Expected shared CSS to expose the BF-owned bounded inline-size utility used by clustered inspection rows.");
  assert(css.includes(":where(.bf-theme) :where(.bf-inline-size.is-compact) {\n  --bf-inline-size: 12rem;"), "Expected shared CSS to expose the compact bounded inline-size modifier.");
  assert(css.includes(":where(.bf-theme) :where(.bf-inline-size.is-regular) {\n  --bf-inline-size: 18rem;"), "Expected shared CSS to expose the regular bounded inline-size modifier.");
  assert(css.includes(":where(.bf-theme) :where(.bf-inline-size.is-medium) {\n  --bf-inline-size: 20rem;"), "Expected shared CSS to expose the medium bounded inline-size modifier.");
  assert(css.includes(":where(.bf-theme) :where(.bf-inline-size.is-wide) {\n  --bf-inline-size: 24rem;"), "Expected shared CSS to expose the wide bounded inline-size modifier.");
  assert(css.includes(":where(.bf-theme) :where(.bf-inline-size.is-x-wide) {\n  --bf-inline-size: 28rem;"), "Expected shared CSS to expose the x-wide bounded inline-size modifier.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-cluster.is-split)", {
    "justify-content": "space-between",
  }, "split clusters distribute their first and final groups while preserving wrapping");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-cluster)", {
    "--bf-cluster-space": "var(--bf-space-2)",
    "gap": "var(--bf-cluster-space)"
  }, "clusters expose one container-owned gap variable");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-cluster.is-dense)", {
    "--bf-cluster-space": "var(--bf-space-1)"
  }, "dense clusters use a one-baseline gap");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-cluster.is-nowrap)", {
    "flex-wrap": "nowrap"
  }, "nowrap clusters preserve a single intrinsic row");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(h5),\n:where(.bf-theme) .bf-h5", {
    "letter-spacing": "var(--bf-h5-letter-spacing, 0.05em)",
  }, "h5 roles expose the intended five-percent tracking");
  assert(css.includes(":where(.bf-theme) :where(ul.bf-grid, ol.bf-grid) {\n  list-style: none;\n  margin: 0;\n  padding: 0;"), "Expected shared CSS to let bf-grid act as an unstyled list container without page-local resets.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-grid) :where(.bf-fixed-width)", {
    "padding-inline": "0",
  }, "nested fixed-width wrappers inside bf-grid avoid adding a second page gutter");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-page) :where(.bf-fixed-width)", {
    "padding-inline": "0",
  }, "fixed-width regions inside a page defer to the page-owned gutter");
  assert(css.includes(":where(.bf-theme) :where(.bf-grid.is-guide) > * {\n  background: color-mix(in srgb, var(--bf-color-accent) 18%, var(--bf-color-background-default));"), "Expected shared CSS to expose the BF-owned grid guide modifier for breakpoint specimens.");
  assert(css.includes("--bf-grid-gap-inline: 1rem;"), "Expected CSS to define the default 240-38.6875rem x-small 1rem inline gutter without a separate 28.75rem switch.");
  assert(css.includes("--bf-grid-gap-block: 1rem;"), "Expected CSS to define the default 240-38.6875rem x-small 1rem block-gap token for non-bf-grid layouts.");
  assert(css.includes("--bf-page-margin: 1rem;"), "Expected CSS to define the default 240-38.6875rem x-small 1rem outer margin without a separate 28.75rem switch.");
  assert(css.includes("--bf-grid-gap-inline: 1.5rem;"), "Expected CSS to define the small-and-up 1.5rem grid gutter.");
  assert(css.includes("--bf-page-margin: 1.5rem;"), "Expected CSS to define the small 1.5rem outer margin.");
  assert(css.includes("gap: 0 var(--bf-grid-gap-inline);"), "Expected bf-grid to keep row-gap at 0 and use only the inline gutter token.");
  assert(css.includes("@media (width >= 64.75rem) {\n  :where(.bf-theme) {\n    --bf-grid-gap-inline: 2rem;\n    --bf-grid-gap-block: 2rem;\n    --bf-page-margin: 2rem;"), "Expected CSS to widen the default editorial gutter to 2rem at large breakpoints.");
  assert(css.includes(":where(.bf-theme.bf-tier-app) {\n    --bf-grid-gap-inline: 1.5rem;\n    --bf-grid-gap-block: 1.5rem;"), "Expected CSS to keep app-tier gutters at 1.5rem inside the large-breakpoint override.");
  assert(css.includes("--bf-page-margin: 2rem;"), "Expected CSS to define the large-and-up 2rem outer margin.");
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
  assert(css.includes(":where(.bf-theme) :where(a) {\n  color: var(--bf-color-link);\n  text-decoration: none;"), "Expected raw links to omit their underline in the resting state.");
  assert(css.includes(":where(.bf-theme) :where(a:is(:hover, :active)) {\n  text-decoration: underline;"), "Expected raw links to expose an underline only while hovered or pressed.");
  assert(css.includes(":where(.bf-theme) :where(a:visited) {\n  color: var(--bf-color-link-visited);"), "Expected generated CSS to style visited links through the semantic theme token.");
  assert(css.includes(":where(.bf-theme) :where(a:focus-visible) {\n  outline: 0.125rem solid var(--bf-color-focus);"), "Expected generated CSS to style raw link focus with the semantic focus token.");
  assert(css.includes(":where(.bf-theme) :where(a.bf-text-link) {\n  display: inline-block;") && css.includes("padding-block: var(--bf-body-nudge-start) 0;"), "Expected standalone text links to expose an element-qualified canonical body metric box without changing raw prose anchors.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(hr)", {
    "background": "var(--bf-color-rule)",
    "block-size": "0.0625rem",
    "border": "0",
    "inline-size": "100%",
    "margin": "0 0 calc(var(--bf-field-gap) - 0.0625rem)",
  }, "plain hr receives the basic rule contract");
  assert(css.includes(":where(.bf-theme) :where(.bf-page) {\n  margin-inline: auto;\n  max-inline-size: var(--bf-content-max-width);\n  padding-inline: var(--bf-page-margin);"), "Expected bf-page gutters to resolve directly from the shared grid-row margin token.");
  assert(!css.includes("#f5f1e8"), "Expected generated CSS to avoid the old paper-like default background fallback.");
  assert(!css.includes("#0f62fe"), "Expected generated CSS to avoid the old non-Vanilla light link fallback.");
  assert(css.includes(`--bf-baseline-grid-color: ${BASELINE_GRID_DEFAULT_COLOR};`), "Expected baseline-grid overlays to declare a default line color.");
  assert(css.includes(`:where(.bf-theme).u-baseline-grid,\n:where(.bf-theme) .u-baseline-grid {\n  --bf-baseline-grid-color: ${BASELINE_GRID_LIGHT_THEME_COLOR};`), "Expected light themes to provide a subtle baseline-grid line color, even when the grid class is on the theme root.");

  if (css.includes(":where(.bf-theme.bf-tier-app) {")) {
    assert(!css.includes(":where(.bf-theme.bf-tier-app) :where(.bf-section),"), "Expected app tier to retain explicit bf-section boundaries.");
    assert(!css.includes(":where(.bf-theme.bf-tier-app) :where(.bf-stack) > *"), "Expected app stacks not to erase child rhythm.");
    assert(!css.includes(":where(.bf-theme.bf-tier-app) :where(.bf-cluster) > *"), "Expected app clusters not to erase child rhythm.");
    assert(!css.includes(":where(.bf-theme.bf-tier-app) :where(.bf-prose > *)"), "Expected app prose not to erase child rhythm.");
  }
  assert(css.includes(`:where(.bf-theme.is-dark).u-baseline-grid,\n:where(.bf-theme.is-dark) .u-baseline-grid {\n  --bf-baseline-grid-color: ${BASELINE_GRID_DARK_THEME_COLOR};`), "Expected dark themes to provide a subtle baseline-grid line color, even when the grid class is on the theme root.");
  assert(css.includes(":where(.bf-theme) :where(img, picture, svg, video) {\n  block-size: auto;\n  display: block;\n  inline-size: auto;\n  max-inline-size: 100%;"), "Expected shared media to stay fluid inside narrow containers.");
  assert(css.includes("--bf-grid-columns: 16;"), "Expected the grid CSS to include the 16-column mode.");
  assert(css.includes(".bf-span-16"), "Expected the grid CSS to include the 16-column span class.");
  assert(!css.includes(".bf-span-12"), "Expected the grid CSS to omit the old 12-column span class.");
  assert(css.includes(":where(.bf-theme) :where(thead th) {\n  font-family: var(--bf-body-font-family"), "Expected CSS to style table headers as body-role text.");
  assert(css.includes("--bf-interface-row-padding-block: calc(var(--bf-control-block-inset) + var(--bf-body-nudge-start") && css.includes("--bf-interface-row-painted-block-size: calc(var(--bf-interface-row-line-height) + (var(--bf-interface-row-padding-block) * 2));") && css.includes("--bf-interface-row-content-offset-block-start: var(--bf-interface-row-padding-block);") && css.includes("--bf-interface-row-compensation-block-end: mod(") && css.includes("--bf-interface-row-occupied-block-size: calc(var(--bf-interface-row-painted-block-size) + var(--bf-interface-row-compensation-block-end));") && css.includes("--bf-in-box-row-padding-block-start: var(--bf-interface-row-content-offset-block-start);") && css.includes("--bf-in-box-row-padding-block-end: max(0rem, calc(var(--bf-interface-row-occupied-block-size) - var(--bf-interface-row-line-height)"), "Expected controls and marginless repeated rows to share one zero-layout-border occupied-block target with explicit in-box compensation.");
  assert(css.includes("--bf-table-row-padding-block-start: var(--bf-in-box-row-padding-block-start);") && css.includes("--bf-table-row-block-size: var(--bf-interface-row-occupied-block-size);") && css.includes("--bf-table-row-padding-block-end: max(0rem, calc(var(--bf-table-row-block-size) - var(--bf-body-line-height") && css.includes("--bf-table-row-line-height: var(--bf-body-line-height"), "Expected table rows to preserve body text metrics while targeting the shared interface-row occupied block.");
  assert(css.includes(":where(.bf-theme) :where(.bf-table > thead > tr > th:not([aria-sort]), .bf-table > thead > tr > td, .bf-table > tbody > tr > th:not([aria-sort]), .bf-table > tbody > tr > td, .bf-table > tfoot > tr > th:not([aria-sort]), .bf-table > tfoot > tr > td)::after {") && css.includes("border-block-end: var(--bf-stroke-width) solid CanvasText;"), "Expected direct BF table cells to retain per-cell out-of-flow row rules and real forced-colors edges.");
  assertRuleMissingDecl(ast, ":where(.bf-theme) :where(th, td)", "position", "ordinary table cells do not become containing blocks");
  assert(css.includes(":has(.bf-contextual-menu) {\n  overflow: visible;"), "Expected direct BF cells that contain a real popup through supported neutral wrappers to expose its out-of-cell paint and input path.");
  assert(css.includes(":where(.bf-theme) :where(th, td):not(.bf-table > thead > tr > *, .bf-table > tbody > tr > *, .bf-table > tfoot > tr > *) {\n    box-shadow: none;\n    outline: var(--bf-table-row-border-size) solid CanvasText;\n    outline-offset: calc(var(--bf-table-row-border-size) * -1);"), "Expected raw native table cells, including nested raw tables, to use the documented paint-only forced-colors outline fallback without a containing block.");
  assert(css.includes(":where(.bf-theme) :where(.bf-table.is-sortable th[aria-sort])::before") && css.includes("border-block-end: var(--bf-table-row-border-size) solid CanvasText;"), "Expected sortable headers to preserve their caret pseudo while painting the row rule from the remaining pseudo.");
  assert(css.includes("padding-block-end: var(--bf-table-row-padding-block-end);") && css.includes("padding-block-start: var(--bf-table-row-padding-block-start);"), "Expected table cells to consume the shared metric start and trailing row-compensation variables.");
  assert(!css.includes("tbody tr:has(.bf-status-label) > td"), "Expected table density not to depend on a contextual status-label selector; nested auxiliaries opt in explicitly.");
  assert(css.includes(":where(.bf-engine-cap)"), "Expected generated CSS to include the cap-engine demo override selector.");
  assert(css.includes(":where(.bf-engine-cap) :where(p),\n:where(.bf-engine-cap) .bf-body {\n  margin-block-end: 0;"), "Expected the cap-engine demo to replace production margin compensation when its two-sided padding occupies the complete baseline step.");
  assert(css.includes(":where(.bf-theme.bf-tier-app)"), "Expected generated CSS to include the app-tier runtime flag selector.");
  assert(!css.includes("--bf-body-nudge-start: 0rem;"), "Expected built-in tiers to retain metric-derived body start nudges.");
  assert(css.includes("--bf-body-baseline-compensation:") && css.includes("--bf-body-nudge-end:"), "Expected generated CSS to expose body compensation for metric-aligned component internals.");
  assert(css.includes("--bf-h6-baseline-compensation:") && css.includes("--bf-h6-nudge-end:"), "Expected generated CSS to expose H6 compensation for metric-aligned component internals.");
  assert(css.includes("padding-block-end: 0rem;"), "Expected generated text roles to keep end compensation in margin rather than padding.");
  assert(!css.includes(":where(.bf-theme) :where(.bf-prose) > :last-child"), "Expected prose containers to preserve final-child compensation.");
  assert(!css.includes(":where(.bf-theme) :where(.bf-card-inner) > :last-child:not("), "Expected card-inner boundaries to preserve final-child compensation.");
  assert(!css.includes(":where(.bf-theme) :where(.bf-card, .bf-card.is-highlighted, .bf-card.is-overlay, .bf-card.is-muted) > :last-child:not("), "Expected card boundaries to preserve final-child compensation.");
  assert(!css.includes(":where(.bf-theme) :where(.bf-panel-content) > :last-child:not("), "Expected panel-content boundaries to preserve final-child compensation.");
  assert(css.includes(".bf-prose li"), "Expected CSS to include list item selectors.");
  assert(css.includes(":where(.bf-theme) :where(.bf-prose li) {\n  margin: 0 0 var(--bf-body-margin-bottom"), "Expected list items to carry body baseline compensation in margin-bottom.");
  assert(css.includes(":where(.bf-theme) :where(ul, ol) {\n  margin-bottom: 0;\n  padding-block-end: 0;"), "Expected semantic list containers not to add block-end margin or padding around item compensation.");
  assert(css.includes("--bf-leading-mark-size: var(--bf-icon-size-default);") && css.includes("--bf-leading-mark-offset: calc(var(--bf-leading-mark-size) + var(--bf-leading-mark-gap));") && css.includes("--bf-leading-mark-group-inset: calc(var(--bf-component-inline-inset-continuation) - var(--bf-leading-mark-offset));"), "Expected controls and marker-bearing lists to share the tier body-sized icon slot and reach the continuation inset.");
  assert(css.includes(":where(.bf-theme) :where(.bf-prose ol) {\n  padding-inline-start: calc(var(--bf-leading-mark-group-inset) + var(--bf-leading-mark-offset) - (var(--bf-leading-mark-size) * 0.5));") && css.includes(":where(.bf-theme) :where(.bf-prose ol > li) {\n  padding-inline-start: calc(var(--bf-leading-mark-size) * 0.5);"), "Expected ordered prose lists to retain complementary shared-leading-mark compensation after the group inset.");
  assert(css.includes(":where(.bf-theme) :where(.bf-prose ul) {\n  list-style: none;\n  padding-inline-start: var(--bf-leading-mark-group-inset);") && css.includes(":where(.bf-theme) :where(.bf-prose ul > li) {\n  padding-inline-start: var(--bf-leading-mark-offset);") && css.includes("inline-size: var(--bf-list-marker-dot-size);\n  inset-block-start: calc(var(--bf-tick-box-offset) + ((var(--bf-leading-mark-size) - var(--bf-list-marker-dot-size)) * 0.5));"), "Expected unordered prose-list dots to occupy the shared leading-mark canvas and their text to reach the disclosure continuation keyline.");
  assert(!css.includes(".bf-prose li + li"), "Expected list spacing to avoid the old ad hoc inter-item margin.");
  assert(css.includes(":where(.bf-theme) :where(.bf-side-navigation-groups) {\n  align-content: start;\n  display: grid;\n  gap: var(--bf-side-navigation-group-gap);") && css.includes("--bf-side-navigation-group-gap: var(--bf-section-space-shallow);"), "Expected side-navigation groups to use the governed tier group gap.");
  assert(css.includes("--bf-side-navigation-heading-list-gap: var(--bf-field-gap);") && css.includes(":where(.bf-theme) :where(.bf-side-navigation-group) {\n  display: grid;\n  gap: var(--bf-side-navigation-heading-list-gap);"), "Expected each side-navigation group to use the governed tier item gap between its header and list.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-side-navigation, .bf-side-navigation.is-icons, .bf-side-navigation.is-accordion, .bf-side-navigation.is-raw-html)", {
    "min-inline-size": "0"
  }, "side navigation yields intrinsic inline width when placed in a narrow grid or flex rail");
  assert(css.includes(":where(.bf-theme) :where(.bf-side-navigation-group-header) {\n  display: grid;\n  gap: 0rem;\n  min-inline-size: 0;\n  padding-inline: var(--bf-side-navigation-label-keyline) var(--bf-side-navigation-gutter);") && css.includes(":where(.bf-theme) :where(.bf-side-navigation-group-header) > hr {\n  inline-size: 100%;\n  margin-inline: 0;") && !css.includes(":where(.bf-theme) :where(.bf-side-navigation-list)::after"), "Expected the SideNavigation group header to own its keyline and end gutter as padding, with a full-width compensated rule and no relationship margin.");
  assert(css.includes(":where(.bf-theme) :where(.bf-side-navigation-list) {\n  display: grid;\n  grid-auto-rows: minmax(var(--bf-interface-row-occupied-block-size), auto);") && css.includes("align-self: start;"), "Expected side-navigation rows to preserve the shared single-line minimum while allowing expanded accordion content to grow its track.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-side-navigation-list)", {
    "min-inline-size": "0"
  }, "side-navigation lists yield intrinsic inline width inside narrow application rails");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-side-navigation-item, .bf-side-navigation-item.is-title)", {
    "min-inline-size": "0"
  }, "side-navigation grid items allow nested accordion content to shrink without widening the rail");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-side-navigation-link, .bf-side-navigation-text, .bf-side-navigation-accordion-button)", {
    "min-inline-size": "0",
    "overflow": "hidden"
  }, "side-navigation rows contain intrinsic-width descendants inside narrow application rails");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-side-navigation-label)", {
    "overflow": "hidden",
    "text-overflow": "ellipsis"
  }, "side-navigation labels retain overflow containment while their row can grow for wrapped copy");
  assert(css.includes("--bf-side-navigation-gutter: var(--bf-page-margin);") && css.includes("--bf-side-navigation-icon-size: var(--bf-icon-size-default);") && css.includes("--bf-side-navigation-label-keyline: calc(var(--bf-side-navigation-gutter) + var(--bf-side-navigation-icon-size) + var(--bf-side-navigation-icon-gap));") && !css.includes("--bf-side-navigation-depth-step"), "Expected SideNavigation to derive one non-progressive label keyline from its page-margin gutter, tier icon and mark gap.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-side-navigation-context-switcher)", {
    "padding-inline": "var(--bf-side-navigation-label-keyline) var(--bf-side-navigation-gutter)"
  }, "SideNavigation ContextSwitcher places its real select on the label keyline and keeps the opposing gutter");
  assertRuleMissingDecl(ast, ":where(.bf-theme) :where(.bf-side-navigation-context-switcher) > :where(.bf-field-boundary)", "margin-block-end", "ContextSwitcher preserves the field boundary's grid-closing block-end compensation");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-side-navigation-link.is-active, .bf-side-navigation-link[aria-current='page'], .bf-side-navigation-link[aria-current='true'])::after", {
    "inset-inline-start": "0",
    "pointer-events": "none",
    "position": "absolute"
  }, "SideNavigation selection paints out of flow inside the start gutter");
  assert(css.includes("@media (forced-colors: active)") && css.includes("border-inline-start: var(--bf-bar-thickness) solid CanvasText;"), "Expected selected SideNavigation gutter paint to retain a one-sided system-color border in forced colors.");
  assert(css.includes("min-block-size: calc((var(--bf-baseline) * 4) - var(--bf-body-nudge-end));"), "Expected single-line side-navigation group headings to reserve a four-baseline occupied block without counting the ordinary in-box end nudge twice.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-panel)", {
    "gap": "var(--bf-section-space-shallow)",
    "padding-block": "var(--bf-panel-padding-block)",
    "padding-inline": "var(--bf-panel-content-padding-inline)"
  }, "panel roots own the surface inset and group gap between sections");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-panel.bf-side-navigation)", {
    "gap": "0",
    "padding": "0"
  }, "SideNavigation composition keeps its own grid-margin gutters and group rhythm");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-panel-footer)", {
    "border": "0",
    "min-block-size": "var(--bf-interface-row-occupied-block-size)",
    "padding": "0"
  }, "panel footers keep only their interface row while the root owns surrounding surface spacing");
  assert(css.includes(":where(.bf-theme) :where(.bf-stack) {\n  --bf-stack-space: var(--bf-section-space-shallow);\n  align-content: start;"), "Expected default stacks to own the tier's shallow pattern gap without stretching occupied tracks.");
  assert(css.includes(":where(.bf-theme) :where(.bf-stack.is-flush) {\n  --bf-stack-space: 0rem;"), "Expected flush stacks to remove only their container gap.");
  assert(css.includes(":where(.bf-theme) :where(.bf-stack.is-metric-flush) {\n  --bf-stack-space: 0rem;") && css.includes(":where(.bf-theme) .bf-stack.is-metric-flush > :where(") && css.includes(":has(+ :where(") && css.includes(" + :where(") && css.includes("margin-block-end: 0;") && css.includes("padding-block-start: 0;"), "Expected metric-flush stacks to cancel only configured adjacent text-role compensation and start nudges.");
  assert(css.includes(":where(.bf-theme) :where(.bf-stack.is-extra-dense) {\n  --bf-stack-space: var(--bf-space-half);"), "Expected extra-dense stacks to use the half-baseline gap.");
  assert(css.includes(":where(.bf-theme) :where(.bf-stack.is-dense) {\n  --bf-stack-space: var(--bf-space-1);"), "Expected dense stacks to use the one-baseline gap.");
  assert(css.includes(":where(.bf-theme) :where(.bf-stack.is-loose) {\n  --bf-stack-space: var(--bf-space-2);"), "Expected loose stacks to use the two-baseline gap.");
  assert(css.includes(":where(.bf-theme) :where(.bf-stack.is-section-shallow) {\n  --bf-stack-space: var(--bf-section-space-shallow);"), "Expected explicitly shallow section stacks to use the shallow section gap.");
  assert(css.includes(":where(.bf-theme) :where(.bf-stack.is-section) {\n  --bf-stack-space: var(--bf-section-space);"), "Expected section stacks to own the tier's regular section gap.");
  assert(css.includes(":where(.bf-theme) :where(.bf-stack.is-section-deep) {\n  --bf-stack-space: var(--bf-section-space-deep);"), "Expected deep section stacks to use the deep section gap.");
  assert(css.includes("--bf-component-inline-inset-field:") && css.includes("--bf-component-inline-inset-action:") && css.includes("--bf-component-inline-inset-continuation:") && !css.includes("--bf-disclosure-label-inline-offset:") && !css.includes("--bf-icon-label-inline-offset:"), "Expected field, action, and continuation to be authoritative component inset inputs rather than aliases of one component.");
  assert(css.includes("padding-inline-start: var(--bf-component-inline-inset-continuation);"), "Expected accordion panels to share the continuation inset.");
  for (const [selector, inset] of [
    [":where(.bf-theme) :where(.bf-card, .bf-card.is-highlighted, .bf-card.is-overlay, .bf-card.is-muted)", "action"],
    [":where(.bf-theme) :where(.bf-option-card)", "action"],
    [":where(.bf-theme) :where(.bf-search-and-filter-panel)", "action"],
    [":where(.bf-theme) :where(.bf-contextual-menu-link)", "action"],
    [":where(.bf-theme) :where(.bf-code-snippet-title)", "continuation"],
    [":where(.bf-theme) :where(.bf-code-snippet-dropdown)", "action"],
    [":where(.bf-theme) :where(.bf-code-snippet-block, .bf-code-snippet-block.is-icon, .bf-code-snippet-block.is-numbered)", "continuation"]
  ] as const) {
    assertRuleHasDecl(ast, selector, {
      "padding-inline": `var(--bf-component-inline-inset-${inset})`
    }, `${selector} chooses the shared ${inset} component inset`);
  }
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-tooltip-message)", {
    "display": "flow-root",
    "padding-block": "var(--bf-control-block-inset)",
    "padding-inline": "var(--bf-component-inline-inset-field)"
  }, "Tooltip outer surface owns compact padding and contains its metric text child");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-tooltip-text)", {
    "display": "block",
    "margin": "0 0 var(--bf-body-margin-bottom)",
    "padding-block-end": "0"
  }, "Tooltip inner text owns metric nudge and SP13 compensation separately from surface padding");
  assert(css.includes("padding-block-start: var(--bf-body-nudge-start,"), "Expected Tooltip inner text to consume the generated body metric nudge with a tier fallback.");
  for (const selector of [
    ":where(.bf-theme) :where(fieldset, .bf-fieldset)",
    ":where(.bf-theme) :where(.bf-side-navigation-drawer-header)"
  ]) {
    assertRuleHasDecl(ast, selector, {
      "padding-inline": "var(--bf-panel-padding-inline)"
    }, `${selector} consumes structural panel padding rather than a component content inset`);
  }
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-side-navigation-drawer)", {
    "display": "flex",
    "flex-direction": "column",
    "gap": "var(--bf-section-space-shallow)"
  }, "mobile SideNavigation drawers own the relationship between chrome and body");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-side-navigation-drawer-header)", {
    "margin-bottom": "0"
  }, "SideNavigation drawer headers leave relationship spacing to their parent");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-side-navigation-drawer-chrome)", {
    "display": "grid",
    "gap": "0"
  }, "SideNavigation drawer chrome groups its optional brand and sticky toggle without adding a second relationship gap");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-side-navigation-drawer-body)", {
    "min-inline-size": "0"
  }, "SideNavigation drawer body is the shrinkable content slot below the chrome");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-modal-dialog)", {
    "gap": "var(--bf-section-space-shallow)",
    "padding-block": "var(--bf-panel-padding-block)",
    "padding-inline": "var(--bf-component-inline-inset-action)"
  }, "modal roots own standard surface insets and the group gap between sections");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-modal-header, .bf-modal-body, .bf-modal-footer)", {
    "padding": "0"
  }, "modal sections add no padding inside the root-owned surface spacing");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-search-and-filter-panel)", {
    "gap": "var(--bf-section-space-shallow)",
    "padding-inline": "var(--bf-component-inline-inset-action)"
  }, "SearchAndFilter roots own the standard surface inset and group gap");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-filter-panel-section)", {
    "padding": "0"
  }, "SearchAndFilter sections add no spacing beside the root-owned group gap");
  assert(css.includes("vertical-align: baseline;") && !css.includes("vertical-align: calc(var(--bf-border-width) - var(--bf-body-nudge-start"), "Expected inline chips to expose their first text baseline without reapplying the body metric nudge.");
  assert(css.includes("margin: 0 0 calc(var(--bf-field-gap) - 0.0625rem);"), "Expected rules to reserve the governed item gap inclusive of their 0.0625rem thickness.");
  assert(css.includes("margin-block-end: calc(var(--bf-field-gap) - var(--bf-bar-thickness));"), "Expected highlighted rules to reserve the governed item gap inclusive of their shared thickness.");
  assert(css.includes("padding-block-end: var(--bf-strip-space);"), "Expected strip rhythm to live on the bottom edge only.");
  assert(!css.includes("padding-block: var(--bf-strip-space);"), "Expected strip rhythm to avoid symmetric top-and-bottom padding.");
  assert(css.includes(".bf-grid"), "Expected CSS to include grid selectors.");
  assert(css.includes(".bf-section"), "Expected CSS to include section selectors.");
  assert(css.includes(".bf-stack"), "Expected CSS to include stack selectors.");
  assert(!css.includes("NaN"), "Expected generated CSS to avoid NaN values from incomplete surface configuration.");
  assert(css.includes(".bf-stage-shell"), "Expected CSS to include the stage-shell helper.");
  assert(css.includes(".u-baseline-grid"), "Expected CSS to include the baseline grid utility.");
  assert(!css.includes("min-inline-size: 8em;"), "Expected text-like controls to avoid hard minimum widths that break narrow panels.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-field-boundary)", {
    "display": "grid",
    "grid-template-areas": '"field-boundary"',
    "margin-block-end": "var(--bf-interface-row-compensation-block-end)"
  }, "replaced fields use a named boundary owner for compensation and paint");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-field-boundary, .bf-color-control, .bf-search-box, .bf-search-and-filter-search-container)", {
    "position": "relative"
  }, "field paint owners establish their overlay containing block");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-input, input:not([type]), input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select)", {
    "border": "0",
    "margin": "0",
    "padding-block": "var(--bf-interface-row-padding-block)"
  }, "native fields retain interaction while layout geometry excludes stroke width");
  assert(css.includes(":not(:where(.bf-field-boundary *, .bf-color-control *, .bf-search-box *, .bf-search-and-filter-search-container *))") && css.includes("box-shadow: inset 0 calc(var(--bf-border-width) * -1) 0 var(--bf-native-field-stroke-color);") && css.includes("outline: var(--bf-border-width) solid CanvasText;"), "Expected bare text-like native fields, including omitted-type inputs, to retain one geometry-neutral compatibility boundary without double-painting inside approved owners.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-field-boundary, .bf-color-control, .bf-search-box, .bf-search-and-filter-search-container)::after", {
    "border": "0 solid transparent",
    "pointer-events": "none",
    "position": "absolute"
  }, "field paint uses the automatic non-intercepting last-child overlay");
  assert(css.includes("input[type='file'])::file-selector-button") && css.includes("box-shadow: inset 0 0 0 var(--bf-border-width) var(--bf-color-border-default);") && css.includes("padding-block: var(--bf-interface-row-padding-block);"), "Expected the file selector's named native part to paint without a layout border while the field boundary owns the outer rule.");
  assert(css.includes(":where(.bf-control) {\n  display: grid;\n  gap: var(--bf-field-gap);\n  min-inline-size: 0;"), "Expected form controls to allow shrinking inside narrow containers.");
  assert(css.includes(":where(.bf-field.is-checkbox) :where(.bf-control) {\n  gap: 0;"), "Expected checkbox field controls to avoid downstream gap overrides.");
  assert(css.includes("--bf-slider-row-block-size: var(--bf-interface-row-occupied-block-size);") && css.includes("--bf-slider-track-offset: calc(var(--bf-body-nudge-start"), "Expected generated CSS to place the slider track metrically within the shared interface row.");
  assert(css.includes("--bf-interface-row-visual-offset: calc(var(--bf-interface-row-content-offset-block-start)") && css.includes("--bf-switch-track-offset: var(--bf-interface-row-visual-offset);") && css.includes("--bf-tick-box-offset: var(--bf-interface-row-visual-offset);") && css.includes("--bf-leading-icon-offset: var(--bf-interface-row-visual-offset);"), "Expected switch, tick, and leading-icon geometry to share one body-line visual offset.");
  assert(css.includes("--bf-leading-mark-gap: var(--spacing-gap-mark-inline);") && css.includes("--bf-tick-label-offset: var(--bf-leading-mark-offset);"), "Expected generated CSS to derive tick-label spacing from the canonical shared mark gap rather than an unrelated inset.");
  assert(css.includes("--bf-radio-dot-size: calc((var(--bf-control-visual-size) * 0.375) + var(--bf-border-width));") && css.includes("inset-inline-start: calc((var(--bf-control-visual-size) - var(--bf-radio-dot-size)) * 0.5);") && css.includes("inset-block-start: calc(var(--bf-tick-box-offset) + ((var(--bf-control-visual-size) - var(--bf-radio-dot-size)) * 0.5));"), "Expected the enlarged radio dot to remain concentric with its outer circle inside the shared row geometry.");
  assert(css.includes("--bf-interface-row-padding-block:") && css.includes("--bf-interface-row-compensation-block-end:") && css.includes("--bf-interface-row-visual-offset:"), "Expected generated CSS to expose one paint-only occupied-block contract for body-sized single-line UI.");
  for (const retiredVariable of [
    "--bf-control-baseline-reserve:",
    "--bf-control-block-padding:",
    "--bf-control-block-padding-compact:",
    "--bf-control-box-size:",
    "--bf-control-box-size-compact:",
    "--bf-control-inline-padding:",
    "--bf-input-block-padding:",
    "--bf-button-block-padding:",
    "--bf-single-line-row-",
    "--bf-nested-auxiliary-",
    "--bf-nested-control-",
    "--bf-accordion-indent:",
    "--bf-authoring-accent"
  ]) {
    assert(!css.includes(retiredVariable), `Expected generated CSS to omit retired spacing variable ${retiredVariable}.`);
  }
  assert(!css.includes("--bf-table-row-padding:") && !css.includes(":where(.bf-theme.is-dark),\n:where(.bf-theme.is-dark)"), "Expected generated CSS to omit retired table alignment variables and duplicate dark-theme selectors.");
  assert(css.includes("padding-block: var(--bf-interface-row-padding-block);"), "Expected bordered controls and body-sized single-line rows to share one regular padding contract.");
  for (const [selector, strokeColor, backgroundColor, label] of [
    [":where(.bf-theme) :where(.bf-button.is-positive)", "var(--bf-color-button-positive-default)", "var(--bf-color-button-positive-default)", "positive"],
    [":where(.bf-theme) :where(.bf-button.is-positive:hover)", "var(--bf-color-button-positive-hover)", "var(--bf-color-button-positive-hover)", "positive hover"],
    [":where(.bf-theme) :where(.bf-button.is-positive:is(:active, [aria-pressed='true']))", "var(--bf-color-button-positive-active)", "var(--bf-color-button-positive-active)", "positive active"],
    [":where(.bf-theme) :where(.bf-button.is-negative)", "var(--bf-color-button-negative-default)", "var(--bf-color-button-negative-default)", "negative"],
    [":where(.bf-theme) :where(.bf-button.is-negative:hover)", "var(--bf-color-button-negative-hover)", "var(--bf-color-button-negative-hover)", "negative hover"],
    [":where(.bf-theme) :where(.bf-button.is-negative:is(:active, [aria-pressed='true']))", "var(--bf-color-button-negative-active)", "var(--bf-color-button-negative-active)", "negative active"]
  ] as const) {
    assertRuleHasDecl(ast, selector, { "--bf-stroke-color": strokeColor, "background-color": backgroundColor }, `Button ${label} updates its locally reset stroke and surface slots together`);
  }
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-button.is-link)", { "--bf-stroke-width": "0rem", "background-color": "transparent", "border": "0", "border-radius": "0", "color": "var(--bf-color-link-default)" }, "link Button removes command chrome through the local stroke-width source");
  assert(css.includes(":where(.bf-theme) :where(.bf-button.is-link:hover) {\n  background-color: transparent;\n  color: var(--bf-color-link-default);\n  text-decoration: underline;"), "Expected bf-button.is-link hover state to keep transparent chrome and restore underline treatment.");
  assert(css.includes(":where(.bf-theme) :where(.bf-button.is-icon) > :where(.bf-icon) {\n  margin: 0;"), "Expected generated CSS to keep button icons free of ambiguous text-node-sensitive edge margins.");
  assert(css.includes(":where(.bf-theme) :where(.bf-button.is-icon) {\n  align-items: center;\n  column-gap: var(--bf-leading-mark-gap);"), "Expected bf-button.is-icon to use the shared mark/icon gap for its explicit icon/label relationship.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-button.is-icon:not(.is-nested):not(:has(.bf-button-label)))", {
    "--bf-action-target-overflow": "max(0rem, calc((var(--bf-pointer-target-minimum) - var(--bf-square-block-size)) / 2))",
    "column-gap": "0",
    "justify-self": "start",
    "margin-inline": "var(--bf-action-target-overflow)",
    "min-inline-size": "var(--bf-square-block-size)",
    "padding-inline": "0",
    "position": "relative"
  }, "icon-only buttons derive their intrinsic square from their painted block without a text inset");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-button.is-icon:not(.is-nested):not(:has(.bf-button-label)))::before", {
    "block-size": "var(--bf-body-line-height)",
    "content": '""',
    "inline-size": "0"
  }, "icon-only buttons preserve the occupied body line through a zero-width metric strut");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-button.is-icon:not(.is-nested):not(:has(.bf-button-label)))::after", {
    "block-size": "max(100%, var(--bf-pointer-target-minimum))",
    "content": '""',
    "inline-size": "max(100%, var(--bf-pointer-target-minimum))",
    "left": "50%",
    "pointer-events": "auto",
    "position": "absolute",
    "top": "50%",
    "translate": "-50% -50%"
  }, "icon-only buttons extend their pointer target to the normative 24 CSS-pixel minimum without changing paint or flow");
  assert(!css.includes(":where(.bf-button.is-icon:not(:has(.bf-button-label)))"), "Expected the icon-only geometry selector to exclude the unsupported nested state at the production match boundary.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-actions)", {
    "--bf-action-target-row-gap-floor": "var(--bf-baseline)",
    "gap": "var(--bf-field-gap)"
  }, "ordinary action groups retain the Field gap");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-actions:not(.is-nowrap))", {
    "row-gap": "max(var(--bf-field-gap), var(--bf-action-target-row-gap-floor))"
  }, "wrapping action rows use a target-safe row-gap floor with no single-line cost");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-cluster:not(.is-nowrap))", {
    "--bf-action-target-row-gap-floor": "var(--bf-baseline)",
    "row-gap": "max(var(--bf-cluster-space), var(--bf-action-target-row-gap-floor))"
  }, "wrapping clusters use a target-safe row-gap floor without moving child paint");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-actions.is-nowrap)", {
    "flex-wrap": "nowrap",
    "overflow-x": "auto"
  }, "the built-in nowrap action row declares its clipping scrollport without charging text-only strips block padding");
  assertRuleMissingDecl(ast, ":where(.bf-theme) :where(.bf-actions.is-nowrap)", "padding-block", "text-only nowrap action strips retain their occupied block");
  assertRuleMissingDecl(ast, ":where(.bf-theme) :where(.bf-actions.is-nowrap)", "padding-inline", "text-only nowrap action strips retain their leading keyline");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-actions.is-nowrap:has(> .bf-button.is-icon:not(.is-nested)))", {
    "--bf-action-target-block-clearance": "var(--bf-baseline)",
    "padding-block": "var(--bf-action-target-block-clearance)"
  }, "nowrap action rows with icon-only targets own symmetric target clearance without changing text-only strips");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-actions.is-nowrap) > :where(.bf-button.is-icon:not(.is-nested):not(:has(.bf-button-label)))", {
    "margin-block-end": "var(--bf-interface-row-compensation-block-end)"
  }, "icon-only targets retain ordinary row compensation inside their owner-provided clearance");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-actions.is-nowrap) > :where(.bf-button.is-link.is-icon:not(.is-nested):not(:has(.bf-button-label)))", {
    "margin-block-end": "0"
  }, "link icon targets leave symmetric clearance to their nowrap owner");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-actions:not(.is-nowrap), .bf-cluster:not(.is-nowrap))", {
    "--bf-action-target-row-gap-floor": "round(up, max(0rem, calc(var(--bf-pointer-target-minimum) - var(--bf-body-line-height) + var(--bf-pointer-target-separation))), var(--bf-baseline))"
  }, "supporting engines round the explicit non-paint target separation up to a complete active baseline");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-actions.is-nowrap:has(> .bf-button.is-icon:not(.is-nested)))", {
    "--bf-action-target-block-clearance": "round(up, max(0rem, calc((var(--bf-pointer-target-minimum) - var(--bf-body-line-height)) / 2)), var(--bf-baseline))"
  }, "supporting engines round the owning nowrap row's block-edge shortfall without a one-baseline cap");
  assert(!css.includes("is-icon-target-wrap") && !css.includes("is-icon-target-scrollport"), "Expected generated CSS to remove the unadopted icon-target opt-in API.");
  assert(css.includes(":where(.bf-theme) :where(.bf-button-label) {\n  min-inline-size: 0;"), "Expected icon buttons to expose an explicit label slot so leading and trailing icons have identical spacing.");
  assert(css.includes(":where(.bf-theme) :where(.bf-cta-block) {\n  align-items: baseline;\n  column-gap: var(--bf-component-inline-inset-action);\n  display: flex;\n  flex-wrap: wrap;\n  margin-block-end: 0;"), "Expected generated CSS to keep bf-cta-block externally neutral and use a horizontal action-space owner.");
  assert(css.includes(":where(.bf-theme) :where(.bf-cta-block.is-bordered) {\n  padding-block-start: var(--bf-space-1);"), "Expected bf-cta-block.is-bordered to preserve its clearance without putting the divider in layout.");
  assert(css.includes(":where(.bf-theme) :where(.bf-equal-height-row) {\n  container-type: inline-size;\n  column-gap: var(--bf-grid-gap-inline);\n  display: grid;"), "Expected generated CSS to define the bf-equal-height-row query container without an invalid self-query.");
  assert(css.includes("grid-template-columns: repeat(8, minmax(0, 1fr));"), "Expected bf-equal-height-row to expose its eight logical tracks at every width.");
  assert(css.includes(":where(.bf-theme) :where(.bf-equal-height-row-col) {\n  display: grid;\n  grid-column: 1 / -1;\n  grid-row: span 4;\n  grid-template-rows: subgrid;"), "Expected bf-equal-height-row-col to span the narrow row and opt into subgrid alignment without a layout border.");
  assert(css.includes(":where(.bf-theme) :where(.bf-equal-height-row-col:not(.is-borderless))::after"), "Expected non-borderless equal-height columns to paint through the automatic overlay.");
  assert(css.includes(":where(.bf-theme) :where(.bf-equal-height-row.is-divider-1)::before {\n  grid-row: 2;\n}"), "Expected bf-equal-height-row.is-divider-1 to draw a cross-column rule on subgrid row 2.");
  assert(css.includes(":where(.bf-theme) :where(.bf-equal-height-row.is-divider-2)::after {\n  grid-row: 3;\n}"), "Expected bf-equal-height-row.is-divider-2 to draw a cross-column rule on subgrid row 3.");
  assert(!css.includes("bf-equal-heights") && !css.includes(".equal-heights"), "Expected equal-heights Sites recipe to reuse bf-equal-height-row without a duplicate CSS family.");
  assert(css.includes(":where(.bf-theme) :where(.bf-figure) {\n  display: grid;\n  gap: var(--bf-space-1);\n  inline-size: 100%;\n  margin: 0;\n}"), "Expected bf-figure to stay externally neutral while owning its caption gap.");
  assert(css.includes(":where(.bf-theme) :where(.bf-figure) > :where(img, picture, video, canvas, svg) {\n  block-size: auto;\n  display: block;\n  inline-size: 100%;"), "Expected bf-figure to size embedded media to 100% of its container.");
  assert(css.includes(":where(.bf-theme) :where(.bf-figure-caption) {\n  color: var(--bf-color-text-default);\n  display: block;\n  font-style: italic;"), "Expected bf-figure-caption to render as an italic block beneath the media.");
  assert(css.includes(":where(.bf-theme) :where(.bf-aspect) {\n  aspect-ratio: 16 / 9;"), "Expected generated CSS to define the bf-aspect default 16:9 slot.");
  assert(css.includes(":where(.bf-theme) :where(.bf-aspect.is-16-9) {\n  aspect-ratio: 16 / 9;"), "Expected bf-aspect.is-16-9 modifier to apply the 16:9 ratio.");
  assert(css.includes(":where(.bf-theme) :where(.bf-aspect.is-3-2) {\n  aspect-ratio: 3 / 2;"), "Expected bf-aspect.is-3-2 modifier to apply the 3:2 ratio.");
  assert(css.includes(":where(.bf-theme) :where(.bf-aspect.is-2-3) {\n  aspect-ratio: 2 / 3;"), "Expected bf-aspect.is-2-3 modifier to apply the 2:3 ratio.");
  assert(css.includes(":where(.bf-theme) :where(.bf-aspect.is-cinematic) {\n  aspect-ratio: 12 / 5;"), "Expected bf-aspect.is-cinematic modifier to apply the 12:5 (2.4:1) ratio.");
  assert(css.includes(":where(.bf-theme) :where(.bf-aspect.is-square) {\n  aspect-ratio: 1 / 1;"), "Expected bf-aspect.is-square modifier to apply the 1:1 ratio.");
  assert(css.includes(":where(.bf-theme) :where(.bf-aspect) > :where(img, picture, video, canvas, iframe) {"), "Expected bf-aspect to make embedded media fill the slot.");
  assert(css.includes("padding-block: var(--bf-interface-row-padding-block);"), "Expected regular inline surfaces to use the shared metric-derived row padding.");
  assert(css.includes(":where(.bf-theme) :where(.bf-grid.bf-grid.is-controls) {\n  container-type: inline-size;\n  gap: var(--bf-field-gap);"), "Expected grid CSS to include the dense control-grid recipe on top of bf-grid.");
  assert(css.includes(":where(.bf-theme):where(.bf-page, .bf-grid-scope,"), "Expected grid CSS to include a compound selector so container-type applies when the theme scope and grid-scope are on the same element.");
  assert(css.includes(":where(.bf-theme) :where(.bf-grid.bf-grid.is-controls) > :where(.bf-grid-item.is-control, .bf-grid-item.is-control-pair) {\n  grid-column: auto / span 4;"), "Expected grid CSS to include the default dense control-grid recipe spans.");
  assert(css.includes(":where(.bf-theme) :where(.bf-grid.bf-grid.is-controls) > :where(.bf-grid-item.is-control) {\n    grid-column: auto / span 2;"), "Expected the control-grid recipe to map compact field cells onto the 8-column grid.");
  assert(css.includes(":where(.bf-theme) :where(.bf-grid.bf-grid.is-controls) > :where(.bf-grid-item.is-control-pair) {\n    grid-column: auto / span 8;"), "Expected the control-grid recipe to keep paired inspector surfaces at half width on the 16-column grid.");
  assert(!css.includes(".bf-control-grid"), "Expected generated CSS to omit the deprecated bf-control-grid helper.");
  assert(css.includes(":where(.bf-theme) :where(.bf-field.is-range) {\n  align-items: start;\n  column-gap: var(--bf-component-inline-inset-field);\n  display: grid;"), "Expected inline range fields to use the dedicated two-column field layout and horizontal field-space owner.");
  assert(css.includes(":where(.bf-theme) :where(.bf-field.is-range.is-stacked) > :where(.bf-control, .bf-form-help) {\n  grid-column: 1;"), "Expected stacked range controls and help text to return to the explicit first column without creating an implicit narrow track.");
  assert(css.includes(":where(.bf-theme) :where(.bf-slider.is-stacked),\n:where(.bf-theme) :where(.bf-field.is-range.is-stacked) :where(.bf-slider) {\n  align-items: stretch;\n  display: grid;\n  gap: var(--bf-field-gap);"), "Expected stacked slider pairs and stacked range fields to share the same stacked layout.");
  assert(!css.includes(".slider-pair"), "Expected compat CSS to omit the downstream slider wrapper aliases.");
  assert(!css.includes(".slider-pair--stacked"), "Expected compat CSS to omit the downstream stacked-slider alias.");
  assert(css.includes("inline-size: min(100%, 5rem);"), "Expected slider number inputs to use the compact PVR width.");
  assert(css.includes("flex-wrap: nowrap;"), "Expected inline slider pairs to stay on a single row until the field switches to the stacked variant.");
  assert(css.includes("flex: 0 1 5rem;"), "Expected slider number inputs to shrink before overflowing.");
  assert(!css.includes("min-inline-size: 5rem;"), "Expected slider number inputs to avoid a hard minimum width.");
  assert(css.includes(":where(.bf-switch-slider)"), "Expected generated CSS to include switch styling.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(fieldset, .bf-fieldset)", {
    "border": "0",
    "box-shadow": "inset 0 0 0 var(--bf-border-width) var(--bf-color-border-default)"
  }, "native fieldset/legend anatomy self-paints its frame without layout-border geometry");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-checkbox-label, .bf-radio-label)::before", {
    "border": "0",
    "box-shadow": "inset 0 0 0 var(--bf-border-width) var(--bf-color-border-high-contrast)"
  }, "checkbox and radio frame parts self-paint because the sibling pseudo owns their glyph");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-switch-slider)::before", {
    "border": "0",
    "box-shadow": "inset 0 0 0 var(--bf-border-width) var(--bf-color-border-high-contrast)"
  }, "switch native marker anatomy self-paints its thumb frame");
  for (const selector of [
    ":where(.bf-theme) :where(input[type='range'])::-webkit-slider-thumb",
    ":where(.bf-theme) :where(input[type='range'])::-moz-range-thumb"
  ]) {
    assertRuleHasDecl(ast, selector, { "border": "0" }, `${selector} keeps native-part frame paint out of layout geometry`);
  }
  assert(css.includes("outline: var(--bf-border-width) solid CanvasText;") && css.includes("outline-offset: calc(var(--bf-border-width) * -1);"), "Expected named native marker and fieldset exceptions to retain inset all-sided system outlines in forced colors.");
  assert(css.includes(":where(.bf-validation-message)"), "Expected generated CSS to include validation message styling.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-validation-message)", {
    "margin": "0 0 var(--bf-interface-row-compensation-block-end)",
    "padding-inline-start": "calc(var(--bf-leading-mark-group-inset) + var(--bf-leading-mark-offset))"
  }, "validation copy keeps only block-end compensation while owned padding reserves its marker keyline");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-validation-message)::before", {
    "inset-inline-start": "var(--bf-leading-mark-group-inset)"
  }, "validation marker paint follows the padding-owned keyline");
  assert(!css.includes(".has-error"), "Expected generated CSS to omit the deprecated has-error validation alias.");
  assert(!css.includes(".has-success"), "Expected generated CSS to omit the deprecated has-success validation alias.");
  assert(!css.includes(".has-warning"), "Expected generated CSS to omit the deprecated has-warning validation alias.");
  assert(!/\.has-[a-z][a-z0-9-]*/.test(css), "Expected generated CSS to omit deprecated has-* helper selectors.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-card, .bf-card.is-highlighted, .bf-card.is-overlay, .bf-card.is-muted)", {
    "display": "flex",
    "flex-direction": "column",
    "gap": "var(--bf-section-space-shallow)",
    "overflow": "visible"
  }, "card surfaces own the shared group gap while allowing owned popups to escape");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-card-header)", {
    "border": "0",
    "padding-block-end": "0"
  }, "card sections add no block padding inside the surface-owned group gap");
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
    "gap": "calc(var(--bf-baseline) * 0.5) var(--bf-leading-mark-gap)",
    "list-style": "none",
    "padding": "0"
  }, "breadcrumbs keep the canonical wrapped trail layout");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-breadcrumbs-item)", {
    "margin": "0 0 var(--bf-body-margin-bottom)",
    "padding-block-end": "0",
    "padding-block-start": "var(--bf-body-nudge-start)"
  }, "breadcrumb text retains the body role's metric baseline compensation");
  assert(css.includes(":where(.bf-pagination-items)"), "Expected generated CSS to include pagination styling.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(table, .bf-table)", {
    "border-collapse": "separate",
    "caption-side": "bottom",
    "table-layout": "auto",
    "width": "100%"
  }, "tables keep the canonical BF table layout contract");
  assertRuleHasDecl(ast, `:where(.bf-theme) :where(${nestedFieldSelector}, .bf-button.is-nested:not(.is-link))`, {
    "line-height": "var(--bf-nested-row-line-height)",
    "margin-block": "0",
    "padding-block": "var(--bf-nested-row-padding-block)"
  }, "explicit nested fields and buttons preserve host fit without subtracting paint width from layout geometry");
  assertRuleHasDecl(ast, `:where(.bf-theme) :where(${nestedFieldSelector})`, {
    "block-size": "100%"
  }, "nested textual fields fill their named boundary owner");
  assert(nestedTextInputTypes.every(type => css.includes(`input.bf-input.is-nested[type='${type}']`)), "Expected every supported nested textual input type to be explicit in the positive allowlist.");
  assert(!css.includes("input.bf-input.is-nested:not([type='file'])") && !css.includes("button.bf-button.is-nested") && css.includes(".bf-button.is-nested:not(.is-link)"), "Expected nested density to reject catch-all inputs and link buttons while remaining element-agnostic for bordered buttons.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-checkbox.is-nested > .bf-checkbox-label, .bf-radio.is-nested > .bf-radio-label)", {
    "line-height": "var(--bf-nested-row-line-height)",
    "margin-block": "0",
    "padding-block": "var(--bf-nested-row-padding-block)"
  }, "explicit nested selection controls fit within a host-owned body line");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(th.is-icon-placeholder, td.is-icon-placeholder, .bf-table-cell.is-icon-placeholder)", {
    "padding-inline-start": "calc(var(--bf-component-inline-inset-field) + var(--bf-leading-icon-size) + var(--bf-leading-icon-gap))"
  }, "table icon-placeholder cells keep the leading-icon gutter");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-chip, .bf-chip.is-positive, .bf-chip.is-caution, .bf-chip.is-negative, .bf-chip.is-information)", {
    "--bf-ui-chip-border": "var(--bf-color-border-neutral)",
    "--bf-ui-chip-background": "var(--bf-color-background-neutral-default)",
    "display": "inline-flex",
    "inline-size": "fit-content",
    "justify-content": "center",
    "justify-self": "start",
    "padding-inline": "var(--bf-ui-chip-padding-inline)",
    "white-space": "nowrap"
  }, "chips keep the canonical neutral token defaults and inline chip layout");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-chip, .bf-chip.is-positive, .bf-chip.is-caution, .bf-chip.is-negative, .bf-chip.is-information)", {
    "margin": "0 0 var(--bf-interface-row-compensation-block-end)"
  }, "standalone Chips keep only their block-end row compensation and leave peer spacing to their container");
  assertRuleHasDecl(ast, ":where(.bf-theme)", {
    "--bf-ui-chip-padding-inline": "var(--bf-component-inline-inset-action)"
  }, "chips use the shared Action inset");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-chip, .bf-chip.is-positive, .bf-chip.is-caution, .bf-chip.is-negative, .bf-chip.is-information)", {
    "min-inline-size": "min(100%, calc(var(--bf-interface-row-painted-block-size) + var(--bf-inline-unit)))"
  }, "short Action-framed chips retain a container-safe stadium silhouette independent of paint width");
  const legacyTableChipSelector = ":where(.bf-chip.is-nested:not(.bf-theme):not(:scope td .bf-chip, :scope .bf-theme .bf-chip))";
  const legacySideNavigationChipSelector = ":where(.bf-chip.is-nested:not(.bf-theme):not(:scope .bf-side-navigation .bf-chip, :scope .bf-theme .bf-chip))";
  assertRuleHasDecl(ast, legacyTableChipSelector, {
    "min-inline-size": "min(100%, calc(var(--bf-nested-row-painted-block-size) + var(--bf-inline-unit)))"
  }, "short Chips in named legacy hosts retain the same container-safe stadium contract");
  assertRuleHasDecl(ast, legacySideNavigationChipSelector, {
    "min-inline-size": "min(100%, calc(var(--bf-nested-row-painted-block-size) + var(--bf-inline-unit)))"
  }, "short Chips in named legacy navigation hosts retain the same container-safe stadium contract");
  assert(css.includes("--bf-ui-chip-radius: 999rem;") && css.includes("border-radius: var(--bf-ui-chip-radius);"), "Expected standalone and nested chips to use the shared rem-based pill radius.");
  assert(!css.includes("--bf-ui-chip-border: var(--bf-color-border-default);"), "Expected generated CSS to avoid using the generic default border token for neutral chips.");
  assert(!css.includes("--bf-ui-chip-background: var(--bf-color-background-hover);"), "Expected generated CSS to avoid using the generic hover background token for neutral chips.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-badge, .bf-badge.is-negative)", {
    "display": "inline-block",
    "inline-size": "fit-content",
    "justify-self": "start",
    "min-inline-size": "var(--bf-square-block-size)",
    "padding-inline": "var(--bf-ui-badge-padding-inline)",
    "text-align": "center",
    "text-indent": "0",
    "white-space": "nowrap"
  }, "badges keep the canonical body-sized pill geometry");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-chip, .bf-chip.is-positive, .bf-chip.is-caution, .bf-chip.is-negative, .bf-chip.is-information):has(> :where(.bf-badge, .bf-badge.is-negative))", {
    "column-gap": "var(--bf-component-inline-inset-field)"
  }, "Chip parents own the field-sized relationship before direct badges");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-chip, .bf-chip.is-positive, .bf-chip.is-caution, .bf-chip.is-negative, .bf-chip.is-information) :where(.bf-badge, .bf-badge.is-negative)", {
    "margin-inline": "0"
  }, "badges leave their relationship spacing to the Chip parent");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-chip-dismiss)", {
    "block-size": "var(--bf-icon-size-default)",
    "inline-size": "var(--bf-icon-size-default)"
  }, "Chip dismiss actions use the tier body icon slot");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-chip, .bf-chip.is-positive, .bf-chip.is-caution, .bf-chip.is-negative, .bf-chip.is-information):has(> .bf-chip-dismiss)", {
    "column-gap": "var(--bf-leading-mark-gap)"
  }, "Chip parents own the governed mark gap before a dismiss icon");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-chip-dismiss, .bf-search-box-reset, .bf-search-and-filter-clear)::before", {
    "background": "currentColor",
    "block-size": "var(--bf-icon-size-default)",
    "inline-size": "var(--bf-icon-size-default)",
    "mask-image": "var(--bf-ui-icon-close)",
    "mask-size": "var(--bf-icon-size-default) var(--bf-icon-size-default)"
  }, "close affordances mask the governed tier-sized icon from currentColor so forced colors retains it");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-chip-dismiss)::after", {
    "min-block-size": "var(--bf-pointer-target-minimum)",
    "min-inline-size": "var(--bf-pointer-target-minimum)",
    "pointer-events": "auto"
  }, "Chip dismiss keeps a flow-neutral 24px pointer target around the tier-sized icon");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-table.is-sortable th[aria-sort])::after", {
    "background": "currentColor",
    "inline-size": "calc(var(--bf-leading-mark-gap) + var(--bf-icon-size-default))",
    "mask-image": "var(--bf-ui-icon-chevron-down)",
    "mask-position": "right center",
    "mask-size": "var(--bf-icon-size-default) var(--bf-icon-size-default)"
  }, "sortable headers reserve a separate full mark gap beside an unsqueezed tier-sized caret");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-table.is-sortable th[aria-sort]:dir(rtl))::after", {
    "mask-position": "left center"
  }, "sortable caret paint mirrors without translating its slot or label gap");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-table.is-sortable th[aria-sort='ascending'])::after", {
    "mask-image": "var(--bf-ui-icon-chevron-up)"
  }, "ascending sort state swaps the glyph mask without rotating its reserved gap");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-table.is-sortable th[aria-sort])::after", {
    "background": "CanvasText",
    "forced-color-adjust": "none"
  }, "forced-colors sortable carets preserve their system-color mask paint");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-chip-dismiss, .bf-search-box-reset, .bf-search-and-filter-clear)::before", {
    "background": "CanvasText",
    "forced-color-adjust": "none"
  }, "forced-colors close affordances preserve their system-color mask paint");
  assertRuleMissingDecl(ast, ":where(.bf-theme) :where(.bf-table.is-sortable th[aria-sort])::after", "padding-inline-start", "sortable caret gap remains separate from its tier-sized glyph box");
  assertRuleMissingDecl(ast, ":where(.bf-theme) :where(.bf-table.is-sortable th[aria-sort='ascending'])::after", "transform", "ascending sort state swaps its mask without rotating the reserved gap");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-table-mobile-card-frame > .bf-table.is-mobile-card > tbody)", {
    "gap": "var(--bf-section-space-shallow) var(--bf-grid-gap-inline)"
  }, "mobile table cards use governed group and grid peer relationships rather than continuation or copied space values");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-logo-section.is-contained) :where(.bf-logo-section-item)", {
    "margin-block": "0"
  }, "contained logo items leave relationship spacing to their parent");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-logo-section.is-contained) :where(.bf-logo-section-items)", {
    "row-gap": "var(--bf-space-1)"
  }, "contained logo collections own their wrapped row relationship");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-logo-section-items)", {
    "column-gap": "var(--bf-grid-gap-inline)"
  }, "logo peers use the layout grid gutter rather than a label continuation keyline");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-inline-options-options)", {
    "gap": "var(--bf-field-gap)"
  }, "inline option peers use the governed item gap rather than a label continuation keyline");
  assert(!css.includes(":where(.bf-logo-section-items) {\n  align-items: center;\n  display: flex;\n  flex-wrap: wrap;\n  column-gap: var(--bf-component-inline-inset-continuation);") && !css.includes(":where(.bf-inline-options-options) {\n  display: flex;\n  flex-wrap: wrap;\n  gap: var(--bf-component-inline-inset-continuation);"), "Expected peer collections not to consume SP-10 label continuation as relationship spacing.");
  assertRuleMissingDecl(ast, ":where(.bf-theme) :where(.bf-badge, .bf-badge.is-negative)", "box-sizing", "badge sizing follows the shared border-box contract instead of a losing local content-box override");
  assertRuleMissingDecl(ast, ":where(.bf-theme) :where(.bf-badge, .bf-badge.is-negative)", "max-inline-size", "badges grow with wider counter content instead of clipping at an arbitrary character cap");
  assertRuleMissingDecl(ast, ":where(.bf-theme) :where(.bf-badge, .bf-badge.is-negative)", "overflow", "badges do not hide wider counter content");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-status-label, .bf-status-label.is-positive, .bf-status-label.is-caution, .bf-status-label.is-information, .bf-status-label.is-negative)", {
    "display": "inline-block",
    "inline-size": "fit-content",
    "justify-self": "start",
    "text-decoration": "none",
    "white-space": "nowrap"
  }, "status labels keep the canonical inline label treatment");
  const statusLabelRuleStart = css.indexOf(":where(.bf-theme) :where(.bf-status-label, .bf-status-label.is-positive, .bf-status-label.is-caution, .bf-status-label.is-information, .bf-status-label.is-negative) {");
  const statusLabelRule = css.slice(statusLabelRuleStart, css.indexOf("}\n", statusLabelRuleStart) + 1);
  assert(statusLabelRule.includes("border-block: 0") && statusLabelRule.includes("padding-block: var(--bf-interface-row-padding-block)") && statusLabelRule.includes("margin: 0 0 var(--bf-interface-row-compensation-block-end)"), "Expected status-label geometry to use the symmetric zero-layout-border interface-row contract.");
  assert(css.includes("--bf-nested-row-line-height: calc(var(--bf-interface-row-line-height) - var(--bf-baseline));") && !css.includes("--bf-nested-row-line-height: max(") && css.includes("--bf-nested-row-padding-block: max(0rem, calc((var(--bf-interface-row-line-height) - var(--bf-nested-row-line-height)) / 2));") && css.includes("--bf-nested-row-painted-block-size: calc(var(--bf-nested-row-line-height) + (var(--bf-nested-row-padding-block) * 2));"), "Expected nested surface geometry to use the designed body-line-minus-baseline expression without silently selecting among unrelated constraints.");
  assert(css.includes("--bf-nested-row-visual-offset: calc(var(--bf-nested-row-padding-block) + ((var(--bf-nested-row-line-height) - var(--bf-control-visual-size)) / 2));") && !css.includes("--bf-nested-framed-row-"), "Expected nested interactive controls to share the zero-layout-border ledger within the host body line.");
  const expectedSquareAliases = new Map<string, string>([
    [":where(.bf-theme)", "var(--bf-interface-row-painted-block-size)"],
    [":where(.bf-theme) :where(.bf-badge)", "var(--bf-interface-row-line-height)"],
    [":where(.bf-theme) :where(.bf-badge.is-nested)", "var(--bf-nested-row-line-height)"],
    [":where(.bf-theme) :where(.bf-button.is-link.is-icon:not(.is-nested):not(:has(.bf-button-label)))", "var(--bf-body-line-height)"],
    [":where(.bf-theme) :where(.bf-notification-close)", "var(--bf-notification-close-painted-block-size)"]
  ]);
  const emittedSquareAliases = new Map<string, string>();
  let emittedSquareAliasCount = 0;
  ast.walkDecls("--bf-square-block-size", declaration => {
    const parent = declaration.parent;
    assert(parent?.type === "rule", "Expected every square-block alias declaration to belong to a selector rule.");
    emittedSquareAliasCount += 1;
    emittedSquareAliases.set(parent.selector, declaration.value);
  });
  assert(emittedSquareAliasCount === expectedSquareAliases.size && emittedSquareAliases.size === expectedSquareAliases.size, `Expected exactly ${expectedSquareAliases.size} unique square-block alias states, got ${emittedSquareAliasCount} declarations and ${JSON.stringify([...emittedSquareAliases])}.`);
  for (const [selector, value] of expectedSquareAliases) {
    assert(emittedSquareAliases.get(selector) === value, `Expected ${selector} to re-point --bf-square-block-size to ${value}, got ${emittedSquareAliases.get(selector) ?? "nothing"}.`);
  }
  assert(!css.includes(":where(.bf-theme) :where(.bf-button.is-link.is-icon:not(:has(.bf-button-label)))"), "Expected the link-style alias to exclude the unsupported nested icon-only state at the production match boundary.");
  const expectedSquareConsumers = [
    ":where(.bf-theme) :where(.bf-badge, .bf-badge.is-negative)",
    ":where(.bf-theme) :where(.bf-button.is-icon:not(.is-nested):not(:has(.bf-button-label)))",
    ":where(.bf-theme) :where(.bf-pagination-link:not(.is-previous):not(.is-next))"
  ].sort();
  const emittedSquareConsumers: string[] = [];
  ast.walkDecls("min-inline-size", declaration => {
    if (declaration.value !== "var(--bf-square-block-size)") return;
    const parent = declaration.parent;
    assert(parent?.type === "rule", "Expected every square-block consumer to belong to a selector rule.");
    emittedSquareConsumers.push(parent.selector);
  });
  assert(JSON.stringify(emittedSquareConsumers.sort()) === JSON.stringify(expectedSquareConsumers), `Expected only the reviewed block-derived membership to consume the square alias, got ${JSON.stringify(emittedSquareConsumers)}.`);
  ast.walkRules(rule => {
    if (!rule.selector.includes("bf-tier-")) return;
    const isBlockDerivedOverride = rule.selector.includes("bf-chip") || rule.selector.includes("bf-badge") || rule.selector.includes("bf-button.is-icon") || rule.selector.includes("bf-pagination-link");
    const isGovernedSiteDenseChip = rule.selector.includes(".bf-tier-editorial") && rule.selector.includes(".bf-table td:has(") && rule.selector.includes(".bf-chip");
    let repointsSquare = false;
    rule.walkDecls("--bf-square-block-size", () => { repointsSquare = true; });
    assert((!isBlockDerivedOverride || isGovernedSiteDenseChip) && !repointsSquare, `Expected block-derived geometry to avoid ungoverned per-tier overrides; found ${rule.selector}.`);
  });
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-pagination-link:not(.is-previous):not(.is-next))", {
    "min-inline-size": "var(--bf-square-block-size)",
    "padding-inline": "0"
  }, "bare numbered pagination consumes painted-block geometry without an action inset");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-pagination-link, .bf-pagination-link.is-previous, .bf-pagination-link.is-next)", {
    "border": "0",
    "border-radius": "var(--bf-radius)",
    "padding-inline": "var(--bf-component-inline-inset-action)"
  }, "labelled pagination controls preserve the Action keyline with zero layout-border geometry");
  assert(!css.includes("--bf-pagination-slot-inline-size"), "Expected pagination to retire its occupied-block inline slot alias.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-notification, .bf-notification.is-information, .bf-notification.is-positive, .bf-notification.is-caution, .bf-notification.is-negative)", {
    "--bf-notification-close-painted-block-size": "calc((var(--bf-space-1) * 2) + var(--bf-icon-size-default))"
  }, "notification owns the painted block of its specialized borderless icon action");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-notification-close)", {
    "block-size": "var(--bf-square-block-size)",
    "inline-size": "var(--bf-square-block-size)",
    "padding": "0"
  }, "notification close action reuses its painted block on both axes");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-notification-content)", {
    "padding-inline-end": "var(--bf-notification-close-painted-block-size)"
  }, "notification copy reserves the complete square close-action paint");
  for (const selector of [
    ":where(.bf-theme) :where(.bf-button.is-icon:not(.is-nested):not(:has(.bf-button-label)))",
    ":where(.bf-theme) :where(.bf-pagination-link:not(.is-previous):not(.is-next))"
  ]) {
    for (const property of ["aspect-ratio", "block-size", "inline-size", "transform", "border-radius"]) {
      assertRuleMissingDecl(ast, selector, property, `${selector} derives square geometry without an authored size, transform, aspect ratio, or radius change`);
    }
  }
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-chip, .bf-chip.is-positive, .bf-chip.is-caution, .bf-chip.is-negative, .bf-chip.is-information)", {
    "border-radius": "var(--bf-ui-chip-radius)"
  }, "chip remains one of the two permitted radius owners");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-badge, .bf-badge.is-negative)", {
    "border-radius": "1rem"
  }, "badge remains one of the two permitted radius owners");
  assertRuleMissingDecl(ast, ":where(.bf-theme) :where(.bf-status-label, .bf-status-label.is-positive, .bf-status-label.is-caution, .bf-status-label.is-information, .bf-status-label.is-negative)", "border-radius", "status labels remain rectangular and outside block-derived membership");
  const permittedRadiusSelectors = new Set([
    ":where(.bf-theme) :where(.bf-badge, .bf-badge.is-negative)",
    ":where(.bf-theme) :where(.bf-chip, .bf-chip.is-positive, .bf-chip.is-caution, .bf-chip.is-negative, .bf-chip.is-information)"
  ]);
  const expectedUnaffectedRadii = [
    ":where(.bf-theme) :where(.bf-application-aside-resize-handle)::after => 62.4375rem",
    ":where(.bf-theme) :where(.bf-aside)::after => inherit",
    ":where(.bf-theme) :where(.bf-button, .bf-button.is-base) => var(--bf-radius)",
    ":where(.bf-theme) :where(.bf-button.is-link) => 0",
    ":where(.bf-theme) :where(.bf-button:not(.is-icon:not(.is-nested):not(:has(.bf-button-label))), .bf-button.is-base:not(.is-icon:not(.is-nested):not(:has(.bf-button-label))))::after => inherit",
    ":where(.bf-theme) :where(.bf-card, .bf-card.is-highlighted, .bf-card.is-overlay, .bf-card.is-muted)::after => inherit",
    ":where(.bf-theme) :where(.bf-card-header)::after => inherit",
    ":where(.bf-theme) :where(.bf-card-preview:not(.is-missing))::after => inherit",
    ":where(.bf-theme) :where(.bf-chip, .bf-chip.is-positive, .bf-chip.is-caution, .bf-chip.is-negative, .bf-chip.is-information)::after => inherit",
    ":where(.bf-theme) :where(.bf-choice-row)::after => inherit",
    ":where(.bf-theme) :where(.bf-code-snippet-block.is-icon.is-copied)::after => inherit",
    ":where(.bf-theme) :where(.bf-code-snippet-dropdown) + :where(.bf-code-snippet-dropdown)::after => inherit",
    ":where(.bf-theme) :where(.bf-code-snippet-header)::after => inherit",
    ":where(.bf-theme) :where(.bf-code-snippet-header.is-stacked) :where(.bf-code-snippet-dropdowns)::after => inherit",
    ":where(.bf-theme) :where(.bf-code-snippet.is-bordered)::after => inherit",
    ":where(.bf-theme) :where(.bf-content-card)::after => inherit",
    ":where(.bf-theme) :where(.bf-content-card-footer)::after => inherit",
    ":where(.bf-theme) :where(.bf-contextual-menu-dropdown)::after => inherit",
    ":where(.bf-theme) :where(.bf-contextual-menu-group) + :where(.bf-contextual-menu-group)::after => inherit",
    ":where(.bf-theme) :where(.bf-cta-block.is-bordered)::after => inherit",
    ":where(.bf-theme) :where(.bf-equal-height-row-col:not(.is-borderless))::after => inherit",
    ":where(.bf-theme) :where(.bf-field-boundary) => var(--bf-radius)",
    ":where(.bf-theme) :where(.bf-field-boundary, .bf-color-control, .bf-search-box, .bf-search-and-filter-search-container)::after => inherit",
    ":where(.bf-theme) :where(.bf-input, input:not([type]), input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select) => var(--bf-radius)",
    ":where(.bf-theme) :where(.bf-media-object-media.is-round > :where(img, picture, svg, video)) => 50%",
    ":where(.bf-theme) :where(.bf-modal-dialog)::after => inherit",
    ":where(.bf-theme) :where(.bf-modal-footer)::after => inherit",
    ":where(.bf-theme) :where(.bf-modal-header)::after => inherit",
    ":where(.bf-theme) :where(.bf-navigation-bar)::after => inherit",
    ":where(.bf-theme) :where(.bf-navigation-drawer)::after => inherit",
    ":where(.bf-theme) :where(.bf-notice, .bf-notice.is-information, .bf-notice.is-positive, .bf-notice.is-caution, .bf-notice.is-negative)::after => inherit",
    ":where(.bf-theme) :where(.bf-notification-meta)::after => inherit",
    ":where(.bf-theme) :where(.bf-notification:not(.is-borderless))::after => inherit",
    ":where(.bf-theme) :where(.bf-option-card)::after => inherit",
    ":where(.bf-theme) :where(.bf-pagination-link, .bf-pagination-link.is-previous, .bf-pagination-link.is-next) => var(--bf-radius)",
    ":where(.bf-theme) :where(.bf-pagination-link, .bf-pagination-link.is-previous, .bf-pagination-link.is-next)::after => inherit",
    ":where(.bf-theme) :where(.bf-panel-footer)::after => inherit",
    ":where(.bf-theme) :where(.bf-prose ul > li)::before => 50%",
    ":where(.bf-theme) :where(.bf-radio-label)::after => 50%",
    ":where(.bf-theme) :where(.bf-radio-label)::before => 50%",
    ":where(.bf-theme) :where(.bf-search-and-filter-panel)::after => inherit",
    ":where(.bf-theme) :where(.bf-search-box-button)::after => inherit",
    ":where(.bf-theme) :where(.bf-filter-panel-section:not(:last-child))::after => inherit",
    ":where(.bf-theme) :where(.bf-hero:not(.is-borderless))::after => inherit",
    ":where(.bf-theme) :where(.bf-inline-options)::after => inherit",
    ":where(.bf-theme) :where(.bf-segmented-control-button, .bf-tab-buttons-button) => 0",
    ":where(.bf-theme) :where(.bf-segmented-control-button, .bf-tab-buttons-button)::after => inherit",
    ":where(.bf-theme) :where(.bf-side-navigation-drawer-header)::after => inherit",
    ":where(.bf-theme) :where(.bf-side-navigation-toggle, .bf-side-navigation-toggle.is-in-drawer) => var(--bf-radius)",
    ":where(.bf-theme) :where(.bf-side-navigation-toggle, .bf-side-navigation-toggle.is-in-drawer)::after => inherit",
    ":where(.bf-theme) :where(.bf-switch-slider) => var(--bf-control-visual-size)",
    ":where(.bf-theme) :where(.bf-switch-slider)::before => 50%",
    ":where(.bf-theme) :where(.bf-table-mobile-card-frame > .bf-table.is-mobile-card > tbody > tr)::after => inherit",
    ":where(.bf-theme) :where(.bf-tabs-link.is-active, .bf-tabs-link[aria-selected='true'])::after => inherit",
    ":where(.bf-theme) :where(.bf-tabs-list)::after => inherit",
    ":where(.bf-theme) :where(.bf-token-row)::after => inherit",
    ":where(.bf-theme) :where(.bf-top-navigation)::after => inherit",
    ":where(.bf-theme) :where(.bf-top-navigation-dropdown)::after => inherit",
    ":where(.bf-theme) :where(.bf-top-navigation-search)::after => inherit",
    ":where(.bf-theme) :where(.bf-top-navigation.is-reduced) :where(.bf-top-navigation-search)::after => inherit",
    ":where(.bf-theme) :where(.bf-tooltip-message)::after => inherit",
    ":where(.bf-theme) :where(.bf-validation-message)::before => 50%",
    ":where(.bf-theme) :where(input[type='file'])::file-selector-button => var(--bf-radius)",
    ":where(.bf-theme) :where(input[type='range']) => var(--bf-baseline)",
    ":where(.bf-theme) :where(input[type='range'])::-moz-range-progress => var(--bf-baseline)",
    ":where(.bf-theme) :where(input[type='range'])::-moz-range-thumb => 50%",
    ":where(.bf-theme) :where(input[type='range'])::-moz-range-track => var(--bf-baseline)",
    ":where(.bf-theme) :where(input[type='range'])::-webkit-slider-runnable-track => var(--bf-baseline)",
    ":where(.bf-theme) :where(input[type='range'])::-webkit-slider-thumb => 50%",
    ":where(.bf-theme) :where(.bf-list.is-divided) > :where(.bf-list-item:not(:first-child))::after => inherit",
    ":where(.bf-theme) :where(.bf-table > thead > tr > th:not([aria-sort]), .bf-table > thead > tr > td, .bf-table > tbody > tr > th:not([aria-sort]), .bf-table > tbody > tr > td, .bf-table > tfoot > tr > th:not([aria-sort]), .bf-table > tfoot > tr > td)::after => inherit"
  ].sort();
  const unaffectedRadii: string[] = [];
  ast.walkDecls("border-radius", declaration => {
    const parent = declaration.parent;
    assert(parent?.type === "rule", "Expected every border-radius declaration to belong to a selector rule.");
    if (!permittedRadiusSelectors.has(parent.selector)) unaffectedRadii.push(`${parent.selector} => ${declaration.value}`);
  });
  assert(JSON.stringify(unaffectedRadii.sort()) === JSON.stringify(expectedUnaffectedRadii), `Expected every radius outside chip and badge to retain the reviewed declaration set; got ${JSON.stringify(unaffectedRadii)}.`);
  const expectedUnaffectedRadiusLonghands = [
    ":where(.bf-theme) :where(.bf-segmented-control-item:first-child .bf-segmented-control-button, .bf-tab-buttons-item:first-child .bf-tab-buttons-button) :: border-end-start-radius => var(--bf-radius)",
    ":where(.bf-theme) :where(.bf-segmented-control-item:first-child .bf-segmented-control-button, .bf-tab-buttons-item:first-child .bf-tab-buttons-button) :: border-start-start-radius => var(--bf-radius)",
    ":where(.bf-theme) :where(.bf-segmented-control-item:last-child .bf-segmented-control-button, .bf-tab-buttons-item:last-child .bf-tab-buttons-button) :: border-end-end-radius => var(--bf-radius)",
    ":where(.bf-theme) :where(.bf-segmented-control-item:last-child .bf-segmented-control-button, .bf-tab-buttons-item:last-child .bf-tab-buttons-button) :: border-start-end-radius => var(--bf-radius)"
  ].sort();
  const unaffectedRadiusLonghands: string[] = [];
  ast.walkDecls(/^border-.+-radius$/, declaration => {
    const parent = declaration.parent;
    assert(parent?.type === "rule", "Expected every radius longhand declaration to belong to a selector rule.");
    unaffectedRadiusLonghands.push(`${parent.selector} :: ${declaration.prop} => ${declaration.value}`);
  });
  assert(JSON.stringify(unaffectedRadiusLonghands.sort()) === JSON.stringify(expectedUnaffectedRadiusLonghands), `Expected every radius longhand to retain the reviewed declaration set; got ${JSON.stringify(unaffectedRadiusLonghands)}.`);
  assert(css.includes(":where(.bf-theme) :where(button) {\n  font: inherit;") && !css.includes(".bf-theme button {"), "Expected the button font reset to preserve the zero-specificity component cascade.");
  assert(css.includes(":where(.bf-color-control)::before") && css.includes('grid-template-areas: "color-control";') && css.includes('content: "\\00a0";') && css.includes(":where(.bf-color-control) > :where(input[type='color'].bf-color-input)") && css.includes("align-self: stretch;") && css.includes("margin-block-end: var(--bf-interface-row-compensation-block-end);") && css.includes("margin: 0;\n  min-block-size: 0;"), "Expected the color wrapper to own row compensation and the out-of-flow field stroke while preserving its metric strut and native picker.");
  assert(css.includes("padding-block-end: var(--bf-in-box-row-padding-block-end);") && css.includes("padding-block-start: var(--bf-in-box-row-padding-block-start);"), "Expected marginless contextual-menu commands to consume the shared in-box row compensation.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-status-label.is-nested)", {
    "line-height": "var(--bf-nested-row-line-height)",
    "margin-block": "0",
    "padding-block": "var(--bf-nested-row-padding-block)"
  }, "nested status surfaces fit a host-owned body line");
  for (const legacyChipSelector of [legacyTableChipSelector, legacySideNavigationChipSelector]) {
    assertRuleHasDecl(ast, legacyChipSelector, {
      "line-height": "var(--bf-nested-row-line-height)",
      "margin-block": "0",
      "--bf-chip-control-block-inset": "var(--bf-nested-row-padding-block)",
      "padding-block": "var(--bf-chip-control-block-inset)",
      "border": "0",
      "--bf-stroke-color": "var(--bf-ui-chip-border)",
      "padding-inline": "var(--bf-ui-chip-padding-inline)"
    }, "nested Chips in named legacy hosts fit the host-owned body line and paint without block footprint");
    assertRuleHasDecl(ast, `${legacyChipSelector} :where(.bf-chip-lead, .bf-chip-value)`, {
      "line-height": "inherit"
    }, "nested Chip parts inherit the compact host line so badges cannot enlarge it");
  }
  assert(!css.includes(":where(.bf-side-navigation .bf-chip.is-nested, .bf-table td .bf-chip.is-nested)"), "Expected the legacy Chip compatibility path to resolve only through scoped named hosts instead of a cross-product descendant selector.");
  assert(css.includes("@scope (:where(.bf-theme)) to (:where(.bf-theme))") && css.includes("@scope (:where(.bf-side-navigation)) to (:where(.bf-side-navigation, .bf-theme))"), "Expected legacy nested Chips to stop at the nearest named host and product root.");
  /* The scoped legacy compatibility path and the governed Site policy share
     paint geometry, but only the Site Table.Cell path changes density. */
  assertRuleHasDecl(ast, legacyTableChipSelector, {
    "border": "0",
    "--bf-stroke-color": "var(--bf-ui-chip-border)",
    "padding-inline": "var(--bf-ui-chip-padding-inline)"
  }, "legacy table Chips use the reviewed paint-only compatibility anatomy");
  const density = componentDensityPolicy.siteDenseChip;
  assert(
    componentDensityPolicy.version === 1 &&
    density.product === "editorial" &&
    density.provider === ".bf-table td" &&
    JSON.stringify(density.providerBoundaries) === JSON.stringify(["td", ".bf-theme"]) &&
    density.subscriber === ".bf-chip" &&
    density.role === "spacing.inset.control.block",
    `Expected the versioned dense Chip policy to name the exact product, nearest-provider boundaries, subscriber and role; got ${JSON.stringify(componentDensityPolicy)}.`
  );
  assert(
    css.includes(`${density.comfortableMember}: var(--bf-control-block-inset);`) &&
    css.includes(`${density.denseMember}: var(--bf-space-half);`) &&
    css.includes(`${density.currentMember}: var(${density.denseMember});`) &&
    css.includes(`${density.componentBinding}: var(${density.currentMember}, var(--bf-control-block-inset));`) &&
    css.includes(`padding-block: var(${density.componentBinding});`) &&
    css.includes("line-height: var(--bf-body-line-height);") &&
    css.includes("margin-block: 0;") &&
    css.includes("min-inline-size: min(100%, calc(var(--bf-body-line-height) + (var(--bf-chip-control-block-inset) * 2)));"),
    "Expected the Site table provider and Chip subscriber to bind the named dense control-block member without a layout-border term or child compensation."
  );
  assert(
    css.includes("@scope (:where(.bf-theme.bf-tier-editorial)) to (:where(.bf-theme))") &&
    css.includes("@scope (:where(.bf-table td)) to (:where(td, .bf-theme))") &&
    css.includes(":scope:has(.bf-chip:not(.bf-theme):not(:scope td .bf-chip, :scope .bf-theme .bf-chip))") &&
    !css.includes(".bf-dense-chip-host"),
    "Expected automatic dense Chip enrollment to cross neutral descendants, stop at nearest cells and product roots, and expose no public host toggle."
  );
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-status-label.is-nested)", {
    "border-block-width": "0"
  }, "nested status labels remove their transparent block border footprint");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-badge.is-nested)", {
    "align-self": "center",
    "line-height": "var(--bf-nested-row-line-height)",
    "vertical-align": "middle"
  }, "nested badges fit and centre within a host-owned body line");
  assert(css.includes(".bf-button.is-nested"), "Expected bordered action targets to expose only the explicit nested composition modifier.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(input[type='number'])", {
    "appearance": "auto"
  }, "number inputs retain the browser-owned pointer-accessible stepper");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(select)", {
    "background-position": "right var(--bf-component-inline-inset-field) center",
    "background-size": "var(--bf-icon-size-default) var(--bf-icon-size-default)",
    "overflow": "hidden",
    "text-overflow": "ellipsis",
    "white-space": "nowrap",
    "padding-inline-end": "calc(var(--bf-icon-size-default) + var(--bf-leading-mark-gap) + var(--bf-component-inline-inset-field))"
  }, "selects reserve the tier icon, mark gap, and field edge inset while truncating long selected values");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(select:dir(rtl))", {
    "background-position": "left var(--bf-component-inline-inset-field) center"
  }, "select artwork follows logical inline-end in RTL");
  assert(!css.includes("--bf-ui-icon-number-stepper") && !css.includes("::-webkit-inner-spin-button") && !css.includes("::-webkit-outer-spin-button"), "Expected number inputs not to paint inert replacement arrows or disable native spin buttons.");
  assert(css.includes("--bf-ui-badge-padding-inline: 0.0625rem;") && !css.includes("--bf-ui-badge-padding-inline: var(--bf-border-width);") && !css.includes("--bf-ui-badge-padding-inline: calc("), "Expected badge overflow padding to stay a named rem-scalable member independent of stroke width and typography.");
  assert(!css.includes("min-width: calc(var(--bf-body-line-height") && !css.includes("min-inline-size: calc(var(--bf-body-line-height"), "Expected badge inline floors to resolve through the cascade-repointed square contract rather than a build-time body-line interpolation.");
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
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-navigation-bar.is-responsive) :where(.bf-panel-header.is-navigation-brand)", {
    "column-gap": "var(--bf-leading-mark-gap)",
    "padding-inline-end": "var(--bf-panel-content-padding-inline)"
  }, "responsive application brands use the shared panel header geometry");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-search-and-filter-search-container[aria-expanded='false'])", {
    "min-block-size": "var(--bf-interface-row-painted-block-size)"
  }, "collapsed search-and-filter hosts leave trailing compensation to their external margin");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-navigation-bar)", {
    "--bf-overlay-stroke-layer": "inset 0 calc(var(--bf-stroke-width) * -1) 0 var(--bf-stroke-color)",
    "--bf-stroke-color": "var(--bf-color-border-low-contrast)"
  }, "responsive application bars paint their trailing keyline outside layout geometry");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-navigation-bar)::after", {
    "inset": "0",
    "pointer-events": "none",
    "position": "absolute"
  }, "responsive application bars use the automatic last-child paint overlay");
  assertRuleMissingDecl(ast, ":where(.bf-theme) :where(.bf-navigation-bar)", "border-bottom", "responsive application bars do not put their trailing keyline in layout");
  assert(!css.includes(":where(.bf-theme) :where(.bf-navigation-bar.is-responsive) {\n  margin-block-end:"), "Expected responsive application bars to need no negative border compensation.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-application:has(> .bf-navigation)):has(> .bf-aside.is-pinned:not(.is-collapsed))", {
    "grid-template-areas": "\"navigation-bar navigation-bar\"\n    \"main aside\"",
    "grid-template-rows": "min-content minmax(0, 1fr)"
  }, "responsive application bars retain the first row when a pinned aside is present");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-application:has(> .bf-navigation:not(.is-collapsed))) > :where(.bf-navigation-bar.is-responsive)", {
    "block-size": "0",
    "position": "absolute",
    "visibility": "hidden"
  }, "wide expanded navigation removes the compact brand row without deleting its responsive controls");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-search-box)", {
    "--bf-search-box-action-inline-size": "max(var(--bf-pointer-target-minimum), calc(var(--bf-icon-size-default) + (var(--bf-component-inline-inset-field) * 2)))",
    "--bf-search-box-trailing-inline-size": "calc(var(--bf-search-box-action-inline-size) * 2)",
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
    "--bf-search-and-filter-action-inline-size": "max(var(--bf-pointer-target-minimum), calc(var(--bf-icon-size-default) + (var(--bf-component-inline-inset-field) * 2)))",
    "--bf-search-and-filter-trailing-inline-size": "calc(var(--bf-search-and-filter-action-inline-size) * 2)",
    "display": "inline-flex",
    "flex": "1 1 12rem",
    "max-inline-size": "100%",
    "min-inline-size": "0"
  }, "search-and-filter boxes shrink inside narrow rails");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-search-and-filter-input)", {
    "padding-inline-end": "var(--bf-search-and-filter-trailing-inline-size)"
  }, "search-and-filter inputs reserve their trailing affordance space from the field padding token");
  assert(css.includes("--bf-disclosure-gap: var(--bf-leading-mark-gap);"), "Expected disclosures to share the Canonical mark/icon text-gap owner.");
  assert(css.includes("--bf-disclosure-icon-inline-size: var(--bf-icon-size-default);"), "Expected generated CSS to derive the shared disclosure icon slot from the tier body icon size.");
  assert(css.includes("--bf-disclosure-icon-optical-offset-block: 0rem;"), "Expected disclosure chevrons to remain centred on their text line without the leading-icon optical offset.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-side-navigation-accordion-button)", {
    "gap": "var(--bf-side-navigation-icon-gap)"
  }, "side-navigation accordion buttons use the panel's tier mark gap");
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
  // on each tier's own baseline, including the 0.25rem app and OS tiers.
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-top-navigation-row)", {
    "display": "flex",
    "flex-direction": "column",
    "min-block-size": "var(--bf-navigation-bar-min-block-size)",
    "min-inline-size": "0",
    "padding-block": "calc(var(--bf-baseline) / 2)"
  }, "top-navigation row reserves one complete baseline across its block edges");
  assert(css.includes("transform: translateY(-50%) rotate(0deg);\n  transition: transform 160ms ease;"), "Expected closed top-navigation chevrons to use inset centering and point downward before expansion.");
  assert(css.includes(":where(.bf-theme) :where(.bf-top-navigation-item.is-dropdown-toggle.is-active) > :where(.bf-top-navigation-dropdown-toggle)::after {\n  transform: translateY(-50%) rotate(180deg);\n}"), "Expected active top-navigation chevrons to remain inset-centred and rotate upward after expansion.");
  assert(css.includes(":where(.bf-theme) :where(.bf-top-navigation-item.is-dropdown-toggle.is-active) > :where(.bf-top-navigation-dropdown) {"), "Expected generated CSS to include the active top-navigation dropdown reveal styling.");
  assert(css.includes("--bf-top-navigation-reduced-row-block-size: var(--bf-interface-row-occupied-block-size);") && css.includes("min-block-size: var(--bf-top-navigation-reduced-row-block-size);") && css.includes("padding-block-end: calc(var(--bf-interface-row-padding-block) + var(--bf-interface-row-compensation-block-end));") && css.includes("top: var(--bf-top-navigation-reduced-row-block-size);"), "Expected reduced top navigation to occupy the complete interface row and place dropdowns from that row.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-icon)", {
    "background-size": "contain",
    "display": "inline-block",
    "transform": "var(--bf-icon-transform)",
    "vertical-align": "calc(var(--bf-inline-icon-baseline-shift) + ((var(--bf-icon-size-default) - var(--bf-icon-size)) / 2))"
  }, "icon base styling keeps the shared image-sized inline-block contract and metric baseline alignment");
  assert(css.includes("--bf-inline-icon-baseline-shift: calc((var(--bf-border-width) * 0.5) + ((1cap - var(--bf-icon-size-default)) / 2));"), "Expected inline icons to derive one Vanilla-compatible cap-centred baseline shift from the active font metric, default icon size, and scalable optical lift.");
  assert(!css.includes("--bf-inline-icon-line-box-trim"), "Expected icons to avoid layout-margin or relative-inset line-box trims.");
  assert(!css.includes("vertical-align: bottom;"), "Expected no reusable inline icon to align against the line-box bottom edge.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-table.is-sortable th[aria-sort])::after", {
    "inline-size": "calc(var(--bf-leading-mark-gap) + var(--bf-icon-size-default))",
    "mask-image": "var(--bf-ui-icon-chevron-down)",
    "mask-size": "var(--bf-icon-size-default) var(--bf-icon-size-default)",
    "pointer-events": "none",
    "vertical-align": "var(--bf-inline-icon-baseline-shift)"
  }, "sortable-table chevrons reserve the mark gap outside an unsqueezed tier-sized mask and reuse the shared inline-icon metric alignment");
  assertRuleMissingDecl(ast, ":where(.bf-theme) :where(.bf-table.is-sortable th[aria-sort])::after", "margin-inline-start", "sortable-table mark spacing is not a relationship margin");
  assertRuleMissingDecl(ast, ":where(.bf-theme) :where(.bf-table.is-sortable th[aria-sort])::after", "padding-inline-start", "sortable-table mark spacing does not squeeze the icon content box");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-breadcrumbs-item) + :where(.bf-breadcrumbs-item)::before", {
    "padding-inline-end": "var(--bf-leading-mark-gap)"
  }, "breadcrumb separators use owned padding for the mark-to-label gap");
  assertRuleMissingDecl(ast, ":where(.bf-theme) :where(.bf-breadcrumbs-item) + :where(.bf-breadcrumbs-item)::before", "margin-inline-end", "breadcrumb separator spacing is not a relationship margin");
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
  assert(css.includes(":where(.bf-theme) :where(.bf-list) {\n  align-content: start;\n  display: grid;"), "Expected base lists to contain item compensation without stretching occupied tracks.");
  assert(css.includes(":where(.bf-theme) :where(.bf-list-item.is-ticked, .bf-list-item.is-crossed) {"), "Expected generated CSS to include ticked and crossed list-item styling.");
  assert(!css.includes("top: calc(var(--bf-leading-icon-offset) + (var(--bf-baseline) * 0.5));"), "Expected divided list icons to share the first-line alignment instead of sinking by half a baseline.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-list-item) > :where(.bf-list)", {
    "padding-inline-start": "var(--bf-component-inline-inset-action)"
  }, "nested lists own their indentation as padding rather than a relationship margin");
  assertRuleMissingDecl(ast, ":where(.bf-theme) :where(.bf-list-item) > :where(.bf-list)", "margin-inline-start", "nested list indentation is not a margin");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-inline-list)", {
    "--bf-inline-list-space": "0.5rem",
    "align-items": "baseline",
    "column-gap": "var(--bf-inline-list-space)",
    "display": "flex",
    "flex-wrap": "wrap"
  }, "plain and middot inline lists share one parent-owned inline-composition gap");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-inline-list-item)", {
    "margin-inline-end": "0"
  }, "inline-list items leave inter-item spacing to the parent gap");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-inline-list.is-middot)", {
    "align-items": "baseline",
    "column-gap": "var(--bf-inline-list-space)",
    "display": "flex",
    "flex-wrap": "wrap"
  }, "middot inline lists remove source-whitespace geometry and own one half-rem inter-item separator space");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-inline-list.is-middot) :where(.bf-inline-list-item)", {
    "margin-inline-end": "0"
  }, "middot inline-list items leave all inter-item spacing to the list and separator");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-inline-list.is-middot) :where(.bf-inline-list-item:not(:last-of-type))::after", {
    "content": "\"\\2022\"",
    "padding-inline-start": "var(--bf-inline-list-space)"
  }, "middot separators use owned inline padding before the painted separator");
  assertRuleMissingDecl(ast, ":where(.bf-theme) :where(.bf-inline-list.is-middot) :where(.bf-inline-list-item:not(:last-of-type))::after", "margin-inline-start", "middot separator spacing is not a margin");
  assert(css.includes(":where(.bf-theme) :where(.bf-skip-link)"), "Expected generated CSS to include the skip-link styling.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-list-tree)", {
    "list-style": "none"
  }, "list-tree root keeps list semantics reset");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-list-tree-item)", {
    "padding-left": "0",
    "position": "relative"
  }, "list-tree items avoid adding an unaccounted navigation-depth inset");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(a.bf-list-tree-link)", {
    "padding-inline": "var(--bf-component-inline-inset-continuation) var(--bf-component-inline-inset-action)"
  }, "list-tree leaves align directly to the shared continuation inset");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-list-tree-toggle)", {
    "gap": "var(--bf-disclosure-gap)",
    "margin": "0 0 var(--bf-interface-row-compensation-block-end)",
    "padding-block": "var(--bf-interface-row-padding-block)"
  }, "list-tree disclosures derive their text start from the shared mark canvas and gap");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-list-tree) :where(.bf-list-tree[aria-hidden='false'])", {
    "display": "block"
  }, "expanded list-tree branches reveal nested lists");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-list-tree-toggle[aria-expanded='true'])::before", {
    "transform": "translateY(var(--bf-disclosure-icon-optical-offset-block)) rotate(0deg)"
  }, "expanded list-tree toggles retain the shared icon-and-label optical offset in the open state");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-tabs.is-equal)", {
    "--bf-ui-tabs-equal-min": "8rem"
  }, "equal-width tabs expose the canonical minimum track variable");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-tabs)", {
    "display": "grid",
    "gap": "var(--bf-space-2)"
  }, "tabs own the relationship between their list and panel");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-tabs-list)", {
    "margin": "0"
  }, "tab lists do not leak trailing margin");
  assert(css.includes(":where(.bf-theme) :where(.bf-tabs-list)::after") && css.includes(":where(.bf-theme) :where(.bf-tabs-link.is-active, .bf-tabs-link[aria-selected='true'])::after"), "Expected tab-list and active-tab boundaries to use automatic out-of-flow overlays.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-tabs-list)", {
    "overflow-x": "auto",
    "white-space": "nowrap"
  }, "long tab lists scroll inline instead of overflowing their container");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-tabs-item)", {
    "flex": "0 0 auto"
  }, "tab items keep their content width so long lists scroll instead of overlapping");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-tabs-link)", {
    "padding-block-end": "calc(var(--bf-interface-row-padding-block) + var(--bf-interface-row-compensation-block-end))"
  }, "tab links retain the shared occupied height independently of the painted list boundary");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-tabs.is-equal) :where(.bf-tabs-list)", {
    "display": "grid",
    "gap": "var(--bf-component-inline-inset-action)",
    "grid-template-columns": "repeat(auto-fit, minmax(min(100%, var(--bf-ui-tabs-equal-min)), 1fr))",
    "overflow": "visible",
    "white-space": "normal"
  }, "equal-width tabs keep the canonical auto-fit grid contract");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-choice-row)", {
    "display": "grid",
    "grid-template-columns": "auto minmax(0, 1fr) auto",
    "gap": "var(--bf-leading-mark-gap)",
    "padding-inline": "var(--bf-component-inline-inset-field)"
  }, "choice rows keep the canonical selection-row layout while tightening with the field padding token");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-inline-options)", {
    "border": "0",
    "display": "grid",
    "gap": "var(--bf-field-gap)",
    "padding-inline": "var(--bf-component-inline-inset-continuation)"
  }, "inline options keep the canonical stacked layout without putting their painted boundary in layout");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-option-grid)", {
    "display": "grid",
    "grid-template-columns": "repeat(auto-fit, minmax(min(100%, 10rem), 1fr))"
  }, "option-grid keeps the canonical auto-fit card layout");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-option-card)", {
    "display": "grid",
    "min-block-size": "calc((var(--bf-interface-row-occupied-block-size) * 2) + var(--bf-baseline))",
    "text-align": "left"
  }, "option-card keeps the canonical stacked selection-card treatment");
  assert(css.includes(":where(.bf-field:has(> .bf-form-help.is-tight))"), "Expected tight helper text to switch its owning field to zero row-gap.");
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
    "border": "0 solid transparent",
    "border-block-width": "0",
    "display": "inline-flex",
    "padding-block": "var(--bf-interface-row-padding-block)"
  }, "panel toggle styling stays on the regular metric-derived interface contract");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-panel-content.is-flush)", {
    "padding-block": "0",
    "padding-inline": "0"
  }, "panel content exposes an explicit flush composition without changing the padded default");
  assert(css.includes(":where(.bf-application-overlay)"), "Expected generated CSS to include application drawer overlay styling.");
  assert(css.includes(":where(.bf-application.is-fill)"), "Expected generated CSS to expose the full-viewport application modifier.");
  assert(css.includes("block-size: 100dvb;\n  max-block-size: 100dvb;\n  min-block-size: 100dvb;"), "Expected the full-viewport application modifier to own a definite dynamic viewport block size.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-navigation.is-collapsed) :where(.bf-side-navigation-label)", {
    "block-size": "0.0625rem",
    "clip-path": "inset(50%)",
    "inline-size": "0.0625rem",
    "position": "absolute",
    "white-space": "nowrap"
  }, "collapsed application navigation keeps labels accessible without layout size");
  assert(css.includes(":where(.bf-navigation.is-collapsed) :where(.is-fading-when-collapsed, .bf-side-navigation-heading, .bf-side-navigation-status) {\n  display: none;"), "Expected collapsed application navigation headings and status regions to leave layout.");
  assert(css.includes(":where(.bf-navigation:not(.is-collapsed)) > :where(.bf-navigation-drawer) {\n    block-size: 100%;"), "Expected the desktop navigation drawer to fill its navigation grid area.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-side-navigation.is-icons) :where(.bf-side-navigation-link, .bf-side-navigation-text, .bf-side-navigation-accordion-button)", {
    "align-items": "baseline"
  }, "icon side-navigation rows align against the label first-line baseline");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-side-navigation-heading, .bf-side-navigation-heading.is-linked)", {
    "margin": "0 0 var(--bf-body-margin-bottom)",
    "padding-block": "var(--bf-body-nudge-start) 0"
  }, "side-navigation headings use matching body-role nudge and compensation");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-navigation.is-collapsed) :where(.bf-side-navigation-link, .bf-side-navigation-text)", {
    "align-items": "center"
  }, "collapsed icon side-navigation rows retain compact vertical centering");
  assert(css.includes(":where(.bf-theme) :where(.bf-application),\n  :where(.bf-theme):where(.bf-application) {\n    --bf-grid-gap-inline: 1.5rem;"), "Expected application layouts to own the application gutter independently of their typography tier.");
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
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-application-aside-resize-handle)::after", {
    "background": "transparent",
    "width": "0.125rem"
  }, "idle pinned-aside resize handles leave the single-pixel aside border as the only seam");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-application-aside-resize-handle):hover::after,\n:where(.bf-theme) :where(.bf-application-aside-resize-handle):focus-visible::after,\n:where(.bf-theme) :where(.bf-application.is-resizing-aside) :where(.bf-application-aside-resize-handle)::after", {
    "background": "var(--bf-application-resize-handle-active)"
  }, "pinned-aside resize handles reveal the thicker interaction rail only while active");
  assert(css.includes(":where(.bf-theme) :where(.bf-application-aside-resize-handle):focus-visible {\n  outline: 0.125rem solid var(--bf-application-resize-handle-focus-ring);"), "Expected the pinned-aside resize handle to expose the shared authoring focus-ring token.");
  assert(css.includes("background: var(--bf-application-resize-handle-active);"), "Expected the pinned-aside resize handle active state to use its theme-owned component color.");
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
  assert(components.barThickness === "0.1875rem", "Expected generated tokens to include the shared rem-based 0.1875rem emphasis-bar thickness.");
  assert(!("topNavigationBrandRegion" in components), "Expected generated tokens to remove the obsolete fixed navigation brand region.");
  assert(components.inlineInsetField, "Expected generated tokens to include the field component inset.");
  assert(components.inlineInsetAction, "Expected generated tokens to include the action component inset.");
  assert(components.inlineInsetContinuation, "Expected generated tokens to include the continuation component inset.");
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
  assert(!css.includes(':where(.bf-theme.bf-tier-app) :where(.bf-form-label, .bf-form-help, .bf-button'), "Expected the app tier to set scoped inputs instead of restyling leaf components.");
  assert(!css.includes(':where(.bf-theme.bf-tier-app) :where(.bf-status-label.is-nested, .bf-chip.is-nested)') && !css.includes(':where(.bf-theme.bf-tier-app) :where(.bf-input.is-nested'), "Expected nested contracts to consume tier inputs without app-specific restorative selectors.");
  assert(css.includes('font-size: var(--bf-body-font-size);') && css.includes('line-height: var(--bf-body-line-height);'), "Expected app non-heading UI to consume the tier body role instead of a copied private size.");
  assert(css.includes(':where(.bf-panel.is-fill)'), "Expected the app-tier CSS to include the canonical fill-height panel helper.");
  assert(!css.includes('--bf-app-panel-shadow:'), "Expected the app-tier preset CSS to avoid a shared panel shadow token now that bf-panel no longer carries card chrome.");
  assert(!css.includes('box-shadow: var(--bf-app-panel-shadow);'), "Expected the app-tier preset CSS to avoid applying panel box shadows through bf-panel.");
  assert(css.includes('--bf-overlay-elevation-layer: 0 0.625rem 1.25rem rgba(0, 0, 0, 0.12), 0 0 0.1875rem rgba(0, 0, 0, 0.12);') && !css.includes('box-shadow: 0 0.625rem 1.25rem rgba(0, 0, 0, 0.12), 0 0 0.1875rem rgba(0, 0, 0, 0.12);'), "Expected App drawer and aside elevation to feed the local overlay slot instead of repainting the root.");
  assert(!css.includes('padding-block-end: calc(var(--bf-panel-padding-block) - var(--bf-border-width));'), "Expected App navigation panel headers to keep the parent-owned zero-padding section contract without subtracting paint width.");
  assert(!css.includes('.p-'), "Expected the app-tier preset CSS to omit deprecated p-* selectors.");
  assert(!css.includes('.vr-'), "Expected the app-tier preset CSS to omit deprecated vr-* selectors.");
}

function validateAppTierTheme(tokens: Record<string, unknown>, css: string): void {
  const roles = (tokens.roles ?? {}) as Record<string, Record<string, unknown>>;
  const layout = (tokens.layout ?? {}) as Record<string, unknown>;
  const components = (tokens.components ?? {}) as Record<string, unknown>;
  const fontFiles = (tokens.fontFiles ?? []) as Array<Record<string, unknown>>;

  assert(roles.h5?.letterSpacing === "0.05em", "Expected the app h5 role to expose five-percent letter spacing.");

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
  assert(layout.gridGapInline === '1.5rem', "Expected the app-tier preset inline grid gap token to stay at the 1.5rem application gutter.");
  assert(layout.pageMargin === '2rem', "Expected the app-tier preset page margin token to follow the 2rem application outer margin.");
  assert(layout.contentMaxWidth === '60rem', "Expected the app-tier fixed-width token to use the derived 60rem cap.");
  assert(components.panelPaddingInline === '0.75rem' && components.panelPaddingBlock === '0.75rem', "Expected App panel padding to retain 0.75rem on both independently authored axes.");
  assert(components.inlineInsetField === '0.5rem', "Expected the App field inset to match the shared 8px input inset.");
  assert(components.controlBlockInset === '0.25rem', "Expected the App control block inset to use one 4px baseline unit.");
  assert(components.inlineInsetAction === '0.75rem', "Expected the App action inset to adopt the Canonical three-unit command start.");
  assert(components.inlineInsetContinuation === '1.875rem', "Expected the App continuation inset to derive from input inset, 14px icon and 8px mark gap.");
  assert(components.controlVisualSize === '0.875rem', "Expected App icons and leading marks to match the 14px body type size.");
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
  assert(roles.h5.letterSpacing === "0.05em", "Expected the documentation h5 role to expose five-percent letter spacing.");
  assert(roles.h6.fontSize === "1.125rem", "Expected the documentation tier h6 role font size to be 1.125rem.");
  assert(fontSizes.size === 4, "Expected the documentation tier to expose distinct heading and body font sizes.");
  assert(layout.contentMaxWidth === "80rem", "Expected the documentation tier content width to use the derived 80rem documentation cap.");
  assert(layout.measure === "38rem", "Expected the documentation tier reading measure to tighten to 38rem.");
  assert(layout.gridGapInline === "1.5rem", "Expected the documentation tier inline grid gap token to be 1.5rem.");
  assert(layout.gridGapBlock === "1.5rem", "Expected the documentation tier block grid gap token to be 1.5rem.");
  assert(layout.pageMargin === "1.5rem", "Expected the documentation tier page margin token to be 1.5rem.");
  assert(layout.sectionSpace === "2.5rem", "Expected the documentation tier section rhythm to be 2.5rem.");
  assert(layout.sectionSpaceDeep === "6rem", "Expected the documentation tier deep section rhythm to be 6rem.");
  assert(components.inlineInsetField === "0.5rem", "Expected the Documentation field inset to tighten relative to actions.");
  assert(components.inlineInsetAction === "0.75rem", "Expected the Documentation action inset to adopt the Canonical three-unit command start.");
  assert(components.inlineInsetContinuation === "1.875rem", "Expected the Documentation continuation inset to derive from input inset, 14px icon and 8px mark gap.");
  assert(components.controlVisualSize === "0.875rem", "Expected the documentation tier visual control size to tighten slightly.");
  assert(css.includes('.bf-h1'), "Expected the documentation tier CSS to emit role utility selectors.");
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
  assert(roles.h5.letterSpacing === "0.05em", "Expected the prose default h5 to use five-percent letter spacing with small caps.");
  assert(fontSizes.size === 3, "Expected the prose default theme to expose distinct heading and body font sizes.");
  assert(layout.gridGapInline === "1rem", "Expected the prose default inline grid gap token to provide the x-small 1rem gutter.");
  assert(layout.gridGapBlock === "1rem", "Expected the prose default block grid gap token to provide the x-small 1rem gap.");
  assert(layout.pageMargin === "1rem", "Expected the prose default page margin token to provide the x-small 1rem margin.");
  assert(layout.sectionSpace === "4.5rem", "Expected the prose default section rhythm to be 4.5rem.");
  assert(components.radius === "0rem", "Expected the prose default controls to stay square, matching the compat visual direction.");
  assert(components.inlineInsetField === "0.5rem", "Expected the Editorial field inset to preserve its readable content start.");
  assert(components.inlineInsetAction === "1rem", "Expected the Editorial action inset to preserve the shared command start.");
  assert(components.inlineInsetContinuation === "2rem", "Expected the Editorial continuation inset to preserve the shared icon-led copy start.");
  assert(components.controlVisualSize === "1rem", "Expected the prose default control glyphs to use a dedicated 1rem visual size.");

  for (const roleName of Object.keys(roles)) {
    assert(css.includes(`.bf-${roleName}`), `Expected generated CSS to include the configured "${roleName}" utility selector.`);
  }

  assert(!css.includes(".bf-lead"), "Expected CSS to avoid generating an implicit lead alias when no lead role is configured.");
  assert(!css.includes(".bf-eyebrow"), "Expected CSS to avoid publishing a duplicate eyebrow role beside H5.");
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
  assert(roles.h5.letterSpacing === "0.05em", "Expected the OS tier h5 to use five-percent letter spacing with small caps.");
  assert(!roles.h6.fontVariantCaps, "Expected the OS tier h6 to remain plain text rather than small-caps.");
  assert(fontSizes.size === 3, "Expected the OS tier to stay on the canonical three-step editorial size ladder at denser values.");
  assert(layout.measure === "30rem", "Expected the OS tier reading measure to scale down to 30rem.");
  assert(layout.contentMaxWidth === "60rem", "Expected the OS tier content cap not to exceed the 60rem App cap.");
  assert(layout.sectionSpace === "3rem", "Expected the OS tier section rhythm to scale down to 3rem.");
  assert(layout.sectionSpaceDeep === "6rem", "Expected the OS tier deep section rhythm to scale down to 6rem.");
  assert(layout.gridGapInline === "1rem", "Expected the OS tier inline grid gap token to provide the x-small 1rem gutter.");
  assert(layout.gridGapBlock === "1rem", "Expected the OS tier block grid gap token to provide the x-small 1rem gap.");
  assert(layout.pageMargin === "1rem", "Expected the OS tier page margin token to provide the x-small 1rem margin.");
  assert(components.radius === "0rem", "Expected the OS tier controls to stay square like PVR/Vanilla.");
  assert(components.inlineInsetField === "0.25rem", "Expected the OS field inset to stay tighter than action surfaces.");
  assert(components.inlineInsetAction === "0.5rem", "Expected the OS action inset to adopt the Canonical two-unit command start.");
  assert(components.inlineInsetContinuation === "1.25rem", "Expected the OS continuation inset to adopt the Canonical five-unit copy start.");
  assert(components.controlVisualSize === "0.75rem", "Expected the OS tier checkbox/radio/thumb glyphs to use a dedicated 0.75rem visual size.");
  assert(components.fieldGap === "0.25rem", "Expected the OS tier field gap to come from the dense components block.");
  assert(components.panelPaddingInline === "0.5rem", "Expected OS inline panel padding to resolve from two inline units.");
  assert(components.panelPaddingBlock === "0.5rem", "Expected OS block panel padding to tighten to two 0.25rem baseline units.");
  assert(typeof roles.body.nudgeTop === "string" && css.includes(`--bf-body-nudge-start: ${roles.body.nudgeTop};`), "Expected compact list items to expose the OS tier body nudge.");
  assert(css.includes("padding-block: var(--bf-interface-row-padding-block);"), "Expected OS single-line items to use the regular metric-derived row padding.");
  assert(css.includes("--bf-control-visual-size: 0.75rem;"), "Expected the OS tier CSS to expose a dedicated visual control size token.");
  assert(css.includes("block-size: var(--bf-control-visual-size);"), "Expected checkbox/radio/thumb visuals to size from the dedicated control visual token.");
}

async function collectFiles(rootDir: string, extensions: ReadonlySet<string>): Promise<string[]> {
  const files: string[] = [];

  for (const entry of await fs.readdir(rootDir, { withFileTypes: true })) {
    const entryPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectFiles(entryPath, extensions));
    } else if (entry.isFile() && extensions.has(path.extname(entry.name))) {
      files.push(entryPath);
    }
  }

  return files;
}

async function validateScalableAuthoredLengths(): Promise<void> {
  const sourceFiles = [
    ...await collectFiles(path.resolve("src"), new Set([".ts"])),
    ...(await collectFiles(path.resolve("demo"), new Set([".css"]))).filter(filePath => !filePath.startsWith(path.resolve("demo/spec-028/before"))),
    ...await collectFiles(path.resolve("examples"), new Set([".css"])),
    path.resolve("demo/page-chrome.js"),
    path.resolve("demo/spec-runtime.js"),
  ];
  const htmlFiles = [
    ...await collectFiles(path.resolve("demo"), new Set([".html"])),
    ...await collectFiles(path.resolve("examples"), new Set([".html"])),
  ];
  const violations: string[] = [];
  let normativeTargetOccurrences = 0;

  for (const filePath of sourceFiles) {
    const source = await fs.readFile(filePath, "utf8");
    const relativePath = path.relative(process.cwd(), filePath).replaceAll("\\", "/");
    if (relativePath === "src/css-components/button-actions.ts") {
      const occurrences = source.match(/24px\b/g) ?? [];
      normativeTargetOccurrences += occurrences.length;
      if (/px\b/.test(source.replaceAll("24px", ""))) violations.push(relativePath);
    } else if (/px\b/.test(source)) {
      violations.push(path.relative(process.cwd(), filePath));
    }
  }

  for (const filePath of htmlFiles) {
    const html = await fs.readFile(filePath, "utf8");
    const authoredStyles = [
      ...Array.from(html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi), match => match[1]),
      ...Array.from(html.matchAll(/\bstyle\s*=\s*(["'])([\s\S]*?)\1/gi), match => match[2]),
    ].join("\n");
    if (/px\b/.test(authoredStyles)) {
      violations.push(path.relative(process.cwd(), filePath));
    }
  }

  assert(normativeTargetOccurrences === 1, `Expected exactly one shared authored 24 CSS-pixel target-minimum input, got ${normativeTargetOccurrences}.`);
  assert(violations.length === 0, `Expected authored component and demo styles to use rem-scalable lengths except for the reviewed 24 CSS-pixel target minimum; found other px units in ${violations.join(", ")}.`);
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
  const generatedCssArtifacts = {
    default: defaultTheme.css,
    editorial: editorialTier.css,
    documentation: documentationTier.css,
    app: appTier.css,
    os: osTier.css,
    prose: prosePreset.css,
    "app-tier": appTierPreset.css,
    "ibm-plex-engine-smoke": ibmPlexEngineSmoke.css
  };
  const indexDts = await readTextArtifact(path.resolve("dist/index.d.ts"));
  const renewalComponentPages = Object.fromEntries(await Promise.all([
    "article-pagination",
    "accordion",
    "aspect",
    "basic-section",
    "chip",
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
    "tab-section",
    "sticky-footer",
    "equal-heights",
    "empty-state"
  ].map(async pageName => [pageName, await readTextArtifact(path.resolve("demo/components", `${pageName}.html`))])));
  const [engineSmokeHtml, engineIllustrationHtml, formAtlasHtml, rangeHtml, buttonHtml, actionsHtml, componentAtlasJs, componentDemoJs, componentShellCss, specShellCss, pageChromeCss, pageCatalogJs, controlsShellCss, applicationShellHtml, applicationLayoutHtml, tabsHtml, badgeHtml, panelTabsHtml, accordionHtml, sideNavigationHtml, topNavigationHtml, contextualMenuHtml, tooltipHtml, iconHtml, listHtml, inlineListHtml, tieredListHtml, ctaBlockHtml, equalHeightRowHtml, figureHtml, aspectHtml, tableHtml, listTreeHtml, codeSnippetHtml, skipLinkHtml, demoIndexHtml, componentAtlasHtml, patternAtlasHtml, demoControlsHtml, typographicSpecimenHtml, gridSpecHtml, spacingSpecHtml, spacingHorizontalAuditHtml, spacingVerticalAuditHtml, panelHtml] = await Promise.all([
    readTextArtifact(path.resolve("demo/components/engine-smoke.html")),
    readTextArtifact(path.resolve("demo/components/engine-illustration.html")),
    readTextArtifact(path.resolve("demo/components/form-atlas.html")),
    readTextArtifact(path.resolve("demo/components/range.html")),
    readTextArtifact(path.resolve("demo/components/button.html")),
    readTextArtifact(path.resolve("demo/components/actions.html")),
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
    readTextArtifact(path.resolve("demo/components/badge.html")),
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
    readTextArtifact(path.resolve("demo/spec/spacing.html")),
    readTextArtifact(path.resolve("demo/spec/spacing-horizontal.html")),
    readTextArtifact(path.resolve("demo/spec/spacing-vertical.html")),
    readTextArtifact(path.resolve("demo/panel.html"))
  ]);
  const [pageChromeJs, specRuntimeJs, examplePageJs] = await Promise.all([
    readTextArtifact(path.resolve("demo/page-chrome.js")),
    readTextArtifact(path.resolve("demo/spec-runtime.js")),
    readTextArtifact(path.resolve("demo/example-page.js"))
  ]);
  const [spec028ReviewHtml, spec028ReviewCss, spec028ReviewJs, spec028ReviewProvenance] = await Promise.all([
    readTextArtifact(path.resolve("demo/spec-028/index.html")),
    readTextArtifact(path.resolve("demo/spec-028/review.css")),
    readTextArtifact(path.resolve("demo/spec-028/review.js")),
    readTextArtifact(path.resolve("demo/spec-028/provenance.json"))
  ]);

  await runInvariantAsync("Scalable authored lengths", validateScalableAuthoredLengths);
  runInvariant("Common CSS (default)", () => validateCommonCss(defaultTheme.css));
  runInvariant("Common CSS (editorial)", () => validateCommonCss(editorialTier.css));
  runInvariant("Common CSS (documentation)", () => validateCommonCss(documentationTier.css));
  runInvariant("Common CSS (app)", () => validateCommonCss(appTier.css));
  runInvariant("Common CSS (OS)", () => validateCommonCss(osTier.css));
  runInvariant("Common CSS (prose preset)", () => validateCommonCss(prosePreset.css));
  runInvariant("Common CSS (app preset)", () => validateCommonCss(appTierPreset.css));
  runInvariant("BF variable reference detector", () => {
    assert(findUndeclaredBfVariableReferences(":root { color: var(--bf-missing); }").includes("--bf-missing"), "Expected the BF variable reference detector to reject a fallback-free dangling reference.");
    assert(findUndeclaredBfVariableReferences(":root { color: var(--bf-optional, currentColor); }").length === 0, "Expected the BF variable reference detector to allow an optional reference with a fallback.");
  });
  for (const [surfaceName, css] of Object.entries(generatedCssArtifacts)) {
    runInvariant(`Declared BF variables (${surfaceName})`, () => validateDeclaredBfVariableReferences(css));
  }
  for (const [surfaceName, css] of Object.entries(generatedCssArtifacts)) {
    runInvariant(`Horizontal axis separation (${surfaceName})`, () => validateHorizontalAxisSeparation(css, surfaceName));
  }
  for (const [surfaceName, css] of Object.entries(generatedCssArtifacts)) {
    runInvariant(`Typography selector ownership (${surfaceName})`, () => validateTypographySelectorOwnership(css));
  }
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
  await runInvariantAsync("Canonical DTCG spacing adapter", () => validateDtcgSpacingContracts({
    editorial: editorialTier,
    documentation: documentationTier,
    app: appTier,
    os: osTier
  }, defaultTheme.css, ibmPlexEngineSmoke));
  runInvariant("Tier content-cap progression", () => validateTierContentCaps(defaultTheme.css, {
    editorial: editorialTier,
    documentation: documentationTier,
    app: appTier,
    os: osTier
  }));
  runInvariant("Built-in square corners", () => validateBuiltInSquareCorners(defaultTheme.css, {
    editorial: editorialTier,
    documentation: documentationTier,
    app: appTier,
    os: osTier
  }));
  runInvariant("Tier panel-padding progression", () => validateTierPanelPaddingProgression(defaultTheme.css, {
    editorial: editorialTier,
    documentation: documentationTier,
    app: appTier,
    os: osTier
  }));
  runInvariant("Tier strip-space progression", () => validateTierStripSpaceProgression(defaultTheme.css, {
    editorial: editorialTier,
    documentation: documentationTier,
    app: appTier,
    os: osTier
  }));
  runInvariant("Published package exports", () => validatePackageExports(packageJson));
  await runInvariantAsync("Public runtime and types", () => validatePublicRuntimeAndTypes(indexDts, readmeMd));
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
  runInvariant("Demo contracts", () => validateDemoContracts(engineSmokeHtml, componentShellCss, specShellCss, pageChromeCss, pageChromeJs, componentDemoJs, specRuntimeJs, examplePageJs));
  await runInvariantAsync("Spec 028 review demo", () => validateSpec028ReviewDemo(spec028ReviewHtml, spec028ReviewCss, spec028ReviewJs, spec028ReviewProvenance, pageCatalogJs));
  runInvariant("Engine illustration page", () => validateEngineIllustrationPage(pageCatalogJs, componentAtlasHtml, engineIllustrationHtml, componentShellCss));
  runInvariant("Range page", () => validateRangePage(rangeHtml, componentShellCss));
  runInvariant("Button demo", () => validateButtonDemo(buttonHtml));
  runInvariant("Actions demo", () => validateActionsDemo(actionsHtml));
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
  runInvariant("Spacing spec page", () => validateSpacingSpecPage(spacingSpecHtml, spacingHorizontalAuditHtml, spacingVerticalAuditHtml, specShellCss));
  runInvariant("OS tier page", () => validateOsTierPage(pageCatalogJs, panelHtml));
  await runInvariantAsync("Component page tier consistency", () => validateComponentPageTierConsistency(componentDemoJs));
  runInvariant("bf-only demo family", () => validateBfOnlyDemoFamily({
    applicationLayout: applicationLayoutHtml,
    tabs: tabsHtml,
    badge: badgeHtml,
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
