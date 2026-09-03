# Cross-repository spacing and baseline token architecture

Status: owner-resolved architecture. The final sign-off's required corrections
are incorporated below and the owner has authorised implementation. Merge,
publication, release, and downstream adoption remain separately gated.

Date: 2026-09-03

This is the current proposed contract for Baseline Foundry, Pragma, the
Canonical design-token repository, and the baseline nudge generator. It
supersedes recommendations in the following review records wherever they
conflict with an owner decision recorded here:

- [`cross-repo-token-architecture-audit.md`](cross-repo-token-architecture-audit.md)
- [`cross-repo-token-architecture-review.md`](cross-repo-token-architecture-review.md)
- [`cross-repo-token-architecture-final-review.md`](cross-repo-token-architecture-final-review.md)
- [`cross-repo-token-architecture-resolution-review.md`](cross-repo-token-architecture-resolution-review.md)
- [`cross-repo-token-architecture-signoff-review.md`](cross-repo-token-architecture-signoff-review.md)

The review files remain evidence. They are not the governing specification.

## 1. Governing direction

Baseline Foundry is the normative geometry reference. Pragma's current
baseline, density-cell, line-height rounding, fixed-size, and local-spacing
implementations are transitional. Their current output is not a compatibility
constraint on the shared architecture.

Pragma must adopt BF's model and reproduce BF's resolved component geometry:

- product-specific baseline steps;
- container-owned semantic spacing;
- independent inline spacing;
- font-alignment correction kept outside semantic spacing;
- intrinsic, inside-out control geometry with no authored target block size;
  and
- governed density inheritance for a small reviewed set of tight contexts.

"Match BF's control size" is an executable output invariant at the occupied-
block boundary. It does not permit an authored control-height or density-cell
token. The size must remain the result of line height, alignment, padding,
border, and trailing compensation. Because Pragma retains a different font-
alignment engine, its painted border box and first baseline are additionally
subject to the tight empirical contract in §5; they are not presumed equal.

## 2. Product baseline contract

`spacing.baseline` is a required v1 token and the central feature of the first
spacing contribution. It is not postponed to accommodate Pragma's temporary
implementation.

| Product | BF name | `spacing.baseline` |
| --- | --- | ---: |
| `site` | Editorial | `0.5rem` |
| `docs` | Documentation | `0.25rem` |
| `app` | App | `0.25rem` |
| `os` | OS | `0.25rem` |

Pragma's global `0.25rem` baseline must become product-scoped. Site and Docs
must no longer share one baseline rule. Canonical's present global 8px value is
correct only for Site; Pragma's present global 4px value is correct only for
Docs, App, and OS.

Changing the Site unit from 4px to 8px does not imply doubling existing
geometry. When a retained 20px relationship is represented relative to the
baseline, its count changes from `5 × 4px` to `2.5 × 8px`. Where the value is
typography, fixed geometry, or independent inline spacing, it should not be
represented as a baseline multiplication merely to preserve an old formula.

## 3. Line-height quantisation

Line height is a governed typography decision constrained by the active
product baseline. It is not an unrestricted value and must not be silently
rounded from an arbitrary designer choice.

For resolved line height `H` and product baseline `B`:

```text
default:          H / B is a positive integer
allowed exception: H / B is a positive half-integer explicitly present in the
                   reviewed exception manifest
invalid:          every other result
```

Consequently:

- whole baseline increments are the default;
- half-baseline increments are deliberate, rare exceptions;
- a half-increment must name its product, typography role, reason, and visual
  evidence in a machine-readable allow-list;
- quarter increments and arbitrary ratios fail validation;
- a 5% local line-height adjustment that leaves the allowed lattice fails
  validation;
- runtime `round()` is not a repair mechanism, because it would hide an invalid
  authored value and produce unreviewed geometry; and
- validation evaluates the exact Canonical line-height dimension against the
  product baseline, rather than trusting a rounded ratio or descriptive pixel
  comments.

DTCG 2025.10 requires the `lineHeight` member of a typography composite to be
a number multiplier; it cannot represent exact values such as 20/14 or 96/84
in finite decimal notation. Canonical therefore keeps the standard number as
an interoperability projection and adds the normative exact length at
`$extensions.com.canonical.typography.$value.lineHeightDimension`. Root roles
reference an exact rem dimension there, derived variants reference the root
extension, and Canonical's CSS builder emits that length. The lattice validator
uses the exact dimension and compares integer or half-integer baseline counts
without epsilon. The approximate DTCG number must remain consistent within a
separate compatibility check, but it does not govern Canonical geometry.

### Permitted Site scale and accepted secondary-text exception

At an 8px Site baseline, six of the seventeen current Canonical primitive
font-size/line-height pairings are half-integer counts: keys 200, 300, 450,
550, 650, and 950. This does not make all six valid Site semantic roles. Site
semantic typography must bind to the whole-count subset unless an exact root
role is present in the reviewed exception manifest.

`typography.text.secondary` is the currently accepted half-step root role:

```text
font size   = 0.875rem = 14px at a 16px root
line height = 1.25rem  = 20px at a 16px root
baseline    = 0.5rem   = 8px at a 16px root
count       = 2.5 baseline units
```

The Canonical source already pairs `dimension.size.fontSize.300` with
`number.lineHeight.300` for secondary text. Its resolved line height must
remain 20px; Pragma must not snap it upward to 24px. Its bold and code variants
inherit the exception by reference, as do `prose.$root` and `prose.bold`. The
manifest is keyed on this root role and its resolver must enumerate and test
all five members of the family.

Site's display heading keeps its 84px font size but changes from a 92px line
height to 96px. It therefore resolves to exactly 12 Site baselines and does
not enter the exception manifest. The correction adds `dimension.1200 = 6rem`
and binds the root role's `lineHeightDimension` extension to it; `bold`
inherits through its existing references. `number.lineHeight.950` is not
mutated into a misleading 96px scale member and becomes unreferenced. Other
half-count primitive pairings remain
available to products with a 4px baseline, but cannot be bound into Site
semantic output without a separately reviewed manifest entry.

The exception has an honest phase consequence even when it is single-line.
Under the BF text ledger, a single 20px line plus one baseline of nudge and
compensation occupies 28px, or 3.5 Site baselines, and exits on the 4px
half-phase. Successive lines advance by 2.5 baselines, so multiline secondary
text alternates between the primary 8px phase and its 4px half-phase. Every
second line returns to the primary phase. Tests and documentation must state
this directly; they must not claim that every line of this role lands on the
primary 8px grid.

Use of the exception is isolated:

- it does not change `spacing.baseline` from 8px to 4px;
- it does not create a general public half-density mode;
- it does not permit other typography roles to choose fractional leading;
- a single-line component using it must still satisfy its BF-derived occupied-
  block and host-fit contract; and
- the half-phase exit is accepted for this text instance. A generic wrapper
  must not claim to repair an arbitrary intrinsic multiline height with
  `mod()`: CSS cannot derive that ledger from an unconstrained `auto` height.
  A separately governed host may establish its own independently calculable
  geometry, but that is not part of this typography exception.

The nudge generator currently accepts quarter-unit counts. Its future shared
input validator must narrow that permissive rule: whole counts by default and
manifest-authorised half counts only. Validation is expressed in active
product-baseline counts, not the generator's independent authoring unit.

## 4. Spacing source schema

Raw reusable lengths remain under the primitive `dimension` namespace.
Authored relationships live under semantic `spacing`; every spacing token
still uses DTCG `$type: "dimension"`.

Use `product` as the common resolver axis for `site`, `docs`, `app`, and `os`.
Typography and spacing must not maintain separate product selectors long term.
`density` is a build/test axis for governed contextual values, not a public
page-level mode. No breakpoint axis participates in the v1 component-spacing
contribution.

Do not publish:

- a numeric `spacing.scale.*` that duplicates primitives;
- a public `spacing.profile.*` reference layer in v1;
- an inline-unit token as component API;
- a control-height, density-cell, or target-baseline spacing token; or
- page margin, grid gutter, or content-padding tokens in the first component-
  spacing contribution.

### V1 public vocabulary

| Token ID | CSS custom property | Density-responsive |
| --- | --- | --- |
| `spacing.baseline` | `--spacing-baseline` | no |
| `spacing.gap.field.block` | `--spacing-gap-field-block` | yes |
| `spacing.gap.mark.inline` | `--spacing-gap-mark-inline` | yes |
| `spacing.gap.group.block` | `--spacing-gap-group-block` | yes |
| `spacing.gap.pattern.block` | `--spacing-gap-pattern-block` | no |
| `spacing.gap.region.block` | `--spacing-gap-region-block` | no |
| `spacing.inset.field.inline` | `--spacing-inset-field-inline` | yes |
| `spacing.inset.action.inline` | `--spacing-inset-action-inline` | yes |
| `spacing.inset.continuation.inline` | `--spacing-inset-continuation-inline` | no |
| `spacing.inset.surface.inline` | `--spacing-inset-surface-inline` | yes |
| `spacing.inset.surface.block` | `--spacing-inset-surface-block` | yes |
| `spacing.inset.strip.block` | `--spacing-inset-strip-block` | no |

Names describe ownership and relationship, not magnitude. Border width, radius,
font size, line height, icon size, measure, content width, drawer width, and
fixed brand geometry remain outside `spacing.*`.

### Approved BF inline target matrix

The first value contribution uses the owner-approved BF component matrix:

| Role | Site | Docs | App | OS |
| --- | ---: | ---: | ---: | ---: |
| Field inset | `0.5rem` | `0.5rem` | `0.25rem` | `0.25rem` |
| Action inset | `1rem` | `0.75rem` | `0.75rem` | `0.5rem` |
| Continuation inset | `2rem` | `1.5rem` | `1.5rem` | `1.25rem` |
| Mark-to-copy gap | `0.5rem` | `0.5rem` | `0.25rem` | `0.25rem` |
| Surface inline inset | `1rem` | `1rem` | `0.75rem` | `0.5rem` |

The independent inline authoring quantum is `0.25rem`. It is validation or
provenance metadata, not the vertical baseline and not a required public token.
No horizontal spacing value may be derived from `spacing.baseline` or a font
metric.

Other v1 roles take their resolved values directly from the accepted BF source
and fixtures. A migration may change values only where an owner-approved BF
package specifies the target; it must not invent a compromise with Pragma's
current CSS. Current BF output already matches every field and surface cell,
and the Site, Docs, and OS mark-gap cells. The three non-Site action cells, the
three non-Site continuation cells, and the App mark-gap cell are seven
owner-approved 020a changes that are not yet implemented.

## 5. Alignment and intrinsic control geometry

Semantic spacing and font alignment are separate interfaces.

Shared inputs are the resolved product, baseline, font size, and governed line
height. Each alignment engine supplies, per product and typography role:

```text
nudge.blockStart
provenance { font, font instance, generator version, baseline, method }
```

BF derives its nudge from extracted font metrics. Pragma may retain its `1cap`
approximation. Nudge outputs remain under `typography.alignment.*`, never
`spacing.*`. The legacy semantic `spaceAfter` output is retired.

The Ubuntu Sans variable font used by BF has invariant vertical metrics: 1000
units per em, ascender 940, descender -260, and cap height 693. This is
structural rather than merely sampled because the font has no `MVAR` table.
Its OS/2 `USE_TYPO_METRICS` bit is set, so browsers use the same typo metrics
as the generator. The raw ascender-to-cap gap is not the relevant comparison.
BF's metric anchor is `(940 - 260) / 2 = 340` units from the line centre; the
cap anchor is `693 / 2 = 346.5` units. The formula delta is only 6.5 font units,
or `0.0065em` (0.65% of font size).

For the shared body-sized control roles this predicts the following before
browser rasterisation:

| Font size | Anchor/nudge delta | Symmetric painted-block delta |
| ---: | ---: | ---: |
| 12px | 0.078px | 0.156px |
| 14px | 0.091px | 0.182px |
| 16px | 0.104px | 0.208px |

At BF's optional 18px root, the largest corresponding predicted painted delta
is 0.234px. The doubled painted value is an upper bound, not an identity: the
`max(nudge - border, 0)` clamp can reduce it. These figures hold only because
every shared control role is authored at 1rem or below, where BF's generator
drift compensation is exactly zero. Any shared control role above 1rem is
outside this envelope by construction and must be rejected statically; the
drift contribution is approximately 0.33px at 1.5rem and 0.62px at 2.625rem.

For ordinary whole-baseline typography, local compensation complements the
start nudge under BF's occupied-block contract. The accepted half-step Site
role must be evaluated against its actual 20px line height; no engine may first
snap it to 24px. If a half-step role is used in free multiline flow, its
alternating phase is the declared exception rather than something alignment
padding pretends to remove.

Pragma must replace its selected density-cell and target-baseline model with
the BF ledger defined in
[`component-spacing-architecture.md`](component-spacing-architecture.md):

```text
line            = governed role line height
padding         = max(start nudge - border, 0)
painted block   = line + 2 × padding + 2 × border
compensation    = distance from painted block to the next baseline multiple
occupied block  = painted block + compensation
```

Controls use intrinsic `block-size: auto`. No shared or local density token may
select a target block size and no fixed `block-size` may be introduced to make
a migration screenshot match.

The contract distinguishes exact shared geometry from engine-dependent font
alignment. BF-to-Pragma comparisons must prove exact occupied block, inline
inset, border accounting, trailing-compensation algorithm, and nested-host fit.
They must measure first-baseline position and painted border-box divergence
rather than assert impossible mathematical equality between the metric and
cap engines. The provisional control envelope is 0.25 CSS px for both the
first-baseline and painted-block deltas, with no modulo-boundary crossing. It
is a control-ledger bound only: BF and Pragma currently place end compensation
in different boxes for free text, so text-role painted boxes require separate
migration and evidence.

The 0.25px envelope is measured from layout values using
`getBoundingClientRect()` and a first-baseline probe after the Ubuntu Sans
webfont is loaded, never from screenshot or device-pixel comparisons. It must
be confirmed in Chromium, Firefox, and WebKit at 16px and 18px roots, 100%,
125%, and 150% zoom, and 1× and 2× DPR before becoming durable. BF's ceiling
formula yields zero nudge when an offset is an exact baseline multiple;
Pragma's current `B - mod(offset, B)` yields a full baseline. Both adopt BF's
zero tie-break, and the fixture matrix includes an exact-multiple case.

A bound of one baseline is rejected as far too permissive. A cap-versus-metric
modulo crossing is resolved only by reconciling that role's governed line
height or recording an explicit Pragma role deviation. It is not repaired by
weakening the envelope, the spacing schema, or the no-target-size rule.

## 6. Governed density context

Comfortable/dense is a contextual substitution mechanism, not a designer
utility and not a second product scale.

The initial provider categories are:

- side-navigation item;
- table cell; and
- tab item.

The initial subscriber categories include:

- badge; and
- eligible single-line input.

The implementation manifest must use exact framework component identifiers.
Adding either a provider or a subscriber requires review. An enrolled child in
an approved tight host consumes the dense member automatically; unrelated
descendants remain unchanged. Nested comfortable resets and portalled
components require explicit contracts.

The shared layer owns semantic comfortable/dense gap and inset pairs, provider
and subscriber policy, and reset behavior. It does not own a control cell,
line-height override, target baseline, or component height.

A provider may have its own component geometry. A fixed host size is not, by
itself, proof that the host cannot provide density to descendants. It must be
migrated only if it also subscribes, changes accidentally with product
baseline, or fails content/descendant fit. Pragma's current side-navigation
rules still require audit because they derive fixed sizes from the global
baseline and carry stale pixel comments; that is local migration debt, not a
schema precondition for provider semantics.

BF need not enrol its components in density v1. The shared mechanism must leave
that door open without creating a product × density matrix of unproven BF
values.

## 7. Grid and responsive ownership

The grid specification exclusively owns page margins, grid gutters, content
padding, column subdivision, and responsive grid behavior. The component-
spacing specification may read those outputs but may not restate or set them.

BF work must split accordingly when performed on the correct branches:

- 020a owns component insets and gaps, panel/surface padding, the independent
  inline quantum, provenance, and axis separation; it absorbs Spec 019.
- 020b owns page margin, grid gutter, and content padding after BF removes the
  duplicate runtime owner in `src/css-grid.ts` and the grid documents establish
  one policy.

There is no `spacing.profile.*` layer in v1. A later responsive grid
contribution may use the smallest explicit cross-axis source representation
required by DTCG resolution, bounded to proven product exceptions.

## 8. Optional BF root scaling

BF may optionally apply a `1.125rem` root at a large viewport. Pragma is not
required to adopt that application policy.

The token IDs and rem values do not branch. Rem-authored baseline, typography,
spacing, and nudges scale together, so no second nudge set is generated.

This is not literally browser zoom. Author root sizing does not make rem media-
query thresholds follow the changed root; fixed CSS pixels and viewport units
also behave differently. At an 18px root, a `0.25rem` baseline resolves to
4.5px at 1× DPR. These are BF application-policy test obligations, not reasons
to create spacing-token variants.

The current xLarge `rootFontSize` source is an unused future-policy input. The
plumbing work must either move it to an honest typography/application-policy
location or remove the unreachable breakpoint promise. It must not be treated
as an active spacing modifier.

## 9. Required design-token plumbing

Plumbing lands before the token contribution:

1. deterministically transform all token segments to lowercase kebab-case;
2. fail on output-name collisions and provide a bounded compatibility map for
   existing camelCase properties;
3. classify primitive versus semantic tokens by source role rather than a
   `dimension.*` prefix;
4. support dimension-valued modifier output without the colour-only builder;
5. emit referenced number tokens or consistently inline resolved values;
6. classify public versus internal artifacts and exclude private properties
   from consumer tooling;
7. establish `product` as the shared typography/spacing modifier, with a
   bounded alias for the former typography-only name;
8. prove every resolver document is reachable by a builder;
9. add `os` to the product modifier; the current typography transform only
   iterates `app`, `docs`, and `site`; and
10. add the exact `lineHeightDimension` Canonical typography extension,
    dimension primitives for every governed line height, extension inheritance,
    exact CSS emission, and an exact lattice comparator with no epsilon. The
    DTCG number remains an interoperability projection because DTCG 2025.10
    requires a numeric typography `lineHeight`.

New token IDs use lowercase single-word segments even before the transformer is
fixed.

## 10. Contribution and migration sequence

### PR 1 — plumbing and exact typography inputs

Land §9 without new spacing IDs. Preserve current generated behavior except for
explicitly mapped naming corrections, elimination of decimal line-height drift,
and the owner-approved Site display change. Add `dimension.1200 = 6rem`, bind
Site display to the exact 96px extension, and make every governed typography
root expose an exact line-height dimension before the lattice gate exists.

### PR 2 — baseline and component-spacing tokens

Land all twelve v1 tokens, including the four-value `spacing.baseline` matrix,
the product spacing builder, and point-wise resolver/output tests. Land the
density policy and builder in this PR only if the exact provider/subscriber
manifest is ready; otherwise it is a bounded immediately following PR and does
not delay `spacing.baseline`.

The resolved line-height lattice validator lands as a blocking PR 2 gate. The
Site permitted subset, the 84px/96px display correction, and the inherited
14px/20px secondary-text exception are resolved, so no report-only phase is
needed.

PR 2 publishes the final owner-approved matrix in §4. It also removes the
breakpoint-owned `dimension.size.height.baseline`; no baseline value may remain
on the breakpoint axis and no second baseline token may survive as a competing
source of truth.

PR 2 contains no page/grid roles, breakpoint output, root-scaling variants,
profile layer, control height, density cell, or target baseline.

### PR 3 — BF format adapter

Make BF consume the resolved DTCG names and artifact shape while preserving its
current computed geometry. Because PR 2 already publishes the final §4 target
matrix, a temporary BF-local compatibility overlay pins the seven differing
inline values until 020a. Keep temporary `--bf-*` aliases for a bounded
deprecation window. This is a format-only step; do not mix it with new BF
values, and assert the complete current-value matrix before and after it.

### PR 4 — BF 020a values and Pragma adoption

Apply the already approved BF component-spacing values, then migrate Pragma to
the same results. Pragma migration is intentionally value-changing where its
temporary output differs. It must:

- consume the product baseline matrix;
- preserve the Site 14px/20px exception without runtime snapping;
- delete the selected-cell/target-baseline control model;
- reproduce BF's intrinsic component ledgers and dimensions;
- replace baseline-derived inline padding with semantic inline insets;
- make its debug grid read the live product baseline;
- remove semantic element-owned `spaceAfter`, including
  `--spaceAfter-button`;
- replace unrestricted density classes with the governed context contract;
- remove `--density-target-baseline-px` from bare product selectors as well as
  from the density cell;
- consolidate the four 4px `--baseline-height` fallback owners to one product-
  aware owner and fail loudly when the product context is missing;
- remove `--computed-line-height` multiplication from all alignment engines as
  well as the mapper's runtime `round()` path; and
- remove the legacy comfortable/dense line-height and inline-padding aliases;
- add `.os` to Pragma's product/density context family; and
- move free-text end compensation from padding to BF's trailing-margin ledger,
  so text roles do not present a structurally larger painted box.

Existing Pragma screenshots and multipliers are evidence of migration scope,
not acceptance targets.

### Later work

020b follows only after grid ownership is executable. The nudge generator may
later accept resolved DTCG typography and baseline inputs and emit an alignment
overlay; its metric method remains distinct from Pragma's `1cap` method. Before
that integration, assert `USE_TYPO_METRICS`; if a future font clears the bit,
use the browser-selected metrics. A future font with `MVAR` must be extracted
per relevant instance rather than treated as axis-invariant.

## 11. Acceptance gates

The contribution is not acceptable unless tests prove:

1. `spacing.baseline` resolves to 0.5/0.25/0.25/0.25rem for
   Site/Docs/App/OS.
2. Every resolved typography line height is a whole baseline count unless its
   exact product/role pair appears in the half-step exception manifest. The
   comparison uses the exact `lineHeightDimension` extension with no epsilon,
   not the approximate DTCG number projection.
3. The Site 14px/20px role resolves to 2.5 baselines and is not rounded to
   24px.
4. The Site display role resolves to 84px/96px and 12 baselines.
5. An arbitrary 5% line-height change fails validation rather than snapping.
6. Single- and multiline Site secondary-text fixtures demonstrate and
   document the accepted half-phase exit and alternation without a generic
   wrapper repair.
7. No horizontal spacing output depends on baseline or font metrics.
8. No control or density output declares a target block size or target cell.
9. BF format adoption changes no computed geometry.
10. Pragma's migrated shared controls match BF's occupied block, inline inset,
    border accounting, compensation, and nested-host fit exactly, while
    measured cap-versus-metric baseline and painted-block deltas satisfy the
    empirically confirmed subpixel envelope without a modulo-boundary crossing.
11. Every shared control typography role is at most 1rem, both engines use the
    BF zero-nudge tie-break for an exact baseline multiple, and parity fixtures
    run only after the Ubuntu Sans webfont is loaded.
12. Free-text end compensation occupies the BF trailing-margin ledger rather
    than enlarging Pragma's painted text box.
13. Density inheritance covers approved providers/subscribers, nested reset,
    non-subscriber immunity, and portal re-provision.
14. Every canonical CSS property is lowercase kebab-case, collision-free,
    fully resolved, and correctly classified public or internal. A bounded
    legacy camelCase compatibility alias may retain its old spelling only when
    it directly references the corresponding canonical property; it is not a
    second canonical name.
15. `dimension.size.height.baseline` no longer exists on the breakpoint axis;
    `spacing.baseline` is the only baseline token.
16. Optional BF root scaling preserves rem invariants and is separately checked
    at 1× DPR and across relevant viewport thresholds.

## 12. Remaining implementation evidence

The architecture review is complete. Implementation must still determine the
exact framework identifiers for the initial density manifest and promote the
provisional cap-versus-metric tolerance only after the specified cross-browser
layout fixtures pass.

The following are settled and are not open questions: `spacing.baseline` ships
in v1; Site uses 0.5rem; Docs/App/OS use 0.25rem; whole line-height counts are
the default; reviewed half counts are permitted; Site 14px/20px is the accepted
first exception; Site display is 84px/96px; its half-phase exit is accepted
without a generic wrapper repair; Pragma's present density geometry is not
preserved; shared controls have no target block size; and BF is the normative
geometry reference.
