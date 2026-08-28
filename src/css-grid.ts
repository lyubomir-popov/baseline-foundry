export function gridCss(appScopes: string[] = [":where(.bf-theme.bf-tier-app)"]): string {
  const spanRule = (span: number, indent = ""): string =>
    `${indent}:where(.bf-theme) :where(.bf-grid) > :where(.bf-span-${span}) { grid-column: auto / span ${span}; }`;
  const appPageSelectors = appScopes.map(scope => `${scope} :where(.bf-page)`).join(",\n");
  const appPageRule = appPageSelectors
    ? `${appPageSelectors} {\n  max-inline-size: none;\n}`
    : "";

  const baseSpans = [1, 2, 4].map(span => spanRule(span)).join("\n");
  const mediumSpans = [1, 2, 4, 8].map(span => spanRule(span, "  ")).join("\n");
  const largeSpans = [1, 2, 4, 8, 16].map(span => spanRule(span, "  ")).join("\n");

  return `/* ------------------------------------------------------------------ */
/* Gutter and margin escalation — viewport-based, all tiers            */
/* Grid spec v0.3 §2.3: gutters set by global viewport breakpoint.     */
/* Baseline Foundry models the spec's 460px x-small row as part of the */
/* default <620px bracket because the values do not change at 460px.   */
/* ------------------------------------------------------------------ */

:where(.bf-theme) {
  --bf-grid-gap-inline: 1rem;
  --bf-grid-gap-block: 1rem;
  --bf-page-margin: 1rem;
}

@media (width >= 38.75rem) {
  :where(.bf-theme) {
    --bf-grid-gap-inline: 1.5rem;
    --bf-grid-gap-block: 1.5rem;
    --bf-page-margin: 1.5rem;
  }
}

@media (width >= 64.75rem) {
  :where(.bf-theme) {
    --bf-grid-gap-inline: 2rem;
    --bf-grid-gap-block: 2rem;
    --bf-page-margin: 2rem;
  }

  :where(.bf-theme.bf-tier-app) {
    --bf-grid-gap-inline: 1.5rem;
    --bf-grid-gap-block: 1.5rem;
  }

  :where(.bf-theme) :where(.bf-application),
  :where(.bf-theme):where(.bf-application) {
    --bf-grid-gap-inline: 1.5rem;
    --bf-grid-gap-block: 1.5rem;
  }
}

/* ------------------------------------------------------------------ */
/* Container query contexts                                            */
/*                                                                     */
/* All tiers use container queries for column switching. In editorial   */
/* and docs, .bf-page is the single grid container — centered and      */
/* capped at --bf-content-max-width — so the container width mirrors   */
/* the viewport (spec §3: "viewport-based grid"). In app tier,         */
/* .bf-page is fluid (no max-width) and multiple concurrent containers */
/* can each establish their own grid context (spec §5).                */
/* ------------------------------------------------------------------ */

:where(.bf-theme) :where(.bf-page, .bf-grid-scope, .bf-section, .bf-strip, .bf-fixed-width, .bf-panel-content, .bf-accordion-panel, .bf-main, .bf-aside),
:where(.bf-theme):where(.bf-page, .bf-grid-scope, .bf-section, .bf-strip, .bf-fixed-width, .bf-panel-content, .bf-accordion-panel, .bf-main, .bf-aside) {
  container-type: inline-size;
}

/* ------------------------------------------------------------------ */
/* Page-level layout                                                   */
/* Editorial/docs: centered + max-width (spec §3.2)                    */
/* App: fluid edge-to-edge (spec §5.2)                                 */
/* ------------------------------------------------------------------ */

:where(.bf-theme) :where(.bf-fixed-width) {
  margin-inline: auto;
  max-inline-size: var(--bf-content-max-width);
  padding-inline: max(var(--bf-page-margin), var(--bf-content-padding-inline));
  width: 100%;
}

/* Keep a capped content row at the logical start of a wider panel. */
:where(.bf-theme) :where(.bf-fixed-width.is-start-aligned) {
  margin-inline-end: auto;
  margin-inline-start: 0;
}

${appPageRule}

:where(.bf-theme) :where(.bf-panel-content, .bf-accordion-panel) :where(.bf-fixed-width) {
  padding-inline: 0;
}

:where(.bf-theme) :where(.bf-grid) :where(.bf-fixed-width) {
  padding-inline: 0;
}

/* ------------------------------------------------------------------ */
/* Grid base — 4 columns, all tiers                                    */
/* ------------------------------------------------------------------ */

:where(.bf-theme) :where(.bf-grid) {
  --bf-grid-columns: 4;
  display: grid;
  /* bf-grid keeps row-gap at 0; the block token stays available for */
  /* two-dimensional layouts and other structural layout-gap cases. */
  gap: 0 var(--bf-grid-gap-inline);
  grid-template-columns: repeat(var(--bf-grid-columns), minmax(0, 1fr));
}

:where(.bf-theme) :where(ul.bf-grid, ol.bf-grid) {
  list-style: none;
  margin: 0;
  padding: 0;
}

:where(.bf-theme) :where(.bf-grid.is-guide) > * {
  background: color-mix(in srgb, var(--bf-color-accent) 18%, var(--bf-color-background-default));
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--bf-color-accent) 50%, var(--bf-color-rule));
  min-block-size: calc(var(--bf-baseline) * 4);
}

:where(.bf-theme) :where(.bf-grid) > * {
  grid-column: auto / span var(--bf-grid-columns);
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-grid.bf-grid.is-controls) {
  container-type: inline-size;
  gap: var(--bf-field-gap);
}

:where(.bf-theme) :where(.bf-grid.bf-grid.is-controls) > :where(.bf-grid-item.is-control, .bf-grid-item.is-control-pair) {
  grid-column: auto / span 4;
}

${baseSpans}

/* ------------------------------------------------------------------ */
/* Container-based column switching — all tiers                        */
/* Editorial/docs containers are .bf-page (centered, max-width), so    */
/* container width tracks viewport. App containers can be any layout   */
/* region (panels, drawers, main area).                                */
/* ------------------------------------------------------------------ */

@container (width >= 38.75rem) {
  :where(.bf-theme) :where(.bf-grid) {
    --bf-grid-columns: 8;
  }

  :where(.bf-theme) :where(.bf-grid.bf-grid.is-controls) > :where(.bf-grid-item.is-control) {
    grid-column: auto / span 2;
  }

  :where(.bf-theme) :where(.bf-grid.bf-grid.is-controls) > :where(.bf-grid-item.is-control-pair) {
    grid-column: auto / span 4;
  }

${mediumSpans}
}

@container (width >= 105.0625rem) {
  :where(.bf-theme) :where(.bf-grid) {
    --bf-grid-columns: 16;
  }

  :where(.bf-theme) :where(.bf-grid.bf-grid.is-controls) > :where(.bf-grid-item.is-control) {
    grid-column: auto / span 4;
  }

  :where(.bf-theme) :where(.bf-grid.bf-grid.is-controls) > :where(.bf-grid-item.is-control-pair) {
    grid-column: auto / span 8;
  }

${largeSpans}
}

/* Full span follows every generated numbered-span rule so normal cascade
 * order is sufficient; consumers never need cascade escalation. */
:where(.bf-theme) :where(.bf-grid) > :where(.bf-span-full) {
  grid-column: 1 / -1;
}
`;
}
