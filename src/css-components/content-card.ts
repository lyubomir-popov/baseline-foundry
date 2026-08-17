/**
 * Rich content-card parity with current Vanilla. This intentionally remains a
 * separate family from the general-purpose `bf-card` primitive.
 *
 * Vanilla -> BF rhythm mapping (Vanilla's spacing unit is 0.5rem):
 * - 16px content padding/gap -> `--bf-space-2`.
 * - 8px footer/image spacing -> `--bf-space-1`.
 * - 32px wrapper separation -> `--bf-space-4`.
 * - 380px vertical minimum -> 48 BF baselines (384px in editorial), avoiding
 *   Vanilla's half-baseline ending while retaining its occupied silhouette.
 * - 192px horizontal/text minimum -> 24 BF baselines.
 * - 352px eight-column minimum -> 44 BF baselines.
 * - 284px horizontal media width -> 36 BF baselines (288px in editorial).
 *
 * The root card establishes a named query container. Only descendants change
 * inside container queries; this avoids the invalid query-the-container-itself
 * pattern. Global media queries are retained only where Vanilla's behaviour is
 * genuinely viewport/input based (grid span, hover reveal and line clamping).
 *
 * The expanded click target is a pseudo-element of the one real main link,
 * rather than a duplicate aria-hidden overlay anchor. Nested controls are
 * raised above it, so every distinct action stays pointer- and keyboard-
 * reachable.
 */
export function contentCardCss(): string {
  return `/* ------------------------------------------------------------------ */
/* Content card — rich Vanilla parity, distinct from the bf-card primitive. */
/* ------------------------------------------------------------------ */

:where(.bf-theme) :where(.bf-content-card-wrapper) {
  block-size: auto;
  display: flex;
  flex-direction: column;
  grid-column: 1 / -1;
  inline-size: 100%;
  min-inline-size: 0;
  padding-block-end: var(--bf-space-4);
}

/* Snap the grid-row wrapper after intrinsic image/copy measurement. Because
   the card flexes inside it, peers retain Vanilla's equal-height row while
   the card edge and the following row both land on BF baselines. */
@supports (block-size: calc-size(auto, round(up, size, 1px))) {
  :where(.bf-theme) :where(.bf-content-card-wrapper) {
    block-size: calc-size(auto, round(up, size, var(--bf-baseline)));
  }
}

/* Vanilla's column names describe its eight-column grid. BF doubles the span
   when its own large-screen grid becomes sixteen columns. */
@media (width >= 38.75rem) {
  :where(.bf-theme) :where(.bf-content-card-wrapper.is-cols-2) {
    grid-column: auto / span 2;
  }
}

@media (width >= 64.75rem) {
  :where(.bf-theme) :where(.bf-content-card-wrapper.is-cols-4) {
    grid-column: auto / span 4;
  }

  :where(.bf-theme) :where(.bf-content-card-wrapper.is-cols-6) {
    grid-column: auto / span 6;
  }
}

@media (width >= 105.0625rem) {
  :where(.bf-theme) :where(.bf-content-card-wrapper.is-cols-2) {
    grid-column: auto / span 4;
  }

  :where(.bf-theme) :where(.bf-content-card-wrapper.is-cols-4) {
    grid-column: auto / span 8;
  }

  :where(.bf-theme) :where(.bf-content-card-wrapper.is-cols-6) {
    grid-column: auto / span 12;
  }
}

:where(.bf-theme) :where(.bf-content-card) {
  background: var(--bf-color-background-default);
  border: var(--bf-border-width) solid var(--bf-color-border-low-contrast);
  box-sizing: border-box;
  color: var(--bf-color-text-default);
  container-name: bf-content-card;
  container-type: inline-size;
  flex: 1;
  inline-size: 100%;
  max-inline-size: 100%;
  min-inline-size: 0;
  overflow: hidden;
  position: relative;
  transition: border-color 400ms ease-in-out;
}

:where(.bf-theme) :where(.bf-content-card:hover, .bf-content-card:focus-within) {
  border-color: var(--bf-color-border-high-contrast);
}

:where(.bf-theme) :where(.bf-content-card-frame) {
  align-items: stretch;
  display: flex;
  flex-direction: column;
  inline-size: 100%;
  min-block-size: calc(var(--bf-space-12) - (var(--bf-border-width) * 2));
  min-inline-size: 0;
  padding-block-start: var(--bf-space-2);
}

:where(.bf-theme) :where(.bf-content-card.is-image) :where(.bf-content-card-frame) {
  min-block-size: calc((var(--bf-space-12) * 4) - (var(--bf-border-width) * 2));
  padding-block-start: 0;
}

:where(.bf-theme) :where(.bf-content-card:not(.is-image)) :where(.bf-content-card-frame) {
  min-block-size: calc((var(--bf-space-12) * 2) - (var(--bf-border-width) * 2));
}

:where(.bf-theme) :where(.bf-content-card-media) {
  align-items: flex-start;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  inline-size: 100%;
  max-inline-size: 100%;
  min-inline-size: 0;
  padding-block-end: var(--bf-space-2);
}

:where(.bf-theme) :where(.bf-content-card-image) {
  aspect-ratio: 16 / 9;
  block-size: auto;
  /* Preserve 16:9 within half a baseline while keeping the occupied media
     block on BF's grid at arbitrary card widths. */
  block-size: round(up, calc(100cqi * 9 / 16), var(--bf-baseline));
  display: block;
  flex: 0 0 auto;
  inline-size: 100%;
  margin: 0;
  max-inline-size: 100%;
  object-fit: cover;
}

:where(.bf-theme) :where(.bf-content-card-content) {
  display: flex;
  flex: 1;
  flex-direction: column;
  inline-size: 100%;
  justify-content: space-between;
  min-block-size: 0;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-content-card-body) {
  align-items: flex-start;
  align-self: stretch;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
  min-inline-size: 0;
  overflow: hidden;
  padding-inline: var(--bf-space-2);
}

:where(.bf-theme) :where(.bf-content-card-primary, .bf-content-card-description-panel) {
  display: flex;
  flex-direction: column;
  grid-area: 1 / 1;
  inline-size: 100%;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-content-card-primary) {
  opacity: 1;
  transition: opacity 400ms ease-in-out;
}

:where(.bf-theme) :where(.bf-content-card-description-panel) {
  opacity: 0;
  transform: translateY(calc(var(--bf-space-12) + var(--bf-space-6)));
  transition: opacity 400ms ease-in-out, transform 400ms ease-in-out;
}

/* A content-card title is a real heading slot. It uses BF's h4 role in the
   2/4/6-column variants and the h1 role in the eight-column feature. */
:where(.bf-theme) :where(.bf-content-card-title) {
  color: var(--bf-color-text-default);
  font-family: var(--bf-h4-font-family);
  font-size: var(--bf-h4-font-size);
  font-style: var(--bf-h4-font-style);
  font-variant-caps: var(--bf-h4-font-variant-caps);
  font-weight: var(--bf-h4-font-weight);
  inline-size: 100%;
  letter-spacing: var(--bf-h4-letter-spacing);
  line-height: var(--bf-h4-line-height);
  margin-block: 0 var(--bf-h4-margin-bottom);
  max-inline-size: none;
  min-inline-size: 0;
  overflow-wrap: anywhere;
  padding-block-end: var(--bf-h4-nudge-end);
  padding-block-start: var(--bf-h4-nudge-start);
  text-transform: var(--bf-h4-text-transform);
}

:where(.bf-theme) :where(.bf-content-card.is-cols-8) :where(.bf-content-card-title) {
  font-family: var(--bf-h1-font-family);
  font-size: var(--bf-h1-font-size);
  font-style: var(--bf-h1-font-style);
  font-variant-caps: var(--bf-h1-font-variant-caps);
  font-weight: var(--bf-h1-font-weight);
  letter-spacing: var(--bf-h1-letter-spacing);
  line-height: var(--bf-h1-line-height);
  margin-block-end: var(--bf-h1-margin-bottom);
  padding-block-end: var(--bf-h1-nudge-end);
  padding-block-start: var(--bf-h1-nudge-start);
  text-transform: var(--bf-h1-text-transform);
}

:where(.bf-theme) :where(.bf-content-card-main-link) {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  color: inherit;
  cursor: pointer;
  display: -webkit-box;
  inline-size: 100%;
  line-clamp: 3;
  min-inline-size: 0;
  overflow: hidden;
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-content-card-main-link)::after {
  content: "";
  inset: 0;
  position: absolute;
  z-index: 1;
}

:where(.bf-theme) :where(.bf-content-card-main-link:is(:hover, :focus, :active, :visited)) {
  color: inherit;
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-content-card-main-link:focus) {
  outline: none;
}

:where(.bf-theme) :where(.bf-content-card:has(.bf-content-card-main-link:focus-visible)) {
  outline: 3px solid var(--bf-color-focus);
  outline-offset: 2px;
}

/* All nested actions sit above the expanded main-link hit area. This includes
   consumer-supplied controls as well as the documented author-link slot. */
:where(.bf-theme) :where(.bf-content-card) :where(a, button, input, select, textarea, summary):not(.bf-content-card-main-link),
:where(.bf-theme) :where(.bf-content-card-interactive) {
  pointer-events: auto;
  position: relative;
  z-index: 2;
}

:where(.bf-theme) :where(.bf-content-card-author-date) {
  align-items: flex-start;
  color: var(--bf-color-text-muted);
  display: flex;
  flex-wrap: wrap;
  gap: 0 var(--bf-space-half);
  min-inline-size: 0;
  padding-block-end: var(--bf-space-1);
}

:where(.bf-theme) :where(.bf-content-card-author-date > *) {
  margin-block-end: 0;
}

:where(.bf-theme) :where(.bf-content-card-description) {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  display: -webkit-box;
  line-clamp: 4;
  max-inline-size: none;
  min-inline-size: 0;
  overflow: hidden;
  overflow-wrap: anywhere;
}

:where(.bf-theme) :where(.bf-content-card.is-cols-6) :where(.bf-content-card-main-link, .bf-content-card-description) {
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

:where(.bf-theme) :where(.bf-content-card.is-cols-8) :where(.bf-content-card-body) {
  display: flex;
  flex-direction: column;
  min-block-size: 0;
}

:where(.bf-theme) :where(.bf-content-card.is-cols-8) :where(.bf-content-card-description-panel) {
  flex: 1;
  opacity: 1;
  transform: translateY(0);
}

:where(.bf-theme) :where(.bf-content-card.is-cols-8) :where(.bf-content-card-description) {
  -webkit-line-clamp: 2;
  line-clamp: 2;
  margin-block-end: var(--bf-space-2);
}

:where(.bf-theme) :where(.bf-content-card-footer) {
  border-block-start: var(--bf-border-width) solid var(--bf-color-border-low-contrast);
  inline-size: 100%;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-content-card-footer-inner) {
  align-items: center;
  display: flex;
  gap: var(--bf-space-1);
  inline-size: 100%;
  mask-image: linear-gradient(to right, #000 85%, transparent 100%);
  min-block-size: var(--bf-space-4);
  min-inline-size: 0;
  overflow-x: auto;
  padding-block-end: var(--bf-space-1);
  padding-inline: var(--bf-space-2);
  position: relative;
  scrollbar-width: none;
  z-index: 2;
}

:where([dir='rtl'].bf-theme, [dir='rtl'] .bf-theme) :where(.bf-content-card-footer-inner),
:where(.bf-theme) :where([dir='rtl'] .bf-content-card-footer-inner) {
  mask-image: linear-gradient(to left, #000 85%, transparent 100%);
}

:where(.bf-theme) :where(.bf-content-card-footer-inner::-webkit-scrollbar) {
  display: none;
}

:where(.bf-theme) :where(.bf-content-card-footer-inner > *) {
  flex: 0 0 auto;
  white-space: nowrap;
}

:where(.bf-theme) :where(.bf-content-card-resource) {
  align-items: center;
  display: inline-flex;
  gap: var(--bf-space-half);
}

:where(.bf-theme) :where(.bf-content-card-resource > *) {
  margin: 0;
}

:where(.bf-theme) :where(.bf-content-card-footer .bf-chip) {
  margin: 0;
  margin-inline-end: var(--bf-space-3);
}

/* Internal geometry responds to the card's allocated width. The card root is
   only the container; the frame/media/body descendants own queried styles. */
/* Vanilla switches the viewport at 620px/1036px. A four-column card is much
   narrower than that viewport after grid margins and gutters, so its internal
   horizontal layout uses Vanilla's 460px minimum viable allocation. The
   eight-column 50/50 split starts at the roughly 960px allocation left by the
   1036px viewport. This preserves the rendered switch in embedded BF grids. */
@container bf-content-card (width < 28.75rem) {
  :where(.bf-theme) :where(.bf-content-card-frame:not(:has(.bf-content-card-footer))) {
    min-block-size: 0;
    padding-block-end: calc(var(--bf-space-2) - (var(--bf-border-width) * 2));
  }
}

@container bf-content-card (width >= 28.75rem) {
  :where(.bf-theme) :where(.bf-content-card:is(.is-cols-4, .is-cols-6)) :where(.bf-content-card-frame) {
    column-gap: var(--bf-space-2);
    flex-direction: row;
    min-block-size: calc((var(--bf-space-12) * 2) - (var(--bf-border-width) * 2));
    padding: var(--bf-space-2) var(--bf-space-2) 0;
  }

  :where(.bf-theme) :where(.bf-content-card:is(.is-cols-4, .is-cols-6):not(.is-image)) :where(.bf-content-card-frame) {
    min-block-size: calc((var(--bf-space-12) * 2) - (var(--bf-border-width) * 2));
  }

  :where(.bf-theme) :where(.bf-content-card:is(.is-cols-4, .is-cols-6)) :where(.bf-content-card-media) {
    align-self: stretch;
    inline-size: calc(var(--bf-space-12) * 3);
    padding-block-end: 0;
  }

  :where(.bf-theme) :where(.bf-content-card:is(.is-cols-4, .is-cols-6)) :where(.bf-content-card-image) {
    aspect-ratio: 16 / 9;
    block-size: auto;
    block-size: calc(var(--bf-space-12) + var(--bf-space-8));
  }

  :where(.bf-theme) :where(.bf-content-card:is(.is-cols-4, .is-cols-6)) :where(.bf-content-card-body) {
    padding-inline: 0;
  }

  :where(.bf-theme) :where(.bf-content-card:is(.is-cols-4, .is-cols-6)) :where(.bf-content-card-footer-inner) {
    padding-inline: 0;
  }

  /* An explicit image-top modifier wins after the horizontal rules. */
  :where(.bf-theme) :where(.bf-content-card.is-image-top:is(.is-cols-4, .is-cols-6)) :where(.bf-content-card-frame) {
    flex-direction: column;
    min-block-size: calc((var(--bf-space-12) * 4) - (var(--bf-border-width) * 2));
    padding: 0;
  }

  :where(.bf-theme) :where(.bf-content-card.is-image-top:is(.is-cols-4, .is-cols-6)) :where(.bf-content-card-media) {
    inline-size: 100%;
    padding-block-end: var(--bf-space-2);
  }

  :where(.bf-theme) :where(.bf-content-card.is-image-top:is(.is-cols-4, .is-cols-6)) :where(.bf-content-card-image) {
    aspect-ratio: 16 / 9;
    block-size: auto;
    block-size: round(up, calc(100cqi * 9 / 16), var(--bf-baseline));
  }

  :where(.bf-theme) :where(.bf-content-card.is-image-top:is(.is-cols-4, .is-cols-6)) :where(.bf-content-card-body, .bf-content-card-footer-inner) {
    padding-inline: var(--bf-space-2);
  }
}

@container bf-content-card (width >= 60rem) {
  :where(.bf-theme) :where(.bf-content-card.is-cols-8.is-image) :where(.bf-content-card-frame) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    min-block-size: calc((var(--bf-space-12) * 3 + var(--bf-space-8)) - (var(--bf-border-width) * 2));
    padding: 0;
  }

  :where(.bf-theme) :where(.bf-content-card.is-cols-8) :where(.bf-content-card-content) {
    grid-column: 1;
    grid-row: 1;
  }

  :where(.bf-theme) :where(.bf-content-card.is-cols-8) :where(.bf-content-card-body) {
    padding-block-start: var(--bf-space-2);
  }

  :where(.bf-theme) :where(.bf-content-card.is-cols-8) :where(.bf-content-card-media) {
    block-size: 100%;
    grid-column: 2;
    grid-row: 1;
    padding: var(--bf-space-1) var(--bf-space-1) 0;
  }

  :where(.bf-theme) :where(.bf-content-card.is-cols-8) :where(.bf-content-card-image) {
    aspect-ratio: auto;
    block-size: 100%;
  }

  :where(.bf-theme) :where(.bf-content-card.is-cols-8) :where(.bf-content-card-description) {
    -webkit-line-clamp: 3;
    line-clamp: 3;
    margin-block-end: 0;
  }

  :where(.bf-theme) :where(.bf-content-card.is-image-top.is-cols-8.is-image) :where(.bf-content-card-frame) {
    display: flex;
    flex-direction: column;
  }

  :where(.bf-theme) :where(.bf-content-card.is-image-top.is-cols-8) :where(.bf-content-card-media) {
    block-size: auto;
    padding: 0 0 var(--bf-space-2);
  }

  :where(.bf-theme) :where(.bf-content-card.is-image-top.is-cols-8) :where(.bf-content-card-image) {
    aspect-ratio: 16 / 9;
    block-size: auto;
    block-size: round(up, calc(100cqi * 9 / 16), var(--bf-baseline));
  }
}

@media (38.75rem <= width < 64.75rem) {
  :where(.bf-theme) :where(.bf-content-card.is-cols-2) :where(.bf-content-card-author-date),
  :where(.bf-theme) :where(.bf-content-card.is-cols-6) :where(.bf-content-card-author-date) {
    display: none;
  }

  :where(.bf-theme) :where(.bf-content-card.is-cols-8) :where(.bf-content-card-main-link) {
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }
}

/* Vanilla swaps primary copy for the optional description on desktop. Only
   hover or focus of the main action triggers the swap; focusing a nested
   author/footer action never makes that focused control disappear. */
@media (width >= 64.75rem) {
  :where(.bf-theme) :where(.bf-content-card.is-description-reveal:not(.is-cols-8):hover) :where(.bf-content-card-primary),
  :where(.bf-theme) :where(.bf-content-card.is-description-reveal:not(.is-cols-8):has(.bf-content-card-main-link:focus-visible)) :where(.bf-content-card-primary) {
    opacity: 0;
  }

  :where(.bf-theme) :where(.bf-content-card.is-description-reveal:not(.is-cols-8):hover) :where(.bf-content-card-description-panel),
  :where(.bf-theme) :where(.bf-content-card.is-description-reveal:not(.is-cols-8):has(.bf-content-card-main-link:focus-visible)) :where(.bf-content-card-description-panel) {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  :where(.bf-theme) :where(.bf-content-card, .bf-content-card-primary, .bf-content-card-description-panel) {
    transition-duration: 0.01ms;
  }
}
`;
}
