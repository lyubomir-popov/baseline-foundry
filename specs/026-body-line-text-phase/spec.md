# Spec 026: Body-line text phase

**Feature branch**: `feat/026-body-line-text-phase`

**Created**: 2026-09-30

**Status**: Phase A opt-in implemented and reviewed; CP-B default flip
implemented 2026-09-30 under the owner rulings below. D4 container gaps stay
open.

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
  candidates.

## Problem

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

- Prose-flow text – paragraphs and headings that are direct children of
  `.bf-prose` or of a prose `hgroup` – takes a block-start phase inset and a
  block-end body-line closure by default, in all four tiers, in direct tier
  bundles, in the preset bundles and in class-scoped tier surfaces.
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
  tier, light and dark, including hgroup specimens, three-level lists and the
  four D4 container-gap candidates.

## Boundaries

- Text outside `.bf-prose` flows (`bf-stack`, `bf-section` and component
  text), controls, the meta role, `blockquote`, `hr`, `pre`/`code`,
  `a.bf-text-link`, prose lists that are not direct children of `.bf-prose`
  and the cap-engine demo stay on the bU ledger.
- No type-scale token changes to chase wrapped exceptions.
- Neither term is a spacing token. No public spacing property, no DTCG
  spacing entry and no `--bf-space-*` change. No negative-margin utility.
- Container gaps are not changed until the owner rules on
  [D4](research.md#d4--container-gaps--open-owner-decision).
- No `1cap` anywhere (R2). No Pragma source, publication or release.
- T031 (serializing the terms into tokens and manifests) and T032 (scope
  beyond prose) remain open; the flip keeps the terms CSS-private.

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
- Component text is outside the prose-flow scope. `.bf-prose` appears inside
  components only in the quote wrapper, whose only child is an excluded
  `blockquote`; a static markup scan guards this (AC-3).
- Consumer overrides of role font size or line height invalidate the
  precomputed literals, as they already invalidate the nudge.
- A custom surface without computable rhythm data emits no section; its text
  keeps the bU ledger and `.is-baseline-rhythm` is a no-op. Built-in surfaces
  fail the build instead.

## Requirements

### Functional requirements

- **FR-001** (amended by R1): body-line rhythm is the default for in-scope
  text. `.is-baseline-rhythm` on a `.bf-theme` root restores the bU ledger for
  its subtree. `.is-body-line-rhythm` is removed. No `data-*` selector and no
  other public class. D4 options act on prose and stack gaps; if the D4 ruling
  extends (c) to stacks, the ruling names the stack modifier.
- **FR-002**: every built-in direct tier bundle (`dist/tiers/<tier>`), the
  preset bundles `dist/presets/prose` and `dist/presets/app-tier`, and every
  class-scoped tier surface (`:where(.bf-theme.bf-tier-<tier>)`) emit the
  terms for their own surfaces; each tier resolves the same values wherever it
  appears.
- **FR-003** (amended by R3, R4): in-scope elements are `p`/`.bf-body` and
  `h1`–`h6`/`.bf-h1`–`.bf-h6` that are direct children of `.bf-prose` or of a
  `hgroup` that is a direct child of `.bf-prose`; `ul`/`ol` that are direct
  children of `.bf-prose`; every `li` inside such a list; and `p`/`.bf-body`
  that are direct children of such an `li`. Plain and role-classed
  equivalents occupy the same box. Text in `bf-stack`, `bf-section` and
  component flows is out of scope (research D1).
- **FR-004**: out-of-scope text (non-prose flows, meta/`figcaption`,
  `blockquote`, `hr`, `pre`/`code`, `a.bf-text-link`, component-owned text,
  controls) keeps its current declarations. Every application selector
  excludes the cap-engine demo with
  `:not(:where(.bf-engine-cap, .bf-engine-cap *))`.
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
- **FR-015**: container gaps are unchanged. Gap behaviour is implemented only
  after the D4 ruling (R5).
- **FR-016**: the comparison demo lives at `demo/spec/body-line-rhythm.html`,
  is listed with the spec chapter pages, dogfoods BF classes and uses only
  minimal local specimen CSS.
- **FR-017**: wrapped-heading exceptions are recorded, not fixed through type
  tokens.
- **FR-018** (amended by R1): README and architecture document the default
  and the `.is-baseline-rhythm` opt-out. The `AGENTS.md`,
  `docs/architecture.md` and `docs/agent-index.md` invariant wording states
  that prose text defaults to body-line phase with container-owned list
  blocks and that `.is-baseline-rhythm` restores the bU ledger.
- **FR-019** (replaced by R3): a prose list (`.bf-prose > ul`,
  `.bf-prose > ol`) carries `padding-block-start: nudge + phase` and
  `margin-bottom: roundUp(nudge + phase, step) − (nudge + phase)` of the body
  role; its items and nested lists carry no block padding or margin; a loose
  item's direct paragraphs carry no nudge, phase or closure; a loose item
  that follows a loose item starts one body step later. The Phase A per-`li`
  ledger and `--bf-body-loose-item-*` properties are removed.
- **FR-020** (R4): in `.bf-prose > hgroup`, children keep their own role
  terms, and every child after the first takes
  `margin-block-start: var(--bf-hgroup-join)`, which resolves to
  `calc(-1 * var(--bf-body-rhythm-step))` by default. Pairs whose static
  clearance proof fails in a surface take `0rem` in that surface through
  `--bf-hgroup-join-<previous>-<following>`.
- **FR-021** (R1): under `.is-baseline-rhythm` every in-scope box, line
  baseline and list dot renders exactly main's geometry, including hgroup
  children (no join) and lists (main's per-item ledger).

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
3. **Static cascade and scope** – one contiguous section, opened and closed
   by the contract comments, follows the prose list and blockquote rules; the
   opt-out block follows every surface block; each in-scope role has
   semantic and class selectors for prose and hgroup parents; every
   application selector carries the cap-engine exclusion; no `data-*`
   selector; metric-flush selectors have higher specificity; the retired
   modifier and loose-item properties are absent; the existing
   `marginBottom = bU − nudgeTop` contract still passes; a markup scan of
   `demo/components`, `demo/patterns` and README examples finds no
   application-selector match inside a component root.
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
