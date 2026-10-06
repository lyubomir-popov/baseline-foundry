# Component spacing architecture

Status: accepted implementation contract.

Baseline Foundry has four product tiers—Editorial, Documentation, App, and
OS—three component inline insets, and two block-density modes. These are
different axes and must not share terminology.

## Decision

The four product tiers supply typography, baseline, border, visual-size,
surface, and inset facts. Component CSS derives geometry from those facts once.
Tier CSS does not restyle leaf components or repair earlier component rules.

The three component inline insets are:

| Inset | Public variable | Editorial | Documentation | App | OS |
|---|---|---:|---:|---:|---:|
| Field | `--bf-component-inline-inset-field` | `0.5rem` | `0.5rem` | `0.5rem` | `0.25rem` |
| Action | `--bf-component-inline-inset-action` | `1rem` | `0.75rem` | `0.75rem` | `0.5rem` |
| Continuation | `--bf-component-inline-inset-continuation` | `2rem` | `1.875rem` | `1.875rem` | `1.25rem` |

Every tier authors `inlineUnitRem: 0.25` plus whole counts in
`inlineInsetFieldUnits` and `inlineInsetActionUnits`. The continuation inset is
derived from the field inset, body-sized icon slot, and mark gap. Generated
token JSON exposes all three insets.

Page margins, grid gutters, structural navigation placement, and surface padding
are not component insets. A border, icon, or mark may be compensated inside a
component, but author-visible text must resolve its first glyph to one of the
three insets. Content with no meaningful text advance may instead use the
reviewed block-derived minimum described below.

## Product-tier inputs

| Fact | Editorial | Documentation | App | OS |
|---|---:|---:|---:|---:|
| Baseline | `0.5rem` | `0.25rem` | `0.25rem` | `0.25rem` |
| Body font | `1rem` | `0.875rem` | `0.875rem` | `0.75rem` |
| Body line | `1.5rem` | `1.25rem` | `1.25rem` | `1rem` |
| Border | `0.0625rem` | `0.0625rem` | `0.0625rem` | `0.0625rem` |
| Control visual | `1rem` | `0.875rem` | `0.875rem` | `0.75rem` |
| Field gap | `0.5rem` | `0.25rem` | `0.25rem` | `0.25rem` |
| Group gap | `1.5rem` | `1.25rem` | `1.25rem` | `1.5rem` |
| Pattern/section gap | `4.5rem` | `2.5rem` | `2.5rem` | `3rem` |
| Structural panel inline padding | `1rem` | `0.75rem` | `0.75rem` | `0.5rem` |
| Structural panel block padding | `1rem` | `0.75rem` | `0.75rem` | `0.5rem` |

All authored lengths are scalable `rem` values. Runtime pixel measurements
exist only in browser assertions because layout engines report computed
geometry in CSS pixels.

Horizontal component facts are independent of the vertical baseline. Each
built-in tier uses a `0.25rem` inline unit; surface padding, the three insets,
and mark/icon gaps are whole counts of it. `--bf-leading-mark-gap` is the
single icon/mark-to-label gap owner at `0.5rem`, `0.5rem`, `0.25rem`, and
`0.25rem`. `--bf-space-*` remains the vertical rhythm scale and is not used by
explicit inline padding, inline margins, inline offsets, or column gaps.

## Regular block contract

Every body-sized single-line interface uses the same metric-derived ledger:

```text
line            = body line
padding         = max(body start nudge - border, 0)
painted block   = line + 2 × padding + 2 × border
compensation    = distance from painted block to the next baseline multiple
occupied block  = painted block + compensation
content start   = border + padding
visual offset   = content start + (line - visual size) / 2
```

The corresponding variables are:

- `--bf-interface-row-line-height`
- `--bf-interface-row-padding-block`
- `--bf-interface-row-painted-block-size`
- `--bf-interface-row-compensation-block-end`
- `--bf-interface-row-occupied-block-size`
- `--bf-interface-row-content-offset-block-start`
- `--bf-interface-row-visual-offset`

Standalone controls paint their border box and carry compensation in their
block-end margin. Marginless hosts use the same occupied target but absorb the
compensation inside the box through `--bf-in-box-row-padding-block-start` and
`--bf-in-box-row-padding-block-end`. A table cell subtracts its real separator
once from its own block-end calculation.

There is no independent compact control scale and no authored target height.

Unboxed text is intentionally not expanded to that interface height. Paragraph
copy, links, labels, help, list text, and breadcrumbs have no component-owned
paint or target area; their box contains only the measured font start nudge,
line box, and trailing baseline compensation. A container, not the text role,
owns any semantic separation around it.

## Nested block contract

`is-nested` remains a compatibility contract for the named legacy table and
side-navigation hosts. It does not opt a component into density outside those
hosts.

The governed Site Table.Cell/Chip relationship is automatic. The versioned
policy in `src/component-density-policy.ts` names Editorial as the product,
`.bf-table td` as the provider, `.bf-chip` as the subscriber, and
`spacing.inset.control.block` as the bound role. Nested CSS scopes stop at the
nearest table cell and `.bf-theme` product root, so neutral descendants do not
break enrollment while nested tables and products resolve independently. A
Site provider selects the 4px dense member; its Chip uses that member directly
on both block edges, carries no compensation margin, and shares the host text
baseline. The host absorbs those two edges so its ordinary 40px row does not
grow. The same Chip remains on its 40px occupied seat outside the provider.

Two ledgers cover the only material paint cases:

| Nested paint | Members | Variables |
|---|---|---|
| Zero-footprint block edge | chip, status label, badge line | `--bf-nested-row-line-height`, `--bf-nested-row-padding-block`, `--bf-nested-row-painted-block-size` |
| Two real block borders | text/number/select input, bordered button, checkbox, radio | `--bf-nested-framed-row-padding-block`, `--bf-nested-framed-row-painted-block-size`, `--bf-nested-framed-row-visual-offset` |

The nested line is body line minus one active baseline. Both ledgers fit within
the host body line and contribute no external block margin. Build validation
rejects a tier when that designed line cannot contain its body font, control
visual, or two real block borders.

The modifier positively allowlists text, number, search, password, email, URL,
telephone, and select fields. It is intentionally unavailable to date/time,
textarea, file, colour, range, link-button, and multiline content. An
unsupported input cannot acquire nested geometry merely by adding the class.

## Component classification

| Component family | Inline inset | Block contract | Border/host rule |
|---|---|---|---|
| Text, number, select, search, password, email, URL, telephone | Field | Regular; framed nested when explicitly hosted | Real borders; select and number share one trailing `1rem` chevron canvas |
| Table header/body cell | Field | Regular in-box | Cell owns one separator subtraction |
| Status label | Field | Regular; zero-footprint nested | Nested status removes transparent block borders |
| Labelled button, segmented action, labelled previous/next pagination, file-selector button | Action | Regular; framed nested for real buttons | Bordered actions subtract their own inline border from the content padding |
| Chip | Action | Regular; governed Site Table.Cell density; legacy zero-footprint nesting in named hosts | The Action inset frames chip commands. A Site Table.Cell automatically binds its Chip to the 4px dense control-block member for a 32px box and absorbs those edges into the ordinary 40px row. Standalone Chips retain their regular occupied seat. Inset paint keeps the dense border out of layout. One-character chips remain stadiums; use a badge for a circular counter. |
| Badge, icon-only button, bare numbered pagination | Block-derived minimum | Each member's own painted block; nested re-points belong to badges, while icon-only buttons support regular and link-style paint | `--bf-square-block-size` follows paint, never occupied compensation; bordered nested icon-only buttons are excluded at the production selector because their icon canvas cannot fit the OS host line with padding and borders. Chip and badge alone may own pill/circle radius; button and pagination retain their existing radius. |
| Tab | Action | Regular in-box at block end | Active rule is paint and does not add height |
| Checkbox, radio, prose/list marks, validation | Continuation copy | Regular; framed nested for selection controls | Mark position is calculated backward from the continuation copy inset |
| Accordion, list tree, side-navigation copy, table of contents, notification | Continuation | Regular | Icon canvas and gap do not create another inset; TOC nesting adds only structural depth after the root inset |
| Reduced top navigation | Action | Regular in-box | Each command absorbs the complete occupied-row compensation; dropdown placement derives from that occupied row |
| Panel component content and tagged primary-navigation brand | Continuation | Region-owned | Panel exposes a local content-padding property; the tagged brand and navigation copy share the same start |
| Switch | Reviewed exception | Regular | Its wider track prevents reuse of the common mark canvas |
| Fieldset, modal regions, drawer chrome | Structural surface padding | Region-owned | Uses `--bf-panel-padding-inline`, not a component inset |
| Page, grid, navigation nesting | Structural layout | Layout-owned | Never folded into component padding |

The continuation-fit build guard uses the fixed `1rem` disclosure canvas plus
the active Canonical mark gap, not the smaller tier control visual. Docs and OS
sit exactly on that boundary, so a tighter continuation value fails before CSS
generation instead of silently reaching the `max(0rem, …)` placement clamp.
Notifications retain the tier leading-mark size and Canonical gap. Their 3px
accent is non-consuming paint; if that paint would oversubscribe the rail, only
the paint protrudes by the exact shortfall so it cannot overlap the icon.

## Reviewed compositions

Side-navigation lists preserve the same natural link paint and trailing
compensation as controls, but their grid tracks use the shared interface-row
token. The link is start-aligned inside each track so rasterised rem borders
do not stretch its text or paint; the track absorbs any subpixel remainder.
This keeps item-to-item baselines on one phase under browser zoom without
inventing a navigation-only height.

The replaced native color input composes through `bf-color-control`. Because a
color input has no body-text line box, the wrapper contributes an invisible
metric strut using the shared line, symmetric padding, rem border, and
trailing compensation; the native input stretches into that row. Composite
sliders use their paired numeric field as the occupied-row owner and stretch
the range track within it. These are explicit component compositions, not
audit-page height patches.

Canonical tagged navigation exposes one derived brand line centre: tag block
size minus the fixed mark-bottom offset and half the mark. Twice that centre is
the 3rem brand/header block. Brand titles and adjacent breadcrumbs align to the
same line without optical transforms; the fixed 2.375rem-by-1.375rem tag and
1rem mark geometry remain independent of the header's inline extension.

Side navigation is a panel-level composition. It owns the page-margin token on
both edges, then derives one label keyline from the start gutter, the tier body
icon size and the tier mark gap. Rows without icons reserve the same lane;
nested rows do not add depth. Title rows, group headings and the outer edge of a
real ContextSwitcher select all use that keyline, while the select retains the
field inset inside its box. The fixed Canonical tagged-brand anatomy is a
separate named mark and does not redefine the row icon slot.

Grouped side navigation keeps three explicit block-spacing owners. The outer
`bf-side-navigation-groups` container uses the governed group gap;
`bf-side-navigation-group` uses the governed item gap from its header to its
list; and `bf-side-navigation-group-header` keeps a real compensated `hr` and
its H6-styled heading tight. The rule begins on the label keyline and ends at
the opposing page-margin gutter. A single-line heading's minimum plus its
metric compensation closes on the active baseline grid; longer headings may
still wrap and grow.

The selected row keeps its background across the full panel and paints a 3px
indicator in the start gutter without changing row geometry. Forced-colors
mode replaces the filled indicator with an out-of-flow one-sided system-color
border.

Plain and middot inline lists share one fixed `0.5rem` inline-composition space.
The middot modifier uses a wrapping flex row so HTML source whitespace cannot
become a third, font-dependent spacing owner; items contribute no trailing
margin. The dot's logical start margin and the row's logical column gap mirror
one another, while `align-items: baseline` preserves mixed-height text
alignment. The half-rem value is a provisional component-local horizontal fact
recorded for replacement by Spec 020's canonical spacing vocabulary.
the same contract in RTL.

## Ownership and cascade

`src/css-component-contracts.ts` is the single owner of component input
emission and the derived regular, in-box, nested, and leading-mark ledgers.
Individual component modules consume those outputs. Component-specific aliases
remain only where the component has a real extra responsibility, such as a
table separator or slider track.

The cascade order is:

1. a product-tier scope supplies input facts;
2. the shared contract derives geometry;
3. a component consumes the contract;
4. a state modifier changes state, not product-tier metrics.

App-specific CSS owns application chrome only. It does not copy body
typography onto leaf components and contains no restorative nested selectors.
Direct tier bundles and class-scoped tier surfaces therefore use the same
formulas.

## Authoring rule

For a new component:

1. choose Field, Action, or Continuation for every author-visible first glyph;
2. use block-derived inline geometry only for reviewed content with no
   meaningful text advance, and map the member's own painted block rather than
   a shared occupied-block ledger;
3. classify its block behavior as regular, regular in-box, or explicitly
   nested;
4. account for every painted border exactly once;
5. keep structural layout offsets outside the component inset;
6. add a computed browser assertion if the component introduces a new host or
   border composition.

A new shared inset, density scale, target height, or tier-owned leaf override
requires an architecture decision. Numeric resemblance is not sufficient.

Inline `.bf-icon` paint aligns to the font's cap-height centre, not the line-box
bottom. `--bf-inline-icon-baseline-shift` derives the default placement from
`1cap`, the default icon size, and half the scalable border as an optical lift;
size modifiers add the difference between their active size and that default.
The default icon trims one scalable border from its block-start layout margin
so a raster edge cannot grow the compact body line, while larger icons reserve
their full painted block. Sortable-table chevrons reuse the default metric and
trim. Flex, grid, and positioned component owners explicitly neutralize the
inline trim and retain their own cross-axis placement. Absolutely positioned
leading marks keep their separate `--bf-leading-icon-offset` row contract.

Icon-only buttons extend their pointer target, not their paint, to at least
24-by-24 CSS pixels with an out-of-flow pseudo-element. The `24px` value is the
normative unit used by WCAG 2.2 success criterion 2.5.8, not a design-system
spacing token. It does not change the control's block size, occupied geometry,
or token-derived painted square.

An out-of-flow target still needs layout clearance. Each supported icon-only
button derives its own per-edge overflow from the same normative minimum and
reserves that space with `margin-inline`. The allowance therefore travels with
the target through `.bf-actions`, `.bf-cluster`, and other non-clipping
compositions without itself mutating a container gap token, and no container
infers geometry through `:has()`; the separate wrapping floor below can still
win in computed layout.

The built-in wrapping primitives, `.bf-actions` and `.bf-cluster`,
automatically apply a baseline-rounded `row-gap` floor. This prevents adjacent
target extensions from touching or overlapping without moving child paint or
changing a single-row footprint. It is unconditional behavior of containers
that already declare wrapping, not a consumer-selectable modifier and not
geometry inferred through `:has()`. Supporting engines round the exact
shortfall up to the active baseline; the conservative fallback uses one
baseline. Because the rule is deliberately descendant-agnostic, the floor can
exceed the authored gap in a wrapped container with no icon target; the current
demo impact is two multi-row OS form-atlas clusters whose row gap rises from
8px to 12px.

`.bf-actions.is-nowrap` declares its own horizontal scrollport. A direct
icon-only target inside it therefore owns symmetric, baseline-rounded
`margin-block` clearance; its existing `margin-inline` supplies the logical-edge
scroll extent. Text-only nowrap strips receive no padding, retain their leading
keyline, and keep their original block size. Supporting engines resolve the
per-edge block allowance to zero in Editorial and one complete baseline in
Documentation, App, and OS; the fallback uses one safe baseline in every tier.
Exact rounding is deliberately uncapped for custom configurations. No public
wrap or scrollport opt-in class is exposed. `.bf-cluster.is-nowrap` is neither
a clipping scrollport nor covered by the block-margin rule; any future clipping
owner outside `.bf-actions.is-nowrap` must provide and verify its own block
containment.

## Removed contracts

The migration intentionally removes the former padding/box aliases and the two
nested sub-scales:

```text
--bf-control-block-padding
--bf-control-block-padding-compact
--bf-control-box-size
--bf-control-box-size-compact
--bf-control-inline-padding
--bf-input-block-padding
--bf-button-block-padding
--bf-single-line-row-*
--bf-nested-auxiliary-*
--bf-nested-control-*
```

Build validation asserts that these names do not reappear in generated CSS.

## Verification

Required evidence covers all four product tiers, light and dark themes, direct
and class-scoped bundles, wide and constrained viewports, root-font scaling,
and non-100% browser zoom. The browser checks compare:

- first-glyph starts for Field, Action, and Continuation members;
- painted, compensated, and occupied regular rows;
- in-box table/menu rows with separators counted once;
- nested children against their host body line;
- number/select trailing artwork and truncation; and
- tagged brand, navigation, panel, disclosure, mark, and notification starts;
- rejected nested input and link-button cases; and
- circles, stadium overflow, square icon actions, and bare numbered pagination
  against each member's painted block; and
- a non-100% Chromium page-scale context in addition to root-font scaling.

The horizontal and vertical spacing demos are inspection surfaces. Their local
CSS may reveal guides, overflow, and measured ends, but may not alter component
geometry.
