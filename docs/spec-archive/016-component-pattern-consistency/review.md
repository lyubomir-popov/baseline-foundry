# Review: Component and Pattern Consistency

## Status

All four implementation/review passes are complete. The package is ready for
owner review on `feat/016-component-pattern-consistency`.

## Automated evidence

- `npm run test:build`: passed, 5,906 checks.
- `npm run test:components`: passed for every registered component and tier.
- `npm run test:behavior`: passed, including the new search and tier-reference
  routes.
- `npm test`: passed after a clean generated-output rebuild.
- `npm run qa:components`: passed and refreshed the complete component capture
  set under `tmp/screenshots/components/`.

## Browser and geometry evidence

- The narrow-panel input and trailing search action now have the same top,
  bottom, and occupied height in all tiers: 36.4375px Editorial, 21.8125px
  Documentation/App, and 23.1667px OS. Popup panels remain below rather than
  being intersected by the action.
- Filter group headings carry the canonical `bf-h5` role. Their computed type
  metrics match a standalone H5 in every tier; component CSS supplies only
  structural reset/spacing, so there is no second H5 implementation.
- Iconless expanded side-navigation rows reserve the same 16px mark track as
  icon rows. The reserved pseudo-slot is removed in the collapsed variant so
  it cannot become a blank collapsed affordance.
- TOC section/list/item row gaps compute to zero, headings use the canonical H5
  role and default foreground, and rules occur only at that higher section
  level. The narrow specimen wrapper no longer contributes a 24px gap.
- Wide heroes render on two equal columns, with title left, copy/actions right,
  and media spanning both. H1/H2 fragments use a flush stack; the residual
  sub-pixel edge is font-metric compensation rather than semantic space.
- The quote wrapper uses the same eight-track grid as neighboring sections.
  Measured wide keylines match exactly: content/prose/media at 864px and
  header-link/citation at 2016px in the inspection viewport. Base blockquotes
  compute with zero border and zero inline padding.
- Linked-logo, text-spotlight, accordion, tab-section, equal-height, CTA, and
  other audited patterns now distinguish dense within-area rhythm from shallow
  between-area rhythm. The all-pattern route sweep covered 29 pattern demos.
- All four tier-reference links now resolve to distinct routes and initialize
  the requested Editorial, Documentation, App, or OS tier without overflow.

## Visual review

The in-app browser review covered the application layout, narrow panel, search
and filter, TOC, hero, linked-logo section, quote wrapper, tab section,
accordion, component/pattern atlases, text spotlight, and all four tier
references. Each affected four-tier state and the constrained search/tab states
were checked for clipping, keyline alignment, popup stacking, and rhythm.

## Adversarial findings

1. **High: tier-reference links were aliases for one OS page.** Resolved with
   four route files backed by one shared renderer, plus initialization and
   overflow behavior assertions.
2. **Medium: the navigation spacer could survive as an empty collapsed icon.**
   Resolved by disabling the pseudo-slot in collapsed navigation while keeping
   the expanded keyline.
3. **Medium: percentage-height search actions still depended on containing
   block behavior.** Resolved with absolute logical block insets, then measured
   at exact top/bottom/height parity in all tiers.
4. **Medium: adding dense gaps inside data-spotlight subgrids shifted baseline
   captures.** Resolved by making the parent row gap and separator length use
   the same semantic gap arithmetic; all component baselines returned green.

No unresolved high- or medium-severity findings remain. The owner-supplied
screenshots were removed only after the corresponding replacement states were
verified.

## Second owner-review pass

### Automated and sweep evidence

- `npm run test:build`: passed, 5,938 checks.
- `npm test`: passed after the final generated-output rebuild, including every
  registered four-tier baseline capture and browser behavior contract.
- `npm run qa:components`: passed and refreshed the full screenshot set.
- The catalog sweep covered all 119 rendered routes: every shared-chrome route
  had one `pc-content bf-page` wrapper, one global baseline control, no local
  duplicate, and no missing Previous/Next accessible name where an adjacent
  route exists.
- Sortable-table measurements remain identical in none, ascending, descending,
  and restored states; every column-width delta is 0px.
- Wide media-object measurements resolve to eight tracks with media at column
  one, copy at column three, 0px overflow, and retained 48px/96px specimen
  sizes in the inspected state. Narrow contracts retain the same
  first-two/remaining relationship on four tracks.
- The content-card footer rail clears its border by the canonical
  `0.5rem - border-width` inset instead of starting at the border edge.

### Browser review

The in-app browser review covered both atlases, shared Previous/Next controls,
the body-wide baseline overlay, component/spec/example page gutters, content
cards, media objects, notifications, sortable tables, and representative CTA
links. The review repeated across all four tiers where geometry is tier-owned
and at constrained/wide allocations. The server remained available on
`127.0.0.1:4173` for owner QA.

### Second adversarial findings

1. **High: atlas pages exposed two baseline controls with different scopes.**
   Resolved by removing local controls, targeting `body`, and extending the
   overlay behind the fixed sidebar.
2. **Medium: adding `bf-page` globally could double-inset existing public page
   and fixed-width specimen roots.** Resolved with one shared outer owner and a
   chrome-only direct-child padding neutralization; public component CSS stays
   unchanged.
3. **Medium: active sort indicators changed intrinsic header widths.** Resolved
   by reserving an invisible indicator box in `aria-sort="none"` and painting
   it only for active states.
4. **Medium: an arbitrary negative-gap utility would encode font-specific
   accidents and CSS gap cannot be negative.** Rejected. Inline bold/regular
   notification copy is one paragraph with `strong`; separate simple messages
   use `is-extra-dense`. Metadata-bearing messages retain a full baseline so
   both their divider and shell remain on-grid.
5. **Medium: alphabetical navigation could destroy authored overview/chapter
   sequences.** Resolved with category-first navigation, alphabetical order
   inside ordinary catalog sections, and preserved authored order for
   Overview, Spec chapters, and Tier references. Previous/Next uses the exact
   same rendered sequence.

No unresolved high- or medium-severity findings remain after the second pass.

## Third owner-review pass

### Automated and browser evidence

- `npm run test:build`: passed, 6,013 checks.
- `npm test`: passed after a clean source-driven rebuild, including the full
  component baseline suite and expanded browser behavior contracts.
- `npm run qa:components`: passed after refreshing the complete screenshot set.
- Plain `hr` and `.bf-rule` resolve identical background, 1px block size, zero
  border, and 7px compensated trailing margin in all four tiers.
- The grid-example chrome breadcrumb items now compute to the active 16px/24px
  Editorial body role instead of the former 12px/16px and 14px/20px private
  labels. Previous/Next are white, chevron-only link-buttons with accessible
  destination names and no hover underline.
- The bottom bar remains fixed to the viewport edge. Its `ResizeObserver`
  measurement reserves exactly 55.98px at wide width and 95.98px when controls
  wrap at 820px/375px, leaving final content unobscured with no inline overflow.
- The Editorial typographic specimen's breadcrumb, section, fixed-width, grid,
  and prose starts all resolve to the same 320px keyline. Descendant
  fixed-width wrappers compute to 0px inline padding in every tier; the App/OS
  caps remain intentionally centered rather than being mistaken for a gutter.
- The non-heading UI sweep covers buttons, labels, inputs, chips, status labels,
  badges, breadcrumbs, side navigation, tabs, and accordions in all tiers. Each
  resolves the active body role. Remaining literal small sizes are confined to
  code text or deliberately tight specimen/preview labels.
- Hover contracts verify non-underlined page-sequence, side-navigation,
  top-navigation, article-pagination, content-card, and in-page-navigation
  anchors. TOC, tree, and linked-heading anchors retain their intentional text
  underline affordance.
- Diagram Registry was inspected as read-only consumer evidence. It already
  composes BF breadcrumbs and button links without type overrides; its one
  local gallery-card heading underline is an intentional product affordance,
  so no downstream patch was introduced.

### Third adversarial findings

1. **High: the shared chrome normalized an undocumented 12px/14px mini scale.**
   Resolved by composing public body-sized breadcrumbs and removing the private
   type selectors.
2. **Medium: a fixed bottom bar can obscure content after its controls wrap.**
   Resolved by observing the actual bar height and reserving that exact block
   size on the document; 375px and 820px stress states remain overflow-free.
3. **Medium: chrome-only direct-child neutralization missed deeper
   `bf-page > section > bf-fixed-width` compositions.** Resolved at the public
   grid contract: a page owns the gutter and every descendant fixed-width
   region retains only cap/centering behavior.
4. **Medium: App UI copied the current 14px/20px body values.** Resolved by
   consuming `--bf-body-font-size` and `--bf-body-line-height`, preventing drift
   if the tier role changes.
5. **Medium: generic anchor hover decoration could leak into control-like
   links.** Resolved with element-qualified interaction rules and browser tests;
   intentional text-link underlines remain explicit.

No unresolved high- or medium-severity findings remain after the third pass.

## Fourth owner-review pass

### Automated and browser evidence

- `npm run test:build`: passed, 6,052 checks.
- `npm test`: passed after a source-driven rebuild, including every registered
  four-tier baseline capture and the expanded browser behavior matrix.
- `npm run qa:components`: passed and refreshed the complete screenshot set.
- Page Previous/Next links now render the canonical
  `bf-button is-base is-icon` contract in the shared dark rail. Computed paint
  is transparent with white chevrons, accessible destination names, no text,
  no underline, and no page-chrome color/filter override.
- Default heroes split at an exact 45rem container threshold: 719px remains one
  rail and 720px places H1 left, H2/supporting content right, with media across
  both columns. Wide and constrained visual states were reviewed.
- Accordion panel text and tab-label starts differ by at most 1px in every
  tier. Both derive from the disclosure icon-size and gap variables.
- Metric-flush notification pairs compute to zero stack gap, zero intervening
  heading margin and body start nudge, with glyph clearance at or below one
  baseline. Non-text siblings such as dismiss buttons do not change the pair;
  producer-owned shell compensation keeps all four tier captures on-grid.
- Site-footer strip spacing is 64/48/48/32px across
  Editorial/Documentation/App/OS. Rendered footer height is non-increasing at
  both 360px and 1280px test widths.
- Panel header/content/footer insets equal the active grid gutter, including
  direct and class-switched App entry points, while nested card grids retain
  their own component token. The live horizontal-keyline page covers tabs,
  navigation, accordion, checkbox/radio, fields, textarea, buttons, and panels
  without overflow in every tier.
- The CSS-practice sweep found no public styled `data-*`, deprecated prefix,
  BEM API, private sequence paint, or unexplained production `!important`.
  Shared breakpoints and documented intrinsic exceptions are recorded in
  `research.md`; Diagram Registry remained read-only consumer evidence.

### Fourth adversarial findings

1. **High: page sequence controls duplicated the public button/icon paint.**
   Resolved by composing the canonical base/icon contract and deleting private
   colors, borders, backgrounds, filters, and hover styling.
2. **Medium: the first metric-flush selector treated any trailing control as a
   text-role boundary.** Resolved by collapsing only adjacent configured text
   roles, so an absolutely positioned dismiss button cannot strip the body
   role's outer compensation.
3. **Medium: a global panel-token rewrite leaked the page gutter into nested
   card grids.** Resolved with a panel-local derived inset variable and the
   configured panel token as fallback; nested consumers remain unchanged.
4. **Medium: direct App and class-switched App resolved different large
   gutters.** Resolved in the grid producer by including both entry points in
   the 24px App gutter scope.
5. **Medium: Documentation H6/body metrics do not sum to the same outer
   remainder as the other tiers.** Resolved with notification-shell
   compensation derived from the real H6/body metric variables, preserving the
   visible flush relationship and restoring baseline captures.
6. **Medium: the App site-strip token increased after Documentation.** Resolved
   with the monotonic 64/48/48/32px sequence and wide/narrow geometry tests.

No unresolved high- or medium-severity findings remain after the fourth pass.
