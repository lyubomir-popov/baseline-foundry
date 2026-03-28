import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export type PresetName = "prose" | "panel";

export const presetNames: readonly PresetName[] = ["prose", "panel"] as const;

export const presetDescriptions: Record<PresetName, string> = {
  prose: "Editorial default: full baseline-aligned prose rhythm with the restrained three-tier scale.",
  panel: "Compact UI default: a proportionally reduced 0.75rem-based variant for dense panel surfaces."
};

export function resolvePresetPath(name: PresetName): string {
  if (name === "prose") {
    return path.resolve(__dirname, "..", "config", "foundation-theme.json");
  }

  return path.resolve(__dirname, "..", "config", "presets", `${name}.json`);
}
