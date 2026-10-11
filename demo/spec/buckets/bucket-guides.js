// A zero-size inline box shares the browser's line baseline with DOM text.
// Native controls instead export their CSS baseline beside an external marker.

function addExternalRig(target) {
  const rig = document.createElement("span");
  rig.className = "bucket-external-rig";
  rig.setAttribute("aria-hidden", "true");
  const clone = target.cloneNode(true);
  clone.removeAttribute("id");
  clone.removeAttribute("name");
  clone.tabIndex = -1;
  clone.classList.add("bucket-external-clone");
  const marker = document.createElement("span");
  marker.className = "bucket-baseline-marker";
  rig.append(clone, marker);
  target.closest(".bucket-probe").append(rig);
}

export function installBaselineMarker(target) {
  if (target.matches("input, select")) {
    addExternalRig(target);
    return;
  }
  const before = target.getBoundingClientRect();
  const beforeStyle = getComputedStyle(target);
  const beforeFont = `${beforeStyle.font}|${beforeStyle.lineHeight}`;
  if (target.matches(".bf-button:not(.is-icon)")) addExternalRig(target);
  const text = [...target.querySelectorAll("*")].flatMap(element => [...element.childNodes])
    .concat([...target.childNodes])
    .find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
  if (!text) return;
  const label = document.createElement("span");
  label.className = "bucket-measured-text";
  const marker = document.createElement("span");
  marker.className = "bucket-baseline-marker";
  marker.setAttribute("aria-hidden", "true");
  text.replaceWith(label);
  label.append(text, marker);
  const after = target.getBoundingClientRect();
  const afterStyle = getComputedStyle(target);
  target.closest(".bucket-sample").dataset.markerGeometry =
    `${Math.round((after.width - before.width) * 100) / 100}px wide; ${Math.round((after.height - before.height) * 100) / 100}px tall; ${Math.round((after.top - before.top) * 100) / 100}px top; font ${beforeFont === `${afterStyle.font}|${afterStyle.lineHeight}` ? "unchanged" : "changed"}`;
}

const pixel = value => `${value}px`;
const format = value => `${Math.round(value * 100) / 100}px`;

function measureExternalBaseline(sample, target, box) {
  const rig = sample.querySelector(".bucket-external-rig");
  if (!rig) return null;
  const clone = rig.querySelector(".bucket-external-clone");
  const style = getComputedStyle(target);
  clone.style.font = style.font;
  clone.style.lineHeight = style.lineHeight;
  clone.style.boxSizing = style.boxSizing;
  clone.style.appearance = style.appearance;
  clone.style.paddingBlock = `${style.paddingBlockStart} ${style.paddingBlockEnd}`;
  clone.style.paddingInline = `${style.paddingInlineStart} ${style.paddingInlineEnd}`;
  clone.style.borderBlockStyle = `${style.borderBlockStartStyle} ${style.borderBlockEndStyle}`;
  clone.style.borderBlockWidth = `${style.borderBlockStartWidth} ${style.borderBlockEndWidth}`;
  clone.style.margin = "0";
  clone.style.inlineSize = pixel(box.width);
  clone.style.blockSize = pixel(box.height);
  const cloneBox = clone.getBoundingClientRect();
  const cloneStyle = getComputedStyle(clone);
  const match = Math.abs(cloneBox.width - box.width) < .02 && Math.abs(cloneBox.height - box.height) < .02
    && cloneStyle.font === style.font && cloneStyle.lineHeight === style.lineHeight
    && cloneStyle.paddingBlockStart === style.paddingBlockStart && cloneStyle.paddingBlockEnd === style.paddingBlockEnd
    && cloneStyle.paddingInlineStart === style.paddingInlineStart && cloneStyle.paddingInlineEnd === style.paddingInlineEnd
    && cloneStyle.appearance === style.appearance && cloneStyle.boxSizing === style.boxSizing;
  sample.dataset.externalRig = match ? "matched native clone box/font" : "unmatched native clone";
  return match ? box.top + rig.querySelector(".bucket-baseline-marker").getBoundingClientRect().top - cloneBox.top : null;
}

export function renderGuides(track, peers, reference) {
  const trackBox = track.getBoundingClientRect();
  const layer = track.querySelector(".bucket-guide-layer");
  layer.replaceChildren();
  const observations = peers.map(({ sample, target, owner, metrics }) => {
    const box = target.getBoundingClientRect();
    const ownerBox = owner.getBoundingClientRect();
    const native = target.matches("input, select");
    const marker = native ? null : target.querySelector(".bucket-baseline-marker");
    const externalBaseline = measureExternalBaseline(sample, target, box);
    sample.dataset.externalBaseline = externalBaseline === null ? "unavailable" : format(externalBaseline - trackBox.top);
    const baseline = native ? externalBaseline === null ? null : externalBaseline - trackBox.top
      : marker ? marker.getBoundingClientRect().top - trackBox.top : null;
    if (!native && sample.querySelector(".bucket-external-rig")) {
      sample.dataset.externalParity = externalBaseline === null ? "unmatched" : format(externalBaseline - marker.getBoundingClientRect().top);
    }
    const end = ownerBox.bottom + (parseFloat(getComputedStyle(owner).marginBlockEnd) || 0) - trackBox.top;
    const top = box.top - trackBox.top;
    const x = box.left - trackBox.left + track.scrollLeft;
    const reading = { top, baseline, end, x };
    sample.dataset.guideTop = format(top);
    sample.dataset.guideBaseline = baseline === null ? "unavailable (icon only or unmatched native rig)" : format(baseline);
    sample.dataset.baselineSource = native ? "native control CSS baseline from matched clone"
      : marker ? "inline browser layout marker" : "none (icon only)";
    sample.dataset.guideOccupiedEnd = format(end);
    sample.dataset.metrics = metrics;
    sample.querySelector("pre").textContent = `${metrics}\nvisible top ${format(top)}\ntext baseline ${sample.dataset.guideBaseline} (${sample.dataset.baselineSource})\noccupied end ${format(end)}`;
    return reading;
  });
  const referenceReading = observations[reference];
  const width = track.scrollWidth;
  const addMark = (kind, x, y, long) => {
    if (y === null) return;
    const mark = document.createElement("span");
    mark.className = `bucket-guide-mark is-${kind} ${long ? "is-line" : "is-tick"}`;
    mark.style.insetInlineStart = pixel(x);
    mark.style.insetBlockStart = pixel(y);
    mark.style.inlineSize = pixel(long ? width : 9);
    mark.style.blockSize = "1px";
    layer.append(mark);
  };
  addMark("top", 0, referenceReading.top, true);
  addMark("baseline", 0, referenceReading.baseline, true);
  addMark("end", 0, referenceReading.end, true);
  for (const { top, baseline, end, x } of observations) {
    addMark("top", x, top, false);
    addMark("baseline", x, baseline, false);
    addMark("end", x, end, false);
  }
}
