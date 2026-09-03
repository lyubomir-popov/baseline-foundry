# Agent inbox

## Active package

None. Spec 018 is accepted, merged, and archived. Do not promote a candidate
without its catalogued evidence trigger.

## Active follow-up

Branch `fix/table-row-control-fit` compares a plain table row with a row of
explicitly nested text/number inputs, button, checkbox, and radio controls. The
controls use the same opt-in host-owned density model as nested chips while the
ordinary table cells retain their inset and separator. Do not publish to npm or
create a release unless the user explicitly asks. `npm test` passes with 7,054
static contracts plus component and behavior checks; `npm run qa:components`
also passes. Live browser review confirms the compact row, centered selection
marks, visible input focus paint, shared page chrome, and a clean console.

## Cross-repository token architecture

The owner-approved governing contract is
[`docs/cross-repo-token-architecture-spec.md`](docs/cross-repo-token-architecture-spec.md).
The final independent sign-off is
[`docs/cross-repo-token-architecture-signoff-review.md`](docs/cross-repo-token-architecture-signoff-review.md);
its required corrections are incorporated. The durable execution sequence is
[`docs/cross-repo-token-architecture-implementation-handoff.md`](docs/cross-repo-token-architecture-implementation-handoff.md).

PR 1 is landed. Canonical design-tokens PR
[#125](https://github.com/canonical/design-tokens/pull/125) is on `main` at
`595d50e`; Pragma PR
[#1106](https://github.com/canonical/pragma/pull/1106) is on `main` at
`964f6f129`. Publication, release, and wider downstream adoption remain
separately gated. The next cross-repository step is the independent
design-tokens PR 2 for `spacing.baseline` and the component-spacing schema,
branched from the new design-tokens `main`. Do not implement this work on
`feat/019-tier-responsive-action-insets`: 020a absorbs 019, and Spec 021 has an
independent worktree.

Settled policy: `spacing.baseline` resolves to 0.5rem for Site and 0.25rem for
Docs/App/OS; exact line heights are typography-owned dimensions carried by a
Canonical extension because DTCG 2025.10 permits only a numeric multiplier;
Site display is 84px/96px; Site secondary 14px/20px is the sole current
semantic half-step family and knowingly exits on the half-phase; controls are
intrinsic with no target height; and Pragma may retain `1cap` only under the
measured control-ledger envelope in the governing spec.

### Final PR 1 correction review

The adversarial
[`correction review`](docs/cross-repo-token-architecture-pr1-correction-review.md)
reproduced all four original fixes from generated artifacts and found no
blockers: design-tokens was ready to land and the Pragma preparation safe to
retain independently. Pre-merge commit `6c9914e` closed N1/N5 with resolved
legacy/canonical equality coverage and closes N3 by requiring the shared
property registry at every builder boundary. N4 was already encoded explicitly
in the delivery-dependency map. N2 remains correctly assigned to PR 4's
rendered secondary-text fixture; PR 1 proves 14px/20px at the token layer.

Before landing, PR 1 was merged twice with concurrently advancing
design-tokens `main`, including the contracts/profile and `$root`-remedy work.
The final integrated build produced 706 tokens; all 263 plugin, 127 token, and
42 type tests passed. Fresh full LSP runs at the final base `cd54fbf` and the
integrated feature tip each reported the same 64 Windows/POSIX failures and
identical sorted full-name arrays, with SHA-256
`97c1dda57631868b8f3d0e166549aa67677e0f6ce30e9b0b10add731b54d1814`.

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
