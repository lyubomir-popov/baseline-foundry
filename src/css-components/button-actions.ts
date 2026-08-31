type ButtonActionCssOptions = {
  bodyTypeStyles: string;
  buttonMarginBottom: string;
  buttonPadding: string;
};

export function buttonActionsCss(options: ButtonActionCssOptions): string {
  const { bodyTypeStyles, buttonMarginBottom, buttonPadding } = options;

  return `:where(.bf-theme) :where(.bf-button, .bf-button.is-base) {
${bodyTypeStyles}  appearance: none;
  background-color: var(--bf-color-background-default);
  border: var(--bf-border-width) solid var(--bf-color-border-high-contrast);
  border-radius: var(--bf-radius);
  color: var(--bf-color-text-default);
  cursor: pointer;
  display: inline-block;
  margin-bottom: ${buttonMarginBottom};
${buttonPadding}  padding-inline: var(--bf-component-inline-inset-action-bordered);
  text-align: center;
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-button) {
  background-color: var(--bf-color-background-default);
}

:where(.bf-theme) :where(.bf-button.is-base) {
  background-color: transparent;
  border-color: transparent;
}

:where(.bf-theme) :where(.bf-button:hover, .bf-button.is-base:hover) {
  background-color: var(--bf-color-background-hover);
}

/* Anchor buttons are controls, not prose links. Qualifying the element and
 * its interaction states prevents the generic anchor underline from leaking
 * through while leaving the explicit is-link variant unchanged. */
:where(.bf-theme) :where(a.bf-button:not(.is-link):is(:hover, :active)) {
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-button:not(.is-base):is(:active, [aria-pressed='true'])) {
  background-color: var(--bf-color-background-active);
}

:where(.bf-theme) :where(.bf-button, .bf-button.is-base):focus:not(:focus-visible) {
  outline: none;
}

:where(.bf-theme) :where(.bf-button, .bf-button.is-base):focus-visible {
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: 0.125rem;
}

/* ------------------------------------------------------------------ */
/* Button — semantic positive modifier (Vanilla parity).               */
/* Vanilla uses themed positive tokens for default/hover/active        */
/* backgrounds plus a white text colour on a coloured surface.         */
/* ------------------------------------------------------------------ */

:where(.bf-theme) :where(.bf-button.is-positive) {
  background-color: var(--bf-color-button-positive-default);
  border-color: var(--bf-color-button-positive-default);
  color: var(--bf-color-button-positive-text);
}

:where(.bf-theme) :where(.bf-button.is-positive:hover) {
  background-color: var(--bf-color-button-positive-hover);
  border-color: var(--bf-color-button-positive-hover);
  color: var(--bf-color-button-positive-text);
}

:where(.bf-theme) :where(.bf-button.is-positive:is(:active, [aria-pressed='true'])) {
  background-color: var(--bf-color-button-positive-active);
  border-color: var(--bf-color-button-positive-active);
  color: var(--bf-color-button-positive-text);
}

/* ------------------------------------------------------------------ */
/* Button — semantic negative modifier (Vanilla parity).               */
/* Vanilla uses themed negative tokens for default/hover/active        */
/* backgrounds plus a white text colour on a coloured surface.         */
/* ------------------------------------------------------------------ */

:where(.bf-theme) :where(.bf-button.is-negative) {
  background-color: var(--bf-color-button-negative-default);
  border-color: var(--bf-color-button-negative-default);
  color: var(--bf-color-button-negative-text);
}

:where(.bf-theme) :where(.bf-button.is-negative:hover) {
  background-color: var(--bf-color-button-negative-hover);
  border-color: var(--bf-color-button-negative-hover);
  color: var(--bf-color-button-negative-text);
}

:where(.bf-theme) :where(.bf-button.is-negative:is(:active, [aria-pressed='true'])) {
  background-color: var(--bf-color-button-negative-active);
  border-color: var(--bf-color-button-negative-active);
  color: var(--bf-color-button-negative-text);
}

/* ------------------------------------------------------------------ */
/* Button — link-style modifier (Vanilla parity).                      */
/* BF starts from the shared button control contract, so the modifier  */
/* has to strip control chrome and padding back down to inline-link    */
/* behavior while reusing the shared link tokens.                      */
/* ------------------------------------------------------------------ */

:where(.bf-theme) :where(.bf-button.is-link) {
  background-color: transparent;
  border: 0;
  border-radius: 0;
  color: var(--bf-color-link-default);
  margin-bottom: 0;
  padding-block: 0;
  padding-inline: 0;
}

:where(.bf-theme) :where(.bf-button.is-link:hover) {
  background-color: transparent;
  color: var(--bf-color-link-default);
  text-decoration: underline;
  text-decoration-thickness: 0.0625rem;
  text-underline-offset: 0.075em;
}

:where(.bf-theme) :where(.bf-button.is-link:focus-visible) {
  outline-offset: 0;
}

/* ------------------------------------------------------------------ */
/* Button — icon-spacing modifier (Vanilla parity).                    */
/* Icon buttons make the icon/label relationship explicit. Bare text   */
/* nodes cannot be distinguished from icon-only buttons in CSS because */
/* :first-child/:last-child ignore text nodes. A real label slot lets   */
/* the component use one truthful, token-driven gap in either order.   */
/* ------------------------------------------------------------------ */

:where(.bf-theme) :where(.bf-button.is-icon) > :where(.bf-icon) {
  margin: 0;
}

:where(.bf-theme) :where(.bf-button.is-icon) {
  align-items: center;
  column-gap: var(--bf-space-1);
  display: inline-flex;
  justify-content: center;
}

/* An icon-only flex button has no text line box to preserve the occupied
 * control rhythm. A zero-width metric strut restores the active body line
 * without imposing a target block size or changing icon/label spacing. */
:where(.bf-theme) :where(.bf-button.is-icon:not(:has(.bf-button-label))) {
  column-gap: 0;
}

:where(.bf-theme) :where(.bf-button.is-icon:not(:has(.bf-button-label)))::before {
  block-size: var(--bf-body-line-height);
  content: "";
  inline-size: 0;
}

:where(.bf-theme) :where(.bf-button-label) {
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-actions) {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: var(--bf-field-gap);
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-actions.is-end) {
  justify-content: flex-end;
}

:where(.bf-theme) :where(.bf-actions.is-nowrap) {
  flex-wrap: nowrap;
  overflow-x: auto;
  scrollbar-width: thin;
}

:where(.bf-theme) :where(.bf-actions.is-nowrap) > * {
  flex: 0 0 auto;
}
`;
}
