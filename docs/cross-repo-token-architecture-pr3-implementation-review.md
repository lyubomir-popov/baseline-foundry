# PR 3 implementation evidence: BF spacing format adapter

Date: 2026-09-04

Status: required adversarial corrections implemented locally; correction
review pending; not merged

Branch: `feat/dtcg-spacing-format-adapter`

Base: `08db5ab` (`origin/main`)

Initial implementation: `48e13b2`

Initial evidence: `f64febb`

Correction implementation: `9866115`

## Outcome

Baseline Foundry's four built-in tiers now consume the twelve approved
resolved DTCG `spacing.*` records from Canonical design-tokens commit
`18f57b95b1aa1dfe85a45746016b055c807d6628`. Built-in Canonical custom
properties always carry that provider's final matrix. Existing `--bf-*`
properties remain the temporary compatibility surface: 41 equal points alias
Canonical and the seven deferred points retain BF's current literals.

This is deliberately a format-only migration. A BF-local overlay preserves
the existing computed matrix at exactly seven points until the separately
approved `BF 020a spacing-value adoption`:

| Product | Deferred point | Canonical final | Retained now |
|---|---|---:|---:|
| Docs | `spacing.inset.action.inline` | `0.75rem` | `1rem` |
| Docs | `spacing.inset.continuation.inline` | `1.5rem` | `2rem` |
| App | `spacing.gap.mark.inline` | `0.25rem` | `0.5rem` |
| App | `spacing.inset.action.inline` | `0.75rem` | `1rem` |
| App | `spacing.inset.continuation.inline` | `1.5rem` | `2rem` |
| OS | `spacing.inset.action.inline` | `0.5rem` | `1rem` |
| OS | `spacing.inset.continuation.inline` | `1.25rem` | `2rem` |

No tier configuration values changed. Density, grid/page tokens, control
heights, target baselines, root scaling, Pragma adoption, publication, and
release work are outside this change.

## Source and adapter boundaries

- `config/canonical-spacing.resolved.json` is a minimized resolved artifact
  containing exactly four products by twelve DTCG dimension records. It pins
  the provider package, repository, full commit, resolver path, and an ordered
  SHA-256 digest over all 48 complete DTCG records.
- `src/dtcg-spacing.ts` validates the complete artifact shape, maps BF tier
  names to Canonical products, applies the bounded overlay, and projects the
  twelve records into public CSS names and legacy theme fields.
- Built-in tiers fail the build if any post-overlay spacing record differs
  from the pre-adapter configuration-derived value. The error identifies
  those tier config fields as compatibility assertions and routes changes to
  the pinned provider artifact/overlay contract.
- `ThemeTokens.canonicalSpacing` exposes the unoverlaid provider record for
  built-ins; `ThemeTokens.spacing` exposes BF's effective record. Custom themes
  omit `canonicalSpacing`, derive `spacing` from their own config, and emit no
  unnamespaced Canonical properties. The DTCG types are package-root exports.
- Generated files remain outputs and were not hand-edited.

## Ownership and compatibility evidence

The build contract performs 845 adapter-specific assertions. It checks all 48
Canonical values against a separately encoded final matrix, all 48 pre-adapter
and post-adapter values against the current BF matrix, and direct plus
class-switched CSS surfaces. Each built-in Canonical property has exactly one
final-matrix literal owner per BF tier surface. Each BF property has exactly
one declaration: a Canonical-direction alias at equal points or one of the
seven bounded compatibility literals.

Production validation rejects additional products or IDs, non-DTCG shapes,
non-`rem` values, provider/resolver drift, overlay scope drift, and any change
to the authenticated product records. The static contract mutates every
individual product/token value and proves all 48 failures use that production
validator, including the seven overlaid points.

Browser behavior tests separately assert the final Canonical matrix and BF's
effective matrix. They use the generated design-tokens spacing CSS shape
(`ds.modifiers`, primitive references, and provider selector order), load it
both before and after BF, and cover direct aligned product scopes plus nested
Docs/App/OS scopes inside Site.

## OS typography-reset asymmetry

Canonical intentionally omits an `.os` typography block when OS equals its
unscoped typography default. The BF adapter does not infer spacing from that
absence. It reads the explicit OS product spacing record and emits all twelve
spacing properties on `.bf-tier-os`. Static validation proves that the input
is spacing-only and that the OS class surface owns its spacing baseline; no
Canonical `.os` typography reset is expected or synthesized.

## Independent provider reproduction

From `design-tokens/packages/tokens`, the real `@terrazzo/parser` resolver was
applied for `site`, `docs`, `app`, and `os`, and every BF artifact record was
compared by `$type` and `$value`:

```text
BF artifact matches design-tokens resolver at 18f57b9: 48/48 values.
```

Repository state was fetched before implementation:

- design-tokens `main` and `origin/main`: `18f57b95b1aa1dfe85a45746016b055c807d6628`;
- BF base and `origin/main`: `08db5abdd4f3c96644a556a07790fe4bf36cd379`;
- Pragma local `main`: `964f6f12916c8977dfce5fc87afc77f5043f2ef1`,
  matching the supplied verified checkpoint; fetched `origin/main` had
  advanced to `7709673b8775ce45d16a4023b68952be1faad374`.

Pragma was not switched, edited, built, or adopted.

## Validation evidence

All commands ran in the isolated BF worktree.

| Check | Result |
|---|---|
| `npm run check:types` | pass |
| `npm test` | pass; build validation `20,345` checks; every component-baseline family at zero failures; behavior verification pass |
| `npm run qa:components` | pass; fresh capture and baseline verification, 332 records across 85 pages, 5,410 checks, zero failures, 220 overflow checks, and 86 PNGs |
| `git diff --check` | pass |
| provider resolver reproduction | design-tokens at exact `18f57b9`; targeted spacing suite `8/8`, including all `48/48` product/token values |

The fresh QA report contains 332 surface/page records across 85 pages, 5,410
baseline checks, zero failures, 220 overflow checks with zero failures, and 86
PNG captures. Its surfaces include all four built-in tiers plus the IBM Plex
and Ubuntu engine smoke states.

## Browser review

The rebuilt demo was reviewed in Chromium through the Browser skill after the
fresh QA capture:

- component atlas: captures loaded and the catalog remained visually intact;
- form atlas: OS at `720 × 900`, including fields, action insets,
  continuation alignment, tables, and responsive chrome; Canonical
  action/continuation measured `0.5rem`/`1.25rem` while BF compatibility
  remained `1rem`/`2rem`;
- actions page: Documentation at desktop width; Canonical
  action/continuation measured `0.75rem`/`1.5rem` while BF compatibility
  remained `1rem`/`2rem`;
- the reviewed form and actions states had no document-level horizontal
  overflow;
- console: zero warnings or errors.

The constrained OS form state remained readable without clipped controls or
unexpected spacing expansion. The browser viewport was reset and the temporary
server stopped after review.

## Initial adversarial review and correction gate

The independent review is preserved in
[`cross-repo-token-architecture-pr3-adversarial-review.md`](cross-repo-token-architecture-pr3-adversarial-review.md).
Its verdict was **accept with required corrections**. F0/F1 required value
integrity and truthful Canonical names; F3/F4 required an explicit mixed-CSS
contract and a BF-only custom-theme namespace; F5/F6 required evidence and
edit-guidance corrections. All six are represented in the corrected code,
tests, and documentation; a fresh correction review remains required.

The prepared adversarial request is
`prompts/opus-token-architecture-pr3-adversarial-review.md`. A reviewer should
reject the correction if any Canonical name carries a compatibility value, if
any of the 48 records can mutate past production integrity validation, if a
custom theme claims Canonical names, if mixed aligned scopes are order
dependent, or if any density/grid/Pragma scope leak exists. No push or merge is
authorized before that review. The owner-approved landing path is a direct
fast-forward into BF `main`, not a GitHub PR. The owner separately authorized
pushing the completed feature branch so the exact correction state is retained
for review.
