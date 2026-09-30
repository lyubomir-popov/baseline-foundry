# Spec 027: Tabs item no-shrink

**Feature branch**: `feat/027-tabs-item-no-shrink`

**Created**: 2026-09-30

**Status**: Active – implemented and verified; merge into `main` authorized

**Input**: Diagram Registry contribution `7c57710` (rebased as `7a601b6`):
long `bf-tabs` lists overlap at narrow widths instead of scrolling.

## Owner authorization

The owner directed merging this fix into `main` on 2026-09-30 once this spec
and its review are complete. No publication or release is implied.

## Problem

`bf-tabs-list` is a nowrap flex row with `overflow-x: auto`, but each
`bf-tabs-item` keeps the flex default `0 1 auto` with `min-inline-size: 0`.
When the tabs exceed the available inline size, items shrink below their
labels instead of letting the list scroll. Button tabs overflow their items and
paint over their neighbours; link tabs clip their own labels. Diagram Registry
hit this at 390px with four tabs.

## User scenario (P1)

A reader on a narrow viewport opens a page with more tabs than fit on one row.

1. **Given** a `bf-tabs` list wider than its container, **when** it renders,
   **then** every tab keeps its content width, no two tabs overlap, no label
   is clipped, and the list scrolls inside its own box.
2. **Given** the same list, **when** the reader presses End or Home on a
   focused tab, **then** that tab is selected, focused and scrolled into view,
   and its thick active bar still meets the list boundary.
3. **Given** tabs that already fit, **when** they render, **then** their widths
   are unchanged.

## Requirements

- **FR-001**: Default `bf-tabs-item` does not shrink below its content width.
- **FR-002**: The list, not the page or parent, absorbs the overflow.
- **FR-003**: Editorial, Documentation, App and OS behave equivalently.
- **FR-004**: The `is-equal` grid variant, keyboard behavior, focus ring and
  active thick bar are unchanged.

## Success criteria

- **SC-001**: At 390px with six tabs, overlap is 0 and clipped items/labels are
  0 in all four tiers; the list's scroll width exceeds its client width.
- **SC-002**: At 1440px, item widths equal main's to 0.1px in all four tiers.
- **SC-003**: A static contract and a four-tier rendered check fail on main's
  behavior and pass with the fix.
- **SC-004**: `npm test` and `npm run qa:components` pass.

## Boundaries

- No change to tab typography, insets, `is-equal`, or the scrolling model
  itself (visible scrollbar styling, scroll affordances or overflow menus).
- No Pragma or downstream change; no release.
