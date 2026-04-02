# Rebuild Plan

## Goal

Provide the **minimal testing surface** for evaluating the canonical typography, spacing, and grid specs. Output: spec examples, screenshots, edge-case isolation for all non-deprecated Vanilla components — not a finished design-system site.

## Scope

**In:** typography tokens, baseline-aligned typescale (all tiers), prose flow, element-owned editorial spacing, baseline utilities, section/strip rhythm, `bf-grid`/`bf-stack`/`bf-cluster`/`bf-section` layout primitives, spec-focused demo pages, all non-deprecated Vanilla components as `bf-*` ports, Ubuntu Sans canonical built-ins, and adjacent metric-derived surfaces for additional fonts when needed.

**Out:** documentation-site framing, compatibility alias layers, `ui-*` role classes, `data-*` CSS selectors, ad-hoc layout scaffolding.

## Principles

1. Editorial baseline alignment is immutable; app-tier follows Canonical zero-nudge simplification.
2. Baseline compensation and semantic spacing are separate responsibilities.
3. Editorial spacing is element-owned by default.
4. Layout primitives are explicit and small.
5. Compatibility concerns should not drive the public API.
6. Additions must earn their place as durable primitives.
7. Single-direction margin declarations: `margin: 0` reset, then literal `margin-block-end` where applicable. No `margin-block-start`.
8. Element qualifiers align by default: bare `<h1>`–`<h6>`, `<p>`, `<figcaption>` in `bf-theme` get nudges, sizing, spacing automatically.
9. Flat `bf-` naming: single-dash, `is-*` modifiers only, no BEM, no `p-*`.
10. Dogfooding: demos use only `bf-*` / `is-*`. Missing primitive → add it after confirmation from the user.
11. No styled `data-*` attributes — JS-only hooks with zero CSS. All styling via `bf-*` / `is-*`.
12. No decorative containers: non-components carry no backgrounds, borders, or padding.
13. Three layout primitives: `bf-grid`, `bf-stack`, `bf-cluster`. Section spacing via `bf-section` modifiers.
14. No `ui-*` roles: component typography derives from body/heading tier tokens.
15. Minimal demo content: Latin lorem ipsum only.
16. **Control padding follows the Vanilla model** — see "Control baseline-grid invariant" below.

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
- **Literal CSS values** — `margin-bottom`, `padding-block-start`, `padding-block-end` are literal per role.
- **Layout container child reset** — `.bf-stack > *`, `.bf-cluster > *`, `.bf-stage-shell > *` reset `margin-bottom: 0; padding-block: 0;` (§5.3).
- **Role-scoped typography vars** — root prose and body-sized components read tier-scoped family/size/weight/line-height vars instead of editorial literals.
- **Tier-selectable control padding vars** — inputs/selects/buttons can resolve block padding from real body nudges in nudged tiers and fixed fallback padding in `app`; no target-height back-calculation or legacy control block-size tokens.
- **Compensated row boxes for marginless repeats** — tables and similar text-between-rules rows use a fixed row box with an in-box border, nudge-derived padding, and a solved line-height instead of fake inset borders or zero-top padding hacks.
- **Independent surface contract** — each built-in tier emits a complete scoped token surface (`.bf-tier-editorial`, `.bf-tier-documentation`, `.bf-tier-app`) instead of inheriting editorial defaults through diffs. Tier switching = class toggle on any `.bf-theme` container, and multiple containers can coexist side by side.
- **Publishable surface manifest** — `dist/surfaces.json` stores every shipped surface's runtime tokens plus the font-metric artifact used to derive them. `app` keeps zero-nudge runtime tokens while still retaining its computed font metrics in the manifest.

### Control baseline-grid invariant

This is the Vanilla Framework's approach to input/button/select sizing. **Do not invent an alternative.** The trick:

1. **Symmetric padding** = `nudge − border-width`, applied to both `padding-block-start` and `padding-block-end`. This places the text baseline on the grid — identical to how a `<p>` with the same font aligns.
2. **No explicit `block-size`** target. The control's natural border-box height = `2 × nudge + line-height` (borders cancel because `padding = nudge − border`). That border box is typically **not** a whole multiple of the baseline unit, and that's fine.
3. **`margin-bottom` is two terms added together.** Formula: `margin-bottom = compensation + spaceAfter`, where `compensation = ceil(borderBoxHeight / baselineUnit) × baselineUnit − borderBoxHeight`. The compensation term gets from the control's natural border-box height to the next exact baseline multiple; `spaceAfter` preserves the semantic gap expected for body-sized text.
4. **The occupied block is what snaps to the grid.** `occupiedBlock = borderBoxHeight + margin-bottom`. When controls stack correctly, the top border and the text baseline repeat on grid lines, and the occupied block repeats on exact baseline steps. The border box alone is allowed to be fractional relative to the grid.

Consequences:
- There is no `--bf-control-block-size` variable. Controls do not target a height.
- There is no `.is-dense` modifier on individual controls. Density comes from the **tier** (different `baselineUnit` and nudge values).
- The quantity that must be a baseline multiple is the occupied block (`border box + margin-bottom`), not the raw border box.
- A paragraph, input, button, and select sharing the same font size all share the same baseline alignment when placed side by side.
- The `controlPadding()` back-calculation that previously existed was wrong — it reversed the causality (target height → derive padding) instead of letting consistent padding produce a natural height.
- `bf-grid`: `4`/`8`/`16` columns, power-of-2 spans, `620px`/`1681px` thresholds.
- Tier-first build: `editorial`, `documentation`, `app`.
- Metrics-derived nudges default; `.bf-engine-cap` is demo-only; `.bf-tier-app` zeroes runtime nudges but keeps stored metric data for audit and side-by-side comparison.
- Ubuntu Sans Variable for the canonical built-ins; other fonts belong in their own metric-derived surfaces, not in override diffs.

### Marginless row-box invariant

Use this for **tables and any other repeated rows where text is sandwiched between rules and `margin-bottom` is unavailable**. This is the row analogue of the control invariant above.

1. **Snap the row box, not the text node.** The repeated quantity is the cell or row border box because table rows and similar grouped rows cannot rely on inter-row margins.
2. **Keep the separator inside the box.** Use a real border that participates in the row-height math instead of an inset shadow that visually adds a line without consuming layout space.
3. **Use one symmetric row padding value.** General principle: in nudged tiers use the active body nudge; in zero-nudge tiers such as `app`, fall back to a fixed compact row padding value. Do not let the bottom padding collapse to a token that was never meant to be the row inset.
4. **Solve line-height from the target row block size.** Formula: `rowLineHeight = rowBlockSize − (2 × rowPadding) − borderWidth`. Choose the row height first as an exact multiple of the baseline unit, then let the text line-height be the remainder after symmetric padding and the in-box border are accounted for.
5. **Use a tier-specific fallback only when the tier intentionally abandons nudged alignment.** `app` can use a fixed compact row padding value instead of a body nudge, but the model stays the same: fixed row block size, symmetric padding, real in-box border, solved line-height.
6. **Verify rows as boxes, then visually inspect the text.** Box checks prove row rhythm; visual inspection confirms the symmetric text sandwich remains correct.

Consequences:
- The reusable recipe is: `rowBlockSize = n × baselineUnit`, `rowPadding = bodyNudge` in nudged tiers or `compactRowPadding` in zero-nudge tiers, `rowLineHeight = rowBlockSize − 2 × rowPadding − borderWidth`.
- This keeps the text visually centered between the rules and makes the border compensation explicit instead of hiding it in asymmetric padding.
- The technique generalizes beyond tables to any stacked, ruled rows where the content lives between two lines and margin cannot carry the rhythm.
- If the separator is only decorative and should not affect rhythm, keep it out of the box math; if it is the actual row boundary, it belongs inside the compensated row box.

## Spec conformance

Reference: Typeface v0.3, Spacing v0.4, Grid v0.3. **All PASS** (resolved Phase 6).

## Active TODO

### Current follow-up

- Independent theme surfaces now ship as full scoped variable sets rather than editorial-base diffs, and `dist/surfaces.json` publishes the per-surface runtime tokens plus stored font metrics needed for side-by-side container switching.
- Next architecture follow-up: accept multi-font named surface registries in one build so IBM Plex or downstream white-label experiments can ship beside the canonical Ubuntu surfaces without reintroducing override coupling.
- The latest parity burst now also closes Vanilla-style top-navigation dropdowns: `bf-top-navigation` ships desktop layered dropdown menus plus mobile inline expansion, static validation covers the new selectors and demo markup, `npm run qa:components` is green, and the new dropdown paths pass targeted Playwright verification.
- Full repo `npm test` is green again after the application-shell resize-handle follow-up: the resizable-aside runtime now re-syncs `aria-valuenow` from the rendered aside width after the shell settles, so the behavior harness no longer races the first-load layout state.
- Next downstream-demand parity gap is navigation mega-nav; broader link and form-surface follow-ups remain demand-driven.

### Audit findings (living-spec review)

- [ ] **`bf-theme--light` compatibility alias** — `css-components.ts:164` emits `.bf-theme.bf-theme--light` alongside `.bf-theme.is-light`. Inconsistent with `.is-dark` naming. Remove alias or document as deprecated.
- [ ] **`bf-panel-logo` dead selector** — CSS references `.bf-panel-logo` in header flex rule (line 782) but no HTML ever uses it. Remove from CSS.
- [ ] **`bf-label` redundant alias** — `bf-status-label` is duplicated as `bf-label` throughout `css-components.ts` (5 compound rules). Pick one name.
- [ ] **`bf-u-no-margin.is-bottom`** — utility class uses `u-` convention inside `bf-` scope (line 180). Reconcile naming or remove if unused.

### Pre-existing items

- [ ] Surface completeness audit — when adding new role or control properties, land them in the explicit scoped surface blocks and `surfaces.json` manifest instead of letting editorial fallbacks fill the gap.
- [ ] Multi-font surface registry — let one build ingest multiple named configs so alternate fonts can ship beside canonical tiers as first-class surfaces rather than preset aliases.
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
| ~P2~ | ~Soft link (`.bf-link.is-soft`)~ | ~links~ | **Deprecated — not accessible, do not port** |
| ~P2~ | ~Form layout modes (`.bf-form.is-inline`)~ | ~forms~ | **Superseded by `bf-cluster`** |
| P3 | Navigation mega-nav | navigation |
