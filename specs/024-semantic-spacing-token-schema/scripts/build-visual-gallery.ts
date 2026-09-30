import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import {
  access,
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { createServer, type Server } from "node:http";
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { chromium, type Browser, type Page } from "playwright";

type PackageName = "ds-global" | "ds-global-form" | "ds-app";
type Product = "site" | "docs" | "app";
type Side = "before" | "after";

type Story = {
  id: string;
  name: string;
  title: string;
  type: string;
};

type Capture = {
  error?: string;
  height?: number;
  path?: string;
  width?: number;
};

type ProductResult = {
  after: Capture;
  before: Capture;
  changedPixels: number;
  diffPath?: string;
  heightDelta?: number;
  product: Product;
  share: number;
  status: "added" | "changed" | "failed" | "removed" | "unchanged";
};

type StoryResult = {
  evidenceOnly: boolean;
  packageName: PackageName;
  products: ProductResult[];
  status: "added" | "changed" | "failed" | "removed" | "unchanged";
  story: Story;
};

type Cli = {
  after: string;
  before: string;
  gate: string;
  look?: string;
  packages: PackageName[];
};

type LookEntry = {
  label: string;
  note: string;
  product: Product;
  story: string;
  variant?: string;
};

const require = createRequire(import.meta.url);
const playwrightCore = require("playwright-core/lib/coreBundle") as {
  utils: {
    getComparator: (
      mimeType: string,
    ) => (
      actual: Buffer,
      expected: Buffer,
      options: Record<string, unknown>,
    ) => null | { diff?: Buffer; errorMessage: string };
  };
};
// Playwright bundles the upstream pixelmatch implementation. Reusing it keeps
// this evidence generator a single source file without changing either repo's
// dependency graph.
const pixelmatch = playwrightCore.utils.getComparator("image/png");

const packagePaths: Record<PackageName, string> = {
  "ds-app": "packages/react/ds-app",
  "ds-global": "packages/react/ds-global",
  "ds-global-form": "packages/react/ds-global-form",
};
const packageIds: Record<PackageName, string> = {
  "ds-app": "@canonical/react-ds-app",
  "ds-global": "@canonical/react-ds-global",
  "ds-global-form": "@canonical/react-ds-global-form",
};
const products: Product[] = ["site", "docs", "app"];
const viewport = { width: 1280, height: 900 };
const forbiddenPorts = new Set([6114, 6115]);
const mimeTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function parseCli(argv: string[]): Cli {
  const values = new Map<string, string>();
  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (!flag?.startsWith("--") || !value) {
      throw new Error(
        "Usage: --gate <name> --before <sha> --after <sha> --packages <comma-list> [--look <json>]",
      );
    }
    values.set(flag.slice(2), value);
  }
  const gate = values.get("gate");
  const before = values.get("before");
  const after = values.get("after");
  const rawPackages = values.get("packages");
  if (!gate || !before || !after || !rawPackages) {
    throw new Error(
      "Required inputs: --gate, --before, --after and --packages",
    );
  }
  if (!/^[a-z0-9-]+$/i.test(gate)) {
    throw new Error(`Invalid gate name: ${gate}`);
  }
  const selected = rawPackages.split(",").map((value) => value.trim());
  const invalid = selected.filter((value) => !(value in packagePaths));
  if (invalid.length > 0 || selected.length === 0) {
    throw new Error(`Unsupported package(s): ${invalid.join(", ")}`);
  }
  return {
    gate,
    before,
    after,
    look: values.get("look"),
    packages: [...new Set(selected)] as PackageName[],
  };
}

// Validated before any build so a bad list fails in seconds, not after capture.
async function readLook(file: string): Promise<LookEntry[]> {
  const parsed = JSON.parse(await readFile(file, "utf8")) as unknown;
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error(`--look must be a non-empty JSON array: ${file}`);
  }
  return parsed.map((entry, index) => {
    const { label, note, product, story, variant } = (entry ?? {}) as Record<
      string,
      unknown
    >;
    if (
      typeof label !== "string" ||
      typeof note !== "string" ||
      typeof story !== "string" ||
      !products.includes(product as Product) ||
      (variant !== undefined && typeof variant !== "string")
    ) {
      throw new Error(
        `--look entry ${index} needs label, story, product (site|docs|app), note and an optional variant`,
      );
    }
    new RegExp(story, "i");
    if (variant !== undefined) new RegExp(variant, "i");
    return { label, note, product: product as Product, story, variant };
  });
}

async function run(
  command: string,
  args: string[],
  cwd: string,
  capture = false,
): Promise<string> {
  return await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env: process.env,
      shell: false,
      stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
      windowsHide: true,
    });
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (chunk) => {
      stdout += String(chunk);
    });
    child.stderr?.on("data", (chunk) => {
      stderr += String(chunk);
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(
          new Error(
            `${command} ${args.join(" ")} failed with exit ${code}\n${stderr}`,
          ),
        );
      }
    });
  });
}

function assertInside(child: string, parent: string): void {
  const relative = path.relative(path.resolve(parent), path.resolve(child));
  if (relative.startsWith("..") || path.isAbsolute(relative) || relative === "") {
    throw new Error(`Refusing unsafe temporary path: ${child}`);
  }
}

function yyyymmdd(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function sha256(content: Buffer | string): string {
  return createHash("sha256").update(content).digest("hex");
}

function shortHash(content: string): string {
  return sha256(content).slice(0, 8);
}

function slug(content: string): string {
  return (
    content
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 90) || "story"
  );
}

async function resolveCommit(repo: string, revision: string): Promise<string> {
  return await run("git", ["rev-parse", `${revision}^{commit}`], repo, true);
}

async function createWorktree(
  pragmaRepo: string,
  worktreePath: string,
  commit: string,
  selectedPackages: PackageName[],
): Promise<void> {
  console.log(`\nCreating temporary Pragma worktree for ${commit}`);
  await run("git", ["worktree", "add", "--detach", worktreePath, commit], pragmaRepo);
  console.log(`Installing dependencies for ${commit}`);
  // Historical snapshots can contain unrelated packages whose prepare builds no
  // longer compile on current tooling. Install the exact worktree without the
  // repo-wide lifecycle build, then build only each requested dependency graph.
  await run("bun", ["install", "--ignore-scripts"], worktreePath);
  for (const packageName of selectedPackages) {
    console.log(`Building dependency closure for ${packageName} at ${commit}`);
    try {
      await run(
        "bunx",
        [
          "lerna",
          "run",
          "build",
          "--scope",
          packageIds[packageName],
          "--include-dependencies",
        ],
        worktreePath,
      );
    } catch (error) {
      console.warn(
        `Dependency build reported a historical package-build failure; the required Storybook build remains authoritative. ${String(error)}`,
      );
    }
    console.log(`Building ${packageName} Storybook at ${commit}`);
    await run(
      "bun",
      ["run", "build:storybook"],
      path.join(worktreePath, packagePaths[packageName]),
    );
  }
}

async function removeWorktree(
  pragmaRepo: string,
  worktreePath: string,
  tempRoot: string,
): Promise<void> {
  assertInside(worktreePath, tempRoot);
  try {
    await access(worktreePath);
  } catch {
    return;
  }
  try {
    await run(
      "git",
      ["worktree", "remove", "--force", worktreePath],
      pragmaRepo,
      true,
    );
  } catch (error) {
    // git refuses to delete a tree it cannot fully empty; delete it and prune the registration.
    console.warn(`Worktree cleanup warning: ${String(error)}`);
    try {
      await rm(worktreePath, { force: true, recursive: true, maxRetries: 3 });
      await run("git", ["worktree", "prune"], pragmaRepo, true);
    } catch (fallbackError) {
      console.warn(`Worktree fallback cleanup failed: ${String(fallbackError)}`);
    }
  }
}

async function listen(server: Server): Promise<number> {
  return await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        reject(new Error("Static server did not expose a TCP port"));
        return;
      }
      resolve(address.port);
    });
  });
}

async function closeServer(server: Server): Promise<void> {
  await new Promise<void>((resolve) => server.close(() => resolve()));
}

async function serveStatic(root: string): Promise<{ port: number; server: Server }> {
  for (;;) {
    const resolvedRoot = path.resolve(root);
    const server = createServer(async (request, response) => {
      try {
        const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
        const decoded = decodeURIComponent(requestUrl.pathname);
        const relative = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");
        let filePath = path.resolve(resolvedRoot, relative);
        const rootRelative = path.relative(resolvedRoot, filePath);
        if (rootRelative.startsWith("..") || path.isAbsolute(rootRelative)) {
          response.writeHead(403).end("Forbidden");
          return;
        }
        const fileStat = await stat(filePath);
        if (fileStat.isDirectory()) {
          filePath = path.join(filePath, "index.html");
        }
        response.writeHead(200, {
          "Cache-Control": "no-store",
          "Content-Type": mimeTypes[path.extname(filePath).toLowerCase()] ??
            "application/octet-stream",
        });
        createReadStream(filePath).pipe(response);
      } catch {
        response.writeHead(404).end("Not found");
      }
    });
    const port = await listen(server);
    if (!forbiddenPorts.has(port)) {
      return { port, server };
    }
    await closeServer(server);
  }
}

async function readStories(storybookRoot: string): Promise<Map<string, Story>> {
  const parsed = JSON.parse(
    await readFile(path.join(storybookRoot, "index.json"), "utf8"),
  ) as { entries?: Record<string, Story> };
  if (!parsed.entries) {
    throw new Error(`No entries in ${path.join(storybookRoot, "index.json")}`);
  }
  return new Map(
    Object.values(parsed.entries)
      .filter((entry) => entry.type !== "docs")
      .map((entry) => [entry.id, entry]),
  );
}

async function captureStory(
  page: Page,
  baseUrl: string,
  story: Story,
  product: Product,
  outputPath: string,
): Promise<Capture> {
  const pageErrors: string[] = [];
  const onPageError = (error: Error) => pageErrors.push(error.message);
  page.on("pageerror", onPageError);
  try {
    const query = new URLSearchParams({
      globals: `context:${product}`,
      id: story.id,
      viewMode: "story",
    });
    await page.goto(`${baseUrl}/iframe.html?${query}`, {
      timeout: 45_000,
      waitUntil: "load",
    });
    // Portalled stories (SidePanel, Modal) leave the root zero-sized, so wait for content, not visibility.
    await page.waitForSelector("#storybook-root", {
      state: "attached",
      timeout: 30_000,
    });
    await page.waitForFunction(
      () =>
        (document.querySelector("#storybook-root")?.childElementCount ?? 0) > 0,
      undefined,
      { timeout: 30_000 },
    );
    await page.evaluate(async () => {
      document.documentElement.style.fontSize = "16px";
      await document.fonts.ready;
    });
    await page.addStyleTag({
      content:
        "*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition:none!important;caret-color:transparent!important}",
    });
    await page.waitForTimeout(150);
    const renderError = await page.evaluate(() => {
      const selectors = [
        "#error-message",
        ".sb-errordisplay",
        "[data-test-id='storyRenderError']",
      ];
      for (const selector of selectors) {
        const element = document.querySelector<HTMLElement>(selector);
        if (element && element.offsetParent !== null) {
          return element.innerText.trim() || `Visible Storybook error: ${selector}`;
        }
      }
      return "";
    });
    if (renderError || pageErrors.length > 0) {
      throw new Error(renderError || pageErrors.join(" | "));
    }
    const dimensions = await page.evaluate(() => ({
      height: Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
      ),
      width: Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
      ),
    }));
    await mkdir(path.dirname(outputPath), { recursive: true });
    await page.screenshot({
      animations: "disabled",
      fullPage: true,
      path: outputPath,
      type: "png",
    });
    return {
      height: dimensions.height,
      path: outputPath,
      width: dimensions.width,
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  } finally {
    page.off("pageerror", onPageError);
  }
}

function isEvidenceOnly(story: Story): boolean {
  return (
    story.id.toLowerCase().endsWith("-comparison") ||
    story.title.trim().toLowerCase() === "comparison" ||
    story.name.trim().toLowerCase() === "comparison"
  );
}

async function compareCaptures(
  before: Capture,
  after: Capture,
  diffPath: string,
): Promise<Pick<ProductResult, "changedPixels" | "diffPath" | "share">> {
  if (!before.path || !after.path || !before.width || !after.width) {
    return { changedPixels: 0, share: 0 };
  }
  const beforeBuffer = await readFile(before.path);
  const afterBuffer = await readFile(after.path);
  const comparison = pixelmatch(afterBuffer, beforeBuffer, {
    comparator: "pixelmatch",
    maxDiffPixels: 0,
    threshold: 0.1,
  });
  if (!comparison) {
    return { changedPixels: 0, share: 0 };
  }
  const changedPixels = Number(
    comparison.errorMessage.match(/([\d,]+) pixels?/)?.[1].replaceAll(",", "") ??
      0,
  );
  const width = Math.max(before.width, after.width);
  const height = Math.max(before.height ?? 0, after.height ?? 0);
  if (!comparison.diff) {
    throw new Error(`Pixelmatch returned no diff for ${diffPath}`);
  }
  await mkdir(path.dirname(diffPath), { recursive: true });
  await writeFile(diffPath, comparison.diff);
  return {
    changedPixels,
    diffPath,
    share: width * height === 0 ? 0 : changedPixels / (width * height),
  };
}

function relativeWebPath(filePath: string, outputRoot: string): string {
  return path.relative(outputRoot, filePath).split(path.sep).join("/");
}

async function capturePackage(
  browser: Browser,
  packageName: PackageName,
  beforeRoot: string,
  afterRoot: string,
  beforeUrl: string,
  afterUrl: string,
  outputRoot: string,
): Promise<StoryResult[]> {
  const beforeStories = await readStories(beforeRoot);
  const afterStories = await readStories(afterRoot);
  const ids = [...new Set([...beforeStories.keys(), ...afterStories.keys()])].sort();
  const context = await browser.newContext({
    colorScheme: "light",
    deviceScaleFactor: 1,
    locale: "en-GB",
    reducedMotion: "reduce",
    viewport,
  });
  const beforePage = await context.newPage();
  const afterPage = await context.newPage();
  const results: StoryResult[] = [];

  try {
    let completed = 0;
    for (const id of ids) {
      const beforeStory = beforeStories.get(id);
      const afterStory = afterStories.get(id);
      const story = afterStory ?? beforeStory;
      if (!story) continue;
      const storyDirectory = `${slug(id)}-${shortHash(id)}`;
      const productResults: ProductResult[] = [];
      for (const product of products) {
        const beforePath = path.join(
          outputRoot,
          "images",
          packageName,
          storyDirectory,
          `${product}-before.png`,
        );
        const afterPath = path.join(
          outputRoot,
          "images",
          packageName,
          storyDirectory,
          `${product}-after.png`,
        );
        const [before, after] = await Promise.all([
          beforeStory
            ? captureStory(beforePage, beforeUrl, beforeStory, product, beforePath)
            : Promise.resolve<Capture>({}),
          afterStory
            ? captureStory(afterPage, afterUrl, afterStory, product, afterPath)
            : Promise.resolve<Capture>({}),
        ]);
        let status: ProductResult["status"];
        let comparison = { changedPixels: 0, share: 0 } as Pick<
          ProductResult,
          "changedPixels" | "diffPath" | "share"
        >;
        if (before.error || after.error) {
          status = "failed";
        } else if (!beforeStory) {
          status = "added";
        } else if (!afterStory) {
          status = "removed";
        } else {
          const diffPath = path.join(
            outputRoot,
            "images",
            packageName,
            storyDirectory,
            `${product}-diff.png`,
          );
          comparison = await compareCaptures(before, after, diffPath);
          status = comparison.diffPath ? "changed" : "unchanged";
        }
        productResults.push({
          after: {
            ...after,
            path: after.path ? relativeWebPath(after.path, outputRoot) : undefined,
          },
          before: {
            ...before,
            path: before.path ? relativeWebPath(before.path, outputRoot) : undefined,
          },
          changedPixels: comparison.changedPixels,
          diffPath: comparison.diffPath
            ? relativeWebPath(comparison.diffPath, outputRoot)
            : undefined,
          heightDelta:
            before.height !== undefined && after.height !== undefined
              ? after.height - before.height
              : undefined,
          product,
          share: comparison.share,
          status,
        });
      }
      const statuses = new Set(productResults.map((result) => result.status));
      const status: StoryResult["status"] = statuses.has("failed")
        ? "failed"
        : !beforeStory
          ? "added"
          : !afterStory
            ? "removed"
            : statuses.has("changed")
              ? "changed"
              : "unchanged";
      results.push({
        evidenceOnly: isEvidenceOnly(story),
        packageName,
        products: productResults,
        status,
        story,
      });
      completed += 1;
      console.log(
        `[${packageName}] ${completed}/${ids.length} ${story.title} / ${story.name}: ${status}`,
      );
    }
  } finally {
    await context.close();
  }
  return results;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function pairId(result: StoryResult, product: Product): string {
  return `pair-${slug(result.packageName)}-${slug(result.story.id)}-${product}-${shortHash(result.story.id)}`;
}

function displayName(result: StoryResult): string {
  return `${result.story.title} / ${result.story.name}`;
}

function renderImage(label: string, imagePath?: string): string {
  if (!imagePath) return `<figure><figcaption>${label}</figcaption><p>Not present.</p></figure>`;
  return `<figure><figcaption>${label}</figcaption><div class="canvas"><img src="${escapeHtml(
    imagePath,
  )}" alt="${escapeHtml(label)}"></div></figure>`;
}

function renderPair(result: StoryResult, pair: ProductResult): string {
  const guide = pair.product === "site" ? { body: 24, unit: 8 } : { body: 20, unit: 4 };
  const metric =
    pair.status === "changed"
      ? `${(pair.share * 100).toFixed(3)}% · ${pair.changedPixels.toLocaleString()} pixels`
      : pair.status;
  const height =
    pair.heightDelta === undefined
      ? "n/a"
      : `${pair.heightDelta >= 0 ? "+" : ""}${pair.heightDelta}px`;
  return `<article class="pair product-${pair.product}" id="${pairId(result, pair.product)}" style="--unit:${guide.unit}px;--body:${guide.body}px">
    <header><div><p class="eyebrow">${escapeHtml(result.packageName)} · ${pair.product}</p><h3>${escapeHtml(displayName(result))}</h3><p>${metric}; rendered-height delta ${height}</p></div><button type="button" onclick="this.closest('.pair').classList.toggle('show-guides')">Toggle 8/4px baseline + 24/20px body-line guides</button></header>
    <div class="triptych">
      ${renderImage("Before", pair.before.path)}
      ${renderImage("After", pair.after.path)}
      ${renderImage("Pixelmatch diff", pair.diffPath)}
    </div>
  </article>`;
}

function findPair(
  results: StoryResult[],
  matcher: RegExp,
  product: Product,
  preference?: RegExp,
): { pair: ProductResult; result: StoryResult } {
  const matches = results.filter((result) => matcher.test(displayName(result)));
  matches.sort((left, right) => {
    const preferred = (value: StoryResult) =>
      preference?.test(displayName(value)) ? 1 : 0;
    const changed = (value: StoryResult) => (value.status === "changed" ? 1 : 0);
    return changed(right) - changed(left) || preferred(right) - preferred(left);
  });
  const result = matches[0];
  const pair = result?.products.find((candidate) => candidate.product === product);
  if (!result || !pair) {
    throw new Error(`No gallery pair matched ${matcher} for ${product}`);
  }
  return { pair, result };
}

function renderGallery(
  cli: Cli,
  beforeCommit: string,
  afterCommit: string,
  results: StoryResult[],
  look?: LookEntry[],
): string {
  const normal = results.filter((result) => !result.evidenceOnly);
  const evidence = results.filter((result) => result.evidenceOnly);
  const counts = cli.packages.map((packageName) => {
    const packageResults = normal.filter((result) => result.packageName === packageName);
    const count = (status: StoryResult["status"]) =>
      packageResults.filter((result) => result.status === status).length;
    return {
      added: count("added"),
      changed: count("changed"),
      failed: count("failed"),
      packageName,
      removed: count("removed"),
      unchanged: count("unchanged"),
    };
  });
  const lookup = (
    label: string,
    matcher: RegExp,
    product: Product,
    detail: string,
    preference?: RegExp,
  ) => {
    const found = findPair(results, matcher, product, preference);
    return `<li><a href="#${pairId(found.result, found.pair.product)}">${escapeHtml(label)}</a> — ${escapeHtml(detail)}</li>`;
  };
  const custom = look?.map((entry) =>
    lookup(
      entry.label,
      new RegExp(entry.story, "i"),
      entry.product,
      entry.note,
      entry.variant === undefined ? undefined : new RegExp(entry.variant, "i"),
    ),
  );
  const whereToLook = (custom ?? [
    lookup(
      "Paragraph and list continuation · Site",
      /text continuation|heading.*comparison/i,
      "site",
      "Look for the added blank body line after paragraphs and list items.",
      /comparison/i,
    ),
    lookup(
      "Form gaps · Docs",
      /patterns\/form|gap owner comparison/i,
      "docs",
      "Options tighten from 8px to 4px; complete fields tighten from 48px to 16px.",
      /spacing contract/i,
    ),
    lookup(
      "Form gaps · App",
      /patterns\/form|gap owner comparison/i,
      "app",
      "Options tighten from 8px to 4px; complete fields tighten from 48px to 16px.",
      /spacing contract/i,
    ),
    lookup("Card padding", /components\/card(?:\s|\/|$)/i, "site", "Check all section edges.", /spacing contract/i),
    lookup("Tile padding", /components\/tile(?:\s|\/|$)/i, "site", "Check header and content edges.", /default/i),
    lookup("Tooltip padding", /components\/tooltip(?:\s|\/|$)/i, "site", "Check the tooltip surface inset.", /default/i),
    lookup("Popover padding", /component\/popover/i, "site", "Check the open popover surface inset.", /open/i),
    lookup("Section", /component\/section/i, "site", "Compare shallow, bordered and gap-scale section geometry.", /gap scale comparison|spacing/i),
    lookup("ColorInput", /subcomponent\/colorinput/i, "docs", "Check the one-sided separator and inherited surface inset.", /field contract/i),
  ]).join("\n");

  const changedPairs = normal
    .flatMap((result) =>
      result.products
        .filter((pair) => pair.status === "changed")
        .map((pair) => ({ pair, result })),
    )
    .sort((left, right) => right.pair.share - left.pair.share);
  const unchangedPairs = normal.flatMap((result) =>
    result.products
      .filter((pair) => pair.status === "unchanged")
      .map((pair) => ({ pair, result })),
  );
  const addedOrRemoved = normal.filter(
    (result) => result.status === "added" || result.status === "removed",
  );
  const failed = normal.filter((result) => result.status === "failed");
  const evidencePairs = evidence.flatMap((result) =>
    result.products.map((pair) => ({ pair, result })),
  );

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Spec 024 ${escapeHtml(cli.gate)} visual gallery</title>
  <style>
    :root{color-scheme:light;font:16px/1.5 system-ui,sans-serif;background:#f4f4f4;color:#111}
    *{box-sizing:border-box}body{margin:0}body>header,main{padding:24px}body>header{background:#111;color:#fff}h1,h2,h3,p{margin-block-start:0}code{overflow-wrap:anywhere}.meta{display:grid;grid-template-columns:repeat(auto-fit,minmax(18rem,1fr));gap:16px}.meta>div,.panel,.pair{background:#fff;color:#111;border:1px solid #bbb;padding:16px}.summary{border-collapse:collapse;width:100%;background:#fff;color:#111}.summary th,.summary td{border:1px solid #bbb;padding:8px;text-align:right}.summary th:first-child,.summary td:first-child{text-align:left}.panel{margin-block:24px}.pair{margin-block:24px;padding:0}.pair>header{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;padding:16px;border-bottom:1px solid #bbb}.pair h3{margin:0}.eyebrow{text-transform:uppercase;letter-spacing:.08em;font-size:.75rem;margin:0 0 4px}.triptych{display:flex;gap:16px;overflow:auto;padding:16px;background:#ddd}.triptych figure{flex:0 0 ${viewport.width}px;margin:0;background:#fff}.triptych figcaption{font-weight:700;padding:8px;border-bottom:1px solid #bbb}.canvas{position:relative;width:${viewport.width}px;min-height:64px;background:#fff}.canvas img{display:block;width:${viewport.width}px;height:auto;max-width:none}.show-guides .canvas::after{content:"";position:absolute;inset:0;pointer-events:none;background-image:repeating-linear-gradient(to bottom,rgba(196,0,0,.42) 0 1px,transparent 1px var(--unit)),repeating-linear-gradient(to bottom,rgba(0,70,190,.55) 0 2px,transparent 2px var(--body))}.list{columns:2;column-gap:32px}.list li{break-inside:avoid;margin-block:4px}.failed{color:#9b1c1c}details{background:#fff;border:1px solid #bbb;padding:12px;margin-block:16px}summary{cursor:pointer;font-weight:700}@media(max-width:800px){.list{columns:1}.pair>header{display:block}.pair button{margin-top:12px}}
  </style>
</head>
<body>
  <header>
    <h1>Spec 024 · ${escapeHtml(cli.gate)} visual gallery</h1>
    <div class="meta">
      <div><strong>Before</strong><br><code>${beforeCommit}</code></div>
      <div><strong>After</strong><br><code>${afterCommit}</code></div>
      <div><strong>Capture</strong><br>Chromium · DPR 1 · 16px root · ${viewport.width}×${viewport.height} viewport · full page</div>
    </div>
    <h2>Coverage</h2>
    <table class="summary"><thead><tr><th>Package</th><th>Changed</th><th>Unchanged</th><th>Added</th><th>Removed</th><th>Failed</th></tr></thead><tbody>
      ${counts.map((count) => `<tr><td>${count.packageName}</td><td>${count.changed}</td><td>${count.unchanged}</td><td>${count.added}</td><td>${count.removed}</td><td>${count.failed}</td></tr>`).join("\n")}
    </tbody></table>
  </header>
  <main>
    <section class="panel"><h2>Where to look</h2><ol>${whereToLook}</ol></section>
    <section><h2>Changed pairs (${changedPairs.length})</h2>${changedPairs.map(({ result, pair }) => renderPair(result, pair)).join("\n") || "<p>None.</p>"}</section>
    <section><h2>Added and removed stories (${addedOrRemoved.length})</h2>${addedOrRemoved.flatMap((result) => result.products.map((pair) => renderPair(result, pair))).join("\n") || "<p>None.</p>"}</section>
    <section><h2>Failed stories (${failed.length})</h2><ul class="failed">${failed.map((result) => `<li>${escapeHtml(result.packageName)} · ${escapeHtml(displayName(result))}<ul>${result.products.filter((pair) => pair.status === "failed").map((pair) => `<li>${pair.product}: ${escapeHtml(pair.before.error ?? pair.after.error ?? "unknown render failure")}</li>`).join("")}</ul></li>`).join("")}</ul>${failed.length === 0 ? "<p>None.</p>" : ""}</section>
    <details><summary>Unchanged pairs (${unchangedPairs.length})</summary>${unchangedPairs.map(({ result, pair }) => renderPair(result, pair)).join("\n") || "<p>None.</p>"}</details>
    <section><h2>Evidence-only stories (${evidence.length})</h2><p>IDs ending in <code>-comparison</code> or titled “Comparison” are separated from coverage.</p>${evidencePairs.map(({ result, pair }) => renderPair(result, pair)).join("\n") || "<p>None.</p>"}</section>
  </main>
</body>
</html>`;
}

async function hashEvidenceFiles(
  outputRoot: string,
  indexPath: string,
  results: StoryResult[],
): Promise<Array<{ bytes: number; path: string; sha256: string }>> {
  const paths = new Set<string>([indexPath]);
  for (const result of results) {
    for (const pair of result.products) {
      for (const filePath of [pair.before.path, pair.after.path, pair.diffPath]) {
        if (filePath) paths.add(path.join(outputRoot, ...filePath.split("/")));
      }
    }
  }
  const files = [];
  for (const filePath of [...paths].sort()) {
    const content = await readFile(filePath);
    files.push({
      bytes: content.byteLength,
      path: relativeWebPath(filePath, outputRoot),
      sha256: sha256(content),
    });
  }
  return files;
}

async function main(): Promise<void> {
  const cli = parseCli(process.argv.slice(2));
  const look = cli.look ? await readLook(cli.look) : undefined;
  const pragmaRepo = path.resolve(
    process.env.PRAGMA_REPO ?? "H:\\WSL_dev_projects\\pragma",
  );
  const evidenceParent = path.resolve(
    process.env.SPEC_024_EVIDENCE_ROOT ?? "H:\\WSL_dev_projects\\temp",
  );
  const outputRoot = path.join(
    evidenceParent,
    `spec-024-${cli.gate}-gallery-${yyyymmdd(new Date())}`,
  );
  const tempRoot = path.join(
    evidenceParent,
    `.spec-024-gallery-worktrees-${process.pid}`,
  );
  const beforeWorktree = path.join(tempRoot, "before");
  const afterWorktree = path.join(tempRoot, "after");
  assertInside(outputRoot, evidenceParent);
  assertInside(tempRoot, evidenceParent);
  await access(path.join(pragmaRepo, ".git"));
  let outputExists = false;
  try {
    const existing = await readdir(outputRoot);
    if (existing.length > 0) {
      throw new Error(`Evidence output already exists and is not empty: ${outputRoot}`);
    }
    outputExists = true;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith("Evidence output already exists")
    ) {
      throw error;
    }
  }
  const beforeCommit = await resolveCommit(pragmaRepo, cli.before);
  const afterCommit = await resolveCommit(pragmaRepo, cli.after);
  await mkdir(tempRoot, { recursive: true });
  const servers: Server[] = [];
  let browser: Browser | undefined;
  try {
    await createWorktree(pragmaRepo, beforeWorktree, beforeCommit, cli.packages);
    await createWorktree(pragmaRepo, afterWorktree, afterCommit, cli.packages);
    if (!outputExists) await mkdir(outputRoot, { recursive: false });
    const served = new Map<string, { port: number; root: string }>();
    for (const side of ["before", "after"] as Side[]) {
      const worktree = side === "before" ? beforeWorktree : afterWorktree;
      for (const packageName of cli.packages) {
        const root = path.join(
          worktree,
          packagePaths[packageName],
          "storybook-static",
        );
        const server = await serveStatic(root);
        servers.push(server.server);
        served.set(`${side}:${packageName}`, { port: server.port, root });
        console.log(`Serving ${side} ${packageName} on ephemeral port ${server.port}`);
      }
    }
    browser = await chromium.launch({ headless: true });
    const results: StoryResult[] = [];
    for (const packageName of cli.packages) {
      const before = served.get(`before:${packageName}`);
      const after = served.get(`after:${packageName}`);
      if (!before || !after) throw new Error(`Missing static server for ${packageName}`);
      results.push(
        ...(await capturePackage(
          browser,
          packageName,
          before.root,
          after.root,
          `http://127.0.0.1:${before.port}`,
          `http://127.0.0.1:${after.port}`,
          outputRoot,
        )),
      );
    }
    const indexPath = path.join(outputRoot, "index.html");
    await writeFile(
      indexPath,
      renderGallery(cli, beforeCommit, afterCommit, results, look),
      "utf8",
    );
    const files = await hashEvidenceFiles(outputRoot, indexPath, results);
    const manifestPath = path.join(outputRoot, "manifest.json");
    const manifest = {
      after: afterCommit,
      before: beforeCommit,
      capture: {
        browser: "Chromium",
        deviceScaleFactor: 1,
        fullPage: true,
        rootFontSize: "16px",
        viewport,
      },
      files,
      gate: cli.gate,
      generatedAt: new Date().toISOString(),
      packages: cli.packages,
      storyCounts: Object.fromEntries(
        cli.packages.map((packageName) => {
          const packageResults = results.filter(
            (result) => result.packageName === packageName && !result.evidenceOnly,
          );
          return [
            packageName,
            Object.fromEntries(
              ["changed", "unchanged", "added", "removed", "failed"].map(
                (status) => [
                  status,
                  packageResults.filter((result) => result.status === status).length,
                ],
              ),
            ),
          ];
        }),
      ),
    };
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    const manifestHash = sha256(await readFile(manifestPath));
    console.log(`\nGallery: ${indexPath}`);
    console.log(`Manifest: ${manifestPath}`);
    console.log(`Manifest SHA-256: ${manifestHash}`);
  } finally {
    if (browser) await browser.close();
    await Promise.all(servers.map(closeServer));
    await removeWorktree(pragmaRepo, beforeWorktree, tempRoot);
    await removeWorktree(pragmaRepo, afterWorktree, tempRoot);
    assertInside(tempRoot, evidenceParent);
    await rm(tempRoot, { force: true, recursive: true });
    try {
      await run("git", ["worktree", "prune"], pragmaRepo, true);
    } catch (error) {
      console.warn(`Worktree prune warning: ${String(error)}`);
    }
  }
}

await main();
