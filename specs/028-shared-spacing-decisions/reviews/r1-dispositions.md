# Mobile chrome correction dispositions

The October 9 external follow-up verdict requests changes for one medium R1
finding against N1. It accepts N2–N5 as written and retains the earlier accepted
spacing corrections. The original uncommitted review remains at
`../opus-028-followup-review.md`; all prior reports, requests and sealed evidence
remain unchanged. The current correction does not supply an external verdict.

## R1: hidden shared controls in the focus order

The initial N1 fix put the shared header/footer beneath the expanded
SideNavigation specimen. Their controls remained focusable while fully covered.
The correction removes the header/footer from rendering, pointer interaction
and keyboard focus with `visibility: hidden`, under the existing mobile
specimen-expanded condition. Their boxes remain in layout. The catalog remains
hidden with its existing `display: none` rule. Closing the specimen restores
the shared controls; the unconditional mobile z-index 100 override is removed.

The regression check must traverse a complete forward Tab cycle from the
specimen close control, exclude all shared chrome while expanded, and verify
actual keyboard reachability and hit-testing after Escape. Initial and reopened
drawers, independent catalog state, both bundles and responsive widths remain
part of the review target.

## Pre-existing limitations outside the correction

- ApplicationLayout uses `.bf-navigation`, not the SideNavigation specimen's
  expanded class. Its open navigation drawer at 390px can still have branding,
  Pin and Close controls covered by shared chrome. This correction deliberately
  does not widen the selector. Its visibility claim applies to the real
  SideNavigation demo, not every drawer page. ApplicationLayout needs a separate
  shared-chrome repair and review before its mobile visual approval.
- The product SideNavigation drawer is non-modal. Background specimen/content
  focus stops can remain obscured by its overlay. The external review identifies
  this as pre-existing in both bundles. Removing shared chrome from focus does
  not claim a focus trap, full drawer accessibility conformance, or a fix to
  those product stops. Record that requirement before implementing the
  corresponding behavior directly in Pragma.
- The markup-initial expanded drawer has no recorded opening trigger. Escape
  closes it but does not promise automatic trigger focus return. The initial
  recovery check explicitly focuses the now-available specimen trigger before
  verifying the complete Tab cycle through shared controls. A keyboard-reopened
  drawer does record its trigger, and Escape must restore focus to it. This
  existing runtime behavior is unchanged by the chrome correction.
- DrawerPanel uses `.bf-application.is-drawer-expanded`, also outside the
  selector. At 390px in both bundles, the independently inspected product
  Close, text/select and Apply controls remain hit-testable, while the shared
  Pages/header/footer stay above the expanded drawer and overlay. No viewport
  ownership or universal drawer coverage is claimed for that page. The
  independent report records those observations separately from R1.

## Accepted N2–N5 dispositions

The external acceptance approves these dispositions; it does not grant the
separate governing exception described by N2.

- N2 remains an owner decision: bare native fields and raw native table cells
  use an all-sided forced-colors outline where the governing one-sided fallback
  rule calls for a one-sided boundary. Explicit owner acceptance through the
  ruling process or a directed construction change remains required.
- N3 release wording: **inputs with no `type` attribute** now receive the full
  BF field treatment, including zero layout border and paint-only boundary.
  Inputs with `type=""` or an invalid type such as `type="foo"` are text inputs
  in HTML but do not match the added `input:not([type])` selector. They retain
  browser defaults unless another existing BF selector applies. No coverage of
  all text-like input attribute values is claimed.
- N4 retains its deferred migration to stable artifact codes plus separate
  prose, with migration and negative controls when the schema next changes.
- N5 retains its forced-colors leaf containing-block caveat; verify positioned
  descendants in both modes before extending the construction.

Owner visual approval, governing-main activation and a resulting full-main-SHA
repin, the separate Spec 024 T011g popup review, and a green dependency audit
remain open. Full Firefox/Safari interaction, native Windows contrast/display
scaling and fractional long-stack drift remain disclosed limits. No Pragma
source change, main merge, token publication or release is part of R1.
