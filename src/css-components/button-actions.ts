import { allSidedStrokeOverlayCss } from "./stroke-paint.js";

type ButtonActionCssOptions = {
  bodyTypeStyles: string;
  buttonMarginBottom: string;
};

export function buttonActionsCss(options: ButtonActionCssOptions): string {
  const { bodyTypeStyles, buttonMarginBottom } = options;
  const buttonSelector = ":where(.bf-theme) :where(.bf-button:not(.is-icon:not(.is-nested):not(:has(.bf-button-label))), .bf-button.is-base:not(.is-icon:not(.is-nested):not(:has(.bf-button-label))))";
  const buttonStrokeCss = allSidedStrokeOverlayCss(buttonSelector, { anchor: "relative", color: "var(--bf-color-border-high-contrast)" });

  return `:where(.bf-theme) {
  --bf-pointer-target-minimum: 24px;
  --bf-pointer-target-separation: 0.0625rem;
}

:where(.bf-theme) :where(.bf-button, .bf-button.is-base) {
${bodyTypeStyles}  appearance: none;
  --bf-stroke-color: var(--bf-color-border-high-contrast);
  --bf-stroke-width: var(--bf-border-width);
  --bf-overlay-stroke-layer: inset 0 0 0 var(--bf-stroke-width) var(--bf-stroke-color);
  --bf-overlay-selection-layer: 0 0 0 0 transparent;
  --bf-overlay-focus-layer: 0 0 0 0 transparent;
  --bf-overlay-elevation-layer: 0 0 0 0 transparent;
  --bf-overlay-selection-block-start-width: 0rem;
  --bf-overlay-selection-block-end-width: 0rem;
  --bf-overlay-selection-inline-start-width: 0rem;
  --bf-overlay-selection-inline-end-width: 0rem;
  background-color: var(--bf-color-background-default);
  border: 0;
  border-radius: var(--bf-radius);
  color: var(--bf-color-text-default);
  cursor: pointer;
  display: inline-block;
  margin-bottom: ${buttonMarginBottom};
  padding-block: var(--bf-interface-row-padding-block);
  padding-inline: var(--bf-component-inline-inset-action);
  text-align: center;
  text-decoration: none;
}

${buttonStrokeCss.owner}

:where(.bf-theme) :where(.bf-button) {
  background-color: var(--bf-color-background-default);
}

:where(.bf-theme) :where(.bf-button.is-base) {
  --bf-stroke-color: transparent;
  background-color: transparent;
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
  --bf-overlay-focus-layer: 0 0 0 0 transparent;
  outline: none;
}

:where(.bf-theme) :where(.bf-button, .bf-button.is-base):focus-visible {
  --bf-overlay-focus-layer: inset 0 0 0 0.125rem var(--bf-color-focus);
  outline: none;
}

:where(.bf-theme) :where(.bf-button[aria-pressed='true']) {
  --bf-overlay-selection-block-end-width: var(--bf-bar-thickness);
  --bf-overlay-selection-layer: inset 0 calc(var(--bf-bar-thickness) * -1) 0 var(--bf-color-text-default);
}

/* ------------------------------------------------------------------ */
/* Button — semantic positive modifier (Vanilla parity).               */
/* Vanilla uses themed positive tokens for default/hover/active        */
/* backgrounds plus a white text colour on a coloured surface.         */
/* ------------------------------------------------------------------ */

:where(.bf-theme) :where(.bf-button.is-positive) {
  --bf-stroke-color: var(--bf-color-button-positive-default);
  background-color: var(--bf-color-button-positive-default);
  color: var(--bf-color-button-positive-text);
}

:where(.bf-theme) :where(.bf-button.is-positive:hover) {
  --bf-stroke-color: var(--bf-color-button-positive-hover);
  background-color: var(--bf-color-button-positive-hover);
  color: var(--bf-color-button-positive-text);
}

:where(.bf-theme) :where(.bf-button.is-positive:is(:active, [aria-pressed='true'])) {
  --bf-stroke-color: var(--bf-color-button-positive-active);
  background-color: var(--bf-color-button-positive-active);
  color: var(--bf-color-button-positive-text);
}

/* ------------------------------------------------------------------ */
/* Button — semantic negative modifier (Vanilla parity).               */
/* Vanilla uses themed negative tokens for default/hover/active        */
/* backgrounds plus a white text colour on a coloured surface.         */
/* ------------------------------------------------------------------ */

:where(.bf-theme) :where(.bf-button.is-negative) {
  --bf-stroke-color: var(--bf-color-button-negative-default);
  background-color: var(--bf-color-button-negative-default);
  color: var(--bf-color-button-negative-text);
}

:where(.bf-theme) :where(.bf-button.is-negative:hover) {
  --bf-stroke-color: var(--bf-color-button-negative-hover);
  background-color: var(--bf-color-button-negative-hover);
  color: var(--bf-color-button-negative-text);
}

:where(.bf-theme) :where(.bf-button.is-negative:is(:active, [aria-pressed='true'])) {
  --bf-stroke-color: var(--bf-color-button-negative-active);
  background-color: var(--bf-color-button-negative-active);
  color: var(--bf-color-button-negative-text);
}

/* ------------------------------------------------------------------ */
/* Button — link-style modifier (Vanilla parity).                      */
/* BF starts from the shared button control contract, so the modifier  */
/* has to strip control chrome and padding back down to inline-link    */
/* behavior while reusing the shared link tokens.                      */
/* ------------------------------------------------------------------ */

:where(.bf-theme) :where(.bf-button.is-link) {
  --bf-stroke-width: 0rem;
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
  --bf-overlay-focus-layer: inset 0 0 0 0.125rem var(--bf-color-focus);
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
  column-gap: var(--bf-leading-mark-gap);
  display: inline-flex;
  justify-content: center;
}

/* Icon-only buttons are the named command-family self-paint exception. Their
 * two pseudos already own the metric strut and the out-of-flow minimum pointer
 * target, so the root paints its stroke without adding layout geometry. */
:where(.bf-theme) :where(.bf-button.is-icon:not(.is-nested):not(:has(.bf-button-label))) {
  --bf-action-target-overflow: max(0rem, calc((var(--bf-pointer-target-minimum) - var(--bf-square-block-size)) / 2));

  box-shadow: var(--bf-overlay-stroke-layer), var(--bf-overlay-selection-layer), var(--bf-overlay-elevation-layer);
  column-gap: 0;
  justify-self: start;
  margin-inline: var(--bf-action-target-overflow);
  min-inline-size: var(--bf-square-block-size);
  padding-inline: 0;
  position: relative;
}

:where(.bf-theme) :where(.bf-button.is-icon:not(.is-nested):not(:has(.bf-button-label)):focus-visible) {
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: -0.125rem;
}

:where(.bf-theme) :where(.bf-button.is-icon:not(.is-nested):not(:has(.bf-button-label)))::before {
  block-size: var(--bf-body-line-height);
  content: "";
  inline-size: 0;
}

/* WCAG 2.2 SC 2.5.8 defines its minimum in CSS pixels. This transparent,
 * out-of-flow box extends only the pointer target; it does not change the
 * control's paint or occupied block geometry. */
:where(.bf-theme) :where(.bf-button.is-icon:not(.is-nested):not(:has(.bf-button-label)))::after {
  block-size: max(100%, var(--bf-pointer-target-minimum));
  box-shadow: none;
  content: "";
  inset: auto;
  inline-size: max(100%, var(--bf-pointer-target-minimum));
  left: 50%;
  pointer-events: auto;
  position: absolute;
  top: 50%;
  translate: -50% -50%;
}

@media (forced-colors: active) {
  :where(.bf-theme) :where(.bf-button, .bf-button.is-base):focus {
    outline: var(--bf-stroke-width) solid CanvasText;
    outline-offset: calc(var(--bf-stroke-width) * -1);
  }

  :where(.bf-theme) :where(.bf-button.is-icon:not(.is-nested):not(:has(.bf-button-label))) {
    box-shadow: none;
    outline: var(--bf-stroke-width) solid CanvasText;
    outline-offset: calc(var(--bf-stroke-width, var(--bf-border-width)) * -1);
  }

  :where(.bf-theme) :where(.bf-button.is-icon:not(.is-nested):not(:has(.bf-button-label))[aria-pressed='true']) {
    outline-style: double;
    outline-width: var(--bf-bar-thickness);
  }

  :where(.bf-theme) :where(.bf-button.is-icon:not(.is-nested):not(:has(.bf-button-label)):focus-visible)::after {
    outline: 0.125rem solid Highlight;
    outline-offset: -0.1875rem;
  }

  :where(.bf-theme) :where(.bf-button:not(.is-icon:not(.is-nested):not(:has(.bf-button-label))):focus-visible, .bf-button.is-base:not(.is-icon:not(.is-nested):not(:has(.bf-button-label))):focus-visible) {
    outline: 0.125rem solid Highlight;
    outline-offset: -0.1875rem;
  }
}

:where(.bf-theme) :where(.bf-button-label) {
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-actions) {
  --bf-action-target-row-gap-floor: var(--bf-baseline);

  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: var(--bf-field-gap);
  min-inline-size: 0;
}

/* Row-gap has no single-line cost and cannot move a flex item's paint. BF's
 * wrapping primitives therefore own a positive block-axis target separation
 * without inspecting their descendants through :has(). */
:where(.bf-theme) :where(.bf-actions:not(.is-nowrap)) {
  row-gap: max(var(--bf-field-gap), var(--bf-action-target-row-gap-floor));
}

:where(.bf-theme) :where(.bf-cluster:not(.is-nowrap)) {
  --bf-action-target-row-gap-floor: var(--bf-baseline);

  row-gap: max(var(--bf-cluster-space), var(--bf-action-target-row-gap-floor));
}

:where(.bf-theme) :where(.bf-actions.is-end) {
  justify-content: flex-end;
}

:where(.bf-theme) :where(.bf-actions.is-nowrap) {
  flex-wrap: nowrap;
  overflow-x: auto;
  scrollbar-width: thin;
}

:where(.bf-theme) :where(.bf-actions.is-nowrap:has(> .bf-button.is-icon:not(.is-nested))) {
  --bf-action-target-block-clearance: var(--bf-baseline);

  padding-block: var(--bf-action-target-block-clearance);
}

/* A nowrap row becomes a clipping scrollport. The parent rule above reserves
 * block overflow only when a direct icon-only target is present, so text-only
 * strips keep their original block size and leading keyline. Existing
 * target-owned inline margins supply the logical-edge scroll extent; these
 * child rules retain only ordinary row compensation. */
:where(.bf-theme) :where(.bf-actions.is-nowrap) > :where(.bf-button.is-icon:not(.is-nested):not(:has(.bf-button-label))) {
  margin-block-end: ${buttonMarginBottom};
}

:where(.bf-theme) :where(.bf-actions.is-nowrap) > :where(.bf-button.is-link.is-icon:not(.is-nested):not(:has(.bf-button-label))) {
  margin-block-end: 0;
}

/* Modern CSS rounds the exact inter-row and per-edge scrollport shortfalls up
 * to the active baseline. The one-baseline fallback is safe for built-in tiers
 * and remains on phase in older engines. */
@supports (row-gap: round(up, 0.0625rem, 0.0625rem)) {
  :where(.bf-theme) :where(.bf-actions:not(.is-nowrap), .bf-cluster:not(.is-nowrap)) {
    --bf-action-target-row-gap-floor: round(up, max(0rem, calc(var(--bf-pointer-target-minimum) - var(--bf-body-line-height) + var(--bf-pointer-target-separation))), var(--bf-baseline));
  }

  :where(.bf-theme) :where(.bf-actions.is-nowrap:has(> .bf-button.is-icon:not(.is-nested))) {
    --bf-action-target-block-clearance: round(up, max(0rem, calc((var(--bf-pointer-target-minimum) - var(--bf-body-line-height)) / 2)), var(--bf-baseline));
  }
}

:where(.bf-theme) :where(.bf-actions.is-nowrap) > * {
  flex: 0 0 auto;
}
${buttonStrokeCss.painter}
`;
}
