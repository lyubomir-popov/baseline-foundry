import { gridCss } from "./css-grid.js";
import { componentsCss } from "./css-components.js";
import { appTierPresetCss } from "./css-app-tier.js";
import { BASELINE_GRID_DARK_THEME_COLOR, BASELINE_GRID_DEFAULT_COLOR, BASELINE_GRID_LIGHT_THEME_COLOR } from "./baseline-grid-theme.js";
import { generateBaselineGridOverlayCss, generateBaselineGridThemeOverrideCss } from "./baseline-grid-overlay.js";
import { bfSpacingCompatibilityAliases, dtcgSpacingCssProperty, dtcgSpacingTokenIds, dtcgSpacingValue, type ResolvedDtcgSpacing } from "./dtcg-spacing.js";
import { foundryThemeRootColorVars, vanillaThemeColorVars } from "./vanilla-theme-colors.js";
import type { BuiltInThemeName } from "./presets.js";
import type { ThemeFontFile, ThemeSurface, ThemeTokens, TypographyToken } from "./types.js";

function parseRemValue(rem: string): number {
  return Number.parseFloat(rem.replace("rem", ""));
}

function toRemLiteral(value: number): string {
  return `${Math.round(value * 100000) / 100000}rem`;
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
  if (!fontFile.cssFamily || fontFile.emitFontFace === false) {
    return "";
  }

  return `@font-face {\n  font-family: "${fontFile.cssFamily}";\n  src: url("${fontFile.path}") format("${fontFormat(fontFile.path)}");\n  font-style: ${fontFile.fontStyle ?? "normal"};\n  font-weight: ${fontFile.fontWeight ?? "400"};\n  font-stretch: ${fontFile.fontStretch ?? "normal"};\n  font-display: ${fontFile.fontDisplay ?? "swap"};\n}\n`;
}

function baselineCompensation(nudgeTop: string, baselineUnit: string): string {
  return toRemLiteral(parseRemValue(baselineUnit) - parseRemValue(nudgeTop));
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

function roleLineHeightVar(roleName: string, fallback?: string): string {
  return fallback ? `var(--bf-${roleName}-line-height, ${fallback})` : `var(--bf-${roleName}-line-height)`;
}

function roleFontVariantCapsVar(roleName: string, fallback = "normal"): string {
  return `var(--bf-${roleName}-font-variant-caps, ${fallback})`;
}

function roleLetterSpacingVar(roleName: string, fallback = "normal"): string {
  return `var(--bf-${roleName}-letter-spacing, ${fallback})`;
}

function roleTextTransformVar(roleName: string, fallback = "none"): string {
  return `var(--bf-${roleName}-text-transform, ${fallback})`;
}

function roleMarginBottomVar(roleName: string, fallback: string): string {
  return `var(--bf-${roleName}-margin-bottom, ${fallback})`;
}

function roleNudgeStartVar(roleName: string, fallback: string): string {
  return `var(--bf-${roleName}-nudge-start, ${fallback})`;
}

const ROLE_STYLE_DEFAULTS: Record<string, {
  fontVariantCaps?: string;
  letterSpacing?: string;
  textTransform?: string;
}> = {
  h1: { letterSpacing: "-0.03em" },
  h2: { letterSpacing: "-0.025em" },
  h3: { letterSpacing: "-0.02em" },
  h4: { letterSpacing: "-0.015em" }
};

function textRule(roleName: string, selectors: string[], token: TypographyToken, baselineUnit: string, extra = ""): string {
  const styleDefaults = ROLE_STYLE_DEFAULTS[roleName] ?? {};
  const marginBottom = token.marginBottom ?? baselineCompensation(token.nudgeTop, baselineUnit);
  const nudgeStart = token.nudgeTop;
  return `${selectors.join(",\n")} {\n  font-family: ${roleFontFamilyVar(roleName, token.fontStack)};\n  font-size: ${roleFontSizeVar(roleName, token.fontSize)};\n  font-style: ${roleFontStyleVar(roleName, token.fontStyle ?? "normal")};\n  font-weight: ${roleFontWeightVar(roleName, token.fontWeight ?? 400)};\n  font-variant-caps: ${roleFontVariantCapsVar(roleName, token.fontVariantCaps ?? styleDefaults.fontVariantCaps ?? "normal")};\n  letter-spacing: ${roleLetterSpacingVar(roleName, token.letterSpacing ?? styleDefaults.letterSpacing ?? "normal")};\n  text-transform: ${roleTextTransformVar(roleName, token.textTransform ?? styleDefaults.textTransform ?? "none")};\n  line-height: ${roleLineHeightVar(roleName, token.lineHeight)};\n  margin-bottom: ${roleMarginBottomVar(roleName, marginBottom)};\n  padding-block-end: 0rem;\n  padding-block-start: ${roleNudgeStartVar(roleName, nudgeStart)};\n${extra}}\n`;
}

function roleVarDeclarations(roleName: string, token: TypographyToken, baselineUnit: string): string {
  const styleDefaults = ROLE_STYLE_DEFAULTS[roleName] ?? {};
  const compensation = token.marginBottom ?? baselineCompensation(token.nudgeTop, baselineUnit);
  return `  --bf-${roleName}-font-family: ${token.fontStack};\n  --bf-${roleName}-font-size: ${token.fontSize};\n  --bf-${roleName}-font-style: ${token.fontStyle ?? "normal"};\n  --bf-${roleName}-font-weight: ${token.fontWeight ?? 400};\n  --bf-${roleName}-font-variant-caps: ${token.fontVariantCaps ?? styleDefaults.fontVariantCaps ?? "normal"};\n  --bf-${roleName}-letter-spacing: ${token.letterSpacing ?? styleDefaults.letterSpacing ?? "normal"};\n  --bf-${roleName}-text-transform: ${token.textTransform ?? styleDefaults.textTransform ?? "none"};\n  --bf-${roleName}-line-height: ${token.lineHeight};\n  --bf-${roleName}-space-after: ${token.spaceAfter};\n  --bf-${roleName}-baseline-compensation: ${compensation};\n  --bf-${roleName}-margin-bottom: ${compensation};\n  --bf-${roleName}-nudge-start: ${token.nudgeTop};\n  --bf-${roleName}-nudge-end: ${compensation};\n`;
}

function spacingVarDeclarations(spacing: ResolvedDtcgSpacing): string {
  const canonical = dtcgSpacingTokenIds
    .map(id => `  ${dtcgSpacingCssProperty(id)}: ${dtcgSpacingValue(spacing[id])};`)
    .join("\n");
  const aliases = dtcgSpacingTokenIds
    .map(id => `  ${bfSpacingCompatibilityAliases[id]}: var(${dtcgSpacingCssProperty(id)});`)
    .join("\n");

  return `  /* Resolved Canonical DTCG spacing. */
${canonical}
  /* Temporary BF aliases: one bounded deprecation window, removable only
     after BF 020a and downstream migration adopt the canonical names. */
${aliases}
`;
}

function themeSurfaceRule(selector: string, tokens: ThemeTokens): string {
  const body = tokens.roles.body;
  const smallFontFallback = body?.fontSize ?? tokens.roles.h6?.fontSize ?? "1rem";
  return `${selector} {
${spacingVarDeclarations(tokens.spacing)}  --bf-space-0: 0rem;
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
  --bf-grid-gap-inline: ${tokens.layout.gridGapInline};
  --bf-grid-gap-block: ${tokens.layout.gridGapBlock};
  --bf-page-margin: ${tokens.layout.pageMargin};
${Object.entries(tokens.roles).map(([roleName, token]) => roleVarDeclarations(roleName, token, tokens.baselineUnit)).join("")}  --bf-font-size-small: var(--bf-body-font-size, ${smallFontFallback});
 }
`;
}

function collectFontFiles(tokens: ThemeTokens, themeSurfaces: ThemeSurface[]): ThemeFontFile[] {
  const seen = new Set<string>();
  const fontFiles = [tokens, ...themeSurfaces.map(surface => surface.tokens)]
    .flatMap(surfaceTokens => surfaceTokens.fontFiles)
    .filter(fontFile => Boolean(fontFile.cssFamily));

  return fontFiles.filter(fontFile => {
    const key = [
      fontFile.cssFamily,
      fontFile.path,
      fontFile.fontStyle ?? "normal",
      fontFile.fontWeight ?? "400",
      fontFile.fontStretch ?? "normal",
      fontFile.fontDisplay ?? "swap"
    ].join("|");

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function capEngineDemoRule(selectors: string[], token: TypographyToken): string {
  const capPosition = `calc((${token.lineHeight} + 1cap) / 2)`;
  const capStartNudge = `calc(var(--bf-baseline) - mod(${capPosition}, var(--bf-baseline)))`;
  const capEndNudge = `calc(var(--bf-baseline) - ${capStartNudge})`;
  const scopedSelectors = selectors.map(s => s.replace(":where(.bf-theme)", ":where(.bf-engine-cap)"));
  return `${scopedSelectors.join(",\n")} {\n  margin-block-end: 0;\n  padding-block-start: ${capStartNudge};\n  padding-block-end: ${capEndNudge};\n}\n`;
}

const SEMANTIC_SELECTORS_BY_ROLE: Record<string, string[]> = {
  body: [":where(.bf-theme) :where(p)"],
  h1: [":where(.bf-theme) :where(h1)"],
  h2: [":where(.bf-theme) :where(h2)"],
  h3: [":where(.bf-theme) :where(h3)"],
  h4: [":where(.bf-theme) :where(h4)"],
  h5: [":where(.bf-theme) :where(h5)"],
  h6: [":where(.bf-theme) :where(h6)"],
  meta: [":where(.bf-theme) :where(figcaption)"]
};

const EXTRA_STYLES_BY_ROLE: Record<string, string> = {
  body: "  max-inline-size: var(--bf-measure);\n",
  lead: "  color: var(--bf-color-muted);\n  max-inline-size: calc(var(--bf-measure) + var(--bf-space-4));\n",
  h1: "  max-inline-size: calc(var(--bf-measure) + var(--bf-space-6));\n",
  h2: "  max-inline-size: calc(var(--bf-measure) + var(--bf-space-4));\n",
  meta: "  color: var(--bf-color-muted);\n"
};

function selectorsForRole(roleName: string): string[] {
  const semanticSelectors = SEMANTIC_SELECTORS_BY_ROLE[roleName] ?? [];
  return [...semanticSelectors, `:where(.bf-theme) .bf-${roleName}`];
}

export function generateFoundryCss(tokens: ThemeTokens, options: { presetName?: BuiltInThemeName; themeSurfaces?: ThemeSurface[]; } = {}): string {
  const body = tokens.roles.body;
  const baselineUnit = tokens.baselineUnit;
  const themeSurfaces = options.themeSurfaces ?? [];
  const hasAppDefault = options.presetName === "app" || options.presetName === "app-tier";
  const hasAppClassSurface = themeSurfaces.some(surface => surface.className === "bf-tier-app");
  const includesAppSurface = hasAppDefault || hasAppClassSurface;
  const fontFaces = options.presetName
    ? ""
    : collectFontFiles(tokens, themeSurfaces).map(fontFaceRule).filter(Boolean).join("\n");
  const roleRules = Object.entries(tokens.roles)
    .map(([roleName, token]) => textRule(roleName, selectorsForRole(roleName), token, baselineUnit, EXTRA_STYLES_BY_ROLE[roleName] ?? ""))
    .join("\n");
  const semanticMetricFlushSelectors = Object.keys(tokens.roles).flatMap(roleName => {
    if (roleName === "body") return ["p"];
    if (/^h[1-6]$/.test(roleName)) return [roleName];
    if (roleName === "meta") return ["figcaption"];
    return [];
  });
  const metricFlushTextSelectors = [...new Set([
    "blockquote",
    ...semanticMetricFlushSelectors,
    ...Object.keys(tokens.roles).map(roleName => `.bf-${roleName}`)
  ])].join(", ");

  const capEngineDemo = `/* DEMO ONLY — Cap-derived nudges are unreliable (ascender ≠ cap height).\n   The approximation (line-height + 1cap) / 2 drifts at larger sizes.\n   Kept as a reference for why metrics-derived nudges are used instead. */\n` +
    Object.entries(tokens.roles)
      .map(([roleName, token]) => capEngineDemoRule(selectorsForRole(roleName), token))
      .join("\n");
  const scopedThemeCss = themeSurfaces
    .filter(surface => surface.className)
    .map(surface => themeSurfaceRule(`:where(.bf-theme.${surface.className})`, surface.tokens))
    .join("\n");

  const appScopes = [
    ...(hasAppDefault ? [":where(.bf-theme)"] : []),
    ...(hasAppClassSurface ? [":where(.bf-theme.bf-tier-app)"] : [])
  ];
  const presetCss = includesAppSurface ? `\n${appTierPresetCss(appScopes)}` : "";

  if (!body) {
    throw new Error("Theme tokens require a body role.");
  }

  return `${fontFaces}${fontFaces ? "\n" : ""}${generateBaselineGridOverlayCss({ baselineUnit: tokens.baselineUnit })}

${themeSurfaceRule(":where(.bf-theme)", tokens)}
${scopedThemeCss}

:where(.bf-theme) {
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

${generateBaselineGridThemeOverrideCss()}

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
  text-decoration: none;
  text-decoration-thickness: 0.0625rem;
  text-underline-offset: 0.12em;
}

:where(.bf-theme) :where(a:is(:hover, :active)) {
  text-decoration: underline;
}

:where(.bf-theme) :where(a:visited) {
  color: var(--bf-color-link-visited);
}

:where(.bf-theme) :where(a:focus-visible) {
  outline: 0.125rem solid var(--bf-color-focus);
  outline-offset: 0.125rem;
}

/* Standalone anchors need the same metric-owned text box as adjacent body
 * controls. Raw anchors remain inline so prose links still participate in the
 * surrounding line box. */
:where(.bf-theme) :where(a.bf-text-link) {
  display: inline-block;
  font-family: var(--bf-body-font-family);
  font-size: var(--bf-body-font-size);
  font-style: var(--bf-body-font-style);
  font-weight: var(--bf-body-font-weight);
  line-height: var(--bf-body-line-height);
  margin-block: 0 var(--bf-body-margin-bottom);
  padding-block: var(--bf-body-nudge-start) 0;
}

:where(.bf-theme) :where(code) {
  font-family: "Ubuntu Sans Mono", ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 0.95em;
}

:where(.bf-theme) :where(.bf-page) {
  margin-inline: auto;
  max-inline-size: var(--bf-content-max-width);
  padding-inline: var(--bf-page-margin);
}

:where(.bf-theme) :where(.bf-page.is-fill) {
  min-block-size: 100vh;
  padding-block-end: var(--bf-section-space);
}

:where(.bf-theme) :where(.bf-section) {
  margin-block-end: 0;
}

:where(.bf-theme) :where(.bf-section.is-shallow) {
  margin-block-end: 0;
}

:where(.bf-theme) :where(.bf-section.is-deep) {
  margin-block-end: 0;
}

:where(.bf-theme) :where(.bf-strip) {
  padding-block-end: var(--bf-strip-space);
}

:where(.bf-theme) :where(.bf-fixed-width, .bf-measure) {
  inline-size: min(100%, var(--bf-measure));
}

:where(.bf-theme) :where(.bf-inline-size) {
  --bf-inline-size: 18rem;
  flex: 0 1 var(--bf-inline-size);
  inline-size: min(100%, var(--bf-inline-size));
  min-inline-size: min(100%, var(--bf-inline-size));
}

:where(.bf-theme) :where(.bf-inline-size.is-compact) {
  --bf-inline-size: 12rem;
}

:where(.bf-theme) :where(.bf-inline-size.is-regular) {
  --bf-inline-size: 18rem;
}

:where(.bf-theme) :where(.bf-inline-size.is-medium) {
  --bf-inline-size: 20rem;
}

:where(.bf-theme) :where(.bf-inline-size.is-wide) {
  --bf-inline-size: 24rem;
}

:where(.bf-theme) :where(.bf-inline-size.is-x-wide) {
  --bf-inline-size: 28rem;
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

:where(.bf-theme) :where(.bf-stack) {
  --bf-stack-space: var(--bf-section-space-shallow);
  align-content: start;
  display: grid;
  gap: var(--bf-stack-space);
}

:where(.bf-theme) :where(.bf-stack.is-flush) {
  --bf-stack-space: 0rem;
}

/* A metric-flush stack is an explicit relationship between adjacent text
 * roles. It retains the outer role nudges while cancelling only the preceding
 * end compensation and following start nudge; no guessed negative gap is used. */
:where(.bf-theme) :where(.bf-stack.is-metric-flush) {
  --bf-stack-space: 0rem;
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
  --bf-cluster-space: var(--bf-space-2);
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  gap: var(--bf-cluster-space);
}

:where(.bf-theme) :where(.bf-cluster.is-dense) {
  --bf-cluster-space: var(--bf-space-1);
}

:where(.bf-theme) :where(.bf-cluster.is-nowrap) {
  flex-wrap: nowrap;
}

:where(.bf-theme) :where(.bf-cluster.is-split) {
  justify-content: space-between;
}

:where(.bf-theme) :where(.bf-prose) {
  display: grid;
  gap: var(--bf-section-space-shallow);
  inline-size: min(100%, var(--bf-measure));
}

${roleRules}

:where(.bf-theme) .bf-stack.is-metric-flush > :where(${metricFlushTextSelectors}):has(+ :where(${metricFlushTextSelectors})) {
  margin-block-end: 0;
}

:where(.bf-theme) .bf-stack.is-metric-flush > :where(${metricFlushTextSelectors}) + :where(${metricFlushTextSelectors}) {
  padding-block-start: 0;
}

${capEngineDemo}

:where(.bf-theme) :where(ul, ol) {
  margin-bottom: 0;
  padding-block-end: 0;
}

:where(.bf-theme) :where(.bf-prose ol) {
  padding-inline-start: calc(var(--bf-leading-mark-group-inset) + var(--bf-leading-mark-offset) - (var(--bf-leading-mark-size) * 0.5));
}

:where(.bf-theme) :where(.bf-prose ol > li) {
  padding-inline-start: calc(var(--bf-leading-mark-size) * 0.5);
}

:where(.bf-theme) :where(.bf-prose ul) {
  list-style: none;
  padding-inline-start: var(--bf-leading-mark-group-inset);
}

:where(.bf-theme) :where(.bf-prose ul > li) {
  padding-inline-start: var(--bf-leading-mark-offset);
  position: relative;
}

:where(.bf-theme) :where(.bf-prose ul > li)::before {
  background: currentColor;
  block-size: var(--bf-list-marker-dot-size);
  border-radius: 50%;
  content: "";
  inline-size: var(--bf-list-marker-dot-size);
  inset-block-start: calc(var(--bf-tick-box-offset) + ((var(--bf-leading-mark-size) - var(--bf-list-marker-dot-size)) * 0.5));
  inset-inline-start: calc((var(--bf-leading-mark-size) - var(--bf-list-marker-dot-size)) * 0.5);
  position: absolute;
}

:where(.bf-theme) :where(.bf-prose li) {
  margin: 0 0 ${roleMarginBottomVar("body", baselineCompensation(body.nudgeTop, baselineUnit))};
  padding-block-end: 0rem;
  padding-block-start: ${roleNudgeStartVar("body", body.nudgeTop)};
}

:where(.bf-theme) :where(.bf-prose blockquote) {
  color: var(--bf-color-text-default);
  font-family: ${roleFontFamilyVar("body", body.fontStack)};
  font-size: ${roleFontSizeVar("body", body.fontSize)};
  font-style: ${roleFontStyleVar("body", body.fontStyle ?? "normal")};
  font-weight: ${roleFontWeightVar("body", body.fontWeight ?? 400)};
  line-height: ${roleLineHeightVar("body", body.lineHeight)};
  margin-bottom: ${roleMarginBottomVar("body", baselineCompensation(body.nudgeTop, baselineUnit))};
  max-inline-size: var(--bf-measure);
  padding-block-end: 0rem;
  padding-block-start: ${roleNudgeStartVar("body", body.nudgeTop)};
}

:where(.bf-theme) :where(hr) {
  background: var(--bf-color-rule);
  block-size: 0.0625rem;
  border: 0;
  inline-size: 100%;
  /* Reserve one half-rem rhythm step after the rule, including its */
  /* thickness, so borderless content does not touch the divider. */
  margin: 0 0 calc(0.5rem - 0.0625rem);
}

/* Highlight rules share the same scalable emphasis-bar geometry as active
 * navigation, tabs, notifications, and document-navigation markers. */
:where(.bf-theme) :where(hr.is-highlighted) {
  block-size: var(--bf-bar-thickness);
  margin-block-end: calc(0.5rem - var(--bf-bar-thickness));
}

:where(.bf-theme) :where(.bf-token-row) {
  border-top: 0.0625rem solid var(--bf-color-rule);
  display: grid;
  gap: var(--bf-space-1);
  padding-top: var(--bf-space-2);
}

:where(.bf-theme) :where(.bf-token-row:first-child) {
  border-top: 0;
  padding-top: 0;
}

${componentsCss(tokens, themeSurfaces)}

${gridCss(appScopes)}${presetCss}
`;
}
