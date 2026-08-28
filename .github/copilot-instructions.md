# Workspace instructions

Primary repository instructions live in [`AGENTS.md`](../AGENTS.md).

Use `AGENTS.md` for always-on invariants and cold-start pointers,
[`AGENT-INBOX.md`](../AGENT-INBOX.md) for live state,
[`docs/agent-index.md`](../docs/agent-index.md) for operational guidance, and
[`docs/specs.md`](../docs/specs.md) for active package status. Do not duplicate
their content here.

<!-- SPECKIT START -->
Load `.github/agents/speckit.*`, `.github/prompts/speckit.*`, `.specify/`, and an
active package's planning artifacts only when the user explicitly requests spec
or Spec Kit work. Normal small fixes read the task-scoped source and the lean
owners named by `AGENTS.md`.

No Spec Kit package is active. Start from `docs/specs.md` before promoting any
candidate.
<!-- SPECKIT END -->
