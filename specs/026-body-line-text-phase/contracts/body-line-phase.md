# Contract: Body-line phase

Normative for Phase A. Rationale lives in [research.md](../research.md).

## Symbols

| Symbol | Meaning |
|---|---|
| `bU` | Surface baseline unit (`tokens.baselineUnit`) |
| `step` | Rhythm step: the surface body line height |
| `fs`, `lh` | Role font size and line height, rem |
| `b` | First-baseline offset from the line-box top, from hhea metrics (generator formula) |
| `nudge` | Existing `nudgeTop` / `--bf-<role>-nudge-start`, unchanged |
| `F*` | `bU · round((b + nudge) / bU)` – the grid line the nudge targets |
| `roundUp(x, s)` | Smallest whole multiple of `s` that is `≥ x` (tolerance 1e-9) |
| `ε` | Rendered first baseline minus F*, px. Recorded, never asserted |

## Terms

```text
step    = roles.body.lineHeight                       (rem)
phase   = roundUp(F*, step) − F*                      block-start, after nudge
closure = roundUp(nudge + phase + lh, step) − (nudge + phase + lh)
                                                      block-end, replaces bU compensation
```

Both round up only. Neither is a spacing token, neither has a public property,
neither appears in `tokens.spacing`, `canonicalSpacing`, token JSON or surface
manifests in Phase A.

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

Failure handling:

- A surface built by `scripts/build-theme.ts` (the four tiers, the `prose`
  and `app-tier` presets and the experiment surfaces) fails the build when
  any check fails or rhythm data cannot be computed.
- A custom surface built through the public `buildThemeFromConfig` export
  gets no rhythm data. Its bundle emits no section and the modifier is a
  no-op.

Values are formatted with the existing rem helper (five decimals).

## Scope

Phase A selects prose-flow text only.

| Role | Selectors under the modifier |
|---|---|
| body | `:where(.bf-prose) > :where(p)`, `:where(.bf-prose) > .bf-body`, `:where(.bf-prose li) > :where(p)`, `:where(.bf-prose li) > .bf-body`, `:where(.bf-prose li)` |
| h1–h6 | `:where(.bf-prose) > :where(hN)`, `:where(.bf-prose) > .bf-hN` |

Every application selector, including the marker and loose-item rules, ends
its subject compound with `:not(:where(.bf-engine-cap, .bf-engine-cap *))`,
which adds no specificity. Only roles present in the surface are emitted.

Not selected: text in `bf-stack`, `bf-section` and component flows, meta,
lead, `figcaption`, `blockquote`, `hr`, `pre`/`code`, `a.bf-text-link`,
component rules, controls and anything under `.bf-engine-cap`.

## Generated CSS shape

One contiguous section, emitted after the `.bf-prose li` and
`.bf-prose blockquote` rules and before `hr`, opened by
`/* Body-line rhythm opt-in (Spec 026). */` and closed by
`/* End body-line rhythm opt-in (Spec 026). */`. Order inside the section:

```css
/* Body-line rhythm opt-in (Spec 026). */

/* 1. Root surface literals. */
:where(.bf-theme.is-body-line-rhythm) {
  --bf-body-rhythm-step: <step>;
  --bf-body-phase-start: <phase>;
  --bf-body-closure-end: <closure>;
  /* …h1–h6 in role order… */
}

/* 2. One block per class-scoped surface, in existing surface order. */
:where(.bf-theme.bf-tier-<tier>.is-body-line-rhythm) { /* same shape */ }

/* 3. Nested non-opted theme reset. */
:where(.bf-theme.is-body-line-rhythm) :where(.bf-theme:not(.is-body-line-rhythm)) {
  --bf-<role>-rhythm-step: var(--bf-baseline);
  --bf-<role>-phase-start: 0rem;
  --bf-<role>-closure-end: var(--bf-<role>-margin-bottom);
}

/* 4. Application, per in-scope role; body adds the prose li > p shapes. */
:where(.bf-theme.is-body-line-rhythm) :where(.bf-prose) > :where(h3):not(:where(.bf-engine-cap, .bf-engine-cap *)),
:where(.bf-theme.is-body-line-rhythm) :where(.bf-prose) > .bf-h3:not(:where(.bf-engine-cap, .bf-engine-cap *)) {
  margin-bottom: var(--bf-h3-closure-end);
  padding-block-start: calc(var(--bf-h3-nudge-start) + var(--bf-h3-phase-start));
}

/* 5. Prose list items use body terms; the custom dot follows the phase. */
:where(.bf-theme.is-body-line-rhythm) :where(.bf-prose li):not(:where(.bf-engine-cap, .bf-engine-cap *)) {
  margin-bottom: var(--bf-body-closure-end);
  padding-block-start: calc(var(--bf-body-nudge-start) + var(--bf-body-phase-start));
}

:where(.bf-theme.is-body-line-rhythm) :where(.bf-prose ul > li):not(:where(.bf-engine-cap, .bf-engine-cap *))::before {
  inset-block-start: calc(var(--bf-tick-box-offset) + var(--bf-body-phase-start) + ((var(--bf-leading-mark-size) - var(--bf-list-marker-dot-size)) * 0.5));
}

/* 6. Loose items: child paragraphs carry the terms. */
:where(.bf-theme.is-body-line-rhythm) :where(.bf-prose li:has(> :where(p, .bf-body))):not(:where(.bf-engine-cap, .bf-engine-cap *)) {
  margin-bottom: 0rem;
  padding-block-start: 0rem;
}

/* End body-line rhythm opt-in (Spec 026). */
```

Rules:

- Application declarations have no `var()` fallback; the section is emitted
  only when every surface in the bundle has rhythm data.
- `padding-block-end` and every other base declaration are left to the base
  rule.
- No `data-*`, `!important`, `ui-*` or BEM selector.
- `.bf-stack.is-metric-flush` rules (specificity 0,2,0) keep precedence.
- Rule 6 follows rule 5 so it wins at equal specificity.
- Removing the section, opening to closing comment inclusive, yields the
  output generated without rhythm data, byte for byte.

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

Wrapped qualifying (`lh mod step = 0`): Editorial h1, h2, h5, h6;
Documentation h1, h2; App h5, h6; OS h3, h4, h5, h6. All others are wrapped
type-scale exceptions.

## Recorded exceptions

Measured and recorded in `review.md`, not asserted. Sizes at a 16px root.

| Case | Effect on following content | Editorial | Documentation | App | OS |
|---|---|---|---|---|---|
| Wrapped heading, `lh mod step ≠ 0` | Line 2+ and following content off phase | research R3 | R3 | R3 | R3 |
| Metric-flush pair, h2 then p | Off by `(n₁ + ph₁ + lh₁ − n₂ − ph₂) mod step` | 0.15881rem (2.54px) | 0.21125rem (3.38px) | 0.14167rem (2.27px) | 0.02583rem (0.41px) |
| Nested list | Child items off by `(nudge + phase + lh) mod step` | 0.41rem (6.56px) | 0.3275rem (5.24px) | 0.3275rem (5.24px) | 0.245rem (3.92px) |
| `hr` (0.5rem occupied) | Off by 0.5rem | 8px | 8px | 8px | 8px |
| `blockquote` (body `lh + bU`) | Off by `(lh + bU) mod step` | 8px | 4px | 4px | 4px |
| `bf-grid` row gap | Unchanged gap | 1rem | 1.5rem | 1.5rem | – |

`pre`/`code` and text outside `.bf-prose` are not selected and keep the bU
ledger.

## Rendered obligations

All rendered checks are differential. Absolute phase is not asserted:
Chromium rounds ascent, descent and half-leading to whole pixels, so |ε|
reaches 0.906px at 16px and 1.813px at 32px (research R2 cross-check).

- Engine: Chromium, DPR 1. Roots 16px and 32px. Tiers editorial,
  documentation, app, os. Tolerance 0.1px throughout.
- Probe: a zero-height `inline-block` element on the baseline at the start of
  each line. `elementTop` is the element's border-box top.
- Fixtures: the same markup in an opted and a non-opted column, each in a
  zero-gap `.bf-prose` flow (demo-local `gap: 0` specimen rule). The
  metric-flush pair sits in `.bf-prose.bf-stack.is-metric-flush` so both the
  opt-in and the flush rules reach it.
- **Phase translation (AC-5)**: for body and h1–h6,
  `(probeY − elementTop)` opted minus non-opted equals the phase in px.
- **Whole-step tops (AC-5)**: in the opted flow the first element top equals
  the flow top, and each element top minus the previous element top is a
  whole number of steps. Measuring element-to-previous avoids Chromium's
  −1/64px per-element layout drift.
- **Wrapped (AC-6)**: forced two- and three-line headings via `<br>`. Each
  line-to-line distance equals `lh` in px. Qualifying roles: the following
  sibling's top is whole steps from the heading top. Editorial h3,
  documentation h3, app h1 and os h1 at two lines: the distance from
  `line 2 − line 1` to the nearest whole step equals the research R3
  prediction and is at least one bU in px.
- **Edges (AC-7)**: a nested non-opted `.bf-theme` matches the non-opted
  reference for `probe − elementTop` and element-to-previous tops;
  baseline-to-baseline distance inside a metric-flush pair equals the
  non-opted pair; the `.bf-prose ul` dot centre minus the first probe equals
  the non-opted value; a loose item's `probe − itemTop` equals a tight
  item's under the modifier.
- **Recorded, not asserted**: absolute ε per tier, role and root, and the
  offsets in [Recorded exceptions](#recorded-exceptions).
- Outside the modifier the existing browser contracts run unmodified.

## Phase B hooks (not normative in Phase A)

Default flip, scope beyond prose, serialization into tokens and manifests
with equality assertions, invariant rewrite and gap behaviour follow the
owner rulings recorded in [research.md](../research.md) D4 and D6.
