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

### Spacing ontology

The repo ships two spacing models. This is an intentional architectural split, not an implementation detail.

- **Element-owned (editorial, documentation)** — each typographic element carries its own `margin-block-end` derived from the role's `spaceAfter` value, and its own `padding-block-start`/`padding-block-end` derived from real font-metric nudges. The element knows how much space it needs; the parent container does not dictate vertical rhythm.
- **Container-owned (app)** — the parent layout primitive (`bf-stack`, `bf-cluster`, `bf-grid`) controls child spacing via `gap` or a child-reset pattern. Elements carry zero nudges and no semantic `margin-block-end`. Rhythm comes from the container, not the content.

When editorial elements enter a layout container (`bf-stack`, `bf-cluster`, `bf-stage-shell`), the container resets child margins and padding so the container-owned model takes over. This is the handoff point between the two models.

### Surface engine contract

Each surface in `dist/surfaces.json` declares its `engine` field, identifying the alignment pipeline that produced it. Current values: `metrics-compensated` (production default, uses `@lyubomir-popov/baseline-nudge-generator`). The `cap-formula` engine (CSS `cap`-unit alignment) exists as a demo overlay (`bf-engine-cap`) only and does not appear in the manifest.

### Font asset contract

Font files are **not bundled** in the npm package. Each surface's `metrics.fontFiles` array in `surfaces.json` lists the font families and the build-time paths used to extract metrics, but these paths are local to the build machine. Consumers must:

1. Supply matching font files at their own serving path.
2. Override the `@font-face` `src` declarations if the default relative paths (`../../assets/fonts/...`) don't match their layout.

The canonical built-ins expect Ubuntu Sans Variable (`UbuntuSans[wdth,wght].ttf`). Experiment surfaces may reference additional fonts (e.g., IBM Plex Sans). The `npm run setup:demo-font` script fetches Ubuntu Sans into `assets/fonts/` for local development only — it is not a production install step.

### Debug overlay

The baseline-grid debug overlay is a separable concern. CSS generation lives in `src/baseline-grid-overlay.ts` (`generateBaselineGridOverlayCss` + `generateBaselineGridThemeOverrideCss`), and the toggle runtime lives in `src/baseline-grid.ts` (`initBaselineGridToggles`). Both are exported from the package index. Downstream consumers can import just the overlay without pulling in the full theme.

### Build pipeline

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

- Page chrome polish is now complete: the shared `pc-controls` cluster stays on one row whenever the desktop bar has room, the existing narrow-width fallback still restores wrapping when space genuinely runs out, and build validation now asserts that desktop/mobile wrap contract directly from `demo/page-chrome.css`.
- Surface completeness audit is now complete: the foundation theme carries the full layout spacing token set again, `src/build.ts` now rejects missing or non-finite required numeric layout fields up front, and build validation fails if generated CSS ever contains `NaN`, so incomplete scoped surfaces cannot silently leak broken values into shipped output.
- Workflow modal upstreaming for `brand-layout-ops` now ships in `baseline-foundry`: `bf-modal.is-workflow` provides the canonical medium-large authoring shell with fixed header/footer bars and an internally scrolling body, while `bf-modal.is-workflow.is-resizable` adds optional resize without downstream-local modal sizing/layout CSS.
- Top-navigation chevron spacing and motion parity now ships in `baseline-foundry`: closed dropdown toggles keep the chevron pointed downward, active toggles rotate it upward, and the shared contract now matches the downstream `brand-layout-ops` authoring shell without chevron-specific overrides.
- The `bf-panel` audit is now complete: shared panels keep the real Vanilla application-layout pieces (`bf-panel-header`, `bf-panel-title`, `bf-panel-controls`, `bf-panel-toggle`, sticky headers, fill-height shell usage) but drop the invented border-card treatment, and `demo/controls.html` now uses plain layout wrappers instead of decorative `bf-panel` containers.
- Highest-priority non-downstream cleanup is now the typographic specimen page: add the editorial multi-column demo at `demo/spec/typographic-specimen.html` so the canonical prose/grid contract has a longer-form living specimen.
- Engine smoke now ships as a single generated multi-font bundle at `dist/experiments/ibm-plex-engine-smoke/`, and `demo/components/engine-smoke.html` pins that manifest through the shared page chrome so the 8rem/4rem cap-drift comparison can switch between `IBM Plex Sans` and `Ubuntu Sans` without changing route.
- Independent theme surfaces now ship as full scoped variable sets rather than editorial-base diffs, and `dist/surfaces.json` publishes the per-surface runtime tokens plus stored font metrics needed for side-by-side container switching.
- Custom builds can now emit named sibling surfaces in one stylesheet + manifest via `buildThemeFromConfig({ surfaceLabel, additionalSurfaces })`, which closes the immediate multi-font registry follow-up for downstream white-label experiments.
- The latest parity burst now also closes Vanilla-style top-navigation dropdowns: `bf-top-navigation` ships desktop layered dropdown menus plus mobile inline expansion, static validation covers the new selectors and demo markup, `npm run qa:components` is green, and the new dropdown paths pass targeted Playwright verification.
- Full repo `npm test` is green again after the application-shell resize-handle follow-up: the resizable-aside runtime now re-syncs `aria-valuenow` from the rendered aside width after the shell settles, so the behavior harness no longer races the first-load layout state.
- Next downstream-demand parity gap is navigation mega-nav; broader link and form-surface follow-ups remain demand-driven.

### Pragma-informed repo health plan

What we learned from looking at Pragma, filtered to non-opinionated improvements only. Cap-vs-metrics and container-vs-element preferences are settled and not revisited here.

Adopted improvements:

- [x] **Surface manifest `engine` field** — add a machine-readable `engine` string to each entry in `surfaces.json` so tooling and downstream consumers know what produced the surface. Start minimal: `"metrics-compensated"` for production surfaces, `"cap-formula"` for the demo overlay. Extend the enum only when new engines actually ship as buildable outputs.
- [x] **Spacing-mode docs pass** — describe the repo's editorial/app split explicitly as an ontology in the architecture section: editorial and documentation are baseline-aligned, element-owned prose surfaces; app is zero-nudge, container-owned. The code already does this; the documentation should name the concept.
- [x] **Structured invariant testing** — refactor `validate-build.ts` so each invariant is a named, documented check with a clear pass/fail label (inspired by Pragma's `@canonical/webarchitect` habit of treating architecture rules as testable contracts). Not borrowing their tool, borrowing the discipline.
- [x] **Debug overlay as separable concern** — extract the baseline-grid overlay CSS and toggle logic into a self-contained module (`src/baseline-grid-overlay.css` generation + existing `src/baseline-grid.ts` runtime) so it's reusable for downstream consumers without pulling in the full theme.
- [x] **Font asset contract** — document the font dependency contract explicitly in `surfaces.json` metadata and the architecture section, so consumers know whether fonts are bundled, expected at a path, or fetched externally.

Not adopted (taste-driven, already settled):

- Cap-first alignment as production default → remains demo-only (`bf-engine-cap`).
- Container-owned spacing as default → remains app-tier only; editorial is element-owned.
- Full cap-contract buildable surface mode → demoted to blog-only static illustration if needed for the comparison article, not a buildable surface.
- Pragma's package-split structure → not transferable; Pragma is a multi-framework monorepo, Foundry is a single build-to-CSS repo.

Decision gate:

- Do not replace the compensated metrics default with any cap-based mode until a four-way specimen exists and has been reviewed across at least IBM Plex Sans and Ubuntu Sans at body, `h2`, and `h1` scales.

### Pre-existing items

- [ ] Blog engine illustration — if the comparison article needs a visual side-by-side of cap-formula vs raw-metrics vs compensated-metrics padding, generate a static HTML page or screenshot. Not a buildable surface mode.
- [ ] Parasite class sweep — remove remaining downstream component aliases
- [ ] Typographic specimen page — editorial multi-column layout demo at `demo/spec/typographic-specimen.html`

### New: OS tier (from inbox)

- [ ] **Rename panel tier → OS tier** — new 4th tier representing extreme OS-style density. Not in canonical specs; mark as addendum. Should follow editorial tier conventions (baseline-aligned, element-owned spacing) but much denser. Elevate to same level as editorial/app/documentation tiers.

### Parity gaps (pursue on downstream demand)

| Priority | Gap | Pattern area |
|---|---|---|
| ~P2~ | ~Soft link (`.bf-link.is-soft`)~ | ~links~ | **Deprecated — not accessible, do not port** |
| ~P2~ | ~Form layout modes (`.bf-form.is-inline`)~ | ~forms~ | **Superseded by `bf-cluster`** |
| P3 | Navigation mega-nav | navigation |
