# Quickstart: Semantic spacing-token schema

## Cold start

Read [`README.md`](README.md), then [`evidence-manifest.md`](evidence-manifest.md),
the spec, research, semantic contract, [`recut-handoff.md`](recut-handoff.md),
[`opus-pre-t004d2-scope-review.md`](opus-pre-t004d2-scope-review.md) and tasks.
Do not infer current evidence counts or branch readiness from archived reviews.

Before recut planning, refresh Pragma's upstream ref and compare the recorded
SHA in the handoff. If it moved, update the mainline delta sweep rather than
silently treating the 2026-09-21 inventory as current:

```powershell
Set-Location H:\WSL_dev_projects\pragma
git fetch origin main --prune
git rev-parse origin/main
```

## Evidence worktree

Pragma uses two read-only evidence worktrees and one isolated geometry spike:

```text
Reference UI and component source:
H:\WSL_dev_projects\pragma\.claude\worktrees\feat-bf-shared-alignment

Spec 022 and generated evidence snapshot:
H:\WSL_dev_projects\pragma\.claude\worktrees\fix-root-gates\specs\022-pragma-spacing-adoption

Writable pre-CP1 geometry spike only:
H:\WSL_dev_projects\pragma\.claude\worktrees\feat-bf-inside-out-geometry
base: 313ee82c13a126b779b9bd75902da5af13c28505
```

The snapshot is anchored to the `fix/root-gates` worktree at commit
`9b3c9c41f7f6584eb58e4670ef6be34dc49544e1`, plus its explicitly dirty generated
evidence working state. It is not a portable release artifact. Read the local
source hashes in the capture before attributing a measurement to the reference
UI. Do not add this schema package or Jira material to Pragma.

Do not edit `feat-bf-shared-alignment`; Spec 022 governs its read-only evidence
state until CP1. All T004d–T004g production geometry exploration happens only
in the isolated spike above under FR-050.

For a read-only integrity check:

```powershell
Set-Location H:\WSL_dev_projects\pragma\.claude\worktrees\fix-root-gates\specs\022-pragma-spacing-adoption
node evidence/verify-evidence.cjs
```

These commands are reference-only. Do not run them while Spec 024 T004c0–T004h
is active, because the accepted collectors overwrite their own Spec 022 output
directory. The isolated spike lane is defined in `implementation-handover.md`.
After T004h is dispositioned, reference regeneration may resume only after an
intentional reference-fixture change and while its Storybook is running on port
6114:

```powershell
node evidence/measure-spacing.cjs
node evidence/measure-variants.cjs
node evidence/build-ledger.cjs
node evidence/verify-evidence.cjs
```

The Spec 024 spike instead reuses
`packages/react/ds-global/playwright.spacing.config.ts` on port 6106 with
`PRAGMA_BUTTON_SPACING_OUTPUT` set to the external path recorded in the
handover. It never binds 6114 or 6115.

## Provider source

Read the live design-tokens source before changing the contract:

```text
H:\WSL_dev_projects\design-tokens\packages\tokens\tokens\canonical\
  global\semantic\spacing\base.tokens.json
  global\semantic\modifier\spacing\*.tokens.json
  canonical.resolver.json
```

Confirm that a proposed semantic role is not merely a renamed primitive and
that density representation can expose both runtime members without a public
modifier class.

## Review order

1. Complete and independently review the bounded pre-CP1 geometry spike in
   T004c–T004h.
2. Close Pragma’s current component-inventory denominator, including non-React
   consumers.
3. Produce the final assignments, merge attempts and breakers.
4. Run CP1 taxonomy review.
5. Update the semantic contract to approved names and memberships.
6. Run the isolated density-source representation spike.
7. Run CP2 schema review.
8. Only then cut the design-tokens implementation.

## Jira

WD-36041 is the Jira home. Before publishing:

1. provide Jira credentials to the bridge process;
2. capture the epic, current children and Task metadata;
3. reconcile rather than assume no child exists;
4. prepare and dry-run a saved plan;
5. obtain owner approval; and
6. apply once, verify and resnapshot.

Never copy private Jira snapshots into this repository.
