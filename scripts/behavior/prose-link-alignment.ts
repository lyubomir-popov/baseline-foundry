import path from "node:path";
import { pathToFileURL } from "node:url";
import { closeServer, createStaticServer, waitForFonts } from "../component-demo-shared.ts";
import { assert, openBrowser } from "./browser-helpers.ts";

export async function verifyProseLinkAlignment(origin: string): Promise<void> {
  const browser = await openBrowser();
  let cases = 0;
  try {
    const page = await browser.newPage();
    for (const tier of ["editorial", "documentation", "app", "os"]) {
      for (const shared of [false, true]) {
        for (const direction of ["ltr", "rtl"]) {
          for (const width of [390, 1440]) {
            await page.setViewportSize({ width, height: 900 });
            const stylesheet = shared ? "dist/styles.css" : `dist/tiers/${tier}/styles.css`;
            await page.setContent(`<!doctype html><html dir="${direction}"><head>
              <link rel="stylesheet" href="${origin}/${stylesheet}">
              <style>@font-face {font-family:"Ubuntu Sans";src:url("${origin}/assets/fonts/UbuntuSans%5Bwdth,wght%5D.ttf");font-weight:100 800;}
              .fixture {width:280px;} .baseline {display:inline-block;width:0;height:0;padding:0;margin:0;}</style>
              </head><body class="bf-theme ${shared ? `bf-tier-${tier}` : ""}"><div class="fixture bf-prose"></div>
              <a class="bf-text-link" id="standalone" href="#target">Standalone link</a></body></html>`);
            await waitForFonts(page);
            const results = await page.evaluate<Array<{kind: string; plain: {baseline: number; height: number; lines: unknown; markerTop: string; markerHeight: string}; linked: {baseline: number; height: number; lines: unknown; markerTop: string; markerHeight: string}}>>(`(() => {
              const prose = document.querySelector(".fixture");
              const sample = "A linked reference with enough words to wrap onto several lines.";
              return ["ul", "ol", "p", "blockquote"].map(kind => {
                const create = (linked) => {
                  const owner = document.createElement(kind);
                  const textBox = kind === "ul" || kind === "ol" ? document.createElement("li") : owner;
                  if (textBox !== owner) owner.append(textBox);
                  textBox.innerHTML = '<span class="baseline"></span>' + (linked ? '<a class="bf-text-link" href="#target">' + sample + '</a>' : '<span>' + sample + '</span>');
                  prose.append(owner);
                  const text = textBox.lastElementChild;
                  const range = document.createRange();
                  range.selectNodeContents(text);
                  const bounds = textBox.getBoundingClientRect();
                  const lines = [...range.getClientRects()].map(rect => ({
                    top: rect.top - bounds.top, width: rect.width, height: rect.height
                  }));
                  const baseline = textBox.querySelector(".baseline").getBoundingClientRect().bottom - bounds.top;
                  const style = getComputedStyle(textBox);
                  const marker = getComputedStyle(textBox, "::before");
                  const result = {
                    lines, baseline, height: bounds.height + parseFloat(style.marginBottom),
                    markerTop: marker.top, markerHeight: marker.height
                  };
                  owner.remove();
                  return result;
                };
                return { kind, plain: create(false), linked: create(true) };
              });
            })()`);
            for (const result of results) {
              const label = `${tier}/${shared ? "shared" : "direct"}/${direction}/${width}/${result.kind}`;
              assert(Math.abs(result.plain.baseline - result.linked.baseline) < 0.1, `Link changes first baseline: ${label} ${JSON.stringify(result)}`);
              assert(Math.abs(result.plain.height - result.linked.height) < 0.1, `Link changes occupied height: ${label} ${JSON.stringify(result)}`);
              assert(JSON.stringify(result.plain.lines) === JSON.stringify(result.linked.lines), `Link changes text wrapping or position: ${label} ${JSON.stringify(result)}`);
              assert(result.plain.markerTop === result.linked.markerTop && result.plain.markerHeight === result.linked.markerHeight, `Link changes marker position: ${label}`);
              cases++;
            }
            const standalone = await page.locator("#standalone").evaluate(link => {
              const style = getComputedStyle(link);
              return { display: style.display, nudge: parseFloat(style.paddingTop) };
            });
            assert(standalone.display === "inline-block" && standalone.nudge > 0, "Standalone links must retain their own metric box.");
          }
        }
      }
    }
    console.log(`Prose link alignment passed: ${cases} paired cases across four tiers, both bundles, directions and widths.`);
  } finally {
    await browser.close();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const { server, origin } = await createStaticServer(path.resolve("."));
  try {
    await verifyProseLinkAlignment(origin);
  } finally {
    await closeServer(server);
  }
}
