import { componentDensityPolicy, siteDenseChipPolicySelectors, siteDenseChipScopedCss } from "../component-density-policy.js";
import { blockEndStrokeOverlayCss } from "./stroke-paint.js";

type TableCssOptions = {
  bodyLineHeight: string;
  bodyMediumTypeStyles: string;
  bodyTypeStyles: string;
  siteScopes: string[];
};

export function tableCss(options: TableCssOptions): string {
  const { bodyLineHeight, bodyMediumTypeStyles, bodyTypeStyles, siteScopes } = options;
  const denseChipHosts = siteDenseChipPolicySelectors().hosts;
  const density = componentDensityPolicy.siteDenseChip;
  const cellSelector = ":where(.bf-theme) :where(.bf-table > thead > tr > th:not([aria-sort]), .bf-table > thead > tr > td, .bf-table > tbody > tr > th:not([aria-sort]), .bf-table > tbody > tr > td, .bf-table > tfoot > tr > th:not([aria-sort]), .bf-table > tfoot > tr > td)";
  const cellStroke = blockEndStrokeOverlayCss(cellSelector, { anchor: "relative", color: "var(--bf-table-cell-stroke-color, transparent)", width: "var(--bf-table-row-border-size)" });
  const denseChipHostCss = denseChipHosts
    ? `\n/* A Site Table.Cell is the approved dense Chip provider. Nested scopes make\n   the nearest cell and product root authoritative through neutral wrappers. */\n${siteDenseChipScopedCss(siteScopes, denseChipHosts, `${density.currentMember}: var(${density.denseMember});\npadding-block-end: max(0rem, calc(var(--bf-table-row-padding-block-end) - var(${density.currentMember})));\npadding-block-start: max(0rem, calc(var(--bf-table-row-padding-block-start) - var(${density.currentMember})));`)}\n`
    : "";

  return `${cellStroke.owner}

:where(.bf-theme) {
  --bf-table-row-border-size: var(--bf-border-width);
  --bf-table-row-padding-block-start: var(--bf-in-box-row-padding-block-start);
  --bf-table-row-block-size: var(--bf-interface-row-occupied-block-size);
  --bf-table-row-padding-block-end: max(0rem, calc(var(--bf-table-row-block-size) - ${bodyLineHeight} - var(--bf-table-row-padding-block-start)));
  --bf-table-row-line-height: ${bodyLineHeight};
}

:where(.bf-theme) :where(.bf-table-scroll) {
  max-inline-size: 100%;
  min-inline-size: 0;
  overflow-x: auto;
  scrollbar-width: thin;
}

:where(.bf-theme) :where(.bf-table-scroll) > :where(table, .bf-table) {
  min-inline-size: var(--bf-table-scroll-min-inline-size, 48rem);
}

:where(.bf-theme) :where(table, .bf-table) {
  border: 0;
  border-collapse: separate;
  border-spacing: 0;
  caption-side: bottom;
  line-height: ${bodyLineHeight};
  margin: 0;
  table-layout: auto;
  width: 100%;
}

:where(.bf-theme) :where(caption, .bf-table-caption) {
${bodyTypeStyles}  color: var(--bf-color-text-muted);
  margin: 0;
  padding-bottom: calc(var(--bf-baseline) * 0.5);
  padding-top: calc(var(--bf-baseline) * 0.5);
  text-align: left;
}

:where(.bf-theme) :where(th, td) {
  --bf-table-cell-stroke-color: transparent;
  border: 0;
  box-shadow: inset 0 calc(var(--bf-table-row-border-size) * -1) 0 var(--bf-table-cell-stroke-color);
  color: var(--bf-color-text-default);
  line-height: var(--bf-table-row-line-height);
  margin: 0;
  overflow: hidden;
  padding-block-end: var(--bf-table-row-padding-block-end);
  padding-block-start: var(--bf-table-row-padding-block-start);
  padding-inline: var(--bf-component-inline-inset-field);
  text-align: left;
  text-overflow: ellipsis;
  vertical-align: top;
}

:where(.bf-theme) :where(.bf-table > thead > tr > th, .bf-table > thead > tr > td, .bf-table > tbody > tr > th, .bf-table > tbody > tr > td, .bf-table > tfoot > tr > th, .bf-table > tfoot > tr > td) {
  box-shadow: none;
}

/* A real popup inside a BF cell is an explicit escape owner. Raw native table
   cells retain their original clipping while no longer becoming containing
   blocks merely to paint the row rule. */
:where(.bf-theme) :where(.bf-table > thead > tr > th, .bf-table > thead > tr > td, .bf-table > tbody > tr > th, .bf-table > tbody > tr > td, .bf-table > tfoot > tr > th, .bf-table > tfoot > tr > td):has(.bf-contextual-menu) {
  overflow: visible;
}

:where(.bf-theme) :where(th.is-icon-placeholder, td.is-icon-placeholder, .bf-table-cell.is-icon-placeholder) {
  padding-inline-start: calc(var(--bf-component-inline-inset-field) + var(--bf-leading-icon-size) + var(--bf-leading-icon-gap));
}

:where(.bf-theme) :where(th.is-icon-placeholder, td.is-icon-placeholder, .bf-table-cell.is-icon-placeholder) > :where(.bf-icon:first-child) {
  --bf-icon-size: var(--bf-leading-icon-size);
  margin-inline-end: var(--bf-leading-icon-gap);
  margin-inline-start: calc((var(--bf-leading-icon-size) + var(--bf-leading-icon-gap)) * -1);
}

:where(.bf-theme) :where(td) {
  font-weight: var(--bf-body-font-weight, 400);
}

:where(.bf-theme) :where(thead th, thead td) {
  --bf-table-cell-stroke-color: var(--bf-color-border-default);
}

:where(.bf-theme) :where(thead th) {
${bodyMediumTypeStyles}  color: var(--bf-color-text-default);
  line-height: var(--bf-table-row-line-height);
}

:where(.bf-theme) :where(tbody tr:not(:last-child) > th, tbody tr:not(:last-child) > td, tfoot tr > th, tfoot tr > td) {
  --bf-table-cell-stroke-color: var(--bf-color-border-low-contrast);
}

:where(.bf-theme) :where(tbody tr:hover td) {
  background: color-mix(in srgb, var(--bf-color-background-hover) 68%, transparent);
}
${cellStroke.painter}

/* Raw native tables have no class-owned overlay anchor. In forced colors they
   use an inset system outline: the boundary becomes all-sided, but remains
   paint-only and preserves raw cell geometry and containing-block behavior. */
@media (forced-colors: active) {
  :where(.bf-theme) :where(th, td):not(.bf-table > thead > tr > *, .bf-table > tbody > tr > *, .bf-table > tfoot > tr > *) {
    box-shadow: none;
    outline: var(--bf-table-row-border-size) solid CanvasText;
    outline-offset: calc(var(--bf-table-row-border-size) * -1);
  }
}
${denseChipHostCss}
`;
}
