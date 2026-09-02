# Research: Block-derived inline geometry

## Observation: the standalone badge intended to be a circle

`src/css-components/chip-badge-status.ts` sizes the badge as:

```css
box-sizing: content-box;
min-width: calc(<body line> - (var(--bf-ui-badge-padding-inline) * 2));
padding-block: 0;
padding-inline: var(--bf-ui-badge-padding-inline);
border-radius: 1rem;
```

with `--bf-ui-badge-padding-inline: calc(<body line> * 0.25)`.

That arithmetic intends the total inline extent to be
`(line − 2p) + 2p = line`. Browser measurement found that the global
component contract's later `box-sizing: border-box` declaration wins the
cascade, however, so the authored `content-box` declaration does not describe
the shipped box. The standalone one-digit badge is slightly wider than its
body-line block in all four tiers. The intent was correct; the implementation
was neither self-contained nor exact.

## Observation: the nested badge switches ledgers on one axis

```css
:where(.bf-theme) :where(.bf-badge.is-nested) {
  align-self: center;
  line-height: var(--bf-nested-row-line-height);
  vertical-align: middle;
}
```

Block extent becomes `body line − baseline`. Inline extent does not follow,
because `min-width` and `--bf-ui-badge-padding-inline` are interpolated from the
body line at build time and are not custom properties the cascade can re-point.

The nested badge is therefore wider than tall by exactly one baseline in every
tier. This is the reported ellipse.

The defect is not the arithmetic. It is that the inline floor was expressed as a
build-time constant while the block value was expressed as a custom property, so
only one of them could participate in the nested re-point. Any future ledger
would break it again.

## Observation: chips have no inline floor

`.bf-chip` takes `padding-inline` from the field inset and declares no
`min-inline-size`. A single-character chip is `field inset + advance + field
inset` wide against a full painted interface row, so it is an ellipse in every
tier and in every state. There is no partial mechanism here to repair — the
contract is simply absent.

## Observation: icon-only buttons solved block and not inline

```css
:where(.bf-theme) :where(.bf-button.is-icon:not(:has(.bf-button-label))) {
  column-gap: 0;
}
:where(.bf-theme) :where(.bf-button.is-icon:not(:has(.bf-button-label)))::before {
  block-size: var(--bf-body-line-height);
  content: "";
  inline-size: 0;
}
```

The zero-width strut is a correct and careful solution to the block problem: an
icon-only flex button has no text line box, so the strut restores the active
body line without imposing a target height.

The inline side kept the action inset. An action inset exists to frame a label;
with no label there is nothing to frame, and the inset becomes 1rem of empty
space on each side of a 1rem icon.

The strut is also the precedent for this package's direction. It already derives
one axis from a metric fact rather than authoring a size. Block-derived inline
geometry is the same move on the other axis.

## Decision: derive inline from the painted block

The vertical axis is non-negotiable and already exact. The inline axis for
text-free content has no comparable source. So inline derives from block.

Painted rather than occupied, because occupied includes trailing compensation —
empty space below the paint. Matching inline extent to the occupied block would
produce a consistent upright ellipse, which is the same class of defect from the
opposite direction.

## Decision: minimum rather than fixed size

A minimum makes one character exactly circular, lets two or more grow into a
stadium, and cannot clip. A fixed size would clip a three-digit counter.

This is why neither of the two options the stakeholder question posed — derive
the padding, or force max and min extents — is quite right on its own. Deriving
padding cannot produce a circle, because padding is added to an advance width
that varies by character. Forcing both extents clips. A derived minimum with
padding retained for overflow does both jobs.

The surviving `--bf-ui-badge-padding-inline` is no longer a body-line
approximation. It is one `--bf-border-width`: the smallest token-derived inset
that keeps overflowing badge text off the painted edge, and the existing input
to the nested badge overhang. The square alias alone owns the fitting case.

## Decision: one alias, re-pointed by the cascade

Exposing `--bf-interface-row-painted-block-size`,
`--bf-nested-row-painted-block-size` and
`--bf-nested-framed-row-painted-block-size` to consumers and asking each to pick
would reproduce the nested-badge defect for the next component. One alias
re-pointed under `is-nested` makes the ledger switch structural.

## Rejected: `aspect-ratio: 1`

`aspect-ratio` on a box with intrinsic content and padding resolves against the
content box in ways that vary with `box-sizing` and overflow, and it fights the
minimum once content exceeds one character. It would also make the shape
independent of the painted block, so the circle would stop tracking the tier.

## Rejected: authored per-tier square sizes

A `squareSizeRem` per tier would work and would be simple to read, but it
duplicates a value the system already computes exactly, and it would drift the
first time a nudge or border changes. The whole point of the occupied-block
model is that these sizes are derived.

## Rejected: fixing the badge in place

Changing `min-width` to resolve from `--bf-nested-row-painted-block-size` under
`is-nested` would not fix the reported symptom: that shared ledger restores the
host line through padding while the badge paints no block padding. It would
also leave chips, numbered pagination, and icon buttons without a reusable
mechanism. The member/state table is what prevents recurrence.

## Closed: single-character selection and chip keyline

CSS cannot select on content length. The block-derived minimum therefore
applies universally to badges and chips, and the circle is the case where
intrinsic padded content fits inside it. Chips retain the Field inset so their
common multi-word form shares the field glyph keyline. Documentation's
one-character chip is about 1.43px wider than its minimum and is accepted as a
slight stadium; badges own the exact circular-counter case.

No content-length modifier is introduced.

## Closed: radius scope

Border radius may change in `.bf-chip` and `.bf-badge` and nowhere else.
Status labels are removed from the package entirely; they are rectangular by
design and making them circular is a redesign. Icon-only buttons and pagination
slots become square and keep `--bf-radius`.

## Resolved: changed interactive target size

Squaring an OS icon button reduces its paint from roughly 3rem to roughly
1.25rem inline. The accepted resolution is not a target block size and does not
rely on arbitrary consumer spacing: a transparent absolutely positioned
`::after` extends the pointer target to at least 24-by-24 CSS pixels without
entering flow or changing paint. Supported `.bf-actions` groups derive the
extension overflow from the same minimum, add one border width of positive
clearance between adjacent icon-link targets, and reserve that overflow as
padding when `is-nowrap` would otherwise clip it. The 24px value remains a
CSS-pixel constant because WCAG 2.2 success criterion 2.5.8 defines the
requirement in CSS pixels; it is not a BF spacing token. Interactive chips and
numbered pagination retain their measured direct or spacing dispositions.

## Resolved: fractional border rasterisation

At 150% device scale an authored 1px border can render as 0.666667 CSS px. Two
block borders then make a formula-derived inline minimum about 0.67px wider
than the rendered block without either formula being wrong. Shape comparison
therefore permits 1.05px—one authored border—and a forced 1.5-scale browser
sweep proves that the allowance is exercised. A 0.51px tolerance is valid only
at integer scale and would reject correct output on common Windows displays.
