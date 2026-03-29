export interface ContextualMenuInitOptions {
  root?: ParentNode;
}

const TOGGLE_SELECTOR = ".vr-contextual-menu__toggle, .p-contextual-menu__toggle, .bf-contextual-menu-toggle";
const DROPDOWN_SELECTOR = ".vr-contextual-menu__dropdown, .p-contextual-menu__dropdown, .bf-contextual-menu-dropdown";
const MENU_SELECTOR = ".vr-contextual-menu, .p-contextual-menu, .bf-contextual-menu, .vr-contextual-menu--left, .p-contextual-menu--left, .bf-contextual-menu.is-left, .vr-contextual-menu--center, .p-contextual-menu--center, .bf-contextual-menu.is-center";
const LINK_SELECTOR = ".vr-contextual-menu__link, .p-contextual-menu__link, .bf-contextual-menu-link";

function queryAllWithinRoot<T extends Element>(root: ParentNode, selector: string): T[] {
  const elements = Array.from(root.querySelectorAll<T>(selector));

  if (root instanceof Element && root.matches(selector)) {
    elements.unshift(root as T);
  }

  return elements;
}

function getMenus(root: ParentNode): HTMLElement[] {
  return queryAllWithinRoot<HTMLElement>(root, MENU_SELECTOR);
}

function getToggle(menu: HTMLElement): HTMLElement | null {
  return menu.querySelector<HTMLElement>(TOGGLE_SELECTOR);
}

function getMenuItems(menu: HTMLElement): HTMLElement[] {
  return Array.from(menu.querySelectorAll<HTMLElement>(LINK_SELECTOR)).filter(item => {
    return !item.matches(".is-disabled, [aria-disabled='true']");
  });
}

function closeMenu(menu: HTMLElement, restoreFocus = false): void {
  const dropdown = menu.querySelector<HTMLElement>(DROPDOWN_SELECTOR);
  if (dropdown) {
    dropdown.setAttribute("aria-hidden", "true");
  }

  const toggle = getToggle(menu);
  if (toggle) {
    toggle.setAttribute("aria-expanded", "false");
  }

  if (restoreFocus && toggle) {
    toggle.focus();
  }
}

function openMenu(menu: HTMLElement, focusIndex?: number): void {
  const dropdown = menu.querySelector<HTMLElement>(DROPDOWN_SELECTOR);
  if (dropdown) {
    dropdown.setAttribute("aria-hidden", "false");
  }

  const toggle = getToggle(menu);
  if (toggle) {
    toggle.setAttribute("aria-expanded", "true");
  }

  if (focusIndex !== undefined) {
    const items = getMenuItems(menu);
    items[focusIndex]?.focus();
  }
}

function isMenuOpen(menu: HTMLElement): boolean {
  const dropdown = menu.querySelector<HTMLElement>(DROPDOWN_SELECTOR);
  return dropdown?.getAttribute("aria-hidden") !== "true";
}

export function initContextualMenus(options: ContextualMenuInitOptions = {}): () => void {
  const root = options.root ?? document;

  const onClick = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const toggle = target.closest<HTMLElement>(TOGGLE_SELECTOR);
    if (toggle) {
      const menu = toggle.closest<HTMLElement>(MENU_SELECTOR);
      if (menu) {
        if (isMenuOpen(menu)) {
          closeMenu(menu);
        } else {
          for (const otherMenu of getMenus(root)) {
            if (otherMenu !== menu && isMenuOpen(otherMenu)) {
              closeMenu(otherMenu);
            }
          }

          openMenu(menu);
        }
      }

      event.stopPropagation();
      return;
    }

    const link = target.closest<HTMLElement>(LINK_SELECTOR);
    if (link) {
      const menu = link.closest<HTMLElement>(MENU_SELECTOR);
      if (menu) {
        closeMenu(menu);
      }
      return;
    }

    for (const menu of getMenus(root)) {
      if (isMenuOpen(menu) && !menu.contains(target)) {
        closeMenu(menu);
      }
    }
  };

  const onKeyDown = (event: Event): void => {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const menu = target.closest<HTMLElement>(MENU_SELECTOR);
    const toggle = target.closest<HTMLElement>(TOGGLE_SELECTOR);
    const link = target.closest<HTMLElement>(LINK_SELECTOR);

    if (event.key === "Escape") {
      for (const openMenuElement of getMenus(root)) {
        if (isMenuOpen(openMenuElement)) {
          closeMenu(openMenuElement, true);
        }
      }
      return;
    }

    if (toggle && menu) {
      if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
        event.preventDefault();
        openMenu(menu, 0);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        const items = getMenuItems(menu);
        openMenu(menu, items.length - 1);
        return;
      }
    }

    if (link && menu && isMenuOpen(menu)) {
      const items = getMenuItems(menu);
      const index = items.indexOf(link);
      if (index === -1) {
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        items[(index + 1) % items.length]?.focus();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        items[(index - 1 + items.length) % items.length]?.focus();
      } else if (event.key === "Home") {
        event.preventDefault();
        items[0]?.focus();
      } else if (event.key === "End") {
        event.preventDefault();
        items[items.length - 1]?.focus();
      }
    }
  };

  root.addEventListener("click", onClick);
  root.addEventListener("keydown", onKeyDown);

  return () => {
    root.removeEventListener("click", onClick);
    root.removeEventListener("keydown", onKeyDown);
  };
}
