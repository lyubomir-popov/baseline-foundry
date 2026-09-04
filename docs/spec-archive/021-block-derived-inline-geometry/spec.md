# Spec 021: Block-derived inline geometry

**Feature Branch**: `feat/021-block-derived-inline-geometry`
**Date**: 2026-09-01
**Status**: Complete. The owner accepted the remediated F1–F5 and N1–N6
geometry, and it merged into `main` at `17805b6` on 2026-09-04. The package is
archived; publication and release remain separate decisions.

## Problem

A stakeholder reports that single-digit chips and badges render as ellipses
rather than circles, and that icon-only actions such as previous and next are
not square.

The report is correct, and the cause is structural rather than cosmetic. Every
inline inset in Baseline Foundry frames a *text advance*. Field inset resolves
the first glyph of entered data. Action inset frames a command label.
Continuation inset follows a mark. All three assume there is text whose width
the inset is measured against.

Content with no meaningful text advance breaks that assumption. A single
character, a counter digit and a bare icon all have an advance width unrelated
to the height of the box drawn around them. Applying a text inset to them
produces a box whose inline extent is `inset + advance + inset` and whose block
extent is the painted interface row. Those two numbers have no reason to match,
so the result is an ellipse or a wide rectangle.

Three concrete defects follow.

**The nested badge switched ledgers on one axis only.** The badge's authored
`content-box` approximation intended to make the standalone state circular,
but the global component contract wins in the cascade and computes
`border-box`; browser measurement therefore found even the standalone state
slightly elliptical. `.bf-badge.is-nested` also re-points its line height to
`--bf-nested-row-line-height` — body line minus one baseline — but the
`min-width` is interpolated from the body line at build time and does not
follow. The nested defect is larger and systematic in every tier.

**Before this change, chips had no inline floor at all.** A chip took
`padding-inline` from the field inset and nothing else. A single-character chip
was `field inset + advance + field inset` wide against a full interface row of
height, so it was an ellipse by construction in all four tiers.

**Before this change, icon-only buttons kept the action inset.**
`.bf-button.is-icon` correctly solved the block problem with a zero-width
metric strut, but kept the 1rem action inset on both sides. A 1rem icon
therefore occupied 3rem inline against roughly 1.5rem of painted block — a
two-to-one rectangle where a square was intended.

## The axis question

The stakeholder's question is how to connect two axes when one of them is
non-negotiable. The answer is a direction rather than a compromise.

The vertical axis is already fully derived and already exact: the painted block
size is a known quantity in every tier, produced by the accepted occupied-block
contract. The inline axis for text-free content has no equally good source. So
the inline size derives from the block, never the reverse. Nothing is forced
onto the vertical axis, and no length is authored.

Two details make this correct rather than approximately correct.

**Use the painted block, not the occupied block.** The occupied block includes
trailing compensation, which is empty space below the paint that snaps the row
to the grid. Matching inline extent to the occupied block would produce a
visibly taller-than-wide pill. The painted block is what the eye reads as the
shape. `nav.bf-pagination` already makes this mistake in production: it takes a
block-derived minimum from `--bf-interface-row-occupied-block-size`, so every
numbered slot is wider than its paint by the compensation.

**Use the component's own painted block, not a shared ledger name.** A ledger
name describes the row a component sits in; it matches the component's paint
only when the component adopts the ledger's padding. The badge declares
`padding-block: 0`, so its paint is its line height alone. Re-pointing an alias
to `--bf-nested-row-painted-block-size` would restore the full host line and
leave the nested badge exactly as elliptical as it is today. The alias must
resolve per member and state, and
[`contracts/block-derived-matrix.md`](contracts/block-derived-matrix.md)
enumerates every one.

**Apply it as a minimum, not a fixed size.** A minimum makes content that fits
exactly circular and lets wider content grow into a stadium, which is the
correct and expected behaviour. A fixed size would clip. This is why the answer
is neither "derive the padding" nor "force a width" as separately posed: it is
a derived minimum with token-derived padding retained for overflow.

The result is a fourth inline classification alongside Field, Action and
Continuation. Call it block-derived. It replaces the current
`Badge | Centred exception` row in the classification table, which states an
outcome without a mechanism.

## Outcomes

- One named contract exposes each member's own painted block as an inline
  minimum, re-pointed by the cascade per member and state so a nested consumer
  cannot pick up a standalone value.
- The minimum applies universally to badges. Content whose intrinsic padded
  width fits inside it renders as a circle; wider content renders as a stadium
  at the same painted block. Chips use the Action text inset and need no
  block-derived floor because it does not govern supported, non-empty chip
  content. One-character chips are stadiums in every tier; badges own
  the exact circular counter case. No content-length modifier is introduced.
- A regular or link-style icon-only action is square in all four tiers, with
  its width equal to the grid-aligned height it already paints. Bordered nested
  icon-only buttons remain unsupported because their icon canvas cannot fit
  the OS host line alongside padding and borders.
- Icon-only actions expose a direct 24-by-24 CSS-pixel pointer target through
  an out-of-flow transparent extension without changing control paint, block
  geometry, or occupied size. Target-owned margins prevent adjacent extensions
  from overlapping in actions, clusters, and other ordinary containers.
  Built-in wrapping `.bf-actions` and `.bf-cluster` rows automatically apply a
  baseline-rounded row-gap floor, and direct icon targets in
  `.bf-actions.is-nowrap` automatically reserve their own symmetric block
  clearance so overflow cannot clip them without padding text-only strips.
- Numbered pagination slots stop using the occupied block and stop carrying an
  action inset around a bare digit.
- No component gains a target block size, an authored width, a transform or an
  aspect-ratio hack.
- Any border-radius change is permitted only in `.bf-chip` and `.bf-badge`.
  Measurement showed no radius change was necessary.
- The classification table gains a block-derived row with an explicit
  membership list.

## Boundaries

- No block value changes. Occupied block, painted block, compensation, line
  height and nudges keep their current values and owners.
- Block-derived inline geometry applies only where content has no meaningful
  text advance. It is not a general escape from the three text insets, and a
  component may not adopt it because its measurements happen to match.
- **Border radius may change in `.bf-chip` and `.bf-badge` and nowhere else.**
  These are the only two permitted exceptions. Icon-only buttons and pagination
  slots become square and keep `--bf-radius` unchanged. Status labels keep no
  radius. Rounding a square is the easiest way to fake a shape fix; the
  boundary exists so a real geometry defect cannot hide behind one.
- `.bf-status-label` is not a member. It is rectangular by design and has no
  radius; making it circular is a visual redesign, not a geometry fix.
- `.bf-article-pagination-link` is not a member. Its links are labelled, with
  the label hidden responsively below a 28.75rem container. Record the
  collapsed geometry in the audit; do not give it a square minimum.
- Interactive block-derived members keep their accessible name and focus paint.
  Target size is measured per tier and resolved against WCAG 2.2 success
  criterion 2.5.8 for icon-only actions, interactive chips, and numbered
  pagination.
- All icon paint centring and sizing derives from existing variables. No rem
  literal, pixel value, magic multiplier or per-tier override may be introduced
  to make an icon look centred. The sole pixel exception is the normative 24
  CSS-pixel pointer-target minimum from WCAG 2.2 success criterion 2.5.8.
- `.bf-cluster.is-nowrap` is not a clipping scrollport and receives no automatic
  block-axis target allowance. If it or another ancestor gains clipping
  overflow, that owner must provide and verify its own containment.
- Publication, release, merge and archive require separate owner direction.

## Acceptance

1. `--bf-square-block-size` resolves to each member's own painted block for
   every member and state listed in
   [`contracts/block-derived-matrix.md`](contracts/block-derived-matrix.md). A
   consumer references one name and never selects a ledger. Adding a member
   without adding its row fails the build.
2. A `.bf-badge` whose intrinsic content fits the minimum renders with equal
   painted inline and block extents in all four tiers, standalone and nested,
   in light and dark. Chips use the Action inset without the inert
   block-derived floor, so one-character regular, borderless, and nested chips
   render as centred stadiums in all four tiers. Measured in the browser, within one
   rasterised border width where equality is required.
3. Wider chip and badge content renders as a stadium with the same painted
   block extent, and never clips at two, three, four or five characters.
4. Regular and link-style `.bf-button.is-icon` controls with no label render
   with equal painted inline and block extents in all four tiers. A bordered
   `.is-nested` icon-only button is explicitly outside membership.
5. Bare numbered `.bf-pagination-link` slots derive from the painted block
   rather than the occupied block and carry no action inset around a digit.
   Labelled previous/next controls retain the Action contract.
6. Every value in the icon-only painted geometry and pagination geometry
   resolves from an existing variable. A static assertion rejects an authored
   rem or pixel paint length, a magic multiplier or a per-tier override. It
   permits exactly five uses of the same normative `24px` constant: the two
   pointer-target axes, the per-target inline overflow derivation, the built-in
   wrapping-row gap-floor derivation, and the target-owned nowrap block
   allowance.
7. Target size for changed interactive members is recorded per tier and
   resolved against WCAG 2.2 success criterion 2.5.8 by one of the four
   dispositions in the contract. The check accounts for rounded target shapes
   and circle-to-target collisions. Assumption is not one of the dispositions.
8. Radius changes are permitted only in `.bf-chip` and `.bf-badge`; none proved
   necessary. A static assertion snapshots every other radius declaration so
   unrelated additions, removals, or value changes fail the build.
9. No block measurement anywhere in the four-tier occupied-block audit changes.
   Proven by the existing vertical assertions passing unmodified.
10. The badge `min-width` no longer interpolates a build-time body line; it
    resolves from the shared contract, so the nested ledger switch is
    automatic. `--bf-ui-badge-padding-inline` and the `content-box` sizing are
    either removed in favour of the contract or explicitly justified.
11. `npm test` and `npm run qa:components` pass before closeout, with fresh
    captures for every affected component.

## Closed decisions

Both former open questions were answered by the owner on 2026-09-01.

**Single-character selection.** Resolved by removing the question. The minimum
applies universally to badges; the circle is the case where intrinsic content
fits inside it. Action-framed chips use intrinsic padded width and are stadiums
from one character onward. No modifier, no content-length selection.

**Radius scope.** Chips and badges only. Recorded as a boundary above.

**Changed interactive target size** is an implementation measurement rather
than an open design question: T005 measures icon-only actions, interactive
chips, and numbered pagination, then one of four recorded dispositions applies.

**R1 raster tolerance.** The reported 0.67px mismatch was a correct 1px border
rasterising to 0.666667 CSS px at 150% device scale, not a formula defect. The
shape tolerance is 1.05px and a forced-scale browser sweep must exercise more
than 0.51px of it.

**R3/S1–S3 target-size disposition.** Icon-only actions use an out-of-flow
transparent 24 CSS-pixel square. This is a direct target, not a spacing
exception, and does not reopen the no-target-block-size rule. Every supported
target carries its own inline overflow allowance as margin, so adjacent targets
remain distinct in `.bf-actions`, `.bf-cluster`, and other ordinary
compositions without contextual `:has()` geometry. The two built-in wrapping
primitives automatically apply a baseline-rounded row-gap floor, regardless of
their descendants. Direct icon targets in `.bf-actions.is-nowrap`
reserve symmetric block margins inside the scrollport; supporting engines
resolve that per-edge allowance to zero in Editorial and one complete baseline in
Documentation, App, and OS, while the conservative fallback uses one baseline
in every tier. Both formulas round their exact shortfalls without a one-baseline
cap for custom configurations. The unused opt-in modifiers are removed.

**R4 chip keyline ownership, superseded by owner direction on 2026-09-02.**
Chips use the Action inset. Regular chips subtract their real border; nested
chips use the complete Action inset because their border is inset paint. That
intrinsic geometry already exceeds the painted block for supported, non-empty
content, so chips do not consume the block-derived alias. One-character chips are
stadiums in all four tiers, while badges own exact circular counters.

## Relationship to Spec 020

Independent, and cheaper. Spec 020 changes what the text insets are; Spec 021
changes which components should not be using a text inset at all. Neither
depends on the other's values.

The 24 CSS-pixel target, its derived per-target margins, and the built-in
wrapping-row floor are accessibility geometry rather than authored spacing
facts and must be exempted from Spec 020's spacing quantisation audit. The
fixed `--bf-inline-list-space: 0.5rem` is a provisional horizontal-composition
fact that Spec 020 must replace with the canonical token it defines. The former
OS-only 9px action gap no longer exists; ordinary column gaps remain on their
existing tokens.

Sequencing 021 first is preferable: it is smaller, it answers a live
stakeholder report, and it removes several components from the inset audit that
Spec 020 would otherwise have to account for.
