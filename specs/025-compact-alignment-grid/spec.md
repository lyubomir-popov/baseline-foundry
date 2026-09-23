# Spec 025: Compact alignment grid

**Branch:** `feat/025-compact-alignment-grid`
**Status:** Implementation
**Authorized:** Direct user authorization on 2026-09-23 promotes this package
independently of deferred token and Pragma work.

## Problem

Design Foundry and Diagram Generator both need the same compact nine-position
alignment control. Product-local versions have drifted in size and keyboard
behavior, while Baseline Foundry has no public owner for the repeated pattern.

## User outcomes

- An author can choose any of nine positions from one compact control.
- Pointer, Tab, Arrow, Home, and End interaction expose one selected position
  and one tab stop.
- Horizontal Arrow behavior follows inline direction in RTL.
- The control keeps the same intrinsic geometry in every built-in tier and
  never expands to fill a panel.

## Acceptance

- Public `bf-alignment-grid` / `bf-alignment-grid-button` CSS renders a 3 by 3
  matrix of fixed 1rem targets with 0.125rem gaps/padding and 0.375rem dots.
- The outer occupied size is 58 CSS px at a 16px root, including the BF border.
- Public `initAlignmentGrids` owns `aria-pressed` and roving `tabindex` state.
- Exactly one of the nine choices is selected after initialization and after every
  pointer or navigation action.
- Arrow Up/Down retain columns; Arrow Left/Right follow LTR/RTL; Home/End reach
  the first/final choice.
- All four built-in tiers use BF background, border, active, focus, and text
  tokens, with static, browser-behavior, baseline, and screenshot coverage.
- `initApplicationLayouts` accepts an optional `largeBreakpoint` media query,
  defaulting to the current `(min-width: 48rem)`, so consumers can align BF's
  aria, overlay, Escape, and focus behavior with their owned shell boundary.
- `.bf-application.is-wide-workspace-breakpoint` preserves drawer geometry and
  overlay behavior below 75rem, then applies the same persistent-navigation
  contract at 75rem; unmodified applications remain persistent from 48rem.
- `.bf-application.is-navigation-drawer-forced` keeps drawer geometry and
  synchronized runtime accessibility behavior at any viewport, overriding
  either persistent boundary until the modifier is removed.
- `initResizableAsides` binds an application aside that owns the public resize
  handle even when it initializes in drawer mode, then enables input only when
  that same aside becomes pinned.

## Boundaries

- Position values and resulting product layout remain consumer-owned.
- No consumer chroma, document state, or framework binding enters BF.
- Generated `dist/` output is never committed.
- Disabled or dynamically sparse matrices are outside this compact fixed-grid
  contract; consumers hide or disable the complete control instead.
- Design Foundry will pair the wide-workspace modifier with
  `{ largeBreakpoint: "(min-width: 75rem)" }`; BF does not own that product's
  32rem Stage-fit calculation.
- Consumers own the allocated-space decision that toggles the generic forced
  drawer modifier; BF owns its presentation and interaction semantics.
