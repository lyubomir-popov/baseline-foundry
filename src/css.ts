import { gridCss } from "./css-grid.js";
import { componentsCss } from "./css-components.js";
import { appTierPresetCss } from "./css-app-tier.js";
import { BASELINE_GRID_DARK_THEME_COLOR, BASELINE_GRID_DEFAULT_COLOR, BASELINE_GRID_LIGHT_THEME_COLOR } from "./baseline-grid-theme.js";
import { foundryThemeRootColorVars, vanillaThemeColorVars } from "./vanilla-theme-colors.js";
import type { BuiltInThemeName } from "./presets.js";
import type { ThemeFontFile, ThemeTokens, TierOverride, TypographyToken } from "./types.js";

function parseRemValue(rem: string): number {
  return Number.parseFloat(rem.replace("rem", ""));
}

function toRemLiteral(value: number): string {
  return `${Math.round(value * 100000) / 100000}rem`;
}

function nudgeEnd(baselineUnit: string, nudgeTop: string): string {
  const nt = parseRemValue(nudgeTop);
  if (nt === 0) return "0rem";
  return toRemLiteral(parseRemValue(baselineUnit) - nt);
}

function fontFormat(path: string): string {
  const extension = path.split(".").pop()?.toLowerCase();

  if (extension === "woff2") {
    return "woff2";
  }

  if (extension === "woff") {
    return "woff";
  }

  if (extension === "ttf") {
    return "truetype";
  }

  if (extension === "otf") {
    return "opentype";
  }

  return extension ?? "woff";
}

function fontFaceRule(fontFile: ThemeFontFile): string {
  if (!fontFile.cssFamily) {
    return "";
  }

  return `@font-face {\n  font-family: "${fontFile.cssFamily}";\n  src: url("${fontFile.path}") format("${fontFormat(fontFile.path)}");\n  font-style: ${fontFile.fontStyle ?? "normal"};\n  font-weight: ${fontFile.fontWeight ?? "400"};\n  font-display: ${fontFile.fontDisplay ?? "swap"};\n}\n`;
}

function semanticMarginBottom(spaceAfter: string, baselineUnit: string): string {
  return toRemLiteral(parseRemValue(spaceAfter) - parseRemValue(baselineUnit));
}

function textRule(selectors: string[], token: TypographyToken, baselineUnit: string, extra = ""): string {
  const fontVariantCaps = token.fontVariantCaps ? `  font-variant-caps: ${token.fontVariantCaps};\n` : "";
  const letterSpacing = token.letterSpacing ? `  letter-spacing: ${token.letterSpacing};\n` : "";
  const textTransform = token.textTransform ? `  text-transform: ${token.textTransform};\n` : "";
  const mb = semanticMarginBottom(token.spaceAfter, baselineUnit);
  return `${selectors.join(",\n")} {\n  font-family: ${token.fontStack};\n  font-size: ${token.fontSize};\n  font-style: ${token.fontStyle ?? "normal"};\n  font-weight: ${token.fontWeight ?? 400};\n${fontVariantCaps}${letterSpacing}${textTransform}  line-height: ${token.lineHeight};\n  margin-bottom: ${mb};\n  padding-block-end: ${nudgeEnd(baselineUnit, token.nudgeTop)};\n  padding-block-start: ${token.nudgeTop};\n${extra}}\n`;
}

function tierOverrideTextRule(scope: string, selectors: string[], token: TypographyToken, baseToken: TypographyToken, baselineUnit: string, baseBaselineUnit: string): string {
  const props: string[] = [];
  if (token.fontSize !== baseToken.fontSize) props.push(`  font-size: ${token.fontSize};`);
  if (token.fontWeight !== baseToken.fontWeight) props.push(`  font-weight: ${token.fontWeight ?? 400};`);
  if ((token.fontStyle ?? "normal") !== (baseToken.fontStyle ?? "normal")) props.push(`  font-style: ${token.fontStyle ?? "normal"};`);
  if (token.lineHeight !== baseToken.lineHeight) props.push(`  line-height: ${token.lineHeight};`);
  const overrideMb = semanticMarginBottom(token.spaceAfter, baselineUnit);
  const baseMb = semanticMarginBottom(baseToken.spaceAfter, baseBaselineUnit);
  if (overrideMb !== baseMb) props.push(`  margin-bottom: ${overrideMb};`);
  if (token.nudgeTop !== baseToken.nudgeTop || nudgeEnd(baselineUnit, token.nudgeTop) !== nudgeEnd(baseBaselineUnit, baseToken.nudgeTop)) {
    props.push(`  padding-block-start: ${token.nudgeTop};`);
    props.push(`  padding-block-end: ${nudgeEnd(baselineUnit, token.nudgeTop)};`);
  }
  if (token.fontVariantCaps !== baseToken.fontVariantCaps) {
    props.push(token.fontVariantCaps ? `  font-variant-caps: ${token.fontVariantCaps};` : `  font-variant-caps: normal;`);
  }
  if (token.letterSpacing !== baseToken.letterSpacing) {
    props.push(token.letterSpacing ? `  letter-spacing: ${token.letterSpacing};` : `  letter-spacing: normal;`);
  }
  if (props.length === 0) return "";
  const scopedSelectors = selectors.map(s => s.replace(":where(.bf-theme)", `:where(.bf-theme.${scope})`));
  return `${scopedSelectors.join(",\n")} {\n${props.join("\n")}\n}\n`;
}

function capEngineDemoRule(selectors: string[], token: TypographyToken): string {
  const capPosition = `calc((${token.lineHeight} + 1cap) / 2)`;
  const capStartNudge = `calc(var(--bf-baseline) - mod(${capPosition}, var(--bf-baseline)))`;
  const capEndNudge = `calc(var(--bf-baseline) - ${capStartNudge})`;
  const scopedSelectors = selectors.map(s => s.replace(":where(.bf-theme)", ":where(.bf-engine-cap)"));
  return `${scopedSelectors.join(",\n")} {\n  padding-block-start: ${capStartNudge};\n  padding-block-end: ${capEndNudge};\n}\n`;
}

const SEMANTIC_SELECTORS_BY_ROLE: Record<string, string[]> = {
  body: [":where(.bf-theme) :where(p)", ":where(.bf-theme) .bf-prose p"],
  h1: [":where(.bf-theme) :where(h1)", ":where(.bf-theme) .bf-prose h1"],
  h2: [":where(.bf-theme) :where(h2)", ":where(.bf-theme) .bf-prose h2"],
  h3: [":where(.bf-theme) :where(h3)", ":where(.bf-theme) .bf-prose h3"],
  h4: [":where(.bf-theme) :where(h4)", ":where(.bf-theme) .bf-prose h4"],
  h5: [":where(.bf-theme) :where(h5)", ":where(.bf-theme) .bf-prose h5"],
  h6: [":where(.bf-theme) :where(h6)", ":where(.bf-theme) .bf-prose h6"],
  meta: [":where(.bf-theme) :where(figcaption)", ":where(.bf-theme) .bf-prose figcaption"]
};

const EXTRA_STYLES_BY_ROLE: Record<string, string> = {
  body: "  max-inline-size: var(--bf-measure);\n",
  lead: "  color: var(--bf-color-muted);\n  max-inline-size: calc(var(--bf-measure) + var(--bf-space-4));\n",
  h1: "  letter-spacing: -0.03em;\n  max-inline-size: calc(var(--bf-measure) + var(--bf-space-6));\n",
  h2: "  letter-spacing: -0.025em;\n  max-inline-size: calc(var(--bf-measure) + var(--bf-space-4));\n",
  h3: "  letter-spacing: -0.02em;\n",
  h4: "  letter-spacing: -0.015em;\n",
  eyebrow: "  color: var(--bf-color-muted);\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n",
  meta: "  color: var(--bf-color-muted);\n"
};

function selectorsForRole(roleName: string): string[] {
  const semanticSelectors = SEMANTIC_SELECTORS_BY_ROLE[roleName] ?? [];
  return [...semanticSelectors, `:where(.bf-theme) .bf-${roleName}`];
}

function innerSelectorsForRole(roleName: string): string[] {
  const semanticSelectors = SEMANTIC_SELECTORS_BY_ROLE[roleName] ?? [];
  const innerParts = semanticSelectors.map(s =>
    s.replace(":where(.bf-theme) ", "")
  );
  return [...innerParts, `.bf-${roleName}`];
}

function tierLayoutOverrides(scope: string, overrideTokens: ThemeTokens, baseTokens: ThemeTokens): string {
  const props: string[] = [];
  const ol = overrideTokens.layout;
  const bl = baseTokens.layout;
  if (ol.sectionSpace !== bl.sectionSpace) props.push(`  --bf-section-space: ${ol.sectionSpace};`);
  if (ol.sectionSpaceShallow !== bl.sectionSpaceShallow) props.push(`  --bf-section-space-shallow: ${ol.sectionSpaceShallow};`);
  if (ol.sectionSpaceDeep !== bl.sectionSpaceDeep) props.push(`  --bf-section-space-deep: ${ol.sectionSpaceDeep};`);
  if (ol.gridGapInline !== bl.gridGapInline) props.push(`  --bf-grid-gap-inline: ${ol.gridGapInline};`);
  if (ol.gridGapBlock !== bl.gridGapBlock) props.push(`  --bf-grid-gap-block: ${ol.gridGapBlock};`);
  if (ol.pageMargin !== bl.pageMargin) props.push(`  --bf-page-margin: ${ol.pageMargin};`);
  if (ol.measure !== bl.measure) props.push(`  --bf-measure: ${ol.measure};`);
  if (ol.contentMaxWidth !== bl.contentMaxWidth) props.push(`  --bf-content-max-width: ${ol.contentMaxWidth};`);
  if (ol.stripSpace !== bl.stripSpace) props.push(`  --bf-strip-space: ${ol.stripSpace};`);
  if (props.length === 0) return "";
  return `:where(.bf-theme.${scope}) {\n${props.join("\n")}\n}\n`;
}

export function generateFoundryCss(tokens: ThemeTokens, options: { presetName?: BuiltInThemeName; tierOverrides?: TierOverride[]; } = {}): string {
  const body = tokens.roles.body;
  const baselineUnit = tokens.baselineUnit;
  const fontFaces = tokens.fontFiles.map(fontFaceRule).filter(Boolean).join("\n");
  const roleRules = Object.entries(tokens.roles)
    .map(([roleName, token]) => textRule(selectorsForRole(roleName), token, baselineUnit, EXTRA_STYLES_BY_ROLE[roleName] ?? ""))
    .join("\n");

  const capEngineDemo = `/* DEMO ONLY — Cap-derived nudges are unreliable (ascender ≠ cap height).\n   The approximation (line-height + 1cap) / 2 drifts at larger sizes.\n   Kept as a reference for why metrics-derived nudges are used instead. */\n` +
    Object.entries(tokens.roles)
      .map(([roleName, token]) => capEngineDemoRule(selectorsForRole(roleName), token))
      .join("\n");

  const tierOverrideCss = (options.tierOverrides ?? []).map(override => {
    const textOverrides = Object.entries(override.roles)
      .map(([roleName, token]) => {
        const baseToken = tokens.roles[roleName];
        if (!baseToken) return "";
        return tierOverrideTextRule(override.className, selectorsForRole(roleName), token, baseToken, override.baselineUnit ?? baselineUnit, baselineUnit);
      })
      .filter(Boolean)
      .join("\n");
    const layoutOverrides = override.tokens ? tierLayoutOverrides(override.className, override.tokens, tokens) : "";
    return `${textOverrides}\n${layoutOverrides}`;
  }).join("\n");

  const presetCss = options.presetName === "app" || options.presetName === "app-tier" ? `\n${appTierPresetCss()}` : "";

  if (!body) {
    throw new Error("Theme tokens require a body role.");
  }

  return `${fontFaces}${fontFaces ? "\n" : ""}.u-baseline-grid {
  --bf-baseline-grid-color: ${BASELINE_GRID_DEFAULT_COLOR};
  --bf-baseline-grid-page-color: transparent;
  --bf-baseline-grid-offset: 0rem;
  --bf-baseline-grid-size: var(--bf-baseline, ${tokens.baselineUnit});
  position: relative;
}

.u-baseline-grid::after {
  background-image: linear-gradient(
    to top,
    var(--bf-baseline-grid-color),
    var(--bf-baseline-grid-color) 1px,
    transparent 1px,
    transparent
  );
  background-size: 100% var(--bf-baseline-grid-size);
  bottom: 0;
  content: "";
  display: block;
  left: 0;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: var(--bf-baseline-grid-offset);
  z-index: 200;
}

html.u-baseline-grid {
  background-color: var(--bf-baseline-grid-page-color);
  position: static;
}

html.u-baseline-grid::after {
  z-index: -1;
}

:where(.bf-theme) {
  --bf-baseline: ${tokens.baselineUnit};
  --bf-space-0: 0rem;
  --bf-space-half: calc(var(--bf-baseline) / 2);
  --bf-space-1: var(--bf-baseline);
  --bf-space-2: calc(var(--bf-baseline) * 2);
  --bf-space-3: calc(var(--bf-baseline) * 3);
  --bf-space-4: calc(var(--bf-baseline) * 4);
  --bf-space-6: calc(var(--bf-baseline) * 6);
  --bf-space-8: calc(var(--bf-baseline) * 8);
  --bf-space-12: calc(var(--bf-baseline) * 12);
  --bf-space-16: calc(var(--bf-baseline) * 16);
  --bf-content-max-width: ${tokens.layout.contentMaxWidth};
  --bf-content-padding-inline: ${tokens.layout.contentPaddingInline};
  --bf-measure: ${tokens.layout.measure};
  --bf-section-space: ${tokens.layout.sectionSpace};
  --bf-section-space-shallow: ${tokens.layout.sectionSpaceShallow};
  --bf-section-space-deep: ${tokens.layout.sectionSpaceDeep};
  --bf-strip-space: ${tokens.layout.stripSpace};
  --bf-grid-gap-inline: ${tokens.layout.gridGapInline};
  --bf-grid-gap-block: ${tokens.layout.gridGapBlock};
  --bf-page-margin: ${tokens.layout.pageMargin};
${vanillaThemeColorVars("light")}${foundryThemeRootColorVars("light")}
  background: var(--bf-color-bg);
  color: var(--bf-color-text);
  font-family: var(--bf-body-font-family, ${body.fontStack});
  font-size: var(--bf-body-font-size, ${body.fontSize});
  font-style: var(--bf-body-font-style, ${body.fontStyle ?? "normal"});
  font-weight: var(--bf-body-font-weight, ${body.fontWeight ?? 400});
  line-height: var(--bf-body-line-height, ${body.lineHeight});
}

:where(.bf-theme.is-dark) {
${vanillaThemeColorVars("dark")}${foundryThemeRootColorVars("dark")}
  color-scheme: dark;
}

:where(.bf-theme.is-light) {
  color-scheme: light;
}

:where(.bf-theme),
:where(.bf-theme) * {
  box-sizing: border-box;
}

:where(.bf-theme).u-baseline-grid,
:where(.bf-theme) .u-baseline-grid {
  --bf-baseline-grid-color: ${BASELINE_GRID_LIGHT_THEME_COLOR};
}

:where(.bf-theme.is-dark).u-baseline-grid,
:where(.bf-theme.is-dark) .u-baseline-grid {
  --bf-baseline-grid-color: ${BASELINE_GRID_DARK_THEME_COLOR};
}

:where(.bf-theme) :where(h1, h2, h3, h4, h5, h6, p, blockquote, figure, ul, ol, dl, pre) {
  margin: 0;
}

:where(.bf-theme) :where(img, picture, svg, video) {
  block-size: auto;
  display: block;
  inline-size: auto;
  max-inline-size: 100%;
}

:where(.bf-theme) :where(a) {
  color: var(--bf-color-link);
  text-decoration-thickness: 1px;
  text-underline-offset: 0.12em;
}

:where(.bf-theme) :where(a:visited) {
  color: var(--bf-color-link-visited);
}

:where(.bf-theme) :where(a:focus-visible) {
  outline: 2px solid var(--bf-color-focus);
  outline-offset: 2px;
}

:where(.bf-theme) :where(code) {
  font-family: "Ubuntu Sans Mono", ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 0.95em;
}

:where(.bf-theme) :where(.bf-page) {
  margin-inline: auto;
  max-inline-size: var(--bf-content-max-width);
  padding-inline: max(var(--bf-page-margin), var(--bf-content-padding-inline));
}

:where(.bf-theme) :where(.bf-section) {
  margin-block-end: var(--bf-section-space);
}

:where(.bf-theme) :where(.bf-section.is-shallow) {
  margin-block-end: var(--bf-section-space-shallow);
}

:where(.bf-theme) :where(.bf-section.is-deep) {
  margin-block-end: var(--bf-section-space-deep);
}

:where(.bf-theme) :where(.bf-strip) {
  padding-block-end: var(--bf-strip-space);
}

:where(.bf-theme) :where(.bf-fixed-width, .bf-measure) {
  inline-size: min(100%, var(--bf-measure));
}

:where(.bf-theme) :where(.bf-stage-shell) {
  --bf-stage-shell-gap: var(--bf-space-3);
  align-content: center;
  align-items: center;
  display: grid;
  gap: var(--bf-stage-shell-gap);
  justify-items: center;
  min-block-size: 100%;
  min-inline-size: 0;
  padding-block: var(--bf-space-4);
}

:where(.bf-theme) :where(.bf-stage-shell.is-tight) {
  --bf-stage-shell-gap: var(--bf-space-2);
}

:where(.bf-theme) :where(.bf-stage-shell.is-loose) {
  --bf-stage-shell-gap: var(--bf-space-4);
}

:where(.bf-theme) :where(.bf-stage-shell > *) {
  margin-bottom: 0;
  min-inline-size: 0;
  padding-block: 0;
}

:where(.bf-theme) :where(.bf-stack) {
  --bf-stack-space: 0px;
  display: grid;
  gap: var(--bf-stack-space);
}

:where(.bf-theme) :where(.bf-stack) > * {
  margin-bottom: 0;
  padding-block: 0;
}

:where(.bf-theme) :where(.bf-stack.is-flush) {
  --bf-stack-space: 0px;
}

:where(.bf-theme) :where(.bf-stack.is-extra-dense) {
  --bf-stack-space: var(--bf-space-half);
}

:where(.bf-theme) :where(.bf-stack.is-dense) {
  --bf-stack-space: var(--bf-space-1);
}

:where(.bf-theme) :where(.bf-stack.is-loose) {
  --bf-stack-space: var(--bf-space-2);
}

:where(.bf-theme) :where(.bf-stack.is-section-shallow) {
  --bf-stack-space: var(--bf-section-space-shallow);
}

:where(.bf-theme) :where(.bf-stack.is-section) {
  --bf-stack-space: var(--bf-section-space);
}

:where(.bf-theme) :where(.bf-stack.is-section-deep) {
  --bf-stack-space: var(--bf-section-space-deep);
}

:where(.bf-theme) :where(.bf-cluster) {
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  gap: var(--bf-space-2);
}

:where(.bf-theme) :where(.bf-cluster) > * {
  margin-bottom: 0;
  padding-block: 0;
}

:where(.bf-theme) :where(.bf-prose) {
  inline-size: min(100%, var(--bf-measure));
}

:where(.bf-theme) :where(.bf-prose > :last-child) {
  margin-bottom: 0;
}

${roleRules}

${capEngineDemo}

${tierOverrideCss}
:where(.bf-theme) :where(.bf-prose ul, .bf-prose ol) {
  margin-bottom: ${semanticMarginBottom(body.spaceAfter, baselineUnit)};
  padding-inline-start: var(--bf-space-4);
}

:where(.bf-theme) :where(.bf-prose li) {
  margin: 0;
  padding-block-end: ${nudgeEnd(baselineUnit, body.nudgeTop)};
  padding-block-start: ${body.nudgeTop};
}

:where(.bf-theme) :where(.bf-prose blockquote) {
  border-inline-start: 1px solid var(--bf-color-rule);
  color: var(--bf-color-muted);
  font-family: ${body.fontStack};
  font-size: ${body.fontSize};
  font-style: ${body.fontStyle ?? "normal"};
  font-weight: ${body.fontWeight ?? 400};
  line-height: ${body.lineHeight};
  margin-bottom: ${semanticMarginBottom(body.spaceAfter, baselineUnit)};
  max-inline-size: calc(var(--bf-measure) + var(--bf-space-4));
  padding-block-end: ${nudgeEnd(baselineUnit, body.nudgeTop)};
  padding-block-start: ${body.nudgeTop};
  padding-inline-start: var(--bf-space-3);
}

:where(.bf-theme) :where(.bf-rule, .bf-prose hr) {
  background: var(--bf-color-rule);
  block-size: 1px;
  border: 0;
  inline-size: 100%;
  margin: 0 0 calc(var(--bf-space-3) - 1px);
}

:where(.bf-theme) :where(.bf-token-row) {
  border-top: 1px solid var(--bf-color-rule);
  display: grid;
  gap: var(--bf-space-1);
  padding-top: var(--bf-space-2);
}

:where(.bf-theme) :where(.bf-token-row:first-child) {
  border-top: 0;
  padding-top: 0;
}

${componentsCss(tokens, options.tierOverrides)}

${gridCss()}${presetCss}
`;
}
