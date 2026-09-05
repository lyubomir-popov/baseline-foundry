# Opus request: adversarial correction review of BF token-architecture PR 3

Perform a read-only, adversarial correction review of Baseline Foundry's PR 3
spacing format adapter. The first review returned **accept with required
corrections**; do not assume those corrections work because the implementation
evidence says so.

Read every applicable `AGENTS.md` first, then read:

- `H:\WSL_dev_projects\baseline-foundry-worktrees\feat-dtcg-spacing-format-adapter\AGENT-INBOX.md`
- `H:\WSL_dev_projects\baseline-foundry-worktrees\feat-dtcg-spacing-format-adapter\docs\cross-repo-token-architecture-spec.md`
- `H:\WSL_dev_projects\baseline-foundry-worktrees\feat-dtcg-spacing-format-adapter\docs\cross-repo-token-architecture-implementation-handoff.md`
- `H:\WSL_dev_projects\baseline-foundry-worktrees\feat-dtcg-spacing-format-adapter\docs\cross-repo-token-architecture-signoff-review.md`
- `H:\WSL_dev_projects\baseline-foundry-worktrees\feat-dtcg-spacing-format-adapter\docs\cross-repo-token-architecture-pr3-implementation-review.md`
- `H:\WSL_dev_projects\baseline-foundry-worktrees\feat-dtcg-spacing-format-adapter\docs\cross-repo-token-architecture-pr3-adversarial-review.md`
- `H:\WSL_dev_projects\baseline-foundry-worktrees\feat-dtcg-spacing-format-adapter\docs\spacing-token-adapter.md`

Review this local range:

```text
repository: H:\WSL_dev_projects\baseline-foundry-worktrees\feat-dtcg-spacing-format-adapter
base:       08db5abdd4f3c96644a556a07790fe4bf36cd379
change:     all commits above the base, including the F0-F6 correction
branch:     feat/dtcg-spacing-format-adapter
```

Reproduce provider claims from the actual design-tokens checkout at
`H:\WSL_dev_projects\design-tokens`, commit
`18f57b95b1aa1dfe85a45746016b055c807d6628`. You may inspect Pragma at
`H:\WSL_dev_projects\pragma`, but PR 3 must not change or adopt it.

Do not edit, commit, push, merge, publish, release, switch branches, or
implement fixes. Do not treat generated `dist/` files as source.

## Required outcome and prohibited scope

The PR must consume the twelve approved resolved DTCG `spacing.*` records for
Site, Docs, App, and OS and preserve BF's current computed geometry. Exactly
seven current BF values differ from the final Canonical matrix until the
separately approved `BF 020a spacing-value adoption`: Docs
action/continuation; App mark/action/continuation; OS action/continuation.

Do not pre-accept how the implementation divides CSS or manifest ownership.
A valid result must not publish a compatibility value under a Canonical name,
let the artifact drift at an overlaid point, or make a BF-owned custom theme
claim Canonical provenance.

Density, grid/page work, control heights, target baselines, root scaling,
Pragma adoption, publication, and release are prohibited scope expansions.

## Required review questions

Answer each explicitly and cite exact source or generated-artifact evidence.

1. Does production code authenticate all 48 complete provider records, or can
   any value—especially an overlaid point—mutate while the build stays green?
   Red/green each point through the exported production validator; do not
   credit a test-only final matrix as production integrity.
2. Does the runtime/build path genuinely consume DTCG dimension records for
   every built-in tier, rather than validating a sidecar while legacy config
   remains the real owner?
3. Are post-overlay values exactly BF's full pre-adapter 4 × 12 matrix, with
   no geometry change hidden by a partial fixture?
4. Is the overlay exactly the seven approved points, structurally unable to
   accept empty/extra products or IDs, and bound to one removal condition?
5. Does every emitted Canonical `--spacing-*` property carry the final
   provider value, while only BF compatibility properties carry the seven
   retained values? Inspect direct and class-switched output for duplicates,
   overrides, cycles, and unresolved values.
6. Are `canonicalSpacing`, effective `spacing`, and the old `baselineUnit`,
   `layout`, and `components` projections internally truthful and unable to
   diverge silently? Do public types and manifests distinguish them?
7. Does the OS path consume explicit product spacing despite Canonical's
   intentionally omitted identical `.os` typography reset, without inventing
   or depending on that reset?
8. Load the provider's actual generated `sets.primitive.css` and
   `sets.semantic.css` with BF in both orders. Separately exercise direct and
   nested product scopes as a hypothetical future-provider case. Are both
   matrices stable, or does the unnamespaced surface introduce an order,
   layer, specificity, or inheritance defect? State the behavior for
   mismatched Canonical/BF product classes.
9. Do custom themes and experiments stay BF-namespaced, with no
   `canonicalSpacing` record or unnamespaced `--spacing-*` declarations? Is
   the built-in config edit path explicit rather than silently assertion-only?
10. Do static, baseline, behavior, and browser checks establish no visible or
    occupied-geometry regression across all four tiers? Identify any untested
    high-risk surface.
11. Did the diff touch generated outputs or leak into 020a values, density,
    grid/page work, control height, root scaling, Pragma, publication, or
    release behavior?
12. Is this branch ready for a direct fast-forward into BF `main`? Separate
    blockers from non-blocking improvements and later approved work.

## Adversarial probes

Try malformed copies of the artifact and overlay: change each of the 48 values
one at a time (including all seven overlaid points), alter the declared digest,
use a wrong provider path, add/remove a product or token, use a non-`rem`
dimension, add an empty overlay product, and change the removal condition.
Confirm failures come from production validation, not only the test harness.

Independently inspect generated CSS and manifests rather than trusting source
intent. Inspect a genuinely custom-theme build. Re-run the smallest sufficient
checks, including a direct resolver comparison against design-tokens and a
real provider-CSS/BF co-loading probe in both import orders and nested scopes.

## Output

Write the review to:

- `H:\WSL_dev_projects\baseline-foundry-worktrees\feat-dtcg-spacing-format-adapter\docs\cross-repo-token-architecture-pr3-correction-review.md`

Use this structure:

1. **Verdict:** `accept`, `accept with required corrections`, or `reject`.
2. **Blocking findings:** severity, evidence, consequence, and smallest
   correction; say `none` if there are none.
3. **Answers to questions 1–12.**
4. **Reproduced matrices and CSS ownership evidence.**
5. **Scope audit and OS-asymmetry audit.**
6. **Validation gaps and non-blocking follow-ups.**

End by stating whether the branch is ready for its owner-approved direct
fast-forward into BF `main`. Do not perform the merge or authorize publication,
release, Pragma adoption, or 020a value adoption.
