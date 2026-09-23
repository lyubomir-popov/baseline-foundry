# Tasks: Semantic spacing-token schema

## Phase 1 — Draft and governance

- [x] **T001** Create an isolated Baseline Foundry worktree and matching
  `feat/024-semantic-spacing-token-schema` branch.
- [x] **T002** Separate primitive dimensions, semantic roles, product resolution
  and governed density in `spec.md` and `research.md`.
- [x] **T003** Draft the semantic DTCG/metadata contract and density-policy JSON
  Schema under `contracts/`.
- [x] **T003a** Record the exact Pragma evidence snapshot, source inventory,
  reproduction commands, known omissions and App-ordering contradiction in
  `evidence-manifest.md`.
- [ ] **T004** Obtain owner review of the scope, density behavior, Jira issue
  wording and schema boundaries before treating the draft as authoritative.
- [ ] **T004a** Send `opus-recut-plan-review-request.md` to an actual Opus
  reviewer, record the model and reviewed identities, incorporate every finding
  and obtain owner acceptance of the corrected recut plan. This is a planning
  review, not CP1 or CP2. **Review complete**: Claude Opus 5, 2026-09-21,
  [`opus-recut-plan-review.md`](opus-recut-plan-review.md), against Pragma
  `origin/main` `1530f3156` and donor tip `9b3c9c41f`. Branch topology
  reproduced; two P0, five P1 and five P2 findings recorded and incorporated
  into `spec.md` FR-033 to FR-038 and `recut-handoff.md`. Verdict: safe for
  owner review once T004c is actioned. **Owner acceptance is still outstanding.**
- [x] **T004b** Record a scoped owner decision on the collision between the
  proposed taxonomy and the control-seat model already landed upstream
  (`362b612d4`, `9388df0af`). **Decided 2026-09-21, FR-037b**: every outside-in
  construction is superseded by the inside-out composition in FR-039 — the
  `--control-seat-*` rules and the `--density-lh-*` cells that feed them.
  Upstream primitive-token migrations are kept whole and not re-derived
  (FR-037). The FR-037a comparison remains required as evidence and runs after
  T004d.
- [x] **T004c** Commit or `git bundle` the three dirty Pragma worktrees
  (`fix-root-gates`, `feat-bf-shared-alignment`, `feat-bf-metric-nudge`) to
  named recovery refs and add them to the preservation table. Commit this Spec
  024 package too: it is currently untracked on a branch tip dated 2026-09-09
  and shared with `feat/023-tiered-list-title-alignment`. No worktree, branch or
  rebase operation in either repository may run before this completes.
  **Completed 2026-09-22**: full working-tree snapshot commits and the later
  Spec 022 execution-amendment/closure snapshots exist at the named
  `refs/recovery/spec-024/...` entries in `recut-handoff.md`. They were created
  through alternate indexes, preserving every source branch, working tree and
  pre-existing staged state. A distinct ref preserves the staged index tree in
  `fix/root-gates`; exact commit, tree and source-tip identities are pinned in
  `recut-handoff.md` and independently verified.
- [x] **T004c0** Created `feat/bf-inside-out-geometry` at
  `.claude/worktrees/feat-bf-inside-out-geometry` from exact recovery snapshot
  `313ee82c13a126b779b9bd75902da5af13c28505`. Do not branch from the dirty
  `feat/bf-shared-alignment` ref. The reference and its evidence hashes remain
  unchanged and read-only. Completed 2026-09-22; initial HEAD and branch base
  both resolve to the exact snapshot.
- [x] **T004d0** In that spike worktree only, created
  `packages/styles/main/src/_spike-geometry.css` with the four private channels
  allowed by FR-050, an explicit post-CP2 expiry, and a provider-role annotation
  on every value. Bind `--ds-*` contract inputs there; no component may consume
  `--_spike-*` directly. Completed 2026-09-22. The corrected focused browser
  proof follows the real `component-contract.css` import chain, asserts only
  public DS outputs across root/Site/Docs/App and nested product restarts, and
  passed 24/24 across DPR 1 and 2. Independent re-review accepted the correction
  and confirmed every private-property occurrence remains carrier-local.
- [x] **T004d1b** Extracted the existing `(line-height + 1cap) / 2` expression to
  a named `--_typography-<role>-first-baseline-offset` property for each role in
  `alignment.css`, rewrite the existing nudge calculations to consume it, and
  prove computed geometry is unchanged before using it for phase. Completed in
  the isolated spike 2026-09-22 for all eight production roles; focused
  typography tests passed 20/20 and an independent agent review accepted the
  algebraic/source proof with no blocking findings.
- [x] **T004d** Added the per-edge **block inset** term to the row contract in the
  isolated spike and remeasure, per `contracts/semantic-spacing-schema.md` §7a.
  Read the value through the FR-050 private carrier and `--ds-*` contract; do
  not mint a provider property in Pragma. The current formula is nudge minus
  border with no inset term, which
  yields a 22.3px Docs/App Button against an intended 32px. No control height in
  the evidence may be cited as the model's intended output, and the FR-037a
  comparison may not run, until this lands. Formula implementation completed
  2026-09-22 and independently accepted after the browser proof was corrected
  to paint and measure real per-edge borders, border boxes, occupied distance
  and the content keyline. Focused styles tests passed 11/11 and SharedContracts
  passed 24/24 across DPR 1 and 2. Control remeasurement remains T004d1a.
- [x] **T004d1** Confirm the Site control occupied height. **Confirmed by the
  owner, 2026-09-21: 40px including the margin-bottom compensation**, which is
  what the reference already measures (36.912 visible + 3.088). Site therefore
  takes a zero block inset and only Docs/App take one baseline unit per edge.
- [x] **Recovery stop before T004d1a/T004d2.** Snapshot the fully amended Spec
  024 package to
  `refs/recovery/spec-024/baseline-foundry/pre-t004d2-disposition-20260923`,
  and pin commit `8d29b57e1455205c96b3c56908153391f99b29e6`, tree
  `9e788f3904ff779c45721790ca05f84a694aeb83`, ancestry and object
  connectivity in `recut-handoff.md`. Completed 2026-09-23; no further spike
  edit preceded this checkpoint.
- [x] **Post-junction recovery stop before T004d2.** After dispositioning the
  final Opus execution-junction review, snapshot the corrected cold-start
  package to
  `refs/recovery/spec-024/baseline-foundry/opus-junction-disposition-20260923`.
  Commit `c2df4f0baaf2c74be098116f95b1192a8d8eec3d`, tree
  `517db44c9334827fd78d5fabc4b40a274e653bf2` and source tip
  `c97ae4fca21ee1e87d23b208951abe3ed61a223f` were verified and recorded in
  `recut-handoff.md` on 2026-09-23. No T004d2 spike edit preceded this stop.
- [ ] **T004d1a** Establish the block-inset value for every control by
  measurement, per §7a: set the inset, render, confirm the occupied size lands
  on the target in that product, then fix the value. A predictive rule may
  propose a starting value and check the result for sanity, but the measurement
  is the authority and the rule is never patched to fit. Record OS as `null`,
  not zero; Pragma has no OS surface for this spike.
  **Bounded denominator:** Button excluding `.link`, Chip excluding `.is-nested`,
  composite input chrome and direct native Select chrome. Defer FileUploadInput
  and the named in-box Tabs, ContextualMenu, Accordion, SideNavigation,
  GitDiffViewer and MarkdownEditor rows to T006. Add one static assertion that
  the anbox/landscape/lxd/portal Button forks declare no local row inset, nudge
  or block padding; their rendered proof is T005a. Record the launchpad/WPE
  Svelte Button/Chip/Select/InputPrimitive consumers as the FR-036 T005b boundary.
  For every measured record, resolve and assert inset start/end, nudge start,
  baseline, per-edge computed border/padding, block-end margin, rendered and
  contract occupied size and scaled target; OS is `null`. Assert equal inset
  edges, Site zero, Docs/App one baseline, and each edge's
  `padding = max(0, inset + nudge - border)` identity.
  Button, Chip and native Select have documented borderless waivers. Composite
  chrome must use the documented top/bottom per-side width hooks from an
  existing `.storybook` fixture, with bordered precondition and restoration
  measurements, or record a waiver if those hooks cannot produce a true zero
  edge; do not mutate the internal base-width property inline.
  Capture all six Chromium/Firefox/WebKit × DPR 1/2 projects at roots 16/18 and
  all products. Targets are 40/32/32 then 45/36/36. Chromium retains 1/32px
  authority; Firefox/WebKit record at 0.5px and carry excess rounding to CP1.
  Use the bound 6106 Button/Chip and 6107 Form/Select lanes. Write JSON with
  `testInfo.outputPath`, attach by path and hash every record in the manifest.
  **Attempt history:** the four-file candidate produced diagnostic Chromium DPR
  1/2 results of 12/12 and 8/8 but did not satisfy this acceptance. Preserve it at
  `refs/recovery/spec-024/pragma/t004d1a-candidate-20260923`, commit
  `d41000e69a7f2b096b7855b272e95ccb8909696e`, tree
  `be76d8d52c05032248633f98c2cec973f1b95548`, parent
  `313ee82c13a126b779b9bd75902da5af13c28505`; it is custody, not acceptance.
- [ ] **T004d2** Implement the two computed rhythm terms per §7a — a phase term
  at block-start that lifts the first baseline onto the rhythm step, and a
  block-end closer whose sum includes it. Round up only, context-named rhythm
  step, excluded from the token count and from public output. Use the exact
  private role outputs and additive nudge composition in §7a; do not redefine
  either published nudge property. Authorised files are typography
  `alignment.css`, `elements.css`, `test/alignment.test.ts`, the comparison
  fixture/story, and `component-contract.css` only if a control change proves
  necessary. The source audit adds one mechanical correction to that list:
  `test/text-alignment.test.ts` may change only its applied-ledger and
  phase/closure-alias expectations, because its old declaration assertions
  cannot remain green after the authorised `elements.css` change. Assert
  `mod(line-height, rhythm-step) = 0` per role/product.
  Confirm the heading's own lines on a comparison sheet only for Site H1/H2/H5/H6,
  Docs H1/H2 and App H5/H6. Record the ten other combinations as type-scale
  exceptions carried to CP1; do not patch typography to make them pass. The
  `test/spacing-model.test.ts`, `scripts/check-css-contract.test.ts` and
  `packages/svelte/ds-app-launchpad/scripts/check-packed-export.ts` must stay
  green unmodified.
  **Approved to proceed independently of T004d1a.** The mechanical
  `text-alignment.test.ts` correction is limited to applied-ledger and
  phase/closure-alias assertions. Its nudge mappings, padding-block-end zero,
  inline-code exclusions, tier publication and export-boundary assertions stay
  unchanged, as do the three external gates named above.
- [x] **T004e — dispositioned, deferred to Spec 020b.** Do not author grid
  values in this programme. During T004g, delete the reference's
  `--grid-gutter` and `--grid-margin` redirects so they no longer bind to a
  component inset; author no replacements.
- [x] **T004f — removed from pre-CP1.** The reference density entry point is an
  intentional no-op and FR-037b supersedes the outside-in matrix. Carry the
  live `origin/main` matrix and compatibility aliases as mandatory T017a
  migration inputs instead of recalculating them here.

- [ ] **T004g — BLOCKED only on the CP1 Section choice.** CP1 must either merge
  default/hero/deep onto strip with a written FR-042 argument or mint a Section
  inset member and amend FR-050 for a fifth spike channel. Do not guess. Move
  deletion of `--spacing-gap-section-block` and its three test consumers with
  that decision. The bordered Section box may separately delete its local
  block-inset override and inherit the framed-box surface inset.
  Once the Section decision lands, apply the FR-043 gap scale —
  element 8/4/4, group 24/16/16, pattern 64/32/32 — and remove `section`. Every
  step changes from what the provider resolves today; applications double at
  `group` and `pattern`.
  The writable list is exhaustive: amend only `spacing.css` lines 40–42 to map
  container tight/default/loose to DS element/group/pattern; all other lines in
  that file remain deletions-only. Map form group default to DS element and form
  field block default to DS group, explicitly recording the latter magnitude
  correction. Repoint genuine gap declarations in the named Card, Tile and
  Tooltip owners only after listing their exact files in the T004g record.
  Delete both ColorInput `--ds-box-inset-block` call-site overrides so they
  inherit the framed-box surface inset; do not redefine form-group gap as an
  inset. Every other direct provider-gap consumer, RichChoicesField and form
  instance override stays deferred to T007/T010. Remove `--grid-gutter` /
  `--grid-margin` without replacement and record the resolved outcome of every
  consumer: `packages/styles/main/src/grid.css` takes its 1.5rem fallback;
  `packages/react/ds-global/src/lib/group/Cards/styles.css` and
  `packages/svelte/ds-app-wpe/src/lib/group/Cards/styles.css` lose an
  unfallbacked gap and resolve to zero used gap;
  and the three `apps/react/storybook-hub/src/docs/Grid.stories.tsx` padding
  sites resolve to zero. Do not edit the Svelte Cards boundary.
  Run this reproducible PowerShell equivalent of the reviewed multi-line sweep:

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

  The final result may contain only the six pre-dispositioned app-shell/fixture
  hits: two in the Summon template, two in the React boilerplate and two in the
  ds-app side-navigation Storybook contract. Any other hit blocks completion;
  full completeness remains T007. Confirm on a comparison sheet, not a matrix.
- [ ] **T004h** Stop for an independent adversarial review of the pre-CP1
  geometry work (FR-049): the block inset, the phase and closure terms, the gap
  scale and the inset/gap separation. Package the comparison sheets, the
  measured control values, the no-movement result for T004d1b, the affected-scope
  consumer sweep, and static proof that spike channels occur only in their
  carrier, the carrier exists on no other branch, and no `--spacing-*`
  declaration was added. Include the external port-6106 and port-6107 artifacts,
  the persisted `t004d1a-*.json` measurement records and their complete
  `manifest.json`; the manifest must hash every changed source, test, fixture
  and measurement path present at capture time. FR-033's pinned-alias
  assertion belongs to the later foundation cut, and full completeness remains
  T007. The reviewer must not be the agent that did the work (FR-048). Do not
  prepare the CP1 packet until the findings are dispositioned.

## Phase 2 — Pragma denominator closure

Owner direction, 2026-09-22 (FR-045): geometry is **re-derived** from the
approved model rather than reconciled relationship-by-relationship against the
historical audit. The tasks below are rewritten accordingly. The existing
evidence stays as the record of what the implementation does today and as the
argument for the taxonomy — it is no longer the work queue, and its 95 open
fixture items are not a prerequisite.

- [ ] **T005** Freeze the denominator as the **component inventory**: every
  exported part and its spacing-owning subcomponents, per package. This is
  enumerable from the package exports, unlike a ledger of observed
  relationships.
- [ ] **T005a** Reconcile that inventory against current Pragma `origin/main`,
  including Modal and the components migrated upstream. A part added upstream
  since the audit is in the denominator regardless of whether it was ever
  measured.
- [ ] **T005b** Extend the inventory to non-React packages that consume shared
  spacing or control-seat channels, starting with
  `packages/svelte/ds-app-wpe/src/lib/components/Button/styles.css`. Add a slice
  or record an explicit boundary.
- [ ] **T006** For each part, apply the model in
  `contracts/semantic-spacing-schema.md` §7a and record its role assignments per
  axis and edge. Parts that own no spacing get an explicit boundary line.
- [ ] **T007** Build the completeness sweep required by FR-045a: a check that
  reports every hardcoded length remaining in a migrated package's CSS. A
  package is complete when the report holds no undispositioned literal.
- [ ] **T008** Confirm the re-derived geometry on comparison sheets (FR-046),
  one per product: rows led by their reference — Button for boxed text,
  paragraph for unboxed, Card for panels — with the guides overlaid. Read that
  text sits on a shared baseline across each row and the guides are equally
  spaced. Keep the mechanical alias assertion (FR-033) and the unmigrated
  sentinel check, which no sheet can show. Defer exhaustive state, variant and
  product matrices to CP2.
- [ ] **T009** Record the merge attempts and breakers that justify the role set,
  under FR-042 — a merge requires that changing one role *should* change the
  other, not that their values coincide.
- [ ] **T010** Disposition the legacy literal backlog surfaced by T007:
  normalise to a role, record a bounded exception with an owner and a reason, or
  assign an explicit boundary. No literal may remain unclassified.

  Pre-record these T004g boundaries now; T010 carries them forward rather than
  rediscovering them:

  | Exact path | Disposition | Accountable owner |
  |---|---|---|
  | `packages/summon/application/src/application/react/templates/src/styles/app.css:14,18` | Page/application-shell padding, excluded by FR-021/FR-022 and coupled to deferred grid work | Spec 020b grid/page-shell owner |
  | `apps/react/boilerplate-vite/src/styles/app.css:5,9` | Application-shell padding in an app, not a DS component role | React application-scaffold owner with Spec 020b |
  | `packages/react/ds-app/.storybook/side-navigation-spacing-contract.css:11,51` | Storybook audit fixture; edit only when comparison evidence requires it | `@canonical/ds-app` Storybook/audit-fixture owner |
  | `packages/svelte/ds-app-wpe/src/lib/group/Cards/styles.css:21-22` | FR-036 non-React consumer boundary; do not soften it in this spike | `@canonical/ds-app-wpe` owner |

## CP1 — taxonomy checkpoint

- [ ] **T011** Prepare a cold-start review packet containing the frozen
  denominator, proposed inline/block roles, all memberships, merge attempts,
  breakers, unresolved exceptions and proposed final count.
- [ ] **T012** Request an independent Opus adversarial review. Do not proceed
  while the denominator is open, assignments are null or the App gap ordering
  remains contradictory.
- [ ] **T013** Incorporate findings and obtain owner approval of the minimum
  taxonomy.

## Phase 3 — semantic schema representation

- [ ] **T014** In an isolated design-tokens worktree, compare resolver
  cross-product, product-owned private pairs and Canonical-extension density
  representations against the R6 criteria.
- [ ] **T015** Update `contracts/semantic-spacing-schema.md` to the selected
  source representation and CP1-approved IDs without changing primitive names.
- [ ] **T016** Replace policy placeholders with exact provider, subscriber,
  reset and portal identifiers derived from the implementation inventory;
  bind each to rendered DOM ancestry or an explicit framework portal adapter.
- [ ] **T017** Define source, resolved, generated and public/private validation
  cases for every product and governed role, including product → host,
  host → nested-product, same-element product/provider and reset → provider
  ordering, plus portal targets inside and outside an approved target-side host.
- [ ] **T017a** Produce a migration disposition for every existing spacing ID
  and public density selector/property/export/documented control, covering
  retention, aliases, deprecations, removals, React and non-React consumers,
  prerequisites and release impact. The live inputs are the
  `.app`/`.site`/`.docs` × `.comfortable`/`.dense` classes in
  current Pragma `origin/main`'s
  `packages/styles/main/src/modifiers.density.css`, its twelve `--density-*`
  channels per context, its ten pre-namespace back-compat aliases, and the
  `Density.mdx`, `BaselineGrid.mdx` and `SeatingByElement.mdx` guides. Resolve
  the FR-013 / FR-028 tension recorded in FR-035 here.

## CP2 — schema checkpoint

- [ ] **T018** Request an ordinary schema adversarial review covering DTCG
  validity, completeness, collision behavior, private-channel leakage and
  runtime cascade semantics.
- [ ] **T019** Request Opus review if the selected representation introduces a
  new modifier/builder architecture, public API or cross-repository migration
  premise.
- [ ] **T020** Incorporate findings and obtain owner approval before token
  implementation.

## Phase 4 — design-tokens contribution

- [ ] **T021** Implement the approved semantic source, density policy, builder
  and validation in a dedicated design-tokens branch.
- [ ] **T022** Prove complete product × governed-role × density resolution and
  stable public CSS output.
- [ ] **T023** Prove no public density selector or private property appears in
  public metadata/LSP artifacts.
- [ ] **T024** Generate review artifacts from source and run the design-tokens
  repository gates.
- [ ] **T025** Obtain adversarial implementation review before merge or
  publication.

## Phase 5 — Pragma adoption and Jira

- [ ] **T026** Preserve the audited legacy `feat/pragma-*` tips, then rebuild
  the sequential foundation/component cuts from then-current `origin/main`
  under `recut-handoff.md`; do not rebase the cumulative stack or merge the
  broad reference branch.
- [ ] **T026a** Complete the owner-to-slice partition and per-cut manifest
  planning columns before editing the first final branch. No approved
  relationship may be duplicated or unassigned. Record each cut's real parent
  and provider identities at start, then its gates/size/review state at
  closeout; never invent future SHAs or results. Record activated owners and
  unmigrated sentinel consumers for every sequential merge.
- [ ] **T026b** Review the foundation cuts and then the Commands first-family
  cut at their mandatory handoff boundaries before later families.
- [ ] **T026c** Replace the historical density-retirement task with governed
  host/subscriber integration and the CP2-approved compatibility disposition.
- [ ] **T027** Prove automatic Chip density in table, tabs and side navigation,
  standalone default geometry, non-subscriber immunity, reset behavior and
  portal behavior.
- [ ] **T028** Run root `bun run check` and `bun run test` for every Pragma
  contribution after final rebase and before push; run root `bun run build`
  when artifacts or publishable packages change.
- [ ] **T028a** Request the final actual Opus recut review with exact provider,
  parent, branch, evidence, gate and owner-partition identities. Incorporate all
  findings before human handoff.
- [ ] **T029** Refresh WD-36041 and child metadata through jira-project-bridge;
  reconcile the proposed child against live Jira.
- [ ] **T030** Prepare and dry-run the Jira plan, obtain explicit owner approval,
  apply once, verify and resnapshot.

## Stop conditions

- Do not publish Jira from stale snapshots.
- Do not freeze semantic names from the current 12-token provider before CP1.
- Do not implement density as a public utility or caller-authored arbitrary
  class.
- Do not review your own work where a review is required, and do not record a
  model identity that is not the reviewer's actual one.
- Do not retire the independent density axis; remove a legacy public control
  only through the CP2-approved compatibility disposition.
- Do not rebase, delete or repoint the only refs for the historical recut tips
  before recoverable donor refs exist.
- Do not write planning or Jira artifacts into Pragma.
- Do not merge, publish or release from this draft package without separate
  owner direction.
