type TabsChoiceBreadcrumbsCssOptions = {
  bodyCaseTypeStyles: string;
  bodyStrongTypeStyles: string;
  bodyTypeStyles: string;
  buttonMarginBottom: string;
  buttonPadding: string;
};

export function tabsChoiceBreadcrumbsCss(options: TabsChoiceBreadcrumbsCssOptions): string {
  const {
    bodyCaseTypeStyles,
    bodyStrongTypeStyles,
    bodyTypeStyles,
    buttonMarginBottom,
    buttonPadding,
  } = options;

  return `:where(.bf-theme) :where(.bf-tabs) {
  display: grid;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-tabs-list) {
  border-bottom: var(--bf-border-width) solid var(--bf-color-border-default);
  display: flex;
  gap: 0;
  list-style: none;
  /* Tabs keep their occupied block on the grid at the list boundary rather
     than leaving each link's control compensation between its active rule and
     the list rule. */
  margin: 0 0 calc((var(--bf-baseline) * 2) - var(--bf-border-width));
  min-inline-size: 0;
  overflow-x: auto;
  padding: 0;
  white-space: nowrap;
}

:where(.bf-theme) :where(.bf-tabs-item) {
  margin: 0;
  min-inline-size: 0;
  padding: 0;
}

:where(.bf-theme) :where(.bf-tabs-link) {
${bodyTypeStyles}  align-items: center;
  background: transparent;
  border: 0;
  border-bottom: var(--bf-bar-thickness) solid transparent;
  color: var(--bf-color-text-muted);
  cursor: pointer;
  display: inline-flex;
  gap: calc(var(--bf-baseline) * 0.5);
  justify-content: center;
  margin-bottom: 0;
  padding-block-end: calc(var(--bf-body-nudge-end) + var(--bf-baseline) - var(--bf-bar-thickness));
  padding-block-start: var(--bf-body-nudge-start);
  padding-inline: var(--bf-control-inline-padding-action);
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-tabs-link:hover) {
  background: var(--bf-color-background-hover);
  color: var(--bf-color-text-default);
}

:where(.bf-theme) :where(a.bf-tabs-link:hover) {
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-tabs-link:focus:not(:focus-visible)) {
  outline: none;
}

:where(.bf-theme) :where(.bf-tabs-link:focus-visible) {
  color: var(--bf-color-text-default);
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: -0.125rem;
}

:where(.bf-theme) :where(.bf-tabs-link.is-active, .bf-tabs-link[aria-selected='true']) {
  border-bottom-color: var(--bf-color-text-default);
  color: var(--bf-color-text-default);
}

:where(.bf-theme) :where(.bf-tabs-panel) {
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-tabs-panel)[aria-hidden='true'] {
  display: none;
}

:where(.bf-theme) :where(.bf-tabs.is-equal) {
  --bf-ui-tabs-equal-min: 8rem;
}

:where(.bf-theme) :where(.bf-tabs.is-equal) :where(.bf-tabs-list) {
  display: grid;
  gap: calc(var(--bf-baseline) * 2);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--bf-ui-tabs-equal-min)), 1fr));
  overflow: visible;
  white-space: normal;
}

:where(.bf-theme) :where(.bf-tabs.is-equal) :where(.bf-tabs-item) {
  min-inline-size: 0;
  white-space: normal;
}

:where(.bf-theme) :where(.bf-tabs.is-equal) :where(.bf-tabs-link) {
  display: flex;
  inline-size: 100%;
  text-align: center;
  white-space: normal;
}

:where(.bf-theme) :where(.bf-choice-list) {
  display: grid;
  gap: var(--bf-field-gap);
}

:where(.bf-theme) :where(.bf-choice-row) {
  align-items: center;
  background: var(--bf-color-background-default);
  border: var(--bf-border-width) solid var(--bf-color-border-default);
  color: var(--bf-color-text-default);
  cursor: pointer;
  display: grid;
  gap: calc(var(--bf-baseline) * 0.75);
  grid-template-columns: auto minmax(0, 1fr) auto;
  margin: 0 0 ${buttonMarginBottom};
  min-inline-size: 0;
${buttonPadding}  padding-inline: var(--bf-control-inline-padding-field);
}

:where(.bf-theme) :where(.bf-choice-row:hover) {
  background: var(--bf-color-background-hover);
}

:where(.bf-theme) :where(.bf-choice-row:has(:focus-visible)) {
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: -0.125rem;
}

:where(.bf-theme) :where(.bf-choice-row input[type='radio']) {
  margin: 0;
}

:where(.bf-theme) :where(.bf-choice-row-name) {
${bodyStrongTypeStyles}  display: block;
  margin: 0;
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

:where(.bf-theme) :where(.bf-choice-row-meta) {
${bodyTypeStyles}  color: var(--bf-color-text-muted);
  display: block;
  margin: 0;
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:where(.bf-theme) :where(.bf-choice-row.is-active),
:where(.bf-theme) :where(.bf-choice-row:has(input[type='radio']:checked)) {
  background: var(--bf-color-background-active);
  border-color: var(--bf-color-focus);
}

:where(.bf-theme) :where(.bf-inline-options) {
  border-bottom: var(--bf-border-width) solid var(--bf-color-border-default);
  display: grid;
  gap: var(--bf-field-gap);
  padding-block-end: calc(var(--bf-panel-padding-block) - var(--bf-border-width));
  padding-block-start: var(--bf-panel-padding-block);
  padding-inline: var(--bf-panel-padding-inline);
}

:where(.bf-theme) :where(.bf-inline-options-heading) {
${bodyCaseTypeStyles}  color: var(--bf-color-text-muted);
  display: block;
  margin: 0;
}

:where(.bf-theme) :where(.bf-inline-options-heading) :where(.bf-form-label) {
  color: inherit;
}

:where(.bf-theme) :where(.bf-inline-options-options) {
  display: flex;
  flex-wrap: wrap;
  gap: calc(var(--bf-baseline) * 3);
}

:where(.bf-theme) :where(.bf-inline-options-option) {
  align-items: center;
  cursor: pointer;
  display: flex;
  gap: var(--bf-field-gap);
}

:where(.bf-theme) :where(.bf-inline-options-option) input[type='radio'] {
  margin: 0;
}

:where(.bf-theme) :where(.bf-segmented-control, .bf-tab-buttons) {
  display: block;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-segmented-control-list, .bf-tab-buttons-list) {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  min-inline-size: 0;
  padding: 0;
}

:where(.bf-theme) :where(.bf-segmented-control-item, .bf-tab-buttons-item) {
  margin: 0;
  min-inline-size: 0;
  padding: 0;
}

:where(.bf-theme) :where(.bf-segmented-control-item + .bf-segmented-control-item, .bf-tab-buttons-item + .bf-tab-buttons-item) {
  margin-inline-start: calc(var(--bf-border-width) * -1);
}

:where(.bf-theme) :where(.bf-segmented-control-button, .bf-tab-buttons-button) {
${bodyTypeStyles}  align-items: center;
  appearance: none;
  background-color: var(--bf-color-background-default);
  border: var(--bf-border-width) solid var(--bf-color-border-high-contrast);
  border-radius: 0;
  color: var(--bf-color-text-default);
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  margin-bottom: ${buttonMarginBottom};
  max-inline-size: 100%;
  overflow: hidden;
${buttonPadding}  padding-inline: var(--bf-control-inline-padding-action);
  text-align: center;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:where(.bf-theme) :where(.bf-segmented-control-item:first-child .bf-segmented-control-button, .bf-tab-buttons-item:first-child .bf-tab-buttons-button) {
  border-end-start-radius: var(--bf-radius);
  border-start-start-radius: var(--bf-radius);
}

:where(.bf-theme) :where(.bf-segmented-control-item:last-child .bf-segmented-control-button, .bf-tab-buttons-item:last-child .bf-tab-buttons-button) {
  border-end-end-radius: var(--bf-radius);
  border-start-end-radius: var(--bf-radius);
}

:where(.bf-theme) :where(.bf-segmented-control-button:hover, .bf-tab-buttons-button:hover) {
  background-color: var(--bf-color-background-hover);
}

:where(.bf-theme) :where(.bf-segmented-control-button:focus:not(:focus-visible), .bf-tab-buttons-button:focus:not(:focus-visible)) {
  outline: none;
}

:where(.bf-theme) :where(.bf-segmented-control-button:focus-visible, .bf-tab-buttons-button:focus-visible) {
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: -0.125rem;
  z-index: 2;
}

:where(.bf-theme) :where(.bf-segmented-control-button.is-active, .bf-tab-buttons-button.is-active, .bf-segmented-control-button[aria-pressed='true'], .bf-tab-buttons-button[aria-pressed='true'], .bf-segmented-control-button[aria-selected='true'], .bf-tab-buttons-button[aria-selected='true']) {
  background-color: var(--bf-color-background-active);
  color: var(--bf-color-text-default);
  z-index: 1;
}

:where(.bf-theme) :where(.bf-breadcrumbs) {
  display: block;
  margin: 0;
  width: 100%;
}

:where(.bf-theme) :where(.bf-breadcrumbs-items) {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: calc(var(--bf-baseline) * 0.5) calc(var(--bf-baseline) * 1.25);
  list-style: none;
  margin: 0;
  min-inline-size: 0;
  padding: 0;
}

:where(.bf-theme) :where(.bf-breadcrumbs-item) {
${bodyCaseTypeStyles}  color: var(--bf-color-text-muted);
  margin: 0;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-breadcrumbs-item) + :where(.bf-breadcrumbs-item)::before {
  color: var(--bf-color-text-muted);
  content: "/";
  margin-inline-end: calc(var(--bf-baseline) * 0.75);
}

:where(.bf-theme) :where(.bf-breadcrumbs-item) a {
  color: inherit;
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-breadcrumbs-item) a:hover {
  color: var(--bf-color-text-default);
  text-decoration: underline;
}

:where(.bf-theme) :where(.bf-breadcrumbs-item [aria-current='page'], .bf-breadcrumbs-item.is-active) {
  color: var(--bf-color-text-default);
}
`;
}
