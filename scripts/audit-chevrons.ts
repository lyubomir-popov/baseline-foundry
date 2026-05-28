/**
 * Playwright script to audit chevron icon rendering across components,
 * comparing editorial tier (0.5rem baseline) vs documentation surface
 * (0.25rem baseline) to catch token-driven size regressions.
 */
import path from "node:path";
import fs from "node:fs/promises";
import { chromium } from "playwright";
import { closeServer, createStaticServer, waitForFonts } from "./component-demo-shared.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "tmp", "chevron-audit");

interface Spec {
  label: string;
  html: string;
  selector: string;
  pseudo: "before" | "after" | "self";
  childSelector?: string;
}

const specs: Spec[] = [
  {
    label: "bf-icon chevron-down",
    html: `<span class="bf-icon is-chevron-down" aria-hidden="true"></span>`,
    selector: ".bf-icon.is-chevron-down",
    pseudo: "self",
  },
  {
    label: "button + icon chevron",
    html: `<button class="bf-button is-icon is-positive" type="button">Continue<span class="bf-icon is-chevron-right" aria-hidden="true"></span></button>`,
    selector: ".bf-button",
    pseudo: "self",
    childSelector: ".bf-icon",
  },
  {
    label: "select",
    html: `<select><option>Editorial</option></select>`,
    selector: "select",
    pseudo: "self",
  },
  {
    label: "accordion-tab",
    html: `<button class="bf-accordion-tab" aria-expanded="true">Section</button>`,
    selector: ".bf-accordion-tab",
    pseudo: "before",
  },
  {
    label: "pagination-prev",
    html: `<a class="bf-pagination-link is-previous" href="#">Previous</a>`,
    selector: ".bf-pagination-link.is-previous",
    pseudo: "before",
  },
  {
    label: "side-nav-accordion",
    html: `<button class="bf-side-navigation-accordion-button" aria-expanded="true">Testing</button>`,
    selector: ".bf-side-navigation-accordion-button",
    pseudo: "before",
  },
];

const tiers = [
  { label: "editorial", cssClass: "bf-theme" },
  { label: "doc-surface", cssClass: "bf-theme bf-tier-documentation" },
];

function harness(tier: typeof tiers[0], spec: Spec): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<link rel="stylesheet" href="/dist/tiers/editorial/styles.css">
</head><body class="${tier.cssClass}" style="padding:2rem">
${spec.html}
</body></html>`;
}

async function main() {
  const { server, origin } = await createStaticServer(ROOT);
  const browser = await chromium.launch();
  await fs.mkdir(OUT, { recursive: true });

  try {
    const ctx = await browser.newContext({ viewport: { width: 600, height: 300 } });
    const rows: string[][] = [];
    rows.push(["Tier", "Component", "Chevron W×H", "bg-size", "Child icon"]);

    // Write temp harness files so the <link> tags resolve against the static server
    const tmpDir = path.join(ROOT, "tmp", "chevron-harness");
    await fs.mkdir(tmpDir, { recursive: true });

    for (const tier of tiers) {
      for (const spec of specs) {
        const safe = (s: string) => s.replace(/[^a-z0-9-]/gi, "_");
        const fileName = `${safe(tier.label)}--${safe(spec.label)}.html`;
        const filePath = path.join(tmpDir, fileName);
        await fs.writeFile(filePath, harness(tier, spec), "utf-8");

        const page = await ctx.newPage();
        await page.goto(`${origin}/tmp/chevron-harness/${fileName}`, { waitUntil: "networkidle" });
        await waitForFonts(page);

        const data = await page.evaluate(
          ({ selector, pseudo, childSelector }) => {
            const el = document.querySelector<HTMLElement>(selector);
            if (!el) return null;
            const cs = getComputedStyle(el, pseudo === "self" ? null : `::${pseudo}`);
            const elCs = getComputedStyle(el);
            const w = pseudo === "self" ? elCs.width : cs.width;
            const h = pseudo === "self" ? elCs.height : cs.height;
            const bg = pseudo === "self" ? elCs.backgroundSize : cs.backgroundSize;
            let child = "—";
            if (childSelector) {
              const c = el.querySelector<HTMLElement>(childSelector);
              if (c) { const s = getComputedStyle(c); child = `${s.width} × ${s.height}`; }
            }
            return { w, h, bg, child };
          },
          { selector: spec.selector, pseudo: spec.pseudo, childSelector: spec.childSelector ?? null },
        );

        if (data) {
          rows.push([tier.label, spec.label, `${data.w} × ${data.h}`, data.bg, data.child]);
        } else {
          rows.push([tier.label, spec.label, "NOT FOUND", "—", "—"]);
        }

        // screenshot
        const el = await page.$(spec.selector);
        if (el) {
          const box = await el.boundingBox();
          if (box && box.width > 0 && box.height > 0) {
            const pad = 16;
            const vp = page.viewportSize()!;
            const cx = Math.max(0, box.x - pad);
            const cy = Math.max(0, box.y - pad);
            const cw = Math.min(box.width + pad * 2, vp.width - cx);
            const ch = Math.min(box.height + pad * 2, vp.height - cy);
            if (cw > 0 && ch > 0) {
              const safe = (s: string) => s.replace(/[^a-z0-9-]/gi, "_");
              await page.screenshot({
                path: path.join(OUT, `${safe(tier.label)}--${safe(spec.label)}.png`),
                clip: { x: cx, y: cy, width: cw, height: ch },
              });
            }
          }
        }
        await page.close();
      }
    }

    // Print summary table
    const cw = rows[0].map((_, ci) => Math.max(...rows.map(r => (r[ci] ?? "").length)));
    const sep = cw.map(w => "-".repeat(w)).join("-+-");
    console.log("\n" + "=".repeat(sep.length));
    console.log("CHEVRON SIZE AUDIT — editorial vs documentation surface");
    console.log("=".repeat(sep.length));
    for (const [ri, row] of rows.entries()) {
      console.log(row.map((c, ci) => c.padEnd(cw[ci])).join(" | "));
      if (ri === 0) console.log(sep);
    }
    console.log("=".repeat(sep.length));
  } finally {
    await browser.close();
    closeServer(server);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
