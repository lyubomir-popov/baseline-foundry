/**
 * Vanilla Sites tab-section as a BF-native composition.
 *
 * This module retains the rendered layout contract from vf_tab_section while
 * deliberately leaving content assembly to HTML and BF's existing tabs
 * runtime. The section never interprets a content-block type: quote, logo,
 * divided-section and basic-section remain independent BF components.
 *
 * Vanilla → BF mapping:
 * - 1036px large-grid switch → the 64.75rem descendant container query.
 * - section boundaries → the parent stack selected by the composition.
 * - the intermediate p-section--shallow before a separate tab rail →
 *   a shallow gap owned by the tab-section body.
 * - 8-column 4/4 and 2/6 spans → intrinsic 1/1 and 1/3 tracks.
 *
 * Heading type and content rhythm remain owned by semantic BF elements. The
 * root establishes the container; every query styles descendants only.
 */
export function tabSectionCss(): string {
  return `/* ------------------------------------------------------------------ */
/* Sites tab section — structural layout over the existing BF tabs API. */
/* ------------------------------------------------------------------ */

:where(.bf-theme) :where(.bf-tab-section) {
  container-name: bf-tab-section;
  container-type: inline-size;
  margin: 0;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-tab-section-layout) {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-tab-section-rule) {
  grid-column: 1 / -1;
}

:where(.bf-theme) :where(.bf-tab-section-body) {
  --bf-stack-space: var(--bf-section-space-shallow);
  align-content: start;
  display: grid;
  gap: var(--bf-stack-space);
  grid-template-columns: minmax(0, 1fr);
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-tab-section-copy) {
  align-content: start;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-inline-size: 0;
  row-gap: 0;
}

:where(.bf-theme) :where(.bf-tab-section-header, .bf-tab-section-intro, .bf-tab-section-tabs) {
  min-inline-size: 0;
  overflow-wrap: anywhere;
}

:where(.bf-theme) :where(.bf-tab-section-tabs) {
  align-self: start;
}

@container bf-tab-section (width >= 64.75rem) {
  :where(.bf-theme) :where(.bf-tab-section-body) {
    column-gap: var(--bf-grid-gap-inline);
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  :where(.bf-theme) :where(.bf-tab-section-copy) {
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
  }

  /* With supporting copy or actions, Vanilla's heading row is 50/50 for all
     three section layouts. The following tab rail retains its own requested
     full, half or three-quarter span. */
  :where(.bf-theme) :where(.bf-tab-section-copy:has(> .bf-tab-section-intro)) > :where(.bf-tab-section-header) {
    grid-column: 1 / 3;
  }

  :where(.bf-theme) :where(.bf-tab-section-copy) > :where(.bf-tab-section-intro) {
    grid-column: 3 / -1;
  }

  :where(.bf-theme) :where(.bf-tab-section-body) > :where(.bf-tab-section-tabs) {
    grid-column: 1 / -1;
  }

  /* An unadorned 50/50 section lets auto-placement put the heading and tabs
     in the same row. If an intro exists, it occupies that right-hand cell and
     the tabs move to the following row, matching the upstream rendering. */
  :where(.bf-theme) :where(.bf-tab-section.is-50-50) :where(.bf-tab-section-copy:not(:has(> .bf-tab-section-intro))) {
    grid-column: 1 / 3;
    grid-row: 1;
  }

  :where(.bf-theme) :where(.bf-tab-section.is-50-50) :where(.bf-tab-section-copy:not(:has(> .bf-tab-section-intro))) + :where(.bf-tab-section-tabs) {
    grid-column: 3 / -1;
    grid-row: 1;
  }

  :where(.bf-theme) :where(.bf-tab-section.is-25-75) :where(.bf-tab-section-body) > :where(.bf-tab-section-tabs) {
    grid-column: 2 / -1;
  }
}
`;
}
