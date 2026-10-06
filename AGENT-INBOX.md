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
- `5184484` removes nonzero block-start spacing, contains final text margins,
  and preserves control/navigation geometry. Its type, test, and component-QA
  logs are `margins-check-types.log`, `margins-npm-test.log`, and
  `margins-qa-components.log`.
- The current SideNavigation item owns page-margin gutters on both edges,
  derives one tier icon/gap label keyline for Header, GroupHeader and nested
  rows, adds a real ContextSwitcher, and paints selection in the start gutter.
  Its required gates are green in `sidenav-check-types.log`,
  `sidenav-npm-test.log`, and `sidenav-qa-components.log`.
- The current governed dense Site Chip item uses a versioned Table.Cell/Chip
  policy and nested CSS scopes to resolve the nearest provider and product
  root through neutral descendants. Site Chips occupy 32px in the provider,
  align exactly with adjacent text, and leave the host row and standalone seat
  at 40px. Nested tables/products and the legacy class boundary cases are
  covered. Its required gates are green in `dense-chip-check-types.log`,
  `dense-chip-npm-test.log`, and `dense-chip-qa-components.log`.
- The current row-contract item removes layout-border arithmetic from the
  regular and nested ledgers, removes the bordered Action alias and obsolete
  build guards, and drops transparent frame borders from row-only geometry.
  Its required gates are green in `row-contract-check-types.log`,
  `row-contract-npm-test.log`, and `row-contract-qa-components.log`.

Gate logs live under `H:/WSL_dev_projects/temp/bf-028-20261006/`, named by item.

## Active change

Move each component family from its real layout border to the automatic
overlay or its named anatomy exception. Preserve the governed dense Site Chip
policy and the established non-Site nested contracts.

The shared row ledger is final, but the intermediate source still has local
border subtraction only where a family retains a real stroke: fields and file
buttons, Button/Choice/SegmentedControl/SideNavigation toggle, Chip,
Pagination, and nested fields/buttons. Remove each local term with that
family's paint migration; none may remain at the final checkpoint.

FR-061a/SP-1 remains in progress beyond the landed margin-direction step:
remaining semantic or structural block-end margins in responsive navigation,
ContentCard, mobile tables, contained logos, and equal-height rows must move to
their owning family layouts before the final conformance checkpoint. The
current AST gate intentionally proves only the nonzero block-start inventory;
it is not the final compensation-only end-margin classifier.

## Remaining order

1. Atomic paint-only component-family commits using the reviewed exception map
   in `paint-impact-audit.md`; remove each staged local border term with its owner.
2. Complete compensation-only end-margin ownership in the affected component
   families and replace the directional gate with final end-margin governance.
3. Identical-DOM before/after demo, browser scale evidence, BF board columns,
   manifest, review docs, and `opus-028-review-request.md`; stop for external Opus.

Run `npm run check:types`, `npm test`, and `npm run qa:components` after each
atomic item. Do not edit frozen neutral diagnostics, push, merge, or open a PR.
