import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { closeServer, componentPages, createStaticServer, waitForFonts } from "./component-demo-shared.ts";
import { tierNames } from "../src/presets.ts";

interface BaselineCheckResult {
  label: string;
  offsetPx: number;
  measurePx: number;
  offsetErrorPx: number;
  measureErrorPx: number;
  passed: boolean;
}

interface OverflowCheckResult {
  label: string;
  overflowLeftPx: number;
  overflowRightPx: number;
  passed: boolean;
}

interface ComponentVerificationResult {
  baselinePx: number;
  captureHeightPx: number;
  captureHeightErrorPx: number;
  checks: BaselineCheckResult[];
  failures: BaselineCheckResult[];
  overflowChecks: OverflowCheckResult[];
  overflowFailures: OverflowCheckResult[];
  missingCoverage: string[];
}

interface ComponentVerificationReport {
  name: string;
  route: string;
  surface: string;
  surfaceLabel: string;
  baselinePx: number;
  captureHeightPx: number;
  captureHeightErrorPx: number;
  checks: BaselineCheckResult[];
  failures: BaselineCheckResult[];
  overflowChecks: OverflowCheckResult[];
  overflowFailures: OverflowCheckResult[];
  missingCoverage: string[];
}

// Chromium can accumulate just over half a physical pixel across long variable-font
// specimens. Keep the allowance well below the smallest 4px tier baseline.
const tolerancePx = 0.75;
const pageChromeStorageKeys = [
  "baseline-foundry:living-spec-tier",
  "baseline-foundry:living-spec-baseline",
  "baseline-foundry:living-spec-tone"
];

interface SurfaceOption {
  value: string;
  label: string;
}

interface SurfaceSelectorState {
  ariaLabel: string | null;
  hasExplicitTierOptions: boolean;
  options: SurfaceOption[];
  selectedValue: string;
}

function describeFailure(component: ComponentVerificationReport, failure: BaselineCheckResult): string {
  return `${component.name} [${component.surfaceLabel}] -> ${failure.label} offset error ${failure.offsetErrorPx.toFixed(2)}px, measure error ${failure.measureErrorPx.toFixed(2)}px`;
}

function describeMissingCoverage(component: ComponentVerificationReport, label: string): string {
  return `${component.name} [${component.surfaceLabel}] -> missing data-baseline-check for ${label}`;
}

function describeOverflowFailure(component: ComponentVerificationReport, failure: OverflowCheckResult): string {
  return `${component.name} [${component.surfaceLabel}] -> ${failure.label} overflows container by left ${failure.overflowLeftPx.toFixed(2)}px, right ${failure.overflowRightPx.toFixed(2)}px`;
}

async function openBrowser(): Promise<import("playwright").Browser> {
  try {
    return await chromium.launch();
  } catch (error) {
    if (error instanceof Error && error.message.includes("Executable doesn't exist")) {
      throw new Error("Playwright Chromium is not installed. Run `npm run playwright:install` once before visual baseline verification.");
    }

    throw error;
  }
}

async function clearPageChromeStorage(page: import("playwright").Page, origin: string): Promise<void> {
  if (!page.url().startsWith(origin)) {
    return;
  }

  await page.evaluate(keys => {
    for (const key of keys) {
      window.localStorage.removeItem(key);
    }
  }, pageChromeStorageKeys);
}

async function waitForSurfaceSelect(page: import("playwright").Page): Promise<void> {
  try {
    await page.waitForFunction(
      () => document.querySelector("[data-page-chrome-tier-select]") instanceof HTMLSelectElement,
      undefined,
      { timeout: 5000 }
    );
  } catch {
    // Pages without the shared chrome fall back to their authored surface only.
  }
}

async function readSurfaceSelectorState(page: import("playwright").Page): Promise<SurfaceSelectorState> {
  return page.evaluate(() => {
    const select = document.querySelector("[data-page-chrome-tier-select]");
    const currentSurface = document.body.dataset.bfTier ?? "editorial";

    if (!(select instanceof HTMLSelectElement)) {
      return {
        ariaLabel: null,
        hasExplicitTierOptions: false,
        options: [{ value: currentSurface, label: currentSurface }],
        selectedValue: currentSurface
      } satisfies SurfaceSelectorState;
    }

    return {
      ariaLabel: select.getAttribute("aria-label"),
      hasExplicitTierOptions: typeof document.body.dataset.pageTierOptions === "string" && document.body.dataset.pageTierOptions.length > 0,
      options: Array.from(select.options).map(option => ({
        value: option.value,
        label: option.textContent?.trim() || option.value
      })),
      selectedValue: select.value || currentSurface
    } satisfies SurfaceSelectorState;
  });
}

function plannedSurfaceOptions(state: SurfaceSelectorState): SurfaceOption[] {
  if ((state.ariaLabel ?? "").toLowerCase() === "tier" && state.selectedValue === "app" && !state.hasExplicitTierOptions) {
    return state.options.filter(option => option.value === "app");
  }

  if ((state.ariaLabel ?? "").toLowerCase() === "tier") {
    const orderedOptions = tierNames
      .map(value => state.options.find(option => option.value === value))
      .filter((option): option is SurfaceOption => Boolean(option));

    return orderedOptions.length > 0 ? orderedOptions : state.options;
  }

  return state.options;
}

async function selectSurface(page: import("playwright").Page, surface: SurfaceOption): Promise<void> {
  const selector = "[data-page-chrome-tier-select]";
  const tierSelect = page.locator(selector);
  if (await tierSelect.count() === 0) {
    return;
  }

  await tierSelect.selectOption(surface.value);
  await page.waitForFunction(expectedSurface => document.body.dataset.bfTier === expectedSurface, surface.value);
  await waitForFonts(page);
}

async function verifyComponentPage(
  page: import("playwright").Page,
  componentPage: { name: string; route: string; },
  surface: SurfaceOption
): Promise<ComponentVerificationReport> {
  const result = await page.evaluate(({ pageName, tolerance }) => {
    interface BaselineCheckResult {
      label: string;
      offsetPx: number;
      measurePx: number;
      offsetErrorPx: number;
      measureErrorPx: number;
      passed: boolean;
    }

    interface OverflowCheckResult {
      label: string;
      overflowLeftPx: number;
      overflowRightPx: number;
      passed: boolean;
    }

    interface ComponentVerificationResult {
      baselinePx: number;
      captureHeightPx: number;
      captureHeightErrorPx: number;
      checks: BaselineCheckResult[];
      failures: BaselineCheckResult[];
      overflowChecks: OverflowCheckResult[];
      overflowFailures: OverflowCheckResult[];
      missingCoverage: string[];
    }

    const captureRoot = document.querySelector<HTMLElement>("[data-component-capture]");
    if (!captureRoot) {
      throw new Error(`No [data-component-capture] root found for ${pageName}.`);
    }

    const rootRect = captureRoot.getBoundingClientRect();
    const probe = document.createElement("div");
    probe.style.blockSize = "var(--bf-baseline)";
    probe.style.inlineSize = "0";
    probe.style.margin = "0";
    probe.style.padding = "0";
    probe.style.border = "0";
    probe.style.opacity = "0";
    probe.style.pointerEvents = "none";
    probe.style.position = "absolute";
    captureRoot.appendChild(probe);
    const baselinePx = probe.getBoundingClientRect().height;
    probe.remove();
    const checks: BaselineCheckResult[] = [];
    const overflowChecks: OverflowCheckResult[] = [];
    const coverageSelector = [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "blockquote",
      "ul",
      "ol",
      "li",
      "hr",
      "input",
      "textarea",
      "select",
      "button",

      ".bf-fixed-width",
      ".bf-stage-shell",
      ".bf-grid.is-controls",
      ".bf-grid-item.is-control",
      ".bf-grid-item.is-control-pair",
      ".bf-panel",
      ".bf-card",
      ".bf-card.is-highlighted",
      ".bf-card.is-overlay",
      ".bf-card.is-muted",
      ".bf-choice-row",
      ".bf-inline-options",
      ".bf-actions",
      ".bf-option-card",
      ".bf-tabs-list",
      ".bf-segmented-control-button",
      ".bf-breadcrumbs-items",
      ".bf-pagination-items",
      ".bf-pagination-item.is-truncation",
      ".bf-code-snippet",
      ".bf-code-snippet-header",
      ".bf-code-snippet-block",
      ".bf-code-snippet-block.is-icon",
      ".bf-code-snippet-block.is-numbered",
      ".bf-accordion-tab",
      ".bf-accordion-panel",
      ".bf-modal-dialog",
      ".bf-validation-message"
    ].join(", ");

    const rootMeasure = rootRect.height;
    const rootNearest = baselinePx === 0 ? rootMeasure : Math.round(rootMeasure / baselinePx) * baselinePx;
    const rootMeasureErrorPx = Math.abs(rootMeasure - rootNearest);

    const elements = Array.from(captureRoot.querySelectorAll<HTMLElement>("[data-baseline-check]"));
    for (const element of elements) {
      if (element.dataset.baselineIgnore === "true" || element.closest("[hidden], [aria-hidden='true']")) {
        continue;
      }

      if (element.getClientRects().length === 0) {
        continue;
      }

      const rect = element.getBoundingClientRect();
      const styles = getComputedStyle(element);
      const marginBottom = Number.parseFloat(styles.marginBottom) || 0;
      const offsetPx = rect.top - rootRect.top;
      const measurePx = rect.height + marginBottom;
      const offsetNearest = baselinePx === 0 ? offsetPx : Math.round(offsetPx / baselinePx) * baselinePx;
      const measureNearest = baselinePx === 0 ? measurePx : Math.round(measurePx / baselinePx) * baselinePx;
      const offsetErrorPx = Math.abs(offsetPx - offsetNearest);
      const measureErrorPx = Math.abs(measurePx - measureNearest);
      const label = (element.dataset.baselineLabel ?? "").replace(/\s+/g, " ").trim()
        || (element.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 80)
        || element.tagName.toLowerCase();

      checks.push({
        label,
        offsetPx,
        measurePx,
        offsetErrorPx,
        measureErrorPx,
        passed: offsetErrorPx <= tolerance && measureErrorPx <= tolerance
      });
    }

    const failures = checks.filter(check => !check.passed);
    const overflowTargets = Array.from(captureRoot.querySelectorAll<HTMLElement>("[data-overflow-check]"));
    for (const element of overflowTargets) {
      if (element.getClientRects().length === 0 || element.closest("[hidden], [aria-hidden='true']")) {
        continue;
      }

      const container = element.closest<HTMLElement>("[data-overflow-container]") ?? captureRoot;
      const rect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const overflowLeftPx = Math.max(0, containerRect.left - rect.left);
      const overflowRightPx = Math.max(0, rect.right - containerRect.right);
      const label = (element.dataset.baselineLabel ?? "").replace(/\s+/g, " ").trim()
        || (element.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 80)
        || element.tagName.toLowerCase();

      overflowChecks.push({
        label,
        overflowLeftPx,
        overflowRightPx,
        passed: overflowLeftPx <= tolerance && overflowRightPx <= tolerance
      });
    }

    const overflowFailures = overflowChecks.filter(check => !check.passed);
    const missingCoverage = Array.from(captureRoot.querySelectorAll<HTMLElement>(coverageSelector))
        .filter(element => element.getClientRects().length > 0)
        .filter(element => element.dataset.baselineIgnore !== "true")
        .filter(element => !element.closest("[data-baseline-ignore='true']"))
        .filter(element => !element.hasAttribute("data-baseline-check"))
        .map(element => {
          const label = (element.dataset.baselineLabel ?? "").replace(/\s+/g, " ").trim()
            || element.className?.toString().replace(/\s+/g, ".")
            || element.tagName.toLowerCase();
          return label;
        });

    const report: ComponentVerificationResult = {
      baselinePx,
      captureHeightPx: rootMeasure,
      captureHeightErrorPx: rootMeasureErrorPx,
      checks,
      failures,
      overflowChecks,
      overflowFailures,
      missingCoverage
    };

    return report;
  }, { pageName: componentPage.name, tolerance: tolerancePx });

  return {
    name: componentPage.name,
    route: componentPage.route,
    surface: surface.value,
    surfaceLabel: surface.label,
    baselinePx: result.baselinePx,
    captureHeightPx: result.captureHeightPx,
    captureHeightErrorPx: result.captureHeightErrorPx,
    checks: result.checks,
    failures: result.failures,
    overflowChecks: result.overflowChecks,
    overflowFailures: result.overflowFailures,
    missingCoverage: result.missingCoverage
  };
}

async function main(): Promise<void> {
  const rootDir = path.resolve(".");
  const outputDir = path.resolve("tmp/screenshots/components");
  const reportPath = path.join(outputDir, "baseline-report.json");

  await fs.mkdir(outputDir, { recursive: true });

  const { server, origin } = await createStaticServer(rootDir);
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 2200, height: 1600 }
    });

    const report = [] as ComponentVerificationReport[];

    for (const componentPage of componentPages) {
      await clearPageChromeStorage(page, origin);
      await page.goto(`${origin}${componentPage.route}`, { waitUntil: "networkidle" });
      await waitForFonts(page);
      await waitForSurfaceSelect(page);

      const surfaceState = await readSurfaceSelectorState(page);
      const surfaces = plannedSurfaceOptions(surfaceState);

      for (const surface of surfaces) {
        if (surface.value !== surfaceState.selectedValue) {
          await selectSurface(page, surface);
        }

        const componentReport = await verifyComponentPage(page, componentPage, surface);
        report.push(componentReport);
        console.log(`Verified ${componentPage.name} [${surface.value}]: ${componentReport.checks.length} checks, ${componentReport.failures.length} failures`);
      }
    }

    await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

    const failures = report.flatMap(component => component.failures.map(failure => describeFailure(component, failure)));
    const overflowFailures = report.flatMap(component => component.overflowFailures.map(failure => describeOverflowFailure(component, failure)));
    const missingCoverage = report.flatMap(component => component.missingCoverage.map(label => describeMissingCoverage(component, label)));
    if (failures.length > 0 || overflowFailures.length > 0 || missingCoverage.length > 0) {
      throw new Error(`Baseline verification failed.\n${[...failures, ...overflowFailures, ...missingCoverage].join("\n")}`);
    }
  } finally {
    await browser.close();
    await closeServer(server);
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
