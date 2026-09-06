# Side-navigation accordion geometry adversarial review

Reviewed 2026-09-06 on `fix/side-navigation-accordion-geometry`.

## Verdict

The fixed-track defect, disclosure-chevron offset, and pinned-aside double seam
have one reusable BF fix each. The reviewed implementation is suitable for
merge after the full repository and component QA gates pass.

## Findings and corrections

- Every `.bf-side-navigation-list` used a fixed implicit row size. A root item
  containing an expanded nested list therefore remained one row tall while the
  child list painted over following siblings. `minmax(<interface row>, auto)`
  preserves the single-line minimum and lets expanded or wrapped content grow
  its owner.
- An initial proposal to force every navigation label onto one line was
  rejected. BF intentionally supports wrapped icon-navigation labels. Consumers
  may choose ellipsis locally, but the shared component must reserve the wrapped
  height.
- Disclosure chevrons incorrectly inherited the 0.1875rem leading-icon optical
  offset. Real Ubuntu Sans measurements put their ink centre 2.5px below the
  adjacent lowercase text in every tier. Disclosure controls now use a zero
  offset; `.bf-side-navigation-icon` retains the intentional leading-icon
  offset.
- A pinned aside painted both its one-pixel boundary and a two-pixel resize rail
  over the middle of that boundary. The resize rail is now transparent while
  idle and appears only on hover, keyboard focus, or active resizing.

## Adversarial coverage

Browser coverage exercises the existing expanded-list/following-sibling demo
across all four tiers, LTR and RTL, and 16px/32px root font sizes. It verifies
parent containment, ordered siblings, wrapped-label containment, collapse and
reopen behavior, and zero block-axis translation on disclosure chevrons. The
pinned-aside test verifies a single idle seam, the preserved 24px pointer target,
the active two-pixel rail, keyboard behavior, drag persistence, and reset.

The minmax sizing change is direction-safe. Existing physical-direction
disclosure rules (`text-align: left`, `right: 0`, and fixed rotation direction)
remain outside this bugfix and are not claimed as a complete RTL semantics
audit.
