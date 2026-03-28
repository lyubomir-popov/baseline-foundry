import { buildThemeFromConfig, buildThemeFromPreset } from "../src/build.ts";
import { presetDescriptions, presetNames } from "../src/presets.ts";
import type { PresetName } from "../src/presets.ts";

async function main(): Promise<void> {
  const arg = process.argv[2];

  if (arg === "--list-presets") {
    console.log("Available presets:");
    for (const name of presetNames) {
      console.log(`  ${name} - ${presetDescriptions[name]}`);
    }
    return;
  }

  if (arg && arg.startsWith("--preset=")) {
    const preset = arg.replace("--preset=", "") as PresetName;
    if (!presetNames.includes(preset)) {
      console.error(`Unknown preset "${preset}". Use --list-presets to see available presets.`);
      process.exit(1);
    }

    const result = await buildThemeFromPreset(preset);
    console.log(`Generated theme preset "${preset}"`);
    console.log(`  tokens: ${result.tokensPath}`);
    console.log(`  css:    ${result.cssPath}`);
    return;
  }

  const defaultResult = await buildThemeFromConfig(arg || undefined);
  console.log(`Generated default theme tokens: ${defaultResult.tokensPath}`);
  console.log(`Generated default theme css: ${defaultResult.cssPath}`);

  if (arg) {
    return;
  }

  for (const preset of presetNames) {
    const presetResult = await buildThemeFromPreset(preset);
    console.log(`Generated preset "${preset}"`);
    console.log(`  tokens: ${presetResult.tokensPath}`);
    console.log(`  css:    ${presetResult.cssPath}`);
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
