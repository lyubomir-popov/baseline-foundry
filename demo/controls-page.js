import { initSpecRuntime } from "./spec-runtime.js";

void initSpecRuntime({
  initComponents({ initAccordions, initContextualMenus, initRangeControls, initTabs, initTooltips }) {
    initRangeControls();
    initTabs();
    initAccordions();
    initContextualMenus();
    initTooltips();
  }
});