# Research: Body-line text phase

## Sources

- Pragma rule, read-only reference:
  `feat-024-semantic-spacing-token-schema/specs/024-semantic-spacing-token-schema/contracts/semantic-spacing-schema.md`,
  section “The rhythm correction has two terms, at opposite edges” (lines
  410–567; owner decision at line 523), and `implementation-handover.md` section
  “7. T004d2 – the two rhythm terms” (lines 322–430). Both live in the sibling
  worktree `H:\WSL_dev_projects\baseline-foundry-worktrees\feat-024-semantic-spacing-token-schema`.
- Owner decision, 2026-09-28: use the product body line as the rhythm step and
  accept full in-phase closure; the stronger common body-line phase governs.
- Owner direction for BF, 2026-09-30: “I'd like to see the in-phase headings
  vs paragraphs work we just did on pragma implemented on bf too.” Approves
  the Phase A opt-in in BF only (D2).
- Adversarial review of this package, 2026-09-30: independent numbers in
  [R2](#independent-cross-check) and the corrections applied throughout.
- BF metric model: `@lyubomir-popov/baseline-nudge-generator` 1.5.1,
  `src/nudge-generator.js` `calculateNudgeRem` (lines 57–101); `readFontMetrics`
  is exported from `src/index.js`.
- BF ledger: `src/build.ts` `toTypographyToken` (line 311, `marginBottom =
  bU − nudgeTop`); `src/css.ts` `textRule` (line 104), `roleVarDeclarations`
  (line 111), `SEMANTIC_SELECTORS_BY_ROLE` (line 201), `.bf-prose li` rule
  (line 543); `scripts/validate-build.ts` lines 376–379;
  `scripts/verify-component-behavior.ts` lines 506–512.

What BF takes from Pragma is the rule: two element-owned terms at opposite
edges, rounding up only, a per-context step, and the owner's closure ruling.
BF does not take Pragma's property names, cap estimate, measurements or
tolerances.

## R1 – BF metric model and the first-baseline offset

The generator computes, for font size `fs` and line height `lh` in rem:

```text
b     = (lh − (ascent + |descent| + lineGap) · fs / upm) / 2
        + ascent · fs / upm + (lineGap · fs / upm) / 2
nudge = ceil(b / bU) · bU − b − drift,   drift = (0.0625 / fs) · max(0, fs − 1)
        (drift applied only when the raw nudge > 0; result wrapped into [0, bU))
```

Ubuntu Sans (`assets/fonts/UbuntuSans[wdth,wght].ttf`, read with the exported
`readFontMetrics`) reports ascent 940, descent −260, lineGap 0, upm 1000, so
for every built-in role:

```text
b = lh / 2 + 0.34 · fs
```

`b + nudge` is therefore a bU grid line minus the drift compensation, not the
grid line itself. The drift is 0 at 1rem and below, 0.00694rem at 1.125rem,
0.02083rem at 1.5rem, 0.03125rem at 2rem and 0.03869rem at 2.625rem.

**Technical decision T1 – phase is measured from the grid target.** Define

```text
F* = bU · ceil(b / bU − 1e-9)
```

the bU grid line the generator's nudge is designed to seat the first
baseline on (`calculateNudgeRem` targets `ceil(b / bU)` before subtracting
the drift compensation). Drift is always below 0.0625rem, so for every
built-in role this equals `bU · round((b + nudge) / bU)`, the rule first
used here; the ceil form stays correct when drift exceeds half a bU (a bU
below 0.125rem with type above 2rem), where rounding would pick the line
below and make the phase one bU off. Round-down would make the phase one bU
too large for every role with drift compensation.

Why F* rather than raw `b + nudge`: F* and `step` are both whole bU
multiples, so every phase is a whole bU multiple too. The opt-in then
translates each element by whole grid units and leaves the existing rendered
residual ε exactly as it is – it neither improves nor worsens the nudge.
Using raw `b + nudge` would fold the drift into the phase (editorial h1
would get `roundUp(2.46131, 1.5) − 2.46131 = 0.53869rem` instead of
`0.5rem`), making phase a non-grid value and changing every residual. This is
not a claim that the drift compensation is right: in current Chromium it
over-corrects above 1rem (R2 cross-check), which is recorded as
metric-authority data.

## R2 – Per-tier values at a 16px root

`step` is the body line height. `phase = roundUp(F*, step) − F*`.
`closure = roundUp(nudge + phase + lh, step) − (nudge + phase + lh)`. Current
occupied is `nudge + lh + (bU − nudge) = lh + bU`; opt-in occupied is
`nudge + phase + lh + closure`. All values rem unless marked.

### Editorial – bU 0.5, step 1.5 (3 bU)

| Role | fs / lh | b | nudge | F* | Phase | Closure | Occupied now → opt-in |
|---|---|---:|---:|---:|---|---|---|
| body, h5, h6 | 1 / 1.5 | 1.09 | 0.41 | 1.5 | ⌈1.5⌉ − 1.5 = 0 | ⌈1.91⌉ − 1.91 = 1.09 | 2 (32px) → 3 (48px) |
| h3, h4 | 1.5 / 2 | 1.51 | 0.46917 | 2.0 | ⌈2.0⌉ − 2.0 = 1.0 | ⌈3.46917⌉ − 3.46917 = 1.03083 | 2.5 (40px) → 4.5 (72px) |
| h1, h2 | 2.625 / 3 | 2.3925 | 0.06881 | 2.5 | ⌈2.5⌉ − 2.5 = 0.5 | ⌈3.56881⌉ − 3.56881 = 0.93119 | 3.5 (56px) → 4.5 (72px) |

### Documentation – bU 0.25, step 1.25 (5 bU)

| Role | fs / lh | b | nudge | F* | Phase | Closure | Occupied now → opt-in |
|---|---|---:|---:|---:|---|---|---|
| body | 0.875 / 1.25 | 0.9225 | 0.0775 | 1.0 | ⌈1.0⌉ − 1.0 = 0.25 | ⌈1.5775⌉ − 1.5775 = 0.9225 | 1.5 (24px) → 2.5 (40px) |
| h5, h6 | 1.125 / 1.5 | 1.1325 | 0.11056 | 1.25 | 0 | ⌈1.61056⌉ − 1.61056 = 0.88944 | 1.75 (28px) → 2.5 (40px) |
| h3, h4 | 1.5 / 2 | 1.51 | 0.21917 | 1.75 | ⌈1.75⌉ − 1.75 = 0.75 | ⌈2.96917⌉ − 2.96917 = 0.78083 | 2.25 (36px) → 3.75 (60px) |
| h1, h2 | 2 / 2.5 | 1.93 | 0.03875 | 2.0 | ⌈2.0⌉ − 2.0 = 0.5 | ⌈3.03875⌉ − 3.03875 = 0.71125 | 2.75 (44px) → 3.75 (60px) |

### App – bU 0.25, step 1.25 (5 bU)

| Role | fs / lh | b | nudge | F* | Phase | Closure | Occupied now → opt-in |
|---|---|---:|---:|---:|---|---|---|
| body, h5, h6 | 0.875 / 1.25 | 0.9225 | 0.0775 | 1.0 | 0.25 | 0.9225 | 1.5 (24px) → 2.5 (40px) |
| h3, h4 | 1.125 / 1.5 | 1.1325 | 0.11056 | 1.25 | 0 | 0.88944 | 1.75 (28px) → 2.5 (40px) |
| h1, h2 | 1.5 / 2 | 1.51 | 0.21917 | 1.75 | 0.75 | 0.78083 | 2.25 (36px) → 3.75 (60px) |

### OS – bU 0.25, step 1.0 (4 bU)

| Role | fs / lh | b | nudge | F* | Phase | Closure | Occupied now → opt-in |
|---|---|---:|---:|---:|---|---|---|
| body, h5, h6 | 0.75 / 1 | 0.755 | 0.245 | 1.0 | 0 | ⌈1.245⌉ − 1.245 = 0.755 | 1.25 (20px) → 2 (32px) |
| h3, h4 | 1 / 1 | 0.84 | 0.16 | 1.0 | 0 | ⌈1.16⌉ − 1.16 = 0.84 | 1.25 (20px) → 2 (32px) |
| h1, h2 | 1.5 / 1.5 | 1.26 | 0.21917 | 1.5 | ⌈1.5⌉ − 1.5 = 0.5 | ⌈2.21917⌉ − 2.21917 = 0.78083 | 1.75 (28px) → 3 (48px) |

`⌈x⌉` denotes `roundUp(x, step)` for the tier. The body rows reproduce the
Pragma headline changes – Site paragraph 32→48px, Docs/App paragraph
24→40px, Site h1 56→72px – from BF's own metrics; they are consistent, not
borrowed. Documentation and App body phase is 0.25rem (4px) because
`F* = 1.0rem` sits one bU before the 1.25rem body line.

Every closure is close to a full body line because the nudge is non-zero, so
`nudge + phase + lh` always spills just past a step. That is the blank body
line the owner accepted.

### Independent cross-check

From the adversarial review, 2026-09-30. Metrics read through the
generator's `readFontMetrics` (hhea 940 / −260 / 0, upm 1000; OS/2
`useTypoMetrics` true; win 1020/223); nudges from the generator's
`calculateNudgeRem`. Every value matches R2 and the contract table.

**The ε columns are generator metric-authority data, not acceptance.** ε is
the rendered first baseline minus F*, in px, measured in Playwright Chromium
on Windows at DPR 1 with zero-height inline-block probes, against both a
synthetic page and the `main` build's `dist/tiers/*/styles.css`. It comes from
Chromium rounding ascent, descent and half-leading to whole pixels plus the
drift over-correction; the opt-in carries it unchanged (R1). “Floor F*” is F*
if rounded down instead of to nearest.

| Tier (step) | Roles | fs / lh | b | nudge | drift | F* | Phase | Closure | Occupied now → opt-in | lh mod step | Floor F* | ε @16px (data) | ε @32px (data) |
|---|---|---|---:|---:|---:|---:|---:|---:|---|---:|---|---:|---:|
| Ed (1.5) | body, h5, h6 | 1 / 1.5 | 1.09 | 0.41 | 0 | 1.5 | 0 | 1.09 | 32 → 48px | 0 | same | −0.453 | +0.109 |
| Ed | h3, h4 | 1.5 / 2 | 1.51 | 0.46917 | 0.02083 | 2.0 | 1.0 | 1.03083 | 40 → 72px | 0.5 ✗ | 1.5 (wrong) | −0.500 | −1.000 |
| Ed | h1, h2 | 2.625 / 3 | 2.3925 | 0.06881 | 0.03869 | 2.5 | 0.5 | 0.93119 | 56 → 72px | 0 | 2.0 (wrong) | −0.906 | −1.813 |
| Doc (1.25) | body | 0.875 / 1.25 | 0.9225 | 0.0775 | 0 | 1.0 | 0.25 | 0.9225 | 24 → 40px | 0 | same | −0.766 | −0.531 |
| Doc | h5, h6 | 1.125 / 1.5 | 1.1325 | 0.11056 | 0.00694 | 1.25 | 0 | 0.88944 | 28 → 40px | 0.25 ✗ | wrong | −0.234 | −0.469 |
| Doc | h3, h4 | 1.5 / 2 | 1.51 | 0.21917 | 0.02083 | 1.75 | 0.75 | 0.78083 | 36 → 60px | 0.75 ✗ | wrong | −0.500 | −1.000 |
| Doc | h1, h2 | 2 / 2.5 | 1.93 | 0.03875 | 0.03125 | 2.0 | 0.5 | 0.71125 | 44 → 60px | 0 | wrong | −0.391 | −1.766 |
| App (1.25) | body, h5, h6 | 0.875 / 1.25 | 0.9225 | 0.0775 | 0 | 1.0 | 0.25 | 0.9225 | 24 → 40px | 0 | same | −0.766 | −0.531 |
| App | h3, h4 | 1.125 / 1.5 | 1.1325 | 0.11056 | 0.00694 | 1.25 | 0 | 0.88944 | 28 → 40px | 0.25 ✗ | wrong | −0.234 | −0.469 |
| App | h1, h2 | 1.5 / 2 | 1.51 | 0.21917 | 0.02083 | 1.75 | 0.75 | 0.78083 | 36 → 60px | 0.75 ✗ | wrong | −0.500 | −1.000 |
| OS (1.0) | body, h5, h6 | 0.75 / 1 | 0.755 | 0.245 | 0 | 1.0 | 0 | 0.755 | 20 → 32px | 0 | same | −0.094 | −0.172 |
| OS | h3, h4 | 1 / 1 | 0.84 | 0.16 | 0 | 1.0 | 0 | 0.84 | 20 → 32px | 0 | same | −0.453 | +0.109 |
| OS | h1, h2 | 1.5 / 1.5 | 1.26 | 0.21917 | 0.02083 | 1.5 | 0.5 | 0.78083 | 28 → 48px | 0.5 ✗ | wrong | −0.500 | −1.000 |

Consequences:

- No negative phases or closures; the smallest closure is 0.71125rem.
- |ε| exceeds 0.51px at a 16px root (Documentation and App body −0.766,
  Editorial h1/h2 −0.906) and reaches 1.813px at 32px, and relative spreads
  between roles reach 1.92px. An absolute phase tolerance cannot pass, which
  is why the rendered checks are differential (technical decision T5).
- Without drift compensation editorial h1 would be off by −0.29px; with it,
  −0.91px. BF's Documentation body ε is the same −0.766px Pragma measured,
  so that figure is engine rounding, not a property of either metric model.
- The IBM Plex and Ubuntu experiment surfaces pass every contract build-time
  check.

## R3 – Whole-multiple predicate and wrapped exceptions

Phase lifts line 1 onto the step for every role. Line `k` sits at
`F* + phase + (k − 1) · lh`, so it stays in phase only when
`lh mod step = 0`. The same predicate makes closure independent of line count.

| Tier | Qualifying | Exceptions (wrapped only) |
|---|---|---|
| Editorial | h1, h2, h5, h6 | h3, h4 |
| Documentation | h1, h2 | h3, h4, h5, h6 |
| App | h5, h6 | h1, h2, h3, h4 |
| OS | h3, h4, h5, h6 | h1, h2 |

Editorial, Documentation and App match Pragma's Site, Docs and App columns.
Twelve of the 24 tier/heading combinations qualify; twelve are exceptions.
One-line alignment holds for all 24. Cross-size evidence (heading size differs
from body) is Editorial h1–h4, Documentation h1–h6, App h1–h4 and OS h1–h4;
same-size rows are formula controls.

Predicted wrapped error, as nearest distance to a step at a 16px root:

| Exception | Line 2 offset | Line 3 offset | Following content after n lines |
|---|---|---|---|
| Editorial h3/h4 | 2 mod 1.5 = 0.5rem (8px) | 4 mod 1.5 = 1.0 → 0.5rem (8px) | `(n − 1) · 2 mod 1.5` |
| Documentation h3/h4 | 2 mod 1.25 = 0.75 → 0.5rem (8px) | 4 mod 1.25 = 0.25rem (4px) | `(n − 1) · 2 mod 1.25` |
| Documentation h5/h6 | 1.5 mod 1.25 = 0.25rem (4px) | 3 mod 1.25 = 0.5rem (8px) | `(n − 1) · 1.5 mod 1.25` |
| App h1/h2 | 0.5rem (8px) | 0.25rem (4px) | as Documentation h3 |
| App h3/h4 | 0.25rem (4px) | 0.5rem (8px) | as Documentation h5 |
| OS h1/h2 | 1.5 mod 1 = 0.5rem (8px) | 3 mod 1 = 0 (in phase) | `(n − 1) · 1.5 mod 1` |

The explicit failure proofs use two lines: editorial h3, documentation h3,
app h1 and os h1 each predict 8px at 16px and 16px at 32px. They are measured
on `line 2 − line 1` (distance to the nearest whole step), not on absolute
phase, so engine rounding of the first baseline cancels.

## R4 – Cascade and specificity

Base role rules are `:where(.bf-theme) :where(<tag>)` (0,0,0) and
`:where(.bf-theme) .bf-<role>` (0,1,0). Opt-in rules keep those
specificities – `:where(.bf-theme.is-body-line-rhythm) :where(.bf-prose) >
:where(<tag>)` and `… > .bf-<role>` – and are emitted later, so they win at
equal specificity; a role class still beats a bare tag in either direction,
so `<p class="bf-h3">` takes h3 terms and `<h3 class="bf-body">` takes body
terms. The cap-engine exclusion `:not(:where(…))` adds no specificity.
`.bf-stack.is-metric-flush > …` is (0,2,0) and keeps precedence regardless
of order; mixing its `margin-block-end` with the opt-in `margin-bottom`
resolves correctly. The zero-specificity `.bf-prose li` base rule appears
after `${roleRules}`, so the single opt-in section must follow it, and the
loose-item rule must follow the opt-in `li` rule.
`src/css-app-tier.ts` sets no text margin or nudge and does not interfere.

## R5 – Inheritance and nested themes

Custom properties inherit. A nested `.bf-theme` without the modifier would
still match the descendant opt-in selectors and read the ancestor's phase and
closure against its own nudges. A reset scoped under the modifier –
`:where(.bf-theme.is-body-line-rhythm) :where(.bf-theme:not(.is-body-line-rhythm))`
– sets phase to `0rem`, closure to the nested root's own
`--bf-<role>-margin-bottom` and step to `var(--bf-baseline)`. Nested opted
roots of another tier pick up their own tier block, which is emitted after the
root block, as the existing class surfaces already are.

Spec pages load `dist/tiers/editorial/styles.css` and switch tier through body
classes (`demo/spec-runtime.js`), so class-scoped blocks are the path the demo
actually exercises; direct bundles are covered statically.

## R6 – Component, prose and exception consumers

- Components read `--bf-<role>-nudge-*` and `--bf-<role>-margin-bottom`
  directly (for example `src/css-components.ts` lines 80, 162, 172, 1384–1386).
  They keep their meaning, so those components stay on bU.
  `src/css-components.ts` lines 121–128 redeclare local cap-derived nudges and
  are unaffected.
- Role classes in component markup are common: component and pattern demos
  use `.bf-body`/`.bf-hN` 294 times; `demo/components/accordion.html` line 19
  puts `p.bf-body` in an accordion panel. Opt-in `.bf-<role>` rules (0,1,0)
  beat the (0,0,0) component rules regardless of order, so a subtree-wide
  selector would restyle them. Components also nest stacks: the accordion
  list is `bf-stack is-dense`, and `demo/patterns/tab-section.html` line 37
  puts a bare `p` directly in a `bf-stack is-dense` inside the quote wrapper.
  There is no component-root registry to exclude against. D1 therefore
  scopes Phase A to prose flows; T003 inventories the markup to confirm.
- Cap engine: `${capEngineDemo}` is emitted before the prose rules. Its
  selectors `:where(.bf-engine-cap) :where(p)` (0,0,0) and `… .bf-body` (0,1,0)
  match the opt-in specificities, so the later opt-in rules would win.
  `.bf-engine-cap` sits on the theme root (`src/css-components.ts` line 120),
  and engine demos use `.bf-prose`. Moving the cap block would break FR-011,
  so every application selector carries
  `:not(:where(.bf-engine-cap, .bf-engine-cap *))`.
- `.bf-prose ul > li::before` is absolutely positioned from
  `--bf-tick-box-offset`, which derives from the interface row, not the li
  padding. Adding phase to the li padding would leave the dot behind by the
  phase (4px in Documentation and App). The opt-in section shifts the marker by
  `--bf-body-phase-start`. Native `ol` markers follow the text line.
- Loose lists: Markdown emits `<li><p>`. The `li` and `p` rules would both
  apply, putting the paragraph baseline `nudge + phase` off step (0.3275rem,
  5.24px, in Documentation) and making a one-line item occupy three steps.
  Zeroing only the li's phase and closure would still leave its nudge
  doubled, so a loose `li` zeroes its whole block-start padding and its
  closure (technical decision T6). Its text then sits where a tight item's
  does, and the marker rule is unchanged.
- Nested lists: the outer item's closure lands after the nested list, so
  child items are off by `(nudge + phase + lh) mod step` – Editorial 0.41rem
  (6.56px), Documentation and App 0.3275rem (5.24px), OS 0.245rem (3.92px).
  Recorded exception, shown in the demo.
- `hr` occupies 0.5rem, which is off step by 0.5rem (8px) in every tier.
  `blockquote` stays on bU, occupying body `lh + bU`: off by 0.5rem (8px) in
  Editorial and 0.25rem (4px) in Documentation, App and OS. Both break phase
  for following prose content. Recorded exceptions.
- Pragma's rule also covers a code group. BF has no prose code text role;
  `pre` and `code` keep their base rules and are excluded from Phase A.

## R7 – Container gaps

The default `bf-stack` gap and the `.bf-prose` gap are both the group gap,
but through different properties: `.bf-stack` sets
`--bf-stack-space: var(--bf-section-space-shallow)` and uses it as `gap`;
`.bf-prose` sets `gap: var(--bf-section-space-shallow)` directly and never
sets `--bf-stack-space`. That property inherits, so a prose formula that read
it would round an enclosing stack's value (for example `is-dense`) instead of
the prose gap. Prose formulas must read `--bf-section-space-shallow`.

Stack modifiers resolve to extra-dense `bU / 2`, dense `bU`, loose `2 bU`,
section-shallow group, section pattern and section-deep region. Values from
`config/canonical-spacing.resolved.json`, as `current → up / down`, where up
and down round to the body line and ✓ means already whole:

| Tier (bU, step) | Extra-dense | Dense | Loose | Group (default) | Pattern | Region |
|---|---|---|---|---|---|---|
| Editorial (0.5, 1.5) | 0.25 → 1.5 / 0 | 0.5 → 1.5 / 0 | 1 → 1.5 / 0 | 1.5 ✓ | 4 → 4.5 / 3 | 8 → 9 / 7.5 |
| Documentation (0.25, 1.25) | 0.125 → 1.25 / 0 | 0.25 → 1.25 / 0 | 0.5 → 1.25 / 0 | 1.5 → 2.5 / 1.25 | 3 → 3.75 / 2.5 | 6 → 6.25 / 5 |
| App (0.25, 1.25) | 0.125 → 1.25 / 0 | 0.25 → 1.25 / 0 | 0.5 → 1.25 / 0 | 0.5 → 1.25 / 0 | 1 → 1.25 / 0 | 2 → 2.5 / 1.25 |
| OS (0.25, 1.0) | 0.125 → 1 / 0 | 0.25 → 1 / 0 | 0.5 → 1 / 0 | 1.5 → 2 / 1 | 3 ✓ | 6 ✓ |

Rounding up collapses the stack scale: Editorial extra-dense to group all
become 1.5rem; App extra-dense to pattern all become 1.25rem; Documentation
and OS sub-step gaps all become one body line. Rounding down zeroes every
sub-step gap in every tier, and in App also group and pattern.

Baseline-to-baseline between two one-line paragraphs in a default prose flow
(`occupied + gap`):

| Tier | Today | (a) unchanged gap | (b) round up | (c) zero prose gap | (d) round down |
|---|---|---|---|---|---|
| Editorial | 3.5 (56px) | 4.5 (72px), in phase | 4.5 (72px) | 3 (48px) | 4.5 (72px) |
| Documentation | 3 (48px) | 4 (64px), off 0.25rem | 5 (80px) | 2.5 (40px) | 3.75 (60px) |
| App | 2 (32px) | 3 (48px), off 0.5rem | 3.75 (60px) | 2.5 (40px) | 2.5 (40px) |
| OS | 2.75 (44px) | 3.5 (56px), off 0.5rem | 4 (64px) | 2 (32px) | 3 (48px) |

This is the double-space risk: closure already adds a near-full blank line,
and a gap then adds more. Under (b), Documentation separates one-line
paragraphs by three blank body lines. Under (c), every tier separates them by
exactly one. Under (d), by one or two.

No option fixes `bf-grid` row gaps (Editorial 1rem, Documentation and App
1.5rem), `hr`, `blockquote` or components that stay on bU. Stack options (b)
and (d) would also reach component-internal stacks, such as the accordion's
`bf-stack is-dense` list, unless scoped to stacks that hold prose (for
example `.bf-stack:has(> .bf-prose)`).

## Decisions

### D1 – Scope: prose flows

In scope: `p`/`.bf-body` and `h1`–`h6`/`.bf-h1`–`.bf-h6` that are direct
children of `.bf-prose`; `.bf-prose li`; and `p`/`.bf-body` that are direct
children of a prose `li`. Text in `bf-stack`, `bf-section` and component
flows, the meta role, `blockquote`, `hr`, `pre`/`code`, `a.bf-text-link` and
every component-internal use of `--bf-<role>-nudge-*` stay on bU. Every
application selector excludes the cap-engine demo.

*Rationale*: this is the simplest scope that is provably outside BF
components. A subtree-wide or `bf-stack` flow-child selector would reach
component text (R6), and CSS has no component-root marker to exclude
against. `.bf-prose` appears inside components only in the quote wrapper,
whose only child is an excluded `blockquote`; the direct-child combinator
keeps text inside any component nested in prose out of scope; and
`.bf-prose li` keeps exactly the reach of the existing base rule. A static
markup scan (AC-3) proves it for every demo and README example. Prose is
also where headings and paragraphs are read in one rhythm. Extending the
scope to `bf-stack` and `bf-section` text is a Phase B question (T032).
Controls already close to bU, their step, and have no following lines of
their own. Plain and role-classed equivalents occupying one box is an
existing `AGENTS.md` invariant and applies unchanged.

### D2 – Two-phase delivery

Phase A (this package): opt-in via `.bf-theme.is-body-line-rhythm`, identical
in all four tiers, plus the comparison demo. Default output is byte-for-byte
unchanged outside the modifier. Phase B (owner-gated, after browser review):
flip the default and retire the bU text ledger.

*Rationale*: every in-scope text element gains roughly one body line of
occupied height, which is a visible change to every prose page. An opt-in
lets the owner judge it in the browser before any consumer sees it. A flat
`is-*` modifier on the theme root fits the public API rule; `data-*`
selectors are forbidden.

*Approval*: the Pragma ruling is not automatically a BF requirement, and the
opt-in departs from the `AGENTS.md` text invariant inside its scope. The
owner approved the Phase A opt-in for BF on 2026-09-30; Phase B needs a
separate ruling. Phase B may retire the public class (T028), so the modifier
is documented as provisional to limit API churn.

### D3 – Private properties per in-scope role

`--bf-<role>-rhythm-step`, `--bf-<role>-phase-start` and
`--bf-<role>-closure-end`, emitted as build-time rem literals computed in
TypeScript from real metrics. `--bf-<role>-nudge-start`, `-nudge-end`,
`-baseline-compensation` and `-margin-bottom` keep their meaning and values.

*Rationale*: components depend on the existing names. Literals avoid runtime
`round()` for text and keep the value auditable against the metric model.
Declaring them only under the modifier is what keeps default output unchanged.

### D4 – Container gaps – open owner decision

Options, per R7. Each acts only under the modifier and uses the one step
property, `--bf-body-rhythm-step`.

- **(a) Leave gaps unchanged.** Smallest change. Phase survives only where the
  gap is already a body-line multiple (Editorial group, OS pattern and
  region). Documentation, App and OS prose flows drift off phase at every gap.
- **(b) Round gaps up to whole body lines** – on stacks
  `gap: round(up, var(--bf-stack-space), var(--bf-body-rhythm-step))`, on prose
  `gap: round(up, var(--bf-section-space-shallow), var(--bf-body-rhythm-step))`.
  Keeps phase across these gaps and never shrinks one. Cost: the most space
  (three blank body lines between Documentation paragraphs), and the stack
  scale collapses – Editorial extra-dense to group all become 1.5rem, App
  extra-dense to pattern all become 1.25rem.
- **(c) Collapse the prose gap to 0**, because closure already supplies a
  blank line. Tightest in-phase prose, exactly one blank line between blocks
  in every tier, no new class. Stacks cannot take it without a text-flow
  modifier (FR-001), so stacks holding prose still need (a), (b) or (d).
- **(d) Round gaps down** – the (b) formulas with `round(down, …)`. Keeps
  phase with less space than (b), and closure's blank line keeps it from
  reading too tight: group/pattern/region become Editorial 1.5/3/7.5,
  Documentation 1.25/2.5/5, OS 1/3/6. Cost: every sub-step gap becomes 0, and
  in App group and pattern become 0 and region 1.25rem.

None of them fixes `bf-grid` row gaps, `hr`, `blockquote` or bU components,
and the stack variants of (b) and (d) need scoping away from component
stacks (R7).

**Recommendation: none; the owner decides from the demo.** An earlier draft
recommended (b) as preserving phase “in every container” while keeping
authored stack semantics; both claims were overstated. On the arithmetic,
(c) for prose, or (d), may well be preferable to (b): each keeps phase with
one or two blank lines instead of up to three. The demo shows all four per
tier; the Phase A implementation ships (a) behaviour until the ruling.

### D5 – Metric authority stays with BF

BF keeps generated real-font metrics; Pragma's `(line-height + 1cap) / 2`
formula is not adopted. Neither repository's measurements are evidence for
the other.

*Rationale*: BF already computes `b` exactly at build time, so the cap estimate
would reduce accuracy. Rendered residuals are dominated by Chromium rounding
ascent, descent and half-leading to whole pixels – BF's own Documentation
body residual equals the 0.766px Pragma reported – so neither repository's
residuals say anything about the other's metric model. Phase is a whole-bU
translation from F* (R1), so the opt-in carries BF's residuals unchanged and
the rendered checks are differential (technical decision T5).

### D6 – Invariant wording

Phase B would need to change these statements; Phase A adds only a scoped
opt-in exception note and does not rewrite them:

- `AGENTS.md`, product invariants: “Metric-aligned text retains only its
  measured top nudge and complementary bottom-margin compensation; role
  space-after does not drive layout.”
- `docs/architecture.md`, container-owned rhythm: “each metric-aligned text
  element owns its measured `padding-block-start`” and “each element owns only
  the complementary, non-semantic `margin-block-end` required to complete a
  baseline unit”.
- `docs/agent-index.md`, traps: “metric-aligned text keeps its top nudge and
  bottom-margin compensation.”
- `scripts/validate-build.ts` line 379 message and assertion: “marginBottom to
  complement nudgeTop to one baseline unit”.
- `scripts/verify-component-behavior.ts` lines 506–512: page-wide phase modulo
  bU.

Phase A `AGENTS.md` note (T020), under product invariants: “Scoped
exception: under the opt-in `.bf-theme.is-body-line-rhythm` (Spec 026
Phase A, owner-approved for BF on 2026-09-30), prose-flow text adds a
body-line phase inset and closes to whole body lines. The text invariant
holds everywhere else.”

### Technical decisions from research

- **T1** – phase is measured from the grid target F*, which makes it a
  whole-bU translation that preserves existing residuals (R1).
- **T2** – Phase A keeps rhythm terms CSS-private. Token JSON and surface
  manifests do not change; `docs/architecture.md` requires every manifest
  field with a CSS representation to carry a documented meaning and an
  equality assertion, which belongs with Phase B serialization.
- **T3** – the opt-in rule sets the same physical `margin-bottom` as the base
  rule so one property carries the ledger in the cascade.
- **T4** – the opt-in section is emitted only when every surface in the
  bundle has rhythm data. Surfaces built by `scripts/build-theme.ts` (tiers,
  presets, experiments) fail the build on any failed check. Custom surfaces
  built through the public `buildThemeFromConfig` export get rhythm data when
  it can be computed; otherwise they get none, emit no section, and the
  modifier is a no-op there. The strict switch the build script uses is
  `@internal` and stripped from `dist/build.d.ts`.
- **T5** – rendered checks are differential with a 0.1px tolerance: with vs
  without the modifier, element-to-previous tops, line-to-line distances and
  `line 2 − line 1` for exceptions. Absolute ε is recorded, never asserted
  (R2 cross-check). Element-to-previous measurement avoids Chromium's
  −1/64px per-element layout drift (tops measured 31.984, 87.969, 127.953).
  Because differential checks share `computeBodyLineRhythm` with the build,
  one bounded absolute check backs them: first baselines sit within
  `root / 16` of a whole rendered body line, which a one-bU phase error
  exceeds.
- **T6** – a prose `li` with a direct `p`/`.bf-body` child zeroes its
  block-start padding and closure; its paragraphs carry the terms (R6). The
  zeroes are carried by `--bf-body-loose-item-start`/`-end`, which the nested
  non-opted reset restores to the body nudge and margin.
- **T7** – metrics are read with `readFontMetrics` per role `fontFamily`,
  from the source config's non-`runtimeOnly` font files, with paths resolved
  relative to the source config (as `src/build.ts` already does for the
  baseline config). The recomputed generator nudge passes line height as a
  bU count, which is what `calculateNudgeRem` expects.

## Risks

- **Root scaling**: the generator's drift compensation assumes a 16px root.
  Absolute residuals reach 1.8px at a 32px root (R2 cross-check). They are
  recorded as metric-authority findings against the generator; nudges and
  type tokens do not change in this package.
- **Component leakage**: avoided by the prose-flow scope (D1) and guarded by
  the markup scan; stack gap options need the same care (R7).
- **Margin collapse**: outside grid containers, closure is a margin and can
  collapse with a following positive top margin or be replaced by a component
  rule. BF resets text `margin-block-start` to 0 and `bf-stack`/`bf-prose` are
  grids, so the common paths are safe. In a loose item the last paragraph's
  closure collapses through the item's zero bottom margin, which keeps the
  same geometry; the loose-item check (AC-7) guards it.
- **Spec 025 overlap**: `feat/025-compact-alignment-grid` is unlanded and may
  touch `src/css.ts` and the behaviour suite. Rebase before the T002 capture;
  any later rebase re-runs T002.
