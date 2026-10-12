import { initSpecRuntime } from "../../spec-runtime.js";
import { installBaselineMarker, renderGuides } from "./bucket-guides.js";

const bodyText = "Keep this surface close to its related workspace controls and notes.";
const card = `<article class="bf-card bf-stack" data-owner>
  <header class="bf-card-header"><h3 class="bf-h5">Workspace</h3><p class="bf-h4">Project settings</p></header>
  <div class="bf-card-content"><div class="bf-card-preview"><img class="bf-card-preview-image" src="../../assets/aspect-wide.svg" alt="Layered landscape preview" /></div><p class="bf-body">${bodyText}</p><div class="bf-card-scroll" role="region" tabindex="0" aria-label="Wide Card content"><table class="bf-table"><thead><tr><th>Token</th><th>Editorial</th><th>Documentation</th><th>Application</th><th>Operating system</th></tr></thead><tbody><tr><td>Component inline inset</td><td>Action</td><td>Action</td><td>Action</td><td>Action</td></tr></tbody></table></div></div>
  <footer class="bf-card-content"><p class="bf-body">Updated today</p></footer>
</article>`;
const optionCard = `<button class="bf-option-card" type="button" data-owner><span class="bf-option-card-label">Workspace settings</span><span class="bf-option-card-meta">${bodyText}</span></button>`;
const modal = `<section class="bf-modal-dialog" data-owner><header class="bf-modal-header"><h2 class="bf-modal-title">Export image</h2><button class="bf-modal-close" type="button" aria-label="Close">Close</button></header><div class="bf-modal-body"><p class="bf-body">${bodyText}</p></div><footer class="bf-modal-footer"><button class="bf-button is-base" type="button">Cancel</button><button class="bf-button" type="button">Export</button></footer></section>`;
const panel = `<section class="bf-panel is-fill" data-owner><header class="bf-panel-header"><h2 class="bf-panel-title">Quick settings</h2></header><div class="bf-panel-content"><p class="bf-body">${bodyText}</p></div><footer class="bf-panel-footer"><button class="bf-button is-base" type="button">Cancel</button><button class="bf-button" type="button">Apply</button></footer></section>`;
const sideNavigation = `<div class="bf-side-navigation is-sticky is-drawer-expanded"><button class="bf-side-navigation-toggle" type="button">Toggle navigation</button><nav class="bf-panel bf-side-navigation bf-side-navigation-drawer" data-owner aria-label="Workspace navigation"><div class="bf-side-navigation-drawer-chrome"><div class="bf-panel-header is-navigation-brand"><span class="bf-top-navigation-logo-title">Baseline Foundry</span></div><div class="bf-side-navigation-drawer-header"><h2 class="bf-panel-title">Workspace</h2></div></div><div class="bf-side-navigation-drawer-body bf-side-navigation-groups"><section class="bf-side-navigation-group"><div class="bf-side-navigation-group-header"><h3 class="bf-side-navigation-heading">Projects</h3></div><ul class="bf-side-navigation-list"><li class="bf-side-navigation-item"><a class="bf-side-navigation-link" href="#">${bodyText}</a></li></ul></section></div></nav></div>`;
const tooltip = `<div class="bf-tooltip" data-tooltip-positioned><button class="bf-button is-base" type="button">Help</button><p class="bf-tooltip-message" aria-hidden="false" data-owner><span class="bf-tooltip-text">${bodyText}</span></p></div>`;

const rows = [
  ["Card · standard inset and section seam", "card", ["Paragraph reference", `<p class="bf-body surface-reference" data-target>${bodyText}</p>`, null], ["Current Card", card, null], ["Standard working candidate for O3", card, "standard"]],
  ["OptionCard · standard owner inset", "option", ["Paragraph reference", `<p class="bf-body surface-reference" data-target>${bodyText}</p>`, null], ["Current OptionCard", optionCard, null], ["Standard working candidate for O3", optionCard, "standard"]],
  ["Tooltip · compact field/control alias", "tooltip", ["Compact reference", `<p class="bf-body surface-reference" data-target>${bodyText}</p>`, null], ["Current selected compact surface", tooltip, null], ["Compact role relationship", tooltip, null]],
  ["Modal · major inline grid gutter", "modal", ["Paragraph reference", `<p class="bf-body surface-reference" data-target>${bodyText}</p>`, null], ["Current Modal", modal, null], ["Major inline working candidate for O3", modal, "major"]],
  ["SidePanel · major inline grid gutter", "panel", ["Paragraph reference", `<p class="bf-body surface-reference" data-target>${bodyText}</p>`, null], ["Current SidePanel", panel, null], ["Major inline working candidate for O3", panel, "major"]],
  ["SideNavigation · grid margin and label keyline", "navigation", ["Paragraph reference", `<p class="bf-body surface-reference" data-target>${bodyText}</p>`, null], ["Current public navigation anatomy", sideNavigation, null], ["Grid-margin working relationship for O3", sideNavigation, "navigation"]]
];

const rowsRoot = document.querySelector("#surface-rows");
const tracks = [];
for (const [title, kind, reference, current, candidate] of rows) {
  const section = document.createElement("section");
  section.className = "surface-row";
  section.dataset.kind = kind;
  section.innerHTML = `<h2 class="bf-h6">${title}</h2><div class="surface-track"><div class="bucket-guide-layer" aria-hidden="true"></div></div>`;
  const track = section.querySelector(".surface-track");
  for (const [caption, html, proposal] of [reference, current, candidate]) {
    const sample = document.createElement("article");
    sample.className = `surface-sample bucket-sample${proposal ? ` surface-working surface-working-${proposal}` : ""}`;
    sample.dataset.kind = kind;
    sample.dataset.caption = caption;
    sample.innerHTML = `<div class="surface-probe bucket-probe">${html}</div><span class="surface-caption">${caption}</span><pre hidden aria-label="Computed surface evidence"></pre>`;
    track.append(sample);
  }
  rowsRoot.append(section);
  tracks.push(track);
}

const px = value => `${Math.round(value * 100) / 100}px`;
const number = value => Number.parseFloat(value) || 0;
function edges(node, property) {
  const style = getComputedStyle(node);
  const start = number(style[`${property}InlineStart`]);
  const end = number(style[`${property}InlineEnd`]);
  const before = number(style[`${property}BlockStart`]);
  const after = number(style[`${property}BlockEnd`]);
  return { start, end, before, after };
}
function installTextMarker(sample) {
  const target = sample.querySelector("[data-target]") || (sample.dataset.kind === "navigation"
    ? sample.querySelector(".bf-side-navigation-heading")
    : sample.querySelector(".bf-tooltip-text, .bf-card-header h3, .bf-option-card-label, .bf-modal-title, .bf-panel-title"));
  if (target && !target.querySelector(".bucket-baseline-marker")) installBaselineMarker(target);
  return target;
}
function alignOwnerStartGuides(track, peers) {
  const trackBox = track.getBoundingClientRect();
  const marks = [...track.querySelectorAll(".bucket-guide-mark.is-top")];
  const owners = [peers[0]?.owner, ...peers.map(peer => peer.owner)];
  marks.forEach((mark, index) => {
    const owner = owners[index];
    if (!owner) return;
    const box = owner.getBoundingClientRect();
    const top = box.top - trackBox.top;
    mark.style.insetBlockStart = `${top}px`;
    if (mark.classList.contains("is-tick")) mark.style.insetInlineStart = `${box.left - trackBox.left + track.scrollLeft}px`;
    if (!mark.classList.contains("is-tick")) {
      peers.forEach(({ sample, owner: peerOwner }) => {
        const peerTop = sample.dataset.guideTop;
        sample.dataset.textPeerTop = peerTop;
        sample.dataset.guideTop = px(peerOwner.getBoundingClientRect().top - trackBox.top);
        const pre = sample.querySelector("pre");
        pre.textContent = pre.textContent.split("\n").map(line => line.startsWith("visible top ")
          ? `text peer top ${peerTop}; owner border-box top ${sample.dataset.guideTop}` : line).join("\n");
      });
    }
  });
}
function measure() {
  for (const track of tracks) {
    const peers = [];
    for (const sample of track.querySelectorAll(".surface-sample")) {
      const owner = sample.querySelector("[data-owner]");
      const target = installTextMarker(sample);
      if (!owner) {
        const referenceTarget = target || sample.querySelector(".surface-reference");
        peers.push({ sample, target: referenceTarget, owner: referenceTarget, metrics: "paragraph reference" });
        continue;
      }
      const style = getComputedStyle(owner);
      const pad = edges(owner, "padding");
      const margin = edges(owner, "margin");
      const pageMargin = getComputedStyle(owner).getPropertyValue("--bf-page-margin").trim() || "unavailable";
      const gutter = getComputedStyle(owner).getPropertyValue("--bf-side-navigation-gutter").trim() || "not exposed";
      const labelKeyline = getComputedStyle(owner).getPropertyValue("--bf-side-navigation-label-keyline").trim() || "not exposed";
      const sectionChildren = [...owner.children].filter(child => child.matches(".bf-section, .bf-card-header, .bf-card-content, .bf-modal-header, .bf-modal-body, .bf-modal-footer, .bf-panel-header, .bf-panel-content, .bf-panel-footer"));
      const sectionPadding = sectionChildren.map(child => {
        const p = edges(child, "padding");
        return `${child.className || child.tagName}: ${px(p.start)}/${px(p.end)} inline, ${px(p.before)}/${px(p.after)} block`;
      }).join("; ") || "no direct section children";
      const seam = sectionChildren.length > 1 ? sectionChildren.slice(1).map((second, index) => {
        const first = sectionChildren[index];
        const a = first.getBoundingClientRect();
        const b = second.getBoundingClientRect();
        const firstStyle = getComputedStyle(first);
        const lastStyle = getComputedStyle(second);
        const physical = b.top - a.bottom;
        const contentEnd = a.bottom - number(firstStyle.borderBlockEndWidth) - number(firstStyle.paddingBlockEnd);
        const contentStart = b.top + number(lastStyle.borderBlockStartWidth) + number(lastStyle.paddingBlockStart);
        return `${first.className} → ${second.className}: border seam ${px(physical)}, content-edge seam ${px(contentStart - contentEnd)} (content end padding ${firstStyle.paddingBlockEnd}, next start padding ${lastStyle.paddingBlockStart})`;
      }).join("; ") : "section seam unavailable";
      const tooltipText = owner.matches(".bf-tooltip-message") ? owner.querySelector(".bf-tooltip-text") : null;
      const tooltipTextPadding = tooltipText ? (() => { const p = edges(tooltipText, "padding"); return `${px(p.start)}/${px(p.end)} inline, ${px(p.before)}/${px(p.after)} block`; })() : "n/a";
      const scrollOwner = owner.matches(".bf-panel.bf-side-navigation") ? owner.querySelector(".bf-side-navigation-drawer-body")
        : owner.matches(".bf-card") ? owner.querySelector(".bf-card-scroll")
        : owner.matches(".bf-modal-dialog") ? owner.querySelector(".bf-modal-body")
        : owner.matches(".bf-panel") ? owner.querySelector(".bf-panel-content")
        : owner.closest(".bf-side-navigation");
      const overflow = `${style.overflowX}/${style.overflowY}`;
      const candidateLabel = sample.dataset.caption;
      const blockOwner = owner.matches(".bf-panel.bf-side-navigation") ? "SideNavigation's grid-margin gutter lives in --bf-side-navigation-gutter; the frame owns zero inset"
        : owner.matches(".bf-tooltip-message") ? "--bf-surface-compact-inset-inline → --bf-component-inline-inset-field; --bf-surface-compact-inset-block → --bf-control-block-inset"
        : owner.matches(".bf-card, .bf-option-card") ? "--bf-panel-padding-block and --bf-component-inline-inset-action (standard working alias)"
        : owner.matches(".bf-modal-dialog, .bf-panel") ? "current block owner retained; major inline working candidate is --bf-page-margin"
        : "SideNavigation internal grid gutter --bf-page-margin; frame stays zero-inset";
      const majorBlock = `${px(pad.before)}/${px(pad.after)} current only; no major block role selected`;
      const metrics = `owner ${owner.tagName.toLowerCase()}.${[...owner.classList].join(".")}; padding inline ${px(pad.start)}/${px(pad.end)}, block ${px(pad.before)}/${px(pad.after)}; margins inline ${px(margin.start)}/${px(margin.end)}, block ${px(margin.before)}/${px(margin.after)}\n` +
        `alias source ${blockOwner}; --bf-page-margin ${pageMargin}; side-navigation gutter ${gutter}; label keyline ${labelKeyline}; major block current ${majorBlock}\n` +
        `section child padding ${sectionPadding}; ${seam}\n` +
        (tooltipText ? `tooltip text-owner padding ${tooltipTextPadding}; frame padding above\n` : "") +
        `paint owner overflow ${overflow}; z-index ${style.zIndex}; named inner scroll region ${scrollOwner ? `${scrollOwner.className} (${getComputedStyle(scrollOwner).overflowX}/${getComputedStyle(scrollOwner).overflowY})` : "none in specimen"}; ${candidateLabel}`;
      sample.dataset.surfaceEvidence = metrics;
      peers.push({ sample, target, owner, metrics });
    }
    renderGuides(track, peers, 0);
    alignOwnerStartGuides(track, peers);
  }
}

document.querySelector("#spec-tier-stylesheet").addEventListener("load", () => document.fonts.ready.then(() => requestAnimationFrame(measure)));
window.addEventListener("resize", measure, { passive: true });
await initSpecRuntime();
await document.fonts.ready;
requestAnimationFrame(measure);
