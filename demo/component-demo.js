import { initAccordions, initApplicationLayouts, initBaselineGridToggles, initCodeSnippets, initContextualMenus, initListTree, initPanelDrawers, initRangeControls, initResizableAsides, initSideNavigations, initTabs, initTooltips, initTopNavigations } from "../dist/index.js";
import { ensureTargetId, injectPageChrome } from "./page-chrome.js";
import { readStoredBaseline, readStoredTier, readStoredTone, storeBaseline, storeTier, storeTone } from "./page-chrome-storage.js";

const TIER_OPTIONS = [
  { value: "editorial", label: "Editorial" },
  { value: "documentation", label: "Docs" },
  { value: "app", label: "App" },
  { value: "os", label: "OS" }
];

const BUILT_IN_TIER_CLASSES = ["bf-tier-editorial", "bf-tier-documentation", "bf-tier-app", "bf-tier-os"];

function isLockedManifestMode() {
  return document.body.dataset.pageSurfaceMode === "locked-manifest";
}

function titleCaseSurface(value) {
  if (value === "ibm-plex-engine-smoke") {
    return "IBM Plex Sans";
  }

  if (value === "ubuntu-engine-smoke") {
    return "Ubuntu Sans";
  }

  return value
    .split(/[-_]/g)
    .map(part => {
      const lower = part.toLowerCase();
      if (lower === "ibm") {
        return "IBM";
      }

      if (lower === "app") {
        return "App";
      }

      if (lower === "os") {
        return "OS";
      }

      if (lower === "documentation") {
        return "Docs";
      }

      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

function cacheBust(url) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}t=${Date.now()}`;
}

function surfaceManifestHref(stylesheetLink) {
  return stylesheetLink.href.replace(/styles\.css(?:\?.*)?$/i, "surfaces.json");
}

async function loadSurfaceManifest(stylesheetLink) {
  const response = await fetch(surfaceManifestHref(stylesheetLink), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Unable to load the component surface manifest (${response.status}).`);
  }

  return response.json();
}

function manifestSurfaceOptions(manifest) {
  const surfaces = manifest?.surfaces ?? {};
  return Object.entries(surfaces).map(([name, surface]) => ({
    value: name,
    label: typeof surface?.label === "string" ? surface.label : titleCaseSurface(name)
  }));
}

function detectManifestSurface(manifest) {
  const surfaces = manifest?.surfaces ?? {};
  const bodySurface = document.body.dataset.bfTier;

  if (bodySurface && surfaces[bodySurface]) {
    return bodySurface;
  }

  for (const [name, surface] of Object.entries(surfaces)) {
    if (surface && typeof surface === "object" && typeof surface.className === "string" && document.body.classList.contains(surface.className)) {
      return name;
    }
  }

  return manifest?.defaultSurface ?? Object.keys(surfaces)[0] ?? "editorial";
}

function applyManifestSurface(surfaceName, manifest, stylesheetLink) {
  const surfaces = manifest?.surfaces ?? {};
  const selectedSurface = surfaces[surfaceName];
  const classNames = Object.values(surfaces)
    .map(surface => surface?.className)
    .filter(className => typeof className === "string");

  stylesheetLink.href = stylesheetLink.dataset.lockedHref ?? stylesheetLink.href;
  document.body.classList.remove(...classNames);
  document.body.classList.add("bf-theme");

  if (selectedSurface && typeof selectedSurface.className === "string") {
    document.body.classList.add(selectedSurface.className);
  }

  document.body.dataset.bfTier = surfaceName;
}

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

function supportedTierOptions() {
  const allowed = document.body.dataset.pageTierOptions
    ?.split(",")
    .map(option => option.trim())
    .filter(option => TIER_OPTIONS.some(tier => tier.value === option));

  if (!allowed || allowed.length === 0) {
    return TIER_OPTIONS;
  }

  return TIER_OPTIONS.filter(option => allowed.includes(option.value));
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

function tierHref() {
  return cacheBust("/dist/tiers/editorial/styles.css");
}

function applyTier(tierName, stylesheetLink) {
  stylesheetLink.href = tierHref();
  document.body.classList.remove(...BUILT_IN_TIER_CLASSES);
  document.body.classList.add("bf-theme");
  document.body.classList.add(`bf-tier-${tierName}`);
  document.body.dataset.bfTier = tierName;
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

async function initLockedManifestMode(stylesheetLink) {
  stylesheetLink.dataset.lockedHref = stylesheetLink.href;
  const manifest = await loadSurfaceManifest(stylesheetLink);
  const initialSurface = detectManifestSurface(manifest);
  applyManifestSurface(initialSurface, manifest, stylesheetLink);

  const chrome = injectPageChrome({
    controls: {
      selectedTier: initialSurface,
      showBaseline: true,
      showTone: true,
      tierAriaLabel: "Font surface",
      tierOptions: manifestSurfaceOptions(manifest)
    },
    currentPath: window.location.pathname,
    wrapBodyContent: true
  });

  return {
    chrome,
    initialSurface,
    applySurface: surface => applyManifestSurface(surface, manifest, stylesheetLink),
    baselineShouldDefaultToOn: surface => surface !== "app"
  };
}

function initDefaultMode(stylesheetLink) {
  const supportedTiers = supportedTierOptions();
  const supportedTierValues = supportedTiers.map(o => o.value);
  const pageTierDefault = document.body.dataset.pageTierDefault;
  const storedTier = readStoredTier();
  const initialSurface =
    (pageTierDefault && supportedTierValues.includes(pageTierDefault))
      ? pageTierDefault
      : (storedTier && supportedTierValues.includes(storedTier))
      ? storedTier
      : detectTier();
  applyTier(initialSurface, stylesheetLink);
  const chrome = injectPageChrome({
    controls: {
      selectedTier: initialSurface,
      showBaseline: true,
      showTone: true,
      tierAriaLabel: "Tier",
      tierOptions: supportedTiers
    },
    currentPath: window.location.pathname,
    wrapBodyContent: true
  });

  return {
    chrome,
    initialSurface,
    applySurface: surface => applyTier(surface, stylesheetLink),
    baselineShouldDefaultToOn
  };
}

async function main() {
  const stylesheetLink = resolveStylesheetLink();

  if (!(stylesheetLink instanceof HTMLLinkElement)) {
    throw new Error("Unable to find the component page stylesheet link.");
  }

  // Apply stored tone to body before chrome injection so currentTone() is accurate.
  const storedTone = readStoredTone();
  if (storedTone === "dark" || storedTone === "light") {
    document.body.classList.toggle("is-dark", storedTone === "dark");
    document.body.classList.toggle("is-light", storedTone !== "dark");
    document.documentElement.style.colorScheme = storedTone;
  }

  const runtime = isLockedManifestMode()
    ? await initLockedManifestMode(stylesheetLink)
    : initDefaultMode(stylesheetLink);

  const { chrome, initialSurface } = runtime;

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
    const storedBaseline = readStoredBaseline();
    const tierBasedDefault = runtime.baselineShouldDefaultToOn(initialSurface) ? "on" : "off";
    chrome.baselineToggle.dataset.baselineDefault = storedBaseline ?? tierBasedDefault;
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
      storeTone(nextTone);
    });
  }

  if (chrome.baselineToggle instanceof HTMLInputElement) {
    chrome.baselineToggle.addEventListener("change", () => {
      baselineMode = "manual";
      if (chrome.baselineToggle instanceof HTMLInputElement) {
        storeBaseline(chrome.baselineToggle.checked);
      }
    });
  }

  if (chrome.tierSelect instanceof HTMLSelectElement) {
    chrome.tierSelect.addEventListener("change", event => {
      if (!(event.currentTarget instanceof HTMLSelectElement)) {
        return;
      }

      const nextSurface = event.currentTarget.value;
      runtime.applySurface(nextSurface);
      storeTier(nextSurface);

      if (chrome.baselineToggle instanceof HTMLInputElement && baselineMode === "auto") {
        chrome.baselineToggle.checked = runtime.baselineShouldDefaultToOn(nextSurface);
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
}

void main();

