# Research

## Repeated consumer evidence

- Design Foundry measured a product-local grid at 298 by 298 px because its
  tracks stretched; its target is the compact shared geometry.
- Diagram Generator already demonstrates the intended approximately 57–58 px
  occupied control with nine 16 px targets, 2 px gaps/padding, and 6 px dots.

The common surface is geometry, selection semantics, and keyboard navigation.
The selected value and its effect on authored content are not shared state.

## Decisions

- Use native `<button type="button">` choices in a named `role="group"`.
- Use `aria-pressed`, not a radio contract, because consumers already model
  these positions as toolbar-like commands and no form value is submitted.
- Use one selected button as the roving tab stop.
- Arrow navigation selects on focus movement, matching BF tabs and avoiding a
  second confirmation step in a nine-choice authoring control.
- Wrap at boundaries; vertical movement advances three items and horizontal
  movement follows computed inline direction.
- Keep the contract to nine enabled targets. Filtering disabled targets would
  make flat `+/-3` navigation lose its visual column, while sparse-grid
  semantics are not part of either consumer need.

## Spacing architecture disposition

`docs/component-spacing-architecture.md` normally forbids an authored target
height and requires an architecture decision for an exception. Direct user
authorization for Spec 025 makes this fixed spatial control that exception:
each target owns both a 1rem inline size and a 1rem block size because the 3 by
3 position itself is the content, not a compact variant of a text-bearing BF
interface row. The exception is component-local, adds no density scale or
tier-owned leaf override, and must not be reused to set target heights on BF
buttons, fields, navigation, or other interface-row controls.

## Downstream responsive runtime seam

Design Foundry cannot use BF's historical 48rem application-shell boundary:
its navigation remains a drawer until a 32rem Stage can coexist with the left
rail, currently represented by `(min-width: 75rem)`. CSS class changes alone
are insufficient because the BF runtime also owns `aria-hidden`, overlay,
Escape, and focus behavior. A paired `is-wide-workspace-breakpoint` CSS
modifier and `largeBreakpoint` initializer option therefore keep 48rem as the
backward-compatible default while exposing one BF-owned 75rem contract for
wide authoring workspaces.

A viewport breakpoint alone cannot represent every application allocation: a
wide viewport can still leave too little main workspace after persistent rails
are restored. The generic `is-navigation-drawer-forced` application modifier
therefore suppresses either persistent CSS contract at any viewport. The
application-layout runtime treats the modifier as drawer mode and observes
class changes so ARIA, drawer focus, and Escape semantics change with the CSS
without reinitialization. Consumers retain ownership of the pressure policy;
BF owns only the resulting shell state.

A drawer toggle can be rendered inside a transient contextual menu. Returning
focus to that menu item after the menu closes leaves focus hidden or lost, even
though BF correctly owns drawer dismissal. The generic
`data-bf-focus-return="id"` IDREF lets either application-layout or panel-drawer
runtime record a persistent control instead. Resolution happens inside the
configured root when the drawer opens, preventing cross-root capture and
preserving the trigger as the backward-compatible fallback for absent or
unresolved values. Escape, explicit Close, and overlay dismissal continue to
flow exclusively through BF's existing close paths.

The right application aside also loads as a drawer below that boundary. Resize
listeners must be discovered from the stable public handle rather than the
transient `is-pinned` class; actual pointer and keyboard input remains gated by
`isPinnedResizableAside`. This preserves one initialization across narrow to
wide transitions without making drawer asides resizable.

## Collapsed pinned-aside precedence

The application grid already includes only pinned asides that are not
collapsed, but a later `.bf-aside.is-pinned { display: block }` rule could
revive an element hidden by `.is-collapsed`. That rendered element then created
an implicit aside track outside the declared grid, and under fixed-height rail
pressure could reduce the main track to zero. Pinned presentation therefore
applies only to `.is-pinned:not(.is-collapsed)`. This preserves every visible
pinned-aside contract while making collapsed state authoritative for layout and
pointer hit testing.
