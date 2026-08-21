(function applyExamplePagePreferencesBeforePaint() {
  const root = document.body;
  if (!root) {
    return;
  }

  const tierStorageKey = "baseline-foundry:living-spec-tier";
  const toneStorageKey = "baseline-foundry:living-spec-tone";
  const tiers = ["editorial", "documentation", "app", "os"];
  const tierClasses = tiers.map(tier => `bf-tier-${tier}`);

  function readStoredPreference(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function detectedTier() {
    return tiers.find(tier => root.classList.contains(`bf-tier-${tier}`)) ?? "editorial";
  }

  const pageTierDefault = root.dataset.pageTierDefault;
  const storedTier = readStoredPreference(tierStorageKey);
  const tier = pageTierDefault && tiers.includes(pageTierDefault)
    ? pageTierDefault
    : storedTier && tiers.includes(storedTier)
      ? storedTier
      : detectedTier();

  root.classList.remove(...tierClasses);
  root.classList.add("bf-theme", `bf-tier-${tier}`);
  root.dataset.bfTier = tier;

  const storedTone = readStoredPreference(toneStorageKey);
  const sourceTone = root.dataset.bfTone === "dark" || root.classList.contains("is-dark") ? "dark" : "light";
  const tone = storedTone === "dark" || storedTone === "light" ? storedTone : sourceTone;

  root.classList.toggle("is-dark", tone === "dark");
  root.classList.toggle("is-light", tone === "light");
  document.documentElement.style.colorScheme = tone;
  root.dataset.examplePreferencesReady = "true";
})();
