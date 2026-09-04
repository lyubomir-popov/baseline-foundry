# Review: Block-derived inline geometry

**Status**: Opus accepted the remediated F1–F5 and N1–N6 geometry after the
S1–S4 work, owner-directed Action-inset chip migration, inline-icon metric
correction, and inline-list correction on
`feat/021-block-derived-inline-geometry`. Its final contract-disclosure
corrections are implemented and local gates are green. Acceptance remains a
separate owner decision.

## Outcome

Spec 021 implements one cascade-repointed `--bf-square-block-size` contract for
badges, bare icon buttons, specialized notification-close actions, and bare
numbered pagination. Each state maps to the component's own painted block, not
an occupied ledger. Chips use the Action inset without the inert
block-derived floor; badges own the exact circular-counter case. Wider badge
content grows into a stadium, while Action-framed chips are intrinsically
stadiums. Status labels, exterior chip spacing, and the chip-to-badge composite
gap retain their separate Field owners. Link-style icon buttons resolve from
their body-line paint; labelled actions remain on the Action inset.

Icon-only actions keep naturally dense token-derived paint and gain a direct
24-by-24 CSS-pixel pointer target through an out-of-flow transparent
`::after`. The extension changes no painted or occupied block measurement. The
24px constant is normative WCAG target geometry, not a BF spacing token.
Each target reserves its own inline overflow. Built-in wrapping `.bf-actions`
and `.bf-cluster` rows automatically apply a baseline-rounded `row-gap` floor.
Direct icon targets in `.bf-actions.is-nowrap` own their required symmetric
block margins, leaving text-only scroll strips unchanged. The unused opt-in
classes are removed. No container infers geometry from descendants through
`:has()`.

No block ledger, line height, nudge, compensation, target height, tier config,
or public radius changed. The existing chip and badge radii were already
sufficient once their boxes became truthful; static checks prove that no
unrelated radius declaration was added, removed, or changed.

The surviving `--bf-ui-badge-padding-inline` is one border-width token, not the
former body-line approximation. It remains solely as the minimum overflow
inset and the existing nested-badge overhang input; `--bf-square-block-size`
owns the fitting case.

No merge, publication, release, archive, or Spec 020 start is authorized by
this review.

## Historical first-implementation measurements

The table below records the first implementation reviewed before the later
Action-inset owner decision and S1–S4 remediation. Current disposition and
measurements are recorded in the final-remediation section near the end of this
file; this evidence remains here to preserve the review trail.

Measurements are painted width by height in CSS pixels. Light and dark were
identical; both tones are exercised by the behavior gate. Baseline values were
captured before source edits, with the notification-close baseline confirmed
against the unchanged pre-Spec-021 demo on port 4173.

| Member | Editorial | Documentation | App | OS |
|---|---:|---:|---:|---:|
| one-character chip, before | 25.03×37.11 | 23.90×22.48 | 15.90×22.48 | 14.77×23.83 |
| one-character chip, after | 37.12×37.11 | 23.90×22.48 | 22.48×22.48 | 23.84×23.83 |
| nested one-character chip, before | 23.03×24 | 21.91×20 | 13.91×20 | 12.78×16 |
| nested one-character chip, after | 25.03×24 | 23.91×20 | 20×20 | 16×16 |
| one-character badge, before | 21.03×24 | 17.90×20 | 17.90×20 | 14.77×16 |
| one-character badge, after | 24×24 | 20×20 | 20×20 | 16×16 |
| nested one-character badge, before | 21.03×16 | 17.90×16 | 17.90×16 | 14.77×12 |
| nested one-character badge, after | 16×16 | 16×16 | 16×16 | 12×12 |
| standalone icon-only button, before | 48×37.11 | 48×22.48 | 48×22.48 | 48×23.83 |
| standalone icon-only button, after | 37.12×37.11 | 22.48×22.48 | 22.48×22.48 | 23.84×23.83 |
| link-style icon-only button, before | 37.11×24 | 22.47×20 | 22.47×20 | 23.83×16 |
| link-style icon-only button, after | 24×24 | 20×20 | 20×20 | 16×16 |
| notification close, before | 16×32 | 16×24 | 16×24 | 16×24 |
| notification close, after | 32×32 | 24×24 | 24×24 | 24×24 |
| numbered pagination, before | 41.03×37.11 | 39.90×22.48 | 39.90×22.48 | 38.77×23.83 |
| numbered pagination, after | 37.12×37.11 | 22.48×22.48 | 22.48×22.48 | 23.84×23.83 |

Two-, three-, four-, and five-character fixtures are exercised. Wider chip and
badge instances keep the same painted block and grow into stadiums without
clipping; the badge's former four-`ch` cap and hidden overflow were removed.
Chip glyphs are centred to within 0.51px in standalone, nested, and borderless
states. Documentation's standalone and Editorial/Documentation nested
Field-framed one-character chips are intrinsically wider than their painted
blocks and are therefore slight stadiums, as the minimum contract requires;
badges provide the exact circular-counter form. Regular chips subtract their
real border from the Field inset, while nested chips retain the full inset
because their border is inset paint. Longer chip text retains the shared Field
keyline in every tier.

## Target-size disposition

The approved WCAG 2.2 SC 2.5.8 dispositions were applied from measurement, not
assumption.

| Changed target | Editorial | Documentation | App | OS |
|---|---:|---:|---:|---:|
| interactive standalone fitting chip | direct | spacing | spacing | spacing |
| table-hosted interactive nested chip | direct | spacing | spacing | spacing |
| regular standalone icon | direct | direct | direct | direct |
| link-style icon | direct | direct | direct | direct |
| notification close | direct | direct | direct | direct |
| numbered pagination | direct | spacing | spacing | spacing |
| smallest chip target-centre distance | 61.12 | 42.14 | 34.48 | 35.84 |
| smallest icon-family target-centre distance | 41.95 | 26.78 | 26.78 | 24.39 |
| notification target-centre distance | 78.26 | 60.85 | 57.17 | 47.31 |
| smallest pagination target-centre distance | 45.12 | 30.48 | 30.48 | 27.84 |

“Direct” means an axis-aligned 24×24 CSS-pixel square is directly hittable.
For icon-only actions this includes the transparent square extension, whose
computed dimensions and hit-tested cardinal edges and corners are verified in
LTR and RTL without changing paint. Adjacent icon links in ordinary and nowrap
`.bf-actions` groups are also hit-tested; their centres retain one border width
of positive clearance, and the nowrap scrollport contains the complete target.
“Spacing” is proven pairwise for the remaining undersized members: the browser
gate places the 24px circle over each undersized target and rejects an
intersection with either another undersized circle or any normal target. The
centre distances above are audit measurements, not the collision algorithm.
The target inventory includes native pointer controls and actionable ARIA
roles. It deliberately excludes the enclosing keyboard-scroll region: focus
enables scrolling there but does not define the whole region as a pointer
activation target.

## Exclusions verified

- Labelled previous/next pagination retains 15px computed inline padding and
  remains wider than its painted block in every tier.
- The collapsed article-pagination previous link remains a responsive labelled
  grid with `min-inline-size: 0`: 56×112, 28×88, 28×80 and 28×52 from
  Editorial through OS. Its clipped visual label remains in the accessible
  name; it does not consume the square alias.
- Status labels remain rectangular and have no radius.
- The horizontal audit keeps regular and borderless chips in the Field bucket,
  while the pure block-derived bucket demonstrates badges, bare icons and bare
  pagination separately from Action controls.

## Automated evidence

- `npm test`: exit 0; 9,947 static checks; every component baseline family
  reports zero failures; the complete component behavior sweep passes.
- `npm run qa:components`: exit 0 after fresh full-catalog captures; every
  baseline family reports zero failures.
- Static checks run against all eight CSS bundles and enumerate exactly seven
  alias states and four reviewed consumer families. They reject per-tier
  overrides, build-time body-line inline floors, the retired occupied
  pagination slot, authored icon/pagination sizes, transforms, aspect-ratio
  fixes, duplicate alias declarations, and radius leakage. Every unaffected
  radius selector/value pair is an exact build snapshot, and one complete CSS
  rule must satisfy every multi-declaration AST assertion.
- Browser behavior sweeps all four tiers and both tones for circles, stadiums,
  glyph centring, standalone and nested two-through-five-character clipping,
  table-hosted interactive nested-chip target spacing, regular/link/specialized
  icon squares, real page-chrome buttons, direct 24 CSS-pixel icon targets,
  ordinary/nowrap adjacency in LTR and RTL, fractional-scale border
  rasterisation for both default-alias members, pagination ownership,
  shape-aware target size/spacing, and the excluded article-pagination
  collapse.
- Existing occupied-block, nested-host, zoom, and vertical-family assertions
  passed without changing their expected geometry.

## Manual browser review

The implemented demo is live at `http://127.0.0.1:4174/`. Fresh capture QA and
targeted Playwright review covered chip, badge, button, pagination,
notification, and the horizontal audit. The OS icon-only paints measured
23.828×23.813, 23.828×23.813 and 16×16 CSS pixels while all three computed
transparent targets measured 24×24; visual inspection showed centred icons and
unchanged control paint. The supported OS adjacent-icon action gap is 9px,
leaving 1px between transparent targets; nowrap groups reserve the 4px per-edge
OS overflow as transparent scrollport padding. Chips retain their Field-framed
stadiums, badges read as circular counters, and labelled pagination remains
visibly labelled.

## Independent adversarial review

A fresh Sol pass found eight issues in the first implementation: off-centre
fitting chips, clipped five-digit badges, a non-square public icon-link state,
an undocumented chip-padding change, a nearest-centre-only WCAG approximation,
missing pagination target evidence, weakened duplicate-rule AST matching, and
overstated radius/coverage records. Follow-up review also tightened logical
radius snapshots, restored the original labelled-icon demo layout, completed
nested two-through-five-character coverage, and added the real table-hosted
interactive nested chip to the target sweep. All findings are addressed in
source, gates, and this package.

A final independent pass over the R1/R3/R4 follow-up then found exact-touch
target collisions, nowrap clipping, RTL miscentring, incomplete parent-selector
scope, one-border-short nested Field padding, missing fractional-scale chip
coverage, and a production-selector leak into the explicitly unsupported
nested icon state. Those findings drove the positive clearance, scrollport
padding, physical pseudo centring, conservative parent condition, full nested
Field inset, two-member DPR sweep, and `.is-nested` exclusions now recorded
above. The final reviewer found no remaining blocking or substantive source,
behavior, or static-test issue; independently passed 9,947 static checks,
component behavior and component baselines; and passed all eight target hit
points across 16 tier × direction × ordinary/nowrap cases plus constrained
scrollport extremes.

## Remaining decision

Owner and originating stakeholder visual acceptance are still required. After
acceptance, merge/archive is a separate explicit action. Publication and
release remain out of scope.

---

## Independent re-review, 2026-09-02

Measured in the running browser at `http://127.0.0.1:4174/` across all four
tiers, rather than read from source. Four findings. None blocks on visual
grounds; two are structural and one needs an explicit owner acceptance rather
than a passing test.

### R1 — The default alias branch is not the paint it claims to be

Measured painted extents for a fitting single glyph:

| Member | Editorial | Documentation | App | OS |
|---|---:|---:|---:|---:|
| chip standalone | 37.11 × 36.44 | 22.48 × 21.81 | 22.48 × 21.81 | 23.83 × 23.17 |
| chip nested | 24 × 24 | 20 × 20 | 20 × 20 | 16 × 16 |
| badge standalone | 24 × 24 | 20 × 20 | 20 × 20 | 16 × 16 |
| badge nested | 16 × 16 | 16 × 16 | 16 × 16 | 12 × 12 |
| icon-only button | 37.11 × 36.44 | 22.48 × 21.81 | 22.48 × 21.81 | 23.83 × 23.17 |

Every member with an explicit re-point is exact to 0.00px. The two members left
on the default — standalone chip and icon-only button — are 0.67 to 0.68px
wider than tall, in every tier.

`min-inline-size` computes to 37.12px in Editorial while the element renders
36.44px tall, because the flex line box resolves smaller than
`line + 2·padding + 2·border`. So the default
`--bf-square-block-size: var(--bf-interface-row-painted-block-size)` is a
ledger formula, not the component's paint. That is the same structural error
the correction notice in this package's contract was written to prevent,
reproduced in the branch nobody re-pointed.

It passes because `shapeTolerance` is `1.05`, against a measured error of 0.68.
The headroom is 0.37px, and 1.05 is twice the `0.51` rasterisation tolerance
used everywhere else in this suite.

**This one is partly the contract's fault, not the implementation's.** The
contract table asserts `.bf-chip` and `.bf-button.is-icon` resolve to "interface
row painted", derived from the formula rather than from a rendered box. The
implementation faithfully built what the table said.

Suggested order: tighten `shapeTolerance` to `0.51` first so the discrepancy
fails, then diagnose the flex line-box shortfall at source so the formula
becomes true, rather than re-pointing two more members around it. Re-pointing
works but leaves the default branch permanently untrustworthy for the next
member.

### R2 — Nested icon-only buttons overflow their host line

| Tier | Host body line | Nested icon button | Overflow |
|---|---:|---:|---:|
| Editorial | 24px | 32 × 31.33 | +7.33px |
| Documentation | 20px | 24 × 23.33 | +3.33px |
| App | 20px | 24 × 23.33 | +3.33px |
| OS | 16px | 20 × 19.33 | +3.33px |

The nested block contract states that both ledgers "fit within the host body
line and contribute no external block margin". A nested icon-only button
exceeds it by 30% in Editorial.

The cause is that the icon-only metric strut is
`block-size: var(--bf-body-line-height)` and is not re-pointed under
`is-nested`, so the button keeps a full body line and then adds nested framed
padding and two borders on top. The alias re-point
`calc(var(--bf-body-line-height) + framed-padding·2 + border·2)` describes that
paint accurately — the square is correct — but the paint itself is wrong for a
nested context.

Either the strut re-points to `--bf-nested-row-line-height` under `is-nested`,
or `.bf-button.is-icon.is-nested` is not a supported composition and its alias
re-point should be removed rather than left as untested geometry. It cannot
stay as it is.

### R3 — Three of four tiers now rely on the WCAG spacing exception

| Tier | Icon button | Meets 24 × 24 |
|---|---:|---|
| Editorial | 37.11 × 36.44 | yes |
| Documentation | 22.48 × 21.81 | no |
| App | 22.48 × 21.81 | no |
| OS | 23.83 × 23.17 | no |

The assertion is `containsMinimumSquare || passesSpacing`, so these pass
legitimately through the 2.5.8 spacing exception. That is a valid disposition —
it is option 2 of the four in the contract — but the plan anticipated this as
an OS-only question and it now applies to three tiers.

A passing test is not the same as an accepted trade-off. This needs the owner
to accept explicitly that icon-only actions in Documentation, App and OS depend
on surrounding spacing for their target size, with the measured spacing
recorded. If any consumer places two icon actions closer than the exception
allows, the guarantee is gone and nothing in this repository will notice.

### R4 — The chip left the Field classification, and the reason is one tier

`padding-inline` changed from `inset − border` to `inset − 2·border`, so an
overflowing chip's text now starts at 7px against an 8px field keyline in
Editorial. The chip was removed from the field-keyline assertion in three
places and reclassified in the architecture table.

The change is disclosed, not hidden, and the reclassification has a real
argument behind it: once a fitting chip is centred inside a minimum, it has no
field keyline to claim.

But the measurement shows only one tier forces it:

| Tier | Painted block | Intrinsic with `inset − border` | Fits? |
|---|---:|---:|---|
| Editorial | 36.44 | 24.36 | yes |
| Documentation | 21.81 | 23.24 | **no, by 1.43px** |
| App | 21.81 | 15.24 | yes |
| OS | 23.17 | 14.10 | yes |

Documentation is the pinch: a 0.5rem field inset against an unusually small
0.0775rem nudge. So a system-wide contract change was made to resolve 1.43px in
one tier.

The alternative is already written into this package's own spec: the circle is
the case where intrinsic content fits, and a stadium is the correct outcome
otherwise. Accepting a marginally wide Documentation chip would keep the chip
in Field, keep the keyline assertion intact for every multi-word chip in every
tier, and change nothing else.

That is an owner trade-off — a keyline guarantee for the common case against a
circle in one tier's rare case — and it was settled inside an implementation
commit. It should be surfaced and decided, either way.

### What is confirmed good

The git sequence executed correctly: `main` is pushed and in sync at `b99b66a`,
the snapshot branch exists, all seven merged remote branches are gone, and
nothing unmerged was deleted. Every explicitly re-pointed alias value is exact
to 0.00px in all four tiers. Badges are correct standalone and nested, which is
the originating stakeholder report. Stadium growth, clipping and centring
behave correctly at one through five characters. The reclassification and the
padding change were disclosed in the architecture document rather than made
silently.

### Standing

R2 should be fixed before acceptance; it breaks a stated invariant of the
nested contract by a visible margin. R1 should be fixed before acceptance
because the default branch is the one the next member will inherit. R3 and R4
are owner decisions, not defects, and should be answered rather than closed by
a green gate.

---

## Re-review response, 2026-09-02

### R1 — hardened; reported discrepancy does not reproduce

The requested tolerance was tightened from `1.05` to `0.51`. Fresh direct
`getBoundingClientRect()` measurements against the live port-4174 build in the
installed stable Chrome and Edge engines produce the same results:

| Default-alias member | Editorial | Documentation | App | OS |
|---|---:|---:|---:|---:|
| one-character chip | 37.109×37.094 | 22.469×22.469 | 22.469×22.469 | 23.828×23.813 |
| regular icon-only button | 37.109×37.094 | 22.469×22.469 | 22.469×22.469 | 23.828×23.813 |

The maximum difference is 0.016px, not 0.68px, and the complete four-tier,
two-tone behavior sweep passes at the tighter tolerance. No block-size floor
was added: doing so would violate the established natural occupied-block
contract to fix a discrepancy that the two installed production engines do
not reproduce. A contrary re-review needs to include its selector, browser,
zoom/device scale, font-ready state, and measurement expression.

### R2 — resolved by removing unsupported membership

Re-pointing the metric strut made Editorial, Documentation and App fit, but OS
still rendered 18×20px: its 16px icon canvas alone equals the complete 16px
host line before padding and borders. The bordered nested icon-only composition
has therefore been removed from the alias map, demo, behavior membership,
contract, plan, quickstart and architecture table. Static validation rejects
its reintroduction. Regular, link-style and real page-chrome icon actions
remain supported.

### R3/R4 — owner decisions still required

R3 asks whether Documentation, App and OS icon-only actions may use the WCAG
spacing exception, preserving natural tier density, or must instead expose a
direct 24×24px target, which requires reopening the no-target-block-size rule.

R4 asks whether chips retain exact one-character circles in Documentation by
leaving the Field keyline, or restore the Field inset and accept that this one
case becomes a 23.24×21.81px stadium while every longer chip keeps the shared
text keyline.

Focused evidence is green: 9,716 static checks and the complete component
behavior sweep pass. Full `npm test` and fresh `npm run qa:components` are
deliberately deferred until R3/R4 are decided and encoded.

---

## Recommended resolutions, 2026-09-02

Written in response to the request for measurement conditions, and to the
question of whether R3 and R4 are solvable inside the existing constraints.
Both are. Neither needs the vertical contract reopened.

### R1 — withdrawn, and the tolerance should be restored to `1.05`

The measurement conditions asked for: `.bf-chip` and
`.bf-button.is-icon:not(:has(.bf-button-label))` probed with
`getBoundingClientRect()` on `http://127.0.0.1:4174/`, page zoom 100%, fonts
loaded, **`window.devicePixelRatio` 1.5**.

That last value is the whole explanation:

| Quantity | Value |
|---|---:|
| `--bf-border-width` computed | 1px |
| `borderBlockStartWidth` rendered | 0.666667px |
| Shortfall across two borders | 0.6667px |
| Measured height | 36.44px |
| Height if the border rendered at 1px | 37.12px |
| `min-inline-size` computed | 37.12px |

`min-inline-size` resolves from the authored 1px border; the painted box gets a
border snapped to the device-pixel grid at 2/3px. The 0.6667px difference is
exactly the discrepancy reported, and it explains the pattern precisely:
members with real block borders showed ~0.67px, while badges and nested chips —
which have no real block borders — measured 0.00px in the same run.

**So R1 is withdrawn. The default alias is correct, and `1.05` was the right
tolerance for the right reason.**

The consequence matters more than the retraction. Tightening to `0.51` did not
harden anything; it removed the allowance that a rasterised border actually
needs. It passes only because the harness runs `deviceScaleFactor: 1`. On any
display at 150% scaling — which is the Windows default on most laptops, and the
environment this was measured in — the real rendered difference is 0.67px and
the assertion would fail on correct output.

Restore `shapeTolerance` to `1.05`, and record why: it is one authored border
width, because a 1px border can rasterise as little as 0.5px at fractional
device-pixel ratios and the shape check must survive that. Optionally add one
sweep at `deviceScaleFactor: 1.5` so the allowance is exercised rather than
assumed.

I introduced this by reporting a rendering artifact as a defect. The fix is to
put the tolerance back, not to keep the tighter number.

### R3 — solvable without reopening the no-target-block-size rule

The response frames this as density versus a target block size. There is a
third option that costs neither, and it is option 3 of the four already listed
in the contract: extend the *pointer target* without touching the *paint*.

A transparent, absolutely positioned `::after` is out of flow. It changes no
block size, enters no occupied-block measurement, affects no layout, and leaves
the painted square exactly baseline-aligned. Only the hit area grows.

The extension required is under one pixel per side:

| Tier | Painted | Needed | Extension per side |
|---|---:|---:|---:|
| Editorial | 37.11 | 24 | none |
| Documentation | 22.47 | 24 | 0.77px |
| App | 22.47 | 24 | 0.77px |
| OS | 23.83 | 24 | 0.09px |

Sketch, using the free pseudo-element — `::before` is already the metric strut:

```css
:where(.bf-theme) :where(.bf-button.is-icon:not(:has(.bf-button-label))) {
  position: relative;
}

/* Pointer target only. WCAG 2.5.8 is normatively specified in CSS pixels, so
   this one length is px rather than a token. */
:where(.bf-theme) :where(.bf-button.is-icon:not(:has(.bf-button-label)))::after {
  block-size: max(100%, 24px);
  content: "";
  inline-size: max(100%, 24px);
  inset-block-start: 50%;
  inset-inline-start: 50%;
  position: absolute;
  translate: -50% -50%;
}
```

The `24px` must not be converted to rem. Success criterion 2.5.8 defines the
minimum in CSS pixels, so this is an external normative constant, not a design
token that escaped. That distinction should be stated in the architecture note
so it does not read as an authored-length violation later.

Because the extension is sub-pixel per side, overlap between adjacent icon
actions is negligible and no consumer spacing rule is needed.

**Recommendation: take this option.** It meets 2.5.8 outright in all four tiers,
preserves natural tier density exactly, keeps the paint square and grid-aligned,
and removes a dependency on a spacing exception that a consumer can silently
break by placing two icon actions side by side.

If the owner prefers the spacing exception instead, it remains legal — but then
add an assertion that measures actual clearance between adjacent icon actions in
the demos, and publish a consumer spacing rule. An exception that nothing
verifies is not a guarantee.

### R4 — the third option is that a one-character chip is a badge

The choice as posed is a Documentation circle against the Field keyline for
every longer chip. Both branches are real, and the trade currently favours the
rarer case: multi-word chips are the common form, and they are the ones that sit
beside table cells and status labels where a shared text start is visible.

But there is a third option. Baseline Foundry already has a component whose
entire purpose is a circular container for one or two characters, and it now
measures exact in every tier:

| | Editorial | Documentation | App | OS |
|---|---:|---:|---:|---:|
| badge standalone | 24 × 24 | 20 × 20 | 20 × 20 | 16 × 16 |
| badge nested | 16 × 16 | 16 × 16 | 16 × 16 | 12 × 12 |

If the stakeholder's need is "a circular thing containing one digit", the badge
delivers it today, exactly, with no keyline cost. Chips could then return to
Field with `inset − border`, keep the shared text keyline in all four tiers, and
be a stadium whenever their content does not fit — which is what this package's
own spec already says should happen.

**Recommendation: restore chips to Field and let badges own the circular
single-character case.** Keep the block-derived minimum on chips so a short chip
never renders narrower than its own row; just stop trading the keyline for
1.43px in one tier.

Take the current branch instead only if the stakeholder specifically asked for
one-character *chips* to be circular, as distinct from badges. In that case the
existing implementation is correct and the architecture note already discloses
the trade.

### Why Documentation is the pinch tier

Worth recording regardless of which branch is taken, because it will resurface.

| Tier | Body line | Start nudge | Painted block | Frame above line |
|---|---:|---:|---:|---:|
| Editorial | 24px | 0.41rem | 37.12px | 13.12px |
| Documentation | 20px | 0.0775rem | 22.47px | 2.47px |
| App | 20px | 0.0775rem | 22.47px | 2.47px |
| OS | 16px | 0.245rem | 23.83px | 7.83px |

Documentation and App have almost no frame around their controls — 2.47px
against Editorial's 13.12px — because their metric start nudge is an order of
magnitude smaller. Documentation is the only tier that combines that tiny frame
with a 0.5rem field inset, which is precisely why its chip conflict exists and
App's does not.

That asymmetry is metric-derived and legitimate, but it means Documentation and
App will keep being the tiers where anything asking for a square runs out of
room first. Spec 020 should note it; nothing here needs to act on it.

### Standing after this pass

R1 withdrawn, with a request to restore the tolerance. R2 resolved correctly,
and the OS icon-canvas conflict found in the process confirms removing the
composition was the right call rather than re-pointing the strut. R3 and R4 both
have resolutions available inside the existing constraints; neither requires a
target block size, an authored geometry token, or any change to the vertical
contract.

---

## Recommended resolutions implemented, 2026-09-02

All three recommended actions above are now encoded.

- **R1:** `shapeTolerance` is restored to `1.05`. A separate Chromium pass is
  launched with `--force-device-scale-factor=1.5` across fitting chips and
  regular icon-only buttons; it must observe a roughly
  0.666667 CSS-pixel rendered border and a correct square whose raster delta is
  greater than `0.51` but no greater than `1.05`. The allowance is now exercised
  rather than merely explained.
- **R3:** every supported icon-only `.bf-button`, including link-style,
  page-chrome and specialized notification-close actions, exposes an
  out-of-flow `::after` whose two axes resolve to at least 24 CSS pixels. A
  supported action group derives target overflow from the same normative value,
  adds one border width of positive separation, and reserves the overflow as
  padding when `is-nowrap` would otherwise clip it. Static validation permits
  exactly those three uses of `24px` and rejects all other authored pixel
  lengths. Browser validation checks cardinal edges and corners in all four
  tiers and both tones, in LTR and RTL, for ordinary and nowrap adjacency.
- **R4:** chip padding is restored to `Field inset − border`; regular and
  borderless chip text rejoin the Field keyline assertions and demo bucket.
  Nested chips retain the complete Field inset because their border is inset
  paint rather than geometry. Chips keep `--bf-square-block-size` as a floor.
  Documentation's standalone and Editorial/Documentation nested one-character
  chips are accepted slight stadiums, while badges remain exact circular
  counters in every tier and state.

R2 remains closed by exclusion: bordered nested icon-only buttons are absent
from the alias map, demo and supported contract, and static validation rejects
their reintroduction.

Closeout evidence after the independent hardening pass: `npm test` passes
9,947 static checks, every component baseline family reports zero failures,
and the complete behavior sweep passes, including the new direct-target,
adjacency, nowrap, bidirectional, unsupported-nested exclusion and forced-scale
cases. Fresh `npm run qa:components` captures and verifies the full catalog
with zero failures. External Opus adversarial re-review remains the final
requested review evidence.

## Opus adversarial re-review request, 2026-09-02

Please re-review the current `feat/021-block-derived-inline-geometry` working
tree after the implemented R1/R3/R4 resolutions and independent adversarial
hardening. Treat the earlier R1–R4 passages above as historical evidence; the
current disposition begins at
[Recommended resolutions implemented](#recommended-resolutions-implemented-2026-09-02).

In addition to the original four findings, probe these implementation seams:

- all cardinal edges and corners of the 24 CSS-pixel pseudo-target in LTR and
  RTL, including adjacent link icons, an extra non-label child, and constrained
  `bf-actions is-nowrap` scrollports at both scroll extremes;
- the one-border-width positive target clearance and the targeted OS icon-link
  group gap, while ordinary action groups retain the Field gap;
- production-selector exclusion of bordered `.is-nested` icon-only buttons in
  both the alias and consumer rules;
- regular `Field − real border` versus nested full-Field chip padding, including
  the accepted Documentation standalone and Editorial/Documentation nested
  one-character stadiums;
- forced device scale 1.5 coverage for both default-alias members, and the
  reason for the 1.05px raster tolerance;
- consistency among source, exact static assertions, architecture, contract,
  acceptance, measurements, and live-state records.

Current evidence: `npm test` exits 0 at 9,947 static checks with zero
component-baseline or behavior failures; `npm run qa:components` exits 0 after
fresh full-catalog captures; the independent final live probe passed all 16
tier × direction × ordinary/nowrap combinations at all eight hit points.

Opus: append the detailed result immediately below this request under
`## Opus adversarial re-review, 2026-09-02`. Then update `AGENT-INBOX.md` with
a direct link to that appended section and a concise outcome. Do not leave the
detailed review only in the inbox. Do not merge, push, publish, release,
archive, or start Spec 020.

## Opus adversarial re-review, 2026-09-02

Measured against the live build at `http://127.0.0.1:4174/` on a
`devicePixelRatio` 1.5 display, using constructed probes in all four tiers
rather than reading source. **Not merge-ready.** One high finding, two medium,
one low. The members themselves are correct; the collateral of the R3 target
fix is not.

### Confirmed correct

**R1 disposition is right and I can independently confirm the tolerance is
needed.** On this DPR 1.5 display, standalone chips and icon buttons still
measure 0.67px off square because the 1px border rasterises to 0.667px.
Restoring `1.05` was correct; the DPR 1.5 sweep now exercises it.

**R4 is resolved carefully.** Chip text lands on the Field keyline in every
tier, standalone and nested:

| Tier | Field inset | Chip text start | Nested chip text start |
|---|---:|---:|---:|
| Editorial | 8px | 7.67 | 8.00 |
| Documentation | 8px | 7.67 | 8.00 |
| App | 4px | 3.67 | 4.00 |
| OS | 4px | 3.67 | 4.00 |

The 0.33px on the standalone figures is the rasterised border; at DPR 1 it is
exact. Giving the nested chip the full inset because its border is inset paint
rather than box geometry is a genuinely careful detail that would have been
easy to miss.

**Isolated icon targets meet 24×24 in all four tiers.** Editorial resolves
`max(100%, 24px)` to its larger paint; the other three resolve to exactly 24px.
Nested icon buttons are excluded at both alias and production selectors.

### S1 — high. The 24px guarantee does not survive two adjacent icon links

Clearance is reserved only inside `:where(.bf-actions:has(> .bf-button.is-link.is-icon))`.
`bf-cluster` is an equally first-class primitive and reserves nothing. Two
adjacent `.bf-button.is-link.is-icon` in a plain `bf-cluster is-dense`:

| Tier | Link icon paint | Extension per side | Paint gap | Target clearance |
|---|---:|---:|---:|---:|
| Editorial | 24 × 24 | 0 | 8px | 8px |
| Documentation | 20 × 20 | 2px | 4px | **0px** |
| App | 20 × 20 | 2px | 4px | **0px** |
| OS | 16 × 16 | 4px | 4px | **−4px** |

In OS the two transparent extensions overlap by 4px. Because `::after` carries
`pointer-events: auto`, they are hit-testable and the later-painted one wins.
Sampled with `elementFromPoint` at 1px steps across the first button's intended
24px target:

```text
paint 16px, gap 4px
button A hit range: −12..+7   → effective target 20px, not 24
dx +8..+12 routes to button B
meets24: false
```

So the pair delivers neither the old geometry nor the new guarantee. It is also
strictly worse than the problem it replaced: an undersized target is hard to
hit, whereas a 4px band that silently actions the *adjacent* control is a
wrong-action risk. The demo only exercises `.bf-actions`, which is why the
sweep passes.

This needs the clearance to be a property of the target contract rather than of
one container class. Reserving the extension on the button itself — for example
a margin-inline equal to `--bf-action-target-overflow`, or an explicit opt-in
modifier available to any container — would hold wherever the button is
composed. Scoping it to `.bf-actions` guarantees only the case that is tested.

### S2 — medium. The nowrap padding lands off the baseline in two tiers

`:where(.bf-actions.is-nowrap:has(> .bf-button.is-link.is-icon))` uses the
`padding` shorthand, so it adds block padding as well as inline:

| Tier | Baseline | Block padding applied | On grid |
|---|---:|---:|---|
| Editorial | 8px | 0px | yes |
| Documentation | 4px | **2px** | no |
| App | 4px | **2px** | no |
| OS | 4px | 4px | yes |

The container's total block growth is 4px in Documentation and App, which is
one whole baseline, so following content stays on phase. But the controls
*inside* the container shift down 2px — half a baseline — so their own phase is
broken.

The package states "no block measurement changes, proven by the existing
vertical assertions passing unmodified". That claim is true and does not cover
this, because no vertical audit specimen is a nowrap action group containing an
icon link. An inline accessibility fix has produced a vertical consequence in
the one construct the vertical audit does not see.

If block padding is genuinely required — `overflow-x: auto` computes
`overflow-y` to `auto`, so the block axis does clip — it must round up to a
whole baseline rather than take the raw extension.

### S3 — medium. Both new rules are contextual `:has()` container geometry

The architecture rejects this pattern explicitly. `validate-build.ts` asserts
`!css.includes("tbody tr:has(.bf-status-label) > td")` with the message
"Expected table density not to depend on a contextual status-label selector;
nested auxiliaries opt in explicitly." The two new rules change a container's
gap and padding because of a descendant's class — the same shape, in a
different component.

The practical cost is S1: because the behaviour lives on one container class,
it does not follow the button anywhere else. An explicit opt-in, or reserving
the extension on the button, would be both consistent with the stated principle
and more robust.

### S4 — low. The OS 9px gap is off the horizontal grid

`max(field-gap, (overflow × 2) + border)` resolves to 9px in OS, against a
0.25rem/4px inline unit. It is defensible as WCAG-derived rather than
design-derived, but Spec 020's axis-separation assertion will trip on it. Add
it to that spec's exemption list now, with the reason recorded, rather than
discovering it during 020.

### Standing

S1 should block acceptance: the package's own headline accessibility claim does
not hold in a first-class BF primitive, and the failure mode routes clicks to
the wrong control. S2 should be fixed with it, since both come from the same
container-scoped approach. S3 is the reason S1 and S2 exist and is worth
resolving structurally rather than patching each container. S4 is a note for
Spec 020.

Everything the package set out to do for the members themselves — circles,
stadiums, squares, keylines, ledger correctness, nested exclusion, tolerance —
is done and verified.

---

## Final S1–S4 remediation, 2026-09-02

The preceding Opus result is preserved as historical evidence. Its four
findings are now addressed without reopening the vertical contract.

**Chip ownership.** The owner moved `.bf-chip` from Field to the
Command/Action inset. Regular chips use `Action − real border`; nested chips
use the full Action inset because their border is inset paint. One-character
chips are therefore intentional stadiums in every tier, while badges remain
the exact circular-counter component. This migration does not conflate nearby
owners: status labels, the chip's exterior trailing space, and its internal
chip-to-badge gap remain Field-owned. The horizontal audit now places chips in
the Command bucket.

| Current one-character chip | Editorial | Documentation | App | OS |
|---|---:|---:|---:|---:|
| standalone | 41.03×37.11 | 39.90×22.48 | 39.90×22.48 | 38.77×23.83 |
| nested | 41.03×24 | 39.90×20 | 39.90×20 | 38.77×16 |

**Portable target clearance.** Every supported icon-only button owns its
inline target overflow as `margin-inline`; `.bf-actions` and `.bf-cluster`
retain their normal gap tokens. A wrapping container explicitly adds the
generic `is-icon-target-wrap` modifier, which reserves baseline-rounded block
clearance on each direct icon-only target. A clipping container independently
adds `is-icon-target-scrollport`, which reserves symmetric baseline-rounded
padding. Neither contract uses contextual container `:has()` inference; the
button's own `:not(:has(.bf-button-label))` remains the structural label-state
selector.

Supporting engines use `round(up, exact shortfall, active baseline)`. The safe
fallback reserves one baseline. The formula is not capped: the behavior gate
proves 4px clearance for a 1.4375rem body line and 8px for a 0.5rem body line,
both against a 0.25rem baseline. The five authored `24px` occurrences are
allowlisted only for the two target axes, inline overflow, wrapping-row block
clearance, and scrollport containment. The constant remains in CSS pixels
because WCAG 2.2 SC 2.5.8 defines it there.

**Verification hardening.** The behavior gate now forces wrapping in both
`.bf-actions` and `.bf-cluster`, then samples every 1px point inside each
24 CSS-pixel target in LTR and RTL. It also probes both logical scrollport
extremes, exact custom-config rounding, unchanged standalone block geometry,
the unsupported nested-icon boundary, Action-framed chip stadiums, Field-owned
chip-to-badge spacing, and a badge directly inside `bf-stack`. Static
validation rejects contextual `:has()` geometry on Action, Cluster, wrap, and
scrollport containers while permitting the button's own label-state selector.

Final evidence:

- `npm test`: exit 0; 19,048 static checks; every component baseline family
  reports zero failures; component behavior passes.
- `npm run qa:components`: exit 0 after fresh full-catalog captures; every
  baseline family reports zero failures.
- Live review at `http://127.0.0.1:4174/` confirms Command-framed chips,
  circular badges, centred square icon paint, and unchanged surrounding
  component rhythm. The final independent Sol pass also constructed a generic
  wrapping flex row in OS: two 16px paints exposed 24px targets at 28px
  vertical centre distance, with bottom/right probes routed to their owning
  controls.
- `git diff --check`: clean before this request was written.

The final independent adversarial pass signed off the implementation with no
substantive finding. Its low documentation findings were addressed here and in
the package: the current summary/counts now supersede historical claims, the
fifth normative `24px` use is enumerated, and the architecture wording rejects
only contextual container inference. The reviewer's concern that the 1px
interior sweep was merely documented was checked against
`assertExtendedPointerTarget`; `interiorSamples`/`interiorMisses` enforce the
full grid in source.

### Inline icon metric correction

The subsequent owner review exposed a separate default-text defect on the Icon
component page: `.bf-icon` used `vertical-align: bottom`, anchoring the icon box
to the line-box bottom rather than a font metric. Before the correction, the
new behavior fixture measured the default search, close, success-circle, and
error-circle icons about 5.04 CSS pixels below their intended cap-height centre
in Editorial.

The shared `--bf-inline-icon-baseline-shift` now follows Vanilla's actual
default-inline-icon rule: centre the default icon box on `1cap`, with half the
scalable border supplying the optical lift. Size modifiers add the difference
between the default and active sizes so every inline size keeps the same cap
centre. Sortable-table chevrons consume the shared default variable instead of
carrying a near-duplicate formula.

The first cap-centred draft revealed why paint and layout need separate
handling: in OS, the default icon met the compact body line at a raster edge and
grew successive lines fractionally; using the default-size shift for larger
icons also left their reserved blocks off phase. The final rule trims one
scalable border from the default icon's block-start layout margin and removes
that trim for every larger size. Flex, grid, and positioned component owners
neutralize the inline trim, retaining their exact cross-axis placement.
Absolutely positioned leading marks remain on their separate row-offset
contract.

Static validation rejects `vertical-align: bottom`, requires the shared formula,
active-size correction, line-box trim/reset boundaries, and both metric
consumers. The browser behavior gate measures five default icon fixtures in all
four tiers and both colour modes against live `1cap` and border geometry. The
full component-baseline catalog proves all default and larger Icon rows plus the
sortable-table fixture remain on phase. Focused evidence after the final change
is 19,279 green static checks, zero component-baseline failures, and a green
component-behavior run. Live feature-branch review confirms the circled check
and X align with their neighbouring default-size text in Editorial and OS.

### Middot inline-list separator correction

The subsequent screenshot review exposed three competing horizontal spacing
owners around each inline-list dot: a quarter-baseline pseudo-element margin,
a tier-dependent item margin, and ordinary HTML whitespace between
`inline-block` items. This made the dot visibly closer to the preceding label
than the following one and changed the imbalance with the active font/tier.

The `is-middot` modifier now owns one fixed
`--bf-inline-list-separator-space: 0.5rem`. A wrapping flex row removes source
whitespace from geometry, the pseudo-element uses that value on its logical
start, the flex column gap uses it after the dot, and middot items contribute
no trailing margin. Only non-final items generate a separator. The fixed rem
value is an inline composition fact, not a vertical-baseline multiple.

Static validation requires the single owner and rejects a second item margin.
The behavior gate resolves the value to 8 CSS pixels and verifies equal
before/after spacing in Editorial, Documentation, App, and OS, both colour
modes, and LTR/RTL. It also forces a 220px viewport and proves wrapped rows do
not overflow and keep the list's block size on the active baseline phase.
Fresh component captures keep every inline-list baseline check on phase.

<a id="opus-final-s1s4-request"></a>

## Opus adversarial re-review request — final S1–S4 pass, 2026-09-02

Please adversarially re-review the current
`feat/021-block-derived-inline-geometry` working tree. Treat every earlier
R1–R4 and S1–S4 section above as chronological evidence; the governing state
begins at [Final S1–S4 remediation](#final-s1s4-remediation-2026-09-02).

Use the feature-branch server at
`http://127.0.0.1:4174/demo/spec/spacing.html`, select **Horizontal padding**,
and scroll to **Horizontal — command inset**. The regular and borderless chips
must appear there, while **Horizontal — field and cell content inset** must
contain the status label and no chip. The direct audit route is
`http://127.0.0.1:4174/demo/spec/spacing-horizontal.html#horizontal-actions`.
Port 4173 currently serves an older checkout and visibly retains the obsolete
Field-bucket chip; do not use it as evidence for this branch. Please confirm
that this is server/check-out drift, not a missing feature-branch demo change.

Please independently probe:

- adjacent and forcibly wrapped icon-only targets in `.bf-actions`,
  `.bf-cluster`, and a generic flex/grid container carrying
  `is-icon-target-wrap`, including 1px hit routing in LTR and RTL;
- `is-icon-target-scrollport` at both logical extremes, independently of the
  wrap modifier, and the absence of any contextual container `:has()` rule;
- baseline-ceiling behavior for built-in tiers and custom body-line values of
  1.4375rem and 0.5rem, including the older-engine one-baseline fallback;
- unchanged standalone occupied/block geometry and continued production
  exclusion of bordered nested icon-only buttons;
- chips on the Command/Action inset while status labels, exterior chip spacing,
  and the internal chip-to-badge gap retain Field ownership; verify both the
  rendered bucket placement above and the computed padding in every tier;
- default inline search, close, success-circle, error-circle, and default-size
  icons centre on the live font cap height in every tier and tone; confirm the
  sortable-table chevron reuses the shared metric and line-box trim, every size
  modifier stays on baseline phase, structured flex/grid/positioned owners
  neutralize the inline trim, and absolute leading-mark placement is unchanged;
- middot inline lists render each separator with exactly `0.5rem` before and
  after it in every tier, without inline-block source whitespace or a second
  item-margin owner; confirm wrapping stays baseline-safe and logical spacing
  mirrors in RTL;
- direct-stack badge intrinsic sizing, DPR 1.5 border tolerance, five normative
  `24px` uses, all eight generated bundles, and consistency across source,
  architecture, contract, spec, tests, and current review records.

Current evidence: `npm test` exits 0 at 19,398 static checks, every component
baseline family reports zero failures, and component behavior passes. A fresh
`npm run qa:components` also exits 0 after recapturing the complete component
catalog. Re-run both commands independently rather than trusting these totals.

Opus: append the detailed result immediately below this request under
`## Opus adversarial re-review — final S1–S4 pass, 2026-09-02`. Then replace
`AGENT-INBOX.md` with a concise outcome and a direct link to that appended
section. Do not leave the detailed review only in the inbox. Do not merge,
push, publish, release, archive, or begin Spec 020.

<a id="opus-final-s1s4-result"></a>

## Opus adversarial re-review — final S1–S4 pass, 2026-09-02

Measured against the running feature-branch server on `127.0.0.1:4174` with
constructed probes in all four tiers, plus a sweep of 36 component demo pages.
Both gates were re-run independently rather than read from the record.
**Not merge-ready.** One high finding, one medium, three low. The members, the
inline target axis, the icon metric, and the middot separator are all correct
and independently reproduced. The block axis of the target contract is not.

### Server drift confirmed — it is not a missing branch change

Port 4173 is a second working copy, `h:\WSL_dev_projects\baseline-foundry`, on
`feat/019-tier-responsive-action-insets` at `d49bb40`. Port 4174 is
`H:\WSL_dev_projects\baseline-foundry-main-split-20260901` on
`feat/021-block-derived-inline-geometry` at `47b4ff4` plus the working tree.
Both Vite processes were identified by command line.

Fetching the same audit path from both ports and counting `class="bf-chip"`
between the section anchors:

| Port | Field bucket | Command bucket |
|---|---:|---:|
| 4173 | 4 | 0 |
| 4174 | 0 | 4 |

The rendered feature-branch page places the regular and borderless chip under
**Horizontal — command inset** and leaves **Horizontal — field and cell content
inset** with the status label and zero chips. The obsolete placement exists
only in the other checkout's source. Drift, not a missing change.

### Confirmed correct

**Chip ownership, rendered and computed, all four tiers.** Chip
`padding-inline` computes to 15px in every tier — the 1rem Action inset less
one border — and is byte-identical to `.bf-button`. The nested chip takes the
full 16px because its border is inset paint. Field ownership is intact
elsewhere: `margin-inline-end` 8/8/4/4, chip-to-badge `margin-inline-start`
8/8/4/4, status-label `padding-inline` 8/8/4/4.

**The inline target axis is genuinely portable.** Two adjacent
`.bf-button.is-link.is-icon` sampled at 1px steps across the intended 24px
target route the full 24px to their owner in `.bf-actions` and in
`.bf-cluster is-dense`, in every tier, with no cross-routing. Per-side
`margin-inline` resolves to 0/2/2/4px. This is the S1 fix and it holds.

**No collateral inline misalignment.** Sweeping every icon-only
`.bf-button.is-icon` across 24 component demos forced to the OS bundle, the
only non-zero margins are 0.08px on the demo page-chrome sequence links. No BF
surface loses a keyline to the overflow.

**Baseline ceiling and scrollport.** Wrap clearance and scrollport padding both
resolve to 4px at the built-in body lines, 4px at a custom 1.4375rem line
(0.5px shortfall rounded up), and 8px at 0.5rem — uncapped, as claimed.
Editorial resolves to 0. `is-icon-target-scrollport` alone, without the wrap
modifier, holds 24×24 for the in-view target at both logical scroll extremes in
LTR and RTL.

**Nested exclusion and direct-stack badge.** `.is-nested` icon-only buttons get
no alias, no `min-inline-size` and no margin at either selector. A badge
directly in `bf-stack` measures 24/20/20/16 exactly and grows for wider
content.

**Icon metric.** Default inline icons centre on the live cap height to within
0.55px in Editorial, 0.35px in Documentation and App, and 0.17px in OS — the
residual is the half-border optical lift, in the expected direction. The −1px
line-box trim never leaks: across 36 demo pages there is no `.bf-icon` with a
negative block-start margin in a flex, grid, or positioned owner. The sortable
chevron consumes the shared variable.

**Middot separator.** 8px before and 8px after the dot in every tier, mirrored
under `dir="rtl"`, forced wrapping produces 2–3 rows with no inline overflow
and a list block size still on the active baseline phase.

**Bundles and gates.** All eight generated bundles carry exactly five `24px`
occurrences. `npm test` exits 0 at 19,398 static checks with zero
component-baseline and zero behavior failures; `npm run qa:components` exits 0
after a full recapture. The totals in the request are accurate.

### F1 — high. The block axis has no adopters, and two shipped defaults regress

`is-icon-target-wrap` and `is-icon-target-scrollport` appear nowhere in
`demo/`, `examples/`, or any component template. Their only occurrences in the
repository are the rules that define them in `button-actions.ts`, six
assertions in `validate-build.ts`, and the fixtures the behavior gate
synthesises for itself. Every claim about them is proven against markup that
exists only inside the test.

That matters because both first-class primitives are wrap-capable by default
and one of them declares its own scrollport. Forcing a wrap and sampling the
first button's intended 24px target at 1px steps on the block axis:

| Container, no modifier | Editorial | Documentation | App | OS |
|---|---:|---:|---:|---:|
| `.bf-actions` centre distance | 32 | 28 | 28 | **20** |
| `.bf-actions` vertical span | 24 | 24 | 24 | **20** |
| `.bf-cluster is-dense` centre distance | 32 | 24 | 24 | **20** |
| `.bf-cluster is-dense` vertical span | 24 | 24 | 24 | **20** |
| generic flex row centre distance | 28 | 24 | 24 | **20** |

In OS the last 4px of the first button's target resolve to the *second*
button — the same wrong-action failure the previous pass raised as S1, moved
to the block axis. Adding the modifier fixes it: centre distance goes to 28 and
the span to 24 in every case.

`.bf-actions.is-nowrap` is worse, because it sets `overflow-x: auto` itself and
therefore computes `overflow-y: auto` and clips the pseudo-target:

| `.bf-actions.is-nowrap`, no modifier | Editorial | Documentation | App | OS |
|---|---:|---:|---:|---:|
| vertical target span | 24 | 20 | 20 | **16** |
| inline target span | 24 | 24 | 24 | 24 |

In OS the target is clipped back to the paint exactly. With
`is-icon-target-scrollport` added, all four tiers return 24.

Both cases were automatic at `c4dc987`. That build carried
`gap: max(var(--bf-field-gap), calc((var(--bf-action-target-overflow) * 2) + var(--bf-border-width)))`
on the actions group, which is a `gap` shorthand and therefore set `row-gap`
too — 9px in OS, a 25px centre distance — and
`padding: var(--bf-action-target-overflow)` on the nowrap group. The S3
remediation removed both and replaced them with opt-ins that nothing opts into.
For these two configurations the package is a net regression against its own
previous commit.

The S3 objection does not actually reach the fix. `:has()` was rejected because
a container was inferring geometry from a *descendant's* class. Giving
`.bf-actions.is-nowrap` the padding its own `overflow-x: auto` requires is
unconditional and self-referential — the same element declaring the consequence
of its own declaration — and so is a `row-gap` floor on a container that
declares `flex-wrap: wrap`. Neither needs `:has()`, and the existing
`contextualIconTargetHas` assertion would still pass.

If the owner prefers to keep the block axis opt-in, that is a defensible
position, but then three things have to change rather than nothing: the
scrollport reservation must return to `.is-nowrap` unconditionally, because a
consumer cannot be expected to know that a BF modifier clips a BF guarantee;
the demo catalog must carry at least one specimen of each modifier, since a
contract with no specimen is not a public contract; and the records must stop
describing adoption that has not happened. `AGENT-INBOX.md`, `docs/specs.md`,
and the Outcome section here all read as though wrapping and clipping
containers *do* opt in. See F4.

### F2 — medium. Documentation and App wrap at exactly zero clearance

With no modifier, a wrapped `.bf-cluster is-dense` and a generic 4px-gap flex
row put target centres exactly 24px apart in Documentation and App. The
integer sampler reports a clean 24px span, but the clearance is zero — the
exact-touch condition the previous pass rejected on the inline axis and fixed
there with one border width of positive separation. Subpixel layout, a
fractional device ratio, or any rounding change flips it into the OS failure
mode. Whatever resolution F1 takes should give the block axis the same positive
clearance the inline axis already has, rather than leaving two tiers balanced
on the boundary.

### F3 — low. The block-derived floor is inert for chips

Once `.bf-chip` moved to the Action inset it carries 30px of padding plus a
border before any content, which exceeds the painted block in every tier. The
`min-inline-size: var(--bf-square-block-size)` declaration only binds for a
chip with no content at all. Enumerating the chip as an alias consumer proves
emission, not behaviour. The Outcome section still presents "the Command/Action
inset plus the block-derived floor" as an active pair; for chips it is one
inset and a dormant declaration. Either say so, or drop the chip from the alias
and let the assertion enumerate what is really load-bearing.

### F4 — low. The records describe adoption that does not exist

`AGENT-INBOX.md` and `docs/specs.md` both present "wrapping and clipping
containers opt into generic `is-icon-target-wrap`/`is-icon-target-scrollport`
contracts" as completed work, and the Outcome section here says the same. F1
shows that no container in this repository opts in. The gate totals are now
consistent at 19,398 across the inbox and `docs/specs.md`; only the historical
Final S1–S4 remediation evidence list still carries the older 19,048, which is
correct as chronology but should not be read as current.

### F5 — low, and a note for Spec 020. One inline list, two axis rules

The middot fix correctly moved its separator to a fixed
`--bf-inline-list-separator-space: 0.5rem`, on the stated grounds that inline
composition should not be quantised by the vertical baseline. Its sibling in
the same rule block still uses
`margin-inline-end: calc(var(--bf-baseline) * 1.5)`, so a plain
`.bf-inline-list` separates items by 12px in Editorial and 6px everywhere else
while the middot variant is flat at 8px. Before this change both variants were
baseline-derived and at least consistent. Either finish the component or record
the plain variant explicitly in Spec 020's inventory, alongside the OS 9px gap
already noted as S4.

### Standing

F1 should block acceptance. The package's headline accessibility claim is real
and correct on the inline axis, but on the block axis it depends on two
modifiers that no BF container, demo, or example uses, and it regresses two
shipped default configurations against the immediately preceding commit. F2
should be resolved with it. F3 and F4 are record accuracy. F5 is a small
inconsistency this change introduced and is cheap to close either way.

Everything else the package set out to do — chip ownership, circles, stadiums,
squares, keylines, nested exclusion, portable inline clearance, cap-height icon
alignment, symmetric middot separators, baseline-ceiling rounding, bundle
coverage — is done and independently reproduced.

<a id="opus-f1f5-remediation"></a>

## Opus F1–F5 remediation, 2026-09-03

F1 and F2 are resolved by making the real built-in container states own the
geometry they create. Direct icon-only targets inside wrapping `.bf-actions`
and `.bf-cluster` rows receive the existing baseline-rounded block clearance
automatically. `.bf-actions.is-nowrap` receives the existing symmetric,
baseline-rounded containment because that modifier itself creates the clipping
scrollport. Documentation and App therefore have positive clearance rather
than exact-touch target boundaries. No selector infers descendant geometry
through contextual `:has()`.

The unadopted `is-icon-target-wrap` and `is-icon-target-scrollport` classes are
removed from generated CSS and from the public contract. Browser fixtures now
exercise only `.bf-actions`, `.bf-cluster`, and `.bf-actions.is-nowrap`; they do
not construct private success conditions with test-only opt-ins. They retain
the LTR/RTL 1px hit-routing sweep, forced wrap, both logical scroll extremes,
and custom baseline-ceiling cases.

F3 is resolved by removing chips from alias membership. After the
owner-directed Action-inset migration, every supported non-empty regular or
nested chip has an intrinsic padded width greater than its painted block, so
`min-inline-size: var(--bf-square-block-size)` could never govern rendered
geometry. Chip stadium behavior, Action ownership, Field-owned exterior and
badge gaps, target-size evidence, and fractional-raster coverage remain tested.

F4 is resolved in the current status, outcome, architecture, spec, plan,
research, tasks, quickstart, contract, catalog, and live handoff. Earlier
review sections retain the obsolete classes only as chronological evidence of
the implementation Opus reviewed.

F5 is resolved without entering Spec 020: plain and middot inline lists now
share one local `--bf-inline-list-space: 0.5rem` inline-composition fact. Plain
items use it as their trailing space. The middot row uses it both before and
after the separator while preserving its wrapping flex layout, logical RTL
mirroring, and baseline-safe block behavior.

Final evidence after the repair is `npm test` green at 19,419 static checks
with zero component-baseline and behavior failures, plus green
`npm run qa:components` after a fresh full recapture.

<a id="opus-f1f5-rereview-request"></a>

## Opus adversarial re-review request — F1–F5 remediation, 2026-09-03

Please adversarially re-review the current working tree on
`feat/021-block-derived-inline-geometry`. Branch HEAD `47b4ff4` is the reviewed,
failing baseline; the uncommitted working diff is the F1–F5 remediation, so do
not review HEAD alone. Treat the prior final S1–S4 review as historical evidence
and begin from
[Opus F1–F5 remediation](#opus-f1f5-remediation).

Independently establish whether:

- real `.bf-actions` and `.bf-cluster` production selectors provide directly
  hittable, positively separated 24px targets after wrapping in all four tiers,
  both directions, and fractional rasterisation;
- `.bf-actions.is-nowrap`, with no extra modifier, prevents clipping at both
  logical scroll extremes while preserving expected keylines and overflow;
- the deliberate baseline-phased reservation on direct icon targets does not
  move their paint or keylines or disturb non-icon compositions; separately
  identify any material single-row container-footprint change rather than
  treating automatic clearance as geometrically free;
- the removed opt-in class names and chip alias consumption are absent from
  generated output and current source-of-truth records;
- chip Action geometry and badge block-derived geometry still pass every shape,
  overflow, nested, and target-size requirement;
- plain and middot inline lists both resolve to fixed 0.5rem inline spacing,
  while middot before/after symmetry, RTL mirroring, forced wrapping, and
  baseline phase remain intact;
- current governing records, including `TODO.md`, describe automatic built-in
  ownership rather than the removed opt-in API;
- exactly five normative `24px` uses remain in each generated bundle and all
  eight bundle variants agree; and
- `npm test` and `npm run qa:components` pass independently.

Append the detailed verdict immediately below this request under
`## Opus adversarial re-review — F1–F5 remediation, 2026-09-03`, and replace
`AGENT-INBOX.md` with the concise result and a direct link. Do not merge, push,
publish, release, archive, or begin Spec 020.

<a id="opus-f1f5-verdict"></a>

## Opus adversarial re-review — F1–F5 remediation, 2026-09-03

Measured against the uncommitted working tree on
`feat/021-block-derived-inline-geometry` (HEAD `47b4ff4` plus the F1–F5 diff),
with constructed probes in all four tiers and a sweep of all 74 component demo
pages in all four tiers. Both gates were re-run from a clean rebuild rather
than read from the record.

**Not merge-ready, but the blocking finding is gone.** F1, F2, F3, F4 and F5
are all genuinely resolved and independently reproduced. The fix, however,
charges its accessibility allowance to container geometry that does not need
it, and in one primitive it moves the control it was protecting. Two new
medium findings, four low. Both mediums have measured, cheaper alternatives
that keep every guarantee this pass verified.

### F1 — resolved. Real production selectors now own the block axis

Two adjacent `.bf-button.is-link.is-icon` in an unmodified `.bf-actions` and an
unmodified `.bf-cluster.is-dense`, forced to wrap, sampled at 1px steps down
the first button's intended 24px target column:

| Container, no modifier | Editorial | Documentation | App | OS |
|---|---:|---:|---:|---:|
| samples routed to own control | 24 | 24 | 24 | 24 |
| samples routed to the other control | 0 | 0 | 0 | 0 |
| `.bf-actions` target-box clearance | 8px | 12px | 12px | 4px |
| `.bf-cluster is-dense` target-box clearance | 8px | 8px | 8px | 4px |

The OS wrong-action failure is gone. `is-icon-target-wrap` and
`is-icon-target-scrollport` are absent from all eight generated bundles, and
`validate-build.ts` now asserts their absence rather than their content.

`.bf-actions.is-nowrap` with no extra modifier returns 24 vertical and 24
inline hits for the in-view target at both logical scroll extremes, in LTR and
in RTL, in all four tiers. `overflow-y` still computes to `auto`; the new
`padding-block` absorbs it.

### F2 — resolved. No exact-touch condition remains

The smallest positive block clearance between adjacent target boxes is 4px, in
OS, in both primitives. Documentation and App are at 8–12px. Editorial needs
none and correctly reserves zero, because its 24px painted block already
satisfies the criterion. The clearance is computed from `--bf-body-line-height`
while the painted block is the line box plus padding and borders, so the
reservation is structurally over-provisioned rather than balanced on the
boundary. Confirmed unchanged under a forced fractional device scale.

### F3 — resolved. The chip alias is gone, not merely quiet

`.bf-chip` computes `min-inline-size: auto` in all four tiers. The alias
re-point, the declaration, the contract-matrix rows, the `expectedSquareAliases`
entry and the `expectedSquareConsumers` entry are all removed, and a new
`assertRuleMissingDecl` guards re-introduction. One- through four-character
chips remain unclipped stadiums with the 15px Action inset in every tier.

### F4 — resolved

`TODO.md`, `docs/specs.md`, `docs/component-spacing-architecture.md`, the
contract matrix, `spec.md`, `plan.md`, `research.md`, `quickstart.md` and the
inbox all describe automatic built-in ownership. The only surviving mentions of
the removed classes are the earlier review sections, which are chronology, and
one `tasks.md` line that explicitly marks them as subsequently removed. Gate
totals read 19,419 consistently.

### F5 — resolved

Plain and middot inline lists both resolve to exactly 8px between items in all
four tiers. The middot row carries `column-gap: 8px`, items carry no trailing
margin, and the separator carries `margin-inline-start: 8px`, so the space
before and after the dot is symmetric. Under `dir="rtl"` the logical gap
mirrors at 8px in every tier. Forced wrapping produces three rows with zero
inline overflow and a list block size still on the active baseline phase.

### Also confirmed

**The inline icon trim does not leak.** Sweeping every `.bf-icon` on all 74
component demo pages in all four tiers, the only non-zero block-start margin in
a flex, grid, or positioned owner is `.bf-media-object-meta .bf-icon`, which
carries its own pre-existing positive `--bf-body-nudge-start` and fully
replaces the trim. The three new `margin-block-start: 0` neutralisers cover the
rest.

**Bundles and gates.** All eight bundles carry exactly five normative `24px`
uses and agree. `npm test` exits 0 at 19,419 static checks with zero
component-baseline and zero behavior failures; `npm run qa:components` exits 0
after a full recapture. The totals in the request are accurate.

### N1 — medium. The nowrap scrollport charges every strip, including strips with no target

`.bf-actions.is-nowrap` now sets `padding-block` and `padding-inline`
unconditionally. The one shipped specimen of that modifier,
`demo/components/actions.html` "Scrollable strip", contains five text buttons
and no icon target at all. Measured on that configuration:

| `.bf-actions.is-nowrap`, text buttons only | Editorial | Documentation | App | OS |
|---|---:|---:|---:|---:|
| occupied block, before | 39.97 | 23.98 | 23.98 | 23.97 |
| occupied block, after | 39.97 | 31.98 | 31.98 | 31.97 |
| first control's inline inset from the group box | 0 | **4** | **4** | **4** |
| same measurement on plain `.bf-actions` | 0 | 0 | 0 | 0 |

So in three of four tiers a scroll strip grows by two baselines and its first
control stops starting on the group's own leading keyline, purely because the
modifier exists. Nothing on that row can be clipped, because nothing on it has
an out-of-flow extension. This is the mirror image of the objection F1 raised:
there the guarantee was opt-in and nobody paid; here everybody pays, including
compositions with no target.

Neither gate can see it. `verify-component-baselines` passes because 32px is
still on the 4px grid, and the QA screenshots are written to gitignored
`tmp/screenshots/`, so "green after a full recapture" is a re-render, not a
visual-regression signal.

The allowance is also not necessary in that form. Overriding the specimen to
`padding: 0` and moving the same rounded clearance onto the direct icon-only
target as `margin-block`, the scrollport still returns 24 vertical and 24
inline hits at both logical extremes in LTR and RTL in all four tiers, the
group grows only when it actually contains a target (28px in Documentation and
App, 24px in OS), and the leading keyline is preserved. The target's existing
`margin-inline` already contributes to `scrollWidth`, so the inline half of the
padding is redundant too. That is self-referential, needs no `:has()`, and
keeps the `contextualIconTargetHas` assertion passing.

### N2 — medium. `.bf-cluster` moves the control it is protecting

`.bf-cluster` is `align-items: flex-start`, so a `margin-block-start` on a
direct child is a paint move, not a reservation. With the canonical
label-plus-icon composition — a `<span>` and a `.bf-button.is-link.is-icon` in
one cluster — the icon's border box now sits below its sibling's:

| icon top minus sibling top | Editorial | Documentation | App | OS |
|---|---:|---:|---:|---:|
| before the remediation | 0 | 0 | 0 | 0 |
| after the remediation | 0 | **4** | **4** | **4** |

`.bf-actions` is unaffected because it centres and the start/end margin
difference is unchanged. The remediation section and
`docs/component-spacing-architecture.md` both state that the reservation does
not move paint or keylines; for `.bf-cluster` that is measurably false in three
of four tiers. The demo catalog hides it only because the single cluster
adopter in the whole repository is the demo page chrome's
`bf-cluster pc-sequence`, which contains nothing but the two icon links.

The alternative F1 itself offered closes both N1 and N2 at once. A `row-gap`
floor on a container that already declares `flex-wrap: wrap` is
self-referential, not descendant inference, and it was only rejected before
because `c4dc987` wrote it as the `gap` shorthand. Overriding both primitives to
drop the child block margins and take
`row-gap: max(--bf-cluster-space, round(up, max(0rem, calc(24px - var(--bf-body-line-height) + var(--bf-border-width))), var(--bf-baseline)))`:

| row-gap floor variant | Editorial | Documentation | App | OS |
|---|---:|---:|---:|---:|
| resolved floor | 8px | 8px | 8px | 12px |
| wrapped: samples routed to own control | 24 | 24 | 24 | 24 |
| wrapped: samples routed to the other control | 0 | 0 | 0 | 0 |
| wrapped: target-box clearance | 18.9 | 5.5 | 5.5 | 4.2 |
| icon top minus sibling top | 0 | 0 | 0 | 0 |
| single-row occupied block change | 0 | 0 | 0 | 0 |

Same guarantee, no paint move, and free on a single row because `row-gap` has
no effect when there is only one line.

### N3 — low. Single-row footprint, as the request asked to have identified separately

Because the clearance is a child margin rather than a row gap, it applies on
rows that cannot wrap into anything. A single-row `.bf-actions` holding one
text button and one icon-only button grows from 23.98px to 27.98px in
Documentation and App; the chrome's `bf-cluster pc-sequence` grows from 23.98px
to 31.98px in Documentation, App and OS. Both remain on the baseline grid, so
no gate objects. On a single row this buys nothing: there is no adjacent row to
overlap. N2's row-gap variant removes the cost entirely.

### N4 — low. Two records now overstate what the rule leaves alone

The `validate-build.ts` message for the clearance rule still reads "without
changing standalone occupied geometry", and
`docs/component-spacing-architecture.md` reads "without changing standalone
control geometry". The control's own paint is indeed unchanged, but the
container's occupied box is not (N3), and in `.bf-cluster` the control's
position relative to its siblings is not (N2). Both sentences were written for
the opt-in design and were true there.

### N5 — low. The block-axis contract still has no BF specimen

Across all 74 component demo pages in all four tiers, the only element matching
the new rule anywhere in the repository is `bf-cluster pc-sequence` in the demo
page chrome, which the behavior gate explicitly excludes from hit testing. No
BF component, pattern, or example shows a wrapping `.bf-actions` or
`.bf-cluster` carrying icon-only targets. Making the contract automatic removes
the risk that a consumer forgets a modifier, which was F1's main point, but it
does not create the browser-reviewable specimen F1 also asked for. That matters
more now, not less, because the behaviour is unconditional.

### N6 — low, and still a note for Spec 020. `0.5rem` is a literal, not a token

`--bf-inline-list-space: 0.5rem` is hard-coded in `list.ts`. It equals
`--bf-space-1` in Editorial (8px) but is double it in Documentation, App and OS
(4px), so the inline list is now the only component whose inter-item space is
tier-invariant and expressed as a raw length. The reasoning — inline
composition should not be quantised by the vertical baseline — is sound, and
the plain/middot inconsistency F5 raised is genuinely closed. But this is a new
authored horizontal fact outside the token vocabulary, and Spec 020's
quantisation audit will have to classify it alongside the WCAG-derived margins.
Worth recording that the plain variant moved in both directions: 12px to 8px in
Editorial, 6px to 8px elsewhere. Separately, `.bf-inline-list.is-middot` is now
`display: flex`, which blockifies its items and replaces text-baseline
alignment with the flex cross-axis default; single-line items measure
identically, but mixed-height item content will no longer baseline-align.

### Standing

F1–F5 are closed. Nothing in the original block-axis defect survives: the real
production selectors carry the guarantee, in all four tiers, both directions,
both scroll extremes, and under fractional rasterisation, with positive rather
than exact-touch separation everywhere.

N1 and N2 should be resolved before acceptance, not because the guarantee is
wrong but because the delivery mechanism spends geometry the guarantee does not
need and, in `.bf-cluster`, breaks the sibling keyline it was meant to leave
alone. Both are one rule each, and both alternatives above were measured on
this working tree rather than reasoned about. N3 and N4 travel with them. N5
and N6 are small and can be closed either way, but should be closed
deliberately rather than inherited into Spec 020.

Probe scripts and raw measurements for this pass are in gitignored
`tmp/opus-f1f5-probe*.ts` and `tmp/probe*.json`.

<a id="opus-n1n6-remediation"></a>

## Opus N1–N6 remediation, 2026-09-04

The two measured alternatives from the F1–F5 re-review now replace the
collateral delivery mechanism.

- **N1:** `.bf-actions.is-nowrap` no longer owns unconditional padding. A
  direct icon-only target in that scrollport owns its symmetric block margins;
  its existing inline margins provide the logical-end scroll extent. The
  shipped text-only strip therefore keeps zero container padding, its original
  occupied block, and a zero leading-keyline offset in LTR and RTL, while icon
  targets still route all 24-by-24 CSS-pixel samples at both scroll extremes.
- **N2–N4:** direct-child wrap margins are gone. Wrapping `.bf-actions` and
  `.bf-cluster` instead take a container-owned, baseline-rounded `row-gap`
  floor derived from the target shortfall. It cannot move a child relative to
  its sibling and has no effect on a one-line container. The validation and
  architecture wording now make that narrower guarantee.
- **N5:** `demo/components/actions.html` contains visible constrained Action
  and Cluster wrap specimens with real direct icon-only targets. The demo
  contract, behavior gate, baseline gate, and component capture all exercise
  them.
- **N6:** `.bf-inline-list.is-middot` now declares `align-items: baseline`, so
  mixed-height items retain their text baseline. The shared
  `--bf-inline-list-space: 0.5rem` remains intentionally provisional: Spec 021
  records it as a component-local horizontal-composition fact which Spec 020
  must replace with its canonical token, rather than inventing that token in
  this feature.

The modern row floor is
`round(up, max(0rem, calc(24px - var(--bf-body-line-height) + var(--bf-border-width))), var(--bf-baseline))`;
the fallback is one active baseline. Focused probes cover the resolved 4px row
floor and 4px nowrap edge allowance at a 1.4375rem body line, then 20px and 8px
respectively at a 0.5rem body line. The same probes verify positive inter-row
clearance and no cross-routing in every tier, both directions, while a
label-plus-icon cluster retains a zero block-start delta.

Final evidence after this repair is `npm test` green at 19,513 static checks,
with every component-baseline and behavior family passing, followed by
`npm run qa:components` green after a clean rebuild and fresh complete capture.
The Actions demo capture was visually reviewed: the real Action and Cluster
fixtures wrap without clipping or sibling displacement, and the text-only
scroll strip retains its keyline.

No commit, merge, push, publication, release, archive, or Spec 020 work was
performed.

<a id="opus-n1n6-rereview-request"></a>

## Opus adversarial re-review request — N1–N6 remediation, 2026-09-04

Please adversarially re-review the complete uncommitted diff on
`feat/021-block-derived-inline-geometry`. Its HEAD, `47b4ff4`, is the old
failing baseline; the working tree contains the entire Spec 021 implementation
and all subsequent remediation. Do not infer correctness from the record or
from passing tests: reproduce the rendered and generated behavior.

Required checks:

1. On the shipped text-only `.bf-actions.is-nowrap` specimen, verify zero
   container padding, unchanged occupied block, and zero leading-keyline offset
   in all four tiers in LTR and RTL. On a nowrap strip with icon targets,
   verify 24-by-24 hit routing at both logical scroll extremes in both
   directions, with no clipping or wrong-target region.
2. Verify that wrapping `.bf-actions` and `.bf-cluster` have no direct-target
   block margins, use the calculated `row-gap` floor, and preserve zero
   block-start delta in a mixed label-plus-icon cluster. Confirm no one-line
   footprint growth.
3. Independently measure the custom-rounding cases: body line 1.4375rem must
   resolve to a 4px row floor and 4px nowrap per-edge allowance; body line
   0.5rem must resolve to 20px and 8px respectively. Across all tiers and both
   directions, wrapped targets must have positive clearance, route all 24
   block-axis samples to their owning controls, and route none across rows.
4. Review the real constrained Action and Cluster specimens on
   `demo/components/actions.html`. Confirm they render, wrap, remain on phase,
   and are exercised by demo-contract, behavior, baseline, and screenshot QA.
5. Verify middot lists declare baseline cross-axis alignment while retaining
   8px symmetric logical spacing, clean wrapping, RTL mirroring, and baseline
   phase. Check that the raw half-rem value is consistently classified as a
   provisional Spec 020 input rather than a completed canonical token.
6. Confirm all eight generated bundles still contain exactly five normative
   `24px` uses and agree; recheck that every original F1–F5 guarantee and the
   other member geometry remain closed.
7. Re-run `npm test` and `npm run qa:components` from a clean rebuild. Compare
   evidence, not merely exit codes or check totals.

Append the verdict below under
`## Opus adversarial re-review — N1–N6 remediation, 2026-09-04`, then replace
`AGENT-INBOX.md` with a concise outcome that links to it. Do not commit, merge,
push, publish, release, archive, or begin Spec 020.

<a id="opus-n1n6-verdict"></a>

## Opus adversarial re-review — N1–N6 remediation, 2026-09-04

Measured against the uncommitted working tree on
`feat/021-block-derived-inline-geometry` after `npx tsx scripts/clean.ts` and a
full rebuild, with constructed probes in all four tiers and both writing
directions, plus a sweep of all 74 component demo pages in all four tiers.

**N1–N6 are resolved and the delivery mechanism is now correct.** Every measured
claim in the remediation section reproduces. Nothing in the accessibility
guarantee regressed while removing the collateral. The remaining findings are
one governing record that states a condition the CSS does not have, and one
undisclosed trade. No blocking geometry defect. One medium, three low.

### N1 — resolved. The scrollport no longer charges strips that have no target

The shipped text-only specimen, measured in all four tiers in LTR and RTL:

| `.bf-actions.is-nowrap`, text buttons only | Editorial | Documentation | App | OS |
|---|---:|---:|---:|---:|
| `padding-block` / `padding-inline` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| occupied block | 39.97 | 23.98 | 23.98 | 23.97 |
| first control's offset from the group box | 0 | 0 | 0 | 0 |

Those block sizes are the pre-spec figures. `validate-build.ts` now guards the
absence with two `assertRuleMissingDecl` calls rather than only asserting what
is present, which is the right shape for a negative contract.

A nowrap strip that does carry targets still holds the guarantee. Three
link-style icon buttons in `.bf-actions.is-nowrap`, sampled at 1px steps at both
logical scroll extremes, in LTR and RTL, in all four tiers: 24 vertical hits,
24 inline hits, **zero** samples routed to a wrong target, container padding 0,
`overflow-y` still `auto`. The strip grows only when it contains a target — 28px
in Documentation and App, 24px in OS, 24px in Editorial. A mixed strip pairing a
tall framed button with an icon target was also scrolled into view and measured:
24 vertical hits with 4–8px of clearance above and below the target inside the
scrollport, no clipping.

### N2 — resolved. No child paint moves

The canonical composition N2 was raised on — a `<span>` label and a
`.bf-button.is-link.is-icon` in one `.bf-cluster`:

| icon top minus sibling top | Editorial | Documentation | App | OS |
|---|---:|---:|---:|---:|
| at the F1–F5 pass | 0 | 4 | 4 | 4 |
| now | 0 | 0 | 0 | 0 |

`margin-block-start` on the target computes to `0px` in every tier and every
container. The separation is entirely container-owned.

### N3 — resolved. Single rows cost nothing

A single-row `.bf-actions` holding one text button and one icon-only target
measures 39.97 / 23.98 / 23.98 / 23.97 px — identical to the figures before any
block-axis work. `row-gap` has no effect on a one-line flex container, which is
the whole point of the mechanism.

### The wrapping guarantee itself still holds

The two shipped specimens on `demo/components/actions.html`, forced to wrap by
their constrained inline size, in all four tiers and both directions:

| shipped wrap specimen | Editorial | Documentation | App | OS |
|---|---:|---:|---:|---:|
| resolved `row-gap` | 8 | 8 | 8 | 12 |
| child `margin-block-start` | 0 | 0 | 0 | 0 |
| target-box clearance between rows | 8 | 4 | 4 | 4 |
| samples routed to own control | 24 | 24 | 24 | 24 |
| samples routed to the other control | 0 | 0 | 0 | 0 |

### N5 — resolved, and covered by four gates

`demo/components/actions.html` now carries a visible Action specimen and a
Cluster specimen, each with two real `.bf-button.is-link.is-icon` children and
no opt-in class. They are exercised by `validateActionsDemo` in the demo
contract, by the behavior gate in both directions with a `centreDistance >= 24 +
borderWidth` assertion plus `assertExtendedPointerTarget`, by the baseline gate
(`actions` rose to 23 checks per tier), and by the screenshot capture. This is
the browser-reviewable surface N5 asked for.

### N6 — resolved

`.bf-inline-list.is-middot` computes `align-items: baseline`. In all four tiers
and both directions: `column-gap` 8px, item `margin-inline-end` 0, separator
`margin-inline-start` 8px, measured logical inter-item gap 8px, plain variant
also 8px. Forced wrapping gives four rows with zero inline overflow and list
block sizes on the active baseline phase (111.95 / 91.95 / 91.95 / 83.95 px). A
deliberately oversized item on the same list keeps a text-bottom delta
consistent with shared-baseline alignment rather than cross-axis stretch. The
half-rem value is classified as provisional Spec 020 input in `TODO.md`,
`docs/specs.md`, `spec.md`, and the architecture doc.

### Custom rounding — claims verified

The floor resolves through `max()`, so it has to be read against a container
whose authored gap is smaller than the floor. At `--bf-body-line-height:
1.4375rem` with `--bf-baseline: 0.25rem`, the OS `.bf-actions` applied row-gap
is 4px, which pins the floor at 4px, and the nowrap per-edge allowance is 4px in
every tier. At a 0.5rem body line the applied row-gap is 20px in every tier and
the allowance is 8px. Both formulas round their exact shortfalls without a
one-baseline cap, exactly as stated.

### F1–F5 still closed

Two adjacent link-style icon targets on a single row of `.bf-actions` and of
`.bf-cluster is-dense` route 24 of 24 inline samples to their own control with
zero cross-routing, in all four tiers, LTR and RTL. `.bf-chip` computes
`min-inline-size: auto` with no matching rule anywhere in the cascade, remains
an unclipped stadium in every tier. All eight generated bundles carry exactly
five normative `24px` uses, agree with each other, and contain zero occurrences
of `is-icon-target`. `npm test` exits 0 at 19,513 static checks with zero
component-baseline and zero behavior failures; `npm run qa:components` exits 0
after a clean rebuild and full recapture.

### M1 — medium. `spec.md` states a condition the selector does not have

`spec.md` reads:

> The two built-in wrapping primitives automatically apply a baseline-rounded
> row-gap floor **when they carry direct icon targets**.

They do not. The rules are `:where(.bf-actions:not(.is-nowrap))` and
`:where(.bf-cluster:not(.is-nowrap))` with no descendant condition, and they
could not have one without the `:has()` this package forbids. Measured
directly: a `.bf-cluster is-dense` containing only chips resolves `row-gap` to
8px in Documentation and App and 12px in OS.

`docs/component-spacing-architecture.md` states the truth — "unconditional
behavior of containers that already declare wrapping" — as do `plan.md` and the
contract matrix. So the governing records now contradict each other on the one
point F4 and N4 already had to be raised about twice. Delete the clause.

### M2 — low, but it is a trade the records do not disclose

The floor exceeds the authored gap token in these cases, so it changes the row
rhythm of wrapping containers that hold no icon target at all:

| container `row-gap`, before → after | Editorial | Documentation | App | OS |
|---|---|---|---|---|
| `.bf-actions` | 8 → 8 | 8 → 8 | 8 → 8 | **4 → 12** |
| `.bf-cluster` | 16 → 16 | 8 → 8 | 8 → 8 | **8 → 12** |
| `.bf-cluster.is-dense` | 8 → 8 | **4 → 8** | **4 → 8** | **4 → 12** |

Sweeping all 74 component demo pages in all four tiers, using `row-gap !=
column-gap` as an exact test for the floor having bound, the real blast radius
is small: two multi-row `bf-section is-shallow bf-cluster` containers in
`form-atlas.html` in OS, 8px → 12px, neither holding an icon target. Sixteen
further containers diverge but are single-row, where `row-gap` is inert. The
only other multi-row hits are the new `actions.html` specimens, which need it.
The 87 `bf-cluster pc-controls` divergences are the demo chrome's own local
`row-gap` and predate this work.

It is still a trade. An OS wrapping dense cluster of chips now has triple its
former row rhythm because a `.bf-button.is-icon` might be present, and `AGENTS.md`
lists `bf-cluster` among the primitives that "stay small and composable" while
its row rhythm is now governed by a WCAG button constant emitted from
`button-actions.ts`. Given the alternatives are a paint move or `:has()`, this
is the right call — it is container-owned, on-grid, and inert on single rows.
But the architecture doc two paragraphs earlier still reads "ordinary container
gap tokens remain unchanged" and the matrix reads "container gaps remain
token-owned"; both were written for the inline allowance and now sit directly
above the paragraph that raises the row gap. One sentence saying the floor can
exceed the authored gap on wrapped containers, including ones with no targets,
closes it honestly.

### M3 — low. The QA route has no case that shows the change

`quickstart.md` asks that the floor "must not move either target's paint or cost
a single-row layout". Both are true and both reproduce. Neither is the case
where the change is visible. There is no route directing a reviewer at a wrapped
cluster with no icon targets, which is the only configuration M2 affects.

### M4 — low. `.bf-cluster.is-nowrap` is a scope boundary worth recording

It gets no row-gap floor, correctly, because it cannot wrap; and no target
margins, because that rule is scoped to `.bf-actions.is-nowrap`. It declares no
overflow of its own, so nothing clips today, and its two uses in `chip.html` and
`spacing-vertical.html` hold no icon targets. But an icon target inside
`.bf-cluster.is-nowrap`, or inside any other scrolling BF ancestor, has no block
allowance. Better recorded as a known boundary than rediscovered.

### Standing

N1–N6 are closed. The mechanism is now cheaper and more truthful than either of
its two predecessors: no consumer pays for an allowance it does not use on a
single row, no control moves relative to its siblings, the text-only scroll
strip is byte-identical to its pre-spec geometry, and the block-axis guarantee
finally has a visible specimen carried by four gates.

M1 should be corrected before acceptance: it is one clause, and it misstates a
public contract in the direction that hides M2. M2, M3 and M4 are disclosure and
routing, not geometry. With those four sentences written, this package is ready
for owner acceptance from my side.

Probe scripts and raw measurements for this pass are in gitignored
`tmp/opus-n1n6-probe*.ts` and `tmp/n1n6*.json`.

<a id="opus-final-record-corrections"></a>

## Opus final record corrections, 2026-09-04

- **M1:** `spec.md` now states that the row-gap floor applies regardless of
  descendants; the nonexistent direct-icon condition is removed.
- **M2:** the architecture, plan, and contract matrix disclose that the
  descendant-agnostic floor can exceed an authored row gap even when a wrapped
  container has no target. The measured current impact—two multi-row OS
  form-atlas clusters changing from 8px to 12px—is recorded.
- **M3:** `quickstart.md` now routes visual QA through that OS form-atlas case
  and states the expected 12px, on-grid result.
- **M4:** the spec, architecture, matrix, and quickstart record that
  `.bf-cluster.is-nowrap` is not a clipping scrollport and receives no automatic
  block-axis containment. A future clipping owner outside
  `.bf-actions.is-nowrap` must provide and verify its own allowance.

These are record-only corrections after Opus accepted the geometry. No CSS or
runtime behavior changed. `npm run test:build` remains green at 19,513 checks;
the previously completed `npm test` and fresh `npm run qa:components` remain
the final rendered evidence. The package is ready for owner acceptance, but no
commit, merge, push, publication, release, archive, or Spec 020 work is implied.

## Mainline integration, 2026-09-04

The owner accepted Spec 021 and directed its merge into `main`. The feature
commit `54147e7` was merged with `main` at `221c301`; the only textual conflict
was the live inbox, where both the Spec 021 closeout and the already-landed
cross-repository token handoff were preserved.

The integrated tree passes `npm test` with 19,500 static checks, every
component-baseline family green, and component behavior verification green.
The count differs from the feature-only 19,513 because the intervening mainline
work changed the audit cardinality; no assertion or behavior failure remains.
`npm run qa:components` also passes after a fresh complete screenshot capture.
No publication or release was performed.

The accepted package was then moved to
`docs/spec-archive/021-block-derived-inline-geometry/` in the post-merge
closeout. The active catalog now has no numbered BF package.
