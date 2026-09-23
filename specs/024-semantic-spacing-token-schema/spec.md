# Feature specification: Semantic spacing-token schema

**Feature branch**: `feat/024-semantic-spacing-token-schema`

**Created**: 2026-09-21

**Status**: Draft

**Input**: Define the semantic spacing-token schema implied by the Pragma
horizontal and vertical spacing audit, including governed contextual density,
without confusing semantic roles with the primitive dimension scale.

## Problem

The current provider has valid DTCG syntax and published semantic-looking
names, but its 12-token record predates the exhaustive Pragma taxonomy work.
Showing that record as the proposed schema confuses three different things:

1. primitive dimensions, which supply values;
2. semantic spacing relationships, which name why space exists; and
3. product and density resolution, which select a value for a relationship in
   a context.

The project needs a new semantic schema that is derived from every reusable
spacing owner, independently minimised on the inline and block axes, capable of
asymmetric composition, and explicit about which roles may respond to a
governed tight-container density context.

## User scenarios and testing

### User story 1 — Review the minimum semantic taxonomy (Priority: P1)

A design-system owner can inspect every proposed semantic role and trace it to
component evidence, breaker examples and rejected merges. The owner can tell
whether two equal numbers represent the same relationship and whether two
different numbers are product variants of one relationship.

**Why this priority**: Token names and counts cannot be approved without this
argument. A schema written before taxonomy closure merely formalises guesses.

**Independent test**: Starting from the review packet, a cold reader can resolve
every final relationship to one semantic role or an explicit non-token
disposition without reading implementation history.

**Acceptance scenarios**:

1. **Given** two components have equal measured padding, **When** their owners
   and purposes differ, **Then** the schema does not merge them solely because
   the primitive value matches.
2. **Given** Accordion panel text uses Continuation at inline-start and Surface
   at inline-end, **When** it is classified, **Then** it composes two existing
   roles rather than creating an Accordion token.
3. **Given** a component has independent inline and block behavior, **When** it
   is classified, **Then** each axis receives its own assignment.

---

### User story 2 — Author and resolve semantic tokens (Priority: P1)

A token maintainer can express an approved spacing relationship once, override
its value per product, generate stable CSS names, and distinguish it from
primitive dimensions and private resolution channels.

**Why this priority**: The deliverable is an implementable semantic schema, not
only a bucket table.

**Independent test**: A fixture semantic token resolves through Site, Docs,
App and OS product contexts to DTCG dimensions, produces the expected public
property, and retains its required semantic metadata.

**Acceptance scenarios**:

1. **Given** an approved semantic relationship, **When** it is authored, **Then**
   its identifier describes relationship, role and logical axis rather than a
   magnitude or component name.
2. **Given** a product changes the value, **When** resolution runs, **Then** the
   semantic identifier and public CSS property remain stable.
3. **Given** a primitive dimension changes, **When** it is referenced by several
   roles, **Then** each semantic role remains independently documented and
   reviewable.

---

### User story 3 — Apply governed density in tight hosts (Priority: P1)

A component author can place an enrolled component in an approved tight host
and have it automatically consume the dense member of approved semantic roles.
There is no public global density chooser, and unrelated descendants remain
unchanged.

**Why this priority**: Product tiers already define default visual density, but
tight tables, tabs and navigation need a local fit contract. Removing the axis
would make later reintroduction incompatible; exposing it globally would create
two competing product-density systems.

**Independent test**: The same Chip renders with default product geometry when
standalone and governed dense geometry in every approved tight host, while a
non-subscriber is byte-for-byte and geometrically unchanged.

**Acceptance scenarios**:

1. **Given** a Chip is inside an approved table-cell provider, **When** styles
   resolve, **Then** the Chip automatically consumes dense values and cannot
   remain regular through the public API.
2. **Given** the same Chip is outside a provider, **When** styles resolve,
   **Then** it consumes the product’s comfortable/default values.
3. **Given** a non-subscriber is inside a provider, **When** styles resolve,
   **Then** no spacing, typography or occupied geometry changes.
4. **Given** a provider is nested inside a reset boundary or a subscriber is
   rendered through a portal, **When** context cannot inherit normally, **Then**
   the policy requires an explicit tested contract rather than accidental CSS
   ancestry.

---

### User story 4 — Hand off a reviewable contribution (Priority: P2)

A human engineer can review a bounded design-tokens contribution and separate
adoption pull requests without inheriting the broad Pragma evidence branch.

**Why this priority**: The existing reference branch is evidence, not a
mergeable proposal.

**Independent test**: The handoff identifies source files, generated outputs,
compatibility effects, tests and review checkpoints without referencing private
local paths as the justification.

**Acceptance scenarios**:

1. **Given** CP1 approves the taxonomy, **When** the token contribution is cut,
   **Then** it contains the semantic source, density policy, generated artifacts
   and focused tests only.
2. **Given** Pragma adoption follows, **When** component families are recut,
   **Then** each pull request consumes the approved schema and passes the owning
   repository’s full gate.

### Edge cases

- Equal values across products do not erase a semantic distinction.
- One component edge may consume a different role from its opposite edge.
- Zero, border subtraction, optical compensation and intrinsic paint are not
  automatically semantic spacing.
- A private density value must not leak into public token metadata or LSP output.
- A tight host that cannot inherit into a portal must fail closed.
- A component that cannot fit even with approved dense roles requires a
  component decision; it does not create a new token by default.
- RTL changes physical edges, never semantic token identity.
- Density must not change the baseline grid quantum.

## Requirements

### Functional requirements

- **FR-001**: The schema MUST distinguish primitive dimensions from semantic
  spacing roles and contextual resolution.
- **FR-002**: Every public semantic token MUST describe a reusable relationship,
  not a magnitude, component name, page name or implementation technique.
- **FR-003**: Inline and block taxonomy MUST be minimised independently.
- **FR-004**: Every final relationship MUST resolve to one or more composed
  semantic roles or an explicit non-token disposition.
- **FR-005**: Every proposed merge MUST include positive members and a breaker;
  value equality alone MUST NOT justify a merge.
- **FR-006**: The schema MUST support asymmetric logical-edge composition
  without component-specific token names.
- **FR-007**: Semantic source MUST conform to DTCG 2025.10 and reference the
  existing primitive dimension scale.
- **FR-008**: Product variants MUST preserve semantic IDs across Site, Docs,
  App and OS.
- **FR-009**: Each semantic token MUST carry machine-readable Canonical metadata
  for logical axis, relationship kind, ownership kind, public/private status,
  density responsiveness and lifecycle status.
- **FR-010**: Density MUST remain an independent internal resolution axis whose
  default is selected by product and whose dense member may be selected only by
  an approved provider.
- **FR-011**: No global user-facing density control, public `.dense` utility or
  arbitrary consumer opt-in MAY be generated.
- **FR-012**: Providers, subscribers and subscribed roles MUST be declared in a
  versioned, machine-readable policy outside the DTCG token documents.
- **FR-013**: An enrolled descendant inside an approved tight host MUST consume
  dense values automatically; regular geometry in that host MUST NOT be a
  supported public state.
- **FR-014**: Non-subscribers and non-responsive roles MUST be immune to an
  inherited density context.
- **FR-015**: Density MUST NOT alter baseline, typography, line height, target
  height or unrelated layout roles through this schema.
- **FR-016**: Generated public CSS names MUST be stable, kebab-case and derived
  from semantic IDs. Private resolution channels MUST be excluded from public
  token and language-server artifacts.
- **FR-017**: The schema MUST define source, resolved and generated validation
  for every product and every density-responsive role.
- **FR-018**: Final token names and values MUST NOT be declared approved before
  the taxonomy checkpoint closes the denominator, merge tests and breakers.
- **FR-019**: Pragma planning and Jira execution artifacts MUST remain outside
  the Pragma repository.
- **FR-020**: Jira publication MUST use `jira-project-bridge` with a fresh
  snapshot, live metadata, a reviewed saved plan, dry run and explicit apply
  confirmation.
- **FR-021**: The component/pattern taxonomy MUST NOT count
  `spacing.baseline`, page margin, grid gutter, region separation or full-bleed
  strip padding as component semantic categories. Existing provider entries may
  remain compatible until their owning grid/layout work specifies migration.
- **FR-022**: `spacing.baseline` MUST remain an existing product/grid invariant
  outside the new component relationship ID grammar and metadata requirement.
- **FR-023**: Every product root MUST redefine governed density members and
  reset current values to its comfortable/default member; inherited density
  MUST NOT cross a nested product root accidentally.
- **FR-024**: Density-provider membership MUST follow rendered DOM ancestry
  unless a reviewed framework adapter implements an explicit portal bridge.
- **FR-025**: CP2 MUST publish a migration disposition for existing spacing IDs
  and public density selectors, properties, exports and documented controls
  before implementation, including React/non-React consumers and removal
  prerequisites, without treating compatibility as semantic approval.
- **FR-026**: Historical cumulative `feat/pragma-*` branches MUST be preserved
  as references and MUST NOT be rebased or merged wholesale; final cuts MUST be
  rebuilt sequentially from the then-current upstream after prerequisites land.
- **FR-027**: The recut manifest MUST partition every CP1 relationship exactly
  once among an implementation slice, already-landed proof or explicit
  boundary/deferred exclusion.
- **FR-028**: The independent density axis MUST be retained. Migration MUST NOT
  introduce a public global chooser or retire compatibility controls without
  the approved existing-ID/API disposition.
- **FR-029**: Each Pragma cut MUST prove geometry in its own runtime, pass the
  repository root gates after its final rebase and remain independently
  reviewable from its parent mainline.
- **FR-030**: An actual Opus review MUST verify the recut conclusions and these
  spec changes before the plan is treated as reviewed; it does not replace CP1
  or CP2.
- **FR-031**: The frozen denominator MUST reconcile reusable owners added or
  changed on current Pragma main after the evidence snapshot; verifier success
  alone MUST NOT be treated as present-day source coverage.
- **FR-032**: Foundation adoption MUST expose new semantic/private channels
  alongside pinned legacy aliases. It MUST NOT globally redirect a legacy
  baseline or density channel before all of its consumers are migrated or an
  approved compatibility disposition authorises the change.
- **FR-033**: The pinned alias set MUST be enumerated exhaustively in
  `recut-handoff.md` and asserted mechanically by computed-value equality per
  product, before and after each foundation cut. Sentinel component sampling
  MUST NOT be the only evidence. Page/grid aliases excluded by FR-021 and
  FR-022 — currently `--grid-gutter` and `--grid-margin` — MUST NOT move in a
  component spacing cut.
- **FR-034**: Pragma MUST NOT define properties in the provider's `--spacing-*`
  namespace. That namespace is owned by `canonical/design-tokens`.
- **FR-035**: The density axis retained by FR-028 is the **existing published**
  one: the `.app`/`.site`/`.docs` × `.comfortable`/`.dense` class family in
  `@canonical/styles`, its `--density-*` channels, its pre-namespace aliases and
  its documented Storybook guides. Its mechanism and cascade are retained; its
  free per-instance opt-in is not. Dense MUST become reachable only through an
  approved provider for an approved subscriber, so density expresses a sanctioned
  tight context rather than a per-instance choice. Retirement of the public
  `.comfortable`/`.dense` selector MUST happen through the FR-025 disposition,
  and until it lands FR-013 constrains only the new schema, because an ancestor
  carrying `.comfortable` can still defeat it.
- **FR-036**: The frozen denominator and the recut partition MUST cover
  non-React consumers of shared spacing or control-seat channels, or record an
  explicit boundary for them. A React-only denominator is incomplete while
  `packages/svelte/*` reads those channels.
- **FR-037**: Where current Pragma `origin/main` has already landed a component
  geometry model that the proposed taxonomy would replace, the substitution MUST
  be recorded as an explicit, **scoped** owner decision before CP1, naming the
  exact rules and files superseded. Upstream work that is orthogonal to the
  taxonomy — notably primitive-token migrations carrying no control-seat
  reference — MUST be kept and MUST NOT be re-derived. A recut MUST NOT reverse
  a shipped upstream design contract by implication, and MUST NOT discard
  upstream work by implication either.
- **FR-037a**: A superseding block-geometry decision MUST be supported by a
  rendered before/after comparison of the affected control's text against body
  copy of the same tier, under both models, recorded in the Spec 022 evidence.
- **FR-037b**: Owner direction, 2026-09-21: every outside-in construction — any
  rule that fixes a box height first and derives a line box, font size or line
  height from it — is superseded by the inside-out composition in FR-039. This
  covers the `--control-seat-*` rules and the `--density-lh-*` cells that feed
  them. Upstream primitive-token migrations remain kept under FR-037.
- **FR-038**: Working state that CP1 depends on and that exists only as
  uncommitted or untracked files MUST be committed or bundled to a named
  recovery ref, and listed in the preservation table, before any worktree,
  branch or rebase operation. Preserving a branch tip that a dirty worktree
  merely shares MUST NOT be treated as preserving that worktree.
- **FR-039**: Block geometry MUST be composed inside-out: the type's own line
  box first, then the seating nudge, then the semantic block inset the owner
  requires, then per-edge border subtraction. No contract may derive a line box,
  font size or line height from a target box height. The row contract MUST
  expose a per-edge block inset term; a padding formula of nudge minus border
  alone is incomplete, and its measured output MUST NOT be cited as the model's
  intended geometry.
- **FR-039a**: The block inset MUST be the block-axis member of an existing
  `inset` role, with zero as a legitimate value. It MUST NOT introduce a new
  relationship family, a component-named token or an element-owned `spaceAfter`.
  Its values MUST be established by measuring what actually resolves the owner
  to a whole rhythm step in each product — for example an App control at 32px —
  and then fixed in the token source. A predictive rule MAY be used to propose a
  starting value but MUST NOT be the authority for it, and MUST NOT be evaluated
  at runtime.
- **FR-039a1**: T004d1a MUST read and record the resolved
  `--ds-row-inset-block-start` and `--ds-row-inset-block-end` on every measured
  member. It MUST also record resolved nudge and baseline, computed block-edge
  borders and paddings, block-end margin, rendered and contract occupied sizes,
  product target and OS `null`. The inset edges MUST be equal; both MUST resolve
  to zero on Site and one baseline on Docs/App; and each edge MUST prove
  `padding = max(0, inset + nudge - border)` against its own computed border.
  Occupied-total agreement alone is not sufficient.
- **FR-039b**: The rhythm correction has two computed terms at opposite edges,
  neither ever authored. A **phase** term at block-start lifts the element's
  first baseline onto its rhythm step. Its later lines stay in phase with body
  copy beside them only where FR-039b3's whole-multiple predicate holds. A
  **compensation** term at block-end closes the element's occupied block size to
  a whole number of that step, and its sum MUST include the phase term. Both MUST
  round up only, MUST read a rhythm step named for its context rather than one
  global value, and MUST be excluded from the semantic token count and from
  public `--spacing-*` output on the same basis as `spacing.baseline` under
  FR-021 and FR-022.
- **FR-039b1**: The phase term MUST NOT be relocated to block-end. A block-end
  term re-phases only what follows the element and leaves the element's own
  lines off the grid, and it corrupts the designed heading-to-body relationship
  by absorbing a remainder into it.
- **FR-039b2**: During the pre-CP1 spike, first-baseline offset MUST be a named
  extraction of the existing `(line-height + 1cap) / 2` expression. Rewriting
  the current nudge formula to consume that property MUST move no geometry. The
  property is the single later substitution point for real metrics; the spike
  MUST NOT adopt the unused provider nudge primitives or merge
  `feat/bf-metric-nudge`. Their final authority is a CP2 question.
- **FR-039b3**: A phase term aligns every line only where the role's line height
  is a whole multiple of the contextual rhythm step. The spike MUST evaluate
  `mod(line-height, rhythm-step) = 0` for every role/product pair, prove the
  qualifying combinations, and carry every failure to CP1 as a type-scale
  exception. It MUST NOT change typography tokens to manufacture a pass. The
  qualifying heading combinations are Site H1/H2/H5/H6, Docs H1/H2 and App
  H5/H6; all other heading/product combinations are recorded exceptions.
- **FR-039c**: Every control MUST resolve to a whole number of its declared
  rhythm step in every product. A text owner MUST do so at one, two and three
  lines where `mod(line-height, rhythm-step) = 0`; every non-qualifying
  role/product pair MUST match the FR-039b3 exception table and be carried to
  CP1 rather than counted as a T004d2 failure.
- **FR-039d**: Border subtraction MUST be per edge and MUST read the actual
  border on that edge. A nominal constant border applied so that bordered and
  borderless variants share one geometry is not equivalent and MUST NOT be used.
- **FR-039e**: The bounded pre-CP1 T004d1a denominator has exactly four measured
  members: shared external-row Button excluding `.link`, shared external-row
  Chip excluding `.is-nested`, composite `.ds.input.chrome`, and direct native
  Select chrome. FileUploadInput's intrinsic `max()` canvas and the in-box item
  families in Tabs, ContextualMenu, Accordion, SideNavigation, GitDiffViewer and
  MarkdownEditor are explicitly deferred to T006. The four product Button forks
  in `ds-app-anbox`, `ds-app-landscape`, `ds-app-lxd` and `ds-app-portal` require
  one static proof that they declare no local inset, nudge or row block padding;
  rendered confirmation is T005a. The Svelte Button, Chip, Select and
  InputPrimitive forks in ds-app-launchpad and Button in ds-app-wpe are an
  explicit FR-036 boundary owned by T005b and MUST NOT be edited or claimed as
  measured by this spike.
- **FR-039f**: Button and Chip receive borderless waivers because they ship no
  supported zero-border external row; their link/nested variants are different
  row categories. Native Select receives the same waiver because transparent
  border colour does not remove border width. Composite input chrome MUST either
  prove a true zero block edge through the documented per-side top/bottom width
  hooks in an existing `.storybook` spacing-contract fixture, with no inline
  mutation and no production-style edit, or record a waiver if those hooks do
  not reach zero. A proved zero edge MUST retain the scaled occupied target and
  show its padding grow by exactly the removed border; bordered preconditions
  and restored geometry MUST be measured.
- **FR-039g**: The T004d1a target is rem-scaled: Site/Docs/App are 40/32/32 at a
  16px root and 45/36/36 at an 18px root. Completion runs all six existing
  Chromium, Firefox and WebKit × DPR 1/2 projects, both roots, all three products
  and all four members. Chromium is authoritative at 1/32px. Firefox and WebKit
  MUST be recorded at 0.5px; excess engine rounding is carried to CP1 rather
  than hidden by loosening Chromium.
- **FR-040**: Where a grid-token authority exists, this programme MUST NOT
  author a competing grid value. Pragma MUST remove any local redirect that
  binds grid gutter or margin to a component inset and leave replacement values
  to Spec 020b. The pre-CP1 spike therefore deletes the `--grid-gutter` and
  `--grid-margin` redirects without replacing them, but MUST record each
  consumer's resolved outcome: `grid.css` takes its 1.5rem fallback, React and
  Svelte Cards lose an unfallbacked gap, and Storybook Grid padding loses an
  unfallbacked margin. The spike MUST NOT soften the Svelte boundary.
- **FR-041**: The baseline unit is tier-specific — 8px for editorial and
  marketing sites, 4px for documentation, applications and OS. Any multiplier
  expressed in baseline units MUST be recalculated per tier; a multiplier chosen
  against 4px MUST NOT be carried into a site context unchanged.
- **FR-041a**: OS remains a required provider product but is deferred in the
  Pragma pre-CP1 spike because Pragma has no OS root or consumer to render. A
  new role's OS value MUST be recorded as `null`, never zero, and CP2 MUST
  resolve it before provider implementation.
- **FR-042**: Value coincidence MUST NOT drive a merge. Two roles merge only
  when a change to one *should* logically change the other. The purpose of the
  semantic layer is that an edit reaches exactly what it ought to reach, not
  that identical numbers share a name. Specifically: the field inline inset and
  the marker gap remain **separate** roles despite resolving to the same value
  in every product, because changing the whitespace between an icon and its
  label should not move a control's outside keyline.
- **FR-042a**: Inner padding and separation between things are different
  relationships and MUST NOT share a role, however close their values. `field`
  names an **inset** — the padding inside a field box — and MUST NOT also name a
  step of the gap scale. A container's block padding MUST read an inset role; a
  container that pads itself from a gap token is flattening padding into
  inter-component spacing and is a defect, not a shorthand.
- **FR-043**: The block-gap scale is a three-step scale, all of it separation
  between things, none of it padding. Values are Site / Docs / App,
  owner-specified 2026-09-22. Documentation and applications start from
  identical values and may diverge later on evidence.

  | Step | Meaning | Site | Docs | App |
  |---|---|---:|---:|---:|
  | `element` | between adjacent elements inside one logical unit — a label and its control, a heading and its paragraph | 8 | 4 | 4 |
  | `group` | between logical units inside a pattern, such as header, body and footer | 24 | 16 | 16 |
  | `pattern` | between the sections of a page | 64 | 32 | 32 |

  The provider currently resolves the equivalent steps to 8/8/8, 24/24/8 and
  64/48/16, so every step changes. Applications double at `group` and `pattern`.
  `element` is the step previously carried as `spacing.gap.field.block`; the
  rename exists to stop it colliding with the field inset under FR-042a. The
  rename is a design-tokens source change performed only after CP2; the spike
  carries it through the private channel in FR-050. CP1 may choose a different
  word for it, but not the word `field`. Provider `region` and `strip` roles are
  page/grid relationships excluded from this component taxonomy by FR-021.
- **FR-043a**: `section` and `pattern` are the same relationship and MUST NOT
  both exist. `section` has no role in the provider — it is a Pragma-side alias
  inserting a fixed primitive between `group` and `pattern`, which is what made
  the application ordering non-monotonic. Remove it.
- **FR-043b**: Expressed in baseline units the scale is 1 / 3 / 8 on sites and
  1 / 4 / 8 on documentation and applications. `element` and `pattern` are a
  uniform count of baseline units across tiers; `group` is not. CP1 confirms
  that asymmetry or corrects it.
- **FR-044**: Governed density exists to satisfy one constraint: **nesting an
  enrolled child inside an approved host MUST NOT change the host's occupied
  size**. A table row whose cells are otherwise plain text must not grow because
  one cell holds a Chip; a navigation item must not grow because it holds a
  Badge. Provider, subscriber and role membership MUST be derived from that
  constraint and stated as the reason for each entry. A host qualifies as a
  provider when an enrolled child would otherwise enlarge it; a component
  qualifies as a subscriber when it would otherwise be that child; a role is
  governed when it contributes to the child's occupied size in that host.
- **FR-044a**: Where an enrolled child cannot meet FR-044 even at its dense
  values, the schema MUST NOT invent a value to close the gap. That is a
  component-fit decision and stops for review.
- **FR-045**: Owner direction, 2026-09-22: component geometry is **re-derived**
  from the approved model rather than reconciled relationship-by-relationship
  against the historical audit. The audit remains evidence for what the current
  implementation does and for the taxonomy argument; it is no longer the work
  queue. Residual differences are caught in QA.
- **FR-045a**: Because the relationship ledger is no longer the completeness
  guarantee, completeness MUST be proven mechanically instead: a sweep for
  hardcoded lengths across each migrated package's CSS, with every remaining
  literal carrying a disposition — assigned to a role, an explicit boundary, or
  a recorded exception with an owner. A package is complete when that sweep is
  empty of undispositioned literals.
- **FR-046**: This work is exploratory until the architecture settles.
  Verification MUST be proportionate to that. The standard artifact is a
  **comparison sheet**: the components of a group laid out on one row, or a set
  of rows each led by its reference — a Button for boxed text, a paragraph for
  unboxed text, a Card for panels — with baseline and rhythm guides overlaid.
  Alignment is confirmed by reading it: text sits on the same baseline across
  the row, and the guides are equally spaced. A human and an agent can both do
  that, and it is the primary evidence for a geometry decision.
- **FR-046a**: Automated checks are justified where they are cheap and catch
  silent breakage — the pinned-alias assertion under FR-033 is the clear case,
  because nothing on screen reveals a doubled tier until a whole product is
  wrong. They are NOT justified as per-variant, per-state, per-product matrices
  over geometry that is still being designed. A requirement stating a property
  is not an instruction to build a suite proving it in every combination; while
  the architecture is open, the comparison sheet discharges it.
- **FR-046b**: Exhaustive state, variant and product matrices are deferred until
  the taxonomy and values are settled, and become a CP2 or implementation-review
  obligation rather than an exploratory one.
- **FR-047**: Three semantic steps will not cover every container gap. A
  **magnitude scale** MUST remain available for the cases they do not, on the
  model Baseline Foundry already uses: `--bf-space-N` is N baseline units, and
  `bf-stack` exposes a per-instance channel plus a density modifier. Any
  magnitude offered here MUST likewise be a whole count of the tier's baseline
  unit, so reaching for one cannot leave the grid. Arbitrary lengths remain
  prohibited.
- **FR-047a**: Semantic roles are the systematic path and the default. A
  magnitude is permitted, not equivalent: its use MUST be recorded with the
  relationship it serves, and the record reviewed. The same magnitude recurring
  in the same relationship is evidence of a missing semantic role and MUST be
  raised as a candidate rather than left as a local choice. An escape hatch that
  is never inspected becomes the default by attrition.
- **FR-048**: A required review MUST be performed by a reviewer other than the
  agent that produced the work. Self-review does not discharge a review
  obligation. The reviewing model MUST be recorded by its actual identity; an
  agent MUST NOT describe itself or another model as one it is not, and MUST NOT
  substitute an ordinary adversarial review where a named model is required. If
  no qualified independent reviewer is available, the agent MUST record that and
  stop rather than proceed unreviewed.
- **FR-049**: The block-geometry and gap-scale work preceding CP1 — the block
  inset, the phase and closure terms, the gap scale and the inset/gap separation
  — MUST pass an independent adversarial review before any of it feeds the CP1
  packet. It changes geometry in every product and is otherwise the only phase
  with no review gate of its own.
- **FR-050**: Pre-CP1 geometry exploration MUST run only in
  `feat/bf-inside-out-geometry`, created from exact recovery snapshot
  `313ee82c13a126b779b9bd75902da5af13c28505`. The evidence reference remains
  read-only. One evidence-only file,
  `packages/styles/main/src/_spike-geometry.css`, MAY define the private
  `--_spike-inset-control-block`, `--_spike-gap-element-block`,
  `--_spike-gap-group-block` and `--_spike-gap-pattern-block` channels and bind
  the `--ds-*` contract to them. The exact candidate/provider-role bindings are
  `spacing.inset.control.block` to `--ds-row-inset-block-start` and
  `--ds-row-inset-block-end`, then `spacing.gap.element.block`,
  `spacing.gap.group.block` and `spacing.gap.pattern.block` to the matching
  `--ds-gap-<role>-block` properties. `spacing.inset.control.block` is a
  candidate member of the existing inset family, not a currently shipped
  provider role; its annotation MUST say so. `spacing.gap.element.block` is the
  post-CP2 rename candidate for the shipped `spacing.gap.field.block`. The file
  MUST be imported by `component-contract.css` immediately after typography
  alignment and before its layer body, so every existing main-style entrypoint
  inherits the carrier without exporting it as a subpath. Each value MUST name
  the provider role it
  stands in for. No component may read a `--_spike-*` channel directly, no
  other spike channel may be introduced without a recorded reason, and no
  `--spacing-*` property may be declared in Pragma. The file MUST be deleted
  and its approved values transcribed into design-tokens as the first Phase 3
  act after CP2. Because the package publishes all of `src` and the public
  component-contract export imports the carrier transitively, the carrier would
  still ship in a tarball. This spike therefore forbids publication, and T004h
  MUST prove that the carrier exists on no branch except this isolated spike.
- **FR-051**: The owner authorises `feat/bf-inside-out-geometry` as the single
  non-mergeable evidence-spike exception to AGENTS.md's normal `origin/main`
  branch-base rule. Owner provenance, 2026-09-22: the owner supplied the Opus
  plan naming exact snapshot `313ee82c13a126b779b9bd75902da5af13c28505`
  and instructed the agents, if the plan was clear, to “orchestrate the work on
  it.” The branch MUST never be
  pushed, PR'd, merged, published or used as a production base; every other
  AGENTS.md rule remains active.
- **FR-052**: The Spec 024 capture MUST reuse both pre-existing configurations:
  `packages/react/ds-global/playwright.spacing.config.ts` on port 6106 for
  Button/Chip, with `PRAGMA_BUTTON_SPACING_OUTPUT` set to external subdirectory
  `H:\WSL_dev_projects\temp\spec-024-inside-out-evidence-20260922\ds-global-6106`,
  and `packages/react/ds-global-form/playwright.spacing.config.ts` on port 6107
  for composite chrome/native Select, with `PRAGMA_FORM_SPACING_OUTPUT` set to
  sibling `form-6107`. No new collector, config or port is allowed; port 6114
  remains unconditionally reserved for Spec 022. Each test MUST write its JSON
  with `node:fs/promises` to `testInfo.outputPath(...)` and attach it by `path`,
  not attach an in-memory body. A green run without persisted and hashed JSON is
  diagnostic only. Root `manifest.json` MUST record branch, base HEAD, full
  porcelain status, SHA-256 for every changed source/test/fixture and every
  `t004d1a-*.json`, plus each record's relative path, lane, port, config,
  engine×DPR project, root size, test title and OS `null`. The six T004d review
  files remain the baseline set and every later T004d1a/T004d2/T004g change
  present at capture time MUST also be hashed.
- **FR-053**: T004g's affected-scope sweep MUST return no undispositioned hit.
  Each hit is either repointed to an inset role or carries a one-line boundary
  in T010. This is not the full FR-045a/T007 completeness sweep.
- **FR-053a**: T004g MUST NOT begin until CP1 chooses the Section inset mapping.
  Three public magnitudes cannot be inferred from the two shipped block-inset
  roles. CP1 MUST either collapse default/hero/deep onto strip with a written
  FR-042 merge argument, or mint `spacing.inset.section.block` with product
  values and an FR-050 fifth-channel amendment. The illegal
  `--spacing-gap-section-block` declaration and its three tests move with that
  decision, not before it. The bordered Section override MAY be deleted so it
  inherits the framed-box surface inset; that does not decide the variants.
- **FR-053b**: T004g's writable activation slice is exhaustive. The sole
  `spacing.css` repointing exception is lines 40–42: `--container-gap-tight`,
  `-default` and `-loose` move respectively to `--ds-gap-element-block`,
  `--ds-gap-group-block` and `--ds-gap-pattern-block`; all other declarations in
  that file remain deletions-only. Form `--form-group-gap-default` moves from
  provider field gap to DS element gap, and `--form-field-block-gap-default`
  moves from provider pattern gap to DS group gap as an explicit magnitude
  correction. Genuine gap declarations in the named Card, Tile and Tooltip
  owners may move to the matching DS channels after their exact paths are listed
  in the T004g record. Both ColorInput `--ds-box-inset-block` overrides MUST be
  deleted at their call sites so they inherit the framed-box surface inset;
  `--form-group-gap-default` remains a gap. Every other direct provider-gap
  consumer, RichChoicesField and per-instance form override is deferred to T007
  or T010, and the recorded Summon, boilerplate, ds-app Storybook and Svelte WPE
  boundaries remain unchanged.

### Key entities

- **Primitive dimension**: A value token with no component-spacing purpose.
- **Semantic spacing role**: A stable relationship identified by purpose and
  logical axis.
- **Relationship evidence**: A measured owner/property/edge fact supporting a
  role assignment or non-token disposition.
- **Product context**: Site, Docs, App or OS value selection that preserves the
  semantic identifier.
- **Density member**: Comfortable/default or dense value for a role proven to
  respond to governed tight context.
- **Density provider**: An approved host that establishes local dense context.
- **Density subscriber**: An approved component that binds specified roles to
  the inherited density member.
- **Generated channel**: A public semantic CSS property or private resolution
  property produced from the source and policy.

## Success criteria

- **SC-001**: One hundred percent of the frozen spacing denominator has a final
  semantic assignment or explicit non-token disposition. The denominator is the
  **component inventory** — every exported part and its spacing-owning
  subcomponents — not a hand-built ledger of previously measured relationships.
  Completeness is proven mechanically: no hardcoded length may remain in a
  migrated package's CSS without a recorded disposition.
- **SC-002**: Every approved category survives at least one attempted merge and
  one breaker review.
- **SC-003**: A cold reviewer can reproduce the token count and every membership
  from the review packet without consulting chat history.
- **SC-004**: All Site, Docs, App and OS semantic tokens resolve to valid DTCG
  dimensions with stable IDs.
- **SC-005**: Every density-responsive role resolves both members for every
  supported product, with no public density selector or private metadata leak.
- **SC-006**: Browser proof shows enrolled components automatically fit every
  approved tight host and non-subscribers remain unchanged.
- **SC-007**: The design-tokens contribution and each downstream adoption cut
  are independently reviewable and pass their repository gates.
- **SC-008**: Cascade tests cover product → host → subscriber,
  host → nested-product → subscriber, same-element product/provider and
  reset → provider order. An undeclared portal does not inherit its source
  provider; it resolves from target DOM ancestry and otherwise uses the target
  product default.
- **SC-009**: The final recut ledger contains no duplicate or unassigned
  approved relationships and records exact parent, provider, path, proof, size
  and rollback identities for every slice.

## Assumptions

- The current Pragma evidence is still being completed and is not semantic
  approval.
- The existing 12-token provider remains supported until migration is approved.
- Baseline and page/grid relationships keep their existing owners and are not
  silently reclassified from the component audit.
- Site, Docs and App are required Pragma contexts; OS remains a first-class
  provider context even where Pragma lacks a current consumer.
- The Figma density exploration is visual evidence, not the schema authority.
- This package may supersede older density conclusions that required explicit
  caller-authored `is-nested` states.
