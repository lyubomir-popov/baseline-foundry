export interface TabsInitOptions {
  root?: ParentNode;
}

const TAB_SELECTOR = ".bf-tabs-link, .p-tabs__link";
const PANEL_SELECTOR = ".bf-tabs-panel, .p-tabs__panel";
const LIST_SELECTOR = ".bf-tabs-list, .p-tabs__list";

function activateTab(tab: HTMLElement): void {
  const list = tab.closest<HTMLElement>(LIST_SELECTOR);
  if (!list) {
    return;
  }

  const siblings = Array.from(list.querySelectorAll<HTMLElement>(TAB_SELECTOR));
  for (const sibling of siblings) {
    sibling.setAttribute("aria-selected", "false");
    sibling.setAttribute("tabindex", "-1");
    const panelId = sibling.getAttribute("aria-controls");
    if (panelId) {
      const panel = sibling.ownerDocument.getElementById(panelId);
      if (panel?.matches(PANEL_SELECTOR)) {
        panel.setAttribute("aria-hidden", "true");
      }
    }
  }

  tab.setAttribute("aria-selected", "true");
  tab.setAttribute("tabindex", "0");
  const panelId = tab.getAttribute("aria-controls");
  if (panelId) {
    const panel = tab.ownerDocument.getElementById(panelId);
    if (panel?.matches(PANEL_SELECTOR)) {
      panel.setAttribute("aria-hidden", "false");
    }
  }
}

export function initTabs(options: TabsInitOptions = {}): () => void {
  const root = options.root ?? document;

  const onClick = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const tab = target.closest<HTMLElement>(TAB_SELECTOR);
    if (!tab) {
      return;
    }

    event.preventDefault();
    activateTab(tab);
  };

  const onKeyDown = (event: Event): void => {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const tab = target.closest<HTMLElement>(TAB_SELECTOR);
    if (!tab) {
      return;
    }

    const list = tab.closest<HTMLElement>(LIST_SELECTOR);
    if (!list) {
      return;
    }

    const tabs = Array.from(list.querySelectorAll<HTMLElement>(TAB_SELECTOR));
    const index = tabs.indexOf(tab);
    let nextIndex = -1;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % tabs.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex >= 0) {
      event.preventDefault();
      activateTab(tabs[nextIndex]);
      tabs[nextIndex].focus();
    }
  };

  root.addEventListener("click", onClick);
  root.addEventListener("keydown", onKeyDown);

  return () => {
    root.removeEventListener("click", onClick);
    root.removeEventListener("keydown", onKeyDown);
  };
}
