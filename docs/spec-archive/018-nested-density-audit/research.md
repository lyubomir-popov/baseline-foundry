# Research: Nested density audit

Initial Playwright measurements showed that a normal chip or status label
expands its side-navigation host row in every tier. The nested child's complete
border box and trailing compensation participate in the host flex line.

Reducing padding alone cannot remove one baseline consistently: Documentation
and App have almost no standalone block padding, while Editorial and OS have
more. Reducing the child line-height by one tier baseline is consistent and
keeps at least `1em` in all built-in tiers. Capping symmetric padding to the
remaining host-line space then prevents the border box from enlarging the row.

Negative margins, transforms, automatic ancestor selectors, and a general
dense button were rejected. They respectively create overlap/collapse risk,
move paint without layout, hide authorship, or reduce interactive targets below
the intended control model.

The expanded vertical audit exposed four stale or ambiguous cases:

- the file input padded its outer native input and its selector button, creating
  a double control box;
- the range rail still targeted the legacy compact control size;
- contextual-menu commands used separate compact padding despite being
  body-sized repeated actions; and
- table cells had their own snapped-height formula plus a contextual
  `:has(.bf-status-label)` density branch.

The first three now resolve through the shared single-line row. Table cells use
that same target with metric start padding, trailing in-box compensation, and
their separator reservation. The contextual table branch was removed; nested
auxiliaries opt in explicitly.

“Metric text references” meant unboxed roles whose occupied block contains only
font nudge, line box, and trailing baseline compensation. It was renamed
“Unboxed text metrics” and now includes form label/help, lists, and breadcrumbs.
Making these control-height would invent padding with no component owner.
“Independent contracts” mixed unrelated concepts and was removed rather than
preserved as a second unexplained height bucket.
