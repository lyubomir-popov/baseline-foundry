import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

function valueAfter(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  let tarball = valueAfter(args, "--tarball");
  const requestedVersion = valueAfter(args, "--version");
  const sourcePackage = JSON.parse(await fs.readFile(path.resolve("package.json"), "utf8")) as {
    name: string;
    version: string;
  };
  const expectedVersion = requestedVersion ?? sourcePackage.version;
  let packRoot: string | undefined;
  if (args.includes("--pack-current")) {
    packRoot = await fs.mkdtemp(path.join(os.tmpdir(), "baseline-foundry-pack-"));
    const npmArgs = ["pack", "--json", "--pack-destination", packRoot];
    const npmExecutable = process.env.npm_execpath ? process.execPath : "npm";
    const npmExecutableArgs = process.env.npm_execpath ? [process.env.npm_execpath, ...npmArgs] : npmArgs;
    const packed = await execFileAsync(npmExecutable, npmExecutableArgs, {
      cwd: process.cwd(),
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024
    });
    const report = JSON.parse(packed.stdout) as Array<{ filename: string }>;
    tarball = path.join(packRoot, report[0]?.filename ?? "");
  }
  const installSpec = tarball ? path.resolve(tarball) : `${sourcePackage.name}@${expectedVersion}`;
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "baseline-foundry-package-"));

  try {
    await fs.writeFile(path.join(tempRoot, "package.json"), JSON.stringify({ private: true, type: "module" }), "utf8");
    const npmArgs = ["install", "--ignore-scripts", "--no-audit", "--no-fund", installSpec];
    const npmExecutable = process.env.npm_execpath ? process.execPath : "npm";
    const npmExecutableArgs = process.env.npm_execpath ? [process.env.npm_execpath, ...npmArgs] : npmArgs;
    await execFileAsync(npmExecutable, npmExecutableArgs, {
      cwd: tempRoot,
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024
    });

    const packageRoot = path.join(tempRoot, "node_modules", sourcePackage.name);
    const installedPackage = JSON.parse(await fs.readFile(path.join(packageRoot, "package.json"), "utf8")) as {
      version: string;
      exports: Record<string, unknown>;
    };
    if (installedPackage.version !== expectedVersion) {
      throw new Error(`Installed ${installedPackage.version}; expected ${expectedVersion}.`);
    }

    for (const forbidden of ["src", "scripts", "demo", "specs", "tmp", "npm_recovery_codes.txt"]) {
      try {
        await fs.access(path.join(packageRoot, forbidden));
        throw new Error(`Installed package contains forbidden path: ${forbidden}`);
      } catch (error) {
        if (error instanceof Error && error.message.startsWith("Installed package")) throw error;
      }
    }

    const smokeScript = `
      import fs from "node:fs/promises";
      import { fileURLToPath } from "node:url";
      const assert = (condition, message) => { if (!condition) throw new Error(message); };
      const root = await import("baseline-foundry");
      const build = await import("baseline-foundry/build");
      const presets = await import("baseline-foundry/presets");
      const types = await import("baseline-foundry/types");
      assert(Object.keys(root).length === 30, "Expected 30 root runtime exports.");
      assert(typeof build.buildThemeFromConfig === "function", "Expected public build API.");
      assert(Array.isArray(presets.tierNames) && presets.tierNames.length === 4, "Expected four-tier preset registry.");
      assert(typeof types === "object", "Expected public types runtime module.");
      const assets = [
        "styles.css", "tokens.json", "surfaces.json",
        "tiers/editorial.css", "tiers/documentation.css", "tiers/app.css", "tiers/os.css",
        "tiers/editorial.tokens.json", "tiers/documentation.tokens.json", "tiers/app.tokens.json", "tiers/os.tokens.json",
        "tiers/editorial.surfaces.json", "tiers/documentation.surfaces.json", "tiers/app.surfaces.json", "tiers/os.surfaces.json",
        "presets/prose.css", "presets/app-tier.css",
        "presets/prose.tokens.json", "presets/app-tier.tokens.json",
        "presets/prose.surfaces.json", "presets/app-tier.surfaces.json"
      ];
      for (const asset of assets) {
        const resolved = import.meta.resolve("baseline-foundry/" + asset);
        await fs.access(fileURLToPath(resolved));
      }
      console.log(JSON.stringify({ rootExports: Object.keys(root).length, assets: assets.length }));
    `;
    const smoke = await execFileAsync(process.execPath, ["--input-type=module", "--eval", smokeScript], {
      cwd: tempRoot,
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024
    });
    const result = JSON.parse(smoke.stdout.trim()) as { rootExports: number; assets: number };
    console.log(`Clean package verification passed for ${sourcePackage.name}@${expectedVersion}: ${result.rootExports} root exports, ${result.assets} asset entry points.`);
  } finally {
    const resolvedTemp = path.resolve(tempRoot);
    const resolvedSystemTemp = path.resolve(os.tmpdir());
    if (!resolvedTemp.startsWith(`${resolvedSystemTemp}${path.sep}`)) {
      throw new Error(`Refusing to remove unexpected temporary path: ${resolvedTemp}`);
    }
    await fs.rm(resolvedTemp, { recursive: true, force: true });
    if (packRoot) {
      const resolvedPackRoot = path.resolve(packRoot);
      if (!resolvedPackRoot.startsWith(`${resolvedSystemTemp}${path.sep}`)) {
        throw new Error(`Refusing to remove unexpected pack path: ${resolvedPackRoot}`);
      }
      await fs.rm(resolvedPackRoot, { recursive: true, force: true });
    }
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
