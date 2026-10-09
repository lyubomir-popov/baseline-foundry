# Feature specification: Shared spacing decisions

**Feature branch**: `feat/028-shared-spacing-decisions`

**Status**: Bounded corrections accepted by Opus; mobile chrome follow-up
verified and ready for bounded external review before owner visual sign-off

## Purpose

Apply the approved and working shared-spacing rulings to Baseline Foundry's
real built-in components and make those demo surfaces the visual review target.

The governing rules and cross-repository status live in the Spec 024
[rulings](../../../../canonical-spacing-spec-worktrees/docs-bottom-compensation-spec/docs/rulings.md)
and [conformance board](../../../../canonical-spacing-spec-worktrees/docs-bottom-compensation-spec/specs/024-semantic-spacing-token-schema/conformance.md).
This package records only BF implementation, evidence and review state.

## Acceptance

- Every BF column on the conformance board names the implementation and check.
- Built-in Site, Docs, App and OS bundles remain source-of-truth outputs.
- Before/After runs on existing BF demo pages through their shared controls,
  layout, baseline grid and component initializers. Specimens keep the same
  markup while the BF bundle switches; legitimate BF page-layout differences
  must not be attributed to a separate unchanged shell.
- Type, test and component QA gates pass from the repository root.
- Desktop and mobile evidence covers every tier at Chromium launch scales 1 and
  1.5, with a hashed manifest.

## Boundaries

- No body-phase or Spec 026 implementation.
- No custom preview configuration.
- Frozen neutral diagnostics are unchanged.
- Canonical main activation and a final full-main-SHA re-pin remain prerequisites
  to BF main adoption. Feature corrections do not authorize a merge.
- Chromium covers the comparison and focused paint/runtime checks. Firefox 155
  has a focused eight-state nested-density audit; that is not a complete
  Firefox component/interaction matrix. Windows contrast-theme, actual display
  scaling and Safari review remain separate platform limits.

## External review receipt

The original [Opus report](opus-028-review.md) requests changes to native-field
compatibility, Tooltip anchoring, table popup behavior, Card overflow disclosure,
leaf paint ownership, exact assertions, demo dogfooding and provenance. The
accepted first-cut numerical evidence remains historical; its internal
paint/runtime acceptance does not close these findings. See [tasks](tasks.md)
for the completed correction queue and the
[correction request](opus-028-corrections-review-request.md).

The October 7 external correction receipt accepts those bounded repairs. It
remains untracked and unchanged at `opus-028-corrections-review.md`, SHA-256
`f3f0dc8b3409eeb3773e951b1b2ad62ce1b5bef837bd236601d65692493d4183`.
It requires the N1 shared mobile catalog toggle overlap to be fixed before
the owner's visual pass. The October 9 follow-up is limited to that chrome
repair and explicit N2–N5 dispositions. It does not reopen the accepted
spacing implementation or imply owner acceptance of accessibility deviations.
