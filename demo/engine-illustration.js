const BASELINE_UNIT_REM = 0.5;

const SURFACE_DATA = {
  "ibm-plex-engine-smoke": {
    label: "IBM Plex Sans",
    summary: "IBM Plex Sans exposes the cap drift immediately because the raw and compensated lanes both stay at zero while the cap shortcut moves the line box.",
    roles: {
      h1: {
        raw: "0rem",
        compensated: "0rem",
        cap: "0.208rem",
        delta: "0.208rem"
      },
      h2: {
        raw: "0rem",
        compensated: "0rem",
        cap: "0.104rem",
        delta: "0.104rem"
      }
    }
  },
  "ubuntu-engine-smoke": {
    label: "Ubuntu Sans",
    summary: "Ubuntu Sans shows the useful middle state: raw metrics sit lower, compensated metrics pull back upward, and the cap shortcut lands close at H1 but drifts again at H2.",
    roles: {
      h1: {
        raw: "0.28rem",
        compensated: "0.22531rem",
        cap: "0.228rem",
        delta: "0.00269rem"
      },
      h2: {
        raw: "0.14rem",
        compensated: "0.09313rem",
        cap: "0.114rem",
        delta: "0.02087rem"
      }
    }
  }
};

function parseRem(remValue) {
  return Number.parseFloat(remValue.replace("rem", ""));
}

function toRemLiteral(value) {
  return `${Math.round(value * 100000) / 100000}rem`;
}

function nudgeEnd(startNudge) {
  const start = parseRem(startNudge);
  if (start === 0) {
    return "0rem";
  }

  return toRemLiteral(BASELINE_UNIT_REM - start);
}

function detectSurface() {
  const explicitSurface = document.body.dataset.bfTier;
  if (explicitSurface && explicitSurface in SURFACE_DATA) {
    return explicitSurface;
  }

  if (document.body.classList.contains("bf-surface-ubuntu-engine-smoke")) {
    return "ubuntu-engine-smoke";
  }

  return "ibm-plex-engine-smoke";
}

function largestDelta(surfaceKey) {
  const deltas = Object.values(SURFACE_DATA[surfaceKey].roles).map(role => parseRem(role.delta));
  return toRemLiteral(Math.max(...deltas));
}

function updateText(surfaceKey) {
  const surface = SURFACE_DATA[surfaceKey];

  document.querySelectorAll("[data-engine-font-label]").forEach(node => {
    node.textContent = surface.label;
  });

  document.querySelectorAll("[data-engine-largest-delta]").forEach(node => {
    node.textContent = largestDelta(surfaceKey);
  });

  document.querySelectorAll("[data-engine-summary]").forEach(node => {
    node.textContent = surface.summary;
  });

  for (const [roleName, values] of Object.entries(surface.roles)) {
    document.querySelectorAll(`[data-engine-role-delta="${roleName}"]`).forEach(node => {
      node.textContent = values.delta;
    });

    for (const [mode, value] of Object.entries(values)) {
      document.querySelectorAll(`[data-engine-table="${roleName}:${mode}"]`).forEach(node => {
        node.textContent = value;
      });
    }
  }
}

function updateCard(card, surfaceKey) {
  const roleName = card.dataset.engineRoleCard;
  const mode = card.dataset.engineMode;

  if (!roleName || !mode) {
    return;
  }

  const roleValues = SURFACE_DATA[surfaceKey].roles[roleName];
  if (!roleValues) {
    return;
  }

  const value = roleValues[mode];
  if (!value) {
    return;
  }

  card.classList.toggle("bf-engine-cap", mode === "cap");
  card.style.removeProperty(`--bf-${roleName}-nudge-start`);
  card.style.removeProperty(`--bf-${roleName}-nudge-end`);

  if (mode === "raw") {
    card.style.setProperty(`--bf-${roleName}-nudge-start`, value);
    card.style.setProperty(`--bf-${roleName}-nudge-end`, nudgeEnd(value));
  }

  const valueNode = card.querySelector("[data-engine-card-value]");
  if (valueNode) {
    valueNode.textContent = value;
  }
}

function render() {
  const surfaceKey = detectSurface();
  updateText(surfaceKey);
  document.querySelectorAll("[data-engine-card]").forEach(card => updateCard(card, surfaceKey));
}

let renderQueued = false;

function queueRender() {
  if (renderQueued) {
    return;
  }

  renderQueued = true;
  requestAnimationFrame(() => {
    renderQueued = false;
    render();
  });
}

document.addEventListener("change", event => {
  if (event.target instanceof HTMLSelectElement && event.target.matches("[data-page-chrome-tier-select]")) {
    queueRender();
  }
});

const bodyObserver = new MutationObserver(() => {
  queueRender();
});

bodyObserver.observe(document.body, {
  attributes: true,
  attributeFilter: ["class", "data-bf-tier"]
});

queueRender();