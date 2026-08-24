# Feature specification: application navigation geometry

**Feature branch**: `feat/004-application-navigation-geometry`

**Created**: 2026-08-24

**Status**: In progress

**Input**: Correct the public application-navigation geometry exposed by the
Diagram Registry consumer: the desktop drawer stops at content height, and
collapsed labels remain in flex layout and inflate rows.

## User scenarios and testing

### User story 1 – navigation reaches the viewport bottom (Priority: P1)

As an application user, I see one continuous navigation surface from the top
of the application row to its bottom, regardless of content length.

**Independent test**: Render the application-layout demo at desktop width and
compare the navigation, drawer, panel, and application bottom edges.

### User story 2 – collapsed navigation keeps compact rows (Priority: P1)

As an application user, I can collapse navigation to its icon rail without
labels or headings wrapping into tall invisible boxes.

**Independent test**: Measure every top-level navigation row before and after
collapse. Collapsed rows retain the compact control height, and label text
remains available as the link's accessible name.

## Requirements

- **FR-001**: At desktop widths, `.bf-navigation-drawer` MUST fill the block
  size of its `.bf-navigation` grid area.
- **FR-002**: Collapsed headings, status content, and explicitly fading regions
  MUST NOT participate in layout.
- **FR-003**: Collapsed `.bf-side-navigation-label` content MUST remain
  available to accessibility APIs without contributing inline or block size.
- **FR-004**: Expanded side navigation MUST retain its current label, heading,
  status, spacing, and active-row behavior.
- **FR-005**: The correction MUST be implemented in Baseline Foundry source and
  generated for every public tier. Consumers MUST NOT need local CSS.
- **FR-006**: Browser behavior coverage MUST measure bottom-edge alignment,
  compact collapsed row height, and label accessibility.

## Success criteria

- **SC-001**: Drawer, panel, navigation, and application bottom edges differ by
  no more than one rendered pixel at 1280 × 960.
- **SC-002**: No collapsed top-level navigation row exceeds the resolved
  compact-control block size by more than one rendered pixel.
- **SC-003**: Collapsed links keep non-empty accessible names.
- **SC-004**: Generated validation and the complete Baseline Foundry gates pass.

## Boundaries

- This corrects shared geometry; it does not redesign consumer navigation IA.
- No consumer override or data-attribute selector is introduced.
- The desktop drawer remains a grid child rather than returning to fixed
  positioning.
