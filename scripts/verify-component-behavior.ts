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

async function verifyPageChromeNavigationScroll(origin: string): Promise<void> {
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1440, height: 720 }
    });
    const storageKey = "bf-demo-page-navigation-scroll-top";
    const targetRoute = "/demo/components/notification.html";

    await page.goto(`${origin}/index.html`, { waitUntil: "networkidle" });
    await page.evaluate(key => sessionStorage.removeItem(key), storageKey);
    const targetLink = page.locator(`.pc-nav a[href='${targetRoute}']`);
    await targetLink.scrollIntoViewIfNeeded();
    const scrollBeforeNavigation = await page.locator(".pc-nav").evaluate(nav => nav.scrollTop);
    assert(scrollBeforeNavigation > 0, "Expected the notification catalog link to require a scrolled navigation position.");

    await Promise.all([
      page.waitForURL(`**${targetRoute}`),
      targetLink.click()
    ]);
    await page.locator(`.pc-nav a[href='${targetRoute}'][aria-current='page']`).waitFor({ state: "visible" });
    await page.waitForTimeout(80);

    const readNavigationState = () => page.evaluate(() => {
      const nav = document.querySelector<HTMLElement>(".pc-nav");
      const active = nav?.querySelector<HTMLElement>(".bf-side-navigation-link[aria-current='page']");
      if (!nav || !active) return null;
      const navRect = nav.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      return {
        activeVisible: activeRect.top >= navRect.top && activeRect.bottom <= navRect.bottom,
        scrollTop: nav.scrollTop
      };
    });

    const navigatedState = await readNavigationState();
    assert(navigatedState?.activeVisible && navigatedState.scrollTop > 0, "Expected page navigation to preserve its scrolled position and keep the clicked entry visible.");

    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(80);
    const reloadedState = await readNavigationState();
    assert(reloadedState?.activeVisible && Math.abs(reloadedState.scrollTop - navigatedState.scrollTop) <= 1, `Expected page navigation scroll to survive reload; before=${navigatedState.scrollTop}, after=${reloadedState?.scrollTop}.`);

    await page.evaluate(key => sessionStorage.removeItem(key), storageKey);
    await page.goto(`${origin}/demo/components/data-spotlight.html`, { waitUntil: "networkidle" });
    await page.waitForTimeout(80);
    const directState = await readNavigationState();
    assert(directState?.activeVisible && directState.scrollTop > 0, "Expected a direct deep demo route to scroll its active catalog entry into view without stored state.");
  } finally {
    await browser.close();
  }
}

async function verifyExamplePreferencesBeforePaint(origin: string): Promise<void> {
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1440, height: 900 }
    });

    await page.goto(`${origin}/index.html`, { waitUntil: "networkidle" });
    await page.evaluate(() => {
      localStorage.setItem("baseline-foundry:living-spec-tier", "app");
      localStorage.setItem("baseline-foundry:living-spec-tone", "dark");
    });

    await page.route("**/demo/example-page.js", route => route.abort());
    await page.goto(`${origin}/examples/spacing/element-vs-container.html`, { waitUntil: "load" });

    const preRuntimeState = await page.evaluate(() => ({
      background: getComputedStyle(document.body).backgroundColor,
      colorScheme: document.documentElement.style.colorScheme,
      firstElementIsInitializer: document.body.firstElementChild?.getAttribute("src") === "../../demo/example-page-init.js",
      ready: document.body.dataset.examplePreferencesReady,
      tier: document.body.dataset.bfTier,
      tone: document.body.classList.contains("is-dark") ? "dark" : "light"
    }));

    assert(preRuntimeState.firstElementIsInitializer, "Expected the synchronous example preference initializer to be the first body element.");
    assert(preRuntimeState.ready === "true", "Expected example preferences to be resolved before the deferred page runtime.");
    assert(preRuntimeState.tier === "app" && preRuntimeState.tone === "dark", `Expected saved app/dark preferences before runtime; got ${preRuntimeState.tier}/${preRuntimeState.tone}.`);
    assert(preRuntimeState.colorScheme === "dark" && preRuntimeState.background === "rgb(32, 32, 32)", `Expected the first styled example state to use the saved dark App surface; got ${preRuntimeState.colorScheme}/${preRuntimeState.background}.`);
  } finally {
    await browser.close();
  }
}

async function verifyExampleMainClearsPageNavigation(origin: string): Promise<void> {
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1440, height: 900 }
    });

    await page.goto(`${origin}/examples/spacing/app-provisions.html`, { waitUntil: "networkidle" });
    const geometry = await page.evaluate(() => {
      const nav = document.querySelector<HTMLElement>(".pc-nav");
      const main = document.querySelector<HTMLElement>("main[data-example-grid-target]");
      const heading = main?.querySelector<HTMLElement>("h1");
      if (!nav || !main || !heading) {
        return null;
      }

      const navRect = nav.getBoundingClientRect();
      const mainRect = main.getBoundingClientRect();
      const headingRect = heading.getBoundingClientRect();
      return {
        headingVisible: headingRect.width > 0 && headingRect.height > 0,
        mainStartsAfterNavigation: mainRect.left >= navRect.right - 1,
        mainWidth: mainRect.width,
        navRight: navRect.right
      };
    });

    assert(geometry?.headingVisible, "Expected App Provisions to render visible main-area content.");
    assert(geometry.mainStartsAfterNavigation && geometry.mainWidth > 600, `Expected App Provisions main content to clear the fixed navigation; nav right=${geometry.navRight}, main width=${geometry.mainWidth}.`);
  } finally {
    await browser.close();
  }
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

    const viewportFillState = await page.evaluate(() => {
      const application = document.querySelector<HTMLElement>(".bf-application");
      if (!(application instanceof HTMLElement)) {
        return null;
      }

      application.removeAttribute("style");
      application.classList.add("is-fill");
      document.body.replaceChildren(application);
      const rect = application.getBoundingClientRect();
      return {
        blockSize: getComputedStyle(application).blockSize,
        height: rect.height,
        bottom: rect.bottom
      };
    });

    assert(viewportFillState, "Expected full-viewport application state to be measurable.");
    assert(viewportFillState.blockSize === "960px", `Expected the full-viewport application modifier to resolve against the dynamic viewport. Got block-size=${viewportFillState.blockSize}.`);
    assert(Math.abs(viewportFillState.height - 960) <= 1, `Expected the full-viewport application modifier to occupy the viewport height. Got height=${viewportFillState.height}px.`);
    assert(Math.abs(viewportFillState.bottom - 960) <= 1, `Expected the full-viewport application modifier to reach the viewport bottom edge. Got bottom=${viewportFillState.bottom}px.`);

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

      assert(Number.parseFloat(child.marginBottom) >= 0, `Expected application layout header stack child ${child.tag} to keep non-negative element-owned semantic margin. Got ${child.marginBottom}.`);
      assert(Number.parseFloat(child.paddingBlockStart) > 0, `Expected application layout header stack child ${child.tag} to retain metric-derived start compensation. Got ${child.paddingBlockStart}.`);
      assert(Number.parseFloat(child.paddingBlockEnd) > 0, `Expected application layout header stack child ${child.tag} to retain metric-derived end compensation. Got ${child.paddingBlockEnd}.`);
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

    for (const width of [1280, 2560]) {
      await desktopPage.setViewportSize({ width, height: 960 });

      for (const tier of ["editorial", "documentation", "app", "os"] as const) {
        await desktopPage.locator("[data-page-chrome-tier-select]").selectOption(tier);
        const taggedGeometry = await desktopPage.evaluate(() => {
        const navigation = document.querySelector<HTMLElement>("#top-navigation-default");
        const row = navigation?.querySelector<HTMLElement>(".bf-top-navigation-row");
        const banner = navigation?.querySelector<HTMLElement>(".bf-top-navigation-banner");
        const primaryNavigation = navigation?.querySelector<HTMLElement>(".bf-top-navigation-nav");
        const contentGrid = document.querySelector<HTMLElement>("[data-baseline-label='top navigation content grid']");
        const active = navigation?.querySelector<HTMLElement>(".bf-top-navigation-item.is-selected > .bf-top-navigation-link");
        const logoLink = navigation?.querySelector<HTMLElement>(".bf-top-navigation-logo.is-canonical-tagged > .bf-top-navigation-link");
        const tag = navigation?.querySelector<HTMLElement>(".bf-top-navigation-logo-tag");
        const icon = navigation?.querySelector<SVGSVGElement>(".bf-top-navigation-logo-icon");
        const title = navigation?.querySelector<HTMLElement>(".bf-top-navigation-logo-title");
        if (!navigation || !row || !banner || !primaryNavigation || !contentGrid || !active || !logoLink || !tag || !icon || !title) return null;

        const navigationRect = navigation.getBoundingClientRect();
        const rowRect = row.getBoundingClientRect();
        const bannerRect = banner.getBoundingClientRect();
        const primaryNavigationRect = primaryNavigation.getBoundingClientRect();
        const contentGridRect = contentGrid.getBoundingClientRect();
        const activeRect = active.getBoundingClientRect();
        const tagRect = tag.getBoundingClientRect();
        const iconRect = icon.getBoundingClientRect();
        const titleRect = title.getBoundingClientRect();
        const rowStyles = getComputedStyle(row);
        const contentGridStyles = getComputedStyle(contentGrid);
        const tagStyles = getComputedStyle(tag);
        const iconStyles = getComputedStyle(icon);
        const titleStyles = getComputedStyle(title);
        const viewBox = icon.viewBox.baseVal;
        const graphicBox = icon.getBBox();
        const graphicScale = iconRect.width / viewBox.width;
        const titleFirstLineCentre = titleRect.top
          + Number.parseFloat(titleStyles.paddingBlockStart)
          + (Number.parseFloat(titleStyles.lineHeight) / 2);
        const iconCentre = iconRect.top + (iconRect.height / 2);
        const tagCentre = tagRect.top + (tagRect.height / 2);
        const graphicInlineCentre = iconRect.left
          + ((graphicBox.x + (graphicBox.width / 2) - viewBox.x) * graphicScale);
        const contentGutter = Number.parseFloat(contentGridStyles.columnGap);
        const contentTrack = (contentGridRect.width - (contentGutter * 7)) / 8;
        return {
          tier: document.body.dataset.bfTier,
          barThicknessToken: getComputedStyle(navigation).getPropertyValue("--bf-bar-thickness").trim(),
          activeShadow: getComputedStyle(active).boxShadow,
          rowLeft: rowRect.left,
          rowWidth: rowRect.width,
          contentGridLeft: contentGridRect.left,
          contentGridWidth: contentGridRect.width,
          bannerLeft: bannerRect.left,
          bannerWidth: bannerRect.width,
          primaryNavigationLeft: primaryNavigationRect.left,
          thirdContentColumnStart: contentGridRect.left + (2 * (contentTrack + contentGutter)),
          navigationBottom: navigationRect.bottom,
          rowBottom: rowRect.bottom,
          activeBottom: activeRect.bottom,
          rowPaddingStart: Number.parseFloat(rowStyles.paddingBlockStart),
          rowPaddingEnd: Number.parseFloat(rowStyles.paddingBlockEnd),
          tagTopOffset: tagRect.top - navigationRect.top,
          tagWidth: tagRect.width,
          tagHeight: tagRect.height,
          tagAspect: tagRect.height / tagRect.width,
          tagRowEndResidual: rowRect.bottom - tagRect.bottom,
          tagBackground: tagStyles.backgroundColor,
          logoDisplay: getComputedStyle(logoLink).display,
          iconWidth: iconRect.width,
          iconHeight: iconRect.height,
          iconAspect: iconRect.width / iconRect.height,
          sourceAspect: viewBox.width / viewBox.height,
          iconBottomInset: tagRect.bottom - iconRect.bottom,
          iconTagCentreDelta: iconCentre - tagCentre,
          iconTitleFirstLineCentreDelta: Math.abs(iconCentre - titleFirstLineCentre),
          graphicInlineCentreDelta: Math.abs(graphicInlineCentre - (tagRect.left + (tagRect.width / 2))),
          iconOpticalOffsetInline: new DOMMatrixReadOnly(iconStyles.transform).m41
        };
        });
        assert(taggedGeometry, `Expected tagged top-navigation geometry for ${tier} at ${width}px.`);
        assert(taggedGeometry.tier === tier, `Expected tagged top-navigation fixture to use ${tier}, got ${taggedGeometry.tier}.`);
        assert(taggedGeometry.barThicknessToken === "0.1875rem", `Expected ${tier} to expose the shared 0.1875rem emphasis bar, got ${taggedGeometry.barThicknessToken}.`);
        assert(taggedGeometry.activeShadow.includes("-3px"), `Expected ${tier} desktop top-navigation highlight to resolve to 3px, got ${taggedGeometry.activeShadow}.`);
        assert(Math.abs(taggedGeometry.rowLeft - taggedGeometry.contentGridLeft) <= 0.1 && Math.abs(taggedGeometry.rowWidth - taggedGeometry.contentGridWidth) <= 0.1, `Expected ${tier} navigation and content grids to share bounds at ${width}px.`);
        assert(Math.abs(taggedGeometry.bannerLeft - taggedGeometry.contentGridLeft) <= 0.1, `Expected ${tier} banner to begin at content column one at ${width}px.`);
        assert(Math.abs(taggedGeometry.primaryNavigationLeft - taggedGeometry.thirdContentColumnStart) <= 0.1, `Expected ${tier} primary navigation to begin at content column three at ${width}px; nav=${taggedGeometry.primaryNavigationLeft}, column=${taggedGeometry.thirdContentColumnStart}.`);
        assert(taggedGeometry.bannerWidth > 0 && taggedGeometry.primaryNavigationLeft > taggedGeometry.bannerLeft + taggedGeometry.bannerWidth, `Expected ${tier} banner to occupy the first two tracks before the navigation gutter at ${width}px.`);
        assert(taggedGeometry.rowPaddingStart === 0 && taggedGeometry.rowPaddingEnd === 0, `Expected ${tier} top-navigation row to have zero block padding.`);
        assert(Math.abs(taggedGeometry.navigationBottom - taggedGeometry.rowBottom) <= 0.1, `Expected ${tier} navigation and row bottom edges to coincide.`);
        assert(Math.abs(taggedGeometry.rowBottom - taggedGeometry.activeBottom) <= 0.1, `Expected ${tier} active navigation highlight to meet the row boundary.`);
        assert(Math.abs(taggedGeometry.tagTopOffset) <= 0.1, `Expected ${tier} tagged brand block to attach to the navigation top edge.`);
        assert(taggedGeometry.tagBackground === "rgb(233, 84, 32)", `Expected ${tier} tagged brand block to use Ubuntu orange, got ${taggedGeometry.tagBackground}.`);
        assert(taggedGeometry.logoDisplay === "flex", `Expected ${tier} tagged logo to preserve the text-relative flex composition.`);
        assert(Math.abs(taggedGeometry.tagWidth - 22) <= 0.1 && Math.abs(taggedGeometry.tagHeight - 38) <= 0.1, `Expected ${tier} tagged brand block to remain 22px by 38px, got ${taggedGeometry.tagWidth}px by ${taggedGeometry.tagHeight}px.`);
        assert(Math.abs(taggedGeometry.tagAspect - (38 / 22)) <= 0.01, `Expected ${tier} tagged brand block to preserve the 38:22 aspect, got ${taggedGeometry.tagAspect}.`);
        assert(Math.abs(taggedGeometry.tagRowEndResidual - 10) <= 0.1, `Expected ${tier} tag to stop 10px before the occupied row boundary, got ${taggedGeometry.tagRowEndResidual}px.`);
        assert(Math.abs(taggedGeometry.iconWidth - 16) <= 0.1 && Math.abs(taggedGeometry.iconHeight - 16) <= 0.1 && Math.abs(taggedGeometry.iconAspect - 1) <= 0.01, `Expected ${tier} Circle of Friends to use a 16px square icon box, got ${taggedGeometry.iconWidth}px by ${taggedGeometry.iconHeight}px.`);
        assert(taggedGeometry.sourceAspect > 1, `Expected ${tier} fixture to retain the original asymmetric Circle of Friends viewBox.`);
        assert(Math.abs(taggedGeometry.iconBottomInset - 6) <= 0.1, `Expected ${tier} Circle of Friends to keep its fixed 6px tag-bottom inset, got ${taggedGeometry.iconBottomInset}px.`);
        assert(Math.abs(taggedGeometry.iconTagCentreDelta - 5) <= 0.1, `Expected ${tier} Circle of Friends to sit 5px below the tag centre while aligning to the title, got ${taggedGeometry.iconTagCentreDelta}px.`);
        assert(taggedGeometry.iconTitleFirstLineCentreDelta <= 0.1, `Expected ${tier} Circle of Friends to align with the first brand-title line, got ${taggedGeometry.iconTitleFirstLineCentreDelta}px.`);
        assert(taggedGeometry.graphicInlineCentreDelta <= 0.25, `Expected ${tier} Circle of Friends drawing to remain optically centred after compensating for its asymmetric source bounds; got ${taggedGeometry.graphicInlineCentreDelta}px.`);
        assert(Math.abs(taggedGeometry.iconOpticalOffsetInline + 0.2) <= 0.01, `Expected ${tier} Circle of Friends to retain the -0.2px source-viewBox correction, got ${taggedGeometry.iconOpticalOffsetInline}px.`);
      }
    }

    await desktopPage.setViewportSize({ width: 1440, height: 960 });

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

    // Diagram Registry consumes the same mark through an external <img> rather
    // than inline SVG. Exercise that public markup form without a network
    // dependency so square-box sizing and optical translation cannot drift.
    await mobilePage.evaluate(async () => {
      const svg = document.querySelector<SVGSVGElement>("#top-navigation-default .bf-top-navigation-logo-icon");
      if (!svg) return;
      const image = new Image();
      image.className = svg.getAttribute("class") ?? "bf-top-navigation-logo-icon";
      image.alt = "";
      image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.outerHTML)}`;
      svg.replaceWith(image);
      await image.decode();
    });

    const mobileBrandGeometry = await mobilePage.evaluate(() => {
      const navigation = document.querySelector<HTMLElement>("#top-navigation-default");
      const row = navigation?.querySelector<HTMLElement>(".bf-top-navigation-row");
      const tag = navigation?.querySelector<HTMLElement>(".bf-top-navigation-logo-tag");
      const icon = navigation?.querySelector<HTMLImageElement>("img.bf-top-navigation-logo-icon");
      const title = navigation?.querySelector<HTMLElement>(".bf-top-navigation-logo-title");
      if (!navigation || !row || !tag || !icon || !title) return null;
      const navigationRect = navigation.getBoundingClientRect();
      const rowRect = row.getBoundingClientRect();
      const tagRect = tag.getBoundingClientRect();
      const iconRect = icon.getBoundingClientRect();
      const titleRect = title.getBoundingClientRect();
      const titleStyles = getComputedStyle(title);
      const titleFirstLineCentre = titleRect.top
        + Number.parseFloat(titleStyles.paddingBlockStart)
        + (Number.parseFloat(titleStyles.lineHeight) / 2);
      return {
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        rowPaddingStart: Number.parseFloat(getComputedStyle(row).paddingBlockStart),
        rowPaddingEnd: Number.parseFloat(getComputedStyle(row).paddingBlockEnd),
        rowBottomDelta: Math.abs(navigationRect.bottom - rowRect.bottom),
        tagTopOffset: tagRect.top - navigationRect.top,
        tagWidth: tagRect.width,
        tagHeight: tagRect.height,
        tagRowEndResidual: rowRect.bottom - tagRect.bottom,
        tagBackground: getComputedStyle(tag).backgroundColor,
        iconElement: icon.tagName,
        iconOpticalOffsetInline: new DOMMatrixReadOnly(getComputedStyle(icon).transform).m41,
        iconWidth: iconRect.width,
        iconHeight: iconRect.height,
        iconBottomInset: tagRect.bottom - iconRect.bottom,
        iconTagCentreDelta: (iconRect.top + iconRect.height / 2) - (tagRect.top + tagRect.height / 2),
        iconTitleFirstLineCentreDelta: Math.abs((iconRect.top + iconRect.height / 2) - titleFirstLineCentre)
      };
    });
    assert(mobileBrandGeometry, "Expected mobile tagged-brand geometry.");
    assert(mobileBrandGeometry.overflow <= 0, `Expected mobile tagged navigation not to overflow, got ${mobileBrandGeometry.overflow}px.`);
    assert(mobileBrandGeometry.rowPaddingStart === 0 && mobileBrandGeometry.rowPaddingEnd === 0, "Expected mobile navigation row to have zero block padding.");
    assert(mobileBrandGeometry.rowBottomDelta <= 0.1 && Math.abs(mobileBrandGeometry.tagTopOffset) <= 0.1, "Expected mobile row and orange tag to attach to the navigation edges.");
    assert(mobileBrandGeometry.tagBackground === "rgb(233, 84, 32)", `Expected mobile tagged brand block to use Ubuntu orange, got ${mobileBrandGeometry.tagBackground}.`);
    assert(mobileBrandGeometry.iconElement === "IMG", `Expected mobile tagged-brand probe to exercise Registry's external image markup, got ${mobileBrandGeometry.iconElement}.`);
    assert(Math.abs(mobileBrandGeometry.tagWidth - 22) <= 0.1 && Math.abs(mobileBrandGeometry.tagHeight - 38) <= 0.1, `Expected mobile tag to remain 22px by 38px, got ${mobileBrandGeometry.tagWidth}px by ${mobileBrandGeometry.tagHeight}px.`);
    assert(Math.abs(mobileBrandGeometry.tagRowEndResidual - 10) <= 0.1, `Expected mobile tag to stop 10px before the occupied row boundary, got ${mobileBrandGeometry.tagRowEndResidual}px.`);
    assert(Math.abs(mobileBrandGeometry.iconWidth - 16) <= 0.1 && Math.abs(mobileBrandGeometry.iconHeight - 16) <= 0.1, `Expected mobile Circle of Friends to use a 16px square icon box, got ${mobileBrandGeometry.iconWidth}px by ${mobileBrandGeometry.iconHeight}px.`);
    assert(Math.abs(mobileBrandGeometry.iconBottomInset - 6) <= 0.1, `Expected mobile Circle of Friends to keep its fixed 6px tag-bottom inset, got ${mobileBrandGeometry.iconBottomInset}px.`);
    assert(Math.abs(mobileBrandGeometry.iconOpticalOffsetInline + 0.2) <= 0.01, `Expected mobile external Circle of Friends image to retain the -0.2px source-bound correction, got ${mobileBrandGeometry.iconOpticalOffsetInline}px.`);
    assert(Math.abs(mobileBrandGeometry.iconTagCentreDelta - 5) <= 0.1, `Expected mobile Circle of Friends to sit 5px below the tag centre, got ${mobileBrandGeometry.iconTagCentreDelta}px.`);
    assert(mobileBrandGeometry.iconTitleFirstLineCentreDelta <= 0.1, `Expected mobile Circle of Friends to align with the first brand-title line, got ${mobileBrandGeometry.iconTitleFirstLineCentreDelta}px.`);

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

const contentCardBaselineTolerancePx = 0.75;

async function verifyRenewalCompositionContracts(origin: string): Promise<void> {
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });

    await page.goto(`${origin}/demo/components/article-pagination.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const paginationGeometry = await page.evaluate(() => {
      const nav = document.querySelector<HTMLElement>(".article-pagination-demo-narrow .bf-article-pagination");
      const links = Array.from(nav?.querySelectorAll<HTMLElement>(".bf-article-pagination-link") ?? []);
      const rtlPrevious = document.querySelector<HTMLElement>("[dir='rtl'] .bf-article-pagination-link.is-previous");
      const ltrPrevious = document.querySelector<HTMLElement>(".bf-article-pagination-link.is-previous");
      const rtlPreviousIcon = rtlPrevious?.querySelector<HTMLElement>(".bf-icon");
      const ltrPreviousIcon = ltrPrevious?.querySelector<HTMLElement>(".bf-icon");
      if (!nav || links.length !== 2 || !rtlPreviousIcon || !ltrPreviousIcon) {
        return null;
      }

      const navRect = nav.getBoundingClientRect();
      const linkRects = links.map(link => link.getBoundingClientRect());
      const previousLabel = links[0]?.querySelector<HTMLElement>(".bf-article-pagination-label")?.getBoundingClientRect();
      return {
        navWidth: navRect.width,
        linkWidths: linkRects.map(rect => rect.width),
        linkTops: linkRects.map(rect => rect.top),
        previousLabelWidth: previousLabel?.width ?? 0,
        ltrPreviousTransform: getComputedStyle(ltrPreviousIcon).transform,
        rtlPreviousTransform: getComputedStyle(rtlPreviousIcon).transform
      };
    });
    assert(paginationGeometry, "Expected narrow and RTL article-pagination fixtures.");
    assert(Math.abs(paginationGeometry.linkTops[1] - paginationGeometry.linkTops[0]) <= 1, "Expected narrow article destinations to remain on the same row.");
    assert(paginationGeometry.linkWidths[0] < paginationGeometry.linkWidths[1] && Math.abs((paginationGeometry.linkWidths[0] + paginationGeometry.linkWidths[1]) - paginationGeometry.navWidth) <= 1, "Expected the narrow pair to use Vanilla's compact previous link and the remaining width for next.");
    assert(paginationGeometry.previousLabelWidth <= 1.1, "Expected narrow previous copy to be visually compact while remaining in the accessibility tree.");
    assert(paginationGeometry.ltrPreviousTransform !== paginationGeometry.rtlPreviousTransform, "Expected the previous arrow to reverse visually in RTL.");
    const previousAria = await page.locator(".article-pagination-demo-narrow .bf-article-pagination-link.is-previous").ariaSnapshot();
    assert(previousAria.includes("Previous") && previousAria.includes("Configure the workspace"), `Expected compact previous copy to remain in the accessible link name. Snapshot: ${previousAria}`);
    assert(!/[←→]/.test(previousAria), `Expected decorative arrows to stay out of the accessible link name. Snapshot: ${previousAria}`);

    for (const tier of ["editorial", "documentation", "app", "os"] as const) {
      await page.goto(`${origin}/demo/components/article-pagination.html`, { waitUntil: "networkidle" });
      await waitForFonts(page);
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      const paginationIcon = await page.evaluate(() => {
        const link = document.querySelector<HTMLElement>(".bf-article-pagination-link.is-previous");
        const direction = link?.querySelector<HTMLElement>(".bf-article-pagination-direction");
        const icon = direction?.querySelector<HTMLElement>(".bf-icon");
        const label = direction?.querySelector<HTMLElement>(".bf-article-pagination-label");
        const title = link?.querySelector<HTMLElement>(".bf-article-pagination-title");
        const h5Reference = document.querySelector<HTMLElement>(".bf-h5");
        const rtlLink = document.querySelector<HTMLElement>("[dir='rtl'] .bf-article-pagination-link.is-previous");
        const rtlIcon = rtlLink?.querySelector<HTMLElement>(".bf-icon");
        const rtlLabel = rtlLink?.querySelector<HTMLElement>(".bf-article-pagination-label");
        if (!link || !direction || !icon || !label || !title || !h5Reference || !rtlIcon || !rtlLabel) return null;

        link.focus();
        const iconRect = icon.getBoundingClientRect();
        const labelRect = label.getBoundingClientRect();
        const titleRect = title.getBoundingClientRect();
        const rtlIconRect = rtlIcon.getBoundingClientRect();
        const rtlLabelRect = rtlLabel.getBoundingClientRect();
        const iconStyles = getComputedStyle(icon);
        const linkStyles = getComputedStyle(link);
        const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
        const baselinePx = Number.parseFloat(linkStyles.getPropertyValue("--bf-baseline")) * rootFontSize;
        return {
          tier: document.body.dataset.bfTier,
          iconHeight: iconRect.height,
          iconWidth: iconRect.width,
          iconToLabelGap: labelRect.left - iconRect.right,
          iconLabelCentreDelta: Math.abs((iconRect.top + (iconRect.height / 2)) - (labelRect.top + (labelRect.height / 2))),
          iconSize: iconStyles.getPropertyValue("--bf-icon-size").trim(),
          iconDefaultSize: iconStyles.getPropertyValue("--bf-icon-size-default").trim(),
          expectedMediumGap: baselinePx * 2,
          textEdgeDelta: Math.abs(labelRect.left - titleRect.left),
          titleFontSize: getComputedStyle(title).fontSize,
          h5FontSize: getComputedStyle(h5Reference).fontSize,
          outlineStyle: linkStyles.outlineStyle,
          focused: document.activeElement === link,
          rtlIconIsLogicalLeading: rtlIconRect.left > rtlLabelRect.right,
          rtlTransform: getComputedStyle(rtlIcon).transform
        };
      });
      assert(paginationIcon, `Expected article-pagination icon fixture for ${tier}.`);
      assert(paginationIcon.tier === tier, `Expected article-pagination fixture to use ${tier}, got ${paginationIcon.tier}.`);
      assert(paginationIcon.iconSize === paginationIcon.iconDefaultSize, `Expected ${tier} article-pagination to resolve to the public default icon size.`);
      assert(Math.abs(paginationIcon.iconToLabelGap - paginationIcon.expectedMediumGap) <= 0.1, `Expected ${tier} article-pagination icon/copy separation to map Vanilla medium spacing, got ${paginationIcon.iconToLabelGap}px.`);
      assert(paginationIcon.textEdgeDelta <= 0.1, `Expected ${tier} article-pagination direction and title text edges to align, got ${paginationIcon.textEdgeDelta}px.`);
      assert(paginationIcon.titleFontSize === paginationIcon.h5FontSize, `Expected ${tier} article-pagination title to use the BF h5 role.`);
      assert(paginationIcon.focused && paginationIcon.outlineStyle === "solid", `Expected ${tier} article-pagination focus to remain visible.`);
      assert(paginationIcon.rtlIconIsLogicalLeading && paginationIcon.rtlTransform !== "none", `Expected ${tier} previous icon to stay logical in RTL.`);

      await page.goto(`${origin}/demo/components/button.html`, { waitUntil: "networkidle" });
      await waitForFonts(page);
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      const buttonIcon = await page.evaluate(() => {
        const button = Array.from(document.querySelectorAll<HTMLElement>(".bf-button.is-icon"))
          .find(candidate => candidate.textContent?.includes("Continue"));
        const icon = button?.querySelector<HTMLElement>(".bf-icon");
        const label = button?.querySelector<HTMLElement>(".bf-button-label");
        if (!button || !icon || !label) return null;

        const textRect = label.getBoundingClientRect();
        const iconRect = icon.getBoundingClientRect();
        return {
          iconHeight: iconRect.height,
          iconWidth: iconRect.width,
          textToIconGap: iconRect.left - textRect.right,
          iconSize: getComputedStyle(icon).getPropertyValue("--bf-icon-size").trim()
        };
      });
      assert(buttonIcon, `Expected button-with-icon fixture for ${tier}.`);
      assert(buttonIcon.iconSize === paginationIcon.iconSize, `Expected ${tier} button-with-icon and article-pagination to resolve the same icon-size token.`);
      assert(Math.abs(paginationIcon.iconWidth - buttonIcon.iconWidth) <= 0.1 && Math.abs(paginationIcon.iconHeight - buttonIcon.iconHeight) <= 0.1, `Expected ${tier} article-pagination icon size to match button-with-icon.`);
      assert(paginationIcon.iconLabelCentreDelta <= 0.1, `Expected ${tier} article-pagination icon and direction label to be vertically aligned, got ${paginationIcon.iconLabelCentreDelta}px.`);
    }

    await page.setViewportSize({ width: 1000, height: 1000 });
    await page.goto(`${origin}/demo/components/docs-layout.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const drawerLayout = await page.evaluate(() => {
      const navigation = document.querySelector<HTMLElement>(".bf-docs-layout-navigation");
      const content = document.querySelector<HTMLElement>(".bf-docs-layout-content");
      const toggle = document.querySelector<HTMLElement>(".bf-side-navigation-toggle");
      if (!navigation || !content || !toggle) return null;
      const navigationRect = navigation.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      return {
        navigationWidth: navigationRect.width,
        contentWidth: contentRect.width,
        navigationTop: navigationRect.top,
        contentTop: contentRect.top,
        toggleDisplay: getComputedStyle(toggle).display
      };
    });
    assert(drawerLayout, "Expected docs drawer-mode geometry.");
    assert(Math.abs(drawerLayout.navigationWidth - drawerLayout.contentWidth) <= 1, "Expected docs navigation and content to stay full-width while navigation is a drawer.");
    assert(drawerLayout.contentTop > drawerLayout.navigationTop, "Expected drawer-mode docs content to follow the navigation slot in one column.");
    assert(drawerLayout.toggleDisplay !== "none", "Expected docs drawer toggle to remain available below the desktop breakpoint.");

    await page.setViewportSize({ width: 1100, height: 1000 });
    await page.reload({ waitUntil: "networkidle" });
    await waitForFonts(page);
    const desktopLayout = await page.evaluate(() => {
      const navigation = document.querySelector<HTMLElement>(".bf-docs-layout-navigation");
      const content = document.querySelector<HTMLElement>(".bf-docs-layout-content");
      const toggle = document.querySelector<HTMLElement>(".bf-side-navigation-toggle");
      if (!navigation || !content || !toggle) return null;
      const navigationRect = navigation.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      return {
        navigationWidth: navigationRect.width,
        contentWidth: contentRect.width,
        navigationTop: navigationRect.top,
        contentTop: contentRect.top,
        toggleDisplay: getComputedStyle(toggle).display
      };
    });
    assert(desktopLayout, "Expected docs desktop geometry.");
    assert(desktopLayout.contentWidth > desktopLayout.navigationWidth * 2, "Expected docs desktop content to occupy the six-column region beside the two-column navigation.");
    assert(Math.abs(desktopLayout.contentTop - desktopLayout.navigationTop) <= 1, "Expected docs desktop navigation and content to share a row.");
    assert(desktopLayout.toggleDisplay === "none", "Expected the drawer toggle to disappear when the static desktop navigation is active.");

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${origin}/demo/components/search-and-filter.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const wideControlBottoms = await page.locator(".bf-control-row > *").evaluateAll(elements => elements.map(element => {
      const rect = element.getBoundingClientRect();
      const marginEnd = Number.parseFloat(getComputedStyle(element).marginBlockEnd) || 0;
      return rect.bottom + marginEnd;
    }));
    assert(Math.max(...wideControlBottoms) - Math.min(...wideControlBottoms) <= 1, "Expected wide control-row children to align on their occupied bottom edge.");

    await page.setViewportSize({ width: 620, height: 1000 });
    await page.reload({ waitUntil: "networkidle" });
    await waitForFonts(page);
    const narrowControlTops = await page.locator(".bf-control-row > *").evaluateAll(elements => elements.map(element => element.getBoundingClientRect().top));
    assert(narrowControlTops.length === 3 && new Set(narrowControlTops.map(top => Math.round(top))).size > 1, "Expected narrow control-row children to wrap across more than one row.");

    await page.setViewportSize({ width: 820, height: 800 });
    await page.goto(`${origin}/demo/components/tabs.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tier of ["editorial", "documentation", "app", "os"] as const) {
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      const tabRule = await page.evaluate(() => {
        const list = document.querySelector<HTMLElement>(".bf-tabs-list");
        const active = document.querySelector<HTMLElement>(".bf-tabs-link.is-active, .bf-tabs-link[aria-selected='true']");
        if (!list || !active) return null;
        const styles = getComputedStyle(active);
        return {
          gap: Math.abs(list.getBoundingClientRect().bottom - active.getBoundingClientRect().bottom),
          thickness: Number.parseFloat(styles.borderBottomWidth),
          token: styles.getPropertyValue("--bf-bar-thickness").trim()
        };
      });
      assert(tabRule !== null && tabRule.gap <= 1.1, `Expected ${tier} active tab rule to meet the list boundary, got ${tabRule?.gap}px.`);
      assert(tabRule.thickness === 3 && tabRule.token === "0.1875rem", `Expected ${tier} active tab rule to use the shared 3px/0.1875rem emphasis bar; got ${tabRule.thickness}px/${tabRule.token}.`);
    }

    await page.goto(`${origin}/demo/components/notice.html`, { waitUntil: "networkidle" });
    const noticeSemantics = await page.locator(".bf-notice").evaluateAll(elements => elements.map(element => {
      const styles = getComputedStyle(element);
      return {
        barThickness: Number.parseFloat(styles.borderInlineStartWidth),
        barThicknessToken: styles.getPropertyValue("--bf-bar-thickness").trim(),
        role: element.getAttribute("role"),
        titleTag: element.querySelector(".bf-notice-title")?.tagName ?? null
      };
    }));
    assert(noticeSemantics.length === 5, "Expected all five notice variants in the semantic fixture.");
    assert(noticeSemantics.every(notice => notice.role === "note" && notice.titleTag === "H2"), "Expected static notices to retain note landmarks and semantic h2 titles.");
    assert(noticeSemantics.every(notice => notice.barThickness === 3 && notice.barThicknessToken === "0.1875rem"), "Expected every notice variant to use the shared 3px/0.1875rem emphasis bar.");

    await page.setContent(`<!doctype html><link rel="stylesheet" href="${origin}/dist/tiers/editorial/styles.css"><body class="bf-theme">Scoped reset</body>`);
    await page.waitForFunction(() => Array.from(document.styleSheets).some(sheet => sheet.href?.includes("/dist/tiers/editorial/styles.css")));
    const unscopedMargin = await page.evaluate(() => Number.parseFloat(getComputedStyle(document.body).margin));
    await page.evaluate(() => document.body.classList.add("bf-page-shell"));
    const scopedMargin = await page.evaluate(() => Number.parseFloat(getComputedStyle(document.body).margin));
    assert(unscopedMargin > 0, "Expected a tier import alone to preserve the user-agent body margin.");
    assert(scopedMargin === 0, "Expected the explicit page-shell class to opt into a full-bleed body reset.");
  } finally {
    await browser.close();
  }
}

async function verifyAdversarialResponsiveGeometry(origin: string): Promise<void> {
  const tiers = ["editorial", "documentation", "app", "os"] as const;
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });

    await page.goto(`${origin}/demo/components/article-pagination.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tier of tiers) {
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      const measurements = await page.evaluate((widths) => {
        const nav = document.querySelector<HTMLElement>(".article-pagination-demo-narrow .bf-article-pagination");
        if (!nav) return null;
        const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
        const baselinePx = Number.parseFloat(getComputedStyle(nav).getPropertyValue("--bf-baseline")) * rootFontSize;
        const boundaryNavs = Array.from(document.querySelectorAll<HTMLElement>("[aria-label='First documentation page'], [aria-label='Last documentation page']"));

        const widthsMeasured = widths.map(width => {
          nav.style.inlineSize = `${width}rem`;
          const navRect = nav.getBoundingClientRect();
          const links = Array.from(nav.querySelectorAll<HTMLElement>(".bf-article-pagination-link"));
          const linkRects = links.map(link => link.getBoundingClientRect());
          const visibleTextEdgeDeltas = links.map(link => {
            const labelRect = link.querySelector<HTMLElement>(".bf-article-pagination-label")?.getBoundingClientRect();
            const titleRect = link.querySelector<HTMLElement>(".bf-article-pagination-title")?.getBoundingClientRect();
            if (!labelRect || !titleRect || labelRect.width <= 1.1) return null;
            return link.classList.contains("is-next")
              ? Math.abs(labelRect.right - titleRect.right)
              : Math.abs(labelRect.left - titleRect.left);
          }).filter((delta): delta is number => delta !== null);
          const boundaries = boundaryNavs.map(boundaryNav => {
            boundaryNav.style.inlineSize = `${width}rem`;
            const boundaryNavRect = boundaryNav.getBoundingClientRect();
            const boundaryLink = boundaryNav.querySelector<HTMLElement>(".bf-article-pagination-link");
            const boundaryRect = boundaryLink?.getBoundingClientRect();
            return boundaryRect ? {
              direction: boundaryLink?.classList.contains("is-next") ? "next" : "previous",
              navWidth: boundaryNavRect.width,
              width: boundaryRect.width,
              startOffset: boundaryRect.left - boundaryNavRect.left,
              endOffset: boundaryNavRect.right - boundaryRect.right
            } : null;
          }).filter((boundary): boundary is NonNullable<typeof boundary> => boundary !== null);

          return {
            width,
            navWidth: navRect.width,
            baselinePx,
            columnCount: new Set(linkRects.map(rect => Math.round(rect.left * 10))).size,
            rowCount: new Set(linkRects.map(rect => Math.round(rect.top * 10))).size,
            linkWidths: linkRects.map(rect => rect.width),
            baselineDeltas: linkRects.map(rect => {
              const remainder = rect.height % baselinePx;
              return Math.min(remainder, baselinePx - remainder);
            }),
            expectedGap: width < 28.75 ? 0 : baselinePx * 2,
            visibleTextEdgeDeltas,
            boundaries,
            overflow: Math.max(0, nav.scrollWidth - nav.clientWidth)
          };
        });

        const reversed = nav.cloneNode(true) as HTMLElement;
        reversed.style.cssText = "inline-size: 42rem; position: fixed; inset-block-start: -10000px; inset-inline-start: 0; visibility: hidden;";
        if (reversed.firstElementChild && reversed.lastElementChild) {
          reversed.insertBefore(reversed.lastElementChild, reversed.firstElementChild);
        }
        document.body.append(reversed);
        const reversedPreviousRect = reversed.querySelector<HTMLElement>(".is-previous")?.getBoundingClientRect();
        const reversedNextRect = reversed.querySelector<HTMLElement>(".is-next")?.getBoundingClientRect();
        const sourceOrderIndependent = Boolean(reversedPreviousRect && reversedNextRect && reversedPreviousRect.left < reversedNextRect.left);
        reversed.remove();

        return { widthsMeasured, sourceOrderIndependent };
      }, [19, 28.74, 28.75, 29, 38.25, 42]);

      assert(measurements, `Expected article-pagination threshold measurements for ${tier}.`);
      assert(measurements.sourceOrderIndependent, `Expected ${tier} article-pagination direction modifiers to place reversed-source links logically.`);
      for (const measurement of measurements.widthsMeasured) {
        const compact = measurement.width < 28.75;
        assert(measurement.columnCount === 2, `Expected ${tier} article pagination at ${measurement.width}rem to retain two logical destinations, got ${measurement.columnCount}.`);
        assert(measurement.rowCount === 1, `Expected ${tier} article pagination at ${measurement.width}rem to retain one row, got ${measurement.rowCount}.`);
        assert(Math.abs((measurement.linkWidths[0] + measurement.linkWidths[1] + measurement.expectedGap) - measurement.navWidth) <= 1, `Expected ${tier} article pagination at ${measurement.width}rem to fill the row without overflow or a missing gap.`);
        if (compact) {
          assert(Math.abs(measurement.linkWidths[0] - (measurement.baselinePx * 7)) <= 1, `Expected ${tier} compact previous link at ${measurement.width}rem to map Vanilla's combined 7-unit inline reservation.`);
          assert(measurement.linkWidths[0] < measurement.linkWidths[1], `Expected ${tier} compact previous link at ${measurement.width}rem to leave remaining space to next.`);
        } else {
          assert(Math.abs(measurement.linkWidths[0] - measurement.linkWidths[1]) <= 1, `Expected ${tier} article destinations at ${measurement.width}rem to retain equal Vanilla halves.`);
        }
        assert(measurement.visibleTextEdgeDeltas.every(delta => delta <= 0.1), `Expected ${tier} article-pagination label/title text edges to align at ${measurement.width}rem; deltas=${measurement.visibleTextEdgeDeltas.join(", ")}.`);
        for (const boundary of measurement.boundaries) {
          const expectedBoundaryWidth = compact ? boundary.navWidth : (boundary.navWidth - measurement.expectedGap) / 2;
          assert(Math.abs(boundary.width - expectedBoundaryWidth) <= 1, `Expected ${tier} ${boundary.direction}-only destination at ${measurement.width}rem to occupy the ${compact ? "full row" : "directional half"}.`);
          assert(compact || (boundary.direction === "previous" ? boundary.startOffset <= 1 : boundary.endOffset <= 1), `Expected ${tier} ${boundary.direction}-only destination at ${measurement.width}rem to align to its logical edge.`);
        }
        assert(measurement.baselineDeltas.every(delta => delta <= 0.11), `Expected ${tier} article links at ${measurement.width}rem to retain baseline-snapped block sizes; deltas=${measurement.baselineDeltas.join(", ")}.`);
        assert(measurement.overflow <= 1, `Expected ${tier} article pagination at ${measurement.width}rem to avoid inline overflow, got ${measurement.overflow}px.`);
      }
    }

    await page.goto(`${origin}/demo/components/tiered-list.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tier of tiers) {
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      const measurements = await page.evaluate((widths) => {
        const selectors = {
          default: ".bf-tiered-list:not(.is-description-full-width):not(.is-list-full-width):not(.is-flush):not(.is-triple)",
          fullWidth: ".bf-tiered-list.is-list-full-width",
          flush: ".bf-tiered-list.is-flush",
          triple: ".bf-tiered-list.is-triple"
        } as const;

        return widths.map(width => {
          const variants = Object.fromEntries(Object.entries(selectors).map(([name, selector]) => {
            const component = document.querySelector<HTMLElement>(selector);
            const item = component?.querySelector<HTMLElement>(".bf-tiered-list-item");
            const rule = item?.querySelector<HTMLElement>(".bf-rule");
            const title = item?.querySelector<HTMLElement>(".bf-tiered-list-item-title, .bf-tiered-list-item-label");
            const description = item?.querySelector<HTMLElement>(".bf-tiered-list-item-description, .bf-tiered-list-item-role, .bf-tiered-list-item-value");
            if (!component || !item || !rule || !title || !description) return [name, null];

            component.style.inlineSize = `${width}rem`;
            const itemRect = item.getBoundingClientRect();
            const ruleRect = rule.getBoundingClientRect();
            const titleRect = title.getBoundingClientRect();
            const descriptionRect = description.getBoundingClientRect();
            const gridColumns = getComputedStyle(item).gridTemplateColumns.trim().split(/\s+/).filter(Boolean).length;
            return [name, {
              gridColumns,
              overflow: Math.max(0, component.scrollWidth - component.clientWidth),
              ruleStartOffset: ruleRect.left - itemRect.left,
              ruleEndDelta: itemRect.right - ruleRect.right,
              ruleBottom: ruleRect.bottom,
              titleStartOffset: titleRect.left - itemRect.left,
              titleTop: titleRect.top,
              descriptionStartOffset: descriptionRect.left - itemRect.left,
              descriptionTop: descriptionRect.top
            }];
          }));

          return { width, variants };
        });
      }, [38.74, 38.75]);

      assert(measurements, `Expected tiered-list threshold measurements for ${tier}.`);
      for (const measurement of measurements) {
        const { default: defaultVariant, fullWidth, flush, triple } = measurement.variants;
        assert(defaultVariant && fullWidth && flush && triple, `Expected all tiered-list variants at ${measurement.width}rem for ${tier}.`);
        const aboveBreakpoint = measurement.width === 38.75;
        assert(defaultVariant.gridColumns === (aboveBreakpoint ? 8 : 1), `Expected ${tier} default tiered list at ${measurement.width}rem to use ${aboveBreakpoint ? "eight" : "one"} explicit column(s), got ${defaultVariant.gridColumns}.`);
        assert(fullWidth.gridColumns === 1, `Expected ${tier} full-width tiered list at ${measurement.width}rem to stay one-column, got ${fullWidth.gridColumns}.`);
        assert(flush.gridColumns === 2, `Expected ${tier} flush tiered list at ${measurement.width}rem to retain two explicit columns, got ${flush.gridColumns}.`);
        assert(triple.gridColumns === 3, `Expected ${tier} triple tiered list at ${measurement.width}rem to retain three explicit columns, got ${triple.gridColumns}.`);

        for (const [name, variant] of Object.entries({ fullWidth, flush, triple })) {
          assert(variant.overflow <= 1, `Expected ${tier} ${name} tiered list at ${measurement.width}rem to avoid inline overflow.`);
          assert(Math.abs(variant.ruleStartOffset) <= 1 && Math.abs(variant.ruleEndDelta) <= 1, `Expected ${tier} ${name} tiered-list rule at ${measurement.width}rem to span its explicit row.`);
          assert(variant.ruleBottom <= variant.titleTop + 1, `Expected ${tier} ${name} tiered-list rule at ${measurement.width}rem to remain above its heading.`);
        }

        assert(defaultVariant.overflow <= 1, `Expected ${tier} default tiered list at ${measurement.width}rem to avoid inline overflow.`);
        assert(defaultVariant.ruleBottom <= defaultVariant.titleTop + 1, `Expected ${tier} default tiered-list rule at ${measurement.width}rem to remain above its heading.`);
        if (aboveBreakpoint) {
          assert(defaultVariant.ruleStartOffset > 1, `Expected ${tier} hanging-indent rule to begin inside the grid at 38.75rem.`);
          assert(Math.abs(defaultVariant.ruleStartOffset - defaultVariant.titleStartOffset) <= 1, `Expected ${tier} hanging-indent rule and heading to share their start line at 38.75rem.`);
          assert(Math.abs(defaultVariant.ruleEndDelta) <= 1, `Expected ${tier} hanging-indent rule to end at the row boundary at 38.75rem.`);
          assert(defaultVariant.descriptionStartOffset > defaultVariant.titleStartOffset && Math.abs(defaultVariant.descriptionTop - defaultVariant.titleTop) <= 1, `Expected ${tier} hanging-indent title and description to share a row in distinct columns at 38.75rem.`);
        } else {
          assert(Math.abs(defaultVariant.ruleStartOffset) <= 1 && Math.abs(defaultVariant.ruleEndDelta) <= 1, `Expected ${tier} default tiered-list rule below 38.75rem to span the single-column row.`);
          assert(defaultVariant.descriptionTop > defaultVariant.titleTop, `Expected ${tier} default tiered-list content below 38.75rem to stack.`);
        }
      }
    }

    await page.goto(`${origin}/demo/components/equal-height-row.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tier of tiers) {
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      const measurement = await page.evaluate(() => {
        const row = document.querySelector<HTMLElement>(".bf-equal-height-row:not(.is-wrap)");
        if (!row) return null;
        row.style.inlineSize = "65rem";
        const columns = Array.from(row.querySelectorAll<HTMLElement>(":scope > .bf-equal-height-row-col"));
        const columnRects = columns.map(column => column.getBoundingClientRect());
        const itemRows = columns.map(column => Array.from(column.querySelectorAll<HTMLElement>(":scope > .bf-equal-height-row-item")).map(item => {
          const rect = item.getBoundingClientRect();
          return { top: rect.top, bottom: rect.bottom };
        }));
        return {
          supportsSubgrid: CSS.supports("grid-template-rows", "subgrid"),
          parentGridColumns: getComputedStyle(row).gridTemplateColumns.trim().split(/\s+/).filter(Boolean).length,
          overflow: Math.max(0, row.scrollWidth - row.clientWidth),
          columnTops: columnRects.map(rect => rect.top),
          columnBottoms: columnRects.map(rect => rect.bottom),
          itemRows
        };
      });

      assert(measurement, `Expected equal-height-row measurements for ${tier}.`);
      assert(measurement.supportsSubgrid, "Expected the component browser to support CSS subgrid.");
      assert(measurement.parentGridColumns === 8, `Expected ${tier} equal-height row at 65rem to expose the eight-column parent grid, got ${measurement.parentGridColumns}.`);
      assert(measurement.itemRows.length === 4 && measurement.itemRows.every(rows => rows.length === 2), `Expected ${tier} equal-height fixture to expose four two-row columns.`);
      assert(measurement.overflow <= 1, `Expected ${tier} equal-height row at 65rem to avoid inline overflow.`);

      const spread = (values: number[]) => Math.max(...values) - Math.min(...values);
      assert(spread(measurement.columnTops) <= 0.1 && spread(measurement.columnBottoms) <= 0.1, `Expected ${tier} equal-height columns to share their outer row bounds.`);
      for (const rowIndex of [0, 1]) {
        const rowTops = measurement.itemRows.map(rows => rows[rowIndex].top);
        const rowBottoms = measurement.itemRows.map(rows => rows[rowIndex].bottom);
        assert(spread(rowTops) <= 0.1 && spread(rowBottoms) <= 0.1, `Expected ${tier} equal-height subgrid row ${rowIndex + 1} to align across columns.`);
      }
    }
  } finally {
    await browser.close();
  }
}

async function verifyDirectAndClassSurfaceGeometry(origin: string): Promise<void> {
  const tiers = ["editorial", "documentation", "app", "os"] as const;
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
    const readGeometry = async (stylesheet: string, bodyClass: string) => {
      await page.setContent(`<!doctype html>
        <link rel="stylesheet" href="${origin}/demo/demo-fonts.css">
        <link rel="stylesheet" href="${origin}${stylesheet}">
        <body class="bf-theme ${bodyClass}">
          <input class="bf-input" value="Parity">
          <button class="bf-button">Parity</button>
          <section class="bf-panel"><header class="bf-panel-header"><h2 class="bf-panel-title">Parity</h2></header></section>
          <span class="bf-status-label">Parity</span>
        </body>`);
      await page.waitForFunction(expected => Array.from(document.styleSheets).some(sheet => sheet.href?.includes(expected)), stylesheet);
      await waitForFonts(page);

      return page.evaluate(() => {
        const input = document.querySelector<HTMLElement>(".bf-input");
        const button = document.querySelector<HTMLElement>(".bf-button");
        const header = document.querySelector<HTMLElement>(".bf-panel-header");
        const status = document.querySelector<HTMLElement>(".bf-status-label");
        if (!input || !button || !header || !status) {
          throw new Error("Missing surface parity fixture.");
        }

        const inputStyles = getComputedStyle(input);
        const buttonStyles = getComputedStyle(button);
        const headerStyles = getComputedStyle(header);
        return {
          inputHeight: input.getBoundingClientRect().height,
          inputMarginBottom: Number.parseFloat(inputStyles.marginBottom) || 0,
          buttonHeight: button.getBoundingClientRect().height,
          buttonMarginBottom: Number.parseFloat(buttonStyles.marginBottom) || 0,
          panelPaddingStart: Number.parseFloat(headerStyles.paddingBlockStart) || 0,
          panelPaddingEnd: Number.parseFloat(headerStyles.paddingBlockEnd) || 0,
          panelGap: Number.parseFloat(headerStyles.gap) || 0,
          statusHeight: status.getBoundingClientRect().height
        };
      });
    };

    for (const tier of tiers) {
      const direct = await readGeometry(`/dist/tiers/${tier}/styles.css`, "");
      const classSwitched = await readGeometry("/dist/tiers/editorial/styles.css", `bf-tier-${tier}`);

      for (const key of Object.keys(direct) as Array<keyof typeof direct>) {
        assert(
          Math.abs(direct[key] - classSwitched[key]) <= 0.05,
          `Expected direct ${tier} ${key} (${direct[key]}px) to match class-switched geometry (${classSwitched[key]}px).`
        );
      }
    }
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

async function verifyParityInteractions(origin: string): Promise<void> {
  const tiers = ["editorial", "documentation", "app", "os"] as const;
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 520, height: 960 }
    });

    await page.goto(`${origin}/demo/components/in-page-navigation.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);

    const inPageToggle = page.locator(".bf-in-page-navigation .bf-in-page-navigation-toggle").first();
    await inPageToggle.waitFor({ state: "visible" });
    await inPageToggle.click();
    let inPageState = await inPageToggle.evaluate(toggle => {
      const navigation = toggle.closest(".bf-in-page-navigation");
      const list = document.getElementById(toggle.getAttribute("aria-controls") ?? "");
      return {
        expanded: toggle.getAttribute("aria-expanded"),
        label: toggle.getAttribute("aria-label"),
        listExpanded: list?.getAttribute("aria-expanded"),
        rootExpanded: navigation?.classList.contains("is-expanded"),
        iconUp: toggle.querySelector(".bf-icon")?.classList.contains("is-chevron-up")
      };
    });
    assert(inPageState.expanded === "true" && inPageState.listExpanded === "true" && inPageState.rootExpanded, "Expected in-page navigation toggle to synchronize its button, controlled list, and root expanded state.");
    assert(inPageState.iconUp && inPageState.label?.toLowerCase().includes("collapse"), "Expected expanded in-page navigation to expose its collapse label and upward icon.");

    await inPageToggle.press("Escape");
    inPageState = await inPageToggle.evaluate(toggle => {
      const navigation = toggle.closest(".bf-in-page-navigation");
      const list = document.getElementById(toggle.getAttribute("aria-controls") ?? "");
      return {
        expanded: toggle.getAttribute("aria-expanded"),
        label: toggle.getAttribute("aria-label"),
        listExpanded: list?.getAttribute("aria-expanded"),
        rootExpanded: navigation?.classList.contains("is-expanded"),
        iconUp: toggle.querySelector(".bf-icon")?.classList.contains("is-chevron-up")
      };
    });
    assert(inPageState.expanded === "false" && inPageState.listExpanded === "false" && !inPageState.rootExpanded, "Expected Escape to collapse in-page navigation and synchronize its controlled state.");
    assert(!inPageState.iconUp && inPageState.label?.toLowerCase().includes("expand"), "Expected collapsed in-page navigation to restore its expand label and downward icon.");
    assert(await inPageToggle.evaluate(toggle => document.activeElement === toggle), "Expected Escape to return focus to the in-page navigation toggle.");

    await page.goto(`${origin}/demo/components/credential-validation.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);

    const reveal = page.locator(".bf-password-reveal").first();
    const credential = page.locator("#credential-current");
    await reveal.focus();
    await reveal.press("Enter");
    let revealState = await page.evaluate(() => {
      const toggle = document.querySelector<HTMLButtonElement>(".bf-password-reveal");
      const input = document.querySelector<HTMLInputElement>("#credential-current");
      return {
        pressed: toggle?.getAttribute("aria-pressed"),
        label: toggle?.textContent?.trim(),
        type: input?.type,
        value: input?.value
      };
    });
    assert(revealState.pressed === "true" && revealState.type === "text" && revealState.label === "Hide password", "Expected Enter to reveal the controlled credential and synchronize pressed state and label.");
    assert(revealState.value === "correct horse battery staple", "Expected password reveal to preserve the field value.");
    await reveal.press("Space");
    revealState = await page.evaluate(() => {
      const toggle = document.querySelector<HTMLButtonElement>(".bf-password-reveal");
      const input = document.querySelector<HTMLInputElement>("#credential-current");
      return { pressed: toggle?.getAttribute("aria-pressed"), label: toggle?.textContent?.trim(), type: input?.type };
    });
    assert(revealState.pressed === "false" && revealState.type === "password" && revealState.label === "Show password", "Expected Space to conceal the controlled credential again.");
    assert(await credential.getAttribute("aria-describedby") === "credential-current-help", "Expected credential help to remain programmatically associated with the input.");

    await page.goto(`${origin}/demo/components/notification.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);
    const tierSelect = page.locator("[data-page-chrome-tier-select]");
    await tierSelect.waitFor({ state: "visible" });

    for (const tier of tiers) {
      await tierSelect.selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
      const geometry = await page.evaluate(() => {
        const probe = document.createElement("span");
        probe.style.cssText = "position:absolute;visibility:hidden;inline-size:var(--bf-baseline);block-size:var(--bf-baseline)";
        document.body.appendChild(probe);
        const baseline = probe.getBoundingClientRect().height;
        probe.remove();
        const notifications = Array.from(document.querySelectorAll<HTMLElement>(".bf-notification:not([hidden])"));
        return {
          baseline,
          barThicknessToken: getComputedStyle(document.body).getPropertyValue("--bf-bar-thickness").trim(),
          bodyFontSize: getComputedStyle(document.body).getPropertyValue("--bf-body-font-size").trim(),
          notificationFontSizes: notifications.map(notification => getComputedStyle(notification.querySelector(".bf-notification-title") as Element).fontSize),
          accentWidths: notifications.filter(notification => !notification.classList.contains("is-borderless")).map(notification => Number.parseFloat(getComputedStyle(notification).borderInlineStartWidth)),
          heights: notifications.map(notification => notification.getBoundingClientRect().height),
          overflow: notifications.map(notification => notification.scrollWidth - notification.clientWidth)
        };
      });
      assert(geometry.baseline > 0, `Expected ${tier} notification fixture to resolve a positive baseline.`);
      assert(geometry.barThicknessToken === "0.1875rem" && geometry.accentWidths.every(width => width === 3), `Expected ${tier} notification accents to use the shared 3px/0.1875rem emphasis bar; got ${geometry.accentWidths.join(", ")}px/${geometry.barThicknessToken}.`);
      assert(geometry.heights.every(height => Math.abs((height / geometry.baseline) - Math.round(height / geometry.baseline)) <= 0.05), `Expected ${tier} notification border boxes to stay baseline multiples; heights=${geometry.heights.join(", ")}, baseline=${geometry.baseline}.`);
      assert(geometry.overflow.every(delta => delta <= 1), `Expected ${tier} notifications to avoid inline overflow; deltas=${geometry.overflow.join(", ")}.`);
      assert(geometry.notificationFontSizes.length > 0, `Expected ${tier} notification fixture typography to be measurable.`);
    }

    const dismissal = page.locator(".bf-notification-close");
    await dismissal.focus();
    await dismissal.press("Enter");
    assert(await page.locator("#notification-dismissible").isHidden(), "Expected notification dismissal to hide the controlled notification.");
    assert(
      await page.locator(".bf-notification.is-borderless").evaluate(notification => document.activeElement === notification),
      "Expected notification dismissal to move focus to the next stable notification.",
    );

    await page.close();
  } finally {
    await browser.close();
  }
}

async function verifyReducedNavigationAndTableOfContents(origin: string): Promise<void> {
  const tiers = ["editorial", "documentation", "app", "os"] as const;
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1036, height: 960 }
    });

    await page.goto(`${origin}/demo/components/navigation-reduced.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);
    const tierSelect = page.locator("[data-page-chrome-tier-select]");

    for (const tier of tiers) {
      await tierSelect.selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);

      for (const viewport of [
        { width: 1035, isLarge: false, label: "below 64.75rem" },
        { width: 1036, isLarge: true, label: "at 64.75rem" }
      ] as const) {
        await page.setViewportSize({ width: viewport.width, height: 960 });
        await page.waitForTimeout(80);

        const geometry = await page.locator("#reduced-navigation").evaluate(root => {
          const row = root.querySelector<HTMLElement>(".bf-top-navigation-row");
          const tag = root.querySelector<HTMLElement>(".bf-top-navigation-logo-tag");
          const title = root.querySelector<HTMLElement>(".bf-top-navigation-logo-title");
          const link = root.querySelector<HTMLElement>(".bf-top-navigation-nav .bf-top-navigation-link");
          const nav = root.querySelector<HTMLElement>(".bf-top-navigation-nav");
          const probe = document.createElement("span");
          probe.style.cssText = "position:absolute;visibility:hidden;font-size:var(--bf-body-font-size);line-height:var(--bf-body-line-height)";
          root.appendChild(probe);
          const bodyRole = getComputedStyle(probe);
          const state = row && tag && title && link && nav ? {
            tagDisplay: getComputedStyle(tag).display,
            titleFontSize: getComputedStyle(title).fontSize,
            titleLineHeight: getComputedStyle(title).lineHeight,
            titleFontWeight: getComputedStyle(title).fontWeight,
            linkFontSize: getComputedStyle(link).fontSize,
            linkLineHeight: getComputedStyle(link).lineHeight,
            navHidden: nav.getAttribute("aria-hidden"),
            navDisplay: getComputedStyle(nav).display,
            rowMinBlockSize: getComputedStyle(row).minBlockSize,
            rootOverflow: root.scrollWidth - root.clientWidth,
            rowOverflow: row.scrollWidth - row.clientWidth,
            bodyRoleFontSize: bodyRole.fontSize,
            bodyRoleLineHeight: bodyRole.lineHeight
          } : null;
          probe.remove();
          return state;
        });

        assert(geometry, `Expected ${tier} reduced-navigation geometry ${viewport.label}.`);
        assert(geometry.tagDisplay === "none", `Expected ${tier} reduced navigation to remove the canonical tag ${viewport.label}.`);
        assert(geometry.titleFontSize === geometry.bodyRoleFontSize && geometry.titleLineHeight === geometry.bodyRoleLineHeight && geometry.titleFontWeight === "400", `Expected ${tier} reduced navigation logo title to use the body role ${viewport.label}.`);
        assert(geometry.linkFontSize === geometry.bodyRoleFontSize && geometry.linkLineHeight === geometry.bodyRoleLineHeight, `Expected ${tier} reduced navigation controls to use the body role ${viewport.label}.`);
        assert(geometry.rowMinBlockSize === "0px", `Expected ${tier} reduced navigation row to remove the standard minimum block size ${viewport.label}.`);
        assert(geometry.rootOverflow <= 1 && geometry.rowOverflow <= 1, `Expected ${tier} reduced navigation to avoid inline overflow ${viewport.label}; root=${geometry.rootOverflow}, row=${geometry.rowOverflow}.`);
        assert(geometry.navHidden === (viewport.isLarge ? "false" : "true"), `Expected ${tier} reduced navigation aria-hidden to follow the ${viewport.label} breakpoint, got ${geometry.navHidden}.`);

        if (!viewport.isLarge) {
          const menuToggle = page.locator("#reduced-navigation .bf-top-navigation-banner .bf-top-navigation-menu-toggle");
          await menuToggle.focus();
          await menuToggle.press("Enter");
          await page.waitForTimeout(50);
          const menuState = await page.locator("#reduced-navigation").evaluate(root => {
            const menu = root.querySelector<HTMLElement>(".bf-top-navigation-menu-toggle");
            const nav = root.querySelector<HTMLElement>(".bf-top-navigation-nav");
            return menu && nav ? {
              expanded: menu.getAttribute("aria-expanded"),
              navHidden: nav.getAttribute("aria-hidden"),
              navDisplay: getComputedStyle(nav).display,
              focused: document.activeElement === menu,
              outline: getComputedStyle(menu).outlineStyle
            } : null;
          });
          assert(menuState && menuState.expanded === "true" && menuState.navHidden === "false" && menuState.navDisplay === "flex", `Expected ${tier} reduced menu keyboard activation to reveal its controlled nav below 64.75rem.`);
          assert(menuState.focused && menuState.outline !== "none", `Expected ${tier} reduced menu trigger to retain visible keyboard focus.`);

          const dropdownToggle = page.locator("#reduced-navigation .bf-top-navigation-dropdown-toggle");
          await dropdownToggle.focus();
          await dropdownToggle.press("Space");
          await page.waitForTimeout(50);
          const dropdownState = await page.locator("#reduced-navigation").evaluate(root => {
            const item = root.querySelector<HTMLElement>(".bf-top-navigation-item.is-dropdown-toggle");
            const toggle = item?.querySelector<HTMLElement>(".bf-top-navigation-dropdown-toggle");
            const dropdown = item?.querySelector<HTMLElement>(".bf-top-navigation-dropdown");
            return item && toggle && dropdown ? {
              active: item.classList.contains("is-active"),
              expanded: toggle.getAttribute("aria-expanded"),
              hidden: dropdown.getAttribute("aria-hidden"),
              display: getComputedStyle(dropdown).display
            } : null;
          });
          assert(dropdownState && dropdownState.active && dropdownState.expanded === "true" && dropdownState.hidden === "false" && dropdownState.display === "block", `Expected ${tier} reduced mobile dropdown to preserve its ARIA and visible lifecycle.`);

          const searchToggle = page.locator("#reduced-navigation .bf-top-navigation-banner .bf-top-navigation-search-toggle");
          await searchToggle.focus();
          await searchToggle.press("Enter");
          await page.waitForTimeout(50);
          const searchState = await page.locator("#reduced-navigation").evaluate(root => {
            const nav = root.querySelector<HTMLElement>(".bf-top-navigation-nav");
            const search = root.querySelector<HTMLElement>(".bf-top-navigation-search");
            const dropdown = root.querySelector<HTMLElement>(".bf-top-navigation-dropdown");
            const input = root.querySelector<HTMLInputElement>(".bf-top-navigation-search .bf-search-box-input");
            const toggle = root.querySelector<HTMLElement>(".bf-top-navigation-banner .bf-top-navigation-search-toggle");
            return nav && search && dropdown && input && toggle ? {
              navHidden: nav.getAttribute("aria-hidden"),
              searchHidden: search.getAttribute("aria-hidden"),
              dropdownHidden: dropdown.getAttribute("aria-hidden"),
              pressed: toggle.getAttribute("aria-pressed"),
              inputFocused: document.activeElement === input
            } : null;
          });
          assert(searchState && searchState.navHidden === "false" && searchState.searchHidden === "false" && searchState.dropdownHidden === "true" && searchState.pressed === "true" && searchState.inputFocused, `Expected ${tier} reduced mobile search to close the dropdown, expose its controlled region, and focus its input.`);
          await page.keyboard.press("Escape");
          const closed = await page.locator("#reduced-navigation").evaluate(root => {
            const menu = root.querySelector<HTMLElement>(".bf-top-navigation-menu-toggle");
            const search = root.querySelector<HTMLElement>(".bf-top-navigation-search");
            const dropdown = root.querySelector<HTMLElement>(".bf-top-navigation-dropdown");
            const toggle = root.querySelector<HTMLElement>(".bf-top-navigation-banner .bf-top-navigation-search-toggle");
            return menu && search && dropdown && toggle ? {
              menu: menu.getAttribute("aria-expanded"),
              search: search.getAttribute("aria-hidden"),
              dropdown: dropdown.getAttribute("aria-hidden"),
              focused: document.activeElement === toggle
            } : null;
          });
          assert(closed && closed.menu === "false" && closed.search === "true" && closed.dropdown === "true" && closed.focused, `Expected ${tier} Escape to restore the reduced mobile navigation lifecycle and search-trigger focus.`);
        } else {
          const dropdownToggle = page.locator("#reduced-navigation .bf-top-navigation-dropdown-toggle");
          await dropdownToggle.focus();
          await dropdownToggle.press("Enter");
          await page.waitForTimeout(50);
          assert(await dropdownToggle.getAttribute("aria-expanded") === "true", `Expected ${tier} reduced desktop dropdown keyboard activation to set aria-expanded=true.`);
          assert(await page.locator("#reduced-navigation .bf-top-navigation-dropdown").getAttribute("aria-hidden") === "false", `Expected ${tier} reduced desktop dropdown to expose its controlled menu.`);

          const searchToggle = page.locator("#reduced-navigation .bf-top-navigation-nav .bf-top-navigation-search-toggle");
          await searchToggle.focus();
          await searchToggle.press("Enter");
          await page.waitForTimeout(50);
          const desktopSearch = await page.locator("#reduced-navigation").evaluate(root => {
            const search = root.querySelector<HTMLElement>(".bf-top-navigation-search");
            const dropdown = root.querySelector<HTMLElement>(".bf-top-navigation-dropdown");
            const input = root.querySelector<HTMLInputElement>(".bf-top-navigation-search .bf-search-box-input");
            const toggle = root.querySelector<HTMLElement>(".bf-top-navigation-nav .bf-top-navigation-search-toggle");
            return search && dropdown && input && toggle ? {
              searchHidden: search.getAttribute("aria-hidden"),
              dropdownHidden: dropdown.getAttribute("aria-hidden"),
              pressed: toggle.getAttribute("aria-pressed"),
              inputFocused: document.activeElement === input,
              position: getComputedStyle(search).position
            } : null;
          });
          assert(desktopSearch && desktopSearch.searchHidden === "false" && desktopSearch.dropdownHidden === "true" && desktopSearch.pressed === "true" && desktopSearch.inputFocused && desktopSearch.position === "absolute", `Expected ${tier} reduced desktop search to preserve ARIA, focus, dropdown closure, and floating geometry.`);
          await page.keyboard.press("Escape");
          assert(await searchToggle.evaluate(toggle => document.activeElement === toggle), `Expected ${tier} Escape to restore focus to the reduced desktop search trigger.`);
        }

        const rtlState = await page.locator("#reduced-navigation").evaluate(root => {
          root.setAttribute("dir", "rtl");
          const row = root.querySelector<HTMLElement>(".bf-top-navigation-row");
          const state = {
            direction: getComputedStyle(root).direction,
            rootOverflow: root.scrollWidth - root.clientWidth,
            rowOverflow: row ? row.scrollWidth - row.clientWidth : Number.POSITIVE_INFINITY
          };
          root.removeAttribute("dir");
          return state;
        });
        assert(rtlState.direction === "rtl" && rtlState.rootOverflow <= 1 && rtlState.rowOverflow <= 1, `Expected ${tier} reduced navigation to retain logical RTL geometry without overflow ${viewport.label}.`);
      }
    }

    await page.goto(`${origin}/demo/components/table-of-contents.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);
    const tocTierSelect = page.locator("[data-page-chrome-tier-select]");

    for (const tier of tiers) {
      await tocTierSelect.selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);

      for (const width of ["19.99rem", "20rem"] as const) {
        const expectedSpace = width === "19.99rem" ? "var(--bf-space-1)" : "var(--bf-space-2)";
        const state = await page.locator(".bf-table-of-contents").first().evaluate((root, widthValue) => {
          root.style.inlineSize = widthValue;
          const nested = root.querySelector<HTMLElement>(".bf-table-of-contents-list .bf-table-of-contents-list");
          const parentItem = nested?.parentElement;
          const parentLink = parentItem?.querySelector<HTMLElement>(":scope > .bf-table-of-contents-link");
          const current = root.querySelector<HTMLElement>(".bf-table-of-contents-link[aria-current]");
          const spaceOneProbe = document.createElement("span");
          const spaceTwoProbe = document.createElement("span");
          const textProbe = document.createElement("span");
          spaceOneProbe.style.cssText = "position:absolute;visibility:hidden;inline-size:var(--bf-space-1)";
          spaceTwoProbe.style.cssText = "position:absolute;visibility:hidden;inline-size:var(--bf-space-2)";
          textProbe.style.cssText = "position:absolute;visibility:hidden;color:var(--bf-color-text-default)";
          root.append(spaceOneProbe, spaceTwoProbe, textProbe);
          const direction = getComputedStyle(root).direction;
          const nestedRect = nested?.getBoundingClientRect();
          const parentRect = parentLink?.getBoundingClientRect();
          const result = nested && parentLink && current && nestedRect && parentRect ? {
            actualWidth: root.getBoundingClientRect().width,
            direction,
            nestedMargin: Number.parseFloat(getComputedStyle(nested).marginInlineStart),
            expectedSpaceOne: spaceOneProbe.getBoundingClientRect().width,
            expectedSpaceTwo: spaceTwoProbe.getBoundingClientRect().width,
            logicalIndent: direction === "rtl" ? parentRect.right - nestedRect.right : nestedRect.left - parentRect.left,
            currentState: current.getAttribute("aria-current"),
            currentWeight: getComputedStyle(current).fontWeight,
            currentColor: getComputedStyle(current).color,
            defaultTextColor: getComputedStyle(textProbe).color,
            rootOverflow: root.scrollWidth - root.clientWidth
          } : null;
          spaceOneProbe.remove();
          spaceTwoProbe.remove();
          textProbe.remove();
          return result;
        }, width);
        assert(state, `Expected ${tier} table-of-contents state at ${width}.`);
        const expectedIndent = expectedSpace === "var(--bf-space-1)" ? state.expectedSpaceOne : state.expectedSpaceTwo;
        assert(Math.abs(state.nestedMargin - expectedIndent) <= 0.1 && Math.abs(state.logicalIndent - expectedIndent) <= 0.1, `Expected ${tier} table-of-contents nested indentation to map to ${expectedSpace} at ${width}; margin=${state.nestedMargin}, logical=${state.logicalIndent}, expected=${expectedIndent}.`);
        assert(state.currentState === "location" && Number.parseFloat(state.currentWeight) >= 600 && state.currentColor === state.defaultTextColor, `Expected ${tier} table-of-contents current link to expose its semantic current state and default-text emphasis at ${width}.`);
        assert(state.rootOverflow <= 1, `Expected ${tier} table-of-contents to avoid inline overflow at ${width}; got ${state.rootOverflow}px.`);
      }

      const currentLink = page.locator(".bf-table-of-contents").first().locator(".bf-table-of-contents-link[aria-current]");
      await currentLink.focus();
      const focusState = await currentLink.evaluate(link => ({ focused: document.activeElement === link, outline: getComputedStyle(link).outlineStyle }));
      assert(focusState.focused && focusState.outline !== "none", `Expected ${tier} table-of-contents current link to retain visible keyboard focus.`);

      const narrowState = await page.locator(".table-of-contents-demo-narrow").evaluate(section => {
        section.style.inlineSize = "19.99rem";
        const root = section.querySelector<HTMLElement>(".bf-table-of-contents");
        const longLink = root?.querySelector<HTMLElement>(".bf-table-of-contents-link");
        if (!root || !longLink) return null;
        root.setAttribute("dir", "rtl");
        const nested = root.querySelector<HTMLElement>(".bf-table-of-contents-list .bf-table-of-contents-list");
        const parentLink = nested?.parentElement?.querySelector<HTMLElement>(":scope > .bf-table-of-contents-link");
        const nestedRect = nested?.getBoundingClientRect();
        const parentRect = parentLink?.getBoundingClientRect();
        const result = {
          direction: getComputedStyle(root).direction,
          rootOverflow: root.scrollWidth - root.clientWidth,
          sectionOverflow: section.scrollWidth - section.clientWidth,
          longLinkOverflowWrap: getComputedStyle(longLink).overflowWrap,
          logicalIndent: nestedRect && parentRect ? parentRect.right - nestedRect.right : 0
        };
        root.removeAttribute("dir");
        return result;
      });
      assert(narrowState && narrowState.direction === "rtl" && narrowState.rootOverflow <= 1 && narrowState.sectionOverflow <= 1 && narrowState.longLinkOverflowWrap === "anywhere" && narrowState.logicalIndent > 0, `Expected ${tier} narrow RTL table-of-contents to retain logical nesting and long-copy overflow protection.`);
    }

    await page.close();
  } finally {
    await browser.close();
  }
}

async function verifyInteractiveTables(origin: string): Promise<void> {
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1200, height: 960 }
    });

    await page.goto(`${origin}/demo/components/table-sortable.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);
    const coresButton = page.locator(".bf-table.is-sortable").first().locator(".bf-table-sort-button", { hasText: "Cores" });
    const coresHeader = coresButton.locator("xpath=..");
    const coreValues = async (): Promise<string[]> => page.locator(".bf-table.is-sortable").first().locator("tbody tr td:nth-child(3)").allTextContents();

    await coresButton.focus();
    await coresButton.press("Enter");
    assert(await coresHeader.getAttribute("aria-sort") === "ascending", "Expected first sortable-table activation to set aria-sort=ascending.");
    assert(JSON.stringify(await coreValues()) === JSON.stringify(["2", "4", "8", "16"]), "Expected sortable table numeric values to sort ascending.");
    assert(await page.locator(".bf-table.is-sortable").first().locator("th[aria-sort='ascending']").count() === 1, "Expected sortable table to expose exactly one active sort column.");

    await coresButton.press("Space");
    assert(await coresHeader.getAttribute("aria-sort") === "descending", "Expected second sortable-table activation to set aria-sort=descending.");
    assert(JSON.stringify(await coreValues()) === JSON.stringify(["16", "8", "4", "2"]), "Expected sortable table numeric values to sort descending.");

    await coresButton.click();
    assert(await coresHeader.getAttribute("aria-sort") === "none", "Expected third sortable-table activation to restore aria-sort=none.");
    assert(JSON.stringify(await coreValues()) === JSON.stringify(["8", "2", "16", "4"]), "Expected sortable table to restore its original row order.");
    const sortFocus = await coresButton.evaluate(button => ({
      focused: document.activeElement === button,
      outline: getComputedStyle(button).outlineStyle
    }));
    assert(sortFocus.focused && sortFocus.outline !== "none", "Expected sortable-table keyboard focus to remain visible after sorting.");

    await page.goto(`${origin}/demo/components/table-expanding.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);
    const expansionButton = page.locator(".bf-table-expand-toggle").first();
    const expansionRow = page.locator("#machine-karura-details");
    assert(await expansionRow.isHidden(), "Expected the collapsed expanding-table row to start hidden.");
    await expansionButton.focus();
    await expansionButton.press("Space");
    assert(await expansionButton.getAttribute("aria-expanded") === "true", "Expected expanding-table activation to set aria-expanded=true.");
    assert(await expansionRow.getAttribute("aria-hidden") === "false" && await expansionRow.isVisible(), "Expected expanding-table activation to reveal and expose its controlled row.");
    assert((await expansionButton.textContent())?.trim() === "Hide configuration", "Expected expanding-table activation to synchronize its visible action label.");
    await expansionButton.press("Enter");
    assert(await expansionButton.getAttribute("aria-expanded") === "false" && await expansionRow.isHidden(), "Expected expanding-table second activation to collapse its controlled row.");

    await page.goto(`${origin}/demo/components/table-mobile-card.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);
    const firstMobileTable = page.locator(".bf-table.is-mobile-card").first();
    const generatedLabels = firstMobileTable.locator(".bf-table-card-label");
    assert(await generatedLabels.count() === 15, "Expected mobile-card runtime to generate one presentation label per body cell from real headings.");
    assert((await generatedLabels.first().textContent())?.trim() === "Agent", "Expected the first mobile-card label to match its real Agent heading.");
    assert(await generatedLabels.first().getAttribute("aria-hidden") === "true", "Expected generated mobile-card labels to stay presentation-only for assistive technology.");

    await page.setViewportSize({ width: 520, height: 960 });
    await page.waitForTimeout(100);
    const cardState = await firstMobileTable.evaluate(table => {
      const frame = table.closest(".bf-table-mobile-card-frame");
      const heading = table.querySelector("thead");
      const row = table.querySelector("tbody tr");
      const label = table.querySelector(".bf-table-card-label");
      if (!(frame instanceof HTMLElement) || !(heading instanceof HTMLElement) || !(row instanceof HTMLElement) || !(label instanceof HTMLElement)) return null;
      return {
        tableDisplay: getComputedStyle(table).display,
        rowDisplay: getComputedStyle(row).display,
        headingDisplay: getComputedStyle(heading).display,
        headingClip: getComputedStyle(heading).clipPath,
        labelDisplay: getComputedStyle(label).display,
        overflow: frame.scrollWidth - frame.clientWidth
      };
    });
    assert(cardState, "Expected mobile-card table geometry to be measurable at a narrow viewport.");
    assert(cardState.tableDisplay === "block" && cardState.rowDisplay === "block", "Expected mobile-card table rows to reflow into cards below the intrinsic threshold.");
    assert(cardState.headingDisplay !== "none" && cardState.headingClip !== "none", "Expected mobile-card real headings to remain in the accessibility tree while visually clipped.");
    assert(cardState.labelDisplay === "block" && cardState.overflow <= 1, "Expected mobile-card presentation labels to appear without inline overflow.");

    await page.close();
  } finally {
    await browser.close();
  }
}

async function verifyPortedCompositionGeometry(origin: string): Promise<void> {
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1600, height: 1200 }
    });

    await page.goto(`${origin}/demo/components/data-spotlight.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tier of ["editorial", "documentation", "app", "os"] as const) {
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      const highlightRules = await page.locator(".bf-data-spotlight-rule").evaluateAll(rules => rules.map(rule => {
        const styles = getComputedStyle(rule);
        return {
          blockSize: Number.parseFloat(styles.blockSize),
          token: styles.getPropertyValue("--bf-bar-thickness").trim()
        };
      }));
      assert(highlightRules.length === 9, `Expected ${tier} data spotlight fixture to expose all nine highlighted rules.`);
      assert(highlightRules.every(rule => rule.blockSize === 3 && rule.token === "0.1875rem"), `Expected ${tier} data spotlight rules to use the shared 3px/0.1875rem emphasis bar.`);
      const actionSpacing = await page.locator(".bf-data-spotlight-item:has(.bf-data-spotlight-action)").evaluateAll(items => items.map(item => {
        const description = item.querySelector<HTMLElement>("p:not(.bf-data-spotlight-stat)")?.getBoundingClientRect();
        const action = item.querySelector<HTMLElement>(".bf-data-spotlight-action")?.getBoundingClientRect();
        return description && action ? action.top - description.bottom : -1;
      }));
      assert(actionSpacing.length === 4 && actionSpacing.every(gap => gap >= 0), `Expected ${tier} data spotlight actions not to overlap their descriptions.`);
    }
    let layoutState = await page.locator(".bf-data-spotlight.is-four-blocks").evaluate(root => {
      const items = Array.from(root.querySelectorAll<HTMLElement>(".bf-data-spotlight-item"));
      const positions = items.map(item => item.getBoundingClientRect());
      return { columns: new Set(positions.map(rect => Math.round(rect.left))).size, rowDelta: Math.max(...positions.map(rect => rect.top)) - Math.min(...positions.map(rect => rect.top)) };
    });
    assert(layoutState.columns === 4 && layoutState.rowDelta <= 1, "Expected wide four-block data spotlight to preserve Vanilla's single four-column row.");
    layoutState = await page.locator(".bf-data-spotlight.is-four-blocks").evaluate(root => {
      (root as HTMLElement).style.inlineSize = "30rem";
      const positions = Array.from(root.querySelectorAll<HTMLElement>(".bf-data-spotlight-item")).map(item => item.getBoundingClientRect());
      return { columns: new Set(positions.map(rect => Math.round(rect.left))).size, rowDelta: Math.max(...positions.map(rect => rect.top)) - Math.min(...positions.map(rect => rect.top)) };
    });
    assert(layoutState.columns === 1 && layoutState.rowDelta > 1, "Expected constrained data spotlight to collapse intrinsically to one column.");

    await page.goto(`${origin}/demo/components/divided-section.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const dividedState = await page.locator(".bf-divided-section").first().evaluate(root => {
      const header = root.querySelector<HTMLElement>(".bf-divided-section-header")?.getBoundingClientRect();
      const content = root.querySelector<HTMLElement>(".bf-divided-section-content")?.getBoundingClientRect();
      if (!header || !content) return null;
      const wide = { sameRow: Math.abs(header.top - content.top) <= 1, separated: Math.abs(header.left - content.left) > 1 };
      (root as HTMLElement).style.inlineSize = "30rem";
      const narrowHeader = root.querySelector<HTMLElement>(".bf-divided-section-header")?.getBoundingClientRect();
      const narrowContent = root.querySelector<HTMLElement>(".bf-divided-section-content")?.getBoundingClientRect();
      return { wide, narrowStacked: !!narrowHeader && !!narrowContent && narrowContent.top > narrowHeader.top && Math.abs(narrowContent.left - narrowHeader.left) <= 1 };
    });
    assert(dividedState?.wide.sameRow && dividedState.wide.separated && dividedState.narrowStacked, "Expected divided section to preserve its wide split and constrained stacked geometry.");

    await page.goto(`${origin}/demo/components/logo-section.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const logoState = await page.locator(".bf-logo-section").first().evaluate(root => {
      const item = root.querySelector<HTMLElement>(".bf-logo-section-item");
      const styles = item ? getComputedStyle(item) : null;
      if (!item || !styles) return null;
      const probe = document.createElement("span");
      probe.style.cssText = "position:absolute;visibility:hidden;block-size:calc(var(--bf-space-12) + var(--bf-space-1))";
      root.append(probe);
      const expected = probe.getBoundingClientRect().height;
      probe.remove();
      return { height: item.getBoundingClientRect().height, expected, marginBlockStart: Number.parseFloat(styles.marginBlockStart), overflow: root.scrollWidth - root.clientWidth };
    });
    assert(logoState && Math.abs(logoState.height - logoState.expected) <= 0.1 && logoState.marginBlockStart < 0 && logoState.overflow <= 1, "Expected logo section to retain its large intrinsic mark size and negative row-pull geometry without overflow.");

    await page.goto(`${origin}/demo/components/media-object.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const mediaState = await page.locator(".bf-media-object").first().evaluate(root => {
      (root as HTMLElement).style.inlineSize = "19rem";
      const media = root.querySelector<HTMLElement>(".bf-media-object-media")?.getBoundingClientRect();
      const content = root.querySelector<HTMLElement>(".bf-media-object-content")?.getBoundingClientRect();
      return media && content ? { sameRow: Math.abs(media.top - content.top) <= 1, separated: Math.abs(media.left - content.left) > 1, overflow: root.scrollWidth - root.clientWidth } : null;
    });
    assert(mediaState?.sameRow && mediaState.separated && mediaState.overflow <= 1, "Expected media object to retain Vanilla's persistent side-by-side layout in a narrow container.");

    await page.goto(`${origin}/demo/components/basic-section.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const basicState = await page.locator(".bf-basic-section").first().evaluate(root => {
      const wideHeader = root.querySelector<HTMLElement>(".bf-basic-section-header")?.getBoundingClientRect();
      const wideContent = root.querySelector<HTMLElement>(".bf-basic-section-content")?.getBoundingClientRect();
      const wide = wideHeader && wideContent ? { sameRow: Math.abs(wideHeader.top - wideContent.top) <= 1, separated: Math.abs(wideHeader.left - wideContent.left) > 1 } : null;
      (root as HTMLElement).style.inlineSize = "30rem";
      const narrowHeader = root.querySelector<HTMLElement>(".bf-basic-section-header")?.getBoundingClientRect();
      const narrowContent = root.querySelector<HTMLElement>(".bf-basic-section-content")?.getBoundingClientRect();
      const narrow = narrowHeader && narrowContent ? { sameRow: Math.abs(narrowHeader.top - narrowContent.top) <= 1, separated: Math.abs(narrowHeader.left - narrowContent.left) > 1 } : null;
      return { wide, narrow, overflow: root.scrollWidth - root.clientWidth };
    });
    assert(basicState?.wide?.sameRow && basicState.wide.separated && basicState.narrow && !basicState.narrow.sameRow && !basicState.narrow.separated && basicState.overflow <= 1, "Expected basic section to preserve its large 50/50 split and constrained stack.");

    await page.goto(`${origin}/demo/components/cta-section.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const ctaState = await page.locator(".bf-cta-section.is-offset").evaluate(root => {
      const rootRect = root.getBoundingClientRect();
      const contentRect = root.querySelector<HTMLElement>(".bf-cta-section-content")?.getBoundingClientRect();
      const layout = root.querySelector<HTMLElement>(".bf-cta-section-layout");
      if (!contentRect || !layout) return null;
      const probe = document.createElement("span");
      probe.style.cssText = "position:absolute;visibility:hidden;block-size:var(--bf-section-space-deep)";
      root.append(probe);
      const sectionDeep = probe.getBoundingClientRect().height;
      probe.remove();
      return { offsetRatio: (contentRect.left - rootRect.left) / rootRect.width, paddingBlockStart: Number.parseFloat(getComputedStyle(layout).paddingBlockStart), sectionDeep };
    });
    assert(ctaState && ctaState.offsetRatio > 0.2 && Math.abs(ctaState.paddingBlockStart - ctaState.sectionDeep) <= 0.1, "Expected wide CTA section to preserve its 25/75 offset and full deep boundary.");

    await page.goto(`${origin}/demo/components/text-spotlight.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const spotlightState = await page.locator(".bf-text-spotlight").evaluate(root => {
      const rootRect = root.getBoundingClientRect();
      const header = root.querySelector<HTMLElement>(".bf-text-spotlight-header")?.getBoundingClientRect();
      const content = root.querySelector<HTMLElement>(".bf-text-spotlight-content")?.getBoundingClientRect();
      return header && content ? { headerRatio: header.width / rootRect.width, contentRatio: content.width / rootRect.width, sameRow: Math.abs(header.top - content.top) <= 1 } : null;
    });
    assert(spotlightState?.sameRow && spotlightState.headerRatio < 0.3 && spotlightState.contentRatio > 0.65, "Expected text spotlight to preserve its wide 25/75 title/content relationship.");

    await page.goto(`${origin}/demo/components/hero.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const heroState = await page.locator(".bf-hero").first().evaluate(root => {
      const children = Array.from(root.querySelectorAll<HTMLElement>(":scope > .bf-hero-layout > *")).map(child => child.getBoundingClientRect());
      const styles = getComputedStyle(root);
      const probe = document.createElement("span");
      probe.style.cssText = "position:absolute;visibility:hidden;block-size:var(--bf-section-space)";
      root.append(probe);
      const sectionSpace = probe.getBoundingClientRect().height;
      probe.remove();
      return { sameRow: children.length >= 2 && Math.abs(children[0].top - children[1].top) <= 1, separated: children.length >= 2 && Math.abs(children[0].left - children[1].left) > 1, paddingEnd: Number.parseFloat(styles.paddingBlockEnd), sectionSpace, overflow: root.scrollWidth - root.clientWidth };
    });
    assert(heroState.sameRow && heroState.separated && Math.abs(heroState.paddingEnd - heroState.sectionSpace) <= 0.1 && heroState.overflow <= 1, "Expected wide hero to preserve its paired columns and full regular exit boundary.");

    await page.goto(`${origin}/demo/components/quote-wrapper.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const quoteState = await page.locator(".bf-quote-wrapper").first().evaluate(root => {
      const signpost = root.querySelector<HTMLElement>(".bf-quote-wrapper-signpost")?.getBoundingClientRect();
      const content = root.querySelector<HTMLElement>(".bf-quote-wrapper-content")?.getBoundingClientRect();
      const quote = root.querySelector("blockquote");
      return signpost && content ? { signpostRatio: signpost.width / root.getBoundingClientRect().width, contentRatio: content.width / root.getBoundingClientRect().width, sameRow: Math.abs(signpost.top - content.top) <= 1, semanticQuote: quote?.tagName === "BLOCKQUOTE", overflow: root.scrollWidth - root.clientWidth } : null;
    });
    assert(quoteState?.sameRow && quoteState.signpostRatio < 0.3 && quoteState.contentRatio > 0.65 && quoteState.semanticQuote && quoteState.overflow <= 1, "Expected quote wrapper to preserve its 25/75 signpost/content relationship around a semantic blockquote.");

    await page.close();
  } finally {
    await browser.close();
  }
}

async function verifyRichListsAndTabSectionGeometry(origin: string): Promise<void> {
  const browser = await openBrowser();
  const tiers = ["editorial", "documentation", "app", "os"] as const;

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1600, height: 1200 }
    });

    await page.goto(`${origin}/demo/components/rich-list-horizontal.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tier of tiers) {
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
      const sections = page.locator(".bf-rich-list.is-horizontal");
      const markerState = await page.evaluate(() => {
        const root = document.querySelector<HTMLElement>("main[data-baseline-label='rich horizontal list page']");
        return root ? { markers: root.querySelectorAll("[data-baseline-check]").length, overflow: root.scrollWidth - root.clientWidth } : null;
      });
      assert(markerState && markerState.markers >= 18 && markerState.overflow <= 1, `Expected ${tier} rich horizontal fixtures to retain baseline markers and avoid overflow: ${JSON.stringify(markerState)}.`);

      for (const width of ["65ch", "66ch", "100ch"] as const) {
        const states = await sections.evaluateAll((roots, widthValue) => roots.map(root => {
          const section = root as HTMLElement;
          section.style.inlineSize = widthValue;
          const list = section.querySelector<HTMLElement>(".bf-rich-list-list");
          const slot = section.querySelector<HTMLElement>(".bf-rich-list-list-slot");
          const items = Array.from(section.querySelectorAll<HTMLElement>(".bf-rich-list-list > .bf-list-item"));
          const firstRule = items[0] ? getComputedStyle(items[0], "::after").content : "none";
          const ruleStarts = items.filter(item => getComputedStyle(item, "::after").content !== "none").length;
          return {
            className: section.className,
            columns: list ? getComputedStyle(list).gridTemplateColumns.split(/\s+/).filter(Boolean).length : 0,
            slotWidth: slot?.getBoundingClientRect().width ?? 0,
            firstRule,
            ruleStarts,
            overflow: section.scrollWidth - section.clientWidth
          };
        }), width);
        const expectedColumns = width === "65ch" ? 1 : width === "66ch" ? 2 : 4;
        assert(states.every(state => state.columns === expectedColumns), `Expected ${tier} rich horizontal lists at ${width} to use ${expectedColumns} item columns.`);
        assert(states.every(state => state.slotWidth > 0 && state.firstRule !== "none" && state.ruleStarts >= 1 && state.overflow <= 1), `Expected ${tier} rich horizontal lists at ${width} to retain continuous row rules and avoid overflow.`);
      }

      const splitState = await sections.nth(1).evaluate(root => {
        const section = root as HTMLElement;
        section.style.inlineSize = "66rem";
        const layout = section.querySelector<HTMLElement>(":scope > .bf-rich-list-layout");
        const header = section.querySelector<HTMLElement>(".bf-rich-list-header")?.getBoundingClientRect();
        const support = section.querySelector<HTMLElement>(".bf-rich-list-support")?.getBoundingClientRect();
        return layout && header && support ? { columns: getComputedStyle(layout).gridTemplateColumns.split(/\s+/).filter(Boolean).length, sameRow: Math.abs(header.top - support.top) <= 1, separated: Math.abs(header.left - support.left) > 1 } : null;
      });
      assert(splitState?.columns === 2 && splitState.sameRow && splitState.separated, `Expected ${tier} rich horizontal 50/50 title/support rails at the large threshold.`);
    }

    await page.goto(`${origin}/demo/components/rich-list-vertical.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tier of tiers) {
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
      for (const width of [1035, 1036] as const) {
        const states = await page.locator(".bf-rich-list.is-vertical").evaluateAll((roots, widthValue) => roots.map(root => {
          const section = root as HTMLElement;
          section.style.inlineSize = `${widthValue}px`;
          const layout = section.querySelector<HTMLElement>(":scope > .bf-rich-list-layout");
          const content = section.querySelector<HTMLElement>(".bf-rich-list-content");
          const media = section.querySelector<HTMLElement>(".bf-rich-list-media");
          const frame = section.querySelector<HTMLElement>(".bf-rich-list-media-frame");
          const contentRect = content?.getBoundingClientRect();
          const mediaRect = media?.getBoundingClientRect();
          const frameRect = frame?.getBoundingClientRect();
          return {
            className: section.className,
            columns: layout ? getComputedStyle(layout).gridTemplateColumns.split(/\s+/).filter(Boolean).length : 0,
            sameRow: !!contentRect && !!mediaRect && Math.abs(contentRect.top - mediaRect.top) <= 1,
            mediaBeforeContent: !!contentRect && !!mediaRect && mediaRect.top < contentRect.top,
            flippedColumns: content && media ? [getComputedStyle(content).gridColumnStart, getComputedStyle(media).gridColumnStart] : [],
            frameRatio: frameRect && frameRect.height > 0 ? frameRect.width / frameRect.height : 0,
            fit: media ? getComputedStyle(media.querySelector(".bf-rich-list-media-frame > *") as Element).objectFit : "",
            overflow: section.scrollWidth - section.clientWidth
          };
        }), width);
        for (const state of states) {
          const wide = width === 1036;
          assert(state.columns === (wide ? 2 : 1), `Expected ${tier} rich vertical ${state.className} to switch to ${wide ? "two" : "one"} layout column(s) at ${width}px.`);
          assert(state.overflow <= 1, `Expected ${tier} rich vertical ${state.className} to avoid overflow at ${width}px.`);
          if (wide) {
            assert(state.sameRow && (state.className.includes("is-flipped") ? state.flippedColumns.join(",") === "2,1" : state.flippedColumns.join(",") === "1,2"), `Expected ${tier} rich vertical ${state.className} to preserve its wide logical column order.`);
          } else {
            assert(!state.sameRow, `Expected ${tier} rich vertical ${state.className} to stack content and media below 1036px.`);
          }
          if (state.className.includes("is-contain")) assert(state.fit === "contain", `Expected ${tier} flipped rich vertical media to use object-fit contain.`);
          if (state.className.includes("is-video")) assert(Math.abs(state.frameRatio - (16 / 9)) <= 0.04, `Expected ${tier} video rich vertical frame to retain 16:9.`);
          if (state.className.includes("is-narrow-3-2") && !wide) assert(Math.abs(state.frameRatio - (3 / 2)) <= 0.04, `Expected ${tier} narrow rich vertical frame to retain 3:2.`);
          if (state.className.includes("is-wide-2-3") && wide) assert(Math.abs(state.frameRatio - (2 / 3)) <= 0.04, `Expected ${tier} wide portrait rich vertical frame to retain 2:3.`);
        }
      }
      const verticalMarkers = await page.evaluate(() => {
        const root = document.querySelector<HTMLElement>("main[data-baseline-label='rich vertical list page']");
        return root ? root.querySelectorAll("[data-baseline-check]").length : 0;
      });
      assert(verticalMarkers >= 16, `Expected ${tier} rich vertical fixtures to retain baseline coverage.`);
    }

    await page.goto(`${origin}/demo/components/tab-section.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tier of tiers) {
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
      const geometry = await page.locator(".bf-tab-section").evaluateAll((roots, widthValue) => roots.map(root => {
        const section = root as HTMLElement;
        section.style.inlineSize = `${widthValue}px`;
        const layout = section.querySelector<HTMLElement>(":scope > .bf-tab-section-layout");
        const header = section.querySelector<HTMLElement>(".bf-tab-section-header")?.getBoundingClientRect();
        const intro = section.querySelector<HTMLElement>(".bf-tab-section-intro")?.getBoundingClientRect();
        const tabs = section.querySelector<HTMLElement>(".bf-tab-section-tabs")?.getBoundingClientRect();
        return {
          className: section.className,
          columns: layout ? getComputedStyle(layout).gridTemplateColumns.split(/\s+/).filter(Boolean).length : 0,
          headerTop: header?.top ?? 0,
          introTop: intro?.top ?? 0,
          tabsTop: tabs?.top ?? 0,
          headerLeft: header?.left ?? 0,
          introLeft: intro?.left ?? 0,
          tabsLeft: tabs?.left ?? 0,
          overflow: section.scrollWidth - section.clientWidth
        };
      }), 1036);
      assert(geometry.length === 3, `Expected ${tier} tab section to expose three layout specimens.`);
      for (const state of geometry) {
        assert(state.columns === 4 && state.overflow <= 1, `Expected ${tier} ${state.className} tab section to retain four large grid columns without overflow.`);
        if (state.className.includes("is-50-50") && !state.className.includes("is-deep")) {
          assert(Math.abs(state.headerTop - state.tabsTop) <= 1 && Math.abs(state.headerLeft - state.tabsLeft) > 1, `Expected ${tier} unadorned 50/50 tabs to share the large row with the heading.`);
        } else {
          assert(state.introTop === 0 || Math.abs(state.headerTop - state.introTop) <= 1, `Expected ${tier} tab section heading and intro to share their large row when intro exists.`);
          assert(state.tabsTop > state.headerTop, `Expected ${tier} tab rail to follow the large heading/intro row.`);
        }
      }
      const narrowGeometry = await page.locator(".bf-tab-section").evaluateAll(roots => roots.map(root => {
        const section = root as HTMLElement;
        section.style.inlineSize = "56rem";
        const layout = section.querySelector<HTMLElement>(":scope > .bf-tab-section-layout");
        const children = Array.from(layout?.children ?? []).map(child => child.getBoundingClientRect());
        return { columns: layout ? getComputedStyle(layout).gridTemplateColumns.split(/\s+/).filter(Boolean).length : 0, rows: new Set(children.map(rect => Math.round(rect.top))).size, overflow: section.scrollWidth - section.clientWidth };
      }));
      assert(narrowGeometry.every(state => state.columns === 1 && state.rows >= 2 && state.overflow <= 1), `Expected ${tier} tab sections to stack their layout below the large threshold without overflow: ${JSON.stringify(narrowGeometry)}.`);

      const firstTab = page.locator(".bf-tab-section").first().locator("[role='tab']").first();
      await firstTab.focus();
      await page.keyboard.press("ArrowRight");
      const moved = page.locator(".bf-tab-section").first().locator("[role='tab']").nth(1);
      assert(await moved.getAttribute("aria-selected") === "true" && await moved.getAttribute("tabindex") === "0", `Expected ${tier} tab section ArrowRight to move selection and roving focus.`);
      await page.keyboard.press("Home");
      assert(await firstTab.getAttribute("aria-selected") === "true", `Expected ${tier} tab section Home to select the first tab.`);
      await page.keyboard.press("End");
      assert(await moved.getAttribute("aria-selected") === "true", `Expected ${tier} tab section End to select the final tab.`);
      const panelState = await page.locator(".bf-tab-section").first().locator("[role='tabpanel']").evaluateAll(panels => panels.map(panel => ({ hidden: panel.getAttribute("aria-hidden"), display: getComputedStyle(panel).display })));
      assert(panelState.filter(panel => panel.hidden === "false").length === 1 && panelState.filter(panel => panel.hidden === "true").length === 1, `Expected ${tier} tab section to synchronize one visible and one hidden panel.`);
    }
    await page.close();
  } finally {
    await browser.close();
  }
}

async function verifyLinkedLogoAndStickyFooterGeometry(origin: string): Promise<void> {
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1600, height: 1200 }
    });

    await page.goto(`${origin}/demo/components/linked-logo-section.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const tiers = ["editorial", "documentation", "app", "os"] as const;
    const widths = [
      { value: "37.5rem", expectedColumns: 1, label: "below 620px" },
      { value: "38.75rem", expectedColumns: 2, label: "at 620px" },
      { value: "64.75rem", expectedColumns: 2, label: "at 1036px" }
    ] as const;

    for (const tier of tiers) {
      const tierSelect = page.locator("[data-page-chrome-tier-select]");
      await tierSelect.selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);

      for (const width of widths) {
        const measurements = await page.locator(".bf-linked-logo-section").evaluateAll((roots, widthValue) => {
          const rootWidth = Number.parseFloat(widthValue);
          return roots.map(root => {
            const section = root as HTMLElement;
            section.style.inlineSize = widthValue;
            const layout = section.querySelector<HTMLElement>(":scope > .bf-linked-logo-section-layout");
            const header = section.querySelector<HTMLElement>(":scope > .bf-linked-logo-section-layout > .bf-linked-logo-section-header");
            const logos = section.querySelector<HTMLElement>(":scope > .bf-linked-logo-section-layout > .bf-linked-logo-section-logos");
            const cards = Array.from(section.querySelectorAll<HTMLElement>(".bf-linked-logo-section-card"));
            const markRatios = cards.map(card => {
              const mark = card.querySelector<HTMLElement>(".bf-linked-logo-section-mark")?.getBoundingClientRect();
              return mark && mark.height > 0 ? mark.width / mark.height : 0;
            });
            const layoutRect = layout?.getBoundingClientRect();
            const headerRect = header?.getBoundingClientRect();
            const logosRect = logos?.getBoundingClientRect();
            const ratio = headerRect && logosRect && headerRect.width > 0 ? logosRect.width / headerRect.width : 0;
            const sectionRect = section.getBoundingClientRect();
            const starts = new Set(cards.map(card => Math.round(card.getBoundingClientRect().left)));
            return {
              className: section.className,
              requestedWidth: rootWidth,
              actualWidth: sectionRect.width,
              columns: starts.size,
              ratio,
              layoutColumns: layout ? getComputedStyle(layout).gridTemplateColumns.split(/\s+/).filter(Boolean).length : 0,
              markRatios,
              overflow: section.scrollWidth - section.clientWidth,
              layoutWidth: layoutRect?.width ?? 0
            };
          });
        }, width.value);

        assert(measurements.every(measurement => Math.abs(measurement.actualWidth - measurement.requestedWidth * 16) <= 1), `Expected ${tier} linked-logo sections to honor their ${width.label} intrinsic width.`);
        for (const measurement of measurements) {
          const expectedColumns = width.value === "64.75rem"
            ? (measurement.className.includes("is-full") ? 4 : measurement.className.includes("is-25-75") ? 3 : 2)
            : width.expectedColumns;
          assert(measurement.columns === expectedColumns, `Expected ${tier} ${measurement.className} linked-logo cards to use ${expectedColumns} column(s) ${width.label}; got ${measurement.columns}.`);
          assert(measurement.markRatios.every(ratio => Math.abs(ratio - (16 / 9)) <= 0.02), `Expected ${tier} ${measurement.className} linked-logo marks to retain a 16:9 ratio.`);
          assert(measurement.overflow <= 1, `Expected ${tier} ${measurement.className} linked-logo section at ${width.label} to avoid inline overflow.`);

          const isLarge = width.value === "64.75rem";
          if (isLarge && measurement.className.includes("is-full")) {
            assert(measurement.columns === 4 && measurement.layoutColumns === 1, `Expected ${tier} full linked-logo rail at 1036px to use four cards across one section column.`);
          }
          if (isLarge && measurement.className.includes("is-50-50")) {
            assert(measurement.columns === 2 && measurement.layoutColumns === 2 && Math.abs(measurement.ratio - 1) <= 0.08, `Expected ${tier} 50/50 linked-logo rail at 1036px to preserve equal header/logo measures.`);
          }
          if (isLarge && measurement.className.includes("is-25-75")) {
            assert(measurement.columns === 3 && measurement.layoutColumns === 2 && Math.abs(measurement.ratio - 3) <= 0.14, `Expected ${tier} 25/75 linked-logo rail at 1036px to preserve the 1:3 header/logo measures.`);
          }
        }
      }
    }

    await page.goto(`${origin}/demo/components/sticky-footer.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tier of tiers) {
      const tierSelect = page.locator("[data-page-chrome-tier-select]");
      await tierSelect.selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);

      for (const viewport of [
        { width: 600, height: 500, enabled: false, label: "below 620px" },
        { width: 620, height: 1200, enabled: true, label: "at 620px" }
      ] as const) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.waitForTimeout(50);
        const state = await page.evaluate(() => {
          const shells = Array.from(document.querySelectorAll<HTMLElement>(".bf-page-shell.is-site-layout"));
          const shortShell = shells[0];
          const longShell = shells[1];
          const shortMain = shortShell?.querySelector<HTMLElement>(":scope > .bf-site-main");
          const shortFooter = shortShell?.querySelector<HTMLElement>(":scope > .bf-site-footer.is-sticky");
          const longMain = longShell?.querySelector<HTMLElement>(":scope > .bf-site-main");
          const longFooter = longShell?.querySelector<HTMLElement>(":scope > .bf-site-footer.is-sticky");
          if (!shortShell || !longShell || !shortMain || !shortFooter || !longMain || !longFooter) return null;
          const shortShellStyle = getComputedStyle(shortShell);
          const shortFooterStyle = getComputedStyle(shortFooter);
          const longShellStyle = getComputedStyle(longShell);
          return {
            shortDisplay: shortShellStyle.display,
            shortMinBlockSize: shortShellStyle.minBlockSize,
            shortFooterMarginStart: shortFooterStyle.marginBlockStart,
            shortFooterBottomDelta: shortShell.getBoundingClientRect().bottom - shortFooter.getBoundingClientRect().bottom,
            longDisplay: longShellStyle.display,
            longMinBlockSize: longShellStyle.minBlockSize,
            longFooterMarginStart: getComputedStyle(longFooter).marginBlockStart,
            longFooterAfterMain: longFooter.getBoundingClientRect().top >= longMain.getBoundingClientRect().bottom - 1,
            longShellHeight: longShell.getBoundingClientRect().height
          };
        });
        assert(state, `Expected ${tier} sticky-footer shell geometry at ${viewport.label}.`);
        if (viewport.enabled) {
          assert(state.shortDisplay === "flex", `Expected ${tier} sticky-footer short shell to enable flex pinning ${viewport.label}.`);
          assert(state.shortMinBlockSize !== "0px" && Math.abs(state.shortFooterBottomDelta) <= 1, `Expected ${tier} short sticky footer to meet the shell block-end ${viewport.label}.`);
          assert(state.longDisplay === "flex" && state.longFooterAfterMain, `Expected ${tier} long sticky footer to follow content without overlay ${viewport.label}.`);
        } else {
          assert(state.shortDisplay !== "flex" && state.shortFooterMarginStart !== "auto", `Expected ${tier} sticky-footer pinning to remain disabled ${viewport.label}.`);
          assert(state.longDisplay !== "flex" && state.longFooterMarginStart !== "auto", `Expected ${tier} long shell to remain ordinary document flow ${viewport.label}.`);
        }
      }
    }

    await page.close();
  } finally {
    await browser.close();
  }
}

async function verifySitesRecipeCompositions(origin: string): Promise<void> {
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1600, height: 1200 }
    });
    const tiers = ["editorial", "documentation", "app", "os"] as const;

    await page.goto(`${origin}/demo/components/equal-heights.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tier of tiers) {
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
      for (const width of [600, 620, 1036] as const) {
        await page.setViewportSize({ width, height: 1200 });
        await page.waitForTimeout(50);
        const measurements = await page.locator(".bf-section").evaluateAll((sections, widthValue) => sections.map(section => {
          const root = section as HTMLElement;
          root.style.inlineSize = `${widthValue}px`;
          const row = root.querySelector<HTMLElement>(".bf-equal-height-row");
          if (!row) return null;
          const rootRect = root.getBoundingClientRect();
          const rowRect = row.getBoundingClientRect();
          const columns = Array.from(row.querySelectorAll<HTMLElement>(":scope > .bf-equal-height-row-col"));
          const rects = columns.map(column => column.getBoundingClientRect());
          const baselineProbe = document.createElement("span");
          baselineProbe.style.cssText = "position:absolute;visibility:hidden;inline-size:1px;block-size:var(--bf-baseline)";
          row.append(baselineProbe);
          const baseline = baselineProbe.getBoundingClientRect().height;
          baselineProbe.remove();
          const starts = new Set(rects.map(rect => Math.round(rect.left))).size;
          const rows = new Set(rects.map(rect => Math.round(rect.top))).size;
          const ratios = columns.map(column => {
            const rect = column.getBoundingClientRect();
            return baseline > 0 ? rect.height / baseline : 0;
          });
          return {
            rowClass: row.className,
            rootWidth: rootRect.width,
            rowWidth: rowRect.width,
            rowLeft: rowRect.left,
            rootRight: rootRect.right,
            starts,
            rows,
            baseline,
            baselineRatios: ratios,
            rootOverflow: root.scrollWidth - root.clientWidth,
            rowOverflow: row.scrollWidth - row.clientWidth
          };
        }), width);

        const valid = measurements.filter((measurement): measurement is NonNullable<typeof measurement> => measurement !== null);
        assert(valid.length === 3, `Expected equal-heights to expose three measured recipe rows for ${tier} at ${width}px.`);
        for (const measurement of valid) {
          assert(Math.abs(measurement.rootWidth - width) <= 1, `Expected ${tier} ${measurement.rowClass} recipe section to honor ${width}px width.`);
          assert(measurement.baseline > 0 && measurement.baselineRatios.every(ratio => Math.abs(ratio - Math.round(ratio)) <= 0.06), `Expected ${tier} ${measurement.rowClass} row columns to remain baseline multiples at ${width}px.`);
          assert(measurement.rootOverflow <= 1 && measurement.rowOverflow <= 1, `Expected ${tier} ${measurement.rowClass} recipe to avoid overflow at ${width}px.`);
          const expectedStarts = width < 620 ? 1 : width < 1036 ? 2 : measurement.rowClass.includes("is-columns-3") ? 3 : measurement.rowClass.includes("is-columns-2") ? 2 : 4;
          assert(measurement.starts === expectedStarts, `Expected ${tier} ${measurement.rowClass} recipe to use ${expectedStarts} column(s) at ${width}px, got ${measurement.starts}.`);
          const itemCount = measurement.rowClass.includes("is-columns-3") ? 3 : measurement.rowClass.includes("is-columns-2") ? 2 : 4;
          const expectedRows = width < 620 ? itemCount : width < 1036 ? Math.ceil(itemCount / 2) : 1;
          assert(measurement.rows === expectedRows, `Expected ${tier} ${measurement.rowClass} recipe to use ${expectedRows} row(s) at ${width}px, got ${measurement.rows}.`);
          if (width >= 1036 && (measurement.rowClass.includes("is-columns-2") || measurement.rowClass.includes("is-columns-3"))) {
            const expectedRatio = measurement.rowClass.includes("is-columns-2") ? 0.5 : 0.75;
            assert(Math.abs((measurement.rowWidth / measurement.rootWidth) - expectedRatio) <= 0.04, `Expected ${tier} ${measurement.rowClass} recipe to occupy the trailing ${expectedRatio * 100}% at large width.`);
            assert(Math.abs(measurement.rootRight - (measurement.rowLeft + measurement.rowWidth)) <= 1, `Expected ${tier} ${measurement.rowClass} recipe to align to the trailing edge at large width.`);
          }
        }
      }
    }

    await page.goto(`${origin}/demo/components/empty-state.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tier of tiers) {
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
      for (const width of [600, 1036] as const) {
        await page.setViewportSize({ width, height: 1200 });
        const state = await page.evaluate(() => {
          const sections = Array.from(document.querySelectorAll<HTMLElement>("main > .bf-section"));
          const search = document.querySelector<HTMLInputElement>(".bf-search-box input[type='search']");
          const notice = document.querySelector<HTMLElement>(".bf-notice.is-negative[role='alert']");
          const actions = Array.from(document.querySelectorAll<HTMLElement>(".bf-button"));
          return {
            sections: sections.length,
            sectionOverflow: sections.map(section => section.scrollWidth - section.clientWidth),
            baselineMarkers: document.querySelectorAll("[data-baseline-check]").length,
            search: !!search,
            searchLabel: !!search && !!document.querySelector(`label[for='${search.id}']`),
            notice: !!notice,
            actions: actions.length,
            emptySelector: document.querySelector(".bf-empty-state") !== null
          };
        });
        assert(state.sections === 3 && state.baselineMarkers >= 12, `Expected ${tier} empty-state recipes to retain three sections and baseline markers at ${width}px.`);
        assert(state.sectionOverflow.every(delta => delta <= 1), `Expected ${tier} empty-state recipes to avoid inline overflow at ${width}px.`);
        assert(state.search && state.searchLabel && state.notice && state.actions >= 2 && !state.emptySelector, `Expected ${tier} empty-state recipes to retain accessible search/actions/notice composition without a dedicated selector at ${width}px.`);
      }
    }
    await page.close();
  } finally {
    await browser.close();
  }
}

async function verifyContentCardGeometry(origin: string): Promise<void> {
  const tiers = ["editorial", "documentation", "app", "os"] as const;
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({ deviceScaleFactor: 1, viewport: { width: 1200, height: 1200 } });
    await page.goto(`${origin}/demo/components/content-card.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);

    const readState = async () => page.evaluate(() => {
      const probe = document.createElement("span");
      probe.style.cssText = "position:absolute;visibility:hidden;inline-size:1px;block-size:var(--bf-baseline)";
      document.body.append(probe);
      const baseline = probe.getBoundingClientRect().height;
      probe.remove();
      const cards = Array.from(document.querySelectorAll<HTMLElement>(".bf-content-card"));
      return {
        baseline,
        cards: cards.map(card => {
          const wrapper = card.closest<HTMLElement>(".bf-content-card-wrapper");
          const frame = card.querySelector<HTMLElement>(".bf-content-card-frame");
          const media = card.querySelector<HTMLElement>(".bf-content-card-media");
          const content = card.querySelector<HTMLElement>(".bf-content-card-content");
          const title = card.querySelector<HTMLElement>(".bf-content-card-title");
          const mainLink = card.querySelector<HTMLElement>(".bf-content-card-main-link");
          const description = card.querySelector<HTMLElement>(".bf-content-card-description");
          const cardRect = card.getBoundingClientRect();
          const wrapperRect = wrapper?.getBoundingClientRect();
          const frameRect = frame?.getBoundingClientRect();
          const mediaRect = media?.getBoundingClientRect();
          const contentRect = content?.getBoundingClientRect();
          const titleStyle = title ? getComputedStyle(title) : null;
          const linkStyle = mainLink ? getComputedStyle(mainLink) : null;
          const descriptionStyle = description ? getComputedStyle(description) : null;
          return {
            className: card.className,
            width: cardRect.width,
            height: cardRect.height,
            wrapperHeight: wrapperRect?.height ?? 0,
            wrapperGridColumn: wrapper ? getComputedStyle(wrapper).gridColumn : "",
            frameDisplay: frame ? getComputedStyle(frame).display : "",
            mediaTop: mediaRect?.top ?? 0,
            contentTop: contentRect?.top ?? 0,
            mediaLeft: mediaRect?.left ?? 0,
            contentLeft: contentRect?.left ?? 0,
            titleFontSize: titleStyle?.fontSize ?? "",
            linkClamp: linkStyle?.webkitLineClamp ?? "",
            linkLineHeight: linkStyle ? Number.parseFloat(linkStyle.lineHeight) : 0,
            linkHeight: mainLink?.getBoundingClientRect().height ?? 0,
            descriptionClamp: descriptionStyle?.webkitLineClamp ?? "",
            descriptionLineHeight: descriptionStyle ? Number.parseFloat(descriptionStyle.lineHeight) : 0,
            descriptionHeight: description?.getBoundingClientRect().height ?? 0,
            overflow: card.scrollWidth - card.clientWidth
          };
        })
      };
    });

    const assertBaselineSnapped = (state: Awaited<ReturnType<typeof readState>>, label: string) => {
      assert(state.baseline > 0, `Expected ${label} to resolve a positive BF baseline.`);
      for (const card of state.cards) {
        assert(Math.abs(card.height - Math.round(card.height / state.baseline) * state.baseline) <= contentCardBaselineTolerancePx, `Expected ${label} ${card.className} card height to snap to the baseline (height=${card.height}, baseline=${state.baseline}).`);
        assert(Math.abs(card.wrapperHeight - Math.round(card.wrapperHeight / state.baseline) * state.baseline) <= contentCardBaselineTolerancePx, `Expected ${label} ${card.className} wrapper height to snap to the baseline (height=${card.wrapperHeight}, baseline=${state.baseline}).`);
        assert(card.overflow <= 1, `Expected ${label} ${card.className} card to avoid inline overflow.`);
      }
    };

    for (const tier of tiers) {
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
      await page.locator(".bf-content-card").evaluateAll(cards => cards.forEach(card => {
        const element = card as HTMLElement;
        element.style.removeProperty("inline-size");
        element.style.removeProperty("max-inline-size");
        element.style.removeProperty("flex");
      }));

      for (const viewport of [
        { width: 1200, label: "1200px" },
        { width: 320, label: "320px" }
      ]) {
        await page.setViewportSize({ width: viewport.width, height: 1200 });
        await page.waitForTimeout(60);
        const state = await readState();
        assertBaselineSnapped(state, `${tier} at ${viewport.label}`);
        assert(state.cards.length >= 7, `Expected ${tier} content-card fixture to expose all image/no-image and span variants at ${viewport.label}.`);
        assert(state.cards.some(card => card.className.includes("is-cols-2")) && state.cards.some(card => card.className.includes("is-cols-4")) && state.cards.some(card => card.className.includes("is-cols-6")) && state.cards.some(card => card.className.includes("is-cols-8")), `Expected ${tier} content-card fixture to preserve 2/4/6/8 span classes at ${viewport.label}.`);
        assert(state.cards.every(card => card.width > 0), `Expected ${tier} content-card cards to retain positive allocated width at ${viewport.label}.`);
        if (viewport.width === 320) {
          const narrowWidth = Math.max(...state.cards.map(card => card.width));
          assert(state.cards.every(card => Math.abs(card.width - narrowWidth) <= 1), `Expected ${tier} content-card wrappers to occupy the shared narrow track.`);
        }
      }

      await page.setViewportSize({ width: 1200, height: 1200 });
      await page.waitForTimeout(60);
      const normalFour = page.locator(".bf-content-card.is-cols-4:not(.is-image-top)").first();
      const featureEight = page.locator(".bf-content-card.is-cols-8").first();
      const imageTop = page.locator(".bf-content-card.is-image-top").first();

      await normalFour.evaluate(card => {
        const element = card as HTMLElement;
        element.style.inlineSize = "30rem";
        element.style.maxInlineSize = "none";
        element.style.flex = "0 0 auto";
      });
      let reflow = await normalFour.evaluate(card => {
        const frame = card.querySelector<HTMLElement>(".bf-content-card-frame")?.getBoundingClientRect();
        const media = card.querySelector<HTMLElement>(".bf-content-card-media")?.getBoundingClientRect();
        const content = card.querySelector<HTMLElement>(".bf-content-card-content")?.getBoundingClientRect();
        return frame && media && content ? { display: getComputedStyle(card.querySelector(".bf-content-card-frame") as Element).display, sameRow: Math.abs(media.top - content.top) <= 1, frameWidth: frame.width } : null;
      });
      assert(reflow?.sameRow && reflow.frameWidth >= 460, `Expected ${tier} four-column content-card to reflow horizontally when allocated at least 460px.`);

      await normalFour.evaluate(card => { const element = card as HTMLElement; element.style.inlineSize = "20rem"; element.style.maxInlineSize = "none"; });
      reflow = await normalFour.evaluate(card => {
        const frame = card.querySelector<HTMLElement>(".bf-content-card-frame");
        const media = card.querySelector<HTMLElement>(".bf-content-card-media")?.getBoundingClientRect();
        const content = card.querySelector<HTMLElement>(".bf-content-card-content")?.getBoundingClientRect();
        return frame && media && content ? { display: getComputedStyle(frame).display, stacked: content.top > media.top + 1 } : null;
      });
      assert(reflow?.stacked, `Expected ${tier} four-column content-card to stack below its intrinsic 460px allocation threshold.`);

      await featureEight.evaluate(card => { const element = card as HTMLElement; element.style.inlineSize = "64rem"; element.style.maxInlineSize = "none"; });
      reflow = await featureEight.evaluate(card => {
        const frame = card.querySelector<HTMLElement>(".bf-content-card-frame");
        const media = card.querySelector<HTMLElement>(".bf-content-card-media")?.getBoundingClientRect();
        const content = card.querySelector<HTMLElement>(".bf-content-card-content")?.getBoundingClientRect();
        return frame && media && content ? { display: getComputedStyle(frame).display, sameRow: Math.abs(media.top - content.top) <= 1, separated: Math.abs(media.left - content.left) > 1 } : null;
      });
      assert(reflow?.display === "grid" && reflow.sameRow && reflow.separated, `Expected ${tier} eight-column feature content-card to preserve the wide 50/50 split.`);

      await imageTop.evaluate(card => { const element = card as HTMLElement; element.style.inlineSize = "64rem"; element.style.maxInlineSize = "none"; });
      reflow = await imageTop.evaluate(card => {
        const media = card.querySelector<HTMLElement>(".bf-content-card-media")?.getBoundingClientRect();
        const content = card.querySelector<HTMLElement>(".bf-content-card-content")?.getBoundingClientRect();
        return media && content ? { stacked: content.top > media.top + 1 } : null;
      });
      assert(reflow?.stacked, `Expected ${tier} image-top content-card to remain vertical at wide allocation.`);

      const roleState = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll<HTMLElement>(".bf-content-card"));
        const h1Probe = document.createElement("span");
        h1Probe.style.cssText = "position:absolute;visibility:hidden;font-size:var(--bf-h1-font-size)";
        document.body.append(h1Probe);
        const h1Size = getComputedStyle(h1Probe).fontSize;
        h1Probe.remove();
        const h4Probe = document.createElement("span");
        h4Probe.style.cssText = "position:absolute;visibility:hidden;font-size:var(--bf-h4-font-size)";
        document.body.append(h4Probe);
        const h4Size = getComputedStyle(h4Probe).fontSize;
        h4Probe.remove();
        return cards.map(card => ({ span: card.className.match(/is-cols-(2|4|6|8)/)?.[1], size: getComputedStyle(card.querySelector(".bf-content-card-title") as Element).fontSize }))
          .filter(item => item.span === "2" || item.span === "4" || item.span === "6" || item.span === "8")
          .reduce((result, item) => ({ ...result, [item.span as string]: item.size }), { h1: h1Size, h4: h4Size } as Record<string, string>);
      });
      assert(roleState["2"] === roleState.h4 && roleState["4"] === roleState.h4 && roleState["6"] === roleState.h4 && roleState["8"] === roleState.h1, `Expected ${tier} content-card title roles to map 2/4/6 to h4 and 8 to h1.`);

      const clampState = await page.locator(".bf-content-card.is-cols-6").first().evaluate(card => {
        const link = card.querySelector<HTMLElement>(".bf-content-card-main-link");
        const description = card.querySelector<HTMLElement>(".bf-content-card-description");
        return link && description ? { linkClamp: getComputedStyle(link).webkitLineClamp, linkHeight: link.getBoundingClientRect().height, linkLineHeight: Number.parseFloat(getComputedStyle(link).lineHeight), descriptionClamp: getComputedStyle(description).webkitLineClamp, descriptionHeight: description.getBoundingClientRect().height, descriptionLineHeight: Number.parseFloat(getComputedStyle(description).lineHeight) } : null;
      });
      assert(clampState && clampState.linkClamp === "2" && clampState.descriptionClamp === "2" && clampState.linkHeight <= clampState.linkLineHeight * 2 + 1 && clampState.descriptionHeight <= clampState.descriptionLineHeight * 2 + 16, `Expected ${tier} six-column long content-card copy to retain its two-line clamps.`);

      const revealCard = page.locator(".bf-content-card.is-cols-2.is-description-reveal").first();
      const revealLink = revealCard.locator(".bf-content-card-main-link");
      const revealDescription = revealCard.locator(".bf-content-card-description-panel");
      await revealCard.hover();
      await page.waitForTimeout(450);
      assert(await revealDescription.evaluate(element => Number.parseFloat(getComputedStyle(element).opacity) > 0.9), `Expected ${tier} content-card hover to reveal its description panel.`);
      await page.mouse.move(0, 0);
      await page.keyboard.press("Tab");
      await revealLink.focus();
      await page.waitForTimeout(450);
      const focusState = await revealCard.evaluate(card => ({ outline: getComputedStyle(card).outlineStyle, descriptionVisible: Number.parseFloat(getComputedStyle(card.querySelector(".bf-content-card-description-panel") as Element).opacity) > 0.9 }));
      assert(focusState.descriptionVisible && focusState.outline !== "none", `Expected ${tier} content-card keyboard focus to reveal copy and expose a visible focus outline (visible=${focusState.descriptionVisible}, outline=${focusState.outline}).`);

      await page.evaluate(() => history.replaceState(null, "", "#"));
      await revealCard.click({ position: { x: 4, y: 4 } });
      assert(await page.evaluate(() => location.hash === "#two-column-destination"), `Expected ${tier} expanded content-card surface click to activate its main destination.`);
      await page.locator("body").click({ position: { x: 1, y: 1 } });
      await page.waitForTimeout(450);
      await page.evaluate(() => history.replaceState(null, "", "#"));
      await revealCard.locator(".bf-content-card-author-date a").click();
      assert(await page.evaluate(() => location.hash === "#author-canonical"), `Expected ${tier} content-card author action to win over the expanded card link.`);
      await page.evaluate(() => history.replaceState(null, "", "#"));
      await revealCard.locator(".bf-content-card-resource").click();
      assert(await page.evaluate(() => location.hash === "#whitepaper"), `Expected ${tier} content-card footer action to win over the expanded card link.`);

      const rtlState = await page.locator(".bf-content-card-wrapper[dir='rtl'] .bf-content-card-footer-inner").evaluate(element => {
        const styles = getComputedStyle(element);
        return { direction: styles.direction, overflowX: styles.overflowX, mask: styles.maskImage, scrollable: element.scrollWidth >= element.clientWidth };
      });
      assert(rtlState.direction === "rtl" && rtlState.overflowX === "auto" && rtlState.mask.includes("left") && rtlState.scrollable, `Expected ${tier} RTL content-card footer rail to preserve its left-edge mask and scroll contract.`);
    }

    await page.close();
  } finally {
    await browser.close();
  }
}

async function main(): Promise<void> {
  const rootDir = path.resolve(".");
  const { server, origin } = await createStaticServer(rootDir);

  try {
    await verifyPageChromeNavigationScroll(origin);
    await verifyExamplePreferencesBeforePaint(origin);
    await verifyExampleMainClearsPageNavigation(origin);
    await verifyPinnedAsideResize(origin);
    await verifyDrawerOverlay(origin);
    await verifyApplicationLayout(origin);
    await verifyTopNavigation(origin);
    await verifyBodySizedUiTypography(origin);
    await verifyRenewalCompositionContracts(origin);
    await verifyAdversarialResponsiveGeometry(origin);
    await verifyDirectAndClassSurfaceGeometry(origin);
    await verifySkipLink(origin);
    await verifyParityInteractions(origin);
    await verifyReducedNavigationAndTableOfContents(origin);
    await verifyInteractiveTables(origin);
    await verifyPortedCompositionGeometry(origin);
    await verifyRichListsAndTabSectionGeometry(origin);
    await verifySitesRecipeCompositions(origin);
    await verifyContentCardGeometry(origin);
    await verifyLinkedLogoAndStickyFooterGeometry(origin);

    console.log("Component behavior verification passed.");
  } finally {
    await closeServer(server);
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
