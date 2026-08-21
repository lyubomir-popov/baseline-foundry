/**
 * Navigation and page composition contracts that compose existing navigation
 * primitives without changing their interaction ownership.
 */
export function navigationLayoutCss(): string {
  return `/* ------------------------------------------------------------------ */
/* Navigation layout and page shell                                    */
/* ------------------------------------------------------------------ */

/* The row is only a layout owner. Interactive children own the occupied
 * block; row padding would leave an unpainted strip below their highlights. */
:where(.bf-theme) :where(.bf-top-navigation-row) {
  padding-block: 0;
}

/* The tagged treatment is opt-in. The Circle of Friends is aligned to the
 * first title line, then the 38px tag extends upward to the navigation edge.
 * Its 22px inline size preserves the established 38:22 (~1.73) tag ratio; the
 * tag must not stretch to the full occupied navigation row. */
:where(.bf-theme) :where(.bf-top-navigation-logo.is-canonical-tagged) {
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-top-navigation-logo.is-canonical-tagged) > :where(.bf-top-navigation-link) {
  align-items: start;
  column-gap: 0;
  display: inline-flex;
  inline-size: 100%;
  justify-content: flex-start;
  padding-block: 0;
  padding-inline: 0;
  padding-inline-start: calc(var(--bf-top-navigation-logo-tag-inline-size) + var(--bf-top-navigation-logo-tag-gap));
  position: relative;
}

:where(.bf-theme) :where(.bf-top-navigation-logo.is-canonical-tagged) :where(.bf-top-navigation-logo-tag) {
  align-items: flex-end;
  background: var(--bf-color-brand);
  block-size: var(--bf-top-navigation-logo-tag-block-size);
  box-sizing: border-box;
  display: flex;
  inline-size: var(--bf-top-navigation-logo-tag-inline-size);
  inset-block-start: 0;
  inset-inline-start: 0;
  justify-content: center;
  padding-block: 0 var(--bf-top-navigation-logo-icon-bottom-offset);
  padding-inline: 0;
  position: absolute;
}

:where(.bf-theme) :where(.bf-top-navigation-logo.is-canonical-tagged) ~ :where(.bf-top-navigation-list.is-banner-actions) :where(.bf-top-navigation-menu-toggle, .bf-top-navigation-search-toggle),
:where(.bf-theme) :where(.bf-top-navigation.is-grid-aligned) :where(.bf-top-navigation-nav) :where(.bf-top-navigation-link, .bf-top-navigation-search-toggle) {
  block-size: 100%;
}

:where(.bf-theme) :where(.bf-top-navigation-logo.is-canonical-tagged) :where(.bf-top-navigation-logo-icon) {
  block-size: var(--bf-top-navigation-logo-icon-size);
  display: block;
  flex: 0 0 auto;
  inline-size: var(--bf-top-navigation-logo-icon-size);
  transform: translateX(var(--bf-top-navigation-logo-icon-optical-offset-inline));
}

:where(.bf-theme) :where(.bf-top-navigation-logo.is-canonical-tagged) :where(.bf-top-navigation-logo-title) {
  align-self: start;
  color: var(--bf-color-text-default);
  font-size: var(--bf-top-navigation-logo-title-font-size, var(--bf-body-font-size, 1rem));
  font-weight: 300;
  line-height: var(--bf-top-navigation-logo-title-line-height, var(--bf-body-line-height, 1.5));
  overflow: visible;
  overflow-wrap: anywhere;
  /* The first title line and the 16px mark share the mark's fixed centre:
   * tag block-end minus the 6px inset minus half the mark. Symmetric title
   * padding keeps the occupied row stable across all four type-density tiers. */
  padding-block: calc(
    var(--bf-top-navigation-logo-tag-block-size)
    - var(--bf-top-navigation-logo-icon-bottom-offset)
    - (var(--bf-top-navigation-logo-icon-size) / 2)
    - (var(--bf-top-navigation-logo-title-line-height, var(--bf-body-line-height, 1.5rem)) / 2)
  );
  text-overflow: clip;
  white-space: normal;
}

/* A grid-aligned header uses the same eight tracks and gutter as page content.
 * The brand/banner owns columns one and two; primary navigation starts at
 * column three. No independent brand-width token can drift from that grid. */
:where(.bf-theme) :where(.bf-top-navigation.is-grid-aligned) {
  container-type: inline-size;
}

@media (min-width: 64.75rem) {
  :where(.bf-theme) :where(.bf-top-navigation.is-grid-aligned) :where(.bf-top-navigation-row) {
    column-gap: var(--bf-grid-gap-inline);
    display: grid;
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }

  :where(.bf-theme) :where(.bf-top-navigation.is-grid-aligned) :where(.bf-top-navigation-banner) {
    grid-column: 1 / span 2;
    min-inline-size: 0;
  }

  :where(.bf-theme) :where(.bf-top-navigation.is-grid-aligned) :where(.bf-top-navigation-nav) {
    grid-column: 3 / -1;
    min-inline-size: 0;
  }

  :where(.bf-theme) :where(.bf-top-navigation.is-grid-aligned) :where(.bf-top-navigation-dropdown) {
    top: 100%;
  }
}

/* Documentation composition stays single-column until its own container can
 * support the intentional 2/6 navigation/content split. The optional
 * navigation slot never creates a mobile rail. */
:where(.bf-theme) :where(.bf-docs-layout) {
  align-items: start;
  column-gap: var(--bf-grid-gap-inline);
  container-type: inline-size;
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-docs-layout-navigation, .bf-docs-layout-content) {
  grid-column: 1 / -1;
  min-inline-size: 0;
}

@media (min-width: 64.75rem) {
  @container (width >= 38.75rem) {
    :where(.bf-theme) :where(.bf-docs-layout:has(> .bf-docs-layout-navigation)) > :where(.bf-docs-layout-navigation) {
      grid-column: span 2;
    }

    :where(.bf-theme) :where(.bf-docs-layout:has(> .bf-docs-layout-navigation)) > :where(.bf-docs-layout-content) {
      grid-column: span 6;
    }
  }
}

/* This is deliberately scoped to an explicit page shell. Importing a BF tier
 * alone never changes the consuming document body's user-agent margin. */
:where(body.bf-theme.bf-page-shell) {
  background: var(--bf-color-background-default);
  margin: 0;
  min-block-size: 100dvb;
}
`;
}
