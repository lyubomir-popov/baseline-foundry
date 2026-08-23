# Feature specification: element-owned typography selectors

**Feature branch**: `feat/002-element-owned-typography`

**Created**: 2026-08-22

**Status**: Implemented; fresh adversarial review requested

**Input**: Remove redundant `.bf-prose`-prefixed typography selectors so plain
elements own semantic type and explicit BF visual-role classes reliably
override the element tag.

## User scenarios and testing

### User story 1 — choose a visual heading role independently (Priority: P1)

As a BF consumer, I can use the semantic heading level required by the document
outline while choosing a different BF visual heading role without a prose
container changing the result.

**Why this priority**: Consumers need valid heading structure and independent
visual hierarchy. The current selector conflict makes these goals incompatible.

**Independent test**: Inside `.bf-prose`, render `<h3 class="bf-h6">` and
`<h6 class="bf-h3">` in every built-in tier and compare their computed
typography with the corresponding H6 and H3 tokens.

**Acceptance scenarios**:

1. **Given** an H3 with `.bf-h6` inside `.bf-prose`, **when** BF CSS is applied,
   **then** its computed font size, line height, and weight match H6.
2. **Given** an H6 with `.bf-h3` inside `.bf-prose`, **when** BF CSS is applied,
   **then** its computed font size, line height, and weight match H3.
3. **Given** an unclassed heading or paragraph under `.bf-theme`, **when** BF
   CSS is applied, **then** its semantic element typography remains present.

### User story 2 — keep prose as composition only (Priority: P2)

As a BF maintainer, I can reason about `.bf-prose` as a prose-flow composition
without it duplicating the typography already owned by element selectors.

**Why this priority**: One typography owner prevents specificity regressions
and keeps the public CSS contract small.

**Independent test**: Inspect every generated tier and preset bundle and prove
that prose-prefixed paragraph, heading, and figcaption typography selectors are
absent while prose list, blockquote, rule, and boundary composition remains.

**Acceptance scenarios**:

1. **Given** any generated built-in tier or preset CSS, **when** its selectors
   are inspected, **then** `.bf-prose p`, `.bf-prose h1`–`.bf-prose h6`, and
   `.bf-prose figcaption` typography rules are absent.
2. **Given** the same output, **when** prose composition selectors are
   inspected, **then** the established list, blockquote, rule, and explicit
   trailing-boundary contracts remain present.
3. **Given** a paragraph, heading, list, or blockquote as the last child of
   `.bf-prose`, **when** BF CSS is applied, **then** only its semantic bottom
   margin is trimmed while metric padding and baseline-grid alignment remain.
4. **Given** a plain role element and an equivalent visual-role-classed
   element at that boundary, **when** their occupied boxes are measured,
   **then** they are identical in every built-in tier.

### Edge cases

- Direct tier bundles and class-switched surfaces must behave identically.
- The demo-only cap engine must derive from the same selector ownership model.
- Removing duplicate selectors must not remove explicit `.bf-body` or
  `.bf-h1`–`.bf-h6` role classes.
- Paragraph semantic defaults must continue to generate even though the
  triggering consumer case involves headings. The dormant figcaption mapping
  must retain the same element-only ownership model if a meta role is added.
- Tier coverage must wait for the computed role value and assert concrete role
  values; changing only `data-bf-tier` is not evidence that CSS switched.

## Requirements

### Functional requirements

- **FR-001**: `src/css.ts` MUST emit active semantic typography for `p` and
  `h1`–`h6` through plain zero-specificity element selectors under `.bf-theme`;
  dormant role mappings such as `figcaption` MUST use the same ownership model
  if their role becomes configured.
- **FR-002**: Generated typography rules MUST NOT include `.bf-prose`-prefixed
  duplicates for those elements.
- **FR-003**: Explicit `.bf-body` and `.bf-h1`–`.bf-h6` visual-role classes MUST
  remain available and override a different semantic element role.
- **FR-004**: `.bf-prose` MUST retain its prose-flow composition contracts,
  including an explicit last-child boundary that resets `margin-bottom` only,
  matches one-class role specificity, and preserves metric padding.
- **FR-005**: Static generated-CSS validation MUST cover every generated
  built-in tier and preset.
- **FR-006**: Browser validation MUST prove reciprocal H3/H6 role overrides in
  Editorial, Documentation, App, and OS.
- **FR-007**: Generated outputs MUST be rebuilt from source; no `dist/` file may
  be hand-edited.

## Success criteria

- **SC-001**: Reciprocal H3/H6 computed-style assertions pass against concrete
  expected values in all four tiers, with four distinct measured signatures.
- **SC-002**: All generated CSS bundles contain zero prohibited prose-prefixed
  paragraph, heading, or figcaption typography selectors.
- **SC-003**: `npm test` and `npm run qa:components` pass with no regression.
- **SC-004**: The Typography Roles demo is visually reviewed after rebuild with
  no unexpected layout, overflow, or console defect.
- **SC-005**: Paragraph, heading, unordered-list, ordered-list, and blockquote
  boundary probes retain occupied boxes, trim to `0px` margin, and leave both
  the prose bottom edge and following first baseline on the active tier grid.

## Assumptions and boundaries

- This is a selector-ownership repair, not a type-scale or token-value change.
- Existing prose-flow composition and semantic spacing remain in scope only for
  regression protection; they are not redesigned.
- Diagram Registry is consumer evidence. It does not receive a local override
  as part of this BF-owned repair.
