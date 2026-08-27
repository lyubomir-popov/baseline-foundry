# Implementation Plan: Hero divider and quiet linked titles

**Branch**: `feat/012-hero-link-contracts` | **Date**: 2026-08-27 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/012-hero-link-contracts/spec.md`

## Summary

Correct the quiet basic-section title link so colour remains an accessible link affordance, and extend the existing BF hero with a default tokenised divider plus a narrow opt-out modifier. Preserve all existing hero spacing and media contracts.

## Technical Context

**Language/Version**: TypeScript-generated CSS, semantic HTML, Node.js 22

**Primary Dependencies**: Existing BF tier tokens and component build pipeline

**Storage**: N/A

**Testing**: Static build assertions, component behavior checks, baseline capture QA

**Target Platform**: Modern browsers across four BF tiers

**Project Type**: Design-system library and demo catalog

**Performance Goals**: No new runtime script or layout dependency

**Constraints**: Flat `bf-*` API, logical properties, no consumer override, generated output only through build

**Scale/Scope**: Two existing public patterns and their four-tier demos/tests

## Constitution Check

- Owner-led authority: pass; both changes are explicit owner direction.
- Element-owned spacing: pass; the border does not replace or alter semantic padding.
- Four-tier parity: pass; selectors consume shared semantic tokens.
- Small earned primitives: pass; one existing modifier name extends an existing pattern.
- Accessible intrinsic composition: pass; link affordance and focus remain explicit.
- Generated evidence: pass; source, build assertions, browser behavior and demo states are included.

Post-design re-check: passed. No consumer-specific selector or spacing override is introduced.

## Project Structure

```text
specs/012-hero-link-contracts/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/markup.md
├── checklists/requirements.md
└── tasks.md

src/css-components/
├── sites-foundation.ts
└── sites-editorial-ports.ts

demo/components/
├── basic-section.html
└── hero.html

scripts/
├── validate-build.ts
└── verify-component-behavior.ts
```

**Structure Decision**: Extend the two existing component owners and their existing shared validation surfaces.
