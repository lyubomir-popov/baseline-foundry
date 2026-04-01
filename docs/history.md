# History — Completed Work

Items moved here from `llm-handoff-context.md`, `docs/TODO.md`, `README.md`, and `docs/AGENT-INBOX.md` to keep the active backlogs lean.

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
- [x] Tier override pipeline: `TierOverride` type + `buildTierOverrides()` generates scoped overrides for all non-base tiers in a single stylesheet

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
- [x] Tier overrides via class toggle (single stylesheet)
- [x] Cap engine demoted to demo-only
- [x] TierOverride pipeline in build.ts

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
