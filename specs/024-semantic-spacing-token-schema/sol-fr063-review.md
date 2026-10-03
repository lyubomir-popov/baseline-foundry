# FR-063 independent adversarial review

## Reviewer and verdict

Date: 2026-10-04. Identity: **I am GitHub Copilot.** The underlying model identifier is not exposed to this session, so I cannot truthfully name a specific GPT, Claude or other model/version. This is a disclosure limitation, not a claim to be the authoring model or the checkpoint A reviewer.

**Verdict: accept with bounded corrections.** Accept stroke-independent geometry and the uniform spread shadow. Before family sign-off, resolve forced-colours focus ownership, narrow the rounded per-side claim, specify valid shadow composition and clearance limits, and bound native-control/divider/table adoption. Do not interpret this as approval of an untested universal border replacement.

## Files reviewed

Pragma source paths below are relative to `H:/WSL_dev_projects/pragma`. The review package is `H:/WSL_dev_projects/baseline-foundry-worktrees/feat-024-semantic-spacing-token-schema/specs/024-semantic-spacing-token-schema`; the spacing draft is `H:/WSL_dev_projects/canonical-spacing-spec/specs/spacing/draft.md`.

- [Review request](sol-fr063-review-request.md).
- [Spec 024](spec.md#L788): FR-063, FR-039/039a1/039d/039f supersessions, FR-044/044a and FR-057.
- [Spacing draft](../../../../canonical-spacing-spec/specs/spacing/draft.md#L188): sections 2.8.1, 2.8.2 and 3.3.
- [Checkpoint A review](opus-A-review.md): F1 and its measured fractional-DPR shortfalls.
- [packages/react/ds-global-form/src/index.css](packages/react/ds-global-form/src/index.css#L236): field borders, hooks, radius, focus and error rules.
- [packages/react/ds-global-form/src/lib/subcomponent/SelectInput/styles.css](packages/react/ds-global-form/src/lib/subcomponent/SelectInput/styles.css#L12) and [packages/react/ds-global-form/src/lib/subcomponent/RangeInput/styles.css](packages/react/ds-global-form/src/lib/subcomponent/RangeInput/styles.css#L15): native appearance and internal UA chrome.
- [packages/react/ds-app/src/lib/SideNavigation/common/Item/styles.css](packages/react/ds-app/src/lib/SideNavigation/common/Item/styles.css#L43) and [packages/react/ds-app/src/lib/SidePanel/styles.css](packages/react/ds-app/src/lib/SidePanel/styles.css#L90): selection shadow, focus outline, elevation and clipping.
- [packages/react/tokens/src/lib/TokenTable/common/TokenSwatch/styles.css](packages/react/tokens/src/lib/TokenTable/common/TokenSwatch/styles.css#L27), [packages/react/ds-global/src/lib/component/Chip/styles.css](packages/react/ds-global/src/lib/component/Chip/styles.css#L23), [packages/svelte/ds-app-launchpad/src/lib/components/Table/styles.css](packages/svelte/ds-app-launchpad/src/lib/components/Table/styles.css#L1) and [packages/styles/main/src/reset.css](packages/styles/main/src/reset.css#L67).

Searched tracked Pragma package source for `box-shadow`, `outline`, `forced-colors` and `base-select`, excluding generated build caches. No tracked `forced-colors` or `base-select` occurrence was found. This is evidence about the present source, not proof that a consuming application has no overrides. No source file was changed.

## Evidence and limits

Ran in-memory Playwright specimens, with PNG pixel reads held in memory, on **Chromium 151.0.7922.34**. No bench, screenshot or measurement file was written. Firefox and WebKit default launches failed because their required revisions were absent; I did not install browsers. Safari was not tested. Playwright WebKit would not, by itself, certify Safari on macOS/iOS.

The border specimen used `line-height:24px; padding:3px; border:1px solid`; the shadow specimen used the same line height, `padding:4px; border:0; box-shadow:inset 0 0 0 1px black`. Launching Chromium with `--force-device-scale-factor=S` and a context with `viewport:null` gave:

| Scale / reported DPR | Border used width | Border box height | Shadow box height |
| --- | --- | --- | --- |
| 1 | 1px | 32px | 32px |
| 1.25 | 0.8px | 31.600000px | 32px |
| 1.5 | 0.666667px | 31.333334px | 32px |
| 2 | 1px | 32px | 32px |

This independently supports F1 and the geometry remedy. It is a minimal specimen, not a production control or font/density acceptance run. Importantly, context-only `deviceScaleFactor:1.25/1.5` reported those DPRs but retained a 1px layout border and a 32px box: that emulation alone did **not** reproduce F1.

## Findings and eight pressure points

### 1. P1 – Forced-colours focus needs an explicit outline ownership policy

**Evidence.** Chromium and Firefox support Windows forced colours: with normal colour adjustment, shadows disappear, while a solid outline can remain and use system colours. Negative offsets are supported; they preserve layout, not identical border/shadow paint. FR-063 already requires distinguishable focus, but one element has only one outline. A positive-offset focused outline replaces the inset boundary; it does not add a second outline. Width-only differentiation is possible, provided the resulting focused boundary remains visible.

Existing field focus sets `outline:none` and a shadow at [index.css](packages/react/ds-global-form/src/index.css#L300); the error-focus shadow is at [index.css](packages/react/ds-global-form/src/index.css#L366). SideNavigation already uses an inset focus outline at [Item/styles.css](packages/react/ds-app/src/lib/SideNavigation/common/Item/styles.css#L43). SidePanel explicitly keeps focus inset because an outset ring would be clipped at viewport edges at [SidePanel/styles.css](packages/react/ds-app/src/lib/SidePanel/styles.css#L94).

**Reproduction.** Give a button `.boundary { outline:1px solid CanvasText; outline-offset:-1px }` inside the forced-colours query, and a more specific focused rule with `outline:none; box-shadow:0 0 0 1px blue`. Emulate forced colours and focus it. Chromium returned `outline-style:none` and `box-shadow:none`: neither boundary nor focus survived. This proves the cascade hazard, not that every correctly migrated FR-063 implementation fails. Real Windows contrast themes and Firefox still need visual checks; emulation does not certify native OS behaviour or text backplates.

**Correction.** “Each component MUST define unfocused, focused, disabled and invalid forced-colours states with explicit outline ownership and cascade precedence. Focus MAY replace the boundary only if the focused outline itself remains a visible boundary. Where clipping prevents an outset ring, use a distinguishable inset width/style or a separate wrapper paint owner. Boundary width MUST be defined for unequal or zero per-side strokes, with a nonzero fallback for a required boundary. Use appropriate system colours and do not blanket-disable forced colour adjustment.” A uniform outline cannot preserve a selection marker that conveys information; test that state too.

Print is a separate concern: print settings/UA economy can omit decoration, and `print-color-adjust:exact` cannot override the user's decision. I have not verified shadow suppression in each engine's print pipeline. Require a print boundary for content whose separation remains essential, or explicitly exclude print. `prefers-contrast:more` alone does **not** mandate shadow removal. Reader view can discard author styling or controls altogether; neither shadows nor borders provide a universal Reader-view contract. Safari's accessibility settings must not be equated with Windows forced colours.

### 2. P3 – Separate fractional-DPR geometry from paint sharpness and test mode

**Evidence.** Zero blur does not mean every raster pixel has the authored colour. In context-only DPR emulation, a black 1px spread shadow on white produced centre-column red-channel rows `[0,191,255,255]` at 1.25 and `[0,127,255,255]` at 1.5: a fully black row plus a partially covered grey row. At 1 and 2 it produced respectively one and two black rows. This is coverage antialiasing, not a nonzero blur radius. In the actual launch-scale specimen, snapped borders occupied one fully black device row at fractional DPRs; the shadow retained fractional coverage and depended on its edge position.

**Reproduction.** Use the two specimens above at each launch scale; measure computed borders/rectangles and inspect screenshot pixels across an edge. Also move the box by a fractional CSS pixel. Screenshot crop rounding and device-pixel phase can change the sampled row pattern; inspect the complete edge, not a single pixel or CSS `box-shadow` serialization.

**Correction.** “Record browser/version, effective layout scale, OS scale/zoom, root size and device-pixel edge phase. Prove F1 is exercised by recording used border widths. Geometry assertions and visual acceptance are separate. Partial-coverage pixels and background blending are expected at fractional DPR; no cross-engine crispness equivalence is promised.” Keep the existing sharpness bench requirement. I cannot confidently rank Firefox or Safari antialiasing against Chromium without captures. Extend the geometry comparison to all supported engines without pretending raster-only DPR emulation is the same as OS scaling/page zoom.

### 3. P2 – Mixed rounded fields still taper; square joins are conditional

**Evidence.** The CSS shadow model shifts a rounded hole for an offset inset shadow; it does not assign an independent constant-width rounded border segment. Near a tangent, an offset layer's normal thickness decreases and its paint can extend onto the adjacent curved side. A spread shadow contracts the hole and avoids that offset-driven taper for a uniform ring. FR-063 acknowledges this, then overstates “mixed per-side strokes meet square”. Square-corner strips overlap; the first listed layer wins the overlapping corner, rather than forming a mitre. Rounded overlaps are still curved, potentially antialiased and colour-mixed.

The default field radius reads `--dimension-radius-small`, commented as zero at [index.css](packages/react/ds-global-form/src/index.css#L97), but the public radius hook is used at [index.css](packages/react/ds-global-form/src/index.css#L275). Do not infer that every theme has zero radius. Chip has an explicit 1rem radius at [Chip/styles.css](packages/react/ds-global/src/lib/component/Chip/styles.css#L12); TokenSwatch uses 0.25rem.

**Reproduction.** Set `border:0; border-radius:8px; box-shadow:inset 0 -2px 0 0 red, inset 1px 0 0 0 blue` on a 120px by 40px field; compare radius zero and `inset 0 0 0 2px red`. Inspect both lower corners and reverse the layer order. The in-memory Chromium rounded specimen showed position-dependent curved edge coverage. The taper conclusion follows from the shifted-hole geometry; I did not establish a Firefox/Safari pixel-equivalence result.

**Correction.** “Offset layers replace mitred colour joins with ordered overlap at square corners. Mixed rounded strokes retain offset-driven taper and MUST have an owner-approved appearance at each supported radius. Specify corner layer precedence. Where even rounded thickness is required, use a uniform spread ring, zero radius, or a separately approved edge construction.” The spread rule is enough for a uniform ring, not for arbitrary mixed radius/theme hooks.

### 4. P2 – Native-control adoption must specify appearance and the painted owner

**Evidence.** The in-memory text input, single select and textarea with `appearance:none; border:0` all returned zero borders and the authored inset shadow in Chromium at all four emulated DPRs. Pragma's Select already uses `appearance:none` at [SelectInput/styles.css](packages/react/ds-global-form/src/lib/subcomponent/SelectInput/styles.css#L12). Its CSS-gradient caret is separately vulnerable to forced-colours gradient suppression; a boundary outline does not restore that affordance. There is no current Pragma `base-select` path to validate.

Ordinary UA declarations do not magically outrank an applicable author border reset. Native platform painting, internal parts, `appearance:auto`, user styles and later author rules are different issues. Pragma already resets range-track UA borders separately for Chromium/WebKit and Firefox at [RangeInput/styles.css](packages/react/ds-global-form/src/lib/subcomponent/RangeInput/styles.css#L15). A root border reset is not a reset of every native internal part.

**Reproduction.** For actual direct controls and composite wrappers, inspect computed borders and visible chrome in default/focus/invalid/disabled/autofill states; open/select options and resize/scroll textarea. Repeat with supported appearance modes. Check the picker separately from the select root. `CSS.supports('appearance','base-select')` returned true in Chromium 151, but parsing support is not proof of correct picker paint. MDN's fetched table lists Chromium support and version-dependent Safari support, with Firefox support not enabled by default; do not apply that mode as a universal fallback.

**Correction.** “For each native control family, name the chrome owner and supported appearance mode. Explicitly reset layout borders on that owner and any relevant internal parts. Feature-gate `base-select`, reset/style its picker separately where adopted, and retain a tested ordinary-select fallback. Preserve the native affordances and forced-colours focus.” Firefox and Safari reliability remains unverified here, not an asserted incompatibility of their ordinary text inputs or textareas.

### 5. P2 – Shadow composition needs valid list grammar and semantic layer ownership

**Evidence.** FR-063's one-declaration rule is necessary but does not prevent a later winning declaration. Field focus/error at [index.css](packages/react/ds-global-form/src/index.css#L305) and [index.css](packages/react/ds-global-form/src/index.css#L366) replace the whole list. Elevation at [SidePanel/styles.css](packages/react/ds-app/src/lib/SidePanel/styles.css#L91) must join the list if that same element acquires a stroke. SideNavigation's active marker at [Item/styles.css](packages/react/ds-app/src/lib/SideNavigation/common/Item/styles.css#L51) is an existing semantic inset layer, not decorative elevation. TokenSwatch's translucent inner highlight at [TokenSwatch/styles.css](packages/react/tokens/src/lib/TokenTable/common/TokenSwatch/styles.css#L33) sits inside its current real border; removing that border moves the highlight inward edge to a different paint origin. Blindly replacing or reordering it changes the colour sample.

**Reproduction.** Set `--stroke:inset 0 0 0 1px black; --focus:none; box-shadow:var(--stroke),var(--focus)`. Chromium computes `box-shadow:none` because `none` cannot be a comma-separated shadow-list member. Test focus/error/selected/disabled combinations after composition and inspect which colours win overlaps. Inset shadows paint above the element's background but below content; opaque child backgrounds can hide them.

**Correction.** “Every optional slot MUST resolve to a syntactically valid shadow, such as `0 0 0 0 transparent`, never a `none` list member. Initialise slots on the paint owner, preventing inherited layers from leaking into descendants. State/theme rules MUST change slots, not replace the assembled property. Name selection/highlight as well as stroke/focus/elevation slots, fix their ordering, and check all winning declarations and combined states. Semantic shadow indicators MUST have a distinguishable forced-colours replacement.” Layers on different DOM elements do not conflict merely because both use `box-shadow`.

### 6. P3 – Logical offsets need a mapping; retained physical hooks must stay physical

**Evidence.** Shadow offsets are physical. Inset positive x paints the left edge and negative x the right, irrespective of `direction`. SideNavigation's current positive-x marker is concretely physical at [Item/styles.css](packages/react/ds-app/src/lib/SideNavigation/common/Item/styles.css#L51). Existing field hooks are explicitly named top/right/bottom/left at [index.css](packages/react/ds-global-form/src/index.css#L240); making a left hook mean start would silently change that API.

**Reproduction.** Put the active row in `dir=ltr`, then `dir=rtl`, including a nested LTR island. The existing positive-x marker stays left. If vertical writing is supported, also test `vertical-rl`; direction alone cannot map all axes.

**Correction.** “Preserve the physical meaning of existing per-side hooks. Map genuinely logical start/end strokes to physical offsets on the paint owner.” For horizontal writing, a shared `:dir(ltr)`/`:dir(rtl)` rule can set a sign variable to 1/-1; use `calc(sign * width)` and its negative in the assembled list. This avoids duplicating the entire shadow declaration per component, though it still needs direction-aware selectors. Scope/reset the sign on nested paint owners. Two mappings and a nested-direction check are a modest maintenance cost. State whether vertical writing is supported and supply its mapping if it is.

### 7. P2 – Padding clearance is not guaranteed and cannot silently alter density

**Evidence.** FR-039a admits zero insets, including Site rows; FR-063 prescribes block padding `inset + nudge`, and the inline inset without a nudge. Zero inset does not necessarily mean zero padding: the reported Site text nudge is 6.453px, so it would be wrong to claim its ordinary 1px stroke automatically fails. But no clause bounds every theme stroke by the available padding. A zero-nudge icon/content edge, a dense nested Chip or a zero-inline-inset cell can fail. Existing Chip padding is token-driven at [Chip/styles.css](packages/react/ds-global/src/lib/component/Chip/styles.css#L47), not evidence of the proposed dense values. Table padding is configurable at [Table/styles.css](packages/svelte/ds-app-launchpad/src/lib/components/Table/styles.css#L5).

The stroke paints below content, so “never covers content” is too categorical: it may paint beneath transparent content or be hidden by an opaque child. Rounded corners require more than padding equal to the stroke width to keep arbitrary content rectangles away from the curved ring. A 1px inset ring with a large radius can intersect a content rectangle inset only 1px from each straight edge.

**Reproduction.** Test enrolled Chip/host combinations under FR-057 and Site zero-inset rows; record each resolved padding and stroke width, including permitted theme widths. Put an opaque full-width child in a zero-padding stroked cell. Test rounded corner clearance with content reaching the content-box corners. These are required counterexamples/tests, not claims that an unimplemented recut already has measured overlap.

**Correction.** “For each supported variant and theme width, prove adequate straight-edge and rounded-corner clearance and no child occlusion. If clearance fails, reduce/omit the optional stroke, use an approved independent paint owner, or record an owner-approved exception. MUST NOT clamp padding upward by stroke width where that changes the prescribed inset, occupied size or FR-044 host fit.” Reconcile draft 2.8.2's padding minimum with section 3.3's stroke-independent inline padding. Do not conceal the contradiction with `max(padding, stroke)`.

### 8. P2 – Universal divider/table conversion is not justified; alternatives need bounded scope

**Evidence.** An inset shadow requires a nonempty padding box. Removing the only border from a zero-height divider can leave no interior area to paint. Collapsed tables have border-conflict/rowspan semantics that independent shadows do not reproduce. The existing Svelte table uses `border-collapse:collapse` and row/group borders at [Table/styles.css](packages/svelte/ds-app-launchpad/src/lib/components/Table/styles.css#L1) and [Table/styles.css](packages/svelte/ds-app-launchpad/src/lib/components/Table/styles.css#L24). CSS Backgrounds also leaves certain unequal collapsed-border shadow positions/renderings undefined. A shadow on a row can be occluded by cell backgrounds; outlining every cell instead introduces a different grid. These are scope issues, not proof that all table-cell inset shadows fail.

**Reproduction.** Replace `border-bottom:1px solid` on an empty zero-height divider with `border:0; box-shadow:inset 0 -1px black`: there is no nonzero interior stroke area. Put the same shadow on a table row whose cells have opaque backgrounds, then exercise rowspan, header/body seams and forced colours. Compare single seam ownership, not just occupied height.

**Correction.** “FR-063 governs nonempty control/surface chrome boxes. Dividers MUST name a nonzero paint box and retain their spacing/seam ownership. Collapsed table separators require a separately approved owner and appearance; do not mechanically replace every row/cell border.” Border-shape exceptions alone do not address these cases.

**Alternatives.** A positioned, `pointer-events:none` pseudo-element with its own border is a useful wrapper-based alternative: its snapped border affects the pseudo-element, not parent layout, survives forced colours as border paint, and leaves the parent's outline free for focus. It still needs corner decisions, stacking, clipping and a wrapper for native controls that cannot reliably host generated content. It does not automatically fix mixed-border mitres. A logical-positioned pseudo-element is often simpler for a single-side line. A gradient line composes with backgrounds, not shadows, but non-URL gradients disappear in forced colours and may disappear in print; it still needs a fallback.

`box-sizing:border-box` plus an explicit block size can hold a single-line control's outer geometry despite snapping, but does not guarantee the content/baseline position and fails the spec's inside-out, no-target-height constraint. It is not a compliant global alternative. No single replacement removes every caveat. Prefer the spread shadow for uniform chrome; bound the exceptional paint owners instead of enlarging the spacing model.

## Sign-off conditions

Keep the four supersession notes: they correctly distinguish historical border-subtraction evidence from the recut identity. Apply the wording corrections above to FR-063 and the draft, without rewriting that historical record. Before the first affected family is approved, show actual scale-mode geometry, mixed rounded joins, combined shadow states, native appearance/affordances, nested RTL, dense host fit, and real Windows forced-colours keyboard focus in Chromium and Firefox. Record Safari coverage separately. Do not infer that box shadows fix unrelated font/UA rounding or guarantee every component's identical occupied size without those measurements.

## External sources checked

These URLs were fetched during this review; implementation claims above are limited to what was measured or documented.

- [CSS Backgrounds and Borders 3, shadow layering](https://drafts.csswg.org/css-backgrounds-3/#shadow-layers): no layout effect, first shadow on top, inset paint order and collapsed-table limits; the same document defines shifted-hole shape and spread radii.
- [MDN forced colours](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors): shadow/gradient suppression, system colours, native semantics and colour-adjust exceptions.
- [MDN outline offset](https://developer.mozilla.org/en-US/docs/Web/CSS/outline-offset): negative offsets place outlines inside; supported in Chromium, Firefox and Safari.
- [MDN appearance](https://developer.mozilla.org/en-US/docs/Web/CSS/appearance): native appearance limits, `none`, `base-select` and picker opt-in; browser compatibility is version-dependent.
- [MDN contrast preference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast): preference detection is not forced-colour paint suppression.
- [MDN print colour adjustment](https://developer.mozilla.org/en-US/docs/Web/CSS/print-color-adjust): UA economy and user settings can override author requests.