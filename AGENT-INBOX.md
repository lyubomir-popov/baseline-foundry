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

The public demo cleanup and initial 22-class adjacency inventory are complete.
Continue with the exhaustive source audit in `tasks.md`; do not recreate the
removed diagnostic spacing pages. The responsive branded application
navigation producer defect is fixed in `1a48707` and merged locally to `main`.

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

The spacing foundation and responsive navigation fix are merged and published
to `origin/main`. Both slices pass `npm test`,
`npm run qa:components`, and browser review; the combined merged tree also
passes `npm test`. npm remains at 0.1.4 and the `v0.1.5` tag is intentionally
unused until the npm-owned publication workflow runs.

Preserve `tmp/chevron-audit/`, `tmp/chevron-harness/`, and
`tmp/vanilla-main/`. The sibling Vanilla checkout contains user changes in
`yarn.lock`; do not clean or update it.
