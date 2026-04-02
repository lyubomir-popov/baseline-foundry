export const overviewPages = [
  { title: "Living spec", href: "/index.html" },
  { title: "Controls gallery", href: "/demo/controls.html" },
  { title: "Component atlas", href: "/demo/components/index.html" }
];

export const specChapterPages = [
  { title: "Typography chapter", href: "/demo/spec/typography.html" },
  { title: "Spacing chapter", href: "/demo/spec/spacing.html" },
  { title: "Grid chapter", href: "/demo/spec/grid.html" },
  { title: "Typographic specimen", href: "/demo/spec/typographic-specimen.html" }
];

export const componentSections = [
  {
    heading: "Foundations",
    items: [
      { title: "Typography roles", href: "/demo/components/typography.html" },
      { title: "Prose flow", href: "/demo/components/prose.html" },
      { title: "Layout primitives", href: "/demo/components/layout.html" },
      { title: "Grid primitives", href: "/demo/components/grid.html" },
      { title: "Application shell", href: "/demo/components/application-shell.html" },
      { title: "Application layout", href: "/demo/components/application-layout.html" },
      { title: "Stage shell", href: "/demo/components/stage-shell.html" },
      { title: "Drawer panel", href: "/demo/components/drawer-panel.html" }
    ]
  },
  {
    heading: "Form elements",
    items: [
      { title: "Form atlas", href: "/demo/components/form-atlas.html" },
      { title: "Button", href: "/demo/components/button.html" },
      { title: "Actions", href: "/demo/components/actions.html" },
      { title: "Text input", href: "/demo/components/text-input.html" },
      { title: "Color input", href: "/demo/components/color-input.html" },
      { title: "Select", href: "/demo/components/select.html" },
      { title: "Checkbox", href: "/demo/components/checkbox.html" },
      { title: "Radio", href: "/demo/components/radio.html" },
      { title: "Range", href: "/demo/components/range.html" },
      { title: "File input", href: "/demo/components/file-input.html" },
      { title: "Validation", href: "/demo/components/validation.html" },
      { title: "Switch", href: "/demo/components/switch.html" },
      { title: "Search box", href: "/demo/components/search-box.html" },
      { title: "Search and filter", href: "/demo/components/search-and-filter.html" },
      { title: "Code snippet", href: "/demo/components/code-snippet.html" },
      { title: "List tree", href: "/demo/components/list-tree.html" }
    ]
  },
  {
    heading: "Data display",
    items: [
      { title: "Chip", href: "/demo/components/chip.html" },
      { title: "Badge", href: "/demo/components/badge.html" },
      { title: "Status label", href: "/demo/components/status-label.html" },
      { title: "Icon", href: "/demo/components/icon.html" },
      { title: "List", href: "/demo/components/list.html" },
      { title: "Inline list", href: "/demo/components/inline-list.html" },
      { title: "Table", href: "/demo/components/table.html" }
    ]
  },
  {
    heading: "Navigation and disclosure",
    items: [
      { title: "Tabs", href: "/demo/components/tabs.html" },
      { title: "Panel tabs", href: "/demo/components/panel-tabs.html" },
      { title: "Accordion", href: "/demo/components/accordion.html" },
      { title: "Side navigation", href: "/demo/components/side-navigation.html" },
      { title: "Top navigation", href: "/demo/components/top-navigation.html" },
      { title: "Baseline engine smoke", href: "/demo/components/engine-smoke.html" },
      { title: "Segmented control", href: "/demo/components/segmented-control.html" },
      { title: "Breadcrumbs", href: "/demo/components/breadcrumbs.html" },
      { title: "Pagination", href: "/demo/components/pagination.html" },
      { title: "Skip link", href: "/demo/components/skip-link.html" },
      { title: "Contextual menu", href: "/demo/components/contextual-menu.html" },
      { title: "Tooltip", href: "/demo/components/tooltip.html" }
    ]
  },
  {
    heading: "Surfaces and overlays",
    items: [
      { title: "Choice row", href: "/demo/components/choice-row.html" },
      { title: "Inline options", href: "/demo/components/inline-options.html" },
      { title: "Modal", href: "/demo/components/modal.html" },
      { title: "Cards", href: "/demo/components/cards.html" },
      { title: "Option card", href: "/demo/components/option-card.html" }
    ]
  },
  {
    heading: "Pressure tests",
    items: [
      { title: "Panel pressure", href: "/demo/components/panel-pressure.html" },
      { title: "Narrow panel", href: "/demo/components/narrow-panel.html" },
      { title: "Editorial pressure", href: "/demo/components/editorial-pressure.html" },
      { title: "Brand Layout Ops sample", href: "/demo/components/brand-layout-ops-sample.html" },
      { title: "Surfaces overview", href: "/demo/components/surfaces-navigation.html" }
    ]
  }
];

export const gridExamplePages = [
  { title: "Breakpoints", href: "/examples/grid/breakpoints.html" },
  { title: "Nested grid", href: "/examples/grid/nested-grid.html" },
  { title: "Editorial site", href: "/examples/grid/editorial-site.html" },
  { title: "Docs layout", href: "/examples/grid/docs-layout.html" },
  { title: "App panels", href: "/examples/grid/app-panels.html" },
  { title: "Panel reflow", href: "/examples/grid/panel-reflow.html" },
  { title: "Forms", href: "/examples/grid/forms.html" },
  { title: "Gutter comparison", href: "/examples/grid/gutter-comparison.html" },
  { title: "Column span rule", href: "/examples/grid/column-span-rule.html" }
];

export const spacingExamplePages = [
  { title: "Element vs container", href: "/examples/spacing/element-vs-container.html" },
  { title: "Bottom-only resilience", href: "/examples/spacing/bottom-only-resilience.html" },
  { title: "Semantic spacing stack", href: "/examples/spacing/semantic-spacing-stack.html" },
  { title: "Last-child reset", href: "/examples/spacing/last-child-reset.html" },
  { title: "Container density", href: "/examples/spacing/container-density.html" },
  { title: "App provisions", href: "/examples/spacing/app-provisions.html" },
  { title: "Border compensation", href: "/examples/spacing/border-compensation.html" },
  { title: "Nudge baseline", href: "/examples/spacing/nudge-baseline.html" },
  { title: "Substitutability", href: "/examples/spacing/substitutability.html" },
  { title: "Horizontal sibling", href: "/examples/spacing/horizontal-sibling.html" }
];

export const pageCatalogSections = [
  { heading: "Overview", items: overviewPages },
  { heading: "Spec chapters", items: specChapterPages },
  ...componentSections,
  { heading: "Grid examples", items: gridExamplePages },
  { heading: "Spacing examples", items: spacingExamplePages }
];

export function normalizePagePath(pathname) {
  if (!pathname) {
    return "/";
  }

  if (pathname === "/" || pathname === "/index.html") {
    return "/index.html";
  }

  if (pathname.endsWith("/demo/") || pathname === "/demo") {
    return "/index.html";
  }

  if (pathname.endsWith("/")) {
    return `${pathname}index.html`;
  }

  return pathname;
}

export function findPageByPath(pathname) {
  const normalizedPath = normalizePagePath(pathname);

  for (const section of pageCatalogSections) {
    for (const page of section.items) {
      if (page.href === normalizedPath) {
        return { ...page, section: section.heading };
      }
    }
  }

  return null;
}
