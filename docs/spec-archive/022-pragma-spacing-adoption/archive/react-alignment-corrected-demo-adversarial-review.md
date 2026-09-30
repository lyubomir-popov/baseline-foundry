# Corrected React alignment demo — adversarial review

## Verdict

**GO for the meeting demo and the next implementation wave. NO-GO for claiming
exhaustive React part-level acceptance.** No P0 finding remains.

## Independently reproduced

- Both explicit-light meeting routes render black text on white, with the thin
  pink BF rules enabled and the orange bands disabled.
- The production-part coverage section is closed and visually suppressed by
  default.
- Card Header, Content and Footer use the real `Cards`/grid/subgrid composition.
  Those three parts plus Tile Header and Content each measure a 16px
  outside-edge-to-text inset, and their red/blue guides match the measured
  coordinates.
- Every currently live content/inset witness emits the declared blue coordinate.
  Existing repeated-target minima and unique target indices pass.
- State paint is geometry-neutral within the 1/32px test envelope: Tabs 3px
  active bar, SideNavigation 3px active edge, FileTree 3px selected edge,
  RichChoices 1px selected/focus paint and Tooltip 8px caret.
- Static alignment gates pass 13/13 with 886 assertions. The source partition is
  142 production renderers = 130 included + 12 exclusions. The border gate binds
  all 315 declarations across 62 React CSS paths.

## P1 blockers before lead approval

1. Twenty-one live witness types currently render more than one instance but do
   not yet declare a minimum instance count. Buttons, Chips, Accordion,
   Breadcrumbs, Timeline, GitDiff rows, KeyboardKeys and similar repeated parts
   could collapse to one without failing.
2. Source reconciliation is not part-level completion. Several generic
   `contentSelector: ":scope"` witnesses put red and blue on the same wrapper
   instead of identifying the real padding-owning inner part. Field wrappers,
   Range, Rating, Color and Card/Tile roots are among the remaining
   decompositions.
3. Ten interaction-dependent witnesses remain deferred: ContextualMenu,
   Combobox options, FileUpload rows/actions, the submitted field error and
   SkipLink focus.
4. T082 still needs the required engine, context, direction, wrapping and
   pressure matrix. Current junction evidence is Chromium-focused.
5. The expanded secondary catalog retains the exact T083 contrast queue,
   including the three explicit-light legacy product Buttons. The collapsed
   meeting surface itself is clean.

## Boundary

This review authorizes continued React-only work, not Lit/Svelte parity, merge,
publication or release. Final Opus/lead review remains after T081-T083 close.
