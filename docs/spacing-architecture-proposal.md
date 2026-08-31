# Horizontal and vertical spacing architecture proposal

Status: proposal for owner review. This document does not change the public
contract or accept the migration described below.

## Outcome

Baseline Foundry should have three component-owned inline rails and one
metric-derived occupied-block contract. Components choose a contract; they do
not calculate local padding. Borders, separators, and inset-painted rules are
inputs to those contracts, not corrections applied after layout.

The current implementation has the right measured ingredients, but it is not
yet a clean final architecture. In particular:

1. the app-tier preset restates component typography broadly, then restores
   nested line heights later in the cascade;
2. the metric-derived single-line row and the older regular/compact control
   padding scale are both active;
3. shared inputs, derived geometry, and component-specific variables are
   emitted from one large block in `src/css-components.ts`;
4. the continuation rail is derived from disclosure icon geometry, although
   disclosure is only one consumer of that rail; and
5. validation often asserts generated CSS fragments rather than the computed
   contract a component must satisfy.

The branch is functionally green, but those findings should be resolved before
calling the spacing system architecturally complete.

## Review findings

| Priority | Finding | Evidence | Required direction |
|---|---|---|---|
| High | Tier CSS repairs an earlier tier override | `src/css-app-tier.ts` applies a body line height to a broad selector list, then applies `--bf-nested-auxiliary-line-height` and `--bf-nested-control-line-height` to later selector lists | A tier sets tokens at its scope. A component rule consumes those tokens once. Remove tier-owned leaf-component typography selectors and the restorative rules they require. |
| High | Two vertical sizing systems coexist | The metric row uses `--bf-single-line-row-*`; textarea, pagination truncation, document navigation, panels, cards, and search still use `--bf-control-block-padding(-compact)` or `--bf-control-box-size(-compact)` | Migrate each remaining consumer to a named metric, row, or surface contract, then remove the old config fields and emitted variables. |
| High | The shared variable block mixes architectural layers | `componentAlignmentVars()` emits config inputs; the root component block adds shared formulas, navigation geometry, application widths, authoring colours, and component internals | Emit tier inputs, shared contracts, and component-local variables from separate owners. `src/css-components.ts` should assemble modules, not own unrelated component geometry. |
| High | A primary rail is derived from one component | `--bf-component-inline-inset-continuation` aliases a disclosure label offset, which is icon size plus disclosure gap | Make field, action, and continuation first-class tier inputs. Disclosure, marks, navigation, and notifications derive their placement from the continuation rail. |
| Medium | Nested auxiliary and interactive geometry are parallel implementations | Chips/status use a capped auxiliary padding; controls use a separate border-aware formula. In Documentation and App, nested chip paint is `1.03rem` while nested controls fill the `1.25rem` host line | Use one nested-in-row formula with a component-supplied minimum line and real border footprint. Chip/status paint should fill the host line; a badge may remain a centred counter. |
| Medium | Some component geometry still uses raw space tokens | Ordered-list marker reserves, nested-list depth, navigation depth, top-navigation slots, and some panel relationships use direct `--bf-space-*` arithmetic | Keep genuinely structural depth and region spacing, but give each relationship a semantic owner. A raw space token must never create an unrecorded component text rail. |
| Medium | Static tests know serialization more strongly than semantics | `scripts/validate-build.ts` contains many `css.includes()` checks for exact declaration strings and explicitly tests the app-tier restoration rules | Add a computed contract matrix. Keep small serialization tests only for public selector and token presence. |

### Foundations worth retaining

- All dimensional values are rem-based. The baseline remains responsive to the
  root font size and browser zoom.
- Field, action, and continuation are already the accepted horizontal families.
- The Vanilla occupied-block model correctly separates painted size from
  trailing baseline compensation.
- Tables already reserve their real separator inside a host-owned row.
- `is-nested` is explicit rather than inferred with ancestry or `:has()`.
- The focused `src/css-components/nested-controls.ts` module is a better
  ownership boundary than adding table-row overrides.

### The parallel scale is materially different

The old variables do not merely give the metric row another name:

| Tier | Metric occupied row | Old regular box | Old compact box |
|---|---:|---:|---:|
| Editorial | `2.5rem` | `2.5rem` | `2rem` |
| Documentation | `1.5rem` | `2.25rem` | `2rem` |
| App | `1.5rem` | `2.25rem` | `2rem` |
| OS | `1.5rem` | `1.75rem` | `1.5rem` |

The coincidental matches in Editorial regular and OS compact do not make the
models equivalent. Current source consumers that need an explicit migration
decision are:

| Existing consumer | Current old token use | Required classification |
|---|---|---|
| Textarea | two regular boxes | Multiline row-count/minimum contract |
| Pagination truncation and icon minimum | regular box/padding | Normal interface row or centred action slot |
| In-page/article/top navigation | compact box/padding | Normal row, metric text, or named navigation shell relationship |
| Panel footer/dropdown controls | compact box/padding | Child interface row plus region-owned panel padding |
| Option/card minimum | two regular boxes plus baseline | Content/surface minimum expressed through its actual child rows |
| Search-and-filter minimum | regular box | Normal interface row or composition-owned minimum |
| Legacy navigation control | compact box | Normal interface row |

No replacement should be chosen by numeric resemblance. Each consumer must be
classified by ownership first.

## Horizontal strategy

### The three rails

The three rails are component content starts measured from the component's
outer inline edge. Page margin, grid gutter, surface placement, and navigation
depth are structural offsets and are added outside this contract.

| Rail | Editorial | Documentation | App | OS | Meaning |
|---|---:|---:|---:|---:|---|
| Field | `0.5rem` | `0.5rem` | `0.25rem` | `0.25rem` | Compact field, cell, chip, and status content |
| Action | `1rem` | `1rem` | `1rem` | `1rem` | Command and tab label content |
| Continuation | `2rem` | `2rem` | `2rem` | `2rem` | Copy after a mark, disclosure, icon, or bounded-region edge |

Recommended authoritative config names:

```text
components.componentInlineInsetFieldRem
components.componentInlineInsetActionRem
components.componentInlineInsetContinuationRem
```

Recommended emitted variables:

```css
--bf-component-inline-inset-field
--bf-component-inline-inset-action
--bf-component-inline-inset-continuation
```

The existing `controlInlinePaddingFieldRem` and
`controlInlinePaddingActionRem` can be compatibility inputs for one migration
window. The continuation value should no longer be inferred from disclosure
icon size and gap.

### Horizontal component matrix

“Border compensation” means that the content rail is measured from the outer
border edge. A `0.0625rem` inline-start border therefore leaves `0.9375rem` of
physical action padding while the glyph still starts at `1rem`.

| Component family | Content rail | Values E / D / A / OS | Border or mark treatment | Source owner after migration |
|---|---|---|---|---|
| Text, search, password, email, URL, number, select | Field | `.5 / .5 / .25 / .25rem` | Block borders do not alter the inline rail; trailing icons reserve a named end slot | `fields.ts` |
| Textarea | Field | `.5 / .5 / .25 / .25rem` | Same inline contract as fields; multiline block size is separate | `fields.ts` |
| Form label and help | Zero/unboxed | `0 / 0 / 0 / 0rem` | Metric text; its field wrapper owns vertical gaps | `fields.ts` |
| Ordinary table header/body cell | Field | `.5 / .5 / .25 / .25rem` | Bottom separator is block-axis only | `table.ts` |
| Table icon-placeholder cell | Field plus reserved slot | field rail, then mark size and gap | Reserved icon slot continues from field; it is not a new global rail | `table.ts` |
| Choice row | Field | `.5 / .5 / .25 / .25rem` | Outer inline border is compensated if first glyph, rather than the radio canvas, is audited | `choice.ts` |
| Chip and status label | Field | `.5 / .5 / .25 / .25rem` | Real chip border is subtracted from padding; transparent status frame occupies the same slot | `chip-badge-status.ts` |
| Button, segmented command, pagination command | Action | `1 / 1 / 1 / 1rem` | Real inline border is subtracted from physical padding | `button-actions.ts`, command owner |
| Tab | Action | `1 / 1 / 1 / 1rem` | Transparent block border and active inset rule do not alter the inline rail | `tabs-choice-breadcrumbs.ts` |
| File-selector button | Action | `1 / 1 / 1 / 1rem` | Selector button owns one border; the file-input host must not add its padding again | `fields.ts` |
| Checkbox, radio, prose/list mark, validation marker | Continuation copy | `2 / 2 / 2 / 2rem` | Mark start is calculated backward from copy: continuation minus mark size minus field gap | `selection.ts`, `list.ts` |
| Accordion, list tree, side navigation, TOC | Continuation copy | `2 / 2 / 2 / 2rem` | Icon/disclosure canvas is calculated backward; navigation depth is then added separately | navigation/disclosure modules |
| Contextual-menu command | Action | `1 / 1 / 1 / 1rem` | Uses in-box block compensation but the action inline rail | command/menu owner |
| Top-navigation command | Action plus structural slots | `1 / 1 / 1 / 1rem` before named destination slots | Logo, search, and chevron slots are component structure, not another text rail | top-navigation owner |
| In-page navigation and article pagination | Action or continuation after classification | rail value plus named navigation depth | Replace raw `--bf-space-*` content starts with semantic base/depth aliases | document-navigation owners |
| Notification and bounded-region copy | Continuation | `2 / 2 / 2 / 2rem` | Shell border and region placement do not authorize another text rail | `interactive-feedback.ts`, surface owner |
| Panel, fieldset, modal, drawer content | Continuation | `2 / 2 / 2 / 2rem` | The region may also own separate block padding | surface modules |
| Badge | Centred exception | n/a | Counter geometry is symmetric and has no first-glyph rail | `chip-badge-status.ts` |
| Icon-only control | Centred exception | n/a | Uses action-family occupied height but no text rail | action owner |
| Plain paragraph/link/breadcrumb | Zero/unboxed | `0 / 0 / 0 / 0rem` | Metric nudge only; an owning container supplies placement | typography/navigation owner |
| Unmarked list copy | Zero/unboxed | `0 / 0 / 0 / 0rem` | List container indentation is structural; marked variants place copy on continuation | prose/list owner |
| Switch | Recorded exception | label starts at `2.5 / 2 / 2.25 / 1.75rem` with current track sizes | Track is `2 × visual size`, then field gap; do not disguise it as continuation | `selection.ts` |
| Page, grid, navigation nesting | Structural | tier/layout values | Added outside component rail; never folded into component padding | layout/navigation owner |

The leading-mark start implied by the current values is:

| Tier | Continuation | Mark size | Mark-to-copy gap | Mark start |
|---|---:|---:|---:|---:|
| Editorial | `2rem` | `1rem` | `0.5rem` | `0.5rem` |
| Documentation | `2rem` | `0.875rem` | `0.5rem` | `0.625rem` |
| App | `2rem` | `1rem` | `0.25rem` | `0.75rem` |
| OS | `2rem` | `0.75rem` | `0.25rem` | `1rem` |

That back-calculation is the correct pattern: the copy rail is authoritative;
the mark does not create a fourth inset.

## Vertical strategy

### Distinguish three sizes

Every single-line component review must name all three:

1. **painted block**: line box, block padding, and layout-affecting borders;
2. **trailing compensation**: the unpainted remainder that returns the next
   sibling to the baseline grid; and
3. **occupied block**: painted block plus trailing compensation.

Comparing only `getBoundingClientRect().height` misses margin compensation.
Comparing only row-to-row baselines can hide asymmetric padding. Both must be
tested.

For a normal two-sided framed interface row:

```text
padding = max(0, body nudge start - border)
painted = body line + 2 × padding + 2 × border
compensation = mod(baseline - mod(painted, baseline), baseline)
occupied = painted + compensation
```

Transparent frame borders count exactly like visible borders. Focus outlines
and inset box shadows do not participate in layout.

### Current normal row values

| Tier | Body line | Nudge | Border each edge | Symmetric padding | Painted | Compensation | Occupied |
|---|---:|---:|---:|---:|---:|---:|---:|
| Editorial | `1.5rem` | `0.41rem` | `0.0625rem` | `0.3475rem` | `2.32rem` | `0.18rem` | `2.5rem` |
| Documentation | `1.25rem` | `0.0775rem` | `0.0625rem` | `0.015rem` | `1.405rem` | `0.095rem` | `1.5rem` |
| App | `1.25rem` | `0.0775rem` | `0.0625rem` | `0.015rem` | `1.405rem` | `0.095rem` | `1.5rem` |
| OS | `1rem` | `0.245rem` | `0.0625rem` | `0.1825rem` | `1.49rem` | `0.01rem` | `1.5rem` |

### Host-owned in-box rows

Tables and menu rows cannot use an external trailing margin. They retain the
same occupied target but move the remainder inside the host:

```text
padding start = body nudge start
padding end = occupied - body line - padding start - separator
```

| Tier | Start padding | Body line | End padding | Separator | Row occupied |
|---|---:|---:|---:|---:|---:|
| Editorial | `0.41rem` | `1.5rem` | `0.5275rem` | `0.0625rem` | `2.5rem` |
| Documentation | `0.0775rem` | `1.25rem` | `0.11rem` | `0.0625rem` | `1.5rem` |
| App | `0.0775rem` | `1.25rem` | `0.11rem` | `0.0625rem` | `1.5rem` |
| OS | `0.245rem` | `1rem` | `0.1925rem` | `0.0625rem` | `1.5rem` |

This asymmetry is intentional: the first baseline remains metric-correct and
the separator is explicitly paid for at the end.

### Proposed nested-in-row contract

The host owns the normal occupied row. A nested child must fit its complete
paint inside the host's body line and must contribute no trailing margin.

```text
nested line = max(body font, body line - baseline, component visual floor)
nested padding = max(0, (host body line - nested line
                         - real start border - real end border) / 2)
nested painted = nested line + 2 × nested padding + real borders
```

`component visual floor` is zero for chip/status and the control visual size
for an input, button, checkbox, or radio. An inset-painted border has zero
layout footprint. This single formula replaces separate auxiliary and control
padding families.

| Nested family | E line / pad / paint | D line / pad / paint | A line / pad / paint | OS line / pad / paint |
|---|---|---|---|---|
| Chip or status; inset/zero-footprint border | `1 / .25 / 1.5rem` | `1 / .125 / 1.25rem` | `1 / .125 / 1.25rem` | `.75 / .125 / 1rem` |
| Input, button, checkbox, radio; two real borders | `1 / .1875 / 1.5rem` | `1 / .0625 / 1.25rem` | `1 / .0625 / 1.25rem` | `.75 / .0625 / 1rem` |
| Badge | centred within parent line | centred within parent line | centred within parent line | centred within parent line |

This changes Documentation/App nested chip padding from the current `0.015rem`
cap to `0.125rem`. That is a deliberate consolidation proposal: every nested
painted surface fills the host line instead of introducing a visually
unexplained `1.03rem` box.

### Vertical component matrix

| Component family | Standalone block contract | Nested contract | Border compensation |
|---|---|---|---|
| Text/number/select/search input | Normal occupied row | Nested-in-row with real two-edge frame | Both block border slots are subtracted from symmetric padding |
| File input | Host row plus selector-button child | Not yet proposed | One field rule and one button frame; no doubled host padding |
| Color input | Metric strut owns normal row | Not yet proposed | Native control stretches inside strut |
| Button/icon button/segmented/pagination | Normal occupied row | Nested-in-row where a host explicitly owns the row | Real borders; inline content rail also subtracts start border |
| Tab | Normal occupied row | Badge may be nested inside | Trailing compensation moves into end padding; active inset rule adds no size |
| Checkbox/radio/switch/validation | Transparent-framed normal row | Checkbox/radio may use nested-in-row | Transparent block frame preserves shared paint geometry |
| Slider/range | Paired field owns occupied row | Host-specific composition | Track offset derives from the same metric visual offset |
| Chip/status | Normal occupied row | Proposed unified nested-in-row | Real/transparent standalone frame; zero-footprint nested frame |
| Badge | Body-line centred counter | Centred counter | No layout border |
| Accordion/list tree/side navigation/TOC | Normal occupied row; navigation track may own raster remainder | Nested auxiliaries may be children | Transparent frame where needed; depth is unrelated |
| Table cell/context menu command | Host-owned in-box row | Host for explicit nested children | Separator is subtracted once from end padding |
| Paragraph/link/label/help/breadcrumb | Unboxed metric text | n/a | No frame or target size |
| Textarea and other multiline fields | Content-driven multiline contract | Excluded initially | Must not reuse the legacy control-box token without a named row-count rule |
| Panel/card/notification/modal/drawer | Region-owned padding and child stack | Host only when it explicitly defines a single-line slot | Region borders are paid for by the region, never by a child |

Metric body text occupies body line plus one baseline of nudge compensation:
`2rem` Editorial, `1.5rem` Documentation/App, and `1.25rem` OS. It is a
reference, not an interface target.

## Border compensation ledger

| Border form | Layout footprint | Contract rule |
|---|---:|---|
| Normal bordered control | `0.0625rem` at each block edge | Subtract each edge from the intended nudge/padding; include both in painted size |
| Field with transparent top and visible bottom rule | Two `0.0625rem` slots | Treat identically to a two-sided frame for vertical geometry |
| Transparent selection/navigation frame | Two `0.0625rem` slots | Preserves the normal row without visible chrome |
| Table separator | One `0.0625rem` end edge | Subtract once from in-box end padding |
| Tab active emphasis | Inset shadow | Zero layout footprint; compensation remains in tab end padding |
| Nested chip inset border | Inset shadow | Zero layout footprint; nested padding may use the entire residual |
| Focus outline | Outline | Zero layout footprint; test clipping separately |
| Segmented shared inline edge | Real border plus negative sibling overlap | Inline overlap must not change the first-glyph rail or block formula |
| Side-navigation group rule | Real standalone rule | Rule wrapper owns its baseline compensation; it must not be charged to the heading or list row |

Every new framed component must declare which row of this ledger it uses.
“Looks one pixel off” is not a valid reason for an unowned offset.

## Proposed CSS variable architecture

### Layer 1: tier inputs

Only config-selected facts belong here:

```css
--bf-baseline
--bf-body-font-size
--bf-body-line-height
--bf-body-nudge-start
--bf-border-width
--bf-control-visual-size
--bf-component-inline-inset-field
--bf-component-inline-inset-action
--bf-component-inline-inset-continuation
--bf-field-gap
--bf-panel-padding-inline
--bf-panel-padding-block
```

### Layer 2: shared derived contracts

One focused owner derives reusable geometry:

```css
--bf-interface-row-line-height
--bf-interface-row-padding-block
--bf-interface-row-paint-block-size
--bf-interface-row-compensation-block-end
--bf-interface-row-occupied-block-size
--bf-interface-row-visual-offset

--bf-leading-mark-inline-size
--bf-leading-mark-gap
--bf-leading-mark-group-inset
--bf-leading-mark-content-offset

--bf-in-box-row-padding-block-start
--bf-in-box-row-padding-block-end

--bf-nested-row-line-height
--bf-nested-row-padding-block
--bf-nested-row-paint-block-size
```

The nested line and padding need component-local inputs for minimum visual size
and real border footprint. They should not be two global “auxiliary” and
“control” scales.

### Layer 3: component aliases

A component may alias a contract for readability, but it must not recalculate
it:

```css
--bf-table-row-block-size: var(--bf-interface-row-occupied-block-size);
--bf-slider-row-block-size: var(--bf-interface-row-occupied-block-size);
--bf-side-navigation-row-block-size: var(--bf-interface-row-occupied-block-size);
```

Component-only details such as select end slots, switch track width, or tagged
logo geometry stay in their owning module. Application drawer widths and
authoring colours do not belong in the component spacing contract block.

### Remove after migration

```css
--bf-control-block-padding
--bf-control-block-padding-compact
--bf-control-box-size
--bf-control-box-size-compact
--bf-nested-auxiliary-*
--bf-nested-control-*
```

The first four encode a second density model. The final two families collapse
into the single nested-in-row contract. Compatibility aliases may be emitted
temporarily, but no source component may continue consuming them.

## Proposed source structure

```text
src/
  css-component-contracts.ts       tier aliases and shared derived geometry
  css-components.ts                ordered assembly and remaining legacy ports
  css-components/
    fields.ts                      inputs, select, number, file, color
    selection.ts                   checkbox, radio, switch, choice
    interface-row.ts               reusable TS declaration helpers only
    nested-composition.ts          explicit is-nested modifier
    chip-badge-status.ts
    table.ts
    tabs-choice-breadcrumbs.ts
    ...focused navigation/surface modules
  css-app-tier.ts                  scoped tier variables and app chrome only
```

`css-app-tier.ts` must not enumerate leaf components to restate typography.
The body-sized component modules should consume a shared component line-height
variable. `is-nested` changes that local component variable through its own
modifier rule; a tier never repairs it.

The TypeScript helper layer should emit small, explicit declaration sets for:

- a natural margin-compensated interface row;
- an in-box compensated row; and
- a nested child inside a host-owned row.

Helpers must not emit selectors or create a hidden inheritance dependency.
Each component module remains visibly responsible for opting into a contract.

## Migration sequence

1. **Add computed contract tests first.** For four tiers and two tones, record
   first-glyph inset, painted block, compensation, occupied block, first text
   baseline, border footprint, and nested host overflow.
2. **Promote the three rails to config inputs.** Preserve current numeric
   values and emit compatibility aliases for old field/action names.
3. **Introduce the focused contract module.** Keep generated output equivalent
   for normal controls and in-box rows.
4. **Remove app-tier leaf overrides.** Components consume tier variables once;
   delete the tests that require restoration selectors.
5. **Migrate legacy block-size consumers.** Pagination truncation, document
   navigation, panels, cards, search, and textarea each choose a named row,
   region, or multiline contract.
6. **Unify nested geometry.** Move chip/status and interactive controls to the
   single nested-in-row formula; verify nested badge-in-chip separately.
7. **Delete the old padding scale.** Remove config fields, types, manifest
   entries, CSS variables, and exact-string assertions only when no source
   consumer remains.
8. **Split remaining cohesive families from `css-components.ts`.** Move code,
   do not restyle during the move.
9. **Run visual and computed QA.** Review direct spacing routes with normal
   shared chrome in light/dark, all tiers, root-font zoom, and browser zoom.

No migration phase should be merged with failing computed geometry or a demo
that depends on local audit-page CSS to align production components.

## Acceptance gates

- Every content-bearing component maps to field, action, continuation, or a
  documented centred/structural exception.
- Every single-line component maps to normal, in-box, nested, or unboxed text.
- No component source consumes the old regular/compact control padding scale.
- No tier stylesheet contains a leaf-component “restore” selector.
- Borders and separators appear exactly once in each painted-size equation.
- Normal occupied rows equal `2.5rem` Editorial and `1.5rem` in the other three
  tiers with the current metrics.
- Nested painted controls equal the host body line and do not enlarge table,
  tab, chip, or navigation rows.
- Table separators, active tab rules, focus outlines, and inset chip borders do
  not create baseline drift.
- Horizontal computed tests assert first-glyph positions, not just padding
  declarations.
- Browser QA covers light/dark, all four tiers, resize, tier change, root font
  size change, and at least two non-100% zoom levels.
- The direct audit pages use shipped component markup and no geometry patches.

## Owner decisions requested

The proposal recommends these answers:

1. **Make continuation a first-class tier input?** Yes; keep its present `2rem`
   value in all tiers until measured evidence supports a change.
2. **Fill the host body line for nested chip/status paint?** Yes; this removes
   the unexplained Documentation/App `1.03rem` auxiliary box.
3. **Keep a general compact density scale?** No. Keep explicit `is-nested` only
   for composition inside a host-owned row.
4. **Retain the switch exception?** Yes, but record its measured label start and
   do not count it as a fourth shared rail.
5. **Remove old variables immediately?** Migrate consumers first, then remove
   them together from config, types, manifests, CSS, tests, and documentation.
