export interface TooltipInitOptions {
  root?: ParentNode;
}

const TOOLTIP_SELECTOR = ".vr-tooltip, .p-tooltip, .bf-tooltip, [class*='p-tooltip--'], [class*='vr-tooltip--'], [class*='bf-tooltip--']";
const MESSAGE_SELECTOR = ".vr-tooltip__message, .p-tooltip__message, .bf-tooltip__message";

export function initTooltips(options: TooltipInitOptions = {}): () => void {
  const root = options.root ?? document;

  const isWithinTooltip = (tooltip: HTMLElement, relatedTarget: EventTarget | null): boolean => {
    return relatedTarget instanceof Node && tooltip.contains(relatedTarget);
  };

  const show = (tooltip: HTMLElement): void => {
    const message = tooltip.querySelector<HTMLElement>(MESSAGE_SELECTOR);
    if (message) {
      message.setAttribute("aria-hidden", "false");
    }
  };

  const hide = (tooltip: HTMLElement): void => {
    const message = tooltip.querySelector<HTMLElement>(MESSAGE_SELECTOR);
    if (message) {
      message.setAttribute("aria-hidden", "true");
    }
  };

  const onFocusIn = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const tooltip = target.closest<HTMLElement>(TOOLTIP_SELECTOR);
    if (tooltip) {
      show(tooltip);
    }
  };

  const onFocusOut = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const tooltip = target.closest<HTMLElement>(TOOLTIP_SELECTOR);
    if (tooltip && !isWithinTooltip(tooltip, (event as FocusEvent).relatedTarget)) {
      hide(tooltip);
    }
  };

  const onMouseOver = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const tooltip = target.closest<HTMLElement>(TOOLTIP_SELECTOR);
    if (tooltip) {
      show(tooltip);
    }
  };

  const onMouseOut = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const tooltip = target.closest<HTMLElement>(TOOLTIP_SELECTOR);
    if (tooltip && !isWithinTooltip(tooltip, (event as MouseEvent).relatedTarget)) {
      hide(tooltip);
    }
  };

  root.addEventListener("focusin", onFocusIn);
  root.addEventListener("focusout", onFocusOut);
  root.addEventListener("mouseover", onMouseOver);
  root.addEventListener("mouseout", onMouseOut);

  return () => {
    root.removeEventListener("focusin", onFocusIn);
    root.removeEventListener("focusout", onFocusOut);
    root.removeEventListener("mouseover", onMouseOver);
    root.removeEventListener("mouseout", onMouseOut);
  };
}
