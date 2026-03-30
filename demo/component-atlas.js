const THUMBNAIL_VERSION = "20260329-panel-refresh-19";

function screenshotUrl(href) {
  const slug = href.split("/").pop()?.replace(/\.html$/i, "");
  if (!slug) {
    return null;
  }

  return `../../tmp/screenshots/components/${slug}.png?v=${THUMBNAIL_VERSION}`;
}

function enhanceAtlas() {
  const items = document.querySelectorAll("[data-demo-index-item]");
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

    const card = document.createElement("span");
    card.dataset.demoIndexCard = "true";

    const frame = document.createElement("span");
    frame.dataset.demoIndexFrame = "true";

    const image = document.createElement("img");
    image.dataset.demoIndexImage = "true";
    image.src = imageUrl;
    image.alt = `${name} preview`;
    image.loading = "lazy";
    image.width = 360;
    image.height = 240;
    image.addEventListener("error", () => {
      frame.classList.add("is-missing");
    });

    const label = document.createElement("p");
    label.dataset.demoIndexName = "true";
    label.textContent = name;

    frame.appendChild(image);
    card.appendChild(frame);
    card.appendChild(label);

    if (meta) {
      link.title = meta;
    }

    link.textContent = "";
    link.dataset.demoIndexCardLink = "true";
    link.appendChild(card);
  }
}

enhanceAtlas();
