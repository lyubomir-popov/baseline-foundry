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

## Keyline intuition

A keyline is a named start or continuation relationship, not a rule that every
visible glyph shares one left edge. Page and content text establish the primary
reading keyline. A bullet, checkbox, radio, or disclosure icon may occupy a
leading-mark track before that text. A control or panel begins its own content
after its owned inset. Disclosure panel copy must continue from the disclosure
label after the icon track.

The useful audit question is therefore specific: for example, does prose-list
copy align with the checkbox label where they are intended to share a content
keyline, and does accordion panel copy align with its tab label? It is not
useful to force marks, panel edges, and every text role onto one universal
start. The spacing chapter must instead show the same keyline-bearing
components horizontally and vertically: prose/list, action/control/field,
checkbox/radio/switch, chip/status, tabs/accordion, list tree/side navigation,
table of contents, notification, panel, and table. It must use no local ruler
or diagnostic styling; the existing baseline-grid control is sufficient when
precise baseline inspection is needed.

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
- Which readable default 50/50 patterns still use a breakpoint other than the
  shared 45rem (720px) query-container threshold, and is each difference a
  real non-split/intrinsic exception?
- Which demos contain direct semantic siblings without an explicit stack or
  structured component owner?

## Composition naming investigation

The `bf-divided-section-rule bf-rule` example exposed a second, related audit
question. `bf-divided-section-rule` is a structural slot: it puts the rule in
the spanning grid row of that pattern. `bf-rule` is the generic visual rule
primitive, although the current basic selector also styles a semantic `hr`.
The two classes therefore do not compete, but using both on a native `hr` can
be redundant authoring rather than required composition.

The initial scan found 36 rule-like pattern-slot occurrences. Twenty-four
combine a pattern slot with `bf-rule`; twelve linked-logo card rules are spans
whose own border creates a keyline and are not generic rules. The class order
also varies between pattern-first and primitive-first forms. This is enough
evidence for a full public-API investigation, but not for a broad rename.

The active package now owns the investigation specification in
`contracts/composition-naming-audit.md`. It must establish one author-facing
convention, distinguish portable generic primitives from semantic-native
defaults, and avoid Sass-style selector extension. Public CSS should continue
to use flat classes, structural slots, `is-*` modifiers, and variables for
value variation.

The first complete rule pass also found that all current `bf-rule` instances
are native `hr` elements and that `is-muted` has no rule-specific selector
despite 26 demo occurrences. This is a no-op modifier, not a visual variant.
It is recorded as a follow-on API decision rather than silently treated as
working behavior.

## Owner decision — native rule markup and readable split threshold

Bare semantic `<hr>` is the canonical rule primitive. The theme's basic `hr`
selector already supplies the visual contract, including the trailing
baseline-compensation. A `bf-rule` class on that element adds verbosity and a
second maintenance surface without changing its contract. Pattern slot classes
remain only where a pattern needs structural placement; a highlighted native
rule uses `<hr class="is-highlighted">`. `bf-rule` must not be expanded as an
authoring requirement without a measured non-native use case.

The default readable 50/50 composition threshold is 45rem (720px) of the
pattern's query container. The hero already uses it, whereas the tiered-list
header currently waits for 64.75rem; this is an audit/implementation finding.
Grid-shell, navigation, density, and explicitly asymmetric/intrinsic changes
are not automatically split-layout exceptions, but must state why their
threshold differs.

## Initial removal validation

The Phase 1 slice passes `npm test` and `npm run qa:components`. The rewritten
spacing chapter was reviewed in the browser at the default desktop viewport and
at 560×900 in the OS tier: it has zero inline overflow, three clear content
sections, no deleted-route links, and no “Spacing examples” sidebar group.
