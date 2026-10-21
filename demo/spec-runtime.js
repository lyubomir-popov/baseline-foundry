import { initAccordions, initBaselineGridToggles, initCodeSnippets, initContextualMenus, initRangeControls, initSideNavigations, initTabs, initTooltips } from "../dist/index.js";
import { BUNDLE_VERSION_OPTIONS, bundleStylesheetUrl, readBundleVersion, swapBundleStylesheet, writeBundleVersion } from "./bundle-version.js";
import { ensureTargetId, injectPageChrome } from "./page-chrome.js";
import { readStoredBaseline, readStoredTier, readStoredTone, storeBaseline, storeTier, storeTone } from "./page-chrome-storage.js";

const rootPrefix= document.documentElement.dataset.specRoot ?? "..";
let updateHorizontalKeylineDebug = null;

function installHorizontalKeylineDebug() {
  const isHorizontalRoute = window.location.pathname.endsWith("/demo/spec/spacing-horizontal.html");
  const isSpacingChapter = window.location.pathname.endsWith("/demo/spec/spacing.html");
  if (!isHorizontalRoute && !isSpacingChapter) return;

  const overlay = document.createElement("div");
  overlay.setAttribute("aria-hidden", "true");
  overlay.dataset.spacingKeylineDebug = "";
  overlay.dataset.spacingKeylineUpdateCount = "0";
  overlay.style.cssText = "inset:0;pointer-events:none;position:fixed;z-index:9999;";
  const lines = [
    ["action-inset", "red"],
    ["field-text-start", "green"],
    ["disclosure-label-start", "blue"]
  ].map(([keyline, color]) => {
    const line = document.createElement("i");
    line.dataset.spacingKeyline = keyline;
    line.style.cssText = `background:${color};height:100vh;opacity:.5;position:absolute;top:0;width:0.0625rem;`;
    overlay.append(line);
    return line;
  });
  updateHorizontalKeylineDebug = () => {
    const horizontalPanel = isSpacingChapter
      ? document.querySelector("[data-spacing-audit-panel='horizontal']")
      : null;
    const isHorizontalVisible = !horizontalPanel || horizontalPanel.getAttribute("aria-hidden") !== "true";
    overlay.hidden = !isHorizontalVisible;
    if (!isHorizontalVisible) return;

    overlay.dataset.spacingKeylineUpdateCount = String(Number(overlay.dataset.spacingKeylineUpdateCount) + 1);
    const rootRem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
    const setLineLeft = (line, leftInCssPixels) => {
      line.style.left = `${leftInCssPixels / rootRem}rem`;
    };
    const page = document.querySelector("main.bf-page");
    const auditRoot = horizontalPanel ?? document;
    const field = auditRoot.querySelector("input[type='text'], input[type='number'], select, textarea");
    const disclosure = auditRoot.querySelector(".bf-accordion-tab, .bf-list-tree-toggle, .bf-side-navigation-accordion-button");
    if (page) {
      const pageStyle = getComputedStyle(page);
      const actionProbe = document.createElement("i");
      actionProbe.style.cssText = "inline-size:var(--bf-component-inline-inset-action);position:absolute;visibility:hidden";
      page.append(actionProbe);
      const actionInset = actionProbe.getBoundingClientRect().width;
      actionProbe.remove();
      setLineLeft(lines[0], page.getBoundingClientRect().left + Number.parseFloat(pageStyle.paddingInlineStart) + actionInset);
    }
    if (field) setLineLeft(lines[1], field.getBoundingClientRect().left + Number.parseFloat(getComputedStyle(field).paddingInlineStart));
    if (disclosure) {
      const disclosureStyle = getComputedStyle(disclosure);
      const icon = getComputedStyle(disclosure, "::before");
      setLineLeft(lines[2], disclosure.getBoundingClientRect().left + Number.parseFloat(disclosureStyle.paddingInlineStart) + Number.parseFloat(icon.inlineSize) + Number.parseFloat(disclosureStyle.gap));
    }
  };
  document.body.append(overlay);
  updateHorizontalKeylineDebug();
  window.addEventListener("resize", updateHorizontalKeylineDebug, { passive: true });
  document.fonts?.ready.then(updateHorizontalKeylineDebug);
  document.addEventListener("bf:spacing-audits-ready", updateHorizontalKeylineDebug);
  const auditTabs = document.querySelector("[data-spacing-audit-tabs]");
  if (auditTabs) {
    const observer = new MutationObserver(() => requestAnimationFrame(updateHorizontalKeylineDebug));
    observer.observe(auditTabs, {
      attributeFilter: ["aria-hidden"],
      attributes: true,
      childList: true,
      subtree: true
    });
  }
}
let activeTierLoad = 0;
let tierSelect = null;
let toneToggle = null;
let versionSelect = null;
let currentVersion = "after";
let tierStylesheetLink = null;

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

function stylesheetArtifactUrl(version, tierName) {
  return bundleStylesheetUrl(version, tierName);
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
      if (href) {
        node.href = href;
        node.removeAttribute("aria-disabled");
        node.removeAttribute("title");
      } else {
        node.removeAttribute("href");
        node.setAttribute("aria-disabled", "true");
        node.title = "The pinned Before evidence contains CSS bundles only.";
      }
    }
  }
}

function clearTokenDiagnostics() {
  for (const node of document.querySelectorAll("[data-spec-token]")) {
    node.textContent = "Unavailable in pinned Before evidence";
  }
  const roleList = document.querySelector("[data-spec-role-list]");
  if (roleList instanceof HTMLElement) {
    roleList.textContent = "Before comparison is CSS-only; no matching token JSON was preserved.";
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
  setText('[data-spec-token="control-size"]', `${components.inlineInsetField ?? "-"} field / ${components.inlineInsetAction ?? "-"} action / ${components.inlineInsetContinuation ?? "-"} continuation`);
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
  setText("[data-spec-status]", `${currentVersion === "before" ? "Before" : "After"} bundle · ${tier.label} tier active in ${currentTone()} mode.`);
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
  if (!tier || !(tierStylesheetLink instanceof HTMLLinkElement)) {
    return;
  }

  activeTierLoad += 1;
  const loadId = activeTierLoad;
  const requestedVersion = currentVersion;
  if (tierSelect instanceof HTMLSelectElement) {
    tierSelect.value = tierName;
  }

  await swapBundleStylesheet(tierStylesheetLink, requestedVersion, tierName);
  if (loadId !== activeTierLoad) {
    return;
  }
  document.body.classList.remove(...BUILT_IN_TIER_CLASSES);
  document.body.classList.add("bf-theme", tier.className);
  document.body.dataset.bfTier = tierName;
  storeTier(tierName);
  updateHorizontalKeylineDebug?.();

  setText("[data-spec-current-tier]", tier.label);
  setText("[data-spec-tier-description]", tier.description);
  setText("[data-spec-tier-detail]", tier.detail);
  setLink("css", stylesheetArtifactUrl(requestedVersion, tierName));
  setLink("tokens", requestedVersion === "after" ? tokensUrl(tierName) : null);
  updateStatus();

  if (requestedVersion === "before") {
    clearTokenDiagnostics();
    updateStatus(`Before bundle · ${tier.label} tier CSS active; matching token JSON was not preserved.`);
    return;
  }

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
    updateHorizontalKeylineDebug?.();
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

  tierStylesheetLink = stylesheetLink;
  currentVersion = readBundleVersion();

  const supportedTiers = supportedTierNames().map(name => ({ value: name, label: tierConfig[name]?.label ?? name }));
  const currentTier = detectTier();
  await swapBundleStylesheet(stylesheetLink, currentVersion, currentTier);
  const baselineTargetId = ensureTargetId(document.body, "spec-page");
  const chrome = injectPageChrome({
    controls: {
      baselineLabel: "Baseline grid",
      selectedTier: currentTier,
      selectedVersion: currentVersion,
      showBaseline: true,
      showTone: true,
      tierOptions: supportedTiers,
      versionOptions: BUNDLE_VERSION_OPTIONS
    },
    currentPath: window.location.pathname,
    sectionLabel: document.body.dataset.pageSectionLabel ?? (window.location.pathname.includes("/demo/spec/spacing-") ? "Spacing chapter" : undefined),
    wrapBodyContent: true
  });

  if (!(chrome.tierSelect instanceof HTMLSelectElement) || !(chrome.versionSelect instanceof HTMLSelectElement) || !(chrome.toneToggle instanceof HTMLInputElement) || !(chrome.baselineToggle instanceof HTMLInputElement) || !baselineTargetId) {
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
  versionSelect = chrome.versionSelect;
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
    tierSelect.addEventListener("change", async event => {
      if (!(event.currentTarget instanceof HTMLSelectElement)) {
        return;
      }
      const select = event.currentTarget;
      const nextTier = select.value;
      try {
        await applyTier(nextTier);
      } catch (error) {
        select.value = detectTier();
        updateStatus("Unable to load the selected BF tier bundle.");
        console.error(error);
      }
    });
  }

  if (versionSelect instanceof HTMLSelectElement) {
    versionSelect.addEventListener("change", async event => {
      if (!(event.currentTarget instanceof HTMLSelectElement)) {
        return;
      }
      const select = event.currentTarget;
      const nextVersion = select.value;
      const previousVersion = currentVersion;
      currentVersion = nextVersion === "before" ? "before" : "after";
      try {
        await applyTier(detectTier());
        writeBundleVersion(currentVersion);
      } catch (error) {
        currentVersion = previousVersion;
        select.value = previousVersion;
        writeBundleVersion(previousVersion);
        updateStatus("Unable to load the selected BF bundle; the previous bundle remains active.");
        console.error(error);
      }
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
  installHorizontalKeylineDebug();
}
