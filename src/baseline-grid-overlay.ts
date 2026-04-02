import { BASELINE_GRID_DARK_THEME_COLOR, BASELINE_GRID_DEFAULT_COLOR, BASELINE_GRID_LIGHT_THEME_COLOR } from "./baseline-grid-theme.js";

export interface BaselineGridOverlayOptions {
  baselineUnit: string;
}

export function generateBaselineGridOverlayCss(options: BaselineGridOverlayOptions): string {
  return `.u-baseline-grid {
  --bf-baseline-grid-color: ${BASELINE_GRID_DEFAULT_COLOR};
  --bf-baseline-grid-page-color: transparent;
  --bf-baseline-grid-offset: 0rem;
  --bf-baseline-grid-size: var(--bf-baseline, ${options.baselineUnit});
  position: relative;
}

.u-baseline-grid::after {
  background-image: linear-gradient(
    to top,
    var(--bf-baseline-grid-color),
    var(--bf-baseline-grid-color) 1px,
    transparent 1px,
    transparent
  );
  background-size: 100% var(--bf-baseline-grid-size);
  bottom: 0;
  content: "";
  display: block;
  left: 0;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: var(--bf-baseline-grid-offset);
  z-index: 200;
}

html.u-baseline-grid {
  background-color: var(--bf-baseline-grid-page-color);
  position: static;
}

html.u-baseline-grid::after {
  z-index: -1;
}`;
}

export function generateBaselineGridThemeOverrideCss(): string {
  return `:where(.bf-theme).u-baseline-grid,
:where(.bf-theme) .u-baseline-grid {
  --bf-baseline-grid-color: ${BASELINE_GRID_LIGHT_THEME_COLOR};
}

:where(.bf-theme.is-dark).u-baseline-grid,
:where(.bf-theme.is-dark) .u-baseline-grid {
  --bf-baseline-grid-color: ${BASELINE_GRID_DARK_THEME_COLOR};
}`;
}
