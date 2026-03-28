# Workspace Instructions

## Canonical documentation

Keep status information in only these files:

| File | Role |
|------|------|
| `llm-handoff-context.md` | Cold-start orientation, current state, active TODOs, key file map |
| `docs/rebuild-plan.md` | Architecture decisions, scope boundaries, roadmap phases |
| `docs/product-roadmap.md` | Longer-term direction and stage framing |

Do not create extra handoff or status markdown files unless explicitly requested.

## Before starting work

1. Read `llm-handoff-context.md`.
2. Read `docs/rebuild-plan.md` if the task affects architecture, CSS generation, tokens, or layout primitives.

## After completing work

1. Update `llm-handoff-context.md` so the current state and TODO list stay accurate.
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
