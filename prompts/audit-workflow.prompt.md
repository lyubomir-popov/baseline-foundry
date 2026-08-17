---
description: "Audit lean workflow owners and Spec Kit state for drift."
mode: agent
---

# Audit workflow files

Check that:

1. `AGENTS.md` contains only invariants and cold-start pointers.
2. `AGENT-INBOX.md` contains only current task, blockers, and last-known-green.
3. `TODO.md` contains only cross-spec order and a short backlog.
4. `docs/agent-index.md` contains only operational guidance.
5. `docs/specs.md` catalog paths/status match active and archived packages.
6. The active branch, spec package, task state, and constitution agree.
7. `INBOX.md` is triaged.
8. README and prompt links resolve and no root `ROADMAP.md`, `STATUS.md`, or
   `HISTORY.md` dependency has returned.

Report a short clean/warning checklist and fix unambiguous drift. Put durable
feature detail in the owning package, not in a global narrative.
