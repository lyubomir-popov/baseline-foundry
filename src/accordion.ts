export interface AccordionInitOptions {
  root?: ParentNode;
}

const TAB_SELECTOR = ".bf-accordion__tab, .p-accordion__tab";

export function toggleAccordionButton(button: HTMLElement): void {
  const panelId = button.getAttribute("aria-controls");
  if (!panelId) {
    return;
  }

  const panel = button.ownerDocument.getElementById(panelId);
  if (!panel) {
    return;
  }

  const isOpen = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!isOpen));
  panel.setAttribute("aria-hidden", String(isOpen));
}

export function initAccordions(options: AccordionInitOptions = {}): () => void {
  const root = options.root ?? document;

  const onClick = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const button = target.closest<HTMLElement>(TAB_SELECTOR);
    if (!button) {
      return;
    }

    toggleAccordionButton(button);
  };

  root.addEventListener("click", onClick);

  return () => {
    root.removeEventListener("click", onClick);
  };
}
