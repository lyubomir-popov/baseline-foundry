/**
 * Vanilla Sites parity ports: hero and quote wrapper.
 *
 * These are structural compositions, rather than a compatibility rendition of
 * the Jinja macros. The named slots let a page assemble BF headings, prose,
 * CTA blocks, figures and chips without importing a parallel item schema.
 *
 * Vanilla → BF spacing mapping:
 * - Hero's `$spv--large` / `$spv--x-large` top boundary → `space-2` /
 *   `space-3`; `$spv--strip-regular / 2` / full strip bottom boundary →
 *   half `section-space` / full `section-space`.
 * - The 50/50, 25/75 and 75/25 grid relationships use BF's intrinsic grid
 *   and gutter token at Vanilla's 620px / 1036px composition thresholds.
 * - Quote-wrapper's signpost/content and quote/citation relationships use
 *   the same 25/75 and 2/1 proportions. A quotation itself remains the
 *   existing semantic BF prose `blockquote`; it is not recreated as a
 *   heading-styled paragraph.
 */
export function sitesEditorialPortsCss(): string {
  return `/* ------------------------------------------------------------------ */
/* Sites editorial compositions — hero and quote wrapper.              */
/* Section boundaries and grid tracks are structural; every text child  */
/* keeps its own type-role rhythm.                                      */
/* ------------------------------------------------------------------ */

/* Hero: its deliberately asymmetric boundary mirrors the current Vanilla
   section--hero: a compact arrival space, then the normal section exit. */
:where(.bf-theme) :where(.bf-hero) {
  container-name: bf-hero;
  container-type: inline-size;
  min-inline-size: 0;
  padding-block-end: calc(var(--bf-section-space) / 2);
  padding-block-start: var(--bf-space-2);
}

:where(.bf-theme) :where(.bf-hero-layout) {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-hero-copy, .bf-hero-title, .bf-hero-content, .bf-hero-media, .bf-hero-signpost, .bf-hero-intro, .bf-hero-lead) {
  min-inline-size: 0;
  overflow-wrap: anywhere;
}

/* The normal hero keeps title, supporting heading, chip, prose and CTA in a
   semantic copy slot. Their zero-gap flow deliberately leaves role margins
   intact. Hero titles are h1 slots and supporting titles are h2 slots. */
:where(.bf-theme) :where(.bf-hero-copy) {
  align-content: start;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
}

:where(.bf-theme) :where(.bf-hero-chip) {
  margin-block: 0 var(--bf-body-margin-bottom);
}

/* Current Vanilla scopes a one-spacing-unit icon/value gap to the hero. */
:where(.bf-theme) :where(.bf-hero-chip.bf-chip) {
  column-gap: var(--bf-space-1);
}

:where(.bf-theme) :where(.bf-hero-media > :where(img, picture, video, canvas, svg), .bf-hero-signpost > :where(img, picture, video, canvas, svg)) {
  block-size: auto;
  display: block;
  inline-size: 100%;
  max-inline-size: 100%;
}

/* Intrinsic media ratios commonly resolve to fractional pixels once a hero is
   allocated a fluid grid track. Snap only the media block to the active tier
   baseline so the following semantic text remains on-grid; its inline track
   and the surrounding Vanilla proportions remain unchanged. */
@supports (block-size: calc-size(auto, round(up, size, 1px))) {
  :where(.bf-theme) :where(.bf-hero-media > .bf-aspect, .bf-hero-signpost > :where(img, picture, video, canvas, svg)) {
    block-size: calc-size(auto, round(up, size, var(--bf-baseline)));
  }
}

/* A signpost is a compact associated mark, not a decorative background. */
:where(.bf-theme) :where(.bf-hero-signpost) {
  align-self: start;
  max-inline-size: var(--bf-measure);
}

/* Full-width media follows the paired title/content tracks. */
:where(.bf-theme) :where(.bf-hero-media.is-full) {
  grid-column: 1 / -1;
}

/* A closing visual remains inside the hero, after a lead that composes the
   public bf-section is-shallow boundary. The hero is an explicit pattern
   boundary, so it trims only its final figure's semantic margin; the root's
   existing padding remains the sole exit boundary after the media. */
:where(.bf-theme) :where(.bf-hero) > :where(.bf-hero-media.is-full:last-child) {
  inline-size: 100%;
  margin-block-end: 0;
}

/* Vanilla's desktop hero boundary is 1036px. The layout descendant responds
   to the root container so embedding it in a narrower rail still collapses
   correctly. */
/* The section boundary itself follows Vanilla's page-level desktop switch;
   the composition below continues to react to the allocated container. */
@media (width >= 64.75rem) {
  :where(.bf-theme) :where(.bf-hero) {
    padding-block-end: var(--bf-section-space);
    padding-block-start: var(--bf-space-3);
  }
}

@container bf-hero (width >= 64.75rem) {
  :where(.bf-theme) :where(.bf-hero-layout) {
    column-gap: var(--bf-grid-gap-inline);
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  :where(.bf-theme) :where(.bf-hero.is-25-75) :where(.bf-hero-layout) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 3fr);
  }

  :where(.bf-theme) :where(.bf-hero.is-75-25) :where(.bf-hero-layout) {
    grid-template-columns: minmax(0, 3fr) minmax(0, 1fr);
  }

  /* A fallback puts its introduction above the text/media pair. */
  :where(.bf-theme) :where(.bf-hero.is-fallback) :where(.bf-hero-intro) {
    max-inline-size: calc((100cqi - var(--bf-grid-gap-inline)) / 2);
  }
}

/* Vanilla can intentionally split the three proportioned layouts at its
   medium threshold. The modifier changes only structural tracks. */
@container bf-hero (width >= 38.75rem) {
  :where(.bf-theme) :where(.bf-hero.is-split-medium) :where(.bf-hero-layout) {
    column-gap: var(--bf-grid-gap-inline);
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  :where(.bf-theme) :where(.bf-hero.is-split-medium.is-25-75) :where(.bf-hero-layout) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 3fr);
  }

  :where(.bf-theme) :where(.bf-hero.is-split-medium.is-75-25) :where(.bf-hero-layout) {
    grid-template-columns: minmax(0, 3fr) minmax(0, 1fr);
  }
}

/* Quote wrapper: a heading may introduce a series of quotes. When it does,
   its top rule belongs to the wrapper boundary, not to the quote itself. */
:where(.bf-theme) :where(.bf-quote-wrapper) {
  container-name: bf-quote-wrapper;
  container-type: inline-size;
  margin-block-end: var(--bf-section-space);
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-quote-wrapper.is-shallow) {
  margin-block-end: var(--bf-section-space-shallow);
}

:where(.bf-theme) :where(.bf-quote-wrapper-header, .bf-quote-wrapper-layout, .bf-quote-wrapper-signpost, .bf-quote-wrapper-content, .bf-quote-wrapper-citation, .bf-quote-wrapper-media) {
  min-inline-size: 0;
  overflow-wrap: anywhere;
}

:where(.bf-theme) :where(.bf-quote-wrapper-header) {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
}

:where(.bf-theme) :where(.bf-quote-wrapper-layout) {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
}

/* This class is a composition rail around the built-in prose blockquote, not
   a second quotation type scale. The source may still contain rich semantic
   inline markup and retains BF's metric compensation. */
:where(.bf-theme) :where(.bf-quote-wrapper-prose) {
  inline-size: min(100%, var(--bf-measure));
}

:where(.bf-theme) :where(.bf-quote-wrapper-citation) {
  color: var(--bf-color-text-muted);
}

:where(.bf-theme) :where(.bf-quote-wrapper-citation-name) {
  color: var(--bf-color-text-default);
  font-weight: var(--bf-h6-font-weight);
}

:where(.bf-theme) :where(.bf-quote-wrapper-signpost) {
  align-self: start;
  max-inline-size: 100%;
}

:where(.bf-theme) :where(.bf-quote-wrapper-signpost > :where(img, picture, svg)) {
  block-size: auto;
  display: block;
  inline-size: auto;
  max-inline-size: 100%;
}

/* The quote rail can also be a fractional grid track. Keep its media from
   introducing a sub-baseline row while leaving quotation and citation rhythm
   entirely element-owned. */
@supports (block-size: calc-size(auto, round(up, size, 1px))) {
  :where(.bf-theme) :where(.bf-quote-wrapper-signpost > :where(img, picture, svg), .bf-quote-wrapper-media > .bf-aspect) {
    block-size: calc-size(auto, round(up, size, var(--bf-baseline)));
  }
}

:where(.bf-theme) :where(.bf-quote-wrapper-quote-row) {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-inline-size: 0;
}

@container bf-quote-wrapper (width >= 38.75rem) {
  :where(.bf-theme) :where(.bf-quote-wrapper-header) {
    column-gap: var(--bf-grid-gap-inline);
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  :where(.bf-theme) :where(.bf-quote-wrapper-header-link) {
    grid-column: 4;
  }

  :where(.bf-theme) :where(.bf-quote-wrapper-layout) {
    column-gap: var(--bf-grid-gap-inline);
    grid-template-columns: minmax(0, 1fr) minmax(0, 3fr);
  }

  /* Vanilla offsets a quote block without a signpost into the content rail. */
  :where(.bf-theme) :where(.bf-quote-wrapper-content:only-child) {
    grid-column: 2;
  }

  :where(.bf-theme) :where(.bf-quote-wrapper-quote-row) {
    column-gap: var(--bf-grid-gap-inline);
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@container bf-quote-wrapper (width >= 64.75rem) {
  :where(.bf-theme) :where(.bf-quote-wrapper-quote-row) {
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  }
}
`;
}
