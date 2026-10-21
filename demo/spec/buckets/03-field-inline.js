import { initSpecRuntime } from "../../spec-runtime.js";
import { installBaselineMarker, renderGuides } from "./bucket-guides.js";

const peers = [
  ["Text input · reference", '<span class="bf-field-boundary"><input class="bf-input" type="text" value="Ubuntu" aria-label="Text input" data-target /></span>', "calc(8ch + 2rem)"],
  ["Button · action breaker", '<button class="bf-button" type="button" data-target><span data-label>Apply</span></button>'],
  ["Select · caret separate", '<span class="bf-field-boundary"><select aria-label="Select" data-target><option>Ubuntu</option></select></span>', "calc(9ch + 3rem)"],
  ["Textarea · second line", '<span class="bf-field-boundary"><textarea aria-label="Textarea" data-target>Ubuntu\nSummit</textarea></span>', "9rem"],
  ["SearchBox · two actions", '<div class="bf-search-box"><input class="bf-search-box-input bf-input" type="search" value="Ubuntu" aria-label="Search" data-target /><button class="bf-search-box-reset" type="button" aria-label="Clear search">Reset</button><button class="bf-search-box-button" type="button" aria-label="Submit search">Search</button></div>', "11rem"],
  ["ListTree · disclosure depth", '<ul class="bf-list-tree"><li class="bf-list-tree-item"><button class="bf-list-tree-toggle" type="button" aria-expanded="false" data-target>Folders</button></li></ul>', "9rem"]
];

const section = document.createElement("section");
section.className = "bucket-row";
section.innerHTML = '<h2 class="bf-h6">Shipped peers</h2><div class="bucket-track"><div class="bucket-guide-layer" aria-hidden="true"></div></div>';
const track = section.querySelector(".bucket-track");
for (const [caption, html, width] of peers) {
  const sample = document.createElement("div");
  sample.className = "bucket-sample";
  sample.style.setProperty("--sample-width", width || "auto");
  sample.innerHTML = `<div class="bucket-probe">${html}</div><span class="bucket-caption">${caption}</span><pre hidden aria-label="Computed inline geometry"></pre>`;
  track.append(sample);
}
document.querySelector("#bucket-rows").append(section);

const format = value => `${Math.round(value * 100) / 100}px`;
function roleValue(name) {
  const probe = document.createElement("i");
  probe.style.cssText = `position:absolute;visibility:hidden;padding-inline-start:var(${name})`;
  document.body.append(probe);
  const value = parseFloat(getComputedStyle(probe).paddingInlineStart);
  probe.remove();
  return value;
}

function updateMeasurements() {
  const fieldInset = roleValue("--bf-component-inline-inset-field");
  const actionInset = roleValue("--bf-component-inline-inset-action");
  const observations = [];
  for (const sample of document.querySelectorAll(".bucket-sample")) {
    const probe = sample.querySelector(".bucket-probe");
    const element = probe.firstElementChild;
    const target = sample.querySelector("[data-target]");
    const owner = element.matches(".bf-field-boundary, .bf-search-box") ? element : target;
    if (!sample.dataset.markerInstalled) {
      installBaselineMarker(target);
      sample.dataset.markerInstalled = "true";
    }
    const style = getComputedStyle(target);
    const box = target.getBoundingClientRect();
    const wrapperInset = box.left - owner.getBoundingClientRect().left;
    const label = target.querySelector("[data-label], .bucket-measured-text");
    const labelKeyline = label ? label.getBoundingClientRect().left - box.left : parseFloat(style.paddingInlineStart);
    const extras = [];
    if (target.matches("select")) {
      const caretRoom = parseFloat(style.paddingInlineEnd) - fieldInset;
      extras.push(`caret room ${format(caretRoom)}; end field edge ${format(fieldInset)}`);
    }
    if (element.matches(".bf-search-box")) {
      const slots = [...element.querySelectorAll(".bf-search-box-reset, .bf-search-box-button")];
      const slotWidths = slots.map(slot => slot.getBoundingClientRect().width);
      extras.push(`clear/search slots ${slotWidths.map(format).join(" + ")}; end field edge ${format(parseFloat(style.paddingInlineEnd) - slotWidths.reduce((sum, width) => sum + width, 0))}`);
    }
    if (target.matches(".bf-list-tree-toggle")) {
      const icon = parseFloat(getComputedStyle(target, "::before").inlineSize);
      const gap = parseFloat(style.columnGap);
      extras.push(`disclosure depth ${format(parseFloat(style.paddingInlineStart))}; icon ${format(icon)} + gap ${format(gap)}`);
    }
    const metrics = `field role ${format(fieldInset)}; action role ${format(actionInset)}\n` +
      `text owner padding start/end ${style.paddingInlineStart} / ${style.paddingInlineEnd}\n` +
      `wrapper inset ${format(wrapperInset)}; label keyline ${format(labelKeyline)}\n` +
      extras.join("\n");
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
