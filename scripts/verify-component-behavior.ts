import path from "node:path";
import { chromium } from "playwright";
import { closeServer, createStaticServer, waitForFonts } from "./component-demo-shared.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function openBrowser(): Promise<import("playwright").Browser> {
  try {
    return await chromium.launch();
  } catch (error) {
    if (error instanceof Error && error.message.includes("Executable doesn't exist")) {
      throw new Error("Playwright Chromium is not installed. Run `npm run playwright:install` once before behavior verification.");
    }

    throw error;
  }
}

async function disableDemoChromeHitTesting(page: import("playwright").Page): Promise<void> {
  await page.addStyleTag({
    content: [
      ".component-demo-nav,",
      ".component-demo-nav *,",
      "[data-page-chrome],",
      "[data-page-chrome] * {",
      "  pointer-events: none !important;",
      "}"
    ].join("\n")
  });
}

async function readAsideWidth(page: import("playwright").Page): Promise<number> {
  return page.locator(".bf-aside.is-pinned").evaluate(element => element.getBoundingClientRect().width);
}

async function verifyPinnedAsideResize(origin: string): Promise<void> {
  const storageKey = "demo:application-shell-aside";
  const route = "/demo/components/application-shell.html";
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1800, height: 1200 }
    });

    await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
    await waitForFonts(page);
  await disableDemoChromeHitTesting(page);
    await page.evaluate(key => localStorage.removeItem(key), storageKey);
    await page.reload({ waitUntil: "networkidle" });
    await waitForFonts(page);
  await disableDemoChromeHitTesting(page);

    const handle = page.locator(".bf-application-aside-resize-handle");
    const aside = page.locator(".bf-aside.is-pinned");
    const application = page.locator(".bf-application");
    await handle.waitFor({ state: "visible" });
    await aside.waitFor({ state: "visible" });
    await handle.scrollIntoViewIfNeeded();

    const initialWidth = await readAsideWidth(page);
    const ariaValueNow = Number.parseFloat(await handle.getAttribute("aria-valuenow") ?? "");
    assert(Number.isFinite(ariaValueNow), "Expected resize handle to expose aria-valuenow.");
    assert(Math.abs(initialWidth - ariaValueNow) <= 2, `Expected handle aria-valuenow (${ariaValueNow}) to track the current aside width (${initialWidth}).`);

    const handleBox = await handle.boundingBox();
    assert(handleBox, "Expected resize handle to have a measurable bounding box.");

    await page.mouse.move(handleBox.x + (handleBox.width / 2), handleBox.y + (handleBox.height / 2));
    await page.mouse.down();
    await page.mouse.move(handleBox.x - 96, handleBox.y + (handleBox.height / 2), { steps: 12 });
    await page.mouse.up();

    const resizedWidth = await readAsideWidth(page);
    assert(resizedWidth >= initialWidth + 60, `Expected pointer dragging to widen the aside. Initial ${initialWidth}px, resized ${resizedWidth}px.`);
    const isResizingClassApplied = await application.evaluate(element => element.classList.contains("is-resizing-aside"));
    assert(!isResizingClassApplied, "Expected the resizing class to be removed after pointer drag completes.");

    await page.reload({ waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);
    const persistedWidth = await readAsideWidth(page);
    assert(Math.abs(persistedWidth - resizedWidth) <= 2, `Expected resized aside width to persist after reload. Resized ${resizedWidth}px, reloaded ${persistedWidth}px.`);

    const minWidth = Number.parseFloat(await handle.getAttribute("aria-valuemin") ?? "");
    const maxWidth = Number.parseFloat(await handle.getAttribute("aria-valuemax") ?? "");
    assert(Number.isFinite(minWidth) && Number.isFinite(maxWidth), "Expected resize handle to expose aria-valuemin and aria-valuemax.");

    await handle.scrollIntoViewIfNeeded();
    await handle.focus();
    await page.keyboard.press("Home");
    const homeWidth = await readAsideWidth(page);
    assert(Math.abs(homeWidth - minWidth) <= 2, `Expected Home to clamp the aside to its minimum width. Min ${minWidth}px, got ${homeWidth}px.`);

    await handle.scrollIntoViewIfNeeded();
    await handle.focus();
    await page.keyboard.press("End");
    const endWidth = await readAsideWidth(page);
    assert(Math.abs(endWidth - maxWidth) <= 2, `Expected End to clamp the aside to its maximum width. Max ${maxWidth}px, got ${endWidth}px.`);

    await handle.dblclick();
    await page.reload({ waitUntil: "networkidle" });
    await waitForFonts(page);
  await disableDemoChromeHitTesting(page);
    const resetWidth = await readAsideWidth(page);
    assert(Math.abs(resetWidth - initialWidth) <= 2, `Expected double-click reset to restore the default aside width. Default ${initialWidth}px, got ${resetWidth}px.`);
  } finally {
    await browser.close();
  }
}

async function verifyDrawerOverlay(origin: string): Promise<void> {
  const route = "/demo/components/drawer-panel.html";
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1440, height: 900 }
    });

    await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
    await waitForFonts(page);
  await disableDemoChromeHitTesting(page);

    const application = page.locator(".bf-application");
    const drawer = page.locator("#drawer-panel-demo");
    const overlay = page.locator(".bf-application-overlay");
    const toggle = page.locator("[data-panel-drawer-toggle]");

    await application.waitFor({ state: "visible" });
    await drawer.waitFor({ state: "visible" });

    const openGeometry = await page.evaluate(() => {
      const app = document.querySelector(".bf-application");
      const aside = document.querySelector<HTMLElement>("#drawer-panel-demo");
      if (!(app instanceof HTMLElement) || !(aside instanceof HTMLElement)) {
        return null;
      }

      const appRect = app.getBoundingClientRect();
      const asideRect = aside.getBoundingClientRect();
      return {
        appTop: appRect.top,
        appBottom: appRect.bottom,
        appRight: appRect.right,
        asideTop: asideRect.top,
        asideBottom: asideRect.bottom,
        asideRight: asideRect.right,
        asideWidth: asideRect.width,
        asideHeight: asideRect.height
      };
    });

    assert(openGeometry, "Expected drawer geometry to be measurable.");
    assert(openGeometry.asideHeight >= openGeometry.appBottom - openGeometry.appTop - 2, `Expected open drawer to span the application height. App ${openGeometry.appBottom - openGeometry.appTop}px, drawer ${openGeometry.asideHeight}px.`);
    assert(Math.abs(openGeometry.asideTop - openGeometry.appTop) <= 2, `Expected open drawer to attach to the top edge of the application. App top ${openGeometry.appTop}px, drawer top ${openGeometry.asideTop}px.`);
    assert(Math.abs(openGeometry.asideBottom - openGeometry.appBottom) <= 2, `Expected open drawer to attach to the bottom edge of the application. App bottom ${openGeometry.appBottom}px, drawer bottom ${openGeometry.asideBottom}px.`);
    assert(Math.abs(openGeometry.asideRight - openGeometry.appRight) <= 2, `Expected open drawer to attach to the right edge of the application. App right ${openGeometry.appRight}px, drawer right ${openGeometry.asideRight}px.`);
    assert(openGeometry.asideWidth >= 320, `Expected open drawer to have a substantial visible width. Got ${openGeometry.asideWidth}px.`);

    await toggle.click();
    await page.waitForTimeout(220);
    const closedState = await page.evaluate(() => {
      const app = document.querySelector(".bf-application");
      const aside = document.querySelector<HTMLElement>("#drawer-panel-demo");
      const overlayElement = document.querySelector<HTMLElement>(".bf-application-overlay");
      if (!(app instanceof HTMLElement) || !(aside instanceof HTMLElement) || !(overlayElement instanceof HTMLElement)) {
        return null;
      }

      return {
        appOpen: app.classList.contains("is-drawer-expanded"),
        drawerOpen: aside.classList.contains("is-open"),
        ariaHidden: aside.getAttribute("aria-hidden"),
        overlayHidden: overlayElement.getAttribute("aria-hidden")
      };
    });

    assert(closedState, "Expected closed drawer state to be measurable.");
    assert(!closedState.appOpen, "Expected drawer toggle to remove the application open class.");
    assert(!closedState.drawerOpen, "Expected drawer toggle to remove the drawer open class.");
    assert(closedState.ariaHidden === "true", `Expected closed drawer aria-hidden to be true, got ${closedState.ariaHidden}.`);
    assert(closedState.overlayHidden === "true", `Expected closed overlay aria-hidden to be true, got ${closedState.overlayHidden}.`);

    await toggle.click();
    await page.waitForTimeout(220);
    const reopenedState = await page.evaluate(() => {
      const app = document.querySelector(".bf-application");
      const aside = document.querySelector<HTMLElement>("#drawer-panel-demo");
      if (!(app instanceof HTMLElement) || !(aside instanceof HTMLElement)) {
        return null;
      }

      const asideRect = aside.getBoundingClientRect();
      return {
        appOpen: app.classList.contains("is-drawer-expanded"),
        drawerOpen: aside.classList.contains("is-open"),
        ariaHidden: aside.getAttribute("aria-hidden"),
        asideHeight: asideRect.height
      };
    });

    assert(reopenedState, "Expected reopened drawer state to be measurable.");
    assert(reopenedState.appOpen, "Expected drawer toggle to restore the application open class.");
    assert(reopenedState.drawerOpen, "Expected drawer toggle to restore the drawer open class.");
    assert(reopenedState.ariaHidden === "false", `Expected reopened drawer aria-hidden to be false, got ${reopenedState.ariaHidden}.`);
    assert(reopenedState.asideHeight >= 200, `Expected reopened drawer to remain visibly tall. Got ${reopenedState.asideHeight}px.`);

    const overlayBox = await overlay.boundingBox();
    assert(overlayBox, "Expected overlay to expose a measurable bounding box.");
    await page.mouse.click(
      Math.max(overlayBox.x + 24, 240),
      overlayBox.y + (overlayBox.height / 2)
    );
    await page.waitForTimeout(220);
    const overlayCloseState = await page.evaluate(() => {
      const app = document.querySelector(".bf-application");
      const aside = document.querySelector<HTMLElement>("#drawer-panel-demo");
      if (!(app instanceof HTMLElement) || !(aside instanceof HTMLElement)) {
        return null;
      }

      return {
        appOpen: app.classList.contains("is-drawer-expanded"),
        drawerOpen: aside.classList.contains("is-open")
      };
    });

    assert(overlayCloseState, "Expected overlay-close drawer state to be measurable.");
    assert(!overlayCloseState.appOpen && !overlayCloseState.drawerOpen, "Expected clicking the overlay to close the drawer.");
  } finally {
    await browser.close();
  }
}

async function verifyApplicationLayout(origin: string): Promise<void> {
  const route = "/demo/components/application-layout.html";
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1440, height: 960 }
    });

    await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);

    const spacingResetState = await page.evaluate(() => {
      const stack = document.querySelector<HTMLElement>(".bf-panel-header .bf-stack.is-flush");
      if (!(stack instanceof HTMLElement)) {
        return null;
      }

      return {
        gap: getComputedStyle(stack).gap,
        children: Array.from(stack.children).slice(0, 2).map(child => {
          if (!(child instanceof HTMLElement)) {
            return null;
          }

          const style = getComputedStyle(child);
          return {
            tag: child.tagName,
            marginBottom: style.marginBottom,
            paddingBlockStart: style.paddingBlockStart,
            paddingBlockEnd: style.paddingBlockEnd
          };
        })
      };
    });

    if (!spacingResetState) {
      throw new Error("Expected application layout header stack to be measurable.");
    }

    assert(spacingResetState.gap === "0px", `Expected application layout header stack to stay flush. Got gap=${spacingResetState.gap}.`);

    spacingResetState.children.forEach((child, index) => {
      if (!child) {
        throw new Error(`Expected application layout header stack child ${index + 1} to be an HTMLElement.`);
      }

      assert(child.marginBottom === "0px", `Expected application layout header stack child ${child.tag} to drop semantic margin-bottom inside the flush stack. Got ${child.marginBottom}.`);
      assert(child.paddingBlockStart === "0px", `Expected application layout header stack child ${child.tag} to drop semantic padding-block-start inside the flush stack. Got ${child.paddingBlockStart}.`);
      assert(child.paddingBlockEnd === "0px", `Expected application layout header stack child ${child.tag} to drop semantic padding-block-end inside the flush stack. Got ${child.paddingBlockEnd}.`);
    });

    const navigation = page.locator("#application-layout-navigation");
    const menuToggle = page.locator("[data-application-layout-toggle]").first();
    const pinToggle = page.locator("[data-application-layout-pin]");

    await navigation.waitFor({ state: "visible" });
    await menuToggle.waitFor({ state: "visible" });

    const collapsedWidth = await navigation.evaluate(element => element.getBoundingClientRect().width);
    assert(collapsedWidth <= 96, `Expected collapsed application navigation to stay narrow. Got ${collapsedWidth}px.`);

    await menuToggle.click({ force: true });
    await page.waitForTimeout(180);

    const expandedState = await page.evaluate(() => {
      const navigationElement = document.querySelector<HTMLElement>("#application-layout-navigation");
      const toggleElement = document.querySelector<HTMLElement>("[data-application-layout-toggle]");
      if (!(navigationElement instanceof HTMLElement) || !(toggleElement instanceof HTMLElement)) {
        return null;
      }

      return {
        collapsed: navigationElement.classList.contains("is-collapsed"),
        width: navigationElement.getBoundingClientRect().width,
        expanded: toggleElement.getAttribute("aria-expanded")
      };
    });

    assert(expandedState, "Expected expanded application layout state to be measurable.");
    assert(!expandedState.collapsed, "Expected application navigation toggle to expand the navigation.");
    assert(expandedState.width >= 220, `Expected expanded application navigation to be visibly wide. Got ${expandedState.width}px.`);
    assert(expandedState.expanded === "true", `Expected application navigation toggle to expose aria-expanded=true, got ${expandedState.expanded}.`);

    await pinToggle.evaluate(element => {
      if (element instanceof HTMLElement) {
        element.click();
      }
    });
    await page.waitForTimeout(120);

    const pinnedState = await page.evaluate(() => {
      const navigationElement = document.querySelector<HTMLElement>("#application-layout-navigation");
      const pinElement = document.querySelector<HTMLElement>("[data-application-layout-pin]");
      if (!(navigationElement instanceof HTMLElement) || !(pinElement instanceof HTMLElement)) {
        return null;
      }

      return {
        pinned: navigationElement.classList.contains("is-pinned"),
        pressed: pinElement.getAttribute("aria-pressed")
      };
    });

    assert(pinnedState, "Expected pinned application layout state to be measurable.");
    assert(pinnedState.pinned, "Expected pin control to apply the pinned navigation state.");
    assert(pinnedState.pressed === "true", `Expected pin control aria-pressed=true after toggling, got ${pinnedState.pressed}.`);

    const mobilePage = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 900, height: 960 }
    });

    await mobilePage.goto(`${origin}${route}`, { waitUntil: "networkidle" });
    await waitForFonts(mobilePage);
    await disableDemoChromeHitTesting(mobilePage);

    const mobileToggle = mobilePage.locator("[data-application-layout-toggle]").first();
    await mobileToggle.click({ force: true });
    await mobilePage.waitForTimeout(180);

    const mobileOpenState = await mobilePage.evaluate(() => {
      const navigationElement = document.querySelector<HTMLElement>("#application-layout-navigation");
      const overlayElement = document.querySelector<HTMLElement>(".bf-navigation-overlay");
      const drawerElement = document.querySelector<HTMLElement>(".bf-navigation-drawer");
      if (!(navigationElement instanceof HTMLElement) || !(overlayElement instanceof HTMLElement) || !(drawerElement instanceof HTMLElement)) {
        return null;
      }

      return {
        collapsed: navigationElement.classList.contains("is-collapsed"),
        overlayHidden: overlayElement.getAttribute("aria-hidden"),
        drawerHidden: drawerElement.getAttribute("aria-hidden"),
        drawerLeft: drawerElement.getBoundingClientRect().left
      };
    });

    assert(mobileOpenState, "Expected mobile application layout state to be measurable.");
    assert(!mobileOpenState.collapsed, "Expected mobile application layout toggle to open the drawer.");
    assert(mobileOpenState.overlayHidden === "false", `Expected mobile navigation overlay to be visible, got aria-hidden=${mobileOpenState.overlayHidden}.`);
    assert(mobileOpenState.drawerHidden === "false", `Expected mobile navigation drawer to be visible, got aria-hidden=${mobileOpenState.drawerHidden}.`);
    assert(mobileOpenState.drawerLeft >= -2, `Expected mobile navigation drawer to be aligned to the viewport edge, got left=${mobileOpenState.drawerLeft}.`);

    await mobilePage.keyboard.press("Escape");
    await mobilePage.waitForTimeout(180);

    const mobileClosedState = await mobilePage.evaluate(() => {
      const navigationElement = document.querySelector<HTMLElement>("#application-layout-navigation");
      const overlayElement = document.querySelector<HTMLElement>(".bf-navigation-overlay");
      if (!(navigationElement instanceof HTMLElement) || !(overlayElement instanceof HTMLElement)) {
        return null;
      }

      return {
        collapsed: navigationElement.classList.contains("is-collapsed"),
        overlayHidden: overlayElement.getAttribute("aria-hidden")
      };
    });

    assert(mobileClosedState, "Expected mobile closed application layout state to be measurable.");
    assert(mobileClosedState.collapsed, "Expected Escape to collapse the mobile navigation drawer.");
    assert(mobileClosedState.overlayHidden === "true", `Expected mobile navigation overlay to hide after Escape, got aria-hidden=${mobileClosedState.overlayHidden}.`);

    await mobilePage.close();
  } finally {
    await browser.close();
  }
}

async function verifyTopNavigation(origin: string): Promise<void> {
  const route = "/demo/components/top-navigation.html";
  const browser = await openBrowser();

  try {
    const desktopPage = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1440, height: 960 }
    });

    await desktopPage.goto(`${origin}${route}`, { waitUntil: "networkidle" });
    await waitForFonts(desktopPage);
    await disableDemoChromeHitTesting(desktopPage);

    const desktopDropdownToggle = desktopPage.locator(".bf-top-navigation-dropdown-toggle").first();
    await desktopDropdownToggle.waitFor({ state: "visible" });
    await desktopDropdownToggle.click({ force: true });
    await desktopPage.waitForTimeout(180);

    const desktopDropdownState = await desktopPage.evaluate(() => {
      const navigationElement = document.querySelector<HTMLElement>("#top-navigation-default");
      const dropdownItem = document.querySelector<HTMLElement>(".bf-top-navigation-item.is-dropdown-toggle");
      const dropdownToggle = dropdownItem?.querySelector<HTMLElement>(".bf-top-navigation-dropdown-toggle");
      const dropdownElement = dropdownItem?.querySelector<HTMLElement>(".bf-top-navigation-dropdown");
      const searchElement = document.querySelector<HTMLElement>(".bf-top-navigation-search");

      if (!(navigationElement instanceof HTMLElement) || !(dropdownItem instanceof HTMLElement) || !(dropdownToggle instanceof HTMLElement) || !(dropdownElement instanceof HTMLElement) || !(searchElement instanceof HTMLElement)) {
        return null;
      }

      const dropdownStyles = getComputedStyle(dropdownElement);

      return {
        menuOpen: Array.from(navigationElement.querySelectorAll<HTMLElement>(".bf-top-navigation-menu-toggle")).some(toggle => toggle.getAttribute("aria-expanded") === "true"),
        searchOpen: searchElement.getAttribute("aria-hidden") === "false",
        dropdownActive: dropdownItem.classList.contains("is-active"),
        expanded: dropdownToggle.getAttribute("aria-expanded"),
        hidden: dropdownElement.getAttribute("aria-hidden"),
        display: dropdownStyles.display,
        position: dropdownStyles.position
      };
    });

    assert(desktopDropdownState, "Expected desktop top-navigation dropdown state to be measurable.");
    assert(!desktopDropdownState.menuOpen && !desktopDropdownState.searchOpen, "Expected desktop dropdown toggle to leave the menu and search states closed.");
    assert(desktopDropdownState.dropdownActive, "Expected desktop dropdown toggle to activate its navigation item.");
    assert(desktopDropdownState.expanded === "true", `Expected desktop dropdown toggle aria-expanded=true, got ${desktopDropdownState.expanded}.`);
    assert(desktopDropdownState.hidden === "false", `Expected desktop dropdown aria-hidden=false, got ${desktopDropdownState.hidden}.`);
    assert(desktopDropdownState.display === "block", `Expected desktop dropdown display to become block, got ${desktopDropdownState.display}.`);
    assert(desktopDropdownState.position === "absolute", `Expected desktop dropdown to be absolutely positioned, got ${desktopDropdownState.position}.`);

    const desktopSearchToggle = desktopPage.locator(".bf-top-navigation-nav .bf-top-navigation-search-toggle").first();
    await desktopSearchToggle.waitFor({ state: "visible" });
    await desktopSearchToggle.click({ force: true });
    await desktopPage.waitForTimeout(180);

    const desktopSearchState = await desktopPage.evaluate(() => {
      const navigationElement = document.querySelector<HTMLElement>("#top-navigation-default");
      const searchElement = document.querySelector<HTMLElement>(".bf-top-navigation-search");
      const overlayElement = document.querySelector<HTMLElement>(".bf-top-navigation-search-overlay");
      const searchInput = document.querySelector<HTMLInputElement>(".bf-top-navigation-search .bf-search-box-input");
      const pressedButton = document.querySelector<HTMLElement>(".bf-top-navigation-nav .bf-top-navigation-search-toggle");
      const dropdownToggle = document.querySelector<HTMLElement>(".bf-top-navigation-dropdown-toggle");
      const dropdownElement = document.querySelector<HTMLElement>(".bf-top-navigation-item.is-dropdown-toggle .bf-top-navigation-dropdown");

      if (!(navigationElement instanceof HTMLElement) || !(searchElement instanceof HTMLElement) || !(overlayElement instanceof HTMLElement) || !(searchInput instanceof HTMLInputElement) || !(pressedButton instanceof HTMLElement) || !(dropdownToggle instanceof HTMLElement) || !(dropdownElement instanceof HTMLElement)) {
        return null;
      }

      return {
        searchOpen: searchElement.getAttribute("aria-hidden") === "false",
        menuOpen: Array.from(navigationElement.querySelectorAll<HTMLElement>(".bf-top-navigation-menu-toggle")).some(toggle => toggle.getAttribute("aria-expanded") === "true"),
        searchHidden: searchElement.getAttribute("aria-hidden"),
        overlayHidden: overlayElement.getAttribute("aria-hidden"),
        activeElementTag: document.activeElement?.tagName ?? null,
        activeElementType: document.activeElement instanceof HTMLInputElement ? document.activeElement.type : null,
        pressed: pressedButton.getAttribute("aria-pressed"),
        dropdownExpanded: dropdownToggle.getAttribute("aria-expanded"),
        dropdownHidden: dropdownElement.getAttribute("aria-hidden")
      };
    });

    assert(desktopSearchState, "Expected desktop top-navigation search state to be measurable.");
    assert(desktopSearchState.searchOpen, "Expected desktop search toggle to open the search state.");
    assert(!desktopSearchState.menuOpen, "Expected desktop search toggle to leave the menu state closed.");
    assert(desktopSearchState.searchHidden === "false", `Expected top-navigation search aria-hidden=false, got ${desktopSearchState.searchHidden}.`);
    assert(desktopSearchState.overlayHidden === "false", `Expected top-navigation overlay aria-hidden=false, got ${desktopSearchState.overlayHidden}.`);
    assert(desktopSearchState.activeElementTag === "INPUT" && desktopSearchState.activeElementType === "search", "Expected desktop search toggle to focus the search input.");
    assert(desktopSearchState.pressed === "true", `Expected desktop search toggle aria-pressed=true, got ${desktopSearchState.pressed}.`);
    assert(desktopSearchState.dropdownExpanded === "false", `Expected desktop search opening to collapse dropdown toggles, got aria-expanded=${desktopSearchState.dropdownExpanded}.`);
    assert(desktopSearchState.dropdownHidden === "true", `Expected desktop search opening to hide dropdown menus, got aria-hidden=${desktopSearchState.dropdownHidden}.`);

    const overlay = desktopPage.locator(".bf-top-navigation-search-overlay");
    const overlayBox = await overlay.boundingBox();
    assert(overlayBox, "Expected top-navigation overlay to expose a measurable bounding box.");
    await desktopPage.mouse.click(overlayBox.x + 32, overlayBox.y + 32);
    await desktopPage.waitForTimeout(180);

    const desktopClosedState = await desktopPage.evaluate(() => {
      const navigationElement = document.querySelector<HTMLElement>("#top-navigation-default");
      const searchElement = document.querySelector<HTMLElement>(".bf-top-navigation-search");
      const overlayElement = document.querySelector<HTMLElement>(".bf-top-navigation-search-overlay");

      if (!(navigationElement instanceof HTMLElement) || !(searchElement instanceof HTMLElement) || !(overlayElement instanceof HTMLElement)) {
        return null;
      }

      return {
        searchOpen: searchElement.getAttribute("aria-hidden") === "false",
        menuOpen: Array.from(navigationElement.querySelectorAll<HTMLElement>(".bf-top-navigation-menu-toggle")).some(toggle => toggle.getAttribute("aria-expanded") === "true"),
        searchHidden: searchElement.getAttribute("aria-hidden"),
        overlayHidden: overlayElement.getAttribute("aria-hidden")
      };
    });

    assert(desktopClosedState, "Expected desktop top-navigation closed state to be measurable.");
    assert(!desktopClosedState.searchOpen && !desktopClosedState.menuOpen, "Expected overlay click to close desktop top-navigation search state.");
    assert(desktopClosedState.searchHidden === "true", `Expected top-navigation search aria-hidden=true after overlay close, got ${desktopClosedState.searchHidden}.`);
    assert(desktopClosedState.overlayHidden === "true", `Expected top-navigation overlay aria-hidden=true after overlay close, got ${desktopClosedState.overlayHidden}.`);

    const desktopAccountDropdownToggle = desktopPage.locator(".bf-top-navigation-item.is-right-shifted .bf-top-navigation-dropdown-toggle");
    await desktopAccountDropdownToggle.waitFor({ state: "visible" });
    await desktopAccountDropdownToggle.click({ force: true });
    await desktopPage.waitForTimeout(180);

    const desktopAccountDropdownState = await desktopPage.evaluate(() => {
      const dropdownItem = document.querySelector<HTMLElement>(".bf-top-navigation-item.is-right-shifted.is-dropdown-toggle");
      const dropdownToggle = dropdownItem?.querySelector<HTMLElement>(".bf-top-navigation-dropdown-toggle");
      const dropdownElement = dropdownItem?.querySelector<HTMLElement>(".bf-top-navigation-dropdown");

      if (!(dropdownItem instanceof HTMLElement) || !(dropdownToggle instanceof HTMLElement) || !(dropdownElement instanceof HTMLElement)) {
        return null;
      }

      return {
        active: dropdownItem.classList.contains("is-active"),
        expanded: dropdownToggle.getAttribute("aria-expanded"),
        hidden: dropdownElement.getAttribute("aria-hidden")
      };
    });

    assert(desktopAccountDropdownState, "Expected right-aligned desktop dropdown state to be measurable.");
    assert(desktopAccountDropdownState.active, "Expected the right-aligned desktop dropdown to open.");
    assert(desktopAccountDropdownState.expanded === "true", `Expected right-aligned desktop dropdown aria-expanded=true, got ${desktopAccountDropdownState.expanded}.`);
    assert(desktopAccountDropdownState.hidden === "false", `Expected right-aligned desktop dropdown aria-hidden=false, got ${desktopAccountDropdownState.hidden}.`);

    const desktopActionItem = desktopPage.locator(".bf-top-navigation-item.is-right-shifted .bf-top-navigation-dropdown button.bf-top-navigation-dropdown-item").first();
    await desktopActionItem.waitFor({ state: "visible" });
    await desktopActionItem.click({ force: true });
    await desktopPage.waitForTimeout(180);

    const desktopActionCloseState = await desktopPage.evaluate(() => {
      const dropdownItem = document.querySelector<HTMLElement>(".bf-top-navigation-item.is-right-shifted.is-dropdown-toggle");
      const dropdownToggle = dropdownItem?.querySelector<HTMLElement>(".bf-top-navigation-dropdown-toggle");
      const dropdownElement = dropdownItem?.querySelector<HTMLElement>(".bf-top-navigation-dropdown");

      if (!(dropdownItem instanceof HTMLElement) || !(dropdownToggle instanceof HTMLElement) || !(dropdownElement instanceof HTMLElement)) {
        return null;
      }

      return {
        active: dropdownItem.classList.contains("is-active"),
        expanded: dropdownToggle.getAttribute("aria-expanded"),
        hidden: dropdownElement.getAttribute("aria-hidden")
      };
    });

    assert(desktopActionCloseState, "Expected action-item close state to be measurable.");
    assert(!desktopActionCloseState.active, "Expected activating a dropdown action item to close the desktop dropdown menu.");
    assert(desktopActionCloseState.expanded === "false", `Expected action-item activation to reset desktop dropdown aria-expanded=false, got ${desktopActionCloseState.expanded}.`);
    assert(desktopActionCloseState.hidden === "true", `Expected action-item activation to hide desktop dropdown menus, got aria-hidden=${desktopActionCloseState.hidden}.`);

    await desktopAccountDropdownToggle.click({ force: true });
    await desktopPage.waitForTimeout(180);

    await desktopPage.mouse.click(32, 320);
    await desktopPage.waitForTimeout(180);

    const desktopOutsideCloseState = await desktopPage.evaluate(() => {
      const dropdownItem = document.querySelector<HTMLElement>(".bf-top-navigation-item.is-right-shifted.is-dropdown-toggle");
      const dropdownToggle = dropdownItem?.querySelector<HTMLElement>(".bf-top-navigation-dropdown-toggle");
      const dropdownElement = dropdownItem?.querySelector<HTMLElement>(".bf-top-navigation-dropdown");

      if (!(dropdownItem instanceof HTMLElement) || !(dropdownToggle instanceof HTMLElement) || !(dropdownElement instanceof HTMLElement)) {
        return null;
      }

      return {
        active: dropdownItem.classList.contains("is-active"),
        expanded: dropdownToggle.getAttribute("aria-expanded"),
        hidden: dropdownElement.getAttribute("aria-hidden")
      };
    });

    assert(desktopOutsideCloseState, "Expected desktop outside-click dropdown state to be measurable.");
    assert(!desktopOutsideCloseState.active, "Expected outside clicks to close desktop dropdown menus.");
    assert(desktopOutsideCloseState.expanded === "false", `Expected outside clicks to reset desktop dropdown aria-expanded=false, got ${desktopOutsideCloseState.expanded}.`);
    assert(desktopOutsideCloseState.hidden === "true", `Expected outside clicks to hide desktop dropdown menus, got aria-hidden=${desktopOutsideCloseState.hidden}.`);

    await desktopPage.close();

    const mobilePage = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 640, height: 960 }
    });

    await mobilePage.goto(`${origin}${route}`, { waitUntil: "networkidle" });
    await waitForFonts(mobilePage);
    await disableDemoChromeHitTesting(mobilePage);

    const mobileMenuToggle = mobilePage.locator(".bf-top-navigation-menu-toggle").first();
    await mobileMenuToggle.waitFor({ state: "visible" });
    await mobileMenuToggle.click({ force: true });
    await mobilePage.waitForTimeout(180);

    const mobileMenuState = await mobilePage.evaluate(() => {
      const navigationElement = document.querySelector<HTMLElement>("#top-navigation-default");
      const navElement = document.querySelector<HTMLElement>(".bf-top-navigation-nav");
      const menuToggle = document.querySelector<HTMLElement>(".bf-top-navigation-menu-toggle");
      const searchElement = document.querySelector<HTMLElement>(".bf-top-navigation-search");

      if (!(navigationElement instanceof HTMLElement) || !(navElement instanceof HTMLElement) || !(menuToggle instanceof HTMLElement) || !(searchElement instanceof HTMLElement)) {
        return null;
      }

      const navStyles = getComputedStyle(navElement);
      return {
        menuOpen: Array.from(navigationElement.querySelectorAll<HTMLElement>(".bf-top-navigation-menu-toggle")).some(toggle => toggle.getAttribute("aria-expanded") === "true"),
        searchOpen: searchElement.getAttribute("aria-hidden") === "false",
        navHidden: navElement.getAttribute("aria-hidden"),
        navDisplay: navStyles.display,
        expanded: menuToggle.getAttribute("aria-expanded")
      };
    });

    assert(mobileMenuState, "Expected mobile top-navigation menu state to be measurable.");
    assert(mobileMenuState.menuOpen, "Expected mobile menu toggle to open the top-navigation menu state.");
    assert(!mobileMenuState.searchOpen, "Expected mobile menu toggle to leave search closed.");
    assert(mobileMenuState.navHidden === "false", `Expected top-navigation nav aria-hidden=false on mobile open, got ${mobileMenuState.navHidden}.`);
    assert(mobileMenuState.navDisplay === "flex", `Expected top-navigation nav display to become flex on mobile open, got ${mobileMenuState.navDisplay}.`);
    assert(mobileMenuState.expanded === "true", `Expected mobile menu toggle aria-expanded=true, got ${mobileMenuState.expanded}.`);

    const mobileDropdownToggle = mobilePage.locator(".bf-top-navigation-dropdown-toggle").first();
    await mobileDropdownToggle.waitFor({ state: "visible" });
    await mobileDropdownToggle.click({ force: true });
    await mobilePage.waitForTimeout(180);

    const mobileDropdownState = await mobilePage.evaluate(() => {
      const navigationElement = document.querySelector<HTMLElement>("#top-navigation-default");
      const dropdownItem = document.querySelector<HTMLElement>(".bf-top-navigation-item.is-dropdown-toggle");
      const dropdownToggle = dropdownItem?.querySelector<HTMLElement>(".bf-top-navigation-dropdown-toggle");
      const dropdownElement = dropdownItem?.querySelector<HTMLElement>(".bf-top-navigation-dropdown");
      const searchElement = document.querySelector<HTMLElement>(".bf-top-navigation-search");

      if (!(navigationElement instanceof HTMLElement) || !(dropdownItem instanceof HTMLElement) || !(dropdownToggle instanceof HTMLElement) || !(dropdownElement instanceof HTMLElement) || !(searchElement instanceof HTMLElement)) {
        return null;
      }

      const dropdownStyles = getComputedStyle(dropdownElement);

      return {
        menuOpen: Array.from(navigationElement.querySelectorAll<HTMLElement>(".bf-top-navigation-menu-toggle")).some(toggle => toggle.getAttribute("aria-expanded") === "true"),
        searchOpen: searchElement.getAttribute("aria-hidden") === "false",
        dropdownActive: dropdownItem.classList.contains("is-active"),
        expanded: dropdownToggle.getAttribute("aria-expanded"),
        hidden: dropdownElement.getAttribute("aria-hidden"),
        display: dropdownStyles.display
      };
    });

    assert(mobileDropdownState, "Expected mobile top-navigation dropdown state to be measurable.");
    assert(mobileDropdownState.menuOpen, "Expected mobile dropdown expansion to keep the menu state open.");
    assert(!mobileDropdownState.searchOpen, "Expected mobile dropdown expansion to leave search closed.");
    assert(mobileDropdownState.dropdownActive, "Expected mobile dropdown toggle to activate its navigation item.");
    assert(mobileDropdownState.expanded === "true", `Expected mobile dropdown toggle aria-expanded=true, got ${mobileDropdownState.expanded}.`);
    assert(mobileDropdownState.hidden === "false", `Expected mobile dropdown aria-hidden=false, got ${mobileDropdownState.hidden}.`);
    assert(mobileDropdownState.display === "block", `Expected mobile dropdown display to become block, got ${mobileDropdownState.display}.`);

    await mobilePage.keyboard.press("Escape");
    await mobilePage.waitForTimeout(180);

    const mobileClosedState = await mobilePage.evaluate(() => {
      const navigationElement = document.querySelector<HTMLElement>("#top-navigation-default");
      const navElement = document.querySelector<HTMLElement>(".bf-top-navigation-nav");
      const menuToggle = document.querySelector<HTMLElement>(".bf-top-navigation-menu-toggle");
      const dropdownItem = document.querySelector<HTMLElement>(".bf-top-navigation-item.is-dropdown-toggle");
      const dropdownToggle = dropdownItem?.querySelector<HTMLElement>(".bf-top-navigation-dropdown-toggle");
      const dropdownElement = dropdownItem?.querySelector<HTMLElement>(".bf-top-navigation-dropdown");
      const searchElement = document.querySelector<HTMLElement>(".bf-top-navigation-search");

      if (!(navigationElement instanceof HTMLElement) || !(navElement instanceof HTMLElement) || !(menuToggle instanceof HTMLElement) || !(dropdownItem instanceof HTMLElement) || !(dropdownToggle instanceof HTMLElement) || !(dropdownElement instanceof HTMLElement) || !(searchElement instanceof HTMLElement)) {
        return null;
      }

      return {
        menuOpen: Array.from(navigationElement.querySelectorAll<HTMLElement>(".bf-top-navigation-menu-toggle")).some(toggle => toggle.getAttribute("aria-expanded") === "true"),
        searchOpen: searchElement.getAttribute("aria-hidden") === "false",
        navHidden: navElement.getAttribute("aria-hidden"),
        expanded: menuToggle.getAttribute("aria-expanded"),
        dropdownActive: dropdownItem.classList.contains("is-active"),
        dropdownExpanded: dropdownToggle.getAttribute("aria-expanded"),
        dropdownHidden: dropdownElement.getAttribute("aria-hidden")
      };
    });

    assert(mobileClosedState, "Expected mobile top-navigation closed state to be measurable.");
    assert(!mobileClosedState.menuOpen && !mobileClosedState.searchOpen, "Expected Escape to close the mobile top-navigation states.");
    assert(mobileClosedState.navHidden === "true", `Expected top-navigation nav aria-hidden=true after Escape, got ${mobileClosedState.navHidden}.`);
    assert(mobileClosedState.expanded === "false", `Expected mobile menu toggle aria-expanded=false after Escape, got ${mobileClosedState.expanded}.`);
    assert(!mobileClosedState.dropdownActive, "Expected Escape to close active mobile dropdown items.");
    assert(mobileClosedState.dropdownExpanded === "false", `Expected Escape to reset mobile dropdown aria-expanded=false, got ${mobileClosedState.dropdownExpanded}.`);
    assert(mobileClosedState.dropdownHidden === "true", `Expected Escape to hide mobile dropdown menus, got aria-hidden=${mobileClosedState.dropdownHidden}.`);

    await mobilePage.close();
  } finally {
    await browser.close();
  }
}

async function verifyBodySizedUiTypography(origin: string): Promise<void> {
  const demos = [
    { route: "/demo/components/chip.html", selector: ".bf-chip", label: "chip" },
    { route: "/demo/components/status-label.html", selector: ".bf-status-label", label: "status label" },
    { route: "/demo/components/badge.html", selector: ".bf-badge", label: "badge" }
  ] as const;
  const tiers = ["editorial", "documentation", "app", "os"] as const;
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1440, height: 960 }
    });

    for (const demo of demos) {
      await page.goto(`${origin}${demo.route}`, { waitUntil: "networkidle" });
      await waitForFonts(page);
      await disableDemoChromeHitTesting(page);

      const tierSelect = page.locator("[data-page-chrome-tier-select]");
      await tierSelect.waitFor({ state: "visible" });

      for (const tier of tiers) {
        await tierSelect.selectOption(tier);
        await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
        await page.waitForTimeout(180);

        const state = await page.evaluate(({ selector }) => {
          const target = document.querySelector(selector);
          const body = document.body;

          if (!(target instanceof HTMLElement) || !(body instanceof HTMLElement)) {
            return null;
          }

          const targetStyles = getComputedStyle(target);
          const bodyStyles = getComputedStyle(body);
          const probe = document.createElement("span");
          probe.style.fontSize = "var(--bf-body-font-size)";
          probe.style.lineHeight = "var(--bf-body-line-height)";
          probe.style.position = "absolute";
          probe.style.visibility = "hidden";
          body.appendChild(probe);
          const probeStyles = getComputedStyle(probe);
          const resolvedBodyFontSize = probeStyles.fontSize;
          const resolvedBodyLineHeight = probeStyles.lineHeight;
          probe.remove();

          return {
            bodyTier: body.dataset.bfTier ?? null,
            bodyFontSize: bodyStyles.fontSize,
            bodyLineHeight: bodyStyles.lineHeight,
            bodyRoleFontSize: bodyStyles.getPropertyValue("--bf-body-font-size").trim(),
            bodyRoleLineHeight: bodyStyles.getPropertyValue("--bf-body-line-height").trim(),
            resolvedBodyFontSize,
            resolvedBodyLineHeight,
            targetFontSize: targetStyles.fontSize,
            targetLineHeight: targetStyles.lineHeight
          };
        }, { selector: demo.selector });

        assert(state, `Expected ${demo.label} typography state to be measurable in ${tier}.`);
        assert(state.bodyTier === tier, `Expected ${demo.label} page to switch to ${tier}, got ${state.bodyTier}.`);
        assert(state.targetFontSize === state.resolvedBodyFontSize, `Expected ${demo.label} font-size to match the active body role in ${tier}. Body role ${state.bodyRoleFontSize} (${state.resolvedBodyFontSize}), target ${state.targetFontSize}.`);
        assert(state.targetLineHeight === state.resolvedBodyLineHeight, `Expected ${demo.label} line-height to match the active body role in ${tier}. Body role ${state.bodyRoleLineHeight} (${state.resolvedBodyLineHeight}), target ${state.targetLineHeight}.`);
      }
    }

    await page.close();
  } finally {
    await browser.close();
  }
}

async function verifySkipLink(origin: string): Promise<void> {
  const route = "/demo/components/skip-link.html";
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1440, height: 960 }
    });

    await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);

    const hiddenState = await page.locator(".bf-skip-link").evaluate(element => {
      const rect = element.getBoundingClientRect();
      const styles = getComputedStyle(element);
      return {
        left: rect.left,
        top: rect.top,
        position: styles.position
      };
    });

    assert(hiddenState.position === "absolute", `Expected unfocused skip-link to stay absolutely positioned off-canvas, got ${hiddenState.position}.`);
    assert(hiddenState.left < -100 && hiddenState.top < -100, `Expected unfocused skip-link to sit off-canvas, got left=${hiddenState.left}, top=${hiddenState.top}.`);

    const skipLink = page.locator(".bf-skip-link");
    await skipLink.focus();
    await page.waitForTimeout(80);

    const focusedState = await skipLink.evaluate(element => {
      const rect = element.getBoundingClientRect();
      const styles = getComputedStyle(element);
      return {
        left: rect.left,
        top: rect.top,
        position: styles.position,
        outlineStyle: styles.outlineStyle
      };
    });

    assert(focusedState.position === "fixed", `Expected focused skip-link to switch to fixed positioning, got ${focusedState.position}.`);
    assert(focusedState.left >= 0 && focusedState.top >= 0, `Expected focused skip-link to become visible in the viewport, got left=${focusedState.left}, top=${focusedState.top}.`);
    assert(focusedState.outlineStyle !== "none", "Expected focused skip-link to expose an outline.");

    await skipLink.click();
    await page.waitForTimeout(80);

    const activatedState = await page.evaluate(() => ({
      hash: window.location.hash,
      targetId: document.activeElement instanceof HTMLElement ? document.activeElement.id : null
    }));

    assert(activatedState.hash === "#skip-link-target", `Expected skip-link activation to target #skip-link-target, got ${activatedState.hash}.`);
  } finally {
    await browser.close();
  }
}

async function main(): Promise<void> {
  const rootDir = path.resolve(".");
  const { server, origin } = await createStaticServer(rootDir);

  try {
    await verifyPinnedAsideResize(origin);
    await verifyDrawerOverlay(origin);
    await verifyApplicationLayout(origin);
    await verifyTopNavigation(origin);
    await verifyBodySizedUiTypography(origin);
    await verifySkipLink(origin);

    console.log("Component behavior verification passed.");
  } finally {
    await closeServer(server);
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
