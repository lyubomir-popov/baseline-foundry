export function tieredListEqualHeightRowCss(): string {
  return `/* ------------------------------------------------------------------ */
/* Tiered list                                                         */
/* Editorial pattern (Vanilla parity): paired list of titles +         */
/* descriptions under a top-level title + description, with optional   */
/* CTA. Vanilla uses media queries at tablet/desktop; Baseline Foundry */
/* uses container queries on the pattern itself so the layout reacts   */
/* to its own width (panels, drawers, narrow main areas) instead of    */
/* the viewport. Stack gaps own semantics; text keeps compensation.    */
/* ------------------------------------------------------------------ */

:where(.bf-theme) :where(.bf-tiered-list) {
  container-type: inline-size;
  display: grid;
  gap: var(--bf-section-space-shallow);
}

:where(.bf-theme) :where(.bf-tiered-list-items) {
  display: grid;
  gap: var(--bf-section-space-shallow);
}

:where(.bf-theme) :where(.bf-tiered-list-header),
:where(.bf-theme) :where(.bf-tiered-list-item),
:where(.bf-theme) :where(.bf-tiered-list-cta) {
  column-gap: var(--bf-grid-gap-inline);
  display: grid;
  grid-template-columns: minmax(0, 1fr);
}

/* Consumer-proven compact rows. These are deliberately independent of the
   editorial hanging-indent composition below: flush rows describe a plain
   two-slot datum while triple rows add a named intermediate role. */
:where(.bf-theme) :where(.bf-tiered-list.is-flush, .bf-tiered-list.is-triple) :where(.bf-tiered-list-item) {
  align-items: start;
  grid-template-columns: minmax(0, 1fr);
}

:where(.bf-theme) :where(.bf-tiered-list-item-label, .bf-tiered-list-item-role, .bf-tiered-list-item-value) {
  display: block;
  font-family: var(--bf-body-font-family);
  font-size: var(--bf-body-font-size);
  font-style: var(--bf-body-font-style);
  font-weight: var(--bf-body-font-weight);
  line-height: var(--bf-body-line-height);
  margin-block: 0 var(--bf-body-margin-bottom);
  min-inline-size: 0;
  overflow-wrap: anywhere;
  padding-block-end: 0;
  padding-block-start: var(--bf-body-nudge-start);
}

:where(.bf-theme) :where(.bf-tiered-list-item-role) {
  color: var(--bf-color-text-muted);
}

:where(.bf-theme) :where(ol.bf-tiered-list, ul.bf-tiered-list, ol.bf-tiered-list-items, ul.bf-tiered-list-items) {
  list-style: none;
  margin: 0;
  padding: 0;
}

:where(.bf-theme) :where(.bf-tiered-list-header) > :where(.bf-rule),
:where(.bf-theme) :where(.bf-tiered-list-item) > :where(.bf-rule),
:where(.bf-theme) :where(.bf-tiered-list-cta) > :where(.bf-rule) {
  grid-column: 1 / -1;
}

/* ------------------------------------------------------------------ */
/* Medium container (≥ 38.75rem): items use BF’s 8-column grid with a  */
/* hanging indent. Vanilla: title col 3 / span 2, description col 5 / */
/* span 4. The rule above each item starts at col 3 to match.         */
/* ------------------------------------------------------------------ */
@container (width >= 38.75rem) {
  :where(.bf-theme) :where(.bf-tiered-list:not(.is-list-full-width):not(.is-flush):not(.is-triple)) :where(.bf-tiered-list-item),
  :where(.bf-theme) :where(.bf-tiered-list:not(.is-list-full-width):not(.is-flush):not(.is-triple)) :where(.bf-tiered-list-cta) {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }

  :where(.bf-theme) :where(.bf-tiered-list:not(.is-list-full-width):not(.is-flush):not(.is-triple)) :where(.bf-tiered-list-item) > :where(.bf-rule),
  :where(.bf-theme) :where(.bf-tiered-list:not(.is-list-full-width):not(.is-flush):not(.is-triple)) :where(.bf-tiered-list-cta) > :where(.bf-rule) {
    grid-column: 3 / span 6;
  }

  :where(.bf-theme) :where(.bf-tiered-list:not(.is-list-full-width):not(.is-flush):not(.is-triple)) :where(.bf-tiered-list-item-title) {
    grid-column: 3 / span 2;
  }

  :where(.bf-theme) :where(.bf-tiered-list:not(.is-list-full-width):not(.is-flush):not(.is-triple)) :where(.bf-tiered-list-item-description),
  :where(.bf-theme) :where(.bf-tiered-list:not(.is-list-full-width):not(.is-flush):not(.is-triple)) :where(.bf-tiered-list-cta-block) {
    grid-column: 5 / span 4;
  }
}

/* ------------------------------------------------------------------ */
/* Header split (≥ 64.75rem): unchanged 50/50 title/description.       */
/* ------------------------------------------------------------------ */
@container (width >= 64.75rem) {
  :where(.bf-theme) :where(.bf-tiered-list:not(.is-description-full-width)) :where(.bf-tiered-list-header) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
}

/* ------------------------------------------------------------------ */
/* Equal-height row (Vanilla parity).                                  */
/* Cross-column row alignment via CSS subgrid: each column is a 4-row  */
/* subgrid so items at the same vertical position across columns share */
/* the same baseline (e.g. icon row, title row, description row,       */
/* trailing list row). Vanilla uses media queries; BF uses container   */
/* queries on the row itself so the layout reacts to its own width.    */
/* Optional cross-column dividers via .is-divider-1 / -2 / -3 mirror   */
/* Vanilla’s has-divider-N modifiers (renamed for the BF is-* rule).   */
/* ------------------------------------------------------------------ */
:where(.bf-theme) :where(.bf-equal-height-row) {
  container-type: inline-size;
  display: grid;
  gap: var(--bf-grid-gap-block) var(--bf-grid-gap-inline);
  /* Keep the logical track system on the query container itself. Container
     queries cannot style their own container, so responsive descendants span
     these tracks instead of relying on an ineligible self-query. */
  grid-template-columns: repeat(8, minmax(0, 1fr));
  margin: 0;
  position: relative;
}

:where(.bf-theme) :where(.bf-equal-height-row-col) {
  border-block-start: var(--bf-border-width) solid var(--bf-color-border-low-contrast);
  display: grid;
  grid-column: 1 / -1;
  grid-row: span 4;
  grid-template-rows: subgrid;
  margin-block-end: var(--bf-space-1);
  position: relative;
}

/* Responsive aspect media can make a shared subgrid track land between
   baselines. Snap that media box itself; the surrounding composition still
   does not own or erase any child's semantic margins. */
@supports (block-size: calc-size(auto, round(up, size, 1px))) {
  :where(.bf-theme) :where(.bf-equal-height-row-item) > :where(.bf-aspect) {
    block-size: calc-size(auto, round(up, size, var(--bf-baseline)));
  }
}

:where(.bf-theme) :where(.bf-equal-height-row-col.is-borderless) {
  border-block-start: 0;
}

@container (width >= 38.75rem) {
  :where(.bf-theme) :where(.bf-equal-height-row-col) {
    grid-column: span 8;
    grid-template-columns: subgrid;
  }

  :where(.bf-theme) :where(.bf-equal-height-row-col) > :where(.bf-equal-height-row-item) {
    grid-column: span 4;
  }

  :where(.bf-theme) :where(.bf-equal-height-row-col) > :where(.bf-equal-height-row-item):first-child {
    grid-row: span 100;
  }

  :where(.bf-theme) :where(.bf-equal-height-row.is-wrap) :where(.bf-equal-height-row-col) {
    grid-column: span 4;
    grid-template-columns: none;
  }

  :where(.bf-theme) :where(.bf-equal-height-row.is-wrap) :where(.bf-equal-height-row-col) > :where(.bf-equal-height-row-item) {
    grid-column: auto;
  }

  :where(.bf-theme) :where(.bf-equal-height-row.is-wrap) :where(.bf-equal-height-row-col) > :where(.bf-equal-height-row-item):first-child {
    grid-row: auto;
  }
}

@container (width >= 64.75rem) {
  :where(.bf-theme) :where(.bf-equal-height-row-col) {
    border-block-start: 0;
    grid-column: span 2;
    margin-block-end: 0;
  }
}

/* The Sites equal-heights composition constrains two-item groups to the
   trailing half of the large grid and three-item groups to its trailing
   three quarters. These modifiers preserve those rendered proportions while
   keeping the existing equal-height row as the single alignment primitive. */
@media (width >= 64.75rem) {
  :where(.bf-theme) :where(.bf-equal-height-row.is-columns-2) {
    inline-size: calc(50% - (var(--bf-grid-gap-inline) / 2));
    margin-inline-start: auto;
  }

  :where(.bf-theme) :where(.bf-equal-height-row.is-columns-2) :where(.bf-equal-height-row-col) {
    grid-column: span 4;
  }

  :where(.bf-theme) :where(.bf-equal-height-row.is-columns-3) {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    inline-size: calc(75% - (var(--bf-grid-gap-inline) / 4));
    margin-inline-start: auto;
  }

  :where(.bf-theme) :where(.bf-equal-height-row.is-columns-3) :where(.bf-equal-height-row-col) {
    grid-column: span 2;
  }
}

/* Cross-column dividers — Vanilla pattern uses a single ::before for   */
/* divider-1 and a single ::after for divider-2; the third divider     */
/* falls back onto whichever pseudo is still available.                */
:where(.bf-theme) :where(.bf-equal-height-row.is-divider-1)::before,
:where(.bf-theme) :where(.bf-equal-height-row.is-divider-2)::after,
:where(.bf-theme) :where(.bf-equal-height-row.is-divider-3:not(.is-divider-1))::before,
:where(.bf-theme) :where(.bf-equal-height-row.is-divider-3:not(.is-divider-2))::after {
  background-color: var(--bf-color-border-low-contrast);
  block-size: 1px;
  content: "";
  display: none;
  grid-column: 1 / -1;
  inset-inline: 0;
  margin: auto;
  position: absolute;
}

@container (width >= 64.75rem) {
  :where(.bf-theme) :where(.bf-equal-height-row.is-divider-1)::before,
  :where(.bf-theme) :where(.bf-equal-height-row.is-divider-2)::after,
  :where(.bf-theme) :where(.bf-equal-height-row.is-divider-3:not(.is-divider-1))::before,
  :where(.bf-theme) :where(.bf-equal-height-row.is-divider-3:not(.is-divider-2))::after {
    display: block;
  }
}

:where(.bf-theme) :where(.bf-equal-height-row.is-divider-1)::before {
  grid-row: 2;
}

:where(.bf-theme) :where(.bf-equal-height-row.is-divider-2)::after {
  grid-row: 3;
}

:where(.bf-theme) :where(.bf-equal-height-row.is-divider-3:not(.is-divider-1))::before,
:where(.bf-theme) :where(.bf-equal-height-row.is-divider-3:not(.is-divider-2))::after,
:where(.bf-theme) :where(.bf-equal-height-row.is-divider-3:not(.is-divider-1):not(.is-divider-2))::before {
  grid-row: 4;
}

:where(.bf-theme) :where(.bf-equal-height-row.is-divider-3:not(.is-divider-1):not(.is-divider-2))::after {
  display: none;
}

/* Flush and triple rows remain intrinsic at narrow widths, then gain their
   aligned slots only when their own container has room. */
@container (width >= 32rem) {
  :where(.bf-theme) :where(.bf-tiered-list.is-flush) :where(.bf-tiered-list-item) {
    grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
  }

  :where(.bf-theme) :where(.bf-tiered-list.is-flush) :where(.bf-tiered-list-item-label, .bf-tiered-list-item-title) {
    grid-column: 1;
  }

  :where(.bf-theme) :where(.bf-tiered-list.is-flush) :where(.bf-tiered-list-item-value, .bf-tiered-list-item-description) {
    grid-column: 2;
  }

  :where(.bf-theme) :where(.bf-tiered-list.is-triple) :where(.bf-tiered-list-item) {
    grid-template-columns: minmax(0, 2fr) minmax(0, 2fr) minmax(0, 3fr);
  }

  :where(.bf-theme) :where(.bf-tiered-list.is-triple) :where(.bf-tiered-list-item-label) {
    grid-column: 1;
  }

  :where(.bf-theme) :where(.bf-tiered-list.is-triple) :where(.bf-tiered-list-item-role) {
    grid-column: 2;
  }

  :where(.bf-theme) :where(.bf-tiered-list.is-triple) :where(.bf-tiered-list-item-value) {
    grid-column: 3;
  }
}
`;
}
