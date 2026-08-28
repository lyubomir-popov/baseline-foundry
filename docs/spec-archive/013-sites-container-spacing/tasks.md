# Tasks: Sites Container-Owned Spacing

**Input**: Archived design documents from
`/docs/spec-archive/013-sites-container-spacing/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/spacing.md`, `quickstart.md`

**Tests**: Static generated-contract, real-browser geometry, baseline, screenshot, and downstream consumer coverage are required by FR-010–FR-013.

## Phase 1: Specification and governance

- [x] T001 Scaffold the package on the historical `feat/012-sites-container-spacing` branch. It was renumbered to Spec 013 after archive to resolve an identifier collision.
- [x] T002 Record the compensation, stack, token, boundary, and downstream decisions in the Spec Kit package.
- [x] T003 Amend `.specify/memory/constitution.md`, `AGENTS.md`, `docs/architecture.md`, `docs/spacing-ownership-peer-review.md`, `docs/agent-index.md`, `docs/specs.md`, `TODO.md`, and `AGENT-INBOX.md`.

---

## Phase 2: Foundational failing contracts

- [x] T004 Add static assertions for metric-only role compensation, unused semantic space-after, default/shallow/section stack gaps, and direct/class tier equality in `scripts/validate-build.ts`.
- [x] T005 Add representative nested stack and compensation geometry probes to `scripts/verify-component-behavior.ts`.
- [x] T006 Update `demo/components/tiered-list.html`, `demo/components/basic-section.html`, and `demo/components/hero.html` with the public nested-stack contract.

**Checkpoint**: The new tests fail against the old element-owned generated CSS.

---

## Phase 3: User Story 1 - Pattern internal rhythm (Priority: P1) 🎯 MVP

- [x] T007 [US1] Change generated typography in `src/css.ts` from semantic space-after to top-nudge/bottom-margin compensation.
- [x] T008 [US1] Restore the default `bf-stack` token-driven gap and preserve `is-flush` in `src/css.ts`.
- [x] T009 [US1] Update list, prose, and focused Sites pattern rules so internal stacks own separation without duplicate margins.
- [x] T010 [US1] Build and run the focused static/browser checks.

---

## Phase 4: User Story 2 - Pattern/section separation (Priority: P2)

- [x] T011 [US2] Add the public `bf-stack is-section` modifier using `--bf-section-space`.
- [x] T012 [US2] Prove nested shallow and section stacks remain independent in BF demos and browser assertions.

---

## Phase 5: User Story 3 - Downstream baseline proof (Priority: P3)

- [x] T013 [US3] Create an isolated Diagram Registry feature worktree and vendor the generated BF feature CSS without touching its dirty main checkout.
- [x] T014 [US3] Migrate the representative Registry Sites composition to nested internal/section stacks with no local BF override.
- [x] T015 [US3] Run Registry validation and browser geometry at 360px and 1280px; record evidence in `review.md`.

---

## Phase 6: Closeout

- [x] T016 Run `npm test` and `npm run qa:components`; record the legacy catalogue failures separately from the green focused contract in `review.md`.
- [x] T017 Perform in-app browser review of the BF and Registry routes, including constrained width, console, overflow, and RTL where directional.
- [x] T018 Complete adversarial source/API review and record generated/direct/class/downstream evidence in `review.md`.
- [x] T019 Update task/status owners and hand off the worktree and preview URLs.

## Dependencies & Execution Order

- Governance and failing contracts precede production source changes.
- The metric compensation change and stack API must land together to avoid a gapless intermediate surface.
- Downstream vendoring follows a successful BF build.
- Full QA and browser closeout follow BF and Registry implementation.
