# Feature Specification: Component and Pattern Consistency

**Feature Branch**: `feat/016-component-pattern-consistency`

**Created**: 2026-08-29

**Status**: Active

**Input**: Owner review of application navigation, search controls, document navigation, hero, linked-logo, quote-wrapper, tab-section, catalog hierarchy, and missing container-owned rhythm across bundled patterns.

## User Scenarios & Testing

### User Story 1 - Predictable dense component geometry (Priority: P1)

As an application user, I need navigation and search affordances to occupy the
same visual box as their labels and fields in every tier, including compact
tiers and narrow rails.

**Why this priority**: Misaligned navigation labels and controls that overflow
their field borders are visible interaction defects and can obscure adjacent
popup content.

**Independent Test**: Switch the application-layout, narrow-panel, and
search-and-filter demos through all four tiers. Iconless rows retain the icon
column; reset/search actions and their separator remain inside the input border;
and the popup begins after the complete field box without overlap.

**Acceptance Scenarios**:

1. **Given** an icon-enabled side navigation, **When** a row omits its icon,
   **Then** its label begins at the same inline edge as labels in sibling rows
   that contain an icon.
2. **Given** a search box or expanded search-and-filter box in any tier,
   **When** its input and trailing actions are measured, **Then** each action
   and separator is contained by the input border box and has no block overflow.
3. **Given** a filter-panel section heading, **When** its typography is
   compared with the canonical H5 role, **Then** it inherits the same role CSS
   instead of maintaining a second near-copy.

---

### User Story 2 - Legible document navigation hierarchy (Priority: P1)

As a reader, I need tables of contents and the demo catalog to communicate
hierarchy without sparse rows, ambiguous rules, muted headings, or missing tier
entry points.

**Why this priority**: Navigation density and hierarchy determine whether the
catalog can be scanned and whether the four supported tiers appear equally
intentional.

**Independent Test**: Render the table-of-contents and application-layout demos
in all tiers, including the narrow and RTL fixtures. TOC row gaps match side
navigation's flush list rhythm; section headings use canonical H5 prominence
and default text color; rules introduce only those higher-level sections; and
the catalog exposes editorial, documentation, app, and OS tier references.

**Acceptance Scenarios**:

1. **Given** adjacent TOC links, **When** their list and item grids are
   inspected, **Then** neither introduces a semantic inter-row gap.
2. **Given** a TOC section heading, **When** compared with a side-navigation
   section heading and the H5 role, **Then** it uses H5 typography and default
   text color, with any divider attached to that section level.
3. **Given** the narrow TOC fixture, **When** its outer composition is measured,
   **Then** it does not add the default 24px stack gap between its specimen
   heading and TOC.
4. **Given** the demo catalog, **When** tier references and categories are
   scanned, **Then** all four tiers are represented and bundled use-case
   patterns are not mixed into the individual-component category.

---

### User Story 3 - Consistent pattern-owned rhythm (Priority: P1)

As a page author, I need bundled patterns to compose their heading, copy,
actions, media, and nested component areas with the same small set of BF stack
contracts so removing element margins never makes content collide.

**Why this priority**: The current near-zero gaps recur across many patterns;
fixing only the reported examples would preserve the cause and allow drift.

**Independent Test**: Audit every catalogued pattern for direct semantic
siblings. Heading fragments use a flush stack, content within one pattern area
uses a dense stack, and complete header/body/footer or copy/media areas use a
shallow section boundary. The linked-logo, quote-wrapper, tab-section,
accordion, rich-list, basic-section, CTA-section, content-card,
data-spotlight, divided-section, media-object, notification, empty-state, and
equal-height fixtures demonstrate the contract without local specimen CSS.

**Acceptance Scenarios**:

1. **Given** a title and supporting title intended to read as one heading,
   **When** rendered together, **Then** an existing flush stack removes the
   semantic gap while retaining both roles' metric compensation.
2. **Given** heading/copy/action siblings within one pattern area, **When**
   rendered in any tier, **Then** a nested `bf-stack is-dense` owns a positive
   tier-aware gap.
3. **Given** complete pattern areas such as header, body, footer, or full-width
   media, **When** stacked, **Then** an explicit shallow section stack owns the
   larger boundary and no child recreates it with margins.
4. **Given** an accordion panel with prose content, **When** the next accordion
   row begins, **Then** the panel's dense content stack prevents the final line
   from touching that row's border.

---

### User Story 4 - Coherent hero and quote grids (Priority: P1)

As a site author, I need hero and quote compositions to align to the shared
page grid and preserve clear content hierarchy without decorative prose
indentation.

**Why this priority**: The current hero assigns the entire copy stack to one
half, and the quote wrapper creates unrelated fractional grids, visibly
breaking cross-section keylines.

**Independent Test**: At wide containers, the hero places its flush H1/H2 title
block in the left half and supporting copy/actions in the right half, with
optional media spanning the full layout. The quote header, signpost, quote,
citation, CTA, and media align to one eight-column grid. At narrow containers
both patterns collapse in source order without overflow and remain logical in
RTL.

**Acceptance Scenarios**:

1. **Given** a wide default hero, **When** its tracks are measured, **Then** its
   title block occupies the left half, supporting content occupies the right
   half, and full media spans both halves.
2. **Given** an H1/H2 hero title pair, **When** rendered, **Then** it uses the
   shared flush-stack contract and reads as one bold-to-light heading block.
3. **Given** a wide quote wrapper, **When** its tracks are measured, **Then**
   signpost/content resolve to 2/6 columns and quote/citation resolve to 4/2
   subgrid columns on the same eight-column keylines.
4. **Given** prose blockquotes in BF, **When** rendered, **Then** they remain
   semantic body text without an automatic vertical rule, inline indent, or
   muted pseudo-quote treatment.

---

### User Story 5 - One navigable and grid-aligned demo shell (Priority: P1)

As a design-system reviewer, I need every demo to use the same page gutter,
global baseline overlay, and adjacent-page navigation so repeated QA does not
depend on local controls or continual sidebar travel.

**Independent Test**: Visit the component and pattern atlases plus isolated
component routes at wide and constrained widths. The top-bar baseline control
covers both the content and left navigation, no local baseline toggle remains,
standalone utility links occupy a metric-aligned text box, every wrapped demo
uses `bf-page`, and Previous/Next follow the visible sidebar order.

**Acceptance Scenarios**:

1. **Given** the shared page chrome, **When** the baseline toggle is enabled,
   **Then** one overlay spans the complete page chrome, including the sidebar.
2. **Given** a standalone inline link in a control or navigation cluster,
   **When** compared with adjacent body-sized controls, **Then** its occupied
   text box includes the canonical body nudge and compensation.
3. **Given** any demo loaded through the shared chrome, **When** its content
   wrapper is inspected, **Then** it carries `bf-page` and its inline padding
   resolves directly from `--bf-page-margin`.
4. **Given** a catalogued page, **When** Previous or Next is activated,
   **Then** navigation follows the same category-first, alphabetic-within-group
   ordering shown in the sidebar.

---

### User Story 6 - Stable compact pattern internals (Priority: P1)

As a component user, I need dividers, media tracks, compact notifications, and
sortable headers to retain stable geometry through content and state changes.

**Independent Test**: Render content cards, media objects, notifications, and
sortable tables across all four tiers. Card footer chips clear their divider;
media sits left in columns 1-2 with content in 3-8; notification first-line
icons align and one-sentence warnings read as one text run; and sorting changes
neither table nor column widths.

**Acceptance Scenarios**:

1. **Given** a content-card footer border, **When** its first chip is measured,
   **Then** the border-to-content inset equals the shared post-rule rhythm.
2. **Given** a wide media object, **When** its layout is measured, **Then** the
   media slot occupies columns 1-2, remains left aligned at its existing size,
   and content occupies columns 3-8.
3. **Given** a warning whose bold lead and message form one sentence, **When**
   rendered, **Then** it uses one body text run rather than negative spacing
   between separate typographic boxes.
4. **Given** any sortable-table state, **When** sorting cycles among none,
   ascending, and descending, **Then** every column width remains stable within
   1px because the indicator track is always reserved.

---

### User Story 7 - Disciplined page chrome and shared keylines (Priority: P1)

As a system reviewer, I need demo navigation, controls, rules, and page gutters
to use the same public type and grid contracts as the components they document,
so the catalog cannot normalize one-off sizes or compound horizontal insets.

**Independent Test**: Open a grid example and the typographic specimen at wide
and constrained widths. The header contains body-sized breadcrumbs at left and
white chevron-only Previous/Next buttons at right; theme, baseline, and tier
controls remain available in a fixed bottom bar; plain `hr` and `.bf-rule`
match; and specimen copy, grids, and chrome begin on one shared page keyline.

**Acceptance Scenarios**:

1. **Given** a plain `hr` or `.bf-rule`, **When** rendered in the same tier,
   **Then** both use the same border, reset, and post-rule rhythm.
2. **Given** shared demo chrome, **When** its current-page context is rendered,
   **Then** it uses the public breadcrumb component at the tier body size rather
   than private 12px/14px labels.
3. **Given** a catalogued page with adjacent routes, **When** the top bar is
   inspected, **Then** chevron-only white Previous/Next link-buttons sit flush
   right with accessible destination names, while display controls live in a
   fixed bottom bar.
4. **Given** a `bf-page` containing `bf-fixed-width`, **When** both establish
   layout, **Then** the page owns the sole horizontal gutter and the nested
   fixed-width region does not add a second inset.
5. **Given** a non-heading UI component outside a documented tight context,
   **When** its type is computed in any built-in tier, **Then** its font size and
   line height resolve from that tier's body role rather than fixed sub-body
   values.
6. **Given** an anchor styled as a non-underlined component affordance, **When**
   hovered or activated, **Then** an element-qualified component rule prevents
   the generic anchor underline from leaking into that affordance.

## Edge Cases

- Icon navigation rows may contain a status chip, nested lists, wrapped labels,
  title rows, or non-link text and must retain the reserved icon column.
- Search fields must remain correct with empty values, both actions, keyboard
  focus outlines, narrow inline sizes, and direct or class-switched tier CSS.
- TOC links may wrap, nest, become current, use RTL, or sit below a section
  divider without gaining row gaps or inline overflow.
- Heading pairs may wrap independently; flush means no semantic gap, not
  negative overlap or removal of metric compensation.
- Pattern stacks must not add spacing between hidden tab panels or inflate a
  collapsed navigation/accordion state.
- Quote wrappers without a signpost still align their six-column content rail
  to the same page keylines.
- Demo pages may contain a full application/site shell; the outer demo page
  gutter must frame that specimen without altering its internal component API.
- Previous/Next are omitted at catalog boundaries and retain accessible page
  names even when their visible labels remain compact.
- A route may have only one adjacent page; the remaining chevron button is
  omitted without displacing the available control from the right-aligned group.
- The fixed bottom control bar may wrap at constrained widths and must reserve
  enough document space that it never obscures the final page content.
- Media-object content may wrap or use the large media size without escaping
  its allocated grid tracks. RTL-specific specimens are outside this pass.

## Requirements

### Functional Requirements

- **FR-001**: Icon-enabled side navigation MUST reserve the icon column for
  rows whose icon slot is omitted.
- **FR-002**: Search-box and search-and-filter trailing actions MUST size from
  the rendered input block rather than a larger nominal control token.
- **FR-003**: Search-and-filter panels MUST begin after the complete input box
  and MUST NOT be overlapped by trailing actions or separators.
- **FR-004**: Filter-panel section headings MUST use the canonical H5 role via
  role composition; component CSS MUST NOT duplicate H5 typography values.
- **FR-005**: TOC lists and items MUST own zero inter-row gap, while links keep
  only their metric-derived padding.
- **FR-006**: TOC section headings MUST use canonical H5 typography and default
  text color; dividers MUST introduce only that higher section level.
- **FR-007**: The narrow TOC demo MUST use a flush composition around its
  specimen heading and TOC.
- **FR-008**: Demo navigation MUST expose four tier reference entry points.
- **FR-009**: Tiered list, CTA block, and equal-height row MUST be catalogued
  with other patterns rather than individual data-display components.
- **FR-010**: Pattern internals MUST use `bf-stack is-flush` for heading pairs,
  `bf-stack is-dense` within one content area, and explicit shallow section
  stacks between complete pattern areas.
- **FR-011**: The pattern sweep MUST cover every active page in the pattern
  catalog and correct confirmed zero-gap semantic sibling defects.
- **FR-012**: Wide heroes MUST use a 50/50 title/content grid by default and
  MUST allow media to span the complete grid.
- **FR-013**: Quote wrappers MUST align header, signpost, content, quote,
  citation, actions, and media to a shared eight-column grid.
- **FR-014**: BF prose blockquotes MUST render as plain body text without a
  default inline rule, inline padding, or muted color.
- **FR-015**: All changes MUST use flat `bf-*` classes and `is-*` modifiers,
  logical properties, and existing stack primitives; no `@extend`, BEM alias,
  styled `data-*` selector, `!important`, or consumer override is permitted.
- **FR-016**: Direct tier bundles and shared class switching MUST remain
  equivalent for affected public CSS.
- **FR-017**: Generated files MUST be rebuilt from source and MUST NOT be
  hand-edited.
- **FR-018**: Shared demo chrome MUST own the sole baseline-grid control and
  target the complete body rather than an individual capture surface.
- **FR-019**: Standalone text links MUST either be wrapped by a text role or use
  the public `bf-text-link` role; raw inline anchors MUST remain valid in prose.
- **FR-020**: Every shared-chrome demo content wrapper MUST compose `bf-page`,
  and `bf-page` inline padding MUST resolve directly from `--bf-page-margin`.
- **FR-021**: Shared page chrome MUST expose accessible Previous/Next links
  whose order exactly matches its visible sidebar order.
- **FR-022**: Catalog navigation MUST remain grouped by purpose, preserve the
  intentional Overview/chapter/tier sequences, and sort other items
  alphabetically within their group.
- **FR-023**: Content-card footer borders MUST reserve the same trailing rhythm
  as a one-pixel `bf-rule` before footer content.
- **FR-024**: Wide media objects MUST use the shared eight-column grid with
  media in columns 1-2 and content in columns 3-8; the existing media sizes
  MUST remain unchanged and the RTL fixture/modifier is not required.
- **FR-025**: Notifications MUST use compact token-owned insets, align their
  severity icon with the first text line, and model a bold lead plus regular
  continuation as one semantic text run rather than a negative-gap utility.
- **FR-026**: Sortable table headers MUST reserve indicator geometry in every
  sort state so activation changes no column width by more than 1px.
- **FR-027**: The recurrence sweep MUST inspect all catalogued pages for bare
  standalone links, missing page gutters, border/rule crowding, pseudo-elements
  added only in active state, and separate text roles being used as one phrase.
- **FR-028**: The unclassed `hr` basic selector MUST share the complete
  `.bf-rule` contract; `.bf-prose` MUST NOT be required for the base rule.
- **FR-029**: Shared page chrome MUST use the public breadcrumb component at
  tier body size and MUST NOT define private sub-body label sizes.
- **FR-030**: Shared page chrome MUST keep breadcrumbs at the top left,
  chevron-only white Previous/Next link-buttons at the top right, and theme,
  baseline-grid, and tier controls in a fixed bottom bar.
- **FR-031**: A `bf-page` ancestor MUST be the sole owner of the page gutter;
  descendant `bf-fixed-width` regions MUST retain their cap and centering
  behavior without repeating inline padding.
- **FR-032**: Non-heading public UI outside intentionally tight contexts MUST
  consume `--bf-body-font-size` and `--bf-body-line-height`; fixed sub-body
  values MUST NOT be used as a parallel tier scale.
- **FR-033**: Component link selectors that suppress decoration MUST qualify
  anchors in their normal and interaction states so the generic anchor hover
  contract cannot reintroduce underlines.
- **FR-034**: The recurrence review MUST inspect the sibling Diagram Registry
  as read-only consumer evidence and MUST NOT introduce downstream overrides
  for defects owned by Baseline Foundry.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Across all four tiers, every tested search trailing action is
  contained within its input border box with at most 1px rounding tolerance,
  and expanded panels report zero action overlap.
- **SC-002**: Across all four tiers and narrow/RTL states, TOC list and item
  gaps compute to 0px, links retain metric-only padding, and inline overflow is
  at most 1px.
- **SC-003**: The catalog exposes four tier references and no longer lists
  tiered list, CTA block, or equal-height row under Data display.
- **SC-004**: Every pattern identified by the pre-implementation audit as a
  zero-gap semantic-sibling defect has an explicit flush, dense, or shallow
  stack owner and a regression assertion.
- **SC-005**: Wide hero title/content tracks are equal within 1px and full media
  spans their combined width; narrow and RTL fixtures have at most 1px overflow.
- **SC-006**: Wide quote-wrapper outer tracks resolve to two and six shared grid
  columns, and quote/citation edges align to four and two content subgrid
  columns within 1px.
- **SC-007**: `npm test` and `npm run qa:components` pass, affected demos are
  visually reviewed in all four tiers and constrained widths, and an
  adversarial review has no unresolved high- or medium-severity findings.
- **SC-008**: Component and pattern atlases have one baseline toggle, aligned
  standalone links, and global overlay coverage from inline edge to inline edge.
- **SC-009**: Every catalogued shared-chrome route has a `bf-page` wrapper whose
  computed inline inset equals `--bf-page-margin` at tested viewport brackets.
- **SC-010**: Previous/Next traverse the exact visible catalog sequence and
  expose destination names to assistive technology.
- **SC-011**: Content-card divider clearance, media-object 2/6 keylines,
  notification first-line alignment, and sortable column stability pass in all
  four tiers with at most 1px geometry tolerance.
- **SC-012**: Plain `hr` and `.bf-rule` computed geometry and color are equal in
  every tier, including highlighted state where applicable.
- **SC-013**: Page-chrome breadcrumb items and controls compute to the tier body
  size; the top sequence controls are icon-only and the fixed bottom bar leaves
  the final content unobscured at tested viewport widths.
- **SC-014**: Typographic-specimen headings, prose, and grid regions share the
  chrome content keyline within 1px, with exactly one computed page gutter.
- **SC-015**: The public/demo typography sweep reports no unexplained fixed
  sub-body UI size and browser interaction checks report no accidental
  underline on component affordances.

## Assumptions

- Existing `bf-stack` modifiers are sufficient; no new heading-pair utility is
  needed because `is-flush` already expresses zero semantic gap while
  preserving metric compensation.
- The four tier reference pages may share one small runtime/template contract,
  but each must remain a distinct navigable catalog entry.
- The owner direction supersedes Spec 015's prior TOC one-baseline row-gap and
  H6-muted hierarchy decisions.
- Pattern demo markup is public evidence: it must dogfood the intended stack
  composition rather than rely on local specimen CSS.
- Category-first navigation with alphabetic ordering inside ordinary groups is
  more predictable than one global alphabet, while Overview, chapters, and
  tier references retain their intentional learning/density sequence.
- A negative-gap family is deliberately excluded: negative `gap` is invalid
  CSS and baseline subtraction would drift across arbitrary role pairs.
