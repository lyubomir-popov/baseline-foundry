import fs from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { defineConfig, normalizePath } from "vite";

const themeConfigRoot = normalizePath(path.resolve("config"));
const themeBuildLockPath = path.resolve("tmp", "theme-build.lock");

function shouldWatchThemeConfig(filePath: string): boolean {
  const normalizedFilePath = normalizePath(filePath);
  return normalizedFilePath.startsWith(`${themeConfigRoot}/`) && normalizedFilePath.endsWith(".json");
}

function wait(delayMs: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, delayMs);
  });
}

async function tryAcquireThemeBuildLock(): Promise<boolean> {
  await fs.mkdir(path.dirname(themeBuildLockPath), { recursive: true });

  try {
    const lockHandle = await fs.open(themeBuildLockPath, "wx");
    await lockHandle.close();
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") {
      return false;
    }

    throw error;
  }
}

async function waitForThemeBuildLockRelease(): Promise<void> {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    try {
      await fs.access(themeBuildLockPath);
    } catch {
      return;
    }

    await wait(200);
  }

  throw new Error("Timed out waiting for another theme rebuild to finish.");
}

async function runThemeBuild(): Promise<"rebuilt" | "waited"> {
  const ownsLock = await tryAcquireThemeBuildLock();

  if (!ownsLock) {
    await waitForThemeBuildLockRelease();
    return "waited";
  }

  try {
    await new Promise<void>((resolve, reject) => {
    const child = spawn("npm run build:theme", {
      shell: true,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true
    });
      let output = "";

      child.stdout?.on("data", chunk => {
        output += chunk.toString();
      });

      child.stderr?.on("data", chunk => {
        output += chunk.toString();
      });

      child.once("error", reject);
      child.once("exit", code => {
        if (code === 0) {
          resolve();
          return;
        }

        const errorDetails = output.trim();
        reject(new Error(errorDetails || `npm run build:theme exited with code ${code ?? "unknown"}.`));
      });
    });

    return "rebuilt";
  } finally {
    await fs.rm(themeBuildLockPath, { force: true });
  }
}

function themeConfigWatcherPlugin() {
  let watcherReady = false;
  let buildInFlight: Promise<void> | null = null;
  let pendingBuild = false;
  let debounceTimer: NodeJS.Timeout | null = null;
  let latestChangedFilePath = "";

  return {
    name: "baseline-foundry-theme-config-watcher",
    configureServer(server) {
      const queueBuild = (changedFilePath: string) => {
        if (buildInFlight) {
          pendingBuild = true;
          latestChangedFilePath = changedFilePath;
          return;
        }

        const relativeFilePath = path.relative(process.cwd(), changedFilePath).replace(/\\/g, "/");
        server.config.logger.info(`[baseline-foundry] Rebuilding theme artifacts after ${relativeFilePath}`, {
          clear: false,
          timestamp: true
        });

        buildInFlight = runThemeBuild()
          .then(result => {
            server.ws.send({ type: "full-reload" });
            server.config.logger.info(result === "rebuilt"
              ? "[baseline-foundry] Theme artifacts rebuilt."
              : "[baseline-foundry] Theme artifacts were rebuilt by another running dev server.", {
              clear: false,
              timestamp: true
            });
          })
          .catch(error => {
            server.config.logger.error(`[baseline-foundry] Theme rebuild failed: ${error instanceof Error ? error.message : String(error)}`);
          })
          .finally(() => {
            buildInFlight = null;

            if (!pendingBuild) {
              return;
            }

            pendingBuild = false;
            scheduleBuild(latestChangedFilePath);
          });
      };

      const scheduleBuild = (filePath: string) => {
        latestChangedFilePath = filePath;

        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }

        debounceTimer = setTimeout(() => {
          debounceTimer = null;
          queueBuild(latestChangedFilePath);
        }, 500);
      };

      const handleThemeConfigEvent = (filePath: string) => {
        if (!watcherReady || !shouldWatchThemeConfig(filePath)) {
          return;
        }

        scheduleBuild(filePath);
      };

      server.watcher.once("ready", () => {
        watcherReady = true;
      });
      server.watcher.on("add", handleThemeConfigEvent);
      server.watcher.on("change", handleThemeConfigEvent);
      server.watcher.on("unlink", handleThemeConfigEvent);
    }
  };
}

export default defineConfig({
  plugins: [themeConfigWatcherPlugin()],
  // This repo writes generated theme artifacts into dist/ outside Vite's own build.
  // If emptyOutDir stays enabled, Vite ignores outDir in dev and serves stale CSS.
  build: {
    emptyOutDir: false,
  },
  server: {
    host: "127.0.0.1",
    port: parseInt(process.env.VITE_PORT || "4174", 10),
    strictPort: true,
    open: "/",
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  },
});
