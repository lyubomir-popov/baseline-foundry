# Cross-repository token architecture implementation handoff

Status: owner-authorised for implementation. Merge, push, publication,
release, and downstream adoption remain separately gated.

Date: 2026-09-03

## Authority and evidence

The governing contract is
[`cross-repo-token-architecture-spec.md`](cross-repo-token-architecture-spec.md).
The final adversarial evidence is
[`cross-repo-token-architecture-signoff-review.md`](cross-repo-token-architecture-signoff-review.md).
When a review statement conflicts with the governing contract, the contract
wins. In particular, the sign-off counted six differing BF target cells;
source and built artifacts prove seven: action and continuation in Docs/App/OS,
plus the App mark gap.

## Repository and branch boundaries

Do not implement on BF's `feat/019-tier-responsive-action-insets`. It diverged
from BF `main` at `a4faab2`, carries two documentation-only commits, and its
019 work is superseded by 020a. Do not merge that branch wholesale: its early
021 package is already represented by the independent
`feat/021-block-derived-inline-geometry` worktree.

Use isolated branches/worktrees per repository and PR:

1. `design-tokens`: branch from clean `main` for exact typography and plumbing.
2. `design-tokens`: after that lands, a second branch for the twelve v1 spacing
   tokens, product resolver, and blocking lattice validator.
3. `baseline-foundry`: a new 020a branch from then-current `main` for the DTCG
   adapter and, in a later commit/PR boundary, the seven approved value changes.
4. `pragma`: a worktree from updated `origin/main`, per its `AGENTS.md`, for
   adoption. Preserve the untracked `packages/generator-ds/` in its main
   checkout.
5. `baseline-nudge-generator`: only after the consumer contract is stable, and
   only if accepting resolved DTCG inputs materially reduces duplication.

## PR 1 — exact typography and token plumbing

This is the first implementation step in `design-tokens`.

- Convert token segments deterministically to lowercase kebab-case.
- Fail on output-name collisions and provide a bounded map for renamed legacy
  camelCase properties.
- Classify primitive/semantic/public/internal tokens by source role rather than
  namespace-prefix guesses.
- Generalise modifier output beyond the colour-only builder.
- Emit referenced number tokens or consistently inline their resolved values.
- Establish `product` as the shared resolver axis for `site`, `docs`, `app`,
  and `os`, with a bounded alias for the former typography axis.
- Prove every resolver document is reachable and add the missing OS output.
- Add a Canonical exact-line-height extension at
  `$extensions.com.canonical.typography.$value.lineHeightDimension`.
  DTCG's numeric `lineHeight` remains an interoperability projection; the
  Canonical CSS builder emits the exact rem dimension as the parallel
  `-line-height-dimension` property and the lattice validator uses it.
- Give every governed typography root an exact dimension and make derived
  variants inherit it.
- Add `dimension.1200 = 6rem`; Site display remains 84px and binds to 96px
  exact line height. Do not mutate `number.lineHeight.950` into a misleading
  value.

PR 1 may change generated typography only to eliminate decimal line-height
drift and implement the approved Site display change. It adds no spacing IDs.

### PR 1 implementation checkpoint — corrected, awaiting final review

Implemented in the clean `design-tokens` worktree on
`feat/exact-typography-token-plumbing`. The full review range is
`5a7aca3..c8e7424`: initial implementation `c6d4267`, followed by review
corrections `c8e7424`. Nothing has been merged, pushed, published, or released.
The delivery-compatible Pragma preparation is isolated on
`feat/exact-typography-adoption` at `67d93d372`, based on `7fa3e67e3`; it has
likewise not been merged or pushed.

The implementation keeps `global` as the unscoped product default. A builder
fallback resolves typography that exists only in a non-default product, so the
84px/96px display role is emitted under `.site` without leaking into `:root`.
Product blocks identical to the default are omitted, so `.os` cannot reset a
nested Site or Docs region at equal specificity. Semantic font-family aliases
are emitted in `modifiers.typography.css`, the file that consumes them, while
the generic semantic set retains the baseline token only. Generated-output
gates prove all 40 resolver source documents are represented, every generated
`var()` resolves bundle-wide, and each output resolves against only its stated
delivery dependencies.

The standard `-line-height` property remains the DTCG unitless projection and
the exact value is emitted beside it as `-line-height-dimension`. This preserves
independent release order. A small preparatory Pragma branch prefers the exact
property and retains its existing rounded calculation only as a fallback for
design-tokens 0.8.1; PR 4 removes that fallback with the full engine migration.
Primitive and semantic source artifacts are explicitly public during the
compatibility window. Generated modifier, state, surface, and delta channels
are explicitly internal. CamelCase aliases copy the resolved value rather than
pointing back to the canonical property, avoiding cycles with Pragma's temporary
reverse shims.

Release note: the plugin accepts a legacy resolver that exposes only the former
`typography` axis, but the new resolver JSON does not alias that axis. Tools that
call `resolver.apply({ typography: "site" })` directly must migrate to
`resolver.apply({ product: "site" })`; otherwise they silently receive the
default product set.

Validation at the checkpoint:

- plugin build and all 247 plugin tests pass;
- token build succeeds with 706 resolver tokens and all 122 token tests pass;
- all 42 token-type tests and TypeScript checks pass;
- all three new LSP visibility/discovery tests pass; and
- the complete LSP suite retains its existing 61 Windows-host failures caused
  by POSIX path/URI expectations. The sorted failing-test names at `5a7aca3`
  and on the feature branch have the identical SHA-256 digest
  `8d5da958b91278b5266d2a359222d6a3065af5894f4f65335ae2db9f1bb866ad`.

Obtain final adversarial review and land the design-token checkpoint before
starting the independent PR 2 branch. The Pragma preparation may land in its
own repository before or after the token release because its fallback preserves
compatibility with design-tokens 0.8.1.

## PR 2 — baseline and component spacing

- Add all twelve v1 tokens and exact CSS names from the governing spec.
- Resolve `spacing.baseline` to 0.5/0.25/0.25/0.25rem for
  Site/Docs/App/OS.
- Remove breakpoint-owned `dimension.size.height.baseline`; no competing
  baseline token remains.
- Publish the final owner-approved component matrix, not BF's transitional
  current values.
- Add the product spacing builder and point-wise resolver/artifact tests.
- Make the exact line-height lattice validator blocking: whole counts by
  default, manifest-authorised half counts only, no epsilon and no runtime
  rounding.
- Manifest Site `typography.text.secondary` as the sole current semantic
  half-step root and enumerate `$root`, `bold`, `code`, `prose.$root`, and
  `prose.bold`.
- Prove Site display is 84px/96px and 12 baselines.
- Land governed density only if its exact provider/subscriber identifiers are
  ready; otherwise use one immediately following bounded PR.

## BF adoption

The format adapter consumes the DTCG artifact and names without changing BF
geometry. Because Canonical already publishes the final matrix, a temporary
BF-local overlay preserves the seven current values that differ until 020a.
Assert the complete pre/post matrix and keep `--bf-*` aliases only for a bounded
deprecation window.

020a then removes that overlay and delivers the approved action,
continuation, and App mark-gap changes. It also moves every horizontal spacing
fact off the vertical baseline. 020b is separate grid work and must first
remove duplicate page-margin/grid-gutter ownership in `src/css-grid.ts`.

## Pragma adoption

Pragma's current output is migration evidence, not a compatibility target.
Before the full migration, its mapper may prefer the new exact
`-line-height-dimension` property with the 0.8.1 calculation as a fallback;
this is delivery compatibility, not acceptance of runtime snapping.
The adoption PR must remove the density cell, target baseline, target/fixed
control sizes, runtime line-height rounding, secondary computed-line-height
path, legacy comfortable/dense aliases, baseline-derived inline padding,
element-owned `spaceAfter`, and all competing 4px baseline fallbacks. Add OS to
both Canonical and Pragma product contexts.

Free-text end compensation moves from Pragma padding to BF's trailing-margin
ledger. Side-navigation `Item`, `Header`, and `NavTree` fixed-height defects are
re-authored intrinsically. Provider status itself does not require a host to be
intrinsic.

## Cap-versus-metric evidence

Pragma may retain `1cap`. For Ubuntu Sans, the metric/cap anchor difference is
0.0065em. The provisional 0.25 CSS px gate applies only to shared control roles
at or below 1rem, where BF's large-type drift compensation is zero.

The browser harness must:

- wait for the Ubuntu Sans webfont;
- measure layout values with `getBoundingClientRect()` and a baseline probe,
  not screenshots;
- cover Chromium, Firefox, and WebKit; 16px and 18px roots; 100%, 125%, and
  150% zoom; and 1×/2× DPR;
- include an exact-baseline-multiple fixture and use BF's zero-nudge tie-break;
- prove exact occupied block, inline inset, border accounting, compensation,
  and nested-host fit; and
- fail a modulo crossing unless the role's governed line height is reconciled
  or the role is recorded as an explicit Pragma deviation.

Before generator integration, assert Ubuntu Sans's `USE_TYPO_METRICS` bit. A
future font without it must use the metrics browsers select; a font with
`MVAR` requires per-instance extraction.

## Gates and stopping conditions

Use focused package checks while iterating and each repository's full root gate
before a handoff. Do not collapse PR boundaries merely to make tests pass. Stop
and report if exact line-height metadata cannot survive Terrazzo resolution,
if product resolution requires a public product × density cross-product, or if
Pragma's `1cap` engine crosses a baseline boundary for a shared control role.

No task in this handoff authorises merging, pushing, publishing, releasing, or
adopting downstream artifacts.
