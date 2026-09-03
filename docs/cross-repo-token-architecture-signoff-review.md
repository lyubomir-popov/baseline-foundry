# Sign-off review: cross-repository spacing and baseline token architecture

Reviewer role: final adversarial architecture sign-off. Read-only.
Date: 2026-09-03.

## 0. Provenance

- Model: Claude Opus 5 (`claude-opus-5`), GitHub Copilot CLI, non-interactive
  autonomous mode.
- Workflow: read `AGENTS.md`, `AGENT-INBOX.md`,
  [`cross-repo-token-architecture-spec.md`](cross-repo-token-architecture-spec.md),
  the audit, review, final-review and resolution-review records, and
  [`prompts/opus-token-architecture-signoff-review.md`](../prompts/opus-token-architecture-signoff-review.md);
  then re-derived every load-bearing number from source in
  `baseline-foundry`, `design-tokens`, `pragma`, and `baseline-nudge-generator`.
- Independent computation: token resolution and baseline counts were recomputed
  from `number.tokens.json` / `dimension.tokens.json` / the four typography
  modifier files with a throwaway resolver; Ubuntu Sans metrics were extracted
  directly from the shipped
  `assets/fonts/UbuntuSans[wdth,wght].ttf` with `fontkit`, including
  instantiation at `wght` 100–800 and `wdth` 75–100.
- No prior review conclusion is relied on. Where a prior review is cited it is
  because I reproduced its evidence independently.
- Nothing was merged, committed, branched, pushed, published, or implemented.
  Only this file was written.

## 1. Verdict

**Accept with required corrections.**

The architecture is sound. Every substantive owner decision under review
survives independent verification against source: the product baseline matrix,
the container-owned/intrinsic geometry model, the axis separation, the
`1cap`-versus-metric framing, the rejection of a one-baseline tolerance, and
the rejection of a generic `mod()` multiline repair. The corrections below are
all wording- or sequencing-level. None of them requires a redesign, and none
reopens a settled owner decision.

Four blockers must be fixed in the governing spec before PR-2 planning. Three
are one-to-three sentence edits; the fourth is a named Canonical source edit.

## 2. Blocking findings

### S1 — The blocking PR-2 lattice gate depends on a decision §12 defers

**Severity: blocking (schema/sequencing). Smallest fix: one PR-1 plumbing item.**

Spec §10 PR 2: *"The resolved line-height lattice validator lands as a blocking
PR 2 gate … so no report-only phase is needed."* Spec §3: *"validation evaluates
the resolved font size and line-height ratio."* Spec §12 simultaneously lists
*"the exact DTCG representation that resolves the 14px/20px role"* as
undetermined implementation evidence.

Those two cannot both hold. Canonical authors line height as a 4-decimal
unitless ratio, so almost no role resolves exactly. Recomputed from
`design-tokens/packages/tokens/tokens/canonical/global/primitive/number.tokens.json`
and the typography modifier files:

| Site role | Resolved line height | Count at 8px |
| --- | ---: | ---: |
| `text.primary.$root` (16px × 1.5) | 24.0000px | 3.00000 |
| `text.secondary.$root` (14px × 1.4286) | 20.0004px | 2.50005 |
| `text.tertiary.$root` (12px × 1.3333) | 15.9996px | 1.99995 |
| `heading.1` (42px × 1.1429) | 48.0018px | 6.00023 |
| `heading.3` (24px × 1.3333) | 31.9992px | 3.99990 |
| `heading.display` (84px × 1.0952) | 91.9968px | 11.49960 |

Under the spec's own rule — *"H / B is a positive integer … every other result
invalid"* — 22 of the 28 resolvable Site roles fail today, including roles the
spec treats as unambiguously whole. Acceptance gates 2, 3 and 4 cannot be
authored as exact tests, let alone pass.

This is not academic. Pragma already institutionalises the consequence:
`packages/styles/typography/src/mapper.css` computes
`round(up, font-size × ratio, --baseline-height)`, and 20.0004px rounds *up* a
whole unit — to 24px at an 8px baseline and, less obviously, to 24px at a 4px
baseline too, because 20.0004 > 20. `42 × 1.1429 = 48.0018` rounds to 52px at a
4px baseline. The imprecision is currently producing wrong geometry, not just
failing a test.

**Correction.** Add a tenth item to §9 (plumbing, PR 1): decide and land the
exact line-height representation, and state the validator's numeric rule as
exact rational comparison with no epsilon. The two exact options are already
available: author line height as a dimension (`typography.text.secondary`
binding `{dimension.250}` = 1.25rem = 20px — the primitive already exists), or
author a baseline count under a Canonical extension and let the builder emit
the length. Once representation is exact in PR 1, the PR-2 gate can be blocking
as the owner intends. Keeping the representation in §12 forces a report-only
phase the owner has rejected; moving it to PR 1 avoids that.

### S2 — The 84px/96px display correction has the same unsolved dependency but is declared resolved

**Severity: blocking (factual). Smallest fix: name the Canonical edit.**

Spec §10 PR 2 states the *"84px/96px display correction"* is resolved and needs
no report-only phase; gate 4 requires it to resolve to exactly 96px and 12
baselines.

Verified source:
`design-tokens/…/semantic/modifier/typography/sites.tokens.json` binds
`typography.heading.display.$root` to `{dimension.size.fontSize.950}` (5.25rem
= 84px) and `{number.lineHeight.950}` (1.0952 → 91.9968px), with `bold`
inheriting both by `$ref`.

96 / 84 = 8/7, which is non-terminating. **No decimal ratio at any finite
precision resolves to exactly 96px**, so under the spec's own resolved-value
rule gate 4 is unsatisfiable by editing the ratio. The nearest existing
primitive, `number.lineHeight.700` = 1.1429, yields 96.0036px (12.00045
baselines) — worse than the status quo in kind, because it fails while looking
correct.

Nor can it be re-pointed to an existing dimension: the `dimension.*` ladder
stops at `1100` = 5.5rem (88px). There is no 6rem primitive.

So the display role is in exactly the same representation-dependent state as
the 14px/20px role that §12 records as open, while §10 declares it resolved.
That is an internal contradiction.

**Correction.** State the edit. Recommended: add primitive `dimension.1200` =
`6rem` (96px), continuing the existing ladder, and bind
`typography.heading.display.$root.lineHeight` to it in `sites.tokens.json`;
`bold` inherits unchanged through its existing `$ref`. Leave
`number.lineHeight.950` untouched and unreferenced (or delete it if the
repository forbids orphan primitives) — do not mutate it in place, because its
`$description` and scale position both encode "92px" and mutation would leave a
primitive whose key no longer describes its value. Blast radius is enumerated
in Q7 below and is two tokens.

### S3 — PR 3 cannot be both format-only and consume the §4 value matrix

**Severity: blocking (sequencing). Smallest fix: one sentence in §10.**

Spec §10 PR 3: *"Make BF consume the resolved DTCG contract while preserving
computed geometry … This is a format-only step; do not mix it with new BF
values."* Gate 9: *"BF format adoption changes no computed geometry."*

Verified source: BF has one flat theme,
`baseline-foundry/config/foundation-theme.json`, applied to all four tiers —
`inlineInsetFieldRem: 0.5`, `inlineInsetActionRem: 1`,
`inlineInsetContinuationRem: 2`, `panelPaddingInlineBaselineUnits: 2`. Tier
configs (`config/tiers/*.json`) carry typography only; nothing overrides the
component block. So BF today resolves action inset to 1rem in every tier,
continuation to 2rem in every tier, and surface inline inset to 1rem in
Editorial and 0.5rem in Documentation/App/OS (2 × the tier `baselineUnit`).

Against the §4 matrix, six of the twenty cells differ from BF's current output
(action Docs/App/OS, continuation Docs/App/OS is 1.5/1.5/1.25 against a flat
2rem, surface inline Docs/App). If PR 3 consumes the values PR 2 publishes, BF
geometry changes and gate 9 fails; if it does not, PR 3 is not really consuming
the contract.

**Correction.** State which values PR 2 publishes. Either PR 2 publishes BF's
*current* resolved values and PR 4 changes them alongside 020a, or PR 3 keeps
BF-local overrides bound to the new names until PR 4 applies the gradient. One
sentence resolves it.

Related factual error in the same section: the §4 heading **"Proven BF inline
values"** is wrong. `AGENT-INBOX.md` records that *"Spec 019's action-inset
implementation remains pending"*, and the flat theme above confirms it. The
Documentation/App/OS columns are owner-approved targets, not proven BF output.
The follow-on sentence — *"A migration may change values only where an approved
BF package already supplies the target"* — is therefore also unsafe as written,
because the approved BF package (020a, absorbing 019) has not been implemented.

### S4 — Canonical would publish two contradictory baseline tokens

**Severity: blocking (schema). Smallest fix: one line in §10 PR 2.**

`design-tokens/…/global/semantic/dimension/small.tokens.json` already declares
`dimension.size.height.baseline` = `{dimension.100}` = 8px, scoped to the
**breakpoint** modifier's `small` context. Pragma has explicitly abandoned it:
`packages/styles/main/src/spacing.css` says the token *"is left at 8px and
intentionally no longer consumed"* and declares `--space-baseline: 0.25rem`
instead.

The spec introduces `spacing.baseline` on the **product** axis and never
disposes of the existing token. After PR 2, Canonical would publish two baseline
tokens, on two different resolver axes, with two different values and no stated
precedence. §9 item 2 only guards *output-name* collisions, and these two do not
collide by name, so nothing catches it.

**Correction.** Add to §10 PR 2: retire `dimension.size.height.baseline`, or
re-point it to `spacing.baseline` under a bounded compatibility alias, and
assert that no baseline value remains on the breakpoint axis.

## 3. Answers to the required questions

**Q1 — Is the v1 spacing schema internally sound and contribution-ready after
the plumbing PR?** Yes, subject to S1 and S4. All nine §9 plumbing items are
real and verified: `packages/plugin/src/naming.ts` only replaces `.` with `-`
so camelCase segments survive (`--dimension-size-fontSize-300`) and
`terrazzo.config.ts` actively enforces `consistent-naming: camelCase`;
`build/classification.ts` classifies by `dimension.` / `number.` / `color.` /
`typography.` prefix and has no case for a `spacing.` namespace;
`build/builders/buildModifierFamily.ts` hardcodes `type: "color"`;
`mapper.css` documents that number tokens *"[are not emitted] in
sets.primitive.css. Hardcoded here"*; `canonical.resolver.json` names the axis
`typography`; and `build/builders/buildTypography.ts` iterates
`["app", "docs", "site"]` with no `os`. The twelve-token vocabulary is
well-formed and the naming is ownership-based rather than magnitude-based.

**Q2 — Does any token still encode typography, control height, density policy,
or page/grid policy under a `spacing.*` name?** No. I checked each of the twelve
against BF source. The block-axis tokens that are baseline-derived in BF today
(`fieldGapBaselineUnits`, `panelPaddingBlockBaselineUnits`,
`sectionSpace*`, `stripSpace*`) are all vertical, which the spec permits. The
inline tokens are authored rem literals. Page margin, grid gutter and content
padding are correctly excluded from v1. One nuance worth recording rather than
correcting: BF derives `panelPaddingInline` from baseline units today, so gate 7
("no horizontal spacing output depends on baseline") is satisfied by the *token*
but not yet by BF's *source*; that is 020a work, and it is the same fact as S3.

**Q3 — Is the Site lattice enforceable as a blocking PR-2 gate?** Not as
currently specified — see S1 and S2. It becomes enforceable, and blocking,
once exact line-height representation lands in PR 1. The manifest question
itself is settled: after the display correction, the *only* half-step Site
family is `typography.text.secondary`, verified by resolving every Site role
(`global.tokens.json` + `sites.tokens.json`) against an 8px baseline. Its
transitive dependents are five, not two — `$root`, `bold`, `code`,
`prose.$root`, `prose.bold` — and §3 names only "bold and code" (see §5).

**Q4 — Is the half-phase behavior described honestly?** Yes, and it is
arithmetically correct. Verified against BF source: `src/css.ts` defines
`baselineCompensation(nudgeTop, baselineUnit) = baselineUnit − nudgeTop`, so
nudge plus compensation is exactly one baseline by construction. A single 20px
line therefore occupies 20 + 8 = 28px = 3.5 Site baselines and exits on the 4px
half-phase, exactly as §3 states; whole-count roles occupy `H + B` and stay on
the primary phase. Successive lines advance 2.5 baselines, so multiline
alternates. The refusal of a generic `mod()` wrapper is correct: CSS cannot read
an unconstrained intrinsic `auto` height into a modulo, and Pragma's
`round(up, …)` mapper is the concrete demonstration of what happens when a
runtime repair is attempted. No false phase-restoration claim is made anywhere.

**Q5 — Does the `1cap` parity contract state exactly what can be equal and what
can only be bounded?** Yes, and the governing spec is *better* here than the
resolution review it supersedes. That review asked for first-baseline offset
equality "exactly"; that is impossible, because the anchors differ by 0.0065em
by construction. The spec correctly bounds both the first-baseline offset and
the painted block, and claims exactness only for the occupied block, inline
inset, border accounting, compensation algorithm and nested-host fit. I find no
remaining false equality claim. Two bounded-claim refinements are in §4.

**Q6 — Is the 0.25px envelope supported by source arithmetic, and is the test
matrix sufficient?** The arithmetic is exactly right (§4). The envelope is
defensible as *provisional* but its headroom is thin: the predicted maximum is
0.234px against a 0.25px gate, leaving 0.016px — roughly one Blink/WebKit
layout unit (1/64px = 0.015625px). It is therefore only meaningful if the
measurement basis is specified. The matrix is not yet sufficient; three
additions are required, all in §4: an explicit ≤1rem precondition for the
envelope, an exact-multiple tie-break fixture, and a pre-agreed remedy for the
modulo crossings that are statistically likely across a full state matrix.

**Q7 — What does the display change require, and who is affected?**
A scoped semantic edit in `sites.tokens.json` plus one new primitive. Verified
blast radius of `number.lineHeight.950`, by exhaustive search of all four
repositories: **two consumers, both in one file** —
`typography.heading.display.$root` (direct alias) and
`typography.heading.display.bold` (via `$ref` to `$root/$value/lineHeight`) in
`sites.tokens.json`. It appears in no other Canonical file, in no Pragma CSS
(`mapper.css` re-declares only ratios 250, 300, 350, 400, 500, 600, 700, and
Pragma has no display element mapping), and in no BF config. The only other
repository-wide matches are Pragma's regenerated ontology packs
(`packages/cli/pragma/src/kernel/runtime/graphpack/embedded/pack.generated.ts`
and `pack.index.generated.ts`), which are build artifacts, not styling
consumers. Because `dimension.*` stops at 1100 = 5.5rem, the exact 96px value
needs a new `dimension.1200` = 6rem; by contrast the 14px/20px role needs no new
primitive, since `dimension.250` = 1.25rem = 20px already exists. A global
primitive mutation is *safe* by blast radius but is not correct: it would leave
key 950 describing 92px while resolving to 96px.

**Q8 — Is the PR order executable?** Yes, with S1 and S3 applied. PR 1 is a
genuine prerequisite and every item in it is verified above. PR 2 has no schema
dependency beyond PR 1 — the product axis, the move of the baseline off the
breakpoint axis, and a spacing builder — plus, after S1, exact line-height
representation. The optional split of density immediately after PR 2 is
coherent: density owns no cell, height or line height under this spec, so it
has no dependency on the twelve tokens beyond `spacing.baseline`. PR 3 is
geometry-neutral for the baseline itself — BF's `config/tiers/editorial.json`
already declares `baselineUnit: 0.5` and the other three declare `0.25`, which
matches the §2 matrix exactly — so the only PR-3 hazard is the inline-value
question in S3. PR 4 correctly sequences BF 020a values before Pragma adoption.

**Q9 — Are the Pragma migration removals all represented?** Substantially yes;
each item I checked exists in source. Confirmed present and correctly targeted:
`--density-target-baseline-px` (`packages/styles/main/src/modifiers.density.css`,
plus three consumers in `packages/react/ds-global-form`);
`--spaceAfter-button` (`packages/styles/main/src/spacing.css`);
the `round()` snapping path (`packages/styles/typography/src/mapper.css`);
`--computed-line-height` in both `baseline-cap.css` and `baseline-metrics.css`;
baseline-derived inline padding (`--density-pad-inline-dense:
calc(var(--baseline-height) * 2)`); and the 4px `--baseline-height` fallback
owners (`baseline-shim.css` `@property` initial-value, `spacing.css`, the
DensityTestbed, and the docs examples — four in shipped or consumed code, so the
count is fair). Two gaps: (a) the missing OS context is listed for Canonical
typography (§9 item 9) but *not* for Pragma — `modifiers.density.css` scopes
contexts to `.app`, `.site` and `.docs` only, so PR 4 must add `.os` there too;
(b) the fixed-size side-navigation debt is larger than one component —
`SideNavigation/common/Item/styles.css` and `.../Header/styles.css` both declare
`block-size: calc(var(--space-baseline) * 5)` commented "40px — 5bU" while
resolving to 20px, and `.../NavTree/styles.css` declares `* 4` commented "32px"
while resolving to 16px. Three live defects, not one.

**Q10 — Is anything still a schema blocker?** Yes: S1, S2, S3 and S4 above, all
of which are spec-text or named-source-edit fixes rather than design changes.
Everything else I found is either Pragma migration debt (Q9) or empirical
acceptance evidence (§4, §5). In particular the cap-versus-metric tolerance is
correctly classified by the spec as evidence, not schema — I agree with that
classification and confirm the schema does not depend on its outcome.

## 4. Metric and cap calculation audit

### Inputs — verified, not assumed

Extracted directly from `baseline-foundry/assets/fonts/UbuntuSans[wdth,wght].ttf`
with `fontkit`, at the default instance and at `wght` ∈ {100, 400, 700, 800} ×
`wdth` ∈ {75, 100}:

```text
unitsPerEm = 1000   hhea.ascender = 940   hhea.descender = -260
hhea.lineGap = 0    OS/2 sCapHeight = 693  OS/2 sxHeight = 518
```

All values are invariant across every sampled axis instance. The spec's claim of
axis invariance is confirmed.

### Formulae — reduced from implementation, not from the spec

BF, `baseline-nudge-generator/src/nudge-generator.js` `calculateNudgeRem`:

```text
content   = A + G + |D|
leading   = LH - content
offset    = leading/2 + A + G/2
          = LH/2 + (A - |D|)/2                      ← G cancels exactly
          = LH/2 + 340 units
```

Pragma classic engine, `packages/styles/typography/src/baseline-metrics.css`:

```text
offset = (LH - (A - D)·fs/upem)/2 + A·fs/upem
       = LH/2 + fs·(A + D)/(2·upem)
       = LH/2 + 340 units                            ← identical to BF
```

Pragma cap engine, `packages/styles/typography/src/baseline-cap.css`:

```text
--baseline-position: calc((--computed-line-height + 1cap) / 2)
       = LH/2 + cap/2 = LH/2 + 346.5 units
```

**Delta = 6.5 units = 0.0065em.** The spec's anchors, its delta, and its
per-size table (0.078 / 0.091 / 0.104px anchor; 0.156 / 0.182 / 0.208px
symmetric painted; 0.234px maximum at an 18px root) all reproduce exactly.
The doubling is correct under the §5 ledger, since `padding = max(nudge −
border, 0)` appears on both block edges.

### Corrected and added bounds

**(a) The 2× painted factor is an upper bound, not an identity.** When
`nudge ≤ border` the zero clamp engages and the painted delta shrinks toward
zero. Fixtures must measure the painted block rather than infer it from the
anchor delta. Non-blocking; state it.

**(b) The envelope is valid only while every shared control role is ≤ 1rem.**
This is the most consequential omission. BF's generator subtracts a drift term
that Pragma has no analogue for:

```text
compensation = (1/16 ÷ fs_rem) × max(0, fs_rem − 1)   rem
```

It is exactly zero for `fs_rem ≤ 1`, and every shared body-sized control role
qualifies (12 / 14 / 16px = 0.75 / 0.875 / 1rem authored, unchanged at an 18px
root). So the 0.156–0.234px envelope holds — but only for that reason. At
1.5rem the BF-versus-Pragma nudge divergence becomes ≈0.333px and at 2.625rem
≈0.619px, both far outside the envelope and for reasons wholly unrelated to
cap-versus-metric. §5's *"must still be exercised"* is too weak. Make it a
precondition and a static assertion: no shared control role exceeds 1rem, and
any role above 1rem is out of envelope scope by construction.

**(c) The two engines use different tie-breaks at an exact multiple.** BF
computes `ceil(offset/B)·B − offset`, which yields **0** when
`offset ≡ 0 (mod B)`. Pragma computes `B − mod(offset, B)`, which yields **B**.
Occupied totals still agree — BF's compensation is `B − nudge` and Pragma's
`--end-nudge` is `B − --start-nudge`, so both give `LH + B` — but the
first-baseline position inside the box differs by a **full baseline**. This is
not a "modulo-boundary crossing"; it is an exact hit, and it is independent of
which alignment engine is used. Gate 10 measures first-baseline position, so it
will report a whole-baseline failure with no cap-versus-metric cause. The
fixture matrix must include a role whose offset lands exactly on a multiple, and
the two implementations must agree the tie-break (BF's `nudge = 0` is correct;
Pragma's full-baseline nudge is not).

**(d) A modulo crossing is likely, not exceptional.** The per-role probability
that a 6.5-unit anchor delta pushes the ceiling across a lattice line is
approximately δ/B — about 1.3% at the 8px Site baseline and 2.6% at 4px. Across
a realistic shared-control matrix (tens of states × four products) at least one
crossing is more likely than not. The spec treats crossing as a binary
acceptance condition with no stated remedy, which risks converting a routine
result into an unplanned redesign. Name the remedy in advance: a declared
per-role Pragma deviation, or reconciliation of that role's authored line
height. Do not weaken the envelope in response.

**(e) 0.25px is defensible, but only as a layout-unit gate.** Keep the number
and keep the rejection of a one-baseline bound — both are correct. But 0.234px
against 0.25px is roughly one layout unit of headroom (Blink and WebKit
`LayoutUnit` = 1/64px = 0.015625px; Gecko app units = 1/60px). Specify that the
measurement is taken from layout values — `getBoundingClientRect` and a
first-baseline probe — and explicitly **not** from rasterised screenshots or
device pixels, where DPR quantisation alone exceeds the gate. Confirm across
Chromium, Firefox and WebKit at 16px and 18px roots, at 100% / 125% / 150% zoom,
and at 1× and 2× DPR. This is a measurement-basis clarification, not a change of
threshold.

**(f) `cap` resolution is safe here, with one fixture obligation.** CSS `cap`
resolves from OS/2 `sCapHeight`, which Ubuntu Sans supplies (693), so browsers
should not need to synthesize it and the axis invariance above means variable
instancing does not move it. But `1cap` is resolved against the *used* font: if
the webfont fails or is delayed, Pragma's nudge silently changes while BF's
generated constant does not. Parity fixtures must gate on font load.

## 5. Exact wording corrections

Minimal edits. Numbering is the governing spec's.

1. **§3, secondary-text exception.** Replace *"Its bold and code variants
   inherit the exception by reference"* with *"Its `bold`, `code`,
   `prose.$root` and `prose.bold` variants inherit the exception by
   reference"*. Verified: five tokens in the family, not three.

2. **§3, display correction.** After *"changes from a 92px line height to
   96px"*, add: *"96px is not expressible as a decimal ratio of 84px (8/7 does
   not terminate). The correction adds primitive `dimension.1200` = 6rem and
   binds `typography.heading.display.$root.lineHeight` to it in
   `sites.tokens.json`; `bold` inherits through its existing `$ref`.
   `number.lineHeight.950` is left unreferenced rather than mutated."*

3. **§4, heading.** Rename *"Proven BF inline values"* to *"Approved BF inline
   target matrix"*, and replace *"A migration may change values only where an
   approved BF package already supplies the target"* with *"A migration may
   change values only where an owner-approved BF package specifies the target.
   Only the Site column matches BF's current flat `config/foundation-theme.json`
   output; the Documentation, App and OS columns are delivered by 020a and are
   not yet implemented."*

4. **§5, envelope precondition.** After the delta table, add: *"These figures
   hold only because every shared control role is authored at 1rem or below,
   where BF's generator drift compensation is exactly zero. Any shared role
   above 1rem is outside this envelope by construction — the divergence is
   ≈0.33px at 1.5rem and ≈0.62px at 2.625rem — and must be asserted absent."*

5. **§5, tie-break and measurement.** Add: *"BF resolves the nudge with a
   ceiling and Pragma with `mod()`. They differ by a full baseline when the
   baseline position is an exact multiple. Both must adopt BF's tie-break
   (`nudge = 0`), and the fixture matrix must include that case. The 0.25 CSS px
   envelope is measured on layout values, not rasterised pixels."*

6. **§10 PR 2.** Add: *"PR 2 also retires `dimension.size.height.baseline`, or
   aliases it to `spacing.baseline`, so no baseline value remains on the
   breakpoint axis."* And state which value set PR 2 publishes, per S3.

7. **§10 PR 4.** Add `.os` to Pragma's density context family in
   `modifiers.density.css` alongside the existing Canonical typography item.

8. **§9.** Add item 10: *"Decide and land the exact line-height representation
   — a dimension-valued line height or an authored baseline count with a
   builder-derived length — so that the PR-2 lattice validator can compare
   resolved values exactly, with no tolerance."*

9. **§12.** Remove *"the exact DTCG representation that resolves the 14px/20px
   role"* from remaining evidence; it moves to §9 item 10 and PR 1.

## 6. Blockers versus implementation evidence

**Schema blockers (fix in the spec before planning):** S1, S2, S3, S4.

**Implementation evidence (do not block acceptance):** the durable
cap-versus-metric tolerance and its cross-browser matrix; the exact density
manifest identifiers; the empirical result of corrections 4(b)–4(f).

**Pragma migration debt (non-normative, do not let it constrain the schema):**
the twelve removals in §10 PR 4; the three fixed-size side-navigation defects
(`Item`, `Header`, `NavTree`), which today render at half their documented
height because `--space-baseline` moved from 8px to 4px without re-derivation;
the missing `.os` density context; and `mapper.css`'s `round(up, …)` path, which
is currently overshooting a whole baseline unit on 14px and 42px roles because
of the 4-decimal ratios.

## 7. Branch and implementation handoff

**Implementation planning may begin, once S1–S4 are applied to the governing
spec.** The corrections are small and none blocks planning of PR 1, which is
independently well-specified and fully verified.

**Implementation must not occur on `feat/019-tier-responsive-action-insets`.**
Five independent reasons, each source-backed:

1. The governing spec §7 states 020a absorbs Spec 019. Doing 020a work on the
   019 branch contradicts the document authorising the work.
2. `AGENTS.md` requires one active package under `specs/<id>-<slug>/` with a
   matching `feat/<id>-<slug>` branch. 020a work on a 019 branch violates that
   invariant directly.
3. `AGENT-INBOX.md` records that the supersession decision is Spec 020 T001 and
   is **not yet recorded**, and instructs that neither 020 nor 021
   implementation may start until it is. It also forbids editing Spec 020 while
   the checkout is on the Spec 019 branch.
4. The correct base does not yet exist on the remote. The approved git sequence
   steps 3–5 — commit the reviewed architecture fixes on `main`, run `npm test`
   and `npm run qa:components`, push `main` — are outstanding, and the inbox
   notes that five commits of significant architectural work exist on one
   machine only.
5. `fix/tab-list-presentation-semantics` is pushed and awaits merge into `main`
   after the 019 worktree is reconciled.

**Recommended order.** Complete the approved git sequence steps 1–7; merge the
accessibility branch; record the Spec 020 T001 supersession decision; then
branch `feat/020a-<slug>` from the pushed `main`.

**Scope note for the handoff.** Most of this architecture is not BF-branch work
at all. PR 1 and PR 2 are `design-tokens` pull requests. PR 3 and the BF half of
PR 4 belong on the new 020a branch. The Pragma half of PR 4 is a Pragma pull
request. Only 020b touches
[`src/css-grid.ts`](../src/css-grid.ts), whose duplicate runtime ownership of
`--bf-page-margin` and `--bf-grid-gap-inline` — verified at lines 22–49 against
the same properties emitted from `config/foundation-theme.json` via
`src/css.ts` — must be removed first, exactly as §7 requires.

No merge, commit, branch, push, publication, release, or implementation change
was made in producing this review.

---

## 8. Independent verification pass

Date: 2026-09-03, immediately following. A second reviewer re-derived the
load-bearing numbers from source without relying on §0–§7, to test whether the
sign-off holds. It does. This section records only confirmations and deltas; it
does not restate the review.

### 8.1 Confirmed

- **Font metrics.** `unitsPerEm` 1000, `hhea.ascent` 940, `hhea.descent` −260,
  `hhea.lineGap` 0, `OS/2.sCapHeight` 693, `OS/2.sxHeight` 518. Identical at
  `wght 100 / wdth 100` and `wght 800 / wdth 75`.
- **BF anchor.** `leading/2 + A + G/2` reduces to `LH/2 + (A − |D|)/2` =
  `LH/2 + 340` units. The `lineGap` terms cancel algebraically, so the anchor is
  correct for any lineGap, not only for this font's zero.
- **Cap anchor.** `(LH + 1cap)/2` = `LH/2 + 346.5` units.
- **Delta 6.5 units = 0.0065em**, and the whole per-size table: 0.078 / 0.091 /
  0.104px anchor, 0.156 / 0.182 / 0.208px symmetric painted, 0.234px at an 18px
  root. Every figure reproduces to the digit.
- **Drift compensation** `(1/16 ÷ fs) × max(0, fs − 1)` rem is zero at and below
  1rem, 0.333px at 1.5rem, 0.619px at 2.625rem. Correction 4(b) stands.
- **Tie-break divergence** at an exact multiple — BF `ceil` yields 0, Pragma
  `B − mod` yields `B`. Correction 4(c) stands.
- **Crossing probability** ≈ δ/B: 1.3% at 8px, 2.6% at 4px. Correction 4(d)
  stands.
- **S1's arithmetic.** 8/7 and 10/7 are non-terminating, so no finite ratio
  reaches 96px or 20px exactly. `84 × 1.1429 = 96.0036px`.
- **S2's ladder claim.** The `dimension.*` ladder ends at `1100` = 5.5rem;
  there is no 6rem primitive. Confirmed by reading the full primitive document.
- **S2's blast radius.** `number.lineHeight.950` and
  `dimension.size.fontSize.950` each have exactly one consumer,
  `sites.tokens.json:10` and `:12`. An exhaustive search of the canonical token
  tree finds no other reference.
- **S3's premise.** `config/foundation-theme.json` holds the component block
  flat across tiers; the tier files carry typography only.
- **S4's premise.** `dimension.size.height.baseline` is declared under the
  breakpoint axis in `global/semantic/dimension/small.tokens.json` and is
  abandoned but not removed.

### 8.2 Three additions

**V1 — `USE_TYPO_METRICS` is set, and nothing asserts it.**
`OS/2.fsSelection` bit 7 is set on Ubuntu Sans. That is *why* the generator and
the browser agree: browsers are directed to the typo metrics (940 / −260)
rather than the win metrics, which in this font are **`usWinAscent` 1020 /
`usWinDescent` 223**. Without the bit the browser's content area would be 1243
units against the generator's 1200 — a 43/1000 em divergence, or **0.69px at
16px**, roughly three times the entire 0.25px envelope and unrelated to
cap-versus-metric. No code in BF or the generator asserts the bit. Add a
generator assertion, or read the win metrics when it is absent. Watchlist, not
blocking, because the shipped face sets it.

**V2 — axis invariance is structural, not sampled.**
The font carries **no `MVAR` table** (directory tags: GDEF, GPOS, GSUB, HVAR,
OS/2, STAT, avar, cmap, fvar, gasp, glyf, gvar, head, hhea, hmtx, loca, maxp,
name, post, prep). No metric can vary along any axis, so the invariance is
guaranteed rather than observed at sampled instances. §4's wording and §5 of
the governing spec can both be strengthened from "across the sampled width and
weight axes" to "structurally, the font has no `MVAR` table". The
corresponding guard is the same assertion as V1: a future face with `MVAR`
requires per-instance extraction, because BF assigns per-role weights of
300–550 (`generated/baseline/*.baseline.json`) while metrics are read once.

**V3 — the end nudge lives in a different box in each engine, for text roles.**
Correction 4(c) establishes that occupied totals agree. They do — but the
*painted border box* does not, for text roles, and for a structural reason
rather than a subpixel one:

| Engine | Start | End | Painted box |
| --- | --- | --- | --- |
| BF text roles | `padding-block-start: nudge` | `margin-bottom: B − nudge`, `padding-block-end: 0rem` | `LH + nudge` |
| Pragma cap engine | `padding-block-start: --start-nudge` | `padding-block-end: --end-nudge` | `LH + B` |

Sources: [scripts/validate-build.ts](../scripts/validate-build.ts#L661)
("Expected generated text roles to keep end compensation in margin rather than
padding") and `pragma/packages/styles/typography/src/baseline-cap.css:92-94`.

The painted difference is therefore up to a **whole end nudge**, not 0.2px. The
0.25px envelope belongs strictly to controls under the §5 ledger, where padding
is symmetric on both edges. §5 of the governing spec reads as though the
envelope covers everything shared. Add one clause scoping it to the control
ledger, and add the box relocation to the §10 PR 4 removal list — it is a
required change if Pragma is to reproduce BF's ledger, and it is currently
unlisted among the twelve.

### 8.3 Effect on the verdict

None. S1–S4 stand as the blocking set, V1–V3 are watchlist and wording items,
and the recommendation is unchanged: apply S1–S4 to the governing spec, then
implementation planning may begin, with PR 1 and PR 2 as `design-tokens` work
off that repository's clean `main`, and no implementation on
`feat/019-tier-responsive-action-insets`.
