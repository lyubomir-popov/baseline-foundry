# Vertical occupied-block coverage

This ledger prevents a component from disappearing from the audit merely
because it reuses another primitive. The visible vertical page contains every
distinct single-line geometry contract. Components that are multiline,
content-driven, or compositions are mapped to the primitive that owns their
internal vertical geometry.

## Visible single-line primitives

| Family | Vertical audit evidence | Shared contract |
|---|---|---|
| Text fields | text and number inputs, select, search | bordered control row |
| Native fields | color and file inputs | bordered control row; file selector padding is not added twice |
| Range | range rail with numeric value | shared row height; rail position remains metric-derived |
| Actions | bordered and icon buttons | bordered control row |
| Selection | choice row, checkbox, radio, switch | bordered or transparent shared row |
| Navigation/disclosure | segmented control, pagination, list-tree disclosure and child, side-navigation link and disclosure, tab, accordion, TOC link, contextual-menu command | shared row; menu compensation is in-box |
| Data | divided list row, status label, chip, table cell | shared row; table compensation and rule are in-box |
| Feedback | validation message | transparent shared row |
| Unboxed text | paragraph, text link, form label, form help, inline list, prose list, breadcrumbs | measured text metrics; no component padding |

Password, email, URL, and textarea fields reuse the text-input padding source;
the vertical page uses one text input because textarea height is content-driven.
Search-and-filter reuses the search/input/button primitives. Panel tabs reuse
the tab primitive. Sortable, expanding, and mobile-card tables reuse the table
cell primitive. These representatives are explicit; they are not omissions.

## Exhaustive supported nesting matrix

| Nested content | Real host shown on the vertical page | Modifier and owner |
|---|---|---|
| Chip | table cell | `bf-chip is-nested`; table owns the row |
| Status label | table cell | `bf-status-label is-nested`; table owns the row |
| Badge | table cell | `bf-badge is-nested`; table owns the row |
| Link action | table cell | normal `bf-button is-link`; table owns the row and the action keeps its text target |
| Chip | side-navigation link | `bf-chip is-nested`; navigation owns the row |
| Status label | side-navigation text row | `bf-status-label is-nested`; navigation owns the row |
| Badge | tab | `bf-badge is-nested`; tab owns the row |
| Badge | chip | `bf-badge is-nested`; chip owns the standalone row |

The application-layout table and navigation fixtures, the side-navigation
component fixture, the tab fixture, and the badge-in-chip fixture use these
same explicit modifiers. Content-card footer chips, search/filter chips, and
hero chips remain standalone because their parent is a flow/cluster rather
than an existing body-sized host row.

## Catalog disposition

| Catalog area | Disposition |
|---|---|
| Typography and prose | unboxed text row; headings and multiline prose are content-driven |
| Layout, grid, page, application, stage, drawer, panels | containers own child spacing; application table/navigation nested cases are in the matrix |
| Form atlas, controls overview, actions | decomposed into the visible field, action, selection, validation, range, and search primitives |
| Code snippet | multiline content-driven surface; its labels/actions map to text/button primitives |
| Figure, aspect, icons | media or visual boxes, not text-padding contracts; icon-button geometry is visible |
| Cards, option cards, notices, modals, tooltips | content-driven surfaces; their labels, actions, and lists map to visible primitives |
| Navigation composites and engines | decomposed into visible tab, accordion, side-navigation, tree, segmented, breadcrumb, pagination, TOC, menu, text, and button primitives |
| Pressure tests | responsive compositions of the same primitives, not new component geometry |
| Patterns and site compositions | content-driven compositions; notification/list/table/navigation primitives are represented directly |
| Recipes and layouts | container behavior only; no additional single-line padding source |

Any future single-line component must either join the shared interface row,
join the unboxed metric row, add a real host/content entry to the nesting
matrix, or document a new contract here with an owner-approved reason. It may
not introduce an unaccounted local height or inset.
