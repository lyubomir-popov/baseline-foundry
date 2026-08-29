# Spacing ownership decision

This note records the current BF spacing ownership decision.

## Decision

Baseline Foundry uses container-owned semantic vertical spacing in every
built-in tier: editorial, documentation, app, and OS.

- Metric-aligned text owns `padding-block-start` for its measured nudge.
- The same text owns a non-semantic `margin-block-end` that complements the
  nudge to one baseline unit.
- Production text does not use bottom-padding compensation.
- Role space-after values do not participate in production layout.
- Containers and patterns own semantic relationships through gaps or explicit
  structured rules.
- Nested `bf-stack` containers express different densities without querying or
  resetting their children.

## Rationale

One semantic owner makes substitution, removal, and nesting deterministic.
Baseline compensation stays local to the text whose font metrics require it,
while layout meaning stays at the container boundary. The split avoids double
spacing and keeps authored gaps independent of whether a child is a heading,
paragraph, list, figure, or component.

## Sites mapping

For the built-in Editorial tier, which supplies BF's Sites surface:

- compact relationships may select `is-extra-dense` (0.25rem), `is-dense`
  (0.5rem), or `is-loose` (1rem);
- pattern internals use `--bf-section-space-shallow` (1.5rem);
- complete pattern or section siblings use `--bf-section-space` (4rem);
- `bf-stack is-flush` uses zero;
- `is-section-shallow`, `is-section`, and `is-section-deep` expose the explicit
  1.5rem, 4rem, and 8rem section boundaries. The deep option is available as a
  primitive; deciding where a large CTA uses it remains component-specific.

The executable migration and evidence live in
[`docs/spec-archive/013-sites-container-spacing/`](spec-archive/013-sites-container-spacing/).
