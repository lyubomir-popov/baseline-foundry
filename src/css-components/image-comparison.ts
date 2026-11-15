import { allSidedStrokeOverlayCss } from "./stroke-paint.js";

export function imageComparisonCss(): string {
  const grip = ":where(.bf-theme) :where(.bf-image-comparison-grip)";
  const stroke = allSidedStrokeOverlayCss(grip, { anchor: "existing" });
  return `${stroke.owner}
${stroke.painter}

:where(.bf-theme) :where(.bf-image-comparison) {
  --bf-image-comparison-grip-inline-size: 1.5rem;
  --bf-image-comparison-grip-block-size: 80px;
  --bf-image-comparison-focus-width: 2px;
  --bf-image-comparison-focus-offset: 3px;
  --bf-image-comparison-position: 50%;
  box-sizing: border-box;
  min-inline-size: 0;
  padding-inline: calc(var(--bf-image-comparison-grip-inline-size) / 2 + var(--bf-image-comparison-focus-width) + var(--bf-image-comparison-focus-offset));
}

:where(.bf-theme) :where(.bf-image-comparison-stage) {
  position: relative;
  min-inline-size: 0;
  overflow: visible;
  touch-action: pan-y pinch-zoom;
  user-select: none;
  cursor: ew-resize;
}

:where(.bf-theme) :where(.bf-image-comparison-layer) {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

/* Visual slots retain their source's aspect ratio inside the common stage. */
:where(.bf-theme) :where(.bf-image-comparison-layer > img, .bf-image-comparison-layer > picture, .bf-image-comparison-layer > picture > img) {
  display: block;
  inline-size: 100%;
  block-size: 100%;
}

:where(.bf-theme) :where(.bf-image-comparison-layer > img, .bf-image-comparison-layer > picture > img) {
  object-fit: contain;
}

:where(.bf-theme) :where(.bf-image-comparison-layer.is-first) {
  clip-path: inset(0 calc(100% - var(--bf-image-comparison-position)) 0 0);
}

:where(.bf-theme) :where(.bf-image-comparison.is-rtl .bf-image-comparison-layer.is-first) {
  clip-path: inset(0 0 0 calc(100% - var(--bf-image-comparison-position)));
}

:where(.bf-theme) :where(.bf-image-comparison-seam, .bf-image-comparison-grip) {
  position: absolute;
  inset-inline-start: var(--bf-image-comparison-position);
  transform: translateX(-50%);
}

:where(.bf-theme) :where(.bf-image-comparison.is-rtl .bf-image-comparison-seam, .bf-image-comparison.is-rtl .bf-image-comparison-grip) {
  transform: translateX(50%);
}

:where(.bf-theme) :where(.bf-image-comparison-seam) {
  inset-block: 0;
  inline-size: 0.125rem;
  background: var(--bf-color-border-default);
  pointer-events: none;
}

:where(.bf-theme) :where(.bf-image-comparison-value) {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  margin: 0;
  opacity: 0;
  pointer-events: none;
}

:where(.bf-theme) :where(.bf-image-comparison-grip) {
  inset-block-start: 50%;
  translate: 0 -50%;
  display: grid;
  place-items: center;
  inline-size: var(--bf-image-comparison-grip-inline-size);
  block-size: var(--bf-image-comparison-grip-block-size);
  border: 0;
  border-radius: calc(var(--bf-image-comparison-grip-inline-size) / 2);
  background: var(--bf-color-bg);
  color: var(--bf-color-text-default);
  cursor: ew-resize;
}

:where(.bf-theme) :where(.bf-image-comparison:not(.is-pointer-focus):has(.bf-image-comparison-value:focus-visible) .bf-image-comparison-grip) {
  outline: var(--bf-image-comparison-focus-width) solid var(--bf-color-focus);
  outline-offset: var(--bf-image-comparison-focus-offset);
}

@media (forced-colors: active) {
  :where(.bf-theme) :where(.bf-image-comparison-seam) {
    background: CanvasText;
    forced-color-adjust: none;
  }
  :where(.bf-theme) :where(.bf-image-comparison-grip) {
    background: Canvas;
    color: CanvasText;
  }
  :where(.bf-theme) :where(.bf-image-comparison:not(.is-pointer-focus):has(.bf-image-comparison-value:focus-visible) .bf-image-comparison-grip) {
    outline-color: Highlight;
  }
}`;
}
