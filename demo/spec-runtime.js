const TIER_STORAGE_KEY = "baseline-foundry:living-spec-tier";
const TONE_STORAGE_KEY = "baseline-foundry:living-spec-tone";
const tierStylesheet = document.querySelector("#spec-tier-stylesheet");
const tierSelect = document.querySelector("[data-spec-tier-select]");
const toneToggle = document.querySelector("[data-spec-tone-toggle]");
const rootPrefix = document.documentElement.dataset.specRoot ?? "..";
let activeTierLoad = 0;

const tierConfig = {
  editorial: {
    label: "Editorial",
    className: "bf-tier-editorial",
    description: "Element-owned prose rhythm for long-form composition and the widest IBM Plex reading measure.",
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
    description: "Canonical-style application tier with Ubuntu Sans, container-owned spacing, and zero selected nudges.",
    detail: "This tier keeps the application gutter contract and the light app-shell chrome used for parity pages."
  }
};

function assetUrl(relativePath) {
  return new URL(`${rootPrefix}/${relativePath}`, window.location.href).toString();
}

function stylesheetUrl(tierName) {
  return assetUrl(`dist/tiers/${tierName}/styles.css`);
}

function tokensUrl(tierName) {
  return assetUrl(`dist/tiers/${tierName}/tokens.json`);
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
  setText('[data-spec-token="control-size"]', `${components.controlMinBlockSize ?? "-"} default / ${components.controlMinBlockSizeDense ?? "-"} dense`);
  setText('[data-spec-token="role-count"]', String(Object.keys(roles).length));

  if (roleList instanceof HTMLElement) {
    roleList.innerHTML = Object.entries(roles)
      .map(([roleName, token]) => {
        const fontWeight = token?.fontWeight ?? "-";
        return `
          <div data-spec-token-row>
            <strong>${roleName}</strong>
            <code>${token?.fontSize ?? "-"} / ${token?.lineHeight ?? "-"}</code>
            <span>weight ${fontWeight}</span>
          </div>
        `;
      })
      .join("");
  }
}

function readStoredTier() {
  try {
    return window.localStorage.getItem(TIER_STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeTier(tierName) {
  try {
    window.localStorage.setItem(TIER_STORAGE_KEY, tierName);
  } catch {
    // Ignore storage failures; the selector still works for the current page load.
  }
}

function readStoredTone() {
  try {
    return window.localStorage.getItem(TONE_STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeTone(tone) {
  try {
    window.localStorage.setItem(TONE_STORAGE_KEY, tone);
  } catch {
    // Ignore storage failures; the selector still works for the current page load.
  }
}

function supportedTierNames() {
  if (!(tierSelect instanceof HTMLSelectElement)) {
    return Object.keys(tierConfig);
  }

  const supported = Array.from(tierSelect.options)
    .map(option => option.value)
    .filter(option => option in tierConfig);

  return supported.length > 0 ? supported : Object.keys(tierConfig);
}

function currentTone() {
  return document.body.dataset.bfTone === "dark" ? "dark" : "light";
}

function updateStatus(message) {
  if (message) {
    setText("[data-spec-status]", message);
    return;
  }

  const tierName = document.body.dataset.bfTier ?? "editorial";
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
  document.body.dataset.bfTone = tone;
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

  if (tierStylesheet instanceof HTMLLinkElement) {
    tierStylesheet.href = stylesheetUrl(tierName);
  }

  document.body.classList.remove("bf-tier-editorial", "bf-tier-documentation", "bf-tier-app");
  document.body.classList.add("bf-theme", tier.className);
  document.body.dataset.bfTier = tierName;

  setText("[data-spec-current-tier]", tier.label);
  setText("[data-spec-tier-description]", tier.description);
  setText("[data-spec-tier-detail]", tier.detail);
  setLink("css", stylesheetUrl(tierName));
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
  const moduleUrl = assetUrl("dist/index.js");
  const componentModule = await import(moduleUrl);
  componentModule.initBaselineGridToggles({ toggleSelector: "[data-spec-baseline-toggle][aria-controls]" });

  if (typeof initComponents === "function") {
    await initComponents(componentModule);
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
  const supportedTiers = supportedTierNames();
  const initialTier = preferredTier && supportedTiers.includes(preferredTier)
    ? preferredTier
    : (supportedTiers.includes("editorial") ? "editorial" : supportedTiers[0]);
  const preferredTone = readStoredTone();

  applyTone(preferredTone === "dark" ? "dark" : "light", { persist: false });
  await applyTier(initialTier);
}