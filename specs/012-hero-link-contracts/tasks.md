# Tasks: Hero divider and quiet linked titles

**Input**: Design documents from `/specs/012-hero-link-contracts/`

## Phase 1: Setup and evidence

- [x] T001 Confirm current linked-title and hero contracts in `src/css-components/sites-foundation.ts` and `src/css-components/sites-editorial-ports.ts`
- [x] T002 Record Vanilla ancestry and BF ownership in `specs/012-hero-link-contracts/research.md`

## Phase 2: User Story 1 - Recognise linked section titles

- [x] T003 [US1] Change resting and visited title-link colour in `src/css-components/sites-foundation.ts`
- [x] T004 [US1] Extend static and browser assertions in `scripts/validate-build.ts` and `scripts/verify-component-behavior.ts`

## Phase 3: User Story 2 - Start a hero with a divider

- [x] T005 [US2] Add the default divider and `is-borderless` modifier in `src/css-components/sites-editorial-ports.ts`
- [x] T006 [US2] Add default and opt-out specimens in `demo/components/hero.html`
- [x] T007 [US2] Extend hero static and browser geometry checks in `scripts/validate-build.ts` and `scripts/verify-component-behavior.ts`

## Phase 4: Closeout

- [x] T008 Run focused component checks, `npm test`, and `npm run qa:components`
- [x] T009 Record browser and automated evidence in `specs/012-hero-link-contracts/review.md`
- [ ] T010 Update `docs/specs.md` and `AGENT-INBOX.md`, then archive the released package
