# Contract: Keyline bucket analysis

## Decision frame

An inline start and an occupied block are separate questions. A component may
share the compact control block rhythm without sharing a page-edge start, and a
chip may align to an inline text baseline without being a control row. Treating
both questions as one “indent bucket” is what creates near-matches and one-off
compensations.

The smallest defensible public vocabulary is three component-owned inline
insets, not semantic categories and not a request for new utility classes:

- `--bf-component-inline-inset-field` — compact field/data content (green).
- `--bf-component-inline-inset-action` — commands (red, one rem).
- `--bf-component-inline-inset-continuation` — copy after a leading mark or
  disclosure icon, plain navigation copy, tree leaves, and tagged application-
  navigation brand blocks (blue, two rem).

Every new component with an author-visible inline start must choose one of
these three variables. It may compensate its own border or move a known mark
canvas backward from the chosen copy line, but it must not introduce an
unaccounted inset. The switch is the only reviewed exception because its track
is intentionally wider than the common mark canvas. Page/grid placement and
navigation depth remain structural offsets, not component insets.

## Inline tracks

| Track | Relationship | Current/shared owner | Members to compare | Decision |
|---|---|---|---|---|
| Outer frame | Viewport or shell edge to first content | `--bf-page-margin`; grid gap is between columns | `bf-page`, `bf-fixed-width`, app shell and site footer | Keep distinct. Grid gap is not a page inset. |
| Grid side inset | Edge of a grid-aligned shell/panel to its first rail | grid placement and `--bf-grid-gap-inline` | navigation brand, panel-aligned site rails | Keep distinct from the page frame and the three component insets. |
| Reading content | Text edge after the page frame | page/grid placement; prose list variable for marker offset | paragraph, headings, prose body, text links, field labels/help, accordion panel copy, notification copy | Keep as the reference track. |
| Leading mark | Mark box before a label, then label start | `--bf-leading-mark-size`, `--bf-leading-mark-gap`, `--bf-leading-mark-offset`, `--bf-leading-mark-group-inset`, `--bf-list-marker-dot-size` | prose UL/OL, ticked/crossed list, rich-list markers, checkbox, radio, validation message | The marks share one centre and the copy shares the blue continuation guide. The group inset is the calculated remainder to blue in each tier, not a fixed extra inset that would overshoot in dense tiers. |
| Field content | Text inside a field-like compact surface | `--bf-component-inline-inset-field`, sourced from the tier field-control inset | input, number, select, textarea, search field, table cell, chip, status label | These members share the green guide. Number/select reserve their own trailing affordance slot. |
| Command content | Text inside a command surface | `--bf-component-inline-inset-action`, sourced from the tier action-control inset | button, icon button, segmented control, tabs, pagination, file selector button | Commands belong here horizontally, never in the field bucket. |
| Icon-label continuation | Component copy rail, with or without a leading mark | `--bf-component-inline-inset-continuation`, sourced from the shared disclosure label offset | accordion, list-tree toggle/leaf, notification copy, accordion panel continuation, side-navigation heading/plain/disclosure/icon labels, tagged application-navigation block | Mark starts are calculated backward so marked and unmarked copy resolves to the same measured 2rem audit line. Navigation depth remains layout-owned and is added only after this base. |
| Bounded regions | Structural edge around a surface whose child starts resolve to a component guide | named surface/layout placement, then one of the three component insets for author-visible content | panel/card/notice/notification/modal/drawer/search popup/footer, inline-options group | The boundary may remain layout-owned, but it does not authorize a fourth author-visible component start. Children choose field, action, or continuation; symmetric/centred geometry has no first-glyph guide. |

## Occupied-block rhythm

| Family | Members | Current evidence | Audit rule |
|---|---|---|---|
| Text run | prose, headings, list copy, labels/help, breadcrumbs | font metric start nudge and complementary end compensation | Do not add semantic role margins to make a visual match. |
| Field/action block | fields, buttons, icon-only buttons, segmented controls, pagination | metric-derived symmetric padding; icon-only buttons retain the body line through a zero-width strut | Compare occupied block, not border-box height. Field and command families may share height while remaining distinct horizontally; do not add target heights. |
| Compact navigation row | list rows, list-tree, side-navigation, segmented control | `--bf-control-box-size-compact` | A compact block family only; its inline start remains component-specific. |
| Tick row | checkbox and radio | `--bf-tick-row-block-size` | Keep separate from the wider switch track. |
| Switch row | switch | `--bf-switch-row-block-size` | Intentional isolated family: its visual is twice the standard mark width. |
| Field wrapper | label/control/help, range and choice compositions | `--bf-field-gap` | This measures vertical relationships within a form composition, not the child control height. |
| Surface/table special cases | panels/options, notification, table | panel padding; notification shell; table row variables | Do not flatten unrelated surface and table geometry into compact controls. |
| Surface region | panel/card/header/body/footer, notification/notice, popups, footer bands | panel inset and nested stack owner | Region padding and stack gaps own this; a child must not compensate the boundary. |

## Status, chip, and badge conclusion

- Chip content now uses the field inset with scalable border compensation, so
  its first glyph lands on green beside a table cell or field.
- Status labels use body metrics, shrink to their painted content in grid
  contexts, and use the same green inset. They remain a semantic colour-state
  surface rather than an alias for chip.
- `bf-chip.is-borderless` is the neutral inline label treatment. Its transparent
  border preserves the same occupied geometry as an ordinary chip; the vertical
  audit compares it directly with body text and a chip/badge pair in one inline
  formatting context, so flex-item alignment cannot hide a baseline departure.
- Badges remain centred counters. Their symmetric internal padding has no
  meaningful first-glyph keyline and therefore does not create another guide.

## Confirmed corrections

1. Plain side-navigation rows, headings, disclosures, tree leaves, and the
   tagged primary-navigation block use the continuation inset. Marked rows
   calculate their mark start backward from that copy rail, so labels land on
   blue without inheriting a panel or grid gutter. Depth adds only its named
   structural step. Documentation drawers group each H3
   with its UL, space those groups by 1.5rem, and place a real rule before every
   group except the first; list pseudo-elements do not paint separators.
2. Numeric fields retain native input semantics and keyboard increment /
   decrement behaviour. One field-owned background paints the compact pair in
   the same 1rem canvas and trailing position as select; Chromium's duplicate
   reserved spin slot is removed. Select reserves the same trailing region and
   ellipsizes a long selected value before the chevron.
3. Prose lists, ticked/crossed lists, checkbox and radio labels previously
   resolved their mark-to-copy distance from unrelated baseline multiples in
   dense tiers. They now share the explicit leading-mark family; divided list
   icons no longer add a half-baseline downward offset. The unordered-list dot
   is painted in that shared mark canvas, so its centre exactly matches the
   tick, checkbox, and radio centre in every tier. Their text now reaches the
   existing blue continuation guide through one calculated group inset. The
   enlarged radio inner dot is concentric with the outer circle, and the
   checkbox check is lowered by two scalable border units into optical centre.
4. Accordion and panel copy already established the same 2rem continuation.
   List-tree disclosure/leaf geometry, side-navigation plain/disclosure rows,
   tagged primary-navigation blocks, and notification padding now resolve
   through that relationship too. Notification icons are positioned backward
   from the shared copy line, preserving each tier's compact icon-to-text gap.
   No fourth audit keyline was introduced: red is the literal one-rem inset,
   green is the field-text start, and blue is the shared copy continuation.
5. The vertical audit uses long horizontally scrollable family rows. A red
   rule marks the common block start and each specimen paints its own blue
   occupied end. Single-line fields/buttons/segmented/pagination/icon-only
   controls share a family; tab actions move with navigation, while density-
   tuned table rows remain within one baseline of controls rather than being
   flattened into them.

## Three-guide conformance ledger

The overlay deliberately stays at three guides. This ledger is exhaustive by
source owner: repeated selectors inherit the listed family rather than
creating component-local guides. “Layout-owned” entries are audited, but are
not component padding and must not be moved onto a component guide.

| Source owner | Public members covered | Guide or disposition |
|---|---|---|
| `css-components.ts` field rules and `search-box-and-filter.ts` | input, password, number, select, textarea, search, search-and-filter, range numeric field | Green — field content |
| `table.ts`, `interactive-tables.ts` | header/body cells, icon-placeholder cells, sort/expand/mobile-card cells | Green for ordinary cell content; reserved icon/indicator slots continue from green |
| `chip-badge-status.ts` | chip, borderless chip, status label | Green; badge is a centred-counter exception |
| `button-actions.ts`, command rules in `css-components.ts`, `tabs-choice-breadcrumbs.ts` | button, icon button, file-selector button, segmented control, tabs, pagination | Red/action family; bordered members compensate their own border. Icon-only controls preserve the same occupied body line without a target height. Tier-authored action density remains a token decision and does not create a public keyline variable. |
| `css.ts`, `list.ts`, `sites-rich-lists.ts`, selection and validation rules in `css-components.ts` | prose UL/OL, divided/ordered/ticked/crossed lists, rich-list markers, checkbox, radio, validation message | Blue copy continuation; common mark centre between red and blue |
| accordion rules, `list-tree.ts`, `interactive-feedback.ts`, panel continuation | accordion tab/panel, list-tree toggle, notification title/message, panel content | Blue — disclosure/copy continuation |
| switch rules | switch label | Blue in the shared icon-led comparison; the wider switch track remains component-owned |
| `legacy-navigation.ts`, `document-navigation.ts`, `navigation-layout.ts` | root/child side navigation, tagged primary-navigation brand, top navigation, reduced navigation, TOC, in-page navigation, article pagination | Side-navigation headings, plain/disclosure/icon rows, tree leaves, and tagged app-navigation blocks use blue; structural depth and asymmetric destination slots remain layout-owned. |
| `panel.ts`, `cards-options.ts`, content/surface modules | panel/card/option card/fieldset/modal/drawer/tooltip/search popup/code snippet/inline-options regions | Copy-bearing bounded regions use blue/continuation. Contextual-menu and code-header dropdown commands use red/action. The top-navigation row retains the legacy panel token only as structural shell placement; reserved prompt and line-number slots are internal continuations from the chosen blue content edge. |
| grid/site/pattern modules | page, fixed width, grids, docs/app shells, hero, section, tiered list, content card, media object, rich layouts | Layout-owned grid placement, span, gutter, or region boundary; never a component-padding guide |
| zero/symmetric primitives | plain text, headings, labels/help, inline list, badge, icon, rule, centred icon-only control | Zero inset or symmetric geometry; no first-glyph guide is required |

## Inline-scale consolidation rule

Audit the following as a reduction target, not a forced equivalence:

| Level | Relationship candidates | Current evidence | Constraint |
|---|---|---|---|
| Narrow | Field text inset | `--bf-control-inline-padding-field` | Keep field surfaces compact. |
| Standard | Literal one-rem reference and command/action inset | action inset | Compare command members to red; preserve explicit tier-token evidence rather than introducing offsets. |
| Generous | Notifications, panels/cards and surface regions | notification shell, panel inset | Preserve page/grid frame and navigation depth as separate layout relationships. |

Page margins, grid gutters, side-navigation depth and TOC nesting are not
component padding levels; they remain grid/layout contracts. New components
must select field, action, or continuation before adding any border or mark
compensation. No fourth component rail may be introduced without updating this
exhaustive ledger from measured cross-tier evidence.

| Finding | Source owner | Needed comparison | Candidate action |
|---|---|---|---|
| Status-label height / table compensation | `chip-badge-status.ts`, `table.ts` | Body metric box, status painted box, segmented compact row, table row across all tiers | Corrected to body nudges and a fit-content painted box; retain the status-bearing table-row branch as a separate vertical-rhythm contract. |
| Chip baseline | `chip-badge-status.ts` | Inline chip with adjacent body text and table/field content | Corrected with scalable border compensation; regular and borderless chips share occupied geometry. |
| Ticked list icon and label edge | `list.ts`, `css.ts`, form control styles | Icon centre against first text line and prose/ticked/selection label edge in all tiers | Corrected to the shared leading-mark family; retain a browser geometry check in closeout. |
| Table compactness | `table.ts` | Header/body cell occupied row, embedded input, chip/status label | Cell text now shares the green field inset; table row rhythm remains table-owned. |

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
as component-padding levels. The vertical fixture uses minimal demo-owned
scroll framing and horizontal start/end rules; those guides expose occupied
geometry without changing it. Offset overrides, explanatory filler, and
substitute mock components are not permitted.
