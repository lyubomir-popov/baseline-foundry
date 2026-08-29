/**
 * Vanilla Sites parity ports: hero and quote wrapper.
 *
 * These are structural compositions, rather than a compatibility rendition of
 * the Jinja macros. The named slots let a page assemble BF headings, prose,
 * CTA blocks, figures and chips without importing a parallel item schema.
 *
 * Vanilla → BF spacing mapping:
 * - Hero's `$spv--large` / `$spv--x-large` top boundary → `space-2` /
 *   `space-3`; the surrounding stack owns the section exit.
 * - The default 50/50 relationship remains viable from a measured 720px
 *   allocation; explicit 25/75 and 75/25 variants retain their own thresholds.
 * - Quote-wrapper's signpost/content and quote/citation relationships use
 *   the same 25/75 and 2/1 proportions. A quotation itself remains the
 *   existing semantic BF prose `blockquote`; it is not recreated as a
 *   heading-styled paragraph.
 */
export function sitesEditorialPortsCss(): string {
  return `/* ------------------------------------------------------------------ */
/* Sites editorial compositions — hero and quote wrapper.              */
/* Section boundaries and grid tracks are structural; nested stacks own */
/* semantic gaps and every text child keeps metric compensation.        */
/* ------------------------------------------------------------------ */

/* Hero: the compact arrival space belongs inside its entry rule. The outer
   stack owns the section exit, and the rule replaces one pixel of padding so
   it never changes the rhythm. */
:where(.bf-theme) :where(.bf-hero) {
  border-block-start: var(--bf-border-width) solid var(--bf-color-border-low-contrast);
  container-name: bf-hero;
  container-type: inline-size;
  min-inline-size: 0;
  padding-block-end: 0;
  padding-block-start: calc(var(--bf-space-2) - var(--bf-border-width));
}

/* The hero owns its entry rule so consumers do not need a loose sibling.
   The established borderless modifier removes only that visual boundary. */
:where(.bf-theme) :where(.bf-hero.is-borderless) {
  border-block-start: 0;
  padding-block-start: var(--bf-space-2);
}

:where(.bf-theme) :where(.bf-hero-layout) {
  display: grid;
  gap: var(--bf-section-space-shallow);
  grid-template-columns: minmax(0, 1fr);
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-hero-copy, .bf-hero-title, .bf-hero-content, .bf-hero-media, .bf-hero-signpost, .bf-hero-intro, .bf-hero-lead) {
  min-inline-size: 0;
  overflow-wrap: anywhere;
}

/* Legacy copy slots remain valid for signpost variants. The default arrival
   composition separates a title area from its supporting content area, and
   the demo composes each area with the public stack density modifiers. */
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

/* A closing visual remains inside the hero after its lead. The hero's stack
   owns their shallow internal separation. */
:where(.bf-theme) :where(.bf-hero) > :where(.bf-hero-media.is-full:last-child) {
  inline-size: 100%;
}

/* The section boundary follows the page-level desktop switch, while the
   two-column composition uses its measured intrinsic allocation below. */
@media (width >= 64.75rem) {
  :where(.bf-theme) :where(.bf-hero) {
    padding-block-start: calc(var(--bf-space-3) - var(--bf-border-width));
  }

  :where(.bf-theme) :where(.bf-hero.is-borderless) {
    padding-block-start: var(--bf-space-3);
  }
}

@container bf-hero (width >= 45rem) {
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

/* The named variants retain their proportion but share the readable split
   threshold with the default hero. The modifier changes only structural
   tracks; it does not introduce an earlier cramped layout. */
@container bf-hero (width >= 45rem) {
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
  margin: 0;
  min-inline-size: 0;
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
   entirely baseline-compensated while its stack owns semantic gaps. */
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
  :where(.bf-theme) :where(.bf-quote-wrapper-header) {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }

  :where(.bf-theme) :where(.bf-quote-wrapper-header) > :first-child {
    grid-column: 1 / span 6;
  }

  :where(.bf-theme) :where(.bf-quote-wrapper-header-link) {
    grid-column: 7 / -1;
  }

  :where(.bf-theme) :where(.bf-quote-wrapper-layout) {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }

  :where(.bf-theme) :where(.bf-quote-wrapper-signpost) {
    grid-column: 1 / span 2;
  }

  :where(.bf-theme) :where(.bf-quote-wrapper-content, .bf-quote-wrapper-content:only-child) {
    display: grid;
    grid-column: 3 / -1;
    grid-template-columns: subgrid;
  }

  :where(.bf-theme) :where(.bf-quote-wrapper-quote-row) {
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
  }

  :where(.bf-theme) :where(.bf-quote-wrapper-prose) {
    grid-column: 1 / span 4;
  }

  :where(.bf-theme) :where(.bf-quote-wrapper-citation) {
    grid-column: 5 / -1;
  }

  :where(.bf-theme) :where(.bf-quote-wrapper-content) > :where(.bf-cta-block, .bf-quote-wrapper-media) {
    grid-column: 1 / -1;
  }
}
`;
}
