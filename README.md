# Baseline Foundry

Lean baseline-aligned design system focused on:

- editorial typescale
- element-owned spacing
- grid primitives
- page and section rhythm
- a small amount of demo/runtime support

This repo is the clean sibling to `portable-vertical-rhythm`.
That older package remains the compatibility line for `brand-layout-ops`.
This repo is the forward-looking line: smaller, more versatile, and centered on baseline, prose flow, and grid rather than broad component parity.

## Working Name

`baseline-foundry` is the working name for the new system.

Why this name:

- it emphasizes baseline rhythm as the core invariant
- it feels broader than a typography-only package
- it still leaves room for grid and future layout primitives

## Principles

- Baseline alignment is non-negotiable.
- Editorial spacing is element-owned.
- Grid and layout primitives should be small and composable.
- Compatibility layers are optional future adapters, not the center of the system.
- React support, if added later, should grow from canonical primitives instead of mirroring legacy markup.

## Current Scope

The package currently focuses on:

- metric-driven typography tokens
- IBM Plex Sans-based editorial typescale
- built-in `prose` and `panel` defaults
- JSON-driven component density tokens for control sizing, panel padding, and field spacing
- prose defaults for headings, paragraphs, lists, blockquotes, and rules
- prose flow boundaries that keep baseline compensation on the last child
- strip rhythm that lives on the bottom edge rather than adding mirrored top spacing
- section, strip, stack, cluster, and fixed-width layout primitives
- container-query grid primitives with a `4 / 8 / 16` column structure, power-of-2 spans, and Canonical `620px` / `1681px` column-count thresholds
- a compact compatibility control-matrix surface for dense inspector rows (`grid-row`, `col-*`, and `slider-pair--stacked`), while `bf-grid` remains the canonical page/layout grid
- an overlay drawer-panel shell mode for temporary inspectors (`l-aside.is-overlay`, backdrop, and `p-panel__toggle`)
- a resizable pinned-aside shell mode for desktop inspectors (`l-aside.is-pinned`, `l-application__aside-resize-handle`, and `initResizableAsides()`)
- baseline grid inspection utility

It intentionally does not try to be a full component framework yet.

## Output

Build output includes:

- `dist/styles.css`
- `dist/tokens.json`
- `dist/presets/prose/styles.css`
- `dist/presets/prose/tokens.json`
- `dist/presets/panel/styles.css`
- `dist/presets/panel/tokens.json`
- `dist/index.js`
- `dist/build.js`

## Quick Start

```bash
npm install
npm run setup:demo-font
npm run build
npm run test
npm run playwright:install
npm run screenshots:components
npm run demo
```

List or build presets directly with:

```bash
npm run build:theme -- --list-presets
npm run build:theme -- --preset=panel
```

`npm run setup:demo-font` downloads the official IBM Plex Sans variable Roman and Italic `.woff` files from IBM's upstream repo.

The generated `dist/styles.css` also emits the matching `@font-face` rules, so the demo and downstream consumers can actually render Plex without adding a second manual font-loader step.

The demo runs at:

- [http://127.0.0.1:4174/demo/](http://127.0.0.1:4174/demo/)
- [http://127.0.0.1:4174/demo/panel.html](http://127.0.0.1:4174/demo/panel.html)

## Component QA

The repo also includes isolated component demo pages for visual rhythm checks.
The atlas at `demo/components/index.html` is now a plain index of the real baseline-gated files: each saved component gets its own HTML page so it can be checked in isolation instead of being buried inside one grouped controls page.

All component demos now:

- default to the dark theme
- load with the baseline grid hidden by default
- let you toggle the grid on page-by-page for inspection
- use real `h5` section labels instead of demo-local kicker styling
- keep a dedicated narrow-panel regression page in the automated gate so dense controls and media must still fit a tight rail
- share a browser behavior check for the pinned-aside resize flow so the handle, persistence, and keyboard controls stay real

The current baseline-gated demo pages are:

- `demo/components/index.html`
- `demo/components/typography.html`
- `demo/components/prose.html`
- `demo/components/layout.html`
- `demo/components/grid.html`
- `demo/components/application-shell.html`
- `demo/components/drawer-panel.html`
- `demo/components/button.html`
- `demo/components/text-input.html`
- `demo/components/select.html`
- `demo/components/checkbox.html`
- `demo/components/radio.html`
- `demo/components/range.html`
- `demo/components/file-input.html`
- `demo/components/validation.html`
- `demo/components/switch.html`
- `demo/components/chip.html`
- `demo/components/badge.html`
- `demo/components/status-label.html`
- `demo/components/table.html`
- `demo/components/search-box.html`
- `demo/components/search-and-filter.html`
- `demo/components/code-snippet.html`
- `demo/components/list-tree.html`
- `demo/components/tabs.html`
- `demo/components/accordion.html`
- `demo/components/modal.html`
- `demo/components/segmented-control.html`
- `demo/components/breadcrumbs.html`
- `demo/components/pagination.html`
- `demo/components/contextual-menu.html`
- `demo/components/tooltip.html`
- `demo/components/divider.html`
- `demo/components/cards.html`
- `demo/components/brand-layout-ops-sample.html`
- `demo/components/panel-pressure.html`
- `demo/components/narrow-panel.html`
- `demo/components/parameter-matrix.html`
- `demo/components/editorial-pressure.html`

The older grouped pages still exist as convenience overviews:

- `demo/components/controls.html`
- `demo/components/surfaces-navigation.html`

Install Playwright once with:

```bash
npm run playwright:install
```

Then capture the current component screenshots with:

```bash
npm run screenshots:components
```

Run the browser-enforced baseline verification with:

```bash
npm run verify:components
```

Run the browser-enforced resize behavior verification with:

```bash
npm run verify:behavior
```

Or do both in one pass:

```bash
npm run qa:components
```

The screenshots and manifest are written to:

- `tmp/screenshots/components/`

The baseline verification report is also written to:

- `tmp/screenshots/components/baseline-report.json`

`npm test` now includes this Playwright baseline check, so once Chromium is installed the grid-alignment gate is part of the normal regression suite.

## Theme Model

The default theme uses IBM Plex Sans Variable Roman as the generated metric source and exposes:

- typography roles
- spacing tokens derived from the baseline unit
- layout values for section rhythm, measure, outer margins, and grid gaps
- component values for border width, control sizes, visual control size, field gaps, panel padding, and accordion indent
- runtime font-face metadata for the IBM Plex Sans variable files

The build ships two first-class defaults:

- `prose`: the root default, aimed at editorial and portfolio-style composition
- `panel`: a compact `0.75rem` body preset for dense control surfaces and `brand-layout-ops` pressure testing

Typography utilities are generated from `roles` in `config/foundation-theme.json`. If a role like `lead`, `eyebrow`, or `meta` is absent, the generated CSS will not create a fallback class for it. If extra roles are added, matching `.bf-<role>` utilities are emitted automatically.

The default editorial preset uses three size tiers overall:

- `h1/h2` at the large size with a 200-weight drop between them
- `h3/h4` at the middle size with the same paired-weight logic
- `body/h6/h5` at the base size, with `h6` bold and `h5` bold uppercase with tracking

The intended discipline is to use only two font sizes on a page unless the content truly needs the third.

The compact panel preset preserves the same hierarchy logic, but scales the system down proportionally and snaps the adjusted line heights back to the baseline grid:

- `body/h6/h5` at `0.75rem`
- `h3/h4` at `1.125rem`
- `h1/h2` at `1.96875rem`

Its dense controls now come from the preset JSON as well, rather than from hardcoded compat CSS:

- square corners
- `1.75rem` default control height
- `1.5rem` dense control height
- `0.75rem` visual control size for checkbox/radio glyphs and slider thumbs
- `1rem` panel padding
- `0.25rem` field gap
- flatter bottom-border field styling closer to the established Vanilla / `portable-vertical-rhythm` direction

See:

- `config/foundation-theme.json`
- `config/presets/panel.json`

## Public API

Browser-safe exports:

- `initBaselineGridToggles`
- `initCodeSnippets`
- `initContextualMenus`
- `initListTree`
- `initPanelDrawers`
- `initResizableAsides`
- `initTooltips`
- `setupBaselineGridToggle`

Node/build exports:

- `buildThemeFromConfig`
- `buildThemeFromPreset`
- `readThemeConfig`

Static assets:

- `baseline-foundry/styles.css`
- `baseline-foundry/tokens.json`
- `baseline-foundry/presets/prose.css`
- `baseline-foundry/presets/prose.tokens.json`
- `baseline-foundry/presets/panel.css`
- `baseline-foundry/presets/panel.tokens.json`

## Demo

The demo shows:

- editorial prose rhythm
- the prose default and compact panel default as separate demo entry points
- the dark theme applied at the core token layer instead of only through the compat layer
- flow-boundary handling for prose
- section and strip spacing
- fixed-width layout
- stack and cluster primitives
- responsive container-query grid with stricter power-of-2 spans and Canonical thresholds
- the generated tokens loaded live from `dist/tokens.json`
- a linked component-demo index for isolated screenshot-based inspection

The component demos now also include two realistic pressure-test surfaces:

- a `brand-layout-ops`-style panel composition using the compact `panel` preset
- a future portfolio/editorial composition

There is also a dedicated overlay drawer-panel page in `demo/components/drawer-panel.html`. It keeps the temporary inspector mode honest: the drawer must sit over the stage rather than resizing it, and its header, controls, fields, and actions still have to pass the same baseline gate as the rest of the panel surface.

There is also a dedicated narrow-panel regression page in `demo/components/narrow-panel.html`. It keeps a deliberately tight rail in the browser gate so text inputs, selects, slider pairs, search wrappers, and a video specimen cannot quietly overflow their container.

There is also a dedicated dense parameter-matrix regression page in `demo/components/parameter-matrix.html`. It protects the downstream `grid-row` / `col-*` / `slider-pair--stacked` control pattern so inspector rows stay baseline-aligned and do not collapse back into the broad page-grid behavior.

There is also a dedicated code-snippet regression page in `demo/components/code-snippet.html`. It keeps copyable command blocks, stacked headers, and numbered code lines inside the same baseline gate as the rest of the dense panel surface.

There is also a read-only `brand-layout-ops` shell sample page in `demo/components/brand-layout-ops-sample.html`, copied from the downstream app's stage-plus-inspector structure so layout work can be compared here without editing that repo. The automated gate treats that page as a shell-level reference, while the dedicated `controls` and `surfaces-navigation` pages remain the authoritative low-level verification surfaces for dense fields, buttons, tabs, accordion tabs, overlays, card surfaces, navigation-adjacent controls, switches, file input, and validation states.

The atlas page at `demo/components/index.html` is now the main visual index for everything shipped so far, with direct links to every saved per-component baseline page.

## Start Here

If you resume this repo in a new chat, read:

1. `llm-handoff-context.md`
2. `docs/rebuild-plan.md`
3. `AGENTS.md`
