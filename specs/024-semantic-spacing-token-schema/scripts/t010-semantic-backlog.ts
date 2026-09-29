type SemanticDisposition =
  | { kind: "role"; role: string; owner: string; reason: string }
  | { kind: "boundary" | "exception"; owner: string; reason: string };

export type SemanticFinding = {
  id: string;
  path: string;
  relationship: string;
  disposition: SemanticDisposition;
};

const role = (
  roleId: string,
  reason: string,
): SemanticDisposition => ({
  kind: "role",
  role: roleId,
  owner: "Spec 024 CP1 taxonomy owner",
  reason,
});

export const t010SemanticFindings: readonly SemanticFinding[] = [
  {
    id: "side-panel-section-inline-insets",
    path: "packages/react/ds-app/src/lib/SidePanel/styles.css",
    relationship: "shared inline keyline for Header, Content and Footer",
    disposition: role(
      "spacing.inset.surface.inline",
      "The shared alias supplies panel-section content breathing; Footer implements the same keyline as margin so its divider stays inset.",
    ),
  },
  {
    id: "side-panel-section-block-insets",
    path: "packages/react/ds-app/src/lib/SidePanel/common/Content/styles.css",
    relationship: "block insets on Header, Content and Footer sections",
    disposition: role(
      "spacing.inset.surface.block",
      "Each child section owns its block-edge breathing; arbitrary Content children do not imply an internal stack gap.",
    ),
  },
  {
    id: "side-panel-header-peer-gap",
    path: "packages/react/ds-app/src/lib/SidePanel/common/Header/styles.css",
    relationship: "inline gap between the panel title and close action",
    disposition: role(
      "spacing.gap.element.inline",
      "The title and close action are peers; this is not marker-to-copy separation.",
    ),
  },
  {
    id: "side-panel-footer-peer-gap",
    path: "packages/react/ds-app/src/lib/SidePanel/common/Footer/styles.css",
    relationship: "inline gap between peer panel footer actions",
    disposition: role(
      "spacing.gap.element.inline",
      "The footer repeats the Modal/Card peer-item relationship and strengthens the role's recurrence.",
    ),
  },
  {
    id: "side-panel-compact-close-action",
    path: "packages/react/ds-app/src/lib/SidePanel/common/Header/styles.css",
    relationship: "host-authored symmetric compact inset for an icon-only close Button",
    disposition: {
      kind: "exception",
      owner: "@canonical/react-ds-global Button owner",
      reason:
        "SidePanel and Modal repeat the same host override; CP1 must raise a Button variant/role candidate or justify one bounded host exception under FR-047a.",
    },
  },
  {
    id: "side-panel-section-seams",
    path: "packages/react/ds-app/src/lib/SidePanel/common/Content/styles.css",
    relationship: "Header-to-Content and Content-to-Footer block separation",
    disposition: {
      kind: "exception",
      owner: "Spec 024 CP1 taxonomy owner",
      reason:
        "CP1 must decide whether SidePanel, Modal and Card deliberately compose adjacent surface insets or should move separation to a container-owned group gap.",
    },
  },
  {
    id: "side-panel-button-gap-cancellation",
    path: "packages/react/ds-app/src/lib/SidePanel/common/Header/styles.css",
    relationship: "negative cancellation of Button's internal gap for the zero-width baseline shim",
    disposition: {
      kind: "boundary",
      owner: "@canonical/react-ds-global Button typography/control owner",
      reason:
        "This compensates an icon-only baseline workaround; it is not peer separation and must disappear with or remain owned by that workaround.",
    },
  },
  {
    id: "side-panel-title-closure",
    path: "packages/react/ds-app/src/lib/SidePanel/common/Header/styles.css",
    relationship: "heading-sized title inside a baseline-aligned flex header",
    disposition: {
      kind: "exception",
      owner: "Spec 024 metric-authority decision",
      reason:
        "The accepted closure model is independent of --space-after; current-main SidePanel was not in T004 evidence and can gain a full body-line closure unless T008/CP1 resolves component text closure.",
    },
  },
  {
    id: "card-footer-peer-gap",
    path: "packages/react/ds-global/src/lib/component/Card/common/Footer/styles.css",
    relationship: "inline gap between peer footer items",
    disposition: role(
      "spacing.gap.element.inline",
      "Peer items are adjacent elements in one footer unit; they are not a marker-and-copy pair.",
    ),
  },
  {
    id: "modal-footer-peer-gap",
    path: "packages/react/ds-global/src/lib/pattern/Modal/common/Footer/styles.css",
    relationship: "inline gap between peer footer actions",
    disposition: role(
      "spacing.gap.element.inline",
      "Peer actions require an inline element role; using element.block would violate the axis contract.",
    ),
  },
  {
    id: "range-control-peer-gap",
    path: "packages/react/ds-global-form/src/lib/component/RangeField/common/RangeControl/styles.css",
    relationship: "inline gap between the slider and number control",
    disposition: role(
      "spacing.gap.element.inline",
      "The slider and number field are peer controls, not a mark and its label.",
    ),
  },
  {
    id: "choices-row-gap",
    path: "packages/react/ds-global-form/src/lib/component/ChoicesField/styles.css",
    relationship: "block gap between adjacent choices in one field",
    disposition: role(
      "spacing.gap.element.block",
      "Adjacent choices belong to one field unit; the prior group assignment overstated the hierarchy.",
    ),
  },
  {
    id: "choices-column-gap",
    path: "packages/react/ds-global-form/src/lib/component/ChoicesField/styles.css",
    relationship: "inline gap between adjacent choice columns",
    disposition: role(
      "spacing.gap.element.inline",
      "The two-value gap shorthand needs an axis-correct inline peer relationship.",
    ),
  },
  {
    id: "choices-option-mark-gap",
    path: "packages/react/ds-global-form/src/lib/component/ChoicesField/styles.css",
    relationship: "inline gap between a checkbox/radio mark and its label",
    disposition: role(
      "spacing.gap.mark.inline",
      "This is the defining marker-to-copy relationship and must not merge with peer separation.",
    ),
  },
  {
    id: "tile-header-mark-gap",
    path: "packages/react/ds-global/src/lib/component/Tile/common/Header/styles.css",
    relationship: "inline gap between header artwork and copy",
    disposition: role(
      "spacing.gap.mark.inline",
      "Artwork-to-copy separation is the mark role, not a generic peer gap.",
    ),
  },
  {
    id: "tooltip-content-mark-gap",
    path: "packages/react/ds-global/src/lib/component/Tooltip/styles.css",
    relationship: "inline gap between the optional icon and tooltip copy",
    disposition: role(
      "spacing.gap.mark.inline",
      "The optional icon is a leading mark; the tooltip panel inset remains independent.",
    ),
  },
  {
    id: "tooltip-trigger-distance",
    path: "packages/react/ds-global/src/lib/component/Tooltip/Tooltip.tsx",
    relationship: "distance between trigger and positioned tooltip",
    disposition: {
      kind: "boundary",
      owner: "@canonical/react-ds-global Tooltip positioning owner",
      reason:
        "Placement can be top, bottom, left or right, so a block-only gap role is false; retain a reviewed positioning magnitude.",
    },
  },
  {
    id: "token-swatch-inline-gap",
    path: "packages/react/tokens/src/lib/TokenTable/common/TokenSwatch/styles.css",
    relationship: "inline separation inside the token swatch composite",
    disposition: {
      kind: "exception",
      owner: "@canonical/react-tokens TokenSwatch owner",
      reason:
        "The frozen row is a legacy-magnitude boundary; CP1 must prove recurrence before promoting this component-specific composite spacing.",
    },
  },
  {
    id: "card-header-content-seam",
    path: "packages/react/ds-global/src/lib/component/Card/common/Content/styles.css",
    relationship: "block separation between Card header and content sections",
    disposition: {
      kind: "exception",
      owner: "Spec 024 CP1 taxonomy owner",
      reason:
        "CP1 must choose whether the seam intentionally composes two surface insets or is one group gap; value coincidence cannot decide it.",
    },
  },
  {
    id: "section-variant-split",
    path: "packages/react/ds-global/src/lib/_work_in_progress/Section/styles.css",
    relationship: "variant-scoped Section block edges",
    disposition: {
      kind: "boundary",
      owner: "Spec 020b page/section owner",
      reason:
        "Shallow/framed uses the component surface inset; default, deep and hero use the external strip/page-section inset under FR-053a.",
    },
  },
  {
    id: "svelte-section-legacy-primitives",
    path: "packages/svelte/ds-app-wpe/src/lib/components/Section/styles.css",
    relationship: "Svelte Section variant block insets remain on primitive aliases",
    disposition: {
      kind: "boundary",
      owner: "@canonical/svelte-ds-app-wpe owner with Spec 020b",
      reason:
        "FR-036 keeps this fork out of the React spike; its surface/strip variant split must be migrated by its own owner.",
    },
  },
  {
    id: "app-gap-ordering",
    path: "packages/styles/main/src/spacing.css",
    relationship: "App element/group/pattern ordering and removal of the legacy section alias",
    disposition: {
      kind: "exception",
      owner: "Spec 024 CP1 taxonomy owner",
      reason:
        "The proposed 4/16/32 App sequence resolves the live 8/8/32/16 contradiction; provider implementation remains post-CP2 migration debt.",
    },
  },
  {
    id: "summon-app-shell-padding",
    path: "packages/summon/application/src/application/react/templates/src/styles/app.css",
    relationship: "application-shell padding",
    disposition: {
      kind: "boundary",
      owner: "Spec 020b grid/page-shell owner",
      reason:
        "Application-shell padding is outside the component taxonomy and must not widen the migrated package set.",
    },
  },
  {
    id: "react-boilerplate-app-shell-padding",
    path: "apps/react/boilerplate-vite/src/styles/app.css",
    relationship: "application-scaffold shell padding",
    disposition: {
      kind: "boundary",
      owner: "React application-scaffold owner with Spec 020b",
      reason:
        "Application scaffold geometry is not a design-system component role.",
    },
  },
  {
    id: "side-navigation-story-fixture",
    path: "packages/react/ds-app/.storybook/side-navigation-spacing-contract.css",
    relationship: "Storybook spacing-contract fixture literals",
    disposition: {
      kind: "boundary",
      owner: "@canonical/react-ds-app Storybook/audit-fixture owner",
      reason:
        "The fixture is evidence chrome and changes only when comparison evidence requires it.",
    },
  },
  {
    id: "svelte-cards-grid-boundary",
    path: "packages/svelte/ds-app-wpe/src/lib/group/Cards/styles.css",
    relationship: "Svelte Cards row/column gap",
    disposition: {
      kind: "boundary",
      owner: "@canonical/svelte-ds-app-wpe owner",
      reason:
        "FR-036 and FR-040 keep this non-React grid consumer explicit; do not soften it in the component taxonomy.",
    },
  },
  {
    id: "color-input-separator-edge",
    path: "packages/react/ds-global-form/src/lib/subcomponent/ColorInput/styles.css",
    relationship: "popover separator row with only a block-start border",
    disposition: {
      kind: "exception",
      owner: "@canonical/react-ds-global-form ColorInput owner",
      reason:
        "Re-cut through actual per-edge borders; symmetric nominal-border subtraction leaves the borderless end edge one pixel short.",
    },
  },
  {
    id: "chromium-text-closure-drift",
    path: "packages/styles/main/src/elements.css",
    relationship: "fractional phase padding plus closure margin rounds down separately",
    disposition: {
      kind: "exception",
      owner: "Spec 024 metric-authority decision",
      reason:
        "Chromium loses 1/64px per closed text element; CP1 must choose a metric bound and whether authority sits at CP1 or CP2.",
    },
  },
] as const;
