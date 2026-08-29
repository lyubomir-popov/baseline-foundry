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
layout, while `bf-rule` names the generic visual rule. Native `hr` now receives
the generic rule paint through the basic selector, so `bf-rule` on that same
element may be a portability marker or redundant authoring. The current public
API does not state which interpretation authors should use.

## User scenarios and acceptance

### P1 — Assemble a ruled pattern correctly

An author can identify the pattern root, its named layout slot, the generic
rule primitive, and any visual modifier without reading implementation CSS.

- A divided section's rule slot determines grid placement only.
- The generic rule contract determines shared paint and highlighted/muted
  variants only.
- A native `hr` retains its semantic separator meaning.

### P2 — Choose minimal, portable markup

An author can decide whether a native `hr` needs `bf-rule`, and can use the
generic primitive on a non-native element only where the documented contract
permits it.

- The decision is based on a published semantic-native policy, not on selector
  coincidence.
- Repeated pattern examples use one documented class order.

### P3 — Migrate safely if evidence requires it

A maintainer can identify every affected public selector, demo, test, and
consumer-facing documentation before changing rule-class markup.

- A migration preserves semantic HTML, baseline geometry, modifier behavior,
  and direct/class-switched tier parity.
- It is promoted as a separate implementation package only if it changes the
  stable authoring contract.

## Initial evidence

| Observed family | Current responsibility | Count | Initial classification |
|---|---|---:|---|
| `bf-basic-section-rule` + `bf-rule` | Grid-spanning slot plus generic rule | 3 | structural + generic primitive |
| `bf-divided-section-rule` + `bf-rule` | Grid-spanning slot plus generic rule | 3 | structural + generic primitive |
| `bf-data-spotlight-rule` + `bf-rule is-highlighted` | Stat-grid row plus emphasized generic rule | 9 | structural + generic primitive + modifier |
| `bf-tab-section-rule` + `bf-rule` | Grid-spanning tab-section slot plus generic rule | 2 | structural + generic primitive |
| `bf-text-spotlight-rule` + `bf-rule` | Grid-spanning title slot plus generic rule | 1 | structural + generic primitive |
| `bf-rich-list-*-rule` + `bf-rule` | Ordered/grid placement plus generic rule | 6 | structural + generic primitive |
| `bf-linked-logo-section-card-rule` | Span with a pattern-owned border keyline | 12 | mixed visual/structural; not an `hr` primitive pairing |
| Tiered-list child `bf-rule` | Parent selector places the generic primitive; no slot class | 20 | placement is implicit in parent/child structure |

## Completed initial classification

| Contract | Source owner | Responsibility | Classification | Evidence |
|---|---|---|---|---|
| `hr, .bf-rule` | `src/css.ts` | Default paint, one-pixel thickness, and trailing border compensation | Generic primitive also applied to semantic native element | All supported demo `bf-rule` uses are `hr` elements |
| `hr.is-highlighted, .bf-rule.is-highlighted` | `src/css.ts` | Emphasized thickness and compensated trailing space | Implemented generic modifier | 9 data-spotlight instances |
| `bf-basic-section-rule`, `bf-divided-section-rule`, `bf-tab-section-rule`, `bf-text-spotlight-rule` | Sites/static-content modules | Grid-span placement only | Structural slots; pairing with the generic rule is conceptually valid | 9 instances across their demos and nested tab content |
| `bf-data-spotlight-rule` | `static-content-ports.ts` | Stat-grid row placement only | Structural slot; highlighted primitive supplies paint | 9 instances |
| `bf-rich-list-rule`, `bf-rich-list-cta-rule` | `sites-rich-lists.ts` | Grid placement and ordering only | Structural slot; current class order varies | 6 instances |
| Tiered-list child `bf-rule` | `tiered-list-equal-height-row.ts` | Placement through the parent/child component structure | No slot needed unless authoring evidence proves one | 20 instances |
| `bf-linked-logo-section-card-rule` | `linked-logo-site-layout.ts` | Border, spacing, and card anatomy | Mixed pattern element, not a generic separator | 12 `span` elements |
| `is-muted` on rules | No rule-specific selector exists | Intended muted variation is not implemented | No-op modifier; migration decision required | 26 demo occurrences: 20 tiered-list, 4 rich-list, 2 text-spotlight |

No non-`hr` usage of `bf-rule` exists in the current supported demos or source.
This makes the native-element policy materially important: it cannot be tested
against a live non-native consumer today.

The current scan therefore has 36 rule-like pattern slots, of which 24 pair a
slot with `bf-rule`. The remaining twelve are card-border spans and must not be
silently conflated with semantic separators.

Tiered list adds an important counterexample: it places a generic `bf-rule`
through a parent/child selector instead of naming a rule slot. The full audit
must decide whether that is a correctly simpler composition or an authoring
consistency departure; it must not assume every placement needs a slot class.

The no-op `is-muted` usages are a separate API hygiene finding. The eventual
decision is either to remove the undocumented modifier from examples and
consumer guidance, or to define an intentional `bf-rule.is-muted` visual
contract with tier evidence. Neither choice should be made by a mechanical
class-order migration.

## Proposed convention to test

1. **Root and slot**: use flat pattern-prefixed names such as
   `bf-divided-section` and `bf-divided-section-rule` for pattern anatomy and
   placement.
2. **Primitive**: use `bf-rule` for a reusable visual rule contract; use
   `is-muted` and `is-highlighted` only for its documented variants.
3. **Semantic native element**: determine whether bare `hr` is the canonical
   generic rule markup or whether `bf-rule` remains an explicit portability
   requirement. Do not decide from a single demo.
4. **Class order**: if multiple classes remain necessary, write structural
   pattern classes first, reusable primitive second, utilities next, and
   `is-*` modifiers last. CSS must not depend on that order.
5. **No extension**: do not use Sass `@extend` or publish inheritance-like
   aliases. Composition uses multiple flat classes; shared values use custom
   properties; selectors target one responsibility at a time.

## Investigation requirements

- Inventory every `bf-*-rule` declaration and every use of `bf-rule`, including
  non-demo source and any supported downstream-facing documentation.
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
- It does not rename `bf-rule` or existing pattern slots during Spec 017.
- A broad authoring-contract change requires a new, separately promoted package
  with downstream consumer evidence and a migration/compatibility decision.

## Completion criteria

- Every rule-like class is classified and linked to its owner module and demo.
- The recommended canonical markup is unambiguous for native and non-native
  rule surfaces.
- The recommendation includes a measured migration scope or explicitly records
  that no migration is justified.
- Any follow-on package has an independently testable API, demo, static checks,
  browser behavior, baseline, and downstream review plan.
