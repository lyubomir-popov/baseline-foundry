/**
 * Explicit nested controls for composition inside a host-owned single-line
 * row. Standalone controls retain the normal occupied-block contract.
 */
export const nestedTextInputTypes = ["text", "number", "search", "password", "email", "url", "tel"] as const;

export const nestedFieldSelector = [
  "input.bf-input.is-nested:not([type])",
  ...nestedTextInputTypes.map(type => `input.bf-input.is-nested[type='${type}']`),
  "select.bf-input.is-nested"
].join(", ");

export const nestedInteractiveSelector = `${nestedFieldSelector}, .bf-button.is-nested:not(.is-link)`;

export function nestedControlsCss(): string {
  return `:where(.bf-theme) :where(${nestedInteractiveSelector}) {
  line-height: var(--bf-nested-row-line-height);
  margin-block: 0;
  padding-block: var(--bf-nested-framed-row-padding-block);
}

/* Replaced textual controls retain a browser-owned intrinsic block floor even
   after their line and padding adopt the nested contract. This derived size is the exact
   sum of that same line, padding and real borders; it is not a density target
   independent of the active tier. */
:where(.bf-theme) :where(${nestedFieldSelector}) {
  block-size: var(--bf-nested-framed-row-painted-block-size);
}

:where(.bf-theme) :where(.bf-checkbox.is-nested, .bf-radio.is-nested) {
  --bf-tick-box-offset: var(--bf-nested-framed-row-visual-offset);
}

:where(.bf-theme) :where(.bf-checkbox.is-nested > .bf-checkbox-label, .bf-radio.is-nested > .bf-radio-label) {
  line-height: var(--bf-nested-row-line-height);
  margin-block: 0;
  padding-block: var(--bf-nested-framed-row-padding-block);
}
`;
}
