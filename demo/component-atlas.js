const THUMBNAIL_VERSION = "20260329-panel-refresh-19";

function screenshotUrl(href) {
  const slug = href.split("/").pop()?.replace(/\.html$/i, "");
  if (!slug) {
    return null;
  }

  return `../../tmp/screenshots/components/${slug}.png?v=${THUMBNAIL_VERSION}`;
}

function enhanceAtlas() {
  const items = document.querySelectorAll(".component-index-item");
  if (items.length === 0) {
    return;
  }

  for (const item of items) {
    const link = item.querySelector("a");
    if (!(link instanceof HTMLAnchorElement)) {
      continue;
    }

    const name = link.textContent?.trim() ?? "";
    const meta = item.querySelector(".component-demo-meta")?.textContent?.trim() ?? "";
    const imageUrl = screenshotUrl(link.getAttribute("href") ?? "");
    if (!imageUrl || !name) {
      continue;
    }

    const card = document.createElement("span");
    card.className = "component-index-card";

    const frame = document.createElement("span");
    frame.className = "component-index-card__frame";

    const image = document.createElement("img");
    image.className = "component-index-card__image";
    image.src = imageUrl;
    image.alt = `${name} preview`;
    image.loading = "lazy";
    image.width = 360;
    image.height = 240;
    image.addEventListener("error", () => {
      frame.classList.add("is-missing");
    });

    const label = document.createElement("p");
    label.className = "component-index-card__name";
    label.textContent = name;

    frame.appendChild(image);
    card.appendChild(frame);
    card.appendChild(label);

    if (meta) {
      link.title = meta;
    }

    link.textContent = "";
    link.classList.add("component-index-card-link");
    link.appendChild(card);
  }
}

enhanceAtlas();
