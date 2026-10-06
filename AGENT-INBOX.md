# Agent inbox — Spec 028 live handover

Date: 2026-10-06
Branch: `feat/028-shared-spacing-decisions`
Worktree: `../baseline-foundry-worktrees/feat-028-shared-spacing-decisions`
Base: `6deca99776f35b85afde01b68bb0fffe817e29aa`
Governing Canonical values: `7169231`; routing: `303875a`

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

Gate logs live under `H:/WSL_dev_projects/temp/bf-028-20261006/`, named by item.

## Active change

SP-13 four-tier text compensation is implemented in the working tree. The
independent `root-text-oracle.json` passes all 28 role outputs, including the 16
expected changes, unchanged metric nudges/line heights, `c >= n`, and grid
closure. Finish the BF behavior/full/QA gates, then commit atomically.

## Remaining order

1. Block-end margin containment and Tooltip compact inner text owner.
2. SideNavigation gutters/keylines/ContextSwitcher.
3. Dense Site Chip 32px enrolled-host contract; standalone 40px.
4. Paint-only row contract first, then atomic component-family commits using the
   reviewed exception map in `paint-impact-audit.md`.
5. Identical-DOM before/after demo, browser scale evidence, BF board columns,
   manifest, review docs, and `opus-028-review-request.md`; stop for external Opus.

Run `npm run check:types`, `npm test`, and `npm run qa:components` after each
atomic item. Do not edit frozen neutral diagnostics, push, merge, or open a PR.
