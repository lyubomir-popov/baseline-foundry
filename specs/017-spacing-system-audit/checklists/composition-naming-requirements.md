# Requirements Checklist: Composition Naming Investigation

**Purpose**: Validate the scoped investigation specification before source-wide
classification and any public API proposal.
**Created**: 2026-08-29
**Feature**: [composition-naming-audit.md](../contracts/composition-naming-audit.md)

## Scope and evidence

- [x] CHK001 The problem distinguishes generic visual primitives from
  pattern-owned structural slots.
- [x] CHK002 The inventory separates native `hr` rule pairings from non-`hr`
  border/keyline elements.
- [x] CHK003 The current evidence gives counts and source families without
  asserting that all combinations are defects.
- [x] CHK004 The investigation includes the parent-owned tiered-list
  counterexample rather than forcing a slot-class conclusion.

## Public API constraints

- [x] CHK005 The proposal preserves flat `bf-*` classes and `is-*` modifiers.
- [x] CHK006 The proposal rejects BEM, aliases, styled data attributes, and
  Sass-style extension as a public API mechanism.
- [x] CHK007 The native-element policy is explicitly a decision to be made
  after evidence, not an unstated implementation assumption.
- [x] CHK008 The class-order convention is authoring guidance only; selectors
  may not depend on class order.

## Readiness

- [x] CHK009 Requirements identify the source inventory, tier comparison,
  migration scope, and validation evidence needed before a change.
- [x] CHK010 Boundaries prevent a broad rename during the active spacing audit.
- [x] CHK011 Completion criteria are measurable and can determine whether a
  separate implementation package is justified.

## Notes

- This is a research and API-design workstream within active Spec 017. It does
  not activate a second package or authorize a rename.
