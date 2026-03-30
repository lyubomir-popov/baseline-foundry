import { initAccordions, initApplicationLayouts, initBaselineGridToggles, initCodeSnippets, initContextualMenus, initListTree, initPanelDrawers, initRangeControls, initResizableAsides, initSideNavigations, initTabs, initTooltips } from "../dist/index.js";

initBaselineGridToggles({
  defaultEnabled: true,
  toggleSelector: ".js-baseline-toggle[aria-controls], [data-demo-baseline-toggle][aria-controls]"
});
initApplicationLayouts();
initCodeSnippets();
initContextualMenus();
initListTree();
initPanelDrawers();
initRangeControls();
initResizableAsides();
initSideNavigations();
initTabs();
initTooltips();
initAccordions();

const NAV_ITEMS = [
  { title: "Living spec", href: "../index.html" },
  { title: "Controls page", href: "../controls.html" },
  { title: "Component atlas", href: "index.html" },
  null,
  { title: "Typography roles", href: "typography.html" },
  { title: "Prose flow", href: "prose.html" },
  { title: "Layout primitives", href: "layout.html" },
  { title: "Grid primitives", href: "grid.html" },
  { title: "Application shell", href: "application-shell.html" },
  { title: "Application layout", href: "application-layout.html" },
  { title: "Stage shell", href: "stage-shell.html" },
  { title: "Drawer panel", href: "drawer-panel.html" },
  null,
  { title: "Button", href: "button.html" },
  { title: "Actions", href: "actions.html" },
  { title: "Text input", href: "text-input.html" },
  { title: "Color input", href: "color-input.html" },
  { title: "Select", href: "select.html" },
  { title: "Checkbox", href: "checkbox.html" },
  { title: "Radio", href: "radio.html" },
  { title: "Range", href: "range.html" },
  { title: "File input", href: "file-input.html" },
  { title: "Validation", href: "validation.html" },
  { title: "Switch", href: "switch.html" },
  { title: "Chip", href: "chip.html" },
  { title: "Badge", href: "badge.html" },
  { title: "Status label", href: "status-label.html" },
  { title: "Table", href: "table.html" },
  { title: "Search box", href: "search-box.html" },
  { title: "Search and filter", href: "search-and-filter.html" },
  { title: "Code snippet", href: "code-snippet.html" },
  { title: "List tree", href: "list-tree.html" },
  { title: "Tabs", href: "tabs.html" },
  { title: "Panel tabs", href: "panel-tabs.html" },
  { title: "Accordion", href: "accordion.html" },
  { title: "Side navigation", href: "side-navigation.html" },
  { title: "Baseline engine smoke", href: "engine-smoke.html" },
  { title: "Modal", href: "modal.html" },
  { title: "Choice row", href: "choice-row.html" },
  { title: "Inline options", href: "inline-options.html" },
  { title: "Segmented control", href: "segmented-control.html" },
  { title: "Breadcrumbs", href: "breadcrumbs.html" },
  { title: "Pagination", href: "pagination.html" },
  { title: "Contextual menu", href: "contextual-menu.html" },
  { title: "Tooltip", href: "tooltip.html" },
  { title: "Divider", href: "divider.html" },
  { title: "Cards", href: "cards.html" },
  { title: "Option card", href: "option-card.html" },
  null,
  { title: "Panel pressure test", href: "panel-pressure.html" },
  { title: "Editorial pressure test", href: "editorial-pressure.html" },
  { title: "Parameter matrix", href: "parameter-matrix.html" },
  { title: "Brand Layout Ops sample", href: "brand-layout-ops-sample.html" },
  null,
  { title: "Controls overview", href: "controls.html" },
  { title: "Surfaces overview", href: "surfaces-navigation.html" }
];

function injectNav() {
  const currentPath = location.pathname;
  const nav = document.createElement("nav");
  nav.dataset.demoNav = "true";
  nav.setAttribute("aria-label", "Component demos");
  nav.dataset.baselineIgnore = "true";

  const toggle = document.createElement("button");
  toggle.dataset.demoNavToggle = "true";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "demo-nav-list");
  toggle.textContent = "Index";
  toggle.title = "Toggle navigation";
  nav.appendChild(toggle);

  const list = document.createElement("ul");
  list.id = "demo-nav-list";
  list.dataset.demoNavList = "true";

  for (const item of NAV_ITEMS) {
    if (item === null) {
      const separator = document.createElement("li");
      separator.dataset.demoNavSeparator = "true";
      separator.setAttribute("role", "separator");
      list.appendChild(separator);
      continue;
    }

    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = item.href;
    link.textContent = item.title;
    if (new URL(item.href, location.href).pathname === currentPath) {
      link.setAttribute("aria-current", "page");
    }
    li.appendChild(link);
    list.appendChild(li);
  }

  nav.appendChild(list);
  document.body.insertBefore(nav, document.body.firstChild);

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    list.classList.toggle("is-open", !expanded);
  });
}

injectNav();


