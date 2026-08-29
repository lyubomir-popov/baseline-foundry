# Review: Spacing System Audit

Status: interim adversarial review after rule-native-markup and shared-split
slice; exhaustive adjacency work remains open.

## Review 1 — rule authoring and semantic API

- **Pass:** Bare `<hr>` now owns the generic separator contract. Pattern rule
  classes only provide structural placement, so `bf-divided-section-rule` is
  not competing with a generic visual class.
- **Pass:** `is-muted` was removed from rule markup because it had no selector;
  `is-highlighted` remains on semantic native rules and has a defined visual
  result.
- **Pass:** No active source or demo relies on `bf-rule`; the basic selector
  keeps the same background, thickness, reset, and trailing compensation.
- **Finding resolved:** The historical `bf-rule` API duplicated native
  semantics and created unnecessary class-pair variation.

## Review 2 — responsive composition

- **Pass:** Hero, basic section, divided section, tiered-list header, rich
  lists, tab section, and linked-logo 50/50 layouts use a 45rem query-container
  threshold.
- **Pass:** Visual inspection at a 760px viewport produced a 697px tiered-list
  allocation that stayed one column; at 800px it allocated 737px and became
  two columns with no overflow. The other reviewed shared-split surfaces also
  had no overflow at their 737–752px expanded allocations.
- **Pass:** 25/75 rails, repeated-card density, navigation, and grid-shell
  transitions remain documented exceptions rather than accidental divergent
  50/50 implementations.

## Review 3 — source and test hygiene

- **Pass:** The generated CSS static gate passes 6,093 checks after the
  source-only changes.
- **Pass:** Existing global card `is-muted` uses were kept intact; only no-op
  rule modifiers were removed.
- **Pass:** The full component behavior suite passed after adding the
  constrained shared-split checks and scoping the rich-list CTA to its 50/50
  layout.
- **Pass:** Component baseline verification and `qa:components` screenshot
  capture completed across the full catalog with zero reported failures.
- **Open:** Full Spec 017 adversarial closeout is not claimed until T005–T016
  are complete.
