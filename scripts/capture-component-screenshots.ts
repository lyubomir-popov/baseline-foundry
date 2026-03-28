import path from "node:path";
import { chromium } from "playwright";
import fs from "node:fs/promises";
import { closeServer, componentPages, createStaticServer, waitForFonts } from "./component-demo-shared.ts";

interface ScreenshotClip {
  x: number;
  y: number;
  width: number;
  height: number;
}

function viewportForProfile(profile: "fit" | "wide" | undefined): { width: number; height: number; } {
  if (profile === "wide") {
    return { width: 1600, height: 1200 };
  }

  return { width: 820, height: 620 };
}

async function computeCaptureClip(
  page: import("playwright").Page,
  profile: "fit" | "wide" | undefined
): Promise<ScreenshotClip> {
  const paddingPx = profile === "wide" ? 24 : 16;

  return page.evaluate(({ padding, mode }) => {
    const captureRoot = document.querySelector<HTMLElement>("[data-component-capture]");
    if (!captureRoot) {
      throw new Error("No [data-component-capture] root found.");
    }

    const ignoredSelectors = [
      ".component-demo-kicker",
      ".component-demo-label",
      ".component-demo-note",
      ".component-demo-meta"
    ];

    if (mode === "fit") {
      ignoredSelectors.push(
        ".component-demo-surface",
        ".component-demo-flow-box",
        ".component-demo-cluster",
        ".component-demo-stack",
        ".component-demo-specimens",
        ".component-demo-specimen",
        ".component-demo-card",
        ".component-demo-grid-card",
        ".component-demo-layout-card",
        ".p-form__group",
        ".p-form__control",
        ".p-slider__wrapper"
      );
    }

    const ignoredSelector = ignoredSelectors.join(", ");

    const candidates = Array.from(
      captureRoot.querySelectorAll<HTMLElement>("[data-baseline-check], [data-overflow-check]")
    )
      .filter(element => !element.matches(ignoredSelector))
      .filter(element => !element.closest("[data-capture-ignore='true']"))
      .filter(element => element.getClientRects().length > 0)
      .map(element => ({ rect: element.getBoundingClientRect() }));

    const rects = candidates.length > 0
      ? candidates.map(entry => entry.rect)
      : [captureRoot.getBoundingClientRect()];

    const left = Math.min(...rects.map(rect => rect.left));
    const top = Math.min(...rects.map(rect => rect.top));
    const right = Math.max(...rects.map(rect => rect.right));
    const bottom = Math.max(...rects.map(rect => rect.bottom));
    const maxWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
    const maxHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    const x = Math.max(0, left + window.scrollX - padding);
    const y = Math.max(0, top + window.scrollY - padding);
    const width = Math.max(1, Math.min(maxWidth - x, right - left + padding * 2));
    const height = Math.max(1, Math.min(maxHeight - y, bottom - top + padding * 2));

    return { x, y, width, height };
  }, { padding: paddingPx, mode: profile ?? "fit" });
}

async function main(): Promise<void> {
  const rootDir = path.resolve(".");
  const outputDir = path.resolve("tmp/screenshots/components");
  const screenshotVersion = "20260328-panel-refresh-18";
  const thumbnailWidth = 360;
  const thumbnailHeight = 240;
  await fs.mkdir(outputDir, { recursive: true });

  const { server, origin } = await createStaticServer(rootDir);
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 2,
      viewport: viewportForProfile("wide")
    });

    const manifest = [] as Array<{
      name: string;
      route: string;
      screenshotPath: string;
      screenshotUrl: string;
      thumbnailWidth: number;
      thumbnailHeight: number;
      version: string;
    }>;

    for (const componentPage of componentPages) {
      await page.setViewportSize(viewportForProfile(componentPage.captureProfile));
      const url = `${origin}${componentPage.route}`;
      await page.goto(url, { waitUntil: "networkidle" });
      await waitForFonts(page);

      const screenshotPath = path.join(outputDir, `${componentPage.name}.png`);
      const clip = await computeCaptureClip(page, componentPage.captureProfile);
      await page.screenshot({
        clip,
        path: screenshotPath
      });

      manifest.push({
        name: componentPage.name,
        route: componentPage.route,
        screenshotPath,
        screenshotUrl: `/tmp/screenshots/components/${componentPage.name}.png?v=${screenshotVersion}`,
        thumbnailWidth,
        thumbnailHeight,
        version: screenshotVersion
      });

      console.log(`Captured ${componentPage.name}: ${screenshotPath}`);
    }

    await fs.writeFile(path.join(outputDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  } finally {
    await browser.close();
    await closeServer(server);
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
