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

function rem(px, rootSize, decimals = 3) {
  return `${Number((px / rootSize).toFixed(decimals))}rem`;
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

    const isBaseline = flow.closest("[data-body-line-root]")?.classList.contains("is-baseline-rhythm") ?? false;
    // The body-line list is one container-owned block; the baseline-unit ledger still closes every item.
    const elements = Array.from(flow.children).flatMap(child =>
      child.matches("ul, ol") && isBaseline ? Array.from(child.children) : [child]
    );
    tbody.replaceChildren(...elements.map(element => {
      const role = roleOf(element);
      const styles = getComputedStyle(element);
      const variable = name => styles.getPropertyValue(`--bf-${role}-${name}`).trim() || "–";
      const isList = element.matches("ul, ol");
      const occupied = element.getBoundingClientRect().height + Number.parseFloat(styles.marginBottom);
      const tag = element.tagName.toLowerCase();
      const row = document.createElement("tr");
      row.append(
        cell(isList ? `${tag} (list block)` : tag === "p" || tag === "li" ? `${tag} (${role})` : role),
        cell(variable("nudge-start")),
        cell(isBaseline ? "–" : variable("phase-start")),
        cell(isBaseline ? variable("margin-bottom") : variable(isList ? "list-block-end" : "closure-end")),
        // Occupied heights are whole bU (0.25rem or 0.5rem); two decimals absorb Chromium's -1/64px layout drift.
        cell(rem(occupied, rootSize, 2))
      );
      return row;
    }));
  }
}

function renderGapReadouts(rootSize) {
  for (const readout of document.querySelectorAll("[data-body-line-gap-readout]")) {
    const column = readout.closest("section");
    const prose = column?.querySelector("[data-body-line-flow='prose-gap']");
    const stack = column?.querySelector("[data-body-line-flow='stack']");
    const [, first, second] = stack ? Array.from(stack.children) : [];
    if (!prose || !stack || !first || !second) continue;
    const proseGap = Number.parseFloat(getComputedStyle(prose).rowGap);
    const stackGap = Number.parseFloat(getComputedStyle(stack).rowGap);
    const firstStyles = getComputedStyle(first);
    const between = second.getBoundingClientRect().top - first.getBoundingClientRect().bottom - Number.parseFloat(firstStyles.marginBottom);
    readout.textContent = `Prose gap ${rem(proseGap, rootSize)}; stack gap ${rem(stackGap, rootSize)}, ${rem(Math.max(0, between), rootSize)} between two paragraphs.`;
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
