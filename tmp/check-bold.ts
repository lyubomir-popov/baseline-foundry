import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto("http://127.0.0.1:4174/demo/controls.html", { waitUntil: "networkidle" });

  // Wait a moment for tier stylesheet to load
  await page.waitForTimeout(1000);

  // Force clear localStorage to start fresh on app tier
  await page.evaluate(() => window.localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Screenshot the full page
  await page.screenshot({ path: "tmp/controls-full.png", fullPage: false });

  // Check computed font-weight on various elements
  const selectors = [
    { name: "button.bf-button", sel: ".bf-button" },
    { name: "pagination link", sel: ".bf-pagination-link" },
    { name: "tab link", sel: ".bf-tabs-link" },
    { name: "accordion tab", sel: ".bf-accordion-tab" },
    { name: "breadcrumb item", sel: ".bf-breadcrumbs-item" },
    { name: "input", sel: ".bf-input" },
    { name: "search-box-input", sel: ".bf-search-box-input" },
    { name: "select", sel: "select" },
  ];

  for (const { name, sel } of selectors) {
    const el = page.locator(sel).first();
    const count = await page.locator(sel).count();
    if (count === 0) {
      console.log(`${name}: NOT FOUND`);
      continue;
    }
    const styles = await el.evaluate((node) => {
      const cs = window.getComputedStyle(node);
      const parentCs = node.parentElement ? window.getComputedStyle(node.parentElement) : null;
      return {
        fontWeight: cs.fontWeight,
        fontStyle: cs.fontStyle,
        fontSize: cs.fontSize,
        fontFamily: cs.fontFamily.slice(0, 40),
        parentFontWeight: parentCs?.fontWeight ?? "N/A",
        tagName: node.tagName,
      };
    });
    console.log(`${name}: weight=${styles.fontWeight} style=${styles.fontStyle} size=${styles.fontSize} tag=${styles.tagName} parentWeight=${styles.parentFontWeight}`);
  }

  // Check which CSS rules set font-weight on the first .bf-button
  const buttonDebug = await page.evaluate(() => {
    const el = document.querySelector(".bf-button");
    if (!el) return "no .bf-button found";
    const sheets = Array.from(document.styleSheets);
    const matches: string[] = [];
    for (const sheet of sheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule instanceof CSSStyleRule && el.matches(rule.selectorText)) {
            if (rule.style.fontWeight || rule.style.font) {
              matches.push(`${rule.selectorText} { font-weight: ${rule.style.fontWeight || '(via font shorthand)'} } [${sheet.href?.split('/').pop() || 'inline'}]`);
            }
          }
        }
      } catch {}
    }
    return matches.join("\n");
  });
  console.log("\n=== CSS rules matching .bf-button with font-weight ===");
  console.log(buttonDebug);

  // Also check pagination <a>
  const paginationDebug = await page.evaluate(() => {
    const el = document.querySelector(".bf-pagination-link");
    if (!el) return "no .bf-pagination-link found";
    const sheets = Array.from(document.styleSheets);
    const matches: string[] = [];
    for (const sheet of sheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule instanceof CSSStyleRule && el.matches(rule.selectorText)) {
            if (rule.style.fontWeight || rule.style.font) {
              matches.push(`${rule.selectorText} { font-weight: ${rule.style.fontWeight || '(via font shorthand)'} } [${sheet.href?.split('/').pop() || 'inline'}]`);
            }
          }
        }
      } catch {}
    }
    return matches.join("\n");
  });
  console.log("\n=== CSS rules matching .bf-pagination-link with font-weight ===");
  console.log(paginationDebug);

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
