export interface InPageNavigationInitOptions {
  root?: ParentNode;
  observeCurrent?: boolean;
  expandLabel?: string;
  collapseLabel?: string;
}

const ROOT_SELECTOR = ".bf-in-page-navigation";
const TOGGLE_SELECTOR = ".bf-in-page-navigation-toggle[aria-controls]";
const LIST_SELECTOR = ".bf-in-page-navigation-list";
const LINK_SELECTOR = ".bf-in-page-navigation-link[href^='#']";

function closestElement(target: EventTarget | null, selector: string): HTMLElement | null {
  return target instanceof Element ? target.closest<HTMLElement>(selector) : null;
}

function controlledList(toggle: HTMLButtonElement): HTMLElement | null {
  const controlledId = toggle.getAttribute("aria-controls");
  const list = controlledId ? toggle.ownerDocument.getElementById(controlledId) : null;
  const navigation = toggle.closest<HTMLElement>(ROOT_SELECTOR);
  return list?.matches(LIST_SELECTOR) && navigation?.contains(list) ? list : null;
}

function stateLabel(toggle: HTMLButtonElement, expanded: boolean, options: InPageNavigationInitOptions): string {
  const attribute = expanded ? "data-bf-collapse-label" : "data-bf-expand-label";
  return toggle.getAttribute(attribute)?.trim()
    || (expanded ? options.collapseLabel ?? "Collapse in-page navigation" : options.expandLabel ?? "Expand in-page navigation");
}

function syncToggle(toggle: HTMLButtonElement, expanded: boolean, options: InPageNavigationInitOptions): void {
  const navigation = toggle.closest<HTMLElement>(ROOT_SELECTOR);
  const list = controlledList(toggle);
  if (!navigation || !list) return;

  navigation.classList.toggle("is-expanded", expanded);
  toggle.setAttribute("aria-expanded", String(expanded));
  toggle.setAttribute("aria-label", stateLabel(toggle, expanded, options));
  list.setAttribute("aria-expanded", String(expanded));

  const icon = toggle.querySelector<HTMLElement>(".bf-icon");
  icon?.classList.toggle("is-chevron-down", !expanded);
  icon?.classList.toggle("is-chevron-up", expanded);

  if (!expanded) {
    navigation.querySelector<HTMLElement>(`${LINK_SELECTOR}[aria-current]`)?.scrollIntoView({
      block: "nearest",
      inline: "nearest"
    });
  }
}

function setCurrentLink(navigation: HTMLElement, activeLink: HTMLAnchorElement): void {
  for (const link of Array.from(navigation.querySelectorAll<HTMLAnchorElement>(LINK_SELECTOR))) {
    if (link === activeLink) {
      link.setAttribute("aria-current", "location");
      link.classList.add("is-active");
    } else {
      link.removeAttribute("aria-current");
      link.classList.remove("is-active");
    }
  }
}

function currentObservers(root: ParentNode): Array<IntersectionObserver> {
  if (typeof IntersectionObserver === "undefined") return [];

  const observers: Array<IntersectionObserver> = [];
  for (const navigation of Array.from(root.querySelectorAll<HTMLElement>(ROOT_SELECTOR))) {
    const linksByTarget = new Map<Element, HTMLAnchorElement>();
    for (const link of Array.from(navigation.querySelectorAll<HTMLAnchorElement>(LINK_SELECTOR))) {
      let targetId = link.hash.slice(1);
      try {
        targetId = decodeURIComponent(targetId);
      } catch {
        continue;
      }
      const target = targetId ? link.ownerDocument.getElementById(targetId) : null;
      if (target) linksByTarget.set(target, link);
    }
    if (linksByTarget.size === 0) continue;

    const visible = new Map<Element, number>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.set(entry.target, entry.boundingClientRect.top);
        else visible.delete(entry.target);
      }
      const nearest = Array.from(visible.entries()).sort((a, b) => Math.abs(a[1]) - Math.abs(b[1]))[0];
      const activeLink = nearest ? linksByTarget.get(nearest[0]) : null;
      if (activeLink) setCurrentLink(navigation, activeLink);
    }, {
      rootMargin: "-10% 0rem -60% 0rem",
      threshold: [0, 0.5]
    });

    for (const target of linksByTarget.keys()) observer.observe(target);
    observers.push(observer);
  }
  return observers;
}

export function initInPageNavigations(options: InPageNavigationInitOptions = {}): () => void {
  const root = options.root ?? document;

  for (const toggle of Array.from(root.querySelectorAll<HTMLButtonElement>(TOGGLE_SELECTOR))) {
    if (controlledList(toggle)) {
      syncToggle(toggle, toggle.getAttribute("aria-expanded") === "true", options);
    }
  }

  const observers = options.observeCurrent === false ? [] : currentObservers(root);

  const onClick = (event: Event): void => {
    const toggle = closestElement(event.target, TOGGLE_SELECTOR) as HTMLButtonElement | null;
    if (toggle && root.contains(toggle) && controlledList(toggle)) {
      event.preventDefault();
      syncToggle(toggle, toggle.getAttribute("aria-expanded") !== "true", options);
      return;
    }

    const link = closestElement(event.target, LINK_SELECTOR) as HTMLAnchorElement | null;
    const navigation = link?.closest<HTMLElement>(ROOT_SELECTOR);
    if (link && navigation && root.contains(navigation)) {
      setCurrentLink(navigation, link);
      const navigationToggle = navigation.querySelector<HTMLButtonElement>(TOGGLE_SELECTOR);
      if (navigationToggle?.getAttribute("aria-expanded") === "true") {
        syncToggle(navigationToggle, false, options);
      }
    }
  };

  const onKeyDown = (event: Event): void => {
    if (!(event instanceof KeyboardEvent) || event.key !== "Escape") return;
    const navigation = closestElement(event.target, ROOT_SELECTOR);
    const toggle = navigation?.querySelector<HTMLButtonElement>(TOGGLE_SELECTOR);
    if (!toggle || toggle.getAttribute("aria-expanded") !== "true") return;
    event.preventDefault();
    syncToggle(toggle, false, options);
    toggle.focus();
  };

  root.addEventListener("click", onClick);
  root.addEventListener("keydown", onKeyDown);

  return () => {
    root.removeEventListener("click", onClick);
    root.removeEventListener("keydown", onKeyDown);
    for (const observer of observers) observer.disconnect();
  };
}
