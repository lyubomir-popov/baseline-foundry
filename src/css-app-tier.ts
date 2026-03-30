export function appTierPresetCss(): string {
  return `/* Canonical app-tier preset: light application chrome, Ubuntu Sans, and app-surface control overrides. */
:where(.bf-theme.bf-tier-app) {
  --bf-app-demo-page-bg: var(--vf-color-background-alt, #f7f7f7);
  --bf-radius: 0;
  --bf-body-selected-start-nudge: 0rem;
  --bf-body-selected-end-nudge: 0rem;
  --bf-h4-selected-start-nudge: 0rem;
  --bf-h4-selected-end-nudge: 0rem;
  --bf-h5-selected-start-nudge: 0rem;
  --bf-h5-selected-end-nudge: 0rem;
  --bf-h6-selected-start-nudge: 0rem;
  --bf-h6-selected-end-nudge: 0rem;
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

:where(.bf-theme.bf-tier-app) :where(.l-application, .bf-application) {
  background: var(--bf-app-demo-page-bg);
}

:where(.bf-theme.bf-tier-app) :where(.bf-panel) {
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.08);
}

:where(.bf-theme.bf-tier-app) :where(.l-navigation__drawer, .bf-navigation-drawer),
:where(.bf-theme.bf-tier-app) :where(.l-navigation:not(.is-collapsed), .bf-navigation:not(.is-collapsed)) > :where(.l-navigation__drawer, .bf-navigation-drawer),
:where(.bf-theme.bf-tier-app) :where(.l-aside.is-overlay, .bf-aside.is-overlay, .l-aside.is-drawer, .bf-aside.is-drawer) {
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.12);
}

:where(.bf-theme.bf-tier-app) :where(.l-navigation-bar, .bf-navigation-bar),
:where(.bf-theme.bf-tier-app) :where(.l-navigation__drawer, .bf-navigation-drawer),
:where(.bf-theme.bf-tier-app) :where(.l-aside, .bf-aside),
:where(.bf-theme.bf-tier-app) :where(.bf-panel) {
  background: var(--vf-color-background-default, #ffffff);
}
`;
}