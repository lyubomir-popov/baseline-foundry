import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

type FrameworkKind = "vanilla" | "foundry";
type SurfaceKind = "chip-basic" | "chip-lead" | "chip-badge" | "badge-single" | "badge-wide" | "status-default";

type PartMeasurement = {
  blockSize: number;
  inlineSize: number;
  fontSize: number;
  lineHeight: number;
  fontWeight: string;
  fontVariantCaps: string;
  letterSpacing: string;
  textTransform: string;
};

type SurfaceMeasurement = {
  blockSize: number;
  inlineSize: number;
  borderRadius: number;
  minInlineSize: number;
  paddingBlockStart: number;
  paddingBlockEnd: number;
  paddingInlineStart: number;
  paddingInlineEnd: number;
  marginInlineStart: number;
  marginInlineEnd: number;
  fontSize: number;
  lineHeight: number;
  fontWeight: string;
  fontVariantCaps: string;
  letterSpacing: string;
  textTransform: string;
  contentStartInset: number;
  contentEndInset: number;
  aspectDelta: number;
  badgeGap?: number;
  parts: Partial<Record<"lead" | "value" | "badge", PartMeasurement>>;
};

type CaptureResult = {
  htmlPath: string;
  screenshotPath: string;
  metrics: Record<SurfaceKind, SurfaceMeasurement>;
};

type Report = {
  vanilla: CaptureResult;
  foundry: CaptureResult;
  summary: string[];
  findings: string[];
};

const SURFACE_KINDS: SurfaceKind[] = ["chip-basic", "chip-lead", "chip-badge", "badge-single", "badge-wide", "status-default"];
const workspaceDir = process.cwd();
const outputDir = path.resolve("tmp/vanilla-compare");
const vanillaDir = path.resolve(process.env.VANILLA_FRAMEWORK_PATH ?? "../vanilla-framework");
const vanillaSassCli = path.join(vanillaDir, "node_modules", "sass", "sass.js");
const foundryCssPath = path.resolve("dist/tiers/os/styles.css");

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
  max-width: 44rem;
}

.compare-note {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.8;
}

.compare-group {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
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

.compare-note,
.compare-stack .p-chip__lead,
.compare-stack .p-chip__value,
.compare-stack .p-status-label,
.compare-stack .p-badge {
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
  <title>Vanilla Inline Surface Comparison</title>
  <link rel="stylesheet" href="./vanilla-inline-surfaces.css">
  <link rel="stylesheet" href="./compare-shell.css">
</head>
<body>
  <section class="compare-stack">
    <p class="compare-note">Vanilla chip, badge, and status-label examples rendered from the local SCSS source.</p>

    <div class="compare-group">
      <button class="p-chip" data-surface="chip-basic">
        <span class="p-chip__value" data-part="value">21.10</span>
      </button>

      <button class="p-chip" data-surface="chip-lead">
        <span class="p-chip__lead" data-part="lead">Owner</span>
        <span class="p-chip__value" data-part="value">Bob</span>
      </button>

      <button class="p-chip" data-surface="chip-badge">
        <span class="p-chip__value" data-part="value">Users</span>
        <span class="p-badge" data-part="badge" aria-label="9 users exist">9</span>
      </button>
    </div>

    <div class="compare-group">
      <span class="p-badge" data-surface="badge-single" aria-label="9 items exist">9</span>
      <span class="p-badge" data-surface="badge-wide" aria-label="more than 999 items exist">999+</span>
    </div>

    <div class="compare-group">
      <div class="p-status-label" data-surface="status-default">Default</div>
    </div>
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
  <title>Foundry Inline Surface Comparison</title>
  <link rel="stylesheet" href="${foundryCssHref}">
  <link rel="stylesheet" href="./compare-shell.css">
</head>
<body class="bf-theme" data-bf-tone="dark">
  <section class="compare-stack">
    <p class="compare-note">Foundry OS-tier chip, badge, and status-label examples rendered from the current package output.</p>

    <div class="compare-group">
      <button class="bf-chip" type="button" data-surface="chip-basic">
        <span class="bf-chip-value" data-part="value">21.10</span>
      </button>

      <button class="bf-chip" type="button" data-surface="chip-lead">
        <span class="bf-chip-lead" data-part="lead">Owner</span>
        <span class="bf-chip-value" data-part="value">Bob</span>
      </button>

      <button class="bf-chip" type="button" data-surface="chip-badge">
        <span class="bf-chip-value" data-part="value">Users</span>
        <span class="bf-badge" data-part="badge">9</span>
      </button>
    </div>

    <div class="compare-group">
      <span class="bf-badge" data-surface="badge-single">9</span>
      <span class="bf-badge" data-surface="badge-wide">999+</span>
    </div>

    <div class="compare-group">
      <span class="bf-status-label" data-surface="status-default">Default</span>
    </div>
  </section>
</body>
</html>
`;
}

async function writeHarnessFiles(): Promise<{ vanillaHtmlPath: string; foundryHtmlPath: string; }> {
  await fs.mkdir(outputDir, { recursive: true });

  const compareShellPath = path.join(outputDir, "compare-shell.css");
  const vanillaScssPath = path.join(outputDir, "vanilla-inline-surfaces.scss");
  const vanillaHtmlPath = path.join(outputDir, "vanilla-inline-surfaces.html");
  const foundryHtmlPath = path.join(outputDir, "foundry-inline-surfaces.html");

  await Promise.all([
    fs.writeFile(compareShellPath, buildCompareShellCss(), "utf8"),
    fs.writeFile(vanillaScssPath, buildVanillaScss(), "utf8"),
    fs.writeFile(vanillaHtmlPath, buildVanillaHtml(), "utf8"),
    fs.writeFile(foundryHtmlPath, buildFoundryHtml(), "utf8")
  ]);

  return { vanillaHtmlPath, foundryHtmlPath };
}

async function compileVanillaCss(): Promise<void> {
  const vanillaScssPath = path.join(outputDir, "vanilla-inline-surfaces.scss");
  const vanillaCssPath = path.join(outputDir, "vanilla-inline-surfaces.css");

  await assertExists(vanillaSassCli, `Missing Sass CLI in ${vanillaDir}. Run package install in the Vanilla repo first.`);
  await runNodeScript(
    vanillaSassCli,
    ["--quiet-deps", "--silence-deprecation=import,global-builtin,mixed-decls", vanillaScssPath, vanillaCssPath],
    "Vanilla SCSS compilation"
  );
}

async function captureFramework(framework: FrameworkKind, htmlPath: string): Promise<CaptureResult> {
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({ viewport: { width: 960, height: 520 } });
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "load" });

    const screenshotPath = path.join(outputDir, `${framework}-inline-surfaces.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });

    const metrics = {} as Record<SurfaceKind, SurfaceMeasurement>;
    for (const surface of SURFACE_KINDS) {
      metrics[surface] = await page.evaluate(surfaceName => {
        const surface = document.querySelector(`[data-surface="${surfaceName}"]`);
        if (!(surface instanceof HTMLElement)) {
          throw new Error(`Missing surface ${surfaceName}`);
        }

        const surfaceBox = surface.getBoundingClientRect();
        const styles = getComputedStyle(surface);
        const borderInlineStart = Number.parseFloat(styles.borderInlineStartWidth || "0");
        const borderInlineEnd = Number.parseFloat(styles.borderInlineEndWidth || "0");
        const parts = Array.from(surface.querySelectorAll<HTMLElement>("[data-part]"));
        const firstPart = parts[0];
        const lastPart = parts[parts.length - 1];

        const partMetrics = Object.fromEntries(parts.map(part => {
          const partBox = part.getBoundingClientRect();
          const partStyles = getComputedStyle(part);
          const parsedLineHeight = Number.parseFloat(partStyles.lineHeight || "");
          return [part.dataset.part, {
            blockSize: partBox.height,
            inlineSize: partBox.width,
            fontSize: Number.parseFloat(partStyles.fontSize || "0"),
            lineHeight: Number.isFinite(parsedLineHeight) ? parsedLineHeight : partBox.height,
            fontWeight: partStyles.fontWeight,
            fontVariantCaps: partStyles.fontVariantCaps,
            letterSpacing: partStyles.letterSpacing,
            textTransform: partStyles.textTransform
          }];
        }));

        const parsedSurfaceLineHeight = Number.parseFloat(styles.lineHeight || "");

        const measurement = {
          blockSize: surfaceBox.height,
          inlineSize: surfaceBox.width,
          borderRadius: Number.parseFloat(styles.borderTopLeftRadius || "0"),
          minInlineSize: Number.parseFloat(styles.minInlineSize || "0"),
          paddingBlockStart: Number.parseFloat(styles.paddingBlockStart || "0"),
          paddingBlockEnd: Number.parseFloat(styles.paddingBlockEnd || "0"),
          paddingInlineStart: Number.parseFloat(styles.paddingInlineStart || "0"),
          paddingInlineEnd: Number.parseFloat(styles.paddingInlineEnd || "0"),
          marginInlineStart: Number.parseFloat(styles.marginInlineStart || "0"),
          marginInlineEnd: Number.parseFloat(styles.marginInlineEnd || "0"),
          fontSize: Number.parseFloat(styles.fontSize || "0"),
          lineHeight: Number.isFinite(parsedSurfaceLineHeight) ? parsedSurfaceLineHeight : surfaceBox.height,
          fontWeight: styles.fontWeight,
          fontVariantCaps: styles.fontVariantCaps,
          letterSpacing: styles.letterSpacing,
          textTransform: styles.textTransform,
          contentStartInset: firstPart ? firstPart.getBoundingClientRect().left - surfaceBox.left - borderInlineStart : 0,
          contentEndInset: lastPart ? surfaceBox.right - lastPart.getBoundingClientRect().right - borderInlineEnd : 0,
          aspectDelta: surfaceBox.width - surfaceBox.height,
          parts: partMetrics
        } as SurfaceMeasurement;

        const valuePart = surface.querySelector<HTMLElement>('[data-part="value"]');
        const badgePart = surface.querySelector<HTMLElement>('[data-part="badge"]');
        if (valuePart instanceof HTMLElement && badgePart instanceof HTMLElement) {
          measurement.badgeGap = badgePart.getBoundingClientRect().left - valuePart.getBoundingClientRect().right;
        }

        return measurement;
      }, surface);
    }

    return { htmlPath, screenshotPath, metrics };
  } finally {
    await browser.close();
  }
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return "-";
  }

  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function numericCssValue(value: string, fallback: number): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function withinTolerance(left: number, right: number, tolerance: number): boolean {
  return Math.abs(left - right) <= tolerance;
}

function buildSummary(report: Omit<Report, "summary" | "findings">): string[] {
  const vanillaChip = report.vanilla.metrics["chip-basic"];
  const foundryChip = report.foundry.metrics["chip-basic"];
  const vanillaLead = report.vanilla.metrics["chip-lead"];
  const foundryLead = report.foundry.metrics["chip-lead"];
  const vanillaBadge = report.vanilla.metrics["badge-single"];
  const foundryBadge = report.foundry.metrics["badge-single"];
  const vanillaChipBadge = report.vanilla.metrics["chip-badge"];
  const foundryChipBadge = report.foundry.metrics["chip-badge"];
  const vanillaStatus = report.vanilla.metrics["status-default"];
  const foundryStatus = report.foundry.metrics["status-default"];

  return [
    `chip-basic: | vanilla start/end inset ${formatNumber(vanillaChip.contentStartInset)}/${formatNumber(vanillaChip.contentEndInset)}px | foundry start/end inset ${formatNumber(foundryChip.contentStartInset)}/${formatNumber(foundryChip.contentEndInset)}px | vanilla value ${formatNumber(vanillaChip.parts.value?.fontSize ?? 0)}/${formatNumber(vanillaChip.parts.value?.lineHeight ?? 0)}px | foundry value ${formatNumber(foundryChip.parts.value?.fontSize ?? 0)}/${formatNumber(foundryChip.parts.value?.lineHeight ?? 0)}px`,
    `chip-lead: | vanilla lead ${formatNumber(vanillaLead.parts.lead?.fontSize ?? 0)}/${formatNumber(vanillaLead.parts.lead?.lineHeight ?? 0)}px caps=${vanillaLead.parts.lead?.fontVariantCaps ?? ""} tracking=${vanillaLead.parts.lead?.letterSpacing ?? ""} | foundry lead ${formatNumber(foundryLead.parts.lead?.fontSize ?? 0)}/${formatNumber(foundryLead.parts.lead?.lineHeight ?? 0)}px caps=${foundryLead.parts.lead?.fontVariantCaps ?? ""} tracking=${foundryLead.parts.lead?.letterSpacing ?? ""} transform=${foundryLead.parts.lead?.textTransform ?? ""} | vanilla value ${formatNumber(vanillaLead.parts.value?.fontSize ?? 0)}/${formatNumber(vanillaLead.parts.value?.lineHeight ?? 0)}px | foundry value ${formatNumber(foundryLead.parts.value?.fontSize ?? 0)}/${formatNumber(foundryLead.parts.value?.lineHeight ?? 0)}px`,
    `badge-single: | vanilla size ${formatNumber(vanillaBadge.inlineSize)}x${formatNumber(vanillaBadge.blockSize)}px | foundry size ${formatNumber(foundryBadge.inlineSize)}x${formatNumber(foundryBadge.blockSize)}px | vanilla aspect delta ${formatNumber(vanillaBadge.aspectDelta)}px | foundry aspect delta ${formatNumber(foundryBadge.aspectDelta)}px`,
    `chip-badge: | vanilla badge gap ${formatNumber(vanillaChipBadge.badgeGap ?? 0)}px | foundry badge gap ${formatNumber(foundryChipBadge.badgeGap ?? 0)}px | vanilla badge end inset ${formatNumber(vanillaChipBadge.contentEndInset)}px | foundry badge end inset ${formatNumber(foundryChipBadge.contentEndInset)}px`,
    `status-default: | vanilla label ${formatNumber(vanillaStatus.fontSize)}/${formatNumber(vanillaStatus.lineHeight)}px ${vanillaStatus.textTransform} | foundry label ${formatNumber(foundryStatus.fontSize)}/${formatNumber(foundryStatus.lineHeight)}px ${foundryStatus.textTransform} | vanilla inline padding ${formatNumber(vanillaStatus.paddingInlineStart)}/${formatNumber(vanillaStatus.paddingInlineEnd)}px | foundry inline padding ${formatNumber(foundryStatus.paddingInlineStart)}/${formatNumber(foundryStatus.paddingInlineEnd)}px`
  ];
}

function buildFindings(report: Omit<Report, "summary" | "findings">): string[] {
  const vanillaChip = report.vanilla.metrics["chip-basic"];
  const foundryChip = report.foundry.metrics["chip-basic"];
  const vanillaLead = report.vanilla.metrics["chip-lead"];
  const foundryLead = report.foundry.metrics["chip-lead"];
  const vanillaBadge = report.vanilla.metrics["badge-single"];
  const foundryBadge = report.foundry.metrics["badge-single"];
  const vanillaChipBadge = report.vanilla.metrics["chip-badge"];
  const foundryChipBadge = report.foundry.metrics["chip-badge"];
  const vanillaStatus = report.vanilla.metrics["status-default"];
  const foundryStatus = report.foundry.metrics["status-default"];

  const chipInsetsMatch = withinTolerance(foundryChip.contentStartInset, vanillaChip.contentStartInset, 0.75)
    && withinTolerance(foundryChip.contentEndInset, vanillaChip.contentEndInset, 0.75);
  const chipValueMatch = withinTolerance(foundryChip.parts.value?.fontSize ?? 0, vanillaChip.parts.value?.fontSize ?? 0, 0.5)
    && withinTolerance(foundryChip.parts.value?.lineHeight ?? 0, vanillaChip.parts.value?.lineHeight ?? 0, 0.5);
  const leadCapsMatch = (foundryLead.parts.lead?.fontVariantCaps ?? "normal") === (vanillaLead.parts.lead?.fontVariantCaps ?? "normal");
  const leadTrackingMatch = withinTolerance(
    numericCssValue(foundryLead.parts.lead?.letterSpacing ?? "0", 0),
    numericCssValue(vanillaLead.parts.lead?.letterSpacing ?? "0", 0),
    0.2
  );
  const leadValueMatch = withinTolerance(foundryLead.parts.value?.fontSize ?? 0, vanillaLead.parts.value?.fontSize ?? 0, 0.5)
    && withinTolerance(foundryLead.parts.value?.lineHeight ?? 0, vanillaLead.parts.value?.lineHeight ?? 0, 0.5);
  const badgeWidthClose = withinTolerance(foundryBadge.inlineSize, vanillaBadge.inlineSize, 1);
  const badgeHeightClose = withinTolerance(foundryBadge.blockSize, vanillaBadge.blockSize, 0.5);
  const badgeAspectClose = withinTolerance(foundryBadge.aspectDelta, vanillaBadge.aspectDelta, 1);
  const badgeGapMatch = withinTolerance(foundryChipBadge.badgeGap ?? 0, vanillaChipBadge.badgeGap ?? 0, 0.5);
  const badgeEndInsetClose = withinTolerance(foundryChipBadge.contentEndInset, vanillaChipBadge.contentEndInset, 0.75);
  const statusTypeMatch = withinTolerance(foundryStatus.fontSize, vanillaStatus.fontSize, 0.5)
    && withinTolerance(foundryStatus.lineHeight, vanillaStatus.lineHeight, 0.5);
  const statusPaddingMatch = withinTolerance(foundryStatus.paddingInlineStart, vanillaStatus.paddingInlineStart, 0.5)
    && withinTolerance(foundryStatus.paddingInlineEnd, vanillaStatus.paddingInlineEnd, 0.5);
  const statusCaseMatch = (foundryStatus.textTransform || "none") === (vanillaStatus.textTransform || "none");

  return [
    chipInsetsMatch && chipValueMatch
      ? `Chip padding now matches the Vanilla compact contract: Foundry uses ${formatNumber(foundryChip.contentStartInset)}px/${formatNumber(foundryChip.contentEndInset)}px side insets around ${formatNumber(foundryChip.parts.value?.fontSize ?? 0)}/${formatNumber(foundryChip.parts.value?.lineHeight ?? 0)}px value text, which is in line with the OS-tier target.`
      : `Chip padding still differs from Vanilla: Foundry is at ${formatNumber(foundryChip.contentStartInset)}px/${formatNumber(foundryChip.contentEndInset)}px side insets versus ${formatNumber(vanillaChip.contentStartInset)}/${formatNumber(vanillaChip.contentEndInset)}px in Vanilla.`,
    leadCapsMatch && leadTrackingMatch && leadValueMatch
      ? `Chip lead/value typography now routes through the dedicated compact UI roles: the lead uses real small-caps with ${foundryLead.parts.lead?.letterSpacing ?? "0"} tracking and the value sits on the ${formatNumber(foundryLead.parts.value?.fontSize ?? 0)}/${formatNumber(foundryLead.parts.value?.lineHeight ?? 0)}px small-text line, matching the Vanilla split contract.`
      : `Chip lead/value typography still differs from Vanilla: Foundry lead caps=${foundryLead.parts.lead?.fontVariantCaps ?? "normal"}, tracking ${foundryLead.parts.lead?.letterSpacing ?? "0"}, value ${formatNumber(foundryLead.parts.value?.fontSize ?? 0)}/${formatNumber(foundryLead.parts.value?.lineHeight ?? 0)}px.`,
    badgeWidthClose && badgeHeightClose && badgeAspectClose
      ? `Standalone badge geometry is effectively converged: Foundry's shortest badge is ${formatNumber(foundryBadge.inlineSize)}x${formatNumber(foundryBadge.blockSize)}px versus Vanilla's ${formatNumber(vanillaBadge.inlineSize)}x${formatNumber(vanillaBadge.blockSize)}px, leaving only a small residual aspect delta of ${formatNumber(foundryBadge.aspectDelta)}px.`
      : `Standalone badge geometry still differs from Vanilla: Foundry measures ${formatNumber(foundryBadge.inlineSize)}x${formatNumber(foundryBadge.blockSize)}px versus ${formatNumber(vanillaBadge.inlineSize)}x${formatNumber(vanillaBadge.blockSize)}px in Vanilla.`,
    badgeGapMatch && badgeEndInsetClose
      ? `Nested badge spacing is aligned with the chip contract: Foundry matches Vanilla's ${formatNumber(foundryChipBadge.badgeGap ?? 0)}px badge gap and stays within ${formatNumber(Math.abs(foundryChipBadge.contentEndInset - vanillaChipBadge.contentEndInset))}px on the trailing inset.`
      : badgeGapMatch
        ? `Nested badge spacing now matches the inter-part gap, but the trailing inset remains slightly tighter in Foundry (${formatNumber(foundryChipBadge.contentEndInset)}px versus ${formatNumber(vanillaChipBadge.contentEndInset)}px).`
        : `Nested badge spacing still differs from Vanilla: Foundry keeps ${formatNumber(foundryChipBadge.badgeGap ?? 0)}px of gap versus ${formatNumber(vanillaChipBadge.badgeGap ?? 0)}px in Vanilla.`,
    statusTypeMatch && statusPaddingMatch && statusCaseMatch
      ? `Status labels now match the Vanilla x-small contract: Foundry uses ${formatNumber(foundryStatus.fontSize)}/${formatNumber(foundryStatus.lineHeight)}px text with no uppercase transform and ${formatNumber(foundryStatus.paddingInlineStart)}/${formatNumber(foundryStatus.paddingInlineEnd)}px inline padding.`
      : `Status labels still differ from Vanilla: Foundry uses ${formatNumber(foundryStatus.fontSize)}/${formatNumber(foundryStatus.lineHeight)}px text, transform=${foundryStatus.textTransform || "none"}, and ${formatNumber(foundryStatus.paddingInlineStart)}/${formatNumber(foundryStatus.paddingInlineEnd)}px inline padding.`
  ];
}

async function main(): Promise<void> {
  await assertExists(foundryCssPath, "Missing dist/tiers/os/styles.css. Run npm run build first or use npm run compare:inline-surfaces.");
  await assertExists(vanillaDir, `Missing Vanilla repo at ${vanillaDir}. Set VANILLA_FRAMEWORK_PATH if it lives elsewhere.`);

  const { vanillaHtmlPath, foundryHtmlPath } = await writeHarnessFiles();
  await compileVanillaCss();

  const vanilla = await captureFramework("vanilla", vanillaHtmlPath);
  const foundry = await captureFramework("foundry", foundryHtmlPath);
  const summary = buildSummary({ vanilla, foundry });
  const findings = buildFindings({ vanilla, foundry });
  const report: Report = { vanilla, foundry, summary, findings };
  const reportPath = path.join(outputDir, "inline-surfaces-report.json");

  await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");

  console.log(`Inline surface comparison report written to ${toRelativeOutputPath(reportPath)}`);
  console.log(`Vanilla fixture: ${toRelativeOutputPath(vanilla.htmlPath)}`);
  console.log(`Foundry fixture: ${toRelativeOutputPath(foundry.htmlPath)}`);
  console.log(`Vanilla screenshot: ${toRelativeOutputPath(vanilla.screenshotPath)}`);
  console.log(`Foundry screenshot: ${toRelativeOutputPath(foundry.screenshotPath)}`);
  console.log("Summary:");
  for (const line of summary) {
    console.log(line);
  }
  console.log("Findings:");
  for (const line of findings) {
    console.log(line);
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});