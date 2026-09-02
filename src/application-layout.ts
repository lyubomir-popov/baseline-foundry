export interface ApplicationLayoutInitOptions {
  root?: ParentNode;
}

const APPLICATION_SELECTOR = ".bf-application";
const NAVIGATION_SELECTOR = ".bf-navigation";
const DRAWER_SELECTOR = ".bf-navigation-drawer";
const OVERLAY_SELECTOR = ".bf-navigation-overlay";
const TOGGLE_SELECTOR = "[data-application-layout-toggle]";
const CLOSE_SELECTOR = "[data-application-layout-close]";
const PIN_SELECTOR = "[data-application-layout-pin]";
const COLLAPSED_CLASS = "is-collapsed";
const PINNED_CLASS = "is-pinned";
const LARGE_BREAKPOINT = "(min-width: 48rem)";

const lastTriggerByNavigation = new WeakMap<HTMLElement, HTMLElement>();

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

function getNavigations(root: ParentNode): HTMLElement[] {
  return queryAllWithinRoot<HTMLElement>(root, NAVIGATION_SELECTOR);
}

function resolveNavigation(control: Element, root: ParentNode): HTMLElement | null {
  const controlsId = control.getAttribute("aria-controls");
  if (controlsId) {
    const navigation = root.querySelector<HTMLElement>(`#${CSS.escape(controlsId)}`);
    if (navigation?.matches(NAVIGATION_SELECTOR)) {
      return navigation;
    }
  }

  const application = control.closest<HTMLElement>(APPLICATION_SELECTOR);
  return application?.querySelector<HTMLElement>(NAVIGATION_SELECTOR) ?? null;
}

function getAssociatedControls(root: ParentNode, navigation: HTMLElement, selector: string): HTMLElement[] {
  return queryAllWithinRoot<HTMLElement>(root, selector).filter(control => {
    return resolveNavigation(control, root) === navigation;
  });
}

function getDrawer(navigation: HTMLElement): HTMLElement | null {
  return navigation.querySelector<HTMLElement>(DRAWER_SELECTOR);
}

function getOverlay(navigation: HTMLElement): HTMLElement | null {
  return navigation.querySelector<HTMLElement>(OVERLAY_SELECTOR);
}

function isLargeViewport(navigation: HTMLElement): boolean {
  return navigation.ownerDocument.defaultView?.matchMedia(LARGE_BREAKPOINT).matches ?? false;
}

function isExpanded(navigation: HTMLElement): boolean {
  return !navigation.classList.contains(COLLAPSED_CLASS);
}

function updateA11y(root: ParentNode, navigation: HTMLElement): void {
  const expanded = isExpanded(navigation);
  const largeViewport = isLargeViewport(navigation);

  for (const toggle of getAssociatedControls(root, navigation, TOGGLE_SELECTOR)) {
    toggle.setAttribute("aria-expanded", String(expanded));
  }

  for (const pinButton of getAssociatedControls(root, navigation, PIN_SELECTOR)) {
    pinButton.setAttribute("aria-pressed", String(navigation.classList.contains(PINNED_CLASS)));
  }

  getDrawer(navigation)?.setAttribute("aria-hidden", String(!expanded && !largeViewport));
  getOverlay(navigation)?.setAttribute("aria-hidden", String(!expanded || largeViewport));
}

function focusNavigation(navigation: HTMLElement): void {
  const drawer = getDrawer(navigation);
  if (!drawer) {
    return;
  }

  const focusTarget = drawer.querySelector<HTMLElement>(
    "[data-application-layout-close], [data-application-layout-pin], button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
  );

  if (focusTarget) {
    queueMicrotask(() => focusTarget.focus());
  }
}

function openNavigation(navigation: HTMLElement, root: ParentNode, trigger?: HTMLElement): void {
  navigation.classList.remove(COLLAPSED_CLASS);
  updateA11y(root, navigation);

  if (trigger) {
    lastTriggerByNavigation.set(navigation, trigger);
  }

  if (!isLargeViewport(navigation)) {
    focusNavigation(navigation);
  }
}

function closeNavigation(navigation: HTMLElement, root: ParentNode, restoreFocus: boolean): void {
  navigation.classList.add(COLLAPSED_CLASS);
  updateA11y(root, navigation);

  if (restoreFocus) {
    lastTriggerByNavigation.get(navigation)?.focus();
  }
}

function togglePin(navigation: HTMLElement, root: ParentNode): void {
  const pinned = navigation.classList.toggle(PINNED_CLASS);
  if (pinned) {
    navigation.classList.remove(COLLAPSED_CLASS);
  }

  updateA11y(root, navigation);
}

function syncInitialState(root: ParentNode): void {
  for (const navigation of getNavigations(root)) {
    if (navigation.classList.contains(PINNED_CLASS)) {
      navigation.classList.remove(COLLAPSED_CLASS);
    }

    updateA11y(root, navigation);
  }
}

export function initApplicationLayouts(options: ApplicationLayoutInitOptions = {}): () => void {
  const root = options.root ?? document;
  const rootWindow = getRootWindow(root);

  syncInitialState(root);

  const onClick = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const overlay = target.closest<HTMLElement>(OVERLAY_SELECTOR);
    if (overlay) {
      const navigation = overlay.closest<HTMLElement>(NAVIGATION_SELECTOR);
      if (navigation && isExpanded(navigation)) {
        event.preventDefault();
        closeNavigation(navigation, root, true);
      }
      return;
    }

    const pinButton = target.closest<HTMLElement>(PIN_SELECTOR);
    if (pinButton) {
      const navigation = resolveNavigation(pinButton, root);
      if (navigation) {
        event.preventDefault();
        togglePin(navigation, root);
      }
      return;
    }

    const closeButton = target.closest<HTMLElement>(CLOSE_SELECTOR);
    if (closeButton) {
      const navigation = resolveNavigation(closeButton, root);
      if (navigation) {
        event.preventDefault();
        closeNavigation(navigation, root, true);
      }
      return;
    }

    const toggle = target.closest<HTMLElement>(TOGGLE_SELECTOR);
    if (toggle) {
      const navigation = resolveNavigation(toggle, root);
      if (navigation) {
        event.preventDefault();
        if (isExpanded(navigation)) {
          closeNavigation(navigation, root, false);
        } else {
          openNavigation(navigation, root, toggle);
        }
      }
    }
  };

  const onKeyDown = (event: Event): void => {
    if (!(event instanceof KeyboardEvent) || event.key !== "Escape") {
      return;
    }

    for (const navigation of getNavigations(root)) {
      if (!isLargeViewport(navigation) && isExpanded(navigation)) {
        closeNavigation(navigation, root, true);
      }
    }
  };

  const onResize = (): void => {
    syncInitialState(root);
  };

  root.addEventListener("click", onClick);
  root.addEventListener("keydown", onKeyDown);
  rootWindow?.addEventListener("resize", onResize);

  return () => {
    root.removeEventListener("click", onClick);
    root.removeEventListener("keydown", onKeyDown);
    rootWindow?.removeEventListener("resize", onResize);
  };
}
