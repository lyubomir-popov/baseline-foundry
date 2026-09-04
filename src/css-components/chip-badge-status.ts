type ChipBadgeStatusCssOptions = {
  bodyCaseTypeStyles: string;
  bodyTypeStyles: string;
};

export function chipBadgeStatusCss(options: ChipBadgeStatusCssOptions): string {
  const {
    bodyCaseTypeStyles,
    bodyTypeStyles,
  } = options;

  return `:where(.bf-theme) {
  --bf-ui-chip-padding-inline: var(--bf-component-inline-inset-action);
  --bf-ui-chip-radius: 999rem;
  --bf-ui-badge-padding-inline: var(--bf-border-width);
  --bf-ui-badge-overhang: calc(var(--bf-ui-badge-padding-inline) * -0.75);
}

:where(.bf-theme) :where(.bf-chip, .bf-chip.is-positive, .bf-chip.is-caution, .bf-chip.is-negative, .bf-chip.is-information) {
  --bf-ui-chip-border: var(--bf-color-border-neutral);
  --bf-ui-chip-border-hover: var(--bf-color-border-neutral);
  --bf-ui-chip-border-active: var(--bf-color-border-neutral);
  --bf-ui-chip-background: var(--bf-color-background-neutral-default);
  --bf-ui-chip-background-hover: var(--bf-color-background-neutral-hover);
  --bf-ui-chip-background-active: var(--bf-color-background-neutral-active);
${bodyTypeStyles}  align-items: baseline;
  background-color: var(--bf-ui-chip-background);
  border: var(--bf-border-width) solid var(--bf-ui-chip-border);
  border-radius: var(--bf-ui-chip-radius);
  color: var(--bf-color-text-default);
  display: inline-flex;
  gap: 0;
  inline-size: fit-content;
  justify-content: center;
  justify-self: start;
  margin: 0 var(--bf-component-inline-inset-field) var(--bf-interface-row-compensation-block-end) 0;
  max-inline-size: 100%;
  padding-block: var(--bf-interface-row-padding-block);
  /* Chips use the Action text keyline. The former block-derived floor never
     governs supported, non-empty chip content and was therefore inert. */
  padding-inline: max(0rem, calc(var(--bf-ui-chip-padding-inline) - var(--bf-border-width)));
  position: relative;
  text-decoration: none;
  user-select: none;
  /* Inline-flex exposes the first text child's baseline. The surrounding
     border-aware row contract now matches buttons instead of inventing a
     second chip-only occupied height. */
  vertical-align: baseline;
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

:where(.bf-theme) :where(.bf-chip.is-borderless) {
  --bf-ui-chip-border: transparent;
  --bf-ui-chip-border-hover: transparent;
  --bf-ui-chip-border-active: transparent;
  --bf-ui-chip-background: transparent;
  --bf-ui-chip-background-hover: transparent;
  --bf-ui-chip-background-active: transparent;
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
  color: var(--bf-color-background-default);
  display: inline-block;
  inline-size: fit-content;
  justify-self: start;
  margin: 0;
  min-inline-size: var(--bf-square-block-size);
  padding-block: 0;
  padding-inline: var(--bf-ui-badge-padding-inline);
  text-align: center;
  text-indent: 0;
  white-space: nowrap;
}

:where(.bf-theme) :where(.bf-badge.is-negative) {
  background-color: var(--bf-color-button-negative-default);
  color: var(--bf-color-button-negative-text);
}

:where(.bf-theme) :where(.bf-chip, .bf-chip.is-positive, .bf-chip.is-caution, .bf-chip.is-negative, .bf-chip.is-information) :where(.bf-badge, .bf-badge.is-negative) {
  align-self: center;
  margin-inline-end: var(--bf-ui-badge-overhang);
  margin-inline-start: var(--bf-component-inline-inset-field);
}

:where(.bf-theme) :where(.bf-status-label, .bf-status-label.is-positive, .bf-status-label.is-caution, .bf-status-label.is-information, .bf-status-label.is-negative) {
  --bf-ui-status-background: color-mix(in srgb, var(--bf-color-background-alt) 70%, black);
  --bf-ui-status-color: var(--bf-color-button-positive-text);
  background-color: var(--bf-ui-status-background);
  border-block: var(--bf-border-width) solid transparent;
  color: var(--bf-ui-status-color);
  display: inline-block;
  inline-size: fit-content;
  justify-self: start;
${bodyTypeStyles}  margin: 0 0 var(--bf-interface-row-compensation-block-end);
  /* Status paint is physically symmetric and shares the same occupied block
     as a button; typography still comes from the body role. */
  padding-block: var(--bf-interface-row-padding-block);
  padding-inline: var(--bf-component-inline-inset-field);
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

/* Nested auxiliary surfaces fit a body-sized flex/grid host instead of
   carrying a second standalone occupied-row contract. This modifier is
   explicit so component density never changes merely because of ancestry. */
:where(.bf-theme) :where(.bf-chip.is-nested, .bf-status-label.is-nested) {
  line-height: var(--bf-nested-row-line-height);
  margin-block: 0;
  padding-block: var(--bf-nested-row-padding-block);
}

:where(.bf-theme) :where(.bf-chip.is-nested) {
  border: 0;
  box-shadow: inset 0 0 0 var(--bf-border-width) var(--bf-ui-chip-border);
  /* The nested border is inset paint rather than box geometry, so the glyph
     needs the complete Action inset instead of subtracting a real border. */
  padding-inline: var(--bf-ui-chip-padding-inline);
}

/* Chip parts normally carry the standalone body line explicitly. A nested
   chip must pass its reduced line through to those parts so a nested badge
   can fit without making the host row taller. */
:where(.bf-theme) :where(.bf-chip.is-nested) :where(.bf-chip-lead, .bf-chip-value) {
  line-height: inherit;
}

:where(.bf-theme) :where(.bf-chip.is-nested:hover) {
  box-shadow: inset 0 0 0 var(--bf-border-width) var(--bf-ui-chip-border-hover);
}

:where(.bf-theme) :where(.bf-chip.is-nested:is(:active, [aria-pressed='true'], .is-selected)) {
  box-shadow: inset 0 0 0 var(--bf-border-width) var(--bf-ui-chip-border-active);
}

:where(.bf-theme) :where(.bf-status-label.is-nested) {
  border-block-width: 0;
}

:where(.bf-theme) :where(.bf-badge.is-nested) {
  align-self: center;
  line-height: var(--bf-nested-row-line-height);
  vertical-align: middle;
}
`;
}
