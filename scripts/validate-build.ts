import fs from "node:fs/promises";
import path from "node:path";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function assertExists(filePath: string): Promise<void> {
  await fs.access(filePath);
}

async function readThemeArtifacts(baseDir: string): Promise<{ tokens: Record<string, unknown>; css: string; }> {
  const tokensPath = path.join(baseDir, "tokens.json");
  const cssPath = path.join(baseDir, "styles.css");

  await assertExists(tokensPath);
  await assertExists(cssPath);

  return {
    tokens: JSON.parse(await fs.readFile(tokensPath, "utf8")) as Record<string, unknown>,
    css: await fs.readFile(cssPath, "utf8")
  };
}

function validateCommonCss(css: string): void {
  assert(css.includes("@font-face"), "Expected generated CSS to include runtime font-face rules.");
  assert(css.includes("font-family: \"IBM Plex Sans\";"), "Expected generated CSS to register the IBM Plex Sans family.");
  assert(css.includes("IBMPlexSansVar-Roman.woff"), "Expected generated CSS to point to the IBM Plex Sans variable Roman font.");
  assert(css.includes("IBMPlexSansVar-Italic.woff"), "Expected generated CSS to point to the IBM Plex Sans variable Italic font.");
  assert(css.includes("font-weight: 100 700;"), "Expected generated CSS to expose the variable weight range.");
  assert(css.includes("@container (width >= 38.75rem)"), "Expected CSS to use the Canonical 620px threshold for the 8-column grid.");
  assert(css.includes("@container (width >= 105.0625rem)"), "Expected CSS to use the Canonical 1681px threshold for the 16-column grid.");
  assert(!css.includes("@container (width >= 42rem)"), "Expected CSS to avoid the older 42rem 8-column threshold.");
  assert(!css.includes("@container (width >= 72rem)"), "Expected CSS to avoid the older 72rem 16-column threshold.");
  assert(css.includes(":where(.bf-theme[data-bf-tone='dark'], .vr-theme[data-bf-tone='dark'], .vr-theme.is-dark)"), "Expected generated CSS to include a core dark-tone override.");
  assert(css.includes("--bf-color-bg: var(--vf-color-background-default, #171717);"), "Expected generated CSS to switch core background tokens in dark mode.");
  assert(css.includes("--bf-baseline-grid-color: rgba(15, 23, 42, 0.12);"), "Expected baseline-grid overlays to declare a default line color.");
  assert(css.includes(":where(.bf-theme, .vr-theme) .u-baseline-grid {\n  --bf-baseline-grid-color: rgba(20, 22, 28, 0.12);"), "Expected light themes to provide a visible baseline-grid line color.");
  assert(css.includes(":where(.bf-theme[data-bf-tone='dark'], .vr-theme[data-bf-tone='dark'], .vr-theme.is-dark) .u-baseline-grid {\n  --bf-baseline-grid-color: rgba(255, 255, 255, 0.16);"), "Expected dark themes to provide a visible baseline-grid line color.");
  assert(css.includes("--bf-grid-columns: 16;"), "Expected the grid CSS to include the 16-column mode.");
  assert(css.includes(".bf-span-16"), "Expected the grid CSS to include the 16-column span class.");
  assert(!css.includes(".bf-span-12"), "Expected the grid CSS to omit the old 12-column span class.");
  assert(css.includes("text-transform: uppercase;"), "Expected CSS to include the h5 uppercase treatment.");
  assert(!css.includes("font-variant-caps: all-small-caps;"), "Expected CSS to avoid the old h5 faux small-caps treatment.");
  assert(css.includes("letter-spacing: 0.07em;"), "Expected CSS to include the h5 uppercase tracking.");
  assert(css.includes("margin-bottom: var(--bf-space-after-comp, 0rem);"), "Expected prose flow boundaries to keep baseline compensation.");
  assert(css.includes(".bf-prose li"), "Expected CSS to include list item selectors.");
  assert(css.includes("padding-block-end: var(--bf-space-after-comp);"), "Expected list items to preserve baseline compensation.");
  assert(css.includes("margin: 0 0 var(--bf-space-after-sem);"), "Expected list containers to use semantic spacing without double-applying compensation.");
  assert(!css.includes(".bf-prose li + li"), "Expected list spacing to avoid the old ad hoc inter-item margin.");
  assert(css.includes("margin: 0 0 calc(var(--bf-space-3) - 1px);"), "Expected rules to compensate their 1px thickness against the baseline rhythm.");
  assert(css.includes("padding-block-end: var(--bf-strip-space);"), "Expected strip rhythm to live on the bottom edge only.");
  assert(!css.includes("padding-block: var(--bf-strip-space);"), "Expected strip rhythm to avoid symmetric top-and-bottom padding.");
  assert(css.includes(".bf-grid"), "Expected CSS to include grid selectors.");
  assert(css.includes(".bf-section"), "Expected CSS to include section selectors.");
  assert(css.includes(".bf-stack"), "Expected CSS to include stack selectors.");
  assert(css.includes(".u-baseline-grid"), "Expected CSS to include the baseline grid utility.");
  assert(css.includes("border-bottom: var(--vr-border-width) solid var(--vr-color-border-high-contrast);"), "Expected compat form controls to use the flatter PVR-style bottom border treatment.");
  assert(!css.includes("border: var(--vr-border-width) solid var(--vr-color-border-high-contrast);\n  border-radius: var(--vr-radius);\n  color: var(--vr-color-text-default);\n  block-size: var(--vr-control-block-size);"), "Expected compat form controls to avoid the old full-box field styling.");
  assert(css.includes("input[type='file'])::file-selector-button"), "Expected compat CSS to include dense file input styling.");
  assert(css.includes(":where(.p-slider__wrapper--stacked, .bf-slider--stacked) {\n  align-items: stretch;\n  display: grid;\n  gap: var(--vr-field-gap);"), "Expected stacked slider pairs to stay on the baseline-aligned field gap.");
  assert(css.includes("inline-size: min(100%, 5rem);"), "Expected slider number inputs to use the compact PVR width.");
  assert(css.includes(":where(.p-switch__slider, .bf-switch__slider)"), "Expected compat CSS to include switch styling.");
  assert(css.includes(":where(.p-form-validation__message, .bf-validation-message)"), "Expected compat CSS to include validation message styling.");
  assert(css.includes(":where(.p-card, .p-card--highlighted, .p-card--overlay, .p-card--muted, .bf-card, .bf-card--highlighted, .bf-card--overlay, .bf-card--muted)"), "Expected compat CSS to include card surfaces.");
  assert(css.includes(":where(.p-divider, .bf-divider)"), "Expected compat CSS to include divider surfaces.");
  assert(css.includes(":where(.p-segmented-control__button, .p-tab-buttons__button, .bf-segmented-control__button, .bf-tab-buttons__button)"), "Expected compat CSS to include segmented control buttons.");
  assert(css.includes(":where(.p-breadcrumbs__items, .bf-breadcrumbs__items)"), "Expected compat CSS to include breadcrumb styling.");
  assert(css.includes(":where(.p-pagination__items, .bf-pagination__items)"), "Expected compat CSS to include pagination styling.");
  assert(css.includes(":where(table, .p-table, .bf-table)"), "Expected compat CSS to include table styling.");
  assert(css.includes(":where(.p-chip, .p-chip--positive, .p-chip--caution, .p-chip--negative, .p-chip--information, .bf-chip, .bf-chip--positive, .bf-chip--caution, .bf-chip--negative, .bf-chip--information)"), "Expected compat CSS to include chip styling.");
  assert(css.includes(":where(.p-badge, .p-badge--negative, .bf-badge, .bf-badge--negative)"), "Expected compat CSS to include badge styling.");
  assert(css.includes(":where(.p-status-label, .p-label, .p-status-label--positive"), "Expected compat CSS to include status label styling.");
  assert(css.includes(":where(.p-search-box, .bf-search-box)"), "Expected compat CSS to include search-box styling.");
  assert(css.includes(":where(.p-search-and-filter, .bf-search-and-filter)"), "Expected compat CSS to include search-and-filter styling.");
}

function validateCommonTokens(tokens: Record<string, unknown>): {
  roles: Record<string, Record<string, unknown>>;
  layout: Record<string, unknown>;
  components: Record<string, unknown>;
} {
  const roles = (tokens.roles ?? {}) as Record<string, Record<string, unknown>>;
  const layout = (tokens.layout ?? {}) as Record<string, unknown>;
  const components = (tokens.components ?? {}) as Record<string, unknown>;
  const fontFiles = (tokens.fontFiles ?? []) as Array<Record<string, unknown>>;
  const roleNames = Object.keys(roles);

  assert(roleNames.length > 0, "Expected generated tokens to include typography roles.");
  assert(roles.body, 'Expected generated tokens to include a "body" role.');
  assert(roles.h1 && roles.h2 && roles.h3 && roles.h4 && roles.h5 && roles.h6, "Expected generated tokens to include the standard heading roles.");
  assert(fontFiles.some(fontFile => fontFile.family === "plex-sans"), "Expected generated tokens to include the IBM Plex Sans Roman font.");
  assert(fontFiles.some(fontFile => fontFile.family === "plex-sans-italic"), "Expected generated tokens to include the IBM Plex Sans Italic font metadata.");
  assert(components.borderWidth, "Expected generated tokens to include component border width.");
  assert(components.controlInlinePadding, "Expected generated tokens to include component padding.");
  assert(components.controlVisualSize, "Expected generated tokens to include component visual size.");
  assert(components.controlMinBlockSize, "Expected generated tokens to include component control size.");
  assert(components.controlMinBlockSizeDense, "Expected generated tokens to include component dense control size.");

  return { roles, layout, components };
}

function validateDefaultTheme(tokens: Record<string, unknown>, css: string): void {
  const { roles, layout, components } = validateCommonTokens(tokens);
  const fontSizes = new Set(Object.values(roles).map(role => role.fontSize).filter(Boolean));

  assert(roles.body.fontSize === "1rem", "Expected the prose default body role font size to be 1rem.");
  assert(roles.body.fontFamily === "plex-sans", "Expected the prose default body role font family to be plex-sans.");
  assert(roles.h1.fontSize === "2.625rem", "Expected the prose default h1 role font size to be 2.625rem.");
  assert(roles.h2.fontSize === "2.625rem", "Expected the prose default h2 role font size to be 2.625rem.");
  assert(roles.h3.fontSize === "1.5rem", "Expected the prose default h3 role font size to be 1.5rem.");
  assert(roles.h4.fontSize === "1.5rem", "Expected the prose default h4 role font size to be 1.5rem.");
  assert(roles.h5.fontSize === "1rem", "Expected the prose default h5 role font size to stay at the body size.");
  assert(roles.h6.fontSize === "1rem", "Expected the prose default h6 role font size to stay at the body size.");
  assert(roles.h1.fontWeight === 600, "Expected the prose default h1 to be the heavier member of the top pair.");
  assert(roles.h2.fontWeight === 400, "Expected the prose default h2 to sit 200 weight units below h1.");
  assert(roles.h3.fontWeight === 600, "Expected the prose default h3 to be the heavier member of the middle pair.");
  assert(roles.h4.fontWeight === 400, "Expected the prose default h4 to sit 200 weight units below h3.");
  assert(roles.h5.fontWeight === 600, "Expected the prose default h5 to be bold uppercase.");
  assert(roles.h6.fontWeight === 600, "Expected the prose default h6 to be bold at the body size.");
  assert(roles.h5.textTransform === "uppercase", "Expected the prose default h5 to use uppercase.");
  assert(!roles.h5.fontVariantCaps, "Expected the prose default h5 to avoid font-variant small-caps settings.");
  assert(roles.h5.letterSpacing === "0.07em", "Expected the prose default h5 to use uppercase tracking.");
  assert(fontSizes.size === 3, "Expected the prose default theme to expose three size tiers overall.");
  assert(layout.gridGapInline === "1.5rem", "Expected the prose default inline grid gap to be 1.5rem.");
  assert(layout.gridGapBlock === "1.5rem", "Expected the prose default block grid gap to be 1.5rem.");
  assert(layout.sectionSpace === "4rem", "Expected the prose default section rhythm to be 4rem.");
  assert(components.radius === "0rem", "Expected the prose default controls to stay square, matching the compat visual direction.");
  assert(components.controlVisualSize === "1rem", "Expected the prose default control glyphs to use a dedicated 1rem visual size.");
  assert(components.controlMinBlockSize === "2.5rem", "Expected the prose default control height to come from the theme components block.");
  assert(components.controlMinBlockSizeDense === "2rem", "Expected the prose default dense control height to come from the theme components block.");

  for (const roleName of Object.keys(roles)) {
    assert(css.includes(`.bf-${roleName}`), `Expected generated CSS to include the configured "${roleName}" utility selector.`);
  }

  assert(!css.includes(".bf-lead"), "Expected CSS to avoid generating an implicit lead alias when no lead role is configured.");
  assert(!css.includes(".bf-eyebrow"), "Expected CSS to avoid generating an implicit eyebrow alias when no eyebrow role is configured.");
  assert(!css.includes(".bf-meta"), "Expected CSS to avoid generating an implicit meta alias when no meta role is configured.");
}

function validatePanelTheme(tokens: Record<string, unknown>, css: string): void {
  const { roles, layout, components } = validateCommonTokens(tokens);
  const fontSizes = new Set(Object.values(roles).map(role => role.fontSize).filter(Boolean));

  assert(roles.body.fontSize === "0.75rem", "Expected the panel preset body role font size to be 0.75rem.");
  assert(roles.body.lineHeight === "1rem", "Expected the panel preset body line height to be 1rem.");
  assert(roles.h1.fontSize === "1.96875rem", "Expected the panel preset h1 role font size to be 1.96875rem.");
  assert(roles.h2.fontSize === "1.96875rem", "Expected the panel preset h2 role font size to be 1.96875rem.");
  assert(roles.h1.lineHeight === "2.25rem", "Expected the panel preset h1 line height to be 2.25rem.");
  assert(roles.h2.lineHeight === "2.25rem", "Expected the panel preset h2 line height to be 2.25rem.");
  assert(roles.h3.fontSize === "1.125rem", "Expected the panel preset h3 role font size to be 1.125rem.");
  assert(roles.h4.fontSize === "1.125rem", "Expected the panel preset h4 role font size to be 1.125rem.");
  assert(roles.h3.lineHeight === "1.5rem", "Expected the panel preset h3 line height to be 1.5rem.");
  assert(roles.h4.lineHeight === "1.5rem", "Expected the panel preset h4 line height to be 1.5rem.");
  assert(roles.h5.fontSize === "0.75rem", "Expected the panel preset h5 role font size to stay at the compact body size.");
  assert(roles.h6.fontSize === "0.75rem", "Expected the panel preset h6 role font size to stay at the compact body size.");
  assert(roles.h1.fontWeight === 600, "Expected the panel preset h1 to be the heavier member of the top pair.");
  assert(roles.h2.fontWeight === 400, "Expected the panel preset h2 to sit 200 weight units below h1.");
  assert(roles.h3.fontWeight === 600, "Expected the panel preset h3 to be the heavier member of the middle pair.");
  assert(roles.h4.fontWeight === 400, "Expected the panel preset h4 to sit 200 weight units below h3.");
  assert(roles.h5.fontWeight === 600, "Expected the panel preset h5 to stay bold uppercase.");
  assert(roles.h6.fontWeight === 600, "Expected the panel preset h6 to stay bold at the compact body size.");
  assert(roles.h5.textTransform === "uppercase", "Expected the panel preset h5 to use uppercase.");
  assert(!roles.h5.fontVariantCaps, "Expected the panel preset h5 to avoid font-variant small-caps settings.");
  assert(roles.h5.letterSpacing === "0.07em", "Expected the panel preset h5 to use uppercase tracking.");
  assert(fontSizes.size === 3, "Expected the panel preset to keep the same three size tiers overall.");
  assert(layout.measure === "30rem", "Expected the panel preset reading measure to scale down to 30rem.");
  assert(layout.sectionSpace === "3rem", "Expected the panel preset section rhythm to scale down to 3rem.");
  assert(layout.sectionSpaceDeep === "6rem", "Expected the panel preset deep section rhythm to scale down to 6rem.");
  assert(layout.gridGapInline === "1rem", "Expected the panel preset inline grid gap to tighten to 1rem.");
  assert(layout.gridGapBlock === "1rem", "Expected the panel preset block grid gap to tighten to 1rem.");
  assert(layout.pageMargin === "1.5rem", "Expected the panel preset page margin to tighten to 1.5rem.");
  assert(components.radius === "0rem", "Expected the panel preset controls to stay square like PVR/Vanilla.");
  assert(components.controlInlinePadding === "0.75rem", "Expected the panel preset control padding to come from the dense components block.");
  assert(components.controlVisualSize === "0.75rem", "Expected the panel preset checkbox/radio/thumb glyphs to use a dedicated 0.75rem visual size.");
  assert(components.fieldGap === "0.25rem", "Expected the panel preset field gap to come from the dense components block.");
  assert(components.panelPaddingInline === "1rem", "Expected the panel preset panel padding to come from the dense components block.");
  assert(components.panelPaddingBlock === "1rem", "Expected the panel preset panel padding to come from the dense components block.");
  assert(components.accordionIndent === "0.75rem", "Expected the panel preset accordion indent to come from the dense components block.");
  assert(components.controlMinBlockSize === "1.75rem", "Expected the panel preset control height to add one more baseline unit of breathing room.");
  assert(components.controlMinBlockSizeDense === "1.5rem", "Expected the panel preset dense control height to add one more baseline unit of breathing room.");

  assert(typeof roles.body.nudgeTop === "string" && css.includes(`padding-top: ${roles.body.nudgeTop};`), "Expected compact list items to use the panel preset body nudge.");
  assert(css.includes("--vr-control-visual-size: var(--bf-control-visual-size);"), "Expected compat CSS to expose a dedicated visual control size variable.");
  assert(css.includes("block-size: var(--vr-control-visual-size);"), "Expected compat CSS to size checkbox/radio/thumb visuals from the dedicated control visual token.");
}

async function main(): Promise<void> {
  const defaultTheme = await readThemeArtifacts(path.resolve("dist"));
  const prosePreset = await readThemeArtifacts(path.resolve("dist/presets/prose"));
  const panelPreset = await readThemeArtifacts(path.resolve("dist/presets/panel"));

  validateCommonCss(defaultTheme.css);
  validateCommonCss(prosePreset.css);
  validateCommonCss(panelPreset.css);

  validateDefaultTheme(defaultTheme.tokens, defaultTheme.css);
  validateDefaultTheme(prosePreset.tokens, prosePreset.css);
  validatePanelTheme(panelPreset.tokens, panelPreset.css);

  console.log("Build validation passed.");
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
