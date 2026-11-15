# Plan: Portable image comparison

## Extraction dependency and file ownership

Do not change product files until the coordinator confirms fresh Astra
acceptance of portfolio T046 at `a4882b2` (or its reviewed corrective successor).
Record the actual reviewed source/evidence in this package before extraction.
This is a technical sequencing dependency, not a new owner approval gate.

Use a focused `src/image-comparison.ts` runtime and
`src/css-components/image-comparison.ts` generator, connected through
`src/index.ts` and component assembly. Token/type additions, if required, must
follow BF's existing shared/direct surface pipeline. Add a minimum independent
`demo/components/image-comparison.html` and catalog/runtime wiring; integrate
focused behavior, static, baseline and capture coverage into existing runners.
Names in this plan describe proposed files/API, not existing exports.

## Public structure and geometry

Proposed flat classes: `bf-image-comparison` (outer runway/host),
`bf-image-comparison-stage`, `bf-image-comparison-layer` with `is-first`/
`is-second`, `bf-image-comparison-seam`, `bf-image-comparison-grip` and
`bf-image-comparison-value` (native range). The range has min 0, max 100, step 1;
setup validates the required native element and rejects malformed structures
without leaving listeners behind. Each instance has its own stage/control.

Reserve runway outside the stage and measure the stage content geometry for
pointer mapping. Stage min-inline-size is zero, overflow remains visible for
the endpoint grip; each visual layer clips its own content. No surrounding
stage border. Seam and grip share one percentage coordinate. Logical inline
positioning and clip orientation respond to computed direction; physical client
coordinates are converted from left in LTR and right in RTL. Read current
geometry/direction during a gesture rather than freezing them at pointerdown.

The runtime owns a flat `is-rtl` modifier derived from the stage's computed
direction during setup/render, metadata update and pointer/native handling.
This controls physical clip/translation and also supports CSS direction overrides,
which `:dir()` alone cannot represent. Consumers changing direction while idle
call `update({})`; no broad mutation observer is introduced. During capture,
direction refresh occurs even when the normalized percentage is unchanged.

**Coordinator-approved geometry:** preserve the proven source's 1.5rem grip
width and fixed 80px decorative height across all four tiers. Do not convert
80px to 5rem or invent per-tier values. Document narrowly scoped CSS style inputs
`--bf-image-comparison-grip-inline-size` (1.5rem),
`--bf-image-comparison-grip-block-size` (80px),
`--bf-image-comparison-focus-width` (2px) and
`--bf-image-comparison-focus-offset` (3px). Derive outer runway from half the grip
inline size plus focus width and offset; do not duplicate those values in a
separate consumer formula. Test defaults and overrides at root 16/20 and in
constrained hosts. The grip is an out-of-flow decoration outside text flow, not
an occupied text/control row. Its fixed decorative height does not introduce a
native control target height or tier sizing exception. Grip/stroke/focus use BF
paint helpers where applicable, with zero layout borders including forced-colors.

The consumer supplies stable slots and stage sizing (e.g. existing aspect-ratio
composition). BF does not observe source load to reset selection or adopt the
portfolio snapping calculation. Replacing slot descendants is supported;
replacing the stage/native input requires destroy and setup. No presets ship in
this minimal API. Consumers may set values from external actions through the
public handle without a BF delegated-preset subsystem.

## Finite lifecycle and one state owner

Proposed public entry: `setupImageComparison(element, options)` returns an
`ImageComparisonController`; a WeakMap makes repeated setup of the same live
element return the same handle without applying new initial options. Required
elements are resolved at setup. The options select a mount-only `initialValue`
(default 50). Metadata comprises only first/second endpoint names. Consumers
author the native accessible name through HTML/ARIA. The runtime never infers
AccName, rejects rich labels based on textContent, or rewrites aria-label/
aria-labelledby/label content. Effective naming remains a consumer precondition
verified on demo/adapter controls. Setup validates structure, not effective
AccName; unnamed author markup is an accessibility error that this initializer
does not detect. No accessible-name convenience option ships.

The handle exposes `getValue()`, `setValue(number)`, `update({ firstLabel?,
secondLabel? })` and `destroy()`. `setValue` normalizes finite
numbers, silently applies the accepted value and synchronizes every visual/AT
representation. Invalid updates do nothing. A changed normalized value terminates
active capture before applying the new value, so old pointerup cannot overwrite
an external update. A same-value setValue is an explicit no-op and leaves an
active gesture intact. `update` refreshes names/value text without changing
value or rebuilding gesture handlers. No hidden source/preset observer owns
state. Changing DOM labels and calling update is safe during a source rerender.
Preserve all author labelling attributes and external name edits through destroy;
the runtime owns only its value text, not the control's accessible name.

The sole canonical value is the controller's current value, mirrored by the
native input and render output. Gesture bookkeeping may hold the starting value,
pointer id/intent; it is not a second rendered value. User input updates this
value and every representation before notifying. External imperative setValue
is authoritative, silent and never synthesizes native events. No controlled
mode, request/accept split or deferred acknowledgement protocol ships in this
slice. Continuously controlled wrappers and stale prop arbitration are outside
the supported minimal API. A framework adapter must not render a competing
native value prop or feed an older mirrored value back after every render.

## Notification and native event contract

Use one bubbling public custom event, `bf-image-comparison-change`, with detail
`{ value, phase: 'input' | 'change' | 'cancel', source: 'pointer' | 'native' }`.
The value is the normalized canonical value already applied when notification
begins. `input` represents a changed interactive value; `change` represents a
completed native edit/gesture; `cancel` reports restoration of the gesture's
starting value. The runtime restores that start before notifying.

Listen to native range input/change once. Read the browser's updated value,
normalize and synchronize every representation before dispatch. Native
keyboard behavior remains native, including RTL, Home/End and modifier keys.
The underlying native input/change events may still bubble; application adapters
subscribe only to the documented custom event, never both event channels.

Do not synthesize native input/change when applying pointer/API values. Pointer
updates dispatch the custom event directly. API `setValue`/metadata update never
emit it; echoing the current value into setValue cannot recurse or cancel capture.
Synchronous listeners may set a different value or destroy the controller. Guard
after dispatch for destruction and gesture ownership; never perform stale writes,
commit, rollback or capture release against a superseded gesture. An internal
generation/gesture identity guard is implementation bookkeeping, not public
state or an acknowledgement protocol. A native change phase can repeat the
final input value; that is a commit notification, not a second input. Pointer
commit emits once and cancel
emits once; redundant same-value pointer moves do not emit input. Teardown inside
a notification is safe and prevents subsequent gesture work.

## Pointer, focus and destruction

Preserve the reviewed local intent/capture/rollback behavior while removing React
state/effects. Accept one primary left-button pointer. Touch defers focus/value
updates until horizontal intent or a deliberate tap; vertical pan/pinch remains
available. Use current stage geometry and release coordinate. Escape, pointer
cancel and unexpected capture loss end the gesture and restore its start.
Native range input interrupts older capture and wins. A programmatic update
interrupts without rolling back its new value when that value differs. A
same-value call is a no-op. Test synchronous setValue/destroy from each event
phase, including pointer-up handlers that must not continue stale work after a
listener interrupts the gesture. No framework render timing assumption is needed.

Programmatic pointer focus uses preventScroll. A flat `is-pointer-focus` state
suppresses the decoration's keyboard ring only for pointer modality; blur/keyboard
entry clear it. Preserve the reviewed nonfocusing click/vertical-pan cases.
Decorative layers must not create a separate focus or state owner.

Destroy is idempotent: end active gestures without notifying a departing
consumer, release capture, remove temporary/global and element listeners,
disconnect observers/cancel frames if introduced, clear runtime-owned modifiers
and styles/ARIA writes while preserving consumer markup/content, and remove the
WeakMap entry. Stale handle mutation methods do nothing after destroy; getValue
returns the last value. A new setup after destroy may select a new initial value.
Do not copy existing range-control anonymous listeners or its dataset
initialization flag as lifecycle infrastructure.

## Framework and package boundary

Plain DOM and BF's independent demo use the public export. A thin downstream
React adapter mounts setup once and destroys once, subscribes once to the custom
event, and updates metadata through the handle. The runtime owns the numeric
value; the adapter keeps no parallel React numeric state and uses the mount-only
initialPosition only during setup. Source/ratio/label rerenders do not call
setValue or recreate the controller. An intentional external action may invoke
setValue directly. The callback uses fresh props or a ref without reinitializing
the runtime. A continuously controlled wrapper with value props, deferred
acceptance and stale-prop arbitration is outside this minimal supported API.
Source/ratio/label rerenders preserve the stable host/control.
No React code/dependency is added to BF.

After source/API plus rendered review and required suites, build an immutable
candidate and record exact source and artifact hash. Portfolio owns pinning,
theme generation, adapter replacement, real-font/caption and route proof. Keep
caption/Tab/Breadcrumb repairs in the package and preserve the recorded H3/H4
observation. No registry release or branch merge follows automatically.
