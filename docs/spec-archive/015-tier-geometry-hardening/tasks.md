# Tasks: Tier Geometry Hardening

**Input**: Design documents from `/specs/015-tier-geometry-hardening/`

## Phase 1: Specification and evidence

- [x] T001 Promote Spec 015 and record its branch/status in `docs/specs.md`.
- [x] T002 [P] Derive the tier cap progression and downstream selector evidence in `specs/015-tier-geometry-hardening/research.md`.
- [x] T003 [P] Define measurable contracts in `specs/015-tier-geometry-hardening/contracts/geometry.md` and QA routes in `quickstart.md`.

## Phase 2: User Story 1 — Predictable tier widths

- [x] T004 [US1] Set derived caps in `config/tiers/*.json` and document the coupled tier/density model in `README.md` and `docs/architecture.md`.
- [x] T005 [US1] Add explicit monotonic/direct/scoped token assertions in `scripts/validate-build.ts`.
- [x] T006 [US1] Extend `scripts/verify-component-behavior.ts` to compare wide direct/scoped fixed rows and prove the App page remains fluid.

## Phase 3: User Story 2 — Metric-only document navigation

- [x] T007 [US2] Move TOC link rhythm to list/item gaps in `src/css-components/document-navigation.ts`.
- [x] T008 [US2] Correct the confirmed in-page-navigation desktop/expanded link defect while preserving compact control padding.
- [x] T009 [US2] Add static and browser padding/gap/focus/wrap/RTL assertions in `scripts/validation/renewal-component-contracts.ts` and `scripts/behavior/ported-component-contracts.ts`.

## Phase 4: User Story 3 — Following-item dividers

- [x] T010 [US3] Reposition the divided-list pseudo-rule in `src/css-components/static-content-ports.ts` without changing item boxes or the 24px gap.
- [x] T011 [US3] Replace the centred-divider static/browser assertions with the final-half-rem geometry contract.

## Phase 5: Validation and review

- [x] T012 Regenerate source outputs with `npm run build` and run focused static, behavior, and component tests.
- [x] T013 Run `npm test` and `npm run qa:components`.
- [x] T014 Perform an adversarial source/API review and record findings in `review.md`.
- [ ] T015 Open affected demo routes for owner verification; do not merge, release, tag, or publish.

## Dependencies

- T004–T006 implement US1 independently after T001–T003.
- T007–T009 implement US2 independently after T001–T003.
- T010–T011 implement US3 independently after T001–T003.
- T012–T015 depend on all three user stories.

## Boundary

No generic split-pane implementation belongs in this package. Reconsider only
after an independent second consumer demonstrates the same reusable contract.
