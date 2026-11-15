import { initSpecRuntime } from "../../spec-runtime.js";
import { installBaselineMarker, renderGuides } from "./bucket-guides.js";

const bodyCopy = "Active";
const stylesheet = document.querySelector("#spec-tier-stylesheet");
const tableTrack = document.querySelector("#density-track");
const osTrack = document.querySelector("#density-os-track");
const indicatorTrack = document.querySelector("#density-indicator-track");
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
  ["Leading-icon Button · text baseline", tableRow(`<button class="bf-button is-icon" type="button" data-target><span class="bf-icon is-search" aria-hidden="true"></span><span class="bf-button-label">Active</span></button>`, "Leading-icon table Button row"), "member"],
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
  ["Standalone Button · product default", `<button class="bf-button" type="button" data-target>Active</button>`, "standalone"],
  ["Standalone Chip · product default", `<span class="bf-chip" data-target><span class="bf-chip-value">Active</span></span>`, "standalone"],
  ["Standalone input · product default", `<span class="bf-field-boundary"><input class="bf-input" type="text" value="Standalone" aria-label="Standalone input" data-target /></span>`, "standalone"]
];

const osSpecimens = [
  ["OS plain-text table row · reference", tableRow(`<span class="bf-body" data-target>${bodyCopy}</span>`, "OS plain text reference row"), "plain"],
  ["OS generated Button", tableRow(`<button class="bf-button" type="button" data-target>Active</button>`, "OS shipping Button row"), "os-shipping"],
  ["OS generated Chip", tableRow(`<span class="bf-chip" data-target><span class="bf-chip-value">Active</span></span>`, "OS shipping Chip row"), "os-shipping"],
  ["OS generated input", tableRow(`<span class="bf-field-boundary"><input class="bf-input" type="text" value="Active" aria-label="OS shipping input" data-target /></span>`, "OS shipping input row"), "os-shipping"],
  ["OS 0-inset proposal · Button", tableRow(`<button class="bf-button" type="button" data-target>Active</button>`, "OS proposed Button row", { proposal: true }), "os-proposal"],
  ["OS 0-inset proposal · Chip", tableRow(`<span class="bf-chip" data-target><span class="bf-chip-value">Active</span></span>`, "OS proposed Chip row", { proposal: true }), "os-proposal"],
  ["OS 0-inset proposal · wrapped input", tableRow(`<span class="bf-field-boundary"><input class="bf-input" type="text" value="Active" aria-label="OS proposed input" data-target /></span>`, "OS proposed input row", { proposal: true }), "os-proposal"]
];

const baselineProbe = name => `<span class="bucket-baseline-marker" data-indicator-${name}-baseline aria-hidden="true"></span>`;

function staticNavigationLabel(text) {
  return `<span data-static-navigation-label>${baselineProbe("static-host")}${text}</span>`;
}

function staticNavigationChip({ badge = false, nested = false, wrappers = 0, value = "3" } = {}) {
  const badgeMarkup = badge ? `<span class="bf-badge" data-static-navigation-badge>3</span>` : "";
  let markup = `<span class="bf-chip${nested ? " is-nested" : ""}" data-static-navigation-chip><span class="bf-chip-value">${value}${baselineProbe("static-chip")}</span>${badgeMarkup}</span>`;
  for (let depth = 0; depth < wrappers; depth += 1) markup = `<span data-neutral-wrapper="${depth + 1}">${markup}</span>`;
  return markup;
}

function staticTabBadge({ wrappers = 0, value = "3" } = {}) {
  let markup = `<span class="bf-badge" data-static-navigation-badge>${value}${baselineProbe("static-badge")}</span>`;
  for (let depth = 0; depth < wrappers; depth += 1) markup = `<span data-neutral-wrapper="${depth + 1}">${markup}</span>`;
  return markup;
}

function staticTabComparison(equal, suffix) {
  const placement = equal ? "equal-tab" : "ordinary-tab";
  const variants = [
    ["plain", "false", "-1", ""],
    ["badge", "true", "0", staticTabBadge({ wrappers: equal ? 1 : 0 })],
    ["long-badge", "false", "-1", staticTabBadge({ wrappers: equal ? 2 : 0, value: "99+" })]
  ];
  const items = variants.map(([variant, selected, tabIndex, indicator], index) => `<li class="bf-tabs-item"><button id="density-${suffix}-tab-${index + 1}" class="bf-tabs-link" type="button" role="tab" aria-selected="${selected}" aria-controls="density-${suffix}-panel-${index + 1}" tabindex="${tabIndex}" data-static-navigation-host data-static-placement="${placement}" data-static-variant="${variant}">${staticNavigationLabel(equal ? "Quarterly release status" : "State")}${indicator}</button></li>`).join("");
  const panels = variants.map(([, selected], index) => `<div id="density-${suffix}-panel-${index + 1}" class="bf-tabs-panel" role="tabpanel" aria-hidden="${selected === "true" ? "false" : "true"}"><p class="bf-body">${suffix} selected state.</p></div>`).join("");
  return `<div class="bf-tabs${equal ? " is-equal density-static-equal-tabs" : ""}"><ul class="bf-tabs-list" role="tablist">${items}</ul>${panels}</div>`;
}

function staticSideNavigationComparison(rowKind, suffix) {
  const ownerClass = rowKind === "text" ? "bf-side-navigation-text" : "bf-side-navigation-link";
  const ownerTag = rowKind === "text" ? "span" : "a";
  const href = rowKind === "text" ? "" : ` href="#density-navigation-heading"`;
  const variants = [
    ["plain", ""],
    ["chip", `<span class="bf-side-navigation-status">${staticNavigationChip({ nested: rowKind === "text", wrappers: rowKind === "text" ? 2 : 0, value: "New" })}</span>`],
    ["badge", `<span class="bf-side-navigation-status">${staticNavigationChip({ badge: true, wrappers: 1, value: "New" })}</span>`]
  ];
  const items = variants.map(([variant, status]) => `<li class="bf-side-navigation-item"><${ownerTag} class="${ownerClass}"${href} data-static-navigation-host data-static-placement="side-navigation-${rowKind}" data-static-variant="${variant}"><span class="bf-side-navigation-label">${staticNavigationLabel("Quarterly review")}</span>${status}</${ownerTag}></li>`).join("");
  return `<nav class="bf-panel bf-side-navigation" aria-label="${rowKind === "text" ? "Inert" : "Linked"} density navigation"><div class="bf-side-navigation-groups"><section class="bf-side-navigation-group"><ul class="bf-side-navigation-list">${items}</ul></section></div></nav>`;
}

const deferredSpecimens = [
  ["Tabs Badge · static indicator", `<div class="bf-tabs"><ul class="bf-tabs-list" role="tablist"><li class="bf-tabs-item"><button id="density-tab-1" class="bf-tabs-link" type="button" role="tab" aria-selected="true" aria-controls="density-tabs-panel-1" tabindex="0" data-static-navigation-host data-static-placement="tab-original" data-static-variant="badge">${staticNavigationLabel("Status")} ${staticTabBadge()}</button></li><li class="bf-tabs-item"><button id="density-tab-2" class="bf-tabs-link" type="button" role="tab" aria-selected="false" aria-controls="density-tabs-panel-2" tabindex="-1">History</button></li></ul><div id="density-tabs-panel-1" class="bf-tabs-panel" role="tabpanel" aria-hidden="false"><p class="bf-body">Selected state.</p></div><div id="density-tabs-panel-2" class="bf-tabs-panel" role="tabpanel" aria-hidden="true"><p class="bf-body">Inactive state.</p></div></div>`, "supported-navigation"],
  ["SideNavigation Chip · automatic trailing seat", `<nav class="bf-panel bf-side-navigation" aria-label="Density navigation"><div class="bf-side-navigation-groups"><section class="bf-side-navigation-group"><div class="bf-side-navigation-group-header"><h3 class="bf-side-navigation-heading">Projects</h3></div><ul class="bf-side-navigation-list"><li class="bf-side-navigation-item" data-host-row><a class="bf-side-navigation-link" href="#" data-static-navigation-host data-static-placement="side-navigation-original" data-static-variant="chip"><span class="bf-side-navigation-label">${staticNavigationLabel("Quarterly review")}</span><span class="bf-side-navigation-status">${staticNavigationChip({ nested: true, value: "New" })}</span></a></li></ul></section></div></nav>`, "supported-navigation"],
  ["Ordinary Tabs · plain / Badge indicators", staticTabComparison(false, "ordinary"), "supported-navigation-comparison"],
  ["Equal Tabs · plain / Badge indicators", staticTabComparison(true, "equal"), "supported-navigation-comparison"],
  ["SideNavigation link rows · plain / Chip / Badge-in-Chip", staticSideNavigationComparison("link", "link"), "supported-navigation-comparison"],
  ["SideNavigation text row · automatic trailing seat", staticSideNavigationComparison("text", "text"), "supported-navigation-comparison"]
];
function indicatorChip(withBadge) {
  const badge = withBadge
    ? `<span class="bf-badge is-nested" data-indicator-badge>3${baselineProbe("badge")}</span>`
    : "";
  return `<span class="bf-chip is-nested" data-indicator-chip><span class="bf-chip-value">Active${baselineProbe("host")}</span>${badge}</span>`;
}

function indicatorPair(placement, withBadge, withoutBadge) {
  return `<div class="indicator-placement-pair" data-indicator-pair data-indicator-placement="${placement}">
    <div data-indicator-variant="with"><span class="indicator-variant-caption">With Badge</span>${withBadge}</div>
    <div data-indicator-variant="without"><span class="indicator-variant-caption">Without Badge</span>${withoutBadge}</div>
  </div>`;
}

function indicatorTable(withBadge, label) {
  return tableRow(indicatorChip(withBadge), label);
}

function indicatorNavigation(withBadge, label) {
  return `<nav class="bf-panel bf-side-navigation" aria-label="${label}"><div class="bf-side-navigation-groups"><section class="bf-side-navigation-group"><ul class="bf-side-navigation-list"><li class="bf-side-navigation-item"><a class="bf-side-navigation-link" href="#density-indicator-heading" data-indicator-host-row><span class="bf-side-navigation-label">State</span><span class="bf-side-navigation-status">${indicatorChip(withBadge)}</span></a></li></ul></section></div></nav>`;
}

function statusNavigation(withStatus, suffix) {
  const status = withStatus ? `<span class="bf-side-navigation-status"><span class="bf-status-label is-positive is-nested" data-indicator-invariant="status">Ready${baselineProbe("status")}</span></span>` : "";
  return `<nav class="bf-panel bf-side-navigation" aria-label="Status ${suffix}"><div class="bf-side-navigation-groups"><section class="bf-side-navigation-group"><ul class="bf-side-navigation-list"><li class="bf-side-navigation-item"><a class="bf-side-navigation-link" href="#density-indicator-heading" data-status-host-row><span class="bf-side-navigation-label" data-indicator-status-host-text>State${baselineProbe("status-host")}</span>${status}</a></li></ul></section></div></nav>`;
}

function statusTable(withStatus, label) {
  const status = withStatus ? `<span data-indicator-status-host-text>State${baselineProbe("status-host")}</span> <span class="bf-status-label is-positive is-nested" data-indicator-invariant="status">Ready${baselineProbe("status")}</span>` : "State";
  return tableRow(status, label);
}

const indicatorSpecimens = [
  ["Table cell · Badge-in-Chip fit", indicatorPair("table", indicatorTable(true, "Table Chip with Badge"), indicatorTable(false, "Table Chip without Badge")), "indicator-pair"],
  ["SideNavigation row · Badge-in-Chip fit", indicatorPair("side-navigation", indicatorNavigation(true, "Navigation Chip with Badge"), indicatorNavigation(false, "Navigation Chip without Badge")), "indicator-pair"],
  ["Badge and StatusLabel · standalone/default/dense invariance", `<div class="indicator-invariance" data-indicator-invariance>
    <div class="indicator-invariance-context" data-indicator-context="standalone"><span class="indicator-variant-caption">Standalone</span><span class="bf-badge" data-indicator-invariant="badge">3</span><span class="bf-status-label is-positive" data-indicator-invariant="status">Ready</span></div>
    <div class="indicator-invariance-context" data-indicator-context="default"><span class="indicator-variant-caption">Default nested</span>${statusNavigation(true, "default-with")}${statusNavigation(false, "default-without")}</div>
    <div class="indicator-invariance-context" data-indicator-context="dense"><span class="indicator-variant-caption">Dense table</span>${statusTable(true, "Dense StatusLabel row")}${statusTable(false, "Dense plain row")}</div>
  </div>`, "indicator-invariance"]
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
const indicatorSamples = createSamples(indicatorTrack, indicatorSpecimens);
for (const sample of indicatorSamples) sample.classList.add("density-indicator-sample");
const deferredSamples = createSamples(deferredTrack, deferredSpecimens);

const px = value => `${Math.round(value * 100) / 100}px`;
const tierName = () => document.body.dataset.bfTier || [...document.body.classList].find(name => name.startsWith("bf-tier-"))?.slice(8) || "unknown";
const bundleVersion = () => stylesheet instanceof HTMLLinkElement && /\/before\//.test(new URL(stylesheet.href).pathname) ? "before" : "after";
const isSupportedProduct = () => ["editorial", "documentation", "app", "os"].includes(tierName());

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
      ? `${base} · ${bundleVersion() === "after" ? "generated table seat" : "frozen historical bundle"}`
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
    const owner = sample.querySelector("[data-host-row]") || sample.querySelector("[role=tab]") || sample.querySelector(".bf-side-navigation-item") || target.closest(".bf-field-boundary") || target;
    const ownerBox = owner.getBoundingClientRect();
    const targetBox = target.getBoundingClientRect();
    const paintOwner = target.closest(".bf-field-boundary") || target;
    const paintBox = paintOwner.getBoundingClientRect();
    const targetStyle = getComputedStyle(target);
    const cellBox = cell?.getBoundingClientRect() ?? null;
    const cellStyle = cell ? getComputedStyle(cell) : null;
    const rowHeight = sample.querySelector("[data-host-row]")?.getBoundingClientRect().height ?? null;
    const comparisonHeight = sample.dataset.kind === "multiline" ? multilineReferenceHeight : referenceHeight;
    const startClearance = cellBox ? paintBox.top - cellBox.top : null;
    const endClearance = cellBox ? cellBox.bottom - paintBox.bottom : null;
    const selected = targetStyle.getPropertyValue("--bf-density-control-block-inset").trim() || "not exposed";
    const membership = production ? "automatic table-cell member"
      : proposal ? "review-only OS 0-inset proposal"
      : sample.dataset.kind === "deferred" ? "deferred Nav/Tabs diagnostic"
      : "product default / outside supported placement";
    const metrics = `loaded bundle ${bundleVersion()}; loaded tier ${tierName()}; ${membership}\n` +
      `host ${cell ? cell.tagName.toLowerCase() : owner.className || owner.tagName.toLowerCase()}; selected member ${selected}; line ${targetStyle.lineHeight}; padding ${targetStyle.paddingBlockStart}/${targetStyle.paddingBlockEnd}; margin ${targetStyle.marginBlockStart}/${targetStyle.marginBlockEnd}\n` +
      `target ${px(targetBox.width)}×${px(targetBox.height)}; host ${px(ownerBox.width)}×${px(ownerBox.height)}; row ${rowHeight === null ? "n/a" : px(rowHeight)}; row delta from ${sample.dataset.kind === "multiline" ? "two-line plain" : "one-line plain"} ${rowHeight === null || comparisonHeight === null ? "n/a" : px(rowHeight - comparisonHeight)}\n` +
      `paint owner ${paintOwner.className || paintOwner.tagName.toLowerCase()}; clearance start/end ${startClearance === null ? "n/a" : `${px(startClearance)}/${px(endClearance)}`}; cell padding ${cellStyle ? `${cellStyle.paddingBlockStart}/${cellStyle.paddingBlockEnd}` : "n/a"}; resize ${targetStyle.resize || "n/a"}; scroll ${target.scrollHeight ?? "n/a"}/${target.clientHeight ?? "n/a"}`;
    // Plain text is the row reference, not the padded rectangle of an inline
    // bf-body span. The actual text marker is still measured inside the row.
    peers.push({ sample, target: sample.dataset.kind === "plain" ? owner : target, owner, metrics, firstLineOnly: target.matches("textarea") });
  }
  const multilineIndex = samples.findIndex(sample => sample.dataset.kind === "multiline-reference");
  const standaloneIndex = samples.findIndex(sample => sample.dataset.kind === "standalone");
  const groups = standaloneIndex < 0 ? undefined : [
    { start: 0, end: multilineIndex - 1, reference: 0, name: "table-cell" },
    { start: multilineIndex, end: standaloneIndex - 1, reference: multilineIndex, name: "multiline-first-line" },
    { start: standaloneIndex, end: samples.length - 1, reference: 0, name: "standalone-default" }
  ];
  renderGuides(track, peers, 0, groups);
  const referenceBaseline = Number.parseFloat(samples[0].dataset.guideBaseline);
  for (const sample of samples) {
    const baseline = Number.parseFloat(sample.dataset.guideBaseline);
    const delta = Number.isFinite(baseline) && Number.isFinite(referenceBaseline) ? px(baseline - referenceBaseline) : "unavailable";
    const group = groups?.find(group => group.start <= samples.indexOf(sample) && samples.indexOf(sample) <= group.end);
    const groupBaseline = Number.parseFloat(samples[group?.reference ?? 0].dataset.guideBaseline);
    sample.dataset.contextReference = group?.name ?? "table-cell";
    sample.dataset.contextBaselineDelta = Number.isFinite(baseline) && Number.isFinite(groupBaseline) ? px(baseline - groupBaseline) : "unavailable";
    sample.dataset.outerBaselineDelta = delta;
    const pre = sample.querySelector("pre");
    const grid = getComputedStyle(document.body, "::after");
    const gridUnit = Number.parseFloat(grid.backgroundSize.split(" ").at(-1));
    const origin = document.body.getBoundingClientRect().top + window.scrollY + Number.parseFloat(grid.top);
    const absoluteBaseline = Number.isFinite(baseline) ? track.getBoundingClientRect().top + window.scrollY + baseline : null;
    const gridDelta = absoluteBaseline !== null && gridUnit > 0
      ? absoluteBaseline - origin - Math.round((absoluteBaseline - origin) / gridUnit) * gridUnit : null;
    sample.dataset.absoluteBaseline = absoluteBaseline === null ? "unavailable" : px(absoluteBaseline);
    sample.dataset.pageGridDelta = gridDelta === null ? "unavailable" : px(gridDelta);
    pre.textContent += `\nbaseline delta from original outer plain row ${delta}; context ${sample.dataset.contextReference}; context baseline delta ${sample.dataset.contextBaselineDelta}; absolute document baseline ${sample.dataset.absoluteBaseline}; page-grid boundary delta ${sample.dataset.pageGridDelta}; marker geometry ${sample.dataset.markerGeometry || "not recorded"}; external rig ${sample.dataset.externalRig || "not used"}`;
  }
}

function measureIndicatorTrack() {
  const resolveLength = (element, property) => {
    const probe = document.createElement("span");
    probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;inline-size:var(${property});block-size:0;padding:0;border:0`;
    element.append(probe);
    const value = probe.getBoundingClientRect().width;
    probe.remove();
    return value;
  };
  for (const sample of indicatorSamples) {
    const pre = sample.querySelector("pre");
    const pair = sample.querySelector("[data-indicator-pair]");
    if (pair) {
      const withBadge = pair.querySelector("[data-indicator-variant='with']");
      const withoutBadge = pair.querySelector("[data-indicator-variant='without']");
      const badge = withBadge.querySelector("[data-indicator-badge]");
      const chip = withBadge.querySelector("[data-indicator-chip]");
      const plainChip = withoutBadge.querySelector("[data-indicator-chip]");
      const host = withBadge.querySelector("[data-host-row], [data-indicator-host-row]");
      const plainHost = withoutBadge.querySelector("[data-host-row], [data-indicator-host-row]");
      const hostBaseline = withBadge.querySelector("[data-indicator-host-baseline]");
      const badgeBaseline = withBadge.querySelector("[data-indicator-badge-baseline]");
      const badgeStyle = getComputedStyle(badge);
      const chipStyle = getComputedStyle(chip);
      const badgeBox = badge.getBoundingClientRect();
      const chipBox = chip.getBoundingClientRect();
      const paintHeight = Number.parseFloat(badgeStyle.backgroundSize.split(",")[0].trim().split(/\s+/)[1]);
      const paintInset = (badgeBox.height - paintHeight) / 2;
      const chipStroke = resolveLength(chip, "--bf-stroke-width");
      const clearances = {
        blockStart: badgeBox.top + paintInset - (chipBox.top + chipStroke),
        blockEnd: chipBox.bottom - chipStroke - (badgeBox.bottom - paintInset),
        inlineStart: badgeBox.left - (chipBox.left + chipStroke),
        inlineEnd: chipBox.right - chipStroke - badgeBox.right
      };
      const metrics = {
        tier: tierName(),
        placement: pair.dataset.indicatorPlacement,
        fontSize: badgeStyle.fontSize,
        lineHeight: badgeStyle.lineHeight,
        baselineDelta: badgeBaseline.getBoundingClientRect().top - hostBaseline.getBoundingClientRect().top,
        chipHeight: chipBox.height,
        plainChipHeight: plainChip.getBoundingClientRect().height,
        hostHeight: host.getBoundingClientRect().height,
        plainHostHeight: plainHost.getBoundingClientRect().height,
        badgeLineBoxHeight: badgeBox.height,
        badgePaintHeight: paintHeight,
        paintInset,
        chipStroke,
        clearances
      };
      sample.dataset.indicatorMetrics = JSON.stringify(metrics);
      pre.textContent = JSON.stringify(metrics, null, 2);
      continue;
    }

    const contexts = [...sample.querySelectorAll("[data-indicator-context]")].map(context => ({
      name: context.dataset.indicatorContext,
      indicators: [...context.querySelectorAll("[data-indicator-invariant]")].map(indicator => {
        const style = getComputedStyle(indicator);
        const indicatorBaseline = indicator.querySelector("[data-indicator-status-baseline]");
        const hostBaseline = context.querySelector("[data-indicator-status-host-baseline]");
        return {
          kind: indicator.dataset.indicatorInvariant,
          fontSize: style.fontSize,
          lineHeight: style.lineHeight,
          height: indicator.getBoundingClientRect().height,
          baselineDelta: indicatorBaseline && hostBaseline
            ? indicatorBaseline.getBoundingClientRect().top - hostBaseline.getBoundingClientRect().top
            : null
        };
      }),
      hostHeights: [...context.querySelectorAll("[data-host-row], [data-status-host-row]")].map(host => host.getBoundingClientRect().height)
    }));
    sample.dataset.indicatorMetrics = JSON.stringify({ tier: tierName(), contexts });
    pre.textContent = JSON.stringify({ tier: tierName(), contexts }, null, 2);
  }
  document.body.dataset.indicatorMeasuredTier = tierName();
}

function measure() {
  syncOsProposalState();
  document.querySelector("#density-table-heading").textContent = tierName() === "os"
    ? "OS generated table controls"
    : "Supported table seats and standalone defaults";
  measureTrack(tableTrack, tableSamples);
  measureTrack(osTrack, osSamples);
  measureIndicatorTrack();
  document.body.dataset.densityMeasuredTier = tierName();
  document.body.dataset.densityMeasuredWidth = String(window.innerWidth);
  for (const sample of deferredSamples) {
    const caption = sample.querySelector(".density-caption");
    caption.textContent = `${sample.dataset.baseCaption} · approved static anatomy`;
    sample.querySelector("pre").textContent = `loaded bundle ${bundleVersion()}; loaded tier ${tierName()}; static Badge tabs and dense SideNavigation Chips; layout-neutral selected and focus paint; SideTab API absent`;
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
