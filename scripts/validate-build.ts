import fs from "node:fs/promises";
import path from "node:path";
import { BASELINE_GRID_DARK_THEME_COLOR, BASELINE_GRID_DEFAULT_COLOR, BASELINE_GRID_LIGHT_THEME_COLOR } from "../src/baseline-grid-theme.js";
import { tierNames } from "../src/presets.ts";
import { componentPages } from "./component-demo-shared.ts";
import { assert, getCheckCount } from "./validation-assert.ts";
import { parseCss, assertRuleHasDecl } from "./css-ast-helpers.ts";
import { validateRenewalComponentContracts } from "./validation/renewal-component-contracts.ts";
import { assertNoDuplicateClassAttributes } from "./validation/html-contract-helpers.ts";
import {
  validateAppTierDemoPage,
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
      const baselineCompensation = baselineUnit - parseRemValue(token.nudgeTop);
      assert(Number.isFinite(marginBottom) && marginBottom >= 0, `Expected ${tierName}/${roleName} manifest marginBottom to be finite and non-negative.`);
      assert(Math.abs(marginBottom - baselineCompensation) <= 0.00001, `Expected ${tierName}/${roleName} manifest marginBottom to complement nudgeTop to one baseline unit.`);
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

function validateTierPanelPaddingProgression(
  sharedCss: string,
  tierArtifacts: Record<string, { tokens: Record<string, unknown>; css: string; }>
): void {
  const expectedPadding = new Map([
    ["editorial", "1rem"],
    ["documentation", "1rem"],
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
    assert(direct.get("--bf-panel-padding-inline") === expected && direct.get("--bf-panel-padding-block") === expected, `Expected direct ${tierName} panel padding properties to resolve to ${expected}.`);
    assert(scoped.get("--bf-panel-padding-inline") === expected && scoped.get("--bf-panel-padding-block") === expected, `Expected scoped ${tierName} panel padding properties to resolve to ${expected}.`);
    resolvedInline.push(parseRemValue(components.panelPaddingInline));
    resolvedBlock.push(parseRemValue(components.panelPaddingBlock));
  }

  assert(resolvedInline.every((padding, index) => index === 0 || padding <= resolvedInline[index - 1]), `Expected inline panel padding not to increase across denser tiers, got ${resolvedInline.join(" >= ")}rem.`);
  assert(resolvedBlock.every((padding, index) => index === 0 || padding <= resolvedBlock[index - 1]), `Expected block panel padding not to increase across denser tiers, got ${resolvedBlock.join(" >= ")}rem.`);
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
  const exampleDirs = [path.resolve("examples/grid"), path.resolve("examples/spacing")];

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
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-cluster.is-split)", {
    "justify-content": "space-between",
  }, "split clusters distribute their first and final groups while preserving wrapping");
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
  assert(css.includes(":where(.bf-theme) :where(a) {\n  color: var(--bf-color-link);\n  text-decoration: none;"), "Expected raw links to omit their underline in the resting state.");
  assert(css.includes(":where(.bf-theme) :where(a:is(:hover, :active)) {\n  text-decoration: underline;"), "Expected raw links to expose an underline only while hovered or pressed.");
  assert(css.includes(":where(.bf-theme) :where(a:visited) {\n  color: var(--bf-color-link-visited);"), "Expected generated CSS to style visited links through the semantic theme token.");
  assert(css.includes(":where(.bf-theme) :where(a:focus-visible) {\n  outline: 2px solid var(--bf-color-focus);"), "Expected generated CSS to style raw link focus with the semantic focus token.");
  assert(css.includes(":where(.bf-theme) :where(a.bf-text-link) {\n  display: inline-block;") && css.includes("padding-block: var(--bf-body-nudge-start) 0;"), "Expected standalone text links to expose an element-qualified canonical body metric box without changing raw prose anchors.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(hr, .bf-rule)", {
    "background": "var(--bf-color-rule)",
    "block-size": "1px",
    "border": "0",
    "inline-size": "100%",
    "margin": "0 0 calc(0.5rem - 1px)",
  }, "plain hr and bf-rule share one basic-rule contract");
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
  assert(css.includes("--bf-table-row-padding: var(--bf-body-nudge-start"), "Expected generated CSS to derive symmetric table row padding from the body nudge in nudged tiers.");
  assert(css.includes("--bf-table-row-line-height: calc(var(--bf-table-row-block-size) - (var(--bf-table-row-padding) * 2) - var(--bf-table-row-border-size));"), "Expected table row line-height to be solved from the row block size, symmetric padding, and in-box border.");
  assert(css.includes(":where(.bf-theme) :where(th, td) {\n  border: 0;\n  border-block-end: var(--bf-table-row-border-size) solid transparent;"), "Expected table cells to reserve border space inside the row box instead of relying on inset shadows.");
  assert(css.includes("padding-block: var(--bf-table-row-padding);"), "Expected table cells to use symmetric block padding from the shared table row padding variable.");
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
  assert(css.includes(":where(.bf-theme) :where(.bf-prose ul, .bf-prose ol) {\n  padding-inline-start:"), "Expected prose lists to retain indentation independently of container-owned spacing.");
  assert(!css.includes(".bf-prose li + li"), "Expected list spacing to avoid the old ad hoc inter-item margin.");
  assert(css.includes(":where(.bf-theme) :where(.bf-side-navigation-list) {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  position: relative;"), "Expected side-navigation list groups not to add container-owned block-end spacing.");
  assert(css.includes(":where(.bf-theme) :where(.bf-side-navigation-list)::after {\n  background: var(--bf-color-border-low-contrast);\n  block-size: var(--bf-border-width);"), "Expected side-navigation dividers to stay out of list layout.");
  assert(css.includes("min-block-size: calc(var(--bf-control-box-size-compact) + var(--bf-panel-padding-block));\n  padding-block-end: var(--bf-panel-padding-block);\n  padding-block-start: 0;"), "Expected panel footers to rely on their controls' start nudge instead of adding container start padding.");
  assert(css.includes(":where(.bf-theme) :where(.bf-stack) {\n  --bf-stack-space: var(--bf-section-space-shallow);\n  align-content: start;"), "Expected default stacks to own the tier's shallow pattern gap without stretching occupied tracks.");
  assert(css.includes(":where(.bf-theme) :where(.bf-stack.is-flush) {\n  --bf-stack-space: 0px;"), "Expected flush stacks to remove only their container gap.");
  assert(css.includes(":where(.bf-theme) :where(.bf-stack.is-extra-dense) {\n  --bf-stack-space: var(--bf-space-half);"), "Expected extra-dense stacks to use the half-baseline gap.");
  assert(css.includes(":where(.bf-theme) :where(.bf-stack.is-dense) {\n  --bf-stack-space: var(--bf-space-1);"), "Expected dense stacks to use the one-baseline gap.");
  assert(css.includes(":where(.bf-theme) :where(.bf-stack.is-loose) {\n  --bf-stack-space: var(--bf-space-2);"), "Expected loose stacks to use the two-baseline gap.");
  assert(css.includes(":where(.bf-theme) :where(.bf-stack.is-section-shallow) {\n  --bf-stack-space: var(--bf-section-space-shallow);"), "Expected explicitly shallow section stacks to use the shallow section gap.");
  assert(css.includes(":where(.bf-theme) :where(.bf-stack.is-section) {\n  --bf-stack-space: var(--bf-section-space);"), "Expected section stacks to own the tier's regular section gap.");
  assert(css.includes(":where(.bf-theme) :where(.bf-stack.is-section-deep) {\n  --bf-stack-space: var(--bf-section-space-deep);"), "Expected deep section stacks to use the deep section gap.");
  assert(css.includes("margin: 0 0 calc(0.5rem - 1px);"), "Expected rules to reserve a half-rem rhythm step inclusive of their 1px thickness.");
  assert(css.includes("margin-block-end: calc(0.5rem - var(--bf-bar-thickness));"), "Expected highlighted rules to reserve the same half-rem rhythm step inclusive of their shared thickness.");
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
  assert(css.includes(":where(.bf-theme) :where(.bf-cta-block) {\n  align-items: baseline;\n  column-gap: var(--bf-space-2);\n  display: flex;\n  flex-wrap: wrap;\n  margin-block-end: 0;"), "Expected generated CSS to keep bf-cta-block externally neutral for stack ownership.");
  assert(css.includes(":where(.bf-theme) :where(.bf-cta-block.is-bordered) {\n  border-block-start: var(--bf-border-width) solid var(--bf-color-border-low-contrast);\n  padding-block-start: calc(var(--bf-space-1) - var(--bf-border-width));"), "Expected bf-cta-block.is-bordered to add a top divider with snapped padding.");
  assert(css.includes(":where(.bf-theme) :where(.bf-equal-height-row) {\n  container-type: inline-size;\n  display: grid;\n  gap: var(--bf-grid-gap-block) var(--bf-grid-gap-inline);\n  /* Keep the logical track system on the query container itself."), "Expected generated CSS to define the bf-equal-height-row query container without an invalid self-query.");
  assert(css.includes("grid-template-columns: repeat(8, minmax(0, 1fr));"), "Expected bf-equal-height-row to expose its eight logical tracks at every width.");
  assert(css.includes(":where(.bf-theme) :where(.bf-equal-height-row-col) {\n  border-block-start: var(--bf-border-width) solid var(--bf-color-border-low-contrast);\n  display: grid;\n  grid-column: 1 / -1;\n  grid-row: span 4;\n  grid-template-rows: subgrid;"), "Expected bf-equal-height-row-col to span the narrow row and opt into subgrid alignment.");
  assert(css.includes(":where(.bf-theme) :where(.bf-equal-height-row-col.is-borderless) {\n  border-block-start: 0;\n}"), "Expected bf-equal-height-row-col.is-borderless modifier to drop the top border.");
  assert(css.includes(":where(.bf-theme) :where(.bf-equal-height-row.is-divider-1)::before {\n  grid-row: 2;\n}"), "Expected bf-equal-height-row.is-divider-1 to draw a cross-column rule on subgrid row 2.");
  assert(css.includes(":where(.bf-theme) :where(.bf-equal-height-row.is-divider-2)::after {\n  grid-row: 3;\n}"), "Expected bf-equal-height-row.is-divider-2 to draw a cross-column rule on subgrid row 3.");
  assert(!css.includes("bf-equal-heights") && !css.includes(".equal-heights"), "Expected equal-heights Sites recipe to reuse bf-equal-height-row without a duplicate CSS family.");
  assert(css.includes(":where(.bf-theme) :where(.bf-figure) {\n  display: block;\n  inline-size: 100%;\n  margin: 0;\n}"), "Expected bf-figure to stay externally neutral for its owning stack.");
  assert(css.includes(":where(.bf-theme) :where(.bf-figure) > :where(img, picture, video, canvas, svg) {\n  block-size: auto;\n  display: block;\n  inline-size: 100%;"), "Expected bf-figure to size embedded media to 100% of its container.");
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
  assert(css.includes(":where(.bf-theme) :where(.bf-field.is-range.is-stacked) > :where(.bf-control, .bf-form-help) {\n  grid-column: 1;"), "Expected stacked range controls and help text to return to the explicit first column without creating an implicit narrow track.");
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
    "inline-size": "fit-content",
    "justify-self": "start",
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
  assert(css.includes(":where(.bf-theme) :where(.bf-list) {\n  align-content: start;\n  display: grid;"), "Expected base lists to contain item compensation without stretching occupied tracks.");
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
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-panel-content.is-flush)", {
    "padding-block": "0",
    "padding-inline": "0"
  }, "panel content exposes an explicit flush composition without changing the padded default");
  assert(css.includes(":where(.bf-application-overlay)"), "Expected generated CSS to include application drawer overlay styling.");
  assert(css.includes(":where(.bf-application.is-fill)"), "Expected generated CSS to expose the full-viewport application modifier.");
  assert(css.includes("block-size: 100dvb;\n  max-block-size: 100dvb;\n  min-block-size: 100dvb;"), "Expected the full-viewport application modifier to own a definite dynamic viewport block size.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-navigation.is-collapsed) :where(.bf-side-navigation-label)", {
    "block-size": "1px",
    "clip-path": "inset(50%)",
    "inline-size": "1px",
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
  assert(css.includes('font-size: var(--bf-body-font-size);') && css.includes('line-height: var(--bf-body-line-height);'), "Expected app non-heading UI to consume the tier body role instead of a copied private size.");
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
  assert(layout.gridGapInline === '1.5rem', "Expected the app-tier preset inline grid gap token to stay at the 24px application gutter.");
  assert(layout.pageMargin === '2rem', "Expected the app-tier preset page margin token to follow the 32px application outer margin.");
  assert(layout.contentMaxWidth === '60rem', "Expected the app-tier fixed-width token to use the derived 60rem cap.");
  assert(components.panelPaddingInline === '0.75rem' && components.panelPaddingBlock === '0.75rem', "Expected App panel padding to tighten to three 4px baseline units on both axes.");
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
  assert(roles.h5.letterSpacing === "0.05em", "Expected the documentation h5 role to expose five-percent letter spacing.");
  assert(roles.h6.fontSize === "1.125rem", "Expected the documentation tier h6 role font size to be 1.125rem.");
  assert(fontSizes.size === 4, "Expected the documentation tier to expose distinct heading and body font sizes.");
  assert(layout.contentMaxWidth === "80rem", "Expected the documentation tier content width to use the derived 80rem documentation cap.");
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
  assert(layout.gridGapInline === "1rem", "Expected the OS tier inline grid gap token to provide the x-small 16px gutter.");
  assert(layout.gridGapBlock === "1rem", "Expected the OS tier block grid gap token to provide the x-small 16px gap.");
  assert(layout.pageMargin === "1rem", "Expected the OS tier page margin token to provide the x-small 16px margin.");
  assert(components.radius === "0rem", "Expected the OS tier controls to stay square like PVR/Vanilla.");
  assert(components.controlInlinePadding === "0.5rem", "Expected the OS tier compatibility control padding alias to match the action spacing.");
  assert(components.controlInlinePaddingAction === "0.5rem", "Expected the OS tier action padding to use the dense command target value.");
  assert(components.controlInlinePaddingField === "0.25rem", "Expected the OS tier field padding to stay tighter than action surfaces.");
  assert(components.controlVisualSize === "0.75rem", "Expected the OS tier checkbox/radio/thumb glyphs to use a dedicated 0.75rem visual size.");
  assert(components.fieldGap === "0.25rem", "Expected the OS tier field gap to come from the dense components block.");
  assert(components.panelPaddingInline === "0.5rem", "Expected OS inline panel padding to tighten to two 4px baseline units.");
  assert(components.panelPaddingBlock === "0.5rem", "Expected OS block panel padding to tighten to two 4px baseline units.");
  assert(components.accordionIndent === "0.75rem", "Expected the OS tier accordion indent to come from the dense components block.");
  assert(components.controlBlockPadding === "0.375rem", "Expected the OS tier regular control block padding to preserve the legacy 1.75rem control box height without a dedicated block-size token.");
  assert(components.controlCompactBlockPadding === "0.25rem", "Expected the OS tier compact control block padding to preserve the legacy 1.5rem inline control box height.");

  assert(typeof roles.body.nudgeTop === "string" && css.includes(`--bf-body-nudge-start: ${roles.body.nudgeTop};`), "Expected compact list items to expose the OS tier body nudge.");
  assert(css.includes("padding-block: var(--bf-control-block-padding-compact);"), "Expected compact list items to use the compact control block padding token.");
  assert(css.includes("--bf-control-visual-size: 0.75rem;"), "Expected the OS tier CSS to expose a dedicated visual control size token.");
  assert(css.includes("block-size: var(--bf-control-visual-size);"), "Expected checkbox/radio/thumb visuals to size from the dedicated control visual token.");
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
    "accordion",
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
  const [pageChromeJs, specRuntimeJs, examplePageJs] = await Promise.all([
    readTextArtifact(path.resolve("demo/page-chrome.js")),
    readTextArtifact(path.resolve("demo/spec-runtime.js")),
    readTextArtifact(path.resolve("demo/example-page.js"))
  ]);

  runInvariant("Common CSS (default)", () => validateCommonCss(defaultTheme.css));
  runInvariant("Common CSS (editorial)", () => validateCommonCss(editorialTier.css));
  runInvariant("Common CSS (documentation)", () => validateCommonCss(documentationTier.css));
  runInvariant("Common CSS (OS)", () => validateCommonCss(osTier.css));
  runInvariant("Common CSS (prose preset)", () => validateCommonCss(prosePreset.css));
  for (const [surfaceName, css] of Object.entries({
    default: defaultTheme.css,
    editorial: editorialTier.css,
    documentation: documentationTier.css,
    app: appTier.css,
    os: osTier.css,
    prose: prosePreset.css,
    "app-tier": appTierPreset.css
  })) {
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
  runInvariant("Tier content-cap progression", () => validateTierContentCaps(defaultTheme.css, {
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
