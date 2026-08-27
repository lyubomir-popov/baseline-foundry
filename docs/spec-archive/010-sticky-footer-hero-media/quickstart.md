# Quickstart: Resilient Sticky Footer and Hero Media

```powershell
npm test
npm run qa:components
npm run demo:serve -- --host 127.0.0.1
```

## Sticky-footer review

Open `/demo/components/sticky-footer.html` and inspect each tier at 360 × 844 and 1280 × 900.

- The first application-hosted fixture has short content. Its footer meets the visible application-main block-end and does not cover the paragraph.
- The second fixture has long content and a `bf-site-main bf-panel-content` composition. Scroll the application main; every paragraph remains above the footer and the footer is fully reachable.
- Confirm there is no nested competing scrollbar, horizontal overflow, or console error.

## Hero review

Open `/demo/components/hero.html` and inspect each tier at 360 × 844 and 1280 × 900.

- The closing-media specimen keeps its lead and full-width figure inside one hero.
- The lead-to-figure gap resolves to `--bf-section-space-shallow` (24px in Editorial).
- The next specimen begins after the hero's existing exit boundary (64px in wide Editorial).
- The figure stays full-width with its caption, at narrow and wide sizes and in RTL.
- Existing paired-column, split-medium, and fallback fixtures are visually unchanged.
