type Axis = "inline" | "block";
type Edge = "start" | "end" | "internal";

type Assignment = {
  axis: Axis;
  edge: Edge;
  role: string;
  condition?: string;
};

type Boundary = {
  scope: "all" | Axis | `${Axis}-${Exclude<Edge, "internal">}`;
  reason: string;
};

type Profile = {
  assignments: readonly Assignment[];
  boundaries: readonly Boundary[];
  rationale: string;
};

export type T006Disposition = {
  status: "candidate";
  profile: string;
  assignments: readonly Assignment[];
  boundaries: readonly Boundary[];
  rationale: string;
  exceptions?: readonly string[];
};

const role = (axis: Axis, edge: Edge, semanticRole: string, condition?: string) => ({
  axis,
  edge,
  role: semanticRole,
  ...(condition ? { condition } : {}),
});

const profiles = {
  "action-control": {
    assignments: [
      role("inline", "start", "spacing.inset.action.inline"),
      role("inline", "end", "spacing.inset.action.inline"),
      role("inline", "internal", "spacing.gap.mark.inline", "when a mark is present"),
      role("block", "start", "spacing.inset.control.block"),
      role("block", "end", "spacing.inset.control.block"),
    ],
    boundaries: [],
    rationale: "External line-owning action row; marker separation is conditional.",
  },
  "field-control": {
    assignments: [
      role("inline", "start", "spacing.inset.field.inline"),
      role("inline", "end", "spacing.inset.field.inline"),
      role("block", "start", "spacing.inset.control.block"),
      role("block", "end", "spacing.inset.control.block"),
    ],
    boundaries: [],
    rationale: "External field chrome; trailing artwork is intrinsic allocation inside the end edge.",
  },
  "marker-control": {
    assignments: [
      role("inline", "internal", "spacing.gap.mark.inline"),
      role("block", "start", "spacing.inset.control.block"),
      role("block", "end", "spacing.inset.control.block"),
    ],
    boundaries: [
      { scope: "inline-start", reason: "Outer inline inset is host-owned." },
      { scope: "inline-end", reason: "Outer inline inset is host-owned." },
    ],
    rationale: "A host row owns the mark-to-copy relationship and control-row block inset.",
  },
  "in-box-action-row": {
    assignments: [
      role("inline", "start", "spacing.inset.action.inline"),
      role("inline", "end", "spacing.inset.action.inline"),
      role("inline", "internal", "spacing.gap.mark.inline", "when a mark or caret is present"),
    ],
    boundaries: [
      {
        scope: "block",
        reason: "Continuous-fill or fixed host row; external occupied-control targets do not apply.",
      },
    ],
    rationale: "In-box action row; block geometry belongs to its containing row system.",
  },
  "in-box-field-row": {
    assignments: [
      role("inline", "start", "spacing.inset.field.inline"),
      role("inline", "end", "spacing.inset.field.inline"),
      role("inline", "internal", "spacing.gap.mark.inline", "when artwork is separated from copy"),
    ],
    boundaries: [
      {
        scope: "block",
        reason: "Continuous-fill or fixed host row; external occupied-control targets do not apply.",
      },
    ],
    rationale: "In-box field-like row; the host owns its fixed block track.",
  },
  "in-box-surface-row": {
    assignments: [
      role("inline", "start", "spacing.inset.surface.inline"),
      role("inline", "end", "spacing.inset.surface.inline"),
      role("inline", "internal", "spacing.gap.mark.inline", "when artwork is separated from copy"),
    ],
    boundaries: [
      {
        scope: "block",
        reason: "Continuous-fill or fixed host row; external occupied-control targets do not apply.",
      },
    ],
    rationale: "In-box header row with surface keylines and host-owned block geometry.",
  },
  "control-block-only": {
    assignments: [
      role("block", "start", "spacing.inset.control.block"),
      role("block", "end", "spacing.inset.control.block"),
    ],
    boundaries: [
      { scope: "inline", reason: "This denominator row carries no shared inline-role claim." },
    ],
    rationale: "The non-React owner consumes only the shared control block channel.",
  },
  "surface-section": {
    assignments: [
      role("inline", "start", "spacing.inset.surface.inline"),
      role("inline", "end", "spacing.inset.surface.inline"),
      role("block", "start", "spacing.inset.surface.block"),
      role("block", "end", "spacing.inset.surface.block"),
      role("block", "internal", "spacing.gap.element.block", "when the part stacks children"),
    ],
    boundaries: [],
    rationale: "Framed or sectioned component content; child separation stays a gap, not padding.",
  },
  "surface-section-no-stack": {
    assignments: [
      role("inline", "start", "spacing.inset.surface.inline"),
      role("inline", "end", "spacing.inset.surface.inline"),
      role("block", "start", "spacing.inset.surface.block"),
      role("block", "end", "spacing.inset.surface.block"),
    ],
    boundaries: [],
    rationale:
      "Framed or sectioned component content with no owned block child stack; internal peer gaps are assigned separately.",
  },
  "continuation-surface-panel": {
    assignments: [
      role("inline", "start", "spacing.inset.continuation.inline"),
      role("inline", "end", "spacing.inset.surface.inline"),
      role("block", "start", "spacing.inset.surface.block"),
      role("block", "end", "spacing.inset.surface.block"),
      role("block", "internal", "spacing.gap.element.block", "when the part stacks children"),
    ],
    boundaries: [],
    rationale: "Asymmetric panel: continuation keyline at start and surface edge at end.",
  },
  "element-stack": {
    assignments: [role("block", "internal", "spacing.gap.element.block")],
    boundaries: [
      { scope: "inline", reason: "No component-owned inline inset." },
      { scope: "block-start", reason: "No component-owned outer block inset." },
      { scope: "block-end", reason: "No component-owned outer block inset." },
    ],
    rationale: "Adjacent children form one logical unit.",
  },
  "group-stack": {
    assignments: [role("block", "internal", "spacing.gap.group.block")],
    boundaries: [
      { scope: "inline", reason: "No component-owned inline inset." },
      { scope: "block-start", reason: "No component-owned outer block inset." },
      { scope: "block-end", reason: "No component-owned outer block inset." },
    ],
    rationale: "The owner separates logical groups inside a pattern.",
  },
  "pattern-stack": {
    assignments: [role("block", "internal", "spacing.gap.pattern.block")],
    boundaries: [
      { scope: "inline", reason: "No component-owned inline inset." },
      { scope: "block-start", reason: "No component-owned outer block inset." },
      { scope: "block-end", reason: "No component-owned outer block inset." },
    ],
    rationale: "The owner separates major pattern sections.",
  },
  "field-inline-only": {
    assignments: [
      role("inline", "start", "spacing.inset.field.inline"),
      role("inline", "end", "spacing.inset.field.inline"),
    ],
    boundaries: [
      { scope: "block", reason: "Inline-formatting owner; no component block inset." },
    ],
    rationale: "Inline framed content uses the field inset without becoming a control row.",
  },
  "mark-gap-only": {
    assignments: [role("inline", "internal", "spacing.gap.mark.inline")],
    boundaries: [
      { scope: "inline-start", reason: "No component-owned outer inline inset." },
      { scope: "inline-end", reason: "No component-owned outer inline inset." },
      { scope: "block", reason: "No component-owned block inset." },
    ],
    rationale: "The part owns only separation between a mark and copy.",
  },
  "range-control-peer-gap": {
    assignments: [
      role(
        "inline",
        "internal",
        "spacing.gap.element.inline",
        "between the peer slider and number control",
      ),
    ],
    boundaries: [
      {
        scope: "inline-edges",
        reason: "The containing field owns the outside keyline; this row owns only peer separation.",
      },
      {
        scope: "block",
        reason: "Slider track, thumb and control cross-size are intrinsic paint/control geometry.",
      },
    ],
    rationale: "The composite owns one peer-control gap without turning its intrinsic slider paint into semantic spacing.",
  },
  "boundary-nonvisual": {
    assignments: [],
    boundaries: [{ scope: "all", reason: "Nonvisual composer; creates no spacing-owning box." }],
    rationale: "Behavioral composition is outside the spacing taxonomy.",
  },
  "boundary-delegated": {
    assignments: [],
    boundaries: [
      { scope: "all", reason: "Delegates visible spacing to named child parts or shared owners." },
    ],
    rationale: "The renderer adds no independent spacing relationship.",
  },
  "boundary-paint": {
    assignments: [],
    boundaries: [
      { scope: "all", reason: "Intrinsic paint/canvas/stroke geometry, not semantic spacing." },
    ],
    rationale: "Paint size, border reservation and optical correction do not mint spacing roles.",
  },
  "boundary-text": {
    assignments: [],
    boundaries: [
      { scope: "all", reason: "Typography-owned line box; no authored component inset or gap." },
    ],
    rationale: "Text metrics are governed by typography rather than semantic spacing.",
  },
  "boundary-page-grid": {
    assignments: [],
    boundaries: [
      {
        scope: "all",
        reason: "Page/application-shell/grid relationship excluded by FR-021 and FR-022.",
      },
    ],
    rationale: "Its owner is the page/grid taxonomy, not this component taxonomy.",
  },
  "boundary-frame": {
    assignments: [],
    boundaries: [
      {
        scope: "all",
        reason: "Root owns paint, overflow or track layout; child parts own content spacing.",
      },
    ],
    rationale: "A frame is not credited with its descendants' insets or gaps.",
  },
  "boundary-legacy-magnitude": {
    assignments: [],
    boundaries: [
      {
        scope: "all",
        reason: "Legacy or intrinsic magnitude has no reusable semantic role; retain as reviewed magnitude/boundary.",
      },
    ],
    rationale: "A repeated value alone is insufficient to create or join a semantic role.",
  },
  "token-table-composite": {
    assignments: [
      role("inline", "start", "spacing.inset.field.inline", "for table and control cells"),
      role("inline", "end", "spacing.inset.field.inline", "for table and control cells"),
      role("block", "internal", "spacing.gap.element.block", "inside a control or metadata unit"),
      role("block", "internal", "spacing.gap.group.block", "between table/control groups"),
    ],
    boundaries: [
      {
        scope: "all",
        reason: "Table tracks, border separation, swatch paint and intrinsic visualisation sizes remain non-token boundaries.",
      },
    ],
    rationale: "Composite owner: only the listed cell insets and stack gaps join component semantic roles.",
  },
} satisfies Record<string, Profile>;

const profileById = new Map<string, keyof typeof profiles>();
const add = (profile: keyof typeof profiles, ids: readonly string[]) => {
  for (const id of ids) {
    if (profileById.has(id)) throw new Error(`Duplicate T006 disposition for ${id}`);
    profileById.set(id, profile);
  }
};

add("action-control", [
  "ds-app-anbox/Button/Button",
  "ds-app-landscape/Button/Button",
  "ds-app-lxd/Button/Button",
  "ds-app-portal/Button/Button",
  "ds-global/_work_in_progress/SkipLink/SkipLink",
  "ds-global/component/Button/Button",
  "ds-global/component/Chip/Chip",
]);

add("field-control", [
  "ds-app-launchpad/FileTree/common/SearchBox/SearchBox",
  "ds-global-form/subcomponent/ColorInput/ColorInput",
  "ds-global-form/subcomponent/ComboboxInput/MultipleCombobox",
  "ds-global-form/subcomponent/ComboboxInput/SingleCombobox",
  "ds-global-form/subcomponent/DateInput/DateInput",
  "ds-global-form/subcomponent/DateTimeInput/DateTimeInput",
  "ds-global-form/subcomponent/NumberInput/NumberInput",
  "ds-global-form/subcomponent/PasswordInput/PasswordInput",
  "ds-global-form/subcomponent/PhoneInput/PhoneInput",
  "ds-global-form/subcomponent/SelectInput/SelectInput",
  "ds-global-form/subcomponent/TextareaInput/TextareaInput",
  "ds-global-form/subcomponent/TextInput/TextInput",
  "ds-global-form/subcomponent/TimeInput/TimeInput",
]);

add("marker-control", [
  "ds-global-form/common/Wrapper/ToggleWrapper",
  "ds-global-form/component/ChoicesField/common/Option/Option",
  "ds-global/pattern/Timeline/common/Event/Event",
]);

add("in-box-action-row", [
  "ds-app-launchpad/MarkdownEditor/common/Toolbar/common/Button/Button",
  "ds-app-launchpad/MarkdownEditor/common/ViewModeTabs/ViewModeTabs",
  "ds-app/SideNavigation/common/CollapseToggle/CollapseToggle",
  "ds-global-form/subcomponent/ComboboxInput/common/ResetButton/ResetButton",
  "ds-global/component/ContextualMenu/common/Item/Item",
  "ds-global/component/Tabs/common/Item/Item",
]);

add("in-box-field-row", [
  "ds-app-launchpad/FileTree/common/Node/Provider",
  "ds-app-launchpad/GitDiffViewer/common/CodeDiffViewer/CodeDiffViewer",
  "ds-app-launchpad/GitDiffViewer/common/CodeDiffViewer/common/DiffLine/DiffLine",
  "ds-app/SideNavigation/common/ContextSwitcher/ContextSwitcher",
  "ds-app/SideNavigation/common/Header/Header",
  "ds-app/SideNavigation/common/Item/Item",
  "ds-app/SideNavigation/common/ItemButton/ItemButton",
  "ds-app/SideNavigation/common/ItemExpandable/ItemExpandable",
  "ds-app/SideNavigation/common/NavTree/NavTree",
]);

add("in-box-surface-row", [
  "ds-app-launchpad/GitDiffViewer/common/FileHeader/FileHeader",
]);

add("surface-section", [
  "ds-app-launchpad/MarkdownEditor/MarkdownEditor",
  "ds-global-form/component/RichChoicesField/common/Option/Option",
  "ds-global-form/component/RichChoicesField/RichChoices",
  "ds-global-form/subcomponent/ComboboxInput/common/List/List",
  "ds-global-form/subcomponent/FileUploadInput/FileUploadInput",
  "ds-global/_work_in_progress/Announcement/Announcement",
  "ds-global/_work_in_progress/ChatSection/ChatSection",
  "ds-global/_work_in_progress/IconSection/IconSection",
  "ds-global/_work_in_progress/TSection/TSection",
  "ds-global/component/Card/common/Content/Content",
  "ds-global/component/Card/common/Footer/Footer",
  "ds-global/component/Card/common/Header/Header",
  "ds-global/component/ContextualMenu/ContextualMenu",
  "ds-global/component/Popover/Popover",
  "ds-global/component/Tile/common/Content/Content",
  "ds-global/component/Tile/common/Header/Header",
  "ds-global/component/Tooltip/Tooltip",
  "ds-global/pattern/Modal/common/Content/Content",
  "ds-global/pattern/Modal/common/Footer/Footer",
  "ds-global/pattern/Modal/common/Header/Header",
]);

add("surface-section-no-stack", [
  "ds-app/SidePanel/common/Content/Content",
  "ds-app/SidePanel/common/Footer/Footer",
  "ds-app/SidePanel/common/Header/Header",
]);

add("continuation-surface-panel", [
  "ds-global/component/Accordion/common/Item/Item",
]);

add("element-stack", [
  "ds-app-launchpad/MarkdownEditor/common/Toolbar/Toolbar",
  "ds-app/SideNavigation/common/Content/Content",
  "ds-global-form/common/Wrapper/Wrapper",
  "ds-global/component/Breadcrumbs/Breadcrumbs",
]);

add("group-stack", [
  "ds-app/SideNavigation/SideNavigation",
  "ds-global-form/pattern/Form/Form",
  "ds-global/group/Cards/Cards",
]);

add("pattern-stack", []);

add("field-inline-only", [
  "ds-app/SideNavigation/common/GroupHeader/GroupHeader",
  "ds-global-form/component/ChoicesField/Choices",
  "ds-global/component/InlineCode/InlineCode",
  "ds-global/component/KeyboardKey/KeyboardKey",
]);

add("mark-gap-only", [
  "ds-global-form/subcomponent/Field/Label/Label",
  "ds-global/component/Breadcrumbs/common/Item/Item",
  "ds-global/group/KeyboardKeys/KeyboardKeys",
]);

add("boundary-nonvisual", [
  "ds-app/SidePanel/withSidePanel",
  "ds-global-form/common/Wrapper/withToggleWrapper",
  "ds-global-form/component/HiddenField/HiddenField",
  "ds-global-form/pattern/Field/Field",
  "ds-global-form/subcomponent/HiddenInput/HiddenInput",
  "ds-global/component/Tooltip/TooltipEngine",
  "ds-global/component/Tooltip/withTooltip",
  "ds-global/pattern/Modal/withModal",
]);

add("boundary-delegated", [
  "ds-app-launchpad/FileTree/common/File/File",
  "ds-app-launchpad/FileTree/common/Folder/Folder",
  "ds-app-launchpad/FileTree/common/TreeView/TreeView",
  "ds-app-launchpad/GitDiffViewer/common/CodeDiffViewer/common/AnnotatedDiffLine/AnnotatedDiffLine",
  "ds-app/SideNavigation/common/Footer/Footer",
  "ds-app/SideNavigation/common/Group/Group",
  "ds-global-form/common/Wrapper/InvisibleWrapper",
  "ds-global-form/component/CheckboxField/CheckboxField",
  "ds-global-form/component/ChoicesField/ChoicesField",
  "ds-global-form/component/ColorField/ColorField",
  "ds-global-form/component/ComboboxField/ComboboxField",
  "ds-global-form/component/DateField/DateField",
  "ds-global-form/component/DateTimeField/DateTimeField",
  "ds-global-form/component/FileUploadField/FileUploadField",
  "ds-global-form/component/NumberField/NumberField",
  "ds-global-form/component/PasswordField/PasswordField",
  "ds-global-form/component/PhoneField/PhoneField",
  "ds-global-form/component/RangeField/RangeField",
  "ds-global-form/component/RatingField/RatingField",
  "ds-global-form/component/RichChoicesField/RichChoicesField",
  "ds-global-form/component/SelectField/SelectField",
  "ds-global-form/component/SwitchField/SwitchField",
  "ds-global-form/component/TextareaField/TextareaField",
  "ds-global-form/component/TextField/TextField",
  "ds-global-form/component/TimeField/TimeField",
  "ds-global-form/subcomponent/ComboboxInput/ComboboxInput",
  "ds-global/component/Card/Card",
  "ds-global/component/Tabs/Tabs",
  "ds-global/component/Tile/Tile",
  "ds-global/pattern/Timeline/common/Content/Content",
  "ds-global/pattern/Timeline/Timeline",
]);

add("boundary-paint", [
  "ds-app-launchpad/DiffChangeMarker/common/DetailedChangeMarker/DetailedChangeMarker",
  "ds-app-launchpad/DiffChangeMarker/common/SimpleChangeMarker/SimpleChangeMarker",
  "ds-app-launchpad/DiffChangeMarker/DiffChangeMarker",
  "ds-app-launchpad/FileTree/common/IndentationBlock/IndentationBlock",
  "ds-app-launchpad/MarkdownEditor/common/Toolbar/common/Separator/Separator",
  "ds-global-form/subcomponent/CheckboxInput/CheckboxInput",
  "ds-global-form/subcomponent/RadioInput/RadioInput",
  "ds-global-form/subcomponent/RangeInput/RangeInput",
  "ds-global-form/subcomponent/SwitchInput/SwitchInput",
  "ds-global/component/Badge/Badge",
  "ds-global/component/Card/common/Image/Image",
  "ds-global/component/Icon/Icon",
  "ds-global/subcomponent/Spinner/Spinner",
]);

add("range-control-peer-gap", [
  "ds-global-form/component/RangeField/common/RangeControl/RangeControl",
]);

add("boundary-text", [
  "ds-app-launchpad/RelativeTime/RelativeTime",
  "ds-global-form/subcomponent/Field/Description/Description",
  "ds-global-form/subcomponent/Field/Error/Error",
  "ds-global/_work_in_progress/DescriptionSection/DescriptionSection",
  "ds-global/_work_in_progress/Link/Link",
]);

add("boundary-page-grid", [
  "ds-app/ApplicationLayout/ApplicationLayout",
  "ds-app/ContentLayout/ContentLayout",
  "ds-app/ViewLayout/ViewLayout",
  "ds-global/_work_in_progress/grid/ApplicationLayout/ApplicationLayout",
  "ds-global/_work_in_progress/grid/InnerGridDemo/InnerGridDemo",
  "ds-global/_work_in_progress/grid/SettingsView/SettingsView",
]);

add("boundary-frame", [
  "ds-app/SidePanel/SidePanel",
  "ds-app-launchpad/EditableBlock/EditableBlock",
  "ds-app-launchpad/FileTree/Provider",
  "ds-app-launchpad/GitDiffViewer/Provider",
  "ds-global/_work_in_progress/grid/GridCard/GridCard",
  "ds-global/component/ContextualMenu/common/SubMenu/SubMenu",
  "ds-global/pattern/Modal/Modal",
]);

add("boundary-legacy-magnitude", [
  "ds-app-launchpad/MarkdownEditor/common/Toolbar/common/Group/Group",
  "ds-global-form/subcomponent/RatingInput/RatingInput",
  "ds-global/_work_in_progress/Rule/Rule",
  "ds-global/_work_in_progress/Label/Label",
  "tokens/TokenTable/common/TokenSwatch/TokenSwatch",
]);

const exceptions: Record<string, readonly string[]> = {
  "ds-global/component/Button/Button": [
    "The icon-and-text variant uses spacing.inset.field.inline at inline-start, spacing.inset.action.inline at inline-end and spacing.gap.mark.inline internally.",
    "The link variant is an explicit zero-inset boundary and does not consume the control block inset.",
  ],
  "ds-global/component/Chip/Chip": [
    "The nested variant is a host-fit mode, not a new role; approval depends on the density policy and FR-044a.",
  ],
  "ds-global-form/subcomponent/ColorInput/ColorInput": [
    "The popover separator row has a block-start border and no block-end border while inheriting symmetric host row padding; recut through per-edge actual border subtraction, never nominal host-border subtraction.",
    "Popover and swatch-grid child relationships compose surface and element-gap roles; they do not mint ColorInput-specific roles.",
  ],
  "ds-global-form/subcomponent/FileUploadInput/FileUploadInput": [
    "The dropzone canvas is intrinsic content and may exceed the control-row target; only its framed section and child gaps consume semantic roles.",
  ],
  "ds-global/component/Accordion/common/Item/Item": [
    "The summary is a marker-control row; the expanded content uses continuation at inline-start and surface at inline-end.",
    "The Accordion root owns item separation; the Item does not absorb that gap into its padding.",
  ],
  "ds-global/component/ContextualMenu/ContextualMenu": [
    "The trigger wrapper is a boundary; the portaled surface consumes surface insets and its Item rows own action/control geometry.",
  ],
  "ds-global/component/Popover/Popover": [
    "The trigger wrapper is a boundary; only the portaled content panel consumes the surface profile.",
  ],
  "ds-global/component/Tooltip/Tooltip": [
    "Caret size and placement are paint; trigger distance is a positioning magnitude because placement can use either axis, not a panel inset or block-only gap.",
    "The optional leading icon uses spacing.gap.mark.inline; peer-to-peer inline separation uses spacing.gap.element.inline elsewhere.",
  ],
  "ds-global/_work_in_progress/Announcement/Announcement": [
    "The leading marker additionally consumes spacing.gap.mark.inline; its canvas remains paint.",
  ],
  "ds-global/_work_in_progress/Section/Section": [
    "Shallow framed sections consume spacing.inset.surface.block; default, deep and hero page-section edges consume the existing strip inset and remain outside the component-category count under FR-053a.",
  ],
  "ds-global/pattern/Modal/common/Header/Header": [
    "The close action keeps its own action/control contract; the inset divider is paint and does not alter the header edge assignment.",
  ],
  "ds-global/pattern/Modal/common/Footer/Footer": [
    "The action row uses spacing.gap.element.inline; it must not reuse the block-axis element role or the marker-to-copy role.",
  ],
  "ds-app/SideNavigation/SideNavigation": [
    "Rail padding is fixed in-box navigation geometry; spacing.gap.group.block covers separation between navigation sections, not page inset.",
  ],
  "ds-app/SideNavigation/common/NavTree/NavTree": [
    "Depth indentation composes spacing.inset.continuation.inline; fade clearance and fixed row floors remain paint/layout boundaries.",
  ],
  "ds-app/SideNavigation/common/GroupHeader/GroupHeader": [
    "Its inline alignment is inherited from the rail keyline; the row's top padding belongs to the parent group separation contract.",
  ],
  "ds-app-launchpad/GitDiffViewer/common/CodeDiffViewer/CodeDiffViewer": [
    "Table border-spacing and browser-used row margin are layout/browsing-model boundaries, not new semantic roles.",
  ],
  "ds-app-launchpad/MarkdownEditor/MarkdownEditor": [
    "Toolbar, view tabs and preview content remain separate owners; highlighted-code and task-list offsets require T010 literal dispositions.",
  ],
  "ds-app/SidePanel/SidePanel": [
    "Fixed viewport placement, width, shadow, z-index and transition are application-shell/panel-frame boundaries; child sections own semantic insets.",
  ],
  "ds-app/SidePanel/common/Header/Header": [
    "Title typography and the temporary icon-only close-button baseline workaround remain typography/control boundaries; the section owns surface insets and peer separation.",
  ],
  "ds-app/SidePanel/common/Footer/Footer": [
    "The inset divider is paint; its inline margin applies the surface keyline while the footer's actions use peer separation.",
  ],
  "tokens/TokenTable/TokenTable": [
    "Cell edges use spacing.inset.field.inline; control stacks use spacing.gap.element.block and section stacks use spacing.gap.group.block.",
    "Painted swatches and table/grid mechanics remain explicit boundaries; T007/T010 classify each remaining literal.",
  ],
};

const additionalAssignments: Record<string, readonly Assignment[]> = {
  "ds-global-form/common/Wrapper/ToggleWrapper": [
    role("block", "internal", "spacing.gap.element.block", "between field copy and the toggle row"),
  ],
  "ds-global-form/component/ChoicesField/Choices": [
    role("block", "internal", "spacing.gap.element.block", "between adjacent choices in one field"),
    role("inline", "internal", "spacing.gap.element.inline", "between adjacent choice columns"),
  ],
  "ds-global/component/Card/common/Footer/Footer": [
    role("inline", "internal", "spacing.gap.element.inline", "between peer footer items"),
  ],
  "ds-global/component/Tile/common/Header/Header": [
    role("inline", "internal", "spacing.gap.mark.inline", "between header artwork and copy"),
  ],
  "ds-global/component/Tooltip/Tooltip": [
    role("inline", "internal", "spacing.gap.mark.inline", "between the optional leading icon and copy"),
  ],
  "ds-global/pattern/Modal/common/Footer/Footer": [
    role("inline", "internal", "spacing.gap.element.inline", "between peer footer actions"),
  ],
  "ds-app/SidePanel/common/Header/Header": [
    role("inline", "internal", "spacing.gap.element.inline", "between the title and close action"),
  ],
  "ds-app/SidePanel/common/Footer/Footer": [
    role("inline", "internal", "spacing.gap.element.inline", "between peer footer actions"),
  ],
  "ds-global/_work_in_progress/Announcement/Announcement": [
    role("inline", "internal", "spacing.gap.mark.inline", "between the leading marker and copy"),
  ],
  "ds-global/component/Accordion/common/Item/Item": [
    role("inline", "internal", "spacing.gap.mark.inline", "in the summary row"),
    role("block", "start", "spacing.inset.control.block", "in the summary row"),
    role("block", "end", "spacing.inset.control.block", "in the summary row"),
  ],
  "ds-app/SideNavigation/common/NavTree/NavTree": [
    role("inline", "start", "spacing.inset.continuation.inline", "for nested group depth"),
    role("block", "internal", "spacing.gap.element.block", "between navigation rows/groups at the local level"),
  ],
};

// Rows whose profile is deliberately special enough to keep out of the broad lists.
add("surface-section", [
  "ds-global/_work_in_progress/CategoriesSection/CategoriesSection",
  "ds-global/_work_in_progress/Section/Section",
]);
add("element-stack", [
  "ds-global/_work_in_progress/CategoriesSection/common/Category/Category",
  "ds-global/component/Accordion/Accordion",
]);
add("token-table-composite", ["tokens/TokenTable/TokenTable"]);

const nonReactProfiles: Record<string, keyof typeof profiles> = {
  "svelte-ds-app-launchpad/Button": "action-control",
  "svelte-ds-app-launchpad/NumberInput": "control-block-only",
  "svelte-ds-app-launchpad/TextInput": "control-block-only",
  "svelte-ds-app-launchpad/Chip": "action-control",
  "svelte-ds-app-launchpad/Select": "field-control",
  "svelte-ds-app-launchpad/InputPrimitive": "field-control",
  "svelte-ds-app-launchpad/density-shim": "boundary-nonvisual",
  "svelte-ds-app-wpe/Button": "action-control",
  "svelte-ds-app-wpe/Rule": "boundary-legacy-magnitude",
  "svelte-ds-app-wpe/Cards": "boundary-page-grid",
  "svelte-ds-app/ContentLayout": "boundary-page-grid",
};

for (const [id, profile] of Object.entries(nonReactProfiles)) {
  if (profileById.has(id)) throw new Error(`Duplicate T006 disposition for ${id}`);
  profileById.set(id, profile);
}

export const t006CandidateRoles = [
  "spacing.inset.action.inline",
  "spacing.inset.continuation.inline",
  "spacing.inset.control.block",
  "spacing.inset.field.inline",
  "spacing.inset.surface.block",
  "spacing.inset.surface.inline",
  "spacing.gap.element.block",
  "spacing.gap.element.inline",
  "spacing.gap.group.block",
  "spacing.gap.mark.inline",
  "spacing.gap.pattern.block",
] as const;

export const getT006Disposition = (id: string): T006Disposition => {
  const profileName = profileById.get(id);
  if (!profileName) throw new Error(`Missing T006 disposition for ${id}`);
  const profile = profiles[profileName];
  return {
    status: "candidate",
    profile: profileName,
    assignments: [
      ...profile.assignments,
      ...(additionalAssignments[id] ?? []),
    ],
    boundaries: profile.boundaries,
    rationale: profile.rationale,
    ...(exceptions[id] ? { exceptions: exceptions[id] } : {}),
  };
};

export const assertT006Coverage = (ids: readonly string[]) => {
  const expected = new Set(ids);
  const missing = ids.filter((id) => !profileById.has(id));
  const extra = [...profileById.keys()].filter((id) => !expected.has(id));
  if (missing.length || extra.length) {
    throw new Error(
      `T006 coverage mismatch. Missing: ${missing.join(", ") || "none"}. Extra: ${extra.join(", ") || "none"}.`,
    );
  }

  const allowedRoles = new Set<string>(t006CandidateRoles);
  for (const id of ids) {
    const disposition = getT006Disposition(id);
    if (!disposition.assignments.length && !disposition.boundaries.length) {
      throw new Error(`T006 disposition has no assignment or boundary: ${id}`);
    }
    const seen = new Set<string>();
    for (const assignment of disposition.assignments) {
      if (!allowedRoles.has(assignment.role)) {
        throw new Error(`Unknown T006 candidate role ${assignment.role} on ${id}`);
      }
      if (!assignment.role.endsWith(`.${assignment.axis}`)) {
        throw new Error(
          `T006 axis mismatch for ${assignment.role} on ${id}: ${assignment.axis}`,
        );
      }
      const key = JSON.stringify(assignment);
      if (seen.has(key)) throw new Error(`Duplicate T006 assignment on ${id}: ${key}`);
      seen.add(key);
    }
  }
};
