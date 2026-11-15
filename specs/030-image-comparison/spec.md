# Spec 030: Portable image comparison

**Feature branch**: `feat/030-image-comparison`
**Created**: 2026-11-15
**Status**: Technically accepted at `2524b24`; immutable candidate verified and handed to portfolio
**Base**: `df966ac80338b48eb798e42a5c2def76613720e8`

## Scope and authority

The portfolio owner explicitly requested local repair and independent Astra
review, followed by generic BF extraction and verified package consumption.
The latest endpoint/presentation correction is portfolio T046, source `a4882b2`.
Its fresh independent acceptance must be confirmed by the coordinating agent
before product extraction starts. Older drag/focus reviews do not satisfy this
dependency. Planning may proceed while that review runs.

Coordinator confirmation: independent `gpt-6-astra` accepts portfolio product
`027e95a60d277d8a52633404b336ec06698f6533`, including comparison source `a4882b2`.
The complete report is portfolio Spec 001
`reviews/2026-11-15-comparison-stage-astra-review.md`, committed at `4f88cb9`.
It accepts bounded local interaction/geometry and lockfile repair, retaining AT/
native zoom and inherited specimen-overflow limits. It does not accept a future
BF implementation or owner CP4. The local prerequisite is satisfied. Revised
minimal lifecycle and fixed decorative geometry are coordinator-approved;
product tasks may proceed.

Source `2524b24` now passes full required tests/component QA and
[independent Astra review](review.md), including the naming-ownership, opaque
layer-canvas and teardown corrections. [Validation](validation.md) records exact
scope and limitations. This permits candidate preparation under T009; no owner
visual acceptance, portfolio CP4 clearance or publication is inferred.

This is independently requested comparison work, separate from spacing buckets,
parked packages and Chip triage/design. It adds no owner planning checkpoint.
BF technical closeout still requires adversarial source/API and rendered demo
review. Portfolio CP4 and owner visual decisions remain portfolio-owned. No
merge, push, registry publication or deployment is authorized here. The current
planning dispatch requires coordinator inspection before any planning commit.

The base preserves caption repair `28422a9` and its consumer-continuation record,
alongside the Tab/Breadcrumb corrections in ancestor `18857d9`. Use this isolated
worktree; preserve every other worktree and BF's root checkout.

## Problem and reusable outcome

Two visual states need a direct, accessible reveal comparison. BF currently
offers native range controls but no public frame/runtime for image-stage drag,
clipping, endpoint geometry or a lifecycle usable by a framework adapter.
Portfolio supplies the concrete consumer scenario; BF's independent synthetic
panel demo must demonstrate the same contract without portfolio/React code.

BF owns the neutral stage, two visual slots, clipping, seam/grip, one native
range and pointer/focus lifecycle. Consumers own content, source/error rendering,
headings/captions, labels, aspect/height policy and application state. Portfolio's
baseline-snapped media height remains downstream. Do not claim another consumer
has independently validated reuse.

## Independently testable user stories

1. **P1 — Compare directly.** A reader drags/taps a stage or operates its single
   named native range with arrows/Home/End. One percentage drives native value,
   clipped area, seam, grip and value text. Zero and 100 fully expose opposite
   slots; grip and seam centers remain equal at both ends and near them.
2. **P1 — Cancel safely.** A reader scrolls vertically, pinches, cancels capture,
   presses Escape, switches to native keyboard input, or leaves during a drag.
   Horizontal intent commits; vertical intent does not jump selection. Cancel
   restores the starting selection; native input and API updates interrupt an
   older gesture and win. Secondary pointers/buttons cannot seize ownership.
3. **P1 — Integrate without duplicate state.** A plain-DOM consumer and a small
   framework adapter use the same public initializer, value update, notification
   and destroy contract. Setup is idempotent; source/label rerenders retain value;
   API echoes do not notify again; teardown during capture removes all handlers.
4. **P2 — Use every tier and direction.** The independent demo works in editorial,
   documentation, app and OS through direct and shared bundles, LTR/RTL,
   light/dark/forced-colors, constrained/wide containers and changed root sizes.
   Missing media, reduced motion and zero-width recovery preserve operability.

## Requirements and acceptance

- Default is 50. Explicit finite initial values, including zero, clamp to 0–100
  and round to step 1; invalid initial values use 50. Invalid subsequent API
  updates leave the accepted value unchanged. First-slot reveal is 100; second
  is zero. Endpoint names are consumer-supplied and reflected in value text.
- One native `input[type=range]` is the sole tab/AT value controller, named from
  a visible consumer label where available. Decorative seam/grip have no
  independent slider role/tab stop. No external duplicate slider, presets or
  output row and no surrounding image-stage frame are introduced.
- Consumers own the actual native accessible name using HTML/ARIA. The runtime
  does not infer, validate or rewrite AccName from textContent and exposes no
  accessible-name convenience API; it owns only value text/endpoint metadata.
  Unnamed markup is a consumer accessibility error that setup does not detect.
  Demo/adapter controls must still be effectively named, including rich/image
  labels. External name/association edits survive metadata update/destroy.
- Layers default to an opaque theme canvas: full reveal must not leak the other
  slot through contained-image letterboxing or transparent pixels. An explicit
  consumer transparent-canvas override opts out of opaque full-reveal behavior.
- Pointer geometry measures the current image stage, excluding outer endpoint
  runway. The exact selected percentage controls the mask, seam and grip; do not
  clamp the grip independently. Reserve enough outer runway for half the grip
  width plus focus paint/offset, including hosts without their own page gutter.
- Preserve T046's 1.5rem grip width, fixed 80px decorative grip height and
  three-bar glyph across all tiers, as accepted in coordinator review. Expose
  narrow CSS style inputs for grip width/block size and focus width/offset;
  derive runway from those inputs. Root-size changes preserve endpoint
  visibility. The decoration is outside text flow and does not establish an
  occupied native/text control height or arbitrary tier variants.
- The transparent in-stage native range remains keyboard/AT-operable while the
  stage owns pointer input. Touch allows vertical pan and pinch zoom; horizontal
  intent selects. Focus follows pointer operation without scrolling; visible
  focus appears for keyboard operation, including re-entry after nonfocusing
  pointer input. Use a flat `is-pointer-focus` modifier, never styled `data-*`.
- LTR/RTL clip orientation, pointer mapping and native range direction agree:
  first reveal grows from inline-start. Preserve native keyboard semantics;
  do not add competing manual arrow handlers. Images/content themselves are not
  mirrored. Prove actual native behavior in both directions.
- The runtime owns one canonical value mirrored in the native range. Its public
  lifecycle covers a mount-only initial value, authoritative silent imperative
  setValue, user input/change/cancel notifications, safe synchronous listener
  reentrancy, dynamic metadata, multiple instances and destroy/remount during
  capture. The framework adapter keeps no competing numeric value state.
- BF classes stay flat `bf-*`/`is-*`; directional positioning uses logical
  properties. Paint contributes zero layout border in all modes. Forced-colors
  uses BF's out-of-flow system-color border/inset-outline conventions. Generated
  output is rebuilt, never edited. No broad reset erases text compensation.
- Public exports/types, generated tokens/selectors, component geometry and demo
  behavior are support-equivalent across all four direct/shared tiers. Add
  meaningful static and browser assertions; run type checks, `npm test` and
  `npm run qa:components` before technical closeout, recording real limitations.

## Boundaries

No React dependency, project loader, app context, authored content, generic
split-pane, image snap algorithm, carousel, Chip redesign, font/nudge-generator
change, body-line phase, CSS `1cap`, release or unrelated demo/chrome changes.
Continuously controlled wrappers, deferred acceptance protocols and stale prop
arbitration are outside this minimal public API; external imperative updates
are authoritative and interrupt older gestures when the normalized value changes.
Portfolio repinning/adapter proof follows BF technical review through an immutable
package's public exports. Local Chrome evidence is input, not BF tier proof.
