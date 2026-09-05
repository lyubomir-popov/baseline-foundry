type PanelCssOptions = {
  bodyTypeStyles: string;
  h4TypeStyles: string;
};

export function panelCss(options: PanelCssOptions): string {
  const { bodyTypeStyles, h4TypeStyles } = options;

  return `:where(.bf-theme) :where(.bf-panel) {
  --bf-panel-content-padding-inline: var(--bf-component-inline-inset-continuation);
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

/* Panel chrome and content share the continuation component inset through a
 * local property. Structural surface padding remains a separate contract. */
:where(.bf-theme) :where(.bf-panel-header) {
  align-items: start;
  display: flex;
  flex-wrap: wrap;
  gap: var(--bf-field-gap);
  justify-content: space-between;
  padding-block-end: var(--bf-panel-padding-block);
  padding-block-start: var(--bf-panel-padding-block);
  padding-inline: var(--bf-panel-content-padding-inline);
}

/* A navigation brand keeps the Canonical tag attached to the panel's top edge
 * while sharing the panel-content inline inset used by the opposing main
 * region. Ordinary content-panel headers retain their complete padding. */
:where(.bf-theme) :where(.bf-panel-header.is-navigation-brand) {
  gap: 0;
  padding-block: 0;
  padding-inline-end: 0;
  padding-inline-start: var(--bf-panel-content-padding-inline);
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

/* Panel chrome that remains outside the panel's scrolling content. */
:where(.bf-theme) :where(.bf-panel-footer) {
  align-items: center;
  border-block-start: var(--bf-border-width) solid var(--bf-color-border-low-contrast);
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  gap: var(--bf-field-gap);
  justify-content: space-between;
  min-block-size: calc(var(--bf-interface-row-occupied-block-size) + var(--bf-panel-padding-block));
  padding-block-end: var(--bf-panel-padding-block);
  padding-block-start: 0;
  padding-inline: var(--bf-panel-content-padding-inline);
}

:where(.bf-theme) :where(.bf-panel-footer.is-sticky) {
  background: var(--bf-color-background-default);
  bottom: 0;
  position: sticky;
  z-index: 5;
}

:where(.bf-theme) :where(.bf-panel-title) {
${h4TypeStyles}  margin: 0 0 var(--bf-h4-margin-bottom);
  min-inline-size: 0;
  padding-block-end: 0;
  padding-block-start: var(--bf-h4-nudge-start);
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
  border: 0 solid transparent;
  border-block-width: var(--bf-border-width);
  color: var(--bf-color-text-default);
  cursor: pointer;
  display: inline-flex;
  gap: var(--bf-leading-mark-gap);
  justify-content: flex-start;
  margin: 0 0 var(--bf-interface-row-compensation-block-end);
  min-inline-size: 0;
  padding-block: var(--bf-interface-row-padding-block);
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
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: 0.125rem;
}

:where(.bf-theme) :where(.bf-panel-content) {
  flex: 1 1 auto;
  min-block-size: 0;
  padding-block-end: var(--bf-panel-padding-block);
  padding-block-start: var(--bf-panel-padding-block);
  padding-inline: var(--bf-panel-content-padding-inline);
}

:where(.bf-theme) :where(.bf-panel-content.is-flush) {
  padding-block: 0;
  padding-inline: 0;
}

`;
}
