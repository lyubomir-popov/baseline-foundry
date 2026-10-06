# Feature specification: Shared spacing decisions

**Feature branch**: `feat/028-shared-spacing-decisions`

**Status**: In progress

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
- The before/after demo uses identical markup and switches only the BF bundle.
- Type, test and component QA gates pass from the repository root.
- Desktop and mobile evidence covers every tier at Chromium launch scales 1 and
  1.5, with a hashed manifest.

## Boundaries

- No body-phase or Spec 026 implementation.
- No custom preview configuration.
- Frozen neutral diagnostics are unchanged.
- Windows contrast-theme and Safari review remain human-only.
