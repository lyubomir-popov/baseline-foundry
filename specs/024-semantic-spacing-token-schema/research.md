# Research: Semantic spacing-token schema

## R1 — Primitive and semantic layers are different contracts

**Decision**: Primitive `dimension.*` tokens remain a value scale. Semantic
spacing tokens reference them and name reusable layout relationships. A
primitive alias is never evidence for a semantic merge.

**Reason**: The same dimension may serve unrelated relationships, while one
semantic relationship may take different dimensions across products.

## R2 — The existing provider is migration input, not the proposed schema

The currently inspected `@canonical/design-tokens` source publishes baseline;
field, mark, group, pattern and region gaps; and field, action, continuation,
surface and strip insets. Pragma versions moved during this investigation, so
the migration input is identified by source revision and artifact hash rather
than an old package number. Those names and values are useful candidates, but
they predate the complete Pragma component/state denominator and the
minimum-category review.

The new schema therefore starts from measured relationships and tests the
existing vocabulary rather than copying it.

`spacing.baseline` is a product/grid quantum rather than a component spacing
relationship. Page margin, grid gutter, region separation and full-bleed strip
padding likewise have owners outside the Pragma component denominator. They may
remain in the provider for compatibility, but they are not counted as semantic
component categories by this spec and cannot be approved from component
evidence.

## R3 — Semantic identifiers describe relationships

**Proposed form**:

```text
spacing.<relationship>.<role>.<logical-axis>
```

Examples include `spacing.inset.field.inline`,
`spacing.gap.mark.inline` and `spacing.inset.surface.block`. A composed keyline
may retain an inset relationship when it is produced from the same role; it
does not require a new token merely because the consumer uses it as a keyline.

Component names, magnitudes, physical directions and state names are excluded.

## R4 — Axes and logical edges compose independently

The schema does not assign one geometry family to a whole component. It assigns
relationships. A part may use Field on one inline edge, a trailing-artwork
canvas on the other, Control-row vertically and an intrinsic gap between
children. Accordion panel content proves why start and end cannot be collapsed
into one symmetric component label.

## R5 — Product chooses defaults; governed hosts may choose dense locally

The owner and Pragma lead decision is:

- product and density remain independently representable;
- product selects typography plus default spacing/density values;
- approved tight hosts establish dense context automatically;
- approved descendants subscribe to specific responsive roles;
- there is no global user-facing density control; and
- arbitrary descendants do not become dense.

This supersedes the older conclusion that caller-authored `is-nested` is the
final model. Existing nested implementations remain evidence for the geometry
required, not the desired public API.

## R6 — Density policy is not a DTCG token document

DTCG expresses values and references; it does not express which implementation
components may provide or consume inherited context. Provider/subscriber
governance therefore belongs in `policy/density-contract.json`, validated by a
separate schema.

The token source still needs to carry both members for every responsive role.
Before implementation, the design-tokens spike must compare three source
representations:

1. a product × density resolver cross-product;
2. product-owned internal comfortable/dense semantic records; and
3. density values in a Canonical DTCG extension consumed by a dedicated
   builder.

Select the smallest representation that:

- preserves ordinary DTCG resolution for the public default;
- makes both runtime members available simultaneously;
- avoids public cross-product token IDs;
- does not emit `.dense` or `.comfortable` utilities; and
- fails on incomplete product × role matrices.

This representation choice is deliberately not faked by the current draft.

## R7 — Public and private output must be mechanically separable

Public `--spacing-*` properties represent approved semantic roles. Density
pairs, inherited current values and subscriber bindings use `--_`-prefixed
private properties and are excluded from public token metadata and language
server output. The generator, not downstream component CSS, owns that split.

## R8 — Current candidate taxonomy is evidence, not approval

Current Pragma candidates are:

- inline: Field, Command/Action, Marker, Continuation and Surface/container;
- block: Control row, Compact separation and Surface/container;
- composition gaps: element, group and pattern relationships where their
  owners remain distinct after minimisation.

Intrinsic paint, borders, optical compensation, zero edges, migration literals
and unresolved mismatches remain dispositions until evidence proves a reusable
semantic role.

## R9 — Jira is the programme home, not the schema source

[WD-36041](https://warthogs.atlassian.net/browse/WD-36041) is the project home.
The proposed child records status, decisions and links to the reviewed schema.
Jira does not replace this versioned design record or the design-tokens source.
No mutation occurs until a fresh bridge snapshot and reviewed apply plan exist.

## R10 — Legacy Pragma cuts are donors, not landing branches

The ten current `feat/pragma-*` worktrees are clean but cumulative and share the
historical base `7193fe082`, 75 commits behind the audited `origin/main` at
`1530f3156`. Current main independently changed several of the same components
and already consumes newer package versions. Replaying or rebasing the whole
chain would mix stale architecture, provisional token names and unrelated
upstream evolution.

Preserve the tips, then reconstruct sequential branches from the then-current
main after prerequisites land. Old code supplies proof and intent; CP1 roles,
CP2 schema/policy and current component architecture supply the implementation
contract.

## R11 — Governed density replaces retirement, not the density axis

The older recut task that retired density after component migration is
superseded. Density remains independently representable but not globally
user-selectable. Approved hosts provide it automatically and approved
subscribers consume allow-listed spacing roles. Existing public compatibility
surfaces are retained, aliased, deprecated or removed only through the CP2
migration disposition.

Reducing line-height or typography to force host fit is outside this spacing
schema. If a component requires it, record a separate component-fit decision.

## R12 — A complete recut is an owner partition

A family list is not coverage. Before implementation, every CP1 relationship
must map exactly once to a final cut, an already-landed implementation or an
explicit boundary/deferred exclusion. Timeline, semantic lists, Badge,
InlineCode/KeyboardKey, Tooltip/Popover, Announcement, Tile, non-single-line
fields, Launchpad owners and product Button forks may not disappear because the
historical branches did not contain them.
