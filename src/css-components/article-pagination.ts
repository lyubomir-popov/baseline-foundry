type ArticlePaginationCssOptions = {
  bodyCaseTypeStyles: string;
  titleTypeStyles: string;
};

/**
 * Sequential documentation navigation. This intentionally does not share the
 * numbered-pagination API: article destinations need their direction and full
 * title in the accessible name at every container width. Current Vanilla's
 * persistent row, directional halves and compact previous link are retained;
 * BF typography and metric compensation keep the occupied block on-grid.
 */
export function articlePaginationCss(options: ArticlePaginationCssOptions): string {
  const { bodyCaseTypeStyles, titleTypeStyles } = options;

  return `:where(.bf-theme) :where(.bf-article-pagination) {
  container-name: bf-article-pagination;
  container-type: inline-size;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  margin: 0;
  min-inline-size: 0;
}

:where(.bf-theme) :where(a.bf-article-pagination-link) {
  background-color: var(--bf-color-background-default);
  border: var(--bf-border-width) solid transparent;
  box-sizing: border-box;
  color: var(--bf-color-text-default);
  display: grid;
  column-gap: var(--bf-leading-mark-gap);
  grid-template-rows: auto auto;
  inline-size: calc((100cqi - var(--bf-leading-mark-gap)) / 2);
  min-inline-size: 0;
  padding-block: calc(var(--bf-space-2) + (var(--bf-baseline) / 4) - var(--bf-border-width));
  position: relative;
  row-gap: var(--bf-space-half);
  text-decoration: none;
}

:where(.bf-theme) :where(a.bf-article-pagination-link:hover) {
  background-color: var(--bf-color-background-hover);
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-article-pagination-link:focus:not(:focus-visible)) {
  outline: none;
}

:where(.bf-theme) :where(.bf-article-pagination-link:focus-visible) {
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: 0.125rem;
}

:where(.bf-theme) :where(.bf-article-pagination-link.is-previous) {
  grid-column: 1;
  grid-template-columns: var(--bf-icon-size-default) minmax(0, 1fr);
  padding-inline: var(--bf-leading-mark-gap) var(--bf-component-inline-inset-action);
  text-align: start;
}

:where(.bf-theme) :where(.bf-article-pagination-link.is-next) {
  grid-column: 2;
  grid-template-columns: minmax(0, 1fr) var(--bf-icon-size-default);
  justify-self: end;
  padding-inline: var(--bf-component-inline-inset-action) var(--bf-leading-mark-gap);
  text-align: end;
}

:where(.bf-theme) :where(.bf-article-pagination-direction) {
${bodyCaseTypeStyles}  color: inherit;
  display: contents;
  margin: 0;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-article-pagination-link.is-previous .bf-icon) {
  align-self: center;
  grid-column: 1;
  grid-row: 1;
  justify-self: start;
}

:where(.bf-theme) :where(.bf-article-pagination-link.is-previous .bf-article-pagination-label),
:where(.bf-theme) :where(.bf-article-pagination-link.is-previous .bf-article-pagination-title) {
  grid-column: 2;
}

:where(.bf-theme) :where(.bf-article-pagination-link.is-next .bf-icon) {
  align-self: center;
  grid-column: 2;
  grid-row: 1;
  justify-self: end;
}

:where(.bf-theme) :where(.bf-article-pagination-link.is-next .bf-article-pagination-label),
:where(.bf-theme) :where(.bf-article-pagination-link.is-next .bf-article-pagination-title) {
  grid-column: 1;
}

:where(.bf-theme) :where(.bf-article-pagination-direction > .bf-icon) {
  --bf-icon-size: var(--bf-icon-size-default);
  margin-block-start: 0;
}

:where(.bf-theme) .bf-article-pagination:dir(rtl) .bf-article-pagination-link.is-previous .bf-icon {
  --bf-icon-transform: rotate(-90deg);
}

:where(.bf-theme) .bf-article-pagination:dir(rtl) .bf-article-pagination-link.is-next .bf-icon {
  --bf-icon-transform: rotate(90deg);
}

:where(.bf-theme) :where(.bf-article-pagination-label) {
  grid-row: 1;
  min-inline-size: 0;
  overflow-wrap: anywhere;
}

:where(.bf-theme) :where(.bf-article-pagination-title) {
${titleTypeStyles}  color: inherit;
  grid-row: 2;
  margin: 0;
  overflow-wrap: anywhere;
}

@container bf-article-pagination (width < 28.75rem) {
  :where(.bf-theme) :where(.bf-article-pagination-link:only-child) {
    grid-column: 1 / -1;
    inline-size: 100%;
  }

  :where(.bf-theme) :where(.bf-article-pagination-link.is-previous:not(:only-child)) {
    grid-template-columns: var(--bf-icon-size-default);
    inline-size: calc(var(--bf-space-6) + var(--bf-space-1));
    padding-inline: var(--bf-leading-mark-gap);
  }

  :where(.bf-theme) :where(.bf-article-pagination-link.is-next:not(:only-child)) {
    inline-size: 100%;
  }

  :where(.bf-theme) :where(.bf-article-pagination-link.is-previous:not(:only-child) .bf-article-pagination-label),
  :where(.bf-theme) :where(.bf-article-pagination-link.is-previous:not(:only-child) .bf-article-pagination-title) {
    block-size: 0.0625rem;
    border: 0;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    inline-size: 0.0625rem;
    margin: -0.0625rem;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
  }
}

`;
}
