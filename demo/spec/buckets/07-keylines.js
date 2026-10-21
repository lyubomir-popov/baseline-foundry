import { initSpecRuntime } from "../../spec-runtime.js";

const copy = "Nested labels keep one clear continuation edge.";
const accordion = `<div class="bf-accordion"><ul class="bf-accordion-list bf-stack is-dense"><li class="bf-accordion-group"><div class="bf-accordion-heading"><button class="bf-accordion-tab" type="button" aria-expanded="true" aria-controls="keyline-accordion-panel">Workspace settings</button></div><div id="keyline-accordion-panel" class="bf-accordion-panel" aria-hidden="false"><p class="bf-body" data-accordion-nested>${copy}</p></div></li></ul></div>`;
const navigation = `<section class="bf-panel" aria-label="Navigation with brand keyline"><header class="bf-panel-header is-navigation-brand"><div class="bf-top-navigation-logo is-canonical-tagged"><a class="bf-top-navigation-link" href="#"><span class="bf-top-navigation-logo-tag" aria-hidden="true"><img class="bf-top-navigation-logo-icon" src="../../assets/canonical-mark.svg" alt="" /></span><span class="bf-top-navigation-logo-title" data-brand-title>Baseline Foundry</span></a></div></header><div class="bf-panel-content is-flush"><nav class="bf-side-navigation" aria-label="Keyline navigation"><div class="bf-side-navigation-context-switcher"><label class="bf-side-navigation-context-switcher-label">Workspace</label><span class="bf-field-boundary"><select class="bf-input" aria-label="Workspace"><option>Research group</option><option>Delivery team</option></select></span></div><div class="bf-side-navigation-groups"><section class="bf-side-navigation-group"><div class="bf-side-navigation-group-header"><h3 class="bf-side-navigation-heading" data-nav-header>Projects</h3></div><ul class="bf-side-navigation-list"><li class="bf-side-navigation-item"><a class="bf-side-navigation-link" href="#"><span class="bf-side-navigation-label" data-nav-parent>Active work</span></a></li><li class="bf-side-navigation-item"><button class="bf-side-navigation-accordion-button" type="button" aria-expanded="true" aria-controls="keyline-nav-nested">Archive</button><ul id="keyline-nav-nested" class="bf-side-navigation-list" aria-expanded="true" aria-hidden="false"><li class="bf-side-navigation-item"><a class="bf-side-navigation-link" href="#"><span class="bf-side-navigation-label" data-nav-nested>Quarterly reviews</span></a></li></ul></li></ul></section><section class="bf-side-navigation-group"><div class="bf-side-navigation-group-header"><hr /><h3 class="bf-side-navigation-heading" data-nav-second-header>Reports</h3></div><ul class="bf-side-navigation-list"><li class="bf-side-navigation-item"><a class="bf-side-navigation-link" href="#"><span class="bf-side-navigation-label">Usage</span></a></li></ul></section></div></nav></div></section>`;

const directions = ["ltr", "rtl"];
const rows = document.querySelector("#keyline-rows");
const tracks = [];
for (const direction of directions) {
  const section = document.createElement("section");
  section.className = "keyline-row";
  section.innerHTML = `<h2 class="bf-h6">${direction.toUpperCase()} · parent and nested labels</h2><div class="keyline-track"><div class="keyline-guide-layer" aria-hidden="true"></div></div>`;
  const track = section.querySelector(".keyline-track");
  const specimens = [
    ["Accordion title reference", accordion, "accordion"],
    ["SideNavigation labels and ContextSwitcher", navigation, "navigation"]
  ];
  for (const [caption, html, kind] of specimens) {
    const sample = document.createElement("article");
    sample.className = "keyline-sample";
    sample.dir = direction;
    sample.dataset.caption = caption;
    sample.dataset.kind = kind;
    const uniqueHtml = html.replaceAll("keyline-accordion-panel", `keyline-${direction}-accordion-panel`).replaceAll("keyline-nav-nested", `keyline-${direction}-nav-nested`);
    sample.innerHTML = `${uniqueHtml}<span class="keyline-caption">${caption}</span><pre hidden aria-label="Computed keyline evidence"></pre>`;
    track.append(sample);
  }
  rows.append(section);
  tracks.push(track);
}

const px = value => `${Math.round(value * 100) / 100}px`;
function rangeRect(element) {
  if (!element) return null;
  const range = document.createRange();
  range.selectNodeContents(element);
  const rect = range.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0 ? rect : null;
}
function logicalStart(rect, box, direction) {
  if (!rect) return null;
  return direction === "rtl" ? box.right - rect.right : rect.left - box.left;
}
function addTick(layer, x, y) {
  if (x === null || y === null || !Number.isFinite(x) || !Number.isFinite(y)) return;
  const tick = document.createElement("span");
  tick.className = "keyline-tick";
  tick.style.insetInlineStart = `${x}px`;
  tick.style.insetBlockStart = `${y - 4}px`;
  layer.append(tick);
}
function measure() {
  for (const track of tracks) {
    const layer = track.querySelector(".keyline-guide-layer");
    layer.replaceChildren();
    layer.style.inlineSize = `${track.scrollWidth}px`;
    layer.style.blockSize = `${track.scrollHeight}px`;
    const trackRect = track.getBoundingClientRect();
    const samples = [...track.querySelectorAll(".keyline-sample")];
    const accordionSample = samples[0];
    const title = accordionSample.querySelector(".bf-accordion-tab");
    const titleRect = rangeRect(title);
    const titleX = titleRect
      ? (accordionSample.dir === "rtl" ? titleRect.right : titleRect.left) - trackRect.left + track.scrollLeft
      : null;
    if (titleX !== null) {
      const guide = document.createElement("span");
      guide.className = "keyline-guide";
      guide.style.insetInlineStart = `${titleX}px`;
      guide.style.blockSize = `${track.scrollHeight}px`;
      layer.append(guide);
    }
    for (const sample of samples) {
      const direction = sample.dir;
      const box = sample.getBoundingClientRect();
      const metrics = [];
      const ticks = [];
      if (sample.dataset.kind === "accordion") {
        const panel = sample.querySelector(".bf-accordion-panel");
        const nested = sample.querySelector("[data-accordion-nested]");
        const nestedRect = rangeRect(nested);
        const panelStyle = getComputedStyle(panel);
        const continuation = panelStyle.paddingInlineStart;
        const themeStyle = getComputedStyle(document.body);
        const fieldInset = themeStyle.getPropertyValue("--bf-component-inline-inset-field").trim();
        const iconSize = themeStyle.getPropertyValue("--bf-disclosure-icon-inline-size").trim();
        const markGap = themeStyle.getPropertyValue("--bf-disclosure-gap").trim();
        const titleStart = logicalStart(titleRect, box, direction);
        const nestedStart = logicalStart(nestedRect, box, direction);
        metrics.push(`parent field inset ${fieldInset}; disclosure mark size ${iconSize}; mark gap ${markGap}; computed continuation ${continuation}`);
        metrics.push(`title text-start ${titleStart === null ? "unavailable" : px(titleStart)}; nested text-start ${nestedStart === null ? "unavailable" : px(nestedStart)}; parent text ${titleRect ? px(titleRect.width) : "unavailable"}`);
        ticks.push([titleStart === null ? null : box.left - trackRect.left + track.scrollLeft + (direction === "rtl" ? box.width - titleStart : titleStart), titleRect ? titleRect.top - trackRect.top + track.scrollTop + titleRect.height / 2 : null]);
        ticks.push([nestedStart === null ? null : box.left - trackRect.left + track.scrollLeft + (direction === "rtl" ? box.width - nestedStart : nestedStart), nestedRect ? nestedRect.top - trackRect.top + track.scrollTop + nestedRect.height / 2 : null]);
        sample.dataset.labelStart = titleStart === null ? "unavailable" : px(titleStart);
      } else {
        const nav = sample.querySelector(".bf-side-navigation");
        const panel = sample.querySelector(".bf-panel");
        const navStyle = getComputedStyle(nav);
        const header = sample.querySelector("[data-nav-header]");
        const parent = sample.querySelector("[data-nav-parent]");
        const nested = sample.querySelector("[data-nav-nested]");
        const secondHeader = sample.querySelector("[data-nav-second-header]");
        const brandHeader = sample.querySelector(".bf-panel-header.is-navigation-brand");
        const brandTitle = sample.querySelector("[data-brand-title]");
        const brandMark = sample.querySelector(".bf-top-navigation-logo-icon");
        const select = sample.querySelector(".bf-side-navigation-context-switcher select");
        const headerStart = logicalStart(rangeRect(header), box, direction);
        const parentStart = logicalStart(rangeRect(parent), box, direction);
        const nestedStart = logicalStart(rangeRect(nested), box, direction);
        const secondHeaderStart = logicalStart(rangeRect(secondHeader), box, direction);
        const selectRect = select.getBoundingClientRect();
        const selectStyle = getComputedStyle(select);
        const selectBoxStart = logicalStart(selectRect, box, direction);
        const selectTextStart = selectBoxStart === null ? null : selectBoxStart + Number.parseFloat(selectStyle.paddingInlineStart || "0");
        const brandTitleStart = logicalStart(rangeRect(brandTitle), box, direction);
        const brandHeaderStyle = getComputedStyle(brandHeader);
        const brandHeaderStart = logicalStart(brandHeader.getBoundingClientRect(), box, direction);
        const brandMarkStart = brandMark?.getBoundingClientRect().width
          ? logicalStart(brandMark.getBoundingClientRect(), box, direction)
          : null;
        const gutter = navStyle.getPropertyValue("--bf-side-navigation-gutter").trim();
        const icon = navStyle.getPropertyValue("--bf-side-navigation-icon-size").trim();
        const markGap = navStyle.getPropertyValue("--bf-side-navigation-icon-gap").trim();
        const keyline = navStyle.getPropertyValue("--bf-side-navigation-label-keyline").trim();
        const pageMargin = getComputedStyle(document.body).getPropertyValue("--bf-page-margin").trim();
        metrics.push(`panel content gutter ${getComputedStyle(panel).getPropertyValue("--bf-panel-content-padding-inline").trim()}; navigation gutter ${gutter}; row icon/mark ${icon}; mark gap ${markGap}; computed row-label keyline ${keyline}; responsive page margin ${pageMargin}`);
        metrics.push(`brand header start ${brandHeaderStart === null ? "unavailable" : px(brandHeaderStart)}; brand header computed inset ${brandHeaderStyle.paddingInlineStart}; wordmark text-start ${brandTitleStart === null ? "unavailable" : px(brandTitleStart)}; shipped logo glyph start ${brandMarkStart === null ? "unavailable" : px(brandMarkStart)}; measured independently`);
        metrics.push(`group header ${headerStart === null ? "unavailable" : px(headerStart)}; parent label ${parentStart === null ? "unavailable" : px(parentStart)}; nested label ${nestedStart === null ? "unavailable" : px(nestedStart)}; second group header ${secondHeaderStart === null ? "unavailable" : px(secondHeaderStart)}`);
        metrics.push(`ContextSwitcher field box ${selectBoxStart === null ? "unavailable" : px(selectBoxStart)}; select text-start from computed field inset ${selectTextStart === null ? "unavailable" : px(selectTextStart)}; native option glyph bounds are not exposed`);
        if (parentStart !== null) {
          const guide = document.createElement("span");
          guide.className = "keyline-guide keyline-guide-nav";
          guide.style.insetInlineStart = `${box.left - trackRect.left + track.scrollLeft + (direction === "rtl" ? box.width - parentStart : parentStart)}px`;
          guide.style.blockSize = `${track.scrollHeight}px`;
          layer.append(guide);
        }
        for (const [element, start] of [[header, headerStart], [parent, parentStart], [nested, nestedStart], [secondHeader, secondHeaderStart]]) {
          const rect = rangeRect(element);
          if (rect && start !== null) ticks.push([direction === "rtl" ? rect.right - trackRect.left + track.scrollLeft : rect.left - trackRect.left + track.scrollLeft, rect.top - trackRect.top + track.scrollTop + rect.height / 2]);
        }
        if (selectRect.width > 0) {
          const x = direction === "rtl" ? selectRect.right - trackRect.left + track.scrollLeft : selectRect.left - trackRect.left + track.scrollLeft;
          ticks.push([x, selectRect.top - trackRect.top + track.scrollTop + selectRect.height / 2]);
          if (selectTextStart !== null) {
            const xText = direction === "rtl"
              ? box.right - (selectBoxStart + Number.parseFloat(selectStyle.paddingInlineStart || "0")) - trackRect.left + track.scrollLeft
              : selectRect.left - trackRect.left + track.scrollLeft + Number.parseFloat(selectStyle.paddingInlineStart || "0");
            ticks.push([xText, selectRect.top - trackRect.top + track.scrollTop + selectRect.height / 2]);
          }
        }
        sample.dataset.labelStart = headerStart === null ? "unavailable" : px(headerStart);
      }
      const pre = sample.querySelector("pre");
      pre.textContent = `width ${window.innerWidth}px; tier ${[...document.body.classList].find(name => name.startsWith("bf-tier-"))?.slice(8) || "unknown"}; direction ${direction}; ${metrics.join("\n")}`;
      const baseX = box.left - trackRect.left + track.scrollLeft;
      for (const [x, y] of ticks) addTick(layer, x, y);
      sample.dataset.sampleStart = px(baseX);
    }
  }
}

await initSpecRuntime({ initComponents: ({ initAccordions }) => initAccordions() });
document.querySelector("#spec-tier-stylesheet").addEventListener("load", () => document.fonts.ready.then(() => requestAnimationFrame(measure)));
window.addEventListener("resize", measure, { passive: true });
await document.fonts.ready;
requestAnimationFrame(measure);
