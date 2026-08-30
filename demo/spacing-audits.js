import { initTabs } from "../dist/index.js";

const auditPanels = document.querySelectorAll("[data-spacing-audit-source]");

initTabs({
  root: document.querySelector("[data-spacing-audit-tabs]") ?? document
});

async function loadAuditPanel(panel) {
  const source = panel.dataset.spacingAuditSource;
  if (!source) return;

  const response = await fetch(source);
  if (!response.ok) {
    throw new Error(`Unable to load spacing audit: ${response.status}`);
  }

  const sourceDocument = new DOMParser().parseFromString(
    await response.text(),
    "text/html"
  );
  const sourceStack = sourceDocument.querySelector("main > .bf-stack");
  const sourceHeader = sourceStack?.querySelector(":scope > header");
  const sourceSections = sourceStack?.querySelectorAll(":scope > section");
  if (!sourceHeader || !sourceSections?.length) {
    throw new Error(
      `Spacing audit source is missing its expected structure: ${source}`
    );
  }

  const introduction = sourceHeader.querySelector("p");
  const content = document.createElement("div");
  content.className = `${sourceStack.className} spacing-audit-panel-content`;
  if (introduction) content.append(document.importNode(introduction, true));
  for (const section of sourceSections) {
    content.append(document.importNode(section, true));
  }
  panel.replaceChildren(content);
}

function selectInitialAuditTab() {
  const axis = window.location.hash === "#vertical" ? "vertical" : "horizontal";
  for (const tab of document.querySelectorAll(
    "[data-spacing-audit-tabs] [role='tab']"
  )) {
    const isSelected =
      tab.getAttribute("aria-controls") === `spacing-${axis}-panel`;
    tab.setAttribute("aria-selected", String(isSelected));
    tab.setAttribute("tabindex", isSelected ? "0" : "-1");
  }
  for (const panel of document.querySelectorAll("[data-spacing-audit-panel]")) {
    panel.setAttribute(
      "aria-hidden",
      String(panel.dataset.spacingAuditPanel !== axis)
    );
  }
}

document.addEventListener("click", event => {
  const tab = event.target?.closest?.("[data-spacing-audit-tabs] [role='tab']");
  const panelId = tab?.getAttribute("aria-controls");
  if (!panelId) return;
  const axis = panelId === "spacing-vertical-panel" ? "vertical" : "horizontal";
  history.replaceState(null, "", `#${axis}`);
});

selectInitialAuditTab();

Promise.all(Array.from(auditPanels, loadAuditPanel))
  .then(() => {
    selectInitialAuditTab();
    document.dispatchEvent(new CustomEvent("bf:spacing-audits-ready"));
  })
  .catch(error => {
    console.error(error);
  });
