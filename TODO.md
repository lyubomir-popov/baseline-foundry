# Rebuild Plan

## Goal

Provide the **minimal testing surface** for evaluating the canonical typography, spacing, and grid specs. Output: spec examples, screenshots, edge-case isolation for all non-deprecated Vanilla components — not a finished design-system site.

## Source inputs and precedence

Primary linked specs for this repo:

- `../canonical-spacing-spec/specs/typeface/draft.md`
- `../canonical-spacing-spec/specs/spacing/draft.md`
- `../canonical-spacing-spec/specs/grid/draft.md`
- Supporting reference: `../canonical-spacing-spec/specs/typography-article/draft.md`

Notes:

- `../canonical-specs/` is legacy snapshot/reference material only.

When sources disagree, use this order:

1. Linked specs in workspace repos or explicitly referenced source docs
2. `ROADMAP.md`
3. `.github/copilot-instructions.md`
4. `STATUS.md` and `HISTORY.md`
5. `README.md` and `docs/specs.md`
6. `INBOX.md`
7. Undocumented local implementation details

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
14. No `ui-*` roles: component typography derives from body/heading tier tokens, and non-heading UI stays body-sized by default. Only components with explicit heading slots above `h5` may opt into larger heading roles.
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
- **Container-owned (app)** — app is a strict container-owned project surface. Runtime nudges stay zero, layout primitives own inter-child spacing, and semantic text spacing is neutralized so the app tier does not host element-owned islands.

Tier policy is strict: `bf-tier-app` stays container-owned end to end; `bf-tier-editorial` and `bf-tier-documentation` stay element-owned. Do not mix modes inside a tier.

### Surface engine contract

Each surface in `dist/surfaces.json` declares its `engine` field, identifying the alignment pipeline that produced it. Current values: `metrics-compensated` (production default, uses `@lyubomir-popov/baseline-nudge-generator`). The `cap-formula` engine (CSS `cap`-unit alignment) exists as a demo overlay (`bf-engine-cap`) only and does not appear in the manifest.

### Font asset contract

Font files are **not bundled** in the npm package. Each surface's `metrics.fontFiles` array in `surfaces.json` lists the font families and the build-time paths used to extract metrics, but these paths are local to the build machine. Consumers must:

1. Supply matching font files at their own serving path.
2. Override the `@font-face` `src` declarations if the default relative paths (`../../assets/fonts/...`) don't match their layout.

The canonical built-ins expect Ubuntu Sans Variable (`UbuntuSans[wdth,wght].ttf`). Experiment surfaces may reference additional fonts (e.g., IBM Plex Sans). The `npm run setup:demo-font` script fetches both Ubuntu Sans and the IBM Plex Sans variable experiment asset into `assets/fonts/` for local development only — it is not a production install step.

### Debug overlay

The baseline-grid debug overlay is a separable concern. CSS generation lives in `src/baseline-grid-overlay.ts` (`generateBaselineGridOverlayCss` + `generateBaselineGridThemeOverrideCss`), and the toggle runtime lives in `src/baseline-grid.ts` (`initBaselineGridToggles`). Both are exported from the package index. Downstream consumers can import just the overlay without pulling in the full theme.

### Build pipeline

- **Literal CSS values** — `margin-bottom`, `padding-block-start`, `padding-block-end` are literal per role.
- **Layout container child reset** — `.bf-stack > *`, `.bf-cluster > *`, `.bf-stage-shell > *` reset `margin-bottom: 0; padding-block: 0;` (§5.3).
- **Role-scoped typography vars** — root prose and body-sized components read tier-scoped family/size/weight/line-height vars instead of editorial literals.
- **Tier-selectable control padding vars** — inputs/selects/buttons can resolve block padding from real body nudges in nudged tiers and fixed fallback padding in `app`; no target-height back-calculation or legacy control block-size tokens.
- **Compensated row boxes for marginless repeats** — tables and similar text-between-rules rows use a fixed row box with an in-box border, nudge-derived padding, and a solved line-height instead of fake inset borders or zero-top padding hacks.
- **Independent surface contract** — each built-in tier emits a complete scoped token surface (`.bf-tier-editorial`, `.bf-tier-documentation`, `.bf-tier-app`, `.bf-tier-os`) instead of inheriting editorial defaults through diffs. Tier switching = class toggle on any `.bf-theme` container, and multiple containers can coexist side by side.
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
- Tier-first build: `editorial`, `documentation`, `app`, `os`.
- Metrics-derived nudges default; `.bf-engine-cap` is demo-only; `.bf-tier-app` zeroes runtime nudges but keeps stored metric data for audit and side-by-side comparison; `.bf-tier-os` stays metrics-driven as a dense addendum surface.
- Ubuntu Sans Variable for the canonical built-ins; other fonts belong in their own metric-derived surfaces, not in override diffs.

### Body-sized UI invariant

Use this for chips, badges, status labels, tabs, buttons, labels, and any other component chrome that is **not** itself an explicit heading surface.

1. Non-heading UI resolves `font-size` and `line-height` from the active `body` role.
2. Do not borrow `h5` or `h6` as a fake UI role just because a component is compact or dense.
3. The exception is a component that exposes a real heading slot above `h5` such as a panel title or modal title.
4. Validate the rule at runtime by comparing component typography against the active body typography across tier switching, not by checking OS alone.

Consequences:
- The OS addendum keeps non-heading UI at the tier root size (`0.75rem` with the current config).
- Chips, badges, and status labels track the same size and line-height as body text across all built-in tiers.
- If a component needs more emphasis without becoming a heading surface, change weight, color, case, or spacing instead of borrowing a larger heading role.

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

Reference: `../canonical-spacing-spec/specs/typeface/draft.md`, `../canonical-spacing-spec/specs/spacing/draft.md`, `../canonical-spacing-spec/specs/grid/draft.md`. **All PASS** (resolved Phase 6).

## Model tier routing

Tag tasks with `[H]` / `[S]` / `[L]` / `[X]` so any agent picking up the queue routes work to the right model class instead of burning premium thinking on text shuffling.

| Tag | Tier | Models | Use for |
|---|---|---|---|
| `[H]` | Heavy | Claude Opus 4.7, GPT-5 | Cross-file refactors, invariant-bearing CSS additions, naming translations from external sources, architectural decisions, picking the next batch of parity ports. |
| `[S]` | Standard | Claude Sonnet 4.5, GPT-5 mini | Single-component additions following an established pattern, demo-page authoring, contained JSX/CSS swaps. |
| `[L]` | Light | Haiku, Gemini Flash, GPT-5 nano | ROADMAP/STATUS/HISTORY housekeeping, INBOX triage, commit-message edits, dependency bumps. |
| `[X]` | Subagent / no model | `Explore` subagent, `npm run build`, `npm run test:build`, `npm run qa:components`, Playwright | Read-only research, validation, visual regression. |

Routing rule of thumb:

- "Matches an existing pattern + passes build invariants" → `[S]`.
- "Reads N files and decides what shape the new thing should be" → `[H]`.
- "Moves text from file A to file B" → `[L]`.
- "Just runs and reports pass/fail" → `[X]`.

Orchestration pattern: a Heavy session can dispatch `Explore` or per-repo `agent` subagents for `[L]` and small `[S]` work in parallel, then sequence the Heavy review on the returns. Don't have a Heavy session do `[L]` work directly.

## Active TODO

### Current follow-up

#### Highest-priority next steps

- The latest helper-layer cleanup is now also complete: `range-demo-rail` is gone from `demo/component-shell.css`, `demo/components/range.html` now uses the shared `bf-inline-size.is-compact` wrapper instead of a page-local width helper, and `demo/components/engine-illustration.html` now renders the raw / compensated / cap comparison lanes on BF-owned cards, status labels, inline-size utilities, and the shared `u-baseline-grid` overlay. The remaining active work is downstream shared-shell upstreaming and legacy preset removal, not page-local demo helper cleanup.
- Component QA now walks the intended non-app surfaces directly instead of only checking the authored default page state: `scripts/verify-component-baselines.ts` drives shared-tier component pages through `editorial`, `documentation`, and `os`, keeps app-authored pages app-only unless they opt into broader coverage, and records one baseline-report entry per verified surface.

- App-tier `spaceAfter` and `marginBottom` values have been zeroed out in the source configuration, ensuring the public app spacing surface strictly matches the live spec. Raw metric spacing counts were successfully retained underneath `_rawSpaceAfter` to preserve data audits.
- The `bf-grid` spec drift (where the repo ships `row-gap: 0` while the spec still described visible row gaps) is now fully handed off to `canonical-spacing-spec` via `AGENT-INBOX.md`: both the grid spec and the spacing spec's two-dimensional-grid wording now request `row-gap: 0` as the canonical default, with visible vertical separation owned by the surrounding layout/pattern instead of the grid itself.

- Spacing ownership is now written up for external review in `docs/spacing-ownership-peer-review.md`, and non-app `bf-stack` modifiers now stay gapless so only `bf-tier-app` owns stack gap density.
- The site-wide tier model now has four truthful built-in surfaces: `editorial`, `documentation`, `app`, and the non-canonical `os` addendum. The shared header exposes `Editorial / Docs / App / OS` across the living spec, controls, examples, and component demos; `demo/panel.html` now boots through the shared page chrome as the OS addendum page; and the legacy `panel` preset now aliases the OS output instead of carrying its own `ui-*` role config.
- The latest helper-layer cleanup is now complete on the spec home/grid pages and the component atlas: `pc-grid-guide` is gone from the living-spec shell in favor of the shared `bf-grid.is-guide` modifier, `ul/ol.bf-grid` can now act as plain grid lists without local resets, and the atlas now enhances `data-component-atlas-item` hooks into BF-owned linked preview cards instead of emitting a `demo-index*` class family.
- The parasite class sweep is now complete end-to-end: the old validation aliases (`.has-error`, `.has-success`, `.has-warning`) are gone from the shared component CSS, the last live Vanilla-style `has-*` helper classes are gone from the BF demo/runtime surface, and build validation now rejects both kinds of drift so the public contract stays on structural selectors plus canonical `is-*` modifiers only.
- The typographic specimen page is now complete: `demo/spec/typographic-specimen.html` ships as a real spec chapter with shared page chrome, page-catalog registration, and a responsive editorial two-column prose layout that collapses back to one column cleanly.
- Page chrome polish is now complete: the shared `pc-controls` cluster stays on one row whenever the desktop bar has room, the existing narrow-width fallback still restores wrapping when space genuinely runs out, and build validation now asserts that desktop/mobile wrap contract directly from `demo/page-chrome.css`.
- Surface completeness audit is now complete: the foundation theme carries the full layout spacing token set again, `src/build.ts` now rejects missing or non-finite required numeric layout fields up front, and build validation fails if generated CSS ever contains `NaN`, so incomplete scoped surfaces cannot silently leak broken values into shipped output.
- Workflow modal upstreaming for `brand-layout-ops` now ships in `baseline-foundry`: `bf-modal.is-workflow` provides the canonical medium-large authoring shell with fixed header/footer bars and an internally scrolling body, while `bf-modal.is-workflow.is-resizable` adds optional resize without downstream-local modal sizing/layout CSS.
- Top-navigation chevron spacing and motion parity now ships in `baseline-foundry`: closed dropdown toggles keep the chevron pointed downward, active toggles rotate it upward, and the shared contract now matches the downstream `brand-layout-ops` authoring shell without chevron-specific overrides.
- The `bf-panel` audit is now complete: shared panels keep the real Vanilla application-layout pieces (`bf-panel-header`, `bf-panel-title`, `bf-panel-controls`, `bf-panel-toggle`, sticky headers, fill-height shell usage) but drop the invented border-card treatment, and `demo/controls.html` now uses plain layout wrappers instead of decorative `bf-panel` containers.
- The first `brand-layout-ops` shared-shell upstream tranche is now landed: `bf-panel.is-fill` now owns full-height internal scrolling, `bf-top-navigation-dropdown-item` now supports button action rows plus `.bf-top-navigation-dropdown-item-label` / `.bf-top-navigation-dropdown-item-shortcut` and `li.is-divider`, `demo/components/application-shell.html` now dogfoods the fill-height panel path directly, and `demo/component-shell.css` no longer needs the local `bf-panel.is-fill` workaround for the downstream sample shell.
- The root UI typography invariant is now explicit and enforced: non-heading component chrome stays body-sized across tiers, the last chip/badge/status-label `h5` bindings are gone, `scripts/validate-build.ts` rejects regressions, `scripts/verify-component-behavior.ts` checks chip/status-label/badge size parity against the active body role, and `demo/component-demo.js` cache-busts built-in tier stylesheet reloads so rebuilt typescale edits show up without restarting the page.
- Engine smoke now ships as a single generated multi-font bundle at `dist/experiments/ibm-plex-engine-smoke/`, and `demo/components/engine-smoke.html` pins that manifest through the shared page chrome so the 8rem/4rem cap-drift comparison can switch between `IBM Plex Sans` and `Ubuntu Sans` without changing route.
- The comparison article now has its static visual companion: `demo/components/engine-illustration.html` keeps the same locked-manifest IBM Plex / Ubuntu experiment bundle, adds a page-local raw-metrics lane beside the shipped compensated lane and the demo-only cap lane, and closes the blog-only illustration follow-up without inventing a new buildable surface mode.
- Independent theme surfaces now ship as full scoped variable sets rather than editorial-base diffs, and `dist/surfaces.json` publishes the per-surface runtime tokens plus stored font metrics needed for side-by-side container switching.
- Custom builds can now emit named sibling surfaces in one stylesheet + manifest via `buildThemeFromConfig({ surfaceLabel, additionalSurfaces })`, which closes the immediate multi-font registry follow-up for downstream white-label experiments.
- The latest parity burst now also closes Vanilla-style top-navigation dropdowns: `bf-top-navigation` ships desktop layered dropdown menus plus mobile inline expansion, static validation covers the new selectors and demo markup, `npm run qa:components` is green, and the new dropdown paths pass targeted Playwright verification.
- Full repo `npm test` is green again after the application-shell resize-handle follow-up: the resizable-aside runtime now re-syncs `aria-valuenow` from the rendered aside width after the shell settles, so the behavior harness no longer races the first-load layout state.
- Active downstream-demand work is now the `brand-layout-ops` shared-shell backlog below; mega-nav is explicitly deprioritized unless a concrete consumer asks for it again.
- The grid/spacing example dogfooding pass has now moved the remaining app shell specimens onto shared primitives: `app-panels.html` now uses the real `bf-application` + pinned `bf-navigation` + overlay `bf-aside` contract, `panel-reflow.html` now uses the real `bf-application` + pinned `bf-aside` contract, and `demo/example-page.js` now initializes the shared application-layout and panel-drawer runtimes on example pages instead of relying on local fixture shell behavior.

### Inbox triage

- [x] Persist the shared page-chrome baseline-grid, tier, and tone choices across page-to-page navigation instead of resetting them per page family.
- [ ] `[H]` Decide whether to ship an explicit IBM Plex preset or a documented supported font-option path for downstream adopters such as `portfolio`, which already consumes the base, editorial-tier, and prose bundles during its migration.
- [ ] `[S]` Remove the remaining `panel` legacy preset support once `brand-layout-ops` migrates, leaving `os` as an independent sibling built-in tier with no preset coupling.
- [ ] `[H]` Standardize dense icon and keyline spacing across search fields, search-and-filter, accordion toggles, top navigation, side navigation, and icon-bearing buttons so one- and two-icon controls share a consistent edge-spacing contract and stack onto as few vertical keylines as possible.
- [ ] `[H]` Review the switch-versus-slider visual contract and decide whether the switch should align to the same track language as the slider instead of preserving two divergent control-track treatments.

### Downstream shared-shell upstreaming backlog

- [x] Tranche 1 — fill-height panel + action-menu rows. Shared contract: `bf-panel.is-fill`, `bf-top-navigation-dropdown-item`, `bf-top-navigation-dropdown-item-label`, `bf-top-navigation-dropdown-item-shortcut`, `li.is-divider`. BF demos: `demo/components/application-shell.html`, `demo/components/top-navigation.html`.
- [ ] `[H]` Tranche 2 — authoring-shell layout variant. Proposed contract: `bf-application.is-top-navigation-shell` with canonical top-navigation, main-stage, and pinned-aside areas. BF demo target: extend `demo/components/application-shell.html` or add a focused authoring-shell demo.
- [ ] `[H]` Tranche 3 — worksurface + document-frame contract. Proposed contract: `bf-stage-shell.is-worksurface`, `bf-stage-frame`, `bf-stage-document`. BF demo target: extend `demo/components/stage-shell.html` or add a focused worksurface demo that stays fully on BF-owned primitives.
- [ ] `[S]` Tranche 4 — downstream-generated authoring surface bundle. Keep chroma as a generated `brand-layout-ops` surface bundle layered on BF structure instead of promoting a new built-in BF tier. Demo target: downstream consumption, not a new BF built-in surface.
- [ ] `[S]` Tranche 5 — breakpoint and density tuning only if reuse appears. Candidate seam: a top-navigation breakpoint token or variant rather than a BLO-local `48rem` media fork.

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

### Optional follow-up

- [x] Blog engine illustration — `demo/components/engine-illustration.html` now provides the static BF-owned side-by-side of cap-formula vs raw-metrics vs compensated-metrics padding for the IBM Plex Sans / Ubuntu Sans H1 and H2 experiment. It remains a blog/demo artifact, not a buildable surface mode.

### Portfolio-blocking parity follow-ups

The four ports landed 2026-04-27 (commits `ca16bb5`, `3b4f9ac`, `0ad2e53`, `aa5335d`). Next-batch follow-ups, tier-tagged for routing:

- [ ] `[X]` Run `npm run qa:components` to capture visual baselines for the three new wide-capture pages (`cta-block`, `equal-height-row`, `figure`).
- [x] `[L]` Push branch `salvage/local-work-recovery` to origin once the user confirms.
- [ ] `[S]` Port `bf-button.is-negative` — themed `--bf-color-button-negative-*` tokens already exist; follows the `is-positive` template line-for-line.
- [ ] `[H]` Decide brand button modifier strategy — Vanilla's `p-button--brand` needs `--bf-color-button-brand-*` tokens that BF does not yet ship; either add the token tier or document the deviation. After the decision, the actual port becomes `[S]`.
- [ ] `[S]` Port `bf-button.is-link` once a link-styled button color contract is confirmed (likely reuses `--bf-color-link-*`).
- [ ] `[S]` Port `bf-button.is-icon` (icon-only sizing modifier) — no color tokens needed.
- [ ] `[H]` Decide processing-button strategy — `is-processing` is a behavioral state with a spinner; whether to ship as CSS-only or a Lit element is a Heavy call.
- [x] `[H]` Decided aspect-ratio container architecture (2026-04-28): ship `bf-aspect` as a generic utility primitive using modern `aspect-ratio: W / H`. Not on `bf-figure` (orthogonal concern), not as `bf-image-container` (image-specific name + legacy padding-bottom hack). `bf-aspect` composes inside `bf-figure` when a constrained captioned image is needed. Defer `on-(small|medium|large)` responsive variants to actual downstream demand.
- [ ] `[S]` Implement `bf-aspect` per the decision above. Variants: `is-16-9`, `is-3-2`, `is-2-3`, `is-cinematic` (2.4:1), `is-square`. Children (`img`, `picture`, `video`, `canvas`, `iframe`) fill the slot with `object-fit: cover`. Adds `demo/components/aspect.html`, atlas registration, and validate-build assertions.
- [ ] `[H]` Decide which Vanilla `_patterns_*` deserve the next BF-parity batch from the ROADMAP gap inventory (separator, accordion variants, side-navigation extras, etc.). Requires reading multiple Vanilla files and judging composition vs. new primitive.

### Parity gaps (pursue on downstream demand)

| Priority | Gap | Pattern area |
|---|---|---|
| ~P2~ | ~Soft link (`.bf-link.is-soft`)~ | ~links~ | **Deprecated — not accessible, do not port** |
| ~P2~ | ~Form layout modes (`.bf-form.is-inline`)~ | ~forms~ | **Superseded by `bf-cluster`** |
| ~P3~ | ~Navigation mega-nav~ (deferred) | navigation |
