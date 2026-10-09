import { blockStartStrokeOverlayCss } from "./stroke-paint.js";

type PanelCssOptions = {
  bodyTypeStyles: string;
  h4TypeStyles: string;
};

export function panelCss(options: PanelCssOptions): string {
  const { bodyTypeStyles, h4TypeStyles } = options;
  const footerStroke = blockStartStrokeOverlayCss(":where(.bf-theme) :where(.bf-panel-footer)", { anchor: "relative", color: "var(--bf-color-border-low-contrast)" });

  return `${footerStroke.owner}

:where(.bf-theme) :where(.bf-panel) {
  --bf-panel-content-padding-inline: var(--bf-component-inline-inset-action);
  background: var(--bf-color-background-default);
  color: var(--bf-color-text-default);
  display: flex;
  flex-direction: column;
  gap: var(--bf-section-space-shallow);
  inline-size: 100%;
  max-inline-size: 100%;
  min-block-size: 0;
  padding-block: var(--bf-panel-padding-block);
  padding-inline: var(--bf-panel-content-padding-inline);
}

:where(.bf-theme) :where(.bf-panel:has(> .bf-panel-content.is-flush)) {
  padding-inline: 0;
}

/* SideNavigation is a region owner with its own grid-margin gutters and group
 * rhythm; composing it with Panel must not add a second surface inset. */
:where(.bf-theme) :where(.bf-panel.bf-side-navigation) {
  gap: 0;
  padding: 0;
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

/* The panel root owns its surface inset and the group gap between sections. */
:where(.bf-theme) :where(.bf-panel-header) {
  align-items: start;
  display: flex;
  flex-wrap: wrap;
  gap: var(--bf-field-gap);
  justify-content: space-between;
  padding: 0;
}

/* The tagged Canonical brand preserves its established continuation keyline
 * inside the standard Action-inset surface. Ordinary panel sections add no
 * second inset. */
:where(.bf-theme) :where(.bf-panel-header.is-navigation-brand) {
  gap: 0;
  padding: 0;
  padding-inline-start: calc(var(--bf-component-inline-inset-continuation) - var(--bf-panel-content-padding-inline));
}

:where(.bf-theme) :where(.bf-panel:has(> .bf-panel-content.is-flush)) > :where(.bf-panel-header.is-navigation-brand) {
  --bf-top-navigation-logo-tag-start: calc(var(--bf-panel-padding-block) * -1);
  padding-inline-start: var(--bf-component-inline-inset-continuation);
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
  border: 0;
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  gap: var(--bf-field-gap);
  justify-content: space-between;
  min-block-size: var(--bf-interface-row-occupied-block-size);
  padding: 0;
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
  border-block-width: 0;
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
  padding: 0;
}

:where(.bf-theme) :where(.bf-panel-content:not(.bf-stack, .bf-grid, .bf-cluster)) {
  display: flow-root;
}

:where(.bf-theme) :where(.bf-panel-content.is-flush) {
  padding-block: 0;
  padding-inline: 0;
}

${footerStroke.painter}

`;
}
