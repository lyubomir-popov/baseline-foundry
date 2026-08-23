# Research: element-owned typography selectors

## Finding

`src/css.ts` currently maps each semantic role to two selectors: a plain
zero-specificity element selector such as `:where(.bf-theme) :where(h3)` and a
second selector such as `:where(.bf-theme) .bf-prose h3`. The latter has higher
specificity than `.bf-h6`, so semantic H3 typography wins inside `.bf-prose`
even though the explicit H6 visual-role rule is emitted later.

## Decision

Remove the `.bf-prose`-prefixed entries rather than wrapping them in `:where()`
or increasing visual-role specificity. The plain element rule already supplies
the semantic default. A specificity workaround would preserve duplicate
ownership and leave future ordering/specificity defects possible.

`.bf-prose` remains responsible for prose composition: measure, list rhythm,
blockquote treatment, and rules. It does not own paragraph, heading, or
figcaption typography.

## Prose boundary finding

Removing the higher-specificity prose typography duplicates exposed a latent
cascade change: the later zero-specificity `.bf-prose > :last-child` reset
began overriding plain element margins while visual-role classes continued to
win. That made trailing rhythm depend on whether an otherwise equivalent child
carried `.bf-body` or `.bf-h*`.

**Decision**: remove the last-child reset. BF's element-owned rhythm invariant
requires both plain and classed children to retain their role margin. A prose
container may constrain measure and compose lists, quotations, and rules, but
it does not erase child rhythm.

## Tier-verification finding

Comparing a probe with a reference driven by the same role class can pass while
both still reflect a stale tier. The browser regression therefore waits for a
concrete computed role value after each tier switch, asserts concrete H3/H6
values for that tier, and proves the four measured signatures are distinct.

## Alternatives rejected

- **Zero only the duplicate selector specificity**: fixes the observed cascade
  but retains redundant rules and ambiguous ownership.
- **Increase `.bf-h*` specificity**: starts a specificity escalation and makes
  consumers harder to compose.
- **Patch Diagram Registry**: hides an upstream BF contract defect and creates
  a consumer override.

## Evidence

Diagram Registry's Education split list uses semantic H3 headings carrying
`.bf-h6`. On 2026-08-22 they computed as Editorial H3 (`24px/32px`, weight
`500`) instead of H6 (`16px/24px`, weight `550`). The reciprocal H6-with-H3
case is included so the regression proves role independence rather than one
special downgrade.
