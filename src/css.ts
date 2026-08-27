import { gridCss } from "./css-grid.js";
import { componentsCss } from "./css-components.js";
import { appTierPresetCss } from "./css-app-tier.js";
import { BASELINE_GRID_DARK_THEME_COLOR, BASELINE_GRID_DEFAULT_COLOR, BASELINE_GRID_LIGHT_THEME_COLOR } from "./baseline-grid-theme.js";
import { generateBaselineGridOverlayCss, generateBaselineGridThemeOverrideCss } from "./baseline-grid-overlay.js";
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
  h4: { letterSpacing: "-0.015em" },
  eyebrow: { letterSpacing: "0.08em", textTransform: "uppercase" }
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

function themeSurfaceRule(selector: string, tokens: ThemeTokens): string {
  const body = tokens.roles.body;
  const smallFontFallback = body?.fontSize ?? tokens.roles.h6?.fontSize ?? "1rem";
  return `${selector} {\n  --bf-baseline: ${tokens.baselineUnit};\n  --bf-space-0: 0rem;\n  --bf-space-half: calc(var(--bf-baseline) / 2);\n  --bf-space-1: var(--bf-baseline);\n  --bf-space-2: calc(var(--bf-baseline) * 2);\n  --bf-space-3: calc(var(--bf-baseline) * 3);\n  --bf-space-4: calc(var(--bf-baseline) * 4);\n  --bf-space-6: calc(var(--bf-baseline) * 6);\n  --bf-space-8: calc(var(--bf-baseline) * 8);\n  --bf-space-12: calc(var(--bf-baseline) * 12);\n  --bf-space-16: calc(var(--bf-baseline) * 16);\n  --bf-content-max-width: ${tokens.layout.contentMaxWidth};\n  --bf-content-padding-inline: ${tokens.layout.contentPaddingInline};\n  --bf-measure: ${tokens.layout.measure};\n  --bf-section-space: ${tokens.layout.sectionSpace};\n  --bf-section-space-shallow: ${tokens.layout.sectionSpaceShallow};\n  --bf-section-space-deep: ${tokens.layout.sectionSpaceDeep};\n  --bf-strip-space: ${tokens.layout.stripSpace};\n  --bf-grid-gap-inline: ${tokens.layout.gridGapInline};\n  --bf-grid-gap-block: ${tokens.layout.gridGapBlock};\n  --bf-page-margin: ${tokens.layout.pageMargin};\n${Object.entries(tokens.roles).map(([roleName, token]) => roleVarDeclarations(roleName, token, tokens.baselineUnit)).join("")}  --bf-font-size-small: var(--bf-body-font-size, ${smallFontFallback});\n }\n`;
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
  return `${scopedSelectors.join(",\n")} {\n  padding-block-start: ${capStartNudge};\n  padding-block-end: ${capEndNudge};\n}\n`;
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
  eyebrow: "  color: var(--bf-color-muted);\n",
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
  display: grid;
  gap: var(--bf-stack-space);
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

/* Group consecutive paragraphs without adding semantic container space.
   Each paragraph keeps its metric compensation. */
:where(.bf-theme) :where(.bf-paragraph-stack) {
  display: grid;
  gap: 0;
}

:where(.bf-theme) :where(.bf-cluster) {
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  gap: var(--bf-space-2);
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

${capEngineDemo}

:where(.bf-theme) :where(ul, ol) {
  margin-bottom: 0;
}

:where(.bf-theme) :where(.bf-prose ul, .bf-prose ol) {
  padding-inline-start: var(--bf-space-4);
}

:where(.bf-theme) :where(.bf-prose li) {
  margin: 0 0 ${roleMarginBottomVar("body", baselineCompensation(body.nudgeTop, baselineUnit))};
  padding-block-end: 0rem;
  padding-block-start: ${roleNudgeStartVar("body", body.nudgeTop)};
}

:where(.bf-theme) :where(.bf-prose blockquote) {
  border-inline-start: 1px solid var(--bf-color-rule);
  color: var(--bf-color-muted);
  font-family: ${roleFontFamilyVar("body", body.fontStack)};
  font-size: ${roleFontSizeVar("body", body.fontSize)};
  font-style: ${roleFontStyleVar("body", body.fontStyle ?? "normal")};
  font-weight: ${roleFontWeightVar("body", body.fontWeight ?? 400)};
  line-height: ${roleLineHeightVar("body", body.lineHeight)};
  margin-bottom: ${roleMarginBottomVar("body", baselineCompensation(body.nudgeTop, baselineUnit))};
  max-inline-size: calc(var(--bf-measure) + var(--bf-space-4));
  padding-block-end: 0rem;
  padding-block-start: ${roleNudgeStartVar("body", body.nudgeTop)};
  padding-inline-start: var(--bf-space-3);
}

:where(.bf-theme) :where(.bf-rule, .bf-prose hr) {
  background: var(--bf-color-rule);
  block-size: 1px;
  border: 0;
  inline-size: 100%;
  /* Reserve one half-rem rhythm step after the rule, including its */
  /* thickness, so borderless content does not touch the divider. */
  margin: 0 0 calc(0.5rem - 1px);
}

/* Highlight rules share the same scalable emphasis-bar geometry as active
 * navigation, tabs, notifications, and document-navigation markers. */
:where(.bf-theme) :where(.bf-rule.is-highlighted, .bf-prose hr.is-highlighted) {
  block-size: var(--bf-bar-thickness);
  margin-block-end: calc(0.5rem - var(--bf-bar-thickness));
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

${componentsCss(tokens, themeSurfaces)}

${gridCss()}${presetCss}
`;
}
