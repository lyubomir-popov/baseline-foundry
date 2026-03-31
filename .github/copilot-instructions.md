# Workspace Instructions

## Documentation structure — 5 files, strict roles

| File | Role | Who writes |
|------|------|-----------|
| `docs/AGENT-INBOX.md` | **Inbox.** User drops notes to avoid interrupting agent. | User writes, agent drains |
| `llm-handoff-context.md` | **Cold start.** Repo orientation, current state, key files, critical invariants. | Agent updates when state changes |
| `docs/TODO.md` | **Active plan.** Principles, architecture, short-term tasks. | Agent updates every session |
| `docs/product-roadmap.md` | **Long-term.** Stages, parity inventory, future directions. | Agent updates rarely |
| `docs/history.md` | **Archive.** Completed work log. | Agent appends when tasks complete |

**No other files should carry TODO lists or duplicated status.** Session-scoped scratch (Copilot `/memories/session/`) is fine for in-progress notes but must not become a parallel tracking system.

### The inbox pattern

`docs/AGENT-INBOX.md` is the user's write-only channel. At session start, the agent must:

1. Read the inbox.
2. Triage each item into `docs/TODO.md` (near-term) or `docs/product-roadmap.md` (longer-term).
3. Empty the file back to its header template.

This lets the user drop thoughts asynchronously without derailing agent work.

### What goes where

| Information | Goes in |
|-------------|---------|
| "What should the next chat do?" | `docs/TODO.md` → Active TODO |
| "Why did we make this architectural decision?" | `docs/TODO.md` → Principles or Architecture |
| "What does the product become long-term?" | `docs/product-roadmap.md` |
| "What's been done?" | `docs/history.md` |
| "Quick scratch notes for this session only" | `/memories/session/` (Copilot memory) |
| "Key file paths and resume pointers" | `/memories/repo/` (Copilot memory) |

## Agent workflow

### Session start

1. Read `llm-handoff-context.md` for orientation.
2. Check `docs/AGENT-INBOX.md` — triage items into plan or roadmap, then empty it.
3. Read `docs/TODO.md` for current tasks.

### During work

- Mark tasks done in `docs/TODO.md` as you complete them.
- Move completed items to `docs/history.md`.

### Session end

1. Update `llm-handoff-context.md` if the current-state paragraph is stale.
2. Update `docs/TODO.md` with any new tasks that emerged.
3. Ensure `docs/AGENT-INBOX.md` is empty.
4. **Do not** create new markdown files to document changes unless explicitly requested.

## Repo boundary

- Work in this repo only unless the user explicitly redirects elsewhere.
- Sibling repos (`canonical-specs`, `docs-typescale`, `portable-vertical-rhythm`, `brand-layout-ops`) are read-only references.

## Commit message discipline

Prefix with the area touched: `css:`, `grid:`, `demo:`, `docs:`, `types:`, `build:`, `test:`. First line under 72 chars.

## Autonomous continuation rule

If the user explicitly says to proceed autonomously, treat that as standing approval to keep executing the plan without stopping for small confirmations.

In that mode:

1. Work through the current plan until you hit a real blocker, not a minor ambiguity.
2. Make small validated checkpoint commits after substantive chunks.
3. Re-read `docs/TODO.md` after major chunks and periodically re-audit alignment.
4. Update the canonical docs as work lands so the next chat can continue cold.
5. Do not stop just to ask whether to continue unless the next best move is genuinely unclear or risky.

## Non-negotiable architecture rules

- Editorial baseline alignment is immutable.
- No `data-*` CSS selectors, no `ui-*` role classes.
- Layout containers own child spacing; text elements don't carry margins inside stacks.
- Demo shell dogfoods `bf-*` and `is-*` only.
- Ubuntu Sans Variable for all tiers; IBM Plex is brand-layout-ops only.
- Font metrics must come from real font files.
- Grid and layout primitives stay small and composable.
- Prefer canonical primitives over named one-off patterns.
- Treat this repo as the lean forward line, not the compatibility line.
- **Control padding follows the Vanilla model** — symmetric `padding-block: nudge − border`, no explicit `block-size`, margin-bottom snaps the block to the grid. No `--bf-control-block-size` var, no `.is-dense` per-control modifier. Density comes from the tier. See `docs/TODO.md` → "Control baseline-grid invariant" for the full explanation.

## First checks

```bash
npm test
```

Add `npm run qa:components` or `npm run screenshots:components` when component demos or visual regression surfaces change.

## How to port this convention to another project

1. Copy this file as `.github/copilot-instructions.md` in the new repo.
2. Create `llm-handoff-context.md` at root with: orientation, current state, key files, invariants.
3. Create `docs/TODO.md` with: principles, architecture, active TODO.
4. Create `docs/product-roadmap.md` with: stages, inventory.
5. Create `docs/history.md` with a completed-work log.
6. Create `docs/AGENT-INBOX.md` as an empty inbox.
7. Delete any other TODO/status/handoff files. One inbox + one cold-start + one plan + one roadmap + one archive is the maximum.

The key insight: every piece of status information lives in exactly one place. If you find yourself writing the same fact in two files, delete one.
