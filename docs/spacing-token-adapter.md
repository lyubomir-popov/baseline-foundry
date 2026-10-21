# Canonical spacing-token adapter

BF's four built-in tiers consume the generated CSS provider from the accepted
private Spec 024 prototype in `canonical/DS-specs`, pinned to commit
`d7eaba0517800ba7461b6ca824dcd5b2c5408e5a`. The local
`config/canonical-spacing.resolved.json` is a manifest: it identifies that
source and the checked-in provider files under `config/spec-024-spacing/`.
It does not author a second matrix of spacing values.

The adapter verifies each provider file against its manifest SHA-256, reads
primitives from `sets.primitive.css`, and resolves each product's declarations
in `modifiers.spacing.css`. `tokens.json` describes the twelve public semantic
records without supplying their values. Baseline is a separate thirteenth
input. Editorial maps to Site, Documentation to Docs, and App and OS to their
matching products. The archived design-tokens repository is not this build's
provider or a delivery target.

This is local prototype consumption. It does not establish official token
placement, publication, engineering-management approval, complete component
coverage, or owner visual sign-off. Those remain separate from a BF merge.

## BF bindings

Built-in CSS emits the resolved semantic properties on each BF product root.
Existing BF component properties bind those semantic roles directly:

| Provider property | BF property |
|---|---|
| `--spacing-baseline` (external input) | `--bf-baseline` |
| `--spacing-gap-mark-inline` | `--bf-leading-mark-gap` |
| `--spacing-gap-item-inline` | `--bf-element-gap-inline` |
| `--spacing-gap-item-block` | `--bf-field-gap` |
| `--spacing-gap-group-block` | `--bf-section-space-shallow` |
| `--spacing-gap-section-block` | `--bf-section-space` |
| `--spacing-inset-action-inline` | `--bf-component-inline-inset-action` |
| `--spacing-inset-input-inline` | `--bf-component-inline-inset-field` |
| `--spacing-inset-control-block` | `--bf-control-block-inset` |
| `--spacing-inset-surface-compact-inline` | `--bf-surface-compact-inset-inline` |
| `--spacing-inset-surface-compact-block` | `--bf-surface-compact-inset-block` |
| `--spacing-inset-surface-standard-inline` | `--bf-panel-padding-inline` |
| `--spacing-inset-surface-standard-block` | `--bf-panel-padding-block` |

The built token and surface manifests expose `canonicalSpacing` and an equal
effective `spacing` record for built-in tiers. `canonicalSpacingDensity` and
`spacingDensity` carry the provider's default and dense control-block members.
BF binds these through `--bf-control-block-inset-comfortable` and
`--bf-control-block-inset-dense`; the dense member is `0.25rem` in
Editorial, Documentation, and App, and `0rem` in OS. Density changes the
control-block role at supported anatomy placements, not the product tier.

The corresponding counts in `config/tiers/*.json` assert the provider's
geometry; a mismatch fails the build. Deep section spacing and strip padding
remain BF-owned. Continuation inset remains derived from input inset, body
icon size, and mark gap. Badge and StatusLabel use private invariant typography
outside this spacing schema and never subscribe to density.

Custom themes remain BF-owned. Their `spacing` and `spacingDensity` records
come from theme configuration, they omit Canonical provenance, and their CSS
does not claim the unnamespaced `--spacing-*` surface. The independent panel
inline and block counts remain custom-theme inputs.

## Product roots and co-loading

The checked-in provider contains product-scoped `.site`, `.docs`, `.app`, and
`.os` declarations in `@layer ds.modifiers`, alongside its primitive layer.
BF resolves those values at build time and emits unlayered declarations on its
own product roots, so its generated bundles work without separately loading
provider CSS. Direct tier bundles and class-scoped `bf-tier-*` surfaces share
the same values.

Browser validation also checks a synthetic layered provider before and after
BF, including nested product roots. That probe supplements the real provider
resolution checks; it does not claim every possible consumer layer arrangement
is verified. If both class systems are present, pair the Canonical product
class with its corresponding BF tier. Unlayered, mismatched provider rules are
not a supported integration contract.

Product roots belong at page or section boundaries. A new product root ends
inherited component density; component-internal product-tier changes and a
Reset specimen are unsupported. OS has its own explicit spacing matrix and
dense member regardless of any typography provider reset behavior.

## Current consumer coverage

`src/component-density-policy.ts` defines the implemented placements. Table
header and body cells provide density across all four tiers for Chips, boxed
buttons, and the implemented native entry/textarea family through neutral
wrappers. Static Chips also subscribe inside Tab actions and SideNavigation
link or inert-text trailing status slots. Product and nested provider
boundaries stop enrollment.

Compound Search/Color seats, wider segmented/pagination coverage, interactive
navigation APIs, SideTab, and broader navigation coverage remain separate
work. The adapter's accepted provider binding is not evidence that those
consumers are finished. Spec 024 owns the cross-repository completion state.
