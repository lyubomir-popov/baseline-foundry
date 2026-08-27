# Feature Specification: Hero divider and quiet linked titles

**Feature Branch**: `feat/012-hero-link-contracts`

**Created**: 2026-08-27

**Status**: Draft

**Input**: User description: "Keep linked section headings visibly blue without a default underline, underline them on hover, and make the hero own a default horizontal divider with an opt-out. Consumers must use BF rather than local overrides."

## User Scenarios & Testing

### User Story 1 - Recognise linked section titles (Priority: P1)

A reader can distinguish a linked section title from ordinary heading text before interacting with it, without adding constant underline noise.

**Why this priority**: Removing both the underline and link colour erased the action affordance and created an accessibility regression.

**Independent Test**: Render a linked basic-section title in every tier and verify that its resting and visited states use the link colour without an underline, while hover adds an underline and keyboard focus remains visible.

**Acceptance Scenarios**:

1. **Given** a linked section title, **When** it is at rest or visited, **Then** it is blue and has no underline.
2. **Given** a linked section title, **When** it is hovered, **Then** it remains blue and gains an underline.
3. **Given** keyboard navigation, **When** the title receives focus, **Then** the existing BF focus treatment remains visible.

---

### User Story 2 - Start a hero with a pattern-owned divider (Priority: P2)

A page author gets a consistent horizontal divider at the start of every hero without inserting a loose rule before the pattern.

**Why this priority**: Page-level rule placement is inconsistent when the boundary is not owned by the pattern that needs it.

**Independent Test**: Render default and opt-out heroes in every tier at narrow and wide widths, including a closing-media hero, and verify divider presence, alignment, spacing and overflow.

**Acceptance Scenarios**:

1. **Given** a default hero, **When** it renders, **Then** a full-width BF divider begins the pattern before its top spacing.
2. **Given** a hero that deliberately needs no divider, **When** the public opt-out modifier is applied, **Then** the divider is absent and all other hero geometry is unchanged.
3. **Given** closing hero media, **When** the divider is present, **Then** the shallow lead-to-media and normal post-media boundaries remain unchanged.

### Edge Cases

- Long, wrapping linked headings retain the link colour across every line.
- Dark-tone pages preserve the tier's accessible link token rather than a hard-coded blue.
- The default divider does not create inline overflow in LTR or RTL.
- The opt-out changes only divider rendering, not hero padding or media placement.

## Requirements

### Functional Requirements

- **FR-001**: Linked basic-section titles MUST use the active tier's default link colour in resting and visited states.
- **FR-002**: Linked basic-section titles MUST have no underline at rest and MUST gain an underline on hover.
- **FR-003**: Linked basic-section titles MUST retain BF's keyboard focus treatment.
- **FR-004**: A default hero MUST render a pattern-owned horizontal divider across its available inline size.
- **FR-005**: The divider MUST use existing BF rule/border tokens and logical properties.
- **FR-006**: A public `is-borderless` modifier MUST remove only the hero divider.
- **FR-007**: Existing hero layout, shallow-lead, closing-media and exit-spacing contracts MUST remain unchanged.
- **FR-008**: The contracts MUST be available and equivalent in Editorial, Documentation, App and OS tiers.
- **FR-009**: The demo and generated-contract tests MUST cover both default and opt-out states without consumer CSS.

## Success Criteria

### Measurable Outcomes

- **SC-001**: All four tiers report the same semantic link colour token for resting and visited linked titles, no default underline, and an underline on hover.
- **SC-002**: Default heroes expose exactly one full-width divider and borderless heroes expose none at narrow and wide review widths.
- **SC-003**: Existing hero lead-to-media and exit measurements remain within 0.1px of their current token values.
- **SC-004**: Affected demos have no more than 1px inline overflow in LTR or RTL.

## Assumptions

- The active `--bf-color-link-default` token is the correct accessible blue for both resting and visited quiet title links.
- `is-borderless` follows an established BF modifier name and is clearer than a hero-specific negative API.
- Vanilla is ancestry evidence for hero spacing and layout; the default divider is an owner-directed BF extension.
