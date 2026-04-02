import { initBaselineGridToggles, initSideNavigations } from "../dist/index.js";
import { ensureTargetId, injectPageChrome } from "./page-chrome.js";

const TIER_OPTIONS = [
  { value: "editorial", label: "Editorial" },
  { value: "documentation", label: "Docs" },
  { value: "app", label: "App" },
  { value: "os", label: "OS" }
];

const BUILT_IN_TIER_CLASSES = ["bf-tier-editorial", "bf-tier-documentation", "bf-tier-app", "bf-tier-os"];

function tierClassName(tierName) {
  return `bf-tier-${tierName}`;
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

function applyTier(tierName) {
  document.body.classList.remove(...BUILT_IN_TIER_CLASSES);
  document.body.classList.add("bf-theme", tierClassName(tierName));
  document.body.dataset.bfTier = tierName;
}

function detectTier() {
  if (document.body.classList.contains("bf-tier-os")) {
    return "os";
  }

  if (document.body.classList.contains("bf-tier-documentation")) {
    return "documentation";
  }

  if (document.body.classList.contains("bf-tier-app")) {
    return "app";
  }

  return "editorial";
}

export function initExamplePage() {
  const currentTier = document.body.dataset.bfTier ?? detectTier();
  const captureTarget = document.querySelector("[data-example-grid-target]") ?? document.body;
  const targetId = ensureTargetId(captureTarget, "example-grid-target");
  const controls = injectPageChrome({
    controls: {
      selectedTier: currentTier,
      showBaseline: true,
      showTone: true,
      tierOptions: TIER_OPTIONS
    },
    currentPath: window.location.pathname
  });

  if (!(controls.baselineToggle instanceof HTMLInputElement) || !(controls.toneToggle instanceof HTMLInputElement) || !(controls.tierSelect instanceof HTMLSelectElement) || !targetId) {
    return;
  }

  controls.baselineToggle.setAttribute("aria-controls", targetId);
  controls.baselineToggle.dataset.baselineDefault = currentTier === "editorial" ? "on" : "off";
  initBaselineGridToggles({
    defaultEnabled: true,
    toggleSelector: "[data-page-chrome-baseline-toggle][aria-controls]"
  });

  controls.toneToggle.checked = currentTone() === "dark";
  controls.toneToggle.addEventListener("change", event => {
    const nextTone = event.currentTarget instanceof HTMLInputElement && event.currentTarget.checked ? "dark" : "light";
    applyTone(nextTone, controls.baselineToggle);
  });

  controls.tierSelect.addEventListener("change", event => {
    if (!(event.currentTarget instanceof HTMLSelectElement)) {
      return;
    }

    applyTier(event.currentTarget.value);
    if (event.currentTarget.value === "editorial") {
      controls.baselineToggle.checked = true;
      controls.baselineToggle.dispatchEvent(new Event("change"));
    }
  });

  initSideNavigations();
}

initExamplePage();
