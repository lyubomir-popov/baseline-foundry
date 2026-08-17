const THUMBNAIL_VERSION = "20260329-panel-refresh-19";

function screenshotUrl(href) {
  const slug = href.split("/").pop()?.replace(/\.html$/i, "");
  if (!slug) {
    return null;
  }

  return `../../tmp/screenshots/components/${slug}.png?v=${THUMBNAIL_VERSION}`;
}

function enhanceAtlas() {
  const componentItems = document.querySelectorAll("[data-component-atlas-item]");
  const patternItems = document.querySelectorAll("[data-pattern-atlas-item]");
  const items = [...componentItems, ...patternItems];
  if (items.length === 0) {
    return;
  }

  for (const item of items) {
    const link = item.querySelector("a");
    if (!(link instanceof HTMLAnchorElement)) {
      continue;
    }

    const name = link.textContent?.trim() ?? "";
    const meta = link.dataset.demoMeta ?? item.querySelector("[data-demo-meta]")?.textContent?.trim() ?? "";
    const imageUrl = screenshotUrl(link.getAttribute("href") ?? "");
    if (!imageUrl || !name) {
      continue;
    }

    const preview = document.createElement("span");
    preview.classList.add("bf-card-preview");

    const image = document.createElement("img");
    image.classList.add("bf-card-preview-image");
    image.src = imageUrl;
    image.alt = "";
    image.loading = "lazy";
    image.width = 360;
    image.height = 240;
    image.addEventListener("error", () => {
      preview.classList.add("is-missing");
      image.remove();
    });

    const label = document.createElement("span");
    label.classList.add("bf-body");
    label.textContent = name;

    preview.appendChild(image);

    if (meta) {
      link.title = meta;
    }

    link.textContent = "";
    link.classList.add("bf-card", "is-overlay", "is-preview");
    link.appendChild(preview);
    link.appendChild(label);
  }
}

enhanceAtlas();
