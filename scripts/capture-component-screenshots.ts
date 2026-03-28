import path from "node:path";
import { chromium } from "playwright";
import fs from "node:fs/promises";
import { closeServer, componentPages, createStaticServer, waitForFonts } from "./component-demo-shared.ts";

async function main(): Promise<void> {
  const rootDir = path.resolve(".");
  const outputDir = path.resolve("tmp/screenshots/components");
  await fs.mkdir(outputDir, { recursive: true });

  const { server, origin } = await createStaticServer(rootDir);
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 2200, height: 1600 }
    });

    const manifest = [] as Array<{ name: string; route: string; screenshotPath: string; }>;

    for (const componentPage of componentPages) {
      const url = `${origin}${componentPage.route}`;
      await page.goto(url, { waitUntil: "networkidle" });
      await waitForFonts(page);

      const screenshotPath = path.join(outputDir, `${componentPage.name}.png`);
      await page.locator("[data-component-capture]").screenshot({ path: screenshotPath });

      manifest.push({
        name: componentPage.name,
        route: componentPage.route,
        screenshotPath
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
