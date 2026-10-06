const bundleLink = document.querySelector("#review-bundle");
const canvas = document.querySelector("[data-review-canvas]");
const tierSelect = document.querySelector("[data-review-tier-select]");
const toneSelect = document.querySelector("[data-review-tone-select]");
const widthSelect = document.querySelector("[data-review-width-select]");
const baselineToggle = document.querySelector("[data-review-baseline]");
const boxToggle = document.querySelector("[data-review-boxes]");
const status = document.querySelector("[data-review-status]");
const controls = document.querySelector(".review-controls");
const provenance = await fetch("./provenance.json", { cache: "no-store" }).then(response => response.json());
let updateSequence = 0;

if (!(bundleLink instanceof HTMLLinkElement) || !(canvas instanceof HTMLElement) || !(controls instanceof HTMLElement) || !(tierSelect instanceof HTMLSelectElement) || !(toneSelect instanceof HTMLSelectElement) || !(widthSelect instanceof HTMLSelectElement) || !(baselineToggle instanceof HTMLInputElement) || !(boxToggle instanceof HTMLInputElement) || !(status instanceof HTMLOutputElement)) {
  throw new Error("Spec 028 review controls are incomplete.");
}

const specimens = canvas.innerHTML;
const domSignature = await sha256(new TextEncoder().encode(specimens));
document.querySelector("[data-review-dom]").textContent = `identical specimen DOM sha256 ${domSignature}`;

function bundleHref(version, tier) {
  return version === "before" ? `./before/${tier}.css` : `../../dist/tiers/${tier}/styles.css`;
}

async function sha256(bytes) {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}

function activeVersion() {
  return document.querySelector("input[name='version']:checked")?.value ?? "before";
}

function updateTone() {
  document.body.classList.toggle("is-dark", toneSelect.value === "dark");
  document.body.classList.toggle("is-light", toneSelect.value === "light");
}

function updateDiagnostics() {
  canvas.classList.toggle("is-mobile", widthSelect.value === "mobile");
  canvas.classList.toggle("show-baselines", baselineToggle.checked);
  canvas.classList.toggle("show-boxes", boxToggle.checked);
}

async function updateBundle() {
  const sequence = ++updateSequence;
  const version = activeVersion();
  const tier = tierSelect.value;
  const href = bundleHref(version, tier);
  status.value = "Loading bundle…";
  const targetUrl = new URL(href, window.location.href).href;
  if (bundleLink.href !== targetUrl) {
    const loaded = new Promise((resolve, reject) => {
      bundleLink.addEventListener("load", resolve, { once: true });
      bundleLink.addEventListener("error", reject, { once: true });
    });
    bundleLink.href = href;
    await loaded;
  }
  const response = await fetch(href, { cache: "no-store", headers: { Accept: "text/css" } });
  const bytes = new Uint8Array(await response.arrayBuffer());
  const actualHash = await sha256(bytes);
  if (sequence !== updateSequence) return;
  const expectedHash = provenance[version].bundles[tier];
  const markupUnchanged = canvas.innerHTML === specimens;
  document.body.dataset.reviewVersion = version;
  document.body.dataset.reviewTier = tier;
  document.querySelector("[data-review-label]").textContent = `${version === "before" ? "Before" : "After"} · ${tier}`;
  document.querySelector("[data-review-source]").textContent = version === "before"
    ? `source ${provenance.before.sourceCommit}`
    : `semantic ${provenance.after.semanticSourceCommit} · bundle ${provenance.after.bundleSourceCommit}`;
  document.querySelector("[data-review-hash]").textContent = `${actualHash} · ${response.headers.get("content-type")}`;
  status.value = actualHash === expectedHash && markupUnchanged ? "PASS · bundle + identical DOM" : "FAIL · provenance or DOM";
  runNegativeChecks();
}

function runNegativeChecks() {
  const popup = document.querySelector("[data-review-popup]");
  const following = document.querySelector("[data-review-following-card]");
  const owner = document.querySelector("[data-containing-owner]");
  const child = document.querySelector("[data-containing-child]");
  if (!(popup instanceof HTMLElement) || !(following instanceof HTMLElement) || !(owner instanceof HTMLElement) || !(child instanceof HTMLElement)) return;
  const popupRect = popup.getBoundingClientRect();
  const followingRect = following.getBoundingClientRect();
  const ownerRect = owner.getBoundingClientRect();
  const childRect = child.getBoundingClientRect();
  const visible = popupRect.bottom > 0 && popupRect.top < innerHeight && followingRect.bottom > 0 && followingRect.top < innerHeight;
  if (!visible) {
    canvas.dataset.popupCheck = "not-measured";
    canvas.dataset.containingBlockCheck = "not-measured";
    return;
  }
  const overlap = Math.max(0, Math.min(popupRect.bottom, followingRect.bottom) - Math.max(popupRect.top, followingRect.top));
  const popupHit = overlap > 0 && document.elementFromPoint(popupRect.left + 8, Math.max(popupRect.top, followingRect.top) + 2)?.closest("[data-review-popup]") === popup;
  const anchored = childRect.top >= ownerRect.top && childRect.right <= ownerRect.right + 1;
  canvas.dataset.popupCheck = popupHit ? "pass" : "fail";
  canvas.dataset.containingBlockCheck = anchored ? "pass" : "fail";
}

for (const radio of document.querySelectorAll("input[name='version']")) radio.addEventListener("change", updateBundle);
tierSelect.addEventListener("change", updateBundle);
toneSelect.addEventListener("change", updateTone);
widthSelect.addEventListener("change", updateDiagnostics);
baselineToggle.addEventListener("change", updateDiagnostics);
boxToggle.addEventListener("change", updateDiagnostics);
window.addEventListener("resize", runNegativeChecks);
window.addEventListener("scroll", runNegativeChecks, { passive: true });
new ResizeObserver(() => document.documentElement.style.setProperty("--review-controls-height", `${controls.getBoundingClientRect().height}px`)).observe(controls);

updateTone();
updateDiagnostics();
await updateBundle();
