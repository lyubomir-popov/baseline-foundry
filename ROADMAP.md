# Product Roadmap

## Purpose

Minimal testing surface for evaluating canonical typography, spacing, and grid specs. Output: spec examples, screenshots, edge-case isolation — not a finished design-system site.

## Source inputs

Primary spec inputs for roadmap work:

- `../canonical-spacing-spec/specs/typeface/draft.md`
- `../canonical-spacing-spec/specs/spacing/draft.md`
- `../canonical-spacing-spec/specs/grid/draft.md`

Additional ideas may extend beyond the specs, but they must stay clearly marked as non-spec work rather than being folded back into the source-of-truth docs.

## Stages

### Stage 1 — Foundation tokens and prose flow ✅

Metric-driven typography from Ubuntu Sans Variable, editorial typescale, prose spacing, baseline overlay.

### Stage 2 — Layout primitives and grid ✅

`bf-section`/`bf-strip` rhythm, `bf-stack`/`bf-cluster` primitives, `bf-grid` (4/8/16 model), `bf-page`.

### Stage 3 — Spec-driven component surface (in progress)

All non-deprecated Vanilla components as minimal `bf-*` demos. Currently: 27 shipped, 4 partial, 9 superseded, 19 missing, plus 6 permanently excluded deprecated patterns. Independent theme surfaces now ship as complete scoped token sets with stored font metrics, so alternate fonts can sit beside the canonical Ubuntu tiers without relying on editorial-base diffs. Purpose: edge-case isolation for spec evaluation and screenshot capture.

**Key invariant for this stage:** Control sizing (buttons, inputs, selects) follows the Vanilla model — symmetric `padding-block = nudge − border`, no explicit `block-size` target, and `margin-bottom = compensation + spaceAfter`, where `compensation = ceil(borderBoxHeight / baselineUnit) × baselineUnit − borderBoxHeight`. The occupied block (`border box + margin-bottom`) snaps to the baseline grid; the raw border box usually does not. See `TODO.md` → "Control baseline-grid invariant" for the full explanation. All controls sharing a font size align to the same baseline as a `<p>`.

### Stage 4 — Consumer hardening

Clearer token semantics, stronger validation, multi-surface build inputs, and canonical documentation for authors consuming full scoped theme surfaces plus stored metrics manifests.

### Stage 5 — Optional extensions

Brand-specific surface lines, React primitives, additional composed patterns. Only if justified by downstream demand.

## Vanilla pattern parity inventory

Source of truth: `vanilla-framework/scss/_patterns_*.scss` (65 pattern entries).

| Status | Meaning |
|---|---|
| Shipped | Package-side `bf-*` surface exists and is demo-covered |
| Partial | Some primitive exists but full VF pattern not yet represented |
| Superseded | Covered by smaller Foundry primitives or the tier model |
| Missing | No current equivalent |
| BF-original | No Vanilla source; surface designed inside BF |

Counts: **Shipped 30 · Partial 4 · Superseded 8 · Missing 17** plus 6 permanently excluded deprecated patterns. BF-originals (no Vanilla source): `bf-tiered-list`, `bf-before-after` (planned).

| Pattern | Status | Foundry surface | Gap |
|---|---|---|---|
| `accordion` | Shipped | `bf-accordion` + runtime | — |
| `article-pagination` | Partial | `bf-pagination` | No article-specific wrapper |
| `badge` | Shipped | `bf-badge` | — |
| `breadcrumbs` | Shipped | `bf-breadcrumbs` | — |
| `buttons` | Shipped | `bf-button`, `bf-actions` | `is-positive`, `is-negative`, `is-link`, and `is-icon` shipped. `p-button--brand` is deprecated upstream and intentionally not ported. Still missing: processing modifier |
| `card` | Shipped | `bf-card` | — |
| `chip` | Shipped | `bf-chip` | — |
| `code-snippet` | Shipped | `bf-code-snippet` + runtime | — |
| `contextual-menu` | Shipped | `bf-contextual-menu` + runtime | — |
| `cta` | Shipped | `bf-cta-block` (+ `is-bordered`) | Vanilla `has-border` renamed to `is-bordered` for the BF is-* convention |
| `data-spotlight` | Missing | — | Out of scope |
| `divided-section` | Missing | — | Out of scope |
| `divider` | Missing | — | Removed in scope trim |
| `equal-height-row` | Shipped | `bf-equal-height-row` (+ `-col`, `-item`, `is-wrap`, `is-divider-1/2/3`, `is-borderless`) | Subgrid layout; container queries replace Vanilla media queries; `has-divider-N` → `is-divider-N` for BF convention |
| `form-help-text` | Shipped | `bf-form-help` | — |
| `form-password-toggle` | Missing | — | — |
| `forms` | Partial | `bf-field`, `bf-control`, `bf-input`, `bf-select` | Missing: group wrapper, validation icons |
| `form-tick-elements` | Shipped | `bf-checkbox`, `bf-radio` | Minor: indeterminate state |
| `form-validation` | Shipped | `bf-validation-message` | — |
| `grid` | Superseded | `bf-grid` (Canonical 4/8/16) | — |
| `grid-8` | Superseded | `bf-grid` @container | — |
| `heading-icon` | Missing | — | Out of scope |
| `headings` | Superseded | tier role tokens | — |
| `icons` | Shipped | `bf-icon` | Search / close / chevron plus success/error-grey state glyphs shipped; broader catalog can follow on demand |
| `image` | Partial | `bf-figure` + `bf-figure-caption` | Aspect-ratio container modifiers (`16-9`, `3-2`, `2-3`, `cinematic`, `square`, on-(small\|medium\|large)) not yet ported |
| `in-page-navigation` | Missing | — | Out of scope |
| `links` | Partial | semantic link styles, `bf-skip-link` | Missing: back-to-top, anchor, inverted |
| `lists` | Shipped | prose lists, `bf-list`, `bf-inline-list`, `bf-list-tree` | — |
| `list-tree` | Shipped | `bf-list-tree` + runtime | — |
| `logo-section` | Missing | — | Out of scope |
| `matrix` | Missing | — | Removed in scope trim |
| `media-container` | Shipped | `bf-figure` (covers the media + caption pattern) | — |
| `media-object` | Missing | — | Out of scope |
| `modal` | Shipped | `bf-modal` + runtime | — |
| `muted-heading` | Missing | — | Out of scope |
| `navigation` | Partial | `bf-side-navigation`, `bf-top-navigation` + runtime | Missing: mega-nav |
| `navigation-reduced` | Missing | — | Out of scope |
| `notifications` | Missing | — | Out of scope |
| `pagination` | Shipped | `bf-pagination` | — |
| `pull-quotes` | Superseded | prose `blockquote` | Out of scope |
| `rule` | Superseded | `bf-rule`, prose `hr` | — |
| `search-and-filter` | Partial, Broken around icons | `bf-search-and-filter` + runtime | — |
| `search-box` | Shipped | `bf-search-box` | — |
| `section` | Superseded | `bf-section`, `bf-page` | — |
| `segmented-control` | Shipped | `bf-segmented-control` | — |
| `separator` | Superseded | `bf-rule` | — |
| `side-navigation` | Shipped | `bf-side-navigation` + runtime | — |
| `slider` | Shipped | `bf-slider` + runtime | — |
| `status-label` | Shipped | `bf-status-label` | — |
| `strip` | Superseded | `bf-strip` | — |
| `switch` | Shipped | `bf-switch` | — |
| `tables` | Shipped | `bf-table` | — |
| `table-expanding` | Missing | `bf-table` base only | Out of scope |
| `table-icons` | Shipped | `bf-table` + `.is-icon-placeholder` cells | — |
| `table-mobile-card` | Missing | `bf-table` base only | Out of scope |
| `table-of-contents` | Missing | — | — |
| `table-sortable` | Missing | `bf-table` base only | — |
| `tabs` | Shipped | `bf-tabs` + runtime | — |
| `tooltips` | Shipped | `bf-tooltip` + runtime | — |

Permanently excluded (deprecated in Vanilla): `article-block`, `blog`, `newsletter-signup`, `pricing-block`, `resources-block`, `suru`.

## Portfolio-blocking parity ports

This section is the executable plan distilled from the 3-way comparison of Vanilla Framework × baseline-foundry × the actual `p-*` usage inside `portfolio/src/`. It is *not* the full Vanilla parity backlog (the table above tracks that). It is the minimum set of patterns BF must ship so portfolio can drop `src/styles/_legacy-vanilla-bridge.scss` and consume BF for every component it uses today.

Sources cross-referenced:

- Vanilla SCSS: `../vanilla-framework/scss/_patterns_*.scss` (canonical reference)
- BF coverage: `src/css.ts`, `src/css-components.ts`, `scripts/component-demo-shared.ts`
- Portfolio usage: every `p-*` className in `../portfolio/src/**/*.{jsx,scss}` (excluding the `_legacy-vanilla-bridge.scss` compatibility shim)

### Patterns portfolio uses that BF already covers (consumption swap only)

No BF work needed; portfolio side just needs to drop the `p-*` markup and the bridge file row. Tracked here so the next portfolio-side session has a checklist:

| Vanilla | BF surface | Portfolio call sites |
|---|---|---|
| `p-section` (+ `is-shallow`, `is-deep`, `--shallow`) | `bf-section.is-shallow` / `.is-deep` | `pages/{Home,About,TypeSpecimen}`, `RelatedProjects`, `ProjectNotFound`, `BaselineImageExample` |
| `p-strip` | `bf-strip` | `TypeSpecimen` |
| `p-rule` / `p-rule--muted` | `bf-rule` / `is-muted` | `RelatedProjects`, `GallerySection`, `EqualHeights`, `UFixedWidth` |
| `p-list` / `p-list__item` | `bf-list` / `bf-list-item` | `About` |
| `p-segmented-control` (+ `__list`, `__button`, `is-selected/is-active/is-dense`) | `bf-segmented-control` family | `TypeSpecimen`, `BaselineGridToggle`, `SegmentedControl` |
| `p-switch` (+ `__input/__slider/__label`) | `bf-switch` family | `TypeSpecimen`, `BaselineGridToggle` |
| `p-chip-group`, `p-chip` (+ `--positive`, `__value`, `__dismiss`) | `bf-chip` (+ `is-positive/is-caution/is-negative/is-information`), `bf-chip-lead`, `bf-chip-value`, `bf-chip-dismiss` | `Home` filter chips |
| `p-icon--close` | `bf-icon.is-close` | chip dismiss in `Home` |
| `p-checkbox` (+ `__input/__label`) | `bf-checkbox` | `BaselineImageExample` |
| `p-form` | `bf-form-*` / form atlas | `TypeSpecimen`, `BaselineGridToggle` |
| `p-button --base` | `bf-button.is-base` | `BackToProjects`, `Navigation`, `ProjectNotFound`, `BaselineGridToggle` |
| Vanilla "tiered list" (Canonical-website pattern, no Vanilla SCSS) | `bf-tiered-list` (BF-original; landed 2026-04-27) | `TieredList/`, `BfTieredListDemo` |

### Real BF gaps that block portfolio (this is the port plan)

Four primitives. Comparable in scope to the `bf-tiered-list` slice. Execute in dependency order so each commit stays small and independently testable.

**Status: ALL FOUR LANDED 2026-04-27 on branch `salvage/local-work-recovery`.** Portfolio-side consumption swaps remain (see `portfolio/AGENT-INBOX.md`).

| # | New BF surface | Vanilla source | Portfolio call sites unblocked | Effort | Status |
|---|---|---|---|---|---|
| 1 | `bf-button.is-positive` | `_patterns_buttons.scss` (`p-button--positive`) | `HeroCarousel` | TRIVIAL | Shipped (commit `ca16bb5`) |
| 2 | `bf-cta-block` (+ `is-bordered`) | `_patterns_cta.scss` (`p-cta-block`) | currently inlined inside `bf-tiered-list-cta`; standalone use will appear as portfolio adopts the BF primitive | TRIVIAL | Shipped (commit `3b4f9ac`); `has-border` renamed to `is-bordered` for BF convention |
| 3 | `bf-equal-height-row` (+ `-col`, `-item`, `is-wrap`, `is-divider-1/2/3`, `is-borderless`) | `_patterns_equal-height-row.scss` | `EqualHeights/` | STANDARD | Shipped (commit `0ad2e53`); subgrid + `@container`; `has-divider-N` renamed to `is-divider-N` |
| 4 | `bf-figure` + `bf-figure-caption` | `_base_media.scss` + `_patterns_media-container.scss` (`p-media__caption`) | `GallerySection/` | STANDARD | Shipped (commit `aa5335d`); aspect-ratio modifiers from `_patterns_image.scss` deferred — track under `image` row above |

For each new surface, the slice contract mirrors the bf-tiered-list slice landed on 2026-04-27:

1. Add CSS to `src/css-components.ts`. Replace Vanilla's media queries with `@container` queries where the layout is responsive.
2. Add a standalone `demo/components/<name>.html` page. Use `bf-theme is-dark`, `data-component-capture`, `data-baseline-check` probes per the existing demo conventions.
3. Register the page in `scripts/component-demo-shared.ts` (`captureProfile: "wide"` for any pattern whose container query exceeds ~38rem).
4. Link from `demo/components/index.html` under the appropriate atlas section.
5. Add the page to the bf-only invariant family in `scripts/validate-build.ts` plus any pattern-specific invariants for the unique selectors.
6. After step 2 lands, refactor `bf-tiered-list-cta` to *compose* `bf-cta-block` instead of duplicating its rules. **Decision 2026-04-27: skipped** — bf-cta-block is an inline flex row (heading + buttons on one wrapped row); bf-tiered-list-cta-block is a vertical stack inside the tiered-list grid cell. The two patterns share intent but not visual shape, so composition would force extra modifiers. Left as-is.
7. Update this section as each item lands. Move to `HISTORY.md` only when the corresponding parity row in the table above also moves to Shipped.

### Explicitly excluded from this plan

- **`bf-before-after`** — slider behavior used by portfolio's `BeforeAfter` component. No Vanilla source; this is a BF-original. Tracked separately; out of scope for the parity-port plan.
- **`bf-hero` / carousel** — depends on tier-reform task 2.13 in `portfolio/MIGRATION-PLAN.md`. May stay portfolio-local. Decide after Phase 2 lands.
- The 24 "Missing" Vanilla patterns above (`article-pagination`, `data-spotlight`, `divided-section`, `heading-icon`, `image`, `in-page-navigation`, `logo-section`, `matrix`, `media-object`, `muted-heading`, `navigation-reduced`, `notifications`, `pull-quotes` (already Superseded), `table-of-contents`, `form-password-toggle`, `table-expanding`, `table-mobile-card`, `table-sortable`, `cta` (covered above), etc.) are not referenced by portfolio. They stay in the parity table as future work, not on this critical path.
