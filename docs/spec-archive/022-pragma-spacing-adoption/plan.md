# Plan: Pragma component spacing — the bucket model

> Resume from [`README.md`](README.md). It contains the authoritative live
> counts, worktree roles, current task and CP1 readiness gate.

Companion to [`spec.md`](spec.md). The spec says *what* and *why*; this says
*how we work*. Task list is [`tasks.md`](tasks.md).

## Approach

Four steps, repeated over batches of components:

1. **Enumerate** every rendered part that owns a horizontal or vertical spacing
   edge. Public components and patterns are the bounded source denominator;
   assembled examples such as login forms add no row unless they introduce a
   new spacing-owning part.
2. **Inspect the existing implementation** from the inside out — line-height,
   owned block edges, then inline edges and intrinsic gaps. During evidence
   collection do not restyle a mismatch away; record it for T006 disposition.
3. **Measure** the real rendered part that owns each padding edge. Computed
   values from the browser, not the values we intended.
4. **Group and minimise** horizontally and vertically, independently. Record
   the row, then try to merge candidate groups and retain only the splits with
   measured semantic counterexamples.

The running record of step 3 is the **bucket table**. It is the working artifact
of this spike and the input to the token list at the end. The complete coverage
denominator is [`component-bucket-matrix.md`](component-bucket-matrix.md);
measured values and group decisions live in [`bucket-table.md`](bucket-table.md).
Every task either completes the part denominator, resolves matrix rows, adds
measurements, or closes a category conflict.

## What already exists and is reused

- [`contracts/pragma-migration-ledger.md`](contracts/pragma-migration-ledger.md)
  — the resolved Canonical matrix. Field, Action and Continuation insets, mark
  gap, surface block/inline, and the gap scale, per Site/Docs/App. These are the
  prior design-system expectations to compare after evidence-derived
  clustering, not an oracle, classifier or second production token source.
- [`contracts/baseline-alignment.md`](contracts/baseline-alignment.md)
  — the technical contract: the block ledger arithmetic, font authentication,
  evidence rules, and a "reusable composition parts" table that already states
  the assignment rule ("authors choose the closest known part; they do not
  invent a component-specific spacing formula").
- The two red/blue Storybook pages, horizontal and vertical.
- The React source inventory script. **As a checklist of what to work through,
  and nothing else.** Its completeness is not a gate.

Older exploratory reports moved to `archive/`. The root-level spec, plan,
tasks, bucket/matrix documents, current evidence README, checkpoint request and
latest review dispositions remain live. Use the authority order in
[`README.md`](README.md); use `archive/` only for history.

## Sequence

1. **Complete the denominator.** Reconcile public React primitives and reusable
   patterns, decompose composites into their spacing-owning parts, and record a
   reason for every non-owner. Source rows are the starting checklist, not the
   completion unit.
2. **Seed the table** from the parts already restyled. Establish the column
   shape and treat the existing groups as hypotheses.
3. **Work the remaining components in batches**, one area at a time, smallest
   and most numerous first so the groups stabilise early. Fields and controls
   before composites; composites decomposed into parts.
4. **Resolve near-misses.** A part one or two pixels off a group is the useful
   signal in this whole exercise — it usually means the component is wrong, not
   that a group is missing.
5. **Minimise the categories.** Attempt every plausible merge on each axis.
   Reject a merge only with a measured difference or a distinct ownership or
   state behaviour. Padded controls and padded containers are tested
   separately on both axes.
6. **Check the pages.** Each group and every foundational denominator part
   should be visibly demonstrated by real, baseline-aligned component parts in
   the relevant horizontal and vertical page. The pages are the atlas; do not
   rely on a separate inventory page whose wrapper can hide grid-phase errors.
7. **Run CP1 and incorporate it.** Only after that review is the taxonomy
   stable enough to generate the semantic spacing-token file.
8. **Write up** the method and generate
   `semantic-spacing-tokens.css` from the reviewed table.

## Known distinctions to resolve while measuring

Carried over from the composition-parts table; expect these to shape the
grouping, and settle them from measurements rather than by argument.

- **Bare versus painted marker-led rows.** A checkbox row has no hover or
  selection background, so it adds no outer inset before the marker. An
  accordion or menu row does have one, and needs the Action inset before the
  marker so its paint has room — while the *text* still has to reach the same
  keyline. Same marker-to-text gap in both. Decide whether that is one
  horizontal group with two entry offsets, or two groups.
- **Bordered field with trailing artwork.** A select reserves a fixed canvas
  plus the same inset at the trailing edge. Check whether the trailing edge is
  the same group as the leading edge.
- **Site versus Docs/App tiers.** Docs and App deliberately inherit 14px/20px
  body where Site inherits 16px/24px, so absolute values differ by tier. Groups
  are defined by *which token* a part consumes, not by the pixel value at one
  tier. Record the tier alongside the measurement.
- **Padded component versus padded container.** A Button, field or Tab pads its
  own line; a Card section, Tile region, panel or popover surface pads child
  content. Test them as separate semantic candidates horizontally and
  vertically even when a tier gives them the same value.
- **Container block patterns.** Card and Tile regions already exhibit
  asymmetric 8/16 and 8/8-style block padding patterns in the review record.
  Determine whether those are one container-region bucket, multiple buckets,
  or composition-owned exceptions. Do not preassign them to Regular.

No axis is closed before the full denominator is measured and minimised.
Regular/control-row, compact separation and Surface/container inset are
vertical candidates. Tight-host participation and inside/outside compensation,
region ownership and unboxed text remain modes, implementation facts or
boundaries unless the evidence shows that they need distinct semantic tokens.
The App gap hierarchy must be reconciled before the scale is emitted.

## How this differs from the previous attempt

Stated plainly, because the previous attempt consumed a lot of time.

- The earlier plan required every renderer to be sorted into one of seven
  families. Those seven mixed horizontal insets with vertical behaviour, so the
  requirement could not be satisfied. **Two independent lists replace it**, and
  a component sitting in different groups per axis is the expected case.
- The source inventory is not alignment evidence, but denominator
  reconciliation is mandatory. Every public primitive and reusable pattern is
  accounted for; every spacing-owning subpart is measured; every exclusion has
  a reason. Every included foundational part is rendered in the aligned axis
  pages, even when multiple parts share one proposed bucket. Aggregate workflows
  that introduce no owner remain outside the atlas.
- The earlier plan accumulated review documents, verdicts and severity
  rankings. This plan uses four mandatory progression reviews and records
  findings and dispositions without verdicts or rankings.

## Re-cut for production

The restyling is largely done; what does not exist is a form anyone can review.
The job is therefore to **re-cut the existing diff**, not to rewrite it. Treat
`feat/bf-shared-alignment` as a reference implementation to copy from, in this
order:

| # | Pull request | Why here |
|---|---|---|
| 1 | `typography/alignment.css` — the `1cap` contract, plus font authentication | Nothing depends on it yet; reviewable alone |
| 2 | `styles/main/component-contract.css` — row ledger, box ledger, per-edge border model, inline inset aliases | Consumes PR 1; still nothing consumes it |
| 3 | Tier roots — body role and stroke facts on `.site`/`.docs`/`.app` | First behaviour-visible change, small |
| 4 | Commands — Button, Chip, Tabs | First family end to end; proves the pattern |
| 5 | Fields — single-line native inputs | Largest group, most repetitive |
| 6 | Markers — checkbox, radio, switch, choices | Shares the mark canvas and gap |
| 7 | Attached-edge rows — ContextualMenu, Combobox options, Table cells | Needs the in-box variant from PR 2 |
| 8 | Surfaces — RichChoices card, Card sections | Framed and sectioned parts |
| 9 | Navigation — SideNavigation rows and the active-edge paint | Depends on marker and attached-edge work |
| 10 | Launchpad — FileTree, GitDiffViewer, Log, editors | Most self-contained; safe late |
| 11 | The four product Button forks | Should be trivial once PR 4 lands |
| 12 | Retire the old density system | Only once nothing consumes it |

Rules for the re-cut:

- **One family per request.** Each should be roughly net-neutral in size. A
  request that grows the CSS is a signal that something was missed.
- **Copy, do not redesign.** If a component needs changing during the re-cut,
  that is a finding to record, not a change to slip in.
- **Each request carries its own proportionate tests.** Not the full existing
  suite; enough to hold the contract for that family.
- **Leave the apparatus behind.** The scanner, its allowlist, the composed
  catalogs and the bulk of the test volume do not come along. If any of it is
  worth having in production, it is a separate proposal on its own merits.

## Review checkpoints

Four mandatory progression gates, at genuine decision points. At each:
**stop, ask, wait, incorporate every finding, then continue.** Do not create a
review per task; add an issue-specific review only when evidence would
open/merge a bucket or invalidate a premise of the model.

| Checkpoint | When | What is being asked |
|---|---|---|
| **CP1 — Claude Opus** | Denominator decomposed, completely measured/grouped and minimised, with no provisional rows; before token generation | Is any basic part, edge, tier or state missing; are groups over-collapsed or unnecessary; are the two axes independent? |
| **CP2** | CP1 corrections incorporated; token file and PRs 1–2 drafted | Is bucket↔token traceability complete and is the contract correct and minimal? |
| **CP3** | PR 4 cut | Does the reviewed token model hold end to end at request scale without private exceptions? |
| **CP4 — Claude Opus** | All requests cut and final token file reconciled | Is anything missing, duplicated, accidental, out of order or not independently reviewable? |

Use [`react-visual-poc-opus-review-request.md`](react-visual-poc-opus-review-request.md)
for CP1 after expanding it to cover the matrix, table and source denominator as
well as the pages. CP2 and CP3 can be requested inline. CP4 gets a concise Opus
request once the full sequence exists. Record reviewer, evidence revision,
findings and dispositions compactly; do not create a request/result pair for
every checkpoint or ask for a verdict or severity ranking.

## Risk controls

- **Batch size is small.** A batch is one area, and it ends with table rows. If
  a batch has not produced rows, it is not finished and nothing new starts.
- **Report in tables, not prose.** One row per part.
- **Splits and merges need evidence.** Opening a group requires a measured or
  semantic counterexample. Keeping two groups requires the same. A coincidental
  equal pixel value is not enough to merge unlike owners, and a component name
  is not enough to split like behaviour.
- **Out-of-scope work stops and asks**, in one sentence. It does not start. The
  exclusion list is in the spec and is not advisory.
- **No task invents a successor task.** When the list is done, the spike is
  done.
