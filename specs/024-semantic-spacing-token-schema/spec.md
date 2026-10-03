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

---

### User story 5 – See what every reviewed change does to the components (Priority: P1)

The design-system owner can open one page at every review gate and see each
real Pragma story before and after the change under review, per product, with
the changed ones first. The owner approves or rejects what the components look
like; the reviewer approves or rejects whether the code follows the rules.

**Why this priority**: Reviewers check code against the spec's rules and
numbers. Only the owner can judge whether the result looks right, and
author-made comparison stories show only what their author chose to show. A
gate that the owner cannot see is a gate the owner cannot hold.

**Independent test**: Given only the gallery link from a review request, the
owner can say which components changed, in which products, and whether each
change is wanted, without reading code, measurements or chat history.

**Acceptance scenarios**:

1. **Given** a review request, **When** the owner opens its gallery, **Then**
   every story of every touched Storybook appears as a before/after pair for
   Site, Docs and App, changed pairs first, with the before and after commits
   named.
2. **Given** a reviewer finding with a visible effect, **When** the owner reads
   it, **Then** it names the gallery entry – story, product and where to look.
3. **Given** the reviewer accepts but the owner rejects a visible change,
   **When** the gate is recorded, **Then** the gate has not passed.

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
  intended geometry. For the recut, FR-063 removes the border-subtraction step:
  strokes take no layout space.
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
  Occupied-total agreement alone is not sufficient. This identity is the
  spike's historical record; under FR-063 the recut identity is
  `padding = inset + nudge` with a zero computed border on every stroked edge.
- **FR-039b**: The rhythm correction has two computed terms at opposite edges,
  neither ever authored. A **phase** term at block-start puts the element's
  first baseline where a body text baseline would sit on its rhythm step; body
  text's phase is therefore zero. A **compensation** term at block-end ends the
  element on a whole rhythm step, and its sum MUST include the phase term. On
  the default `bU` step the compensation rounds up only. Inside a body-phase
  container (FR-043e) it cancels the element's own nudge instead, so it may be
  negative by at most that nudge. Both terms MUST read a rhythm step named for
  its context rather than one global value, and MUST be excluded from the
  semantic token count and from public `--spacing-*` output on the same basis
  as `spacing.baseline` under FR-021 and FR-022.
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
  is a whole multiple of the contextual rhythm step. On the type scale the
  body-line multiples are Site H1/H2/H5/H6, Docs H1/H2 and App H5/H6. Owner
  direction, 2026-10-03, superseding the earlier exception table: inside a
  body-phase container every other heading role takes the nearest whole body
  line, never less than its font size – Site H3/H4 24/24, Docs H3/H4 24/40,
  Docs H5/H6 18/20, App H1/H2 24/40 and App H3/H4 18/20. This is a contextual
  override, not a typography-token change; outside a body-phase container the
  type scale applies unchanged. Site 24/24 and the 24/40 roles are pending
  owner visual review.
- **FR-039c**: Every control MUST resolve to a whole number of its declared
  rhythm step in every product. A text owner MUST do so at one, two and three
  lines; inside a body-phase container this holds for every role through the
  FR-039b3 override.
- **FR-039d**: Border subtraction MUST be per edge and MUST read the actual
  border on that edge. A nominal constant border applied so that bordered and
  borderless variants share one geometry is not equivalent and MUST NOT be used.
  Superseded for the recut by FR-063: no stroke is a layout border, so there
  is nothing to subtract.
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
  and restored geometry MUST be measured. Under FR-063 these waivers lapse at
  the recut: each member sets a zero layout border and paints its stroke,
  with native Select subject to FR-063f.
- **FR-039g**: The T004d1a target is rem-scaled: Site/Docs/App are 40/32/32 at a
  16px root and 45/36/36 at an 18px root. Exploratory completion runs Chromium
  DPR 1, both roots, all three products and all four members; Chromium is
  authoritative at 1/32px. The six existing Chromium, Firefox and WebKit × DPR
  1/2 projects are deferred to CP2 under FR-046b and MUST NOT be reimposed as a
  pre-CP1 T004d1a gate. At CP2, Firefox and WebKit are recorded at 0.5px;
  excess engine rounding is carried rather than hidden by loosening Chromium.
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
- **FR-043c**: Owner direction, 2026-09-30, superseding the FR-043 values for
  `group` and `pattern` and resolving FR-043b. Gaps between blocks snap to the
  nearest whole body line:
  - `group` is one body line: Site 24px, Docs 20px, App 20px;
  - `pattern` is Site 72px (three lines) and Docs/App 40px (two lines).

  `element` stays on the baseline unit (8 / 4 / 4). It separates items inside
  one unit, such as toolbar controls, where body rhythm is deliberately not
  tracked. The system does not force body rhythm on arbitrary stacks inside
  components. A snap that would move a value by more than a quarter of its
  previous size MUST be flagged for owner review rather than applied. No
  current step exceeds that threshold: 16→20, 32→40 and 64→72 are all at or
  under a quarter.
- **FR-043d**: Owner direction, 2026-09-30: a one-line heading/body baseline
  residual under 1px is accepted. The alignment formula should be as exact as
  the font's own metrics allow. The browser's whole-pixel rounding of font
  ascent, descent and half-leading is not emulated or compensated. The
  distinction from FR-039's 1/64px snapping is deliberate: a bounded
  per-element error is accepted, while an error that accumulates across
  elements is not.
- **FR-043e**: Owner direction, 2026-10-03, superseding the 2026-09-30 default
  body-line closure. Body phase is **opt-in** through a container class; the
  default rhythm step is `bU`. The contract is the spacing specification
  §2.8.3:
  - the class sets the rhythm step its text descendants correct to, plus the
    three rules that change with it: phase is measured from a body anchor
    the container computes once from body text's own `1cap` (a registered
    `<length>`, so descendants cannot reinterpret it); compensation cancels
    the nudge instead of rounding up (FR-039b); and an `element` gap after a
    heading folds into the heading's compensation. Heading snapping
    (FR-039b3) follows from the step. The class owns no semantic spacing;
  - every text element calculates nudge, phase and compensation from its own
    line height and `1cap` on the element itself, so an inherited step switch
    recalculates them. Custom properties substitute `var()` where they are
    declared, so per-role results precomputed on a product root cannot follow
    the switch and MUST NOT be the mechanism;
  - a `.ds` component root resets the step to `bU`;
  - inside the container, semantic gaps between text blocks are whole body
    lines, and an `element` gap after a heading is a minimum folded into the
    heading's compensation;
  - the flow starts on a body line, and non-text content in it must occupy
    whole body lines;
  - no JavaScript. With FR-039b3's snapped heading line heights, CSS alone
    keeps every line in phase without counting wrapped lines.

  Evidence: the body-phase concept bench (FR-054h), first built at
  `H:\WSL_dev_projects\temp\body-phase-demo\index.html`: 15 of 15
  blocks in phase on all three products with snapped leading, at a prose
  height of 984 / 780 / 680px against 1048 / 740 / 656px on the `bU` grid.
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
- **FR-051a**: Owner direction, 2026-09-29, supersedes FR-051 only for T008.
  Current-main comparison evidence MAY use the local Pragma branch
  `test/spec-024-t008-comparison`, based on synced local `main == origin/main`.
  It MUST contain only evidence fixtures and collectors, MUST identify its exact
  base and capture HEAD, and MUST never be pushed, PR'd, merged, published or
  used as a production base. The earlier recovery-snapshot spike remains the
  historical T004 source; it is not rebased or presented as current-main proof.
- **FR-052**: The Spec 024 capture MUST reuse both pre-existing configurations:
  `packages/react/ds-global/playwright.spacing.config.ts` on port 6106 for
  Button/Chip, with `PRAGMA_BUTTON_SPACING_OUTPUT` set to external subdirectory
  `H:\WSL_dev_projects\temp\spec-024-t004d1a-evidence-20260927-final2\ds-global-6106`,
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
- **FR-053a**: The 2026-09-28 owner decision releases T004g with shallow Section
  mapped to the surface inset and default/hero/deep Section mapped to the strip
  inset. Strip and Section share a major page-section inset magnitude because a
  change to that rhythm should change both; they differ by edge application,
  not semantic magnitude. Strip applies the value at both block edges, while
  Section applies it at its relevant section edge. This is the FR-042 merge
  argument: do not mint `spacing.inset.section.block` or a fifth FR-050 channel.
  Delete the illegal `--spacing-gap-section-block` declaration and update its
  three tests with this decision. Delete the bordered Section override so it
  inherits the framed-box surface inset.
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
- **FR-054**: Owner direction, 2026-09-29: every review gate from CP1 onward –
  T012, T018/T019, T025, every Pragma cut review under T026b and T028a – MUST
  ship a **visual gallery** with its review request, and MUST NOT pass without
  a recorded owner visual sign-off of that gallery. Reviewer acceptance is
  necessary but not sufficient. The gallery is the owner's evidence; the FR-046
  comparison sheet remains the author's geometry evidence and MUST NOT be
  offered in place of the gallery.
- **FR-054a**: The gallery renders the **existing** stories of every Storybook
  the candidate touches – not a hand-picked subset and not evidence-only
  stories – twice: once at the candidate's exact parent or base ("before") and
  once at the candidate ("after"). "Before" MUST be the commit the candidate is
  built on, never an unrelated mainline, so that every visible difference is
  caused by the candidate. Each story renders for Site, Docs and App through the
  Storybook product global, in Chromium at DPR 1, a 16px root and one fixed
  viewport recorded in the gallery. Evidence-only stories MAY appear in a
  separate, labelled section that does not count towards coverage.
- **FR-054b**: The gallery is one self-contained HTML page. Its header names
  the gate, both commits, the viewport and, per package, the number of stories
  changed, unchanged and failed to render. Changed pairs come first, ordered by
  the share of pixels that differ; unchanged pairs are listed and collapsed so
  that what has *not* moved is visible too. Each pair shows before, after and a
  highlighted difference, the change in rendered height, and a per-product
  baseline-unit and body-line guide overlay that can be toggled. A story that
  fails to render in either state is listed as failed, never omitted.
- **FR-054c**: The gallery author MUST add a short "where to look" list of three
  to ten entries, each linking to one pair and saying in one line what
  changed and why. Every reviewer finding with a visible effect MUST cite the
  gallery entry – story, product and region – and a finding with no visible
  effect MUST say so.
- **FR-054d**: Owner visual sign-off MUST be recorded in the gate's task entry
  and review file with the date, the gallery manifest SHA-256, a verdict of
  accept or reject, and any rejected pairs with a one-line reason. Rejected
  pairs block the gate exactly as a reviewer P1 does. In the Pragma recut, each
  cut's sign-off MUST be recorded before the next cut starts, so the owner
  approves one component family at a time.
- **FR-054e**: Every agent hand-back to the owner MUST end with exactly three
  items: the gallery link (or "no visible change" with the reason), what the
  agent is unsure of, and the decisions it needs from the owner. Narrative
  status belongs in the task entry, not in the hand-back.
- **FR-054f**: The gallery generator lives in this package as
  `scripts/build-visual-gallery.ts` and runs with Node, not Bun. It builds
  static Storybooks for both commits in temporary Pragma worktrees and serves
  them on ephemeral ports; it MUST NOT edit Pragma source, write into Pragma,
  or bind ports 6114 or 6115. Output goes to an external evidence root
  `H:\WSL_dev_projects\temp\spec-024-<gate>-gallery-<yyyymmdd>\` with a
  `manifest.json` hashing every image and the page.
- **FR-054g**: Owner direction, 2026-10-03: the owner signs off on a **review
  bench**, not the gallery. The gallery stays as a coverage appendix for
  regressions. The bench is one page, organised by decision rather than by
  story:
  - one section per decision or family, each with a few curated
    compositions and a one-line "what to look for";
  - one identical DOM per composition, rendered once. A toggle (keyboard and
    tabs) swaps between the stylesheet captured at the before commit and the
    one captured at the after commit, so nothing moves except what the
    values move;
  - Site / Docs / App switch, baseline-unit and body-line overlays, and box
    outlines;
  - a composition whose markup differs between the two commits is flagged
    as such, never silently shown with one side's markup;
  - a status per section: decided, implemented, signed off.

  Its generator lives beside the gallery generator, under the same FR-054f
  constraints. Output goes to an external evidence root with a manifest that
  hashes both stylesheets, the markup and the page; FR-054d sign-off records
  that manifest's hash.
- **FR-054h**: Each open decision gets a **concept bench** first: a standalone
  page in pure CSS, free of Pragma code, that isolates one mechanism, lets the
  owner switch between the alternatives and measures the result. Concept
  benches live in this package under `benches/`, with an index listing each
  decision's status. The body-phase demo is the first.
- **FR-055**: Owner direction, 2026-09-30: implement and visually approve the
  Pragma component families before authoring the semantic schema or token file
  in design-tokens. During that work, all candidate values MUST live in the
  single Pragma file `packages/styles/main/src/spacing-roles.css`, which binds
  only `--ds-*` properties. Every value MUST carry a comment naming its
  intended semantic token ID and its Site / Docs / App values, with OS recorded
  as `null`. Pragma MUST NOT declare a `--spacing-*` property (FR-034), and the
  evidence spike remains governed by FR-050 and FR-051: it is evidence only and
  never a production base. CP1 still reviews the taxonomy as a working
  hypothesis; if a family cut changes it, that cut's task entry MUST record the
  change. After the last family is visually approved, T014–T025 MUST transcribe
  `spacing-roles.css` into the schema and design-tokens source and add the
  transcription check then, not before. While the design remains open, the
  verification contract is the FR-054 gallery plus Pragma's root gate before a
  push; no new test or test suite may be added. Existing assertions that pin
  superseded geometry MAY be updated to the new value, or deleted when the new
  model removes what they assert, with the disposition recorded in one line in
  the commit body.
### Owner rulings, 2026-10-02 and 2026-10-03

- **FR-056**: Every component sets its text in the tier's root type size as the
  type scale defines it: the body size, 16px on Site and 14px on Docs/App,
  read from `--typography-text-primary-font-size`. No component reduces its
  font size for density or nesting. Button and field labels at 14px on
  Docs/App are correct.
- **FR-057**: Density is reachable only by nesting an enrolled component in an
  approved host (FR-044). The public `.dense` and `.comfortable` classes are
  deprecated: for one release they stay as selectors that change no component
  geometry, are documented as deprecated, and are removed in the next major
  release. This ruling is the FR-025 disposition for those selectors and
  supersedes the retention in FR-028 and FR-035.
- **FR-058**: A modified element keeps the role of the unmodified one. An
  icon-leading Button uses the action inline inset on both edges, never the
  field inset. An icon-only Button is the square action variant: its inline
  padding equals its block padding so the occupied box is square. The
  Modal/SidePanel close action uses that variant (CP1 decision 6).
- **FR-059**: The continuation indent in Accordion and SideNavigation is
  derived, not authored: start inset + mark size + mark gap. The published
  `spacing.inset.continuation.inline` becomes a deprecated alias that Pragma
  does not read; its removal belongs to T017a.
- **FR-060**: Surface padding scales with the surface, replacing a single
  surface inset role:
  - compact surfaces (Tooltip and similar) use the field inset;
  - standard surfaces (Card, Tile) use the action inset at inline-start,
    inline-end and block-end, and about half of it at block-start, because
    nudged text already brings space above its first baseline;
  - major overlays (Modal, SidePanel) align their gutters with the grid
    margin, a page-level inset owned by the grid under FR-021 and FR-040.

  The owner's starting values are 1rem and 0.5rem for a standard surface;
  they are confirmed on the insets bench (FR-054h). The CP1 role count and
  the merge ledger MUST be recomputed under this ruling before T013.
- **FR-061**: A surface owns its block padding and the `group` gap between its
  sections. Sections carry no block padding of their own, and adjacent insets
  MUST NOT add up to form a seam. A section with its own fill or divider is a
  surface and takes the inset of its size (CP1 decision 4).
- **FR-062**: T013 is split. The taxonomy is approved in writing against the
  CP1 decisions as resolved by FR-043c to FR-061. The visual sign-off moves to
  the review bench (FR-054g) for the recut foundation, and the CP1 gallery is
  not signed.
### Owner ruling, 2026-10-04

FR-063 is the invariant. FR-063a–FR-063f define its default implementation
and limits. FR-063g makes adoption conditional on a stroke bench.

- **FR-063**: **Strokes take no layout space.** A component's padding,
  occupied size and baseline position MUST NOT depend on whether, or how
  thickly, any of its edges is stroked. This supersedes the border-subtraction
  clauses of FR-039, FR-039a1, FR-039d and FR-039f for the recut. Two defects
  motivate it. Chromium snaps layout border widths to whole device pixels, so
  at 150% OS scaling a 1px border lays out at 0.667px (0.8px at 125%): every
  bordered box falls short of its rhythm step, and in a body-phase flow the
  shortfalls accumulate, which FR-043d forbids. Users at 100% and 200% are
  unaffected. Separately, mixed per-side border widths or colours meet on a
  mitred diagonal, so per-side edges taper.
- **FR-063a**: **Default implementation and scope.** A nonempty control or
  surface box – Button, Chip, field chrome, Card, Tile, Tooltip, Modal,
  SidePanel and similar – paints its strokes as inset `box-shadow` layers over
  a zero layout border. Its **paint owner** is the element whose `box-shadow`
  carries those layers. Each of the following needs a named paint owner and
  its own acceptance before conversion, and keeps its current construction
  with its geometry deviation recorded until then:
  - dividers and zero-height separators, because an inset shadow needs a
    nonempty padding box;
  - collapsed-table borders, because of `border-collapse` conflict resolution
    and row-span seams;
  - native chrome that cannot reliably take a zero border (FR-063f).

  Border-drawn shapes that are not edges, such as Tooltip arrows, keep their
  borders.
- **FR-063b**: **Layers and corners.** Each stroked side is its own layer: top
  `inset 0 W 0 0 C`, bottom `inset 0 -W 0 0 C`, left `inset W 0 0 0 C`, right
  `inset -W 0 0 0 C`. A uniform all-side stroke MUST use the spread form
  `inset 0 0 0 W C`, which follows `border-radius` evenly. At square corners,
  per-side layers overlap in declared order, the first listed painting on
  top, instead of mitring. Each component MUST specify that order. Mixed
  per-side strokes on a rounded corner still taper along the curve. They need
  owner visual approval at each supported radius; otherwise use a uniform
  ring, a zero radius or a separately approved construction.
- **FR-063c**: **Composition.** Every `box-shadow` layer a paint owner may
  show – stroke, selection or highlight, focus, elevation – MUST be a named
  custom-property slot, assembled in one declaration in a fixed, documented
  order. Every slot MUST default to the valid no-op layer
  `0 0 0 0 transparent`, never `none`: one `none` member invalidates the
  whole list. Slots MUST be initialised on each paint owner, so no layer leaks
  into descendants by inheritance. State and theme rules MUST set slots and
  MUST NOT replace the assembled property. Existing rules that replace the
  whole list, such as field focus and error in `ds-global-form`, MUST be
  rewritten as slot updates. Slot names are proposed at checkpoint C.
- **FR-063d**: **Forced colours.** Forced-colours mode removes `box-shadow`.
  Every stroked paint owner MUST define its unfocused, focused, invalid,
  selected and disabled states under `@media (forced-colors: active)`, with
  explicit outline ownership and cascade precedence:
  - **Unfocused:** a boundary `outline` of the stroke width with a matching
    negative `outline-offset`, in a system colour. It takes no layout space.
    Where per-side widths differ, it uses the widest stroked side; where a
    boundary is required but no side is stroked, it uses a nonzero fallback.
    Per-side styling is not preserved.
  - **Focus:** focus MAY replace the unfocused boundary outline, provided the
    focused outline preserves control identification and visibly
    distinguishes focus through width, style or position. Colour alone MUST
    NOT be the sole distinction. Where necessary, use a separate paint owner.
    Focused-invalid and focusable-disabled states MUST preserve focus
    indication. The expected default is an inset boundary that becomes a
    thicker inset focus outline. A positive-offset outline needs a clipping
    check.
  - **Other states:** invalid, selected, and any state shown today only by a
    shadow layer, such as SideNavigation's active marker, MUST keep a
    non-colour cue that survives forced colours.
  - **Prohibitions:** no rule may set `outline: none` on a paint owner in
    forced-colours mode. The existing field focus rule that sets
    `outline: none` MUST NOT be carried into the migration unchanged.
    Forced-colour adjustment MUST NOT be disabled to keep shadows.
- **FR-063e**: **Clearance.** Padding stays stroke-independent without
  qualification: no padding is raised to fit a stroke. Each supported variant
  and theme stroke width MUST prove that its strokes stay visible and clear of
  content on straight edges and rounded corners, including where a child has
  an opaque background. A failing variant takes another paint construction or
  a reviewed restriction on stroke width, never extra padding, which would
  break host fit (FR-044).
- **FR-063f**: **Direction, hooks and native controls.**
  - `box-shadow` offsets are physical. Existing physical hooks, such as
    `--form-input-border-width-top|right|bottom|left` and
    `--form-input-border-color-*`, keep their names and physical meaning and
    feed the stroke layers. Renaming them is a separate public-API decision.
  - A logical start or end stroke maps to physical offsets through a
    direction sign. Shared `:dir(ltr)` / `:dir(rtl)` rules set it, and each
    paint owner resets it. Nested direction islands MUST be checked. Vertical
    writing modes are out of scope.
  - Each native control family – text input, textarea, select and range –
    MUST name its paint owner and supported `appearance` mode, reset layout
    borders on that owner and on any relevant internal parts, and keep its
    native affordances, such as the select caret, in forced colours.
    `appearance: base-select` MUST be feature-gated, with a tested
    ordinary-select fallback.
- **FR-063g**: **Evidence before adoption.** Adoption is conditional on a
  stroke concept bench (FR-054h). Before any family adopting FR-063 is signed
  off, the bench MUST show the following beside the layout-border
  construction:
  - occupied geometry at scale factors 1, 1.25, 1.5 and 2, run with real OS
    scaling or Chromium's launch flag `--force-device-scale-factor`. Context
    `deviceScaleFactor` emulation does not reproduce border snapping and
    MUST NOT be cited as evidence;
  - stroke sharpness at those scales;
  - mixed per-side strokes at square and rounded corners;
  - combined focus, invalid, selected and disabled states;
  - dense nesting, with FR-044 host fit;
  - native controls and their affordances;
  - nested RTL;
  - forced-colours states.

  Real Windows contrast-theme keyboard checks in Chromium and Firefox, and
  Safari coverage of normal painting and controls, MUST be recorded by whoever
  ran them. An agent that cannot run one records it as pending and MUST NOT
  claim it.
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
- **SC-010**: Every review gate from CP1 onward has a gallery manifest SHA-256
  and an owner visual sign-off recorded beside the reviewer's verdict, and every
  Pragma cut's sign-off predates the start of the next cut.

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
