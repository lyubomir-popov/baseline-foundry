# Contract: Pragma spacing migration ledger

## Canonical product matrix

Values below are the resolved provider contract in the owner-approved Pragma
scope: Site / Docs / App. The provider's OS values are intentionally excluded.

| Property | Site | Docs | App |
|---|---:|---:|---:|
| Baseline | `.5rem` | `.25rem` | `.25rem` |
| Field gap | `.5rem` | `.5rem` | `.5rem` |
| Group gap | `1.5rem` | `1.5rem` | `.5rem` |
| Mark gap | `.5rem` | `.5rem` | `.25rem` |
| Pattern gap | `4rem` | `3rem` | `1rem` |
| Region gap | `8rem` | `6rem` | `2rem` |
| Action inset | `1rem` | `.75rem` | `.75rem` |
| Continuation inset | `2rem` | `1.5rem` | `1.5rem` |
| Field inset | `.5rem` | `.5rem` | `.25rem` |
| Strip gap | `4rem` | `3rem` | `3rem` |
| Surface block | `1rem` | `1rem` | `.75rem` |
| Surface inline | `1rem` | `1rem` | `.75rem` |

The implementation must consume the provider property names from
`modifiers.spacing.css`; this table is a post-clustering comparison ledger, not
a classifier or second production token source. Evidence may show that a
provider value participates in more than one semantic ownership contract, or
that a candidate category needs a different relationship.

## Source disposition

| Area | Audited source | Required disposition | Slice |
|---|---|---|---|
| Shared imports | `packages/styles/main/src/index.css`, `tokens.css` | Import provider spacing output in the correct layer | A |
| Local spacing | `packages/styles/main/src/spacing.css` | Remove value ownership, semantic `spaceAfter` and baseline-derived inline facts; retain only proven compatibility aliases | A/B |
| Product/density matrix | `packages/styles/main/src/modifiers.density.css` | Split Site/Docs/App product roots from density; delete target-cell and legacy density aliases | A/C |
| Typography tokens | `packages/styles/typography/src/tokens.css` | Consume exact provider dimensions; remove local baseline/value table | A |
| Typography layout | `elements.css`, `baseline-cap.css`, `baseline-metrics.css`, `baseline-trim.css` | Fix zero tie, remove runtime line-height derivation, move free-text end compensation to margin | A |
| Debug grid | `packages/styles/debug/src/baseline-grid.css` | Read the live product baseline | A |
| React forms | `packages/react/ds-global-form/src/density.css`, `index.css`, `ToggleWrapper` path | Intrinsic Field ledger and semantic inline inset; remove target cells/fixed heights in scope | B/C |
| React shared UI | `packages/react/ds-global` Button, Accordion, Tabs | Button/Accordion immune to density; Tabs Item may provide; intrinsic ledgers | B/C |
| Svelte shared UI | WPE Button and Launchpad components | Intrinsic normal geometry; keep any local modifier scoped to its own component root | B/C |
| React navigation | `packages/react/ds-app` SideNavigation Item/Header/NavTree | Replace fixed baseline-multiple rows with intrinsic geometry | B/C |
| Documentation | density, BaselineGrid, SeatingByElement MDX/examples and obsolete WIP testbed | Teach product roots, intrinsic ledgers and container ownership; remove the testbed | D |

## Density boundary

This migration does not create a governed density feature. The global
`modifiers.density.css` path remains only as an inert import, with no target
height, target baseline, line-height or inline-inset output. Product roots are
not density providers. Any retained `.dense` or `.compact` rule must be scoped
to an explicit component root and may tune only that component; it cannot
publish inherited descendant geometry. A future governed density contract
requires a separate provider artifact, component manifest and spec.

## Geometry ledger

For product baseline `B`, exact line box `L`, start metric nudge `N`, and nominal
provider borders `Rs`/`Re` on the block-start/block-end edges:

```text
paddingBlockStart = max(N - Rs, 0)
paddingBlockEnd = max(N - Re, 0)
paintedBlock = L + paddingBlockStart + paddingBlockEnd + Rs + Re
compensation = (B - (paintedBlock mod B)) mod B
occupiedBlock = paintedBlock + compensation
```

The double modulo encodes the exact-zero tie. Free text uses the analogous
metric end compensation as trailing margin rather than control padding.

`Rs` and `Re` are authored/computed contract inputs, not border widths read back
from layout. At a non-integer native display scale or page zoom, engines may
floor a non-zero border to whole physical pixels and expose smaller used widths
`Rus`/`Rue`. The rendered block then differs from the nominal ledger by the two
used-edge deltas:

```text
renderedPaintedBlock = L + paddingBlockStart + paddingBlockEnd + Rus + Rue
rasterShortfall = (Rs - Rus) + (Re - Rue)
```

Evidence MUST assert `Rs` and `Re` against the provider independently, then
compare each used edge through an explicit device-snap envelope. It MUST NOT
substitute `Rus` or `Rue` back into the padding or compensation formulas: doing
so makes zero and doubled borders algebraically invisible. Playwright
`deviceScaleFactor` is DPR/raster coverage and is not evidence of browser-native
zoom.

`N` is computed once from `1cap` in the shared alignment contract and consumed
by every role and component; it is never a component literal and never
re-derived in a component stylesheet. Its source, font-authentication
requirements, complete component inventory and verification rules are governed
by [the baseline alignment contract](baseline-alignment.md).

## Closed in-box consumer registry

The shared in-box padding pair has one formula and these named consumers only:

- active: React Tabs Item, React ContextualMenu Item, React Combobox Option,
  Svelte Launchpad Table `th`/`td`, and Svelte Launchpad Log line cells;
- future: React SideNavigation Item/Header/NavTree group-header rows and Svelte
  Launchpad NavigationItem.

Table uses separate borders with zero spacing and reserves one nominal
block-end stroke per cell, transparent when no separator is visible. The cell,
not the row, owns the shared in-box padding. Accordion and FileTree/TreeView
remain regular margin-ledger consumers; a Lit List divider requires a separate
architecture decision. No unlisted component may consume the in-box pair.
The status-aware gate also rejects listed future consumers; only active entries
and the single authorized implementation slice pass. Table and Log are active
after their implementation, browser evidence and adversarial reviews were accepted.

Log removed six exact transition identities from the former 292 queue: five
provider-primitive spacing uses and `tbody { min-width: fit-content }`. The
code-row foundation and its type-role/entry gates remained count-neutral.
Browser removal negatives cover all six deletions and the accepted basis is
`320 raw / 27 sanctioned / 286 transition / 7 advisory / 0 legacy`, with no
new classification. The non-paint-derived minimum was not retained.
