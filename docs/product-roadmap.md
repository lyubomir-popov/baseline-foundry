# Product Roadmap

## Purpose

This repo provides a **minimal testing surface** for evaluating the canonical typography, spacing, and grid specs. The output is spec examples, screenshots, and edge-case isolation — not a finished design-system site.

## Stage 1 (complete)

Lean baseline engine:

- Ubuntu Sans Variable metric source (all tiers)
- editorial typescale
- prose spacing
- baseline overlay

## Stage 2 (complete)

Layout foundation:

- section and strip rhythm (`bf-section`, `bf-section.is-shallow`, `bf-section.is-deep`)
- stack and cluster primitives (`bf-stack`, `bf-cluster`)
- container-query grid (`bf-grid`, 4/8/16 model)
- page primitive (`bf-page`)

## Stage 3

Spec-driven component surface:

- all non-deprecated Vanilla components ported as minimal `bf-*` demos
- each demo uses minimal lorem ipsum content — no explanatory prose
- purpose is edge-case isolation for spec evaluation and screenshot capture
- clean font swapping is a product promise (Ubuntu default; IBM Plex for brand-ops tier)

## Stage 4

Consumer hardening:

- clearer token semantics
- stronger validation
- canonical documentation for authors

## Stage 5

Optional extensions only if justified:

- brand-specific preset lines (IBM Plex tier for brand-layout-ops)
- React primitives for the layout/typography foundation
- additional composed patterns built from the core primitives

## Non-negotiable rules

- Only `is-*` class modifiers for visual states and variants. No CSS on `data-*` attributes.
- Only `bf-grid`, `bf-stack`, `bf-cluster`, `bf-section` (with `is-shallow`/`is-deep`) for page structure.
- No `ui-*` role classes — component typography uses body/heading tier tokens directly.
- Delete ruthlessly anything that does not serve the spec-evaluation purpose.
