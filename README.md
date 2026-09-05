# Baseline Foundry

Lean baseline-aligned design system focused on:

- editorial typescale
- container-owned semantic spacing
- grid primitives
- page and section rhythm
- a small amount of demo/runtime support

This repo is the clean sibling to `portable-vertical-rhythm`.
That older package remains the compatibility line for `design-foundry`.
This repo is the forward-looking line: smaller, more versatile, and centered on baseline, prose flow, and grid rather than broad component parity.

## Workflow Map

- Always-on invariants and cold start: `AGENTS.md`
- Live state and handover: `AGENT-INBOX.md`
- Operational commands and source routing: `docs/agent-index.md`
- Cross-spec order and short backlog: `TODO.md`
- Spec catalog and status: `docs/specs.md`
- Durable architecture: `docs/architecture.md`
- Active feature intent, tasks, and evidence: `specs/<id>-<slug>/`
- Human async notes: `INBOX.md`

Spec Kit packages are the source of truth for feature work. Closed packages move
to `docs/spec-archive/`; Git is the chronological history.

## LLM Efficiency Notes

These habits matter more than prompt cleverness when you are using a coding agent in this repo.

- Pick one model per task. Model switches often invalidate caches and force the tool to reprocess the same context again.
- Keep permanent instructions short. Durable invariants belong in `AGENTS.md`;
  task detail and evidence belong in one active Spec Kit package.
- Keep project memory in the repo, not only in chat, but give each fact one
  owner. Avoid global status, roadmap, and history narratives.
- Prefer markdown, plain text, and lists over complex pages or dense tables when accuracy matters.
- Search in smaller passes instead of one giant query, then verify against the owning file or spec.
- Checkpoint and restart freely. Short resumable sessions are usually cheaper and more reliable than preserving one huge thread.

## Source Of Truth

When sources disagree, this repo follows:

1. Current user direction and the active local spec
2. `.specify/memory/constitution.md`
3. `AGENTS.md` and `docs/architecture.md`
4. Accepted archived local specs
5. External design references catalogued in `docs/specs.md`
6. Public README/API documentation
7. Undocumented local implementation details

Pragma and the Canonical official design system are related products, not BF
authorities. BF's container-owned spacing contract is an explicit local owner
decision recorded in the active spec and constitution.

## Linked Specs

See `docs/specs.md` for the concrete linked spec paths and the legacy/reference boundaries.

## Principles

See `AGENTS.md` and `docs/architecture.md` for the full set. Summary:

- Baseline alignment is non-negotiable.
- Semantic spacing is owned by nested stacks in editorial, documentation, app, and OS.
- Text keeps metric top-nudge and bottom-margin compensation for baseline alignment.
- OS is the fourth first-class built-in tier.
- Grid and layout primitives are small and composable.
- Dogfooding: demos use only `bf-*` classes.

For a longer write-up on empirical nudges, cap-unit alignment, raw metrics, and compensated metrics, see `docs/comparing-baseline-alignment-techniques.md`. Its visual companion lives at `demo/components/engine-illustration.html`.

## Output

Build output includes:

- `dist/styles.css`
- `dist/tokens.json`
- `dist/surfaces.json`
- `dist/experiments/ibm-plex-engine-smoke/styles.css`
- `dist/experiments/ibm-plex-engine-smoke/tokens.json`
- `dist/experiments/ibm-plex-engine-smoke/surfaces.json`
- `dist/tiers/editorial/styles.css`
- `dist/tiers/editorial/tokens.json`
- `dist/tiers/editorial/surfaces.json`
- `dist/tiers/documentation/styles.css`
- `dist/tiers/documentation/tokens.json`
- `dist/tiers/documentation/surfaces.json`
- `dist/tiers/app/styles.css`
- `dist/tiers/app/tokens.json`
- `dist/tiers/app/surfaces.json`
- `dist/tiers/os/styles.css`
- `dist/tiers/os/tokens.json`
- `dist/tiers/os/surfaces.json`
- `dist/presets/prose/styles.css`
- `dist/presets/prose/tokens.json`
- `dist/presets/prose/surfaces.json`
- `dist/presets/app-tier/styles.css`
- `dist/presets/app-tier/tokens.json`
- `dist/presets/app-tier/surfaces.json`
- `dist/index.js`
- `dist/build.js`

## Install

Install the public package from npm:

```bash
npm install baseline-foundry
```

The verified GitHub release artifact remains available as a fallback for
environments that cannot reach the npm registry:

```bash
npm install https://github.com/lyubomir-popov/baseline-foundry/releases/download/v0.1.7/baseline-foundry-0.1.7.tgz
```

Use the attached `.tgz`, not the GitHub source archive: generated `dist/`
artifacts are intentionally absent from Git history and are included in the
package tarball.

The package name stays unscoped so existing imports such as
`baseline-foundry/styles.css` and `baseline-foundry/build` do not change. See
[`docs/publishing.md`](docs/publishing.md) for the publication and downstream
migration contract.

## Repository quick start

Repository development and the public build API are supported on Node.js
22.14 or newer with npm 11.19. The checked-in package metadata is the
authoritative toolchain contract.

```bash
npm install
npm run setup:demo-font
npm run playwright:install
npm run build
npm run test
npm run screenshots:components
npm run demo
```

Release maintainers can validate the immutable publication boundary without
publishing:

```bash
npm run release:preflight:test
npm run release:verify -- --pack-current
```

The trusted workflow, resume procedure, checksum evidence, and private-source
provenance limitation are documented in
[`docs/publishing.md`](docs/publishing.md).

List or build tiers directly with:

```bash
npm run build:theme -- --list-tiers
npm run build:theme -- --tier=os
```

List or build presets directly with:

```bash
npm run build:theme -- --list-presets
npm run build:theme -- --preset=prose
```

While `npm run demo` is running, edits under `config/**/*.json` now rerun `npm run build:theme` automatically and force a full page reload.

`npm run setup:demo-font` downloads the Ubuntu Sans development font plus the IBM Plex Sans variable asset required by the engine-smoke experiment.

Built-in CSS does not emit `@font-face`: consumers own the runtime font URL and
must declare the same Ubuntu Sans variable face measured by BF. The repository
demo declares its downloaded development asset separately. Custom
`buildThemeFromConfig` outputs may still emit the face declared by a
consumer-owned config.

The demo runs at:

- [http://127.0.0.1:4174/](http://127.0.0.1:4174/) — Living spec home
- [http://127.0.0.1:4174/demo/spec/typography.html](http://127.0.0.1:4174/demo/spec/typography.html)
- [http://127.0.0.1:4174/demo/panel.html](http://127.0.0.1:4174/demo/panel.html) — OS tier
- [http://127.0.0.1:4174/demo/components/index.html](http://127.0.0.1:4174/demo/components/index.html) — BF foundations and component primitives
- [http://127.0.0.1:4174/demo/patterns/index.html](http://127.0.0.1:4174/demo/patterns/index.html) — Patterns, site compositions, recipes, layouts, and documented exclusions
- [http://127.0.0.1:4174/demo/components/engine-illustration.html](http://127.0.0.1:4174/demo/components/engine-illustration.html) — Three-way raw / compensated / cap comparison

Standalone grid examples live under `examples/grid/` and share
`grid-examples.css`. Spacing behavior is documented by the living spacing
chapter and verified on the component or pattern that owns each relationship;
the catalog does not expose separate diagnostic spacing pages.

## Component and pattern QA

The repo includes isolated demo pages for visual rhythm and interaction checks.
`demo/components/index.html` catalogs BF foundations and component primitives;
`demo/patterns/index.html` catalogs patterns, site compositions, and layouts while
linking to the same isolated QA routes. The authoritative saved-page inventory
lives in `scripts/component-demo-shared.ts`, so the README does not mirror that
detail list.

All component/spec/control pages now share the same thin page chrome: hamburger page list plus tone, baseline-grid, and tier controls. That chrome is excluded from screenshot comparisons and disabled during Playwright hit-testing so behavior checks interact with the component under test rather than the surrounding shell.

Component QA currently covers:

- Playwright screenshot capture for the saved demo inventory
- baseline verification for baseline-aligned component surfaces across all four built-in tiers and non-tier locked-manifest variants
- behavior verification for pinned-aside resize, drawer overlay, and application-layout interactions
- the narrow-panel regression page so dense controls and media must still fit a tight rail

The grouped overview pages still exist as convenience entry points:

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

Those screenshots power both visual atlases at `demo/components/index.html` and
`demo/patterns/index.html`, so run `npm run screenshots:components` when new
demos are added or the saved preview set changes. Atlas frames use
`object-fit: contain`, so saved previews remain legible when different surfaces
naturally want different capture widths.

The baseline verification report is also written to:

- `tmp/screenshots/components/baseline-report.json`

That report records one entry per verified component surface, not just one per
route. Shared-tier pages are walked through `editorial`, `documentation`,
`app`, and `os`; app-authored pages stay app-only unless they explicitly opt
into a broader tier set.

`npm test` now includes this Playwright baseline check, so once Chromium is installed the grid-alignment gate is part of the normal regression suite.

## Theme Model

The default theme uses Ubuntu Sans Variable and generates metric-driven typography tokens, spacing tokens, layout values, component density tokens, and a published surface manifest. Four first-class tiers plus two legacy preset aliases:

| Tier/Preset | Content cap | Purpose |
|---|---:|---|
| `editorial` | `90rem` | Root default, widest long-form composition |
| `documentation` | `80rem` | Tighter chapter-reading tier |
| `app` | `60rem` | Fluid application chrome with a cap only on explicit `bf-fixed-width` rows |
| `os` | `60rem` | Dense OS-style tier with metric alignment and compact control geometry |

Legacy aliases: `prose` → editorial, `app-tier` → app.

The caps are a non-increasing density progression (`90 >= 80 >= 60 >= 60`).
App `.bf-page` and application grids remain uncapped and fluid; the App/OS
value governs only explicit bounded content. Tier and density are currently one
coupled choice, not independent axes.

Independent surface contract:

- each built-in tier emits a complete scoped token surface instead of inheriting editorial defaults through diffs
- tier choice is a top-level class on any `.bf-theme` container: `.bf-tier-editorial`, `.bf-tier-documentation`, `.bf-tier-app`, `.bf-tier-os`
- multiple containers can coexist side by side under the same stylesheet
- `dist/surfaces.json` stores the runtime tokens and the font-metric artifact that produced each shipped surface — see [docs/surfaces-manifest.md](docs/surfaces-manifest.md) for the full schema, stability guarantees, and consumer recipes
- built-in spacing is sourced from the integrity-pinned Canonical DTCG artifact; the twelve `--spacing-*` properties carry final Canonical values and the temporary `--bf-*` aliases resolve directly to them during the bounded deprecation window; custom themes stay BF-namespaced as documented in [docs/spacing-token-adapter.md](docs/spacing-token-adapter.md)
- the published manifest omits local build-machine config/baseline file paths, so the shipped JSON stays portable
- every tier keeps metric-derived runtime alignment while nested stacks own semantic spacing

Example:

```html
<section class="bf-theme bf-tier-editorial bf-stack is-section">
	<div class="bf-prose bf-stack">
		<h1>Editorial surface</h1>
		<p>Metric-derived nudges stay on.</p>
	</div>
</section>

<section class="bf-theme bf-tier-app bf-stack is-section">
	<div class="bf-prose bf-stack">
		<h1>App surface</h1>
		<p>Metric-derived compensation and container-owned gaps remain active at application density.</p>
	</div>
</section>

<section class="bf-theme bf-tier-os bf-stack is-section">
	<div class="bf-prose bf-stack">
		<h1>OS surface</h1>
		<p>Metrics stay on, but the measure and control geometry compress toward dense system surfaces.</p>
	</div>
</section>
```

Engine choice remains separate: `.bf-engine-metrics` is the default production path, `.bf-engine-cap` is demo-only.

See `config/tiers/` for the four canonical source configs. Compatibility preset names resolve to those same owners rather than duplicate JSON files.

## Public API

Package root exports:

- `initAccordions`
- `toggleAccordionButton`
- `initApplicationLayouts`
- `initBaselineGridToggles`
- `setupBaselineGridToggle`
- `generateBaselineGridOverlayCss`
- `generateBaselineGridThemeOverrideCss`
- `initCodeSnippets`
- `initContextualMenus`
- `initInPageNavigations`
- `initInteractiveFeedback`
- `initNotificationDismissals`
- `initPasswordReveals`
- `initInteractiveTables`
- `initSortableTables`
- `initExpandingTables`
- `initMobileCardTables`
- `initListTree`
- `initPanelDrawers`
- `initRangeControls`
- `setupRangeControl`
- `updateRangeFill`
- `initResizableAsides`
- `initSideNavigations`
- `initTopNavigations`
- `initTabs`
- `initTooltips`
- `tierNames`, `tierDescriptions`, and `isTierName`
- `TierName`, `BuiltInThemeName`, `ThemeSurfaceManifest`, and related public types

Node/build exports:

- `buildThemeFromConfig`
- `buildThemeFromTier`
- `buildThemeFromPreset`
- `deriveBaselineTokensFromConfig`
- `readThemeConfig`

Static assets:

- `baseline-foundry/styles.css`
- `baseline-foundry/tokens.json`
- `baseline-foundry/surfaces.json`
- `baseline-foundry/tiers/editorial.css`
- `baseline-foundry/tiers/editorial.tokens.json`
- `baseline-foundry/tiers/editorial.surfaces.json`
- `baseline-foundry/tiers/documentation.css`
- `baseline-foundry/tiers/documentation.tokens.json`
- `baseline-foundry/tiers/documentation.surfaces.json`
- `baseline-foundry/tiers/app.css`
- `baseline-foundry/tiers/app.tokens.json`
- `baseline-foundry/tiers/app.surfaces.json`
- `baseline-foundry/tiers/os.css`
- `baseline-foundry/tiers/os.tokens.json`
- `baseline-foundry/tiers/os.surfaces.json`
- `baseline-foundry/presets/prose.css`
- `baseline-foundry/presets/prose.tokens.json`
- `baseline-foundry/presets/prose.surfaces.json`
- `baseline-foundry/presets/app-tier.css`
- `baseline-foundry/presets/app-tier.tokens.json`
- `baseline-foundry/presets/app-tier.surfaces.json`
- `baseline-foundry/presets`
- `baseline-foundry/types`

### Entry point guidance

Downstream consumers have two supported ways to load the built-in OS surface, depending on whether they need a neutral shared bundle or an OS-only default surface.

- Use `baseline-foundry/styles.css` as the neutral entrypoint when the consumer wants the shared root bundle and will opt into OS with class switching such as `.bf-theme.bf-tier-os`.
- Use `baseline-foundry/tiers/os.css` only when the consumer wants OS to be the unscoped default surface for that stylesheet import.
- Do not import `baseline-foundry/presets/app-tier.css` just to preload the shared bundle before switching to `bf-tier-os`; that preset remains the legacy app alias, not the neutral OS entrypoint.

Example neutral entrypoint for a downstream such as `a4-generator`:

```html
<link rel="stylesheet" href="baseline-foundry/styles.css" />

<section class="bf-theme bf-tier-os">
	<div class="bf-prose">
		<h1>OS surface</h1>
		<p>The shared root bundle is loaded once, and the container opts into the OS tier explicitly.</p>
	</div>
</section>
```

Example OS-default entrypoint when class switching is not needed:

```html
<link rel="stylesheet" href="baseline-foundry/tiers/os.css" />
```

## Downstream Fonts

The built-in default is Ubuntu Sans Variable, but downstream repos are not locked to it.
Point the build at a downstream theme config and derive fresh nudges from that font's real metrics.

The npm package does not ship BF's development font file and built-in CSS does
not guess a URL for it. A consumer using a built-in tier must serve Ubuntu Sans
Variable and declare one normal variable face covering weights 100 through
800 and stretches 75% through 100%. The manifest's relative
`fontFiles[*].path` records the source asset used for metric generation; it is
not a package runtime URL.

The key rule is simple:

- **do not reuse nudges from a different font**
- **do not switch font-family in CSS without regenerating tokens**
- **derive a fresh `nudgeTop` set for the actual font files that will ship**

### What the downstream config needs

Create a theme JSON that follows the same shape as the tier configs under `config/tiers/`.
The font files are resolved relative to that config file, so a downstream repo can keep its own font assets and still use the same build path.

At minimum, define:

- `baselineUnit`
- `inlineUnitRem`
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
	"inlineUnitRem": 0.25,
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
		"borderWidthRem": 0.0625,
		"radiusRem": 0,
		"inlineInsetFieldUnits": 2,
		"inlineInsetActionUnits": 4,
		"inlineInsetContinuationUnits": 8,
		"markGapInlineUnits": 2,
		"controlVisualSizeRem": 0.75,
		"fieldGapBaselineUnits": 1,
		"panelPaddingInlineUnits": 4,
		"panelPaddingBlockBaselineUnits": 2
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

If a downstream surface bundle should ship multiple named fonts or brand variants in one stylesheet, pass a label for the default surface plus sibling named surfaces:

Baseline Foundry does not ship IBM Plex as a built-in tier or preset. Ubuntu Sans remains the only built-in tier font. For non-Ubuntu downstream bundles, provide your own config file and treat `config/experiments/ibm-plex-engine-smoke.json` as a reference/example rather than as a published preset.

```ts
await buildThemeFromConfig("config/brand-ibm-plex-theme.json", {
	distDir: "generated/foundry/smoke",
	baselineDir: ".generated/baseline/smoke",
	surfaceLabel: "IBM Plex Sans",
	additionalSurfaces: [
		{
			name: "ubuntu-smoke",
			label: "Ubuntu Sans",
			className: "bf-surface-ubuntu-smoke",
			configPath: "config/ubuntu-foundry-theme.json"
		}
	]
});
```

That does three things:

1. writes the reduced baseline-generator input JSON
2. runs `@lyubomir-popov/baseline-nudge-generator`
3. emits `tokens.json`, `styles.css`, and `surfaces.json` for the downstream font or surface set

`surfaces.json` will then expose each named surface's runtime tokens, stored metrics, and optional UI label under one manifest-backed bundle.

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

The generated `tokens.json` then contains the derived metric nudges per element, including `nudgeTop`, which `baseline-foundry` turns into the scoped `--bf-<role>-nudge-start` / `--bf-<role>-nudge-end` variables inside each emitted surface.

### Practical downstream advice

- Regenerate tokens whenever the downstream font files change.
- Regenerate tokens whenever font size, line-height, or baseline unit changes.
- Keep at least one non-`runtimeOnly` font file in `fontFiles`; that is the file the nudge generator reads for metrics.
- If a downstream repo ships multiple runtime faces, mark only the non-metric extras as `runtimeOnly`.
- Keep metrics as the default engine for production fonts; `.bf-engine-cap` remains an opt-in fallback, not the default path.

## Demo

The demo surface at `/` shows editorial prose rhythm, tier switching, dark
theme, grid, spacing, and component specimens. BF primitives are indexed at
`demo/components/index.html`; patterns, site compositions, and layouts are
indexed separately at `demo/patterns/index.html`. Their isolated test routes
remain under `demo/components/`, and the authoritative saved-page inventory is
in `scripts/component-demo-shared.ts`.

## Start Here

If you resume this repo in a new chat, read:

1. `AGENTS.md`
2. `AGENT-INBOX.md`
3. `docs/agent-index.md`
4. `docs/specs.md`
