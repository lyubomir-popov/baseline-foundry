import fs from "node:fs/promises";
import path from "node:path";
import { buildThemeFromConfig, buildThemeFromPreset, buildThemeFromTier } from "../src/build.ts";
import { isPresetName, isTierName, presetDescriptions, presetNames, tierDescriptions, tierNames } from "../src/presets.ts";
import type { PresetName } from "../src/presets.ts";
import type { TierName } from "../src/presets.ts";

const experimentBuilds = {
  "ibm-plex-engine-smoke": {
    description: "Large-type engine specimen with IBM Plex Sans and Ubuntu Sans surfaces sharing generated 8rem/4rem heading nudges.",
    configPath: "config/experiments/ibm-plex-engine-smoke.json",
    distDir: "dist/experiments/ibm-plex-engine-smoke",
    baselineDir: "generated/baseline/experiments/ibm-plex-engine-smoke",
    surfaceLabel: "IBM Plex Sans",
    additionalSurfaces: [
      {
        name: "ubuntu-engine-smoke",
        label: "Ubuntu Sans",
        className: "bf-surface-ubuntu-engine-smoke",
        configPath: "config/experiments/ubuntu-engine-smoke.json"
      }
    ]
  }
} as const;

type ExperimentName = keyof typeof experimentBuilds;

function isExperimentName(value: string): value is ExperimentName {
  return value in experimentBuilds;
}

async function removeLegacyPanelArtifacts(): Promise<void> {
  await Promise.all([
    path.resolve("dist", "presets", "panel"),
    path.resolve("generated", "baseline", "panel")
  ].map(targetPath => fs.rm(targetPath, { recursive: true, force: true })));
}

async function main(): Promise<void> {
  const arg = process.argv[2];

  if (arg !== "--list-tiers" && arg !== "--list-presets" && arg !== "--list-experiments") {
    await removeLegacyPanelArtifacts();
  }

  if (arg === "--list-tiers") {
    console.log("Available tiers:");
    for (const name of tierNames) {
      console.log(`  ${name} - ${tierDescriptions[name]}`);
    }
    return;
  }

  if (arg && arg.startsWith("--tier=")) {
    const tier = arg.replace("--tier=", "");
    if (!isTierName(tier)) {
      console.error(`Unknown tier "${tier}". Use --list-tiers to see available tiers.`);
      process.exit(1);
    }

    const result = await buildThemeFromTier(tier as TierName);
    console.log(`Generated theme tier "${tier}"`);
    console.log(`  tokens: ${result.tokensPath}`);
    console.log(`  css:    ${result.cssPath}`);
    console.log(`  surfaces: ${result.surfaceManifestPath}`);
    return;
  }

  if (arg === "--list-presets") {
    console.log("Available presets:");
    for (const name of presetNames) {
      console.log(`  ${name} - ${presetDescriptions[name]}`);
    }
    return;
  }

  if (arg === "--list-experiments") {
    console.log("Available experiments:");
    for (const [name, build] of Object.entries(experimentBuilds)) {
      console.log(`  ${name} - ${build.description}`);
    }
    return;
  }

  if (arg && arg.startsWith("--preset=")) {
    const preset = arg.replace("--preset=", "");
    if (!isPresetName(preset)) {
      console.error(`Unknown preset "${preset}". Use --list-presets to see available presets.`);
      process.exit(1);
    }

    const result = await buildThemeFromPreset(preset as PresetName);
    console.log(`Generated theme preset "${preset}"`);
    console.log(`  tokens: ${result.tokensPath}`);
    console.log(`  css:    ${result.cssPath}`);
    console.log(`  surfaces: ${result.surfaceManifestPath}`);
    return;
  }

  if (arg && arg.startsWith("--experiment=")) {
    const experiment = arg.replace("--experiment=", "");
    if (!isExperimentName(experiment)) {
      console.error(`Unknown experiment "${experiment}". Use --list-experiments to see available experiments.`);
      process.exit(1);
    }

    const build = experimentBuilds[experiment];
    const result = await buildThemeFromConfig(build.configPath, {
      distDir: build.distDir,
      baselineDir: build.baselineDir,
      surfaceLabel: build.surfaceLabel,
      additionalSurfaces: build.additionalSurfaces
    });
    console.log(`Generated experiment "${experiment}"`);
    console.log(`  tokens: ${result.tokensPath}`);
    console.log(`  css:    ${result.cssPath}`);
    console.log(`  surfaces: ${result.surfaceManifestPath}`);
    return;
  }

  const defaultResult = await buildThemeFromConfig(arg || undefined);
  console.log(`Generated default theme tokens: ${defaultResult.tokensPath}`);
  console.log(`Generated default theme css: ${defaultResult.cssPath}`);
  console.log(`Generated default theme surfaces: ${defaultResult.surfaceManifestPath}`);

  if (arg) {
    return;
  }

  for (const tier of tierNames) {
    const tierResult = await buildThemeFromTier(tier);
    console.log(`Generated tier "${tier}"`);
    console.log(`  tokens: ${tierResult.tokensPath}`);
    console.log(`  css:    ${tierResult.cssPath}`);
    console.log(`  surfaces: ${tierResult.surfaceManifestPath}`);
  }

  for (const preset of presetNames) {
    const presetResult = await buildThemeFromPreset(preset);
    console.log(`Generated preset "${preset}"`);
    console.log(`  tokens: ${presetResult.tokensPath}`);
    console.log(`  css:    ${presetResult.cssPath}`);
    console.log(`  surfaces: ${presetResult.surfaceManifestPath}`);
  }

  for (const [name, build] of Object.entries(experimentBuilds)) {
    const experimentResult = await buildThemeFromConfig(build.configPath, {
      distDir: build.distDir,
      baselineDir: build.baselineDir,
      surfaceLabel: build.surfaceLabel,
      additionalSurfaces: build.additionalSurfaces
    });
    console.log(`Generated experiment "${name}"`);
    console.log(`  tokens: ${experimentResult.tokensPath}`);
    console.log(`  css:    ${experimentResult.cssPath}`);
    console.log(`  surfaces: ${experimentResult.surfaceManifestPath}`);
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
