# Review: Block-derived inline geometry

**Status**: Recommended R1/R3/R4 resolutions and independent adversarial
hardening implemented on `feat/021-block-derived-inline-geometry`; final gates
are green at 9,947 static checks plus fresh component QA. Fresh Opus
adversarial re-review and acceptance are pending.

## Outcome

Spec 021 implements one cascade-repointed `--bf-square-block-size` contract for
chips, badges, bare icon buttons, specialized notification-close actions, and
bare numbered pagination. Each state maps to the component's own painted block,
not an occupied ledger. Chips retain their Field inset plus the block-derived
floor; badges own the exact circular-counter case. Wider chip/badge content
grows into a stadium. Link-style icon buttons resolve from their body-line
paint; labelled actions remain on the Action inset.

Icon-only actions keep naturally dense token-derived paint and gain a direct
24-by-24 CSS-pixel pointer target through an out-of-flow transparent
`::after`. The extension changes no painted or occupied block measurement. The
24px constant is normative WCAG target geometry, not a BF spacing token.
Supported `.bf-actions` groups reserve positive clearance between adjacent
link-icon targets, and the nowrap scrollport reserves transparent padding so it
cannot clip the extension.

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

## Rendered before and after

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
