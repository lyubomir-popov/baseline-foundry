/**
 * Small composition contracts for the first Vanilla Sites tranche.
 *
 * Vanilla's basic-section, cta-section and text-spotlight macros mostly
 * compose existing section, rule, heading, copy and CTA primitives. This is
 * intentionally not a macro compatibility layer: the styles below retain
 * only the repeated structural geometry found in their rendered output.
 *
 * Vanilla → BF mapping:
 * - 25/75 and 50/50 layouts use intrinsic one-/two-column grids and BF's
 *   existing gutter token instead of legacy span utility classes.
 * - Pattern internals use nested stack gaps; complete patterns use an outer
 *   section stack.
 * - Heading, paragraph, list, figure and CTA children retain only metric
 *   compensation.
 */
export function sitesFoundationCss(): string {
  return `/* ------------------------------------------------------------------ */
/* Sites composition foundation — basic section, CTA and text spotlight. */
/* ------------------------------------------------------------------ */

/* Basic section: the top rule and the named header/content slots make the
   composition legible without recreating the upstream Jinja item API. */
:where(.bf-theme) :where(.bf-basic-section) {
  container-name: bf-basic-section;
  container-type: inline-size;
  margin-block-end: 0;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-basic-section.is-shallow) {
  margin-block-end: 0;
}

:where(.bf-theme) :where(.bf-basic-section.is-deep) {
  margin-block-end: 0;
}

:where(.bf-theme) :where(.bf-basic-section-layout) {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-inline-size: 0;
  /* The rule already owns its half-rem trailing compensation. This structural
     grid must not add the generic pattern-stack gap on top of it. */
  row-gap: 0;
}

:where(.bf-theme) :where(.bf-basic-section-rule) {
  grid-column: 1 / -1;
}

:where(.bf-theme) :where(.bf-basic-section-header, .bf-basic-section-content) {
  min-inline-size: 0;
  overflow-wrap: anywhere;
}

/* A section title may be the route action without looking like body copy. */
:where(.bf-theme) :where(a.bf-basic-section-title-link, a.bf-basic-section-title-link:visited) {
  color: var(--bf-color-link-default);
  text-decoration: none;
}

:where(.bf-theme) :where(a.bf-basic-section-title-link:hover) {
  text-decoration: underline;
  text-decoration-thickness: var(--bf-border-width);
  text-underline-offset: 0.12em;
}

/* A balanced section switches at the shared readable 50/50 threshold. The
   layout descendant reacts to the root container; the query never tries to
   restyle the container that established it. */
@container bf-basic-section (width >= 48rem) {
  :where(.bf-theme) :where(.bf-basic-section-layout) {
    column-gap: var(--bf-grid-gap-inline);
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* Application chrome switches as one composition at the viewport boundary.
   The persistent navigation reduces the main allocation by its own width, so
   the intrinsic query alone would briefly stack this split while the rail was
   still visible. Keep the desktop split whenever application navigation is
   persistent; below 48rem the intrinsic base remains one column. */
@media (min-width: 48rem) {
  :where(.bf-theme.bf-application) > :where(.bf-main) :where(.bf-basic-section-layout),
  :where(.bf-theme) :where(.bf-application) > :where(.bf-main) :where(.bf-basic-section-layout) {
    column-gap: var(--bf-grid-gap-inline);
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* CTA section: Vanilla's 25/75 variant is an offset content rail. The full
   variant stays naturally full-width. Typography and action presentation are
   supplied by real heading elements and bf-cta-block. */
:where(.bf-theme) :where(.bf-cta-section) {
  container-name: bf-cta-section;
  container-type: inline-size;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-cta-section-layout) {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-cta-section-content) {
  --bf-stack-space: var(--bf-section-space-shallow);
  align-content: start;
  display: grid;
  gap: var(--bf-stack-space);
  min-inline-size: 0;
  overflow-wrap: anywhere;
}

:where(.bf-theme) :where(.bf-cta-section-copy) {
  min-inline-size: 0;
  overflow-wrap: anywhere;
}

@container bf-cta-section (width >= 64.75rem) {
  :where(.bf-theme) :where(.bf-cta-section.is-offset) :where(.bf-cta-section-layout) {
    column-gap: var(--bf-grid-gap-inline);
    grid-template-columns: minmax(0, 1fr) minmax(0, 3fr);
  }

  :where(.bf-theme) :where(.bf-cta-section.is-offset) :where(.bf-cta-section-content) {
    grid-column: 2;
  }
}

/* Text spotlight: a ruled title rail and two-to-seven prominent list items.
   The ordered list itself is structural; each item uses a genuine BF heading
   role and therefore keeps the correct tier-specific rhythm. */
:where(.bf-theme) :where(.bf-text-spotlight) {
  container-name: bf-text-spotlight;
  container-type: inline-size;
  margin-block-end: 0;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-text-spotlight-layout) {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-text-spotlight-rule) {
  grid-column: 1 / -1;
}

:where(.bf-theme) :where(.bf-text-spotlight-header, .bf-text-spotlight-content) {
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-text-spotlight-items) {
  align-content: start;
  display: grid;
  list-style: none;
  margin: 0;
  padding: 0;
}

:where(.bf-theme) :where(.bf-text-spotlight-item) {
  align-content: start;
  display: grid;
  min-inline-size: 0;
  overflow-wrap: anywhere;
}

:where(.bf-theme) :where(.bf-text-spotlight-item) > :where(a) {
  overflow-wrap: anywhere;
}

@container bf-text-spotlight (width >= 64.75rem) {
  :where(.bf-theme) :where(.bf-text-spotlight-layout) {
    column-gap: var(--bf-grid-gap-inline);
    grid-template-columns: minmax(0, 1fr) minmax(0, 3fr);
  }
}
`;
}
