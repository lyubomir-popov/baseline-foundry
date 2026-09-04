# Plan: Block-derived inline geometry

**Branch**: `feat/021-block-derived-inline-geometry`
**Spec**: [spec.md](spec.md)

## Technical context

The accepted contract in
[`docs/component-spacing-architecture.md`](../../docs/component-spacing-architecture.md)
already derives an exact painted block per tier and per nested ledger. This
package adds one consumer-facing alias over those existing values and migrates
four component families onto it. No new geometry is computed.

## Design

### One name, many painted blocks, re-pointed by the cascade

`--bf-square-block-size` resolves to each member's own painted block and is
re-pointed per member and state, matching what that component actually paints
rather than which shared ledger it sits in.

Bordered nested icon-only buttons are excluded. Browser measurement proved that
the 1rem OS icon canvas alone equals the complete host line, leaving no room
for two borders and framed padding. Supporting that composition would require
a separate icon-size decision rather than an alias re-point.

The distinction is not academic. The nested-badge defect exists because a
component adopted the nested ledger on one axis and kept a standalone value on
the other. An earlier draft of this package proposed fixing it by re-pointing
to `--bf-nested-row-painted-block-size`, which would not have worked: the badge
declares `padding-block: 0`, so its paint is its line height, while that ledger
name restores the full host line through padding. The fix would have left the
badge exactly as elliptical as before.

The consumer-facing shape is still one name, because if a consumer never names
a value it cannot desynchronise its axes. What changes is that the re-point
table is per member and state, and enumerated in the contract.

### Minimum, not size

`min-inline-size: var(--bf-square-block-size)` with token-derived
`padding-inline` retained for overflow. Content that fits produces exactly the
painted block; wider intrinsic content grows the box. Nothing clips, and
nothing overrides intrinsic sizing.

The owner moved chips to the Action inset on 2026-09-02. A regular chip uses
`Action − real border`; a nested chip uses the full Action inset because its
border is inset paint rather than box geometry. That Action-framed intrinsic
width exceeds the painted row for every supported, non-empty chip, so chips do
not consume the block-derived minimum. One-character chips are stadiums in all
tiers, and badges own exact circular counters.

For icon-only buttons the action inset is removed rather than retained, because
there is no label for it to frame; the icon centres inside the minimum through
the existing flex centring. Link-style icon buttons re-point the same alias to
their body-line paint because `is-link` removes the regular padding and border.
The unsupported nested-link combination never receives the framed nested value.

The square paint remains naturally dense. An absolutely positioned transparent
`::after` extends the pointer target to `max(100%, 24px)` on both axes without
entering flow or occupied-block measurement. WCAG 2.2 success criterion 2.5.8
defines the minimum in CSS pixels, so this is one normative constant reused by
both target axes, the per-target inline allowance, the wrapping-row block gap
floor, and the target-owned nowrap block allowance; it is not a painted size or
BF spacing token.

Browser hit testing showed that two generated targets which overlap can route
part of one control's target to its sibling, and that a scrollport clips
positioned descendants. Each supported icon-only button therefore reserves its
own inline overflow with margin; this follows the target through actions,
clusters, and other ordinary containers without changing stored gap-token
values.
The built-in wrapping primitives, `.bf-actions` and `.bf-cluster`,
automatically apply a baseline-rounded row-gap floor so adjacent targets on
different rows cannot touch or overlap. Row gap moves no child paint and costs
nothing on a single line, but the unconditional floor can exceed the authored
gap on a wrapping container that has no target. A direct icon target in
`.bf-actions.is-nowrap` owns
symmetric baseline-rounded block margins because the row declares a clipping
scrollport; its inline margins already supply the scroll extent. Text-only
nowrap rows receive no padding. Supporting engines round the exact shortfalls,
including zero in Editorial and more than one baseline for sufficiently dense
custom configs; the safe fallback reserves one baseline. No container geometry
depends on contextual `:has()`, and no public opt-in modifier is required.

### Badge cleanup

The badge currently uses `box-sizing: content-box`, a `min-width` interpolated
from the build-time body line, and `--bf-ui-badge-padding-inline` derived as a
quarter of the body line. Together these approximate the painted block by a
different route and fail to follow the nested ledger.

Replace the approximation with the contract. `--bf-ui-badge-padding-inline`
survives only as one border-width unit: the minimum token-derived overflow
inset and the existing nested-overhang input. It no longer participates in
fitting-case size derivation; the cascade-repointed square alias owns that.

### What is not touched

Block geometry, line heights, nudges, compensation, occupied blocks, the three
text insets and the leading-mark family are all unchanged. The existing vertical
assertions are the regression net for that claim and must pass unmodified —
they are not to be adjusted to accommodate this package.

## Source routing

- `src/css-component-contracts.ts` owns the alias and its ledger re-points.
- `src/css-components/chip-badge-status.ts` owns chip and badge adoption and
  the badge cleanup. Status labels are explicitly untouched.
- `src/css-components/button-actions.ts` owns icon-only button adoption.
- `src/css-components.ts` owns bare numbered-pagination adoption. Labelled
  previous/next pagination and article pagination are explicitly untouched.
- `scripts/validate-build.ts` owns emission and anti-regression assertions.
- `scripts/verify-component-behavior.ts` owns measured shape and target size.
- `docs/component-spacing-architecture.md` owns the published classification
  row.

## Constitution check

- **Owner-led product decisions**: Pass. This answers a direct stakeholder
  report and imports no external system.
- **Semantic vertical spacing**: Pass. Nothing block-owned changes.
- **Metric truth and occupied-block model**: Pass. The package consumes the
  existing painted block rather than authoring a size, and explicitly rejects
  the occupied block as the shape source.
- **Four first-class tiers**: Pass. All four receive values, assertions and
  browser review.
- **Small composable primitives**: Pass. One derived alias and no wrapper
  elements. The existing structural label-slot test distinguishes bare icon
  buttons; no ancestry- or contextual-container-inferred geometry is
  introduced. The button may inspect its own label slot to select its state.
- **Accessible behavior**: Pass. The paint remains naturally dense while the
  icon-only pointer target is directly extended to 24-by-24 CSS pixels in every
  tier. Target-owned inline margins preserve separation in ordinary
  compositions, while the built-in wrapping primitives and nowrap action
  scrollport own the row and edge clearance their behavior requires. Other
  changed interactive members retain measured direct or spacing dispositions.
- **Generated-source ownership**: Pass.
- **Spec-owned state**: Pass on promotion.

## Risk

The accessibility risk was real. An OS icon-only button moves from roughly
3rem wide paint to roughly 1.25rem, so relying on surrounding spacing would be
composition-dependent. The accepted disposition squares the paint and extends
the pointer target with a transparent out-of-flow 24 CSS-pixel square. This
preserves control density and makes the target direct in every tier; supported
targets own their inline clearance, while BF's wrapping and scrolling
primitives automatically own their required block clearance and edge
containment.

The reviewed alternatives were:

1. Square the button and rely on the surrounding hit area or spacing where the
   pattern already provides it.
2. Square the paint and extend the target with a transparent inline extension
   that does not affect layout.
3. Accept a non-square icon button in OS only, recorded as a reviewed
   exception.
4. Demonstrate and record the WCAG 2.2 spacing exception for an undersized
   target.

T005 measured before the disposition was selected; the final browser contract
now checks the extension itself and edge hit testing.

The second risk was that "single character" is not a state CSS can select on.
That is closed: the minimum applies universally to badges, while chips use
Action padding. One-character chips are stadiums in every tier, and consumers
use a badge when the semantic need is a circular counter.
