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
| Field | `--bf-component-inline-inset-field` | `0.5rem` | `0.5rem` | `0.25rem` | `0.25rem` |
| Action | `--bf-component-inline-inset-action` | `1rem` | `1rem` | `1rem` | `1rem` |
| Continuation | `--bf-component-inline-inset-continuation` | `2rem` | `2rem` | `2rem` | `2rem` |

The config keys are `inlineInsetFieldRem`, `inlineInsetActionRem`, and
`inlineInsetContinuationRem`. Generated token JSON exposes
`inlineInsetField`, `inlineInsetAction`, and `inlineInsetContinuation`.

Page margins, grid gutters, navigation depth, and structural surface padding
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
| Control visual | `1rem` | `0.875rem` | `1rem` | `0.75rem` |
| Field gap | `0.5rem` | `0.5rem` | `0.5rem` | `0.25rem` |
| Structural panel inline padding | `1rem` | `1rem` | `0.75rem` | `0.5rem` |
| Structural panel block padding | `1rem` | `1rem` | `0.75rem` | `0.5rem` |

All authored lengths are scalable `rem` values. Runtime pixel measurements
exist only in browser assertions because layout engines report computed
geometry in CSS pixels.

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

`is-nested` is an explicit composition contract for a child placed inside a
host-owned body line. It is never inferred from ancestry.

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
| Chip | Field plus block-derived minimum | Regular; zero-footprint nested | The Field inset keeps chip text on the shared glyph keyline; regular chips subtract their real border, while nested chips retain the full inset because their border is inset paint. `--bf-square-block-size` prevents a short chip becoming narrower than its own painted block. Documentation standalone and Editorial/Documentation nested one-character chips are slight stadiums; use a badge for a circular counter. |
| Badge, icon-only button, bare numbered pagination | Block-derived minimum | Each member's own painted block; nested re-points belong to chips and badges, while icon-only buttons support regular and link-style paint | `--bf-square-block-size` follows paint, never occupied compensation; bordered nested icon-only buttons are excluded at the production selector because their icon canvas cannot fit the OS host line with padding and borders. Chip and badge alone may own pill/circle radius; button and pagination retain their existing radius. |
| Tab | Action | Regular in-box at block end | Active rule is paint and does not add height |
| Checkbox, radio, prose/list marks, validation | Continuation copy | Regular; framed nested for selection controls | Mark position is calculated backward from the continuation copy inset |
| Accordion, list tree, side-navigation copy, table of contents, notification | Continuation | Regular | Icon canvas and gap do not create another inset; TOC nesting adds only structural depth after the root inset |
| Reduced top navigation | Action | Regular in-box | Each command absorbs the complete occupied-row compensation; dropdown placement derives from that occupied row |
| Panel component content and tagged primary-navigation brand | Continuation | Region-owned | Panel exposes a local content-padding property; the tagged brand and navigation copy share the same start |
| Switch | Reviewed exception | Regular | Its wider track prevents reuse of the common mark canvas |
| Fieldset, modal regions, drawer chrome | Structural surface padding | Region-owned | Uses `--bf-panel-padding-inline`, not a component inset |
| Page, grid, navigation nesting | Structural layout | Layout-owned | Never folded into component padding |

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

Grouped side navigation uses three explicit spacing owners. The outer
`bf-side-navigation-groups` container separates complete groups;
`bf-side-navigation-group` owns the fixed 0.5rem transition from its header to
its list; and `bf-side-navigation-group-header` keeps a real compensated `hr`
and its H6-styled heading tight. The rule begins on the continuation text inset
and stretches to the navigation end edge. Rules never come from list pseudo-
elements, and their one-half-rem occupied block must not shift later headings
off the active baseline phase. A single-line group heading reserves four
baselines through a minimum block size; longer headings may still wrap and
grow, while the common case cannot accumulate fractional font-box drift.

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

Icon-only buttons extend their pointer target, not their paint, to at least
24-by-24 CSS pixels with an out-of-flow pseudo-element. The `24px` value is the
normative unit used by WCAG 2.2 success criterion 2.5.8, not a design-system
spacing token. It does not change the control's block size, occupied geometry,
or token-derived painted square.

An out-of-flow target still needs container-owned clearance. A `.bf-actions`
group containing link-style icon buttons derives the target overflow from that
same normative minimum and leaves one border width of positive clearance
between adjacent targets. This changes only the OS icon-link group gap, from
the normal 0.25rem Field gap to 0.5625rem. The `is-nowrap` form also reserves
the transparent overflow as scrollport padding because a scrolling overflow
container otherwise clips positioned descendants. These are supported
composition rules, not target block sizes or changes to control paint.

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
