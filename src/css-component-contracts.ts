import type { ComponentTokens, ThemeSurface, ThemeTokens } from "./types.js";

function componentInputDeclarations(components: ComponentTokens): string {
  return `  --bf-border-width: ${components.borderWidth};
  --bf-bar-thickness: ${components.barThickness};
  --bf-radius: ${components.radius};
  --bf-component-inline-inset-field: ${components.inlineInsetField};
  --bf-component-inline-inset-action: ${components.inlineInsetAction};
  --bf-component-inline-inset-continuation: ${components.inlineInsetContinuation};
  --bf-component-inline-inset-action-bordered: max(0rem, calc(var(--bf-component-inline-inset-action) - var(--bf-border-width)));
  --bf-control-visual-size: ${components.controlVisualSize};
  --bf-field-gap: ${components.fieldGap};
  --bf-panel-padding-inline: ${components.panelPaddingInline};
  --bf-panel-padding-block: ${components.panelPaddingBlock};
`;
}

/**
 * Shared component spacing contracts. Tier scopes provide facts; every
 * derived value below remains expressed in those facts so class-scoped and
 * direct tier bundles use identical geometry.
 */
export function componentContractsCss(tokens: ThemeTokens, themeSurfaces: ThemeSurface[] = []): string {
  const body = tokens.roles.body;
  const bodyLineHeight = `var(--bf-body-line-height, ${body.lineHeight})`;
  const bodyNudgeStart = `var(--bf-body-nudge-start, ${body.nudgeTop})`;

  return `:where(.bf-theme) {
${componentInputDeclarations(tokens.components)}  /* Three authoritative component content insets. Page margins, grid
     gutters, surface placement and navigation depth remain structural. */

  /* Regular single-line interface rows use one metric-derived occupied block.
     Visible and transparent block borders both consume the frame slots. */
  --bf-interface-row-line-height: ${bodyLineHeight};
  --bf-interface-row-padding-block: max(0rem, calc(${bodyNudgeStart} - var(--bf-border-width)));
  --bf-interface-row-painted-block-size: calc(var(--bf-interface-row-line-height) + (var(--bf-interface-row-padding-block) * 2) + (var(--bf-border-width) * 2));
  --bf-interface-row-compensation-block-end: mod(calc(var(--bf-baseline) - mod(var(--bf-interface-row-painted-block-size), var(--bf-baseline))), var(--bf-baseline));
  --bf-interface-row-occupied-block-size: calc(var(--bf-interface-row-painted-block-size) + var(--bf-interface-row-compensation-block-end));
  --bf-interface-row-content-offset-block-start: calc(var(--bf-border-width) + var(--bf-interface-row-padding-block));
  --bf-interface-row-visual-offset: calc(var(--bf-interface-row-content-offset-block-start) + ((var(--bf-interface-row-line-height) - var(--bf-control-visual-size)) / 2));

  /* Host-owned rows keep the same occupied target but absorb compensation
     inside the box. A ruled host subtracts its separator in its own module. */
  --bf-in-box-row-padding-block-start: var(--bf-interface-row-content-offset-block-start);
  --bf-in-box-row-padding-block-end: max(0rem, calc(var(--bf-interface-row-occupied-block-size) - var(--bf-interface-row-line-height) - var(--bf-in-box-row-padding-block-start)));

  /* Nested children fit inside the host body line and contribute no external
     compensation. Zero-footprint surfaces and real two-border controls use
     the body line minus one baseline; build validation proves that this line
     can contain the font, visual and framed ledgers for every tier. */
  --bf-nested-row-line-height: calc(var(--bf-interface-row-line-height) - var(--bf-baseline));
  --bf-nested-row-padding-block: max(0rem, calc((var(--bf-interface-row-line-height) - var(--bf-nested-row-line-height)) / 2));
  --bf-nested-row-painted-block-size: calc(var(--bf-nested-row-line-height) + (var(--bf-nested-row-padding-block) * 2));
  --bf-nested-framed-row-padding-block: max(0rem, calc((var(--bf-interface-row-line-height) - var(--bf-nested-row-line-height) - (var(--bf-border-width) * 2)) / 2));
  --bf-nested-framed-row-painted-block-size: calc(var(--bf-nested-row-line-height) + (var(--bf-nested-framed-row-padding-block) * 2) + (var(--bf-border-width) * 2));
  --bf-nested-framed-row-visual-offset: calc(var(--bf-border-width) + var(--bf-nested-framed-row-padding-block) + ((var(--bf-nested-row-line-height) - var(--bf-control-visual-size)) / 2));

  /* Block-derived members consume one inline-minimum name. The default is
     the regular framed paint; selectors below re-point the name to what each
     member actually paints, rather than to the row ledger it occupies. */
  --bf-square-block-size: var(--bf-interface-row-painted-block-size);

  /* Leading marks are positioned backwards from the continuation copy inset;
     a mark never creates a fourth content inset. */
  --bf-leading-mark-size: var(--bf-control-visual-size);
  --bf-leading-mark-gap: var(--bf-field-gap);
  --bf-leading-mark-offset: calc(var(--bf-leading-mark-size) + var(--bf-leading-mark-gap));
  --bf-leading-mark-group-inset: calc(var(--bf-component-inline-inset-continuation) - var(--bf-leading-mark-offset));
  --bf-tick-label-offset: var(--bf-leading-mark-offset);
}

:where(.bf-theme) :where(.bf-badge) {
  --bf-square-block-size: var(--bf-interface-row-line-height);
}

:where(.bf-theme) :where(.bf-badge.is-nested) {
  --bf-square-block-size: var(--bf-nested-row-line-height);
}

:where(.bf-theme) :where(.bf-button.is-link.is-icon:not(.is-nested):not(:has(.bf-button-label))) {
  --bf-square-block-size: var(--bf-body-line-height);
}

:where(.bf-theme) :where(.bf-notification-close) {
  --bf-square-block-size: var(--bf-notification-close-painted-block-size);
}

${themeSurfaces
  .filter(surface => surface.className)
  .map(surface => `:where(.bf-theme.${surface.className}) {\n${componentInputDeclarations(surface.tokens.components)}}`)
  .join("\n\n")}
`;
}
