# Research: Sites Container-Owned Spacing

## Governing decision and precedence

**Decision**: The current owner direction supersedes BF's 2026-08 element-owned constitution and adopts the container-owned model in the current Canonical spacing draft: children keep baseline correction; containers own semantic separation.

**Evidence**: The reference defines the exact split as `padding-top = nudge`, `margin-bottom = baseline compensation`, and stack gap/structured transition = semantic spacing. Existing BF guidance says the opposite because Spec 001 deliberately overrode that draft. Current user direction has higher precedence and explicitly reverses that choice.

**Implication**: Amend `.specify/memory/constitution.md`, `AGENTS.md`, `docs/architecture.md`, `docs/spacing-ownership-peer-review.md`, and operator traps. Preserve archived specs unchanged and mark them superseded in the catalog.

## Existing App stack history

**Finding**: The owner recollection is historically correct but no longer true on `main`. Before Spec 001, App scoped `bf-stack` to a non-zero default and exposed density/section modifiers while neutralizing child semantic spacing. Commit `e500ae1` removed those rules when BF standardized all tiers on element-owned spacing.

**Decision**: Restore the small stack contract in the shared generator instead of adding Sites-only pattern margins. Use tier tokens so each surface retains intentional density. `is-flush` remains zero; `is-section` uses the regular section token.

**Alternative rejected**: Hard-code 1.5rem and 4rem into individual Sites patterns. That would duplicate public tokens and make nesting/pattern substitution brittle.

## Metric compensation formula

**Finding**: Current text occupies a baseline-aligned box using top and bottom padding whose sum is one baseline unit, plus a semantic margin derived from `spaceAfter - baseline`. The requested model keeps the same occupied grid phase but moves the complementary correction from bottom padding into bottom margin.

**Decision**: For a role with baseline unit `B` and measured top nudge `N`:

```text
padding-block-start = N
padding-block-end = 0
margin-block-end = B - N
container gap = semantic spacing
```

The element's line-height plus `N + (B - N)` remains a whole-baseline contribution. The legacy `spaceAfter` value is not part of this formula.

**Alternative rejected**: Set every text margin to zero and keep bottom padding compensation. That would preserve visual alignment but would not implement the explicitly requested top-padding/bottom-margin model.

## Flow and list boundaries

**Finding**: Current prose/card/panel final-child rules reset margin-bottom to zero because that margin contains semantic spacing. Under the new model the margin is compensation, so the same reset would break baseline alignment. Semantic list containers also currently own body space-after, while list items carry padding compensation.

**Decision**: Preserve final-child compensation and remove only semantic spacing by making semantic spacing exclusively a parent gap. List items use the same metric-only compensation, while the list container contributes no second semantic space-after. Structural lists keep their existing explicit resets.

## Token mapping

**Decision**: No new spacing scale is needed.

| Relationship | Public token | Editorial value |
|---|---|---:|
| Pattern internals / default Sites stack | `--bf-section-space-shallow` | 1.5rem |
| Pattern or section siblings | `--bf-section-space` | 4rem |
| Exceptional large CTA boundary | `--bf-section-space-deep` | 8rem (deferred) |

## Downstream proof route

**Decision**: Use Diagram Registry's Mermaid/Tools-style composition because it already contains a consumer-shaped tiered-list header and body plus adjacent complete sections. Vendor the feature build into an isolated Registry worktree, migrate the representative markup to nested `bf-stack` containers, and measure the 24px/64px relationships at 360px and 1280px.

**Alternative rejected**: Add Registry-local CSS to simulate the gaps. Registry validation forbids direct BF selector overrides, and such a patch would not prove the public contract.
