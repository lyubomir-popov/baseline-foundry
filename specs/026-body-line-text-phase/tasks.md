# Tasks: Body-line text phase

**Input**: [spec.md](spec.md), [plan.md](plan.md), [research.md](research.md),
[contracts/body-line-phase.md](contracts/body-line-phase.md)

`[P]` marks tasks that can run in parallel with other tasks in the same phase
(different files, no unmet dependency). `[US1]`–`[US3]` map to the user stories in the spec.

## Phase 1 – Setup

- [ ] T001 Confirm the worktree is on `feat/026-body-line-text-phase`,
  register the package in `docs/specs.md` and `AGENT-INBOX.md`, and rebase
  onto `main` (including Spec 025 if it has landed) before T002. Any later
  rebase re-runs T002 before T010.
- [ ] T002 After T001 and before any source edit, run
  `npm run setup:demo-font` (the gitignored IBM Plex font is otherwise missing
  and the experiment build throws before `build:lib`), then `npm run build`;
  copy `dist/` to `tmp/026-main-dist/` and record SHA-256 hashes of every CSS,
  `tokens.json` and `surfaces.json` in `specs/026-body-line-text-phase/review.md`.
- [ ] T003 [P] Inventory from markup, not CSS: in `demo/components`,
  `demo/patterns` and the README examples, list every bare `p`, `h1`–`h6` and
  `li` and every `.bf-body`/`.bf-hN` inside a component root, and every
  `.bf-prose` inside a component root with its direct children. Record the
  list in `review.md` and confirm none is matched by the prose-flow scope
  (research D1); any match is a defect to resolve before T008.

## Phase 2 – Foundational compute

- [ ] T004 Create `src/body-line-rhythm.ts`: a pure function taking hhea
  metrics per font family, `bU` and in-scope role tokens, returning per-role
  `rhythmStep`, `firstBaseline`, `phaseStart`, `closureEnd` and any failed
  contract build-time checks.
- [ ] T005 Add optional `bodyLineRhythm` to `ThemeSurface` in `src/types.ts`
  without touching `ThemeTokens`, `TypographyToken` or manifest entry types.
  Declare `readFontMetrics` in `src/baseline-nudge-generator.d.ts`, or reuse
  the dynamic-import cast in `src/build.ts` `generateBaselineTokens`.
- [ ] T006 In `src/build.ts` `buildThemeSurface`, read metrics with
  `readFontMetrics` per role `fontFamily` from the source config's
  non-`runtimeOnly` font files, paths resolved relative to the source config;
  call T004. Surfaces built by `scripts/build-theme.ts` throw on any failed
  check or missing data; custom surfaces get no record (depends on T004,
  T005).
- [ ] T007 In `scripts/validate-build.ts`, import `src/body-line-rhythm.ts`
  directly (records are not written to `dist/`) and assert the 28 tier/role
  records against the contract table and formulas (AC-1). The recomputed
  generator nudge passes line height as a bU count. Keep the existing
  `marginBottom = bU − nudgeTop` assertion unchanged.

**Checkpoint**: `npm run build` and `npm run test:build` pass; every CSS,
`tokens.json` and `surfaces.json` in `dist/` is byte-equal to
`tmp/026-main-dist/`. Compiled TypeScript outputs (`dist/body-line-rhythm.*`,
`dist/build.js`, `dist/types.d.ts`) are expected to differ.

## Phase 3 – US1 opt-in section (P1)

- [ ] T008 [US1] In `src/css.ts`, add root rhythm data to
  `generateFoundryCss` options and emit the contract section, with opening and
  closing comments, after the `.bf-prose` list and blockquote rules: root
  block, class-surface blocks, nested reset, prose-flow application, prose
  `li`, `ul` marker shift and the loose-item rule, with the cap-engine
  exclusion on every application selector. Emit nothing unless every surface
  has rhythm data (depends on T003, T006).
- [ ] T009 [US1] In `scripts/validate-build.ts`, add identity (section
  stripped from opening to closing comment equals no-rhythm generation, per
  direct, preset and experiment bundle), cascade/order/specificity, a static
  check that every application selector carries
  `:not(:where(.bf-engine-cap, .bf-engine-cap *))`, no-`data-*`, direct/class
  parity, and a markup scan of `demo/components`, `demo/patterns` and README
  examples for application-selector matches inside component roots (AC-2 to
  AC-4).
- [ ] T010 [US1] Rebuild and diff `dist/` against `tmp/026-main-dist/` with
  the section stripped; confirm every `tokens.json` and `surfaces.json` is
  byte-equal; record the result in `review.md`. If the branch was rebased
  after T002, re-run T002 first.

**Checkpoint**: static acceptance AC-1 to AC-4 green.

## Phase 4 – Demo route (serves US2 and US3)

- [ ] T011 [US3] Create `demo/spec/body-line-rhythm.html` and
  `demo/body-line-rhythm.js`: page chrome with tier and tone controls; a
  nested opt-in `.bf-theme` column whose tier and tone classes mirror the
  page; current and opt-in ledgers side by side for a stacked h2, two
  paragraphs and a prose list, labelled with computed nudge, phase and closure.
- [ ] T012 [US3] Add the gap comparison row – (a) default `.bf-prose` and
  `bf-stack` gaps; (b) labelled candidate specimen rules
  `round(up, var(--bf-stack-space), var(--bf-body-rhythm-step))` on the stack
  and `round(up, var(--bf-section-space-shallow), var(--bf-body-rhythm-step))`
  on the prose block; (c) a zero prose gap; (d) the (b) rules with
  `round(down, …)` – and a demo-local body-line ruling.
- [ ] T013 [US2] Add rendered fixtures to the same page, each in an opted and
  a non-opted column: a one-line h1–h6 plus body matrix in a zero-gap
  `.bf-prose` (demo-local `gap: 0` specimen rule); forced two- and three-line
  headings with `<br>`; a nested non-opted theme; a metric-flush pair in
  `.bf-prose.bf-stack.is-metric-flush` followed by a paragraph; prose `ul`
  tight, loose (`li > p`) and nested; `hr` and `blockquote` between
  paragraphs. Probes are JS/test hooks only.
- [ ] T014 [P] Register the route in `demo/page-catalog.js` with the spec
  chapter pages and extend the BF-only demo markup checks in
  `scripts/validate-build.ts`.

## Phase 5 – US2 rendered proof (P2)

- [ ] T015 [US2] In `scripts/verify-component-behavior.ts`, add the
  differential one-line family: Chromium DPR 1, roots 16px and 32px, four
  tiers; `probe − elementTop` opted minus non-opted equals the phase, and each
  element top minus the previous element top is whole steps, both within
  0.1px (AC-5). Write absolute ε per tier, role and root to `review.md`
  without asserting it.
- [ ] T016 [US2] Add the wrapped family: line-to-line distance equals `lh`
  within 0.1px; qualifying roles' following sibling on whole steps; editorial
  h3, documentation h3, app h1 and os h1 at two lines have `line 2 − line 1`
  off the nearest whole step by the research R3 prediction within 0.1px and
  by at least one bU (AC-6).
- [ ] T017 [US2] Add differential edge checks within 0.1px: nested reset,
  metric-flush internal baseline-to-baseline distance, prose dot offset from
  the first probe, loose vs tight item (AC-7). Measure and record the
  contract's exception offsets (metric-flush downstream, nested list, `hr`,
  `blockquote`) without asserting them.
- [ ] T018 [US2] Run `npm run test:behavior` with the existing families
  unmodified, including the bU page-wide phase contract (AC-8).

**Checkpoint**: rendered acceptance AC-5 to AC-8 green; ε and exception
offsets recorded.

## Phase 6 – Docs and CP-A

- [ ] T019 [P] Document `.is-body-line-rhythm` as a provisional opt-in
  theme-root modifier for prose flows in `README.md`, and add an opt-in note
  to the container-owned rhythm section of `docs/architecture.md`.
- [ ] T020 [P] In the same change that ships the modifier, add the scoped
  opt-in exception note from research D6 to the product invariants in
  `AGENTS.md`, citing the 2026-09-30 owner approval, without changing the
  invariant wording listed there.
- [ ] T021 Run `npm test` and `npm run qa:components` (AC-10).
- [ ] T022 Review the demo in editorial, documentation, app and os, light and
  dark, plus a 32px-root spot check, and the regression routes in
  [quickstart.md](quickstart.md); record findings in `review.md` (AC-9).
- [ ] T023 Complete `review.md` with evidence and request owner visual
  review.

**CP-A**: implementation and demo ready for owner visual review. Stop here.

## Owner decision – container gaps

- [ ] T024 BLOCKED on owner: rule on D4 option (a), (b), (c) or (d) from the
  demo; record the ruling and date in `research.md` D4.
- [ ] T025 Implement the ruled gap behaviour under the modifier in
  `src/css.ts`, remove the demo candidate rules, and extend static and
  rendered checks to prove phase after the affected containers. Scope any
  stack rule to stacks that hold prose; if (c) is extended to stacks, add the
  modifier the ruling names and amend FR-001 (depends on T024).
- [ ] T026 Re-run `npm test` and `npm run qa:components`; update `review.md`.

**Checkpoint**: gap ruling implemented; Phase A closeable.

## CP-B – Default flip (blocked on owner)

Not part of Phase A. Starts only after separate owner approval following
browser review of CP-A.

- [ ] T027 BLOCKED on owner: approve flipping the default.
- [ ] T028 Make body-line rhythm the default for in-scope text and decide the
  modifier's fate (retire, or keep as a no-op for one deprecation window).
- [ ] T029 Rewrite the invariant statements listed in research D6 in
  `AGENTS.md`, `docs/architecture.md` and `docs/agent-index.md`.
- [ ] T030 Replace the text parts of `scripts/validate-build.ts` lines
  376–379 and `scripts/verify-component-behavior.ts` lines 506–512 with
  body-line equivalents; keep bU contracts for controls.
- [ ] T031 Serialize the terms into tokens and surface manifests with
  documented meanings and equality assertions.
- [ ] T032 Resolve the T003 inventory and whether `bf-stack`/`bf-section`
  text joins the scope, and the `blockquote`, `hr`, `pre`/`code`,
  nested-list, metric-flush downstream and `a.bf-text-link` exceptions.
- [ ] T033 Full gates, screenshot rebaseline review, four-tier browser review
  and closeout in `review.md`.

**CP-B**: default flipped and bU text ledger retired.

## Dependencies

- T001 → T002 → every source edit. Any rebase after T002 re-runs T002 before
  T010. T003 can run in parallel with T002 and precedes T008.
- T004 → T005 → T006 → T008 → T009 → T010.
- T007 needs T004 and T005. T011–T014 need T008. T015–T018 need T013.
- T020 lands in the same change as T008. T019 can run any time after T008.
  T021–T023 need all earlier Phase A tasks.
- T024 needs CP-A. T025 needs T024. CP-B needs T026 and a separate approval.
