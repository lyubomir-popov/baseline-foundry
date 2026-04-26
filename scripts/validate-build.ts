import fs from "node:fs/promises";
import path from "node:path";
import { BASELINE_GRID_DARK_THEME_COLOR, BASELINE_GRID_DEFAULT_COLOR, BASELINE_GRID_LIGHT_THEME_COLOR } from "../src/baseline-grid-theme.js";

let checkCount = 0;

function assert(condition: unknown, message: string): asserts condition {
  checkCount++;
  if (!condition) {
    throw new Error(message);
  }
}

function runInvariant(name: string, fn: () => void): void {
  const before = checkCount;
  fn();
  const ran = checkCount - before;
  console.log(`  \u2713 ${name}: ${ran} checks`);
}

async function runInvariantAsync(name: string, fn: () => Promise<void>): Promise<void> {
  const before = checkCount;
  await fn();
  const ran = checkCount - before;
  console.log(`  \u2713 ${name}: ${ran} checks`);
}

async function assertExists(filePath: string): Promise<void> {
  await fs.access(filePath);
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
  const expectedOsTierExports = {
    "./tiers/os.css": "./dist/tiers/os/styles.css",
    "./tiers/os.tokens.json": "./dist/tiers/os/tokens.json",
    "./tiers/os.surfaces.json": "./dist/tiers/os/surfaces.json"
  } as const;

  for (const [exportKey, exportPath] of Object.entries(expectedOsTierExports)) {
    assert(exportsField[exportKey] === exportPath, `Expected package.json to export ${exportKey} from ${exportPath}.`);
  }
}

function escapeForRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

async function validatePanelBaselineArtifacts(): Promise<void> {
  const panelBaselineDir = path.resolve("generated/baseline/panel");
  await assertExists(panelBaselineDir);

  const panelBaselineEntries = await fs.readdir(panelBaselineDir);
  assert(panelBaselineEntries.includes("os.baseline.json"), "Expected generated/baseline/panel to emit the OS baseline config.");
  assert(!panelBaselineEntries.includes("panel.baseline.json"), "Expected generated/baseline/panel to drop the stale legacy panel baseline config.");
  assert(!panelBaselineEntries.includes("foundation-theme.baseline.json"), "Expected generated/baseline/panel to drop the stale legacy foundation baseline config.");

  const osBaseline = await readTextArtifact(path.join(panelBaselineDir, "os.baseline.json"));
  assert(!osBaseline.includes('"ui-'), "Expected the regenerated panel baseline alias output to avoid legacy ui-* identifiers.");
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
  assert(componentDemoJs.includes('function cacheBust(url) {'), "Expected component-demo.js to define a cache-busting helper for tier stylesheet reloads.");
  assert(componentDemoJs.includes('return cacheBust("/dist/tiers/editorial/styles.css");'), "Expected component-demo.js to cache-bust the shared tier stylesheet so rebuilt tier tokens refresh in long-lived demo sessions.");
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
  assert(css.includes("@font-face"), "Expected generated CSS to include runtime font-face rules.");
  assert(css.includes("font-family: \"Ubuntu Sans\";"), "Expected generated CSS to register the Ubuntu Sans family.");
  assert(css.includes("UbuntuSans[wdth,wght].ttf"), "Expected generated CSS to point to the Ubuntu Sans variable font.");
  assert(/font-weight:\s*100\s+\d+;/.test(css), "Expected generated CSS to expose a variable-weight Ubuntu Sans range.");
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
  assert(css.includes("--bf-color-rule: var(--vf-color-border-low-contrast, rgba(0, 0, 0, 0.1));"), "Expected generated CSS to map Foundry separators to Vanilla's low-contrast border token.");
  assert(css.includes("--bf-color-accent: var(--vf-color-accent, #0f95a1);"), "Expected generated CSS to expose Foundry accent from Vanilla's semantic accent token.");
  assert(!css.includes("--bf-color-accent: var(--bf-color-link);"), "Expected generated CSS to avoid collapsing the accent token back onto the link token.");
  assert(css.includes(":where(.bf-theme) :where(a:visited) {\n  color: var(--bf-color-link-visited);"), "Expected generated CSS to style visited links through the semantic theme token.");
  assert(css.includes(":where(.bf-theme) :where(a:focus-visible) {\n  outline: 2px solid var(--bf-color-focus);"), "Expected generated CSS to style raw link focus with the semantic focus token.");
  assert(!css.includes("#f5f1e8"), "Expected generated CSS to avoid the old paper-like default background fallback.");
  assert(!css.includes("#0f62fe"), "Expected generated CSS to avoid the old non-Vanilla light link fallback.");
  assert(css.includes(`--bf-baseline-grid-color: ${BASELINE_GRID_DEFAULT_COLOR};`), "Expected baseline-grid overlays to declare a default line color.");
  assert(css.includes(`:where(.bf-theme).u-baseline-grid,\n:where(.bf-theme) .u-baseline-grid {\n  --bf-baseline-grid-color: ${BASELINE_GRID_LIGHT_THEME_COLOR};`), "Expected light themes to provide a subtle baseline-grid line color, even when the grid class is on the theme root.");

  if (css.includes(":where(.bf-theme.bf-tier-app) {")) {
    assert(css.includes(":where(.bf-theme.bf-tier-app) :where(.bf-section),\n:where(.bf-theme.bf-tier-app) :where(.bf-section.is-shallow),\n:where(.bf-theme.bf-tier-app) :where(.bf-section.is-deep) {\n  margin-block-end: 0;"), "Expected shared built-in stylesheets to include the app-tier section margin reset.");
    assert(css.includes(":where(.bf-theme.bf-tier-app) :where(.bf-stage-shell > *) {\n  margin-bottom: 0;\n  min-inline-size: 0;\n  padding-block: 0;"), "Expected shared built-in stylesheets to include the app-tier stage-shell child reset.");
    assert(css.includes(":where(.bf-theme.bf-tier-app) :where(.bf-stack) > * {\n  margin-bottom: 0;\n  padding-block: 0;"), "Expected shared built-in stylesheets to include the app-tier stack child reset.");
    assert(css.includes(":where(.bf-theme.bf-tier-app) :where(.bf-cluster) > * {\n  margin-bottom: 0;\n  padding-block: 0;"), "Expected shared built-in stylesheets to include the app-tier cluster child reset.");
    assert(css.includes(":where(.bf-theme.bf-tier-app) :where(.bf-prose > *) {\n  margin-bottom: 0;\n  padding-block: 0;"), "Expected shared built-in stylesheets to include the app-tier prose child reset.");
    assert(css.includes(":where(.bf-theme.bf-tier-app) :where(.bf-stack) {\n  --bf-stack-space: var(--bf-space-2);"), "Expected app-tier stylesheets to keep stack-owned vertical gap as the application default.");
    assert(css.includes(":where(.bf-theme.bf-tier-app) :where(.bf-stack.is-section) {\n  --bf-stack-space: var(--bf-section-space);"), "Expected app-tier stylesheets to keep the application section stack gap override.");
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
  assert(css.includes("--bf-body-nudge-start: 0rem;\n  --bf-body-nudge-end: 0rem;"), "Expected app-tier runtime overrides to zero body nudges.");
  assert(css.includes("--bf-body-nudge-start:") && css.includes("--bf-body-nudge-end:"), "Expected generated CSS to define body alignment nudge variables.");
  assert(css.includes("--bf-h6-nudge-start:") && css.includes("--bf-h6-nudge-end:"), "Expected generated CSS to define h6 alignment nudge variables.");
  assert(css.includes(":where(.bf-theme) :where(.bf-prose > :last-child) {\n  margin-bottom: 0;"), "Expected prose flow boundaries to trim semantic trailing space now that baseline compensation lives inside the element box.");
  assert(css.includes(".bf-prose li"), "Expected CSS to include list item selectors.");
  assert(css.includes(":where(.bf-theme) :where(.bf-prose li) {\n  margin: 0;\n  padding-block-end:"), "Expected list items to use literal baseline compensation.");
  assert(css.includes(":where(.bf-theme) :where(.bf-prose ul, .bf-prose ol) {\n  margin-bottom:"), "Expected list containers to use literal semantic spacing.");
  assert(!css.includes(".bf-prose li + li"), "Expected list spacing to avoid the old ad hoc inter-item margin.");
  assert(!css.includes(":where(.bf-theme) :where(.bf-stack.is-extra-dense) {\n  --bf-stack-space: var(--bf-space-half);"), "Expected non-app stack density modifiers to stay gapless so semantic spacing remains element-owned outside app tier.");
  assert(!css.includes(":where(.bf-theme) :where(.bf-stack.is-dense) {\n  --bf-stack-space: var(--bf-space-1);"), "Expected non-app dense stacks to stay gapless so editorial and documentation surfaces remain element-owned.");
  assert(!css.includes(":where(.bf-theme) :where(.bf-stack.is-loose) {\n  --bf-stack-space: var(--bf-space-2);"), "Expected non-app loose stacks to stay gapless so stack density remains app-owned.");
  assert(!css.includes(":where(.bf-theme) :where(.bf-stack.is-section-shallow) {\n  --bf-stack-space: var(--bf-section-space-shallow);"), "Expected non-app section-shallow stacks to stay gapless so section rhythm remains element-owned outside app tier.");
  assert(!css.includes(":where(.bf-theme) :where(.bf-stack.is-section) {\n  --bf-stack-space: var(--bf-section-space);"), "Expected non-app section stacks to stay gapless so section rhythm remains element-owned outside app tier.");
  assert(!css.includes(":where(.bf-theme) :where(.bf-stack.is-section-deep) {\n  --bf-stack-space: var(--bf-section-space-deep);"), "Expected non-app deep section stacks to stay gapless so stack gap ownership does not leak out of app tier.");
  assert(css.includes("margin: 0 0 calc(var(--bf-space-3) - 1px);"), "Expected rules to compensate their 1px thickness against the baseline rhythm.");
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
  assert(css.includes("--bf-tick-label-offset: calc(var(--bf-control-visual-size) + var(--bf-control-inline-padding));"), "Expected generated CSS to derive tick label spacing from the control inline padding token.");
  assert(css.includes("min-block-size: var(--bf-tick-row-block-size);"), "Expected checkbox and radio rows to use the shared tick-row block-size variable.");
  assert(css.includes("--bf-control-block-padding:"), "Expected generated CSS to define the regular control block padding token.");
  assert(css.includes("--bf-control-block-padding-compact:"), "Expected generated CSS to define the compact control block padding token.");
  assert(css.includes("--bf-input-block-padding:"), "Expected generated CSS to define the tier-selectable input block padding token.");
  assert(css.includes("--bf-button-block-padding:"), "Expected generated CSS to define the tier-selectable button block padding token.");
  assert(css.includes("--bf-control-box-size: calc(var(--bf-body-line-height) + (var(--bf-control-block-padding) * 2));"), "Expected generated CSS to derive regular control box size from the control block padding token.");
  assert(css.includes("padding-block: max(0rem, calc(var(--bf-input-block-padding) - var(--bf-border-width)));"), "Expected bordered inputs to resolve block padding from the tier-selectable input padding token.");
  assert(css.includes("padding-block: max(0rem, calc(var(--bf-button-block-padding) - var(--bf-border-width)));"), "Expected bordered buttons to resolve block padding from the tier-selectable button padding token.");
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
  assert(css.includes(":where(.bf-card, .bf-card.is-highlighted, .bf-card.is-overlay, .bf-card.is-muted)"), "Expected generated CSS to include card surfaces.");
  assert(css.includes(":where(.bf-theme) :where(a.bf-card, a.bf-card.is-highlighted, a.bf-card.is-overlay, a.bf-card.is-muted) {"), "Expected generated CSS to let cards act as linked surfaces.");
  assert(css.includes(":where(.bf-theme) :where(.bf-card-preview) {"), "Expected generated CSS to include the card preview slot used by the component atlas.");
  assert(css.includes(":where(.bf-theme) :where(.bf-card-preview-image) {"), "Expected generated CSS to include the card preview image slot used by the component atlas.");
  assert(css.includes(":where(.bf-segmented-control-button, .bf-tab-buttons-button)"), "Expected generated CSS to include segmented control buttons.");
  assert(css.includes(":where(.bf-breadcrumbs-items)"), "Expected generated CSS to include breadcrumb styling.");
  assert(css.includes(":where(.bf-pagination-items)"), "Expected generated CSS to include pagination styling.");
  assert(css.includes(":where(table, .bf-table)"), "Expected generated CSS to include table styling.");
    assert(css.includes(":where(.bf-theme) :where(th.is-icon-placeholder, td.is-icon-placeholder, .bf-table-cell.is-icon-placeholder) {"), "Expected generated CSS to include the table icon-placeholder cell styling.");
  assert(css.includes(":where(.bf-chip, .bf-chip.is-positive, .bf-chip.is-caution, .bf-chip.is-negative, .bf-chip.is-information)"), "Expected generated CSS to include chip styling.");
  assert(css.includes("--bf-ui-chip-border: var(--bf-color-border-neutral);"), "Expected generated CSS to style neutral chips with the Vanilla neutral border token.");
  assert(css.includes("--bf-ui-chip-background: var(--bf-color-background-neutral-default);"), "Expected generated CSS to style neutral chips with the Vanilla neutral background token.");
  assert(!css.includes("--bf-ui-chip-border: var(--bf-color-border-default);"), "Expected generated CSS to avoid using the generic default border token for neutral chips.");
  assert(!css.includes("--bf-ui-chip-background: var(--bf-color-background-hover);"), "Expected generated CSS to avoid using the generic hover background token for neutral chips.");
  assert(css.includes(":where(.bf-badge, .bf-badge.is-negative)"), "Expected generated CSS to include badge styling.");
  assert(css.includes(":where(.bf-status-label, .bf-status-label.is-positive, .bf-status-label.is-caution, .bf-status-label.is-information, .bf-status-label.is-negative)"), "Expected generated CSS to include status label styling.");
  assert(css.includes("--bf-ui-badge-padding-inline: calc(var(--bf-body-line-height"), "Expected badge geometry to scale from the active body line-height rather than an h5 fallback.");
  assert(css.includes("min-width: calc(var(--bf-body-line-height"), "Expected badge minimum width to scale from the active body line-height.");
  assertSelectorUsesBodyTypography(css, ":where(.bf-theme) :where(.bf-chip-lead + .bf-chip-value)::before", "chip value separators");
  assertSelectorUsesBodyTypography(css, ":where(.bf-theme) :where(.bf-badge, .bf-badge.is-negative)", "badges");
  assertSelectorUsesBodyTypography(css, ":where(.bf-theme) :where(.bf-status-label, .bf-status-label.is-positive, .bf-status-label.is-caution, .bf-status-label.is-information, .bf-status-label.is-negative)", "status labels");
  assert(!css.includes(".bf-label"), "Expected generated CSS to omit the deprecated bf-label alias.");
  assert(css.includes(":where(.bf-modal.is-workflow)"), "Expected generated CSS to include the workflow modal variant.");
  assert(css.includes(":where(.bf-modal.is-workflow.is-resizable)"), "Expected generated CSS to include the resizable workflow modal modifier.");
  assert(css.includes("grid-template-rows: auto minmax(0, 1fr) auto;"), "Expected generated CSS to support the workflow modal fixed-header scrolling-body layout.");
  assert(css.includes(":where(.bf-theme) :where(.bf-panel.is-fill) {\n  block-size: 100%;"), "Expected generated CSS to make fill-height panels resolve against the shell height instead of an unbounded minimum block size.");
  assert(css.includes(":where(.bf-theme) :where(.bf-panel.is-fill) > :where(.bf-panel-content) {\n  min-block-size: 0;\n  overflow: auto;\n  overscroll-behavior: contain;"), "Expected generated CSS to make fill-height panel bodies scroll internally.");
  assert(css.includes(":where(.bf-search-box)"), "Expected generated CSS to include search-box styling.");
  assert(css.includes(":where(.bf-search-and-filter)"), "Expected generated CSS to include search-and-filter styling.");
  assert(css.includes(":where(.bf-search-and-filter-box) {\n  display: inline-flex;\n  flex: 1 1 12rem;\n  max-inline-size: 100%;\n  min-inline-size: 0;"), "Expected search-and-filter boxes to shrink inside narrow rails.");
  assert(css.includes(":where(.bf-code-snippet)"), "Expected generated CSS to include code-snippet styling.");
  assert(css.includes(":where(.bf-code-snippet-block.is-icon) {\n  cursor: copy;"), "Expected generated CSS to include copyable code-snippet blocks.");
  assert(css.includes(":where(.bf-theme) :where(.bf-top-navigation-dropdown) {"), "Expected generated CSS to include the top-navigation dropdown container styling.");
  assert(css.includes(":where(.bf-theme) :where(.bf-top-navigation-dropdown-toggle)::after {"), "Expected generated CSS to include the top-navigation dropdown chevron styling.");
  assert(css.includes(":where(.bf-theme) :where(button.bf-top-navigation-dropdown-item) {"), "Expected generated CSS to include the top-navigation action-button dropdown item styling.");
  assert(css.includes(":where(.bf-theme) :where(.bf-top-navigation-dropdown-item-label) {"), "Expected generated CSS to include the top-navigation dropdown item label slot styling.");
  assert(css.includes(":where(.bf-theme) :where(.bf-top-navigation-dropdown-item-shortcut) {"), "Expected generated CSS to include the top-navigation dropdown item shortcut slot styling.");
  assert(css.includes(":where(.bf-theme) :where(.bf-top-navigation-dropdown > li.is-divider) {"), "Expected generated CSS to include the top-navigation dropdown divider styling.");
  assert(css.includes("transform: rotate(0deg);\n  transition: transform 160ms ease;"), "Expected closed top-navigation chevrons to point downward before expansion.");
  assert(css.includes(":where(.bf-theme) :where(.bf-top-navigation-item.is-dropdown-toggle.is-active) > :where(.bf-top-navigation-dropdown-toggle)::after {\n  transform: rotate(180deg);\n}"), "Expected active top-navigation chevrons to rotate upward after expansion.");
  assert(css.includes(":where(.bf-theme) :where(.bf-top-navigation-item.is-dropdown-toggle.is-active) > :where(.bf-top-navigation-dropdown) {"), "Expected generated CSS to include the active top-navigation dropdown reveal styling.");
  assert(css.includes(":where(.bf-theme) :where(.bf-icon) {"), "Expected generated CSS to include the base icon styling.");
    assert(css.includes(":where(.bf-theme) :where(.bf-icon.is-success-grey) {"), "Expected generated CSS to include the success-grey icon modifier.");
    assert(css.includes(":where(.bf-theme) :where(.bf-icon.is-error-grey) {"), "Expected generated CSS to include the error-grey icon modifier.");
  assert(css.includes(":where(.bf-theme) :where(.bf-icon.is-search) {"), "Expected generated CSS to include named icon modifiers.");
  assert(css.includes(":where(.bf-theme) :where(.bf-list)"), "Expected generated CSS to include the base list styling.");
    assert(css.includes(":where(.bf-theme) :where(.bf-list-item.is-ticked, .bf-list-item.is-crossed) {"), "Expected generated CSS to include ticked and crossed list-item styling.");
  assert(css.includes(":where(.bf-theme) :where(.bf-inline-list)"), "Expected generated CSS to include the inline-list styling.");
  assert(css.includes(":where(.bf-theme) :where(.bf-skip-link)"), "Expected generated CSS to include the skip-link styling.");
  assert(css.includes(":where(.bf-list-tree)"), "Expected generated CSS to include list-tree styling.");
  assert(css.includes(":where(.bf-tabs.is-equal)"), "Expected generated CSS to include equal-width dense tab modifiers.");
  assert(css.includes(":where(.bf-choice-row)"), "Expected generated CSS to include the canonical choice-row component.");
  assert(css.includes(":where(.bf-inline-options)"), "Expected generated CSS to include the canonical inline-options component.");
  assert(css.includes(":where(.bf-option-grid)"), "Expected generated CSS to include the canonical option-grid component.");
  assert(css.includes(":where(.bf-option-card)"), "Expected generated CSS to include the canonical option-card component.");
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
  assert(css.includes(":where(.bf-tooltip, [class*='bf-tooltip--'])"), "Expected generated CSS to include tooltip styling.");
  assert(css.includes(":where(.bf-panel-toggle)"), "Expected generated CSS to include panel toggle styling.");
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
  assert(components.controlBlockPadding, "Expected generated tokens to include regular control block padding.");
  assert(components.controlCompactBlockPadding, "Expected generated tokens to include compact control block padding.");
  assert(components.controlInlinePadding, "Expected generated tokens to include component padding.");
  assert(components.controlVisualSize, "Expected generated tokens to include component visual size.");
  assert(!("controlMinBlockSize" in components), "Expected generated tokens to stop exposing legacy control height tokens.");
  assert(!("controlMinBlockSizeDense" in components), "Expected generated tokens to stop exposing legacy dense control height tokens.");

  return { roles, layout, components, fontFiles };
}

function validateAppTierCss(css: string): void {
  assert(css.includes('font-family: "Ubuntu Sans";'), "Expected the app-tier preset CSS to register the Ubuntu Sans family.");
  assert(css.includes('UbuntuSans[wdth,wght].ttf'), "Expected the app-tier preset CSS to point to the Ubuntu Sans variable font.");
  assert(css.includes('font-weight: 100 900;'), "Expected the app-tier preset CSS to expose the Ubuntu Sans variable weight range.");
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
  assert(roles.body.fontFamily === 'ubuntu-sans', "Expected the app-tier preset body role to use Ubuntu Sans.");
  assert(roles.body.fontSize === '0.875rem', "Expected the app-tier preset body role font size to be 0.875rem.");
  assert(roles.body.lineHeight === '1.25rem', "Expected the app-tier preset body role line height to be 1.25rem.");

  assert(roles.h1.fontSize === '1.5rem', "Expected the app-tier preset h1 role font size to be 1.5rem.");
  assert(roles.h2.fontWeight === 300, "Expected the app-tier preset h2 to use the lighter Ubuntu Sans pairing.");
  assert(layout.gridGapInline === '1.5rem', "Expected the app-tier preset inline grid gap token to stay at the 24px application gutter.");
  assert(layout.pageMargin === '2rem', "Expected the app-tier preset page margin token to follow the 32px application outer margin.");
  assert(components.controlBlockPadding === '0.5rem', "Expected the app-tier preset regular control block padding to preserve the 2.25rem control box height without a dedicated block-size token.");
  assert(components.controlCompactBlockPadding === '0.375rem', "Expected the app-tier preset compact control block padding to preserve the legacy 2rem inline control box height.");
  assert(components.controlInlinePadding === '1rem', "Expected the app-tier preset control padding to come from the app-tier components block.");
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
  assert(css.includes('IBMPlexSansVar-Roman.woff2'), "Expected the IBM Plex smoke CSS to point to the IBM Plex Sans variable font asset.");
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
  assert(appRoles.body?.nudgeTop === "0rem", "Expected the app surface runtime tokens to stay zero-nudge.");
  assert(appMetricElements.body?.nudgeTop && appMetricElements.body.nudgeTop !== "0rem", "Expected the app surface metrics to retain the computed font-derived nudge data.");
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
  assert(components.controlInlinePadding === "0.875rem", "Expected the documentation tier control padding to tighten slightly.");
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
  assert(html.includes('class="bf-controls-group bf-stack"'), "Expected demo/controls.html to group controls with plain layout primitives instead of bf-panel wrappers.");
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
  assert(!css.includes(".bf-eyebrow"), "Expected CSS to avoid generating an implicit eyebrow alias when no eyebrow role is configured.");
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
  assert(roles.body.fontStack === '"Ubuntu Sans", "IBM Plex Sans", system-ui, sans-serif', "Expected the OS tier body font stack to keep the IBM Plex Sans fallback.");
  assert(ubuntuFontFile.fontWeight === "100 600", "Expected the OS tier to expose the reduced Ubuntu Sans variable weight range.");
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
  assert(components.controlInlinePadding === "0.75rem", "Expected the OS tier control padding to come from the dense components block.");
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
  assert(!engineSmokeHtml.includes("bf-tier-app"), "Expected engine-smoke.html to stay off the app tier now that app UI follows the zero-nudge spacing contract.");
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

function validateBfOnlyDemoFamily(demoPages: Record<string, string>): void {
  validateBfOnlyDemoPage("tabs.html", demoPages.tabs);
  validateBfOnlyDemoPage("panel-tabs.html", demoPages.panelTabs);
  validateBfOnlyDemoPage("accordion.html", demoPages.accordion);
  validateBfOnlyDemoPage("contextual-menu.html", demoPages.contextualMenu);
  validateBfOnlyDemoPage("tooltip.html", demoPages.tooltip);
  validateBfOnlyDemoPage("icon.html", demoPages.icon);
  validateBfOnlyDemoPage("list.html", demoPages.list);
  validateBfOnlyDemoPage("inline-list.html", demoPages.inlineList);
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
  assert(specimenHtml.includes('<a href="../panel.html">OS addendum</a>'), "Expected typographic-specimen.html to link the OS addendum from the local spec nav.");
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
  assert(pageCatalogJs.includes('{ title: "OS tier addendum", href: "/demo/panel.html" }'), "Expected the page catalog to register the OS addendum page.");
  assert(panelHtml.includes('<title>Baseline Foundry OS Tier</title>'), "Expected demo/panel.html to present the OS tier addendum title.");
  assert(panelHtml.includes('../dist/tiers/editorial/styles.css'), "Expected demo/panel.html to bootstrap from the shared built-in tier stylesheet.");
  assert(!panelHtml.includes('dist/presets/panel/styles.css'), "Expected demo/panel.html to stop bootstrapping from the legacy panel preset bundle.");
  assert(panelHtml.includes('<body class="bf-theme bf-tier-os" data-page-tier-options="editorial,documentation,app,os" data-page-tier-default="os" data-page-baseline-default="on">'), "Expected demo/panel.html to boot as the OS tier addendum under the shared header contract.");
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
  const defaultTheme = await readThemeArtifacts(path.resolve("dist"));
  const editorialTier = await readThemeArtifacts(path.resolve("dist/tiers/editorial"));
  const documentationTier = await readThemeArtifacts(path.resolve("dist/tiers/documentation"));
  const appTier = await readThemeArtifacts(path.resolve("dist/tiers/app"));
  const osTier = await readThemeArtifacts(path.resolve("dist/tiers/os"));
  const prosePreset = await readThemeArtifacts(path.resolve("dist/presets/prose"));
  const panelPreset = await readThemeArtifacts(path.resolve("dist/presets/panel"));
  const appTierPreset = await readThemeArtifacts(path.resolve("dist/presets/app-tier"));
  const ibmPlexEngineSmoke = await readThemeArtifacts(path.resolve("dist/experiments/ibm-plex-engine-smoke"));
  const [engineSmokeHtml, engineIllustrationHtml, formAtlasHtml, rangeHtml, componentAtlasJs, componentDemoJs, componentShellCss, specShellCss, pageChromeCss, pageCatalogJs, controlsShellCss, applicationShellHtml, applicationLayoutHtml, tabsHtml, panelTabsHtml, accordionHtml, sideNavigationHtml, topNavigationHtml, contextualMenuHtml, tooltipHtml, iconHtml, listHtml, inlineListHtml, tableHtml, listTreeHtml, codeSnippetHtml, skipLinkHtml, demoIndexHtml, componentAtlasHtml, demoControlsHtml, typographicSpecimenHtml, gridSpecHtml, panelHtml] = await Promise.all([
    readTextArtifact(path.resolve("demo/components/engine-smoke.html")),
    readTextArtifact(path.resolve("demo/components/engine-illustration.html")),
    readTextArtifact(path.resolve("demo/components/form-atlas.html")),
    readTextArtifact(path.resolve("demo/components/range.html")),
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
    readTextArtifact(path.resolve("demo/components/table.html")),
    readTextArtifact(path.resolve("demo/components/list-tree.html")),
    readTextArtifact(path.resolve("demo/components/code-snippet.html")),
    readTextArtifact(path.resolve("demo/components/skip-link.html")),
    readTextArtifact(path.resolve("index.html")),
    readTextArtifact(path.resolve("demo/components/index.html")),
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
  runInvariant("Common CSS (panel preset)", () => validateCommonCss(panelPreset.css));
  runInvariant("App tier CSS (app)", () => validateAppTierCss(appTier.css));
  runInvariant("App tier CSS (app preset)", () => validateAppTierCss(appTierPreset.css));
  runInvariant("Default theme (default)", () => validateDefaultTheme(defaultTheme.tokens, defaultTheme.css));
  runInvariant("Default theme (editorial)", () => validateDefaultTheme(editorialTier.tokens, editorialTier.css));
  runInvariant("Documentation theme", () => validateDocumentationTheme(documentationTier.tokens, documentationTier.css));
  runInvariant("App tier theme (app)", () => validateAppTierTheme(appTier.tokens, appTier.css));
  runInvariant("OS tier theme", () => validateOsTheme(osTier.tokens, osTier.css));
  runInvariant("Default theme (prose preset)", () => validateDefaultTheme(prosePreset.tokens, prosePreset.css));
  runInvariant("OS tier theme (panel preset alias)", () => validateOsTheme(panelPreset.tokens, panelPreset.css));
  runInvariant("App tier theme (app preset)", () => validateAppTierTheme(appTierPreset.tokens, appTierPreset.css));
  runInvariant("IBM Plex engine smoke theme", () => validateIbmPlexEngineSmokeTheme(ibmPlexEngineSmoke.tokens, ibmPlexEngineSmoke.css));
  runInvariant("Surface manifest (default)", () => validateSurfaceManifest(defaultTheme.surfaces, "editorial"));
  runInvariant("Surface manifest (editorial)", () => validateSurfaceManifest(editorialTier.surfaces, "editorial"));
  runInvariant("Surface manifest (documentation)", () => validateSurfaceManifest(documentationTier.surfaces, "documentation"));
  runInvariant("Surface manifest (app)", () => validateSurfaceManifest(appTier.surfaces, "app"));
  runInvariant("Surface manifest (OS)", () => validateSurfaceManifest(osTier.surfaces, "os"));
  runInvariant("Surface manifest (prose preset)", () => validateSurfaceManifest(prosePreset.surfaces, "editorial"));
  runInvariant("Surface manifest (panel preset alias)", () => validateSurfaceManifest(panelPreset.surfaces, "os"));
  runInvariant("Surface manifest (app preset)", () => validateSurfaceManifest(appTierPreset.surfaces, "app"));
  runInvariant("Custom surface manifest (IBM Plex)", () => validateCustomSurfaceManifest(ibmPlexEngineSmoke.surfaces, "ibm-plex-engine-smoke"));
  runInvariant("Published package exports", () => validatePackageExports(packageJson));
  runInvariant("Theme config watcher", () => validateThemeConfigWatcher(viteConfigTs));
  await runInvariantAsync("Panel baseline cleanup", () => validatePanelBaselineArtifacts());
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
  runInvariant("Component atlas page", () => validateComponentAtlasPage(componentAtlasHtml, componentAtlasJs));
  runInvariant("Form atlas page", () => validateFormAtlasPage(formAtlasHtml, componentAtlasHtml, componentShellCss));
  runInvariant("Living spec home", () => validateLivingSpecHome(demoIndexHtml));
  runInvariant("Living spec controls", () => validateLivingSpecControls(demoControlsHtml, controlsShellCss));
  runInvariant("Application shell demo", () => validateApplicationShellDemo(applicationShellHtml));
  runInvariant("App tier demo (application-layout)", () => validateAppTierDemoPage("application-layout.html", applicationLayoutHtml));
  runInvariant("App tier demo (side-navigation)", () => validateAppTierDemoPage("side-navigation.html", sideNavigationHtml));
  runInvariant("Parity surface demos", () => validateParitySurfaceDemos(iconHtml, listHtml, tableHtml));
  runInvariant("Top navigation demo", () => validateTopNavigationDemo(topNavigationHtml));
  runInvariant("Typographic specimen", () => validateTypographicSpecimen(pageCatalogJs, typographicSpecimenHtml));
  runInvariant("Grid spec page", () => validateGridSpecPage(gridSpecHtml, specShellCss));
  runInvariant("OS addendum page", () => validateOsTierPage(pageCatalogJs, panelHtml));
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
    table: tableHtml,
    listTree: listTreeHtml,
    codeSnippet: codeSnippetHtml,
    skipLink: skipLinkHtml
  }));

  console.log(`\nBuild validation passed: ${checkCount} total checks.`);
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
