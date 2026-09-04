# TODO: execution order

This file owns cross-spec order and a short unnumbered backlog. Spec status lives
in `docs/specs.md`; per-spec tasks live in the package.

## Now

Spec 021 is active on `feat/021-block-derived-inline-geometry`. Its
member-specific painted-block implementation and four-tier rendered checks are
in re-review follow-up. The latest resolution moves chips to the Action inset,
makes inline icon-target clearance travel with each button, gives the built-in
wrapping `.bf-actions` and `.bf-cluster` primitives a baseline-rounded row-gap
floor, and makes direct icon targets inside `.bf-actions.is-nowrap` own only
their required block margins. Text-only nowrap strips therefore keep their
original footprint and keyline. The unused public opt-in classes are removed,
plain and middot inline lists share one fixed half-rem space and baseline-align,
and unsupported bordered nested icon membership remains excluded. Final local
gates are green at 19,513 static checks plus fresh component QA. Opus accepted
the geometry; its final contract-disclosure corrections are implemented, so
only owner acceptance remains. Do not merge, publish, release, or begin Spec
020 without separate closeout direction.

After Spec 021 is accepted, promote Spec 020 on a fresh branch. Spec 020
supersedes unimplemented Spec 019 and owns the approved horizontal matrix. Its
quantisation audit must classify the WCAG-derived icon-target margins and
the built-in wrapping-row floor as accessibility geometry, not authored
spacing, and must replace the provisional `--bf-inline-list-space: 0.5rem`
horizontal-composition fact with the canonical token it defines. No OS 9px
action-gap exemption is needed; that contextual gap was removed in Spec 021.

## Candidate order after Spec 001

These are candidates, not active work. Promote one to a numbered package on a
matching feature branch only when its catalogued evidence trigger is met.

1. Shared authoring shell and document frame, after two consumers expose the
   same top-navigation/stage/aside seam.
2. Product-specific credential orchestration beyond the shipped BF password
   reveal and repeated validation/help composition, after a consumer proves a
   shared workflow rather than another field state.
3. Framework- or data-source-specific table orchestration beyond the shipped
   sortable, expandable and mobile-card contracts, after runtime/state
   ownership is known.
4. Media-object breakpoint retuning beyond the shipped BF composition, only
   after a second consumer proves that the current intrinsic threshold fails.

## Unnumbered backlog

- Switch versus slider track language.
- Downstream-generated authoring chroma surface; never a built-in tier by
  default.
- Processing-button state and runtime strategy.
- Decide whether BF eventually becomes `@design-foundry/shell` or stays an
  independently published peer.
