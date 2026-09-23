# Contract: Semantic spacing-token schema

## 1. Source layers

```text
global/primitive/dimension.tokens.json
global/semantic/spacing/base.tokens.json
global/semantic/modifier/spacing/{sites,docs,apps,os}.tokens.json
<approved density-value source selected by T014>
policy/density-contract.json
policy/density-contract.schema.json
```

The primitive document supplies values. The spacing documents supply semantic
roles. The policy supplies implementation governance. These layers must not be
collapsed.

This contract governs component- and pattern-owned semantic relationships.
`spacing.baseline` is an existing invariant and is explicitly exempt from the
`spacing.<relationship>.<role>.<axis>` grammar and Canonical relationship
metadata below. Page/grid-owned margin, gutter, region and strip facts are also
outside this category count. Their existing provider records remain a
compatibility concern until their owning specifications migrate or retain them.

## 2. Semantic token shape

The following is schema shape, not a final token list or value approval:

```json
{
  "$schema": "https://designtokens.org/schemas/2025.10/format.json",
  "spacing": {
    "$type": "dimension",
    "inset": {
      "field": {
        "inline": {
          "$value": "{dimension.100}",
          "$description": "Inline inset between a field edge and entered data.",
          "$extensions": {
            "com.canonical.spacing": {
              "axis": "inline",
              "relationship": "inset",
              "ownership": "component",
              "densityResponse": "governed",
              "public": true,
              "status": "candidate"
            }
          }
        }
      },
      "continuation": {
        "inline": {
          "$value": "{dimension.400}",
          "$description": "Inline keyline for copy following a mark or structural depth step.",
          "$extensions": {
            "com.canonical.spacing": {
              "axis": "inline",
              "relationship": "inset",
              "ownership": "keyline",
              "densityResponse": "fixed",
              "public": true,
              "status": "candidate"
            }
          }
        }
      }
    },
    "gap": {
      "element": {
        "block": {
          "$value": "{dimension.100}",
          "$description": "Block separation between adjacent elements in one logical unit.",
          "$extensions": {
            "com.canonical.spacing": {
              "axis": "block",
              "relationship": "gap",
              "ownership": "composition",
              "densityResponse": "governed",
              "public": true,
              "status": "candidate"
            }
          }
        }
      }
    }
  }
}
```

The examples deliberately use existing candidate names. CP1 may rename, merge
or remove them. It may not remove the required metadata or replace semantic
roles with magnitude names.

## 3. Identifier rules

- Use logical axes: `inline` and `block`.
- Use relationship and purpose names.
- Do not use `xs`, `small`, `large`, numeric steps or primitive IDs as semantic
  names.
- Do not use component names such as `accordion` or `chip`.
- Do not encode product or density in the public semantic ID.
- A role used asymmetrically retains one ID; consumers choose the logical edge.
- A new relationship family requires evidence that `gap` or `inset` cannot
  describe its ownership.
- **`inset` and `gap` never share a role name.** `inset` is padding inside a
  box; `gap` is separation between things. `field` names an inset and must not
  also name a gap step — the smallest gap step is `element`. Two relationships
  that happen to resolve to the same number still take two roles, because a
  change to one should not reach the other.

## 4. Required Canonical metadata

Every semantic spacing leaf contains
`$extensions.com.canonical.spacing` with:

```text
axis
relationship
ownership
densityResponse
public
status
```

Validation rejects missing fields, unknown values, public/private prefix
conflicts and a `governed` role absent from the complete density matrix.

## 5. Product resolution

Product modifiers override values only. Base and overrides must have compatible
types and metadata. Resolution preserves the semantic ID and produces one
public `--spacing-*` property per approved role.

Every product root redefines both members of every governed role and resets its
current-value channel to that product's comfortable/default member. A density
context inherited from an outer product root therefore does not cross a nested
product root accidentally. Re-provision after such a boundary must be local or
declared through the portal policy.

When product selection and an approved provider occur on the same rendered
element, product resolution establishes that product's pair first and the
density-provider layer then selects its dense member. The provider therefore
wins the current-value selection without retaining a value from the outer
product.

Required precedence is:

| Rendered order | Result |
|---|---|
| Product root only | That product's comfortable/default member |
| Product root and provider on the same element | That product's dense member |
| Provider → nested product root | Nested product's comfortable/default member |
| Reset → nested provider | Dense inside the nested provider |
| Provider → nested reset | Comfortable/default inside the reset |
| Portal target inside an unrelated approved host | Target host's context; no source-host continuity |
| Declared portal bridge | The bridge's declared mode for only its listed subscribers and roles |

One implementation identifier may not be declared as both a provider and a
reset. This avoids an arbitrary same-element winner between contradictory
policy entries.

OS remains a supported provider context even when the immediate Pragma proof
covers only Site, Docs and App.

## 6. Governed density resolution

Density is an internal contextual selection mechanism:

1. Product resolution makes comfortable/default and dense members available
   for every governed role.
2. The default current-value channel points to comfortable/default.
3. An approved provider automatically points inherited current-value channels
   to dense for rendered DOM descendants.
4. An approved subscriber binds only its allow-listed roles to those channels.
5. Ordinary component CSS consumes subscriber bindings with the public product
   token as its safe fallback.
6. Product roots and declared resets select comfortable/default. A portal does
   not inherit its source component's DOM context. Without a declared bridge,
   it resolves solely from the target DOM ancestry: a target-side approved host
   may provide density; otherwise it falls back to the target product default.

Conceptual generated output:

```css
@layer ds.tokens {
  .app {
    --spacing-inset-action-inline: 0.75rem;
    --_spacing-inset-action-inline-comfortable: 0.75rem;
    --_spacing-inset-action-inline-dense: 0.5rem;
    --_density-inset-action-inline:
      var(--_spacing-inset-action-inline-comfortable);
  }
}

@layer ds.density {
  :where(<approved-tight-host>) {
    --_density-inset-action-inline:
      var(--_spacing-inset-action-inline-dense);
  }

  :where(<approved-chip-selector>) {
    --_component-inset-action-inline:
      var(
        --_density-inset-action-inline,
        var(--spacing-inset-action-inline)
      );
  }
}
```

The placeholders must become exact framework identifiers in policy before
generation. No public `.dense`, `.comfortable`, density token or consumer
override is emitted.

## 7. Policy shape

Conceptual policy input:

```json
{
  "$schema": "./density-contract.schema.json",
  "version": 1,
  "publicControl": false,
  "providers": [
    {
      "id": "<exact table-cell identifier>",
      "mode": "dense"
    }
  ],
  "subscribers": [
    {
      "id": "<exact Chip identifier>",
      "roles": [
        "spacing.inset.action.inline"
      ]
    }
  ],
  "resets": [],
  "portals": []
}
```

A populated reset or portal is behavior, not documentation:

```json
{
  "resets": [
    {
      "id": "product.app.root",
      "mode": "comfortable",
      "roles": ["spacing.inset.action.inline"],
      "reason": "A product root terminates an outer density context."
    }
  ],
  "portals": [
    {
      "id": "table.menu.portal",
      "sourceProvider": "table.cell",
      "targetRoot": "overlay.root",
      "mode": "dense",
      "subscribers": ["chip.root"],
      "roles": ["spacing.inset.action.inline"],
      "reason": "The overlay is a reviewed continuation of the tight host."
    }
  ]
}
```

Providers, subscribers, roles, resets and portal bridges are closed lists.
Adding an entry requires evidence and review.

Host membership follows rendered DOM ancestry. Framework component ownership
has no implied effect unless an adapter realizes it as DOM inheritance or a
declared portal bridge.

## 7a. Block inset and baseline compensation

Two different things have been conflated under "extra block padding". They need
different homes, and separating them is what keeps the token count small. Both
already have names in the spacing specification; no new vocabulary is required
beyond one term for the interval being resolved to.

### The decomposition

An element's occupied block size is:

```
occupied = border-block-start
         + inset-block-start + phase-block-start + nudge-block-start
         + n × line-height
         + inset-block-end
         + border-block-end
         + compensation-block-end
```

| Term | Kind | Home | Authored? |
|---|---|---|---|
| `nudge-block-start` | metric correction | typography, element-owned | no — read from font metrics |
| `phase-block-start` | rhythm correction | contract layer, element-owned | no — computed |
| `inset-block-*` | **semantic spacing** | **this schema** | **yes** |
| `border-block-*` | box model | component | subtracted per edge, never added |
| `compensation-block-end` | rhythm correction | contract layer, element-owned | no — computed |

The current Pragma row contract implements only nudge minus border:

```css
--ds-row-padding-block-start: max(0px,
  calc(var(--ds-row-nudge-block-start) - var(--ds-row-border-block-start)));
```

That is why a Docs/App Button measures 22.3px against an intended 32px. There
is no inset term and no place to put one. Adding it is the single change that
closes the gap:

```css
--ds-row-padding-block-start: max(0px, calc(
  var(--ds-row-inset-block-start) +
  var(--ds-row-nudge-block-start) -
  var(--ds-row-border-block-start)));
```

Border subtraction stays per edge and reads the actual border on that edge. An
element bordered on one block edge only subtracts on that edge; a borderless
variant subtracts nothing. This is the point of departure from the control seat
on current main, which folds a **nominal constant** border so that bordered and
borderless variants share one geometry — a different occupied size for the
borderless case.

### The block inset is an existing role

It needs no new family and no new grammar. It is the block-axis member of
`spacing.inset.<role>.block`, with zero as a legitimate value:

| Owner | Block inset per edge | Rationale |
|---|---|---|
| Bare text row | `0` | the type's own line box is the whole row |
| Control row (Button, Chip, input chrome) | tier value | the control needs visible room around its label |
| Surface section | the existing compact/broad block inset | unchanged |

### Establishing the control value

Confirmed by the owner: a Site control is **40px occupied**, compensation
included, and Docs and App controls are **32px**.

| Tier | `bU` | Type | Nudge per edge | Inset per edge | Occupied |
|---|---:|---|---:|---:|---:|
| Site | 8px | 16 / 24 | 5.456 | `0` | 40px = 5 `bU` |
| Docs | 4px | 14 / 20 | 0.149 | `1 bU` (4px) | 32px = 8 `bU` |
| App | 4px | 14 / 20 | 0.149 | `1 bU` (4px) | 32px = 8 `bU` |

Those values are at a 16px root. The provider dimensions and baseline are in
`rem`, so the normative target matrix is:

| Root | Site | Docs | App |
|---:|---:|---:|---:|
| 16px | 40px | 32px | 32px |
| 18px | 45px | 36px | 36px |

**These values are established by measurement, not by rule.** Set the inset,
render the control, confirm it resolves to the target occupied size in that
product, then fix the value in the token source. A predictive rule — for
instance that an inset is needed wherever the nudge is under half a baseline
unit — may propose a starting value and is a useful sanity check on the result,
but it is not the authority for it and is never evaluated at runtime. Where a
measured control disagrees with the prediction, the measurement wins and the
rule is not patched to fit.

For T004d1a, “every control in the denominator” is bounded to four external-row
members: Button excluding `.link`, Chip excluding `.is-nested`, composite
`.ds.input.chrome`, and direct native Select chrome. FileUploadInput and all
named in-box row families are deferred to T006. The four product-specific React
Button forks receive static proof that they define no local inset, nudge or row
block padding; rendered confirmation is T005a. The named Svelte Button, Chip,
Select and InputPrimitive forks are an FR-036 boundary for T005b and are neither
edited nor claimed as measured here.

Each member/product/root/project record contains resolved inset start/end,
resolved nudge start and baseline, computed border and padding on both block
edges, computed block-end margin, rendered occupied size, contract occupied
size, product target and OS `null`. The proof asserts equal inset edges, zero on
Site, one baseline on Docs/App, and on both edges:

```text
padding = max(0, inset + nudge - border)
```

It retains the occupied-target and baseline-count assertions. This direct
per-edge identity prevents a compensating ledger error from hiding a wrong
inset behind a correct total.

Button and Chip have no supported zero-border external row; link/nested are
different row categories. Native Select likewise has no zero-width border
variant. Those three borderless cases are waived. Composite chrome must either
prove zero block edges through the documented top/bottom per-side width hooks
set in an existing `.storybook` spacing-contract fixture, never through an
inline internal-property mutation, or record a waiver if the hooks cannot reach
zero. A proved case checks nonzero bordered preconditions, zero computed edges,
target-preserving occupied geometry, exact padding growth per removed edge and
restored bordered geometry.

Completion covers the six existing Chromium/Firefox/WebKit × DPR 1/2 projects,
both root sizes, all three products and all four members. Chromium is authority
at 1/32px; Firefox/WebKit are recorded at 0.5px and excess rounding is carried
to CP1. Button/Chip evidence comes from the existing port-6106 ds-global lane;
composite/native evidence comes from the existing port-6107 form lane. Each
measurement JSON is written through `testInfo.outputPath`, attached by path and
hashed in the external root manifest. An unpersisted green run is diagnostic.

### The rhythm correction has two terms, at opposite edges

The heading case is different in kind from the control case. Two adjacent
columns stay in phase only if each block resolves to the **rhythm step** the
surrounding copy advances on — for editorial text the body line advance, not
`bU`.

Two separate things have to be true, and one term cannot do both.

**Phase, at block-start.** A three-line H1 whose first baseline sits on a `bU`
line that is not also a body-line-advance line has *all three* of its lines off
the grid the adjacent column is using. Lifting the first baseline onto the step
fixes the first line. It fixes every following line only where the heading line
height is a whole multiple of the body line advance. The installed provider
measures as follows:

| Product | Body advance | H1 | H2 | H3 | H4 | H5 | H6 |
|---|---:|---:|---:|---:|---:|---:|---:|
| App | 20px | 32px ✗ | 32px ✗ | 24px ✗ | 24px ✗ | 20px ✓ | 20px ✓ |
| Docs | 20px | 40px ✓ | 40px ✓ | 32px ✗ | 32px ✗ | 24px ✗ | 24px ✗ |
| Site | 24px | 48px ✓ | 48px ✓ | 32px ✗ | 32px ✗ | 24px ✓ | 24px ✓ |

The ten failures shown in the table are type-scale exceptions carried to CP1.
The review heading's “14 of 18” count is an arithmetic typo; its explicit table
and approved qualifying list both yield eight passes and ten failures. T004d2 MUST
NOT change typography tokens to hide them. Its exact private role outputs are:

```text
--_typography-<role>-rhythm-step
--_typography-<role>-phase-block-start
--_typography-<role>-closure-block-end
```

Phase is the additional lift after the already-published metric nudge, so the
nudge contract remains unchanged:

```css
--_typography-<role>-rhythm-step:
  var(--typography-text-primary-line-height-dimension);
--_typography-<role>-phase-block-start: calc(
  round(up,
    var(--_typography-<role>-first-baseline-offset),
    var(--_typography-<role>-rhythm-step)) -
  var(--_typography-<role>-first-baseline-offset) -
  var(--typography-<role>-nudge-block-start));
```

Therefore `nudge-block-start + phase-block-start` equals §7a's total phase
lift. The rhythm step MUST be asserted as a whole multiple of
`--spacing-baseline`; it is 24px = 3 × 8px for Site and 20px = 5 × 4px for Docs
and App. Body and code phase resolve to zero in every product.

`elements.css` applies the result through two private selected-role aliases in
every selector block that already maps the nudge pair: h1–h6, the prose/list
group and the code group. No fallback is allowed because custom properties
inherit and a missing mapping could reuse an ancestor heading's correction:

```css
--_typography-text-phase-start:
  var(--_typography-<role>-phase-block-start);
--_typography-text-closure-end:
  var(--_typography-<role>-closure-block-end);

padding-block-start: calc(
  var(--_typography-text-nudge-start) +
  var(--_typography-text-phase-start)
);
padding-block-end: 0;
margin-block-end: var(--_typography-text-closure-end);
```

The existing start/end nudge aliases remain mapped to the same published nudge
properties. `text-alignment.test.ts` may change only its applied-ledger and new
phase/closure alias expectations. `spacing-model.test.ts`,
`scripts/check-css-contract.test.ts` and the Svelte launchpad packed-export
proof stay green unmodified.

For the pre-CP1 spike, `--first-baseline-offset` is a conceptual placeholder
for the named per-role extraction of the already-live
`(line-height + 1cap) / 2` expression. Extracting it MUST preserve the existing
nudge's computed geometry. It is the one later substitution point for approved
real metrics; the spike does not change metric authority.

**Closure, at block-end.** Once the element's own lines are in phase, the block
must still occupy a whole number of steps so nothing after it is displaced.
That is baseline compensation, and its sum now includes the phase term:

```css
--intrinsic-occupied: /* border + padding + phase + n × line-height, per the element */;
--compensation-block-end: calc(
  round(up, var(--intrinsic-occupied), var(--rhythm-step)) -
  var(--intrinsic-occupied));
margin-block-end: var(--compensation-block-end);
```

The per-role private name is
`--_typography-<role>-closure-block-end`. Closing one line plus the non-line
contribution generalises to every line count only when
`mod(line-height, rhythm-step) = 0`; the focused test records the ten failures
from the table rather than emitting a false multi-line claim for them.

The phase term must not be moved to block-end. A block-end term re-phases only
what follows the element, leaving the element's own lines where they were — the
visible symptom being a heading whose lines never align with body copy beside
it. It would also perturb a designed relationship: the space between a heading
and the body under it is a chosen value, whereas the space above a heading is a
coarser section break that absorbs a remainder without reading as an error.

The snapshot contains no existing `round()` use. Capability in the supported
engines is evidenced by the live `mod()` expressions in `alignment.css`, from
the same CSS Values 4 stepped-value family; the spike still needs focused
rendered proof for `round(up, …)`.

Rules:

1. `--rhythm-step` is **named per context, not global**. A control resolves to
   `bU`; an editorial text block resolves to the body line advance. Those are
   different steps and one value cannot serve both.
2. Both terms round **up only**. Rounding down would consume authored inset.
3. Neither is spacing, so neither appears in the semantic token count — the same
   exclusion `spacing.baseline` has under FR-021 and FR-022. They carry no
   `com.canonical.spacing` metadata and emit no public `--spacing-*` property.
4. Both are element-owned, under the ownership rule in the spacing specification
   §2.8.2: the text element owns its corrections, the container owns semantic
   spacing.
5. A control needs only the closer. Its rhythm step is `bU`, its nudge already
   seats it there, and it has no following lines of its own to keep in phase.

### Pre-CP1 evidence carrier

Until CP2 authorises provider source, the isolated Pragma spike may carry the
candidate control inset and three gap values only through the private
`--_spike-*` channels in FR-050. This is not public output and is not a second
provider. Every channel is confined to `_spike-geometry.css`, annotated with
its proposed provider role, consumed only through the `--ds-*` contract and
deleted when Phase 3 begins. OS entries remain `null` during the spike.

The binding is exact: candidate `spacing.inset.control.block` supplies both
`--ds-row-inset-block-start` and `--ds-row-inset-block-end`; the gap candidates
`spacing.gap.element.block`, `spacing.gap.group.block` and
`spacing.gap.pattern.block` supply `--ds-gap-element-block`,
`--ds-gap-group-block` and `--ds-gap-pattern-block`. The control role is a new
member of the already-approved inset family, not a new relationship family;
its annotation says that the provider does not ship it yet. Element explicitly
stands in for the proposed post-CP2 rename of shipped
`spacing.gap.field.block`. `component-contract.css` imports the private carrier
after typography alignment and before its own layer body; no public subpath
names the carrier. The package publishes all of `src`, however, and the public
`./component-contract.css` export imports it transitively. The carrier is
therefore publishable by construction even though this spike forbids publish;
T004h MUST prove it exists on no branch except the isolated spike.

### Why this does not reintroduce element-owned `spaceAfter`

The settled position is that vertical composition belongs to the container and
no element-owned semantic `spaceAfter` token exists. Nothing here changes that:

- The block inset is inside the element's own box. It is not space between
  siblings and cannot double with a container gap.
- The phase and closure terms are corrections, in the category the
  specification already grants to text elements alongside the cap nudge.
- Space **between** an H1 and the paragraph after it remains container-owned,
  from the existing block-gap scale — and stays exactly the value that was
  chosen for it, because no remainder is dumped into it.

So a heading gets no spacing token of its own. It gets the same corrections
every text role already gets, with one added at block-start to keep its own
lines in phase.

### What this replaces

This is the inside-out composition required by FR-039, and it supersedes the
outside-in control seat on current Pragma main, where the density cell is fixed
first and `line-height` is then derived as `cell − 2 bU`. Under this contract
the type is never a dependent variable: the line box is the input, the inset is
added to it, and only the leftover is resolved.

### Vocabulary decision

Three terms were proposed in draft and two were redundant:

| Proposed | Decision | Reason |
|---|---|---|
| `presence` | **rejected** — use `inset` | It is the existing relationship in this contract's own grammar. A second name for it would need a glossary entry and would obscure that a heading and a button take the same role with different values. |
| `quantisation fill` | **rejected** — use `baseline compensation` | The block-end closer already has this name in the specification, and its stated purpose — "total block contribution stays aligned" — was already correct. Only its stated mechanism, "cancels a text nudge", was too narrow. |
| `phase inset` | **kept** | The block-start term has no existing name and is not the same job as the block-end closer: it phases the element's own lines, where the closer only protects what follows. Merging the two names would hide the heading defect rather than fix it. |
| `rhythm step` | **kept** | The interval being resolved to has no existing name, and it cannot be `bU` in every context. Naming it is what makes the heading case expressible at all. |

## 8. Validation contract

This list is the obligation at CP2 and implementation review. While the
architecture is still exploratory (FR-046), a geometry property is discharged by
the comparison sheet; only the cheap mechanical checks — the pinned-alias
assertion, private-channel absence, generated-file reproduction — run
continuously. Do not build per-variant matrices over values that are still being
decided.

Validation must prove:

- DTCG schema validity and primitive reference resolution;
- stable ID-to-CSS conversion with collision detection;
- base/product structural compatibility;
- complete product × governed-role × density-member resolution;
- every policy role exists and is marked `governed`;
- every generated provider/subscriber is declared exactly once;
- provider and reset identifier sets are disjoint;
- private channels are absent from public artifacts;
- no public density selector is emitted;
- every control resolves to a whole number of its declared rhythm step in every
  product; every qualifying text combination does so at one, two and three
  lines, while each non-qualifying combination exactly matches the reviewed
  FR-039b3 exception table;
- no public property is emitted for baseline compensation, and no role derives a
  line box, font size or line height from a target box height;
- standalone, provider-hosted, reset and portal fixtures behave as declared;
- product → host → subscriber, host → nested-product → subscriber,
  same-element product/provider, reset → provider and portal-target-under-host
  cascade cases behave as declared;
- RTL changes placement without changing semantic identity; and
- generated files reproduce from source without hand edits.

## 9. Approval boundary

This contract becomes implementation-authoritative only after CP1 approves the
taxonomy and CP2 approves the source representation for simultaneous density
members. Until then, all named roles and values are candidates.

CP2 also produces a compatibility disposition mapping every existing spacing
token ID and public density API surface to `retained`, `aliased`, `deprecated`
or `removed`. Density surfaces include selectors, custom properties, package
exports and documented controls. The map names affected React and non-React
consumers, including Svelte/Lit/WPE compatibility where present, plus release
implications and removal prerequisites. Compatibility does not make an old ID
part of the approved taxonomy by default.
