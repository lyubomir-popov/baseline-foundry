# Pragma spacing and typography — implementation plan

**Status**: ready to execute. Supersedes the typography remediation review, which
is folded in below.

**Read first**: [`docs/typography-discipline.md`](../../docs/typography-discipline.md),
[`contracts/baseline-alignment.md`](contracts/baseline-alignment.md) and
[`spec.md`](spec.md) FR5–FR7b in this package. Where this plan and the spec
disagree, the spec wins and the disagreement is a bug in this plan — report it
rather than choosing.

**Do not restyle any further component until stages 1–4 are complete and have
passed independent review on the worktree.** This is a local gate. This package
does not merge, push, publish or release — see the spec's boundaries.

## Settled decisions

These are decided. Do not re-litigate them, and do not "improve" them mid-task.

1. **`1cap` is how Pragma does baseline alignment.** The nudge is
   `(exact role line height + 1cap) / 2` against the authenticated production
   font, and it applies to **every role, headings included**. BF continues to
   use `@lyubomir-popov/baseline-nudge-generator` for its own surfaces. The two
   repositories deliberately differ and neither is parity evidence for the
   other. The precision loss — 0.10 CSS px at body sizes, more at larger sizes —
   is accepted in exchange for maintainability.
2. **Published once, consumed everywhere.** No component stylesheet may contain
   `1cap`, a nudge literal, or a private baseline-position formula.
3. **One font size**, declared once at each tier root, inherited by every
   non-heading component.
4. **Symmetric padding, per edge**: `padding = max(nudge − border-on-that-edge, 0)`.
   Slack goes outside the border as `margin-block-end`. This is the default for
   standalone controls **and for text lists** — a `ul`/`ol` item's rhythm is
   slightly uneven as a result, and that is accepted.
5. **In-box absorption is a closed, named row family.** Active entries are Tabs
   Item, ContextualMenu Item, Combobox Option, Launchpad Table cells and
   Launchpad Log cells. Table
   qualifies because native cells cannot contribute an outside margin to row
   geometry. React SideNavigation row content and Launchpad NavigationItem
   remain future entries. Log became active only after the governed code-row
   foundation bound the existing ledger to the authenticated code role and the
   bounded implementation passed independent review. Accordion and
   FileTree/TreeView use the default
   margin form; a Lit List divider requires a separate decision.
6. **Nudges apply in the App tier.** The upstream type-scale spec still says the
   application tier is exempt; that clause is being revised separately. Follow
   this plan.
7. **Site controls are body-sized** (16/24 at a 16px root), not 14/20.
8. **Text measure ceiling is `80ch`.** Floating surfaces keep their own bounds.
9. **RichChoices options are framed box/cards, not rows.** One shared uniform
   framed-box part makes border plus padding equal the Surface inset from the
   outside edge. The child stack owns gaps and normal text leaves align
   themselves; neither shared row formula applies to the card.
10. **The first approval milestone is React-only and production-quality.** It
    covers the frozen public React inventory in one composed Storybook and
    closes transition debt in those roots. Further Lit/Svelte restyling waits
    for lead-engineer approval; existing global checks stay active and no
    cross-framework readiness claim is made early.

## Findings this plan fixes

Verified in `feat/bf-spacing-model` against `main` (`7193fe082`).

| # | Finding | Evidence |
|---|---|---|
| F1 | Twelve components each carry a private block ledger | `main` had one shared `--control-seat-line` consumed by 5 files; it now has zero consumers |
| F2 | Two different nudge techniques in one package | 11 components use `1cap`, ContextualMenu pins `0.0775rem` / `0.41rem` |
| F3 | The same literal exists in three places | BF generator, Pragma CSS, Pragma test oracle — the oracle certifies the hardcode |
| F4 | `max(0, inset − border)` written 7 times | against 4 different local border variable names |
| F5 | Body font size declared 19 times | tier roots publish the token but never apply it |
| F6 | Button is the last non-body control | `--button-font-size: var(--typography-text-secondary-font-size)`, predates the migration |
| F7 | In-box absorption needs a closed registry | Tabs, ContextualMenu, Combobox, Table and Log are active after bounded reviews; navigation remains future |
| F8 | ContextualMenu dropped the provider stroke tokens | `--dimension-stroke-thickness-medium` → hardcoded `0.0625rem`; focus ring 3px → 2px |
| F9 | Hardcoded and compounding font sizes | 6 values incl. `13px` and a compounding `0.75em` |
| F10 | Suites re-derive expectations from the implementation | a wrong shared constant passes every assertion |

## Stage 1 — the alignment contract

Create `packages/styles/typography/src/alignment.css`, in `@layer ds.tokens`,
scoped `:root, .site, .docs, .app`.

For every role reachable from the default typography entry — `h1`–`h6`,
paragraph/body and the governed code role — publish:

```css
--typography-<role>-nudge-block-start:
  mod(calc(var(--spacing-baseline) -
    mod(calc((var(--typography-<role>-line-height-dimension) + 1cap) / 2),
        var(--spacing-baseline))),
    var(--spacing-baseline));
--typography-<role>-nudge-block-end:
  calc(var(--spacing-baseline) - var(--typography-<role>-nudge-block-start));
```

The double `mod()` is required: it returns zero when a role's baseline already
falls on a grid line, rather than a full baseline. Headings are included.

Land this alone. Nothing consumes it yet.

## Stage 2 — the block ledger contract

Create `packages/styles/main/src/component-contract.css`, same layer.

**Declaration site matters, and it is not the product root.** A custom property
substitutes its `var()` dependencies at the element where it is *declared*, and
the result is inherited as an already-resolved token stream. A ledger declared
on `:root` therefore freezes the border input at the root's value, and a
component that later sets its own border has no effect on it. Verified in
Chromium, Firefox and WebKit — a root-declared padding stayed at `6.5px`
(`max(calc(6.5px - 0px), 0px)`) even though the component's border input read
`1px` on that same element.

So the row ledger is declared on the shared component marker, which every
Pragma component root already carries:

```css
@layer ds.tokens {
  :where(.ds) {
    --ds-row-border-block-start: 0px;
    --ds-row-border-block-end: 0px;
    /* …derived outputs below… */
  }
}
```

`:where()` keeps specificity at zero so a component's own
`.ds.chip { --ds-row-border-block-start: 1px; }` wins by ordinary cascade, and
because the derivation is declared *on the component*, that value participates.
The same probe returned `5.5px` for this form.

The **alignment contract from stage 1 stays on the tier roots**: it depends only
on tier facts (line height, baseline, font), never on component-local inputs, so
it does not have this problem.

Derive the row ledger once:

```
--ds-row-line-height          : the body line
--ds-row-padding-block-start  : max(nudge − border-block-start, 0)
--ds-row-padding-block-end    : max(nudge − border-block-end, 0)
--ds-row-painted-block-size   : line + padding-start + padding-end + border-start + border-end
--ds-row-compensation-block-end : mod(bU − mod(painted, bU), bU)
--ds-row-occupied-block-size  : painted + compensation
--ds-row-content-offset-block-start : border-block-start + padding-block-start
```

Borders enter **per edge**, via `--ds-row-border-block-start` and
`--ds-row-border-block-end`, defaulting to `0`. A component sets one or both. An
underlined input sets only the end edge and keeps symmetric visual insets by
construction.

Also publish the horizontal lane helpers and the semantic stroke aliases, once:

```
--ds-inline-inset-field / -action / -continuation
--ds-inline-inset-<lane>-bordered : max(0, lane inset − border-inline)
--ds-leading-mark-gap
--ds-stroke-thickness      : var(--dimension-stroke-thickness-medium)
--ds-stroke-thickness-emphasis : var(--dimension-stroke-thickness-large)
```

The stroke aliases exist so components can satisfy the provider-stroke
requirement without naming a `--dimension-*` primitive directly. The contract is
the only place a primitive is named.

Publish one in-box variant for the closed named family:

```
--ds-in-box-row-padding-block-start / -end
```

Do not add a component-specific variant or second formula. If an unlisted
component seems to need this pair, stop and ask.

## Stage 3 — apply the body role at the tier roots

```css
.site, .docs, .app {
  font-family: var(--typography-text-primary-font-family);
  font-size: var(--typography-text-primary-font-size);
  font-weight: var(--typography-text-primary-font-weight);
  letter-spacing: var(--typography-text-primary-letter-spacing);
  line-height: var(--typography-text-primary-line-height-dimension);
}
```

Add `font: inherit` for `button`, `input`, `select`, `textarea`, `optgroup` in
the reset. Do **not** solve a non-inheriting control by giving it a smaller role.

Land this alone, so any visual regression is attributable to one commit.

## Stage 4 — enforcement

Add to each package's `check:webarchitect`. Demonstrate each rule failing before
claiming it works.

**Transition policy.** These rules would fail every component that has not yet
been retrofitted, so they land with a single `config/css-contract-allowlist.json`
listing the currently non-conforming files and the rules they are exempt from.
The allowlist is seeded once, in this stage, from the actual violation set. From
then on:

- adding a file or rule to the allowlist fails the check;
- every retrofit commit in stages 5–7 removes its own entries;
- the allowlist must be empty and the file deleted before stage 9 closes.

That keeps the gate green throughout while making the remaining debt countable
and strictly decreasing.

1. No `1cap`, `mod(`, or `max(0, inset − border)` outside the contract files.
2. No numeric or `em`-relative `font-size` in component CSS; every `font-size`
   resolves through a `--typography-<role>-*` property.
3. No component CSS selects a non-body role. Authored `.code` attachments are
   permitted only for exact sources in the scanner-owned type-role registry;
   the typography mapper, not component CSS, supplies the code longhands.
4. No `var(--dimension-*)` primitive in component CSS. Components read the
   semantic aliases published by the contract — `--ds-stroke-thickness`,
   `--ds-stroke-thickness-emphasis` and the lane insets. The contract files are
   the only place a primitive may be named.
5. In component CSS: `block-size` only `auto`, `min-block-size` only `0`,
   `max-block-size` only `none`. An inline minimum must reference a paint-derived
   property. Floating-surface inline bounds are exempt; list them.
6. Footprint budget: a component may declare colour and radius aliases plus at
   most 8 geometry custom properties.
7. A separate status-aware consumer gate protects the in-box pair without
   entering the violation/allowlist basis. Exact path-plus-selector entries are
   permitted only for active consumers and the one currently authorized slice.
   It rejects unknown consumers and named future SideNavigation/Log consumers;
   Table is active after its implementation/browser evidence and adversarial
   review were accepted.

## Stage 5 — Button to the body role

Delete `--button-font-size` and its line-height partner and any alias that exists
only to carry them. Button inherits.

Do the same for the other three `text-secondary` consumers: ComboboxInput,
Launchpad Timeline Event, and `ds-shim.css`. If one genuinely needs smaller copy
it does not decide that locally — raise it with measured evidence.

Update the Button oracle and suite to assert the body role. **This is a visible
change**: flag the Chromatic routes explicitly in the PR body.

## Stage 6 — retrofit the governed components

One commit per component. For each row-like component:

- delete the private ledger and consume `--ds-row-*`;
- delete the font-family, font-size, font-weight and letter-spacing declarations
  and their private aliases (`--_chip-font-size`, `--_tabs-tab-font-size`,
  `--_contextual-menu-item-font-size`, …);
- remove the public `--chip-font-size` and `--tabs-tab-font-size` override hooks;
- set only the per-edge border inputs the component actually paints;
- standalone controls and text lists carry compensation as `margin-block-end`;
  only active members plus a single currently authorized slice use the
  in-box variant, and each carries a one-line comment naming its reason.

Launchpad Table is a dedicated bounded slice after the shared component work:

- use `border-collapse: separate` with `border-spacing: 0`;
- make `.ds.table` the ledger proxy: set block-start input to zero and block-end
  input to the nominal stroke there, then let raw `th`/`td` inherit the resolved
  in-box pair; reassert those inputs on nested `.ds.table-th`, whose nearer
  shared `.ds` derivation would otherwise recompute from defaults;
- reserve one nominal block-end stroke on every `th` and `td`, transparent when
  no separator is visible; never try to re-derive the pair with an input on a
  raw native cell;
- make cells own padding/compensation and rows own neither;
- use Field inline inset, top-align cells, inherit body type in body/footer
  cells, and alter only governed weight in header cells;
- keep multiline growth intrinsic, one body line-height per extra line, with
  the tallest cell owning the row; keep `colspan`, while `rowspan`, arbitrary
  block children and non-zero child block margins remain outside this slice;

After Table acceptance, land the Log work in two serial junctions:

1. Make the one row formula role-parametric through contract-owned body defaults
   and a closed `.ds.code` override; extract the five code font longhands into a
   typography-owned and exported `code-role.css`, wire every direct/composed
   entry with packed-subpath proof, and add an exact production authored-class
   registry. This foundation is count-neutral and must
   be independently accepted before Log CSS changes.
2. Make `.ds.log-line.code` the zero-border proxy and let raw cells inherit the
   shared in-box pair. Replace five primitive spacing uses with existing
   Surface/Field semantics. Delete `min-width: fit-content` after a removal
   negative proves wrap/no-wrap and horizontal scrolling remain correct. If it
   is required, stop the Log slice for an architecture decision; it cannot be
   classified under the paint-derived inline-minimum rule.
- render header vertical separators and the footer-top rule as zero-footprint
  paint; and
- make SortButton inherit typography and stay intrinsic with a stable icon slot,
  no block padding, row ledger, or target that can enlarge the row; use zero
  block-axis row gap in wrapping header layout (or prove equivalent whole-line
  growth), preserving interaction and accessibility behavior.

ContextualMenu additionally (F8):

- consume `--ds-stroke-thickness` for the surface border, divider and ledger
  border input, replacing `0.0625rem`;
- consume `--ds-stroke-thickness-emphasis` for the focus ring — it was silently
  reduced from 3px to 2px;
- delete the pinned `0.0775rem` / `0.41rem` nudges and the `.site` override;
- remove the string assertions in `ContextualMenu.spacing.tests.ts` that pin
  those literals;
- keep `12rem` / `20rem`; those are sanctioned surface bounds.

RichChoicesField is a separate bounded box/card correction after the accepted
Table and Log slices:

- remove `.ds.form-rich-choices` from the shared form-row padding alias
  selector;
- remove the private `--start-nudge` and `--end-nudge` calculations;
- remove `.p` from the outer label/card;
- bind the shared uniform framed-box border input on `.ds.option` and consume
  its protected block/inline padding outputs, keeping the physical outside-edge
  inset equal to `--spacing-inset-surface-block` and
  `--spacing-inset-surface-inline` without copying the formula;
- keep the existing flex column as the content stack and the existing semantic
  field gap between children;
- render scalar string/number labels in one `.p` text leaf, leaving rich
  ReactNode content responsible for explicit text leaves;
- preserve intrinsic/equal-height card composition and all native input/label
  selection semantics; and
- add a parsed/decoded source gate for the two exact retired custom-property
  names without changing the allowlist basis.

Do not add RichChoicesField to the in-box registry. The small shared uniform-box
calculation is not a row formula and remains the sole owner of its arithmetic.

The next T019 slice is the existing sectioned Card pattern. React is completed
and reviewed first; the Svelte WPE port is deferred until the React pilot's
lead-engineer approval:

1. Complete React Card now. Preserve the mapping for a later Svelte WPE port,
   which must supply its own framework-specific evidence.
2. Keep the transparent outer frame, subgrid, clipping and edge-to-edge image.
3. Map the frame stroke to `--ds-stroke-thickness`; map section block/inline
   padding to the existing Surface inset; map Content/Footer child gaps and
   Content's tighter top padding to the existing Field block gap.
4. Use the Surface inline inset for Header's minimum arbitrary-child gap.
5. Preserve local `--card-*` overrides at use sites, removing root defaults
   that would freeze product values too early.
6. For React, prove intrinsic wrapping, equal outer heights in a group, image bleed,
   header/content seam, Footer wrapping and text-leaf alignment at 16px/18px in
   Site, Docs and App.

After React Card, freeze the public React inventory and execute the composed
Storybook/browser/build/accessibility closeout in T072-T078. Do not start the
broad Lit/Svelte port as a condition of that review.

Do not make a shared Card formula, add Card to a row family, add a background
or normalize its intentionally asymmetric section padding.

## Stage 7 — fix the remaining font-size and length defects

| File | Now | Change |
|---|---|---|
| Launchpad `CodeDiffViewer` | `font-size: 13px` | code role |
| form `ComboboxInput` | `font-size: 0.75em` | code or body role — **compounding bug**, do first |
| Launchpad `DiffChangeMarker`, `MarkdownEditor` | `0.75rem` | body role |
| Launchpad `FileTree/SearchBox`, form `ResetButton` | `1rem` | inherit |
| `Tooltip` | `--tooltip-max-width: 284px` | `32ch` |

Publish the measure token at `80ch` and apply it to text elements only.

Quarantine `packages/react/tokens` with a comment saying it is a token inspector,
not product UI, and exempt it from the stage 4 rules. Do not migrate it.

## Stage 8 — retarget the suites

The current suites recompute their expectations from the measured value, so a
wrong shared constant passes every assertion. For each component suite:

- assert **consumption** — that the component's resolved padding equals
  `--ds-row-padding-block-*` — rather than re-deriving the ledger;
- take expected nudges from the shared contract, never from `1cap` in the test;
- assert the first baseline against an independent zero-size inline marker;
- keep the device-snap envelope pattern already used in `Chip.spacing.pw.ts`
  after the border review — it is correct, reuse it rather than reinventing it;
- add negative controls in the style of the Chip's zero-border chip: a
  deliberately wrong value must fail.

Add one **lane propagation test** per horizontal lane: render one component from
every family in that lane, override the lane token, and assert every member's
first glyph moved by the same delta.

## Stage 9 — spec reconciliation (reopened by owner decision)

`spec.md` and the alignment contract have been reconciled to the `1cap`
decision: the problem statement, boundaries, outcomes, user story P1, FR5,
5a–5h, FR6, 6a, 6b, 7c, FR14, FR15, acceptance 3, 11, 12, 14–16 and the
dependency decision. `contracts/metric-nudge-migration.md` has been replaced by
[`contracts/baseline-alignment.md`](contracts/baseline-alignment.md).

The owner subsequently authorized Table, and named SideNavigation and Log as
future members of the closed in-box family. Table is now independently accepted
and active. If you find a conflicting clause, report it rather than implementing
around it.

## Acceptance

- No component stylesheet contains `1cap`, a nudge literal, a private
  baseline-position formula, or `max(0, inset − border)`.
- Exactly one body `font-size` declaration per tier root; none in component CSS.
- `git grep` finds no `text-secondary`, `text-tertiary`, `--font-size-small` or
  `--font-size-default` in component CSS.
- No target height, no block minimum other than `0`, no block maximum other than
  `none`.
- Only active members of the closed registry absorb compensation in-box, each
  with a comment naming the reason. Table satisfies the native-cell rules above;
  Log proceeds only after its governed code-row foundation; future navigation
  entries remain unchanged.
- ContextualMenu's border, divider and focus ring read the provider stroke
  tokens; the focus ring is back to the large stroke.
- RichChoices option cards have equal provider Surface padding, normal aligned
  text leaves, no row-contract consumption and no retired private nudge input.
- Each stage 4 rule is shown failing a deliberate violation before being called
  green.
- `config/css-contract-allowlist.json` is empty and the file is deleted.
- Lane propagation tests pass for all three lanes.
- Root `bun run check`, `bun run test` and `bun run build` pass. Chromatic routes
  reviewed, with the Button size change called out in the PR body.

## Do not

- Do not add a type scale, size modifier API, or `size` prop.
- Do not reintroduce a density mechanism.
- Do not add a target height, block minimum or block maximum to make something
  look right. If geometry is wrong the component should look broken — that
  visibility is the point.
- Do not fix a non-inheriting control by giving it a smaller role.
- Do not let a test re-derive its expectation from the implementation's formula.
- Do not restyle new components until stages 1–4 are merged.
- If a rule here blocks something that seems genuinely necessary, stop and ask.
  Do not invent a variant.
