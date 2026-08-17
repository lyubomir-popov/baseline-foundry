import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  isTierName,
  type BuiltInThemeName,
  type PresetName,
  type TierName
} from "./tier-registry.js";

export {
  isPresetName,
  isTierName,
  normalizeBuiltInThemeName,
  presetDescriptions,
  presetNames,
  tierDescriptions,
  tierNames
} from "./tier-registry.js";
export type { BuiltInThemeName, PresetName, TierName } from "./tier-registry.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const tierConfigPaths: Record<TierName, string> = {
  editorial: path.resolve(__dirname, "..", "config", "tiers", "editorial.json"),
  documentation: path.resolve(__dirname, "..", "config", "tiers", "documentation.json"),
  app: path.resolve(__dirname, "..", "config", "tiers", "app.json"),
  os: path.resolve(__dirname, "..", "config", "tiers", "os.json")
};

const presetConfigPaths: Record<PresetName, string> = {
  prose: tierConfigPaths.editorial,
  "app-tier": tierConfigPaths.app
};

export function resolveTierPath(name: TierName): string {
  return tierConfigPaths[name];
}

export function resolvePresetPath(name: PresetName): string {
  return presetConfigPaths[name];
}

export function resolveBuiltInThemePath(name: BuiltInThemeName): string {
  if (isTierName(name)) {
    return resolveTierPath(name);
  }

  return resolvePresetPath(name);
}
