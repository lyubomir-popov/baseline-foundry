# Implementation Plan: Spacing System Audit

**Branch**: `feat/017-spacing-system-audit` | **Date**: 2026-08-29 | **Spec**: [spec.md](spec.md)

## Summary

Delete the historical spacing-example batch and its public navigation, retain a
single current spacing chapter, and move durable coverage to real component
routes or hidden browser probes. Build an exhaustive adjacency inventory before
changing component geometry, then audit every relationship across four tiers,
responsive brackets, and direct/class-switched bundles.

## Technical Context

**Stack**: TypeScript, generated CSS, native HTML, Playwright, Node.js 22.14+

**Primary sources**: `src/css.ts`, `src/css-grid.ts`,
`src/css-components.ts`, `src/css-components/*.ts`, `config/tiers/*.json`

**Catalog/runtime**: `demo/page-catalog.js`, `demo/spec/spacing.html`,
`demo/components/*.html`, `demo/patterns/index.html`

**Validation**: `scripts/validate-build.ts`,
`scripts/verify-component-behavior.ts`, component baseline and screenshot QA

## Constitution Check

- Container-owned semantic spacing: PASS; the audit treats metric text
  compensation as geometry rather than semantic space.
- Four first-class tiers: PASS; inventory and verification cover every tier.
- Small composable primitives: PASS; existing stack modifiers remain the
  vocabulary unless evidence proves a missing relationship.
- Demo dogfooding: PASS; diagnostics leave the catalog while real demos remain
  the visible proof.
- Generated outputs: PASS; source changes precede regeneration.
- One active package: PASS; Spec 017 is the sole active package.

## Execution Strategy

1. Remove the debug batch and repair every navigation/test/documentation
   reference.
2. Freeze the route and primitive adjacency inventory before geometry changes.
3. Measure vertical gaps and horizontal keylines on their owning routes.
4. Group findings by shared owner/token, correct source once, and verify direct
   and class-scoped output parity.
5. Run full gates, constrained visual review, and adversarial review.
6. In parallel with the rule/keyline inventory, classify generic primitives,
   structural pattern slots, native semantic elements, and modifiers. Record a
   migration recommendation only after the complete source evidence pass.

## Project Structure

```text
specs/017-spacing-system-audit/
├── spec.md
├── plan.md
├── research.md
├── tasks.md
├── quickstart.md
├── review.md
└── contracts/
    ├── adjacency-inventory.md
    └── composition-naming-audit.md
    └── responsive-split-inventory.md
```

No constitutional exception is required.
