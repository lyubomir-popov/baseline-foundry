/**
 * Vanilla parity ports: logo section and media object.
 *
 * Vanilla → BF rhythm mapping (at Vanilla's 8px unit):
 * - Logo mark heights 72px / 104px → `space-8 + space-1` / `space-12 +
 *   space-1` (nine / thirteen BF baselines).
 * - Logo 32px inline gap → `space-4`; Vanilla's 8px / 16px negative row pull
 *   and matching wrapper compensation → `space-1` / `space-2`.
 * - Media thumbnails 48px / 96px → `space-6` / `space-12`; their 16px
 *   gap → `space-2`; trailing 24px → `section-space-shallow`; metadata top
 *   8px → `space-1`.
 *
 * Those are relative values, rather than fixed pixels, so the same semantics
 * retain the deliberately denser documentation, app, and OS tiers.
 */
export function logoMediaCss(): string {
  return `/* ------------------------------------------------------------------ */
/* Logo section — intrinsic linked marks, without the deprecated logo-block. */
/* ------------------------------------------------------------------ */

:where(.bf-theme) :where(.bf-logo-section) {
  container-name: bf-logo-section;
  container-type: inline-size;
  margin: 0;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-logo-section-items) {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  column-gap: var(--bf-space-4);
  min-inline-size: 0;
  padding-block: var(--bf-space-1);
}

:where(.bf-theme) :where(.bf-logo-section-item) {
  align-items: center;
  block-size: calc(var(--bf-space-8) + var(--bf-space-1));
  display: flex;
  flex: 0 0 auto;
  max-inline-size: 100%;
  margin-block: calc(var(--bf-space-1) * -1);
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-logo-section-link) {
  align-items: center;
  display: inline-flex;
  max-inline-size: 100%;
}

:where(.bf-theme) :where(.bf-logo-section-link:focus:not(:focus-visible)) {
  outline: none;
}

:where(.bf-theme) :where(.bf-logo-section-link:focus-visible) {
  outline: 2px solid var(--bf-color-focus);
  outline-offset: 2px;
}

:where(.bf-theme) :where(.bf-logo-section-logo) {
  block-size: 100%;
  display: block;
  inline-size: auto;
  max-inline-size: 100%;
  object-fit: contain;
}

/* An explicit fallback for marks supplied in inconsistent intrinsic ratios.
   It is named for the component's behaviour—not Vanilla's legacy selector. */
:where(.bf-theme) :where(.bf-logo-section.is-contained) :where(.bf-logo-section-item) {
  inline-size: calc(var(--bf-space-8) + var(--bf-space-1));
  margin-block: 0 var(--bf-space-1);
}

:where(.bf-theme) :where(.bf-logo-section.is-contained) :where(.bf-logo-section-items) {
  padding-block: 0;
}

:where(.bf-theme) :where(.bf-logo-section.is-contained) :where(.bf-logo-section-logo) {
  block-size: auto;
  inline-size: 100%;
}

/* Vanilla's small breakpoint is 620px. The items descendant, rather than the
   query container itself, responds when its allocated space reaches it. */
@container bf-logo-section (width >= 38.75rem) {
  :where(.bf-theme) :where(.bf-logo-section-items) {
    padding-block: var(--bf-space-2);
  }

  :where(.bf-theme) :where(.bf-logo-section-item) {
    block-size: calc(var(--bf-space-12) + var(--bf-space-1));
    margin-block: calc(var(--bf-space-2) * -1);
  }

  :where(.bf-theme) :where(.bf-logo-section.is-contained) :where(.bf-logo-section-item) {
    inline-size: calc(var(--bf-space-12) + var(--bf-space-1));
    margin-block: 0 var(--bf-space-1);
  }

  :where(.bf-theme) :where(.bf-logo-section.is-contained) :where(.bf-logo-section-items) {
    padding-block: 0;
  }
}

/* ------------------------------------------------------------------ */
/* Media object — semantic media/content slots with a container-owned */
/* structural collapse only. Content roles retain their own spacing.  */
/* ------------------------------------------------------------------ */

:where(.bf-theme) :where(.bf-media-object) {
  container-name: bf-media-object;
  container-type: inline-size;
  margin: 0;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-media-object-layout) {
  align-items: start;
  column-gap: var(--bf-grid-gap-inline);
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-media-object-media) {
  align-self: start;
  block-size: var(--bf-space-6);
  inline-size: var(--bf-space-6);
  max-inline-size: 100%;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-media-object-media) {
  grid-column: 1 / span 2;
}

:where(.bf-theme) :where(.bf-media-object-media > :where(img, picture, svg, video)) {
  block-size: 100%;
  display: block;
  inline-size: 100%;
  max-inline-size: 100%;
  object-fit: contain;
}

:where(.bf-theme) :where(.bf-media-object-media.is-round > :where(img, picture, svg, video)) {
  border-radius: 50%;
  object-fit: cover;
}

:where(.bf-theme) :where(.bf-media-object-content) {
  grid-column: 3 / -1;
  min-inline-size: 0;
  overflow-wrap: anywhere;
}

/* This is a real heading slot. The class may be applied to h1–h6; regular
   media objects use BF h4 while the large composition promotes to h1. */
:where(.bf-theme) :where(.bf-media-object-title) {
  font-family: var(--bf-h4-font-family);
  font-size: var(--bf-h4-font-size);
  font-style: var(--bf-h4-font-style);
  font-variant-caps: var(--bf-h4-font-variant-caps);
  font-weight: var(--bf-h4-font-weight);
  letter-spacing: var(--bf-h4-letter-spacing);
  line-height: var(--bf-h4-line-height);
  margin-block: 0 var(--bf-h4-margin-bottom);
  overflow-wrap: anywhere;
  padding-block: var(--bf-h4-nudge-start) 0;
  text-transform: var(--bf-h4-text-transform);
}

:where(.bf-theme) :where(.bf-media-object.is-large) :where(.bf-media-object-media) {
  block-size: var(--bf-space-12);
  inline-size: var(--bf-space-12);
}

:where(.bf-theme) :where(.bf-media-object.is-large) :where(.bf-media-object-title) {
  font-family: var(--bf-h1-font-family);
  font-size: var(--bf-h1-font-size);
  font-style: var(--bf-h1-font-style);
  font-variant-caps: var(--bf-h1-font-variant-caps);
  font-weight: var(--bf-h1-font-weight);
  letter-spacing: var(--bf-h1-letter-spacing);
  line-height: var(--bf-h1-line-height);
  margin-block: 0 var(--bf-h1-margin-bottom);
  padding-block: var(--bf-h1-nudge-start) 0;
  text-transform: var(--bf-h1-text-transform);
}

:where(.bf-theme) :where(.bf-media-object-meta-list) {
  --bf-stack-space: var(--bf-space-1);
  align-content: start;
  display: grid;
  gap: var(--bf-stack-space);
  list-style: none;
  margin: 0;
  padding: 0;
}

:where(.bf-theme) :where(.bf-media-object-meta) {
  align-items: start;
  column-gap: var(--bf-space-1);
  display: grid;
  grid-template-columns: var(--bf-icon-size-default) minmax(0, 1fr);
  min-inline-size: 0;
  overflow-wrap: anywhere;
}

:where(.bf-theme) :where(.bf-media-object-meta .bf-icon) {
  margin-block-start: var(--bf-body-nudge-start);
}

@container bf-media-object (width >= 38.75rem) {
  :where(.bf-theme) :where(.bf-media-object-layout) {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }

  :where(.bf-theme) :where(.bf-media-object-media) {
    grid-column: 1 / span 2;
  }

  :where(.bf-theme) :where(.bf-media-object-content) {
    grid-column: 3 / -1;
  }
}
`;
}
