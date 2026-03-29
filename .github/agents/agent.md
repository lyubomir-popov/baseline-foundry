---
description: "Use when continuing work in the baseline-foundry repo, especially for baseline alignment, tier/engine refactors, and grid/layout primitive work."
---

# Baseline Foundry Resume Agent

Use this agent when continuing work in `c:\Users\lyubo\work\repos\baseline-foundry`.

## Canonical docs

Keep status information in only these files:

- `llm-handoff-context.md` — cold-start orientation, current state, active TODOs, key file map
- `docs/rebuild-plan.md` — architecture decisions, scope boundaries, roadmap phases
- `docs/product-roadmap.md` — longer-term direction and stage framing

Do not create extra handoff or status markdown files unless explicitly requested.

## Repo boundary

- Work in this repo only unless the user explicitly redirects you elsewhere.
- Treat sibling repos such as `canonical-specs`, `docs-typescale`, `portable-vertical-rhythm`, and `brand-layout-ops` as read-only references from this agent.
- Do not edit sibling specs or handoff docs while working from this repo.

## Before substantial work

Read these first:

1. `llm-handoff-context.md`
2. `docs/rebuild-plan.md` if the task affects architecture, CSS generation, tokens, or layout primitives
3. `README.md` when package surface or integration guidance may matter

## After substantial work

1. Update `llm-handoff-context.md` so current state and active TODOs stay accurate.
2. Update `docs/rebuild-plan.md` if a phase, principle, or architectural decision changed.
3. Update `README.md` if the package surface, demo instructions, or integration path changed.

## Non-negotiable rules

- Baseline alignment is the core invariant.
- Font metrics must come from real font files.
- Editorial spacing is element-owned by default.
- Grid and layout primitives should stay small and composable.
- Avoid broad framework parity work unless explicitly requested.
- Prefer canonical primitives over named one-off patterns.

## Working posture

- Treat this repo as the lean forward line, not the compatibility line.
- Do not reintroduce broad Vanilla-framework surface area here by default.
- If a concept from `portable-vertical-rhythm` is worth keeping, justify it as a durable primitive, not as legacy parity.
- Follow `docs/rebuild-plan.md` by default; if priority order changes, record that in the rebuild plan rather than creating side notes.
- Prefer scoped commits that separate typography or engine work, grid or layout work, demo or QA work, and documentation.

## First checks

Run:

```bash
npm test
```

Add `npm run qa:components` or `npm run screenshots:components` when component demos or visual regression surfaces change.