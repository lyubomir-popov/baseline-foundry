import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const invalidFullSha = "949c14038437cd03065466c3634601579b10c269";

async function commitExists(commit: string): Promise<boolean> {
  try {
    await execFileAsync("git", ["cat-file", "-e", `${commit}^{commit}`]);
    return true;
  } catch {
    return false;
  }
}

async function sha256(filePath: string): Promise<string> {
  return createHash("sha256").update(await fs.readFile(filePath)).digest("hex");
}

async function main(): Promise<void> {
  const provenance = JSON.parse(await fs.readFile(path.resolve("demo/spec-028/provenance.json"), "utf8")) as {
    before: { sourceCommit: string; bundles: Record<string, string> };
    after: { semanticSourceCommit: string; bundleSourceCommit: string; bundles: Record<string, string> };
  };
  const commits = [provenance.before.sourceCommit, provenance.after.semanticSourceCommit, provenance.after.bundleSourceCommit];
  for (const commit of commits) {
    if (!/^[0-9a-f]{40}$/.test(commit) || !(await commitExists(commit))) {
      throw new Error(`Spec 028 provenance commit is not a local Git commit object: ${commit}`);
    }
  }
  if (await commitExists(invalidFullSha)) {
    throw new Error("The known nonexistent full-SHA breaker unexpectedly resolved as a Git commit.");
  }

  for (const tier of ["editorial", "documentation", "app", "os"] as const) {
    const before = await sha256(path.resolve("demo/spec-028/before", `${tier}.css`));
    const after = await sha256(path.resolve("dist/tiers", tier, "styles.css"));
    if (before !== provenance.before.bundles[tier] || after !== provenance.after.bundles[tier]) {
      throw new Error(`Spec 028 ${tier} bundle hash does not match provenance.`);
    }
  }

  console.log(JSON.stringify({
    afterCommit: provenance.after.bundleSourceCommit,
    invalidFullShaRejected: true,
    sourceCommitsExist: true,
    tiers: 4
  }));
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
