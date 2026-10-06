import { allSidedStrokeOverlayCss, blockEndStrokeOverlayCss } from "./stroke-paint.js";

type CardsOptionsCssOptions = {
  bodyStrongTypeStyles: string;
  bodyTypeStyles: string;
};

export function cardsOptionsCss(options: CardsOptionsCssOptions): string {
  const { bodyStrongTypeStyles, bodyTypeStyles } = options;
  const cardSelector = ":where(.bf-theme) :where(.bf-card, .bf-card.is-highlighted, .bf-card.is-overlay, .bf-card.is-muted)";
  const cardStroke = allSidedStrokeOverlayCss(cardSelector, { anchor: "relative" });
  const previewSelector = ":where(.bf-theme) :where(.bf-card-preview:not(.is-missing))";
  const previewStroke = allSidedStrokeOverlayCss(previewSelector, { anchor: "existing", color: "var(--bf-color-border-low-contrast)" });
  const headerSelector = ":where(.bf-theme) :where(.bf-card-header)";
  const headerStroke = blockEndStrokeOverlayCss(headerSelector, { anchor: "relative", color: "var(--bf-color-border-low-contrast)" });
  const optionSelector = ":where(.bf-theme) :where(.bf-option-card)";
  const optionStroke = allSidedStrokeOverlayCss(optionSelector, { anchor: "relative" });

  return `${cardStroke.owner}
${previewStroke.owner}
${headerStroke.owner}
${optionStroke.owner}

:where(.bf-theme) :where(.bf-card, .bf-card.is-highlighted, .bf-card.is-overlay, .bf-card.is-muted) {
  --bf-card-background: var(--bf-color-background-default);
  --bf-card-border: var(--bf-color-border-default);
  --bf-card-shadow: 0 0 0 0 transparent;
  --bf-overlay-elevation-layer: var(--bf-card-shadow);
  --bf-stroke-color: var(--bf-card-border);
  background: var(--bf-card-background);
  border: 0;
  box-shadow: none;
  color: var(--bf-color-text-default);
  display: flex;
  flex-direction: column;
  gap: var(--bf-section-space-shallow);
  max-inline-size: 100%;
  overflow: visible;
  padding-block: var(--bf-panel-padding-block);
  padding-inline: var(--bf-component-inline-inset-action);
}

:where(.bf-theme) :where(.bf-card.is-highlighted) {
  --bf-card-background: color-mix(in srgb, var(--bf-color-background-default) 82%, white 18%);
  --bf-card-shadow: 0 calc(var(--bf-control-visual-size) * 0.25) calc(var(--bf-control-visual-size) * 0.75) rgba(0, 0, 0, 0.16);
}

:where(.bf-theme) :where(.bf-card.is-overlay) {
  --bf-card-background: var(--bf-color-background-alt);
}

:where(.bf-theme) :where(.bf-card.is-muted) {
  --bf-card-background: color-mix(in srgb, var(--bf-color-background-default) 88%, black 12%);
}

:where(.bf-theme) :where(a.bf-card, a.bf-card.is-highlighted, a.bf-card.is-overlay, a.bf-card.is-muted) {
  color: inherit;
  cursor: pointer;
  text-decoration: none;
  transition: border-color 140ms ease, background-color 140ms ease, transform 140ms ease;
}

:where(.bf-theme) :where(a.bf-card:hover, a.bf-card.is-highlighted:hover, a.bf-card.is-overlay:hover, a.bf-card.is-muted:hover) {
  --bf-stroke-color: var(--bf-color-focus);
  transform: translateY(-0.0625rem);
}

:where(.bf-theme) :where(a.bf-card:focus:not(:focus-visible), a.bf-card.is-highlighted:focus:not(:focus-visible), a.bf-card.is-overlay:focus:not(:focus-visible), a.bf-card.is-muted:focus:not(:focus-visible)) {
  outline: none;
}

:where(.bf-theme) :where(a.bf-card:focus-visible, a.bf-card.is-highlighted:focus-visible, a.bf-card.is-overlay:focus-visible, a.bf-card.is-muted:focus-visible) {
  --bf-overlay-focus-layer: inset 0 0 0 0.125rem var(--bf-color-focus);
  outline: none;
}

:where(.bf-theme) :where(.bf-card.is-preview) {
  align-content: start;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-card-preview) {
  aspect-ratio: 3 / 2;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--bf-color-background-default) 78%, var(--bf-color-background-alt) 22%), var(--bf-color-background-alt)),
    var(--bf-color-background-alt);
  border: 0;
  display: grid;
  min-inline-size: 0;
  overflow: hidden;
  place-items: center;
  position: relative;
}

:where(.bf-theme) :where(.bf-card-preview.is-missing)::after {
  color: var(--bf-color-text-inactive);
  content: "Capture missing";
  font-size: var(--bf-body-font-size);
  line-height: var(--bf-body-line-height);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* The missing-preview label occupies ::after, so this text-only state is the
   named self-painted exception. Image previews retain the automatic overlay. */
:where(.bf-theme) :where(.bf-card-preview.is-missing) {
  box-shadow: inset 0 0 0 var(--bf-border-width) var(--bf-color-border-low-contrast);
}

:where(.bf-theme) :where(.bf-card-preview-image) {
  block-size: 100%;
  display: block;
  inline-size: 100%;
  object-fit: contain;
  object-position: center;
}

:where(.bf-theme) :where(.bf-card-image) {
  display: block;
  inline-size: 100%;
  margin: 0;
}

:where(.bf-theme) :where(.bf-card-header) {
  border: 0;
  display: grid;
  gap: var(--bf-field-gap);
  padding-block-end: 0;
}

:where(.bf-theme) :where(.bf-card-inner) {
  display: grid;
  gap: var(--bf-field-gap);
}

:where(.bf-theme) :where(.bf-card-content) {
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-card-thumbnail) {
  block-size: auto;
  max-block-size: calc(var(--bf-control-visual-size) * 2);
}

:where(.bf-theme) :where(.bf-option-grid) {
  display: grid;
  gap: var(--bf-component-inline-inset-action);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 10rem), 1fr));
}

:where(.bf-theme) :where(.bf-option-card) {
  align-content: start;
  align-items: start;
  background: color-mix(in srgb, var(--bf-color-background-default) 88%, black 12%);
  border: 0;
  color: var(--bf-color-text-default);
  display: grid;
  gap: var(--bf-field-gap);
  margin: 0;
  min-block-size: calc((var(--bf-interface-row-occupied-block-size) * 2) + var(--bf-baseline));
  min-inline-size: 0;
  padding-block: var(--bf-panel-padding-block);
  padding-inline: var(--bf-component-inline-inset-action);
  text-align: left;
}

:where(.bf-theme) :where(button.bf-option-card) {
  appearance: none;
  cursor: pointer;
  transition: border-color 140ms ease, background-color 140ms ease, transform 140ms ease;
}

:where(.bf-theme) :where(button.bf-option-card:hover:not(:disabled)) {
  background: var(--bf-color-background-hover);
  --bf-stroke-color: var(--bf-color-focus);
  transform: translateY(-0.0625rem);
}

:where(.bf-theme) :where(.bf-option-card.is-active),
:where(.bf-theme) :where(button.bf-option-card:disabled) {
  background: color-mix(in srgb, var(--bf-color-background-active) 82%, var(--bf-color-focus) 18%);
  --bf-stroke-color: var(--bf-color-focus);
  color: var(--bf-color-text-default);
}

:where(.bf-theme) :where(.bf-option-card.is-active) {
  --bf-overlay-selection-block-start-width: var(--bf-bar-thickness);
  --bf-overlay-selection-layer: inset 0 var(--bf-bar-thickness) 0 var(--bf-color-focus);
}

:where(.bf-theme) :where(button.bf-option-card:focus-visible) {
  --bf-overlay-focus-layer: inset 0 0 0 0.125rem var(--bf-color-focus);
  outline: none;
}

:where(.bf-theme) :where(.bf-option-card-label) {
${bodyStrongTypeStyles}  display: block;
  margin: 0;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-option-card-meta) {
${bodyTypeStyles}  color: var(--bf-color-text-muted);
  display: block;
  margin: 0;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-option-card-meta.is-quiet) {
  color: var(--bf-color-text-inactive);
}

${cardStroke.painter}
${previewStroke.painter}
${headerStroke.painter}
${optionStroke.painter}

@media (forced-colors: active) {
  :where(.bf-theme) :where(.bf-card-preview.is-missing) {
    box-shadow: none;
    outline: var(--bf-border-width) solid CanvasText;
    outline-offset: calc(var(--bf-border-width) * -1);
  }

  :where(.bf-theme) :where(a.bf-card:focus:not(:focus-visible), button.bf-option-card:focus:not(:focus-visible)) {
    outline: var(--bf-border-width) solid CanvasText;
    outline-offset: calc(var(--bf-border-width) * -1);
  }

  :where(.bf-theme) :where(a.bf-card:focus-visible, button.bf-option-card:focus-visible) {
    outline: none;
  }

  :where(.bf-theme) :where(a.bf-card:focus-visible, button.bf-option-card:focus-visible)::after {
    outline: 0.1875rem solid Highlight;
    outline-offset: -0.25rem;
  }
}
`;
}
