# Contract: Pragma baseline alignment

## Decision

Production alignment in Pragma is computed in CSS from `1cap` against the
authenticated production font, declared once as deferred token streams, and
consumed by every role and component. It applies to all roles, headings
included.

This is a deliberate accuracy trade in favour of maintainability. Measured
against Ubuntu Sans, `(line + 1cap) / 2` differs from generated metrics by
0.10 CSS px at body sizes and by more at larger sizes. In exchange Pragma
carries no build-time generator dependency, no constants to keep fresh across
repositories, and one formula that follows whatever font is actually loaded.

BF continues to use `@lyubomir-popov/baseline-nudge-generator` for its own
surfaces, where the higher-fidelity tool costs nothing to adopt. The two
repositories deliberately differ. Neither one's alignment output is parity
evidence for the other, and their nudge values MUST NOT be compared for
equality.

## Three concepts that must not be conflated

1. **Alignment data** — the per-product, per-role start nudge and its
   complementary end compensation. One owner, published once.
2. **Occupied-block rules** — the shared formulas that combine a nudge with the
   product baseline and the component's own paint. One owner, published once.
3. **Cap-relative optical uses** — icon centring and similar optical
   adjustments. These legitimately use `1cap` but MUST NOT feed block geometry,
   and are inventoried separately.

## Owned artifacts

```text
packages/styles/typography/
└── src/alignment.css        the alignment contract (1), on the tier roots

packages/styles/main/
└── src/component-contract.css   the row and lane ledgers (2), on :where(.ds)
```

Both are emitted in `@layer ds.tokens`. Neither may contain a component
selector.

### Declaration site is part of the contract

A custom property substitutes its `var()` dependencies at the element where it
is **declared**, and the resolved token stream is what inherits. A derived
property declared on `:root` therefore freezes every input at the root's value,
and a descendant that later sets one of those inputs cannot change it.

Verified in Chromium, Firefox and WebKit: with `--nudge: 6.5px` and a component
setting `--border: 1px` on itself, a root-declared
`max(calc(var(--nudge) - var(--border)), 0px)` computes to
`max(calc(6.5px - 0px), 0px)` — 6.5px — while the same expression declared on
`:where(.ds)` computes to `max(calc(6.5px - 1px), 0px)` — 5.5px.

So:

- the **alignment contract** depends only on tier facts — line height, baseline,
  font — and is declared on the tier roots;
- the **row ledger** consumes component-local border inputs and MUST be declared
  on the shared component marker `:where(.ds)`, which every Pragma component
  root already carries. `:where()` keeps specificity at zero so a component's own
  rule wins by ordinary cascade.

This is the same constraint the pre-migration `--control-seat-line` layer
documented when it exported only "border-agnostic pieces". The difference is
that the ledger is now declared once on a shared selector rather than
re-derived per component.

### Semantic aliases

The contract is the only place a `--dimension-*` primitive may be named.
Components consume semantic aliases:

```css
--ds-stroke-thickness:          var(--dimension-stroke-thickness-medium);
--ds-stroke-thickness-emphasis: var(--dimension-stroke-thickness-large);
```

This is how a component satisfies the provider-stroke requirement without
reaching for a primitive itself.

There is no generated artifact, no config file of nudge values, and no
build-time generation step. The contract is CSS, evaluated by the browser
against the live font, so it cannot go stale relative to the face in use.

## Semantic output

Every role reachable from the default production typography entry — `h1`–`h6`,
paragraph/body and the governed code role — declares:

```css
--typography-<role>-nudge-block-start:
  mod(calc(var(--spacing-baseline) -
    mod(calc((var(--typography-<role>-line-height-dimension) + 1cap) / 2),
        var(--spacing-baseline))),
    var(--spacing-baseline));
--typography-<role>-nudge-block-end:
  calc(var(--spacing-baseline) - var(--typography-<role>-nudge-block-start));
```

The double `mod()` encodes the exact-tie case: a role whose baseline already
falls on a grid line gets a zero nudge, not a full baseline.

These custom properties do not publish pre-resolved lengths. They carry an
unresolved token stream containing the shared unregistered `1cap` value, which
is resolved only when a concrete CSS property consumes it. A role nudge is
therefore correct only on an element that already carries that same role's font
family, font size and line height. Consuming a heading nudge on body text,
selecting the code family while consuming the body nudge, or overriding the
shared row line-height input detaches the result from its role and is a contract
violation. Enforcement MUST reject cross-role nudge consumption and
component-local font-family, font shorthand, line-height, role inputs or derived
`--ds-row-*` output overrides. Components MAY set only
`--ds-row-border-block-start`, `--ds-row-border-block-end`,
`--ds-row-border-inline`, `--ds-row-border-inline-start`,
`--ds-row-border-inline-end`, and `--ds-row-content-block-size` as the shared
calculation's reviewed local inputs.

The ledger binds the role without exposing role choice to components:

```css
:where(.ds) {
  --ds-row-line-height: var(--typography-text-primary-line-height-dimension);
  --ds-row-nudge-block-start:
    var(--typography-text-primary-nudge-block-start);
}

:where(.ds.code) {
  --ds-row-line-height:
    var(--typography-text-primary-code-line-height-dimension);
  --ds-row-nudge-block-start:
    var(--typography-text-primary-code-nudge-block-start);
}
```

The existing formulas read those two contract-owned inputs. A component may
not declare or alias them. `.ds.code` selects the governed provider code role
only for exact source markers in the closed type-role registry; it does not
grant in-box membership.

Row-like component stylesheets consume the row properties. Ordinary text leaves
consume alignment through the typography mapper. Card frames do not consume row
geometry. A component stylesheet MUST NOT contain `1cap`, a nudge literal, or a
private baseline-position formula.

Public `--*-font-family`, `--*-font-size`, `--*-line-height` and
`--*-start-nudge` overrides are withdrawn from the component API: they detach a
component from the contract and from the font geometry it is computed against.
Test-only fault injection may override the contract at a fixture root and MUST
NOT be documented as a consumer hook.

## Font authentication

`1cap` resolves against whichever font is actually in use, so a fallback face
silently changes every nudge in the system. Authentication is therefore a
**stronger** requirement under this technique than under generated metrics, not
a weaker one:

- production entry points MUST load or transitively require the authenticated
  font assets;
- the font-asset package MUST be a real dependency, not an optional peer;
- a package check MUST fail when the resolved face is not the named one;
- every competing same-family `@font-face`, including older Launchpad assets
  with different vertical metrics, MUST be removed or repointed to the single
  authenticated owner;
- browser geometry evidence MUST wait for font readiness before measuring.

The authenticated faces use `font-display: swap`. During the swap interval the
browser may temporarily resolve `1cap` against its fallback face, so glyph
position can shift by a sub-pixel amount when Ubuntu Sans becomes ready. The
row compensation still snaps the complete occupied block to the product grid;
this transient is not permission for a different final face or a wider
alignment tolerance. Production geometry evidence MUST await
`document.fonts.ready` and verify the authenticated face before measuring. This
keeps normal page rendering non-blocking while making the reviewed geometry
deterministic.

Provider inputs — baseline, role font size and exact line height — MUST be
authenticated against the resolved `@canonical/design-tokens` artifact, with
provenance recording the package version, Bun lockfile SRI and raw-byte
SHA-256 values for `sets.primitive.css`, `modifiers.spacing.css` and
`modifiers.typography.css`. A stale provider input MUST fail rather than fall
back.

## Evidence rules

- A test MUST NOT re-derive its expected nudge with `1cap`. Doing so makes the
  suite agree with the implementation by construction, which is the defect that
  let a wrong pinned constant pass twelve browser configurations.
- First-baseline evidence uses an independent zero-size inline baseline marker.
- Expected values come from the shared contract, or from a reviewed measurement
  that does not repeat the implementation's own formula.
- Grid-seating tolerances MUST be stated per engine and justified. Browsers
  quantize the in-line-box baseline — Chromium to whole pixels, Firefox and
  WebKit to halves — so exact seating is not achievable by any CSS technique,
  and a tolerance fitted to the observed error is not evidence.

## Reusable composition parts

Components are assembled from the small set below. Authors choose the closest
known part; they do not invent a component-specific spacing formula.

| Part | What it means | Current examples |
|---|---|---|
| Ordinary text | A paragraph, label or other text leaf. Its own typography aligns its first line and supplies the small amount of space needed to reach the next grid line. | Paragraphs, labels, Card text |
| Bare marker-led content | A fixed marker canvas followed by text with one shared marker-to-text gap. It has no hover/selection background of its own, so it adds no outer Action padding. The marker may be an icon, bullet, status dot, checkbox, radio or switch. | Checkbox, Radio, Choices, Switch, plain lists |
| Painted marker-led row | A hover/selection wrapper containing the same marker-plus-text content. The wrapper adds the Action/group inset before the marker so its paint has breathing room while the text still reaches the intended paragraph/Continuation keyline. It does not change the marker-to-text gap. | Accordion and menu rows; SideNavigation after its bounded decision |
| Framed box/card | One border/background/radius around one content stack. Each actual border edge is counted inside the promised outside-edge inset. Text inside remains ordinary text. | RichChoices option card; uniform, single-edge and asymmetric variants reuse the same part |
| Sectioned card or panel | One outer frame containing named content areas. Each area owns its padding and child gaps; a text-only panel may start directly at the product gutter and does not need a marker. | React Card Header/Content/Footer; panel content where specified |
| Bordered field with trailing artwork | A native field counts each inline border separately, keeps the normal Field inset at the text edge, and reserves one fixed canvas plus the same inset at the trailing edge. | Single Select; other trailing-action fields only after they prove the same shape |
| Attached-edge row or cell | A row whose fill, divider, active bar or native cell edge must stay attached to the grid. Its final compensation therefore remains inside the painted box. | Tabs, ContextualMenu, Table, Log; SideNavigation after its bounded decision |

Images and other responsive media are allowed to introduce a free phase inside
their own area. Overlays such as Popover and Tooltip use the framed
card/panel parts but still need focused edge-placement evidence because their
arrow and viewport fit are independent of text alignment.

The technical “row ledger” below is only the shared arithmetic behind ordinary
rows. It is not a sixth visual part and is not a component-authoring API.

In implementation terms, both marker variants consume
`--ds-leading-mark-canvas` and `--ds-leading-mark-gap`. Only the painted variant
adds `--ds-inline-inset-action` or the existing
`--ds-leading-mark-group-inset` needed to place its text on the declared
keyline. A component MUST NOT create a second marker gap or fold the outer
hover padding into the marker-to-text relationship.

## Block ledger

For product baseline `B`, exact line box `L`, start nudge `N` and the border on
each block edge:

```text
paddingBlockStart = max(N - borderBlockStart, 0)
paddingBlockEnd   = max(N - borderBlockEnd, 0)
paintedBlock      = L + paddingBlockStart + paddingBlockEnd
                      + borderBlockStart + borderBlockEnd
compensation      = (B - (paintedBlock mod B)) mod B
occupiedBlock     = paintedBlock + compensation
```

Because each edge subtracts only its own border, the content offset from each
outer edge equals `N`, and `paintedBlock` reduces to `L + 2N` whenever both
paddings are non-negative. A control bordered on one edge only — an underlined
input — therefore keeps symmetric visual insets with no special case.

### Border profiles and state invariance

Every border-bearing rendered box or subpart MUST declare its actual per-edge
profile. The named profiles below are authoring conveniences and demo cases,
not a closed list; the shared calculation is built from four independent edge
inputs.

| Profile | Shared inputs | Required behavior |
|---|---|---|
| No border | all edge inputs are `0` | text and occupied size follow the ordinary shared result |
| Single edge | exactly one block or inline edge equals its actual tier stroke | the rule remains attached without shifting the text baseline or inline keyline |
| All edges | both block edges and both inline edges equal their actual tier stroke | border plus padding equals the promised outside-edge inset |
| Asymmetric/custom edges | each edge supplies its actual width independently | mixed frames such as `1px 1px 0 1px` and public per-side overrides use the same calculation, not a private formula |
| Stateful emphasis edge | the active edge uses the tier emphasis stroke, commonly 3px | reserve that width in every state with transparent inactive paint, or use an inset/pseudo/outline that has zero layout footprint |

Tier roots own the normal/emphasis stroke and inset facts. The formulas do not
live on the tier root: they resolve once on the actual painted box, normally a
`:where(.ds)` component host. A bordered internal descendant uses the narrow
`.ds-framed-box` marker, which enables only the same framed-box calculation and
not the row, typography or component-root contracts. This distinction prevents
inherited custom properties from freezing the zero-border default before the
painted box supplies its border.

Any production `border-*-width` or border shorthand MUST either feed the exact
shared per-edge input on the same host, consume a shared framed-box result, or
be classified as zero-layout/internal artwork paint. This applies to nested
parts as well as the component root. A hover, selected, checked, focus or active
state MUST NOT change the measured outer box or text inset. Contract tests cover
no-border, each single-edge orientation, all-edge and asymmetric profiles, the
3px transparent-to-painted transition, zero-layout 3px emphasis, LTR/RTL and
tier/root-size variation; each stateful component also needs a focused rendered
invariant. Tabs' 3px inset active bar, for example, is paint and MUST NOT be
subtracted from padding as though it were a real border.

For a real reserved edge, its width MUST be no greater than the applicable
nudge or outside-edge inset. Above that bound the non-negative padding clamp
cannot preserve the promised content offset, so the emphasis must use
zero-layout paint instead.

Compensation is emitted as `margin-block-end`. This is the default for
standalone controls and for text lists; a `ul`/`ol` item carries its nudge above
and its compensation below, which makes the rhythm around each item's text
slightly uneven, and that is accepted.

### Closed in-box row family

A component may absorb compensation inside its box only when it is named here.
Membership requires either block-end paint that must sit on the grid, a
continuous row fill, or native row layout whose cells cannot contribute an
outside margin to row geometry. No selector pattern or resemblance grants
membership.

| Component | Status | Reason |
|---|---|---|
| React Tabs Item | active | the active inset bar paints on the block-end edge |
| React ContextualMenu Item | active | hover and selection fills stay continuous between rows |
| React Combobox Option | active | the continuous option surface already consumes the shared in-box pair |
| Svelte Launchpad Table `th`/`td` | active | native table cells cannot make an outside margin contribute to row geometry; separators must remain attached to the row |
| Svelte Launchpad Log line cells | active | native code-row cells cannot contribute outside margin; normal and target fills remain continuous |
| React SideNavigation Item/Header/NavTree group-header rows | future | named by the owner for a later bounded navigation slice |
| Svelte Launchpad NavigationItem | future | named by the owner for the same later navigation-family decision |

Launchpad Table uses `border-collapse: separate` and `border-spacing: 0`.
`.ds.table` is the ledger proxy for raw native cells: it sets block-start border
input to zero and block-end input to the nominal shared stroke, resolves the
shared in-box pair on that `.ds` host, and raw `th`/`td` inherit the pair. A
`Table.TH` is itself `.ds.table-th`, so it MUST reassert the same two inputs on
its own host; otherwise its nearer `:where(.ds)` declaration recomputes from
defaults and shadows the inherited Table result. Inputs on a raw cell cannot
re-derive inherited outputs and are forbidden.

Every cell reserves one nominal block-end stroke, transparent where no
separator is visible. Cells own padding and compensation; rows own neither.
Cells are top-aligned and use the Field inline lane. Body cells inherit the body
role; headers change only their governed weight. Multiline content grows
intrinsically by one body line-height per additional line, with the tallest cell
determining row height. `colspan` remains supported. `rowspan`, arbitrary block
children, and non-zero child block margins are outside this slice. Header
vertical separators and the footer-top rule are zero-footprint paint.
SortButton inherits typography, has no block padding, row ledger, or target that
can enlarge the header row, retains a stable icon slot, and preserves its
semantics. A wrapped header-label/action layout has zero block-axis row gap; an
action on its own line contributes one full inherited line-height rather than
only the SVG's `1em` height.

Accordion and FileTree/TreeView use the default margin form. A Lit List divider
needs a separate bounded decision. Adding or activating any other entry is an
architecture decision and a spec amendment.

### Selectable box/card composition

RichChoicesField is not a line row and is not a member of the closed in-box
family. Each visible option label is a selectable box/card:

- the card owns its border, background and radius; its `.ds.option` host binds
  the shared framed-box border inputs, and the card consumes the shared
  block/inline padding outputs so border plus padding equals
  `--spacing-inset-surface-block` / `--spacing-inset-surface-inline` from the
  outside edge;
- its flex column is the content stack and owns gaps between children;
- ordinary text leaves keep the existing paragraph/body start nudge and end
  compensation;
- scalar string and number labels become one normal text leaf, while freely
  shaped React content supplies its own explicit text leaves; and
- the existing grid/flex composition may stretch neighbouring cards to equal
  height without promising that arbitrary rich content itself sits on the
  baseline grid.

The inset-minus-border arithmetic has one owner on `:where(.ds)` and is
protected from component overrides. The card consumes no `--ds-row-*` or
`--ds-in-box-row-*` output, copies no formula and has no target or minimum
height. Its retired `--start-nudge` and `--end-nudge` inputs are invalid
in production CSS and are rejected even when referenced through a fallback,
alias or CSS escape.

### Sectioned card composition

React Card establishes the sectioned-card contract below. Svelte WPE Card is
expected to use the same mapping after the React pilot receives lead-engineer
approval, but that later port needs its own framework evidence. This is built
from familiar parts, not a new formula:

- the transparent outer frame owns its stroke, radius, clipping and subgrid;
- Image remains edge-to-edge inside the frame;
- Header, Content and Footer own their intentional section padding and seams;
- Content and Footer use the Field block gap for child spacing;
- Header uses the Surface inline inset as its minimum gap because it accepts
  arbitrary children rather than a marker/label pair; and
- ordinary text leaves keep their own typography alignment.

React implements this contract in the first approval milestone. A later Svelte
port MUST resolve the same semantic properties without treating React evidence
as proof of Svelte markup, style loading or package entry behavior. Header plus
Content remains one joined region, Content
keeps its tighter top than bottom padding, and Footer remains a wrapping row.
Existing `--card-*` overrides stay public at the use site. Root defaults that
would resolve before a nearer product context are removed. A sectioned Card
does not consume a shared row output, gain a target height or inherit the equal
padding rule that applies to RichChoices.

The consumer gate is status-aware. It permits active entries plus at most one
currently authorized implementation slice, and rejects both unlisted consumers
and listed future consumers. Table and Log are active after their respective
implementation, browser evidence and adversarial review were accepted; naming
SideNavigation here does not permit it to consume the pair.

### Governed code-row proxy

`Log.Line` owns `.ds.log-line.code` on its native `<tr>`. The row is the
zero-border ledger proxy: the shared `.ds.code` binding selects authenticated
code line-height/nudge inputs and the existing formulas resolve on that same
host. Raw `th`/`td` inherit both typography and the already-resolved in-box
pair. They set no local row input and use `font-weight: inherit` (or an exact
equivalent) so neither the existing cell rule nor the UA's bold `th` default can
override the governed code weight. A nested `.ds` component such as the line
number link resolves its own body defaults but MUST NOT consume a second row
ledger.

The code font longhands have one typography-owned `code-role.css` entry for
`code`, `kbd`, `samp`, `pre` and `.code`. The composed typography entry and
every tokens-plus-component/direct component entry that can render a governed
code component MUST reach it and the authenticated Mono face. The typography
package exports the `./code-role.css` subpath, and packed-subpath evidence proves
that direct imports resolve. Prose nudge, measure and margin mapping stays in
`elements.css`.

The source gate records exact authored production Svelte/TSX `.code`
attachments; stories and fixtures are outside its component-source scope.
Existing code components are active type-role consumers; Log's type-role and
in-box uses are now both active but remain independently governed. The gate rejects an unregistered authored
attachment, including supported constant/array forms, while explicitly making
no claim about arbitrary consumer-supplied runtime class strings. The type-role
gate and in-box gate remain separate from the raw diagnostic/allowlist basis.

For Log, `:target` and normal row fills remain continuous; each additional code
line adds exactly one code line-height and the tallest cell owns the row.
Existing semantic Surface/Field properties own framing and column lanes. Sticky
line numbers, optional timestamps, logical LTR/RTL placement, wrap/no-wrap
overflow, links and table semantics are preserved. The former
`min-width: fit-content` debt is deleted. Removal negatives prove that moving
the live Surface end inset to the terminal content cells preserves shared
columns, row heights, scrolling and logical far-edge framing without a new
minimum. A non-paint-derived inline minimum remains non-classifiable under this
contract.
