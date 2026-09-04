# PR 3 implementation evidence: BF spacing format adapter

Date: 2026-09-04

Status: ready for independent adversarial review; not pushed or merged

Branch: `feat/dtcg-spacing-format-adapter`

Base: `08db5ab` (`origin/main`)

Implementation commit: `48e13b2`

## Outcome

Baseline Foundry's four built-in tiers now consume the twelve approved
resolved DTCG `spacing.*` records from Canonical design-tokens commit
`18f57b95b1aa1dfe85a45746016b055c807d6628`. Canonical custom properties own
the values in generated CSS. The existing `--bf-*` properties point to them as
temporary compatibility aliases.

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
  the provider package, repository, full commit, and resolver path.
- `src/dtcg-spacing.ts` validates the complete artifact shape, maps BF tier
  names to Canonical products, applies the bounded overlay, and projects the
  twelve records into public CSS names and legacy theme fields.
- Built-in tiers fail the build if any post-overlay spacing record differs
  from the pre-adapter configuration-derived value. Custom themes continue to
  derive the same DTCG record from their own existing configuration.
- `ThemeTokens.spacing` exposes the resolved DTCG record; the related DTCG
  types are exported from the package root.
- Generated files remain outputs and were not hand-edited.

## Ownership and compatibility evidence

The independent build contract performs 603 adapter-specific assertions. It
checks all 48 Canonical values against a separately encoded final matrix, all
48 pre-adapter and post-adapter values against the current BF matrix, and both
direct and class-switched CSS surfaces. Each canonical property has exactly one
literal owner per tier surface; each BF property has exactly one declaration
and points in the canonical direction with `var(--spacing-...)`.

The contract also rejects additional products or IDs, non-DTCG shapes,
non-`rem` values, provider/resolver drift, overlay scope drift, and a generated
typography baseline that differs from `spacing.baseline`.

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
| `npm test` | pass; build validation `20,103` checks; all component baseline families; behavior verification pass |
| `npm run qa:components` | pass; fresh capture and baseline verification |
| `git diff --check` | pass |
| provider resolver reproduction | `48/48` values match |

The fresh QA report contains 332 surface/page records across 85 pages, 5,410
baseline checks, zero failures, and 86 PNG captures. Its surfaces include all
four built-in tiers plus the IBM Plex and Ubuntu engine smoke states.

## Browser review

The rebuilt demo was reviewed in the in-app Chromium browser after the fresh
QA capture:

- component atlas: captures loaded and the catalog remained visually intact;
- form atlas: Editorial at desktop width and OS at `720 × 900`, including
  fields, action insets, continuation alignment, tables, and responsive chrome;
- actions page: Documentation at desktop width after switching tier and tone
  controls;
- all four action-page tier selections: no document-level horizontal overflow;
- console: zero warnings or errors.

The constrained OS form state remained readable without clipped controls or
unexpected spacing expansion. The browser viewport was reset and the temporary
server stopped after review.

## Review gate

The prepared adversarial request is
`prompts/opus-token-architecture-pr3-adversarial-review.md`. A reviewer should
reject the change if it finds dual value ownership, a value change outside the
seven-point overlay, an inferred typography dependency, a non-bounded alias,
or any density/grid/Pragma scope leak. No push or merge is authorized before
that review and explicit owner approval.
