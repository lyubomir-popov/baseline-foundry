# Tasks: Block-derived inline geometry

Owner decisions of 2026-09-01 are folded into `spec.md` and the contract. The
former single-character and radius questions are closed; do not reopen them.

- [x] T001 Capture current painted inline and block extents for every member in
  [`contracts/block-derived-matrix.md`](contracts/block-derived-matrix.md), in
  all four tiers, in every supported standalone and nested state, light and dark. Record the ellipse and
  rectangle ratios so the fix is measurable rather than asserted. Include the
  `.bf-article-pagination-link` collapsed state for the audit record even
  though it is not a member.
- [x] T002 Emit `--bf-square-block-size` in `src/css-component-contracts.ts`
  and re-point it per member and state to that member's own painted block, per
  the contract table. Do not re-point it to a shared ledger name; that is the
  corrected defect.
- [x] T003 Adopt the contract universally for `.bf-chip` in
  `src/css-components/chip-badge-status.ts`. No content-length modifier.
- [x] T004 Replace the badge's build-time `min-width` and `content-box` sizing
  with the contract, so the nested ledger switch happens on both axes.
  Determine whether `--bf-ui-badge-padding-inline` survives.
- [x] T005 Measure changed interactive target size per tier at the proposed
  square, including icon-only actions, chips, and numbered pagination. Resolve
  against WCAG 2.2 success criterion 2.5.8 using one of the four dispositions
  in the contract before changing geometry.
- [x] T006 Adopt the contract for `.bf-button.is-icon` with no label: set
  `min-inline-size` from the alias, set `padding-inline: 0`, and let the
  existing flex centring and metric strut place the icon. Every painted value
  derives from an existing variable; the only pixel value is the normative 24
  CSS-pixel out-of-flow pointer target, with no magic multiplier or per-tier
  override.
- [x] T007 Correct `nav.bf-pagination`: apply the painted-block alias and
  remove the bordered action inset for bare numbered links only. Labelled
  previous/next controls retain their Action inset.
- [x] T008 Confirm the existing `.bf-chip` and `.bf-badge` radii are sufficient
  once geometry is truthful. Add a static assertion proving no other
  component's radius declaration changed in this package.
- [x] T009 Add static assertions for contract emission per tier and per member
  state, a rejection assertion for any build-time-interpolated inline floor,
  and a rejection assertion for authored lengths introduced by this package
  except the three reviewed uses of the same 24px pointer-target constant: two
  target axes and one supported-container overflow derivation.
- [x] T010 Add browser assertions measuring equal *painted* inline and block
  extents — explicitly painted, not occupied, since the two coincide in some
  tiers — for fitting chips and badges and for square icon actions and
  pagination slots, in all four tiers and both tones, plus centred fitting chip
  content, the accepted intrinsic Field-chip stadiums, link-style icon actions,
  directly hittable icon targets at edges and corners in LTR/RTL ordinary and
  nowrap action groups, a forced 1.5 device-scale raster sweep of both default
  alias members, and unclipped stadium behaviour from two through five
  characters.
- [x] T011 Confirm the existing four-tier occupied-block and vertical
  assertions pass unmodified. Do not adjust them to accommodate this package.
- [x] T012 Add the block-derived row to the classification table in
  `docs/component-spacing-architecture.md`, replacing the badge centred
  exception, and record the radius boundary and the painted-versus-occupied
  rule.
- [x] T013 Run independent architecture, cascade and verification reviews.
- [x] T014 Run `npm test` and `npm run qa:components` with fresh captures,
  record evidence in `review.md`, and request owner and stakeholder visual
  acceptance.
- [x] T015 Record the accepted R3 direct pointer-target disposition and R4
  Field-chip keyline ownership, encode them consistently, and rerun `npm test`
  plus fresh `npm run qa:components` captures.
- [ ] T016 Merge and archive only after acceptance. Do not publish or release
  without a separate explicit request.
