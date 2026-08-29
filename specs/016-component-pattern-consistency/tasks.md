# Tasks: Component and Pattern Consistency

**Input**: Design documents from `/specs/016-component-pattern-consistency/`

## Phase 1: Specification and evidence

- [x] T001 Promote Spec 016 on `feat/016-component-pattern-consistency` and record active status.
- [x] T002 Capture pre-fix browser measurements and the all-pattern semantic-sibling rhythm audit in `research.md`.
- [x] T003 Define measurable spacing, search, navigation, TOC, hero, and quote contracts in `contracts/composition.md` and `quickstart.md`.

## Phase 2: User Story 1 - Predictable dense component geometry

- [x] T004 [US1] Reserve icon slots for iconless application-navigation rows in `src/css-components/legacy-navigation.ts` and extend static/browser assertions.
- [x] T005 [US1] Fit search-box and search-and-filter actions to the real input block in `src/css-components/search-box-and-filter.ts` and test all tiers/narrow widths.
- [x] T006 [US1] Compose filter-panel headings with canonical `bf-h5` markup and remove duplicate type declarations.

## Phase 3: User Story 2 - Legible document navigation hierarchy

- [x] T007 [US2] Make TOC row rhythm flush and section headings canonical H5/default color in `src/css-components/document-navigation.ts` and `demo/components/table-of-contents.html`.
- [x] T008 [US2] Add four distinct tier-reference entries/routes and reorganize catalog ownership in `demo/page-catalog.js`, atlas pages, and shared tier-reference files.
- [x] T009 [US2] Update static and behavior contracts for TOC hierarchy, narrow/RTL geometry, tier references, and catalog classification.

## Phase 4: User Story 3 - Consistent pattern-owned rhythm

- [x] T010 [US3] Apply flush/dense/shallow stack composition to every confirmed pattern-audit finding in `demo/components/*.html`.
- [x] T011 [US3] Correct accordion and tab-section content boundaries without styling hidden panels or adding local specimen CSS.
- [x] T012 [US3] Add a static pattern-rhythm audit that rejects known multi-flow containers without an explicit stack owner.

## Phase 5: User Story 4 - Coherent hero and quote grids

- [x] T013 [US4] Recompose hero title/content/media slots and demos in `src/css-components/sites-editorial-ports.ts` and `demo/components/hero.html`.
- [x] T014 [US4] Align quote-wrapper tracks to one eight-column grid and add dense pattern areas in source/demo.
- [x] T015 [US4] Remove default prose-blockquote rule/indent/muted treatment from `src/css.ts` and update prose fixtures/contracts.
- [x] T016 [US4] Extend browser assertions for wide/narrow/RTL hero and quote keylines and plain blockquotes.

## Phase 6: Validation and review

- [x] T017 Regenerate outputs and run focused build/component/behavior tests.
- [x] T018 Review affected demos in the in-app browser across all tiers and constrained widths; resolve visible regressions.
- [x] T019 Run `npm test` and `npm run qa:components`.
- [x] T020 Perform adversarial source/API/accessibility review, resolve high/medium findings, and record evidence in `review.md`.
- [x] T021 Delete `image.png` and `image copy.png` after replacement states are verified.

## Phase 7: Second owner-review shell and state stability

- [x] T022 Reopen Spec 016 with demo-shell, standalone-link, page-gutter,
  navigation-sequence, compact-feedback, media-grid, divider, and sortable-state
  contracts.
- [x] T023 Make the shared page chrome own one body-wide baseline overlay,
  `bf-page` wrapper, category/alphabetic navigation order, and accessible
  Previous/Next controls.
- [x] T024 Add the canonical `bf-text-link` role, remove redundant atlas
  baseline controls, and audit standalone link contexts.
- [x] T025 Make `bf-page` consume `--bf-page-margin` directly and verify all
  shared-chrome demo wrappers at viewport gutter brackets.
- [x] T026 Add content-card footer rule clearance and reserve sortable-table
  indicator geometry before activation.
- [x] T027 Recompose media object onto the shared 2/6 eight-column grid, retain
  media sizes, and remove the RTL/end-media specimen contract.
- [x] T028 Compact notifications, align severity icons to the first line, and
  use a single strong-plus-regular text run for inline warnings.
- [x] T029 Sweep every catalogued route/source for equivalent bare-link,
  missing-gutter, divider-crowding, active-state-reflow, and pseudo-heading-pair
  defects; add regression assertions.
- [x] T030 Run focused four-tier browser validation at wide/constrained widths,
  then `npm test` and `npm run qa:components`.
- [x] T031 Perform a second adversarial API/accessibility/geometry review,
  resolve high/medium findings, and update `review.md`.

## Phase 8: Third owner-review typography and chrome discipline

- [x] T032 Reopen Spec 016 with basic-rule equivalence, breadcrumb chrome,
  bottom controls, body-sized UI, qualified link-state, and single-gutter
  contracts; capture pre-fix geometry and sibling consumer evidence.
- [x] T033 Apply the complete `bf-rule` contract to plain `hr`, make nested
  fixed-width regions defer to an owning `bf-page`, and add regression checks.
- [x] T034 Replace private page-chrome title sizes with public breadcrumbs,
  move theme/baseline/tier controls to a fixed bottom bar, and render accessible
  white chevron-only Previous/Next link-buttons flush right.
- [x] T035 Sweep public and demo CSS for unexplained sub-body non-heading UI and
  for component anchors whose interaction state leaks the generic underline;
  inspect Diagram Registry as read-only consumer evidence.
- [x] T036 Verify the typographic-specimen and representative example keylines,
  chrome wrapping, bottom-bar clearance, rule equivalence, and link states in
  the in-app browser across wide and constrained widths.
- [x] T037 Run focused tests, `npm test`, and `npm run qa:components`, then
  perform and record the third adversarial review with no unresolved high- or
  medium-severity findings.

## Dependencies

- T004-T006, T007-T009, T010-T012, and T013-T016 depend on T001-T003.
- T017-T021 depend on all user stories.

## Parallel opportunities

Tasks marked by separate user stories primarily touch different focused CSS
modules and demos, but this implementation remains single-agent to preserve the
owner's requested integrated hierarchy review.
