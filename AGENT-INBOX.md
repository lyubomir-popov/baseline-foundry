# Agent inbox

## Active package — Spec 017 spacing-system audit

Remove developer-only spacing and horizontal-keyline pages from the public demo
catalog. Audit which remaining examples teach a consumer-facing contract and
retire specimens that only expose implementation diagnostics.

Spec 017 is active on `feat/017-spacing-system-audit` and inventories horizontal and
vertical adjacency across components and patterns. Its fixtures must place all
relevant elements tightly enough to expose accidental gaps, missing gaps,
keyline departures, and tier drift. Use the current ownership model: text keeps
only metric compensation, while stacks and pattern containers own semantic
spacing. Do not preserve obsolete wording that presents element-owned and
container-owned semantic spacing as competing modes.

## Current producer defect — responsive branded application navigation

Diagram Registry needs application navigation to collapse at narrow widths to
one persistent bar that keeps the Canonical mark and “Diagram registry” title
visible beside the navigation toggle. The current drawer-only composition moves
the brand off-canvas when `.bf-navigation` is collapsed. Registry previously
removed `bf-navigation-bar` because composing it with the drawer produced a
duplicated desktop fascia.

Provide a supported BF application-shell composition with one compact branded
bar while collapsed or narrow, the full pinned drawer at wide widths, no
duplicate brand row, and correct keyboard, focus, and ARIA behavior. Validate a
real consumer-shaped fixture at both sides of the breakpoint.

## Deferred candidates

- The public `bf-slider` range control has no discrete notch/tick presentation.
  Consider a small opt-in integer `min`/`max`/`step` contract only after the
  current spacing and navigation work. It must preserve native keyboard
  behavior and expose value text accessibly without requiring a paired number
  input.
- Diagram Registry and the standalone Mermaid playground have related resize
  seams, but the existing `bf-application-aside-resize-handle` remains correctly
  scoped to pinned application asides. Promote a generic split-pane/resizer only
  when a second consumer proves the same reusable interaction contract.
- Portfolio still imports BF's private `src/build.ts` through a `file:`
  dependency. Before changing that dependency, add `tsx` locally and migrate it
  to the public `baseline-foundry/build` export.

## Last-known-green state

`main` and `origin/main` point to `99d298b`. Spec 016 is accepted and archived.
The 0.1.5 source tree passes `npm test`, `npm run qa:components`,
`npm run release:check`, and clean package verification (30 root exports and 21
asset entry points). npm remains at 0.1.4 and the `v0.1.5` tag is intentionally
unused until the npm-owned publication workflow runs.

Panel padding progression, tier fixed-width progression, semantic list/footer
spacing, narrow tier-switch range geometry, mixed inline-list/range footer
geometry, raw-link states, H5/eyebrow unification, and the grouped stack
composition are already merged to `main`; their durable evidence belongs to the
accepted specs and Git history, not this inbox.

Preserve `tmp/chevron-audit/`, `tmp/chevron-harness/`, and
`tmp/vanilla-main/`. The sibling Vanilla checkout contains user changes in
`yarn.lock`; do not clean or update it.
