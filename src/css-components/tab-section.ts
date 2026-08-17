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
 * - p-section / shallow / deep → BF section boundary tokens.
 * - the intermediate p-section--shallow before a separate tab rail →
 *   padding-block-start on that rail using --bf-section-space-shallow.
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
  margin-block-end: var(--bf-section-space);
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-tab-section.is-shallow) {
  margin-block-end: var(--bf-section-space-shallow);
}

:where(.bf-theme) :where(.bf-tab-section.is-deep) {
  margin-block-end: var(--bf-section-space-deep);
}

:where(.bf-theme) :where(.bf-tab-section-layout) {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-tab-section-rule) {
  grid-column: 1 / -1;
}

:where(.bf-theme) :where(.bf-tab-section-header, .bf-tab-section-intro, .bf-tab-section-tabs) {
  min-inline-size: 0;
  overflow-wrap: anywhere;
}

/* Vanilla wraps every tab rail except the unadorned 50/50 special case in a
   shallow section. This explicit composition padding does not change any
   child's semantic margins. */
:where(.bf-theme) :where(.bf-tab-section:not(.is-50-50)) > :where(.bf-tab-section-layout) > :where(.bf-tab-section-tabs),
:where(.bf-theme) :where(.bf-tab-section.is-50-50) > :where(.bf-tab-section-layout:has(> .bf-tab-section-intro)) > :where(.bf-tab-section-tabs) {
  padding-block-start: var(--bf-section-space-shallow);
}

@container bf-tab-section (width >= 64.75rem) {
  :where(.bf-theme) :where(.bf-tab-section) > :where(.bf-tab-section-layout) {
    column-gap: var(--bf-grid-gap-inline);
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  :where(.bf-theme) :where(.bf-tab-section) > :where(.bf-tab-section-layout) > :where(.bf-tab-section-header) {
    grid-column: 1 / -1;
  }

  /* With supporting copy or actions, Vanilla's heading row is 50/50 for all
     three section layouts. The following tab rail retains its own requested
     full, half or three-quarter span. */
  :where(.bf-theme) :where(.bf-tab-section-layout:has(> .bf-tab-section-intro)) > :where(.bf-tab-section-header) {
    grid-column: 1 / 3;
  }

  :where(.bf-theme) :where(.bf-tab-section) > :where(.bf-tab-section-layout) > :where(.bf-tab-section-intro) {
    grid-column: 3 / -1;
  }

  :where(.bf-theme) :where(.bf-tab-section) > :where(.bf-tab-section-layout) > :where(.bf-tab-section-tabs) {
    grid-column: 1 / -1;
  }

  /* An unadorned 50/50 section lets auto-placement put the heading and tabs
     in the same row. If an intro exists, it occupies that right-hand cell and
     the tabs move to the following row, matching the upstream rendering. */
  :where(.bf-theme) :where(.bf-tab-section.is-50-50) > :where(.bf-tab-section-layout) > :where(.bf-tab-section-header) {
    grid-column: 1 / 3;
  }

  :where(.bf-theme) :where(.bf-tab-section.is-50-50) > :where(.bf-tab-section-layout) > :where(.bf-tab-section-tabs) {
    grid-column: 3 / -1;
  }

  :where(.bf-theme) :where(.bf-tab-section.is-25-75) > :where(.bf-tab-section-layout) > :where(.bf-tab-section-tabs) {
    grid-column: 2 / -1;
  }
}
`;
}
