# Research: flush side-navigation composition

## Consumer evidence

Diagram Registry composes `.bf-side-navigation` inside
`.bf-panel-content`. The content slot adds panel padding while the navigation
heading and links also add `--bf-panel-padding-inline`, producing a double
inset. The active background lives on the link, so it is inset with the link.

## Vanilla ancestor comparison

Vanilla's side navigation is placed directly in the application navigation
region. Headings, links, and nested levels own their indentation; there is no
outer all-around content padding around the navigation. Consequently an active
link background and its left highlight reach the drawer edge.

## Decision

Add an explicit `.bf-panel-content.is-flush` modifier. This preserves the
panel's useful layout/scroll ownership and makes the exceptional padding choice
visible in markup.

## Alternatives rejected

- Removing default panel-content padding would regress ordinary panels.
- Using `:has(> .bf-side-navigation)` would create hidden descendant coupling
  and could flush unrelated siblings.
- Rendering the navigation outside panel content would discard the fill
  panel's established scroll and minimum-size contract.
- Patching Diagram Registry CSS would leave the defect in the source system.

## Typography investigation

The `.bf-h3`/`.bf-h6` precedence repair was complete on Spec 002 but Diagram
Registry consumed the separate application-fill branch based on the older BF
main. Spec 002 is now merged to BF main; Spec 003 integrates the remaining
application work on top of it.
