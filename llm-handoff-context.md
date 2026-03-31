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

## Current state (updated 2026-04-01)

Clean sibling to `portable-vertical-rhythm`: real font metrics, editorial-first baseline alignment, Canonical `4 / 8 / 16` grid primitives, tier-first runtime/build model (`editorial`, `documentation`, `app`). All three tiers now use **Ubuntu Sans Variable** with canonical weights (500/200/500/300/550/550 editorial pattern). Documentation tier overhauled to bU=0.25rem with sizes, lineHeights, and spaceAfter matching canonical exactly. All tests pass (build validation, component baselines, behavior).

Phase 7 — Demo and parity cleanup — **COMPLETE**:
- **Living-spec pages** (index, typography, spacing, grid) gutted and rewritten: only `bf-grid`, `bf-stack`, `bf-cluster`, `bf-section` layout primitives. All text is Latin lorem ipsum. No heroes, cards, or decorative containers.
- **Zero data-* CSS**: all `data-*` attribute CSS selectors removed from demo CSS. Page-chrome uses `pc-*` class selectors. Component atlas uses `demo-index-*` class selectors. JS-only hooks (`data-page-chrome-tone-toggle`, `data-spec-role-list`, etc.) remain but have no CSS.
- **bf-section.is-shallow** added as tier-aware shallow section spacing token (editorial 2rem, app 1.5rem).
- **Controls page** cleaned up: hero removed, padding symmetry fix, sidenav drawer fix.
- **Visual parity audit** completed for all 6 Partial rows. Findings in `docs/rebuild-plan.md` → Parity audit priority summary.

## Current sprint TODO

The authoritative backlog lives in `docs/rebuild-plan.md` → Remaining phases (4–5). Current priority order:

1. **Phase 7 — COMPLETE** ✅
2. **Phase 6 — COMPLETE** ✅
3. **Phase 5** — Tier/engine refactor (zero-nudge app-tier, parasite class sweep)
4. **Phase 4** — Concept hardening (baseline invariant validation)

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
- Avoid importing old Vanilla or compatibility assumptions unless they clearly survive modern scrutiny.
- If React becomes important later, add canonical React primitives instead of wrapping legacy markup contracts.