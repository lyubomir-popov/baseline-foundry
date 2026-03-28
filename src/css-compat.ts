import type { ThemeTokens, TypographyToken } from "./types.js";

function typeStyles(token: TypographyToken, options: {
  fontWeight?: number;
  includeCase?: boolean;
} = {}): string {
  const fontVariantCaps = options.includeCase !== false && token.fontVariantCaps
    ? `  font-variant-caps: ${token.fontVariantCaps};\n`
    : "";
  const letterSpacing = options.includeCase !== false && token.letterSpacing
    ? `  letter-spacing: ${token.letterSpacing};\n`
    : "";
  const textTransform = options.includeCase !== false && token.textTransform
    ? `  text-transform: ${token.textTransform};\n`
    : "";

  return `  font-family: ${token.fontStack};\n  font-size: ${token.fontSize};\n  font-style: ${token.fontStyle ?? "normal"};\n  font-weight: ${options.fontWeight ?? token.fontWeight ?? 400};\n${fontVariantCaps}${letterSpacing}${textTransform}  line-height: ${token.lineHeight};\n`;
}

export function compatCss(tokens: ThemeTokens): string {
  const body = tokens.roles.body;
  const h4 = tokens.roles.h4 ?? body;
  const h5 = tokens.roles.h5 ?? body;
  const h6 = tokens.roles.h6 ?? body;
  const components = tokens.components;

  return `:where(.bf-theme, .vr-theme) {
  --bf-border-width: ${components.borderWidth};
  --bf-radius: ${components.radius};
  --bf-control-inline-padding: ${components.controlInlinePadding};
  --bf-control-visual-size: ${components.controlVisualSize};
  --bf-control-block-size: ${components.controlMinBlockSize};
  --bf-control-block-size-dense: ${components.controlMinBlockSizeDense};
  --bf-field-gap: ${components.fieldGap};
  --bf-panel-padding-inline: ${components.panelPaddingInline};
  --bf-panel-padding-block: ${components.panelPaddingBlock};
  --bf-accordion-indent: ${components.accordionIndent};
  --bf-app-aside-width: 30rem;
  --bf-app-aside-width-narrow: 18rem;
  --bf-app-aside-width-max: 42rem;
  --bf-app-aside-width-wide: min(100vw, 42rem);
  --bf-app-navigation-width: 15rem;
  --bf-app-navigation-width-collapsed: calc(var(--bf-baseline) * 4);
  --bf-navigation-bar-min-block-size: calc(var(--bf-baseline) * 6);
  --vr-baseline: var(--bf-baseline);
  --vr-border-width: var(--bf-border-width);
  --vr-radius: var(--bf-radius);
  --vr-control-inline-padding: var(--bf-control-inline-padding);
  --vr-control-visual-size: var(--bf-control-visual-size);
  --vr-control-block-size: var(--bf-control-block-size);
  --vr-control-block-size-dense: var(--bf-control-block-size-dense);
  --vr-field-gap: var(--bf-field-gap);
  --vr-panel-padding-inline: var(--bf-panel-padding-inline);
  --vr-panel-padding-block: var(--bf-panel-padding-block);
  --vr-grid-gap-inline: var(--bf-grid-gap-inline);
  --vr-grid-gap-block: var(--bf-grid-gap-block);
  --vr-grid-max-inline-size: var(--bf-content-max-width);
  --vr-application-aside-width: var(--bf-app-aside-width);
  --vr-application-aside-width-narrow: var(--bf-app-aside-width-narrow);
  --vr-application-aside-width-max: var(--bf-app-aside-width-max);
  --vr-application-aside-width-wide: var(--bf-app-aside-width-wide);
  --vr-application-navigation-width: var(--bf-app-navigation-width);
  --vr-application-navigation-width-collapsed: var(--bf-app-navigation-width-collapsed);
  --vr-navigation-bar-min-block-size: var(--bf-navigation-bar-min-block-size);
  --vr-accordion-indent: var(--bf-accordion-indent);
  --vr-color-text-default: var(--vf-color-text-default, var(--bf-color-text, #000000));
  --vr-color-text-muted: var(--vf-color-text-muted, rgba(0, 0, 0, 0.6));
  --vr-color-text-inactive: var(--vf-color-text-inactive, rgba(0, 0, 0, 0.75));
  --vr-color-link-default: var(--vf-color-link-default, var(--bf-color-accent, #0f62fe));
  --vr-color-background-default: var(--vf-color-background-default, #ffffff);
  --vr-color-background-alt: var(--vf-color-background-alt, #f7f7f7);
  --vr-color-background-inputs: var(--vf-color-background-inputs, #ffffff);
  --vr-color-background-hover: var(--vf-color-background-hover, #f3f3f3);
  --vr-color-background-active: var(--vf-color-background-active, #ebebeb);
  --vr-color-background-overlay: var(--vf-color-background-overlay, rgba(0, 0, 0, 0.72));
  --vr-color-border-default: var(--vf-color-border-default, rgba(0, 0, 0, 0.2));
  --vr-color-border-high-contrast: var(--vf-color-border-high-contrast, #707070);
  --vr-color-border-low-contrast: var(--vf-color-border-low-contrast, rgba(0, 0, 0, 0.1));
  --vr-color-border-positive: var(--vf-color-border-positive, #0e8420);
  --vr-color-border-caution: var(--vf-color-border-caution, #cc7900);
  --vr-color-border-negative: var(--vf-color-border-negative, #c7162b);
  --vr-color-border-information: var(--vf-color-border-information, #24598f);
  --vr-color-background-positive-default: var(--vf-color-background-positive-default, hsl(129deg 90% 39% / 10%));
  --vr-color-background-positive-hover: var(--vf-color-background-positive-hover, hsl(129deg 100% 39% / 15%));
  --vr-color-background-positive-active: var(--vf-color-background-positive-active, hsl(129deg 100% 39% / 18%));
  --vr-color-background-caution-default: var(--vf-color-background-caution-default, hsl(27deg 100% 39% / 10%));
  --vr-color-background-caution-hover: var(--vf-color-background-caution-hover, hsl(27deg 100% 39% / 15%));
  --vr-color-background-caution-active: var(--vf-color-background-caution-active, hsl(27deg 100% 39% / 18%));
  --vr-color-background-negative-default: var(--vf-color-background-negative-default, hsl(354deg 100% 39% / 10%));
  --vr-color-background-negative-hover: var(--vf-color-background-negative-hover, hsl(354deg 100% 39% / 15%));
  --vr-color-background-negative-active: var(--vf-color-background-negative-active, hsl(354deg 100% 39% / 18%));
  --vr-color-background-information-default: var(--vf-color-background-information-default, hsl(210deg 100% 39% / 10%));
  --vr-color-background-information-hover: var(--vf-color-background-information-hover, hsl(210deg 100% 39% / 15%));
  --vr-color-background-information-active: var(--vf-color-background-information-active, hsl(210deg 100% 39% / 18%));
  --vr-color-focus: var(--vf-color-focus, var(--bf-color-accent, #0f62fe));
  --vr-icon-chevron-down: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%23000' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4.25 6.25 8 10l3.75-3.75'/%3E%3C/svg%3E");
  color: var(--vr-color-text-default);
}

:where(.vr-theme.is-dark),
:where(.vr-theme[data-bf-tone='dark']),
:where(.bf-theme[data-bf-tone='dark']) {
  --vr-color-text-default: var(--vf-color-text-default, #ffffff);
  --vr-color-text-muted: var(--vf-color-text-muted, rgba(255, 255, 255, 0.6));
  --vr-color-text-inactive: var(--vf-color-text-inactive, rgba(255, 255, 255, 0.75));
  --vr-color-link-default: var(--vf-color-link-default, #6699cc);
  --vr-color-background-default: var(--vf-color-background-default, #262626);
  --vr-color-background-alt: var(--vf-color-background-alt, #202020);
  --vr-color-background-inputs: var(--vf-color-background-inputs, #2f2f2f);
  --vr-color-background-hover: var(--vf-color-background-hover, #313131);
  --vr-color-background-active: var(--vf-color-background-active, #373737);
  --vr-color-border-default: var(--vf-color-border-default, rgba(255, 255, 255, 0.2));
  --vr-color-border-high-contrast: var(--vf-color-border-high-contrast, #939393);
  --vr-color-border-low-contrast: var(--vf-color-border-low-contrast, rgba(255, 255, 255, 0.1));
  --vr-color-border-positive: var(--vf-color-border-positive, #62a36c);
  --vr-color-border-caution: var(--vf-color-border-caution, #c48831);
  --vr-color-border-negative: var(--vf-color-border-negative, #d17b85);
  --vr-color-border-information: var(--vf-color-border-information, hsl(210deg 80% 65%));
  --vr-color-background-positive-default: var(--vf-color-background-positive-default, hsl(129deg 90% 39% / 20%));
  --vr-color-background-positive-hover: var(--vf-color-background-positive-hover, hsl(129deg 100% 39% / 30%));
  --vr-color-background-positive-active: var(--vf-color-background-positive-active, hsl(129deg 100% 39% / 36%));
  --vr-color-background-caution-default: var(--vf-color-background-caution-default, hsl(27deg 100% 50% / 20%));
  --vr-color-background-caution-hover: var(--vf-color-background-caution-hover, hsl(27deg 100% 60% / 30%));
  --vr-color-background-caution-active: var(--vf-color-background-caution-active, hsl(27deg 100% 50% / 36%));
  --vr-color-background-negative-default: var(--vf-color-background-negative-default, hsl(353deg 100% 70% / 20%));
  --vr-color-background-negative-hover: var(--vf-color-background-negative-hover, hsl(353deg 100% 70% / 30%));
  --vr-color-background-negative-active: var(--vf-color-background-negative-active, hsl(353deg 100% 70% / 36%));
  --vr-color-background-information-default: var(--vf-color-background-information-default, hsl(210deg 100% 50% / 20%));
  --vr-color-background-information-hover: var(--vf-color-background-information-hover, hsl(210deg 100% 50% / 30%));
  --vr-color-background-information-active: var(--vf-color-background-information-active, hsl(210deg 100% 50% / 36%));
  --vr-color-focus: var(--vf-color-focus, #99ccff);
  --vr-icon-chevron-down: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%23fff' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4.25 6.25 8 10l3.75-3.75'/%3E%3C/svg%3E");
  color-scheme: dark;
}

:where(.vr-theme.vr-theme--light),
:where(.vr-theme[data-bf-tone='light']),
:where(.bf-theme[data-bf-tone='light']) {
  color-scheme: light;
}

:where(.bf-theme, .vr-theme) :where(.p-form__label, .bf-form__label, .p-form-help-text, .bf-form-help, .p-panel__title, .bf-panel__title, .p-tabs__link, .bf-tabs__link, .p-button, .p-button--base, .bf-button, .bf-button--base, .p-accordion__tab, .bf-accordion__tab, .p-modal__title, .bf-modal__title) {
  margin: 0;
}

:where(.bf-theme, .vr-theme) :where(.u-no-margin--bottom, .bf-u-no-margin--bottom) {
  margin-bottom: 0 !important;
}

:where(.bf-theme, .vr-theme) :where(.p-form__label, .bf-form__label) {
${typeStyles(h6, { includeCase: false })}  color: var(--vr-color-text-default);
  display: block;
  overflow-wrap: anywhere;
  text-align: start;
}

:where(.bf-theme, .vr-theme) :where(.p-form-help-text, .bf-form-help) {
${typeStyles(body, { includeCase: false })}  color: var(--vr-color-text-muted);
  display: block;
  margin-bottom: 0;
  max-inline-size: 42ch;
  overflow-wrap: anywhere;
}

:where(.bf-theme, .vr-theme) :where(.p-form-help-text.is-tight, .bf-form-help.is-tight, .control-help) {
  margin-top: calc(var(--vr-baseline) * -1);
}

:where(.bf-theme, .vr-theme) :where(.p-form__group, .bf-field) {
  display: grid;
  gap: var(--vr-field-gap);
  margin: 0;
  min-inline-size: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-form__control, .bf-control) {
  display: grid;
  gap: var(--vr-field-gap);
  min-inline-size: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-form__group--checkbox, .bf-field--checkbox) {
  gap: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-form__group--checkbox, .bf-field--checkbox) :where(.p-form__control, .bf-control) {
  gap: 0;
}

:where(.bf-theme, .vr-theme) :where(fieldset, .p-form__fieldset, .bf-fieldset) {
  border: var(--vr-border-width) solid var(--vr-color-border-default);
  margin: 0;
  min-inline-size: 0;
  padding-block-end: calc(var(--vr-panel-padding-block) - var(--vr-border-width));
  padding-inline: var(--vr-panel-padding-inline);
  padding-block-start: var(--vr-panel-padding-block);
}

:where(.bf-theme, .vr-theme) :where(fieldset, .p-form__fieldset, .bf-fieldset) > :where(legend, .p-form__legend, .bf-legend) {
  margin-bottom: 0;
  padding-inline: calc(var(--vr-baseline) * 0.5);
}

:where(.bf-theme, .vr-theme) :where(
  .p-form-validation__input,
  .bf-input,
  input[type='text'],
  input[type='number'],
  input[type='search'],
  input[type='password'],
  input[type='email'],
  input[type='url'],
  textarea,
  select
) {
${typeStyles(body, { includeCase: false })}  appearance: none;
  background-color: var(--vr-color-background-inputs);
  border: 0 solid transparent;
  border-bottom: var(--vr-border-width) solid var(--vr-color-border-high-contrast);
  border-top: var(--vr-border-width) solid transparent;
  border-radius: var(--vr-radius);
  color: var(--vr-color-text-default);
  block-size: var(--vr-control-block-size);
  inline-size: 100%;
  max-inline-size: 100%;
  min-inline-size: 0;
  padding-block: calc((var(--vr-control-block-size) - ${body.lineHeight} - (var(--vr-border-width) * 2)) / 2);
  padding-inline: var(--vr-control-inline-padding);
}

:where(.bf-theme, .vr-theme) :where(
  .p-form-validation__input.is-dense,
  .bf-input.is-dense
) {
  block-size: var(--vr-control-block-size-dense);
  padding-block: calc((var(--vr-control-block-size-dense) - ${body.lineHeight} - (var(--vr-border-width) * 2)) / 2);
}

:where(.bf-theme, .vr-theme) :where(input[type='color'].p-color-input, input[type='color'].bf-color-input, input[type='color'].control-color) {
  inline-size: 4rem;
  min-block-size: var(--vr-control-block-size);
  padding: calc(var(--vr-baseline) * 0.5);
}

:where(.bf-theme, .vr-theme) :where(
  .p-form-validation__input,
  .bf-input,
  input[type='text'],
  input[type='number'],
  input[type='search'],
  input[type='password'],
  input[type='email'],
  input[type='url'],
  textarea,
  select
):hover {
  background-color: var(--vr-color-background-hover);
}

:where(.bf-theme, .vr-theme) :where(
  .p-form-validation__input,
  .bf-input,
  input[type='text'],
  input[type='number'],
  input[type='search'],
  input[type='password'],
  input[type='email'],
  input[type='url'],
  textarea,
  select
):focus {
  background-color: var(--vr-color-background-active);
  outline: none;
}

:where(.bf-theme, .vr-theme) :where(
  .p-form-validation__input,
  .bf-input,
  input[type='text'],
  input[type='number'],
  input[type='search'],
  input[type='password'],
  input[type='email'],
  input[type='url'],
  textarea,
  select
):focus-visible {
  outline: 2px solid var(--vr-color-focus);
  outline-offset: 2px;
}

:where(.bf-theme, .vr-theme) :where(
  .p-form-validation__input,
  .bf-input,
  input[type='text'],
  input[type='number'],
  input[type='search'],
  input[type='password'],
  input[type='email'],
  input[type='url'],
  textarea,
  select
):disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

:where(.bf-theme, .vr-theme) :where(
  .p-form-validation__input,
  .bf-input,
  input[type='text'],
  input[type='number'],
  input[type='search'],
  input[type='password'],
  input[type='email'],
  input[type='url'],
  textarea,
  select
)[readonly] {
  background-color: var(--vr-color-background-alt);
  color: var(--vr-color-text-muted);
}

:where(.bf-theme, .vr-theme) :where(textarea) {
  block-size: auto;
  min-block-size: calc(var(--vr-control-block-size) * 2);
  resize: vertical;
}

:where(.bf-theme, .vr-theme) :where(input[type='file']) {
${typeStyles(body, { includeCase: false })}  background: transparent;
  border: 0 solid transparent;
  border-bottom: var(--vr-border-width) solid var(--vr-color-border-default);
  border-top: var(--vr-border-width) solid transparent;
  color: var(--vr-color-text-default);
  block-size: var(--vr-control-block-size);
  max-inline-size: 100%;
  min-block-size: var(--vr-control-block-size);
  min-inline-size: 0;
  padding-block: calc((var(--vr-control-block-size) - ${body.lineHeight} - (var(--vr-border-width) * 2)) / 2);
  padding-inline: 0;
  width: 100%;
}

:where(.bf-theme, .vr-theme) :where(input[type='file'])::file-selector-button {
${typeStyles(h6, { includeCase: false })}  appearance: none;
  background: var(--vr-color-background-alt);
  border: var(--vr-border-width) solid var(--vr-color-border-default);
  border-radius: var(--vr-radius);
  color: var(--vr-color-text-default);
  cursor: pointer;
  margin-inline-end: var(--vr-field-gap);
  padding-block: calc((var(--vr-control-block-size-dense) - ${h6.lineHeight} - (var(--vr-border-width) * 2)) / 2);
  padding-inline: var(--vr-control-inline-padding);
}

:where(.bf-theme, .vr-theme) :where(input[type='file'])::file-selector-button:hover {
  background: var(--vr-color-background-hover);
}

:where(.bf-theme, .vr-theme) :where(select) {
  background-image: var(--vr-icon-chevron-down);
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
  padding-inline-end: calc(var(--vr-control-inline-padding) * 2.5);
}

:where(.bf-theme, .vr-theme) :where(input[type='number'], .p-slider__input, .bf-slider__input) {
  font-variant-numeric: tabular-nums;
}

:where(.bf-theme, .vr-theme) :where(.p-slider__input, .bf-slider__input) {
  flex: 0 1 5rem;
  inline-size: min(100%, 5rem);
  justify-self: end;
  max-inline-size: 100%;
  min-inline-size: 0;
  text-align: right;
}

:where(.bf-theme, .vr-theme) :where(input[type='number'])::-webkit-inner-spin-button,
:where(.bf-theme, .vr-theme) :where(input[type='number'])::-webkit-outer-spin-button {
  margin: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-checkbox, .bf-checkbox, .p-radio, .bf-radio) {
  margin: 0;
  min-block-size: max(var(--vr-control-block-size-dense), calc(${body.lineHeight} + var(--vr-baseline)));
  position: relative;
}

:where(.bf-theme, .vr-theme) :where(.p-checkbox__input, .bf-checkbox__input, .p-radio__input, .bf-radio__input) {
  block-size: var(--vr-control-visual-size);
  inline-size: var(--vr-control-visual-size);
  left: 0;
  margin: 0;
  opacity: 0;
  position: absolute;
  top: calc((${body.lineHeight} - var(--vr-control-visual-size)) / 2);
}

:where(.bf-theme, .vr-theme) :where(.p-checkbox__label, .bf-checkbox__label, .p-radio__label, .bf-radio__label) {
${typeStyles(body, { includeCase: false })}  color: var(--vr-color-text-default);
  cursor: pointer;
  display: block;
  margin-bottom: 0;
  min-block-size: max(var(--vr-control-block-size-dense), calc(${body.lineHeight} + var(--vr-baseline)));
  padding-inline-start: calc(var(--vr-control-visual-size) + var(--vr-field-gap));
  position: relative;
}

:where(.bf-theme, .vr-theme) :where(.p-checkbox__label, .bf-checkbox__label, .p-radio__label, .bf-radio__label)::before,
:where(.bf-theme, .vr-theme) :where(.p-checkbox__label, .bf-checkbox__label, .p-radio__label, .bf-radio__label)::after {
  content: "";
  position: absolute;
}

:where(.bf-theme, .vr-theme) :where(.p-checkbox__label, .bf-checkbox__label, .p-radio__label, .bf-radio__label)::before {
  background: var(--vr-color-background-default);
  block-size: var(--vr-control-visual-size);
  border: var(--vr-border-width) solid var(--vr-color-border-high-contrast);
  inline-size: var(--vr-control-visual-size);
  inset-inline-start: 0;
  inset-block-start: calc((${body.lineHeight} - var(--vr-control-visual-size)) / 2);
}

:where(.bf-theme, .vr-theme) :where(.p-checkbox__label:hover, .bf-checkbox__label:hover, .p-radio__label:hover, .bf-radio__label:hover)::before {
  background: var(--vr-color-background-hover);
}

:where(.bf-theme, .vr-theme) :where(.p-checkbox__label, .bf-checkbox__label)::after {
  block-size: calc(var(--vr-control-visual-size) * 0.35);
  border-bottom: calc(var(--vr-border-width) * 2) solid var(--vr-color-background-default);
  border-left: calc(var(--vr-border-width) * 2) solid var(--vr-color-background-default);
  inline-size: calc(var(--vr-control-visual-size) * 0.6);
  inset-inline-start: calc(var(--vr-control-visual-size) * 0.2);
  inset-block-start: calc(((${body.lineHeight} - var(--vr-control-visual-size)) / 2) + (var(--vr-control-visual-size) * 0.18));
  opacity: 0;
  transform: rotate(-45deg);
}

:where(.bf-theme, .vr-theme) :where(.p-radio__label, .bf-radio__label)::before {
  border-radius: 50%;
}

:where(.bf-theme, .vr-theme) :where(.p-radio__label, .bf-radio__label)::after {
  background: var(--vr-color-background-default);
  block-size: calc(var(--vr-control-visual-size) * 0.45);
  border-radius: 50%;
  inline-size: calc(var(--vr-control-visual-size) * 0.45);
  inset-inline-start: calc(var(--vr-control-visual-size) * 0.275);
  inset-block-start: calc(((${body.lineHeight} - var(--vr-control-visual-size)) / 2) + (var(--vr-control-visual-size) * 0.275));
  opacity: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-checkbox__input:checked + .p-checkbox__label, .bf-checkbox__input:checked + .bf-checkbox__label)::before {
  background: var(--vr-color-link-default);
  border-color: var(--vr-color-link-default);
}

:where(.bf-theme, .vr-theme) :where(.p-checkbox__input:checked + .p-checkbox__label, .bf-checkbox__input:checked + .bf-checkbox__label)::after {
  opacity: 1;
}

:where(.bf-theme, .vr-theme) :where(.p-radio__input:checked + .p-radio__label, .bf-radio__input:checked + .bf-radio__label)::before {
  background: var(--vr-color-link-default);
  border-color: var(--vr-color-link-default);
}

:where(.bf-theme, .vr-theme) :where(.p-radio__input:checked + .p-radio__label, .bf-radio__input:checked + .bf-radio__label)::after {
  opacity: 1;
}

:where(.bf-theme, .vr-theme) :where(.p-checkbox__input:focus-visible + .p-checkbox__label, .bf-checkbox__input:focus-visible + .bf-checkbox__label)::before {
  outline: 2px solid var(--vr-color-focus);
  outline-offset: 2px;
}

:where(.bf-theme, .vr-theme) :where(.p-radio__input:focus-visible + .p-radio__label, .bf-radio__input:focus-visible + .bf-radio__label)::before {
  outline: 2px solid var(--vr-color-focus);
  outline-offset: 2px;
}

:where(.bf-theme, .vr-theme) :where(.p-switch, .bf-switch) {
  align-items: flex-start;
  display: inline-flex;
  gap: var(--vr-field-gap);
  position: relative;
}

:where(.bf-theme, .vr-theme) :where(.p-switch__input, .bf-switch__input) {
  block-size: var(--vr-control-visual-size);
  inline-size: calc(var(--vr-control-visual-size) * 2);
  inset-block-start: calc((${body.lineHeight} - var(--vr-control-visual-size)) / 2);
  inset-inline-start: 0;
  margin: 0;
  opacity: 0;
  position: absolute;
}

:where(.bf-theme, .vr-theme) :where(.p-switch__slider, .bf-switch__slider) {
  background: var(--vr-color-border-high-contrast);
  block-size: var(--vr-control-visual-size);
  border-radius: var(--vr-control-visual-size);
  display: inline-block;
  flex: none;
  inline-size: calc(var(--vr-control-visual-size) * 2);
  position: relative;
}

:where(.bf-theme, .vr-theme) :where(.p-switch__slider, .bf-switch__slider)::before {
  background: var(--vr-color-background-default);
  block-size: var(--vr-control-visual-size);
  border: var(--vr-border-width) solid var(--vr-color-border-high-contrast);
  border-radius: 50%;
  content: "";
  inline-size: var(--vr-control-visual-size);
  inset-block-start: 0;
  inset-inline-start: 0;
  position: absolute;
  transition: transform 160ms ease;
}

:where(.bf-theme, .vr-theme) :where(.p-switch__input:checked + .p-switch__slider, .bf-switch__input:checked + .bf-switch__slider) {
  background: var(--vr-color-link-default);
}

:where(.bf-theme, .vr-theme) :where(.p-switch__input:checked + .p-switch__slider, .bf-switch__input:checked + .bf-switch__slider)::before {
  border-color: var(--vr-color-link-default);
  transform: translateX(100%);
}

:where(.bf-theme, .vr-theme) :where(.p-switch__input:focus-visible + .p-switch__slider, .bf-switch__input:focus-visible + .bf-switch__slider) {
  outline: 2px solid var(--vr-color-focus);
  outline-offset: 2px;
}

:where(.bf-theme, .vr-theme) :where(.p-switch__input:disabled + .p-switch__slider, .bf-switch__input:disabled + .bf-switch__slider) {
  opacity: 0.6;
}

:where(.bf-theme, .vr-theme) :where(.p-switch__label, .bf-switch__label) {
${typeStyles(body, { includeCase: false })}  color: var(--vr-color-text-default);
  cursor: pointer;
  margin: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-form-validation__message, .bf-validation-message) {
${typeStyles(body, { includeCase: false })}  color: var(--vr-color-text-muted);
  margin: 0;
  padding-inline-start: calc(var(--vr-control-visual-size) + var(--vr-field-gap));
  position: relative;
}

:where(.bf-theme, .vr-theme) :where(.p-form-validation__message, .bf-validation-message)::before {
  background: var(--vr-color-border-information);
  block-size: calc(var(--vr-control-visual-size) * 0.5);
  border-radius: 50%;
  content: "";
  inline-size: calc(var(--vr-control-visual-size) * 0.5);
  inset-block-start: calc((${body.lineHeight} - (var(--vr-control-visual-size) * 0.5)) / 2);
  inset-inline-start: 0;
  position: absolute;
}

:where(.bf-theme, .vr-theme) :where(.is-caution, .bf-validation--caution) :where(.p-form-validation__input, .bf-input, input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select) {
  background-color: var(--vr-color-background-caution-default);
  border-bottom-color: var(--vr-color-border-caution);
}

:where(.bf-theme, .vr-theme) :where(.is-caution, .bf-validation--caution) :where(.p-form-validation__input, .bf-input, input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select):hover {
  background-color: var(--vr-color-background-caution-hover);
}

:where(.bf-theme, .vr-theme) :where(.is-caution, .bf-validation--caution) :where(.p-form-validation__input, .bf-input, input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select):focus {
  background-color: var(--vr-color-background-caution-active);
}

:where(.bf-theme, .vr-theme) :where(.is-caution, .bf-validation--caution) :where(.p-form-validation__message, .bf-validation-message) {
  color: var(--vr-color-border-caution);
}

:where(.bf-theme, .vr-theme) :where(.is-caution, .bf-validation--caution) :where(.p-form-validation__message, .bf-validation-message)::before {
  background: var(--vr-color-border-caution);
}

:where(.bf-theme, .vr-theme) :where(.is-error, .bf-validation--error, .has-error) :where(.p-form-validation__input, .bf-input, input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select) {
  background-color: var(--vr-color-background-negative-default);
  border-bottom-color: var(--vr-color-border-negative);
}

:where(.bf-theme, .vr-theme) :where(.is-error, .bf-validation--error, .has-error) :where(.p-form-validation__input, .bf-input, input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select):hover {
  background-color: var(--vr-color-background-negative-hover);
}

:where(.bf-theme, .vr-theme) :where(.is-error, .bf-validation--error, .has-error) :where(.p-form-validation__input, .bf-input, input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select):focus {
  background-color: var(--vr-color-background-negative-active);
}

:where(.bf-theme, .vr-theme) :where(.is-error, .bf-validation--error, .has-error) :where(.p-form-validation__message, .bf-validation-message) {
  color: var(--vr-color-border-negative);
}

:where(.bf-theme, .vr-theme) :where(.is-error, .bf-validation--error, .has-error) :where(.p-form-validation__message, .bf-validation-message)::before {
  background: var(--vr-color-border-negative);
}

:where(.bf-theme, .vr-theme) :where(.is-success, .bf-validation--success, .has-success) :where(.p-form-validation__input, .bf-input, input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select) {
  background-color: var(--vr-color-background-positive-default);
  border-bottom-color: var(--vr-color-border-positive);
}

:where(.bf-theme, .vr-theme) :where(.is-success, .bf-validation--success, .has-success) :where(.p-form-validation__input, .bf-input, input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select):hover {
  background-color: var(--vr-color-background-positive-hover);
}

:where(.bf-theme, .vr-theme) :where(.is-success, .bf-validation--success, .has-success) :where(.p-form-validation__input, .bf-input, input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select):focus {
  background-color: var(--vr-color-background-positive-active);
}

:where(.bf-theme, .vr-theme) :where(.is-success, .bf-validation--success, .has-success) :where(.p-form-validation__message, .bf-validation-message) {
  color: var(--vr-color-border-positive);
}

:where(.bf-theme, .vr-theme) :where(.is-success, .bf-validation--success, .has-success) :where(.p-form-validation__message, .bf-validation-message)::before {
  background: var(--vr-color-border-positive);
}

:where(.bf-theme, .vr-theme) :where(.has-warning) :where(.p-form-validation__input, .bf-input, input[type='text'], input[type='number'], input[type='search'], input[type='password'], input[type='email'], input[type='url'], textarea, select) {
  background-color: var(--vr-color-background-caution-default);
  border-bottom-color: var(--vr-color-border-caution);
}

:where(.bf-theme, .vr-theme) :where(.p-slider__wrapper, .bf-slider, .slider-pair) {
  align-items: flex-end;
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--vr-field-gap);
  inline-size: 100%;
  max-inline-size: 100%;
  min-inline-size: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-slider__wrapper--stacked, .bf-slider--stacked, .slider-pair--stacked) {
  align-items: stretch;
  display: grid;
  gap: var(--vr-field-gap);
  grid-template-columns: minmax(0, 1fr);
}

:where(.bf-theme, .vr-theme) :where(.p-slider__wrapper, .bf-slider, .slider-pair) :where(input[type='range']) {
  flex: 1 1 8rem;
  inline-size: 100%;
  min-inline-size: 0;
}

:where(.bf-theme, .vr-theme) :where(input[type='range']) {
  appearance: none;
  background: transparent;
  block-size: var(--vr-control-block-size-dense);
  border: 0;
  margin: 0;
  padding: 0;
}

:where(.bf-theme, .vr-theme) :where(input[type='range']):focus {
  outline: none;
}

:where(.bf-theme, .vr-theme) :where(input[type='range'])::-webkit-slider-runnable-track {
  background: linear-gradient(
    to right,
    var(--vr-color-link-default) 0,
    var(--vr-color-link-default) var(--vr-range-fill-percent, 0%),
    var(--vr-color-border-default) var(--vr-range-fill-percent, 0%),
    var(--vr-color-border-default) 100%
  );
  block-size: calc(var(--vr-baseline) * 0.25);
  border-radius: var(--vr-baseline);
}

:where(.bf-theme, .vr-theme) :where(input[type='range'])::-webkit-slider-thumb {
  appearance: none;
  background: var(--vr-color-background-default);
  border: var(--vr-border-width) solid var(--vr-color-border-high-contrast);
  block-size: var(--vr-control-visual-size);
  border-radius: 50%;
  box-shadow: 0 0 calc(var(--vr-control-visual-size) * 0.25) 1px rgba(0, 0, 0, 0.2);
  inline-size: var(--vr-control-visual-size);
  margin-top: calc((calc(var(--vr-baseline) * 0.25) - var(--vr-control-visual-size)) / 2);
}

:where(.bf-theme, .vr-theme) :where(input[type='range']):focus-visible::-webkit-slider-thumb {
  outline: calc(var(--vr-baseline) * 0.25) solid var(--vr-color-focus);
}

:where(.bf-theme, .vr-theme) :where(input[type='range'])::-moz-range-track {
  background: var(--vr-color-border-default);
  block-size: calc(var(--vr-baseline) * 0.25);
  border-radius: var(--vr-baseline);
}

:where(.bf-theme, .vr-theme) :where(input[type='range'])::-moz-range-progress {
  background: var(--vr-color-link-default);
  block-size: calc(var(--vr-baseline) * 0.25);
  border-radius: var(--vr-baseline);
}

:where(.bf-theme, .vr-theme) :where(input[type='range'])::-moz-range-thumb {
  background: var(--vr-color-background-default);
  border: var(--vr-border-width) solid var(--vr-color-border-high-contrast);
  block-size: var(--vr-control-visual-size);
  border-radius: 50%;
  box-shadow: 0 0 calc(var(--vr-control-visual-size) * 0.25) 1px rgba(0, 0, 0, 0.2);
  inline-size: var(--vr-control-visual-size);
}

:where(.bf-theme, .vr-theme) :where(input[type='range']):focus-visible::-moz-range-thumb {
  outline: calc(var(--vr-baseline) * 0.25) solid var(--vr-color-focus);
}

:where(.bf-theme, .vr-theme) :where(.p-button, .p-button--base, .bf-button, .bf-button--base) {
${typeStyles(h6, { includeCase: false })}  align-items: center;
  appearance: none;
  background-color: var(--vr-color-background-default);
  border: var(--vr-border-width) solid var(--vr-color-border-high-contrast);
  border-radius: var(--vr-radius);
  color: var(--vr-color-text-default);
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  block-size: var(--vr-control-block-size);
  padding-block: calc((var(--vr-control-block-size) - ${h6.lineHeight} - (var(--vr-border-width) * 2)) / 2);
  padding-inline: var(--vr-control-inline-padding);
  text-align: center;
  text-decoration: none;
}

:where(.bf-theme, .vr-theme) :where(.p-button, .bf-button) {
  background-color: var(--vr-color-background-active);
}

:where(.bf-theme, .vr-theme) :where(.p-button, .p-button--base, .bf-button, .bf-button--base):hover {
  background-color: var(--vr-color-background-hover);
}

:where(.bf-theme, .vr-theme) :where(.p-button, .p-button--base, .bf-button, .bf-button--base):focus {
  outline: none;
}

:where(.bf-theme, .vr-theme) :where(.p-button, .p-button--base, .bf-button, .bf-button--base):focus-visible {
  outline: 2px solid var(--vr-color-focus);
  outline-offset: 2px;
}

:where(.bf-theme, .vr-theme) :where(.p-button.is-dense, .p-button--base.is-dense, .bf-button.is-dense, .bf-button--base.is-dense) {
  block-size: var(--vr-control-block-size-dense);
  padding-block: calc((var(--vr-control-block-size-dense) - ${h6.lineHeight} - (var(--vr-border-width) * 2)) / 2);
}

:where(.bf-theme, .vr-theme) :where(.p-actions, .bf-actions, .main-actions, .playback-export-actions) {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: var(--vr-field-gap);
  min-inline-size: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-actions[data-align='end'], .bf-actions[data-align='end'], .p-actions.is-end, .bf-actions.is-end, .main-actions) {
  justify-content: flex-end;
}

:where(.bf-theme, .vr-theme) :where(.p-actions.is-nowrap, .bf-actions.is-nowrap, .playback-export-actions) {
  flex-wrap: nowrap;
  overflow-x: auto;
  scrollbar-width: thin;
}

:where(.bf-theme, .vr-theme) :where(.p-actions.is-nowrap, .bf-actions.is-nowrap, .playback-export-actions) > * {
  flex: 0 0 auto;
}

:where(.bf-theme, .vr-theme) :where(.p-panel, .bf-panel) {
  background: var(--vr-color-background-default);
  border: var(--vr-border-width) solid var(--vr-color-border-default);
  color: var(--vr-color-text-default);
  display: flex;
  flex-direction: column;
  inline-size: 100%;
  max-inline-size: 100%;
  min-block-size: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-panel.is-fill, .bf-panel.is-fill, .drawer-panel) {
  max-inline-size: none;
  min-block-size: 100%;
  resize: none;
}

:where(.bf-theme, .vr-theme) :where(.p-panel__header, .bf-panel__header) {
  align-items: start;
  border-bottom: var(--vr-border-width) solid var(--vr-color-border-default);
  display: flex;
  flex-wrap: wrap;
  gap: var(--vr-field-gap);
  justify-content: space-between;
  padding-block-end: calc(var(--vr-panel-padding-block) - var(--vr-border-width));
  padding-block-start: calc(var(--vr-panel-padding-block) - var(--vr-border-width));
  padding-inline: var(--vr-panel-padding-inline);
}

:where(.bf-theme, .vr-theme) :where(.p-panel__header, .bf-panel__header) > :where(.p-panel__title, .bf-panel__title, .p-panel__logo, .bf-panel__logo) {
  min-inline-size: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-panel__header.is-sticky, .bf-panel__header.is-sticky) {
  background: var(--vr-color-background-default);
  position: sticky;
  top: 0;
  z-index: 5;
}

:where(.bf-theme, .vr-theme) :where(.p-panel__title, .bf-panel__title) {
${typeStyles(h4, { includeCase: false })}  min-inline-size: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-panel__controls, .bf-panel__controls) {
  align-items: start;
  display: flex;
  flex-wrap: wrap;
  gap: var(--vr-field-gap);
  margin-inline-start: auto;
}

:where(.bf-theme, .vr-theme) :where(.p-panel__toggle, .bf-panel__toggle) {
${typeStyles(h6, { includeCase: false })}  align-items: center;
  appearance: none;
  background: transparent;
  border: 0;
  color: var(--vr-color-text-default);
  cursor: pointer;
  display: inline-flex;
  gap: calc(var(--vr-baseline) * 0.5);
  justify-content: flex-start;
  margin: 0;
  min-block-size: var(--vr-control-block-size-dense);
  min-inline-size: 0;
  padding-block: calc((var(--vr-control-block-size-dense) - ${h6.lineHeight}) / 2);
  padding-inline: 0;
  text-align: left;
}

:where(.bf-theme, .vr-theme) :where(.p-panel__toggle:hover, .bf-panel__toggle:hover) {
  color: var(--vr-color-link-default);
}

:where(.bf-theme, .vr-theme) :where(.p-panel__toggle:focus, .bf-panel__toggle:focus) {
  outline: none;
}

:where(.bf-theme, .vr-theme) :where(.p-panel__toggle:focus-visible, .bf-panel__toggle:focus-visible) {
  outline: 2px solid var(--vr-color-focus);
  outline-offset: 2px;
}

:where(.bf-theme, .vr-theme) :where(.p-panel__content, .bf-panel__content) {
  flex: 1 1 auto;
  min-block-size: 0;
  padding-block-end: calc(var(--vr-panel-padding-block) - var(--vr-border-width));
  padding-block-start: var(--vr-panel-padding-block);
  padding-inline: var(--vr-panel-padding-inline);
}

:where(.bf-theme, .vr-theme) :where(.p-panel__content, .bf-panel__content) > :last-child {
  margin-bottom: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-card, .p-card--highlighted, .p-card--overlay, .p-card--muted, .bf-card, .bf-card--highlighted, .bf-card--overlay, .bf-card--muted) {
  --bf-card-background: var(--vr-color-background-default);
  --bf-card-border: var(--vr-color-border-default);
  --bf-card-shadow: none;
  background: var(--bf-card-background);
  border: var(--vr-border-width) solid var(--bf-card-border);
  box-shadow: var(--bf-card-shadow);
  color: var(--vr-color-text-default);
  display: flex;
  flex-direction: column;
  gap: var(--vr-field-gap);
  max-inline-size: 100%;
  overflow: auto;
  padding-block-end: calc(var(--vr-panel-padding-block) - var(--vr-border-width));
  padding-block-start: calc(var(--vr-panel-padding-block) - var(--vr-border-width));
  padding-inline: var(--vr-panel-padding-inline);
}

:where(.bf-theme, .vr-theme) :where(.p-card--highlighted, .bf-card--highlighted) {
  --bf-card-background: color-mix(in srgb, var(--vr-color-background-default) 82%, white 18%);
  --bf-card-shadow: 0 calc(var(--vr-control-visual-size) * 0.25) calc(var(--vr-control-visual-size) * 0.75) rgba(0, 0, 0, 0.16);
}

:where(.bf-theme, .vr-theme) :where(.p-card--overlay, .bf-card--overlay) {
  --bf-card-background: var(--vr-color-background-alt);
}

:where(.bf-theme, .vr-theme) :where(.p-card--muted, .bf-card--muted) {
  --bf-card-background: color-mix(in srgb, var(--vr-color-background-default) 88%, black 12%);
}

:where(.bf-theme, .vr-theme) :where(.p-card__image, .bf-card__image) {
  display: block;
  inline-size: 100%;
  margin: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-card__header, .bf-card__header) {
  border-bottom: var(--vr-border-width) solid var(--vr-color-border-low-contrast);
  display: grid;
  gap: var(--vr-field-gap);
  padding-block-end: calc(var(--vr-panel-padding-block) - var(--vr-border-width));
}

:where(.bf-theme, .vr-theme) :where(.p-card__inner, .bf-card__inner) {
  display: grid;
  gap: var(--vr-field-gap);
}

:where(.bf-theme, .vr-theme) :where(.p-card__content, .bf-card__content) {
  min-inline-size: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-card__thumbnail, .bf-card__thumbnail) {
  block-size: auto;
  max-block-size: calc(var(--vr-control-visual-size) * 2);
}

:where(.bf-theme, .vr-theme) :where(.p-card__inner, .bf-card__inner) > :last-child,
:where(.bf-theme, .vr-theme) :where(.p-card, .p-card--highlighted, .p-card--overlay, .p-card--muted, .bf-card, .bf-card--highlighted, .bf-card--overlay, .bf-card--muted) > :last-child {
  margin-bottom: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-option-grid, .bf-option-grid, .style-palette) {
  display: grid;
  gap: calc(var(--vr-baseline) * 2.5);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 10rem), 1fr));
}

:where(.bf-theme, .vr-theme) :where(.p-option-card, .bf-option-card, .style-palette__button) {
  align-content: start;
  align-items: start;
  background: color-mix(in srgb, var(--vr-color-background-default) 88%, black 12%);
  border: var(--vr-border-width) solid var(--vr-color-border-default);
  color: var(--vr-color-text-default);
  display: grid;
  gap: var(--vr-field-gap);
  margin: 0;
  min-block-size: calc((var(--vr-control-block-size) * 2) + var(--vr-baseline));
  min-inline-size: 0;
  padding-block-end: calc(var(--vr-panel-padding-block) - var(--vr-border-width));
  padding-block-start: calc(var(--vr-panel-padding-block) - var(--vr-border-width));
  padding-inline: var(--vr-panel-padding-inline);
  text-align: left;
}

:where(.bf-theme, .vr-theme) :where(button.p-option-card, button.bf-option-card, button.style-palette__button) {
  appearance: none;
  cursor: pointer;
  transition: border-color 140ms ease, background-color 140ms ease, transform 140ms ease;
}

:where(.bf-theme, .vr-theme) :where(button.p-option-card:hover:not(:disabled), button.bf-option-card:hover:not(:disabled), button.style-palette__button:hover:not(:disabled)) {
  background: var(--vr-color-background-hover);
  border-color: var(--vr-color-focus);
  transform: translateY(-1px);
}

:where(.bf-theme, .vr-theme) :where(.p-option-card.is-active, .bf-option-card.is-active, .style-palette__button.is-active),
:where(.bf-theme, .vr-theme) :where(button.p-option-card:disabled, button.bf-option-card:disabled, button.style-palette__button:disabled) {
  background: color-mix(in srgb, var(--vr-color-background-active) 82%, var(--vr-color-focus) 18%);
  border-color: var(--vr-color-focus);
  color: var(--vr-color-text-default);
}

:where(.bf-theme, .vr-theme) :where(button.p-option-card:focus-visible, button.bf-option-card:focus-visible, button.style-palette__button:focus-visible) {
  outline: 2px solid var(--vr-color-focus);
  outline-offset: -2px;
}

:where(.bf-theme, .vr-theme) :where(.p-option-card__label, .bf-option-card__label, .style-palette__label) {
${typeStyles(body, { fontWeight: 600, includeCase: false })}  display: block;
  margin: 0;
  min-inline-size: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-option-card__meta, .bf-option-card__meta, .style-palette__meta) {
${typeStyles(body, { includeCase: false })}  color: var(--vr-color-text-muted);
  display: block;
  margin: 0;
  min-inline-size: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-option-card__meta.is-quiet, .bf-option-card__meta.is-quiet) {
  color: var(--vr-color-text-inactive);
}

:where(.bf-theme, .vr-theme) :where(.p-divider, .bf-divider) {
  align-items: start;
  container-type: inline-size;
  display: grid;
  gap: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-divider__block, .bf-divider__block) {
  color: var(--vr-color-text-default);
  padding-block-end: calc(var(--vr-panel-padding-block) - var(--vr-border-width));
  padding-block-start: var(--vr-panel-padding-block);
  position: relative;
}

:where(.bf-theme, .vr-theme) :where(.p-divider__block, .bf-divider__block):not(:first-child)::before {
  background-color: var(--vr-color-border-default);
  block-size: var(--vr-border-width);
  content: "";
  inset-inline: 0;
  position: absolute;
  top: 0;
}

@container (width >= 32rem) {
  :where(.bf-theme, .vr-theme) :where(.p-divider, .bf-divider) {
    grid-auto-columns: minmax(0, 1fr);
    grid-auto-flow: column;
  }

  :where(.bf-theme, .vr-theme) :where(.p-divider__block, .bf-divider__block) {
    padding-block-end: 0;
    padding-block-start: 0;
    padding-inline: var(--vr-panel-padding-inline);
  }

  :where(.bf-theme, .vr-theme) :where(.p-divider__block, .bf-divider__block):not(:first-child)::before {
    block-size: auto;
    inline-size: var(--vr-border-width);
    inset-block: 0;
    inset-inline-end: auto;
    inset-inline-start: 0;
    top: auto;
  }
}

:where(.bf-theme, .vr-theme) :where(.p-tabs, .bf-tabs) {
  display: grid;
  min-inline-size: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-tabs__list, .bf-tabs__list) {
  border-bottom: var(--vr-border-width) solid var(--vr-color-border-default);
  display: flex;
  gap: 0;
  list-style: none;
  margin: 0 0 calc((var(--vr-baseline) * 2) - var(--vr-border-width));
  min-inline-size: 0;
  overflow-x: auto;
  padding: 0;
  white-space: nowrap;
}

:where(.bf-theme, .vr-theme) :where(.p-tabs__item, .bf-tabs__item) {
  margin: 0;
  min-inline-size: 0;
  padding: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-tabs__link, .bf-tabs__link) {
${typeStyles(h6, { includeCase: false })}  align-items: center;
  background: transparent;
  border: 0;
  border-bottom: calc(var(--vr-border-width) * 2) solid transparent;
  color: var(--vr-color-text-muted);
  cursor: pointer;
  display: inline-flex;
  gap: calc(var(--vr-baseline) * 0.5);
  justify-content: center;
  min-block-size: var(--vr-control-block-size-dense);
  padding-block: calc((var(--vr-control-block-size-dense) - ${h6.lineHeight} - (var(--vr-border-width) * 2)) / 2);
  padding-inline: var(--vr-control-inline-padding);
  text-decoration: none;
}

:where(.bf-theme, .vr-theme) :where(.p-tabs__link:hover, .bf-tabs__link:hover) {
  background: var(--vr-color-background-hover);
  color: var(--vr-color-text-default);
}

:where(.bf-theme, .vr-theme) :where(.p-tabs__link:focus, .bf-tabs__link:focus) {
  outline: none;
}

:where(.bf-theme, .vr-theme) :where(.p-tabs__link:focus-visible, .bf-tabs__link:focus-visible) {
  color: var(--vr-color-text-default);
  outline: 2px solid var(--vr-color-focus);
  outline-offset: -2px;
}

:where(.bf-theme, .vr-theme) :where(.p-tabs__link.is-active, .p-tabs__link[aria-selected='true'], .bf-tabs__link.is-active, .bf-tabs__link[aria-selected='true']) {
  border-bottom-color: var(--vr-color-text-default);
  color: var(--vr-color-text-default);
}

:where(.bf-theme, .vr-theme) :where(.p-tabs__panel, .bf-tabs__panel) {
  min-inline-size: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-tabs__panel, .bf-tabs__panel)[aria-hidden='true'] {
  display: none;
}

:where(.bf-theme, .vr-theme) :where(.p-tabs--equal, .bf-tabs--equal, .config-tabs, .output-profile-tabs) {
  --vr-tabs-equal-min: 8rem;
}

:where(.bf-theme, .vr-theme) :where(.output-profile-tabs) {
  --vr-tabs-equal-min: 10rem;
}

:where(.bf-theme, .vr-theme) :where(.p-tabs--equal, .bf-tabs--equal, .config-tabs, .output-profile-tabs) :where(.p-tabs__list, .bf-tabs__list) {
  display: grid;
  gap: calc(var(--vr-baseline) * 2);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--vr-tabs-equal-min)), 1fr));
  overflow: visible;
  white-space: normal;
}

:where(.bf-theme, .vr-theme) :where(.p-tabs--equal, .bf-tabs--equal, .config-tabs, .output-profile-tabs) :where(.p-tabs__item, .bf-tabs__item) {
  min-inline-size: 0;
  white-space: normal;
}

:where(.bf-theme, .vr-theme) :where(.p-tabs--equal, .bf-tabs--equal, .config-tabs, .output-profile-tabs) :where(.p-tabs__link, .bf-tabs__link) {
  display: flex;
  inline-size: 100%;
  text-align: center;
  white-space: normal;
}

:where(.bf-theme, .vr-theme) :where(.p-choice-list, .bf-choice-list) {
  display: grid;
  gap: var(--vr-field-gap);
}

:where(.bf-theme, .vr-theme) :where(.p-choice-row, .bf-choice-row, .preset-radio-row) {
  align-items: center;
  background: var(--vr-color-background-default);
  border: var(--vr-border-width) solid var(--vr-color-border-default);
  color: var(--vr-color-text-default);
  cursor: pointer;
  display: grid;
  gap: calc(var(--vr-baseline) * 0.75);
  grid-template-columns: auto minmax(0, 1fr) auto;
  margin: 0;
  min-block-size: var(--vr-control-block-size);
  min-inline-size: 0;
  padding-block: calc((var(--vr-control-block-size) - ${body.lineHeight} - (var(--vr-border-width) * 2)) / 2);
  padding-inline: var(--vr-control-inline-padding);
}

:where(.bf-theme, .vr-theme) :where(.p-choice-row:hover, .bf-choice-row:hover, .preset-radio-row:hover) {
  background: var(--vr-color-background-hover);
}

:where(.bf-theme, .vr-theme) :where(.p-choice-row:focus-within, .bf-choice-row:focus-within, .preset-radio-row:focus-within) {
  outline: 2px solid var(--vr-color-focus);
  outline-offset: -2px;
}

:where(.bf-theme, .vr-theme) :where(.p-choice-row input[type='radio'], .bf-choice-row input[type='radio'], .preset-radio-row input[type='radio']) {
  margin: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-choice-row__name, .bf-choice-row__name, .preset-radio-name) {
${typeStyles(body, { fontWeight: 600, includeCase: false })}  display: block;
  margin: 0;
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

:where(.bf-theme, .vr-theme) :where(.p-choice-row__meta, .bf-choice-row__meta, .preset-radio-status) {
${typeStyles(body, { includeCase: false })}  color: var(--vr-color-text-muted);
  display: block;
  margin: 0;
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:where(.bf-theme, .vr-theme) :where(.p-choice-row.is-active, .bf-choice-row.is-active, .preset-radio-row.is-active),
:where(.bf-theme, .vr-theme) :where(.p-choice-row:has(input[type='radio']:checked), .bf-choice-row:has(input[type='radio']:checked), .preset-radio-row:has(input[type='radio']:checked)) {
  background: var(--vr-color-background-active);
  border-color: var(--vr-color-focus);
}

:where(.bf-theme, .vr-theme) :where(.p-inline-options, .bf-inline-options, .operator-selector) {
  border-bottom: var(--vr-border-width) solid var(--vr-color-border-default);
  display: grid;
  gap: var(--vr-field-gap);
  padding-block-end: calc(var(--vr-panel-padding-block) - var(--vr-border-width));
  padding-block-start: var(--vr-panel-padding-block);
  padding-inline: var(--vr-panel-padding-inline);
}

:where(.bf-theme, .vr-theme) :where(.p-inline-options__heading, .bf-inline-options__heading, .operator-selector__heading) {
${typeStyles(h5)}  color: var(--vr-color-text-muted);
  display: block;
  margin: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-inline-options__heading, .bf-inline-options__heading, .operator-selector__heading) :where(.p-form__label, .bf-form__label) {
  color: inherit;
}

:where(.bf-theme, .vr-theme) :where(.p-inline-options__options, .bf-inline-options__options, .operator-selector__options) {
  display: flex;
  flex-wrap: wrap;
  gap: calc(var(--vr-baseline) * 3);
}

:where(.bf-theme, .vr-theme) :where(.p-inline-options__option, .bf-inline-options__option, .operator-selector__option) {
  align-items: center;
  cursor: pointer;
  display: flex;
  gap: var(--vr-field-gap);
}

:where(.bf-theme, .vr-theme) :where(.p-inline-options__option, .bf-inline-options__option, .operator-selector__option) input[type='radio'] {
  margin: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-segmented-control, .p-tab-buttons, .bf-segmented-control, .bf-tab-buttons) {
  display: block;
  min-inline-size: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-segmented-control__list, .p-tab-buttons__list, .bf-segmented-control__list, .bf-tab-buttons__list) {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  min-inline-size: 0;
  padding: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-segmented-control__item, .p-tab-buttons__item, .bf-segmented-control__item, .bf-tab-buttons__item) {
  margin: 0;
  min-inline-size: 0;
  padding: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-segmented-control__item + .p-segmented-control__item, .p-tab-buttons__item + .p-tab-buttons__item, .bf-segmented-control__item + .bf-segmented-control__item, .bf-tab-buttons__item + .bf-tab-buttons__item) {
  margin-inline-start: calc(var(--vr-border-width) * -1);
}

:where(.bf-theme, .vr-theme) :where(.p-segmented-control__button, .p-tab-buttons__button, .bf-segmented-control__button, .bf-tab-buttons__button) {
${typeStyles(h6, { includeCase: false })}  align-items: center;
  appearance: none;
  background-color: var(--vr-color-background-default);
  border: var(--vr-border-width) solid var(--vr-color-border-high-contrast);
  border-radius: 0;
  color: var(--vr-color-text-default);
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  max-inline-size: 100%;
  min-block-size: var(--vr-control-block-size);
  overflow: hidden;
  padding-block: calc((var(--vr-control-block-size) - ${h6.lineHeight} - (var(--vr-border-width) * 2)) / 2);
  padding-inline: var(--vr-control-inline-padding);
  text-align: center;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:where(.bf-theme, .vr-theme) :where(.p-segmented-control__item:first-child .p-segmented-control__button, .p-tab-buttons__item:first-child .p-tab-buttons__button, .bf-segmented-control__item:first-child .bf-segmented-control__button, .bf-tab-buttons__item:first-child .bf-tab-buttons__button) {
  border-end-start-radius: var(--vr-radius);
  border-start-start-radius: var(--vr-radius);
}

:where(.bf-theme, .vr-theme) :where(.p-segmented-control__item:last-child .p-segmented-control__button, .p-tab-buttons__item:last-child .p-tab-buttons__button, .bf-segmented-control__item:last-child .bf-segmented-control__button, .bf-tab-buttons__item:last-child .bf-tab-buttons__button) {
  border-end-end-radius: var(--vr-radius);
  border-start-end-radius: var(--vr-radius);
}

:where(.bf-theme, .vr-theme) :where(.p-segmented-control__button:hover, .p-tab-buttons__button:hover, .bf-segmented-control__button:hover, .bf-tab-buttons__button:hover) {
  background-color: var(--vr-color-background-hover);
}

:where(.bf-theme, .vr-theme) :where(.p-segmented-control__button:focus, .p-tab-buttons__button:focus, .bf-segmented-control__button:focus, .bf-tab-buttons__button:focus) {
  outline: none;
}

:where(.bf-theme, .vr-theme) :where(.p-segmented-control__button:focus-visible, .p-tab-buttons__button:focus-visible, .bf-segmented-control__button:focus-visible, .bf-tab-buttons__button:focus-visible) {
  outline: 2px solid var(--vr-color-focus);
  outline-offset: -2px;
  z-index: 2;
}

:where(.bf-theme, .vr-theme) :where(.p-segmented-control__button.is-active, .p-tab-buttons__button.is-active, .p-segmented-control__button[aria-pressed='true'], .p-tab-buttons__button[aria-pressed='true'], .p-segmented-control__button[aria-selected='true'], .p-tab-buttons__button[aria-selected='true'], .bf-segmented-control__button.is-active, .bf-tab-buttons__button.is-active, .bf-segmented-control__button[aria-pressed='true'], .bf-tab-buttons__button[aria-pressed='true'], .bf-segmented-control__button[aria-selected='true'], .bf-tab-buttons__button[aria-selected='true']) {
  background-color: var(--vr-color-background-active);
  color: var(--vr-color-text-default);
  z-index: 1;
}

:where(.bf-theme, .vr-theme) :where(.p-segmented-control.is-dense .p-segmented-control__button, .p-tab-buttons.is-dense .p-tab-buttons__button, .bf-segmented-control.is-dense .bf-segmented-control__button, .bf-tab-buttons.is-dense .bf-tab-buttons__button) {
  min-block-size: var(--vr-control-block-size-dense);
  padding-block: calc((var(--vr-control-block-size-dense) - ${h6.lineHeight} - (var(--vr-border-width) * 2)) / 2);
}

:where(.bf-theme, .vr-theme) :where(.p-breadcrumbs, .bf-breadcrumbs) {
  display: block;
  margin: 0;
  width: 100%;
}

:where(.bf-theme, .vr-theme) :where(.p-breadcrumbs__items, .bf-breadcrumbs__items) {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: calc(var(--vr-baseline) * 0.5) calc(var(--vr-baseline) * 1.25);
  list-style: none;
  margin: 0;
  min-inline-size: 0;
  padding: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-breadcrumbs__item, .bf-breadcrumbs__item) {
${typeStyles(body, { fontWeight: 600, includeCase: false })}  color: var(--vr-color-text-muted);
  margin: 0;
  min-inline-size: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-breadcrumbs__item, .bf-breadcrumbs__item) + :where(.p-breadcrumbs__item, .bf-breadcrumbs__item)::before {
  color: var(--vr-color-text-muted);
  content: "/";
  margin-inline-end: calc(var(--vr-baseline) * 0.75);
}

:where(.bf-theme, .vr-theme) :where(.p-breadcrumbs__item, .bf-breadcrumbs__item) a {
  color: inherit;
  text-decoration: none;
}

:where(.bf-theme, .vr-theme) :where(.p-breadcrumbs__item, .bf-breadcrumbs__item) a:hover {
  color: var(--vr-color-text-default);
  text-decoration: underline;
}

:where(.bf-theme, .vr-theme) :where(.p-breadcrumbs__item [aria-current='page'], .bf-breadcrumbs__item [aria-current='page'], .p-breadcrumbs__item.is-active, .bf-breadcrumbs__item.is-active) {
  color: var(--vr-color-text-default);
}

:where(.bf-theme, .vr-theme) :where(table, .p-table, .bf-table) {
  border: 0;
  border-collapse: separate;
  border-spacing: 0;
  caption-side: bottom;
  line-height: ${body.lineHeight};
  margin: 0;
  table-layout: auto;
  width: 100%;
}

:where(.bf-theme, .vr-theme) :where(caption, .p-table__caption, .bf-table__caption) {
${typeStyles(body, { includeCase: false })}  color: var(--vr-color-text-muted);
  margin: 0;
  padding-bottom: calc(var(--vr-baseline) * 0.5);
  padding-top: calc(var(--vr-baseline) * 0.5);
  text-align: left;
}

:where(.bf-theme, .vr-theme) :where(th, td) {
  border: 0;
  color: var(--vr-color-text-default);
  margin: 0;
  overflow: hidden;
  padding-inline: calc(var(--vr-baseline) * 0.75);
  text-align: left;
  text-overflow: ellipsis;
  vertical-align: top;
}

:where(.bf-theme, .vr-theme) :where(td) {
  padding-bottom: calc((var(--vr-control-block-size-dense) - ${body.lineHeight}) / 2);
  padding-top: calc((var(--vr-control-block-size-dense) - ${body.lineHeight}) / 2);
}

:where(.bf-theme, .vr-theme) :where(thead th) {
${typeStyles(h5)}  color: var(--vr-color-text-muted);
  box-shadow: inset 0 -1px 0 var(--vr-color-border-default);
  padding-bottom: calc(((var(--vr-control-block-size-dense) - ${h5.lineHeight}) / 2) - ${h5.nudgeTop});
  padding-top: calc(((var(--vr-control-block-size-dense) - ${h5.lineHeight}) / 2) + ${h5.nudgeTop});
}

:where(.bf-theme, .vr-theme) :where(tbody tr + tr td, tfoot td) {
  box-shadow: inset 0 1px 0 var(--vr-color-border-low-contrast);
}

:where(.bf-theme, .vr-theme) :where(tbody tr:hover td) {
  background: color-mix(in srgb, var(--vr-color-background-hover) 68%, transparent);
}

:where(.bf-theme, .vr-theme) :where(.p-chip, .p-chip--positive, .p-chip--caution, .p-chip--negative, .p-chip--information, .bf-chip, .bf-chip--positive, .bf-chip--caution, .bf-chip--negative, .bf-chip--information) {
  --vr-chip-border: var(--vr-color-border-default);
  --vr-chip-background: var(--vr-color-background-hover);
  align-items: center;
  background-color: var(--vr-chip-background);
  border: var(--vr-border-width) solid var(--vr-chip-border);
  border-radius: 999px;
  color: var(--vr-color-text-default);
  display: inline-flex;
  gap: calc(var(--vr-baseline) * 0.5);
  margin: 0 var(--vr-field-gap) var(--vr-field-gap) 0;
  max-inline-size: 100%;
  min-block-size: var(--vr-control-block-size-dense);
  padding-block: calc((var(--vr-control-block-size-dense) - ${body.lineHeight} - (var(--vr-border-width) * 2)) / 2);
  padding-inline: calc(var(--vr-baseline) * 0.75);
  position: relative;
  text-decoration: none;
  vertical-align: middle;
  white-space: nowrap;
}

:where(.bf-theme, .vr-theme) :where(.p-chip--positive, .bf-chip--positive) {
  --vr-chip-border: var(--vr-color-border-positive);
  --vr-chip-background: var(--vr-color-background-positive-default);
}

:where(.bf-theme, .vr-theme) :where(.p-chip--caution, .bf-chip--caution) {
  --vr-chip-border: var(--vr-color-border-caution);
  --vr-chip-background: var(--vr-color-background-caution-default);
}

:where(.bf-theme, .vr-theme) :where(.p-chip--negative, .bf-chip--negative) {
  --vr-chip-border: var(--vr-color-border-negative);
  --vr-chip-background: var(--vr-color-background-negative-default);
}

:where(.bf-theme, .vr-theme) :where(.p-chip--information, .bf-chip--information) {
  --vr-chip-border: var(--vr-color-border-information);
  --vr-chip-background: var(--vr-color-background-information-default);
}

:where(.bf-theme, .vr-theme) :where(.p-chip__lead, .p-chip__value, .bf-chip__lead, .bf-chip__value) {
  display: block;
  margin: 0;
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

:where(.bf-theme, .vr-theme) :where(.p-chip__lead, .bf-chip__lead) {
${typeStyles(h5)}  color: var(--vr-color-text-muted);
}

:where(.bf-theme, .vr-theme) :where(.p-chip__lead + .p-chip__value, .bf-chip__lead + .bf-chip__value)::before {
  color: var(--vr-color-text-muted);
  content: ": ";
}

:where(.bf-theme, .vr-theme) :where(.p-badge, .p-badge--negative, .bf-badge, .bf-badge--negative) {
  align-items: center;
  background-color: var(--vr-color-text-default);
  border-radius: 999px;
  color: var(--vr-color-background-default);
${typeStyles(h5)}  display: inline-flex;
  justify-content: center;
  margin: 0;
  min-inline-size: calc(${h5.lineHeight} - (var(--vr-baseline) * 0.5));
  padding-inline: calc(var(--vr-baseline) * 0.25);
  text-align: center;
}

:where(.bf-theme, .vr-theme) :where(.p-badge--negative, .bf-badge--negative) {
  background-color: var(--vr-color-border-negative);
  color: var(--vr-color-text-default);
}

:where(.bf-theme, .vr-theme) :where(.p-chip, .p-chip--positive, .p-chip--caution, .p-chip--negative, .p-chip--information, .bf-chip, .bf-chip--positive, .bf-chip--caution, .bf-chip--negative, .bf-chip--information) :where(.p-badge, .p-badge--negative, .bf-badge, .bf-badge--negative) {
  margin-inline-start: calc(var(--vr-baseline) * 0.25);
}

:where(.bf-theme, .vr-theme) :where(.p-status-label, .p-label, .p-status-label--positive, .p-label--positive, .p-status-label--caution, .p-label--caution, .p-status-label--information, .p-label--information, .p-status-label--negative, .p-label--negative, .bf-status-label, .bf-label, .bf-status-label--positive, .bf-label--positive, .bf-status-label--caution, .bf-label--caution, .bf-status-label--information, .bf-label--information, .bf-status-label--negative, .bf-label--negative) {
  --vr-status-background: color-mix(in srgb, var(--vr-color-background-alt) 70%, black);
  --vr-status-color: var(--vr-color-text-default);
  background-color: var(--vr-status-background);
  color: var(--vr-status-color);
  display: inline-block;
${typeStyles(h5)}  margin: 0;
  padding: ${h5.nudgeTop} calc(var(--vr-baseline) * 0.75) 0;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
}

:where(.bf-theme, .vr-theme) :where(.p-status-label--positive, .p-label--positive, .bf-status-label--positive, .bf-label--positive) {
  --vr-status-background: var(--vr-color-border-positive);
  --vr-status-color: var(--vr-color-text-default);
}

:where(.bf-theme, .vr-theme) :where(.p-status-label--caution, .p-label--caution, .bf-status-label--caution, .bf-label--caution) {
  --vr-status-background: var(--vr-color-border-caution);
  --vr-status-color: #111111;
}

:where(.bf-theme, .vr-theme) :where(.p-status-label--information, .p-label--information, .bf-status-label--information, .bf-label--information) {
  --vr-status-background: var(--vr-color-border-information);
  --vr-status-color: var(--vr-color-text-default);
}

:where(.bf-theme, .vr-theme) :where(.p-status-label--negative, .p-label--negative, .bf-status-label--negative, .bf-label--negative) {
  --vr-status-background: var(--vr-color-border-negative);
  --vr-status-color: var(--vr-color-text-default);
}

:where(.bf-theme, .vr-theme) :where(.p-chip__dismiss, .p-search-box__reset, .p-search-and-filter__clear, .bf-chip__dismiss, .bf-search-box__reset, .bf-search-and-filter__clear) {
  appearance: none;
  background: transparent;
  border: 0;
  color: var(--vr-color-text-default);
  cursor: pointer;
  flex: 0 0 auto;
  margin: 0;
  padding: 0;
  position: relative;
  text-indent: -9999px;
}

:where(.bf-theme, .vr-theme) :where(.p-chip__dismiss, .bf-chip__dismiss) {
  block-size: 1rem;
  inline-size: 1rem;
}

:where(.bf-theme, .vr-theme) :where(.p-chip__dismiss, .p-search-box__reset, .p-search-and-filter__clear, .bf-chip__dismiss, .bf-search-box__reset, .bf-search-and-filter__clear)::before,
:where(.bf-theme, .vr-theme) :where(.p-chip__dismiss, .p-search-box__reset, .p-search-and-filter__clear, .bf-chip__dismiss, .bf-search-box__reset, .bf-search-and-filter__clear)::after {
  background: currentColor;
  block-size: 2px;
  content: "";
  inline-size: 0.75rem;
  left: 50%;
  position: absolute;
  top: 50%;
}

:where(.bf-theme, .vr-theme) :where(.p-chip__dismiss, .p-search-box__reset, .p-search-and-filter__clear, .bf-chip__dismiss, .bf-search-box__reset, .bf-search-and-filter__clear)::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

:where(.bf-theme, .vr-theme) :where(.p-chip__dismiss, .p-search-box__reset, .p-search-and-filter__clear, .bf-chip__dismiss, .bf-search-box__reset, .bf-search-and-filter__clear)::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

:where(.bf-theme, .vr-theme) :where(.p-search-box, .bf-search-box) {
  display: flex;
  inline-size: 100%;
  margin: 0;
  max-inline-size: 100%;
  min-inline-size: 0;
  position: relative;
}

:where(.bf-theme, .vr-theme) :where(.p-search-box__input, .bf-search-box__input) {
  margin-bottom: 0;
  padding-inline-end: calc(var(--vr-baseline) * 4.5);
}

:where(.bf-theme, .vr-theme) :where(.p-search-box__reset, .p-search-box__button, .bf-search-box__reset, .bf-search-box__button) {
  align-items: center;
  block-size: var(--vr-control-block-size);
  display: inline-flex;
  inline-size: calc(var(--vr-baseline) * 2);
  justify-content: center;
  position: absolute;
  top: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-search-box__reset, .bf-search-box__reset) {
  inset-inline-end: calc(var(--vr-baseline) * 2);
}

:where(.bf-theme, .vr-theme) :where(.p-search-box__button, .bf-search-box__button) {
  appearance: none;
  background: transparent;
  border: 0;
  border-inline-start: var(--vr-border-width) solid var(--vr-color-border-default);
  color: var(--vr-color-text-default);
  cursor: pointer;
  inset-inline-end: var(--vr-border-width);
  margin: 0;
  padding: 0;
  text-indent: -9999px;
}

:where(.bf-theme, .vr-theme) :where(.p-search-box__button, .bf-search-box__button)::before {
  block-size: 0.625rem;
  border: 2px solid currentColor;
  border-radius: 50%;
  content: "";
  inline-size: 0.625rem;
  left: 50%;
  position: absolute;
  top: 45%;
  transform: translate(-60%, -55%);
}

:where(.bf-theme, .vr-theme) :where(.p-search-box__button, .bf-search-box__button)::after {
  background: currentColor;
  block-size: 2px;
  content: "";
  inline-size: 0.45rem;
  left: 55%;
  position: absolute;
  top: 58%;
  transform: rotate(45deg);
  transform-origin: left center;
}

:where(.bf-theme, .vr-theme) :where(.p-search-box__reset:focus, .p-search-box__button:focus, .bf-search-box__reset:focus, .bf-search-box__button:focus) {
  outline: none;
}

:where(.bf-theme, .vr-theme) :where(.p-search-box__reset:focus-visible, .p-search-box__button:focus-visible, .bf-search-box__reset:focus-visible, .bf-search-box__button:focus-visible) {
  outline: 2px solid var(--vr-color-focus);
  outline-offset: -2px;
}

:where(.bf-theme, .vr-theme) :where(.p-search-and-filter, .bf-search-and-filter) {
  display: grid;
  inline-size: 100%;
  margin: 0;
  max-inline-size: 100%;
  min-inline-size: 0;
  position: relative;
}

:where(.bf-theme, .vr-theme) :where(.p-search-and-filter__search-container, .bf-search-and-filter__search-container) {
  align-items: stretch;
  background: transparent;
  box-shadow: inset 0 -1px 0 var(--vr-color-border-high-contrast);
  display: flex;
  flex-wrap: wrap;
  gap: var(--vr-field-gap);
  margin: 0;
  min-block-size: 0;
  overflow: visible;
  padding: 0;
  position: relative;
}

:where(.bf-theme, .vr-theme) :where(.p-search-and-filter__search-container[aria-expanded='false'], .bf-search-and-filter__search-container[aria-expanded='false']) {
  min-block-size: var(--vr-control-block-size);
}

:where(.bf-theme, .vr-theme) :where(.p-search-and-filter__box, .bf-search-and-filter__box) {
  display: inline-flex;
  flex: 1 1 12rem;
  max-inline-size: 100%;
  min-inline-size: 0;
  position: relative;
}

:where(.bf-theme, .vr-theme) :where(.p-search-and-filter__input, .bf-search-and-filter__input) {
  margin-bottom: 0;
  padding-inline-end: calc(var(--vr-baseline) * 4.5);
}

:where(.bf-theme, .vr-theme) :where(.p-search-and-filter__search-button, .bf-search-and-filter__search-button) {
  appearance: none;
  background: transparent;
  block-size: var(--vr-control-block-size);
  border: 0;
  color: var(--vr-color-text-default);
  cursor: pointer;
  inline-size: calc(var(--vr-baseline) * 2);
  inset-inline-end: 0;
  margin: 0;
  padding: 0;
  position: absolute;
  text-indent: -9999px;
  top: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-search-and-filter__search-button, .bf-search-and-filter__search-button)::before {
  block-size: 0.625rem;
  border: 2px solid currentColor;
  border-radius: 50%;
  content: "";
  inline-size: 0.625rem;
  left: 50%;
  position: absolute;
  top: 45%;
  transform: translate(-60%, -55%);
}

:where(.bf-theme, .vr-theme) :where(.p-search-and-filter__search-button, .bf-search-and-filter__search-button)::after {
  background: currentColor;
  block-size: 2px;
  content: "";
  inline-size: 0.45rem;
  left: 55%;
  position: absolute;
  top: 58%;
  transform: rotate(45deg);
  transform-origin: left center;
}

:where(.bf-theme, .vr-theme) :where(.p-search-and-filter__search-button:focus, .p-search-and-filter__selected-count:focus, .bf-search-and-filter__search-button:focus, .bf-search-and-filter__selected-count:focus) {
  outline: none;
}

:where(.bf-theme, .vr-theme) :where(.p-search-and-filter__search-button:focus-visible, .p-search-and-filter__selected-count:focus-visible, .bf-search-and-filter__search-button:focus-visible, .bf-search-and-filter__selected-count:focus-visible) {
  outline: 2px solid var(--vr-color-focus);
  outline-offset: -2px;
}

:where(.bf-theme, .vr-theme) :where(.p-search-and-filter__clear, .bf-search-and-filter__clear) {
  block-size: var(--vr-control-block-size);
  inline-size: calc(var(--vr-baseline) * 2);
  inset-inline-end: calc(var(--vr-baseline) * 2);
  position: absolute;
  top: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-search-and-filter__selected-count, .bf-search-and-filter__selected-count) {
${typeStyles(h5)}  appearance: none;
  align-items: flex-start;
  background: transparent;
  border: 0;
  color: var(--vr-color-link-default);
  cursor: pointer;
  display: inline-flex;
  margin: 0;
  min-block-size: var(--vr-control-block-size);
  padding-bottom: calc(((var(--vr-control-block-size) - ${h5.lineHeight}) / 2) - ${h5.nudgeTop});
  padding-inline: 0;
  padding-top: calc(((var(--vr-control-block-size) - ${h5.lineHeight}) / 2) + ${h5.nudgeTop});
  position: static;
}

:where(.bf-theme, .vr-theme) :where(.p-search-and-filter__search-container[aria-expanded='true'], .bf-search-and-filter__search-container[aria-expanded='true']) :where(.p-search-and-filter__selected-count, .bf-search-and-filter__selected-count) {
  display: none;
}

:where(.bf-theme, .vr-theme) :where(.p-search-and-filter__panel, .bf-search-and-filter__panel) {
  background-color: var(--vr-color-background-inputs);
  border: var(--vr-border-width) solid var(--vr-color-border-default);
  border-top: 0;
  box-shadow: 0 24px 72px rgba(0, 0, 0, 0.38);
  display: grid;
  gap: var(--vr-field-gap);
  opacity: 1;
  padding-bottom: calc(var(--vr-panel-padding-block) - var(--vr-border-width));
  padding-inline: var(--vr-panel-padding-inline);
  padding-top: var(--vr-panel-padding-block);
  position: absolute;
  top: 100%;
  width: 100%;
  z-index: 20;
}

:where(.bf-theme, .vr-theme) :where(.p-search-and-filter__panel[aria-hidden='true'], .bf-search-and-filter__panel[aria-hidden='true']) {
  opacity: 0;
  pointer-events: none;
}

:where(.bf-theme, .vr-theme) :where(.p-search-and-filter__search-prompt, .bf-search-and-filter__search-prompt) {
  background: var(--vr-color-background-inputs);
  color: var(--vr-color-text-muted);
  cursor: pointer;
  margin: 0;
  overflow: hidden;
  padding: ${body.nudgeTop} 0 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:where(.bf-theme, .vr-theme) :where(.p-search-and-filter__search-query, .bf-search-and-filter__search-query) {
  color: var(--vr-color-text-default);
  font-weight: 600;
}

:where(.bf-theme, .vr-theme) :where(.p-filter-panel-section, .bf-filter-panel-section) {
  border-bottom: var(--vr-border-width) solid var(--vr-color-border-low-contrast);
  display: grid;
  gap: var(--vr-field-gap);
  margin: 0;
  padding-bottom: calc(var(--vr-baseline) * 0.75);
}

:where(.bf-theme, .vr-theme) :where(.p-filter-panel-section:last-child, .bf-filter-panel-section:last-child) {
  border-bottom: 0;
  padding-bottom: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-filter-panel-section__heading, .bf-filter-panel-section__heading) {
${typeStyles(h5)}  color: var(--vr-color-text-muted);
  margin: 0;
  padding-bottom: calc(var(--vr-baseline) - ${h5.nudgeTop});
  padding-top: ${h5.nudgeTop};
}

:where(.bf-theme, .vr-theme) :where(.p-filter-panel-section__chips, .bf-filter-panel-section__chips) {
  overflow: hidden;
  position: relative;
}

:where(.bf-theme, .vr-theme) :where(.p-filter-panel-section__chips[aria-expanded='false'], .bf-filter-panel-section__chips[aria-expanded='false']) {
  max-block-size: calc(var(--vr-baseline) * 5);
}

:where(.bf-theme, .vr-theme) :where(.p-filter-panel-section__counter, .bf-filter-panel-section__counter) {
  appearance: none;
  background: transparent;
  border: 0;
  bottom: 0;
  color: var(--vr-color-link-default);
  cursor: pointer;
  margin: 0;
  padding: 0;
  position: absolute;
  right: 0;
}

:where(.bf-theme, .vr-theme) :where(.vr-list-tree, .p-list-tree, .bf-list-tree) {
  list-style: none;
  margin: 0;
  padding-left: calc(var(--vr-baseline) * 0.5);
}

:where(.bf-theme, .vr-theme) :where(.vr-list-tree, .p-list-tree, .bf-list-tree) :where(.vr-list-tree, .p-list-tree, .bf-list-tree) {
  display: none;
  margin: 0;
  padding-left: 0;
}

:where(.bf-theme, .vr-theme) :where(.vr-list-tree, .p-list-tree, .bf-list-tree) :where(.vr-list-tree[aria-hidden='false'], .p-list-tree[aria-hidden='false'], .bf-list-tree[aria-hidden='false']) {
  display: block;
}

:where(.bf-theme, .vr-theme) :where(.vr-list-tree__item, .p-list-tree__item, .bf-list-tree__item) {
  margin: 0;
  padding-left: calc(var(--vr-baseline) * 1.5);
  position: relative;
}

:where(.bf-theme, .vr-theme) :where(.vr-list-tree__link, .p-list-tree__link, .bf-list-tree__link) {
${typeStyles(body, { includeCase: false })}  color: var(--vr-color-text-default);
  cursor: pointer;
  display: block;
  margin: 0;
  min-block-size: var(--vr-control-block-size-dense);
  padding-block: calc((var(--vr-control-block-size-dense) - ${body.lineHeight}) / 2);
  text-decoration: none;
}

:where(.bf-theme, .vr-theme) :where(.vr-list-tree__link, .p-list-tree__link, .bf-list-tree__link):hover {
  color: var(--vr-color-link-default);
  text-decoration: underline;
}

:where(.bf-theme, .vr-theme) :where(.vr-list-tree__link.is-active, .p-list-tree__link.is-active, .bf-list-tree__link.is-active) {
  color: var(--vr-color-link-default);
}

:where(.bf-theme, .vr-theme) :where(.vr-list-tree__link, .p-list-tree__link, .bf-list-tree__link):focus {
  outline: none;
}

:where(.bf-theme, .vr-theme) :where(.vr-list-tree__link, .p-list-tree__link, .bf-list-tree__link):focus-visible {
  outline: 2px solid var(--vr-color-focus);
  outline-offset: -2px;
}

:where(.bf-theme, .vr-theme) :where(.vr-list-tree__toggle, .p-list-tree__toggle, .bf-list-tree__toggle) {
${typeStyles(body, { includeCase: false })}  align-items: center;
  background: transparent;
  border: 0;
  color: var(--vr-color-text-default);
  cursor: pointer;
  display: inline-flex;
  gap: calc(var(--vr-baseline) * 0.5);
  margin: 0 0 0 calc(var(--vr-baseline) * -1.5);
  min-block-size: var(--vr-control-block-size-dense);
  padding-block: calc((var(--vr-control-block-size-dense) - ${body.lineHeight}) / 2);
  padding-inline: calc(var(--vr-baseline) * 0.25) calc(var(--vr-baseline) * 0.5);
  text-align: left;
  width: 100%;
}

:where(.bf-theme, .vr-theme) :where(.vr-list-tree__toggle, .p-list-tree__toggle, .bf-list-tree__toggle):hover {
  background: var(--vr-color-background-hover);
}

:where(.bf-theme, .vr-theme) :where(.vr-list-tree__toggle, .p-list-tree__toggle, .bf-list-tree__toggle):focus {
  outline: none;
}

:where(.bf-theme, .vr-theme) :where(.vr-list-tree__toggle, .p-list-tree__toggle, .bf-list-tree__toggle):focus-visible {
  outline: 2px solid var(--vr-color-focus);
  outline-offset: -2px;
}

:where(.bf-theme, .vr-theme) :where(.vr-list-tree__toggle, .p-list-tree__toggle, .bf-list-tree__toggle)::before {
  background-image: var(--vr-icon-chevron-down);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
  block-size: 1rem;
  content: "";
  flex: 0 0 1rem;
  inline-size: 1rem;
  transform: rotate(-90deg);
}

:where(.bf-theme, .vr-theme) :where(.vr-list-tree__toggle[aria-expanded='true'], .p-list-tree__toggle[aria-expanded='true'], .bf-list-tree__toggle[aria-expanded='true'])::before {
  transform: rotate(0deg);
}

:where(.bf-theme, .vr-theme) :where(.vr-contextual-menu, .p-contextual-menu, .bf-contextual-menu, .vr-contextual-menu--left, .p-contextual-menu--left, .bf-contextual-menu--left, .vr-contextual-menu--center, .p-contextual-menu--center, .bf-contextual-menu--center) {
  display: inline-block;
  margin: 0;
  position: relative;
  vertical-align: top;
}

:where(.bf-theme, .vr-theme) :where(.vr-contextual-menu__dropdown, .p-contextual-menu__dropdown, .bf-contextual-menu__dropdown) {
  background: var(--vr-color-background-default);
  border: var(--vr-border-width) solid var(--vr-color-border-default);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.28);
  display: none;
  list-style: none;
  margin: 0;
  max-inline-size: 21rem;
  min-inline-size: 10rem;
  padding: 0;
  position: absolute;
  right: 0;
  top: calc(100% - var(--vr-border-width));
  width: fit-content;
  z-index: 9;
}

:where(.bf-theme, .vr-theme) :where(.vr-contextual-menu__dropdown[aria-hidden='false'], .p-contextual-menu__dropdown[aria-hidden='false'], .bf-contextual-menu__dropdown[aria-hidden='false']) {
  display: block;
}

:where(.bf-theme, .vr-theme) :where(.vr-contextual-menu--left, .p-contextual-menu--left, .bf-contextual-menu--left) :where(.vr-contextual-menu__dropdown, .p-contextual-menu__dropdown, .bf-contextual-menu__dropdown) {
  left: 0;
  right: auto;
}

:where(.bf-theme, .vr-theme) :where(.vr-contextual-menu--center, .p-contextual-menu--center, .bf-contextual-menu--center) :where(.vr-contextual-menu__dropdown, .p-contextual-menu__dropdown, .bf-contextual-menu__dropdown) {
  left: 50%;
  right: auto;
  transform: translateX(-50%);
}

:where(.bf-theme, .vr-theme) :where(.vr-contextual-menu__group, .p-contextual-menu__group, .bf-contextual-menu__group) {
  display: block;
}

:where(.bf-theme, .vr-theme) :where(.vr-contextual-menu__group, .p-contextual-menu__group, .bf-contextual-menu__group) + :where(.vr-contextual-menu__group, .p-contextual-menu__group, .bf-contextual-menu__group) {
  box-shadow: inset 0 1px 0 var(--vr-color-border-default);
}

:where(.bf-theme, .vr-theme) :where(.vr-contextual-menu__link, .p-contextual-menu__link, .bf-contextual-menu__link) {
${typeStyles(body, { includeCase: false })}  background: transparent;
  border: 0;
  clear: both;
  color: var(--vr-color-text-default);
  cursor: pointer;
  display: block;
  margin: 0;
  overflow: hidden;
  padding-block: calc((var(--vr-control-block-size-dense) - ${body.lineHeight}) / 2);
  padding-inline: var(--vr-panel-padding-inline);
  text-align: left;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

:where(.bf-theme, .vr-theme) :where(.vr-contextual-menu__link, .p-contextual-menu__link, .bf-contextual-menu__link):visited {
  color: var(--vr-color-text-default);
}

:where(.bf-theme, .vr-theme) :where(.vr-contextual-menu__link, .p-contextual-menu__link, .bf-contextual-menu__link):hover {
  background: var(--vr-color-background-hover);
  text-decoration: none;
}

:where(.bf-theme, .vr-theme) :where(.vr-contextual-menu__link, .p-contextual-menu__link, .bf-contextual-menu__link):active {
  background: var(--vr-color-background-active);
}

:where(.bf-theme, .vr-theme) :where(.vr-contextual-menu__link, .p-contextual-menu__link, .bf-contextual-menu__link):focus {
  outline: none;
}

:where(.bf-theme, .vr-theme) :where(.vr-contextual-menu__link, .p-contextual-menu__link, .bf-contextual-menu__link):focus-visible {
  outline: 2px solid var(--vr-color-focus);
  outline-offset: -2px;
}

:where(.bf-theme, .vr-theme) :where(.vr-contextual-menu__link.is-disabled, .p-contextual-menu__link.is-disabled, .bf-contextual-menu__link.is-disabled, .vr-contextual-menu__link[disabled], .p-contextual-menu__link[disabled], .bf-contextual-menu__link[disabled]) {
  color: var(--vr-color-text-muted);
  cursor: default;
  pointer-events: none;
}

:where(.bf-theme, .vr-theme) :where(.vr-tooltip, .p-tooltip, .bf-tooltip, [class*='vr-tooltip--'], [class*='p-tooltip--'], [class*='bf-tooltip--']) {
  display: inline-flex;
  position: relative;
  text-decoration: inherit;
}

:where(.bf-theme, .vr-theme) :where(.vr-tooltip.is-detached, .p-tooltip.is-detached, .bf-tooltip.is-detached, [class*='vr-tooltip--'].is-detached, [class*='p-tooltip--'].is-detached, [class*='bf-tooltip--'].is-detached) {
  display: inline-grid;
  gap: var(--vr-field-gap);
  position: relative;
}

:where(.bf-theme, .vr-theme) :where(.vr-tooltip__message, .p-tooltip__message, .bf-tooltip__message) {
${typeStyles(body, { includeCase: false })}  background-color: var(--vr-color-background-alt);
  box-shadow: inset 0 0 0 var(--vr-border-width) var(--vr-color-border-default), 0 12px 32px rgba(0, 0, 0, 0.24);
  color: var(--vr-color-text-default);
  inline-size: max-content;
  left: 0;
  margin: 0;
  max-inline-size: min(20rem, calc(100vw - (var(--vr-baseline) * 4)));
  opacity: 0;
  padding-block: ${body.nudgeTop} calc(var(--vr-baseline) - ${body.nudgeTop});
  padding-inline: var(--vr-panel-padding-inline);
  pointer-events: none;
  position: absolute;
  top: 100%;
  transform: translateY(calc(var(--vr-baseline) - var(--vr-border-width)));
  visibility: hidden;
  white-space: normal;
  z-index: 12;
}

:where(.bf-theme, .vr-theme) :where(.vr-tooltip, .p-tooltip, .bf-tooltip, [class*='vr-tooltip--'], [class*='p-tooltip--'], [class*='bf-tooltip--']):is(:hover, :focus-within) > :where(.vr-tooltip__message, .p-tooltip__message, .bf-tooltip__message),
:where(.bf-theme, .vr-theme) :where(.vr-tooltip.is-detached, .p-tooltip.is-detached, .bf-tooltip.is-detached, [class*='vr-tooltip--'].is-detached, [class*='p-tooltip--'].is-detached, [class*='bf-tooltip--'].is-detached) > :where(.vr-tooltip__message, .p-tooltip__message, .bf-tooltip__message) {
  opacity: 1;
  visibility: visible;
}

:where(.bf-theme, .vr-theme) :where(.vr-tooltip__message, .p-tooltip__message, .bf-tooltip__message)::before {
  block-size: 0;
  border-bottom: calc(var(--vr-baseline) * 0.5) solid var(--vr-color-background-alt);
  border-inline: calc(var(--vr-baseline) * 0.5) solid transparent;
  bottom: 100%;
  content: "";
  inline-size: 0;
  left: calc(var(--vr-baseline) * 0.75);
  position: absolute;
}

:where(.bf-theme, .vr-theme) :where(.vr-tooltip.is-detached, .p-tooltip.is-detached, .bf-tooltip.is-detached, [class*='vr-tooltip--'].is-detached, [class*='p-tooltip--'].is-detached, [class*='bf-tooltip--'].is-detached) > :where(.vr-tooltip__message, .p-tooltip__message, .bf-tooltip__message) {
  left: auto;
  pointer-events: auto;
  position: static;
  top: auto;
  transform: none;
}

:where(.bf-theme, .vr-theme) :where(.vr-tooltip.is-detached, .p-tooltip.is-detached, .bf-tooltip.is-detached, [class*='vr-tooltip--'].is-detached, [class*='p-tooltip--'].is-detached, [class*='bf-tooltip--'].is-detached) > :where(.vr-tooltip__message, .p-tooltip__message, .bf-tooltip__message)::before {
  content: none;
}

:where(.bf-theme, .vr-theme) :where(.vr-tooltip--btm-center, .p-tooltip--btm-center, .bf-tooltip--btm-center) > :where(.vr-tooltip__message, .p-tooltip__message, .bf-tooltip__message) {
  left: 50%;
  transform: translate(-50%, calc(var(--vr-baseline) - var(--vr-border-width)));
}

:where(.bf-theme, .vr-theme) :where(.vr-tooltip--btm-center, .p-tooltip--btm-center, .bf-tooltip--btm-center) > :where(.vr-tooltip__message, .p-tooltip__message, .bf-tooltip__message)::before {
  left: 50%;
  transform: translateX(-50%);
}

:where(.bf-theme, .vr-theme) :where(.vr-tooltip--btm-right, .p-tooltip--btm-right, .bf-tooltip--btm-right) > :where(.vr-tooltip__message, .p-tooltip__message, .bf-tooltip__message) {
  left: auto;
  right: 0;
}

:where(.bf-theme, .vr-theme) :where(.vr-tooltip--btm-right, .p-tooltip--btm-right, .bf-tooltip--btm-right) > :where(.vr-tooltip__message, .p-tooltip__message, .bf-tooltip__message)::before {
  left: auto;
  right: calc(var(--vr-baseline) * 0.75);
}

:where(.bf-theme, .vr-theme) :where(.vr-tooltip--top-left, .p-tooltip--top-left, .bf-tooltip--top-left, .vr-tooltip--top-center, .p-tooltip--top-center, .bf-tooltip--top-center, .vr-tooltip--top-right, .p-tooltip--top-right, .bf-tooltip--top-right) > :where(.vr-tooltip__message, .p-tooltip__message, .bf-tooltip__message) {
  bottom: 100%;
  top: auto;
  transform: translateY(calc(var(--vr-baseline) * -1));
}

:where(.bf-theme, .vr-theme) :where(.vr-tooltip--top-left, .p-tooltip--top-left, .bf-tooltip--top-left, .vr-tooltip--top-center, .p-tooltip--top-center, .bf-tooltip--top-center, .vr-tooltip--top-right, .p-tooltip--top-right, .bf-tooltip--top-right) > :where(.vr-tooltip__message, .p-tooltip__message, .bf-tooltip__message)::before {
  border-bottom: 0;
  border-inline: calc(var(--vr-baseline) * 0.5) solid transparent;
  border-top: calc(var(--vr-baseline) * 0.5) solid var(--vr-color-background-alt);
  bottom: auto;
  top: 100%;
}

:where(.bf-theme, .vr-theme) :where(.vr-tooltip--top-center, .p-tooltip--top-center, .bf-tooltip--top-center) > :where(.vr-tooltip__message, .p-tooltip__message, .bf-tooltip__message) {
  left: 50%;
  transform: translate(-50%, calc(var(--vr-baseline) * -1));
}

:where(.bf-theme, .vr-theme) :where(.vr-tooltip--top-center, .p-tooltip--top-center, .bf-tooltip--top-center) > :where(.vr-tooltip__message, .p-tooltip__message, .bf-tooltip__message)::before {
  left: 50%;
  transform: translateX(-50%);
}

:where(.bf-theme, .vr-theme) :where(.vr-tooltip--top-right, .p-tooltip--top-right, .bf-tooltip--top-right) > :where(.vr-tooltip__message, .p-tooltip__message, .bf-tooltip__message) {
  left: auto;
  right: 0;
}

:where(.bf-theme, .vr-theme) :where(.vr-tooltip--top-right, .p-tooltip--top-right, .bf-tooltip--top-right) > :where(.vr-tooltip__message, .p-tooltip__message, .bf-tooltip__message)::before {
  left: auto;
  right: calc(var(--vr-baseline) * 0.75);
}

:where(.bf-theme, .vr-theme) :where(nav.p-pagination, nav.bf-pagination) {
  display: block;
}

:where(.bf-theme, .vr-theme) :where(.p-pagination__items, .bf-pagination__items) {
  align-items: flex-start;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--vr-field-gap);
  list-style: none;
  margin: 0;
  min-inline-size: 0;
  padding: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-pagination__item, .bf-pagination__item) {
  align-items: flex-start;
  display: flex;
  margin: 0;
  min-inline-size: 0;
  padding: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-pagination__item--truncation, .bf-pagination__item--truncation) {
${typeStyles(body, { includeCase: false })}  color: var(--vr-color-text-muted);
  min-block-size: var(--vr-control-block-size-dense);
  padding-block: calc((var(--vr-control-block-size-dense) - ${body.lineHeight}) / 2);
  padding-inline: calc(var(--vr-baseline) * 0.5);
}

:where(.bf-theme, .vr-theme) :where(.p-pagination__link, .p-pagination__link--previous, .p-pagination__link--next, .bf-pagination__link, .bf-pagination__link--previous, .bf-pagination__link--next) {
${typeStyles(h6, { includeCase: false })}  align-items: center;
  background-color: var(--vr-color-background-default);
  border: var(--vr-border-width) solid var(--vr-color-border-high-contrast);
  border-radius: var(--vr-radius);
  color: var(--vr-color-text-default);
  cursor: pointer;
  display: inline-flex;
  gap: calc(var(--vr-baseline) * 0.5);
  justify-content: center;
  min-block-size: var(--vr-control-block-size-dense);
  min-inline-size: calc(var(--vr-baseline) * 2.5);
  padding-block: calc((var(--vr-control-block-size-dense) - ${h6.lineHeight} - (var(--vr-border-width) * 2)) / 2);
  padding-inline: calc(var(--vr-baseline) * 0.75);
  text-align: center;
  text-decoration: none;
}

:where(.bf-theme, .vr-theme) :where(.p-pagination__link:hover, .p-pagination__link--previous:hover, .p-pagination__link--next:hover, .bf-pagination__link:hover, .bf-pagination__link--previous:hover, .bf-pagination__link--next:hover) {
  background-color: var(--vr-color-background-hover);
}

:where(.bf-theme, .vr-theme) :where(.p-pagination__link:focus, .p-pagination__link--previous:focus, .p-pagination__link--next:focus, .bf-pagination__link:focus, .bf-pagination__link--previous:focus, .bf-pagination__link--next:focus) {
  outline: none;
}

:where(.bf-theme, .vr-theme) :where(.p-pagination__link:focus-visible, .p-pagination__link--previous:focus-visible, .p-pagination__link--next:focus-visible, .bf-pagination__link:focus-visible, .bf-pagination__link--previous:focus-visible, .bf-pagination__link--next:focus-visible) {
  outline: 2px solid var(--vr-color-focus);
  outline-offset: 2px;
}

:where(.bf-theme, .vr-theme) :where(.p-pagination__link.is-active, .p-pagination__link[aria-current='page'], .p-pagination__link[aria-current='true'], .bf-pagination__link.is-active, .bf-pagination__link[aria-current='page'], .bf-pagination__link[aria-current='true']) {
  background-color: var(--vr-color-background-active);
}

:where(.bf-theme, .vr-theme) :where(.p-pagination__link--previous, .p-pagination__link--next, .bf-pagination__link--previous, .bf-pagination__link--next)::before,
:where(.bf-theme, .vr-theme) :where(.p-pagination__link--previous, .p-pagination__link--next, .bf-pagination__link--previous, .bf-pagination__link--next)::after {
  background-image: var(--vr-icon-chevron-down);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
  block-size: 1rem;
  content: "";
  display: inline-block;
  inline-size: 1rem;
}

:where(.bf-theme, .vr-theme) :where(.p-pagination__link--previous, .bf-pagination__link--previous)::before {
  transform: rotate(90deg);
}

:where(.bf-theme, .vr-theme) :where(.p-pagination__link--previous, .bf-pagination__link--previous)::after {
  display: none;
}

:where(.bf-theme, .vr-theme) :where(.p-pagination__link--next, .bf-pagination__link--next)::after {
  transform: rotate(-90deg);
}

:where(.bf-theme, .vr-theme) :where(.p-pagination__link--next, .bf-pagination__link--next)::before {
  display: none;
}

:where(.bf-theme, .vr-theme) :where(.p-pagination__link.is-disabled, .p-pagination__link--previous.is-disabled, .p-pagination__link--next.is-disabled, .p-pagination__link[aria-disabled='true'], .p-pagination__link--previous[aria-disabled='true'], .p-pagination__link--next[aria-disabled='true'], .bf-pagination__link.is-disabled, .bf-pagination__link--previous.is-disabled, .bf-pagination__link--next.is-disabled, .bf-pagination__link[aria-disabled='true'], .bf-pagination__link--previous[aria-disabled='true'], .bf-pagination__link--next[aria-disabled='true']) {
  cursor: not-allowed;
  opacity: 0.5;
  pointer-events: none;
}

:where(.bf-theme, .vr-theme) :where(.p-accordion, .bf-accordion) {
  display: grid;
  min-inline-size: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-accordion__list, .bf-accordion__list) {
  list-style: none;
  margin: 0;
  padding: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-accordion__group, .bf-accordion__group) {
  position: relative;
}

:where(.bf-theme, .vr-theme) :where(.p-accordion__group, .bf-accordion__group) + :where(.p-accordion__group, .bf-accordion__group)::after {
  background-color: var(--vr-color-border-default);
  block-size: var(--vr-border-width);
  content: "";
  inset-inline: 0;
  position: absolute;
  top: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-accordion__heading, .bf-accordion__heading) {
  margin-bottom: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-accordion__tab, .bf-accordion__tab) {
${typeStyles(body, { includeCase: false })}  align-items: center;
  appearance: none;
  background: transparent;
  border: 0;
  color: var(--vr-color-text-default);
  cursor: pointer;
  display: flex;
  inline-size: 100%;
  justify-content: flex-start;
  min-block-size: var(--vr-control-block-size);
  padding-block-end: calc((var(--vr-control-block-size) - ${body.lineHeight}) / 2);
  padding-block-start: calc(((var(--vr-control-block-size) - ${body.lineHeight}) / 2) - var(--vr-border-width));
  padding-inline: 0;
  text-align: left;
}

:where(.bf-theme, .vr-theme) :where(.p-accordion__tab, .bf-accordion__tab):focus {
  outline: none;
}

:where(.bf-theme, .vr-theme) :where(.p-accordion__tab, .bf-accordion__tab):focus-visible {
  outline: 2px solid var(--vr-color-focus);
  outline-offset: 2px;
}

:where(.bf-theme, .vr-theme) :where(.p-accordion__tab, .bf-accordion__tab)::before {
  background-image: var(--vr-icon-chevron-down);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
  block-size: 1rem;
  content: "";
  display: inline-block;
  flex: none;
  inline-size: 1rem;
  margin-inline-end: calc(var(--vr-baseline) * 3);
  transition: transform 120ms ease;
}

:where(.bf-theme, .vr-theme) :where(.p-accordion__tab[aria-expanded='false'], .bf-accordion__tab[aria-expanded='false'])::before {
  transform: rotate(-90deg);
}

:where(.bf-theme, .vr-theme) :where(.p-accordion__panel, .bf-accordion__panel) {
  margin: 0;
  overflow: hidden;
  padding-block-start: var(--vr-baseline);
  padding-inline-start: calc(var(--vr-accordion-indent) + ${body.fontSize} + var(--vr-baseline));
}

:where(.bf-theme, .vr-theme) :where(.p-accordion__panel[aria-hidden='true'], .bf-accordion__panel[aria-hidden='true']) {
  block-size: 0;
  opacity: 0;
  padding-block-start: 0;
  visibility: hidden;
}

:where(.bf-theme, .vr-theme) :where(.p-accordion__panel[aria-hidden='false'], .bf-accordion__panel[aria-hidden='false']) {
  block-size: auto;
  opacity: 1;
  visibility: visible;
}

:where(.bf-theme, .vr-theme) :where(.p-modal, .bf-modal) {
  background: transparent;
  border: 0;
  inset: 0;
  margin: auto;
  max-inline-size: min(100vw - (var(--vr-baseline) * 8), 36rem);
  padding: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-modal)::backdrop,
:where(.bf-theme, .vr-theme) :where(.bf-modal)::backdrop {
  background: var(--vr-color-background-overlay);
}

:where(.bf-theme, .vr-theme) :where(.p-modal__dialog, .bf-modal__dialog) {
  background: var(--vr-color-background-default);
  border: var(--vr-border-width) solid var(--vr-color-border-default);
  display: grid;
  gap: 0;
}

:where(.bf-theme, .vr-theme) :where(.p-modal__header, .p-modal__body, .p-modal__footer, .bf-modal__header, .bf-modal__body, .bf-modal__footer) {
  padding-block-end: calc(var(--vr-panel-padding-block) - var(--vr-border-width));
  padding-block-start: calc(var(--vr-panel-padding-block) - var(--vr-border-width));
  padding-inline: var(--vr-panel-padding-inline);
}

:where(.bf-theme, .vr-theme) :where(.p-modal__header, .bf-modal__header) {
  align-items: start;
  border-bottom: var(--vr-border-width) solid var(--vr-color-border-default);
  display: flex;
  gap: var(--vr-field-gap);
  justify-content: space-between;
}

:where(.bf-theme, .vr-theme) :where(.p-modal__body, .bf-modal__body) {
  padding-block-end: var(--vr-panel-padding-block);
  padding-block-start: var(--vr-panel-padding-block);
}

:where(.bf-theme, .vr-theme) :where(.p-modal__title, .bf-modal__title) {
${typeStyles(h4, { includeCase: false })}}

:where(.bf-theme, .vr-theme) :where(.p-modal__footer, .bf-modal__footer) {
  align-items: start;
  border-top: var(--vr-border-width) solid var(--vr-color-border-default);
  display: flex;
  flex-wrap: wrap;
  gap: var(--vr-field-gap);
  justify-content: flex-end;
}

:where(.bf-theme, .vr-theme) :where(.p-modal__close, .bf-modal__close) {
${typeStyles(h6, { includeCase: false })}  appearance: none;
  background: transparent;
  border: 0;
  color: var(--vr-color-text-default);
  cursor: pointer;
  padding: 0;
}

:where(.bf-theme, .vr-theme) :where(.vr-code-snippet, .p-code-snippet, .bf-code-snippet) {
  display: grid;
  gap: 0;
  margin: 0;
  min-inline-size: 0;
}

:where(.bf-theme, .vr-theme) :where(.vr-code-snippet.is-bordered, .p-code-snippet.is-bordered, .bf-code-snippet.is-bordered) {
  box-shadow: inset 0 0 0 var(--vr-border-width) var(--vr-color-border-default);
}

:where(.bf-theme, .vr-theme) :where(.vr-code-snippet__header, .p-code-snippet__header, .bf-code-snippet__header) {
  align-items: start;
  background: var(--vr-color-background-active);
  box-shadow: inset 0 -1px 0 var(--vr-color-border-default);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  min-inline-size: 0;
}

:where(.bf-theme, .vr-theme) :where(.vr-code-snippet__header.is-stacked, .p-code-snippet__header.is-stacked, .bf-code-snippet__header.is-stacked) {
  flex-direction: column;
}

:where(.bf-theme, .vr-theme) :where(.vr-code-snippet__title, .p-code-snippet__title, .bf-code-snippet__title) {
${typeStyles(h6, { includeCase: false })}  color: var(--vr-color-text-default);
  flex: 1 1 14rem;
  margin: 0;
  overflow-wrap: anywhere;
  padding-block: var(--vr-panel-padding-block);
  padding-inline: var(--vr-panel-padding-inline);
}

:where(.bf-theme, .vr-theme) :where(.vr-code-snippet__dropdowns, .p-code-snippet__dropdowns, .bf-code-snippet__dropdowns) {
  display: flex;
  flex: 1 0 auto;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-inline-start: auto;
  min-inline-size: 0;
}

:where(.bf-theme, .vr-theme) :where(.vr-code-snippet__header.is-stacked, .p-code-snippet__header.is-stacked, .bf-code-snippet__header.is-stacked) :where(.vr-code-snippet__dropdowns, .p-code-snippet__dropdowns, .bf-code-snippet__dropdowns) {
  justify-content: stretch;
  margin-inline-start: 0;
  box-shadow: inset 0 1px 0 var(--vr-color-border-default);
  width: 100%;
}

:where(.bf-theme, .vr-theme) :where(.vr-code-snippet__dropdown, .p-code-snippet__dropdown, .bf-code-snippet__dropdown) {
${typeStyles(body, { includeCase: false })}  appearance: none;
  background: transparent;
  border: 0;
  color: var(--vr-color-text-default);
  cursor: pointer;
  margin: 0;
  min-block-size: calc(${body.lineHeight} + (var(--vr-panel-padding-block) * 2));
  min-inline-size: 0;
  padding-block: var(--vr-panel-padding-block);
  padding-inline: var(--vr-panel-padding-inline);
  text-align: start;
}

:where(.bf-theme, .vr-theme) :where(.vr-code-snippet__dropdown, .p-code-snippet__dropdown, .bf-code-snippet__dropdown) + :where(.vr-code-snippet__dropdown, .p-code-snippet__dropdown, .bf-code-snippet__dropdown) {
  box-shadow: inset 1px 0 0 var(--vr-color-border-default);
}

:where(.bf-theme, .vr-theme) :where(.vr-code-snippet__dropdown, .p-code-snippet__dropdown, .bf-code-snippet__dropdown):focus {
  outline: none;
}

:where(.bf-theme, .vr-theme) :where(.vr-code-snippet__dropdown, .p-code-snippet__dropdown, .bf-code-snippet__dropdown):focus-visible {
  outline: 2px solid var(--vr-color-focus);
  outline-offset: -2px;
}

:where(.bf-theme, .vr-theme) :where(.vr-code-snippet__block, .p-code-snippet__block, .bf-code-snippet__block, .vr-code-snippet__block--icon, .p-code-snippet__block--icon, .bf-code-snippet__block--icon, .vr-code-snippet__block--numbered, .p-code-snippet__block--numbered, .bf-code-snippet__block--numbered) {
  background: var(--vr-color-background-alt);
  color: var(--vr-color-text-default);
  display: block;
  font-family: "IBM Plex Mono", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: ${body.fontSize};
  line-height: ${body.lineHeight};
  margin: 0;
  max-inline-size: 100%;
  min-inline-size: 0;
  overflow-x: auto;
  padding-block: var(--vr-panel-padding-block);
  padding-inline: var(--vr-panel-padding-inline);
  tab-size: 2;
  white-space: pre;
}

:where(.bf-theme, .vr-theme) :where(.vr-code-snippet__block, .p-code-snippet__block, .bf-code-snippet__block, .vr-code-snippet__block--icon, .p-code-snippet__block--icon, .bf-code-snippet__block--icon, .vr-code-snippet__block--numbered, .p-code-snippet__block--numbered, .bf-code-snippet__block--numbered) > :where(code) {
  display: block;
  font: inherit;
}

:where(.bf-theme, .vr-theme) :where(.vr-code-snippet__block.is-wrapped, .p-code-snippet__block.is-wrapped, .bf-code-snippet__block.is-wrapped, .vr-code-snippet__block--icon.is-wrapped, .p-code-snippet__block--icon.is-wrapped, .bf-code-snippet__block--icon.is-wrapped) {
  white-space: pre-wrap;
}

:where(.bf-theme, .vr-theme) :where(.vr-code-snippet__block--icon, .p-code-snippet__block--icon, .bf-code-snippet__block--icon) {
  cursor: copy;
  padding-inline-start: calc(var(--vr-panel-padding-inline) + (var(--vr-baseline) * 3));
  position: relative;
}

:where(.bf-theme, .vr-theme) :where(.vr-code-snippet__block--icon, .p-code-snippet__block--icon, .bf-code-snippet__block--icon)::before {
${typeStyles(h6, { includeCase: false })}  color: var(--vr-color-text-muted);
  content: "$";
  inset-inline-start: var(--vr-panel-padding-inline);
  inset-block-start: var(--vr-panel-padding-block);
  position: absolute;
}

:where(.bf-theme, .vr-theme) :where(.vr-code-snippet__block--icon.is-windows-prompt, .p-code-snippet__block--icon.is-windows-prompt, .bf-code-snippet__block--icon.is-windows-prompt)::before {
  content: ">";
}

:where(.bf-theme, .vr-theme) :where(.vr-code-snippet__block--icon.is-url, .p-code-snippet__block--icon.is-url, .bf-code-snippet__block--icon.is-url)::before {
  content: "\\1F517";
}

:where(.bf-theme, .vr-theme) :where(.vr-code-snippet__block--icon.is-copied, .p-code-snippet__block--icon.is-copied, .bf-code-snippet__block--icon.is-copied) {
  background: color-mix(in srgb, var(--vr-color-background-alt) 78%, var(--vr-color-background-information-default));
  box-shadow: inset 0 0 0 1px var(--vr-color-border-information);
}

:where(.bf-theme, .vr-theme) :where(.vr-code-snippet__block--icon, .p-code-snippet__block--icon, .bf-code-snippet__block--icon):focus {
  outline: none;
}

:where(.bf-theme, .vr-theme) :where(.vr-code-snippet__block--icon, .p-code-snippet__block--icon, .bf-code-snippet__block--icon):focus-visible {
  outline: 2px solid var(--vr-color-focus);
  outline-offset: -2px;
}

:where(.bf-theme, .vr-theme) :where(.vr-code-snippet__block--numbered, .p-code-snippet__block--numbered, .bf-code-snippet__block--numbered) {
  counter-reset: code-line;
}

:where(.bf-theme, .vr-theme) :where(.vr-code-snippet__line, .p-code-snippet__line, .bf-code-snippet__line) {
  counter-increment: code-line;
  display: block;
  min-block-size: ${body.lineHeight};
}

:where(.bf-theme, .vr-theme) :where(.vr-code-snippet__block--numbered, .p-code-snippet__block--numbered, .bf-code-snippet__block--numbered) :where(.vr-code-snippet__line, .p-code-snippet__line, .bf-code-snippet__line)::before {
  color: var(--vr-color-text-muted);
  content: counter(code-line);
  display: inline-block;
  font-variant-numeric: tabular-nums;
  min-inline-size: calc(var(--vr-baseline) * 5);
  padding-inline-end: var(--vr-panel-padding-inline);
  text-align: right;
  user-select: none;
}

:where(.bf-theme, .vr-theme) :where(.grid-row, .bf-control-grid, .p-equal-height-row, .p-equal-height-row--wrap) {
  container-type: inline-size;
  display: grid;
  gap: var(--vr-field-gap);
  grid-template-columns: minmax(0, 1fr);
  min-inline-size: 0;
}

:where(.bf-theme, .vr-theme) :where(.col-1, .col-2, .col-3, .col-4, .bf-control-grid__item, .p-equal-height-row__col) {
  display: grid;
  gap: var(--vr-field-gap);
  min-inline-size: 0;
}

@container (width >= 28rem) {
  :where(.bf-theme, .vr-theme) :where(.grid-row, .bf-control-grid, .p-equal-height-row--wrap) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  :where(.bf-theme, .vr-theme) :where(.col-2, .col-3, .col-4, .bf-control-grid__item--span-2, .bf-control-grid__item--span-3, .bf-control-grid__item--span-4) {
    grid-column: span 2;
  }
}

@container (width >= 42rem) {
  :where(.bf-theme, .vr-theme) :where(.grid-row, .bf-control-grid, .p-equal-height-row, .p-equal-height-row--wrap) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  :where(.bf-theme, .vr-theme) :where(.col-1, .bf-control-grid__item--span-1) {
    grid-column: span 1;
  }

  :where(.bf-theme, .vr-theme) :where(.col-2, .bf-control-grid__item--span-2) {
    grid-column: span 2;
  }

  :where(.bf-theme, .vr-theme) :where(.col-3, .bf-control-grid__item--span-3) {
    grid-column: span 3;
  }

  :where(.bf-theme, .vr-theme) :where(.col-4, .bf-control-grid__item--span-4) {
    grid-column: span 4;
  }
}

:where(.bf-theme, .vr-theme) :where(.l-application, .bf-application) {
  background: var(--vr-color-background-default);
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

:where(.bf-theme, .vr-theme) :where(.l-application.has-pinned-aside, .bf-application.has-pinned-aside),
:where(.bf-theme, .vr-theme) :where(.l-application):has(> .l-aside.is-pinned),
:where(.bf-theme, .vr-theme) :where(.bf-application):has(> .bf-aside.is-pinned) {
  grid-template-areas: "main aside";
  grid-template-columns: minmax(0, 1fr) minmax(0, var(--vr-application-aside-width));
  grid-template-rows: minmax(0, 1fr);
}

:where(.bf-theme, .vr-theme) :where(.l-main, .bf-main) {
  grid-area: main;
  min-block-size: 0;
  min-inline-size: 0;
  overflow: auto;
}

:where(.bf-theme, .vr-theme) :where(.l-application__overlay, .bf-application__overlay) {
  background: var(--vr-color-background-overlay);
  inset: 0;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  transition: opacity 160ms ease, visibility 160ms ease;
  visibility: hidden;
  z-index: 20;
}

:where(.bf-theme, .vr-theme) :where(.l-application.is-drawer-expanded, .bf-application.is-drawer-expanded) > :where(.l-application__overlay, .bf-application__overlay) {
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
}

:where(.bf-theme, .vr-theme) :where(.l-aside, .bf-aside) {
  background: var(--vr-color-background-default);
  border-inline-start: var(--vr-border-width) solid var(--vr-color-border-default);
  grid-area: aside;
  inline-size: 100%;
  min-block-size: 0;
  min-inline-size: 0;
  overflow: auto;
  position: relative;
}

:where(.bf-theme, .vr-theme) :where(.l-aside.is-overlay, .bf-aside.is-overlay, .l-aside.is-drawer, .bf-aside.is-drawer) {
  align-self: stretch;
  block-size: auto;
  box-shadow: 0 24px 72px rgba(0, 0, 0, 0.38);
  bottom: 0;
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  inline-size: min(100%, var(--vr-application-aside-width));
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

:where(.bf-theme, .vr-theme) :where(.l-aside.is-overlay.is-narrow, .bf-aside.is-overlay.is-narrow, .l-aside.is-drawer.is-narrow, .bf-aside.is-drawer.is-narrow) {
  inline-size: min(100%, var(--vr-application-aside-width-narrow));
}

:where(.bf-theme, .vr-theme) :where(.l-aside.is-overlay.is-wide, .bf-aside.is-overlay.is-wide, .l-aside.is-drawer.is-wide, .bf-aside.is-drawer.is-wide) {
  inline-size: min(100%, var(--vr-application-aside-width-wide));
}

:where(.bf-theme, .vr-theme) :where(.l-application.is-drawer-expanded, .bf-application.is-drawer-expanded) > :where(.l-aside.is-overlay, .bf-aside.is-overlay, .l-aside.is-drawer, .bf-aside.is-drawer),
:where(.bf-theme, .vr-theme) :where(.l-aside.is-overlay.is-open, .bf-aside.is-overlay.is-open, .l-aside.is-drawer.is-open, .bf-aside.is-drawer.is-open) {
  pointer-events: auto;
  transform: translateX(0);
  visibility: visible;
}

:where(.bf-theme, .vr-theme) :where(.l-aside.is-collapsed, .bf-aside.is-collapsed) {
  display: none;
}

:where(.bf-theme, .vr-theme) :where(.l-aside.is-pinned, .bf-aside.is-pinned) {
  display: block;
}

:where(.bf-theme, .vr-theme) :where(.l-aside.is-overlay, .bf-aside.is-overlay, .l-aside.is-drawer, .bf-aside.is-drawer) :where(.l-application__aside-resize-handle, .bf-application__aside-resize-handle) {
  display: none;
}

:where(.bf-theme, .vr-theme) :where(.l-application__aside-resize-handle, .bf-application__aside-resize-handle) {
  background: transparent;
  border: 0;
  cursor: ew-resize;
  display: none;
  inset-block: 0;
  inset-inline-start: calc(var(--vr-baseline) * -3);
  outline: none;
  position: absolute;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  width: calc(var(--vr-baseline) * 6);
  z-index: 3;
}

:where(.bf-theme, .vr-theme) :where(.l-application.has-pinned-aside, .bf-application.has-pinned-aside, .l-application:has(> .l-aside.is-pinned), .bf-application:has(> .bf-aside.is-pinned))
  :where(.l-aside.is-pinned, .bf-aside.is-pinned)
  > :where(.l-application__aside-resize-handle, .bf-application__aside-resize-handle) {
  display: block;
}

:where(.bf-theme, .vr-theme) :where(.l-application__aside-resize-handle, .bf-application__aside-resize-handle)::after {
  background: var(--vr-color-border-default);
  border-radius: 999px;
  content: "";
  inset-block: var(--vr-panel-padding-block);
  inset-inline-start: calc(50% - 1px);
  opacity: 0.95;
  position: absolute;
  transition: background-color 120ms ease, opacity 120ms ease;
  width: 2px;
}

:where(.bf-theme, .vr-theme) :where(.l-application__aside-resize-handle, .bf-application__aside-resize-handle):hover::after,
:where(.bf-theme, .vr-theme) :where(.l-application__aside-resize-handle, .bf-application__aside-resize-handle):focus-visible::after,
:where(.bf-theme, .vr-theme) :where(.l-application.is-resizing-aside, .bf-application.is-resizing-aside) :where(.l-application__aside-resize-handle, .bf-application__aside-resize-handle)::after {
  background: var(--vr-color-focus);
}

:where(.bf-theme, .vr-theme) :where(.l-application__aside-resize-handle, .bf-application__aside-resize-handle):focus-visible {
  outline: 2px solid var(--vr-color-focus);
  outline-offset: -2px;
}
`;
}
