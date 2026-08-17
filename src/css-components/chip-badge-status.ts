type ChipBadgeStatusCssOptions = {
  bodyCaseTypeStyles: string;
  bodyLineHeight: string;
  bodySelectedStartNudge: string;
  h5SelectedEndNudge: string;
  h5SelectedStartNudge: string;
  bodyTypeStyles: string;
};

export function chipBadgeStatusCss(options: ChipBadgeStatusCssOptions): string {
  const {
    bodyCaseTypeStyles,
    bodyLineHeight,
    bodySelectedStartNudge,
    h5SelectedEndNudge,
    h5SelectedStartNudge,
    bodyTypeStyles,
  } = options;

  return `:where(.bf-theme) :where(.bf-chip, .bf-chip.is-positive, .bf-chip.is-caution, .bf-chip.is-negative, .bf-chip.is-information) {
  --bf-ui-chip-border: var(--bf-color-border-neutral);
  --bf-ui-chip-border-hover: var(--bf-color-border-neutral);
  --bf-ui-chip-border-active: var(--bf-color-border-neutral);
  --bf-ui-chip-background: var(--bf-color-background-neutral-default);
  --bf-ui-chip-background-hover: var(--bf-color-background-neutral-hover);
  --bf-ui-chip-background-active: var(--bf-color-background-neutral-active);
${bodyTypeStyles}  align-items: baseline;
  background-color: var(--bf-ui-chip-background);
  border: var(--bf-border-width) solid var(--bf-ui-chip-border);
  border-radius: 1rem;
  color: var(--bf-color-text-default);
  display: inline-flex;
  gap: 0;
  margin: 0 var(--bf-ui-chip-padding-inline) var(--bf-field-gap) 0;
  max-inline-size: 100%;
  min-block-size: var(--bf-ui-chip-block-size);
  padding-block: var(--bf-ui-chip-padding-block);
  padding-inline: var(--bf-ui-chip-padding-inline);
  position: relative;
  text-decoration: none;
  user-select: none;
  vertical-align: calc(var(--bf-border-width) - ${bodySelectedStartNudge});
  white-space: nowrap;
}

:where(.bf-theme) :where(.bf-chip.is-positive) {
  --bf-ui-chip-border: var(--bf-color-border-positive);
  --bf-ui-chip-border-hover: var(--bf-color-border-positive);
  --bf-ui-chip-border-active: var(--bf-color-border-positive);
  --bf-ui-chip-background: var(--bf-color-background-positive-default);
  --bf-ui-chip-background-hover: var(--bf-color-background-positive-hover);
  --bf-ui-chip-background-active: var(--bf-color-background-positive-active);
}

:where(.bf-theme) :where(.bf-chip.is-caution) {
  --bf-ui-chip-border: var(--bf-color-border-caution);
  --bf-ui-chip-border-hover: var(--bf-color-border-caution);
  --bf-ui-chip-border-active: var(--bf-color-border-caution);
  --bf-ui-chip-background: var(--bf-color-background-caution-default);
  --bf-ui-chip-background-hover: var(--bf-color-background-caution-hover);
  --bf-ui-chip-background-active: var(--bf-color-background-caution-active);
}

:where(.bf-theme) :where(.bf-chip.is-negative) {
  --bf-ui-chip-border: var(--bf-color-border-negative);
  --bf-ui-chip-border-hover: var(--bf-color-border-negative);
  --bf-ui-chip-border-active: var(--bf-color-border-negative);
  --bf-ui-chip-background: var(--bf-color-background-negative-default);
  --bf-ui-chip-background-hover: var(--bf-color-background-negative-hover);
  --bf-ui-chip-background-active: var(--bf-color-background-negative-active);
}

:where(.bf-theme) :where(.bf-chip.is-information) {
  --bf-ui-chip-border: var(--bf-color-border-information);
  --bf-ui-chip-border-hover: var(--bf-color-border-information);
  --bf-ui-chip-border-active: var(--bf-color-border-information);
  --bf-ui-chip-background: var(--bf-color-background-information-default);
  --bf-ui-chip-background-hover: var(--bf-color-background-information-hover);
  --bf-ui-chip-background-active: var(--bf-color-background-information-active);
}

:where(.bf-theme) :where(.bf-chip, .bf-chip.is-positive, .bf-chip.is-caution, .bf-chip.is-negative, .bf-chip.is-information):hover {
  background-color: var(--bf-ui-chip-background-hover);
  border-color: var(--bf-ui-chip-border-hover);
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-chip, .bf-chip.is-positive, .bf-chip.is-caution, .bf-chip.is-negative, .bf-chip.is-information):is(:active, [aria-pressed='true'], .is-selected) {
  background-color: var(--bf-ui-chip-background-active);
  border-color: var(--bf-ui-chip-border-active);
}

:where(.bf-theme) :where(.bf-chip-lead, .bf-chip-value) {
${bodyTypeStyles}  color: var(--bf-color-text-default);
  display: inline;
  margin: 0;
  min-inline-size: 0;
  overflow: hidden;
  padding: 0;
  text-overflow: ellipsis;
  vertical-align: baseline;
}

:where(.bf-theme) :where(.bf-chip-lead) {
${bodyCaseTypeStyles}  color: var(--bf-color-text-muted);
}

:where(.bf-theme) :where(.bf-chip-lead + .bf-chip-value)::before {
${bodyTypeStyles}  color: var(--bf-color-text-muted);
  color: var(--bf-color-text-muted);
  content: ": ";
}

:where(.bf-theme) :where(.bf-badge, .bf-badge.is-negative) {
${bodyTypeStyles}  align-items: center;
  background-color: var(--bf-color-text-default);
  border-radius: 1rem;
  box-sizing: content-box;
  color: var(--bf-color-background-default);
  display: inline-block;
  margin: 0;
  max-inline-size: 4ch;
  min-width: calc(${bodyLineHeight} - (var(--bf-ui-badge-padding-inline) * 2));
  overflow: hidden;
  padding-block: 0;
  padding-inline: var(--bf-ui-badge-padding-inline);
  text-align: center;
  text-indent: 0;
}

:where(.bf-theme) :where(.bf-badge.is-negative) {
  background-color: var(--bf-color-button-negative-default);
  color: var(--bf-color-button-negative-text);
}

:where(.bf-theme) :where(.bf-chip, .bf-chip.is-positive, .bf-chip.is-caution, .bf-chip.is-negative, .bf-chip.is-information) :where(.bf-badge, .bf-badge.is-negative) {
  align-self: center;
  margin-inline-end: var(--bf-ui-badge-overhang);
  margin-inline-start: var(--bf-ui-chip-padding-inline);
}

:where(.bf-theme) :where(.bf-status-label, .bf-status-label.is-positive, .bf-status-label.is-caution, .bf-status-label.is-information, .bf-status-label.is-negative) {
  --bf-ui-status-background: color-mix(in srgb, var(--bf-color-background-alt) 70%, black);
  --bf-ui-status-color: var(--bf-color-button-positive-text);
  background-color: var(--bf-ui-status-background);
  color: var(--bf-ui-status-color);
  display: inline-block;
${bodyTypeStyles}  margin: 0;
  padding-block-end: ${h5SelectedEndNudge};
  padding-block-start: ${h5SelectedStartNudge};
  padding-inline: var(--bf-ui-chip-padding-inline);
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
}

:where(.bf-theme) :where(.bf-status-label.is-positive) {
  --bf-ui-status-background: var(--bf-color-border-positive);
  --bf-ui-status-color: var(--bf-color-button-positive-text);
}

:where(.bf-theme) :where(.bf-status-label.is-caution) {
  --bf-ui-status-background: var(--bf-color-border-caution);
  --bf-ui-status-color: #111111;
}

:where(.bf-theme) :where(.bf-status-label.is-information) {
  --bf-ui-status-background: var(--bf-color-border-information);
  --bf-ui-status-color: var(--bf-color-button-positive-text);
}

:where(.bf-theme) :where(.bf-status-label.is-negative) {
  --bf-ui-status-background: var(--bf-color-border-negative);
  --bf-ui-status-color: var(--bf-color-button-negative-text);
}
`;
}
