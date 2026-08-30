import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";

export interface ComponentPage {
  name: string;
  route: string;
  captureProfile?: "fit" | "wide";
  verification?: "baseline" | "screenshot-only";
}

export const componentPages: ComponentPage[] = [
  { name: "typography", route: "/demo/components/typography.html", captureProfile: "wide" },
  { name: "prose", route: "/demo/components/prose.html", captureProfile: "wide" },
  { name: "layout", route: "/demo/components/layout.html", captureProfile: "wide" },
  { name: "grid", route: "/demo/components/grid.html", captureProfile: "wide" },
  { name: "docs-layout", route: "/demo/components/docs-layout.html", captureProfile: "wide" },
  { name: "page-shell", route: "/demo/components/page-shell.html", captureProfile: "wide" },
  { name: "application-shell", route: "/demo/components/application-shell.html", captureProfile: "wide" },
  { name: "application-layout", route: "/demo/components/application-layout.html", captureProfile: "wide" },
  { name: "stage-shell", route: "/demo/components/stage-shell.html", captureProfile: "wide" },
  { name: "drawer-panel", route: "/demo/components/drawer-panel.html", captureProfile: "wide" },
  { name: "form-atlas", route: "/demo/components/form-atlas.html", captureProfile: "wide" },
  { name: "button", route: "/demo/components/button.html" },
  { name: "actions", route: "/demo/components/actions.html" },
  { name: "text-input", route: "/demo/components/text-input.html" },
  { name: "color-input", route: "/demo/components/color-input.html" },
  { name: "select", route: "/demo/components/select.html" },
  { name: "checkbox", route: "/demo/components/checkbox.html" },
  { name: "radio", route: "/demo/components/radio.html" },
  { name: "range", route: "/demo/components/range.html" },
  { name: "file-input", route: "/demo/components/file-input.html" },
  { name: "validation", route: "/demo/components/validation.html" },
  { name: "credential-validation", route: "/demo/components/credential-validation.html", captureProfile: "wide" },
  { name: "switch", route: "/demo/components/switch.html" },
  { name: "chip", route: "/demo/components/chip.html" },
  { name: "badge", route: "/demo/components/badge.html" },
  { name: "status-label", route: "/demo/components/status-label.html" },
  { name: "icon", route: "/demo/components/icon.html" },
  { name: "list", route: "/demo/components/list.html" },
  { name: "inline-list", route: "/demo/components/inline-list.html" },
  { name: "tiered-list", route: "/demo/components/tiered-list.html", captureProfile: "wide" },
  { name: "cta-block", route: "/demo/components/cta-block.html" },
  { name: "basic-section", route: "/demo/components/basic-section.html", captureProfile: "wide" },
  { name: "cta-section", route: "/demo/components/cta-section.html", captureProfile: "wide" },
  { name: "text-spotlight", route: "/demo/components/text-spotlight.html", captureProfile: "wide" },
  { name: "hero", route: "/demo/components/hero.html", captureProfile: "wide" },
  { name: "quote-wrapper", route: "/demo/components/quote-wrapper.html", captureProfile: "wide" },
  { name: "rich-list-horizontal", route: "/demo/components/rich-list-horizontal.html", captureProfile: "wide" },
  { name: "rich-list-vertical", route: "/demo/components/rich-list-vertical.html", captureProfile: "wide" },
  { name: "tab-section", route: "/demo/components/tab-section.html", captureProfile: "wide" },
  { name: "sticky-footer", route: "/demo/components/sticky-footer.html", captureProfile: "wide" },
  { name: "equal-height-row", route: "/demo/components/equal-height-row.html", captureProfile: "wide" },
  { name: "equal-heights", route: "/demo/components/equal-heights.html", captureProfile: "wide" },
  { name: "empty-state", route: "/demo/components/empty-state.html", captureProfile: "wide" },
  { name: "figure", route: "/demo/components/figure.html" },
  { name: "aspect", route: "/demo/components/aspect.html" },
  { name: "table", route: "/demo/components/table.html", captureProfile: "wide" },
  { name: "table-sortable", route: "/demo/components/table-sortable.html", captureProfile: "wide" },
  { name: "table-expanding", route: "/demo/components/table-expanding.html", captureProfile: "wide" },
  { name: "table-mobile-card", route: "/demo/components/table-mobile-card.html", captureProfile: "wide" },
  { name: "logo-section", route: "/demo/components/logo-section.html", captureProfile: "wide" },
  { name: "linked-logo-section", route: "/demo/components/linked-logo-section.html", captureProfile: "wide" },
  { name: "media-object", route: "/demo/components/media-object.html", captureProfile: "wide" },
  { name: "data-spotlight", route: "/demo/components/data-spotlight.html", captureProfile: "wide" },
  { name: "divided-section", route: "/demo/components/divided-section.html", captureProfile: "wide" },
  { name: "table-of-contents", route: "/demo/components/table-of-contents.html", captureProfile: "wide" },
  { name: "search-box", route: "/demo/components/search-box.html" },
  { name: "search-and-filter", route: "/demo/components/search-and-filter.html" },
  { name: "code-snippet", route: "/demo/components/code-snippet.html" },
  { name: "list-tree", route: "/demo/components/list-tree.html" },
  { name: "tabs", route: "/demo/components/tabs.html" },
  { name: "panel-tabs", route: "/demo/components/panel-tabs.html" },
  { name: "accordion", route: "/demo/components/accordion.html" },
  { name: "side-navigation", route: "/demo/components/side-navigation.html", captureProfile: "wide" },
  { name: "top-navigation", route: "/demo/components/top-navigation.html", captureProfile: "wide" },
  { name: "in-page-navigation", route: "/demo/components/in-page-navigation.html", captureProfile: "wide" },
  { name: "navigation-reduced", route: "/demo/components/navigation-reduced.html", captureProfile: "wide" },
  { name: "engine-smoke", route: "/demo/components/engine-smoke.html", captureProfile: "wide" },
  { name: "engine-illustration", route: "/demo/components/engine-illustration.html", captureProfile: "wide", verification: "screenshot-only" },
  { name: "modal", route: "/demo/components/modal.html" },
  { name: "choice-row", route: "/demo/components/choice-row.html" },
  { name: "inline-options", route: "/demo/components/inline-options.html" },
  { name: "segmented-control", route: "/demo/components/segmented-control.html" },
  { name: "breadcrumbs", route: "/demo/components/breadcrumbs.html" },
  { name: "pagination", route: "/demo/components/pagination.html" },
  { name: "article-pagination", route: "/demo/components/article-pagination.html", captureProfile: "wide" },
  { name: "skip-link", route: "/demo/components/skip-link.html", captureProfile: "wide" },
  { name: "contextual-menu", route: "/demo/components/contextual-menu.html" },
  { name: "tooltip", route: "/demo/components/tooltip.html" },
  { name: "cards", route: "/demo/components/cards.html" },
  { name: "content-card", route: "/demo/components/content-card.html", captureProfile: "wide" },
  { name: "option-card", route: "/demo/components/option-card.html" },
  { name: "notice", route: "/demo/components/notice.html", captureProfile: "wide" },
  { name: "notification", route: "/demo/components/notification.html", captureProfile: "wide" },
  { name: "panel-pressure", route: "/demo/components/panel-pressure.html", captureProfile: "wide" },
  { name: "editorial-pressure", route: "/demo/components/editorial-pressure.html", captureProfile: "wide" },
  { name: "narrow-panel", route: "/demo/components/narrow-panel.html", captureProfile: "wide" }
];

const contentTypes = new Map<string, string>([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"]
]);

function getContentType(filePath: string): string {
  return contentTypes.get(path.extname(filePath).toLowerCase()) ?? "application/octet-stream";
}

export async function createStaticServer(rootDir: string): Promise<{ server: http.Server; origin: string; }> {
  const server = http.createServer(async (request, response) => {
    const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
    let filePath = path.join(rootDir, decodeURIComponent(requestUrl.pathname));

    if (filePath.endsWith(path.sep)) {
      filePath = path.join(filePath, "index.html");
    }

    try {
      const stats = await fs.stat(filePath);
      if (stats.isDirectory()) {
        filePath = path.join(filePath, "index.html");
      }

      const body = await fs.readFile(filePath);
      response.writeHead(200, { "content-type": getContentType(filePath) });
      response.end(body);
    } catch {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
    }
  });

  /* Chromium blocks a small set of legacy service ports even on localhost.
     Asking the OS for any ephemeral port can therefore make browser QA fail
     before the page loads. The IANA dynamic range sits above that blocklist;
     retrying within it keeps parallel test runs collision-safe. */
  const firstDynamicPort = 49_152 + Math.floor(Math.random() * 16_384);
  let listening = false;
  let lastListenError: unknown = null;
  for (let attempt = 0; attempt < 20 && !listening; attempt += 1) {
    const port = 49_152 + ((firstDynamicPort - 49_152 + (attempt * 7_919)) % 16_384);
    try {
      await new Promise<void>((resolve, reject) => {
        const onError = (error: Error) => reject(error);
        server.once("error", onError);
        server.listen(port, "127.0.0.1", () => {
          server.off("error", onError);
          resolve();
        });
      });
      listening = true;
    } catch (error) {
      lastListenError = error;
      if (!(error instanceof Error) || !("code" in error) || error.code !== "EADDRINUSE") throw error;
    }
  }
  if (!listening) {
    throw lastListenError instanceof Error ? lastListenError : new Error("Unable to bind a browser-safe static server port.");
  }

  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Unable to determine static server address.");
  }

  return {
    server,
    origin: `http://127.0.0.1:${address.port}`
  };
}

export async function closeServer(server: http.Server): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    server.close(error => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

export async function waitForFonts(page: import("playwright").Page): Promise<void> {
  await page.evaluate(async () => {
    if ("fonts" in document) {
      await document.fonts.ready;
    }
  });
}
