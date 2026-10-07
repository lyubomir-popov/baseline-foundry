# Canonical spacing-token adapter

BF's four built-in tiers consume the resolved DTCG dimension records in
`config/canonical-spacing.resolved.json`. That artifact is pinned to
`canonical/design-tokens` commit
`18f57b95b1aa1dfe85a45746016b055c807d6628` for the schema and resolver shape.
That base resolver does not produce the four product matrices consumed here.
The 48 working product values are an explicit Spec 024 override pinned to
`canonical-spacing-spec` commit
`7169231fcc3168032275d920d32856f9669107ac`. Production validation pins SHA-256
`f8fa3f4ac6d94fa1e262ab0530bd2c6d41da2932dc91c06151c711ca093cf679`
over the ordered 4 × 12 DTCG records and rejects provenance changes that would
silently regenerate them from the base resolver.

Activation remains pending. Canonical `main` was observed at
`cad4aacf91b7e70bee81730552b76ef0d8291a34`; it does not yet carry equivalent
owner rulings. The owner must land equivalent rulings on Canonical main and BF
must then repin the resulting full main commit. A squash or rebase may produce
a new commit, so activation does not depend on the proposal commit remaining an
ancestor. The design-tokens contribution is also still pending. This artifact
records working values and does not claim that either external gate has landed.

Contribution 3 introduced the format adapter and temporarily retained seven
values. Spec 020a removed that local overlay and now consumes the guarded Spec
024 working override. The seven adopted working values are:

| Product | Adopted Canonical values |
|---|---|
| Docs | action `0.75rem`; continuation `1.5rem` |
| App | mark gap `0.25rem`; action `0.75rem`; continuation `1.5rem` |
| OS | action `0.5rem`; continuation `1.25rem` |

The adapter creates no density, page/grid, control-height, root-scaling, or
Pragma behavior.

## CSS compatibility window

Built-in CSS emits every Canonical property with the authenticated Canonical
value. Existing BF properties remain temporary compatibility names during the
bounded deprecation window; all twelve alias Canonical directly. A Canonical
name never carries a compatibility value.

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

The built token and surface manifests expose the same values through two
records for built-in tiers:

- `canonicalSpacing` is the authenticated Canonical 4 × 12 matrix;
- `spacing` is the effective record and equals `canonicalSpacing` point-wise.

The existing `baselineUnit`, `layout`, and `components` fields are projections
of effective `spacing`. The corresponding whole-count fields in
`config/tiers/*.json` are executable assertions of the same design decisions,
not a second provider source. A mismatch fails the build.

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
would outrank BF's zero-specificity `:where(...)` selector, so aliased BF
properties could follow the wrong product. BF treats that pair as invalid
configuration and does not guess which product was intended.

## OS scope boundary

Canonical's typography builder intentionally omits an `.os` reset when OS is
identical to its unscoped typography default. Spacing is different: OS has an
explicit product matrix. BF therefore resolves the OS spacing artifact
point-wise and emits it on `.bf-tier-os`; the adapter neither expects nor
synthesizes a Canonical `.os` typography reset. Static and browser contracts
exercise the OS spacing scope independently.
