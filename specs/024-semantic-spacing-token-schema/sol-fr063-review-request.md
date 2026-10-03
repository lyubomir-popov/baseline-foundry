# Sol second-opinion request: FR-063 strokes

The owner asks for an independent second opinion on FR-063 before checkpoint C
adopts it. FR-063 was drafted by Claude Opus 5.5 (the checkpoint A reviewer) on
the owner's direction. It is uncommitted.

## Start here

Act as an adversarial reviewer. Read:

- Spec 024 `spec.md` FR-063, and the supersession notes added to FR-039,
  FR-039a1, FR-039d and FR-039f;
- spacing draft `H:\WSL_dev_projects\canonical-spacing-spec\specs\spacing\draft.md`
  §2.8.1 (strokes note), §2.8.2 (occupied formula) and §3.3;
- `opus-A-review.md` F1, which measured the fractional-DPR defect;
- Pragma's current per-side field chrome in
  `H:\WSL_dev_projects\pragma\packages\react\ds-global-form\src\index.css`
  (around lines 236–273). Its mixed per-side borders produce the tapered joins.

Write `sol-fr063-review.md` beside this file. Record your actual model identity.
Give findings with severity and reproduction steps, and a verdict: accept, accept
with bounded corrections, or reject. Do not edit the spec, Pragma or BF; this is
review only.

## The ruling in one paragraph

A visible component edge is an inset `box-shadow` layer over a zero layout
border. Padding is `inset + nudge`, with no stroke term. Each side is its own
layer: a uniform stroke uses the spread form, and per-side strokes use offset
layers, which meet square instead of mitred. Strokes compose with elevation and
focus shadows through named custom properties. Under
`@media (forced-colors: active)`, the component draws an `outline` of the stroke
width with a negative offset. Existing theme hooks keep their names. Border-drawn
shapes such as Tooltip arrows are out of scope.

## Pressure points

1. **Forced colours.** Is a negative-offset `outline` a sufficient and robust
   boundary in Windows high contrast, in Chromium and Firefox? Does it collide
   with focus indicators that also use `outline`? Are there other contexts that
   drop `box-shadow`, such as print, `prefers-contrast` or Reader view?
2. **Rendering.** How do 1px inset shadows render at DPR 1.25 and 1.5 compared
   with snapped borders: sharpness, and colour bleed through antialiasing? Is
   there a Safari or Firefox difference?
3. **Rounded corners.** Offset layers taper along a curve, which is the claim
   behind the spread-form rule. Is the rule enough for Pragma's radius tokens?
   Does a mixed per-side field with a radius still taper?
4. **Native controls.** Can native `<select>`, `<input>` and `<textarea>`,
   including `appearance: base-select` where used, reliably take a zero border
   and an inset shadow in every supported browser? Do any UA styles reassert a
   border?
5. **Composition.** Is "one declaration through named custom properties" enough
   to stop a later rule from dropping the stroke? Which existing Pragma
   `box-shadow` uses (focus, elevation, SideNavigation's inset indicator,
   TokenSwatch) would conflict?
6. **RTL.** Physical `box-shadow` offsets do not follow writing direction. Is
   "logical direction respected" implementable without duplicate `:dir(rtl)`
   rules, and how costly are they?
7. **Content overlap.** Is "padding at least the stroke width" always met?
   Consider zero-inset Site rows, Chip nested at dense values (FR-057) and
   table cells.
8. **Alternatives.** Is there a simpler option with fewer caveats that the
   ruling missed? Examples: `border` with `box-sizing` and an explicit
   `block-size` for single-line controls, a pseudo-element stroke, or a
   `background-image` gradient for single-side lines.

## Context

The owner accepted that users at 100% and 200% are unaffected by the DPR defect.
They chose box-shadow plus the outline fallback mainly to fix tapered per-side
joins, and to make geometry independent of strokes. Vanilla and BF already draw
some edges with inset shadows.
