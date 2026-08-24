# Tasks: element-owned typography selectors

**Input**: [`spec.md`](spec.md), [`plan.md`](plan.md), and [`research.md`](research.md)

## Phase 1 — Contract and regression

- [x] T001 Record the selector conflict, ownership decision, and reciprocal
  acceptance in the Spec 002 package.
- [x] T002 Add generated-CSS assertions in `scripts/validate-build.ts` that
  reject prose-prefixed paragraph, heading, and figcaption typography while
  preserving semantic element and visual-role selectors.
- [x] T003 Add reciprocal four-tier computed-style coverage in
  `scripts/verify-component-behavior.ts` for H3-with-H6 and H6-with-H3 inside
  `.bf-prose`.

## Phase 2 — Implementation

- [x] T004 Remove the redundant prose-prefixed entries from
  `SEMANTIC_SELECTORS_BY_ROLE` in `src/css.ts` without changing prose-flow
  composition.
- [x] T005 Rebuild generated CSS and confirm every tier/preset adopts the same
  selector contract.

## Phase 3 — Validation and closeout

- [x] T006 Run focused `npm run test:build` and `npm run test:behavior` checks.
- [x] T007 Run `npm test` and `npm run qa:components`.
- [x] T008 Review the Typography Roles demo and reciprocal probes for visual,
  overflow, and console regressions.
- [x] T009 Record results in `review.md`, update workflow state, and leave
  `AGENT-INBOX.md` drained.

## Phase 4 — Adversarial-review remediation

- [x] T010 Investigate the inconsistent prose last-child cascade and add
  computed-style coverage (the initial removal was superseded by owner
  correction T014-T019).
- [x] T011 Replace fixed-delay tier verification with computed-value waits,
  concrete per-tier H3/H6 assertions, and distinct-signature coverage.
- [x] T012 Reconcile workflow-file changes with accepted Spec 001 SC-006 and
  preserve unresolved workflow-kit alignment as a separately scoped candidate.
- [x] T013 Rerun focused and full validation, perform four-tier rendered review,
  and record a fresh adversarial review.

## Phase 5 — Owner prose-boundary correction

- [x] T014 Restore the prose last-child margin reset with `:last-child` outside
  `:where()` and after role/prose rules.
- [x] T015 Cover plain/classed paragraphs and H3 roles plus final UL, OL, and
  blockquote boxes across all four tiers.
- [x] T016 Assert preserved metric padding, equal plain/classed occupied boxes,
  prose-bottom grid alignment, and following-first-baseline alignment.
- [x] T017 Derive tier role expectations from `config/tiers/*.json` and audit
  other override-intended `:where()` resets.
- [x] T018 Update always-on and durable architecture invariants, rebuild, and
  run focused/full/component/browser validation.
- [x] T019 Put a fresh adversarial-review request with exact scope and evidence
  in `AGENT-INBOX.md`.
