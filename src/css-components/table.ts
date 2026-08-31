type TableCssOptions = {
  bodyLineHeight: string;
  bodyMediumTypeStyles: string;
  bodyTypeStyles: string;
};

export function tableCss(options: TableCssOptions): string {
  const { bodyLineHeight, bodyMediumTypeStyles, bodyTypeStyles } = options;

  return `:where(.bf-theme) {
  --bf-table-row-border-size: var(--bf-border-width);
  --bf-table-row-padding-block-start: var(--bf-in-box-row-padding-block-start);
  --bf-table-row-block-size: var(--bf-interface-row-occupied-block-size);
  --bf-table-row-padding-block-end: max(0rem, calc(var(--bf-table-row-block-size) - ${bodyLineHeight} - var(--bf-table-row-padding-block-start) - var(--bf-table-row-border-size)));
  --bf-table-row-line-height: ${bodyLineHeight};
}

:where(.bf-theme) :where(.bf-table-scroll) {
  max-inline-size: 100%;
  min-inline-size: 0;
  overflow-x: auto;
  scrollbar-width: thin;
}

:where(.bf-theme) :where(.bf-table-scroll) > :where(table, .bf-table) {
  min-inline-size: var(--bf-table-scroll-min-inline-size, 48rem);
}

:where(.bf-theme) :where(table, .bf-table) {
  border: 0;
  border-collapse: separate;
  border-spacing: 0;
  caption-side: bottom;
  line-height: ${bodyLineHeight};
  margin: 0;
  table-layout: auto;
  width: 100%;
}

:where(.bf-theme) :where(caption, .bf-table-caption) {
${bodyTypeStyles}  color: var(--bf-color-text-muted);
  margin: 0;
  padding-bottom: calc(var(--bf-baseline) * 0.5);
  padding-top: calc(var(--bf-baseline) * 0.5);
  text-align: left;
}

:where(.bf-theme) :where(th, td) {
  border: 0;
  border-block-end: var(--bf-table-row-border-size) solid transparent;
  color: var(--bf-color-text-default);
  line-height: var(--bf-table-row-line-height);
  margin: 0;
  overflow: hidden;
  padding-block-end: var(--bf-table-row-padding-block-end);
  padding-block-start: var(--bf-table-row-padding-block-start);
  padding-inline: var(--bf-component-inline-inset-field);
  text-align: left;
  text-overflow: ellipsis;
  vertical-align: top;
}

:where(.bf-theme) :where(th.is-icon-placeholder, td.is-icon-placeholder, .bf-table-cell.is-icon-placeholder) {
  padding-inline-start: calc(var(--bf-component-inline-inset-field) + var(--bf-leading-icon-size) + var(--bf-leading-icon-gap));
}

:where(.bf-theme) :where(th.is-icon-placeholder, td.is-icon-placeholder, .bf-table-cell.is-icon-placeholder) > :where(.bf-icon:first-child) {
  --bf-icon-size: var(--bf-leading-icon-size);
  margin-inline-end: var(--bf-leading-icon-gap);
  margin-inline-start: calc((var(--bf-leading-icon-size) + var(--bf-leading-icon-gap)) * -1);
}

:where(.bf-theme) :where(td) {
  font-weight: var(--bf-body-font-weight, 400);
}

:where(.bf-theme) :where(thead th) {
${bodyMediumTypeStyles}  color: var(--bf-color-text-default);
  border-block-end-color: var(--bf-color-border-default);
  line-height: var(--bf-table-row-line-height);
}

:where(.bf-theme) :where(tbody tr:not(:last-child) td, tfoot td) {
  border-block-end-color: var(--bf-color-border-low-contrast);
}

:where(.bf-theme) :where(tbody tr:hover td) {
  background: color-mix(in srgb, var(--bf-color-background-hover) 68%, transparent);
}
`;
}
