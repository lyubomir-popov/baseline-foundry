import { initSpecRuntime } from "../../spec-runtime.js";

const peers = [
  ["Plain Button · reference", '<button class="bf-button" type="button" data-target><span data-label>Button</span></button>'],
  ["Leading icon Button", '<button class="bf-button is-icon" type="button" data-target><span class="bf-icon is-search" aria-hidden="true" data-icon></span><span class="bf-button-label" data-label>Search</span></button>'],
  ["Clickable Chip", '<button class="bf-chip" type="button" data-target><span class="bf-chip-value" data-label>Chip</span></button>'],
  ["Dismissible Chip", '<span class="bf-chip" data-target><span class="bf-chip-value" data-label>Dismissible</span><button class="bf-chip-dismiss" type="button" aria-label="Remove Dismissible">Remove</button></span>'],
  ["Active Tab", '<div class="bf-tabs"><ul class="bf-tabs-list" role="tablist"><li class="bf-tabs-item"><button class="bf-tabs-link is-active" type="button" role="tab" aria-selected="true" data-target><span data-label>Active</span></button></li></ul></div>'],
  ["Inactive Tab", '<div class="bf-tabs"><ul class="bf-tabs-list" role="tablist"><li class="bf-tabs-item"><button class="bf-tabs-link" type="button" role="tab" aria-selected="false" data-target><span data-label>Inactive</span></button></li></ul></div>'],
  ["Menu item", '<ul class="bf-contextual-menu-dropdown" aria-hidden="false"><li class="bf-contextual-menu-group"><button class="bf-contextual-menu-link" type="button" data-target><span data-label>Open</span></button><button class="bf-contextual-menu-link" type="button"><span>Save</span></button></li></ul>'],
  ["Nav menu", '<ul class="bf-top-navigation-dropdown" aria-hidden="false"><li><a class="bf-top-navigation-dropdown-item" href="#bucket-rows" data-target><span class="bf-top-navigation-dropdown-item-label" data-label>Open</span></a></li><li><a class="bf-top-navigation-dropdown-item" href="#bucket-rows"><span class="bf-top-navigation-dropdown-item-label">Save</span></a></li></ul>'],
  ["Top nav", '<nav class="bf-top-navigation" aria-label="Bucket top navigation"><div class="bf-top-navigation-nav" aria-hidden="false"><ul class="bf-top-navigation-list"><li class="bf-top-navigation-item"><a class="bf-top-navigation-link" href="#bucket-rows" data-target><span data-label>Docs</span></a></li></ul></div></nav>']
];

const section = document.createElement("section");
section.className = "bucket-row";
section.innerHTML = '<h2 class="bf-h6">Shipped peers</h2><div class="bucket-track"></div>';
const track = section.querySelector(".bucket-track");
for (const [caption, html] of peers) {
  const sample = document.createElement("div");
  sample.className = "bucket-sample";
  sample.innerHTML = `<div class="bucket-probe">${html}<span class="bucket-guide" aria-hidden="true"></span></div><span class="bucket-caption">${caption}</span><pre hidden aria-label="Computed inline geometry"></pre>`;
  track.append(sample);
}
document.querySelector("#bucket-rows").append(section);

const format = value => `${Math.round(value * 100) / 100}px`;
function updateMeasurements() {
  const roleProbe = document.createElement("i");
  roleProbe.style.cssText = "position:absolute;visibility:hidden;padding-inline-start:var(--bf-component-inline-inset-action)";
  document.body.append(roleProbe);
  const actionInset = parseFloat(getComputedStyle(roleProbe).paddingInlineStart);
  roleProbe.remove();

  const observations = [];
  for (const sample of document.querySelectorAll(".bucket-sample")) sample.querySelector(".bucket-probe").style.setProperty("--bucket-shift", "0px");
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  for (const sample of document.querySelectorAll(".bucket-sample")) {
    const probe = sample.querySelector(".bucket-probe");
    const target = sample.querySelector("[data-target]");
    const label = target.querySelector("[data-label]");
    const icon = target.querySelector("[data-icon]");
    const style = getComputedStyle(target);
    const box = target.getBoundingClientRect();
    const labelBox = label.getBoundingClientRect();
    const iconBox = icon?.getBoundingClientRect();
    const navigationList = target.closest(".bf-top-navigation-nav .bf-top-navigation-list");
    const stackedNavigation = navigationList && getComputedStyle(navigationList).flexDirection === "column";
    const labelEnd = stackedNavigation ? "not observable (stacked navigation)" : format(box.right - labelBox.right);
    const iconMetrics = iconBox
      ? `box ${format(iconBox.width)} × ${format(iconBox.height)}; start ${format(iconBox.left - box.left)}; icon→label ${format(labelBox.left - iconBox.right)}`
      : "none";
    context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const fontMetrics = context.measureText("Hgp");
    const ascent = fontMetrics.fontBoundingBoxAscent || parseFloat(style.fontSize) * .8;
    const descent = fontMetrics.fontBoundingBoxDescent || parseFloat(style.fontSize) * .2;
    const line = parseFloat(style.lineHeight) || 0;
    const baselineOffset = parseFloat(style.paddingBlockStart) + (line - ascent - descent) / 2 + ascent;
    const metrics =
      `padding start/end ${style.paddingInlineStart} / ${style.paddingInlineEnd}\n` +
      `action role ${format(actionInset)}\n` +
      `label start/end ${format(labelBox.left - box.left)} / ${labelEnd}\n` +
      `leading icon ${iconMetrics}`;
    observations.push({ sample, probe, target, baseline: box.top + baselineOffset, baselineOffset, metrics });
  }
  const commonBaseline = Math.max(...observations.map(item => item.baseline));
  for (const item of observations) item.probe.style.setProperty("--bucket-shift", format(commonBaseline - item.baseline));
  for (const { sample, probe, target, baselineOffset, metrics } of observations) {
    const box = target.getBoundingClientRect();
    const probeBox = probe.getBoundingClientRect();
    const guide = probe.querySelector(".bucket-guide");
    guide.style.setProperty("--guide-top", format(box.top - probeBox.top));
    guide.style.setProperty("--guide-left", format(box.left - probeBox.left));
    guide.style.setProperty("--guide-width", format(box.width));
    guide.style.setProperty("--guide-height", format(box.height));
    guide.style.setProperty("--guide-baseline", format(baselineOffset - parseFloat(getComputedStyle(guide).borderTopWidth)));
    sample.dataset.metrics = metrics;
    sample.querySelector("pre").textContent = `${metrics}\nestimated baseline delta ${format(box.top + baselineOffset - commonBaseline)}`;
  }
}

const stylesheet = document.querySelector("#spec-tier-stylesheet");
stylesheet.addEventListener("load", () => document.fonts.ready.then(() => requestAnimationFrame(updateMeasurements)));
window.addEventListener("resize", updateMeasurements, { passive: true });
await initSpecRuntime();
await document.fonts.ready;
requestAnimationFrame(updateMeasurements);
