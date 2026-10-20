# Feature specification: Shared spacing decisions

**Feature branch**: `feat/028-shared-spacing-decisions`

**Status**: Scope reset 2026-10-10. D2 and OS dense 0 are owner-approved, and
the implemented BF seats apply the approved values in all four tiers. Density
family/placement coverage remains incomplete: the historical Site Table/Chip
proof does not cover compound seats/actions or Nav/Tabs. Owner bucket visual
sign-off also remains open. Earlier review history is below and in `tasks.md`.

## Scope reset, 2026-10-10

BF is the sandbox where Canonical spacing decisions are tried on real
components. The deliverables live in Spec 024: the spacing architecture
article, the Pragma token spec and the semantic tokens. This package
therefore:

- shows each spacing bucket on its own **comparison page** – members side by
  side, led by a reference element, Before/After, tier switch, baseline grid
  (Spec 024 FR-046, tasks T110–T112);
- does not use composite or legacy example pages (ApplicationLayout,
  DrawerPanel, page shells) as review targets;
- treats a BF defect as in scope only when it stops a bucket page from
  showing a spacing decision. A BF finding that reveals a missing rule goes
  into Spec 024 as a rule; the BF repair is optional;
- has no merge, release, provenance re-pin, CI or dependency-audit gate. BF
  can merge this branch whenever its owner wants.

## Purpose

Apply the approved and working shared-spacing rulings to Baseline Foundry's
real built-in components and make those demo surfaces the visual review target.

The governing rules and cross-repository status live in the Spec 024
[rulings](../../../../canonical-spacing-spec/docs/rulings.md)
and [conformance board](../../../../canonical-spacing-spec/specs/024-semantic-spacing-token-schema/conformance.md).
This package records only BF implementation, evidence and review state.

## Acceptance

- Every BF column on the conformance board names the implementation and check.
- Built-in Site, Docs, App and OS bundles remain source-of-truth outputs.
- One comparison page per spacing bucket, on real BF components, with the
  same markup Before and After; only the BF bundle switches.
- The owner signs off each bucket page; the record lives in Spec 024
  `tasks.md`.
- Type and test gates pass from the repository root.

## Boundaries

- No body-phase or Spec 026 implementation.
- No custom preview configuration.
- Frozen neutral diagnostics are unchanged.
- No demo-chrome work unless a bucket page cannot render.
- Browser coverage is Chromium. Firefox, Safari and Windows contrast themes
  belong to Pragma adoption, not to this sandbox.

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

The actual October 9 follow-up verdict requests medium R1 changes: the shared
footer stayed focusable beneath the drawer. Opus accepted the R1 correction
and complete Tab-cycle regression checks in response to the
[correction request](reviews/opus-028-r1-correction-review-request.md). N2–N5
dispositions are accepted. N3 release wording is inputs with no `type` attribute;
empty/invalid types are not added by that selector. At the R1 pin,
ApplicationLayout's mobile chrome overlap remained a separate
limitation. The subsequent bounded demo repair completes that mobile
prerequisite; wider-layout Pin pointer overlaps and product non-modal background
focus remain explicit limitations. R1 does not claim every drawer page is
corrected.

The accepted R1 receipt remains untracked and unchanged at
`opus-028-r1-correction-review.md`, SHA-256
`04630d8de77da208b7e11c9f17af3cc3dedfed22b16aff6fedb9b2f3bc8955df`.
Its two non-blocking notes are addressed by clarifying the CSS comment and
retaining the catalog rail's `display: none`. No executable CSS changes.
