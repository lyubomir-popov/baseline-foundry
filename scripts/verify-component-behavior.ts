import fs from "node:fs/promises";
import path from "node:path";
import { closeServer, createStaticServer, waitForFonts } from "./component-demo-shared.ts";
import { assert, disableDemoChromeHitTesting, openBrowser } from "./behavior/browser-helpers.ts";
import {
  verifyContentCardGeometry,
  verifyInteractiveTables,
  verifyLinkedLogoAndStickyFooterGeometry,
  verifyPortedCompositionGeometry,
  verifyReducedNavigationAndTableOfContents,
  verifyRichListsAndTabSectionGeometry,
  verifySiteShellPrimitiveGeometry,
  verifySitesRecipeCompositions
} from "./behavior/ported-component-contracts.ts";

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

async function verifyPageChromeHierarchyAndKeylines(origin: string): Promise<void> {
  const tiers = ["editorial", "documentation", "app", "os"] as const;
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1440, height: 720 }
    });

    await page.goto(`${origin}/examples/grid/app-panels.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const chrome = await page.evaluate(() => {
      const bodyStyles = getComputedStyle(document.body);
      const breadcrumbs = Array.from(document.querySelectorAll<HTMLElement>(".pc-breadcrumbs .bf-breadcrumbs-item"));
      const sequence = Array.from(document.querySelectorAll<HTMLElement>("a.pc-sequence-link"));
      const footer = document.querySelector<HTMLElement>(".pc-footer");
      return {
        bodyFontSize: bodyStyles.fontSize,
        bodyLineHeight: bodyStyles.lineHeight,
        breadcrumbType: breadcrumbs.map(item => ({
          fontSize: getComputedStyle(item).fontSize,
          lineHeight: getComputedStyle(item).lineHeight
        })),
        footerBottomDelta: footer ? window.innerHeight - footer.getBoundingClientRect().bottom : null,
        footerHeight: footer?.getBoundingClientRect().height ?? null,
        reservedFooterSpace: Number.parseFloat(bodyStyles.paddingBlockEnd),
        sequence: sequence.map(link => ({
          accessibleName: link.getAttribute("aria-label"),
          background: getComputedStyle(link).backgroundColor,
          decoration: getComputedStyle(link).textDecorationLine,
          iconCount: link.querySelectorAll(".bf-icon").length,
          text: link.textContent?.trim() ?? ""
        }))
      };
    });
    assert(chrome.breadcrumbType.length === 2 && chrome.breadcrumbType.every(type => type.fontSize === chrome.bodyFontSize && type.lineHeight === chrome.bodyLineHeight), `Expected page-chrome breadcrumbs to use body typography: ${JSON.stringify(chrome)}.`);
    assert(chrome.sequence.length === 2 && chrome.sequence.every(link => link.accessibleName && link.iconCount === 1 && link.text === "" && link.background === "rgb(255, 255, 255)" && link.decoration === "none"), `Expected white chevron-only adjacent-page link-buttons with accessible names: ${JSON.stringify(chrome.sequence)}.`);
    assert(chrome.footerBottomDelta !== null && Math.abs(chrome.footerBottomDelta) <= 0.1 && chrome.footerHeight !== null && Math.abs(chrome.reservedFooterSpace - chrome.footerHeight) <= 0.1, `Expected fixed bottom controls to reserve their measured height: ${JSON.stringify(chrome)}.`);

    const nextLink = page.locator("a.pc-sequence-link.is-next");
    await nextLink.hover();
    assert(await nextLink.evaluate(link => getComputedStyle(link).textDecorationLine === "none"), "Expected the element-qualified adjacent-page anchor state to remain non-underlined on hover.");

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(50);
    const finalClearance = await page.evaluate(() => {
      const footer = document.querySelector<HTMLElement>(".pc-footer");
      const content = document.querySelector<HTMLElement>(".pc-content, main");
      return footer && content ? footer.getBoundingClientRect().top - content.getBoundingClientRect().bottom : null;
    });
    assert(finalClearance !== null && finalClearance >= -1, `Expected reserved bottom-bar space to keep final page content visible; clearance=${finalClearance}.`);

    await page.goto(`${origin}/demo/spec/typographic-specimen.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tier of tiers) {
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
      const geometry = await page.evaluate(() => {
        const breadcrumb = document.querySelector<HTMLElement>(".pc-breadcrumbs");
        const fixed = Array.from(document.querySelectorAll<HTMLElement>("main .bf-fixed-width"));
        const host = document.querySelector<HTMLElement>("main section");
        if (!breadcrumb || fixed.length === 0 || !host) return null;

        const plain = document.createElement("hr");
        const styled = document.createElement("hr");
        styled.className = "bf-rule";
        host.append(plain, styled);
        const plainStyles = getComputedStyle(plain);
        const styledStyles = getComputedStyle(styled);
        const rules = {
          plain: {
            background: plainStyles.backgroundColor,
            blockSize: plainStyles.blockSize,
            border: plainStyles.border,
            marginBlockEnd: plainStyles.marginBlockEnd
          },
          styled: {
            background: styledStyles.backgroundColor,
            blockSize: styledStyles.blockSize,
            border: styledStyles.border,
            marginBlockEnd: styledStyles.marginBlockEnd
          }
        };
        plain.remove();
        styled.remove();

        return {
          breadcrumbX: breadcrumb.getBoundingClientRect().left,
          fixed: fixed.map(region => ({
            paddingInlineStart: Number.parseFloat(getComputedStyle(region).paddingInlineStart),
            x: region.getBoundingClientRect().left
          })),
          rules
        };
      });
      assert(geometry && geometry.fixed.every(region => region.paddingInlineStart === 0), `Expected ${tier} specimen fixed-width regions to avoid a second gutter: ${JSON.stringify(geometry)}.`);
      if (tier === "editorial" || tier === "documentation") {
        assert(geometry.fixed.every(region => Math.abs(region.x - geometry.breadcrumbX) <= 1), `Expected uncapped ${tier} specimen regions to share the page keyline: ${JSON.stringify(geometry)}.`);
      }
      assert(JSON.stringify(geometry.rules.plain) === JSON.stringify(geometry.rules.styled), `Expected ${tier} plain hr and bf-rule geometry/paint to match: ${JSON.stringify(geometry.rules)}.`);
    }

    await page.close();
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

      document.body.classList.remove("bf-tier-app");
      document.body.classList.add("bf-tier-editorial");
      application.removeAttribute("style");
      application.classList.add("is-fill");
      document.body.replaceChildren(application);
      const rect = application.getBoundingClientRect();
      return {
        blockSize: getComputedStyle(application).blockSize,
        gridGapInline: getComputedStyle(application).getPropertyValue("--bf-grid-gap-inline").trim(),
        height: rect.height,
        bottom: rect.bottom
      };
    });

    assert(viewportFillState, "Expected full-viewport application state to be measurable.");
    assert(viewportFillState.blockSize === "960px", `Expected the full-viewport application modifier to resolve against the dynamic viewport. Got block-size=${viewportFillState.blockSize}.`);
    assert(viewportFillState.gridGapInline === "1.5rem", `Expected application gutters to remain 1.5rem under editorial typography. Got --bf-grid-gap-inline=${viewportFillState.gridGapInline}.`);
    assert(Math.abs(viewportFillState.height - 960) <= 1, `Expected the full-viewport application modifier to occupy the viewport height. Got height=${viewportFillState.height}px.`);
    assert(Math.abs(viewportFillState.bottom - 960) <= 1, `Expected the full-viewport application modifier to reach the viewport bottom edge. Got bottom=${viewportFillState.bottom}px.`);

    const panelFooterState = await page.evaluate(async () => {
      const content = document.querySelector<HTMLElement>(".bf-main .bf-panel-content");
      const mainFooter = document.querySelector<HTMLElement>("[data-application-layout-main-footer]");
      if (!content || !mainFooter) return null;

      const pressure = document.createElement("div");
      pressure.style.blockSize = "1200px";
      pressure.style.flex = "0 0 auto";
      pressure.setAttribute("aria-hidden", "true");
      content.append(pressure);

      const beforeTop = mainFooter.getBoundingClientRect().top;
      content.scrollTop = 200;
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

      return {
        beforeTop,
        afterTop: mainFooter.getBoundingClientRect().top,
        mainMinBlockSize: getComputedStyle(mainFooter).minBlockSize,
        mainPaddingBlockStart: getComputedStyle(mainFooter).paddingBlockStart,
        scrollTop: content.scrollTop
      };
    });

    assert(panelFooterState, "Expected both application panel footers to be measurable.");
    assert(panelFooterState.scrollTop > 0, "Expected the main panel content to scroll under pressure.");
    assert(Math.abs(panelFooterState.afterTop - panelFooterState.beforeTop) <= 1, `Expected the main panel footer to stay fixed while panel content scrolls. Got before=${panelFooterState.beforeTop}px, after=${panelFooterState.afterTop}px.`);
    assert(Number.parseFloat(panelFooterState.mainMinBlockSize) > 0, `Expected the main panel footer to expose a minimum block size. Got ${panelFooterState.mainMinBlockSize}.`);
    assert(panelFooterState.mainPaddingBlockStart === "0px", `Expected panel footer content to rely on child control nudges instead of container start padding. Got ${panelFooterState.mainPaddingBlockStart}.`);

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

      assert(Number.parseFloat(child.marginBottom) >= 0, `Expected application layout header stack child ${child.tag} to keep non-negative baseline compensation. Got ${child.marginBottom}.`);
      assert(Number.parseFloat(child.paddingBlockStart) > 0, `Expected application layout header stack child ${child.tag} to retain metric-derived start compensation. Got ${child.paddingBlockStart}.`);
      assert(child.paddingBlockEnd === "0px", `Expected application layout header stack child ${child.tag} to move end compensation out of padding. Got ${child.paddingBlockEnd}.`);
    });

    const navigation = page.locator("#application-layout-navigation");
    const menuToggle = page.locator("[data-application-layout-toggle]").first();
    const pinToggle = page.locator("[data-application-layout-pin]");

    await navigation.waitFor({ state: "visible" });
    await menuToggle.waitFor({ state: "visible" });

    const collapsedWidth = await navigation.evaluate(element => element.getBoundingClientRect().width);
    assert(collapsedWidth <= 96, `Expected collapsed application navigation to stay narrow. Got ${collapsedWidth}px.`);

    const collapsedGeometry = await navigation.evaluate(element => {
      const links = Array.from(element.querySelectorAll<HTMLElement>(".bf-side-navigation-list > .bf-side-navigation-item > .bf-side-navigation-link"));
      return links.map(link => {
        const linkRect = link.getBoundingClientRect();
        const icon = link.querySelector<HTMLElement>(".bf-side-navigation-icon");
        const iconRect = icon?.getBoundingClientRect();
        return {
          blockSize: linkRect.height,
          compactBlockSize: Number.parseFloat(getComputedStyle(link).minBlockSize),
          iconCenterDelta: iconRect ? Math.abs(((iconRect.top + iconRect.bottom) / 2) - ((linkRect.top + linkRect.bottom) / 2)) : null,
          iconTransform: icon ? getComputedStyle(icon).transform : null
        };
      });
    });
    assert(collapsedGeometry.length > 0, "Expected collapsed application navigation rows to be measurable.");
    collapsedGeometry.forEach((row, index) => {
      assert(row.blockSize <= row.compactBlockSize + 1, `Expected collapsed navigation row ${index + 1} to retain compact control height. Got row=${row.blockSize}px, compact=${row.compactBlockSize}px.`);
      if (row.iconCenterDelta !== null) {
        assert(row.iconCenterDelta <= 1, `Expected collapsed navigation icon ${index + 1} to remain centred in its compact row. Got delta=${row.iconCenterDelta}px.`);
        assert(row.iconTransform === "none", `Expected collapsed navigation icon ${index + 1} to reset the expanded optical offset. Got transform=${row.iconTransform}.`);
      }
    });
    assert(await page.getByRole("link", { name: "Dashboard", exact: true }).count() === 1, "Expected the visually collapsed Dashboard label to remain the link accessible name.");

    await menuToggle.click({ force: true });
    await page.waitForTimeout(180);

    const expandedState = await page.evaluate(() => {
      const applicationElement = document.querySelector<HTMLElement>(".bf-application");
      const navigationElement = document.querySelector<HTMLElement>("#application-layout-navigation");
      const drawerElement = navigationElement?.querySelector<HTMLElement>(".bf-navigation-drawer");
      const panelElement = drawerElement?.querySelector<HTMLElement>(".bf-panel");
      const toggleElement = document.querySelector<HTMLElement>("[data-application-layout-toggle]");
      if (!(applicationElement instanceof HTMLElement) || !(navigationElement instanceof HTMLElement) ||
          !(drawerElement instanceof HTMLElement) || !(panelElement instanceof HTMLElement) ||
          !(toggleElement instanceof HTMLElement)) {
        return null;
      }

      return {
        applicationBottom: applicationElement.getBoundingClientRect().bottom,
        collapsed: navigationElement.classList.contains("is-collapsed"),
        drawerBottom: drawerElement.getBoundingClientRect().bottom,
        navigationBottom: navigationElement.getBoundingClientRect().bottom,
        panelBottom: panelElement.getBoundingClientRect().bottom,
        width: navigationElement.getBoundingClientRect().width,
        expanded: toggleElement.getAttribute("aria-expanded")
      };
    });

    assert(expandedState, "Expected expanded application layout state to be measurable.");
    assert(!expandedState.collapsed, "Expected application navigation toggle to expand the navigation.");
    assert(expandedState.width >= 220, `Expected expanded application navigation to be visibly wide. Got ${expandedState.width}px.`);
    assert(expandedState.expanded === "true", `Expected application navigation toggle to expose aria-expanded=true, got ${expandedState.expanded}.`);
    assert(Math.abs(expandedState.drawerBottom - expandedState.navigationBottom) <= 1, `Expected desktop navigation drawer to reach the navigation bottom. Got drawer=${expandedState.drawerBottom}px, navigation=${expandedState.navigationBottom}px.`);
    assert(Math.abs(expandedState.panelBottom - expandedState.navigationBottom) <= 1, `Expected desktop navigation panel to reach the navigation bottom. Got panel=${expandedState.panelBottom}px, navigation=${expandedState.navigationBottom}px.`);
    assert(Math.abs(expandedState.navigationBottom - expandedState.applicationBottom) <= 1, `Expected desktop navigation to reach the application bottom. Got navigation=${expandedState.navigationBottom}px, application=${expandedState.applicationBottom}px.`);

    const alignedFooterState = await page.evaluate(() => {
      const mainFooter = document.querySelector<HTMLElement>("[data-application-layout-main-footer]");
      const navigationFooter = document.querySelector<HTMLElement>("[data-application-layout-navigation-footer]");
      const navigationList = document.querySelector<HTMLElement>('[data-baseline-label="application layout nav list one"]');
      if (!mainFooter || !navigationFooter || !navigationList) return null;
      const mainFooterStyles = getComputedStyle(mainFooter);
      const navigationFooterStyles = getComputedStyle(navigationFooter);
      const navigationListStyles = getComputedStyle(navigationList);
      return {
        mainBottom: mainFooter.getBoundingClientRect().bottom,
        navigationBottom: navigationFooter.getBoundingClientRect().bottom,
        mainMinBlockSize: mainFooterStyles.minBlockSize,
        mainPaddingBlockStart: mainFooterStyles.paddingBlockStart,
        navigationMinBlockSize: navigationFooterStyles.minBlockSize,
        navigationPaddingBlockStart: navigationFooterStyles.paddingBlockStart,
        navigationListMarginBottom: navigationListStyles.marginBottom,
        navigationListPaddingBottom: navigationListStyles.paddingBottom
      };
    });
    assert(alignedFooterState, "Expected expanded navigation and main panel footers to be measurable.");
    assert(Math.abs(alignedFooterState.mainBottom - alignedFooterState.navigationBottom) <= 1, `Expected navigation and main panel footers to share the bottom edge. Got main=${alignedFooterState.mainBottom}px, navigation=${alignedFooterState.navigationBottom}px.`);
    assert(alignedFooterState.mainMinBlockSize === alignedFooterState.navigationMinBlockSize, `Expected both panel footers to share the same minimum block size. Got main=${alignedFooterState.mainMinBlockSize}, navigation=${alignedFooterState.navigationMinBlockSize}.`);
    assert(alignedFooterState.mainPaddingBlockStart === "0px" && alignedFooterState.navigationPaddingBlockStart === "0px", `Expected both panel footers to remove container start padding. Got main=${alignedFooterState.mainPaddingBlockStart}, navigation=${alignedFooterState.navigationPaddingBlockStart}.`);
    assert(alignedFooterState.navigationListPaddingBottom === "0px", `Expected side-navigation list groups to remove block-end padding. Got ${alignedFooterState.navigationListPaddingBottom}.`);
    assert(alignedFooterState.navigationListMarginBottom === "0px", `Expected side-navigation list groups not to add block-end margin. Got ${alignedFooterState.navigationListMarginBottom}.`);

    const navigationBrandState = await page.evaluate(() => {
      const header = document.querySelector<HTMLElement>("[data-navigation-brand-header]");
      const panel = header?.closest<HTMLElement>(".bf-panel");
      const logo = header?.querySelector<HTMLElement>(".bf-top-navigation-logo.is-canonical-tagged");
      const tag = header?.querySelector<HTMLElement>(".bf-top-navigation-logo-tag");
      const title = header?.querySelector<HTMLElement>(".bf-top-navigation-logo-title");
      if (!header || !panel || !logo || !tag || !title) return null;
      const headerRect = header.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      const logoRect = logo.getBoundingClientRect();
      const tagRect = tag.getBoundingClientRect();
      const headerStyles = getComputedStyle(header);
      return {
        headerLeft: headerRect.left,
        headerTop: headerRect.top,
        logoWidth: logoRect.width,
        panelLeft: panelRect.left,
        panelTop: panelRect.top,
        paddingBlockStart: headerStyles.paddingBlockStart,
        paddingInlineStart: headerStyles.paddingInlineStart,
        tagHeight: tagRect.height,
        tagLeft: tagRect.left,
        tagTop: tagRect.top,
        tagWidth: tagRect.width,
        titleTransform: getComputedStyle(title).transform,
        titleVisible: title.getBoundingClientRect().width > 0
      };
    });

    assert(navigationBrandState, "Expected the application navigation brand to be measurable.");
    assert(navigationBrandState.paddingBlockStart === "0px" && Number.parseFloat(navigationBrandState.paddingInlineStart) > 0, `Expected the navigation-brand header to remove block padding and retain the panel inline inset. Got block=${navigationBrandState.paddingBlockStart}, inline=${navigationBrandState.paddingInlineStart}.`);
    assert(Math.abs(navigationBrandState.headerTop - navigationBrandState.panelTop) <= 1 && Math.abs(navigationBrandState.tagTop - navigationBrandState.panelTop) <= 1, `Expected the Canonical tag to meet the panel's top edge. Got panel=${navigationBrandState.panelTop}px, header=${navigationBrandState.headerTop}px, tag=${navigationBrandState.tagTop}px.`);
    assert(Math.abs(navigationBrandState.headerLeft - navigationBrandState.panelLeft) <= 1 && Math.abs((navigationBrandState.tagLeft - navigationBrandState.panelLeft) - Number.parseFloat(navigationBrandState.paddingInlineStart)) <= 1, `Expected the Canonical tag to share the panel content inset. Got panel=${navigationBrandState.panelLeft}px, tag=${navigationBrandState.tagLeft}px, inset=${navigationBrandState.paddingInlineStart}.`);
    assert(Math.abs(navigationBrandState.tagWidth - 22) <= 1 && Math.abs(navigationBrandState.tagHeight - 38) <= 1, `Expected the Canonical tag to retain 22x38px geometry. Got ${navigationBrandState.tagWidth}x${navigationBrandState.tagHeight}px.`);
    assert(navigationBrandState.titleTransform === "matrix(1, 0, 0, 1, 0, 0)", `Expected the navigation-brand title to share the tagged mark's optical top without a downward offset. Got ${navigationBrandState.titleTransform}.`);
    assert(navigationBrandState.logoWidth >= 220 && navigationBrandState.titleVisible, `Expected the drawer brand and title to occupy the expanded navigation width. Got logo=${navigationBrandState.logoWidth}px, titleVisible=${navigationBrandState.titleVisible}.`);

    const wrappedAlignmentState = await page.evaluate(() => {
      const link = document.querySelector<HTMLElement>("[data-wrapped-navigation-link]");
      const icon = link?.querySelector<HTMLElement>(".bf-side-navigation-icon");
      const label = link?.querySelector<HTMLElement>(".bf-side-navigation-label");
      if (!link || !icon || !label) return null;

      const labelRange = document.createRange();
      labelRange.selectNodeContents(label);
      const lineRects = Array.from(labelRange.getClientRects()).filter(rect => rect.width > 0 && rect.height > 0);
      const iconRect = icon.getBoundingClientRect();

      return {
        alignItems: getComputedStyle(link).alignItems,
        iconBottom: iconRect.bottom,
        iconCenter: (iconRect.top + iconRect.bottom) / 2,
        iconTop: iconRect.top,
        transform: getComputedStyle(icon).transform,
        lines: lineRects.map(rect => ({ bottom: rect.bottom, top: rect.top }))
      };
    });

    assert(wrappedAlignmentState, "Expected the wrapped icon-navigation fixture to be measurable.");
    assert(wrappedAlignmentState.lines.length >= 2, `Expected the icon-navigation pressure label to wrap. Got ${wrappedAlignmentState.lines.length} line(s).`);
    assert(wrappedAlignmentState.alignItems === "baseline", `Expected expanded icon-navigation rows to use baseline alignment. Got ${wrappedAlignmentState.alignItems}.`);
    const firstLine = wrappedAlignmentState.lines[0];
    const secondLine = wrappedAlignmentState.lines[1];
    assert(wrappedAlignmentState.transform === "matrix(1, 0, 0, 1, 0, 3)", `Expected expanded icon-navigation to consume the 3px optical transform. Got ${wrappedAlignmentState.transform}.`);
    assert(wrappedAlignmentState.iconCenter >= firstLine.top - 1 && wrappedAlignmentState.iconCenter <= firstLine.bottom + 1, `Expected the navigation icon center to occupy the first label line. Got iconCenter=${wrappedAlignmentState.iconCenter}px, firstLine=${firstLine.top}-${firstLine.bottom}px.`);
    assert(wrappedAlignmentState.iconBottom <= secondLine.top + 1, `Expected the navigation icon to stay above the second label line. Got iconBottom=${wrappedAlignmentState.iconBottom}px, secondLineTop=${secondLine.top}px.`);

    const navigationCompositionState = await page.evaluate(() => {
      const content = document.querySelector<HTMLElement>("[data-flush-navigation-content]");
      const activeLink = content?.querySelector<HTMLElement>(".bf-side-navigation-link[aria-current='page']");
      const topLevelLink = content?.querySelector<HTMLElement>(".bf-side-navigation-list > .bf-side-navigation-item > .bf-side-navigation-link");
      const activeLabel = activeLink?.querySelector<HTMLElement>(".bf-side-navigation-label");
      const iconLink = content?.querySelector<HTMLElement>(".bf-side-navigation-list > .bf-side-navigation-item > .bf-side-navigation-link");
      const iconLabel = iconLink?.querySelector<HTMLElement>(".bf-side-navigation-label");
      const icon = iconLink?.querySelector<HTMLElement>(".bf-side-navigation-icon");
      const heading = content?.querySelector<HTMLElement>("[data-icon-navigation-heading]");
      const defaultContent = document.querySelector<HTMLElement>(".bf-main .bf-panel-content");
      if (!content || !activeLink || !topLevelLink || !activeLabel || !iconLink || !iconLabel || !icon || !heading || !defaultContent) {
        return null;
      }

      const baselineProbe = document.createElement("span");
      baselineProbe.style.cssText = "display:block;position:absolute;inline-size:var(--bf-baseline);block-size:0;visibility:hidden";
      content.append(baselineProbe);

      const contentRect = content.getBoundingClientRect();
      const activeRect = activeLink.getBoundingClientRect();
      const activeLabelRect = activeLabel.getBoundingClientRect();
      const contentStyles = getComputedStyle(content);
      const activeStyles = getComputedStyle(activeLink);
      const topLevelStyles = getComputedStyle(topLevelLink);
      const defaultContentStyles = getComputedStyle(defaultContent);
      const baselinePx = baselineProbe.getBoundingClientRect().width;
      baselineProbe.remove();

      return {
        activeBackground: activeStyles.backgroundColor,
        activeBoxShadow: activeStyles.boxShadow,
        activeLeft: activeRect.left,
        activeRight: activeRect.right,
        contentLeft: contentRect.left,
        contentRight: contentRect.right,
        contentPaddingBlockEnd: contentStyles.paddingBlockEnd,
        contentPaddingBlockStart: contentStyles.paddingBlockStart,
        contentPaddingInlineEnd: contentStyles.paddingInlineEnd,
        contentPaddingInlineStart: contentStyles.paddingInlineStart,
        defaultPaddingInlineStart: defaultContentStyles.paddingInlineStart,
        headingTextInset: heading.getBoundingClientRect().left + Number.parseFloat(getComputedStyle(heading).paddingInlineStart) - contentRect.left,
        iconGap: iconLabel.getBoundingClientRect().left - icon.getBoundingClientRect().right,
        iconLabelInset: iconLabel.getBoundingClientRect().left - contentRect.left,
        labelInset: activeLabelRect.left - contentRect.left,
        nestedPaddingInlineStart: Number.parseFloat(activeStyles.paddingInlineStart),
        topLevelPaddingInlineStart: Number.parseFloat(topLevelStyles.paddingInlineStart),
        baselinePx
      };
    });

    assert(navigationCompositionState, "Expected flush side-navigation composition to be measurable.");
    assert(navigationCompositionState.contentPaddingBlockStart === "0px" && navigationCompositionState.contentPaddingBlockEnd === "0px", `Expected flush navigation content to remove block padding. Got ${navigationCompositionState.contentPaddingBlockStart}/${navigationCompositionState.contentPaddingBlockEnd}.`);
    assert(navigationCompositionState.contentPaddingInlineStart === "0px" && navigationCompositionState.contentPaddingInlineEnd === "0px", `Expected flush navigation content to remove inline padding. Got ${navigationCompositionState.contentPaddingInlineStart}/${navigationCompositionState.contentPaddingInlineEnd}.`);
    assert(Math.abs(navigationCompositionState.activeLeft - navigationCompositionState.contentLeft) <= 1, `Expected active navigation background to reach the content start edge. Got active=${navigationCompositionState.activeLeft}, content=${navigationCompositionState.contentLeft}.`);
    assert(Math.abs(navigationCompositionState.activeRight - navigationCompositionState.contentRight) <= 1, `Expected active navigation background to reach the content end edge. Got active=${navigationCompositionState.activeRight}, content=${navigationCompositionState.contentRight}.`);
    assert(navigationCompositionState.activeBackground !== "rgba(0, 0, 0, 0)", `Expected active navigation row to retain a visible background. Got ${navigationCompositionState.activeBackground}.`);
    assert(navigationCompositionState.activeBoxShadow !== "none", "Expected active navigation row to retain its inset edge highlight.");
    assert(navigationCompositionState.labelInset > 0, `Expected active navigation label to retain component-owned indentation. Got ${navigationCompositionState.labelInset}px.`);
    assert(Math.abs(navigationCompositionState.iconGap - 10) <= 1, `Expected icon-navigation labels to use the shared 10px gap. Got ${navigationCompositionState.iconGap}px.`);
    assert(Math.abs(navigationCompositionState.headingTextInset - navigationCompositionState.iconLabelInset) <= 1, `Expected icon-navigation headings and labels to share an inline start. Got heading=${navigationCompositionState.headingTextInset}px, label=${navigationCompositionState.iconLabelInset}px.`);
    assert(Math.abs((navigationCompositionState.nestedPaddingInlineStart - navigationCompositionState.topLevelPaddingInlineStart) - (navigationCompositionState.baselinePx * 2)) <= 1, `Expected nested navigation padding to add two baseline units. Got nested=${navigationCompositionState.nestedPaddingInlineStart}px, top-level=${navigationCompositionState.topLevelPaddingInlineStart}px, baseline=${navigationCompositionState.baselinePx}px.`);
    assert(Number.parseFloat(navigationCompositionState.defaultPaddingInlineStart) > 0, `Expected ordinary panel content to remain padded. Got ${navigationCompositionState.defaultPaddingInlineStart}.`);

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

    /* The shared demo shell now contributes the public page gutter. At 1280px
       the specimen's allocated content width is below the desktop navigation
       contract even though the outer viewport has crossed the media query. */
    for (const width of [1440, 2560]) {
      await desktopPage.setViewportSize({ width, height: 960 });

      for (const tier of ["editorial", "documentation", "app", "os"] as const) {
        await desktopPage.locator("[data-page-chrome-tier-select]").selectOption(tier);
        await desktopPage.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
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
    { route: "/demo/components/button.html", selector: ".pc-content .bf-button", label: "button" },
    { route: "/demo/components/controls.html", selector: ".pc-content .bf-form-label", label: "form label" },
    { route: "/demo/components/controls.html", selector: ".pc-content .bf-input", label: "input" },
    { route: "/demo/components/chip.html", selector: ".pc-content .bf-chip", label: "chip" },
    { route: "/demo/components/status-label.html", selector: ".pc-content .bf-status-label", label: "status label" },
    { route: "/demo/components/badge.html", selector: ".pc-content .bf-badge", label: "badge" },
    { route: "/demo/components/breadcrumbs.html", selector: ".pc-content .bf-breadcrumbs-item", label: "breadcrumb" },
    { route: "/demo/components/side-navigation.html", selector: ".pc-content .bf-side-navigation-link", label: "side-navigation link" },
    { route: "/demo/components/tabs.html", selector: ".pc-content .bf-tabs-link", label: "tab" },
    { route: "/demo/components/accordion.html", selector: ".pc-content .bf-accordion-tab", label: "accordion tab" }
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

async function verifyQualifiedAnchorStates(origin: string): Promise<void> {
  const cases = [
    { route: "/examples/grid/app-panels.html", selector: "a.pc-sequence-link", decoration: "none", label: "page sequence button" },
    { route: "/demo/components/application-layout.html", selector: ".pc-content a.bf-side-navigation-link", decoration: "none", label: "side-navigation link" },
    { route: "/demo/components/top-navigation.html", selector: ".pc-content a.bf-top-navigation-link", decoration: "none", label: "top-navigation link" },
    { route: "/demo/components/article-pagination.html", selector: ".pc-content a.bf-article-pagination-link", decoration: "none", label: "article-pagination link" },
    { route: "/demo/components/content-card.html", selector: ".pc-content a.bf-content-card-main-link", decoration: "none", label: "content-card main link" },
    { route: "/demo/components/in-page-navigation.html", selector: ".pc-content a.bf-in-page-navigation-link", decoration: "none", label: "in-page-navigation link" },
    { route: "/demo/components/table-of-contents.html", selector: ".pc-content a.bf-table-of-contents-link", decoration: "underline", label: "intentional TOC text link" },
    { route: "/demo/components/list-tree.html", selector: ".pc-content a.bf-list-tree-link", decoration: "underline", label: "intentional tree text link" },
    { route: "/demo/components/basic-section.html", selector: ".pc-content a.bf-basic-section-title-link", decoration: "underline", label: "intentional linked heading" }
  ] as const;
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    for (const testCase of cases) {
      await page.goto(`${origin}${testCase.route}`, { waitUntil: "networkidle" });
      await waitForFonts(page);
      const anchor = page.locator(testCase.selector).first();
      await anchor.hover();
      const decoration = await anchor.evaluate(element => getComputedStyle(element).textDecorationLine);
      assert(decoration === testCase.decoration, `Expected ${testCase.label} hover decoration to be ${testCase.decoration}, got ${decoration}.`);
    }
    await page.close();
  } finally {
    await browser.close();
  }
}

async function verifySemanticRoleClassPrecedence(origin: string): Promise<void> {
  const tiers = ["editorial", "documentation", "app", "os"] as const;
  type TierName = typeof tiers[number];
  type TierSource = {
    baselineUnit: number;
    elements: Array<{
      identifier: string;
      fontSize: number;
      lineHeight: number;
      fontWeight: number;
      fontStyle?: string;
    }>;
  };
  const cssPixels = (rem: number) => `${Number((rem * 16).toFixed(5))}px`;
  const expectedByTier = Object.fromEntries(await Promise.all(tiers.map(async tier => {
    const source = JSON.parse(await fs.readFile(path.resolve(`config/tiers/${tier}.json`), "utf8")) as TierSource;
    const role = (name: "h3" | "h6") => {
      const element = source.elements.find(candidate => candidate.identifier === name);
      assert(element, `Expected ${tier} source config to define ${name}.`);
      return {
        fontSize: cssPixels(element.fontSize),
        lineHeight: cssPixels(element.lineHeight * source.baselineUnit),
        fontWeight: String(element.fontWeight),
        fontStyle: element.fontStyle ?? "normal"
      };
    };
    return [tier, { h3: role("h3"), h6: role("h6"), baselinePx: source.baselineUnit * 16 }] as const;
  }))) as Record<TierName, {
    h3: { fontSize: string; lineHeight: string; fontWeight: string; fontStyle: string };
    h6: { fontSize: string; lineHeight: string; fontWeight: string; fontStyle: string };
    baselinePx: number;
  }>;
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1440, height: 960 }
    });

    await page.goto(`${origin}/demo/components/typography.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);
    await page.evaluate(() => {
      const h6Reference = document.createElement("span");
      h6Reference.className = "bf-h6";
      h6Reference.dataset.roleReference = "h6";
      h6Reference.style.cssText = "position:absolute;visibility:hidden";
      const h3Reference = document.createElement("span");
      h3Reference.className = "bf-h3";
      h3Reference.dataset.roleReference = "h3";
      const h6ReferenceProse = document.createElement("div");
      h6ReferenceProse.className = "bf-prose";
      h6ReferenceProse.style.cssText = "position:absolute;visibility:hidden";
      const h6ReferenceTail = document.createElement("span");
      h6ReferenceTail.hidden = true;
      h6ReferenceProse.append(h6Reference, h6ReferenceTail);
      const h3ReferenceProse = document.createElement("div");
      h3ReferenceProse.className = "bf-prose";
      h3ReferenceProse.style.cssText = "position:absolute;visibility:hidden";
      h3ReferenceProse.append(h3Reference);
      document.body.append(h6ReferenceProse, h3ReferenceProse);

      const boundaryCases = ["plain-body", "classed-body", "plain-h3", "classed-h3", "ul", "ol", "blockquote"] as const;
      for (const caseName of boundaryCases) {
        const targets: HTMLElement[] = [];
        for (const attributeName of ["proseBoundary", "proseReference"] as const) {
          let target: HTMLElement;
          if (caseName === "plain-body" || caseName === "classed-body") {
            target = document.createElement("p");
            if (caseName === "classed-body") target.className = "bf-body";
            target.textContent = `${caseName} paragraph`;
          } else if (caseName === "plain-h3" || caseName === "classed-h3") {
            target = document.createElement(caseName === "plain-h3" ? "h3" : "h2");
            if (caseName === "classed-h3") target.className = "bf-h3";
            target.textContent = `${caseName} heading`;
          } else if (caseName === "ul" || caseName === "ol") {
            target = document.createElement(caseName);
            const item = document.createElement("li");
            item.textContent = `${caseName} item`;
            target.append(item);
          } else {
            target = document.createElement("blockquote");
            target.textContent = "Boundary quotation";
          }
          target.dataset[attributeName] = caseName;
          targets.push(target);
        }

        const fixture = document.createElement("div");
        fixture.dataset.proseBoundaryFixture = caseName;
        fixture.style.cssText = "position:absolute;visibility:hidden;inset-block-start:0;inset-inline-start:0;inline-size:var(--bf-measure);pointer-events:none";
        const prose = document.createElement("div");
        prose.className = "bf-prose";
        prose.dataset.proseBoundaryBox = caseName;
        prose.append(targets[0]);
        const following = document.createElement("p");
        following.dataset.proseBoundaryFollowing = caseName;
        const baselineMarker = document.createElement("span");
        baselineMarker.dataset.firstBaselineMarker = caseName;
        baselineMarker.style.cssText = "display:inline-block;block-size:0;inline-size:0;margin:0;padding:0";
        following.append(baselineMarker, document.createTextNode("Following paragraph"));
        fixture.append(prose, following);

        const reference = document.createElement("div");
        reference.className = "bf-prose";
        reference.style.cssText = "position:absolute;visibility:hidden;inset-block-start:0;inset-inline-start:0;inline-size:var(--bf-measure);pointer-events:none";
        reference.append(targets[1]);
        const referenceTail = document.createElement("span");
        referenceTail.hidden = true;
        reference.append(referenceTail);
        document.body.append(fixture, reference);
      }

      const semanticListFixture = document.createElement("div");
      semanticListFixture.dataset.semanticListFixture = "true";
      semanticListFixture.style.cssText = "position:absolute;visibility:hidden;inset-block-start:0;inset-inline-start:0;inline-size:var(--bf-measure);pointer-events:none";
      const paragraphReference = document.createElement("p");
      paragraphReference.dataset.semanticListParagraphReference = "true";
      paragraphReference.textContent = "Paragraph compensation reference";
      const structuralList = document.createElement("ol");
      structuralList.className = "bf-tiered-list-items";
      structuralList.dataset.semanticListStructuralContainer = "true";
      const structuralItem = document.createElement("li");
      structuralItem.className = "bf-tiered-list-item";
      const description = document.createElement("div");
      description.className = "bf-tiered-list-item-description";
      const semanticList = document.createElement("ul");
      semanticList.dataset.semanticListProbe = "true";
      const semanticItem = document.createElement("li");
      semanticItem.textContent = "Semantic list inside a component copy slot";
      semanticList.append(semanticItem);
      description.append(semanticList);
      structuralItem.append(description);
      structuralList.append(structuralItem);
      semanticListFixture.append(paragraphReference, structuralList);
      document.body.append(semanticListFixture);

      const firstBaselineReference = document.createElement("p");
      firstBaselineReference.dataset.firstBaselineReference = "true";
      firstBaselineReference.style.cssText = "position:absolute;visibility:hidden;inset-block-start:0;inset-inline-start:0;margin:0;pointer-events:none";
      const firstBaselineReferenceMarker = document.createElement("span");
      firstBaselineReferenceMarker.dataset.firstBaselineReferenceMarker = "true";
      firstBaselineReferenceMarker.style.cssText = "display:inline-block;block-size:0;inline-size:0;margin:0;padding:0";
      firstBaselineReference.append(firstBaselineReferenceMarker, document.createTextNode("Baseline reference"));
      document.body.append(firstBaselineReference);
    });

    const tierSelect = page.locator("[data-page-chrome-tier-select]");
    await tierSelect.waitFor({ state: "visible" });
    const measuredTierSignatures = new Set<string>();

    for (const tier of tiers) {
      const expected = expectedByTier[tier];
      await tierSelect.selectOption(tier);
      await page.waitForFunction(({ expectedTier, expectedH3Size, expectedH6Size }) => {
        const h3AsH6 = document.querySelector<HTMLElement>('[data-role-probe="h3-as-h6"]');
        const h6AsH3 = document.querySelector<HTMLElement>('[data-role-probe="h6-as-h3"]');
        return document.body.dataset.bfTier === expectedTier &&
          h3AsH6 !== null && getComputedStyle(h3AsH6).fontSize === expectedH6Size &&
          h6AsH3 !== null && getComputedStyle(h6AsH3).fontSize === expectedH3Size;
      }, { expectedTier: tier, expectedH3Size: expected.h3.fontSize, expectedH6Size: expected.h6.fontSize });

      const state = await page.evaluate(() => {
        const h3AsH6 = document.querySelector<HTMLElement>('[data-role-probe="h3-as-h6"]');
        const h6AsH3 = document.querySelector<HTMLElement>('[data-role-probe="h6-as-h3"]');
        const h6Reference = document.querySelector<HTMLElement>('[data-role-reference="h6"]');
        const h3Reference = document.querySelector<HTMLElement>('[data-role-reference="h3"]');
        const firstBaselineReference = document.querySelector<HTMLElement>('[data-first-baseline-reference="true"]');
        const firstBaselineReferenceMarker = document.querySelector<HTMLElement>('[data-first-baseline-reference-marker="true"]');
        const semanticListProbe = document.querySelector<HTMLElement>('[data-semantic-list-probe="true"]');
        const semanticListParagraphReference = document.querySelector<HTMLElement>('[data-semantic-list-paragraph-reference="true"]');
        const semanticListStructuralContainer = document.querySelector<HTMLElement>('[data-semantic-list-structural-container="true"]');
        if (!h3AsH6 || !h6AsH3 || !h6Reference || !h3Reference || !firstBaselineReference || !firstBaselineReferenceMarker || !semanticListProbe || !semanticListParagraphReference || !semanticListStructuralContainer) return null;

        const [h3AsH6Typography, h6AsH3Typography, h6ReferenceTypography, h3ReferenceTypography] = [h3AsH6, h6AsH3, h6Reference, h3Reference]
          .map(element => {
            const styles = getComputedStyle(element);
            return {
              fontFamily: styles.fontFamily,
              fontSize: styles.fontSize,
              fontStyle: styles.fontStyle,
              fontVariantCaps: styles.fontVariantCaps,
              fontWeight: styles.fontWeight,
              letterSpacing: styles.letterSpacing,
              lineHeight: styles.lineHeight,
              marginBottom: styles.marginBottom,
              paddingBottom: styles.paddingBottom,
              paddingTop: styles.paddingTop,
              textTransform: styles.textTransform
            };
          });

        const boundaryCases = ["plain-body", "classed-body", "plain-h3", "classed-h3", "ul", "ol", "blockquote"];
        const proseBoundaries = Object.fromEntries(boundaryCases.map(caseName => {
          const fixture = document.querySelector<HTMLElement>(`[data-prose-boundary-fixture="${caseName}"]`);
          const prose = document.querySelector<HTMLElement>(`[data-prose-boundary-box="${caseName}"]`);
          const target = document.querySelector<HTMLElement>(`[data-prose-boundary="${caseName}"]`);
          const reference = document.querySelector<HTMLElement>(`[data-prose-reference="${caseName}"]`);
          const baselineMarker = document.querySelector<HTMLElement>(`[data-first-baseline-marker="${caseName}"]`);
          if (!fixture || !prose || !target || !reference || !baselineMarker) return [caseName, null];
          const styles = getComputedStyle(target);
          const referenceStyles = getComputedStyle(reference);
          const targetRect = target.getBoundingClientRect();
          const referenceRect = reference.getBoundingClientRect();
          const fixtureRect = fixture.getBoundingClientRect();
          const proseRect = prose.getBoundingClientRect();
          const baselineMarkerRect = baselineMarker.getBoundingClientRect();
          return [caseName, {
            marginBottom: styles.marginBottom,
            paddingBottom: styles.paddingBottom,
            paddingTop: styles.paddingTop,
            fontSize: styles.fontSize,
            fontStyle: styles.fontStyle,
            fontWeight: styles.fontWeight,
            lineHeight: styles.lineHeight,
            height: targetRect.height,
            width: targetRect.width,
            referenceMarginBottom: referenceStyles.marginBottom,
            referencePaddingBottom: referenceStyles.paddingBottom,
            referencePaddingTop: referenceStyles.paddingTop,
            referenceHeight: referenceRect.height,
            proseBottomOffset: proseRect.bottom - fixtureRect.top,
            followingBaselineOffset: baselineMarkerRect.bottom - fixtureRect.top
          }];
        }));

        return {
          tier: document.body.dataset.bfTier,
          h3AsH6: h3AsH6Typography,
          h6AsH3: h6AsH3Typography,
          h6Reference: h6ReferenceTypography,
          h3Reference: h3ReferenceTypography,
          firstBaselinePhase: firstBaselineReferenceMarker.getBoundingClientRect().bottom - firstBaselineReference.getBoundingClientRect().top,
          semanticListSpacing: {
            listMarginBottom: getComputedStyle(semanticListProbe).marginBottom,
            paragraphMarginBottom: getComputedStyle(semanticListParagraphReference).marginBottom,
            structuralListMarginBottom: getComputedStyle(semanticListStructuralContainer).marginBottom
          },
          proseBoundaries
        };
      });

      assert(state, `Expected reciprocal semantic/visual typography probes in ${tier}.`);
      assert(state.tier === tier, `Expected reciprocal typography probes to switch to ${tier}, got ${state.tier}.`);
      assert(JSON.stringify(state.h3AsH6) === JSON.stringify(state.h6Reference), `Expected ${tier} h3.bf-h6 inside .bf-prose to resolve every measured H6 role property. Probe=${JSON.stringify(state.h3AsH6)}, reference=${JSON.stringify(state.h6Reference)}.`);
      assert(JSON.stringify(state.h6AsH3) === JSON.stringify(state.h3Reference), `Expected ${tier} h6.bf-h3 inside .bf-prose to resolve every measured H3 role property. Probe=${JSON.stringify(state.h6AsH3)}, reference=${JSON.stringify(state.h3Reference)}.`);
      assert(state.semanticListSpacing.listMarginBottom === "0px", `Expected ${tier} semantic list containers not to add external semantic space, got ${state.semanticListSpacing.listMarginBottom}.`);
      assert(state.semanticListSpacing.paragraphMarginBottom !== "0px", `Expected ${tier} paragraph roles to retain non-semantic bottom-margin compensation.`);
      assert(state.semanticListSpacing.structuralListMarginBottom === "0px", `Expected ${tier} structural component lists to retain their explicit zero-margin reset, got ${state.semanticListSpacing.structuralListMarginBottom}.`);
      for (const [property, expectedValue] of Object.entries(expected.h6)) {
        assert(state.h3AsH6[property as keyof typeof state.h3AsH6] === expectedValue, `Expected ${tier} h3.bf-h6 ${property} to resolve to concrete H6 value ${expectedValue}, got ${state.h3AsH6[property as keyof typeof state.h3AsH6]}.`);
      }
      for (const [property, expectedValue] of Object.entries(expected.h3)) {
        assert(state.h6AsH3[property as keyof typeof state.h6AsH3] === expectedValue, `Expected ${tier} h6.bf-h3 ${property} to resolve to concrete H3 value ${expectedValue}, got ${state.h6AsH3[property as keyof typeof state.h6AsH3]}.`);
      }
      const boundaryCaseNames = ["plain-body", "classed-body", "plain-h3", "classed-h3", "ul", "ol", "blockquote"] as const;
      const renderedGridTolerancePx = 0.75;
      const gridDelta = (value: number) => {
        const remainder = ((value % expected.baselinePx) + expected.baselinePx) % expected.baselinePx;
        return Math.min(remainder, expected.baselinePx - remainder);
      };
      for (const caseName of boundaryCaseNames) {
        const boundary = state.proseBoundaries[caseName];
        assert(boundary, `Expected ${tier} ${caseName} prose-boundary fixture.`);
        assert(boundary.marginBottom === boundary.referenceMarginBottom, `Expected ${tier} ${caseName} flow boundaries to preserve baseline compensation. Boundary=${boundary.marginBottom}, reference=${boundary.referenceMarginBottom}.`);
        if (caseName === "ul" || caseName === "ol") {
          assert(boundary.marginBottom === "0px", `Expected ${tier} semantic list containers to remain externally neutral, got ${boundary.marginBottom}.`);
        } else if (["plain-body", "classed-body", "plain-h3", "classed-h3", "blockquote"].includes(caseName)) {
          assert(boundary.referenceMarginBottom !== "0px", `Expected ${tier} ${caseName} to retain measurable bottom-margin compensation.`);
        }
        assert(boundary.paddingBottom === "0px" && boundary.referencePaddingBottom === "0px", `Expected ${tier} ${caseName} to move end compensation out of padding. Boundary=${boundary.paddingBottom}, reference=${boundary.referencePaddingBottom}.`);
        assert(boundary.paddingTop === boundary.referencePaddingTop, `Expected ${tier} ${caseName} flow boundaries to preserve padding-top ${boundary.referencePaddingTop}, got ${boundary.paddingTop}.`);
        assert(Math.abs(boundary.height - boundary.referenceHeight) <= 0.01, `Expected ${tier} ${caseName} flow boundaries to preserve the occupied element box. Boundary=${boundary.height}, reference=${boundary.referenceHeight}.`);
        assert(gridDelta(boundary.proseBottomOffset) <= renderedGridTolerancePx, `Expected ${tier} ${caseName} prose bottom edge on the ${expected.baselinePx}px grid, offset=${boundary.proseBottomOffset}.`);
        assert(gridDelta(boundary.followingBaselineOffset - state.firstBaselinePhase) <= renderedGridTolerancePx, `Expected ${tier} ${caseName} following first baseline to retain the tier's ${expected.baselinePx}px grid phase. Offset=${boundary.followingBaselineOffset}, phase=${state.firstBaselinePhase}.`);
      }

      for (const [plainName, classedName] of [["plain-body", "classed-body"], ["plain-h3", "classed-h3"]] as const) {
        const plain = state.proseBoundaries[plainName];
        const classed = state.proseBoundaries[classedName];
        assert(plain && classed, `Expected ${tier} ${plainName}/${classedName} boundary pair.`);
        const measuredBox = (boundary: typeof plain) => ({
          marginBottom: boundary.marginBottom,
          paddingBottom: boundary.paddingBottom,
          paddingTop: boundary.paddingTop,
          fontSize: boundary.fontSize,
          fontStyle: boundary.fontStyle,
          fontWeight: boundary.fontWeight,
          lineHeight: boundary.lineHeight,
          height: boundary.height,
          width: boundary.width
        });
        assert(JSON.stringify(measuredBox(plain)) === JSON.stringify(measuredBox(classed)), `Expected ${tier} ${plainName}/${classedName} to occupy identical measured boxes. Plain=${JSON.stringify(measuredBox(plain))}, classed=${JSON.stringify(measuredBox(classed))}.`);
      }
      measuredTierSignatures.add(`${state.h6AsH3.fontSize}/${state.h6AsH3.fontWeight}/${state.h3AsH6.fontSize}/${state.h3AsH6.fontWeight}/${expected.baselinePx}`);
    }

    assert(measuredTierSignatures.size === tiers.length, `Expected four distinct computed typography signatures, got ${measuredTierSignatures.size}: ${Array.from(measuredTierSignatures).join(", ")}.`);

    await page.close();
  } finally {
    await browser.close();
  }
}

async function verifyContainerOwnedSpacing(origin: string): Promise<void> {
  const tiers = ["editorial", "documentation", "app", "os"] as const;
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
    await page.goto(`${origin}/demo/components/typography.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);

    const tierSelect = page.locator("[data-page-chrome-tier-select]");
    await tierSelect.waitFor({ state: "visible" });

    for (const tier of tiers) {
      await tierSelect.selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);

      const state = await page.evaluate(() => {
        const fixture = document.createElement("div");
        fixture.style.cssText = "position:absolute;visibility:hidden;inset:0;inline-size:20rem;pointer-events:none";

        const internalStack = document.createElement("div");
        internalStack.className = "bf-stack";
        const sectionStack = document.createElement("div");
        sectionStack.className = "bf-stack is-section";
        const densityStacks = [
          "is-flush",
          "is-extra-dense",
          "is-dense",
          "is-loose",
          "is-section-shallow",
          "is-section-deep"
        ].map(modifier => {
          const stack = document.createElement("div");
          stack.className = `bf-stack ${modifier}`;
          stack.append(document.createElement("span"), document.createElement("span"));
          return { modifier, stack };
        });

        const internalFirst = document.createElement("p");
        internalFirst.textContent = "First baseline-aligned item";
        const internalSecond = document.createElement("p");
        internalSecond.textContent = "Second baseline-aligned item";
        internalStack.append(internalFirst, internalSecond);
        const sectionFirst = document.createElement("p");
        sectionFirst.textContent = "First section";
        const sectionSecond = document.createElement("p");
        sectionSecond.textContent = "Second section";
        sectionStack.append(sectionFirst, sectionSecond);

        const basicLayout = document.createElement("div");
        basicLayout.className = "bf-basic-section-layout bf-stack";
        const rule = document.createElement("hr");
        rule.className = "bf-basic-section-rule bf-rule";
        const basicHeader = document.createElement("header");
        basicHeader.className = "bf-basic-section-header";
        const basicTitle = document.createElement("h2");
        basicTitle.textContent = "Rule-adjacent heading";
        basicHeader.append(basicTitle);
        basicLayout.append(rule, basicHeader);

        const chipStack = document.createElement("div");
        chipStack.className = "bf-stack";
        const chip = document.createElement("span");
        chip.className = "bf-chip";
        chip.textContent = "Content-sized chip";
        chipStack.append(chip);

        fixture.append(internalStack, sectionStack, ...densityStacks.map(({ stack }) => stack), basicLayout, chipStack);
        document.body.append(fixture);

        const firstStylesBefore = getComputedStyle(internalFirst);
        const before = {
          internalGap: Number.parseFloat(getComputedStyle(internalStack).rowGap),
          sectionGap: Number.parseFloat(getComputedStyle(sectionStack).rowGap),
          firstToSecond: internalSecond.getBoundingClientRect().top - internalFirst.getBoundingClientRect().bottom,
          paddingTop: Number.parseFloat(firstStylesBefore.paddingTop),
          paddingBottom: Number.parseFloat(firstStylesBefore.paddingBottom),
          marginBottom: Number.parseFloat(firstStylesBefore.marginBottom),
          baseline: Number.parseFloat(getComputedStyle(document.body).getPropertyValue("--bf-baseline")) * 16
        };
        internalFirst.style.setProperty("--bf-body-space-after", "99rem");
        const firstStylesAfter = getComputedStyle(internalFirst);
        const after = {
          internalGap: Number.parseFloat(getComputedStyle(internalStack).rowGap),
          sectionGap: Number.parseFloat(getComputedStyle(sectionStack).rowGap),
          firstToSecond: internalSecond.getBoundingClientRect().top - internalFirst.getBoundingClientRect().bottom,
          paddingTop: Number.parseFloat(firstStylesAfter.paddingTop),
          paddingBottom: Number.parseFloat(firstStylesAfter.paddingBottom),
          marginBottom: Number.parseFloat(firstStylesAfter.marginBottom),
          baseline: Number.parseFloat(getComputedStyle(document.body).getPropertyValue("--bf-baseline")) * 16
        };
        const ruleRect = rule.getBoundingClientRect();
        const headerRect = basicHeader.getBoundingClientRect();
        const chipRect = chip.getBoundingClientRect();
        const chipStackRect = chipStack.getBoundingClientRect();
        const regressions = {
          basicRowGap: Number.parseFloat(getComputedStyle(basicLayout).rowGap),
          ruleMarginBottom: Number.parseFloat(getComputedStyle(rule).marginBottom),
          ruleToHeader: headerRect.top - ruleRect.bottom,
          chipWidth: chipRect.width,
          chipStackWidth: chipStackRect.width,
          chipJustifySelf: getComputedStyle(chip).justifySelf
        };
        const densityGaps = Object.fromEntries(
          densityStacks.map(({ modifier, stack }) => [modifier, Number.parseFloat(getComputedStyle(stack).rowGap)])
        );
        fixture.remove();
        return { before, after, regressions, densityGaps };
      });

      const tolerance = 0.1;
      assert(state.before.internalGap > 0, `Expected ${tier} default bf-stack to own a positive internal gap.`);
      assert(state.before.sectionGap > state.before.internalGap, `Expected ${tier} bf-stack.is-section gap (${state.before.sectionGap}px) to exceed the internal gap (${state.before.internalGap}px).`);
      assert(Math.abs(state.before.firstToSecond - (state.before.internalGap + state.before.marginBottom)) <= tolerance, `Expected ${tier} adjacent stack geometry to comprise the container gap plus baseline-compensation margin.`);
      assert(state.before.paddingBottom === 0, `Expected ${tier} text roles to retain zero padding-block-end, got ${state.before.paddingBottom}px.`);
      assert(Math.abs(state.before.paddingTop + state.before.marginBottom - state.before.baseline) <= tolerance, `Expected ${tier} top nudge plus bottom-margin compensation to equal one ${state.before.baseline}px baseline unit.`);
      assert(JSON.stringify(state.after) === JSON.stringify(state.before), `Expected ${tier} legacy --bf-body-space-after overrides not to affect production geometry. Before=${JSON.stringify(state.before)}, after=${JSON.stringify(state.after)}.`);
      assert(state.regressions.basicRowGap === 0, `Expected ${tier} bf-basic-section-layout to suppress the generic stack row gap, got ${state.regressions.basicRowGap}px.`);
      assert(Math.abs(state.regressions.ruleToHeader - state.regressions.ruleMarginBottom) <= tolerance, `Expected ${tier} basic-section text to follow only the rule's own trailing compensation. Distance=${state.regressions.ruleToHeader}px, margin=${state.regressions.ruleMarginBottom}px.`);
      assert(state.regressions.chipWidth < state.regressions.chipStackWidth, `Expected ${tier} chip grid items to hug content. Chip=${state.regressions.chipWidth}px, stack=${state.regressions.chipStackWidth}px.`);
      assert(state.regressions.chipJustifySelf === "start", `Expected ${tier} chips to opt out of grid-item stretch, got justify-self=${state.regressions.chipJustifySelf}.`);
      assert(state.densityGaps["is-flush"] === 0, `Expected ${tier} flush stacks to use a zero gap.`);
      assert(Math.abs(state.densityGaps["is-extra-dense"] - state.before.baseline / 2) <= tolerance, `Expected ${tier} extra-dense stacks to use half a baseline.`);
      assert(Math.abs(state.densityGaps["is-dense"] - state.before.baseline) <= tolerance, `Expected ${tier} dense stacks to use one baseline.`);
      assert(Math.abs(state.densityGaps["is-loose"] - state.before.baseline * 2) <= tolerance, `Expected ${tier} loose stacks to use two baselines.`);
      assert(Math.abs(state.densityGaps["is-section-shallow"] - state.before.internalGap) <= tolerance, `Expected ${tier} explicit shallow stacks to match the default pattern gap.`);
      assert(state.densityGaps["is-section-deep"] > state.before.sectionGap, `Expected ${tier} deep section stacks to exceed the regular section gap.`);

      if (tier === "editorial") {
        assert(Math.abs(state.before.internalGap - 24) <= tolerance, `Expected Sites/editorial internal stacks to resolve to 1.5rem (24px), got ${state.before.internalGap}px.`);
        assert(Math.abs(state.before.sectionGap - 64) <= tolerance, `Expected Sites/editorial section stacks to resolve to 4rem (64px), got ${state.before.sectionGap}px.`);
        assert(Math.abs(state.densityGaps["is-section-deep"] - 128) <= tolerance, `Expected Sites/editorial deep section stacks to resolve to 8rem (128px), got ${state.densityGaps["is-section-deep"]}px.`);
      }
    }

    await page.close();
  } finally {
    await browser.close();
  }
}

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

    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const route of ["/demo/components/narrow-panel.html", "/demo/components/search-and-filter.html"] as const) {
      await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
      await waitForFonts(page);
      for (const tier of ["editorial", "documentation", "app", "os"] as const) {
        await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
        await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
        const searchGeometry = await page.evaluate(() => {
          const boxes = Array.from(document.querySelectorAll<HTMLElement>(".bf-search-box, .bf-search-and-filter-box"));
          const expandedRoot = document.querySelector<HTMLElement>(".bf-search-and-filter:has(.bf-search-and-filter-panel[aria-hidden='false'])");
          const expandedBox = expandedRoot?.querySelector<HTMLElement>(".bf-search-and-filter-box");
          const expandedPanel = expandedRoot?.querySelector<HTMLElement>(".bf-search-and-filter-panel");
          const heading = expandedRoot?.querySelector<HTMLElement>(".bf-filter-panel-section-heading");
          const canonicalHeading = heading ? document.createElement("h5") : null;
          if (canonicalHeading) {
            canonicalHeading.className = "bf-h5";
            canonicalHeading.style.cssText = "position:absolute;visibility:hidden";
            document.body.append(canonicalHeading);
          }
          const typeProperties = ["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "textTransform", "color"] as const;
          const result = {
            boxes: boxes.map(box => {
              const rect = box.getBoundingClientRect();
              return Array.from(box.querySelectorAll<HTMLElement>("button")).map(button => {
                const buttonRect = button.getBoundingClientRect();
                return { top: buttonRect.top - rect.top, bottom: buttonRect.bottom - rect.bottom, heightDelta: buttonRect.height - rect.height };
              });
            }),
            panelOverlap: expandedBox && expandedPanel ? expandedBox.getBoundingClientRect().bottom - expandedPanel.getBoundingClientRect().top : null,
            headingTypeMatches: heading && canonicalHeading
              ? typeProperties.every(property => getComputedStyle(heading)[property] === getComputedStyle(canonicalHeading)[property])
              : null
          };
          canonicalHeading?.remove();
          return result;
        });
        assert(searchGeometry.boxes.flat().every(button => Math.abs(button.top) <= 0.1 && Math.abs(button.bottom) <= 0.1 && Math.abs(button.heightDelta) <= 0.1), `Expected ${tier} search actions on ${route} to stay inside the occupied input block: ${JSON.stringify(searchGeometry.boxes)}.`);
        if (route.endsWith("search-and-filter.html")) {
          assert(searchGeometry.panelOverlap !== null && searchGeometry.panelOverlap <= 0.1, `Expected ${tier} search actions not to overlap the expanded filter panel; overlap=${searchGeometry.panelOverlap}.`);
          assert(searchGeometry.headingTypeMatches, `Expected ${tier} filter section headings to resolve exactly like the canonical bf-h5 role.`);
        }
      }
    }

    for (const [tier, title] of [["editorial", "Editorial"], ["documentation", "Documentation"], ["app", "App"], ["os", "OS"]] as const) {
      await page.goto(`${origin}/demo/tiers/${tier}.html`, { waitUntil: "networkidle" });
      await waitForFonts(page);
      const tierReferenceState = await page.evaluate(() => ({
        activeTier: document.body.dataset.bfTier,
        heading: document.querySelector("main h1")?.textContent?.trim(),
        section: document.querySelector(".pc-breadcrumbs .bf-breadcrumbs-item:first-child")?.textContent?.trim(),
        selectedTier: (document.querySelector("[data-page-chrome-tier-select]") as HTMLSelectElement | null)?.value,
        overflow: (() => {
          const main = document.querySelector<HTMLElement>("main");
          return main ? main.scrollWidth - main.clientWidth : Number.POSITIVE_INFINITY;
        })()
      }));
      assert(tierReferenceState.activeTier === tier && tierReferenceState.selectedTier === tier && tierReferenceState.heading === title && tierReferenceState.section === "Tier references" && tierReferenceState.overflow <= 1, `Expected the distinct ${title} tier-reference route to initialize and identify itself without overflow: ${JSON.stringify(tierReferenceState)}.`);
    }

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
            const items = component?.matches("ol.bf-tiered-list, ul.bf-tiered-list")
              ? component
              : component?.querySelector<HTMLElement>(".bf-tiered-list-items");
            const item = component?.querySelector<HTMLElement>(".bf-tiered-list-item");
            const rule = item?.querySelector<HTMLElement>(".bf-rule");
            const title = item?.querySelector<HTMLElement>(".bf-tiered-list-item-title, .bf-tiered-list-item-label");
            const description = item?.querySelector<HTMLElement>(".bf-tiered-list-item-description, .bf-tiered-list-item-role, .bf-tiered-list-item-value");
            if (!component || !items || !item || !rule || !title || !description) return [name, null];

            component.style.inlineSize = `${width}rem`;
            const stackProbe = document.createElement("div");
            stackProbe.className = "bf-stack";
            stackProbe.style.cssText = "position:absolute;visibility:hidden";
            component.append(stackProbe);
            const expectedItemsGap = Number.parseFloat(getComputedStyle(stackProbe).rowGap);
            stackProbe.remove();
            const itemsStyle = getComputedStyle(items);
            const itemRect = item.getBoundingClientRect();
            const ruleRect = rule.getBoundingClientRect();
            const titleRect = title.getBoundingClientRect();
            const descriptionRect = description.getBoundingClientRect();
            const gridColumns = getComputedStyle(item).gridTemplateColumns.trim().split(/\s+/).filter(Boolean).length;
            return [name, {
              gridColumns,
              itemsDisplay: itemsStyle.display,
              itemsGap: Number.parseFloat(itemsStyle.rowGap),
              expectedItemsGap,
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

        for (const [name, variant] of Object.entries(measurement.variants)) {
          assert(variant.itemsDisplay === "grid", `Expected ${tier} ${name} tiered-list items to own a grid stack.`);
          assert(Math.abs(variant.itemsGap - variant.expectedItemsGap) <= 0.1, `Expected ${tier} ${name} tiered-list items to own the default shallow stack gap, got ${variant.itemsGap}px instead of ${variant.expectedItemsGap}px.`);
        }

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
  const expectedCapPx = { editorial: 1440, documentation: 1280, app: 960, os: 960 } as const;
  const expectedPanelPaddingPx = { editorial: 16, documentation: 16, app: 12, os: 8 } as const;
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({ viewport: { width: 1800, height: 900 } });
    const readGeometry = async (stylesheet: string, bodyClass: string) => {
      await page.setContent(`<!doctype html>
        <link rel="stylesheet" href="${origin}/demo/demo-fonts.css">
        <link rel="stylesheet" href="${origin}${stylesheet}">
        <body class="bf-theme ${bodyClass}" style="margin:0">
          <div class="bf-page"><div class="bf-grid"><span>Fluid grid</span></div></div>
          <div class="bf-fixed-width is-start-aligned">Bounded row</div>
          <input class="bf-input" value="Parity">
          <button class="bf-button">Parity</button>
          <section class="bf-panel"><header class="bf-panel-header"><h2 class="bf-panel-title">Parity</h2></header><footer class="bf-panel-footer"><button class="bf-panel-toggle">Footer</button></footer></section>
          <span class="bf-status-label">Parity</span>
        </body>`);
      await page.waitForFunction(expected => Array.from(document.styleSheets).some(sheet => sheet.href?.includes(expected)), stylesheet);
      await waitForFonts(page);

      return page.evaluate(() => {
        const input = document.querySelector<HTMLElement>(".bf-input");
        const button = document.querySelector<HTMLElement>(".bf-button");
        const header = document.querySelector<HTMLElement>(".bf-panel-header");
        const footer = document.querySelector<HTMLElement>(".bf-panel-footer");
        const status = document.querySelector<HTMLElement>(".bf-status-label");
        const appPage = document.querySelector<HTMLElement>(".bf-page");
        const appGrid = appPage?.querySelector<HTMLElement>(".bf-grid");
        const fixedWidth = document.querySelector<HTMLElement>(".bf-fixed-width");
        if (!input || !button || !header || !footer || !status || !appPage || !appGrid || !fixedWidth) {
          throw new Error("Missing surface parity fixture.");
        }

        const inputStyles = getComputedStyle(input);
        const buttonStyles = getComputedStyle(button);
        const headerStyles = getComputedStyle(header);
        const footerStyles = getComputedStyle(footer);
        return {
          inputHeight: input.getBoundingClientRect().height,
          inputMarginBottom: Number.parseFloat(inputStyles.marginBottom) || 0,
          buttonHeight: button.getBoundingClientRect().height,
          buttonMarginBottom: Number.parseFloat(buttonStyles.marginBottom) || 0,
          panelPaddingStart: Number.parseFloat(headerStyles.paddingBlockStart) || 0,
          panelPaddingEnd: Number.parseFloat(headerStyles.paddingBlockEnd) || 0,
          panelGap: Number.parseFloat(headerStyles.gap) || 0,
          footerPaddingEnd: Number.parseFloat(footerStyles.paddingBlockEnd) || 0,
          footerPaddingInlineStart: Number.parseFloat(footerStyles.paddingInlineStart) || 0,
          statusHeight: status.getBoundingClientRect().height,
          pageWidth: appPage.getBoundingClientRect().width,
          gridWidth: appGrid.getBoundingClientRect().width,
          fixedStart: fixedWidth.getBoundingClientRect().left,
          fixedWidth: fixedWidth.getBoundingClientRect().width
        };
      });
    };

    const directCaps: number[] = [];
    for (const tier of tiers) {
      const direct = await readGeometry(`/dist/tiers/${tier}/styles.css`, "");
      const classSwitched = await readGeometry("/dist/tiers/editorial/styles.css", `bf-tier-${tier}`);

      for (const key of Object.keys(direct) as Array<keyof typeof direct>) {
        assert(
          Math.abs(direct[key] - classSwitched[key]) <= 0.05,
          `Expected direct ${tier} ${key} (${direct[key]}px) to match class-switched geometry (${classSwitched[key]}px).`
        );
      }

      assert(Math.abs(direct.fixedWidth - expectedCapPx[tier]) <= 1, `Expected direct ${tier} bf-fixed-width to resolve to ${expectedCapPx[tier]}px, got ${direct.fixedWidth}px.`);
      assert(Math.abs(direct.fixedStart) <= 1 && Math.abs(classSwitched.fixedStart) <= 1, `Expected direct/scoped ${tier} fixed rows to remain aligned to the logical start; direct=${direct.fixedStart}px, scoped=${classSwitched.fixedStart}px.`);
      assert(direct.panelPaddingStart === expectedPanelPaddingPx[tier] && direct.panelPaddingEnd === expectedPanelPaddingPx[tier], `Expected direct ${tier} panel headers to use ${expectedPanelPaddingPx[tier]}px block padding, got ${direct.panelPaddingStart}/${direct.panelPaddingEnd}px.`);
      assert(direct.footerPaddingEnd === expectedPanelPaddingPx[tier] && direct.footerPaddingInlineStart === expectedPanelPaddingPx[tier], `Expected direct ${tier} panel footers to use ${expectedPanelPaddingPx[tier]}px end/inline padding, got ${direct.footerPaddingEnd}/${direct.footerPaddingInlineStart}px.`);
      directCaps.push(direct.fixedWidth);
      if (tier === "app") {
        assert(direct.pageWidth > direct.fixedWidth + 100 && direct.gridWidth > direct.fixedWidth + 100, `Expected direct App bf-page/grid to stay fluid beyond the ${direct.fixedWidth}px fixed-width cap; page=${direct.pageWidth}px, grid=${direct.gridWidth}px.`);
        assert(classSwitched.pageWidth > classSwitched.fixedWidth + 100 && classSwitched.gridWidth > classSwitched.fixedWidth + 100, `Expected class-switched App bf-page/grid to stay fluid beyond the ${classSwitched.fixedWidth}px fixed-width cap; page=${classSwitched.pageWidth}px, grid=${classSwitched.gridWidth}px.`);
      } else {
        assert(direct.pageWidth <= expectedCapPx[tier] + 1, `Expected ${tier} bf-page to retain its ${expectedCapPx[tier]}px cap, got ${direct.pageWidth}px.`);
      }
    }
    assert(directCaps.every((cap, index) => index === 0 || cap <= directCaps[index - 1]), `Expected rendered fixed-width caps to be non-increasing, got ${directCaps.join(" >= ")}px.`);
  } finally {
    await browser.close();
  }
}

async function verifyNarrowTierSwitchRangeGeometry(origin: string): Promise<void> {
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({ viewport: { width: 600, height: 480 } });
    await page.setContent(`<!doctype html>
      <link rel="stylesheet" href="${origin}/demo/demo-fonts.css">
      <link rel="stylesheet" href="${origin}/dist/tiers/editorial/styles.css">
      <body class="bf-theme bf-tier-editorial" style="margin:0;min-block-size:100vh">
        <section class="bf-panel" style="inset-block-end:0;inset-inline:0;position:fixed">
          <footer class="bf-panel-footer is-sticky bf-cluster is-split">
            <output for="tier-density">Editorial</output>
            <div class="bf-field is-range is-stacked bf-inline-size is-wide">
              <label class="bf-form-label" for="tier-density">Density</label>
              <div class="bf-control">
                <div class="bf-slider">
                  <input id="tier-density" type="range" min="0" max="3" step="1" value="0" aria-valuetext="Editorial">
                </div>
              </div>
            </div>
          </footer>
        </section>
        <script>
          const tiers = ["editorial", "documentation", "app", "os"];
          const labels = ["Editorial", "Documentation", "App", "OS"];
          const range = document.querySelector("#tier-density");
          const output = document.querySelector("output");
          window.__bfTierRangeSamples = [];
          range.addEventListener("input", () => {
            const index = Number(range.value);
            document.body.classList.remove(...tiers.map(tier => "bf-tier-" + tier));
            document.body.classList.add("bf-tier-" + tiers[index]);
            range.setAttribute("aria-valuetext", labels[index]);
            output.value = labels[index];
            const rect = range.getBoundingClientRect();
            window.__bfTierRangeSamples.push({
              tier: tiers[index],
              value: index,
              left: rect.left,
              right: rect.right
            });
          });
        </script>
      </body>`);
    await page.waitForFunction(() => document.fonts.status === "loaded");

    const range = page.locator("#tier-density");
    await range.dispatchEvent("input");
    const initialBox = await range.boundingBox();
    assert(initialBox && initialBox.width > 300, `Expected the narrow tier range to retain a generous track at 600px, got ${initialBox?.width ?? 0}px.`);
    const pointerY = initialBox.y + (initialBox.height / 2);
    await page.mouse.move(initialBox.x + 2, pointerY);
    await page.mouse.down();
    await page.mouse.move(initialBox.x + initialBox.width - 2, pointerY, { steps: 24 });
    await page.mouse.up();

    const state = await page.evaluate(() => {
      const range = document.querySelector<HTMLInputElement>("#tier-density");
      const footer = document.querySelector<HTMLElement>(".bf-panel-footer");
      const samples = (window as typeof window & { __bfTierRangeSamples: Array<{ tier: string; value: number; left: number; right: number; }>; }).__bfTierRangeSamples;
      if (!range || !footer) return null;
      const rangeRect = range.getBoundingClientRect();
      return {
        bodyTier: Array.from(document.body.classList).find(className => className.startsWith("bf-tier-")),
        footerOverflow: footer.scrollWidth - footer.clientWidth,
        rangeOverflow: range.scrollWidth - range.clientWidth,
        rangeWidth: rangeRect.width,
        samples,
        value: range.value
      };
    });

    assert(state, "Expected the narrow tier-switch range fixture to remain measurable after dragging.");
    assert(state.value === "3" && state.bodyTier === "bf-tier-os", `Expected pointer dragging to reach the OS tier; value=${state.value}, tier=${state.bodyTier}.`);
    assert(state.samples.length >= 3 && new Set(state.samples.map(sample => sample.tier)).size === 4, `Expected the drag to exercise all four tier classes, got ${JSON.stringify(state.samples)}.`);
    assert(state.footerOverflow <= 1 && state.rangeOverflow <= 1 && state.rangeWidth >= initialBox.width - 1, `Expected tier switching to preserve a usable, non-overflowing range; footer overflow=${state.footerOverflow}px, range overflow=${state.rangeOverflow}px, width=${state.rangeWidth}px.`);
    assert(state.samples.every(sample => sample.right - sample.left >= 300), `Expected every tier transition to retain the range's usable track width, got ${JSON.stringify(state.samples)}.`);
    await page.close();
  } finally {
    await browser.close();
  }
}

async function verifyNestedGridScoping(origin: string): Promise<void> {
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto(`${origin}/examples/grid/nested-grid.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);

    const states = await page.locator(".example-grid-shell").evaluateAll(shells => shells.map(shell => {
      const outerGrid = shell.querySelector<HTMLElement>(":scope > .bf-grid:not(.example-column-guide)");
      const innerGrid = shell.querySelector<HTMLElement>(".example-nested-inner");
      if (!outerGrid || !innerGrid) return null;
      const children = Array.from(innerGrid.children).map(child => (child as HTMLElement).getBoundingClientRect());
      return {
        outerColumns: getComputedStyle(outerGrid).gridTemplateColumns.split(" ").filter(Boolean).length,
        innerColumns: getComputedStyle(innerGrid).gridTemplateColumns.split(" ").filter(Boolean).length,
        childCount: children.length,
        childrenShareRow: children.length === 2 && Math.abs(children[0].top - children[1].top) <= 1,
        innerOverflow: innerGrid.scrollWidth - innerGrid.clientWidth
      };
    }));

    assert(states.length === 3 && states.every(Boolean), "Expected all three nested-grid specimens to expose measurable outer and inner grids.");
    const measured = states.filter((state): state is NonNullable<typeof state> => state !== null);
    assert(measured.map(state => state.outerColumns).join(",") === "4,8,16", `Expected nested-grid outer specimens to exercise 4/8/16 columns, got ${measured.map(state => state.outerColumns).join(",")}.`);
    assert(measured.every(state => state.innerColumns === 4 && state.childCount === 2 && state.innerOverflow <= 1), `Expected every nested grid to resolve against its own four-column module without overflow, got ${JSON.stringify(measured)}.`);
    assert(!measured[0].childrenShareRow && measured[1].childrenShareRow && measured[2].childrenShareRow, `Expected the narrow child cards to stack and the two span-2 specimens to share a row, got ${JSON.stringify(measured)}.`);
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
        const borderedNotifications = notifications.filter(notification => !notification.classList.contains("is-borderless"));
        const spaceProbe = document.createElement("span");
        spaceProbe.style.cssText = "position:absolute;visibility:hidden;inline-size:var(--bf-space-1);block-size:1px";
        document.body.appendChild(spaceProbe);
        const spaceOne = spaceProbe.getBoundingClientRect().width;
        spaceProbe.remove();
        const leadingIconGaps = borderedNotifications.map(notification => {
          const notificationRect = notification.getBoundingClientRect();
          const iconRect = (notification.querySelector(".bf-notification-icon") as HTMLElement).getBoundingClientRect();
          const barWidth = Number.parseFloat(getComputedStyle(notification).borderInlineStartWidth);
          return iconRect.left - notificationRect.left - barWidth;
        });
        const iconToTextGaps = notifications.map(notification => {
          const iconRect = (notification.querySelector(".bf-notification-icon") as HTMLElement).getBoundingClientRect();
          const contentRect = (notification.querySelector(".bf-notification-content") as HTMLElement).getBoundingClientRect();
          return contentRect.left - iconRect.right;
        });
        const iconFirstLineCentreDeltas = notifications.map(notification => {
          const iconRect = (notification.querySelector(".bf-notification-icon") as HTMLElement).getBoundingClientRect();
          const firstRole = notification.querySelector<HTMLElement>(".bf-notification-title, .bf-notification-message");
          if (!firstRole) return Number.POSITIVE_INFINITY;
          const roleRect = firstRole.getBoundingClientRect();
          const roleStyles = getComputedStyle(firstRole);
          const firstLineCentre = roleRect.top + Number.parseFloat(roleStyles.paddingBlockStart) + (Number.parseFloat(roleStyles.lineHeight) / 2);
          return Math.abs((iconRect.top + (iconRect.height / 2)) - firstLineCentre);
        });
        const closeClearances = notifications.flatMap(notification => {
          const close = notification.querySelector<HTMLElement>(".bf-notification-close");
          const content = notification.querySelector<HTMLElement>(".bf-notification-content");
          if (!close || !content) return [];
          const closeStyle = getComputedStyle(close);
          return [{
            reserved: Number.parseFloat(getComputedStyle(content).paddingInlineEnd),
            required: close.getBoundingClientRect().width + Number.parseFloat(closeStyle.insetInlineEnd)
          }];
        });
        const documentElement = document.documentElement;
        const originalDirection = documentElement.getAttribute("dir");
        documentElement.setAttribute("dir", "rtl");
        const rtlNotification = borderedNotifications[0];
        const rtlNotificationRect = rtlNotification.getBoundingClientRect();
        const rtlIconRect = (rtlNotification.querySelector(".bf-notification-icon") as HTMLElement).getBoundingClientRect();
        const rtlContentRect = (rtlNotification.querySelector(".bf-notification-content") as HTMLElement).getBoundingClientRect();
        const rtlBarWidth = Number.parseFloat(getComputedStyle(rtlNotification).borderInlineStartWidth);
        const rtlClose = document.querySelector<HTMLElement>(".bf-notification-close");
        const rtlCloseRootRect = (rtlClose?.closest(".bf-notification") as HTMLElement).getBoundingClientRect();
        const rtlCloseRect = rtlClose?.getBoundingClientRect();
        const rtlGeometry = {
          leadingIconGap: rtlNotificationRect.right - rtlIconRect.right - rtlBarWidth,
          iconToTextGap: rtlIconRect.left - rtlContentRect.right,
          closeAtInlineEnd: Boolean(rtlCloseRect && rtlCloseRect.left < rtlCloseRootRect.left + (rtlCloseRootRect.width / 2))
        };
        if (originalDirection === null) documentElement.removeAttribute("dir");
        else documentElement.setAttribute("dir", originalDirection);
        return {
          baseline,
          barThicknessToken: getComputedStyle(document.body).getPropertyValue("--bf-bar-thickness").trim(),
          h6FontSize: getComputedStyle(document.querySelector(".bf-notification-title.bf-h6") as Element).fontSize,
          notificationFontSizes: notifications.flatMap(notification => {
            const title = notification.querySelector(".bf-notification-title");
            return title ? [getComputedStyle(title).fontSize] : [];
          }),
          notificationTitlesUseH6: notifications.filter(notification => !notification.classList.contains("is-inline")).every(notification => notification.querySelector(".bf-notification-title")?.classList.contains("bf-h6")),
          inlineUsesSingleBodyRun: notifications.filter(notification => notification.classList.contains("is-inline")).every(notification => {
            const message = notification.querySelector(".bf-notification-message");
            return !notification.querySelector(".bf-notification-title") && message?.children.length === 1 && message.firstElementChild?.tagName === "STRONG";
          }),
          accentWidths: borderedNotifications.map(notification => Number.parseFloat(getComputedStyle(notification).borderInlineStartWidth)),
          paddingBlockStarts: notifications.map(notification => Number.parseFloat(getComputedStyle(notification).paddingBlockStart)),
          leadingIconGaps,
          iconToTextGaps,
          iconFirstLineCentreDeltas,
          closeClearances,
          rtlGeometry,
          expectedLeadingIconGap: spaceOne - 3,
          expectedIconToTextGap: spaceOne,
          heights: notifications.map(notification => notification.getBoundingClientRect().height),
          overflow: notifications.map(notification => notification.scrollWidth - notification.clientWidth)
        };
      });
      assert(geometry.baseline > 0, `Expected ${tier} notification fixture to resolve a positive baseline.`);
      assert(geometry.barThicknessToken === "0.1875rem" && geometry.accentWidths.every(width => width === 3), `Expected ${tier} notification accents to use the shared 3px/0.1875rem emphasis bar; got ${geometry.accentWidths.join(", ")}px/${geometry.barThicknessToken}.`);
      assert(geometry.paddingBlockStarts.every(padding => padding === 0), `Expected ${tier} notification roots to have no top padding; got ${geometry.paddingBlockStarts.join(", ")}px.`);
      assert(geometry.leadingIconGaps.every(gap => Math.abs(gap - geometry.expectedLeadingIconGap) <= 0.05), `Expected ${tier} notification bar-to-icon gaps to equal the compact space-1 token minus the bar thickness (${geometry.expectedLeadingIconGap}px); got ${geometry.leadingIconGaps.join(", ")}px.`);
      assert(geometry.iconToTextGaps.every(gap => Math.abs(gap - geometry.expectedIconToTextGap) <= 0.05), `Expected ${tier} notification icon-to-text gaps to equal the compact space-1 token (${geometry.expectedIconToTextGap}px); got ${geometry.iconToTextGaps.join(", ")}px.`);
      assert(geometry.iconFirstLineCentreDeltas.every(delta => delta <= 0.05), `Expected ${tier} notification severity icons to align to the first title/body line; centre deltas=${geometry.iconFirstLineCentreDeltas.join(", ")}px.`);
      assert(geometry.closeClearances.every(clearance => clearance.reserved >= clearance.required), `Expected ${tier} notification copy to clear the close control; got ${JSON.stringify(geometry.closeClearances)}.`);
      assert(Math.abs(geometry.rtlGeometry.leadingIconGap - geometry.expectedLeadingIconGap) <= 0.05 && Math.abs(geometry.rtlGeometry.iconToTextGap - geometry.expectedIconToTextGap) <= 0.05 && geometry.rtlGeometry.closeAtInlineEnd, `Expected ${tier} notification leading geometry and close control to mirror in RTL; got ${JSON.stringify(geometry.rtlGeometry)}.`);
      assert(geometry.heights.every(height => Math.abs((height / geometry.baseline) - Math.round(height / geometry.baseline)) <= 0.05), `Expected ${tier} notification border boxes to stay baseline multiples; heights=${geometry.heights.join(", ")}, baseline=${geometry.baseline}.`);
      assert(geometry.overflow.every(delta => delta <= 1), `Expected ${tier} notifications to avoid inline overflow; deltas=${geometry.overflow.join(", ")}.`);
      assert(geometry.notificationTitlesUseH6 && geometry.inlineUsesSingleBodyRun && geometry.notificationFontSizes.length > 0 && geometry.notificationFontSizes.every(fontSize => fontSize === geometry.h6FontSize), `Expected ${tier} separate notification headings to use bf-h6 while inline feedback stays one strong-plus-regular body run; heading classes=${geometry.notificationTitlesUseH6}, inline=${geometry.inlineUsesSingleBodyRun}, sizes=${geometry.notificationFontSizes.join(", ")}.`);
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

async function main(): Promise<void> {
  const rootDir = path.resolve(".");
  const { server, origin } = await createStaticServer(rootDir);

  try {
    await verifyPageChromeNavigationScroll(origin);
    await verifyPageChromeHierarchyAndKeylines(origin);
    await verifyExamplePreferencesBeforePaint(origin);
    await verifyExampleMainClearsPageNavigation(origin);
    await verifyPinnedAsideResize(origin);
    await verifyDrawerOverlay(origin);
    await verifyApplicationLayout(origin);
    await verifyTopNavigation(origin);
    await verifyBodySizedUiTypography(origin);
    await verifyQualifiedAnchorStates(origin);
    await verifySemanticRoleClassPrecedence(origin);
    await verifyContainerOwnedSpacing(origin);
    await verifyRenewalCompositionContracts(origin);
    await verifyAdversarialResponsiveGeometry(origin);
    await verifyDirectAndClassSurfaceGeometry(origin);
    await verifyNarrowTierSwitchRangeGeometry(origin);
    await verifyNestedGridScoping(origin);
    await verifySkipLink(origin);
    await verifyParityInteractions(origin);
    await verifyReducedNavigationAndTableOfContents(origin);
    await verifyInteractiveTables(origin);
    await verifyPortedCompositionGeometry(origin);
    await verifyRichListsAndTabSectionGeometry(origin);
    await verifySitesRecipeCompositions(origin);
    await verifyContentCardGeometry(origin);
    await verifyLinkedLogoAndStickyFooterGeometry(origin);
    await verifySiteShellPrimitiveGeometry(origin);

    console.log("Component behavior verification passed.");
  } finally {
    await closeServer(server);
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
