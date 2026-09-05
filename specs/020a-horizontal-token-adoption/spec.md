# Spec 020a: Horizontal token adoption

**Feature branch**: `feat/020a-horizontal-token-adoption`

**Date**: 2026-09-05

**Status**: Accepted for direct landing

## Problem

BF contribution 3 consumes the resolved Canonical DTCG spacing artifact but
temporarily preserves seven pre-adoption values in a BF-local compatibility
overlay. BF also still authors several component and surface inline facts as
vertical-baseline multiples or consumes `--bf-space-*` in horizontal spacing
properties. Those two temporary conditions prevent Canonical from being the
effective built-in source and keep the horizontal and vertical axes coupled.

## Outcomes

- Remove the seven-point compatibility overlay. For every built-in tier,
  `spacing` and `canonicalSpacing` are the same authenticated 12-token record.
- Adopt the approved Docs, App and OS action/continuation insets and the App
  mark gap without component-local repairs.
- Add a named `inlineUnitRem` configuration fact. Every built-in tier uses
  `0.25rem`.
- Author component insets, mark/icon gap and surface inline padding as whole
  inline-unit counts; block facts remain baseline-owned.
- Give mark/icon-to-label spacing one named owner and remove horizontal
  spacing dependencies on `--bf-space-*` within the bounded component scope.
- Keep the existing public `--bf-*` names during their deprecation window;
  built-in aliases resolve directly to Canonical properties.

## Boundaries

- 020b owns page margin, grid inline gutter and content inline padding after it
  removes duplicate runtime ownership in `src/css-grid.ts`. They are not
  changed here.
- Vertical rhythm, control height, occupied-block geometry, typography,
  density, root scaling and block-derived inline geometry are unchanged.
- Pragma adoption is postponed by owner direction. This branch does not touch
  Pragma or any downstream repository.
- No publication or release.

## Acceptance

1. The compatibility-overlay file and all production/test overlay branches are
   gone; all 48 effective built-in values equal the integrity-pinned provider
   matrix.
2. The seven changed values match the approved matrix in
   [the contract](contracts/component-horizontal-matrix.md).
3. Built-in config validation rejects missing, fractional, negative or
   non-finite inline units/counts and rejects a continuation inset that cannot
   contain the fixed 1rem disclosure canvas plus mark gap.
4. Component inset, surface-inline and shared mark/icon-gap values are not
   derived from `baselineUnit`, `...BaselineUnits`, `--bf-baseline` or
   `--bf-space-*`.
5. Field inset, surface padding, block spacing, painted/occupied control
   geometry and 020b-owned page/grid facts keep their pre-020a values.
6. Direct tier bundles and class-scoped tier surfaces agree. Custom themes
   remain BF-owned and emit no unnamespaced Canonical properties.
7. Browser evidence covers all four tiers, LTR/RTL, root-font scaling and a
   non-100% zoom context. Continuation copy aligns to the new keyline without
   reducing checkbox/radio target or painted size.
8. `npm test` and `npm run qa:components` pass. An adversarial review request
   records exact evidence before landing.
