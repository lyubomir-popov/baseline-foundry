const TIER_CLASSES = ["bf-tier-editorial", "bf-tier-documentation", "bf-tier-app", "bf-tier-os"];
const TONE_CLASSES = ["is-dark", "is-light"];
const ROLE_CLASS = /^bf-(body|h[1-6])$/;

const roots = Array.from(document.querySelectorAll("[data-body-line-root]"));

// Nested comparison roots re-declare the root surface, so they must carry the page tier and tone.
function mirrorPageSurface() {
  const pageClasses = [...TIER_CLASSES, ...TONE_CLASSES].filter(name => document.body.classList.contains(name));
  for (const root of roots) {
    root.classList.remove(...TIER_CLASSES, ...TONE_CLASSES);
    root.classList.add(...pageClasses);
  }
}

function roleOf(element) {
  const roleClass = Array.from(element.classList).find(name => ROLE_CLASS.test(name));
  if (roleClass) return roleClass.slice(3);
  return /^H[1-6]$/.test(element.tagName) ? element.tagName.toLowerCase() : "body";
}

function rem(px, rootSize) {
  // Three decimals absorb Chromium's 1/64px layout snapping.
  return `${Number((px / rootSize).toFixed(3))}rem`;
}

function cell(text) {
  const td = document.createElement("td");
  td.textContent = text;
  return td;
}

function renderLedgers(rootSize) {
  for (const table of document.querySelectorAll("[data-body-line-ledger]")) {
    const flow = table.closest("section")?.querySelector("[data-body-line-flow='ledger']");
    const tbody = table.tBodies[0];
    if (!flow || !tbody) continue;

    const isOpted = flow.closest("[data-body-line-root]")?.classList.contains("is-body-line-rhythm") ?? false;
    const elements = Array.from(flow.children).flatMap(child =>
      child.matches("ul, ol") ? Array.from(child.children) : [child]
    );
    tbody.replaceChildren(...elements.map(element => {
      const role = roleOf(element);
      const styles = getComputedStyle(element);
      const variable = name => styles.getPropertyValue(`--bf-${role}-${name}`).trim() || "–";
      const occupied = element.getBoundingClientRect().height + Number.parseFloat(styles.marginBottom);
      const row = document.createElement("tr");
      row.append(
        cell(element.tagName === "P" || element.tagName === "LI" ? `${element.tagName.toLowerCase()} (${role})` : role),
        cell(variable("nudge-start")),
        cell(isOpted ? variable("phase-start") : "–"),
        cell(variable(isOpted ? "closure-end" : "margin-bottom")),
        cell(rem(occupied, rootSize))
      );
      return row;
    }));
  }
}

function renderGapReadouts(rootSize) {
  for (const readout of document.querySelectorAll("[data-body-line-gap-readout]")) {
    const stack = readout.closest("section")?.querySelector("[data-body-line-gap]");
    const prose = stack?.querySelector(".bf-prose");
    if (!stack || !prose) continue;
    const stackGap = Number.parseFloat(getComputedStyle(stack).rowGap);
    const proseGap = Number.parseFloat(getComputedStyle(prose).rowGap);
    readout.textContent = `Stack gap ${rem(stackGap, rootSize)}, prose gap ${rem(proseGap, rootSize)}.`;
  }
}

function render() {
  const rootSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
  renderLedgers(rootSize);
  renderGapReadouts(rootSize);
}

let renderFrame = 0;
function scheduleRender() {
  cancelAnimationFrame(renderFrame);
  renderFrame = requestAnimationFrame(render);
}

mirrorPageSurface();
new MutationObserver(() => {
  mirrorPageSurface();
  scheduleRender();
}).observe(document.body, { attributeFilter: ["class"], attributes: true });
new MutationObserver(scheduleRender).observe(document.documentElement, { attributeFilter: ["style"], attributes: true });
document.querySelector("#spec-tier-stylesheet")?.addEventListener("load", scheduleRender);
window.addEventListener("resize", scheduleRender, { passive: true });
document.fonts?.ready.then(scheduleRender);
scheduleRender();
