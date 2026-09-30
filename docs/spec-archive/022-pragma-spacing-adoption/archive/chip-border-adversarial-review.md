# Chip border adversarial review — Spec 022

**Scope**: the React global Chip border in Pragma commit `ed23e62df`
(`feat/bf-spacing-model`, base `7193fe082`), against BF `feat/022-pragma-spacing-adoption`
review commit `f87ad46` and oracle commit `b83396c`.

**Method**: read-only source audit plus live browser measurement in Chromium,
Firefox and WebKit, including device-resolution raster analysis. No tracked file
was edited; all diagnostic files were removed after the run.

## 1. Verdict

**Accept with required corrections.**

The production geometry in `ed23e62df` is correct and no production CSS change is
warranted. Two evidence defects must be corrected before the Chip slice's
acceptance text can stand as written: the spacing-contract story mislabels a
browser used value as the Chip's border contract, and the Playwright suite
contains no assertion that the regular Chip's border is the provider stroke at
all. Both are reporting/coverage defects, not geometry defects.

## 2. Direct answer

`0.666667px` is a **used value**, produced by the browser, not by Pragma.

Every engine floors a non-zero border width to a whole number of *physical*
pixels when the page is laid out under a display scale or native page zoom, then
re-expresses that used value in CSS pixels by dividing by the scale:

```text
used_css_px = max(1, floor(specified_css_px × scale)) ÷ scale
150%:  floor(1 × 1.5) ÷ 1.5 = 1 ÷ 1.5 = 0.666666… → "0.666667px"
125%:  floor(1 × 1.25) ÷ 1.25 = 1 ÷ 1.25         → "0.8px"
200%:  floor(1 × 2) ÷ 2 = 1                      → "1px"
```

It is **not** only misleading CSSOM reporting. Device-resolution raster analysis
confirms the border really does paint as a **single physical pixel** at 125% and
150% — a hairline — rather than an antialiased 1.25 or 1.5 physical pixels. The
CSSOM report is truthful about paint.

However, this is **not a Chip defect and not a token defect**. Measured side by
side on the same page, a literal `border-width: 1px`, `0.0625rem`, and
`var(--dimension-stroke-thickness-medium)` all produce byte-identical results at
every scale in every engine. The behaviour applies to every 1 CSS px border on
the web, including BF's own reference Chip. Nothing authored in CSS can avoid it.

So: the authored and computed contract is exactly `1px` and is not violated. The
*used and painted* stroke is scale-dependent and is outside the component's
control. What is in Pragma's control — and what is currently wrong — is that the
acceptance story presents the used value under the bare label `border`, and the
suite never checks the authored stroke at all.

## 3. Blocking findings

Two, both in evidence rather than in production geometry.

### B1 — the suite cannot detect a wrong regular border (high)

**Evidence.** Every border-related expectation in
`tests/Chip.spacing.pw.ts` is derived from the *measured* border, so it is
algebraically invariant to the border's value:

```text
padding      = max(N − R, 0)
painted      = L + 2·max(N − R, 0) + 2R      → L + 2N whenever N ≥ R
contentOuter = (actionInset − R) + R          → actionInset
```

Injecting a wrong value into the live production story (Site, 16px root) and
re-evaluating the suite's own expressions:

| `--chip-border-width` | used border | padding | painted | occupied | suite result |
|---|---:|---:|---:|---:|---|
| production default | 1px | 5.456 | 36.906 | 39.994 | passes |
| `2px` | 2px | 4.456 | 36.906 | 39.994 | **passes** |
| `0px` | 0px | 6.456 | 36.906 | 39.994 | **passes** |
| `0.5px` | 1px | 5.956 | 37.906 | 40.994 | fails |
| `1px` | 1px | 5.456 | 36.906 | 39.994 | passes |

A doubled border and a **completely absent border** both satisfy every current
assertion. `0.5px` fails only incidentally, because Chrome clamps a sub-device
pixel border up to 1 physical pixel and the recomputed padding then disagrees —
not because any assertion tests the stroke.

`close(sample.painted, sample.bfPainted)` does not rescue this: the ledger's
painted block is border-invariant, so the BF reference chip and a border-less
production chip agree exactly.

**Consequence.** The suite does not lock the Chip's border to the provider
stroke. A future refactor could delete or double the border and stay green.

**Smallest correction.** Add two assertions to the regular-Chip block: that
`--_chip-border-width` resolves to the provider's
`--dimension-stroke-thickness-medium`, and that the used block/inline borders
equal that authored value within an explicit device-snap envelope of
`max(0.01, authored − floor(authored × dpr) ÷ dpr)`.

### B2 — the story labels a used value as the border contract (medium)

**Evidence.** `Chip.stories.tsx` publishes a single field,
`border: styles.borderBlockStartWidth`, in a metrics list whose neighbours
(`baseline`, `actionInset`) are resolved contract values. On any machine at 125%
or 150% display scale the field reads `0.8px` or `0.666667px` while the contract
is `1px`, with nothing on the surface to distinguish the two. That is exactly the
confusion that triggered this review.

**Consequence.** The declared acceptance surface for the Chip ledger misreports
the product contract, and does so silently and machine-dependently.

**Smallest correction.** Split the field into the provider token
(`--dimension-stroke-thickness-medium`, resolved), the used width
(`borderBlockStartWidth`), and `devicePixelRatio`, so the difference is visible
and self-explaining rather than hidden.

## 4. Answers to the required questions

### Q1 — does the provider resolve the stroke to exactly 1px everywhere?

**Yes.** `--dimension-stroke-thickness-medium` is declared exactly once in the
installed `@canonical/design-tokens` 0.9.0, in
`dist/sets.primitive.css` under `@layer ds.tokens { :root { … } }`, as `1px`.
`git grep -- "--dimension-stroke-thickness-medium:"` across the whole worktree
returns nothing — Pragma never redeclares it, and no product scope, root size,
cascade layer or public override alters it. It is an absolute `px` value, so root
font size is irrelevant.

Measured on the live story: computed `1px` at the document root and on the Chip,
and `--_chip-border-width` resolves to `1` CSS px, in Site, Docs and App, at both
16px and 18px roots.

### Q2 — what do the alias, authored width, CSSOM widths and painted edges measure?

Live `components-chip--spacing-contract`, Chromium, 16px root, LTR:

| Native scale | DPR | `--_chip-border-width` | CSSOM border (all 4 edges) | painted edge |
|---|---:|---|---|---|
| 100% | 1 | `1px` (resolves 1) | `1px` | 1 device px |
| 125% | 1.25 | `1px` (resolves 1) | `0.8px` | 1 device px |
| 150% | 1.5 | `1px` (resolves 1) | `0.666667px` | 1 device px |
| 200% | 2 | `1px` (resolves 1) | `1px` | 2 device px |

Root font size 16px/18px, `visualViewport.scale` = 1 throughout, and an ancestor
walk from the Chip to the document element found **no** element with a non-`none`
`transform`, non-`normal` `zoom` or non-`none` `scale`. Bounding rectangles are
given in section 6.

The alias is unaffected by scale: the custom property is a computed value and
resolves to 1 CSS px at every scale. Only the border's *used* value moves.

### Q3 — reproduction across engines, without conflating mechanisms

Four distinct mechanisms were separated. They do **not** behave alike, and this
is the single most important methodological point in the review.

| Mechanism | What it is | Chromium | Firefox | WebKit |
|---|---|---|---|---|
| Playwright `deviceScaleFactor` | CDP device-metrics emulation: layout stays at 1×, raster at N× | **no snapping** (`1px`) | **no snapping** (`1px`) | snaps (`0.8`/`0.666667`) |
| Native display scale / page zoom | zoom-for-DSF: layout in physical px (`--force-device-scale-factor`, `layout.css.devPixelsPerPx`) | snaps | snaps | n/a in harness |
| CSS `zoom` | a CSS property on an element | reports `0.666667px` | reports `0.666667px` | reports `0.888889px` |
| CSS `transform: scale()` | a paint-time transform | no change (`1px`) | — | — |

Genuinely supported in this environment: Chromium `--force-device-scale-factor`
(a faithful analogue of Windows/macOS display scaling and Chrome page zoom, both
of which route through zoom-for-DSF), Firefox `layout.css.devPixelsPerPx` (the
engine's real full-page zoom control), and CDP `deviceScaleFactor` in all three
engines. There is no CDP command for Chrome's own zoom UI; the forced display
scale is the correct substitute and it reproduces the reported value exactly.

WebKit is the outlier: it snaps under plain `deviceScaleFactor` too, which is why
`0.666667px` appears in the WebKit column of the existing matrix mechanism while
Chromium and Firefox stay at `1px`.

### Q4 — antialiased 1.25/1.5 physical px, or snapped to one?

**Snapped to one.** Device-resolution rasters (`scale: "device"`, `viewport: null`
so no metric override), luminance-integrated across the middle 30% of the top
edge against a solid white background:

| Engine | Native scale | DPR | CSSOM | device-row ink profile | total ink |
|---|---|---:|---|---|---|
| Chromium | 100% | 1 | `1px` | `[1, 0, 0, …]` | 1.00 device px |
| Chromium | 125% | 1.25 | `0.8px` | `[1, 0, 0, …]` | 1.00 device px |
| Chromium | 150% | 1.5 | `0.666667px` | `[1, 0, 0, …]` | 1.00 device px |
| Chromium | 200% | 2 | `1px` | `[1, 1, 0, …]` | 2.00 device px |
| Firefox | 125% | 1.25 | `0.8px` | `[1, 0, 0, …]` | 1.00 device px |
| Firefox | 150% | 1.5 | `0.666667px` | `[1, 0, 0, …]` | 1.00 device px |
| Firefox | 200% | 2 | `1px` | `[1, 1, 0, …]` | 2.00 device px |

One fully-inked device row, no antialiasing spill. Identical profiles for the
token, a literal `1px` and `0.0625rem`. A `2px` control behaves correctly
(`1.6px`/2 device px at 125%, `2px`/3 device px at 150%), which confirms the rule
is floor-to-physical-pixel and not a general thinning.

For contrast, under CDP `deviceScaleFactor` emulation the same border reports
`1px` and rasters `[1, 0.502, 0, …]` = 1.502 device px = 1.0013 CSS px — a true
antialiased 1 CSS px border. That configuration corresponds to a hi-dpi screen
rendering at 1.5× with no zoom, not to a 150%-scaled desktop.

### Q5 — what kind of value is `0.666667px`?

A **used (post-layout, device-snapped) value**, correctly reported. It is not an
authored value, not a computed value, not a story measurement defect, and not a
Chip-specific fact. The fraction is `1 ÷ 1.5`: one physical pixel expressed back
in CSS pixels at a 1.5 scale. See section 2 for the closed form.

The story is not *reading* the wrong thing — `borderBlockStartWidth` genuinely is
the used width. The defect is that it *labels* the used width `border` on a
surface that otherwise publishes contract values (finding B2).

### Q6 — does the ledger subtract a nominal border the browser does not paint?

**Yes, at non-integer scales.** Measured on the live story, Chromium, 16px root:

| Product | scale | used border | padding-block | painted | compensation | occupied | distance to baseline multiple |
|---|---|---:|---:|---:|---:|---:|---:|
| Site (B=8) | 100% | 1 | 5.456 | 36.906 | 3.088 | 39.994 | 0.006 |
| Site | 125% | 0.8 | 5.456 | 36.500 | 3.088 | 39.588 | **0.412** |
| Site | 150% | 0.6667 | 5.456 | 36.229 | 3.088 | 39.317 | **0.683** |
| Docs/App (B=4) | 100% | 1 | 0.149 | 22.281 | 1.702 | 23.983 | 0.017 |
| Docs/App | 125% | 0.8 | 0.149 | 21.875 | 1.702 | 23.577 | **0.423** |
| Docs/App | 150% | 0.6667 | 0.149 | 21.625 | 1.702 | 23.327 | **0.673** |

Padding is computed from `max(N − R, 0)` with the *computed* `R = 1px`, and
compensation is computed from `--_chip-painted-block-size`, which also uses
`R = 1px`. Both are custom-property arithmetic and are therefore immune to
device snapping. Only the two real border edges shrink. The deltas are exactly
`2 × (1 − used)`: −0.40 CSS px at 125% and −0.67 CSS px at 150% on both the
painted block and the occupied block. The first text baseline rises by one
border delta, `−0.20` and `−0.33` CSS px respectively, because the content offset
is `border + padding`.

This exceeds the 0.25 CSS px envelope in FR5 / acceptance 3 — but it is not
correctable in CSS. No CSS mechanism exposes the device-snapped used border, so
the compensation cannot be made to track it, and the same delta appears in BF's
reference implementation and in every other 1px-bordered control on the page.
The honest disposition is to bound the claim, not to change the component.

### Q7 — do the tests assert a 1 CSS px regular border?

**No.** There is no assertion on the regular Chip that references the provider
token, the value `1px`, or `--_chip-border-width`. The only border assertions on
the production chip are symmetry (`borderStart ≈ borderEnd`, tol 0.01) and
identities that cancel the border algebraically. See finding B1 for the red/green
proof that `2px` and `0px` both pass.

The tolerance that would let `0.666667px` through is not a numeric tolerance but
the derivation itself: expectations are recomputed *from* the measured border.
There is one place where an authored-versus-used distinction is drawn —
`metricEnvelope` adds `|bfBorderStart − bfBorderToken|` for each edge — but that
applies only to the hidden BF reference chip's `occupied` comparison.

Ironically, at a genuine 150% scale the suite *would* fail, on
`close(sample.paddingStart, padding)`: expected padding is recomputed as
`N − 0.6667 = 5.789` while the used padding is `N − 1 = 5.456`, a 0.333 CSS px
miss against a 0.25 tolerance. The suite's expectations silently assume
used equals authored. It never runs at that scale, so this never surfaces.

### Q8 — is the BF oracle comparison valid here?

**It is valid for what it claims, and blind to this question.** Two reasons:

1. The painted-block ledger is border-invariant (section 3), so
   `close(sample.painted, sample.bfPainted)` cannot distinguish stroke widths.
2. The `metricEnvelope` used for `occupied` explicitly *adds*
   `|bfBorderStart − bfBorderToken|` per edge — that is, it is built to absorb
   the authored-versus-rasterised border difference. At 150% that widens the
   envelope by ~0.67 CSS px, exactly enough to hide the effect.

Both Pragma and the BF reference are then normalised through the same rounding,
so parity holds while absolute grid alignment does not. That is a correct
statement about parity and a misleading one if read as grid alignment.

One further point the oracle does not surface: BF authors its stroke as
`borderWidthRem: 0.0625` → `--bf-border-width: 0.0625rem`, which is 1px at a 16px
root but **1.125px at an 18px root**. Pragma's provider token is a fixed `1px`
at every root. `review.md` states this distinction, but no test enforces it, and
the story's `bf-reference` chip pins `--chip-border-width: 0.0625rem`, so at an
18px root that fixture is not carrying the provider stroke. Pragma is right to
follow the provider (FR1/FR3); the divergence just must not be read as a stroke
parity claim.

### Q9 — does the story present the border truthfully?

Literally yes, editorially no. See finding B2. It should show three fields — the
provider token, the used width, and `devicePixelRatio` — rather than one field
named `border`. Adding the physical-pixel coverage is optional; DPR plus the
used width already explains the number to a reader.

### Q10 — does forcing `border-width: 1px` change anything?

**No.** Measured in the same document at each scale, in all three engines:

| Authored | 100% | 125% | 150% | 200% |
|---|---|---|---|---|
| `var(--dimension-stroke-thickness-medium)` | `1px` | `0.8px` | `0.666667px` | `1px` |
| `1px` literal | `1px` | `0.8px` | `0.666667px` | `1px` |
| `0.0625rem` (16px and 18px roots) | `1px` | `0.8px` | `0.666667px` | `1px` |
| `2px` control | `2px` | `1.6px` | `2px` | `2px` |

The token path is exonerated. There is no fix available at the authoring level,
which is why the diagnostic override is reported here and no change is proposed.

### Q11 — is anything scaling the user's live route independently of the CSS?

**Yes — the browser or OS, not Storybook and not the component.**

- Direct `iframe.html` story route: no `transform`, `zoom` or `scale` anywhere on
  the ancestor chain of the Chip.
- Manager page: no `transform`, `zoom` or `scale` on the preview iframe or any of
  its ancestors; the Chip inside the manager's frame measures `1px` and
  36.90625px, identical to the direct route. Manager-canvas scaling is ruled out.
- Storybook's own zoom control uses `transform: scale()`, and a `transform`
  applied to `#storybook-root` leaves the computed border at `1px` while
  stretching the rect to 55.36px — so it **cannot** produce `0.666667px`.
- CSS `zoom: 1.5` on `#storybook-root` **does** produce `0.666667px`
  (rect 54.34px), as does a forced 1.5 display scale.

Since nothing in the page applies CSS `zoom`, the remaining explanations for the
user's observation are native browser page zoom at 150%, an OS display scale of
150%, or a browser extension injecting `zoom`. All three route through the same
engine behaviour and all three are environmental.

### Q12 — is `ed23e62df` acceptable?

**Acceptable in production geometry; acceptable overall only after correcting the
story and the tests.**

- **Production blockers**: none. `border-width: var(--_chip-border-width)` →
  `var(--dimension-stroke-thickness-medium)` → `1px`, verified computed on every
  variant (static, lead/value, clickable `<button>`, dismissible, one-character),
  on all four physical and both logical edges, in LTR and RTL, in Site, Docs and
  App, at 16px and 18px roots.
- **Evidence/reporting defects**: B1 and B2 above.
- **Non-blocking hardening**: section 8.

## 5. Authored / computed / used / painted matrix

`A` = authored, `C` = computed (`--_chip-border-width`), `U` = CSSOM used width,
`P` = painted ink. Site/Docs/App and 16px/18px roots were measured separately and
agree exactly in every cell, because the token is an absolute `px` value; the
product and root columns are therefore collapsed.

| Engine | Mechanism | Scale | DPR | A | C | U | P (device px) | P (CSS px) |
|---|---|---|---:|---|---|---|---:|---:|
| Chromium | native display scale | 100% | 1 | 1px | 1px | `1px` | 1.00 | 1.000 |
| Chromium | native display scale | 125% | 1.25 | 1px | 1px | `0.8px` | 1.00 | 0.800 |
| Chromium | native display scale | 150% | 1.5 | 1px | 1px | `0.666667px` | 1.00 | 0.667 |
| Chromium | native display scale | 200% | 2 | 1px | 1px | `1px` | 2.00 | 1.000 |
| Chromium | CDP deviceScaleFactor | — | 1 | 1px | 1px | `1px` | 1.00 | 1.000 |
| Chromium | CDP deviceScaleFactor | — | 1.25 | 1px | 1px | `1px` | 1.25 | 1.001 |
| Chromium | CDP deviceScaleFactor | — | 1.5 | 1px | 1px | `1px` | 1.50 | 1.001 |
| Chromium | CDP deviceScaleFactor | — | 2 | 1px | 1px | `1px` | 2.00 | 1.000 |
| Firefox | `devPixelsPerPx` | 100% | 1 | 1px | 1px | `1px` | 1.00 | 1.000 |
| Firefox | `devPixelsPerPx` | 125% | 1.25 | 1px | 1px | `0.8px` | 1.00 | 0.800 |
| Firefox | `devPixelsPerPx` | 150% | 1.5 | 1px | 1px | `0.666667px` | 1.00 | 0.667 |
| Firefox | `devPixelsPerPx` | 200% | 2 | 1px | 1px | `1px` | 2.00 | 1.000 |
| Firefox | CDP deviceScaleFactor | — | 1 … 2 | 1px | 1px | `1px` | — | — |
| WebKit | CDP deviceScaleFactor | — | 1 | 1px | 1px | `1px` | 1.00 | 1.000 |
| WebKit | CDP deviceScaleFactor | — | 1.25 | 1px | 1px | `0.8px` | — | — |
| WebKit | CDP deviceScaleFactor | — | 1.5 | 1px | 1px | `0.666667px` | 1.00 | 0.667 |
| WebKit | CDP deviceScaleFactor | — | 2 | 1px | 1px | `1px` | — | — |

Authored and computed are invariant in every row. Only used and painted move, and
they move together — the CSSOM report never disagrees with the raster.

## 6. Ledger impact

Nominal versus used border, Chromium, live story, 16px root. `Δ` is used minus
nominal per edge.

| Product | Scale | Δ per edge | padding-block | painted (nominal → actual) | compensation | occupied | first baseline shift | off-grid |
|---|---|---:|---:|---|---:|---:|---:|---:|
| Site | 100% | 0 | 5.456 | 36.906 → 36.906 | 3.088 | 39.994 | 0 | 0.006 |
| Site | 125% | −0.200 | 5.456 | 36.906 → 36.500 | 3.088 | 39.588 | −0.200 | 0.412 |
| Site | 150% | −0.333 | 5.456 | 36.906 → 36.229 | 3.088 | 39.317 | −0.333 | 0.683 |
| Docs | 100% | 0 | 0.149 | 22.297 → 22.281 | 1.702 | 23.983 | 0 | 0.017 |
| Docs | 125% | −0.200 | 0.149 | 22.288 → 21.875 | 1.702 | 23.577 | −0.200 | 0.423 |
| Docs | 150% | −0.333 | 0.149 | 22.292 → 21.625 | 1.702 | 23.327 | −0.333 | 0.673 |
| App | 100%/125%/150% | as Docs | as Docs | as Docs | as Docs | as Docs | as Docs | as Docs |

Reading:

- **Padding** never changes. It is derived from the computed 1px token, so the
  symmetric nudge-derived inset is preserved exactly at every scale.
- **Painted block** loses `2 × |Δ|` — 0.40 CSS px at 125%, 0.67 CSS px at 150%.
- **Compensation** never changes, because `--_chip-painted-block-size` is custom
  property arithmetic over the nominal border.
- **Occupied block** therefore inherits the full painted-block loss and lands
  0.41–0.68 CSS px short of the product baseline multiple at 125% and 150%. At
  100% and 200% it is on-grid to within 0.02 CSS px.
- **First baseline** rises by one `Δ`, so the metric alignment nudge is
  understated by 0.20/0.33 CSS px at those scales.
- BF's reference implementation subtracts the same nominal stroke and loses the
  same amount, so BF/Pragma parity is preserved throughout. The loss is absolute
  grid drift shared by both, not a divergence.

### Nested Chip — kept separate, and behaves differently

The nested form is unaffected and is measured as intended: `border-width: 0` at
every scale, and `box-shadow: … 0px 0px 0px 1px inset` reported as **`1px` at
100%, 125% and 150% alike**. Box-shadow spread is not floored to physical pixels,
so the nested stroke keeps its full nominal 1 CSS px and rasters with
antialiasing, while the regular border collapses to a hairline. The nested
Chip's verdict is unchanged and positive; the divergence between the two forms at
non-integer scales is noted in section 8.

## 7. Test and story audit

**What currently catches a regression**

- Provider values, product roots, typography, gaps and inline insets: solid, with
  0.01 tolerances against the pinned oracle.
- Symmetric padding, painted/occupied ledger, exact-modulo tie, stack-owned gaps,
  one-character stadium geometry, dismiss canvas, RTL inline mirroring, nested
  host fit, public overrides: all genuinely exercised.
- The ten-blob provenance pin at `b83396c` is enforced and the SHA-1 shape is
  asserted before use.
- A sub-device-pixel border (`0.5px`) is caught, incidentally.

**What currently masks the issue**

- No assertion binds the regular Chip's border to the provider token or to 1 CSS
  px. `2px` and `0px` both pass (finding B1).
- All border-dependent expectations are recomputed from the measured border,
  which cancels the border out of the ledger identities.
- `metricEnvelope` is explicitly widened by the authored-versus-used border
  difference, which absorbs exactly this effect in the BF comparison.
- The matrix parameterises `deviceScaleFactor` only (1 and 2). In Chromium and
  Firefox that mechanism does not engage zoom-for-DSF layout at all, and at DPR 2
  the flooring is exact — so the snapping regime is never entered. The suite
  therefore cannot produce zoom evidence even in principle, whatever value is
  passed.
- The story's single `border` field reports the used width under a contract
  label (finding B2).

**Recommended minimum corrections** (not implemented — this review is read-only)

1. Assert the regular Chip's `--_chip-border-width` equals the provider stroke,
   and that used borders match it within an explicit device-snap envelope.
2. Split the story's `border` field into token / used / DPR.
3. Where the test derives expectations from the measured border, derive them from
   the *authored* border and carry the snap envelope explicitly, so a real border
   regression and a rasterisation artifact are distinguishable.

## 8. Non-blocking follow-ups and evidence limitations

**Follow-ups**

- Add a zoom dimension to the geometry harness using a mechanism that genuinely
  engages layout-level scaling — Chromium `--force-device-scale-factor`, Firefox
  `layout.css.devPixelsPerPx` — rather than `deviceScaleFactor`, which is a
  raster-only override in two of three engines. This is the only way T012 can be
  closed honestly.
- Document the border rasterisation envelope, `2 × (1 − floor(dpr) ÷ dpr)` on the
  painted and occupied block, in the migration ledger next to the geometry
  formulas, so future readers meet it before they meet a story field.
- Consider whether the regular and nested strokes should stay visually divergent
  at 125%/150% — the nested inset shadow paints ~1.5 physical px antialiased
  while the regular border paints 1 physical px. Both are correct against their
  own contract; side by side they will not look like the same stroke. This is a
  design question, not a defect, and belongs outside this slice.
- The BF reference stroke is root-relative (`0.0625rem` → 1.125px at an 18px
  root) while the provider stroke is fixed `1px`. Pragma follows the provider,
  correctly. Worth an explicit line in the oracle so no future reader treats the
  reference chip as carrying the provider stroke at non-16px roots.

**Limitations of this evidence**

- Chrome's own zoom UI cannot be driven from CDP. `--force-device-scale-factor`
  is used as the analogue, on the grounds that Chrome implements page zoom and
  display scaling through the same zoom-for-DSF pipeline. It reproduces the
  reported `0.666667px` exactly, which is strong but indirect corroboration.
- WebKit raster profiles were captured only at DPR 1 and 1.5, and WebKit has no
  headless display-scale switch equivalent to the other two engines; its snapping
  was observed through `deviceScaleFactor`, which it honours at layout level.
- Raster analysis used a forced black-on-white palette for contrast. Production
  colours were not raster-analysed; the geometry conclusion does not depend on
  colour, but subpixel colour rendering was not assessed.
- The suite was red/greened by injecting overrides into the live story and
  re-evaluating the suite's own expressions in the page, not by mutating tracked
  test files. The algebra in section 3 is the primary argument; the injection is
  corroboration.
- Only the Chip was reviewed. Button, Field and SideNavigation use the same
  `max(N − R, 0)` ledger over the same provider stroke and are very likely to
  carry the same envelope, but that was not measured and is not claimed here.

## Closing

**Should the Chip slice remain accepted?** Yes, as a production-geometry slice.
Nothing in `ed23e62df` paints a wrong border by its own doing: the authored and
computed stroke is the provider's exact `1px` in every product, root size,
direction and variant, and the hairline the user observed is an engine-level
device-pixel floor that applies identically to a literal `1px`, to `0.0625rem`,
and to BF's own reference. Acceptance should be qualified rather than withdrawn,
and should carry the two required corrections in section 3.

**Must existing BF Spec 022 acceptance text be corrected?** Partly.

- `review.md` is already accurate and does not need weakening. It states that
  native browser-zoom evidence is not recorded, that the green matrix "must not
  be described as browser-zoom evidence", and that BF's authored `0.0625rem`
  stroke is distinct from Pragma's provider `1px`. Two additions would sharpen
  it: that the Chip suite contains no authored-border assertion (B1), and that
  the painted/occupied ledger carries a known `2 × (1 − floor(dpr) ÷ dpr)`
  shortfall at non-integer scales.
- `spec.md` acceptance 4 does need correcting. It claims the parity matrix
  "passes Chromium, Firefox and WebKit at 16px and 18px roots, 100%, 125% and
  150% zoom, and DPR 1 and 2". The harness has no zoom dimension, and in two of
  three engines the mechanism it does use cannot reach the zoom regime. The
  clause should either be reduced to the DPR and root coverage that is real, or
  explicitly marked deferred to T012, consistent with `review.md`.
- `quickstart.md` line 32 makes the same 100%/125%/150% claim as a QA route and
  should be reworded to say the zoom pass is manual and currently outstanding.
