# Review: navigation-brand panel alignment

**Status:** Released and verified downstream

The downstream Registry measurement at 1280 × 960 recorded a tag at x=0, a
breadcrumb at x=256 (16 px inside the main panel), brand text bottom at 33.33
px, and breadcrumb text bottom at 37.33 px.

## Foundry evidence

- Build and 5,406 generated/build checks passed.
- Component behavior verification passed.
- The complete four-tier component baseline suite passed.
- Focused Playwright at 1280 × 960 measured the app-tier tag 24 px inside its
  panel, exactly matching `--bf-panel-padding-inline`; the tag remains 22 × 38
  px and its top still equals the panel top.
- The title consumes `matrix(1, 0, 0, 1, 0, 4)`.

## Downstream evidence

- Baseline Foundry was released on `main` at
  `454c7ae0d303c4cf364b786f356f00eacdf249f5` and its generated editorial
  bundle was vendored by Diagram Registry without a local `.bf-*` override.
- At 1280 × 960 in the Registry editorial tier, the Canonical tag is 16 px
  inside the navigation panel, exactly matching the opposing breadcrumb's
  panel inset.
- The brand title and current breadcrumb text ranges both run from y=18 px to
  y=37.33 px, closing the recorded 4 px baseline delta exactly.
- The Registry navigation, drawer, panel, and theme footer all end at y=960
  px. At 390 × 844, the open drawer, panel, and theme footer all end at y=844
  px.

Accepted and closed.
