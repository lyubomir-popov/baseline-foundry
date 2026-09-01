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

This includes the nested icon-only button's unchanged body-line metric strut.
Its nested padding comes from the nested framed ledger, but its content-height
fact remains the body line, so its alias composes those actual facts instead of
copying the ledger's nominal painted-block name.

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
`padding-inline` retained for overflow. One character produces exactly the
painted block; more characters grow the box. Nothing clips, and nothing
overrides intrinsic sizing.

Browser measurement exposed one implementation constraint hidden by the draft:
Documentation's one-character chip was intrinsically 23.90px wide against a
22.48px painted block under the former Field-keyline padding. A minimum cannot
shrink that box. The implementation therefore subtracts one additional border
unit on each inline edge and centres the fitting content. This is an explicit
consequence of moving chips out of the Field classification: their overflow
padding remains derived from existing variables, but their glyph edge no longer
claims the Field keyline. The choice is surfaced in `review.md` for owner visual
acceptance rather than hidden as an incidental CSS adjustment.

For icon-only buttons the action inset is removed rather than retained, because
there is no label for it to frame; the icon centres inside the minimum through
the existing flex centring. Link-style icon buttons re-point the same alias to
their body-line paint because `is-link` removes the regular padding and border.
The unsupported nested-link combination never receives the framed nested value.

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
  buttons; no ancestry-inferred density is introduced.
- **Accessible behavior**: Conditional. An icon-only action may become narrower
  than it is today. Target size must be measured per tier and the result
  accepted or the design revised. This is the one place the package can fail
  its own constitution check, and T005 exists to find out early.
- **Generated-source ownership**: Pass.
- **Spec-owned state**: Pass on promotion.

## Risk

The accessibility risk is the real one. Today an OS icon-only button is roughly
3rem wide; a square would be roughly 1.25rem. That is a substantial reduction in
pointer target area in the densest tier. Permitted dispositions are:

1. Square the button and rely on the surrounding hit area or spacing where the
   pattern already provides it.
2. Square the paint and extend the target with a transparent inline extension
   that does not affect layout.
3. Accept a non-square icon button in OS only, recorded as a reviewed
   exception.
4. Demonstrate and record the WCAG 2.2 spacing exception for an undersized
   target.

Deciding this before implementation would be guessing. T005 measures first.

The second risk was that "single character" is not a state CSS can select on.
That is closed: the minimum applies universally to badges and chips, and the
circle is simply the case where intrinsic content fits inside it. Short
multi-character chips become wider than they are today, which the owner has
accepted as correct — a chip narrower than the row it sits in reads as an
accident.
