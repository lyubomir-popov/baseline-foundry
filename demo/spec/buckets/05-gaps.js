import { initSpecRuntime } from "../../spec-runtime.js";
import { installBaselineMarker, renderGuides } from "./bucket-guides.js";

const field = (id, help, next = false) => `<div class="bf-field bucket-stack-content" data-gap-owner="self" data-guide-owner="self">
  <label class="bf-form-label" for="${id}" data-target>Project name</label>
  <div class="bf-control"><span class="bf-field-boundary"><input class="bf-input" id="${id}" type="text" value="Atlas" aria-label="Project name" /></span></div>
  <p class="bf-form-help">${help}</p>
</div>${next ? `<div class="bf-field bucket-stack-content" data-following>
  <label class="bf-form-label" for="${id}-next">Following field</label>
  <div class="bf-control"><span class="bf-field-boundary"><input class="bf-input" id="${id}-next" type="text" value="Notes" aria-label="Following field" /></span></div>
</div>` : ""}`;
const longHelp = "Choose a short name that teammates can recognize in lists and search.";
const longerHelp = "Use a short label that explains the setting and helps teammates find it in long menus and shared projects.";
const fieldReference = id => `<div class="bf-field bucket-stack-content" data-gap-owner="self" data-guide-owner="self">
  <label class="bf-form-label" for="${id}" data-target>Project name</label>
  <div class="bf-control"><span class="bf-field-boundary"><input class="bf-input" id="${id}" type="text" value="Atlas" aria-label="Project name" /></span></div>
  <p class="bf-form-help">${longHelp}</p>
</div>`;
const footerButtons = '<button class="bf-button is-base" type="button" data-target>Cancel</button><button class="bf-button" type="button">Save</button>';

const rows = [
  ["Field item spacing", [
    ["Field · two-line help", `<div class="bf-stack is-flush">${field("gap-help-two", longHelp, true)}</div>`, "[data-gap-owner]", ".bf-field"],
    ["Field · three-line help", `<div class="bf-stack is-flush">${field("gap-help-three", longerHelp, true)}</div>`, "[data-gap-owner]", ".bf-field"]
  ]],
  ["Existing inline item gaps", [
    ["Field · reference", fieldReference("gap-inline-reference"), ".bf-field", ".bf-field"],
    ["Panel footer · selected inline role", `<div class="bf-panel-footer" data-gap-owner="self" data-guide-owner="self">${footerButtons}</div>`, ".bf-panel-footer", ".bf-panel-footer"],
    ["Modal footer · selected inline role", `<div class="bf-modal-footer" data-gap-owner="self" data-guide-owner="self">${footerButtons}</div>`, ".bf-modal-footer", ".bf-modal-footer"],
    ["Range · label, slider and number", '<div class="bf-field is-range" data-gap-owner="self" data-guide-owner="self"><label class="bf-form-label" for="gap-range" data-target>Grid density</label><div class="bf-control"><div class="bf-slider"><input id="gap-range" type="range" min="0" max="100" value="64" /><span class="bf-field-boundary"><input class="bf-slider-input" type="number" min="0" max="100" value="64" aria-label="Grid density value" /></span></div></div></div>', ".bf-field.is-range", ".bf-field.is-range"],
    ["Choices · wrapped option columns", '<div class="bf-inline-options"><div class="bf-inline-options-heading">Background Operator</div><div class="bf-inline-options-options" data-gap-owner="self" data-guide-owner="self"><label class="bf-inline-options-option" data-target><input type="radio" name="gap-choice" checked /><span>Halo</span></label><label class="bf-inline-options-option"><input type="radio" name="gap-choice" /><span>Rays</span></label><label class="bf-inline-options-option"><input type="radio" name="gap-choice" /><span>Field</span></label></div></div>', ".bf-inline-options-options", ".bf-inline-options-options"]
  ]],
  ["Group spacing", [
    ["Paragraph · reference", '<p class="bf-body" data-gap-owner="self" data-guide-owner="self" data-target>Workspace summary sits here before its related settings.</p>', "[data-gap-owner]", "[data-guide-owner]"],
    ["Stack · paragraph and field", `<div class="bf-stack bucket-stack-content" data-gap-owner="self" data-guide-owner="self"><p data-target>Workspace settings</p>${field("gap-stack", longHelp)}</div>`, ".bf-stack", ".bf-stack"],
    ["Card · header and content", '<article class="bf-card bf-stack" data-gap-owner="self" data-guide-owner="self"><header class="bf-card-header"><h3 class="bf-h5" data-target>Workspace</h3><p class="bf-h4">Project settings</p></header><div class="bf-card-content"><p class="bf-body">Names and access stay together in this workspace.</p></div></article>', ".bf-card", ".bf-card"]
  ]],
  ["Page section spacing", [
    ["Paragraph · reference", '<p class="bf-body" data-gap-owner="self" data-guide-owner="self" data-target>Workspace summary sits here before its sections.</p>', "[data-gap-owner]", "[data-guide-owner]"],
    ["Section stack · complete sections", '<div class="bf-stack is-section" data-gap-owner="self" data-guide-owner="self"><section class="bf-section bf-stack is-dense"><h2 class="bf-h5" data-target>Workspace</h2><p class="bf-body">Choose where this project belongs.</p></section><section class="bf-section bf-stack is-dense"><h2 class="bf-h5">Access</h2><p class="bf-body">Manage who can see the project.</p></section></div>', ".bf-stack.is-section", ".bf-stack.is-section"]
  ]]
];

const container = document.querySelector("#bucket-rows");
const tracks = [];
for (const [title, peers] of rows) {
  const section = document.createElement("section");
  section.className = "bucket-row";
  section.innerHTML = `<h2 class="bf-h6">${title}</h2><div class="bucket-track"><div class="bucket-guide-layer" aria-hidden="true"></div></div>`;
  const track = section.querySelector(".bucket-track");
  for (const [caption, html, gapSelector, guideSelector] of peers) {
    const sample = document.createElement("div");
    sample.className = "bucket-sample";
    sample.style.setProperty("--sample-width", "18rem");
    sample.dataset.gapOwnerSelector = gapSelector;
    sample.dataset.guideOwnerSelector = guideSelector;
    sample.innerHTML = `<div class="bucket-probe">${html}</div><span class="bucket-caption">${caption}</span><pre hidden aria-label="Computed gap measurements"></pre>`;
    track.append(sample);
  }
  container.append(section);
  tracks.push(track);
}

const format = value => Number.isFinite(value) ? `${Math.round(value * 100) / 100}px` : "unavailable";
function margins(node) {
  const style = getComputedStyle(node);
  return `m${format(parseFloat(style.marginBlockStart) || 0)}/${format(parseFloat(style.marginBlockEnd) || 0)}`;
}
function textLineCount(node) {
  const range = document.createRange();
  range.selectNodeContents(node);
  return range.getClientRects().length;
}
function secondTextTarget(node) {
  if (node.matches("input, select, textarea")) return null;
  const selector = "label, p, h1, h2, h3, h4, h5, h6, button";
  return node.matches(selector) ? node : node.querySelector(selector);
}
function alignOwnerStartGuides(track, observations) {
  const trackBox = track.getBoundingClientRect();
  const topMarks = [...track.querySelectorAll(".bucket-guide-mark.is-top")];
  const owners = [observations[0]?.owner, ...observations.map(observation => observation.owner)];
  topMarks.forEach((mark, index) => {
    const owner = owners[index];
    if (!owner) return;
    const box = owner.getBoundingClientRect();
    mark.style.insetBlockStart = `${box.top - trackBox.top}px`;
    if (mark.classList.contains("is-tick")) {
      mark.style.insetInlineStart = `${box.left - trackBox.left + track.scrollLeft}px`;
    }
    if (!mark.classList.contains("is-tick")) {
      observations.forEach(({ sample, owner: peerOwner }) => {
        const ownerTop = peerOwner.getBoundingClientRect().top - trackBox.top;
        const textPeerTop = sample.dataset.guideTop;
        sample.dataset.textPeerTop = textPeerTop;
        sample.dataset.guideTop = `${Math.round(ownerTop * 100) / 100}px`;
        sample.dataset.ownerBorderBoxTop = sample.dataset.guideTop;
        const pre = sample.querySelector("pre");
        pre.textContent = pre.textContent.split("\n")
          .map(line => line.startsWith("visible top ") ? `text peer top ${textPeerTop}` : line)
          .join("\n");
      });
    }
  });
}

function updateMeasurements() {
  for (const track of tracks) {
    const observations = [];
    for (const sample of track.querySelectorAll(".bucket-sample")) {
      const probe = sample.querySelector(".bucket-probe");
      const gapOwner = probe.querySelector(sample.dataset.gapOwnerSelector);
      const guideOwner = probe.querySelector(sample.dataset.guideOwnerSelector) || gapOwner;
      const target = sample.querySelector("[data-target]") || guideOwner;
      if (!sample.dataset.markerInstalled && target.matches("label, p, h1, h2, h3, h4, h5, h6, button")) {
        installBaselineMarker(target);
        sample.dataset.markerInstalled = "true";
      }
      const style = getComputedStyle(gapOwner);
      const children = [...gapOwner.children];
      const ownerTop = gapOwner.getBoundingClientRect().top - track.getBoundingClientRect().top;
      const innerSlider = gapOwner.matches(".bf-field.is-range") ? gapOwner.querySelector(".bf-slider") : null;
      const innerSliderMetrics = innerSlider ? (() => {
        const sliderStyle = getComputedStyle(innerSlider);
        const sliderChildren = [...innerSlider.children];
        const physicalSeparation = sliderChildren.length > 1
          ? sliderChildren[1].getBoundingClientRect().left - sliderChildren[0].getBoundingClientRect().right
          : null;
        return `inner .bf-slider row/column gap ${sliderStyle.rowGap} / ${sliderStyle.columnGap}; flex gap ${sliderStyle.gap}; child separation ${format(physicalSeparation)}`;
      })() : null;
      const childMargins = children.map(margins).join(" · ") || "none";
      const marker = sample.querySelector(".bucket-baseline-marker");
      const horizontalPair = gapOwner.matches(".bf-panel-footer, .bf-modal-footer, .bf-field.is-range, .bf-inline-options-options");
      const nextText = !horizontalPair && children[1] ? secondTextTarget(children[1]) : null;
      if (nextText && !nextText.querySelector(".bucket-baseline-marker") && nextText.matches("label, p, h1, h2, h3, h4, h5, h6, button")) {
        installBaselineMarker(nextText);
      }
      const nextMarker = nextText?.querySelector(".bucket-baseline-marker");
      const baselineSeparation = marker && nextMarker
        ? nextMarker.getBoundingClientRect().top - marker.getBoundingClientRect().top
        : null;
      const following = probe.querySelector("[data-following]");
      const precedingField = following?.previousElementSibling;
      const followingSeparation = following && precedingField ? following.getBoundingClientRect().top - precedingField.getBoundingClientRect().bottom : null;
      const followingOffset = following && precedingField ? following.getBoundingClientRect().top - precedingField.getBoundingClientRect().top : null;
      const help = gapOwner.querySelector(".bf-form-help");
      const helpLines = help ? textLineCount(help) : null;
      const hasAdjacentSections = children.some(child => child.matches(".bf-section, .bf-card-header, .bf-card-content"));
      const sectionInsets = hasAdjacentSections
        ? children.map(child => `${getComputedStyle(child).paddingBlockStart}/${getComputedStyle(child).paddingBlockEnd} padding`).join(" · ")
        : "n/a";
      const seam = hasAdjacentSections && children.length > 1
        ? (() => {
          const first = children[0];
          const second = children[1];
          const firstStyle = getComputedStyle(first);
          const secondStyle = getComputedStyle(second);
          const firstBox = first.getBoundingClientRect();
          const secondBox = second.getBoundingClientRect();
          const borderGap = secondBox.top - firstBox.bottom;
          const contentStart = secondBox.top + (parseFloat(secondStyle.borderBlockStartWidth) || 0)
            + (parseFloat(secondStyle.paddingBlockStart) || 0);
          const contentEnd = firstBox.bottom - (parseFloat(firstStyle.borderBlockEndWidth) || 0)
            - (parseFloat(firstStyle.paddingBlockEnd) || 0);
          const contentGap = contentStart - contentEnd;
          return `border-box seam ${format(borderGap)}; content-edge seam ${format(contentGap)}`;
        })()
        : "n/a";
      const selectedInlineMember = gapOwner.matches(".bf-panel-footer, .bf-modal-footer, .bf-field.is-range, .bf-slider, .bf-inline-options-options");
      const sameRowPair = children.find((child, index) => index > 0 && Math.abs(child.getBoundingClientRect().top - children[index - 1].getBoundingClientRect().top) < 1);
      const inlineSeparation = sameRowPair
        ? sameRowPair.getBoundingClientRect().left - children[children.indexOf(sameRowPair) - 1].getBoundingClientRect().right
        : null;
      const metrics = `computed row/column gap ${style.rowGap} / ${style.columnGap}; flex gap ${style.gap}\n` +
        (innerSliderMetrics ? `${innerSliderMetrics}\n` : "") +
        `direct-child block margins ${childMargins}\n` +
        `owner border-box top ${format(ownerTop)}; first-to-second text baseline separation ${format(baselineSeparation)}; help lines ${helpLines ?? "n/a"}; adjacent section padding ${sectionInsets}; ${seam}\n` +
        `following field starts ${format(followingOffset)} from prior field top with ${format(followingSeparation)} separation; ` +
        (selectedInlineMember ? `selected inline owner column gap ${style.columnGap}; first same-row child separation ${format(inlineSeparation)}` : "reference-only row; no selected inline owner");
      sample.dataset.computedGapEvidence = metrics;
      observations.push({ sample, target, owner: guideOwner, metrics });
    }
    renderGuides(track, observations, 0);
    alignOwnerStartGuides(track, observations);
  }
}

const stylesheet = document.querySelector("#spec-tier-stylesheet");
stylesheet.addEventListener("load", () => document.fonts.ready.then(() => requestAnimationFrame(updateMeasurements)));
window.addEventListener("resize", updateMeasurements, { passive: true });
await initSpecRuntime({
  initComponents({ initRangeControls }) {
    initRangeControls();
  }
});
await document.fonts.ready;
requestAnimationFrame(updateMeasurements);
