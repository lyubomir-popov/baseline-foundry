# Contract: Body-line phase

Normative for Spec 026 after the owner rulings of 2026-09-30: R1–R5 (CP-B)
and R6–R7 (flow text everywhere, self-spacing text blocks). Rationale lives
in [research.md](../research.md).

## Symbols

| Symbol | Meaning |
|---|---|
| `bU` | Surface baseline unit (`tokens.baselineUnit`) |
| `step` | Rhythm step: the surface body line height |
| `fs`, `lh` | Role font size and line height, rem |
| `b` | First-baseline offset from the line-box top, from hhea metrics (generator formula) |
| `nudge` | Existing `nudgeTop` / `--bf-<role>-nudge-start`, unchanged |
| `F*` | `bU · ceil(b / bU − 1e-9)` – the grid line the generator's nudge targets |
| `roundUp(x, s)` | Smallest whole multiple of `s` that is `≥ x` (tolerance 1e-9) |
| `cap`, `desc` | Role cap height (OS/2 `sCapHeight`) and descender (hhea descent), rem |
| `ε` | Rendered first baseline minus F*, px. Recorded, never asserted |

## Terms

```text
step          = roles.body.lineHeight                          (rem)
phase         = roundUp(F*, step) − F*                         block-start, after nudge
closure       = roundUp(nudge + phase + lh, step) − (nudge + phase + lh)
                                                               block-end, replaces bU compensation
list start    = body nudge + body phase                        prose list padding-block-start
list closure  = roundUp(list start, step) − list start         prose list margin-bottom
hgroup join   = −step                                          each hgroup child after the first
```

All terms round up only. The list closure is valid for any item count only
because every item line advances `lh_body = step`; it therefore equals the
body closure. None is a spacing token or has a public property; none appears
in `tokens.spacing`, `canonicalSpacing`, token JSON or surface manifests.

### Heading-group clearance

For an ordered pair of roles `P` then `N` in a prose `hgroup`, the joined
baseline distance, from `P`'s last baseline to `N`'s first, is

```text
d(P, N) = (lh_P + closure_P − step) + (nudge_N + phase_N + b_N) − b_P
```

independent of `P`'s line count, because the closure literal is fixed. The
join is allowed only when `d(P, N) ≥ cap_N + desc_P`. A surface where a pair
fails takes `0rem` for that pair – no pull, so phase still holds – through
`--bf-hgroup-join-<P>-<N>`.

## Build-time checks

Metrics are read with `readFontMetrics` per role `fontFamily`, from the
source config's non-`runtimeOnly` font files, with paths resolved relative to
the source config. For every in-scope role:

1. `step / bU` is a whole number (±1e-9).
2. The recomputed generator nudge (`calculateNudgeRem`, line height passed as
   a bU count) equals `nudgeTop` within 0.00001rem.
3. `|b + nudge − F*| < 0.0625rem`.
4. `0 ≤ phase < step` and `0 ≤ closure < step`.
5. `(F* + phase) mod step` and `(nudge + phase + lh + closure) mod step` are 0
   within 0.00001rem.

For the surface: body `lh` equals `step`; the list closure equals the body
closure and `(list start + list closure) mod step = 0`; every role has a cap
height, and the unjoined hgroup pairs are the pairs failing the clearance
inequality.

Failure handling:

- A surface built by `scripts/build-theme.ts` (the four tiers, the `prose`
  and `app-tier` presets and the experiment surfaces) fails the build when
  any check fails or rhythm data cannot be computed.
- A custom surface built through the public `buildThemeFromConfig` export
  gets rhythm data when it can be computed and the checks pass. Otherwise it
  gets none, its bundle emits no section, its text keeps the bU ledger and
  `.is-baseline-rhythm` is a no-op. The build script's strict mode is an
  internal option, stripped from the published declarations.

Values are formatted with the existing rem helper (five decimals).

## Scope

| Target | Selectors |
|---|---|
| body, h1–h6 | `:where(<tag>)` and `.bf-<role>` |
| text-join gap | `:where(<container> > *)` for `.bf-stack`, `.bf-stack.is-flush`, `.bf-stack.is-extra-dense`, `.bf-stack.is-dense`, `.bf-stack.is-loose`, `.bf-stack:is(.is-section-shallow, .is-section, .is-section-deep)`, `.bf-prose`, in that order |
| text join | `:where(:is(.bf-stack, .bf-prose):not(hgroup, .is-metric-flush) > <text>:not([hidden])<not-root> + <text><not-root>)`, `<text>` = `:is(p, h1…h6, hgroup, .bf-body, .bf-h1….bf-h6, .bf-prose ul, .bf-prose ol)`, `<not-root>` = `:not(:where(<block 3 selector list>))` |
| hgroup stack gap | `:where(hgroup.bf-stack)` |
| hgroup join | `:where(hgroup > * + *)`; limited pairs `:where(hgroup > :is(<P>, .bf-<P>) + :is(<N>, .bf-<N>))` |
| list block | `:where(.bf-prose :is(ul, ol):not(.bf-prose li *))` |
| list items | `:where(.bf-prose li)` |
| list dot | `:where(.bf-prose ul > li)::before` |
| loose text | `:where(.bf-prose li) > :where(p)` and `… > .bf-body` |
| loose gap | `:where(.bf-prose li:has(> :where(p, .bf-body)) + li:has(> :where(p, .bf-body)))` |

Every selector is prefixed by `:where(.bf-theme)` and ends its subject
compound with `:not(:where(.bf-engine-cap, .bf-engine-cap *))`, which adds no
specificity. Only roles present in the surface are emitted.

Not selected: meta, lead, `figcaption`, `blockquote`, `hr`, `pre`/`code`,
`a.bf-text-link`, controls and anything under `.bf-engine-cap`. Text inside
a component root, a `bf-cluster` child, `blockquote`, `fieldset` or `table`
is selected but resolves every term to the bU ledger (block 3).

## Generated CSS shape

One contiguous section, emitted after the `.bf-prose li` and
`.bf-prose blockquote` rules and before `hr`, opened by
`/* Body-line rhythm (Spec 026). */` and closed by
`/* End body-line rhythm (Spec 026). */`. Order inside the section:

```css
/* Body-line rhythm (Spec 026). */

/* 1. Root surface literals: the default ledger. */
:where(.bf-theme) {
  --bf-body-rhythm-step: <step>;
  --bf-body-phase-start: <phase>;
  --bf-body-closure-end: <closure>;
  /* …h1–h6 in role order… */
  --bf-body-list-block-start: <list start>;
  --bf-body-list-block-end: <list closure>;
  --bf-body-list-item-start: 0rem;
  --bf-body-list-item-end: 0rem;
  --bf-body-list-loose-gap: var(--bf-body-rhythm-step);
  --bf-body-loose-text-start: 0rem;
  --bf-body-loose-text-end: 0rem;
  --bf-hgroup-join: calc(-1 * var(--bf-body-rhythm-step));
  --bf-text-gap-scale: 0;
  --bf-hgroup-join-<P>-<N>: var(--bf-hgroup-join) | 0rem;  /* per limited pair in the bundle */
}

/* 2. One block per class-scoped surface, in existing surface order. */
:where(.bf-theme.bf-tier-<tier>) { /* same shape */ }

/* 3. Opt-out, structural and element roots, and every component root: every term to main's baseline-unit ledger. */
:where(.bf-theme.is-baseline-rhythm, .bf-cluster > *, blockquote, fieldset, table, .bf-accordion, …, .bf-validation-message) {
  --bf-<role>-rhythm-step: var(--bf-baseline);
  --bf-<role>-phase-start: 0rem;
  --bf-<role>-closure-end: var(--bf-<role>-margin-bottom);
  --bf-body-list-block-start: 0rem;
  --bf-body-list-block-end: 0rem;
  --bf-body-list-item-start: var(--bf-body-nudge-start);
  --bf-body-list-item-end: var(--bf-body-margin-bottom);
  --bf-body-list-loose-gap: 0rem;
  --bf-body-loose-text-start: var(--bf-body-nudge-start);
  --bf-body-loose-text-end: var(--bf-body-margin-bottom);
  --bf-hgroup-join: 0rem;
  --bf-text-gap-scale: 1;
  --bf-hgroup-join-<P>-<N>: 0rem;
}

/* 4. Role application, everywhere under the theme. */
:where(.bf-theme) :where(h3):not(:where(.bf-engine-cap, .bf-engine-cap *)),
:where(.bf-theme) .bf-h3:not(:where(.bf-engine-cap, .bf-engine-cap *)) {
  margin-bottom: var(--bf-h3-closure-end);
  padding-block-start: calc(var(--bf-h3-nudge-start) + var(--bf-h3-phase-start));
}

/* 5. Text blocks join on their closure (R6, orchestrator rulings F1–F7). Prose keeps main's gap. */
:where(.bf-theme) :where(.bf-stack > *):not(…) { --bf-text-join-gap: var(--bf-section-space-shallow); }
:where(.bf-theme) :where(.bf-stack.is-flush > *):not(…) { --bf-text-join-gap: 0rem; }
:where(.bf-theme) :where(.bf-stack.is-extra-dense > *):not(…) { --bf-text-join-gap: var(--bf-space-half); }
:where(.bf-theme) :where(.bf-stack.is-dense > *):not(…) { --bf-text-join-gap: var(--bf-space-1); }
:where(.bf-theme) :where(.bf-stack.is-loose > *):not(…) { --bf-text-join-gap: var(--bf-space-2); }
:where(.bf-theme) :where(.bf-stack:is(.is-section-shallow, .is-section, .is-section-deep) > *):not(…) { --bf-text-join-gap: 0rem; }
:where(.bf-theme) :where(.bf-prose > *):not(…) { --bf-text-join-gap: var(--bf-section-space-shallow); }
:where(.bf-theme) :where(:is(.bf-stack, .bf-prose):not(hgroup, .is-metric-flush) > <text>:not([hidden])<not-root> + <text><not-root>):not(…) {
  margin-block-start: calc(var(--bf-text-join-gap) * (var(--bf-text-gap-scale) - 1));
}
:where(.bf-theme) :where(hgroup.bf-stack):not(…) {
  gap: calc(var(--bf-stack-space) * var(--bf-text-gap-scale));
}

/* 6. Heading-group join, then one rule per limited pair. */
:where(.bf-theme) :where(hgroup > * + *):not(…) {
  margin-block-start: var(--bf-hgroup-join);
}
:where(.bf-theme) :where(hgroup > :is(h1, .bf-h1) + :is(h5, .bf-h5)):not(…) {
  margin-block-start: var(--bf-hgroup-join-h1-h5);
}

/* 7. Container-owned prose list block, items, dot, loose text and gap. */
:where(.bf-theme) :where(.bf-prose :is(ul, ol):not(.bf-prose li *)):not(…) {
  margin-bottom: var(--bf-body-list-block-end);
  padding-block-start: var(--bf-body-list-block-start);
}
:where(.bf-theme) :where(.bf-prose li):not(…) {
  margin-bottom: var(--bf-body-list-item-end);
  padding-block-start: var(--bf-body-list-item-start);
}
:where(.bf-theme) :where(.bf-prose ul > li):not(…)::before {
  inset-block-start: calc(var(--bf-tick-box-offset) - var(--bf-body-nudge-start) + var(--bf-body-list-item-start) + ((var(--bf-leading-mark-size) - var(--bf-list-marker-dot-size)) * 0.5));
}
:where(.bf-theme) :where(.bf-prose li) > :where(p):not(…),
:where(.bf-theme) :where(.bf-prose li) > .bf-body:not(…) {
  margin-bottom: var(--bf-body-loose-text-end);
  padding-block-start: var(--bf-body-loose-text-start);
}
:where(.bf-theme) :where(.bf-prose li:has(> :where(p, .bf-body)) + li:has(> :where(p, .bf-body))):not(…) {
  margin-block-start: var(--bf-body-list-loose-gap);
}

/* End body-line rhythm (Spec 026). */
```

Rules:

- Custom properties inherit, so the nearest `.bf-theme` or component root
  wins: a default root nested in an opted-out one or in a component
  redeclares the body-line literals, and an opted-out root or a component
  root nested in a default one redeclares the bU ledger. No nested reset rule
  is needed. Block 3 follows every surface block so
  `.bf-theme.bf-tier-<tier>.is-baseline-rhythm`, and a `.bf-theme` that is
  also a component root, resolve the bU ledger.
- Block 3's roots are `.bf-cluster > *`, `blockquote`, `fieldset`, `table`
  (F3, F5) and every `bf-*` class in the component, grid and preset
  CSS emitted after the section, minus flow classes (theme, tier and surface
  roots, text roles, `bf-text-link`, engine markers, `bf-page`, `bf-grid`,
  `bf-grid-item`, `bf-grid-scope`, `bf-span-*`, `bf-stack`, `bf-cluster`,
  `bf-section`, `bf-prose`, `bf-strip`, `bf-measure`, `bf-fixed-width`,
  `bf-inline-size`, `bf-stage-shell`, `bf-token-row` and the page shells
  `bf-page-shell`, `bf-application`, `bf-main`, `bf-site-main`,
  `bf-docs-layout`, `bf-docs-layout-content`), sorted.
- The text-join gap is declared on the child by its parent's modifier, in
  main's modifier order, so a child's own `--bf-stack-space` never matters;
  `.bf-prose` comes last because main's prose gap wins on a
  `.bf-prose.bf-stack`. Section stacks and `is-flush` join at 0.
- The opt-out's `var()` values resolve on the opted-out root against its own
  role properties, so every tier gets its own bU ledger.
- Application declarations have no `var()` fallback; the section is emitted
  only when every surface in the bundle has rhythm data.
- The marker subtracts the body nudge and adds the item start, so its offset
  from the first baseline equals main's under both ledgers.
- `padding-block-end` and every other base declaration are left to the base
  rules. No `data-*`, `!important`, `ui-*` or BEM selector; no `1cap`.
- `.bf-stack.is-metric-flush` rules (specificity 0,2,0) keep precedence.
- Removing the section, opening to closing comment inclusive, yields main's
  generated CSS byte for byte, which is the baseline-unit ledger that
  `.is-baseline-rhythm` must reproduce.

## Expected values

Rem literals per surface. Nudge is shown for reference and is not emitted in
the section.

| Tier | Role | Nudge | Step | Phase | Closure |
|---|---|---:|---:|---:|---:|
| Editorial | body, h5, h6 | 0.41 | 1.5 | 0 | 1.09 |
| Editorial | h3, h4 | 0.46917 | 1.5 | 1 | 1.03083 |
| Editorial | h1, h2 | 0.06881 | 1.5 | 0.5 | 0.93119 |
| Documentation | body | 0.0775 | 1.25 | 0.25 | 0.9225 |
| Documentation | h5, h6 | 0.11056 | 1.25 | 0 | 0.88944 |
| Documentation | h3, h4 | 0.21917 | 1.25 | 0.75 | 0.78083 |
| Documentation | h1, h2 | 0.03875 | 1.25 | 0.5 | 0.71125 |
| App | body, h5, h6 | 0.0775 | 1.25 | 0.25 | 0.9225 |
| App | h3, h4 | 0.11056 | 1.25 | 0 | 0.88944 |
| App | h1, h2 | 0.21917 | 1.25 | 0.75 | 0.78083 |
| OS | body, h5, h6 | 0.245 | 1 | 0 | 0.755 |
| OS | h3, h4 | 0.16 | 1 | 0 | 0.84 |
| OS | h1, h2 | 0.21917 | 1 | 0.5 | 0.78083 |

| Tier | List start | List closure | hgroup h1 → h2 | Unjoined hgroup pairs |
|---|---:|---:|---:|---|
| Editorial | 0.41 | 1.09 | 3 | none |
| Documentation | 0.3275 | 0.9225 | 2.5 | h1/h2 → h5/h6 |
| App | 0.3275 | 0.9225 | 2.5 | none |
| OS | 0.245 | 0.755 | 2 | h1/h2 → h3/h4 |

Wrapped qualifying (`lh mod step = 0`): Editorial h1, h2, h5, h6;
Documentation h1, h2; App h5, h6; OS h3, h4, h5, h6. All others are wrapped
type-scale exceptions.

## Recorded exceptions

Measured and recorded in `review.md`, not asserted. Sizes at a 16px root.

| Case | Effect on following content | Editorial | Documentation | App | OS |
|---|---|---|---|---|---|
| Wrapped heading, `lh mod step ≠ 0` | Line 2+ and following content off phase | research R3 | R3 | R3 | R3 |
| Metric-flush pair, h2 then p | Off by `(n₁ + ph₁ + lh₁ − n₂ − ph₂) mod step` | 0.15881rem (2.54px) | 0.21125rem (3.38px) | 0.14167rem (2.27px) | 0.02583rem (0.41px) |
| `hr` (0.5rem occupied) | Off by 0.5rem | 8px | 8px | 8px | 8px |
| `blockquote` (body `lh + bU`) | Off by `(lh + bU) mod step` | 8px | 4px | 4px | 4px |
| `bf-grid` row gap | Unchanged gap | 1rem | 1.5rem | 1.5rem | – |
| Text after a component or other non-text child | Starts one gap after a bU-quantized block; measured | 8.05px | 8.03px | 0.03px | 7.95px |
| Child `.bf-prose` or non-`hgroup` `.bf-stack` after text (F7) | Keeps the parent gap | 24px | 24px | 8px | 24px |
| Hidden or `display: contents` sibling between text blocks (F2, F7) | Keeps the gap | 24px | 24px | 8px | 24px |
| Text in a section stack (F4) | Keeps the section gap; phase after it not guaranteed (open question Q1) | section tokens | section tokens | section tokens | section tokens |
| Several paragraphs in one loose item | Not separated | – | – | – | – |

Nested lists are no longer an exception (R3).

## Rendered obligations

Rendered checks are differential, plus bounded absolute checks that do not
use `computeBodyLineRhythm`. Absolute phase is not asserted to 0.1px:
Chromium rounds ascent, descent and half-leading to whole pixels, so |ε|
reaches 0.906px at 16px and 1.813px at 32px (research R2 cross-check).

- Engine: Chromium, DPR 1. Roots 16px and 32px. Tiers editorial,
  documentation, app, os. Tolerance 0.1px unless stated.
- Probe: a zero-height `inline-block` element on the baseline at the start of
  each line. `elementTop` is the element's border-box top.
- Fixtures: the same markup in a default column and an `.is-baseline-rhythm`
  column; text-to-text flows run on BF's own prose gap, and flows where BF
  cancels nothing (lists, rule, quote, metric-flush pair) use a demo-local
  `gap: 0` specimen; plus a default theme nested in an opted-out host.
- **Opt-out equals main (R1)**: the route is rendered a second time with the
  section stripped from the requested tier bundle, which is main's CSS. Every
  `.is-baseline-rhythm` fixture box (top from its flow, height, margin-bottom,
  padding-top), every line baseline and every dot equals that rendering.
- **Phase translation (AC-5)**: for body and h1–h6, `(probeY − elementTop)`
  default minus opt-out equals the phase in px; element tops advance by whole
  steps; `h3` and `p.bf-h3` occupy the same box.
- **Whole body lines, independent (AC-5)**: the step is the computed
  `line-height` of the default matrix's first `p`. First baselines of the
  matrix, wrapped line 1, list first items and the paragraph after each
  hgroup sit within `root / 16` of a whole step from their flow or element
  top.
- **Wrapped (AC-6)**: as before, on the default column.
- **Lists (R3)**: in the default and nested-default columns, consecutive
  first-baseline deltas equal the rendered step for tight, ordered and
  three-level nested items and twice the step for loose items; every item's
  computed line height is the step; each list starts at its flow top and
  occupies whole steps; every dot's offset from its first baseline equals
  main's tight-item offset; loose text sits where tight text does.
- **Heading groups (R4)**: children keep their own nudge and phase; the
  second child's top equals the first child's occupied bottom minus one step;
  h1 → h2 baseline distance equals the R4 prediction; the group occupies whole
  steps and the following paragraph stays in phase.
- **Self-spacing text (R6, R7)**: default `.bf-prose` (no specimen gap), a
  `bf-stack` and a bare `bf-section`, each h2, p, p: the p top equals the
  h2's occupied bottom and is whole steps after the h2 top; one-line p → p
  first baselines are exactly two steps apart; every first baseline sits
  within `root / 16` of a whole step from the flow top; prose keeps its
  group gap in both ledgers; the opt-out stack keeps main's gap;
  text → component and component → text are separated by exactly the stack
  gap. The four fixtures are included in the opt-out-equals-main check.
- **Adjacency (F1–F7, AC-16)**: `verifyBodyLineRhythmAdjacency` renders the
  review fixtures in whole-pixel slots at a 16px root in every tier, against
  main's CSS: clearance after non-text children equals main; a hidden first
  block starts at the stack top; cluster rows, `blockquote > p`, `td > p`
  and `fieldset > p` equal main; pattern stacks advance p → p by exactly two
  body lines with a non-negative margin box; section stacks keep their gap;
  component-root neighbours keep the gap; `hgroup.bf-stack` joins on the
  parent's token and its children take only the hgroup join; child
  containers keep the parent gap. Every fixture's opt-out equals main.
- **Nested default**: a default theme in an opted-out host matches the
  default column for `probe − elementTop` and element advance.
- **Direct bundles**: `dist/tiers/{documentation,app,os}/styles.css` at a 16px
  root give a default prose `h1` `nudge + phase` padding and the closure, an
  `h1` to `p` advance of whole body lines, and an `.is-baseline-rhythm` `h1`
  the nudge and `bU − nudge`.
- **Component geometry (R7)**: `npm run test:components` passes with
  `scripts/verify-component-baselines.ts` unchanged since CP-B.
- **Recorded, not asserted**: absolute ε per tier, role and root; the offsets
  in [Recorded exceptions](#recorded-exceptions); measured list, hgroup, p → p,
  h2 → p and text ↔ component distances.
