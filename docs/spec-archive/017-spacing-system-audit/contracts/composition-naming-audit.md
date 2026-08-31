# Investigation Specification: Composition Naming and Rule Roles

**Parent package**: [Spec 017 spacing-system audit](../spec.md)  
**Status**: Active investigation; no public-API migration authorised  
**Created**: 2026-08-29

## Problem

A rule can have two independent responsibilities:

1. a reusable visual primitive that draws a standard, muted, or highlighted
   keyline; and
2. a structural slot that places that keyline in a pattern grid or sequence.

For example, `bf-divided-section-rule` places a rule in the divided-section
layout, while native `hr` receives its generic visual contract through the
basic selector. A generic class on that same native element would duplicate
the contract rather than make the composition clearer.

## User scenarios and acceptance

### P1 — Assemble a ruled pattern correctly

An author can identify the pattern root, its named layout slot, the generic
rule primitive, and any visual modifier without reading implementation CSS.

- A divided section's rule slot determines grid placement only.
- The generic rule contract determines shared paint and highlighted/muted
  variants only.
- A native `hr` retains its semantic separator meaning.

### P2 — Choose minimal, portable markup

An author can choose the minimal semantic native element and add only the
pattern slot that changes its placement.

- The decision is based on a published semantic-native policy, not on selector
  coincidence.
- Repeated pattern examples use one documented class order.

### P3 — Migrate safely if evidence requires it

A maintainer can identify every affected public selector, demo, test, and
consumer-facing documentation before changing rule-class markup.

- The migration preserves semantic HTML, baseline geometry, modifier behavior,
  and direct/class-switched tier parity.

## Initial evidence

| Observed family | Current responsibility | Count | Initial classification |
|---|---|---:|---|
| `bf-basic-section-rule` + `hr` | Grid-spanning slot plus native rule | 3 | structural + semantic native element |
| `bf-divided-section-rule` + `hr` | Grid-spanning slot plus native rule | 3 | structural + semantic native element |
| `bf-data-spotlight-rule` + `hr.is-highlighted` | Stat-grid row plus emphasized native rule | 9 | structural + semantic native element + modifier |
| `bf-tab-section-rule` + `hr` | Grid-spanning tab-section slot plus native rule | 2 | structural + semantic native element |
| `bf-text-spotlight-rule` + `hr` | Grid-spanning title slot plus native rule | 1 | structural + semantic native element |
| `bf-rich-list-*-rule` + `hr` | Ordered/grid placement plus native rule | 6 | structural + semantic native element |
| `bf-linked-logo-section-card-rule` | Span with a pattern-owned border keyline | 12 | mixed visual/structural; not an `hr` primitive pairing |
| Tiered-list child `hr` | Parent selector places the native rule; no slot class | 20 | placement is implicit in parent/child structure |

## Completed initial classification

| Contract | Source owner | Responsibility | Classification | Evidence |
|---|---|---|---|---|
| `hr` | `src/css.ts` | Default paint, one-pixel thickness, and trailing border compensation | Semantic native generic rule | All supported demo rules are native `hr` elements |
| `hr.is-highlighted` | `src/css.ts` | Emphasized thickness and compensated trailing space | Implemented native-rule modifier | 9 data-spotlight instances |
| `bf-basic-section-rule`, `bf-divided-section-rule`, `bf-tab-section-rule`, `bf-text-spotlight-rule` | Sites/static-content modules | Grid-span placement only | Structural slots; pairing with the generic rule is conceptually valid | 9 instances across their demos and nested tab content |
| `bf-data-spotlight-rule` | `static-content-ports.ts` | Stat-grid row placement only | Structural slot; highlighted primitive supplies paint | 9 instances |
| `bf-rich-list-rule`, `bf-rich-list-cta-rule` | `sites-rich-lists.ts` | Grid placement and ordering only | Structural slot; current class order varies | 6 instances |
| Tiered-list child `hr` | `tiered-list-equal-height-row.ts` | Placement through the parent/child component structure | No slot needed; parent structure is sufficient | 20 instances |
| `bf-linked-logo-section-card-rule` | `linked-logo-site-layout.ts` | Border, spacing, and card anatomy | Mixed pattern element, not a generic separator | 12 `span` elements |
| Historical `is-muted` on rules | No rule-specific selector existed | Intended muted variation was not implemented | Removed no-op modifier | 26 former demo occurrences |

No non-`hr` generic-rule use case exists in the current supported demos or
source. A non-native surface requires a separate semantic and accessibility
case before any class is introduced.

The current scan therefore has 36 rule-like pattern slots, of which 24 pair a
slot with native `hr`. The remaining twelve are card-border spans and must not
be silently conflated with semantic separators.

Tiered list adds an important counterexample: it places native `hr` through a
parent/child selector instead of naming a rule slot. This is correctly simpler
composition; not every placement needs a slot class.

The no-op `is-muted` usages were removed from rules. No muted native-rule
variant is documented because the default rule is already the quiet separator.

## Proposed convention to test

1. **Root and slot**: use flat pattern-prefixed names such as
   `bf-divided-section` and `bf-divided-section-rule` for pattern anatomy and
   placement.
2. **Primitive**: bare semantic `<hr>` is the canonical generic rule markup.
   It receives the generic visual contract through the basic selector; use
   `is-highlighted` only for its documented native-rule variant. Do not add
   `bf-rule` to a native rule merely to restate that default.
3. **Non-native rule surfaces**: no supported use case currently proves one.
   Do not add a generic class until that semantic exception and its
   accessibility contract are measured.
4. **Class order**: if multiple classes remain necessary, write structural
   pattern classes first, reusable primitive second, utilities next, and
   `is-*` modifiers last. CSS must not depend on that order.
5. **No extension**: do not use Sass `@extend` or publish inheritance-like
   aliases. Composition uses multiple flat classes; shared values use custom
   properties; selectors target one responsibility at a time.

## Investigation requirements

- Inventory every `bf-*-rule` declaration and every historical generic-rule
  use, including non-demo source and any supported downstream-facing
  documentation.
- Record whether each slot owns only placement, visual paint, spacing, or more
  than one responsibility.
- Compare native `hr`, classed `hr`, and any non-`hr` rule-like elements across
  all four tiers and responsive states.
- Identify where a generic primitive is needed for portability versus where it
  duplicates a basic selector.
- Check class-order consistency and whether CSS selectors accidentally depend
  on co-occurrence of a slot and primitive.
- Identify migration cost before changing public markup or selector ownership.

## Boundaries

- This investigation does not introduce BEM, `p-*`, `ui-*`, compatibility
  aliases, styled data attributes, or Sass extension.
- The approved native-rule cleanup does not rename pattern slots. A future
  non-native rule API requires downstream consumer evidence and a migration
  decision.

## Completion criteria

- Every rule-like class is classified and linked to its owner module and demo.
- The recommended canonical markup is unambiguous for native and non-native
  rule surfaces.
- The recommendation includes a measured migration scope or explicitly records
  that no migration is justified.
- Any follow-on package has an independently testable API, demo, static checks,
  browser behavior, baseline, and downstream review plan.
