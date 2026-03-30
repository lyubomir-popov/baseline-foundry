/**
 * Build script for app-tier examples.
 *
 * Uses the baseline-foundry build pipeline with the app
 * typography config (Ubuntu Sans, zero nudges, container-owned spacing).
 */
import { buildThemeFromConfig } from "../../src/build.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main(): Promise<void> {
  const configPath = path.resolve(__dirname, "../../config/tiers/app.json");
  const result = await buildThemeFromConfig(configPath, {
    distDir: path.resolve(__dirname, "dist"),
    baselineDir: path.resolve(__dirname, "generated")
  });
  console.log(`App-tier tokens: ${result.tokensPath}`);
  console.log(`App-tier CSS:    ${result.cssPath}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
