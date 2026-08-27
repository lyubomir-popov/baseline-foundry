# Spacing ownership decision

This note records the owner decision that supersedes the earlier BF-local
element-owned review.

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

- pattern internals use `--bf-section-space-shallow` (1.5rem);
- complete pattern or section siblings use `--bf-section-space` (4rem);
- `bf-stack is-flush` uses zero;
- the exceptional deep CTA composition may use the 8rem deep token in a future
  package.

The executable migration and evidence live in
[`specs/012-sites-container-spacing/`](../specs/012-sites-container-spacing/).
