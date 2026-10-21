import path from "node:path";
import { pathToFileURL } from "node:url";
import { closeServer, createStaticServer } from "../component-demo-shared.ts";
import { assert, openBrowser } from "./browser-helpers.ts";

export async function verifyDrawerElevation(origin: string): Promise<void> {
  const browser = await openBrowser();
  let cases = 0;
  try {
    const page = await browser.newPage();
    for (const tier of ["editorial", "documentation", "app", "os"]) {
      for (const shared of [false, true]) {
        const stylesheet = shared ? "dist/styles.css" : `dist/tiers/${tier}/styles.css`;
        await page.setContent(`<!doctype html><html><head><link rel="stylesheet" href="${origin}/${stylesheet}"></head>
          <body class="bf-theme ${shared ? `bf-tier-${tier}` : ""}">
          <div class="bf-application"><header class="bf-navigation"><div class="bf-navigation-drawer">Navigation</div></header></div>
          </body></html>`);
        // Cross the breakpoint in both directions so a previous overlay state
        // cannot leak into the desktop panel or suppress mobile elevation.
        for (const width of [390, 1440, 390]) {
          await page.setViewportSize({ width, height: 900 });
          const paint = await page.locator(".bf-navigation-drawer").evaluate(drawer => {
            const root = getComputedStyle(drawer);
            const overlay = getComputedStyle(drawer, "::after");
            return {
              rootShadow: root.boxShadow,
              overlayShadow: overlay.boxShadow,
              elevation: root.getPropertyValue("--bf-overlay-elevation-layer").trim(),
              pointerEvents: overlay.pointerEvents,
              border: root.borderInlineEndWidth
            };
          });
          const label = `${tier}/${shared ? "shared" : "direct"}/${width}`;
          assert(paint.rootShadow === "none" && paint.border === "0px" && paint.pointerEvents === "none", `Drawer paint must stay on its pointer-transparent overlay: ${label} ${JSON.stringify(paint)}`);
          assert(paint.overlayShadow.includes("inset"), `Drawer must retain its inline boundary: ${label} ${JSON.stringify(paint)}`);
          if (width === 1440) {
            assert(paint.elevation === "0 0 0 0 transparent", `Desktop drawer must not retain mobile elevation: ${label} ${JSON.stringify(paint)}`);
          } else {
            assert(paint.elevation !== "0 0 0 0 transparent" && /rgba\(0, 0, 0, 0\.(?:12|38)\)/.test(paint.overlayShadow), `Expanded mobile drawer must retain elevation: ${label} ${JSON.stringify(paint)}`);
          }
          cases++;
        }
      }
    }
    console.log(`Drawer elevation passed: ${cases} desktop/mobile states across four tiers and both bundles.`);
  } finally {
    await browser.close();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const { server, origin } = await createStaticServer(path.resolve("."));
  try {
    await verifyDrawerElevation(origin);
  } finally {
    await closeServer(server);
  }
}
