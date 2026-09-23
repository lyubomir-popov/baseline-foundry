# Pragma spacing recut handoff

## Purpose

This is the durable execution plan for turning the broad Pragma spacing
reference implementation into human-reviewable contributions. It supersedes
the historical Phase B–E branch instructions in Pragma Spec 022 wherever they
conflict with the approved taxonomy, schema or density contract. Spec 022
remains authoritative for evidence until CP1; this document owns the
cross-repository recut.

The existing `feat/pragma-*` branches are useful donor implementations. They
are not merge-ready branches and none proves that its old task is complete.

## Audited branch snapshot — 2026-09-21

- Pragma upstream: `origin/main` at `1530f3156`.
- Historical recut base: `7193fe082`. The primary `H:\WSL_dev_projects\pragma`
  checkout is also parked here, so the repo root is itself 75 commits stale;
  fetch and move it before running a root gate.
- Upstream movement: 75 commits.
- All ten listed worktrees are clean and the exact branch names are local-only.
- The branches form one cumulative 11-commit chain; later branches contain
  every earlier cut. All nine earlier tips are ancestors of `9b3c9c41f`, so a
  single worktree at that tip reproduces every earlier cut through `git show`.
- A three-way diagnostic of the final stack against current main finds 20 files
  changed on both sides — including `bun.lock` — and 21 conflict markers across
  13 conflicted files, 12 content conflicts plus one modify/delete. Reproduce
  with `git merge-tree --write-tree --name-only origin/main 9b3c9c41f`.
- The modify/delete is `packages/react/ds-global-form/src/density.css`, deleted
  by `c341c30e4` and modified upstream by `38c7e7178`. Excluding the density
  deletion from the Fields cut is therefore load-bearing, not a precaution.
- Current main uses `@canonical/design-tokens` 0.10.0 and
  `@canonical/styles-typography` `^0.40.0`; the old foundation patch would
  restore 0.9.0 and `^0.37.0` assumptions.
- The 69-file figure below is the three-dot merge-base view. Two-dot content
  divergence is 1305 files, +7663/−138165. Neither number is a PR proposal.

| Legacy branch | Tip | Cumulative paths | Incremental paths | Direct upstream overlap | Disposition |
|---|---:|---:|---:|---:|---|
| `feat/pragma-alignment-contract` | `8894e8aa5` | 10 | 10 | 3 | Donor only; rebuild provider/nudge contract |
| `feat/pragma-font-auth` | `0c6a89be4` | 14 | 7 | 2 | Donor only; rebuild focused font fix |
| `feat/pragma-component-contract` | `af37bf40e` | 17 | 6 | 1 | Rebuild after CP2 output exists |
| `feat/pragma-tier-roots` | `1c77df87e` | 20 | 8 | 1 | Revalidate against current typography roots |
| `feat/pragma-commands` | `0d46eb751` | 25 | 5 | 2 | Re-derive Button/Chip/Tabs; retain test intent |
| `feat/pragma-fields` | `c341c30e4` | 43 | 18 | 3 | Split; exclude density deletion and behavior changes |
| `feat/pragma-markers` | `6ed7b6eea` | 54 | 12 | 6 | Split; re-derive marker, field-copy and Accordion work |
| `feat/pragma-attached-rows` | `b4789975a` | 57 | 3 | 1 | Rebuild against current ContextualMenu/Combobox |
| `feat/pragma-surfaces` | `a353b2e50` | 62 | 5 | 0 | Split padded component from sectioned surfaces |
| `feat/pragma-navigation` | `9b3c9c41f` | 69 | 7 | 5 | Reimplement on the current SideNavigation architecture |

The overlap count is risk evidence, not an automatic conflict count. Even the
zero-overlap Surface cut must be rebuilt because its token IDs and category
premises remain provisional. The final navigation branch would show 69 files
and +1552/−1217 lines against main, which is not its actual seven-file slice.

### Recovery snapshots for formerly unrecoverable state

The ten rows above are clean, so preserving their tips loses nothing. Three
further worktrees are **not** clean. They were not protected by any ref when
the plan review ran, so T004c required recovery snapshots before any worktree,
branch or rebase operation anywhere in the repository.

| Worktree | Branch | State | What is at risk |
|---|---|---|---|
| `fix-root-gates` | `fix/root-gates` at `9b3c9c41f` | 44 tracked changes, 85 untracked files | The entire Spec 022 package and ~29 MB of CP1 measurement evidence, plus an uncommitted implementation across Button, Card, Chip, Tabs, Tile, Accordion, ChoicesField, RichChoicesField, `field-geometry.css`, `ToggleWrapper.css` and Timeline |
| `feat-bf-shared-alignment` | `feat/bf-shared-alignment` at `e26c650c0` | 104 uncommitted changes | The measurement reference every Spec 022 capture was taken from; without it no measurement is reproducible |
| `feat-bf-metric-nudge` | `feat/bf-metric-nudge` at `533ae3e1b` | 94 uncommitted changes | Unclassified; disposition required before removal |

`fix/root-gates` shares its tip with `feat/pragma-navigation`, so preserving the
ten listed tips preserves none of its content. `evidence-manifest.md` already
states that the anchor commit cannot recreate the dirty snapshot; this table is
the rule that follows from it.

T004c completed on 2026-09-22 with full working-tree snapshot commits under
custom recovery refs. The snapshots were built with alternate indexes, so no
source branch, working tree or existing staged state moved. `fix/root-gates`
also has a separate index-tree snapshot because it contained both staged and
unstaged changes.
After the Opus execution-readiness review, the required Spec 022 read-only
constraint amendment was captured in a sixth Pragma recovery ref. It is a
child of the original full working-tree snapshot; the source branch, worktree
and index again remained unchanged.

| Repository / source | Recovery ref | Snapshot commit | Tree | Source tip |
|---|---|---:|---:|---:|
| Pragma `fix/root-gates` working tree | `refs/recovery/spec-024/pragma/fix-root-gates-20260922` | `a8e45d8b91b2f6c66c3c6c6a412cf47ae358e310` | `d4c2c91d85db741185c80910c6d6e88ba899428b` | `9b3c9c41f7f6584eb58e4670ef6be34dc49544e1` |
| Pragma `fix/root-gates` execution amendment | `refs/recovery/spec-024/pragma/fix-root-gates-execution-amendment-20260922` | `71219b0e5fb1e663b2e4125dad95a97fb35cc1cf` | `bdce5d4a0ecb18cd2670e088e436dc481430a4d2` | `9b3c9c41f7f6584eb58e4670ef6be34dc49544e1` |
| Pragma `fix/root-gates` execution closure | `refs/recovery/spec-024/pragma/fix-root-gates-execution-closure-20260922` | `64447697fb0447c2dc4a538f0578668bebb7f033` | `ae5c140f9a8eed079d647cc63659f30f35fabf57` | `9b3c9c41f7f6584eb58e4670ef6be34dc49544e1` |
| Pragma `fix/root-gates` read-only pause closure | `refs/recovery/spec-024/pragma/fix-root-gates-pause-closure-20260922` | `a3ca18ccb041290f1e776a6c030999985fe0977d` | `2fa0853be4c9e80a631ea25c15ff7666510d967f` | `9b3c9c41f7f6584eb58e4670ef6be34dc49544e1` |
| Pragma `fix/root-gates` final pause wording | `refs/recovery/spec-024/pragma/fix-root-gates-pause-final-20260922` | `a567f1c51eb41d612f7741246b5041fa1955450a` | `ee8ff4e0962ff6c8c9ad8b567c5fe0b6ca8772bc` | `9b3c9c41f7f6584eb58e4670ef6be34dc49544e1` |
| Pragma `fix/root-gates` staged index | `refs/recovery/spec-024/pragma/fix-root-gates-index-20260922` | `58138b385535716725c7d63202cab8810d341a4e` | `af792db27d7d5dbf993635bc7c8f07c6cd00fd3a` | `9b3c9c41f7f6584eb58e4670ef6be34dc49544e1` |
| Pragma `feat/bf-shared-alignment` | `refs/recovery/spec-024/pragma/bf-shared-alignment-20260922` | `313ee82c13a126b779b9bd75902da5af13c28505` | `4d77b395b7d79be68a8be6bb32245fe0d553fa9c` | `e26c650c0337b3b2d4277dd5b9092eb63cb42e24` |
| Pragma `feat/bf-inside-out-geometry` through T004d | `refs/recovery/spec-024/pragma/inside-out-geometry-t004d-20260922` | `f93281eac01b16257027161cf0841cd559f0cef1` | `e1e6ec89e0bc7343089b20c8d04a9c52f43554f2` | `313ee82c13a126b779b9bd75902da5af13c28505` |
| Pragma `feat/bf-inside-out-geometry` exact review name | `refs/recovery/spec-024/pragma/bf-inside-out-geometry-20260922` | `f93281eac01b16257027161cf0841cd559f0cef1` | `e1e6ec89e0bc7343089b20c8d04a9c52f43554f2` | `313ee82c13a126b779b9bd75902da5af13c28505` |
| Pragma rejected T004d1a test-only candidate | `refs/recovery/spec-024/pragma/t004d1a-candidate-20260923` | `d41000e69a7f2b096b7855b272e95ccb8909696e` | `be76d8d52c05032248633f98c2cec973f1b95548` | `313ee82c13a126b779b9bd75902da5af13c28505` |
| Pragma `feat/bf-metric-nudge` | `refs/recovery/spec-024/pragma/bf-metric-nudge-20260922` | `1ba171d00ef99979bf95c2b2ec037bf4fb71c3c5` | `384385de786bcda847aad9375ac0caffe3a2163d` | `533ae3e1b1fa56d128cffb89cdfc86906a7238d0` |
| Baseline Foundry Spec 024 package | `refs/recovery/spec-024/baseline-foundry/spec-package-20260922` | `b74b9898191f52c156132f104dbabca62f301b15` | `da77c4543642171537d43cce736f19655268a3a3` | `c97ae4fca21ee1e87d23b208951abe3ed61a223f` |
| Baseline Foundry Spec 024 execution progress through T004d | `refs/recovery/spec-024/baseline-foundry/execution-progress-20260922` | `a43a91e5dc701ff00152b4a6da7bdebd2d748e20` | `7f30c5480d8050eb9d9bb4bbff1bf0617dd11e38` | `c97ae4fca21ee1e87d23b208951abe3ed61a223f` |
| Baseline Foundry pre-T004d2 Opus review | `refs/recovery/spec-024/baseline-foundry/pre-t004d2-opus-review-20260923` | `05ab8718f75cd99ecfea49a2f9ec21860cc40b23` | `70804ce0b59d1eb778be62807e4aa76e67ede450` | `c97ae4fca21ee1e87d23b208951abe3ed61a223f` |
| Baseline Foundry pre-T004d2 review disposition | `refs/recovery/spec-024/baseline-foundry/pre-t004d2-disposition-20260923` | `8d29b57e1455205c96b3c56908153391f99b29e6` | `9e788f3904ff779c45721790ca05f84a694aeb83` | `c97ae4fca21ee1e87d23b208951abe3ed61a223f` |
| Baseline Foundry combined T004d1a/T004d2/T004g junction packet | `refs/recovery/spec-024/baseline-foundry/combined-junction-packet-20260923` | `ddd0aab8685b0d5c1485f5a7dd3f73e0c973b8aa` | `ab43c87169fc4d8f4abe1106535cab55cf3eec08` | `c97ae4fca21ee1e87d23b208951abe3ed61a223f` |
| Baseline Foundry Opus execution-junction review | `refs/recovery/spec-024/baseline-foundry/opus-execution-junction-review-20260923` | `4ac4930424cb6da540706fcaa5d9f31e8aecddde` | `a242320398e41fc06d2c65c418bd826098095a40` | `c97ae4fca21ee1e87d23b208951abe3ed61a223f` |
| Baseline Foundry final Opus junction disposition | `refs/recovery/spec-024/baseline-foundry/opus-junction-disposition-20260923` | `c2df4f0baaf2c74be098116f95b1192a8d8eec3d` | `517db44c9334827fd78d5fabc4b40a274e653bf2` | `c97ae4fca21ee1e87d23b208951abe3ed61a223f` |

Before any operation that could discard a captured worktree, compare each ref's
exact commit and `^{tree}` identity with this table, then use
`git merge-base --is-ancestor <source-tip> <recovery-ref>` and `git fsck` to
verify ancestry and object connectivity. `git for-each-ref` alone proves only
that a name exists and is not a custody check.

The T004d1a row preserves a rejected attempt, not accepted progress. Its delta
from the accepted T004d snapshot is exactly four Playwright test files. The
observed Chromium DPR 1/2 results were 12/12 and 8/8 green, but two independent
adversarial reviews kept T004d1a open. The later Opus execution-junction review
now bounds that task and approves T004d2 independently; T004g alone remains
blocked on the CP1 Section choice recorded in `implementation-handover.md`.

## Settled recut decisions

1. Preserve the ten current tips under recoverable reference names before any
   history rewrite. Do not delete their worktrees or force-update their only
   recoverable refs.
2. Reuse a legacy branch name only after its old tip is preserved and the
   applicable gate below passes. New slices receive normal
   `type/semantic-description` names.
3. Land sequentially. Each final branch starts from the then-current
   `origin/main` after its prerequisite has merged and contains only its own
   slice. Do not submit the cumulative historical stack as ten PRs.
4. Copy proven intent, not old patches. Adaptation to approved semantic IDs,
   generated channels, policy identifiers and current component architecture is
   required. A new role, value, provider/subscriber pairing or local spacing
   formula stops the slice for design review.
5. The independent density axis is retained. The old task to retire density is
   superseded. There is no new public global density control: approved tight
   hosts provide context automatically and approved subscribers consume only
   allow-listed roles.
6. The broad `feat/bf-shared-alignment` branch and its audit pages remain
   evidence/reference material and never become a production PR.
7. Pre-CP1 inside-out geometry exploration occurs only on
   `feat/bf-inside-out-geometry`, branched from exact recovery snapshot
   `313ee82c13a126b779b9bd75902da5af13c28505`. It is an evidence spike, never a
   production recut or PR, and must stop at T004h.

## Coexistence and activation contract

Foundation cuts must be behaviorally inert for unmigrated consumers.

### The pinned alias set

The donor foundation commit `8894e8aa5` repoints **nine** aliases in
`packages/styles/main/src/spacing.css`. None of them may move in a foundation
cut. Two — `--grid-gutter` and `--grid-margin` — are page/grid facts that
FR-021 and FR-022 place outside this taxonomy entirely.

| Alias | Value on main | Donor redirect | Site / Docs / App effect |
|---|---|---|---|
| `--space-baseline` | `0.25rem` fixed | `var(--spacing-baseline)` | 8 / 4 / 4 — doubles in Site |
| `--baseline-height` | `var(--space-baseline)` | `var(--spacing-baseline)` | 8 / 4 / 4 — doubles in Site |
| `--container-gap-tight` | `--space-050` (4px) | `--spacing-gap-field-block` | 8 / 8 / 8 |
| `--container-gap-default` | `--space-200` (16px) | `--spacing-gap-group-block` | 24 / 24 / 8 |
| `--container-gap-loose` | `--space-300` (24px) | `--spacing-gap-pattern-block` | 64 / 48 / 16 |
| `--component-padding-block` | `--space-100` (8px) | `--spacing-inset-surface-block` | 16 / 16 / 12 |
| `--component-padding-inline` | `--space-200` (16px) | `--spacing-inset-action-inline` | 16 / 12 / 12 |
| `--grid-gutter` | `--space-200` (16px) | `--spacing-inset-surface-inline` | 16 / 16 / 12 |
| `--grid-margin` | `--space-400` (32px) | `--spacing-inset-surface-inline` | halved |

The same commit also adds `--spacing-gap-section-block` inside Pragma's
`packages/styles`. Pragma may not define properties in the provider's
`--spacing-*` namespace; that namespace belongs to design-tokens.

### Why `--baseline-height` is the dangerous one

Every value in `packages/styles/main/src/modifiers.density.css` is
`calc(var(--baseline-height) * N)` — twelve channels per context across `.app`
and `.site, .docs`, plus ten pre-namespace back-compat aliases (`--lh-comfy`,
`--pad-inline-comfy`, `--space-lg-comfy` and siblings) that apps may read
directly. Redirecting the alias doubles Site's entire matrix: comfortable
line-height 36 → 72px, `space-lg` 44 → 88px, `padding-inline` 16 → 32px. Note
that `--density-lh-*` is a line height, so this is not a spacing-only effect.

The migration rule is:

1. Import the approved provider and publish new semantic/private channels
   alongside legacy channels.
2. **The foundation cut does not modify the alias block of `spacing.css` at
   all.** Prove it mechanically: assert computed-value equality for the nine
   aliases and the ten back-compat names, before and after, in every product.
   Sampling “representative” components is not sufficient for a change with this
   blast radius — a sample that misses a Site surface passes while the tier is
   visibly broken.
3. Each component cut activates only its declared selectors and relationships.
   It may not globally repoint a legacy alias to make its own proof pass.
4. At every sequential merge, run sentinel browser checks for representative
   migrated and unmigrated controls, **in addition to** the mechanical alias
   assertion. Unmigrated occupied geometry must remain unchanged.
5. Only the final governed-density/compatibility cut may deprecate, alias or
   remove old public channels, and only when its consumer inventory is empty or
   an approved compatibility promise says otherwise.

The per-cut manifest therefore records both activated owners and unmigrated
sentinels. “No component consumers yet” means no activation and no geometry
change, not merely that no component stylesheet changed in the PR.

## Upstream already answered part of this question

After the donor base, upstream landed its own design-token and density
programme: `362b612d4 feat(Button)!: migrate to design tokens. Adopt new
density across the design system (#1119)`, then `e5f9de6af` ButtonPrimitive,
`b135f611f` Checkbox, `3a88504a2` Radio, `9d4d53315` Breadcrumbs, `8100cd22c`
TextInput, `1530f3156` NumberInput, `050550fb3` Svelte and `9388df0af
fix(button): center icon in the density-seated Button`.

**Keep the token migrations.** Six of those seven commits contain zero seat
references: they substitute primitive token references for hardcoded pixels and
nothing more, in diffs of 15 to 35 lines. They are orthogonal to the taxonomy
and must not be re-derived. Their component-local binding shape —
`--button-padding-inline-start: var(--dimension-200)` — is also the shape the
recut should adopt; only the right-hand side changes, to a tiering semantic
role.

**Replace the seat's block rule.** The box-on-grid model is confined to one
commit and five files: `packages/styles/main/src/modifiers.density.css`,
`packages/react/ds-global-form/src/density.css`, Accordion `Item/styles.css`,
React `Button/styles.css` and the Svelte `Button/styles.css`. It derives the
control's line box from its box — `--control-seat-line` is the density cell
minus two baselines, assigned directly to `line-height` — so a Site Button
label gets a 28px line box where the same secondary-tier text is 20px
everywhere else. The taxonomy does the reverse: the typographic line stands,
cap-derived padding seats it, and `--ds-row-compensation-block-end` restores
grid phase after the box.

The seat already fails inside its own dense cell. `density.css` records that
"dense's 16px line rendered 16.8px tall, pushing the chrome to 24.8" and floors
the line with `--seat-line-floored: max(var(--control-seat-line), 1.2em)`. A
model that derives the line from the box meets that wall wherever the cell is
tighter than the type; one that derives spacing from the type does not have the
failure mode.

The owner decision required before CP1 is therefore scoped, not wholesale: the
taxonomy supersedes the seat's block rule in those five files, and upstream's
token migrations are kept. Prove it with one before/after comparison of a Site
Button label against body copy under both models, recorded in Spec 022
evidence.

## Naming

`--ds-*` is established Pragma house style on main — 19 properties across
`--ds-color-*`, `--ds-transition-*` and `--ds-typography-*`. The spacing nouns
under that prefix are ours, introduced by `054d0e5ce feat(styles): centralize
intrinsic row and lane contracts` on `feat/bf-shared-alignment`. The prefix is
consistent and `--ds-typography-*` is the direct precedent for a semantic
contract layer named this way, so the vocabulary stands, under two rules:

1. The `--ds-*` spacing layer is a thin alias over provider names — the pattern
   `component-contract.css` already uses, `--ds-inline-inset-field:
   var(--spacing-inset-field-inline)` — never a second vocabulary with its own
   values.
2. Components bind a component-local property to that contract, as main already
   does with `--button-padding-inline-start`.

## Checkpoint crosswalk

| Gate | Required evidence/output | What it authorises |
|---|---|---|
| Taxonomy CP1 — Spec 022 T008 and Spec 024 T011–T013 | Current-main denominator reconciliation, proposed assignments, merge attempts/breakers, actual Opus findings and dispositions, owner approval | Final semantic roles and owner memberships only |
| Schema CP2 — Spec 024 T014–T020 | Selected density representation, closed policy, four-product matrix, token/density-API migration disposition and required reviews | Token implementation only |
| Token implementation review — Spec 024 T021–T025 | Exact design-tokens source revision, generator/policy implementation, generated artifact hashes and owning-repository gates | A named provider artifact for Pragma adoption |
| Pragma foundation review | Provider identity plus font/alignment/component-contract/tier-root incremental diffs and bidirectional traceability | Component-family recuts |
| First-family review | Commands cut measured in its own runtime with proportionate tests and no private exception | Remaining component families |
| Final recut review | Complete owner-to-slice partition, every incremental diff, integration evidence and historical finding dispositions; actual Opus reviewer recorded | Human handoff, not push/merge/release authority |

These are distinct checkpoints. Spec 024 schema CP2 is not the historical
Pragma contract checkpoint that was also named CP2. Production token source is
implemented only after Spec 024 CP2; CSS shown earlier is generated review
evidence, never a second source.

## Prerequisite sequence

1. Reconcile current `origin/main` against the evidence denominator. New or
   changed reusable owners—including Modal and recently migrated controls—must
   be measured, explicitly covered by an equivalent owner, or dispositioned.
2. Finish Pragma Spec 022's fixture-promotion rounds R3–R5 — note these are the
   Spec 022 series, not this package's `research.md` R1–R12: Accordion root-gap
   evidence, wrapped/multi-paragraph
   Continuation proof, complete human-audit rows and remaining denominator.
3. Pass the single shared taxonomy CP1 and incorporate the real Opus findings.
4. Pass schema CP2, including density behavior and the old-ID migration table.
5. Implement and review the design-tokens contribution. Record its source
   commit, generator command, resolved artifact paths and hashes.
6. Make an authorised provider package/revision available to Pragma. Local
   tarball proof may precede publication, but a mergeable Pragma branch cannot
   depend on an unavailable package version.
7. Rebuild and review the Pragma cuts below in order.

## Final cut graph

Exact allowed paths and relationship IDs come from the CP1 owner partition.
The table is a planned review boundary, not permission to implement early.

| Order | Planned cut | Owned result | Boundary |
|---:|---|---|---|
| 1 | `fix/pragma-font-auth` | Replace invalid bundled Mono assets, register/authenticate fonts and add focused tests | No spacing geometry |
| 2 | `feat/pragma-alignment-contract` | Pin/import the approved provider and add the single shared cap-alignment output alongside pinned legacy aliases | No consumer activation or geometry change |
| 3 | `feat/pragma-component-contract` | Shared semantic bindings, border-aware edge rules and private governed-density channels | Foundation adversarial review |
| 4 | `feat/pragma-tier-roots` | Site/Docs/App typography roots and product-default bindings | Foundation integration proof |
| 5 | `feat/pragma-commands` | Button, Chip and Tabs plus approved subscribers/hosts and focused browser proof | First-family adversarial review. **Split**: keep main's `--button-*` binding shape, its `--dimension-*` migration and the icon-centring fix `9388df0af`; rebind to tiering semantic roles and replace the seat's block rule. The donor also carries a declared breaking change (`98cf5be36 feat(react)!`) whose semver impact must be replanned |
| 6 | `feat/pragma-field-geometry` | Cohesive field CSS adapters for approved native/composite owners | Exclude WIP and behavior/API changes. **Split**: keep the TextInput and NumberInput token migrations whole; replace only the `.ds.input` seat rules in `density.css` |
| 7 | `feat/pragma-select-artwork` if still required | Select DOM/artwork change and its own SSR/unit/visual QA | Not smuggled into field spacing |
| 8 | `feat/pragma-marker-controls` | ToggleWrapper, Choices, Checkbox, Radio and Switch | Marker canvas/gap/first-line proof. Checkbox `b135f611f` and Radio `3a88504a2` carry **no** seat lines, so keep both migrations whole and re-derive nothing |
| 9 | `feat/pragma-field-copy` | Label, required mark, description and error relationships | Unboxed copy is independently reviewable |
| 10 | `feat/pragma-accordion-spacing` | Summary marker, root gap and panel Continuation/Surface composition | Separate from form marker controls |
| 11 | `feat/pragma-attached-rows` | ContextualMenu and Combobox rows where CP1 proves one shared contract | Split if their contracts diverge |
| 12 | `feat/pragma-card-sections` | Card section seams/insets and baseline-phase proof | Sectioned container only |
| 13 | `feat/pragma-rich-choice-card` | RichChoices padded-component geometry | Field-dependent; not Card vertical category |
| 14 | `feat/pragma-surfaces` | Tile, Tooltip, Popover and Announcement owners approved by CP1 | Exact surface types may split on breakers |
| 15 | `feat/pragma-navigation` | Current SideNavigation, Breadcrumb and approved navigation/tree owners | Reimplement on current architecture. Nothing reusable from the donor: SideNavigation was rebuilt twice upstream (`4949aea9e`, `57096e694`, both breaking). Keep the Breadcrumbs migration `9d4d53315` whole |
| 16 | `feat/pragma-launchpad` | FileTree, GitDiffViewer, Log and editor relationships | No legacy app literal left unclassified |
| 17 | `feat/pragma-product-buttons` | Four product Button forks | No fork-private spacing system |
| 18 | `feat/pragma-density-governance` | Cross-family integration and CP2-approved compatibility disposition | Retains density; never a public global chooser |

The Select cut is conditional: if current main already provides the needed
artwork ownership without the old DOM/API rewrite, omit the cut and classify
the existing owner. `TextareaInput.tsx` default rows, WIP DensityTestbed CSS and
Storybook-only cleanup are excluded from production spacing cuts.

The graph is React-only, but the affected consumer set is not:
`packages/svelte/ds-app-wpe/src/lib/components/Button/styles.css` reads
`--control-seat-*`, and `050550fb3 feat(svelte): migrate to design tokens` has
landed. Non-React packages that consume shared spacing or seat channels need
either a slice or an explicit boundary before the partition can be called
complete.

Timeline and semantic-list ownership belongs in the owner partition even if it
ultimately uses marker roles without component changes. Badge and
InlineCode/KeyboardKey likewise require explicit role or boundary dispositions.
There is no generic production React Table: native audit cells remain evidence;
real TokenTable/GitDiff cell owners are assigned where they live.

## Per-cut manifest

Before editing the first final branch, complete the global owner partition and
the planning columns for every cut: branch, allowed paths, relationships/roles,
activated owners, unmigrated sentinels, expected geometry, compatibility,
focused proof and rollback unit. Future parent SHAs and results do not exist
yet and must not be guessed.

At the start of each cut, record its actual parent main SHA and provider
version/hash. At closeout, record root-gate results, size and review state. A
cut cannot enter `rebuilding` with an unknown start/planning field or
`reviewed-ready` with an unknown closeout field.

| Branch | Parent main SHA | Provider version/hash | Exact allowed paths | Relationship IDs/roles | Activated owners | Unmigrated sentinels | Expected geometry delta | Expected semver impact | Compatibility effect | Focused proof | Root gates | Size delta | Review state | Rollback unit |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| _Populate after CP1/CP2_ | — | — | — | — | — | — | — | — | — | — | — | — | — | — |

The union of these rows must form a partition: every approved evidence
relationship appears exactly once as an implementation owner, already-landed
proof or explicit boundary/deferred exclusion. Duplicate and unassigned IDs are
errors.

## Validation for every cut

1. Fetch and start from `origin/main` after the prerequisite merges.
2. Use an existing worktree only after preserving its historical tip; otherwise
   create a fresh conventionally named worktree.
3. Run `bun install` when the worktree or dependencies are new. Regenerate
   `bun.lock`; never hand-merge an old lockfile hunk.
4. Run focused package checks and cut-specific browser geometry while iterating.
   Measurements must come from the cut runtime, not only port 6114's reference.
5. Cover relevant Site/Docs/App products, supported root sizes, LTR/RTL,
   borders/states, wrapping, baseline phase, density isolation and unchanged
   occupied geometry for the declared unmigrated sentinel set.
6. Run root `bun run check` and `bun run test`; run root `bun run build` when
   artifacts or publishable packages change.
7. Rebase on the latest prerequisite/main and rerun the full root gates before
   push. A discounted environment failure must reproduce on the same clean base.
8. Record incremental path/line size, generated-artifact identity and review
   disposition. Use the PR template and a Conventional Commit title when push
   is separately authorised.

Package-scoped checks stay in package `check`/`test` targets. This work does not
add a package-specific job to a shared CI workflow. Nonvisual foundation PRs
may declare `Chromatic: skip`; visual component cuts must receive visual review.

## Density acceptance matrix

The final sequence must prove:

- standalone subscribers use their product default;
- Chip cannot remain regular in an approved table-cell, tab or side-navigation
  host;
- non-subscribers and non-responsive roles remain unchanged inside a host;
- product → host, host → nested product, same-element product/provider,
  provider → reset and reset → provider precedence matches the schema;
- an undeclared portal has no source-host continuity and resolves from target
  DOM ancestry;
- a declared bridge affects only its listed subscribers and roles; and
- no public `.dense`, `.comfortable` or arbitrary density opt-in is introduced.

Density may select approved spacing roles. It may not silently change baseline,
typography or line height. If host fit requires such a change, stop and obtain a
separate component-fit decision instead of hiding it in the spacing recut.

## Stop and recovery rules

Stop the affected chain when:

- evidence source hashes no longer match the CP1 snapshot;
- current-main reconciliation finds an unclassified reusable owner;
- a cut needs a new role/value or undeclared provider/subscriber pair;
- a cut would change a control's block geometry before the seat-model decision
  above is recorded as owner direction;
- a cut would move any alias in the pinned set, or define a `--spacing-*`
  property inside Pragma;
- a component needs private arithmetic beyond the reviewed contract;
- baseline, border/state invariance, wrapping, RTL or density isolation fails;
- current architecture cannot express the change as an independent slice;
- unrelated changes enter the branch; or
- a required review or root gate remains unresolved.

Preserve the old reference tips and all user-owned changes. T004c's named
recovery refs must continue to resolve before any operation that could discard
one of the captured worktrees; preserving the ten clean tips alone does not
protect them. Revert failed cuts and dependent cuts in reverse order;
do not remove compatibility exports before their consumers migrate. A failed
implementation cannot rewrite CP1 or CP2 by implication. Package rollback,
publication and release require separate owner authority.

## State vocabulary

Track each cut as exactly one of: `reference-only`, `rebuilding`,
`locally-green`, `reviewed-ready`, `pushed`, `merged` or `released`. Do not use
“done” for a local clean branch, and do not infer permission to advance state.
