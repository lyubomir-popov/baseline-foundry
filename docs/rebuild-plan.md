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
10. Dogfooding: demos use only `bf-*` / `is-*`. Missing primitive → add it.
11. No styled `data-*` attributes — JS-only hooks with zero CSS. All styling via `bf-*` / `is-*`.
12. No decorative containers: non-components carry no backgrounds, borders, or padding.
13. Three layout primitives: `bf-grid`, `bf-stack`, `bf-cluster`. Section spacing via `bf-section` modifiers.
14. No `ui-*` roles: component typography derives from body/heading tier tokens.
15. Minimal demo content: Latin lorem ipsum only.

## Demo rules

- Shared page chrome (hamburger, light/dark, baseline-grid, tier control) on every page, excluded from screenshots.
- Use only `bf-*` primitives. Missing? Add the primitive.
- Page-chrome infra uses `pc-*` classes. `data-*` for JS hooks only (zero CSS).
- All demo text = Latin lorem ipsum.
- No decoration on layout containers.
- `/demo/` index is the primary specimen surface.
- App-shell rehearsal: panel density, close-button, header spacing, sliding/resizable aside.
- Deprecated patterns permanently excluded: `article-block`, `article-pagination`, `blog`, `newsletter-signup`, `suru`.

## Current architecture

- Editorial = baseline-aligned, element-owned spacing. App = zero-nudge, container-owned.
- **Literal CSS values** — `margin-bottom`, `padding-block-start`, `padding-block-end` are literal per role. Margin-bottom = `spaceAfter - baselineUnit`.
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

- [ ] Parasite class sweep — remove remaining downstream component aliases
- [ ] Baseline invariant validation — add missing build-time checks
- [ ] Typographic specimen page — editorial multi-column layout demo at `demo/spec/typographic-specimen.html`
- [ ] Page chrome polish — cluster layout for switches + tier dropdown (side by side, not stacked)

### Parity gaps (pursue on downstream demand)

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
