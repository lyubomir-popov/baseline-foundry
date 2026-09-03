# Adversarial review: cross-framework spacing-token architecture

Reviewer: principal design-systems architect / TypeScript-CSS platform review.
Date: 2026-09-03.
Subject: [`docs/cross-repo-token-architecture-audit.md`](cross-repo-token-architecture-audit.md)
and the review request in
[`prompts/opus-spacing-token-architecture-review.md`](../prompts/opus-spacing-token-architecture-review.md).

Read-only review. No implementation authorised. All claims below were checked
against source in `baseline-foundry`, `pragma`, `design-tokens`,
`baseline-nudge-generator` and `canonical-spacing-spec`; where the audit's claim
did not survive checking, the correction is stated with its evidence.

---

## 1. Verdict

**Accept with required changes.**

The three load-bearing decisions are right and should proceed:

- raw lengths stay primitive, decisions become semantic, both stay
  `$type: "dimension"`;
- horizontal geometry is not quantised by the vertical baseline;
- the alignment engine is a typography concern and must not appear under
  `spacing.*`.

Three things must change before any token is authored:

- six factual defects (A1–A6) invalidate parts of the proposal's premise, and
  two of them mean **Spec 020 is currently arguing against values that never
  render**;
- the density model as proposed cannot carry Pragma's actual density system and
  would violate a Baseline Foundry product invariant if it tried;
- the profile/reference layer is legitimate but is scoped four times wider than
  the evidence supports, and may collapse to zero once the grid-policy conflict
  is resolved.

The most useful correction this review can offer is not a schema tweak. It is
this: **the proposal treats a policy disagreement as a modelling problem.**
Canonical's grid draft, Canonical's spacing draft and BF Spec 020 give three
different answers for page margin and grid gutter. No resolver axis, profile
layer or builder resolves that. It has to be decided by the owner first, and
the decision determines whether the profile layer is needed at all.

---

## 2. Fatal findings

### A1 — BF's tier page margin and grid gutter are already dead at runtime

The audit says the "apparent configuration owner is not always the runtime
owner". That is an understatement. They are never the runtime owner.

Evidence:

- [src/css.ts](../src/css.ts#L116) emits `--bf-page-margin`,
  `--bf-grid-gap-inline` and `--bf-grid-gap-block` from tier config into
  `:where(.bf-theme)` and `:where(.bf-theme.<tier-class>)` rules.
- [src/css.ts](../src/css.ts#L547) appends `gridCss(appScopes)` **after** those
  rules.
- [src/css-grid.ts](../src/css-grid.ts#L21) re-declares all three on
  `:where(.bf-theme)` at 1rem / 1.5rem / 2rem by viewport.
- `:where()` contributes zero specificity, so both sides are `(0,0,0)` and
  source order decides. Confirmed in the built artifact: in
  `dist/tiers/editorial/styles.css` the tier declaration is at line 59 and the
  grid override at line 9655.

Consequence for the proposal: Spec 020's first stated defect — "Page margin is
1rem in Editorial and 2rem in App … the densest general-purpose product tier
therefore receives more horizontal room than the most expansive one" — describes
JSON, not pixels. At every viewport, every tier currently renders the same page
margin. The same applies to grid inline gutter except for the app exception at
`width >= 64.75rem`.

Required correction: re-derive Spec 020's problem statement from computed
values, not from `config/tiers/*.json`. Delete one of the two owners in BF
before tokenising anything. Do not port both into DTCG — that would encode a
dead axis as canonical API.

### A2 — the baseline is tier-scoped in BF, breakpoint-scoped in Canonical, and the wrong value in both

- `config/tiers/editorial.json` sets `baselineUnit: 0.5`; app, documentation and
  os all set `0.25`. So `spacing.rhythm.baseline` is **not** a single global
  role, as the proposed vocabulary assumes.
- Canonical places it under the breakpoint axis:
  `global/semantic/dimension/small.tokens.json` defines
  `dimension.size.height.baseline` as `{dimension.100}` = 8px, and no other
  breakpoint context redefines it.
- Both real consumers use 4px. `pragma/packages/styles/main/src/spacing.css`
  sets `--space-baseline: 0.25rem` with an explicit comment that the canonical
  8px token "is left at 8px and intentionally no longer consumed".
  `canonical-spacing-spec/specs/spacing/draft.md` §2.8.1 states "the default
  baseline unit is 4px (previously 8px)".

Required correction: baseline moves to the tier axis; the canonical default
becomes 4px; the editorial tier is the only built-in that overrides to 8px. Add
a source test that no breakpoint context declares a baseline.

### A3 — root font size varies by breakpoint, which makes every rem token responsive

`global/semantic/dimension/xLarge.tokens.json` binds
`dimension.size.rootFontSize` to `{dimension.225}` (18px) while
`small.tokens.json` binds it to `{dimension.200}` (16px).

Two consequences the proposal does not address:

1. **It destroys the axis-separation guarantee.** If root font size changes at a
   viewport threshold, every rem-valued spacing token changes in computed px —
   including the ones deliberately authored as breakpoint-independent, and
   including the baseline. BF's proposed assertion "changing a tier's inline
   unit alone changes no computed block length" becomes untestable in px,
   because a third variable moves both.
2. **It is an accessibility hazard.** Rebinding the root font size on a viewport
   threshold overrides the user's browser font-size preference for a reason
   unrelated to that preference. It interacts badly with WCAG 1.4.4 resize and
   1.4.10 reflow, because zoom and viewport width are not independent inputs.

Required correction: remove `rootFontSize` from the breakpoint axis, or
reclassify it as an application setting that is not a token. State which.
Spacing tokens must not be layered on a variable rem.

### A4 — density in Pragma is a control-seating axis, not a spacing axis

The proposal models density as a set of density-responsive *gap and inset*
roles. `pragma/packages/styles/main/src/modifiers.density.css` shows that is
only a third of what density does there. It also owns:

- `--density-line-height` — the control-height / line unit for a cell (32/24px
  app, 36/28px site-docs);
- `--density-line-height-effective` and its fallback chain;
- `--density-target-baseline-px`, computed as
  `round(nearest, line-height × 2/3, baseline)`;
- a "control seat" derived from the cell.

That is a target block size for controls. `AGENTS.md` states BF's controls
"follow the Vanilla occupied-block model: symmetric nudge-derived padding, **no
target block size**, and trailing compensation that snaps the occupied block to
the grid". The two systems compute control geometry by opposite methods.

So the proposal's implicit claim — that one density contract serves both — is
false as written. Required correction: choose one and say so.

- **Recommended:** canonical density publishes only the four spacing rungs
  Pragma already expresses generically (`--density-space-xs/-sm/-md/-lg`).
  Control height stays a Pragma-local derivation and is explicitly out of the
  canonical contract. BF subscribes to nothing, because BF has no density axis
  today and the occupied-block model makes one unnecessary.
- The alternative — canonicalising `--density-line-height` — requires BF to
  abandon a stated product invariant. That is an owner decision, not a
  migration detail.

### A5 — the proposed CSS custom-property names are not what the plugin emits

`design-tokens/packages/plugin/src/naming.ts` `convertTokenIdToCssVar` strips a
terminal `.$root` and replaces `.` with `-`. It does not kebab-case.

So `spacing.gap.iconLabel.inline` emits `--spacing-gap-iconLabel-inline`, not
the `--spacing-gap-icon-label-inline` in the proposal's table. This is the exact
defect the audit criticises elsewhere: Pragma's
`packages/styles/typography/src/mapper.css` carries a shim block
(`--typography-font-family-default: var(--typography-fontFamily-default)` and
similar) purely to repair this.

Required correction, in order of preference:

1. Fix the naming function to kebab-case segment boundaries, land it as a
   breaking plugin change, delete Pragma's shim block — **before** any spacing
   ID exists. Publishing spacing tokens on top of a known-broken name transform
   guarantees a second shim layer.
2. Failing that, restrict every spacing ID segment to a single lowercase word.
   The revised vocabulary in §5 does this, so it is safe either way.

### A6 — three sources give three different horizontal policies for the same two facts

| Source | Page margin | Grid inline gutter |
|---|---|---|
| `canonical-spacing-spec/specs/grid/draft.md` §2.3 | 1 / 1.5 / 2 / 2rem by breakpoint, same for all tiers | 1 / 1.5 / 2 / 2rem sites+docs; 1 / 1.5 / 1.5 / 1.5rem app |
| `canonical-spacing-spec/specs/spacing/draft.md` §3.1 | 32px flat | 24px flat |
| BF Spec 020 approved matrix | 2 / 1.5 / 1 / 0.75rem by tier, flat across breakpoints | 2 / 1.5 / 1.25 / 1rem by tier, flat across breakpoints |
| BF runtime today ([src/css-grid.ts](../src/css-grid.ts#L21)) | grid draft's version | grid draft's version |

The grid draft and the spacing draft disagree on values. Spec 020 disagrees with
both on the *shape* of the policy: it removes the breakpoint dimension
entirely. And BF already ships the grid draft.

Implementing Spec 020 as written would either be silently overridden (A1) or
would delete responsive gutter escalation from BF without saying so. Neither
outcome appears in Spec 020's boundaries section.

Required correction: resolve this in Phase 0, by owner decision, before any
schema work. It is the single highest-leverage unblock in the whole programme,
because it determines whether the profile layer is needed (§B1–B2).

---

## 3. Important findings

**B1 — the profile layer is legitimate but four times too wide.**
Of the sixteen proposed roles, only four are candidates for breakpoint
dependence: page margin, grid gutter inline, grid gutter block, content padding
inline. The other twelve are tier-only in every source reviewed. Rule to adopt:
a private `spacing.profile.*` ID may exist only for an ID named in an explicit
`responsive-roles.json`, enforced by a test. Without that rule, the layer will
grow to mirror the whole vocabulary within two releases.

**B2 — if A6 resolves in favour of the grid draft, the profile layer disappears.**
Under the grid draft, margins are identical across tiers, and gutters differ
only for one tier group at two breakpoints. That is expressible as a plain
`:root` default, three media blocks, and one `.app` exception inside the largest
block — no reference indirection, no Cartesian product, and it is what
`src/css-grid.ts` already emits. Prefer this. Only reach for the profile layer
if the owner insists on Spec 020's per-tier margin gradient.

**B3 — the axis-separation assertion will pass vacuously in BF.**
Spec 020 sets `inlineUnitRem` to 0.25rem in all four tiers, and `baselineUnit`
is also 0.25rem in three of four. An assertion that compares computed *values*
across an inline-unit change will therefore prove almost nothing. The assertion
must compare **provenance** — the authored input field and the CSS variable
referenced — not the resulting number. Add a fixture tier with a deliberately
mismatched pair (say 0.25rem inline, 0.5rem baseline) so the assertion has a
case that can actually fail.

**B4 — `sectionMajor` is a magnitude label, and the level count is wrong.**
BF has four authored block levels: `sectionSpaceShallow`, `sectionSpace`,
`sectionSpaceDeep`, `stripSpace`. The proposal offers `pattern`, `section`,
`sectionMajor` plus `strip.padding.block`, and "major" describes size, not
ownership — which the proposal's own naming rule forbids. See §5 for
ownership-based replacements.

**B5 — `spacing.layout.*` is a bucket, not an owner.**
It also produces inconsistent depth (`spacing.inset.field.inline` at four
segments against `spacing.layout.page.margin.inline` at five). Drop the bucket.

**B6 — the icon gap and the leading-mark gap must be one token with a neutral name.**
Spec 020's contract states they "take the same value and the same owner".
`spacing.gap.iconLabel.inline` names one of the two consumers.

**B7 — density cannot use the generic modifier builder.**
`buildModifierFamily` emits a `.<context>` selector per context. Registering
density as a family would publish global `.comfortable` and `.dense` classes —
precisely the unrestricted escape hatch the proposal exists to prevent. Density
must be excluded from the plugin's `families` list and handled by a dedicated
builder that emits private pair properties plus provider/subscriber rules from
a component manifest.

**B8 — the modifier builder is colour-typed in two places.**
`buildModifierFamily` hardcodes `type: "color"` on every artifact token, and
`buildSetsPrimitive` explicitly skips `number.*`. Both need to change before a
dimension-valued modifier can be described honestly in `tokens.json`.

**B9 — drop the quantisation `$extensions` metadata.**
The audit already offers omission as a fallback; make it the primary. Validate
resolved inline values against the quantum directly. Extension metadata that
must be kept in sync with the value it annotates is a second source of truth
with no consumer.

**B10 — the generator's real contract is one number per role.**
`baseline-nudge-generator/src/nudge-generator.js` computes
`marginBottom = spaceAfter − nudgeTop`, with a special case that rewrites
`spaceAfter: 0` to `0.5`. BF does not use it:
[src/css.ts](../src/css.ts#L48) computes `baselineUnit − nudgeTop` and only
falls back to the generator's `marginBottom` if present. So BF's actual
dependency is `nudgeTop`. State that as the shared contract; everything else in
the generator output is legacy.

**B11 — BF still publishes `--bf-<role>-space-after`.**
[src/css.ts](../src/css.ts#L110) emits it in `roleVarDeclarations` even though
`AGENTS.md` states role space-after does not drive layout. Retire it in the same
window as the generator change, or a consumer will bind to it.

**B12 — gutters must stay viewport-scoped, never container-scoped.**
Grid draft §5 is explicit: "a 320px side drawer displayed on a 1800px screen
uses 1.5rem gutters … not 1rem". A tokenised gutter emitted under `@container`
would break that. Emit under `@media` only and add a test that forbids
`@container` in the spacing output.

**B13 — cascade layers are unresolved between the two consumers.**
Canonical wraps output in `@layer ds.tokens` / `ds.modifiers`
(`resolveLayerConfig`). BF emits unlayered `:where()` rules. Any unlayered BF
declaration beats every layered canonical declaration regardless of specificity.
Decide the layer policy before Phase 2, not during it.

**B14 — Pragma's baseline is documented as 0.5rem and set to 0.25rem.**
`mapper.css` line 21 says "`--baseline-height` → set at `:root` (default:
0.5rem)"; `spacing.css` sets `--space-baseline: 0.25rem`. Fix before
tokenising, or the token will inherit the ambiguity.

**B15 — portals need an explicit re-provide API.**
Density is DOM-inherited. A `<dialog>` in the top layer still inherits through
its DOM parent, and so does a React portal whose target sits inside the
provider. A portal to `document.body` does not. The contract must say that a
detached overlay re-establishes context explicitly, and a test must prove both
the inheriting and the non-inheriting case.

**B16 — the `1cap` engine is unreliable outside Latin script.**
Both engines depend on a cap height. Fonts for CJK, and many for Arabic and
Devanagari, either omit `sCapHeight` or carry a value with no optical meaning.
The shared alignment contract needs a defined fallback, and it must be the same
fallback in both engines or the frameworks will diverge in exactly the place the
proposal claims they may not.

**B17 — add a browser-support gate on emitted CSS functions.**
`src/css-components/content-card.ts` uses `calc-size()`, which is not broadly
available. That is pre-existing, not caused by this proposal, but the
"generated-delivery feasibility" gate should cover every CSS function that
reaches published tokens or components: `round()`, `mod()`, `light-dark()`,
`calc-size()`.

---

## 4. Answers to the sixteen review questions

**1. Is semantic `spacing.*` with `$type: dimension` the right DTCG boundary?**
Yes, and it is the only conformant option — DTCG has no spacing type, and
inventing one would break every generic tool. The namespace split is the correct
carrier of the primitive/semantic distinction. One correction: `spacing.*` must
not also absorb radius, border width, icon size, measure or content width. The
audit says this; make it an executable rule, because the pressure to move them
will be constant.

**2. Is `tier` the right axis name, and are `site/docs/app/os` coherent?**
`tier` is a poor public name — it collides with the primitive/semantic "tier"
already used by the plugin artifact (`tier: "primitive"` in
`buildSetsPrimitive`). Use **`product`**. The contexts are coherent.

OS does belong, but not as a peer of the other three on the evidence available.
Site, docs and app are *audience* contexts. OS is a *platform* context — it
happens to be denser, but its density comes from a different cause and
Canonical has no OS typography context at all today. Keep it in the axis for BF
support-equivalence, and mark it explicitly as BF-originated and not yet
canonical policy.

Editorial should be called **`site`** in the token API and remain "editorial" in
BF prose. Canonical's existing typography modifier already uses `site`, Pragma's
CSS already uses `.site`, and inventing a fourth spelling of the same idea for
the sake of BF's internal vocabulary is not worth a permanent shim.

**3. Can tier, breakpoint and density be factorised without hidden precedence bugs?**
Yes, but only under three constraints, and BF violates the first one today.

- Responsive values must be emitted **on the tier selector inside the media
  query**, never on a shared root selector inside the media query. A1 is exactly
  this bug: `src/css-grid.ts` writes `:where(.bf-theme)` inside `@media`, which
  beats every tier rule for every tier. It also breaks nested tiers — a `.docs`
  region inside an `.app` shell cannot recover its own gutter.
- Density must not be a public class. See B7.
- Density must only touch private current-value properties, never the public
  `--spacing-*` namespace, or a dense host silently rewrites the page's semantic
  spacing for its whole subtree.

Two permutations are walked in §6.

**4. Is the private profile layer legitimate, or a disguised Cartesian product?**
Legitimate but over-scoped. DTCG genuinely cannot express a cross-axis
conditional without a reference layer, so the technique is sound. The lower-
complexity alternative exists and should be preferred: resolve A6 in favour of
the grid draft, at which point the cross-product is one token with one
exception, and no indirection is needed at all. If Spec 020's per-tier gradient
wins instead, bound the layer to a four-entry allow-list (B1).

**5. Are the proposed public names semantic, complete and minimal?**
Mostly. Marked names:

| Proposed | Problem | Replacement |
|---|---|---|
| `spacing.gap.sectionMajor.block` | magnitude label | `spacing.gap.region.block` |
| `spacing.gap.section.block` | ambiguous against `pattern` | `spacing.gap.pattern.block` |
| `spacing.gap.pattern.block` | ambiguous against `section` | `spacing.gap.group.block` |
| `spacing.gap.iconLabel.inline` | names one consumer; camelCase (A5) | `spacing.gap.mark.inline` |
| `spacing.layout.*` (5 IDs) | bucket, not owner; inconsistent depth | drop `layout` segment |
| `spacing.layout.strip.padding.block` | it is an inset, not a layout gap | `spacing.inset.strip.block` |
| `spacing.rhythm.baseline` | `rhythm` adds nothing | `spacing.baseline` |

Completeness: one level is missing. BF authors four block levels, the proposal
offers three plus a strip inset. The mapping in §5 keeps all four.

**6. Should the inline quantum be published?**
Build-time validation input only. Do not publish. And see B3 — the validation is
worthless unless it checks provenance rather than value, because BF's inline
unit and baseline unit are numerically equal in three of four tiers.

**7. Is a machine-readable provider/subscriber allow-list the right boundary?**
Yes, and it is the strongest idea in the proposal. Three mechanics it must
specify, none of which the draft covers:

- *Preventing arbitrary use.* The public CSS must contain no `.dense` selector
  at all. Providers are generated from the manifest as
  `:where(.p-side-navigation__item, .p-table__cell, .p-tabs__item).is-dense`.
  A lint rule rejects a manifest entry for a component that does not exist, and
  a build assertion rejects any emitted selector matching `.dense` that is not
  compounded with an allow-listed host.
- *Nested comfortable reset.* A subscriber inside a dense host that must stay
  comfortable re-points the private current property back to the comfortable
  pair member on its own scope. It must not set a class, because the class is
  not public API. Expose it as a documented modifier on the enrolled component,
  not as a utility.
- *Portals.* See B15.

**8. Which BF values are canonical policy, and which are sandbox evidence?**

| Suitable as canonical policy | Sandbox evidence only |
|---|---|
| The three inset roles (field / action / continuation) as a *vocabulary* | Their per-tier values |
| The one-owner rule for the mark/icon gap | 0.5rem / 0.25rem split |
| Container-owned semantic spacing in all tiers | The four block levels' values |
| Axis separation as an invariant | 0.25rem inline quantum |
| The four block-level *ownership* distinctions | The OS tier itself |
| — | The whole Spec 020 matrix (A6) |

The rule to apply: a BF value becomes canonical policy only when a second
framework has independently needed it. Today only the vocabulary passes that
test; none of the numbers do.

**9. Does the migration preserve the occupied-block and nested-row invariants?**
Not as sequenced, because the sequence conflates two changes. The audit's Phase
2 says "preserve exact rendered values initially", but Spec 020 exists to change
values. Both cannot happen in one phase. Three concrete ways a "format-only"
refactor changes computed geometry:

- `--bf-space-*` currently resolves through `calc(var(--bf-baseline) * n)`. If a
  consumer switches to a resolved rem literal at a different rounding, the
  occupied-block ledger shifts by a sub-pixel and the trailing compensation
  `mod()` snaps to a different multiple.
- `--bf-field-gap` is explicitly forbidden from doubling as the icon gap in the
  Spec 020 contract. Any token consolidation that merges them changes vertical
  field stacking.
- Emitting canonical spacing into `@layer ds.tokens` while BF rules stay
  unlayered inverts precedence for every alias (B13).

Required: split into 2a (format-only, byte-identical computed geometry, proven
by frozen fixtures) and 2b (Spec 020 value change, proven by browser review).
Never in one commit.

**10. Is the alignment-engine boundary sufficient?**
Yes, and the smallest shared contract is smaller than the proposal states. It is
**one number per role: `nudge.blockStart`.** Compensation is derivable —
`baseline − nudgeStart` — and BF already derives it that way (B10). Publishing
compensation as a second token invites the two engines to disagree about a value
that is a function of the first. Publish the nudge; derive the rest.

Caveat: the contract also needs a declared cap-height fallback (B16), or the
engines will diverge on non-Latin scripts.

**11. Should the nudge generator emit a DTCG overlay?**
Keep it a pure numeric library. It reads font binaries; its output is
reproducible only if the font file, the version and the extraction algorithm are
all pinned. A DTCG overlay would make an unreproducible artifact look like
authored source. Emit typed JSON with a `{font, sha256, generatorVersion}`
provenance block, and let BF's build translate that into whatever the token
pipeline wants. Do not absorb it into BF — the extraction is genuinely reusable
and the boundary is the only thing keeping it honest.

**12. Is "defensive and bureaucratic" accurate for colour?**
Partly, and the audit's split is right. Refinements:

- Essential: the runtime-permutable resolver, light/dark source separation,
  `light-dark()` delivery, the OKLCH ramps.
- Should be generated, not authored: 112 disabled, 50 hover and 50 active
  variants. These are mechanical transforms of a base role. Author the base,
  generate the states, and the 354-token surface drops by roughly two thirds.
- Should be removed: empty placeholder families published as if supported
  (`importance`, `emphasis.highlighted`, `lifecycle`, `release`). They are in
  the resolver today, so consumers can select a context that resolves to
  nothing.
- Missing and blocking: an executable WCAG contrast matrix. Snapshot tests
  prove the output did not change; they do not prove it is usable.

**13. Typography: visual policy versus broken plumbing.**

Broken plumbing, fix regardless of policy:

- camelCase-to-kebab mismatch requiring `mapper.css` shims (A5);
- `number.*` excluded from `sets.primitive.css` while emitted typography
  references it, forcing Pragma to hardcode seven line-height ratios;
- pixel descriptions asserted as fixed truth while `rootFontSize` varies (A3).

Visual policy, decide separately:

- product context modelled as a `typography` modifier rather than a shared
  product axis — this is the direct cause of "two lists of class names staying
  equal", and merging it with the spacing axis (answer 2) fixes it;
- composite variant repetition across product files;
- no OS context.

The letter-case and figure-style extensions are reasonable; they need contract
tests, not redesign.

**14. Risks the proposal misses.**
A3 (root font size versus zoom and user preference) is the largest. Then B12
(container versus viewport), B13 (layers), B15 (portals), B16 (non-Latin cap
height), B17 (CSS function support). Two more:

- **Forced colours** do not affect spacing, but they do affect whether a border
  is painted, and BF's occupied-block ledger accounts for border width. A gate
  is needed for the occupied block under `forced-colors: active`.
- **Print.** None of the four tiers has a declared print behaviour, and page
  margin tokens under `@media (width >= …)` do not apply to paged media at all.

**15. Is the phased contribution order viable?**
Not as written. It has one ordering dead end: Phase 1 publishes spacing IDs
through a name transform that is known to be wrong (A5), which forces Pragma to
add a second shim layer in Phase 3 and then remove it in a later breaking
change. Insert a plumbing phase before Phase 1. Corrected sequence in §7.

No circular package dependency exists — `design-tokens` has no consumer
dependency — but there is a circular *decision* dependency: BF Spec 020 waits on
canonical policy, and canonical policy is being seeded from BF values. Break it
by deciding A6 first with neither repo as the default winner.

**16. Should Spec 020 supersede Spec 019?**
Neither of the offered options. **Split Spec 020 in two:**

- **020a — component insets and gaps.** Field, action and continuation insets,
  the mark/icon gap, panel inline padding, `inlineUnitRem`, and the axis-
  separation assertion. None of these conflict with any canonical draft. This
  absorbs Spec 019 as proposed and should proceed in BF now.
- **020b — page margin, grid gutter, content padding.** Blocked on A1 and A6.
  Move it into the cross-repo package, because it is a policy reconciliation
  between three documents, not a BF refactor.

Spec 019 archives as superseded by 020a. This is better than either "supersede"
or "absorb whole", because it unblocks two thirds of the work immediately while
quarantining the part that genuinely needs an owner decision.

---

## 5. Revised schema

### 5.1 Token IDs and emitted properties

Every segment is a single lowercase word, so the output is correct under both
the current and the fixed name transform (A5).

| Token ID | CSS custom property | Varies by | Owner |
|---|---|---|---|
| `spacing.baseline` | `--spacing-baseline` | product | Vertical grid quantum |
| `spacing.gap.field.block` | `--spacing-gap-field-block` | product, density | Label / control / help |
| `spacing.gap.mark.inline` | `--spacing-gap-mark-inline` | product | Any mark or icon to the copy it labels |
| `spacing.gap.group.block` | `--spacing-gap-group-block` | product | Between items inside one pattern |
| `spacing.gap.pattern.block` | `--spacing-gap-pattern-block` | product | Between complete patterns |
| `spacing.gap.region.block` | `--spacing-gap-region-block` | product | Between page regions |
| `spacing.inset.field.inline` | `--spacing-inset-field-inline` | product | Data-entry first glyph |
| `spacing.inset.action.inline` | `--spacing-inset-action-inline` | product | Command surfaces |
| `spacing.inset.continuation.inline` | `--spacing-inset-continuation-inline` | product | Copy after a mark or depth step |
| `spacing.inset.surface.inline` | `--spacing-inset-surface-inline` | product | Structural region, inline |
| `spacing.inset.surface.block` | `--spacing-inset-surface-block` | product | Structural region, block |
| `spacing.inset.strip.block` | `--spacing-inset-strip-block` | product | Full-bleed strip frame |
| `spacing.page.margin.inline` | `--spacing-page-margin-inline` | product, breakpoint | Outer page margin |
| `spacing.grid.gutter.inline` | `--spacing-grid-gutter-inline` | product, breakpoint | Column gutter |
| `spacing.grid.gutter.block` | `--spacing-grid-gutter-block` | product, breakpoint | Two-dimensional row gutter |
| `spacing.content.padding.inline` | `--spacing-content-padding-inline` | product, breakpoint | Capped content inset |

Sixteen roles. The last four are the entire contents of `responsive-roles.json`.
Adding a fifth requires a review, not a commit.

Mapping to BF's four authored block levels:
`sectionSpaceShallow → gap.group`, `sectionSpace → gap.pattern`,
`sectionSpaceDeep → gap.region`, `stripSpace → inset.strip`.

### 5.2 Resolver axes and order

```text
sets.primitive
modifier.breakpoint     default x-small   (responsive roles only)
modifier.product        default site      (renamed from `typography`)
modifier.density        default comfortable (resolution and test only; not a public class)
modifier.theme
remaining colour modifiers
```

Three changes from the proposal:

- `tier` becomes `product` (answer 2, avoids collision with the artifact's
  existing `tier` field);
- the existing `typography` modifier is **renamed**, not paralleled. Adding a
  second axis with the same four context names is how the two lists drift. Keep
  `typography` as a deprecated alias for one release;
- `rootFontSize` leaves the breakpoint axis (A3).

### 5.3 Source layout

```text
global/primitive/dimension.tokens.json
global/semantic/spacing/base.tokens.json          # defaults, = site
global/semantic/product/{site,docs,app,os}.tokens.json
global/semantic/breakpoint/{x-small,small,large,x-large}.tokens.json
global/semantic/density/{comfortable,dense}.tokens.json
policy/responsive-roles.json                      # not a token document
policy/density-contract.json                      # providers + subscribers
```

`policy/*` are build inputs and lint inputs. They are not DTCG documents,
because a token document cannot express which components are authorised to
provide or consume a context — the audit is right about that and it is worth
stating in the schema itself.

### 5.4 Generated CSS shape

Tier-only roles — plain, one block per product context:

```css
@layer ds.tokens {
  :root, .site { --spacing-inset-action-inline: 1rem; }
  .docs        { --spacing-inset-action-inline: 0.75rem; }
  .app         { --spacing-inset-action-inline: 0.75rem; }
  .os          { --spacing-inset-action-inline: 0.5rem; }
}
```

Responsive roles — **always on the product selector inside the media query**,
never on a shared root selector (this is the A1 defect):

```css
@layer ds.tokens {
  :root, .site, .docs, .app, .os { --spacing-grid-gutter-inline: 1rem; }

  @media (width >= 38.75rem) {
    :root, .site, .docs, .app, .os { --spacing-grid-gutter-inline: 1.5rem; }
  }
  @media (width >= 64.75rem) {
    :root, .site, .docs { --spacing-grid-gutter-inline: 2rem; }
    .app, .os           { --spacing-grid-gutter-inline: 1.5rem; }
  }
}
```

Density — private pairs, private current value, generated providers and
subscribers. No public `.dense`:

```css
@layer ds.tokens {
  .app {
    --_spacing-gap-field-block-comfortable: 0.5rem;
    --_spacing-gap-field-block-dense: 0.25rem;
    --_density-gap-field-block: var(--_spacing-gap-field-block-comfortable);
  }
}

@layer ds.density {
  /* generated from policy/density-contract.json — providers */
  :where(.p-side-navigation__item, .p-table__cell, .p-tabs__item).is-dense {
    --_density-gap-field-block: var(--_spacing-gap-field-block-dense);
  }
  /* generated from policy/density-contract.json — comfortable reset */
  :where(.p-side-navigation__item, .p-table__cell, .p-tabs__item).is-comfortable {
    --_density-gap-field-block: var(--_spacing-gap-field-block-comfortable);
  }
  /* generated from policy/density-contract.json — subscribers */
  :where(.p-badge, .p-form-input) {
    --_component-gap-field-block: var(--_density-gap-field-block);
  }
}
```

### 5.5 Public versus internal

- Public: the sixteen `--spacing-*` properties, and nothing else.
- Internal, marked `"public": false` in `tokens.json` and excluded from the LSP
  artifact: every `--_`-prefixed property, every `spacing.profile.*` ID, and the
  whole density pair mechanism.
- The `--_` prefix is load-bearing: it makes "did anything public leak?" a
  one-line regex gate rather than a review judgement.

---

## 6. Two worked permutations

### 6.1 Responsive: `docs` at the large breakpoint

DTCG flattening — `resolver.apply({ product: "docs", breakpoint: "large" })`:

```text
sets.primitive           dimension.400 = 2rem
breakpoint:large         spacing.profile.docs.grid.gutter.inline = {dimension.400}
product:docs             spacing.grid.gutter.inline = {spacing.profile.docs.grid.gutter.inline}
→ resolved              spacing.grid.gutter.inline = 2rem
```

Runtime cascade, viewport 1200px, markup `<html class="docs">`:

```text
:root, .site, .docs, .app, .os   → 1rem      (0,1,0 via .docs; base block)
@media (>= 38.75rem) … .docs      → 1.5rem    (matches, later)
@media (>= 64.75rem) :root, .site, .docs → 2rem  (matches, latest)
computed --spacing-grid-gutter-inline = 2rem  ✓ equals DTCG
```

The nested case that breaks under the current BF emission: a `.app` shell
containing a `.docs` region. With the corrected shape, `.docs` wins inside the
region because both rules are in the same media block at equal specificity and
the element only matches one of them. With BF's present `:where(.bf-theme)`
form, the region cannot recover its own value at all — this is A1 and A3-adjacent
and is the reason the emission shape is a hard requirement rather than a
preference.

### 6.2 Density: a badge inside a dense tab, in the app product

DTCG flattening:

```text
resolver.apply({ product: "app", density: "comfortable" })
  → spacing.gap.field.block = 0.5rem
resolver.apply({ product: "app", density: "dense" })
  → spacing.gap.field.block = 0.25rem
```

Runtime, markup
`<div class="app"><li class="p-tabs__item is-dense"><span class="p-badge">`:

```text
.app                         --_spacing-gap-field-block-comfortable = 0.5rem
.app                         --_spacing-gap-field-block-dense       = 0.25rem
.app                         --_density-gap-field-block             = 0.5rem
.p-tabs__item.is-dense       --_density-gap-field-block             = 0.25rem   (subtree)
.p-badge                     --_component-gap-field-block           = 0.25rem   ✓ dense point
```

Non-subscriber immunity, same subtree:

```text
<p class="p-text"> inside the same dense tab
  --spacing-gap-field-block  = 0.5rem   ← public namespace untouched
  .p-text is not in the subscriber list, so it reads nothing dense  ✓
```

Nested comfortable reset:

```text
<li class="p-tabs__item is-dense">
  <div class="p-table__cell is-comfortable">
    --_density-gap-field-block = 0.5rem  (provider reset, same layer, later rule)
    <input class="p-form-input"> → 0.5rem  ✓
```

Input in a dense table cell resolves identically with
`.p-table__cell.is-dense` as the provider — same mechanism, no second
instance-level choice, which is the behaviour the proposal asks for.

The precedence bug this shape avoids: if density were emitted as a public
`.dense` class rewriting `--spacing-gap-field-block` directly, the paragraph
above would compress too, and a page author could apply `.dense` to `<body>`.
Both are prevented structurally, not by convention.

---

## 7. Migration critique and corrected sequence

The audit's four phases are directionally right and mis-sequenced in two places.

**Phase 0 — decisions (blocking, no code).**
1. Resolve A6: choose one horizontal policy across grid draft, spacing draft and
   Spec 020. Neither repo is the default winner.
2. Resolve A3: root font size stays out of the breakpoint axis, or is declared
   a non-token.
3. Resolve A4: canonical density covers spacing rungs only, or BF's
   occupied-block invariant is renegotiated.
4. Resolve A1 in BF: delete one owner of page margin and grid gutter.
5. Fix Spec 020's problem statement to cite computed values.
6. Freeze computed before-state fixtures for all four BF tiers, at all four
   breakpoints, light and dark, LTR and RTL.
7. Agree public axis and context names (`product`; `site/docs/app/os`).

**Phase 1 — plumbing (new; must precede any spacing ID).**
8. Fix `convertTokenIdToCssVar` to kebab-case; delete Pragma's shim block.
9. Emit `number.*`, or inline resolved values consistently; delete Pragma's
   hardcoded line-height ratios.
10. Correct primitive/semantic classification so path prefix alone does not make
    a semantic dimension primitive.
11. De-colour `buildModifierFamily` (B8) or fork a dimension builder.
12. Rename the `typography` modifier to `product`, keep an alias for one
    release.
13. Fix `spacing.baseline` to 4px and move it to the product axis (A2).

**Phase 2 — canonical spacing capability.**
14. Author the sixteen roles, the product documents and `responsive-roles.json`.
15. Add the spacing builder (media queries, product selectors, no `@container`).
16. Add the density builder plus `density-contract.json`; exclude density from
    `families`.
17. Point-wise equivalence tests: every product × breakpoint point, both density
    values of every density-responsive role.

**Phase 3a — BF format-only adapter.**
18. Read resolved semantic spacing in `src/build.ts`. Keep `--bf-*` as aliases.
19. Gate: computed geometry byte-identical to the Phase 0 fixtures. This phase
    changes no pixel.

**Phase 3b — BF Spec 020a value change.**
20. Component insets, mark/icon gap, panel inline padding, `inlineUnitRem`,
    provenance-based axis assertion (B3). Browser review of all four tiers.

**Phase 3c — BF Spec 020b, only after A6.**
21. Page margin, gutter, content padding. Single runtime owner.

**Phase 4 — Pragma adoption.**
22. Import canonical spacing; delete `spacing.css` aliases and the
    `modifiers.density.css` value matrix.
23. Replace `.comfortable` / `.dense` with generated providers and subscribers.
24. Remove editorial `space-after`.
25. Keep `1cap`; assert only alignment outputs differ from BF.

**Phase 5 — generator boundary.**
26. Major version: emit `nudgeStart` per role plus a provenance block. Remove
    `spaceAfter` and `marginBottom`.
27. Fix the drift sign and epsilon issues as a separately reviewed breaking
    change. Do not bundle with any of the above.

Two sequencing rules that the original plan violates and that matter more than
the phase numbering: **plumbing before publishing** (Phase 1 before 2), and
**format before value** (3a before 3b).

---

## 8. Acceptance gates

Executable. Each must fail on a seeded violation before it is trusted.

*design-tokens*
1. DTCG schema and resolver validation on every source document.
2. No unresolved `var()` reference in any generated CSS file.
3. Every emitted property name is lowercase-kebab; no camelCase segment.
4. Point-wise equality: for every product × breakpoint, the browser-computed
   value of each of the sixteen properties equals `resolver.apply()`.
5. Density: both pair members equal their DTCG points; no public `.dense` or
   `.comfortable` selector exists in output.
6. Provider/subscriber contract: automatic inheritance, nested comfortable
   reset, non-subscriber immunity, portal re-provide.
7. No `@container` rule in the spacing output.
8. Public/internal classification present in `tokens.json`; no `--_` property
   appears in the LSP artifact.
9. No modifier family with an empty context is published.
10. `responsive-roles.json` has exactly four entries; a fifth fails the build.

*Baseline Foundry*
11. Phase 3a: computed geometry identical to frozen fixtures, all four tiers ×
    four breakpoints × light/dark × LTR/RTL.
12. Axis separation by **provenance**: no authored horizontal spacing fact
    references `--bf-baseline`, `--bf-space-*` or a `…BaselineUnits` input, with
    the exemption list enumerated literally.
13. A fixture tier with inline unit ≠ baseline unit proves the assertion can
    fail (B3).
14. Exactly one runtime owner for page margin, grid gutter inline and grid
    gutter block; a second declaration fails the build.
15. Occupied-block ledger holds under `forced-colors: active`.
16. `npm test` and `npm run qa:components` green; browser review of affected
    demo states.

*Pragma*
17. Component and visual gates across site/docs/app, comfortable/dense,
    light/dark, forced colours, root-font scaling, non-100% zoom, RTL.
18. Zero shim declarations remain in `mapper.css`.
19. `1cap` and metric engines produce identical semantic spacing and differ only
    in alignment outputs, proven numerically rather than visually.

*Cross-cutting*
20. Browser-support check on every CSS function reaching published output.
21. Executable WCAG contrast matrix before the colour contract is called stable
    — a precondition for the colour work, not for spacing, but it should not be
    dropped from the programme.

---

## 9. Decision log — owner approval required

| # | Decision | Options | Recommendation |
|---|---|---|---|
| D1 | Horizontal policy conflict (A6) | grid draft / spacing draft / Spec 020 | Grid draft. It is implemented in BF, it is the more specific document, and it collapses the profile layer. |
| D2 | Root font size by breakpoint (A3) | keep / remove / reclassify | Remove from the token axis. |
| D3 | Canonical density scope (A4) | spacing rungs only / include control height | Spacing rungs only. Control height stays Pragma-local. |
| D4 | Axis name | `tier` / `product` | `product`. `tier` already means something else in the artifact. |
| D5 | Editorial context name | `editorial` / `site` | `site`. Two consumers already use it. |
| D6 | OS status | canonical peer / BF-only, marked | BF-only, marked. Promote when a second framework needs it. |
| D7 | Spec 020 disposition (Q16) | supersede / absorb / split | Split into 020a and 020b. |
| D8 | Cascade layer policy (B13) | layered both / unlayered both / mixed | Layered both, decided before Phase 3a. |
| D9 | Baseline value and axis (A2) | 8px breakpoint / 4px product | 4px on the product axis; editorial overrides to 8px. |
| D10 | Plugin naming break (A5) | fix now / shim | Fix now, before any spacing ID exists. |

---

## 10. Instructions for GPT

Do these in order. Do not skip ahead; several later items are invalid until an
earlier one is answered. Preserve all dirty and untracked work. Nothing here
authorises a branch switch or a rewrite.

**Step 1 — correct the audit's factual record.**
Amend [`docs/cross-repo-token-architecture-audit.md`](cross-repo-token-architecture-audit.md)
so it states, with the evidence cited in §2 above:

- A1: `src/css-grid.ts` unconditionally overrides tier page margin and grid
  gutter at equal specificity and later source order; those tier fields never
  render.
- A2: `baselineUnit` is tier-scoped (editorial 0.5rem, others 0.25rem);
  Canonical's 8px baseline is stale against both consumers and against the
  spacing draft.
- A3: `rootFontSize` varies by breakpoint, which makes every rem token
  responsive in computed px.
- A5: the plugin's name transform does not kebab-case, so the audit's CSS
  property column is wrong.
- A6: the three-way horizontal policy conflict, as a table.

Do not restate the correction; replace the wrong claim.

**Step 2 — file the decision log.**
Add D1–D10 from §9 to `INBOX.md` as a single owner-decision block. Do not
proceed past Step 3 for any item whose decision is open.

**Step 3 — correct Spec 020 without changing its approved matrix.**
In [`specs/020-tier-horizontal-gradient/spec.md`](../specs/020-tier-horizontal-gradient/spec.md):

- rewrite the "gradient is inverted for layout" paragraph to describe computed
  values, and state plainly that page margin and grid gutter render identically
  across tiers today because of `src/css-grid.ts`;
- add a boundary stating that Spec 020 does not delete responsive gutter
  escalation, and name the conflict with the canonical grid draft §2.3;
- split the package into 020a (insets, mark/icon gap, panel padding,
  `inlineUnitRem`, axis assertion) and 020b (page margin, gutter, content
  padding), and mark 020b blocked on D1;
- record that Spec 019 archives as superseded by 020a.
- In `contracts/horizontal-gradient-matrix.md`, relabel the "Current state"
  table as *authored configuration* and add a second table of *computed
  runtime* values, so the two are never confused again.

**Step 4 — strengthen the axis-separation assertion before implementing it.**
The assertion as specified compares values, and BF's inline unit equals its
baseline unit in three of four tiers, so it will pass vacuously. Change it to
compare provenance — the authored input field and the referenced CSS variable —
and add a fixture tier with a deliberately mismatched pair so the assertion has
a failing case. This is a spec change, not an implementation change; make it in
020a's acceptance criteria.

**Step 5 — rewrite the proposed schema section of the audit.**
Replace the sixteen-row vocabulary table, the resolver-axis table and the
source-layout block with §5.1–5.5 above. Specifically:

- all-lowercase segments only;
- `tier` → `product`, renaming the existing `typography` modifier rather than
  adding a parallel axis;
- four block levels (`gap.group`, `gap.pattern`, `gap.region`,
  `inset.strip.block`), not three;
- `spacing.gap.mark.inline`, not `iconLabel`;
- drop the `layout` segment and `rhythm` segment;
- `responsive-roles.json` limited to the four layout roles;
- `policy/` documents declared non-DTCG build inputs;
- delete the `com.canonical.quantization` extension proposal.

**Step 6 — rewrite the delivery-changes list for design-tokens.**
Insert the plumbing phase. The list must state that items 8–13 in §7 land
*before* any spacing ID is authored, and must add: exclude density from the
plugin's `families` array; forbid `@container` in spacing output; require a
`--_` prefix for every internal property.

**Step 7 — rewrite the migration sequence.**
Replace the four-phase plan with §7. The two rules that must survive editing are
"plumbing before publishing" and "format before value" — Phase 3a changes no
pixel, and Phase 3b is a separate reviewed commit.

**Step 8 — replace the gates section.**
Use §8. Every gate must be executable and must be provable by seeding a
violation. Remove any gate phrased as a review note.

**Step 9 — do not implement.**
No change to `src/`, `config/`, `dist/`, `design-tokens`, `pragma` or
`baseline-nudge-generator` is authorised by this review. The only artefacts to
touch are the audit, this review's decision block in `INBOX.md`, and the Spec
020 documents named in Step 3.

**Step 10 — report back with exactly this.**
The owner's answers to D1–D10, the corrected Spec 020 split, and a one-page
statement of what the first canonical pull request would contain — token IDs,
files added, builder changes, and the gates it satisfies. Nothing else.
