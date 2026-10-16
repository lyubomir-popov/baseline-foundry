import { initSpecRuntime } from "../../spec-runtime.js";
import { installBaselineMarker, renderGuides } from "./bucket-guides.js";

const bodyCopy = "Active";
const stylesheet = document.querySelector("#spec-tier-stylesheet");
const tableTrack = document.querySelector("#density-track");
const osTrack = document.querySelector("#density-os-track");
const deferredTrack = document.querySelector("#density-deferred-track");
const markedTargets = new WeakSet();

function tableRow(content, label, { header = false, proposal = false } = {}) {
  const section = header
    ? `<thead><tr data-host-row><th scope="col">${content}</th></tr></thead>`
    : `<tbody><tr data-host-row><td>${content}</td></tr></tbody>`;
  return `<table class="bf-table${proposal ? " density-os-proposal" : ""}" aria-label="${label}">${section}</table>`;
}

const tableSpecimens = [
  ["Plain-text table row · reference", tableRow(`<span data-target>${bodyCopy}</span>`, "Plain text reference row"), "plain"],
  ["Classed inline body · reference parity", tableRow(`<span class="bf-body" data-target>${bodyCopy}</span>`, "Classed inline body reference row"), "plain-inline"],
  ["Boxed Button · automatic table seat", tableRow(`<button class="bf-button" type="button" data-target>Active</button>`, "Table Button row"), "member"],
  ["Disabled Button · state keeps membership", tableRow(`<button class="bf-button" type="button" disabled data-target>Active</button>`, "Disabled table Button row"), "member"],
  ["Icon-only Button · square flow check", tableRow(`<button class="bf-button is-icon" type="button" aria-label="Search" data-target><span class="bf-icon is-search" aria-hidden="true"></span></button>`, "Icon Button row"), "icon"],
  ["Static Chip · automatic table seat", tableRow(`<span class="bf-chip" data-target><span class="bf-chip-value">${bodyCopy}</span></span>`, "Static Chip row"), "member"],
  ["Clickable Chip · action keeps membership", tableRow(`<button class="bf-chip" type="button" data-target><span class="bf-chip-value">Active</span></button>`, "Clickable Chip row"), "member"],
  ["Dismissible Chip · legal sibling action", tableRow(`<span class="bf-chip" data-target><span class="bf-chip-value">Active</span><button class="bf-chip-dismiss" type="button" aria-label="Remove Filter"></button></span>`, "Dismissible Chip row"), "member"],
  ["Header cell Chip · native th host", tableRow(`<span class="bf-chip" data-target><span class="bf-chip-value">Active</span></span>`, "Header Chip row", { header: true }), "member"],
  ["Neutral wrapper · placement preserved", tableRow(`<span data-neutral-wrapper><span class="bf-chip" data-target><span class="bf-chip-value">Active</span></span></span>`, "Neutral wrapper Chip row"), "member"],
  ["Wrapped text input · wrapper owns paint", tableRow(`<span class="bf-field-boundary"><input class="bf-input" type="text" value="Active" aria-label="Status" data-target /></span>`, "Wrapped text input row"), "member"],
  ["Neutral-wrapped input · boundary seat preserved", tableRow(`<span class="bf-field-boundary"><span data-neutral-wrapper><input class="bf-input" type="text" value="Active" aria-label="Neutral wrapped status" data-target /></span></span>`, "Neutral wrapped text input row"), "member"],
  ["Native Select · single-line entry", tableRow(`<span class="bf-field-boundary"><select class="bf-input" aria-label="State" data-target><option>Active</option></select></span>`, "Select row"), "member"],
  ["Two-line plain table row · multiline reference", tableRow(`<span class="bf-body" data-target>First line<br />Second line</span>`, "Two-line plain reference row"), "multiline-reference"],
  ["Textarea · two-line viewport diagnostic", tableRow(`<span class="bf-field-boundary"><textarea class="bf-input" rows="2" aria-label="Notes" data-target>First line\nSecond line</textarea></span>`, "Textarea row"), "multiline"],
  ["Nested product root · table seat resets", tableRow(`<span class="bf-theme density-reset-boundary"><button class="bf-button" type="button" data-target>Reset</button></span>`, "Nested theme reset row"), "reset"],
  ["Standalone Button · product default", `<button class="bf-button" type="button" data-target>Active</button>`, "standalone"],
  ["Standalone Chip · product default", `<span class="bf-chip" data-target><span class="bf-chip-value">Active</span></span>`, "standalone"],
  ["Standalone input · product default", `<span class="bf-field-boundary"><input class="bf-input" type="text" value="Standalone" aria-label="Standalone input" data-target /></span>`, "standalone"]
];

const osSpecimens = [
  ["OS plain-text table row · reference", tableRow(`<span class="bf-body" data-target>${bodyCopy}</span>`, "OS plain text reference row"), "plain"],
  ["OS shipping Button · unchanged", tableRow(`<button class="bf-button" type="button" data-target>Active</button>`, "OS shipping Button row"), "os-shipping"],
  ["OS shipping Chip · unchanged", tableRow(`<span class="bf-chip" data-target><span class="bf-chip-value">Active</span></span>`, "OS shipping Chip row"), "os-shipping"],
  ["OS shipping input · unchanged", tableRow(`<span class="bf-field-boundary"><input class="bf-input" type="text" value="Active" aria-label="OS shipping input" data-target /></span>`, "OS shipping input row"), "os-shipping"],
  ["OS 0-inset proposal · Button", tableRow(`<button class="bf-button" type="button" data-target>Active</button>`, "OS proposed Button row", { proposal: true }), "os-proposal"],
  ["OS 0-inset proposal · Chip", tableRow(`<span class="bf-chip" data-target><span class="bf-chip-value">Active</span></span>`, "OS proposed Chip row", { proposal: true }), "os-proposal"],
  ["OS 0-inset proposal · wrapped input", tableRow(`<span class="bf-field-boundary"><input class="bf-input" type="text" value="Active" aria-label="OS proposed input" data-target /></span>`, "OS proposed input row", { proposal: true }), "os-proposal"]
];

const deferredSpecimens = [
  ["Tabs Chip · deferred diagnostic", `<div class="bf-tabs"><ul class="bf-tabs-list" role="tablist"><li class="bf-tabs-item"><button id="density-tab-1" class="bf-tabs-link" type="button" role="tab" aria-selected="true" aria-controls="density-tabs-panel-1" tabindex="0">Status <span class="bf-chip" data-target>3</span></button></li><li class="bf-tabs-item"><button id="density-tab-2" class="bf-tabs-link" type="button" role="tab" aria-selected="false" aria-controls="density-tabs-panel-2" tabindex="-1">History</button></li></ul><div id="density-tabs-panel-1" class="bf-tabs-panel" role="tabpanel" aria-hidden="false"><p class="bf-body">Selected state.</p></div><div id="density-tabs-panel-2" class="bf-tabs-panel" role="tabpanel" aria-hidden="true"><p class="bf-body">Inactive state.</p></div></div>`, "deferred"],
  ["SideNavigation Chip · deferred diagnostic", `<nav class="bf-panel bf-side-navigation" aria-label="Density navigation"><div class="bf-side-navigation-groups"><section class="bf-side-navigation-group"><div class="bf-side-navigation-group-header"><h3 class="bf-side-navigation-heading">Projects</h3></div><ul class="bf-side-navigation-list"><li class="bf-side-navigation-item" data-host-row><a class="bf-side-navigation-link" href="#"><span class="bf-side-navigation-label">Quarterly review</span><span class="bf-side-navigation-status"><span class="bf-chip is-positive is-nested" data-target>New</span></span></a></li></ul></section></div></nav>`, "deferred"]
];

function createSamples(track, specimens) {
  return specimens.map(([caption, html, kind]) => {
  const sample = document.createElement("article");
  sample.className = "density-sample bucket-sample";
  sample.dataset.baseCaption = caption;
  sample.dataset.kind = kind;
  sample.innerHTML = `<div class="bucket-probe">${html}</div><span class="density-caption">${caption}</span><pre hidden aria-label="Computed density evidence"></pre>`;
  track.append(sample);
  return sample;
  });
}

const tableSamples = createSamples(tableTrack, tableSpecimens);
const osSamples = createSamples(osTrack, osSpecimens);
const deferredSamples = createSamples(deferredTrack, deferredSpecimens);

const px = value => `${Math.round(value * 100) / 100}px`;
const tierName = () => document.body.dataset.bfTier || [...document.body.classList].find(name => name.startsWith("bf-tier-"))?.slice(8) || "unknown";
const bundleVersion = () => stylesheet instanceof HTMLLinkElement && /\/before\//.test(new URL(stylesheet.href).pathname) ? "before" : "after";
const isSupportedProduct = () => ["editorial", "documentation", "app"].includes(tierName());

function syncOsProposalState() {
  const active = tierName() === "os" && bundleVersion() === "after";
  document.body.classList.toggle("density-os-proposal-active", active);
  if (active) document.body.dataset.densityOsProposal = "active";
  else delete document.body.dataset.densityOsProposal;
  return active;
}

function targetSeat(sample, target) {
  const cell = target.closest("td, th");
  const nearestTheme = target.closest(".bf-theme");
  const production = ["member", "icon", "multiline", "os-shipping"].includes(sample.dataset.kind) && bundleVersion() === "after" && Boolean(cell) && nearestTheme === document.body && isSupportedProduct() && !target.closest(".density-os-proposal");
  const proposal = sample.dataset.kind === "os-proposal" && document.body.dataset.densityOsProposal === "active";
  return { cell, production, proposal };
}

function updateCaption(sample, production, proposal) {
  const caption = sample.querySelector(".density-caption");
  const base = sample.dataset.baseCaption;
  if (sample.dataset.kind === "os-proposal") {
    caption.textContent = proposal
      ? `${base} · provisional After-only CSS active`
      : `${base} · inactive outside OS After comparison`;
  } else if (sample.dataset.kind === "os-shipping") {
    caption.textContent = tierName() === "os"
      ? `${base} · ${bundleVersion() === "after" ? "current published default" : "frozen historical bundle"}`
      : `${base} · ordinary ${tierName()} table seat`;
  } else if (["member", "icon", "multiline"].includes(sample.dataset.kind)) {
    caption.textContent = production ? `${base} · enrolled in ${tierName()}` : `${base} · current bundle/product does not enroll`;
  } else {
    caption.textContent = base;
  }
}

function measureTrack(track, samples) {
  const peers = [];
  const referenceRow = samples[0].querySelector("[data-host-row]");
  const referenceHeight = referenceRow?.getBoundingClientRect().height ?? null;
  const multilineReferenceHeight = samples.find(sample => sample.dataset.kind === "multiline-reference")?.querySelector("[data-host-row]")?.getBoundingClientRect().height ?? null;
  for (const sample of samples) {
    const target = sample.querySelector("[data-target]");
    if (!(target instanceof HTMLElement)) continue;
    const { cell, production, proposal } = targetSeat(sample, target);
    updateCaption(sample, production, proposal);
    if (!markedTargets.has(target)) {
      installBaselineMarker(target);
      markedTargets.add(target);
    }
    const owner = sample.querySelector("[data-host-row]") || sample.querySelector("[role=tab]") || sample.querySelector(".bf-side-navigation-item") || target;
    const ownerBox = owner.getBoundingClientRect();
    const targetBox = target.getBoundingClientRect();
    const targetStyle = getComputedStyle(target);
    const cellBox = cell?.getBoundingClientRect() ?? null;
    const cellStyle = cell ? getComputedStyle(cell) : null;
    const rowHeight = sample.querySelector("[data-host-row]")?.getBoundingClientRect().height ?? null;
    const comparisonHeight = sample.dataset.kind === "multiline" ? multilineReferenceHeight : referenceHeight;
    const startClearance = cellBox ? targetBox.top - cellBox.top : null;
    const endClearance = cellBox ? cellBox.bottom - targetBox.bottom : null;
    const selected = targetStyle.getPropertyValue("--bf-density-control-block-inset").trim() || "not exposed";
    const membership = production ? "automatic table-cell member"
      : proposal ? "review-only OS 0-inset proposal"
      : sample.dataset.kind === "reset" ? "reset by nearest nested .bf-theme"
      : sample.dataset.kind === "deferred" ? "deferred Nav/Tabs diagnostic"
      : "product default / outside supported placement";
    const metrics = `loaded bundle ${bundleVersion()}; loaded tier ${tierName()}; ${membership}\n` +
      `host ${cell ? cell.tagName.toLowerCase() : owner.className || owner.tagName.toLowerCase()}; selected member ${selected}; line ${targetStyle.lineHeight}; padding ${targetStyle.paddingBlockStart}/${targetStyle.paddingBlockEnd}; margin ${targetStyle.marginBlockStart}/${targetStyle.marginBlockEnd}\n` +
      `target ${px(targetBox.width)}×${px(targetBox.height)}; host ${px(ownerBox.width)}×${px(ownerBox.height)}; row ${rowHeight === null ? "n/a" : px(rowHeight)}; row delta from ${sample.dataset.kind === "multiline" ? "two-line plain" : "one-line plain"} ${rowHeight === null || comparisonHeight === null ? "n/a" : px(rowHeight - comparisonHeight)}\n` +
      `paint clearance start/end ${startClearance === null ? "n/a" : `${px(startClearance)}/${px(endClearance)}`}; cell padding ${cellStyle ? `${cellStyle.paddingBlockStart}/${cellStyle.paddingBlockEnd}` : "n/a"}; resize ${targetStyle.resize || "n/a"}; scroll ${target.scrollHeight ?? "n/a"}/${target.clientHeight ?? "n/a"}`;
    // Plain text is the row reference, not the padded rectangle of an inline
    // bf-body span. The actual text marker is still measured inside the row.
    peers.push({ sample, target: sample.dataset.kind === "plain" ? owner : target, owner, metrics });
  }
  renderGuides(track, peers, 0);
  const referenceBaseline = Number.parseFloat(samples[0].dataset.guideBaseline);
  for (const sample of samples) {
    const baseline = Number.parseFloat(sample.dataset.guideBaseline);
    const delta = Number.isFinite(baseline) && Number.isFinite(referenceBaseline) ? px(baseline - referenceBaseline) : "unavailable";
    const pre = sample.querySelector("pre");
    const grid = getComputedStyle(document.body, "::after");
    const gridUnit = Number.parseFloat(grid.backgroundSize.split(" ").at(-1));
    const origin = document.body.getBoundingClientRect().top + window.scrollY + Number.parseFloat(grid.top);
    const absoluteBaseline = Number.isFinite(baseline) ? track.getBoundingClientRect().top + window.scrollY + baseline : null;
    const gridDelta = absoluteBaseline !== null && gridUnit > 0
      ? absoluteBaseline - origin - Math.round((absoluteBaseline - origin) / gridUnit) * gridUnit : null;
    sample.dataset.absoluteBaseline = absoluteBaseline === null ? "unavailable" : px(absoluteBaseline);
    sample.dataset.pageGridDelta = gridDelta === null ? "unavailable" : px(gridDelta);
    pre.textContent += `\nbaseline delta from plain-row guide ${delta}; absolute document baseline ${sample.dataset.absoluteBaseline}; page-grid boundary delta ${sample.dataset.pageGridDelta}; marker geometry ${sample.dataset.markerGeometry || "not recorded"}; external rig ${sample.dataset.externalRig || "not used"}`;
  }
}

function measure() {
  syncOsProposalState();
  document.querySelector("#density-table-heading").textContent = tierName() === "os"
    ? "OS shipping table controls · unsupported current-state diagnostic"
    : "Supported table seats and reset boundary";
  measureTrack(tableTrack, tableSamples);
  measureTrack(osTrack, osSamples);
  document.body.dataset.densityMeasuredTier = tierName();
  document.body.dataset.densityMeasuredWidth = String(window.innerWidth);
  for (const sample of deferredSamples) {
    const caption = sample.querySelector(".density-caption");
    caption.textContent = `${sample.dataset.baseCaption} · not part of table-row proof`;
    sample.querySelector("pre").textContent = `loaded bundle ${bundleVersion()}; loaded tier ${tierName()}; deferred current-state diagnostic`;
  }
}

let measurementFrame = 0;
function scheduleMeasure() {
  cancelAnimationFrame(measurementFrame);
  measurementFrame = requestAnimationFrame(() => {
    measurementFrame = requestAnimationFrame(measure);
  });
}

await initSpecRuntime({ initComponents: ({ initTabs }) => initTabs() });
if (stylesheet instanceof HTMLLinkElement) {
  stylesheet.addEventListener("load", () => document.fonts.ready.then(scheduleMeasure));
  new MutationObserver(scheduleMeasure).observe(stylesheet, { attributeFilter: ["href"], attributes: true });
}
new MutationObserver(scheduleMeasure).observe(document.body, { attributeFilter: ["class", "data-bf-tier"], attributes: true });
window.addEventListener("resize", scheduleMeasure, { passive: true });
await document.fonts.ready;
scheduleMeasure();
