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
  editorial, documentation, app, and OS. Metric-aligned text retains only its
  measured top nudge and complementary bottom-margin compensation; role
  space-after does not drive layout. Nested `bf-stack` containers own direct
  child gaps, and plain and visual-role-classed equivalents must occupy the
  same baseline-aligned box.
- Baseline compensation comes from real font metrics. The cap engine is a demo
  comparison, not a production surface.
- OS is the fourth first-class built-in tier. Density differences are
  intentional; entry points, selectors, public tokens, tests, and docs must be
  support-equivalent across all four tiers.
- Controls follow the Vanilla occupied-block model: symmetric nudge-derived
  padding, no target block size, and trailing compensation that snaps the
  occupied block to the grid.
- Canonical tagged navigation preserves the 38px-by-22px tag, 16px mark box,
  and fixed 6px mark-to-tag-bottom offset. The mark aligns to the first title
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
