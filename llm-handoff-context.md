# LLM Handoff Context

## Repo orientation

| Role | Path |
|------|------|
| Primary | `C:\Users\lyubo\work\repos\baseline-foundry` |
| Reference compatibility package | `C:\Users\lyubo\work\repos\portable-vertical-rhythm` |
| Canonical design spec reference | `C:\Users\lyubo\work\repos\canonical-specs` |
| Type-scale reference | `C:\Users\lyubo\work\repos\docs-typescale` |

## Quick start

```bash
npm install
npm run setup:demo-font
npm run playwright:install
npm run build
npm run test
npm run demo
```

Demo URL:

- `http://127.0.0.1:4174/demo/`
- `http://127.0.0.1:4174/demo/panel.html`

## Current state (updated 2026-03-30)

This repo is the clean sibling to `portable-vertical-rhythm`. It keeps the metric-driven baseline pipeline but narrows the scope to typography, editorial flow, spacing, and grid primitives. The root build stays IBM Plex Sans-based and editorial-first: prose flow is element-owned, strips/rules keep the tighter spacing-spec rhythm, the grid follows the Canonical `4 / 8 / 16` structure with tier-aware gutters, and dense inspector rows ride `bf-grid bf-grid--controls` instead of a separate control-grid primitive. Metrics-derived nudges remain the default only for baseline-aligned surfaces, `.bf-engine-cap` stays opt-in, and downstream repos can now generate fresh CSS/tokens from their own font files through `baseline-foundry/build`.

`baseline-foundry` is now structured around first-class tier configs and outputs. The canonical JSON sources live under `config/tiers/` for `editorial`, `documentation`, and `app`; the build emits matching outputs under `dist/tiers/`, while the old `prose` and `app-tier` preset paths remain as compatibility aliases and `panel` stays the secondary dense-surface preset. The app tier is still the simplified application line: container-owned spacing, zero semantic spacing, and zero selected nudges under `.bf-tier-app`. The `application-layout` and `side-navigation` demos remain the parity surfaces for that line, while `engine-smoke.html` stays the baseline-engine comparison surface for compact baseline-aligned controls.

The top-level `/demo/` route is now the primary screenshot workspace: the index keeps only a simple light/dark switch, a real `bf-switch` baseline-grid toggle, and an editorial/app tier selector at the top, then shows one page of type, spacing, and grid specimens built from lorem ipsum and a small number of real controls. The older intro/status/token-snapshot copy has been removed from the home page, the last boxed surface wrapper is gone, and the home specimen shell now stays off `bf-page` so the wide grid example can actually grow past the `1681px` 16-column threshold while prose remains measured through `bf-prose`. A separate top-level `/demo/controls.html` now reuses the same tier/tone/baseline runtime through `demo/spec-runtime.js` and exposes a single large controls gallery for fields, toggles, navigation, menus, tooltips, and modal framing without pushing that weight back onto the home page. The old temporary Vanilla comparison harness has been promoted into `npm run compare:controls`, and a second pass now lives at `npm run compare:inline-surfaces` for panel-preset chips, badges, and status labels. That compact inline family now routes through dedicated compact UI roles (`ui-heading`, `ui-small`, `ui-small-caps`, and `ui-x-small`) plus Vanilla-style padding/min-width math in `src/css-components.ts`, so chips, badges, status labels, breadcrumbs, helper text, filter headings, and similar dense surfaces no longer borrow body/h5 roles opportunistically. The shared component chrome and atlas no longer rely on `component-demo-*` / `component-atlas*` classes, and the emitted runtime, demos, and QA scripts now dogfood the bf-only surface: legacy `p-*`, `vr-theme`, and `--vr-*` selector/variable aliases are gone from shipped CSS and active verification. Core light/dark theme fallbacks now map directly to Vanilla semantic tokens from `_settings_colors.scss` through a single typed source in `src/vanilla-theme-colors.ts`: default light stays white/gray/black instead of drifting toward the paper palette, link and focus tokens are distinct, accent stays separate from links, neutral/action color tokens now match Vanilla's full CSS-variable surface, and the app tier no longer carries its own parallel link/focus colors. The documentation tier remains generated but is intentionally deprioritized on the main selector for now. Visual QA still runs through isolated component demos, atlas captures, baseline verification for baseline-aligned surfaces, app-tier overflow/build checks, drawer/resize behavior checks, and the reusable Vanilla comparison harnesses; `npm run compare:controls` still reports zero-delta switch/tick alignment, `npm test` is green after `scripts/validate-build.ts` and the component baseline verifier were aligned to the expanded compact-role surface, and `npm run compare:inline-surfaces` now reports truthful current-state findings. Chips match Vanilla side insets and small-caps lead/value typography, nested chip-badge spacing matches, status labels match the x-small contract, and only a small residual standalone badge width delta remains (`15.2px` vs `16px`). The next follow-up is to keep simplifying the remaining chapter pages to match the new index direction, remove any remaining app-tier baseline assumptions that still leak through older overview pages, decide whether that residual badge delta deserves one more pass, and evaluate whether Ubuntu Sans Variable should replace IBM Plex as the default non-panel font line.

## Current sprint TODO

- [x] Finish the initial lean public surface and verify the new build only ships typography, spacing, grid, and baseline utilities
- [x] Download IBM Plex demo font assets and confirm generated tokens use them successfully
- [x] Establish the first IBM Plex editorial/prose typescale and measure defaults
- [x] Verify the demo on port `4174` and keep it visually focused on prose rhythm and grid rather than app-shell components
- [x] Write the Canonical-spec comparison note and identify which concepts should transfer into this repo
- [x] Decide whether the current `4 / 8 / 12` grid should become a stricter `4 / 8 / 16` grid with power-of-2 spans for future app-facing use
- [x] Add explicit flow-boundary handling for prose, including last-child reset and possibly precision baseline compensation
- [x] Pressure-test the typescale, measure, and grid defaults against real `brand-layout-ops` content and future portfolio/editorial layouts
- [x] Decide whether the current `4 / 8 / 16` grid breakpoints should stay simple or move closer to the exact Canonical app-grid thresholds later
- [x] Decide whether to add a second preset later or keep one strong default until real reuse pressure appears
- [x] Add stronger regression checks around baseline/nudge behavior if the token model or preset count expands
- [x] Turn component screenshots into a browser-enforced baseline verification gate
- [x] Decide whether runtime CSS should also emit `@font-face` rules so the demo definitely uses the downloaded IBM Plex variable assets rather than relying on local installation or fallback
- [x] Add isolated component demos and Playwright screenshot capture for typography, prose, layout, and grid baseline QA
- [x] Move the dense panel preset's control sizing and spacing into a dedicated JSON source-of-truth block instead of hardcoded compat CSS
- [x] Pull the panel controls back toward the established Vanilla/PVR visual style while keeping the baseline gate green
- [x] Add a real component atlas page and port the next panel-relevant PVR families into isolated baseline-gated demos
- [x] Make the component demos honest inspection surfaces: dark by default, real `h5` section labels, atlas coverage for every baseline-gated page, and a baseline-grid toggle that starts off hidden
- [x] Add one more baseline unit of vertical breathing room to the compact panel controls after live downstream-style inspection
- [x] Split the grouped panel component demos into one saved HTML file per component family and make the atlas a direct index of those baseline-gated files
- [x] Fix the core Foundry dark theme so prose/background colors switch properly outside the compat layer
- [x] Add the next per-component preview pages for data-display and query/search (`chip`, `badge`, `status-label`, `table`, `search-box`, `search-and-filter`)
- [x] Pressure-test a real `brand-layout-ops` surface against `dist/presets/panel/styles.css` and record any remaining swap blockers versus `portable-vertical-rhythm`
- [x] Land the tier-and-engine refactor in stages: routing variables are per-element; metrics is the default; `.bf-engine-cap` is the opt-in override
- [x] Promote the prose and app surfaces to equal first-class runtime tiers (`.bf-tier-editorial` / `.bf-tier-app`) instead of treating the compact panel build as a derivative override
- [x] Collapse the temporary `bf-control-grid` helper back into `bf-grid` recipes so both page regions and narrow panels resolve to the same spec `4 / 8 / 16` contexts from container width alone
- [x] Make the grid tier-aware so editorial uses the rewrite's wider large/x-large gutters while app keeps the denser application gutter values
- [x] Broaden the cap-unit evaluation beyond the now-green `demo/components/engine-smoke.html` slice and record whether cap should replace, complement, or stay secondary to the metrics-derived engine for baseline-aligned compact/editorial-adjacent text
- [ ] Remove the remaining baseline-aligned app-tier assumptions so `.bf-tier-app` is fully zero-nudge/container-owned while engine work stays scoped to baseline-aligned surfaces
- [x] Reframe `/demo/` as a screenshot-first spec workspace: keep the tier selector, strip faux-doc copy, and remove card framing from the home page
- [x] Keep the `/demo/` home page focused on the editorial/app comparison line and leave documentation tier generated but out of the main selector for now
- [x] Add a separate top-level controls gallery and promote the Vanilla controls comparison harness into `npm run compare:controls`
- [ ] Rebuild `demo/spec/typography.html` as a minimal `h1`-through-`h6` plus paragraph specimen page
- [ ] Rebuild `demo/spec/spacing.html` as an editorial-vs-app spacing specimen that shows nested container gaps instead of card-based layout chrome
- [ ] Rebuild `demo/spec/grid.html` around the Canonical figures, starting with the `240px`-`619px` panel-width 4-column example and hard-stop grid/gutter visualization
- [ ] Decide how remaining row-style surfaces such as tables and list-tree rows should participate in the engine model now that chips, badges, and status labels use dedicated compact UI contracts
- [x] Rework chips, badges, and status labels around explicit compact UI type contracts and Vanilla-style padding/min-width derivation instead of reusing body/h5 roles plus generic baseline fractions
- [ ] Decide whether the remaining standalone badge width delta (`15.2px` vs `16px`) warrants another compact-geometry pass or is acceptable convergence
- [x] Finish the bf-only selector migration by removing legacy `p-*`, `vr-theme`, and `--vr-*` aliases from emitted CSS, demos, and QA/build scripts
- [x] Port the strongest remaining downstream-specific no-analog patterns called out in `docs/brand-layout-ops-styles-replacement-report.md`, especially equal-width dense tabs, preset radio rows, and style palette cards
- [ ] Decide whether the panel preset's current compact rhythm is close enough to downstream use, or whether its gaps should move tighter toward current `portable-vertical-rhythm` app density after the first integration pass
- [x] Finish the rhythm cleanup for the newly ported `chip`, `badge`, `status-label`, `table`, `search-box`, and `search-and-filter` pages, then promote them into the automated baseline gate
- [x] Continue siphoning the remaining PVR families that still matter after the first swap pass, especially list-tree, tooltip, contextual-menu, code-snippet, and overlay-adjacent pieces
- [x] Harden the panel preset against narrow-container overflow and add a dedicated narrow-panel regression page to the browser gate
- [x] Split `grid-row` ownership away from the broad page grid so dense downstream parameter matrices use the compact compat grid instead of collapsing into `4 / 8 / 16` layout columns
- [x] Remove the old grid, slider, and downstream panel aliases so the demos and generated CSS exercise only the canonical Foundry surface
- [x] Align the application shell widths to the Canonical drawer model with named overlay sizes and explicit pinned min/max bounds
- [x] Add overlay drawer panels that sit over the stage, plus runtime toggle/backdrop support and a baseline-gated drawer demo page
- [x] Upstream the pinned-aside resize behavior from `brand-layout-ops` so the shell can be rehearsed here before swap work
- [x] Upstream the remaining small shell helpers from the current `overlay-preview` audit, especially fill-height panels, checkbox-field density, and dense action rows
- [x] Turn the component atlas into a visual Playwright-backed index so each saved demo has a linked screenshot tile
- [ ] Audit the application shell against Vanilla within the current token/runtime model, especially panel shadow, header spacing, close-button treatment, and sliding/resizable aside structure
- [ ] Evaluate whether Ubuntu Sans Variable should become the repo default while IBM Plex remains the panel-specific line
- [ ] Continue the remaining parity pass only for still-relevant rows after the scope trim, especially `forms`, `navigation`, `table-icons`, `links`, `lists`, and `icons` if downstream swap testing proves they matter
- [ ] Treat the parity snapshot as inventory rather than blanket backlog: do not spend more time on `article-block`, `article-pagination`, `blog`, `divider`, `in-page-navigation`, `list-tree`, `matrix`, `media-container`, `media-object`, `navigation-reduced`, `newsletter-signup`, `status-label`, `suru`, `table-expanding`, `table-mobile-card`, `table-of-contents`, `table-sortable`, or `tooltips` unless scope changes
- [ ] After panel parity is credible, bring the same component surface to parity under the prose/default preset and decide whether preset switching should be stylesheet-level, build-time bundling, or scoped runtime attributes
- [ ] Once the runtime tier contract is credible, decide whether stylesheet swapping still needs to ship as a public API or whether runtime class switching fully replaces it
- [x] Re-test whether the downstream `viewer-panel__content` stage-centering shell should stay local composition or deserves a tiny upstream helper once the swap is further along, especially now that a real `brand-layout-ops` bug showed a long pinned inspector can stretch the stage row unless the consumer hard-clamps the shell to the viewport

## Key file map

| Purpose | File |
|---------|------|
| Main package entry | `src/index.ts` |
| Node build API | `src/build.ts` |
| Preset registry | `src/presets.ts` |
| CSS generator | `src/css.ts` |
| Grid CSS slice | `src/css-grid.ts` |
| Stage shell helper | `demo/components/stage-shell.html` |
| Drawer runtime | `src/panel-drawer.ts` |
| Pinned-aside resize runtime | `src/resizable-aside.ts` |
| Tier registry | `src/presets.ts` |
| Editorial tier config | `config/tiers/editorial.json` |
| Documentation tier config | `config/tiers/documentation.json` |
| App tier config | `config/tiers/app.json` |
| Panel preset config | `config/presets/panel.json` |
| Theme build script | `scripts/build-theme.ts` |
| Demo font setup | `scripts/setup-demo-font.ts` |
| Build validation | `scripts/validate-build.ts` |
| Vanilla controls comparison | `scripts/compare-controls.ts` |
| Vanilla inline-surface comparison | `scripts/compare-inline-surfaces.ts` |
| Component baseline verification | `scripts/verify-component-baselines.ts` |
| Component behavior verification | `scripts/verify-component-behavior.ts` |
| Component screenshot capture | `scripts/capture-component-screenshots.ts` |
| Living spec home | `demo/index.html` |
| Living spec shell | `demo/spec-runtime.js`, `demo/spec-shell.js`, `demo/spec-shell.css` |
| Top-level controls gallery | `demo/controls.html`, `demo/controls-page.js`, `demo/controls-shell.css` |
| Living spec chapters | `demo/spec/typography.html`, `demo/spec/spacing.html`, `demo/spec/grid.html` |
| Panel demo | `demo/panel.html` |
| Atlas enhancer | `demo/component-atlas.js` |
| Component demos | `demo/components/index.html` |
| Engine smoke demo | `demo/components/engine-smoke.html` |
| Drawer panel demo | `demo/components/drawer-panel.html` |
| Individual control demos | `demo/components/button.html`, `demo/components/actions.html`, `demo/components/text-input.html`, `demo/components/color-input.html`, `demo/components/select.html`, `demo/components/checkbox.html`, `demo/components/radio.html`, `demo/components/range.html`, `demo/components/file-input.html`, `demo/components/validation.html`, `demo/components/switch.html`, `demo/components/tabs.html`, `demo/components/panel-tabs.html`, `demo/components/accordion.html`, `demo/components/modal.html`, `demo/components/choice-row.html`, `demo/components/inline-options.html` |
| Individual surface/navigation demos | `demo/components/segmented-control.html`, `demo/components/breadcrumbs.html`, `demo/components/pagination.html`, `demo/components/divider.html`, `demo/components/cards.html`, `demo/components/option-card.html` |
| Surfaces/navigation demo | `demo/components/surfaces-navigation.html` |
| Brand Layout Ops sample | `demo/components/brand-layout-ops-sample.html` |
| Panel pressure demo | `demo/components/panel-pressure.html` |
| Narrow panel regression demo | `demo/components/narrow-panel.html` |
| Parameter matrix regression demo | `demo/components/parameter-matrix.html` |
| Editorial pressure demo | `demo/components/editorial-pressure.html` |
| Architecture plan | `docs/rebuild-plan.md` |
| Product roadmap | `docs/product-roadmap.md` |
| Canonical concept review | `docs/canonical-concepts-review.md` |

## Notes for the next model

- Keep editorial baseline alignment sacred; do not reintroduce app-tier nudges without an explicit spec decision.
- Favor smaller canonical primitives over broad pattern coverage.
- Avoid importing old Vanilla or compatibility assumptions unless they clearly survive modern scrutiny.
- If React becomes important later, add canonical React primitives instead of wrapping legacy markup contracts.
