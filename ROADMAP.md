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

Counts: **Shipped 27 · Partial 4 · Superseded 9 · Missing 19** plus 6 permanently excluded deprecated patterns.

| Pattern | Status | Foundry surface | Gap |
|---|---|---|---|
| `accordion` | Shipped | `bf-accordion` + runtime | — |
| `article-pagination` | Partial | `bf-pagination` | No article-specific wrapper |
| `badge` | Shipped | `bf-badge` | — |
| `breadcrumbs` | Shipped | `bf-breadcrumbs` | — |
| `buttons` | Shipped | `bf-button`, `bf-actions` | Missing: positive/negative/brand/link/processing/icon modifiers |
| `card` | Shipped | `bf-card` | — |
| `chip` | Shipped | `bf-chip` | — |
| `code-snippet` | Shipped | `bf-code-snippet` + runtime | — |
| `contextual-menu` | Shipped | `bf-contextual-menu` + runtime | — |
| `cta` | Missing | — | — |
| `data-spotlight` | Missing | — | Out of scope |
| `divided-section` | Missing | — | — |
| `divider` | Missing | — | Removed in scope trim |
| `equal-height-row` | Superseded | `bf-grid`, `bf-cluster` | — |
| `form-help-text` | Shipped | `bf-form-help` | — |
| `form-password-toggle` | Missing | — | — |
| `forms` | Partial | `bf-field`, `bf-control`, `bf-input`, `bf-select` | Missing: group wrapper, validation icons |
| `form-tick-elements` | Shipped | `bf-checkbox`, `bf-radio` | Minor: indeterminate state |
| `form-validation` | Shipped | `bf-validation-message` | — |
| `grid` | Superseded | `bf-grid` (Canonical 4/8/16) | — |
| `grid-8` | Superseded | `bf-grid` @container | — |
| `heading-icon` | Missing | — | — |
| `headings` | Superseded | tier role tokens | — |
| `icons` | Shipped | `bf-icon` | Search / close / chevron plus success/error-grey state glyphs shipped; broader catalog can follow on demand |
| `image` | Missing | — | — |
| `in-page-navigation` | Missing | — | — |
| `links` | Partial | semantic link styles, `bf-skip-link` | Missing: back-to-top, anchor, inverted |
| `lists` | Shipped | prose lists, `bf-list`, `bf-inline-list`, `bf-list-tree` | — |
| `list-tree` | Shipped | `bf-list-tree` + runtime | — |
| `logo-section` | Missing | — | Out of scope |
| `matrix` | Missing | — | Removed in scope trim |
| `media-container` | Missing | — | — |
| `media-object` | Missing | — | — |
| `modal` | Shipped | `bf-modal` + runtime | — |
| `muted-heading` | Missing | — | — |
| `navigation` | Partial | `bf-side-navigation`, `bf-top-navigation` + runtime | Missing: mega-nav |
| `navigation-reduced` | Missing | — | — |
| `notifications` | Missing | — | — |
| `pagination` | Shipped | `bf-pagination` | — |
| `pull-quotes` | Superseded | prose `blockquote` | — |
| `rule` | Superseded | `bf-rule`, prose `hr` | — |
| `search-and-filter` | Shipped | `bf-search-and-filter` + runtime | — |
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
| `table-expanding` | Missing | `bf-table` base only | — |
| `table-icons` | Shipped | `bf-table` + `.is-icon-placeholder` cells | — |
| `table-mobile-card` | Missing | `bf-table` base only | — |
| `table-of-contents` | Missing | — | — |
| `table-sortable` | Missing | `bf-table` base only | — |
| `tabs` | Shipped | `bf-tabs` + runtime | — |
| `tooltips` | Shipped | `bf-tooltip` + runtime | — |

Permanently excluded (deprecated in Vanilla): `article-block`, `blog`, `newsletter-signup`, `pricing-block`, `resources-block`, `suru`.
