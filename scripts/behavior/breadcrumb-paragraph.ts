import path from "node:path";
import { pathToFileURL } from "node:url";
import { closeServer, createStaticServer, waitForFonts } from "../component-demo-shared.ts";
import { assert, openBrowser } from "./browser-helpers.ts";

export async function verifyBreadcrumbParagraphLeading(origin: string): Promise<void> {
  const browser = await openBrowser();
  let cases = 0;
  try {
    const page = await browser.newPage();
    for (const tier of ["editorial", "documentation", "app", "os"]) {
      for (const shared of [false, true]) {
        for (const fontSize of [14, 16, 20]) {
          for (const direction of ["ltr", "rtl"]) {
            const stylesheet = shared ? "dist/styles.css" : `dist/tiers/${tier}/styles.css`;
            await page.setContent(`<!doctype html><html dir="${direction}" style="font-size:${fontSize}px"><head>
              <link rel="stylesheet" href="${origin}/${stylesheet}">
              <style>@font-face {font-family:"Ubuntu Sans";src:url("${origin}/assets/fonts/UbuntuSans%5Bwdth,wght%5D.ttf");font-weight:100 800;}
              .fixture {align-items:start;display:grid;grid-template-columns:18rem 18rem;gap:2rem;}</style>
              </head><body class="bf-theme ${shared ? `bf-tier-${tier}` : ""}"><div class="fixture">
              <nav class="bf-breadcrumbs" aria-label="Breadcrumb"><ol class="bf-breadcrumbs-items">
              ${["Home", "Server", "Documentation", "Installation", "Advanced"].map((label, i) => `<li class="bf-breadcrumbs-item">${i < 4 ? `<a href="#target">${label}</a>` : `<span aria-current="page">${label}</span>`}</li>`).join("")}
              </ol></nav><p>Home Server Documentation Installation Advanced Home Server Documentation Installation Advanced</p></div></body></html>`);
            await waitForFonts(page);
            const result = await page.evaluate(`(() => {
              const nav = document.querySelector("nav");
              const list = nav.querySelector("ol");
              const paragraph = document.querySelector("p");
              const listStyle = getComputedStyle(list);
              const pStyle = getComputedStyle(paragraph);
              const items = [...list.children];
              const textTop = (element) => {
                const range = document.createRange();
                range.selectNodeContents(element);
                return [...range.getClientRects()].map(rect => rect.top);
              };
              const rows = [...new Set(items.flatMap(item => textTop(item.firstElementChild)))].sort((a, b) => a - b);
              const lines = [...new Set(textTop(paragraph))].sort((a, b) => a - b);
              const number = (value) => Number.parseFloat(value) || 0;
              const navRect = nav.getBoundingClientRect();
              const baselineProbe = document.createElement("div");
              baselineProbe.style.blockSize = "var(--bf-baseline)";
              nav.append(baselineProbe);
              const baseline = baselineProbe.getBoundingClientRect().height;
              baselineProbe.remove();
              return {
                rows, lines, lineHeight: number(pStyle.lineHeight), rowGap: number(listStyle.rowGap),
                sameType: [list, ...items.map(item => item.firstElementChild)].every(element => {
                  const style = getComputedStyle(element);
                  return ["fontFamily", "fontSize", "fontStyle", "fontWeight", "letterSpacing", "lineHeight", "fontVariantCaps", "textTransform"].every(property => style[property] === pStyle[property]);
                }),
                firstLineDelta: rows[0] - navRect.top - (lines[0] - paragraph.getBoundingClientRect().top),
                repeatedCompensation: items.some(item => { const s = getComputedStyle(item); return number(s.marginBlockEnd) !== 0 || number(s.paddingBlockStart) !== 0; }),
                separatorGap: number(getComputedStyle(items[1], "::before").paddingInlineEnd),
                inlineGap: number(listStyle.columnGap),
                navHeight: navRect.height,
                listOccupancy: list.getBoundingClientRect().height + number(listStyle.marginBlockEnd),
                baseline,
                overflow: nav.scrollWidth > nav.clientWidth,
                currentCount: nav.querySelectorAll('[aria-current="page"]').length,
                fontLoaded: document.fonts.check(pStyle.fontSize + ' "Ubuntu Sans"')
              };
            })()`);
            const label = `${tier}/${shared ? "shared" : "direct"}/${fontSize}/${direction}`;
            assert(result.rows.length >= 2 && result.lines.length >= 2, `Expected natural wrapping: ${label}.`);
            assert(result.fontLoaded && result.sameType, `Expected shipped paragraph typography: ${label}.`);
            assert(result.rowGap === 0 && !result.repeatedCompensation, `Expected no additional spacing per text row: ${label}.`);
            for (const [kind, positions] of [["breadcrumb", result.rows], ["paragraph", result.lines]] as const) {
              assert(positions.slice(1).every((top, i) => Math.abs(top - positions[i] - result.lineHeight) < 0.1), `Expected paragraph line advance for ${kind}: ${label} ${JSON.stringify(result)}.`);
            }
            assert(Math.abs(result.firstLineDelta) < 0.1, `Expected equal paragraph metric nudge: ${label}.`);
            assert(Math.abs(result.navHeight - result.listOccupancy) < 0.1, `Expected nav to contain whole-trail compensation: ${label}.`);
            assert(Math.abs(result.navHeight / result.baseline - Math.round(result.navHeight / result.baseline)) < 0.03, `Expected whole trail to close on baseline grid: ${label}.`);
            assert(result.separatorGap === result.inlineGap && result.separatorGap > 0, `Expected preserved mark spacing: ${label}.`);
            assert(!result.overflow && result.currentCount === 1, `Expected wrapped trail and current-page semantics: ${label}.`);
            cases++;
          }
        }
      }
    }
    let headerCases = 0;
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${origin}/demo/components/breadcrumbs.html?bundle=after`, { waitUntil: "networkidle" });
      for (const tier of ["editorial", "documentation", "app", "os"]) {
        await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
        await page.waitForFunction(tierName => Boolean(document.querySelector(`link[data-bundle-tier="${tierName}"][data-bundle-version="after"]`)), tier);
        await waitForFonts(page);
        for (const direction of ["ltr", "rtl"]) {
          await page.evaluate(dir => document.documentElement.dir = dir, direction);
          const header = await page.evaluate(`(() => {
            const list = document.querySelector('.pc-breadcrumbs > .bf-breadcrumbs-items');
            const rows = [...new Set([...list.children].map(item => item.getBoundingClientRect().top))].sort((a,b) => a-b);
            const paragraph = document.createElement('p');
            paragraph.textContent = 'Paragraph reference';
            document.body.append(paragraph);
            const paragraphLine = parseFloat(getComputedStyle(paragraph).lineHeight);
            paragraph.remove();
            return { rows, paragraphLine, rowGap: parseFloat(getComputedStyle(list).rowGap), overflow: document.documentElement.scrollWidth > innerWidth };
          })()`);
          const label = `${tier}/${width}/${direction}`;
          assert(header.rowGap === 0, `Expected page-header Breadcrumbs to retain paragraph spacing: ${label}.`);
          if (width === 390) assert(header.rows.length >= 2, `Expected actual mobile header wrapping: ${label}.`);
          assert(header.rows.slice(1).every((top, i) => Math.abs(top - header.rows[i] - header.paragraphLine) < 0.1), `Expected mobile header paragraph line advance: ${label} ${JSON.stringify(header)}.`);
          assert(!header.overflow, `Expected unchanged responsive header width: ${label}.`);
          headerCases++;
        }
      }
    }
    console.log(`Breadcrumb header paragraph leading passed: ${headerCases} real catalog states across four tiers, desktop/mobile and directions.`);

    console.log(`Breadcrumb paragraph leading passed: ${cases} cases across four tiers, direct/shared bundles, root sizes and directions.`);
  } finally {
    await browser.close();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const { server, origin } = await createStaticServer(path.resolve("."));
  try {
    await verifyBreadcrumbParagraphLeading(origin);
  } finally {
    await closeServer(server);
  }
}
