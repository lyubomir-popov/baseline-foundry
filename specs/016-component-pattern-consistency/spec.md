# Feature Specification: Component and Pattern Consistency

**Feature Branch**: `feat/016-component-pattern-consistency`

**Created**: 2026-08-29

**Status**: Active

**Input**: Owner review of application navigation, search controls, document navigation, hero, linked-logo, quote-wrapper, tab-section, catalog hierarchy, horizontal keylines, tier-responsive footer density, and missing container-owned rhythm across bundled patterns.

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

**Independent Test**: At containers of 720px or wider, the hero places H1 in
the left half and H2 plus supporting copy/actions in the right half, with
optional media spanning the full layout. The quote header, signpost, quote,
citation, CTA, and media align to one eight-column grid. Below that practical
hero threshold both patterns collapse in source order without overflow and
remain logical in RTL.

**Acceptance Scenarios**:

1. **Given** a wide default hero, **When** its tracks are measured, **Then** its
   H1 occupies the left half, H2 and supporting content occupy the right half,
   and full media spans both halves.
2. **Given** a hero container just above or below 720px, **When** rendered,
   **Then** its 50/50 composition remains above the threshold and collapses
   below it without using the earlier 1036px page breakpoint.
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

---

### User Story 8 - One horizontal keyline system (Priority: P1)

As a component author, I need controls, navigation, disclosures, and panels to
show where their text deliberately departs from the paragraph keyline, using
shared geometry rather than unrelated per-component indents.

**Independent Test**: Open the horizontal-keyline comparison page in every
tier and at wide and constrained widths. Accordion labels and panel copy share
one computed text edge; panel insets follow the active main-grid gutter; and
tabs, navigation, check/radio controls, fields, buttons, and text areas expose
their intentional label/control offsets against one visible paragraph rail.

**Acceptance Scenarios**:

1. **Given** an expanded accordion, **When** the tab label and first panel text
   are measured, **Then** both begin at the same inline coordinate, derived
   from the disclosure icon size and disclosure gap variables.
2. **Given** a panel at any shared grid breakpoint, **When** its header,
   content, and footer are measured, **Then** their inline padding equals the
   current `--bf-grid-gap-inline` value.
3. **Given** the keyline comparison page, **When** a reviewer switches tier or
   viewport, **Then** each specimen retains a visible paragraph reference rail
   and names whether its departure is content, control chrome, or selection
   mark geometry.
4. **Given** a notification title followed by separate body copy, **When** the
   pair is composed as a metric-flush relationship, **Then** the title's end
   compensation and the copy's start nudge are both cancelled without a
   negative gap or element-specific notification override.

---

### User Story 9 - Monotonic tier density and disciplined responsive CSS (Priority: P1)

As a reviewer moving between tiers and viewport sizes, I need footer depth and
pattern breakpoints to change predictably instead of becoming larger in a
smaller-root tier or collapsing a usable composition prematurely.

**Independent Test**: Compare site footers and heroes through Editorial,
Documentation, App, and OS at the specified viewport brackets. Footer strip
depth is non-increasing as root type reduces; Docs and App do not jump despite
sharing the same body size; default heroes remain 50/50 at a 720px container;
and a source audit reports no private page-chrome button paint, icon filters,
styled data selectors, BEM aliases, or unexplained pattern breakpoints.

**Acceptance Scenarios**:

1. **Given** the four built-in tiers, **When** site-footer strip spacing and
   rendered footer height are compared in Editorial → Documentation → App → OS
   order, **Then** neither sequence increases.
2. **Given** page-chrome Previous/Next controls in dark tone, **When** compared
   with Diagram Generator's canonical controls, **Then** both use
   `bf-button is-base is-icon` with the shared white chevron paint and no local
   background, border, color, or filter override.
3. **Given** component and pattern CSS, **When** media/container queries are
   audited, **Then** shared page-grid thresholds and intentional intrinsic
   thresholds are distinguishable, documented, and regression checked.

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
- **FR-012**: Hero containers at least 45rem wide MUST use a 50/50 grid by
  default, place H1 in the first track, place H2 and supporting content in the
  second track, and allow media to span the complete grid.
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
  severity icon with the first text line, use one semantic text run when lead
  and continuation form one sentence, and use the shared metric-flush stack
  modifier when distinct title/body blocks must visually abut.
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
- **FR-035**: Page-chrome sequence links MUST compose the same
  `bf-button is-base is-icon` markup as Diagram Generator and MUST NOT carry
  private button paint or icon filters.
- **FR-036**: Expanded accordion panel text MUST align with its tab label using
  `--bf-disclosure-icon-inline-size` plus `--bf-disclosure-gap`; copied font-size
  or baseline arithmetic MUST NOT define that shared keyline.
- **FR-037**: A reusable metric-flush stack modifier MUST cancel the preceding
  text role's block-end compensation and the following text role's block-start
  nudge while retaining ordinary role typography and avoiding negative gaps.
- **FR-038**: Site-footer strip spacing and rendered height MUST be
  non-increasing in Editorial → Documentation → App → OS order; equal body-size
  tiers MAY use equal spacing.
- **FR-039**: Panel header, content, and footer inline padding MUST resolve from
  the active `--bf-grid-gap-inline`, with the configured panel value retained
  only as a fallback for custom surfaces that omit grid tokens.
- **FR-040**: A catalogued horizontal-keyline comparison page MUST include
  paragraph, tabs, side navigation, check/radio, accordion, inputs, buttons,
  textarea, and panel specimens in all four tiers.
- **FR-041**: Responsive CSS review MUST classify shared grid thresholds and
  component-intrinsic thresholds and MUST reject one-off demo overrides that
  restyle public component paint.

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
- **SC-005**: At a 720px hero container the two tracks are equal within 1px,
  H1 begins in track one, H2 begins in track two, and full media spans their
  combined width; below 720px the layout is one track with at most 1px overflow.
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
- **SC-016**: Accordion tab-label and expanded-panel text edges differ by at
  most 1px in every tier and direction.
- **SC-017**: Metric-flush notification title/copy pairs have no semantic stack
  gap, a visual glyph gap no greater than one baseline, and remain baseline
  aligned in all four tiers.
- **SC-018**: Site-footer strip spacing and height are non-increasing across the
  ordered tier sequence at wide and constrained test widths.
- **SC-019**: Panel inline padding equals the current grid gutter within 1px at
  the x-small, small/medium, and large viewport brackets.
- **SC-020**: Static CSS-practice checks find no private sequence-button paint,
  icon inversion filter, styled data selector, BEM public alias, `!important`,
  or undocumented hero breakpoint in the affected source/demo surfaces.

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
  CSS. The narrowly defined `is-metric-flush` parent modifier cancels only the
  adjacent roles' metric compensation/nudge and does not subtract a guessed
  baseline multiple.
