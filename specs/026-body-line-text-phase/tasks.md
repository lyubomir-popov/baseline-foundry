# Tasks: Body-line text phase

**Input**: [spec.md](spec.md), [plan.md](plan.md), [research.md](research.md),
[contracts/body-line-phase.md](contracts/body-line-phase.md)

`[P]` marks tasks that can run in parallel with other tasks in the same phase
(different files, no unmet dependency). `[US1]`–`[US3]` map to the user stories in the spec.

## Phase 1 – Setup

- [x] T001 Confirm the worktree is on `feat/026-body-line-text-phase`,
  register the package in `docs/specs.md` and `AGENT-INBOX.md`, and rebase
  onto `main` (including Spec 025 if it has landed) before T002. Any later
  rebase re-runs T002 before T010.
  *Evidence 2026-09-30*: branch confirmed; registered in both files. Rebase
  skipped: the branch already sits on `main` (`6c43f99`, equal to
  `origin/main`) and Spec 025 has not landed, so `main` is the base.
- [x] T002 After T001 and before any source edit, run
  `npm run setup:demo-font` (the gitignored IBM Plex font is otherwise missing
  and the experiment build throws before `build:lib`), then `npm run build`;
  copy `dist/` to `tmp/026-main-dist/` and record SHA-256 hashes of every CSS,
  `tokens.json` and `surfaces.json` in `specs/026-body-line-text-phase/review.md`.
  *Evidence*: captured at `c6016b2`; 24 hashes in review.md.
- [x] T003 [P] Inventory from markup, not CSS: in `demo/components`,
  `demo/patterns` and the README examples, list every bare `p`, `h1`–`h6` and
  `li` and every `.bf-body`/`.bf-hN` inside a component root, and every
  `.bf-prose` inside a component root with its direct children. Record the
  list in `review.md` and confirm none is matched by the prose-flow scope
  (research D1); any match is a defect to resolve before T008.
  *Evidence*: 478 bare and 136 role-classed text elements in component
  roots; the only 3 component-internal `.bf-prose` are the quote wrapper
  with a lone `blockquote`; 0 of 58 prose-flow matches are inside a
  component root (review.md).

## Phase 2 – Foundational compute

- [x] T004 Create `src/body-line-rhythm.ts`: a pure function taking hhea
  metrics per font family, `bU` and in-scope role tokens, returning per-role
  `rhythmStep`, `firstBaseline`, `phaseStart`, `closureEnd` and any failed
  contract build-time checks.
- [x] T005 Add optional `bodyLineRhythm` to `ThemeSurface` in `src/types.ts`
  without touching `ThemeTokens`, `TypographyToken` or manifest entry types.
  Declare `readFontMetrics` in `src/baseline-nudge-generator.d.ts`, or reuse
  the dynamic-import cast in `src/build.ts` `generateBaselineTokens`.
- [x] T006 In `src/build.ts` `buildThemeSurface`, read metrics with
  `readFontMetrics` per role `fontFamily` from the source config's
  non-`runtimeOnly` font files, paths resolved relative to the source config;
  call T004. Surfaces built by `scripts/build-theme.ts` throw on any failed
  check or missing data; custom surfaces get no record (depends on T004,
  T005).
  *Evidence*: built-in tier/preset configs always require the record;
  `scripts/build-theme.ts` passes `requireBodyLineRhythm: true` for the
  default and experiment builds. A custom surface gets a record when it can be
  computed and none otherwise (contract and research T4 amended). The option
  is `@internal` and stripped from `dist/build.d.ts` (`be239ef`).
- [x] T007 In `scripts/validate-build.ts`, import `src/body-line-rhythm.ts`
  directly (records are not written to `dist/`) and assert the 28 tier/role
  records against the contract table and formulas (AC-1). The recomputed
  generator nudge passes line height as a bU count. Keep the existing
  `marginBottom = bU − nudgeTop` assertion unchanged.
  *Evidence*: “Body-line rhythm formulas”, 313 checks, via
  `scripts/validation/body-line-rhythm-contracts.ts`. Checkpoint met: after
  T004–T007 every CSS, `tokens.json` and `surfaces.json` hashed equal to the
  capture.

**Checkpoint**: `npm run build` and `npm run test:build` pass; every CSS,
`tokens.json` and `surfaces.json` in `dist/` is byte-equal to
`tmp/026-main-dist/`. Compiled TypeScript outputs (`dist/body-line-rhythm.*`,
`dist/build.js`, `dist/types.d.ts`) are expected to differ.

## Phase 3 – US1 opt-in section (P1)

- [x] T008 [US1] In `src/css.ts`, add root rhythm data to
  `generateFoundryCss` options and emit the contract section, with opening and
  closing comments, after the `.bf-prose` list and blockquote rules: root
  block, class-surface blocks, nested reset, prose-flow application, prose
  `li`, `ul` marker shift and the loose-item rule, with the cap-engine
  exclusion on every application selector. Emit nothing unless every surface
  has rhythm data (depends on T003, T006).
  *Evidence*: section emitted in all 8 bundles; T020 (`AGENTS.md` note) is
  deliberately left for the T011+ pass and must land before merge. Review
  correction `57d158d`: the loose-item rule reads
  `--bf-body-loose-item-start`/`-end`, restored by the nested reset.
- [x] T009 [US1] In `scripts/validate-build.ts`, add identity (section
  stripped from opening to closing comment equals no-rhythm generation, per
  direct, preset and experiment bundle), cascade/order/specificity, a static
  check that every application selector carries
  `:not(:where(.bf-engine-cap, .bf-engine-cap *))`, no-`data-*`, direct/class
  parity, and a markup scan of `demo/components`, `demo/patterns` and README
  examples for application-selector matches inside component roots (AC-2 to
  AC-4).
  *Evidence*: checks live in
  `scripts/validation/body-line-rhythm-contracts.ts`, run from
  `validate-build.ts`: section 246 checks per built-in bundle and 171 for the
  experiment, parity 66, no-op 5, markup scope 59.
- [x] T010 [US1] Rebuild and diff `dist/` against `tmp/026-main-dist/` with
  the section stripped; confirm every `tokens.json` and `surfaces.json` is
  byte-equal; record the result in `review.md`. If the branch was rebased
  after T002, re-run T002 first.
  *Evidence*: 8/8 CSS equal after stripping, 16/16 JSON byte-equal, no
  rebase since T002; `npm run test:build` 26,686 checks green (review.md).

**Checkpoint**: static acceptance AC-1 to AC-4 green.

## Phase 4 – Demo route (serves US2 and US3)

- [x] T011 [US3] Create `demo/spec/body-line-rhythm.html` and
  `demo/body-line-rhythm.js`: page chrome with tier and tone controls; a
  nested opt-in `.bf-theme` column whose tier and tone classes mirror the
  page; current and opt-in ledgers side by side for a stacked h2, two
  paragraphs and a prose list, labelled with computed nudge, phase and closure.
  *Evidence*: ledger tables read the computed role properties per tier, for
  example Documentation opt-in h2 0.03875 / 0.5 / 0.71125rem, 3.75rem
  occupied. Specimen CSS lives in the page-local `demo/body-line-rhythm.css`.
- [x] T012 [US3] Add the gap comparison row – (a) default `.bf-prose` and
  `bf-stack` gaps; (b) labelled candidate specimen rules
  `round(up, var(--bf-stack-space), var(--bf-body-rhythm-step))` on the stack
  and `round(up, var(--bf-section-space-shallow), var(--bf-body-rhythm-step))`
  on the prose block; (c) a zero prose gap; (d) the (b) rules with
  `round(down, …)` – and a demo-local body-line ruling.
  *Evidence*: live gap read-outs match research R7 – Documentation (b)
  2.5rem, (d) 1.25rem; App (b) 1.25rem, (d) 0; OS (b) 2rem, (d) 1rem.
- [x] T013 [US2] Add rendered fixtures to the same page, each in an opted and
  a non-opted column: a one-line h1–h6 plus body matrix in a zero-gap
  `.bf-prose` (demo-local `gap: 0` specimen rule); forced two- and three-line
  headings with `<br>`; a nested non-opted theme; a metric-flush pair in
  `.bf-prose.bf-stack.is-metric-flush` followed by a paragraph; prose `ul`
  tight, loose (`li > p`) and nested; `hr` and `blockquote` between
  paragraphs. Probes are JS/test hooks only.
  *Evidence*: probes are injected by the behaviour test; the matrix also
  carries a `p.bf-h3` beside `h3` for the one-box check. Review correction
  `57d158d` adds tight and loose lists inside a nested non-opted theme.
- [x] T014 [P] Register the route in `demo/page-catalog.js` with the spec
  chapter pages and extend the BF-only demo markup checks in
  `scripts/validate-build.ts`.
  *Evidence*: “Body-line rhythm demo” 52 checks; the stylesheet joins
  “Demo CSS selector hygiene”.

## Phase 5 – US2 rendered proof (P2)

- [x] T015 [US2] In `scripts/verify-component-behavior.ts`, add the
  differential one-line family: Chromium DPR 1, roots 16px and 32px, four
  tiers; `probe − elementTop` opted minus non-opted equals the phase, and each
  element top minus the previous element top is whole steps, both within
  0.1px (AC-5). Write absolute ε per tier, role and root to `review.md`
  without asserting it.
  *Evidence*: family in `scripts/behavior/body-line-rhythm-contracts.ts`,
  run from `main()`; max phase residual 0.0000px; ε in review.md. Review
  correction `900f8c8` adds a whole-step check independent of
  `computeBodyLineRhythm` (max 0.938px @16px, 1.844px @32px) and a direct
  documentation/app/os bundle spot check.
- [x] T016 [US2] Add the wrapped family: line-to-line distance equals `lh`
  within 0.1px; qualifying roles' following sibling on whole steps; editorial
  h3, documentation h3, app h1 and os h1 at two lines have `line 2 − line 1`
  off the nearest whole step by the research R3 prediction within 0.1px and
  by at least one bU (AC-6).
  *Evidence*: all four proofs measure 8.00px at 16px and 16.00px at 32px.
- [x] T017 [US2] Add differential edge checks within 0.1px: nested reset,
  metric-flush internal baseline-to-baseline distance, prose dot offset from
  the first probe, loose vs tight item (AC-7). Measure and record the
  contract's exception offsets (metric-flush downstream, nested list, `hr`,
  `blockquote`) without asserting them.
  *Evidence*: all edge checks pass; offsets match the contract table within
  0.03px (review.md). Review correction `57d158d` adds nested non-opted
  tight/loose list equality and the loose-item dot check.
- [x] T018 [US2] Run `npm run test:behavior` with the existing families
  unmodified, including the bU page-wide phase contract (AC-8).
  *Evidence*: existing families untouched; the new family is appended to
  `main()`; “Component behavior verification passed.”

**Checkpoint**: rendered acceptance AC-5 to AC-8 green; ε and exception
offsets recorded.

## Phase 6 – Docs and CP-A

- [x] T019 [P] Document `.is-body-line-rhythm` as a provisional opt-in
  theme-root modifier for prose flows in `README.md`, and add an opt-in note
  to the container-owned rhythm section of `docs/architecture.md`.
- [x] T020 [P] In the same change that ships the modifier, add the scoped
  opt-in exception note from research D6 to the product invariants in
  `AGENTS.md`, citing the 2026-09-30 owner approval, without changing the
  invariant wording listed there.
  *Evidence*: landed on the feature branch before merge (commit
  `729395d`), not in the T008 commit itself.
- [x] T021 Run `npm test` and `npm run qa:components` (AC-10).
  *Evidence*: both green; counts in review.md. Re-run green after the review
  corrections at `d73ad36` (review.md “Review corrections”).
- [ ] T022 Review the demo in editorial, documentation, app and os, light and
  dark, plus a 32px-root spot check, and the regression routes in
  [quickstart.md](quickstart.md); record findings in `review.md` (AC-9).
- [ ] T023 Complete `review.md` with evidence and request owner visual
  review.

**CP-A**: implementation and demo ready for owner visual review. Stop here.

## Owner decision – container gaps

- [x] T024 Owner rules on D4 option (a), (b), (c) or (d) from the demo;
  record the ruling and date in `research.md` D4.
  *Evidence*: ruling R6, 2026-09-30 – option (c), extended to stacks as an
  exact gap cancel between adjacent text blocks; research D4 closed, D8.
- [x] T025 Implement the ruled gap behaviour for the default body-line ledger
  (leaving `.is-baseline-rhythm` on main's gaps) in `src/css.ts`, remove the
  demo candidate rules, and extend static and rendered checks to prove phase
  after the affected containers.
  *Evidence*: `--bf-text-gap-scale` drives the prose gap and the stack text
  join (research T13–T15); no modifier needed. Candidates removed from the
  demo and its stylesheet; one ruled (c) specimen with prose, stack, section
  and text → component → text fixtures. Static and rendered contracts in
  review.md “R6–R7”.
- [x] T026 Re-run `npm test` and `npm run qa:components`; update `review.md`.
  *Evidence*: review.md “R6–R7 gates”.

**Checkpoint**: gap ruling implemented; Phase A closeable.

## CP-B – Default flip

Approved by the owner rulings of 2026-09-30 (spec “Owner rulings”, research
D7), which also amend the scope: container-owned list blocks (R3) and the
hgroup join (R4).

- [x] T027 Owner approves flipping the default.
  *Evidence*: rulings R1–R5, 2026-09-30, recorded in spec.md and research D7.
- [x] T028 Make body-line rhythm the default for in-scope text and decide the
  modifier's fate.
  *Evidence*: `.is-body-line-rhythm` removed (never released); root and tier
  blocks declare the body-line terms on `:where(.bf-theme)` and
  `:where(.bf-theme.bf-tier-<tier>)`; `:where(.bf-theme.is-baseline-rhythm)`
  redeclares them to the bU ledger. The Phase A nested reset is gone. Section
  comments renamed “Body-line rhythm (Spec 026)” / “End body-line rhythm
  (Spec 026)”.
- [x] T029 Rewrite the invariant statements listed in research D6 in
  `AGENTS.md`, `docs/architecture.md` and `docs/agent-index.md`.
  *Evidence*: all three now state that prose text defaults to body-line phase
  with container-owned list blocks and that `.is-baseline-rhythm` restores the
  bU ledger; the Phase A scoped-exception bullet is removed. README documents
  the default and the opt-out.
- [x] T030 (amended) Review the bU text contracts against the default.
  *Evidence*: `scripts/validate-build.ts` `marginBottom = bU − nudgeTop` is a
  token contract and still holds (the tokens and `--bf-<role>-margin-bottom`
  are unchanged). The page-wide bU phase contract in
  `scripts/verify-component-behavior.ts` passes unmodified, because every
  body-line term is a whole-bU translation. Two checks legitimately change and
  are recorded with reasons in review.md: prose-list item boxes in
  `scripts/verify-component-baselines.ts` are measured from their list's
  content box, and the one-item prose-list text-run specimen is asserted as a
  two-body-line block.
- [ ] T031 Serialize the terms into tokens and surface manifests with
  documented meanings and equality assertions. *Open*: not covered by the
  rulings; the terms stay CSS-private.
- [ ] T032 Resolve the T003 inventory and whether `bf-stack`/`bf-section`
  text joins the scope, and the `blockquote`, `hr`, `pre`/`code`,
  metric-flush downstream and `a.bf-text-link` exceptions. *Partly done*: the
  nested-list exception is resolved by R3 and the stack/section scope by R7;
  the rest stays open.
- [x] T033 Full gates, screenshot review and closeout in `review.md`.
  *Evidence*: review.md “CP-B default flip”. Browser review is the four-tier
  light capture set in `tmp/026-review/flip/`; dark-tone review remains with
  T022.
- [x] T034 (R3) Container-owned prose list block: list start and closure
  computed in `src/body-line-rhythm.ts`, `lh_body = step` and the list closure
  asserted statically per tier; items, nested lists and loose text carry no
  block terms; loose items one step apart; dot keeps main's offset; the
  per-`li` ledger and `--bf-body-loose-item-*` removed. Rendered: every line
  delta at three nesting levels, tight, ordered and loose deltas, dot parity
  with main.
- [x] T035 (R4) Heading-group join with the static cap-height-plus-descender
  proof. Four pairs fail (Documentation h1/h2 → h5/h6, OS h1/h2 → h3/h4) and
  stay unjoined through `--bf-hgroup-join-<P>-<N>`. Rendered: h1 + h2 and
  h1 + p specimens, predicted h1 → h2 distance, phase after the group.
- [x] T036 (R1) Differential check that every `.is-baseline-rhythm` fixture
  equals main, rendering the same route with the section stripped from the
  tier bundle.

**CP-B**: default flipped; bU text ledger available as the
`.is-baseline-rhythm` opt-out.

## R6–R7 – Flow text everywhere, self-spacing text blocks

Owner rulings R6–R7, 2026-09-30 (spec, research D8).

- [x] T037 (R7) Unscope the role, hgroup and list rules from `.bf-prose`;
  derive the component-root list from the CSS after the section and share
  the `.is-baseline-rhythm` block with it (`src/css.ts`).
  *Evidence*: commit `1cf47ce`; 356 roots per tier bundle.
- [x] T038 (R6) Prose gap and stack text join through `--bf-text-gap-scale`;
  the join never uses a child stack's own space and never applies in a
  `.bf-prose.bf-stack`.
  *Evidence*: commit `1cf47ce`.
- [x] T039 Static contracts: unscoped selectors, root-list derivation and
  equality, gap rules and opt-out restore, markup coverage of every
  component class and component text element.
  *Evidence*: `scripts/validation/body-line-rhythm-contracts.ts`, commit
  `1cf47ce`.
- [x] T040 Rendered contracts and page-text behaviour updates; component
  baselines unchanged.
  *Evidence*: commit `6be0fa9`; review.md “Changed behaviour assertions”.
- [x] T041 Demo: ruled (c) specimen, stack, section and text → component →
  text fixtures; docs and invariants.
  *Evidence*: commits `47c97cd`, `56fa1e4`.

**R6–R7**: done. T022 dark review, T023, T031 and the rest of T032 remain
open; the section-stack gap clamp (research T18) needs an owner decision.
*Superseded by F4: section stacks no longer cancel.*

## F1–F11 – Adversarial review fixes

Orchestrator rulings, 2026-09-30, pending owner confirmation (spec, research
D9).

- [x] T042 (F1, F4, F6, F7) Prose keeps its gap; per-modifier
  `--bf-text-join-gap` declared on stack and prose children in main's order,
  section stacks and `is-flush` at 0; one join rule for prose and stacks
  excluding `hgroup` and `is-metric-flush` parents, hidden preceding blocks
  and reset roots on both sides; `hgroup.bf-stack` gap scaled by the ledger
  (`src/css.ts`).
  *Evidence*: commit `4fe0ddd`.
- [x] T043 (F2) `:not([hidden])` on the preceding compound.
  *Evidence*: commit `4fe0ddd`; adjacency `hidden-first`.
- [x] T044 (F3, F5) `.bf-cluster > *`, `blockquote`, `fieldset`, `table`
  join the bU ledger roots; markup scan covers element roots and cluster
  children; element selectors after the section are checked.
  *Evidence*: commit `4fe0ddd`.
- [x] T045 (F3) Restore main's vertical-audit assertions and demo copy.
  *Evidence*: commit `4fe0ddd`; `scripts/verify-component-behavior.ts`
  lines 453–516 equal main.
- [x] T046 (F1–F7) Rendered adjacency contracts against main in every tier;
  static join-table, element-root and `occupied − gap ≥ 0` proofs.
  *Evidence*: `verifyBodyLineRhythmAdjacency`,
  `validateBodyLineRhythmFormulas`, commit `4fe0ddd`.
- [x] T047 Demo: text-to-text fixtures on BF's own prose gap; wording for
  F1/F4.
  *Evidence*: commit `4fe0ddd`.
- [x] T048 (F9) Pointer-target chrome suspension scoped with `finally`; one
  statement per line.
  *Evidence*: commit `4fe0ddd`.
- [x] T049 (F8, F10, F11) README migration note and scope, release floor in
  `docs/publishing.md`, trimmed `AGENTS.md` bullet, architecture and agent
  index detail, spec, plan, research, contract and review.
  *Evidence*: commit `c2bafea`.

**F1–F11**: done. Open owner questions Q1–Q3 (spec).

## Dependencies

- T001 → T002 → every source edit. Any rebase after T002 re-runs T002 before
  T010. T003 can run in parallel with T002 and precedes T008.
- T004 → T005 → T006 → T008 → T009 → T010.
- T007 needs T004 and T005. T011–T014 need T008. T015–T018 need T013.
- T020 lands in the same change as T008. T019 can run any time after T008.
  T021–T023 need all earlier Phase A tasks.
- T024 needs CP-A. T025 needs T024. CP-B was approved directly by the owner
  rulings of 2026-09-30 and does not wait for D4.
