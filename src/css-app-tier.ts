export function appTierPresetCss(scopes: string[]): string {
  const scoped = (suffix = ""): string => scopes.map(scope => `${scope}${suffix}`).join(",\n");

  return `/* Canonical app-tier preset: application chrome only. Component
   typography and spacing resolve from the tier inputs in their source modules. */
${scoped()} {
  --bf-app-demo-page-bg: var(--vf-color-background-alt, #f7f7f7);
  color-scheme: light;
}

${scoped(" :where(.bf-application)")} {
  background: var(--bf-app-demo-page-bg);
}

${scoped(" :where(.bf-navigation-drawer)")},
${scoped(" :where(.bf-navigation:not(.is-collapsed)) > :where(.bf-navigation-drawer)")},
${scoped(" :where(.bf-aside.is-overlay, .bf-aside.is-drawer)")} {
  box-shadow: 0 0.625rem 1.25rem rgba(0, 0, 0, 0.12), 0 0 0.1875rem rgba(0, 0, 0, 0.12);
}

${scoped(" :where(.bf-panel-header.is-navigation-brand)")} {
  gap: 0;
  padding-block: 0;
}

${scoped(" :where(.bf-navigation-bar) :where(.bf-panel-header)")} {
  padding-block-end: calc(var(--bf-panel-padding-block) - var(--bf-border-width));
}

${scoped(" :where(.bf-navigation-bar.is-responsive) :where(.bf-panel-header.is-navigation-brand)")} {
  gap: var(--bf-leading-mark-gap);
  padding-block: 0;
}

${scoped(" :where(.bf-side-navigation-link.is-active, .bf-side-navigation-link[aria-current='page'], .bf-side-navigation-link[aria-current='true'])")} {
  background: transparent;
  box-shadow: inset var(--bf-bar-thickness) 0 0 var(--vf-color-link-default, #0066cc);
}

${scoped(" :where(.bf-navigation-bar)")},
${scoped(" :where(.bf-navigation-drawer)")},
${scoped(" :where(.bf-aside)")} {
  background: var(--vf-color-background-default, #ffffff);
}

`;
}
