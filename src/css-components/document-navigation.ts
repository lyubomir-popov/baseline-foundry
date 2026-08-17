type DocumentNavigationCssOptions = {
  bodyCaseTypeStyles: string;
  bodyTypeStyles: string;
  headingTypeStyles: string;
};

/**
 * Document-navigation ports keep the useful rendered hierarchy from current
 * Vanilla while using BF roles, logical properties and intrinsic breakpoints.
 * Behaviour remains deliberately external: controllers synchronise their
 * aria-expanded state with the matching is-expanded modifier.
 */
export function documentNavigationCss(options: DocumentNavigationCssOptions): string {
  const { bodyCaseTypeStyles, bodyTypeStyles, headingTypeStyles } = options;

  return `/* ------------------------------------------------------------------ */
/* Document navigation (Vanilla parity)                                 */
/* ------------------------------------------------------------------ */

:where(.bf-theme) :where(.bf-in-page-navigation) {
  container-name: bf-in-page-navigation;
  container-type: inline-size;
  margin-block: 0 var(--bf-section-space-shallow);
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-in-page-navigation-nav) {
  max-block-size: 100dvb;
  min-inline-size: 0;
  overflow: auto;
  position: sticky;
  top: var(--bf-space-3);
}

:where(.bf-theme) :where(.bf-in-page-navigation-heading) {
${headingTypeStyles}  color: var(--bf-color-text-muted);
  display: block;
  margin: 0 0 var(--bf-space-1);
  padding-block: var(--bf-h6-nudge-start) var(--bf-h6-nudge-end);
}

:where(.bf-theme) :where(.bf-in-page-navigation-list) {
  border-inline-start: calc(var(--bf-border-width) * 3) solid var(--bf-color-border-low-contrast);
  list-style: none;
  margin: 0;
  min-inline-size: 0;
  padding: 0;
}

:where(.bf-theme) :where(.bf-in-page-navigation-item) {
  margin: 0;
  min-inline-size: 0;
  padding: 0;
  position: relative;
}

:where(.bf-theme) :where(.bf-in-page-navigation-link) {
${bodyTypeStyles}  color: var(--bf-color-text-muted);
  display: -webkit-box;
  line-clamp: 2;
  margin: 0;
  min-inline-size: 0;
  overflow: hidden;
  overflow-wrap: anywhere;
  padding-block: calc(var(--bf-body-nudge-start) + var(--bf-space-half)) calc(var(--bf-body-nudge-end) + var(--bf-space-half));
  padding-inline: var(--bf-space-2) 0;
  position: relative;
  text-decoration: none;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
}

:where(.bf-theme) :where(.bf-in-page-navigation-link:hover) {
  color: var(--bf-color-text-default);
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-in-page-navigation-link:focus:not(:focus-visible)) {
  outline: none;
}

:where(.bf-theme) :where(.bf-in-page-navigation-link:focus-visible) {
  outline: 2px solid var(--bf-color-focus);
  outline-offset: 2px;
}

:where(.bf-theme) :where(.bf-in-page-navigation-link.is-active, .bf-in-page-navigation-link[aria-current]) {
  color: var(--bf-color-text-default);
  font-weight: 600;
}

:where(.bf-theme) :where(.bf-in-page-navigation-link.is-active, .bf-in-page-navigation-link[aria-current])::before {
  background: currentColor;
  block-size: 100%;
  content: "";
  inline-size: calc(var(--bf-border-width) * 3);
  inset-block: 0;
  inset-inline-start: calc(var(--bf-border-width) * -3);
  position: absolute;
}

:where(.bf-theme) :where(.bf-in-page-navigation-list .bf-in-page-navigation-list) {
  border: 0;
  margin: 0;
  padding: 0;
}

:where(.bf-theme) :where(.bf-in-page-navigation-list .bf-in-page-navigation-list .bf-in-page-navigation-link) {
  padding-inline-start: var(--bf-space-4);
}

:where(.bf-theme) :where(.bf-in-page-navigation-toggle) {
${bodyCaseTypeStyles}  align-items: center;
  background: var(--bf-color-background-default);
  border: 0;
  color: var(--bf-color-text-default);
  cursor: pointer;
  display: none;
  justify-content: center;
  margin: 0;
  min-block-size: var(--bf-control-box-size-compact);
  padding-block: var(--bf-control-block-padding-compact);
  padding-inline: var(--bf-space-1);
}

:where(.bf-theme) :where(.bf-in-page-navigation-toggle:hover) {
  background: var(--bf-color-background-hover);
}

:where(.bf-theme) :where(.bf-in-page-navigation-toggle:focus:not(:focus-visible)) {
  outline: none;
}

:where(.bf-theme) :where(.bf-in-page-navigation-toggle:focus-visible) {
  outline: 2px solid var(--bf-color-focus);
  outline-offset: -2px;
}

:where(.bf-theme) :where(.bf-in-page-navigation-toggle > .bf-icon) {
  --bf-icon-size: var(--bf-icon-size-default);
}

@container bf-in-page-navigation (width < 40rem) {
  :where(.bf-theme) :where(.bf-in-page-navigation-nav) {
    align-items: center;
    background: var(--bf-color-background-default);
    border-block-end: var(--bf-border-width) solid var(--bf-color-border-low-contrast);
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    max-block-size: none;
    overflow: visible;
    position: static;
  }

  :where(.bf-theme) :where(.bf-in-page-navigation-heading) {
    display: none;
  }

  :where(.bf-theme) :where(.bf-in-page-navigation-list) {
    border: 0;
    display: flex;
    grid-column: 1;
    grid-row: 1;
    margin: 0;
    overflow-x: auto;
    overscroll-behavior-inline: contain;
    scrollbar-width: none;
    white-space: nowrap;
  }

  :where(.bf-theme) :where(.bf-in-page-navigation-list::-webkit-scrollbar) {
    display: none;
  }

  :where(.bf-theme) :where(.bf-in-page-navigation-item) {
    display: inline-block;
    flex: 0 0 auto;
    max-inline-size: min(50cqi, 18rem);
  }

  :where(.bf-theme) :where(.bf-in-page-navigation-link) {
    display: block;
    overflow: hidden;
    padding-block: calc(var(--bf-control-block-padding-compact) - var(--bf-border-width));
    padding-inline: var(--bf-space-1);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.bf-theme) :where(.bf-in-page-navigation-link.is-active, .bf-in-page-navigation-link[aria-current])::before {
    block-size: 50%;
    inset-block: 25%;
    inset-inline-start: 0;
  }

  :where(.bf-theme) :where(.bf-in-page-navigation-list .bf-in-page-navigation-list) {
    display: none;
  }

  :where(.bf-theme) :where(.bf-in-page-navigation-toggle) {
    display: inline-flex;
    grid-column: 2;
    grid-row: 1;
  }

  :where(.bf-theme) :where(.bf-in-page-navigation.is-expanded .bf-in-page-navigation-nav, .bf-in-page-navigation:has(.bf-in-page-navigation-toggle[aria-expanded='true']) .bf-in-page-navigation-nav) {
    align-items: start;
    background: var(--bf-color-background-alt);
    max-block-size: 100dvb;
    overflow: auto;
    position: relative;
  }

  :where(.bf-theme) :where(.bf-in-page-navigation.is-expanded .bf-in-page-navigation-heading, .bf-in-page-navigation:has(.bf-in-page-navigation-toggle[aria-expanded='true']) .bf-in-page-navigation-heading) {
    display: block;
    grid-column: 1;
    grid-row: 1;
    margin: 0;
    padding-block: calc(var(--bf-h6-nudge-start) + var(--bf-space-1)) calc(var(--bf-h6-nudge-end) + var(--bf-space-1));
    padding-inline: var(--bf-space-2);
  }

  :where(.bf-theme) :where(.bf-in-page-navigation.is-expanded > .bf-in-page-navigation-nav > .bf-in-page-navigation-list, .bf-in-page-navigation:has(.bf-in-page-navigation-toggle[aria-expanded='true']) > .bf-in-page-navigation-nav > .bf-in-page-navigation-list) {
    background: var(--bf-color-background-alt);
    border-inline-start: calc(var(--bf-border-width) * 3) solid var(--bf-color-border-low-contrast);
    display: block;
    grid-column: 1 / -1;
    grid-row: 2;
    /* The mobile nav owns a bottom rule; reserve its thickness within the
       list's trailing space so the expanded state keeps its baseline phase. */
    margin-block-end: calc(var(--bf-space-2) - var(--bf-border-width));
    overflow: visible;
    white-space: normal;
  }

  :where(.bf-theme) :where(.bf-in-page-navigation.is-expanded .bf-in-page-navigation-item, .bf-in-page-navigation:has(.bf-in-page-navigation-toggle[aria-expanded='true']) .bf-in-page-navigation-item) {
    display: block;
    max-inline-size: none;
  }

  :where(.bf-theme) :where(.bf-in-page-navigation.is-expanded .bf-in-page-navigation-link, .bf-in-page-navigation:has(.bf-in-page-navigation-toggle[aria-expanded='true']) .bf-in-page-navigation-link) {
    display: -webkit-box;
    overflow-wrap: anywhere;
    padding-block: calc(var(--bf-body-nudge-start) + var(--bf-space-half)) calc(var(--bf-body-nudge-end) + var(--bf-space-half));
    padding-inline: var(--bf-space-2) 0;
    white-space: normal;
  }

  :where(.bf-theme) :where(.bf-in-page-navigation.is-expanded .bf-in-page-navigation-list .bf-in-page-navigation-list, .bf-in-page-navigation:has(.bf-in-page-navigation-toggle[aria-expanded='true']) .bf-in-page-navigation-list .bf-in-page-navigation-list) {
    display: block;
  }

  :where(.bf-theme) :where(.bf-in-page-navigation.is-expanded .bf-in-page-navigation-link.is-active, .bf-in-page-navigation.is-expanded .bf-in-page-navigation-link[aria-current], .bf-in-page-navigation:has(.bf-in-page-navigation-toggle[aria-expanded='true']) .bf-in-page-navigation-link.is-active, .bf-in-page-navigation:has(.bf-in-page-navigation-toggle[aria-expanded='true']) .bf-in-page-navigation-link[aria-current])::before {
    block-size: 100%;
    inset-block: 0;
    inset-inline-start: calc(var(--bf-border-width) * -3);
  }
}

/* ------------------------------------------------------------------ */
/* Reduced top navigation                                               */
/* ------------------------------------------------------------------ */

/* This is a modifier of BF's existing top-navigation structure, not a
 * second navigation API. It retains the existing menu, dropdown and search
 * controller contracts while matching Vanilla's reduced chrome. */
:where(.bf-theme) :where(.bf-top-navigation.is-reduced) {
  background: var(--bf-color-background-alt);
  --bf-top-navigation-link-padding-block: var(--bf-control-block-padding-compact);
}

:where(.bf-theme) :where(.bf-top-navigation.is-reduced) :where(.bf-top-navigation-logo-tag) {
  display: none;
}

:where(.bf-theme) :where(.bf-top-navigation.is-reduced) :where(.bf-top-navigation-row) {
  min-block-size: 0;
}

:where(.bf-theme) :where(.bf-top-navigation.is-reduced) :where(.bf-top-navigation-logo) > :where(.bf-top-navigation-link),
:where(.bf-theme) :where(.bf-top-navigation.is-reduced) :where(.bf-top-navigation-link, .bf-top-navigation-menu-toggle, .bf-top-navigation-search-toggle) {
  color: var(--bf-color-text-muted);
  font-size: var(--bf-body-font-size);
  line-height: var(--bf-body-line-height);
  padding-block: var(--bf-top-navigation-link-padding-block);
}

:where(.bf-theme) :where(.bf-top-navigation.is-reduced) :where(.bf-top-navigation-logo.is-canonical-tagged) > :where(.bf-top-navigation-link) {
  align-items: center;
  padding-inline-start: 0;
}

:where(.bf-theme) :where(.bf-top-navigation.is-reduced) :where(.bf-top-navigation-logo-title) {
  font-size: var(--bf-body-font-size);
  font-weight: 400;
  line-height: var(--bf-body-line-height);
  padding-block: 0;
}

:where(.bf-theme) :where(.bf-top-navigation.is-reduced) :where(.bf-top-navigation-banner .bf-top-navigation-link, .bf-top-navigation-banner .bf-top-navigation-menu-toggle, .bf-top-navigation-banner .bf-top-navigation-search-toggle) {
  color: var(--bf-color-text-muted);
}

:where(.bf-theme) :where(.bf-top-navigation.is-reduced) :where(.bf-top-navigation-search-label) {
  display: none;
}

@media (min-width: 64.75rem) {
  :where(.bf-theme) :where(.bf-top-navigation.is-reduced) :where(.bf-top-navigation-dropdown) {
    top: calc((var(--bf-top-navigation-link-padding-block) * 2) + var(--bf-body-line-height));
  }

  :where(.bf-theme) :where(.bf-top-navigation.is-reduced) :where(.bf-top-navigation-search) {
    background: var(--bf-color-background-alt);
    border: var(--bf-border-width) solid var(--bf-color-border-low-contrast);
    box-shadow: 0 calc(var(--bf-baseline) * 0.5) calc(var(--bf-baseline) * 2) rgba(0, 0, 0, 0.16);
    inset-block-start: 100%;
    inset-inline-end: 0;
    padding: var(--bf-control-block-padding-compact) var(--bf-top-navigation-link-padding-inline);
    position: absolute;
  }

  :where(.bf-theme) :where(.bf-top-navigation.is-reduced:has(.bf-top-navigation-search[aria-hidden='false'])) :where(.bf-top-navigation-nav) > :where(.bf-top-navigation-list) {
    display: flex;
  }
}

/* ------------------------------------------------------------------ */
/* Table of contents                                                   */
/* ------------------------------------------------------------------ */

:where(.bf-theme) :where(.bf-table-of-contents) {
  container-name: bf-table-of-contents;
  container-type: inline-size;
  margin-block: 0 var(--bf-section-space-shallow);
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-table-of-contents-section) {
  margin: 0;
  min-inline-size: 0;
  padding-block-end: var(--bf-space-2);
}

:where(.bf-theme) :where(.bf-table-of-contents-section + .bf-table-of-contents-section) {
  border-block-start: var(--bf-border-width) solid var(--bf-color-border-low-contrast);
  padding-block-start: calc(var(--bf-space-2) - var(--bf-border-width));
}

:where(.bf-theme) :where(.bf-table-of-contents-heading) {
${headingTypeStyles}  color: var(--bf-color-text-muted);
  margin: 0 0 var(--bf-space-1);
  padding-block: var(--bf-h6-nudge-start) var(--bf-h6-nudge-end);
}

:where(.bf-theme) :where(.bf-table-of-contents-list) {
  list-style: none;
  margin: 0;
  min-inline-size: 0;
  padding: 0;
}

:where(.bf-theme) :where(.bf-table-of-contents-item) {
  margin: 0;
  min-inline-size: 0;
  padding: 0;
}

:where(.bf-theme) :where(.bf-table-of-contents-link) {
${bodyTypeStyles}  color: var(--bf-color-link-default);
  display: block;
  margin: 0;
  overflow-wrap: anywhere;
  padding-block: calc(var(--bf-body-nudge-start) + var(--bf-space-half)) calc(var(--bf-body-nudge-end) + var(--bf-space-half));
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-table-of-contents-link:hover) {
  color: var(--bf-color-text-default);
  text-decoration: underline;
}

:where(.bf-theme) :where(.bf-table-of-contents-link:focus:not(:focus-visible)) {
  outline: none;
}

:where(.bf-theme) :where(.bf-table-of-contents-link:focus-visible) {
  outline: 2px solid var(--bf-color-focus);
  outline-offset: 2px;
}

:where(.bf-theme) :where(.bf-table-of-contents-link.is-active, .bf-table-of-contents-link[aria-current]) {
  color: var(--bf-color-text-default);
  font-weight: 600;
}

:where(.bf-theme) :where(.bf-table-of-contents-list .bf-table-of-contents-list) {
  margin-inline-start: var(--bf-space-2);
}

@container bf-table-of-contents (width < 20rem) {
  :where(.bf-theme) :where(.bf-table-of-contents-list .bf-table-of-contents-list) {
    margin-inline-start: var(--bf-space-1);
  }
}
`;
}
