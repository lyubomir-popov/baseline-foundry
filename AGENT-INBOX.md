# Agent Inbox

Machine-generated handoffs, long diagnostics, and cross-repo follow-up notes go here.

Do not use this file for user notes. User-authored async notes belong in `INBOX.md`.

The agent should triage anything durable from this file into `TODO.md`, `ROADMAP.md`, `STATUS.md`, `HISTORY.md`, or `docs/specs.md`, then empty this file back to this header template.

## 2026-04-28 — agent-workflow-kit: model tier routing + orchestrator/subagent rules added

`agent-workflow-kit/.github/copilot-instructions.md` gained a "Model tier routing and subagent orchestration" section (commit pending). It defines the `[H]` / `[S]` / `[L]` / `[X]` tag set, a routing rule of thumb, and rules for orchestrator-vs-subagent execution. This repo's `TODO.md` is already aligned (legend + tags landed in commit `154a0d8`). When the next workflow-refresh sweep happens, mirror any further refinements from the kit's `copilot-instructions.md` into this repo's copy verbatim. No code action required.