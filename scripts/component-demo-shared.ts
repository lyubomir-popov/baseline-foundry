import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";

export interface ComponentPage {
  name: string;
  route: string;
  captureProfile?: "fit" | "wide";
}

export const componentPages: ComponentPage[] = [
  { name: "typography", route: "/demo/components/typography.html", captureProfile: "wide" },
  { name: "prose", route: "/demo/components/prose.html", captureProfile: "wide" },
  { name: "layout", route: "/demo/components/layout.html", captureProfile: "wide" },
  { name: "grid", route: "/demo/components/grid.html", captureProfile: "wide" },
  { name: "application-shell", route: "/demo/components/application-shell.html", captureProfile: "wide" },
  { name: "stage-shell", route: "/demo/components/stage-shell.html", captureProfile: "wide" },
  { name: "drawer-panel", route: "/demo/components/drawer-panel.html", captureProfile: "wide" },
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
  { name: "switch", route: "/demo/components/switch.html" },
  { name: "chip", route: "/demo/components/chip.html" },
  { name: "badge", route: "/demo/components/badge.html" },
  { name: "status-label", route: "/demo/components/status-label.html" },
  { name: "table", route: "/demo/components/table.html", captureProfile: "wide" },
  { name: "search-box", route: "/demo/components/search-box.html" },
  { name: "search-and-filter", route: "/demo/components/search-and-filter.html" },
  { name: "code-snippet", route: "/demo/components/code-snippet.html" },
  { name: "list-tree", route: "/demo/components/list-tree.html" },
  { name: "tabs", route: "/demo/components/tabs.html" },
  { name: "panel-tabs", route: "/demo/components/panel-tabs.html" },
  { name: "accordion", route: "/demo/components/accordion.html" },
  { name: "modal", route: "/demo/components/modal.html" },
  { name: "choice-row", route: "/demo/components/choice-row.html" },
  { name: "inline-options", route: "/demo/components/inline-options.html" },
  { name: "segmented-control", route: "/demo/components/segmented-control.html" },
  { name: "breadcrumbs", route: "/demo/components/breadcrumbs.html" },
  { name: "pagination", route: "/demo/components/pagination.html" },
  { name: "contextual-menu", route: "/demo/components/contextual-menu.html" },
  { name: "tooltip", route: "/demo/components/tooltip.html" },
  { name: "divider", route: "/demo/components/divider.html" },
  { name: "cards", route: "/demo/components/cards.html" },
  { name: "option-card", route: "/demo/components/option-card.html" },
  { name: "panel-pressure", route: "/demo/components/panel-pressure.html", captureProfile: "wide" },
  { name: "editorial-pressure", route: "/demo/components/editorial-pressure.html", captureProfile: "wide" },
  { name: "narrow-panel", route: "/demo/components/narrow-panel.html", captureProfile: "wide" },
  { name: "parameter-matrix", route: "/demo/components/parameter-matrix.html", captureProfile: "wide" },
  { name: "brand-layout-ops-sample", route: "/demo/components/brand-layout-ops-sample.html", captureProfile: "wide" }
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

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve());
  });

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
