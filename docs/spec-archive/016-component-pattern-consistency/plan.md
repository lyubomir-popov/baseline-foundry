# Implementation Plan: Component and Pattern Consistency

**Branch**: `feat/016-component-pattern-consistency` | **Date**: 2026-08-29 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/016-component-pattern-consistency/spec.md`

## Summary

Correct shared navigation/search geometry, replace duplicate micro-heading
styling with canonical H5 composition, retune TOC hierarchy, and apply one
explicit spacing model across bundled patterns. Recompose heroes as a 50/50
title/content grid with full-width media, align quote wrappers to the shared
eight-column grid, and make prose blockquotes plain body text. Source CSS and
demo composition remain authoritative; generated tier outputs are rebuilt and
verified through direct and class-scoped paths.

## Technical Context

**Language/Version**: TypeScript 7, native HTML/CSS, Node.js 22.14+

**Primary Dependencies**: PostCSS, Playwright, `@lyubomir-popov/baseline-nudge-generator`

**Storage**: JSON configuration and generated filesystem artifacts; no runtime persistence

**Testing**: Static TypeScript contract validation, Playwright behavior/baseline geometry, screenshot capture, in-app browser review

**Target Platform**: Standards-based browsers and npm consumers

**Project Type**: Design-system library with an isolated demo catalog

**Performance Goals**: No new runtime dependency and no per-component JavaScript for layout

**Constraints**: Container-owned semantic spacing; metric compensation retained; flat public API; logical CSS; direct/scoped four-tier parity; generated `dist/` never hand-edited

**Scale/Scope**: Three navigation/search families, one catalog, all active pattern demos, two site composition grids, one horizontal-keyline atlas, four tiers

## Constitution Check

- **Owner-led authority**: PASS. This spec records the owner's rendered review
  and intentionally supersedes the rejected TOC hierarchy from Spec 015.
- **Container-owned spacing**: PASS. Existing stack primitives own flush,
  dense, and shallow relationships; text retains only metric compensation.
- **Metric truth**: PASS. No font nudge or occupied control model is replaced;
  search actions are fitted to the real rendered input box.
- **Four first-class tiers**: PASS. Navigation, search, TOC, hero, quote, catalog,
  direct bundles, and class switching are tested across all four tiers.
- **Small earned primitives**: PASS. `bf-stack is-flush` already satisfies the
  heading-pair use case, so no duplicate utility or CSS `@extend` abstraction is
  introduced.
- **Accessible intrinsic composition**: PASS. Semantic headings, blockquotes,
  links, current states, focus, wrapping, container queries, and RTL remain.
- **Generated contracts**: PASS. Source modules and demos change, followed by
  the standard build and validation flow.
- **Lean specification state**: PASS. Spec 016 is the single active package;
  Spec 015 is recorded as merged and superseded where owner review changed its
  TOC decisions.

Post-design re-check: PASS for the first three review phases. The fourth pass
adds one earned relationship modifier (`bf-stack is-metric-flush`), derives
accordion/panel geometry from existing public variables, and changes tier
producer values rather than consumer CSS. No exception is required.

## Project Structure

### Documentation (this feature)

```text
specs/016-component-pattern-consistency/
├── spec.md
├── plan.md
├── research.md
├── tasks.md
├── quickstart.md
├── review.md
└── contracts/
    └── composition.md
```

### Source Code (repository root)

```text
src/css.ts
src/css-components.ts
src/css-components/{legacy-navigation,search-box-and-filter,document-navigation,sites-editorial-ports,linked-logo-site-layout,tab-section,panel,interactive-feedback}.ts
config/tiers/{editorial,documentation,app,os}.json
demo/{page-catalog,page-chrome,tier-reference}.js
demo/tiers/*.html
examples/spacing/horizontal-keylines.{html,css}
demo/components/{index,application-layout,narrow-panel,search-and-filter,table-of-contents,hero,linked-logo-section,quote-wrapper,tab-section,...}.html
demo/patterns/index.html
scripts/{validate-build,verify-component-behavior}.ts
scripts/behavior/ported-component-contracts.ts
scripts/validation/renewal-component-contracts.ts
docs/specs.md
TODO.md
```

**Structure Decision**: Keep public CSS in existing cohesive component modules,
compose spacing in demo/public example markup with the existing stack API, and
extend current validation suites. A small shared tier-reference runtime avoids
four divergent page implementations.

## Complexity Tracking

No constitutional violations require exceptions.
