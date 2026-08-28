type EditorialContentCssOptions = {
  noticeTitleTypeStyles: string;
};

/** Content-level editorial roles kept separate from layout composition. */
export function editorialContentCss(options: EditorialContentCssOptions): string {
  const { noticeTitleTypeStyles } = options;

  return `/* ------------------------------------------------------------------ */
/* Editorial content roles                                             */
/* ------------------------------------------------------------------ */

:where(.bf-theme) :where(.bf-notice, .bf-notice.is-information, .bf-notice.is-positive, .bf-notice.is-caution, .bf-notice.is-negative) {
  --bf-notice-background: var(--bf-color-background-neutral-default);
  --bf-notice-border: var(--bf-color-border-neutral);
  background: var(--bf-notice-background);
  border-inline-start: var(--bf-bar-thickness) solid var(--bf-notice-border);
  color: var(--bf-color-text-default);
  display: flow-root;
  margin: 0;
  max-inline-size: 100%;
  padding-block: var(--bf-space-2);
  padding-inline: var(--bf-space-2);
}

:where(.bf-theme) :where(.bf-notice.is-information) {
  --bf-notice-background: var(--bf-color-background-information-default);
  --bf-notice-border: var(--bf-color-border-information);
}

:where(.bf-theme) :where(.bf-notice.is-positive) {
  --bf-notice-background: var(--bf-color-background-positive-default);
  --bf-notice-border: var(--bf-color-border-positive);
}

:where(.bf-theme) :where(.bf-notice.is-caution) {
  --bf-notice-background: var(--bf-color-background-caution-default);
  --bf-notice-border: var(--bf-color-border-caution);
}

:where(.bf-theme) :where(.bf-notice.is-negative) {
  --bf-notice-background: var(--bf-color-background-negative-default);
  --bf-notice-border: var(--bf-color-border-negative);
}

:where(.bf-theme) :where(.bf-notice-title, .bf-notice-content) {
  max-inline-size: 100%;
  overflow-wrap: anywhere;
}

:where(.bf-theme) :where(.bf-notice-title) {
${noticeTitleTypeStyles}  margin-block: 0 var(--bf-h4-margin-bottom);
  padding-block-end: 0;
  padding-block-start: var(--bf-h4-nudge-start);
}
`;
}
