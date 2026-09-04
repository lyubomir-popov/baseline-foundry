export function iconCss(): string {
  return `:where(.bf-theme) {
  --bf-icon-size-default: 1rem;
  --bf-icon-size-medium: 2.5rem;
  --bf-icon-size-large: 4rem;
  --bf-icon-size-x-large: 4.5rem;
  --bf-icon-size-xx-large: 6rem;
  /* Vanilla's inline-icon metric aligns icon paint to the cap-height centre.
     Half the scalable border supplies the optical lift. */
  --bf-inline-icon-baseline-shift: calc((var(--bf-border-width) * 0.5) + ((1cap - var(--bf-icon-size-default)) / 2));
  /* The default icon can meet the compact body line at a raster edge. Trim its
     layout margin by one scalable border without moving its cap-centred paint. */
  --bf-inline-icon-line-box-trim: calc(var(--bf-border-width) * -1);
  --bf-leading-icon-size: var(--bf-leading-mark-size);
  --bf-leading-icon-gap: var(--bf-leading-mark-gap);
  --bf-leading-icon-offset: var(--bf-interface-row-visual-offset);
}

:where(.bf-theme) :where(.bf-icon) {
  --bf-icon-image: none;
  --bf-icon-size: var(--bf-icon-size-default);
  --bf-icon-transform: none;
  background-image: var(--bf-icon-image);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  block-size: var(--bf-icon-size);
  display: inline-block;
  flex: 0 0 auto;
  inline-size: var(--bf-icon-size);
  margin: 0;
  margin-block-start: var(--bf-inline-icon-line-box-trim);
  overflow: hidden;
  padding: 0;
  text-indent: 110vw;
  transform: var(--bf-icon-transform);
  transform-origin: center;
  vertical-align: calc(var(--bf-inline-icon-baseline-shift) + ((var(--bf-icon-size-default) - var(--bf-icon-size)) / 2));
  white-space: nowrap;
}

:where(.bf-theme) :where(.bf-icon.is-medium) {
  --bf-icon-size: var(--bf-icon-size-medium);
  --bf-inline-icon-line-box-trim: 0rem;
}

:where(.bf-theme) :where(.bf-icon.is-large) {
  --bf-icon-size: var(--bf-icon-size-large);
  --bf-inline-icon-line-box-trim: 0rem;
}

:where(.bf-theme) :where(.bf-icon.is-x-large) {
  --bf-icon-size: var(--bf-icon-size-x-large);
  --bf-inline-icon-line-box-trim: 0rem;
}

:where(.bf-theme) :where(.bf-icon.is-xx-large) {
  --bf-icon-size: var(--bf-icon-size-xx-large);
  --bf-inline-icon-line-box-trim: 0rem;
}

:where(.bf-theme) :where(.bf-icon.is-search) {
  --bf-icon-image: var(--bf-ui-icon-search);
}

:where(.bf-theme) :where(.bf-icon.is-close) {
  --bf-icon-image: var(--bf-ui-icon-close);
}

:where(.bf-theme) :where(.bf-icon.is-error-grey) {
  --bf-icon-image: var(--bf-ui-icon-error-grey);
}

:where(.bf-theme) :where(.bf-icon.is-chevron-down) {
  --bf-icon-image: var(--bf-ui-icon-chevron-down);
}

:where(.bf-theme) :where(.bf-icon.is-chevron-up) {
  --bf-icon-image: var(--bf-ui-icon-chevron-down);
  --bf-icon-transform: rotate(180deg);
}

:where(.bf-theme) :where(.bf-icon.is-chevron-right) {
  --bf-icon-image: var(--bf-ui-icon-chevron-down);
  --bf-icon-transform: rotate(-90deg);
}

:where(.bf-theme) :where(.bf-icon.is-chevron-left) {
  --bf-icon-image: var(--bf-ui-icon-chevron-down);
  --bf-icon-transform: rotate(90deg);
}

:where(.bf-theme) :where(.bf-icon.is-success-grey) {
  --bf-icon-image: var(--bf-ui-icon-success-grey);
}
`;
}
