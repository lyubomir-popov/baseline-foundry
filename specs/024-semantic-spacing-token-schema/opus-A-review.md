# Opus checkpoint A review

## Reviewer and scope

| Item | Value |
|---|---|
| Reviewer | Claude Opus 5.5, running as the GitHub Copilot agent in VS Code Insiders, in a fresh session |
| Independence | Did not produce the checkpoint A implementation (GPT did, per BF `AGENT-INBOX.md`, handover 2026-10-03). The same model family drafted the 2026-10-03 spec text, so findings against the spec text are offered as review input. They do not count as an independent FR-048 review of that text |
| Date | 2026-10-03 |
| Supplied-rulings commit | `a162a166b49c3ecc96e275478172dfc7e294ac04` |
| Implementation commit | `648adb55f95c114f42c2ef3b6c18b2cda8571168` |
| Request commit | `a00f82c` (review documentation only) |
| Spec 026 commit | `2307c18ffdca71602522e582eeac30af822450d7` (R11–R15 read as boundary input; no implementation to review) |

The implementation diff contains 11 files and 535 insertions, all under `benches/` and `tasks.md`.
It adds no production source, no font binary and no Pragma code. `git diff --check` is clean.

## Verdict

**Accept with bounded corrections.**

The six benches do what T011c and FR-054h ask. The body-phase port is faithful, and its
formulas match §2.8.3 / R12. I reproduced the evidence independently. One model-level
defect (F1) surfaced while I reviewed. It does not block A; the owner has since
selected FR-063 as the remedy.

## What I verified

- **Evidence integrity.** The `manifest.json` SHA-256 matches
  `55b47476…85272e9`. `measurements.json` holds 82/82 passing checks, 57 result
  states and zero errors. The tracked font `assets/fonts/UbuntuSans[wdth,wght].ttf`
  resolves from both relative URLs.
- **Port fidelity.** I diffed the bench against `temp/body-phase-demo/index.html`.
  The port removes relative shift, closure-only, JS line count, canvas cap ratio and
  JS class/marker insertion. It adds a registered `--A`, 1/64px nudge snapping and the
  FR-043d `< 1px` threshold. It also changes the defaults to body phase / nearest and
  replaces the column slider with three radios. I found no other behavioural change.
- **Formulas.** Body text's phase is `mod(A − b, L) = 0` by construction. Its
  closure is `−nudge`, and it cancels exactly because padding and margin both use the
  snapped nudge. The heading closure folds the element gap before rounding up, as
  §2.8.3 requires. `--A` is computed once at `.stage` from the body's `1cap`. Every
  other term substitutes on the element itself.
- **Snap table.** The computed leading matches FR-039b3 for every role in the bench:
  Site h3/h4 24/24 (up: 24/48), Docs h3/h4 24/40, Docs h5 18/20, App h2 24/40 and
  App h3/h4 18/20.
- **Independent reproduction at DPR 1.5.** This was the owner's live browser, at
  1440×1000. All 18 nearest/up × tier × width states show 15/15 blocks. The largest
  residual is 0.3px. This extends the DPR 1 evidence for body text.
- **CSS-only.** `measure.js` and the body-phase script write only `output` text,
  `data-check` and a class that styles an absolutely positioned pseudo-element.
  Nothing they write feeds layout. This holds by inspection on all seven routes.
  The tool checked it on body-phase in one state only (see P3-4).
- **Inputs.** Field, action, mark-gap and continuation values match
  `config/canonical-spacing.resolved.json`. The continuation bench also exposes a
  real current-model defect: Docs' 24px alias against 8 + 16 + 8 = 32px leaves an
  8px keyline error. That supports FR-059.
- **FR-043c, FR-057 and FR-061.** Gap values, the governed-density host fit, the
  no-op legacy selector and parent-owned seams all behave as the README states.

## Findings

### F1 · P2 · remedy selected; adoption verification pending · border subtraction fails at fractional DPR

The owner selected the remedy on 2026-10-04: FR-063–FR-063g and spacing draft
§2.8.1. Strokes take no layout space; by default they are inset `box-shadow` layers,
with a forced-colours `outline` fallback. Choosing the remedy does not prove that
migrated components work. The FR-063g stroke bench and each adopting family carry
that proof. Users at 100% and 200% are unaffected, so the finding is downgraded from
P1. The second opinion is in `sol-fr063-review.md`.

**Evidence method.** I measured this in a real 150% OS-scaled browser. Context
`deviceScaleFactor` emulation in Playwright or CDP does **not** reproduce border
snapping: it reports the DPR but keeps a 1px layout border. Reproductions must use
real OS scaling or Chromium's `--force-device-scale-factor` launch flag.

At a fractional device-pixel ratio, Chromium snaps a 1px border down to whole device
pixels. The used border is then 0.667px at 150% and 0.8px at 125%. The bench subtracts
the authored `--edge: 1px`, so every bordered box comes out short of its step.

Reproduce: Windows display scaling at 150%, open `control-row/`, select Proposed, then
read `getComputedStyle(.control).borderTopWidth` and the occupied heights.

| Tier | Expected occupied (DPR 1) | Measured at DPR 1.5 |
|---|---|---|
| Site | 40 / 40 / 32 | 39.323 / 39.323 / 31.323 |
| Docs | 32 / 32 / 28 | 31.333 / 31.333 / 27.333 |
| App | 32 / 32 / 28 | 31.333 / 31.333 / 27.333 |

Surfaces have the same arithmetic: `padding: calc(x − 1px)`.

This matters beyond the bench. In a body-phase flow, a bordered control or surface
is "non-text content [that] must occupy whole body lines". Its shortfall shifts
everything after it, and stacked bordered boxes add up their shortfalls. FR-043d
explicitly rejects that kind of accumulating error. 125% and 150% are default scaling
on many Windows laptops. The DPR 1 evidence cannot show this.

- **Correction at A:** state the limit in `benches/README.md` and the T011c entry.
  Add launch-scale 1.25 and 1.5 passes to `verify-benches.cjs`, using
  `--force-device-scale-factor`, not context emulation. Record the results as they
  are; do not tune the numbers to pass.
- **Remedy:** selected as FR-063 (see above).

### P2-1 · The spec says the class changes only the step; the mechanism needs four switches

FR-043e and §2.8.3 say the class "sets only the rhythm step" and "changes one thing".
The bench actually switches four things:

1. the step;
2. a body anchor `--A`, registered and computed at the container;
3. the closure rule: cancelling the nudge versus rounding up;
4. the container's after-heading gap, which becomes 0 because it is folded into the
   heading's closure.

Switching the step alone does not give the default behaviour. At step = bU, phase is
0, so the body-phase closure gives `−nudge`. FR-039b and R11 require `bU − nudge`.
Heading snapping is the one thing that is derivable from the step: every type-scale
leading is already a bU multiple, so `max(round(nearest, lh, bU), round(up, fs, bU))`
is a no-op.

The bench also selects modes with descendant selectors, not an inherited step, and it
has no `.ds` reset specimen. It therefore cannot be cited as evidence for FR-043e's
inheritance or component-boundary clauses. Neither the README nor `tasks.md` cites it
that way. Keep it so.

- **Fixed 2026-10-04:** FR-043e and §2.8.3 now list the step, the body anchor,
  the cancelling closure and the folded after-heading gap.

### P2-2 · FR-058 says the occupied box is square; the bench squares the painted box

FR-058 says the icon-only Button's "occupied box is square". The bench and the request
square the painted box instead and leave the closure outside it: Site is painted
28.906 × 28.906 and occupied 28.906 × 32. That is a reinterpretation of the ruling,
not a demonstration of it.

It also makes a visible consequence explicit. FR-058's equal-padding arithmetic forces
the content to the mark (16px). A close action is therefore 8px (Site) or 4px
(Docs/App) shorter than a text action beside it. The control-row screenshot shows the
mismatch.

- **Owner decision before C's Commands restack:** amend FR-058 to say the painted
  box is square, or square the close action to the row's painted height, accepting
  inline padding greater than the block padding.

### P2-3 · Surface bench has no alternative for its pending values

FR-054h asks for a bench that "lets the owner switch between the alternatives". FR-060
says the standard values "are confirmed on the insets bench". The surface page shows
only one candidate for each pending choice:

- 16/8 in every tier, with no switch to the 12/6 reading for Docs/App;
- the field-inline value on compact block edges, with no switch to the control block
  inset or to bU.

- **Before the owner confirms surface values:** add those two switches. This is not
  needed to check T011c.

### P3 · Bounded, fix with the A corrections

- **P3-1.** In Current mode the nested filled surface uses the proposed standard insets
  (8/16/16), not the old 8/16/8. The "before" side is not faithful. Scope
  `.surface .nested` padding to Proposed.
- **P3-2.** The `gaps-seams` sections use plain `<p>` without a nudge. The standard
  surface's half block-start inset therefore reads tighter than FR-060 intends. Use
  `.text-line`, as `surface-insets` does.
- **P3-3.** The seam diagnostic leaves out borders. Around the filled child it
  reports 31 / 39px for actual content seams of 32 / 40px. Include
  `borderTopWidth` / `borderBottomWidth`.
- **P3-4.** The no-JS check covers body-phase in Site / nearest / 34rem only, and
  `surface-insets` has no numeric assertion. Narrow the `tasks.md` claim
  ("no-JS layout equivalence") to what was checked, or extend the driver. A useful
  addition is asserting that proposed surfaces and seams close to whole bU/body lines.
- **P3-5.** `benches/README.md` commits a transient process ID (`PID 10408`). Remove it.

### P3 · Observations for the owner, not corrections

- **Heading comfort.** FR-039b3 leaves the 18/20 roles (Docs H5/H6, App H3/H4, ratio
  1.11) decided by omission, while 24/24 (1.0) is pending. Consider reviewing them
  together. In the bench only App h3 wraps at 18px, and Docs h5 never wraps. When
  judging 24/24, use a wrapped string with descenders and diacritics, for example
  "Ångström typography: gap jumps". Solid leading is where glyphs from adjacent lines
  meet. "Snap up" gives 18/40 on Docs/App; that is not a real candidate.
- **Overlay.** The pink lines are now placed from the CSS-predicted `--A`, while the
  original demo used the measured reference baseline. The badges still measure
  against the reference, so the residuals are honest. The overlay can differ from
  them by the cap-proxy error, about 0.3px or less here.
- **Keyboard.** Shortcuts are ignored while a radio has focus, which is always the
  case right after a click. Arrow keys still work. FR-054g's keyboard toggle at D
  should not copy this guard.
- **Coverage.** The bench has no h1/h6 and no specimen of non-text content in the
  flow. FR-043e names both. They belong to the C/D benches.

## Hand-back statements checked

- R12's example is correct: the closure is exactly `−nudge`. The Site body nudge is
  6.453px and Docs/App is 1.156px.
- "24/24 is the nearest whole Site body line to 32" and "24/48 also preserves
  rhythm" are both correct. I reproduced 15/15 at DPR 1 and 1.5. "Docs/App 24px
  headings need at least 40px" is correct, because `round(up, 24, 20) = 40`.
- TokenSwatch ownership and the bounded exception backlog are checkpoint B items.
  They are not in this diff and were not reviewed here, and nothing at A contradicts them.

## Correction list

Before T011c is checked:

1. F1: record the fractional-DPR limit in the README and `tasks.md`, and add
   launch-scale 1.25 / 1.5 runs to the driver.
2. Fix P3-1, P3-2, P3-3 and P3-5, and narrow or extend P3-4.

Before the owner confirms surface values: P2-3.

Before C: build and review the FR-063g stroke bench, and get the owner's decision
on P2-2. P2-1 was fixed on 2026-10-04.
