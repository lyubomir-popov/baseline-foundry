# Implementation plan: element-owned typography selectors

**Branch**: `feat/002-element-owned-typography` | **Date**: 2026-08-22 | **Spec**: [`spec.md`](spec.md)

## Summary

Collapse semantic typography emission to one zero-specificity element selector
per role, leaving visual-role classes as the explicit override path and
`.bf-prose` as composition only. Preserve the explicit prose flow boundary with
class-level specificity so it trims final semantic margin equally for plain
and classed roles without removing metric padding.

## Technical context

**Language/version**: TypeScript 5.8, generated CSS, HTML, Playwright.

**Primary dependencies**: existing BF generator and Playwright harness; no new
runtime or development dependency.

**Storage**: generated artifacts under `dist/`; no application data.

**Testing**: `scripts/validate-build.ts`,
`scripts/verify-component-behavior.ts`, component baseline and screenshot QA.

**Target platform**: modern browsers consuming BF tier/preset CSS.

**Project type**: design-system library plus static demos.

**Constraints**: element-owned typography and spacing; generated outputs only;
all four tiers equivalent; preserve unrelated dirty work; no consumer override.

## Constitution check

- **Owner-led design authority**: Pass. The user explicitly rejected prose-
  prefixed duplicate typography.
- **Element-owned semantic spacing**: Pass. The repair restores the element as
  the single semantic typography owner.
- **Four first-class tiers**: Pass. Static and browser assertions cover all four.
- **Small, earned primitives**: Pass. No public class is added.
- **Generated contracts**: Pass. Source changes rebuild `dist/` and validation
  inspects generated bundles.
- **Lean specification-owned state**: Pass. Acceptance and evidence live in
  this active package; global files contain only catalog/order/orientation.

## Project structure

```text
src/css.ts                                      # selector emission owner
scripts/validate-build.ts                       # generated selector regression
scripts/verify-component-behavior.ts            # reciprocal four-tier probe
demo/components/typography.html                 # rendered review surface
dist/                                           # rebuilt generated output
specs/002-element-owned-typography/              # intent and evidence
```

## Delivery order

1. Record the consumer failure and selector-ownership decision.
2. Add static and browser regressions that fail on the current output.
3. Remove prose-prefixed entries from `SEMANTIC_SELECTORS_BY_ROLE`.
4. Score the prose last-child boundary at one class and emit it after role and
   prose-flow rules so plain and classed children trim equally.
5. Prove paragraphs, headings, lists, and blockquotes keep their metric box and
   both downstream grid edges in all four tiers.
6. Rebuild and run focused build/behavior validation with config-derived tier
   expectations and concrete tier waits.
7. Run `npm test`, `npm run qa:components`, and four-tier rendered review.
8. Record evidence and request fresh adversarial review in `AGENT-INBOX.md`.

## Complexity tracking

No constitutional exception or new abstraction is required.
