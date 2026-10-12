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
function centeredBox(rect, label, source) {
  const labelRect = typeof label.getBoundingClientRect === "function" ? label.getBoundingClientRect() : label;
  const inline = rect.left + rect.width / 2 - (labelRect.left + labelRect.width / 2);
  const block = rect.top + rect.height / 2 - (labelRect.top + labelRect.height / 2);
  if (!Number.isFinite(inline) || !Number.isFinite(block)) return null;
  return { inline, block, source };
}
function measuredTextBox(container) {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  let first = null;
  let last = null;
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.textContent.trim()) continue;
    first ||= node;
    last = node;
  }
  if (!first || !last) return null;
  const range = document.createRange();
  range.setStart(first, 0);
  range.setEnd(last, last.textContent.length);
  const rect = range.getBoundingClientRect();
  if (![rect.left, rect.top, rect.width, rect.height].every(Number.isFinite) || !rect.width || !rect.height) return null;
  return rect;
}
function transformCenterOffset(transform, origin, width, height) {
  if (!transform || transform === "none") return { x: 0, y: 0 };
  const [originXValue, originYValue] = origin.split(" ");
  const originX = originXValue.endsWith("%") ? parseFloat(originXValue) * width / 100 : parseFloat(originXValue);
  const originY = originYValue.endsWith("%") ? parseFloat(originYValue) * height / 100 : parseFloat(originYValue);
  const centerX = width / 2;
  const centerY = height / 2;
  const matrix = transform.match(/^matrix\(([^)]+)\)$/)?.[1].split(",").map(Number);
  if (matrix?.length === 6) {
    return {
      x: originX + matrix[0] * (centerX - originX) + matrix[2] * (centerY - originY) + matrix[4] - centerX,
      y: originY + matrix[1] * (centerX - originX) + matrix[3] * (centerY - originY) + matrix[5] - centerY
    };
  }
  const matrix3d = transform.match(/^matrix3d\(([^)]+)\)$/)?.[1].split(",").map(Number);
  if (matrix3d?.length === 16) {
    return {
      x: originX + matrix3d[0] * (centerX - originX) + matrix3d[4] * (centerY - originY) + matrix3d[12] - centerX,
      y: originY + matrix3d[1] * (centerX - originX) + matrix3d[5] * (centerY - originY) + matrix3d[13] - centerY
    };
  }
  return null;
}
function computedPseudoBox(target, pseudo, label) {
  const style = getComputedStyle(target, pseudo);
  const width = parseFloat(style.inlineSize);
  const height = parseFloat(style.blockSize);
  const owner = target.getBoundingClientRect();
  if (!Number.isFinite(width) || !Number.isFinite(height)) return null;

  let left;
  let top;
  if (target.matches(".bf-accordion-tab")) {
    left = owner.left + parseFloat(getComputedStyle(target).paddingInlineStart);
    top = owner.top + owner.height / 2 - height / 2;
  } else {
    left = owner.left + (parseFloat(style.insetInlineStart) || 0);
    top = owner.top + (parseFloat(style.insetBlockStart) || 0);
  }
  const offset = transformCenterOffset(style.transform, style.transformOrigin, width, height);
  if (!offset) return null;
  return centeredBox({ left: left + offset.x, top: top + offset.y, width, height }, label, "computed ::before box center (paint is CSS background)");
}
function chipTargetEvidence(markElement) {
  const box = markElement.getBoundingClientRect();
  const style = getComputedStyle(markElement, "::after");
  const width = parseFloat(style.minInlineSize);
  const height = parseFloat(style.minBlockSize);
  const matrix = style.transform.match(/^matrix\(([^)]+)\)$/)?.[1].split(",").map(Number);
  const centered = Math.abs(parseFloat(style.left) - box.width / 2) < .01 && Math.abs(parseFloat(style.top) - box.height / 2) < .01
    && matrix?.length === 6 && Math.abs(matrix[4] + width / 2) < .01 && Math.abs(matrix[5] + height / 2) < .01;
  if (!Number.isFinite(width) || !Number.isFinite(height) || !centered) {
    return { geometry: "unavailable (computed ::after target is not a centered measurable box)", pointer: "unavailable" };
  }
  const left = box.left + box.width / 2 - width / 2;
  const top = box.top + box.height / 2 - height / 2;
  const points = [[left + .5, top + .5], [left + width - .5, top + .5], [left + .5, top + height - .5], [left + width - .5, top + height - .5]];
  const requiredTarget = parseFloat(getComputedStyle(markElement).getPropertyValue("--bf-pointer-target-minimum")) || 24;
  const geometryHits = width >= requiredTarget && height >= requiredTarget && centered ? 4 : 0;
  const viewport = { left: 0, top: 0, right: document.documentElement.clientWidth, bottom: document.documentElement.clientHeight };
  const track = markElement.closest(".bucket-track");
  const clip = track?.getBoundingClientRect();
  const visible = points.every(([x, y]) => x >= viewport.left && x <= viewport.right && y >= viewport.top && y <= viewport.bottom
    && (!clip || (x >= clip.left + track.clientLeft && x <= clip.right - track.clientLeft && y >= clip.top + track.clientTop && y <= clip.bottom - track.clientTop)));
  const pointer = visible
    ? `pointer hits ${points.filter(([x, y]) => document.elementFromPoint(x, y)?.closest(".bf-chip-dismiss") === markElement).length}/4`
    : "pointer hits unavailable (offscreen or clipped)";
  return { geometry: `geometry corners ${geometryHits}/4; computed ${width} × ${height}px min target (required ${requiredTarget}px, viewport independent)`, pointer };
}
function markGeometry(target, label) {
  const box = target.getBoundingClientRect();
  const style = getComputedStyle(target);
  const directMark = target.querySelector("[data-mark]") || target.parentElement.querySelector("[data-mark]");
  if (directMark) {
    const rect = directMark.getBoundingClientRect();
    let kind = directMark.matches(".bf-switch-slider") ? "DOM switch track (not icon)" : "DOM mark box";
    let paint = "see element background";
    let center = centeredBox(rect, label, "DOM box center");
    if (directMark.matches(".bf-chip-dismiss")) {
      const mask = getComputedStyle(directMark, "::before");
      const targetEvidence = chipTargetEvidence(directMark);
      kind = "DOM dismiss control";
      center = centeredBox(rect, label, "DOM dismiss-control box center; ::before close paint is centered in it");
      paint = `computed ::before close mask ${mask.maskSize || mask.webkitMaskSize}; ${targetEvidence.geometry}; ${targetEvidence.pointer}`;
    }
    return { width: rect.width, height: rect.height, gap: directMark.matches(".bf-chip-dismiss") ? rect.left - label.right : label.left - rect.right, slot: rect.width, kind, paint, center };
  }
  if (target.matches("select")) {
    const size = parseFloat(style.backgroundSize);
    return { width: size, height: size, gap: parseFloat(style.paddingInlineEnd) - size - parseFloat(style.paddingInlineStart), slot: size, kind: "computed CSS background caret; option text box unavailable", paint: `${style.backgroundSize} at ${style.backgroundPosition}`, center: null };
  }
  if (target.matches(".bf-side-navigation-link")) {
    const size = resolvedLength(target, "--bf-side-navigation-icon-size");
    const gutter = resolvedLength(target, "--bf-side-navigation-gutter");
    return { width: 0, height: 0, gap: label.left - box.left - gutter - size, slot: size, kind: "markless reserved column", paint: "none", center: null };
  }
  const pseudo = getComputedStyle(target, "::before");
  const size = parseFloat(pseudo.inlineSize);
  const start = target.matches(".bf-side-navigation-accordion-button")
    ? parseFloat(pseudo.insetInlineStart) : target.matches(".bf-accordion-tab") ? parseFloat(style.paddingInlineStart) : 0;
  const paint = target.matches(".bf-checkbox-label, .bf-radio-label") ? "full-box background fill" : pseudo.backgroundSize;
  return { width: size, height: parseFloat(pseudo.blockSize), gap: label.left - box.left - start - size, slot: size, kind: "computed ::before box", paint, center: computedPseudoBox(target, "::before", label) };
}

function centerText(center, kind) {
  if (!center) {
    if (kind.includes("CSS background caret")) return "mark center − own label-box center: unavailable (native option text box geometry)";
    if (kind.includes("markless") || kind.includes("no mark")) return "mark center − own label-box center: n/a (peer has no mark)";
    return "mark center − own label-box center: unavailable (mark geometry not exposed)";
  }
  return `mark center − own label-box center: inline ${format(center.inline)}, block ${format(center.block)} (${center.source})`;
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
    const text = target.querySelector(".bucket-measured-text") || target.querySelector("[data-label]");
    const textBox = text && measuredTextBox(text);
    const label = textBox || text?.getBoundingClientRect() || { left: target.getBoundingClientRect().left + parseFloat(style.paddingInlineStart), right: target.getBoundingClientRect().right - parseFloat(style.paddingInlineEnd) };
    const mark = target.matches(".bf-button:not(.is-icon)") ? { width: 0, height: 0, gap: 0, slot: 0, kind: "no mark; no reserved column", paint: "none" } : markGeometry(target, label);
    if (mark.center && textBox) mark.center.source += "; own text Range box";
    const layoutHost = target.matches(".bf-switch-label") ? target.closest(".bf-switch") : target;
    const columnGap = target.matches(".bf-checkbox-label, .bf-radio-label")
      ? "n/a; mark→label comes from label padding"
      : target.matches("select")
        ? "n/a; caret room comes from field padding"
        : target.matches(".bf-button:not(.is-icon)")
          ? "n/a; no mark"
          : `${getComputedStyle(layoutHost).columnGap} on .${layoutHost.classList[0]}`;
    const metrics = `font ${style.fontSize}; mark ${format(mark.width)} × ${format(mark.height)}; slot ${format(mark.slot)}\n` +
      `column gap ${columnGap}; mark→label ${format(mark.gap)} (${mark.kind})\n` +
      `${centerText(mark.center, mark.kind)}\n` +
      `mark paint ${mark.paint}\n` +
      `label keyline ${format(label.left - target.getBoundingClientRect().left)}; label baseline in guide tick`;
    observations.push({ sample, target, owner, metrics });
  }
  renderGuides(track, observations, 0);
}

const stylesheet = document.querySelector("#spec-tier-stylesheet");
stylesheet.addEventListener("load", () => document.fonts.ready.then(() => requestAnimationFrame(updateMeasurements)));
window.addEventListener("resize", updateMeasurements, { passive: true });
track.addEventListener("scroll", updateMeasurements, { passive: true });
await initSpecRuntime();
await document.fonts.ready;
requestAnimationFrame(updateMeasurements);
