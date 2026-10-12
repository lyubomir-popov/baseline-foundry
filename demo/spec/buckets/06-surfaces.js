import { initSpecRuntime } from "../../spec-runtime.js";
import { installBaselineMarker, renderGuides } from "./bucket-guides.js";
import { initPanelDrawers } from "../../../dist/index.js";

const bodyText = "Keep this surface close to its related workspace controls and notes.";
const modalBody = Array.from({ length: 18 }, (_, index) => `<p class="bf-body">${bodyText} The workflow keeps its header and footer in place while this content scrolls (${index + 1}).</p>`).join("");
const cardPreview = `<article class="bf-card is-preview bf-span-2" data-card-owner data-card-preview>
  <div class="bf-card-preview"><img class="bf-card-preview-image" src="../../assets/aspect-wide.svg" alt="Layered landscape preview" /></div>
  <header class="bf-card-header"><h3 class="bf-h5">Workspace</h3><p class="bf-h4">Project settings</p></header>
  <div class="bf-card-content"><p class="bf-body">${bodyText}</p><div class="bf-card-scroll" role="region" tabindex="0" aria-label="Wide Card content"><table class="bf-table"><thead><tr><th>Token</th><th>Editorial</th><th>Documentation</th><th>Application</th><th>Operating system</th></tr></thead><tbody><tr><td>Component inline inset</td><td>Action</td><td>Action</td><td>Action</td><td>Action</td></tr></tbody></table></div></div>
  <footer class="bf-card-content"><p class="bf-body">Updated today</p></footer>
</article>`;
const cardText = `<article class="bf-card bf-span-2" data-card-owner>
  <header class="bf-card-header"><h3 class="bf-h5">Recent files</h3><p class="bf-h4">No image preview</p></header>
  <div class="bf-card-content"><p class="bf-body">A regular Card keeps its text inside the public frame.</p></div>
  <footer class="bf-card-content"><p class="bf-body">Updated yesterday</p></footer>
</article>`;
const cardPair = `<div class="bf-grid surface-card-parent" data-card-parent>${cardPreview}${cardText}</div>`;
const optionCard = `<button class="bf-option-card" type="button" data-owner><span class="bf-option-card-label">Workspace settings</span><span class="bf-option-card-meta">${bodyText}</span></button>`;
const modalContent = `<section class="bf-modal-dialog" data-owner><header class="bf-modal-header"><h2 class="bf-modal-title">Export image</h2><button class="bf-modal-close" type="button" data-modal-close aria-label="Close">Close</button></header><div class="bf-modal-body" role="region" aria-label="Modal scroll content">${modalBody}</div><footer class="bf-modal-footer"><button class="bf-button is-base" type="button" data-modal-close>Cancel</button><button class="bf-button" type="button">Export</button></footer></section>`;
const modal = `<div class="surface-open-control"><button class="bf-button is-base" type="button" data-modal-open>Open modal proof</button></div><dialog class="bf-modal is-workflow surface-modal-proof" aria-label="Modal workflow spacing proof">${modalContent}</dialog>`;
let panelSequence = 0;
function makePanel() {
  const id = `surface-panel-${++panelSequence}`;
  return `<button class="bf-button is-base surface-open-control" type="button" data-panel-drawer-toggle aria-controls="${id}" aria-expanded="false">Open SidePanel proof</button><div class="bf-application surface-panel-stage"><main class="bf-main"><p class="bf-body">The stage stays in place while the settings drawer opens over it.</p></main><div class="bf-application-overlay" data-panel-drawer-close aria-controls="${id}" aria-hidden="true"></div><aside id="${id}" class="bf-aside is-overlay" aria-hidden="true" aria-label="Quick settings"><section class="bf-panel is-fill" data-owner><header class="bf-panel-header"><h2 class="bf-panel-title">Quick settings</h2><button class="bf-panel-toggle" type="button" data-panel-drawer-close data-panel-drawer-autofocus aria-controls="${id}">Close</button></header><div class="bf-panel-content"><p class="bf-body">${bodyText}</p><div class="bf-field"><label class="bf-form-label" for="${id}-name">Preset name</label><div class="bf-control"><span class="bf-field-boundary"><input id="${id}-name" class="bf-input" type="text" value="Studio export" /></span></div></div><div class="bf-field"><label class="bf-form-label" for="${id}-location">Output location</label><div class="bf-control"><span class="bf-field-boundary"><input id="${id}-location" class="bf-input" type="text" value="Workspace folder" /></span></div></div></div><footer class="bf-panel-footer"><button class="bf-button is-base" type="button">Cancel</button><button class="bf-button" type="button">Apply</button></footer></section></aside></div>`;
}
const sideNavigation = `<div class="bf-side-navigation is-sticky"><button class="bf-side-navigation-toggle" type="button">Toggle navigation</button><nav class="bf-panel bf-side-navigation bf-side-navigation-drawer" data-owner aria-label="Workspace navigation"><div class="bf-side-navigation-drawer-chrome"><div class="bf-panel-header is-navigation-brand"><span class="bf-top-navigation-logo-title">Baseline Foundry</span></div><div class="bf-side-navigation-drawer-header"><h2 class="bf-panel-title">Workspace</h2></div></div><div class="bf-side-navigation-drawer-body bf-side-navigation-groups"><section class="bf-side-navigation-group"><div class="bf-side-navigation-group-header"><h3 class="bf-side-navigation-heading">Projects</h3></div><ul class="bf-side-navigation-list"><li class="bf-side-navigation-item"><a class="bf-side-navigation-link" href="#">${bodyText}</a></li></ul></section></div></nav></div>`;
const tooltip = `<div class="bf-tooltip" data-tooltip-positioned><button class="bf-button is-base" type="button">Help</button><p class="bf-tooltip-message" aria-hidden="false" data-owner><span class="bf-tooltip-text">${bodyText}</span></p></div>`;

const rows = [
  ["Card · public BF groups and inset prototype", "card", ["Paragraph reference", `<p class="bf-body surface-reference" data-target>${bodyText}</p>`, null], ["Current BF group · preview and text Cards", cardPair, null], ["Inline-inset prototype · preview and text Cards", cardPair, "card"]],
  ["OptionCard · standard owner inset", "option", ["Paragraph reference", `<p class="bf-body surface-reference" data-target>${bodyText}</p>`, null], ["Current OptionCard", optionCard, null], ["Standard working candidate for O3", optionCard, "standard"]],
  ["Tooltip · compact field/control alias", "tooltip", ["Compact reference", `<p class="bf-body surface-reference" data-target>${bodyText}</p>`, null], ["Current selected compact surface", tooltip, null], ["Compact role relationship", tooltip, null]],
  ["Modal · major inline grid gutter", "modal", ["Paragraph reference", `<p class="bf-body surface-reference" data-target>${bodyText}</p>`, null], ["Current Modal · open-state proof", modal, null], ["Major inline working candidate · open-state proof", modal, "major"]],
  ["SidePanel · major inline grid gutter", "panel", ["Paragraph reference", `<p class="bf-body surface-reference" data-target>${bodyText}</p>`, null], ["Current SidePanel · open-state proof", makePanel(), null], ["Major inline working candidate · open-state proof", makePanel(), "major"]],
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
    : sample.dataset.kind === "panel" ? sample.querySelector("[data-panel-drawer-toggle]")
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
const tierName = () => [...document.body.classList].find(name => name.startsWith("bf-tier-"))?.slice("bf-tier-".length) || "unknown";
function openSnapshot(sample, container, owner) {
  const rect = owner.getBoundingClientRect();
  const frame = container.getBoundingClientRect();
  const style = getComputedStyle(owner);
  const margin = getComputedStyle(document.body).getPropertyValue("--bf-page-margin").trim() || "unavailable";
  const parts = [...owner.children].filter(child => child.matches(".bf-modal-header, .bf-modal-body, .bf-modal-footer, .bf-panel-header, .bf-panel-content, .bf-panel-footer")).map(child => {
    const partStyle = getComputedStyle(child);
    const partRect = child.getBoundingClientRect();
    const scroll = child.matches(".bf-modal-body, .bf-panel-content") ? `; client/scroll ${px(child.clientWidth)}×${px(child.clientHeight)}/${px(child.scrollWidth)}×${px(child.scrollHeight)}; overflow ${partStyle.overflowX}/${partStyle.overflowY}` : "";
    return `${child.className}: ${px(partRect.width)}×${px(partRect.height)} at ${px(partRect.left)},${px(partRect.top)}; padding ${partStyle.paddingInlineStart}/${partStyle.paddingInlineEnd} inline, ${partStyle.paddingBlockStart}/${partStyle.paddingBlockEnd} block; margin ${partStyle.marginInlineStart}/${partStyle.marginInlineEnd} inline, ${partStyle.marginBlockStart}/${partStyle.marginBlockEnd} block${scroll}`;
  }).join(" | ");
  return `width ${window.innerWidth}px; tier ${tierName()}; variant ${sample.dataset.caption}; status open; page margin ${margin}; overlay frame ${px(frame.width)}×${px(frame.height)} at ${px(frame.left)},${px(frame.top)}; owner ${px(rect.width)}×${px(rect.height)} at ${px(rect.left)},${px(rect.top)}; owner padding ${style.paddingInlineStart}/${style.paddingInlineEnd} inline, ${style.paddingBlockStart}/${style.paddingBlockEnd} block; ${parts}`;
}
function updateOpenEvidence() {
  for (const sample of document.querySelectorAll('.surface-sample[data-kind="modal"], .surface-sample[data-kind="panel"]')) {
    const modal = sample.dataset.kind === "modal";
    const container = modal ? sample.querySelector("dialog.surface-modal-proof") : sample.querySelector(".surface-panel-stage");
    const overlay = modal ? container : container?.querySelector(".bf-aside.is-overlay");
    const owner = modal ? container?.querySelector(".bf-modal-dialog") : container?.querySelector(".bf-panel");
    const isOpen = modal ? container?.open : overlay?.classList.contains("is-open");
    if (isOpen && owner) sample.dataset.lastOpenSnapshot = openSnapshot(sample, overlay, owner);
    const pre = sample.querySelector("pre");
    const base = pre.textContent.split("\n").filter(line => !line.startsWith("open state:") && !line.startsWith("last open snapshot:"));
    const status = isOpen ? `open state: OPEN · current geometry captured at ${window.innerWidth}px / ${tierName()}` : "open state: CLOSED · current open geometry n/a";
    const last = sample.dataset.lastOpenSnapshot || "not recorded";
    pre.textContent = `${base.join("\n")}\n${status}\nlast open snapshot: ${last}`;
  }
}
function measure() {
  for (const track of tracks) {
    const peers = [];
    for (const sample of track.querySelectorAll(".surface-sample")) {
      const owner = sample.querySelector("[data-owner]") || (sample.dataset.kind === "card" ? sample.querySelector(".bf-card") : null);
      const target = installTextMarker(sample);
      if (!owner) {
        const referenceTarget = target || sample.querySelector(".surface-reference");
        peers.push({ sample, target: referenceTarget, owner: referenceTarget, metrics: "paragraph reference" });
        continue;
      }
      const style = getComputedStyle(owner);
      const ownerRect = owner.getBoundingClientRect();
      const navigationRoot = sample.dataset.kind === "navigation" ? sample.querySelector(".bf-side-navigation.is-sticky") : null;
      const navigationState = navigationRoot
        ? [...navigationRoot.classList].filter(name => name.startsWith("is-drawer-")).join(" ") || "default"
        : "n/a";
      const navigationHidden = Boolean(navigationRoot && (style.display === "none" || ownerRect.width <= 0 || ownerRect.height <= 0));
      const pad = edges(owner, "padding");
      const margin = edges(owner, "margin");
      const pageMargin = getComputedStyle(owner).getPropertyValue("--bf-page-margin").trim() || "unavailable";
      const gutter = getComputedStyle(owner).getPropertyValue("--bf-side-navigation-gutter").trim() || "not exposed";
      const labelKeyline = getComputedStyle(owner).getPropertyValue("--bf-side-navigation-label-keyline").trim() || "not exposed";
      const sectionChildren = [...owner.children].filter(child => child.matches(".bf-section, .bf-card-preview, .bf-card-header, .bf-card-content, .bf-modal-header, .bf-modal-body, .bf-modal-footer, .bf-panel-header, .bf-panel-content, .bf-panel-footer"));
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
      const cardParent = sample.querySelector("[data-card-parent]");
      const cardParentEvidence = cardParent ? (() => {
        const cards = [...cardParent.querySelectorAll(":scope > .bf-card")];
        const parentStyle = getComputedStyle(cardParent);
        const firstRect = cards[0]?.getBoundingClientRect();
        const secondRect = cards[1]?.getBoundingClientRect();
        const preview = cards[0]?.querySelector(".bf-card-preview");
        const previewRect = preview?.getBoundingClientRect();
        const cardRect = cards[0]?.getBoundingClientRect();
        const cardDetails = cards.map((card, index) => {
          const cardStyle = getComputedStyle(card);
          const children = [...card.children].filter(child => child.matches(".bf-card-preview, .bf-card-header, .bf-card-content"));
          const seams = children.slice(1).map((child, seamIndex) => {
            const previous = children[seamIndex].getBoundingClientRect();
            const next = child.getBoundingClientRect();
            return `${children[seamIndex].className}→${child.className} ${px(next.top - previous.bottom)}`;
          }).join(", ") || "no adjacent section seam";
          return `Card ${index + 1} frame padding ${cardStyle.paddingInlineStart}/${cardStyle.paddingInlineEnd} inline, ${cardStyle.paddingBlockStart}/${cardStyle.paddingBlockEnd} block; group gap ${cardStyle.rowGap}; ${seams}`;
        }).join("; ");
        const physicalGap = firstRect && secondRect ? secondRect.left - firstRect.right : null;
        const previewBlockInset = previewRect && cardRect ? previewRect.top - cardRect.top : null;
        return `BF parent .bf-grid with ${cards.length} sibling flex Cards (no Card subgrid); computed column gap ${parentStyle.columnGap}, physical card gap ${physicalGap === null ? "unavailable" : px(physicalGap)}; preview inline inset ${previewRect && cardRect ? px(previewRect.left - cardRect.left) : "unavailable"}, block inset ${previewBlockInset === null ? "unavailable" : px(previewBlockInset)}, width ${previewRect ? px(previewRect.width) : "unavailable"} vs frame ${cardRect ? px(cardRect.width) : "unavailable"}; ${cardDetails}`;
      })() : "";
      const scrollOwner = owner.matches(".bf-panel.bf-side-navigation") ? owner.querySelector(".bf-side-navigation-drawer-body")
        : owner.matches(".bf-card") ? owner.querySelector(".bf-card-scroll")
        : owner.matches(".bf-modal-dialog") ? owner.querySelector(".bf-modal-body")
        : owner.matches(".bf-panel") ? owner.querySelector(".bf-panel-content")
        : owner.closest(".bf-side-navigation");
      const scrollEvidence = scrollOwner ? (() => {
        const scrollStyle = getComputedStyle(scrollOwner);
        return `named inner scroll region ${scrollOwner.className} (${scrollStyle.overflowX}/${scrollStyle.overflowY}); client/scroll ${px(scrollOwner.clientWidth)}×${px(scrollOwner.clientHeight)}/${px(scrollOwner.scrollWidth)}×${px(scrollOwner.scrollHeight)}`;
      })() : "named inner scroll region none in specimen";
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
        `section child padding ${sectionPadding}; ${seam}${cardParentEvidence ? `\n${cardParentEvidence}` : ""}\n` +
        (tooltipText ? `tooltip text-owner padding ${tooltipTextPadding}; frame padding above\n` : "") +
        `paint owner overflow ${overflow}; z-index ${style.zIndex}; ${scrollEvidence}; ${candidateLabel}` +
        (navigationRoot ? `\nnavigation state ${navigationState}; ${navigationHidden ? "drawer geometry unavailable while hidden or zero-sized" : `drawer owner ${px(ownerRect.width)}×${px(ownerRect.height)} at ${px(ownerRect.left)},${px(ownerRect.top)}`}` : "");
      sample.dataset.surfaceEvidence = metrics;
      if (sample.dataset.kind === "modal" || sample.dataset.kind === "panel") {
        sample.querySelector("pre").textContent = `${metrics}\noverlay geometry excluded from shared page guides; see open-state snapshot`;
      } else if (navigationHidden) {
        sample.dataset.guideTop = "unavailable (drawer hidden)";
        sample.dataset.guideBaseline = "unavailable (drawer hidden)";
        sample.dataset.guideOccupiedEnd = "unavailable (drawer hidden)";
        sample.dataset.baselineSource = "none (drawer hidden)";
        sample.querySelector("pre").textContent = `${metrics}\nvisible top unavailable (drawer hidden)\ntext baseline unavailable (drawer hidden)\noccupied end unavailable (drawer hidden)`;
      } else {
        peers.push({ sample, target, owner, metrics });
      }
    }
    renderGuides(track, peers, 0);
    alignOwnerStartGuides(track, peers);
  }
  updateOpenEvidence();
}

document.querySelector("#spec-tier-stylesheet").addEventListener("load", () => document.fonts.ready.then(() => requestAnimationFrame(measure)));
window.addEventListener("resize", measure, { passive: true });
await initSpecRuntime();
initPanelDrawers({ root: rowsRoot });
const navigationObserver = new MutationObserver(records => {
  if (records.some(record => record.attributeName === "class")) requestAnimationFrame(measure);
});
for (const navigationRoot of rowsRoot.querySelectorAll(".bf-side-navigation.is-sticky")) {
  navigationObserver.observe(navigationRoot, { attributes: true, attributeFilter: ["class"] });
}
for (const dialog of rowsRoot.querySelectorAll("dialog.surface-modal-proof")) dialog.addEventListener("close", () => requestAnimationFrame(measure));
document.addEventListener("click", event => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;
  const openButton = target.closest("[data-modal-open]");
  if (openButton) {
    const sample = openButton.closest(".surface-sample");
    const dialog = sample?.querySelector("dialog.surface-modal-proof");
    if (sample && dialog) {
      dialog.showModal();
      measure();
    }
    return;
  }
  const closeButton = target.closest("[data-modal-close]");
  const modalDialog = closeButton?.closest("dialog.surface-modal-proof") ?? (target.matches("dialog.surface-modal-proof[open]") ? target : null);
  if (modalDialog?.open) {
    modalDialog.close();
    measure();
    return;
  }
  if (target.closest("[data-panel-drawer-toggle], [data-panel-drawer-close], .bf-application-overlay")) {
    measure();
    setTimeout(measure, 220);
  }
});
await document.fonts.ready;
requestAnimationFrame(measure);
