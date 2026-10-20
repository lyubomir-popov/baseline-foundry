import type { CanonicalProduct } from "./dtcg-spacing.js";
import type { ThemeTokens } from "./types.js";

export type PrivateIndicatorTypography = {
  fontSize: string;
  lineHeight: string;
};

const approvedIndicatorSizeRem: Record<CanonicalProduct, number> = {
  site: 0.75,
  docs: 0.75,
  app: 0.75,
  os: 0.625
};

function rem(value: number): string {
  return `${Math.round(value * 100000) / 100000}rem`;
}

/** Internal built-in component input; it never enters ThemeConfig or ThemeTokens roles. */
export function privateIndicatorTypography(
  tokens: ThemeTokens,
  product: CanonicalProduct
): PrivateIndicatorTypography {
  if (!tokens.roles.body) {
    throw new Error("Indicator typography requires the generated body role.");
  }

  return {
    fontSize: rem(approvedIndicatorSizeRem[product]),
    lineHeight: "1rem"
  };
}
