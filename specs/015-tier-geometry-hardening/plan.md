# Implementation Plan: Tier Geometry Hardening

**Branch**: `feat/015-tier-geometry-hardening` | **Date**: 2026-08-28 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/015-tier-geometry-hardening/spec.md`

## Summary

Replace the accidental `90/96/90/67.5rem` content-cap sequence with a
documented non-increasing `90/80/60/60rem` progression, while keeping App
`.bf-page` and its application grid fluid. Remove semantic half-space padding
from TOC and confirmed adjacent in-page-navigation text links, move that rhythm
to their list/item containers, and position divided-list rules in the final
half-rem before the content they introduce. Config/source remain authoritative;
the build regenerates all distributable tier surfaces.

## Technical Context

**Language/Version**: TypeScript 7 on Node.js 22.14+; generated CSS and JSON  
**Primary Dependencies**: `@lyubomir-popov/baseline-nudge-generator`, PostCSS, Playwright  
**Storage**: JSON tier configuration and generated filesystem artifacts; no runtime persistence  
**Testing**: static TypeScript validation, Playwright behavior/baseline geometry, screenshot capture  
**Target Platform**: standards-based browsers and npm consumers  
**Project Type**: design-system library and isolated HTML demo catalog  
**Performance Goals**: no runtime JavaScript or additional selector family for these CSS changes  
**Constraints**: generated `dist/` files are never hand-edited; App page/grid stays fluid; all directional CSS is logical; four-tier direct/scoped parity is exact  
**Scale/Scope**: four tier configs, two navigation families, one divided-list pattern, their demos and validation contracts

## Constitution Check

- **Owner-led authority**: PASS. The local active spec records the owner's cap,
  padding, and divider decisions. Canonical grid material is derivation evidence,
  not an automatic requirement.
- **Container-owned spacing**: PASS. Semantic link rhythm moves from links to
  lists/items; links retain only metric start/end compensation.
- **Metric truth**: PASS. Existing generated Ubuntu Sans nudges remain the source
  of link padding; no arbitrary text offset is introduced.
- **Four first-class tiers**: PASS. Config, direct bundles, shared class switching,
  demos, static tests, and browser geometry cover all four tiers.
- **Small earned primitives**: PASS. Existing classes are corrected. A generic
  split-pane primitive remains deferred because the Registry evidence is still
  one product family rather than an independent second consumer.
- **Accessible intrinsic composition**: PASS. Existing semantic links, current
  state, focus outline, wrapping, container queries, and logical RTL indentation
  are preserved and measured.
- **Generated contracts**: PASS. Config/source are changed, then standard build
  commands regenerate outputs.
- **Lean specification state**: PASS. This is the only active package and its
  durable evidence stays here.

Post-design re-check: PASS. The geometry contract adds no new public primitive,
compatibility layer, physical directional property, styled data selector, or
consumer override.

## Project Structure

### Documentation (this feature)

```text
specs/015-tier-geometry-hardening/
├── spec.md
├── plan.md
├── research.md
├── tasks.md
├── quickstart.md
├── review.md
└── contracts/
    └── geometry.md
```

### Source Code (repository root)

```text
config/tiers/{editorial,documentation,app,os}.json
src/css-components/document-navigation.ts
src/css-components/static-content-ports.ts
scripts/validate-build.ts
scripts/validation/renewal-component-contracts.ts
scripts/behavior/ported-component-contracts.ts
scripts/verify-component-behavior.ts
demo/components/{layout,table-of-contents,in-page-navigation,divided-section}.html
README.md
docs/{architecture,specs}.md
```

**Structure Decision**: Keep tier values in existing JSON owners and cohesive
component CSS in the two existing focused modules. Extend current static and
browser suites rather than introduce a feature-local test runner.

## Complexity Tracking

No constitutional violations require exceptions.
