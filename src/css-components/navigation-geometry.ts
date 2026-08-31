/**
 * Shared disclosure and navigation geometry. Horizontal placement consumes
 * the field/action/continuation insets instead of introducing another inset.
 */
export function navigationGeometryCss(): string {
  return `:where(.bf-theme) {
  --bf-disclosure-gap: 1rem;
  --bf-disclosure-icon-inline-size: 1rem;
  --bf-icon-label-optical-offset-block: 0.1875rem;
  --bf-disclosure-icon-optical-offset-block: var(--bf-icon-label-optical-offset-block);
  --bf-side-navigation-icon-optical-offset-block: var(--bf-icon-label-optical-offset-block);
  --bf-side-navigation-icon-gap: 0.625rem;
  --bf-navigation-bar-min-block-size: calc(var(--bf-baseline) * 6);
  --bf-top-navigation-link-padding-inline: var(--bf-component-inline-inset-action);
  --bf-top-navigation-end-slot-inline-size: calc(1rem + var(--bf-component-inline-inset-field));
  --bf-top-navigation-search-toggle-inline-size: calc(1rem + (var(--bf-component-inline-inset-field) * 2));
  --bf-top-navigation-link-padding-block: max(var(--bf-body-nudge-start), calc(var(--bf-baseline) * 1.5));
  --bf-top-navigation-search-max-inline-size: 20rem;
  --bf-top-navigation-logo-tag-inline-size: 1.375rem;
  --bf-top-navigation-logo-tag-block-size: 2.375rem;
  --bf-top-navigation-logo-icon-size: 1rem;
  --bf-top-navigation-logo-tag-gap: 0.25rem;
  --bf-top-navigation-logo-icon-bottom-offset: 0.375rem;
  --bf-top-navigation-logo-icon-optical-offset-inline: -0.0125rem;
  --bf-navigation-brand-line-center-block: calc(var(--bf-top-navigation-logo-tag-block-size) - var(--bf-top-navigation-logo-icon-bottom-offset) - (var(--bf-top-navigation-logo-icon-size) / 2));
  --bf-navigation-brand-block-size: calc(var(--bf-navigation-brand-line-center-block) * 2);
}
`;
}
