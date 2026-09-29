# T009 taxonomy merge and breaker ledger

This ledger tests the candidate set against FR-042: equal values do not justify
a merge; two relationships merge only when changing one should change the
other. Counts come from the frozen 169-row current-main inventory after the
T009 corrections.

## Candidate count

| Candidate | Rows with direct membership | Count status |
|---|---:|---|
| `spacing.inset.action.inline` | 17 | Component-supported |
| `spacing.inset.field.inline` | 29 | Component-supported |
| `spacing.inset.continuation.inline` | 2 | Component-supported |
| `spacing.inset.surface.inline` | 25 | Component-supported |
| `spacing.gap.mark.inline` | 36 | Component-supported |
| `spacing.gap.element.inline` | 9 | Component-supported; added by T009 |
| `spacing.inset.control.block` | 33 | Component-supported |
| `spacing.inset.surface.block` | 25 | Component-supported |
| `spacing.gap.element.block` | 20 | Component-supported |
| `spacing.gap.group.block` | 5 | Component-supported |
| `spacing.gap.pattern.block` | 0 | External page-section candidate |

The proposed count is therefore **10 component-supported roles plus one
externally owned page-section candidate**. It is not “11 component roles.”
The pattern candidate remains visible because FR-043 defines the page scale,
while FR-021 correctly keeps its owner outside the component denominator.

## Rejected merges

| Attempt | Disposition | Breaker |
|---|---|---|
| Action inset ↔ field inset | Reject | Icon+text Button composes field start, action end and mark internally. A field keyline change must not resize action breathing. |
| Action inset ↔ continuation inset | Reject | Button/Chip breathing is intrinsic to an action, while Accordion and SideNavigation ItemExpandable continuation inset tracks disclosure depth and may accumulate. Changing tree depth must not resize actions. |
| Action/field inset ↔ surface inset | Reject | Panels and sections need content breathing independent of controls and fields. Docs also currently breaks numerical equality, but semantics is decisive. |
| Continuation inset ↔ field/surface inset | Reject | Accordion content composes continuation at inline-start with surface at inline-end; SideNavigation ItemExpandable adds continuation to nested child rows while its summary keeps the field keyline. |
| Field inset ↔ mark gap | Reject | Field/mark values may coincide, but changing icon-to-label whitespace must not move a field's outside keyline. |
| Mark gap ↔ inline element gap | Reject | A marker/icon/caret and its copy are not peer actions/items. Card/Modal footer children and Range slider/number are the breaker set. |
| Control block inset ↔ surface block inset | Reject | A metric-seated control row and a panel edge solve different occupied-box constraints; ColorInput composes both. |
| Any inset ↔ any gap | Reject | Inner padding and separation between siblings are distinct relationships under FR-042a. |
| Element block gap ↔ group block gap | Reject | TokenTable and Form contain both at different nesting levels; changing local label/control rhythm must not change separation between complete field/section groups. |
| Group block gap ↔ pattern block gap | Reject | Form/Card grouping is component-owned; page-section rhythm has an external owner and a larger semantic boundary. |
| Axisless field/control/surface role | Reject | FileHeader has surface inline without surface block; field-inline-only and control-block-only rows prove the axes vary independently. |
| Element inline ↔ element block | Reject | The purpose level is shared, but logical axis is part of the contract; a two-value Choices gap proves they must resolve independently. |

## Accepted collapses

- Card, Tile, Modal, Tooltip, Popover content panels and similar inset-bearing
  framed owners share the surface roles. Their component names do not justify
  per-component tokens; full-bleed ContextualMenu frames are explicitly excluded.
- Button, Chip, Tabs and menu actions share action/control relationships where
  the same purpose is present. A zero edge or joined seam is a variant boundary,
  not another token.
- Legacy `section` merges into external `pattern`: both mean separation between
  complete page sections. The fixed Pragma `section` step is removed rather
  than retained between group and pattern.
- Default/deep/hero Section and Strip share the existing major page-section
  inset magnitude under FR-053a; they differ by applied edge. Shallow/framed
  Section remains the surface-inset breaker.
- “Nested” is a governed host-fit mode, not a spacing role. If a dense child
  still enlarges its host, FR-044a stops for a component-fit decision.

## T009 corrections to T006

- Added `spacing.gap.element.inline` for Card Footer, Modal Footer,
  RangeControl and Choices columns.
- Added `spacing.gap.mark.inline` to Tile Header and Tooltip icon/copy.
- Reclassified Choices rows from group to `element.block`: choices are adjacent
  elements inside one field unit.
- Reclassified SideNavigation root and Content section separation from element
  to `group.block`; the `display: contents` NavTree delegates row separation
  and nested continuation to its rendered child owners.
- Kept full-bleed Combobox List and ContextualMenu frames out of surface-inset
  membership: Combobox option rows carry action/control insets, while named
  ContextualMenu Item rows remain their existing owners.
- Recast Tooltip trigger distance as a placement magnitude/boundary because a
  tooltip can be positioned on either axis.
- Added SidePanel Header, Content and Footer to the surface roles without
  inventing an internal block gap; Header and Footer strengthen the inline
  peer-gap role.
- Kept the SidePanel root and `withSidePanel` as frame/nonvisual boundaries,
  and recorded title closure, section seams and the repeated compact icon-only
  close action as explicit owner decisions.

The machine inventory regenerates with 88 assigned rows, 81 boundary-only
rows, 201 distinct part-by-role memberships, no null disposition and exact
169-ID coverage.

## Still owner-facing at CP1

1. Confirm 10 component roles plus the external pattern candidate.
2. Confirm Site 1/3/8 versus Docs/App 1/4/8 baseline-unit group asymmetry.
3. Approve the proposed App 4/16/32 element/group/pattern sequence and removal
   of the legacy section alias; live provider source remains migration debt.
4. Choose Card, Modal and SidePanel section-seam ownership: deliberate
   composition of two surface insets or container-owned group separation.
5. Confirm that major overlays and compact cards/tooltips share one surface
   role, or admit a purpose-based major-overlay breaker.
6. Decide whether the repeated Modal/SidePanel icon-only close inset is a
   Button variant, an earned compact-action role or a bounded exception.
7. Decide the metric authority/bound requested by T011, including the observed
   Chromium `-1/64px` per closed text element.

The report's eight semantic exceptions keep those decisions visible; no merge
is inferred from current numerical equality.
