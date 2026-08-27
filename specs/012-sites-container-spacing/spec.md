# Feature Specification: Sites Container-Owned Spacing

**Feature Branch**: `feat/012-sites-container-spacing`

**Created**: 2026-08-27

**Status**: In progress

**Input**: User description: "Drop element-owned semantic space-after, retain text nudge and baseline compensation, and use nested `bf-stack` containers for 1.5rem pattern internals and 4rem pattern/section separation. Prove the Sites result in Diagram Registry."

## User Scenarios & Testing

### User Story 1 - Compose a Sites pattern with one internal rhythm (Priority: P1)

A Sites author can group the structural parts of a pattern in a stack and receive a predictable 1.5rem gap between those parts. A tiered-list header and its list, or a hero's split lead and its media, no longer depend on the trailing semantic spacing of whichever child happens to come first.

**Why this priority**: Pattern spacing must survive child substitution and content changes without element-specific margin patches.

**Independent Test**: Render consumer-shaped tiered-list, basic-section, and hero compositions in the Editorial tier. Each direct internal transition owned by the pattern stack measures 24px, independent of the child element type.

**Acceptance Scenarios**:

1. **Given** a tiered list containing a header and list body, **When** both are direct children of its pattern stack, **Then** their separation equals the Editorial shallow section token (1.5rem).
2. **Given** a basic split or hero lead followed by media, **When** the parts are direct children of an internal pattern stack, **Then** their separation equals 1.5rem without child-specific margins.
3. **Given** a heading, paragraph, list, or figure is exchanged for another valid child, **When** the pattern renders, **Then** the stack gap remains unchanged and no semantic space-after is added.

---

### User Story 2 - Separate complete patterns and sections (Priority: P2)

A Sites author can place complete patterns or sections in an outer stack whose gap is the regular Editorial section distance of 4rem. Nested internal stacks retain their 1.5rem rhythm and do not add to the outer boundary.

**Why this priority**: A visible page hierarchy needs a larger, independently owned boundary between complete patterns than within a pattern.

**Independent Test**: Render two complete Registry patterns inside the section stack and measure exactly 64px between their occupied boxes while each pattern's internal transition remains 24px.

**Acceptance Scenarios**:

1. **Given** two adjacent complete patterns, **When** their parent owns the section stack, **Then** the pattern-to-pattern gap equals the Editorial regular section token (4rem).
2. **Given** an internal stack nested inside a section stack, **When** content is added or removed inside the pattern, **Then** the 4rem outer boundary remains unchanged.
3. **Given** the final child in either stack, **When** it changes type, **Then** no last-child semantic-margin reset is required to obtain the intended boundary.

---

### User Story 3 - Preserve baseline alignment without semantic element spacing (Priority: P3)

Readers see text baselines and occupied boxes remain on the active grid even though semantic spacing moves to containers. Text elements keep their measured top nudge and a non-semantic bottom-margin compensation; their old space-after value no longer affects layout.

**Why this priority**: Container ownership is only acceptable if the design system's baseline-alignment contract remains true.

**Independent Test**: Inspect plain and visual-role-classed text inside nested stacks in all built-in tiers. Each pair occupies the same baseline-aligned box, padding-block-end is zero in the production engine, and changing a legacy space-after token does not change computed spacing.

**Acceptance Scenarios**:

1. **Given** a metric-derived text role, **When** container-owned spacing is active, **Then** the element retains its measured padding-block-start and carries the complementary baseline compensation in margin-block-end.
2. **Given** the same semantic role with or without a visual-role class, **When** both render in a stack, **Then** their occupied boxes and baseline phase match.
3. **Given** a legacy role space-after value, **When** generated CSS is applied, **Then** that value does not contribute to the computed semantic gap.
4. **Given** direct tier bundles and class-scoped tier switching, **When** equivalent fixtures render, **Then** their compensation and stack gaps match.

### Edge Cases

- A stack may contain a semantic list whose items also need baseline compensation; the list must not create a second external semantic gap.
- A prose, card, or panel boundary must preserve the final child's compensation instead of resetting the whole bottom margin to zero.
- A structural component may intentionally be flush; `bf-stack is-flush` must remain gapless.
- Pattern grids and horizontal clusters keep their existing column and row contracts; this feature changes semantic vertical ownership, not grid gutters.
- The exceptional large CTA separation (8rem in the Sites reference) is out of scope for this package.

## Requirements

### Functional Requirements

- **FR-001**: Baseline Foundry MUST define semantic vertical spacing as container-owned; typographic elements MUST NOT derive semantic layout spacing from role space-after values.
- **FR-002**: Metric-aligned text MUST retain measured padding-block-start and MUST express its complementary baseline compensation through margin-block-end.
- **FR-003**: Production text roles using container-owned spacing MUST have no padding-block-end compensation.
- **FR-004**: The default Sites/Editorial `bf-stack` gap MUST equal `--bf-section-space-shallow`, resolving to 1.5rem in the built-in Editorial tier.
- **FR-005**: A section-spacing stack modifier MUST set the gap to `--bf-section-space`, resolving to 4rem in the built-in Editorial tier.
- **FR-006**: `bf-stack is-flush` MUST continue to resolve to a zero gap.
- **FR-007**: Nested stacks MUST own only the separation between their direct children and MUST NOT erase baseline compensation from those children.
- **FR-008**: Semantic lists and flow-boundary compositions MUST preserve baseline compensation without restoring semantic element-owned space-after.
- **FR-009**: Tiered-list, basic-section, and hero demos MUST use the nested-stack contract for the representative 1.5rem internal and 4rem external relationships.
- **FR-010**: Direct and class-scoped tier surfaces MUST expose equivalent stack and compensation behavior.
- **FR-011**: The constitution, architecture, root invariants, operator guidance, and spec catalog MUST record the owner decision and supersede the prior element-owned policy without rewriting archived evidence.
- **FR-012**: Diagram Registry MUST consume the generated feature CSS without local `bf-*` overrides and demonstrate the requested nested Sites composition at wide and constrained widths.
- **FR-013**: Existing baseline, overflow, responsive, focus, and directional contracts outside spacing ownership MUST remain green.

## Success Criteria

### Measurable Outcomes

- **SC-001**: In the built-in Editorial tier, measured internal stack gaps are 24px ±0.1px and measured section-stack gaps are 64px ±0.1px at 360px and 1280px viewports.
- **SC-002**: In every built-in tier, representative plain/classed role pairs retain the same occupied dimensions and first-baseline phase within 0.75px of the active baseline grid.
- **SC-003**: Representative production text has non-zero measured padding-top, zero padding-bottom, and a non-negative compensation margin that completes one baseline unit with the top nudge.
- **SC-004**: Altering a legacy space-after custom property on a probe changes neither its occupied contribution nor the gap to its sibling by more than 0.1px.
- **SC-005**: Diagram Registry's representative tiered-list/basic-section/hero route has no more than 1px inline overflow and no console errors at the tested widths.
- **SC-006**: `npm test`, `npm run qa:components`, and Diagram Registry's relevant validation and browser checks complete without regressions.

## Assumptions

- “Sites tier” maps to Baseline Foundry's built-in `editorial` tier; this package does not rename the public tier.
- The reference values map to existing public layout tokens: 1.5rem is `--bf-section-space-shallow` and 4rem is `--bf-section-space` in Editorial.
- The owner decision supersedes the element-owned conclusions in Specs 001, 002, 008, and 009; those packages remain immutable historical evidence.
- Legacy `spaceAfter` data may remain serialized for compatibility during this package, but generated production layout must not use it as a semantic spacing input.
- The regular and shallow stack relationships are sufficient for this package; the exceptional 8rem CTA composition is explicitly deferred.
