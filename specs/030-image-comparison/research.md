# Comparison extraction decisions and evidence

## Governing evidence

- Portfolio `specs/001-portfolio-renewal/reviews/2026-11-15-comparison-owner-direction.md`
  records the explicit local proof → Astra review → BF extraction → consumption
  sequence. `comparison-bf-handoff.md` and the status audit place T046 before
  extraction and supersede the older external presets/range-row recipe.
- Portfolio T046 source `a4882b2` is the current extraction candidate. Its fresh
  review is pending at planning; do not claim acceptance from earlier reviews.
- BF base `df966ac` adds consumer-continuation task documentation over caption
  product source `28422a9`; that source descends from `18857d9` with the existing
  Tab/Breadcrumb corrections. No unrelated feature branch merge is needed.
- BF constitution requires independently testable stories before implementation
  and adversarial source/API plus rendered demo review before closeout. It does
  not impose a new owner planning gate. Bucket sign-offs/missing-brief dispatch
  apply to bucket work; this independently requested package does not resume it.

## Why a new finite runtime

`src/range-controls.ts` exposes setup/init/fill helpers and native keyboard
semantics, but setup returns void, stores a dataset flag and adds anonymous
listeners. It cannot serve destroy/remount or the stage
gesture lifecycle without a separate explicit contract. Existing BF runtimes
that return cleanup functions supply repository precedent for scoped teardown;
do not copy incomplete active-gesture cleanup from another component.

Native input/change and pointer input meet in one normalizer and canonical-value
writer. One custom event channel avoids framework double handling; API updates
are silent. The runtime owns value, matching the concrete portfolio's mount-only
initialPosition API. Coordinator review rejected controlled modes and deferred
acknowledgement protocols as unearned scope. Continuous value-prop control and
stale-prop arbitration remain outside this minimal API. External setValue is
authoritative and ends an older gesture if the normalized value changes;
same-value calls do nothing. Synchronous event listeners can call setValue or
destroy safely; post-callback guards prevent stale gesture work.

## Coordinator-approved geometry

T046 aligns mask/seam/grip at the true 0–100 coordinate and reserves endpoint
runway. Its grip is 1.5rem wide and 80px high with a 2px focus outline/3px offset;
runway is half grip width plus 5px. Do not silently change the fixed decorative
height to a root-scaled 5rem or assign tier variants. Coordinator review accepted
these defaults across all tiers, with narrow public CSS inputs for grip inline/
block size and focus width/offset; runway derives from them. The out-of-flow
decoration does not set an occupied text/native-control row height. Endpoint,
style-input override, root-size and direct/shared-tier evidence remain required,
with zero layout border in normal and forced-colors modes.

## Intentional exclusions

The old handoff's delegated preset subsystem is unnecessary after the owner
removed duplicate visible controls; external consumer actions can call setValue.
Generic comparison does not own image sources/load/error UI, captions, project
headings, media snapping or Chip selected appearance. It must still preserve
selection while those consumer-owned descendants/metadata change. The current
portfolio scenario and independent BF demo evidence support this requested
bounded extraction; they do not establish a second consumer or universal fit.
