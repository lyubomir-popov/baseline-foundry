# Spec 026: Body-line text phase

**Feature branch**: `feat/026-body-line-text-phase`

**Created**: 2026-09-30

**Status**: Draft – planning package only; no source changes yet

**Input**: Port the owner-approved Pragma rule that keeps headings and
paragraphs in one body-line phase (Pragma Spec 024, T004d2; owner decision
2026-09-28) to BF, delivered as an opt-in first.

**Owner direction for BF**, 2026-09-30: “I'd like to see the in-phase
headings vs paragraphs work we just did on pragma implemented on bf too.” This
approves the Phase A opt-in for BF only. The Phase B default flip needs a
separate owner ruling after browser review.

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
in-phase closure is accepted: the stronger common body-line phase governs. BF
has not adopted the rule. Unlike Pragma, BF already derives nudges from real
font metrics at build time, so it can compute both terms exactly rather than
through the `(line-height + 1cap) / 2` estimate.

## Outcomes

- A public flat modifier on the theme root, `.bf-theme.is-body-line-rhythm`,
  applies a block-start phase inset and a block-end body-line closure to
  prose-flow text: paragraphs and headings that are direct children of
  `.bf-prose`, prose list items and the paragraphs inside them. It behaves
  identically in all four tiers, in direct tier bundles, in the preset
  bundles and in class-scoped tier surfaces.
- Phase and closure are computed in TypeScript at build time from the same
  real font metrics as the existing nudge and emitted as private rem literals.
- Existing role nudge and compensation properties, token JSON, surface
  manifests and all CSS outside the modifier are unchanged.
- A comparison demo shows the current bU ledger beside the body-line ledger
  per tier, light and dark, including the four candidate container-gap
  behaviours the owner must rule on and the recorded exceptions.
- Static evidence proves the literals and cascade. Differential rendered
  evidence proves that the opt-in moves each first baseline by exactly its
  phase, keeps element tops on whole body lines and fails as predicted for
  named wrapped exceptions.

## Boundaries

- This package implements Phase A only. Phase B – flipping the default,
  retiring the bU text ledger and rewriting the invariant – is listed in
  [tasks.md](tasks.md) as a separate owner-gated section and is not
  implemented here.
- Text outside `.bf-prose` flows (`bf-stack`, `bf-section` and component
  text), controls, the meta role, `blockquote`, `hr`, `pre`/`code`,
  `a.bf-text-link` and the cap-engine demo stay on the bU ledger.
- No type-scale token changes to chase wrapped exceptions.
- Neither term is a spacing token. No public spacing property, no DTCG
  spacing entry and no `--bf-space-*` change.
- Container gaps are not changed until the owner rules on
  [D4](research.md#d4--container-gaps--open-owner-decision).
- No Pragma source, publication or release.

## User scenarios and testing

### User story 1 – Opt-in body-line text phase (priority: P1)

A consumer adds `is-body-line-rhythm` to a `.bf-theme` root. Every paragraph
and heading that is a direct child of a `.bf-prose` block, and every prose
list item, starts its first baseline on the body-line grid and closes its
occupied block to whole body lines, so later prose text keeps the same phase.

**Why this priority**: it is the feature; everything else is evidence or
review support.

**Independent test**: build, then assert the generated literals and cascade
statically (AC-1 to AC-4).

**Acceptance scenarios**:

1. **Given** any built-in tier with the modifier, **when** a `p` and an `h3`
   are stacked in a zero-gap `.bf-prose` flow, **then** both element tops are
   whole body lines from the flow start and each first baseline sits exactly
   one phase lower than without the modifier.
2. **Given** a page without the modifier, **when** it is built and rendered,
   **then** CSS, tokens and geometry are identical to `main`.
3. **Given** `<p class="bf-h3">` and `<h3>` as prose children under the
   modifier, **then** both occupy the same box.

### User story 2 – Rendered phase proof (priority: P2)

A maintainer runs the behaviour suite and sees, for body and all 24
tier/heading combinations, that the opt-in moves each first baseline by
exactly its phase and keeps element tops on whole body lines; wrapped lines
advance by one line height; the named exceptions fail as predicted.

**Independent test**: `npm run test:behavior` against the demo fixture.

**Acceptance scenarios**:

1. **Given** Chromium DPR 1 at roots 16px and 32px, **when** one-line h1–h6
   and body share a zero-gap prose flow, **then** `probe − elementTop` with
   and without the modifier differs by the phase, and each element top is a
   whole number of steps from the previous element top, both within 0.1px.
2. **Given** editorial h3, documentation h3, app h1 and os h1 wrapped to two
   lines, **then** `line 2 − line 1` is off the nearest whole step by the
   predicted amount within 0.1px.

### User story 3 – Owner comparison (priority: P3)

The owner opens one demo route, switches tier and tone, and compares the
current and body-line ledgers for a stacked heading, two paragraphs and a
list, including the double-space effect of closure plus container gap and
the recorded exceptions.

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
- A nested `.bf-theme` without the modifier inside an opted root must fall
  back to the bU ledger despite inherited custom properties.
- `.bf-stack.is-metric-flush` keeps cancelling the inner compensation and
  nudge; phase is cancelled with the nudge. Baseline-to-baseline distance
  inside the pair is unchanged, but the first element keeps its phase and
  the last its closure, so content after the pair is off phase by
  `(n₁ + ph₁ + lh₁ − n₂ − ph₂) mod step`. For h2 then p that is 2.54px in
  Editorial, 3.38px in Documentation, 2.27px in App and 0.41px in OS.
  Recorded exception.
- Custom `ul` markers in `.bf-prose` are absolutely positioned and must move
  with the phase inset.
- Loose list items (`<li><p>`, as Markdown renders them) would take the terms
  twice. Under the modifier such an item zeroes its own block-start padding
  and closure; its paragraphs carry the body terms.
- Nested lists: the outer item's closure lands after the nested list, so
  child items are off phase by `(nudge + phase + lh) mod step` – 6.56px in
  Editorial, 5.24px in Documentation and App, 3.92px in OS. Recorded
  exception, shown in the demo.
- `hr` (0.5rem occupied) and `blockquote` (body line height plus bU) break
  phase for following prose content. Recorded exceptions.
- Component text is outside the prose-flow scope. `.bf-prose` appears inside
  components only in the quote wrapper, whose only child is an excluded
  `blockquote`; a static markup scan guards this (AC-3).
- Consumer overrides of role font size or line height invalidate the
  precomputed literals, as they already invalidate the nudge.
- A custom surface without computable rhythm data emits no opt-in section;
  the modifier is then a no-op rather than a broken margin. Built-in surfaces
  fail the build instead.

## Requirements

### Functional requirements

- **FR-001**: `.is-body-line-rhythm` on a `.bf-theme` root enables body-line
  rhythm for its prose flows. No `data-*` selector. Phase A adds no other
  public class. D4 option (c) acts on the `.bf-prose` gap and options (b) and
  (d) on prose and stack gaps, all under this modifier, so none needs a new
  class. If the D4 ruling extends (c) to stacks, the ruling names the stack
  modifier (candidate `.bf-stack.is-text-flow`) and amends this requirement.
- **FR-002**: Every built-in direct tier bundle (`dist/tiers/<tier>`), the
  preset bundles `dist/presets/prose` and `dist/presets/app-tier`, and every
  class-scoped tier surface (`.bf-theme.bf-tier-<tier>.is-body-line-rhythm`)
  emit the section for their own surfaces; each tier resolves the same values
  wherever it appears.
- **FR-003**: In-scope elements are `p`/`.bf-body` and `h1`–`h6`/`.bf-h1`–
  `.bf-h6` that are direct children of `.bf-prose`; `.bf-prose li` (body
  terms); and `p`/`.bf-body` that are direct children of a prose `li`. Plain
  and role-classed equivalents occupy the same box. Text in `bf-stack`,
  `bf-section` and component flows is out of Phase A scope (research D1).
- **FR-004**: Inside the modifier, out-of-scope text (non-prose flows,
  meta/`figcaption`, `blockquote`, `hr`, `pre`/`code`, `a.bf-text-link`,
  component-owned text, controls) keeps its current declarations. Every
  application selector excludes the cap-engine demo with
  `:not(:where(.bf-engine-cap, .bf-engine-cap *))`, which adds no
  specificity.
- **FR-005**: Per in-scope role and surface, emit `--bf-<role>-rhythm-step`,
  `--bf-<role>-phase-start` and `--bf-<role>-closure-end` as rem literals,
  declared only under the modifier.
- **FR-006**: Phase and closure follow
  [the contract](contracts/body-line-phase.md): phase is added after the
  existing nudge in `padding-block-start`; closure replaces the role bottom
  margin; `padding-block-end` stays `0rem`.
- **FR-007**: Both terms round up only; `0 ≤ phase < step` and
  `0 ≤ closure < step`.
- **FR-008**: The rhythm step is the surface body line height for every
  in-scope role and must be a whole bU multiple. A built-in surface fails the
  build otherwise; a custom surface gets no rhythm data.
- **FR-009**: `--bf-<role>-nudge-start`, `-nudge-end`,
  `-baseline-compensation` and `-margin-bottom` keep their current meaning and
  values everywhere, including inside the modifier.
- **FR-010**: Terms are computed from the same font files and hhea metrics the
  nudge generator uses, read per role `fontFamily`. The build recomputes each
  generator nudge and fails a built-in surface if it differs from `nudgeTop`
  by more than 0.00001rem.
- **FR-011**: Generated CSS outside the modifier section is byte-identical to
  generation without the feature. Every `tokens.json` and `surfaces.json` is
  byte-identical to `main`. Compiled TypeScript outputs in `dist/` are
  expected to change.
- **FR-012**: A nested `.bf-theme` without the modifier inside an opted root
  resolves the bU ledger.
- **FR-013**: `.bf-stack.is-metric-flush` rules keep precedence over the
  opt-in rules.
- **FR-014**: `.bf-prose ul > li` markers stay centred on the first text line
  under the modifier.
- **FR-015**: Container gaps are unchanged by the Phase A implementation.
  Gap behaviour is implemented only after the D4 ruling.
- **FR-016**: The comparison demo lives at `demo/spec/body-line-rhythm.html`,
  is listed with the spec chapter pages, dogfoods BF classes and uses only
  minimal local specimen CSS.
- **FR-017**: Wrapped-heading exceptions are recorded, not fixed through type
  tokens.
- **FR-018**: The modifier is documented as a provisional opt-in in the README
  and architecture. `AGENTS.md` gains only a scoped opt-in exception note
  citing the 2026-09-30 owner approval; its invariant wording is unchanged in
  Phase A.
- **FR-019**: Under the modifier, a prose `li` with a direct `p` or `.bf-body`
  child sets its `padding-block-start` and `margin-bottom` to `0rem`; its
  paragraphs carry the body terms.

### Key entities

- **Rhythm record**: per surface and in-scope role – `rhythmStep`,
  `firstBaseline` (F*), `phaseStart`, `closureEnd`. Build-internal; not
  serialized to tokens or manifests in Phase A.

## Acceptance

1. **Static formula** – for each tier and in-scope role (4 × 7 records),
   `(F* + phase) mod step` and `(nudge + phase + line-height + closure) mod
   step` are 0 within ±0.00001rem; `phase` and `closure` are in `[0, step)`;
   `step mod bU = 0`; emitted literals equal the
   [contract table](contracts/body-line-phase.md#expected-values).
2. **Static identity** – for every generated bundle (direct tiers,
   `dist/presets/prose`, `dist/presets/app-tier` and experiments), CSS with
   the opt-in section removed, opening to closing comment inclusive, equals
   CSS generated without rhythm data. At CP-A, `dist/` CSS minus the section,
   every `tokens.json` and every `surfaces.json` are byte-equal to the T002
   capture.
3. **Static cascade and scope** – one contiguous section, opened and closed
   by the contract comments, follows the prose list and blockquote rules;
   each in-scope role has semantic and class selectors; every application
   selector carries the cap-engine exclusion; no `data-*` selector;
   metric-flush selectors have higher specificity; the existing
   `marginBottom = bU − nudgeTop` contract still passes; a markup scan of
   `demo/components`, `demo/patterns` and README examples finds no
   application-selector match inside a component root.
4. **Direct/class parity** – each tier's opt-in literals are equal in its
   direct bundle and in every class-scoped surface; the preset bundles pass
   AC-1 for their own surfaces.
5. **Rendered phase translation** – Chromium DPR 1, roots 16px and 32px, all
   four tiers, zero-height inline-block probes, one-line h1–h6 and body in a
   zero-gap prose flow, with and without the modifier: `probe − elementTop`
   differs by exactly the phase, and each element top minus the previous
   element top is a whole number of steps, both within 0.1px. Absolute
   residual ε is recorded in `review.md` as generator metric-authority data
   and is not asserted.
6. **Rendered wrapped** – with forced two- and three-line headings, each
   line-to-line distance equals the line height within 0.1px, and for
   qualifying combinations the following sibling's top is whole steps from
   the heading top within 0.1px. For editorial h3, documentation h3, app h1
   and os h1 at two lines, `line 2 − line 1` is off the nearest whole step by
   the research R3 prediction within 0.1px and by at least one bU.
7. **Rendered edges** – within 0.1px, differentially: nested non-opted roots
   match the plain reference; baseline-to-baseline distance inside a
   metric-flush pair is unchanged; the prose dot keeps its offset from the
   first probe; a loose item's `probe − itemTop` equals a tight item's.
   Downstream offsets after metric-flush pairs, nested lists, `hr` and
   `blockquote` are measured and recorded against the contract's exception
   table, not asserted.
8. **Regression** – the existing bU page-wide phase contract and every other
   browser family pass unmodified outside the modifier.
9. **Browser review** – the comparison demo is reviewed in all four tiers,
   light and dark, with findings in `review.md`.
10. **Gates** – `npm test` and `npm run qa:components` are green.

## Assumptions

- Chromium DPR 1 is the authoritative rendered engine for this package.
- Built-in tiers define only body and h1–h6; the meta exclusion applies to
  custom themes that define it.
- The drift compensation in the nudge generator stays as published. In
  current Chromium it over-corrects above 1rem (editorial h1 residual −0.91px
  with it, −0.29px without); residuals are recorded, not patched here.
- Pragma measurements are context for the rule only and are not evidence for
  BF values (D5).
