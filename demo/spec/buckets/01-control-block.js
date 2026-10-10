      import { initSpecRuntime } from "../../spec-runtime.js";

      const rows = [
        ["Plain Button", '<button class="bf-button" type="button">Button</button>'],
        ["Leading icon Button", '<button class="bf-button is-icon" type="button"><span class="bf-icon is-search" aria-hidden="true"></span><span class="bf-button-label">Search</span></button>'],
        ["Icon-only Button", '<button class="bf-button is-icon" type="button" aria-label="Search"><span class="bf-icon is-search" aria-hidden="true"></span></button>'],
        ["Standalone Chip", '<button class="bf-chip" type="button"><span class="bf-chip-value">Chip</span></button>'],
        ["Text input", '<span class="bf-field-boundary"><input class="bf-input" type="text" value="Text input" aria-label="Text input" /></span>'],
        ["Select", '<span class="bf-field-boundary"><select aria-label="Select"><option>Select an option</option></select></span>'],
        ["Tab", '<div class="bf-tabs"><ul class="bf-tabs-list" role="tablist"><li class="bf-tabs-item"><button class="bf-tabs-link" type="button" role="tab" aria-selected="true">Tab</button></li></ul></div>'],
        ["SegmentedControl item", '<div class="bf-segmented-control"><ul class="bf-segmented-control-list"><li class="bf-segmented-control-item"><button class="bf-segmented-control-button" type="button">Segment</button></li></ul></div>'],
        ["Pagination item", '<nav class="bf-pagination" aria-label="Bucket pagination"><ul class="bf-pagination-items"><li class="bf-pagination-item"><a class="bf-pagination-link" href="#bucket-rows">1</a></li></ul></nav>'],
        ["Contextual menu item", '<button class="bf-contextual-menu-link" type="button">Menu item</button>'],
        ["Top navigation menu item", '<a class="bf-top-navigation-dropdown-item" href="#bucket-rows"><span class="bf-top-navigation-dropdown-item-label">Navigation item</span></a>']
      ];
      const container = document.querySelector("#bucket-rows");
      rows.forEach(([name, html]) => {
        const section = document.createElement("section");
        section.className = "bucket-row";
        section.innerHTML = `<h2 class="bf-h6">${name}</h2><div class="bucket-track"></div>`;
        const track = section.querySelector(".bucket-track");
        ["Body paragraph", "Plain Button", name].forEach((caption, peer) => {
          const sample = document.createElement("div");
          sample.className = "bucket-sample";
          sample.innerHTML = `<span class="bucket-caption">${caption}</span><div class="bucket-probe">${peer === 0 ? "<p>Body paragraph</p>" : peer === 1 ? '<button class="bf-button" type="button">Button</button>' : html}</div><pre aria-label="Computed geometry"></pre>`;
          track.append(sample);
        });
        container.append(section);
      });

      const format = value => `${Math.round(value * 100) / 100}px`;
      function updateMeasurements() {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const paragraph = document.querySelector(".bucket-row .bucket-sample p");
        const nudge = parseFloat(getComputedStyle(paragraph).paddingBlockStart);
        const insetProbe = document.createElement("div");
        insetProbe.style.cssText = "position:absolute;visibility:hidden;padding-block-start:var(--bf-control-block-inset);";
        document.body.append(insetProbe);
        const controlInset = parseFloat(getComputedStyle(insetProbe).paddingBlockStart);
        insetProbe.remove();
        for (const sample of document.querySelectorAll(".bucket-sample")) {
          const probe = sample.querySelector(".bucket-probe");
          const element = probe.firstElementChild;
          const target = element.matches(".bf-field-boundary, .bf-tabs, .bf-segmented-control, .bf-pagination")
            ? element.querySelector("input, select, .bf-tabs-link, .bf-segmented-control-button, .bf-pagination-link") : element;
          const owner = element.matches(".bf-field-boundary") ? element : target;
          const style = getComputedStyle(target);
          const ownerStyle = getComputedStyle(owner);
          const box = target.getBoundingClientRect();
          const ownerBox = owner.getBoundingClientRect();
          const probeBox = probe.getBoundingClientRect();
          const margin = parseFloat(ownerStyle.marginBlockEnd) || 0;
          const line = parseFloat(style.lineHeight) || 0;
          context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
          const metrics = context.measureText("Hgp");
          const ascent = metrics.fontBoundingBoxAscent || parseFloat(style.fontSize) * .8;
          const descent = metrics.fontBoundingBoxDescent || parseFloat(style.fontSize) * .2;
          const baseline = box.top - probeBox.top + parseFloat(style.paddingBlockStart) + (line - ascent - descent) / 2 + ascent;
          probe.style.setProperty("--bucket-baseline", format(baseline));
          const inset = target.matches("p") ? 0 : controlInset;
          sample.dataset.baseline = String(baseline);
          sample.dataset.metrics = `font ${style.fontSize} / ${style.lineHeight}\ninset ${format(inset)} · nudge ${format(nudge)}\npad ${style.paddingBlockStart} / ${style.paddingBlockEnd}\nend ${format(margin)}${owner === target ? "" : " (wrapper)"}\nvisible ${format(ownerBox.height)} · occupied ${format(ownerBox.height + margin)}\nborders ${style.borderBlockStartWidth} / ${style.borderBlockEndWidth}\nbaseline estimate ${format(baseline)}`;
        }
        for (const row of document.querySelectorAll(".bucket-row")) {
          const samples = [...row.querySelectorAll(".bucket-sample")];
          const commonBaseline = Math.max(...samples.map(sample => Number(sample.dataset.baseline)));
          for (const sample of samples) {
            const shift = commonBaseline - Number(sample.dataset.baseline);
            sample.querySelector(".bucket-probe").style.setProperty("--bucket-shift", format(shift));
          }
          const reference = samples[0].querySelector(".bucket-probe").getBoundingClientRect().top + Number(samples[0].dataset.baseline);
          for (const sample of samples) {
            const actual = sample.querySelector(".bucket-probe").getBoundingClientRect().top + Number(sample.dataset.baseline);
            sample.querySelector("pre").textContent = `${sample.dataset.metrics}\nestimated delta ${format(actual - reference)}`;
          }
        }
      }
      const stylesheet = document.querySelector("#spec-tier-stylesheet");
      stylesheet.addEventListener("load", () => document.fonts.ready.then(() => requestAnimationFrame(updateMeasurements)));
      window.addEventListener("resize", updateMeasurements, { passive: true });
      await initSpecRuntime();
      await document.fonts.ready;
      requestAnimationFrame(updateMeasurements);
