# Feature Specification: Site shell primitives

**Feature Branch**: `feat/011-site-shell-primitives`

**Created**: 2026-08-27

**Status**: Accepted for release

## Problem

A BF application-hosted editorial site currently needs consumer CSS to left
align capped rows, pin a main-panel footer opposite a navigation-panel footer,
present quiet linked section titles, keep wide tables reachable, and give
light artwork a stable inset in dark mode. Those are reusable composition
contracts, not Diagram Registry product styling.

## User stories

1. A site shell author can keep panel footer actions visible while the panel
   content scrolls, using the same footer primitive in navigation and main
   panels so their chrome aligns.
2. A capped row nested in a fluid application panel can opt into start
   alignment without a consumer selector.
3. A linked basic-section title is quiet by default, visibly interactive on
   hover/focus, and retains the heading's type role.
4. Wide tables and light-inset figures use public BF primitives rather than
   one-off consumer wrappers.

## Acceptance

- `.bf-panel-footer.is-sticky` remains visible at the panel block end while
  its sibling `.bf-panel-content` scrolls and exposes a matching occupied
  height in navigation and main panels.
- `.bf-fixed-width.is-start-aligned` resolves to logical start alignment in
  LTR and RTL without changing its width cap or padding contract.
- `.bf-basic-section-title-link` has no default underline, inherits heading
  typography and colour, and restores a clear hover underline plus BF focus.
- `.bf-table-scroll` owns horizontal overflow and a configurable table floor.
- `.bf-figure.is-light-inset` supplies a white `var(--bf-space-2)` inset to
  direct visual media in light and dark themes.
- Existing BF contracts and all four tiers remain green.

## Out of scope

- Diagram Registry navigation data, route ordering, gallery presentation and
  Mermaid workspace geometry remain consumer-owned.
