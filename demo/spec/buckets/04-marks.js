import { initSpecRuntime } from "../../spec-runtime.js";
import { installBaselineMarker, renderGuides } from "./bucket-guides.js";

const peers = [
  ["Icon-leading Button · reference", '<button class="bf-button is-icon" type="button" data-target><span class="bf-icon is-search" aria-hidden="true" data-mark></span><span class="bf-button-label" data-label>Search</span></button>'],
  ["Plain Button · no mark", '<button class="bf-button" type="button" data-target><span data-label>Apply</span></button>'],
  ["Checkbox", '<div class="bf-checkbox"><input class="bf-checkbox-input" id="bucket-mark-checkbox" type="checkbox" checked /><label class="bf-checkbox-label" for="bucket-mark-checkbox" data-target>Check</label></div>'],
  ["Radio", '<div class="bf-radio"><input class="bf-radio-input" id="bucket-mark-radio" name="bucket-mark-radio" type="radio" checked /><label class="bf-radio-label" for="bucket-mark-radio" data-target>Radio</label></div>'],
  ["Switch · double-width track", '<label class="bf-switch"><input class="bf-switch-input" type="checkbox" checked /><span class="bf-switch-slider" aria-hidden="true" data-mark></span><span class="bf-switch-label" data-target>Switch</span></label>'],
  ["Select · trailing caret", '<span class="bf-field-boundary"><select aria-label="Select" data-target><option>Choice</option></select></span>', "calc(8ch + 3rem)"],
  ["Accordion disclosure", '<div class="bf-accordion"><ul class="bf-accordion-list"><li class="bf-accordion-group"><div class="bf-accordion-heading"><button class="bf-accordion-tab" type="button" aria-expanded="false" data-target>Open</button></div></li></ul></div>', "8rem"],
  ["SideNavigation disclosure", '<nav class="bf-side-navigation" aria-label="Bucket side navigation"><ul class="bf-side-navigation-list"><li class="bf-side-navigation-item"><button class="bf-side-navigation-accordion-button" type="button" aria-expanded="false" data-target>Layouts</button></li></ul></nav>', "10rem"],
  ["SideNavigation · no mark", '<nav class="bf-side-navigation" aria-label="Bucket markless navigation"><ul class="bf-side-navigation-list"><li class="bf-side-navigation-item"><a class="bf-side-navigation-link" href="#bucket-rows" data-target>Leaf</a></li></ul></nav>', "10rem"],
  ["Dismissible Chip · trailing mark", '<span class="bf-chip" data-target><span class="bf-chip-value" data-label>Dismissible</span><button class="bf-chip-dismiss" type="button" aria-label="Remove Dismissible" data-mark>Remove</button></span>']
];

const section = document.createElement("section");
section.className = "bucket-row";
section.innerHTML = '<h2 class="bf-h6">Shipped peers</h2><div class="bucket-track"><div class="bucket-guide-layer" aria-hidden="true"></div></div>';
const track = section.querySelector(".bucket-track");
for (const [caption, html, width] of peers) {
  const sample = document.createElement("div");
  sample.className = "bucket-sample";
  sample.style.setProperty("--sample-width", width || "auto");
  sample.innerHTML = `<div class="bucket-probe">${html}</div><span class="bucket-caption">${caption}</span><pre hidden aria-label="Computed mark geometry"></pre>`;
  track.append(sample);
}
document.querySelector("#bucket-rows").append(section);

const format = value => `${Math.round(value * 100) / 100}px`;
function resolvedLength(target, variable) {
  const probe = document.createElement("span");
  probe.style.cssText = `position:absolute;visibility:hidden;inline-size:var(${variable})`;
  target.append(probe);
  const length = probe.getBoundingClientRect().width;
  probe.remove();
  return length;
}
function markGeometry(target, label) {
  const box = target.getBoundingClientRect();
  const style = getComputedStyle(target);
  const directMark = target.querySelector("[data-mark]") || target.parentElement.querySelector("[data-mark]");
  if (directMark) {
    const rect = directMark.getBoundingClientRect();
    let kind = directMark.matches(".bf-switch-slider") ? "DOM switch track (not icon)" : "DOM mark box";
    let paint = "see element background";
    if (directMark.matches(".bf-chip-dismiss")) {
      const mask = getComputedStyle(directMark, "::before");
      const targetStyle = getComputedStyle(directMark, "::after");
      const points = [[-11.5, -11.5], [11.5, -11.5], [-11.5, 11.5], [11.5, 11.5]];
      const corners = points.filter(([x, y]) => document.elementFromPoint(rect.left + rect.width / 2 + x, rect.top + rect.height / 2 + y)?.closest(".bf-chip-dismiss") === directMark).length;
      kind = "DOM dismiss control";
      paint = `mask ${mask.maskSize || mask.webkitMaskSize}; target ${targetStyle.minInlineSize} × ${targetStyle.minBlockSize}; corner hits ${corners}/4`;
    }
    return { width: rect.width, height: rect.height, gap: directMark.matches(".bf-chip-dismiss") ? rect.left - label.right : label.left - rect.right, slot: rect.width, kind, paint };
  }
  if (target.matches("select")) {
    const size = parseFloat(style.backgroundSize);
    return { width: size, height: size, gap: parseFloat(style.paddingInlineEnd) - size - parseFloat(style.paddingInlineStart), slot: size, kind: "CSS background caret; reserved gap, glyph end unavailable", paint: style.backgroundSize };
  }
  if (target.matches(".bf-side-navigation-link")) {
    const size = resolvedLength(target, "--bf-side-navigation-icon-size");
    const gutter = resolvedLength(target, "--bf-side-navigation-gutter");
    return { width: 0, height: 0, gap: label.left - box.left - gutter - size, slot: size, kind: "markless reserved column", paint: "none" };
  }
  const pseudo = getComputedStyle(target, "::before");
  const size = parseFloat(pseudo.inlineSize);
  const start = target.matches(".bf-side-navigation-accordion-button")
    ? parseFloat(pseudo.insetInlineStart) : target.matches(".bf-accordion-tab") ? parseFloat(style.paddingInlineStart) : 0;
  const paint = target.matches(".bf-checkbox-label, .bf-radio-label") ? "full-box background fill" : pseudo.backgroundSize;
  return { width: size, height: parseFloat(pseudo.blockSize), gap: label.left - box.left - start - size, slot: size, kind: "computed ::before box", paint };
}

function updateMeasurements() {
  const observations = [];
  for (const sample of document.querySelectorAll(".bucket-sample")) {
    const probe = sample.querySelector(".bucket-probe");
    const element = probe.firstElementChild;
    const target = sample.querySelector("[data-target]");
    const owner = element.matches(".bf-field-boundary") ? element : target;
    if (!sample.dataset.markerInstalled) {
      installBaselineMarker(target);
      sample.dataset.markerInstalled = "true";
    }
    const style = getComputedStyle(target);
    const text = target.querySelector(".bucket-measured-text, [data-label]");
    const label = text?.getBoundingClientRect() || { left: target.getBoundingClientRect().left + parseFloat(style.paddingInlineStart), right: target.getBoundingClientRect().right - parseFloat(style.paddingInlineEnd) };
    const mark = target.matches(".bf-button:not(.is-icon)") ? { width: 0, height: 0, gap: 0, slot: 0, kind: "no mark; no reserved column", paint: "none" } : markGeometry(target, label);
    const metrics = `font ${style.fontSize}; mark ${format(mark.width)} × ${format(mark.height)}; slot ${format(mark.slot)}\n` +
      `column gap ${style.columnGap}; mark→label ${format(mark.gap)} (${mark.kind})\n` +
      `mark paint ${mark.paint}\n` +
      `label keyline ${format(label.left - target.getBoundingClientRect().left)}; label baseline in guide tick`;
    observations.push({ sample, target, owner, metrics });
  }
  renderGuides(track, observations, 0);
}

const stylesheet = document.querySelector("#spec-tier-stylesheet");
stylesheet.addEventListener("load", () => document.fonts.ready.then(() => requestAnimationFrame(updateMeasurements)));
window.addEventListener("resize", updateMeasurements, { passive: true });
await initSpecRuntime();
await document.fonts.ready;
requestAnimationFrame(updateMeasurements);
