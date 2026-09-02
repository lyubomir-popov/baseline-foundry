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

**Check one through five characters.** Badges with fitting content should be
circles; wider badges become stadiums. Chips use the Action inset and are
stadiums even at one character in every tier. Regular chips subtract their real
border from the inset; nested chips keep the full inset because their border is
inset paint. Use a badge for an exact circular counter. A fixed-size or
overflow-cap regression shows up at the longer fixtures, not at one.

**Check the block axis has not moved.** Overlay the before capture of any row
containing a chip or badge. Any change in row height is a defect — this package
must be inline-only.

**Check every changed interactive target before accepting the square.** Cover
icon buttons, interactive chips, and numbered pagination against the recorded
per-tier values, actual rounded shape, and adjacent targets. For icon-only
buttons, inspect the transparent `::after`: it must be at least 24-by-24 CSS
pixels and directly hittable without changing the painted or occupied box.
Probe cardinal edges and corners in LTR and RTL. Put adjacent link-style icon
buttons in ordinary `.bf-actions` and `.bf-cluster` groups: target-owned inline
margins must prevent overlap without changing either container's gap. Force
those rows to wrap after adding `is-icon-target-wrap`; the 1px interior hit
sweep must find no cross-row wrong-action region in LTR or RTL. For a clipping
container, use `is-icon-target-scrollport` instead and test both logical scroll
extremes. Supporting engines reserve zero in Editorial and one full baseline in
Documentation, App, and OS; the fallback is one baseline everywhere, and no
edge may clip.

**Check custom rounding.** With a 1.4375rem body line and 0.25rem baseline, the
wrap and scrollport allowances resolve to 4px. With a 0.5rem body line they
resolve to 8px, proving the formula rounds the exact shortfall rather than
capping at one baseline.

**Exercise fractional rasterisation.** The behavior gate launches one Chromium
sweep with a forced 1.5 device scale. It covers both default-alias members:
Action-framed chips and icon-only buttons. An authored 1px border should resolve to
about 0.666667 CSS px and use more than 0.51px, but no more than 1.05px, of the
reviewed shape tolerance.

## Tier sweep

Repeat in Editorial, Documentation, App and OS, in light and dark. The painted
block differs per tier, so the correct circle diameter differs per tier. A
single hardcoded diameter passing in one tier and failing in another is the
signature of an authored size creeping back in.

## Iteration gates

Run the smallest relevant check while iterating. Before closeout run `npm test`
and `npm run qa:components` with fresh captures, and obtain both owner and
stakeholder visual acceptance, since the report originated outside the team.
