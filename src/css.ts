import { gridCss } from "./css-grid.js";
import { compatCss } from "./css-compat.js";
import type { ThemeFontFile, ThemeTokens, TypographyToken } from "./types.js";

function spacingVars(token: TypographyToken): string {
  return `  --bf-space-after-comp: calc(var(--bf-baseline) - ${token.nudgeTop});\n  --bf-space-after-sem: calc(${token.marginBottom} - var(--bf-space-after-comp));\n`;
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

function textRule(selectors: string[], token: TypographyToken, extra = ""): string {
  const fontVariantCaps = token.fontVariantCaps ? `  font-variant-caps: ${token.fontVariantCaps};\n` : "";
  const letterSpacing = token.letterSpacing ? `  letter-spacing: ${token.letterSpacing};\n` : "";
  const textTransform = token.textTransform ? `  text-transform: ${token.textTransform};\n` : "";
  return `${selectors.join(",\n")} {\n${spacingVars(token)}  font-family: ${token.fontStack};\n  font-size: ${token.fontSize};\n  font-style: ${token.fontStyle ?? "normal"};\n  font-weight: ${token.fontWeight ?? 400};\n${fontVariantCaps}${letterSpacing}${textTransform}  line-height: ${token.lineHeight};\n  margin: 0 0 calc(var(--bf-space-after-sem) + var(--bf-space-after-comp));\n  padding-top: ${token.nudgeTop};\n${extra}}\n`;
}

const SEMANTIC_SELECTORS_BY_ROLE: Record<string, string[]> = {
  body: [":where(.bf-theme, .vr-theme) .bf-prose p"],
  h1: [":where(.bf-theme, .vr-theme) .bf-prose h1"],
  h2: [":where(.bf-theme, .vr-theme) .bf-prose h2"],
  h3: [":where(.bf-theme, .vr-theme) .bf-prose h3"],
  h4: [":where(.bf-theme, .vr-theme) .bf-prose h4"],
  h5: [":where(.bf-theme, .vr-theme) .bf-prose h5"],
  h6: [":where(.bf-theme, .vr-theme) .bf-prose h6"],
  meta: [":where(.bf-theme, .vr-theme) .bf-prose figcaption"]
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
  return [...semanticSelectors, `:where(.bf-theme, .vr-theme) .bf-${roleName}`];
}

export function generateFoundryCss(tokens: ThemeTokens): string {
  const body = tokens.roles.body;
  const fontFaces = tokens.fontFiles.map(fontFaceRule).filter(Boolean).join("\n");
  const roleRules = Object.entries(tokens.roles)
    .map(([roleName, token]) => textRule(selectorsForRole(roleName), token, EXTRA_STYLES_BY_ROLE[roleName] ?? ""))
    .join("\n");

  if (!body) {
    throw new Error("Theme tokens require a body role.");
  }

  return `${fontFaces}${fontFaces ? "\n" : ""}.u-baseline-grid {
  --bf-baseline-grid-color: rgba(15, 23, 42, 0.12);
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

:where(.bf-theme, .vr-theme) {
  --bf-baseline: ${tokens.baselineUnit};
  --bf-space-0: 0rem;
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
  --bf-section-space-deep: ${tokens.layout.sectionSpaceDeep};
  --bf-strip-space: ${tokens.layout.stripSpace};
  --bf-grid-gap-inline: ${tokens.layout.gridGapInline};
  --bf-grid-gap-block: ${tokens.layout.gridGapBlock};
  --bf-page-margin: ${tokens.layout.pageMargin};
  --bf-color-bg: var(--vf-color-background-default, #f5f1e8);
  --bf-color-surface: var(--vf-color-background-alt, rgba(255, 255, 255, 0.72));
  --bf-color-text: var(--vf-color-text-default, #14161c);
  --bf-color-muted: var(--vf-color-text-muted, #565c69);
  --bf-color-rule: var(--vf-color-border-default, rgba(20, 22, 28, 0.14));
  --bf-color-accent: var(--vf-color-link-default, #0f62fe);
  background: var(--bf-color-bg);
  color: var(--bf-color-text);
  font-family: ${body.fontStack};
  font-size: ${body.fontSize};
  font-style: ${body.fontStyle ?? "normal"};
  font-weight: ${body.fontWeight ?? 400};
  line-height: ${body.lineHeight};
}

:where(.bf-theme[data-bf-tone='dark'], .vr-theme[data-bf-tone='dark'], .vr-theme.is-dark) {
  --bf-color-bg: var(--vf-color-background-default, #171717);
  --bf-color-surface: var(--vf-color-background-alt, rgba(32, 32, 32, 0.96));
  --bf-color-text: var(--vf-color-text-default, #ffffff);
  --bf-color-muted: var(--vf-color-text-muted, rgba(255, 255, 255, 0.72));
  --bf-color-rule: var(--vf-color-border-default, rgba(255, 255, 255, 0.14));
  --bf-color-accent: var(--vf-color-link-default, #99ccff);
  color-scheme: dark;
}

:where(.bf-theme[data-bf-tone='light'], .vr-theme[data-bf-tone='light'], .vr-theme.vr-theme--light) {
  color-scheme: light;
}

:where(.bf-theme, .vr-theme),
:where(.bf-theme, .vr-theme) * {
  box-sizing: border-box;
}

:where(.bf-theme, .vr-theme) :where(img, picture, svg, video) {
  display: block;
  max-inline-size: 100%;
}

:where(.bf-theme, .vr-theme) :where(a) {
  color: var(--bf-color-accent);
  text-decoration-thickness: 1px;
  text-underline-offset: 0.12em;
}

:where(.bf-theme, .vr-theme) :where(code) {
  font-family: "IBM Plex Mono", ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 0.95em;
}

:where(.bf-theme, .vr-theme) :where(.bf-page) {
  margin-inline: auto;
  max-inline-size: var(--bf-content-max-width);
  padding-inline: max(var(--bf-page-margin), var(--bf-content-padding-inline));
}

:where(.bf-theme, .vr-theme) :where(.bf-section) {
  margin-block-end: var(--bf-section-space);
}

:where(.bf-theme, .vr-theme) :where(.bf-section.is-deep) {
  margin-block-end: var(--bf-section-space-deep);
}

:where(.bf-theme, .vr-theme) :where(.bf-strip) {
  padding-block-end: var(--bf-strip-space);
}

:where(.bf-theme, .vr-theme) :where(.bf-fixed-width, .bf-measure) {
  inline-size: min(100%, var(--bf-measure));
}

:where(.bf-theme, .vr-theme) :where(.bf-stack) {
  --bf-stack-space: var(--bf-space-3);
  display: grid;
  gap: var(--bf-stack-space);
}

:where(.bf-theme, .vr-theme) :where(.bf-stack[data-space='tight']) {
  --bf-stack-space: var(--bf-space-2);
}

:where(.bf-theme, .vr-theme) :where(.bf-stack[data-space='loose']) {
  --bf-stack-space: var(--bf-space-4);
}

:where(.bf-theme, .vr-theme) :where(.bf-cluster) {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: var(--bf-space-2);
}

:where(.bf-theme, .vr-theme) :where(.bf-prose) {
  inline-size: min(100%, var(--bf-measure));
}

:where(.bf-theme, .vr-theme) :where(.bf-prose > :last-child) {
  margin-bottom: var(--bf-space-after-comp, 0rem);
}

${roleRules}

:where(.bf-theme, .vr-theme) :where(.bf-prose ul, .bf-prose ol) {
  ${spacingVars(body).trim()}
  margin: 0 0 var(--bf-space-after-sem);
  padding-inline-start: var(--bf-space-4);
}

:where(.bf-theme, .vr-theme) :where(.bf-prose li) {
  margin: 0;
  padding-block-end: var(--bf-space-after-comp);
  padding-top: ${body.nudgeTop};
}

:where(.bf-theme, .vr-theme) :where(.bf-prose blockquote) {
  ${spacingVars(body).trim()}
  border-inline-start: 1px solid var(--bf-color-rule);
  color: var(--bf-color-muted);
  font-family: ${body.fontStack};
  font-size: ${body.fontSize};
  font-style: ${body.fontStyle ?? "normal"};
  font-weight: ${body.fontWeight ?? 400};
  line-height: ${body.lineHeight};
  margin: 0 0 calc(var(--bf-space-after-sem) + var(--bf-space-after-comp));
  max-inline-size: calc(var(--bf-measure) + var(--bf-space-4));
  padding-inline-start: var(--bf-space-3);
  padding-top: ${body.nudgeTop};
}

:where(.bf-theme, .vr-theme) :where(.bf-rule, .bf-prose hr) {
  background: var(--bf-color-rule);
  block-size: 1px;
  border: 0;
  inline-size: 100%;
  margin: 0 0 calc(var(--bf-space-3) - 1px);
}

:where(.bf-theme, .vr-theme) :where(.bf-token-row) {
  border-top: 1px solid var(--bf-color-rule);
  display: grid;
  gap: var(--bf-space-1);
  padding-top: var(--bf-space-2);
}

:where(.bf-theme, .vr-theme) :where(.bf-token-row:first-child) {
  border-top: 0;
  padding-top: 0;
}

${compatCss(tokens)}

${gridCss()}
`;
}
