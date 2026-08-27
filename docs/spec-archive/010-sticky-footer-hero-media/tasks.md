# Tasks: Resilient Sticky Footer and Hero Media

**Input**: Design documents from `/specs/010-sticky-footer-hero-media/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/markup.md`, `quickstart.md`

**Tests**: Static generated-contract and real-browser geometry coverage are required by FR-012.

## Phase 1: Setup

**Purpose**: Establish the active Spec Kit package and confirm source ownership.

- [x] T001 Record the active feature path in `.specify/feature.json` and `.github/copilot-instructions.md`
- [x] T002 Capture layout ownership decisions in `specs/010-sticky-footer-hero-media/research.md` and the public markup contract in `specs/010-sticky-footer-hero-media/contracts/markup.md`

---

## Phase 2: Foundational contract tests

**Purpose**: Add consumer-shaped fixtures and failing assertions before source changes.

- [x] T003 [P] Add nested short/long application-hosted site-shell fixtures to `demo/components/sticky-footer.html`
- [x] T004 [P] Add a shallow-lead, final full-width media fixture to `demo/components/hero.html`
- [x] T005 Add static markup and generated-selector assertions for both contracts to `scripts/validate-build.ts`

**Checkpoint**: The new tests describe both public contracts and fail against the old source behavior.

---

## Phase 3: User Story 1 - Read every page without footer obstruction (Priority: P1) 🎯 MVP

**Goal**: Keep short footers at the application-main block-end and long footers after all content.

**Independent Test**: Render direct nested site shells whose site main also carries `bf-panel-content`; assert short and long geometry and the application-main scroll extent in every tier.

- [x] T006 [US1] Add four-tier narrow/wide nested-shell geometry and scroll assertions to `scripts/verify-component-behavior.ts`
- [x] T007 [US1] Correct site-main flex sizing and nested shell block sizing in `src/css-components/linked-logo-site-layout.ts`
- [x] T008 [US1] Build generated bundles and run the sticky-footer static/browser checks through `package.json` scripts

**Checkpoint**: User Story 1 passes independently with no consumer overrides.

---

## Phase 4: User Story 2 - Finish a hero with full-width media (Priority: P2)

**Goal**: Keep a shallow textual lead and final full-width media inside one hero, before its normal exit boundary.

**Independent Test**: Measure the lead-to-media and media-to-following-section boundaries against the active tier tokens while checking full-width, overflow, and existing hero geometry.

- [x] T009 [US2] Add four-tier narrow/wide closing-media geometry and token assertions to `scripts/verify-component-behavior.ts`
- [x] T010 [US2] Add the structural hero lead and direct full-width media contract to `src/css-components/sites-editorial-ports.ts`
- [x] T011 [US2] Build generated bundles and run the hero static/browser checks through `package.json` scripts

**Checkpoint**: User Story 2 passes independently and existing hero compositions remain unchanged.

---

## Phase 5: Polish and cross-cutting concerns

**Purpose**: Complete documentation, adversarial review, and repository gates.

- [x] T012 Run `npm test` and `npm run qa:components` and record results in `specs/010-sticky-footer-hero-media/review.md`
- [x] T013 Perform manual browser review at the routes and viewports in `specs/010-sticky-footer-hero-media/quickstart.md`
- [x] T014 Review generated selectors and demos against `AGENTS.md` and `.specify/memory/constitution.md`, then close all tasks in `specs/010-sticky-footer-hero-media/tasks.md`
- [x] T015 Update active package status in `docs/specs.md` and handover state in `AGENT-INBOX.md`

---

## Dependencies & Execution Order

- Setup precedes all implementation.
- T003 and T004 may be authored in parallel; T005 consumes both fixtures.
- User Story 1 and User Story 2 are independently testable after the foundational static contract exists.
- Full QA and closeout depend on both stories.

## Parallel Opportunities

- Sticky-footer demo work in `demo/components/sticky-footer.html` and hero demo work in `demo/components/hero.html` do not overlap.
- After foundational tests, footer source/behavior work and hero source/behavior work occupy distinct focused modules, but the central behavior test file must be edited sequentially.

## Implementation Strategy

1. Complete setup and make the contract assertions fail for the missing behaviors.
2. Deliver User Story 1 as the minimum viable correction and verify it independently.
3. Deliver User Story 2 without changing existing hero layouts.
4. Run full static, browser, baseline, and screenshot gates; record exact evidence.
