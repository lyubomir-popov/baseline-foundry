# Agent instructions (Baseline Foundry)

Keep this file limited to always-on invariants and cold-start pointers. Live
state, operational detail, queue order, and spec status each have another owner.

## Cold start

Read in this order:

1. [`AGENT-INBOX.md`](AGENT-INBOX.md) for the current task, blockers, and
   last-known-green state.
2. [`docs/agent-index.md`](docs/agent-index.md) for commands, source routing,
   traps, and validation economy.
3. [`docs/specs.md`](docs/specs.md), then only the active package and source
   files named by the task.

| Need | Single owner |
|---|---|
| Always-on invariants | `AGENTS.md` |
| Live state and handover | `AGENT-INBOX.md` |
| Operational how-to | `docs/agent-index.md` |
| Cross-spec order and short backlog | `TODO.md` |
| Spec catalog and status | `docs/specs.md` |
| Human async notes | `INBOX.md` |
| Durable feature intent and evidence | `specs/<id>-<slug>/` |
| Durable architecture decisions | `docs/architecture.md` |

## Product invariants

- Baseline Foundry is design-led internal tooling. Explicit owner decisions and
  local active specs govern it; a Pragma or Canonical official-design-system
  compromise is not automatically a BF requirement.
- Semantic vertical spacing is container-owned in every built-in tier:
  editorial, documentation, app, and OS. Prose text defaults to body-line
  phase (Spec 026, owner ruling 2026-09-30): paragraphs and headings that are
  direct children of `.bf-prose` or of a prose `hgroup` keep their measured
  top nudge, add a metric-derived phase inset and close to whole body lines;
  prose lists are container-owned blocks that carry the body nudge, phase and
  closure once, so every item line advances one body line.
  `.bf-theme.is-baseline-rhythm` restores the baseline-unit ledger for its
  subtree. All other metric-aligned text retains only its measured top nudge
  and complementary bottom-margin compensation; role space-after does not
  drive layout. Nested `bf-stack` containers own direct child gaps, and plain
  and visual-role-classed equivalents must occupy the same baseline-aligned
  box.
- Baseline compensation comes from real font metrics. The cap engine is a demo
  comparison, not a production surface.
- OS is the fourth first-class built-in tier. Density differences are
  intentional; entry points, selectors, public tokens, tests, and docs must be
  support-equivalent across all four tiers.
- Controls follow the Vanilla occupied-block model: symmetric nudge-derived
  padding, no target block size, and trailing compensation that snaps the
  occupied block to the grid.
- Canonical tagged navigation preserves the 2.375rem-by-1.375rem tag, 1rem mark
  box, and fixed 0.375rem mark-to-tag-bottom offset. The mark aligns to the first title
  line rather than the tag centre; the tag attaches to the navigation top and
  must not stretch to the full occupied row.
- `bf-grid`, `bf-stack`, `bf-cluster`, and `bf-section` stay small and
  composable. Default stacks own pattern-internal gaps; explicit section stacks
  own the larger boundary between complete patterns or sections.
- Public styling uses flat `bf-*` classes and `is-*` modifiers. No styled
  `data-*` selectors, `ui-*` roles, `p-*` compatibility layer, BEM API, or
  consumer overrides masquerading as components.
- Non-heading UI is body-sized unless a component exposes a real heading slot.
- Generated files under `dist/` are outputs. Change config or source, then
  rebuild; never hand-edit generated CSS or JSON.
- Demos dogfood BF contracts and include only the minimum local specimen CSS
  required to frame or isolate the component.

## Baseline Foundry and Pragma

- BF is the owner's fast sandbox. Spacing and typography decisions are proven
  here first, then reimplemented in the official Pragma repository; the two
  keep separate goals but implement shared spacing decisions in sync.
- Pragma-targeted planning packages may live in BF. Pragma source code never
  does. Neither repository's measured values are evidence for the other.
- Baseline alignment technique is deliberately different. BF uses only
  metric-based nudges generated from real font files; CSS `1cap` alignment is
  rejected for BF by owner decision (2026-09-30). Pragma uses `1cap` because its
  lead engineer prefers it; that choice stays in Pragma and must not be ported
  back, even when a shared decision (such as body-line phase) is ported.

## Spec workflow

- Load Spec Kit commands/templates only when the user requests spec work.
- Spec-driven work uses one active package under `specs/<id>-<slug>/` and a
  matching `feat/<id>-<slug>` branch.
- Put problem, outcomes, and acceptance in `spec.md`; technical decisions in
  `plan.md`/`research.md`; executable order in `tasks.md`; QA routes in
  `quickstart.md`; closeout evidence in `review.md`.
- Completed packages move to `docs/spec-archive/` after merge. Git is the
  chronological history; do not recreate a global history narrative.
- Preserve unrelated dirty work. Do not switch or rewrite a branch when the
  active package does not match it.

## Validation

Run the smallest relevant check while iterating. Before closeout run:

```powershell
npm test
npm run qa:components
```

Component work also requires browser review of the affected demo states.
