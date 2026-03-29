import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { closeServer, componentPages, createStaticServer, waitForFonts } from "./component-demo-shared.ts";

type CheckMode = "box" | "flow";

interface BaselineCheckResult {
  label: string;
  mode: CheckMode;
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
  baselinePx: number;
  captureHeightPx: number;
  captureHeightErrorPx: number;
  checks: BaselineCheckResult[];
  failures: BaselineCheckResult[];
  overflowChecks: OverflowCheckResult[];
  overflowFailures: OverflowCheckResult[];
  missingCoverage: string[];
}

const tolerancePx = 0.5;

function describeFailure(component: ComponentVerificationReport, failure: BaselineCheckResult): string {
  return `${component.name} -> ${failure.label} (${failure.mode}) offset error ${failure.offsetErrorPx.toFixed(2)}px, measure error ${failure.measureErrorPx.toFixed(2)}px`;
}

function describeMissingCoverage(component: ComponentVerificationReport, label: string): string {
  return `${component.name} -> missing data-baseline-check for ${label}`;
}

function describeOverflowFailure(component: ComponentVerificationReport, failure: OverflowCheckResult): string {
  return `${component.name} -> ${failure.label} overflows container by left ${failure.overflowLeftPx.toFixed(2)}px, right ${failure.overflowRightPx.toFixed(2)}px`;
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

async function verifyComponentPage(
  page: import("playwright").Page,
  origin: string,
  componentPage: { name: string; route: string; }
): Promise<ComponentVerificationReport> {
  await page.goto(`${origin}${componentPage.route}`, { waitUntil: "networkidle" });
  await waitForFonts(page);

  const result = await page.evaluate(({ pageName, tolerance }) => {
    type CheckMode = "box" | "flow";

    interface BaselineCheckResult {
      label: string;
      mode: CheckMode;
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
      ".component-demo-layout-card",
      ".component-demo-grid-card",
      ".component-demo-surface",
      ".component-demo-quote-card",
      ".component-demo-figure",
      ".component-demo-micro-row",
      ".component-demo-compat-shell",
      ".component-demo-compat-stage",
      ".bf-fixed-width",
      ".bf-stage-shell",
      ".bf-grid.is-controls",
      ".bf-grid-item.is-control",
      ".bf-grid-item.is-control-pair",
      ".p-panel",
      ".p-card",
      ".p-card--highlighted",
      ".p-card--overlay",
      ".p-card--muted",
      ".p-choice-row",
      ".bf-choice-row",
      ".p-inline-options",
      ".bf-inline-options",
      ".p-actions",
      ".bf-actions",
      ".p-option-card",
      ".bf-option-card",
      ".p-divider__block",
      ".p-tabs__list",
      ".p-segmented-control__button",
      ".p-breadcrumbs__items",
      ".p-pagination__items",
      ".p-pagination__item--truncation",
      ".p-code-snippet",
      ".p-code-snippet__header",
      ".p-code-snippet__block",
      ".p-code-snippet__block--icon",
      ".p-code-snippet__block--numbered",
      ".p-accordion__tab",
      ".p-accordion__panel",
      ".p-modal__dialog",
      ".p-switch__slider",
      ".p-form-validation__message"
    ].join(", ");

    const rootMeasure = rootRect.height;
    const rootNearest = baselinePx === 0 ? rootMeasure : Math.round(rootMeasure / baselinePx) * baselinePx;
    const rootMeasureErrorPx = Math.abs(rootMeasure - rootNearest);

    const elements = Array.from(captureRoot.querySelectorAll<HTMLElement>("[data-baseline-check]"));
    for (const element of elements) {
      if (element.getClientRects().length === 0) {
        continue;
      }

      const rect = element.getBoundingClientRect();
      const styles = getComputedStyle(element);
      const mode = (element.dataset.baselineCheck === "box" ? "box" : "flow") satisfies CheckMode;
      const marginBottom = Number.parseFloat(styles.marginBottom) || 0;
      const offsetPx = rect.top - rootRect.top;
      const measurePx = mode === "flow" ? rect.height + marginBottom : rect.height;
      const offsetNearest = baselinePx === 0 ? offsetPx : Math.round(offsetPx / baselinePx) * baselinePx;
      const measureNearest = baselinePx === 0 ? measurePx : Math.round(measurePx / baselinePx) * baselinePx;
      const offsetErrorPx = Math.abs(offsetPx - offsetNearest);
      const measureErrorPx = Math.abs(measurePx - measureNearest);
      const label = (element.dataset.baselineLabel ?? "").replace(/\s+/g, " ").trim()
        || (element.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 80)
        || element.tagName.toLowerCase();

      checks.push({
        label,
        mode,
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
      if (element.getClientRects().length === 0) {
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
      .filter(element => !element.classList.contains("component-demo-label"))
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
      const componentReport = await verifyComponentPage(page, origin, componentPage);
      report.push(componentReport);
      console.log(`Verified ${componentPage.name}: ${componentReport.checks.length} checks, ${componentReport.failures.length} failures`);
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
