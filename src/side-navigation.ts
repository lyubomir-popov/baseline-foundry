export interface SideNavigationInitOptions {
  root?: ParentNode;
}

const ROOT_SELECTOR = ".bf-side-navigation";
const DRAWER_SELECTOR = ".bf-side-navigation-drawer";
const OVERLAY_SELECTOR = ".bf-side-navigation-overlay";
const TOGGLE_SELECTOR = ".bf-side-navigation-toggle";
const EXPAND_SELECTOR = ".bf-side-navigation-expand, .bf-side-navigation-accordion-button";
const ITEM_SELECTOR = ".bf-side-navigation-item";
const LIST_SELECTOR = ".bf-side-navigation-list";
const LINK_SELECTOR = ".bf-side-navigation-link";
const TEXT_SELECTOR = ".bf-side-navigation-text";
const LARGE_BREAKPOINT = "(min-width: 64.75rem)";
const DRAWER_EXPANDED_CLASS = "is-drawer-expanded";
const DRAWER_COLLAPSED_CLASS = "is-drawer-collapsed";
const DRAWER_HIDDEN_CLASS = "is-drawer-hidden";

const lastTriggerByRoot = new WeakMap<HTMLElement, HTMLElement>();
const hideTimerByRoot = new WeakMap<HTMLElement, number>();

function queryAllWithinRoot<T extends Element>(root: ParentNode, selector: string): T[] {
  const elements = Array.from(root.querySelectorAll<T>(selector));

  if (root instanceof Element && root.matches(selector)) {
    elements.unshift(root as T);
  }

  return elements;
}

function getRootWindow(root: ParentNode): Window | null {
  if (root instanceof Document) {
    return root.defaultView;
  }

  return root.ownerDocument?.defaultView ?? null;
}

function getRoots(root: ParentNode): HTMLElement[] {
  return queryAllWithinRoot<HTMLElement>(root, ROOT_SELECTOR);
}

function getDrawer(sideNavigation: HTMLElement): HTMLElement | null {
  return sideNavigation.querySelector<HTMLElement>(DRAWER_SELECTOR);
}

function getOverlay(sideNavigation: HTMLElement): HTMLElement | null {
  return sideNavigation.querySelector<HTMLElement>(OVERLAY_SELECTOR);
}

function getToggles(sideNavigation: HTMLElement): HTMLElement[] {
  return Array.from(sideNavigation.querySelectorAll<HTMLElement>(TOGGLE_SELECTOR)).filter(toggle => {
    return !toggle.matches(EXPAND_SELECTOR);
  });
}

function isLargeViewport(target: HTMLElement): boolean {
  return target.ownerDocument.defaultView?.matchMedia(LARGE_BREAKPOINT).matches ?? false;
}

function isDrawerOpen(sideNavigation: HTMLElement): boolean {
  return sideNavigation.classList.contains(DRAWER_EXPANDED_CLASS);
}

function clearHideTimer(sideNavigation: HTMLElement): void {
  const timer = hideTimerByRoot.get(sideNavigation);
  if (timer !== undefined) {
    sideNavigation.ownerDocument.defaultView?.clearTimeout(timer);
    hideTimerByRoot.delete(sideNavigation);
  }
}

function updateDrawerA11y(sideNavigation: HTMLElement, expanded: boolean): void {
  for (const toggle of getToggles(sideNavigation)) {
    toggle.setAttribute("aria-expanded", String(expanded));
  }

  getDrawer(sideNavigation)?.setAttribute("aria-hidden", String(!expanded));
  getOverlay(sideNavigation)?.setAttribute("aria-hidden", String(!expanded));
}

function focusDrawer(sideNavigation: HTMLElement): void {
  const drawer = getDrawer(sideNavigation);
  if (!drawer) {
    return;
  }

  const focusTarget = drawer.querySelector<HTMLElement>(
    "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
  );

  if (focusTarget) {
    queueMicrotask(() => focusTarget.focus());
  }
}

function openDrawer(sideNavigation: HTMLElement, trigger?: HTMLElement): void {
  clearHideTimer(sideNavigation);
  sideNavigation.classList.remove(DRAWER_HIDDEN_CLASS, DRAWER_COLLAPSED_CLASS);
  sideNavigation.classList.add(DRAWER_EXPANDED_CLASS);
  updateDrawerA11y(sideNavigation, true);

  if (trigger) {
    lastTriggerByRoot.set(sideNavigation, trigger);
  }

  focusDrawer(sideNavigation);
}

function closeDrawer(sideNavigation: HTMLElement, restoreFocus: boolean): void {
  clearHideTimer(sideNavigation);
  sideNavigation.classList.remove(DRAWER_EXPANDED_CLASS);
  sideNavigation.classList.add(DRAWER_COLLAPSED_CLASS);
  updateDrawerA11y(sideNavigation, false);

  if (!isLargeViewport(sideNavigation)) {
    const timer = sideNavigation.ownerDocument.defaultView?.setTimeout(() => {
      if (!sideNavigation.classList.contains(DRAWER_EXPANDED_CLASS)) {
        sideNavigation.classList.add(DRAWER_HIDDEN_CLASS);
      }
    }, 180);

    if (timer !== undefined) {
      hideTimerByRoot.set(sideNavigation, timer);
    }
  }

  if (restoreFocus) {
    lastTriggerByRoot.get(sideNavigation)?.focus();
  }
}

function getImmediateNestedList(item: HTMLElement): HTMLElement | null {
  for (const child of Array.from(item.children)) {
    if (child instanceof HTMLElement && child.matches(LIST_SELECTOR)) {
      return child;
    }
  }

  return null;
}

function getImmediateLinkOrText(item: HTMLElement): HTMLElement | null {
  for (const child of Array.from(item.children)) {
    if (child instanceof HTMLElement && child.matches(`${LINK_SELECTOR}, ${TEXT_SELECTOR}`)) {
      return child;
    }
  }

  return null;
}

function syncExpandControl(toggle: HTMLElement): void {
  const item = toggle.closest<HTMLElement>(ITEM_SELECTOR);
  if (!item) {
    return;
  }

  const expanded = toggle.getAttribute("aria-expanded") === "true";
  const nestedList = getImmediateNestedList(item);
  const linkOrText = getImmediateLinkOrText(item);

  if (nestedList) {
    nestedList.setAttribute("aria-expanded", String(expanded));
    nestedList.setAttribute("aria-hidden", String(!expanded));
  }

  if (linkOrText && linkOrText.classList.contains("is-expandable")) {
    linkOrText.setAttribute("aria-expanded", String(expanded));
  }
}

function toggleExpand(toggle: HTMLElement): void {
  const expanded = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!expanded));
  syncExpandControl(toggle);
}

function syncInitialState(root: ParentNode): void {
  for (const sideNavigation of getRoots(root)) {
    const expanded = isDrawerOpen(sideNavigation);
    if (getDrawer(sideNavigation)) {
      if (isLargeViewport(sideNavigation)) {
        sideNavigation.classList.remove(DRAWER_HIDDEN_CLASS, DRAWER_COLLAPSED_CLASS);
      } else if (!expanded) {
        sideNavigation.classList.add(DRAWER_HIDDEN_CLASS);
      }

      updateDrawerA11y(sideNavigation, expanded && !sideNavigation.classList.contains(DRAWER_HIDDEN_CLASS));
    }

    for (const toggle of Array.from(sideNavigation.querySelectorAll<HTMLElement>(EXPAND_SELECTOR))) {
      if (!toggle.hasAttribute("aria-expanded")) {
        toggle.setAttribute("aria-expanded", "false");
      }

      syncExpandControl(toggle);
    }
  }
}

export function initSideNavigations(options: SideNavigationInitOptions = {}): () => void {
  const root = options.root ?? document;

  syncInitialState(root);

  const onClick = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const expandToggle = target.closest<HTMLElement>(EXPAND_SELECTOR);
    if (expandToggle) {
      event.preventDefault();
      toggleExpand(expandToggle);
      return;
    }

    const toggle = target.closest<HTMLElement>(TOGGLE_SELECTOR);
    if (toggle) {
      const sideNavigation = toggle.closest<HTMLElement>(ROOT_SELECTOR);
      if (!sideNavigation) {
        return;
      }

      event.preventDefault();

      if (isDrawerOpen(sideNavigation)) {
        closeDrawer(sideNavigation, false);
      } else {
        openDrawer(sideNavigation, toggle);
      }

      return;
    }

    const overlay = target.closest<HTMLElement>(OVERLAY_SELECTOR);
    if (overlay) {
      const sideNavigation = overlay.closest<HTMLElement>(ROOT_SELECTOR);
      if (sideNavigation) {
        event.preventDefault();
        closeDrawer(sideNavigation, true);
      }
    }
  };

  const onKeyDown = (event: Event): void => {
    if (!(event instanceof KeyboardEvent) || event.key !== "Escape") {
      return;
    }

    for (const sideNavigation of getRoots(root)) {
      if (isDrawerOpen(sideNavigation)) {
        closeDrawer(sideNavigation, true);
      }
    }
  };

  const onResize = (): void => {
    syncInitialState(root);
  };

  const rootWindow = getRootWindow(root);

  root.addEventListener("click", onClick);
  root.addEventListener("keydown", onKeyDown);
  rootWindow?.addEventListener("resize", onResize);

  return () => {
    root.removeEventListener("click", onClick);
    root.removeEventListener("keydown", onKeyDown);
    rootWindow?.removeEventListener("resize", onResize);
  };
}