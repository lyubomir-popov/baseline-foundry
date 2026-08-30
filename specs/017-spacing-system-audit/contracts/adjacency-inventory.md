# Contract: Spacing Adjacency Inventory

This inventory is the audit ledger. “Tight” means two rendered boxes whose
relationship can visibly fail when their gap, inset, metric compensation, rule,
wrap, or responsive state changes. Each item must finish with a source owner and
an automated or browser-verifiable route; no public diagnostic board is needed.

## Relationship classes

| ID | Adjacent boxes | Axis | Required owner |
|---|---|---|---|
| R01 | H1–H6 followed by supporting heading | Block | `bf-stack is-flush` only when the roles read as one title; otherwise an explicit stack density |
| R02 | Heading followed by paragraph/list/figure/control | Block | Owning content or pattern stack |
| R03 | Paragraph followed by paragraph/list/quote/figure/code | Block | Prose flow or explicit stack, never role `space-after` |
| R04 | List item followed by list item or nested list | Block + inline | List component row/indent variables |
| R05 | `dt` followed by `dd`, label followed by help, strong lead followed by body | Block/inline | Flush text run or flush stack according to semantics |
| R06 | Rule/border followed by heading, body, chips, or controls | Block | Rule compensation plus owning region gap |
| R07 | Label, control, help, validation, and action in a field | Block + inline | Field gap and control padding variables |
| R08 | Checkbox/radio/switch mark followed by label | Inline | Visual-size and mark-to-label gap variables |
| R09 | Icon followed by label/status/action | Inline + first-line block alignment | Component icon-size/gap variables |
| R10 | Button label followed by icon; adjacent buttons | Inline | Button padding/icon gap; `bf-cluster` for siblings |
| R11 | Tab/disclosure label followed by panel content | Block + inline keyline | Tabs/accordion component variables |
| R12 | Navigation mark/label/status and nested levels | Inline + block | Side/top navigation row, icon, and indent variables |
| R13 | Panel header/content/footer and their first/last children | Block + inline | Panel region padding and nested stack |
| R14 | Table header icon/cell content/row separator | Inline + block | Table cell padding and reserved indicator track |
| R15 | Card media/header/body/footer/action areas | Block + inline | Pattern area stack and card inset variables |
| R16 | Quote, citation, signpost, media, and CTA | Block + grid keyline | Quote-wrapper grid and nested stacks |
| R17 | Hero H1, H2, copy, actions, and media | Block + grid keyline | Hero grid and nested flush/dense stacks |
| R18 | Notification icon/title/message/close action | Inline + block | Notification layout plus metric-flush relationship |
| R19 | Popup/tooltip/modal trigger and surfaced content | Block/inline overlap | Anchor positioning, surface inset, and viewport clearance |
| R20 | Complete header/body/footer or pattern siblings | Block | Section/shallow-section stack, never child exit margins |
| R21 | Page edge, grid gutter, fixed-width region, and panel inset | Inline | Page/grid/panel public gutter variables |
| R22 | Responsive collapsed/expanded or hidden/visible states | Both | The same component owner at an intrinsic or shared breakpoint |

## Confirmed keyline map

The audit compares named tracks rather than prescribing one universal start
edge. The full-width
`/demo/spec/spacing-horizontal.html` and `/demo/spec/spacing-vertical.html`
routes put the relevant keyline-bearing primitives in separately classified
arrangements. Author-visible component starts resolve to field, action, or
continuation; the switch is the only measured component exception. Page/grid
placement and navigation depth remain named structural offsets.

| Keyline | Typical relationship | Owner |
|---|---|---|
| Field (green) | Input, table-cell, chip, status, compact field-like content | `--bf-component-inline-inset-field` |
| Action (red) | Button, tab, pagination, plain navigation and menu commands | `--bf-component-inline-inset-action` |
| Continuation (blue) | Copy after a mark/disclosure and copy-bearing bounded regions | `--bf-component-inline-inset-continuation` |
| Structural placement | Page/grid edge, navigation depth, reserved prompt/indicator slots | Named layout or internal-slot owner; never a fourth component inset |

## Route inventory

The relationship IDs identify the minimum audit surface. Individual specimens
within a route may add rows during T005/T006, but no listed route may be removed
from the ledger without a catalog decision.

### Foundations and shells

| Route | Tight relationships | Primary owner/evidence |
|---|---|---|
| `/demo/components/typography.html` | R01–R05 | Text metric boxes and explicit stacks |
| `/demo/components/prose.html` | R02–R06 | `.bf-prose` flow composition, lists, quote, rule |
| `/demo/components/layout.html` | R01–R05, R20–R21 | Stack/cluster/section/page/grid primitives |
| `/demo/components/grid.html` | R20–R21 | Grid gap, spans, page/fixed-width gutters |
| `/demo/components/docs-layout.html` | R02, R11–R13, R20–R22 | Documentation shell regions and TOC/content keylines |
| `/demo/components/page-shell.html` | R02, R12, R20–R22 | Header/main/footer and fixed-width/page edges |
| `/demo/components/application-shell.html` | R12–R13, R20–R22 | Navigation/main/aside tracks and panel regions |
| `/demo/components/application-layout.html` | R07, R09, R12–R13, R18, R20–R22 | Responsive navigation, panels, sticky footers, range fixture |
| `/demo/components/stage-shell.html` | R02, R13, R20–R21 | Stage header/body and bounded content |
| `/demo/components/drawer-panel.html` | R09, R13, R19–R22 | Drawer trigger, header/content/footer, overlay clearance |

### Forms and controls

| Route | Tight relationships | Primary owner/evidence |
|---|---|---|
| `/demo/components/form-atlas.html` | R05, R07–R10, R19, R22 | All field/control compositions together |
| `/demo/components/button.html` | R09–R10, R22 | Button padding, icon gap, adjacent actions |
| `/demo/components/actions.html` | R09–R10, R20, R22 | Action cluster wrapping and hierarchy |
| `/demo/components/text-input.html` | R05, R07, R19, R22 | Label/input/help/validation and adornments |
| `/demo/components/color-input.html` | R07, R09, R22 | Swatch/control/label geometry |
| `/demo/components/select.html` | R05, R07, R09, R22 | Label/select/help and indicator inset |
| `/demo/components/checkbox.html` | R05, R08, R22 | Mark/label/help and wrapped label alignment |
| `/demo/components/radio.html` | R05, R08, R22 | Mark/label/help and group rows |
| `/demo/components/range.html` | R05, R07, R09, R22 | Label/track/value/help; stacked and inline modes |
| `/demo/components/file-input.html` | R05, R07, R09–R10, R22 | Label/native picker/help/validation |
| `/demo/components/validation.html` | R05, R07, R09, R18 | Field/help/error message and severity icon |
| `/demo/components/switch.html` | R05, R08–R09, R22 | Track/thumb/label/help |
| `/demo/components/search-box.html` | R07, R09–R10, R19, R22 | Input, leading/trailing actions, separator, popup edge |
| `/demo/components/search-and-filter.html` | R02, R05, R07, R09–R10, R13, R19, R22 | Search field, popup sections, filters, actions |
| `/demo/components/code-snippet.html` | R03, R06, R09–R10, R19 | Code/copy action/header/body boundaries |
| `/demo/components/list-tree.html` | R04, R08–R09, R12, R22 | Disclosure/selection marks, labels, nested indents |

### Data display

| Route | Tight relationships | Primary owner/evidence |
|---|---|---|
| `/demo/components/chip.html` | R09–R10 | Label/icon/dismiss action and cluster gaps |
| `/demo/components/badge.html` | R05, R09 | Inline host/badge and compact internal padding |
| `/demo/components/status-label.html` | R05, R09 | Status mark/text and inline host alignment |
| `/demo/components/icon.html` | R09–R10 | Icon box, adjacent label/action, optical alignment |
| `/demo/components/list.html` | R03–R04, R20 | Prose/list boundaries, item and nested-list rhythm |
| `/demo/components/inline-list.html` | R03–R05, R20, R22 | Inline items, separators, wrapping, surrounding content |
| `/demo/components/figure.html` | R03, R05–R06, R15, R20 | Media/caption/rule/surrounding prose |
| `/demo/components/aspect.html` | R03, R15, R20–R22 | Aspect media/caption/content and responsive box |
| `/demo/components/table.html` | R06, R09, R14, R19, R22 | Header/body cells, rows, caption, overflow surface |

### Navigation and disclosure

| Route | Tight relationships | Primary owner/evidence |
|---|---|---|
| `/demo/components/tabs.html` | R09, R11, R19, R22 | Adjacent tabs, active rule, tab/panel keyline |
| `/demo/components/panel-tabs.html` | R11, R13, R20, R22 | Tabs against panel header/content regions |
| `/demo/components/accordion.html` | R02, R06, R09, R11, R22 | Rule/tab label/icon/panel content/next row |
| `/demo/components/side-navigation.html` | R04, R09, R12–R13, R22 | Heading, rows, iconless labels, statuses, levels |
| `/demo/components/top-navigation.html` | R09–R10, R12, R19, R21–R22 | Brand, menu, search, dropdowns, page keyline |
| `/demo/components/engine-smoke.html` | R01–R05, R20–R21 | Locked metric/cap comparison evidence only |
| `/demo/components/engine-illustration.html` | R01–R05, R20–R21 | Screenshot-only engine comparison |
| `/demo/components/segmented-control.html` | R06, R09–R10, R22 | Segment labels/icons/dividers and group edge |
| `/demo/components/breadcrumbs.html` | R04–R05, R09, R12, R22 | Items, chevrons, wraps, page keyline |
| `/demo/components/pagination.html` | R05, R09–R10, R12, R22 | Page controls, labels, disabled/current states |
| `/demo/components/skip-link.html` | R03, R10, R19, R21 | Hidden/revealed link and viewport/page edge |
| `/demo/components/contextual-menu.html` | R09–R10, R12, R19, R22 | Trigger/menu/items/separators/viewport clearance |
| `/demo/components/tooltip.html` | R05, R09–R10, R19, R22 | Trigger/tooltip gap, arrow, wrapped content |

### Surfaces, overlays, and pressure routes

| Route | Tight relationships | Primary owner/evidence |
|---|---|---|
| `/demo/components/choice-row.html` | R05, R08–R09, R13, R22 | Selection mark/title/copy/action and row padding |
| `/demo/components/inline-options.html` | R05, R08–R10, R22 | Inline choices, labels, wrapping, separators |
| `/demo/components/modal.html` | R09–R10, R13, R19–R22 | Header/content/footer/actions and viewport inset |
| `/demo/components/cards.html` | R02–R03, R06, R13, R15, R20 | Card header/body/footer/media/action areas |
| `/demo/components/option-card.html` | R05, R08–R09, R13, R15, R22 | Selection control/card copy/status/action |
| `/demo/components/notice.html` | R02–R03, R06, R09, R18, R20 | Accent/icon/title/message/action boundaries |
| `/demo/components/panel-pressure.html` | R02–R10, R13, R19, R22 | Dense mixed content within panel regions |
| `/demo/components/narrow-panel.html` | R05, R07–R10, R13, R18–R19, R22 | Tight field/action/notification overflow fixture |
| `/demo/components/editorial-pressure.html` | R01–R06, R15–R17, R20–R22 | Long-form and pattern adjacency pressure |
| `/demo/components/controls.html` | R05, R07–R10, R19, R22 | Grouped control overview |
| `/demo/components/surfaces-navigation.html` | R09–R14, R18–R22 | Grouped navigation/surface overview |

### Patterns

| Route | Tight relationships | Primary owner/evidence |
|---|---|---|
| `/demo/components/article-pagination.html` | R03, R06, R09–R10, R12, R20, R22 | Article copy/rule/previous-next items |
| `/demo/components/content-card.html` | R02–R03, R06, R09–R10, R15, R20 | Media/body/meta/footer chips and divider clearance |
| `/demo/components/data-spotlight.html` | R01–R05, R09, R15, R20–R22 | Value/label/copy/action/media grouping |
| `/demo/components/divided-section.html` | R02–R06, R20–R21 | Section rule/title/body/action and grid edge |
| `/demo/components/tiered-list.html` | R02–R06, R09, R12, R20, R22 | Tier headings/items/rules/nested content |
| `/demo/components/cta-block.html` | R01–R03, R09–R10, R15, R20–R22 | Heading/copy/actions/media areas |
| `/demo/components/equal-height-row.html` | R02–R03, R06, R15, R20–R22 | Sibling card regions and equalized actions |
| `/demo/components/credential-validation.html` | R05, R07, R09–R10, R18–R19, R22 | Credential fields, reveal, help, validation |
| `/demo/components/in-page-navigation.html` | R02–R04, R09, R12, R19–R22 | Toggle/navigation/content/sticky keylines |
| `/demo/components/logo-section.html` | R02–R03, R06, R09, R15, R20–R22 | Heading/copy/link/logo grid boundaries |
| `/demo/components/media-object.html` | R02–R03, R09, R15, R20–R22 | Media slot/content stack and 2/6 keyline |
| `/demo/components/navigation-reduced.html` | R04, R09, R12, R20–R22 | Reduced navigation groups and content frame |
| `/demo/components/notification.html` | R02–R03, R06, R09–R10, R18, R22 | Icon/title/message/close/action and metric flush |
| `/demo/components/table-expanding.html` | R06, R09–R10, R13–R14, R19, R22 | Toggle/header/cells/expanded panel |
| `/demo/components/table-mobile-card.html` | R05–R06, R09, R13–R15, R22 | Table-to-card fields, labels, row/card regions |
| `/demo/components/table-of-contents.html` | R02, R04, R06, R09, R12, R20, R22 | Section heading/rule/links/nesting/current state |
| `/demo/components/table-sortable.html` | R06, R09–R10, R14, R19, R22 | Header label/reserved sort icon/cell/row |

### Site compositions and layouts

| Route | Tight relationships | Primary owner/evidence |
|---|---|---|
| `/demo/components/basic-section.html` | R01–R06, R20–R21 | Rule/header/body/actions/media areas |
| `/demo/components/cta-section.html` | R01–R03, R06, R09–R10, R15, R20–R22 | Section header/copy/actions/media |
| `/demo/components/hero.html` | R01–R03, R09–R10, R17, R20–R22 | Flush title transition, 50/50 content, media |
| `/demo/components/linked-logo-section.html` | R02–R03, R06, R09, R15, R20–R22 | Header/link/logo body/footer boundaries |
| `/demo/components/quote-wrapper.html` | R02–R06, R09–R10, R16, R20–R22 | Signpost/quote/citation/action/media grid |
| `/demo/components/rich-list-horizontal.html` | R02–R06, R09, R15, R20–R22 | Horizontal item/media/copy/action/rules |
| `/demo/components/rich-list-vertical.html` | R02–R06, R09, R15, R20–R22 | Vertical items/media/copy/action/rules |
| `/demo/components/tab-section.html` | R01–R03, R06, R09, R11, R15, R20–R22 | Section heading/tabs/panels/media/action areas |
| `/demo/components/text-spotlight.html` | R01–R05, R09–R10, R15, R20–R22 | Signpost/value/copy/actions/media |
| `/demo/components/empty-state.html` | R01–R03, R09–R10, R15, R20–R22 | Icon/title/copy/actions and containing surface |
| `/demo/components/equal-heights.html` | R02–R03, R06, R13, R15, R20–R22 | Grid siblings, card areas, aligned actions |
| `/demo/components/sticky-footer.html` | R03, R06, R09–R10, R12–R13, R20–R22 | Header/main/footer, short/long content, links |

### Catalog, spec, tier, and retained grid routes

| Route group | Tight relationships | Primary owner/evidence |
|---|---|---|
| `/index.html`, `/demo/components/index.html`, `/demo/patterns/index.html` | R02–R06, R09–R10, R12, R20–R22 | Shared chrome, atlas sections/cards, bottom controls |
| `/demo/controls.html` | R05, R07–R10, R13, R18–R22 | Full control gallery and modal/panel composition |
| `/demo/spec/typography.html`, `/demo/spec/typographic-specimen.html` | R01–R06, R20–R21 | Type hierarchy, role substitution, page/grid keylines |
| `/demo/spec/spacing.html` | R01–R08, R11, R13, R20–R21 | Current authoring guidance and route index |
| `/demo/spec/spacing-horizontal.html` | R02–R08, R11–R14 | Full-width inline padding, marker, disclosure, navigation, and surface-inset audit |
| `/demo/spec/spacing-vertical.html` | R01–R08, R11, R13–R14, R20 | Full-width metric-box, occupied-block, field-wrapper, and surface-block audit |
| `/demo/spec/grid.html` | R02–R03, R20–R21 | Grid chapter content and guide alignment |
| `/demo/tiers/editorial.html`, `/demo/tiers/documentation.html`, `/demo/tiers/app.html`, `/demo/tiers/os.html` | R01–R21 | Direct tier reference parity |
| `/examples/grid/breakpoints.html` | R02–R03, R20–R22 | Responsive grid thresholds and shared chrome |
| `/examples/grid/nested-grid.html` | R02–R03, R20–R22 | Parent/child gaps and keylines |
| `/examples/grid/editorial-site.html` | R01–R06, R12, R15–R17, R20–R22 | Site composition and nested page grid |
| `/examples/grid/docs-layout.html` | R02–R04, R11–R13, R20–R22 | Docs navigation/content grid |
| `/examples/grid/app-panels.html` | R05, R07–R14, R18–R22 | Application panel and page-chrome clearance |
| `/examples/grid/panel-reflow.html` | R02, R07–R13, R20–R22 | Panel/aside reflow spacing |
| `/examples/grid/forms.html` | R05, R07–R10, R20–R22 | Form grid, labels, controls, actions |
| `/examples/grid/gutter-comparison.html` | R13, R20–R22 | Page/grid/panel gutter parity |
| `/examples/grid/column-span-rule.html` | R02–R06, R20–R22 | Spans, rules, and content keylines |

## Completion fields

During T005–T012, each finding appended below must record:

| Finding | Route | Relationship ID | Source owner | Token/variable | Direct/scoped tiers | Widths | Status |
|---|---|---|---|---|---|---|---|
| Page-rail groups need tight rule-to-heading spacing and loose group separation | Shared page chrome; side navigation | R06, R12, R20 | `legacy-navigation.ts`, `page-chrome.js` | action inset; `--bf-side-navigation-group-gap` | Editorial, Documentation, App, OS | Wide and constrained | Resolved; real rules, grouped H3+UL wrappers, 1.5rem group gap |
| Native number affordance reserved a duplicate browser slot | Horizontal audit; number/select | R07, R09 | `css-components.ts` | field inset and shared 1rem affordance canvas | All four | Wide and enlarged-root | Resolved; one field-owned SVG, native keyboard semantics retained |
| Prose/state/choice marks and copy used unrelated offsets | Horizontal audit; list/checkbox/radio | R04, R08–R09 | `css.ts`, `list.ts`, selection rules | leading-mark family to continuation | All four | Wide and enlarged-root | Resolved; common mark centre and blue copy start |
| Disclosure and icon-led labels drifted across components | Horizontal audit | R09, R11–R13, R18 | accordion, list-tree, navigation, notification, panel | continuation inset | All four | Wide and constrained | Resolved; zero measured copy-line spread |
| Copy-bearing bounded regions retained an unclassified tier panel inset | Surface, modal, card, popup and code routes | R13, R15, R19, R21 | surface component modules | continuation for copy; action for commands | All four | Wide and constrained | Resolved; structural top-navigation row is the only direct legacy panel-inset consumer |
| Flex-row tag comparison hid the real inline chip baseline | Vertical audit | R05, R09 | `chip-badge-status.ts` | native inline baseline | All four | Wide | Resolved; regular and borderless chip text have zero baseline delta beside body text |
| Compact tiered-list examples were capped below their own split threshold | Tiered list | R04–R06, R22 | tiered-list demo and component query | BF grid span and 32rem component threshold | All four | Wide and constrained | Resolved; invalid full-width variants removed and compact rows framed by supported eight-column grid span |
