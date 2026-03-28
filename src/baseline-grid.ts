export interface BaselineGridInitOptions {
  toggleSelector?: string;
  targetClassName?: string;
}

function getTargetElement(toggle: HTMLInputElement): HTMLElement | null {
  const targetId = toggle.getAttribute("aria-controls");
  if (!targetId) {
    return null;
  }

  return document.getElementById(targetId);
}

export function setupBaselineGridToggle(toggle: HTMLInputElement, options: BaselineGridInitOptions = {}): void {
  const target = getTargetElement(toggle);
  if (!target) {
    return;
  }

  const targetClassName = options.targetClassName ?? "u-baseline-grid";
  toggle.checked = target.classList.contains(targetClassName);

  toggle.addEventListener("change", () => {
    target.classList.toggle(targetClassName, toggle.checked);
  });
}

export function initBaselineGridToggles(options: BaselineGridInitOptions = {}): void {
  const toggleSelector = options.toggleSelector ?? ".js-baseline-toggle[aria-controls]";
  const toggles = document.querySelectorAll<HTMLInputElement>(toggleSelector);

  toggles.forEach(toggle => {
    setupBaselineGridToggle(toggle, options);
  });
}