# Implementation Plan: Sites Container-Owned Spacing

**Branch**: `feat/012-sites-container-spacing` | **Date**: 2026-08-27 | **Spec**: [spec.md](spec.md)

**Input**: Archived feature specification at
`/docs/spec-archive/013-sites-container-spacing/spec.md`

## Summary

Replace semantic role space-after in generated layout with metric-only top-nudge/bottom-margin compensation, restore `bf-stack` as the semantic vertical-spacing owner, and provide shallow internal plus regular section gaps from existing tier tokens. Migrate representative Sites patterns to nested stacks, amend the governing decision, and prove the result in Baseline Foundry and Diagram Registry.

## Technical Context

**Language/Version**: TypeScript 5.8 generating CSS; semantic HTML demos; Playwright browser assertions

**Primary Dependencies**: Baseline nudge generator, existing BF build/surface pipeline, Vite, Playwright 1.58

**Storage**: N/A

**Testing**: `scripts/validate-build.ts`, `scripts/verify-component-behavior.ts`, component baseline/screenshot QA, Diagram Registry validation and responsive browser audit

**Target Platform**: Modern browsers with CSS Grid, logical properties, custom properties, and container queries

**Project Type**: Generated CSS design-system library with downstream static-site consumer

**Performance Goals**: CSS-only spacing ownership; no runtime JavaScript or additional network work

**Constraints**: Preserve measured font metrics and baseline phase; flat `bf-*`/`is-*` API; no styled data selectors, `!important`, consumer BF overrides, or hand edits to generated `dist/`

**Scale/Scope**: Shared four-tier generated surface, Sites/Editorial pattern migration, representative Diagram Registry route, 360px and 1280px browser widths

## Constitution Check

*GATE: The owner decision requires a constitution amendment before implementation; the amended principles pass after Phase 1 design.*

- **Owner-led design authority**: Pass. The current owner instruction explicitly supersedes the previous BF-local element-owned decision.
- **Container-owned semantic spacing**: Pass after amendment. Elements retain only metric compensation; nested stacks own semantic gaps.
- **Metric truth / four-tier parity**: Pass. The nudge source remains real font metrics, and shared/direct tier behavior receives explicit equality coverage.
- **Small, earned primitives**: Pass. The implementation reuses `bf-stack`, existing layout tokens, and existing pattern roots; only a clear section-gap modifier is restored.
- **Accessible, intrinsic composition**: Pass. DOM order and semantics remain unchanged; layout uses intrinsic grid gaps and logical properties.
- **Generated contracts and public evidence**: Pass. Source/config, generated assertions, real-browser geometry, demos, and downstream evidence are all in scope.
- **Lean specification-owned state**: Pass. Spec 013 owns the decision, migration, tasks, QA route, and review evidence.

Post-design re-check: passed. The contract introduces no child-query selectors, compatibility API, new spacing token, or consumer override.

## Project Structure

### Documentation (this feature)

```text
docs/spec-archive/013-sites-container-spacing/
├── checklists/requirements.md
├── contracts/spacing.md
├── data-model.md
├── plan.md
├── quickstart.md
├── research.md
├── review.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
AGENTS.md
.specify/memory/constitution.md
docs/
├── agent-index.md
├── architecture.md
├── spacing-ownership-peer-review.md
└── specs.md

src/
├── css.ts
├── css-components.ts
└── css-components/
    ├── sites-editorial-ports.ts
    ├── sites-foundation.ts
    └── tiered-list-equal-height-row.ts

demo/components/
├── basic-section.html
├── hero.html
└── tiered-list.html

scripts/
├── validate-build.ts
└── verify-component-behavior.ts

../diagram-registry/       # isolated downstream feature worktree
```

**Structure Decision**: Keep spacing generation in `src/css.ts`, retain focused Sites pattern ownership in the existing modules, update only representative demos, and use a clean downstream worktree so Diagram Registry's dirty main checkout is preserved.

## Complexity Tracking

No amended-constitution violations require justification.
