export function listCss({ bodyTypeStyles }: { bodyTypeStyles: string }): string {
  return `:where(.bf-theme) :where(.bf-list) {
  align-content: start;
  display: grid;
  list-style: none;
  margin: 0;
  padding: 0;
}

:where(.bf-theme) :where(.bf-list:has(> .bf-list-item:is(.is-ticked, .is-crossed)), ol.bf-list.is-divided) {
  padding-inline-start: var(--bf-leading-mark-group-inset);
}

:where(.bf-theme) :where(.bf-list-item) {
${bodyTypeStyles}  color: var(--bf-color-text-default);
  margin: 0 0 var(--bf-body-margin-bottom);
  min-inline-size: 0;
  overflow-wrap: anywhere;
  padding-block-end: 0;
  padding-block-start: var(--bf-body-nudge-start);
}

:where(.bf-theme) :where(.bf-list.is-divided) > :where(.bf-list-item) {
  border-block: var(--bf-border-width) solid transparent;
  box-shadow: inset 0 0.0625rem 0 var(--bf-color-border-low-contrast);
  margin-block-end: var(--bf-single-line-row-margin-block-end);
  padding-block: var(--bf-single-line-row-padding-block);
}

:where(.bf-theme) :where(.bf-list.is-divided) > :where(.bf-list-item:first-child) {
  box-shadow: none;
}

:where(.bf-theme) :where(.bf-list-item.is-ticked, .bf-list-item.is-crossed) {
  padding-inline-start: var(--bf-leading-mark-offset);
  position: relative;
}

:where(.bf-theme) :where(.bf-list-item.is-ticked)::before,
:where(.bf-theme) :where(.bf-list-item.is-crossed)::before {
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  block-size: var(--bf-leading-icon-size);
  content: "";
  inline-size: var(--bf-leading-icon-size);
  left: 0;
  position: absolute;
  top: var(--bf-leading-icon-offset);
}

:where(.bf-theme) :where(.bf-list-item.is-ticked)::before {
  background-image: var(--bf-ui-icon-success-grey);
}

:where(.bf-theme) :where(.bf-list-item.is-crossed)::before {
  background-image: var(--bf-ui-icon-error-grey);
}

:where(.bf-theme) :where(ol.bf-list.is-divided) {
  counter-reset: bf-list-counter;
}

:where(.bf-theme) :where(ol.bf-list.is-divided) > :where(.bf-list-item) {
  counter-increment: bf-list-counter;
  list-style: none;
  padding-inline-start: calc(var(--bf-baseline) * 4);
  position: relative;
}

:where(.bf-theme) :where(ol.bf-list.is-divided) > :where(.bf-list-item)::before {
${bodyTypeStyles}  color: var(--bf-color-text-default);
  content: counters(bf-list-counter, ".") ".";
  inline-size: calc(var(--bf-baseline) * 2.5);
  left: 0;
  position: absolute;
  text-align: right;
  top: var(--bf-body-nudge-start);
}

:where(.bf-theme) :where(.bf-list-item) > :where(.bf-list) {
  margin-inline-start: calc(var(--bf-baseline) * 3);
  padding-block-start: var(--bf-body-nudge-end);
}

:where(.bf-theme) :where(.bf-list-item.is-ticked, .bf-list-item.is-crossed) > :where(.bf-list) {
  margin-inline-start: 0;
}

:where(.bf-theme) :where(.bf-inline-list) {
  margin: 0;
  padding: 0;
}

:where(.bf-theme) :where(.bf-inline-list-item) {
${bodyTypeStyles}  display: inline-block;
  list-style: none;
  margin-inline-end: calc(var(--bf-baseline) * 1.5);
  padding-block-end: var(--bf-body-nudge-end);
  padding-block-start: var(--bf-body-nudge-start);
}

:where(.bf-theme) :where(.bf-inline-list-item:last-of-type) {
  margin-inline-end: 0;
}

:where(.bf-theme) :where(.bf-inline-list.is-middot) :where(.bf-inline-list-item) {
  margin-inline-end: calc(var(--bf-baseline) * 1);
  position: relative;
}

:where(.bf-theme) :where(.bf-inline-list.is-middot) :where(.bf-inline-list-item)::after {
  content: "\\2022";
  display: inline;
  margin-inline-start: calc(var(--bf-baseline) * 0.25);
}

:where(.bf-theme) :where(.bf-inline-list.is-middot) :where(.bf-inline-list-item:last-of-type)::after {
  content: "";
}`;
}
