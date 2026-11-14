# Spec 029: Preserve figure-caption metric compensation

**Feature branch**: `feat/029-figure-caption-compensation`
**Created**: 2026-11-14
**Status**: Technically validated; isolated consumer candidate authorized, not merged or published

## Scope and authorization

The owner requested continuation of portfolio's
`specs/001-portfolio-renewal/HANDOFF.md`, starting with the Astra-confirmed
shared figure-caption regression. This package isolates that repair from
canonical Spec 024/BF Spec 028 and the parked text-phase work. The branch starts
at `18857d9dacabd95a07b590d9511bc27311b9666f`, the consumer candidate's exact
source, retaining its Tab/Breadcrumb corrections without merging other work.
Implementation and validation are authorized by that continuation request.
The handoff also authorizes an isolated packaged candidate and portfolio proof
after upstream technical review. No merge, push, publication, owner visual
acceptance, or portfolio checkpoint clearance is implied.

## Review boundary

The BF constitution requires adversarial source/API review and rendered demo
review before technical closeout; [review.md](review.md) records them. This
bounded contribution adds no new owner gate. Portfolio CP2/CP3/CP4 remain
pending, and only the owner can clear them. The spacing-bucket sign-offs
do not route this independently requested caption repair.

## Problem

The later `.bf-figure-caption { margin-block: 0 }` erases a native figcaption's
generated metric end margin. Portfolio's real Plex Italic caption occupies
30px at a 16px root. After two fixed-media figures the following body baseline
lands at 884px, four pixels off its 8px grid. The current generated meta role
requires 10px end compensation (at least the 6px nudge), giving 40px occupancy
and a following baseline of 904px. The historical 32px caption used the old
padding-closure rule; 32px/888px are not current-contract acceptance targets.
Isolated meta-role tests missed this component cascade.

## User scenarios

- **P1** A reader sees a single-line or wrapped italic caption, then body copy
  or a heading. The caption preserves its text role's metric nudge and end
  compensation, and following content retains its reference baseline phase.
- **P1** A consumer uses native figcaption, an explicit meta role, or a body
  visual role on a native figcaption. The component preserves the selected
  role's metrics and existing style/color precedence in all four tiers.
- **P2** A reader views the figure demo at constrained and wide widths. The
  image/caption gap remains figure-owned and text wraps without overflow.

## Requirements and acceptance

- Remove only the component's end-margin reset; retain a zero start margin,
  italic/color semantics, and the figure's container-owned gap.
- Assert the generated component rule cannot reset metric end compensation.
- Render single/multiline captions followed by body/headings, across all four
  tiers, direct/shared bundles, 240px/640px containers and light/dark tones.
  Compare native and explicit-role metrics with independent role references;
  assert occupied closure and composed continuation, not screenshots alone.
- Use the affected catalog demo for rendered review, including following copy.
- Run type checks, `npm test` and `npm run qa:components`, recording actual
  failures/limitations without expanding scope to unrelated repairs.
- Obtain adversarial source/API and rendered demo review before closeout.

## Boundaries

No font/nudge-generator changes, cap engine, body-line phase, consumer offsets,
new public API, release, or unrelated demo/chrome changes. Consumer artifact
hashes and real Plex evidence remain owned by portfolio after acceptance.
