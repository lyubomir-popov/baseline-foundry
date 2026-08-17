# Spacing ownership decision

This note records Baseline Foundry's independent design decision after reviewing
element-owned and container-owned models.

## Decision

Baseline Foundry uses element-owned semantic vertical spacing in all built-in
tiers: editorial, documentation, app, and OS.

- `padding-block-start` and `padding-block-end` carry metric-derived baseline
  compensation on the element.
- `margin-block-end` carries the element's semantic relationship to following
  content.
- Containers compose layout but do not erase child spacing or become the
  default semantic-spacing owner.
- `bf-section` is the explicit page-section boundary. Stack density modifiers
  do not impersonate page-section semantics.

## Rationale

Elements know their semantic role and remain substitutable across prose, docs,
tool panels, generated content, and OS-style inspectors. Keeping compensation
and semantic space together avoids a split ownership model, reduces wrapper
requirements, and preserves rhythm when content types change.

Container-owned spacing can be appropriate in another design system whose team
constraints require it. Pragma and the Canonical official design system made
that separate product decision; it is not an upstream authority for BF.

## Rejected alternatives

- Container-owned spacing as a universal BF default.
- An app-only exception that zeroes nudges and erases semantic child spacing.
- A hybrid where elements own compensation but containers recreate semantic
  rhythm through generic gaps.
- Broad last-child resets that guess where a semantic flow ends.

The executable requirements and migration evidence live in
[`specs/001-baseline-foundry-renewal/`](../specs/001-baseline-foundry-renewal/).
