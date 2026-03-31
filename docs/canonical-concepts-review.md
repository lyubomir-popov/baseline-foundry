# Canonical Concepts Review

Date: 2026-03-28

## Reference inputs

- `C:\Users\lyubo\work\repos\canonical-specs` at commit `142bd4e` (pulled 2026-03-28)
- `C:\Users\lyubo\work\repos\canonical-specs\specs\spacing\Spacing spec 0.4.md`
- `C:\Users\lyubo\work\repos\canonical-specs\specs\grid\grid-specification.md`
- `C:\Users\lyubo\work\repos\canonical-specs\specs\typography-article\Typography usage article – skeleton v0.1.md`
- `C:\Users\lyubo\work\repos\canonical-specs\specs\typeface\draft.md`
- `C:\Users\lyubo\work\repos\docs-typescale`

## Short answer

Yes, we can borrow more from the updated Canonical work than the earlier read suggested.

The new material is no longer just a spacing argument. It now contains three genuinely useful layers:

1. a stronger editorial spacing model
2. a coherent application-grid doctrine
3. a more explicit typography philosophy built around restraint, weight, and baseline discipline

The right response for `baseline-foundry` is still not "copy Canonical wholesale". The right response is:

- keep editorial, non-zero baseline alignment as the default center
- selectively adopt the Canonical grid and authoring ideas where they sharpen the system
- keep application-tier layout mechanics compatible with baseline alignment instead of treating them as a zero-nudge escape hatch

## What changed in the newer specs

Compared with the older snapshot, the updated repo adds two things that materially change the recommendation:

### 1. The grid spec is now strong enough to influence implementation

The application grid spec is not just broad guidance. It makes a clear structural argument for:

- container-based grids
- gutters driven by viewport breakpoint, not container width
- column counts restricted to `4`, `8`, or `16`
- span options restricted to power-of-2 fractions of the active column count
- no thirds
- no `auto-fill` / `auto-fit` column-count logic
- nested grids inheriting parent keylines

That is a real architectural position, not just a design preference.

### 2. The typography article is now a proper design-system philosophy document

The typography article adds explicit guidance around:

- restraint in number of sizes
- weight doing more hierarchy work than size
- paired heading sizes differentiated by weight
- line length around `40em`
- line-height multiples tied to the baseline unit
- heading spacing treated as layout, not ad hoc typography styling

Those ideas are directly applicable since this repo also uses Ubuntu Sans Variable.

## What is worth borrowing

### 1. Content-flow spacing as the primary editorial model

This remains the strongest transferable idea.

The updated spacing spec is clearer than before about why element-owned spacing wins in prose:

- heterogeneous content needs asymmetric transitions
- unknown content should still compose acceptably
- bottom-only spacing is more resilient than top-owned spacing
- flow boundaries need an automatic trailing-margin reset

This matches `baseline-foundry` very well.

Useful additions from the newer text:

- treat "content flow" as a first-class context
- keep `margin-bottom` only; never `margin-top`
- use an automatic last-child reset at flow boundaries
- consider the precision reset model where the last child keeps baseline compensation while semantic spacing is removed

### 2. Invariants as acceptance criteria, not just philosophy

The updated spacing spec is strongest where it names invariants explicitly:

- substitutability
- locality
- no double spacing
- composition isolation
- predictable removal
- grid alignment

This is worth borrowing almost verbatim as a validation frame for `baseline-foundry`.

For this repo, that means future design and test work should ask:

- can one prose element swap for another without parent surgery?
- do patterns avoid re-encoding child spacing?
- do flow boundaries avoid double spacing?
- do baseline and box heights still land on the rhythm unit?

### 3. The Canonical app-grid doctrine for a future app preset

The updated grid spec is the biggest practical change in the recommendation.

The most reusable parts are:

- app grids should be container-based
- gutters and outer margins should stay globally consistent at each viewport band
- column counts should be limited to `4`, `8`, and `16`
- spans should be power-of-2 fractions only
- nested grids should inherit parent keylines
- two-dimensional grids should keep row gap equal to gutter

This is especially relevant because `baseline-foundry` currently ships a `4` / `8` / `12` grid with open-ended span classes. That is more permissive than the new Canonical logic.

My updated view:

- the current editorial default can stay simple
- but if we keep a general-purpose app-facing grid primitive, the Canonical `4` / `8` / `16` plus power-of-2 span model is stronger than the current `12`-column future

### 4. Typography principles, not typography values

The newer typography article is useful less for exact sizes and more for method.

The transferable pieces are:

- use very few sizes
- make weight carry more hierarchy than size inflation
- keep body text generous and headings progressively tighter
- keep line heights snapped to baseline multiples
- use heading spacing as a layout rule, not a local improvisation
- keep a readable default measure around `40em`

This is directly applicable since this repo also uses Ubuntu Sans Variable.

### 5. Border compensation and box-model honesty

The spacing spec is unusually clear about border compensation:

- vertical padding must shrink when all-side borders are added
- horizontal padding must also compensate when all-side borders exist
- box height should still land on whole `bU` steps

That is worth carrying into any future field, button, card, or panel primitives here.

## What should not be borrowed literally

### 1. The full three-tier architecture on day one

Canonical needs:

- Editorial
- Documentation
- Applications

with different base sizes, different nudge behavior, and different authoring guidance.

`baseline-foundry` does not need to start there.

This repo should keep one strong editorial-first default until actual reuse pressure proves a second preset is necessary.

### 2. ~~Ubuntu Sans-specific values and heading pairings~~ RESOLVED

> **Update (2026-03-31):** This repo now uses Ubuntu Sans Variable as its production font. Canonical typography values are directly usable. All three tier configs match the canonical source of truth exactly.

### 3. Application simplification as the default center

The updated specs are even clearer that Canonical app tier can intentionally simplify toward zero nudges.

That is reasonable for Canonical's multi-tier system.
It should still not become the center of this repo.

For `baseline-foundry`:

- baseline-aligned editorial text remains the defining proposition
- app layouts can still use container-owned semantic gaps
- text-bearing app-tier controls and components should still align to the baseline grid
- any cap-based engine should be judged by whether it preserves that alignment with less complexity, not by whether it removes the requirement

### 4. Unresolved baseline-unit messaging

There is still a tension between the documents:

- the spacing spec says the default baseline unit is `4px`
- the typography article says the baseline unit varies by tier, with `8px` for editorial and applications and `4px` for documentation

That is not a blocker, but it means we should not blindly inherit the Canonical baseline-unit story until their cross-spec wording settles.

For now, `baseline-foundry` keeps its own baseline-unit values explicit and self-consistent: editorial 0.5rem (8px), documentation 0.25rem (4px), app 0.5rem (8px). These match the canonical configs.

## Updated recommendation for `baseline-foundry`

### Keep as-is

- editorial-first default
- non-zero nudges for text
- IBM Plex metric-driven token generation
- element-owned spacing in prose
- small primitive surface
- baseline alignment as a cross-tier invariant even when app layouts move semantic spacing ownership to containers

### Strong candidates for the next roadmap step

1. Replace the current general grid direction with a Canonical-inspired app-grid variant:
   - `4` / `8` / `16` columns
   - power-of-2 spans only
   - row gap equal to gutter for two-dimensional grids

2. Add explicit flow-boundary handling to prose:
   - automatic last-child reset
   - possibly the precision compensation variant for non-zero nudge contexts

3. Make the app-tier stance explicit in the runtime contract:
   - layout containers such as `bf-stack` can own semantic gaps
   - child controls and text still align to the baseline grid
   - the engine choice is about how that alignment is achieved, not whether it is required

4. Promote invariants into repo-level checks and docs:
   - substitutability
   - locality
   - no double spacing
   - grid alignment

5. Tighten the typography surface around the newer Canonical method:
   - fewer distinct sizes
   - clearer weight arithmetic
   - explicit measure guidance
   - heading spacing rules as layout policy

### If a second preset is added later

That is where the Canonical app tier becomes useful.

A future app preset could reasonably adopt:

- `14px` base size
- container-owned semantic gaps
- baseline-aligned controls and text via metrics nudges or cap-based alignment
- the `4` / `8` / `16` app grid
- panel/drawer-oriented layout rules

But that should be a second line, not the first product identity of this repo.

## Bottom line

The updated Canonical specs strengthen the case for `baseline-foundry`, but they also sharpen where it should evolve.

The repo should stay:

- baseline first
- editorial first
- IBM Plex based
- lean in primitive surface

But the newer Canonical work is now worth borrowing in three concrete ways:

1. stronger flow-boundary and invariant thinking
2. a stricter future app-grid model
3. a more disciplined typography philosophy centered on restraint, weight, and baseline multiples

That is a more useful and more actionable conclusion than the earlier review.
