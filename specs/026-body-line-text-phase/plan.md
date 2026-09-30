# Plan: Body-line text phase

**Branch**: `feat/026-body-line-text-phase` | **Date**: 2026-09-30 |
**Spec**: [spec.md](spec.md)

## Summary

**CP-B update, 2026-09-30.** The owner rulings R1–R5 (spec “Owner
rulings”) flip the default: body-line rhythm applies to prose text without a
class, `.bf-theme.is-baseline-rhythm` restores main's bU ledger, and
`.is-body-line-rhythm` is removed. Prose lists become container-owned blocks
(R3) and prose `hgroup` children join with a one-step pull (R4). The section
stays contiguous and additive, so stripping it still yields main's CSS; that
stripped CSS is also the rendered reference for the opt-out. The Phase A plan
follows for history.

Add an opt-in theme-root modifier, `.bf-theme.is-body-line-rhythm`, under
which prose-flow paragraphs, headings and list items take two element-owned
terms from the Pragma rule: a phase inset after the existing nudge and a
body-line closure that replaces the bU compensation. BF computes both exactly
in TypeScript from the same real font metrics as the nudge, measured from the
grid line the nudge targets so the phase is a whole-bU translation (research
T1), and emits them as private rem literals in one contiguous,
modifier-scoped CSS section. Everything outside that section, and every
`tokens.json` and `surfaces.json`, stays byte-identical. A comparison demo
supports the owner's container-gap ruling (D4); flipping the default is
Phase B. The owner approved the Phase A opt-in for BF on 2026-09-30.

## Technical context

- **Language**: TypeScript (build via `tsx`), generated CSS, demo HTML/JS.
- **Dependencies**: `@lyubomir-popov/baseline-nudge-generator` 1.5.1
  (`readFontMetrics`, `generateFromConfig`); Playwright Chromium for browser
  contracts.
- **Testing**: `scripts/validate-build.ts` (static),
  `scripts/verify-component-behavior.ts` (browser),
  `scripts/verify-component-baselines.ts` and screenshot QA (regression).
- **Target**: generated CSS bundles under `dist/` – all four built-in tiers,
  direct and class-scoped, and the `dist/presets/prose` and
  `dist/presets/app-tier` preset bundles.
- **Constraints**: default output byte-identical; no public spacing property;
  flat `bf-*`/`is-*` API; no type token changes; no reach into component
  text.

## AGENTS check

| Invariant | Status |
|---|---|
| Container-owned semantic spacing | Kept. Terms are element-owned metric corrections; gaps unchanged until D4 |
| Text keeps only nudge and complementary compensation | **Rewritten at CP-B.** Prose text defaults to body-line phase with container-owned list blocks; `.is-baseline-rhythm` restores the bU ledger (owner rulings 2026-09-30). `AGENTS.md`, architecture and agent index carry the new wording |
| A Pragma ruling is not automatically a BF requirement | Met by the BF-specific owner approval; Phase B needs its own ruling |
| Real font metrics, cap engine demo-only | Kept (research D5 and T1); every application selector excludes `.bf-engine-cap` |
| OS first-class, four-tier parity | Modifier and values emitted for all four tiers, direct, preset and class-scoped |
| Controls occupied-block model | Untouched; controls stay on bU |
| Flat `bf-*`/`is-*`, no styled `data-*` | `is-baseline-rhythm` on the theme root (CP-B); `is-body-line-rhythm` removed |
| Plain and role-classed equivalents occupy one box | Both selector shapes emitted per role |
| Never hand-edit `dist/` | Changes in `src/`; rebuild |
| Demos dogfood BF | Demo uses BF classes; local specimen CSS limited to the grid ruling, the zero-gap fixture and the D4 candidates |

One scoped exception, justified above. Phase B may retire the public class
(T028), so the README marks it provisional.

## Source map

| File | Change |
|---|---|
| `src/body-line-rhythm.ts` (new) | Pure `computeBodyLineRhythm(metrics by font family, surface config, roles)` returning per-role `rhythmStep`, `firstBaseline`, `phaseStart`, `closureEnd` plus any failed contract checks |
| `src/baseline-nudge-generator.d.ts` | Declare `readFontMetrics` (strict `tsc` rejects a static import otherwise), or reuse the dynamic-import cast in `src/build.ts` `generateBaselineTokens` |
| `src/types.ts` | Optional `bodyLineRhythm` on `ThemeSurface` only; `ThemeTokens`, `TypographyToken` and manifest entry types unchanged |
| `src/build.ts` | In `buildThemeSurface`, read metrics per role `fontFamily` from the source config's non-`runtimeOnly` font files, paths resolved relative to the source config (research T7); compute and attach the record. Built-in surfaces throw on a failed check; custom surfaces get a record only when it can be computed (research T4). `buildSurfaceManifest` already selects explicit fields, so manifests stay unchanged |
| `scripts/build-theme.ts` | Mark its surfaces as built-in so failed checks throw, through an `@internal` option stripped from the published declarations |
| `src/css.ts` | `generateFoundryCss` option for root rhythm data; emit the contract section, with opening and closing comments, after the prose list/blockquote rules for the root and each class surface |
| `scripts/validate-build.ts` | Formula table (importing `src/body-line-rhythm.ts` directly), identity, cascade, cap-exclusion, parity, component-scope markup scan and demo-markup checks |
| `scripts/verify-component-behavior.ts` | New differential body-line family against the demo fixture |
| `demo/spec/body-line-rhythm.html`, `demo/body-line-rhythm.js` (new) | Comparison demo and rendered fixtures |
| `demo/page-catalog.js` | List the demo with the spec chapter pages |
| `README.md`, `docs/architecture.md` | Provisional opt-in note |
| `AGENTS.md` | Scoped opt-in exception note (research D6) |

`src/css-components*.ts`, tier configs, the nudge generator and `dist/` are
not edited.

## Stages

1. **Rebase, then capture.** Rebase onto `main` (including Spec 025 if it
   has landed). Then, before any source edit, run `npm run setup:demo-font`,
   build, and keep `dist/` as `tmp/026-main-dist/` with hashes of every CSS,
   `tokens.json` and `surfaces.json`. Any later rebase repeats the capture.
   Inventory component markup (research R6, T003).
2. **Compute.** Add the pure module, the typings and the metrics wiring in
   `build.ts`. Static formula tests land with it.
3. **Emit.** Generate the opt-in section. Add identity, cascade,
   cap-exclusion, parity and component-scope checks; compare `dist/` CSS,
   `tokens.json` and `surfaces.json` against the capture.
4. **Demo.** Build the comparison route: per active tier, current and opt-in
   ledgers side by side for a stacked h2, two paragraphs and a list; a gap row
   with (a) default gaps, (b) labelled candidate specimen rules
   `round(up, var(--bf-stack-space), var(--bf-body-rhythm-step))` on the stack
   and `round(up, var(--bf-section-space-shallow), var(--bf-body-rhythm-step))`
   on the prose block, (c) a zero prose gap and (d) the (b) rules rounding
   down; a one-line heading matrix; forced wrapped fixtures; tight, loose and
   nested lists; `hr`, `blockquote` and metric-flush exception specimens; a
   body-line ruling. The opt-in column is a nested `.bf-theme` root whose tier
   and tone classes mirror the page chrome.
5. **Rendered proof.** Add the differential browser family (contract
   “Rendered obligations”), record ε and exception offsets, and run existing
   families unmodified.
6. **CP-A.** Docs notes, full gates, four-tier light/dark review, `review.md`,
   owner review request.
7. **Gap ruling.** After the owner rules on D4, implement the chosen behaviour
   under the modifier, remove the demo candidate rules and extend the checks.
8. **Phase B** is blocked on a separate owner approval.

## Validation economy

Run `npm run setup:demo-font` once per fresh worktree; without it the
experiment build throws on the missing IBM Plex font. Iterate with
`npm run build` plus `npm run test:build`. Run `npm run test:behavior` once
the demo exists. Run `npm test` and `npm run qa:components` at CP-A and after
the gap ruling. Screenshot baselines should not change in Phase A because no
captured route carries the modifier; any diff is a defect.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Absolute residual ε up to 1.8px at a 32px root (engine pixel rounding, drift over-correction) | Differential rendered checks; ε recorded as generator metric-authority data; nudges not patched |
| Nested theme inheritance | Scoped reset (contract section shape, block 3) and a rendered check |
| Prose dot left behind by phase | Marker shift in the section and a differential dot check |
| Opt-in reaching component text | Prose-flow scope (research D1); T003 markup inventory; static markup scan |
| Opt-in overriding the cap-engine demo | `:not(:where(.bf-engine-cap, .bf-engine-cap *))` on every application selector; static check |
| Loose lists doubling the terms | Loose-item rule (research T6) and a differential check |
| Custom themes failing to build | Only built-in surfaces throw; custom surfaces no-op (research T4) |
| Spec 025 overlap in `src/css.ts` and the behaviour suite | Rebase before the capture; any later rebase repeats it |
| Chromium `round()` support for the demo candidates | Library text terms use literals; only the demo candidates and a later (b)/(d) ruling need `round()` |
