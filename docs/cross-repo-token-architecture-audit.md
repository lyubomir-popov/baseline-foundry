# Cross-repository token architecture audit

Status: historical first proposal. The owner-resolved governing proposal is
[`cross-repo-token-architecture-spec.md`](cross-repo-token-architecture-spec.md).
No implementation is authorised by this document.

Date: 2026-09-03

## Scope

This audit covers:

- Baseline Foundry (`baseline-foundry`), including active Specs 019 and 020;
- Pragma (`pragma`), especially `@canonical/styles`,
  `@canonical/styles-typography`, and form density;
- the canonical DTCG token source and Terrazzo plugin (`design-tokens`); and
- the metric-based `baseline-nudge-generator` used by Baseline Foundry.

The immediate question is how to express spacing in the accepted DTCG source
format without coupling horizontal geometry to a vertical baseline or coupling
the spacing contract to either a metric-extracted or `1cap` nudge engine.

## Executive decision

The canonical repository has a credible source format and a defensible
runtime-permutation strategy, but its current token contract is not yet a sound
foundation for Baseline Foundry's spacing system.

The proposed direction is:

1. Keep raw reusable lengths in the primitive `dimension` namespace.
2. Put authored spacing decisions under a semantic `spacing` namespace while
   retaining the DTCG `$type: "dimension"`.
3. Keep product tier and viewport breakpoint as independent global resolver
   axes. Model comfortable/dense as a governed inherited context: only an
   allow-listed host may establish it, and only enrolled components consume it.
4. Publish a small semantic spacing vocabulary based on proven relationships,
   not a second numerically named copy of the primitive dimension scale.
5. Keep baseline nudges and compensation in typography alignment. They are not
   semantic spacing tokens.
6. Let BF's metric engine and Pragma's `1cap` engine derive the same local
   alignment interface by different means.

This is a schema and delivery change, not just a JSON rename. The current
Terrazzo plugin does not emit breakpoint-dependent semantic dimensions and its
generic modifier builder assumes colour channels.

## Findings by repository

### Baseline Foundry

BF has the most mature rendered geometry and verification of the repositories
reviewed. Its strongest architectural decisions are worth preserving:

- semantic vertical space is container-owned in all four tiers;
- font-specific nudge and complementary compensation are kept distinct from
  semantic gaps;
- regular controls, in-box rows, and explicit nested controls have accounted
  occupied-block ledgers;
- field, action, and continuation are proven reusable inline-inset roles; and
- Editorial, Documentation, App, and OS are support-equivalent tiers.

Its token workflow is nevertheless bespoke:

- tier JSON mixes typography, font files, baseline, layout, component inputs,
  and generator configuration;
- generated `tokens.json` is not a DTCG token document;
- `roles` and `elements` duplicate the same generated typography records;
- horizontal layout fields are authored as baseline-unit counts;
- `--bf-space-*` is a vertical-baseline scale used on both axes;
- `src/css-grid.ts` overwrites generated page/gutter values with independent
  viewport literals, so the apparent configuration owner is not always the
  runtime owner; and
- the current nudge generator output still includes `spaceAfter`, even though
  BF no longer permits role space-after to drive production layout.

Spec 020 is directionally correct: horizontal spacing needs an independent
quantum and a complete consumer audit. Its approved tier matrix is a useful BF
policy input. It should, however, be expressed through semantic tokens rather
than preserved as another BF-only config schema.

### Pragma

Pragma already consumes canonical colour and typography output, but spacing is
still provisional and fragmented:

- `packages/styles/main/src/spacing.css` duplicates primitive dimensions as
  local `--space-*` aliases and hardcodes the 4px baseline;
- its opening description still claims element-owned editorial spacing even
  though the current shared specification and BF both choose container-owned
  semantic spacing everywhere;
- `.editorial` still activates semantic `--space-after` margins on text;
- layout, component padding, grid values, and density values are hardcoded in
  Pragma rather than sourced from the token package;
- `modifiers.density.css` already implements a useful factorisation pattern
  (tier-specific comfortable/dense pairs followed by a density selection), but
  does so as handwritten CSS;
- the default typography engine uses `1cap`, while the repository also contains
  metric and text-trim experiments; and
- mapper shims repair canonical output naming and hardcode line-height ratios
  because number tokens are intentionally omitted from `sets.primitive.css`.

The cap approximation is not a blocker for shared spacing. It becomes a blocker
only if nudge values are misclassified as spacing or if component spacing is
defined in terms of a particular nudge formula.

### Canonical design tokens

#### What is good

- Source documents use the DTCG 2025.10 format and resolver model.
- Primitive colour ramps are regular OKLCH ramps with useful hex annotations.
- The primitive dimension scale contains the lengths BF and Pragma currently
  need.
- Light/dark source separation and runtime `light-dark()` delivery are sound.
- Factorising modifier dimensions at runtime avoids a stylesheet per Cartesian
  product of theme, intent, surface, and state.
- Typography composites make font size, line-height ratio, weight, family, and
  tracking travel together.
- The LSP artifact is a valuable typed-consumption direction.

#### What is not yet good enough

The source is format-compliant, but format compliance is not semantic quality.

**Dimensions and spacing**

- The semantic dimension layer is almost empty. Small defines root size and an
  8px baseline; xLarge only changes root size; medium and large are documented
  placeholders.
- The token README advertises `--spacing-medium` and `--radius-default`, but no
  corresponding spacing or radius source exists.
- All `dimension.*` IDs are classified as primitive by the plugin, including
  the nominally semantic breakpoint documents.
- The plugin transforms only the default resolver permutation plus special
  theme and typography permutations. There is no spacing/breakpoint emitter.
- There are no canonical breakpoint-threshold tokens even though a breakpoint
  modifier exists.

**Typography**

- The core scale is coherent and broadly matches BF's Editorial,
  Documentation, and App scale decisions.
- Product context is encoded as a `typography` modifier rather than as a shared
  product/tier axis. That makes it harder for spacing and typography to select
  the same tier without parallel class conventions.
- OS has no canonical context.
- Composite variants are substantially repeated across product files.
- Canonical extensions for letter case and figure style are reasonable because
  DTCG does not model them, but the custom build path needs stronger contract
  tests.
- The emitted contract has already required Pragma shims for camelCase/kebab
  mismatches and missing number variables. A token API that needs consumer
  repair shims is not yet stable.
- Pixel descriptions of rem-based tokens are conditional on root size, while
  the resolver also attempts to vary root font size at xLarge. The descriptions
  overstate fixed pixel truth.

**Colour**

The colour values and the colour architecture must be judged separately.

The values look deliberately constructed: perceptually ordered OKLCH ramps,
clear light/dark polarity, and sensible text/link/state anchors. Nothing in this
audit establishes that the palette itself is poor.

The semantic vocabulary is over-modelled and under-proven:

- each theme document contains 354 semantic colour tokens;
- 246 of those are under `color.foreground`;
- 112 are disabled variants, 50 hover variants, and 50 active variants;
- surface, state, intent, and component identity are repeatedly encoded in
  token paths, even though surface and intent are also runtime modifier axes;
- many raw value formulas are duplicated across roles;
- importance contexts and highlighted emphasis are empty placeholders;
- lifecycle and release colours are explicitly placeholder/best-guess
  bindings; and
- repository tests validate schema and snapshots, but this audit found no
  executable WCAG contrast matrix or perceptual state-difference gate.

Therefore the earlier description "defensive and bureaucratic" is partly fair.
It is fair about the semantic vocabulary: it provisions many hypothetical
combinations and transfers discovery cost to consumers. It is not fair about
the runtime-permutable resolver model itself, which solves a real composability
problem.

The corrective principle should be evidence-based reduction: retain a semantic
role only when a component or accessibility contract proves it, generate
derivable state/surface permutations where possible, and do not publish empty
modifier families as if they were supported API.

### Baseline nudge generator

The generator's valuable bounded responsibility is reading real font metrics
and deriving alignment corrections. It should not own the design system's
semantic spacing model.

Current concerns:

- input and output are bespoke rather than DTCG overlays;
- font, type scale, line-height grid counts, semantic `spaceAfter`, metrics, and
  demo generation are combined;
- `spaceAfter: 0` has historically received special semantic treatment in demo
  CSS, which is incompatible with BF's current container-owned contract; and
- the checked-in drift investigation says the shipped compensation has the
  wrong sign and a floating-point wrap bug. That must be resolved as a separate
  breaking release, not smuggled into the spacing migration.

The generator does not need to generate spacing tokens. A future major version
may accept resolved DTCG typography plus `spacing.rhythm.baseline` and emit a
small DTCG overlay containing role-specific alignment inputs.

## Proposed source model

### Namespace and type rule

`dimension` answers "what kind of value is this?" at the primitive level.
`spacing` answers "what decision does this length represent?" at the semantic
level.

Use:

```text
global/primitive/dimension.tokens.json
global/semantic/spacing/base.tokens.json
global/semantic/modifier/tier/{site,docs,app,os}.tokens.json
global/semantic/modifier/density/{comfortable,dense}.tokens.json
global/semantic/modifier/breakpoint/{x-small,small,large,x-large}.tokens.json
```

Every token below still has DTCG `$type: "dimension"`. No proprietary spacing
type is needed.

Do not create a public `spacing.scale.*` that merely copies every numeric
primitive. Primitive dimension aliases can remain internal authoring inputs;
components should consume a semantic relationship.

### Quantisation rule

The independent 0.25rem inline quantum is an authoring/validation rule, not a
semantic consumer token. DTCG aliases do not provide arithmetic, so every
semantic token must still carry a complete conformant `$value`, normally an
alias to the matching primitive dimension.

If retaining the unit count materially improves review, record it as Canonical
extension metadata beside the conformant value, for example:

```jsonc
{
  "$type": "dimension",
  "$value": "{dimension.150}",
  "$extensions": {
    "com.canonical.quantization": {
      "axis": "inline",
      "quantum": "{dimension.050}",
      "count": 3
    }
  }
}
```

A repository check must prove that the value and metadata agree. Generated CSS
and consumers receive `0.75rem`, not a unit count or runtime multiplication.
If the metadata does not pay for itself in review clarity, omit it and validate
resolved inline values directly against the quantum. Do not publish
`spacing.inlineUnit` as component API.

### Resolver axes

Use three independent axes:

| Axis | Contexts | Responsibility |
| --- | --- | --- |
| `tier` | `site`, `docs`, `app`, `os` | Product typography/spacing profile |
| `density` | `comfortable`, `dense` | Values for a governed local inherited context |
| `breakpoint` | four agreed viewport brackets | Responsive layout spacing only |

`theme`, anticipation, criticality, emphasis, and surface remain independent.
Spacing must not be added to colour modifier channels.

Use these defaults and resolution order unless adversarial review finds a
concrete conflict:

```text
sets.primitive
sets.spacingProfiles
modifier.breakpoint   (default: smallest supported bracket)
modifier.tier         (default: site)
modifier.density      (default: comfortable)
modifier.theme
remaining state/intent/surface modifiers
```

Breakpoint updates private per-tier decisions. Tier then establishes the
comfortable/dense choices for density-responsive roles. The density modifier
is useful when building and testing each possible resolved point, but it is not
a freely applicable product-level runtime mode. Comfortable is the ordinary
inherited value. Only an allow-listed tight host, such as a side-navigation
item, table cell, or tab item, may establish dense for its subtree. Only
components enrolled as density subscribers read the inherited density-current
properties; all other semantic spacing remains unchanged. DTCG references
resolve after the ordered documents have been merged.

This distinction prevents a designer from compressing an arbitrary panel or
page while still allowing a badge in a tab or an input in a table cell to adapt
without a second instance-level choice. The host allow-list and subscriber
list are component-policy metadata, not token axes. They should live in a
reviewed component manifest (and corresponding type/lint rules), because a
token document cannot express which components are authorised to provide or
consume a context.

The existing `typography` modifier can remain as a compatibility surface while
tier is introduced. Long term, typography and spacing should resolve from the
same tier selection rather than rely on two lists of class names staying equal.

### Semantic token vocabulary

The initial public vocabulary should be limited to proven cross-component or
layout contracts:

| Token ID | CSS custom property | Owner/use |
| --- | --- | --- |
| `spacing.rhythm.baseline` | `--spacing-rhythm-baseline` | Vertical grid quantum |
| `spacing.gap.field.block` | `--spacing-gap-field-block` | Label/control/help relationships |
| `spacing.gap.iconLabel.inline` | `--spacing-gap-icon-label-inline` | Shared icon/mark-to-copy gap |
| `spacing.gap.pattern.block` | `--spacing-gap-pattern-block` | Internal boundary between complete subpatterns |
| `spacing.gap.section.block` | `--spacing-gap-section-block` | Ordinary section boundary |
| `spacing.gap.sectionMajor.block` | `--spacing-gap-section-major-block` | Deliberately large section boundary |
| `spacing.inset.field.inline` | `--spacing-inset-field-inline` | Data-entry first-glyph inset |
| `spacing.inset.action.inline` | `--spacing-inset-action-inline` | Command/action inset |
| `spacing.inset.continuation.inline` | `--spacing-inset-continuation-inline` | Copy following a mark/disclosure/depth |
| `spacing.inset.surface.inline` | `--spacing-inset-surface-inline` | Structural region inline padding |
| `spacing.inset.surface.block` | `--spacing-inset-surface-block` | Structural region block padding |
| `spacing.layout.page.margin.inline` | `--spacing-layout-page-margin-inline` | Outer page margin |
| `spacing.layout.grid.gutter.inline` | `--spacing-layout-grid-gutter-inline` | Grid column gutter |
| `spacing.layout.grid.gutter.block` | `--spacing-layout-grid-gutter-block` | Two-dimensional grid row gutter |
| `spacing.layout.content.padding.inline` | `--spacing-layout-content-padding-inline` | Capped content inset |
| `spacing.layout.strip.padding.block` | `--spacing-layout-strip-padding-block` | Strip/section block frame |

Names describe relationships and ownership, not visual magnitude. Component-
specific dimensions stay with components until a second consumer proves a
shared role. Content width, measure, icon size, radius, border width, and drawer
width are dimensions or layout geometry, not spacing merely because their
values are lengths.

### BF horizontal policy seed

BF's owner-approved Spec 020 matrix is a suitable first policy fixture for the
tier-dependent inline tokens:

| Token | Site/Editorial | Docs | App | OS |
| --- | ---: | ---: | ---: | ---: |
| page margin inline | 2rem | 1.5rem | 1rem | 0.75rem |
| grid gutter inline | 2rem | 1.5rem | 1.25rem | 1rem |
| content padding inline | 1rem | 1.5rem | 1rem | 0.75rem |
| surface inset inline | 1rem | 1rem | 0.75rem | 0.5rem |
| field inset inline | 0.5rem | 0.5rem | 0.25rem | 0.25rem |
| action inset inline | 1rem | 0.75rem | 0.75rem | 0.5rem |
| continuation inset inline | 2rem | 1.5rem | 1.5rem | 1.25rem |
| icon/mark-to-label gap | 0.5rem | 0.5rem | 0.25rem | 0.25rem |

These are BF policy values, not automatically Canonical policy. The canonical
contribution must reconcile them with the grid specification's breakpoint
matrix instead of silently replacing either source.

### Factorised source, resolved public output

Some layout values depend on both tier and breakpoint. DTCG modifiers do not by
themselves express a conditional cross-axis value without a reference layer.
Use private profile decision tokens in source, then resolve only the generic
semantic IDs into public CSS.

Conceptually:

```jsonc
// breakpoint context updates private tier decisions
"spacing.profile.site.layout.grid.gutter.inline": {
  "$type": "dimension",
  "$value": "{dimension.400}"
}

// tier context binds the public role
"spacing.layout.grid.gutter.inline": {
  "$type": "dimension",
  "$value": "{spacing.profile.site.layout.grid.gutter.inline}"
}
```

The spacing builder should evaluate every supported tier × breakpoint point,
plus both values of every density-responsive role, through the DTCG resolver.
It need not emit the Cartesian product. Tier-only public values can be emitted
directly by tier selector. Responsive tier values can be emitted by tier
selector inside the relevant media query. Density-responsive values stay
factorised: each tier establishes internal comfortable/dense choices,
comfortable is the default current value, and allow-listed hosts switch only
the inherited density-current properties. Subscriber components consume those
properties; a global `.dense` utility must not rewrite the general semantic
spacing namespace.

```css
.app {
  --_spacing-gap-field-block-comfortable: 0.5rem;
  --_spacing-gap-field-block-dense: 0.25rem;
  --_density-current-gap-field-block:
    var(--_spacing-gap-field-block-comfortable);
}

/* Illustrative allow-listed providers, generated from component policy. */
:where(.p-side-navigation__item, .p-table__cell, .p-tabs__item).is-dense {
  --_density-current-gap-field-block:
    var(--_spacing-gap-field-block-dense);
}

/* Only enrolled subscribers read the contextual value. */
:where(.p-badge, .p-form-input) {
  --_component-gap-field-block:
    var(--_density-current-gap-field-block);
}

@media (width >= 64.75rem) {
  .site { --spacing-layout-grid-gutter-inline: 2rem; }
  .app { --spacing-layout-grid-gutter-inline: 1.5rem; }
}
```

Private profile IDs need not be emitted verbatim. Any internal CSS choice
properties must be marked internal in the LSP artifact and excluded from the
supported consumer API. Point-wise tests compare the browser's computed public
value with DTCG's fully flattened result for every combination.

This preserves point-wise DTCG equivalence without asking components to know a
product name or emitting a prebuilt stylesheet for every full permutation. It
also requires explicit tests for nested providers, a comfortable reset inside a
dense host, non-subscriber immunity, and any portalled component that cannot
inherit the DOM context directly.

## Alignment-engine boundary

Both frameworks should consume the same semantic spacing tokens and may derive
typography alignment differently.

Shared inputs:

- resolved font size and line height per role;
- `spacing.rhythm.baseline`; and
- a local alignment contract for start nudge and complementary block-end
  compensation.

BF derives the alignment contract from extracted font metrics at build time.
Pragma derives it from `1cap` at runtime. Neither algorithm changes the meaning
or value of section gaps, component insets, page margins, or grid gutters.

Nudge outputs should use typography-local names such as:

```text
typography.alignment.body.nudge.blockStart
typography.alignment.body.compensation.blockEnd
```

They must not appear under `spacing.*`, and semantic `spaceAfter` must not be
part of the generator output.

## Delivery changes required in design-tokens

1. Add semantic spacing source documents and an explicit tier modifier.
2. Add breakpoint threshold tokens or another single owned threshold config.
3. Add a spacing builder that handles dimension-valued modifiers and media
   queries; do not route spacing through the colour-channel builder.
4. Correct primitive/semantic classification so path prefix alone does not
   make semantic dimension aliases primitive.
5. Emit number tokens needed by emitted typography references, or inline fully
   resolved values consistently.
6. Enforce one source-name-to-CSS-name conversion and remove consumer shims.
7. Record public versus internal/profile tokens in `tokens.json`.
8. Add point-wise equivalence tests for every tier × breakpoint point and both
   values of each density-responsive role.
9. Add a no-unresolved-reference test over every generated CSS file.
10. Do not publish placeholder modifier families as supported tokens.
11. Add a machine-readable allow-list of density providers and subscribers;
    prevent arbitrary components or product markup from opting into density.

## Migration sequence

### Phase 0: decisions and fixtures

- Resolve whether Spec 020 supersedes Spec 019 before BF implementation.
- Freeze computed before-state fixtures for all four BF tiers.
- Reconcile the Canonical spacing draft and grid draft, which currently state
  different horizontal policies.
- Decide the public tier and breakpoint names before either becomes stable API.

### Phase 1: canonical token/plugin capability

- Introduce the semantic spacing documents and spacing builder in
  `design-tokens`.
- Prove source schema validity, full resolution, generated CSS, artifact
  metadata, and point-wise permutation equivalence.
- Keep the first contribution to proven roles; do not add speculative component
  tokens.

### Phase 2: Baseline Foundry adapter

- Replace BF spacing fields with DTCG source tokens while preserving exact
  rendered values initially.
- Read resolved semantic spacing in `src/build.ts`.
- Keep existing `--bf-*` properties as compatibility aliases to canonical
  `--spacing-*` properties for one deprecation window.
- Move all horizontal spacing consumers off `--bf-space-*` and preserve the
  Spec 020 axis-separation assertion.
- Remove the independent hardcoded gutter/margin policy in `src/css-grid.ts` so
  generated tokens have one runtime owner.

### Phase 3: Pragma adoption

- Import generated spacing output in `@canonical/styles`.
- Replace `spacing.css` and the hardcoded value matrix in
  `modifiers.density.css` with token bindings while keeping component geometry
  formulas local.
- Replace unrestricted `.comfortable`/`.dense` cascade behavior with approved
  density providers and an explicit subscriber contract. A badge in a tab or
  an input in a table cell must inherit dense automatically; unrelated
  descendants must remain unchanged.
- Remove semantic editorial `space-after`; containers own semantic gaps.
- Retain the `1cap` alignment engine and verify that only alignment outputs,
  not semantic spacing values, differ from BF.

### Phase 4: generator boundary cleanup

- In a deliberate major version, accept resolved typography/baseline inputs and
  emit a DTCG alignment overlay.
- Remove semantic `spaceAfter` from the core output.
- Resolve the known drift compensation sign and epsilon issues as separately
  reviewed breaking changes.

## Required gates

- DTCG schema and resolver validation.
- No unresolved CSS custom-property references.
- Public/internal artifact classification.
- Point-wise flattened-versus-runtime equality for global axes and every
  density-responsive role.
- Provider/subscriber contract tests: approved automatic inheritance, nested
  comfortable reset, non-subscriber immunity, and no public arbitrary-density
  escape hatch.
- No horizontal spacing token derived from baseline or font metrics.
- All authored horizontal BF values are whole counts of its independent inline
  quantum; the public token values remain rem dimensions.
- Existing BF computed geometry is unchanged during the format-only migration.
- Full BF tier/direct-class parity and browser QA after consumer migration.
- Pragma component and visual gates across site/docs/app, comfortable/dense,
  light/dark, forced colours, root-font scaling, and non-100% zoom.
- A separate executable colour contrast/state-distinguishability matrix before
  calling the colour contract stable.

## Recommendation

Proceed with the schema direction, but do not refactor BF or the generator yet.
First obtain adversarial review of the namespace, modifier factorisation,
public/private boundary, and canonical grid-policy conflict. Then promote one
specification that supersedes BF Specs 019/020 as needed and sequences the
design-tokens capability before consumer adoption.
