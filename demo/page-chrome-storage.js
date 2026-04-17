// Shared localStorage keys for page-chrome controls.
// All page families read and write the same keys so choices persist across navigation.
const TIER_KEY = "baseline-foundry:living-spec-tier";
const TONE_KEY = "baseline-foundry:living-spec-tone";
const BASELINE_KEY = "baseline-foundry:baseline-grid";

function safeGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures; controls still work for the current page load.
  }
}

export function readStoredTier() {
  return safeGet(TIER_KEY);
}

export function storeTier(tierName) {
  safeSet(TIER_KEY, tierName);
}

export function readStoredTone() {
  return safeGet(TONE_KEY);
}

export function storeTone(tone) {
  safeSet(TONE_KEY, tone);
}

/** Returns "on", "off", or null if the user has never chosen. */
export function readStoredBaseline() {
  return safeGet(BASELINE_KEY);
}

export function storeBaseline(enabled) {
  safeSet(BASELINE_KEY, enabled ? "on" : "off");
}
