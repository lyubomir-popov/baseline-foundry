import { initSpecRuntime } from "../../spec-runtime.js";
import { installBaselineMarker, renderGuides } from "./bucket-guides.js";

const bodyCopy = "Active";
function tableRow(content, label) {
  return `<table class="bf-table" aria-label="${label}"><tbody><tr data-host-row><td>${content}</td></tr></tbody></table>`;
}
const specimens = [
  ["Plain-text table row · reference", tableRow(`<span class="bf-body" data-target>${bodyCopy}</span>`, "Plain text reference row"), "plain"],
  ["Site table-cell Chip · enrolled subscriber", tableRow(`<span class="bf-chip" data-target data-chip>Active</span>`, "Table cell Chip subscriber"), "subscriber"],
  ["Button beside Site table-cell Chip · provider non-subscriber", tableRow(`<button class="bf-button" type="button" data-target data-button>Action</button> <span class="bf-chip" data-chip>Active</span>`, "Button beside table cell Chip"), "table-button"],
  ["Standalone Button · non-subscriber", `<button class="bf-button" type="button" data-target data-button>Action</button>`, "standalone-button"],
  ["Nested theme boundary · subscription reset", tableRow(`<span class="bf-theme density-reset-boundary"><span class="bf-chip" data-target data-chip>Reset boundary</span></span>`, "Nested theme reset boundary"), "reset"],
  ["Standalone Chip · non-subscriber", `<span class="bf-chip" data-target data-chip>Standalone</span>`, "standalone"],
  ["Tabs-hosted Chip · current non-subscriber", `<div class="bf-tabs"><ul class="bf-tabs-list" role="tablist"><li class="bf-tabs-item"><button id="density-tab-1" class="bf-tabs-link" type="button" role="tab" aria-selected="true" aria-controls="density-tabs-panel-1" tabindex="0">Status <span class="bf-chip" data-target data-chip>3</span></button></li><li class="bf-tabs-item"><button id="density-tab-2" class="bf-tabs-link" type="button" role="tab" aria-selected="false" aria-controls="density-tabs-panel-2" tabindex="-1">History</button></li></ul><div id="density-tabs-panel-1" class="bf-tabs-panel" role="tabpanel" aria-hidden="false"><p class="bf-body">Selected state.</p></div><div id="density-tabs-panel-2" class="bf-tabs-panel" role="tabpanel" aria-hidden="true"><p class="bf-body">Inactive state.</p></div></div>`, "tabs"],
  ["SideNavigation Chip · current non-subscriber", `<nav class="bf-panel bf-side-navigation" aria-label="Density navigation"><div class="bf-side-navigation-groups"><section class="bf-side-navigation-group"><div class="bf-side-navigation-group-header"><h3 class="bf-side-navigation-heading">Projects</h3></div><ul class="bf-side-navigation-list"><li class="bf-side-navigation-item" data-host-row><a class="bf-side-navigation-link" href="#"><span class="bf-side-navigation-label">Quarterly review</span><span class="bf-side-navigation-status"><span class="bf-chip is-positive is-nested" data-target data-chip>New</span></span></a></li></ul></section></div></nav>`, "navigation"]
];

const track = document.querySelector("#density-track");
const samples = [];
for (const [caption, html, kind] of specimens) {
  const sample = document.createElement("article");
  sample.className = "density-sample bucket-sample";
  sample.dataset.caption = caption;
  sample.dataset.kind = kind;
  sample.innerHTML = `<div class="bucket-probe">${html}</div><span class="density-caption">${caption}</span><pre hidden aria-label="Computed density evidence"></pre>`;
  track.append(sample);
  samples.push(sample);
}

const px = value => `${Math.round(value * 100) / 100}px`;
const tierName = () => [...document.body.classList].find(name => name.startsWith("bf-tier-"))?.slice(8) || "unknown";
function measure() {
  const peers = [];
  const referenceRow = samples[0].querySelector("[data-host-row]");
  const referenceRowHeight = referenceRow?.getBoundingClientRect().height ?? null;
  const tableButtonSize = samples.find(sample => sample.dataset.kind === "table-button")?.querySelector("[data-button]")?.getBoundingClientRect();
  for (const sample of samples) {
    const target = sample.querySelector("[data-target]");
    const chip = sample.querySelector(".bf-chip");
    const button = sample.querySelector("[data-button]");
    const tableCell = chip?.closest(".bf-table td");
    const themeRoot = chip?.closest(".bf-theme");
    const siteSubscriber = tierName() === "editorial" && Boolean(tableCell) && themeRoot === document.body;
    if (target && !target.querySelector(".bucket-baseline-marker")) installBaselineMarker(target);
    const owner = sample.querySelector("[data-host-row]") || sample.querySelector("[role=tab]") || sample.querySelector(".bf-side-navigation-item") || chip || target;
    const ownerRect = owner?.getBoundingClientRect();
    const chipRect = chip?.getBoundingClientRect();
    const buttonRect = button?.getBoundingClientRect();
    const chipStyle = chip ? getComputedStyle(chip) : null;
    const hostRowHeight = sample.querySelector("[data-host-row]")?.getBoundingClientRect().height ?? null;
    const heightDelta = hostRowHeight !== null && referenceRowHeight !== null ? hostRowHeight - referenceRowHeight : null;
    const textNudge = chipStyle?.getPropertyValue("--bf-body-nudge-start").trim() || "not exposed";
    const textCompensation = chipStyle?.getPropertyValue("--bf-body-margin-bottom").trim() || "not exposed";
    const chipMarginEnd = chipStyle?.marginBlockEnd || "n/a";
    const occupiedChipBlock = chipRect ? chipRect.height + (Number.parseFloat(chipMarginEnd) || 0) : null;
    const defaultInset = chipStyle?.getPropertyValue("--bf-control-block-inset").trim() || "not exposed";
    const denseInset = chipStyle?.getPropertyValue("--bf-control-block-inset-dense").trim() || "not exposed";
    const selectedInset = chipStyle?.getPropertyValue("--bf-density-control-block-inset").trim() || "not exposed";
    const subscriber = chip
      ? siteSubscriber ? "yes · Site table-cell Chip" : "no · current host does not enroll this Chip"
      : button ? tableCell ? "no · Button is a sibling of the enrolled Chip, not the subscriber" : "no · standalone Button"
        : "not applicable · plain-text row";
    const reset = sample.dataset.kind === "reset" ? "yes · nested .bf-theme boundary" : "no";
    const metrics = `viewport ${window.innerWidth}px; tier ${tierName()}; sample ${sample.dataset.caption}\n` +
      `subscriber ${subscriber}; reset boundary ${reset}; host ${sample.dataset.kind === "plain" ? ".bf-table td reference" : tableCell ? ".bf-table td" : chip?.closest(".bf-tabs") ? ".bf-tabs" : chip?.closest(".bf-side-navigation") ? ".bf-side-navigation" : button ? "standalone button" : "standalone"}\n` +
      `control inset default ${defaultInset}; dense member ${denseInset}; selected member ${selectedInset}; Chip line-height ${chipStyle?.lineHeight || "n/a"}; padding block ${chipStyle?.paddingBlockStart || "n/a"}/${chipStyle?.paddingBlockEnd || "n/a"}; text nudge ${textNudge}; compensation ${textCompensation}; margin end ${chipMarginEnd}\n` +
      `Chip border box ${chipRect ? `${px(chipRect.width)}×${px(chipRect.height)}` : "n/a"}; Chip occupied block ${occupiedChipBlock === null ? "n/a" : px(occupiedChipBlock)}; Button border box ${buttonRect ? `${px(buttonRect.width)}×${px(buttonRect.height)}` : "n/a"}; provider Button size delta from same standalone control ${buttonRect && sample.dataset.kind === "standalone-button" && tableButtonSize ? `${px(buttonRect.width - tableButtonSize.width)}×${px(buttonRect.height - tableButtonSize.height)}` : "not this comparison"}; host ${ownerRect ? `${px(ownerRect.width)}×${px(ownerRect.height)}` : "n/a"}; table host row ${hostRowHeight === null ? "n/a" : px(hostRowHeight)}; delta from plain row ${heightDelta === null ? "n/a" : px(heightDelta)}`;
    sample.dataset.densityEvidence = metrics;
    if (target && owner) peers.push({ sample, target, owner, metrics });
  }
  renderGuides(track, peers, 0);
  const baselineReference = Number.parseFloat(samples[0].dataset.guideBaseline);
  for (const sample of samples) {
    const baseline = Number.parseFloat(sample.dataset.guideBaseline);
    const delta = Number.isFinite(baseline) && Number.isFinite(baselineReference) ? px(baseline - baselineReference) : "unavailable";
    const pre = sample.querySelector("pre");
    pre.textContent += `\ntext baseline delta from plain row ${delta}; marker geometry ${sample.dataset.markerGeometry || "not recorded"}`;
  }
}

await initSpecRuntime({ initComponents: ({ initTabs }) => initTabs() });
document.querySelector("#spec-tier-stylesheet").addEventListener("load", () => document.fonts.ready.then(() => requestAnimationFrame(measure)));
window.addEventListener("resize", measure, { passive: true });
await document.fonts.ready;
requestAnimationFrame(measure);
