import { allSidedStrokeOverlayCss, blockEndStrokeOverlayCss, blockStartStrokeOverlayCss } from "./stroke-paint.js";

export interface LegacyNavigationCssOptions {
  bodyMediumTypeStyles: string;
  bodySemiboldTypeStyles: string;
  bodyTypeStyles: string;
  buttonMarginBottom: string;
}

export function legacyNavigationCss(options: LegacyNavigationCssOptions): string {
  const {
    bodyMediumTypeStyles,
    bodySemiboldTypeStyles,
    bodyTypeStyles,
    buttonMarginBottom
  } = options;
  const toggleSelector = ":where(.bf-theme) :where(.bf-side-navigation-toggle, .bf-side-navigation-toggle.is-in-drawer)";
  const toggleStroke = allSidedStrokeOverlayCss(toggleSelector, { anchor: "relative", color: "var(--bf-color-border-high-contrast)" });
  const drawerHeaderSelector = ":where(.bf-theme) :where(.bf-side-navigation-drawer-header)";
  const drawerHeaderStroke = blockEndStrokeOverlayCss(drawerHeaderSelector, { anchor: "existing", color: "var(--bf-color-border-low-contrast)" });
  const topNavigationSelector = ":where(.bf-theme) :where(.bf-top-navigation)";
  const topNavigationStroke = blockEndStrokeOverlayCss(topNavigationSelector, { anchor: "existing", color: "var(--bf-color-border-low-contrast)" });
  const topNavigationDropdownSelector = ":where(.bf-theme) :where(.bf-top-navigation-dropdown)";
  const topNavigationDropdownStroke = blockStartStrokeOverlayCss(topNavigationDropdownSelector, { anchor: "relative", color: "var(--bf-color-border-low-contrast)" });
  const topNavigationSearchSelector = ":where(.bf-theme) :where(.bf-top-navigation-search)";
  const topNavigationSearchStroke = blockStartStrokeOverlayCss(topNavigationSearchSelector, { anchor: "relative", color: "var(--bf-color-border-low-contrast)" });

  return `${toggleStroke.owner}
${drawerHeaderStroke.owner}
${topNavigationStroke.owner}
${topNavigationDropdownStroke.owner}
${topNavigationSearchStroke.owner}

:where(.bf-theme) :where(.bf-side-navigation, .bf-side-navigation.is-icons, .bf-side-navigation.is-accordion, .bf-side-navigation.is-raw-html) {
  /* The navigation panel owns grid-margin gutters. Every row reserves one
     tier-sized icon column plus the shared mark gap, including iconless and
     nested rows, so every label reaches one stable panel keyline. */
  --bf-side-navigation-gutter: var(--bf-page-margin);
  --bf-side-navigation-icon-size: var(--bf-icon-size-default);
  --bf-side-navigation-label-keyline: calc(var(--bf-side-navigation-gutter) + var(--bf-side-navigation-icon-size) + var(--bf-side-navigation-icon-gap));
  --bf-side-navigation-group-gap: var(--bf-section-space-shallow);
  --bf-side-navigation-heading-list-gap: var(--bf-field-gap);
  color: var(--bf-color-text-inactive);
  display: block;
  inline-size: 100%;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-side-navigation-groups) {
  align-content: start;
  display: grid;
  gap: var(--bf-side-navigation-group-gap);
}

:where(.bf-theme) :where(.bf-side-navigation-group) {
  display: grid;
  gap: var(--bf-side-navigation-heading-list-gap);
  min-inline-size: 0;
}

/* Keep the divider and heading as one tight header. The group owns only the
   larger transition from that header to its list, so the compensated rule
   cannot change the heading/list phase. */
:where(.bf-theme) :where(.bf-side-navigation-group-header) {
  display: grid;
  gap: 0rem;
  min-inline-size: 0;
  padding-inline: var(--bf-side-navigation-label-keyline) var(--bf-side-navigation-gutter);
}

:where(.bf-theme) :where(.bf-side-navigation-group-header) > hr {
  inline-size: 100%;
  margin-inline: 0;
}

/* The intrinsic single-line heading plus metric end compensation closes on
   the tier grid. This lower minimum remains only a wrapping floor, so longer
   headings can grow. */
:where(.bf-theme) :where(.bf-side-navigation-group-header) > :where(.bf-side-navigation-heading) {
  min-block-size: calc((var(--bf-baseline) * 4) - var(--bf-body-nudge-end));
  padding-inline: 0;
}

:where(.bf-theme) :where(.bf-side-navigation-drawer) {
  --bf-side-navigation-drawer-elevation-layer: 0 0 0 0 transparent;
  background: var(--bf-color-background-default);
  box-shadow: var(--bf-side-navigation-drawer-elevation-layer);
  bottom: 0;
  color: var(--bf-color-text-default);
  display: flex;
  flex-direction: column;
  gap: var(--bf-section-space-shallow);
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
  --bf-side-navigation-drawer-elevation-layer: 0 1.5rem 4.5rem rgba(0, 0, 0, 0.38);
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
  margin-bottom: 0;
  padding-bottom: var(--bf-panel-padding-block);
  padding-inline: var(--bf-panel-padding-inline);
  padding-top: var(--bf-panel-padding-block);
  position: sticky;
  top: 0;
  z-index: 1;
}

:where(.bf-theme) :where(.bf-side-navigation-drawer-chrome) {
  display: grid;
  gap: 0;
}

:where(.bf-theme) :where(.bf-side-navigation-drawer-body) {
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-side-navigation-toggle, .bf-side-navigation-toggle.is-in-drawer) {
${bodyTypeStyles}  align-items: center;
  appearance: none;
  background: var(--bf-color-background-default);
  border: 0;
  border-radius: var(--bf-radius);
  color: var(--bf-color-text-default);
  cursor: pointer;
  display: inline-flex;
  gap: var(--bf-leading-mark-gap);
  justify-content: center;
  margin: 0 0 ${buttonMarginBottom};
  padding-block: var(--bf-interface-row-padding-block);
  padding-inline: var(--bf-component-inline-inset-action);
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-side-navigation-toggle)::before {
  background-image: var(--bf-ui-icon-chevron-down);
  background-position: center;
  background-repeat: no-repeat;
  background-size: var(--bf-icon-size-default) var(--bf-icon-size-default);
  block-size: var(--bf-icon-size-default);
  content: "";
  inline-size: var(--bf-icon-size-default);
  transform: rotate(-90deg);
}

:where(.bf-theme) :where(.bf-side-navigation-toggle.is-in-drawer)::before {
  background-image: var(--bf-ui-icon-chevron-down);
  background-position: center;
  background-repeat: no-repeat;
  background-size: var(--bf-icon-size-default) var(--bf-icon-size-default);
  block-size: var(--bf-icon-size-default);
  content: "";
  inline-size: var(--bf-icon-size-default);
  transform: rotate(90deg);
}

:where(.bf-theme) :where(.bf-side-navigation-toggle:hover) {
  background: var(--bf-color-background-hover);
}

:where(.bf-theme) :where(.bf-side-navigation-toggle:focus:not(:focus-visible)) {
  outline: none;
}

:where(.bf-theme) :where(.bf-side-navigation-toggle:focus-visible) {
  --bf-overlay-focus-layer: inset 0 0 0 0.125rem var(--bf-color-focus);
  outline: none;
}

${toggleStroke.painter}
${drawerHeaderStroke.painter}

@media (forced-colors: active) {
  :where(.bf-theme) :where(.bf-side-navigation-toggle:focus-visible) {
    outline: 0.125rem solid Highlight;
    outline-offset: -0.125rem;
  }
}

:where(.bf-theme) :where(.bf-side-navigation-heading, .bf-side-navigation-heading.is-linked) {
${bodySemiboldTypeStyles}  display: block;
  margin: 0 0 var(--bf-body-margin-bottom);
  padding-block: var(--bf-body-nudge-start) 0;
  padding-inline: var(--bf-side-navigation-label-keyline) var(--bf-side-navigation-gutter);
}

:where(.bf-theme) :where(.bf-side-navigation-heading.is-linked) {
  padding-inline: 0;
}

:where(.bf-theme) :where(.bf-side-navigation-context-switcher) {
  display: grid;
  gap: var(--bf-field-gap);
  min-inline-size: 0;
  padding-inline: var(--bf-side-navigation-label-keyline) var(--bf-side-navigation-gutter);
}

:where(.bf-theme) :where(.bf-side-navigation-context-switcher-label) {
${bodySemiboldTypeStyles}  display: block;
  margin: 0 0 var(--bf-body-margin-bottom);
  padding-block: var(--bf-body-nudge-start) 0;
}

:where(.bf-theme) :where(.bf-side-navigation-context-switcher) > :where(.bf-field-boundary) {
  inline-size: 100%;
}

:where(.bf-theme) :where(.bf-side-navigation-list) {
  display: grid;
  grid-auto-rows: minmax(var(--bf-interface-row-occupied-block-size), auto);
  list-style: none;
  margin: 0;
  min-inline-size: 0;
  padding: 0;
}

:where(.bf-theme) :where(.bf-side-navigation-item, .bf-side-navigation-item.is-title) {
  display: grid;
  margin: 0;
  min-inline-size: 0;
  position: relative;
}

:where(.bf-theme) :where(.bf-side-navigation-link, .bf-side-navigation-text, .bf-side-navigation-accordion-button) {
${bodyTypeStyles}  align-items: center;
  align-self: start;
  background: transparent;
  border: 0;
  border-block: 0;
  color: var(--bf-color-text-inactive);
  display: flex;
  gap: var(--bf-side-navigation-icon-gap);
  inline-size: 100%;
  justify-content: flex-start;
  margin: 0 0 var(--bf-interface-row-compensation-block-end);
  min-inline-size: 0;
  /* A navigation row is the focus owner. Put nested interactive controls in a
     following panel/list item rather than inside the clipped row itself. */
  overflow: hidden;
  padding-block: var(--bf-interface-row-padding-block);
  padding-inline: var(--bf-side-navigation-label-keyline) var(--bf-side-navigation-gutter);
  position: relative;
  text-align: left;
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-side-navigation-accordion-button) {
  gap: var(--bf-side-navigation-icon-gap);
}

:where(.bf-theme) :where(.bf-side-navigation-item.is-title) > :where(.bf-side-navigation-link, .bf-side-navigation-text) {
  color: var(--bf-color-text-default);
  font-weight: 600;
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
  color: var(--bf-color-text-default);
  cursor: default;
}

/* Selection is one-sided paint inside the start gutter. It neither consumes
   row space nor changes the shared label keyline. */
:where(.bf-theme) :where(.bf-side-navigation-link.is-active, .bf-side-navigation-link[aria-current='page'], .bf-side-navigation-link[aria-current='true'])::after {
  background: var(--bf-color-text-default);
  block-size: 100%;
  content: "";
  inline-size: var(--bf-bar-thickness);
  inset-block-start: 0;
  inset-inline-start: 0;
  pointer-events: none;
  position: absolute;
}

@media (forced-colors: active) {
  :where(.bf-theme) :where(.bf-side-navigation-link.is-active, .bf-side-navigation-link[aria-current='page'], .bf-side-navigation-link[aria-current='true'])::after {
    background: transparent;
    border-inline-start: var(--bf-bar-thickness) solid CanvasText;
    inline-size: 0;
  }
}

:where(.bf-theme) :where(.bf-top-navigation) {
  background: var(--bf-color-background-default);
  color: var(--bf-color-text-default);
  isolation: isolate;
  position: relative;
  z-index: 50;
}

${topNavigationStroke.painter}

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
  column-gap: var(--bf-leading-mark-gap);
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
  position: relative;
}

:where(.bf-theme) :where(.bf-top-navigation-nav) :where(.bf-top-navigation-item)::before {
  background: var(--bf-color-border-low-contrast);
  block-size: var(--bf-border-width);
  content: "";
  inline-size: 100%;
  inset-block-start: 0;
  inset-inline: 0;
  pointer-events: none;
  position: absolute;
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
  gap: var(--bf-leading-mark-gap);
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
  color: var(--bf-color-text-default);
  position: relative;
}

:where(.bf-theme) :where(.bf-top-navigation-item.is-selected) > :where(.bf-top-navigation-link)::before,
:where(.bf-theme) :where(.bf-top-navigation-item.is-dropdown-toggle.is-active) > :where(.bf-top-navigation-link)::before,
:where(.bf-theme) :where(.bf-top-navigation-link[aria-current='page'])::before {
  background: var(--bf-color-text-default);
  block-size: 100%;
  content: "";
  inline-size: var(--bf-bar-thickness);
  inset-block-start: 0;
  inset-inline-start: 0;
  pointer-events: none;
  position: absolute;
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
  background-size: var(--bf-icon-size-default) var(--bf-icon-size-default);
  block-size: var(--bf-icon-size-default);
  bottom: 0;
  content: "";
  inline-size: var(--bf-icon-size-default);
  pointer-events: none;
  position: absolute;
  right: var(--bf-top-navigation-link-padding-inline);
  top: 50%;
  transform: translateY(-50%) rotate(0deg);
  transition: transform 160ms ease;
}

:where(.bf-theme) :where(.bf-top-navigation-item.is-dropdown-toggle.is-active) > :where(.bf-top-navigation-dropdown-toggle)::after {
  transform: translateY(-50%) rotate(180deg);
}

:where(.bf-theme) :where(.bf-top-navigation-dropdown) {
  background: var(--bf-color-background-default);
  border: 0;
  box-shadow: none;
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
  gap: var(--bf-component-inline-inset-action);
  inline-size: 100%;
  justify-content: space-between;
  min-inline-size: 0;
  padding-block: var(--bf-top-navigation-link-padding-block);
  padding-inline: calc(var(--bf-top-navigation-link-padding-inline) + var(--bf-component-inline-inset-action)) var(--bf-top-navigation-link-padding-inline);
  position: relative;
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
  block-size: var(--bf-baseline);
  position: relative;
}

:where(.bf-theme) :where(.bf-top-navigation-dropdown > li.is-divider)::before,
:where(.bf-theme) :where(.bf-top-navigation-dropdown > li + li) > :where(.bf-top-navigation-dropdown-item)::before {
  background: var(--bf-color-border-low-contrast);
  block-size: var(--bf-border-width);
  content: "";
  inline-size: 100%;
  inset-block-start: 0;
  inset-inline: 0;
  pointer-events: none;
  position: absolute;
}

:where(.bf-theme) :where(.bf-top-navigation-dropdown > li.is-divider)::before {
  background: var(--bf-color-border-default);
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
  background-size: var(--bf-icon-size-default) var(--bf-icon-size-default);
  block-size: var(--bf-icon-size-default);
  content: "";
  flex: 0 0 var(--bf-icon-size-default);
  inline-size: var(--bf-icon-size-default);
}

:where(.bf-theme) :where(.bf-top-navigation-search-toggle[aria-pressed='true'])::after {
  background-image: var(--bf-ui-icon-close);
}

:where(.bf-theme) :where(.bf-top-navigation-nav) :where(.bf-top-navigation-search-toggle) {
  display: none;
}

:where(.bf-theme) :where(.bf-top-navigation-search) {
  box-shadow: none;
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
    gap: var(--bf-component-inline-inset-action);
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
    position: relative;
  }

  :where(.bf-theme) :where(.bf-top-navigation-nav) :where(.bf-top-navigation-item)::before {
    content: none;
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
    box-shadow: none;
  }

  :where(.bf-theme) :where(.bf-top-navigation-item.is-selected) > :where(.bf-top-navigation-link)::before,
  :where(.bf-theme) :where(.bf-top-navigation-item.is-dropdown-toggle.is-active) > :where(.bf-top-navigation-link)::before,
  :where(.bf-theme) :where(.bf-top-navigation-link[aria-current='page'])::before {
    block-size: var(--bf-bar-thickness);
    inline-size: 100%;
    inset-block-start: auto;
    inset-block-end: 0;
  }

  :where(.bf-theme) :where(.bf-top-navigation-dropdown) {
    --bf-overlay-stroke-layer: inset 0 0 0 var(--bf-stroke-width) var(--bf-stroke-color);
    --bf-overlay-elevation-layer: 0 calc(var(--bf-baseline) * 0.5) calc(var(--bf-baseline) * 2) rgba(0, 0, 0, 0.16);
    box-shadow: none;
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
    --bf-stroke-width: 0rem;
    align-items: center;
    box-shadow: none;
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

@media (forced-colors: active) {
  :where(.bf-theme) :where(.bf-top-navigation-nav) :where(.bf-top-navigation-item)::before,
  :where(.bf-theme) :where(.bf-top-navigation-dropdown > li.is-divider)::before,
  :where(.bf-theme) :where(.bf-top-navigation-dropdown > li + li) > :where(.bf-top-navigation-dropdown-item)::before {
    background: CanvasText;
  }

  :where(.bf-theme) :where(.bf-top-navigation-item.is-selected) > :where(.bf-top-navigation-link)::before,
  :where(.bf-theme) :where(.bf-top-navigation-item.is-dropdown-toggle.is-active) > :where(.bf-top-navigation-link)::before,
  :where(.bf-theme) :where(.bf-top-navigation-link[aria-current='page'])::before {
    background: CanvasText;
  }

  :where(.bf-theme) :where(.bf-top-navigation-dropdown) {
    box-shadow: none;
  }
}

@media (forced-colors: active) and (min-width: 64.75rem) {
  :where(.bf-theme) :where(.bf-top-navigation-nav) :where(.bf-top-navigation-item)::before {
    content: none;
  }
}

${topNavigationDropdownStroke.painter}
${topNavigationSearchStroke.painter}

@media (forced-colors: active) and (min-width: 64.75rem) {
  :where(.bf-theme) :where(.bf-top-navigation-dropdown)::after {
    border-block-start: 0;
    outline: var(--bf-stroke-width) solid CanvasText;
    outline-offset: calc(var(--bf-stroke-width) * -1);
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

:where(.bf-theme) :where(.bf-side-navigation-accordion-button)::before {
  flex: none;
  inset-block-start: calc(var(--bf-interface-row-padding-block) + ((var(--bf-body-line-height) - var(--bf-side-navigation-icon-size)) * 0.5));
  inset-inline-start: var(--bf-side-navigation-gutter);
  position: absolute;
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
  min-block-size: var(--bf-interface-row-occupied-block-size);
  padding-inline: var(--bf-inline-unit);
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
  flex: none;
  inline-size: var(--bf-side-navigation-icon-size);
  inset-block-start: calc(var(--bf-interface-row-padding-block) + ((var(--bf-body-line-height) - var(--bf-side-navigation-icon-size)) * 0.5));
  inset-inline-start: var(--bf-side-navigation-gutter);
  justify-content: center;
  position: absolute;
  transform: translateY(var(--bf-side-navigation-icon-optical-offset-block));
}

:where(.bf-theme) :where(.bf-navigation.is-collapsed) :where(.bf-side-navigation-icon) {
  inset: auto;
  position: static;
  transform: none;
}

:where(.bf-theme) :where(.bf-side-navigation.is-icons) :where(.bf-side-navigation-link, .bf-side-navigation-text, .bf-side-navigation-accordion-button) {
  align-items: baseline;
  column-gap: var(--bf-side-navigation-icon-gap);
}

/* Icon-navigation headings share the label edge, not the icon edge. This
   keeps section names aligned with both the menu copy and a tagged wordmark. */
:where(.bf-theme) :where(.bf-side-navigation.is-icons) :where(.bf-side-navigation-heading:not(.is-linked)) {
  padding-inline-start: var(--bf-side-navigation-label-keyline);
}

:where(.bf-theme) :where(.bf-side-navigation.is-icons) :where(.bf-side-navigation-heading.is-linked) > :where(.bf-side-navigation-link) {
  padding-inline-start: var(--bf-side-navigation-label-keyline);
}

:where(.bf-theme) :where(.bf-side-navigation-group-header) > :where(.bf-side-navigation-heading:not(.is-linked)),
:where(.bf-theme) :where(.bf-side-navigation-group-header) > :where(.bf-side-navigation-heading.is-linked) > :where(.bf-side-navigation-link) {
  padding-inline: 0;
}

:where(.bf-theme) :where(.bf-side-navigation-icon) > svg {
  block-size: var(--bf-side-navigation-icon-size);
  display: block;
  inline-size: var(--bf-side-navigation-icon-size);
}

@media (min-width: 64.75rem) {
  :where(.bf-theme) :where(.bf-side-navigation-toggle),
  :where(.bf-theme) :where(.bf-side-navigation-drawer-header),
  :where(.bf-theme) :where(.bf-side-navigation-overlay) {
    display: none;
  }

  :where(.bf-theme) :where(.bf-side-navigation-drawer),
  :where(.bf-theme) :where(.bf-side-navigation, .bf-side-navigation.is-icons, .bf-side-navigation.is-accordion, .bf-side-navigation.is-raw-html):where(.is-drawer-expanded) :where(.bf-side-navigation-drawer) {
    --bf-side-navigation-drawer-elevation-layer: 0 0 0 0 transparent;
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
