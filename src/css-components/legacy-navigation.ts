export interface LegacyNavigationCssOptions {
  bodyMediumTypeStyles: string;
  bodySemiboldTypeStyles: string;
  bodyTypeStyles: string;
  buttonMarginBottom: string;
  buttonPadding: string;
}

export function legacyNavigationCss(options: LegacyNavigationCssOptions): string {
  const {
    bodyMediumTypeStyles,
    bodySemiboldTypeStyles,
    bodyTypeStyles,
    buttonMarginBottom,
    buttonPadding
  } = options;

  return `:where(.bf-theme) :where(.bf-side-navigation, .bf-side-navigation.is-icons, .bf-side-navigation.is-accordion, .bf-side-navigation.is-raw-html) {
  /* Plain navigation commands use the action rail. Icon-led rows move only their mark canvas,
     so their copy reaches the shared continuation rail without a fourth
     component inset. Navigation depth is added separately below. */
  /* Navigation copy uses one continuation rail whether a row has a leading
     disclosure/icon slot or not. The mark canvas is derived backwards from
     that rail, so iconless rows never introduce a fourth text start. */
  --bf-side-navigation-content-inset: var(--bf-component-inline-inset-continuation);
  --bf-side-navigation-disclosure-inset: max(0rem, calc(var(--bf-component-inline-inset-continuation) - var(--bf-disclosure-icon-inline-size) - var(--bf-disclosure-gap)));
  --bf-side-navigation-depth-step: var(--bf-space-2);
  --bf-side-navigation-group-gap: 1.5rem;
  color: var(--bf-color-text-inactive);
  display: block;
  inline-size: 100%;
}

:where(.bf-theme) :where(.bf-side-navigation-groups) {
  align-content: start;
  display: grid;
  gap: var(--bf-side-navigation-group-gap);
}

:where(.bf-theme) :where(.bf-side-navigation-group) {
  display: grid;
  gap: 0rem;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-side-navigation-drawer) {
  background: var(--bf-color-background-default);
  bottom: 0;
  color: var(--bf-color-text-default);
  inline-size: 100%;
  left: 0;
  overflow: auto;
  position: fixed;
  top: 0;
  transform: translateX(-100%);
  transition: transform 160ms ease, visibility 160ms ease, box-shadow 160ms ease;
  visibility: visible;
  z-index: 102;
}

:where(.bf-theme) :where(.bf-side-navigation, .bf-side-navigation.is-icons, .bf-side-navigation.is-accordion, .bf-side-navigation.is-raw-html):where(.is-drawer-expanded) :where(.bf-side-navigation-drawer) {
  box-shadow: 0 1.5rem 4.5rem rgba(0, 0, 0, 0.38);
  transform: translateX(0);
}

:where(.bf-theme) :where(.bf-side-navigation, .bf-side-navigation.is-icons, .bf-side-navigation.is-accordion, .bf-side-navigation.is-raw-html):where(.is-drawer-hidden) :where(.bf-side-navigation-drawer) {
  display: none;
}

:where(.bf-theme) :where(.bf-side-navigation-overlay) {
  background: var(--bf-color-background-overlay);
  inset: 0;
  opacity: 0;
  pointer-events: none;
  position: fixed;
  transition: opacity 160ms ease, visibility 160ms ease;
  visibility: hidden;
  z-index: 101;
}

:where(.bf-theme) :where(.bf-side-navigation, .bf-side-navigation.is-icons, .bf-side-navigation.is-accordion, .bf-side-navigation.is-raw-html):where(.is-drawer-expanded) :where(.bf-side-navigation-overlay) {
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
}

:where(.bf-theme) :where(.bf-side-navigation-drawer-header) {
  background: var(--bf-color-background-default);
  border-bottom: var(--bf-border-width) solid var(--bf-color-border-low-contrast);
  margin-bottom: calc(var(--bf-baseline) * 2);
  padding-bottom: calc(var(--bf-panel-padding-block) - var(--bf-border-width));
  padding-inline: var(--bf-component-inline-inset-continuation);
  padding-top: var(--bf-panel-padding-block);
  position: sticky;
  top: 0;
  z-index: 1;
}

:where(.bf-theme) :where(.bf-side-navigation-toggle, .bf-side-navigation-toggle.is-in-drawer) {
${bodyTypeStyles}  align-items: center;
  appearance: none;
  background: var(--bf-color-background-default);
  border: var(--bf-border-width) solid var(--bf-color-border-high-contrast);
  border-radius: var(--bf-radius);
  color: var(--bf-color-text-default);
  cursor: pointer;
  display: inline-flex;
  gap: calc(var(--bf-baseline) * 0.5);
  justify-content: center;
  margin: 0 0 ${buttonMarginBottom};
${buttonPadding}  padding-inline: var(--bf-control-inline-padding-action-bordered);
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-side-navigation-toggle)::before {
  background-image: var(--bf-ui-icon-chevron-down);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
  block-size: 1rem;
  content: "";
  inline-size: 1rem;
  transform: rotate(-90deg);
}

:where(.bf-theme) :where(.bf-side-navigation-toggle.is-in-drawer)::before {
  background-image: var(--bf-ui-icon-chevron-down);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
  block-size: 1rem;
  content: "";
  inline-size: 1rem;
  transform: rotate(90deg);
}

:where(.bf-theme) :where(.bf-side-navigation-toggle:hover) {
  background: var(--bf-color-background-hover);
}

:where(.bf-theme) :where(.bf-side-navigation-toggle:focus:not(:focus-visible)) {
  outline: none;
}

:where(.bf-theme) :where(.bf-side-navigation-toggle:focus-visible) {
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: -0.125rem;
}

:where(.bf-theme) :where(.bf-side-navigation-heading, .bf-side-navigation-heading.is-linked) {
${bodySemiboldTypeStyles}  display: block;
  margin: 0 0 var(--bf-body-margin-bottom);
  padding-block: var(--bf-body-nudge-start) 0;
  padding-inline: var(--bf-side-navigation-content-inset);
}

:where(.bf-theme) :where(.bf-side-navigation-heading.is-linked) {
  padding-inline: 0;
}

:where(.bf-theme) :where(.bf-side-navigation-list) {
  display: grid;
  list-style: none;
  margin: 0;
  padding: 0;
}

:where(.bf-theme) :where(.bf-side-navigation-item, .bf-side-navigation-item.is-title) {
  display: grid;
  margin: 0;
  position: relative;
}

:where(.bf-theme) :where(.bf-side-navigation-link, .bf-side-navigation-text, .bf-side-navigation-accordion-button) {
${bodyTypeStyles}  align-items: center;
  background: transparent;
  border: 0;
  border-block: var(--bf-border-width) solid transparent;
  color: var(--bf-color-text-inactive);
  display: flex;
  gap: calc(var(--bf-baseline) * 0.5);
  inline-size: 100%;
  justify-content: flex-start;
  margin: 0 0 var(--bf-single-line-row-margin-block-end);
  padding-block: var(--bf-single-line-row-padding-block);
  padding-inline: var(--bf-side-navigation-content-inset);
  --bf-side-navigation-row-inset: var(--bf-side-navigation-content-inset);
  position: relative;
  text-align: left;
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-side-navigation-accordion-button) {
  --bf-side-navigation-row-inset: var(--bf-side-navigation-disclosure-inset);
  gap: var(--bf-disclosure-gap);
}

:where(.bf-theme) :where(.bf-side-navigation-item.is-title) > :where(.bf-side-navigation-link, .bf-side-navigation-text) {
  color: var(--bf-color-text-default);
  font-weight: 600;
}

:where(.bf-theme) :where(.bf-side-navigation-list) > :where(.bf-side-navigation-item, .bf-side-navigation-item.is-title) > :where(.bf-side-navigation-link, .bf-side-navigation-text, .bf-side-navigation-accordion-button) {
  padding-inline-start: var(--bf-side-navigation-row-inset, var(--bf-side-navigation-content-inset));
}

:where(.bf-theme) :where(.bf-side-navigation-item, .bf-side-navigation-item.is-title)
  :where(.bf-side-navigation-item, .bf-side-navigation-item.is-title)
  > :where(.bf-side-navigation-link, .bf-side-navigation-text, .bf-side-navigation-accordion-button) {
  padding-inline-start: calc(var(--bf-side-navigation-row-inset, var(--bf-side-navigation-content-inset)) + var(--bf-side-navigation-depth-step));
}

:where(.bf-theme) :where(.bf-side-navigation-item, .bf-side-navigation-item.is-title)
  :where(.bf-side-navigation-item, .bf-side-navigation-item.is-title)
  :where(.bf-side-navigation-item, .bf-side-navigation-item.is-title)
  > :where(.bf-side-navigation-link, .bf-side-navigation-text, .bf-side-navigation-accordion-button) {
  padding-inline-start: calc(var(--bf-side-navigation-row-inset, var(--bf-side-navigation-content-inset)) + (var(--bf-side-navigation-depth-step) * 2));
}

:where(.bf-theme) :where(.bf-side-navigation-item, .bf-side-navigation-item.is-title)
  :where(.bf-side-navigation-item, .bf-side-navigation-item.is-title)
  :where(.bf-side-navigation-item, .bf-side-navigation-item.is-title)
  :where(.bf-side-navigation-item, .bf-side-navigation-item.is-title)
  > :where(.bf-side-navigation-link, .bf-side-navigation-text, .bf-side-navigation-accordion-button) {
  padding-inline-start: calc(var(--bf-side-navigation-row-inset, var(--bf-side-navigation-content-inset)) + (var(--bf-side-navigation-depth-step) * 3));
}

:where(.bf-theme) :where(.bf-side-navigation-link:hover, .bf-side-navigation-accordion-button:hover) {
  background: var(--bf-color-background-hover);
  color: var(--bf-color-text-default);
  text-decoration: none;
}

:where(.bf-theme) :where(a.bf-side-navigation-link:is(:hover, :active)) {
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-side-navigation-link:focus:not(:focus-visible), .bf-side-navigation-accordion-button:focus:not(:focus-visible)) {
  outline: none;
}

:where(.bf-theme) :where(.bf-side-navigation-link:focus-visible, .bf-side-navigation-accordion-button:focus-visible) {
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: -0.125rem;
}

:where(.bf-theme) :where(.bf-side-navigation-link.is-active, .bf-side-navigation-link[aria-current='page'], .bf-side-navigation-link[aria-current='true']) {
  background: var(--bf-color-background-active);
  box-shadow: inset var(--bf-bar-thickness) 0 0 var(--bf-color-text-default);
  color: var(--bf-color-text-default);
  cursor: default;
}

:where(.bf-theme) :where(.bf-top-navigation) {
  background: var(--bf-color-background-default);
  box-shadow: inset 0 calc(var(--bf-border-width) * -1) 0 var(--bf-color-border-low-contrast);
  color: var(--bf-color-text-default);
  isolation: isolate;
  position: relative;
  z-index: 50;
}

:where(.bf-theme) :where(.bf-top-navigation.is-sticky) {
  position: sticky;
  top: 0;
  z-index: 98;
}

:where(.bf-theme) :where(.bf-top-navigation-row) {
  display: flex;
  flex-direction: column;
  min-block-size: var(--bf-navigation-bar-min-block-size);
  min-inline-size: 0;
  padding-block: calc(var(--bf-baseline) / 2);
  padding-inline: var(--bf-panel-padding-inline);
  position: relative;
  z-index: 1;
}

:where(.bf-theme) :where(.bf-top-navigation) :where(.bf-fixed-width) > :where(.bf-top-navigation-row) {
  padding-inline: 0;
}

:where(.bf-theme) :where(.bf-top-navigation-banner) {
  align-items: stretch;
  display: flex;
  justify-content: space-between;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-top-navigation-logo) {
  align-items: stretch;
  display: flex;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-top-navigation-logo) > :where(.bf-top-navigation-link) {
${bodyMediumTypeStyles}  align-items: center;
  color: var(--bf-color-text-default);
  column-gap: calc(var(--bf-baseline) * 1.5);
  display: inline-flex;
  inline-size: auto;
  justify-content: flex-start;
  margin: 0;
  min-inline-size: 0;
  padding-block: var(--bf-top-navigation-link-padding-block);
  padding-inline: 0;
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-top-navigation-logo) > :where(.bf-top-navigation-link:hover) {
  background: transparent;
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-top-navigation-logo-tag) {
  align-items: center;
  background: var(--bf-color-accent);
  block-size: var(--bf-top-navigation-logo-tag-block-size);
  color: #ffffff;
  display: inline-flex;
  flex: 0 0 auto;
  inline-size: var(--bf-top-navigation-logo-tag-inline-size);
  justify-content: center;
}

:where(.bf-theme) :where(.bf-top-navigation-logo-icon) {
  block-size: var(--bf-top-navigation-logo-icon-size);
  inline-size: var(--bf-top-navigation-logo-icon-size);
}

:where(.bf-theme) :where(.bf-top-navigation-logo-title) {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:where(.bf-theme) :where(.bf-top-navigation-nav) {
  display: none;
  flex-direction: column;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-top-navigation-nav[aria-hidden='false']) {
  display: flex;
}

:where(.bf-theme) :where(.bf-top-navigation-list) {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  min-inline-size: 0;
  padding: 0;
}

:where(.bf-theme) :where(.bf-top-navigation-list.is-banner-actions) {
  align-items: stretch;
  display: flex;
  flex: 0 0 auto;
  flex-direction: row;
}

:where(.bf-theme) :where(.bf-top-navigation-item) {
  margin: 0;
  min-inline-size: 0;
  position: relative;
}

:where(.bf-theme) :where(.bf-top-navigation-nav) :where(.bf-top-navigation-item) {
  border-top: var(--bf-border-width) solid var(--bf-color-border-low-contrast);
}

:where(.bf-theme) :where(.bf-top-navigation-item.is-right-shifted) {
  margin-inline-start: auto;
}

:where(.bf-theme) :where(.bf-top-navigation-link, .bf-top-navigation-menu-toggle, .bf-top-navigation-search-toggle) {
${bodyTypeStyles}  align-items: center;
  appearance: none;
  background: transparent;
  border: 0;
  color: var(--bf-color-text-default);
  cursor: pointer;
  display: inline-flex;
  gap: calc(var(--bf-baseline) * 1);
  inline-size: 100%;
  justify-content: flex-start;
  margin: 0;
  min-inline-size: 0;
  padding-block: var(--bf-top-navigation-link-padding-block);
  padding-inline: var(--bf-top-navigation-link-padding-inline);
  position: relative;
  text-align: left;
  text-decoration: none;
  white-space: nowrap;
}

:where(.bf-theme) :where(.bf-top-navigation-link:hover, .bf-top-navigation-menu-toggle:hover, .bf-top-navigation-search-toggle:hover) {
  background: var(--bf-color-background-hover);
  text-decoration: none;
}

:where(.bf-theme) :where(a.bf-top-navigation-link:is(:hover, :active)) {
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-top-navigation-link:focus:not(:focus-visible), .bf-top-navigation-menu-toggle:focus:not(:focus-visible), .bf-top-navigation-search-toggle:focus:not(:focus-visible)) {
  outline: none;
}

:where(.bf-theme) :where(.bf-top-navigation-link:focus-visible, .bf-top-navigation-menu-toggle:focus-visible, .bf-top-navigation-search-toggle:focus-visible) {
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: -0.125rem;
}

:where(.bf-theme) :where(.bf-top-navigation-item.is-selected) > :where(.bf-top-navigation-link),
:where(.bf-theme) :where(.bf-top-navigation-item.is-dropdown-toggle.is-active) > :where(.bf-top-navigation-link),
:where(.bf-theme) :where(.bf-top-navigation-link[aria-current='page']) {
  background: var(--bf-color-background-hover);
  box-shadow: inset var(--bf-bar-thickness) 0 0 var(--bf-color-text-default);
  color: var(--bf-color-text-default);
}

:where(.bf-theme) :where(.bf-top-navigation-menu-toggle) {
  display: inline-flex;
}

:where(.bf-theme) :where(.bf-top-navigation-search-toggle) {
  justify-content: center;
  min-inline-size: var(--bf-top-navigation-search-toggle-inline-size);
}

:where(.bf-theme) :where(.bf-top-navigation-dropdown-toggle) {
  padding-inline-end: calc(var(--bf-top-navigation-link-padding-inline) + var(--bf-top-navigation-end-slot-inline-size));
}

:where(.bf-theme) :where(.bf-top-navigation-dropdown-toggle)::after {
  background-image: var(--bf-ui-icon-chevron-down);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
  block-size: 1rem;
  bottom: 0;
  content: "";
  inline-size: 1rem;
  margin-block: auto;
  pointer-events: none;
  position: absolute;
  right: var(--bf-top-navigation-link-padding-inline);
  top: 0;
  transform: rotate(0deg);
  transition: transform 160ms ease;
}

:where(.bf-theme) :where(.bf-top-navigation-item.is-dropdown-toggle.is-active) > :where(.bf-top-navigation-dropdown-toggle)::after {
  transform: rotate(180deg);
}

:where(.bf-theme) :where(.bf-top-navigation-dropdown) {
  background: var(--bf-color-background-default);
  border-top: var(--bf-border-width) solid var(--bf-color-border-low-contrast);
  display: none;
  list-style: none;
  margin: 0;
  min-inline-size: 100%;
  padding: 0;
}

:where(.bf-theme) :where(.bf-top-navigation-item.is-dropdown-toggle.is-active) > :where(.bf-top-navigation-dropdown) {
  display: block;
}

:where(.bf-theme) :where(.bf-top-navigation-dropdown-item) {
${bodyTypeStyles}  align-items: center;
  color: var(--bf-color-text-default);
  display: flex;
  gap: calc(var(--bf-baseline) * 2);
  inline-size: 100%;
  justify-content: space-between;
  min-inline-size: 0;
  padding-block: var(--bf-top-navigation-link-padding-block);
  padding-inline: calc(var(--bf-top-navigation-link-padding-inline) + (var(--bf-baseline) * 2)) var(--bf-top-navigation-link-padding-inline);
  text-align: left;
  text-decoration: none;
  white-space: nowrap;
}

:where(.bf-theme) :where(button.bf-top-navigation-dropdown-item) {
  appearance: none;
  background: transparent;
  border: 0;
  cursor: pointer;
  font: inherit;
}

:where(.bf-theme) :where(.bf-top-navigation-dropdown-item-label) {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

:where(.bf-theme) :where(.bf-top-navigation-dropdown-item-shortcut) {
  color: var(--bf-color-text-muted);
  flex: 0 0 auto;
  white-space: nowrap;
}

:where(.bf-theme) :where(button.bf-top-navigation-dropdown-item:disabled) {
  color: var(--bf-color-text-muted);
  cursor: default;
}

:where(.bf-theme) :where(.bf-top-navigation-dropdown > li.is-divider) {
  border-top: var(--bf-border-width) solid var(--bf-color-border-default);
  margin-block: calc(var(--bf-baseline) * 0.5);
}

:where(.bf-theme) :where(.bf-top-navigation-dropdown > li + li) > :where(.bf-top-navigation-dropdown-item) {
  border-top: var(--bf-border-width) solid var(--bf-color-border-low-contrast);
}

:where(.bf-theme) :where(.bf-top-navigation-dropdown-item:hover) {
  background: var(--bf-color-background-hover);
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-top-navigation-dropdown-item:focus:not(:focus-visible)) {
  outline: none;
}

:where(.bf-theme) :where(.bf-top-navigation-dropdown-item:focus-visible) {
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: -0.125rem;
}

:where(.bf-theme) :where(.bf-top-navigation-search-label) {
  display: none;
}

:where(.bf-theme) :where(.bf-top-navigation-search-toggle)::after {
  background-image: var(--bf-ui-icon-search);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
  block-size: 1rem;
  content: "";
  flex: 0 0 1rem;
  inline-size: 1rem;
}

:where(.bf-theme) :where(.bf-top-navigation-search-toggle[aria-pressed='true'])::after {
  background-image: var(--bf-ui-icon-close);
}

:where(.bf-theme) :where(.bf-top-navigation-nav) :where(.bf-top-navigation-search-toggle) {
  display: none;
}

:where(.bf-theme) :where(.bf-top-navigation-search) {
  border-top: var(--bf-border-width) solid var(--bf-color-border-low-contrast);
  display: none;
  min-inline-size: 0;
  padding-block: var(--bf-top-navigation-link-padding-block);
  padding-inline: var(--bf-top-navigation-link-padding-inline);
}

:where(.bf-theme) :where(.bf-top-navigation-search[aria-hidden='false']) {
  display: block;
}

:where(.bf-theme) :where(.bf-top-navigation:has(.bf-top-navigation-search[aria-hidden='false'])) :where(.bf-top-navigation-nav) > :where(.bf-top-navigation-list) {
  display: none;
}

:where(.bf-theme) :where(.bf-top-navigation-search) :where(.bf-search-box) {
  margin-bottom: 0;
}

:where(.bf-theme) :where(.bf-top-navigation-search-overlay) {
  display: none;
}

@media (min-width: 64.75rem) {
  :where(.bf-theme) :where(.bf-top-navigation-row) {
    align-items: stretch;
    flex-direction: row;
    gap: calc(var(--bf-baseline) * 2);
  }

  :where(.bf-theme) :where(.bf-top-navigation-banner) {
    flex: 0 0 auto;
  }

  :where(.bf-theme) :where(.bf-top-navigation-nav) {
    align-items: stretch;
    display: flex;
    flex: 1 1 auto;
    flex-direction: row;
    justify-content: space-between;
  }

  :where(.bf-theme) :where(.bf-top-navigation-list) {
    align-items: stretch;
    flex-direction: row;
    flex-wrap: wrap;
  }

  :where(.bf-theme) :where(.bf-top-navigation-nav) :where(.bf-top-navigation-item) {
    border-top: 0;
  }

  :where(.bf-theme) :where(.bf-top-navigation-link, .bf-top-navigation-search-toggle) {
    inline-size: auto;
  }

  :where(.bf-theme) :where(.bf-top-navigation-list.is-banner-actions) {
    display: none;
  }

  :where(.bf-theme) :where(.bf-top-navigation-nav) :where(.bf-top-navigation-search-toggle) {
    display: inline-flex;
  }

  :where(.bf-theme) :where(.bf-top-navigation-search-toggle) {
    justify-content: flex-start;
    min-inline-size: 0;
  }

  :where(.bf-theme) :where(.bf-top-navigation-search-label) {
    display: inline;
  }

  :where(.bf-theme) :where(.bf-top-navigation-item.is-selected) > :where(.bf-top-navigation-link),
  :where(.bf-theme) :where(.bf-top-navigation-item.is-dropdown-toggle.is-active) > :where(.bf-top-navigation-link),
  :where(.bf-theme) :where(.bf-top-navigation-link[aria-current='page']) {
    box-shadow: inset 0 calc(var(--bf-bar-thickness) * -1) 0 var(--bf-color-text-default);
  }

  :where(.bf-theme) :where(.bf-top-navigation-dropdown) {
    border-top: 0;
    box-shadow: 0 0 0 var(--bf-border-width) var(--bf-color-border-low-contrast), 0 calc(var(--bf-baseline) * 0.5) calc(var(--bf-baseline) * 2) rgba(0, 0, 0, 0.16);
    left: 0;
    min-inline-size: max(100%, 12rem);
    position: absolute;
    top: calc((var(--bf-top-navigation-link-padding-block) * 2) + var(--bf-body-line-height));
    z-index: 5;
  }

  :where(.bf-theme) :where(.bf-top-navigation-dropdown.is-right) {
    left: auto;
    right: 0;
  }

  :where(.bf-theme) :where(.bf-top-navigation-dropdown-item) {
    padding-inline: var(--bf-top-navigation-link-padding-inline);
  }

  :where(.bf-theme) :where(.bf-top-navigation-search) {
    align-items: center;
    border-top: 0;
    flex: 1 1 auto;
    justify-content: flex-end;
    padding-block: var(--bf-top-navigation-link-padding-block);
    padding-inline: 0;
  }

  :where(.bf-theme) :where(.bf-top-navigation-search) :where(.bf-search-box) {
    inline-size: min(100%, var(--bf-top-navigation-search-max-inline-size));
  }

  :where(.bf-theme) :where(.bf-top-navigation-search-overlay) {
    background: var(--bf-color-background-overlay);
    display: block;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    position: fixed;
    transition: opacity 160ms ease, visibility 160ms ease;
    visibility: hidden;
    z-index: 0;
  }

  :where(.bf-theme) :where(.bf-top-navigation-search-overlay[aria-hidden='false']) {
    opacity: 0.5;
    pointer-events: auto;
    visibility: visible;
  }
}

:where(.bf-theme) :where(.bf-side-navigation-item:has(> .bf-side-navigation-list [aria-current='page']), .bf-side-navigation-item:has(> .bf-side-navigation-list [aria-current='true'])) > :where(.bf-side-navigation-link, .bf-side-navigation-accordion-button) {
  color: var(--bf-color-text-default);
}

:where(.bf-theme) :where(.bf-side-navigation-accordion-button)::before,
:where(.bf-theme) :where(.bf-side-navigation-expand)::before {
  background-image: var(--bf-ui-icon-chevron-down);
  background-position: center;
  background-repeat: no-repeat;
  background-size: var(--bf-disclosure-icon-inline-size) var(--bf-disclosure-icon-inline-size);
  block-size: var(--bf-disclosure-icon-inline-size);
  content: "";
  flex: 0 0 var(--bf-disclosure-icon-inline-size);
  inline-size: var(--bf-disclosure-icon-inline-size);
  transform: translateY(var(--bf-disclosure-icon-optical-offset-block));
  transition: transform 120ms ease;
}

:where(.bf-theme) :where(.bf-side-navigation-accordion-button[aria-expanded='false'], .bf-side-navigation-expand[aria-expanded='false'])::before {
  transform: translateY(var(--bf-disclosure-icon-optical-offset-block)) rotate(-90deg);
}

:where(.bf-theme) :where(.bf-side-navigation-expand) {
${bodyTypeStyles}  background: transparent;
  border: 0;
  color: inherit;
  cursor: pointer;
  inset-block-start: 0;
  margin: 0;
  min-block-size: var(--bf-control-box-size-compact);
  padding-inline: calc(var(--bf-baseline) * 0.5);
  position: absolute;
  right: 0;
}

:where(.bf-theme) :where(.bf-side-navigation-list[aria-expanded='false']) {
  block-size: 0;
  margin-bottom: 0;
  opacity: 0;
  overflow: hidden;
  padding-bottom: 0;
  transform: translate3d(0, calc(var(--bf-baseline) * -0.5), 0);
  visibility: hidden;
}

:where(.bf-theme) :where(.bf-side-navigation-list[aria-expanded='true']) {
  block-size: auto;
  opacity: 1;
  transform: translate3d(0, 0, 0);
  visibility: visible;
}

:where(.bf-theme) :where(.bf-side-navigation-label) {
  display: block;
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

:where(.bf-theme) :where(.bf-side-navigation-status) {
  align-items: center;
  display: inline-flex;
  margin-inline-start: auto;
}

:where(.bf-theme) :where(.bf-side-navigation.is-icons) :where(.bf-side-navigation-icon) {
  align-items: center;
  display: inline-flex;
  flex: 0 0 1rem;
  inline-size: 1rem;
  justify-content: center;
  transform: translateY(var(--bf-side-navigation-icon-optical-offset-block));
}

:where(.bf-theme) :where(.bf-navigation.is-collapsed) :where(.bf-side-navigation-icon) {
  transform: none;
}

:where(.bf-theme) :where(.bf-side-navigation.is-icons) :where(.bf-side-navigation-link, .bf-side-navigation-text, .bf-side-navigation-accordion-button) {
  --bf-side-navigation-row-inset: max(0rem, calc(var(--bf-component-inline-inset-continuation) - 1rem - var(--bf-side-navigation-icon-gap)));
  align-items: baseline;
  column-gap: var(--bf-side-navigation-icon-gap);
}

/* Icon navigation keeps one stable label edge. Rows may omit a decorative
   icon without collapsing the shared icon track and pulling their copy left. */
:where(.bf-theme) :where(.bf-side-navigation.is-icons) :where(.bf-side-navigation-link, .bf-side-navigation-text):not(:has(> .bf-side-navigation-icon))::before {
  content: "";
  flex: 0 0 1rem;
  inline-size: 1rem;
}

/* A collapsed icon rail cannot communicate an iconless destination. Remove
   the alignment spacer with the hidden label so it cannot become a blank
   visual affordance in that state. */
:where(.bf-theme) :where(.bf-navigation.is-collapsed) :where(.bf-side-navigation.is-icons) :where(.bf-side-navigation-link, .bf-side-navigation-text):not(:has(> .bf-side-navigation-icon))::before {
  content: none;
}

/* Icon-navigation headings share the label edge, not the icon edge. This
   keeps section names aligned with both the menu copy and a tagged wordmark. */
:where(.bf-theme) :where(.bf-side-navigation.is-icons) :where(.bf-side-navigation-heading:not(.is-linked)) {
  padding-inline-start: var(--bf-component-inline-inset-continuation);
}

:where(.bf-theme) :where(.bf-side-navigation.is-icons) :where(.bf-side-navigation-heading.is-linked) > :where(.bf-side-navigation-link) {
  padding-inline-start: var(--bf-component-inline-inset-continuation);
}

:where(.bf-theme) :where(.bf-side-navigation-icon) > svg {
  block-size: 1rem;
  display: block;
  inline-size: 1rem;
}

@media (min-width: 64.75rem) {
  :where(.bf-theme) :where(.bf-side-navigation-toggle),
  :where(.bf-theme) :where(.bf-side-navigation-drawer-header),
  :where(.bf-theme) :where(.bf-side-navigation-overlay) {
    display: none;
  }

  :where(.bf-theme) :where(.bf-side-navigation-drawer),
  :where(.bf-theme) :where(.bf-side-navigation, .bf-side-navigation.is-icons, .bf-side-navigation.is-accordion, .bf-side-navigation.is-raw-html):where(.is-drawer-expanded) :where(.bf-side-navigation-drawer) {
    box-shadow: none;
    display: block;
    max-inline-size: none;
    overflow: visible;
    position: static;
    transform: translateX(0);
  }

  :where(.bf-theme) :where(.bf-side-navigation.is-sticky) {
    max-block-size: 100dvh;
    overflow-y: auto;
    position: sticky;
    top: 0;
  }
}`;
}
