# Tasks: Tabs item no-shrink

- [x] T001 Rename the contribution branch to `feat/027-tabs-item-no-shrink`
  and rebase it onto local `main` (`b58ca08`).
- [x] T002 Reproduce the defect on main's behavior at 390px across four tiers
  and confirm the list container already scrolls.
- [x] T003 Keep the `flex: 0 0 auto` item rule with a one-line comment.
- [x] T004 Add the static contract in `scripts/validate-build.ts`.
- [x] T005 Add the minimal six-tab specimen to `demo/components/tabs.html`.
- [x] T006 Add the four-tier 390px rendered and keyboard check to
  `scripts/verify-component-behavior.ts`; confirm it fails on main's behavior.
- [x] T007 Run `npm run build`, `npm test` and `npm run qa:components`; review
  the narrow specimen in the browser.
- [x] T008 Record evidence in `review.md` and register the package in
  `docs/specs.md`.
