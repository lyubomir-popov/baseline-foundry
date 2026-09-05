type CardsOptionsCssOptions = {
  bodyStrongTypeStyles: string;
  bodyTypeStyles: string;
};

export function cardsOptionsCss(options: CardsOptionsCssOptions): string {
  const { bodyStrongTypeStyles, bodyTypeStyles } = options;

  return `:where(.bf-theme) :where(.bf-card, .bf-card.is-highlighted, .bf-card.is-overlay, .bf-card.is-muted) {
  --bf-card-background: var(--bf-color-background-default);
  --bf-card-border: var(--bf-color-border-default);
  --bf-card-shadow: none;
  background: var(--bf-card-background);
  border: var(--bf-border-width) solid var(--bf-card-border);
  box-shadow: var(--bf-card-shadow);
  color: var(--bf-color-text-default);
  display: flex;
  flex-direction: column;
  gap: var(--bf-field-gap);
  max-inline-size: 100%;
  overflow: auto;
  padding-block-end: calc(var(--bf-panel-padding-block) - var(--bf-border-width));
  padding-block-start: calc(var(--bf-panel-padding-block) - var(--bf-border-width));
  padding-inline: var(--bf-component-inline-inset-continuation);
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
  border-color: var(--bf-color-focus);
  transform: translateY(-0.0625rem);
}

:where(.bf-theme) :where(a.bf-card:focus:not(:focus-visible), a.bf-card.is-highlighted:focus:not(:focus-visible), a.bf-card.is-overlay:focus:not(:focus-visible), a.bf-card.is-muted:focus:not(:focus-visible)) {
  outline: none;
}

:where(.bf-theme) :where(a.bf-card:focus-visible, a.bf-card.is-highlighted:focus-visible, a.bf-card.is-overlay:focus-visible, a.bf-card.is-muted:focus-visible) {
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: -0.125rem;
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
  border: var(--bf-border-width) solid var(--bf-color-border-low-contrast);
  display: grid;
  min-inline-size: 0;
  overflow: hidden;
  place-items: center;
  position: relative;
}

:where(.bf-theme) :where(.bf-card-preview.is-missing)::after {
  color: var(--bf-color-text-inactive);
  content: "Capture missing";
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
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
  border-bottom: var(--bf-border-width) solid var(--bf-color-border-low-contrast);
  display: grid;
  gap: var(--bf-field-gap);
  padding-block-end: calc(var(--bf-panel-padding-block) - var(--bf-border-width));
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
  border: var(--bf-border-width) solid var(--bf-color-border-default);
  color: var(--bf-color-text-default);
  display: grid;
  gap: var(--bf-field-gap);
  margin: 0;
  min-block-size: calc((var(--bf-interface-row-occupied-block-size) * 2) + var(--bf-baseline));
  min-inline-size: 0;
  padding-block-end: calc(var(--bf-panel-padding-block) - var(--bf-border-width));
  padding-block-start: calc(var(--bf-panel-padding-block) - var(--bf-border-width));
  padding-inline: var(--bf-component-inline-inset-continuation);
  text-align: left;
}

:where(.bf-theme) :where(button.bf-option-card) {
  appearance: none;
  cursor: pointer;
  transition: border-color 140ms ease, background-color 140ms ease, transform 140ms ease;
}

:where(.bf-theme) :where(button.bf-option-card:hover:not(:disabled)) {
  background: var(--bf-color-background-hover);
  border-color: var(--bf-color-focus);
  transform: translateY(-0.0625rem);
}

:where(.bf-theme) :where(.bf-option-card.is-active),
:where(.bf-theme) :where(button.bf-option-card:disabled) {
  background: color-mix(in srgb, var(--bf-color-background-active) 82%, var(--bf-color-focus) 18%);
  border-color: var(--bf-color-focus);
  color: var(--bf-color-text-default);
}

:where(.bf-theme) :where(button.bf-option-card:focus-visible) {
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: -0.125rem;
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
`;
}
