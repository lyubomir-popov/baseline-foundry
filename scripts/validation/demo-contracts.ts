import { assert } from "../validation-assert.ts";
import { assertNoDuplicateClassAttributes } from "./html-contract-helpers.ts";

function validateBfOnlyDemoPage(pageName: string, html: string): void {
  assertNoDuplicateClassAttributes(`demo/components/${pageName}`, html);
  assert(html.includes('<body class="bf-theme is-dark"'), `Expected ${pageName} to dogfood the bf-theme root.`);
  assert(html.includes("data-component-capture"), `Expected ${pageName} to expose a data-component-capture root for screenshot and baseline tooling.`);
  assert(!/class="[^"]*\bhas-[a-z][a-z0-9_-]*\b/.test(html), `Expected ${pageName} to avoid deprecated has-* helper classes and stay fully bf-* / is-* dogfooded.`);
  assert(!/\bp-[a-z][a-z0-9_-]*/.test(html), `Expected ${pageName} to avoid deprecated p-* markup and stay fully bf-* dogfooded.`);
  assert(!/\bvr-[a-z][a-z0-9_-]*/.test(html), `Expected ${pageName} to avoid deprecated vr-* markup and stay fully bf-* dogfooded.`);
}

export function validateAppTierDemoPage(pageName: string, html: string): void {
  assertNoDuplicateClassAttributes(`demo/components/${pageName}`, html);
  assert(html.includes('../../dist/tiers/editorial/styles.css'), `Expected ${pageName} to bootstrap from the shared tier stylesheet instead of a preset-specific bundle.`);
  assert(html.includes('<body class="bf-theme bf-tier-app is-light"'), `Expected ${pageName} to dogfood the bf-theme + bf-tier-app root.`);
  assert(html.includes("data-component-capture"), `Expected ${pageName} to expose a data-component-capture root for screenshot and baseline tooling.`);
  assert(!html.includes('is-dark'), `Expected ${pageName} to avoid the dark demo tone now that it is an app-tier parity surface.`);
  assert(!/class="[^"]*\bhas-[a-z][a-z0-9_-]*\b/.test(html), `Expected ${pageName} to avoid deprecated has-* helper classes and stay fully bf-* / is-* dogfooded.`);
  assert(!/\bp-[a-z][a-z0-9_-]*/.test(html), `Expected ${pageName} to avoid deprecated p-* markup and stay fully bf-* dogfooded.`);
  assert(!/\bvr-[a-z][a-z0-9_-]*/.test(html), `Expected ${pageName} to avoid deprecated vr-* markup and stay fully bf-* dogfooded.`);
  if (pageName === "application-layout.html") {
    assert(html.includes('class="bf-navigation-bar is-responsive"'), "Expected application-layout.html to exercise the responsive branded navigation-bar contract.");
    assert(html.includes('class="bf-panel-header is-sticky is-navigation-brand"'), "Expected application-layout.html to dogfood the flush navigation-brand panel header.");
    assert((html.match(/class="bf-top-navigation-logo is-canonical-tagged"/g) ?? []).length === 2, "Expected application-layout.html to share the Canonical tagged-logo contract between its responsive bar and drawer.");
    assert(html.includes('viewBox="0 0 60.45 57.87"'), "Expected the application drawer brand to use the proportionate Circle of Friends source shape.");
    assert(html.includes("bf-panel-footer is-sticky") && html.includes("data-application-layout-main-footer") && html.includes("data-application-layout-navigation-footer"), "Expected application-layout.html to exercise aligned persistent panel footers in navigation and main panels.");
    assert((html.match(/is-control-pair bf-stack is-flush/g) ?? []).length === 5, "Expected application-layout.html control pairs to contain metric compensation with the generic flush stack.");
  }
}

export function validateLivingSpecHome(html: string): void {
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

export function validateLivingSpecControls(html: string, css: string): void {
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

export function validateDemoContracts(engineSmokeHtml: string, componentShellCss: string, specShellCss: string, pageChromeCss: string, pageChromeJs: string, componentDemoJs: string, specRuntimeJs: string, examplePageJs: string): void {
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
  assert(pageChromeCss.includes(".pc-content.bf-page") && pageChromeCss.includes(":where(.bf-page, .bf-fixed-width)"), "Expected shared page chrome to own one bf-page gutter and suppress nested duplicate gutters.");
  assert(pageChromeCss.includes(".pc-sequence") && !pageChromeCss.includes("a.pc-sequence-link") && !pageChromeCss.includes("filter: invert"), "Expected shared page chrome to leave adjacent-page button paint and icon color to the public BF button/icon contract.");
  assert(pageChromeCss.includes(".pc-footer") && pageChromeCss.includes("position: fixed;") && pageChromeCss.includes("--pc-footer-block-size"), "Expected the display controls to live in a fixed bottom bar whose measured height is reserved by the document.");
  assert(!/\.pc-(?:section|title)\s*\{[\s\S]*?font-size:/.test(pageChromeCss), "Expected page chrome to avoid a private sub-body type scale.");
  assert(pageChromeJs.includes('contentWrapper.classList.add("pc-content", "bf-page")'), "Expected every wrapped page-chrome route to compose the public bf-page primitive.");
  assert(pageChromeJs.includes('class="bf-side-navigation bf-side-navigation-drawer"') && pageChromeJs.includes('class="bf-side-navigation-groups"'), "Expected the shared drawer to initialise the side-navigation inset and grouped navigation contracts.");
  assert(pageChromeJs.includes('class="bf-side-navigation-group"') && pageChromeJs.includes('${index > 0 ? "<hr>" : ""}'), "Expected every page-chrome heading/list pair after the first to begin with a real rule inside its group.");
  assert(pageChromeJs.includes("orderedCatalogSections()") && pageChromeJs.includes("localeCompare") && pageChromeJs.includes("renderSequenceNavigation"), "Expected page chrome to share category/alphabetic ordering between the sidebar and Previous/Next controls.");
  assert(pageChromeJs.includes('class="bf-theme is-dark bf-cluster pc-sequence"') && pageChromeJs.includes('class="bf-button is-base is-icon pc-sequence-link') && pageChromeJs.includes('class="bf-icon ${icon}"') && pageChromeJs.includes('aria-label="${label}: ${escapeHtml(page.title)}"'), "Expected adjacent-page links to use the canonical dark-theme base/icon chevron composition and expose destination names.");
  assert(pageChromeJs.includes('class="bf-breadcrumbs pc-breadcrumbs"') && pageChromeJs.includes('aria-current="page"'), "Expected page chrome to compose the public breadcrumb hierarchy for current-page context.");
  assert(componentDemoJs.includes('ensureTargetId(document.body, "demo-page")'), "Expected component pages to target the complete body with the global baseline overlay.");
  assert(specRuntimeJs.includes('ensureTargetId(document.body, "spec-page")') && specRuntimeJs.includes("wrapBodyContent: true"), "Expected living-spec pages to use the global body overlay and shared bf-page wrapper.");
  assert(examplePageJs.includes('ensureTargetId(document.body, "example-page")') && examplePageJs.includes("wrapBodyContent: true") && examplePageJs.includes("initAccordions") && examplePageJs.includes("initTabs"), "Expected example pages to use the global body overlay, shared bf-page wrapper, and shared disclosure/tab runtimes.");
}

export function validateEngineIllustrationPage(pageCatalogJs: string, componentAtlasHtml: string, engineIllustrationHtml: string, componentShellCss: string): void {
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

export function validateRangePage(rangeHtml: string, componentShellCss: string): void {
  validateBfOnlyDemoPage("range.html", rangeHtml);
  assert(rangeHtml.includes('class="bf-inline-size is-compact" data-overflow-container data-baseline-ignore="true"'), "Expected range.html to use the shared compact inline-size utility for the stacked rail wrapper.");
  assert(!/class="[^"]*\brange-demo-rail\b/.test(rangeHtml), "Expected range.html to stop using the page-local range-demo-rail helper class.");
  assert(!componentShellCss.includes('.range-demo-rail'), "Expected component-shell.css to stop carrying the page-local range-demo-rail helper.");
}

export function validateComponentAtlasPage(componentAtlasHtml: string, componentAtlasJs: string): void {
  assert(componentAtlasHtml.includes('data-component-atlas-item'), "Expected demo/components/index.html to expose JS-only data hooks for atlas item enhancement.");
  assert(componentAtlasHtml.includes('<ul class="bf-grid">'), "Expected demo/components/index.html to use plain bf-grid lists instead of page-local atlas list wrappers.");
  assert(!componentAtlasHtml.includes('demo-index-'), "Expected demo/components/index.html to stop using the page-local demo-index helper classes.");
  assert(componentAtlasJs.includes('querySelectorAll("[data-component-atlas-item]")'), "Expected component-atlas.js to target atlas items through JS-only data hooks.");
  assert(componentAtlasJs.includes('link.classList.add("bf-card", "is-overlay", "is-preview")'), "Expected component-atlas.js to build atlas items from BF-owned card primitives.");
  assert(componentAtlasJs.includes('preview.classList.add("bf-card-preview")'), "Expected component-atlas.js to use the BF card preview slot.");
  assert(componentAtlasJs.includes('image.classList.add("bf-card-preview-image")'), "Expected component-atlas.js to use the BF card preview image slot.");
  assert(!componentAtlasJs.includes('demo-index-'), "Expected component-atlas.js to stop emitting the page-local demo-index helper classes.");
  assert(!componentAtlasHtml.includes("data-demo-baseline-toggle"), "Expected the Component Atlas to rely on the sole global baseline-grid control.");
  assert((componentAtlasHtml.match(/class="bf-text-link"/g) ?? []).length === 2, "Expected Component Atlas utility links to use the canonical standalone text-link role.");
}

export function validatePatternAtlasPage(
  patternAtlasHtml: string,
  componentAtlasHtml: string,
  componentAtlasJs: string,
  pageCatalogJs: string
): void {
  assertNoDuplicateClassAttributes("demo/patterns/index.html", patternAtlasHtml);
  assert(patternAtlasHtml.includes('<body class="bf-theme is-dark"'), "Expected the pattern atlas to dogfood the BF theme root.");
  assert(patternAtlasHtml.includes('data-component-capture'), "Expected the pattern atlas to expose a capture root.");
  assert(!patternAtlasHtml.includes('data-demo-baseline-toggle'), "Expected the Pattern Atlas to rely on the sole global baseline-grid control.");
  assert((patternAtlasHtml.match(/class="bf-text-link"/g) ?? []).length === 2, "Expected Pattern Atlas utility links to use the canonical standalone text-link role.");
  assert(pageCatalogJs.includes('export const patternSections = ['), "Expected the page catalog to own a distinct patternSections registry.");
  assert(pageCatalogJs.includes('{ title: "Pattern atlas", href: "/demo/patterns/index.html" }'), "Expected the Pattern Atlas to be globally discoverable from the overview catalog.");
  assert(pageCatalogJs.includes('...patternSections,'), "Expected shared page chrome to include the pattern registry.");
  assert(componentAtlasHtml.includes('<a class="bf-text-link" href="../patterns/index.html">Pattern atlas</a>'), "Expected the Component Atlas to link directly to the Pattern Atlas with the standalone text role.");
  assert(componentAtlasJs.includes('querySelectorAll("[data-pattern-atlas-item]")'), "Expected the atlas enhancer to support semantic pattern items.");

  const expectedPatterns = [
    "article-pagination",
    "content-card",
    "data-spotlight",
    "divided-section",
    "tiered-list",
    "cta-block",
    "equal-height-row",
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
    "sticky-footer"
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

export function validateFormAtlasPage(formAtlasHtml: string, componentAtlasHtml: string, componentShellCss: string): void {
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

export function validateButtonDemo(buttonHtml: string): void {
  validateBfOnlyDemoPage("button.html", buttonHtml);
  assert(buttonHtml.includes('data-baseline-label="icon-only button stacked 1"'), "Expected button.html to include an icon-only button specimen for dense-surface verification.");
  assert(buttonHtml.includes('data-baseline-label="icon-only button stacked 2"'), "Expected button.html to include a second icon-only button specimen so both neutral and negative icon-only states stay visible in QA.");
}

export function validateBfOnlyDemoFamily(demoPages: Record<string, string>): void {
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

export function validateParitySurfaceDemos(iconHtml: string, listHtml: string, tableHtml: string): void {
  assert(iconHtml.includes("is-success-grey"), "Expected icon.html to demo the success-grey glyph.");
  assert(iconHtml.includes("is-error-grey"), "Expected icon.html to demo the error-grey glyph.");
  assert(listHtml.includes("is-ticked"), "Expected list.html to demo ticked list items.");
  assert(listHtml.includes("is-crossed"), "Expected list.html to demo crossed list items.");
  assert(tableHtml.includes("is-icon-placeholder"), "Expected table.html to demo icon-placeholder cells.");
  assert(tableHtml.includes("bf-table-scroll") && tableHtml.includes('tabindex="0"'), "Expected table.html to exercise the keyboard-focusable horizontal-scroll wrapper.");
}

export function validateTopNavigationDemo(topNavigationHtml: string): void {
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

export function validateApplicationShellDemo(applicationShellHtml: string): void {
  assert(applicationShellHtml.includes('class="bf-panel is-fill"'), "Expected application-shell.html to demo the canonical fill-height panel modifier in a pinned-aside shell.");
  assert(applicationShellHtml.includes('block-size:calc(var(--bf-baseline)*72);min-block-size:calc(var(--bf-baseline)*72)'), "Expected application-shell.html to keep a fixed shell height so the fill-height panel contract is observable.");
  assert(applicationShellHtml.includes('Recent exports'), "Expected application-shell.html to include enough inspector content to exercise the internal panel scroll path.");
  assert(applicationShellHtml.includes("bf-fixed-width is-start-aligned"), "Expected application-shell.html to exercise logical-start fixed-width alignment.");
}

export function validateTypographicSpecimen(pageCatalogJs: string, specimenHtml: string): void {
  assert(pageCatalogJs.includes('{ title: "Typographic specimen", href: "/demo/spec/typographic-specimen.html" }'), "Expected the page catalog to register the typographic specimen chapter.");
  assert(specimenHtml.includes('<body class="bf-theme bf-tier-editorial" data-page-tier-options="editorial,documentation,app,os">'), "Expected typographic-specimen.html to boot as a shared tier-switching spec page.");
  assert(specimenHtml.includes('<main class="bf-page is-fill" id="spec-grid-target">'), "Expected typographic-specimen.html to use the shared fill-height bf-page container.");
  assert(specimenHtml.includes('<a class="bf-text-link" href="./typographic-specimen.html" aria-current="page">Specimen</a>'), "Expected typographic-specimen.html to expose the current-page spec nav link with the standalone text metric role.");
  assert(specimenHtml.includes('<a class="bf-text-link" href="../panel.html">OS tier</a>'), "Expected typographic-specimen.html to link the first-class OS tier from the local spec nav with the standalone text metric role.");
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

export function validateGridSpecPage(gridSpecHtml: string, specShellCss: string): void {
  assert(gridSpecHtml.includes('<body class="bf-theme bf-tier-editorial" data-page-tier-options="editorial,documentation,app,os">'), "Expected grid.html to boot as a shared tier-switching spec page.");
  assert(gridSpecHtml.includes('class="bf-stack bf-grid-scope specimen-grid-scope is-grid-4"'), "Expected grid.html to expose the 4-column breakpoint specimen through an explicit specimen class.");
  assert(gridSpecHtml.includes('class="bf-stack bf-grid-scope specimen-grid-scope is-grid-8"'), "Expected grid.html to expose the 8-column breakpoint specimen through an explicit specimen class.");
  assert(gridSpecHtml.includes('class="bf-stack bf-grid-scope specimen-grid-scope is-grid-16"'), "Expected grid.html to expose the 16-column breakpoint specimen through an explicit specimen class.");
  assert(gridSpecHtml.includes('class="bf-grid is-guide"'), "Expected grid.html to use the BF-owned grid guide modifier on breakpoint specimens.");
  assert(specShellCss.includes('.specimen-grid-scope {'), "Expected spec-shell.css to define the shared resizable breakpoint specimen shell.");
  assert(specShellCss.includes('resize: horizontal;'), "Expected spec-shell.css to keep the breakpoint specimen resizable.");
  assert(specShellCss.includes('overflow: hidden;'), "Expected spec-shell.css to keep the breakpoint specimen resizable by clipping overflow.");
  assert(specShellCss.includes('min-inline-size: 15rem;'), "Expected spec-shell.css to keep the breakpoint specimen minimum width.");
  assert(/\.specimen-grid-scope\.is-grid-4\s*\{\s*inline-size:\s*38\.6875rem;/.test(specShellCss), "Expected spec-shell.css to seed the 4-column specimen at the 38.6875rem breakpoint edge.");
  assert(/\.specimen-grid-scope\.is-grid-8\s*\{\s*inline-size:\s*64\.6875rem;/.test(specShellCss), "Expected spec-shell.css to seed the 8-column specimen at the 64.6875rem breakpoint edge.");
  assert(/\.specimen-grid-scope\.is-grid-16\s*\{\s*inline-size:\s*105\.0625rem;/.test(specShellCss), "Expected spec-shell.css to seed the 16-column specimen at the 105.0625rem breakpoint edge.");
  assert(!gridSpecHtml.includes('pc-grid-guide'), "Expected grid.html to stop using the page-local pc-grid-guide helper.");
}

export function validateSpacingSpecPage(spacingSpecHtml: string, horizontalAuditHtml: string, verticalAuditHtml: string, specShellCss: string): void {
  assert(spacingSpecHtml.includes('<main class="bf-page is-fill" id="spec-grid-target">'), "Expected spacing.html to remain a full-width spacing overview.");
  assert(spacingSpecHtml.includes('href="./spacing-horizontal.html"') && spacingSpecHtml.includes('href="./spacing-vertical.html"'), "Expected the spacing overview to link to the separate horizontal and vertical audits.");
  for (const [name, html, pageId] of [["horizontal", horizontalAuditHtml, "spacing-horizontal-audit"], ["vertical", verticalAuditHtml, "spacing-vertical-audit"]] as const) {
    assert(html.includes(`<main class="bf-page is-fill" id="${pageId}">`), `Expected the ${name} audit to be full width.`);
    assert(!html.includes('bf-hero') && !html.includes('bf-basic-section'), `Expected the ${name} audit to avoid 50/50 documentation compositions.`);
    assert(html.includes('class="bf-stack is-section"') && html.includes('class="bf-stack is-dense"'), `Expected the ${name} audit to use only shipped stack composition.`);
    assert(!/class="[^"]*\b(?:spacing-keyline|keyline)-(?!checkbox|radio|panel)[a-z0-9_-]*/.test(html), `Expected the ${name} audit to avoid page-local keyline helper classes.`);
  }
  assert((horizontalAuditHtml.match(/<h2 class="bf-h6"/g) ?? []).length >= 5, "Expected compact H6-styled headings throughout the horizontal audit.");
  assert((verticalAuditHtml.match(/<h2 class="bf-h6"/g) ?? []).length >= 9, "Expected compact H6-styled headings throughout the vertical audit.");
  assert(horizontalAuditHtml.includes('Horizontal — field and cell content inset') && horizontalAuditHtml.includes('Horizontal — command inset') && horizontalAuditHtml.includes('Horizontal — leading-mark offset') && horizontalAuditHtml.includes('Horizontal — icon-led and navigation label offset'), "Expected the horizontal audit to present the concise measured inset groups.");
  assert(!horizontalAuditHtml.includes('<code>--bf-') && !verticalAuditHtml.includes('<code>--bf-'), "Expected audit headings to omit implementation-variable labels.");
  const fieldBucket = horizontalAuditHtml.slice(horizontalAuditHtml.indexOf('id="horizontal-fields"'), horizontalAuditHtml.indexOf('id="horizontal-actions"'));
  assert(fieldBucket.includes('type="number"') && fieldBucket.includes('<select') && fieldBucket.includes('Table cell') && fieldBucket.includes('bf-chip') && fieldBucket.includes('is-borderless') && fieldBucket.includes('bf-status-label'), "Expected number, select, table-cell, regular/borderless chip, and status-label insets to remain directly comparable in the field bucket.");
  const markBucket = horizontalAuditHtml.slice(horizontalAuditHtml.indexOf('id="horizontal-marks"'), horizontalAuditHtml.indexOf('id="horizontal-icon-navigation"'));
  assert(markBucket.includes('<ul>') && markBucket.includes('<ol>') && markBucket.includes('is-ticked') && markBucket.includes('is-crossed') && markBucket.includes('bf-checkbox') && markBucket.includes('bf-radio') && markBucket.includes('bf-validation-message'), "Expected the leading-mark bucket to cover prose bullets/numbers, state-list marks, checkbox, radio, and validation copy.");
  const iconNavigationBucket = horizontalAuditHtml.slice(horizontalAuditHtml.indexOf('id="horizontal-icon-navigation"'), horizontalAuditHtml.indexOf('id="horizontal-surfaces"'));
  for (const component of ["bf-accordion", "bf-list-tree", "bf-switch", "bf-side-navigation", "bf-table-of-contents", "bf-notification"]) {
    assert(iconNavigationBucket.includes(component), `Expected the shared icon-led/navigation bucket to include ${component}.`);
  }
  assert(!horizontalAuditHtml.includes("Navigation depth") && !horizontalAuditHtml.includes("Nested item"), "Expected page/grid gutter and navigation depth to stay outside component-padding buckets.");
  for (const component of ["bf-search-box", "bf-slider", "bf-segmented-control", "bf-choice-list", "bf-inline-options", "bf-breadcrumbs", "bf-pagination", "bf-checkbox", "bf-radio", "bf-switch", "bf-accordion", "bf-list-tree", "bf-side-navigation", "bf-table-of-contents", "bf-notification", "bf-panel", "bf-table"]) {
    assert(horizontalAuditHtml.includes(component) || verticalAuditHtml.includes(component), `Expected the axis-specific audits to retain ${component} evidence.`);
  }
  assert(horizontalAuditHtml.includes('type="number"') && verticalAuditHtml.includes('type="number"'), "Expected both audits to expose a numeric input.");
  const compactTagsBucket = verticalAuditHtml.slice(verticalAuditHtml.indexOf('id="vertical-tags"'), verticalAuditHtml.indexOf('id="vertical-surfaces"'));
  assert(compactTagsBucket.includes('class="bf-cluster"') && compactTagsBucket.includes('class="bf-body"') && compactTagsBucket.includes('class="bf-chip"') && compactTagsBucket.includes('bf-badge') && compactTagsBucket.includes('is-borderless') && !compactTagsBucket.includes('bf-status-label'), "Expected compact data tags to compare inline body text, chip with badge, and the borderless-chip label treatment.");
  assert(!specShellCss.includes('keyline'), "Expected the spacing comparison to need no page-local keyline CSS.");
}

export function validateOsTierPage(pageCatalogJs: string, panelHtml: string): void {
  assert(pageCatalogJs.includes('{ title: "OS tier", href: "/demo/tiers/os.html" }'), "Expected the page catalog to register the distinct OS tier-reference page.");
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
