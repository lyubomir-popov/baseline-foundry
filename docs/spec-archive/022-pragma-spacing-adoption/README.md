# Spec 022 — resume here

This is the canonical cold-start entry point for the React spacing-taxonomy
spike. Read this file first, then [`spec.md`](spec.md), [`plan.md`](plan.md), and
the current section of [`tasks.md`](tasks.md). Do not reconstruct status from
the archive or from old review documents.

## Objective

Find the **absolute minimum number of horizontal and vertical semantic spacing
categories, but not fewer**, across every reusable React spacing owner. Generate
`semantic-spacing-tokens.css` only after the completely measured and minimised
taxonomy passes CP1.

The axes are independent. A part may use different contracts on its start and
end edges, and may also own a gap or marker canvas. Aggregate workflows such as
a login form are excluded when they only compose already inventoried parts.

## Current state — 2026-09-21

The 178-ID catalog denominator is reconciled and its measured evidence is
current. The full part/state denominator is **not frozen**: 56 source owners / 95
spacing facts still await isolated fixtures, and 20 stateful targets still
await safe activation. The pages route all declared work, but this is not
fixture closure or CP1 readiness.

| Item | Current fact |
|---|---|
| Source inventory | 145 rows: 142 production render sources and 3 story-only rows |
| Catalog evidence | 178 catalog IDs × Site/Docs/App = 534 observations |
| Declared relationships | 536 total: 524 observed and 12 in four source-only boundaries |
| Review-page routing | 456 bucket routes; 180 horizontal and 186 vertical unique measurement targets |
| Stateful targets awaiting safe activation | 20 targets, pending minimal instance-safe fixtures |
| Source owners awaiting isolated fixtures | 56 owners / 95 measured and bucket-routed spacing facts without isolated visual targets |
| Current horizontal candidates | Field, Command, Marker, Continuation keyline, Surface/container |
| Current vertical candidates | Regular/control-row, Compact separation, Surface/container inset |
| Final assignments | None. Every `categoryAssignment` is deliberately `null` |
| Semantic token file | Does not exist and must not be generated before CP1 |
| Evidence verifier | Strict pass for the current 536-entry ledger: `evidenceComplete: true`, no missing or broken evidence references, `semanticApproval: false` |

Review/disposition lanes—Intrinsic gap, Unresolved, Legacy backlog and
Boundary—are not additional token categories.

### Token source and output contract

Pragma already consumes `@canonical/design-tokens` 0.9.0. Its spacing source is
DTCG 2025.10 JSON under `tokens/canonical/global/semantic/spacing` plus product
overrides under `global/semantic/modifier/spacing/{sites,docs,apps}.tokens.json`.
Terrazzo generates `dist/modifiers.spacing.css`; Pragma imports that output from
`packages/styles/main/src/tokens.css`.

The current provider contains useful candidate names (`field`, `action`,
`continuation`, `surface`, and several gaps), but it predates this minimisation
pass and is not the approved result. T009 must produce a DTCG source patch and
its generated CSS review artifact. Do not add a separately hand-maintained CSS
source in Pragma, and do not change final values or names before CP1.

### Plain-language evidence terms

- **Measurement target**: one rendered DOM part whose spacing is measured. A
  component may contribute several targets, and one target may appear on both
  axis pages.
- **Bucket route**: an instruction to show a measurement target in one candidate
  comparison bucket. It is not a final token assignment.
- **Source owner awaiting an isolated fixture**: a CSS selector/property that
  owns spacing and has measured evidence, but does not yet have its own safe,
  human-auditable page specimen.
- **Stateful target awaiting safe activation**: a target that needs an open,
  focused, selected, preview, submitted, or similar state that the shared page
  cannot yet activate without affecting another specimen.
- **Ledger spacing fact**: one declared owner/property relationship joined to
  its evidence. "No missing or broken evidence references" means the data graph
  is internally complete; it does not mean the taxonomy is complete or approved.

## Worktree roles

| Worktree | Role | Editing rule |
|---|---|---|
| `H:\WSL_dev_projects\pragma\.claude\worktrees\feat-bf-shared-alignment` | Broad reference implementation, Storybook audit pages, fixture catalogs and their tests | Read-only for every file while Spec 024 T004c0–T004h runs. Do not treat it as a mergeable PR. |
| `H:\WSL_dev_projects\pragma\.claude\worktrees\fix-root-gates` | Spec 022, generated evidence and review dispositions | Edit the spec/evidence here. Do not measure this worktree's component CSS. |
| `H:\WSL_dev_projects\pragma\.claude\worktrees\feat-bf-inside-out-geometry` | Snapshot-derived, non-mergeable Spec 024 pre-CP1 evidence spike | Geometry exploration only under Spec 024's handover. Never overwrite the reference evidence, push, PR or merge it. |
| `H:\WSL_dev_projects\pragma` | Main checkout | Leave untouched; do not switch its branch. |

Do not merge, push, publish or release from this spike.

Several `feat/pragma-*` worktrees already exist from an earlier attempted
production re-cut. Treat them as partial historical experiments: do not resume,
merge, or mark T010–T025 complete from their presence. Re-evaluate them only
after CP1 fixes the taxonomy and T009 generates the reviewed token file.

## What just changed

- The horizontal and vertical pages now select semantic review buckets rather
  than appending a separate source-family atlas.
- Each selected bucket proves the exact requested witness set, zero missing
  witnesses and exactly one mounted copy of every derived specimen.
- The Card-header baseline defect was traced to collapsing audit-wrapper
  margins. Grid containment fixed the comparison phase; production Card CSS
  was not changed.
- The audit surface uses `--spacing-inset-surface-block` and
  `--spacing-inset-surface-inline`; no viewport-width padding remains.
- Card, Tile and Accordion panel parts are outside Regular. Accordion is now
  explicit composition rather than a symmetric surface: panel text starts on
  the header-label Continuation keyline and its trailing edge keeps the Surface
  inset. Focused browser proof passes across all three tiers, both root sizes
  and LTR/RTL; the generated evidence snapshot and strict ledger are refreshed.
- The table-cell specimen is explicitly a regular Chip and is labelled as a
  failing tight-host fit test. The private caller-supplied `.is-nested` class is
  not treated as a public component or host contract.
- The 56 remaining extra owners are visible as deferred, typed denominator records.
  They are not fake `alignment-*` witnesses and do not claim fixture closure.
- The SideNavigation group header is the first promoted extra owner: two real
  headers now prove Continuation + Field horizontally and Control-row
  vertically while preserving the exact source relationship identities.
- Two real standalone Card headers now distinguish a Surface/container end
  inset from the joined zero seam. The obsolete DOM-mutation evidence was
  removed. Their real `h4` text exposes unresolved baseline-phase debt in every
  tier/root pair; App also separates joined and standalone phases. Exact debt
  snapshots now prevent edge classification from concealing that defect.

The latest adversarial corrections are recorded in [`tasks.md`](tasks.md): the
SideNavigation group header uses both Continuation and Field horizontally;
GitDiff row-margin behavior stays unresolved/mismatch; Switch and navigation
row dependencies remain visible.

## Resume decision

**Do not request CP1 from Claude Opus yet. Spec 022 fixture closure is paused
while Spec 024 T004c0–T004h runs in the isolated spike.** The completed pre-CP1
Opus review was useful and is already dispositioned, but the mandatory CP1
packet explicitly requires no provisional rows and real aligned specimens for
every positive owner.

R1 (the repeated SideNavigation group header) and R2 (standalone Card-header
ends) are complete and passed ordinary adversarial review after their proof
corrections. R3, the Accordion root-gap fixture promotion, remains the next
Spec 022 batch but MUST NOT resume until T004h is dispositioned and an explicit
handoff releases `feat-bf-shared-alignment`. Its exact batch and acceptance
checks remain under “Current resumption sequence” in [`tasks.md`](tasks.md).

CP1 becomes eligible only when all of these are true:

1. Every one of the 56 deferred owners is reclassified as a live isolated
   witness, a proven supporting child, an external consumer, or a source-only
   boundary. No record remains merely `fixtureStatus: "deferred"`.
2. The 20 deferred interactive witnesses have instance-safe fixtures and are
   live on the relevant axis page, or have a proved nonvisual/boundary reason.
3. Every candidate/mismatch relationship is visibly attached to its real owner
   and the comparison surface preserves the active baseline phase.
4. The App gap-order inversion is corrected or the ordering contract is
   explicitly revised.
5. Every plausible horizontal and vertical category merge has been attempted;
   each retained split has a measured or ownership counterexample.
6. Every token-owning relationship has a non-null final category assignment;
   boundaries remain explicit. No semantic token file exists yet.

Then run T008/CP1 using
[`react-visual-poc-opus-review-request.md`](react-visual-poc-opus-review-request.md).
Do not label an ordinary adversarial review as Opus.

## Verification commands

Reference worktree, from `packages/react/ds-global-form`:

```powershell
bunx biome check src/docs/examples/SpacingAudit.stories.tsx src/docs/examples/SpacingAudit.catalog.ts src/docs/examples/SpacingAudit.extra-owners.ts src/docs/examples/SpacingAuditExtraOwners.tsx tests/SpacingAudit.spacing.pw.ts
bun run check:ts
bun test ../../../scripts/check-spacing-audit-extra-owners.test.ts ../../../scripts/check-spacing-audit-membership.test.ts ../../../scripts/check-react-spacing-inventory.test.ts
bunx vitest run src/docs/examples/ReactAlignmentLab.tests.tsx
bunx playwright test tests/SpacingAudit.spacing.pw.ts --config playwright.spacing.config.ts --project=chromium-dpr1 --project=chromium-dpr2
```

The package-wide CSS-contract check currently has one known failure in
`ds-global/Timeline/common/Event/styles.css` (`.marker / height`). Do not hide it
or conflate it with taxonomy approval.

During the active Spec 024 T004c0–T004h pause, only the read-only verifier is
permitted from this spec directory:

```powershell
node evidence/verify-evidence.cjs
```

The writing collectors and reference Storybook commands below are suspended
until T004h is dispositioned and an explicit handoff releases
`feat-bf-shared-alignment`. After that release, evidence work runs from this
spec directory:

```powershell
node evidence/measure-spacing.cjs
node evidence/measure-variants.cjs
node evidence/build-ledger.cjs
node evidence/verify-evidence.cjs
```

The collectors require the reference Storybook on port 6114. After the release,
start it in a
separate terminal from the reference Form package when it is not already
running:

```powershell
bun --cwd ../../storybook/addon-utils run build:package
bun --cwd ../ds-global run build:package
bunx storybook dev -p 6114 --no-open --host 127.0.0.1
```

Node is intentional for the collectors because Bun's Playwright transport
hangs in this environment; Bun remains the repository package runner.

## Authority and reading order

When documents disagree, use this order:

1. [`README.md`](README.md) for current status, worktree roles and next action.
2. [`tasks.md`](tasks.md) for progression gates and execution order.
3. [`bucket-table.md`](bucket-table.md) for current measurements, merge tests
   and unresolved relationships.
4. [`evidence/relationship-ledger.json`](evidence/relationship-ledger.json) and
   raw referenced captures for exact owner evidence.
5. [`component-bucket-matrix.md`](component-bucket-matrix.md) for source
   denominator coverage; its old seed hypotheses are not decisions.
6. `archive/` and earlier reviews for history only.

The strict verifier proves consistency and freshness of the declared evidence.
It does not prove the taxonomy is minimal or grant semantic approval.
