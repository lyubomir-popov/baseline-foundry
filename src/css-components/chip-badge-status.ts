import { boundedProviderSubscriberSelector, componentDensityPolicy, providerScopedCss, tableCellDensityPolicySelectors, tableCellDensityScopedCss } from "../component-density-policy.js";
import { allSidedStrokeSelfPaintCss } from "./stroke-paint.js";

type ChipBadgeStatusCssOptions = {
  bodyCaseTypeStyles: string;
  bodyTypeStyles: string;
  indicatorLineHeight: string;
  indicatorTypeStyles: string;
  tableDensityScopes: string[];
};

export function chipBadgeStatusCss(options: ChipBadgeStatusCssOptions): string {
  const {
    bodyCaseTypeStyles,
    bodyTypeStyles,
    indicatorLineHeight,
    indicatorTypeStyles,
    tableDensityScopes,
  } = options;
  const density = componentDensityPolicy.tableCell;
  const chipSelector = ":where(.bf-theme) :where(.bf-chip, .bf-chip.is-positive, .bf-chip.is-caution, .bf-chip.is-negative, .bf-chip.is-information)";
  const chipStrokeCss = allSidedStrokeSelfPaintCss(chipSelector, { color: "var(--bf-ui-chip-border)" });
  const denseTableChips = tableCellDensityPolicySelectors().chips;
  const denseTableChipCss = denseTableChips
    ? `\n/* Chip enrollment follows the versioned nearest-provider policy through any\n   neutral descendant path. The legacy class does not opt instances in/out. */\n${tableCellDensityScopedCss(tableDensityScopes, denseTableChips, `${density.componentBindings.chip}: var(${density.currentMember}, var(--bf-control-block-inset));\nborder: 0;\n--bf-stroke-color: var(--bf-ui-chip-border);\nline-height: var(--bf-body-line-height);\nmargin-block: 0;\nmin-inline-size: min(100%, calc(var(--bf-body-line-height) + (var(${density.componentBindings.chip}) * 2)));\npadding-block: var(${density.componentBindings.chip});\npadding-inline: var(--bf-ui-chip-padding-inline);`)}\n\n${tableCellDensityScopedCss(tableDensityScopes, `${denseTableChips} :where(.bf-chip-lead, .bf-chip-value)`, "line-height: inherit;")}\n\n${tableCellDensityScopedCss(tableDensityScopes, `${denseTableChips}:hover`, "--bf-stroke-color: var(--bf-ui-chip-border-hover);")}\n\n${tableCellDensityScopedCss(tableDensityScopes, `${denseTableChips}:is(:active, [aria-pressed='true'], .is-selected)`, "--bf-stroke-color: var(--bf-ui-chip-border-active);")}\n`
    : "";
  const staticNavigationChipPolicy = componentDensityPolicy.staticNavigationChip;
  const staticNavigationChipCss = Object.values(staticNavigationChipPolicy.placements).map(placement => {
    const chip = boundedProviderSubscriberSelector(placement.subscriber, placement);
    const scoped = (selector: string, declarations: string) => providerScopedCss(
      tableDensityScopes,
      placement.provider,
      placement.providerBoundaries,
      selector,
      declarations
    );
    const hostChip = boundedProviderSubscriberSelector(placement.hostSubscriber, placement);
    const visibleHost = placement.provider.includes(".bf-side-navigation") ? ":not(.bf-navigation.is-collapsed *)" : "";
    const hostHasStaticChip = `:scope${visibleHost}:has(${hostChip}):not(:has(${hostChip} .bf-chip-dismiss))`;
    const transferredInset = "max(0rem, calc(var(--bf-interface-row-padding-block) - var(--bf-control-block-inset-dense)))";
    const hostPadding = `padding-block: ${transferredInset};`;
    const hostAlignment = scoped(hostHasStaticChip, `align-items: baseline;\n${hostPadding}`);
    const trailingSlotAlignment = placement.provider.includes(".bf-side-navigation")
      ? scoped(`${hostHasStaticChip} :where(.bf-side-navigation-status)`, "align-items: baseline;\nalign-self: baseline;")
      : "";
    return `${hostAlignment}
${trailingSlotAlignment ? `\n\n${trailingSlotAlignment}` : ""}

${scoped(chip, `${staticNavigationChipPolicy.componentBinding}: var(${staticNavigationChipPolicy.denseMember});
border: 0;
--bf-stroke-color: var(--bf-ui-chip-border);
line-height: var(--bf-body-line-height);
margin-block: 0;
min-inline-size: min(100%, calc(var(--bf-body-line-height) + (var(${staticNavigationChipPolicy.componentBinding}) * 2)));
padding-block: var(${staticNavigationChipPolicy.componentBinding});
padding-inline: var(--bf-ui-chip-padding-inline);`)}

${scoped(`${chip} :where(.bf-chip-lead, .bf-chip-value)`, "line-height: inherit;")}

${scoped(`${chip}:hover`, "--bf-stroke-color: var(--bf-ui-chip-border-hover);")}

${scoped(`${chip}:is(:active, [aria-pressed='true'], .is-selected)`, "--bf-stroke-color: var(--bf-ui-chip-border-active);")}`;
  }).join("\n\n");
  const legacyNestedChipCss = (suffix: string, declarations: string) => [
    { provider: ".bf-table td", boundary: "td" }
  ].map(host => providerScopedCss(
    [":where(.bf-theme)"],
    host.provider,
    [host.boundary, ".bf-theme"],
    `:where(.bf-chip.is-nested:not(.bf-theme):not(:scope ${host.boundary} .bf-chip, :scope .bf-theme .bf-chip))${suffix}`,
    declarations
  )).join("\n\n");
  const legacyNestedChipRules = `\n${legacyNestedChipCss("", "--bf-chip-control-block-inset: var(--bf-nested-row-padding-block);\nline-height: var(--bf-nested-row-line-height);\nmargin-block: 0;\npadding-block: var(--bf-chip-control-block-inset);\nborder: 0;\n--bf-stroke-color: var(--bf-ui-chip-border);\nmin-inline-size: min(100%, calc(var(--bf-nested-row-painted-block-size) + var(--bf-inline-unit)));\npadding-inline: var(--bf-ui-chip-padding-inline);")}\n\n${legacyNestedChipCss(" :where(.bf-chip-lead, .bf-chip-value)", "line-height: inherit;")}\n\n${legacyNestedChipCss(":hover", "--bf-stroke-color: var(--bf-ui-chip-border-hover);")}\n\n${legacyNestedChipCss(":is(:active, [aria-pressed='true'], .is-selected)", "--bf-stroke-color: var(--bf-ui-chip-border-active);")}\n`;

  return `${chipStrokeCss}

:where(.bf-theme) {
  --bf-ui-chip-padding-inline: var(--bf-component-inline-inset-action);
  --bf-ui-chip-radius: 999rem;
  --bf-ui-badge-padding-inline: 0.0625rem;
}

:where(.bf-theme) :where(.bf-chip, .bf-chip.is-positive, .bf-chip.is-caution, .bf-chip.is-negative, .bf-chip.is-information) {
  --bf-ui-chip-border: var(--bf-color-border-neutral);
  --bf-ui-chip-border-hover: var(--bf-color-border-neutral);
  --bf-ui-chip-border-active: var(--bf-color-border-neutral);
  --bf-ui-chip-background: var(--bf-color-background-neutral-default);
  --bf-ui-chip-background-hover: var(--bf-color-background-neutral-hover);
  --bf-ui-chip-background-active: var(--bf-color-background-neutral-active);
${bodyTypeStyles}  align-items: baseline;
  --bf-chip-control-block-inset: var(--bf-interface-row-padding-block);
  background-color: var(--bf-ui-chip-background);
  border: 0;
  border-radius: var(--bf-ui-chip-radius);
  color: var(--bf-color-text-default);
  display: inline-flex;
  gap: 0;
  inline-size: fit-content;
  justify-content: center;
  justify-self: start;
  margin: 0 0 var(--bf-interface-row-compensation-block-end);
  max-inline-size: 100%;
  min-inline-size: min(100%, calc(var(--bf-interface-row-painted-block-size) + var(--bf-inline-unit)));
  padding-block: var(--bf-interface-row-padding-block);
  /* Chips use the Action text keyline. The paint-derived floor only governs
     very short dense labels, keeping them stadium-shaped rather than circular. */
  padding-inline: var(--bf-ui-chip-padding-inline);
  position: relative;
  text-decoration: none;
  user-select: none;
  /* Inline-flex exposes the first text child's baseline. The surrounding
     border-aware row contract now matches buttons instead of inventing a
     second chip-only occupied height. */
  vertical-align: baseline;
  white-space: nowrap;
}

:where(.bf-theme) :where(.bf-chip, .bf-chip.is-positive, .bf-chip.is-caution, .bf-chip.is-negative, .bf-chip.is-information):has(> :where(.bf-badge, .bf-badge.is-negative)) {
  column-gap: var(--bf-component-inline-inset-field);
}

:where(.bf-theme) :where(.bf-chip.is-positive) {
  --bf-ui-chip-border: var(--bf-color-border-positive);
  --bf-ui-chip-border-hover: var(--bf-color-border-positive);
  --bf-ui-chip-border-active: var(--bf-color-border-positive);
  --bf-ui-chip-background: var(--bf-color-background-positive-default);
  --bf-ui-chip-background-hover: var(--bf-color-background-positive-hover);
  --bf-ui-chip-background-active: var(--bf-color-background-positive-active);
}

:where(.bf-theme) :where(.bf-chip.is-caution) {
  --bf-ui-chip-border: var(--bf-color-border-caution);
  --bf-ui-chip-border-hover: var(--bf-color-border-caution);
  --bf-ui-chip-border-active: var(--bf-color-border-caution);
  --bf-ui-chip-background: var(--bf-color-background-caution-default);
  --bf-ui-chip-background-hover: var(--bf-color-background-caution-hover);
  --bf-ui-chip-background-active: var(--bf-color-background-caution-active);
}

:where(.bf-theme) :where(.bf-chip.is-negative) {
  --bf-ui-chip-border: var(--bf-color-border-negative);
  --bf-ui-chip-border-hover: var(--bf-color-border-negative);
  --bf-ui-chip-border-active: var(--bf-color-border-negative);
  --bf-ui-chip-background: var(--bf-color-background-negative-default);
  --bf-ui-chip-background-hover: var(--bf-color-background-negative-hover);
  --bf-ui-chip-background-active: var(--bf-color-background-negative-active);
}

:where(.bf-theme) :where(.bf-chip.is-information) {
  --bf-ui-chip-border: var(--bf-color-border-information);
  --bf-ui-chip-border-hover: var(--bf-color-border-information);
  --bf-ui-chip-border-active: var(--bf-color-border-information);
  --bf-ui-chip-background: var(--bf-color-background-information-default);
  --bf-ui-chip-background-hover: var(--bf-color-background-information-hover);
  --bf-ui-chip-background-active: var(--bf-color-background-information-active);
}

:where(.bf-theme) :where(.bf-chip.is-borderless) {
  --bf-ui-chip-border: transparent;
  --bf-ui-chip-border-hover: transparent;
  --bf-ui-chip-border-active: transparent;
  --bf-ui-chip-background: transparent;
  --bf-ui-chip-background-hover: transparent;
  --bf-ui-chip-background-active: transparent;
}

:where(.bf-theme) :where(.bf-chip, .bf-chip.is-positive, .bf-chip.is-caution, .bf-chip.is-negative, .bf-chip.is-information):hover {
  --bf-stroke-color: var(--bf-ui-chip-border-hover);
  background-color: var(--bf-ui-chip-background-hover);
  text-decoration: none;
}

:where(.bf-theme) :where(.bf-chip, .bf-chip.is-positive, .bf-chip.is-caution, .bf-chip.is-negative, .bf-chip.is-information):is(:active, [aria-pressed='true'], .is-selected) {
  --bf-overlay-selection-block-end-width: var(--bf-bar-thickness);
  --bf-overlay-selection-layer: inset 0 calc(var(--bf-bar-thickness) * -1) 0 var(--bf-ui-chip-border-active);
  --bf-stroke-color: var(--bf-ui-chip-border-active);
  background-color: var(--bf-ui-chip-background-active);
}

:where(.bf-theme) :where(.bf-chip, .bf-chip.is-positive, .bf-chip.is-caution, .bf-chip.is-negative, .bf-chip.is-information):focus:not(:focus-visible) {
  --bf-overlay-focus-layer: 0 0 0 0 transparent;
  outline: none;
}

:where(.bf-theme) :where(.bf-chip, .bf-chip.is-positive, .bf-chip.is-caution, .bf-chip.is-negative, .bf-chip.is-information):focus-visible {
  --bf-overlay-focus-layer: inset 0 0 0 0.125rem var(--bf-color-focus);
  outline: none;
}

@media (forced-colors: active) {
  :where(.bf-theme) :where(.bf-chip, .bf-chip.is-positive, .bf-chip.is-caution, .bf-chip.is-negative, .bf-chip.is-information):focus-visible {
    outline: 0.125rem solid Highlight;
    outline-offset: -0.1875rem;
  }

}

:where(.bf-theme) :where(.bf-chip-lead, .bf-chip-value) {
${bodyTypeStyles}  color: var(--bf-color-text-default);
  display: inline;
  margin: 0;
  min-inline-size: 0;
  overflow: hidden;
  padding: 0;
  text-overflow: ellipsis;
  vertical-align: baseline;
}

:where(.bf-theme) :where(.bf-chip-lead) {
${bodyCaseTypeStyles}  color: var(--bf-color-text-muted);
}

:where(.bf-theme) :where(.bf-chip-lead + .bf-chip-value)::before {
${bodyTypeStyles}  color: var(--bf-color-text-muted);
  color: var(--bf-color-text-muted);
  content: ": ";
}

:where(.bf-theme) :where(.bf-badge, .bf-badge.is-negative) {
${indicatorTypeStyles}  --bf-square-block-size: ${indicatorLineHeight};
  --bf-ui-badge-background: var(--bf-color-text-default);
  background-color: transparent;
  background-image:
    radial-gradient(circle closest-side, var(--bf-ui-badge-background) 100%, transparent 0),
    radial-gradient(circle closest-side, var(--bf-ui-badge-background) 100%, transparent 0),
    linear-gradient(var(--bf-ui-badge-background), var(--bf-ui-badge-background));
  background-position: left center, right center, center center;
  background-repeat: no-repeat;
  background-size: 1em 1em, 1em 1em, calc(100% - 1em) 1em;
  border-radius: 1rem;
  color: var(--bf-color-background-default);
  display: inline-block;
  inline-size: fit-content;
  justify-self: start;
  /* Native baseline alignment is retained. Removing the symmetric half-leading
     from flex sizing prevents a smaller type size on the shared 1rem line from
     increasing the host's ascent/descent envelope at any root font size. */
  margin-block: calc((1em - 1lh) / 2);
  margin-inline: 0;
  min-inline-size: var(--bf-square-block-size);
  padding-block: 0;
  padding-inline: var(--bf-ui-badge-padding-inline);
  text-align: center;
  text-indent: 0;
  vertical-align: baseline;
  white-space: nowrap;
}

:where(.bf-theme) :where(.bf-badge.is-negative) {
  --bf-ui-badge-background: var(--bf-color-button-negative-default);
  color: var(--bf-color-button-negative-text);
}

:where(.bf-theme) :where(.bf-chip, .bf-chip.is-positive, .bf-chip.is-caution, .bf-chip.is-negative, .bf-chip.is-information) :where(.bf-badge, .bf-badge.is-negative) {
  margin-inline: 0;
}

:where(.bf-theme) :where(.bf-side-navigation-link):has(.bf-status-label) {
  align-items: baseline;
}

:where(.bf-theme) :where(.bf-side-navigation-status):has(> .bf-status-label) {
  align-items: baseline;
  align-self: baseline;
}

:where(.bf-theme) :where(.bf-status-label, .bf-status-label.is-positive, .bf-status-label.is-caution, .bf-status-label.is-information, .bf-status-label.is-negative) {
  --bf-ui-status-background: color-mix(in srgb, var(--bf-color-background-alt) 70%, black);
  --bf-ui-status-color: var(--bf-color-button-positive-text);
  background-color: transparent;
  background-image: linear-gradient(var(--bf-ui-status-background), var(--bf-ui-status-background));
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% calc(1em + (var(--bf-border-width) * 2));
  border-block: 0;
  color: var(--bf-ui-status-color);
  display: inline-block;
  inline-size: fit-content;
  justify-self: start;
${indicatorTypeStyles}  margin-block: calc((1em - 1lh) / 2);
  margin-inline: 0;
  padding-block: 0;
  padding-inline: var(--bf-component-inline-inset-field);
  text-align: center;
  text-decoration: none;
  vertical-align: baseline;
  white-space: nowrap;
}

:where(.bf-theme) :where(.bf-status-label.is-positive) {
  --bf-ui-status-background: var(--bf-color-border-positive);
  --bf-ui-status-color: var(--bf-color-button-positive-text);
}

:where(.bf-theme) :where(.bf-status-label.is-caution) {
  --bf-ui-status-background: var(--bf-color-border-caution);
  --bf-ui-status-color: #111111;
}

:where(.bf-theme) :where(.bf-status-label.is-information) {
  --bf-ui-status-background: var(--bf-color-border-information);
  --bf-ui-status-color: var(--bf-color-button-positive-text);
}

:where(.bf-theme) :where(.bf-status-label.is-negative) {
  --bf-ui-status-background: var(--bf-color-border-negative);
  --bf-ui-status-color: var(--bf-color-button-negative-text);
}

/* Named legacy hosts retain the one-release Chip compatibility path.
   Badge and StatusLabel compatibility classes intentionally inherit the same
   indicator typography and seat at every level. */
${legacyNestedChipRules}
${staticNavigationChipCss}
${denseTableChipCss}
`;
}
