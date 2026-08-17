/**
 * Fluid breakout layout, mapped from Vanilla's `vf-l-fluid-breakout`.
 *
 * This is a structural layout rather than a grid-utility compatibility layer.
 * Its three named regions retain Vanilla's useful geometry while consuming
 * BF's page, gutter and content-width contracts:
 *
 * - 14rem logical asides flank a centre bounded by
 *   `--bf-content-max-width`;
 * - the main region spans the centre and one aside by default;
 * - source order selects a start or end aside without physical-direction
 *   classes, so the same markup mirrors correctly in RTL;
 * - cards/items auto-fit from Vanilla's 13rem minimum;
 * - the 620px toolbar and 1036px three-track transitions are retained.
 *
 * No descendant spacing is reset. Headings, copy, tables and cards therefore
 * keep their own tier-specific baseline compensation and semantic rhythm.
 */
interface FluidBreakoutCssOptions {
  contentMaxWidth: string;
  surfaces?: Array<{
    className?: string;
    contentMaxWidth: string;
  }>;
}

function paddingTransferCss(themeSelector: string, contentMaxWidth: string): string {
  return `@media (width >= calc(${contentMaxWidth} + 14rem)) {
  ${themeSelector} :where(.bf-fluid-breakout) {
    padding-inline: 0;
  }

  ${themeSelector} :where(.bf-fluid-breakout-main) {
    padding-inline: max(var(--bf-page-margin), var(--bf-content-padding-inline));
  }

  ${themeSelector} :where(.bf-fluid-breakout-aside) {
    padding-inline-end: 0;
    padding-inline-start: max(var(--bf-page-margin), var(--bf-content-padding-inline));
  }

  ${themeSelector} :where(.bf-fluid-breakout-main + .bf-fluid-breakout-aside) {
    padding-inline-end: max(var(--bf-page-margin), var(--bf-content-padding-inline));
    padding-inline-start: 0;
  }

  ${themeSelector} :where(.bf-fluid-breakout-toolbar) {
    margin-inline: max(var(--bf-page-margin), var(--bf-content-padding-inline));
  }
}`;
}

export function fluidBreakoutCss(options: FluidBreakoutCssOptions): string {
  const surfaces = (options.surfaces ?? []).filter(surface => surface.className);
  const tierExclusions = surfaces.map(surface => `:not(.${surface.className})`).join("");
  const baseThemeSelector = `:where(.bf-theme${tierExclusions})`;
  const paddingTransferQueries = [
    paddingTransferCss(baseThemeSelector, options.contentMaxWidth),
    ...surfaces.map(surface => paddingTransferCss(`:where(.bf-theme.${surface.className})`, surface.contentMaxWidth))
  ].join("\n\n");

  return `/* ------------------------------------------------------------------ */
/* Fluid breakout — bounded centre with two intrinsic aside tracks.    */
/* ------------------------------------------------------------------ */

:where(.bf-theme) :where(.bf-fluid-breakout) {
  --bf-fluid-breakout-aside-width: 14rem;
  --bf-fluid-breakout-item-min-width: 13rem;
  display: block;
  inline-size: 100%;
  min-inline-size: 0;
  padding-inline: max(var(--bf-page-margin), var(--bf-content-padding-inline));
}

:where(.bf-theme) :where(.bf-fluid-breakout-main) {
  column-gap: var(--bf-grid-gap-inline);
  display: grid;
  grid-row: 2;
  grid-template-columns: repeat(auto-fit, minmax(min(var(--bf-fluid-breakout-item-min-width), 100%), 1fr));
  inline-size: 100%;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-fluid-breakout-item, .bf-fluid-breakout-aside) {
  min-inline-size: 0;
}

/* Dense tables and diagrams may keep an intrinsic width wider than their
   assigned track. The opt-in modifier contains that width locally instead of
   turning the whole page into a horizontal scroller. */
:where(.bf-theme) :where(.bf-fluid-breakout-item.is-scrollable) {
  max-inline-size: 100%;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
}

:where(.bf-theme) :where(.bf-fluid-breakout-aside) {
  grid-row: 2 / 100;
}

/* The toolbar owns only its separation from the content row. Its controls
   retain their normal occupied-block and focus contracts. */
:where(.bf-theme) :where(.bf-fluid-breakout-toolbar) {
  margin-block-end: var(--bf-space-2);
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-fluid-breakout-toolbar-items) {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  inline-size: min(100%, var(--bf-fluid-breakout-item-min-width));
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-fluid-breakout-toolbar-item) {
  align-items: center;
  display: flex;
  min-inline-size: 0;
}

@media (width >= 38.75rem) {
  :where(.bf-theme) :where(.bf-fluid-breakout-toolbar-items) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    inline-size: 100%;
  }

  :where(.bf-theme) :where(.bf-fluid-breakout-toolbar-item:nth-child(2)) {
    justify-content: flex-end;
  }
}

@media (width >= 64.75rem) {
  :where(.bf-theme) :where(.bf-fluid-breakout) {
    display: grid;
    grid-template-columns:
      minmax(var(--bf-fluid-breakout-aside-width), 1fr)
      minmax(0, var(--bf-content-max-width))
      minmax(var(--bf-fluid-breakout-aside-width), 1fr);
    grid-template-rows: auto;
    margin-inline: auto;
    max-inline-size: calc((2 * var(--bf-fluid-breakout-aside-width)) + var(--bf-content-max-width));
  }

  :where(.bf-theme) :where(.bf-fluid-breakout-main) {
    grid-column: auto / span 2;
  }

  :where(.bf-theme) :where(.bf-fluid-breakout-main.is-no-aside) {
    grid-column: 2 / span 2;
  }

  :where(.bf-theme) :where(.bf-fluid-breakout-main.is-full-width) {
    grid-column: 1 / -1;
  }

  /* A start aside appears before main in source order. An end aside appears
     after it. Logical padding keeps that relationship direction-safe. */
  :where(.bf-theme) :where(.bf-fluid-breakout-aside) {
    padding-inline-end: max(var(--bf-page-margin), var(--bf-content-padding-inline));
  }

  :where(.bf-theme) :where(.bf-fluid-breakout-main + .bf-fluid-breakout-aside) {
    padding-inline-end: 0;
    padding-inline-start: max(var(--bf-page-margin), var(--bf-content-padding-inline));
  }

  :where(.bf-theme) :where(.bf-fluid-breakout-toolbar) {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns:
      minmax(var(--bf-fluid-breakout-aside-width), 1fr)
      minmax(0, var(--bf-content-max-width))
      minmax(var(--bf-fluid-breakout-aside-width), 1fr);
    grid-template-rows: auto;
    min-inline-size: 0;
  }

  :where(.bf-theme) :where(.bf-fluid-breakout-toolbar-items) {
    grid-column: 2 / -1;
  }
}

/* Vanilla transfers its outer margin into the inner regions once the viewport
   can hold the bounded centre plus one 14rem aside. The generated thresholds
   follow each tier's actual BF content maximum rather than assuming the
   editorial 90rem measure for documentation or OS. */
${paddingTransferQueries}
`;
}
