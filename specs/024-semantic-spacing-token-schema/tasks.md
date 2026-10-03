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
- [x] **T004d1a** Establish the block-inset value for every control by
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
  **Owner ruling, 2026-09-27:** the exploratory acceptance is Chromium DPR 1
  only, across the four members, Site/Docs/App and roots 16/18. Targets are
  40/32/32 then 45/36/36. Persist the required per-edge measurements and hashed
  manifest, add the comparison sheet, and retain the static product-Button-fork
  assertion. The six-engine/DPR matrix from the Opus junction review is
  explicitly deferred to CP2 under FR-046b and MUST NOT be reimposed here.
  Use the bound 6106 Button/Chip and 6107 Form/Select lanes. Write JSON with
  `testInfo.outputPath`, attach by path and hash every record in the manifest.
  Leave the reset re-execution edits dropped until this task resumes. At that
  point reconstruct only the runner output-path fix and the correction that
  measures the border on the composite wrapper while measuring padding on its
  input. The reset edits may not be fully recoverable; verify
  `.storybook/form-spacing-contract.css` independently before reconstruction.
  **Attempt history:** the four-file candidate produced diagnostic Chromium DPR
  1/2 results of 12/12 and 8/8 but did not satisfy this acceptance. Preserve it at
  `refs/recovery/spec-024/pragma/t004d1a-candidate-20260923`, commit
  `d41000e69a7f2b096b7855b272e95ccb8909696e`, tree
  `be76d8d52c05032248633f98c2cec973f1b95548`, parent
  `313ee82c13a126b779b9bd75902da5af13c28505`; it is custody, not acceptance.
  **Completed 2026-09-27:** Pragma commit `99ce3fa36` executes the bounded
  Chromium DPR 1 contract on ports 6106 and 6107. The focused runs passed 5/5
  and 4/4, covering all four members, three products and roots 16/18. Evidence
  is at
  `H:\WSL_dev_projects\temp\spec-024-t004d1a-evidence-20260927-final2`;
  `manifest.json` SHA-256 is
  `0d43b3f717f0beef0184fa7f14652f36133567015b128814f9b223eb5d2ba21c`.
  It hashes 19 source files, all 16 persisted/path-attached JSON files and 14
  comparison artifacts. The eight unique measurement payloads contain 24
  product records with OS `null`; the path attachments duplicate those
  payloads by design. This completes the task evidence, not an independent
  review of it.
- [x] **T004d2** Implement the two computed rhythm terms per §7a — a phase term
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
  Confirm one-line alignment for all 18 product/heading combinations. Treat
  Site H1–H4, Docs H1–H6 and App H1–H4 as cross-size evidence because their
  heading size differs from body. Confirm 2/3-line alignment only for the eight
  whole-multiple combinations; the ten non-qualifying combinations are CP1
  type-scale exceptions for wrapped headings only. Show Site H3, Docs H3 and
  App H1 as explicit wrapped failures, and do not patch typography to make them
  pass. Retain same-line-height Site H5/H6 and App H5/H6 as arithmetic formula
  controls rather than independent cross-size evidence. The
  `test/spacing-model.test.ts`, `scripts/check-css-contract.test.ts` and
  `packages/svelte/ds-app-launchpad/scripts/check-packed-export.ts` must stay
  green unmodified.
  **Approved to proceed independently of T004d1a.** The mechanical
  `text-alignment.test.ts` correction is limited to applied-ledger and
  phase/closure-alias assertions. Its nudge mappings, padding-block-end zero,
  inline-code exclusions, tier publication and export-boundary assertions stay
  unchanged, as do the three external gates named above.
  **Adversarial follow-up, 2026-09-27:** T004d2 does not feed CP1 until the owner
  rules on its text-stack geometry. At a 16px root, body and code phase are
  Site/Docs/App = 0/4/4px. Rhythm-step closure adds 16px to every text element's
  occupied contribution: measured one-line examples are Site paragraph 32→48,
  Docs/App paragraph 24→40 and Site H1 56→72. Keep the model unchanged and show
  the previous ledger beside the new one for a heading, two paragraphs and a
  list in each product. Retain one Chromium DPR 1 computed-value proof for
  `round(up, …)`. The corrected rendered probes measure Site `0–0.219px`, Docs
  `0.531–0.766px` and App `0–0.609px`; the previous `0.05–0.34px` record was a
  formula estimate. Carry the actual residual to T004h/CP1 as metric-authority
  debt, and do not treat the `1px` regression guard as acceptance. Before
  T004g, disposition the fact that
  closure is a margin and therefore collapses with neighbouring margins or can
  be replaced by a component-owned `margin-block-end`. Strip the evidence-only
  `Spec 024 · T004d2` story marker during the post-CP2 recut.
  **Owner ruling, 2026-09-28:** accept full body-line closure, including the
  additional blank body line after ordinary paragraphs and list items. The
  comparison in local Pragma commit `049e54d2f` contrasts it with closure to
  the 8px/4px baseline unit: the lighter alternative remains on the baseline
  grid but moves the following paragraph 8px within the 24px/20px body-line
  cycle. Preserving the common body-line phase governs, so the added whitespace
  is intentional and T004d2 may feed CP1. For the spike, margin collapse
  against zero block-start margins is accepted; component CSS must not replace
  `margin-block-end` without composing the closure.
  Carry separately to CP1 and T004g that the proposed gap scale is
  baseline-unit aligned but not body-line aligned: Site element/group/pattern
  gaps are 8/24/64px against a 24px body line, while Docs/App gaps are
  4/16/32px against a 20px body line. A gap between blocks can therefore move
  following text out of rhythm with an adjacent column even when both blocks
  begin on the baseline-unit grid; T004g must not silently treat those two
  alignment claims as equivalent.
- [x] **T004e — dispositioned, deferred to Spec 020b.** Do not author grid
  values in this programme. During T004g, delete the reference's
  `--grid-gutter` and `--grid-margin` redirects so they no longer bind to a
  component inset; author no replacements.
- [x] **T004f — removed from pre-CP1.** The reference density entry point is an
  intentional no-op and FR-037b supersedes the outside-in matrix. Carry the
  live `origin/main` matrix and compatibility aliases as mandatory T017a
  migration inputs instead of recalculating them here.

- [x] **T004g — RELEASED by the 2026-09-28 owner decision.** Map shallow Section
  to the surface inset and default/hero/deep Section to the strip inset. Strip
  and Section express the same major page-section inset magnitude: changing
  that rhythm should change both. Their difference is edge application, not
  magnitude — Strip applies the value at both block edges while Section applies
  it at its relevant section edge. This satisfies FR-042 without a fifth inset
  member or FR-050 channel. Delete `--spacing-gap-section-block` and update its
  three test consumers with that decision. The bordered Section box also
  deletes its local block-inset override and inherits the framed-box surface
  inset. Apply the FR-043 gap scale —
  element 8/4/4, group 24/16/16, pattern 64/32/32 — and remove `section`. Every
  step changes from what the provider resolves today; applications double at
  `group` and `pattern`.
  The writable list is exhaustive: amend only `spacing.css` lines 40–42 to map
  container tight/default/loose to DS element/group/pattern; all other lines in
  that file remain deletions-only. Map form group default to DS element and form
  field block default to DS group, explicitly recording the latter magnitude
  correction. Repoint genuine gap declarations in the named Card, Tile and
  Tooltip owners only after listing their exact files in the T004g record.
  **T004g gap-owner record, before implementation (2026-09-28):** repoint the
  field/element gap fallbacks in exactly these files to
  `--ds-gap-element-block`:
  `packages/react/ds-global/src/lib/component/Card/common/Content/styles.css`,
  `packages/react/ds-global/src/lib/component/Card/common/Footer/styles.css`,
  `packages/react/ds-global/src/lib/component/Tile/common/Header/styles.css`,
  `packages/react/ds-global/src/lib/component/Tile/common/Content/styles.css`,
  and `packages/react/ds-global/src/lib/component/Tooltip/styles.css`. Card
  Header is excluded because its genuine gap intentionally reads the surface
  inline inset, not a provider gap.
  **T004g inset-owner record, before implementation (2026-09-28):** under the
  separate FR-042a padding-owner authorization, repoint every block-padding
  fallback found by the affected-scope sweep to
  `--spacing-inset-surface-block`. The exact files are Accordion
  `common/Item/styles.css`; Card `common/Header/styles.css`,
  `common/Content/styles.css` and `common/Footer/styles.css`; Tile
  `common/Header/styles.css` and `common/Content/styles.css`; Tooltip
  `styles.css`; Popover `styles.css`; and Announcement `styles.css`. These are
  the seven known component cases named in the reviewed plan, expanded to their
  nine exact owning files. This authorization is distinct from the bounded gap
  activation above; no other direct provider-gap consumer moves.
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
  **Completed 2026-09-28** in local Pragma commit `b10c4d541`. The comparison
  story is `work-in-progress-component-section--gap-scale-comparison` on the
  existing 6106 lane. Its 1600px Chromium DPR 1 capture is
  `H:\WSL_dev_projects\temp\spec-024-t004g-evidence-20260928\gap-scale-comparison-1600.png`
  (SHA-256
  `d217549171a293d1de0439361321e47bb2c919e9203dbf7cdeab24dd4e1a3198`).
  The exact sweep returns the six approved boundary hits and no others; private
  gap-channel declarations occur only in `_spike-geometry.css`; the diff adds no
  `--spacing-*` declaration. Focused TypeScript, Biome, static contract and
  Chromium DPR 1 Section/gap checks pass. The complete transition test files
  retain one pre-existing, out-of-scope Timeline mismatch: the assertions pin a
  12px marker while the earlier shared marker-canvas implementation renders
  16px. T004g does not rewrite that assertion opportunistically. No independent
  review is claimed.
- [x] **T004h** Stop for an independent adversarial review of the pre-CP1
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
  **Review packet prepared 2026-09-28:** request
  `prompts/opus-t004h-review-request.md`; evidence root
  `H:\WSL_dev_projects\temp\spec-024-t004h-review-20260928`; top-level
  `manifest.json` SHA-256
  `fc725551630c54ba53a6c84e513949bf579ed95cdeaeb951a9374342c960b032`.
  The validated manifest hashes 40 changed source/test/fixture files, 16
  persisted/path-attached measurement JSON files, 16 comparison artifacts and
  3 supporting files at Pragma HEAD `b10c4d541`. T004h remains open pending an
  independent Opus disposition; T005 has not started.
  **Independent review returned reject, 2026-09-28:** see
  `opus-t004h-review.md`. The formula and owner rulings are accepted, but T004h
  remains open for five bounded P1 corrections: update the stale Section
  `SurfaceFrames` contracts; route ColorInput control chrome through row
  geometry; replace the circular one-line baseline calculation with rendered
  heading/body probes; reset and evidence bare-list margins; and replace the
  synthetic-only T004g evidence with actual Card, Tooltip and Form-field rows.
  The limited correction may amend only the existing T004d2/T004g story and
  test files plus `SurfaceFrames.spacing.tests.ts`,
  `SurfaceFrames.spacing.pw.ts`, form `density.css`, ColorInput styles and its
  focused rendered test. A 6107 form comparison story and story-only CSS are
  authorised because `ds-global` must not depend on `ds-global-form`.
  Repackage with Git blob IDs, carrier isolation from first appearance
  `f93281eac`, the T004d1b 21/21 no-movement result, persisted T004d2 numbers
  and list-inclusive closure evidence. Re-review is limited to these
  dispositions. Do not begin T005.
  **Corrections packaged 2026-09-28:** local Pragma commit `4325f1597` closes
  the five requested implementation/evidence items. Use
  `prompts/opus-t004h-limited-rereview.md` and evidence root
  `H:\WSL_dev_projects\temp\spec-024-t004h-rereview-20260928`.
  Its schema-v2 manifest SHA-256 is
  `b921f2313a04d5a5563fefe176be50ee407e77c3b0a10b204353fb9c9ffd3d13`;
  it validates 45 Git blob-backed source paths, 18 measurement paths, 18
  comparison artifacts and 3 supporting paths at a clean capture HEAD. The
  limited re-review must disposition the corrected rendered residual above
  `0.5px`; T004h remains open and T005 has not started.
  **Limited re-review accepted 2026-09-28, conditional item closed:** see
  `opus-t004h-rereview.md`. F1 is fixed in local Pragma commit `1c2c6ba73` by
  scoping the list-container reset to the same non-`.ds` boundary as list-item
  closure. Typography remains 21/21 and HeadingRhythm remains 3/3. The stated
  probe restores bare-list margins to `0/0`; inside `.ds`, it restores the
  browser-default `1em` margins and the same `1em` last-item-to-paragraph gap.
  In the Docs context that is `14px`, not the review's nominal `16px`, because
  Docs body text is 14px; the result matches the pre-correction behaviour and
  no new fixed margin was introduced. The review's remaining findings are
  downstream records, not T004h blockers. T005 may start.

## Phase 2 — Pragma denominator closure

Owner direction, 2026-09-22 (FR-045): geometry is **re-derived** from the
approved model rather than reconciled relationship-by-relationship against the
historical audit. The tasks below are rewritten accordingly. The existing
evidence stays as the record of what the implementation does today and as the
argument for the taxonomy — it is no longer the work queue, and its 95 open
fixture items are not a prerequisite.

- [x] **T005** Freeze the denominator as the **component inventory**: every
  exported part and its spacing-owning subcomponents, per package. This is
  enumerable from the package exports, unlike a ledger of observed
  relationships.
  **Completed 2026-09-29:** `component-inventory.json` freezes 158 React rows
  with Git blob IDs and SHA-256 hashes; `component-inventory.md` records the
  boundary and package counts. All 142 prior production rows remain present;
  three story-only evidence rows are excluded from the denominator.
- [x] **T005a** Reconcile that inventory against synced Pragma local `main`,
  including Modal and the components migrated upstream. A part added upstream
  since the audit is in the denominator regardless of whether it was ever
  measured.
  **Completed against local `main` `90386bfbf`, equal to fetched
  `origin/main`:** 16 React rows were added for Modal, TooltipEngine, the
  expanded SideNavigation and SidePanel. The artifact
  records 43 changed prior render sources, 94 changed recorded CSS files and
  every added/removed CSS path; prior rendered evidence is historical rather
  than current-main certification.
- [x] **T005b** Extend the inventory to non-React packages that consume shared
  spacing or control-seat channels, starting with
  `packages/svelte/ds-app-wpe/src/lib/components/Button/styles.css`. Add a slice
  or record an explicit boundary.
  **Completed:** 11 Svelte rows cover the direct density/control-seat/grid
  consumers plus the named Launchpad Button, Chip, Select and InputPrimitive
  forks. They authorise no Svelte edits; each awaits a T006 assignment or
  explicit boundary.
- [x] **T006** For each part, apply the model in
  `contracts/semantic-spacing-schema.md` §7a and record its role assignments per
  axis and edge. Parts that own no spacing get an explicit boundary line.
  Record ColorInput's popover separator row as an exception: it has a start
  border but no end border while inheriting symmetric host row padding. At
  recut, prefer routing it through its own per-edge box borders rather than
  nominal host-border subtraction. ColorInput is outside T004d1a's four-member
  denominator.
  **Completed 2026-09-29:** schema-version-2 `component-inventory.json`
  resolves all 169 rows: 88 have one or more candidate assignments and 81 are
  boundary-only. Eleven candidates are carried into CP1; ten have direct
  component-denominator membership, while `spacing.gap.pattern.block` retains
  its FR-043 page-section candidature without inventing a component member
  across the FR-021 boundary. `scripts/t006-dispositions.ts` asserts exact ID
  coverage and preserves the ColorInput per-edge separator exception.
- [x] **T007** Build the completeness sweep required by FR-045a: a check that
  reports every hardcoded length remaining in a migrated package's CSS. A
  package is complete when the report holds no undispositioned literal.
  **Completed 2026-09-29:** the deterministic report covers 239 CSS files and
  all tracked TS/TSX/Svelte source in thirteen package roots at synced Pragma
  `main` `90386bfbf`: 1,597 syntax occurrences, 2,575 individual alias
  references, 28 semantic findings, and zero undispositioned records in every
  lane. Direct literals are never promoted from candidate membership alone.
- [x] **T008** Confirm the re-derived geometry on comparison sheets (FR-046),
  one per product: rows led by their reference — Button for boxed text,
  paragraph for unboxed, Card for panels — with the guides overlaid. Read that
  text sits on a shared baseline across each row and the guides are equally
  spaced. Keep the mechanical alias assertion (FR-033) and the unmigrated
  sentinel check, which no sheet can show. Defer exhaustive state, variant and
  product matrices to CP2.
  **Completed 2026-09-29:** the clean current-main-derived capture at Pragma
  `6acc5a29c` compares three heterogeneous owners in each product row, records
  0px spread in all nine groups, proves external-row and per-edge surface
  equations, pins all nineteen FR-033 aliases and hashes all artifacts. An
  independent adversarial rereview accepted the corrected packet with no P1.
- [x] **T009** Record the merge attempts and breakers that justify the role set,
  under FR-042 — a merge requires that changing one role *should* change the
  other, not that their values coincide.
  **Completed 2026-09-29:** `taxonomy-merge-ledger.md` records rejected and
  accepted collapses, 201 direct memberships, and the remaining owner choices.
- [x] **T010** Disposition the legacy literal backlog surfaced by T007:
  normalise to a role, record a bounded exception with an owner and a reason, or
  assign an explicit boundary. No literal may remain unclassified.
  **Completed 2026-09-29:** all syntax occurrences and semantic findings have
  exactly one role, boundary or owned-exception disposition. Classification is
  complete; CP1 approval of the visible exceptions remains open.

  Pre-record these T004g boundaries now; T010 carries them forward rather than
  rediscovering them:

  | Exact path | Disposition | Accountable owner |
  |---|---|---|
  | `packages/summon/application/src/application/react/templates/src/styles/app.css:14,18` | Page/application-shell padding, excluded by FR-021/FR-022 and coupled to deferred grid work | Spec 020b grid/page-shell owner |
  | `apps/react/boilerplate-vite/src/styles/app.css:5,9` | Application-shell padding in an app, not a DS component role | React application-scaffold owner with Spec 020b |
  | `packages/react/ds-app/.storybook/side-navigation-spacing-contract.css:11,51` | Storybook audit fixture; edit only when comparison evidence requires it | `@canonical/ds-app` Storybook/audit-fixture owner |
  | `packages/svelte/ds-app-wpe/src/lib/group/Cards/styles.css:21-22` | FR-036 non-React consumer boundary; do not soften it in this spike | `@canonical/ds-app-wpe` owner |

## CP1 — taxonomy checkpoint

- [x] **T011** Prepare a cold-start review packet containing the frozen
  denominator, proposed inline/block roles, all memberships, merge attempts,
  breakers, unresolved exceptions and proposed final count.
  Include the T004h re-review findings: Chromium loses `1/64px` per closed text
  element because fractional phase padding and closure margin are rounded
  separately; ColorInput's `0.032px` tolerance sits just above `1/32px` and
  must remain tied to that finding rather than widened; and the focused
  ds-global-form suite has an unrelated `ReactPilotCatalogFilter` text-matcher
  failure. Ask the owner to choose both (a) a `<=0.5px` metric-authority bound
  or a device-pixel bound such as `<=1px` at DPR 1, and (b) whether metric
  authority belongs in CP1 or the deferred CP2 engine matrix. The `1px`
  regression guard is not acceptance evidence.
  **Completed 2026-09-29:** `cp1-review-packet.md` is reproducible from the
  synced source and names the denominator, all memberships and breakers, the
  rendered T008 proof, and all remaining exception classes. It asks CP1 to
  approve those classes as bounded recut work or identify exact blocking
  records; it does not treat classification as approval.
- [x] **T011a** Build `scripts/build-visual-gallery.ts` under FR-054f and
  produce the CP1 gallery under FR-054a–c. Before is the spike base
  `313ee82c13a126b779b9bd75902da5af13c28505`; after is the accepted spike tip
  `1c2c6ba73`. Cover every story in the ds-global and ds-global-form
  Storybooks. The header coverage counts show the owner which components the
  proposed model has already moved and which it has not touched yet. Add the
  "where to look" list, at minimum: the extra body line after paragraphs and
  list items, the Docs/App form gap changes, the Card, Tile, Tooltip and
  Popover padding changes, Section, and ColorInput. Link the gallery and its
  manifest SHA-256 from `cp1-review-packet.md`.
  **Completed 2026-09-30:** the local
  [CP1 visual gallery](file:///H:/WSL_dev_projects/temp/spec-024-cp1-gallery-20260930/index.html)
  compares the pinned base and tip at Site, Docs and App contexts for 149
  `ds-global` and 210 `ds-global-form` story entries. It reports zero render
  failures, separates two evidence-only stories from coverage, and hashes all
  2,788 images plus `index.html`. The
  [manifest](file:///H:/WSL_dev_projects/temp/spec-024-cp1-gallery-20260930/manifest.json)
  SHA-256 is
  `eb701f7fccd160bac4612e4fd81f22cde7ab83f6b7846b49235e404a0bb94bbe`.
- [x] **T012** Request an independent Opus adversarial review. Do not proceed
  while the denominator is open, assignments are null or the App gap ordering
  remains contradictory. The request MUST include the T011a gallery, and every
  finding with a visible effect MUST cite its gallery entry (FR-054c).
  **Reviewed 2026-09-30:** `opus-cp1-review.md`, Claude Opus 5.5 subagent of
  the orchestrating session; it did not produce the packet. Verdict: accept
  with bounded corrections. P1-1: paragraph closure and the proposed gap
  values contradict each other (gaps knock text off the body-line rhythm);
  P1-2: the gallery shows the spike's wiring, including six inline gaps still
  rendered from block roles. Eight P2s and six owner decisions are listed
  there.
- [ ] **T013** Incorporate findings and obtain owner approval of the minimum
  taxonomy, including the FR-054d owner visual sign-off of the T011a gallery.
  If findings change any value, regenerate the gallery before sign-off.
  **2026-10-03, FR-062:** split. First recompute the role count and merge
  ledger under FR-060, then present the twelve CP1 decisions with their
  FR-043c–FR-061 resolutions for written approval. The visual sign-off moves
  to the T011b review bench for the recut foundation; the CP1 gallery is not
  signed.
- [ ] **T011b** Build the FR-054g review-bench generator beside
  `scripts/build-visual-gallery.ts`: curated compositions per decision,
  identical DOM, before/after stylesheet toggle, tier switch, overlays,
  per-section status, hashed manifest.
- [ ] **T011c** Commit the body-phase demo as the first FR-054h concept bench
  under `benches/body-phase/`, free of Pragma code, with the relative-shift
  option removed, and add `benches/index.html` listing every open decision:
  body phase, control row, surface insets (FR-060), gaps and seams (FR-061),
  continuation (FR-059), governed density (FR-057).
  **2026-10-03, checkpoint A prepared:** six isolated concept pages plus a
  decision index are implemented under `benches/`. The supplied body-phase
  demo is ported without relative shift, closure-only or JS line-count layout;
  the leading comparison stays. All layout switches use native controls and
  CSS; JS only displays measurements. Existing BF font served over HTTP; no
  font added. Chromium 151.0.7922.34 at DPR 1 passed 82 checks over 57
  comparison states, including no-JS layout equivalence, three prose widths,
  375/768px viewport checks, square actions, bU occupied controls, continuation
  input changes and enrolled-child host fit. Snapped leading passes all 15
  blocks under FR-043d at every tested tier/width and shows no accumulated
  body-baseline drift. Screenshots visually inspected. Evidence lives at
  `H:\WSL_dev_projects\temp\spec-024-checkpoint-a-20261003\`.
  The surface bench labels two unresolved mappings: 16px standard starting
  values versus 12px Docs/App action insets, and the compact block inset.
  Heading leading and the public opt-in class remain owner decisions.
  `opus-A-review-request.md` is the next gate; T011c stays unchecked pending
  actual independent review. No production source, push, PR or publication.
  **2026-10-03, marker correction:** moved each Button baseline marker inside
  its label span. As a direct flex child it incorrectly introduced a trailing
  mark gap (8px Site/Docs, 4px App). The corrected marker contributes no width
  or height in all six tier/mode pairs; baseline spread remains 0px. A fresh
  94/94-check browser capture is preserved separately at
  `H:\WSL_dev_projects\temp\spec-024-checkpoint-a-marker-fix-20261003\`.
  Original checkpoint A evidence is untouched. The independent review now
  present in `opus-A-review.md` accepts A with bounded corrections; this marker
  fix does not discharge its remaining correction list or advance T011c.
- [ ] **T011d — checkpoint A corrections** Discharge the `opus-A-review.md`
  correction list in `benches/`, one atomic `fix(spec-024): …` commit per
  item. Edit concept-bench files only.
  1. F1: add a fractional-scale limit to `benches/README.md` (Inputs and
     limits) and to the T011c entry. Add launch-scale passes at 1.25 and 1.5
     to the evidence driver: launch Chromium with
     `--force-device-scale-factor=S` and use a context with `viewport: null`.
     Context `deviceScaleFactor` emulation does not reproduce border
     snapping. Record the bordered-control and surface shortfalls as
     measured; do not tune values to pass.
  2. P3-1: in Current mode the nested filled surface must use the old
     8/16/8 inset. Scope the 8/16/16 padding to Proposed.
  3. P3-2: give the `gaps-seams` section paragraphs `.text-line`, so they
     carry the nudge.
  4. P3-3: include `borderTopWidth` / `borderBottomWidth` in the seam
     diagnostic in `measure.js`.
  5. P3-4: extend the driver with a no-JS layout comparison for every
     alternative on all six pages, plus numeric assertions that proposed
     surfaces close to whole bU and that plain-section seams equal the
     `group` gap. Narrow the T011c wording if any check cannot run.
  6. P3-5: remove the process ID from `benches/README.md`.
  7. P2-3: add switches to `surface-insets/` so the owner can compare
     alternatives. Docs/App standard surfaces: 16/8 against the action-role
     reading 12/6. Compact block edges: the field-inline value against the
     control block inset and against bU.

  Capture fresh evidence in
  `H:\WSL_dev_projects\temp\spec-024-checkpoint-a-corrections-<yyyymmdd>\`,
  with a hashed `manifest.json`. Leave the original checkpoint A evidence
  untouched.
- [ ] **T011e — stroke concept bench (FR-063g)** Add `benches/strokes/` and
  list it in `benches/index.html` as "Decided; adoption verification
  pending". Use pure CSS, no Pragma code and no font binary, like the other
  benches. Every specimen renders once. A native control toggles between the
  layout-border construction and the FR-063 stroke construction, alongside
  the usual tier, outline and grid switches. The page shows the live
  `devicePixelRatio` and each specimen's computed border width.
  The specimens:
  1. a uniform-ring control (Button-like): occupied size and whole-bU closure;
  2. a mixed per-side field (bottom 2px, sides 1px, different colours),
     using Pragma's physical per-side hook names, at radius 0 and at a
     rounded radius. Show the layer order (FR-063b);
  3. combined states on one composed `box-shadow` list with
     `0 0 0 0 transparent` slot defaults (FR-063c): unfocused,
     `:focus-visible`, invalid, focused-invalid, selected, disabled and
     focusable-disabled. Assert that the assembled value never computes
     to `none`;
  4. a forced-colours policy for the same states (FR-063d): an inset
     boundary outline, and focus as a thicker inset outline. No
     `outline: none` on the paint owner. Invalid and selected keep a
     non-colour cue;
  5. dense nesting: a stroked chip in a plain table row. Host height is
     unchanged (FR-044);
  6. clearance (FR-063e): straight and rounded edges, plus a child with an
     opaque background. Report stroke visibility. Never raise padding;
  7. native controls (FR-063f): text input, textarea, `appearance: none`
     select with its caret, and range. Name each paint owner and appearance
     mode;
  8. nested RTL: a `dir="rtl"` container with a `dir="ltr"` island. A
     logical start stroke flips through the direction sign; physical hooks
     do not flip.

  The evidence driver runs four separate Chromium launches at
  `--force-device-scale-factor` 1, 1.25, 1.5 and 2. It asserts identical
  occupied geometry for the stroke construction at every scale, and records
  the border construction as measured. It captures enlarged edge crops at
  each scale for the sharpness inspection. It runs the forced-colours
  cascade checks under `page.emulateMedia({ forcedColors: 'active' })` and
  records that emulation is not a real Windows contrast theme. The evidence
  root is
  `H:\WSL_dev_projects\temp\spec-024-stroke-bench-<yyyymmdd>\`, with a
  hashed `manifest.json`. List these as pending owner or human steps; never
  claim them: real Windows contrast-theme keyboard checks in Chromium and
  Firefox, and Safari coverage of normal painting and controls.
- [ ] **T011f — checkpoint A2 stop** Write `opus-A2-review-request.md`
  covering T011d and T011e: exact commits, evidence roots, manifest hashes,
  the F1 scale results and the pending human checks. Hand back under FR-054e
  and stop. T011c is checked only when the review confirms that the
  correction list is discharged. No Pragma file may adopt FR-063 until the
  review accepts the stroke bench and the owner signs it off.

## Phase 3 — Pragma foundation and component families

Owner direction, 2026-09-30 (FR-055): components come before tokens. Values
live only in `packages/styles/main/src/spacing-roles.css`, bound to `--ds-*`
properties and annotated with intended token IDs plus Site / Docs / App / OS
values. Do not declare `--spacing-*`. The gallery is the design evidence; add
no new tests while the design is open. Before any push, run Pragma's root
`bun run check` and `bun run test` gates.

- [ ] **T026** Preserve the audited legacy `feat/pragma-*` tips, then sync
  Pragma local `main` to `origin/main` and rebuild the sequential
  foundation/component cuts from that local `main`
  under `recut-handoff.md`; do not rebase the cumulative stack or merge the
  broad reference branch.
- [ ] **T026a** Complete the owner-to-slice partition and per-cut manifest
  planning columns before editing the first final branch. No approved
  relationship may be duplicated or unassigned. Record each cut's real parent
  and provider identities at start, then its gates/size/review state at
  closeout; never invent future SHAs or results. Record activated owners and
  unmigrated sentinel consumers for every sequential merge.
- [ ] **T026b — foundation cut** Re-derive the row contract, typography phase
  and closure, `.ds`-scoped list reset, gap scale and container-gap mapping on
  current Pragma `main`. Add `spacing-roles.css`; remove every production
  `--_spike-*` name and leave all evidence stories and component-specific
  changes behind. Build the before/after gallery for ds-global,
  ds-global-form and ds-app, then stop for FR-054d owner sign-off.
  **Built 2026-09-30, owner sign-off outstanding:** local Pragma branch
  `feat/spacing-inside-out-foundation`, tip `e1b4323db`, on origin/main
  `9249fb300`. Prose outside `.ds` takes the ledger; text inside `.ds` keeps
  main's cap engine, so components are unchanged until their family adopts
  the row. `.editorial` composes its space-after on top of the closure. Bare
  `li` now takes the body text role (Docs/App 16px to 14px). Deliberate
  deviation: the container-gap mapping stays out of this cut, because FR-033
  forbids a foundation cut from moving the pinned alias block; it moves with
  the first family that consumes the gaps. The last commit snaps row paddings
  and each role's nudge and phase to 1/64px, which removes the cumulative
  drift (0 at 100 paragraphs, controls exactly 40/32/32). All 52 pinned alias
  values compare equal to main per product. Gallery:
  `H:\WSL_dev_projects\temp\spec-024-foundation-gallery-20260930` (built
  before the snapping commit; the snapping moves no term by more than
  1/64px).
  **2026-10-03: typography part to be recut under FR-043e.** Replace the
  default body-line closure and the per-role root ledger in `alignment.css`
  with one element-level rule, an opt-in body-phase class, the `.ds` step
  reset and the FR-039b3 heading line-height override. The row contract, list
  reset and gap values stand. The three family cuts restack on the new tip.
  **2026-10-04, FR-063: do this after T011f and the owner's stroke-bench
  sign-off.**
  - The row contract loses its border term: block padding is `inset + nudge`.
  - Add the shared stroke infrastructure: shadow slots defaulting to
    `0 0 0 0 transparent` and initialised on each paint owner, the
    direction-sign rules, and the forced-colours outline pattern. Propose
    slot names in the checkpoint C request.
  - The restacked Commands, Fields and Markers cuts each convert their
    nonempty control boxes under FR-063a–f, or record an FR-063a exception.
  - Fields must rewrite the field focus and error rules in
    `ds-global-form/src/index.css` (around lines 300 and 366) as slot
    updates, must not carry `outline: none` into forced colours, and must
    feed the physical per-side hooks into stroke layers. ColorInput's
    per-edge border subtraction becomes strokes.
  - Do not start the Commands restack until the owner has decided P2-2 of
    `opus-A-review.md`: FR-058 square painted box or square occupied box.
- [ ] **T026c — family cuts** After the foundation sign-off, implement one
  family, build its parent→tip gallery and obtain owner sign-off before starting
  the next. Follow `recut-handoff.md` order: Commands; Field geometry; Select
  artwork if still required; Marker controls; Field copy; Accordion spacing;
  Attached rows; Card sections; Rich-choice card; Surfaces; Navigation;
  Launchpad; Product buttons; Density governance. Record any taxonomy change
  in that family's task entry. Replace the historical density-retirement work
  with governed host/subscriber integration, but do not pre-empt the later
  T017a compatibility disposition.
  **2026-10-04, FR-063:** each later family converts its strokes under
  FR-063a–f. Surfaces and Card sections take stroke slots. Navigation keeps
  SideNavigation's active marker as a selection slot, with a non-colour
  forced-colours cue. Each divider or collapsed table needs FR-063a
  acceptance before conversion. TokenSwatch's inner highlight must keep its
  colour sample: record its paint-origin change in that family's entry.
  **Built back to back 2026-09-30 on owner direction to use the session; each
  owner sign-off is still outstanding, and a rejection restacks the later
  cuts.** All local, unpushed, stacked on the foundation:
  - Commands `feat/spacing-commands` tip `15c6d9e89`: Button, Chip and Tabs
    on the row. Main renders them at 36/36/32 (Button) and 25 (Chip, whose
    tokens were unresolved); now 40/32/32 occupied with the label on the
    body baseline. Gallery `spec-024-commands-gallery-20260930`.
  - Fields `feat/spacing-fields` tip `dfbf7b643`: single-line field chrome
    and ColorInput on the row; main renders 36/36/32. ColorInput controls
    subtract their own per-edge borders. Gallery
    `spec-024-fields-gallery-20260930`.
  - Markers `feat/spacing-markers` tip `30fe15c51`: checkbox, radio,
    switch and choice rows on the row; markers centre on the first line.
    Gallery `spec-024-markers-gallery-20260930`.
  Record for the owner and the lead before any push: controls now drop the
  density seat, so `.dense` no longer shrinks Button or fields; Button and
  field labels follow the product body size (Docs/App 14px); the marker cut
  stops reading two theming hooks (`--form-field-inline-gap` on the toggle
  row, `--form-input-padding-inline` on the choices group); Button's
  icon-leading edge still reads the field inset (CP1 P2-2). The root gate on
  an LF checkout of `5d6f7f110` adds no failure absent on origin/main. The
  whole-stack gallery (main → markers tip) is
  `spec-024-stack-gallery-20260930`, built at `5d6f7f110`, before two small
  fixes from the stack code review (loose-list paragraphs no longer double-pad;
  Tabs rail visible in forced colours).
  **Stack code review 2026-09-30** (`H:\WSL_dev_projects\temp\review\stack-code-review.md`):
  its P1 – list items that contain any `.ds` element keep inherited type and
  the old margins – is kept as designed: removing the guard pushes the item's
  inherited font into components nested in it, and the vanilla-adapter island
  boundary test fails. It is a design question for the owner (should
  components reset their own font), not a bug fix. P2s to raise in the draft
  PRs or fix before them: stale density docs and stories, the half-applied
  `.dense` class, hooks moved from `:root` to the component and removed
  tokens, about 25 `--ds-*` names without readers, unused
  `--typography-*-nudge-block-end` outputs, and squashing the in-stack
  `fix(styles)` commit into the commits it corrects.
- [ ] **T027** Demonstrate automatic Chip density in table, tabs and side
  navigation, standalone default geometry, non-subscriber immunity, reset
  behavior and portal behavior through the family galleries and existing
  runtime checks. Add no new design-locking tests before family approval.
- [ ] **T028** Run root `bun run check` and `bun run test` for every Pragma
  contribution after final rebase and before push; run root `bun run build`
  when artifacts or publishable packages change.
- [ ] **T028a** Request the final actual Opus recut review with exact provider,
  parent, branch, evidence, gate and owner-partition identities. Include a
  gallery whose before is `main` at the start of the recut and whose after is
  the final integration tip, plus the per-cut sign-off record. Incorporate all
  findings and record the FR-054d owner sign-off before human handoff.

## Phase 4 — semantic schema representation

- [ ] **T014** After the last family is visually approved, compare resolver
  cross-product, product-owned private pairs and Canonical-extension density
  representations against the R6 criteria in an isolated design-tokens
  worktree.
- [ ] **T015** Update `contracts/semantic-spacing-schema.md` to the selected
  source representation by transcribing the intended IDs and exact product
  values from Pragma's approved `spacing-roles.css`, without changing primitive
  names. OS remains `null` where Pragma has no surface.
- [ ] **T016** Replace policy placeholders with exact provider, subscriber,
  reset and portal identifiers derived from the implemented family inventory;
  bind each to rendered DOM ancestry or an explicit framework portal adapter.
- [ ] **T017** Define source, resolved, generated and public/private validation
  cases for every product and governed role, including product → host,
  host → nested-product, same-element product/provider and reset → provider
  ordering, plus portal targets inside and outside an approved target-side host.
  Add the transcription check that fails when a value in `spacing-roles.css`
  lacks its intended token ID; this check is authored now, not during the open
  component-design phase.
- [ ] **T017a** Produce a migration disposition for every existing spacing ID
  and public density selector/property/export/documented control, covering
  retention, aliases, deprecations, removals, React and non-React consumers,
  prerequisites and release impact. The live inputs are the
  `.app`/`.site`/`.docs` × `.comfortable`/`.dense` classes in current Pragma,
  its density channels and back-compat aliases, the approved family cuts, and
  the `Density.mdx`, `BaselineGrid.mdx` and `SeatingByElement.mdx` guides.
  Resolve the FR-013 / FR-028 tension recorded in FR-035 here.

## CP2 — schema checkpoint

- [ ] **T018** Request an ordinary schema adversarial review covering faithful
  transcription, DTCG validity, completeness, collision behavior,
  private-channel leakage and runtime cascade semantics. Attach the signed-off
  final component gallery and its manifest SHA-256 under FR-054.
- [ ] **T019** Request Opus review if the selected representation introduces a
  new modifier/builder architecture, public API or cross-repository migration
  premise, with the same gallery as T018.
- [ ] **T020** Incorporate findings and obtain owner approval before token
  implementation. If a finding changes a value, return to the owning family
  cut and regenerate its gallery before changing the transcription.

## Phase 5 — design-tokens contribution

- [ ] **T021** Implement the approved transcribed semantic source, density
  policy, builder and validation in a dedicated design-tokens branch.
- [ ] **T022** Prove complete product × governed-role × density resolution,
  stable public CSS output and exact equality with the approved
  `spacing-roles.css` record.
- [ ] **T023** Prove no public density selector or private property appears in
  public metadata/LSP artifacts.
- [ ] **T024** Generate review artifacts from source and run the design-tokens
  repository gates.
- [ ] **T025** Obtain adversarial implementation review before merge or
  publication. Attach a gallery under FR-054: before is the approved Pragma tip
  using `spacing-roles.css`; after is the same commit locally linked to the
  transcribed design-tokens build. The pair must be visually unchanged unless
  T017a explicitly names a migration effect; every other change is a finding.

## Phase 6 — Jira

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
- Do not request a review from CP1 onward without its FR-054 gallery, and do not
  treat a gate as passed without the owner's visual sign-off.
- Do not start a Pragma cut before the previous cut's owner sign-off is
  recorded.
- Do not retire the independent density axis; remove a legacy public control
  only through the CP2-approved compatibility disposition.
- Do not rebase, delete or repoint the only refs for the historical recut tips
  before recoverable donor refs exist.
- Do not write planning or Jira artifacts into Pragma.
- Do not merge, publish or release from this draft package without separate
  owner direction.
- Do not adopt FR-063 in any Pragma file before T011f is reviewed and the
  owner has signed off the stroke bench.
- Do not cite context `deviceScaleFactor` emulation as fractional-scale
  evidence; use OS scaling or `--force-device-scale-factor`.
- Do not raise padding to fit a stroke (FR-063e).
