# Feature Specification: Spacing System Audit

**Feature Branch**: `feat/017-spacing-system-audit`

**Created**: 2026-08-29

**Status**: Active

**Input**: Owner direction to remove historical spacing/keyline debug pages,
replace obsolete ownership language, and begin an exhaustive horizontal and
vertical spacing audit across every component and bundled pattern.

## User Scenarios & Testing

### User Story 1 - A catalog made of usable contracts (Priority: P1)

As a design-system consumer, I need the demo navigation to contain components,
patterns, and useful explanatory chapters rather than internal diagnostic
boards.

**Acceptance Scenarios**:

1. **Given** the shared demo catalog, **When** its routes are enumerated,
   **Then** it contains no `examples/spacing/*` routes or “Spacing examples”
   section.
2. **Given** the living spacing chapter, **When** a consumer reads it, **Then**
   it explains the current ownership model and links to real component/pattern
   surfaces rather than historical experiments.
3. **Given** automated spacing checks, **When** debug pages are deleted,
   **Then** focused component fixtures or in-test DOM probes retain the useful
   regression coverage without becoming public navigation.

### User Story 2 - One explicit spacing vocabulary (Priority: P1)

As a component author, I need every gap and inset to describe a relationship,
not inherit historical role spacing or rely on one-off pixel values.

**Acceptance Scenarios**:

1. **Given** adjacent text roles, **When** their boxes are inspected, **Then**
   text contributes only metric start nudge and complementary end compensation;
   a container or pattern owns the semantic distance.
2. **Given** a title pair intended as one phrase, related content within one
   area, or complete pattern areas, **When** composed, **Then** they use flush,
   dense, or section-level owners respectively.
3. **Given** current source, docs, and demos, **When** terminology is scanned,
   **Then** active guidance does not present element-owned and container-owned
   semantic spacing as alternative modes.

### User Story 3 - Exhaustive adjacency evidence (Priority: P1)

As the design-system owner, I need a finite inventory of every tight vertical
and horizontal relationship so later corrections can be systematic and their
coverage can be proven.

**Acceptance Scenarios**:

1. **Given** all catalogued foundation, component, pressure, pattern, and site
   composition routes, **When** the audit is complete, **Then** every route has
   an inventory row naming its tight adjacencies, keylines, spacing owner, and
   verification route.
2. **Given** primitive text, rules, controls, lists, table cells, disclosures,
   panels, and pattern areas, **When** reviewed, **Then** the cross-element
   matrix covers both block-axis gaps and inline-axis insets/alignment.
3. **Given** all four built-in tiers and the standard responsive brackets,
   **When** a relationship is measured, **Then** its resolved value comes from
   the same public token/variable family in direct and class-switched CSS.

## Requirements

- **FR-001**: Delete the complete historical `examples/spacing/` batch.
- **FR-002**: Remove deleted routes from the catalog, living spec, root page,
  README, static validation, browser behavior, and screenshot inventories.
- **FR-003**: Keep `demo/spec/spacing.html` as the sole consumer-facing spacing
  explanation and rewrite it around the current ownership model.
- **FR-004**: Preserve useful preference, page-chrome, stack-density, panel
  inset, and accordion alignment checks by routing them through real demos or
  hidden DOM probes.
- **FR-005**: Maintain the exhaustive inventory in
  `contracts/adjacency-inventory.md`; no free-floating debug atlas is the source
  of truth.
- **FR-006**: Record for each relationship its semantic owner, public variable
  or primitive, tier behavior, responsive behavior, and focused QA route.
- **FR-007**: Audit direct bundles and shared class switching for spacing-token
  parity in all four tiers.
- **FR-008**: Do not add negative gaps, role-owned semantic margins, styled
  `data-*` selectors, consumer overrides, or new utility aliases that duplicate
  an existing stack contract.
- **FR-009**: Generated files under `dist/` are rebuilt from source and never
  edited directly.

## Success Criteria

- **SC-001**: No tracked file or catalog entry references
  `examples/spacing/` outside archived historical specs.
- **SC-002**: The public catalog has no debug-only spacing or horizontal
  keyline page.
- **SC-003**: The adjacency inventory covers every active catalog route and
  every primitive relationship class with no unassigned item.
- **SC-004**: Focused static and browser checks pass after the diagnostic pages
  are removed.
- **SC-005**: `npm test` and `npm run qa:components` pass, and affected routes
  are reviewed at wide and constrained widths in all four tiers.
- **SC-006**: Adversarial review reports no unresolved high- or medium-severity
  ownership, API, accessibility, or responsive-spacing finding.

## Boundaries

- This package audits spacing and corrects confirmed spacing drift; it does not
  absorb the separate responsive branded application-navigation behavior.
- Historical archived spec titles remain chronological evidence and are not
  renamed to hide past decisions.
- Component demos remain isolated QA routes even when a page is not linked from
  both atlases; the audit decides catalog value separately from test value.
