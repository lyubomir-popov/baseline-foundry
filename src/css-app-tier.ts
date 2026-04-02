export function appTierPresetCss(): string {
  return `/* Canonical app-tier preset: light application chrome, Ubuntu Sans, and app-surface control overrides. */
:where(.bf-theme.bf-tier-app) {
  --bf-app-demo-page-bg: var(--vf-color-background-alt, #f7f7f7);
  --bf-radius: 0;
  color-scheme: light;
}

:where(.bf-theme.bf-tier-app) :where(.bf-form-label, .bf-form-help, .bf-button, .bf-button.is-base, .bf-status-label, .bf-chip, .bf-checkbox-label, .bf-radio-label, .bf-tabs-link, .bf-accordion-tab, .bf-validation-message) {
  font-family: inherit;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.25rem;
}

:where(.bf-theme.bf-tier-app) :where(.bf-input, .bf-button, .bf-button.is-base) {
  font-family: inherit;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.25rem;
}

:where(.bf-theme.bf-tier-app) :where(.bf-application) {
  background: var(--bf-app-demo-page-bg);
}

:where(.bf-theme.bf-tier-app) :where(.bf-navigation-drawer),
:where(.bf-theme.bf-tier-app) :where(.bf-navigation:not(.is-collapsed)) > :where(.bf-navigation-drawer),
:where(.bf-theme.bf-tier-app) :where(.bf-aside.is-overlay, .bf-aside.is-drawer) {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12), 0 0 3px rgba(0, 0, 0, 0.12);
}

:where(.bf-theme.bf-tier-app) :where(.bf-panel-header) {
  align-items: center;
  gap: calc(var(--bf-baseline) * 1.5);
  padding-block-end: calc(var(--bf-panel-padding-block) * 0.75);
  padding-block-start: calc(var(--bf-panel-padding-block) * 0.75);
}

:where(.bf-theme.bf-tier-app) :where(.bf-panel-controls) {
  gap: calc(var(--bf-baseline) * 1.5);
}

:where(.bf-theme.bf-tier-app) :where(.bf-navigation-bar, .bf-navigation-drawer, .bf-aside) :where(.bf-panel-title) {
  font-family: inherit;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5rem;
}

:where(.bf-theme.bf-tier-app) :where(.bf-side-navigation-link.is-active, .bf-side-navigation-link[aria-current='page'], .bf-side-navigation-link[aria-current='true']) {
  background: transparent;
  box-shadow: inset 3px 0 0 var(--vf-color-link-default, #0066cc);
}

:where(.bf-theme.bf-tier-app) :where(.bf-navigation-bar),
:where(.bf-theme.bf-tier-app) :where(.bf-navigation-drawer),
:where(.bf-theme.bf-tier-app) :where(.bf-aside),
:where(.bf-theme.bf-tier-app) :where(.bf-panel) {
  background: var(--vf-color-background-default, #ffffff);
}

:where(.bf-theme.bf-tier-app) :where(.bf-section),
:where(.bf-theme.bf-tier-app) :where(.bf-section.is-shallow),
:where(.bf-theme.bf-tier-app) :where(.bf-section.is-deep) {
  margin-block-end: 0;
}

:where(.bf-theme.bf-tier-app) :where(.bf-stack) {
  --bf-stack-space: var(--bf-space-2);
}

:where(.bf-theme.bf-tier-app) :where(.bf-stack.is-flush) {
  --bf-stack-space: 0px;
}

:where(.bf-theme.bf-tier-app) :where(.bf-stack.is-extra-dense) {
  --bf-stack-space: var(--bf-space-half);
}

:where(.bf-theme.bf-tier-app) :where(.bf-stack.is-dense) {
  --bf-stack-space: var(--bf-space-1);
}

:where(.bf-theme.bf-tier-app) :where(.bf-stack.is-loose) {
  --bf-stack-space: var(--bf-space-3);
}

:where(.bf-theme.bf-tier-app) :where(.bf-stack.is-section-shallow) {
  --bf-stack-space: var(--bf-section-space-shallow);
}

:where(.bf-theme.bf-tier-app) :where(.bf-stack.is-section) {
  --bf-stack-space: var(--bf-section-space);
}

:where(.bf-theme.bf-tier-app) :where(.bf-stack.is-section-deep) {
  --bf-stack-space: var(--bf-section-space-deep);
}
`;
}