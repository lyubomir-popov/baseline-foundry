/**
 * Application-shell dimensions. These are shell facts, not component inset
 * or occupied-row contracts; colors remain owned by the theme color map.
 */
export function applicationGeometryCss(): string {
  return `:where(.bf-theme) {
  --bf-app-drawer-width-icon: 2rem;
  --bf-app-drawer-width-small: 15rem;
  --bf-app-drawer-width-small-max: 20rem;
  --bf-app-drawer-width-medium: 29.0625rem;
  --bf-app-drawer-width-medium-max: 40rem;
  --bf-app-drawer-width-large: min(100vw, max(40rem, 50vw));
  --bf-app-aside-width: var(--bf-app-drawer-width-medium);
  --bf-app-aside-width-min: var(--bf-app-drawer-width-small);
  --bf-app-aside-width-max: var(--bf-app-drawer-width-medium-max);
  --bf-app-navigation-width: 15rem;
  --bf-app-navigation-width-collapsed: 3rem;
  --bf-application-drawer-width-icon: var(--bf-app-drawer-width-icon);
  --bf-application-drawer-width-small: var(--bf-app-drawer-width-small);
  --bf-application-drawer-width-small-max: var(--bf-app-drawer-width-small-max);
  --bf-application-drawer-width-medium: var(--bf-app-drawer-width-medium);
  --bf-application-drawer-width-medium-max: var(--bf-app-drawer-width-medium-max);
  --bf-application-drawer-width-large: var(--bf-app-drawer-width-large);
  --bf-application-aside-width: var(--bf-app-aside-width);
  --bf-application-aside-width-min: var(--bf-app-aside-width-min);
  --bf-application-aside-width-max: var(--bf-app-aside-width-max);
  --bf-application-navigation-width: var(--bf-app-navigation-width);
  --bf-application-navigation-width-collapsed: var(--bf-app-navigation-width-collapsed);
}
`;
}
