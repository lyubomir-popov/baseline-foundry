/**
 * Explicit compact controls for composition inside a host-owned single-line
 * row. Standalone controls retain the normal occupied-block contract.
 */
export function nestedControlsCss(): string {
  return `:where(.bf-theme) :where(.bf-input.is-nested, .bf-button.is-nested) {
  line-height: var(--bf-nested-control-line-height);
  margin-block: 0;
  padding-block: var(--bf-nested-control-padding-block);
}

/* Replaced textual controls retain a browser-owned intrinsic block floor even
   after their line and padding become compact. This derived size is the exact
   sum of that same line, padding and real borders; it is not a density target
   independent of the active tier. */
:where(.bf-theme) :where(.bf-input.is-nested) {
  block-size: var(--bf-nested-control-block-size);
}

:where(.bf-theme) :where(.bf-checkbox.is-nested, .bf-radio.is-nested) {
  --bf-tick-box-offset: var(--bf-nested-control-visual-offset);
}

:where(.bf-theme) :where(.bf-checkbox.is-nested > .bf-checkbox-label, .bf-radio.is-nested > .bf-radio-label) {
  line-height: var(--bf-nested-control-line-height);
  margin-block: 0;
  padding-block: var(--bf-nested-control-padding-block);
}
`;
}
