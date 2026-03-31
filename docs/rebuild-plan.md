# Rebuild Plan

## Goal

Provide the **minimal testing surface** for evaluating the canonical typography, spacing, and grid specs. Output: spec examples, screenshots for specs, edge-case isolation for all non-deprecated Vanilla components — not a finished design-system site.

## Scope In

- typography tokens and baseline-aligned typescale (all three tiers)
- prose flow and element-owned editorial spacing
- baseline utilities, section and strip rhythm
- `bf-grid`, `bf-stack`, `bf-cluster`, `bf-section` layout primitives
- spec-focused demo pages for screenshot capture and tier comparison
- **all non-deprecated Vanilla components** as minimal `bf-*` ports (for edge-case isolation)
- clean font swapping: Ubuntu Sans default, IBM Plex available as a brand-ops tier

## Scope Out

- faux documentation-site framing and placeholder copy
- large compatibility alias layers
- `ui-*` role classes (component typography uses body/heading tokens directly)
- `data-*` CSS selectors for any styling purpose
- ad-hoc layout scaffolding beyond the three layout primitives

## Principles

1. Editorial baseline alignment is immutable; app-tier follows the Canonical zero-nudge simplification.
2. Baseline compensation and semantic spacing are separate responsibilities.
3. Editorial spacing is element-owned by default.
4. Layout primitives are explicit and small.
5. Compatibility concerns should not drive the public API here.
6. Additions must earn their place as durable primitives.
7. Single-direction margin declarations: all text-bearing elements are reset to `margin: 0` inside the theme scope, then only `margin-block-end` is reintroduced by styled roles via `var(--bf-semantic-space-after)`. No element ever carries `margin-block-start` from the system.
8. Element qualifiers align by default: bare `<h1>`–`<h6>`, `<p>`, and `<figcaption>` inside a `bf-theme` scope receive baseline-alignment nudges, font sizing, and spacing automatically. Role classes (`bf-h1`, `bf-body`, etc.) exist only as overrides.
9. Flat `bf-` naming convention: all component selectors use `bf-` prefix with single-dash separation. Variants and states use `is-*` class modifiers **only**. No BEM `__`/`--`. The `p-*` Vanilla prefix is retired from the shipped surface.
10. Dogfooding: demo pages must use only framework vocabulary (`bf-*` classes, `is-*` modifiers). If a demo needs something the framework cannot express, add the missing primitive.
11. **No styled `data-*` attributes**: `data-*` may only be used as JS-only query hooks (event binding, DOM lookup) with **zero** CSS rules targeting them. All visual styling goes through `bf-*` or `is-*` class selectors.
12. No decorative containers: non-component containers must never carry backgrounds, borders, or inner padding. Only framework components may have visual decoration.
13. Only three layout primitives for page structure: `bf-grid`, `bf-stack`, `bf-cluster`. Section spacing uses `bf-section` / `bf-section.is-shallow` / `bf-section.is-deep`.
14. **No `ui-*` roles**: component typography derives from body/h5/h6 tier tokens. No separate `ui-heading`, `ui-small`, `ui-small-caps`, or `ui-x-small` role classes.
15. **Minimal demo content**: all demo text is Latin lorem ipsum. No explanatory prose, marketing copy, or framework documentation in demos.

## Demo rules (reference)

- Demo shell: minimal shared page chrome (hamburger page list, light/dark, baseline-grid, tier control) on every page, excluded from screenshots.
- Use only package-side `bf-*` primitives. If a demo needs something the framework cannot express, add the missing primitive.
- Page-chrome infrastructure uses `pc-*` class selectors (not `data-*`). JS-only hooks may use `data-*` attributes but they must have zero CSS.
- All descriptive text in living-spec pages must be Latin lorem ipsum — no explanatory wording about the framework.
- No backgrounds, borders, or padding on layout containers. Only framework components may carry visual decoration.
- `/demo/` index is the primary combined specimen surface. Documentation tier is deprioritized.
- App-shell rehearsal is scoped to panel density, close-button, header spacing, and sliding/resizable aside.

### Active parity filter

All non-deprecated Vanilla components are in scope for minimal `bf-*` demo ports. These **deprecated** Vanilla patterns are permanently excluded: `article-block`, `article-pagination`, `blog`, `newsletter-signup`, `suru`.

## Remaining phases

### Phase 8 — Data-attribute cleanup + ui-class removal

- [ ] Migrate all `data-bf-tone` CSS selectors to `is-dark`/`is-light` classes
- [ ] Migrate all `data-space` CSS selectors to `is-flush`/`is-tight`/`is-loose` classes
- [ ] Migrate all `data-align` CSS selectors to `is-end` class
- [ ] Migrate `[data-spec-shell]` to `.spec-shell` class
- [ ] Remove `ui-heading`, `ui-small`, `ui-small-caps`, `ui-x-small` from all tier configs
- [ ] Update all HTML pages and JS files for new class-based API
- [ ] Delete `examples/app-tier/` entirely

### Phase 4 - Concept hardening

- [ ] Add any missing validation needed to protect the baseline invariant

### Phase 5 - Tier and engine refactor (partially complete)

- [x] Split tier choice from baseline engine choice — tiers now switch via `.bf-tier-*` class on the theme root; cap engine is demoted to `.bf-engine-cap` demo overlay
- [x] Make `.bf-tier-app` a true zero-nudge, container-owned runtime line — layout containers (Stack, Cluster, Stage-shell) reset child spacing; app tier overrides zero all nudges
- [x] Simplify per-element CSS: literal values instead of 10-variable alignment chain; 3 component vars per role instead of 8
- [x] Tier override pipeline: `TierOverride` type + `buildTierOverrides()` generates scoped overrides for all non-base tiers in a single stylesheet
- [ ] Parasite class sweep — remove remaining downstream component aliases

### Phase 6 — Font switch + canonical alignment ✅

- [x] 6a: Download Ubuntu Sans Variable `.woff2`/`.ttf`, update `setup:demo-font` script, update all three tier configs to reference it
- [x] 6b: Align editorial weights to canonical (500/200/500/300/550/550), remove H5 `uppercase`
- [x] 6c: Overhaul documentation tier — set `baselineUnit: 0.25`, sizes/weights/lineHeights/spaceAfter to match `docs-typescale/config/typography-config-docs.json` exactly
- [x] 6d: Regenerate font metrics, nudge tokens, and CSS for all tiers
- [x] 6e: Rebuild, run tests — all pass (build validation, component baselines, behavior)

### Phase 7 — Demo and parity cleanup ✅

- [x] Generate spec examples from `grid-examples.prompt.md` and `spacing-examples.prompt.md` — all 9 grid + 10 spacing example pages already exist in `examples/`
- [x] Visual parity audit against Vanilla for remaining `Partial` rows: `forms`, `navigation`, `table-icons`, `links`, `lists`, `icons` — full audit completed; findings recorded in parity snapshot gap notes below
- [x] Verify remaining controls gallery regressions: chips use `all-small-caps` (correct, not uppercase), button backgrounds match page (`var(--bf-color-background-default)` = `#ffffff`), all body-text UI at `font-weight: 400`
- [x] Controls page cleanup: remove hero/summary/marketing copy, stop styling `data-*` attributes (migrated to `.bf-controls-*` class selectors), fix input/button padding symmetry (`--bf-control-baseline-reserve` zeroed in app tier), fix sidenav drawer (`backdrop-filter` moved off sticky root to `[data-page-chrome-bar]`), add index page at `/` and `/demo/`
- [x] Continue visual parity verification against Vanilla for all controls — audit complete: select/switch/search-box/chips/segmented-control at FULL parity; input/checkbox/radio/validation at HIGH; buttons at LOW (missing semantic variant modifiers despite tokens existing)

## Canonical spec conformance audit (2026-03-31, updated 2026-04-01)

Reference specs: **Typeface v0.3**, **Spacing v0.4**, **Grid v0.3**.
Canonical config source of truth: `docs-typescale/config/typography-config-{editorial,docs,apps}.json`.
All font, weight, size, lineHeight, and spaceAfter drift items resolved with the Ubuntu Sans font switch (Phase 6). All tiers now match canonical exactly.

### Grid — PASS

| Rule | Spec | Foundry | Status |
|------|------|---------|--------|
| Column counts | 4 / 8 / 16 | 4 / 8 / 16 | Match |
| Power-of-2 spans | 4:[4,2,1] 8:[8,4,2,1] 16:[16,8,4,2,1] | Same | Match |
| Small threshold (4→8) | 620px | `38.75rem` = 620px | Match |
| Large threshold | 1036px | `64.75rem` = 1036px | Match |
| X-Large threshold (8→16) | 1681px | `105.0625rem` = 1681px | Match |
| X-Small gutters/margins | 1rem / 1rem | 1rem / 1rem | Match |
| Small gutters/margins | 1.5rem / 1.5rem | 1.5rem / 1.5rem | Match |
| Large gutters (sites/docs) | 2rem | 2rem | Match |
| Large gutters (apps) | 1.5rem | 1.5rem (`.bf-tier-app` override) | Match |
| Large margins | 2rem | 2rem | Match |
| Row gap = gutter | Yes | Same var for both axes | Match |
| Column switching queries | Container-based (all tiers) | `@container` queries (universal) | Match — `.bf-page` is the canonical grid container for all tiers |
| App page fluid | No max-width | `.bf-tier-app .bf-page { max-inline-size: none }` | Match |
| Editorial page max-width | Centered + capped | `.bf-page { max-inline-size: var(--bf-content-max-width) }` | Match — container width mirrors viewport in production |
| Gutter/margin escalation | Viewport-based | `@media` queries (all tiers) | Match |

### Spacing — PASS (with documentation-tier drift)

| Rule | Foundry | Status |
|------|---------|--------|
| Element-owned spacing (editorial/docs) via bottom-only margin | `margin: 0 0 var(--bf-semantic-space-after)` | Match |
| No `margin-top` anywhere | `margin: 0` reset, then bottom-only | Match |
| Container-owned (app tier) — children spacing-neutral | `.bf-tier-app` zeroes `--bf-semantic-space-after` | Match |
| Last-child reset | `.bf-prose > :last-child { margin-bottom: 0 }` | Match (Option A) |
| Nudge = `padding-top` | `padding-block-start: var(--bf-selected-start-nudge)` | Match |
| Compensation = bU − nudge | `calc(var(--bf-baseline) - nudgeTop)` | Match |
| `margin-bottom` = semantic + compensation | Split into sem var + end-nudge padding | Match |
| App tier = zero nudge | `.bf-tier-app` zeroes all nudges | Match |
| Button inline padding 16px (no border) / 15px (1px border) | `controlInlinePaddingRem: 1` + border compensation | Match |
| Input padding 16px (bottom-only border unchanged) | 16px stays | Match |

Drift items:
- **Documentation tier `spaceAfter`**: canonical config has headings=1 (4px), body=3 (12px); foundry has all=2. **Needs fix.**
- **Documentation tier `baselineUnit`**: canonical config = 0.25rem (4px); foundry = 0.5rem (8px). **Needs fix.**

### Typescale — App tier PASS; Editorial + Documentation FAIL

**App tier: full match.** Every size, weight, lineHeight, and style matches `docs-typescale/config/typography-config-apps.json`.

**Editorial tier — weight drift** (all sizes match):

| Role | Canonical weight | Foundry weight | Note |
|------|-----------------|----------------|------|
| H1 | 500 | 600 | IBM Plex range was 100–700; Ubuntu Sans goes 100–900 |
| H2 | 200 | 400 | Plex doesn't go below 300 |
| H3 | 500 | 600 | |
| H4 | 300 | 400 | |
| H5 | 550 | 600 + uppercase | `uppercase` not in spec |
| H6 | 550 | 600 | |

Root cause: weights were adapted for IBM Plex Sans's narrower axis. Font switch (Phase 6) unblocks this.

**Documentation tier — heavy drift:**

| Role | Canonical | Foundry | Issue |
|------|-----------|---------|-------|
| baselineUnit | 0.25rem (4px) | 0.5rem (8px) | Wrong bU |
| H1 size | 2rem | 2.25rem | Wrong |
| H2 size | 2rem | 2.25rem | Wrong |
| H3 size | 1.5rem | 1.375rem | Wrong |
| H4 size | 1.5rem | 1.375rem | Wrong |
| H5 size | 1.125rem | 0.9375rem | Wrong |
| H6 size | 1.125rem | 0.9375rem | Wrong |
| body size | 0.875rem | 0.9375rem | Wrong |
| All weights | 500/300 pairs | 600/400 pairs | Plex-adapted |
| All lineHeights | bU=4px multiples | bU=8px multiples | Wrong bU basis |
| Heading spaceAfter | 1 | 2 | Wrong |
| Body spaceAfter | 3 | 2 | Wrong |

Root cause: documentation tier was never aligned to canonical; values are ad-hoc Plex adaptations.

### Fix plan (execution order) — RESOLVED ✅

All typescale drift resolved in Phase 6. All tiers now match canonical exactly.

## Current architectural stance (condensed)

- Editorial = baseline-aligned, element-owned spacing. App = zero-nudge, container-owned.
- `bf-grid` is the only grid primitive (`4`/`8`/`16` columns, power-of-2 spans, `620px`/`1681px` thresholds).
- Tier-first build: `editorial`, `documentation`, `app`.
- Metrics-derived nudges default for baseline surfaces; `.bf-engine-cap` opt-in; `.bf-tier-app` zeroes nudges.
- Demo shell dogfoods `bf-*` and `is-*` only. No `data-*` attribute styling.
- No `ui-*` role classes — component typography derives from body/heading tier tokens.
- All non-deprecated Vanilla components in scope for minimal `bf-*` demo ports.
- Ubuntu Sans Variable is the production font for all tiers; IBM Plex reserved for brand-ops preset.

## Vanilla Pattern Parity Snapshot (updated 2026-03-30)

This is the bird's-eye inventory for Vanilla pattern-layer parity. The source of truth for the inventory is `vanilla-framework/scss/_patterns_*.scss`, which currently yields 65 pattern entries.

Status meanings:

- `Shipped` — `baseline-foundry` exposes a package-side `bf-*` surface and already exercises it in demos and/or runtime modules.
- `Partial` — some useful primitive exists, but the full Vanilla pattern is not yet represented as a clear package-side feature.
- `Superseded` — Foundry intentionally covers the same job with smaller primitives or the tier model instead of aiming for a 1:1 pattern port.
- `Missing` — no current package-side equivalent.

Summary counts: `Shipped 24`, `Partial 7`, `Superseded 9`, `Missing 25`.

| Vanilla pattern | Status | Current Foundry surface | Remaining gap / note |
|---|---|---|---|
| `accordion` | Shipped | `bf-accordion`, runtime module, saved demo | Keep aligned with engine/tier cleanup |
| `article-block` | Missing | None | No package-side equivalent yet |
| `article-pagination` | Partial | `bf-pagination` | Generic pagination exists; no article-specific wrapper/pattern |
| `badge` | Shipped | `bf-badge` | Variant coverage can expand if downstream pressure appears |
| `blog` | Missing | None | Out of current repo scope |
| `breadcrumbs` | Shipped | `bf-breadcrumbs` | Current surface covers the core pattern |
| `buttons` | Shipped | `bf-button`, `bf-actions` | Color tokens for positive/negative exist in theme but no `.bf-button.is-positive`/`.is-negative` modifiers generated. Missing: brand, link, processing, icon button variants. Select, switch, search-box, chips, segmented-control all at FULL parity. Checkbox/radio minor gap: indeterminate state. |
| `card` | Shipped | `bf-card` | Shared card surface exists; avoid demo-local shell framing |
| `chip` | Shipped | `bf-chip` | Neutral/action semantics track Vanilla tokens |
| `code-snippet` | Shipped | `bf-code-snippet`, runtime module | Keep demo and runtime in sync |
| `contextual-menu` | Shipped | `bf-contextual-menu`, runtime module | Core menu/dropdown behavior is upstream |
| `cta` | Missing | None | No package-side equivalent yet |
| `data-spotlight` | Missing | None | Out of current repo scope |
| `divided-section` | Missing | None | No dedicated equivalent |
| `divider` | Missing | None | Removed from the package surface after the parity scope trim |
| `equal-height-row` | Superseded | `bf-grid`, `bf-cluster`, `bf-stage-shell` | Foundry prefers layout primitives over a dedicated equal-height pattern |
| `form-help-text` | Shipped | `bf-form-help`, `bf-form-help.is-tight` | Core helper-text parity is upstream |
| `form-password-toggle` | Missing | None | No password-toggle pattern yet |
| `forms` | Partial | `bf-field`, `bf-control`, `bf-input`, `bf-select`, file/color/range demos | Missing: form layout modes (`.is-inline`/stacked), form group wrapper, password toggle, validation icons. Core individual controls ship. |
| `form-tick-elements` | Shipped | `bf-checkbox`, `bf-radio` | Core tick elements are upstream |
| `form-validation` | Shipped | `bf-validation-message`, validation states | Validation surface ships and is demo-covered |
| `grid` | Superseded | `bf-grid`, `bf-grid--controls`, `bf-page`, `bf-section` | Foundry uses the Canonical-inspired `4 / 8 / 16` primitive instead of VF grid parity |
| `grid-8` | Superseded | `bf-grid` container queries | Separate `grid-8` pattern is intentionally collapsed into the main grid primitive |
| `heading-icon` | Missing | None | No direct equivalent |
| `headings` | Superseded | tier role tokens, `bf-h1`…`bf-h6` utilities, semantic element styling | Tier/type system replaces a separate headings pattern layer |
| `icons` | Partial | themed internal chevrons and control glyphs | Missing: general `.bf-icon.is-{name}` class system + size modifiers. Only 2 icons exist as CSS custom props (chevron, search). Need at least 10 core icons (chevron×4, close, search, plus, minus, error, success) before lists/tables can use them. |
| `image` | Missing | None | No dedicated image pattern |
| `in-page-navigation` | Missing | None | No dedicated equivalent yet |
| `links` | Partial | semantic link styling in generated CSS | Missing: soft link (`.bf-link.is-soft`), skip link (`.bf-skip-link` — accessibility), back-to-top, anchor heading link, inverted link. |
| `lists` | Partial | prose lists, `bf-list-tree` | Missing: `.bf-list` + `.bf-list-item` with baseline-grid-aligned padding, `.bf-list.is-divided`, `.bf-inline-list` (+ `.is-middot`), ticked/crossed items. Stepped list and split columns deferred. |
| `list-tree` | Shipped | `bf-list-tree`, runtime module | Saved demo and runtime coverage exist |
| `logo-section` | Missing | None | Out of current repo scope |
| `matrix` | Missing | None | Dense parameter-matrix regression surface was removed with the scope trim |
| `media-container` | Missing | None | No dedicated equivalent |
| `media-object` | Missing | None | No dedicated equivalent |
| `modal` | Shipped | `bf-modal`, runtime module | Core modal surface is upstream |
| `muted-heading` | Missing | None | No dedicated equivalent |
| `navigation` | Partial | application shell, drawer helpers, `bf-side-navigation` | Side-nav is comprehensive. Missing: top navigation bar (horizontal items/dropdowns), sliding mobile nav, search-in-nav. Top-nav is highest-impact gap in entire navigation area. |
| `navigation-reduced` | Missing | None | No reduced-navigation pattern |
| `newsletter-signup` | Missing | None | Out of current repo scope |
| `notifications` | Missing | None | No notification pattern yet |
| `pagination` | Shipped | `bf-pagination` | Core page-navigation surface is upstream |
| `pricing-block` | Missing | None | Out of current repo scope |
| `pull-quotes` | Superseded | prose `blockquote` styling | Editorial quote handling lives in prose rather than a separate pattern |
| `resources-block` | Missing | None | Out of current repo scope |
| `rule` | Superseded | `bf-rule`, prose `hr` | Core editorial rule behavior ships without a separate VF pattern wrapper |
| `search-and-filter` | Shipped | `bf-search-and-filter`, runtime module | Core filter/search compound surface is upstream |
| `search-box` | Shipped | `bf-search-box` | Saved demo coverage exists |
| `section` | Superseded | `bf-section`, `bf-page`, `bf-fixed-width` | Foundry uses smaller layout primitives instead of VF section parity |
| `segmented-control` | Shipped | `bf-segmented-control` | Core segmented buttons are upstream |
| `separator` | Superseded | `bf-rule` | Rule primitives cover the same job without a dedicated divider surface |
| `side-navigation` | Shipped | `bf-side-navigation`, runtime module | App-tier parity surface exists |
| `side-navigation-expandable` | Shipped | expandable behavior is included in `bf-side-navigation` | No separate split needed in Foundry |
| `slider` | Shipped | `bf-slider`, range controls runtime | Horizontal/stacked slider pairing is upstream |
| `status-label` | Shipped | `bf-status-label`, `bf-label` | Core status surface is upstream |
| `strip` | Superseded | `bf-strip` | Foundry strip primitive replaces VF strip parity |
| `suru` | Missing | None | Out of current repo scope |
| `switch` | Shipped | `bf-switch` | Core switch surface is upstream |
| `table-expanding` | Missing | `bf-table` base only | Expanding-row variant does not exist yet |
| `table-icons` | Partial | `bf-table` base only | Missing: `.bf-table-cell.is-icon-placeholder` (padding-left reservation + negative margin for first icon child). Depends on icon system existing first. |
| `table-mobile-card` | Missing | `bf-table` base only | Mobile-card variant does not exist yet |
| `table-of-contents` | Missing | None | No dedicated equivalent |
| `table-sortable` | Missing | `bf-table` base only | Sortable behavior/pattern does not exist yet |
| `tabs` | Shipped | `bf-tabs`, `bf-tabs.is-equal`, panel-tabs demo, runtime module | Core tab surface is upstream |
| `tooltips` | Shipped | `bf-tooltip`, runtime module | Core tooltip surface is upstream |

Near-term remaining work should come from the `Partial` rows that still matter for the current product direction: `forms`, `navigation`, `table-icons`, `links`, `lists`, and `icons`. Treat the rows named in the active parity filter above as inventory-only unless scope changes.

### Parity audit priority summary (2026-04-01)

Ranked by downstream impact. **Only pursue if downstream swap pressure appears** — this repo scopes to durable primitives, not broad framework parity.

| Priority | Gap | Pattern area |
|---|---|---|
| P1 | Top navigation bar (`.bf-top-navigation`) | navigation |
| P1 | Icon class system (`.bf-icon.is-{name}` + size modifiers) | icons |
| P1 | Basic + divided list (`.bf-list`, `.is-divided`) | lists |
| P2 | Skip link (`.bf-skip-link`) — accessibility | links |
| P2 | Soft link (`.bf-link.is-soft`) | links |
| P2 | Form layout modes (`.bf-form.is-inline`) | forms |
| P2 | Inline list + middot (`.bf-inline-list`, `.is-middot`) | lists |
| P3 | Table cell icon placeholder | table-icons |
| P3 | Ticked/crossed list items | lists |
| P3 | Navigation dropdowns | navigation |
