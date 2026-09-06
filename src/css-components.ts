import { buttonActionsCss } from "./css-components/button-actions.js";
import { articlePaginationCss } from "./css-components/article-pagination.js";
import { applicationGeometryCss } from "./css-components/application-geometry.js";
import { cardsOptionsCss } from "./css-components/cards-options.js";
import { chipBadgeStatusCss } from "./css-components/chip-badge-status.js";
import { ctaFigureAspectCss } from "./css-components/cta-figure-aspect.js";
import { controlRowCss } from "./css-components/control-row.js";
import { contentCardCss } from "./css-components/content-card.js";
import { alignedVisualStart, controlGeometryCss } from "./css-components/control-geometry.js";
import { documentNavigationCss } from "./css-components/document-navigation.js";
import { editorialContentCss } from "./css-components/editorial-content.js";
import { iconCss } from "./css-components/icon.js";
import { interactiveFeedbackCss } from "./css-components/interactive-feedback.js";
import { interactiveTablesCss } from "./css-components/interactive-tables.js";
import { listCss } from "./css-components/list.js";
import { listTreeCss } from "./css-components/list-tree.js";
import { legacyNavigationCss } from "./css-components/legacy-navigation.js";
import { linkedLogoSiteLayoutCss } from "./css-components/linked-logo-site-layout.js";
import { logoMediaCss } from "./css-components/logo-media.js";
import { navigationLayoutCss } from "./css-components/navigation-layout.js";
import { navigationGeometryCss } from "./css-components/navigation-geometry.js";
import { nestedControlsCss } from "./css-components/nested-controls.js";
import { panelCss } from "./css-components/panel.js";
import { searchBoxAndFilterCss } from "./css-components/search-box-and-filter.js";
import { sitesFoundationCss } from "./css-components/sites-foundation.js";
import { sitesEditorialPortsCss } from "./css-components/sites-editorial-ports.js";
import { sitesRichListsCss } from "./css-components/sites-rich-lists.js";
import { staticContentPortsCss } from "./css-components/static-content-ports.js";
import { tableCss } from "./css-components/table.js";
import { tabSectionCss } from "./css-components/tab-section.js";
import { tabsChoiceBreadcrumbsCss } from "./css-components/tabs-choice-breadcrumbs.js";
import { tieredListEqualHeightRowCss } from "./css-components/tiered-list-equal-height-row.js";
import { componentContractsCss } from "./css-component-contracts.js";
import { foundryComponentColorVars } from "./vanilla-theme-colors.js";
import type { ThemeSurface, ThemeTokens, TypographyToken } from "./types.js";

function roleFontFamilyVar(roleName: string, fallback?: string): string {
  return fallback ? `var(--bf-${roleName}-font-family, ${fallback})` : `var(--bf-${roleName}-font-family)`;
}

function roleFontSizeVar(roleName: string, fallback?: string): string {
  return fallback ? `var(--bf-${roleName}-font-size, ${fallback})` : `var(--bf-${roleName}-font-size)`;
}

function roleFontStyleVar(roleName: string, fallback?: string): string {
  return fallback ? `var(--bf-${roleName}-font-style, ${fallback})` : `var(--bf-${roleName}-font-style)`;
}

function roleFontWeightVar(roleName: string, fallback?: number): string {
  return fallback !== undefined ? `var(--bf-${roleName}-font-weight, ${fallback})` : `var(--bf-${roleName}-font-weight)`;
}

function typeStyles(token: TypographyToken, options: {
  fontWeight?: number;
  includeCase?: boolean;
} = {}): string {
  const roleName = token.identifier;
  const fontVariantCaps = options.includeCase !== false && token.fontVariantCaps
    ? `  font-variant-caps: ${token.fontVariantCaps};\n`
    : "";
  const letterSpacing = options.includeCase !== false && token.letterSpacing
    ? `  letter-spacing: ${token.letterSpacing};\n`
    : "";
  const textTransform = options.includeCase !== false && token.textTransform
    ? `  text-transform: ${token.textTransform};\n`
    : "";

  if (!roleName) {
    return `  font-family: ${token.fontStack};\n  font-size: ${token.fontSize};\n  font-style: ${token.fontStyle ?? "normal"};\n  font-weight: ${options.fontWeight ?? token.fontWeight ?? 400};\n${fontVariantCaps}${letterSpacing}${textTransform}  line-height: ${token.lineHeight};\n`;
  }

  return `  font-family: ${roleFontFamilyVar(roleName, token.fontStack)};\n  font-size: ${roleFontSizeVar(roleName, token.fontSize)};\n  font-style: ${roleFontStyleVar(roleName, token.fontStyle ?? "normal")};\n  font-weight: ${options.fontWeight ?? roleFontWeightVar(roleName, token.fontWeight ?? 400)};\n${fontVariantCaps}${letterSpacing}${textTransform}  line-height: ${roleLineHeightVar(roleName, token.lineHeight)};\n`;
}

function roleLineHeightVar(roleName: string, fallback?: string): string {
  return fallback ? `var(--bf-${roleName}-line-height, ${fallback})` : `var(--bf-${roleName}-line-height)`;
}

function roleSelectedStartNudgeVar(roleName: string, fallback?: string): string {
  return fallback ? `var(--bf-${roleName}-nudge-start, ${fallback})` : `var(--bf-${roleName}-nudge-start)`;
}

function roleSelectedEndNudgeVar(roleName: string, fallback?: string): string {
  return fallback ? `var(--bf-${roleName}-nudge-end, ${fallback})` : `var(--bf-${roleName}-nudge-end)`;
}

export function componentsCss(tokens: ThemeTokens, themeSurfaces?: ThemeSurface[]): string {
  const body = tokens.roles.body;
  const h4 = tokens.roles.h4 ?? body;
  const h5 = tokens.roles.h5 ?? body;
  const h6 = tokens.roles.h6 ?? body;
  const baselineUnit = tokens.baselineUnit;
  const bodyLineHeight = roleLineHeightVar("body", body.lineHeight);
  const inputMarginBottom = "var(--bf-interface-row-compensation-block-end)";
  const buttonMarginBottom = "var(--bf-interface-row-compensation-block-end)";
  const bodySelectedStartNudge = roleSelectedStartNudgeVar("body", body.nudgeTop);
  const bodySelectedEndNudge = roleSelectedEndNudgeVar("body");
  const h4LineHeight = roleLineHeightVar("h4", h4.lineHeight);
  const h5LineHeight = roleLineHeightVar("h5", h5.lineHeight);
  const h6LineHeight = roleLineHeightVar("h6", h6.lineHeight);
  const bodyTypeStyles = typeStyles(body, { includeCase: false });
  const h6TypeStyles = typeStyles(h6, { includeCase: false });
  const buttonPadding = "  padding-block: var(--bf-interface-row-padding-block);\n";

  return `${componentContractsCss(tokens, themeSurfaces)}
${controlGeometryCss({ bodyLineHeight, bodySelectedStartNudge })}
${applicationGeometryCss()}
${navigationGeometryCss()}
:where(.bf-theme) {
${foundryComponentColorVars("light")}
  --bf-ui-icon-chevron-down: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%23000' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4.25 6.25 8 10l3.75-3.75'/%3E%3C/svg%3E");
  --bf-ui-icon-number-stepper: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%23000' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4.25 5.75 8 2l3.75 3.75M4.25 10.25 8 14l3.75-3.75'/%3E%3C/svg%3E");
  --bf-ui-icon-close: url("data:image/svg+xml,%3Csvg width='16' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.25 4.25 11.75 11.75M11.75 4.25 4.25 11.75' fill='none' stroke='%23111' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
  --bf-ui-icon-error-grey: url("data:image/svg+xml,%3Csvg width='16' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 1.52588e-05C12.4183 1.52588e-05 16 3.58174 16 8.00002C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8.00002C0 3.58174 3.58172 1.52588e-05 8 1.52588e-05ZM10.2821 4.63808L11.3427 5.69874L9.05007 7.99008L11.3427 10.2821L10.2821 11.3427L7.99007 9.05008L5.69873 11.3427L4.63807 10.2821L6.92907 7.99008L4.63807 5.69874L5.69873 4.63808L7.99007 6.92908L10.2821 4.63808ZM1.5 8.00002C1.5 4.41016 4.41015 1.50002 8 1.50002C11.5899 1.50002 14.5 4.41016 14.5 8.00002C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8.00002Z' fill='%23111' fill-rule='evenodd'/%3E%3C/svg%3E");
  --bf-ui-icon-search: url("data:image/svg+xml,%3Csvg width='16' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.964 1a5.964 5.964 0 014.709 9.623l4.303 4.305-1.06 1.06-4.306-4.305A5.964 5.964 0 116.963 1zm0 1.5a4.464 4.464 0 100 8.927 4.464 4.464 0 000-8.927z' fill='%23111' fill-rule='nonzero'/%3E%3C/svg%3E");
  --bf-ui-icon-success-grey: url("data:image/svg+xml,%3Csvg width='16' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0a8 8 0 110 16A8 8 0 018 0zm0 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zm2.814 2.45l1.203.897-5.537 7.43-3.485-3.694 1.09-1.03 2.259 2.394 4.47-5.997z' fill='%23111' fill-rule='nonzero'/%3E%3C/svg%3E");
  color: var(--bf-color-text-default);
}

/* DEMO ONLY — Cap-derived component nudges are unreliable (ascender ≠ cap height). */
:where(.bf-theme.bf-engine-cap) {
  --bf-body-nudge-start: calc(var(--bf-baseline) - mod(calc((${bodyLineHeight} + 1cap) / 2), var(--bf-baseline)));
  --bf-body-nudge-end: calc(var(--bf-baseline) - var(--bf-body-nudge-start));
  --bf-h4-nudge-start: calc(var(--bf-baseline) - mod(calc((${h4LineHeight} + 1cap) / 2), var(--bf-baseline)));
  --bf-h4-nudge-end: calc(var(--bf-baseline) - var(--bf-h4-nudge-start));
  --bf-h5-nudge-start: calc(var(--bf-baseline) - mod(calc((${h5LineHeight} + 1cap) / 2), var(--bf-baseline)));
  --bf-h5-nudge-end: calc(var(--bf-baseline) - var(--bf-h5-nudge-start));
  --bf-h6-nudge-start: calc(var(--bf-baseline) - mod(calc((${h6LineHeight} + 1cap) / 2), var(--bf-baseline)));
  --bf-h6-nudge-end: calc(var(--bf-baseline) - var(--bf-h6-nudge-start));
}

:where(.bf-theme.bf-engine-cap) :where(.bf-input, input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select) {
  margin-bottom: ${inputMarginBottom};
}

:where(.bf-theme.is-dark) {
${foundryComponentColorVars("dark")}
  --bf-ui-icon-chevron-down: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%23fff' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4.25 6.25 8 10l3.75-3.75'/%3E%3C/svg%3E");
  --bf-ui-icon-number-stepper: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%23fff' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4.25 5.75 8 2l3.75 3.75M4.25 10.25 8 14l3.75-3.75'/%3E%3C/svg%3E");
  --bf-ui-icon-close: url("data:image/svg+xml,%3Csvg width='16' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.25 4.25 11.75 11.75M11.75 4.25 4.25 11.75' fill='none' stroke='%23fff' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
  --bf-ui-icon-error-grey: url("data:image/svg+xml,%3Csvg width='16' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 1.52588e-05C12.4183 1.52588e-05 16 3.58174 16 8.00002C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8.00002C0 3.58174 3.58172 1.52588e-05 8 1.52588e-05ZM10.2821 4.63808L11.3427 5.69874L9.05007 7.99008L11.3427 10.2821L10.2821 11.3427L7.99007 9.05008L5.69873 11.3427L4.63807 10.2821L6.92907 7.99008L4.63807 5.69874L5.69873 4.63808L7.99007 6.92908L10.2821 4.63808ZM1.5 8.00002C1.5 4.41016 4.41015 1.50002 8 1.50002C11.5899 1.50002 14.5 4.41016 14.5 8.00002C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8.00002Z' fill='%23fff' fill-rule='evenodd'/%3E%3C/svg%3E");
  --bf-ui-icon-search: url("data:image/svg+xml,%3Csvg width='16' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.964 1a5.964 5.964 0 014.709 9.623l4.303 4.305-1.06 1.06-4.306-4.305A5.964 5.964 0 116.963 1zm0 1.5a4.464 4.464 0 100 8.927 4.464 4.464 0 000-8.927z' fill='%23fff' fill-rule='nonzero'/%3E%3C/svg%3E");
  --bf-ui-icon-success-grey: url("data:image/svg+xml,%3Csvg width='16' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0a8 8 0 110 16A8 8 0 018 0zm0 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zm2.814 2.45l1.203.897-5.537 7.43-3.485-3.694 1.09-1.03 2.259 2.394 4.47-5.997z' fill='%23fff' fill-rule='nonzero'/%3E%3C/svg%3E");
  color-scheme: dark;
}

:where(.bf-theme.is-light) {
  color-scheme: light;
}

:where(.bf-theme) :where(.bf-tabs-link, .bf-button, .bf-button.is-base, .bf-accordion-tab) {
  margin: 0;
}

:where(.bf-theme) :where(button) {
  font: inherit;
}



:where(.bf-theme) :where(.bf-form-label) {
${typeStyles(body, { includeCase: false })}  color: var(--bf-color-text-default);
  display: block;
  margin: 0 0 var(--bf-body-margin-bottom);
  overflow-wrap: anywhere;
  padding-block-end: 0;
  padding-block-start: ${bodySelectedStartNudge};
  text-align: start;
}

:where(.bf-theme) :where(.bf-form-help) {
${typeStyles(body, { includeCase: false })}  color: var(--bf-color-text-muted);
  display: block;
  margin: 0 0 var(--bf-body-margin-bottom);
  max-inline-size: 42ch;
  overflow-wrap: anywhere;
  padding-block-end: 0;
  padding-block-start: ${bodySelectedStartNudge};
}

:where(.bf-theme) :where(.bf-form-help.is-tight) {
  margin-top: calc(var(--bf-baseline) * -1);
}

:where(.bf-theme) :where(.bf-field) {
  display: grid;
  gap: var(--bf-field-gap);
  margin: 0;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-control) {
  display: grid;
  gap: var(--bf-field-gap);
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-field.is-range) {
  align-items: start;
  column-gap: var(--bf-component-inline-inset-field);
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  row-gap: var(--bf-field-gap);
}

:where(.bf-theme) :where(.bf-field.is-range) > :where(.bf-form-label) {
  grid-column: 1;
}

:where(.bf-theme) :where(.bf-field.is-range) > :where(.bf-control) {
  grid-column: 2;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-field.is-range) > :where(.bf-form-help) {
  grid-column: 2;
}

:where(.bf-theme) :where(.bf-field.is-range.is-stacked) {
  grid-template-columns: minmax(0, 1fr);
}

:where(.bf-theme) :where(.bf-field.is-range.is-stacked) > :where(.bf-control, .bf-form-help) {
  grid-column: 1;
}

:where(.bf-theme) :where(.bf-field.is-range.is-stacked) > :where(.bf-control) {
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-field.is-checkbox) {
  gap: 0;
}

:where(.bf-theme) :where(.bf-field.is-checkbox) :where(.bf-control) {
  gap: 0;
}

:where(.bf-theme) :where(fieldset, .bf-fieldset) {
  border: var(--bf-border-width) solid var(--bf-color-border-default);
  margin: 0;
  min-inline-size: 0;
  padding-block-end: calc(var(--bf-panel-padding-block) - var(--bf-border-width));
  padding-inline: var(--bf-panel-padding-inline);
  padding-block-start: var(--bf-panel-padding-block);
}

:where(.bf-theme) :where(fieldset, .bf-fieldset) > :where(legend, .bf-legend) {
  margin-bottom: 0;
  padding-inline: var(--bf-inline-unit);
}

:where(.bf-theme) :where(.bf-input, input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select) {
${typeStyles(body, { includeCase: false })}  appearance: none;
  background-color: var(--bf-color-background-inputs);
  border: 0 solid transparent;
  border-bottom: var(--bf-border-width) solid var(--bf-color-border-high-contrast);
  border-top: var(--bf-border-width) solid transparent;
  border-radius: var(--bf-radius);
  color: var(--bf-color-text-default);
  inline-size: 100%;
  max-inline-size: 100%;
  min-inline-size: 0;
  margin-bottom: ${inputMarginBottom};
  padding-block: var(--bf-interface-row-padding-block);
  padding-inline: var(--bf-component-inline-inset-field);
}

:where(.bf-theme) :where(.bf-color-control) {
  display: grid;
  grid-template-areas: "color-control";
  inline-size: 4rem;
}

/* Native color inputs do not expose a body-text line box. This invisible
   metric strut gives their wrapper the same natural padding/border/margin
   construction as every textual control, including under browser zoom. */
:where(.bf-theme) :where(.bf-color-control)::before {
  border-block: var(--bf-border-width) solid transparent;
  content: "\\00a0";
  grid-area: color-control;
  line-height: var(--bf-body-line-height);
  margin-bottom: var(--bf-interface-row-compensation-block-end);
  padding-block: var(--bf-interface-row-padding-block);
  visibility: hidden;
}

:where(.bf-theme) :where(.bf-color-control) > :where(input[type='color'].bf-color-input) {
  align-self: stretch;
  block-size: auto;
  grid-area: color-control;
  inline-size: 100%;
  margin-bottom: var(--bf-interface-row-compensation-block-end);
  min-block-size: 0;
  padding: var(--bf-border-width);
}

:where(.bf-theme) :where(.bf-input, input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select):hover {
  background-color: var(--bf-color-background-hover);
}

:where(.bf-theme) :where(.bf-input, input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select):focus:not(:focus-visible) {
  outline: none;
}

:where(.bf-theme) :where(.bf-input, input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select):focus-visible {
  background-color: var(--bf-color-background-active);
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: 0.125rem;
}

:where(.bf-theme) :where(.bf-input, input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select):disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

:where(.bf-theme) :where(.bf-input, input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select)[readonly] {
  background-color: var(--bf-color-background-alt);
  color: var(--bf-color-text-muted);
}

:where(.bf-theme) :where(textarea) {
  block-size: auto;
  min-block-size: calc((var(--bf-interface-row-occupied-block-size) * 2) - var(--bf-interface-row-compensation-block-end));
  resize: vertical;
}

:where(.bf-theme) :where(input[type='file']) {
${typeStyles(body, { includeCase: false })}  background: transparent;
  border: 0 solid transparent;
  box-shadow: inset 0 calc(var(--bf-border-width) * -1) 0 var(--bf-color-border-default);
  color: var(--bf-color-text-default);
  margin-bottom: ${inputMarginBottom};
  max-inline-size: 100%;
  min-inline-size: 0;
  padding-block: 0;
  padding-inline: 0;
  width: 100%;
}

:where(.bf-theme) :where(input[type='file'])::file-selector-button {
${typeStyles(body, { includeCase: false })}  appearance: none;
  background: var(--bf-color-background-alt);
  border: var(--bf-border-width) solid var(--bf-color-border-default);
  border-radius: var(--bf-radius);
  color: var(--bf-color-text-default);
  cursor: pointer;
  margin-inline-end: var(--bf-field-gap);
  min-block-size: 0;
  padding-block: var(--bf-interface-row-padding-block);
  padding-inline: var(--bf-component-inline-inset-action-bordered);
}

:where(.bf-theme) :where(input[type='file'])::file-selector-button:hover {
  background: var(--bf-color-background-hover);
}

:where(.bf-theme) :where(select) {
  background-image: var(--bf-ui-icon-chevron-down);
  background-position: right var(--bf-component-inline-inset-field) center;
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
  overflow: hidden;
  padding-inline-end: calc(1rem + (var(--bf-component-inline-inset-field) * 2));
  text-overflow: ellipsis;
  white-space: nowrap;
}

:where(.bf-theme) :where(input[type='number'], .bf-slider-input) {
  font-variant-numeric: tabular-nums;
}

/* Number fields retain their native input semantics and keyboard stepping,
   while one field-owned background paints the compact pair. The trailing
   reservation contains the 1rem canvas plus one field inset on either side,
   so right-aligned values cannot enter the painted region. */
:where(.bf-theme) :where(input[type='number']) {
  appearance: textfield;
  background-image: var(--bf-ui-icon-number-stepper);
  background-position: right var(--bf-component-inline-inset-field) center;
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
  padding-inline-end: calc(1rem + (var(--bf-component-inline-inset-field) * 2));
}

:where(.bf-theme) :where(select:dir(rtl), input[type='number']:dir(rtl)) {
  background-position: left var(--bf-component-inline-inset-field) center;
}

:where(.bf-theme) :where(.bf-slider-input) {
  flex: 0 1 5rem;
  inline-size: min(100%, 5rem);
  justify-self: end;
  max-inline-size: 100%;
  min-inline-size: 0;
  text-align: right;
}

:where(.bf-theme) :where(input[type='number'])::-webkit-inner-spin-button,
:where(.bf-theme) :where(input[type='number'])::-webkit-outer-spin-button {
  appearance: none;
  margin: 0;
}

:where(.bf-theme) :where(.bf-checkbox, .bf-radio) {
  display: grid;
  margin: 0;
  padding-inline-start: var(--bf-leading-mark-group-inset);
  position: relative;
}

:where(.bf-theme) :where(.bf-checkbox-input, .bf-radio-input) {
  block-size: var(--bf-control-visual-size);
  inline-size: var(--bf-control-visual-size);
  left: 0;
  margin: 0;
  opacity: 0;
  position: absolute;
  top: var(--bf-tick-box-offset);
}

:where(.bf-theme) :where(.bf-checkbox-label, .bf-radio-label) {
${typeStyles(body, { includeCase: false })}  color: var(--bf-color-text-default);
  border-block: var(--bf-border-width) solid transparent;
  cursor: pointer;
  display: block;
  margin: 0 0 var(--bf-interface-row-compensation-block-end);
  padding-block: var(--bf-interface-row-padding-block);
  padding-inline-start: var(--bf-tick-label-offset);
  position: relative;
}

:where(.bf-theme) :where(.bf-checkbox-label, .bf-radio-label)::before,
:where(.bf-theme) :where(.bf-checkbox-label, .bf-radio-label)::after {
  box-sizing: border-box;
  content: "";
  position: absolute;
}

:where(.bf-theme) :where(.bf-checkbox-label, .bf-radio-label)::before {
  background: var(--bf-color-background-default);
  block-size: var(--bf-control-visual-size);
  border: var(--bf-border-width) solid var(--bf-color-border-high-contrast);
  inline-size: var(--bf-control-visual-size);
  inset-inline-start: 0;
  inset-block-start: var(--bf-tick-box-offset);
}

:where(.bf-theme) :where(.bf-checkbox-label:hover, .bf-radio-label:hover)::before {
  background: var(--bf-color-background-hover);
}

:where(.bf-theme) :where(.bf-checkbox-label)::after {
  block-size: calc(var(--bf-control-visual-size) * 0.35);
  border-bottom: calc(var(--bf-border-width) * 2) solid var(--bf-color-background-default);
  border-left: calc(var(--bf-border-width) * 2) solid var(--bf-color-background-default);
  inline-size: calc(var(--bf-control-visual-size) * 0.6);
  inset-inline-start: calc(var(--bf-control-visual-size) * 0.2);
  inset-block-start: calc(var(--bf-tick-box-offset) + (var(--bf-control-visual-size) * 0.18) + (var(--bf-border-width) * 2));
  opacity: 0;
  transform: rotate(-45deg);
}

:where(.bf-theme) :where(.bf-radio-label)::before {
  border-radius: 50%;
}

:where(.bf-theme) :where(.bf-radio-label)::after {
  background: var(--bf-color-background-default);
  block-size: var(--bf-radio-dot-size);
  border-radius: 50%;
  inline-size: var(--bf-radio-dot-size);
  inset-inline-start: calc((var(--bf-control-visual-size) - var(--bf-radio-dot-size)) * 0.5);
  inset-block-start: calc(var(--bf-tick-box-offset) + ((var(--bf-control-visual-size) - var(--bf-radio-dot-size)) * 0.5));
  opacity: 0;
}

:where(.bf-theme) :where(.bf-checkbox-input:checked + .bf-checkbox-label)::before {
  background: var(--bf-color-link-default);
  border-color: var(--bf-color-link-default);
}

:where(.bf-theme) :where(.bf-checkbox-input:checked + .bf-checkbox-label)::after {
  opacity: 1;
}

:where(.bf-theme) :where(.bf-radio-input:checked + .bf-radio-label)::before {
  background: var(--bf-color-link-default);
  border-color: var(--bf-color-link-default);
}

:where(.bf-theme) :where(.bf-radio-input:checked + .bf-radio-label)::after {
  opacity: 1;
}

:where(.bf-theme) :where(.bf-checkbox-input:focus-visible + .bf-checkbox-label)::before {
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: 0.125rem;
}

:where(.bf-theme) :where(.bf-radio-input:focus-visible + .bf-radio-label)::before {
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: 0.125rem;
}

:where(.bf-theme) :where(.bf-switch) {
  align-items: flex-start;
  display: inline-flex;
  gap: var(--bf-field-gap);
  position: relative;
}

:where(.bf-theme) :where(.bf-switch-input) {
  block-size: var(--bf-control-visual-size);
  inline-size: calc(var(--bf-control-visual-size) * 2);
  inset-block-start: var(--bf-switch-track-offset);
  inset-inline-start: 0;
  margin: 0;
  opacity: 0;
  position: absolute;
}

:where(.bf-theme) :where(.bf-switch-slider) {
  background: var(--bf-color-border-high-contrast);
  block-size: var(--bf-control-visual-size);
  border-radius: var(--bf-control-visual-size);
  display: inline-block;
  flex: none;
  inline-size: calc(var(--bf-control-visual-size) * 2);
  margin-block-start: var(--bf-switch-track-offset);
  position: relative;
}

:where(.bf-theme) :where(.bf-switch-slider)::before {
  background: var(--bf-color-background-default);
  block-size: var(--bf-control-visual-size);
  box-sizing: border-box;
  border: var(--bf-border-width) solid var(--bf-color-border-high-contrast);
  border-radius: 50%;
  content: "";
  inline-size: var(--bf-control-visual-size);
  inset-block-start: 0;
  inset-inline-start: 0;
  position: absolute;
  transition: transform 160ms ease;
}

:where(.bf-theme) :where(.bf-switch-input:checked + .bf-switch-slider) {
  background: var(--bf-color-link-default);
}

:where(.bf-theme) :where(.bf-switch-input:checked + .bf-switch-slider)::before {
  border-color: var(--bf-color-link-default);
  transform: translateX(100%);
}

:where(.bf-theme) :where(.bf-switch-input:focus-visible + .bf-switch-slider) {
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: 0.125rem;
}

:where(.bf-theme) :where(.bf-switch-input:disabled + .bf-switch-slider) {
  opacity: 0.6;
}

:where(.bf-theme) :where(.bf-switch-label) {
${typeStyles(body, { includeCase: false })}  color: var(--bf-color-text-default);
  border-block: var(--bf-border-width) solid transparent;
  cursor: pointer;
  display: inline-block;
  margin: 0 0 var(--bf-interface-row-compensation-block-end);
  padding-block: var(--bf-interface-row-padding-block);
}

:where(.bf-theme) :where(.bf-validation-message) {
${typeStyles(body, { includeCase: false })}  border-block: var(--bf-border-width) solid transparent;
  color: var(--bf-color-text-muted);
  margin: 0 0 var(--bf-interface-row-compensation-block-end);
  margin-inline-start: var(--bf-leading-mark-group-inset);
  padding-block: var(--bf-interface-row-padding-block);
  padding-inline-start: var(--bf-leading-mark-offset);
  position: relative;
}

:where(.bf-theme) :where(.bf-validation-message)::before {
  background: var(--bf-color-border-information);
  block-size: calc(var(--bf-control-visual-size) * 0.5);
  border-radius: 50%;
  content: "";
  inline-size: calc(var(--bf-control-visual-size) * 0.5);
  inset-block-start: ${alignedVisualStart(bodyLineHeight, "(var(--bf-control-visual-size) * 0.5)", bodySelectedStartNudge)};
  inset-inline-start: 0;
  position: absolute;
}

:where(.bf-theme) :where(.is-caution, .bf-validation.is-caution) :where(.bf-input, input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select) {
  background-color: var(--bf-color-background-caution-default);
  border-bottom-color: var(--bf-color-border-caution);
}

:where(.bf-theme) :where(.is-caution, .bf-validation.is-caution) :where(.bf-input, input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select):hover {
  background-color: var(--bf-color-background-caution-hover);
}

:where(.bf-theme) :where(.is-caution, .bf-validation.is-caution) :where(.bf-input, input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select):focus-visible {
  background-color: var(--bf-color-background-caution-active);
}

:where(.bf-theme) :where(.is-caution, .bf-validation.is-caution) :where(.bf-validation-message) {
  color: var(--bf-color-border-caution);
}

:where(.bf-theme) :where(.is-caution, .bf-validation.is-caution) :where(.bf-validation-message)::before {
  background: var(--bf-color-border-caution);
}

:where(.bf-theme) :where(.is-error, .bf-validation.is-error) :where(.bf-input, input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select) {
  background-color: var(--bf-color-background-negative-default);
  border-bottom-color: var(--bf-color-border-negative);
}

:where(.bf-theme) :where(.is-error, .bf-validation.is-error) :where(.bf-input, input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select):hover {
  background-color: var(--bf-color-background-negative-hover);
}

:where(.bf-theme) :where(.is-error, .bf-validation.is-error) :where(.bf-input, input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select):focus-visible {
  background-color: var(--bf-color-background-negative-active);
}

:where(.bf-theme) :where(.is-error, .bf-validation.is-error) :where(.bf-validation-message) {
  color: var(--bf-color-border-negative);
}

:where(.bf-theme) :where(.is-error, .bf-validation.is-error) :where(.bf-validation-message)::before {
  background: var(--bf-color-border-negative);
}

:where(.bf-theme) :where(.is-success, .bf-validation.is-success) :where(.bf-input, input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select) {
  background-color: var(--bf-color-background-positive-default);
  border-bottom-color: var(--bf-color-border-positive);
}

:where(.bf-theme) :where(.is-success, .bf-validation.is-success) :where(.bf-input, input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select):hover {
  background-color: var(--bf-color-background-positive-hover);
}

:where(.bf-theme) :where(.is-success, .bf-validation.is-success) :where(.bf-input, input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select):focus-visible {
  background-color: var(--bf-color-background-positive-active);
}

:where(.bf-theme) :where(.is-success, .bf-validation.is-success) :where(.bf-validation-message) {
  color: var(--bf-color-border-positive);
}

:where(.bf-theme) :where(.is-success, .bf-validation.is-success) :where(.bf-validation-message)::before {
  background: var(--bf-color-border-positive);
}

:where(.bf-theme) :where(.bf-slider) {
  align-items: flex-start;
  display: inline-flex;
  flex-wrap: nowrap;
  gap: var(--bf-field-gap);
  inline-size: 100%;
  max-inline-size: 100%;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-slider.is-stacked),
:where(.bf-theme) :where(.bf-field.is-range.is-stacked) :where(.bf-slider) {
  align-items: stretch;
  display: grid;
  gap: var(--bf-field-gap);
  grid-template-columns: minmax(0, 1fr);
}

:where(.bf-theme) :where(.bf-slider) :where(input[type='range']) {
  align-self: flex-start;
  flex: 1 1 8rem;
  inline-size: 100%;
  min-inline-size: 0;
}

:where(.bf-theme) :where(input[type='range']) {
  appearance: none;
  background: linear-gradient(
    to right,
    var(--bf-color-link-default) 0,
    var(--bf-color-link-default) var(--bf-slider-fill-percent, 0%),
    var(--bf-color-border-default) var(--bf-slider-fill-percent, 0%),
    var(--bf-color-border-default) 100%
  );
  block-size: var(--bf-slider-track-size);
  border: 0;
  border-radius: var(--bf-baseline);
  margin: var(--bf-slider-track-offset) 0 calc(var(--bf-slider-row-block-size) - var(--bf-slider-track-offset) - var(--bf-slider-track-size));
  padding: 0;
}

/* A composite slider's numeric field owns the shared occupied row. Stretching
   the track within that real sibling height avoids a second nominal-height
   calculation that can diverge when rem borders are rasterised under zoom. */
:where(.bf-theme) :where(.bf-slider:not(.is-stacked)):not(:where(.bf-field.is-range.is-stacked) :where(.bf-slider)) > :where(input[type='range']) {
  align-self: stretch;
  block-size: auto;
  margin-block: 0;
}

:where(.bf-theme) :where(input[type='range']):focus:not(:focus-visible) {
  outline: none;
}

:where(.bf-theme) :where(input[type='range'])::-webkit-slider-runnable-track {
  background: transparent;
  block-size: var(--bf-slider-track-size);
  border-radius: var(--bf-baseline);
}

:where(.bf-theme) :where(input[type='range'])::-webkit-slider-thumb {
  appearance: none;
  background: var(--bf-color-background-default);
  border: var(--bf-border-width) solid var(--bf-color-border-high-contrast);
  block-size: var(--bf-control-visual-size);
  border-radius: 50%;
  box-shadow: 0 0 calc(var(--bf-control-visual-size) * 0.25) 0.0625rem rgba(0, 0, 0, 0.2);
  inline-size: var(--bf-control-visual-size);
  margin-top: calc((var(--bf-slider-track-size) - var(--bf-control-visual-size)) / 2);
}

:where(.bf-theme) :where(input[type='range']):focus-visible::-webkit-slider-thumb {
  outline: calc(var(--bf-baseline) * 0.25) solid var(--bf-color-focus);
}

:where(.bf-theme) :where(input[type='range'])::-moz-range-track {
  background: var(--bf-color-border-default);
  block-size: var(--bf-slider-track-size);
  border-radius: var(--bf-baseline);
}

:where(.bf-theme) :where(input[type='range'])::-moz-range-progress {
  background: var(--bf-color-link-default);
  block-size: var(--bf-slider-track-size);
  border-radius: var(--bf-baseline);
}

:where(.bf-theme) :where(input[type='range'])::-moz-range-thumb {
  background: var(--bf-color-background-default);
  border: var(--bf-border-width) solid var(--bf-color-border-high-contrast);
  block-size: var(--bf-control-visual-size);
  border-radius: 50%;
  box-shadow: 0 0 calc(var(--bf-control-visual-size) * 0.25) 0.0625rem rgba(0, 0, 0, 0.2);
  inline-size: var(--bf-control-visual-size);
}

:where(.bf-theme) :where(input[type='range'])::-moz-focus-outer {
  border: 0;
}

:where(.bf-theme) :where(input[type='range']):focus-visible::-moz-range-thumb {
  outline: calc(var(--bf-baseline) * 0.25) solid var(--bf-color-focus);
}

${iconCss()}

${buttonActionsCss({ bodyTypeStyles, buttonMarginBottom, buttonPadding })}

${nestedControlsCss()}

${ctaFigureAspectCss()}

${editorialContentCss({ noticeTitleTypeStyles: typeStyles(h4, { includeCase: false }) })}

${staticContentPortsCss()}

${interactiveFeedbackCss()}

${interactiveTablesCss()}

${logoMediaCss()}

${linkedLogoSiteLayoutCss()}

${sitesFoundationCss()}

${sitesEditorialPortsCss()}

${sitesRichListsCss()}

${panelCss({
  bodyTypeStyles,
  h4TypeStyles: typeStyles(h4, { includeCase: false })
})}

${cardsOptionsCss({
  bodyStrongTypeStyles: typeStyles(body, { fontWeight: 600, includeCase: false }),
  bodyTypeStyles
})}

${contentCardCss()}

${tabsChoiceBreadcrumbsCss({
  bodyCaseTypeStyles: typeStyles(body),
  bodyStrongTypeStyles: typeStyles(body, { fontWeight: 600, includeCase: false }),
  bodyTypeStyles,
  buttonMarginBottom,
  buttonPadding,
})}

${tabSectionCss()}

${articlePaginationCss({
  bodyCaseTypeStyles: typeStyles(body),
  titleTypeStyles: typeStyles(h5, { includeCase: false })
})}

${listCss({ bodyTypeStyles })}

:where(.bf-theme) :where(.bf-skip-link) {
${typeStyles(body, { includeCase: false })}  background: var(--bf-color-background-alt);
  color: var(--bf-color-link-default);
  display: block;
  inset-inline-start: -62.4375rem;
  max-inline-size: calc(100vw - (var(--bf-inline-unit) * 2));
  position: absolute;
  text-decoration: none;
  top: -62.4375rem;
}

:where(.bf-theme) :where(.bf-skip-link:hover) {
  text-decoration: underline;
}

:where(.bf-theme) :where(.bf-skip-link:focus, .bf-skip-link:focus-visible) {
  inset-inline-start: var(--bf-inline-unit);
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: 0;
  padding-block: calc(var(--bf-baseline) * 1.5);
  padding-inline: var(--bf-component-inline-inset-action);
  position: fixed;
  top: calc(var(--bf-baseline) * 0.5);
  z-index: 999999;
}

${tableCss({
  bodyLineHeight,
  bodyMediumTypeStyles: typeStyles(body, { fontWeight: 500, includeCase: false }),
  bodyTypeStyles,
})}

${chipBadgeStatusCss({
  bodyCaseTypeStyles: typeStyles(body),
  bodyTypeStyles,
})}

:where(.bf-theme) :where(.bf-chip-dismiss, .bf-search-box-reset, .bf-search-and-filter-clear) {
  appearance: none;
  background: transparent;
  border: 0;
  color: var(--bf-color-text-default);
  cursor: pointer;
  flex: 0 0 auto;
  margin: 0;
  padding: 0;
  position: relative;
  text-indent: -624.9375rem;
}

:where(.bf-theme) :where(.bf-chip-dismiss) {
  block-size: 1rem;
  inline-size: 1rem;
  margin-inline-start: var(--bf-ui-badge-padding-inline);
}

:where(.bf-theme) :where(.bf-chip-dismiss, .bf-search-box-reset, .bf-search-and-filter-clear)::before,
:where(.bf-theme) :where(.bf-chip-dismiss, .bf-search-box-reset, .bf-search-and-filter-clear)::after {
  background: currentColor;
  block-size: 0.125rem;
  content: "";
  inline-size: 0.75rem;
  left: 50%;
  position: absolute;
  top: 50%;
}

:where(.bf-theme) :where(.bf-chip-dismiss, .bf-search-box-reset, .bf-search-and-filter-clear)::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

:where(.bf-theme) :where(.bf-chip-dismiss, .bf-search-box-reset, .bf-search-and-filter-clear)::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}


${searchBoxAndFilterCss({
  bodySelectedStartNudge,
  bodyTypeStyles,
  inputMarginBottom,
})}

${controlRowCss()}

${listTreeCss({ bodyTypeStyles })}

${legacyNavigationCss({
  bodyMediumTypeStyles: typeStyles(body, { fontWeight: 500, includeCase: false }),
  bodySemiboldTypeStyles: typeStyles(body, { fontWeight: 600, includeCase: false }),
  bodyTypeStyles,
  buttonMarginBottom,
  buttonPadding
})}

:where(.bf-theme) :where(.bf-contextual-menu, .bf-contextual-menu.is-left, .bf-contextual-menu.is-center) {
  display: inline-block;
  margin: 0;
  position: relative;
  vertical-align: top;
}

:where(.bf-theme) :where(.bf-contextual-menu-dropdown) {
  background: var(--bf-color-background-default);
  border: var(--bf-border-width) solid var(--bf-color-border-default);
  box-shadow: 0 0.75rem 2rem rgba(0, 0, 0, 0.28);
  display: none;
  list-style: none;
  margin: 0;
  max-inline-size: 21rem;
  min-inline-size: 10rem;
  padding: 0;
  position: absolute;
  right: 0;
  top: calc(100% - var(--bf-border-width));
  width: fit-content;
  z-index: 9;
}

:where(.bf-theme) :where(.bf-contextual-menu-dropdown[aria-hidden='false']) {
  display: block;
}

:where(.bf-theme) :where(.bf-contextual-menu.is-left) :where(.bf-contextual-menu-dropdown) {
  left: 0;
  right: auto;
}

:where(.bf-theme) :where(.bf-contextual-menu.is-center) :where(.bf-contextual-menu-dropdown) {
  left: 50%;
  right: auto;
  transform: translateX(-50%);
}

:where(.bf-theme) :where(.bf-contextual-menu-group) {
  display: block;
}

:where(.bf-theme) :where(.bf-contextual-menu-group) + :where(.bf-contextual-menu-group) {
  box-shadow: inset 0 0.0625rem 0 var(--bf-color-border-default);
}

:where(.bf-theme) :where(.bf-contextual-menu-link) {
${typeStyles(body, { includeCase: false })}  background: transparent;
  border: 0;
  clear: both;
  color: var(--bf-color-text-default);
  cursor: pointer;
  display: block;
  margin: 0;
  overflow: hidden;
  padding-block-end: var(--bf-in-box-row-padding-block-end);
  padding-block-start: var(--bf-in-box-row-padding-block-start);
  padding-inline: var(--bf-component-inline-inset-action);
  text-align: left;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

:where(.bf-theme) :where(.bf-contextual-menu-link):visited {
  color: var(--bf-color-text-default);
}

:where(.bf-theme) :where(.bf-contextual-menu-link):hover {
  background: var(--bf-color-background-hover);
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-contextual-menu-link):active {
  background: var(--bf-color-background-active);
}

:where(.bf-theme) :where(.bf-contextual-menu-link):focus:not(:focus-visible) {
  outline: none;
}

:where(.bf-theme) :where(.bf-contextual-menu-link):focus-visible {
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: -0.125rem;
}

:where(.bf-theme) :where(.bf-contextual-menu-link.is-disabled, .bf-contextual-menu-link[disabled]) {
  color: var(--bf-color-text-muted);
  cursor: default;
  pointer-events: none;
}

:where(.bf-theme) :where(.bf-tooltip) {
  --bf-tooltip-arrow-size: calc(var(--bf-baseline) * 0.5);
  --bf-tooltip-arrow-offset-inline: calc(var(--bf-tooltip-arrow-size) * 1.5);
  display: inline-flex;
  position: relative;
  text-decoration: inherit;
}

:where(.bf-theme) :where(.bf-tooltip.is-detached) {
  display: inline-grid;
  gap: var(--bf-field-gap);
  position: relative;
}

:where(.bf-theme) :where(.bf-tooltip-message) {
${typeStyles(body, { includeCase: false })}  background-color: var(--bf-color-background-alt);
  box-shadow: inset 0 0 0 var(--bf-border-width) var(--bf-color-border-default), 0 0.75rem 2rem rgba(0, 0, 0, 0.24);
  color: var(--bf-color-text-default);
  inline-size: max-content;
  inset-inline-start: 0;
  margin: 0;
  max-inline-size: min(20rem, calc(100vw - (var(--bf-baseline) * 4)));
  opacity: 0;
  padding-block-end: ${bodySelectedEndNudge};
  padding-block-start: ${bodySelectedStartNudge};
  padding-inline: var(--bf-component-inline-inset-continuation);
  pointer-events: none;
  position: absolute;
  top: 100%;
  transform: translateY(calc(var(--bf-baseline) - var(--bf-border-width)));
  visibility: hidden;
  white-space: normal;
  z-index: 12;
}

:where(.bf-theme) :where(.bf-tooltip):is(:hover, :focus-within) > :where(.bf-tooltip-message),
:where(.bf-theme) :where(.bf-tooltip.is-detached) > :where(.bf-tooltip-message) {
  opacity: 1;
  visibility: visible;
}

:where(.bf-theme) :where(.bf-tooltip-message)::before {
  block-size: 0;
  border-bottom: var(--bf-tooltip-arrow-size) solid var(--bf-color-background-alt);
  border-inline: var(--bf-tooltip-arrow-size) solid transparent;
  bottom: 100%;
  content: "";
  inline-size: 0;
  inset-inline-start: var(--bf-tooltip-arrow-offset-inline);
  position: absolute;
}

:where(.bf-theme) :where(.bf-tooltip.is-detached) > :where(.bf-tooltip-message) {
  inset-inline-start: auto;
  pointer-events: auto;
  position: static;
  top: auto;
  transform: none;
}

:where(.bf-theme) :where(.bf-tooltip.is-detached) > :where(.bf-tooltip-message)::before {
  content: none;
}

:where(.bf-theme) :where(.bf-tooltip.is-btm-center) > :where(.bf-tooltip-message) {
  inset-inline-start: 50%;
  transform: translate(-50%, calc(var(--bf-baseline) - var(--bf-border-width)));
}

:where(.bf-theme) :where(.bf-tooltip.is-btm-center) > :where(.bf-tooltip-message)::before {
  inset-inline-start: 50%;
  transform: translateX(-50%);
}

:where(.bf-theme) :where(.bf-tooltip.is-btm-right) > :where(.bf-tooltip-message) {
  inset-inline-end: 0;
  inset-inline-start: auto;
}

:where(.bf-theme) :where(.bf-tooltip.is-btm-right) > :where(.bf-tooltip-message)::before {
  inset-inline-end: var(--bf-tooltip-arrow-offset-inline);
  inset-inline-start: auto;
}

:where(.bf-theme) :where(.bf-tooltip.is-top-left, .bf-tooltip.is-top-center, .bf-tooltip.is-top-right) > :where(.bf-tooltip-message) {
  bottom: 100%;
  top: auto;
  transform: translateY(calc(var(--bf-baseline) * -1));
}

:where(.bf-theme) :where(.bf-tooltip.is-top-left, .bf-tooltip.is-top-center, .bf-tooltip.is-top-right) > :where(.bf-tooltip-message)::before {
  border-bottom: 0;
  border-inline: var(--bf-tooltip-arrow-size) solid transparent;
  border-top: var(--bf-tooltip-arrow-size) solid var(--bf-color-background-alt);
  bottom: auto;
  top: 100%;
}

:where(.bf-theme) :where(.bf-tooltip.is-top-center) > :where(.bf-tooltip-message) {
  inset-inline-start: 50%;
  transform: translate(-50%, calc(var(--bf-baseline) * -1));
}

:where(.bf-theme) :where(.bf-tooltip.is-top-center) > :where(.bf-tooltip-message)::before {
  inset-inline-start: 50%;
  transform: translateX(-50%);
}

:where(.bf-theme) :where(.bf-tooltip.is-top-right) > :where(.bf-tooltip-message) {
  inset-inline-end: 0;
  inset-inline-start: auto;
}

:where(.bf-theme) :where(.bf-tooltip.is-top-right) > :where(.bf-tooltip-message)::before {
  inset-inline-end: var(--bf-tooltip-arrow-offset-inline);
  inset-inline-start: auto;
}

:where(.bf-theme) :where(nav.bf-pagination) {
  display: block;
}

:where(.bf-theme) :where(.bf-pagination-items) {
  align-items: flex-start;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--bf-field-gap);
  list-style: none;
  margin: 0;
  min-inline-size: 0;
  padding: 0;
}

:where(.bf-theme) :where(.bf-pagination-item) {
  align-items: flex-start;
  display: flex;
  margin: 0;
  min-inline-size: 0;
  padding: 0;
}

:where(.bf-theme) :where(.bf-pagination-item.is-truncation) {
${typeStyles(body, { includeCase: false })}  color: var(--bf-color-text-muted);
  border-block: var(--bf-border-width) solid transparent;
  margin-block-end: var(--bf-interface-row-compensation-block-end);
  padding-block: var(--bf-interface-row-padding-block);
  padding-inline: var(--bf-inline-unit);
}

:where(.bf-theme) :where(.bf-pagination-link, .bf-pagination-link.is-previous, .bf-pagination-link.is-next) {
${typeStyles(body, { includeCase: false })}  align-items: center;
  background-color: var(--bf-color-background-default);
  border: var(--bf-border-width) solid var(--bf-color-border-high-contrast);
  border-radius: var(--bf-radius);
  color: var(--bf-color-text-default);
  cursor: pointer;
  display: inline-flex;
  gap: var(--bf-leading-mark-gap);
  justify-content: center;
  margin-bottom: ${buttonMarginBottom};
  padding-block: var(--bf-interface-row-padding-block);
  padding-inline: var(--bf-component-inline-inset-action-bordered);
  text-align: center;
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-pagination-link:not(.is-previous):not(.is-next)) {
  min-inline-size: var(--bf-square-block-size);
  padding-inline: 0;
}

:where(.bf-theme) :where(.bf-pagination-link:hover, .bf-pagination-link.is-previous:hover, .bf-pagination-link.is-next:hover) {
  background-color: var(--bf-color-background-hover);
}

:where(.bf-theme) :where(.bf-pagination-link:focus:not(:focus-visible), .bf-pagination-link.is-previous:focus:not(:focus-visible), .bf-pagination-link.is-next:focus:not(:focus-visible)) {
  outline: none;
}

:where(.bf-theme) :where(.bf-pagination-link:focus-visible, .bf-pagination-link.is-previous:focus-visible, .bf-pagination-link.is-next:focus-visible) {
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: 0.125rem;
}

:where(.bf-theme) :where(.bf-pagination-link.is-active, .bf-pagination-link[aria-current='page'], .bf-pagination-link[aria-current='true']) {
  background-color: var(--bf-color-background-active);
}

:where(.bf-theme) :where(.bf-pagination-link.is-previous, .bf-pagination-link.is-next)::before,
:where(.bf-theme) :where(.bf-pagination-link.is-previous, .bf-pagination-link.is-next)::after {
  background-image: var(--bf-ui-icon-chevron-down);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
  block-size: 1rem;
  content: "";
  display: inline-block;
  inline-size: 1rem;
}

:where(.bf-theme) :where(.bf-pagination-link.is-previous)::before {
  transform: rotate(90deg);
}

:where(.bf-theme) :where(.bf-pagination-link.is-previous)::after {
  display: none;
}

:where(.bf-theme) :where(.bf-pagination-link.is-next)::after {
  transform: rotate(-90deg);
}

:where(.bf-theme) :where(.bf-pagination-link.is-next)::before {
  display: none;
}

:where(.bf-theme) :where(.bf-pagination-link.is-disabled, .bf-pagination-link.is-previous.is-disabled, .bf-pagination-link.is-next.is-disabled, .bf-pagination-link[aria-disabled='true'], .bf-pagination-link.is-previous[aria-disabled='true'], .bf-pagination-link.is-next[aria-disabled='true']) {
  cursor: not-allowed;
  opacity: 0.5;
  pointer-events: none;
}

:where(.bf-theme) :where(.bf-accordion) {
  display: grid;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-accordion-list) {
  list-style: none;
  margin: 0;
  padding: 0;
}

:where(.bf-theme) :where(.bf-accordion-group) {
  position: relative;
}

:where(.bf-theme) :where(.bf-accordion-group) + :where(.bf-accordion-group)::after {
  background-color: var(--bf-color-border-default);
  block-size: var(--bf-border-width);
  content: "";
  inset-inline: 0;
  position: absolute;
  top: 0;
}

:where(.bf-theme) :where(.bf-accordion-heading) {
  margin-bottom: 0;
}

:where(.bf-theme) :where(.bf-accordion-tab) {
${typeStyles(body, { includeCase: false })}  align-items: center;
  appearance: none;
  background: transparent;
  border: 0;
  border-block: var(--bf-border-width) solid transparent;
  color: var(--bf-color-text-default);
  cursor: pointer;
  display: flex;
  gap: var(--bf-disclosure-gap);
  inline-size: 100%;
  justify-content: flex-start;
  margin-block-end: var(--bf-interface-row-compensation-block-end);
  padding-block: var(--bf-interface-row-padding-block);
  padding-inline: var(--bf-disclosure-group-inset) 0;
  text-align: left;
}

:where(.bf-theme) :where(.bf-accordion-tab):focus:not(:focus-visible) {
  outline: none;
}

:where(.bf-theme) :where(.bf-accordion-tab):focus-visible {
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: 0.125rem;
}

:where(.bf-theme) :where(.bf-accordion-tab)::before {
  background-image: var(--bf-ui-icon-chevron-down);
  background-position: center;
  background-repeat: no-repeat;
  background-size: var(--bf-disclosure-icon-inline-size) var(--bf-disclosure-icon-inline-size);
  block-size: var(--bf-disclosure-icon-inline-size);
  content: "";
  display: inline-block;
  flex: none;
  inline-size: var(--bf-disclosure-icon-inline-size);
  transform: translateY(var(--bf-disclosure-icon-optical-offset-block));
  transition: transform 120ms ease;
}

:where(.bf-theme) :where(.bf-accordion-tab[aria-expanded='false'])::before {
  transform: translateY(var(--bf-disclosure-icon-optical-offset-block)) rotate(-90deg);
}

:where(.bf-theme) :where(.bf-accordion-panel) {
  margin: 0;
  overflow: hidden;
  padding-block-start: var(--bf-baseline);
  padding-inline-start: var(--bf-component-inline-inset-continuation);
}

:where(.bf-theme) :where(.bf-accordion-panel[aria-hidden='true']) {
  block-size: 0;
  opacity: 0;
  padding-block-start: 0;
  visibility: hidden;
}

:where(.bf-theme) :where(.bf-accordion-panel[aria-hidden='false']) {
  block-size: auto;
  opacity: 1;
  visibility: visible;
}

:where(.bf-theme) :where(.bf-modal) {
  background: transparent;
  border: 0;
  inset: 0;
  margin: auto;
  max-inline-size: min(100vw - (var(--bf-baseline) * 8), 36rem);
  padding: 0;
}

:where(.bf-theme) :where(.bf-modal.is-workflow) {
  --bf-modal-workflow-viewport-gap: var(--bf-component-inline-inset-continuation);
  --bf-modal-workflow-max-inline-size: 42rem;
  --bf-modal-workflow-min-inline-size: 32rem;
  --bf-modal-workflow-max-block-size: 40rem;
  --bf-modal-workflow-min-block-size: 24rem;
  block-size: min(calc(100dvh - var(--bf-modal-workflow-viewport-gap)), var(--bf-modal-workflow-max-block-size));
  inline-size: min(calc(100vw - var(--bf-modal-workflow-viewport-gap)), var(--bf-modal-workflow-max-inline-size));
  max-block-size: calc(100dvh - var(--bf-modal-workflow-viewport-gap));
  max-inline-size: calc(100vw - var(--bf-modal-workflow-viewport-gap));
  min-block-size: min(calc(100dvh - var(--bf-modal-workflow-viewport-gap)), var(--bf-modal-workflow-min-block-size));
  min-inline-size: min(calc(100vw - var(--bf-modal-workflow-viewport-gap)), var(--bf-modal-workflow-min-inline-size));
  overflow: hidden;
}

:where(.bf-theme) :where(.bf-modal.is-workflow.is-resizable) {
  resize: both;
}

:where(.bf-theme) :where(.bf-modal)::backdrop {
  background: var(--bf-color-background-overlay);
}

:where(.bf-theme) :where(.bf-modal-dialog) {
  background: var(--bf-color-background-default);
  border: var(--bf-border-width) solid var(--bf-color-border-default);
  display: grid;
  gap: 0;
}

:where(.bf-theme) :where(.bf-modal.is-workflow > .bf-modal-dialog) {
  block-size: 100%;
  grid-template-rows: auto minmax(0, 1fr) auto;
  inline-size: 100%;
  min-block-size: 0;
  overflow: hidden;
}

:where(.bf-theme) :where(.bf-modal-header, .bf-modal-body, .bf-modal-footer) {
  padding-block-end: calc(var(--bf-panel-padding-block) - var(--bf-border-width));
  padding-block-start: calc(var(--bf-panel-padding-block) - var(--bf-border-width));
  padding-inline: var(--bf-panel-padding-inline);
}

:where(.bf-theme) :where(.bf-modal-header) {
  align-items: start;
  border-bottom: var(--bf-border-width) solid var(--bf-color-border-default);
  display: flex;
  gap: var(--bf-field-gap);
  justify-content: space-between;
}

:where(.bf-theme) :where(.bf-modal-body) {
  padding-block-end: var(--bf-panel-padding-block);
  padding-block-start: var(--bf-panel-padding-block);
}

:where(.bf-theme) :where(.bf-modal.is-workflow) :where(.bf-modal-header, .bf-modal-footer) {
  background: var(--bf-color-background-default);
}

:where(.bf-theme) :where(.bf-modal.is-workflow) :where(.bf-modal-body) {
  min-block-size: 0;
  overflow: auto;
  overscroll-behavior: contain;
}

:where(.bf-theme) :where(.bf-modal-title) {
${typeStyles(h4, { includeCase: false })}  margin: 0 0 var(--bf-h4-margin-bottom);
  padding-block-end: 0;
  padding-block-start: var(--bf-h4-nudge-start);
}

:where(.bf-theme) :where(.bf-modal-footer) {
  align-items: start;
  border-top: var(--bf-border-width) solid var(--bf-color-border-default);
  display: flex;
  flex-wrap: wrap;
  gap: var(--bf-field-gap);
  justify-content: flex-end;
}

:where(.bf-theme) :where(.bf-modal-close) {
${typeStyles(body, { includeCase: false })}  appearance: none;
  background: transparent;
  border: 0;
  color: var(--bf-color-text-default);
  cursor: pointer;
  padding: 0;
}

:where(.bf-theme) :where(.bf-code-snippet) {
  display: grid;
  gap: 0;
  margin: 0;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-code-snippet.is-bordered) {
  box-shadow: inset 0 0 0 var(--bf-border-width) var(--bf-color-border-default);
}

:where(.bf-theme) :where(.bf-code-snippet-header) {
  align-items: start;
  background: var(--bf-color-background-active);
  box-shadow: inset 0 -0.0625rem 0 var(--bf-color-border-default);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-code-snippet-header.is-stacked) {
  flex-direction: column;
}

:where(.bf-theme) :where(.bf-code-snippet-title) {
${typeStyles(h6, { includeCase: false })}  color: var(--bf-color-text-default);
  flex: 1 1 14rem;
  margin: 0;
  overflow-wrap: anywhere;
  padding-block: var(--bf-panel-padding-block);
  padding-inline: var(--bf-component-inline-inset-continuation);
}

:where(.bf-theme) :where(.bf-code-snippet-dropdowns) {
  display: flex;
  flex: 1 0 auto;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-inline-start: auto;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-code-snippet-header.is-stacked) :where(.bf-code-snippet-dropdowns) {
  justify-content: stretch;
  margin-inline-start: 0;
  box-shadow: inset 0 0.0625rem 0 var(--bf-color-border-default);
  width: 100%;
}

:where(.bf-theme) :where(.bf-code-snippet-dropdown) {
${typeStyles(body, { includeCase: false })}  appearance: none;
  background: transparent;
  border: 0;
  color: var(--bf-color-text-default);
  cursor: pointer;
  margin: 0;
  min-block-size: calc(${bodyLineHeight} + (var(--bf-panel-padding-block) * 2));
  min-inline-size: 0;
  padding-block: var(--bf-panel-padding-block);
  padding-inline: var(--bf-component-inline-inset-action);
  text-align: start;
}

:where(.bf-theme) :where(.bf-code-snippet-dropdown) + :where(.bf-code-snippet-dropdown) {
  box-shadow: inset 0.0625rem 0 0 var(--bf-color-border-default);
}

:where(.bf-theme) :where(.bf-code-snippet-dropdown):focus:not(:focus-visible) {
  outline: none;
}

:where(.bf-theme) :where(.bf-code-snippet-dropdown):focus-visible {
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: -0.125rem;
}

:where(.bf-theme) :where(.bf-code-snippet-block, .bf-code-snippet-block.is-icon, .bf-code-snippet-block.is-numbered) {
  background: var(--bf-color-background-alt);
  color: var(--bf-color-text-default);
  display: block;
  font-family: "Ubuntu Sans Mono", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: ${roleFontSizeVar("body", body.fontSize)};
  line-height: ${bodyLineHeight};
  margin: 0;
  max-inline-size: 100%;
  min-inline-size: 0;
  overflow-x: auto;
  padding-block: var(--bf-panel-padding-block);
  padding-inline: var(--bf-component-inline-inset-continuation);
  tab-size: 2;
  white-space: pre;
}

:where(.bf-theme) :where(.bf-code-snippet-block, .bf-code-snippet-block.is-icon, .bf-code-snippet-block.is-numbered) > :where(code) {
  display: block;
  font: inherit;
}

:where(.bf-theme) :where(.bf-code-snippet-block.is-wrapped, .bf-code-snippet-block.is-icon.is-wrapped) {
  white-space: pre-wrap;
}

:where(.bf-theme) :where(.bf-code-snippet-block.is-icon) {
  cursor: copy;
  padding-inline-start: calc(var(--bf-component-inline-inset-continuation) + var(--bf-leading-mark-gap));
  position: relative;
}

:where(.bf-theme) :where(.bf-code-snippet-block.is-icon)::before {
${typeStyles(h6, { includeCase: false })}  color: var(--bf-color-text-muted);
  content: "$";
  inset-inline-start: var(--bf-component-inline-inset-continuation);
  inset-block-start: var(--bf-panel-padding-block);
  position: absolute;
}

:where(.bf-theme) :where(.bf-code-snippet-block.is-icon.is-windows-prompt)::before {
  content: ">";
}

:where(.bf-theme) :where(.bf-code-snippet-block.is-icon.is-url)::before {
  content: "\\1F517";
}

:where(.bf-theme) :where(.bf-code-snippet-block.is-icon.is-copied) {
  background: color-mix(in srgb, var(--bf-color-background-alt) 78%, var(--bf-color-background-information-default));
  box-shadow: inset 0 0 0 0.0625rem var(--bf-color-border-information);
}

:where(.bf-theme) :where(.bf-code-snippet-block.is-icon):focus:not(:focus-visible) {
  outline: none;
}

:where(.bf-theme) :where(.bf-code-snippet-block.is-icon):focus-visible {
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: -0.125rem;
}

:where(.bf-theme) :where(.bf-code-snippet-block.is-numbered) {
  counter-reset: code-line;
}

:where(.bf-theme) :where(.bf-code-snippet-line) {
  counter-increment: code-line;
  display: block;
  min-block-size: ${bodyLineHeight};
}

:where(.bf-theme) :where(.bf-code-snippet-block.is-numbered) :where(.bf-code-snippet-line)::before {
  color: var(--bf-color-text-muted);
  content: counter(code-line);
  display: inline-block;
  font-variant-numeric: tabular-nums;
  min-inline-size: calc(var(--bf-baseline) * 5);
  padding-inline-end: var(--bf-panel-padding-inline);
  text-align: right;
  user-select: none;
}

:where(.bf-theme) :where(.bf-application) {
  background: var(--bf-color-background-default);
  display: grid;
  grid-template-areas:
    "main"
    "aside";
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr) min-content;
  min-block-size: 100%;
  overflow: hidden;
  position: relative;
  width: 100%;
}

:where(.bf-theme) :where(.bf-application.is-fill) {
  block-size: 100dvb;
  max-block-size: 100dvb;
  min-block-size: 100dvb;
}

:where(.bf-theme) :where(.bf-application:has(> .bf-navigation)) {
  grid-template-areas:
    "navigation-bar"
    "main"
    "aside";
  grid-template-rows: min-content minmax(0, 1fr) min-content;
}

:where(.bf-theme) :where(.bf-navigation-bar) {
  background: var(--bf-color-background-alt);
  border-bottom: var(--bf-border-width) solid var(--bf-color-border-low-contrast);
  grid-area: navigation-bar;
  min-block-size: var(--bf-navigation-bar-min-block-size);
  min-inline-size: 0;
  position: relative;
  z-index: 40;
}

/* A responsive application brand occupies the persistent bar only while the
 * full navigation brand is unavailable. The same public tagged-logo contract
 * is used in both locations; state CSS guarantees that only one copy is
 * visible and exposed at a time. */
:where(.bf-theme) :where(.bf-navigation-bar.is-responsive) :where(.bf-panel-header.is-navigation-brand) {
  align-items: start;
  column-gap: var(--bf-leading-mark-gap);
  padding-inline-end: var(--bf-panel-content-padding-inline);
}

:where(.bf-theme) :where(.bf-navigation-bar.is-responsive) {
  margin-block-end: calc(var(--bf-border-width) * -1);
}

:where(.bf-theme) :where(.bf-navigation-bar.is-responsive) :where(.bf-panel-header.is-navigation-brand) > :where(.bf-top-navigation-logo.is-canonical-tagged) {
  flex: 1 1 12rem;
  inline-size: auto;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-application:has(> .bf-navigation:not(.is-collapsed)))
  > :where(.bf-navigation-bar.is-responsive)
  :where(.bf-top-navigation-logo) {
  visibility: hidden;
}

:where(.bf-theme) :where(.bf-navigation) {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  min-block-size: 0;
  min-inline-size: 0;
  pointer-events: none;
  position: relative;
  z-index: 41;
}

:where(.bf-theme) :where(.bf-navigation-overlay) {
  background: var(--bf-color-background-overlay);
  inset: 0;
  opacity: 0;
  pointer-events: none;
  position: fixed;
  transition: opacity 160ms ease, visibility 160ms ease;
  visibility: hidden;
  z-index: 41;
}

:where(.bf-theme) :where(.bf-navigation:not(.is-collapsed)) > :where(.bf-navigation-overlay) {
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
}

:where(.bf-theme) :where(.bf-navigation-drawer) {
  background: var(--bf-color-background-alt);
  block-size: 100dvh;
  border-inline-end: var(--bf-border-width) solid var(--bf-color-border-low-contrast);
  bottom: 0;
  inline-size: min(100%, var(--bf-application-navigation-width));
  left: 0;
  max-inline-size: 100%;
  overflow: auto;
  pointer-events: auto;
  position: fixed;
  top: 0;
  transform: translateX(-100%);
  transition: transform 160ms ease, box-shadow 160ms ease, visibility 160ms ease;
  visibility: hidden;
  z-index: 42;
}

:where(.bf-theme) :where(.bf-navigation:not(.is-collapsed)) > :where(.bf-navigation-drawer) {
  box-shadow: 0 1.5rem 4.5rem rgba(0, 0, 0, 0.38);
  transform: translateX(0);
  visibility: visible;
}

:where(.bf-theme) :where(.bf-navigation.is-collapsed) :where(.is-fading-when-collapsed, .bf-side-navigation-heading, .bf-side-navigation-status) {
  display: none;
}

:where(.bf-theme) :where(.bf-navigation.is-collapsed) :where(.bf-side-navigation-label) {
  block-size: 0.0625rem;
  clip-path: inset(50%);
  inline-size: 0.0625rem;
  max-inline-size: 0.0625rem;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
  position: absolute;
  white-space: nowrap;
}

:where(.bf-theme) :where(.bf-navigation.is-collapsed) :where(.bf-side-navigation-list .bf-side-navigation-list) {
  display: none;
}

:where(.bf-theme) :where(.bf-navigation.is-collapsed) :where(.bf-side-navigation-link, .bf-side-navigation-text) {
  align-items: center;
  justify-content: center;
  padding-inline: var(--bf-component-inline-inset-action);
}

:where(.bf-theme) :where(.bf-navigation.is-collapsed) :where(.bf-side-navigation-list)::after {
  content: none;
}

:where(.bf-theme) :where(.bf-navigation.is-collapsed) :where(.bf-side-navigation-item.is-title > .bf-side-navigation-link, .bf-side-navigation-item.is-title > .bf-side-navigation-text) {
  padding-inline: var(--bf-component-inline-inset-action);
}

:where(.bf-theme) :where(.bf-application:has(> .bf-aside.is-pinned:not(.is-collapsed))) {
  grid-template-areas: "main aside";
  grid-template-columns: minmax(0, 1fr) minmax(0, var(--bf-application-aside-width));
  grid-template-rows: minmax(0, 1fr);
}

:where(.bf-theme) :where(.bf-application:has(> .bf-navigation)):has(> .bf-aside.is-pinned:not(.is-collapsed)) {
  grid-template-areas:
    "navigation-bar navigation-bar"
    "main aside";
  grid-template-columns: minmax(0, 1fr) minmax(0, var(--bf-application-aside-width));
  grid-template-rows: min-content minmax(0, 1fr);
}

:where(.bf-theme) :where(.bf-main) {
  grid-area: main;
  min-block-size: 0;
  min-inline-size: 0;
  overflow: auto;
}

:where(.bf-theme) :where(.bf-application-overlay) {
  background: var(--bf-color-background-overlay);
  inset: 0;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  transition: opacity 160ms ease, visibility 160ms ease;
  visibility: hidden;
  z-index: 20;
}

:where(.bf-theme) :where(.bf-application.is-drawer-expanded) > :where(.bf-application-overlay) {
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
}

:where(.bf-theme) :where(.bf-aside) {
  background: var(--bf-color-background-default);
  border-inline-start: var(--bf-border-width) solid var(--bf-color-border-default);
  grid-area: aside;
  inline-size: 100%;
  min-block-size: 0;
  min-inline-size: 0;
  overflow: auto;
  position: relative;
}

:where(.bf-theme) :where(.bf-aside.is-overlay, .bf-aside.is-drawer) {
  align-self: stretch;
  block-size: auto;
  box-shadow: 0 1.5rem 4.5rem rgba(0, 0, 0, 0.38);
  bottom: 0;
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  inline-size: min(100%, var(--bf-application-aside-width));
  justify-self: end;
  left: auto;
  max-inline-size: 100%;
  min-block-size: 100%;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  transform: translateX(100%);
  transition: transform 160ms ease, visibility 160ms ease, box-shadow 160ms ease;
  visibility: hidden;
  z-index: 30;
}

:where(.bf-theme) :where(.bf-aside.is-overlay.is-icon, .bf-aside.is-drawer.is-icon) {
  inline-size: min(100%, var(--bf-application-drawer-width-icon));
}

:where(.bf-theme) :where(.bf-aside.is-overlay.is-small, .bf-aside.is-drawer.is-small) {
  inline-size: min(100%, var(--bf-application-drawer-width-small-max));
}

:where(.bf-theme) :where(.bf-aside.is-overlay.is-medium, .bf-aside.is-drawer.is-medium) {
  inline-size: min(100%, var(--bf-application-drawer-width-medium-max));
}

:where(.bf-theme) :where(.bf-aside.is-overlay.is-large, .bf-aside.is-drawer.is-large) {
  inline-size: min(100%, var(--bf-application-drawer-width-large));
}

:where(.bf-theme) :where(.bf-application:has(> .bf-aside.is-pinned.is-small)) {
  --bf-application-aside-width: var(--bf-application-drawer-width-small-max);
}

:where(.bf-theme) :where(.bf-application:has(> .bf-aside.is-pinned.is-medium)) {
  --bf-application-aside-width: var(--bf-application-drawer-width-medium);
}

:where(.bf-theme) :where(.bf-application:has(> .bf-aside.is-pinned.is-large)) {
  --bf-application-aside-width: min(var(--bf-application-drawer-width-large), var(--bf-application-drawer-width-medium-max));
}

:where(.bf-theme) :where(.bf-application.is-drawer-expanded) > :where(.bf-aside.is-overlay, .bf-aside.is-drawer),
:where(.bf-theme) :where(.bf-aside.is-overlay.is-open, .bf-aside.is-drawer.is-open) {
  pointer-events: auto;
  transform: translateX(0);
  visibility: visible;
}

:where(.bf-theme) :where(.bf-aside.is-collapsed) {
  display: none;
}

:where(.bf-theme) :where(.bf-aside.is-pinned) {
  display: block;
}

:where(.bf-theme) :where(.bf-aside.is-overlay, .bf-aside.is-drawer) :where(.bf-application-aside-resize-handle) {
  display: none;
}

:where(.bf-theme) :where(.bf-application-aside-resize-handle) {
  background: transparent;
  border: 0;
  cursor: ew-resize;
  display: none;
  inset-block: 0;
  inset-inline-start: calc(var(--bf-inline-unit) * -3);
  outline: none;
  position: absolute;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  width: calc(var(--bf-baseline) * 6);
  z-index: 3;
}

:where(.bf-theme) :where(.bf-application:has(> .bf-aside.is-pinned:not(.is-collapsed)))
  :where(.bf-aside.is-pinned:not(.is-collapsed))
  > :where(.bf-application-aside-resize-handle) {
  display: block;
}

:where(.bf-theme) :where(.bf-application-aside-resize-handle)::after {
  background: transparent;
  border-radius: 62.4375rem;
  content: "";
  inset-block: var(--bf-panel-padding-block);
  inset-inline-start: calc(50% - 0.0625rem);
  opacity: 0.95;
  position: absolute;
  transition: background-color 120ms ease, opacity 120ms ease;
  width: 0.125rem;
}

:where(.bf-theme) :where(.bf-application-aside-resize-handle):hover::after,
:where(.bf-theme) :where(.bf-application-aside-resize-handle):focus-visible::after,
:where(.bf-theme) :where(.bf-application.is-resizing-aside) :where(.bf-application-aside-resize-handle)::after {
  background: var(--bf-application-resize-handle-active);
}

:where(.bf-theme) :where(.bf-application-aside-resize-handle):focus-visible {
  outline: 0.125rem solid var(--bf-application-resize-handle-focus-ring);
  outline-offset: -0.125rem;
}

/* Application navigation becomes persistent at 48rem. Standalone top and
 * document navigation keep their own large-screen contracts. */
@media (min-width: 48rem) {
  :where(.bf-theme) :where(.bf-application:has(> .bf-navigation)) {
    grid-template-areas:
      "navigation-bar navigation-bar"
      "navigation main";
    grid-template-columns: minmax(0, var(--bf-application-navigation-width)) minmax(0, 1fr);
    grid-template-rows: min-content minmax(0, 1fr);
  }

  :where(.bf-theme) :where(.bf-application:has(> .bf-navigation)):has(> .bf-aside.is-pinned:not(.is-collapsed)) {
    grid-template-areas:
      "navigation-bar navigation-bar navigation-bar"
      "navigation main aside";
    grid-template-columns: minmax(0, var(--bf-application-navigation-width)) minmax(0, 1fr) minmax(0, var(--bf-application-aside-width));
  }

  :where(.bf-theme) :where(.bf-application:has(> .bf-navigation:not(.is-collapsed))) > :where(.bf-navigation-bar.is-responsive) {
    block-size: 0;
    border: 0;
    min-block-size: 0;
    overflow: hidden;
    pointer-events: none;
    position: absolute;
    visibility: hidden;
  }

  :where(.bf-theme) :where(.bf-application:has(> .bf-navigation.is-collapsed)) {
    --bf-application-navigation-width: var(--bf-application-navigation-width-collapsed);
  }

  :where(.bf-theme) :where(.bf-navigation.is-collapsed) :where(.bf-navigation-drawer > .bf-panel > .bf-panel-header) {
    display: none;
  }

  :where(.bf-theme) :where(.bf-navigation) {
    grid-area: navigation;
    pointer-events: auto;
  }

  :where(.bf-theme) :where(.bf-navigation-overlay) {
    display: none;
  }

  :where(.bf-theme) :where(.bf-application) :where(.bf-side-navigation-toggle) {
    display: none;
  }

  :where(.bf-theme) :where(.bf-navigation-drawer),
  :where(.bf-theme) :where(.bf-navigation:not(.is-collapsed)) > :where(.bf-navigation-drawer) {
    block-size: 100%;
    box-shadow: none;
    inline-size: 100%;
    min-block-size: 0;
    position: static;
    transform: translateX(0);
    visibility: visible;
  }

  :where(.bf-theme) :where(.bf-navigation.is-pinned) {
    position: sticky;
    top: 0;
  }
}

${navigationLayoutCss()}

${documentNavigationCss({
  bodyCaseTypeStyles: typeStyles(body),
  bodyTypeStyles,
  headingTypeStyles: typeStyles(h6, { includeCase: false })
})}

${tieredListEqualHeightRowCss()}
`;
}
