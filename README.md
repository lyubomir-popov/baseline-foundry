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
- built-in `editorial`, `documentation`, and `app` tier outputs, plus the secondary `panel` preset and legacy `prose` / `app-tier` aliases
- JSON-driven component density tokens for control sizing, panel padding, and field spacing
- prose defaults for headings, paragraphs, lists, blockquotes, and rules
- prose flow boundaries that keep baseline compensation on the last child
- strip rhythm that lives on the bottom edge rather than adding mirrored top spacing
- section, strip, stack, cluster, fixed-width, and stage-shell layout primitives
- container-query grid primitives with a `4 / 8 / 16` column structure, power-of-2 spans, Canonical `620px` / `1681px` container thresholds for column counts, and Canonical viewport-controlled gutters/margins (`16px`, `24px`, `32px`)
- a dense `bf-grid` control recipe for inspector rows (`bf-grid bf-grid--controls` with `bf-grid__item--control`, `bf-grid__item--control-pair`, and stacked `bf-slider` pairs), rather than a second standalone grid primitive
- an overlay drawer shell mode for temporary inspectors (`l-aside.is-overlay`, backdrop, `bf-panel-toggle`, and Canonical small/medium/large size modifiers)
- a resizable pinned-aside shell mode for desktop inspectors (`l-aside.is-pinned`, `l-application__aside-resize-handle`, and `initResizableAsides()`)
- an application-layout shell that adds a top navigation bar and collapsible left navigation while still composing with the existing drawer and pinned-aside primitives
- dense panel patterns for equal-width tabs, selectable radio rows, style/mapping option cards, tight helper text, compact color inputs, inline option strips, and dense action rows
- a fill-height panel helper for drawer and pinned inspector shells
- baseline grid inspection utility

It intentionally does not try to be a full component framework yet.

## Output

Build output includes:

- `dist/styles.css`
- `dist/tokens.json`
- `dist/tiers/editorial/styles.css`
- `dist/tiers/editorial/tokens.json`
- `dist/tiers/documentation/styles.css`
- `dist/tiers/documentation/tokens.json`
- `dist/tiers/app/styles.css`
- `dist/tiers/app/tokens.json`
- `dist/presets/prose/styles.css`
- `dist/presets/prose/tokens.json`
- `dist/presets/panel/styles.css`
- `dist/presets/panel/tokens.json`
- `dist/presets/app-tier/styles.css`
- `dist/presets/app-tier/tokens.json`
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

List or build tiers directly with:

```bash
npm run build:theme -- --list-tiers
npm run build:theme -- --tier=app
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
- [http://127.0.0.1:4174/demo/spec/typography.html](http://127.0.0.1:4174/demo/spec/typography.html)
- [http://127.0.0.1:4174/demo/panel.html](http://127.0.0.1:4174/demo/panel.html)
- [http://127.0.0.1:4174/demo/components/index.html](http://127.0.0.1:4174/demo/components/index.html)

## Component QA

The repo also includes isolated component demo pages for visual rhythm checks.
The atlas at `demo/components/index.html` is now a visual index of the real baseline-gated files: each saved component gets its own HTML page, Playwright captures a screenshot for it, and the atlas turns those captures into linked preview tiles so the current surface can be scanned at a glance. Atomic controls are now captured from their fitted specimen footprint rather than from a full padded demo window, while layout and shell pages still use a wider capture profile.

All component demos now:

- default to the dark theme
- load with the baseline grid visible by default
- let you toggle the grid off page-by-page when you want a cleaner read
- keep the shared demo shell minimal instead of wrapping every specimen in card chrome
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
- `demo/components/application-layout.html`
- `demo/components/stage-shell.html`
- `demo/components/drawer-panel.html`
- `demo/components/button.html`
- `demo/components/actions.html`
- `demo/components/text-input.html`
- `demo/components/color-input.html`
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
- `demo/components/panel-tabs.html`
- `demo/components/accordion.html`
- `demo/components/engine-smoke.html`
- `demo/components/modal.html`
- `demo/components/choice-row.html`
- `demo/components/inline-options.html`
- `demo/components/segmented-control.html`
- `demo/components/breadcrumbs.html`
- `demo/components/pagination.html`
- `demo/components/contextual-menu.html`
- `demo/components/tooltip.html`
- `demo/components/divider.html`
- `demo/components/cards.html`
- `demo/components/option-card.html`
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

Those screenshots also power the visual atlas at `demo/components/index.html`, so run `npm run screenshots:components` when new demos are added or the saved preview set changes. The atlas frames now use `object-fit: contain`, so the saved previews can stay legible even when different components naturally want different capture widths.

The baseline verification report is also written to:

- `tmp/screenshots/components/baseline-report.json`

`npm test` now includes this Playwright baseline check, so once Chromium is installed the grid-alignment gate is part of the normal regression suite.

## Theme Model

The default theme uses IBM Plex Sans Variable Roman as the generated metric source and exposes:

- typography roles
- spacing tokens derived from the baseline unit
- layout values for section rhythm, measure, and x-small base grid spacing, with the Canonical grid spec promoting gutters and outer margins responsively at the viewport level
- component values for border width, control sizes, visual control size, field gaps, panel padding, and accordion indent
- runtime font-face metadata for the IBM Plex Sans variable files

The build now ships three first-class tier outputs plus one secondary preset:

- `editorial`: the root default and the widest IBM Plex long-form composition tier
- `documentation`: a tighter IBM Plex chapter-reading tier for reference pages and living-spec chapters
- `app`: a Canonical-facing Ubuntu Sans application tier with light shell chrome and app-surface control overrides
- `panel`: a compact `0.75rem` body preset for dense control surfaces and `brand-layout-ops` pressure testing

Legacy preset aliases remain for compatibility:

- `prose` points to the `editorial` tier output
- `app-tier` points to the `app` tier output

The runtime contract is now split more explicitly:

- tier choice is a top-level concern (`.bf-tier-editorial`, `.bf-tier-documentation`, `.bf-tier-app`)
- baseline engine choice stays separate (`.bf-engine-metrics`, `.bf-engine-cap`)

The current rollout rule is conservative:

- metrics-derived nudges remain the trusted default
- the cap-unit engine is being added as an opt-in path
- the baseline screenshot gate decides whether the cap path is good enough, not taste or implementation neatness

The architectural split is also explicit now:

- editorial and any other baseline-aligned surfaces keep element-owned compensation
- app tier follows the Canonical simplification: zero selected nudges, zero semantic spacing, and container-owned gaps

That contract now reaches the first compat tranche too. Baseline-aligned text-entry and action controls such as inputs, file controls, buttons, tabs, segmented controls, pagination, search/filter controls, tooltip text, accordion tabs, and the panel toggle still read role-level selected nudge variables from the chosen engine. App-tier surfaces bypass those nudges through the `.bf-tier-app` override.

Some row-style surfaces still sit outside that primitive on purpose. Tables, list-tree rows, and chips are currently left on centered row math because the screenshot gate showed they are not the same problem as text-entry controls.

The current parity order is deliberate:

- make the shared component surface trustworthy under `panel` first
- then bring the same components to parity under the `editorial` tier
- then decide whether preset switching should stay as stylesheet swapping or become scoped runtime tier switching

Typography utilities are generated from `roles` in the active tier config. The built-in tier sources live under `config/tiers/`. If a role like `lead`, `eyebrow`, or `meta` is absent, the generated CSS will not create a fallback class for it. If extra roles are added, matching `.bf-<role>` utilities are emitted automatically.

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

The built-in app tier is intentionally separate from the dense panel line. It exists so the application shell and side-navigation demos can be compared against the current Canonical/Vanilla application direction instead of inheriting the darker inspector preset:

- Ubuntu Sans from `config/tiers/app.json`
- `0.875rem` body text with the Canonical app-tier heading pairings
- a light shell surface with white nav, main, and aside panels
- body-style control typography and lighter Canonical-facing application chrome inside `.bf-tier-app`
- a dedicated panel shadow so application surfaces no longer read like the dense dark inspector preset

The docs surface is now tier-first too. `/demo/` is the living-spec home, chapter pages live under `/demo/spec/`, and the selector swaps generated tier CSS/tokens live instead of bouncing between unrelated preset demos.

See:

- `config/tiers/editorial.json`
- `config/tiers/documentation.json`
- `config/tiers/app.json`
- `config/presets/panel.json`

## Public API

Browser-safe exports:

- `initBaselineGridToggles`
- `initCodeSnippets`
- `initContextualMenus`
- `initListTree`
- `initApplicationLayouts`
- `initPanelDrawers`
- `initResizableAsides`
- `initTooltips`
- `setupBaselineGridToggle`

Node/build exports:

- `buildThemeFromConfig`
- `buildThemeFromTier`
- `buildThemeFromPreset`
- `deriveBaselineTokensFromConfig`
- `readThemeConfig`

Static assets:

- `baseline-foundry/styles.css`
- `baseline-foundry/tokens.json`
- `baseline-foundry/tiers/editorial.css`
- `baseline-foundry/tiers/editorial.tokens.json`
- `baseline-foundry/tiers/documentation.css`
- `baseline-foundry/tiers/documentation.tokens.json`
- `baseline-foundry/tiers/app.css`
- `baseline-foundry/tiers/app.tokens.json`
- `baseline-foundry/presets/prose.css`
- `baseline-foundry/presets/prose.tokens.json`
- `baseline-foundry/presets/panel.css`
- `baseline-foundry/presets/panel.tokens.json`
- `baseline-foundry/presets/app-tier.css`
- `baseline-foundry/presets/app-tier.tokens.json`

## Downstream Fonts

The built-in defaults stay IBM Plex Sans-based, but downstream repos are not locked to Plex.
If a consumer such as `brand-layout-ops` needs Ubuntu Sans or another family, point the build at a downstream theme config and derive fresh nudges from that font's real metrics.

The key rule is simple:

- **do not reuse Plex nudges with a different font**
- **do not switch font-family in CSS without regenerating tokens**
- **derive a fresh `nudgeTop` set for the actual font files that will ship**

### What the downstream config needs

Create a theme JSON that follows the same shape as the tier configs under `config/tiers/`.
The font files are resolved relative to that config file, so a downstream repo can keep its own font assets and still use the same build path.

At minimum, define:

- `baselineUnit`
- `fontFiles`
- `fontStacks`
- `elements`
- `roles`
- `layout`
- `components`

Example sketch for a downstream Ubuntu Sans theme:

```json
{
	"baselineUnit": 0.25,
	"fontFiles": [
		{
			"family": "ubuntu-sans",
			"path": "../apps/overlay-preview/public/assets/fonts/UbuntuSans-Regular.ttf",
			"cssFamily": "Ubuntu Sans",
			"fontStyle": "normal",
			"fontWeight": "100 800",
			"fontDisplay": "swap"
		}
	],
	"fontStacks": {
		"ubuntu-sans": "\"Ubuntu Sans\", \"Ubuntu\", system-ui, sans-serif"
	},
	"elements": [
		{
			"identifier": "body",
			"fontSize": 0.75,
			"lineHeight": 4,
			"spaceAfter": 1,
			"fontFamily": "ubuntu-sans",
			"fontWeight": 400,
			"fontStyle": "normal"
		}
	],
	"roles": {
		"body": "body"
	},
	"layout": {
		"contentMaxWidthRem": 90,
		"contentPaddingInlineRem": 1,
		"measureRem": 40,
		"sectionSpaceBaselineUnits": 8,
		"sectionSpaceDeepBaselineUnits": 16,
		"stripSpaceBaselineUnits": 8,
		"gridGapInlineBaselineUnits": 2,
		"gridGapBlockBaselineUnits": 2,
		"pageMarginBaselineUnits": 2
	},
	"components": {
		"borderWidthPx": 1,
		"radiusRem": 0,
		"controlInlinePaddingRem": 1,
		"controlVisualSizeRem": 0.75,
		"fieldGapBaselineUnits": 1,
		"panelPaddingInlineBaselineUnits": 2,
		"panelPaddingBlockBaselineUnits": 2,
		"accordionIndentBaselineUnits": 3,
		"controlMinBlockSizeBaselineUnits": 5,
		"controlMinBlockSizeDenseBaselineUnits": 4
	}
}
```

### Generate full downstream CSS and tokens

Use the Node/build subpath so the downstream repo does not need to duplicate any build logic:

```ts
import { buildThemeFromConfig } from "baseline-foundry/build";

await buildThemeFromConfig("config/ubuntu-foundry-theme.json", {
	distDir: "generated/foundry/ubuntu",
	baselineDir: ".generated/baseline/ubuntu"
});
```

That does three things:

1. writes the reduced baseline-generator input JSON
2. runs `@lyubomir-popov/baseline-nudge-generator`
3. emits `tokens.json` and `styles.css` for the downstream font

### Derive nudges only

If the downstream repo wants the font metrics and `nudgeTop` values but plans to own CSS generation itself, use `deriveBaselineTokensFromConfig`:

```ts
import { deriveBaselineTokensFromConfig } from "baseline-foundry/build";

const result = await deriveBaselineTokensFromConfig("config/ubuntu-foundry-theme.json", {
	baselineDir: ".generated/baseline/ubuntu"
});

console.log(result.tokens.elements.body.nudgeTop);
console.log(result.baselineConfigPath);
console.log(result.baselineTokensPath);
```

### Direct utility usage

`baseline-foundry` uses `@lyubomir-popov/baseline-nudge-generator` under the hood.
The reduced config passed to that utility contains only:

- `baselineUnit`
- `fontFiles` with build-time font paths
- `elements` with `identifier`, `fontSize`, `lineHeight`, `spaceAfter`, `fontFamily`, `fontWeight`, and `fontStyle`

Equivalent direct usage looks like this:

```ts
import { generateFromConfig } from "@lyubomir-popov/baseline-nudge-generator";

await generateFromConfig(".generated/baseline/ubuntu/ubuntu-foundry-theme.baseline.json", ".generated/baseline/ubuntu");
```

The generated `tokens.json` then contains the derived metric nudges per element, including `nudgeTop`, which `baseline-foundry` turns into `--bf-metrics-start-nudge`.

### Practical downstream advice

- Regenerate tokens whenever the downstream font files change.
- Regenerate tokens whenever font size, line-height, or baseline unit changes.
- Keep at least one non-`runtimeOnly` font file in `fontFiles`; that is the file the nudge generator reads for metrics.
- If a downstream repo ships multiple runtime faces, mark only the non-metric extras as `runtimeOnly`.
- Keep metrics as the default engine for production fonts; `.bf-engine-cap` remains an opt-in fallback, not the default path.

## Demo

The demo shows:

- editorial prose rhythm
- the tier-switched living-spec home at `/demo/`, plus the compact panel preset as a secondary demo entry point
- the dark theme applied at the core token layer instead of only through the compat layer
- flow-boundary handling for prose
- section and strip spacing
- fixed-width layout
- stage-shell centering for bounded preview areas
- stack and cluster primitives
- responsive container-query grid with stricter power-of-2 spans and Canonical thresholds
- the generated tokens loaded live from `dist/tokens.json`
- a linked component atlas for isolated screenshot-based inspection

The component demos now also include two realistic pressure-test surfaces:

- a `brand-layout-ops`-style panel composition using the compact `panel` preset
- a future portfolio/editorial composition

There is also a dedicated overlay drawer-panel page in `demo/components/drawer-panel.html`. It keeps the temporary inspector mode honest: the drawer must sit over the stage rather than resizing it, and its header, controls, fields, and actions still have to pass the same baseline gate as the rest of the panel surface.

There is also a dedicated narrow-panel regression page in `demo/components/narrow-panel.html`. It keeps a deliberately tight rail in the browser gate so text inputs, selects, slider pairs, search wrappers, and a video specimen cannot quietly overflow their container.

There is also a dedicated dense parameter-matrix regression page in `demo/components/parameter-matrix.html`. It protects the `bf-grid bf-grid--controls` recipe plus stacked `bf-slider` pattern so inspector rows stay baseline-aligned inside the same `4 / 8 / 16` grid model as the rest of the package.

There is also a dedicated baseline-engine smoke page in `demo/components/engine-smoke.html`. It renders the same compact baseline-aligned control slice twice, once under `.bf-engine-metrics` and once under `.bf-engine-cap`, so the cap path is judged against the same text input, select, button, and accordion specimens instead of being trusted by abstraction.

There is also a dedicated code-snippet regression page in `demo/components/code-snippet.html`. It keeps copyable command blocks, stacked headers, and numbered code lines inside the same baseline gate as the rest of the dense panel surface.

There is also a read-only `brand-layout-ops` shell sample page in `demo/components/brand-layout-ops-sample.html`, copied from the downstream app's stage-plus-inspector structure so layout work can be compared here without editing that repo. The automated gate treats that page as a shell-level reference, while the dedicated `controls` and `surfaces-navigation` pages remain the authoritative low-level verification surfaces for dense fields, buttons, tabs, accordion tabs, overlays, card surfaces, navigation-adjacent controls, switches, file input, and validation states.

The atlas page at `demo/components/index.html` is now the main visual index for everything shipped so far, with direct links to every saved per-component baseline page.

## Start Here

If you resume this repo in a new chat, read:

1. `llm-handoff-context.md`
2. `docs/rebuild-plan.md`
3. `.github/agents/agent.md`
