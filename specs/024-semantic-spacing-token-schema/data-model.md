# Data model: Semantic spacing-token schema

## SemanticRole

| Field | Type | Rule |
|---|---|---|
| `id` | DTCG path | `spacing.<relationship>.<role>.<axis>` for component/pattern roles |
| `relationship` | enum | `gap` or `inset` in v1; additions require evidence |
| `role` | string | Purpose name, never component or magnitude |
| `axis` | enum | `inline` or `block` |
| `ownership` | enum | `component`, `container`, `composition`, `keyline` |
| `public` | boolean | Public roles are emitted as `--spacing-*` |
| `densityResponse` | enum | `fixed` or `governed` |
| `status` | enum | `candidate`, `approved`, `deprecated` |
| `description` | string | Names owner and relationship in plain language |
| `value` | DTCG dimension reference | Resolves through the primitive scale |

`spacing.baseline` is an existing product/grid invariant outside this entity
and outside the component relationship-category count. Page/grid-owned roles
are likewise governed by their owning specifications rather than forced into
this ID grammar.

## ProductOverride

Keeps the same SemanticRole ID and replaces only its DTCG value for one of
`site`, `docs`, `app` or `os`. An omitted role inherits the base/default value.

## DensityValue

Provides `comfortable` and `dense` values for an approved governed role in one
product. The final source representation is selected during the design-tokens
schema spike, but the resolved model is always a complete:

```text
product × semantic role × density member → dimension
```

## DensityProvider

An exact implementation identifier for a reviewed tight host. It establishes
the dense current-value channel for descendants without a public consumer
modifier. Candidate categories include table cell, tab item and side-navigation
item.

Provider membership follows actual rendered DOM ancestry in the CSS adapter.
Component ownership alone does not convey density through a portal or across a
declared reset boundary.

## DensitySubscriber

An exact implementation identifier plus the set of SemanticRole IDs it binds
to inherited density current values. Roles not listed remain product-default.

## DensityReset

An exact rendered boundary that selects `comfortable` for all listed roles.
Product roots are mandatory resets: they redefine both density members and the
current channel so values cannot be retained from an outer product scope.

## DensityPortal

An explicit framework-adapter bridge from one provider context to a target
portal root. It names the source provider, target root, mode, subscribers and
roles that may be re-provided. Without a declaration, source-host context does
not cross the portal: the child resolves from target DOM ancestry and otherwise
uses the target product's comfortable/default member.

## EvidenceRelationship

| Field | Meaning |
|---|---|
| `id` | Stable owner/property/edge relationship ID |
| `axis` | Inline or block review axis |
| `owner` | Real DOM/CSS spacing owner |
| `property` | Logical CSS property or composed relationship |
| `observations` | Product/state/context measurements |
| `assignment` | Approved SemanticRole ID or non-token disposition |
| `breaker` | Evidence preventing an invalid merge |

## GeneratedChannel

- **Public semantic property**: stable `--spacing-*` API.
- **Private density pair**: product-resolved comfortable/dense values.
- **Private current value**: inherited value selected by an approved provider.
- **Private component binding**: subscriber-local property consumed by
  component CSS.

Private channels are absent from the public token JSON, LSP artifact and
consumer documentation.

## MigrationDisposition

Maps an existing spacing token ID or public density selector, custom property,
package export or documented control to `retained`, `aliased`, `deprecated` or
`removed`. It records all React and non-React consumers, replacement, release
impact and prerequisites. A removal is invalid while any declared consumer or
compatibility promise remains.
