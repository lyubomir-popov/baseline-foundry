# Agent Inbox

Machine-generated handoffs, long diagnostics, and cross-repo follow-up notes go here.

Do not use this file for user notes. User-authored async notes belong in `INBOX.md`.

The agent should triage anything durable from this file into `TODO.md`, `ROADMAP.md`, `STATUS.md`, `HISTORY.md`, or `docs/specs.md`, then empty this file back to this header template.

## 2026-04-29 a4-generator follow-up

- `a4-generator` now runs its designer shell on `bf-tier-os` throughout, but there is no exposed preset artifact such as `baseline-foundry/presets/os-tier.css` to import directly.
- The consuming repo currently has to import `baseline-foundry/presets/app-tier.css` only to get the shared BF bundle, then switch the runtime theme class to `bf-tier-os`.
- This is valuable product feedback rather than a local workaround request: BF should expose an OS-tier preset entrypoint, or otherwise expose a neutral preset bundle whose intended use with `bf-tier-os` is explicit.
- Please triage this into the canonical BF planning/state files rather than leaving it stranded here.