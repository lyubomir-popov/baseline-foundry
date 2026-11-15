# Spec 031: Uniform checkmarked filter chips

Branch: `feat/031-checkable-chip`. Created: 2026-11-15.
Status: technically accepted at `08fe52c`; immutable candidate qualified from
`90d9053` and consumed at portfolio `75b5d6a`, with final consumer Astra acceptance.
Base: `0b026be`, preserving the accepted comparison/caption/Tab/Breadcrumb work.

## Intent and authority

The portfolio owner selected **Uniform outline with a checkmark** when asked
about selected filter chips. Triage established that BF's current pressed Chip
adds a 3px bottom selection bar over its outline; a consumer-private paint
override is inappropriate. Implement an explicit public opt-in treatment and
consume a verified package in portfolio. Ordinary Chip styling remains as-is.

This is an independent owner-requested scope, not spacing-bucket execution or
a reopening of Spec 030. There is no new owner planning gate. Source/rendered
independent Astra review and full required BF checks precede candidate adoption.
No merge, push, publication, deployment or portfolio CP4 clearance is implied.

The [artifact receipt](artifact.md) owns exact archive identity, public-package
verification and the completed consumer handoff. All bounded tasks are complete;
this package stays on its isolated branch pending separate owner integration
direction. Final owner visual/portfolio checkpoint decisions remain open.

## Outcomes and acceptance

1. A checkable filter Chip has one uniform all-sided paint-only outline in
   idle/hover/pressed/selected/focus states, without the bottom selection bar.
   Selected state has a visible non-color checkmark as well as its existing
   semantic fill. Existing ordinary Chip behavior remains unchanged.
2. A reserved mark slot prevents geometry/text-keyline jumps when selection
   changes. Reuse governed icon dimensions/leading-mark gap; do not invent
   padding, target heights, local consumer overlay variables or font nudges.
3. The consumer owns filtering and truthful aria-pressed on a native button.
   The check is decorative, adds no focus stop or accessible-name text, and
   appears only for actual selected state. Keyboard focus stays independent.
4. All four direct/shared tiers, light/dark/forced-colors, root16/20, narrow/
   wide and RTL layouts preserve occupied geometry and clear selection/focus.
   Legacy Chip and comparison/caption/navigation regressions pass.

## Public boundary

Add `bf-chip is-checkable` plus one `bf-chip-mark` before the existing value
slot. Document required native pressed semantics and decorative SVG. No new
runtime/filter state engine or generic checkbox is introduced. The ordinary
selected bar remains the default for Chips without this modifier. Palette and
filter choices stay downstream. Final owner visual approval remains separate
from technical qualification.
