export function ctaFigureAspectCss(): string {
  return `/* ------------------------------------------------------------------ */
/* CTA block (Vanilla parity).                                         */
/* Inline-row of call-to-action items (typically a heading and one or  */
/* more buttons or links). Element-owned spacing: borderless by        */
/* default, .is-bordered adds a top divider rule and small padding.    */
/* (Vanilla ships the same modifier as has-border; renamed for the BF  */
/* is-* convention.)                                                    */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */

:where(.bf-theme) :where(.bf-cta-block) {
  align-items: baseline;
  column-gap: var(--bf-space-2);
  display: flex;
  flex-wrap: wrap;
  margin-block-end: var(--bf-section-space-shallow);
  row-gap: var(--bf-space-1);
}

:where(.bf-theme) :where(.bf-cta-block.is-bordered) {
  border-block-start: var(--bf-border-width) solid var(--bf-color-border-low-contrast);
  padding-block-start: calc(var(--bf-space-1) - var(--bf-border-width));
}

/* ------------------------------------------------------------------ */
/* Figure (Vanilla parity).                                            */
/* Native <figure> wrapper for an image, video, or other media plus    */
/* an italic caption. Element-owned bottom spacing matches Vanilla’s   */
/* base figure margin; the caption owns its own top space so the       */
/* image sits flush against the next baseline above its caption.       */
/* ------------------------------------------------------------------ */

:where(.bf-theme) :where(.bf-figure) {
  display: block;
  inline-size: 100%;
  margin: 0 0 var(--bf-section-space-shallow);
}

:where(.bf-theme) :where(.bf-figure) > :where(img, picture, video, canvas) {
  block-size: auto;
  display: block;
  inline-size: 100%;
  max-inline-size: 100%;
}

:where(.bf-theme) :where(.bf-figure-caption) {
  color: var(--bf-color-text-default);
  display: block;
  font-style: italic;
  inline-size: 100%;
  margin-block: var(--bf-space-1) 0;
}

/* ------------------------------------------------------------------ */
/* Aspect — generic aspect-ratio slot.                                 */
/* Reserves a fixed-ratio box so embedded media (img/picture/video/    */
/* canvas/iframe) load without layout shift. Composes inside bf-figure */
/* when a constrained captioned image is needed.                       */
/* ------------------------------------------------------------------ */

:where(.bf-theme) :where(.bf-aspect) {
  aspect-ratio: 16 / 9;
  display: block;
  inline-size: 100%;
  overflow: hidden;
  position: relative;
}

:where(.bf-theme) :where(.bf-aspect.is-16-9) {
  aspect-ratio: 16 / 9;
}

:where(.bf-theme) :where(.bf-aspect.is-3-2) {
  aspect-ratio: 3 / 2;
}

:where(.bf-theme) :where(.bf-aspect.is-2-3) {
  aspect-ratio: 2 / 3;
}

:where(.bf-theme) :where(.bf-aspect.is-cinematic) {
  aspect-ratio: 12 / 5;
}

:where(.bf-theme) :where(.bf-aspect.is-square) {
  aspect-ratio: 1 / 1;
}

:where(.bf-theme) :where(.bf-aspect) > :where(img, picture, video, canvas, iframe) {
  block-size: 100%;
  display: block;
  inline-size: 100%;
  object-fit: cover;
}
`;
}