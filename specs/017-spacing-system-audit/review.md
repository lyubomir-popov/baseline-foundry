# Review: Spacing System Audit

Status: interim adversarial review after rule-native-markup and shared-split
slice; exhaustive adjacency work remains open.

## Review 1 — rule authoring and semantic API

- **Pass:** Bare `<hr>` now owns the generic separator contract. Pattern rule
  classes only provide structural placement, so `bf-divided-section-rule` is
  not competing with a generic visual class.
- **Pass:** `is-muted` was removed from rule markup because it had no selector;
  `is-highlighted` remains on semantic native rules and has a defined visual
  result.
- **Pass:** No active source or demo relies on `bf-rule`; the basic selector
  keeps the same background, thickness, reset, and trailing compensation.
- **Finding resolved:** The historical `bf-rule` API duplicated native
  semantics and created unnecessary class-pair variation.

## Review 2 — responsive composition

- **Pass:** Hero, basic section, divided section, tiered-list header, rich
  lists, tab section, and linked-logo 50/50 layouts use a 45rem query-container
  threshold.
- **Pass:** Visual inspection at a 47.5rem viewport produced a 43.5625rem tiered-list
  allocation that stayed one column; at 50rem it allocated 46.0625rem and became
  two columns with no overflow. The other reviewed shared-split surfaces also
  had no overflow at their 737–47rem expanded allocations.
- **Pass:** 25/75 rails, repeated-card density, navigation, and grid-shell
  transitions remain documented exceptions rather than accidental divergent
  50/50 implementations.

## Review 3 — source and test hygiene

- **Pass:** The generated CSS static gate passes 6,093 checks after the
  source-only changes.
- **Pass:** Existing global card `is-muted` uses were kept intact; only no-op
  rule modifiers were removed.
- **Pass:** The full component behavior suite passed after adding the
  constrained shared-split checks and scoping the rich-list CTA to its 50/50
  layout.
- **Pass:** Component baseline verification and `qa:components` screenshot
  capture completed across the full catalog with zero reported failures.
- **Open:** Full Spec 017 adversarial closeout is not claimed until T005–T016
  are complete.

## Review 4 — axis-specific audit surface

- **Pass:** The spacing overview now leads to distinct full-width horizontal
  and vertical audit routes. Neither route uses a hero or basic-section 50/50
  composition, so the raw components have the room needed for direct review.
- **Pass:** Every audit heading identifies exactly one axis and one variable or
  occupied-block family. Button/segmented/tab/pagination controls are in the
  horizontal action-inset family; they are not mixed with field insets.
- **Pass:** Accordion, list tree, switch, side navigation, TOC, and notification
  appear together in one icon-led/navigation review bucket. Table-cell content
  appears beside the field inset comparison. Page margin, grid gutter,
  navigation depth, and TOC nesting remain layout contracts rather than
  component-padding buckets.

## Review 5 — measured bucket consolidation and confirmed fixes

- **Pass:** The keyline analysis distinguishes axis-specific field/action,
  leading-mark, disclosure, side-navigation, TOC, panel, and specialist inset
  relationships from vertical metric-box and occupied-block families. It
  records all remaining author-visible offset owners before proposing another
  utility or component.
- **Pass:** Root side-navigation now inherits the same grid-aligned panel inset
  as its navigation brand, with the grid gutter as the standalone fallback;
  nested rows retain only their baseline depth increments.
- **Pass:** Numeric fields retain native input semantics and keyboard
  increment/decrement behaviour. Their field-owned paired chevron uses the
  same 1rem canvas, vertical centre, trailing position, and reserved padding as
  select, without Chromium's additional spin slot. Status labels now use body,
  rather than H5, metric nudges, fixing the documentation-tier coloured-block
  shift.
- **Pass:** Prose lists, ticked/crossed lists and checkbox/radio labels share
  the leading-mark size/gap/offset family. The unordered-list dot is painted
  in the shared mark canvas, so its centre exactly matches tick, checkbox, and
  radio. The radio inner dot is one border pixel larger and sits exactly one
  pixel left/up of the outer-circle centre. The divided-list half-baseline icon
  offset was removed.
- **Pass:** Accordion, list-tree, notification, and panel copy now share one
  measured 2rem icon-label continuation. The notification icon is derived
  backward from that copy line so every tier retains its compact icon-to-text
  gap. The audit did not add a fourth guide: red moved from the uninformative
  page edge to a literal one-rem inset, while blue owns the shared copy line.
- **Current regression validation:** `npm run build`, `npm run test:build`
  (6,231 checks), `npm run test:behavior`, `npm test`, and
  `npm run qa:components` passed. Browser review confirmed
  both audit routes inside the shared 18rem page chrome in light and dark
  themes, with clean fresh consoles. The fixed red/green/blue 0.0625rem overlay is
  visible at 50% opacity on only those routes and recalculates after tier and
  viewport changes. Number/select canvases, the shared 0.1875rem disclosure-icon
  optical drop, the common leading-mark centreline, and the shared 2rem copy
  line were visually confirmed in documentation and OS tiers in both tones.
