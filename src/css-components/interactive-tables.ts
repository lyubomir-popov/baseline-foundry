/**
 * Interactive table presentation layered on the existing bf-table contract.
 *
 * Vanilla remains the geometry reference, while BF owns type and vertical
 * rhythm through its tier tokens. Runtime hooks never participate in styling.
 */
export function interactiveTablesCss(): string {
  return `:where(.bf-theme) :where(.bf-table.is-sortable th[aria-sort]) {
  color: var(--bf-color-text-default);
  cursor: pointer;
  outline-color: var(--bf-color-focus);
  white-space: nowrap;
}

:where(.bf-theme) :where(.bf-table-sort-button) {
  appearance: none;
  background: transparent;
  border: 0;
  color: inherit;
  cursor: inherit;
  display: inline-block;
  font: inherit;
  margin-block: -0.125rem;
  margin-inline: calc((var(--bf-component-inline-inset-field) / 2) * -1);
  max-inline-size: 100%;
  overflow: hidden;
  padding-block: 0.125rem;
  padding-inline: calc(var(--bf-component-inline-inset-field) / 2);
  text-align: inherit;
  text-decoration: inherit;
  text-overflow: inherit;
  vertical-align: inherit;
  white-space: inherit;
}

:where(.bf-theme) :where(.bf-table.is-sortable th[aria-sort]:hover, .bf-table-sort-button:focus-visible) {
  color: var(--bf-color-link-default);
  text-decoration: underline;
  text-decoration-thickness: 0.0625rem;
  text-underline-offset: 0.075em;
}

:where(.bf-theme) :where(.bf-table-sort-button:focus:not(:focus-visible)) {
  outline: none;
}

:where(.bf-theme) :where(.bf-table-sort-button:focus-visible) {
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: -0.125rem;
}

:where(.bf-theme) :where(.bf-table.is-sortable th[aria-sort])::after {
  background-image: var(--bf-ui-icon-chevron-down);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  block-size: var(--bf-icon-size-default);
  content: "";
  display: inline-block;
  inline-size: var(--bf-icon-size-default);
  margin-block-start: var(--bf-inline-icon-line-box-trim);
  margin-inline-start: calc(var(--bf-leading-mark-gap) / 2);
  opacity: 0;
  vertical-align: var(--bf-inline-icon-baseline-shift);
}

:where(.bf-theme) :where(.bf-table.is-sortable th[aria-sort='ascending'], .bf-table.is-sortable th[aria-sort='descending'])::after {
  opacity: 1;
}

:where(.bf-theme) :where(.bf-table.is-sortable th[aria-sort='ascending'])::after {
  transform: rotate(180deg);
}

:where(.bf-theme) :where(.bf-table.is-expanding .bf-table-expand-toggle) {
  margin-block-end: 0;
  white-space: nowrap;
}

:where(.bf-theme) :where(.bf-table-expanding-row[hidden]) {
  display: none;
}

:where(.bf-theme) .bf-table.is-expanding .bf-table-expanding-cell {
  overflow: visible;
  /* Complete the ordinary start-nudge inset with the paired end nudge while
     consuming the row rule inside it, so wrapped detail rows stay on-grid. */
  padding-block-end: calc(var(--bf-space-1) + var(--bf-body-nudge-end) - var(--bf-table-row-border-size));
  white-space: normal;
}

:where(.bf-theme) :where(.bf-table-mobile-card-frame) {
  container-type: inline-size;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-table-card-label) {
  display: none;
}

@container (width < 64.75rem) {
  :where(.bf-theme) :where(.bf-table-mobile-card-frame > .bf-table.is-mobile-card) {
    display: block;
  }

  :where(.bf-theme) :where(.bf-table-mobile-card-frame > .bf-table.is-mobile-card > thead) {
    block-size: 0.0625rem;
    clip-path: inset(50%);
    inline-size: 0.0625rem;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
  }

  :where(.bf-theme) :where(.bf-table-mobile-card-frame > .bf-table.is-mobile-card > tbody) {
    display: grid;
    gap: 0 var(--bf-component-inline-inset-continuation);
    grid-template-columns: repeat(auto-fit, minmax(min(12rem, 100%), 1fr));
    inline-size: 100%;
  }

  :where(.bf-theme) :where(.bf-table-mobile-card-frame > .bf-table.is-mobile-card > tbody > tr) {
    border: var(--bf-border-width) solid var(--bf-color-border-default);
    display: block;
    margin-block-end: calc(var(--bf-space-3) - (var(--bf-border-width) * 2));
    min-inline-size: 0;
    padding-inline: var(--bf-panel-padding-inline);
  }

  :where(.bf-theme) :where(.bf-table-mobile-card-frame > .bf-table.is-mobile-card > tbody > tr > :where(th, td)) {
    border-block-end-color: transparent;
    display: block;
    inline-size: 100%;
    min-inline-size: 0;
    overflow: hidden;
    padding-inline: 0;
    position: relative;
    text-align: start;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-word;
  }

  :where(.bf-theme) :where(.bf-table-mobile-card-frame > .bf-table.is-mobile-card > tbody > tr > :where(th, td):not(:first-child))::before {
    background: var(--bf-color-border-low-contrast);
    block-size: var(--bf-border-width);
    content: "";
    inset-block-start: 0;
    inset-inline: 0;
    position: absolute;
  }

  :where(.bf-theme) :where(.bf-table-mobile-card-frame > .bf-table.is-mobile-card .bf-table-card-label) {
    color: var(--bf-color-text-default);
    display: block;
    font-family: var(--bf-body-font-family);
    font-size: var(--bf-body-font-size);
    font-style: var(--bf-body-font-style);
    font-weight: 550;
    line-height: var(--bf-body-line-height);
    margin-block-end: var(--bf-space-1);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.bf-theme) :where(.bf-table-mobile-card-frame > .bf-table.is-mobile-card :where(th, td).is-overflow-visible) {
    overflow: visible;
  }
}
`;
}
