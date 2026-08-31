export function appTierPresetCss(scopes: string[]): string {
  const scoped = (suffix = ""): string => scopes.map(scope => `${scope}${suffix}`).join(",\n");

  return `/* Canonical app-tier preset: light application chrome, Ubuntu Sans, and app-surface control overrides. */
${scoped()} {
  --bf-app-demo-page-bg: var(--vf-color-background-alt, #f7f7f7);
  --bf-radius: 0;
  color-scheme: light;
}

${scoped(" :where(.bf-form-label, .bf-form-help, .bf-button, .bf-button.is-base, .bf-status-label, .bf-chip, .bf-checkbox-label, .bf-radio-label, .bf-tabs-link, .bf-accordion-tab, .bf-validation-message)")} {
  font-family: inherit;
  font-size: var(--bf-body-font-size);
  font-style: normal;
  font-weight: 400;
  line-height: var(--bf-body-line-height);
}

/* Preserve the public nested fit after the preset's general typography pass.
   The modifier remains explicit and zero-specificity in every app scope. */
${scoped(" :where(.bf-status-label.is-nested, .bf-chip.is-nested)")} {
  line-height: var(--bf-nested-auxiliary-line-height);
}

${scoped(" :where(.bf-input, .bf-button, .bf-button.is-base)")} {
  font-family: inherit;
  font-size: var(--bf-body-font-size);
  font-style: normal;
  font-weight: 400;
  line-height: var(--bf-body-line-height);
}

${scoped(" :where(.bf-input.is-nested, .bf-button.is-nested, .bf-checkbox.is-nested > .bf-checkbox-label, .bf-radio.is-nested > .bf-radio-label)")} {
  line-height: var(--bf-nested-control-line-height);
}

${scoped(" :where(.bf-application)")} {
  background: var(--bf-app-demo-page-bg);
}

${scoped(" :where(.bf-navigation-drawer)")},
${scoped(" :where(.bf-navigation:not(.is-collapsed)) > :where(.bf-navigation-drawer)")},
${scoped(" :where(.bf-aside.is-overlay, .bf-aside.is-drawer)")} {
  box-shadow: 0 0.625rem 1.25rem rgba(0, 0, 0, 0.12), 0 0 0.1875rem rgba(0, 0, 0, 0.12);
}

${scoped(" :where(.bf-panel-header)")} {
  align-items: start;
  gap: calc(var(--bf-baseline) * 1.5);
  padding-block-end: var(--bf-panel-padding-block);
  padding-block-start: var(--bf-panel-padding-block);
}

${scoped(" :where(.bf-panel-header.is-navigation-brand)")} {
  gap: 0;
  padding-block: 0;
}

${scoped(" :where(.bf-navigation-bar) :where(.bf-panel-header)")} {
  padding-block-end: calc(var(--bf-panel-padding-block) - var(--bf-border-width));
}

${scoped(" :where(.bf-navigation-bar.is-responsive) :where(.bf-panel-header.is-navigation-brand)")} {
  gap: calc(var(--bf-baseline) * 2);
  padding-block: 0;
}

${scoped(" :where(.bf-panel-controls)")} {
  gap: calc(var(--bf-baseline) * 1.5);
}

${scoped(" :where(.bf-navigation-bar, .bf-navigation-drawer, .bf-aside) :where(.bf-panel-title)")} {
  font-family: inherit;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5rem;
}

${scoped(" :where(.bf-side-navigation-link.is-active, .bf-side-navigation-link[aria-current='page'], .bf-side-navigation-link[aria-current='true'])")} {
  background: transparent;
  box-shadow: inset var(--bf-bar-thickness) 0 0 var(--vf-color-link-default, #0066cc);
}

${scoped(" :where(.bf-navigation-bar)")},
${scoped(" :where(.bf-navigation-drawer)")},
${scoped(" :where(.bf-aside)")},
${scoped(" :where(.bf-panel)")} {
  background: var(--vf-color-background-default, #ffffff);
}

`;
}
