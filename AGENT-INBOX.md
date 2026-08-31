# Agent inbox

## Release handover — 0.1.5 / archived Spec 017

Remove developer-only spacing and horizontal-keyline pages from the public demo
catalog. Audit which remaining examples teach a consumer-facing contract and
retire specimens that only expose implementation diagnostics.

Spec 017 is accepted and archived for the final 0.1.5 release. The public demo
cleanup, exhaustive adjacency audit, three-keyline component inset
consolidation, branded continuation-rail repair, tabbed axis audit, select
pressure handling, and final adversarial review are complete. Do not recreate
the removed historical diagnostic batch or introduce an unclassified
component inset. Text keeps only metric compensation; stacks and pattern
containers own semantic spacing.

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

The accepted Spec 017 implementation passes `npm test` (including 6,739 build
contracts and component behavior), `npm run qa:components`, and Playwright
review in light and dark across all four tiers. The spacing chapter presents basic-section guidance
and reuses both axis routes in in-page BF tabs. Horizontal owns the fixed
three-line inset overlay while active; vertical hides it and owns three compact
occupied-block rows whose raw specimens are 5rem wide. A five-letter paragraph
anchors each text baseline, and 23 body-sized interface specimens share one
border-aware occupied-height contract across all tiers. The vertical audit uses
an unpadded public BF cluster rather than a private geometry-changing track;
its scrollbar occupies whole baseline units, and page-wide text phase is now
an executable browser contract. Temporary QA servers use the browser-safe dynamic port
range. The demo server at `http://127.0.0.1:4173` uses polling so edits in the
shared Windows/WSL workspace remain visible without repeated restarts. The
earlier feature tip `f9731a2` remains tagged as downstream release candidate
`v0.1.5-rc.0`, and Diagram Registry currently consumes that older exact build.
The final `v0.1.5` tag remains reserved for the npm-owned publication workflow;
record the registry, tag, tarball, checksum, and downstream-advance evidence
after that workflow succeeds.

Preserve `tmp/chevron-audit/`, `tmp/chevron-harness/`, and
`tmp/vanilla-main/`. The sibling Vanilla checkout contains user changes in
`yarn.lock`; do not clean or update it.
