export function iconCss(): string {
  return `:where(.bf-theme) :where(.bf-icon) {
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
  overflow: hidden;
  padding: 0;
  text-indent: 110vw;
  transform: var(--bf-icon-transform);
  transform-origin: center;
  vertical-align: middle;
  white-space: nowrap;
}

:where(.bf-theme) :where(.bf-icon.is-medium) {
  --bf-icon-size: var(--bf-icon-size-medium);
}

:where(.bf-theme) :where(.bf-icon.is-large) {
  --bf-icon-size: var(--bf-icon-size-large);
}

:where(.bf-theme) :where(.bf-icon.is-x-large) {
  --bf-icon-size: var(--bf-icon-size-x-large);
}

:where(.bf-theme) :where(.bf-icon.is-xx-large) {
  --bf-icon-size: var(--bf-icon-size-xx-large);
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
