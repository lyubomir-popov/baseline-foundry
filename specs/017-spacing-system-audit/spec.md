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

---

### User Story 4 - Legible primitive and pattern composition (Priority: P2)

As a component author, I need to tell whether a class names a reusable visual
primitive, a pattern-owned structural slot, or a state modifier, so I can
compose supported pieces without copying redundant or competing styling.

**Acceptance Scenarios**:

1. **Given** a rule inside a bundled pattern, **When** its markup is reviewed,
   **Then** the investigation identifies separately the rule's generic visual
   contract and its pattern-specific placement contract.
2. **Given** a native semantic element already styled by a basic selector,
   **When** it also carries a generic primitive class, **Then** the audit
   records whether that class is required API, intentional portability, or
   redundant authoring.
3. **Given** a proposed naming or migration rule, **When** it is applied to a
   public pattern, **Then** it uses the established flat `bf-*` and `is-*`
   vocabulary and does not introduce inheritance aliases or BEM syntax.

### User Story 5 - Readable split layouts change together (Priority: P1)

As a reader, I need comparable content splits to collapse at the same measured
width, so a pattern does not remain cramped merely because it uses a different
component implementation.

**Acceptance Scenarios**:

1. **Given** a pattern whose default content is a balanced readable split,
   **When** its query container reaches 45rem (720px), **Then** it may use its
   multi-column arrangement; below that width it remains one column.
2. **Given** the hero and tiered-list header, **When** their own containers are
   measured, **Then** their default 50/50 title/content arrangements use the
   same 45rem threshold.
3. **Given** a layout that changes for a non-split reason (navigation shell,
   grid density, or an explicitly asymmetrical/intrinsic variant), **When** it
   uses another breakpoint, **Then** the audit records that separate reason.

---

### User Story 6 - Keyline relationships are easy to inspect (Priority: P1)

As a system owner, I need concise, real-component comparisons separated by
axis so I can inspect horizontal and vertical padding without mixing their
unrelated variables or inventing a local styling system.

**Acceptance Scenarios**:

1. **Given** either axis-specific spacing audit, **When** an owner turns on the
   existing baseline grid, **Then** it presents compact comparisons made only
   from shipped BF primitives in a full-width page.
2. **Given** a leading mark (a list bullet, checkbox, radio, or disclosure
   icon), **When** its label or panel content is inspected, **Then** the
   comparison identifies whether it belongs to the page/content keyline, a
   leading-mark track, a control/panel gutter, or a disclosure continuation
   keyline; it does not assume all labels share one universal start line.

---

### User Story 7 - A small, evidence-led keyline vocabulary (Priority: P1)

As a system owner, I need keyline families to be few, named, and backed by
shared variables, so comparable components do not acquire individually tuned
indents or occupied heights.

**Acceptance Scenarios**:

1. **Given** controls, data labels, marker rows, navigation rows, surfaces,
   and page/grid frames, **When** their inline starts and occupied blocks are
   audited, **Then** each belongs to a documented family or has a measured
   reason to differ.
2. **Given** the consumer-facing spacing audits, **When** an owner audits one
   axis, **Then** every group names that axis and one measured variable family;
   it does not group components merely because they share a semantic role.
3. **Given** a component that looks misaligned because of border or font
   compensation, **When** a correction is proposed, **Then** it is measured
   against its role family before a new utility, class, or component is added.

## Requirements

- **FR-001**: Delete the complete historical `examples/spacing/` batch.
- **FR-002**: Remove deleted routes from the catalog, living spec, root page,
  README, static validation, browser behavior, and screenshot inventories.
- **FR-003**: Keep `demo/spec/spacing.html` as the short consumer-facing
  spacing overview and provide full-width horizontal and vertical audit routes
  beside it, all written around the current ownership model.
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
- **FR-010**: Maintain the composition naming investigation in
  `contracts/composition-naming-audit.md`, including every observed
  primitive-plus-slot rule pairing, its present responsibility, and a decision
  on whether the pairing is required, portable, or redundant.
- **FR-011**: Evaluate native-element styling, generic primitives, structural
  slots, modifier order, and rule-like non-`hr` elements as distinct public API
  categories before proposing a migration.
- **FR-012**: Do not introduce Sass-style extension, compatibility aliases, or
  a wholesale class rename as part of the investigation. Any follow-on
  migration must be separately planned from measured source and consumer
  evidence.
- **FR-013**: Treat 45rem (720px) of the query container as the shared
  threshold for a default readable 50/50 pattern split. Inventory every
  component and pattern with a comparable split, correct unjustified divergent
  thresholds, and record a distinct intrinsic reason for each exception.
- **FR-014**: Keep component-first horizontal and vertical spacing audits as
  separate full-width consumer-facing routes. Each must place raw shipped
  components under one axis-specific variable family, including navigation,
  disclosure, controls, data labels, panels, and tables—not page-local rulers,
  diagnostic rails, custom specimen CSS, or a 50/50 documentation layout.
- **FR-015**: Treat keylines as named relationships rather than a universal
  left edge: page/content text, leading-mark tracks, component gutters, and
  disclosure continuations may differ only when their owning component and
  variable family make the distinction explicit.
- **FR-016**: Maintain `contracts/keyline-bucket-analysis.md` as the
  evidence-led family map. It must distinguish inline-start tracks from
  occupied-block rhythm, state the smallest defensible family set, and list
  every component/pattern that creates an author-visible indent.
- **FR-017**: Use the resolved grid side inset for the root side-navigation
  inset: `--bf-panel-content-padding-inline` where a panel establishes it,
  otherwise `--bf-grid-gap-inline`. Nested navigation may add only its
  documented depth step; generic panel padding must not independently tune the
  root navigation keyline.
- **FR-018**: Preserve native number-input semantics and keyboard increment /
  decrement behaviour. The visible paired-chevron affordance must occupy one
  measured 16px canvas at the same trailing position as select, without a
  second browser-reserved spin slot or unexplained spare trailing space.

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
- **SC-007**: Every current rule-like pattern slot is classified as structural,
  visual, or mixed; every native `hr` plus `bf-rule` pairing is accounted for;
  and the resulting convention can be applied by an author without consulting
  source selectors.
- **SC-008**: Every default balanced content split in the active catalog uses
  the same 45rem query-container threshold, or has a documented non-split
  reason for a different transition.
- **SC-009**: The horizontal and vertical audits cover the keyline-bearing
  component set in every tier without page-local layout or styling classes;
  each component is classified independently for each axis.
- **SC-010**: The bucket analysis accounts for every public component or
  pattern that creates a visible author-controlled inline offset, including
  navigation depth, list markers, fields, table cells, surface insets, and
  page/grid gutters.
- **SC-011**: Root side-navigation labels and their navigation-brand peer use
  the same resolved grid side inset in every built-in tier; nested labels add
  only the documented depth increment.

## Boundaries

- This package audits spacing and corrects confirmed spacing drift; it does not
  absorb the separate responsive branded application-navigation behavior.
- Historical archived spec titles remain chronological evidence and are not
  renamed to hide past decisions.
- Component demos remain isolated QA routes even when a page is not linked from
  both atlases; the audit decides catalog value separately from test value.
- The naming investigation records a proposed convention and migration trigger;
  it does not rename stable public classes until a follow-on implementation
  package is promoted.
