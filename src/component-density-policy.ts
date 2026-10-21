const compoundEntryExclusions = ":not(.bf-color-control *):not(.bf-search-box *):not(.bf-search-and-filter-search-container *)";

const tableCellSingleLineEntrySubscribers = [
  `input.bf-input:not([type='hidden']):not([type='file']):not([type='color']):not([type='checkbox']):not([type='radio']):not([type='range'])${compoundEntryExclusions}`,
  `input:not([type])${compoundEntryExclusions}`,
  `input[type='text']${compoundEntryExclusions}`,
  `input[type='number']${compoundEntryExclusions}`,
  `input[type='search']${compoundEntryExclusions}`,
  `input[type='password']${compoundEntryExclusions}`,
  `input[type='email']${compoundEntryExclusions}`,
  `input[type='url']${compoundEntryExclusions}`,
  `select.bf-input${compoundEntryExclusions}`,
  `select${compoundEntryExclusions}`
] as const;

const tableCellTextareaSubscribers = [
  `textarea.bf-input${compoundEntryExclusions}`,
  `textarea${compoundEntryExclusions}`
] as const;

export const componentDensityPolicy = {
  version: 3,
  tableCell: {
    products: ["editorial", "documentation", "app", "os"],
    provider: ".bf-table :is(td, th)",
    providerBoundaries: ["td", "th", ".bf-theme"],
    subscribers: {
      chips: [".bf-chip"],
      boxedButtons: [".bf-button:not(.is-link)"],
      singleLineEntries: tableCellSingleLineEntrySubscribers,
      textareas: tableCellTextareaSubscribers
    },
    role: "spacing.inset.control.block",
    comfortableMember: "--bf-control-block-inset-comfortable",
    denseMember: "--bf-control-block-inset-dense",
    currentMember: "--bf-density-control-block-inset",
    componentBindings: {
      chip: "--bf-chip-control-block-inset",
      button: "--bf-button-control-block-inset",
      entry: "--bf-entry-control-block-inset"
    }
  },
  staticNavigationChip: {
    products: ["editorial", "documentation", "app", "os"],
    placements: {
      tab: {
        provider: ".bf-tabs .bf-tabs-link",
        providerBoundaries: [".bf-tabs-link", ".bf-theme"],
        subscriber: "span.bf-chip:not([role='button']):not(:has(.bf-chip-dismiss))",
        hostSubscriber: "span.bf-chip:not([role='button'])"
      },
      sideNavigationTrailing: {
        provider: ".bf-side-navigation :is(.bf-side-navigation-link, .bf-side-navigation-text)",
        providerBoundaries: [".bf-side-navigation-link", ".bf-side-navigation-text", ".bf-theme"],
        subscriber: ":where(.bf-side-navigation-status) span.bf-chip:not([role='button']):not(:has(.bf-chip-dismiss))",
        hostSubscriber: ":where(.bf-side-navigation-status) span.bf-chip:not([role='button'])"
      }
    },
    role: "spacing.inset.control.block",
    denseMember: "--bf-control-block-inset-dense",
    componentBinding: "--bf-chip-control-block-inset"
  }
} as const;

type ProviderDensityPolicy = {
  providerBoundaries: readonly string[];
};
type TableCellDensityPolicy = typeof componentDensityPolicy.tableCell;

export function boundedProviderSubscriberSelector(subscriber: string, policy: ProviderDensityPolicy): string {
  const boundaries = policy.providerBoundaries
    .map(boundary => `:scope ${boundary} ${subscriber}`)
    .join(", ");
  return `${subscriber}:not(.bf-theme):not(${boundaries})`;
}

export function tableCellDensityPolicySelectors(policy: TableCellDensityPolicy = componentDensityPolicy.tableCell): {
  boxedButtons: string;
  chips: string;
  fieldBoundaries: string;
  hosts: string;
  iconOnlyButtons: string;
  labeledIconButtons: string;
  singleLineEntries: string;
  textareas: string;
} {
  const bounded = (subscribers: readonly string[]): string => subscribers
    .map(subscriber => boundedProviderSubscriberSelector(subscriber, policy))
    .join(", ");
  const chips = bounded(policy.subscribers.chips);
  const boxedButtons = bounded(policy.subscribers.boxedButtons);
  const iconOnlyButtons = bounded(policy.subscribers.boxedButtons.map(button => `${button}:is(.is-icon:not(:has(.bf-button-label)))`));
  const labeledIconButtons = bounded(policy.subscribers.boxedButtons.map(button => `${button}:is(.is-icon:has(.bf-button-label))`));
  const singleLineEntries = bounded(policy.subscribers.singleLineEntries);
  const textareas = bounded(policy.subscribers.textareas);
  // Bound the leaf search as well as its owner: a nested cell or product root
  // cannot enroll an outer field boundary merely by containing its own input.
  const entryLeaves = [singleLineEntries, textareas].join(", ");
  const fieldBoundaries = boundedProviderSubscriberSelector(`.bf-field-boundary:has(:where(${entryLeaves}))`, policy);
  const members = [chips, boxedButtons, singleLineEntries, textareas].filter(Boolean).join(", ");

  return {
    boxedButtons,
    chips,
    fieldBoundaries,
    hosts: `:scope:has(${members})`,
    iconOnlyButtons,
    labeledIconButtons,
    singleLineEntries,
    textareas
  };
}

export function tableCellDensityScopedCss(densityScopes: string[], selector: string, declarations: string): string {
  const policy = componentDensityPolicy.tableCell;
  return providerScopedCss(densityScopes, policy.provider, policy.providerBoundaries, selector, declarations);
}

export function providerScopedCss(productScopes: string[], provider: string, boundaries: readonly string[], selector: string, declarations: string): string {
  return productScopes
    .map(scope => `@scope (${scope}) to (:where(.bf-theme)) {\n  @scope (:where(${provider})) to (:where(${boundaries.join(", ")})) {\n    ${selector} {\n${declarations.split("\n").map(line => `      ${line}`).join("\n")}\n    }\n  }\n}`)
    .join("\n\n");
}
