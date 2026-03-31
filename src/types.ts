export interface ThemeFontFile {
  family: string;
  path: string;
  cssFamily?: string;
  fontStyle?: string;
  fontWeight?: string;
  fontDisplay?: string;
  runtimeOnly?: boolean;
}

export interface ThemeElementConfig {
  identifier: string;
  fontSize: number;
  lineHeight: number;
  spaceAfter: number;
  fontFamily?: string;
  fontWeight?: number;
  fontStyle?: string;
  fontVariantCaps?: string;
  letterSpacing?: string;
  textTransform?: string;
}

export interface ThemeLayoutConfig {
  contentMaxWidthRem: number;
  contentPaddingInlineRem: number;
  measureRem: number;
  sectionSpaceBaselineUnits: number;
  sectionSpaceShallowBaselineUnits: number;
  sectionSpaceDeepBaselineUnits: number;
  stripSpaceBaselineUnits: number;
  gridGapInlineBaselineUnits: number;
  gridGapBlockBaselineUnits: number;
  pageMarginBaselineUnits: number;
}

export interface ThemeComponentsConfig {
  borderWidthPx: number;
  radiusRem: number;
  controlInlinePaddingRem: number;
  controlVisualSizeRem: number;
  fieldGapBaselineUnits: number;
  panelPaddingInlineBaselineUnits: number;
  panelPaddingBlockBaselineUnits: number;
  accordionIndentBaselineUnits: number;
  controlMinBlockSizeBaselineUnits: number;
  controlMinBlockSizeDenseBaselineUnits?: number;
}

export interface ThemeConfig {
  baselineUnit: number;
  fontFiles: ThemeFontFile[];
  fontStacks: Record<string, string>;
  elements: ThemeElementConfig[];
  roles: Record<string, string>;
  layout: ThemeLayoutConfig;
  components: ThemeComponentsConfig;
}

export interface BaselineGeneratorElementToken {
  fontSize: string;
  lineHeight: string;
  fontFamily?: string;
  fontWeight?: number;
  fontStyle?: string;
  spaceAfter: string;
  nudgeTop: string;
}

export interface BaselineGeneratorTokens {
  baselineUnit: string;
  fontFiles: ThemeFontFile[];
  elements: Record<string, BaselineGeneratorElementToken>;
}

export interface TypographyToken extends BaselineGeneratorElementToken {
  identifier: string;
  fontStack: string;
  marginBottom: string;
  fontVariantCaps?: string;
  letterSpacing?: string;
  textTransform?: string;
}

export interface LayoutTokens {
  contentMaxWidth: string;
  contentPaddingInline: string;
  measure: string;
  sectionSpace: string;
  sectionSpaceShallow: string;
  sectionSpaceDeep: string;
  stripSpace: string;
  gridGapInline: string;
  gridGapBlock: string;
  pageMargin: string;
}

export interface ComponentTokens {
  borderWidth: string;
  radius: string;
  controlInlinePadding: string;
  controlVisualSize: string;
  fieldGap: string;
  panelPaddingInline: string;
  panelPaddingBlock: string;
  accordionIndent: string;
  controlMinBlockSize: string;
  controlMinBlockSizeDense: string;
}

export interface ThemeTokens {
  baselineUnit: string;
  fontFiles: ThemeFontFile[];
  fontStacks: Record<string, string>;
  roles: Record<string, TypographyToken>;
  elements: Record<string, TypographyToken>;
  layout: LayoutTokens;
  components: ComponentTokens;
}

export interface BuildThemeResult {
  configPath: string;
  baselineConfigPath: string;
  baselineTokensPath: string;
  tokensPath: string;
  cssPath: string;
  tokens: ThemeTokens;
  css: string;
}

export interface DeriveBaselineTokensResult {
  configPath: string;
  baselineConfigPath: string;
  baselineTokensPath: string;
  tokens: BaselineGeneratorTokens;
}

export interface TierOverride {
  className: string;
  roles: Record<string, TypographyToken>;
  baselineUnit?: string;
  tokens?: ThemeTokens;
}
