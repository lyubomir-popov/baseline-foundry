export interface BaselineGridInitOptions {
  defaultEnabled?: boolean;
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
  const defaultEnabled = options.defaultEnabled ?? false;
  const isEnabled = target.classList.contains(targetClassName) || (defaultEnabled && toggle.dataset.baselineDefault !== "off");

  target.classList.toggle(targetClassName, isEnabled);
  toggle.checked = isEnabled;

  toggle.addEventListener("change", () => {
    target.classList.toggle(targetClassName, toggle.checked);
  });
}

export function initBaselineGridToggles(options: BaselineGridInitOptions = {}): void {
  const toggleSelector = options.toggleSelector ?? ".js-baseline-toggle[aria-controls]";
  const toggles = document.querySelectorAll<HTMLInputElement>(toggleSelector);

  if (toggles.length > 0) {
    toggles.forEach(toggle => {
      setupBaselineGridToggle(toggle, options);
    });
  } else if (options.defaultEnabled) {
    // No toggle found; apply grid directly to body when default-on.
    const targetClassName = options.targetClassName ?? "u-baseline-grid";
    document.body.classList.add(targetClassName);
  }
}
