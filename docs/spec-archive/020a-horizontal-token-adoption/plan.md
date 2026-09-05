# Plan: Horizontal token adoption

The resolved DTCG artifact remains the authenticated source for built-in
spacing. The adapter stops applying an overlay, so `spacing` and
`canonicalSpacing` become equal by construction. BF compatibility properties
remain emitted for the bounded deprecation window, but each built-in property
aliases its Canonical counterpart.

`inlineUnitRem` and whole-count component fields make the horizontal design
relationship explicit. Generation performs the multiplication once and keeps
the existing rem-valued JSON and CSS API. Block facts continue to resolve from
the baseline.

The shared mark/icon gap replaces the accidental reuse of the vertical field
gap and the baseline scale in component horizontal spacing. Fixed dimensions,
content-derived widths and Spec 021 block-derived squares remain exempt.

The implementation is split into reviewable stages: remove the overlay and
adopt final values; introduce/configure the inline axis; migrate component
horizontal consumers; then add rendered evidence. Page/grid inputs and
`src/css-grid.ts` are deliberately excluded for 020b.
