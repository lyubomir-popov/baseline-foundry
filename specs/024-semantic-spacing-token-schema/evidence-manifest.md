# Evidence manifest: Semantic spacing-token schema

## Snapshot identity

This draft consumes, but does not own, the Pragma spacing evidence at:

```text
H:\WSL_dev_projects\pragma\.claude\worktrees\fix-root-gates\specs\022-pragma-spacing-adoption
```

- Worktree branch: `fix/root-gates`
- Anchor commit: `9b3c9c41f7f6584eb58e4670ef6be34dc49544e1`
- Snapshot state: generated evidence may include intentional uncommitted files.
- Reference UI/source worktree:
  `H:\WSL_dev_projects\pragma\.claude\worktrees\feat-bf-shared-alignment`
- Reference Storybook: `http://127.0.0.1:6114`
- Last integrity refresh: 2026-09-21; all 178 targets and 20 state variants
  recaptured across Site, Docs and App, then `build-ledger` and
  `verify-evidence` passed with 536 relationships, 12 source-only boundaries,
  no structurally open relationships and `semanticApproval: false`.

The capture files record source hashes. A cold reader must compare those hashes
before attributing measurements to a later checkout. The anchor commit alone is
not a claim that the dirty generated snapshot can be recreated from Git.

`fix/root-gates` shares its tip with `feat/pragma-navigation`, so that anchor
commit contains none of this evidence: the dirty Spec 022 package and reference
implementation exist only in their working trees, and the reference worktree
has 104 uncommitted changes of its own. T004c captured their complete working
trees at `refs/recovery/spec-024/pragma/fix-root-gates-20260922` and
`refs/recovery/spec-024/pragma/bf-shared-alignment-20260922`; exact snapshot
commits are recorded in `recut-handoff.md`.

The reference worktree remains read-only. Pre-CP1 geometry experiments run
only in:

```text
H:\WSL_dev_projects\pragma\.claude\worktrees\feat-bf-inside-out-geometry
```

That worktree is created from exact recovery snapshot
`313ee82c13a126b779b9bd75902da5af13c28505`. New measurements and comparison
sheets must identify the isolated spike as their source and must not overwrite
the Spec 022 reference captures. The private evidence carrier and its expiry
are governed by `opus-pre-cp1-execution-review.md` and FR-050.

Accepted work through T004d is preserved at
`refs/recovery/spec-024/pragma/bf-inside-out-geometry-20260922`, commit
`f93281eac01b16257027161cf0841cd559f0cef1`. A later T004d1a candidate is
preserved separately at
`refs/recovery/spec-024/pragma/t004d1a-candidate-20260923`, commit
`d41000e69a7f2b096b7855b272e95ccb8909696e`, tree
`be76d8d52c05032248633f98c2cec973f1b95548`, parent
`313ee82c13a126b779b9bd75902da5af13c28505`. Relative to the accepted T004d
snapshot, that candidate changes only Button, Chip, Form and Select Playwright
tests. It is a recovery record for an attempted implementation, not accepted
T004d1a evidence: two independent adversarial reviews rejected completion.

The candidate's focused Chromium DPR 1/2 runs were observed green at 12/12 and
8/8. No recoverable successful-run JSON packet was produced. The completed Opus
junction review converts those findings into the bounded four-member, resolved-
inset, dual-lane, path-attachment and six-project acceptance contract recorded
in `tasks.md`; the old console counts remain diagnostic only.

Spec 024 spike capture reuses the existing ds-global configuration on port 6106
for Button/Chip and ds-global-form configuration on port 6107 for composite
chrome/native Select. They write under external siblings `ds-global-6106` and
`form-6107` beneath
`H:\WSL_dev_projects\temp\spec-024-inside-out-evidence-20260922`.
Each measurement is written through `testInfo.outputPath` and attached by path.
Root `manifest.json` records branch, base HEAD, full porcelain status, SHA-256
for every changed source/test/fixture and measurement JSON, plus each record's
lane, port, config, engine/DPR project, root size, title and OS `null`. The
original five T004d-modified files plus carrier remain the baseline set; later
T004d1a/T004d2/T004g changes are added rather than omitted. Port 6114 remains
reserved to the read-only Spec 022 reference.

Run the focused capture from the spike root:

```powershell
$env:PRAGMA_BUTTON_SPACING_OUTPUT = 'H:\WSL_dev_projects\temp\spec-024-inside-out-evidence-20260922\ds-global-6106'
$env:PRAGMA_FORM_SPACING_OUTPUT = 'H:\WSL_dev_projects\temp\spec-024-inside-out-evidence-20260922\form-6107'
bun --cwd packages/react/ds-global run test:spacing -- Button.spacing.pw.ts Chip.spacing.pw.ts
bun --cwd packages/react/ds-global-form run test:spacing -- Form.spacing.pw.ts Select.spacing.pw.ts -g "T004d1a control occupied targets"
bun --cwd packages/react/ds-global run test:spacing -- SharedContracts.spacing.pw.ts -g "editorial rhythm"
```

## Authoritative inventory

Read in this order:

1. `README.md` — current denominator, worktree roles and next batch.
2. `tasks.md` — open gates and execution order.
3. `bucket-table.md` — provisional categories, merge attempts and breakers.
4. `component-bucket-matrix.md` — source-denominator coverage.
5. `evidence/source-manifest.json` — captured source identity.
6. `evidence/relationship-ledger.json` — every declared spacing fact and its
   evidence reference.
7. `evidence/owner-ledger.json` — concrete owner/property measurements.
8. `evidence/browser-measurements.json` and
   `evidence/variant-measurements.json` — raw tier/state captures.
9. `evidence/verify-evidence.cjs` — structural integrity gate.

Current snapshot counts are 178 catalog targets, 180 horizontal targets, 186
vertical targets, 456 bucket routes and 536 declared spacing facts. These are
different denominators. They are not 180 or 186 unique UI components, and no
route is a final semantic-token membership while its `categoryAssignment` is
null.

## Verification and reproduction

Run from the Spec 022 directory:

```powershell
node evidence/verify-evidence.cjs
```

The verifier shells out to `rg`, so ripgrep must be on `PATH`; without it the
run dies with a `spawnSync rg ENOENT` stack trace rather than a useful message.
Its `evidenceComplete` flag is a structural result only — it says nothing about
present-day source coverage while T005, T005a and T005b are open.

Regenerate only after an intentional fixture/source change and with the
reference Storybook available on port 6114:

```powershell
node evidence/measure-spacing.cjs
node evidence/measure-variants.cjs
node evidence/build-ledger.cjs
node evidence/verify-evidence.cjs
```

Those commands are the Spec 022 reference lane and write in place. They MUST
NOT be used to produce the T004h spike packet or run while T004c0–T004h is
active. The non-overwriting spike lane is defined in
`implementation-handover.md`.

The collectors use Node intentionally because Bun's Playwright transport hangs
in the recorded environment. Bun remains the Pragma package runner.

## Known omissions and blockers

- 56 source owners / 95 spacing facts still require isolated visual fixtures
  or an explicit boundary/supporting-child disposition.
- 20 stateful targets still require safe activation or a proved nonvisual
  disposition.
- Every `categoryAssignment` remains null until the pre-CP1 classification
  pass. CP1 reviews those proposed assignments; it does not create them from an
  empty table.
- Card-header baseline phase, the Accordion root gap and other sequenced owner
  promotions remain open as described in Spec 022.
- The design-tokens App provider maps Field `8`, Group `8`, Pattern `16` and
  Region `32`; it has no Section role. Pragma's legacy alias contract inserts
  Section `32` before Pattern `16`, producing the observed
  Field/Group/Section/Pattern sequence `8/8/32/16`. The contradiction is in the
  cross-repository alias/ordering contract, not proof of a new category. CP1
  must correct the mapping/value or explicitly revise the intended hierarchy.
- The broad reference branch is evidence and fixture work, not a mergeable
  production proposal.
- The evidence snapshot predates current Pragma `origin/main` at `1530f3156` by
  75 upstream commits. Before CP1, a mainline delta sweep must classify every
  new or changed reusable owner, including Modal and recently migrated control
  implementations; a green snapshot verifier does not perform that coverage
  reconciliation.
- Those 75 commits include upstream's own design-token and density programme
  (`362b612d4`, `e5f9de6af`, `b135f611f`, `3a88504a2`, `9d4d53315`, `8100cd22c`,
  `1530f3156`, `050550fb3`). None of the `--ds-*` vocabulary this evidence
  measures exists on current main. The sweep is therefore a model reconciliation,
  not only an owner count — see T004b.

Do not copy this evidence or private Jira material into the semantic token
source. Spec 024 records decisions; design-tokens will own implementation after
CP2.
