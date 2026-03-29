export interface BaselineGridInitOptions {
  defaultEnabled?: boolean;
  toggleSelector?: string;
  targetClassName?: string;
}

function isDarkTone(element: Element | null): boolean {
  if (!(element instanceof HTMLElement)) {
    return false;
  }

  const tone = element.getAttribute("data-bf-tone");
  return tone === "dark" || element.classList.contains("is-dark");
}

function getThemeRoot(toggle: HTMLInputElement, target: HTMLElement): HTMLElement | null {
  const toggleThemeRoot = toggle.closest<HTMLElement>("[data-bf-tone], .bf-theme, .vr-theme");
  if (toggleThemeRoot) {
    return toggleThemeRoot;
  }

  const targetThemeRoot = target.closest<HTMLElement>("[data-bf-tone], .bf-theme, .vr-theme");
  if (targetThemeRoot) {
    return targetThemeRoot;
  }

  return document.querySelector<HTMLElement>("[data-bf-tone], .bf-theme, .vr-theme");
}

function syncBaselineGridColor(toggle: HTMLInputElement, target: HTMLElement): void {
  const themeRoot = getThemeRoot(toggle, target);
  const gridColor = isDarkTone(themeRoot) ? "rgba(255, 255, 255, 0.16)" : "rgba(20, 22, 28, 0.12)";

  target.style.setProperty("--bf-baseline-grid-color", gridColor);
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
  syncBaselineGridColor(toggle, target);

  toggle.addEventListener("change", () => {
    syncBaselineGridColor(toggle, target);
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
