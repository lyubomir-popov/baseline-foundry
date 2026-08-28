import { chromium } from "playwright";

export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export async function openBrowser(): Promise<import("playwright").Browser> {
  try {
    return await chromium.launch();
  } catch (error) {
    if (error instanceof Error && error.message.includes("Executable doesn't exist")) {
      throw new Error("Playwright Chromium is not installed. Run `npm run playwright:install` once before behavior verification.");
    }

    throw error;
  }
}

export async function disableDemoChromeHitTesting(page: import("playwright").Page): Promise<void> {
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
