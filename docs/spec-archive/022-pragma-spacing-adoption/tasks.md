# Tasks: Pragma component spacing — the bucket model

> **Cold start:** read [`README.md`](README.md) first. It names the current
> worktree, verified counts, exact resume sequence and the conditions that must
> be true before T008/CP1. The unchecked Phase A tasks remain open because
> evidence registration is not visual fixture or taxonomy closure.

Read [`spec.md`](spec.md) and [`plan.md`](plan.md) first. Work the phases in
order. The four checkpoints are mandatory progression gates. Add an
issue-specific adversarial review only when evidence would open or merge a
bucket or invalidate a model premise; do not create review churn per task.

## The goal, so it is not mistaken

The restyling is largely **already done** on the branch. What does not exist is
a form anyone can review.

The `feat/bf-shared-alignment` reference branch is 456 files and about 46,600
insertions. It is evidence, not a proposal, and it will never be merged as it
stands. The work now is to
**extract the argument** (the bucket table) and then **re-cut the existing diff**
into small pull requests, copying from the branch as a reference implementation.

You are not rewriting. You are not starting over. You are slicing something that
already works into pieces a person can read.

## How to work these tasks

- **Every task ends with a concrete artifact** — denominator rows, measured
  table rows, a checkpoint disposition, a token file, or a cut branch. A task
  that produced none is not finished. Say why and stop.
- **One row per spacing-owning part**, not per component. Columns:

  | Witness/part | Owner selector | Package | Tier | Variant/state/host | line-height | borders | v-start/end | h-start/end | gap/canvas/compensation | H-start/end candidates | V-start/end candidates | Evidence/notes |

- **Measure in the browser.** Computed values from the rendered part, not what
  the CSS intended.
- **The two axes are answered separately.** A part in different groups per axis
  is the normal case and needs no explanation.
- **A near-miss is a finding.** Record the pixel difference; do not fix it
  mid-task.
- **Copy, do not redesign.** During the re-cut, a component that seems to need
  changing is a finding to record, not a change to slip in.
- **Category test:** cluster only parts with the same tier vector and the same
  ownership/behaviour contract. Normalize real borders to outside-edge insets;
  record internal gaps, marker canvases and compensation separately. Same pixel
  value does not merge unlike owners, and different component names do not
  split interchangeable contracts.
- **Stop and ask, in one sentence, if**: a task needs something on the spec's
  out-of-scope list; a component cannot be styled by the shared geometry
  contract alone;
  or a re-cut request cannot be made independently reviewable. Equal-valued or
  unmatched candidate groups are evidence to resolve under the category test,
  not automatic blockers.
- **Do not** write GO/NO-GO verdicts, severity rankings or progress narratives.
  Keep mandatory checkpoint findings and dispositions compact.

## Supporting review record

Four tasks below are marked **CHECKPOINT**. At each one: stop, ask for an
independent adversarial read, **wait for the answer**, disposition every
finding, then continue. CP1 and CP4 require Claude Opus; do not label a review
Opus unless that model actually performed it. Do not work ahead while waiting.

| Review | Reviewer | Status | Disposition |
|---|---|---|---|
| Protocol recut, 2026-09-18 | Three independent denominator, taxonomy and review-protocol agents | Complete | Reopened both axes, moved token generation after CP1, added per-edge/internal-relationship schema, corrected source-backed false assignments, and incorporated all follow-up contradictions. |
| Measurement/ownership checkpoint, 2026-09-18 | GPT-6 Astra | Findings incorporated and corrections rechecked | Corrected owner selectors, joined/nested variants, native residue, per-edge composition, pseudo branches, positions/grid floors and extra-relationship traceability. Independent final recheck found the five evidence corrections addressed. Not taxonomy approval or an Opus substitute. |
| Pre-CP1 evidence/minimisation review, 2026-09-19 | Claude Opus | Complete; 21 findings dispositioned | Identified Continuation as a keyline, compact separation as a possible gap/edge relationship, Nested as a mode rather than evidenced family, the inverted App gap hierarchy, legacy-literal backlog, and two evidence-integrity defects. See `opus-evidence-review.md` and `opus-review-disposition.md`. This does not replace CP1. |
| Audit-composition phase correction, 2026-09-19 | Reference Storybook audit and Playwright evidence | Incorporated; not a production spacing change | The prior visible Card-header offset was wrapper margin collapse through the audit headings, not a new category. Grid containment now preserves typography compensation; `aligns focused section entry and Card text to its reference while tracking phase debt` checks the fixed BF-origin reference plus a +1px negative control. Shared typography residual and complete-denominator downstream phase debt remain explicit, so CP1 stays not ready. |
| Extra-owner adversary reconciliation, 2026-09-19 | Typed extra-owner registry and focused browser review | Incorporated; not taxonomy approval | `extra-side-navigation-nav-group-header/relationship-1` routes to both provisional Continuation and Field; `extra-git-diff-row-margin-correction/relationship-1` remains unresolved/mismatch; Switch Marker and navigation-row Control-row dependencies are exposed; duplicate pseudo display is deduplicated. The relationship-ID reconciliation and state/fixture closure blockers remain. |

## Mandatory checkpoint status

| Checkpoint | Required reviewer | Status | Entry condition |
|---|---|---|---|
| CP1 / T008 | Claude Opus | **Not ready** | No deferred positive owners or interactions; complete aligned fixtures; final minimisation attempted; App gap order and typography phase resolved; token-owner assignments no longer null. |
| CP2 / T013 | Independent adversarial review | Blocked by CP1 and T009 | CP1 corrections incorporated; semantic token file and contract PRs drafted. |
| CP3 / T017 | Independent adversarial review | Blocked by CP2 and T015 | First consuming family cut and measured without private exceptions. |
| CP4 / T027 | Claude Opus | Blocked by CP3 and T018–T026 | Complete re-cut sequence and final token reconciliation exist. |

Current CP1 evidence: 178 catalog IDs × three tiers = 534 observations;
536 ledger spacing facts (524 observed, 12 in four source-only boundaries);
456 bucket routes across 180 horizontal and 186 vertical measurement targets;
20 stateful targets awaiting safe activation; and 56 source owners / 95 measured,
bucket-routed spacing facts awaiting isolated axis-page fixtures. Every final
`categoryAssignment` remains null. The strict evidence gate and bucket browser
proof pass, but neither grants semantic approval.

## Current resumption sequence

### R1 — SideNavigation group-header fixture promotion (complete)

This was the first authorized implementation batch. It promoted one real owner
from text-only deferred evidence to a repeated, relationship-specific visual
witness without changing production geometry.

| Relationship | Required proof |
|---|---|
| `extra-side-navigation-nav-group-header/relationship-1` | On `.ds.side-navigation .ds.nav-tree > .group > .header`, logical start reaches the Continuation keyline and logical end consumes the Field inset. Test both group headers in LTR and RTL. |
| `extra-side-navigation-nav-group-header/relationship-2` | The same two headers' block padding, border and compensation follow the Control-row contract. |

Edit only the needed fixture/catalog/test files in
`H:\WSL_dev_projects\pragma\.claude\worktrees\feat-bf-shared-alignment`:

- `packages/react/ds-global-form/src/storybook/react-pilot/ReactAppCatalog.tsx`
  — give the existing `app-shell` specimen two navigation groups;
- `packages/react/ds-global-form/src/docs/examples/ReactAlignmentLab.catalog.ts`
  — add `alignment-side-navigation-group-header`, horizontal + vertical,
  `minimumTargets: 2`;
- `packages/react/ds-global-form/src/docs/examples/SpacingAudit.catalog.ts`
  — preserve the two exact owner relationship IDs and route H to
  Continuation + Field and V to Control-row;
- `packages/react/ds-global-form/src/docs/examples/SpacingAudit.extra-owners.ts`
  — remove only this promoted owner from the deferred registry;
- `packages/react/ds-app/tests/SideNavigation.spacing.pw.ts` and the Form
  registry/browser tests — prove the repeated LTR/RTL owner and update counts.

Do **not** pull the SideNavigation root/tree/group gaps, list floor, fade
clearance or sticky-fade compensation into R1. They are separate relationships.
Do not alter SideNavigation production CSS.

Achieved count movement: H witnesses 179→180; V 184→185; deferred owners
58→57; deferred relationships 98→96 (H 45→44, V 53→52). The refreshed Spec
022 collectors captured all three tiers and the strict verifier passes with no
open relationship. The bounded adversarial review passed after requiring (a)
an explicit 67-owner partition and (b) both headers' absolute Field-end inset
across Site/Docs/App, 16/18px roots and LTR/RTL. R1 adds or merges no category.

### R2 — standalone Card-header edge fixture promotion (complete)

Promote `extra-card-header-standalone/relationship-1`, selector
`.ds.card-header:not(:has(+ .card-content))`, vertical `padding-block-end`,
from the deferred registry to a real V-only page witness. Its provisional route
is `container`; no final category assignment follows from this batch.

Required fixture and proof:

- Add at least two real unjoined Card headers in the existing `card` specimen:
  one header-only Card and one header-plus-footer Card without Content. Keep
  both in the real `Cards`/master-grid context alongside the two joined headers.
- Narrow the existing `alignment-card-header` witness to joined headers before
  adding the unjoined targets. Its zero end seam must not be attached to the
  standalone nonzero edge.
- Add `alignment-card-header-standalone` with the exact extra-owner selector,
  vertical axis only, `minimumTargets: 2`, and retain the exact relationship ID
  through its page-witness alias and provisional Container route.
- Prove joined `padding-block-end: 0` versus standalone Surface/container end
  16/16/12px at a 16px root, then cover both targets at 16/18px roots in
  Site/Docs/App. Account for shared-row stretch separately from owned padding.
- Measure the Card-header text baseline against the appropriate same-tier
  typography reference as a separate assertion. A correct inset does not close
  baseline-phase debt or excuse text falling off the baseline grid.
- Remove only this owner from the deferred registry and add it to the explicit
  represented-through-page-witness exclusion partition. Do not change Card or
  Cards production CSS.

Likely reference files are `ReactGlobalCatalog.tsx`, both alignment/audit
catalogs, `SpacingAudit.extra-owners.ts`, and their registry/browser tests.
Refresh `evidence/page-witness-reconciliation.json`, all collectors and the
strict verifier in the evidence worktree.

Achieved movement: H witnesses remain 180; V 185→186; memberships 456→457;
deferred owners 57→56; deferred relationships 96→95 (H 44 unchanged, V 52→51).
The 178 catalog witnesses, 535 ledger relationships and 67-source extra
denominator remain unchanged. The real fixture made the old
`card-header-unjoined` DOM mutation obsolete, so the collector now uses two
direct owner targets instead. Static/unit/type checks, the focused edge and
phase browser tests, bucket routing proof and the strict evidence verifier all
pass. Stop now for an ordinary R2 adversarial review; do not request Opus unless
the evidence changes a taxonomy premise.

The first R2 adversarial read found two proof defects, now corrected:

- joined relationship 4 is scoped to
  `.ds.card-header:has(+ .card-content)`, so its zero-seam capture cannot include
  standalone 16/16/12px ends;
- the four real Card `h4` baselines are captured directly in every tier/root
  pair. Exact snapshots expose unresolved BF-origin debt in all six cases and
an additional joined/standalone phase split in App. The test does not loosen
tolerance or treat correct padding as typography closure.

The final R2 adversarial recheck passed the bounded promotion in both DPR1 and
DPR2. It retained the Card-heading phase debt as a CP1 blocker and found no
reason to add or merge a spacing category. No Opus review was requested.

### R3 — Accordion root-gap fixture promotion (active)

Promote `extra-accordion-root-gap/relationship-1`, selector `.ds.accordion`,
vertical `gap`, to a V-only `alignment-accordion-root-gap` witness. Preserve its
provisional `intrinsic-gap` / `mismatch` disposition: its current Site/Docs/App
vector is 8/4/4px, not the Compact-separation 8/8/8px vector. Do not mint a
category merely because the values differ.

Required fixture and proof:

- Render at least two real Accordion roots, each with at least two direct Items;
  include expanded and collapsed items without fabricating DOM states.
- Measure the root-owned direct item-to-item gap in Site, Docs and App at 16px
  and 18px roots. Keep it separate from summary/item padding, panel inset and
  the unresolved Accordion-body Continuation keyline.
- Add an exact V-only page-witness alias and route only relationship 1 to
  `intrinsic-gap` with `mismatch` status. Remove only this owner from deferred
  records and add it to the represented-owner partition.
- Do not change Accordion production CSS or reinterpret the existing panel
  mismatch as root-gap evidence.

Reference edits should be limited to
`packages/react/ds-global-form/src/docs/examples/ReactGlobalCatalog.tsx`,
`ReactAlignmentLab.catalog.ts`, `SpacingAudit.catalog.ts`,
`SpacingAudit.extra-owners.ts`, and their static/unit/browser tests. In the
evidence worktree, add the page alias to
`evidence/page-witness-reconciliation.json` and regenerate the collectors and
ledger; do not hand-author captured values.

Expected successful movement: H witnesses remain 180; V 186→187; bucket routes
456→457; deferred owners 56→55; deferred relationships 95→94 (H 44 unchanged,
V 51→50). The 178 catalog witnesses, 536 ledger spacing facts and 67-source
extra denominator remain unchanged. Refresh all evidence, run the strict gate,
then stop for an ordinary R3 adversarial review. Do not request Opus unless the
evidence changes a taxonomy premise.

For every active batch, run the exact reference and evidence commands in
[`README.md`](README.md), then stop for its specified ordinary issue-specific
adversarial review. This is not CP1 and must not be labelled Opus. Incorporate
the findings before selecting the next batch.

### R4 — Accordion Continuation-keyline correction (implementation and evidence
complete; adversarial review pending)

The audit working tree had regressed the expanded panel's body text to 16px
before the header label by treating both inline edges as Surface insets. The
clean recut stack already retained the correct Continuation start. The reference
implementation now makes the composition explicit: Continuation at inline-start
and Surface at inline-end. This is not another spacing category. R4 remains
separate from the root-owned vertical gap in R3.

Implemented reference proof:

- a minimal expanded Accordion fixture measures the header label and
  first panel text directly in Site, Docs and App, at 16px and 18px roots, LTR
  and RTL;
- the production panel inset has a measured logical-start delta of
  exactly 0px without changing the summary's marker canvas or the root item gap;
- the focused browser check passes Site/Docs/App, 16px/18px roots and LTR/RTL.
- splitting the two logical inline edges removes one redundant body-to-Container
  route (457→456) and adds one real catalog spacing fact (535→536).

Still required: add wrapped-heading and multi-paragraph coverage, rerun the
focused browser check, evidence collectors and strict verifier, then request an
ordinary issue-specific adversarial review.

Do not mint an Accordion-only token. If the correction cannot consume the
Continuation contract by composition, stop and reopen the contract decision.

### R5 — in-page human-audit closure (after R3/R4 evidence refresh)

The short hand-authored rows are orientation examples, not the completeness
claim. The selected bucket view is the one atlas and must eventually render
every basic spacing-owning part in place; do not create or rely on a separate
component atlas.

Close these visible comparison gaps with minimal real-part fixtures driven by
the same bucket registry:

- horizontal Field: include representative text-like, select-like, file/range
  and app-row owners;
- horizontal Command and Marker: include product Button forks, menu/combobox
  actions, Breadcrumbs, navigation/tree rows and announcement/status markers;
- horizontal Continuation: show Accordion panel text, SideNavigation item/group
  copy and FileTree depth examples together;
- horizontal Container: show RichChoices, Card, Tile, Tooltip and Popover,
  keeping Accordion's Continuation start visibly separate from its Surface end;
- vertical Control row: add Chip, product Button, menu/combobox/file rows and
  representative application rows;
- vertical Compact separation and Container: include Announcement, Tooltip,
  Popover and RichChoices as well as Card/Tile/Accordion parts;
- unboxed/boundary text: include heading, paragraph/link, list, block code and
  inline code/keyboard-key roles only where they independently own or constrain
  spacing; and
- tight-host fit: show the ordinary and explicitly supported host forms in each
  approved host class (table/cell, tabs, side navigation). A descendant must not
  become dense merely because of arbitrary ancestry.

Every fixture must measure the real owner element and preserve the active
baseline phase. Wrapper padding, viewport-relative spacing and whole composite
screens are forbidden as comparison evidence. Aggregate forms remain excluded
unless their wrapper owns a new spacing relationship.

---

## Phase A — build the argument

Current artifacts: `evidence/{global,form,app,styles}-owners.json` disposition
178 catalog witnesses plus 67 extra owners/boundaries.
`evidence/measured-relationships.md`, `owner-ledger.json` and
`relationship-ledger.json` join those hypotheses to browser evidence. Reproduce with Node:
`node evidence/measure-spacing.cjs`, `node evidence/measure-variants.cjs`, then `node evidence/build-ledger.cjs`
from this spec directory. Node is needed for the local Playwright transport;
Bun remains the repo package manager. Successful captures do not complete the
tasks below while additional owners, variants or semantic exceptions are open.

- [ ] **T001** Freeze the foundational denominator in
  [`component-bucket-matrix.md`](component-bucket-matrix.md). Account for every
  public React primitive and reusable pattern, decompose every composite into
  independently spacing-owning parts, and prove each `N/A` or boundary. Exclude
  aggregate workflows such as login forms when they add no new spacing owner;
  inventory a new wrapper if they do.
- [ ] **T002** Measure every denominator row across Site, Docs and App in its
  relevant states and contexts. Populate [`bucket-table.md`](bucket-table.md)
  from computed rendered values. A row may cite a measured equivalent only when
  the shared selector/contract is proven. No `Provisional` row remains.

  Work in this order so taxonomy-changing evidence lands first:

  1. **Taxonomy-breaker batch:** Button plain/icon/link; Chip default,
     nested candidate and dismiss relation; Badge default/nested; InlineCode;
     KeyboardKey; RichChoices card; Card header/content/footer; Tile
     header/content; Accordion summary/panel; Popover/Tooltip panels;
     Announcement frame; ContextualMenu item/submenu item; Combobox option;
     FileUpload file row; Text/Select input; Checkbox/radio/switch rows; Tab;
     SideNavigation item/group heading.
  2. **Foundational reconciliation:** disposition all 66 global and 54 form
     witnesses as token owner, supporting evidence or non-spacing
     boundary, then fill every token-owner row.
  3. **Reusable app reconciliation:** disposition all 58 app witnesses,
     including SideNavigation, EditableBlock, FileTree, GitDiff,
     MarkdownEditor and TokenTable.
- [ ] **T003** Cluster every measured part independently on the horizontal and
  vertical axes. Treat all named groups in the spec as candidates. Keep
  Block-derived, Layout-owned and other proven non-owners as boundary
  classifications rather than inventing tokens. List every non-match with its
  measured delta or semantic ownership difference.
- [ ] **T004** Compare the evidence-derived clusters with the Canonical matrix in
  [`contracts/pragma-migration-ledger.md`](contracts/pragma-migration-ledger.md).
  Use it as a post-clustering comparison, not as the classifier. Report any
  cluster whose measurement does not match the token it appears to claim.
- [ ] **T005** Resolve the open distinctions named in the plan from measurements:
  bare versus painted marker-led rows; a bordered field's trailing edge; padded
  component/control versus padded container/region on both axes; and Card/Tile/
  panel block patterns.
- [ ] **T006** Close every near-miss from T003: correct the component, merge the
  groups, or record why it stays an exception.
- [ ] **T007** Minimise and demonstrate the candidate taxonomy. Attempt every
  plausible merge and retain a split only with a measured/semantic
  counterexample. Every bucket needs two independent witnesses or a documented
  unavoidable singleton. Check the two red/blue pages: every proposed bucket
  has a real specimen, and members line up. Both axis pages must contain their
  complete aligned foundational-part atlas in-page: every included basic
  component, independently spacing-owning subpart, and reusable pattern
  primitive is visible in the relevant bucket or unresolved lane. Do not defer
  coverage to a separate atlas page. Aggregate workflows such as a login form
  remain excluded when they introduce no new owner. Prove the live baseline
  phase of representative specimen/text starts across Site/Docs/App and both
  supported root sizes; checking wrapper token values alone is insufficient.

- [ ] **T008 — CHECKPOINT 1 · CLAUDE OPUS.** Hand
  [`react-visual-poc-opus-review-request.md`](react-visual-poc-opus-review-request.md)
  to Claude Opus with the frozen matrix, complete measured bucket table, source
  denominator and pages. Ask for omissions, unjustified exclusions,
  over-collapsed or unnecessary buckets, axis contamination, and missing real
  specimens. Require evidence/deltas and disposition every finding before
  continuing.
- [ ] **T009** Generate the reviewed spacing tokens in the Canonical
  `@canonical/design-tokens` DTCG 2025.10 source shape, then generate and retain
  `semantic-spacing-tokens.css` as the reviewable CSS output — one token
  family/contract per real bucket, with the related edge, gap, canvas or tier
  properties that semantic job requires. Do not hand-maintain CSS that diverges
  from the DTCG source or Terrazzo output.
  Every bucket maps to a token family; every family maps to an evidenced bucket;
  every spacing-owning row traces each owned edge/relationship to a token or an
  explicit boundary. Names may change; completeness and traceability may not.

## Phase B — cut the contract

T009 completes the design-spike artifact set. T010–T029 are post-spike re-cut
and handover work. Historical `feat/pragma-*` worktrees through navigation
predate the 2026-09-18 checkpoint protocol: they are suspended reference cuts,
do not satisfy T010–T022, and must not be extended or treated as completion.
Phase C is blocked on T013; Phase D is blocked on T017.

Everything from here is re-cutting. Each task produces a branch off current
`origin/main`, containing only its own slice, cherry-picked or copied from
`feat/bf-shared-alignment`.

- [ ] **T010** Cut PR 1 — `packages/styles/typography/src/alignment.css`, the
  `1cap` contract, plus the font-authentication requirement it depends on.
  Nothing else consumes it yet. Include a short rationale in the description.
- [ ] **T011** Cut PR 2 — `packages/styles/main/src/component-contract.css`: the
  row ledger, the box ledger, the four-edge border model and the inline inset
  aliases. Consumes PR 1; still nothing consumes it.
- [ ] **T012** Confirm PRs 1 and 2 together are the whole model and that nothing
  else is needed before a component can consume it. If something is missing, add
  it here rather than later.

- [ ] **T013 — CHECKPOINT 2.** Ask for an independent adversarial read of the
  semantic token file and PRs 1 and 2: is traceability bidirectional, is each
  token one semantic job, is the contract correct and minimal, and is it free
  of private component arithmetic? Incorporate before proposing them.

## Phase C — cut the first family

- [ ] **T014** Cut PR 3 — tier roots: body role and stroke facts on `.site`,
  `.docs`, `.app`.
- [ ] **T015** Cut PR 4 — commands: Button, Chip, Tabs. Include proportionate
  tests for this family only, not the existing suite.
- [ ] **T016** Verify PR 4 is net-neutral or smaller in CSS. If it grows the CSS,
  find out why before continuing.

- [ ] **T017 — CHECKPOINT 3.** Ask for an independent adversarial read of PR 4:
  does the reviewed token model hold end to end without a private exception, is
  the test weight proportionate, and is the description enough for a reviewer
  with no context? Incorporate before cutting anything else.

## Phase D — cut the rest

One family per task. Each ends with a branch and a one-line size report.

- [ ] **T018** PR 5 — fields: single-line native inputs.
- [ ] **T019** PR 6 — markers: checkbox, radio, switch, choices.
- [ ] **T020** PR 7 — attached-edge rows: ContextualMenu, Combobox options,
  Table cells.
- [ ] **T021** PR 8 — surfaces: RichChoices card, Card sections.
- [ ] **T022** PR 9 — navigation: SideNavigation rows and the active-edge paint.
- [ ] **T023** PR 10 — Launchpad: FileTree, GitDiffViewer, Log, editors.
- [ ] **T024** PR 11 — the four product Button forks.
- [ ] **T025** PR 12 — retire the old density system once no React component
  consumes it; the Svelte WPE Button and density documentation are named residue.
- [ ] **T026** Record what was deliberately left behind: the CSS contract scanner
  and its allowlist, the composed catalogs, and the surplus test volume. One
  line each on whether it is worth proposing separately.

- [ ] **T027 — CHECKPOINT 4 · CLAUDE OPUS.** Ask Claude Opus for an adversarial
  read of the complete sequence, final token file, table and disposition log:
  is anything missing, duplicated, accidental or unresolved; is each request
  independently reviewable; and does anything from the branch remain
  unaccounted for? Incorporate before handover.

## Phase E — hand over

- [ ] **T028** Replace candidate language with the CP1-approved category lists
  and final method: two axes, the groups, nesting, border-aware padding and the
  assignment rule.
- [ ] **T029** Hand the sequence and the bucket table to the lead engineer.

---

The work ends at T029. There is no T030.
