export interface ListTreeInitOptions {
  root?: ParentNode;
}

const TOGGLE_SELECTOR = ".bf-list-tree-toggle";
const ITEM_SELECTOR = ".bf-list-tree-item";
const LIST_SELECTOR = ".bf-list-tree";

function getNestedList(item: HTMLElement, toggle: HTMLElement): HTMLElement | null {
  const listId = toggle.getAttribute("aria-controls");
  if (listId) {
    return toggle.ownerDocument.getElementById(listId);
  }

  for (const child of Array.from(item.children)) {
    if (child instanceof HTMLElement && child.matches(LIST_SELECTOR)) {
      return child;
    }
  }

  return null;
}

export function initListTree(options: ListTreeInitOptions = {}): () => void {
  const root = options.root ?? document;

  const onClick = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const toggle = target.closest<HTMLElement>(TOGGLE_SELECTOR);
    if (!toggle) {
      return;
    }

    const item = toggle.closest<HTMLElement>(ITEM_SELECTOR);
    if (!item) {
      return;
    }

    const isExpanded = toggle.getAttribute("aria-expanded") === "true" || item.getAttribute("aria-expanded") === "true";
    const nextExpanded = String(!isExpanded);
    item.setAttribute("aria-expanded", nextExpanded);
    toggle.setAttribute("aria-expanded", nextExpanded);

    const nestedList = getNestedList(item, toggle);
    if (nestedList) {
      nestedList.setAttribute("aria-hidden", String(isExpanded));
    }
  };

  root.addEventListener("click", onClick);

  return () => {
    root.removeEventListener("click", onClick);
  };
}
