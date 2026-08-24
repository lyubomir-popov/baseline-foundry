# Plan: application navigation geometry

## Implementation strategy

1. Give the desktop navigation drawer a definite 100% block size within the
   navigation grid area.
2. Remove collapsed headings, statuses, and fading regions from layout.
3. Keep collapsed labels as one-pixel, absolutely positioned accessible text.
4. Extend the existing application-layout browser behavior test with bottom
   edges, collapsed row heights, and accessible-name assertions.
5. Rebuild every public tier, validate generated contracts, run the full gates,
   and inspect the application-layout component.

## Public contract

No new class is introduced. The correction applies to the existing
`.bf-application > .bf-navigation > .bf-navigation-drawer` composition and its
`.is-collapsed` state.
