export const componentDensityPolicy = {
  version: 1,
  siteDenseChip: {
    product: "editorial",
    provider: ".bf-table td",
    providerBoundaries: ["td", ".bf-theme"],
    subscriber: ".bf-chip",
    role: "spacing.inset.control.block",
    comfortableMember: "--bf-control-block-inset-comfortable",
    denseMember: "--bf-control-block-inset-dense",
    currentMember: "--bf-density-control-block-inset",
    componentBinding: "--bf-chip-control-block-inset"
  }
} as const;

type SiteDenseChipPolicy = typeof componentDensityPolicy.siteDenseChip;

export function siteDenseChipPolicySelectors(policy: SiteDenseChipPolicy = componentDensityPolicy.siteDenseChip): {
  chips: string;
  hosts: string;
} {
  const boundaries = policy.providerBoundaries
    .map(boundary => `:scope ${boundary} ${policy.subscriber}`)
    .join(", ");
  const chips = `${policy.subscriber}:not(.bf-theme):not(${boundaries})`;

  return {
    chips,
    hosts: `:scope:has(${chips})`
  };
}

export function siteDenseChipScopedCss(siteScopes: string[], selector: string, declarations: string): string {
  const policy = componentDensityPolicy.siteDenseChip;
  return providerScopedCss(siteScopes, policy.provider, policy.providerBoundaries, selector, declarations);
}

export function providerScopedCss(productScopes: string[], provider: string, boundaries: readonly string[], selector: string, declarations: string): string {
  return productScopes
    .map(scope => `@scope (${scope}) to (:where(.bf-theme)) {\n  @scope (:where(${provider})) to (:where(${boundaries.join(", ")})) {\n    ${selector} {\n${declarations.split("\n").map(line => `      ${line}`).join("\n")}\n    }\n  }\n}`)
    .join("\n\n");
}
