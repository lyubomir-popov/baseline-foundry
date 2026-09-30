# Agent inbox

Live state only. Durable history lives in git, `docs/spec-archive/`, and the
active package. Keep this file short; move anything settled to its owner.

## Worktrees and live work (2026-09-30)

| Worktree | Branch | State |
|---|---|---|
| `baseline-foundry` (this checkout) | `main` | Clean, equal to `origin/main` at `v0.2.1` |
| `../baseline-foundry-worktrees/feat-026-body-line-text-phase` | `feat/026-body-line-text-phase` | Spec 026 CP-B done under owner rulings R1–R5 (2026-09-30): body-line rhythm is the default, `.is-baseline-rhythm` opts out, list blocks and hgroup join landed. Open: D4 gaps (T024–T026), dark-tone review (T022), T023, T031, rest of T032. Rebased on `main` `b58ca08` |
| `../baseline-foundry-worktrees/feat-025-compact-alignment-grid` | `feat/025-compact-alignment-grid` | All tasks done; closeout edits uncommitted; 6 behind `main` |
| `../baseline-foundry-worktrees/feat-024-semantic-spacing-token-schema` | `feat/024-semantic-spacing-token-schema` | Pragma-targeted planning store run by a separate agent. Do not edit it from BF work |
| `../baseline-foundry-worktrees/wip-bf-typography-cap-metric` | `wip/bf-typography-cap-metric` | Parked, unvalidated BF work recovered from the old 022 checkout |
| `../baseline-foundry-worktrees/feat-020b-page-grid-token-adoption` | `feat/020b-page-grid-token-adoption` | Parked; blocked on a design-tokens page/grid provider |

Execution order is in [`TODO.md`](TODO.md); package status is in
[`docs/specs.md`](docs/specs.md).

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
