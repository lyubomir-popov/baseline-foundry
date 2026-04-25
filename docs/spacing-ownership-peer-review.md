# Spacing Ownership Peer Review

This note is written as a neutral architecture review, not as a restatement of the current spec or a defense of the current repo.

## Bottom Line

- Baseline compensation should stay element-owned.
- Semantic vertical rhythm should have exactly one owner per surface.
- Editorial and documentation surfaces should make the element the semantic-spacing owner.
- Application surfaces should make the container the semantic-spacing owner.
- The strongest split is: element padding owns nudge and nudge compensation; semantic `margin-bottom` is element-owned in editorial/docs and container-neutralized in app.

## Why This Holds Up

- Padding and margin express different responsibilities. `padding-block-start` and `padding-block-end` tune the element's internal box so its baseline lands correctly; `margin-bottom` expresses the element's relationship to following content.
- A surface needs one semantic-spacing owner, not two. When both element and container participate in vertical rhythm on the same surface, debugging becomes ambiguous and composition gets brittle.
- Editorial spacing is content-sensitive. Headings, paragraphs, figures, captions, and lists do not all want the same separation, so the semantic spacing belongs closest to the content that knows what it is.
- Rich text, markdown, CMS output, and prose-heavy surfaces compose better when spacing travels with the element. Requiring wrapper patterns to recreate semantic rhythm turns normal content flow into a layout orchestration problem.
- Container-owned spacing is strongest when children are intentionally interchangeable and density is deliberate, which is exactly the application-UI case.
- Hybrid editorial ownership duplicates decision-making. If the element owns compensation but the container owns semantic spacing, the system splits one vertical rhythm model across two authors and both sides need more exceptions.
- Last-child and flow-boundary resets stay easier to reason about when semantic spacing has a clear owner. A local boundary reset is simpler than trying to infer semantic spacing from the parent pattern.
- The model scales better under substitution. If a paragraph becomes a figure, a heading becomes a list, or a component slot receives different content, element-owned editorial spacing survives without requiring pattern-specific gap rewrites.

## What I Would Reject

- Container-owned spacing as the universal default across both editorial and app surfaces.
- An editorial hybrid where elements own only nudge and nudge compensation, but containers own semantic spacing.
- A model that relies on wrappers to recreate prose semantics that the child elements already know.

## What I Would Approve

- Keep nudge and nudge compensation on the element through `padding-block-start` and `padding-block-end`.
- Keep semantic `margin-bottom` on editorial and documentation elements.
- In app surfaces, reset semantic text margins to `0` and let layout containers define gaps.
- Treat stack gap density as an app-surface concern rather than a universal default.

## Repo-Facing Implication

- Non-app `bf-stack` should stay gapless, including its density and section modifiers.
- `bf-tier-app` can keep `bf-stack` gap modifiers because app surfaces intentionally use container-owned spacing.
- If another non-app surface later wants container-owned vertical spacing, that should be an explicit surface policy decision, not the default behavior of the shared stack primitive.