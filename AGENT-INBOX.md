# Agent inbox

## Active package

None. Spec 021 was owner-accepted, merged into `main` at `17805b6`, and
archived. Its final Opus verdict and record corrections are preserved in
[`review.md`](docs/spec-archive/021-block-derived-inline-geometry/review.md#opus-n1n6-verdict).

The governing records now state that the wrapping row-gap floor is
descendant-agnostic, disclose its measured no-target impact, route QA through
the affected OS form-atlas case, and define `.bf-cluster.is-nowrap` as outside
automatic block containment. These corrections change no CSS or runtime
behavior.

The integrated mainline evidence is green: `npm test` at 19,500 static checks
with every component-baseline and behavior family passing, followed by a fresh
`npm run qa:components`. No publication or release was performed.

## Cross-repository token architecture

The owner-approved governing contract is
[`docs/cross-repo-token-architecture-spec.md`](docs/cross-repo-token-architecture-spec.md).
The final independent sign-off is
[`docs/cross-repo-token-architecture-signoff-review.md`](docs/cross-repo-token-architecture-signoff-review.md);
its required corrections are incorporated. The durable execution sequence is
[`docs/cross-repo-token-architecture-implementation-handoff.md`](docs/cross-repo-token-architecture-implementation-handoff.md).

PRs 1 and 2 are landed. Canonical design-tokens PR
[#125](https://github.com/canonical/design-tokens/pull/125) landed at `595d50e`;
the baseline/component-spacing schema is on design-tokens `main` at
`18f57b95b1aa1dfe85a45746016b055c807d6628`; and the retained Pragma plumbing
checkpoint is `964f6f129`. Publication, release, and wider downstream adoption
remain separately gated.

BF PR 3 is implemented locally on `feat/dtcg-spacing-format-adapter` from
`08db5ab`. Implementation commit `48e13b2` consumes the four-product resolved
DTCG spacing artifact while preserving current geometry through the exactly
seven-point, 020a-bounded overlay. Its evidence is in
[`docs/cross-repo-token-architecture-pr3-implementation-review.md`](docs/cross-repo-token-architecture-pr3-implementation-review.md),
and the independent review request is
[`prompts/opus-token-architecture-pr3-adversarial-review.md`](prompts/opus-token-architecture-pr3-adversarial-review.md).
Do not push or merge it without explicit approval. Do not begin Pragma
adoption, 020a values, density, grid/page work, publication, or release.

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
