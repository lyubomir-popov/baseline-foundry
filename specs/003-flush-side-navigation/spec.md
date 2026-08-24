# Feature specification: flush side-navigation composition

**Feature branch**: `feat/003-flush-side-navigation`

**Created**: 2026-08-24

**Status**: Accepted for BF release; downstream refresh pending

**Input**: Restore the edge-to-edge active-row contract of the Vanilla-derived
side navigation when it is composed inside a BF panel, and release the
application viewport/gutter work already proven by Diagram Registry.

## User scenarios and testing

### User story 1 — active navigation reaches the drawer edge (Priority: P1)

As an application user, I can identify the current destination through an
active row whose background and highlight bar reach the navigation drawer
edges while its label retains the standard inset.

**Independent test**: Render application side navigation inside a fill panel,
select a nested item, and compare the panel-content, active-link, and label
geometry.

**Acceptance scenarios**:

1. The navigation panel can opt its content slot into zero outer padding.
2. The active link reaches both inline edges of the content slot.
3. Link, heading, nested-level, icon, and status content retain the indentation
   already owned by the side-navigation component.
4. Ordinary panel content remains padded by default.

### User story 2 — applications fill the viewport with application gutters (Priority: P2)

As an application author, I can opt the BF application shell into the dynamic
viewport and use application gutters independently of the chosen typography
tier.

**Independent test**: Apply `.is-fill` under Editorial typography and measure
the application block size, bottom edge, and inline grid gutter.

## Requirements

- **FR-001**: `.bf-panel-content` MUST remain padded by default.
- **FR-002**: A public `.bf-panel-content.is-flush` modifier MUST remove both
  block and inline padding without changing its flex, overflow, or boundary
  ownership.
- **FR-003**: The application-layout demo MUST compose its side navigation
  through that modifier; downstream consumers MUST NOT need local CSS.
- **FR-004**: Browser coverage MUST prove edge alignment and retained internal
  side-navigation indentation.
- **FR-005**: `.bf-application.is-fill` MUST occupy one dynamic viewport block.
- **FR-006**: Application shells MUST retain the 1.5rem application gutter
  when typography switches away from the App tier.
- **FR-007**: Generated outputs MUST be rebuilt from source.

## Success criteria

- **SC-001**: Active-row and panel-content inline edges differ by no more than
  one rendered pixel.
- **SC-002**: The active label remains inset by the component padding and a
  nested active row retains two additional baseline units of indentation.
- **SC-003**: Default panel fixtures retain their existing padding.
- **SC-004**: `npm test` and `npm run qa:components` pass.
- **SC-005**: Diagram Registry consumes the released BF output with markup and
  vendored-asset changes only, with no local selector patch.

## Boundaries

- This is a composition fix, not a redesign of side-navigation spacing or
  color tokens.
- The modifier is explicit; BF will not infer flush behavior from descendants.
- Vanilla is ancestor evidence, not a requirement to copy its Sass structure.
