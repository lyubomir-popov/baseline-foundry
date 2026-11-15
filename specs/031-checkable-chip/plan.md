# Plan: Checkable Chip presentation

Extend `src/css-components/chip-badge-status.ts` after its ordinary active rule.
The new opt-in mode disables only BF-owned selection-bar paint/forced-color
selection width, preserving the all-sided stroke and independent focus layer.
Using internal overlay composition here is BF source ownership, not a consumer
override. No generated CSS is edited.

Reserve a direct `bf-chip-mark` using existing `--bf-icon-size-default` (or the
current governed icon contract after inspection) and `--bf-leading-mark-gap`.
Center it in the painted row without changing occupied height or metric
compensation. Hide its paint while unselected, retaining its space. Reveal it
for aria-pressed=true/is-selected, not merely pointer :active. Support semantic
color modifiers and logical/RTL composition. Mark and SVG are aria-hidden,
nonfocusable and pointer-transparent.

Extend the existing Chip demo with a small independent checkable group, using
native buttons and consumer-owned click/keyboard pressed state. Add meaningful
static/browser proof to existing runners, comparing actual selected/hover/focus
paint, visibility, geometry, native names and unchanged ordinary Chip behavior.
Run type checks, npm test and qa:components, then independent Astra source/
rendered review and immutable candidate qualification. Preserve accepted Spec030
and all unrelated worktrees. The verified package is consumed downstream before
Home adopts the public modifier/mark; no private portfolio CSS is added.
