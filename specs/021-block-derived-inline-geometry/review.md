# Review: Block-derived inline geometry

**Status**: Re-review follow-up on `feat/021-block-derived-inline-geometry`;
R1/R2 resolved, R3/R4 owner decisions and final closeout gates pending

## Outcome

Spec 021 implements one cascade-repointed `--bf-square-block-size` contract for
chips, badges, bare icon buttons, specialized notification-close actions, and
bare numbered pagination. Each state maps to the component's own painted block,
not an occupied ledger. Wider chip/badge content retains token-derived padding
and grows into a stadium. Link-style icon buttons resolve from their body-line
paint; labelled actions remain on the Action inset.

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
| one-character chip, after | 37.12×37.11 | 22.48×22.48 | 22.48×22.48 | 23.84×23.83 |
| nested one-character chip, before | 23.03×24 | 21.91×20 | 13.91×20 | 12.78×16 |
| nested one-character chip, after | 24×24 | 20×20 | 20×20 | 16×16 |
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
Fitting chip glyphs are centred to within 0.51px in standalone, nested, and
borderless states.

The former chip padding put Documentation's one-character intrinsic width at
23.90px against a 22.48px painted block, so a minimum alone could not produce a
circle. The implementation keeps overflow padding token-derived but subtracts
one additional border unit on each edge and centres the content. That ends the
chip's former Field-keyline claim consistently with its new block-derived
classification; it is the implementation-level visual choice requiring owner
acceptance.

## Target-size disposition

The approved WCAG 2.2 SC 2.5.8 dispositions were applied from measurement, not
assumption.

| Changed target | Editorial | Documentation | App | OS |
|---|---:|---:|---:|---:|
| interactive standalone fitting chip | direct | spacing | spacing | spacing |
| table-hosted interactive nested chip | direct | spacing | spacing | spacing |
| regular standalone icon | direct | spacing | spacing | spacing |
| link-style icon | direct | spacing | spacing | spacing |
| notification close | direct | direct | spacing | direct |
| numbered pagination | direct | spacing | spacing | spacing |
| smallest chip target-centre distance | 61.12 | 42.14 | 34.48 | 35.84 |
| smallest icon-family target-centre distance | 41.95 | 26.78 | 26.78 | 24.39 |
| notification target-centre distance | 78.26 | 60.85 | 57.17 | 47.31 |
| smallest pagination target-centre distance | 45.12 | 30.48 | 30.48 | 27.84 |

“Direct” means an axis-aligned 24×24px square fits wholly inside the actual
target shape. This matters for App's 24×24 notification close: its 2px rounded
corners make it undersized, so it uses spacing rather than being misreported as
a direct pass. “Spacing” is proven pairwise: the browser
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
- The horizontal audit now separates block-derived members from the Field and
  Action keyline buckets instead of asserting that a bare pagination digit or
  chip text uses a text inset.

## Automated evidence

- `npm test`: exit 0; 9,723 static checks; every component baseline family
  reports zero failures; component behavior passes.
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
  icon squares, real page-chrome buttons, pagination ownership,
  shape-aware target size/spacing, and the excluded article-pagination collapse.
- Existing occupied-block, nested-host, zoom, and vertical-family assertions
  passed without changing their expected geometry.

## Manual browser review

The implemented demo is live at `http://127.0.0.1:4174/`. Chip, badge, button,
pagination, notification, and the horizontal block-derived audit were inspected
in representative light/dark and App/OS states. Single characters and digits
read as circles, longer values as stadiums, icon actions as centred squares,
and labelled pagination remains visibly labelled. Browser diagnostics contained
only Vite connection messages and no errors.

## Independent adversarial review

A fresh Sol pass found eight issues in the first implementation: off-centre
fitting chips, clipped five-digit badges, a non-square public icon-link state,
an undocumented chip-padding change, a nearest-centre-only WCAG approximation,
missing pagination target evidence, weakened duplicate-rule AST matching, and
overstated radius/coverage records. Follow-up review also tightened logical
radius snapshots, restored the original labelled-icon demo layout, completed
nested two-through-five-character coverage, and added the real table-hosted
interactive nested chip to the target sweep. All findings are addressed in
source, gates, and this package. Sol's final pass found no remaining blocking,
major, or substantive findings and independently reproduced the 9,723 static
checks and green browser behavior.

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
