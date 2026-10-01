# Agent inbox

Live state only. Durable history lives in git, `docs/spec-archive/`, and the
active package. Keep this file short; move anything settled to its owner.

## Worktrees and live work (2026-09-30)

| Worktree | Branch | State |
|---|---|---|
| `baseline-foundry` (this checkout) | `main` | Clean, equal to `origin/main` at `v0.2.1` |
| `../baseline-foundry-worktrees/feat-026-body-line-text-phase` | `feat/026-body-line-text-phase` | Spec 026; see [Handover (2026-10-01)](#handover-2026-10-01) |
| `../baseline-foundry-worktrees/feat-025-compact-alignment-grid` | `feat/025-compact-alignment-grid` | All tasks done; closeout edits uncommitted; 6 behind `main` |
| `../baseline-foundry-worktrees/feat-024-semantic-spacing-token-schema` | `feat/024-semantic-spacing-token-schema` | Pragma-targeted planning store run by a separate agent. Do not edit it from BF work |
| `../baseline-foundry-worktrees/wip-bf-typography-cap-metric` | `wip/bf-typography-cap-metric` | Parked, unvalidated BF work recovered from the old 022 checkout |
| `../baseline-foundry-worktrees/feat-020b-page-grid-token-adoption` | `feat/020b-page-grid-token-adoption` | Parked; blocked on a design-tokens page/grid provider |

Execution order is in [`TODO.md`](TODO.md); package status is in
[`docs/specs.md`](docs/specs.md).

## Handover (2026-10-01)

Spec 026, branch `feat/026-body-line-text-phase` in
`../baseline-foundry-worktrees/feat-026-body-line-text-phase`, rebased on
`main` `b58ca08`. Code head `4fe0ddd`; docs on top (latest: this handover
commit).

- **Done:** owner rulings R1–R7 and adversarial fixes F1–F11 (confirmed by
  the owner 2026-10-01, R10). Gates green: `test:build` 29,142 static
  checks, `test:components` 5,442 checks, `test:behavior` green,
  `qa:components` green.
- **Next:** tasks phase “Owner rulings R8–R10 (handover)” in
  [`tasks.md`](specs/026-body-line-text-phase/tasks.md), starting with
  T-R0 – ask the owner to confirm C2 before any R8 code.
- **C1:** never change the Canonical section/strip tokens, tier configs or
  the provider artifact; R8 is private derived properties inside the
  section.
- **C2:** R8 reaches section stacks, page-fill and strip padding only;
  default stack, prose and component gaps stay on the provider value.
- **Safety:** work only in this worktree; metrics only, no `1cap`; never
  edit `config/canonical-spacing.resolved.json`; no push without the owner.
- Release floor `0.3.0` or later. Still open beyond the handover: T031 and
  the rest of T032.

## BF and Pragma

The boundary is in [`AGENTS.md`](AGENTS.md). Spec 022, the first inside-out
Pragma spacing exploration, is archived at
[`docs/spec-archive/022-pragma-spacing-adoption/`](docs/spec-archive/022-pragma-spacing-adoption/).
Its implementation branch was too large to review or merge; Spec 024 owns the
recut. Do not resume 022.

## Cross-repository tokens

The owner-approved governing contract is
[`docs/cross-repo-token-architecture-spec.md`](docs/cross-repo-token-architecture-spec.md).
The final independent sign-off is
[`docs/cross-repo-token-architecture-signoff-review.md`](docs/cross-repo-token-architecture-signoff-review.md);
its required corrections are incorporated. The durable execution sequence is
[`docs/cross-repo-token-architecture-implementation-handoff.md`](docs/cross-repo-token-architecture-implementation-handoff.md).
Design-tokens PRs 1 and 2 and BF contribution 3 (`2289a55`) are landed; 020a
(`299f182`) removed the seven-point compatibility overlay. The other
`docs/cross-repo-token-architecture-*` files are closed review evidence.

Settled policy: `spacing.baseline` is 0.5rem for Site and 0.25rem for
Docs/App/OS; exact line heights are typography-owned dimensions carried by a
Canonical extension because DTCG 2025.10 permits only a numeric multiplier;
Site display is 84px/96px; Site secondary 14px/20px is the only semantic
half-step family and knowingly exits on the half-phase; controls are intrinsic
with no target height.

## Last-known-green

`main` at `8046424` (`v0.2.1`) passes `npm test` on 2026-09-30, including all
component-baseline families and browser behavior. `npm run qa:components` was
not rerun in that check.

## Preserve

- `tmp/chevron-audit/`, `tmp/chevron-harness/`, `tmp/vanilla-main/`, and
  `tmp/repo-health-2026-09-30/` (backup of the old 022 checkout).
- `stash@{0}` holds the same 022 checkout state. Drop it only after the owner
  confirms the archive and WIP branch are sufficient.
- The sibling Vanilla checkout has user changes in `yarn.lock`; do not clean or
  update it.
