      import { initSpecRuntime } from "../../spec-runtime.js";
      import { installBaselineMarker, renderGuides } from "./bucket-guides.js";

      const peers = [
        ["Body paragraph", '<p>Body paragraph</p>'],
        ["Plain Button", '<button class="bf-button" type="button">Button</button>'],
        ["Leading icon Button", '<button class="bf-button is-icon" type="button"><span class="bf-icon is-search" aria-hidden="true"></span><span class="bf-button-label">Search</span></button>'],
        ["Icon-only Button", '<button class="bf-button is-icon" type="button" aria-label="Search"><span class="bf-icon is-search" aria-hidden="true"></span></button>'],
        ["Standalone Chip", '<button class="bf-chip" type="button"><span class="bf-chip-value">Chip</span></button>'],
        ["Text input", '<span class="bf-field-boundary"><input class="bf-input" type="text" value="Text input" aria-label="Text input" /></span>', "calc(10ch + 2rem)"],
        ["Password", '<span class="bf-field-boundary"><input class="bf-input" type="password" value="password" aria-label="Password input" /></span>', "calc(9ch + 2rem)"],
        ["Number", '<span class="bf-field-boundary"><input class="bf-input" type="number" value="42" aria-label="Number input" /></span>', "calc(4ch + 3rem)"],
        ["Select", '<span class="bf-field-boundary"><select aria-label="Select"><option>Select an option</option></select></span>', "calc(16ch + 3rem)"],
        ["Tabs · active/inactive", '<div class="bf-tabs"><ul class="bf-tabs-list" role="tablist"><li class="bf-tabs-item"><button class="bf-tabs-link is-active" type="button" role="tab" aria-selected="true" tabindex="0">Active</button></li><li class="bf-tabs-item"><button class="bf-tabs-link" type="button" role="tab" aria-selected="false" tabindex="-1">Inactive</button></li></ul></div>'],
        ["Segmented", '<div class="bf-segmented-control"><ul class="bf-segmented-control-list"><li class="bf-segmented-control-item"><button class="bf-segmented-control-button" type="button">Segment</button></li></ul></div>'],
        ["Pagination", '<nav class="bf-pagination" aria-label="Bucket pagination"><ul class="bf-pagination-items"><li class="bf-pagination-item"><a class="bf-pagination-link" href="#bucket-rows">1</a></li></ul></nav>'],
        ["Menu set", '<ul class="bf-contextual-menu-dropdown" aria-hidden="false"><li class="bf-contextual-menu-group"><button class="bf-contextual-menu-link" type="button">Open</button></li></ul>'],
        ["Nav menu", '<ul class="bf-top-navigation-dropdown" aria-hidden="false"><li><a class="bf-top-navigation-dropdown-item" href="#bucket-rows">Open</a></li></ul>']
      ];
      const container = document.querySelector("#bucket-rows");
      const section = document.createElement("section");
      section.className = "bucket-row";
      section.innerHTML = '<h2 class="bf-h6">Shipped peers</h2><div class="bucket-track"><div class="bucket-guide-layer" aria-hidden="true"></div></div>';
      const track = section.querySelector(".bucket-track");
      peers.forEach(([caption, html, width]) => {
        const sample = document.createElement("div");
        sample.className = "bucket-sample";
        sample.innerHTML = `<div class="bucket-probe">${html}</div><span class="bucket-caption">${caption}</span><pre hidden aria-label="Computed geometry"></pre>`;
        if (width) sample.style.setProperty("--sample-width", width);
        track.append(sample);
      });
      container.append(section);

      const format = value => `${Math.round(value * 100) / 100}px`;
      function updateMeasurements() {
        const paragraph = document.querySelector(".bucket-row .bucket-sample p");
        const nudge = parseFloat(getComputedStyle(paragraph).paddingBlockStart);
        const insetProbe = document.createElement("div");
        insetProbe.style.cssText = "position:absolute;visibility:hidden;padding-block-start:var(--bf-control-block-inset);";
        document.body.append(insetProbe);
        const controlInset = parseFloat(getComputedStyle(insetProbe).paddingBlockStart);
        insetProbe.remove();
        const observations = [];
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
          const margin = parseFloat(ownerStyle.marginBlockEnd) || 0;
          const inset = target.matches("p") ? 0 : controlInset;
          const groupedRows = element.matches(".bf-contextual-menu-dropdown, .bf-top-navigation-dropdown")
            ? [...element.querySelectorAll(".bf-contextual-menu-link, .bf-top-navigation-dropdown-item")]
            : element.matches(".bf-tabs") ? [target] : [];
          const closure = groupedRows.length ? ownerBox.height + margin - groupedRows.reduce((sum, row) => sum + row.getBoundingClientRect().height, 0) : 0;
          const metrics = `font ${style.fontSize} / ${style.lineHeight}\ninset ${format(inset)} · nudge ${format(nudge)}\npad ${style.paddingBlockStart} / ${style.paddingBlockEnd}\nend margin ${format(margin)}${owner === target ? "" : " (owner)"}\nvisible ${format(box.height)} · occupied ${format(ownerBox.height + margin)}${groupedRows.length ? `\nset closure ${format(closure)} (group)` : ""}\nborders ${style.borderBlockStartWidth} / ${style.borderBlockEndWidth}`;
          if (!sample.dataset.markerInstalled) {
            installBaselineMarker(target);
            sample.dataset.markerInstalled = "true";
          }
          observations.push({ sample, target, owner, metrics });
        }
        renderGuides(track, observations, 1);
      }
      const stylesheet = document.querySelector("#spec-tier-stylesheet");
      stylesheet.addEventListener("load", () => document.fonts.ready.then(() => requestAnimationFrame(updateMeasurements)));
      window.addEventListener("resize", updateMeasurements, { passive: true });
      await initSpecRuntime();
      await document.fonts.ready;
      requestAnimationFrame(updateMeasurements);
