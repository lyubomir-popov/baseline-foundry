# Review: flush side-navigation composition

**Reviewed**: 2026-08-24

**Disposition**: Accepted for BF release; no merge-blocking defect found

## Required evidence

| Gate | Result |
|---|---|
| Vanilla ancestor comparison | Pass. Vanilla gives spacing ownership to headings/links/nesting and adds no padded wrapper around application side navigation. |
| Generated CSS | Pass. All seven public surfaces emit `.bf-panel-content.is-flush` with zero block/inline padding while the default retains panel padding. |
| Expanded navigation geometry | Pass. The active link reaches both content edges within 1px, retains a non-transparent background and inset highlight, keeps label inset, and adds exactly two baseline units at the nested level. |
| Default panel control | Pass. Ordinary main-panel content retains positive inline padding. |
| Application fill/gutter | Pass. `.bf-application.is-fill` resolves to the 960px dynamic viewport and keeps a 1.5rem application gutter under Editorial typography. |
| Typography regression | Pass. Element-owned selector checks and reciprocal H3/H6 browser behavior remain green. |
| `npm test` | Pass. Generated validation reports 5,301 checks; component baselines and the complete behavior suite pass. |
| `npm run qa:components` | Pass. All 88 component captures regenerated and every geometry/overflow record passed. |
| Rendered capture review | Pass for the regenerated application-layout shell with no visible clipping or structural regression. The capture's default state is collapsed; expanded edge evidence comes from the browser geometry gate. |
| In-app Browser | Unavailable: browser discovery returned no connected session. No unrelated browser backend was substituted. |

## Outcome

The fix lives in Baseline Foundry rather than Diagram Registry CSS. Consumers
opt into flush composition in markup, while panel defaults, panel scrolling,
side-navigation indentation, typography roles, and application layout behavior
remain source-owned and regression protected.

The previously isolated application viewport-fill/gutter commits were merged
on top of released Spec 002 before this implementation. The resulting BF
release line therefore contains the heading precedence repair that was absent
from Diagram Registry's prior vendored branch.

## Downstream verification

Diagram Registry pins released BF main commit
`8dd60de1085d9c0513cf4e62556e44a15c424a71` on
`feat/008-application-left-navigation` at `45f9ee9`. Its local CSS is unchanged;
the navigation adopts `bf-panel-content is-flush` in markup. Registry
validation, reader-link audit, Mermaid dependency integrity, 33 Python tests,
20 Node tests, JavaScript syntax, and local HTTP checks all passed.
