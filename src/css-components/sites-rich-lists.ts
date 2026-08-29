/**
 * Vanilla Sites parity: rich horizontal and rich vertical lists.
 *
 * These contracts preserve the current macros' rendered compositions without
 * reproducing their Jinja slot API. The horizontal variant combines a title,
 * optional media/description/logos, a responsive ruled list and CTA. The
 * vertical variant is the selected media-object composition: structured BF
 * content paired with one responsive image or video slot.
 *
 * Vanilla → BF spacing mapping:
 * - horizontal item 8px/16px block padding → `space-1`/`space-2`;
 * - 16px grid gutters → `grid-gap-inline`;
 * - the 620px/1036px page breakpoints → 38.75rem/64.75rem container
 *   thresholds for descendants. Text roles keep their own metric-derived
 *   margins and baseline compensation in every tier. Parent stacks own every
 *   boundary outside the pattern.
 */
export function sitesRichListsCss(): string {
  return `/* ------------------------------------------------------------------ */
/* Sites rich lists — structural slots around existing BF primitives.   */
/* ------------------------------------------------------------------ */

:where(.bf-theme) :where(.bf-rich-list) {
  container-name: bf-rich-list;
  container-type: inline-size;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-rich-list-layout) {
  --bf-stack-space: var(--bf-space-1);
  align-content: start;
  display: grid;
  gap: var(--bf-stack-space);
  grid-template-columns: minmax(0, 1fr);
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-rich-list-rule) {
  grid-column: 1 / -1;
  order: -2;
}

:where(.bf-theme) :where(.bf-rich-list-header, .bf-rich-list-support, .bf-rich-list-content, .bf-rich-list-media, .bf-rich-list-list-slot, .bf-rich-list-cta) {
  min-inline-size: 0;
  overflow-wrap: anywhere;
}

:where(.bf-theme) :where(.bf-rich-list-support, .bf-rich-list-content) {
  --bf-stack-space: var(--bf-space-1);
  align-content: start;
  display: grid;
  gap: var(--bf-stack-space);
}

/* ------------------------------------------------------------------ */
/* Horizontal: the full composition remains stacked. The 50/50 variant */
/* places title and support in equal logical rails at the large split. */
/* ------------------------------------------------------------------ */

:where(.bf-theme) :where(.bf-rich-list.is-horizontal) > :where(.bf-rich-list-layout) > :where(.bf-rich-list-visual, .bf-rich-list-header, .bf-rich-list-support, .bf-rich-list-list-slot, .bf-rich-list-cta-rule) {
  grid-column: 1 / -1;
}

:where(.bf-theme) :where(.bf-rich-list-visual) {
  min-inline-size: 0;
  overflow: hidden;
}

:where(.bf-theme) :where(.bf-rich-list-visual > :where(img, picture, svg, video, canvas)) {
  block-size: auto;
  display: block;
  inline-size: 100%;
  max-inline-size: 100%;
}

/* A full-width ratio inside a fluid Sites rail otherwise leaves the next
   heading on a fractional pixel. The visual alone absorbs the trailing
   compensation; semantic children retain their own margins unchanged. */
@supports (block-size: calc-size(auto, round(up, size, 1px))) {
  :where(.bf-theme) :where(.bf-rich-list-visual > .bf-aspect) {
    block-size: calc-size(auto, round(up, size, var(--bf-baseline)));
  }
}

:where(.bf-theme) :where(.bf-rich-list-list-slot) {
  container-name: bf-rich-horizontal-items;
  container-type: inline-size;
}

:where(.bf-theme) :where(.bf-rich-list-list) {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  list-style: none;
  margin: 0;
  min-inline-size: 0;
  padding: 0;
}

/* Vanilla gives every horizontal-list row a continuous leading divider. */
:where(.bf-theme) :where(.bf-rich-list-list) > .bf-list-item {
  margin: 0;
  padding-block: var(--bf-space-1) var(--bf-space-2);
  position: relative;
}

:where(.bf-theme) :where(.bf-rich-list-list) > .bf-list-item::after {
  background: var(--bf-color-border-low-contrast);
  block-size: var(--bf-border-width);
  content: "";
  inset-block-start: 0;
  inset-inline-start: 0;
  inline-size: 100%;
  position: absolute;
}

/* Prefixes are logical here even though the shared list predates BF's
   logical-property rule. This keeps ticks, bullets and numbers RTL-safe. */
:where(.bf-theme) :where(.bf-rich-list-list) > .bf-list-item:is(.is-ticked, .is-crossed) {
  padding-inline-start: calc(var(--bf-leading-icon-size) + var(--bf-leading-icon-gap));
}

:where(.bf-theme) :where(.bf-rich-list-list) > .bf-list-item:is(.is-ticked, .is-crossed)::before {
  inset: auto;
  inset-inline-start: 0;
  inset-block-start: calc(var(--bf-body-nudge-start) + var(--bf-space-1));
}

:where(.bf-theme) :where(.bf-rich-list-list.is-bulleted) > :where(.bf-list-item) {
  padding-inline-start: calc(var(--bf-leading-icon-size) + var(--bf-leading-icon-gap));
}

:where(.bf-theme) :where(.bf-rich-list-list.is-bulleted) > :where(.bf-list-item)::before {
  color: var(--bf-color-text-default);
  content: "•";
  inline-size: var(--bf-leading-icon-size);
  inset-block-start: var(--bf-space-1);
  inset-inline-start: 0;
  position: absolute;
  text-align: center;
}

:where(.bf-theme) :where(ol.bf-rich-list-list) {
  counter-reset: bf-rich-horizontal-counter;
}

:where(.bf-theme) :where(ol.bf-rich-list-list) > :where(.bf-list-item) {
  counter-increment: bf-rich-horizontal-counter;
  padding-inline-start: calc(var(--bf-leading-icon-size) + var(--bf-leading-icon-gap));
}

:where(.bf-theme) :where(ol.bf-rich-list-list) > :where(.bf-list-item)::before {
  color: var(--bf-color-text-default);
  content: counter(bf-rich-horizontal-counter) ".";
  inline-size: var(--bf-leading-icon-size);
  inset-block-start: var(--bf-space-1);
  inset-inline-start: 0;
  position: absolute;
  text-align: end;
}

/* Vanilla's list measures are content-derived: one column below 66ch, two
   from 66ch, and four from 100ch. Pseudo-rules span the complete row. */
@container bf-rich-horizontal-items (width >= 66ch) {
  :where(.bf-theme) :where(.bf-rich-list-list) {
    column-gap: var(--bf-grid-gap-inline);
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  :where(.bf-theme) :where(.bf-rich-list-list) > .bf-list-item::after {
    content: none;
  }

  :where(.bf-theme) :where(.bf-rich-list-list) > .bf-list-item:nth-child(2n + 1)::after {
    content: "";
    inline-size: calc(200% + var(--bf-grid-gap-inline));
  }
}

@container bf-rich-horizontal-items (width >= 100ch) {
  :where(.bf-theme) :where(.bf-rich-list-list) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  :where(.bf-theme) :where(.bf-rich-list-list) > .bf-list-item::after,
  :where(.bf-theme) :where(.bf-rich-list-list) > .bf-list-item:nth-child(2n + 1)::after {
    content: none;
  }

  :where(.bf-theme) :where(.bf-rich-list-list) > .bf-list-item:nth-child(4n + 1)::after {
    content: "";
    inline-size: calc(400% + (var(--bf-grid-gap-inline) * 3));
  }
}

@container bf-rich-list (width >= 45rem) {
  :where(.bf-theme) :where(.bf-rich-list.is-horizontal.is-50-50) > :where(.bf-rich-list-layout) {
    column-gap: var(--bf-grid-gap-inline);
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  :where(.bf-theme) :where(.bf-rich-list.is-horizontal.is-50-50) > :where(.bf-rich-list-layout) > :where(.bf-rich-list-header) {
    grid-column: 1;
  }

  :where(.bf-theme) :where(.bf-rich-list.is-horizontal.is-50-50) > :where(.bf-rich-list-layout) > :where(.bf-rich-list-support) {
    grid-column: 2;
  }

  :where(.bf-theme) :where(.bf-rich-list.is-horizontal.is-50-50) > :where(.bf-rich-list-layout) > :where(.bf-rich-list-cta) {
    grid-column: 2;
  }
}

/* ------------------------------------------------------------------ */
/* Vertical: a rich media object, not a Jinja content-block adapter.    */
/* ------------------------------------------------------------------ */

:where(.bf-theme) :where(.bf-rich-list.is-vertical) > :where(.bf-rich-list-layout) > :where(.bf-rich-list-rule) {
  grid-column: 1 / -1;
}

:where(.bf-theme) :where(.bf-rich-list.is-vertical) :where(.bf-rich-list-media) {
  container-type: inline-size;
}

:where(.bf-theme) :where(.bf-rich-list.is-vertical.is-flipped) :where(.bf-rich-list-media) {
  order: -1;
}

:where(.bf-theme) :where(.bf-rich-list-media-frame) {
  aspect-ratio: 3 / 2;
  display: block;
  inline-size: 100%;
  max-inline-size: 100%;
  overflow: hidden;
  position: relative;
}

/* The media object deliberately stretches across fluid 1/2 and 2/3 ratios.
   Snap that resulting block, rather than resetting content spacing, so each
   tier's baseline survives both portrait and landscape allocations. */
@supports (block-size: calc-size(auto, round(up, size, 1px))) {
  :where(.bf-theme) :where(.bf-rich-list-media-frame) {
    block-size: calc-size(auto, round(up, size, var(--bf-baseline)));
  }
}

:where(.bf-theme) :where(.bf-rich-list-media.is-narrow-3-2) :where(.bf-rich-list-media-frame) {
  aspect-ratio: 3 / 2;
}

:where(.bf-theme) :where(.bf-rich-list-media.is-narrow-16-9) :where(.bf-rich-list-media-frame),
:where(.bf-theme) :where(.bf-rich-list-media.is-video) :where(.bf-rich-list-media-frame) {
  aspect-ratio: 16 / 9;
}

:where(.bf-theme) :where(.bf-rich-list-media.is-narrow-square) :where(.bf-rich-list-media-frame) {
  aspect-ratio: 1 / 1;
}

:where(.bf-theme) :where(.bf-rich-list-media > .bf-rich-list-media-frame > :where(img, picture, svg, video, canvas, iframe)) {
  block-size: 100%;
  border: 0;
  display: block;
  inline-size: 100%;
  max-inline-size: 100%;
  object-fit: cover;
}

:where(.bf-theme) :where(.bf-rich-list-media > .bf-rich-list-media-frame > :where(picture) > :where(img)) {
  block-size: 100%;
  display: block;
  inline-size: 100%;
  object-fit: cover;
}

:where(.bf-theme) :where(.bf-rich-list-media.is-contain > .bf-rich-list-media-frame > :where(img, svg, video, canvas)),
:where(.bf-theme) :where(.bf-rich-list-media.is-contain > .bf-rich-list-media-frame > :where(picture) > :where(img)) {
  object-fit: contain;
}

/* Auto height has no shallow media wrapper in Vanilla. At narrow widths it
   remains a normal 3:2 frame; at the wide split it stretches with the content
   rail, clamped between the equivalent 16:9 and 2:3 heights. */
@container bf-rich-list (width >= 45rem) {
  :where(.bf-theme) :where(.bf-rich-list.is-vertical) > :where(.bf-rich-list-layout) {
    align-items: stretch;
    column-gap: var(--bf-grid-gap-inline);
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  :where(.bf-theme) :where(.bf-rich-list.is-vertical) > :where(.bf-rich-list-layout) > :where(.bf-rich-list-content) {
    grid-column: 1;
    grid-row: 2;
  }

  :where(.bf-theme) :where(.bf-rich-list.is-vertical) > :where(.bf-rich-list-layout) > :where(.bf-rich-list-media) {
    grid-column: 2;
    grid-row: 2;
    order: 0;
  }

  :where(.bf-theme) :where(.bf-rich-list.is-vertical.is-flipped) > :where(.bf-rich-list-layout) > :where(.bf-rich-list-content) {
    grid-column: 2;
  }

  :where(.bf-theme) :where(.bf-rich-list.is-vertical.is-flipped) > :where(.bf-rich-list-layout) > :where(.bf-rich-list-media) {
    grid-column: 1;
  }

  :where(.bf-theme) :where(.bf-rich-list-media.is-wide-16-9) :where(.bf-rich-list-media-frame) {
    aspect-ratio: 16 / 9;
  }

  :where(.bf-theme) :where(.bf-rich-list-media.is-wide-3-2) :where(.bf-rich-list-media-frame) {
    aspect-ratio: 3 / 2;
  }

  :where(.bf-theme) :where(.bf-rich-list-media.is-wide-square) :where(.bf-rich-list-media-frame) {
    aspect-ratio: 1 / 1;
  }

  :where(.bf-theme) :where(.bf-rich-list-media.is-wide-2-3) :where(.bf-rich-list-media-frame) {
    aspect-ratio: 2 / 3;
  }

  :where(.bf-theme) :where(.bf-rich-list-media.is-auto-height) :where(.bf-rich-list-media-frame) {
    aspect-ratio: auto;
    block-size: 100%;
    max-block-size: 150cqi;
    min-block-size: 56.25cqi;
  }

  @supports (min-block-size: round(up, 1px, 1px)) {
    :where(.bf-theme) :where(.bf-rich-list-media.is-auto-height) :where(.bf-rich-list-media-frame) {
      max-block-size: round(down, 150cqi, var(--bf-baseline));
      min-block-size: round(up, 56.25cqi, var(--bf-baseline));
    }
  }

  /* Vanilla's auto-height image is absolutely positioned inside the clamped
     frame. Removing intrinsic media from track sizing lets the content rail
     determine the shared row before the 16:9/2:3 clamps are applied. */
  :where(.bf-theme) :where(.bf-rich-list-media.is-auto-height > .bf-rich-list-media-frame > :where(img, picture, svg, video, canvas, iframe)) {
    inset: 0;
    position: absolute;
  }
}
`;
}
