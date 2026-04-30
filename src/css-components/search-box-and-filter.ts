type SearchBoxAndFilterCssOptions = {
  bodySelectedStartNudge: string;
  bodyTypeStyles: string;
  buttonBlockPaddingVar: string;
  h6TypeStyles: string;
  inputMarginBottom: string;
};

export function searchBoxAndFilterCss(options: SearchBoxAndFilterCssOptions): string {
  const {
    bodySelectedStartNudge,
    bodyTypeStyles,
    buttonBlockPaddingVar,
    h6TypeStyles,
    inputMarginBottom,
  } = options;

  return `:where(.bf-theme) :where(.bf-search-box) {
  display: flex;
  inline-size: 100%;
  margin: 0 0 ${inputMarginBottom};
  max-inline-size: 100%;
  min-inline-size: 0;
  position: relative;
}

:where(.bf-theme) :where(.bf-search-box-input) {
  margin-bottom: 0;
  padding-inline-end: calc(var(--bf-baseline) * 4.5);
}

:where(.bf-theme) :where(.bf-search-box-reset, .bf-search-box-button) {
  align-items: center;
  block-size: var(--bf-control-box-size);
  display: inline-flex;
  inline-size: calc(var(--bf-baseline) * 2);
  justify-content: center;
  position: absolute;
  top: 0;
}

:where(.bf-theme) :where(.bf-search-box-reset) {
  inset-inline-end: calc(var(--bf-baseline) * 2);
}

:where(.bf-theme) :where(.bf-search-box-button) {
  appearance: none;
  background: transparent;
  border: 0;
  border-inline-start: var(--bf-border-width) solid var(--bf-color-border-default);
  color: var(--bf-color-text-default);
  cursor: pointer;
  inset-inline-end: var(--bf-border-width);
  margin: 0;
  padding: 0;
  text-indent: -9999px;
}

:where(.bf-theme) :where(.bf-search-box-button)::before {
  background-image: var(--bf-ui-icon-search);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
  block-size: 1rem;
  content: "";
  inline-size: 1rem;
  left: 50%;
  position: absolute;
  text-indent: 0;
  top: 50%;
  transform: translate(-50%, -50%);
}

:where(.bf-theme) :where(.bf-search-box-button)::after {
  content: none;
}

:where(.bf-theme) :where(.bf-search-box-reset:focus:not(:focus-visible), .bf-search-box-button:focus:not(:focus-visible)) {
  outline: none;
}

:where(.bf-theme) :where(.bf-search-box-reset:focus-visible, .bf-search-box-button:focus-visible) {
  outline: 2px solid var(--bf-color-focus);
  outline-offset: -2px;
}

:where(.bf-theme) :where(.bf-search-and-filter) {
  display: grid;
  inline-size: 100%;
  margin: 0;
  max-inline-size: 100%;
  min-inline-size: 0;
  position: relative;
}

:where(.bf-theme) :where(.bf-search-and-filter-search-container) {
  align-items: stretch;
  background: transparent;
  box-shadow: inset 0 -1px 0 var(--bf-color-border-high-contrast);
  display: flex;
  flex-wrap: wrap;
  gap: var(--bf-field-gap);
  margin: 0 0 ${inputMarginBottom};
  min-block-size: 0;
  overflow: visible;
  padding: 0;
  position: relative;
}

:where(.bf-theme) :where(.bf-search-and-filter-search-container[aria-expanded='false']) {
  min-block-size: var(--bf-control-box-size);
}

:where(.bf-theme) :where(.bf-search-and-filter-box) {
  display: inline-flex;
  flex: 1 1 12rem;
  max-inline-size: 100%;
  min-inline-size: 0;
  position: relative;
}

:where(.bf-theme) :where(.bf-search-and-filter-input) {
  margin-bottom: 0;
  padding-inline-end: calc(var(--bf-baseline) * 4.5);
}

:where(.bf-theme) :where(.bf-search-and-filter-search-button) {
  appearance: none;
  background: transparent;
  block-size: var(--bf-control-box-size);
  border: 0;
  color: var(--bf-color-text-default);
  cursor: pointer;
  inline-size: calc(var(--bf-baseline) * 2);
  inset-inline-end: 0;
  margin: 0;
  padding: 0;
  position: absolute;
  text-indent: -9999px;
  top: 0;
}

:where(.bf-theme) :where(.bf-search-and-filter-search-button)::before {
  background-image: var(--bf-ui-icon-search);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
  block-size: 1rem;
  content: "";
  inline-size: 1rem;
  left: 50%;
  position: absolute;
  text-indent: 0;
  top: 50%;
  transform: translate(-50%, -50%);
}

:where(.bf-theme) :where(.bf-search-and-filter-search-button)::after {
  content: none;
}

:where(.bf-theme) :where(.bf-search-and-filter-search-button:focus:not(:focus-visible), .bf-search-and-filter-selected-count:focus:not(:focus-visible)) {
  outline: none;
}

:where(.bf-theme) :where(.bf-search-and-filter-search-button:focus-visible, .bf-search-and-filter-selected-count:focus-visible) {
  outline: 2px solid var(--bf-color-focus);
  outline-offset: -2px;
}

:where(.bf-theme) :where(.bf-search-and-filter-clear) {
  block-size: var(--bf-control-box-size);
  inline-size: calc(var(--bf-baseline) * 2);
  inset-inline-end: calc(var(--bf-baseline) * 2);
  position: absolute;
  top: 0;
}

:where(.bf-theme) :where(.bf-search-and-filter-selected-count) {
${bodyTypeStyles}  appearance: none;
  align-items: flex-start;
  background: transparent;
  border: 0;
  color: var(--bf-color-link-default);
  cursor: pointer;
  display: inline-flex;
  margin: 0;
  padding-block: ${buttonBlockPaddingVar};
  padding-inline: 0;
  position: static;
}

:where(.bf-theme) :where(.bf-search-and-filter-search-container[aria-expanded='true']) :where(.bf-search-and-filter-selected-count) {
  display: none;
}

:where(.bf-theme) :where(.bf-search-and-filter-panel) {
  background-color: var(--bf-color-background-inputs);
  border: var(--bf-border-width) solid var(--bf-color-border-default);
  border-top: 0;
  box-shadow: 0 24px 72px rgba(0, 0, 0, 0.38);
  display: grid;
  gap: var(--bf-field-gap);
  opacity: 1;
  padding-bottom: calc(var(--bf-panel-padding-block) - var(--bf-border-width));
  padding-inline: var(--bf-panel-padding-inline);
  padding-top: var(--bf-panel-padding-block);
  position: absolute;
  top: 100%;
  width: 100%;
  z-index: 20;
}

:where(.bf-theme) :where(.bf-search-and-filter-panel[aria-hidden='true']) {
  opacity: 0;
  pointer-events: none;
}

:where(.bf-theme) :where(.bf-search-and-filter-search-prompt) {
  background: var(--bf-color-background-inputs);
  color: var(--bf-color-text-muted);
  cursor: pointer;
  margin: 0;
  overflow: hidden;
  padding-block-end: 0;
  padding-block-start: ${bodySelectedStartNudge};
  padding-inline: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:where(.bf-theme) :where(.bf-search-and-filter-search-query) {
  color: var(--bf-color-text-default);
  font-weight: 600;
}

:where(.bf-theme) :where(.bf-filter-panel-section) {
  border-bottom: var(--bf-border-width) solid var(--bf-color-border-low-contrast);
  display: grid;
  gap: var(--bf-field-gap);
  margin: 0;
  padding-bottom: calc(var(--bf-baseline) * 0.75);
}

:where(.bf-theme) :where(.bf-filter-panel-section:last-child) {
  border-bottom: 0;
  padding-bottom: 0;
}

:where(.bf-theme) :where(.bf-filter-panel-section-heading) {
${h6TypeStyles}  color: var(--bf-color-text-muted);
  margin: 0;
  padding-block: 0;
}

:where(.bf-theme) :where(.bf-filter-panel-section-chips) {
  overflow: hidden;
  position: relative;
}

:where(.bf-theme) :where(.bf-filter-panel-section-chips[aria-expanded='false']) {
  max-block-size: calc(var(--bf-baseline) * 5);
}

:where(.bf-theme) :where(.bf-filter-panel-section-counter) {
  appearance: none;
  background: transparent;
  border: 0;
  bottom: 0;
  color: var(--bf-color-link-default);
  cursor: pointer;
  margin: 0;
  padding: 0;
  position: absolute;
  right: 0;
}
`;
}