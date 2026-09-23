# Implementation handover — Spec 024

Written 2026-09-22 after the planning review
([`opus-recut-plan-review.md`](opus-recut-plan-review.md)) and the block-geometry
decisions that followed it. Execution boundaries were corrected by the later
[`opus-pre-cp1-execution-review.md`](opus-pre-cp1-execution-review.md), which
governs wherever this handover's earlier wording conflicts with it. The later
[`opus-pre-t004d2-scope-review.md`](opus-pre-t004d2-scope-review.md) governs the
original T004d2/T004g scopes and exception table. The later
[`opus-t004g-scope-clarification-review.md`](opus-t004g-scope-clarification-review.md)
supersedes its capture-lane and execution-junction conclusions wherever they
conflict.

## Short answer

**Not ready for the recut. Ready for one bounded piece of work that unblocks it.**

CP1 and CP2 are both unpassed, the denominator is open, and no approved provider
artifact exists — so none of Phase 3, 4 or 5 can start. But the model itself has
a hole that must be closed before CP1 can mean anything, and that work is local,
reversible and well specified. That is what this handover covers.

Everything below happens in the isolated `feat/bf-inside-out-geometry` worktree,
branched from exact recovery snapshot `313ee82c13a126b779b9bd75902da5af13c28505`.
The evidence reference stays read-only. **No production branch, no PR, no push.**

**Execution junction resolved, 2026-09-23:** the combined Opus review keeps
T004d1a open under a bounded four-member evidence contract, approves the
mechanical typography-test correction and T004d2 independently, and keeps only
T004g blocked on the CP1 Section inset decision. Follow the task-specific gates
below; the earlier blanket stop no longer applies.

## Read first, in this order

1. [`README.md`](README.md) — what this package is.
2. [`opus-recut-plan-review.md`](opus-recut-plan-review.md) — findings P0-1
   through P2-5; the P0s are live.
3. [`opus-pre-cp1-execution-review.md`](opus-pre-cp1-execution-review.md) — the
   corrected worktree, spike-channel and deferral decisions.
4. [`opus-pre-t004d2-scope-review.md`](opus-pre-t004d2-scope-review.md) — the
   approved implementation scopes, type-scale exceptions and capture lane.
5. [`opus-t004g-scope-clarification-review.md`](opus-t004g-scope-clarification-review.md)
   — the completed combined execution-junction review.
6. [`prompts/opus-t004g-scope-clarification.md`](prompts/opus-t004g-scope-clarification.md)
   — the request retained as review provenance.
7. [`contracts/semantic-spacing-schema.md`](contracts/semantic-spacing-schema.md)
   **§7a** — the block-geometry model. This is the specification for the work.
8. [`spec.md`](spec.md) FR-037 to FR-053b — the rules that constrain it.
9. [`tasks.md`](tasks.md) — T004c0 to T004h are yours; nothing beyond.
10. `canonical-spacing-spec/specs/spacing/draft.md` §2.8 — the ownership model
   and the glossary terms used here.

## What is already decided — do not reopen

| Decision | Where |
|---|---|
| Block geometry is composed inside-out; nothing derives a line box or line height from a target box height | FR-039 |
| Every outside-in construction on Pragma main is superseded, specifically `--control-seat-*` and the `--density-lh-*` cells feeding them | FR-037b |
| Upstream's primitive-token migrations are kept whole and never re-derived — Breadcrumbs, Checkbox, Radio, TextInput, NumberInput, ButtonPrimitive | FR-037 |
| The baseline unit is 8px for sites, 4px for docs, apps and OS | FR-041 |
| A Site control occupies 40px including compensation; Docs and App 32px | T004d1, owner-confirmed |
| Inset values are established by measurement and then fixed, not by a runtime rule | FR-039a |
| Value coincidence never drives a merge — roles merge only when a change to one *should* change the other. The field inline inset and the marker gap stay separate | FR-042 |
| Inner padding and separation are different relationships. `field` names an inset only; the smallest gap step is `element`. A container pads itself from an inset role, never a gap token | FR-042a |
| Gap scale, Site/Docs/App: `element` 8/4/4, `group` 24/16/16, `pattern` 64/32/32. `section` is removed — it is the same relationship as `pattern` | FR-043, FR-043a |
| Governed density satisfies one constraint: nesting an enrolled child must not change the host's occupied size. Provider, subscriber and role lists are derived from it | FR-044 |
| Density keeps its mechanism; the public `.comfortable`/`.dense` opt-in is retired through the CP2 disposition, and dense becomes reachable only through an approved provider | FR-035 |
| Geometry is re-derived from the model, not reconciled relationship-by-relationship against the historical audit | FR-045 |
| Completeness is proven by a sweep for undispositioned hardcoded lengths, not by the relationship ledger | FR-045a |
| Verification during exploration is a comparison sheet, not a matrix | FR-046 |
| A magnitude escape hatch stays available for gaps the three steps miss, on the `--bf-space-N` model — whole baseline units only, recorded and reviewed | FR-047, FR-047a |
| `--ds-*` is correct house style; the spacing layer under it stays a thin alias over provider `--spacing-*` names | review P0-2b |
| Vocabulary: `inset`, `phase inset`, `baseline compensation`, `rhythm step`. `presence` and `quantisation fill` were rejected | §7a vocabulary table |

## Hard stops

Stop and hand back rather than proceeding if any of these come up.

- Any work on a `feat/pragma-*` recut branch, or any new production branch.
- Any push, PR, publish or release.
- Any `git worktree remove`, branch delete, force-update or rebase unless the
  T004c recovery refs still resolve. The snapshots now protect the CP1 evidence,
  measurement references and this design record.
- Any edit in `feat/bf-shared-alignment`, design-tokens,
  canonical-spacing-spec or the 020b grid-token worktree.
- Any new `--spacing-*` declaration inside Pragma (FR-034).
- Any `--_spike-*` reference outside `_spike-geometry.css`, any value without a
  provider-role annotation, or any spike channel beyond the four in FR-050
  without a recorded reason.
- Any invented OS value; the spike records OS as `null`.
- Any new relationship family, or any value that cannot be traced to §7a. The
  candidate `spacing.inset.control.block` is already recorded as a member of
  the existing inset family and is not a stop by itself.
- Any regeneration or overwrite of the Spec 022 reference captures, or any edit
  to their conclusions. Produce only the separate spike comparison capture.

## The work, in order

### 1. T004c — custody. Completed 2026-09-22.

No source or production branch was advanced. Current working state, captured by
the custom recovery refs and verified 2026-09-22:

| Worktree | Tracked changes | Total incl. untracked |
|---|---:|---:|
| `pragma/.claude/worktrees/fix-root-gates` | 44 | 129 |
| `pragma/.claude/worktrees/feat-bf-shared-alignment` | 85 | 104 |
| `pragma/.claude/worktrees/feat-bf-metric-nudge` | 81 | 94 |
| `baseline-foundry-worktrees/feat-024-…` | 3 | + 14 untracked under `specs/` |

`fix/root-gates` shares its tip with `feat/pragma-navigation`, and the Spec 024
branch shares its tip with `feat/023-tiered-list-title-alignment`, so in both
cases the branch ref protected nothing before T004c.

**Done**: each of the four has a full working-tree snapshot commit under a named
`refs/recovery/spec-024/...` ref, and the exact commit, tree and source-tip
identities are pinned in `recut-handoff.md`. A separate ref preserves
`fix/root-gates`' staged index tree. Alternate indexes preserved the source
branches, working trees and existing staged state.

### 2. T004c0 — create the isolated spike worktree

Completed 2026-09-22: `feat/bf-inside-out-geometry` was created at
`pragma/.claude/worktrees/feat-bf-inside-out-geometry` from exact recovery
snapshot `313ee82c13a126b779b9bd75902da5af13c28505`. Do not branch from the dirty
`feat/bf-shared-alignment` ref. The recovered formerly-untracked files become
ordinary tracked files in the spike; the source worktree and evidence hashes do
not move.

### 3. T004d0 — evidence-only carrier. Completed 2026-09-22

The isolated spike now contains `packages/styles/main/src/_spike-geometry.css`
with an expiry header and
only the four channels allowed by FR-050:

```text
--_spike-inset-control-block
--_spike-gap-element-block
--_spike-gap-group-block
--_spike-gap-pattern-block
```

Each value names the provider role it stands in for. The file binds the
`--ds-*` contract inputs to these values; components never consume a
`--_spike-*` property directly. This file is deleted and transcribed into the
provider only after CP2.

Use these exact bindings:

| Private channel | Role annotation | Contract input |
|---|---|---|
| `--_spike-inset-control-block` | candidate `spacing.inset.control.block` — absent from the current provider | `--ds-row-inset-block-start` and `--ds-row-inset-block-end` |
| `--_spike-gap-element-block` | proposed post-CP2 rename of shipped `spacing.gap.field.block` | `--ds-gap-element-block` |
| `--_spike-gap-group-block` | `spacing.gap.group.block` | `--ds-gap-group-block` |
| `--_spike-gap-pattern-block` | `spacing.gap.pattern.block` | `--ds-gap-pattern-block` |

`_spike-geometry.css` is imported from `component-contract.css` immediately after
the typography alignment import and before the layer body. Do not add it to a
public entrypoint or export map. The existing entrypoints already import the
component contract. The dedicated Playwright proof imports the real
`component-contract.css` module through Vite, follows the production carrier
import, and asserts only public DS outputs. The unrelated raw-contract fixtures
continue to strip imports and do not synthesize the carrier.

### 4. T004d1b — existing baseline-offset input. Completed 2026-09-22

In `packages/styles/typography/src/alignment.css`, the existing
`(line-height + 1cap) / 2` expression is now extracted into a named per-role
`--_typography-<role>-first-baseline-offset` property for all eight roles, and
the current nudge calculations consume it. Focused tests and
independent review accepted the exact algebraic substitution as a no-geometry-
change proof. Metric authority did not change.

### 5. T004d — block inset term. Completed 2026-09-22

The old contract in `packages/styles/main/src/component-contract.css` computed:

```css
--ds-row-padding-block-start: max(0px,
  calc(var(--ds-row-nudge-block-start) - var(--ds-row-border-block-start)));
```

Padding was nudge minus border. The completed spike adds the corresponding
per-edge inset term per §7a:

```css
--ds-row-padding-block-start: max(0px, calc(
  var(--ds-row-inset-block-start) +
  var(--ds-row-nudge-block-start) -
  var(--ds-row-border-block-start)));
```

Seed the first measurement from the observed values below. The heuristic — one
baseline unit per block edge where the nudge is under half a baseline unit,
otherwise zero — is only a starting proposal and never the authority:

| Tier | `bU` | Nudge | Inset per edge | Target occupied |
|---|---:|---:|---:|---:|
| Site | 8px | 5.456 | `0` | 40px |
| Docs | 4px | 0.149 | `1 bU` | 32px |
| App | 4px | 0.149 | `1 bU` | 32px |

OS is recorded as `null`, not zero. Pragma has no OS root or consumer to render
in this spike; CP2 resolves that provider member.

Border subtraction stays per edge and reads the actual border on that edge
(FR-039d). Do not substitute a nominal constant.

The corrected browser proof paints the public logical border inputs and
measures computed edge widths, rendered border-box height, occupied distance
including compensation and the content keyline. Borderless, symmetric,
underlined, asymmetric, clamp and exact-tie cases passed 24/24 across DPR 1
and 2; independent review accepted the task. The later T004d1a candidate did
not close the control-measurement task.

The Button, Chip and input-chrome 40 / 32 / 32 occupied measurement and
borderless-variant confirmation remain the T004d1a acceptance, not a reason to
reopen this formula task.

### 6. T004d1a — establish every control value by measurement

**Recovery stop completed 2026-09-23:** the amended record is preserved at
`refs/recovery/spec-024/baseline-foundry/pre-t004d2-disposition-20260923`,
commit `8d29b57e1455205c96b3c56908153391f99b29e6`, tree
`9e788f3904ff779c45721790ca05f84a694aeb83`. No later spike edit preceded it.
The final Opus execution-junction disposition and corrected cold-start record
are additionally preserved at
`refs/recovery/spec-024/baseline-foundry/opus-junction-disposition-20260923`,
commit `c2df4f0baaf2c74be098116f95b1192a8d8eec3d`, tree
`517db44c9334827fd78d5fabc4b40a274e653bf2`. No T004d2 spike edit preceded
that post-junction stop.

Measure every control in the denominator, not only Button. Set the proposed
value, render it, and record the fixed value that actually reaches the product
target. If the heuristic disagrees, the measurement wins and the heuristic is
not patched to fit.

**Done when**: each control's measured value, occupied size and product target
are recorded; heuristic inputs may accompany that record as a sanity check.
The measured values are fixed in the spike carrier and later transcribed into
the token source after CP2.

**Attempted, rejected and preserved:** the candidate changed only these files
relative to the accepted T004d snapshot:

- `packages/react/ds-global/tests/Button.spacing.pw.ts`
- `packages/react/ds-global/tests/Chip.spacing.pw.ts`
- `packages/react/ds-global-form/tests/Form.spacing.pw.ts`
- `packages/react/ds-global-form/tests/Select.spacing.pw.ts`

Focused Chromium DPR 1/2 runs were observed green at 12/12 and 8/8. They use
live rendered border-box and computed-margin measurements, but two independent
adversarial reviews correctly found that green insufficient. The completed
Opus junction review resolves the acceptance contract: four measured members;
direct resolved-inset and per-edge identity assertions; Button, Chip and native
Select borderless waivers; composite-chrome proof through documented per-side
fixture hooks or a recorded waiver; persisted path attachments; bound 6106 and
6107 lanes; rem-scaled 40/32 to 45/36 targets; and all six engine/DPR projects.

The rejected candidate is recoverable at
`refs/recovery/spec-024/pragma/t004d1a-candidate-20260923`, commit
`d41000e69a7f2b096b7855b272e95ccb8909696e`, tree
`be76d8d52c05032248633f98c2cec973f1b95548`, parent
`313ee82c13a126b779b9bd75902da5af13c28505`. This is custody, not acceptance.
T004d1a stays open until that exact contract is executed and captured. T004d2
may proceed independently. T004g remains blocked only on the CP1 Section choice.

### 7. T004d2 — the two rhythm terms

The follow-up Opus review authorises `packages/styles/typography/src/elements.css`
in addition to `alignment.css`, the focused alignment test and comparison
fixture/story. Use these exact per-role outputs:

```text
--_typography-<role>-rhythm-step
--_typography-<role>-phase-block-start
--_typography-<role>-closure-block-end
```

Phase is additive after the existing nudge; never redefine either published
`--typography-<role>-nudge-block-*` value. Every selector block that maps a
nudge pair in `elements.css` must also map phase and closure, because custom
properties inherit. Controls already have their closer and need no change.

In every h1–h6, prose/list and code selector block that already selects the
nudge pair, add these aliases without fallbacks:

```css
--_typography-text-phase-start:
  var(--_typography-<role>-phase-block-start);
--_typography-text-closure-end:
  var(--_typography-<role>-closure-block-end);
```

The shared applied ledger becomes exactly:

```css
margin-block: 0;
padding-block-start: calc(
  var(--_typography-text-nudge-start) +
  var(--_typography-text-phase-start)
);
padding-block-end: 0;
margin-block-end: var(--_typography-text-closure-end);
```

`test/text-alignment.test.ts` is the one mechanical scope correction to the
reviewed list: update only its applied-ledger and phase/closure-alias assertions.
Its existing nudge-mapping assertions remain. Leave `test/spacing-model.test.ts`,
`scripts/check-css-contract.test.ts` and the Svelte launchpad packed-export
proof unmodified and green.

Per §7a, at opposite edges and doing different jobs:

- **Phase inset**, block-start: lifts the first baseline onto the rhythm step;
  later lines stay in phase only for the qualifying whole-multiple combinations.
- **Baseline compensation**, block-end: closes the total to a whole step so
  nothing after it is displaced. Its sum includes the phase term.

Both round up only. Both read a rhythm step named for context — `bU` for
controls, the body line advance for editorial text. Neither is a token, neither
emits a public property.

**Done when**: assert the whole-multiple predicate and show the heading's own
lines aligning beside body copy for Site H1/H2/H5/H6, Docs H1/H2 and App H5/H6.
Record the ten non-qualifying combinations in §7a as type-scale exceptions for
CP1. Do not alter typography tokens to chase an impossible result.

### 8. Remeasure

Produce separate comparison captures from the isolated spike after steps 3 to
7. Do not overwrite or reinterpret the Spec 022 reference snapshot. Reuse the
two existing configs: ds-global on port 6106 for Button/Chip and ds-global-form
on port 6107 for composite chrome/native Select. From the spike root, set:

```powershell
$env:PRAGMA_BUTTON_SPACING_OUTPUT = 'H:\WSL_dev_projects\temp\spec-024-inside-out-evidence-20260922\ds-global-6106'
$env:PRAGMA_FORM_SPACING_OUTPUT = 'H:\WSL_dev_projects\temp\spec-024-inside-out-evidence-20260922\form-6107'
bun --cwd packages/react/ds-global run test:spacing -- Button.spacing.pw.ts Chip.spacing.pw.ts
bun --cwd packages/react/ds-global-form run test:spacing -- Form.spacing.pw.ts Select.spacing.pw.ts -g "T004d1a control occupied targets"
bun --cwd packages/react/ds-global run test:spacing -- SharedContracts.spacing.pw.ts -g "editorial rhythm"
```

Each T004d1a test writes JSON with `node:fs/promises` to
`testInfo.outputPath(...)` and attaches it by `path`, never by in-memory body.
Write root `manifest.json` beside the two lane directories with branch, base HEAD, full
`git status --porcelain -uall`, SHA-256 for every tracked-modified and untracked
source, test and fixture file in that listing, every `t004d1a-*.json`, and each
record's lane, port, config, engine/DPR project, root size, title and OS `null`.
Retain the five
T004d-modified files plus carrier as the baseline set, but also hash every later
T004d2/T004g change present at capture time. Do not create a collector or
config or port. Port 6114 remains
reserved to Spec 022 and Spec 024 never binds it; 6115 belongs to the existing
ds-app-launchpad harness.

**Done when**: both bound lanes record source identity for the isolated spike,
produce the comparison packet without changing either Spec 022 worktree, and
persist their artifacts and manifest at the external output path.

### 9. FR-037a — the comparison that closes T004b

Render a Site Button label against body copy of the same tier, under the
superseded seat model and under this one. This is the evidence for the
supersede decision, which is otherwise recorded on argument alone.

It cannot run before step 5. Under the current contract the taxonomy's controls
measure 22.3px in App, so the comparison would show them undersized for a reason
that has nothing to do with the model.

### Dispositions — T004e and T004f are not spike work

- **T004e** is deferred to Spec 020b. T004g removes the local grid redirects
  without replacing them; this programme authors no grid value.
- **T004f** is removed from pre-CP1. The live mainline density matrix and its
  compatibility aliases are T017a migration inputs. Do not restore a matrix to
  the reference or spike.

### 10. T004g — apply the gap scale

**Blocked before the first edit:** CP1 must choose Section's variant mapping.
The source-scope question is closed: FR-053b and T004g contain the exhaustive
writable slice. Do not begin any subset of T004g before the Section choice.

Once released, delete the two ColorInput inset overrides at
`packages/react/ds-global-form/src/lib/subcomponent/ColorInput/styles.css:114`
and `:158` so they inherit the framed-box surface inset. Repoint
`--form-group-gap-default` only to DS element gap and
`--form-field-block-gap-default` to DS group gap; both remain gaps.

The exact boundaries are:

- `packages/summon/application/src/application/react/templates/src/styles/app.css:14,18`
  — page/application-shell relationship owned with Spec 020b;
- `apps/react/boilerplate-vite/src/styles/app.css:5,9` — the same boundary in an
  application;
- `packages/react/ds-app/.storybook/side-navigation-spacing-contract.css:11,51`
  — Storybook fixture, editable only when comparison evidence requires it;
- `packages/svelte/ds-app-wpe/src/lib/group/Cards/styles.css:21-22` — FR-036
  non-React boundary; do not soften it.

Record all four in T010.

Set `element` 8/4/4, `group` 24/16/16, `pattern` 64/32/32 per FR-043, and remove
`section`. Every step changes from what the provider resolves today, and
applications **double** at `group` and `pattern` — this is the largest visible
change in the handover, so sheet it carefully.

Separate inset from gap per FR-042a. The bordered Section box may delete its
local block-inset override and inherit the framed-box surface inset. Do not
delete the Pragma-owned `--spacing-gap-section-block` or update its Section
variant consumer and three fixtures until CP1 chooses collapse or a new role:

- `packages/react/ds-global/src/lib/TransitionClosure.spacing.tests.ts:55`;
- `packages/react/ds-global/tests/TransitionFacts.spacing.pw.ts:119`;
- `packages/styles/main/test/spacing-model.test.js:26`.

Remove `--grid-gutter` / `--grid-margin` without replacement. Record that
`packages/styles/main/src/grid.css:102,104` takes its 1.5rem fallback;
`packages/react/ds-global/src/lib/group/Cards/styles.css:56-57` and
`packages/svelte/ds-app-wpe/src/lib/group/Cards/styles.css:21-22` lose an
unfallbacked gap and resolve to zero used gap;
and `apps/react/storybook-hub/src/docs/Grid.stories.tsx:29,81,97` resolves its
three unfallbacked paddings to zero. Do not soften Svelte Cards.

Run this exact PowerShell sweep from the spike root:

```powershell
git ls-files '*.css' | ForEach-Object {
  $path = $_
  $content = Get-Content -LiteralPath $path -Raw
  [regex]::Matches($content, '(?m)(?:padding(?:-[\w-]+)?|--[\w-]*padding[\w-]*|--[\w-]*inset[\w-]*)\s*:\s*[^;]*var\(--(?:spacing-gap|ds-gap|container-gap|form-group-gap)-') | ForEach-Object {
    $line = 1 + [regex]::Matches($content.Substring(0, $_.Index), "`n").Count
    "${path}:${line}:$($_.Value)"
  }
}
```

Its final result may contain only the six pre-dispositioned hits: two in the
Summon template, two in the React boilerplate and two in the ds-app Storybook
fixture. Any other hit is undispositioned and blocks T004g. This is not the T007
full completeness sweep.

**Done when**: a comparison sheet per product shows the three steps reading as a
clear hierarchy, every in-scope padding owner reads an inset, and every other
sweep hit has its approved one-line boundary.

## Review gate — this handover ends at one

The work above sits **before CP1**, where the spec's first mandatory independent
review lands. That leaves this scope without a gate of its own, which is wrong
for a change set that alters the gap scale in every product and repoints
container padding. So it has one:

**Stop at T004h and request an independent adversarial review before any of this
feeds CP1.** Package the comparison sheets, the measured control values, the
no-movement result for T004d1b, the affected-scope consumer/literal sweep, and
static proof that private spike channels occur only in their carrier, that the
publishable-by-construction carrier exists on no other branch, and that no
`--spacing-*` declaration was added. Include both external 6106 and 6107 artifacts
and complete manifest, hashing every changed source/test/fixture and measurement file at capture
time. This is not the FR-033 foundation-cut
assertion or the FR-045a/T007 full-denominator sweep; those remain downstream.
Do not prepare the CP1 packet until the review is dispositioned.

The reviewer must not be the agent that did the work. If no independent reviewer
is available, say so and stop — do not self-review, and do not describe the
model you are as a different one (FR-048).

Later gates, for orientation — none of them are yours to reach:

| Gate | Review required | Source |
|---|---|---|
| CP1 taxonomy | Independent **Opus** adversarial review; "do not proceed" while the denominator is open | T012 |
| CP2 schema | Ordinary adversarial review; Opus additionally if a new architecture or public API appears | T018, T019 |
| Token implementation | Adversarial implementation review before merge or publication | T025 |
| Final recut | Actual Opus recut review before human handoff | T028a |

Note that Pragma's own `AGENTS.md` mandates none of this — it governs commits,
branches and the root gate. Every review obligation above comes from this spec
package and from Baseline Foundry's checkpoint rule. Nothing outside will stop
an agent that ignores them.

## Then hand back

The combined Opus execution-junction review is complete and dispositioned.
T004d2 and the mechanical text-alignment correction may proceed independently;
T004d1a remains open under its bounded four-member, dual-lane acceptance.
T004g remains stopped only on CP1's Section mapping choice. After the released
tasks eventually complete, stop at T004h for its independent adversarial review.
After that review is dispositioned, the next implementation phase is T005 /
T005a / T005b — freezing the denominator and reconciling it against current
`origin/main`, including non-React consumers. That belongs to CP1 preparation,
not to this handover.

## How to verify, and how much

Read FR-046 before writing a single test. This work is exploratory, and the
standard artifact is a **comparison sheet**, not a suite: the components of a
group on one row, or rows each led by a reference — Button for boxed text,
paragraph for unboxed, Card for panels — with baseline and rhythm guides
overlaid. If text sits on a shared baseline across the row and the guides are
equally spaced, the geometry is right. A human or an agent reads it in seconds.

Automate only what is cheap and catches something invisible. In this spike,
that means the T004d1b no-movement proof, private-channel confinement, absence
of new `--spacing-*` declarations and the affected-scope consumer sweep. The
FR-033 pinned-alias assertion belongs to the later foundation cut, not T004h.

Do **not** build per-variant, per-state, per-product matrices over geometry that
is still being designed. A requirement stating a property is not an instruction
to prove it in every combination; those matrices are a CP2 obligation and are
deferred until the values settle. If a session is going mostly into running
tests rather than moving the model, stop and hand back.

## Traps, from experience

- **`verify-evidence.cjs` needs `rg` on `PATH`.** Without ripgrep it dies with a
  `spawnSync rg ENOENT` stack trace, not a useful message.
- **`variant-measurements.json` reuses seven capture IDs** across `captures` and
  `ownerExtraProbes`, with contradictory statuses — `measured` in one list,
  `missing-or-hidden` in the other. Resolve references by list *and* ID. Reading
  by ID alone will tell you a variant was never captured when it was.
- **The primary `H:\WSL_dev_projects\pragma` checkout is 75 commits stale** and
  sits on the donor base. `AGENTS.md` requires the root gate to run from the repo
  root; fetch and move it first.
- **The collectors use Node deliberately.** Bun's Playwright transport hangs in
  this environment. Bun remains the package runner for everything else.
- **Spec 022 reference measurements come from `feat-bf-shared-alignment`, not
  `fix-root-gates`.** New Spec 024 spike measurements come from
  `feat/bf-inside-out-geometry` and must identify that source. Do not attribute
  a measurement to the worktree that merely stores it.
- **`evidenceComplete: true` from the verifier is structural only.** It says
  nothing about present-day source coverage while T005 and T005a are open.
- **The first frozen install runs the root prepare build.** On the recovered
  snapshot, `bun install --frozen-lockfile` installs dependencies but its
  prepare step fails in pre-existing `@canonical/lit-ds-prototype` CSS default
  imports. Record that separately from focused spike checks; do not treat the
  historical build failure as caused by the spike.
- **Broad consumer geometry is intentionally red after T004d and before
  T004d1a/T004g.** Partial runs recorded the expected new inset deltas in
  Accordion (4px/4.5px by root size), Card composition (8px), ColorInput
  (~3.99px) and TextField (4px/4.5px), plus T004g-deferred transition facts.
  Do not repair consumers opportunistically; measure and disposition them in
  the ordered tasks.

## Status summary

| Gate | State |
|---|---|
| Planning review | Complete. Owner acceptance outstanding. |
| Pre-CP1 execution review | Complete. Its worktree, carrier, metric, deferral and OS decisions govern this handover. |
| Pre-T004d2/T004g scope review | Complete and dispositioned. |
| Combined execution-junction review | Complete; T004d1a is bounded to four members and two lanes, T004d2 may proceed independently, and T004g waits only on CP1's Section choice. |
| Block-geometry decisions | Recorded in FR-037b, FR-039 to FR-043 and FR-050 to FR-053. |
| Custody (T004c) | Complete — recovery refs and the later Spec 022 execution amendment verified 2026-09-22. T004d is preserved at `f93281e…`; the amended pre-T004d2 disposition is preserved at `8d29b57e…`; the final Opus junction disposition is preserved at `c2df4f0…`. |
| Isolated spike T004c0 | Complete at exact snapshot `313ee82c…`. |
| Isolated spike T004d0 / T004d1b | Complete in the isolated worktree; independently accepted after the carrier-path test correction. |
| Isolated spike T004d | Complete; per-edge formula and corrected rendered-border proof independently accepted. |
| Isolated spike T004d1a–T004h | T004d1a remains open under its four-member dual-lane acceptance. T004d2 may proceed independently. T004g is blocked only on CP1's Section mapping choice. Stop again at independent review T004h after eventual release and completion. |
| CP1 taxonomy | Not started. Denominator open. |
| CP2 schema | Not started. |
| Token implementation | Not started. No provider artifact exists. |
| Pragma recut | Not started. Cuts 5, 6, 8 and 15 split into keep and replace halves. |
