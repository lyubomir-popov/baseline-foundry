# Spec 018: Nested density audit

**Feature Branch**: `feat/018-nested-density-audit`
**Date**: 2026-08-31
**Status**: Accepted

## Problem

Body-sized auxiliary surfaces such as chips, status labels, and badges can be
nested inside another body-sized row. Reusing their standalone occupied-block
contract inside side navigation or tabs places a complete control box inside a
second complete row and gratuitously increases the host height.

The demo navigation also needs to exercise the existing optional tagged-brand
composition at the top of its real shared side rail, not only in an isolated
spacing fixture.

## Outcomes

- Shared demo chrome and the side-navigation component route show the optional
  orange tagged Circle of Friends brand with the Baseline Foundry wordmark.
- Nested auxiliary surfaces opt in explicitly through `is-nested`; component
  CSS does not infer density from ancestors or introduce context selectors.
- A nested chip, status label, or badge fits inside the host body line without
  increasing a plain side-navigation or tab row's occupied height.
- Nested and host text retain the same visual baseline in Editorial,
  Documentation, App, and OS, in light and dark.
- The nested contract uses rem/token-derived geometry, symmetric padding, and
  no transforms, negative margins, target block sizes, or collapsing margins.
- The vertical spacing audit visibly covers every supported auxiliary nesting
  in its real table, navigation, tab, or chip host and maintains an exhaustive
  disposition ledger for the complete component catalog.
- The old "independent contracts" bucket is retired: unboxed roles remain
  metric text, while table cells and other single-line hosts resolve through
  the shared occupied-block contract.
- Grouped side navigation keeps its compensated rule and heading in one tight
  header, then uses a fixed 0.5rem group-owned transition to the list. The rule
  begins at the continuation text rail and reaches the navigation end edge.

## Boundaries

- `is-nested` is a composition-fit exception, not a general density scale.
- Interactive bordered buttons do not become undersized nested targets. Table
  actions continue to use the existing inline/link-button contract unless a
  later accessibility audit proves another reusable target model.
- Tier density remains the default. Standalone chips, status labels, badges,
  buttons, and controls keep their existing occupied-block contract.
- The tagged brand remains optional markup composed from the panel and
  canonical tagged-logo primitives; side navigation does not gain a mandatory
  logo slot or a duplicate brand component.

## Acceptance

1. The shared demo rail keeps its tagged brand visible while the catalog rail
   is scrolled, and its tag start equals the root navigation text rail.
2. Both side-navigation specimens use the shared brand asset rather than
   duplicated inline SVG paths.
3. A nested chip/status/badge line box removes up to one active baseline of
   leading without becoming shorter than `1em`, while its complete paint fits
   inside and does not enlarge the host row.
4. Browser geometry and baseline assertions cover all four tiers and both
   tones; consoles remain clean.
5. `npm test` and `npm run qa:components` pass before closeout.
6. The vertical audit includes direct fixtures for all distinct single-line
   primitives and nested fixtures for chip/status/badge/table-action host
   combinations; representative and content-driven omissions are recorded in
   the package coverage contract rather than silently disappearing.
7. Each grouped side-navigation header contains its optional real rule and
   heading without an internal gap; the group owns a 0.5rem header-to-list gap,
   and rule thickness plus compensation remains exactly 0.5rem in every tier.
