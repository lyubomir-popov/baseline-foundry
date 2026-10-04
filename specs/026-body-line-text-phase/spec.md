# Spec 026: Body-line text phase

**Feature branch**: `feat/026-body-line-text-phase`

**Created**: 2026-09-30

**Status**: Phase A opt-in implemented and reviewed; CP-B default flip
implemented 2026-09-30 under rulings R1–R5; scope widened to all flow text
and D4 closed as option (c) under rulings R6–R7 the same day. Adversarial
review findings F1–F11 fixed under orchestrator rulings the same day and
confirmed by the owner on 2026-10-01 (R10). Owner rulings R8 (body-line
section and strip boundaries) and R9 (panel content hosts flow text) of
2026-10-01 are recorded and handed over; implementation starts at task T-R0.

**Input**: Port the owner-approved Pragma rule that keeps headings and
paragraphs in one body-line phase (Pragma Spec 024, T004d2, now at
`canonical-spacing-spec/specs/024-semantic-spacing-token-schema/`; owner
decision 2026-09-28) to BF, delivered as an opt-in first.

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

Orchestrator decisions on the R6/R7 adversarial review, **confirmed by the
owner on 2026-10-01 (R10)**. They refine R6 and R7; F4 is refined by R8 and
F11 is resolved by R9.

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
  *Refined by R8: section stacks keep their gap, now snapped to whole body
  lines, so phase after a section boundary holds when the preceding block
  closed to whole body lines; after a component it is still not
  guaranteed.*
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
  owner question. *Resolved by R9: panel content hosts the default
  flow-text rhythm.*

## Owner rulings, 2026-10-01 (R8–R10)

Recorded verbatim. They close open questions Q1–Q3.

- **R8.** Section and strip boundaries must be whole multiples of each
  tier's body-line step. Applies to the three section boundary spacings
  (shallow, section, deep) and the strip block inset across all four
  built-in tiers. Snap each current value to the nearest POSITIVE whole body
  line; on an exact tie, round up. Formula:
  `snapped = step × max(1, floor(value/step + 0.5))`. Resulting table
  (verified from `config/tiers/*.json`; current → snapped):

  | Tier (step) | shallow | section | deep | strip |
  |---|---|---|---|---|
  | editorial (24px) | 24→24 | 64→72 | 128→120 | 64→72 |
  | documentation (20px) | 24→20 | 48→40 | 96→100 | 48→40 |
  | app (20px) | 8→20 | 16→20 | 32→40 | 48→40 |
  | os (16px) | 24→32 (tie, up) | 48→48 | 96→96 | 32→32 |

  App shallow and section both become 20px, so `is-section-shallow` and
  `is-section` become identical in app (owner-accepted consequence of the
  rule; flag it in the review request). Editorial deep and documentation
  deep move in opposite directions.
- **R9.** Panel content hosts the default body-line flow-text rhythm: bare
  flow text in `bf-panel-content`, `bf-tabs-panel`, `bf-accordion-panel`,
  `bf-modal-body` and `bf-aside`. Component chrome – titles, tab labels,
  accordion triggers, controls and other UI internals – stays on the
  baseline-unit ledger.
- **R10.** The owner confirms adversarial-review rulings F1–F11, with F4
  refined by R8 (section stacks keep their gap, now body-line-snapped, so
  phase after a section boundary holds when the preceding block closed to
  whole body lines; after a component it is still not guaranteed) and F11
  resolved by R9.

Orchestrator implementation constraints C1–C4 (verified 2026-10-01) are in
[research D10](research.md#d10--owner-rulings-2026-10-01-r8r10-and-orchestrator-constraints-c1c4).
C1: the Canonical section and strip tokens and the provider artifact do not
change; R8 is a BF-local derived layer. C2: R8 reaches section-boundary
consumers only, pending owner confirmation (Q4).

## Owner rulings, 2026-10-03 (R11–R15)

Recorded from the relocated Pragma Spec 024 decision: FR-043e requires the
opt-in container to set every body-phase term, and spacing specification
§2.8.3 defines the closing rhythm. They supersede R1, R6 and R7 and FR-007
where they differ.

- **R11 – opt-in, not default.** Body-line rhythm is opt-in through a
  container class; the default is the baseline-unit ledger, rendering main's
  geometry exactly. `.is-baseline-rhythm` is retired before release (Spec 026
  is unreleased). The opt-in class redeclares the per-role body-line terms;
  BF's terms are build-time literals, so redeclaring them on a descendant
  works by inheritance. Component roots keep resetting to the bU ledger.
- **R12 – the closure cancels the nudge.** Phase is measured from body text,
  so body text's phase is zero. Inside the opt-in container,
  `closure = roundUp(phase + line-height, step) − phase − line-height − nudge`;
  for body text that is `−nudge`, and no text block adds a blank line. The
  nudge stays `padding-top`; no relative positioning. This replaces FR-007's
  round-up-only rule for body-line terms.
- **R13 – no gap cancelling.** Because text no longer closes with a blank
  line, the R6 gap cancel and its F1, F2, F4, F6 and F7 machinery are
  removed. Inside the opt-in container, gaps between text blocks are whole
  body lines, and an element gap after a heading is a minimum folded into
  the heading's closure. R8's body-line section and strip snapping stands.
- **R14 – heading line heights snap inside the container.** A role whose
  line height is not a whole number of body lines takes the nearest whole
  body line, never less than its font size, inside the opt-in container
  only. Compute the table per BF tier, OS included, from
  `config/tiers/*.json`. Type-scale tokens do not change. FR-017's
  wrapped-heading exceptions are then closed.
- **R15 – re-derive the rest.** Re-check R3 (list block), R4 (hgroup join)
  and R9 (panel content) against R11–R13. The hgroup pull existed to remove
  a closure blank line and is expected to go. Panel content takes body-line
  rhythm only when the author opts it in. Record each outcome for owner
  confirmation; do not implement a re-derivation unconfirmed.

## Open owner questions

- **Q1 (F4).** *Closed by R8*: section and strip boundaries snap to whole
  body lines.
- **Q2 (F11).** *Closed by R9*: the five panel content roots host body-line
  flow text; panel chrome stays on bU.
- **Q3 (F1–F7).** *Closed by R10*: F1–F11 confirmed.
- **Q4 (C2, task T-R0).** Confirm that R8 reaches only section-boundary
  consumers (section stacks, `.bf-page.is-fill` block-end padding, strip
  block-end padding) and leaves the default stack gap, the prose gap and
  every component that reads `--bf-section-space-shallow` on the provider
  value; alternative in research D10. Ask the owner before implementing
  T-R8.

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
- Panel content hosts flow text (R9): bare flow text in `bf-panel-content`,
  `bf-tabs-panel`, `bf-accordion-panel`, `bf-modal-body` and `bf-aside`
  takes the default rhythm, phased from the panel's content box; panel
  chrome stays on bU.
- Section and strip boundaries are whole body lines (R8): section stacks
  and the strip and page-fill block-end padding take the snapped values of
  the R8 table in every tier, through private derived properties; the
  Canonical tokens behind them do not change (C1).
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
  cap-engine demo stay on the bU ledger (R7). Bare flow text in the five
  panel content roots is the one exception (R9).
- No type-scale token changes to chase wrapped exceptions.
- Neither term is a spacing token. No public spacing property, no DTCG
  spacing entry and no `--bf-space-*` change. No negative-margin utility.
  The R8 snapped values are private derived properties: the Canonical
  tokens, the provider artifact, `--bf-section-space-*`, `--bf-strip-space`
  and every token JSON and surface manifest keep their values (C1).
- Container gaps change only as ruled in R6 with F1 and F4, and R8: prose
  and pattern-internal stack gaps are cancelled between adjacent text
  blocks; section-stack gaps and strip block-end padding snap to whole body
  lines. `bf-grid` row, `bf-cluster` and `bf-stage-shell` gaps are
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
  root redeclares the bU ledger (R7); the five panel content roots restore
  the body-line ledger for their bare flow text (R9), and chrome inside
  them is a component root of its own. The root list is every `bf-*` class the
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
- Section stacks keep their gap (F4), snapped to whole body lines (R8), so
  body-line phase after a section boundary holds when the preceding block
  closed to whole body lines; after a component it is still not
  guaranteed.
- App `is-section-shallow` and `is-section` both resolve to 20px under R8
  and are identical in that tier (owner-accepted). OS shallow is an exact
  tie (24px / 16px = 1.5) and rounds up to 32px. Editorial deep shrinks
  (128 → 120px) while Documentation deep grows (96 → 100px).
- Body-line phase inside a panel content root is relative to its content
  box, not the page grid: the panel's block-start inset is a bU value that
  is not a whole body line in any built-in tier (research D10, C3 table).
  Recorded exception.
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
- **FR-011** (amended by R8, C1): generated CSS outside the section is
  byte-identical to main's generated CSS; the R8 properties and consumer
  rules live inside the section. Every `tokens.json` and `surfaces.json`,
  `config/canonical-spacing.resolved.json` and every Canonical-named and
  `--bf-section-space-*`/`--bf-strip-space` declaration is byte-identical
  to main. Compiled TypeScript outputs in `dist/` are expected to change.
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
  element root. *Amended by R9*: the five panel content roots stay in the
  list for their own geometry and restore the body-line ledger for their
  descendants (FR-027).
- **FR-024** (R7, amended by R9 and C4): component geometry is
  byte-for-byte unaffected: `npm run test:components` passes with
  `scripts/verify-component-baselines.ts` unchanged since CP-B, except
  checks that measure bare flow text inside the five panel content roots;
  each such change is listed in `review.md` with before, after and reason.
- **FR-025** (F8): README carries an “Unreleased” migration note for the
  visible spacing change (`is-baseline-rhythm` on `.bf-theme` roots keeps the
  old spacing), and the first release containing Spec 026 must be `0.3.0` or
  later per `docs/publishing.md`. `package.json` is not changed here.
- **FR-026** (R8, C1, C2): per surface, the build computes
  `snapped = step × max(1, floor(value / step + 0.5))` for the resolved
  group, pattern, region and strip block tokens and emits them as private
  rem literals (`--bf-body-line-section-space-shallow`, `-section`,
  `-deep`, `--bf-body-line-strip-space`) on the root and tier blocks.
  `.bf-stack.is-section-shallow`, `.is-section`, `.is-section-deep`,
  `.bf-page.is-fill` block-end padding and `.bf-strip` block-end padding
  read them by default; `.is-baseline-rhythm` and component roots restore
  the provider values. The default stack gap, the prose gap and components
  that read `--bf-section-space-shallow` stay on the provider value unless
  the owner rules otherwise at T-R0 (Q4).
- **FR-027** (R9, C3): each body-line term has a source property declared
  on the theme root and tier blocks (body-line literals) and on
  `.bf-theme.is-baseline-rhythm` (bU ledger), and an active property that
  application rules read. Component roots set active terms to the bU ledger
  and never touch sources; `bf-panel-content`, `bf-tabs-panel`,
  `bf-accordion-panel`, `bf-modal-body` and `bf-aside` set active terms back
  to `var(<source>)`. Chrome inside them is its own component root and
  stays on bU.
- **FR-028** (C1): `config/canonical-spacing.resolved.json`,
  `canonicalSpacingProductsSha256`, tier config values and the resolved
  `spacing.gap.group.block`, `spacing.gap.pattern.block`,
  `spacing.gap.region.block` and `spacing.inset.strip.block` tokens do not
  change; a static check asserts it.

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
15. **Component geometry unchanged** (R7, amended by R9 and C4) –
    `npm run test:components` (5,442 checks) passes with no change to
    `scripts/verify-component-baselines.ts` except checks that measure bare
    flow text inside the five panel content roots; those and changed
    page-text behaviour assertions are listed in `review.md` with before,
    after and reason.
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
17. **Section and strip, static** (R8, C1) – per tier, the four emitted
    snapped literals equal the R8 table (editorial 1.5 / 4.5 / 7.5 / 4.5rem,
    documentation 1.25 / 2.5 / 6.25 / 2.5rem, app 1.25 / 1.25 / 2.5 /
    2.5rem, os 2 / 3 / 6 / 2rem) and the formula from the resolved token and
    body step; the provider artifact, its SHA-256 constant, tier configs,
    every `tokens.json` and `surfaces.json` and every Canonical-named and
    `--bf-section-space-*`/`--bf-strip-space` declaration are byte-identical
    to main; only the C2 consumers read the snapped properties.
18. **Section and strip, rendered** (R8) – Chromium DPR 1, 16px root, all
    four tiers: the gap of each section stack and the block-end padding of
    `.bf-strip` and `.bf-page.is-fill` equal the R8 table within 0.1px; text
    after a section boundary that follows a text block stays in phase; under
    `.is-baseline-rhythm` each equals main exactly.
19. **Panel content** (R9) – in each of the five panel content roots, all
    four tiers: bare `h2`, `p`, `p` and a prose list take the default
    rhythm, with first baselines whole steps from the content-box top and
    p → p two steps apart; panel chrome (titles, tab labels, accordion
    triggers, controls, modal header and footer, aside navigation) equals
    main; the same panels under `.is-baseline-rhythm` equal main.

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
