      import { initSpecRuntime } from "../../spec-runtime.js";

      const peers = [
        ["Body paragraph", '<p>Body paragraph</p>'],
        ["Plain Button", '<button class="bf-button" type="button">Button</button>'],
        ["Leading icon Button", '<button class="bf-button is-icon" type="button"><span class="bf-icon is-search" aria-hidden="true"></span><span class="bf-button-label">Search</span></button>'],
        ["Icon-only Button", '<button class="bf-button is-icon" type="button" aria-label="Search"><span class="bf-icon is-search" aria-hidden="true"></span></button>'],
        ["Standalone Chip", '<button class="bf-chip" type="button"><span class="bf-chip-value">Chip</span></button>'],
        ["Text input", '<span class="bf-field-boundary"><input class="bf-input" type="text" value="Text input" aria-label="Text input" /></span>'],
        ["Password input", '<span class="bf-field-boundary"><input class="bf-input" type="password" value="password" aria-label="Password input" /></span>'],
        ["Number input", '<span class="bf-field-boundary"><input class="bf-input" type="number" value="42" aria-label="Number input" /></span>'],
        ["Select", '<span class="bf-field-boundary"><select aria-label="Select"><option>Select an option</option></select></span>'],
        ["Tabs · active/inactive", '<div class="bf-tabs"><ul class="bf-tabs-list" role="tablist"><li class="bf-tabs-item"><button class="bf-tabs-link is-active" type="button" role="tab" aria-selected="true" tabindex="0">Active</button></li><li class="bf-tabs-item"><button class="bf-tabs-link" type="button" role="tab" aria-selected="false" tabindex="-1">Inactive</button></li></ul></div>'],
        ["SegmentedControl item", '<div class="bf-segmented-control"><ul class="bf-segmented-control-list"><li class="bf-segmented-control-item"><button class="bf-segmented-control-button" type="button">Segment</button></li></ul></div>'],
        ["Pagination item", '<nav class="bf-pagination" aria-label="Bucket pagination"><ul class="bf-pagination-items"><li class="bf-pagination-item"><a class="bf-pagination-link" href="#bucket-rows">1</a></li></ul></nav>'],
        ["Contextual menu set", '<ul class="bf-contextual-menu-dropdown" aria-hidden="false"><li class="bf-contextual-menu-group"><button class="bf-contextual-menu-link" type="button">Open</button><button class="bf-contextual-menu-link" type="button">Save</button></li></ul>'],
        ["Top navigation menu set", '<ul class="bf-top-navigation-dropdown" aria-hidden="false"><li><a class="bf-top-navigation-dropdown-item" href="#bucket-rows">Open</a></li><li><a class="bf-top-navigation-dropdown-item" href="#bucket-rows">Save</a></li></ul>']
      ];
      const container = document.querySelector("#bucket-rows");
      const section = document.createElement("section");
      section.className = "bucket-row";
      section.innerHTML = '<h2 class="bf-h6">Shipped peers</h2><div class="bucket-track"></div>';
      const track = section.querySelector(".bucket-track");
      peers.forEach(([caption, html]) => {
        const sample = document.createElement("div");
        sample.className = "bucket-sample";
        sample.innerHTML = `<span class="bucket-caption">${caption}</span><div class="bucket-probe">${html}</div><pre aria-label="Computed geometry"></pre>`;
        track.append(sample);
      });
      container.append(section);

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
          const target = element.matches(".bf-field-boundary, .bf-tabs, .bf-segmented-control, .bf-pagination, .bf-contextual-menu-dropdown, .bf-top-navigation-dropdown")
            ? element.querySelector("input, select, .bf-tabs-link, .bf-segmented-control-button, .bf-pagination-link, .bf-contextual-menu-link, .bf-top-navigation-dropdown-item") : element;
          const owner = element.matches(".bf-field-boundary, .bf-contextual-menu-dropdown, .bf-top-navigation-dropdown")
            ? element : element.matches(".bf-tabs") ? element.querySelector(".bf-tabs-list") : target;
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
          const groupedRows = element.matches(".bf-contextual-menu-dropdown, .bf-top-navigation-dropdown")
            ? [...element.querySelectorAll(".bf-contextual-menu-link, .bf-top-navigation-dropdown-item")]
            : element.matches(".bf-tabs") ? [target] : [];
          const closure = groupedRows.length ? ownerBox.height + margin - groupedRows.reduce((sum, row) => sum + row.getBoundingClientRect().height, 0) : 0;
          sample.dataset.baseline = String(baseline);
          sample.dataset.metrics = `font ${style.fontSize} / ${style.lineHeight}\ninset ${format(inset)} · nudge ${format(nudge)}\npad ${style.paddingBlockStart} / ${style.paddingBlockEnd}\nend margin ${format(margin)}${owner === target ? "" : " (owner)"}\nvisible ${format(box.height)} · occupied ${format(ownerBox.height + margin)}${groupedRows.length ? `\nset closure ${format(closure)}` : ""}\nborders ${style.borderBlockStartWidth} / ${style.borderBlockEndWidth}\nbaseline estimate ${format(baseline)}`;
        }
        const lines = new Map();
        for (const sample of document.querySelectorAll(".bucket-sample")) {
          const top = Math.round(sample.getBoundingClientRect().top);
          if (!lines.has(top)) lines.set(top, []);
          lines.get(top).push(sample);
        }
        for (const samples of lines.values()) {
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
