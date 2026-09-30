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

**Not ready for the recut. Ready for the CP1 gallery, then the independent CP1
review.**

CP1 and CP2 are both unpassed and no approved provider artifact exists, so none
of Phase 3, 4 or 5 can start. The denominator and its candidate T006
assignments are now closed. T007–T011 are complete. T011a – the visual gallery
generator and the CP1 gallery (FR-054) – is next; T012 follows with the gallery
attached. No gate from CP1 onward passes without the owner's visual sign-off.

Worktree routing is phase-specific. T004c0–T004h happened in the isolated
Pragma `feat/bf-inside-out-geometry` worktree, branched from exact recovery
snapshot `313ee82c13a126b779b9bd75902da5af13c28505`. T005–T013 planning and
evidence records live in the Baseline Foundry
`feat/024-semantic-spacing-token-schema` worktree. T008's current-main
comparison implementation is the local, evidence-only Pragma branch
`test/spec-024-t008-comparison`; it must never be pushed, merged or presented
as the production recut. The primary Pragma checkout
stores local `main`: before each source-sensitive batch, fetch `origin/main`
and fast-forward local `main`, then use that synced commit for source analysis
and as the base of any new Pragma implementation worktree. Do not make feature
edits in the primary checkout. The evidence reference stays untouched. **No
production branch, no PR, no push.**

**Execution junction resolved, 2026-09-23; T004d1a executed 2026-09-27:** the
combined Opus review bounded T004d1a to four members. That amended evidence
contract is now complete in local Pragma commit `99ce3fa36`. The mechanical
typography-test correction and T004d2 remain implemented independently. The
2026-09-28 owner rulings accept full body-line closure and map Section variants
to the existing surface/strip insets. T004g is complete in local Pragma commit
`b10c4d541`. T004h was accepted after its bounded correction and the final F1
list-boundary fix in local Pragma commit `1c2c6ba73`. T005/T005a/T005b are
complete against synced Pragma local `main` `90386bfbf`, equal to
`origin/main`; T006 assigns or bounds all 169 rows, and T007/T009/T010 are
complete. T008 evidence and the T011 cold-start packet are complete; T012 is
next.
Follow the task-specific gates below; the earlier blanket stop no longer
applies.

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
9. [`opus-t004h-review.md`](opus-t004h-review.md) and
   [`opus-t004h-rereview.md`](opus-t004h-rereview.md) — the rejected first
   packet, bounded corrections and conditional acceptance.
10. [`component-inventory.md`](component-inventory.md) and
    [`component-inventory.json`](component-inventory.json) — the frozen
    current-main denominator and exact source identities.
11. [`tasks.md`](tasks.md) — T008 and T011 are complete; T012 is next.
12. `canonical-spacing-spec/specs/spacing/draft.md` §2.8 — the ownership model
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

**Owner ruling, 2026-09-27, superseding that final run-scope requirement:**
T004d1a uses Chromium DPR 1 only, across the same four members, Site/Docs/App
and roots 16/18. It retains direct per-edge measurements, persisted JSON, the
hashed manifest, the comparison sheet and the static product-Button-fork
assertion. The six-engine/DPR matrix is deferred to CP2 under FR-046b and MUST
NOT be restored as a pre-CP1 gate. Do not run T004d1a before T004d2 completes.

The reset T004d1a re-execution edits remain dropped. When the task resumes,
reconstruct only the runner output-path fix and the correction that measures
the border on the composite wrapper while measuring padding on its input. Check
`.storybook/form-spacing-contract.css` independently before reconstruction;
the reset edits may not be fully recoverable.

The rejected candidate is recoverable at
`refs/recovery/spec-024/pragma/t004d1a-candidate-20260923`, commit
`d41000e69a7f2b096b7855b272e95ccb8909696e`, tree
`be76d8d52c05032248633f98c2cec973f1b95548`, parent
`313ee82c13a126b779b9bd75902da5af13c28505`. This is custody, not acceptance.
The owner-amended contract was executed and captured on 2026-09-27 in local
Pragma commit `99ce3fa36`. Focused Chromium DPR 1 runs passed 5/5 on the 6106
Button/Chip lane and 4/4 on the 6107 Form/Select lane. The evidence root is
`H:\WSL_dev_projects\temp\spec-024-t004d1a-evidence-20260927-final2`; its
`manifest.json` SHA-256 is
`0d43b3f717f0beef0184fa7f14652f36133567015b128814f9b223eb5d2ba21c`.
The manifest validates all 19 source hashes, 16 persisted/path-attached JSON
files and 14 comparison artifacts. This records task completion, not an
independent review.
T004d2 is accepted to feed CP1 under the owner whitespace ruling below. T004g
is released by the owner Section mapping and carries the recorded gap-rhythm
risk below.

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

**Done when**: show that phase lifting aligns one-line headings for all 18
product/heading combinations. Treat Site H1–H4, Docs H1–H6 and App H1–H4 as
cross-size evidence. Assert 2/3-line alignment only for the eight
whole-multiple combinations; record the other ten as CP1 type-scale exceptions
for wrapped headings only and show Site H3, Docs H3 and App H1 as explicit
wrapped failures. Site H5/H6 and App H5/H6 share their product's body line
height and remain formula controls, not independent cross-size evidence. Do not
alter typography tokens to chase the wrapped exceptions.

**Adversarial follow-up, 2026-09-27:** the formulas stand, but T004d2 MUST NOT
feed CP1 until the owner rules on the resulting whitespace. At a 16px root,
body and code phase both resolve to Site/Docs/App = 0/4/4px. Closing to the body
line step adds 16px to every text element's occupied contribution; measured
one-line examples are Site paragraph 32→48, Docs/App paragraph 24→40 and Site
H1 56→72. The comparison story therefore includes, for every product, the
previous nudge/complement ledger beside the current phase/closure ledger for a
stacked heading, two paragraphs and a list. One Chromium DPR 1 rendered check
must prove `round(up, …)` resolves through one formula control per product, and
must measure all 18 one-line combinations against the body sibling with real
inline baseline probes and prove that each pair closes to whole body-line
steps. The corrected Chromium DPR 1 measurement is Site `0–0.219px`, Docs
`0.531–0.766px` and App `0–0.609px`; the earlier `0.05–0.34px` record came from
the metric formula rather than a rendered baseline. The `0.5px` claim is not
met in Docs/App. Preserve this as a T004h/CP1 metric-authority finding; the
`1px` automated bound is only a gross-regression guard and does not accept the
residual. The check must also prove the explicit wrapped
exceptions Site H3, Docs H3 and App H1 do not close to a whole body-line step.
Do not present the same-line-height controls as cross-size alignment evidence.

Carry two risks to CP1/T004g: rendered one-line heading/body probes retain up to
`0.766px` residual because metric authority is deliberately unchanged;
and closure is a margin, so it collapses with neighbouring margins and can be
replaced by a component-owned `margin-block-end`. The evidence-only
`Spec 024 · T004d2` marker in the story must be removed during the post-CP2
recut.

**Owner ruling, 2026-09-28:** use full body-line closure and accept the added
spacing in stacked prose and lists. A one-line list item occupies 48px in Site
instead of 32px and 40px in Docs/App instead of 24px; paragraphs likewise gain
one blank body line. The rejected baseline-unit closer remains on the 8px/4px
grid but shifts subsequent text 8px within the 24px/20px body-line cycle. The
stronger common body-line phase governs, so T004d2 may feed CP1. For the spike,
margin collapse against zero block-start margins is accepted; component-owned
`margin-block-end` rules must compose rather than replace the closer.

Carry a separate rhythm risk into CP1 and T004g: the proposed gap tokens are
whole baseline units but not whole body lines. Site's 8/24/64px
element/group/pattern gaps are measured against a 24px body line; Docs/App's
4/16/32px gaps are measured against a 20px body line. In adjacent text columns,
inserting such a gap can preserve the baseline-unit grid while shifting all
following text away from the neighbouring column's body-line rhythm. T004g
must disposition that distinction rather than assuming baseline-unit alignment
implies body-line alignment.

### 8. Remeasure

The separate comparison capture was produced from the isolated spike without
touching the Spec 022 reference snapshot. T004d1a used Chromium DPR 1 only;
cross-engine and DPR 2 coverage remains deferred to CP2. The two existing
configs ran on their bound lanes: ds-global on port 6106 for Button/Chip and
ds-global-form on port 6107 for composite chrome/native Select. The completed
output is
`H:\WSL_dev_projects\temp\spec-024-t004d1a-evidence-20260927-final2`.

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

**Released by the owner, 2026-09-28:** shallow Section maps to the surface inset;
default/hero/deep Section map to the strip inset. Strip and Section share the
same major page-section inset magnitude because changing that rhythm should
change both. Strip applies it at both block edges and Section at its relevant
section edge; that edge application difference does not justify a fifth token
or FR-050 channel. FR-053b and T004g contain the exhaustive writable slice.

Once released, delete the two ColorInput inset overrides at
`packages/react/ds-global-form/src/lib/subcomponent/ColorInput/styles.css:114`
and `:158` so they inherit the framed-box surface inset. Repoint
`--form-group-gap-default` only to DS element gap and
`--form-field-block-gap-default` to DS group gap; both remain gaps.

The required pre-edit T004g gap-owner record was made on 2026-09-28. Repoint
the field/element gap fallbacks in exactly these files to
`--ds-gap-element-block`:

- `packages/react/ds-global/src/lib/component/Card/common/Content/styles.css`;
- `packages/react/ds-global/src/lib/component/Card/common/Footer/styles.css`;
- `packages/react/ds-global/src/lib/component/Tile/common/Header/styles.css`;
- `packages/react/ds-global/src/lib/component/Tile/common/Content/styles.css`;
- `packages/react/ds-global/src/lib/component/Tooltip/styles.css`.

Card Header is excluded because its genuine gap intentionally reads the surface
inline inset.

The separate FR-042a inset-owner record was also made before implementation on
2026-09-28. Repoint every block-padding fallback found by the affected-scope
sweep to `--spacing-inset-surface-block` in these exact files:

- Accordion `common/Item/styles.css`;
- Card `common/Header/styles.css`, `common/Content/styles.css` and
  `common/Footer/styles.css`;
- Tile `common/Header/styles.css` and `common/Content/styles.css`;
- Tooltip `styles.css`;
- Popover `styles.css`;
- Announcement `styles.css`.

These are the seven known component cases named in the reviewed plan, expanded
to their nine exact owning files. This is distinct from the bounded gap
activation above; no other direct provider-gap consumer moves.

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
local block-inset override and inherit the framed-box surface inset. Delete the
Pragma-owned `--spacing-gap-section-block` and update its Section variant
consumer and three fixtures for the accepted surface/strip collapse:

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

**Completed 2026-09-28** in local Pragma commit `b10c4d541`. The comparison
story is
`http://localhost:6106/?path=/story/work-in-progress-component-section--gap-scale-comparison`.
It renders the three computed gap steps and the actual shallow/default Section
insets for Site, Docs and App. The 1600px Chromium DPR 1 capture is
`H:\WSL_dev_projects\temp\spec-024-t004g-evidence-20260928\gap-scale-comparison-1600.png`
(SHA-256
`d217549171a293d1de0439361321e47bb2c919e9203dbf7cdeab24dd4e1a3198`).
The exact affected-scope sweep returns the six approved boundaries and no
others. Private gap-channel declarations occur only in `_spike-geometry.css`,
and the diff adds no `--spacing-*` declaration. Focused TypeScript, Biome,
static contract and Chromium DPR 1 Section/gap checks pass.

The complete `TransitionClosure.spacing.tests.ts` and
`TransitionFacts.spacing.pw.ts` runs retain one pre-existing out-of-scope
Timeline mismatch: their assertions pin a 12px marker while the earlier shared
marker-canvas implementation uses and renders 16px. The focused T004g checks
are green; this task does not rewrite the Timeline assertion opportunistically.
No independent review is claimed.

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

**Packet prepared 2026-09-28:** use
`prompts/opus-t004h-review-request.md`. The evidence root is
`H:\WSL_dev_projects\temp\spec-024-t004h-review-20260928`; its top-level
`manifest.json` SHA-256 is
`fc725551630c54ba53a6c84e513949bf579ed95cdeaeb951a9374342c960b032`.
The manifest was independently revalidated against clean Pragma HEAD
`b10c4d541`: 40 source/test/fixture paths, 16 persisted/path-attached
measurement JSON paths, 16 comparison artifacts and 3 supporting files all
exist and match their recorded hashes. This packages the request only; it is
not an independent review or permission to begin T005.

**T004h review returned reject, 2026-09-28:** the independent Claude Opus 5.5
review is recorded in `opus-t004h-review.md`. It accepts the formulas and owner
rulings but requires five bounded corrections before a limited re-review:
Section's stale SurfaceFrames contracts; ColorInput row geometry; real
heading/body baseline probes; bare-list reset plus evidence; and actual Card,
Tooltip and Form-field comparison rows. The tasks entry authorises the exact
additional files and evidence repair. Downstream P2/CP2/T007/T010 findings stay
recorded in the review and do not broaden this correction. T004h and T005 remain
open.

**Corrections complete and packaged 2026-09-28:** Pragma commit `4325f1597`;
limited request `prompts/opus-t004h-limited-rereview.md`; evidence root
`H:\WSL_dev_projects\temp\spec-024-t004h-rereview-20260928`; manifest SHA-256
`b921f2313a04d5a5563fefe176be50ee407e77c3b0a10b204353fb9c9ffd3d13`.
The manifest uses committed Git blob IDs and hashes rather than checkout bytes,
and includes the original packet plus the no-movement result, persisted
correction measurements and new captures. The real-probe residual above
`0.5px` is explicitly presented for independent disposition. Do not start
T005 until that limited verdict returns and is recorded.

**Limited re-review accepted 2026-09-28, conditional item closed:** the
independent review is `opus-t004h-rereview.md`. F1 is fixed in local Pragma
commit `1c2c6ba73`: the `ul`/`ol` reset now shares the list-item exclusion for
`.ds` component subtrees. Typography is 21/21 and HeadingRhythm is 3/3. The
review probe returns bare-list margins `0/0`; inside `.ds`, it restores the UA
`1em` margins and `1em` last-item-to-paragraph gap. Those values compute to
`14px` in Docs because Docs body text is 14px, rather than the review's nominal
`16px`; this is the pre-correction behaviour, so no fixed 16px override was
added. T004h is complete and T005 may start without another review round.

Carry the non-blocking re-review findings forward:

- CP1 must record Chromium's cumulative `-1/64px` advance per closed text
  element and decide whether rhythm terms must be exact in layout units.
- T006 must record the ColorInput popover separator-row exception and prefer
  actual per-edge box-border subtraction at recut.
- CP1 must choose the one-line heading/body acceptance bound (`<=0.5px` with
  metric-authority work, or a device-pixel criterion such as `<=1px` at DPR 1)
  and decide whether metric authority belongs to CP1 or the CP2 engine matrix.
- The packet must mention the unrelated ds-global-form
  `ReactPilotCatalogFilter` matcher failure and tie ColorInput's `0.032px`
  occupied-size tolerance to the `1/64px` rounding finding.

The reviewer must not be the agent that did the work. If no independent reviewer
is available, say so and stop — do not self-review, and do not describe the
model you are as a different one (FR-048).

Later gates, for orientation. From CP1 onward each needs **both** the reviewer's
verdict and the owner's visual sign-off of its gallery (FR-054):

| Gate | Review required | Gallery before → after | Source |
|---|---|---|---|
| CP1 taxonomy | Independent **Opus** adversarial review; "do not proceed" while the denominator is open | Spike base → spike tip | T011a, T012 |
| CP2 schema | Ordinary adversarial review; Opus additionally if a new architecture or public API appears | CP1 gallery, or regenerated with CP2 values | T018, T019 |
| Token implementation | Adversarial implementation review before merge or publication | Pragma `main` → same commit on candidate tokens | T025 |
| Every Pragma cut | Foundation and first-family reviews, then each family | Cut parent → cut tip, signed off before the next cut | T026b |
| Final recut | Actual Opus recut review before human handoff | Recut-start `main` → final tip | T028a |

Note that Pragma's own `AGENTS.md` mandates none of this — it governs commits,
branches and the root gate. Every review obligation above comes from this spec
package and from Baseline Foundry's checkpoint rule. Nothing outside will stop
an agent that ignores them.

## Then hand back

The combined Opus execution-junction review is complete and dispositioned.
T004d2 and the mechanical text-alignment correction were implemented
independently, and full body-line closure is accepted for CP1.
T004d1a is complete under its bounded four-member, dual-lane evidence contract.
T004g is complete in local Pragma commit `b10c4d541`. T004h is accepted after
the F1 list-boundary fix in `1c2c6ba73`. T005/T005a/T005b then froze 158 React
parts and 11 non-React rows against synced local `main` `90386bfbf`, equal to
`origin/main` at capture, including Modal, the expanded SideNavigation and
SidePanel. T006 assigns or bounds all 169 rows in the schema-version-2
inventory. T007–T011 are complete; T008 current-main comparison evidence is
preserved in its isolated local Pragma worktree. T011a, the CP1 gallery, is
next, then T012.

End every hand-back to the owner with exactly three items (FR-054e):

1. the gallery link, or "no visible change" with the reason;
2. what you are unsure of;
3. the decisions you need from the owner.

Put narrative status in the task entry, not in the hand-back.

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
- **The primary `H:\WSL_dev_projects\pragma` checkout is the local-main
  authority.** It was synced to `origin/main` at `90386bfbf` for this batch.
  Recheck and fast-forward it before any later source-sensitive regeneration.
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
- **Broad consumer geometry was intentionally red after T004d and before
  T004d1a/T004g.** T004g closes its named owners and focused transition facts.
  The remaining known transition-test failure is the out-of-scope Timeline
  12px assertion against the earlier 16px shared marker canvas; do not repair
  unrelated consumers opportunistically.

## Status summary

| Gate | State |
|---|---|
| Planning review | Complete. Owner acceptance outstanding. |
| Pre-CP1 execution review | Complete. Its worktree, carrier, metric, deferral and OS decisions govern this handover. |
| Pre-T004d2/T004g scope review | Complete and dispositioned. |
| Combined execution-junction review | Complete; T004d1a is bounded to four members and two lanes, and T004d2 proceeded independently. The owner accepted full body-line closure and released T004g with the Section surface/strip mapping on 2026-09-28; T004g is now complete. |
| Block-geometry decisions | Recorded in FR-037b, FR-039 to FR-043 and FR-050 to FR-053. |
| Custody (T004c) | Complete — recovery refs and the later Spec 022 execution amendment verified 2026-09-22. T004d is preserved at `f93281e…`; the amended pre-T004d2 disposition is preserved at `8d29b57e…`; the final Opus junction disposition is preserved at `c2df4f0…`. |
| Isolated spike T004c0 | Complete at exact snapshot `313ee82c…`. |
| Isolated spike T004d0 / T004d1b | Complete in the isolated worktree; independently accepted after the carrier-path test correction. |
| Isolated spike T004d | Complete; per-edge formula and corrected rendered-border proof independently accepted. |
| Isolated spike T004d1a–T004h | Complete. T004d1a is in local Pragma commit `99ce3fa36` under its four-member dual-lane evidence contract. T004d2 is accepted with full body-line closure. T004g is in `b10c4d541`; the T004h correction is in `4325f1597`; its conditional F1 is closed in `1c2c6ba73`. Independent review accepted the result; T006 records F2–F4 and they remain subject to CP1. |
| CP1 taxonomy | Cold-start packet ready. T005/T005a/T005b denominator closed at 158 React plus 11 non-React rows; T006 assigns or bounds all 169, and T007–T011 are complete. T012 independent review is next. |
| CP2 schema | Not started. |
| Token implementation | Not started. No provider artifact exists. |
| Pragma recut | Not started. Cuts 5, 6, 8 and 15 split into keep and replace halves. |
