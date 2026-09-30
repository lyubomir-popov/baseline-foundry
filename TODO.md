# TODO: execution order

This file owns cross-spec order and a short unnumbered backlog. Spec status lives
in `docs/specs.md`; per-spec tasks live in the package.

## Now

1. Close Spec 025 compact alignment grid: commit its pending review/tasks
   edits, bring the branch up to `main` (v0.2.0/v0.2.1 landed after it), rerun
   `npm test` and `npm run qa:components`, then land by owner-approved direct
   fast-forward and archive the package.
2. Port the Pragma body-line phase and closure decision (Spec 024 contract,
   owner decision 2026-09-28) to BF as a new numbered package: headings lift
   their first baseline onto the body-line step, and paragraphs, lists and
   headings close their occupied block to whole body lines rather than the
   baseline unit. BF keeps generated real-font metrics. Decide in that package
   whether the parked `wip/bf-typography-cap-metric` branch (typography
   discipline, generated cap-height tokens, paint-only icon shift) folds in or
   lands first.
3. 020b page/grid adoption stays parked until design-tokens publishes a
   page/grid provider.

Spec 024 is Pragma-targeted and run separately; it is not BF execution order.
Publication and release need separate owner direction.

## Candidate order after Spec 001

These are candidates, not active work. Promote one to a numbered package on a
matching feature branch only when its catalogued evidence trigger is met.

1. Shared authoring shell and document frame, after two consumers expose the
   same top-navigation/stage/aside seam.
2. Product-specific credential orchestration beyond the shipped BF password
   reveal and repeated validation/help composition, after a consumer proves a
   shared workflow rather than another field state.
3. Framework- or data-source-specific table orchestration beyond the shipped
   sortable, expandable and mobile-card contracts, after runtime/state
   ownership is known.
4. Media-object breakpoint retuning beyond the shipped BF composition, only
   after a second consumer proves that the current intrinsic threshold fails.

## Unnumbered backlog

- Diagram Registry upstream requests (Registry Spec 033, 2026-09-30; Registry
  keeps local fallbacks until BF ships each):
  - `bf-panel-footer` draws a top border with zero block-start padding, so text
    touches it; match `bf-rule`'s inset,
    `calc(var(--bf-space-1) - var(--bf-border-width))`.
  - Column-span or 25/75 split for `bf-basic-section` content.
  - Floating/fixed `bf-notification` variant.
  - Auto-fit card-grid modifier.
  - Muted-text utility (`is-muted` only applies to cards).
  - Fixed-layout/equal-columns table modifier.
  - `[hidden]` override for `bf-cluster`.
  - Global `prefers-reduced-motion` (BF covers content cards only).
- Apply the marker composition split: bare markers (checkbox, radio, switch,
  list) and painted hover rows share one marker canvas and marker-to-text gap;
  only the painted wrapper adds Action/group inset before the marker.
- `bf-slider` discrete notch/tick presentation as a small opt-in integer
  `min`/`max`/`step` contract that keeps native keyboard behavior and exposes
  value text without a paired number input.
- Generic split-pane/resizer only when a second consumer proves the same
  contract; `bf-application-aside-resize-handle` stays scoped to pinned asides.
- Portfolio imports BF's private `src/build.ts` through a `file:` dependency;
  add `tsx` locally and migrate it to the public `baseline-foundry/build`
  export before changing that dependency.
- Repair the pre-existing side-navigation screenshot fixture: its captured
  expanded/collapsed demo states overlap in both `main` and 020a even though
  the measured component geometry is green. Keep this separate from token
  adoption.
- Switch versus slider track language.
- Downstream-generated authoring chroma surface; never a built-in tier by
  default.
- Processing-button state and runtime strategy.
- Decide whether BF eventually becomes `@design-foundry/shell` or stays an
  independently published peer.
