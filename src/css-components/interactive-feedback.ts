/** Credential and transient-feedback compositions built on BF controls and type roles. */
export function interactiveFeedbackCss(): string {
  return `/* ------------------------------------------------------------------ */
/* Credential reveal and repeated validation                           */
/* ------------------------------------------------------------------ */

:where(.bf-theme) :where(.bf-credential) {
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-credential-header) {
  align-items: flex-start;
  display: flex;
  gap: var(--bf-component-inline-inset-action);
  justify-content: space-between;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-credential-header > .bf-form-label) {
  flex: 1 1 auto;
  min-inline-size: 0;
}

/* This button is a control inside the field heading, so the composition
   explicitly trims the standalone control's trailing flow compensation. */
:where(.bf-theme) :where(.bf-password-reveal) {
  border: 0;
  flex: 0 0 auto;
  margin-block-end: 0;
  /* This attached action shares the label row. Its borderless base uses the
     paired body nudges directly, preserving the row's occupied grid block. */
  padding-block: var(--bf-body-nudge-start) var(--bf-body-nudge-end);
}

:where(.bf-theme) :where(.bf-password-reveal > .bf-password-reveal-icon) {
  background-color: currentColor;
  background-image: none;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M8 3.002c2.946 0 5.612 1.666 8 4.998-2.388 3.332-5.054 4.998-8 4.998C5.054 12.998 2.388 11.332 0 8c2.388-3.332 5.054-4.998 8-4.998zM8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 1.49a1.51 1.51 0 1 1 0 3.02 1.51 1.51 0 0 1 0-3.02z'/%3E%3C/svg%3E");
  mask-position: center;
  mask-repeat: no-repeat;
  mask-size: contain;
}

:where(.bf-theme) :where(.bf-password-reveal[aria-pressed='true'] > .bf-password-reveal-icon) {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='m13.938.624 1.06 1.06-2.653 2.653c1.27.823 2.475 2.026 3.616 3.61v.106l-.193.264C13.44 11.44 10.851 13 8 13a7.654 7.654 0 0 1-3.479-.839l-2.354 2.354-1.06-1.06L13.937.624zm-2.682 4.802L9.714 6.969a2 2 0 0 1-2.745 2.745L5.653 11.03a6.114 6.114 0 0 0 2.098.465L8 11.5c2.076 0 4.03-1.042 5.893-3.233L14.115 8l-.222-.267c-.858-1.01-1.736-1.775-2.637-2.307zM8 3c.608 0 1.203.07 1.787.213L8.482 4.519a6.072 6.072 0 0 0-.233-.014L8 4.5c-2.076 0-4.03 1.042-5.893 3.233L1.884 8l.223.267c.428.503.86.946 1.3 1.33l-1.062 1.061C1.535 9.938.754 9.052 0 8c2.388-3.333 5.054-5 8-5z'/%3E%3C/svg%3E");
}

/* Revealed readonly credentials stay legible; the generic readonly treatment
   remains correct for ordinary text fields outside this explicit composition. */
:where(.bf-theme) :where(.bf-credential input[type='text'][readonly]) {
  color: var(--bf-color-text-default);
}

:where(.bf-theme) :where(.bf-credential-validation) {
  align-content: start;
  display: grid;
  gap: var(--bf-space-1);
  list-style: none;
  margin-block: 0;
  padding-inline-start: 0;
}

:where(.bf-theme) :where(.bf-credential-validation > .bf-validation) {
  align-content: start;
  display: grid;
  margin-block: 0;
  min-inline-size: 0;
}

/* ------------------------------------------------------------------ */
/* Notification — transient status feedback, distinct from bf-notice  */
/* ------------------------------------------------------------------ */

:where(.bf-theme) :where(.bf-notification, .bf-notification.is-information, .bf-notification.is-positive, .bf-notification.is-caution, .bf-notification.is-negative) {
  --bf-notification-accent: var(--bf-color-border-information);
  --bf-notification-close-painted-block-size: calc((var(--bf-space-1) * 2) + var(--bf-icon-size-default));
  background: var(--bf-color-background-default);
  border: var(--bf-border-width) solid var(--bf-color-border-default);
  border-inline-start: var(--bf-bar-thickness) solid var(--bf-notification-accent);
  color: var(--bf-color-text-default);
  margin-block: 0;
  max-inline-size: 100%;
  min-inline-size: 0;
  overflow-wrap: anywhere;
  padding-block-end: max(0rem, calc(var(--bf-space-half) - var(--bf-border-width)));
  padding-block-start: 0;
  padding-inline: calc(var(--bf-component-inline-inset-continuation) - var(--bf-bar-thickness)) var(--bf-component-inline-inset-action);
  position: relative;
}

:where(.bf-theme) :where(.bf-notification.is-positive) {
  --bf-notification-accent: var(--bf-color-border-positive);
}

:where(.bf-theme) :where(.bf-notification.is-caution) {
  --bf-notification-accent: var(--bf-color-border-caution);
}

:where(.bf-theme) :where(.bf-notification.is-negative) {
  --bf-notification-accent: var(--bf-color-border-negative);
}

:where(.bf-theme) :where(.bf-notification[hidden]) {
  display: none;
}

:where(.bf-theme) :where(.bf-notification.is-borderless) {
  border: 0;
  padding-block: 0;
  padding-inline: calc(var(--bf-leading-mark-size) + var(--bf-leading-mark-gap)) 0;
}

:where(.bf-theme) :where(.bf-notification-icon) {
  --bf-icon-size: var(--bf-leading-mark-size);
  background-color: var(--bf-notification-accent);
  background-image: none;
  inset-block-start: calc(((var(--bf-h6-line-height) - var(--bf-leading-mark-size)) / 2) + var(--bf-h6-nudge-start) - var(--bf-border-width));
  inset-inline-start: calc(var(--bf-component-inline-inset-continuation) - var(--bf-bar-thickness) - var(--bf-leading-mark-size) - var(--bf-leading-mark-gap));
  margin-block-start: 0;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm0 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zm-.75 5.25h1.5v5h-1.5v-5zM8 3.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z'/%3E%3C/svg%3E");
  mask-position: center;
  mask-repeat: no-repeat;
  mask-size: contain;
  position: absolute;
}

:where(.bf-theme) :where(.bf-notification.is-positive > .bf-notification-icon) {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm0 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zm2.814 2.45 1.203.897-5.537 7.43-3.485-3.694 1.09-1.03 2.259 2.394 4.47-5.997z'/%3E%3C/svg%3E");
}

:where(.bf-theme) :where(.bf-notification.is-caution > .bf-notification-icon) {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M8.865 1.5 15.77 13.5a1 1 0 0 1-.866 1.5H1.096a1 1 0 0 1-.866-1.5l6.905-12a1 1 0 0 1 1.73 0zM8 3.49 2.392 13.5h11.216L8 3.49zm-.75 3.01h1.5v3.75h-1.5V6.5zM8 11.25a1 1 0 1 1 0 2 1 1 0 0 1 0-2z'/%3E%3C/svg%3E");
}

:where(.bf-theme) :where(.bf-notification.is-negative > .bf-notification-icon) {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm0 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zm2.282 3.138 1.06 1.061L9.052 7.99l2.291 2.292-1.061 1.06L7.99 9.052l-2.291 2.291-1.061-1.061L6.929 7.99 4.638 5.699l1.061-1.061L7.99 6.929l2.292-2.291z'/%3E%3C/svg%3E");
}

:where(.bf-theme) :where(.bf-notification.is-borderless > .bf-notification-icon) {
  inset-block-start: calc(((var(--bf-h6-line-height) - var(--bf-leading-mark-size)) / 2) + var(--bf-h6-nudge-start));
  inset-inline-start: 0;
}

:where(.bf-theme) :where(.bf-notification.is-inline > .bf-notification-icon) {
  inset-block-start: calc(((var(--bf-body-line-height) - var(--bf-leading-mark-size)) / 2) + var(--bf-body-nudge-start) - var(--bf-border-width));
}

:where(.bf-theme) :where(.bf-notification-content, .bf-notification-meta) {
  max-inline-size: 100%;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-notification-content) {
  /* Neutralise the shell's top border so the first metric role starts on-grid. */
  margin-block: calc(var(--bf-border-width) * -1) 0;
  padding-block-start: 0;
  padding-inline-end: var(--bf-notification-close-painted-block-size);
}

:where(.bf-theme) :where(.bf-notification.is-borderless .bf-notification-content) {
  --bf-stack-space: 0rem;
  margin-block-start: 0;
}

/* Metadata-bearing notifications use a full baseline between title and copy,
   and pair it with the full end inset. This keeps both the metadata boundary
   and the complete shell on-grid; simpler messages retain compact rhythm. */
:where(.bf-theme) :where(.bf-notification:has(> .bf-notification-meta)) {
  padding-block-end: calc(var(--bf-space-1) - var(--bf-border-width));
}

:where(.bf-theme) :where(.bf-notification.is-inline) {
  padding-block-end: calc(var(--bf-space-1) - var(--bf-border-width));
}

/* Return the cancelled H6/body metric edges to the shell boundary. The
 * Documentation tier deliberately gives those roles different metrics, so
 * deriving this inset keeps every bordered notification on-grid without
 * reopening the visible title/copy gap. Keep this after the shell variants so
 * the metric relationship owns their final compensation. */
:where(.bf-theme) :where(.bf-notification:has(> .bf-notification-content.is-metric-flush):not(.is-borderless)) {
  padding-block-end: calc(var(--bf-space-1) - var(--bf-border-width) + var(--bf-baseline) - var(--bf-h6-nudge-start) - var(--bf-body-margin-bottom));
}

:where(.bf-theme) :where(.bf-notification-message, .bf-notification-timestamp) {
  font-family: var(--bf-body-font-family);
  font-size: var(--bf-body-font-size);
  font-style: var(--bf-body-font-style);
  line-height: var(--bf-body-line-height);
  max-inline-size: 100%;
}

:where(.bf-theme) :where(.bf-notification-message) {
  font-weight: var(--bf-body-font-weight);
  margin-block: 0 var(--bf-body-margin-bottom);
  padding-block-end: 0;
  padding-block-start: var(--bf-body-nudge-start);
}

:where(.bf-theme) :where(.bf-notification-close) {
  block-size: var(--bf-square-block-size);
  border: 0;
  inline-size: var(--bf-square-block-size);
  margin-block-end: 0;
  padding: 0;
  position: absolute;
  inset-block-start: 0;
  inset-inline-end: 0;
}

:where(.bf-theme) :where(.bf-notification.is-borderless .bf-notification-close) {
  inset-block-start: 0;
  inset-inline-end: 0;
}

:where(.bf-theme) :where(.bf-notification-meta) {
  align-items: flex-start;
  border-block-start: var(--bf-border-width) solid var(--bf-color-border-low-contrast);
  display: flex;
  flex-wrap: wrap;
  gap: var(--bf-space-1) var(--bf-component-inline-inset-action);
  justify-content: space-between;
  margin-block-end: 0;
  padding-block-start: calc(var(--bf-space-1) - var(--bf-border-width));
  padding-inline-end: var(--bf-component-inline-inset-action);
}

:where(.bf-theme) :where(.bf-notification.is-inline .bf-notification-meta) {
  border-block-start: 0;
  padding-block-start: 0;
}

:where(.bf-theme) :where(.bf-notification-timestamp) {
  color: var(--bf-color-text-muted);
  font-weight: var(--bf-body-font-weight);
  margin-block: 0 var(--bf-body-margin-bottom);
  padding-block: var(--bf-body-nudge-start) 0;
}

:where(.bf-theme) :where(.bf-notification-actions) {
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  gap: var(--bf-space-1) var(--bf-component-inline-inset-action);
  margin-inline-start: auto;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-notification-actions > .bf-button.is-link) {
  flex: 0 0 auto;
  margin-block-end: var(--bf-body-margin-bottom);
  padding-block: var(--bf-body-nudge-start) 0;
}
`;
}
