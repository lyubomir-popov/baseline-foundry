type PanelCssOptions = {
  bodyTypeStyles: string;
  h4TypeStyles: string;
};

export function panelCss(options: PanelCssOptions): string {
  const { bodyTypeStyles, h4TypeStyles } = options;

  return `:where(.bf-theme) :where(.bf-panel) {
  background: var(--bf-color-background-default);
  color: var(--bf-color-text-default);
  display: flex;
  flex-direction: column;
  inline-size: 100%;
  max-inline-size: 100%;
  min-block-size: 0;
}

:where(.bf-theme) :where(.bf-panel.is-fill) {
  block-size: 100%;
  max-inline-size: none;
  min-block-size: 0;
  resize: none;
}

:where(.bf-theme) :where(.bf-panel.is-fill) > :where(.bf-panel-content) {
  min-block-size: 0;
  overflow: auto;
  overscroll-behavior: contain;
}

:where(.bf-theme) :where(.bf-panel-header) {
  align-items: start;
  display: flex;
  flex-wrap: wrap;
  gap: var(--bf-field-gap);
  justify-content: space-between;
  padding-block-end: var(--bf-panel-padding-block);
  padding-block-start: var(--bf-panel-padding-block);
  padding-inline: var(--bf-panel-padding-inline);
}

/* A navigation brand owns the panel's leading edge. The opt-in modifier lets
 * the fixed Canonical tag meet both panel edges without weakening the default
 * padded header contract used by ordinary content panels. */
:where(.bf-theme) :where(.bf-panel-header.is-navigation-brand) {
  gap: 0;
  padding-block: 0;
  padding-inline: 0;
}

:where(.bf-theme) :where(.bf-panel-header.is-navigation-brand) > :where(.bf-top-navigation-logo.is-canonical-tagged) {
  inline-size: 100%;
}

:where(.bf-theme) :where(.bf-panel-header) > :where(.bf-panel-title) {
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-panel-header.is-sticky) {
  background: var(--bf-color-background-default);
  position: sticky;
  top: 0;
  z-index: 5;
}

:where(.bf-theme) :where(.bf-panel-title) {
${h4TypeStyles}  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-panel-controls) {
  align-items: start;
  display: flex;
  flex-wrap: wrap;
  gap: var(--bf-field-gap);
  margin-inline-start: auto;
}

:where(.bf-theme) :where(.bf-panel-toggle) {
${bodyTypeStyles}  align-items: center;
  appearance: none;
  background: transparent;
  border: 0;
  color: var(--bf-color-text-default);
  cursor: pointer;
  display: inline-flex;
  gap: calc(var(--bf-baseline) * 0.5);
  justify-content: flex-start;
  margin: 0;
  min-block-size: var(--bf-control-box-size-compact);
  min-inline-size: 0;
  padding-block: var(--bf-control-block-padding-compact);
  padding-inline: 0;
  text-align: left;
}

:where(.bf-theme) :where(.bf-panel-toggle:hover) {
  color: var(--bf-color-link-default);
}

:where(.bf-theme) :where(.bf-panel-toggle:focus:not(:focus-visible)) {
  outline: none;
}

:where(.bf-theme) :where(.bf-panel-toggle:focus-visible) {
  outline: 2px solid var(--bf-color-focus);
  outline-offset: 2px;
}

:where(.bf-theme) :where(.bf-panel-content) {
  flex: 1 1 auto;
  min-block-size: 0;
  padding-block-end: var(--bf-panel-padding-block);
  padding-block-start: var(--bf-panel-padding-block);
  padding-inline: var(--bf-panel-padding-inline);
}

:where(.bf-theme) :where(.bf-panel-content.is-flush) {
  padding-block: 0;
  padding-inline: 0;
}

:where(.bf-theme) :where(.bf-panel-content) > :last-child:not(:where(.bf-button, .bf-button.is-base, .bf-input, input, textarea, select, input[type='file'], .bf-search-box, .bf-search-and-filter-search-container, .bf-choice-row, .bf-segmented-control-button, .bf-tab-buttons-button, .bf-pagination-link, .bf-side-navigation-toggle)) {
  margin-bottom: 0;
}
`;
}
