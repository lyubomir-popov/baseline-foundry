import { findPageByPath, normalizePagePath, pageCatalogSections } from "./page-catalog.js";

let chromeId = 0;
const navigationScrollStorageKey = "bf-demo-page-navigation-scroll-top";

function readNavigationScrollTop() {
  try {
    const value = Number.parseFloat(sessionStorage.getItem(navigationScrollStorageKey) ?? "");
    return Number.isFinite(value) ? Math.max(0, value) : null;
  } catch {
    return null;
  }
}

function storeNavigationScrollTop(nav) {
  try {
    sessionStorage.setItem(navigationScrollStorageKey, String(nav.scrollTop));
  } catch {
    // The catalog remains usable when storage is unavailable.
  }
}

function restoreNavigationScroll(nav) {
  const activeLink = nav.querySelector(".bf-side-navigation-link[aria-current='page']");
  const savedScrollTop = readNavigationScrollTop();

  const restore = () => {
    if (nav.scrollHeight <= nav.clientHeight) {
      return;
    }

    if (savedScrollTop !== null) {
      nav.scrollTop = savedScrollTop;
    }

    if (!(activeLink instanceof HTMLElement)) {
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const activeRect = activeLink.getBoundingClientRect();
    const activeIsVisible = activeRect.top >= navRect.top && activeRect.bottom <= navRect.bottom;

    if (!activeIsVisible) {
      const centeredOffset = (nav.clientHeight - activeRect.height) / 2;
      nav.scrollTop = Math.max(0, nav.scrollTop + activeRect.top - navRect.top - centeredOffset);
    }
  };

  nav.addEventListener("scroll", () => storeNavigationScrollTop(nav), { passive: true });
  window.addEventListener("pagehide", () => storeNavigationScrollTop(nav), { once: true });
  requestAnimationFrame(() => requestAnimationFrame(restore));
  document.fonts?.ready.then(restore).catch(() => {});
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const authoredSequenceSections = new Set(["Overview", "Spec chapters", "Tier references"]);

function orderedCatalogSections() {
  return pageCatalogSections.map(section => ({
    ...section,
    items: authoredSequenceSections.has(section.heading)
      ? [...section.items]
      : [...section.items].sort((a, b) => a.title.localeCompare(b.title, "en", { sensitivity: "base" }))
  }));
}

function adjacentPages(currentPath) {
  const pages = orderedCatalogSections().flatMap(section => section.items);
  const index = pages.findIndex(page => normalizePagePath(page.href) === currentPath);

  if (index < 0) {
    return { previous: null, next: null };
  }

  return {
    previous: pages[index - 1] ?? null,
    next: pages[index + 1] ?? null
  };
}

function renderSequenceLink(page, direction) {
  if (!page) {
    return "";
  }

  const label = direction === "previous" ? "Previous" : "Next";
  const icon = direction === "previous" ? "is-chevron-left" : "is-chevron-right";
  return `<a class="bf-button is-icon pc-sequence-link is-${direction}" href="${page.href}" rel="${direction === "previous" ? "prev" : "next"}" aria-label="${label}: ${escapeHtml(page.title)}" title="${escapeHtml(page.title)}"><span class="bf-icon ${icon}" aria-hidden="true"></span></a>`;
}

function renderSequenceNavigation(currentPath) {
  const { previous, next } = adjacentPages(currentPath);

  if (!previous && !next) {
    return "";
  }

  return `
    <nav class="bf-cluster pc-sequence" aria-label="Adjacent pages">
      ${renderSequenceLink(previous, "previous")}
      ${renderSequenceLink(next, "next")}
    </nav>`;
}

function renderBreadcrumbs(page) {
  return `
    <nav class="bf-breadcrumbs pc-breadcrumbs" aria-label="Breadcrumb">
      <ol class="bf-breadcrumbs-items">
        <li class="bf-breadcrumbs-item"><span>${escapeHtml(page.section)}</span></li>
        <li class="bf-breadcrumbs-item"><span aria-current="page">${escapeHtml(page.title)}</span></li>
      </ol>
    </nav>`;
}

function renderDrawerSections(currentPath) {
  return orderedCatalogSections()
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
    contentWrapper.classList.add("pc-content", "bf-page");

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
  const sequenceMarkup = renderSequenceNavigation(currentPath);
  const breadcrumbsMarkup = renderBreadcrumbs(currentPage);

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
      ${breadcrumbsMarkup}
      ${sequenceMarkup}
    </div>`;

  const footer = controlsMarkup ? document.createElement("footer") : null;
  if (footer) {
    footer.classList.add("pc-root", "pc-footer");
    footer.dataset.pageChrome = "true";
    footer.dataset.captureIgnore = "true";
    footer.dataset.baselineIgnore = "true";
    footer.innerHTML = `<div class="pc-footer-bar">${controlsMarkup}</div>`;
  }

  document.body.insertBefore(header, document.body.firstChild);
  document.body.insertBefore(nav, header);
  restoreNavigationScroll(nav);

  if (contentWrapper) {
    const firstScript = document.body.querySelector(":scope > script");
    document.body.insertBefore(contentWrapper, firstScript ?? null);
  }

  if (footer) {
    const firstScript = document.body.querySelector(":scope > script");
    document.body.insertBefore(footer, firstScript ?? null);
    const reserveFooter = () => {
      document.body.style.setProperty("--pc-footer-block-size", `${footer.getBoundingClientRect().height}px`);
    };
    reserveFooter();
    if (typeof ResizeObserver === "function") {
      const observer = new ResizeObserver(reserveFooter);
      observer.observe(footer);
      window.addEventListener("pagehide", () => observer.disconnect(), { once: true });
    }
  }

  const toneToggle = footer?.querySelector("[data-page-chrome-tone-toggle]") ?? null;
  const baselineToggle = footer?.querySelector("[data-page-chrome-baseline-toggle]") ?? null;
  const tierSelect = footer?.querySelector("[data-page-chrome-tier-select]") ?? null;

  if (controls?.tierAriaLabel && tierSelect instanceof HTMLSelectElement) {
    tierSelect.setAttribute("aria-label", controls.tierAriaLabel);
  }

  return {
    baselineToggle,
    contentWrapper,
    footer,
    header,
    nav,
    root: nav,
    tierSelect,
    toneToggle
  };
}
