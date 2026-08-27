import { buttonActionsCss } from "./css-components/button-actions.js";
import { articlePaginationCss } from "./css-components/article-pagination.js";
import { cardsOptionsCss } from "./css-components/cards-options.js";
import { chipBadgeStatusCss } from "./css-components/chip-badge-status.js";
import { ctaFigureAspectCss } from "./css-components/cta-figure-aspect.js";
import { controlRowCss } from "./css-components/control-row.js";
import { contentCardCss } from "./css-components/content-card.js";
import { documentNavigationCss } from "./css-components/document-navigation.js";
import { editorialContentCss } from "./css-components/editorial-content.js";
import { iconCss } from "./css-components/icon.js";
import { interactiveFeedbackCss } from "./css-components/interactive-feedback.js";
import { interactiveTablesCss } from "./css-components/interactive-tables.js";
import { listTreeCss } from "./css-components/list-tree.js";
import { linkedLogoSiteLayoutCss } from "./css-components/linked-logo-site-layout.js";
import { logoMediaCss } from "./css-components/logo-media.js";
import { navigationLayoutCss } from "./css-components/navigation-layout.js";
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
import { foundryComponentColorVars } from "./vanilla-theme-colors.js";
import type { ComponentTokens, ThemeSurface, ThemeTokens, TypographyToken } from "./types.js";

function parseRemValue(rem: string): number {
  return Number.parseFloat(rem.replace("rem", ""));
}

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

function controlPadding(blockPaddingVar: string, borderWidthVar = "var(--bf-border-width)"): string {
  return `  padding-block: max(0rem, calc(${blockPaddingVar} - ${borderWidthVar}));\n`;
}

function controlMarginBottomExpression(lineHeightVar: string, blockPaddingVar: string, spaceAfter: string): string {
  return `calc(${spaceAfter} + mod(calc(var(--bf-baseline) - mod(calc(${lineHeightVar} + (${blockPaddingVar} * 2)), var(--bf-baseline))), var(--bf-baseline)))`;
}

function componentAlignmentVars(components: ComponentTokens): string {
  return `  --bf-border-width: ${components.borderWidth};\n  --bf-bar-thickness: ${components.barThickness};\n  --bf-radius: ${components.radius};\n  --bf-control-block-padding: ${components.controlBlockPadding};\n  --bf-control-block-padding-compact: ${components.controlCompactBlockPadding};\n  --bf-control-box-size: calc(var(--bf-body-line-height) + (var(--bf-control-block-padding) * 2));\n  --bf-control-box-size-compact: calc(var(--bf-body-line-height) + (var(--bf-control-block-padding-compact) * 2));\n  --bf-control-inline-padding: ${components.controlInlinePadding};\n  --bf-control-inline-padding-action: ${components.controlInlinePaddingAction};\n  --bf-control-inline-padding-field: ${components.controlInlinePaddingField};\n  --bf-control-visual-size: ${components.controlVisualSize};\n  --bf-field-gap: ${components.fieldGap};\n  --bf-panel-padding-inline: ${components.panelPaddingInline};\n  --bf-panel-padding-block: ${components.panelPaddingBlock};\n  --bf-accordion-indent: ${components.accordionIndent};\n`;
}

function alignedVisualStart(lineHeightVar: string, visualSize: string, startVar: string, offset = "0rem"): string {
  if (offset === "0rem") {
    return `calc(${startVar} + ((${lineHeightVar} - ${visualSize}) / 2))`;
  }

  return `calc(${startVar} + ((${lineHeightVar} - ${visualSize}) / 2) + ${offset})`;
}

export function componentsCss(tokens: ThemeTokens, themeSurfaces?: ThemeSurface[]): string {
  const body = tokens.roles.body;
  const h4 = tokens.roles.h4 ?? body;
  const h5 = tokens.roles.h5 ?? body;
  const h6 = tokens.roles.h6 ?? body;
  const baselineUnit = tokens.baselineUnit;
  const components = tokens.components;
  const controlBlockPaddingVar = "var(--bf-control-block-padding)";
  const controlCompactBlockPaddingVar = "var(--bf-control-block-padding-compact)";
  const inputBlockPaddingVar = "var(--bf-input-block-padding)";
  const buttonBlockPaddingVar = "var(--bf-button-block-padding)";
  const bodyLineHeight = roleLineHeightVar("body", body.lineHeight);
  const inputMarginBottom = controlMarginBottomExpression(bodyLineHeight, inputBlockPaddingVar, "0rem");
  const buttonMarginBottom = controlMarginBottomExpression(bodyLineHeight, buttonBlockPaddingVar, "0rem");
  const bodySelectedStartNudge = roleSelectedStartNudgeVar("body", body.nudgeTop);
  const bodySelectedEndNudge = roleSelectedEndNudgeVar("body");
  const h4LineHeight = roleLineHeightVar("h4", h4.lineHeight);
  const h5LineHeight = roleLineHeightVar("h5", h5.lineHeight);
  const h5SelectedStartNudge = roleSelectedStartNudgeVar("h5", h5.nudgeTop);
  const h5SelectedEndNudge = roleSelectedEndNudgeVar("h5");
  const h6LineHeight = roleLineHeightVar("h6", h6.lineHeight);
  const bodyTypeStyles = typeStyles(body, { includeCase: false });
  const h6TypeStyles = typeStyles(h6, { includeCase: false });
  const buttonPadding = controlPadding(buttonBlockPaddingVar);

  return `:where(.bf-theme) {
${componentAlignmentVars(components)}  /* Action surfaces keep comfortable command targets; field surfaces can tighten independently. */
  --bf-disclosure-gap: 1rem;
  --bf-disclosure-icon-inline-size: 1rem;
  --bf-input-block-padding: ${bodySelectedStartNudge};
  --bf-button-block-padding: ${bodySelectedStartNudge};
  --bf-slider-track-size: calc(var(--bf-baseline) * 0.25);
  --bf-slider-row-block-size: max(var(--bf-control-box-size-compact), calc(${bodySelectedStartNudge} + ${bodyLineHeight} + ${bodySelectedEndNudge}));
  --bf-slider-track-offset: ${alignedVisualStart(bodyLineHeight, "var(--bf-slider-track-size)", bodySelectedStartNudge)};
  --bf-table-row-border-size: var(--bf-border-width);
  --bf-table-row-padding: ${bodySelectedStartNudge};
  --bf-table-row-content-size: calc(${bodyLineHeight} + (var(--bf-table-row-padding) * 2) + var(--bf-table-row-border-size));
  --bf-table-row-block-size: calc(var(--bf-table-row-content-size) + mod(calc(var(--bf-baseline) - mod(var(--bf-table-row-content-size), var(--bf-baseline))), var(--bf-baseline)));
  --bf-table-row-line-height: calc(var(--bf-table-row-block-size) - (var(--bf-table-row-padding) * 2) - var(--bf-table-row-border-size));
  --bf-switch-row-block-size: calc(${bodySelectedStartNudge} + ${bodyLineHeight} + ${bodySelectedEndNudge});
  --bf-switch-track-offset: ${alignedVisualStart(bodyLineHeight, "var(--bf-control-visual-size)", bodySelectedStartNudge)};
  --bf-tick-row-block-size: max(var(--bf-control-box-size-compact), calc(${bodySelectedStartNudge} + ${bodyLineHeight} + ${bodySelectedEndNudge}));
  --bf-tick-box-offset: ${alignedVisualStart(bodyLineHeight, "var(--bf-control-visual-size)", bodySelectedStartNudge)};
  --bf-tick-label-offset: calc(var(--bf-control-visual-size) + var(--bf-control-inline-padding-field));
  --bf-radio-dot-size: calc(var(--bf-control-visual-size) * 0.375);
  --bf-app-drawer-width-icon: 2rem;
  --bf-app-drawer-width-small: 15rem;
  --bf-app-drawer-width-small-max: 20rem;
  --bf-app-drawer-width-medium: 29.0625rem;
  --bf-app-drawer-width-medium-max: 40rem;
  --bf-app-drawer-width-large: min(100vw, max(40rem, 50vw));
  --bf-app-aside-width: var(--bf-app-drawer-width-medium);
  --bf-app-aside-width-min: var(--bf-app-drawer-width-small);
  --bf-app-aside-width-max: var(--bf-app-drawer-width-medium-max);
  --bf-app-navigation-width: 15rem;
  --bf-app-navigation-width-collapsed: 3rem;
  --bf-side-navigation-icon-optical-offset-block: 0.1875rem;
  --bf-navigation-bar-min-block-size: calc(var(--bf-baseline) * 6);
  --bf-authoring-accent: #f6b73c;
  --bf-authoring-accent-hover: #e0a030;
  --bf-authoring-accent-line: rgba(246, 183, 60, 0.9);
  --bf-authoring-accent-strong: rgba(246, 183, 60, 0.95);
  --bf-authoring-accent-outline: rgba(246, 183, 60, 0.4);
  --bf-authoring-accent-outline-strong: rgba(246, 183, 60, 0.8);
  --bf-authoring-accent-shadow: rgba(246, 183, 60, 0.22);
  --bf-authoring-accent-focus-ring: rgba(246, 183, 60, 0.55);
  --bf-application-resize-handle-active: var(--bf-authoring-accent-strong);
  --bf-application-resize-handle-focus-ring: var(--bf-authoring-accent-focus-ring);
  --bf-top-navigation-link-padding-inline: var(--bf-control-inline-padding-action);
  --bf-top-navigation-end-slot-inline-size: calc(1rem + var(--bf-control-inline-padding-field));
  --bf-top-navigation-search-toggle-inline-size: calc(1rem + (var(--bf-control-inline-padding-field) * 2));
  --bf-top-navigation-link-padding-block: max(var(--bf-body-nudge-start), calc(var(--bf-baseline) * 1.5));
  --bf-top-navigation-search-max-inline-size: 20rem;
  --bf-top-navigation-logo-tag-inline-size: 1.375rem;
  --bf-top-navigation-logo-tag-block-size: 2.375rem;
  --bf-top-navigation-logo-icon-size: 1rem;
  --bf-top-navigation-logo-tag-gap: 0.25rem;
  --bf-top-navigation-logo-icon-bottom-offset: 0.375rem;
  --bf-top-navigation-logo-icon-optical-offset-inline: -0.0125rem;
  --bf-navigation-brand-title-optical-offset-block: 0.25rem;
  --bf-icon-size-default: 1rem;
  --bf-icon-size-medium: 2.5rem;
  --bf-icon-size-large: 4rem;
  --bf-icon-size-x-large: 4.5rem;
  --bf-icon-size-xx-large: 6rem;
  --bf-leading-icon-size: calc(var(--bf-baseline) * 2);
  --bf-leading-icon-gap: calc(var(--bf-baseline) * 1);
  --bf-leading-icon-offset: ${alignedVisualStart(bodyLineHeight, "var(--bf-leading-icon-size)", bodySelectedStartNudge)};
  --bf-ui-chip-padding-inline: calc(${bodyLineHeight} * 0.4);
  --bf-ui-chip-padding-block: max(0rem, calc((var(--bf-control-inline-padding-action) * 0.25) - var(--bf-border-width)));
  --bf-ui-chip-block-size: calc(${bodyLineHeight} + (var(--bf-ui-chip-padding-block) * 2) + (var(--bf-border-width) * 2));
  --bf-ui-badge-padding-inline: calc(${bodyLineHeight} * 0.25);
  --bf-ui-badge-overhang: calc(var(--bf-ui-badge-padding-inline) * -0.75);
  --bf-grid-max-inline-size: var(--bf-content-max-width);
  --bf-application-drawer-width-icon: var(--bf-app-drawer-width-icon);
  --bf-application-drawer-width-small: var(--bf-app-drawer-width-small);
  --bf-application-drawer-width-small-max: var(--bf-app-drawer-width-small-max);
  --bf-application-drawer-width-medium: var(--bf-app-drawer-width-medium);
  --bf-application-drawer-width-medium-max: var(--bf-app-drawer-width-medium-max);
  --bf-application-drawer-width-large: var(--bf-app-drawer-width-large);
  --bf-application-aside-width: var(--bf-app-aside-width);
  --bf-application-aside-width-min: var(--bf-app-aside-width-min);
  --bf-application-aside-width-max: var(--bf-app-aside-width-max);
  --bf-application-navigation-width: var(--bf-app-navigation-width);
  --bf-application-navigation-width-collapsed: var(--bf-app-navigation-width-collapsed);
${foundryComponentColorVars("light")}
  --bf-ui-icon-chevron-down: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%23000' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4.25 6.25 8 10l3.75-3.75'/%3E%3C/svg%3E");
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

${(themeSurfaces ?? []).map(surface => {
  if (!surface.className) {
    return "";
  }

  const surfaceTokens = surface.tokens;
  const bodySurface = surfaceTokens.roles.body;
  const surfaceComponents = surfaceTokens.components;
  const inputBlockPadding = bodySurface && parseRemValue(bodySurface.nudgeTop) > 0
    ? bodySurface.nudgeTop
    : surfaceComponents.controlBlockPadding;
  const tableRowPadding = bodySurface && parseRemValue(bodySurface.nudgeTop) > 0
    ? bodySurface.nudgeTop
    : surfaceComponents.controlCompactBlockPadding;
  return `:where(.bf-theme.${surface.className}) {\n  --bf-control-baseline-reserve: 0rem;\n  --bf-input-block-padding: ${inputBlockPadding};\n  --bf-button-block-padding: ${inputBlockPadding};\n  --bf-table-row-padding: ${tableRowPadding};\n${componentAlignmentVars(surfaceComponents)}\n}\n`;
}).join("\n")}

:where(.bf-theme.is-dark),
:where(.bf-theme.is-dark) {
${foundryComponentColorVars("dark")}
  --bf-ui-icon-chevron-down: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%23fff' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4.25 6.25 8 10l3.75-3.75'/%3E%3C/svg%3E");
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

.bf-theme button {
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
  column-gap: calc(var(--bf-baseline) * 2);
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
  padding-inline: calc(var(--bf-baseline) * 0.5);
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
${controlPadding(inputBlockPaddingVar)}  padding-inline: var(--bf-control-inline-padding-field);
}

:where(.bf-theme) :where(input[type='color'].bf-color-input) {
  inline-size: 4rem;
  min-block-size: var(--bf-control-box-size);
  padding: calc(var(--bf-baseline) * 0.5);
}

:where(.bf-theme) :where(.bf-input, input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select):hover {
  background-color: var(--bf-color-background-hover);
}

:where(.bf-theme) :where(.bf-input, input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select):focus:not(:focus-visible) {
  outline: none;
}

:where(.bf-theme) :where(.bf-input, input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select):focus-visible {
  background-color: var(--bf-color-background-active);
  outline: 2px solid var(--bf-color-focus);
  outline-offset: 2px;
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
  min-block-size: calc(var(--bf-control-box-size) * 2);
  resize: vertical;
}

:where(.bf-theme) :where(input[type='file']) {
${typeStyles(body, { includeCase: false })}  background: transparent;
  border: 0 solid transparent;
  border-bottom: var(--bf-border-width) solid var(--bf-color-border-default);
  border-top: var(--bf-border-width) solid transparent;
  color: var(--bf-color-text-default);
  margin-bottom: ${inputMarginBottom};
  max-inline-size: 100%;
  min-inline-size: 0;
${controlPadding(inputBlockPaddingVar)}  padding-inline: 0;
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
  min-block-size: var(--bf-control-box-size-compact);
${controlPadding(controlCompactBlockPaddingVar)}  padding-inline: var(--bf-control-inline-padding-action);
}

:where(.bf-theme) :where(input[type='file'])::file-selector-button:hover {
  background: var(--bf-color-background-hover);
}

:where(.bf-theme) :where(select) {
  background-image: var(--bf-ui-icon-chevron-down);
  background-position: right var(--bf-control-inline-padding-field) center;
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
  padding-inline-end: calc(var(--bf-control-inline-padding-field) * 2.5);
}

:where(.bf-theme) :where(input[type='number'], .bf-slider-input) {
  font-variant-numeric: tabular-nums;
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
  margin: 0;
}

:where(.bf-theme) :where(.bf-checkbox, .bf-radio) {
  margin: 0;
  min-block-size: var(--bf-tick-row-block-size);
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
  cursor: pointer;
  display: block;
  margin-bottom: 0;
  min-block-size: var(--bf-tick-row-block-size);
  padding-block-end: ${bodySelectedEndNudge};
  padding-block-start: ${bodySelectedStartNudge};
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
  inset-block-start: calc(var(--bf-tick-box-offset) + (var(--bf-control-visual-size) * 0.18));
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
  outline: 2px solid var(--bf-color-focus);
  outline-offset: 2px;
}

:where(.bf-theme) :where(.bf-radio-input:focus-visible + .bf-radio-label)::before {
  outline: 2px solid var(--bf-color-focus);
  outline-offset: 2px;
}

:where(.bf-theme) :where(.bf-switch) {
  align-items: flex-start;
  display: inline-flex;
  gap: var(--bf-field-gap);
  min-block-size: var(--bf-switch-row-block-size);
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
  outline: 2px solid var(--bf-color-focus);
  outline-offset: 2px;
}

:where(.bf-theme) :where(.bf-switch-input:disabled + .bf-switch-slider) {
  opacity: 0.6;
}

:where(.bf-theme) :where(.bf-switch-label) {
${typeStyles(body, { includeCase: false })}  color: var(--bf-color-text-default);
  cursor: pointer;
  display: inline-block;
  margin: 0 0 var(--bf-body-margin-bottom);
  padding-block-end: 0;
  padding-block-start: ${bodySelectedStartNudge};
}

:where(.bf-theme) :where(.bf-validation-message) {
${typeStyles(body, { includeCase: false })}  color: var(--bf-color-text-muted);
  margin: 0 0 var(--bf-body-margin-bottom);
  padding-block-end: 0;
  padding-block-start: ${bodySelectedStartNudge};
  padding-inline-start: calc(var(--bf-control-visual-size) + var(--bf-field-gap));
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
  box-shadow: 0 0 calc(var(--bf-control-visual-size) * 0.25) 1px rgba(0, 0, 0, 0.2);
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
  box-shadow: 0 0 calc(var(--bf-control-visual-size) * 0.25) 1px rgba(0, 0, 0, 0.2);
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

:where(.bf-theme) :where(.bf-list) {
  list-style: none;
  margin: 0;
  padding: 0;
}

:where(.bf-theme) :where(.bf-list-item) {
${typeStyles(body, { includeCase: false })}  color: var(--bf-color-text-default);
  margin: 0 0 var(--bf-body-margin-bottom);
  min-inline-size: 0;
  overflow-wrap: anywhere;
  padding-block-end: 0;
  padding-block-start: var(--bf-body-nudge-start);
}

:where(.bf-theme) :where(.bf-list.is-divided) > :where(.bf-list-item) {
  box-shadow: inset 0 1px 0 var(--bf-color-border-low-contrast);
  padding-block-end: var(--bf-baseline);
}

:where(.bf-theme) :where(.bf-list.is-divided) > :where(.bf-list-item:first-child) {
  box-shadow: none;
}

:where(.bf-theme) :where(.bf-list-item.is-ticked, .bf-list-item.is-crossed) {
  padding-inline-start: calc(var(--bf-leading-icon-size) + var(--bf-leading-icon-gap));
  position: relative;
}

:where(.bf-theme) :where(.bf-list-item.is-ticked)::before,
:where(.bf-theme) :where(.bf-list-item.is-crossed)::before {
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  block-size: var(--bf-leading-icon-size);
  content: "";
  inline-size: var(--bf-leading-icon-size);
  left: 0;
  position: absolute;
  top: var(--bf-leading-icon-offset);
}

:where(.bf-theme) :where(.bf-list-item.is-ticked)::before {
  background-image: var(--bf-ui-icon-success-grey);
}

:where(.bf-theme) :where(.bf-list-item.is-crossed)::before {
  background-image: var(--bf-ui-icon-error-grey);
}

:where(.bf-theme) :where(.bf-list.is-divided) > :where(.bf-list-item.is-ticked, .bf-list-item.is-crossed)::before {
  top: calc(var(--bf-leading-icon-offset) + (var(--bf-baseline) * 0.5));
}

:where(.bf-theme) :where(ol.bf-list.is-divided) {
  counter-reset: bf-list-counter;
}

:where(.bf-theme) :where(ol.bf-list.is-divided) > :where(.bf-list-item) {
  counter-increment: bf-list-counter;
  list-style: none;
  padding-inline-start: calc(var(--bf-baseline) * 4);
  position: relative;
}

:where(.bf-theme) :where(ol.bf-list.is-divided) > :where(.bf-list-item)::before {
${typeStyles(body, { includeCase: false })}  color: var(--bf-color-text-default);
  content: counters(bf-list-counter, ".") ".";
  inline-size: calc(var(--bf-baseline) * 2.5);
  left: 0;
  position: absolute;
  text-align: right;
  top: var(--bf-body-nudge-start);
}

:where(.bf-theme) :where(.bf-list-item) > :where(.bf-list) {
  margin-inline-start: calc(var(--bf-baseline) * 3);
  padding-block-start: var(--bf-body-nudge-end);
}

:where(.bf-theme) :where(.bf-list-item.is-ticked, .bf-list-item.is-crossed) > :where(.bf-list) {
  margin-inline-start: 0;
}

:where(.bf-theme) :where(.bf-inline-list) {
  margin: 0;
  padding: 0;
}

:where(.bf-theme) :where(.bf-inline-list-item) {
${typeStyles(body, { includeCase: false })}  display: inline-block;
  list-style: none;
  margin-inline-end: calc(var(--bf-baseline) * 1.5);
  padding-block-end: var(--bf-body-nudge-end);
  padding-block-start: var(--bf-body-nudge-start);
}

:where(.bf-theme) :where(.bf-inline-list-item:last-of-type) {
  margin-inline-end: 0;
}

:where(.bf-theme) :where(.bf-inline-list.is-middot) :where(.bf-inline-list-item) {
  margin-inline-end: calc(var(--bf-baseline) * 1);
  position: relative;
}

:where(.bf-theme) :where(.bf-inline-list.is-middot) :where(.bf-inline-list-item)::after {
  content: "\\2022";
  display: inline;
  margin-inline-start: calc(var(--bf-baseline) * 0.25);
}

:where(.bf-theme) :where(.bf-inline-list.is-middot) :where(.bf-inline-list-item:last-of-type)::after {
  content: "";
}

:where(.bf-theme) :where(.bf-skip-link) {
${typeStyles(body, { includeCase: false })}  background: var(--bf-color-background-alt);
  color: var(--bf-color-link-default);
  display: block;
  left: -999px;
  max-inline-size: calc(100vw - var(--bf-baseline));
  position: absolute;
  text-decoration: none;
  top: -999px;
}

:where(.bf-theme) :where(.bf-skip-link:hover) {
  text-decoration: underline;
}

:where(.bf-theme) :where(.bf-skip-link:focus, .bf-skip-link:focus-visible) {
  left: calc(var(--bf-baseline) * 0.5);
  outline: 2px solid var(--bf-color-focus);
  outline-offset: 0;
  padding-block: calc(var(--bf-baseline) * 1.5);
  padding-inline: calc(var(--bf-baseline) * 1.5);
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
  bodyLineHeight,
  bodySelectedStartNudge,
  h5SelectedEndNudge,
  h5SelectedStartNudge,
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
  text-indent: -9999px;
}

:where(.bf-theme) :where(.bf-chip-dismiss) {
  block-size: 1rem;
  inline-size: 1rem;
  margin-inline-start: var(--bf-ui-badge-padding-inline);
}

:where(.bf-theme) :where(.bf-chip-dismiss, .bf-search-box-reset, .bf-search-and-filter-clear)::before,
:where(.bf-theme) :where(.bf-chip-dismiss, .bf-search-box-reset, .bf-search-and-filter-clear)::after {
  background: currentColor;
  block-size: 2px;
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
  buttonBlockPaddingVar,
  h6TypeStyles,
  inputMarginBottom,
})}

${controlRowCss()}

${listTreeCss({ bodyTypeStyles })}

:where(.bf-theme) :where(.bf-side-navigation, .bf-side-navigation.is-icons, .bf-side-navigation.is-accordion, .bf-side-navigation.is-raw-html) {
  color: var(--bf-color-text-inactive);
  display: block;
  inline-size: 100%;
}

:where(.bf-theme) :where(.bf-side-navigation-drawer) {
  background: var(--bf-color-background-default);
  bottom: 0;
  color: var(--bf-color-text-default);
  inline-size: 100%;
  left: 0;
  overflow: auto;
  position: fixed;
  top: 0;
  transform: translateX(-100%);
  transition: transform 160ms ease, visibility 160ms ease, box-shadow 160ms ease;
  visibility: visible;
  z-index: 102;
}

:where(.bf-theme) :where(.bf-side-navigation, .bf-side-navigation.is-icons, .bf-side-navigation.is-accordion, .bf-side-navigation.is-raw-html):where(.is-drawer-expanded) :where(.bf-side-navigation-drawer) {
  box-shadow: 0 24px 72px rgba(0, 0, 0, 0.38);
  transform: translateX(0);
}

:where(.bf-theme) :where(.bf-side-navigation, .bf-side-navigation.is-icons, .bf-side-navigation.is-accordion, .bf-side-navigation.is-raw-html):where(.is-drawer-hidden) :where(.bf-side-navigation-drawer) {
  display: none;
}

:where(.bf-theme) :where(.bf-side-navigation-overlay) {
  background: var(--bf-color-background-overlay);
  inset: 0;
  opacity: 0;
  pointer-events: none;
  position: fixed;
  transition: opacity 160ms ease, visibility 160ms ease;
  visibility: hidden;
  z-index: 101;
}

:where(.bf-theme) :where(.bf-side-navigation, .bf-side-navigation.is-icons, .bf-side-navigation.is-accordion, .bf-side-navigation.is-raw-html):where(.is-drawer-expanded) :where(.bf-side-navigation-overlay) {
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
}

:where(.bf-theme) :where(.bf-side-navigation-drawer-header) {
  background: var(--bf-color-background-default);
  border-bottom: var(--bf-border-width) solid var(--bf-color-border-low-contrast);
  margin-bottom: calc(var(--bf-baseline) * 2);
  padding-bottom: calc(var(--bf-panel-padding-block) - var(--bf-border-width));
  padding-inline: var(--bf-panel-padding-inline);
  padding-top: var(--bf-panel-padding-block);
  position: sticky;
  top: 0;
  z-index: 1;
}

:where(.bf-theme) :where(.bf-side-navigation-toggle, .bf-side-navigation-toggle.is-in-drawer) {
${typeStyles(body, { includeCase: false })}  align-items: center;
  appearance: none;
  background: var(--bf-color-background-default);
  border: var(--bf-border-width) solid var(--bf-color-border-high-contrast);
  border-radius: var(--bf-radius);
  color: var(--bf-color-text-default);
  cursor: pointer;
  display: inline-flex;
  gap: calc(var(--bf-baseline) * 0.5);
  justify-content: center;
  margin: 0 0 ${buttonMarginBottom};
${controlPadding(buttonBlockPaddingVar)}  padding-inline: var(--bf-control-inline-padding-action);
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-side-navigation-toggle)::before {
  background-image: var(--bf-ui-icon-chevron-down);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
  block-size: 1rem;
  content: "";
  inline-size: 1rem;
  transform: rotate(-90deg);
}

:where(.bf-theme) :where(.bf-side-navigation-toggle.is-in-drawer)::before {
  background-image: var(--bf-ui-icon-chevron-down);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
  block-size: 1rem;
  content: "";
  inline-size: 1rem;
  transform: rotate(90deg);
}

:where(.bf-theme) :where(.bf-side-navigation-toggle:hover) {
  background: var(--bf-color-background-hover);
}

:where(.bf-theme) :where(.bf-side-navigation-toggle:focus:not(:focus-visible)) {
  outline: none;
}

:where(.bf-theme) :where(.bf-side-navigation-toggle:focus-visible) {
  outline: 2px solid var(--bf-color-focus);
  outline-offset: -2px;
}

:where(.bf-theme) :where(.bf-side-navigation-heading, .bf-side-navigation-heading.is-linked) {
${typeStyles(body, { fontWeight: 600, includeCase: false })}  display: block;
  margin: 0;
}

:where(.bf-theme) :where(.bf-side-navigation-list) {
  border-bottom: var(--bf-border-width) solid var(--bf-color-border-low-contrast);
  list-style: none;
  margin: 0 0 calc(var(--bf-baseline) * 2);
  padding: 0 0 calc((var(--bf-baseline) * 2) - var(--bf-border-width));
}

:where(.bf-theme) :where(.bf-side-navigation-list:last-of-type) {
  border-bottom: 0;
  margin-bottom: 0;
  padding-bottom: 0;
}

:where(.bf-theme) :where(.bf-side-navigation-item, .bf-side-navigation-item.is-title) {
  margin: 0;
  position: relative;
}

:where(.bf-theme) :where(.bf-side-navigation-link, .bf-side-navigation-text, .bf-side-navigation-accordion-button) {
${typeStyles(body, { includeCase: false })}  align-items: center;
  background: transparent;
  border: 0;
  color: var(--bf-color-text-inactive);
  display: flex;
  gap: calc(var(--bf-baseline) * 0.5);
  inline-size: 100%;
  justify-content: flex-start;
  margin: 0;
  min-block-size: var(--bf-control-box-size-compact);
${controlPadding(controlCompactBlockPaddingVar, "0rem")}  padding-inline: var(--bf-panel-padding-inline);
  position: relative;
  text-align: left;
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-side-navigation-accordion-button) {
  gap: var(--bf-disclosure-gap);
}

:where(.bf-theme) :where(.bf-side-navigation-item.is-title) > :where(.bf-side-navigation-link, .bf-side-navigation-text) {
  color: var(--bf-color-text-default);
  font-weight: 600;
}

:where(.bf-theme) :where(.bf-side-navigation-heading, .bf-side-navigation-heading.is-linked),
:where(.bf-theme) :where(.bf-side-navigation-list) > :where(.bf-side-navigation-item, .bf-side-navigation-item.is-title) > :where(.bf-side-navigation-link, .bf-side-navigation-text, .bf-side-navigation-accordion-button) {
  padding-inline-start: var(--bf-panel-padding-inline);
}

:where(.bf-theme) :where(.bf-side-navigation-item, .bf-side-navigation-item.is-title)
  :where(.bf-side-navigation-item, .bf-side-navigation-item.is-title)
  > :where(.bf-side-navigation-link, .bf-side-navigation-text, .bf-side-navigation-accordion-button) {
  padding-inline-start: calc(var(--bf-panel-padding-inline) + (var(--bf-baseline) * 2));
}

:where(.bf-theme) :where(.bf-side-navigation-item, .bf-side-navigation-item.is-title)
  :where(.bf-side-navigation-item, .bf-side-navigation-item.is-title)
  :where(.bf-side-navigation-item, .bf-side-navigation-item.is-title)
  > :where(.bf-side-navigation-link, .bf-side-navigation-text, .bf-side-navigation-accordion-button) {
  padding-inline-start: calc(var(--bf-panel-padding-inline) + (var(--bf-baseline) * 4));
}

:where(.bf-theme) :where(.bf-side-navigation-item, .bf-side-navigation-item.is-title)
  :where(.bf-side-navigation-item, .bf-side-navigation-item.is-title)
  :where(.bf-side-navigation-item, .bf-side-navigation-item.is-title)
  :where(.bf-side-navigation-item, .bf-side-navigation-item.is-title)
  > :where(.bf-side-navigation-link, .bf-side-navigation-text, .bf-side-navigation-accordion-button) {
  padding-inline-start: calc(var(--bf-panel-padding-inline) + (var(--bf-baseline) * 6));
}

:where(.bf-theme) :where(.bf-side-navigation-link:hover, .bf-side-navigation-accordion-button:hover) {
  background: var(--bf-color-background-hover);
  color: var(--bf-color-text-default);
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-side-navigation-link:focus:not(:focus-visible), .bf-side-navigation-accordion-button:focus:not(:focus-visible)) {
  outline: none;
}

:where(.bf-theme) :where(.bf-side-navigation-link:focus-visible, .bf-side-navigation-accordion-button:focus-visible) {
  outline: 2px solid var(--bf-color-focus);
  outline-offset: -2px;
}

:where(.bf-theme) :where(.bf-side-navigation-link.is-active, .bf-side-navigation-link[aria-current='page'], .bf-side-navigation-link[aria-current='true']) {
  background: var(--bf-color-background-active);
  box-shadow: inset var(--bf-bar-thickness) 0 0 var(--bf-color-text-default);
  color: var(--bf-color-text-default);
  cursor: default;
}

:where(.bf-theme) :where(.bf-top-navigation) {
  background: var(--bf-color-background-default);
  box-shadow: inset 0 calc(var(--bf-border-width) * -1) 0 var(--bf-color-border-low-contrast);
  color: var(--bf-color-text-default);
  isolation: isolate;
  position: relative;
  z-index: 50;
}

:where(.bf-theme) :where(.bf-top-navigation.is-sticky) {
  position: sticky;
  top: 0;
  z-index: 98;
}

:where(.bf-theme) :where(.bf-top-navigation-row) {
  display: flex;
  flex-direction: column;
  min-block-size: var(--bf-navigation-bar-min-block-size);
  min-inline-size: 0;
  padding-block: calc(var(--bf-baseline) / 2);
  padding-inline: var(--bf-panel-padding-inline);
  position: relative;
  z-index: 1;
}

:where(.bf-theme) :where(.bf-top-navigation) :where(.bf-fixed-width) > :where(.bf-top-navigation-row) {
  padding-inline: 0;
}

:where(.bf-theme) :where(.bf-top-navigation-banner) {
  align-items: stretch;
  display: flex;
  justify-content: space-between;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-top-navigation-logo) {
  align-items: stretch;
  display: flex;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-top-navigation-logo) > :where(.bf-top-navigation-link) {
${typeStyles(body, { fontWeight: 500, includeCase: false })}  align-items: center;
  color: var(--bf-color-text-default);
  column-gap: calc(var(--bf-baseline) * 1.5);
  display: inline-flex;
  inline-size: auto;
  justify-content: flex-start;
  margin: 0;
  min-inline-size: 0;
  padding-block: var(--bf-top-navigation-link-padding-block);
  padding-inline: 0;
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-top-navigation-logo) > :where(.bf-top-navigation-link:hover) {
  background: transparent;
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-top-navigation-logo-tag) {
  align-items: center;
  background: var(--bf-color-accent);
  block-size: var(--bf-top-navigation-logo-tag-block-size);
  color: #ffffff;
  display: inline-flex;
  flex: 0 0 auto;
  inline-size: var(--bf-top-navigation-logo-tag-inline-size);
  justify-content: center;
}

:where(.bf-theme) :where(.bf-top-navigation-logo-icon) {
  block-size: var(--bf-top-navigation-logo-icon-size);
  inline-size: var(--bf-top-navigation-logo-icon-size);
}

:where(.bf-theme) :where(.bf-top-navigation-logo-title) {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:where(.bf-theme) :where(.bf-top-navigation-nav) {
  display: none;
  flex-direction: column;
  min-inline-size: 0;
}

:where(.bf-theme) :where(.bf-top-navigation-nav[aria-hidden='false']) {
  display: flex;
}

:where(.bf-theme) :where(.bf-top-navigation-list) {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  min-inline-size: 0;
  padding: 0;
}

:where(.bf-theme) :where(.bf-top-navigation-list.is-banner-actions) {
  align-items: stretch;
  display: flex;
  flex: 0 0 auto;
  flex-direction: row;
}

:where(.bf-theme) :where(.bf-top-navigation-item) {
  margin: 0;
  min-inline-size: 0;
  position: relative;
}

:where(.bf-theme) :where(.bf-top-navigation-nav) :where(.bf-top-navigation-item) {
  border-top: var(--bf-border-width) solid var(--bf-color-border-low-contrast);
}

:where(.bf-theme) :where(.bf-top-navigation-item.is-right-shifted) {
  margin-inline-start: auto;
}

:where(.bf-theme) :where(.bf-top-navigation-link, .bf-top-navigation-menu-toggle, .bf-top-navigation-search-toggle) {
${typeStyles(body, { includeCase: false })}  align-items: center;
  appearance: none;
  background: transparent;
  border: 0;
  color: var(--bf-color-text-default);
  cursor: pointer;
  display: inline-flex;
  gap: calc(var(--bf-baseline) * 1);
  inline-size: 100%;
  justify-content: flex-start;
  margin: 0;
  min-inline-size: 0;
  padding-block: var(--bf-top-navigation-link-padding-block);
  padding-inline: var(--bf-top-navigation-link-padding-inline);
  position: relative;
  text-align: left;
  text-decoration: none;
  white-space: nowrap;
}

:where(.bf-theme) :where(.bf-top-navigation-link:hover, .bf-top-navigation-menu-toggle:hover, .bf-top-navigation-search-toggle:hover) {
  background: var(--bf-color-background-hover);
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-top-navigation-link:focus:not(:focus-visible), .bf-top-navigation-menu-toggle:focus:not(:focus-visible), .bf-top-navigation-search-toggle:focus:not(:focus-visible)) {
  outline: none;
}

:where(.bf-theme) :where(.bf-top-navigation-link:focus-visible, .bf-top-navigation-menu-toggle:focus-visible, .bf-top-navigation-search-toggle:focus-visible) {
  outline: 2px solid var(--bf-color-focus);
  outline-offset: -2px;
}

:where(.bf-theme) :where(.bf-top-navigation-item.is-selected) > :where(.bf-top-navigation-link),
:where(.bf-theme) :where(.bf-top-navigation-item.is-dropdown-toggle.is-active) > :where(.bf-top-navigation-link),
:where(.bf-theme) :where(.bf-top-navigation-link[aria-current='page']) {
  background: var(--bf-color-background-hover);
  box-shadow: inset var(--bf-bar-thickness) 0 0 var(--bf-color-text-default);
  color: var(--bf-color-text-default);
}

:where(.bf-theme) :where(.bf-top-navigation-menu-toggle) {
  display: inline-flex;
}

:where(.bf-theme) :where(.bf-top-navigation-search-toggle) {
  justify-content: center;
  min-inline-size: var(--bf-top-navigation-search-toggle-inline-size);
}

:where(.bf-theme) :where(.bf-top-navigation-dropdown-toggle) {
  padding-inline-end: calc(var(--bf-top-navigation-link-padding-inline) + var(--bf-top-navigation-end-slot-inline-size));
}

:where(.bf-theme) :where(.bf-top-navigation-dropdown-toggle)::after {
  background-image: var(--bf-ui-icon-chevron-down);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
  block-size: 1rem;
  bottom: 0;
  content: "";
  inline-size: 1rem;
  margin-block: auto;
  pointer-events: none;
  position: absolute;
  right: var(--bf-top-navigation-link-padding-inline);
  top: 0;
  transform: rotate(0deg);
  transition: transform 160ms ease;
}

:where(.bf-theme) :where(.bf-top-navigation-item.is-dropdown-toggle.is-active) > :where(.bf-top-navigation-dropdown-toggle)::after {
  transform: rotate(180deg);
}

:where(.bf-theme) :where(.bf-top-navigation-dropdown) {
  background: var(--bf-color-background-default);
  border-top: var(--bf-border-width) solid var(--bf-color-border-low-contrast);
  display: none;
  list-style: none;
  margin: 0;
  min-inline-size: 100%;
  padding: 0;
}

:where(.bf-theme) :where(.bf-top-navigation-item.is-dropdown-toggle.is-active) > :where(.bf-top-navigation-dropdown) {
  display: block;
}

:where(.bf-theme) :where(.bf-top-navigation-dropdown-item) {
${typeStyles(body, { includeCase: false })}  align-items: center;
  color: var(--bf-color-text-default);
  display: flex;
  gap: calc(var(--bf-baseline) * 2);
  inline-size: 100%;
  justify-content: space-between;
  min-inline-size: 0;
  padding-block: var(--bf-top-navigation-link-padding-block);
  padding-inline: calc(var(--bf-top-navigation-link-padding-inline) + (var(--bf-baseline) * 2)) var(--bf-top-navigation-link-padding-inline);
  text-align: left;
  text-decoration: none;
  white-space: nowrap;
}

:where(.bf-theme) :where(button.bf-top-navigation-dropdown-item) {
  appearance: none;
  background: transparent;
  border: 0;
  cursor: pointer;
  font: inherit;
}

:where(.bf-theme) :where(.bf-top-navigation-dropdown-item-label) {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

:where(.bf-theme) :where(.bf-top-navigation-dropdown-item-shortcut) {
  color: var(--bf-color-text-muted);
  flex: 0 0 auto;
  white-space: nowrap;
}

:where(.bf-theme) :where(button.bf-top-navigation-dropdown-item:disabled) {
  color: var(--bf-color-text-muted);
  cursor: default;
}

:where(.bf-theme) :where(.bf-top-navigation-dropdown > li.is-divider) {
  border-top: var(--bf-border-width) solid var(--bf-color-border-default);
  margin-block: calc(var(--bf-baseline) * 0.5);
}

:where(.bf-theme) :where(.bf-top-navigation-dropdown > li + li) > :where(.bf-top-navigation-dropdown-item) {
  border-top: var(--bf-border-width) solid var(--bf-color-border-low-contrast);
}

:where(.bf-theme) :where(.bf-top-navigation-dropdown-item:hover) {
  background: var(--bf-color-background-hover);
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-top-navigation-dropdown-item:focus:not(:focus-visible)) {
  outline: none;
}

:where(.bf-theme) :where(.bf-top-navigation-dropdown-item:focus-visible) {
  outline: 2px solid var(--bf-color-focus);
  outline-offset: -2px;
}

:where(.bf-theme) :where(.bf-top-navigation-search-label) {
  display: none;
}

:where(.bf-theme) :where(.bf-top-navigation-search-toggle)::after {
  background-image: var(--bf-ui-icon-search);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
  block-size: 1rem;
  content: "";
  flex: 0 0 1rem;
  inline-size: 1rem;
}

:where(.bf-theme) :where(.bf-top-navigation-search-toggle[aria-pressed='true'])::after {
  background-image: var(--bf-ui-icon-close);
}

:where(.bf-theme) :where(.bf-top-navigation-nav) :where(.bf-top-navigation-search-toggle) {
  display: none;
}

:where(.bf-theme) :where(.bf-top-navigation-search) {
  border-top: var(--bf-border-width) solid var(--bf-color-border-low-contrast);
  display: none;
  min-inline-size: 0;
  padding-block: var(--bf-top-navigation-link-padding-block);
  padding-inline: var(--bf-top-navigation-link-padding-inline);
}

:where(.bf-theme) :where(.bf-top-navigation-search[aria-hidden='false']) {
  display: block;
}

:where(.bf-theme) :where(.bf-top-navigation:has(.bf-top-navigation-search[aria-hidden='false'])) :where(.bf-top-navigation-nav) > :where(.bf-top-navigation-list) {
  display: none;
}

:where(.bf-theme) :where(.bf-top-navigation-search) :where(.bf-search-box) {
  margin-bottom: 0;
}

:where(.bf-theme) :where(.bf-top-navigation-search-overlay) {
  display: none;
}

@media (min-width: 64.75rem) {
  :where(.bf-theme) :where(.bf-top-navigation-row) {
    align-items: stretch;
    flex-direction: row;
    gap: calc(var(--bf-baseline) * 2);
  }

  :where(.bf-theme) :where(.bf-top-navigation-banner) {
    flex: 0 0 auto;
  }

  :where(.bf-theme) :where(.bf-top-navigation-nav) {
    align-items: stretch;
    display: flex;
    flex: 1 1 auto;
    flex-direction: row;
    justify-content: space-between;
  }

  :where(.bf-theme) :where(.bf-top-navigation-list) {
    align-items: stretch;
    flex-direction: row;
    flex-wrap: wrap;
  }

  :where(.bf-theme) :where(.bf-top-navigation-nav) :where(.bf-top-navigation-item) {
    border-top: 0;
  }

  :where(.bf-theme) :where(.bf-top-navigation-link, .bf-top-navigation-search-toggle) {
    inline-size: auto;
  }

  :where(.bf-theme) :where(.bf-top-navigation-list.is-banner-actions) {
    display: none;
  }

  :where(.bf-theme) :where(.bf-top-navigation-nav) :where(.bf-top-navigation-search-toggle) {
    display: inline-flex;
  }

  :where(.bf-theme) :where(.bf-top-navigation-search-toggle) {
    justify-content: flex-start;
    min-inline-size: 0;
  }

  :where(.bf-theme) :where(.bf-top-navigation-search-label) {
    display: inline;
  }

  :where(.bf-theme) :where(.bf-top-navigation-item.is-selected) > :where(.bf-top-navigation-link),
  :where(.bf-theme) :where(.bf-top-navigation-item.is-dropdown-toggle.is-active) > :where(.bf-top-navigation-link),
  :where(.bf-theme) :where(.bf-top-navigation-link[aria-current='page']) {
    box-shadow: inset 0 calc(var(--bf-bar-thickness) * -1) 0 var(--bf-color-text-default);
  }

  :where(.bf-theme) :where(.bf-top-navigation-dropdown) {
    border-top: 0;
    box-shadow: 0 0 0 var(--bf-border-width) var(--bf-color-border-low-contrast), 0 calc(var(--bf-baseline) * 0.5) calc(var(--bf-baseline) * 2) rgba(0, 0, 0, 0.16);
    left: 0;
    min-inline-size: max(100%, 12rem);
    position: absolute;
    top: calc((var(--bf-top-navigation-link-padding-block) * 2) + var(--bf-body-line-height));
    z-index: 5;
  }

  :where(.bf-theme) :where(.bf-top-navigation-dropdown.is-right) {
    left: auto;
    right: 0;
  }

  :where(.bf-theme) :where(.bf-top-navigation-dropdown-item) {
    padding-inline: var(--bf-top-navigation-link-padding-inline);
  }

  :where(.bf-theme) :where(.bf-top-navigation-search) {
    align-items: center;
    border-top: 0;
    flex: 1 1 auto;
    justify-content: flex-end;
    padding-block: var(--bf-top-navigation-link-padding-block);
    padding-inline: 0;
  }

  :where(.bf-theme) :where(.bf-top-navigation-search) :where(.bf-search-box) {
    inline-size: min(100%, var(--bf-top-navigation-search-max-inline-size));
  }

  :where(.bf-theme) :where(.bf-top-navigation-search-overlay) {
    background: var(--bf-color-background-overlay);
    display: block;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    position: fixed;
    transition: opacity 160ms ease, visibility 160ms ease;
    visibility: hidden;
    z-index: 0;
  }

  :where(.bf-theme) :where(.bf-top-navigation-search-overlay[aria-hidden='false']) {
    opacity: 0.5;
    pointer-events: auto;
    visibility: visible;
  }
}

:where(.bf-theme) :where(.bf-side-navigation-item:has(> .bf-side-navigation-list [aria-current='page']), .bf-side-navigation-item:has(> .bf-side-navigation-list [aria-current='true'])) > :where(.bf-side-navigation-link, .bf-side-navigation-accordion-button) {
  color: var(--bf-color-text-default);
}

:where(.bf-theme) :where(.bf-side-navigation-accordion-button)::before,
:where(.bf-theme) :where(.bf-side-navigation-expand)::before {
  background-image: var(--bf-ui-icon-chevron-down);
  background-position: center;
  background-repeat: no-repeat;
  background-size: var(--bf-disclosure-icon-inline-size) var(--bf-disclosure-icon-inline-size);
  block-size: var(--bf-disclosure-icon-inline-size);
  content: "";
  flex: 0 0 var(--bf-disclosure-icon-inline-size);
  inline-size: var(--bf-disclosure-icon-inline-size);
  transition: transform 120ms ease;
}

:where(.bf-theme) :where(.bf-side-navigation-accordion-button[aria-expanded='false'], .bf-side-navigation-expand[aria-expanded='false'])::before {
  transform: rotate(-90deg);
}

:where(.bf-theme) :where(.bf-side-navigation-expand) {
${typeStyles(body, { includeCase: false })}  background: transparent;
  border: 0;
  color: inherit;
  cursor: pointer;
  inset-block-start: 0;
  margin: 0;
  min-block-size: var(--bf-control-box-size-compact);
  padding-inline: calc(var(--bf-baseline) * 0.5);
  position: absolute;
  right: 0;
}

:where(.bf-theme) :where(.bf-side-navigation-list[aria-expanded='false']) {
  block-size: 0;
  margin-bottom: 0;
  opacity: 0;
  overflow: hidden;
  padding-bottom: 0;
  transform: translate3d(0, calc(var(--bf-baseline) * -0.5), 0);
  visibility: hidden;
}

:where(.bf-theme) :where(.bf-side-navigation-list[aria-expanded='true']) {
  block-size: auto;
  opacity: 1;
  transform: translate3d(0, 0, 0);
  visibility: visible;
}

:where(.bf-theme) :where(.bf-side-navigation-label) {
  display: block;
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

:where(.bf-theme) :where(.bf-side-navigation-status) {
  align-items: center;
  display: inline-flex;
  margin-inline-start: auto;
}

:where(.bf-theme) :where(.bf-side-navigation.is-icons) :where(.bf-side-navigation-icon) {
  align-items: center;
  display: inline-flex;
  flex: 0 0 1rem;
  inline-size: 1rem;
  justify-content: center;
  transform: translateY(var(--bf-side-navigation-icon-optical-offset-block));
}

:where(.bf-theme) :where(.bf-navigation.is-collapsed) :where(.bf-side-navigation-icon) {
  transform: none;
}

:where(.bf-theme) :where(.bf-side-navigation.is-icons) :where(.bf-side-navigation-link, .bf-side-navigation-text, .bf-side-navigation-accordion-button) {
  align-items: baseline;
}

:where(.bf-theme) :where(.bf-side-navigation-icon) > svg {
  block-size: 1rem;
  display: block;
  inline-size: 1rem;
}

@media (min-width: 64.75rem) {
  :where(.bf-theme) :where(.bf-side-navigation-toggle),
  :where(.bf-theme) :where(.bf-side-navigation-drawer-header),
  :where(.bf-theme) :where(.bf-side-navigation-overlay) {
    display: none;
  }

  :where(.bf-theme) :where(.bf-side-navigation-drawer),
  :where(.bf-theme) :where(.bf-side-navigation, .bf-side-navigation.is-icons, .bf-side-navigation.is-accordion, .bf-side-navigation.is-raw-html):where(.is-drawer-expanded) :where(.bf-side-navigation-drawer) {
    box-shadow: none;
    display: block;
    max-inline-size: none;
    overflow: visible;
    position: static;
    transform: translateX(0);
  }

  :where(.bf-theme) :where(.bf-side-navigation.is-sticky) {
    max-block-size: 100dvh;
    overflow-y: auto;
    position: sticky;
    top: 0;
  }
}

:where(.bf-theme) :where(.bf-contextual-menu, .bf-contextual-menu.is-left, .bf-contextual-menu.is-center) {
  display: inline-block;
  margin: 0;
  position: relative;
  vertical-align: top;
}

:where(.bf-theme) :where(.bf-contextual-menu-dropdown) {
  background: var(--bf-color-background-default);
  border: var(--bf-border-width) solid var(--bf-color-border-default);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.28);
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
  box-shadow: inset 0 1px 0 var(--bf-color-border-default);
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
  padding-block: var(--bf-control-block-padding-compact);
  padding-inline: var(--bf-panel-padding-inline);
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
  outline: 2px solid var(--bf-color-focus);
  outline-offset: -2px;
}

:where(.bf-theme) :where(.bf-contextual-menu-link.is-disabled, .bf-contextual-menu-link[disabled]) {
  color: var(--bf-color-text-muted);
  cursor: default;
  pointer-events: none;
}

:where(.bf-theme) :where(.bf-tooltip) {
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
  box-shadow: inset 0 0 0 var(--bf-border-width) var(--bf-color-border-default), 0 12px 32px rgba(0, 0, 0, 0.24);
  color: var(--bf-color-text-default);
  inline-size: max-content;
  left: 0;
  margin: 0;
  max-inline-size: min(20rem, calc(100vw - (var(--bf-baseline) * 4)));
  opacity: 0;
  padding-block-end: ${bodySelectedEndNudge};
  padding-block-start: ${bodySelectedStartNudge};
  padding-inline: var(--bf-panel-padding-inline);
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
  border-bottom: calc(var(--bf-baseline) * 0.5) solid var(--bf-color-background-alt);
  border-inline: calc(var(--bf-baseline) * 0.5) solid transparent;
  bottom: 100%;
  content: "";
  inline-size: 0;
  left: calc(var(--bf-baseline) * 0.75);
  position: absolute;
}

:where(.bf-theme) :where(.bf-tooltip.is-detached) > :where(.bf-tooltip-message) {
  left: auto;
  pointer-events: auto;
  position: static;
  top: auto;
  transform: none;
}

:where(.bf-theme) :where(.bf-tooltip.is-detached) > :where(.bf-tooltip-message)::before {
  content: none;
}

:where(.bf-theme) :where(.bf-tooltip.is-btm-center) > :where(.bf-tooltip-message) {
  left: 50%;
  transform: translate(-50%, calc(var(--bf-baseline) - var(--bf-border-width)));
}

:where(.bf-theme) :where(.bf-tooltip.is-btm-center) > :where(.bf-tooltip-message)::before {
  left: 50%;
  transform: translateX(-50%);
}

:where(.bf-theme) :where(.bf-tooltip.is-btm-right) > :where(.bf-tooltip-message) {
  left: auto;
  right: 0;
}

:where(.bf-theme) :where(.bf-tooltip.is-btm-right) > :where(.bf-tooltip-message)::before {
  left: auto;
  right: calc(var(--bf-baseline) * 0.75);
}

:where(.bf-theme) :where(.bf-tooltip.is-top-left, .bf-tooltip.is-top-center, .bf-tooltip.is-top-right) > :where(.bf-tooltip-message) {
  bottom: 100%;
  top: auto;
  transform: translateY(calc(var(--bf-baseline) * -1));
}

:where(.bf-theme) :where(.bf-tooltip.is-top-left, .bf-tooltip.is-top-center, .bf-tooltip.is-top-right) > :where(.bf-tooltip-message)::before {
  border-bottom: 0;
  border-inline: calc(var(--bf-baseline) * 0.5) solid transparent;
  border-top: calc(var(--bf-baseline) * 0.5) solid var(--bf-color-background-alt);
  bottom: auto;
  top: 100%;
}

:where(.bf-theme) :where(.bf-tooltip.is-top-center) > :where(.bf-tooltip-message) {
  left: 50%;
  transform: translate(-50%, calc(var(--bf-baseline) * -1));
}

:where(.bf-theme) :where(.bf-tooltip.is-top-center) > :where(.bf-tooltip-message)::before {
  left: 50%;
  transform: translateX(-50%);
}

:where(.bf-theme) :where(.bf-tooltip.is-top-right) > :where(.bf-tooltip-message) {
  left: auto;
  right: 0;
}

:where(.bf-theme) :where(.bf-tooltip.is-top-right) > :where(.bf-tooltip-message)::before {
  left: auto;
  right: calc(var(--bf-baseline) * 0.75);
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
  min-block-size: var(--bf-control-box-size);
  padding-block: var(--bf-control-block-padding);
  padding-inline: calc(var(--bf-baseline) * 0.5);
}

:where(.bf-theme) :where(.bf-pagination-link, .bf-pagination-link.is-previous, .bf-pagination-link.is-next) {
${typeStyles(body, { includeCase: false })}  align-items: center;
  background-color: var(--bf-color-background-default);
  border: var(--bf-border-width) solid var(--bf-color-border-high-contrast);
  border-radius: var(--bf-radius);
  color: var(--bf-color-text-default);
  cursor: pointer;
  display: inline-flex;
  gap: calc(var(--bf-baseline) * 0.5);
  justify-content: center;
  margin-bottom: ${buttonMarginBottom};
  min-inline-size: var(--bf-control-box-size);
${controlPadding(buttonBlockPaddingVar)}  padding-inline: var(--bf-control-inline-padding-action);
  text-align: center;
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-pagination-link:hover, .bf-pagination-link.is-previous:hover, .bf-pagination-link.is-next:hover) {
  background-color: var(--bf-color-background-hover);
}

:where(.bf-theme) :where(.bf-pagination-link:focus:not(:focus-visible), .bf-pagination-link.is-previous:focus:not(:focus-visible), .bf-pagination-link.is-next:focus:not(:focus-visible)) {
  outline: none;
}

:where(.bf-theme) :where(.bf-pagination-link:focus-visible, .bf-pagination-link.is-previous:focus-visible, .bf-pagination-link.is-next:focus-visible) {
  outline: 2px solid var(--bf-color-focus);
  outline-offset: 2px;
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
  color: var(--bf-color-text-default);
  cursor: pointer;
  display: flex;
  gap: var(--bf-disclosure-gap);
  inline-size: 100%;
  justify-content: flex-start;
  min-block-size: var(--bf-control-box-size);
  padding-block: var(--bf-control-block-padding);
  padding-inline: 0;
  text-align: left;
}

:where(.bf-theme) :where(.bf-accordion-tab):focus:not(:focus-visible) {
  outline: none;
}

:where(.bf-theme) :where(.bf-accordion-tab):focus-visible {
  outline: 2px solid var(--bf-color-focus);
  outline-offset: 2px;
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
  transition: transform 120ms ease;
}

:where(.bf-theme) :where(.bf-accordion-tab[aria-expanded='false'])::before {
  transform: rotate(-90deg);
}

:where(.bf-theme) :where(.bf-accordion-panel) {
  margin: 0;
  overflow: hidden;
  padding-block-start: var(--bf-baseline);
  padding-inline-start: calc(var(--bf-accordion-indent) + ${roleFontSizeVar("body", body.fontSize)} + var(--bf-baseline));
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
  --bf-modal-workflow-viewport-gap: calc(var(--bf-baseline) * 4);
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
  box-shadow: inset 0 -1px 0 var(--bf-color-border-default);
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
  padding-inline: var(--bf-panel-padding-inline);
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
  box-shadow: inset 0 1px 0 var(--bf-color-border-default);
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
  padding-inline: var(--bf-panel-padding-inline);
  text-align: start;
}

:where(.bf-theme) :where(.bf-code-snippet-dropdown) + :where(.bf-code-snippet-dropdown) {
  box-shadow: inset 1px 0 0 var(--bf-color-border-default);
}

:where(.bf-theme) :where(.bf-code-snippet-dropdown):focus:not(:focus-visible) {
  outline: none;
}

:where(.bf-theme) :where(.bf-code-snippet-dropdown):focus-visible {
  outline: 2px solid var(--bf-color-focus);
  outline-offset: -2px;
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
  padding-inline: var(--bf-panel-padding-inline);
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
  padding-inline-start: calc(var(--bf-panel-padding-inline) + (var(--bf-baseline) * 3));
  position: relative;
}

:where(.bf-theme) :where(.bf-code-snippet-block.is-icon)::before {
${typeStyles(h6, { includeCase: false })}  color: var(--bf-color-text-muted);
  content: "$";
  inset-inline-start: var(--bf-panel-padding-inline);
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
  box-shadow: inset 0 0 0 1px var(--bf-color-border-information);
}

:where(.bf-theme) :where(.bf-code-snippet-block.is-icon):focus:not(:focus-visible) {
  outline: none;
}

:where(.bf-theme) :where(.bf-code-snippet-block.is-icon):focus-visible {
  outline: 2px solid var(--bf-color-focus);
  outline-offset: -2px;
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
  box-shadow: 0 24px 72px rgba(0, 0, 0, 0.38);
  transform: translateX(0);
  visibility: visible;
}

:where(.bf-theme) :where(.bf-navigation.is-collapsed) :where(.is-fading-when-collapsed, .bf-side-navigation-heading, .bf-side-navigation-status) {
  display: none;
}

:where(.bf-theme) :where(.bf-navigation.is-collapsed) :where(.bf-side-navigation-label) {
  block-size: 1px;
  clip-path: inset(50%);
  inline-size: 1px;
  max-inline-size: 1px;
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
  padding-inline: calc(var(--bf-baseline) * 1.25);
}

:where(.bf-theme) :where(.bf-navigation.is-collapsed) :where(.bf-side-navigation-list) {
  border-bottom-color: transparent;
}

:where(.bf-theme) :where(.bf-navigation.is-collapsed) :where(.bf-side-navigation-item.is-title > .bf-side-navigation-link, .bf-side-navigation-item.is-title > .bf-side-navigation-text) {
  padding-inline: calc(var(--bf-baseline) * 1.25);
}

:where(.bf-theme) :where(.bf-application:has(> .bf-aside.is-pinned:not(.is-collapsed))) {
  grid-template-areas: "main aside";
  grid-template-columns: minmax(0, 1fr) minmax(0, var(--bf-application-aside-width));
  grid-template-rows: minmax(0, 1fr);
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
  box-shadow: 0 24px 72px rgba(0, 0, 0, 0.38);
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
  inset-inline-start: calc(var(--bf-baseline) * -3);
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
  background: var(--bf-color-border-default);
  border-radius: 999px;
  content: "";
  inset-block: var(--bf-panel-padding-block);
  inset-inline-start: calc(50% - 1px);
  opacity: 0.95;
  position: absolute;
  transition: background-color 120ms ease, opacity 120ms ease;
  width: 2px;
}

:where(.bf-theme) :where(.bf-application-aside-resize-handle):hover::after,
:where(.bf-theme) :where(.bf-application-aside-resize-handle):focus-visible::after,
:where(.bf-theme) :where(.bf-application.is-resizing-aside) :where(.bf-application-aside-resize-handle)::after {
  background: var(--bf-application-resize-handle-active);
}

:where(.bf-theme) :where(.bf-application-aside-resize-handle):focus-visible {
  outline: 2px solid var(--bf-application-resize-handle-focus-ring);
  outline-offset: -2px;
}

@media (min-width: 64.75rem) {
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
