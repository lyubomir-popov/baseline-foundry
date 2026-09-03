# Final review: cross-framework token architecture

Reviewer: principal design-systems architect / TypeScript-CSS platform review.
Date: 2026-09-03. Read-only. No implementation authorised.

Inputs: [`docs/cross-repo-token-architecture-audit.md`](cross-repo-token-architecture-audit.md),
[`docs/cross-repo-token-architecture-review.md`](cross-repo-token-architecture-review.md),
and the owner reply in
[`prompts/opus-final-token-architecture-review.md`](../prompts/opus-final-token-architecture-review.md).

Every claim below was re-checked against source. Where the owner reply
disproves a previous finding, the previous finding is withdrawn or narrowed
explicitly rather than quietly restated.

---

## 1. Verdict

**Accept the architecture. Block the first token PR on one new finding.**

The four owner decisions are sound and three of them are better than what the
previous review recommended:

- exclusive grid ownership resolves A6 more cleanly than picking a winning
  document;
- deferring `spacing.profile.*` out of v1 follows from that scope, honestly;
- separating the density *context contract* from framework-local control
  geometry is the correct seam.

Two of my previous findings do not survive checking and are corrected in §2:
**A3 is downgraded** (the owner is right on the facts) and **A4 is narrowed**
(the owner is right about the CSS, and partly right about the model).

One new finding blocks the first token PR:

> **C1 — the product-scoped baseline is correct policy and is not a token
> rename. It invalidates five of Pragma Site's twelve density values, every
> Site line-height, and the Site text seat. It is a Site retune, and it needs a
> designer, not a migration script.**

Recommendation: ship v1 tokens **without** `spacing.baseline`, or ship it and
accept that Pragma adopts it in a later, separately reviewed PR. Do not put a
Site redesign on the critical path of a plumbing contribution.

---

## 2. Corrections to A2, A3, A4 and A6

### A2 — upheld, and extended

The product baseline matrix is internally coherent as *policy*. BF proves it:
`config/tiers/editorial.json` sets `baselineUnit: 0.5` and every element line
height is a whole multiple of it — body/h5/h6 at 3 units (1.5rem), h3/h4 at 4
(2rem), h1/h2 at 6 (3rem). Docs, app and os all sit at `0.25`.

Two extensions the owner reply does not cover:

- Canonical currently declares the baseline on the **breakpoint** axis
  (`global/semantic/dimension/small.tokens.json`,
  `dimension.size.height.baseline: {dimension.100}`). Moving it to the product
  axis is part of the plumbing PR, not the token PR, because it changes which
  builder owns it.
- Pragma registers a 4px fallback for `--baseline-height` in four independent
  places: `packages/styles/typography/src/baseline-shim.css:14` (`@property`),
  and again as an inline shim comment in `baseline-cap.css:13`,
  `baseline-metrics.css:18` and `baseline-trim.css:13`. A product-scoped
  baseline needs one owner and one fallback. Four fallbacks means Site silently
  renders at 4px whenever the `.site` class is absent — which is exactly the
  failure mode the shim exists to prevent, inverted.

### A3 — downgraded from fatal to latent. The owner is right.

I checked consumption across all three repositories:

- `packages/tokens/tokens/canonical/global/semantic/dimension/small.tokens.json`
  and `xLarge.tokens.json` are the **only** occurrences of `rootFontSize` in
  `design-tokens`.
- The emitted artifact consumed by Pragma
  (`node_modules/.bun/@canonical+design-tokens@0.6.2-contrasted.0/…/dist/sets.primitive.css:165`)
  contains `--dimension-size-rootFontSize: var(--dimension-200);` — a custom
  property in `:root`, and nothing more.
- No rule in `pragma/packages`, `baseline-foundry/src` or the generated token
  CSS sets `font-size` on `html` or `:root` from that property.

So the claim "makes every rem token responsive" was wrong as stated. A custom
property does not change the rem reference. **Reclassified: future-policy risk
on a currently broken token.**

Three things survive, and one is sharper than the original finding.

**A3.1 — the token is unreachable at its own stated value.** The plugin has no
breakpoint builder (`canonicalPlugin.ts` transforms the base permutation, the
dark theme, and three typography contexts; nothing else). The xLarge 18px value
is never emitted. A consumer who wires `html { font-size: var(--dimension-size-rootFontSize) }`
today gets 16px at every viewport, while the `$description` promises 18px at
xLarge. That is worse than unused; it is a documented promise the build cannot
keep. Either emit it or remove the xLarge document.

**A3.2 — the exact condition that turns it into runtime behaviour.** Two things
must both be true: a rule sets `font-size` on the root element from that
property (or any equivalent value), *and* a breakpoint builder emits the xLarge
value under a media query. Neither exists. Adding either alone is inert; adding
both is the policy.

**A3.3 — the zoom analogy has one specific, testable failure, and it is not the
one named in the reply.** Per CSS Media Queries Level 4 §1.3, font-relative
units in media query conditions resolve against the **initial** value of
`font-size`, not against any author declaration on the root. BF's grid
thresholds are authored in rem — `@media (width >= 38.75rem)` and
`(width >= 64.75rem)` in [src/css-grid.ts](../src/css-grid.ts#L28). So under
the optional 1.125rem root policy:

| | Content geometry | Media-query threshold |
|---|---|---|
| Browser zoom to 112.5% | scales ×1.125 | scales ×1.125 |
| Root set to 1.125rem | scales ×1.125 | **unchanged** |

Layout therefore crosses each breakpoint at roughly 11% less content than it
does today, and the two mechanisms are not interchangeable. This is the honest
limit of the analogy. It does not invalidate the architecture — tokens stay
agnostic — but it is an application-layer consequence that needs a stated
decision: either author BF's thresholds in `px`, or accept the shift and
document it.

Container queries are a separate question with a different resolution rule and
I will not assert it from memory. Make it a browser-verified gate rather than a
claim: measure whether `@container (width >= 38.75rem)` shifts under a scaled
root, in Chromium, Gecko and WebKit.

**A3.4 — sub-device-pixel baseline.** At a 1.125rem root, the 0.25rem baseline
resolves to 4.5px. Docs, app and os grids stop landing on integer device pixels
at 1× DPR, and glyph rasterisation snapping becomes visible as baseline drift
even though the computed values are exact. Editorial's 0.5rem resolves to 9px
and stays integer. This is a genuine rendering consequence of the optional
policy, it affects three of four tiers and not the fourth, and it needs a
visual gate at 1× DPR.

**A3.5 — the WCAG 24px pointer target is a non-issue in this direction.** It is
a CSS-pixel minimum. Root scaling only enlarges rem-authored hit areas, so a
control at exactly 24px today grows to 27px. The exception is worth recording,
but it does not constrain the design. The real fixed-pixel exposure is
elsewhere: hairline borders, `vw`/`vh` measures, and any `px` literal in
component CSS.

**A3.6 — optical sizing is not a risk for the shipped font, and the real metric
risk is adjacent.** All four tier configs load
`assets/fonts/UbuntuSans[wdth,wght].ttf` — width and weight axes, no `opsz`.
Metrics are linear in font-size for this font, so the reply's scaling claim
holds. The adjacent risk, which exists today and is unrelated to root scaling:
BF assigns per-role `fontWeight` (300, 400, 500, 600 across
`config/tiers/*.json`) while the generator reads metrics from the font file
once. If a future variable font varies vertical metrics along `wght` through
`MVAR`, per-role nudges are wrong regardless of root size. Add a generator
assertion that the font has no `MVAR` entries for ascender, descender, line gap
or cap height — or that metrics are extracted per instance.

### A4 — narrowed. The owner is right about the CSS and half right about the model.

`packages/styles/main/src/modifiers.density.css:198` states it plainly: "the
text's own line box … IS the control interior. The height is INTRINSIC: no
block-size; border + pads + line-height add up to the cell." My phrasing
"universally imposing a target block size" was wrong and is withdrawn.

What survives is a difference of *derivation*, not of CSS property:

- Pragma **selects** a cell — `--density-line-height` at 32/24px (app) and
  36/28px (site/docs), `modifiers.density.css:54-92` — then seats the text at
  `round(nearest, line-height × 2/3, baseline)` and makes the box sum to the
  cell.
- BF **derives** the occupied block from the metric nudge and snaps the result,
  `--bf-interface-row-compensation-block-end: mod(calc(var(--bf-baseline) - mod(…)), var(--bf-baseline))`
  in [src/css-component-contracts.ts](../src/css-component-contracts.ts#L37).
  Nothing chooses a height.

Both produce intrinsic boxes. One starts from a chosen number, the other from a
measured one. That difference is real and is the reason the cell cannot be a
shared token — which is what the owner reply already concludes. Agreed.

**Remaining fixed-size debt, found in source:**

| File | Line | Declaration |
|---|---|---|
| `react/ds-app/src/lib/SideNavigation/common/Item/styles.css` | 23 | `block-size: calc(var(--space-baseline) * 5)` |
| `react/ds-app/src/lib/SideNavigation/common/Header/styles.css` | 11 | `block-size: calc(var(--space-baseline) * 5)` |
| `react/ds-app/src/lib/SideNavigation/common/NavTree/styles.css` | 18 | `block-size: calc(var(--space-baseline) * 4)` |

The first of these is a **proposed density provider**. A provider with a fixed
block size cannot honour an inherited dense context on its own axis, and under
a product-scoped baseline it doubles to 80px in Site. Migrate it before the
provider manifest ships.

**Withdrawal.** "BF subscribes to nothing" was stated as a technical conclusion
and was a policy preference. Withdrawn as phrased. Restated: BF *can* subscribe
to contextual density spacing without touching `--density-line-height`,
`--density-target-baseline-px`, `--control-seat-line` or `--control-seat-basis`.
The recommendation stands on different grounds — BF's four-product gradient
already spans a comparable range (field inset 0.5rem in editorial against
0.25rem in os; Pragma's comfortable/dense inline padding spans 16px to 8px), so
adding density to BF creates a 4 × 2 matrix with no proven consumer. Keep BF a
non-subscriber in v1 by policy, with the door open and the mechanism unchanged.

### A6 — resolved, and the resolution is better than my recommendation

Exclusive grid ownership is the right instrument. My earlier advice was to pick
the grid draft as the winning document; assigning ownership is stronger,
because it prevents the conflict recurring rather than settling one instance of
it. Accepted without reservation.

---

## 3. Answers to the ten questions

### Q1 — Is the product baseline matrix coherent, and what must change in Pragma?

Coherent as policy, **not** coherent against Pragma's current values. This is
C1.

Pragma's entire vertical system is expressed as integer multiples of
`--baseline-height`. Doubling it for Site does not rescale the system; it
breaks the invariant the system is built on. Every item below is a required
change, with source.

| # | Location | What breaks |
|---|---|---|
| 1 | `main/src/spacing.css:24-27` | `--space-baseline` and `--baseline-height` are `:root` globals. Must become product-scoped. |
| 2 | `main/src/modifiers.density.css:80` | The selector is `.site,\n.docs` — one rule for both. Must split. |
| 3 | `main/src/modifiers.density.css:81-92` | Site multipliers are 9, 7, 4, 3, 11, 9, 2, 2, 2, 2, 1, 1. At an 8px baseline, five halve to 4.5, 3.5, 5.5, 4.5 and 0.5. **Non-integer.** |
| 4 | `main/src/modifiers.density.css:26` | The file's stated invariant — "Every value is a WHOLE multiple of `--baseline-height`, so vertical rhythm holds in all four cells" — becomes false for Site. |
| 5 | `main/src/modifiers.density.css:192` | `--density-target-baseline-px: round(nearest, lh × 2/3, baseline)`. Site-dense: 28 × 2/3 = 18.67, which rounds to 20 on a 4px grid and **16 on an 8px grid**. The text seat moves up 4px. |
| 6 | `typography/src/baseline-cap.css:59`, `baseline-metrics.css:65`, `baseline-trim.css:49` | `--computed-line-height: calc(var(--baseline-height) * var(--line-height-multiplier))`. Every Site line-height doubles unless every multiplier halves — and odd multipliers cannot. |
| 7 | `typography/src/mapper.css:24` | `round(up, font-size × ratio, baseline)`. Worked case: 14px × 1.4286 = 20px, which is a 4px multiple but not an 8px one, so it snaps to **24px**. Small Site text gains 20% leading. |
| 8 | `typography/src/baseline-cap.css:66-69` | `--start-nudge: baseline − mod(position, baseline)`. Site nudges can now reach 8px instead of 4px. |
| 9 | `typography/src/baseline-cap.css:94` and peers | `margin-block-end: calc(var(--space-after, 0) * var(--baseline-height))`. Editorial `space-after` doubles. |
| 10 | `typography/src/baseline-shim.css:14` plus three engines | `@property --baseline-height` fallback is 4px in four places. Site renders on a 4px grid whenever `.site` is missing. |
| 11 | `debug/src/baseline-grid.css:10` | The overlay hardcodes 0.25rem and explicitly does **not** read `--baseline-height`. The debug grid would lie on Site — the worst possible failure for a verification tool. |
| 12 | `react/ds-app/src/lib/SideNavigation/{Item,Header}/styles.css` | 40px fixed heights become 80px in Site. |

Conclusion: the matrix is right and BF has proved it. Adopting it in Pragma is
a Site typographic and density retune with a design review, not a token swap.
Sequence it accordingly (§6).

### Q2 — Can one set of rem tokens be agnostic to BF's optional root policy?

Yes. The reply's core claim is correct, with three qualifications.

**Scales with the root, automatically and correctly:** every `rem` value —
spacing tokens, baseline step, font sizes, line heights, metric-derived nudges,
derived compensation. The nudge formula is linear in font size, and the shipped
font has no optical-size axis (A3.6), so proportions are preserved exactly.

**Does not scale:** `px` literals, `vw`/`vh`/`vmin`/`vmax`, media-query
thresholds authored in `rem` (A3.3), device-pixel snapping (A3.4), the WCAG
24px pointer minimum (A3.5), and image or SVG intrinsic sizes.

**No nudge needs regeneration.** BF emits nudges as rem literals and derives
compensation as `baselineUnit − nudgeTop` at
[src/css.ts](../src/css.ts#L48). Both terms are rem, both scale, and their sum
remains exactly one baseline step. Confirmed by construction, not by assumption.

The one qualification worth stating in the architecture: **build-time rounding
precision must be finer than a device pixel at the largest supported root.** A
nudge rounded to 4 decimal places in rem carries at most 0.0009px of error at
an 18px root. That is fine — but it should be a gate, not a coincidence.

### Q3 — Reclassify A3

**Future-policy risk on a currently broken token.** Not a fatal current defect.
Evidence and the exact activating condition are in §2, A3.1–A3.2.

Disposition: keep `rootFontSize` as a typography/application-policy input, move
it off the breakpoint axis, and mark it explicitly not consumed by Pragma. Do
not leave the xLarge document in place while no builder can emit it.

### Q4 — Does exclusive grid ownership plus the 020a/020b split resolve A6?

For the first contribution, yes. No 020a token encodes page or grid policy.

But three **component rules** in 020a's scope consume grid policy arithmetically
and must be listed in 020a's audit rather than discovered later:

- [src/css-components/sites-rich-lists.ts](../src/css-components/sites-rich-lists.ts#L179)
  — `inline-size: calc(200% + var(--bf-grid-gap-inline))`
- [src/css-components/sites-rich-lists.ts](../src/css-components/sites-rich-lists.ts#L195)
  — `inline-size: calc(400% + (var(--bf-grid-gap-inline) * 3))`
- [src/css-components/sites-editorial-ports.ts](../src/css-components/sites-editorial-ports.ts#L136)
  — `max-inline-size: calc((100cqi - var(--bf-grid-gap-inline)) / 2)`

These are legitimate — a component spanning grid tracks must know the gutter —
but they mean 020a cannot claim independence from 020b. State the dependency
direction: 020a components *read* grid policy and must not *set* it.

One more, adjacent: [src/css-grid.ts](../src/css-grid.ts#L79) sets
`padding-inline: max(var(--bf-page-margin), var(--bf-content-padding-inline))`.
Page margin and content padding are jointly consumed, which is the right reason
the owner reply put both in 020b.

### Q5 — Is omitting `spacing.profile.*` from v1 sound?

Sound, and the reply's own warning is the correct one to honour: the cross-axis
problem is deferred, not disproven.

If a later grid contribution needs product × breakpoint policy, the smallest
honest source representation is: **breakpoint context documents that declare
product-qualified private IDs, resolved by a dedicated builder into
product-selectored rules inside media queries.** That is the profile layer.
DTCG has no arithmetic and no conditional, so there is no third option that
keeps `resolver.apply()` authoritative. Computing it in the builder makes the
source stop being the truth, which is worse.

The genuinely smaller framing, available because of how the grid draft is
written: under `canonical-spacing-spec/specs/grid/draft.md` §2.3, outer margins
are identical across products at every breakpoint, and gutters differ only for
applications at large and x-large. So the honest source is **one breakpoint
axis plus one product exception** — four margin declarations and five gutter
declarations, not a sixteen-cell matrix. Pre-commit to that shape and to an
allow-list bounding it, so the layer cannot grow silently if it returns.

### Q6 — Does the density boundary work now?

Yes. The corrected A4 wording is in §2. The boundary as the owner draws it —
shared context values, shared provider/subscriber manifest, shared nested
reset; framework-local geometry derivation — is sound and is the right seam.

Two genuine incompatibilities remain, neither fatal:

- **Provider fixed sizing.** `SideNavigation/Item` is a proposed provider with
  `block-size: calc(var(--space-baseline) * 5)`. Migrate before the manifest
  ships.
- **Product × density redundancy.** BF's four products already span the range
  Pragma covers with two densities. If BF ever subscribes, the two axes will
  produce points that are visually indistinguishable (BF os comfortable against
  BF app dense). That is not a bug today because BF subscribes to nothing; it
  becomes one the day it does. Record it as a constraint on future enrolment,
  not as a v1 blocker.

### Q7 — Is one nudge output per role sufficient?

**No — it is one per role per product,** because the nudge depends on the
baseline step and the baseline step is now product-scoped. BF already generates
per-tier tokens, so this is a naming correction rather than new work.

Exact derivation and rounding contract:

```text
Engine supplies, per (role, product):
  nudge.blockStart : <length in rem>
  provenance       : { fontFile, sha256, generatorVersion, baselineStep, method }
                     method ∈ { "metrics", "cap" }

Consumer derives locally:
  compensation.blockEnd = baselineStep − nudge.blockStart

Invariant:
  nudge.blockStart + compensation.blockEnd = baselineStep   (exactly, per product)

Rounding:
  Build-time rem literals are emitted at a precision finer than one device
  pixel at the largest supported root font size. Runtime engines use mod()
  and round() and do not re-round the supplied value.
```

Under optional root scaling nothing regenerates: both terms are rem, the
formula is linear, and the invariant is scale-free.

Worth recording because it strengthens the case: the two engines already share
the formula. BF's component seating uses
`calc(var(--bf-baseline) - mod(calc((lineHeight + 1cap) / 2), var(--bf-baseline)))`
at [src/css-components.ts](../src/css-components.ts#L122); Pragma's
`baseline-cap.css:64-69` computes
`--baseline-position: calc((computed-line-height + 1cap) / 2)` then
`--start-nudge: baseline − mod(position, baseline)`. Identical. The shared
contract is not aspirational; it is already implemented twice.

Unresolved and needing a stated fallback: `1cap` in fonts without a usable
`sCapHeight` (CJK, many Arabic and Indic faces). Both engines must use the same
fallback or they will diverge exactly where the contract claims they may not.

### Q8 — Exact v1 public token IDs

Page margin, grid gutters and content padding are removed per §3 of the reply.
Twelve roles remain. All segments are single lowercase words, so output is
correct under both the current and the fixed name transform.

| Token ID | CSS custom property | Density-responsive |
|---|---|---|
| `spacing.baseline` | `--spacing-baseline` | no |
| `spacing.gap.field.block` | `--spacing-gap-field-block` | **yes** |
| `spacing.gap.mark.inline` | `--spacing-gap-mark-inline` | **yes** |
| `spacing.gap.group.block` | `--spacing-gap-group-block` | **yes** |
| `spacing.gap.pattern.block` | `--spacing-gap-pattern-block` | no |
| `spacing.gap.region.block` | `--spacing-gap-region-block` | no |
| `spacing.inset.field.inline` | `--spacing-inset-field-inline` | **yes** |
| `spacing.inset.action.inline` | `--spacing-inset-action-inline` | **yes** |
| `spacing.inset.continuation.inline` | `--spacing-inset-continuation-inline` | no |
| `spacing.inset.surface.inline` | `--spacing-inset-surface-inline` | **yes** |
| `spacing.inset.surface.block` | `--spacing-inset-surface-block` | **yes** |
| `spacing.inset.strip.block` | `--spacing-inset-strip-block` | no |

No size labels, no public numeric scale, no `layout` bucket, no `rhythm`
segment, no `profile.*`.

Density-responsive selection is evidence-based: the seven marked roles are the
ones Pragma's `--density-space-xs/-sm/-md/-lg` and `--density-pad-inline`
already vary. `pattern`, `region` and `strip` are page-composition decisions
that no tight host should compress; `baseline` must never vary by density or
the grid stops being a grid.

**Modifier axes:**

```text
sets.primitive
modifier.product        default site    (rename of the existing `typography` modifier)
modifier.density        default comfortable  (resolution and testing only; no public class)
modifier.theme
remaining colour modifiers
```

No breakpoint axis participates in the v1 spacing contribution.

### Q9 — Corrected contribution sequence

**PR 1 — plumbing only. No spacing IDs, no new tokens.**

1. Deterministic lowercase kebab-case in `convertTokenIdToCssVar`, plus
   output-collision detection and a compatibility map for existing camelCase
   properties.
2. Correct primitive/semantic classification so a `dimension.*` prefix no
   longer forces `tier: "primitive"` (`build/classification.ts:9`).
3. Dimension-valued modifier handling; remove the hardcoded `type: "color"` in
   `build/builders/buildModifierFamily.ts:66`.
4. Number-token emission, or consistently inlined resolved values; delete
   Pragma's seven hardcoded ratios in `mapper.css:75-81`.
5. Public/internal artifact classification, with a `--_` prefix convention for
   internal properties.
6. Rename the `typography` modifier to `product`; keep an alias for one
   release.
7. Move the baseline off the breakpoint axis; remove or repair the unreachable
   xLarge `rootFontSize` document.

Gates: no output name changes except the intended kebab-case migration; every
existing snapshot either unchanged or explained by the compatibility map.

**PR 2 — first token PR. Component and pattern spacing only.**

8. The eleven non-baseline roles from Q8, in
   `global/semantic/spacing/base.tokens.json` plus four product documents.
9. A dedicated spacing builder emitting product-selectored rules. No media
   queries, no `@container`, no `.dense` or `.comfortable` selector.
10. The density builder plus `policy/density-contract.json`, emitting private
    pairs, a private current value, generated providers, the comfortable reset,
    and subscriber bindings.
11. Point-wise equivalence tests for every product, and both density values of
    every marked role.

Not in PR 2: `spacing.baseline` (see C1), any page or grid role, any
root-scaling variant, any profile layer.

**PR 3 — baseline, after the Site retune is designed and approved.**

**PR 4+ — BF format-only adapter, then 020a values, then Pragma adoption, then
the generator major version.** Unchanged from the previous review, and both
ordering rules still hold: plumbing before publishing, format before value.

### Q10 — Unresolved owner decisions that genuinely block PR 2

Only two. Everything else is resolved above or belongs to a later PR.

**O1 — Does `spacing.baseline` ship in PR 2 or PR 3?**
Shipping it in PR 2 puts a Pragma Site typographic and density retune (C1,
twelve source locations) on the critical path of a plumbing contribution.
Recommendation: PR 3.

**O2 — Which components are in the initial provider and subscriber lists?**
The manifest is generated code; it cannot be drafted by a reviewer. The reply
names side-navigation items, table cells and tab items as providers and a badge
and an input as subscribers. That needs to be an exact, reviewed list before
the density builder can emit anything, and `SideNavigation/Item` needs its
fixed `block-size` removed before it can be a provider at all.

Explicitly **not** blocking PR 2: the grid policy conflict (owned by the grid
spec), the profile layer (deferred), root scaling (application policy), BF
density enrolment (policy, deferred), and the `1cap` non-Latin fallback (blocks
the generator PR, not this one).

---

## 4. Worked examples

### 4.1 Site/Editorial baseline

DTCG flattening, `resolver.apply({ product: "site" })`:

```text
sets.primitive              dimension.100 = 0.5rem
product:site                spacing.baseline = {dimension.100}
→ resolved                  spacing.baseline = 0.5rem
```

`resolver.apply({ product: "docs" })` resolves `{dimension.050}` = 0.25rem.
Same for app and os.

Runtime, `<html class="site">`:

```css
:root, .site { --spacing-baseline: 0.5rem; }
.docs, .app, .os { --spacing-baseline: 0.25rem; }
```

BF Editorial consumes it coherently today: h1 line height is 6 units = 3rem =
48px, body is 3 units = 1.5rem = 24px, and every element height is a whole
multiple.

Pragma Site does not, and this is C1 in one line. Its comfortable control cell
is `calc(var(--baseline-height) * 9)` = 36px
(`modifiers.density.css:81`). On an 8px grid, 36px is 4.5 units. Either the
cell becomes 40px (5 units, a visible change to every Site control) or Site
abandons whole-baseline cells. That is a design decision.

### 4.2 BF optional root scaling

Author time, unchanged:

```css
:root, .site { --spacing-baseline: 0.5rem; }
.docs        { --spacing-baseline: 0.25rem; }
--bf-body-nudge-start: 0.1875rem;   /* metric-derived, docs */
```

BF application layer, optional and BF-only:

```css
@media (width >= 90rem) { :root { font-size: 1.125rem; } }
```

Computed result in the docs product at that viewport:

| Quantity | 16px root | 18px root | Scales? |
|---|---:|---:|---|
| `--spacing-baseline` | 4px | **4.5px** | yes — and leaves the device-pixel grid (A3.4) |
| body nudge start | 3px | 3.375px | yes |
| derived compensation | 1px | 1.125px | yes |
| nudge + compensation | 4px | 4.5px | yes — invariant holds exactly |
| `--spacing-inset-action-inline` | 12px | 13.5px | yes |
| `@media (width >= 64.75rem)` threshold | 1036px | **1036px** | **no** (A3.3) |
| WCAG pointer minimum | 24px | 24px | no — and only ever helps |

No token changes. No nudge regeneration. Two application-layer consequences
that need gates rather than schema changes.

---

## 5. Acceptance gates

*Plumbing PR*
1. Every emitted property name is lowercase kebab-case; no camelCase segment.
2. Name-collision detector runs over the full emitted set and fails on any
   collision introduced by the conversion.
3. Compatibility map covers every previously emitted camelCase property.
4. Zero shim declarations remain in `pragma/packages/styles/typography/src/mapper.css`.
5. No `dimension.*` ID is classified `primitive` purely by path prefix.
6. No token document declares a value that no builder can emit — a
   reachability test over every resolver context.

*First token PR*
7. Point-wise equality: for every product, the browser-computed value of each
   of the eleven properties equals `resolver.apply()`.
8. Density: both pair members equal their DTCG points; no `.dense` or
   `.comfortable` selector exists anywhere in output.
9. Provider/subscriber contract: automatic inheritance, nested comfortable
   reset, non-subscriber immunity, portal re-provide.
10. No `@media` and no `@container` rule in the spacing output.
11. No `--_` property appears in the LSP artifact.
12. No emitted spacing value derives from a baseline or a font metric.

*Baseline PR*
13. Site retune approved by design, with before and after computed geometry for
    every Site control cell and every Site line-height.
14. `--baseline-height` has exactly one fallback owner; a missing product class
    fails loudly rather than silently resolving to 4px.
15. `debug/src/baseline-grid.css` reads the live baseline instead of a
    hardcoded 0.25rem.

*BF optional root policy, if enabled*
16. Visual pass at 1× DPR across docs, app and os at a 1.125rem root, checking
    baseline drift at the 4.5px grid.
17. Measured breakpoint-shift report: the content width at which each
    `@media` and each `@container` threshold fires, at both root sizes, in
    Chromium, Gecko and WebKit.
18. `nudge + compensation = baseline` verified by computed style at both root
    sizes, every role, every product.

*Cross-cutting*
19. Generator asserts the font has no `MVAR` variation of ascender, descender,
    line gap or cap height, or extracts metrics per instance.
20. A declared, shared `1cap` fallback for fonts without a usable
    `sCapHeight`, identical in both engines.

---

## 6. Remaining owner decisions

| # | Decision | Blocks | Recommendation |
|---|---|---|---|
| O1 | `spacing.baseline` in PR 2 or PR 3 | first token PR | PR 3. Do not put a Site retune on a plumbing critical path. |
| O2 | Exact provider and subscriber lists | density builder | Draft the manifest before the builder; remove `SideNavigation/Item`'s fixed `block-size` first. |
| O3 | Site density cell values on an 8px grid | baseline PR | Design review. Five of twelve current values are not whole multiples. |
| O4 | BF breakpoint thresholds under optional root scaling | BF application policy | Decide `px` thresholds or accept the ~11% shift; document either way. |
| O5 | Fate of the xLarge `rootFontSize` document | plumbing PR | Remove it, or add the builder that can emit it. Do not ship an unreachable promise. |
| O6 | `1cap` fallback for fonts without `sCapHeight` | generator PR | Needs one answer used by both engines. |

Resolved above and not carried forward: grid policy ownership, the 020a/020b
split, the profile layer, the density geometry boundary, naming, alignment
contract shape, and migration ordering.
