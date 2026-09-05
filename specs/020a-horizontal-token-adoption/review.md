# Adversarial review request: Horizontal token adoption

Date: 2026-09-05

Status: ready for independent review; do not merge on this document alone.

Review range: `890c35372c9d85067bdc491825ce0d823d8a887e..HEAD` on
`feat/020a-horizontal-token-adoption`

Provider: design-tokens
`18f57b95b1aa1dfe85a45746016b055c807d6628`

Provider matrix SHA-256:
`97cffe22691cebbe29d786d2fbe10d04d014d412ed35ccaca386ca41e73bd571`

## Requested verdict

Return one of `merge`, `accept with required corrections`, or `do not merge`.
List P0/P1 blockers first. Please derive evidence from the branch rather than
trusting this request or the implementation's own assertions.

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
  inset counts, and continuation rails smaller than the tier's leading visual
  plus Canonical mark gap.
- Reassigns component/panel horizontal spacing to field, action,
  continuation, mark-gap, surface-inline or the quarter-rem inline unit.
  Explicit page/grid owners remain untouched.
- Adds a generated-CSS AST check for explicit `padding-inline*`,
  `margin-inline*`, `column-gap` and `inset-inline*` declarations. It runs 225
  assertions over each of eight emitted bundles and rejects `--bf-baseline` or
  `--bf-space-*` provenance in that bounded class.

## Deliberate and review-sensitive consequences

These are not hidden as "geometry unchanged":

1. The final Docs/App/OS component values visibly narrow the approved command
   and continuation rails. This is the purpose of 020a.
2. A one-character OS chip became narrower than its painted block and therefore
   circular. The implementation adds a paint-derived inline minimum to regular
   and nested chips so short text-bearing chips remain stadiums. It changes no
   block size, but it does reactivate block-derived inline geometry for this
   bounded case. Decide whether that is a valid invariant-preserving consequence
   or violates the 020a boundary.
3. Notification severity icons now use `--bf-leading-mark-size` and the shared
   Canonical mark gap rather than a fixed 1rem icon plus vertical `space-1`.
   This makes the visual and gap fit the authenticated continuation rail;
   verify that the smaller Docs/OS glyph is acceptable and that the 3px accent
   bar interaction is sound in LTR and RTL.
4. At the existing 768px App fixture, the narrower final rail leaves enough
   intrinsic width for the basic-section composition to remain two columns;
   the old matrix produced one. No breakpoint or grid/page token changed.
5. The standard side-navigation QA screenshot contains overlapping demo states.
   The landed-main screenshot from 2026-09-04 shows the same overlap, so it is
   recorded as pre-existing rather than repaired in this token contribution.

Fixed/content/block-derived `inline-size` uses remain explicit exemptions; so
do single-column or first-value vertical `gap` uses. The breadcrumb two-value
gap is asserted as vertical row gap plus horizontal Canonical mark gap.

## Evidence already run

From the isolated worktree on this branch:

- `npm test` — pass.
  - Build validation: 22,133 checks.
  - Canonical adapter invariant: 818 checks.
  - Horizontal-axis invariant: 225 checks in each of eight bundles (1,800).
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
- `git diff --check` — pass.

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
6. Search generated CSS semantically, not just textually. Are any explicit
   horizontal spacing declarations still baseline/`--bf-space-*` derived, and
   are the documented exemptions genuinely dimensions or block-axis gaps?
7. Measure the seven affected values in all four tiers, direct/class scopes,
   LTR/RTL, 1.25 root scaling and non-100% zoom. Are keylines exact and is there
   any horizontal overflow?
8. Red/green the new 1,800 horizontal-axis assertions by restoring representative
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
    unchanged from `890c353`, and that the 768px two-column App consequence is
    intrinsic rather than a hidden 020b change.
12. Confirm typography selectors—including the documented pre-existing `.os`
    reset asymmetry—are unchanged, and audit the diff for density, Pragma,
    release, publication or unrelated work.

## Landing gate

Do not merge until an independent reviewer returns no P0/P1 and resolves the
chip-floor and notification questions explicitly. No release or publication is
authorized by this package.
