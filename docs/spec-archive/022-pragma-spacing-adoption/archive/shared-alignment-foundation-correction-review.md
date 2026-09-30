# Correction review — Pragma shared-alignment foundation

Bounded, read-only re-review of the correction boundary set by
[`shared-alignment-foundation-adversarial-review.md`](shared-alignment-foundation-adversarial-review.md):
Q8, Q9, Q11, Q13 and the section 5 occupied-block matrix. Q2, Q3, Q4, Q6, Q7,
Q10 and Q12 were not reopened; no correction commit invalidates one.

Reviewed at `feat/bf-shared-alignment` tip `9d20a70e0`. Nothing was staged,
committed, cleaned, reset, pushed, merged or published. `feat/bf-metric-nudge`
was not opened. The negative gate control was driven through the scanner's
exported API rather than by writing a probe file, so no worktree file was
touched at any point.

**Working tree at review end:**

```
git status --short --untracked-files=all
 M packages/storybook/addon-msw/public/mockServiceWorker.js
```

Exactly the one preserved generated MSW line-ending change, which is outside
`SEED_INPUT_PATHS`. No governed seed input is dirty.

## 1. Verdict

**GO.**

Every blocking finding B1–B7 from the prior review is closed, and I could
reproduce each claimed piece of evidence independently. Two residual items
remain, both non-blocking and both in defence-in-depth tooling rather than in
production geometry or in the transition gate.

## 2. Authorization

**Stages 5–8 are authorized to proceed.**

Component retrofit work may begin. The authorization covers Stage 5 (Button to
the body role), Stage 6 (the twelve component retrofits), Stage 7 (the remaining
font-size and length defects) and Stage 8 (suite retargeting). It does not cover
merge, push, publication or release, and it is not a component-parity or
closeout acceptance.

## 3. Blocking findings

**None.**

Two non-blocking findings are recorded in §7. Neither changes any production
value, neither weakens the transition gate, and neither needs to be fixed before
Stage 5.

### Prior blockers, closed

| Prior | Finding | Status |
|---|---|---|
| B1 | Universal `li` leaked prose geometry into UI list rows | **Closed** — `0f063df24`, `e83173532`; verified live, §4 Q8 |
| B2a | Suite failed on a conflated `0.5/dpr` bound | **Closed** — `6381be759`; three separate justified terms, 54/54, §4 Q13 |
| B2b | WebKit `addStyleTag: [object Event]` on two accepted Stage 3 cases | **Closed** — CSS-module `import()` route; WebKit 18/18 green |
| B3a | Eight detector bypasses | **Closed** — `36b23db0b`; all nine prior fixtures now caught, §4 Q9 |
| B3b | Eight component packages unscanned | **Closed** — 14 roots with an explicit quarantine record |
| B4 | No allowlist, no classifications, no wiring | **Closed** — `520f09c84`, `9d20a70e0`; 749 identities, 25 classifications, 14/14 wired |
| B5 | ContextualMenu bound not classifiable as written | **Closed** — `1818747f9`; semantic alias, no primitive, no literal |
| B6 | Shared workflow change unjustified and unscoped | **Closed** — `deb4cd7a2`; `fetch-depth: 0` on the `check` job only, with rationale |
| B7 | Contract misstated what `alignment.css` publishes | **Closed** — the `typography-override` and `shared-contract-override` rules now make cross-role consumption and ledger-input overrides detectable |
| §4 Q14 | Audit chrome could render plausibly with a missing ledger | **Closed** — `a302f8980`; every `var()` fallback removed |

## 4. Answers

### Q8 — list isolation

**Pass.** Neither mapper leaks into component list rows.

`packages/styles/typography/src/elements.css` now uses
`li:not(:where(.ds, .ds *))` for the element mapper and
`.p:not(:where(li.ds, .ds li))` for the classed mapper, in both the role
assignment and the trailing geometry block.

Measured against the live production entry, Chromium, `.site` at a 16px root,
with the fixture injected into a real story document so the shipped stylesheets
apply:

| Case | padding-block-start | margin-block-end | max-inline-size |
|---|---|---|---|
| bare `li` | 6.456px | 1.544px | 721.92px |
| `li.ds` | **0px** | **0px** | **none** |
| `.ds li` | **0px** | **0px** | **none** |
| `li.p.ds` | **0px** | **0px** | **none** |
| `.ds li.p` | **0px** | **0px** | **none** |
| bare `.p` | 6.456px | 1.544px | 721.92px |
| bare `p` | 6.456px | 1.544px | 721.92px |

All four component forms are fully isolated; prose retains the mapper unchanged.
Zero page errors.

**17-story live survey** (`breadcrumb|sidenavigation|combobox|filetree|fileupload|timeline|contextual|tabs`):

| `li` | Inside `.ds` | max-inline-size | padding-start | margin-end |
|---|---|---|---|---|
| bare, in `ul` (Storybook docs chrome) | no | 768px | 6.36px | 1.64px |
| bare, in `ol` (chrome) | no | 672px | 7.065px | 0.935px |
| `.file-item` in `.file-list` | yes | **none** | 0.149px | 1.702px |
| `.p.selected` in `.ds.combobox-list` | yes | **none** | 12px | **0px** |
| `.p` in `.ds.combobox-list` | yes | **none** | 12px | **0px** |

**Component rows still carrying a measure: 0.** Tabs items no longer appear at
all — previously `721.92px`. Combobox options previously carried a `2.851px`
prose compensation and a `631.68px` measure; both are gone.

**FileUpload residual, attributed independently.** I did not take the claim on
trust. The mapper sets padding, margin and measure in one rule, so a row with
`max-inline-size: none` cannot be matching it. Reading the source confirms the
source directly:
`packages/react/ds-global-form/src/lib/subcomponent/FileUploadInput/styles.css`
declares `--file-item-content-block-size`, `--file-item-painted-block-size` and a
private `--file-item-compensation-block-end: mod(...)` on
`& > .file-list > .file-item`. The 0.149px and 1.702px are that private
pre-retrofit ledger. It is allowlisted `formula-owner` debt and is Stage 6 work.

**Bounded scope, worth knowing before Stage 6.** The `.p` exclusion is scoped to
list rows only, so `.ds p` and `.ds .p` still resolve to `6.456px / 1.544px /
721.92px`. That is correct for prose inside a panel — Accordion and
ContextualMenu content depend on it — but a Stage 6 author who reaches for `<p>`
or `.p` as a *row label* will inherit prose geometry. Not a defect; a note for
the retrofit authors.

### Q9 — enforcement completeness

**Pass**, with one residual heuristic limit (§7, R1).

Re-ran every deliberate fixture from the prior review plus eleven new ones, by
driving the exported `findCssContractViolations`:

| # | Fixture | Prior | Now | Rule fired |
|---|---|---|---|---|
| G1 | `font: 700 0.875rem/1.25rem "Ubuntu Sans"` | missed | **caught** | `font-size-declaration`, `font-size-literal`, `typography-override` |
| G2 | `font-family: var(--typography-text-primary-code-font-family)` | missed | **caught** | `non-body-type-role`, `typography-override` |
| G3 | `font-size: var(--typography-heading-3-font-size)` | caught | caught | `font-size-declaration`, `non-body-type-role` |
| G4 | `--ds-row-line-height: 1.25rem` | missed | **caught** | `shared-contract-override`, `typography-override` |
| G5 | cross-role nudge under a private alias | missed | **caught** | `non-body-type-role` |
| G6 | `aspect-ratio: 1` | missed | **caught** | `block-target` |
| G7 | `'block-size:1' + 'cap'` (one line) | missed | **caught** | `cap-derived-oracle` |
| G8 | same-line `.not.toContain` bypass | missed | **caught** | `cap-derived-oracle` |
| G9 | `round(down, …)` private modulo ledger | missed | **caught** | `formula-owner` |
| G12 | `1cap` in a multi-line template literal | — | caught | `cap-derived-oracle` |
| G13 | `--ds-row-padding-block-start: 0.5rem` | — | caught | `shared-contract-override` |
| G14 | overrides a published role nudge | — | caught | `formula-owner` |
| G16 | `line-height: 1.2` alone | — | caught | `typography-override` |
| G17 | `font` shorthand naming role variables | — | caught | three rules |
| G18 | Lit nine geometry properties, nested path | — | caught | `geometry-footprint` (aggregated) |
| G19 | `inset-block: 0; block-size: 2rem` | — | caught | `block-target` |
| G20 | `min-block-size: var(--ds-row-occupied-block-size)` | — | caught | `block-target` |
| G11 | **cross-line** `const unit =\n '1' +\n 'cap';` | — | **missed** | see §7 R1 |
| G15 | `--typography-text-measure: 40ch` | — | **missed** | see §7 R2 |
| N1 | correct `--ds-row-*` consumer | clean | clean | — |
| N2 | `expect(css).not.toContain("1cap")` | clean | clean | — |
| N3 | `font: inherit; block-size: auto; min-block-size: 0` | — | clean | — |

**All nine prior gaps are closed. Zero false positives on the three negatives.**

Two new rules carry most of the work. `typography-override` fires on `font`,
`font-family`, `line-height` and any `--*font-family|font-size|line-height|start-nudge`
custom property in component CSS whose value is not `inherit`; it is classifiable,
so a reviewed heading or code role remains possible. `shared-contract-override`
fires on any `--ds-row-*` property outside the three allowed inputs and is
deliberately **not** classifiable — a hard rule with zero allowlist entries, so
no component currently overrides a derived ledger output and none ever can.

**Root coverage.** `AFFECTED_PACKAGE_ROOTS` is now the full 14. The prior
review's eight omissions are all present, and `packages/react/tokens` is recorded
in an explicit `QUARANTINED_PACKAGE_ROOTS` export whose comment reads "never turn
an omitted root into an exemption" — the omission-versus-exemption ambiguity is
gone. Its real check reports **0 raw diagnostics**, so the quarantine is
effective rather than nominal.

**Seed cleanliness.** `SEED_INPUT_PATHS` now spans all 14 roots plus
`ALIGNMENT_CONTRACT`, `COMPONENT_CONTRACT`, `CLASSIFICATIONS_PATH` **and**
`scripts/check-css-contract.ts` and `scripts/check-css-contract.test.ts`. The
detector cannot be edited in the same dirty tree that seeds the list it enforces.

`bun test scripts/check-css-contract.test.ts` → **39 pass, 0 fail, 85 expect()
calls**, reproduced exactly.

### Q11 — transition gate

**Pass.**

**Unique first seed.**

```
git log --all --oneline -- config/css-contract-allowlist.json
  9d20a70e0 feat(styles): seed decreasing contract debt gate      (1 commit)
git log --all --diff-filter=D -- config/css-contract-allowlist.json
  (none)
git log --all --oneline -- config/css-contract-classifications.json
  520f09c84 fix(chip): stabilize classified inline floors          (1 commit)
git log --all --diff-filter=D -- config/css-contract-classifications.json
  (none)
git rev-parse --is-shallow-repository → false
```

Both files were added exactly once, never deleted, never recreated. `520f09c84`
is the seed commit's first parent, so classifications precede the seed and are
subtracted from it rather than added afterwards.

**Counts, reproduced from a clean run of the global check:**

```
✓ CSS contract: 774 raw diagnostics, 25 sanctioned, 749 transition identities.
exit 0
```

`774 − 25 = 749`. The committed file holds **749 entries, 749 unique ids, and a
total occurrence count of 749** — every identity has count 1, so no duplicate
declaration is hiding inside an aggregate.

| Rule | Identities |
|---|---|
| `dimension-primitive` | 275 |
| `typography-override` | 175 |
| `block-target` | 76 |
| `font-size-declaration` | 73 |
| `formula-owner` | 64 |
| `non-body-type-role` | 36 |
| `font-size-literal` | 18 |
| `geometry-footprint` | 18 |
| `cap-derived-oracle` | 8 |
| `inline-minimum` | 6 |
| `shared-contract-override` | **0** |

The eight `cap-derived-oracle` identities are the seven legacy per-component
suites plus `Badge.spacing.tests.ts` — exactly the Stage 8 retarget list, and
countable.

**Classifications: 25, exact, used, stable.** `validateClassifications` returns
zero shape errors; none lacks a reason or evidence; the CLI exits non-zero on any
stale classification and exits 0, so all 25 match a live diagnostic. They span 18
files and only the two classifiable geometry rules — 18 `block-target`, 7
`inline-minimum`. No formula, font-size or role fact was sanctioned.

**Monotonicity, driven through the real API:**

| Mutation | Rejected |
|---|---|
| grow one entry's count by 1 | yes |
| append one entry | yes |
| append one classification | yes |

**Per-root added-identity rejection — all 14:**

```
rejects  packages/lit/ds-prototype          scoped= 35
rejects  packages/react/ds-app              scoped= 20
rejects  packages/react/ds-app-anbox        scoped=  2
rejects  packages/react/ds-app-landscape    scoped=  2
rejects  packages/react/ds-app-launchpad    scoped= 29
rejects  packages/react/ds-app-lxd          scoped=  2
rejects  packages/react/ds-app-portal       scoped=  2
rejects  packages/react/ds-global           scoped=187
rejects  packages/react/ds-global-form      scoped= 98
rejects  packages/react/tokens              scoped=  0
rejects  packages/svelte/ds-app             scoped=  0
rejects  packages/svelte/ds-app-launchpad   scoped=311
rejects  packages/svelte/ds-global          scoped= 11
rejects  packages/svelte/ds-app-wpe         scoped= 50
```

The scoped slices sum to exactly 749, so `scopeAllowlist` partitions the list
without loss or overlap. Injecting one synthetic valid identity into any root
produces a `New violation` error for that root.

**Package wiring — every affected package's real `check:webarchitect`:**

All 14 wired (`webarchitect … && bun run ../../../scripts/check-css-contract.ts
--package <root>`) and all 14 exit 0, with per-root raw diagnostic counts of 37,
23, 2, 2, 29, 2, 2, 194, 103, 0, 2, 317, 11, 50. This is the real script, not a
simulation. `packages/svelte/ds-app` shows 2 raw diagnostics against 0 scoped
allowlist entries — both are classified, which is consistent.

**Chip floor bridge — algebra checked, deadlock avoided.**

Standalone. Old floor:
`--_chip-painted-block-size + 2·--_chip-border-width`, where
`--_chip-painted-block-size = L + 2·max(0, N − b) + 2·b`.
New floor: `--ds-row-painted-block-size + 2·--ds-row-border-inline`, where the
shared painted size is `L + max(0, N − b_s) + max(0, N − b_e) + b_s + b_e`. The
bridge sets `b_s = b_e = --ds-row-border-inline = --_chip-border-width`, so the
two expressions are **term-for-term identical**.

Nested. `--_chip-nested-line-height = L − B`;
`--_chip-nested-padding-block = max(0, (L − (L − B))/2) = B/2`;
`--_chip-nested-painted-block-size = (L − B) + 2·(B/2) = L`. The old floor is
therefore `L + 2·b`, and the new expression
`--ds-row-line-height + 2·--ds-row-border-inline` is also `L + 2·b`. **Exact.**
The nested variant paints with `border: 0` and an inset `box-shadow`, and
correctly inherits the bridge's `--ds-row-border-inline` from `.ds.chip`.

Why this avoids the deadlock: classifications are deletion-only, so a
classification written against the *private* expression would have to be deleted
and re-added when Stage 6 removes the private ledger — which the growth guard
forbids. Both Chip classifications are written against the **final shared**
expressions, so they survive Stage 6 unchanged. That is the correct way out.

Evidence that geometry did not move: `520f09c84` touches only
`config/css-contract-classifications.json` and `Chip/styles.css`. The Chip oracle
and suite are untouched, and `Chip.spacing.pw.ts` passes **12/12** across
Chromium, Firefox and WebKit at DPR 1/2 and 16px/18px roots after the bridge.

One bounded consequence, recorded rather than blocking: the bridge makes the
shared and private ledgers coexist on `.ds.chip`. They are numerically equal on
the default path, but a consumer overriding `--chip-line-height`,
`--chip-start-nudge` or `--chip-padding-block` would move the private block
ledger while the inline floor follows the shared one. Those are exactly the
public hooks the contract withdraws in Stage 6, and `--chip-border-width` is not
affected because the bridge reads it. No action needed; Stage 6 removes the
divergence by construction.

### Q13 — independent browser evidence

**Pass.**

`SharedContracts.spacing.pw.ts` reproduced at **54/54** across Chromium 149,
Firefox 151 and WebKit 26.5 at DPR 1 and 2, in 48.8s. The 54 are 9 cases × 6
projects: three unparameterized contract cases plus three parameterized cases at
16px and 18px roots. The production typography entry case is one of those three,
so it contributes **12 production configurations** (2 roots × 6 projects) inside
the 54.

**Occupied-block modulo is the exact primary control.** The suite computes
`nominalOccupiedBlock = paddingStart + lineHeight + marginEnd` and asserts
`nominalOccupiedError <= layoutSubpixelEnvelope`, where that envelope is `1/32`
px — used-CSS-length precision, not a fitted number. Rendered occupied size and
its grid error are asserted separately against the engine envelope.

**Three separate, justified terms** replace the prior single conflated bound:

```ts
const layoutSubpixelEnvelope = 1 / 32;
const engineLineBoxQuantizationEnvelope =
  testInfo.project.use.browserName === "chromium" ? 1 : 0.5;
const occupiedEnvelope =
  layoutSubpixelEnvelope + engineLineBoxQuantizationEnvelope;
const reviewedCapTechniqueEnvelope = (0.4 / 18) * rootSize;
const markerEnvelope = occupiedEnvelope + reviewedCapTechniqueEnvelope;
```

Each term is attributed in the comment above it. The cap term is scaled by the
rem anchor rather than fixed, which is precisely the correction the prior review
asked for — it noted the 0.4px figure was root-size dependent, and 0.4px is now
its value *at* an 18px root.

**No test reimplements `1cap`.** `SharedContracts.spacing.pw.ts` contains zero
occurrences of `1cap`. The seven legacy per-component suites still do; those are
the eight allowlisted `cap-derived-oracle` identities and are Stage 8 work.

**WebKit route works.** `addStyleTag({ url })` is replaced by
`await import(moduleUrl)` against Vite's `/@fs` CSS module endpoint, with a
comment naming the WebKit failure it avoids. WebKit passes 18/18; previously it
failed 8.

**Deliberate wrong-value controls are real and cover every governed role.** For
`p`, `h1`–`h6` and `pre` (the code role), the suite:

- shifts the start nudge by a live half-grid-cycle delta computed from the
  measured remainder — so a bad value cannot accidentally land on a grid line —
  then asserts `baselineError > markerEnvelope` **and**
  `nominalOccupiedError > layoutSubpixelEnvelope`;
- shifts the end nudge by half a baseline, then asserts the baseline offset is
  *unchanged* within `1/32` px while `nominalOccupiedError` still exceeds the
  envelope.

The second control is the sharper of the two: it proves the end nudge governs
occupied height without touching first-baseline placement, which no tautological
assertion could show. Eight roles × two controls × 12 configurations.

**List negatives are asserted exactly**, not approximately: both
`[data-component-list-item]` (`li.ds.p`) and `[data-component-list-descendant]`
(`.ds li.p`) must equal `{ marginEnd: 0, maxInlineSize: "none", paddingStart: 0 }`.

The one remaining agree-by-construction assertion —
`|paddingStart − startNudge| <= 1/32` — is now correctly bounded to layout
precision and is explicitly a consumption check, sitting beside two independent
controls rather than standing in for them.

## 5. Occupied-block matrix

Three engines, 16px and 18px roots, measured against the live production entry
with an independent zero-size inline baseline marker. `nominal` is
`padding-start + line-height + margin-end`; `rendered` is `border box + margin-end`;
each error is the distance to the nearest `--spacing-baseline` multiple.

**Nominal occupied error — the primary grid invariant**

| Engine | Root | Max nominal error | Envelope (1/32) |
|---|---|---|---|
| Chromium | 16px | **0** | 0.03125 |
| Chromium | 18px | **0** | 0.03125 |
| Firefox | 16px | **0** | 0.03125 |
| Firefox | 18px | **0** | 0.03125 |
| WebKit | 16px | 0.01275 | 0.03125 |
| WebKit | 18px | 0.01275 | 0.03125 |

**Per-role nominal occupied block (identical in all three engines)**

| Role | 16px root | baselines | 18px root | baselines |
|---|---|---|---|---|
| `p`, `.p`, `h5`, `h6`, `pre`, `li` | 32px | 4 | 36px | 4 |
| `h1`, `h2` | 56px | 7 | 63px | 7 |
| `h3`, `h4` | 40px | 5 | 45px | 5 |
| `docs-p`, `app-p` | 24px | 6 | 27px | 6 |

**Rendered and marker errors, reported separately**

| Engine | Root | Max rendered error | Max marker error | Marker envelope |
|---|---|---|---|---|
| Chromium | 16px | 0.0121 | 0.8594 (`docs-p`) | 1.387 |
| Chromium | 18px | 0.0130 | 0.7500 (`p`) | 1.431 |
| Firefox | 16px | 0.5083 (`li`) | 0.5500 (`h1`) | 0.887 |
| Firefox | 18px | 0.5000 (`li`) | 0.3667 (`h1`) | 0.931 |
| WebKit | 16px | 0.0156 | 0.5625 (`h1`) | 0.887 |
| WebKit | 18px | 0.0156 | 0.3750 (`h1`) | 0.931 |

Readings.

- **Nominal occupied error is zero or within 0.013px everywhere.** The ledger
  is exact; rhythm does not accumulate. This is the invariant that matters for
  Stage 6, and it is clean.
- **Marker error is engine line-box placement, exactly as decomposed.** The
  worst case, 0.8594px on the Docs role in Chromium at a 16px root, is Chromium
  rounding the in-line-box baseline to a whole CSS pixel against a 4px grid unit.
  It sits well inside the declared envelope and is not a cap-technique effect.
- **Firefox gives list items a 0.5px taller line box** than the equivalent
  paragraph (`li` rendered 32.5083 vs `p` 32.0083 at a 16px root). This was
  noted as N2 in the prior review; it is now inside an explicit, engine-scoped
  envelope rather than hidden, and its nominal occupied error is still 0.
- **The list negatives and the Chip floor bridge did not alter accepted block
  geometry.** Every per-role occupied value above matches the prior review's
  section 5 matrix to the digit, and `Chip.spacing.pw.ts` passes 12/12 on its
  untouched oracle.

## 6. Seed, classification and package-wiring audit

| Check | Result |
|---|---|
| Allowlist commits (all refs) | 1 — `9d20a70e0` |
| Allowlist deletions ever | none |
| Classification commits (all refs) | 1 — `520f09c84`, the seed's first parent |
| Classification deletions ever | none |
| Repository shallow | false |
| Governed seed inputs dirty | none (only the preserved MSW file is modified) |
| Seed inputs include the detector source | yes — `check-css-contract.ts` and its test |
| Raw diagnostics | 774 |
| Used classifications | 25 |
| Stale classifications | 0 (CLI exits non-zero on any; it exits 0) |
| Transition identities | 749 |
| Unique allowlist ids | 749 |
| Total occurrence count | 749 (every identity count = 1) |
| Sum of the 14 scoped slices | 749 |
| Classification shape errors | 0 |
| Classifications lacking reason or evidence | 0 |
| Classifiable rules used | `block-target` (18), `inline-minimum` (7) only |
| `shared-contract-override` allowlist entries | 0 — hard rule, no existing debt |
| Affected roots | 14 |
| Roots wired to the guard | 14 / 14 |
| Roots exiting 0 with the committed allowlist | 14 / 14 |
| Roots rejecting one added identity | 14 / 14 |
| Allowlist count growth rejected | yes |
| Allowlist entry addition rejected | yes |
| Classification addition rejected | yes |
| Quarantine | `packages/react/tokens`, explicit export, 0 raw diagnostics |
| `push.yml` scope | `fetch-depth: 0` on the `check` job only; `build` and `test` remain at 1, with a rationale comment |

**Unit evidence reproduced**

| Suite | Claimed | Reproduced |
|---|---|---|
| `packages/styles/typography` | 20/20 | **20/20** (5 files) |
| `scripts/check-css-contract.test.ts` | 39/39, 85 assertions | **39/39, 85 expect() calls** |
| `packages/styles/main` | 8/8, 70 assertions | **8/8, 70 expect() calls** |
| ContextualMenu focused Vitest | 5/5 | **5/5** |
| `SharedContracts.spacing.pw.ts` | 54/54 | **54/54** in 48.8s |
| `Chip.spacing.pw.ts` | 12/12 | **12/12** in 45.4s |

The typography "230 assertions" figure could not be reproduced because Vitest
does not report an assertion count; the 20/20 test count is confirmed. Bun's
reporter supplies the counts for the two Bun suites, and both match exactly.

**ContextualMenu bound**, now classifiable and classified:

```css
max-block-size: calc(100dvh - 2 * var(--ds-floating-surface-viewport-inset));
```

The alias is published once by `component-contract.css` line 81
(`--ds-floating-surface-viewport-inset: var(--dimension-200)`), which is the only
file permitted to name a primitive. No `--dimension-*` reference and no `16px`
literal remain in the component. Its classification records the keyboard-visibility
reason, and its paired `min-width: var(--contextual-menu-min-width)` is separately
classified as a surface bound.

## 7. Smallest remaining correction sequence

Neither item blocks Stages 5–8. Both belong with the Stage 8 suite work.

**R1 — P2 — the cap-oracle detector is a line-local heuristic, and the
"cross-line constructed `1cap`" case is not actually covered.**

`staticStringConstants` matches `const NAME = <initializer>` with
`/\bconst\s+([A-Za-z_$][\w$]*)\s*=\s*([^;\r\n]+)\s*;?/g`. The `[^;\r\n]+` class
stops at a newline, so an initializer spread over lines is never resolved.
Bounded precisely:

| Construction | Detected |
|---|---|
| `const unit = '1' + 'cap';` then `` `block-size: ${unit}` `` | **yes** |
| `const unit =\n  '1' +\n  'cap';` | no |
| `const unit = '1' + // c\n 'cap';` | no |
| `const unit = ['1','cap'].join('');` | no |
| `` `block-size:1${String.fromCharCode(99,97,112)}` `` | no |

The single-line form — the one that would occur by accident — is caught, and
that is a real improvement. The remaining forms require deliberate obfuscation
inside a test file, and the last two cannot be closed by any static-string
resolver. Smallest fix: allow newlines in the initializer class, which converts
rows 2 and 3 to detected. Rows 4 and 5 should instead be acknowledged in the
rule's own comment: this is defence in depth, and the actual guarantee is the
independent baseline marker and the exact occupied-block modulo verified in
Q13 — both of which I reproduced passing.

**R2 — P3 — a component can still override `--typography-text-measure`.**

`.ds.probe { --typography-text-measure: 40ch; }` in component CSS fires no rule.
It is not a `--ds-row-*` property, so `shared-contract-override` does not see it,
and it does not match the `typography-override` name pattern
(`font-family|font-size|line-height|start-nudge`). The measure is an inline
contract output, not block geometry, so nothing in the occupied-block ledger is
at risk. Smallest fix: add `--typography-text-measure` to the
`shared-contract-override` protected set — a one-line change, and its zero
current allowlist entries mean it costs no seeding.

**Suggested sequencing.** Fold R1 and R2 into the Stage 8 commit that retargets
the seven legacy cap-oracle suites, since that commit already removes the eight
`cap-derived-oracle` allowlist identities and is the natural home for detector
hardening. Neither needs a re-review of its own; the Stage 8 review covers both.

---

## Authorization

**Stages 5–8 are authorized to proceed.** Component retrofit work may begin on
`feat/bf-shared-alignment`.

Every prior blocking finding is closed with reproduced evidence. The transition
gate is seeded once at 749 identities, is strictly decreasing by construction,
is wired into all 14 affected packages, and rejects an added identity in every
one of them. The occupied-block ledger is exact in three engines at both root
sizes, and the browser evidence rests on an independent marker and a
half-grid-cycle wrong-value control rather than on the implementation's own
formula.

The two residual items in §7 are non-blocking and are assigned to Stage 8.

**Still prohibited:** merge, push, publication and release. This review is not a
component-parity or migration-closeout acceptance. Each Stage 6 retrofit must
remove its own allowlist entries, and
`config/css-contract-allowlist.json` must be empty and deleted before closeout.
`feat/bf-metric-nudge` remains read-only until its reusable hunks are adapted
under the prior review's §8 ledger.
