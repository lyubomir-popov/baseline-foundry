/** A wrapping form composition whose children retain their owned spacing. */
export function controlRowCss(): string {
  return `:where(.bf-theme) :where(.bf-control-row) {
  align-items: end;
  display: flex;
  flex-wrap: wrap;
  gap: var(--bf-field-gap);
  margin: 0;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-control-row) > :where(.bf-field, .bf-control) {
  align-self: end;
  flex: 1 1 min(100%, 16rem);
  min-inline-size: 0;
}
`;
}
