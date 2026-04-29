import { findPageByPath, normalizePagePath, pageCatalogSections } from "./page-catalog.js";

let chromeId = 0;

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderDrawerSections(currentPath) {
  return pageCatalogSections
    .map(section => {
      const items = section.items
        .map(item => {
          const isCurrent = normalizePagePath(item.href) === currentPath;
          const currentAttr = isCurrent ? ' aria-current="page"' : "";
          return `
            <li class="bf-side-navigation-item">
              <a class="bf-side-navigation-link" href="${item.href}"${currentAttr}>
                <span class="bf-side-navigation-label">${escapeHtml(item.title)}</span>
              </a>
            </li>`;
        })
        .join("");

      return `
        <h3 class="bf-side-navigation-heading">${escapeHtml(section.heading)}</h3>
        <ul class="bf-side-navigation-list">
          ${items}
        </ul>`;
    })
    .join("");
}

function renderSwitch(kind, label) {
  return `
    <label class="bf-switch pc-switch">
      <input class="bf-switch-input" data-page-chrome-${kind}-toggle type="checkbox">
      <span class="bf-switch-slider" aria-hidden="true"></span>
      <span class="bf-switch-label">${escapeHtml(label)}</span>
    </label>`;
}

function renderSelect(options, selectedValue) {
  const optionMarkup = options
    .map(option => {
      const selectedAttr = option.value === selectedValue ? " selected" : "";
      return `<option value="${escapeHtml(option.value)}"${selectedAttr}>${escapeHtml(option.label)}</option>`;
    })
    .join("");

  return `
    <div class="bf-control pc-select-wrap">
      <select data-page-chrome-tier-select aria-label="Tier">
        ${optionMarkup}
      </select>
    </div>`;
}

function normalizeControls(controls) {
  if (!controls) {
    return null;
  }

  return {
    showTone: controls.showTone !== false,
    showBaseline: controls.showBaseline !== false,
    toneLabel: controls.toneLabel ?? "Dark theme",
    baselineLabel: controls.baselineLabel ?? "Baseline grid",
    tierOptions: controls.tierOptions ?? [],
    selectedTier: controls.selectedTier ?? controls.tierOptions?.[0]?.value ?? "",
    tierAriaLabel: controls.tierAriaLabel ?? "Tier"
  };
}

export function ensureTargetId(target, prefix) {
  if (!target) {
    return null;
  }

  if (!target.id) {
    chromeId += 1;
    target.id = `${prefix}-${chromeId}`;
  }

  return target.id;
}

export function injectPageChrome(options = {}) {
  const currentPath = normalizePagePath(options.currentPath ?? window.location.pathname);
  const currentPage = findPageByPath(currentPath) ?? {
    title: options.pageTitle ?? document.title,
    section: options.sectionLabel ?? "Current page"
  };
  const controls = normalizeControls(options.controls);

  let contentWrapper = null;
  if (options.wrapBodyContent) {
    contentWrapper = document.createElement("div");
    contentWrapper.classList.add("pc-content");

    const nodesToMove = Array.from(document.body.childNodes).filter(node => {
      return !(node instanceof HTMLScriptElement);
    });

    for (const node of nodesToMove) {
      contentWrapper.appendChild(node);
    }
  }

  chromeId += 1;
  const navId = `page-chrome-nav-${chromeId}`;
  const controlsMarkup = controls
    ? `
        <div class="bf-cluster pc-controls">
          ${controls.showTone ? renderSwitch("tone", controls.toneLabel) : ""}
          ${controls.showBaseline ? renderSwitch("baseline", controls.baselineLabel) : ""}
          ${controls.tierOptions.length > 0 ? renderSelect(controls.tierOptions, controls.selectedTier) : ""}
        </div>`
    : "";

  const nav = document.createElement("aside");
  nav.classList.add("pc-root", "pc-nav");
  nav.id = navId;
  nav.setAttribute("aria-label", "Page navigation");
  nav.dataset.pageChrome = "true";
  nav.dataset.captureIgnore = "true";
  nav.dataset.baselineIgnore = "true";
  nav.innerHTML = `
    <nav class="bf-side-navigation-drawer" aria-label="Page list">
      ${renderDrawerSections(currentPath)}
    </nav>`;

  const header = document.createElement("header");
  header.classList.add("pc-root", "pc-header");
  header.dataset.pageChrome = "true";
  header.dataset.captureIgnore = "true";
  header.dataset.baselineIgnore = "true";
  header.innerHTML = `
    <div class="pc-bar">
      <div class="pc-current">
        <span class="pc-section">${escapeHtml(currentPage.section)}</span>
        <strong class="pc-title">${escapeHtml(currentPage.title)}</strong>
      </div>
      ${controlsMarkup}
    </div>`;

  document.body.insertBefore(header, document.body.firstChild);
  document.body.insertBefore(nav, header);

  if (contentWrapper) {
    const firstScript = document.body.querySelector(":scope > script");
    document.body.insertBefore(contentWrapper, firstScript ?? null);
  }

  const toneToggle = header.querySelector("[data-page-chrome-tone-toggle]");
  const baselineToggle = header.querySelector("[data-page-chrome-baseline-toggle]");
  const tierSelect = header.querySelector("[data-page-chrome-tier-select]");

  if (controls?.tierAriaLabel && tierSelect instanceof HTMLSelectElement) {
    tierSelect.setAttribute("aria-label", controls.tierAriaLabel);
  }

  return {
    baselineToggle,
    contentWrapper,
    header,
    nav,
    root: nav,
    tierSelect,
    toneToggle
  };
}
