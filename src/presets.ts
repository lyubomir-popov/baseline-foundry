import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export type TierName = "editorial" | "documentation" | "app";

export type PresetName = "prose" | "panel" | "app-tier";

export type BuiltInThemeName = TierName | PresetName;

export const tierNames: readonly TierName[] = ["editorial", "documentation", "app"] as const;

export const presetNames: readonly PresetName[] = ["prose", "panel", "app-tier"] as const;

export const tierDescriptions: Record<TierName, string> = {
  editorial: "Editorial first: IBM Plex Sans, element-owned prose rhythm, and the widest baseline-aligned measure.",
  documentation: "Documentation first: IBM Plex Sans with a tighter doc measure, denser gutters, and calmer chapter reading rhythm.",
  app: "Application first: Ubuntu Sans, Canonical-style light chrome, and container-owned spacing under .bf-tier-app."
};

export const presetDescriptions: Record<PresetName, string> = {
  prose: "Legacy editorial alias for the editorial tier output.",
  panel: "Compact UI default: a proportionally reduced 0.75rem-based variant for dense panel surfaces.",
  "app-tier": "Legacy app alias for the app tier output."
};

const tierConfigPaths: Record<TierName, string> = {
  editorial: path.resolve(__dirname, "..", "config", "tiers", "editorial.json"),
  documentation: path.resolve(__dirname, "..", "config", "tiers", "documentation.json"),
  app: path.resolve(__dirname, "..", "config", "tiers", "app.json")
};

const presetConfigPaths: Record<PresetName, string> = {
  prose: tierConfigPaths.editorial,
  panel: path.resolve(__dirname, "..", "config", "presets", "panel.json"),
  "app-tier": tierConfigPaths.app
};

export function isTierName(value: string): value is TierName {
  return tierNames.includes(value as TierName);
}

export function isPresetName(value: string): value is PresetName {
  return presetNames.includes(value as PresetName);
}

export function normalizeBuiltInThemeName(name: BuiltInThemeName): TierName | "panel" {
  if (name === "prose") {
    return "editorial";
  }

  if (name === "app-tier") {
    return "app";
  }

  return name;
}

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
