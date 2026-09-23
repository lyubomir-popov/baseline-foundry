export function alignmentGridCss(): string {
  return `:where(.bf-theme) :where(.bf-alignment-grid) {
  background: var(--bf-color-background-default);
  border: var(--bf-border-width) solid var(--bf-color-border-default);
  display: inline-grid;
  gap: 0.125rem;
  grid-template-columns: repeat(3, 1rem);
  grid-template-rows: repeat(3, 1rem);
  justify-self: start;
  margin: 0;
  padding: 0.125rem;
}

:where(.bf-theme) :where(.bf-alignment-grid-button) {
  align-items: center;
  appearance: none;
  background: transparent;
  block-size: 1rem;
  border: 0;
  color: var(--bf-color-text-muted);
  cursor: pointer;
  display: inline-flex;
  inline-size: 1rem;
  justify-content: center;
  margin: 0;
  min-block-size: 0;
  min-inline-size: 0;
  padding: 0;
}

:where(.bf-theme) :where(.bf-alignment-grid-button)::before {
  background: currentColor;
  block-size: 0.375rem;
  border-radius: 50%;
  content: "";
  inline-size: 0.375rem;
}

:where(.bf-theme) :where(.bf-alignment-grid-button):hover {
  background: var(--bf-color-background-hover);
  color: var(--bf-color-text-default);
}

:where(.bf-theme) :where(.bf-alignment-grid-button):focus:not(:focus-visible) {
  outline: none;
}

:where(.bf-theme) :where(.bf-alignment-grid-button):focus-visible {
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: -0.125rem;
  z-index: 1;
}

:where(.bf-theme) :where(.bf-alignment-grid-button)[aria-pressed='true'] {
  background: var(--bf-color-background-active);
  color: var(--bf-color-text-default);
}

`;
}
