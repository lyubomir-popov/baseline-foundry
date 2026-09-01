# Quickstart: Block-derived inline geometry

## Routes

- `demo/components/chip.html` and the chip specimen in
  `demo/spec/spacing-vertical.html` — one-through-five-character chips,
  standalone, borderless, and table-hosted nested.
- Badge specimens wherever a chip hosts one, including the nested
  chip-with-badge case that Spec 018 introduced.
- `demo/components/button.html` — regular, link-style, and real page-chrome
  icon-only buttons. Bordered nested icon-only buttons are an explicit
  non-member because their icon canvas cannot fit the OS host line.
- `demo/components/notification.html` — the specialized borderless dismiss
  action and the copy clearance reserved for its square paint.
- `demo/components/pagination.html` — bare numbered slots plus labelled
  previous and next controls, which must retain Action geometry.
- `demo/components/article-pagination.html` — collapsed state recorded as a
  non-member audit case.
- `demo/spec/spacing-vertical.html` — nested chips and badges inside compact
  hosts, including the table-hosted chip/badge specimen.

## What to look for

**Measure, do not eyeball.** A near-circle and a circle are hard to tell apart
at 1rem. Use the browser assertions or devtools box measurements. The
acceptance criterion is equal painted extents within one rasterised border.

**Check nested and standalone side by side.** The nested defect is larger, but
browser measurement also found that the standalone badge's losing
`content-box` declaration left it slightly elliptical. Both states must be
measured.

**Check two through five characters.** One character should be a circle; wider
content should become a stadium with the same height. A fixed-size or overflow
cap regression shows up at the longer fixtures, not at one.

**Check the block axis has not moved.** Overlay the before capture of any row
containing a chip or badge. Any change in row height is a defect — this package
must be inline-only.

**Check every changed interactive target before accepting the square.** Cover
icon buttons, interactive chips, and numbered pagination against the recorded
per-tier values, actual rounded shape, and adjacent targets.

## Tier sweep

Repeat in Editorial, Documentation, App and OS, in light and dark. The painted
block differs per tier, so the correct circle diameter differs per tier. A
single hardcoded diameter passing in one tier and failing in another is the
signature of an authored size creeping back in.

## Iteration gates

Run the smallest relevant check while iterating. Before closeout run `npm test`
and `npm run qa:components` with fresh captures, and obtain both owner and
stakeholder visual acceptance, since the report originated outside the team.
