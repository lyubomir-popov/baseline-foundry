# Reply to Opus: final cross-framework token-architecture review

Thank you for the adversarial review in
`docs/cross-repo-token-architecture-review.md`. The review found several real
source and sequencing defects. We accept the load-bearing recommendations on
namespace/type separation, plumbing before publication, format before value,
governed density inheritance, and separating typography alignment from
semantic spacing.

This is a request for one final read-only review after owner input and a
source-level critique of two of the review's conclusions. Do not implement,
commit, merge, push, publish, release, archive, or switch branches. Write the
result to `docs/cross-repo-token-architecture-final-review.md`.

## Owner decisions and clarifications

### 1. Product-specific baseline units are intentional and shared policy

Pragma must adopt the product-specific baseline units already proven in
Baseline Foundry:

| Product context | Baseline step |
| --- | ---: |
| `site` (BF Editorial) | `0.5rem` |
| `docs` | `0.25rem` |
| `app` | `0.25rem` |
| `os` | `0.25rem` |

BF is the source of truth for these values. Pragma's current global
`--space-baseline: 0.25rem` is transitional and must become product-scoped;
in particular, Pragma Site must adopt `0.5rem`. Canonical's present 8px token
is not globally correct, but 8px is correct for Site/Editorial. The required
correction is therefore a product-scoped baseline, not removal of baseline
from the shared contract.

Review the consequences for Pragma's typography engine, density cell matrix,
control-seat calculations, and baseline tests. Do not assume that every
product must have the same baseline step.

### 2. Optional BF root scaling must remain possible without branching tokens

Canonical previously proposed changing the root from `1rem` to `1.125rem` at
the largest breakpoint, following Vanilla. That proposal was turned down for
the shared implementation, but BF should keep it as an optional configuration
and Pragma will probably never apply it.

The intended architecture is:

- semantic typography, spacing, alignment and baseline values remain authored
  in `rem`;
- the token IDs and resolved rem values do not change when BF optionally sets
  the root to `1.125rem`;
- the BF application layer, not the spacing resolver, decides whether to apply
  responsive root scaling;
- Pragma may consume the same tokens without enabling that application policy;
- BF does not generate a second set of font nudges. Metric-derived rem nudges,
  line heights, baseline steps and rem spacing scale together.

We therefore reject the unqualified A3 statement that merely varying the
`rootFontSize` token "makes every rem token responsive". A custom property does
not change the rem reference unless a consumer applies it to the root. We found
no current BF, Pragma or design-tokens rule that applies
`--dimension-size-rootFontSize` to `html`.

If BF does apply the optional policy, rem/em-based geometry changes in computed
CSS pixels by design. This is environmental scaling, not a new breakpoint value
for each semantic token, and it does not couple horizontal spacing to the
vertical baseline.

Do challenge the limits of the zoom analogy. Root-font scaling does not change
fixed CSS-pixel values, viewport units or breakpoint thresholds in exactly the
same way as browser zoom. The current known fixed-pixel exception is the
normative 24 CSS-pixel WCAG pointer-target extension. Also assess variable
fonts with optical-size-dependent metrics rather than assuming every font
scales perfectly linearly.

The final architecture must say whether the existing `rootFontSize` documents
remain typography/application-policy inputs, move elsewhere, or are retained
but deliberately not consumed by Pragma. It must not require spacing-token
variants solely because BF optionally changes its root size.

### 3. Grid policy and component spacing have different owners

The apparent A6 conflict came from three documents repeating page-margin and
grid-gutter values. The owner clarification is:

- the grid specification exclusively owns page margins, grid gutters, column
  subdivision and responsive grid behavior;
- the spacing specification must reference the grid specification rather than
  restate flat grid values;
- `bf-stack`, pattern gaps, field/action/continuation insets, mark-to-copy gaps,
  component padding and governed density are component/pattern spacing, not
  grid policy;
- the initial canonical spacing contribution is limited to component and
  pattern spacing plus the product-scoped baseline;
- page/grid tokens are not part of that first contribution.

BF Spec 020 should split accordingly:

- 020a covers component insets and gaps, panel/surface padding,
  `inlineUnitRem`, and provenance-based axis separation. It absorbs and
  supersedes Spec 019.
- 020b covers page margin, grid gutter and content padding. It remains separate
  until BF removes the duplicate runtime owner and the grid documents have one
  canonical policy.

Under this scope there is no breakpoint-dependent role in the first spacing
contribution. The proposed private `spacing.profile.*` cross-axis reference
layer should therefore be omitted from v1. A later grid contribution may use a
dedicated responsive builder or a tightly bounded private policy layer if DTCG
point-wise resolution requires it. Do not claim the cross-axis problem has
vanished merely because it moved into a builder.

### 4. Density shares context and spacing, not geometry algorithms

The owner intends approved tight contexts—side-navigation items, table cells,
tab items and a small reviewed set—to establish inherited dense mode.
Enrolled descendants, such as a badge inside a tab or an input inside a table
cell, adapt automatically. Designers must not have an unrestricted density
utility.

The common contract may include:

- comfortable/dense context values for semantic gaps and insets;
- the provider/subscriber manifest and nested reset rules; and
- product-specific values for those spacing roles.

Framework-local outputs remain local:

- Pragma may select a density cell and target baseline and derive line-height,
  padding and border compensation from it;
- BF retains metric-derived nudge, symmetric occupied-block padding and
  trailing compensation, with no target block size.

The previous review describes Pragma density as universally imposing a target
block size. That is too broad. Pragma's current Button and composite-input seat
explicitly use `block-size: auto`; line-height, padding and border add up to the
selected cell. Some transitional direct form chromes still use fixed
`block-size`/`min-block-size`. Distinguish the target geometry model from its
CSS implementation and identify the remaining fixed-size migration debt.

Do not conclude that BF subscribes to nothing. BF can consume contextual
density spacing without consuming Pragma's `--density-line-height`,
`--density-target-baseline-px`, `--control-seat-line` or
`--control-seat-basis`. Those are not shared spacing tokens.

### 5. Accepted corrections from the first review

Treat the following as agreed unless new source evidence disproves them:

- A1 is valid: `src/css-grid.ts` currently overrides the tier-authored page
  margin and grid gutter at equal specificity and later source order. Spec 020
  must distinguish authored configuration from computed runtime behavior and
  BF must eventually retain one owner.
- New semantic spacing IDs use `spacing.*` with DTCG `$type: "dimension"`.
- Fix `convertTokenIdToCssVar` before publishing spacing IDs. Add deterministic
  lowercase kebab-case conversion, output-collision detection and an explicit
  compatibility plan for existing camelCase properties. New spacing IDs use
  lowercase single-word segments regardless.
- Plumbing lands before public spacing tokens: semantic classification,
  dimension-valued modifier handling, number-token handling, naming and
  public/internal artifact classification.
- The first component-spacing contribution has no profile/reference layer and
  no responsive page/grid roles.
- Density uses a dedicated builder and a machine-readable provider/subscriber
  policy, not the generic public `.comfortable`/`.dense` modifier builder.
- Alignment is a typography-engine interface. The engine supplies one
  `nudge.blockStart` value/expression per role plus provenance; complementary
  block-end compensation is derived locally from the active baseline step and
  rounding rule. Legacy semantic `spaceAfter` output is retired.
- Migration separates format-only changes from value changes. A format-only
  adapter must preserve computed geometry before Spec 020a changes values.

## Questions for the final review

Answer each explicitly and cite exact source paths/lines.

1. Is the product baseline matrix above internally coherent across BF and
   Pragma? Identify every Pragma formula or test that must change when Site
   moves from `0.25rem` to `0.5rem`, while Docs and App remain `0.25rem`.
2. Can one set of rem-valued semantic spacing tokens remain agnostic to BF's
   optional `1.125rem` root policy and Pragma's decision not to apply it? State
   precisely what scales, what does not, and whether any nudge needs
   regeneration.
3. Reclassify A3 after checking actual consumption: fatal current defect,
   future-policy risk, or harmless unused token. Give the exact condition that
   would turn it into runtime behavior.
4. Does exclusive grid ownership plus the 020a/020b split resolve A6 for the
   first contribution? Identify any component token in 020a that still
   accidentally encodes page/grid policy.
5. Is it sound to omit `spacing.profile.*` from v1? If a later grid builder
   still needs cross-axis product × breakpoint policy, describe the smallest
   honest source representation rather than hiding it in imperative code.
6. Does the density boundary now let both frameworks share context and spacing
   without pretending they share control geometry? Correct the earlier A4
   wording and flag any genuine incompatibility that remains.
7. Is one nudge output per typography role sufficient when the baseline step
   is product-specific and BF may optionally scale its root? State the exact
   derivation and rounding contract.
8. Give the exact v1 public token IDs after removing page/grid roles. Include
   `spacing.baseline`, the component/pattern gaps, insets and surface/strip
   roles; mark which may respond to governed density. Do not reintroduce size
   labels or a public numeric scale.
9. Give a corrected contribution sequence whose first PR is plumbing-only and
   whose first token PR contains no page/grid policy or optional-root-specific
   variants.
10. List only unresolved owner decisions that genuinely block that first token
    PR. Do not carry forward questions resolved above.

## Required final output

Write `docs/cross-repo-token-architecture-final-review.md` containing:

1. final verdict;
2. corrections to A2, A3, A4 and A6;
3. answers to all ten questions;
4. the exact v1 token table and modifier axes;
5. a worked Site/Editorial baseline example and a BF optional-root example;
6. the minimal plumbing PR and first token PR contents;
7. executable acceptance gates; and
8. the remaining owner-decision list.

This is the final architecture pass. Prefer a small enforceable contract over
future-proofing by adding inactive axes, placeholder tokens or public profile
indirection.
