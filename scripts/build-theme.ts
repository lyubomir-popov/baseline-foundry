import { buildThemeFromConfig, buildThemeFromPreset, buildThemeFromTier } from "../src/build.ts";
import { isPresetName, isTierName, presetDescriptions, presetNames, tierDescriptions, tierNames } from "../src/presets.ts";
import type { PresetName } from "../src/presets.ts";
import type { TierName } from "../src/presets.ts";

async function main(): Promise<void> {
  const arg = process.argv[2];

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
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
