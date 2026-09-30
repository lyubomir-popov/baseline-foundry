# ContextualMenu adversarial re-review — Spec 022

**Scope**: Pragma `533ae3e1b` (`feat/bf-spacing-model`) against BF `c3313fe`
(`feat/022-pragma-spacing-adoption`), plus verification that the Chip border
findings from the previous review were closed.

**Method**: source audit, an independent run of the package's own browser suite,
and separate Playwright probes measuring first-baseline seating, shared-constant
sensitivity and mark-driven row growth across Chromium, Firefox and WebKit. No
tracked file was edited; both worktrees were clean before and after.

## 1. Verdict

**Accept with required corrections.**

The ContextualMenu ledger is sound in structure and the row's occupied block is
excellent — on-grid to 0.016 CSS px in every product, root size and engine. The
portal/product-context work is a real improvement over `main`. But the slice
drops the provider stroke tokens that the Chip was bound to one commit earlier,
and its first-baseline evidence rests on a tolerance that is fitted to the
observed error rather than derived from the governing envelope.

## 2. Previous findings — closed

`d4b3d5668` addresses both blocking findings from the Chip border review, and
does it properly:

- `providerStroke` is resolved and asserted to be 1 CSS px; `--_chip-border-width`
  is asserted equal to it; all four used edges are checked within an explicit
  `max(0.01, authored − floor(authored × dpr) ÷ dpr)` snap envelope.
- The ledger now derives padding and the nominal painted block from the
  **authored** `borderToken` rather than the measured used border, with the
  raster difference carried separately as `rasterBlockEnvelope`.
- Genuine negative controls: `satisfiesDefaultBorderContract` must be **false**
  for the 2px override chip and for a new zero-border chip. That is the red/green
  the previous suite lacked.
- The story now publishes `providerStroke`, `chipBorderInput`, `usedBorder` and
  `devicePixelRatio` as separate fields.

One record correction: the batch summary says "the authored contract remains
`.0625rem` — 1 CSS px at the 16px root". That is true of ContextualMenu, but
**not** of the Chip. The Chip's authored contract is the provider's absolute
`--dimension-stroke-thickness-medium: 1px`, and the suite asserts
`providerStroke ≈ 1` at both the 16px and 18px roots. The `.0625rem` figure is
BF's rem-based stroke. Keeping those two apart matters for finding F1 below.

## 3. Verified claims

Independently reproduced:

- **12/12 ContextualMenu browser configurations pass** — Chromium, Firefox and
  WebKit, DPR 1/2, 16px and 18px roots, Site/Docs/App, LTR/RTL. Run from a clean
  worktree, 1.3 minutes.
- **Intrinsic rows, no target geometry.** `block-size: auto`, `min-block-size` in
  `{0px, auto, none}`, `max-block-size` in `{none, auto}`, asserted per row.
- **Occupied block is on-grid.** Measured `rowHeight mod baseline` = 0.0156 CSS px
  in every product, root and engine.
- **Zero-footprint dividers.** The `<hr>` is `block-size: 0; margin: 0; border: none`
  and the divider is an inset box-shadow on the following row, so it contributes
  no layout. `separatorFootprint ≈ 0` is asserted, and the thickness is checked
  device-snapped.
- **Separator collapsing is correct.** I traced leading, trailing, consecutive and
  interior cases through `renderMenuEntries`: `[sep, item…]` and `[…item, sep]`
  render no divider, `[item, sep, sep, item]` collapses to one, and the
  `separatorBefore` flag lands on the right following item in each case.
- **The caret cannot expand a row.** The 1rem canvas is below every product's
  line box (1.25rem / 1.5rem), and `paddingStart + paddingEnd + lineHeight ≈
  rectHeight` is asserted, which is the right guard for the corrected
  caret-driven-expansion assumption.
- **Product context through portals.** Resolved from the trigger before the menu
  is promoted to a portal, kept inline for SSR and first client render, and
  re-resolved by a MutationObserver on ancestor `class` attributes. Asserted on
  both the root surface and the nested submenu, in all three products.

Also worth crediting: the slice adopts `--color-focus-ring`, which is the real
provider token name. The rest of Pragma still references the stale
`--color-focusRing`, which resolves to nothing.

## 4. Required corrections

### F1 — the provider stroke tokens were dropped for hardcoded rem values (high)

This is a regression against `main` and it contradicts the Chip correction landed
in the immediately preceding commit.

| Value | `main` (`7193fe082`) | `533ae3e1b` | At 16px root | At 18px root |
|---|---|---|---:|---:|
| Divider | `var(--dimension-stroke-thickness-medium)` | `0.0625rem` | 1px | **1.125px** |
| Surface border | — (new) | `0.0625rem` | 1px | **1.125px** |
| Ledger border input | — (new) | `0.0625rem` | 1px | **1.125px** |
| Focus ring | `var(--dimension-stroke-thickness-large)` | `0.125rem` | **2px** (was 3px) | 2.25px (was 3px) |

Three consequences:

1. **Root-size divergence.** The provider stroke is an absolute `1px`. At an 18px
   root this menu's border and divider are 12.5% thicker than the border on every
   other Pragma component on the same page — including the Chip, whose suite now
   explicitly asserts 1 CSS px at an 18px root. Their own oracle encodes
   `surfaceBorderRem: 0.0625` and the browser test asserts `0.0625 × rootSize`, so
   the divergence is deliberate and locked in, not accidental.
2. **The focus indicator got 33% thinner** (3px → 2px at a 16px root). That is an
   accessibility-relevant change, made inside a spacing-adoption slice, absent
   from the batch summary, and now pinned by a unit test.
3. **It recreates provider facts locally**, which is what FR1 and the migration
   ledger's "consume the provider property names" disposition exist to prevent,
   and it is the exact pattern the Chip was corrected away from. The slice adopts
   the provider *colour* token while abandoning the provider *stroke* tokens.

`ContextualMenu.spacing.tests.ts` asserts the CSS source text contains
`--_contextual-menu-divider-width: 0.0625rem` and
`--_contextual-menu-focus-ring-width: 0.125rem`, so the hardcoded values are now
enforced by tests rather than merely present.

**Smallest correction.** Take the nominal stroke inputs from
`--dimension-stroke-thickness-medium` and `--dimension-stroke-thickness-large`,
keep the device-snap envelope already used in the browser assertions, and update
the oracle to a provider-derived pixel fact rather than a rem constant. If the
thinner focus ring is intended, it needs to be a separate change with its own
argument, not a side effect of a spacing migration.

### F2 — first-baseline seating is not shown within the governing envelope (high)

The start nudge exists to seat the first text baseline on the product grid.
Measured distance from the first baseline to the nearest baseline multiple:

| Engine | Site (B=8) | Docs/App (B=4) | Baseline within the line box (Site / Docs) |
|---|---:|---:|---|
| Chromium | **0.453** | **0.766** | 17.0 / 14.0 |
| Firefox | 0.067 | **0.267** | 17.5 / 14.5 |
| WebKit | 0.047 | **0.266** | 17.5 / 14.5 |

The BF metric model predicts a baseline at `L/2 + 0.34F` — 17.44 and 14.76. No
engine produces that: Chromium rounds the font's in-line-box baseline to whole
pixels, Firefox and WebKit to half pixels. The pinned nudge is fractional
(6.56 / 1.24), so the sum lands off-grid by the rounding residue.

Acceptance 3 requires first-baseline agreement within 0.25 CSS px. Chromium
misses it by up to 3× and Firefox/WebKit miss it marginally in Docs and App.

The suite does not surface this because its only independent-looking check is:

```ts
close(row.baselineMarkerOffset, inBoxStart + metricPosition, 0.8);
```

Since `paddingBlockStart == inBoxStart` by construction, this reduces to
validating the 0.34em anchor against the loaded font — it says nothing about
seating. Its 0.8px tolerance sits 0.034px above Chromium's worst observed error,
so it is fitted to the measurement rather than derived from a contract. The
in-code comment describes it as "wider than a device-pixel snap", but at DPR 1 a
device-pixel snap is at most 0.5px; this is absorbing a systematic model error.

Compounding it: unlike the Chip, this component's story has **no rendered BF
reference element**. Parity with BF is asserted against a formula, not against
BF, so the one check that could have caught a model-versus-engine divergence
does not exist here.

**Smallest correction.** Either add a rendered BF reference row to the story and
compare first baselines directly (the Chip precedent), or assert
`distanceToMultiple(firstBaseline, baseline)` against an explicitly derived
engine font-rounding envelope. Either way the 0.8 constant should be replaced by
a number with a stated derivation.

### F3 — a shared wrong constant is undetectable (medium)

The pinned nudge is duplicated as a literal in `Item/styles.css` (`0.0775rem`,
and `0.41rem` for Site) and in `bf-contextual-menu-oracle.ts`. Nothing binds
either to a measurable fact.

Injecting a nudge and recomputing the suite's own expectations from the same
value — which is what a shared wrong constant looks like — on Site at a 16px
root:

| Injected nudge | padding start | row height | first baseline | off-grid | every suite check |
|---|---:|---:|---:|---:|---|
| `0.41rem` (production) | 6.56 | 39.98 | 23.55 | 0.45 | passes |
| `0.5rem` | 8.00 | 40.00 | 25.00 | **1.00** | **passes** |
| `0.25rem` | 4.00 | 32.00 | 21.00 | **3.00** | **passes** |
| `0rem` | 1.00 | 32.00 | 18.00 | **2.00** | **passes** |

Padding, row height, the padding/line-height sum and the metric-marker check all
hold in every row, because each expectation is recomputed from the same constant.
This is the Chip B1 pattern recurring in a new form: the implementation and the
oracle share a literal, and the nominally independent check is too loose to bind
it. The correction in F2 closes this as a side effect — a grid assertion is the
fact the constant should be answerable to.

The pinned values are, as it happens, correct against BF's own metric artifact.
The finding is that nothing in the suite establishes that.

## 5. Non-blocking observations

- **The leading mark has no canvas.** `.caret` is pinned to a 1rem visual canvas;
  `.icon` has no rule at all. A 24px mark grows a Docs or App row from 23.98 to
  27.98 CSS px and pushes the label and baseline down by 4px; Site absorbs it
  because its line box is 24px. The suite's padding/line-height sum check would
  catch this, but only the story's own icon is exercised. Giving `.icon` the same
  `--_contextual-menu-visual-canvas` treatment as `.caret` would make the row
  structurally immune rather than immune by convention.
- **Missing product context degrades silently.** If `closest(".site, .docs, .app")`
  returns null the menu portals with no product class, `.site.ds.contextual-menu-item`
  cannot match, and a Site menu quietly takes the compact Docs/App nudge. FR2 asks
  for a development-time failure in this situation and there is none. Read from
  the code path; I was not able to construct the rootless case in the story, so
  this is not browser-confirmed.
- **The ancestor observer set is captured once.** The effect depends only on
  `targetRef`, and each observer uses `subtree: false`. Class changes on existing
  ancestors are handled — which is the tested "live tier change" — but a product
  root *inserted* between the trigger and an observed ancestor afterwards is not.
- **Portal deferral adds a frame.** The menu now renders inline until both
  `mounted` and `productClassResolved` are true. `position: fixed` keeps it out of
  flow, so this should be invisible, but a menu opened on first paint is worth a
  glance in the demos.

## 6. Recommendation

Keep the ContextualMenu slice, correct F1 and F2 before it is described as
accepted, and fold F3 into the F2 fix. F1 is the one to treat as urgent: it is a
regression against `main`, it contradicts a correction landed one commit earlier,
and it changes a focus indicator without saying so.

BF Spec 022 acceptance text for this slice should not yet claim first-baseline
parity within 0.25 CSS px, and should record that this component has no rendered
BF reference. The existing deferral of native 100/125/150% zoom evidence remains
correct and is untouched by this review.
