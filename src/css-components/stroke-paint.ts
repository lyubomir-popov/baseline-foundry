type StrokeOverlayOptions = {
  anchor: "relative" | "existing";
  color?: string;
  width?: string;
};

type StrokeOverlayCss = {
  owner: string;
  painter: string;
};

/**
 * Paints a component boundary in an automatic last-child pseudo-element.
 * Every owner resets the four composable paint slots locally so nested paint
 * owners cannot inherit a parent state. The overlay never participates in
 * layout or pointer routing and introduces no wrapper, isolation, or z-index.
 */
export function allSidedStrokeOverlayCss(ownerSelector: string, options: StrokeOverlayOptions): StrokeOverlayCss {
  const color = options.color ?? "var(--bf-color-border-default)";
  const width = options.width ?? "var(--bf-border-width)";
  const anchorDeclaration = options.anchor === "relative" ? "\n  position: relative;" : "";

  return {
    owner: `${ownerSelector} {
  --bf-stroke-color: ${color};
  --bf-stroke-width: ${width};
  --bf-overlay-stroke-layer: inset 0 0 0 var(--bf-stroke-width) var(--bf-stroke-color);
  --bf-overlay-selection-layer: 0 0 0 0 transparent;
  --bf-overlay-focus-layer: 0 0 0 0 transparent;
  --bf-overlay-elevation-layer: 0 0 0 0 transparent;
  --bf-overlay-selection-block-start-width: 0rem;
  --bf-overlay-selection-block-end-width: 0rem;
  --bf-overlay-selection-inline-start-width: 0rem;
  --bf-overlay-selection-inline-end-width: 0rem;${anchorDeclaration}
}`,
    painter: `${ownerSelector}::after {
  background: none;
  border: 0 solid transparent;
  border-radius: inherit;
  block-size: auto;
  box-shadow: var(--bf-overlay-stroke-layer), var(--bf-overlay-selection-layer), var(--bf-overlay-focus-layer), var(--bf-overlay-elevation-layer);
  box-sizing: border-box;
  content: "";
  display: block;
  inset: 0;
  inline-size: auto;
  pointer-events: none;
  position: absolute;
  transform: none;
}

@media (forced-colors: active) {
  ${ownerSelector}::after {
    border-block-end: var(--bf-overlay-selection-block-end-width) solid SelectedItem;
    border-block-start: var(--bf-overlay-selection-block-start-width) solid SelectedItem;
    border-inline-end: var(--bf-overlay-selection-inline-end-width) solid SelectedItem;
    border-inline-start: var(--bf-overlay-selection-inline-start-width) solid SelectedItem;
    box-shadow: none;
    outline: var(--bf-stroke-width) solid CanvasText;
    outline-offset: calc(var(--bf-stroke-width) * -1);
  }
}`
  };
}

/**
 * Paints a field's one-sided block-end boundary without contributing a layout
 * border. Forced colours use a real out-of-flow logical border on the same
 * automatic last-child overlay.
 */
export function blockEndStrokeOverlayCss(ownerSelector: string, options: StrokeOverlayOptions): StrokeOverlayCss {
  const color = options.color ?? "var(--bf-color-border-high-contrast)";
  const width = options.width ?? "var(--bf-border-width)";
  const anchorDeclaration = options.anchor === "relative" ? "\n  position: relative;" : "";

  return {
    owner: `${ownerSelector} {
  --bf-stroke-color: ${color};
  --bf-stroke-width: ${width};
  --bf-overlay-stroke-layer: inset 0 calc(var(--bf-stroke-width) * -1) 0 var(--bf-stroke-color);
  --bf-overlay-selection-layer: 0 0 0 0 transparent;
  --bf-overlay-focus-layer: 0 0 0 0 transparent;
  --bf-overlay-elevation-layer: 0 0 0 0 transparent;
  --bf-overlay-selection-block-start-width: 0rem;
  --bf-overlay-selection-block-end-width: 0rem;
  --bf-overlay-selection-inline-start-width: 0rem;
  --bf-overlay-selection-inline-end-width: 0rem;${anchorDeclaration}
}`,
    painter: `${ownerSelector}::after {
  background: none;
  border: 0 solid transparent;
  border-radius: inherit;
  block-size: auto;
  box-shadow: var(--bf-overlay-stroke-layer), var(--bf-overlay-selection-layer), var(--bf-overlay-focus-layer), var(--bf-overlay-elevation-layer);
  box-sizing: border-box;
  content: "";
  display: block;
  inset: 0;
  inline-size: auto;
  pointer-events: none;
  position: absolute;
  transform: none;
}

@media (forced-colors: active) {
  ${ownerSelector}::after {
    border-block-end: var(--bf-stroke-width) solid CanvasText;
    box-shadow: none;
  }
}`
  };
}
