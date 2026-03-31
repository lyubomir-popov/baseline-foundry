# History — Completed Work

Items moved here from `llm-handoff-context.md`, `docs/rebuild-plan.md`, `README.md`, and `docs/USER.NOTES.MD` to keep the active backlogs lean.

## Phases completed (from rebuild-plan.md)

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
- [x] Pagination links use same `--bf-control-block-size` as buttons (matching Vanilla `@extend %vf-button-base`)
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

## User notes items completed (from USER.NOTES.MD)

- [x] Add 3 controls (theme, baseline, tier) to all individual component examples — global bar at top with space-between, excluded from screenshots
- [x] Hamburger-activated aside listing every page using sidenav, available on every page, icon in top bar
- [x] Side navigation no longer overlaps content on desktop
- [x] Search field uses proper SVG icons instead of hand-drawn CSS shapes
- [x] Pagination links match button height via `--bf-control-block-size`
- [x] Accordion chevron-to-text spacing fixed to use `--bf-control-inline-padding`
- [x] Bold removed from body-text UI components (pagination, breadcrumbs, buttons, tabs use body text styles)

## Parity scope trim (settled decisions)

The following Vanilla patterns were explicitly removed from active parity scope: `article-block`, `article-pagination`, `blog`, `divider`, `in-page-navigation`, `list-tree`, `matrix`, `media-container`, `media-object`, `navigation-reduced`, `newsletter-signup`, `status-label`, `suru`, `table-expanding`, `table-mobile-card`, `table-of-contents`, `table-sortable`, `tooltips`.
