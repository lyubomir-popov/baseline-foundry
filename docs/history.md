# History — Completed Work

Items moved here from `llm-handoff-context.md`, `docs/TODO.md`, `README.md`, and `docs/AGENT-INBOX.md` to keep the active backlogs lean.

## Blog engine illustration (2026-04-02)

- [x] Added `demo/components/engine-illustration.html` as the static three-way companion to the baseline-alignment article, keeping the shared locked-manifest IBM Plex Sans / Ubuntu Sans experiment bundle while adding a page-local raw-metrics lane beside the shipped compensated lane and the demo-only cap lane.
- [x] Wired the new page into the shared page catalog, component atlas, screenshot inventory, and static build validation so it is a normal repo artifact rather than a hidden one-off experiment.
- [x] Updated `docs/comparing-baseline-alignment-techniques.md`, `README.md`, `docs/TODO.md`, and the handoff so the old "blog illustration if needed" note is now reflected as landed work.

## OS tier addendum + panel-route closure (2026-04-02)

- [x] Added `config/tiers/os.json` as a real fourth built-in tier: the dense line now follows the canonical `body` + `h1` to `h6` role contract instead of keeping separate `ui-*` roles alive.
- [x] Repointed the legacy `panel` preset output to the OS tier values so downstream dense-surface consumers still have the old artifact path, but the repo now treats `panel` as an alias rather than as a peer tier.
- [x] Converted `demo/panel.html` from a standalone preset page into a shared-chrome OS addendum page, registered it in the page catalog, and extended the shared runtimes/validation so `Editorial / Docs / App / OS` is now the truthful global tier model everywhere.

## Global tier header unification (2026-04-02)

- [x] Removed the old `panel` option from the standard component-page header path and aligned `demo/component-demo.js` with the same built-in `Editorial / Docs / App` tier selector used by the living spec and example pages.
- [x] Normalized the component templates to bootstrap from the shared tier stylesheet instead of the old panel/app-tier preset paths, so the HTML templates and the header runtime now agree about the site-wide tier model.
- [x] Tightened `scripts/validate-build.ts` with a component-page tier-consistency audit that rejects future drift back to preset bootstrap paths or `panel` as a global header tier option.

## Parasite class sweep (2026-04-02)

- [x] Removed the last surviving downstream validation aliases from `src/css-components.ts`: `.has-error`, `.has-success`, and `.has-warning` no longer mirror the canonical `is-*` validation state contract.
- [x] Confirmed those aliases were not used anywhere in the demo or runtime sources before removal, so the cleanup closes dead compatibility surface rather than changing live markup expectations.
- [x] Tightened `scripts/validate-build.ts` so generated CSS now fails if any of the removed `.has-*` validation aliases reappear.
- [x] Removed the last live `has-*` helper classes from the BF demo/runtime surface: application layout now derives its shell from real child structure, side-navigation parent highlighting derives from nested `aria-current`, and top-navigation open state now lives in runtime state plus ARIA instead of root helper classes.
- [x] Tightened `scripts/validate-build.ts` again so demo HTML and generated CSS now fail if `has-*` helper classes reappear anywhere in the BF authoring surface.

## Typographic specimen chapter (2026-04-02)

- [x] Added `demo/spec/typographic-specimen.html` as a new living-spec chapter with the shared tier-switching page chrome and a longer-form editorial specimen built from prose primitives instead of ad hoc framed surfaces.
- [x] Extended `demo/spec-shell.css` with the responsive specimen layout helpers needed for the new two-column editorial chapter, while keeping the narrow fallback as a single-column flow.
- [x] Registered the chapter in `demo/page-catalog.js`, updated the existing spec-chapter local nav links, and added build validation so the specimen page and page-catalog entry are now part of the static contract.

## Page chrome polish (2026-04-02)

- [x] Tightened the shared `demo/page-chrome.css` contract so the `pc-controls` cluster no longer wraps onto two rows at roomy desktop widths.
- [x] Kept the existing `@media (max-width: 56rem)` fallback responsible for restoring internal wrapping only once the narrow layout genuinely runs out of room.
- [x] Extended `scripts/validate-build.ts` so the desktop `nowrap` plus narrow-width `wrap` page-chrome behavior is now part of the static demo contract.

## Surface completeness audit (2026-04-02)

- [x] Restored the missing `layout.sectionSpaceShallowBaselineUnits` token in `config/foundation-theme.json` so the foundation theme once again carries the full layout spacing set expected by the shared surface pipeline.
- [x] Hardened `src/build.ts` to reject missing or non-finite required numeric layout fields up front instead of letting incomplete surface configs drift through generation and surface manifests.
- [x] Tightened `scripts/validate-build.ts` so build validation now fails if generated CSS contains `NaN`, closing the silent-bad-output path for incomplete scoped surfaces.

## bf-panel audit (2026-04-02)

- [x] Tightened `bf-panel` back to the real Vanilla application-layout contract: kept the live header/title/controls/toggle/sticky pieces, but removed the invented border-card treatment from the shared and app-tier CSS.
- [x] Removed the app-tier `bf-panel` shadow layer so panel chrome now comes from the surrounding application layout and overlay areas, not from a reusable card surface.
- [x] Replaced the decorative `bf-panel` wrappers in `demo/controls.html` with plain layout primitives and updated build validation so the controls page no longer dogfoods `bf-panel` outside real application-shell contexts.

## Top-navigation chevron cleanup (2026-04-02)

- [x] Matched the shared top-navigation dropdown chevron motion to the downstream `brand-layout-ops` contract: closed toggles now point downward and active toggles rotate upward.
- [x] Removed the now-redundant desktop-only chevron rotation override from the shared CSS source by making the base top-navigation contract canonical across breakpoints.
- [x] Tightened `validate-build.ts` so generated CSS now asserts the closed `0deg` and active `180deg` top-navigation chevron states directly.

## Workflow modal upstream contract (2026-04-02)

- [x] Upstreamed the `brand-layout-ops` shell-modal behavior as an official `baseline-foundry` contract: `bf-modal.is-workflow` now provides the medium-large authoring shell with fixed header/footer bars and a scrolling body, and `bf-modal.is-workflow.is-resizable` adds optional resize.
- [x] Replaced the local `demo/controls.html` modal width wrapper with the shared workflow modal contract and expanded `demo/components/modal.html` to show the workflow shell with long-content body coverage.
- [x] Extended build validation so generated CSS and living-spec markup now assert the workflow modal and resizable modal selectors directly.

## Audit finding cleanup (2026-04-02)

- [x] Removed the redundant `bf-label` alias from the generated status-label CSS and tightened build validation so `.bf-label` no longer appears in generated styles.
- [x] Re-checked the older `bf-theme--light`, `bf-panel-logo`, and `bf-u-no-margin.is-bottom` audit notes and confirmed they were already stale; removed them from `docs/TODO.md` so the backlog reflects only live work.

## Pragma-informed repo health pass (2026-04-02)

- [x] Replaced the review-only Pragma comparison plan with an executed repo-health plan filtered to non-opinionated improvements only.
- [x] Added `engine` field to `ThemeSurface` and `ThemeSurfaceManifestEntry` types; threaded through `buildThemeSurface` and the manifest builder so all entries in `surfaces.json` now declare their alignment engine (`metrics-compensated`).
- [x] Added explicit spacing ontology to `docs/TODO.md` architecture section: element-owned (editorial/documentation) vs container-owned (app) as named first-class concepts.
- [x] Refactored `validate-build.ts` with `runInvariant` wrappers so each validation group prints a named label and check count (31 groups, 1516+ total checks).
- [x] Extracted the baseline-grid debug overlay into `src/baseline-grid-overlay.ts` (`generateBaselineGridOverlayCss` + `generateBaselineGridThemeOverrideCss`), exported from the package index as a separable concern.
- [x] Documented the font asset contract and debug overlay architecture in `docs/TODO.md`.

## Pragma comparison follow-up plan (2026-04-02)

- [x] Added a review-ready plan to `docs/TODO.md` summarizing the current Foundry vs Pragma comparison, the proposed adoptions, and the explicit questions for external review.

## Baseline alignment comparison article (2026-04-02)

- [x] Added `docs/comparing-baseline-alignment-techniques.md`, a draft blog-style article comparing empirical nudges, cap-unit alignment, raw extracted metrics, and compensated metrics.
- [x] Linked the article from `README.md` so the baseline-alignment write-up is part of the normal repo reading path.

## Multi-font engine smoke bundle (2026-04-02)

- [x] Extended `buildThemeFromConfig` so one custom build can emit multiple named surfaces into a single `styles.css` + `surfaces.json` bundle.
- [x] Added a matched Ubuntu Sans large-type smoke surface beside the IBM Plex Sans default, both at H1 `8rem / 9rem` and H2 `4rem / 5rem`.
- [x] Taught the locked-manifest component runtime to expose manifest-supplied surface labels so the shared page chrome can switch between the two font surfaces cleanly.
- [x] Updated the engine-smoke page copy, validation, and README/API notes around the new multi-surface manifest contract.

## IBM Plex large-type engine smoke (2026-04-02)

- [x] Added a dedicated IBM Plex Sans experiment config with generated nudges for a deliberately aggressive scale: H1 `8rem / 9rem`, H2 `4rem / 5rem`, plus supporting smaller roles.
- [x] Extended the theme build script so the experiment emits its own stylesheet, tokens, and surface manifest under `dist/experiments/ibm-plex-engine-smoke/`.
- [x] Taught the shared component demo runtime to respect a page that pins a custom generated stylesheet through a locked manifest mode, so the shared header still works without resetting the page back to the default Ubuntu surfaces.
- [x] Reworked `demo/components/engine-smoke.html` to load the IBM Plex experiment directly and focus the specimen on the cap-drift comparison at the oversized display steps.
- [x] Verified the whole path with `npm test` and reopened the live demo page on the running Vite server.

## Independent surface contract + metrics manifest (2026-04-02)

- [x] Replaced the build-time tier override model with full scoped theme surfaces so `editorial`, `documentation`, and `app` each emit complete variable sets under their own `.bf-tier-*` container class.
- [x] Added publishable `surfaces.json` artifacts to `dist/`, the built-in tier outputs, and the preset outputs so runtime tokens and the stored font-metric inputs live together in a downstream-safe manifest.
- [x] Split app runtime tokens from app font metrics: `app` remains zero-nudge at runtime, but its computed metric nudges are still retained in the surface manifest for audit, comparison, and future multi-font surface work.
- [x] Updated build validation and the canonical docs so the repo now describes independent surfaces as the target architecture instead of editorial-base diffs.

## BF-only shell cleanup + resize signoff (2026-04-02)

- [x] Removed the remaining `l-*` compatibility selectors from the application-shell/navigation/aside runtime and generated CSS, leaving the layout shell on `bf-*` selectors only.
- [x] Updated `scripts/validate-build.ts` so build validation now asserts the bf-only shell selectors and rejects legacy `l-*` layout selectors in generated CSS.
- [x] Fixed the application-shell resize-handle race by re-syncing `aria-valuenow` from the rendered aside width after the shell settles, which closes the `verifyPinnedAsideResize` blocker and returns the full `npm test` suite to green.

## Top-navigation dropdown closure (2026-04-02)

- [x] Audited Vanilla's navigation dropdown selectors and behavior before porting the next navigation parity slice.
- [x] Extended `bf-top-navigation` runtime, generated CSS, and the standalone demo with dropdown toggles, layered desktop menus, inline mobile expansion, right-aligned account actions, and shared Escape / outside-click dismissal.
- [x] Extended `scripts/validate-build.ts` and `scripts/verify-component-behavior.ts` so dropdown selectors, demo markup, and desktop/mobile interaction expectations are part of the repo contracts.
- [x] Verified the slice with `npm run qa:components` plus a targeted Playwright top-navigation pass covering dropdown open/close, search/dropdown mutual exclusion, right-aligned dropdowns, and mobile Escape dismissal; the full `npm test` suite remains separately blocked by the application-shell resize assertion tracked in `docs/TODO.md`.

## List-state + table-icon closure (2026-04-02)

- [x] Audited Vanilla's `lists` state selectors, `table-icons` placeholder rules, and the shared grey success/error SVG definitions before porting the follow-through.
- [x] Extended `bf-icon` with theme-aware success/error-grey glyphs and reused that geometry for `bf-list-item.is-ticked`, `bf-list-item.is-crossed`, and `bf-table` icon-placeholder cells.
- [x] Updated the standalone `icon`, `list`, and `table` demos so the new states are dogfooded directly in the parity pages.
- [x] Extended `scripts/validate-build.ts` with selector and demo assertions for the new icon, list, and table states.
- [x] Verified the closure with both `npm test` and `npm run qa:components`; `icon`, `list`, and `table` now pass screenshot capture and baseline verification (`21`, `28`, and `9` checks respectively, `0` failures).

## Icon parity slice (2026-04-02)

- [x] Audited Vanilla's `icons` and `table-icons` Sass before porting, then scoped the first pass to the shared glyphs this repo already needed most: search, close, and directional chevrons.
- [x] Shipped a reusable `bf-icon` primitive with Vanilla-style size modifiers and theme-aware embedded assets instead of scattering one-off icon rules across unrelated components.
- [x] Added `demo/components/icon.html` plus the component index/catalog wiring so the new surface is visible alongside the rest of the parity suite.
- [x] Extended `scripts/validate-build.ts` so icon selectors and the new demo page are part of the static contract checks.
- [x] Verified the addition with both `npm test` and `npm run qa:components`; the new `icon` page passes screenshot capture and baseline verification (`19` icon checks, `0` failures).

## Navigation + list parity burst (2026-04-01)

- [x] Audited Vanilla navigation Sass, templates, and scripts before porting, then shipped a dedicated `bf-top-navigation` surface with responsive menu reveal, shared search-box integration, and desktop/mobile state sync instead of relying on app-shell helpers.
- [x] Registered `top-navigation` in the component catalog, build validation, and behavior verification, then closed the remaining baseline drift by switching the divider treatment to an inset-shadow/header-row compensation model.
- [x] Ported Vanilla basic/divided/ordered lists as `bf-list`, inline metadata lists as `bf-inline-list.is-middot`, and the accessibility skip-link pattern as `bf-skip-link`, each with standalone component demos and atlas/catalog wiring.
- [x] Extended `scripts/validate-build.ts` and `scripts/verify-component-behavior.ts` so the new surfaces are part of static validation and skip-link activation/focus coverage.
- [x] Closed the final list/inline-list residual by moving baseline probes onto the actual `li` boxes and making inline-list items measurable `inline-block` rows with nudge-derived block padding.
- [x] Verified the burst with `npm test` and `npm run qa:components`; `top-navigation`, `list`, `inline-list`, and `skip-link` all pass baseline verification and screenshot capture.

## Form atlas inspection page (2026-04-01)

- [x] Added `demo/components/form-atlas.html`, a minimal manual verification surface with `bf-cluster` rows that start with a reference paragraph containing `test` and then place four compact form controls beside it.
- [x] Registered the form atlas in the component index, shared page catalog, and component screenshot/baseline page list so it behaves like the rest of the demo suite.
- [x] Aligned the atlas segmented-control markup with the baseline verifier coverage rules and re-ran `npm run test:components`; `form-atlas` now verifies cleanly and only the separate `table` flow-offset issue remains.
- [x] Added a compact comparison row for paragraph vs. checkbox/radio/switch alignment and removed width-bearing atlas-cell wrappers there so the controls sit close together for visual inspection.
- [x] Captured the compare row across editorial, documentation, app, and panel surfaces, root-caused the mismatch to missing body nudge padding on `bf-checkbox-label`, `bf-radio-label`, and `bf-switch-label`, and fixed those primitives in `src/css-components.ts`.
- [x] Ran a second four-surface inspection pass, root-caused the remaining docs/app drift to raw-centered checkbox/radio box and switch-track offsets, switched those visuals to `alignedVisualStart(...)`, and re-verified that `tabs`, `panel-tabs`, `segmented-control`, `choice-row`, `inline-options`, `range`, and the updated tick/switch family all pass while only the separate `table` flow-offset residual remains.
- [x] Expanded `form-atlas` into a one-page control-family inspection surface with left-reference rows for `tabs`, equal tabs, `choice-row`, `inline-options`, `range`, `file-input`, and `validation`; the atlas now verifies cleanly with `72` checks and no failures.
- [x] Added a manual `table` specimen to `form-atlas` so the same inspection page now shows the table role too, while keeping that row out of the baseline gate until the standalone `table` flow-offset residual is fixed.
- [x] Restored the canonical range rows to an inline editorial layout by adding `.bf-field.is-range`, switching the main slider demos away from forced `.is-stacked`, fixing the runtime fill variable name, and re-checking the updated editorial screenshots under `tmp/screenshots/slider-inline-check/`.
- [x] Added the explicit narrow-width slider field variant via `.bf-field.is-range.is-stacked`, wired it into `range`, `form-atlas`, and `narrow-panel`, and re-verified the stacked editorial captures under `tmp/screenshots/slider-stacked-check/`.
- [x] Closed the last inline range regression by making `.bf-field.is-range` a fixed two-column grid and the default `.bf-slider` a no-wrap row, then re-captured the affected editorial inline surfaces under `tmp/screenshots/slider-inline-recheck/`.
- [x] Closed the final vertical slider regression by giving `.bf-form-label` the body nudge padding and top-aligning the inline slider row, which brought the editorial atlas measurements to `labelVsReference = 0` and `numberVsReference = 0`; confirmed in `tmp/screenshots/slider-inline-post-nudge/`.
- [x] Finished the slider visual-alignment pass by replacing the temporary `--bf-slider-visual-shift` workaround with a thin native range-input model: the input itself now renders the `2px` rail, `--bf-slider-track-offset` places that rail on the active body line, the WebKit track stays transparent, and the runtime fill still comes from `--bf-slider-fill-percent`.
- [x] Re-ran `npm run build`, `npm run test:components`, and the slider inspection captures under `tmp/screenshots/slider-visual-offset-check/` plus `tmp/screenshots/slider-geometry-inspect/`; the follow-up geometry script confirmed `trackTransform: none`, empty `sliderVisualShift`, and `rangeTop - labelTop = --bf-slider-track-offset` in both editorial and app, so the final slider signoff is complete and only the separate `table` flow-offset residual remains.
- [x] Softened `thead th` from uppercase `h5` styling to bold body text so table headers read as labels instead of mini headings.
- [x] Reworked the standalone `table` closure from the temporary row-start padding fix to the explicit symmetric row formula: table rows now use one padding value (`bodyNudge` in nudged tiers, compact fallback in `app`), keep the separator inside the row box as a real border, and solve line-height from `rowBlockSize − 2 × rowPadding − borderWidth`.
- [x] Documented that compensated row model in `docs/TODO.md` as the reusable invariant for tables and other repeated rows where text sits between rules and `margin-bottom` is unavailable.

## Control-suite occupied-block rollout + demo alignment (2026-04-01)

- [x] Extended the restored Vanilla-model occupied-block compensation from the focused button/input trial across the remaining padded, bordered control family.
- [x] Updated `scripts/verify-component-baselines.ts` to measure occupied block height (`border box + margin-bottom`) consistently instead of treating control border boxes as the snapped quantity.
- [x] Narrowed composite demo checks so `search-box`, `search-and-filter`, and `narrow-panel` verify the actual control surfaces instead of incidental wrappers or internal plumbing.
- [x] Removed the app-tier component-demo shell override that hid the baseline grid and changed component demos to boot editorial by default instead of the panel preset.
- [x] Re-verified the rollout with `npm run test:components`; all affected control surfaces now pass, and only the separate `table` flow-offset issue remains.

## Focused button proof + tier-override correction (2026-04-01)

- [x] Fixed shared tier-override generation so documentation/editorial keep computed nudges and only `app` zeroes nudges in the shared stylesheet.
- [x] Restored the text-input proof-of-concept spacing rationale for inputs/selects via tier-selectable block-padding vars with fixed `app` fallback padding.
- [x] Applied the same rationale to buttons, removed the explicit button min-block-size dependency, and restored Vanilla-style inline-block button layout instead of flex centering.
- [x] Verified `demo/components/button.html` in Playwright with the actual button text baseline landing within `0.1px` of the `4px` baseline grid.
- [x] Clarified the cold-start docs so new agents know `margin-bottom = compensation + spaceAfter` and that the occupied block, not the raw border box, is what must land on the baseline grid.

## Control-family padding and tier typography rollout (2026-03-31)

- [x] Replaced body-nudge-derived target-height math with explicit regular/compact control block padding tokens across the control family.
- [x] Rolled the padding model through buttons, inputs, selects, tabs, pagination, segmented controls, navigation links, drawer/panel surfaces, and the related demo/spec pages.
- [x] Tuned documentation, app, and panel compact padding values so dense controls preserve the expected visual heights while still landing on the baseline grid.
- [x] Switched root prose and body-sized components to role-scoped typography vars so documentation/app tiers no longer freeze editorial body sizing.
- [x] Fixed screenshot capture to ignore empty selector entries instead of crashing the component QA pipeline.
- [x] Removed legacy `controlMinBlockSize*` config/build/type/validation plumbing and deleted stale compat artifacts that no longer matched the shipped API.
- [x] Aligned checkbox/radio/switch label wrappers with the control rhythm, including explicit non-inline switch label handling.
- [x] Verified the milestone with both `npm test` and `npm run qa:components`.

## Homepage/runtime alignment (2026-03-31)

- [x] Living-spec homepage/spec runtime now uses the shared editorial stylesheet with class-based tier switching instead of tier-by-tier stylesheet swapping.
- [x] Homepage, spec chapters, and controls page now advertise the same `editorial` / `documentation` / `app` shared-bar tier set.
- [x] The minimal `text-input` component demo is now the clean paragraph/input baseline comparison surface, using `bf-cluster` with top-aligned children instead of the temporary homepage probe.
- [x] Root-caused the stale Vite CSS behavior to Vite ignoring `outDir` in dev when `build.emptyOutDir` is enabled.
- [x] Fixed the dev server by setting `build.emptyOutDir = false` in `vite.config.ts`, which keeps `dist/**` watched and invalidates generated CSS without a server restart.

## Phases completed (from TODO.md)

### Phase 1 — Foundation tokens and prose flow

- [x] Metric-driven typography tokens from IBM Plex Sans
- [x] Prose defaults for headings, paragraphs, lists, blockquotes, rules
- [x] Single-direction margin declarations (Harry Roberts pattern)
- [x] Element qualifiers align by default (bare `h1`–`h6`, `p`, `figcaption`)
- [x] Flat `bf-` naming convention established (no BEM `__`/`--`)

### Phase 2 — Layout primitives and grid

- [x] `bf-grid` with `4 / 8 / 16` column structure, power-of-2 spans
- [x] Canonical container thresholds at `620px` and `1681px`
- [x] Viewport-controlled gutters/margins (`16px`, `24px`, `32px`)
- [x] `bf-page`, `bf-section`, `bf-fixed-width`, `bf-strip`, `bf-stack`, `bf-cluster`, `bf-stage-shell`
- [x] `bf-grid--controls` recipe for dense inspector rows
- [x] Container-query driven column count

### Phase 3 — Component surface and demo infrastructure

- [x] Tier-first build model with `editorial`, `documentation`, `app` outputs
- [x] Panel preset for dense control surfaces
- [x] Legacy preset aliases (`prose` → editorial, `app-tier` → app)
- [x] Core form controls: `bf-input`, `bf-field`, `bf-control`, `bf-select`, file/color/range
- [x] Tick elements: `bf-checkbox`, `bf-radio`
- [x] `bf-switch` toggle
- [x] `bf-button`, `bf-actions`
- [x] `bf-tabs`, `bf-tabs.is-equal`, panel-tabs
- [x] `bf-accordion` with runtime module
- [x] `bf-breadcrumbs`
- [x] `bf-pagination`
- [x] `bf-segmented-control`
- [x] `bf-contextual-menu` with runtime module
- [x] `bf-tooltip` with runtime module
- [x] `bf-modal` with runtime module
- [x] `bf-code-snippet` with runtime module
- [x] `bf-search-box`, `bf-search-and-filter` with runtime module
- [x] `bf-card`
- [x] `bf-chip`, `bf-badge`, `bf-status-label`
- [x] `bf-side-navigation` with expandable behavior and runtime module
- [x] `bf-list-tree` with runtime module
- [x] `bf-slider` with range controls runtime
- [x] `bf-rule`, prose `hr`
- [x] Compact inline UI roles: `ui-heading`, `ui-small`, `ui-small-caps`, `ui-x-small`
- [x] Validation states: `bf-validation-message`, `is-success`, `is-caution`, `is-error`
- [x] Application layout shell with top nav bar, collapsible left navigation
- [x] Overlay drawer shell mode (`l-aside.is-overlay`)
- [x] Resizable pinned-aside shell mode (`l-aside.is-pinned`)
- [x] Dense panel patterns: equal-width tabs, radio rows, option cards, etc.
- [x] Fill-height panel helper
- [x] Baseline grid inspection utility

### Demo and shell infrastructure (completed)

- [x] Demo surface functional on desktop
- [x] Side-navigation renders as hamburger-activated drawer (no longer overlapping content)
- [x] Baseline grid toggle works
- [x] Dark theme switch works
- [x] Tier selector switches stylesheets correctly
- [x] `spec-runtime.js` passes all runtime init functions to page entry points
- [x] All tests pass: build validation, component baseline verification, behavior verification
- [x] Pagination links share the same explicit control inset model as buttons, so their box size comes from line-height plus block padding instead of a target block-size var
- [x] Search icon uses proper SVG `background-image` instead of hand-drawn CSS shapes
- [x] Accordion chevron-to-text gap uses `--bf-control-inline-padding`
- [x] Playwright screenshot capture pipeline
- [x] Baseline verification for baseline-aligned surfaces
- [x] Behavior verification for pinned-aside resize, drawer overlay, application-layout interactions
- [x] Shared thin page chrome on all spec/control/component pages
- [x] Page chrome excluded from screenshot comparisons and Playwright hit-testing
- [x] `/demo/` index and `typography`, `spacing`, `grid` chapters are minimal specimen pages
- [x] Standalone Canonical example batches under `examples/grid/` and `examples/spacing/`
- [x] App-shell first simplification pass landed (lighter panel shadows/header spacing)

### Naming and architecture decisions (settled)

- [x] `bf-` prefix with flat single-dash separation for all selectors
- [x] `is-*` modifiers and `data-*` attributes for variants/states
- [x] Retired `p-*` Vanilla prefix from shipped surface
- [x] Color semantics follow Vanilla's core light/dark token structure
- [x] Metrics-derived nudges as default; `.bf-engine-cap` opt-in only
- [x] `.bf-tier-app` zeroes out selected nudges (container-owned, zero semantic spacing)
- [x] Compact inline surfaces route through explicit compact UI roles
- [x] Baseline-box verification scoped to editorial/layout surfaces only
- [x] Dense inline specimens verified by `compare:inline-surfaces` script

### Phase 5 — Tier and engine refactor (partial — remaining item in active plan)

- [x] Split tier choice from baseline engine choice — tiers switch via `.bf-tier-*` class; cap engine demoted to `.bf-engine-cap` demo overlay
- [x] Make `.bf-tier-app` a true zero-nudge, container-owned runtime line — layout containers reset child spacing; app tier overrides zero all nudges
- [x] Simplify per-element CSS: literal values instead of 10-variable alignment chain; 3 component vars per role instead of 8
- [x] Tier override pipeline: `TierOverride` type + `buildTierOverrides()` generated scoped overrides for all non-base tiers in a single stylesheet at the time; this path is now superseded by the independent surface manifest recorded above.

### Phase 6 — Font switch + canonical alignment ✅

- [x] Download Ubuntu Sans Variable, update all three tier configs
- [x] Align editorial weights to canonical (500/200/500/300/550/550), remove H5 `uppercase`
- [x] Overhaul documentation tier — bU=0.25rem, sizes/weights/lineHeights/spaceAfter match canonical exactly
- [x] Regenerate font metrics, nudge tokens, and CSS for all tiers
- [x] All tests pass

### Phase 7 — Demo and parity cleanup ✅

- [x] Generate spec examples from grid/spacing prompts (9 grid + 10 spacing)
- [x] Visual parity audit for all Partial rows
- [x] Controls gallery regressions verified
- [x] Controls page cleanup (hero removed, data-* migrated, padding fixed, index pages added)
- [x] Full visual parity verification against Vanilla for all controls

### Phase 8 — Data-attribute cleanup + ui-class removal ✅

- [x] Migrate all `data-bf-tone`/`data-space`/`data-align`/`data-spec-shell` CSS selectors to `is-*`/class selectors
- [x] Remove `ui-heading`, `ui-small`, `ui-small-caps`, `ui-x-small` from all tier configs
- [x] Update all HTML pages and JS files for new class-based API
- [x] Delete `examples/app-tier/` entirely

### Architecture refactor (2026-07-16) ✅

- [x] Literal CSS values — no more 10-variable chain
- [x] Layout container child reset (`bf-stack`, `bf-cluster`, `bf-stage-shell` children)
- [x] Simplified component vars (8→3 per role)
- [x] Tier overrides via class toggle (single stylesheet at the time; later superseded by full independent scoped surfaces)
- [x] Cap engine demoted to demo-only
- [x] TierOverride pipeline in build.ts (later superseded by the full surface-manifest build path)

## User notes items completed (from AGENT-INBOX.md)

- [x] Documentation-tier inputs and other body-sized components now follow the active tier body font size instead of freezing editorial 16px values.
- [x] Checkbox/radio/switch label text wrappers now align with control rhythm instead of relying on plain inline text.
- [x] Add 3 controls (theme, baseline, tier) to all individual component examples — global bar at top with space-between, excluded from screenshots
- [x] Hamburger-activated aside listing every page using sidenav, available on every page, icon in top bar
- [x] Side navigation no longer overlaps content on desktop
- [x] Search field uses proper SVG icons instead of hand-drawn CSS shapes
- [x] Pagination links match button height via the shared control block padding and derived control box size
- [x] Accordion chevron-to-text spacing fixed to use `--bf-control-inline-padding`
- [x] Bold removed from body-text UI components (pagination, breadcrumbs, buttons, tabs use body text styles)
- [x] Spec examples generated from `grid-examples.prompt.md` and `spacing-examples.prompt.md` — 9 grid + 10 spacing
- [x] Visual parity audit completed for Partial rows (forms, navigation, table-icons, links, lists, icons)
- [x] Controls gallery regressions verified: chips use `all-small-caps`, button backgrounds match page, body-text UI at weight 400
- [x] Ubuntu Sans Variable switch completed (Phase 6)
- [x] Controls page cleanup: hero/summary removed, data-* attribute styling migrated, input/button padding symmetric, sidenav drawer fixed, index pages at `/` and `/demo/`
- [x] Visual parity verification against Vanilla for all controls — audit complete

## Parity scope trim (settled decisions)

The following Vanilla patterns were explicitly removed from active parity scope: `article-block`, `article-pagination`, `blog`, `divider`, `in-page-navigation`, `list-tree`, `matrix`, `media-container`, `media-object`, `navigation-reduced`, `newsletter-signup`, `status-label`, `suru`, `table-expanding`, `table-mobile-card`, `table-of-contents`, `table-sortable`, `tooltips`.
