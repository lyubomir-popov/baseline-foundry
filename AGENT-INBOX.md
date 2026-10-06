# Agent inbox — Spec 028 live handover

Date: 2026-10-06
Branch: `feat/028-shared-spacing-decisions`
Worktree: `../baseline-foundry-worktrees/feat-028-shared-spacing-decisions`
Base: `6deca99776f35b85afde01b68bb0fffe817e29aa`
Governing Canonical values: `7169231`; routing: `b100649` after `303875a`

## Current objective

Complete BF Spec 028 through the saved final Opus checkpoint. Do not resume parked
Spec 026 or implement body-line phase. Main checkout's dirty inbox is preserved
and must not be changed.

## Landed and green

- `b496f26` Spec 028 package and catalog routing.
- `f199993` control values and 0/4/4px compact block inset.
- `955bc27` 16/14/14/12px body-sized icon source; tagged brand exception kept.
- `49bae12` continuation derived from field + body icon + gap; no authored field.
- `6717ccc` SP-6 gaps and SP-3 standard surface values.
- `b4a6b13` four-tier SP-13 text compensation; independent 28-role oracle green.
- `948f240` Tooltip compact frame and contained metric text owner.
- Current tip removes nonzero block-start spacing, contains final text margins,
  and preserves control/navigation geometry. Its type, test, and component-QA
  logs are `margins-check-types.log`, `margins-npm-test.log`, and
  `margins-qa-components.log`.

Gate logs live under `H:/WSL_dev_projects/temp/bf-028-20261006/`, named by item.

## Active change

Begin SideNavigation gutters, label keylines, selected-gutter paint, and the
real ContextSwitcher specimen. Keep the tagged Canonical brand anatomy.

FR-061a/SP-1 remains in progress beyond the landed margin-direction step:
remaining semantic or structural block-end margins in responsive navigation,
ContentCard, mobile tables, contained logos, and equal-height rows must move to
their owning family layouts before the final conformance checkpoint. The
current AST gate intentionally proves only the nonzero block-start inventory;
it is not the final compensation-only end-margin classifier.

## Remaining order

1. SideNavigation gutters/keylines/ContextSwitcher.
2. Dense Site Chip 32px enrolled-host contract; standalone 40px.
3. Paint-only row contract first, then atomic component-family commits using the
   reviewed exception map in `paint-impact-audit.md`.
4. Complete compensation-only end-margin ownership in the affected component
   families and replace the directional gate with final end-margin governance.
5. Identical-DOM before/after demo, browser scale evidence, BF board columns,
   manifest, review docs, and `opus-028-review-request.md`; stop for external Opus.

Run `npm run check:types`, `npm test`, and `npm run qa:components` after each
atomic item. Do not edit frozen neutral diagnostics, push, merge, or open a PR.
