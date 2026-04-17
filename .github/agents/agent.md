---
description: "Use when continuing work in the baseline-foundry repo, especially for baseline alignment, tier/engine refactors, and grid/layout primitive work."
---

# Baseline Foundry Resume Agent

All workspace instructions, documentation conventions, and architecture rules live in `.github/copilot-instructions.md`.

Additional agent-specific guidance:

- Follow `TODO.md` by default; if priority order changes, record that in the plan rather than creating side notes.
- Prefer scoped commits that separate typography/engine work, grid/layout work, demo/QA work, and documentation.
- If a concept from `portable-vertical-rhythm` is worth keeping, justify it as a durable primitive, not as legacy parity.
- Do not reintroduce broad Vanilla-framework surface area here by default.