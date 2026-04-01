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

Clean sibling to `portable-vertical-rhythm`: real font metrics, editorial-first baseline alignment, Canonical `4/8/16` grid, tier-first build model (`editorial`, `documentation`, `app`). All three tiers use Ubuntu Sans Variable matching canonical weights exactly. The latest control follow-up completed the broader occupied-block rollout for bordered, padded controls: shared tier overrides keep computed nudges for editorial/documentation while zero-nudging `app` only; inputs/selects/buttons and the rest of the control family resolve block padding from real tier nudges in nudged tiers and fixed fallback padding in `app`; component demos now boot editorial by default; and the app-tier demo shell no longer forces a white surface that hides the baseline grid. Baseline verification now measures occupied block height (`border box + margin-bottom`) consistently, with composite demos narrowed to the actual control surfaces instead of incidental wrappers. The stacked button proof in `demo/components/button.html` still demonstrates the invariant: actual text baselines step by `~35.97px` (`error ~0.03px`) on the `4px` grid, while each button's occupied block also lands at `~35.97px` (`error ~0.03px`) and each top border offset stays within `0.08px` of the grid. Cold starts should not try to force the raw button border box to a baseline multiple; the invariant applies to the occupied block. `npm run test:components` is now green for the control suite touched by this rollout; the only remaining component-baseline failure is `table`, which is a separate flow-offset issue rather than a padded-control compensation regression.

**Living-spec audit complete.** No `p-*` parasites. No deprecated patterns in demos. No styled `data-*` attributes. Remaining cleanup items are tracked in `docs/TODO.md`: `l-*` alias hygiene in demos + CSS, `bf-theme--light` alias, dead `bf-panel-logo` selector, `bf-label`/`bf-status-label` redundancy, `bf-u-no-margin.is-bottom` naming, plus a follow-up audit to keep tier token surfaces explicit when new properties are added. OS tier remains triaged as an addendum item.

## Where to look

| What | Where |
|------|-------|
| Active tasks + principles + architecture | `docs/TODO.md` |
| Longer-term stages + parity inventory | `docs/product-roadmap.md` |
| Completed work log | `docs/history.md` |
| User inbox (triage first) | `docs/AGENT-INBOX.md` |

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
- Controls follow the Vanilla model: symmetric `padding-block = nudge - border`, no explicit `block-size`, and `margin-bottom = compensation + spaceAfter`, so the occupied block (`border box + margin-bottom`) snaps to the grid. See `docs/TODO.md` → `Control baseline-grid invariant`.
- Control density comes from tier tokens, not per-component `.is-dense` rules or target-height vars.
- Layout containers (Stack, Cluster, Stage-shell) own child spacing via child reset. No margin/padding on text elements inside stacks.
- Tier switching = class-based (`.bf-tier-app` / `.bf-tier-documentation` on theme root). No stylesheet swapping.
- Component and root typography must read role-scoped vars for the active tier; do not reintroduce frozen editorial literals.
- Cap engine (`.bf-engine-cap`) is demo-only — drifts at larger sizes.
- No `data-*` CSS selectors. No `ui-*` roles. Only `body` + `h1`–`h6` are valid roles.
- IBM Plex is brand-layout-ops only; baseline-foundry uses Ubuntu Sans exclusively.
