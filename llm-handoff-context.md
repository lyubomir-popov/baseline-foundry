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

## Current state (updated 2026-07-15)

Clean sibling to `portable-vertical-rhythm`: real font metrics, editorial-first baseline alignment, Canonical `4 / 8 / 16` grid primitives, tier-first runtime/build model (`editorial`, `documentation`, `app`). All three tiers now use **Ubuntu Sans Variable** with canonical weights (500/200/500/300/550/550 editorial pattern). Documentation tier overhauled to bU=0.25rem with sizes, lineHeights, and spaceAfter matching canonical exactly. All tests pass (build validation, component baselines, behavior).

Grid implements Grid spec v0.3 tier semantics using **universal `@container` queries** for column switching (all tiers). `.bf-page` is the canonical grid container: in editorial/docs it is centered + max-width capped, so container width mirrors viewport in production; in app tier it is fluid (`max-inline-size: none`). Gutter/margin escalation uses `@media` queries.

Phase 8 — Data-attribute and ui-role cleanup — **COMPLETE**:
- **All `data-*` CSS selectors removed** from src/, demo/, and examples/. Replaced with `is-*` class selectors (e.g. `is-dark`, `is-light`, `is-flush`, `is-loose`, `is-end`).
- **All `ui-*` typography roles removed** from tier configs (ui-heading, ui-small, ui-small-caps, ui-x-small). Only `body` + `h1`–`h6` remain.
- **`examples/app-tier/` deleted** — will be rebuilt from scratch when needed.
- **Demo JS/HTML migrated** from `dataset.bfTone` to `classList.toggle("is-dark"/"is-light")`.
- **Validation scripts updated** to match new class-based API (no data-* assertions, no ui-* role assertions).
- All three verification suites pass: `validate-build`, `verify-component-baselines`, `verify-component-behavior`.

## Current sprint TODO

The authoritative backlog lives in `docs/rebuild-plan.md` → Remaining phases (4–5). Current priority order:

1. **Phase 8 — COMPLETE** ✅ (data-attr cleanup, ui-role removal)
2. **Phase 7 — COMPLETE** ✅
3. **Phase 6 — COMPLETE** ✅
4. **Phase 5** — Tier/engine refactor (zero-nudge app-tier, parasite class sweep)
5. **Phase 4** — Concept hardening (baseline invariant validation)

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
- Favor smaller canonical primitives over broad pattern coverage.
- No `data-*` CSS selectors — use `is-*` class selectors for state/variant toggling.
- No `ui-*` typography roles — only `body` + `h1`–`h6` are valid roles.
- IBM Plex is brand-layout-ops only; baseline-foundry uses Ubuntu Sans exclusively.
- If React becomes important later, add canonical React primitives instead of wrapping legacy markup contracts.