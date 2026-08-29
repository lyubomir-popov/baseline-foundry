import { initApplicationLayouts, initBaselineGridToggles, initPanelDrawers, initSideNavigations } from "../dist/index.js";
import { ensureTargetId, injectPageChrome } from "./page-chrome.js";
import { readStoredBaseline, readStoredTier, readStoredTone, storeBaseline, storeTier, storeTone } from "./page-chrome-storage.js";

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
  // Resolve initial tier: page-author default > stored preference > detected from body classes.
  const supportedTierValues = TIER_OPTIONS.map(o => o.value);
  const pageTierDefault = document.body.dataset.pageTierDefault;
  const storedTier = readStoredTier();
  const detectedTier = document.body.dataset.bfTier ?? detectTier();
  const currentTier =
    (pageTierDefault && supportedTierValues.includes(pageTierDefault))
      ? pageTierDefault
      : (storedTier && supportedTierValues.includes(storedTier))
      ? storedTier
      : detectedTier;

  applyTier(currentTier);

  // Apply stored tone before chrome injection.
  const storedTone = readStoredTone();
  if (storedTone === "dark" || storedTone === "light") {
    document.body.classList.toggle("is-dark", storedTone === "dark");
    document.body.classList.toggle("is-light", storedTone !== "dark");
    document.documentElement.style.colorScheme = storedTone;
  }

  const targetId = ensureTargetId(document.body, "example-page");
  const controls = injectPageChrome({
    controls: {
      selectedTier: currentTier,
      showBaseline: true,
      showTone: true,
      tierOptions: TIER_OPTIONS
    },
    currentPath: window.location.pathname,
    wrapBodyContent: true
  });

  if (!(controls.baselineToggle instanceof HTMLInputElement) || !(controls.toneToggle instanceof HTMLInputElement) || !(controls.tierSelect instanceof HTMLSelectElement) || !targetId) {
    return;
  }

  controls.baselineToggle.setAttribute("aria-controls", targetId);
  const storedBaseline = readStoredBaseline();
  controls.baselineToggle.dataset.baselineDefault =
    storedBaseline ?? (currentTier === "editorial" ? "on" : "off");
  initBaselineGridToggles({
    defaultEnabled: true,
    toggleSelector: "[data-page-chrome-baseline-toggle][aria-controls]"
  });

  controls.toneToggle.checked = currentTone() === "dark";
  controls.toneToggle.addEventListener("change", event => {
    const nextTone = event.currentTarget instanceof HTMLInputElement && event.currentTarget.checked ? "dark" : "light";
    applyTone(nextTone, controls.baselineToggle);
    storeTone(nextTone);
  });

  controls.baselineToggle.addEventListener("change", () => {
    if (controls.baselineToggle instanceof HTMLInputElement) {
      storeBaseline(controls.baselineToggle.checked);
    }
  });

  controls.tierSelect.addEventListener("change", event => {
    if (!(event.currentTarget instanceof HTMLSelectElement)) {
      return;
    }

    const nextTier = event.currentTarget.value;
    applyTier(nextTier);
    storeTier(nextTier);
    if (nextTier === "editorial") {
      controls.baselineToggle.checked = true;
      controls.baselineToggle.dispatchEvent(new Event("change"));
    }
  });

  initApplicationLayouts();
  initPanelDrawers();
  initSideNavigations();
}

initExamplePage();
