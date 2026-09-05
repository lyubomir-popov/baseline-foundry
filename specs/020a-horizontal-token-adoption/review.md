# Review: Horizontal token adoption

Date: 2026-09-05

Status: independent verdict `merge`; P2 record/hardening corrections applied.

Review range: `890c35372c9d85067bdc491825ce0d823d8a887e..HEAD` on
`feat/020a-horizontal-token-adoption`

Provider: design-tokens
`18f57b95b1aa1dfe85a45746016b055c807d6628`

Provider matrix SHA-256:
`97cffe22691cebbe29d786d2fbe10d04d014d412ed35ccaca386ca41e73bd571`

## Independent verdict

**Merge. No P0/P1 blockers.** The reviewer independently authenticated the
provider and all 48 effective values, exercised digest laundering and authored
count drift, checked aliases/custom themes/page-grid isolation and measured the
chip and notification edge cases. The implementation was accepted; seven P2
record/hardening findings are captured below and corrected where in scope.

## Intended result

This is BF 020a only. It removes the seven-value compatibility overlay and
makes all 48 effective built-in spacing values equal the authenticated
Canonical artifact. The seven intended value changes are:

| Product | Fact | Before | Final |
|---|---|---:|---:|
| Docs | action inset | 1rem | 0.75rem |
| Docs | continuation inset | 2rem | 1.5rem |
| App | mark gap | 0.5rem | 0.25rem |
| App | action inset | 1rem | 0.75rem |
| App | continuation inset | 2rem | 1.5rem |
| OS | action inset | 1rem | 0.5rem |
| OS | continuation inset | 2rem | 1.25rem |

The Site/Editorial cells and the other five facts in each product retain their
previous values. Page margin, grid gutter, content padding, vertical rhythm,
typography, density, control height, root scaling and publication are out of
scope. Pragma is explicitly postponed and untouched.

## Implementation summary

- Deletes `config/canonical-spacing.compatibility-overlay.json` and every
  production option/validator/path that could apply it.
- Reads the authenticated provider product once for each built-in surface;
  `spacing` is a clone of `canonicalSpacing`, and built-in authoring must equal
  it point by point.
- Keeps the temporary `--bf-*` public names for their bounded deprecation
  window, but every one now aliases its corresponding `--spacing-*` property.
- Adds a positive `inlineUnitRem` and whole-count field/action/continuation,
  mark-gap and surface-inline inputs. All built-ins use `0.25rem`; block inputs
  remain baseline-unit counts.
- Rejects missing, fractional, negative and non-finite inline inputs, unordered
  inset counts, and continuation rails smaller than the fixed 1rem disclosure
  canvas plus Canonical mark gap.
- Reassigns component/panel horizontal spacing to field, action,
  continuation, mark-gap, surface-inline or the quarter-rem inline unit.
  Explicit page/grid owners remain untouched.
- Adds a generated-CSS AST check for logical and physical padding, margin and
  inset longhands, `left`/`right`, `column-gap`, and the `padding`/`margin`/
  `inset` shorthands. Shorthand operands are interpreted by axis. The audit
  rejects `--bf-baseline` or `--bf-space-*` provenance in inline operands and
  includes direct adversarial probes for shorthand and physical spellings.

## Deliberate and review-sensitive consequences

These are not hidden as "geometry unchanged":

1. The final Docs/App/OS component values visibly narrow the approved command
   and continuation rails. This is the purpose of 020a.
2. A one-character OS chip became narrower than its painted block and therefore
   circular. The accepted paint-derived inline minimum keeps short text-bearing
   chips stadium-shaped without changing block size, and is capped with
   `min(100%, …)` so a container narrower than the floor cannot be overflowed.
3. Notification severity icons use `--bf-leading-mark-size` and the shared
   Canonical mark gap. The review found a 1px Docs overlap between the 3px
   accent and 14px mark. The accent is now non-consuming paint that protrudes
   by the exact rail shortfall, preserving mark size, gap and text keyline with
   no overlap in LTR or RTL.
4. Across the roughly 768–779px App viewport band, the narrower final rail
   leaves enough intrinsic width for the basic-section composition to remain
   two columns; the old matrix produced one. At 768px the allocation changes
   from 608px to 624px against the unchanged 620px container threshold. No
   breakpoint or grid/page token changed.
5. The standard side-navigation QA screenshot contains overlapping demo states.
   The landed-main screenshot from 2026-09-04 shows the same overlap, so it is
   recorded in `TODO.md` as a separate pre-existing demo-capture defect rather
   than repaired inside token adoption.

Fixed/content/block-derived `inline-size` uses remain explicit exemptions; so
do single-column or first-value vertical `gap` uses. The breadcrumb two-value
gap is asserted as vertical row gap plus horizontal Canonical mark gap.

## Evidence already run

From the isolated worktree on this branch:

- `npm test` — pass.
  - Build validation: 24,029 checks.
  - Canonical adapter invariant: 818 checks.
  - Horizontal-axis invariant: 462 checks in the default bundle (including four
    direct adversarial parser probes) and 458 in each of the other seven
    bundles, 3,668 total.
  - Four-tier CSS/token parity: 516 checks.
  - Full component baseline suite: all named fixtures/tier probes passed.
  - Full browser behavior verification: passed.
- `npm run qa:components` — pass.
  - Rebuilt all outputs.
  - Captured 86 component screenshots.
  - Re-ran the complete component baseline suite with zero failures.
- Focused visual review at 1440 x 900:
  - `demo/spec/spacing-horizontal.html` in Editorial, Docs, App and OS.
  - `demo/components/notification.html` in Docs.
  - Field/action/continuation keylines remained aligned; no new overlap or
    clipping was observed.
- `git diff 890c353 --check` — pass after removing the original Markdown
  trailing-space/EOF defects.

The browser behavior suite also exercises all four tiers, LTR/RTL, changed
responsive widths, 1.25 root-font scaling, and the existing non-100% browser
zoom context. It checks direct/class surfaces, final matrix values, keyline
alignment, overflow, target/paint preservation and duplicate ownership.

## Adversarial questions

1. Independently authenticate the provider artifact and prove every effective
   built-in value equals the intended 4 x 12 matrix. Can any overlay or alternate
   option still change one of the seven points?
2. Mutate each of the 48 provider values and attempt digest laundering. Do both
   the integrity guard and the built-in authoring equality check have teeth?
3. Can any built-in `--bf-*` spacing alias still resolve to a literal or a
   different Canonical property? Do direct and class-scoped bundles disagree?
4. Do custom themes remain BF-only, without `canonicalSpacing` or unnamespaced
   `--spacing-*` declarations, while accepting the new inline authoring model?
5. Try missing, zero, negative, fractional, `NaN` and infinite inline units and
   counts. Also try field > action, action > continuation, and visual + mark gap
   > continuation. Does production fail before output?
6. Search generated CSS semantically, including logical and physical
   padding/margin/inset longhands, `left`/`right`, `column-gap`, and the inline
   operands of `padding`/`margin`/`inset` shorthands. Fixed/content-derived
   inline sizes and unused column operands on proven single-column grids are
   the bounded dimension/block-axis exemptions.
7. Measure the seven affected values in all four tiers, direct/class scopes,
   LTR/RTL, 1.25 root scaling and non-100% zoom. Are keylines exact and is there
   any horizontal overflow?
8. Red/green the horizontal-axis assertions by restoring representative
   baseline/space dependencies. Do they reject real regressions without merely
   asserting CSS initial values?
9. Attack the chip floor with empty, one-character, nested, bordered and
   borderless chips in every tier. Does it preserve stadium semantics without
   changing occupied block geometry or incorrectly turning ordinary labels into
   block-derived widths?
10. Inspect notification icons, accent bars, text starts and close-control
    clearance in every tier and direction. Is the shared leading-mark sizing the
    correct contract, or is it an impermissible component repair?
11. Confirm page/grid/content-padding declarations and computed values are
    unchanged from `890c353`, and that the 768–779px two-column App consequence
    is intrinsic rather than a hidden 020b change.
12. Confirm typography selectors—including the documented pre-existing `.os`
    reset asymmetry—are unchanged, and audit the diff for density, Pragma,
    release, publication or unrelated work.

## P2 findings and disposition

1. Audit missed shorthands/physical properties: fixed; the four shipped cases
   were migrated to inline owners and adversarial syntax probes were added.
2. Continuation guard modeled the control visual: fixed; it now models the
   actual fixed 1rem disclosure canvas, with an OS case that the old guard
   accepted and the new guard rejects.
3. Chip floor could beat `max-inline-size`: fixed with `min(100%, …)`.
4. Public config break was not called out: fixed in README and publishing docs;
   the first release containing 020a must be `0.2.0` or later. No release is
   authorized here.
5. `git diff --check` claim was false: Markdown whitespace/EOF defects fixed and
   the range-aware command recorded.
6. App consequence described one pixel: corrected to the measured 768–779px
   band and its 608/624/620px arithmetic.
7. Side-navigation capture overlap: confirmed pre-existing and placed in the
   unnumbered backlog as separate demo-fixture work.

## Landing gate

Satisfied by the independent `merge` verdict and the recorded P2 corrections.
No release or publication is authorized by this package.
