# Feature Specification: Tier Geometry Hardening

**Feature Branch**: `feat/015-tier-geometry-hardening`
**Created**: 2026-08-28
**Status**: Active
**Input**: Producer follow-up from `AGENT-INBOX.md` plus owner review of hidden component padding and divider placement.

## User Scenarios & Testing

### User Story 1 - Predictable tier widths (Priority: P1)

As a consumer switching among BF tiers, I need capped content widths to progress
monotonically with the intended density instead of becoming wider again, while
application layouts remain fluid.

**Independent Test**: Compare each direct tier bundle with shared class
switching at wide and constrained viewports. Editorial, Documentation, capped
App content, and OS must follow the documented progression; `.bf-page` in App
must remain uncapped and the downstream Registry selector must resolve to the
same value as the direct App bundle.

**Acceptance Scenarios**:

1. **Given** the four built-in tier configs, **When** their content caps are
   compared, **Then** they form a documented monotonic progression with
   Documentation near `80rem`, capped App content near `60rem`, and OS no wider
   than capped App content.
2. **Given** the App tier, **When** `.bf-page` and `.bf-fixed-width` are
   inspected, **Then** the page/grid remains full-width and fluid while only
   the explicit fixed-width primitive uses the App cap.
3. **Given** direct tier CSS and shared `bf-tier-*` switching, **When** the same
   selector is measured, **Then** both paths expose equivalent tokens and
   geometry.

### User Story 2 - No hidden semantic padding in document navigation (Priority: P1)

As a documentation author, I need table-of-contents rows to use metric text
nudges and container-owned rhythm, without extra block padding disguised as a
text adjustment.

**Independent Test**: In all four tiers, inspect computed block padding and row
geometry for default, nested, current, focused, wrapped, narrow, and RTL TOC
links. Padding may contain only the body metric nudge/compensation and the list
container must own any deliberate inter-row spacing.

**Acceptance Scenarios**:

1. **Given** a `.bf-table-of-contents-link`, **When** its computed padding is
   inspected, **Then** no `space-half` or other semantic spacing is added to
   the font-metric nudge/compensation.
2. **Given** nested or wrapped TOC links, **When** rendered narrowly and in RTL,
   **Then** indentation, focus visibility, wrapping, and current-state emphasis
   remain intact without overflow.

### User Story 3 - Dividers belong to the following item (Priority: P1)

As a reader scanning a divided list, I need each divider to sit tightly above
the heading or paragraph it introduces, rather than floating halfway between
two items.

**Independent Test**: Render the divided-section list in all tiers and measure
the fixed `24px` item gap, zero item padding/margin, one-pixel divider, and the
divider-to-following-content distance. The rule must occupy the final `0.5rem`
of the parent-owned gap, including border-thickness compensation.

**Acceptance Scenarios**:

1. **Given** adjacent divided-section items, **When** their geometry is
   measured, **Then** the list still owns a `24px` gap and items own no semantic
   block padding or margin.
2. **Given** the second and subsequent items, **When** their pseudo-divider is
   measured, **Then** its one-pixel rule is positioned immediately above the
   following content with a `calc(0.5rem - var(--bf-border-width))` visual gap,
   leaving the remaining parent-owned space before the rule.

## Requirements

### Functional Requirements

- **FR-001**: Tier content caps MUST be derived and documented, not merely
  renamed arbitrary historical values.
- **FR-002**: Built-in tier content caps MUST progress monotonically from
  Editorial through Documentation, App, and OS.
- **FR-003**: Documentation MUST target approximately `80rem`; App fixed-width
  content MUST target approximately `60rem`; OS MUST NOT exceed App.
- **FR-004**: App `.bf-page` and its application grid MUST remain uncapped and
  fluid.
- **FR-005**: Direct tier bundles and shared class switching MUST remain
  support-equivalent, including container-query transitions and start-aligned
  fixed rows.
- **FR-006**: Documentation MUST state that semantic tier and density are not
  independent BF axes today.
- **FR-007**: TOC links MUST contain only metric-derived block padding; semantic
  row rhythm MUST be container-owned.
- **FR-008**: Divided-section lists MUST retain a `24px` parent-owned item gap,
  with zero item block padding/margin and dividers biased toward the content
  they introduce.
- **FR-009**: Static and browser contracts MUST reject the superseded width,
  TOC padding, and centred-divider implementations.
- **FR-010**: Generated outputs MUST be rebuilt from config/source and MUST NOT
  be hand-edited.

## Scope Boundaries

- Do not add a Registry-local width override.
- Do not cap the App page or application grid at the App fixed-width value.
- Do not create a second density axis in this package.
- Do not promote a generic split-pane primitive. The Diagram Registry and its
  standalone Mermaid playground are current evidence from one product family;
  the existing application-aside handle remains scoped, and another independent
  consumer must prove the generic seam first.
- Do not remove legitimate surface insets, control padding, focus affordances,
  font-metric nudges, or border-thickness compensation.

## Success Criteria

- **SC-001**: All four tier caps match the documented monotonic derivation and
  direct/class-scoped values are exactly equivalent.
- **SC-002**: App page/grid width remains fluid at every tested wide viewport,
  while `.bf-fixed-width` resolves to the App cap.
- **SC-003**: Every tested TOC link has no semantic block padding beyond its
  metric nudge/compensation across all tiers.
- **SC-004**: Every divided-section list reports a `24px` gap, zero item block
  padding/margin, a one-pixel divider, and the specified tight rule-to-content
  distance across all tiers.
- **SC-005**: `npm test` and `npm run qa:components` pass, affected demos are
  visually reviewed, and an adversarial review finds no unaddressed high- or
  medium-severity contract defect.

## Assumptions

- The tier sequence expresses progressively denser semantic contexts, but tier
  and density remain one coupled BF choice for now.
- Existing typography measures and grid gutters are evidence for selecting
  rounded caps; exact values are finalized in `research.md` before config edits.
- The unpublished `0.1.5` candidate may be superseded by this package; no npm
  release occurs before owner visual approval.
