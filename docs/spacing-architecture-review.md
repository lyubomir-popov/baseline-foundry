# Adversarial review: component spacing architecture

Reviewed on 2026-09-01 against `feat/019-tier-responsive-action-insets` at
`b7414be`. Scope: the four unpushed commits `d558cb7`, `c698f56`, `a7d07d5`,
`a4faab2`, the Spec 019 draft, and the surrounding repository state.

This is an independent second opinion, not a closeout record. Findings are
ordered by how much they would cost to fix later.

## Verified state

`npm test` passes end to end at `b7414be`: 7,086 build checks, zero
component-baseline failures, zero behavior failures across all four tiers. The
last-known-green claim in `AGENT-INBOX.md` is accurate.

Git history is clean. Nine remote branches all resolve as ancestors of local
`main`; nothing is stranded. History is linear with no merge commits, and every
commit message describes one intent.

Two housekeeping notes rather than findings. Local `main` is four commits ahead
of `origin/main`, so the entire spacing refactor exists on one machine only –
the last pushed state is still 0.1.7. And six merged remote branches plus three
stale local branches (`fix/table-row-control-fit` duplicates `main`,
`feat/018-nested-density-audit` is behind it) are noise in `git branch -a`.

`npm_recovery_codes.txt` is untracked and matched by `.gitignore:11`. No
credential is in history. It should still live outside the working tree.

## What I agree with

These are the decisions I would defend if someone challenged them.

**Deriving the occupied block from real metrics instead of an authored target
height.** Removing `--bf-control-box-size` and the whole compact scale is the
single change that makes four tiers viable without per-tier repair rules. The
old model needed a hand-picked height per density; the new one needs one
formula and four sets of font facts.

**`is-nested` as an explicit, positively allowlisted composition contract.**
This is the best decision in the batch, and it is enforced structurally rather
than by documentation. `nestedFieldSelector` in
[nested-controls.ts](src/css-components/nested-controls.ts#L7-L11) enumerates
the permitted input types, and `.bf-button.is-nested:not(.is-link)` excludes
link buttons in the selector itself. A `type="date"` input genuinely cannot
acquire nested geometry by adding the class. Compare this with the
`:has(.bf-status-label)` inference it replaced, which `validate-build.ts` now
explicitly forbids.

**Semantic build-time guards, not just type guards.**
[build.ts](src/build.ts#L326-L343) rejects a tier whose nested framed control
cannot fit its body line, and one whose continuation inset cannot contain a
leading mark plus gap. This is rare and valuable: the architecture's geometric
invariants are executable at configuration time, so a bad custom tier fails at
build rather than rendering wrong. No `as any`, no non-null assertions, no
silent `??` fallbacks were introduced.

**One height family with two ownership modes.** Treating margin compensation
and in-box compensation as ownership variants of the same occupied block –
rather than two density buckets – is the right abstraction, and
[table.ts](src/css-components/table.ts#L11-L15) consumes it with exactly one
legitimate local addition (the real separator subtraction).

**App-tier CSS really is chrome only.** I checked every selector in
[css-app-tier.ts](src/css-app-tier.ts); none targets a leaf component. The
claim in the architecture document holds.

## High-level architecture findings

### A1 – The accepted contract lives in a file named "proposal", and is
### duplicated in the file that is supposed to own it

`AGENTS.md` names `docs/architecture.md` the single owner of durable
architecture decisions. In practice there are now two owners.
[component-spacing-architecture.md](component-spacing-architecture.md#L1-L3)
opens with "Status: accepted implementation contract" and carries the
authoritative tables, while
[architecture.md](architecture.md#L93-L99) paraphrases the same rules in
prose – including the nested allowlist enumerated a second time, verbatim.

Two copies of one contract, one of them in a misnamed file, will drift. Rename
to `docs/component-spacing-architecture.md`, and reduce the `architecture.md`
section to a pointer plus the one-sentence principle. The only reference to the
old filename is a single link, so the rename is cheap now and gets more
expensive with every release that cites it.

### A2 – Spec 019 makes the vertical baseline the quantum for horizontal insets

The architecture document's opening claim is that tiers, inline insets and
block density "are different axes and must not share terminology". Spec 019
then proposes expressing every inline inset as a whole count of the tier's
*vertical* baseline unit.

I would push back on this, for three reasons.

First, it creates a coupling that has no design justification: a future change
to vertical rhythm silently rescales every horizontal inset in that tier. That
is precisely the class of hidden dependency the rest of this architecture works
hard to remove.

Second, it restricts expressiveness in the wrong tier. Editorial's 0.5rem
baseline means Editorial can only express inline insets in 0.5rem steps, so
0.75rem becomes inexpressible in the tier with the widest measure – while
Documentation, App and OS get 0.25rem resolution.

Third, the unit numbers are not comparable across tiers and therefore do not
communicate the relationship the spec says they communicate. In
[the matrix](specs/019-tier-responsive-action-insets/contracts/action-inset-matrix.md#L5-L11),
Documentation field is 2 units and App field is 1 unit, yet App is denser
elsewhere and both render differently. Two tiers with the same 0.25rem baseline
disagree on unit count for reasons that are not visible in the number. A reader
of the config learns the divisor, not the intent.

If the goal is "state the design relationship in configuration rather than a
raw value", the honest quantum for a horizontal inset is the body line or an
explicit inline unit, not the baseline. A minimal counter-proposal: keep rem
inputs, add a named `inlineUnitRem` per tier that happens to equal the baseline
today, and validate that each inset is a whole multiple of it. That buys the
stated benefit without welding the two axes together.

### A3 – Spec 019's rationale is documented but not encoded

[plan.md](specs/019-tier-responsive-action-insets/plan.md#L28-L34) states the
action inset is "approximately half a normal single-line occupied block and
quantized to a whole baseline", then immediately says "the exact matrix is the
contract". So the derivation is applied by hand and the results are copied into
config. If a tier's body line or start nudge changes, the action inset will not
follow and no test will fail.

Pick one. Either encode the heuristic and assert the matrix as its expected
output, or delete the heuristic from the plan so nobody maintains a rule that
is not live. Documented-but-unenforced derivations are how the old
`--bf-control-box-size-compact` family accumulated in the first place.

### A4 – Two consecutive breaking changes to the configuration input schema

`a4faab2` renamed the inset inputs to `inlineInsetFieldRem`,
`inlineInsetActionRem` and `inlineInsetContinuationRem`. Spec 019 renames them
again to unit counts. `config/` is listed in `package.json` `files`, so a
downstream author of a custom tier JSON breaks twice in two releases.

The package is pre-1.0, so this is permitted, not fatal. But either fold 019
into the same unreleased batch – the four commits are unpushed, so this is
still possible – or state explicitly that the configuration schema is internal
and only the generated token and custom-property names are public. Right now
Spec 019 claims it "preserv[es] the public rem-token API" without acknowledging
that the input schema is a separate, and shipped, surface.

### A5 – `max()` of three unrelated facts is not a designed nested line

[css-component-contracts.ts](src/css-component-contracts.ts#L50) defines:

```css
--bf-nested-row-line-height: max(
  var(--bf-body-font-size),
  calc(var(--bf-interface-row-line-height) - var(--bf-baseline)),
  var(--bf-control-visual-size));
```

Working the four built-in tiers through it: Editorial resolves to a three-way
tie at 1rem, OS to a three-way tie at 0.75rem, App to a two-way tie at 1rem,
Documentation to `body line − baseline` at 1rem. In every shipped tier the
answer is `body line − baseline`, and the other two terms never decide
anything. They only fire for custom configurations – which is exactly where a
"largest of three" rule is least predictable, because it can silently choose a
line that eats the padding to zero.

The framed ledger is protected by the `build.ts` fit guard. The zero-footprint
ledger (chip, status label, badge) has no equivalent guard; it cannot overflow
because it has no borders, but `--bf-nested-row-padding-block` can clamp to 0
and produce a nested chip flush against its host line without any signal.

Recommendation: state the intended nested line as a single expression, and
express the other two facts as validated constraints in `build.ts` rather than
as competing `max()` inputs. That converts a silent resolution into a loud
rejection, which is the pattern the rest of this refactor already follows.

### A6 – `mod()` became load-bearing without the guard the codebase uses elsewhere

`--bf-interface-row-compensation-block-end` uses nested `mod()` with no
`@supports` fallback. If `mod()` is unavailable, the property is invalid at
computed-value time, and every dependent property cascades to invalid:
occupied-block size, in-box padding, the whole `--bf-table-row-*` family,
side-navigation grid tracks, and the slider row. Before this refactor `mod()`
only affected text nudges; now it gates all interface geometry.

The inconsistency matters more than the risk. The codebase guards `round()` and
`calc-size()` behind `@supports` in six places
([content-card.ts](src/css-components/content-card.ts#L43),
[sites-rich-lists.ts](src/css-components/sites-rich-lists.ts#L79) and others)
where the failure mode is a slightly unsnapped image height. It does not guard
the one function whose failure takes out every control. Support is broad enough
in practice; the decision should just be conscious and recorded.

### A7 – The contract and its implementation do not share terminology

The document says "regular block contract" and "marginless hosts". The code
says `--bf-interface-row-*` and `--bf-in-box-row-*`. For a document whose thesis
is that different axes must not share terminology, the contract and its
implementation currently share none. Rename one side; the code names are the
better ones.

## Low-level code findings

### L1 – App is the only built-in tier whose direct bundle skips `validateCommonCss`

[validate-build.ts](scripts/validate-build.ts#L1636-L1640) runs
`validateCommonCss` on the default, editorial, documentation, OS and prose
bundles. `appTier.css` and `appTierPreset.css` are not in that list. That means
the retired-variable assertions and all the new `--bf-interface-row-*`
assertions never execute against `dist/tiers/app/styles.css`.

This is a direct contradiction of the four-tier support-equivalence invariant
in `AGENTS.md`, and it is a two-line fix. Highest value-per-effort item in this
review.

### L2 – Nothing detects a dangling `var()` reference

The retired-variable loop at
[validate-build.ts](scripts/validate-build.ts#L733-L749) only detects
*re-declaration* of a removed name. It cannot detect the failure mode that
actually matters after a rename: a surviving `var(--bf-control-box-size)`
*usage* with no declaration and no fallback, which is invalid at
computed-value time and silently drops the property.

There is no check anywhere in `scripts/` that collects every `var(--bf-…)`
reference in a generated bundle and asserts it is declared. Given that this
refactor removed eleven variable families across 54 files, that is the check I
would most want to exist, and it is cheap – one regex pass per bundle, run over
all eight artifacts. It also subsumes most of what the hand-maintained retired
list is trying to do.

### L3 – Two local re-derivations of the shared visual offset

[control-geometry.ts](src/css-components/control-geometry.ts#L6-L9) exports
`alignedVisualStart()` for exactly this purpose and
[interactive-feedback.ts](src/css-components/interactive-feedback.ts#L137)
open-codes the formula anyway:

```css
inset-block-start: calc(((var(--bf-h6-line-height) - var(--bf-icon-size-default)) / 2) + var(--bf-h6-nudge-start));
```

with a body-role variant on the next rule that additionally subtracts
`--bf-border-width`. Both are legitimate exceptions – an H6 role, an icon size
rather than the control visual size, and a real shell border – but they are
undocumented exceptions expressed as arithmetic. Route them through the helper
with an explicit offset argument, and add the notification block offset to the
classification table, which currently addresses only its inline inset.

### L4 – The highest-entropy expression that survived the refactor

[interactive-feedback.ts](src/css-components/interactive-feedback.ts#L177-L179):

```css
padding-block-end: calc(var(--bf-space-1) - var(--bf-border-width) + var(--bf-baseline) - var(--bf-h6-nudge-start) - var(--bf-body-margin-bottom));
```

Five terms, four variables from three different families, guarded by a
four-line comment and a `:has()` selector. It is correct and it is tested, but
it is structurally the same thing the architecture forbids tiers from doing:
repairing an earlier rule's compensation from a downstream selector. Worth a
named intermediate variable at minimum, so the relationship is inspectable
rather than re-derived by whoever reads it next.

### L5 – `--bf-ui-*` naming survives the flat-`bf-*` cleanup

63 declarations across chip, badge, status, tabs and the icon payload still use
a `--bf-ui-` prefix, while `AGENTS.md` bans `ui-*` roles from the public API.
Custom property names are public surface – consumers can read them. Either
migrate to `--bf-chip-*` and friends, or record `--bf-ui-*` as the deliberate
private-internal namespace. Silence is the worst option because it reads as an
oversight.

### L6 – One authored size escaped the "no authored target sizes" sweep

`--bf-ui-tabs-equal-min: 8rem` in
[tabs-choice-breadcrumbs.ts](src/css-components/tabs-choice-breadcrumbs.ts#L92)
is a fixed floor that does not scale with tier density. OS tabs get the same
8rem minimum as Editorial, in a system that just deleted every other authored
target. Small, but it is the kind of exception that justifies the next one.

### L7 – The app-tier preset is light-only and depends on Vanilla variables

[css-app-tier.ts](src/css-app-tier.ts#L1-L8) sets `color-scheme: light`
unconditionally and hardcodes `#0066cc`, `#f7f7f7` and `#ffffff` as fallbacks
for `--vf-*` variables. Scoped to the Vanilla-parity preset, so probably
intentional, but dark-theme review is a stated requirement everywhere else and
this surface structurally cannot satisfy it. Worth one explicit sentence
somewhere so it is a decision rather than a gap.

### L8 – File sizes

`scripts/verify-component-behavior.ts` is 4,035 lines,
`src/css-components.ts` is 1,955, `scripts/validate-build.ts` is 1,756.

The refactor moved a lot of CSS out of `css-components.ts` into modules, which
is the right direction, but it left roughly 450 lines of base form and control
CSS plus twelve inline data-URI SVG icon declarations – the same six icons
emitted once for light and once for dark. That payload has no relationship to
component composition and would be a clean, zero-risk extraction to
`src/css-components/icon-assets.ts`.

### L9 – Two things I checked and found to be fine

The hardcoded specimen counts in
[verify-component-behavior.ts](scripts/verify-component-behavior.ts#L444-L446)
(`=== 29`, `=== 8`, `=== 10`) are strict equality, so adding or removing a
specimen fails loudly. They are guards, not drift risk.

The `is-nested` rejection assertions are comparative rather than declarative,
which looks weak in isolation, but the CSS enforces rejection structurally via
the type allowlist and `:not(.is-link)`. The test is a sanity check on top of a
real mechanism, which is the correct division of labour.

The `< 0.51` tolerance appearing roughly twenty times is the right constant for
a half-device-pixel rasterisation allowance. It should be one named constant
rather than a repeated literal, but the value is not too loose.

## Suggested order

1. L1 – add app tier and app preset to `validateCommonCss`. Two lines.
2. L2 – add a dangling-`var()` check across all generated bundles.
3. A1 – rename the proposal file and demote the `architecture.md` copy to a
   pointer.
4. A2 and A4 – decide the Spec 019 configuration question before T003 starts,
   since it is the first irreversible step.
5. A3, A5, A6 – record the three decisions, whichever way they go.
6. L3 to L8 – opportunistic cleanup.

Items 1 and 2 are worth doing before the four commits are pushed, so the
pushed history contains the coverage rather than a follow-up fixing it.

---

# Re-review: dispositions of A1, A2, A3, A4, A5, L1, L2

Second pass on the uncommitted working tree, same day. I verified each claim
against source and generated output rather than against the summary, and reran
the gates myself.

Gates confirmed independently: `npm test` exits 0 with 8,653 static checks and
zero component-baseline or behavior failures. The new invariants are visible in
the run – `Common CSS (app): 766 checks`, `Common CSS (app preset): 766 checks`,
`BF variable reference detector: 2 checks`, and `Declared BF variables` across
all eight bundles. The +1,567 delta reconciles almost entirely to the two
newly-covered app bundles.

## Accepted

**A2 – resolved, and resolved the right way.** `inlineUnitRem` is exactly the
decoupling that was needed. Every built-in tier takes a 0.25rem inline unit
independent of its vertical baseline, Editorial's counts rescale to 2/4/8, and
every generated rem value is unchanged. The matrix now shows the vertical
baseline as context with the explicit note that it is not the divisor. The
expressiveness objection is answered too: Editorial can now express 0.75rem,
which it could not under the baseline-quantum proposal. Note this is a spec and
configuration-design change only – `src/types.ts` still carries the raw-rem keys,
so the implementation is correctly still ahead in T003.

**A3 – resolved.** The unenforced "half an occupied block" heuristic is gone
from both `plan.md` and `research.md`, replaced by the matrix as the stated tier
contract with a reason for why a runtime ratio was rejected. Nothing is left
that reads as live but is not.

**A4 – resolved, and better than I asked for.** `research.md` now states plainly
that `config/` ships in the package and is therefore a consumer-visible input
surface, and that the raw-rem rename and the inline-unit schema will ship as one
unreleased change from 0.1.7. That closes the double-break concern by folding,
which was the better of the two options.

**A5 – resolved well.** `--bf-nested-row-line-height` is now the single
expression `body line − baseline`, and `build.ts` gained two explicit guards
rejecting a tier whose nested line cannot contain the body font or the control
visual. That is the exact transformation requested: a silent `max()` resolution
became a loud configuration rejection. The `validate-build.ts` assertion also
now asserts the negative (`!css.includes("--bf-nested-row-line-height: max(")`),
so the old formula cannot creep back.

**L1 – resolved.** App and the app-tier preset run the full `validateCommonCss`
contract, and the surrounding loop was tidied into a shared
`generatedCssArtifacts` map that also drives the new checks. No assertion was
weakened to make app pass, which was the thing worth checking.

**L2 – resolved, and stronger than requested.** The implementation walks the
PostCSS AST rather than the raw text, covers at-rule params as well as
declarations, runs on all eight bundles, and ships with a self-test asserting
both the positive and negative case. Building the detector so it can itself be
tested is the right instinct.

Three limits are worth recording so nobody over-trusts it later. It is
scope-blind – a variable declared only under `.is-dark` satisfies a reference in
the light scope, which is a deliberate trade against false positives. It
deliberately ignores references that carry a fallback, so `var(--bf-typo,
1rem)` will never be flagged even though a typo'd BF name is almost always a
bug, since these variables are all generated. And it covers `dist/` only, not
demo CSS or inline `<style>` blocks in demo pages. All three are reasonable
scoping; they just belong in a comment above `findUndeclaredBfVariableReferences`
rather than in this review.

## One regression

### N1 – A1 removed the duplication by deletion, not migration

The rename is correct and the link is updated. But
`docs/component-spacing-architecture.md` is byte-identical to the deleted
`docs/spacing-architecture-proposal.md` apart from the A5 nested-line paragraph,
while `docs/architecture.md` lost roughly seventy lines. So the duplicate copy
was removed and the *non*-duplicate content went with it.

Five substantive passages exist in neither file now:

- Side-navigation list grid tracks: why the link is start-aligned inside the
  shared interface-row track, and why the track absorbs the subpixel remainder
  rather than stretching the link paint under zoom.
- The `bf-color-control` invisible metric strut, and composite sliders using
  their paired numeric field as the occupied-row owner.
- The canonical tagged-navigation derived brand line centre and the 3rem
  brand/header block that follows from it.
- Unboxed text being deliberately *not* expanded to the interface height – the
  distinction that keeps paragraph copy, links, labels and breadcrumbs out of
  the occupied-block family entirely.
- Grouped side navigation's three explicit spacing owners, the fixed 0.5rem
  header-to-list transition, and the four-baseline single-line heading reserve.

Several of these are not commentary. `validate-build.ts` asserts
`--bf-side-navigation-group-gap: 1.5rem`,
`--bf-side-navigation-heading-list-gap: 0.5rem`, and
`min-block-size: calc((var(--bf-baseline) * 4) - var(--bf-body-margin-bottom))`.
`AGENTS.md` names the 2.375rem-by-1.375rem tag and the fixed mark offset as a
product invariant. Those numbers now have executable enforcement and a stated
invariant, but no recorded derivation – which is the condition under which a
future agent "simplifies" one of them and only finds out from a failing
assertion with no explanation attached.

The unboxed-text passage is the one I would restore first. It is the boundary
of the entire occupied-block model, and the classification table does not
express it: the table enumerates what *is* in the family, never what is
deliberately outside it.

Fix: move those five passages into the new contract document. Side navigation
and the colour/slider compositions fit under a "Reviewed compositions" heading
after the classification table; unboxed text belongs immediately after the
regular block contract, since it is that section's negative space. Nothing needs
to return to `architecture.md`.

## Not addressed, as expected

A6 (`mod()` unguarded while `round()` is guarded), A7 (contract and code share
no terminology), and L3 through L8 were outside this batch. A7 is now slightly
cheaper to fix than before, since there is one contract document instead of two.

## Standing

A1 is the only item I would not sign off. A2, A3, A4, A5, L1 and L2 are
resolved, and A5 and L2 are resolved better than the review asked. Restoring the
five passages is a documentation move with no source risk, so it does not need
to block the push – but it should land in the same commit, because the
information was lost by that commit.

---

# Third pass: A1 closed, project health, merge readiness

## A1 closed

All five passages are back in `docs/component-spacing-architecture.md`. Unboxed
text sits immediately after the regular block contract, where it reads as that
section's negative space. Side navigation, the `bf-color-control` metric strut
and composite slider, the tagged-navigation brand line centre, and the grouped
side-navigation spacing owners are under a new "Reviewed compositions" heading
after the classification table. `docs/architecture.md` is a four-line pointer.
`test:build` remains green at 8,653.

Every finding from the original review that was in scope is now resolved. A6,
A7 and L3 through L8 remain open by agreement.

## Project health

The foundation is solid, and unusually so for a design system.

The evidence for that is not the passing gate count on its own – it is what the
gates assert. 8,653 static contracts plus four-tier browser geometry is a lot,
but the more meaningful facts are that configuration errors fail at build with
semantic messages rather than rendering wrong, that a single module owns every
derived spacing value, that retired names are asserted absent, that dangling
variable references are now detected in all eight bundles, and that the two
places where a shortcut would have been easy – ancestry-inferred nested density
and an authored control height – were both refused. A system that says no to
`:has()`-inferred density under schedule pressure is a system whose invariants
are real.

Three structural risks remain, in order of consequence.

**The horizontal axis is where the vertical axis was two releases ago.** Every
authored inline length is quantised by the vertical baseline, several components
use `--bf-space-*` – a baseline multiple – as inline padding and column gaps, the
two largest component insets do not vary by tier at all, and page margin and
grid gutter run backwards, with App receiving more room than Editorial. Spec 019
identified this coupling, rejected it for three values, and left it everywhere
else. Spec 020 is drafted to close it.

**Two large files are load-bearing and still growing.**
`scripts/verify-component-behavior.ts` is 4,035 lines and
`src/css-components.ts` is 1,955. Neither is disorganised, but both are now past
the size where a reviewer can hold them in mind, and both are the files every
package touches. The icon data-URI payload in `css-components.ts` is a
zero-risk extraction whenever someone wants a cheap win.

**Single-machine history.** Five commits of the most significant architectural
work in the project exist only on one machine. This is the only item on the list
that can lose work outright.

Nothing here is a reason to slow down. The first two are backlog; the third is
one command.

## Merge readiness

The working tree currently mixes two concerns:

- Architecture: `src/`, `scripts/`, `docs/architecture.md`,
  `docs/component-spacing-architecture.md`, the deleted proposal, this review.
  This is follow-up to `a4faab2` and belongs on `main`.
- Spec 019 redesign: `specs/019-…/`, plus the `TODO.md` and `AGENT-INBOX.md`
  paragraphs that describe it.

`feat/019-tier-responsive-action-insets` should not be merged as it stands. It
carries an unimplemented draft package, and merging a draft to `main` is against
the repository's own convention that completed packages archive after merge.

But merging it is not what is wanted. The valuable content on that branch is the
architecture work, which belongs on `main` regardless. Proposed sequence, for
owner approval – the push and the branch move both need it:

1. Commit the architecture files on `main` as one commit. The 019 branch base is
   `main`, so nothing needs rebasing to do this.
2. Commit the Spec 019 redesign on `feat/019-…` on top of the new `main`.
3. Push `main`. This is the item that matters; the rest is tidying.
4. Delete the six merged remote branches and the three stale local ones
   (`fix/table-row-control-fit` duplicates `main`, `feat/018-nested-density-audit`
   is behind it, `feat/017-spacing-system-audit` is released).
5. Branch the next package off the pushed `main`.

## Recommended order for the next packages

Spec 020 proposes superseding Spec 019 rather than following it, because both
migrate the same package-visible configuration surface. Shipping them separately
repeats the double-break that A4 flagged and that the Spec 019 research already
resolves by folding. That decision is the owner's and is 020's first task.

Assuming it is accepted:

1. **Spec 021, block-derived inline geometry.** Smallest, answers a live
   stakeholder report, and removes several components from the inset audit that
   020 would otherwise have to account for. Its one real unknown – icon-only
   target size in OS – is measured before anything is decided.
2. **Spec 020, tier horizontal gradient**, absorbing 019. One configuration
   migration, one release, one review.

If the supersession is declined, 019 ships first and 020 inherits `inlineUnitRem`
from it. Spec 021 is independent either way and can run in parallel or first.

