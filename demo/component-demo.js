import { initAccordions, initBaselineGridToggles, initContextualMenus, initListTree, initRangeControls, initTabs, initTooltips } from "../dist/index.js?v=20260328-panel-refresh-10";

initBaselineGridToggles();
initContextualMenus();
initListTree();
initRangeControls();
initTabs();
initTooltips();
initAccordions();

const NAV_ITEMS = [
  { title: "Component atlas", href: "index.html" },
  null,
  { title: "Typography roles", href: "typography.html" },
  { title: "Prose flow", href: "prose.html" },
  { title: "Layout primitives", href: "layout.html" },
  { title: "Grid primitives", href: "grid.html" },
  { title: "Application shell", href: "application-shell.html" },
  null,
  { title: "Button", href: "button.html" },
  { title: "Text input", href: "text-input.html" },
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
  { title: "List tree", href: "list-tree.html" },
  { title: "Tabs", href: "tabs.html" },
  { title: "Accordion", href: "accordion.html" },
  { title: "Modal", href: "modal.html" },
  { title: "Segmented control", href: "segmented-control.html" },
  { title: "Breadcrumbs", href: "breadcrumbs.html" },
  { title: "Pagination", href: "pagination.html" },
  { title: "Contextual menu", href: "contextual-menu.html" },
  { title: "Tooltip", href: "tooltip.html" },
  { title: "Divider", href: "divider.html" },
  { title: "Cards", href: "cards.html" },
  null,
  { title: "Panel pressure test", href: "panel-pressure.html" },
  { title: "Editorial pressure test", href: "editorial-pressure.html" },
  { title: "Brand Layout Ops sample", href: "brand-layout-ops-sample.html" },
  null,
  { title: "Controls overview", href: "controls.html" },
  { title: "Surfaces overview", href: "surfaces-navigation.html" }
];

function injectNav() {
  const page = document.querySelector(".component-demo-page");
  if (!page) {
    return;
  }

  const current = location.pathname.split("/").pop() || "index.html";
  const nav = document.createElement("nav");
  nav.className = "component-demo-nav";
  nav.setAttribute("aria-label", "Component demos");

  const toggle = document.createElement("button");
  toggle.className = "component-demo-nav__toggle";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "component-demo-nav-list");
  toggle.textContent = "Nav";
  toggle.title = "Toggle navigation";
  nav.appendChild(toggle);

  const list = document.createElement("ul");
  list.id = "component-demo-nav-list";
  list.className = "component-demo-nav__list";

  for (const item of NAV_ITEMS) {
    if (item === null) {
      const separator = document.createElement("li");
      separator.className = "component-demo-nav__separator";
      separator.setAttribute("role", "separator");
      list.appendChild(separator);
      continue;
    }

    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = item.href;
    link.textContent = item.title;
    if (item.href === current) {
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


