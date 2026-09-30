# Spec 026: Body-line text phase

**Feature branch**: `feat/026-body-line-text-phase`

**Created**: 2026-09-30

**Status**: Phase A opt-in implemented and reviewed; CP-B default flip
implemented 2026-09-30 under rulings R1–R5; scope widened to all flow text
and D4 closed as option (c) under rulings R6–R7 the same day. Adversarial
review findings F1–F11 fixed under orchestrator rulings the same day, pending
owner confirmation.

**Input**: Port the owner-approved Pragma rule that keeps headings and
paragraphs in one body-line phase (Pragma Spec 024, T004d2; owner decision
2026-09-28) to BF, delivered as an opt-in first.

**Owner direction for BF**, 2026-09-30: “I'd like to see the in-phase
headings vs paragraphs work we just did on pragma implemented on bf too.” This
approved the Phase A opt-in for BF only.

## Owner rulings, 2026-09-30 (CP-B approval)

Recorded close to verbatim. They approve the in-scope text below as the
default and supersede the Phase A opt-in wording wherever the two differ.

- **R1 – default, not opt-in.** Body-line rhythm is the default. The
  baseline-unit-only text ledger becomes the opt-in via
  `.bf-theme.is-baseline-rhythm`. Remove `.is-body-line-rhythm` entirely (never
  released). Implement with custom properties so the nearest theme wins by
  inheritance: root and tier blocks declare body-line terms on
  `:where(.bf-theme)` (and the `.bf-tier-*` class blocks);
  `:where(.bf-theme.is-baseline-rhythm)` redeclares them to the bU ledger
  (phase 0, closure = existing margin-bottom, list and hgroup terms to their
  bU equivalents). Application rules read the properties, so a default theme
  nested in an opted-out root and vice versa both resolve correctly. Under
  `.is-baseline-rhythm` the rendered geometry of in-scope text must equal
  main's current geometry exactly (differential rendered check).
- **R2 – metrics only.** BF stays metrics-only (already in `AGENTS.md`); do
  not introduce `1cap` anywhere.
- **R3 – lists.** Nesting must not affect item-to-item line boxes, and tight
  items must sit at line spacing. Implement the container-owned list block: a
  prose list (`.bf-prose > ul`, `.bf-prose > ol`) carries the body nudge and
  phase once as `padding-block-start` and the closure once as `margin-bottom`;
  closure = `roundUp(nudge + phase, step) − (nudge + phase)`, valid for any
  item count because body line height equals the step (assert that equality
  statically per tier). Items and nested lists carry zero block padding and
  margin, so every line – item to item, item to nested item, nested to next
  outer item – advances exactly one line height. Loose items (`li` containing
  a block `p`/`.bf-body`): the inner `p` carries zero nudge, phase and
  closure, and consecutive loose items are separated by exactly one body step,
  so phase holds. Fix the `ul` dot and `ol` marker vertical position so the
  dot's relation to the first baseline equals main's current relation
  (measured in main's geometry, asserted equal). Remove the old per-`li`
  ledger and the loose-item custom properties that no longer apply. Under
  `.is-baseline-rhythm` lists keep main's current per-item geometry.
- **R4 – heading join.** In `.bf-prose > hgroup` the direct children keep
  their own role phase and closure, and every child after the first gets
  `margin-block-start: calc(-1 * var(--bf-body-rhythm-step))` – one whole
  body step, so phase is preserved. Predicted h1 → h2 baseline-to-baseline
  distance: Editorial 3rem, Documentation 2.5rem, App 2.5rem, OS 2rem; verify
  in the browser and record. Add a static proof per tier that the pull never
  brings the following child's first baseline closer to the previous last
  baseline than the following role's cap height plus the previous role's
  descender, from metrics. If any tier fails, record it and limit the join
  rather than overlap glyphs. Do not add negative-margin utilities.
- **R5 – D4 stays open.** Container gaps are not ruled; keep the demo
  candidates. *Superseded by R6.*

## Owner rulings, 2026-09-30 (R6–R7)

Recorded close to verbatim. They supersede R5 and widen the scope of R1, R3
and R4 from prose flows to all flow text.

- **R6 – D4 = option (c). Text blocks space themselves.** The closure already
  supplies one blank body line, so the container gap between two adjacent
  in-scope text blocks is zero. `.bf-prose` has gap 0 under the default
  rhythm and its current shallow gap under `.is-baseline-rhythm`. `.bf-stack`
  (and any other BF flow container that separates children with `gap`)
  cancels the gap only between two adjacent in-scope text blocks, exactly,
  through a negative `margin-block-start` of the parent stack's
  `--bf-stack-space`, driven by custom properties so `.is-baseline-rhythm`
  and component roots restore current behaviour. The inherited
  `--bf-stack-space` must be the parent stack's value in every case.
  Text-to-component adjacency keeps the stack gap. Recorded exception: text
  following a non-text sibling starts at a bU-quantized offset, so body-line
  phase after a component is not guaranteed; the demo shows it.
  *Interpreted by orchestrator ruling F1: “gap 0” means zero gap between two
  adjacent text blocks, not a zero prose gap; F4 limits the cancel to
  pattern-internal stacks.*
- **R7 – default everywhere.** Body-line rhythm (phase inset, whole-body-line
  closure, container-owned list block, hgroup join, R6 gap cancel) applies by
  default to flow text anywhere under `.bf-theme` – `p`/`.bf-body`,
  `h1`–`h6`/`.bf-h1`–`.bf-h6`, BF-styled semantic `ul`/`ol` text lists and
  `hgroup` – not only to direct children of `.bf-prose`. Component internals
  keep the baseline-unit ledger: every BF component root redeclares the
  rhythm custom properties to their bU equivalents exactly as
  `.is-baseline-rhythm` does, in one shared selector list built from source,
  with a static check that every component class in the component and
  pattern demo markup is covered or is an explicit flow container.
  `.bf-engine-cap` stays excluded and `.is-baseline-rhythm` remains the
  public opt-out. Proof: `npm run test:components` passes with no change to
  `scripts/verify-component-baselines.ts` beyond what was already committed;
  a failing component is fixed by resetting its root, never by changing the
  check. Nested default themes, `.is-baseline-rhythm` subtrees and component
  roots all resolve by nearest-declaration inheritance, and under
  `.is-baseline-rhythm` rendered geometry equals main exactly, including text
  in a `bf-stack` and bare in a section.

## Orchestrator rulings, 2026-09-30 (adversarial review F1–F11)

Orchestrator decisions on the R6/R7 adversarial review, **pending owner
confirmation**. They refine R6 and R7; where they differ, they win until the
owner rules otherwise.

- **F1 – R6 is text-to-text only.** R6 means zero gap between two adjacent
  text blocks, not a zero prose gap. `.bf-prose` keeps its
  `--bf-section-space-shallow` gap and cancels it between two adjacent text
  blocks with the same mechanism as stacks. Non-text children (`pre`,
  `table`, `figure`, components, `hr`, `blockquote`) keep the gap; the
  clearance after each equals main in every tier.
- **F2 – hidden neighbours.** The preceding compound excludes `[hidden]`, so
  a hidden first text block never pulls the next one above the container.
- **F3 – control rows.** `.bf-cluster > *` is a bU ledger root: text in a
  row aligns to its controls. The vertical-audit assertions return to main.
- **F4 – section boundaries keep their gap.** Only pattern-internal stacks
  (default, `is-extra-dense`, `is-dense`, `is-loose`) cancel; section stacks
  (`is-section-shallow`, `is-section`, `is-section-deep`) are boundaries
  between complete sections or patterns (AGENTS invariant). Every cancelled
  gap must leave a non-negative margin box and a whole-line advance.
- **F5 – element-styled containers.** `blockquote`, `table` and `fieldset`
  join the reset roots inside `:where()`; the markup scan covers
  element-styled components.
- **F6 – root neighbours.** The join's preceding and following compounds
  exclude every reset root, generated from the same list, at zero
  specificity.
- **F7 – token per modifier.** The cancel reads the parent's modifier token,
  so a child's own `--bf-stack-space` never matters. A child `.bf-prose` or
  non-`hgroup` `.bf-stack` is not a text block and keeps the gap (simplest
  correct rule). `hgroup` children take the join and no stack gap.
  `display: contents` wrappers keep the gap (recorded exception).
- **F8 – release.** README carries an “Unreleased” migration note; the first
  release containing Spec 026 must be `0.3.0` or later
  (`docs/publishing.md`). No version change here.
- **F9 – behaviour script hygiene.** One statement per line; the injected
  chrome suspension is always removed.
- **F10 – AGENTS wording.** One short bullet; detail in
  `docs/architecture.md`.
- **F11 – component panels.** Panels keep the bU ledger; recorded as an open
  owner question.

## Open owner questions

- **Q1 (F4).** Body-line phase after a section boundary is not guaranteed,
  because section gaps are baseline-unit tokens (for example Documentation
  `is-section` 48px against a 20px body line). Accept, or quantize section
  gaps to whole body lines?
- **Q2 (F11).** Component panels – `bf-panel`, `bf-panel-content`,
  `bf-tabs-panel`, `bf-accordion-panel`, `bf-modal-body`, `bf-aside` – are
  reset roots, so app-tier prose inside them keeps the bU ledger and differs
  from page prose. Keep, or let panels host body-line flow text?
- **Q3 (F1–F7).** Confirm the orchestrator rulings above.

BF closes every metric-aligned text element to the baseline unit (bU). The
element owns its measured top nudge and a bottom margin of `bU − nudge`, so a
one-line block occupies `line-height + bU`. Every first baseline lands on the
bU grid, but not on the body-line grid that reading text advances on. The body
line is 3 bU in Editorial, 5 bU in Documentation and App, and 4 bU in OS, so
each one-line paragraph moves the next block within the body-line cycle: 8px
in Editorial and 4px in Documentation, App and OS at a 16px root. Headings
start on a different bU line from body copy in the same flow or in an adjacent
column.

Pragma solved this with two element-owned terms at opposite edges, and the
owner ruled that the product body line is the rhythm step and that full
in-phase closure is accepted: the stronger common body-line phase governs.
Unlike Pragma, BF already derives nudges from real font metrics at build time,
so it computes both terms exactly rather than through the
`(line-height + 1cap) / 2` estimate.

## Outcomes

- Flow text anywhere under `.bf-theme` (R7) – paragraphs, headings and
  `hgroup` children in prose, stacks, sections and page shells – takes a
  block-start phase inset and a block-end body-line closure by default, in
  all four tiers, in direct tier bundles, in the preset bundles and in
  class-scoped tier surfaces.
- Text blocks join on their closure (R6, F1, F4): `.bf-prose` and
  pattern-internal stacks cancel their gap between two adjacent visible text
  blocks, so two one-line paragraphs are exactly two body lines apart in
  every tier; section stacks and non-text neighbours keep their gap.
- Component internals keep the baseline-unit ledger (R7, F3, F5): every
  class the component, grid and preset CSS styles, except flow containers
  and page shells, every `bf-cluster` child and `blockquote`, `fieldset` and
  `table` share the opt-out block.
- A prose `ul`/`ol` is one container-owned block: the body nudge and phase
  once at the top, the closure once at the end; tight items, nested items at
  any depth and the next outer item each advance one body line; loose items
  are one body line apart; the `ul` dot keeps main's relation to the first
  baseline.
- A prose `hgroup` joins its children with a one-step pull, limited to 0 for
  the pairs whose static glyph-clearance proof fails.
- `.bf-theme.is-baseline-rhythm` restores main's baseline-unit ledger for its
  subtree, rendering exactly main's geometry; the nearest theme root wins in
  both directions.
- Phase, closure and list terms are computed in TypeScript at build time from
  the same real font metrics as the nudge and emitted as private rem literals.
- Existing role nudge and compensation properties, token JSON, surface
  manifests and all CSS outside the section are unchanged: the generated CSS
  minus the section is main's CSS byte for byte.
- A comparison demo shows the default body-line ledger beside the opt-out per
  tier, light and dark, including hgroup specimens, three-level lists, the
  ruled (c) gaps in prose, a stack and a section, and the text → component →
  text exception.

## Boundaries

- Component text (every element inside a component root), controls, the
  meta role, `blockquote`, `hr`, `pre`/`code`, `a.bf-text-link` and the
  cap-engine demo stay on the bU ledger (R7).
- No type-scale token changes to chase wrapped exceptions.
- Neither term is a spacing token. No public spacing property, no DTCG
  spacing entry and no `--bf-space-*` change. No negative-margin utility.
- Container gaps change only as ruled in R6 with F1 and F4: prose and
  pattern-internal stack gaps are cancelled between adjacent text blocks.
  Section-stack, `bf-grid` row, `bf-cluster` and `bf-stage-shell` gaps are
  unchanged.
- No `1cap` anywhere (R2). No Pragma source, publication or release.
- T031 (serializing the terms into tokens and manifests) remains open; the
  terms stay CSS-private.

## User scenarios and testing

### User story 1 – Default body-line text phase (priority: P1)

A consumer writes prose in a `.bf-theme` root. Every paragraph and heading
that is a direct child of a `.bf-prose` block or of its `hgroup`, and every
line of a prose list, starts its first baseline on the body-line grid, and
each element closes its occupied block to whole body lines, so later prose
text keeps the same phase. Adding `is-baseline-rhythm` to a theme root
restores main's baseline-unit ledger below it.

**Independent test**: build, then assert the generated literals and cascade
statically (AC-1 to AC-4).

**Acceptance scenarios**:

1. **Given** any built-in tier, **when** a `p` and an `h3` are stacked in a
   zero-gap `.bf-prose` flow, **then** both element tops are whole body lines
   from the flow start and each first baseline sits exactly one phase lower
   than under `.is-baseline-rhythm`.
2. **Given** a root with `.is-baseline-rhythm`, **when** it is rendered,
   **then** every in-scope box, baseline and list dot equals main's geometry.
3. **Given** `<p class="bf-h3">` and `<h3>` as prose children, **then** both
   occupy the same box.

### User story 2 – Rendered phase proof (priority: P2)

A maintainer runs the behaviour suite and sees, for body and all 24
tier/heading combinations, that the default moves each first baseline by
exactly its phase relative to the opt-out and keeps element tops on whole
body lines; wrapped lines advance by one line height; the named exceptions
fail as predicted; list lines advance one line height at every depth; the
hgroup join and the phase after it hold; the opt-out equals main.

**Independent test**: `npm run test:behavior` against the demo fixture.

**Acceptance scenarios**:

1. **Given** Chromium DPR 1 at roots 16px and 32px, **when** one-line h1–h6
   and body share a zero-gap prose flow, **then** `probe − elementTop` default
   minus opt-out equals the phase, and each element top is a whole number of
   steps from the previous element top, both within 0.1px.
2. **Given** editorial h3, documentation h3, app h1 and os h1 wrapped to two
   lines, **then** `line 2 − line 1` is off the nearest whole step by the
   predicted amount within 0.1px.

### User story 3 – Owner comparison (priority: P3)

The owner opens one demo route, switches tier and tone, and compares the
default body-line ledger with the opt-out for a stacked heading, two
paragraphs and a list, heading groups, three-level lists, the D4 gap
candidates and the recorded exceptions.

**Independent test**: browser review in four tiers, light and dark.

**Acceptance scenarios**:

1. **Given** the demo in any tier, **then** both ledgers render side by side
   with their nudge, phase and closure values labelled.
2. **Given** the gap comparison row, **then** alternatives (a), (b), (c) and
   (d) from D4 are visible for the active tier.

### Edge cases

- A wrapped heading whose line height is not a whole body-line multiple:
  line 1 is in phase, later lines and following content are not. Recorded as a
  type-scale exception, not fixed.
- OS h1/h2 at three lines returns to phase (`2 × 1.5rem = 3 × 1rem`); the
  exception proof uses two lines.
- A default `.bf-theme` nested inside an opted-out root resolves the
  body-line ledger, and an opted-out root nested in a default one resolves
  the bU ledger, through inherited private properties.
- `.bf-stack.is-metric-flush` keeps cancelling the inner compensation and
  nudge; phase is cancelled with the nudge. Baseline-to-baseline distance
  inside the pair is unchanged, but content after the pair is off phase by
  `(n₁ + ph₁ + lh₁ − n₂ − ph₂) mod step`: 2.54px in Editorial, 3.38px in
  Documentation, 2.27px in App and 0.41px in OS for h2 then p. Recorded
  exception.
- Custom `ul` markers in `.bf-prose` are absolutely positioned from the item
  top; with items carrying no block padding, the marker subtracts the body
  nudge so its relation to the first baseline equals main's. Native `ol`
  markers follow the first line baseline.
- Loose list items (`<li><p>`, as Markdown renders them): the inner
  paragraph carries no nudge, phase or closure, and consecutive loose items
  are one body line apart. Several paragraphs inside one loose item are not
  separated (no rule covers `li > p + p`); recorded, not asserted.
- Nested lists no longer drift: items and nested lists carry no block terms,
  so every line advances one line height at any depth.
- A prose `hgroup` pair whose one-step pull would bring the following caps
  inside the previous descender stays unjoined: Documentation h1/h2 → h5/h6
  and OS h1/h2 → h3/h4 (research R9).
- `hr` (0.5rem occupied) and `blockquote` (body line height plus bU) break
  phase for following prose content. Recorded exceptions.
- Component text is outside the body-line scope because every component
  root redeclares the bU ledger (R7). The root list is every `bf-*` class the
  component, grid and preset CSS styles, minus flow containers and page
  shells; a static markup scan proves every component class in the component
  and pattern demos and README examples is covered (AC-3).
- Text after a component or any other non-text child keeps the container
  gap, so it starts on a bU-quantized offset and its body-line phase is not
  guaranteed (R6, F1). Recorded exception, shown in the demo.
- A child `.bf-prose` or non-`hgroup` `.bf-stack` is not a text block (F7):
  text before and after it keeps the parent gap, so body-line phase inside
  and after it is not guaranteed (Documentation `h1 + .bf-prose`: gap
  24px). An `hgroup.bf-stack` is a text block: it joins its neighbours with
  the parent's token, and its own gap resolves to 0 under the default ledger.
- A hidden or `display: contents` sibling between two text blocks leaves
  the gap in place (F2, F7). Under-cancelling is safe; recorded exception.
- Section stacks keep their gap (F4), so body-line phase after a section
  boundary is not guaranteed (open question Q1).
- Every cancelled pattern-internal gap is at most the shallow section space
  (1.5rem; App 0.5rem) and every one-line text block occupies at least two
  body lines (2rem or more), so the margin box never goes negative and the
  grid track never clamps (static proof per tier, rendered proof per
  modifier).
- A page-local override of a flow container's `gap` under a text-to-text
  join over-cancels, because the join reads the token; BF's own stacks never
  override it outside component roots.
- Consumer overrides of role font size or line height invalidate the
  precomputed literals, as they already invalidate the nudge.
- A custom surface without computable rhythm data emits no section; its text
  keeps the bU ledger and `.is-baseline-rhythm` is a no-op. Built-in surfaces
  fail the build instead.

## Requirements

### Functional requirements

- **FR-001** (amended by R1, R6, R7): body-line rhythm is the default for
  in-scope text. `.is-baseline-rhythm` on a `.bf-theme` root restores the bU
  ledger and the authored gaps for its subtree. `.is-body-line-rhythm` is
  removed. No `data-*` selector and no new public class or modifier; the gap
  behaviour of R6 needs none.
- **FR-002**: every built-in direct tier bundle (`dist/tiers/<tier>`), the
  preset bundles `dist/presets/prose` and `dist/presets/app-tier`, and every
  class-scoped tier surface (`:where(.bf-theme.bf-tier-<tier>)`) emit the
  terms for their own surfaces; each tier resolves the same values wherever it
  appears.
- **FR-003** (amended by R3, R4, R7): in-scope elements are every
  `p`/`.bf-body` and `h1`–`h6`/`.bf-h1`–`.bf-h6` under `.bf-theme`; every
  `hgroup`; every outermost `ul`/`ol` inside `.bf-prose` (the BF-styled
  semantic lists) and every `li` inside `.bf-prose`; and `p`/`.bf-body` that
  are direct children of such an `li`. Plain and role-classed equivalents
  occupy the same box. Inside a component root every term resolves to the bU
  ledger (FR-023).
- **FR-004** (amended by R7, F5): out-of-scope text (meta/`figcaption`,
  `blockquote`, `hr`, `pre`/`code`, `a.bf-text-link`, controls) keeps its
  current declarations, and text inside `blockquote`, `table` and `fieldset`
  keeps the bU ledger. Every application selector excludes the cap-engine
  demo with `:not(:where(.bf-engine-cap, .bf-engine-cap *))`.
- **FR-005** (amended by R1): per in-scope role and surface,
  `--bf-<role>-rhythm-step`, `--bf-<role>-phase-start` and
  `--bf-<role>-closure-end` are rem literals declared on `:where(.bf-theme)`
  and each `:where(.bf-theme.bf-tier-<tier>)` block, together with the list,
  loose-item and hgroup terms of the [contract](contracts/body-line-phase.md);
  `:where(.bf-theme.is-baseline-rhythm)` redeclares every term to the bU
  ledger.
- **FR-006**: phase and closure follow
  [the contract](contracts/body-line-phase.md): phase is added after the
  existing nudge in `padding-block-start`; closure replaces the role bottom
  margin; `padding-block-end` stays `0rem`.
- **FR-007**: both terms round up only; `0 ≤ phase < step` and
  `0 ≤ closure < step`.
- **FR-008**: the rhythm step is the surface body line height for every
  in-scope role and must be a whole bU multiple. A built-in surface fails the
  build otherwise; a custom surface gets no rhythm data.
- **FR-009**: `--bf-<role>-nudge-start`, `-nudge-end`,
  `-baseline-compensation` and `-margin-bottom` keep their current meaning and
  values everywhere.
- **FR-010**: terms are computed from the same font files and hhea metrics the
  nudge generator uses, read per role `fontFamily`. The build recomputes each
  generator nudge and fails a built-in surface if it differs from `nudgeTop`
  by more than 0.00001rem. No `1cap` (R2).
- **FR-011**: generated CSS outside the section is byte-identical to main's
  generated CSS. Every `tokens.json` and `surfaces.json` is byte-identical to
  main. Compiled TypeScript outputs in `dist/` are expected to change.
- **FR-012** (amended by R1): the nearest theme root wins. A default
  `.bf-theme` nested in an opted-out root resolves the body-line ledger and an
  opted-out root nested in a default one resolves the bU ledger.
- **FR-013**: `.bf-stack.is-metric-flush` rules keep precedence over the
  body-line rules.
- **FR-014** (amended by R3): the `.bf-prose ul` dot keeps main's offset from
  the first baseline at every nesting depth, for tight and loose items, and
  under both ledgers.
- **FR-015** (replaced by R6, amended by F1, F2, F4, F6, F7): `.bf-prose`
  keeps main's gap. Every child of a stack or prose block declares
  `--bf-text-join-gap` from its parent's modifier token, in main's modifier
  order: default `--bf-section-space-shallow`, `is-flush` `0rem`,
  `is-extra-dense` `--bf-space-half`, `is-dense` `--bf-space-1`, `is-loose`
  `--bf-space-2`, any section modifier `0rem`, and `.bf-prose`
  `--bf-section-space-shallow` last. In a prose block or stack that is not
  an `hgroup` or `is-metric-flush`, a text block that directly follows a
  visible (`:not([hidden])`) text block, where neither is a reset root, takes
  `margin-block-start: calc(var(--bf-text-join-gap) * (var(--bf-text-gap-scale) - 1))`.
  An `hgroup.bf-stack` takes `gap: calc(var(--bf-stack-space) * var(--bf-text-gap-scale))`.
  `--bf-text-gap-scale` is `0` in every surface block and `1` in the bU
  ledger block. Text blocks are body, h1–h6 (semantic and classed), `hgroup`
  and prose lists.
- **FR-016**: the comparison demo lives at `demo/spec/body-line-rhythm.html`,
  is listed with the spec chapter pages, dogfoods BF classes and uses only
  minimal local specimen CSS.
- **FR-017**: wrapped-heading exceptions are recorded, not fixed through type
  tokens.
- **FR-018** (amended by R1, R7, F10): README and architecture document the
  default and the `.is-baseline-rhythm` opt-out. The `AGENTS.md` invariant is
  one bullet of at most five lines: containers own semantic gaps, flow text
  closes to whole body lines and containers cancel only pattern-internal gaps
  between adjacent text blocks, and component internals and
  `.is-baseline-rhythm` keep the bU ledger; `docs/architecture.md` and
  `docs/agent-index.md` hold the detail. BF stays metrics-only.
- **FR-019** (replaced by R3, widened by R7): an outermost prose list
  (`.bf-prose :is(ul, ol)` not inside a prose `li`) carries `padding-block-start: nudge + phase` and
  `margin-bottom: roundUp(nudge + phase, step) − (nudge + phase)` of the body
  role; its items and nested lists carry no block padding or margin; a loose
  item's direct paragraphs carry no nudge, phase or closure; a loose item
  that follows a loose item starts one body step later. The Phase A per-`li`
  ledger and `--bf-body-loose-item-*` properties are removed.
- **FR-020** (R4, widened by FR-022): in an `hgroup`, children keep their own role
  terms, and every child after the first takes
  `margin-block-start: var(--bf-hgroup-join)`, which resolves to
  `calc(-1 * var(--bf-body-rhythm-step))` by default. Pairs whose static
  clearance proof fails in a surface take `0rem` in that surface through
  `--bf-hgroup-join-<previous>-<following>`.
- **FR-021** (R1, R7): under `.is-baseline-rhythm` every in-scope box, line
  baseline and list dot renders exactly main's geometry, including hgroup
  children (no join), lists (main's per-item ledger), prose and stack gaps,
  text in a `bf-stack` and text bare in a section.
- **FR-022** (R7): `hgroup` join and limited-pair rules select every
  `hgroup` under `.bf-theme`, not only prose ones.
- **FR-023** (R7, F3, F5): the bU ledger block's selector is
  `:where(.bf-theme.is-baseline-rhythm, .bf-cluster > *, blockquote, fieldset, table, .<root>, …)`,
  where the roots are
  every `bf-*` class in the component, grid and preset CSS emitted after the
  section, minus `BODY_LINE_FLOW_CLASS` (theme, tier and surface roots, text
  roles, `bf-text-link`, the engine markers, layout primitives, `bf-token-row`
  and the page shells `bf-page-shell`, `bf-application`, `bf-main`,
  `bf-site-main`, `bf-docs-layout`, `bf-docs-layout-content`). Every element
  selector styled after the section is a control, `hr`, a table part or an
  element root.
- **FR-024** (R7): component geometry is byte-for-byte unaffected:
  `npm run test:components` passes with `scripts/verify-component-baselines.ts`
  unchanged since CP-B.
- **FR-025** (F8): README carries an “Unreleased” migration note for the
  visible spacing change (`is-baseline-rhythm` on `.bf-theme` roots keeps the
  old spacing), and the first release containing Spec 026 must be `0.3.0` or
  later per `docs/publishing.md`. `package.json` is not changed here.

### Key entities

- **Rhythm record**: per surface – per in-scope role `rhythmStep`,
  `firstBaseline` (F*), `phaseStart`, `closureEnd`; the list block
  `blockStart` and `closureEnd`; and the unjoined hgroup pairs.
  Build-internal; not serialized to tokens or manifests.

## Acceptance

1. **Static formula** – for each tier and in-scope role (4 × 7 records),
   `(F* + phase) mod step` and `(nudge + phase + line-height + closure) mod
   step` are 0 within ±0.00001rem; `phase` and `closure` are in `[0, step)`;
   `step mod bU = 0`; emitted literals equal the
   [contract table](contracts/body-line-phase.md#expected-values). Per tier:
   body line height equals the step; the list block start is body
   `nudge + phase`; the list closure equals the contract value and closes one
   to twelve one-line items to whole steps; the hgroup clearance proof holds
   for every joined pair and fails exactly for the unjoined pairs; the h1 → h2
   joined distance equals the R4 prediction.
2. **Static identity** – for every generated bundle, CSS with the section
   removed, opening to closing comment inclusive, equals CSS generated
   without rhythm data, and equals main's generated CSS byte for byte; every
   `tokens.json` and `surfaces.json` equals main's.
3. **Static cascade and scope** (amended by R6, R7) – one contiguous
   section, opened and closed by the contract comments, follows the prose
   list and blockquote rules; the shared opt-out and component-root block
   follows every surface block and lists exactly the roots derived from the
   CSS after the section; each in-scope role has one unscoped semantic and
   one class selector; the prose gap and stack text-join rules read
   `--bf-text-gap-scale` (0 by default, 1 in the bU block); every application
   selector carries the cap-engine exclusion; no `data-*` selector;
   metric-flush selectors have higher specificity; the retired modifier,
   loose-item properties and prose-only scope are absent; the existing
   `marginBottom = bU − nudgeTop` contract still passes; a markup scan of
   `demo/components`, `demo/patterns` and README examples finds every
   component class and every component text element inside a reset root
   (class, cluster child or element root, F3/F5); the text-join gaps mirror
   main's stack modifier tokens in order with section stacks at 0 (F4, F7);
   every one-line text block and one-item list absorbs every cancelled
   pattern-internal gap in every tier (F4).
4. **Direct/class parity** – each tier's literals are equal in its direct
   bundle and in every class-scoped surface; the preset bundles pass AC-1 for
   their own surfaces.
5. **Rendered phase translation** – Chromium DPR 1, roots 16px and 32px, all
   four tiers, zero-height inline-block probes, one-line h1–h6 and body in a
   zero-gap prose flow, default and opt-out: `probe − elementTop` differs by
   exactly the phase, and each element top minus the previous element top is
   a whole number of steps, both within 0.1px. Absolute residual ε is recorded
   in `review.md` as generator metric-authority data and is not asserted.
6. **Rendered wrapped** – with forced two- and three-line headings, each
   line-to-line distance equals the line height within 0.1px, and for
   qualifying combinations the following sibling's top is whole steps from
   the heading top within 0.1px. For editorial h3, documentation h3, app h1
   and os h1 at two lines, `line 2 − line 1` is off the nearest whole step by
   the research R3 prediction within 0.1px and by at least one bU.
7. **Rendered edges** – within 0.1px: a default theme nested in an
   opted-out root matches the default column (matrix, tight, loose and
   nested lists); baseline-to-baseline distance inside a metric-flush pair is
   unchanged. Downstream offsets after metric-flush pairs, `hr` and
   `blockquote` are measured and recorded, not asserted.
8. **Regression** – every other browser family passes; any check that
   legitimately changes because prose text is now body-line phased is
   recorded with its reason in `review.md`.
9. **Browser review** – the comparison demo is reviewed in all four tiers,
   light and dark, with findings in `review.md`.
10. **Gates** – `npm run build`, `npm test` and `npm run qa:components` are
    green.
11. **Opt-out equals main** (R1) – the demo route rendered with the section
    removed from the tier bundle is main's geometry; every `.is-baseline-rhythm`
    fixture box (top from the flow, height, margin, padding), line baseline
    and list dot equals it within 0.1px in all four tiers at both roots.
12. **Lists** (R3) – in every default list fixture each consecutive
    first-baseline delta equals the rendered body line height within 0.1px:
    tight items, ordered items, and a three-level nested list (outer 1 →
    nested 1 → third 1 → third 2 → nested 2 → outer 2); loose items are two
    steps apart; each list block starts at the flow top and occupies whole
    steps; every dot keeps main's offset from its first baseline; a loose
    item's text sits where a tight item's does.
13. **Heading groups** (R4) – for hgroup h1 + h2 and h1 + p, each child keeps
    its own nudge and phase, the second child's top is the first child's
    occupied bottom minus one step, the h1 → h2 baseline distance equals the
    R4 prediction, the group occupies whole steps and the following paragraph
    stays in phase.
14. **Self-spacing text** (R6, R7, F1) – in a default `.bf-prose`, a
    `bf-stack` and bare in a `bf-section`, h2 → p advances by the h2's
    occupied block (whole steps) and one-line p → p first baselines are
    exactly two steps apart; every first baseline sits within `root / 16` of
    a whole step from the flow top; prose keeps its group gap in both
    ledgers; text ↔ component keeps the stack gap both ways; the offset of
    text after a component is recorded, not asserted. The opt-out equals main
    for all four fixtures.
15. **Component geometry unchanged** (R7) – `npm run test:components`
    passes with no change to `scripts/verify-component-baselines.ts` in this
    wave; changed page-text behaviour assertions are listed in `review.md`
    with before and after.
16. **Adjacency** (F1–F7) – Chromium DPR 1, 16px root, all four tiers,
    against main's CSS (the bundle with the section stripped), each fixture in
    a whole-pixel slot, within 0.1px: the clearance after `pre`, `table`,
    `figure`, `.bf-card`, a component list, `hr` and `blockquote` in prose and
    in a stack equals main, and each keeps the gap before it; `stack > p[hidden]
    + p + p` starts at the stack top; a cluster row of `p`, `.bf-button` and
    `.bf-status-label` equals main and shares one baseline; default,
    `is-extra-dense`, `is-dense` and `is-loose` stacks advance p → p by
    exactly two body lines with a non-negative margin box; section stacks
    keep their gap; `blockquote > p`, `td > p` and `fieldset > p` equal main;
    `p.bf-form-help + p` and `p + p.bf-form-help` keep the gap, the first
    with main's clearance; `p + hgroup.bf-stack + p` joins on closures in a
    dense and a default stack whatever the hgroup's own modifier, and its
    children take only the one-step join; a child stack or prose block keeps
    the parent gap; hidden-middle and `display: contents` offsets are
    recorded. Every fixture under `.is-baseline-rhythm` equals main.

## Assumptions

- Chromium DPR 1 is the authoritative rendered engine for this package.
- Built-in tiers define only body and h1–h6; the meta exclusion applies to
  custom themes that define it.
- The drift compensation in the nudge generator stays as published. In
  current Chromium it over-corrects above 1rem (editorial h1 residual −0.91px
  with it, −0.29px without); residuals are recorded, not patched here.
- Cap height comes from the font's OS/2 `sCapHeight` as read by the nudge
  generator's `readFontMetrics` (693 units for Ubuntu Sans).
- Pragma measurements are context for the rule only and are not evidence for
  BF values (D5).
