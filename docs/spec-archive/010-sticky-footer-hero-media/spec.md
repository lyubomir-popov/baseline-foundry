# Feature Specification: Resilient Sticky Footer and Hero Media

**Feature Branch**: `feat/010-sticky-footer-hero-media`

**Created**: 2026-08-27

**Status**: Released

**Input**: User description: "Fix the sticky footer in Baseline Foundry so it never overlaps content, including when a site page shell is nested directly inside an application main region, and support a hero whose full-width media closes the pattern after a shallow textual lead-in."

## User Scenarios & Testing

### User Story 1 - Read every page without footer obstruction (Priority: P1)

A site visitor can read short or long content in an application-hosted site page and always encounters the footer after the content. Short pages keep the footer at the visible block-end; long pages scroll naturally and never place the footer over text or controls.

**Why this priority**: An overlapping or clipped footer makes content unreadable and breaks the page's primary document flow.

**Independent Test**: Render short and long site page shells directly inside an application main region at narrow and wide viewports. The short footer meets the available viewport block-end, while the long footer begins at or after the main content's block-end and is reachable by scrolling.

**Acceptance Scenarios**:

1. **Given** a short site page shell nested directly inside an application main region, **When** the page is loaded, **Then** its sticky footer meets the available viewport block-end without covering the main content.
2. **Given** a long site page shell nested directly inside an application main region, **When** the visitor scrolls through the main region, **Then** the footer follows the full content box and no content is clipped or covered.
3. **Given** a site main region that also uses a reusable panel-content class, **When** its content exceeds the available height, **Then** the site main region retains its full content height within the page flow rather than shrinking beneath the footer.
4. **Given** any of the four built-in tiers at narrow or wide viewports, **When** the same site-shell markup is rendered, **Then** footer placement and overflow behavior remain equivalent.

---

### User Story 2 - Finish a hero with full-width media (Priority: P2)

A page author can keep a hero's explanatory lead-in and associated full-width image in one coherent hero pattern. The image follows a shallow lead-in boundary, then the hero's normal larger exit boundary separates the completed pattern from the next page section.

**Why this priority**: Keeping media inside its semantic pattern makes the page hierarchy and spacing intent clear to authors and readers.

**Independent Test**: Render a hero with a shallow lead-in followed by a full-width media slot and a subsequent section. Verify the lead-in-to-media gap equals the active tier's shallow section boundary and the media-to-next-section gap equals the hero's normal exit boundary.

**Acceptance Scenarios**:

1. **Given** a hero with a textual lead-in and full-width media, **When** it is rendered, **Then** both remain inside the hero boundary and the media is the final content in that pattern.
2. **Given** the lead-in opts into the shallow section boundary, **When** it precedes the media, **Then** the internal gap uses the public shallow section token rather than a page-specific value.
3. **Given** a completed full-width media slot, **When** another page section follows, **Then** the hero's normal exit boundary separates the media from that section.
4. **Given** a narrow container, wide container, or right-to-left document, **When** the composition renders, **Then** the media remains fluid, full-width, and free of inline overflow.

### Edge Cases

- A site main region may carry `bf-panel-content`; its general flex behavior must not shrink long document content beneath the footer.
- An application may reserve space for navigation above its main region; the nested site shell must fill the main region rather than add an extra viewport height.
- A footer may wrap to multiple lines at narrow widths; it must remain after content and fully reachable.
- Hero media may have a fractional intrinsic aspect ratio or a caption; the full-width slot must remain fluid without erasing semantic figure or caption rhythm.
- A hero without the new full-width closing-media composition must retain its existing paired-column and fallback behavior.

## Requirements

### Functional Requirements

- **FR-001**: An opted-in site page shell MUST keep a short-content sticky footer at the available shell block-end.
- **FR-002**: An opted-in site page shell MUST keep a long-content footer after the full main-content box without overlap or clipping.
- **FR-003**: The sticky-footer contract MUST work when the page shell is nested directly inside an application main region.
- **FR-004**: A direct site main child MUST remain a non-shrinking document-flow item even when it also carries a reusable content-region role.
- **FR-005**: A page shell nested in an application main region MUST fill that region's available block size without assuming an additional full viewport.
- **FR-006**: Sticky-footer behavior MUST remain equivalent across Editorial, Documentation, App, and OS tiers and at supported narrow and wide viewports.
- **FR-007**: The hero pattern MUST accept a shallow textual lead-in followed by full-width media as its final content.
- **FR-008**: The lead-in-to-media boundary MUST be owned by the existing public shallow section contract.
- **FR-009**: The media-to-next-section boundary MUST remain owned by the hero's normal exit boundary.
- **FR-010**: Full-width hero media MUST preserve fluid media sizing, captions, logical direction, and existing semantic child spacing.
- **FR-011**: Existing paired, proportioned, split-medium, and fallback hero compositions MUST remain unchanged.
- **FR-012**: Both behaviors MUST have reviewable demos, static generated-contract assertions, and real-browser geometry coverage across all four built-in tiers.
- **FR-013**: Consumers MUST need no local overrides of Baseline Foundry classes to obtain either behavior.

## Success Criteria

### Measurable Outcomes

- **SC-001**: In every built-in tier at 360px and 1280px viewport widths, a short nested site shell's footer finishes within 1px of the available application-main block-end.
- **SC-002**: In every built-in tier at the tested viewports, a long nested site shell's footer begins no earlier than 1px before the main content's block-end, with all content reachable through the owning scroll region.
- **SC-003**: In every built-in tier, the measured lead-in-to-media gap differs from the public shallow section boundary by no more than 0.1px.
- **SC-004**: At the wide hero boundary, the measured gap after the closing media differs from the hero's regular exit boundary by no more than 0.1px; the corresponding existing compact exit remains unchanged below that boundary.
- **SC-005**: Sticky-footer and closing-media hero fixtures have no more than 1px inline overflow at narrow and wide widths, including right-to-left rendering.
- **SC-006**: The full generated-contract, component baseline, browser behavior, and component screenshot gates complete without regressions.

## Assumptions

- Sticky means a flex-flow footer pinned by remaining space, not a fixed- or sticky-position overlay.
- The application main region remains the scroll owner for an `is-fill` application.
- The existing `bf-section is-shallow` contract owns the requested lead-in-to-media spacing; the hero adds only a structural lead slot and closing full-width media relationship.
- Hero media is semantic content and therefore remains in normal document flow.
- No JavaScript is required for either layout behavior.
