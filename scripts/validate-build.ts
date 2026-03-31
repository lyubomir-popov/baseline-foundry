import fs from "node:fs/promises";
import path from "node:path";
import { BASELINE_GRID_DARK_THEME_COLOR, BASELINE_GRID_DEFAULT_COLOR, BASELINE_GRID_LIGHT_THEME_COLOR } from "../src/baseline-grid-theme.js";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function assertExists(filePath: string): Promise<void> {
  await fs.access(filePath);
}

async function readThemeArtifacts(baseDir: string): Promise<{ tokens: Record<string, unknown>; css: string; }> {
  const tokensPath = path.join(baseDir, "tokens.json");
  const cssPath = path.join(baseDir, "styles.css");

  await assertExists(tokensPath);
  await assertExists(cssPath);

  return {
    tokens: JSON.parse(await fs.readFile(tokensPath, "utf8")) as Record<string, unknown>,
    css: await fs.readFile(cssPath, "utf8")
  };
}

async function readTextArtifact(filePath: string): Promise<string> {
  await assertExists(filePath);
  return fs.readFile(filePath, "utf8");
}

function validateBfOnlyDemoPage(pageName: string, html: string): void {
  assert(html.includes('<body class="bf-theme" data-bf-tone="dark"'), `Expected ${pageName} to dogfood the bf-theme root.`);
  assert(html.includes("data-component-capture"), `Expected ${pageName} to expose a data-component-capture root for screenshot and baseline tooling.`);
  assert(!/\bp-[a-z][a-z0-9_-]*/.test(html), `Expected ${pageName} to avoid deprecated p-* markup and stay fully bf-* dogfooded.`);
  assert(!/\bvr-[a-z][a-z0-9_-]*/.test(html), `Expected ${pageName} to avoid deprecated vr-* markup and stay fully bf-* dogfooded.`);
}

function validateAppTierDemoPage(pageName: string, html: string): void {
  assert(html.includes('../../dist/presets/app-tier/styles.css'), `Expected ${pageName} to load the app-tier preset instead of the dense panel preset.`);
  assert(html.includes('<body class="bf-theme bf-tier-app"'), `Expected ${pageName} to dogfood the bf-theme + bf-tier-app root.`);
  assert(html.includes("data-component-capture"), `Expected ${pageName} to expose a data-component-capture root for screenshot and baseline tooling.`);
  assert(!html.includes('data-bf-tone="dark"'), `Expected ${pageName} to avoid the dark demo tone now that it is an app-tier parity surface.`);
  assert(!/\bp-[a-z][a-z0-9_-]*/.test(html), `Expected ${pageName} to avoid deprecated p-* markup and stay fully bf-* dogfooded.`);
  assert(!/\bvr-[a-z][a-z0-9_-]*/.test(html), `Expected ${pageName} to avoid deprecated vr-* markup and stay fully bf-* dogfooded.`);
}

function validateCommonCss(css: string): void {
  assert(css.includes("@font-face"), "Expected generated CSS to include runtime font-face rules.");
  assert(css.includes("font-family: \"Ubuntu Sans\";"), "Expected generated CSS to register the Ubuntu Sans family.");
  assert(css.includes("UbuntuSans[wdth,wght].ttf"), "Expected generated CSS to point to the Ubuntu Sans variable font.");
  assert(css.includes("font-weight: 100 900;"), "Expected generated CSS to expose the Ubuntu Sans variable weight range.");
  assert(css.includes("@container (width >= 38.75rem)"), "Expected CSS to use the Canonical 620px threshold for the 8-column grid.");
  assert(css.includes("@container (width >= 105.0625rem)"), "Expected CSS to use the Canonical 1681px threshold for the 16-column grid.");
  assert(css.includes("@media (width >= 38.75rem)"), "Expected CSS to use the Canonical 620px viewport breakpoint for gutters and outer margins.");
  assert(css.includes("@media (width >= 64.75rem)"), "Expected CSS to use the Canonical 1036px viewport breakpoint for large outer margins.");
  assert(css.includes(":where(.bf-theme.bf-tier-app) :where(.bf-page) {\n  max-inline-size: none;"), "Expected app-tier page to be fluid (no max-width cap).");
  assert(css.includes("--bf-grid-gap-inline: 1rem;"), "Expected CSS to define the x-small 16px grid gutter.");
  assert(css.includes("--bf-grid-gap-block: 1rem;"), "Expected CSS to define the x-small 16px grid gap.");
  assert(css.includes("--bf-page-margin: 1rem;"), "Expected CSS to define the x-small 16px outer margin.");
  assert(css.includes("--bf-grid-gap-inline: 1.5rem;"), "Expected CSS to define the small-and-up 24px grid gutter.");
  assert(css.includes("--bf-page-margin: 1.5rem;"), "Expected CSS to define the small 24px outer margin.");
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
  assert(css.includes(":where(.bf-theme[data-bf-tone='dark'], .bf-theme.is-dark)"), "Expected generated CSS to include a core dark-tone override.");
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
  assert(css.includes(`:where(.bf-theme[data-bf-tone='dark'], .bf-theme.is-dark).u-baseline-grid,\n:where(.bf-theme[data-bf-tone='dark'], .bf-theme.is-dark) .u-baseline-grid {\n  --bf-baseline-grid-color: ${BASELINE_GRID_DARK_THEME_COLOR};`), "Expected dark themes to provide a subtle baseline-grid line color, even when the grid class is on the theme root.");
  assert(css.includes(":where(.bf-theme) :where(img, picture, svg, video) {\n  block-size: auto;\n  display: block;\n  inline-size: auto;\n  max-inline-size: 100%;"), "Expected shared media to stay fluid inside narrow containers.");
  assert(css.includes("--bf-grid-columns: 16;"), "Expected the grid CSS to include the 16-column mode.");
  assert(css.includes(".bf-span-16"), "Expected the grid CSS to include the 16-column span class.");
  assert(!css.includes(".bf-span-12"), "Expected the grid CSS to omit the old 12-column span class.");
  assert(css.includes("text-transform: uppercase;"), "Expected CSS to include the table-header uppercase treatment.");
  assert(css.includes(":where(.bf-theme) .bf-ui-small-caps {"), "Expected CSS to emit the dedicated ui-small-caps role utility.");
  assert(css.includes("font-variant-caps: all-small-caps;"), "Expected CSS to route compact small-caps styling through the dedicated ui-small-caps role.");
  assert(css.includes("letter-spacing: 0.05em;"), "Expected CSS to include the small-caps tracking.");
  assert(css.includes(":where(.bf-engine-cap)"), "Expected generated CSS to include the cap-engine override selector.");
  assert(css.includes(":where(.bf-theme.bf-tier-app)"), "Expected generated CSS to include the app-tier runtime flag selector.");
  assert(css.includes("--bf-semantic-space-after: 0rem;\n  --bf-selected-start-nudge: 0rem;\n  --bf-selected-end-nudge: 0rem;"), "Expected app-tier runtime overrides to zero semantic spacing and selected nudges.");
  assert(css.includes("--bf-selected-start-nudge: var(--bf-metrics-start-nudge);"), "Expected generated CSS to default to the metrics baseline engine.");
  assert(css.includes("--bf-body-selected-start-nudge: var(--bf-body-metrics-start-nudge);"), "Expected generated CSS to default body-aligned controls to the metrics engine.");
  assert(css.includes("--bf-h6-selected-start-nudge: var(--bf-h6-cap-start-nudge);"), "Expected generated CSS to expose h6 alignment through the cap-engine override.");
  assert(css.includes("--bf-semantic-space-after: var(--bf-space-after-sem-editorial, 0rem);"), "Expected generated CSS to default to editorial semantic spacing.");
  assert(css.includes(":where(.bf-theme) :where(.bf-prose > :last-child) {\n  margin-bottom: 0;"), "Expected prose flow boundaries to trim semantic trailing space now that baseline compensation lives inside the element box.");
  assert(css.includes(".bf-prose li"), "Expected CSS to include list item selectors.");
  assert(css.includes("padding-block-end: var(--bf-selected-end-nudge);"), "Expected list items to preserve baseline compensation through the selected engine.");
  assert(css.includes("margin: 0 0 var(--bf-semantic-space-after);"), "Expected list containers to use tier-selected semantic spacing without double-applying compensation.");
  assert(!css.includes(".bf-prose li + li"), "Expected list spacing to avoid the old ad hoc inter-item margin.");
  assert(css.includes("margin: 0 0 calc(var(--bf-space-3) - 1px);"), "Expected rules to compensate their 1px thickness against the baseline rhythm.");
  assert(css.includes("padding-block-end: var(--bf-strip-space);"), "Expected strip rhythm to live on the bottom edge only.");
  assert(!css.includes("padding-block: var(--bf-strip-space);"), "Expected strip rhythm to avoid symmetric top-and-bottom padding.");
  assert(css.includes(".bf-grid"), "Expected CSS to include grid selectors.");
  assert(css.includes(".bf-section"), "Expected CSS to include section selectors.");
  assert(css.includes(".bf-stack"), "Expected CSS to include stack selectors.");
  assert(css.includes(".bf-stage-shell"), "Expected CSS to include the stage-shell helper.");
  assert(css.includes(".u-baseline-grid"), "Expected CSS to include the baseline grid utility.");
  assert(!css.includes("min-inline-size: 8em;"), "Expected text-like controls to avoid hard minimum widths that break narrow panels.");
  assert(css.includes("input[type='file'])::file-selector-button"), "Expected generated CSS to include dense file input styling.");
  assert(css.includes(":where(.bf-control) {\n  display: grid;\n  gap: var(--bf-field-gap);\n  min-inline-size: 0;"), "Expected form controls to allow shrinking inside narrow containers.");
  assert(css.includes(":where(.bf-field.is-checkbox) :where(.bf-control) {\n  gap: 0;"), "Expected checkbox field controls to avoid downstream gap overrides.");
  assert(css.includes("--bf-switch-track-offset: calc((var(--bf-switch-row-block-size) - var(--bf-control-visual-size)) / 2);"), "Expected generated CSS to center switch geometry from the control row variables.");
  assert(css.includes("--bf-tick-box-offset: calc((var(--bf-tick-row-block-size) - var(--bf-control-visual-size)) / 2);"), "Expected generated CSS to derive tick-box placement from the dense control row variables.");
  assert(css.includes("--bf-tick-label-offset: calc(var(--bf-control-visual-size) + var(--bf-control-inline-padding));"), "Expected generated CSS to derive tick label spacing from the control inline padding token.");
  assert(css.includes("min-block-size: var(--bf-tick-row-block-size);"), "Expected checkbox and radio rows to use the shared tick-row block-size variable.");
  assert(css.includes("var(--bf-body-selected-start-nudge)"), "Expected controls to consume the selected body alignment nudge.");
  assert(css.includes("var(--bf-body-selected-end-nudge)"), "Expected controls to consume the selected body alignment nudge on both edges.");
  assert(css.includes(":where(.bf-theme) :where(.bf-grid.bf-grid.is-controls) {\n  container-type: inline-size;\n  gap: var(--bf-field-gap);"), "Expected grid CSS to include the dense control-grid recipe on top of bf-grid.");
  assert(css.includes(":where(.bf-theme):where(.bf-page, .bf-grid-scope,"), "Expected grid CSS to include a compound selector so container-type applies when the theme scope and grid-scope are on the same element.");
  assert(css.includes(":where(.bf-theme) :where(.bf-grid.bf-grid.is-controls) > :where(.bf-grid-item.is-control, .bf-grid-item.is-control-pair) {\n  grid-column: auto / span 4;"), "Expected grid CSS to include the default dense control-grid recipe spans.");
  assert(css.includes(":where(.bf-theme) :where(.bf-grid.bf-grid.is-controls) > :where(.bf-grid-item.is-control) {\n    grid-column: auto / span 2;"), "Expected the control-grid recipe to map compact field cells onto the 8-column grid.");
  assert(css.includes(":where(.bf-theme) :where(.bf-grid.bf-grid.is-controls) > :where(.bf-grid-item.is-control-pair) {\n    grid-column: auto / span 8;"), "Expected the control-grid recipe to keep paired inspector surfaces at half width on the 16-column grid.");
  assert(!css.includes(".bf-control-grid"), "Expected generated CSS to omit the deprecated bf-control-grid helper.");
  assert(css.includes(":where(.bf-slider.is-stacked) {\n  align-items: stretch;\n  display: grid;\n  gap: var(--bf-field-gap);"), "Expected stacked slider pairs to stay on the baseline-aligned field gap.");
  assert(!css.includes(".slider-pair"), "Expected compat CSS to omit the downstream slider wrapper aliases.");
  assert(!css.includes(".slider-pair--stacked"), "Expected compat CSS to omit the downstream stacked-slider alias.");
  assert(css.includes("inline-size: min(100%, 5rem);"), "Expected slider number inputs to use the compact PVR width.");
  assert(css.includes("flex-wrap: wrap;"), "Expected inline slider pairs to wrap instead of overflowing narrow rails.");
  assert(css.includes("flex: 0 1 5rem;"), "Expected slider number inputs to shrink before overflowing.");
  assert(!css.includes("min-inline-size: 5rem;"), "Expected slider number inputs to avoid a hard minimum width.");
  assert(css.includes(":where(.bf-switch-slider)"), "Expected generated CSS to include switch styling.");
  assert(css.includes(":where(.bf-validation-message)"), "Expected generated CSS to include validation message styling.");
  assert(css.includes(":where(.bf-card, .bf-card.is-highlighted, .bf-card.is-overlay, .bf-card.is-muted)"), "Expected generated CSS to include card surfaces.");
  assert(css.includes(":where(.bf-segmented-control-button, .bf-tab-buttons-button)"), "Expected generated CSS to include segmented control buttons.");
  assert(css.includes(":where(.bf-breadcrumbs-items)"), "Expected generated CSS to include breadcrumb styling.");
  assert(css.includes(":where(.bf-pagination-items)"), "Expected generated CSS to include pagination styling.");
  assert(css.includes(":where(table, .bf-table)"), "Expected generated CSS to include table styling.");
  assert(css.includes(":where(.bf-chip, .bf-chip.is-positive, .bf-chip.is-caution, .bf-chip.is-negative, .bf-chip.is-information)"), "Expected generated CSS to include chip styling.");
  assert(css.includes("--bf-ui-chip-border: var(--bf-color-border-neutral);"), "Expected generated CSS to style neutral chips with the Vanilla neutral border token.");
  assert(css.includes("--bf-ui-chip-background: var(--bf-color-background-neutral-default);"), "Expected generated CSS to style neutral chips with the Vanilla neutral background token.");
  assert(!css.includes("--bf-ui-chip-border: var(--bf-color-border-default);"), "Expected generated CSS to avoid using the generic default border token for neutral chips.");
  assert(!css.includes("--bf-ui-chip-background: var(--bf-color-background-hover);"), "Expected generated CSS to avoid using the generic hover background token for neutral chips.");
  assert(css.includes(":where(.bf-badge, .bf-badge.is-negative)"), "Expected generated CSS to include badge styling.");
  assert(css.includes(":where(.bf-status-label, .bf-label, .bf-status-label.is-positive"), "Expected generated CSS to include status label styling.");
  assert(css.includes(":where(.bf-search-box)"), "Expected generated CSS to include search-box styling.");
  assert(css.includes(":where(.bf-search-and-filter)"), "Expected generated CSS to include search-and-filter styling.");
  assert(css.includes(":where(.bf-search-and-filter-box) {\n  display: inline-flex;\n  flex: 1 1 12rem;\n  max-inline-size: 100%;\n  min-inline-size: 0;"), "Expected search-and-filter boxes to shrink inside narrow rails.");
  assert(css.includes(":where(.bf-code-snippet)"), "Expected generated CSS to include code-snippet styling.");
  assert(css.includes(":where(.bf-code-snippet-block.is-icon) {\n  cursor: copy;"), "Expected generated CSS to include copyable code-snippet blocks.");
  assert(css.includes(":where(.bf-list-tree)"), "Expected generated CSS to include list-tree styling.");
  assert(css.includes(":where(.bf-tabs.is-equal)"), "Expected generated CSS to include equal-width dense tab modifiers.");
  assert(css.includes(":where(.bf-choice-row)"), "Expected generated CSS to include the canonical choice-row component.");
  assert(css.includes(":where(.bf-inline-options)"), "Expected generated CSS to include the canonical inline-options component.");
  assert(css.includes(":where(.bf-option-grid)"), "Expected generated CSS to include the canonical option-grid component.");
  assert(css.includes(":where(.bf-option-card)"), "Expected generated CSS to include the canonical option-card component.");
  assert(css.includes(":where(.bf-form-help.is-tight)"), "Expected generated CSS to include the tight helper-text modifier.");
  assert(css.includes("input[type='color'].bf-color-input"), "Expected generated CSS to include the compact color-input treatment.");
  assert(css.includes(":where(.bf-actions)"), "Expected generated CSS to include the canonical actions-row helper.");
  assert(css.includes(":where(.bf-panel.is-fill)"), "Expected generated CSS to include the canonical fill-height panel helper.");
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
  assert(css.includes(":where(.l-application__overlay, .bf-application-overlay)"), "Expected generated CSS to include application drawer overlay styling.");
  assert(css.includes(":where(.l-aside.is-overlay, .bf-aside.is-overlay, .l-aside.is-drawer, .bf-aside.is-drawer)"), "Expected generated CSS to include overlay drawer aside styling.");
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
  assert(css.includes(".l-aside.is-overlay.is-small"), "Expected generated CSS to expose the Canonical small overlay modifier.");
  assert(css.includes(".l-aside.is-overlay.is-medium"), "Expected generated CSS to expose the Canonical medium overlay modifier.");
  assert(css.includes(".l-aside.is-overlay.is-large"), "Expected generated CSS to expose the Canonical large overlay modifier.");
  assert(!css.includes(".is-narrow"), "Expected generated CSS to omit the old narrow overlay modifier.");
  assert(!css.includes(".is-wide"), "Expected generated CSS to omit the old wide overlay modifier.");
  assert(css.includes(":where(.l-application__aside-resize-handle, .bf-application-aside-resize-handle)"), "Expected generated CSS to include the pinned-aside resize handle selector.");
  assert(css.includes("cursor: ew-resize;"), "Expected generated CSS to make the resize handle advertise horizontal resizing.");
  assert(css.includes("touch-action: none;"), "Expected generated CSS to make the resize handle safe for pointer dragging.");
  assert(css.includes(":where(.l-application.is-resizing-aside, .bf-application.is-resizing-aside)"), "Expected generated CSS to expose the resizing application state.");
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
} {
  const roles = (tokens.roles ?? {}) as Record<string, Record<string, unknown>>;
  const layout = (tokens.layout ?? {}) as Record<string, unknown>;
  const components = (tokens.components ?? {}) as Record<string, unknown>;
  const fontFiles = (tokens.fontFiles ?? []) as Array<Record<string, unknown>>;
  const roleNames = Object.keys(roles);

  assert(roleNames.length > 0, "Expected generated tokens to include typography roles.");
  assert(roles.body, 'Expected generated tokens to include a "body" role.');
  assert(roles.h1 && roles.h2 && roles.h3 && roles.h4 && roles.h5 && roles.h6, "Expected generated tokens to include the standard heading roles.");
  assert(roles["ui-heading"], 'Expected generated tokens to include a "ui-heading" role.');
  assert(roles["ui-small"], 'Expected generated tokens to include a "ui-small" role.');
  assert(roles["ui-small-caps"], 'Expected generated tokens to include a "ui-small-caps" role.');
  assert(roles["ui-x-small"], 'Expected generated tokens to include a "ui-x-small" role.');
  assert(fontFiles.some(fontFile => fontFile.family === "ubuntu-sans"), "Expected generated tokens to include the Ubuntu Sans font.");
  assert(components.borderWidth, "Expected generated tokens to include component border width.");
  assert(components.controlInlinePadding, "Expected generated tokens to include component padding.");
  assert(components.controlVisualSize, "Expected generated tokens to include component visual size.");
  assert(components.controlMinBlockSize, "Expected generated tokens to include component control size.");
  assert(components.controlMinBlockSizeDense, "Expected generated tokens to include component dense control size.");

  return { roles, layout, components };
}

function validateAppTierCss(css: string): void {
  assert(css.includes('font-family: "Ubuntu Sans";'), "Expected the app-tier preset CSS to register the Ubuntu Sans family.");
  assert(css.includes('UbuntuSans[wdth,wght].ttf'), "Expected the app-tier preset CSS to point to the Ubuntu Sans variable font.");
  assert(css.includes('font-weight: 100 900;'), "Expected the app-tier preset CSS to expose the Ubuntu Sans variable weight range.");
  assert(css.includes('--bf-app-demo-page-bg: var(--vf-color-background-alt, #f7f7f7);'), "Expected the app-tier preset CSS to expose the light application page background token through the shared semantic background token.");
  assert(css.includes('--bf-body-selected-start-nudge: 0rem;'), "Expected the app-tier preset CSS to zero app-tier body nudges.");
  assert(css.includes(':where(.bf-theme.bf-tier-app) :where(.bf-form-label, .bf-form-help, .bf-button, .bf-button.is-base, .bf-status-label, .bf-chip, .bf-checkbox-label, .bf-radio-label, .bf-tabs-link, .bf-accordion-tab, .bf-validation-message)'), "Expected the app-tier preset CSS to restyle app controls toward the Canonical body-text treatment.");
  assert(css.includes('--bf-app-panel-shadow:'), "Expected the app-tier preset CSS to expose the lighter app-panel shadow token.");
  assert(css.includes('box-shadow: var(--bf-app-panel-shadow);'), "Expected the app-tier preset CSS to apply the shared app-panel shadow token.");
  assert(!css.includes('.p-'), "Expected the app-tier preset CSS to omit deprecated p-* selectors.");
  assert(!css.includes('.vr-'), "Expected the app-tier preset CSS to omit deprecated vr-* selectors.");
}

function validateAppTierTheme(tokens: Record<string, unknown>, css: string): void {
  const roles = (tokens.roles ?? {}) as Record<string, Record<string, unknown>>;
  const layout = (tokens.layout ?? {}) as Record<string, unknown>;
  const components = (tokens.components ?? {}) as Record<string, unknown>;
  const fontFiles = (tokens.fontFiles ?? []) as Array<Record<string, unknown>>;

  assert(roles.body, 'Expected the app-tier preset tokens to include a "body" role.');
  assert(roles["ui-heading"], 'Expected the app-tier preset tokens to include a "ui-heading" role.');
  assert(roles["ui-small"], 'Expected the app-tier preset tokens to include a "ui-small" role.');
  assert(roles["ui-small-caps"], 'Expected the app-tier preset tokens to include a "ui-small-caps" role.');
  assert(roles["ui-x-small"], 'Expected the app-tier preset tokens to include a "ui-x-small" role.');
  assert(fontFiles.some(fontFile => fontFile.family === 'ubuntu-sans'), "Expected the app-tier preset tokens to include Ubuntu Sans font metadata.");
  assert(roles.body.fontFamily === 'ubuntu-sans', "Expected the app-tier preset body role to use Ubuntu Sans.");
  assert(roles.body.fontSize === '0.875rem', "Expected the app-tier preset body role font size to be 0.875rem.");
  assert(roles.body.lineHeight === '1.25rem', "Expected the app-tier preset body role line height to be 1.25rem.");
  assert(roles["ui-heading"].fontSize === '1rem', "Expected the app-tier preset ui-heading role font size to be 1rem.");
  assert(roles["ui-small"].fontSize === '0.875rem', "Expected the app-tier preset ui-small role font size to be 0.875rem.");
  assert(roles["ui-small-caps"].fontVariantCaps === 'all-small-caps', "Expected the app-tier preset ui-small-caps role to use real small-caps.");
  assert(roles["ui-small-caps"].letterSpacing === '0.05em', "Expected the app-tier preset ui-small-caps role to keep compact tracking.");
  assert(roles["ui-x-small"].fontSize === '0.75rem', "Expected the app-tier preset ui-x-small role font size to be 0.75rem.");
  assert(roles.h1.fontSize === '1.5rem', "Expected the app-tier preset h1 role font size to be 1.5rem.");
  assert(roles.h2.fontWeight === 300, "Expected the app-tier preset h2 to use the lighter Ubuntu Sans pairing.");
  assert(layout.gridGapInline === '1.5rem', "Expected the app-tier preset inline grid gap token to stay at the 24px application gutter.");
  assert(layout.pageMargin === '2rem', "Expected the app-tier preset page margin token to follow the 32px application outer margin.");
  assert(components.controlInlinePadding === '1rem', "Expected the app-tier preset control padding to come from the app-tier components block.");
  assert(components.controlMinBlockSize === '2.25rem', "Expected the app-tier preset control height to come from the app-tier components block.");
  assert(components.controlMinBlockSizeDense === '2rem', "Expected the app-tier preset dense control height to come from the app-tier components block.");
  assert(css.includes('.bf-h1'), "Expected the app-tier preset CSS to emit role utility selectors like the other presets.");
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
  assert(roles["ui-heading"].fontSize === "1rem", "Expected the documentation tier ui-heading role font size to be 1rem.");
  assert(roles["ui-small"].fontSize === "0.875rem", "Expected the documentation tier ui-small role font size to be 0.875rem.");
  assert(roles["ui-small-caps"].fontVariantCaps === "all-small-caps", "Expected the documentation tier ui-small-caps role to use real small-caps.");
  assert(roles["ui-small-caps"].letterSpacing === "0.05em", "Expected the documentation tier ui-small-caps role to keep compact tracking.");
  assert(roles["ui-x-small"].fontSize === "0.75rem", "Expected the documentation tier ui-x-small role font size to be 0.75rem.");
  assert(fontSizes.size === 6, "Expected the documentation tier to expose separate editorial and compact UI font sizes.");
  assert(layout.contentMaxWidth === "96rem", "Expected the documentation tier content width to widen to 96rem.");
  assert(layout.measure === "38rem", "Expected the documentation tier reading measure to tighten to 38rem.");
  assert(layout.gridGapInline === "1.5rem", "Expected the documentation tier inline grid gap token to be 1.5rem.");
  assert(layout.gridGapBlock === "1.5rem", "Expected the documentation tier block grid gap token to be 1.5rem.");
  assert(layout.pageMargin === "1.5rem", "Expected the documentation tier page margin token to be 1.5rem.");
  assert(layout.sectionSpace === "3rem", "Expected the documentation tier section rhythm to be 3rem.");
  assert(layout.sectionSpaceDeep === "6rem", "Expected the documentation tier deep section rhythm to be 6rem.");
  assert(components.controlInlinePadding === "0.875rem", "Expected the documentation tier control padding to tighten slightly.");
  assert(components.controlVisualSize === "0.875rem", "Expected the documentation tier visual control size to tighten slightly.");
  assert(components.controlMinBlockSize === "2.25rem", "Expected the documentation tier control height to be 2.25rem.");
  assert(components.controlMinBlockSizeDense === "2rem", "Expected the documentation tier dense control height to be 2rem.");
  assert(css.includes('.bf-h1'), "Expected the documentation tier CSS to emit role utility selectors.");
}

function validateLivingSpecHome(html: string): void {
  assert(html.includes('data-page-tier-options="editorial,app"'), "Expected index.html to declare the supported shared-bar tiers.");
  assert(html.includes('./dist/tiers/editorial/styles.css'), "Expected index.html to load the editorial tier output by default.");
  assert(html.includes('class="bf-grid pc-grid-guide"'), "Expected index.html to include grid guide specimens.");
  assert(html.includes('bf-grid-scope'), "Expected index.html to include bf-grid-scope container query scopes.");
  assert(html.includes('bf-span-1'), "Expected index.html to include bf-span column spans.");
  assert(html.includes('<main class="bf-page"'), "Expected index.html to use bf-page as the editorial container (centered, max-width capped).");
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
  assert(html.includes('data-page-tier-options="editorial,app"'), "Expected demo/controls.html to declare the supported shared-bar tiers.");
  assert(html.includes('../dist/tiers/app/styles.css'), "Expected demo/controls.html to default to the app tier output.");
  assert(html.includes('<h2>Core fields</h2>'), "Expected demo/controls.html to expose the core fields section heading.");
  assert(!html.includes('data-controls-hero'), "Expected demo/controls.html hero section to be removed.");
  assert(!html.includes('data-controls-summary'), "Expected demo/controls.html summary aside to be removed.");
  assert(html.includes('class="bf-search-and-filter"'), "Expected demo/controls.html to include the search-and-filter control family.");
  assert(html.includes('class="bf-segmented-control is-dense"'), "Expected demo/controls.html to include the segmented-control family.");
  assert(html.includes('bf-contextual-menu'), "Expected demo/controls.html to include the contextual-menu family.");
  assert(html.includes('class="bf-modal-dialog"'), "Expected demo/controls.html to include modal framing.");
  assert(html.includes('src="./controls-page.js"'), "Expected demo/controls.html to boot through the dedicated controls-page runtime.");
  assert(!/\bp-[a-z][a-z0-9_-]*/.test(html), "Expected demo/controls.html to avoid deprecated p-* markup and stay fully bf-* dogfooded.");
  assert(!/\bvr-[a-z][a-z0-9_-]*/.test(html), "Expected demo/controls.html to avoid deprecated vr-* markup and stay fully bf-* dogfooded.");

  assert(css.includes('.bf-controls-panels {'), "Expected demo/controls-shell.css to define the top-level control-panel grid.");
  assert(css.includes('.bf-controls-panel :where(.bf-panel) {'), "Expected demo/controls-shell.css to keep each bf-panel stretched inside the panel grid.");
  assert(css.includes('.bf-controls-menu-panel {'), "Expected demo/controls-shell.css to reserve extra space for contextual-menu dropdowns.");
  assert(css.includes('.bf-controls-modal {'), "Expected demo/controls-shell.css to define the modal specimen width.");
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
  assert(roles["ui-heading"].fontSize === "1rem", "Expected the prose default ui-heading role font size to be 1rem.");
  assert(roles["ui-small"].fontSize === "0.875rem", "Expected the prose default ui-small role font size to be 0.875rem.");
  assert(roles["ui-small-caps"].fontVariantCaps === "all-small-caps", "Expected the prose default ui-small-caps role to use real small-caps.");
  assert(roles["ui-small-caps"].letterSpacing === "0.05em", "Expected the prose default ui-small-caps role to keep compact tracking.");
  assert(roles["ui-x-small"].fontSize === "0.75rem", "Expected the prose default ui-x-small role font size to be 0.75rem.");
  assert(fontSizes.size === 5, "Expected the prose default theme to expose separate editorial and compact UI font sizes.");
  assert(layout.gridGapInline === "1rem", "Expected the prose default inline grid gap token to provide the x-small 16px gutter.");
  assert(layout.gridGapBlock === "1rem", "Expected the prose default block grid gap token to provide the x-small 16px gap.");
  assert(layout.pageMargin === "1rem", "Expected the prose default page margin token to provide the x-small 16px margin.");
  assert(layout.sectionSpace === "4rem", "Expected the prose default section rhythm to be 4rem.");
  assert(components.radius === "0rem", "Expected the prose default controls to stay square, matching the compat visual direction.");
  assert(components.controlVisualSize === "1rem", "Expected the prose default control glyphs to use a dedicated 1rem visual size.");
  assert(components.controlMinBlockSize === "2.5rem", "Expected the prose default control height to come from the theme components block.");
  assert(components.controlMinBlockSizeDense === "2rem", "Expected the prose default dense control height to come from the theme components block.");

  for (const roleName of Object.keys(roles)) {
    assert(css.includes(`.bf-${roleName}`), `Expected generated CSS to include the configured "${roleName}" utility selector.`);
  }

  assert(!css.includes(".bf-lead"), "Expected CSS to avoid generating an implicit lead alias when no lead role is configured.");
  assert(!css.includes(".bf-eyebrow"), "Expected CSS to avoid generating an implicit eyebrow alias when no eyebrow role is configured.");
  assert(!css.includes(".bf-meta"), "Expected CSS to avoid generating an implicit meta alias when no meta role is configured.");
}

function validatePanelTheme(tokens: Record<string, unknown>, css: string): void {
  const { roles, layout, components } = validateCommonTokens(tokens);
  const fontSizes = new Set(Object.values(roles).map(role => role.fontSize).filter(Boolean));

  assert(roles.body.fontSize === "0.75rem", "Expected the panel preset body role font size to be 0.75rem.");
  assert(roles.body.lineHeight === "1rem", "Expected the panel preset body line height to be 1rem.");
  assert(roles.h1.fontSize === "1.96875rem", "Expected the panel preset h1 role font size to be 1.96875rem.");
  assert(roles.h2.fontSize === "1.96875rem", "Expected the panel preset h2 role font size to be 1.96875rem.");
  assert(roles.h1.lineHeight === "2.25rem", "Expected the panel preset h1 line height to be 2.25rem.");
  assert(roles.h2.lineHeight === "2.25rem", "Expected the panel preset h2 line height to be 2.25rem.");
  assert(roles.h3.fontSize === "1.125rem", "Expected the panel preset h3 role font size to be 1.125rem.");
  assert(roles.h4.fontSize === "1.125rem", "Expected the panel preset h4 role font size to be 1.125rem.");
  assert(roles.h3.lineHeight === "1.5rem", "Expected the panel preset h3 line height to be 1.5rem.");
  assert(roles.h4.lineHeight === "1.5rem", "Expected the panel preset h4 line height to be 1.5rem.");
  assert(roles.h5.fontSize === "0.75rem", "Expected the panel preset h5 role font size to stay at the compact body size.");
  assert(roles.h6.fontSize === "0.75rem", "Expected the panel preset h6 role font size to stay at the compact body size.");
  assert(roles.h1.fontWeight === 500, "Expected the panel preset h1 to be the heavier member of the top pair.");
  assert(roles.h2.fontWeight === 200, "Expected the panel preset h2 to sit 300 weight units below h1.");
  assert(roles.h3.fontWeight === 500, "Expected the panel preset h3 to be the heavier member of the middle pair.");
  assert(roles.h4.fontWeight === 300, "Expected the panel preset h4 to sit 200 weight units below h3.");
  assert(roles.h5.fontWeight === 550, "Expected the panel preset h5 to use the canonical semi-bold weight.");
  assert(roles.h6.fontWeight === 550, "Expected the panel preset h6 to use the canonical semi-bold weight.");
  assert(!roles.h5.textTransform, "Expected the panel preset h5 to avoid uppercase now that canonical weights are used.");
  assert(!roles.h5.fontVariantCaps, "Expected the panel preset h5 to avoid font-variant small-caps settings.");
  assert(!roles.h5.letterSpacing, "Expected the panel preset h5 to avoid letterSpacing now that canonical weights are used.");
  assert(roles["ui-heading"].fontSize === "1rem", "Expected the panel preset ui-heading role font size to be 1rem.");
  assert(roles["ui-small"].fontSize === "0.875rem", "Expected the panel preset ui-small role font size to be 0.875rem.");
  assert(roles["ui-small-caps"].fontVariantCaps === "all-small-caps", "Expected the panel preset ui-small-caps role to use real small-caps.");
  assert(roles["ui-small-caps"].letterSpacing === "0.05em", "Expected the panel preset ui-small-caps role to keep compact tracking.");
  assert(roles["ui-x-small"].fontSize === "0.75rem", "Expected the panel preset ui-x-small role font size to be 0.75rem.");
  assert(fontSizes.size === 5, "Expected the panel preset to expose separate editorial and compact UI font sizes.");
  assert(layout.measure === "30rem", "Expected the panel preset reading measure to scale down to 30rem.");
  assert(layout.sectionSpace === "3rem", "Expected the panel preset section rhythm to scale down to 3rem.");
  assert(layout.sectionSpaceDeep === "6rem", "Expected the panel preset deep section rhythm to scale down to 6rem.");
  assert(layout.gridGapInline === "1rem", "Expected the panel preset inline grid gap token to provide the x-small 16px gutter.");
  assert(layout.gridGapBlock === "1rem", "Expected the panel preset block grid gap token to provide the x-small 16px gap.");
  assert(layout.pageMargin === "1rem", "Expected the panel preset page margin token to provide the x-small 16px margin.");
  assert(components.radius === "0rem", "Expected the panel preset controls to stay square like PVR/Vanilla.");
  assert(components.controlInlinePadding === "0.75rem", "Expected the panel preset control padding to come from the dense components block.");
  assert(components.controlVisualSize === "0.75rem", "Expected the panel preset checkbox/radio/thumb glyphs to use a dedicated 0.75rem visual size.");
  assert(components.fieldGap === "0.25rem", "Expected the panel preset field gap to come from the dense components block.");
  assert(components.panelPaddingInline === "1rem", "Expected the panel preset panel padding to come from the dense components block.");
  assert(components.panelPaddingBlock === "1rem", "Expected the panel preset panel padding to come from the dense components block.");
  assert(components.accordionIndent === "0.75rem", "Expected the panel preset accordion indent to come from the dense components block.");
  assert(components.controlMinBlockSize === "1.75rem", "Expected the panel preset control height to add one more baseline unit of breathing room.");
  assert(components.controlMinBlockSizeDense === "1.5rem", "Expected the panel preset dense control height to add one more baseline unit of breathing room.");

  assert(typeof roles.body.nudgeTop === "string" && css.includes(`--bf-metrics-start-nudge: ${roles.body.nudgeTop};`), "Expected compact list items to expose the panel preset metrics nudge.");
  assert(css.includes("padding-block-start: var(--bf-selected-start-nudge);"), "Expected compact list items to use the selected engine's start nudge.");
  assert(css.includes("--bf-control-visual-size: 0.75rem;"), "Expected the panel preset CSS to expose a dedicated visual control size token.");
  assert(css.includes("block-size: var(--bf-control-visual-size);"), "Expected checkbox/radio/thumb visuals to size from the dedicated control visual token.");
}

function validateDemoContracts(engineSmokeHtml: string, sampleHtml: string, componentShellCss: string, specShellCss: string): void {
  assert(engineSmokeHtml.includes('<body class="bf-theme" data-bf-tone="dark" data-component-capture>'), "Expected engine-smoke.html to dogfood the bf-theme root instead of the older vr-theme alias.");
  assert(engineSmokeHtml.includes('class="bf-engine-metrics bf-span-4"'), "Expected engine-smoke.html to include the metrics runtime contract on the first specimen section.");
  assert(engineSmokeHtml.includes('class="bf-engine-cap bf-span-4"'), "Expected engine-smoke.html to include the cap runtime contract on the second specimen section.");
  assert(!engineSmokeHtml.includes("bf-tier-app"), "Expected engine-smoke.html to stay off the app tier now that app UI follows the zero-nudge spacing contract.");
  assert(!/\bcomponent-demo-/.test(engineSmokeHtml), "Expected engine-smoke.html to avoid component-demo parasite classes.");
  assert(!/\bp-[a-z][a-z0-9_-]*/.test(engineSmokeHtml), "Expected engine-smoke.html to avoid deprecated p-* markup and stay fully bf-* dogfooded.");
  assert(!/\bvr-[a-z][a-z0-9_-]*/.test(engineSmokeHtml), "Expected engine-smoke.html to avoid deprecated vr-* markup and stay fully bf-* dogfooded.");
  assert(!/\bp-[a-z][a-z0-9_-]*/.test(sampleHtml), "Expected brand-layout-ops-sample.html to avoid deprecated p-* markup in the live sample shell.");
  assert(!/\bvr-[a-z][a-z0-9_-]*/.test(sampleHtml), "Expected brand-layout-ops-sample.html to avoid deprecated vr-* markup in the live sample shell.");
  assert(componentShellCss.includes('.brand-layout-ops-sample :where(.bf-panel.is-fill) {'), "Expected the sample-shell CSS to style bf-panel through the bf-only selector.");
  assert(componentShellCss.includes('.brand-layout-ops-sample :where(.bf-slider) {'), "Expected the sample-shell CSS to style bf-slider through the bf-only selector.");
  assert(componentShellCss.includes('.brand-layout-ops-sample :where(.bf-form-help.is-tight),'), "Expected the sample-shell CSS to style bf-form-help through the bf-only selector.");
  assert(!componentShellCss.includes('.p-'), "Expected the sample-shell CSS to omit deprecated p-* selectors.");
  assert(!componentShellCss.includes('--vr-'), "Expected the sample-shell CSS to omit deprecated vr-* variables.");
  assert(specShellCss.includes('[data-spec-shell] {'), "Expected the living-spec shell to expose the data-spec-shell attribute selector for page framing.");
  assert(specShellCss.includes('.pc-grid-guide > * {'), "Expected the living-spec shell to include the grid-guide specimen styling.");
  assert(!specShellCss.includes("[data-spec-card]"), "Expected the living-spec shell to avoid ad hoc data-spec-card selectors.");
  assert(!specShellCss.includes("[data-spec-grid-card]"), "Expected the living-spec shell to avoid ad hoc grid-card selectors.");
  assert(!specShellCss.includes("[data-spec-surface]"), "Expected the living-spec shell to avoid boxed surface wrappers.");
  assert(!specShellCss.includes("[data-spec-home]"), "Expected the living-spec shell to avoid old data-spec-home selectors.");
  assert(!specShellCss.includes("[data-spec-switches]"), "Expected the living-spec shell to avoid old data-spec-switches selectors.");
  assert(!specShellCss.includes("[data-spec-grid-stage]"), "Expected the living-spec shell to avoid old data-spec-grid-stage selectors.");
}

function validateBfOnlyDemoFamily(demoPages: Record<string, string>): void {
  validateBfOnlyDemoPage("tabs.html", demoPages.tabs);
  validateBfOnlyDemoPage("panel-tabs.html", demoPages.panelTabs);
  validateBfOnlyDemoPage("accordion.html", demoPages.accordion);
  validateBfOnlyDemoPage("contextual-menu.html", demoPages.contextualMenu);
  validateBfOnlyDemoPage("tooltip.html", demoPages.tooltip);
  validateBfOnlyDemoPage("list-tree.html", demoPages.listTree);
  validateBfOnlyDemoPage("code-snippet.html", demoPages.codeSnippet);
}

async function main(): Promise<void> {
  const defaultTheme = await readThemeArtifacts(path.resolve("dist"));
  const editorialTier = await readThemeArtifacts(path.resolve("dist/tiers/editorial"));
  const documentationTier = await readThemeArtifacts(path.resolve("dist/tiers/documentation"));
  const appTier = await readThemeArtifacts(path.resolve("dist/tiers/app"));
  const prosePreset = await readThemeArtifacts(path.resolve("dist/presets/prose"));
  const panelPreset = await readThemeArtifacts(path.resolve("dist/presets/panel"));
  const appTierPreset = await readThemeArtifacts(path.resolve("dist/presets/app-tier"));
  const [engineSmokeHtml, sampleHtml, componentShellCss, specShellCss, controlsShellCss, applicationLayoutHtml, tabsHtml, panelTabsHtml, accordionHtml, sideNavigationHtml, contextualMenuHtml, tooltipHtml, listTreeHtml, codeSnippetHtml, demoIndexHtml, demoControlsHtml] = await Promise.all([
    readTextArtifact(path.resolve("demo/components/engine-smoke.html")),
    readTextArtifact(path.resolve("demo/components/brand-layout-ops-sample.html")),
    readTextArtifact(path.resolve("demo/component-shell.css")),
    readTextArtifact(path.resolve("demo/spec-shell.css")),
    readTextArtifact(path.resolve("demo/controls-shell.css")),
    readTextArtifact(path.resolve("demo/components/application-layout.html")),
    readTextArtifact(path.resolve("demo/components/tabs.html")),
    readTextArtifact(path.resolve("demo/components/panel-tabs.html")),
    readTextArtifact(path.resolve("demo/components/accordion.html")),
    readTextArtifact(path.resolve("demo/components/side-navigation.html")),
    readTextArtifact(path.resolve("demo/components/contextual-menu.html")),
    readTextArtifact(path.resolve("demo/components/tooltip.html")),
    readTextArtifact(path.resolve("demo/components/list-tree.html")),
    readTextArtifact(path.resolve("demo/components/code-snippet.html")),
    readTextArtifact(path.resolve("index.html")),
    readTextArtifact(path.resolve("demo/controls.html"))
  ]);

  validateCommonCss(defaultTheme.css);
  validateCommonCss(editorialTier.css);
  validateCommonCss(documentationTier.css);
  validateCommonCss(prosePreset.css);
  validateCommonCss(panelPreset.css);
  validateAppTierCss(appTier.css);
  validateAppTierCss(appTierPreset.css);

  validateDefaultTheme(defaultTheme.tokens, defaultTheme.css);
  validateDefaultTheme(editorialTier.tokens, editorialTier.css);
  validateDocumentationTheme(documentationTier.tokens, documentationTier.css);
  validateAppTierTheme(appTier.tokens, appTier.css);
  validateDefaultTheme(prosePreset.tokens, prosePreset.css);
  validatePanelTheme(panelPreset.tokens, panelPreset.css);
  validateAppTierTheme(appTierPreset.tokens, appTierPreset.css);
  validateDemoContracts(engineSmokeHtml, sampleHtml, componentShellCss, specShellCss);
  validateLivingSpecHome(demoIndexHtml);
  validateLivingSpecControls(demoControlsHtml, controlsShellCss);
  validateAppTierDemoPage("application-layout.html", applicationLayoutHtml);
  validateAppTierDemoPage("side-navigation.html", sideNavigationHtml);
  validateBfOnlyDemoFamily({
    applicationLayout: applicationLayoutHtml,
    tabs: tabsHtml,
    panelTabs: panelTabsHtml,
    accordion: accordionHtml,
    sideNavigation: sideNavigationHtml,
    contextualMenu: contextualMenuHtml,
    tooltip: tooltipHtml,
    listTree: listTreeHtml,
    codeSnippet: codeSnippetHtml
  });

  console.log("Build validation passed.");
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
