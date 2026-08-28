/**
 * Static Vanilla parity ports: data spotlight and divided section. The
 * 38.75rem and 64.75rem container thresholds preserve Vanilla's 620px and
 * 1036px composition changes while allowing the patterns to respond to their
 * allocated inline size.
 *
 * Vanilla → BF token mapping:
 * - `$spv--strip-shallow` (1.5rem) → `--bf-section-space-shallow`.
 * - Vanilla grid gutters → `--bf-grid-gap-inline`.
 * - Data-spotlight statistics and headlines → the public `h1` and `h3` roles.
 *   The slots own that mapping so consumers do not need companion utility
 *   classes to receive correct four-tier typography.
 */
export function staticContentPortsCss(): string {
  return `/* ------------------------------------------------------------------ */
/* Static content ports — Vanilla data spotlight and divided section. */
/* Their children retain role-owned rhythm; these layout */
/* wrappers add only structural columns, rules, and explicit section ends. */
/* ------------------------------------------------------------------ */

/* Data spotlight: Vanilla's equal-height wrap becomes an intrinsic grid.
   Each item begins with a public highlighted rule using the shared emphasis
   thickness. Item padding remains item-owned, so compositions never erase the
   shallow inter-row rhythm when the pattern narrows. */
:where(.bf-theme) :where(.bf-data-spotlight) {
  container-type: inline-size;
  margin-block-end: var(--bf-section-space);
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-data-spotlight-header) {
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-data-spotlight-items) {
  column-gap: var(--bf-grid-gap-inline);
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-data-spotlight-item) {
  min-inline-size: 0;
  overflow-wrap: anywhere;
}

:where(.bf-theme) :where(.bf-data-spotlight-item:not(:last-child)) {
  padding-block-end: var(--bf-section-space-shallow);
}

:where(.bf-theme) :where(.bf-data-spotlight-stat) {
  color: var(--bf-color-text-default);
  display: block;
  font-family: var(--bf-h1-font-family);
  font-size: var(--bf-h1-font-size);
  font-style: var(--bf-h1-font-style);
  font-variant-caps: var(--bf-h1-font-variant-caps);
  font-weight: var(--bf-h1-font-weight);
  letter-spacing: var(--bf-h1-letter-spacing);
  line-height: var(--bf-h1-line-height);
  margin-block: 0 var(--bf-h1-margin-bottom);
  overflow-wrap: anywhere;
  padding-block-end: 0;
  padding-block-start: var(--bf-h1-nudge-start);
  text-transform: var(--bf-h1-text-transform);
}

:where(.bf-theme) :where(.bf-data-spotlight-headline) {
  font-family: var(--bf-h3-font-family);
  font-size: var(--bf-h3-font-size);
  font-style: var(--bf-h3-font-style);
  font-variant-caps: var(--bf-h3-font-variant-caps);
  font-weight: var(--bf-h3-font-weight);
  letter-spacing: var(--bf-h3-letter-spacing);
  line-height: var(--bf-h3-line-height);
  margin-block: 0 var(--bf-h3-margin-bottom);
  min-inline-size: 0;
  padding-block-end: 0;
  padding-block-start: var(--bf-h3-nudge-start);
  text-transform: var(--bf-h3-text-transform);
}

:where(.bf-theme) :where(.bf-data-spotlight-description, .bf-data-spotlight-action) {
  min-inline-size: 0;
  overflow-wrap: anywhere;
}

:where(.bf-theme) :where(.bf-data-spotlight-action) {
  display: block;
  margin-block: 0 var(--bf-body-margin-bottom);
  padding-block-end: 0;
  padding-block-start: var(--bf-body-nudge-start);
}

/* Vanilla's tablet wrap has two equal items per row. For three items the
   in-grid title shares the first row; its first statistic owns the shallow
   row separation. Four items give both first-row statistics that separation. */
@container (width >= 38.75rem) {
  :where(.bf-theme) :where(.bf-data-spotlight-items) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  :where(.bf-theme) :where(.bf-data-spotlight-header, .bf-data-spotlight-item) {
    display: grid;
    grid-row: span 5;
    grid-template-rows: subgrid;
  }

  :where(.bf-theme) :where(.bf-data-spotlight-item) {
    padding-block-end: 0;
  }

  :where(.bf-theme) :where(.bf-data-spotlight.is-three-blocks) :where(.bf-data-spotlight-header) {
    block-size: 0;
    overflow: visible;
  }

  :where(.bf-theme) :where(.bf-data-spotlight.is-three-blocks) :where(.bf-data-spotlight-item:first-of-type),
  :where(.bf-theme) :where(.bf-data-spotlight.is-four-blocks) :where(.bf-data-spotlight-item:nth-child(-n + 2)) {
    padding-block-end: var(--bf-section-space-shallow);
  }
}

/* At Vanilla's large threshold the four stat blocks align in one row. Two
   blocks reserve the leading half for the overhanging title; three reserve a
   single leading column. The zero block-size matches Vanilla's height: 0
   title cell without hiding its readable text. */
@container (width >= 64.75rem) {
  :where(.bf-theme) :where(.bf-data-spotlight-items) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  :where(.bf-theme) :where(.bf-data-spotlight.is-two-blocks) :where(.bf-data-spotlight-header) {
    block-size: 0;
    grid-column: span 2;
    overflow: visible;
  }

  :where(.bf-theme) :where(.bf-data-spotlight.is-three-blocks) :where(.bf-data-spotlight-item:first-of-type),
  :where(.bf-theme) :where(.bf-data-spotlight.is-four-blocks) :where(.bf-data-spotlight-item:nth-child(-n + 2)) {
    padding-block-end: 0;
  }
}

/* Divided section: Vanilla's ruled 50/50 section is a one-column composition
   until the relevant container can support the split. The rule is structural;
   headings, copy, and content items keep their own metric-derived rhythm. */
:where(.bf-theme) :where(.bf-divided-section) {
  container-type: inline-size;
  margin-block-end: var(--bf-section-space);
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-divided-section-layout) {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-divided-section-rule) {
  grid-column: 1 / -1;
}

:where(.bf-theme) :where(.bf-divided-section-header, .bf-divided-section-content) {
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-divided-section-list) {
  --bf-stack-space: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

/* Preserve the pre-0.1.5 list markup; canonical composition also carries
   bf-stack so the container remains the explicit owner of item spacing. */
:where(.bf-theme) :where(.bf-divided-section-list:not(.bf-stack)) {
  align-content: start;
  display: grid;
  gap: var(--bf-stack-space);
}

:where(.bf-theme) :where(.bf-divided-section-item) {
  align-content: start;
  display: grid;
  min-inline-size: 0;
  overflow-wrap: anywhere;
  padding: 0;
  position: relative;
}

:where(.bf-theme) :where(.bf-divided-section-item + .bf-divided-section-item)::before {
  background: var(--bf-color-border-low-contrast);
  block-size: var(--bf-border-width);
  content: "";
  inset-block-start: calc(var(--bf-stack-space) / -2);
  inset-inline: 0;
  position: absolute;
}

@container (width >= 38.75rem) {
  :where(.bf-theme) :where(.bf-divided-section.is-split-medium) :where(.bf-divided-section-layout) {
    column-gap: var(--bf-grid-gap-inline);
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@container (width >= 64.75rem) {
  :where(.bf-theme) :where(.bf-divided-section) :where(.bf-divided-section-layout) {
    column-gap: var(--bf-grid-gap-inline);
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
`;
}
