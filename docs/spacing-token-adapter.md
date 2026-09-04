# Canonical spacing-token adapter

BF's four built-in tiers consume the resolved DTCG dimension records in
`config/canonical-spacing.resolved.json`. That artifact is pinned to
`canonical/design-tokens` commit
`18f57b95b1aa1dfe85a45746016b055c807d6628` and contains exactly the twelve
approved `spacing.*` IDs for Site, Docs, App, and OS.

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

Canonical properties are the source declarations. Existing BF properties are
temporary aliases so current consumers retain identical computed geometry:

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

The built token and surface manifests retain BF's existing `baselineUnit`,
`layout`, and `components` projections for compatibility and add the resolved
DTCG `spacing` record that owns those values.

## OS scope boundary

Canonical's typography builder intentionally omits an `.os` reset when OS is
identical to its unscoped typography default. Spacing is different: OS has an
explicit product matrix. BF therefore resolves the OS spacing artifact
point-wise and emits it on `.bf-tier-os`; the adapter neither expects nor
synthesizes a Canonical `.os` typography reset. Static and browser contracts
exercise the OS spacing scope independently.
