export interface TabsInitOptions {
  root?: ParentNode;
}

const TAB_SELECTOR = ".bf-tabs-link";
const PANEL_SELECTOR = ".bf-tabs-panel";
const LIST_SELECTOR = ".bf-tabs-list";

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
  const doc = root instanceof Document ? root : root.ownerDocument ?? document;
  const win = doc.defaultView;
  const equalLists = Array.from(root.querySelectorAll<HTMLElement>(".bf-tabs.is-equal .bf-tabs-list"));
  let disposed = false;
  let frame = 0;

  const updateEqualClosures = (): void => {
    frame = 0;
    for (const list of equalLists) {
      if (!list.isConnected) continue;
      const probe = doc.createElement("i");
      probe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;block-size:var(--bf-baseline);";
      list.append(probe);
      const baseline = probe.getBoundingClientRect().height;
      probe.remove();
      if (baseline <= 0) continue;
      const height = list.getBoundingClientRect().height;
      const remainder = height % baseline;
      const closure = remainder <= 0.01 || baseline - remainder <= 0.01 ? 0 : baseline - remainder;
      const rootSize = Number.parseFloat(win?.getComputedStyle(doc.documentElement).fontSize ?? "16");
      list.style.setProperty("--bf-tabs-equal-closure", `${closure / rootSize}rem`);
    }
  };
  const scheduleEqualClosures = (): void => {
    if (disposed || !win || frame) return;
    frame = win.requestAnimationFrame(updateEqualClosures);
  };
  const resizeObserver = win && typeof win.ResizeObserver === "function"
    ? new win.ResizeObserver(scheduleEqualClosures) : null;
  for (const list of equalLists) resizeObserver?.observe(list);
  const tierObserver = new MutationObserver(scheduleEqualClosures);
  if (equalLists.length) {
    tierObserver.observe(doc.body, { attributes: true, attributeFilter: ["class", "data-bf-tier"] });
    win?.addEventListener("resize", scheduleEqualClosures, { passive: true });
    for (const link of doc.querySelectorAll("link[rel='stylesheet']")) link.addEventListener("load", scheduleEqualClosures);
    void doc.fonts?.ready.then(scheduleEqualClosures);
    scheduleEqualClosures();
  }

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
    disposed = true;
    if (win && frame) win.cancelAnimationFrame(frame);
    resizeObserver?.disconnect();
    tierObserver.disconnect();
    win?.removeEventListener("resize", scheduleEqualClosures);
    for (const link of doc.querySelectorAll("link[rel='stylesheet']")) link.removeEventListener("load", scheduleEqualClosures);
    for (const list of equalLists) list.style.removeProperty("--bf-tabs-equal-closure");
    root.removeEventListener("click", onClick);
    root.removeEventListener("keydown", onKeyDown);
  };
}
