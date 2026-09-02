# Contract: Block-derived inline geometry

## Correction notice

An earlier draft of this contract proposed re-pointing one alias to the shared
*ledger* names — `--bf-interface-row-painted-block-size` and
`--bf-nested-row-painted-block-size`. Adversarial review established that this
is wrong for badges, and the reason generalises.

A shared ledger name describes the row a component sits in. It does not
describe the box a component paints. Those coincide only when the component
adopts the ledger's padding. The badge does not: it declares
`padding-block: 0`, so its painted height is its line height alone, while
`--bf-nested-row-painted-block-size` restores the full host line through
padding. Using the ledger name would have produced a nested badge one baseline
wider than tall — the reported defect, unfixed.

The corrected rule is below and is the contract.

## The rule

`--bf-square-block-size` resolves to **the component's own painted block**: its
active line height, plus its own block padding, plus its own block borders. It
is re-pointed by the cascade for every member and state whose painted block
differs.

| Member and state | Line height | Block padding | Borders | Painted block |
|---|---|---|---|---|
| `.bf-badge` | body line | `0` | none | body line |
| `.bf-badge.is-nested` | nested row line | `0` | none | nested row line |
| `.bf-chip` | body line | interface row padding | 2 real | interface row painted |
| `.bf-chip.is-nested` | nested row line | nested row padding | inset paint, no box border | nested row painted |
| `.bf-button.is-icon` no label | body line via strut | interface row padding | 2 real | interface row painted |
| `.bf-button.is-link.is-icon` no label | body line via strut | none | none | body line |
| `.bf-notification-close` | icon canvas | one `--bf-space-1` on each block edge | none | `2 * space-1 + icon canvas` |
| bare numbered `.bf-pagination-link:not(.is-previous):not(.is-next)` | body line | interface row padding | 2 real | interface row painted |

The right-hand column is what `--bf-square-block-size` must equal in that
state. A consumer writes `min-inline-size: var(--bf-square-block-size)` and
never names a ledger.

Any future member must add a row here before it may consume the alias. That
row, not the alias name, is what prevents the badge defect recurring.

A bordered `.bf-button.is-icon.is-nested` is deliberately not a member. In OS,
its 1rem icon canvas alone equals the complete host line, so adding two borders
and framed padding cannot satisfy the nested fit invariant. Supporting it would
require a separate icon-size decision; `is-nested` does not silently shrink it.

## Painted, never occupied

| Quantity | Includes | Use for shape? |
|---|---|---|
| painted block | line + own padding + own borders | Yes |
| occupied block | painted + trailing compensation | No |

Trailing compensation is transparent space that snaps the row to the grid. It
is not part of what the eye reads as the shape.

`nav.bf-pagination` is a live instance of getting this wrong:

```css
--bf-pagination-slot-inline-size: var(--bf-interface-row-occupied-block-size);
…
min-inline-size: var(--bf-pagination-slot-inline-size);
padding-inline: var(--bf-component-inline-inset-action-bordered);
```

It already reaches for a block-derived inline minimum — the instinct behind
this package is not new — but takes the occupied block, so every numbered
pagination slot is wider than its paint by the compensation. It also keeps the
bordered action inset, which floors a single digit at roughly `1rem + digit +
1rem` before the minimum applies. Both are corrected here.

The two quantities are equal whenever compensation happens to be zero, which is
true in some tiers. The browser assertions must therefore compare *painted*
extents explicitly, or a tier where they diverge will silently regress.

## Expected values

Diameters are generated, not authored. The implementation records the measured
per-tier values in `review.md`. They are deliberately not restated here,
because a hand-copied expected value is the class of defect this contract
exists to prevent.

## Membership

Block-derived inline geometry applies to:

- `.bf-badge` — counter, standalone and nested.
- `.bf-chip` — universally as an inline floor, while using its Action inset;
  it is not selected only when its content is one character.
- `.bf-button.is-icon` with no `.bf-button-label` — standalone, link-style, and
  specialized borderless notification-close states. Bordered nested icon-only
  buttons are unsupported because the OS icon canvas already fills the host
  line before padding and borders.
- Bare numbered `.bf-pagination-link` slots in `nav.bf-pagination`.

It does not apply to:

- `.bf-status-label`. It is rectangular by design and has no radius. Making it
  circular is a visual redesign, not a geometry fix, and is out of scope.
- `.bf-article-pagination-link`. These are labelled links with a leading or
  trailing icon in a two-column grid. Below a 28.75rem container they collapse
  to icon-only, which is a responsive label-hiding case rather than an
  icon-only component; record the collapsed geometry in the audit but do not
  give the link a square minimum.
- `.bf-pagination-link.is-previous` and `.is-next`. These are labelled Action
  controls and retain their action inset.
- Any surface with a text label, however short. A one-word button is Action.
- Checkbox and radio marks, which resolve from the leading-mark canvas.
- Switch, a reviewed exception with a deliberately wider track.
- Table cells, panels and region-owned surfaces.

## Circles, stadiums and the radius boundary

The minimum applies universally to badges and chips. The *circle* is what
happens when the component's intrinsic, padded content fits inside the minimum;
wider content produces a stadium at the same painted block. Neither case is
selected on content length, so no content-length modifier is introduced.
Chips use the Action inset. A regular chip subtracts its real border from that
inset; a nested chip keeps the full inset because its border is inset paint and
contributes no box geometry. One-character chips therefore exceed the minimum
and are correctly stadiums in every tier; a one-character circular counter is
a badge.

**Radius changes are permitted for exactly two components: `.bf-chip` and
`.bf-badge`.** No other component may gain, lose or alter a border radius in
this package. Icon-only buttons and pagination slots become square and keep
`--bf-radius` unchanged. Status labels keep no radius. This boundary is
explicit because rounding a square is the easiest way to fake a shape fix, and
faking it in one component would hide a real geometry defect in another.
Rendered measurement showed the existing chip and badge radii already satisfy
the shape outcome, so the implementation changes no radius declaration.

| Member | Shape source | Radius |
|---|---|---|
| Badge | block-derived minimum | at or above half the painted block; may change |
| Chip | block-derived minimum | existing pill radius; may change |
| Icon-only button | block-derived minimum | `--bf-radius`, unchanged |
| Pagination slot | block-derived minimum | `--bf-radius`, unchanged |
| Status label | not a member | none, unchanged |

## Icon-only action geometry

The painted square is derived, in full, from existing variables. No painted
length is authored and no value is hardcoded.

- Inline: `min-inline-size: var(--bf-square-block-size)` and
  `padding-inline: 0`. The action inset is removed for the icon-only case
  because there is no label for it to frame. The width therefore equals the
  painted block by construction, which is the grid-aligned height the button
  already paints.
- Block: unchanged. The existing zero-width metric strut supplies the body
  line. Bordered nested icon-only buttons are excluded because their icon
  canvas cannot fit the OS host line with padding and borders.
- Link-style state: `is-link` removes the regular block padding and borders, so
  its alias resolves to the body-line metric strut. The generic consumer still
  uses the same one name.
- Centring: the existing `display: inline-flex` with `align-items: center` and
  `justify-content: center` places the icon in both axes from the derived box.
  No offset, transform, translate or authored padding is used to position it.

An implementation that reaches for a rem literal, a pixel value, a magic
multiplier or a per-tier override to size or centre the *paint* has failed this
requirement, regardless of how it renders. The normative 24 CSS-pixel pointer
target below is the sole pixel exception and does not participate in paint.

## Target size

Squaring changed interactive members can reduce pointer targets, most sharply
in OS. The implementation measures icon-only actions, interactive chips, and
numbered pagination. Icon-only buttons take option 3 below: an absolutely
positioned transparent `::after` extends both pointer-target axes to
`max(100%, 24px)` without changing control paint or occupied geometry. The
24px value remains in CSS pixels because WCAG 2.2 success criterion 2.5.8
specifies that normative minimum in CSS pixels; it is not a BF spacing token.

The extension is direct only when it is not clipped or claimed by an adjacent
target. Each supported icon-only button therefore derives its per-edge overflow
from the same 24px constant and reserves that overflow with `margin-inline`.
The allowance travels with the target in `.bf-actions`, `.bf-cluster`, and any
other ordinary non-clipping composition; container gaps remain token-owned.

A clipping overflow container opts in explicitly with
`is-icon-target-scrollport`. A wrapping container independently opts in with
`is-icon-target-wrap`, which puts block-axis clearance on each direct icon-only
target so adjacent rows cannot claim each other's extension. Both modifiers
round the exact target shortfall up to the active baseline in supporting
engines, without a one-baseline cap; their conservative fallback reserves one
baseline. The scrollport allowance is symmetric on all four edges, while the
wrap allowance is target-owned. These explicit modifiers prevent clipping,
cross-row overlap, and half-baseline phase shifts without contextual `:has()`
inference. A consumer composition that omits the relevant modifier does not
claim to support that extended-target case.

The permitted dispositions are:

1. A target of at least 24 by 24 CSS pixels, per WCAG 2.2 Target Size
   (Minimum), success criterion 2.5.8.
2. A demonstrated spacing exception under that success criterion, recorded with
   the measured spacing.
3. Paint squared with the target extended by a transparent out-of-flow square
   that does not affect layout.
4. A reviewed per-tier exception, recorded with its reason.

Assumption is not one of the options.

## Invariants

- No block measurement changes. The existing four-tier occupied-block
  assertions pass unmodified and are not adjusted to accommodate this package.
- Inline extent is a minimum. Content wider than the painted block grows the
  box and never clips.
- No `aspect-ratio`, transform, fixed painted `inline-size` or authored rem
  width is used to achieve a shape. The pointer-target pseudo-element may use
  only the reviewed normative 24 CSS-pixel minimum.
- No inline floor is interpolated at build time from a token value; it resolves
  from a custom property so the cascade can re-point it.
- No component outside `.bf-chip` and `.bf-badge` changes its border radius.
- Target geometry is never inferred by a container through `:has()`. Inline
  clearance is target-owned; wrapping and clipping containers that support
  extended targets explicitly use `is-icon-target-wrap` and
  `is-icon-target-scrollport`, respectively. The button selector may still use
  `:not(:has(.bf-button-label))` to identify its own label state.
- Every changed interactive target is measured in every tier. Icon-only
  actions must expose a directly hittable 24 CSS-pixel square at cardinal edges
  and corners in LTR and RTL, including adjacent `.bf-actions` and
  `.bf-cluster` compositions plus both logical extremes of an explicit target
  scrollport; other members record their actual rounded shape and pairwise
  spacing where needed.
