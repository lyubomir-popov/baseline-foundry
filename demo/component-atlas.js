const THUMBNAIL_VERSION = "20260329-panel-refresh-19";

function screenshotUrl(href) {
  const slug = href.split("/").pop()?.replace(/\.html$/i, "");
  if (!slug) {
    return null;
  }

  return `../../tmp/screenshots/components/${slug}.png?v=${THUMBNAIL_VERSION}`;
}

function enhanceAtlas() {
  const items = document.querySelectorAll(".demo-index-item");
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
    card.classList.add("demo-index-card");

    const frame = document.createElement("span");
    frame.classList.add("demo-index-frame");

    const image = document.createElement("img");
    image.classList.add("demo-index-image");
    image.src = imageUrl;
    image.alt = `${name} preview`;
    image.loading = "lazy";
    image.width = 360;
    image.height = 240;
    image.addEventListener("error", () => {
      frame.classList.add("is-missing");
    });

    const label = document.createElement("p");
    label.classList.add("demo-index-name");
    label.textContent = name;

    frame.appendChild(image);
    card.appendChild(frame);
    card.appendChild(label);

    if (meta) {
      link.title = meta;
    }

    link.textContent = "";
    link.classList.add("demo-index-card-link");
    link.appendChild(card);
  }
}

enhanceAtlas();
