# Agent inbox

## Active package

None. Spec 018 is accepted, merged, and archived. Do not promote a candidate
without its catalogued evidence trigger.

## Active follow-up

Branch `fix/table-row-control-fit` compares a plain table row with a row of
normal text/number inputs, button, checkbox, and radio controls. The intended
contract keeps controls full-sized and uses explicit `tr.is-control-row` host
ownership to avoid duplicate cell block inset. Do not publish to npm or create
a release unless the user explicitly asks. `npm test` passes with 7,012 static
contracts and clean component/browser checks; `npm run qa:components` also
passes. Live light/editorial and dark/OS review confirms the row fit without
clipping the controls or their keyboard focus paint.

## Previous release — 0.1.7 / archived Spec 018 follow-up

The optional orange tagged brand, explicit nested chip/status/badge fit,
exhaustive vertical coverage, active thick-bar tab, shared header/breadcrumb
line, raster-stable side-navigation tracks, and zoom-stable single-line color
and inline-range rows are complete. The 0.1.7 follow-up makes the audit tab's
initial state explicit and proves that a nested badge fits inside a compact
table-hosted chip without enlarging its row. Keep the standalone chip for
standalone targets; do not generalise `is-nested` into an undersized bordered
button contract or reintroduce page-local spacing fixes. OIDC run `33415864663`
published `baseline-foundry@0.1.7` from `77ffcfe`, tagged that exact commit as
`v0.1.7`, verified a clean registry install, and attached the npm tarball plus
checksum records to the GitHub release.

## Previous release — 0.1.5 / archived Spec 017

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

The released 0.1.7 implementation passes `npm test` with 6,956 static
contracts, zero component-baseline failures, and clean browser behavior. It
also passes `npm run qa:components` after a fresh full-catalog screenshot
capture. The shared demo remains running at `http://127.0.0.1:4173`; the
persistent chrome, optional orange tagged brand, active thick-bar tab, and
corrected vertical audit were visibly present in the final live refresh. A
post-publication clean install verified 30 root exports and 21 asset entry
points from the registry package. Tag `v0.1.7` resolves to `77ffcfe`; its
GitHub release contains the npm tarball and checksum record.

The released Spec 017 implementation passes `npm test` (including 6,739 build
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
The npm-owned workflow published `baseline-foundry@0.1.5` from `2d1099c`,
created `v0.1.5` at that exact commit, verified a clean registry install, and
attached the reconciled npm tarball plus checksums to the GitHub release.
Diagram Registry can now advance from the release candidate as a separate,
lockfile-visible downstream change.

Preserve `tmp/chevron-audit/`, `tmp/chevron-harness/`, and
`tmp/vanilla-main/`. The sibling Vanilla checkout contains user changes in
`yarn.lock`; do not clean or update it.
