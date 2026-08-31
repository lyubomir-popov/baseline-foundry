type ControlGeometryCssOptions = {
  bodyLineHeight: string;
  bodySelectedStartNudge: string;
};

export function alignedVisualStart(lineHeight: string, visualSize: string, startNudge: string, offset = "0rem"): string {
  const base = `${startNudge} + ((${lineHeight} - ${visualSize}) / 2)`;
  return offset === "0rem" ? `calc(${base})` : `calc(${base} + ${offset})`;
}

/**
 * Shared geometry for single-line controls and prose marks that align with
 * those controls. Component selectors consume these facts; they do not
 * redefine the alignment model locally.
 */
export function controlGeometryCss(options: ControlGeometryCssOptions): string {
  const { bodyLineHeight, bodySelectedStartNudge } = options;

  return `:where(.bf-theme) {
  --bf-slider-track-size: calc(var(--bf-baseline) * 0.25);
  --bf-slider-row-block-size: var(--bf-interface-row-occupied-block-size);
  --bf-slider-track-offset: ${alignedVisualStart(bodyLineHeight, "var(--bf-slider-track-size)", bodySelectedStartNudge)};
  --bf-switch-track-offset: var(--bf-interface-row-visual-offset);
  --bf-tick-box-offset: var(--bf-interface-row-visual-offset);
  --bf-radio-dot-size: calc((var(--bf-control-visual-size) * 0.375) + var(--bf-border-width));
  --bf-list-marker-dot-size: calc(var(--bf-border-width) * 4);
}
`;
}
