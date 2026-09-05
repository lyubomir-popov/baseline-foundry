# Canonical spacing-token adapter

BF's four built-in tiers consume the resolved DTCG dimension records in
`config/canonical-spacing.resolved.json`. That artifact is pinned to
`canonical/design-tokens` commit
`18f57b95b1aa1dfe85a45746016b055c807d6628` and contains exactly the twelve
approved `spacing.*` IDs for Site, Docs, App, and OS. Production validation
also pins SHA-256
`97cffe22691cebbe29d786d2fbe10d04d014d412ed35ccaca386ca41e73bd571`
over the ordered 4 × 12 DTCG records. A value change at any point, including
an overlaid point, fails before the overlay is applied.

This adapter is a format migration, not the 020a value migration. The
BF-local `config/canonical-spacing.compatibility-overlay.json` therefore keeps
seven current values until 020a:

| Product | Temporarily retained BF values |
|---|---|
| Docs | action `1rem`; continuation `2rem` |
| App | mark gap `0.5rem`; action `1rem`; continuation `2rem` |
| OS | action `1rem`; continuation `2rem` |

The overlay has one removal condition: `BF 020a spacing-value adoption`.
Neither the adapter nor the overlay creates density, page/grid, control-height,
root-scaling, or Pragma behavior.

## CSS compatibility window

Built-in CSS emits every Canonical property with the final Canonical value.
Existing BF properties remain the compatibility surface that components use
during the bounded window. At the 41 equal points they alias the Canonical
property; at the seven deferred points they carry the retained BF value as a
literal. A Canonical name never carries a compatibility value.

| Canonical property | Temporary BF alias |
|---|---|
| `--spacing-baseline` | `--bf-baseline` |
| `--spacing-gap-field-block` | `--bf-field-gap` |
| `--spacing-gap-mark-inline` | `--bf-leading-mark-gap` |
| `--spacing-gap-group-block` | `--bf-section-space-shallow` |
| `--spacing-gap-pattern-block` | `--bf-section-space` |
| `--spacing-gap-region-block` | `--bf-section-space-deep` |
| `--spacing-inset-field-inline` | `--bf-component-inline-inset-field` |
| `--spacing-inset-action-inline` | `--bf-component-inline-inset-action` |
| `--spacing-inset-continuation-inline` | `--bf-component-inline-inset-continuation` |
| `--spacing-inset-surface-inline` | `--bf-panel-padding-inline` |
| `--spacing-inset-surface-block` | `--bf-panel-padding-block` |
| `--spacing-inset-strip-block` | `--bf-strip-space` |

The built token and surface manifests expose two deliberately different
records for built-in tiers:

- `canonicalSpacing` is the final, unoverlaid Canonical 4 × 12 matrix;
- `spacing` is BF's effective pre-020a matrix after the seven-point overlay.

The existing `baselineUnit`, `layout`, and `components` fields are projections
of effective `spacing`. The corresponding fields in `config/tiers/*.json` are
temporary compatibility assertions, not a second built-in source of truth.
Do not edit those fields in isolation: update the pinned provider artifact and
bounded overlay contract in the appropriate approved migration. A mismatch
fails with that guidance in the build error.

Custom themes are BF-owned. They expose only effective `spacing`, omit
`canonicalSpacing`, and emit only `--bf-*` spacing properties. They do not
claim the unnamespaced Canonical `--spacing-*` surface.

## Co-loading Canonical CSS

At the pinned provider commit, spacing custom properties are emitted by
`sets.semantic.css`, reference primitives from `sets.primitive.css`, and sit
under `:root` in `@layer ds.tokens`. There is no
`modifiers.spacing.css`, and the generated CSS has no product-scoped
`.site`/`.docs`/`.app`/`.os` spacing blocks. Co-loading those two real provider
files before or after BF is stable: BF's unlayered, host-local built-in
declarations carry the selected product matrix.

BF also tests a synthetic forward-compatibility case based on Canonical's
documented future product-scoped shape. It loads `.site`/`.docs`/`.app`/`.os`
rules in `@layer ds.tokens` before and after BF and exercises nested scopes.
Those synthetic scopes are not a claim about current provider output. In that
future shape, consumers must pair each Canonical product class with the
corresponding `bf-tier-*` class. If a future provider emitted those product
rules unlayered and a consumer mismatched the classes, the provider selector
would outrank BF's zero-specificity `:where(...)` selector: up to six of the 41
aliased BF properties could follow the wrong product, while the seven retained
BF literals would remain immune. BF treats that pair as invalid configuration
and does not guess which product was intended.

## OS scope boundary

Canonical's typography builder intentionally omits an `.os` reset when OS is
identical to its unscoped typography default. Spacing is different: OS has an
explicit product matrix. BF therefore resolves the OS spacing artifact
point-wise and emits it on `.bf-tier-os`; the adapter neither expects nor
synthesizes a Canonical `.os` typography reset. Static and browser contracts
exercise the OS spacing scope independently.
