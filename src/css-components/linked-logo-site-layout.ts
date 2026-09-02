/**
 * Vanilla Sites parity: linked-logo section and the sticky-footer layout.
 *
 * The Sites macro places its heading and linked-logo block at full width,
 * 50/50, or 25/75.  BF keeps that relationship as a small structural grid:
 * 1/1 and 1/3 are proportions rather than a recreation of Vanilla grid-span
 * utilities.  The cards deliberately compose the existing `bf-logo-section`
 * link/mark contract; the additional card slots are semantic link content,
 * not the deprecated `logo-block` API.
 *
 * Vanilla → BF mapping (Vanilla's 0.5rem spacing unit):
 * - linked-logo image container: retained 16:9 aspect relationship;
 * - muted rule to copy: 0.5rem → `--bf-space-1`, compensating its border;
 * - grid gutter: 1.5rem / 2rem breakpoint values → existing
 *   `--bf-grid-gap-inline` (BF's tier-aware grid geometry);
 * - macro section boundaries: existing shallow/default/deep section tokens.
 *
 * The site layout is intentionally opt-in on `bf-page-shell`: it never
 * changes the document body merely because a tier stylesheet is imported.
 */
export function linkedLogoSiteLayoutCss(): string {
  return `/* ------------------------------------------------------------------ */
/* Linked logo section — Sites composition of BF logo and content slots. */
/* ------------------------------------------------------------------ */

:where(.bf-theme) :where(.bf-linked-logo-section) {
  container-name: bf-linked-logo-section;
  container-type: inline-size;
  margin: 0;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-linked-logo-section-layout) {
  display: grid;
  gap: var(--bf-section-space-shallow);
  grid-template-columns: minmax(0, 1fr);
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-linked-logo-section-header, .bf-linked-logo-section-content) {
  min-inline-size: 0;
  overflow-wrap: anywhere;
}

/* The card list is a contextual use of bf-logo-section. Its links and marks
   preserve that component's focus and accessible-image treatment, while a
   grid gives the Sites pattern its 16:9 linked destinations. */
:where(.bf-theme) :where(.bf-linked-logo-section) :where(.bf-logo-section.bf-linked-logo-section-logos) {
  margin-block-end: 0;
}

:where(.bf-theme) :where(.bf-linked-logo-section-logos) :where(.bf-logo-section-items) {
  align-items: stretch;
  column-gap: var(--bf-grid-gap-inline);
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  padding-block: 0;
  row-gap: var(--bf-section-space-shallow);
}

:where(.bf-theme) :where(.bf-linked-logo-section-logos) :where(.bf-logo-section-item) {
  block-size: auto;
  inline-size: auto;
  margin-block: 0;
  max-inline-size: none;
}

:where(.bf-theme) :where(a.bf-linked-logo-section-card) {
  align-content: start;
  align-items: stretch;
  color: inherit;
  container-type: inline-size;
  display: grid;
  grid-template-rows: auto auto auto;
  inline-size: 100%;
  min-inline-size: 0;
  text-decoration: none;
}

:where(.bf-theme) :where(a.bf-linked-logo-section-card:hover) :where(.bf-linked-logo-section-card-copy) {
  text-decoration: underline;
}

:where(.bf-theme) :where(.bf-linked-logo-section-mark) {
  aspect-ratio: 16 / 9;
  background: var(--bf-color-background-active);
  display: grid;
  inline-size: 100%;
  max-inline-size: 100%;
  min-inline-size: 0;
  overflow: hidden;
  place-items: center;
}

/* Card tracks are fluid, so an exact 16:9 mark is often a fractional number
   of baselines tall. Keep the visual ratio exact and put only the residual
   rhythm compensation after the mark; the copy keeps its own semantic
   spacing and the occupied card still lands on the tier grid. */
@supports (margin-block-end: round(up, 0.0625rem, 0.0625rem)) {
  :where(.bf-theme) :where(.bf-linked-logo-section-mark) {
    margin-block-end: calc(
      round(up, calc(100cqi * 9 / 16), var(--bf-baseline))
      - calc(100cqi * 9 / 16)
    );
  }
}

:where(.bf-theme) :where(.bf-linked-logo-section-mark) > :where(img, svg) {
  block-size: 100%;
  display: block;
  inline-size: 100%;
  max-inline-size: 100%;
  min-inline-size: 0;
  object-fit: contain;
}

:where(.bf-theme) :where(.bf-linked-logo-section-card-rule) {
  border-block-start: var(--bf-border-width) solid var(--bf-color-border-low-contrast);
  display: block;
  margin-block-start: var(--bf-space-1);
}

/* A span inherits the real body role from the page; it owns only the
   relationship to its preceding divider, not an alternative type scale. */
:where(.bf-theme) :where(.bf-linked-logo-section-card-copy) {
  display: block;
  margin-block-start: calc(var(--bf-space-1) - var(--bf-border-width));
  overflow-wrap: anywhere;
}

/* The linked-logo block moves from one to two cards per row at the 4-column
   medium grid. The balanced 50/50 section split uses the shared readable
   threshold; the 25/75 content rail and four-card density retain their
   separately measured wide threshold. The root establishes the query context;
   only descendants change. */
@container bf-linked-logo-section (width >= 38.75rem) {
  :where(.bf-theme) :where(.bf-linked-logo-section-logos) :where(.bf-logo-section-items) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@container bf-linked-logo-section (width >= 45rem) {
  :where(.bf-theme) :where(.bf-linked-logo-section.is-50-50) :where(.bf-linked-logo-section-layout) {
    column-gap: var(--bf-grid-gap-inline);
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@container bf-linked-logo-section (width >= 64.75rem) {

  :where(.bf-theme) :where(.bf-linked-logo-section.is-25-75) :where(.bf-linked-logo-section-layout) {
    column-gap: var(--bf-grid-gap-inline);
    grid-template-columns: minmax(0, 1fr) minmax(0, 3fr);
  }

  :where(.bf-theme) :where(.bf-linked-logo-section.is-full) :where(.bf-linked-logo-section-logos) :where(.bf-logo-section-items) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  :where(.bf-theme) :where(.bf-linked-logo-section.is-50-50) :where(.bf-linked-logo-section-logos) :where(.bf-logo-section-items) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  :where(.bf-theme) :where(.bf-linked-logo-section.is-25-75) :where(.bf-linked-logo-section-logos) :where(.bf-logo-section-items) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* ------------------------------------------------------------------ */
/* Site / sticky-footer layout.                                        */
/* ------------------------------------------------------------------ */

/* The sticky-footer contract is explicitly opt-in, so it remains useful at
   every viewport width.  The descendant selector intentionally retains the
   shell classes' specificity: a shell may also be a bf-panel-content region,
   whose later min-block-size reset must not disable the site layout. */
:where(.bf-theme.bf-page-shell.is-site-layout),
:where(.bf-theme) .bf-page-shell.is-site-layout {
  display: flex;
  flex-direction: column;
  min-block-size: 100dvb;
}

:where(.bf-theme.bf-page-shell.is-site-layout) > :where(.bf-site-main),
:where(.bf-theme) .bf-page-shell.is-site-layout > :where(.bf-site-main) {
  flex: 0 0 auto;
  min-inline-size: 0;
}

/* When a site main also consumes panel padding, pull its first text line up
   one baseline so it shares the tagged navigation brand's optical top. */
:where(.bf-theme.bf-page-shell.is-site-layout) > :where(.bf-site-main.bf-panel-content),
:where(.bf-theme) .bf-page-shell.is-site-layout > :where(.bf-site-main.bf-panel-content) {
  padding-block-start: calc(var(--bf-panel-padding-block) - var(--bf-baseline));
}

/* An application main already represents the available viewport remainder
   and owns scrolling. A directly nested site shell fills that region instead
   of claiming a second dynamic viewport; long content can still grow the
   shell beyond the region and remains reachable through bf-main. */
:where(.bf-theme.bf-application) > :where(.bf-main) > .bf-page-shell.is-site-layout,
:where(.bf-theme) :where(.bf-application) > :where(.bf-main) > .bf-page-shell.is-site-layout {
  min-block-size: 100%;
}

:where(.bf-theme.bf-page-shell.is-site-layout) > :where(.bf-site-footer.is-sticky),
:where(.bf-theme) .bf-page-shell.is-site-layout > :where(.bf-site-footer.is-sticky) {
  margin-block-start: auto;
}
`;
}
