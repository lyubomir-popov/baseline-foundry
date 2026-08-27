# Research: Hero divider and quiet linked titles

## Linked title colour

**Decision**: Keep the quiet title link blue in resting and visited states, remove only the default underline, and restore the underline on hover.

**Rationale**: The existing `color: inherit` rule removed the primary non-shape link affordance. BF already owns a theme-aware link token and focus treatment.

**Alternatives considered**:

- Inherit heading colour: rejected because it makes a linked title visually indistinguishable from a heading.
- Keep a permanent underline: rejected because the owner asked for a quiet title treatment.

## Hero divider ownership

**Decision**: Give `.bf-hero` a default block-start border using BF tokens, with `.is-borderless` as the opt-out.

**Rationale**: The divider is the hero's entry boundary and should not be a loose consumer-owned sibling. A border expresses that boundary without adding a decorative DOM node or changing semantic spacing ownership.

**Alternatives considered**:

- Require an `<hr>` before every hero: rejected because the rule would sit outside the pattern and remain easy to omit.
- Add a mandatory internal `.bf-hero-rule` slot: rejected because a default visual should not require repeated markup.

## Vanilla ancestry

**Decision**: Preserve the existing Vanilla-derived asymmetric hero padding and BF closing-media extension unchanged.

**Rationale**: Vanilla's `p-section--hero` owns top/bottom spacing and allows optional rules within content, but it does not supply a default outer divider. The new default is an explicit BF product decision, not a claimed Vanilla port.
