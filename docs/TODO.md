# Rebuild Plan

## Goal

Provide the **minimal testing surface** for evaluating the canonical typography, spacing, and grid specs. Output: spec examples, screenshots, edge-case isolation for all non-deprecated Vanilla components — not a finished design-system site.

## Scope

**In:** typography tokens, baseline-aligned typescale (all tiers), prose flow, element-owned editorial spacing, baseline utilities, section/strip rhythm, `bf-grid`/`bf-stack`/`bf-cluster`/`bf-section` layout primitives, spec-focused demo pages, all non-deprecated Vanilla components as `bf-*` ports, Ubuntu Sans default + IBM Plex brand-ops tier.

**Out:** documentation-site framing, compatibility alias layers, `ui-*` role classes, `data-*` CSS selectors, ad-hoc layout scaffolding.

## Principles

1. Editorial baseline alignment is immutable; app-tier follows Canonical zero-nudge simplification.
2. Baseline compensation and semantic spacing are separate responsibilities.
3. Editorial spacing is element-owned by default.
4. Layout primitives are explicit and small.
5. Compatibility concerns should not drive the public API.
6. Additions must earn their place as durable primitives.
7. Single-direction margin declarations: `margin: 0` reset, then literal `margin-block-end` only (`spaceAfter - baselineUnit`). No `margin-block-start`.
8. Element qualifiers align by default: bare `<h1>`–`<h6>`, `<p>`, `<figcaption>` in `bf-theme` get nudges, sizing, spacing automatically.
9. Flat `bf-` naming: single-dash, `is-*` modifiers only, no BEM, no `p-*`.
10. Dogfooding: demos use only `bf-*` / `is-*`. Missing primitive → add it after confirmation from the user.
11. No styled `data-*` attributes — JS-only hooks with zero CSS. All styling via `bf-*` / `is-*`.
12. No decorative containers: non-components carry no backgrounds, borders, or padding.
13. Three layout primitives: `bf-grid`, `bf-stack`, `bf-cluster`. Section spacing via `bf-section` modifiers.
14. No `ui-*` roles: component typography derives from body/heading tier tokens.
15. Minimal demo content: Latin lorem ipsum only.

## Demo rules

- Shared page chrome (hamburger, light/dark, baseline-grid, tier control) on every page, excluded from screenshots.
- Use only `bf-*` primitives. Missing? Add the primitive.
- Page-chrome infra uses `bf-*` primitives only. If a primitive is missing, consult with user before adding. `data-*` for JS hooks only (zero CSS).
- All demo text = Latin lorem ipsum.
- No decoration on layout containers.
- `/demo/` index is the primary specimen surface.
- App-shell rehearsal: panel density, close-button, header spacing, sliding/resizable aside.
- Deprecated patterns permanently excluded: `article-block`, `article-pagination`, `blog`, `newsletter-signup`, `suru`.

## Current architecture

- Editorial = baseline-aligned, element-owned spacing. App = zero-nudge, container-owned.
- **Literal CSS values** — `margin-bottom`, `padding-block-start`, `padding-block-end` are literal per role. Margin-bottom = `spaceAfter` as authored in config (no hidden subtraction). ⚠️ *Review: the previous formula subtracted baselineUnit from spaceAfter, making config values opaque — user flagged this as wrong.*
- **Layout container child reset** — `.bf-stack > *`, `.bf-cluster > *`, `.bf-stage-shell > *` reset `margin-bottom: 0; padding-block: 0;` (§5.3).
- **Simplified component vars** — 3 per role: `--bf-{role}-line-height`, `--bf-{role}-nudge-start`, `--bf-{role}-nudge-end`.
- **Tier overrides via class toggle** — single editorial stylesheet with scoped `.bf-tier-app` / `.bf-tier-documentation` overrides. Tier switching = class toggle on `<body>`.
- `bf-grid`: `4`/`8`/`16` columns, power-of-2 spans, `620px`/`1681px` thresholds.
- Tier-first build: `editorial`, `documentation`, `app`.
- Metrics-derived nudges default; `.bf-engine-cap` is demo-only; `.bf-tier-app` zeroes nudges.
- Ubuntu Sans Variable for all tiers; IBM Plex reserved for brand-ops preset.

## Spec conformance

Reference: Typeface v0.3, Spacing v0.4, Grid v0.3. **All PASS** (resolved Phase 6).

## Active TODO

### Audit findings (living-spec review)

- [ ] **`l-*` alias cleanup in demos** — 4 demo files use Vanilla `l-*` layout classes (`l-application`, `l-navigation`, `l-aside`, `l-main`, etc.) instead of `bf-*` equivalents. Dogfooding rule requires `bf-*` only. Affected: `application-layout.html`, `application-shell.html`, `brand-layout-ops-sample.html`, `drawer-panel.html` (~25 instances).
- [ ] **`l-*` dual selectors in CSS** — `css-app-tier.ts`, `css-grid.ts`, and 3 runtime TS files (`application-layout.ts`, `resizable-aside.ts`, `panel-drawer.ts`) emit dual `l-*` / `bf-*` selectors. Decide: keep as compatibility layer (document as intentional) or prune to `bf-*` only.
- [ ] **`bf-theme--light` compatibility alias** — `css-components.ts:164` emits `.bf-theme.bf-theme--light` alongside `.bf-theme.is-light`. Inconsistent with `.is-dark` naming. Remove alias or document as deprecated.
- [ ] **`bf-panel-logo` dead selector** — CSS references `.bf-panel-logo` in header flex rule (line 782) but no HTML ever uses it. Remove from CSS.
- [ ] **`bf-label` redundant alias** — `bf-status-label` is duplicated as `bf-label` throughout `css-components.ts` (5 compound rules). Pick one name.
- [ ] **`bf-u-no-margin.is-bottom`** — utility class uses `u-` convention inside `bf-` scope (line 180). Reconcile naming or remove if unused.

### Pre-existing items

- [ ] **`spaceAfter - baselineUnit` opacity** — config says one value, CSS emits another. User flagged: authored `spaceAfter` should be the literal margin-bottom, not reduced by a hidden baselineUnit subtraction. Audit `src/css.ts` and `src/css-components.ts` for this formula and decide whether to make config values match output 1:1.
- [ ] Parasite class sweep — remove remaining downstream component aliases
- [ ] Baseline invariant validation — add missing build-time checks
- [ ] Typographic specimen page — editorial multi-column layout demo at `demo/spec/typographic-specimen.html`
- [ ] Page chrome polish — `pc-controls` cluster should not wrap when space is available; switches + tier dropdown side by side
- [ ] bf-panel audit — current generated surface (borders, headers, sticky, panel-title/controls/logo) is hallucinated; Vanilla's panels are application-layout-only and simpler. Strip to what's real or remove.
- [ ] controls.html cleanup — replace `bf-panel` bordered containers with plain grid classes; no need for decorative containers here

### New: OS tier (from inbox)

- [ ] **Rename panel tier → OS tier** — new 4th tier representing extreme OS-style density. Not in canonical specs; mark as addendum. Should follow editorial tier conventions (baseline-aligned, element-owned spacing) but much denser. Elevate to same level as editorial/app/documentation tiers.

### Parity gaps (pursue on downstream demand)

| Priority | Gap | Pattern area |
|---|---|---|
| P1 | Top navigation bar (`.bf-top-navigation`) | navigation |
| P1 | Icon class system (`.bf-icon.is-{name}` + size modifiers) | icons |
| P1 | Basic + divided list (`.bf-list`, `.is-divided`) | lists |
| P2 | Skip link (`.bf-skip-link`) — accessibility | links |
| ~P2~ | ~Soft link (`.bf-link.is-soft`)~ | ~links~ | **Deprecated — not accessible, do not port** |
| ~P2~ | ~Form layout modes (`.bf-form.is-inline`)~ | ~forms~ | **Superseded by `bf-cluster`** |
| P2 | Inline list + middot (`.bf-inline-list`, `.is-middot`) | lists |
| P3 | Table cell icon placeholder | table-icons |
| P3 | Ticked/crossed list items | lists |
| P3 | Navigation dropdowns | navigation |
