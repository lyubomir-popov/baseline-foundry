# Review: Site shell primitives

**Date**: 2026-08-27

**Disposition**: Accepted for release; no merge-blocking defect found.

## Evidence

- `npm test` passed, including 5,468 build-contract assertions, all four-tier
  baseline suites, and browser behavior verification.
- `npm run qa:components` rebuilt and captured the complete component set,
  then passed every baseline and overflow check.
- Browser behavior verifies that the main panel footer does not move when its
  content scrolls, the expanded navigation and main footers share their
  block-end edge and minimum height, and the start-aligned fixed-width row
  follows logical start in LTR and RTL.
- Browser behavior also verifies quiet/default and underlined/hover title-link
  states, keyboard-reachable narrow table overflow, and the white token inset
  on dark-theme media.
- Visual review of the application-layout, basic-section, table and hero
  captures found no overlap, clipping, rhythm, or theme-contrast regression.

## Consumer boundary

The release adds only reusable layout and presentation seams. Diagram
Registry remains responsible for gallery comparison states, Mermaid/editor
geometry, route data, iframe height, filter metadata and drop-zone state.
