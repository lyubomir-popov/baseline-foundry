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

async function readAsideWidth(page: import("playwright").Page): Promise<number> {
  return page.locator(".l-aside.is-pinned").evaluate(element => element.getBoundingClientRect().width);
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
    await page.evaluate(key => localStorage.removeItem(key), storageKey);
    await page.reload({ waitUntil: "networkidle" });
    await waitForFonts(page);

    const handle = page.locator(".l-application__aside-resize-handle");
    const aside = page.locator(".l-aside.is-pinned");
    const application = page.locator(".l-application");
    await handle.waitFor({ state: "visible" });
    await aside.waitFor({ state: "visible" });

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
    const persistedWidth = await readAsideWidth(page);
    assert(Math.abs(persistedWidth - resizedWidth) <= 2, `Expected resized aside width to persist after reload. Resized ${resizedWidth}px, reloaded ${persistedWidth}px.`);

    const minWidth = Number.parseFloat(await handle.getAttribute("aria-valuemin") ?? "");
    const maxWidth = Number.parseFloat(await handle.getAttribute("aria-valuemax") ?? "");
    assert(Number.isFinite(minWidth) && Number.isFinite(maxWidth), "Expected resize handle to expose aria-valuemin and aria-valuemax.");

    await handle.focus();
    await page.keyboard.press("Home");
    const homeWidth = await readAsideWidth(page);
    assert(Math.abs(homeWidth - minWidth) <= 2, `Expected Home to clamp the aside to its minimum width. Min ${minWidth}px, got ${homeWidth}px.`);

    await handle.focus();
    await page.keyboard.press("End");
    const endWidth = await readAsideWidth(page);
    assert(Math.abs(endWidth - maxWidth) <= 2, `Expected End to clamp the aside to its maximum width. Max ${maxWidth}px, got ${endWidth}px.`);

    await handle.dblclick();
    await page.reload({ waitUntil: "networkidle" });
    await waitForFonts(page);
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

    const application = page.locator(".l-application");
    const drawer = page.locator("#drawer-panel-demo");
    const overlay = page.locator(".l-application__overlay");
    const toggle = page.locator("[data-panel-drawer-toggle]");

    await application.waitFor({ state: "visible" });
    await drawer.waitFor({ state: "visible" });

    const openGeometry = await page.evaluate(() => {
      const app = document.querySelector(".l-application");
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
      const app = document.querySelector(".l-application");
      const aside = document.querySelector<HTMLElement>("#drawer-panel-demo");
      const overlayElement = document.querySelector<HTMLElement>(".l-application__overlay");
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
      const app = document.querySelector(".l-application");
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
      const app = document.querySelector(".l-application");
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

async function main(): Promise<void> {
  const rootDir = path.resolve(".");
  const { server, origin } = await createStaticServer(rootDir);

  try {
    await verifyPinnedAsideResize(origin);
    await verifyDrawerOverlay(origin);

    console.log("Component behavior verification passed.");
  } finally {
    await closeServer(server);
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
