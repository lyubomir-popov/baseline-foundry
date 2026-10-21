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
  const allLists = Array.from(root.querySelectorAll<HTMLElement>(LIST_SELECTOR));
  const equalLists = Array.from(root.querySelectorAll<HTMLElement>(".bf-tabs.is-equal .bf-tabs-list"));
  const hasEligibleStaticChip = (list: HTMLElement): boolean => {
    const productRoot = list.closest(".bf-theme");
    return Array.from(list.querySelectorAll<HTMLElement>("span.bf-chip:not([role='button']):not(:has(.bf-chip-dismiss))")).some(chip =>
      chip.closest(LIST_SELECTOR) === list &&
      chip.closest(TAB_SELECTOR)?.closest(LIST_SELECTOR) === list &&
      chip.closest(".bf-theme") === productRoot
    );
  };
  let disposed = false;
  let frame = 0;

  const updateMeasuredClosures = (): void => {
    frame = 0;
    for (const list of allLists) {
      if (!list.isConnected) continue;
      const staticChip = hasEligibleStaticChip(list);
      if (!staticChip && !equalLists.includes(list)) {
        list.style.removeProperty("--_bf-tabs-static-closure");
        list.style.removeProperty("--_bf-tabs-row-align");
        continue;
      }
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
      const value = `${closure / rootSize}rem`;
      if (equalLists.includes(list)) list.style.setProperty("--bf-tabs-equal-closure", value);
      if (staticChip) {
        list.style.setProperty("--_bf-tabs-static-closure", value);
        list.style.setProperty("--_bf-tabs-row-align", "baseline");
      } else {
        list.style.removeProperty("--_bf-tabs-static-closure");
        list.style.removeProperty("--_bf-tabs-row-align");
      }
    }
  };
  const scheduleMeasuredClosures = (): void => {
    if (disposed || !win || frame) return;
    frame = win.requestAnimationFrame(updateMeasuredClosures);
  };
  const resizeObserver = win && typeof win.ResizeObserver === "function"
    ? new win.ResizeObserver(scheduleMeasuredClosures) : null;
  for (const list of allLists) resizeObserver?.observe(list);
  const tierObserver = new MutationObserver(scheduleMeasuredClosures);
  const membershipObserver = new MutationObserver(mutations => {
    const changesStaticChipMembership = mutations.some(mutation =>
      [...mutation.addedNodes, ...mutation.removedNodes].some(node =>
        node instanceof Element &&
        (node.matches("span.bf-chip") || node.querySelector("span.bf-chip"))
      )
    );
    if (changesStaticChipMembership) scheduleMeasuredClosures();
  });
  if (allLists.length) {
    tierObserver.observe(doc.body, { attributes: true, attributeFilter: ["class", "data-bf-tier"] });
    for (const list of allLists) membershipObserver.observe(list, { childList: true, subtree: true });
    win?.addEventListener("resize", scheduleMeasuredClosures, { passive: true });
    for (const link of doc.querySelectorAll("link[rel='stylesheet']")) link.addEventListener("load", scheduleMeasuredClosures);
    void doc.fonts?.ready.then(scheduleMeasuredClosures);
    scheduleMeasuredClosures();
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
    membershipObserver.disconnect();
    win?.removeEventListener("resize", scheduleMeasuredClosures);
    for (const link of doc.querySelectorAll("link[rel='stylesheet']")) link.removeEventListener("load", scheduleMeasuredClosures);
    for (const list of equalLists) list.style.removeProperty("--bf-tabs-equal-closure");
    for (const list of allLists) {
      list.style.removeProperty("--_bf-tabs-static-closure");
      list.style.removeProperty("--_bf-tabs-row-align");
    }
    root.removeEventListener("click", onClick);
    root.removeEventListener("keydown", onKeyDown);
  };
}
