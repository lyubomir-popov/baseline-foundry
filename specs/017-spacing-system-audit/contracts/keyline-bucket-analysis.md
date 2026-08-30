# Contract: Keyline bucket analysis

## Decision frame

An inline start and an occupied block are separate questions. A component may
share the compact control block rhythm without sharing a page-edge start, and a
chip may align to an inline text baseline without being a control row. Treating
both questions as one “indent bucket” is what creates near-matches and one-off
compensations.

The smallest defensible public vocabulary is therefore a short list of
**axis-specific variable families**, not semantic categories and not a request
for new utility classes. Existing public variables should be consolidated only
where a measurement confirms that the same padding relationship is shared.

## Inline tracks

| Track | Relationship | Current/shared owner | Members to compare | Decision |
|---|---|---|---|---|
| Outer frame | Viewport or shell edge to first content | `--bf-page-margin`; grid gap is between columns | `bf-page`, `bf-fixed-width`, app shell and site footer | Keep distinct. Grid gap is not a page inset. |
| Grid side inset | Edge of a grid-aligned shell/panel to its first rail | `--bf-panel-content-padding-inline`, falling back to `--bf-grid-gap-inline` | root side navigation, navigation brand, panel-aligned site rails | Keep distinct from the page frame. Root side navigation now uses this resolved grid inset. |
| Reading content | Text edge after the page frame | page/grid placement; prose list variable for marker offset | paragraph, headings, prose body, text links, field labels/help, accordion panel copy, notification copy | Keep as the reference track. |
| Leading mark | Mark box before a label, then label start | `--bf-leading-mark-size`, `--bf-leading-mark-gap`, `--bf-leading-mark-offset`, `--bf-list-marker-dot-size` | prose UL/OL, ticked/crossed list, checkbox, radio, validation message | Consolidate only these measured members. The prose UL dot now occupies the same mark canvas as the selection controls; switches and disclosures retain wider tracks. |
| Field content | Text inside a field surface | `--bf-control-inline-padding-field` | input, number, select, textarea, search field | Separate from commands; number/select reserve their own trailing affordance slot. |
| Command content | Text inside a command surface | `--bf-control-inline-padding-action` | button, icon button, segmented control, tabs, pagination, file selector button | Buttons belong here horizontally, never in the field bucket. |
| Icon-label continuation | Icon canvas to label/panel continuation | `--bf-icon-label-inline-offset`, `--bf-disclosure-label-inline-offset`, `--bf-disclosure-icon-optical-offset-block` | accordion, list tree, notification copy, accordion panel continuation | Accordion, list tree, notification copy, and panel content resolve to the same measured 2rem audit line. Navigation depth remains layout-owned and is not forced onto it. |
| Surface content | First content after a bounded surface edge | `--bf-panel-padding-inline` | panel/card/notice/notification/modal/drawer/search popup/footer, inline-options group | Keep distinct from the outer frame and compact controls. Surface padding is a region contract. |

## Occupied-block rhythm

| Family | Members | Current evidence | Audit rule |
|---|---|---|---|
| Text run | prose, headings, list copy, labels/help, breadcrumbs | font metric start nudge and complementary end compensation | Do not add semantic role margins to make a visual match. |
| Field/action block | fields, buttons, pagination, accordion headers | `--bf-control-box-size` plus the corresponding padding calculation | Compare occupied block, not border-box height. Field and command families may share height while remaining distinct horizontally. |
| Compact navigation row | list rows, list-tree, side-navigation, segmented control | `--bf-control-box-size-compact` | A compact block family only; its inline start remains component-specific. |
| Tick row | checkbox and radio | `--bf-tick-row-block-size` | Keep separate from the wider switch track. |
| Switch row | switch | `--bf-switch-row-block-size` | Intentional isolated family: its visual is twice the standard mark width. |
| Field wrapper | label/control/help, range and choice compositions | `--bf-field-gap` | This measures vertical relationships within a form composition, not the child control height. |
| Surface/table special cases | panels/options, notification, table | panel padding; notification shell; table row variables | Do not flatten unrelated surface and table geometry into compact controls. |
| Surface region | panel/card/header/body/footer, notification/notice, popups, footer bands | panel inset and nested stack owner | Region padding and stack gaps own this; a child must not compensate the boundary. |

## Status, chip, and badge conclusion so far

- A chip is an inline, bordered tag with `vertical-align` border compensation.
  It is not presently a compact control row, so comparing its glyph baseline
  directly with a checkbox row is a category error until the audit defines a
  shared inline context.
- A status label is intended as an inline data label, but it currently uses
  **H5** start/end nudges while rendering body typography. That is a confirmed
  metric mismatch and explains its vertically asymmetric paint. Correct it to
  body metrics before considering a replacement or a borderless-chip API.
- Keep `bf-status-label` for now. Removing it or aliasing it to a borderless
  chip would change semantic and colour contracts; that needs product evidence
  beyond a geometry correction.
- Table rows that contain a status label have a special padding branch. Recheck
  that branch after the label uses body metrics; it may become redundant.

## Confirmed corrections

1. Root side-navigation rows and headings now use
   `--bf-side-navigation-content-inset`, resolved from
   `--bf-panel-content-padding-inline` or the grid-gutter fallback. Their peer
   navigation brand uses the same resolved grid rail; depth adds only the
   existing baseline steps.
2. Numeric fields retain native input semantics and keyboard increment /
   decrement behaviour. One field-owned background paints the compact pair in
   the same 1rem canvas and trailing position as select; Chromium's duplicate
   reserved spin slot is removed.
3. Prose lists, ticked/crossed lists, checkbox and radio labels previously
   resolved their mark-to-copy distance from unrelated baseline multiples in
   dense tiers. They now share the explicit leading-mark family; divided list
   icons no longer add a half-baseline downward offset. The unordered-list dot
   is painted in that shared mark canvas, so its centre exactly matches the
   tick, checkbox, and radio centre in every tier. The radio inner dot is one
   border pixel larger and optically shifted one pixel left/up.
4. Accordion and panel copy already established the same 2rem continuation.
   List-tree root compensation and notification padding now resolve through
   that relationship too. Notification icons are positioned backward from the
   shared copy line, preserving each tier's compact icon-to-text gap. No fourth
   audit keyline was introduced: red is the literal one-rem inset, green is the
   field-text start, and blue is the shared icon-label continuation.

## Measurement queue before further correction

## Proposed inline-scale consolidation

Audit the following as a reduction target, not a forced equivalence:

| Level | Relationship candidates | Current evidence | Constraint |
|---|---|---|---|
| Narrow | Field text inset | `--bf-control-inline-padding-field` | Keep field surfaces compact. |
| Standard | Commands, tabs, top navigation, marker-to-label and disclosures | action inset, leading-mark gap, disclosure gap | Align only after icon/text first-line geometry passes in all tiers. |
| Generous | Notifications, panels/cards and surface regions | notification shell, panel inset | Preserve page/grid frame and navigation depth as separate layout relationships. |

Page margins, grid gutters, side-navigation depth and TOC nesting are not
component padding levels; they must remain grid/layout contracts. The next
correction pass measures whether the standard candidates can use one shared
token family with border compensation rather than per-component offsets.

| Finding | Source owner | Needed comparison | Candidate action |
|---|---|---|---|
| Status-label height / table compensation | `chip-badge-status.ts`, `table.ts` | Body metric box, status painted box, segmented compact row, table row across all tiers | Replace H5 nudges with body nudges; then retain/remove table special case from evidence. |
| Chip baseline | `chip-badge-status.ts` | Inline chip with adjacent body text; checkbox/radio/switch occupied rows | Retain border compensation only if it makes an inline text run correct. Do not give a chip control-row padding spec by assumption. |
| Ticked list icon and label edge | `list.ts`, `css.ts`, form control styles | Icon centre against first text line and prose/ticked/selection label edge in all tiers | Corrected to the shared leading-mark family; retain a browser geometry check in closeout. |
| Table compactness | `table.ts` | Header/body cell occupied row, embedded input, chip/status label | Share compact block rhythm only; keep table column padding as a table contract unless a common edge is shown. |

## Exhaustive inline-offset audit list

The following are audit obligations. A component may be represented by a
shared family fixture only after its source owner is named here.

- Page/grid: `bf-page`, `bf-fixed-width`, `bf-grid`, grid spans, docs/app
  shells, application aside/main, site footer and navigation bar.
- Prose/markers: native `ul`/`ol`, nested prose lists, `bf-list` plain,
  ticked/crossed/divided/ordered, inline lists, rich-list markers, quote and
  citation rows.
- Forms/selection: field label/help/validation, input/select/number/textarea,
  file selector, search/search-and-filter, range plus numeric field,
  checkbox/radio/switch, choice row, inline options, buttons and icon buttons,
  segmented/tab buttons, chips, badges and status labels.
- Navigation/disclosure: top navigation, side navigation (including iconless
  rows and all depths), list tree, tabs/panel tabs, accordion, table of
  contents, breadcrumbs, pagination, article pagination, in-page navigation,
  contextual menus and code-snippet controls.
- Surfaces/data: panels/card/options, notices/notifications, modal/drawer,
  tooltip/popup/search popup, tables including sort/expand/icon cells and
  mobile cards, code blocks and line-number tracks.
- Patterns/sites: basic/divided/CTA/tiered/linked-logo sections, hero, tab
  section, media object, quote wrapper, rich lists, content cards, equal-height
  rows, data/text spotlights, empty state and sticky footer.

## Consumer audit fixture

`/demo/spec/spacing.html` is a short overview only. The full-width
`/demo/spec/spacing-horizontal.html` and `/demo/spec/spacing-vertical.html`
routes separately group raw shipped components by exactly one axis and named
variable family. They deliberately do not use hero/basic-section 50/50 rails.
The horizontal fixture keeps number, select, and table-cell content together,
and presents accordion, list tree, switch, side navigation, table of contents,
and notification as one icon-led/navigation review bucket. That presentation
does not reclassify page margin, grid gutter, navigation depth, or TOC nesting
as component-padding levels.
No local rulers, offset classes, explanatory filler, or substitute mock
components are permitted.
