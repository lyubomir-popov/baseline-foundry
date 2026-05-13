type ThemeTone = "light" | "dark";
type CssVarName = `--${string}`;
type CssVarMap = Record<CssVarName, string>;

const VANILLA_THEME_COLOR_VARS = {
  light: {
    "--vf-color-text-default": "#000000",
    "--vf-color-text-muted": "rgba(0, 0, 0, 0.6)",
    "--vf-color-text-inactive": "rgba(0, 0, 0, 0.75)",
    "--vf-color-link-default": "#0066cc",
    "--vf-color-link-visited": "#7d42b8",
    "--vf-color-focus": "#2e96ff",
    "--vf-color-background-default": "#ffffff",
    "--vf-color-background-alt": "#f7f7f7",
    "--vf-color-background-code": "rgba(0, 0, 0, 0.03)",
    "--vf-color-background-inputs": "#f5f5f5",
    "--vf-color-background-active": "#ebebeb",
    "--vf-color-background-hover": "#f2f2f2",
    "--vf-color-background-overlay": "rgba(17, 17, 17, 0.85)",
    "--vf-color-border-default": "rgba(0, 0, 0, 0.2)",
    "--vf-color-border-high-contrast": "#707070",
    "--vf-color-border-low-contrast": "rgba(0, 0, 0, 0.1)",
    "--vf-color-border-neutral": "#707070",
    "--vf-color-border-positive": "#0e8420",
    "--vf-color-border-caution": "#cc7900",
    "--vf-color-border-negative": "#c7162b",
    "--vf-color-border-information": "#24598f",
    "--vf-color-background-neutral-default": "#f2f2f2",
    "--vf-color-background-neutral-hover": "#e5e5e5",
    "--vf-color-background-neutral-active": "#d9d9d9",
    "--vf-color-background-positive-default": "hsl(129deg 90% 39% / 10%)",
    "--vf-color-background-positive-hover": "hsl(129deg 100% 39% / 15%)",
    "--vf-color-background-positive-active": "hsl(129deg 100% 39% / 18%)",
    "--vf-color-background-caution-default": "hsl(27deg 100% 39% / 10%)",
    "--vf-color-background-caution-hover": "hsl(27deg 100% 39% / 15%)",
    "--vf-color-background-caution-active": "hsl(27deg 100% 39% / 18%)",
    "--vf-color-background-negative-default": "hsl(354deg 100% 39% / 10%)",
    "--vf-color-background-negative-hover": "hsl(354deg 100% 39% / 15%)",
    "--vf-color-background-negative-active": "hsl(354deg 100% 39% / 18%)",
    "--vf-color-background-information-default": "hsl(210deg 100% 39% / 10%)",
    "--vf-color-background-information-hover": "hsl(210deg 100% 39% / 15%)",
    "--vf-color-background-information-active": "hsl(210deg 100% 39% / 18%)",
    "--vf-color-button-positive-default": "#0e8420",
    "--vf-color-button-positive-hover": "#0c6d1a",
    "--vf-color-button-positive-active": "#0a5f17",
    "--vf-color-button-positive-text": "#ffffff",
    "--vf-color-button-negative-default": "#c7162b",
    "--vf-color-button-negative-hover": "#b01326",
    "--vf-color-button-negative-active": "#a21223",
    "--vf-color-button-negative-text": "#ffffff",
    "--vf-color-accent": "#0f95a1"
  },
  dark: {
    "--vf-color-text-default": "#ffffff",
    "--vf-color-text-muted": "rgba(255, 255, 255, 0.6)",
    "--vf-color-text-inactive": "rgba(255, 255, 255, 0.75)",
    "--vf-color-link-default": "#6699cc",
    "--vf-color-link-visited": "#a679d2",
    "--vf-color-focus": "#99ccff",
    "--vf-color-background-default": "#262626",
    "--vf-color-background-alt": "#202020",
    "--vf-color-background-code": "rgba(255, 255, 255, 0.3)",
    "--vf-color-background-inputs": "#2f2f2f",
    "--vf-color-background-active": "#373737",
    "--vf-color-background-hover": "#313131",
    "--vf-color-background-overlay": "rgba(17, 17, 17, 0.85)",
    "--vf-color-border-default": "rgba(255, 255, 255, 0.2)",
    "--vf-color-border-high-contrast": "#939393",
    "--vf-color-border-low-contrast": "rgba(255, 255, 255, 0.1)",
    "--vf-color-border-neutral": "hsl(0deg 0% 65%)",
    "--vf-color-border-positive": "#62a36c",
    "--vf-color-border-caution": "#c48831",
    "--vf-color-border-negative": "#d17b85",
    "--vf-color-border-information": "hsl(210deg 80% 65%)",
    "--vf-color-background-neutral-default": "rgba(255, 255, 255, 0.15)",
    "--vf-color-background-neutral-hover": "rgba(255, 255, 255, 0.2)",
    "--vf-color-background-neutral-active": "rgba(255, 255, 255, 0.25)",
    "--vf-color-background-positive-default": "hsl(129deg 90% 39% / 20%)",
    "--vf-color-background-positive-hover": "hsl(129deg 100% 39% / 30%)",
    "--vf-color-background-positive-active": "hsl(129deg 100% 39% / 36%)",
    "--vf-color-background-caution-default": "hsl(27deg 100% 50% / 20%)",
    "--vf-color-background-caution-hover": "hsl(27deg 100% 60% / 30%)",
    "--vf-color-background-caution-active": "hsl(27deg 100% 50% / 36%)",
    "--vf-color-background-negative-default": "hsl(353deg 100% 70% / 20%)",
    "--vf-color-background-negative-hover": "hsl(353deg 100% 70% / 30%)",
    "--vf-color-background-negative-active": "hsl(353deg 100% 70% / 36%)",
    "--vf-color-background-information-default": "hsl(210deg 100% 50% / 20%)",
    "--vf-color-background-information-hover": "hsl(210deg 100% 50% / 30%)",
    "--vf-color-background-information-active": "hsl(210deg 100% 50% / 36%)",
    "--vf-color-button-positive-default": "#008013",
    "--vf-color-button-positive-hover": "#00670f",
    "--vf-color-button-positive-active": "#00570d",
    "--vf-color-button-positive-text": "#ffffff",
    "--vf-color-button-negative-default": "#a11223",
    "--vf-color-button-negative-hover": "#8a0f1e",
    "--vf-color-button-negative-active": "#7c0e1b",
    "--vf-color-button-negative-text": "#ffffff",
    "--vf-color-accent": "#70bbc2"
  }
} as const satisfies Record<ThemeTone, CssVarMap>;

const FOUNDRY_THEME_ROOT_COLOR_SOURCES = {
  "--bf-color-bg": "--vf-color-background-default",
  "--bf-color-surface": "--vf-color-background-alt",
  "--bf-color-text": "--vf-color-text-default",
  "--bf-color-muted": "--vf-color-text-muted",
  "--bf-color-positive": "--vf-color-border-positive",
  "--bf-color-positive-background": "--vf-color-background-positive-default",
  "--bf-color-negative": "--vf-color-border-negative",
  "--bf-color-negative-background": "--vf-color-background-negative-default",
  "--bf-color-rule": "--vf-color-border-low-contrast",
  "--bf-color-link": "--vf-color-link-default",
  "--bf-color-link-visited": "--vf-color-link-visited",
  "--bf-color-focus": "--vf-color-focus",
  "--bf-color-accent": "--vf-color-accent"
} as const satisfies Record<CssVarName, CssVarName>;

const FOUNDRY_COMPONENT_COLOR_SOURCES = {
  "--bf-color-text-default": "--vf-color-text-default",
  "--bf-color-text-muted": "--vf-color-text-muted",
  "--bf-color-text-inactive": "--vf-color-text-inactive",
  "--bf-color-link-default": "--vf-color-link-default",
  "--bf-color-link-visited": "--vf-color-link-visited",
  "--bf-color-background-default": "--vf-color-background-default",
  "--bf-color-background-alt": "--vf-color-background-alt",
  "--bf-color-background-code": "--vf-color-background-code",
  "--bf-color-background-inputs": "--vf-color-background-inputs",
  "--bf-color-background-hover": "--vf-color-background-hover",
  "--bf-color-background-active": "--vf-color-background-active",
  "--bf-color-background-overlay": "--vf-color-background-overlay",
  "--bf-color-border-default": "--vf-color-border-default",
  "--bf-color-border-high-contrast": "--vf-color-border-high-contrast",
  "--bf-color-border-low-contrast": "--vf-color-border-low-contrast",
  "--bf-color-border-neutral": "--vf-color-border-neutral",
  "--bf-color-border-positive": "--vf-color-border-positive",
  "--bf-color-border-caution": "--vf-color-border-caution",
  "--bf-color-border-negative": "--vf-color-border-negative",
  "--bf-color-border-information": "--vf-color-border-information",
  "--bf-color-background-neutral-default": "--vf-color-background-neutral-default",
  "--bf-color-background-neutral-hover": "--vf-color-background-neutral-hover",
  "--bf-color-background-neutral-active": "--vf-color-background-neutral-active",
  "--bf-color-background-positive-default": "--vf-color-background-positive-default",
  "--bf-color-background-positive-hover": "--vf-color-background-positive-hover",
  "--bf-color-background-positive-active": "--vf-color-background-positive-active",
  "--bf-color-background-caution-default": "--vf-color-background-caution-default",
  "--bf-color-background-caution-hover": "--vf-color-background-caution-hover",
  "--bf-color-background-caution-active": "--vf-color-background-caution-active",
  "--bf-color-background-negative-default": "--vf-color-background-negative-default",
  "--bf-color-background-negative-hover": "--vf-color-background-negative-hover",
  "--bf-color-background-negative-active": "--vf-color-background-negative-active",
  "--bf-color-background-information-default": "--vf-color-background-information-default",
  "--bf-color-background-information-hover": "--vf-color-background-information-hover",
  "--bf-color-background-information-active": "--vf-color-background-information-active",
  "--bf-color-button-positive-default": "--vf-color-button-positive-default",
  "--bf-color-button-positive-hover": "--vf-color-button-positive-hover",
  "--bf-color-button-positive-active": "--vf-color-button-positive-active",
  "--bf-color-button-positive-text": "--vf-color-button-positive-text",
  "--bf-color-button-negative-default": "--vf-color-button-negative-default",
  "--bf-color-button-negative-hover": "--vf-color-button-negative-hover",
  "--bf-color-button-negative-active": "--vf-color-button-negative-active",
  "--bf-color-button-negative-text": "--vf-color-button-negative-text",
  "--bf-color-accent": "--vf-color-accent",
  "--bf-color-focus": "--vf-color-focus"
} as const satisfies Record<CssVarName, CssVarName>;

function cssVarBlock(vars: CssVarMap): string {
  return `${Object.entries(vars)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n")}\n`;
}

function themeVars(tone: ThemeTone): CssVarMap {
  return VANILLA_THEME_COLOR_VARS[tone] as CssVarMap;
}

function themeValue(tone: ThemeTone, source: CssVarName): string {
  return themeVars(tone)[source];
}

function componentAliasFallback(alias: CssVarName, tone: ThemeTone, source: CssVarName): string {
  const fallback = themeValue(tone, source);

  if (alias === "--bf-color-text-default") {
    return `var(--bf-color-text, ${fallback})`;
  }

  if (alias === "--bf-color-text-muted") {
    return `var(--bf-color-muted, ${fallback})`;
  }

  if (alias === "--bf-color-link-default") {
    return `var(--bf-color-link, ${fallback})`;
  }

  if (alias === "--bf-color-background-default") {
    return `var(--bf-color-bg, ${fallback})`;
  }

  if (alias === "--bf-color-background-alt") {
    return `var(--bf-color-surface, ${fallback})`;
  }

  return fallback;
}

function aliasBlock(
  sources: Record<CssVarName, CssVarName>,
  tone: ThemeTone,
  getFallback: (alias: CssVarName, tone: ThemeTone, source: CssVarName) => string = (_alias, currentTone, source) => themeValue(currentTone, source)
): string {
  const vars = {} as CssVarMap;

  for (const [alias, source] of Object.entries(sources) as Array<[CssVarName, CssVarName]>) {
    vars[alias] = `var(${source}, ${getFallback(alias, tone, source)})`;
  }

  return cssVarBlock(vars);
}

export function vanillaThemeColorVars(tone: ThemeTone): string {
  return cssVarBlock(themeVars(tone));
}

export function foundryThemeRootColorVars(tone: ThemeTone): string {
  return aliasBlock(FOUNDRY_THEME_ROOT_COLOR_SOURCES, tone);
}

export function foundryComponentColorVars(tone: ThemeTone): string {
  return aliasBlock(FOUNDRY_COMPONENT_COLOR_SOURCES, tone, componentAliasFallback);
}
