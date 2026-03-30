# Rebuild Plan

## Goal

Ship a lean, screenshot-oriented design-system foundation centered on:

- real font metrics
- baseline-aligned typography
- element-owned editorial spacing
- explicit grid and layout primitives
- spec-first demo pages that can switch tiers over the same content

This repo is not the place for broad framework parity or faux documentation-site chrome.

## Scope In

- typography tokens
- prose flow
- spacing rules
- baseline utilities
- section and strip rhythm
- stack, cluster, fixed-width, and grid primitives
- spec-focused demo pages for screenshot capture and tier comparison
- small demo and validation surface

## Scope Out For Now

- broad application component sets
- navigation systems
- feedback components
- tables, forms, and shell chrome as first-class package goals
- faux documentation-site framing and placeholder copy
- continued parity work on explicitly removed Vanilla patterns
- large compatibility alias layers

## Principles

1. Editorial baseline alignment is immutable; app-tier follows the Canonical zero-nudge simplification.
2. Baseline compensation and semantic spacing are separate responsibilities.
3. Editorial spacing is element-owned by default.
4. Layout primitives are explicit and small.
5. Compatibility concerns should not drive the public API here.
6. Additions must earn their place as durable primitives.
7. Single-direction margin declarations: all text-bearing elements are reset to `margin: 0` inside the theme scope, then only `margin-block-end` is reintroduced by styled roles via `var(--bf-semantic-space-after)`. No element ever carries `margin-block-start` from the system. This follows the Harry Roberts single-direction margin pattern and keeps vertical rhythm predictable when elements compose in any order.
8. Element qualifiers align by default: bare `<h1>`–`<h6>`, `<p>`, and `<figcaption>` inside a `bf-theme` scope receive baseline-alignment nudges, font sizing, and spacing automatically. Role classes (`bf-h1`, `bf-body`, etc.) exist only as overrides — for cross-element styling (e.g. a `<p>` that should look like a heading) — not as a prerequisite for basic alignment.
9. Flat `bf-` naming convention: all component selectors use the `bf-` prefix with single-dash separation (`bf-form-group`, `bf-accordion-tab`, `bf-search-box`). No BEM double underscores (`__`) or double dashes (`--`). Variants and states use `is-*` modifiers or `data-*` attributes (`is-dense`, `is-base`, `data-align="end"`). The inherited `p-*` Vanilla prefix is retired from the shipped surface; public runtime CSS, demos, and verification now target only `bf-*` names.
10. Dogfooding: demo pages must use only framework vocabulary (`bf-*` classes, `is-*` / `data-*` modifiers). No `component-demo-*` scaffolding classes that duplicate what the framework already provides. If a demo needs local styling that the framework cannot express, that is a signal the framework is missing a primitive — add the primitive, don't paper over the gap with demo-local CSS.

## Demo And Parity Reset (updated 2026-03-30)

### Primary job

The demo surface is not trying to behave like a public design-system website. Its job is to generate simple, screenshot-stable examples for the specs while letting the same specimen switch quickly between tiers. Any content, chrome, or framing that does not help that job is noise.

### Demo-shell rules

- Keep the shell minimal: light/dark switch, baseline-grid switch, editorial/app tier control, and specimen content only on the home page.
- Keep the combined home specimen off `bf-page`. `--bf-content-max-width` is a measured editorial-page constraint, not a grid-proof constraint; prose should stay readable through `bf-prose`, while the wide grid specimen must be able to expand past the `1681px` 16-column threshold.
- Remove card framing from the spec pages. If a boxed surface is genuinely needed later, port the real Vanilla card behavior, including the border-thickness-aware rhythm compensation, instead of inventing ad hoc shell styling.
- Keep tier controls on the same Vanilla-aligned control-height and inset contract as the rest of the form/button surface.
- Use only package-side `bf-*` primitives in the demo shell. If the required surface does not exist yet, add the primitive instead of adding demo-local stand-ins.

The `/demo/` index is the primary combined specimen surface now: a simple tier and tone control strip at the top, then typography, spacing, and grid examples underneath. The documentation tier stays generated, but it is deprioritized in the main selector for now.

### Immediate spec-example plan

1. Rebuild the typography chapter as a minimal `h1`-through-`h6` plus paragraph specimen page.
2. Rebuild the spacing chapter as a side-by-side editorial/app comparison that shows element-owned spacing on one side and nested container-owned gaps on the other.
3. Rebuild the grid chapter around real Canonical spec figures rather than placeholder copy, using hard-stop background guides to show columns and gutters. Treat `canonical-specs/specs/grid/v0.3/images/` and the corresponding Markdown as the source of truth for those specimen layouts.
4. Extend the grid chapter beyond the already-landed home-page `4 / 8 / 16` specimens with the nested-grid example, the centered viewport/editorial max-width example, and the application example with site navigation plus an 8-column main region.

### App-shell follow-up

Keep rehearsing the real application shell only where it supports downstream swap work: panel shadow, panel/header spacing, close-button treatment, and sliding/resizable aside structure should be pulled toward Vanilla within the current token/runtime model rather than through hardcoded one-off values.

### Font direction to evaluate

Evaluate making Ubuntu Sans Variable the default project font while keeping IBM Plex as the panel-specific line. This is a metric and runtime decision, not a demo-only aesthetic swap.

### Active parity filter

The parity snapshot below remains a full inventory, but it is not a blanket implementation backlog. The following Vanilla patterns are removed from active parity scope unless a later downstream need reopens them: `article-block`, `article-pagination`, `blog`, `divider`, `in-page-navigation`, `list-tree`, `matrix`, `media-container`, `media-object`, `navigation-reduced`, `newsletter-signup`, `status-label`, `suru`, `table-expanding`, `table-mobile-card`, `table-of-contents`, `table-sortable`, and `tooltips`.

## Remaining phases

### Phase 4 - Concept hardening

- [ ] Add any missing validation needed to protect the baseline invariant

### Phase 5 - Tier and engine refactor

- [ ] Split tier choice from baseline engine choice so `.bf-tier-*` and `.bf-engine-*` can switch independently at the top level
- [ ] Make `.bf-tier-app` a true zero-nudge, container-owned runtime line while editorial and other baseline-aligned surfaces remain engine-switchable
- [ ] Migrate text-bearing components so their internal baseline compensation follows the selected engine instead of relying on ad hoc control-height math alone
- [ ] Sweep parasite classes from all demo pages: replace every `component-demo-*` class that duplicates a framework primitive with the real `bf-*` equivalent; if a demo genuinely needs something the framework cannot express, add the missing primitive rather than keeping demo-local CSS

## Current architectural stance

- `portable-vertical-rhythm` remains the compatibility-heavy package.
- `baseline-foundry` is the clean forward line.
- Borrow only the parts of the older package that survive as lean primitives.
- Borrow from the Canonical spec where it sharpens the model, especially around editorial spacing and grid discipline.
- For Foundry's purposes, the meaningful seam is editorial vs app. Documentation can ride the editorial side for now instead of becoming a separate implementation track.
- The Canonical spacing spec is explicit about the app/editorial split: application UIs use container-owned spacing with prescribed zero nudges, while editorial flow keeps element-owned spacing and baseline alignment. Foundry should follow that seam instead of treating app-tier as a baseline-aligned variant of the editorial line.
- `bf-grid` is the only grid primitive now. Dense inspector rows and parameter matrices ride a `bf-grid--controls` recipe with control-span modifiers rather than preserving a second canonical grid surface.
- The grid model is fixed: `4` / `8` / `16` columns, power-of-2 spans, and Canonical container thresholds at `620px` and `1681px`.
- Grid column count is container-driven, while gutters and page margins remain token- and viewport-driven. Editorial/default surfaces widen to the looser large-breakpoint gutter, while `.bf-tier-app` stays denser.
- The build/runtime model stays tier-first: `editorial`, `documentation`, and `app` are first-class outputs, with the documentation tier generated but not treated as a separate primary demo track.
- Metrics-derived nudges remain the default only for baseline-aligned surfaces. `.bf-engine-cap` stays opt-in, and `.bf-tier-app` remains a non-baseline surface built around container-owned spacing and zero semantic spacing.
- The demo shell must dogfood `bf-*` primitives only. Use `bf-prose` for readable measure, but keep the screenshot-first home and wide grid specimens off `bf-page` so the 16-column proof can actually reach its threshold.
- Color semantics follow Vanilla's core light/dark token structure. Default light stays on white/grayscale/black, paper remains opt-in, and tiers do not get their own palette identities.
- Compact inline surfaces now route through explicit compact UI roles (`ui-heading`, `ui-small`, `ui-small-caps`, `ui-x-small`) plus Vanilla-style padding/min-width derivation. Do not collapse chips, badges, or status labels back onto body/h5 roles or generic baseline fractions.
- Baseline-box verification is for editorial/layout surfaces only. Dense compact inline specimens such as chips, badges, and status labels are verified by `npm run compare:inline-surfaces`, because Vanilla's own dense inline geometry is not a clean baseline-multiple box in the panel context.
- The remaining compact-inline parity question is small standalone badge width drift (about `0.8px`). Treat that as a follow-up judgment call, not as evidence that the compact-role model is wrong.
- Parity work is filtered by real downstream swap pressure. The inventory below is reference material, not a promise to port every remaining Vanilla pattern.
- Three design questions remain explicitly open: how row-style centered surfaces should relate to the engine model, whether the compact panel preset should tighten further after more swap rehearsal, and whether Ubuntu Sans Variable should replace IBM Plex outside the panel line.

## Vanilla Pattern Parity Snapshot (updated 2026-03-30)

This is the bird's-eye inventory for Vanilla pattern-layer parity. The source of truth for the inventory is `vanilla-framework/scss/_patterns_*.scss`, which currently yields 65 pattern entries.

Status meanings:

- `Shipped` — `baseline-foundry` exposes a package-side `bf-*` surface and already exercises it in demos and/or runtime modules.
- `Partial` — some useful primitive exists, but the full Vanilla pattern is not yet represented as a clear package-side feature.
- `Superseded` — Foundry intentionally covers the same job with smaller primitives or the tier model instead of aiming for a 1:1 pattern port.
- `Missing` — no current package-side equivalent.

Summary counts: `Shipped 25`, `Partial 8`, `Superseded 9`, `Missing 23`.

| Vanilla pattern | Status | Current Foundry surface | Remaining gap / note |
|---|---|---|---|
| `accordion` | Shipped | `bf-accordion`, runtime module, saved demo | Keep aligned with engine/tier cleanup |
| `article-block` | Missing | None | No package-side equivalent yet |
| `article-pagination` | Partial | `bf-pagination` | Generic pagination exists; no article-specific wrapper/pattern |
| `badge` | Shipped | `bf-badge` | Variant coverage can expand if downstream pressure appears |
| `blog` | Missing | None | Out of current repo scope |
| `breadcrumbs` | Shipped | `bf-breadcrumbs` | Current surface covers the core pattern |
| `buttons` | Shipped | `bf-button`, `bf-actions` | Positive/negative tokens exist; variant surface can still broaden |
| `card` | Shipped | `bf-card` | Shared card surface exists; avoid demo-local shell framing |
| `chip` | Shipped | `bf-chip` | Neutral/action semantics track Vanilla tokens |
| `code-snippet` | Shipped | `bf-code-snippet`, runtime module | Keep demo and runtime in sync |
| `contextual-menu` | Shipped | `bf-contextual-menu`, runtime module | Core menu/dropdown behavior is upstream |
| `cta` | Missing | None | No package-side equivalent yet |
| `data-spotlight` | Missing | None | Out of current repo scope |
| `divided-section` | Missing | None | No dedicated equivalent |
| `divider` | Shipped | `bf-divider` | Core horizontal/vertical block split is shipped |
| `equal-height-row` | Superseded | `bf-grid`, `bf-cluster`, `bf-stage-shell` | Foundry prefers layout primitives over a dedicated equal-height pattern |
| `form-help-text` | Shipped | `bf-form-help`, `bf-form-help.is-tight` | Core helper-text parity is upstream |
| `form-password-toggle` | Missing | None | No password-toggle pattern yet |
| `forms` | Partial | `bf-field`, `bf-control`, `bf-input`, `bf-select`, file/color/range demos | Core controls ship, but there is no single broad VF-style forms pattern layer |
| `form-tick-elements` | Shipped | `bf-checkbox`, `bf-radio` | Core tick elements are upstream |
| `form-validation` | Shipped | `bf-validation-message`, validation states | Validation surface ships and is demo-covered |
| `grid` | Superseded | `bf-grid`, `bf-grid--controls`, `bf-page`, `bf-section` | Foundry uses the Canonical-inspired `4 / 8 / 16` primitive instead of VF grid parity |
| `grid-8` | Superseded | `bf-grid` container queries | Separate `grid-8` pattern is intentionally collapsed into the main grid primitive |
| `heading-icon` | Missing | None | No direct equivalent |
| `headings` | Superseded | tier role tokens, `bf-h1`…`bf-h6` utilities, semantic element styling | Tier/type system replaces a separate headings pattern layer |
| `icons` | Partial | themed internal chevrons and control glyphs | No public icon catalog/pattern surface |
| `image` | Missing | None | No dedicated image pattern |
| `in-page-navigation` | Missing | None | No dedicated equivalent yet |
| `links` | Partial | semantic link styling in generated CSS | Base link treatment ships, but no broad VF links pattern suite |
| `lists` | Partial | prose lists, `bf-list-tree` | Editorial lists ship; wider list-pattern suite does not |
| `list-tree` | Shipped | `bf-list-tree`, runtime module | Saved demo and runtime coverage exist |
| `logo-section` | Missing | None | Out of current repo scope |
| `matrix` | Partial | parameter-matrix regression page | Pressure-test surface exists, but not yet a clean general package pattern |
| `media-container` | Missing | None | No dedicated equivalent |
| `media-object` | Missing | None | No dedicated equivalent |
| `modal` | Shipped | `bf-modal`, runtime module | Core modal surface is upstream |
| `muted-heading` | Missing | None | No dedicated equivalent |
| `navigation` | Partial | application shell, drawer helpers, `bf-side-navigation` | Foundry covers real shell/navigation slices, not the full VF navigation suite |
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
| `separator` | Superseded | `bf-divider`, `bf-rule` | Divider/rule primitives cover the same job |
| `side-navigation` | Shipped | `bf-side-navigation`, runtime module | App-tier parity surface exists |
| `side-navigation-expandable` | Shipped | expandable behavior is included in `bf-side-navigation` | No separate split needed in Foundry |
| `slider` | Shipped | `bf-slider`, range controls runtime | Horizontal/stacked slider pairing is upstream |
| `status-label` | Shipped | `bf-status-label`, `bf-label` | Core status surface is upstream |
| `strip` | Superseded | `bf-strip` | Foundry strip primitive replaces VF strip parity |
| `suru` | Missing | None | Out of current repo scope |
| `switch` | Shipped | `bf-switch` | Core switch surface is upstream |
| `table-expanding` | Missing | `bf-table` base only | Expanding-row variant does not exist yet |
| `table-icons` | Partial | `bf-table` base only | Generic table ships; icon-specific pattern does not |
| `table-mobile-card` | Missing | `bf-table` base only | Mobile-card variant does not exist yet |
| `table-of-contents` | Missing | None | No dedicated equivalent |
| `table-sortable` | Missing | `bf-table` base only | Sortable behavior/pattern does not exist yet |
| `tabs` | Shipped | `bf-tabs`, `bf-tabs.is-equal`, panel-tabs demo, runtime module | Core tab surface is upstream |
| `tooltips` | Shipped | `bf-tooltip`, runtime module | Core tooltip surface is upstream |

Near-term remaining work should come from the `Partial` rows that still matter for the current product direction: `forms`, `navigation`, `table-icons`, `links`, `lists`, and `icons`. Treat the rows named in the active parity filter above as inventory-only unless scope changes.
