# LLM Handoff Context

## Repo orientation

| Role | Path |
|------|------|
| Primary | `baseline-foundry` (this repo) |
| Compatibility package | `portable-vertical-rhythm` |
| Canonical design specs | `canonical-specs` |
| Type-scale reference | `docs-typescale` |

## Quick start

```bash
npm install && npm run setup:demo-font && npm run build && npm run demo
```

Demo: `http://127.0.0.1:4174/`

## Current state

Clean sibling to `portable-vertical-rhythm`: real font metrics, editorial-first baseline alignment, Canonical `4/8/16` grid, tier-first build model (`editorial`, `documentation`, `app`). All three tiers use Ubuntu Sans Variable matching canonical weights exactly. Architecture refactor landed: literal CSS values, layout container child reset, tier overrides via class toggle, simplified component vars (3 per role). All tests pass.

## Where to look

| What | Where |
|------|-------|
| Active tasks + principles + architecture | `docs/rebuild-plan.md` |
| Longer-term stages + parity inventory | `docs/product-roadmap.md` |
| Completed work log | `docs/history.md` |
| User inbox (triage first) | `docs/USER.NOTES.MD` |

## Key files

| Purpose | File |
|---------|------|
| CSS generators | `src/css.ts`, `src/css-components.ts`, `src/css-grid.ts`, `src/css-app-tier.ts` |
| Build API / pipeline | `src/build.ts` |
| Tier configs | `config/tiers/{editorial,documentation,app}.json` |
| Theme build script | `scripts/build-theme.ts` |
| Test scripts | `scripts/validate-build.ts`, `scripts/verify-component-baselines.ts`, `scripts/verify-component-behavior.ts` |
| Demo entry | `index.html`, `demo/spec-runtime.js` |

## Critical invariants (do not regress)

- Editorial baseline alignment is sacred. Do not reintroduce app-tier nudges without spec decision.
- Margin-bottom uses `spaceAfter - baselineUnit`. Not a `marginBottom` token.
- Layout containers (Stack, Cluster, Stage-shell) own child spacing via child reset. No margin/padding on text elements inside stacks.
- Tier switching = class-based (`.bf-tier-app` / `.bf-tier-documentation` on theme root). No stylesheet swapping.
- Cap engine (`.bf-engine-cap`) is demo-only — drifts at larger sizes.
- No `data-*` CSS selectors. No `ui-*` roles. Only `body` + `h1`–`h6` are valid roles.
- IBM Plex is brand-layout-ops only; baseline-foundry uses Ubuntu Sans exclusively.
