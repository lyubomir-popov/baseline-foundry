import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

type ControlKind = "switch" | "checkbox" | "radio";
type FrameworkKind = "vanilla" | "foundry";

type Measurement = {
  labelTop: number;
  labelHeight: number;
  labelCenter: number;
  labelLineCenter: number;
  labelLineHeight: number;
  labelFontSize: number;
  labelPaddingBlockStart: number;
  labelPaddingInlineStart: number;
  beforeTop: number;
  beforeHeight: number;
  beforeWidth: number;
  beforeCenter: number;
  afterTop: number;
  afterHeight: number;
  afterWidth: number;
  visualTop?: number;
  visualHeight?: number;
  visualCenter?: number;
  centerDelta: number;
};

type CaptureResult = {
  htmlPath: string;
  screenshotPath: string;
  metrics: Record<ControlKind, Measurement>;
};

type Report = {
  vanilla: CaptureResult;
  foundry: CaptureResult;
  summary: string[];
};

type Target = {
  container: string;
  label: string;
  visual?: string;
};

const CONTROL_KINDS: ControlKind[] = ["switch", "checkbox", "radio"];
const workspaceDir = process.cwd();
const outputDir = path.resolve("tmp/vanilla-compare");
const vanillaDir = path.resolve(process.env.VANILLA_FRAMEWORK_PATH ?? "../vanilla-framework");
const vanillaSassCli = path.join(vanillaDir, "node_modules", "sass", "sass.js");
const foundryCssPath = path.resolve("dist/tiers/editorial/styles.css");

function toPosix(filePath: string): string {
  return filePath.split(path.sep).join("/");
}

function toRelativeOutputPath(filePath: string): string {
  return toPosix(path.relative(workspaceDir, filePath));
}

async function assertExists(filePath: string, message: string): Promise<void> {
  try {
    await fs.access(filePath);
  } catch {
    throw new Error(message);
  }
}

async function runNodeScript(scriptPath: string, args: string[], description: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath, ...args], {
      cwd: workspaceDir,
      stdio: ["ignore", "pipe", "pipe"]
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", chunk => {
      stdout += String(chunk);
    });

    child.stderr.on("data", chunk => {
      stderr += String(chunk);
    });

    child.on("error", reject);
    child.on("close", code => {
      if (code === 0) {
        if (stderr.trim()) {
          process.stderr.write(stderr);
        }
        if (stdout.trim()) {
          process.stdout.write(stdout);
        }
        resolve();
        return;
      }

      const details = [stderr.trim(), stdout.trim()].filter(Boolean).join("\n");
      reject(new Error(`${description} failed with exit code ${code}.${details ? `\n${details}` : ""}`));
    });
  });
}

function buildCompareShellCss(): string {
  return `* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  padding: 2rem;
}

.compare-stack {
  display: grid;
  gap: 1.5rem;
  max-width: 42rem;
}

.compare-stack > * {
  margin: 0;
}

.compare-note {
  font-size: 0.875rem;
  opacity: 0.8;
}
`;
}

function buildVanillaScss(): string {
  const vanillaEntry = toPosix(path.relative(outputDir, path.join(vanillaDir, "_index.scss")));
  return `@import "${vanillaEntry}";

@include vanilla;

body {
  background: #171717;
  color: #ffffff;
}

.compare-stack {
  font-family: "Ubuntu", "Segoe UI", system-ui, sans-serif;
}

.compare-stack .p-switch__label,
.compare-stack .p-checkbox__label,
.compare-stack .p-radio__label,
.compare-stack .compare-note {
  color: #ffffff;
}
`;
}

function buildVanillaHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vanilla Control Comparison</title>
  <link rel="stylesheet" href="./vanilla-controls.css">
  <link rel="stylesheet" href="./compare-shell.css">
</head>
<body>
  <section class="compare-stack">
    <p class="compare-note">Vanilla switch and tick elements rendered from the local SCSS source.</p>

    <label class="p-switch" data-control="switch">
      <input type="checkbox" class="p-switch__input" checked aria-label="Toggle baseline grid">
      <span class="p-switch__slider" aria-hidden="true"></span>
      <span class="p-switch__label">Baseline grid</span>
    </label>

    <label class="p-checkbox" data-control="checkbox">
      <input type="checkbox" class="p-checkbox__input" checked aria-label="Show safe area guides">
      <span class="p-checkbox__label">Show safe area guides</span>
    </label>

    <label class="p-radio" data-control="radio">
      <input type="radio" class="p-radio__input" checked aria-label="Keep linked sizing">
      <span class="p-radio__label">Keep linked sizing</span>
    </label>
  </section>
</body>
</html>
`;
}

function buildFoundryHtml(): string {
  const foundryCssHref = toPosix(path.relative(outputDir, foundryCssPath));
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Foundry Control Comparison</title>
  <link rel="stylesheet" href="${foundryCssHref}">
  <link rel="stylesheet" href="./compare-shell.css">
</head>
<body class="bf-theme bf-tier-editorial" data-bf-tone="dark">
  <section class="compare-stack">
    <p class="compare-note">Foundry editorial-tier switch and tick elements rendered from the current package output.</p>

    <label class="bf-switch" data-control="switch">
      <input type="checkbox" class="bf-switch-input" checked aria-label="Toggle baseline grid">
      <span class="bf-switch-slider" aria-hidden="true"></span>
      <span class="bf-switch-label">Baseline grid</span>
    </label>

    <div class="bf-checkbox" data-control="checkbox">
      <input id="compare-checkbox" type="checkbox" class="bf-checkbox-input" checked aria-label="Show safe area guides">
      <label for="compare-checkbox" class="bf-checkbox-label">Show safe area guides</label>
    </div>

    <div class="bf-radio" data-control="radio">
      <input id="compare-radio" type="radio" class="bf-radio-input" checked aria-label="Keep linked sizing">
      <label for="compare-radio" class="bf-radio-label">Keep linked sizing</label>
    </div>
  </section>
</body>
</html>
`;
}

async function writeHarnessFiles(): Promise<{ vanillaHtmlPath: string; foundryHtmlPath: string; }> {
  await fs.mkdir(outputDir, { recursive: true });

  const compareShellPath = path.join(outputDir, "compare-shell.css");
  const vanillaScssPath = path.join(outputDir, "vanilla-controls.scss");
  const vanillaHtmlPath = path.join(outputDir, "vanilla-controls.html");
  const foundryHtmlPath = path.join(outputDir, "foundry-controls.html");

  await Promise.all([
    fs.writeFile(compareShellPath, buildCompareShellCss(), "utf8"),
    fs.writeFile(vanillaScssPath, buildVanillaScss(), "utf8"),
    fs.writeFile(vanillaHtmlPath, buildVanillaHtml(), "utf8"),
    fs.writeFile(foundryHtmlPath, buildFoundryHtml(), "utf8")
  ]);

  return { vanillaHtmlPath, foundryHtmlPath };
}

async function compileVanillaCss(): Promise<void> {
  const vanillaScssPath = path.join(outputDir, "vanilla-controls.scss");
  const vanillaCssPath = path.join(outputDir, "vanilla-controls.css");

  await assertExists(vanillaSassCli, `Missing Sass CLI in ${vanillaDir}. Run package install in the Vanilla repo first.`);
  const previousSilence = process.env.SASS_SILENCE_DEPRECATIONS;
  process.env.SASS_SILENCE_DEPRECATIONS = "import,global-builtin,mixed-decls";

  try {
    await runNodeScript(
      vanillaSassCli,
      ["--quiet-deps", "--silence-deprecation=import,global-builtin,mixed-decls", vanillaScssPath, vanillaCssPath],
      "Vanilla SCSS compilation"
    );
  } finally {
    if (previousSilence === undefined) {
      delete process.env.SASS_SILENCE_DEPRECATIONS;
    } else {
      process.env.SASS_SILENCE_DEPRECATIONS = previousSilence;
    }
  }
}

function targetFor(framework: FrameworkKind, control: ControlKind): Target {
  if (framework === "vanilla") {
    return {
      switch: {
        container: ".p-switch",
        visual: ".p-switch__slider",
        label: ".p-switch__label"
      },
      checkbox: {
        container: ".p-checkbox",
        label: ".p-checkbox__label"
      },
      radio: {
        container: ".p-radio",
        label: ".p-radio__label"
      }
    }[control];
  }

  return {
    switch: {
      container: ".bf-switch",
      visual: ".bf-switch-slider",
      label: ".bf-switch-label"
    },
    checkbox: {
      container: ".bf-checkbox",
      label: ".bf-checkbox-label"
    },
    radio: {
      container: ".bf-radio",
      label: ".bf-radio-label"
    }
  }[control];
}

async function captureFramework(framework: FrameworkKind, htmlPath: string): Promise<CaptureResult> {
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({ viewport: { width: 900, height: 520 } });
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "load" });

    const screenshotPath = path.join(outputDir, `${framework}-controls.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });

    const metrics = {} as Record<ControlKind, Measurement>;
    for (const control of CONTROL_KINDS) {
      const target = targetFor(framework, control);
      metrics[control] = await page.evaluate(({ control, target }) => {
        const container = document.querySelector(target.container);
        const label = document.querySelector(target.label);

        if (!(container instanceof HTMLElement) || !(label instanceof HTMLElement)) {
          throw new Error(`Missing ${control} nodes for ${target.container}`);
        }

        const containerBox = container.getBoundingClientRect();
        const labelBox = label.getBoundingClientRect();
        const labelStyles = getComputedStyle(label);
        const beforeStyles = getComputedStyle(label, "::before");
        const afterStyles = getComputedStyle(label, "::after");
        const labelPaddingBlockStart = Number.parseFloat(labelStyles.paddingBlockStart || "0");
        const result = {
          labelTop: labelBox.top - containerBox.top,
          labelHeight: labelBox.height,
          labelCenter: labelBox.top - containerBox.top + labelBox.height / 2,
          labelLineCenter: labelBox.top - containerBox.top + labelPaddingBlockStart + (Number.parseFloat(labelStyles.lineHeight || "0") / 2),
          labelLineHeight: Number.parseFloat(labelStyles.lineHeight || "0"),
          labelFontSize: Number.parseFloat(labelStyles.fontSize || "0"),
          labelPaddingBlockStart,
          labelPaddingInlineStart: Number.parseFloat(labelStyles.paddingInlineStart || "0"),
          beforeTop: Number.parseFloat(beforeStyles.top || "0"),
          beforeHeight: Number.parseFloat(beforeStyles.height || "0"),
          beforeWidth: Number.parseFloat(beforeStyles.width || "0"),
          beforeCenter: Number.parseFloat(beforeStyles.top || "0") + Number.parseFloat(beforeStyles.height || "0") / 2,
          afterTop: Number.parseFloat(afterStyles.top || "0"),
          afterHeight: Number.parseFloat(afterStyles.height || "0"),
          afterWidth: Number.parseFloat(afterStyles.width || "0")
        };

        if (target.visual) {
          const visual = document.querySelector(target.visual);
          if (!(visual instanceof HTMLElement)) {
            throw new Error(`Missing visual for ${control}`);
          }

          const visualBox = visual.getBoundingClientRect();
          result.visualTop = visualBox.top - containerBox.top;
          result.visualHeight = visualBox.height;
          result.visualCenter = visualBox.top - containerBox.top + visualBox.height / 2;
        }

        result.centerDelta = (result.visualCenter ?? result.beforeCenter) - result.labelLineCenter;
        return result;
      }, { control, target });
    }

    return { htmlPath, screenshotPath, metrics };
  } finally {
    await browser.close();
  }
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function buildSummary(report: Omit<Report, "summary">): string[] {
  return CONTROL_KINDS.map(control => {
    const vanillaMetrics = report.vanilla.metrics[control];
    const foundryMetrics = report.foundry.metrics[control];
    const labelOffsetDelta = foundryMetrics.labelPaddingInlineStart - vanillaMetrics.labelPaddingInlineStart;

    if (control === "switch") {
      const centerDelta = foundryMetrics.centerDelta - vanillaMetrics.centerDelta;
      return [
        `${control}:`,
        `vanilla center delta ${formatNumber(vanillaMetrics.centerDelta)}px`,
        `foundry center delta ${formatNumber(foundryMetrics.centerDelta)}px`,
        `delta-to-vanilla ${formatNumber(centerDelta)}px`
      ].join(" | ");
    }

    return [
      `${control}:`,
      `foundry center delta ${formatNumber(foundryMetrics.centerDelta)}px`,
      `vanilla label inset ${formatNumber(vanillaMetrics.labelPaddingInlineStart)}px`,
      `foundry label inset ${formatNumber(foundryMetrics.labelPaddingInlineStart)}px`,
      `inset delta ${formatNumber(labelOffsetDelta)}px`
    ].join(" | ");
  });
}

async function main(): Promise<void> {
  await assertExists(foundryCssPath, "Missing dist/tiers/editorial/styles.css. Run npm run build first or use npm run compare:controls.");
  await assertExists(vanillaDir, `Missing Vanilla repo at ${vanillaDir}. Set VANILLA_FRAMEWORK_PATH if it lives elsewhere.`);

  const { vanillaHtmlPath, foundryHtmlPath } = await writeHarnessFiles();
  await compileVanillaCss();

  const vanilla = await captureFramework("vanilla", vanillaHtmlPath);
  const foundry = await captureFramework("foundry", foundryHtmlPath);
  const summary = buildSummary({ vanilla, foundry });
  const report: Report = { vanilla, foundry, summary };
  const reportPath = path.join(outputDir, "report.json");

  await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");

  console.log(`Control comparison report written to ${toRelativeOutputPath(reportPath)}`);
  console.log(`Vanilla fixture: ${toRelativeOutputPath(vanilla.htmlPath)}`);
  console.log(`Foundry fixture: ${toRelativeOutputPath(foundry.htmlPath)}`);
  console.log(`Vanilla screenshot: ${toRelativeOutputPath(vanilla.screenshotPath)}`);
  console.log(`Foundry screenshot: ${toRelativeOutputPath(foundry.screenshotPath)}`);
  for (const line of summary) {
    console.log(line);
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});