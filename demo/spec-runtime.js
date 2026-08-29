import { initAccordions, initBaselineGridToggles, initCodeSnippets, initContextualMenus, initRangeControls, initSideNavigations, initTabs, initTooltips } from "../dist/index.js";
import { ensureTargetId, injectPageChrome } from "./page-chrome.js";
import { readStoredBaseline, readStoredTier, readStoredTone, storeBaseline, storeTier, storeTone } from "./page-chrome-storage.js";

const rootPrefix= document.documentElement.dataset.specRoot ?? "..";
let activeTierLoad = 0;
let tierSelect = null;
let toneToggle = null;

const tierConfig = {
  editorial: {
    label: "Editorial",
    className: "bf-tier-editorial",
    description: "Container-owned prose rhythm for long-form composition and the widest Ubuntu Sans reading measure.",
    detail: "This tier keeps the loosest section rhythm and the editorial-first grid contract."
  },
  documentation: {
    label: "Documentation",
    className: "bf-tier-documentation",
    description: "Reference-oriented chapter reading with a tighter measure, denser gutters, and quieter display sizes.",
    detail: "This tier keeps the baseline model but shifts the page toward scanning and chapter navigation."
  },
  app: {
    label: "App",
    className: "bf-tier-app",
    description: "Application-density Ubuntu Sans with metric-derived alignment and container-owned semantic spacing.",
    detail: "This tier keeps the application gutter contract and light app-shell chrome while sharing BF's nested-stack rhythm."
  },
  os: {
    label: "OS",
    className: "bf-tier-os",
    description: "Dense first-class OS tier with metric-derived alignment, compact measure, and reduced control geometry.",
    detail: "This tier is support-equivalent to the other built-in tiers while intentionally compressing reading and control geometry."
  }
};

const BUILT_IN_TIER_CLASSES = ["bf-tier-editorial", "bf-tier-documentation", "bf-tier-app", "bf-tier-os"];

function assetUrl(relativePath) {
  return new URL(`${rootPrefix}/${relativePath}`, window.location.href).toString();
}

function cacheBust(url) {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}t=${Date.now()}`;
}

function runtimeStylesheetUrl() {
  return cacheBust(assetUrl("dist/tiers/editorial/styles.css"));
}

function stylesheetArtifactUrl(tierName) {
  return assetUrl(`dist/tiers/${tierName}/styles.css`);
}

function tokensUrl(tierName) {
  return cacheBust(assetUrl(`dist/tiers/${tierName}/tokens.json`));
}

function setText(selector, value) {
  for (const node of document.querySelectorAll(selector)) {
    node.textContent = value;
  }
}

function setLink(kind, href) {
  for (const node of document.querySelectorAll(`[data-spec-artifact="${kind}"]`)) {
    if (node instanceof HTMLAnchorElement) {
      node.href = href;
    }
  }
}

function renderTokens(tokens) {
  const layout = tokens.layout ?? {};
  const components = tokens.components ?? {};
  const roles = tokens.roles ?? {};
  const roleList = document.querySelector("[data-spec-role-list]");

  setText('[data-spec-token="baseline"]', tokens.baselineUnit ?? "-");
  setText('[data-spec-token="measure"]', layout.measure ?? "-");
  setText('[data-spec-token="content-width"]', layout.contentMaxWidth ?? "-");
  setText('[data-spec-token="grid-gap"]', `${layout.gridGapInline ?? "-"} inline / ${layout.gridGapBlock ?? "-"} block`);
  setText('[data-spec-token="page-margin"]', layout.pageMargin ?? "-");
  setText('[data-spec-token="section-space"]', `${layout.sectionSpace ?? "-"} default / ${layout.sectionSpaceDeep ?? "-"} deep`);
  setText('[data-spec-token="control-size"]', `${components.controlBlockPadding ?? "-"} inset / ${components.controlCompactBlockPadding ?? "-"} compact`);
  setText('[data-spec-token="role-count"]', String(Object.keys(roles).length));

  if (roleList instanceof HTMLElement) {
    roleList.innerHTML = Object.entries(roles)
      .map(([roleName, token]) => {
        const fontWeight = token?.fontWeight ?? "-";
        return `
          <div class="bf-cluster">
            <strong>${roleName}</strong>
            <code>${token?.fontSize ?? "-"} / ${token?.lineHeight ?? "-"}</code>
            <span>weight ${fontWeight}</span>
          </div>
        `;
      })
      .join("");
  }
}

function supportedTierNames() {
  const allowed = document.body.dataset.pageTierOptions
    ?.split(",")
    .map(option => option.trim())
    .filter(option => option in tierConfig);

  return allowed && allowed.length > 0 ? allowed : Object.keys(tierConfig);
}

function isSupportedTierName(value) {
  return typeof value === "string" && value in tierConfig;
}

function detectTier() {
  const authoredTier = document.body.dataset.bfTier;

  if (isSupportedTierName(authoredTier)) {
    return authoredTier;
  }

  if (document.body.classList.contains("bf-tier-os")) {
    return "os";
  }

  if (document.body.classList.contains("bf-tier-app")) {
    return "app";
  }

  if (document.body.classList.contains("bf-tier-documentation")) {
    return "documentation";
  }

  return "editorial";
}

function baselineDefaultMode(tierName) {
  return document.body.dataset.pageBaselineDefault ?? (tierName === "editorial" ? "on" : "off");
}

function currentTone() {
  return document.body.classList.contains("is-dark") ? "dark" : "light";
}

function updateStatus(message) {
  if (message) {
    setText("[data-spec-status]", message);
    return;
  }

  const tierName = detectTier();
  const tier = tierConfig[tierName] ?? tierConfig.editorial;
  setText("[data-spec-status]", `${tier.label} tier active in ${currentTone()} mode.`);
}

function syncBaselineGridColor() {
  for (const toggle of document.querySelectorAll("[data-spec-baseline-toggle][aria-controls]")) {
    if (toggle instanceof HTMLInputElement) {
      toggle.dispatchEvent(new Event("change"));
    }
  }
}

function applyTone(tone, { persist = true } = {}) {
  document.body.classList.toggle("is-dark", tone === "dark");
  document.body.classList.toggle("is-light", tone === "light");
  document.documentElement.style.colorScheme = tone;

  if (toneToggle instanceof HTMLInputElement) {
    toneToggle.checked = tone === "dark";
  }

  if (persist) {
    storeTone(tone);
  }

  syncBaselineGridColor();
  updateStatus();
}

async function applyTier(tierName) {
  const tier = tierConfig[tierName];
  if (!tier) {
    return;
  }

  activeTierLoad += 1;
  const loadId = activeTierLoad;
  storeTier(tierName);

  if (tierSelect instanceof HTMLSelectElement) {
    tierSelect.value = tierName;
  }

  document.body.classList.remove(...BUILT_IN_TIER_CLASSES);
  document.body.classList.add("bf-theme", tier.className);
  document.body.dataset.bfTier = tierName;

  setText("[data-spec-current-tier]", tier.label);
  setText("[data-spec-tier-description]", tier.description);
  setText("[data-spec-tier-detail]", tier.detail);
  setLink("css", stylesheetArtifactUrl(tierName));
  setLink("tokens", tokensUrl(tierName));
  updateStatus();

  try {
    const response = await fetch(tokensUrl(tierName));
    if (!response.ok) {
      throw new Error(`Unable to load ${tierName} tokens (${response.status}).`);
    }

    const tokens = await response.json();
    if (loadId !== activeTierLoad) {
      return;
    }

    renderTokens(tokens);
  } catch (error) {
    if (loadId !== activeTierLoad) {
      return;
    }

    updateStatus(`Unable to load ${tier.label.toLowerCase()} tokens.`);
    console.error(error);
  }
}

export async function initSpecRuntime({ initComponents } = {}) {
  const stylesheetLink = document.querySelector("#spec-tier-stylesheet");
  if (!(stylesheetLink instanceof HTMLLinkElement)) {
    throw new Error("Missing #spec-tier-stylesheet link.");
  }

  stylesheetLink.href = runtimeStylesheetUrl();

  const supportedTiers = supportedTierNames().map(name => ({ value: name, label: tierConfig[name]?.label ?? name }));
  const currentTier = detectTier();
  const baselineTargetId = ensureTargetId(document.body, "spec-page");
  const chrome = injectPageChrome({
    controls: {
      baselineLabel: "Baseline grid",
      selectedTier: currentTier,
      showBaseline: true,
      showTone: true,
      tierOptions: supportedTiers
    },
    currentPath: window.location.pathname,
    wrapBodyContent: true
  });

  if (!(chrome.tierSelect instanceof HTMLSelectElement) || !(chrome.toneToggle instanceof HTMLInputElement) || !(chrome.baselineToggle instanceof HTMLInputElement) || !baselineTargetId) {
    throw new Error("Unable to create the shared page chrome controls.");
  }

  chrome.baselineToggle.setAttribute("aria-controls", baselineTargetId);
  const pageBaselineDefault = document.body.dataset.pageBaselineDefault;
  const storedBaseline = readStoredBaseline();
  chrome.baselineToggle.dataset.baselineDefault =
    pageBaselineDefault ?? storedBaseline ?? baselineDefaultMode(currentTier);
  initBaselineGridToggles({ toggleSelector: "[data-page-chrome-baseline-toggle][aria-controls]", defaultEnabled: true });
  chrome.baselineToggle.addEventListener("change", () => {
    if (chrome.baselineToggle instanceof HTMLInputElement) {
      storeBaseline(chrome.baselineToggle.checked);
    }
  });
  initSideNavigations();

  tierSelect = chrome.tierSelect;
  toneToggle = chrome.toneToggle;

  if (typeof initComponents === "function") {
    await initComponents({ initAccordions, initBaselineGridToggles, initCodeSnippets, initContextualMenus, initRangeControls, initSideNavigations, initTabs, initTooltips });
  }

  if (toneToggle instanceof HTMLInputElement) {
    toneToggle.addEventListener("change", event => {
      const nextTone = event.currentTarget instanceof HTMLInputElement && event.currentTarget.checked ? "dark" : "light";
      applyTone(nextTone);
    });
  }

  if (tierSelect instanceof HTMLSelectElement) {
    tierSelect.addEventListener("change", event => {
      const nextTier = event.currentTarget instanceof HTMLSelectElement ? event.currentTarget.value : "editorial";
      void applyTier(nextTier);
    });
  }

  const preferredTier = readStoredTier();
  const supportedTierNamesList = supportedTierNames();
  const declaredDefaultTier = document.body.dataset.pageTierDefault;
  const initialTier = declaredDefaultTier && supportedTierNamesList.includes(declaredDefaultTier)
    ? declaredDefaultTier
    : preferredTier && supportedTierNamesList.includes(preferredTier)
    ? preferredTier
    : (supportedTierNamesList.includes(currentTier) ? currentTier : (supportedTierNamesList.includes("editorial") ? "editorial" : supportedTierNamesList[0]));
  const preferredTone = readStoredTone();

  applyTone(preferredTone === "dark" ? "dark" : "light", { persist: false });
  await applyTier(initialTier);
}
