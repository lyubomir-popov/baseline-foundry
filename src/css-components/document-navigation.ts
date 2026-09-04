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
  margin: 0;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-in-page-navigation-nav) {
  --bf-stack-space: var(--bf-space-1);
  align-content: start;
  display: grid;
  gap: var(--bf-stack-space);
  max-block-size: 100dvb;
  min-inline-size: 0;
  overflow: auto;
  position: sticky;
  top: var(--bf-space-3);
}

:where(.bf-theme) :where(.bf-in-page-navigation-heading) {
${headingTypeStyles}  color: var(--bf-color-text-muted);
  display: block;
  margin-block: 0 var(--bf-h6-margin-bottom);
  padding-block-end: 0;
  padding-block-start: var(--bf-h6-nudge-start);
}

:where(.bf-theme) :where(.bf-in-page-navigation-list) {
  --bf-stack-space: var(--bf-space-1);
  align-content: start;
  border-inline-start: var(--bf-bar-thickness) solid var(--bf-color-border-low-contrast);
  display: grid;
  gap: var(--bf-stack-space);
  list-style: none;
  margin: 0;
  min-inline-size: 0;
  padding: 0;
}

:where(.bf-theme) :where(.bf-in-page-navigation-item) {
  align-content: start;
  display: grid;
  gap: var(--bf-stack-space);
  margin: 0;
  min-inline-size: 0;
  padding: 0;
  position: relative;
}

:where(.bf-theme) :where(a.bf-in-page-navigation-link) {
${bodyTypeStyles}  color: var(--bf-color-text-muted);
  display: -webkit-box;
  line-clamp: 2;
  margin: 0;
  min-inline-size: 0;
  overflow: hidden;
  overflow-wrap: anywhere;
  padding-block: var(--bf-body-nudge-start) var(--bf-body-nudge-end);
  padding-inline: var(--bf-space-2) 0;
  position: relative;
  text-decoration: none;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
}

:where(.bf-theme) :where(a.bf-in-page-navigation-link:hover) {
  color: var(--bf-color-text-default);
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-in-page-navigation-link:focus:not(:focus-visible)) {
  outline: none;
}

:where(.bf-theme) :where(.bf-in-page-navigation-link:focus-visible) {
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: 0.125rem;
}

:where(.bf-theme) :where(.bf-in-page-navigation-link.is-active, .bf-in-page-navigation-link[aria-current]) {
  color: var(--bf-color-text-default);
  font-weight: 600;
}

:where(.bf-theme) :where(.bf-in-page-navigation-link.is-active, .bf-in-page-navigation-link[aria-current])::before {
  background: currentColor;
  block-size: 100%;
  content: "";
  inline-size: var(--bf-bar-thickness);
  inset-block: 0;
  inset-inline-start: calc(var(--bf-bar-thickness) * -1);
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
  border: 0 solid transparent;
  border-block-width: var(--bf-border-width);
  color: var(--bf-color-text-default);
  cursor: pointer;
  display: none;
  justify-content: center;
  margin: 0;
  padding-block-end: calc(var(--bf-interface-row-padding-block) + var(--bf-interface-row-compensation-block-end));
  padding-block-start: var(--bf-interface-row-padding-block);
  padding-inline: var(--bf-space-1);
}

:where(.bf-theme) :where(.bf-in-page-navigation-toggle:hover) {
  background: var(--bf-color-background-hover);
}

:where(.bf-theme) :where(.bf-in-page-navigation-toggle:focus:not(:focus-visible)) {
  outline: none;
}

:where(.bf-theme) :where(.bf-in-page-navigation-toggle:focus-visible) {
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: -0.125rem;
}

:where(.bf-theme) :where(.bf-in-page-navigation-toggle > .bf-icon) {
  --bf-icon-size: var(--bf-icon-size-default);
  margin-block-start: 0;
}

@container bf-in-page-navigation (width < 40rem) {
  :where(.bf-theme) :where(.bf-in-page-navigation-nav) {
    align-items: center;
    background: var(--bf-color-background-default);
    border-block-end: var(--bf-border-width) solid var(--bf-color-border-low-contrast);
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    row-gap: 0;
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
    gap: 0;
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
    border-block: var(--bf-border-width) solid transparent;
    display: block;
    overflow: hidden;
    padding-block-end: calc(var(--bf-interface-row-padding-block) + var(--bf-interface-row-compensation-block-end));
    padding-block-start: var(--bf-interface-row-padding-block);
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
    border-inline-start: var(--bf-bar-thickness) solid var(--bf-color-border-low-contrast);
    display: grid;
    gap: var(--bf-stack-space);
    grid-column: 1 / -1;
    grid-row: 2;
    /* The mobile nav owns a bottom rule; reserve its thickness within the
       list's trailing space so the expanded state keeps its baseline phase. */
    margin-block-end: calc(var(--bf-space-2) - var(--bf-border-width));
    overflow: visible;
    white-space: normal;
  }

  :where(.bf-theme) :where(.bf-in-page-navigation.is-expanded .bf-in-page-navigation-item, .bf-in-page-navigation:has(.bf-in-page-navigation-toggle[aria-expanded='true']) .bf-in-page-navigation-item) {
    display: grid;
    max-inline-size: none;
  }

  :where(.bf-theme) :where(.bf-in-page-navigation.is-expanded .bf-in-page-navigation-link, .bf-in-page-navigation:has(.bf-in-page-navigation-toggle[aria-expanded='true']) .bf-in-page-navigation-link) {
    display: -webkit-box;
    overflow-wrap: anywhere;
    padding-block: var(--bf-body-nudge-start) var(--bf-body-nudge-end);
    padding-inline: var(--bf-space-2) 0;
    white-space: normal;
  }

  :where(.bf-theme) :where(.bf-in-page-navigation.is-expanded .bf-in-page-navigation-list .bf-in-page-navigation-list, .bf-in-page-navigation:has(.bf-in-page-navigation-toggle[aria-expanded='true']) .bf-in-page-navigation-list .bf-in-page-navigation-list) {
    display: grid;
    gap: var(--bf-stack-space);
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
  --bf-top-navigation-reduced-row-block-size: var(--bf-interface-row-occupied-block-size);
}

:where(.bf-theme) :where(.bf-top-navigation.is-reduced) :where(.bf-top-navigation-logo-tag) {
  display: none;
}

:where(.bf-theme) :where(.bf-top-navigation.is-reduced) :where(.bf-top-navigation-row) {
  min-block-size: 0;
}

:where(.bf-theme) :where(.bf-top-navigation.is-reduced) :where(.bf-top-navigation-logo) > :where(.bf-top-navigation-link),
:where(.bf-theme) :where(.bf-top-navigation.is-reduced) :where(.bf-top-navigation-link, .bf-top-navigation-menu-toggle, .bf-top-navigation-search-toggle) {
  border: 0 solid transparent;
  border-block-width: var(--bf-border-width);
  color: var(--bf-color-text-muted);
  font-size: var(--bf-body-font-size);
  line-height: var(--bf-body-line-height);
  padding-block-end: calc(var(--bf-interface-row-padding-block) + var(--bf-interface-row-compensation-block-end));
  padding-block-start: var(--bf-interface-row-padding-block);
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
    top: var(--bf-top-navigation-reduced-row-block-size);
  }

  :where(.bf-theme) :where(.bf-top-navigation.is-reduced) :where(.bf-top-navigation-search) {
    background: var(--bf-color-background-alt);
    border: var(--bf-border-width) solid var(--bf-color-border-low-contrast);
    box-shadow: 0 calc(var(--bf-baseline) * 0.5) calc(var(--bf-baseline) * 2) rgba(0, 0, 0, 0.16);
    inset-block-start: 100%;
    inset-inline-end: 0;
    padding: var(--bf-panel-padding-block) var(--bf-top-navigation-link-padding-inline);
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
  --bf-table-of-contents-section-gap: var(--bf-section-space-shallow);
  align-content: start;
  container-name: bf-table-of-contents;
  container-type: inline-size;
  display: grid;
  gap: var(--bf-table-of-contents-section-gap);
  margin: 0;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-table-of-contents-section) {
  --bf-stack-space: 0rem;
  align-content: start;
  display: grid;
  gap: var(--bf-stack-space);
  margin: 0;
  min-inline-size: 0;
  padding: 0;
  position: relative;
}

:where(.bf-theme) :where(.bf-table-of-contents-section + .bf-table-of-contents-section)::before {
  background: var(--bf-color-border-low-contrast);
  block-size: var(--bf-border-width);
  content: "";
  inset-block-start: 0;
  inset-inline: 0;
  position: absolute;
}

:where(.bf-theme) :where(.bf-table-of-contents-heading) {
  color: var(--bf-color-text-default);
  margin: 0;
  padding-block-end: 0;
  padding-inline-start: var(--bf-component-inline-inset-continuation);
}

:where(.bf-theme) :where(.bf-table-of-contents-list) {
  --bf-stack-space: 0rem;
  align-content: start;
  display: grid;
  gap: var(--bf-stack-space);
  list-style: none;
  margin: 0;
  min-inline-size: 0;
  padding: 0;
}

:where(.bf-theme) :where(.bf-table-of-contents-item) {
  align-content: start;
  display: grid;
  gap: var(--bf-stack-space);
  margin: 0;
  min-inline-size: 0;
  padding: 0;
}

:where(.bf-theme) :where(a.bf-table-of-contents-link) {
${bodyTypeStyles}  border-block: var(--bf-border-width) solid transparent;
  color: var(--bf-color-link-default);
  display: block;
  margin: 0 0 var(--bf-interface-row-compensation-block-end);
  overflow-wrap: anywhere;
  padding-block: var(--bf-interface-row-padding-block);
  padding-inline-end: var(--bf-component-inline-inset-action);
  padding-inline-start: var(--bf-component-inline-inset-continuation);
  text-decoration: none;
}

:where(.bf-theme) :where(a.bf-table-of-contents-link:hover) {
  color: var(--bf-color-text-default);
  text-decoration: underline;
}

:where(.bf-theme) :where(.bf-table-of-contents-link:focus:not(:focus-visible)) {
  outline: none;
}

:where(.bf-theme) :where(.bf-table-of-contents-link:focus-visible) {
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: 0.125rem;
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
