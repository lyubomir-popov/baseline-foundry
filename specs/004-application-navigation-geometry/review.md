# Review: application navigation geometry

**Status**: Released and verified downstream

## Required evidence

| Gate | Result |
|---|---|
| Desktop bottom-edge geometry | Passed at 1280 × 960; drawer, panel and navigation bottoms agree within 0.001 px |
| Collapsed row geometry | Passed; top-level rows are 32 px against a 32 px compact minimum |
| Accessible collapsed link names | Passed; Dashboard remains discoverable by exact role/name |
| Generated validation | Passed: 5,366 checks |
| Build | Passed |
| Focused responsive browser behavior | Passed at 1280 × 960 and 390 × 844 |
| Relevant visual captures | Passed expanded and collapsed application-layout review |
| Diagram Registry consumer verification | Passed on `feat/008-application-left-navigation` at `f90bc1b` |

## Implementation evidence

- Desktop `.bf-navigation-drawer` now owns `block-size: 100%` at the pinned
  application-layout breakpoint, so its panel can reach the application bottom.
- Collapsed headings, status regions, and explicitly fading regions use
  `display: none` and therefore contribute no row height.
- Collapsed `.bf-side-navigation-label` remains in the accessibility tree as a
  one-pixel absolutely positioned visually-hidden label, preserving the link's
  accessible name without wrapping inside the compact row.
- `scripts/verify-component-behavior.ts` checks bottom-edge agreement, compact
  top-level row heights, and the collapsed Dashboard link name.

The first browser discovery attempt found no connected instance. A Chrome
session subsequently became available, so the focused checks were run through
the supported Playwright surface. At 390 × 844 the 240 px overlay opened with
`aria-hidden="false"`, and Escape restored the collapsed state and
`aria-expanded="false"`.

Released from `feat/004-application-navigation-geometry` to BF `main` at
`f249a8a12cfa13ddeece4a83861fbd5b859d698e`. Diagram Registry vendors that
immutable generated editorial bundle without local `.bf-*` CSS. Consumer
Playwright review confirmed 240 px expanded width, 48 px collapsed width,
32 px collapsed rows, exact viewport-bottom alignment at 1280 × 960 and
390 × 844, synchronized light/dark surfaces, and no console errors.
