# Opus request: adversarial review of BF token-architecture PR 3

Perform a read-only, adversarial implementation review of Baseline Foundry's
PR 3 spacing format adapter.

Read every applicable `AGENTS.md` first, then read:

- `H:\WSL_dev_projects\baseline-foundry-worktrees\feat-dtcg-spacing-format-adapter\AGENT-INBOX.md`
- `H:\WSL_dev_projects\baseline-foundry-worktrees\feat-dtcg-spacing-format-adapter\docs\cross-repo-token-architecture-spec.md`
- `H:\WSL_dev_projects\baseline-foundry-worktrees\feat-dtcg-spacing-format-adapter\docs\cross-repo-token-architecture-implementation-handoff.md`
- `H:\WSL_dev_projects\baseline-foundry-worktrees\feat-dtcg-spacing-format-adapter\docs\cross-repo-token-architecture-signoff-review.md`
- `H:\WSL_dev_projects\baseline-foundry-worktrees\feat-dtcg-spacing-format-adapter\docs\cross-repo-token-architecture-pr3-implementation-review.md`
- `H:\WSL_dev_projects\baseline-foundry-worktrees\feat-dtcg-spacing-format-adapter\docs\spacing-token-adapter.md`

Review this local range:

```text
repository: H:\WSL_dev_projects\baseline-foundry-worktrees\feat-dtcg-spacing-format-adapter
base:       08db5abdd4f3c96644a556a07790fe4bf36cd379
change:     48e13b2 and the review-evidence commit above it
branch:     feat/dtcg-spacing-format-adapter
```

Reproduce provider claims from the actual design-tokens checkout at
`H:\WSL_dev_projects\design-tokens`, commit
`18f57b95b1aa1dfe85a45746016b055c807d6628`. You may inspect Pragma at
`H:\WSL_dev_projects\pragma`, but PR 3 must not change or adopt it.

Do not edit, commit, push, merge, publish, release, switch branches, or
implement fixes. Do not treat generated `dist/` files as source.

## Settled scope

This PR is a format adapter only. It must consume the twelve approved resolved
DTCG `spacing.*` records for Site, Docs, App, and OS while preserving BF's
current computed geometry. Canonical properties become the literal owners and
existing BF properties become one-way compatibility aliases.

Exactly seven current BF values may differ from the Canonical final matrix,
through one BF-local overlay removable only by `BF 020a spacing-value
adoption`: Docs action/continuation; App mark/action/continuation; OS
action/continuation. Do not ask this PR to adopt the final values.

Density, grid/page work, control heights, target baselines, root scaling,
Pragma adoption, publication, and release are prohibited scope expansions.

## Required review questions

Answer each explicitly and cite exact source or generated-artifact evidence.

1. Does BF reproduce all 48 provider values from the real design-tokens
   resolver at the pinned commit, or can the checked-in artifact drift while
   tests remain green?
2. Does the runtime/build path genuinely consume DTCG dimension records for
   every built-in tier, rather than merely validating a sidecar while legacy
   config remains the real owner?
3. Are the post-overlay values exactly equal to BF's full pre-adapter 4 × 12
   matrix, with no geometry change hidden by a partial fixture?
4. Is the overlay exactly the seven approved points, structurally unable to
   accept empty/extra products or IDs, and bound to one explicit removal
   condition?
5. In every direct and class-switched tier surface, does each canonical CSS
   property have one literal owner and each BF name one canonical-direction
   alias? Look for duplicate declarations, cascade overrides, cycles, and
   unresolved references in the generated artifacts.
6. Are the old `baselineUnit`, `layout`, and `components` projections now
   compatibility views of the DTCG record, or can they diverge silently?
   Include custom-theme behavior and public type/API consequences.
7. Does the OS path correctly consume explicit product spacing despite
   Canonical's intentionally omitted identical `.os` typography reset, without
   inventing or depending on that reset?
8. Do static, baseline, behavior, and browser checks establish no visible or
   occupied-geometry regression across all four tiers? Identify any untested
   high-risk surface.
9. Did the diff touch generated outputs or leak into 020a values, density,
   grid/page work, control height, root scaling, Pragma, publication, or
   release behavior?
10. Is this branch ready to push for PR review? Separate blockers from
    non-blocking improvements and later approved work.

## Adversarial probes

Try malformed copies of the artifact and overlay where useful: wrong provider
path, missing/extra product, missing/extra token, non-`rem` dimension, extra
empty overlay product, changed removal condition, or a typography baseline
that disagrees with spacing. Confirm failures come from production validation,
not only from the test harness.

Independently inspect generated CSS and manifests rather than trusting source
intent. Re-run the smallest sufficient checks, including a direct resolver
comparison against design-tokens.

## Output

Write the review to:

- `H:\WSL_dev_projects\baseline-foundry-worktrees\feat-dtcg-spacing-format-adapter\docs\cross-repo-token-architecture-pr3-adversarial-review.md`

Use this structure:

1. **Verdict:** `accept`, `accept with required corrections`, or `reject`.
2. **Blocking findings:** severity, exact evidence, consequence, and smallest
   correction; say `none` if there are none.
3. **Answers to questions 1–10.**
4. **Reproduced matrices and CSS ownership evidence.**
5. **Scope audit and OS-asymmetry audit.**
6. **Validation gaps and non-blocking follow-ups.**

End by stating whether the branch may be pushed for PR review. Do not authorize
merge, publication, release, Pragma adoption, or 020a value adoption.
