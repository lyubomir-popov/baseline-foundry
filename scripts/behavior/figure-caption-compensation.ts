import path from "node:path";
import fs from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { closeServer, createStaticServer, waitForFonts } from "../component-demo-shared.ts";
import { assert } from "./browser-helpers.ts";
import { buildThemeFromConfig } from "../../dist/build.js";

async function buildCaptionFixtures(): Promise<void> {
  // Built-in tiers intentionally omit meta. Exercise the supported configured
  // role instead of passing a vacuous inherited-line-height test.
  const fixtureRoot = path.resolve("tmp/figure-caption");
  await fs.mkdir(fixtureRoot, { recursive: true });
  const tiers = ["editorial", "documentation", "app", "os"];
  for (const tier of tiers) {
    const config = JSON.parse(await fs.readFile(`config/tiers/${tier}.json`, "utf8"));
    config.roles.meta = "body";
    for (const font of config.fontFiles) font.path = path.resolve("config/tiers", font.path);
    await fs.writeFile(path.join(fixtureRoot, `${tier}.json`), JSON.stringify(config));
    await buildThemeFromConfig(path.join(fixtureRoot, `${tier}.json`), {
      distDir: path.join(fixtureRoot, tier), baselineDir: path.join(fixtureRoot, "baseline", tier)
    });
  }
  await buildThemeFromConfig(path.join(fixtureRoot, "editorial.json"), {
    distDir: path.join(fixtureRoot, "shared"), baselineDir: path.join(fixtureRoot, "baseline", "shared"),
    additionalSurfaces: tiers.map(tier => ({ name: `caption-${tier}`, className: `bf-tier-${tier}`, configPath: path.join(fixtureRoot, `${tier}.json`) }))
  });
}

export async function verifyFigureCaptionCompensation(origin: string): Promise<void> {
  await buildCaptionFixtures();
  // Chrome is the consumer's reproduction engine. Existing full-suite helpers
  // retain their configured Chromium launcher.
  const browser = await chromium.launch({ channel: "chrome" });
  let cases = 0;
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    for (const configuredMeta of [false, true]) {
    for (const tier of ["editorial", "documentation", "app", "os"]) {
      for (const shared of [false, true]) {
        for (const width of [240, 640]) {
          for (const dark of [false, true]) {
            const stylesheet = configuredMeta
              ? `tmp/figure-caption/${shared ? "shared" : tier}/styles.css`
              : shared ? "dist/styles.css" : `dist/tiers/${tier}/styles.css`;
            await page.setContent(`<!doctype html><html><head>
              <link rel="stylesheet" href="${origin}/${stylesheet}">
              <style>@font-face {font-family:"Ubuntu Sans";src:url("${origin}/assets/fonts/UbuntuSans%5Bwdth,wght%5D.ttf");font-weight:100 800;}
              body{margin:0}.fixture{display:grid;grid-template-columns:repeat(2,${width}px);align-items:start;gap:16px}
              .marker{display:inline-block;width:0;height:0;vertical-align:baseline}</style>
              </head><body class="bf-theme ${shared ? `bf-tier-${tier}` : ""} ${dark ? "is-dark" : ""}"><div class="fixture"></div></body></html>`);
            const roles = configuredMeta
              ? [["figcaption", ""], ["figcaption", "bf-meta"], ["p", "bf-meta"], ["figcaption", "bf-body"]]
              : [["figcaption", ""], ["figcaption", "bf-body"]];
            for (const [tag, role] of roles) {
              for (const multiline of [false, true]) {
                for (const followingTag of ["p", "h3"]) {
                  await page.evaluate(({ tag, role, multiline, followingTag }) => {
                    const host = document.querySelector(".fixture")!;
                    host.replaceChildren();
                    for (const reference of [false, true]) {
                      const stack = document.createElement("section");
                      stack.className = "bf-stack";
                      stack.id = reference ? "reference" : "actual";
                      for (let i = 0; i < 2; i++) {
                        const figure = document.createElement("figure");
                        figure.className = "bf-figure";
                        const media = document.createElement("div");
                        media.className = "bf-aspect";
                        media.style.cssText = "aspect-ratio:auto;block-size:calc(var(--bf-baseline) * 10)";
                        const caption = document.createElement(tag);
                        caption.className = `${reference ? "" : "bf-figure-caption"} ${role}`;
                        // The independent reference keeps the text role and
                        // matches only the component's intentional italic style.
                        if (reference && !role) caption.style.fontStyle = "italic";
                        caption.textContent = multiline ? "A naturally wrapped caption describing the image and its relationship to the following text. ".repeat(5) : "Short caption.";
                        figure.append(media, caption);
                        stack.append(figure);
                      }
                      const following = document.createElement(followingTag);
                      following.innerHTML = '<span class="marker"></span>Following text';
                      stack.append(following);
                      host.append(stack);
                    }
                  }, { tag, role, multiline, followingTag });
                  await waitForFonts(page);
                  const result = await page.evaluate(`(() => {
                    const read = (id) => {
                      const stack = document.getElementById(id);
                      const probe = document.createElement("i");
                      probe.style.cssText = "position:absolute;block-size:var(--bf-baseline);color:var(--bf-color-text-default)";
                      stack.append(probe);
                      const baseline = probe.getBoundingClientRect().height;
                      const defaultColor = getComputedStyle(probe).color;
                      probe.remove();
                      const captions = [...stack.querySelectorAll("figure > :last-child")].map(element => {
                        const style = getComputedStyle(element);
                        const rect = element.getBoundingClientRect();
                        return { occupied: rect.height + parseFloat(style.marginBlockEnd), nudge: parseFloat(style.paddingBlockStart), compensation: parseFloat(style.marginBlockEnd), lineHeight: parseFloat(style.lineHeight), fontSize: style.fontSize, family: style.fontFamily, italic: style.fontStyle, color: style.color, start: parseFloat(style.marginBlockStart), overflow: element.scrollWidth > element.clientWidth, lines: (rect.height - parseFloat(style.paddingBlockStart)) / parseFloat(style.lineHeight) };
                      });
                      const figure = stack.querySelector("figure");
                      const media = figure.firstElementChild;
                      return { baseline, defaultColor, captions, gap: parseFloat(getComputedStyle(figure).rowGap), mediaGap: figure.lastElementChild.getBoundingClientRect().top - media.getBoundingClientRect().bottom, following: stack.querySelector(".marker").getBoundingClientRect().top - stack.getBoundingClientRect().top };
                    };
                    return { actual: read("actual"), reference: read("reference"), fontLoaded: document.fonts.check('16px "Ubuntu Sans"') };
                  })()`);
                  const label = `${configuredMeta ? "configured-meta" : "stock"}/${tier}/${shared ? "shared" : "direct"}/${width}/${dark ? "dark" : "light"}/${tag}.${role}/${multiline ? "multi" : "single"}/${followingTag}`;
                  const { actual, reference } = result;
                  assert(result.fontLoaded, `Expected loaded font: ${label}.`);
                  for (const [i, caption] of actual.captions.entries()) {
                    const expected = reference.captions[i];
                    assert(Math.abs(caption.compensation - expected.compensation) < 0.02 && Math.abs(caption.nudge - expected.nudge) < 0.02 && Math.abs(caption.occupied - expected.occupied) < 0.05, `Expected preserved role occupancy: ${label} ${JSON.stringify(result)}.`);
                    assert(Math.abs(caption.occupied / actual.baseline - Math.round(caption.occupied / actual.baseline)) < 0.02, `Expected caption grid closure: ${label}.`);
                    assert(caption.start === 0 && !caption.overflow && (multiline ? caption.lines > 1 : Math.abs(caption.lines - 1) < 0.02), `Expected natural caption wrapping and zero semantic margin: ${label}.`);
                    assert(caption.italic === expected.italic && caption.color === (role === "bf-meta" ? expected.color : actual.defaultColor) && caption.family === expected.family && caption.fontSize === expected.fontSize && caption.lineHeight === expected.lineHeight, `Expected preserved role/style precedence: ${label} ${JSON.stringify(result)}.`);
                  }
                  assert(Math.abs(actual.mediaGap - actual.gap) < 0.02 && actual.gap === actual.baseline, `Expected figure-owned image/caption gap: ${label}.`);
                  assert(Math.abs(actual.following - reference.following) < 0.05, `Expected composed following baseline to match intact role reference: ${label} ${JSON.stringify(result)}.`);
                  cases++;
                }
              }
            }
          }
        }
      }
    }
    }
    console.log(`Figure caption compensation passed: ${cases} Chrome cases across stock/configured-meta surfaces, four tiers, direct/shared bundles, widths, tones, wraps, roles and following body/headings.`);
  } finally {
    await browser.close();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const { server, origin } = await createStaticServer(path.resolve("."));
  try {
    await verifyFigureCaptionCompensation(origin);
  } finally {
    await closeServer(server);
  }
}
