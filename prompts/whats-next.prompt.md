---
description: "Session start: audit docs, implementation drift, build quality, and what's next."
mode: agent
---

# Session start — what's next?

Follow the session-start workflow from `.github/copilot-instructions.md`, then audit the repo enough to choose the best next implementation task.

## 1. Orient from source-of-truth docs

Read the repo instructions and canonical workflow files before touching implementation:

1. `.github/copilot-instructions.md`
2. `.github/agents/agent.md`, if present
3. `STATUS.md`
4. `INBOX.md`
5. `AGENT-INBOX.md`
6. `TODO.md`
7. `ROADMAP.md`
8. `docs/specs.md`
9. `README.md`

Use the source-of-truth precedence in `.github/copilot-instructions.md` when documents disagree.

## 2. Drain inboxes

Triage inbox items before making recommendations:

1. Move durable user notes from `INBOX.md` into `TODO.md` for near-term work or `ROADMAP.md` for longer-term work.
2. Move durable machine-generated notes from `AGENT-INBOX.md` into the appropriate canonical file.
3. Empty both inboxes back to their header templates.

If either inbox contains ambiguous or risky items, report the question instead of guessing.

## 3. Audit drift

Check for meaningful drift between source-of-truth documents and implementation:

1. Verify that documented key paths, commands, exports, demos, and generated artifacts still exist.
2. Compare active TODO and roadmap claims against the current source tree.
3. Check spec-governed behavior against `docs/specs.md` and linked source specs when relevant.
4. Do not rewrite higher-priority docs to match lower-priority implementation drift.

## 4. Assess build quality

Do a lightweight quality pass focused on the next useful action:

1. Inspect recent status/TODO claims for obvious stale, completed, or contradictory work.
2. Review relevant source, tests, and scripts enough to identify reliability, maintainability, architecture, or validation risks.
3. Run `npm test` unless there is a clear reason not to. Add targeted checks such as `npm run qa:components` or `npm run screenshots:components` only when component demos or visual regression surfaces are implicated.
4. Report any commands that could not be run and why.

## 5. Recommend the next task

Choose the best next thing to tackle from `TODO.md` or `ROADMAP.md`, using this priority order:

1. Fix source-of-truth drift that can mislead future sessions.
2. Fix failing tests, broken builds, or validation gaps.
3. Continue the highest-value active TODO item that is unblocked and well-scoped.
4. Pull from the roadmap only when TODO has no clear near-term task.

## Report format

Report back with:

- **Source-of-truth summary** - one or two sentences on the current project state and governing docs.
- **Inbox triage** - what moved, or `none`.
- **Drift findings** - concrete mismatches or `none found`.
- **Build quality** - risks, test results, and any commands skipped.
- **Recommended next task** - the single best next task and why it is the right next move.
- **First steps** - the first concrete implementation steps.
- **Blockers or questions** - only if they affect the recommendation.

Do not start implementation yet. Stop after the audit report and wait for approval.
