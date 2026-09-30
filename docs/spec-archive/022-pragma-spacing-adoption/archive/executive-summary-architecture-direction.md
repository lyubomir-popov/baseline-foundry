# Pragma component CSS — proposed architectural direction

**For**: Pragma lead engineer
**Subject**: what changes relative to `origin/main`, and why
**Status**: proposal, nothing merged

## How to read this

This argues from Pragma's own code rather than from any external system. Where a
governing spec is relevant I say so, including where I think the spec is
currently wrong — several of the problems below were *caused* by following it.
The intent is not "adopt the spec as written". Two of its clauses need
withdrawing and one of its guiding documents contradicts itself three times.

I've split the proposal in two on purpose:

- **Part A** is true regardless of your position on the typography and spacing
  specs. It is deduplication, removing hardcoded constants, and enforcement.
- **Part B** carries design positions you may disagree with. Those are argued on
  their merits, with what they cost stated.

If you accept only Part A, the work is still worth doing.

## Where `main` is today, fairly stated

`origin/main` (`7193fe082`) resolves control geometry through a **shared layer**.
`packages/styles/main/src/modifiers.density.css` exports a contract with an
explicit comment:

> ONE seat for every control (button, input chrome, accordion header, …): the
> text's own line box — the density cell minus one baseline of headroom per side
> (`--control-seat-line`) — IS the control interior. The height is INTRINSIC: no
> block-size; border + pads + line-height add up to the cell.

That seat is consumed by five component files: `ds-global-form/density.css`,
Accordion, Button, and the Svelte WPE Button. The structural instinct is right —
one owner derives the geometry, components consume it — and the height was
already intrinsic.

What's wrong with it isn't the structure, it's the contents:

- **Product context and density are the same mechanism.** The selector is
  `:where(.comfortable, .dense, .app, .site, .docs)`, so choosing a product also
  chooses a density, and any wrapper can resize every descendant that never
  consented to it.
- **A target cell drives the geometry**: `--density-target-baseline-px` is
  `round(nearest, line-height × 2/3, baseline)`. Geometry comes from a rounded
  target rather than from the text's real metrics.
- **Legacy magnitude aliases** rather than semantic roles — `--font-size-small`,
  `--line-height-small`, `text-tertiary-bold` on Badge.
- **Elements own semantic spacing** through `spaceAfter`, so a paragraph decides
  how much space follows it regardless of what comes next.
- **Pinned to `@canonical/design-tokens` 0.8.1**, predating the resolved spacing
  matrix and the exact line-height dimensions.

## What the migration has done, and the one regression

The in-flight branch fixes every one of those contents problems. Density no
longer resizes descendants, target cells are gone, Chip moved from
`--font-size-small` to the body role, Badge from `text-tertiary-bold` to the body
role, Tabs lost an authored `min-block-size` of five baselines, and the provider
is on 0.9.0 with real line-height dimensions. Each component landed with a
browser suite across three engines, two DPRs and two root sizes.

**But the shared layer went with it.** `--control-seat-line` now has zero
consumers — the only reference left is a test asserting its absence. In its place
are **twelve private ledgers**, one per component, each re-deriving the same start
nudge, symmetric padding, painted block, compensation and occupied block.

So, honestly: `main` had the right structure with the wrong contents; the branch
has the right contents with no structure. The proposal is to have both. This is
not a criticism of the branch — each slice did the locally correct thing, because
no slice was ever scoped to create the shared owner.

The divergence is already measurable. Eleven of the twelve derive the metric
nudge as `(line-height + 1cap) / 2`. The twelfth pins literals — `0.0775rem`, and
`0.41rem` for Site. Separately, the horizontal rule `max(0, inset − border)` is
hand-written in seven places against four different local border variable names.

## Part A — changes that stand on their own

### A1. Restore a single owner for the block ledger

Emit the ledger once in `packages/styles/main`, in `@layer ds.tokens`, scoped to
`:root, .site, .docs, .app` — structurally what `--control-seat-line` did, with
the corrected contents. Components consume and derive nothing.

The horizontal axis shows why. Today, changing an inset's **value** propagates
correctly, because every component reads `--spacing-inset-action-inline` by name.
Changing the **rule** — half-border subtraction, a fourth lane, folding the mark
gap into the inset — is seven edits with seven chances to diverge. Same for the
block ledger, at twelve.

### A2. No hardcoded metric constants

`0.0775rem` and `0.41rem` should not be in component CSS, and neither should the
test fixture that certifies them. The same literal currently lives in three
places: the generating repo, Pragma's CSS, and Pragma's oracle.

Worth knowing how it got there, because it wasn't carelessness. The governing
repo's docs state in three always-on locations that the formula-based approach is
"DEMO ONLY" and "unreliable", and its generator bakes the constant. Whoever wrote
that component followed the written rule. **The fix starts by correcting those
documents**, not by adding a review checklist.

The evidence favours the formula at body sizes. With pinned constants the first
text baseline lands 0.45–0.77 CSS px off the product grid in Chromium; the
formula-derived Chip is on-grid to 0.006 px. The objection to the formula
(cap-height ≠ ascender, so it drifts) is real, but it bites at display sizes, not
at 14–16px body text.

### A3. Declare the body font size once, at the product root

`.site`, `.docs` and `.app` publish `--typography-text-primary-font-size` and
never declare `font-size`. Nothing inherits a body size, so **nineteen** component
declarations exist to compensate for one missing line.

Add the declaration at the product roots, plus `font: inherit` on the elements
that don't inherit by default (`button`, `input`, `select`, `textarea`). Every
component declaration then becomes deletable. This is a pure reduction and
implies nothing about which sizes are permitted.

### A4. Make the rules mechanically checked

Documentation hasn't held this line — the governing docs are unusually detailed
and still produced twelve duplicated ledgers. Every package already runs
`check:webarchitect`, so this adds no CI surface:

- no `1cap`, `mod()`, or `max(0, inset − border)` outside the contract file;
- no numeric or `em`-relative `font-size` in component CSS;
- no `var(--dimension-*)` primitives in component CSS — semantic names only;
- a footprint budget: a component may declare colour and radius aliases plus at
  most N geometry properties, then it must use the contract.

Related: our oracles pin resolved *values* rather than formulas, which is how a
hardcode ends up certified by the suite that should have caught it.

## Part B — the design positions

### B1. One font size for all non-heading UI

**Position**: buttons, chips, badges, menu rows, tabs, navigation items and form
controls render at the product body size. Exceptions are a closed list — real
headings, elements that don't inherit, monospace runs, and reviewed small-surface
components. That last list is currently empty.

**Why**: this is deliberately stricter than the norm, where a system publishes a
scale, each component picks a step, and pages end up with as many sizes as
components with no one able to say why anything is 13px. The reference is
Vignelli's two-sizes-per-page discipline — in practice `h1`/`h2` for titles, then
one shared size for everything else. We can't force consumers to design that way,
but that should be the default, and deviation should be deliberate and argued.

There's a mechanical benefit too: every additional size is another line box,
another metric nudge, another compensation, and another way to fall off the
baseline. One size means one ledger.

**What it costs**: Site buttons move from 14/20 to 16/24. That deviation predates
the migration — it is on `main` today — and Spec 022 then wrote it in as a MUST
in three places. Those clauses are withdrawn, but this is a **visible change**
needing Chromatic review and a conversation with design, not a silent swap.
Blast radius is four files; `text-secondary` has exactly four consumers.

Note the coincidence: Site secondary (14/20) is identical to Docs/App body, so
Site buttons currently render at Docs body size.

### B2. Intrinsic geometry, no target heights or floors

**Position**: `block-size: auto`, no block minimum other than `0`, no block
maximum other than `none`. A row's height is its line box plus derived padding
and compensation.

**Why**: if the ledger is wrong the component looks wrong immediately. A floor
hides the same error, so the system looks correct while being incorrect. Craft
becomes consistency and discipline rather than patching.

**Mostly already true** — `main`'s seat was intrinsic and Tabs' authored height is
gone. `min-block-size: 0` stays; it's flex/grid plumbing that lets an item shrink
and truncate, not a size. Two paint-derived **inline** floors remain and should:
Badge's circle floor and Chip's stadium floor.

### B3. Containers own gaps; elements own only metric compensation

**Position**: an element emits only the slack between its painted block and the
next baseline multiple, as a trailing **margin**. Semantic separation between
complete things belongs to the container. A hosted row that must not carry an
external margin absorbs the same amount as block-end padding instead.

**Why margin rather than padding**: padding would inflate the painted box to
achieve grid alignment, so the visible surface grows to satisfy the grid. Margin
keeps the painted box honest and collapses correctly.

**What it costs**: `spaceAfter` goes away, and with it an element's ability to
declare its own trailing space. That is a real capability removed. The argument
is that "how much space follows this paragraph" depends on what comes next, which
the paragraph cannot know.

### B4. Density is retired, not replaced

The branch removes global `.comfortable`/`.dense` because product context and
density were the same mechanism. **This is a capability loss and should be named
as such.** A governed density feature is legitimate; it needs its own provider
artifact, component manifest and spec. It should not return as a wrapper class
that mutates arbitrary descendants.

## Measure — settled, with one open detail

Team decision: **text elements get `max-width: 80ch`** (~40rem), slightly above
Bringhurst's 45–75 characters and agreed as what we need. That becomes a token in
the shared layer and applies to text, not to every box.

One detail: `ch` is the advance width of `0` in the *current* font, so `80ch` is
not a fixed rem value and shifts if the font changes. If you want a guaranteed
measure, pick one unit and stay in it. I can measure what `80ch` resolves to in
Ubuntu Sans at each product size if that helps the call.

**Popups are explicitly out of scope.** ContextualMenu's `12rem`/`20rem` stay as
component-local values; we are not building a popup width system and should not
stop anyone making a popup a different size. The one thing worth fixing is
Tooltip's `284px`, the only length in the component CSS that doesn't scale with
root size at all — a unit conversion, not a policy.

## What actually changes

| | `main` | Branch today | Proposed |
|---|---|---|---|
| Block ledger | one shared seat | 12 private copies | one shared contract |
| Metric nudge | rounded target cell | 11 formula, 1 pinned | formula, in the contract |
| Body font size | per component | per component (19×) | once, at the product root |
| Non-heading UI size | mixed roles | mixed roles | body role |
| Trailing space | element `spaceAfter` | metric margin | metric margin |
| Density | wrapper-driven, global | retired | retired, needs its own spec |
| Text measure | none | none | `80ch` token |
| Enforcement | none | none | webarchitect rules |

## Sequence

1. Settle the nudge question with measurements across tiers and roots.
2. Correct the governing documents so they stop mandating the hardcode.
3. Add the authoring instructions and the lint rules.
4. Declare the body role at the product roots — **alone**, so any regression is
   attributable. Then move Button. Then delete the per-component declarations.
5. Port the shared contract layer.
6. Add lane-propagation tests: override a lane token, assert every component in
   that lane moved by the same delta.
7. Retrofit the twelve components; each should shrink sharply.
8. Resume new component work.

Steps 1–4 stop the bleeding. The rest is mechanical.

## What we are not proposing

- No type scale, size modifier API, or `size` prop.
- No new density mechanism.
- No popup or surface width system.
- No change to component APIs, markup, or accessibility behaviour.
- No re-litigation of components already migrated correctly — Chip, Badge,
  Button, Tabs and the form ledger keep their contents; only duplication is
  removed.

## Decisions needed

1. **Formula or baked constant** for the metric nudge. Everything waits on this.
   Recommend formula, on the measurement above.
2. **Site buttons to 16/24** — needs a Chromatic slot and design sign-off.
3. **Whether components keep public font-size override hooks.** Chip and Tabs
   expose them; they contradict the single-declaration rule and are only safe
   when the ledger is formula-derived. Recommend removing.
4. **Timing.** At twelve components the retrofit is a fortnight of mechanical
   work. At forty it is a project.

## One thing to know before anyone claims zoom parity

A nominal 1px border paints as a **single physical pixel** at 125% and 150%
display scaling in Chromium, Firefox and WebKit — engine behaviour, not a Pragma
defect, and not fixable in CSS. Because the ledger's compensation is computed
from the nominal border, the occupied block sits 0.4–0.7 CSS px off-grid at those
zoom levels. The current suites cannot detect this: Playwright's
`deviceScaleFactor` doesn't engage layout-level scaling in Chromium or Firefox,
so the matrix never enters that regime. Native zoom evidence remains genuinely
open.
