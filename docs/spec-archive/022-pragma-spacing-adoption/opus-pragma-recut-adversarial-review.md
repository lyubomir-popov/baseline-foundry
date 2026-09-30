# Adversarial review — Pragma React spacing re-cut, marker geometry

Requested by
[`opus-pragma-recut-adversarial-review-request.md`](opus-pragma-recut-adversarial-review-request.md).
Bounded to the five questions in that request. No verdict, no ranking.

## What was inspected, and how

- Branches read at the commits named in the request: `49841db85`, `81e2dff56`,
  `8edb22f59`, `3a3d3cb70`, `49cd1a160`, `11b58e397`. All six are stacked on
  `origin/main` at `7193fe082` and are cumulative (4, 6, 7, 8, 9 and 10 commits
  ahead respectively). `feat/pragma-navigation` is at the same commit as
  `feat/pragma-surfaces` with T022 uncommitted, and was not reviewed.
- Rendered measurement on the running Storybook at port 6114, via
  `getBoundingClientRect` and `getComputedStyle` on real component parts. Nothing
  was restarted and neither repository was modified.

**One caveat that qualifies every measurement below.** The Storybook on 6114
serves `feat/bf-shared-alignment`, the spike — not the cut chain. For the marker
files the two agree except in comments, with two exceptions, both recorded as
findings (F4, F6). Where a number below could only be derived from the cut's CSS
rather than rendered, it is marked *derived*.

## Token facts

Read from the live audit root, per tier.

| Tier | baseline | field inset | action inset | continuation inset | mark gap | mark canvas | body |
|---|---|---|---|---|---|---|---|
| Site | 0.5rem | 0.5rem | 1rem | 2rem | 0.5rem | 1rem | 16/24px |
| Docs | 0.25rem | 0.5rem | 0.75rem | 1.5rem | 0.5rem | 1rem | 14/20px |
| App | 0.25rem | 0.25rem | 0.75rem | 1.5rem | 0.25rem | 1rem | 14/20px |

`component-contract.css` derives the marker row's inset as a residual:

```css
--ds-leading-mark-group-inset: max(
  0px,
  calc(var(--ds-inline-inset-continuation) - var(--ds-leading-mark-canvas) - var(--ds-leading-mark-gap))
);
```

## 1. Marker-led geometry

### The two groups are real, and the cut implements neither consistently

Measured on the horizontal audit lane at Site. Lane origin is the red guide;
the orange marker guide sits at 16px and the blue content guide at 32px.

| Specimen | row inset | marker box | marker centre | text box start | first glyph |
|---|---|---|---|---|---|
| Accordion summary | 8px | 8 → 24 | **16** | 32 | 32.00 |
| Checkbox toggle row | 0px | 0 → 16 | **8** | 24 | 33.85 |
| Timeline event | 0px | 0 → 12 | **6** | 28 | 28.00 |

Three specimens on one lane, three insets, three marker centres, three text
keylines. The outdent that prompted this request is **−8px** on the checkbox row
against the Accordion, in all three columns at once.

Source-side, the chain contains five marker-led implementations spelling the
same three quantities four different ways:

| Part | Cut | Group inset | Canvas | Gap | First-line offset |
|---|---|---|---|---|---|
| Button with icon | T015 | `--ds-leading-mark-group-inset-bordered-start` | `var(--icon-size, 1em)`, height `auto` | `--ds-leading-mark-gap` | `align-items: center` |
| Accordion header | T019 | `--ds-leading-mark-group-inset` | `--ds-leading-mark-canvas` | `--ds-leading-mark-gap` | `align-items: center` |
| Toggle row (checkbox, switch) | T019 | *none* | `--ds-leading-mark-canvas` | `--form-field-inline-gap` | copied `calc((lh − canvas) / 2)` |
| Choices option (radio, checkbox) | T019 | `--ds-inline-inset-field` on the fieldset | `--ds-leading-mark-canvas` | `--space-100` | copied `calc((lh − canvas) / 2)` |
| Timeline event | *no task* | none | `12px` literal | `16px` | `margin-block-start: 4px` literal |

Button in T015 is the only member that consumes the contract's group inset and
the contract's gap together. It is also the one the later marker cut does not
match.

### F1 — The bare and padded keylines cannot both be the continuation inset

The request asks for two horizontal groups: bare content flush with the real
edge, and padded content beginning 0.5rem in. That split is correct and the cut
needs it. But the arithmetic only closes at one tier.

| Tier | canvas + gap (bare text keyline) | continuation inset (padded text keyline) | residual group inset |
|---|---|---|---|
| Site | 24px | 32px | 8px |
| Docs | 24px | 24px | **0px** |
| App | 20px | 24px | 4px |

Two consequences, both measured.

- At **Site** a bare marker row's text lands 8px short of a padded one. The plan's
  open T004 question assumed "the text still has to reach the same keyline"; with
  a 1rem canvas and a 0.5rem gap it cannot, because 1rem + 0.5rem ≠ 2rem.
- At **Docs** the residual clamps to zero. Measured on the live page with
  `context:docs`: the Accordion summary's computed `padding-inline-start` is
  `0px`, its chevron box is 0 → 16, and its heading starts at 24px — *byte for
  byte the checkbox row*. The whole padded/bare distinction disappears, and the
  ghost hover fill the plan says the inset exists to give room to has none.

So the model owes a decision, not a nudge. Three self-consistent answers exist;
the cut currently ships all three at once:

1. **Two keylines.** Bare rows land at `canvas + gap`, padded rows at the
   continuation inset. Then the marker group has two insets *and* two keylines,
   and the audit lane must show them as two lanes, not one.
2. **One keyline, two insets.** Bare rows also take the group inset, so they are
   not flush with the container edge. This is what ChoicesField already does,
   via `--ds-inline-inset-field`.
3. **One keyline, one inset, per-tier gap.** The gap absorbs the difference,
   which contradicts "every icon-to-text and bullet-to-text pairing uses the same
   gap".

Whichever is chosen, `--ds-leading-mark-group-inset` should stop being a residual
of the continuation inset. A residual that clamps to zero at one of three tiers
is not a group inset; it is an accident that happens to equal 0.5rem at Site.

**Placement.** The decision and the token change are `component-contract.css`,
which is T011. No branch is pushed, so amending T011 in place costs nothing and
keeps it minimal. If T011 had already been proposed, this would have to be a
named task ahead of T019 rather than an edit.

### F2 — The smallest correct owner, per quantity

- **Marker canvas** — the marker element, consuming `--ds-leading-mark-canvas`.
  Already true for checkbox, radio, switch and the Accordion chevron. Not true
  for the Button icon (F5) or Timeline (F11).
- **Group inset** — the **row**, as `padding-inline-start`. Never the marker.
  T019 is right to have set `margin: 0` on the marker elements; what is missing is
  the row consuming the inset on the other side of that change.
- **Gap** — the **row**'s `gap`, bound to `--ds-leading-mark-gap`. Three other
  spellings are live today (F3).
- **First-line vertical offset** — one published contract output, consumed by
  rows. Something of the shape
  `--ds-leading-mark-offset-block-start: calc((var(--ds-row-line-height) - var(--ds-leading-mark-canvas)) / 2)`.
  This is not a new nudge formula and introduces no second `1cap`: it is a
  division of two values the ledger already publishes. Today the identical `calc`
  is copied verbatim into `ToggleWrapper.css` and `ChoicesField/styles.css`, and
  two further members solve it a third way (F4).

**Placement.** The published output is T011. Rebinding the four consumers is
T019, except Button which is T015 (F5).

### F3 — The shared mark gap is not shared

Measured/derived from the cut:

| Consumer | Gap source | Resolves to |
|---|---|---|
| Button, Accordion | `--ds-leading-mark-gap` | 0.5rem Site / 0.5rem Docs / 0.25rem App |
| Choices option | `--space-100` | 0.5rem, tier-invariant |
| Toggle row | `--form-field-inline-gap` | density-derived (see below) |

`--form-field-inline-gap` is not a marker token at all. On `feat/pragma-markers`
it resolves through
`:where(.comfortable, .dense, .app, .site, .docs) { --form-field-inline-gap: var(--density-padding-inline, var(--space-200)); }`
in `ds-global-form/src/index.css`, and Storybook wraps every story in
`div.comfortable.site`. On the spike that whole block is gone, so the same
declaration falls through to `--form-field-inline-gap-default` (0.5rem), which is
what the audit page renders. *Derived:* the marker-to-text gap T019 actually ships
is therefore not the 8px the audit page shows, and it will change again when T025
retires density. A slice whose stated purpose is "the marker-led row owns its
canvas, group inset, and gap" should not leave its gap on the density channel.

Related, and cheap to fix while there: T019 drops the `-default` fallbacks that
the spike carries (`row-gap: var(--form-group-gap)` and
`column-gap: var(--form-field-inline-gap)` with no second argument). Those
declarations are only valid while the density layer still defines the names. At
T025 they become invalid at computed-value time and both gaps collapse to `0`.

**Placement.** T019 — `ToggleWrapper.css` and `ChoicesField/styles.css` are both
already in its diff, so binding them to `--ds-leading-mark-gap` keeps it minimal
and removes a T025 landmine.

### F4 — First-line centring holds for two members and not the other two

Measured on the vertical page, Site, checkbox row:

| Quantity | Value |
|---|---|
| Marker box | 610.104 → 626.104 |
| Marker centre | 618.104 |
| Label line box | 606.104 → 630.104, centre **618.104** |
| Cap box (derived from the published nudge, cap = 11.088px) | 611.928 → 623.016, centre **617.472** |

So the marker is **exactly** line-box centred, and that is **+0.63px** below the
cap-height centre. Centring is not lost vertically; it is correct to the model
the contract publishes, and the residual 0.63px is the difference between
line-box centring and cap centring at Site body. It needs no new formula and no
per-component nudge. If cap centring is wanted instead, that is one more
subtraction inside the single published output in F2, not a second engine.

What *is* inconsistent is multi-line behaviour. The toggle row and the Choices
option use `align-self: start` plus the offset, so the marker holds the first
line when the label wraps — the AV-325 rule their own comments cite. The
Accordion header and the Button use `align-items: center`, which centres the
marker on the whole wrapped block instead. With a one-line heading the two agree
exactly, which is why the audit page cannot see it: every marker specimen on the
lane is single-line.

**Placement.** Accordion is T019. Button is T015 (F5). Both become one-line
changes once F2's output exists.

### F5 — The Button icon is not on the marker canvas

`Button/styles.css` sets `width: var(--icon-size, 1em); height: auto` on `> .icon`
while consuming `--ds-leading-mark-group-inset-bordered-start`, which is computed
from the 1rem canvas. `--ds-leading-mark-canvas` is `--dimension-200` = 1rem, a
root-relative length; `1em` follows the tier body size.

*Derived:* at Site both are 16px and nothing shows. At Docs and App the body is
14px, so the icon canvas is **14px against a 16px marker canvas — a 2px
divergence** — and the group inset, still computed from 16px, no longer puts the
label on the continuation keyline. `height: auto` additionally means the painted
glyph's block extent follows each icon's viewBox rather than occupying the canvas.

**Placement.** T015. `Button/styles.css` is already in that cut's diff; this is a
two-declaration change and does not make the request non-minimal.

### F6 — Switch is the one file where the spike is not a preview of the cut

`feat/pragma-markers` has `margin: 0` on `.ds.form-switch`; the spike still has
`margin-inline: var(--form-label-padding-inline, 0)`. `--form-label-padding-inline`
is unset, so the rendered result is the same today and the divergence is
immaterial to geometry. Recorded only so the Storybook is not read as authoritative
for this file.

## 2. Vanilla icon provenance

### F7 — The chevron is Pragma's own asset, and its shape is the asset, not the framing

Measured and read at source:

- On `origin/main` and on `feat/pragma-markers`, `Accordion.Item` renders
  `<span class="chevron" aria-hidden="true">`, painted by
  `mask-image: url("/icons/chevron-down.svg#chevron-down")`, sized
  `inline-size: var(--ds-leading-mark-canvas); block-size: var(--ds-leading-mark-canvas)`.
  The asset is `packages/ds-assets/icons/chevron-down.svg` in `@canonical/ds-assets`
  — Pragma's own icon package. It is not the Vanilla framework and not a third
  party.
- The file is `width="16" height="16" viewBox="0 0 16 16"` with a single filled
  path. `mask-size: contain` on a 16×16 box is therefore a 1:1 fit with no
  distortion. The ink bounding box is x 2 → 14.374, y 4.5 → 11.748, so the ink
  centre is (8.187, 8.124) against a canvas centre of (8, 8).
- The closed state is `transform: rotate(-90deg)` about that canvas centre, which
  moves the ink centre to (8.124, 7.813): a **0.31px** vertical and **0.06px**
  horizontal shift between open and closed, and an ink block extent that changes
  from 7.248px (open) to 12.374px (closed) inside the same 16px canvas.

That last line is the whole of the observed "corner/shape" behaviour: an
asymmetric filled glyph rotated inside a square canvas, read at the audit page's
1:1 zoom. The canvas geometry is exactly the marker canvas and is correct.
**A swap to a different icon source is not necessary for vertical geometry and
must stay out of the spacing re-cut.**

Two provenance facts worth recording without acting on them here: the URL is
root-absolute and resolves only because Storybook static-serves the `icons/`
directory; and the `#chevron-down` fragment targets a `<g>`, which establishes no
SVG view, so it is inert and the whole document is masked either way. Both are
packaging concerns, not alignment ones.

## 3. Audit specimens

### F8 — What the two pages do and do not contain

| Real specimen | Horizontal page | Vertical page |
|---|---|---|
| Checkbox | present, in the marker lane | present, in "Regular rows" |
| Radio | **absent** | **absent** |
| Switch | **absent** | **absent** |
| Required-marker field copy | present but unlabelled — the checkbox specimen carries `data-required` and nothing says so | same, unlabelled |
| Accordion chevron | present, and is the *only* thing the orange marker guide is computed from | **absent** — see below |
| Unordered list | absent | present as a page-local `ul`, UA geometry |
| Ordered list | **absent** | **absent** |
| Square Button | absent — see F10 | absent |

Verified by query on the live pages: `.ds.form-radio` and `.ds.form-switch` match
nothing on either route.

Three further defects in the instrument itself:

- **The Accordion's marker-led header is never measured vertically.** `BlockProbe`
  selects `.ds.accordion-item > .content`, so the "Accordion" probe under "Regular
  rows" measures the *panel*. It reports start `39.3125px`, end `77.760px` —
  identical to the "Accordion panel" probe lower down. The same part is measured
  twice under two names and the header is measured zero times.
- **The orange marker guide is coupled to spike-only markup.** `HorizontalGuide`
  computes the marker centre from `getComputedStyle(summary, "::before").inlineSize`.
  The spike paints the chevron as `summary::before`; `origin/main` and every cut
  branch render a `.chevron` element instead, for which that read returns `auto`,
  `parseFloat` returns `NaN`, and the guide silently falls back to its CSS default
  of `0.5rem`. The guide would not fail visibly — it would be quietly wrong.
- **The marker guide describes one specimen.** Both the orange and blue guides on
  that lane are derived from the Accordion alone, so the checkbox and Timeline
  specimens are measured against the Accordion rather than against a stated group
  value. That is what lets three different geometries sit on one lane looking like
  a comparison.

**Smallest location.** `packages/react/ds-global-form/src/docs/examples/SpacingAudit.stories.tsx`
and its `spacing-audit.css` exist **only on the spike** — `git cat-file` confirms
neither is on `origin/main`, and neither appears in the `origin/main..feat/pragma-surfaces`
diff. Adding Radio, Switch, a labelled required-marker row, a real `ul`/`ol` and
an Accordion *header* probe is therefore a spike-only change to one file and one
stylesheet, and **cannot make any pull request non-minimal**. Radio and Switch
already have stories at `ChoicesField.stories.tsx`, `RadioInput.stories.tsx` and
`SwitchInput.stories.tsx`, so the specimens are compositions of existing exports,
not new fixtures.

### F9 — Lists are a claimed marker-group member with no implementation and no task

The spec lists "list bullets" under the marker group. No element rule for `ul`,
`ol`, `li`, `list-style` or `::marker` exists in `styles/main/src/elements.css` or
`styles-typography/elements.css` on any branch in the chain. The vertical page's
list specimen is a page-local `ul` with `margin-block: 0` and otherwise UA
defaults: computed `padding-inline-start: 40px`, `list-style-type: disc`, first
item text at 67px — off every keyline on the page, and never shown on the
horizontal marker lane at all. No task in `tasks.md` owns list elements.

**Placement.** Either a small element-level addition to T019 consuming the same
canvas, gap and inset, or recorded as a deliberate absence in T026 and struck
from the spec's marker-group membership in T028. It should not be discovered at
T027.

## 4. Block-derived paint

### F10 — Pragma has no square Button; record the absence

`Button/types.ts` has no square, icon-only or shape prop. It has `icon?: IconName`,
documented as "a single, leading icon slot", and a doc note telling callers to pass
`aria-label` "for icon-only buttons without visible text". Grepping the React
component stylesheets for `icon-only`, `is-square` or `aspect-ratio` returns
nothing.

A childless `<Button icon="…" aria-label="…" />` is therefore expressible, but its
inline padding is still `--ds-leading-mark-group-inset-bordered-start` plus
`--ds-inline-inset-action-bordered-end`, so it renders as a padded rectangle, not
a square. It belongs to the command group, not to block-derived paint.

The block-derived lane consequently has exactly one member (Badge), which the
spec's own T006 rule flags: "a one-member group is either a mistake or needs a
stated reason." That is a statement to write, not a component to create. **Do not
create a square Button for the audit.**

## 5. Placement and reviewability

Every branch is local and unpushed, so no correction below rewrites a proposed
request. Task order is preserved throughout.

| # | Correction | Placement | Makes an existing PR non-minimal? |
|---|---|---|---|
| F1 | Decide the bare/padded keyline question; stop deriving the group inset as a clamped residual | **T011** (`component-contract.css`), amend in place | No — T011 is unpushed. Would become a new task if it had been proposed |
| F2 | Publish one first-line marker offset from the ledger | **T011**, one declaration | No |
| F2 | Row owns inset and gap; markers stay margin-free | **T019** — both files already in its diff | No |
| F3 | Bind toggle and choices gaps to `--ds-leading-mark-gap`; restore the `-default` fallbacks or remove the density dependency | **T019** | No — and it removes a defect that would otherwise surface at T025 |
| F4 | Accordion header holds the first line rather than the wrapped block | **T019** | No |
| F5 | Button icon consumes the marker canvas, not `1em`/`auto` | **T015** — `Button/styles.css` is already in that diff | No. Two declarations |
| F4 | Button icon first-line offset | **T015**, with F5 | No |
| — | Required marker advances the text keyline: `.ds.field-label[data-required]::before` is `display: inline` in flow, measured **+9.85px** from the label box start (7.60px glyph advance + 2.256px from `--form-required-marker-gap: 0.25ch`). On the audit lane the copy lands at 33.85px against a 32px keyline. `0.25ch` also makes the shift font-dependent, which the `1cap` technique already makes sensitive | **T019** — `Field/Label/styles.css` is already in its diff | No |
| F11 | Timeline event is marker-led (12px marker, 16px gap, 28px keyline), is a specimen on the marker lane, and is owned by **no task** in `tasks.md` | Add to **T019**, or name it as unaccounted in **T026** | No |
| F8 | Audit page specimens and guides | **Spike only** — the story is on no branch | No, by construction |
| F9 | List elements | **T019** or recorded absence in **T026** | No |
| F10 | Square Button | Recorded absence, **T028** write-up | No |

### Two items for the table rather than for a fix

- **Checkbox occupied block, Site vertical page:** `39.979px` against `39.317px`
  for Button, Text input and Select. Delta **+0.66px**. Both intend the same
  40px: painted 36.912px (24 + 2 × 6.456 unbordered, or 24 + 2 × 5.456 + 2 × 1
  bordered) plus 3.088px compensation. The difference is border rasterisation on
  the bordered members at this device pixel ratio, not a ledger error.
- **`--ds-leading-mark-canvas` is `1rem` at every tier** while body line-height
  falls from 24px to 20px at Docs and App. The first-line offset therefore drops
  from 4px to 2px, which is correct, but the canvas occupies 80% of the Docs line
  box against 67% at Site. Worth one row in the bucket table as a deliberate
  tier-invariant, since every other quantity on the lane is tier-scaled.
