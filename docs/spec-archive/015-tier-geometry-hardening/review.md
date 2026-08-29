# Review: Tier Geometry Hardening

**Date**: 2026-08-28
**Status**: Ready for owner visual review
**Implementation commit**: `5cf6197`

## Delivered geometry

- Tier content caps now form the documented non-increasing sequence
  `90rem / 80rem / 60rem / 60rem`. Documentation has enough room for its
  navigation/article/TOC composition, App fixed rows use the requested 960px
  bound, and OS equals App because no independent evidence supports inventing a
  narrower OS cap.
- Direct App CSS now emits the same fluid `.bf-page` root rule as shared
  class-scoped delivery. Browser checks prove both delivery paths resolve to
  equivalent fixed-width caps at 1800px while the App page and grid remain
  wider than the explicit fixed-width row.
- TOC and confirmed desktop/expanded in-page navigation links retain only the
  measured body start/end nudges. Their owning list/item grids supply the row
  rhythm. Narrow wrapping, focus, overflow, nesting, and RTL assertions cover
  all four tiers.
- Divided lists retain a fixed 24px parent gap and zero item margin/padding.
  The 1px pseudo-rule begins 8px before the following item, leaving the
  specified 7px visual clear distance after the rule.

## Adjacent-defect scan

The exact hidden semantic block-padding formula was also present on default and
expanded in-page-navigation links; those confirmed cases are corrected. The
compact horizontal rail remains control-like and therefore keeps control
padding. The expanded heading remains a surface inset rather than repeated
link-owned rhythm. No other exact navigation/list instance was confirmed in
the scoped source scan.

## Validation evidence

All automated gates passed from the feature worktree on 2026-08-28:

- `npm run build`
- `npm run test:build`: 5,825 checks, 0 failures
- `npm run check:types`
- `npm run test:behavior`
- `npm run test:components`: all declared pages and tiers, 0 failures
- `npm test`: full build/static/component/behavior sequence, 0 failures
- `npm run qa:components`: screenshots captured and all executable component
  checks across declared tiers passed with 0 failures; the screenshot-only
  engine illustration was skipped by design and its structural assertions ran
  under `test:build`

## Independent adversarial review

- The root agent reviewed the complete `main...feat/015-tier-geometry-hardening`
  source, config, documentation, and test diff after the subagent handoff.
- The review confirmed the requested ownership model and found no unresolved
  high- or medium-severity product defect.
- Three low-level hardening findings were fixed: `gridCss([])` no longer emits
  an empty selector when no App surface is supplied; expanded in-page failures
  now report their own measured gaps; and the wide direct/scoped parity fixture
  explicitly exercises `bf-fixed-width is-start-aligned`.
- The post-fix build, 5,825 static assertions, type check, behavior suite, and
  diff whitespace check are green.

## Outstanding owner review

- T015 remains open for owner inspection of the layout, TOC, in-page navigation,
  and divided-section demo routes listed in `quickstart.md`.
- No merge, release, tag, or package publication was performed. A generic
  split-pane primitive remains deferred until an independent second consumer
  establishes a reusable contract.

## Risks and handoff notes

- The public Documentation, App, and OS fixed-width caps intentionally narrow;
  downstream consumers receive the change only after adopting a build or
  package containing this branch.
- The worktree used Node `22.21.1` with npm `10.9.4`. npm warned that the repo
  declares npm `>=11.19`, but every required validation command completed
  successfully and no lockfile change was retained.
- Automated screenshot capture is not owner visual acceptance. The affected
  states still require the explicit browser handoff before merge or release.
