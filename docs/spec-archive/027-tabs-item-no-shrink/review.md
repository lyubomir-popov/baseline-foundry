# Review: Tabs item no-shrink

Date: 2026-09-30

Status: verified; merge into `main` authorized by the owner on 2026-09-30.

Range: `b58ca08..feat/027-tabs-item-no-shrink`

| Commit | Change |
|---|---|
| `7a601b6` | Diagram Registry contribution (was `7c57710`): `flex: 0 0 auto` on `bf-tabs-item` |
| `7ef2e04` | Comment trimmed to one short line |
| `d4d3d89` | Six-tab demo specimen, static contracts, four-tier rendered check |

## Container check

`bf-tabs-list` already declares `display: flex`, `overflow-x: auto`,
`white-space: nowrap` and `min-inline-size: 0`, and `bf-tabs` has
`min-inline-size: 0`. With the fix, page/component overflow stays 0 at 390px,
so no container change was needed. `is-equal` is a grid and is unaffected.

## Reproduction

Scratch harness (not committed): six tabs (Overview … Contributors) inside
`main` with 1rem padding, direct tier bundles, Chromium, DPR 1. "Before" serves
the built CSS with only the `bf-tabs-item` flex declaration stripped, which
equals main's output (`git diff main -- src` was otherwise empty). Overlap is
the largest amount one tab's box extends over the next.

Button tabs at 390px (list client width 358px):

| Tier | Before: scroll / overlap / clipped items | After: scroll / overlap / clipped |
|---|---|---|
| Editorial | 417 / 62.9px / 6 of 6 | 688 / 0 / 0 |
| Documentation | 398 / 42.1px / 6 of 6 | 578 / 0 / 0 |
| App | 398 / 42.1px / 6 of 6 | 578 / 0 / 0 |
| OS | 378 / 21.2px / 6 of 6 | 468 / 0 / 0 |

Before, the items shrank to 51–69px (for example, Editorial 52.3–68.2px against
content widths of 99.6–131.1px). Link tabs (`a.bf-tabs-link`) did not overlap
but clipped their own labels: 6 of 6 in Editorial, Documentation and App and
4 of 6 in OS. After the fix, both forms had 0 clipped links and 0 page overflow
in every tier.

At 1440px, all six item widths match before and after in every tier (for
example, Editorial 100.4/99.6/124/131.1/109.1/123.7px and OS
67.3/66.7/85/90.3/73.8/84.8px), so tabs that already fit do not change.

## Regression coverage

- `scripts/validate-build.ts`: `bf-tabs-item` has `flex: 0 0 auto`;
  `bf-tabs-list` has `overflow-x: auto` and `white-space: nowrap`.
- `scripts/verify-component-behavior.ts`: for each tier at 390px, the demo's
  six-tab list has overlap ≤ 0.5px, no item or link with
  `scrollWidth > clientWidth`, list scroll width greater than client width, and
  no overflow beyond the component's parent. End selects, focuses and scrolls
  the last tab into view with its 3px bar on the list rule; Home returns to the
  first tab.
- Red proof with the declaration removed from source and rebuilt:
  `test:build` failed on the new contract (`got []`), and `test:behavior`
  failed on the new check in Editorial (overlap 62.89px, all six labels
  clipped).

## Gates

| Gate | Result |
|---|---|
| `npm run build` | Pass |
| `npm test` | Pass: 24,266 static build checks; 332 tier surfaces with 5,442 baseline checks and 0 failures; component behavior passed |
| `npm run qa:components` | Pass: 86 captures; 332 surfaces with 5,442 checks and 0 failures |

The first `npm test` attempt, which piped output through `Tee-Object`, exited 1
during `test:behavior` and printed no assertion. A direct `test:behavior` run
and a full `npm test` rerun both passed. It was not reproduced, so this record
treats it as unexplained, not as a failing check.

## Browser review

Captured `tabs.png` at 2200px shows both specimens on one row with no visual
change to the original. Narrow captures at 390px (Editorial and OS) show the
list clipped at the container edge with whole labels. After End, the OS list
had scrolled to Contributors, which showed its focus ring. There were 0 console
errors.

## Unresolved

- Headless Chromium uses overlay scrollbars. On desktop platforms with classic
  scrollbars, the list's existing `overflow-x: auto` may show a scrollbar track
  under a long list. This behavior predates this fix, which does not change it.
  Scroll affordance styling is out of scope.
- When a tab is both active and focused, the focus ring (2px, inset) overlaps
  the 3px active bar. That also predates this fix and is unchanged.
