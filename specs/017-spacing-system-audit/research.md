# Research: Spacing System Audit

## Initial triage

The removed `examples/spacing/` directory contained eleven historical HTML
diagnostics and two local stylesheets. They mixed obsolete owner language,
purpose-built visual rails, counterfactual demonstrations, and one-off example
classes. None was a reusable component or bundled use-case pattern.

Useful coverage survives elsewhere:

- stack density and metric compensation use hidden DOM probes on the typography
  component route;
- panel inset and accordion label/panel alignment have focused browser geometry
  checks on their owning components;
- saved preference and page-chrome clearance checks can use retained grid
  examples;
- all public demos already expose global tier, tone, and baseline controls.

## Current ownership decision

BF has one semantic spacing model. Metric-aligned text keeps a measured start
nudge and complementary end margin so its occupied box lands on the baseline
grid. That is metric geometry, not a semantic choice. A stack, structured row,
panel region, or pattern owns the relationship to siblings.

Therefore the audit records two different quantities without calling them two
spacing modes:

1. metric geometry contributed by the rendered role;
2. semantic separation contributed by the composition owner.

## Catalog decision

Keep component and pattern pages when they teach a public contract or exercise a
supported state. Keep the spacing spec chapter because it explains authoring
rules. Remove pages whose only purpose is to expose measurement rails,
counterfactual spacing engines, or implementation history.

## Open audit questions

- Which component internals use raw length values where an existing public
  spacing token expresses the same relationship?
- Which dense-tier values grow or stop decreasing across the ordered tier
  sequence?
- Which horizontal insets intentionally follow control padding, selection-mark
  geometry, or the active grid gutter, and which are unexplained departures?
- Which responsive rules change spacing at a breakpoint unrelated to the
  owning grid or intrinsic component threshold?
- Which demos contain direct semantic siblings without an explicit stack or
  structured component owner?

## Initial removal validation

The Phase 1 slice passes `npm test` and `npm run qa:components`. The rewritten
spacing chapter was reviewed in the browser at the default desktop viewport and
at 560×900 in the OS tier: it has zero inline overflow, three clear content
sections, no deleted-route links, and no “Spacing examples” sidebar group.
