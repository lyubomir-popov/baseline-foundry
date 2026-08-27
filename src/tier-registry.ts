export const tierNames = ["editorial", "documentation", "app", "os"] as const;

export type TierName = (typeof tierNames)[number];

export const presetNames = ["prose", "app-tier"] as const;

export type PresetName = (typeof presetNames)[number];

export type BuiltInThemeName = TierName | PresetName;

export const tierDescriptions: Record<TierName, string> = {
  editorial: "Editorial first: Ubuntu Sans, container-owned Sites rhythm, and the widest baseline-aligned measure.",
  documentation: "Documentation first: Ubuntu Sans with a tighter doc measure, denser gutters, and calmer chapter reading rhythm.",
  app: "Application first: Ubuntu Sans, container-owned rhythm, denser layout values, and light application chrome.",
  os: "OS first: Ubuntu Sans, metric-derived alignment, compact measure, and dense system-surface geometry."
};

export const presetDescriptions: Record<PresetName, string> = {
  prose: "Legacy editorial alias for the editorial tier output.",
  "app-tier": "Legacy app alias for the app tier output."
};

export function isTierName(value: string): value is TierName {
  return tierNames.includes(value as TierName);
}

export function isPresetName(value: string): value is PresetName {
  return presetNames.includes(value as PresetName);
}

export function normalizeBuiltInThemeName(name: BuiltInThemeName): TierName {
  if (name === "prose") return "editorial";
  if (name === "app-tier") return "app";
  return name;
}
