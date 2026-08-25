# Review: navigation-brand panel alignment

**Status:** Awaiting automated and Playwright review

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

Accept for release. The downstream editorial-tier review remains the final
proof that the recorded 4 px title/breadcrumb delta closes.
