import { initAccordions, initApplicationLayouts, initBaselineGridToggles, initCodeSnippets, initContextualMenus, initListTree, initPanelDrawers, initRangeControls, initResizableAsides, initSideNavigations, initTabs, initTooltips, initTopNavigations } from "../dist/index.js";
import { ensureTargetId, injectPageChrome } from "./page-chrome.js";

const SURFACE_OPTIONS = [
  { value: "editorial", label: "Editorial" },
  { value: "documentation", label: "Docs" },
  { value: "app", label: "App" },
  { value: "panel", label: "Panel" }
];

function resolveStylesheetLink() {
  return Array.from(document.querySelectorAll("link[rel='stylesheet']")).find(link => {
    if (!(link instanceof HTMLLinkElement)) {
      return false;
    }

    try {
      const pathname = new URL(link.href, window.location.href).pathname;
      return /\/dist\/(?:.+\/)?styles\.css$/i.test(pathname);
    } catch {
      return false;
    }
  });
}

function detectSurface(stylesheetLink) {
  if (document.body.classList.contains("bf-tier-documentation")) {
    return "documentation";
  }

  if (document.body.classList.contains("bf-tier-app")) {
    return "app";
  }

  return "editorial";
}

function surfaceHref(surface) {
  if (surface === "panel") {
    return "/dist/presets/panel/styles.css";
  }
  return "/dist/tiers/editorial/styles.css";
}

function applySurface(surface, stylesheetLink) {
  stylesheetLink.href = surfaceHref(surface);
  document.body.classList.remove("bf-tier-editorial", "bf-tier-documentation", "bf-tier-app");
  document.body.classList.add("bf-theme");

  if (surface === "editorial" || surface === "documentation" || surface === "app") {
    document.body.classList.add(`bf-tier-${surface}`);
    document.body.dataset.bfTier = surface;
  } else {
    delete document.body.dataset.bfTier;
  }
}

function currentTone() {
  return document.body.classList.contains("is-dark") ? "dark" : "light";
}

function applyTone(tone, baselineToggle) {
  document.body.classList.toggle("is-dark", tone === "dark");
  document.body.classList.toggle("is-light", tone === "light");
  document.documentElement.style.colorScheme = tone;

  if (baselineToggle instanceof HTMLInputElement) {
    baselineToggle.dispatchEvent(new Event("change"));
  }
}

function baselineShouldDefaultToOn(surface) {
  return surface === "editorial";
}

const stylesheetLink = resolveStylesheetLink();

if (!(stylesheetLink instanceof HTMLLinkElement)) {
  throw new Error("Unable to find the component page stylesheet link.");
}

const initialSurface = detectSurface(stylesheetLink);
applySurface(initialSurface, stylesheetLink);
const chrome = injectPageChrome({
  controls: {
    selectedTier: initialSurface,
    showBaseline: true,
    showTone: true,
    tierAriaLabel: "Surface",
    tierOptions: SURFACE_OPTIONS
  },
  currentPath: window.location.pathname,
  wrapBodyContent: true
});

let captureTarget = document.querySelector("[data-component-capture]") ?? document.body;
if (captureTarget === document.body && chrome.contentWrapper instanceof HTMLElement) {
  document.body.removeAttribute("data-component-capture");
  chrome.contentWrapper.setAttribute("data-component-capture", "");
  captureTarget = chrome.contentWrapper;
}

const captureTargetId = ensureTargetId(captureTarget, "component-grid-target");

let baselineMode = "auto";

if (chrome.baselineToggle instanceof HTMLInputElement && captureTargetId) {
  chrome.baselineToggle.setAttribute("aria-controls", captureTargetId);
  chrome.baselineToggle.dataset.baselineDefault = baselineShouldDefaultToOn(initialSurface) ? "on" : "off";
}

initBaselineGridToggles({
  defaultEnabled: true,
  toggleSelector: "[data-page-chrome-baseline-toggle][aria-controls]"
});

if (chrome.toneToggle instanceof HTMLInputElement) {
  chrome.toneToggle.checked = currentTone() === "dark";
  chrome.toneToggle.addEventListener("change", event => {
    const nextTone = event.currentTarget instanceof HTMLInputElement && event.currentTarget.checked ? "dark" : "light";
    applyTone(nextTone, chrome.baselineToggle);
  });
}

if (chrome.baselineToggle instanceof HTMLInputElement) {
  chrome.baselineToggle.addEventListener("change", () => {
    baselineMode = "manual";
  });
}

if (chrome.tierSelect instanceof HTMLSelectElement) {
  chrome.tierSelect.addEventListener("change", event => {
    if (!(event.currentTarget instanceof HTMLSelectElement)) {
      return;
    }

    const nextSurface = event.currentTarget.value;
    applySurface(nextSurface, stylesheetLink);

    if (chrome.baselineToggle instanceof HTMLInputElement && baselineMode === "auto") {
      chrome.baselineToggle.checked = baselineShouldDefaultToOn(nextSurface);
      chrome.baselineToggle.dispatchEvent(new Event("change"));
    }
  });
}

initApplicationLayouts();
initCodeSnippets();
initContextualMenus();
initListTree();
initPanelDrawers();
initRangeControls();
initResizableAsides();
initSideNavigations();
initTopNavigations();
initTabs();
initTooltips();
initAccordions();



