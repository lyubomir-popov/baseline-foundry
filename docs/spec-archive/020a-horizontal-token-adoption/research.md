# Research: Horizontal token adoption

## Governing decisions

- Design-tokens commit `18f57b95b1aa1dfe85a45746016b055c807d6628`
  authenticates the approved four-product matrix.
- BF contribution 3 proved the format adapter and bounded the seven-value
  overlay to 020a.
- The preserved Spec 020 draft was owner-approved in principle, but the later
  cross-repository architecture split it: 020a owns component/panel horizontal
  facts; 020b owns page margin, grid gutter and content padding.
- The owner postponed Pragma adoption on 2026-09-05.

## Current coupling

The built-in tier configs duplicate Canonical component values and express
surface-inline padding and the mark gap through baseline-unit fields. Several
component modules use `--bf-space-*` for horizontal gaps or padding. This
works only while the baseline happens to equal the intended inline step.

## Chosen model

All built-in tiers use `inlineUnitRem: 0.25`. Component inset counts, surface
inline count and mark-gap count are integers. Surface block padding and field
block gap remain baseline counts. The public generated values remain rem
dimensions and the twelve Canonical identifiers remain unchanged.

The shared mark gap is the owner for icon-to-label spacing where the visual
relationship is the same. A component may keep a different named horizontal
contract only when its geometry is demonstrably not that relationship.
