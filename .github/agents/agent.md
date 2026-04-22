---
description: "Use when continuing work in the baseline-foundry repo, especially for baseline alignment, tier/engine refactors, and grid/layout primitive work."
---

# Baseline Foundry Resume Agent

Use this agent when continuing work in `baseline-foundry`.

## What belongs here

- A short repo-specific resume prompt for future agents.
- The first files to read in this repo.
- Brief continuation hints about the most important work surfaces.
- Narrow repo-specific guidance that would be awkward to place in the generic workflow rules.

Keep this file short enough that reading it at session start is cheap.

## What does not belong here

- Stable workflow rules that apply repo-wide. Those belong in `.github/copilot-instructions.md`.
- Current state, progress notes, or cold-start facts. Those belong in `STATUS.md`.
- Active tasks, decision notes, or architecture notes. Those belong in `TODO.md`.
- Long-term direction. That belongs in `ROADMAP.md`.
- Source-of-truth references. Those belong in `docs/specs.md`.
- User-facing overview text. That belongs in `README.md`.
- Long agent handoffs or diagnostics. Those belong in `AGENT-INBOX.md`.

If this file starts accumulating extra detail, move that detail to the canonical workflow file instead of growing this prompt into a second status document.

## Canonical discipline

- Treat `.github/copilot-instructions.md` as the source of truth for workflow rules and architecture boundaries.
- Keep `.github/agents/agent.md` focused on resume guidance only.
- Keep status in the canonical workflow files: `STATUS.md`, `TODO.md`, `ROADMAP.md`, `HISTORY.md`, `INBOX.md`, `AGENT-INBOX.md`, and `docs/specs.md`.
- Do not create parallel TODO, handoff, or status files.
- Update `STATUS.md` when the current state changes.
- Update `TODO.md` when active work or architecture notes change.
- Move completed items to `HISTORY.md`.
- Update `ROADMAP.md` only when long-term direction changes.
- Drain `INBOX.md` and `AGENT-INBOX.md` at session start.
- Put long machine-generated notes in `AGENT-INBOX.md`, not in this file.

## Working stance

- Follow `TODO.md` by default; if priority order changes, record that in the plan rather than creating side notes.
- Prefer scoped commits that separate typography/engine work, grid/layout work, demo/QA work, and documentation.
- If a concept from `portable-vertical-rhythm` is worth keeping, justify it as a durable primitive, not as legacy parity.
- Do not reintroduce broad Vanilla-framework surface area here by default.