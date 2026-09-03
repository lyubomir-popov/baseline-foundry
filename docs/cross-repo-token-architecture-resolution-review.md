# Resolution review: cross-repository spacing and baseline token architecture

Reviewer: principal design-systems architect / TypeScript-CSS platform review.
Date: 2026-09-03. Read-only. No implementation, no spec edit, no branch change.
`AGENT-INBOX.md` deliberately left untouched, per the review request.

Subject: [`docs/cross-repo-token-architecture-spec.md`](cross-repo-token-architecture-spec.md)
and the owner resolution in
[`prompts/opus-token-architecture-resolution-review.md`](../prompts/opus-token-architecture-resolution-review.md).

---

## 1. Verdict

**Accept with required corrections to §3 of the governing spec.**

The architecture is sound and I have no remaining objection to it. The owner
resolution is correct on both points where it overrules me, and I withdraw both
claims in §2 below.

One new finding requires a spec text change before PR 2, and it is not about
the schema:

> **D1 — the half-step case is not one role. Six of the seventeen canonical
> font-size/line-height pairings are half-integers at an 8px Site baseline,
> including the pairing Site uses for its display heading.**

Computed directly from
`design-tokens/packages/tokens/tokens/canonical/global/primitive/number.tokens.json`
and `…/dimension.tokens.json`:

| Key | Font | Ratio | Line | Units @ 8px | Units @ 4px |
|---|---:|---:|---:|---:|---:|
| 200 | 10px | 1.2 | 12px | **1.5** | 3 |
| 250 | 12px | 1.3333 | 16px | 2 | 4 |
| **300** | **14px** | **1.4286** | **20px** | **2.5** | 5 |
| 350 | 16px | 1.5 | 24px | 3 | 6 |
| 400 | 18px | 1.3333 | 24px | 3 | 6 |
| 450 | 21px | 1.3333 | 28px | **3.5** | 7 |
| 500 | 24px | 1.3333 | 32px | 4 | 8 |
| 550 | 28px | 1.2857 | 36px | **4.5** | 9 |
| 600 | 32px | 1.25 | 40px | 5 | 10 |
| 650 | 36px | 1.2222 | 44px | **5.5** | 11 |
| 700 | 42px | 1.1429 | 48px | 6 | 12 |
| 750 | 48px | 1.1667 | 56px | 7 | 14 |
| 800 | 55px | 1.1636 | 64px | 8 | 16 |
| 850 | 63px | 1.1429 | 72px | 9 | 18 |
| 900 | 73px | 1.0959 | 80px | 10 | 20 |
| **950** | **84px** | **1.0952** | **92px** | **11.5** | 23 |
| 1000 | 96px | 1.0833 | 104px | 13 | 26 |

`global/semantic/modifier/typography/sites.tokens.json:10-12` binds
`typography.heading.display` to `fontSize.950` and `lineHeight.950`. So Site's
most prominent role is an 11.5-unit half-step, in the one product where the
half-step rule bites.

At an 8px Site baseline, 35% of the canonical scale is a half-step. The spec's
framing — "deliberately rare exceptions", "the first and currently only
accepted half-step role" — is not true of the source. That framing must change
before the exception manifest is written, or the manifest becomes a second
scale wearing an exception's clothes.

**D2 makes this straightforward to fix.** BF Editorial already solved it. Its
authored roles are 16px/24px, 24px/32px and 42px/48px
(`config/tiers/editorial.json`), which are exactly canonical keys 350, 500 and
700 — three of the eleven whole-step members. BF Editorial has no 14px role at
all. So the whole-step subset is already proven at an 8px baseline by the
normative geometry reference, and the honest contract is a **permitted Site
subset**, not a per-role exception list.

Recommended §3 correction is in §8 of this review.

---

## 2. Disposition of C1

**C1 is Pragma migration scope, not a schema blocker. Withdrawn as a blocker.**

The owner premise resolves it cleanly: once current Pragma output is
explicitly non-normative, the twelve source locations I listed are work
estimates, not constraints on the token. My previous recommendation to defer
`spacing.baseline` to PR 3 rested on treating Pragma's integer-multiplier
density cells as something to preserve. The spec says they are not. Nothing in
the schema depends on them.

The evidence behind C1 stands and remains useful as migration scope. Its
classification was wrong.

One qualification, which is a real PR-2 dependency but not the baseline's:
acceptance gate 2 in the spec ("every resolved typography line height is a
whole baseline count unless … in the manifest") cannot ship in PR 2 until D1 is
resolved, because the manifest would need six entries the spec does not
anticipate. See Q5 and Q10.

---

## 3. Answers to the ten questions

### Q1 — Is the spec internally coherent after making whole counts the default?

Coherent in mechanism, **incoherent in its factual premise**, for three
reasons, all in §3 of the spec.

1. **D1** above. "Currently only accepted half-step role" is contradicted by
   six pairings, one of which Site actively uses.
2. **Wrong source attribution.** The spec says "The Canonical source already
   pairs `dimension.size.fontSize.300` with `number.lineHeight.300` for Site
   secondary text." It is authored in
   `global/semantic/modifier/typography/global.tokens.json:195-201`, under
   `typography.text.secondary` — the **global** context, inherited by all four
   products. It is not a Site decision. In docs, app and os it resolves to a
   clean 5 units on a 4px baseline; only Site turns it into a half-step. The
   exception is therefore a *product-conditional consequence of a global
   pairing*, which is a different thing to manage.
3. **The exception is not one role even at 14px.** `typography.text.secondary.bold`
   (`global.tokens.json:221-231`) and `typography.text.secondary.code`
   (`:252`) inherit `fontSize` and `lineHeight` by `$ref` from
   `text.secondary`. A manifest keyed on exact product/role pairs needs at
   least three entries today, and silently needs a fourth the moment another
   `$ref` variant is added.

Everything else in §3 is coherent: the lattice rule, the rejection of runtime
`round()` as a repair, the refusal to snap to 24px, the refusal to drop Site to
4px, and the requirement to validate resolved values rather than pixel comments
are all correct and I support them without reservation.

### Q2 — Does Site 14px/20px work without runtime snapping?

Yes, and the four cases the request asks me to distinguish behave differently.
Using Site B = 8px, H = 20px, and BF's nudge `N` with derived compensation
`C = B − N` ([src/css.ts](../src/css.ts#L48)):

**Glyph baseline alignment.** Works exactly. The nudge is computed to place the
*first* text baseline on a grid line, and it does not depend on H being a whole
multiple. No change needed.

**Line-to-line advance.** Each subsequent line box advances by H = 2.5B.
Line 1 baseline on-grid, line 2 at +2.5B (half-phase), line 3 at +5B (on-grid),
line 4 half-phase. Odd lines on the primary phase, even lines on the 4px
half-phase. The spec states this correctly.

**Single-line painted and occupied block.** Painted = H + N (+ borders where
present). Occupied = H + N + C = H + B = 2.5B + B = **3.5B**. This is the
consequence the spec does not state: a single-line half-step element's occupied
block is a *half*-integer multiple, so it is grid-aligned at its start and
**not** at its end. The next sibling starts on the half-phase. That is true for
a single line, not only for multiline flow — the spec currently implies the
phase problem is a multiline problem.

**Boundary after an arbitrary multiline block.** For `n` lines, occupied =
`n × 2.5B + B`. Even `n` → whole multiple, grid-aligned exit. Odd `n` → half
multiple, half-phase exit. Since `n` is content-dependent and unknowable at
author time, **the exit phase of a half-step block is non-deterministic**.

That last point is the sharpest consequence and it has a clean answer: a
half-step role must be used inside a container that owns the boundary, and the
container restores phase with a `mod()` snap of its own occupied block — the
same mechanism BF already uses at
[src/css-component-contracts.ts](../src/css-component-contracts.ts#L37). The
spec gestures at this ("or be placed in an explicitly reviewed wrapper whose
boundary policy is tested"); it should require it for multiline use rather than
offer it as an alternative to accepting the alternation.

### Q3 — What must change in BF's alignment assertions?

The relevant assertion is
[scripts/validate-build.ts](../scripts/validate-build.ts#L241):

```ts
const baselineCompensation = baselineUnit - parseRemValue(token.nudgeTop);
assert(Math.abs(marginBottom - baselineCompensation) <= 0.00001,
  `Expected ${tierName}/${roleName} manifest marginBottom to complement nudgeTop to one baseline unit.`);
```

**This assertion does not assume a whole-baseline line height and does not need
to change.** It constrains `N + C = B` only, which holds for any H.

What is missing is the invariant everything else relies on. Nothing in the
build currently asserts that `H / B` is an integer, and nothing asserts that a
role's occupied block lands on the grid. Those are assumed, and they are true
today only because every BF tier happens to author whole counts.

Smallest honest amendment — two new assertions, not a change to the existing
one:

```ts
// 1. Lattice rule, per tier and role.
const count = parseRemValue(token.lineHeight) / baselineUnit;
const isWhole = Number.isInteger(count);
const isManifestHalf = halfStepManifest.has(`${tierName}/${roleName}`)
  && Number.isInteger(count * 2);
assert(isWhole || isManifestHalf,
  `Expected ${tierName}/${roleName} line height to be a whole baseline count, or a manifest-authorised half count.`);

// 2. Occupied-block phase, stated rather than assumed.
const occupiedUnits = count + 1;               // H + N + C = H + B
assert(Number.isInteger(occupiedUnits) === isWhole,
  `Expected ${tierName}/${roleName} occupied block to exit on the primary phase only for whole-count roles.`);
```

Assertion 2 is the important one: it makes the half-phase exit an asserted,
visible property of manifest roles instead of an undocumented consequence. It
strengthens the ordinary contract rather than weakening it, because a
whole-count role that somehow produced a half exit now fails.

One adjacent assertion assumes whole counts and should be reviewed at the same
time: [scripts/validate-build.ts](../scripts/validate-build.ts#L677) requires
`min-block-size: calc((var(--bf-baseline) * 4) - var(--bf-body-margin-bottom))`
for side-navigation group headings — a four-baseline reserve that is only
correct while the body role is a whole count.

### Q4 — DTCG representation and validation for 14px → 20px

**Do not author a decimal ratio.** `number.lineHeight.300` is `1.4286`
(`number.tokens.json:15`), and `14 × 1.4286 = 20.0004px`. That approximation is
already shipped downstream: Pragma re-declares it verbatim at
`packages/styles/typography/src/mapper.css:76`. Exact-equality validation
against `2.5 × 8px` fails on it, and a loose tolerance is precisely the
"arbitrary fractional leading" the spec wants to forbid.

Recommended representation, in preference order:

1. **Author the line height as a dimension.** `typography.text.secondary` binds
   `lineHeight: "{dimension.250}"` = 1.25rem. Exact, no ratio, no float, and
   DTCG-representable. Cost: the DTCG `typography` composite conventionally
   expects a unitless `lineHeight`, so this needs a written deviation and a
   builder that emits a length. Verify against the 2025.10 composite definition
   before adopting.
2. **Author the count, derive the value.** Source of truth is
   `{ fontSize: {dimension.size.fontSize.300}, lineHeightCount: 2.5 }` under a
   Canonical extension; the builder emits `1.25rem`. Validation is exact
   rational arithmetic — `count × baseline` against the emitted rem — with zero
   tolerance. This is the most honest and the easiest to validate.
3. **Keep the ratio, validate the product.** If the unitless ratio must survive
   for compatibility, then the rule is not about the ratio at all:

   ```text
   emitted ratio must carry >= 6 significant digits    (1.4286 fails; 1.428571 passes)
   |fontSize_px x ratio - count x baseline_px| <= 0.005px at a 16px root
   the same check re-run at the largest supported root (18px)
   ```

   `1.4286` gives 0.0004px error at a 16px root and 0.00045px at 18px, so it
   passes the tolerance but fails the precision gate. Raise the precision; the
   tolerance is then a backstop, not the mechanism.

Whichever is chosen, the validator must read the **resolved** font size and
line height, never the `$description` — the spec already says this and it is
right. Note that `$description` at `global.tokens.json:216` says "(14px)",
which is only true at a 16px root and becomes false under BF's optional
1.125rem policy.

### Q5 — Any technical dependency requiring baseline out of PR 2?

**No schema blocker.** Separating the two:

*Schema dependencies of `spacing.baseline` in PR 2:* the `product` axis exists
(plumbing PR item 7), the baseline moves off the breakpoint axis, and the
spacing builder emits product-selectored rules. All are in PR 1. Nothing else.

*Downstream migration effort:* the twelve Pragma locations from C1. Large, and
explicitly non-normative. Not a dependency.

*The one genuine PR-2 coupling, and it is not the baseline:* spec acceptance
gate 2 makes line-height validation a PR-2 requirement. That gate needs the
half-step manifest, and D1 means the manifest is not a one-line file. So the
smallest correction is to decouple the gate, not the token:

- ship `spacing.baseline` in PR 2 as specified;
- ship the lattice **validator** in PR 2 in report-only mode;
- ship it as a failing gate in PR 3, once the Site subset decision (D1) is
  made.

That keeps the baseline in the first token PR, which is what the owner wants,
without pretending the exception manifest is ready.

### Q6 — Does the Pragma migration section remove every conflicting assumption?

Nearly. §10 PR 4 covers the cell, target baseline, snapping, fixed sizing,
baseline-derived inline padding, the debug grid, `spaceAfter` and density
classes. Omissions, all verified in source:

1. **`--density-target-baseline-px` has a second consumer beyond the cell.**
   `packages/styles/main/src/modifiers.density.css:192` computes it inside
   `:where(.comfortable, .dense, .app, .site, .docs)`, so it is established by
   a bare product class with no density class at all. Deleting the cell without
   deleting this selector leaves a target baseline on every product root.
2. **The `@property --baseline-height` fallback is registered in four places** —
   `typography/src/baseline-shim.css:14` plus inline shims at
   `baseline-cap.css:13`, `baseline-metrics.css:18` and `baseline-trim.css:13`,
   all at 4px. Under a product-scoped baseline, Site silently renders on a 4px
   grid whenever `.site` is absent. The migration list needs "one fallback
   owner, and a missing product class must fail loudly".
3. **`--computed-line-height: calc(var(--baseline-height) * var(--line-height-multiplier))`**
   at `baseline-cap.css:59`, `baseline-metrics.css:65` and
   `baseline-trim.css:49` is a second snapping mechanism independent of
   `mapper.css`. Removing the `round(up, …)` in the mapper does not remove
   this. Both must go.
4. **The back-compat alias block** at `modifiers.density.css:68-78` and
   `:94-104` re-exports `--lh-comfy`, `--pad-inline-comfy` and peers. Deleting
   the cell without deleting the aliases leaves undefined references in any
   consumer still reading them.
5. **`spacing.css:57` `--spaceAfter-button: var(--space-200)`** is a
   non-typographic element-owned space-after that the "remove semantic
   element-owned `spaceAfter`" line does not obviously cover. Name it.

### Q7 — Can exact BF button dimensions be proven with `block-size: auto`?

Partly, and the spec contains a contradiction that must be resolved first.

**The contradiction.** §5 permits Pragma to retain `1cap` *and* requires
"BF-to-Pragma computed comparisons must prove the same painted and occupied
dimensions for every shared component state". BF's own source says cap-derived
nudges are not equivalent. [src/css-components.ts](../src/css-components.ts#L120)
carries the comment:

```
/* DEMO ONLY — Cap-derived component nudges are unreliable (ascender ≠ cap height). */
:where(.bf-theme.bf-engine-cap) { --bf-body-nudge-start: calc(...1cap...); }
```

and [scripts/validate-build.ts](../scripts/validate-build.ts#L658) asserts
built-in tiers retain metric-derived nudges. So `N_metric ≠ N_cap` by BF's own
finding, and:

```text
painted = line + 2 x max(N - border, 0) + 2 x border
```

differs between engines by `2 x |N_metric - N_cap|`. **Painted-block equality
is unprovable** while both engines are permitted.

**What is provable.** Occupied block snaps to the lattice:

```text
compensation = mod(B - mod(painted, B), B)
occupied     = painted + compensation
```

Two painted blocks differing by less than the distance to the next lattice line
produce the *same* occupied block. So the minimal honest gates are:

1. `occupied_BF == occupied_Pragma`, exactly, per component state.
2. First text baseline offset from the occupied-block start is equal, exactly.
3. `block-size` is `auto` and no `min-block-size` or `block-size` literal
   appears in any shared control rule — a static assertion, cheap and total.
4. Inline inset, border accounting and nested-host fit equal, per the existing
   BF ledger.
5. `|painted_BF − painted_Pragma| < B` — a bound, not equality, and it fails
   loudly if the two engines ever drift far enough to cross a lattice line.

Gate 5 is the one that makes the arrangement honest: it permits the engines to
differ, and it detects the moment that difference becomes visible.

### Q8 — Is the revised provider/subscriber interpretation correct?

**Yes, and my earlier claim was wrong on both the arithmetic and the
principle.** Withdrawn.

*Principle.* A provider establishes an inherited context for descendants. Its
own block size is irrelevant to that. Requiring a provider to be intrinsic
before it may provide was a non sequitur. The spec's formulation is correct: a
fixed host becomes migration debt only if it also subscribes, changes
accidentally with the product baseline, or fails host-fit.

*Arithmetic.* Corrected facts in §6 below. The 80px figure was wrong twice.

### Q9 — Does any v1 token encode typography, control geometry, or page policy?

No boundary violation found. Checked each of the twelve against source
ownership. Three notes, none requiring a rename:

- `spacing.baseline` is the one token that *constrains* typography, via §3's
  lattice rule. That is intended and should stay, but the spec should say
  explicitly that it constrains line height without owning it — otherwise the
  next reader will try to move line height under `spacing.*`.
- `spacing.inset.strip.block` is the closest to the grid boundary. BF's
  `stripSpaceBaselineUnits` is 8, 12, 12 and 8 across editorial, documentation,
  app and os (`config/tiers/*.json`), i.e. a page-composition decision. It is
  block-axis and the grid owns inline, so it stays — but it is the one to watch
  when 020b lands.
- No v1 token encodes control geometry. Confirmed: nothing in the vocabulary
  can express a height, a cell or a target.

### Q10 — Is the sequence executable with baseline in PR 2?

Yes. No cycle exists. One correction, already given in Q5: decouple acceptance
gate 2 from PR 2 by shipping the lattice validator report-only, promoting it to
a hard gate in PR 3 after the Site subset decision.

One sequencing detail worth adding to §10: PR 2's point-wise tests need the
`product` alias from PR 1 item 7 to be *live*, not just present, because
`transformTypographyContexts` in
`design-tokens/packages/plugin/src/plugin/canonicalPlugin.ts` iterates the
literal contexts `["app", "docs", "site"]`. There is no `os` context anywhere
in the typography modifier. PR 1 must add it, or PR 2's four-product baseline
matrix has nothing to resolve `os` against.

---

## 4. The half-step line-height contract

Reviewed explicitly, as requested.

**What is right.** The lattice formulation is correct and enforceable. Refusing
runtime `round()` as a repair is correct — it converts an authoring error into
unreviewed geometry, which is exactly the failure Pragma's
`mapper.css:24` currently institutionalises. Refusing to snap 20px to 24px is
correct. Refusing to drop Site to 4px is correct. Validating resolved values
rather than descriptions is correct, and necessary: `global.tokens.json:216`
says "(14px)", which is root-dependent.

**What is wrong.** The framing, per D1. Six of seventeen steps are half-steps at
8px; Site's display heading is one of them; the 14px pairing is global, not
Site; and `$ref` variants inherit it. "Rare exception" describes a system that
does not exist at source.

**What is missing.** Four consequences the spec does not state:

1. A single-line half-step element already exits on the half-phase
   (occupied = 3.5B). The spec treats phase as a multiline issue.
2. A multiline block's exit phase depends on line count and is therefore
   non-deterministic at author time.
3. The `$ref` inheritance means the manifest must either enumerate transitive
   dependents or key on the root role and declare inheritance.
4. The nudge generator's current permissiveness is real: `config-validator.js:18`
   accepts "0 or a multiple of 0.25", i.e. quarter counts. The spec says this
   must narrow. Worth adding that the narrowing must be to *baseline* counts,
   not to the generator's own unit, because the two differ per product.

**Recommended resolution.** Replace the one-role exception with a permitted
subset plus a bounded exception list. BF Editorial already proves the subset
(D2): it authors only canonical keys 350, 500 and 700, all whole steps at 8px,
and has no 14px role at all. The 2.5-unit case is a Pragma Site requirement,
not a BF-proven pattern — which is worth saying plainly, because it changes who
must justify it.

---

## 5. Intrinsic, no-target control parity

Reviewed explicitly, as requested.

**Supported.** The inside-out ledger in §5 matches BF's implementation exactly.
`--bf-interface-row-painted-block-size`,
`--bf-interface-row-compensation-block-end` and
`--bf-interface-row-occupied-block-size` are asserted as a single contract at
[scripts/validate-build.ts](../scripts/validate-build.ts#L650), and BF already
proves the hard case — an icon-only button holding the line without a height —
via a zero-width metric strut, asserted at
[scripts/validate-build.ts](../scripts/validate-build.ts#L762). Requiring
Pragma to reproduce this is reasonable because a working reference exists.

**Required correction.** The painted-block equality requirement is unprovable
while both engines are permitted. See Q7. Replace it with occupied-block
equality, baseline-offset equality, a static no-target assertion, and a bounded
painted-block divergence check.

**Second required correction.** §5 says "Pragma may retain its `1cap`
approximation" without qualification, while BF's source calls cap-derived
component nudges unreliable. Both can be true — for text roles BF uses metrics
and quarantines cap to a demo engine — but the spec should say *where* `1cap`
is acceptable (alignment of text within a control whose occupied block is then
snapped) and where it is not (any place a painted dimension is compared).

---

## 6. Corrected side-navigation facts

My previous review said `SideNavigation/Item` renders 40px and would become
80px under an 8px Site baseline, and that it must lose its fixed size before
the manifest ships. All three claims were wrong.

Verified facts:

- `packages/styles/main/src/spacing.css:23` declares `--space-baseline: 0.25rem`.
  A workspace-wide search finds **exactly one** declaration of that property —
  no scoped override exists anywhere in `packages/`.
- `packages/react/ds-app/src/lib/SideNavigation/common/Item/styles.css:23`
  declares `block-size: calc(var(--space-baseline) * 5)`, with the comment
  `/* 40px — 5bU */` and a header comment describing "a fixed 5bU/40px row
  height (matching the header)".
- 5 × 0.25rem = 1.25rem = **20px** at a 16px root. Not 40px.

So the comment is not merely stale — **the component renders at half its
documented and intended height today**. It is a live defect, written when the
baseline was 8px and never re-derived when it moved to 4px.

The product baseline change does not fix it and partially masks it:

| Product | Baseline | `calc(--space-baseline * 5)` | Intent |
|---|---:|---:|---|
| Site | 0.5rem | 40px | matches, by coincidence |
| Docs / App / OS | 0.25rem | 20px | still wrong |

Side navigation is an app-tier component, so the product move leaves the defect
exactly where it is. The correct fix is to re-author the row intrinsically per
the §5 ledger, which the migration already requires — not to rely on the
baseline change.

Correct precondition for a fixed host to provide dense context, restated: none.
A provider needs only to establish the inherited property. `SideNavigation/Item`
qualifies as a provider today. It is migration debt on independent grounds —
it derives a fixed size from the global baseline (spec §6's second criterion,
"changes accidentally with product baseline") and it currently renders wrong.

---

## 7. Remaining blockers

Two, and only one touches PR 2.

**R1 — D1 must be resolved before the half-step manifest is authored.**
Blocks acceptance gate 2, not `spacing.baseline`. Decide whether Site's
permitted type scale is the eleven whole-step canonical members, or whether the
six half-step members are admitted with reviewed evidence each. `heading.display`
at key 950 forces the question, because Site uses it.

**R2 — the `1cap` versus painted-block contradiction in §5.**
Blocks writing the parity gates. Resolve by adopting the Q7 gate set.

Not blockers, recorded for completeness: the four Pragma migration omissions
(Q6), the missing `os` typography context (Q10), and the DTCG line-height
representation choice (Q4), which can be made inside PR 1.

---

## 8. Exact wording patches for the governing spec

### Patch 1 — §3, replace the exception framing

Replace "Site secondary text is the first and currently only accepted half-step
role" and the paragraph beginning "The Canonical source already pairs" with:

> At an 8px Site baseline, six of the seventeen canonical font-size and
> line-height pairings resolve to half-integer counts: keys 200 (12px), 300
> (20px), 450 (28px), 550 (36px), 650 (44px) and 950 (92px). All eleven others
> are whole counts. Site's permitted type scale is therefore defined as the
> whole-count subset, and any use of a half-count member requires a manifest
> entry with visual evidence.
>
> This is proven by the normative reference: BF Editorial authors only keys
> 350, 500 and 700 (`config/tiers/editorial.json`), all whole counts at 8px,
> and has no 14px role.
>
> `typography.text.secondary` is authored in the global typography context at
> `global/semantic/modifier/typography/global.tokens.json:195-201`, not in
> `sites.tokens.json`. It resolves to a whole 5 units in Docs, App and OS, and
> to 2.5 units only in Site. Its `bold` and `code` variants inherit the same
> font size and line height by `$ref`, so a manifest keyed on exact product and
> role pairs requires at least three Site entries. The manifest may instead key
> on the root role and declare that `$ref`-derived variants inherit the
> exception, with a test that enumerates transitive dependents.
>
> `typography.heading.display` in Site binds key 950 (92px, 11.5 units) at
> `sites.tokens.json:10-12`. It must be re-pointed to a whole-count member or
> admitted to the manifest before the lattice gate becomes blocking.

### Patch 2 — §3, add the phase consequences

Append to the "honest phase consequence" paragraph:

> The consequence applies to single-line use as well. A half-count role's
> occupied block is `line + baseline`, so a 2.5-unit line yields a 3.5-unit
> occupied block: grid-aligned at its start, half-phase at its end. For
> multiline use the exit phase is `n × 2.5 + 1` baselines and therefore depends
> on the rendered line count, which is not knowable at author time. Multiline
> half-count text must therefore sit inside a container that owns and restores
> the boundary phase; accepting the alternation is sufficient only for the
> interior, not for the exit.

### Patch 3 — §5, replace the parity requirement

Replace "BF-to-Pragma computed comparisons must prove the same painted and
occupied dimensions for every shared component state" with:

> BF-to-Pragma computed comparisons must prove: identical occupied block;
> identical first-text-baseline offset from the occupied-block start; identical
> inline inset and border accounting; identical nested-host fit; `block-size`
> resolving to `auto` with no `block-size` or `min-block-size` literal in any
> shared control rule; and painted-block divergence strictly less than one
> baseline.
>
> Painted-block equality is not required and is not provable while the two
> engines differ. BF's own source records that cap-derived component nudges are
> unreliable because the ascender is not the cap height
> (`src/css-components.ts`, `.bf-engine-cap`, demo-only), and
> `scripts/validate-build.ts:658` asserts that built-in tiers retain
> metric-derived nudges. `1cap` remains acceptable for seating text within a
> control whose occupied block is then snapped; it is not acceptable as the
> basis of a painted-dimension comparison.

### Patch 4 — §6, correct the side-navigation facts

Replace the final paragraph of §6 with:

> Pragma's side navigation is migration debt on two independent grounds, not
> because it is fixed-size. `packages/styles/main/src/spacing.css:23` is the
> single declaration of `--space-baseline` at 0.25rem, so
> `block-size: calc(var(--space-baseline) * 5)` in
> `react/ds-app/src/lib/SideNavigation/common/Item/styles.css:23` computes to
> 20px today while its comment and the component's stated design intent say
> 40px. The row therefore renders at half its intended height. The product
> baseline change does not fix this — Site would coincidentally reach 40px
> while Docs, App and OS remain at 20px — so the row must be re-authored
> intrinsically per §5. Its ability to provide dense context to descendants is
> unaffected either way.

### Patch 5 — §10, decouple the lattice gate from PR 2

Append to the PR 2 description:

> The line-height lattice validator ships in PR 2 in report-only mode. It
> becomes a blocking gate in PR 3, once the Site permitted-subset decision in
> §3 is made. `spacing.baseline` is not deferred by this; only the gate is.

### Patch 6 — §9, add the missing OS typography context

Append as item 9:

> 9. add an `os` context to the product modifier. The plugin currently iterates
>    the literal contexts `["app", "docs", "site"]`
>    (`design-tokens/packages/plugin/src/plugin/canonicalPlugin.ts`,
>    `transformTypographyContexts`), so a four-product baseline matrix has
>    nothing to resolve `os` against until this lands.

### Patch 7 — §10 PR 4, add the four omitted Pragma removals

Append to the Pragma migration list:

> - remove `--density-target-baseline-px` from the bare product selector at
>   `modifiers.density.css:192`, not only from the density cell;
> - consolidate the `--baseline-height` `@property` fallback to one owner
>   (`baseline-shim.css:14`, plus inline shims in `baseline-cap.css:13`,
>   `baseline-metrics.css:18`, `baseline-trim.css:13`) and make a missing
>   product class fail loudly rather than resolve to 4px;
> - remove the second snapping path,
>   `--computed-line-height: calc(var(--baseline-height) * var(--line-height-multiplier))`
>   in all three engines, alongside the `mapper.css` `round(up, …)`;
> - remove the back-compat alias blocks at `modifiers.density.css:68-78` and
>   `:94-104`; and
> - remove `--spaceAfter-button` (`spacing.css:57`) with the other
>   element-owned space-after values.

### Patch 8 — §11, replace gate 9

Replace acceptance gate 9 with:

> 9. Pragma's migrated shared controls match BF's occupied block, first-text-
>    baseline offset, inline inset, border accounting and nested-host fit
>    exactly; resolve `block-size: auto` with no height literal; and diverge in
>    painted block by less than one baseline.

### Patch 9 — §3, tighten the generator narrowing

Append to the final paragraph of §3:

> The generator currently accepts "0 or a multiple of 0.25"
> (`baseline-nudge-generator/src/config-validator.js:18`), i.e. quarter counts
> of its own unit. The narrowed rule must be expressed in **baseline** counts
> for the active product, because the generator's unit and the product baseline
> are not the same quantity.
