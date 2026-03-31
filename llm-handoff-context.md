# LLM Handoff Context

## Repo orientation

| Role | Path |
|------|------|
| Primary | `C:\Users\lyubo\work\repos\baseline-foundry` |
| Reference compatibility package | `C:\Users\lyubo\work\repos\portable-vertical-rhythm` |
| Canonical design spec reference | `C:\Users\lyubo\work\repos\canonical-specs` |
| Type-scale reference | `C:\Users\lyubo\work\repos\docs-typescale` |

## Quick start

See `README.md` for full commands. Short version:

```bash
npm install && npm run setup:demo-font && npm run build && npm run demo
```

Demo: `http://127.0.0.1:4174/`

## Current state (updated 2026-07-16)

Clean sibling to `portable-vertical-rhythm`: real font metrics, editorial-first baseline alignment, Canonical `4 / 8 / 16` grid primitives, tier-first runtime/build model (`editorial`, `documentation`, `app`). All three tiers now use **Ubuntu Sans Variable** with canonical weights (500/200/500/300/550/550 editorial pattern). Documentation tier overhauled to bU=0.25rem with sizes, lineHeights, and spaceAfter matching canonical exactly. All tests pass (build validation, component baselines, behavior).

Grid implements Grid spec v0.3 tier semantics using **universal `@container` queries** for column switching (all tiers). `.bf-page` is the canonical grid container: in editorial/docs it is centered + max-width capped, so container width mirrors viewport in production; in app tier it is fluid (`max-inline-size: none`). Gutter/margin escalation uses `@media` queries.

### Architecture refactor (completed 2026-07-16)

Major CSS generation refactor implementing 6 architectural improvements:

1. **Literal CSS values** — Text rules now emit literal `margin-bottom`, `padding-block-start`, `padding-block-end` instead of a 10-variable chain (`--bf-semantic-space-after`, `--bf-selected-start-nudge`, etc.). Margin-bottom uses the formula `spaceAfter - baselineUnit` to stay grid-aligned.
2. **Layout container child reset** — `.bf-stack > *`, `.bf-cluster > *`, `.bf-stage-shell > *` now reset `margin-bottom: 0; padding-block: 0;` on children, implementing §5.3 of the dual-model spec.
3. **Simplified component vars** — Role alignment vars reduced from 8 to 3 per role: `--bf-{role}-line-height`, `--bf-{role}-nudge-start`, `--bf-{role}-nudge-end`.
4. **Tier overrides via class toggle** — Single editorial stylesheet contains scoped `.bf-tier-app` / `.bf-tier-documentation` overrides. Runtime tier switching works by toggling a class on `<body>` instead of swapping stylesheets. Demo files updated accordingly.
5. **Cap engine demoted** — `.bf-engine-cap` blocks are now labeled as demo-only with a comment explaining why metrics-derived nudges are used instead.
6. **TierOverride pipeline** — New `TierOverride` type + `buildTierOverrides()` in build.ts automatically generates scoped override CSS for all non-base tiers.

Phase 8 — Data-attribute and ui-role cleanup — **COMPLETE**.

## Current sprint TODO

The authoritative backlog lives in `docs/rebuild-plan.md` → Remaining phases (4–5). Current priority order:

1. **Architecture refactor — COMPLETE** ✅ (literal values, layout child reset, tier class toggle, simplified vars)
2. **Phase 8 — COMPLETE** ✅ (data-attr cleanup, ui-role removal)
3. **Phase 7 — COMPLETE** ✅
4. **Phase 6 — COMPLETE** ✅
5. **Phase 5** — Tier/engine refactor (remaining: parasite class sweep)
6. **Phase 4** — Concept hardening (baseline invariant validation)

## Key file map

| Purpose | File |
|---------|------|
| Main package entry | `src/index.ts` |
| Node build API | `src/build.ts` |
| CSS generator | `src/css.ts`, `src/css-components.ts`, `src/css-grid.ts`, `src/css-app-tier.ts` |
| Preset / tier registry | `src/presets.ts` |
| Tier configs | `config/tiers/editorial.json`, `config/tiers/documentation.json`, `config/tiers/app.json` |
| Panel preset config | `config/presets/panel.json` |
| Theme build script | `scripts/build-theme.ts` |
| Verification scripts | `scripts/validate-build.ts`, `scripts/verify-component-baselines.ts`, `scripts/verify-component-behavior.ts`, `scripts/compare-controls.ts`, `scripts/compare-inline-surfaces.ts` |
| Living spec home | `index.html` |
| Living spec shell | `demo/spec-runtime.js`, `demo/spec-shell.js`, `demo/spec-shell.css` |
| Controls gallery | `demo/controls.html`, `demo/controls-page.js`, `demo/controls-shell.css` |
| Spec chapters | `demo/spec/typography.html`, `demo/spec/spacing.html`, `demo/spec/grid.html` |
| Component demos | `demo/components/` (inventory in `scripts/component-demo-shared.ts`) |
| Canonical examples | `examples/grid/`, `examples/spacing/` |
| Architecture plan | `docs/rebuild-plan.md` |
| Product roadmap | `docs/product-roadmap.md` |
| Completed work log | `docs/history.md` |

## Notes for the next model

- Keep editorial baseline alignment sacred; do not reintroduce app-tier nudges without an explicit spec decision.
- Text element margin-bottom uses `spaceAfter - baselineUnit` (not `marginBottom` token) to stay grid-aligned.
- Layout containers (Stack, Cluster, Stage-shell) own child spacing via child reset rules. Do not add margin/padding to text elements inside stacks.
- Tier switching is class-based: add `.bf-tier-app` or `.bf-tier-documentation` to the theme root. No stylesheet swapping needed.
- Component alignment uses 3 vars per role: `--bf-{role}-line-height`, `--bf-{role}-nudge-start`, `--bf-{role}-nudge-end`.
- Cap engine (`.bf-engine-cap`) is a demo artifact; it drifts at larger sizes and is not production-ready.
- Favor smaller canonical primitives over broad pattern coverage.
- No `data-*` CSS selectors — use `is-*` class selectors for state/variant toggling.
- No `ui-*` typography roles — only `body` + `h1`–`h6` are valid roles.
- IBM Plex is brand-layout-ops only; baseline-foundry uses Ubuntu Sans exclusively.
- If React becomes important later, add canonical React primitives instead of wrapping legacy markup contracts.