import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

interface CommandResult {
  stdout: string;
  stderr: string;
  ok: boolean;
}

interface PreflightOptions {
  allowDirty: boolean;
  allowExistingVersion: boolean;
  expectedRef?: string;
  resume: boolean;
  skipGit: boolean;
}

async function runCommand(command: string, args: string[]): Promise<CommandResult> {
  try {
    const result = await execFileAsync(command, args, {
      cwd: process.cwd(),
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024
    });
    return { stdout: result.stdout, stderr: result.stderr, ok: true };
  } catch (error) {
    const failure = error as { stdout?: string; stderr?: string };
    return { stdout: failure.stdout ?? "", stderr: failure.stderr ?? "", ok: false };
  }
}

async function runNpm(args: string[]): Promise<CommandResult> {
  if (process.env.npm_execpath) {
    return runCommand(process.execPath, [process.env.npm_execpath, ...args]);
  }
  return runCommand("npm", args);
}

function parseOptions(args: string[]): PreflightOptions & { selfTest: boolean } {
  const valueAfter = (flag: string): string | undefined => {
    const index = args.indexOf(flag);
    return index >= 0 ? args[index + 1] : undefined;
  };

  return {
    allowDirty: args.includes("--allow-dirty"),
    allowExistingVersion: args.includes("--allow-existing-version"),
    expectedRef: valueAfter("--expected-ref"),
    resume: args.includes("--resume"),
    selfTest: args.includes("--self-test"),
    skipGit: args.includes("--skip-git")
  };
}

async function readPackageMetadata(): Promise<{
  name: string;
  version: string;
}> {
  const packageJson = JSON.parse(await fs.readFile(path.resolve("package.json"), "utf8")) as {
    name?: string;
    version?: string;
  };
  const packageLock = JSON.parse(await fs.readFile(path.resolve("package-lock.json"), "utf8")) as {
    name?: string;
    version?: string;
    packages?: Record<string, { name?: string; version?: string }>;
  };
  const rootLock = packageLock.packages?.[""];

  if (!packageJson.name || !packageJson.version) {
    throw new Error("package.json must contain a package name and version.");
  }
  if (packageJson.name !== packageLock.name || packageJson.name !== rootLock?.name) {
    throw new Error("package.json and package-lock.json package names do not agree.");
  }
  if (packageJson.version !== packageLock.version || packageJson.version !== rootLock?.version) {
    throw new Error("package.json and package-lock.json versions do not agree.");
  }
  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(packageJson.version)) {
    throw new Error(`Package version is not release-shaped semver: ${packageJson.version}`);
  }

  return { name: packageJson.name, version: packageJson.version };
}

async function registryVersionExists(name: string, version: string): Promise<boolean> {
  const result = await runNpm(["view", `${name}@${version}`, "version", "--json"]);
  if (!result.ok) {
    const failure = `${result.stdout}\n${result.stderr}`;
    if (/\bE404\b|404 Not Found/i.test(failure)) return false;
    throw new Error(`Unable to verify ${name}@${version} against npm: ${failure.trim() || "unknown registry failure"}`);
  }
  try {
    return JSON.parse(result.stdout) === version;
  } catch {
    return result.stdout.trim().replaceAll('"', "") === version;
  }
}

async function latestRegistryVersion(name: string): Promise<string> {
  const result = await runNpm(["view", name, "version", "--json"]);
  if (!result.ok) {
    throw new Error(`Unable to discover the published ${name} version for the negative fixture: ${result.stderr.trim()}`);
  }
  const parsed = JSON.parse(result.stdout) as string;
  if (!parsed) throw new Error(`npm did not return a published version for ${name}.`);
  return parsed;
}

async function validateRegistryVersion(
  name: string,
  version: string,
  options: Pick<PreflightOptions, "allowExistingVersion" | "resume">
): Promise<void> {
  const exists = await registryVersionExists(name, version);
  if (exists && !options.allowExistingVersion && !options.resume) {
    throw new Error(`${name}@${version} already exists on npm.`);
  }
  if (options.resume && !exists) {
    throw new Error(`Cannot resume: ${name}@${version} is not present on npm.`);
  }
}

async function validateGit(version: string, options: PreflightOptions): Promise<void> {
  if (options.skipGit) return;

  const refName = process.env.GITHUB_REF_NAME
    ?? (await runCommand("git", ["branch", "--show-current"])).stdout.trim();
  if (options.expectedRef && refName !== options.expectedRef) {
    throw new Error(`Release ref mismatch: expected ${options.expectedRef}, got ${refName || "detached/unknown"}.`);
  }

  if (!options.allowDirty) {
    const status = await runCommand("git", ["status", "--short"]);
    if (!status.ok || status.stdout.trim().length > 0) {
      throw new Error("Release candidate working tree is not clean.");
    }
  }

  if (options.expectedRef) {
    const head = await runCommand("git", ["rev-parse", "HEAD"]);
    const remote = await runCommand("git", ["rev-parse", `origin/${options.expectedRef}`]);
    if (!head.ok || !remote.ok || head.stdout.trim() !== remote.stdout.trim()) {
      throw new Error(`Release candidate HEAD does not match origin/${options.expectedRef}.`);
    }
  }

  const tag = `v${version}`;
  const localTag = await runCommand("git", ["rev-parse", "--verify", `refs/tags/${tag}`]);
  const remoteTag = await runCommand("git", ["ls-remote", "--tags", "origin", `refs/tags/${tag}`]);
  const tagExists = localTag.ok || remoteTag.stdout.trim().length > 0;

  if (tagExists && !options.resume && !options.allowExistingVersion) {
    throw new Error(`Release tag ${tag} already exists.`);
  }
  if (options.resume && localTag.ok) {
    const head = await runCommand("git", ["rev-parse", "HEAD"]);
    const tagCommit = await runCommand("git", ["rev-list", "-n", "1", tag]);
    if (!tagCommit.ok || tagCommit.stdout.trim() !== head.stdout.trim()) {
      throw new Error(`Existing release tag ${tag} does not point to the candidate commit.`);
    }
  }
}

async function validatePackageContents(): Promise<void> {
  const packed = await runNpm(["pack", "--dry-run", "--json"]);
  if (!packed.ok) throw new Error(`npm pack --dry-run failed: ${packed.stderr.trim()}`);

  const report = JSON.parse(packed.stdout) as Array<{ files?: Array<{ path: string }> }>;
  const files = new Set((report[0]?.files ?? []).map(file => file.path.replaceAll("\\", "/")));
  const required = [
    "LICENSE",
    "README.md",
    "config/foundation-theme.json",
    "dist/index.js",
    "dist/index.d.ts",
    "dist/styles.css",
    "dist/tokens.json",
    "dist/surfaces.json",
    "docs/publishing.md",
    "package.json"
  ];
  for (const file of required) {
    if (!files.has(file)) throw new Error(`Release package is missing required file: ${file}`);
  }

  const forbidden = ["src/", "scripts/", "demo/", "specs/", "tmp/", "npm_recovery_codes.txt"];
  for (const file of files) {
    if (forbidden.some(prefix => file === prefix || file.startsWith(prefix))) {
      throw new Error(`Release package contains forbidden path: ${file}`);
    }
  }
}

async function runPreflight(options: PreflightOptions): Promise<void> {
  const metadata = await readPackageMetadata();
  await validateGit(metadata.version, options);

  await validateRegistryVersion(metadata.name, metadata.version, options);

  await validatePackageContents();
  console.log(`Release preflight passed for ${metadata.name}@${metadata.version}${options.resume ? " (resume)" : ""}.`);
}

async function expectFailure(label: string, options: PreflightOptions, expected: RegExp): Promise<void> {
  try {
    await runPreflight(options);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!expected.test(message)) {
      throw new Error(`${label} failed for the wrong reason: ${message}`);
    }
    console.log(`  ✓ ${label}: rejected before publication`);
    return;
  }
  throw new Error(`${label} unexpectedly passed.`);
}

async function selfTest(): Promise<void> {
  const metadata = await readPackageMetadata();
  const publishedVersion = await latestRegistryVersion(metadata.name);
  try {
    await validateRegistryVersion(metadata.name, publishedVersion, {
      allowExistingVersion: false,
      resume: false
    });
    throw new Error("existing registry version unexpectedly passed.");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!/already exists on npm/.test(message)) {
      throw new Error(`existing registry version failed for the wrong reason: ${message}`);
    }
    console.log(`  ✓ existing registry version (${publishedVersion}): rejected before publication`);
  }
  await expectFailure("ref mismatch", {
    allowDirty: true,
    allowExistingVersion: true,
    expectedRef: "__spec014_ref_mismatch__",
    resume: false,
    skipGit: false
  }, /Release ref mismatch/);
  console.log("Release preflight negative fixtures passed.");
}

const options = parseOptions(process.argv.slice(2));
(options.selfTest ? selfTest() : runPreflight(options)).catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
