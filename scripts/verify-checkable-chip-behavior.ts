import { chromium, type Page } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createStaticServer, closeServer } from "./component-demo-shared.ts";

export async function verifyCheckableChip(origin: string): Promise<void> {
  const browser = await chromium.launch({ channel: "chrome" });
  const records: Array<{ label: string; detail: unknown }> = [];
  const errors: string[] = [];
  const check = (condition: unknown, label: string, detail: unknown = {}) => {
    records.push({ label, detail });
    if (!condition) throw new Error(`${label}: ${JSON.stringify(detail)}`);
  };
  const mark = `<svg class="bf-chip-mark" aria-hidden="true" focusable="false" viewBox="0 0 16 16" fill="none"><path d="M3 8l3 3 7-7" stroke="currentColor" stroke-width="2"/></svg>`;
  const state = (page: Page) => page.locator("#target").evaluate(el => {
    const css = getComputedStyle(el), r = el.getBoundingClientRect(), value = el.querySelector(".bf-chip-value")!, v = value.getBoundingClientRect();
    const mark = el.querySelector(".bf-chip-mark")!, m = mark.getBoundingClientRect(), ms = getComputedStyle(mark), pseudo = getComputedStyle(el, "::after");
    return { width: r.width, height: r.height, bottom: css.marginBottom, x: v.left-r.left, y: v.top-r.top, textWidth: v.width, textHeight: v.height,
      slotWidth: m.width, slotHeight: m.height, slotVisibility: ms.visibility, pointerEvents: ms.pointerEvents,
      pressed: el.getAttribute("aria-pressed"), shadow: css.boxShadow, selection: css.getPropertyValue("--bf-overlay-selection-layer").trim(),
      stroke: css.getPropertyValue("--bf-overlay-stroke-layer").trim(), focus: css.getPropertyValue("--bf-overlay-focus-layer").trim(),
      border: css.borderTopWidth, outline: css.outlineStyle, outlineWidth: css.outlineWidth, outlineColor: css.outlineColor,
      pseudo: { outline: pseudo.outlineStyle, width: pseudo.outlineWidth, color: pseudo.outlineColor, end: pseudo.borderBottomWidth },
      color: css.color, background: css.backgroundColor, scroll: document.documentElement.scrollWidth, viewport: innerWidth };
  });
  try {
    await fs.mkdir("tmp/checkable-chip", { recursive: true });
    for (const tier of ["editorial", "documentation", "app", "os"]) for (const shared of [false, true]) for (const root of [16, 20]) for (const theme of ["light", "dark", "forced"]) for (const dir of ["ltr", "rtl"]) {
      const page = await browser.newPage({ viewport: { width: 390, height: 280 }, forcedColors: theme === "forced" ? "active" : "none" });
      const label = `${tier}/${shared ? "shared" : "direct"}/${root}/${theme}/${dir}`;
      await page.goto(`${origin}/demo/components/chip.html`, { waitUntil: "domcontentloaded" });
      await page.setContent(`<html class="bf-theme bf-tier-${tier} ${theme === "dark" ? "is-dark" : "is-light"}" dir="${dir}" style="font-size:${root}px"><head><link rel="stylesheet" href="${origin}/dist/${shared ? "styles.css" : `tiers/${tier}/styles.css`}"></head><body style="margin:0;padding:16px"><div style="width:180px;max-width:100%"><button id="target" class="bf-chip is-checkable is-positive" type="button" aria-pressed="false">${mark}<span class="bf-chip-value">Brand filter with a long name</span></button></div><button id="ordinary" class="bf-chip is-positive" type="button" aria-pressed="true"><span class="bf-chip-value">Ordinary</span></button></body></html>`);
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(() => { const button = document.querySelector("#target")!; button.addEventListener("click", () => button.setAttribute("aria-pressed", String(button.getAttribute("aria-pressed") !== "true"))); });
      const target = page.getByRole("button", { name: "Brand filter with a long name", exact: true });
      check(await target.count() === 1 && await target.getAttribute("aria-pressed") === "false", `${label} named native toggle`);
      const initial = await state(page);
      check(initial.slotVisibility === "hidden" && initial.pointerEvents === "none" && initial.slotWidth > 0 && initial.slotHeight > 0 && initial.width <= 180.1 && initial.scroll <= initial.viewport && initial.border === "0px", `${label} initial slot and narrow containment`, initial);
      const keys = ["width", "height", "bottom", "x", "y", "textWidth", "textHeight", "slotWidth", "slotHeight"];
      const sameGeometry = (a: typeof initial, b: typeof initial) => keys.every(k => Math.abs(parseFloat(String((a as any)[k])) - parseFloat(String((b as any)[k]))) < .05);
      const box = (await target.boundingBox())!; await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      const hovered = await state(page);
      check(sameGeometry(initial, hovered) && hovered.slotVisibility === "hidden", `${label} hover preserves geometry`, hovered);
      await page.mouse.down();
      const active = await state(page);
      check(active.slotVisibility === "hidden" && active.selection === "0 0 0 0 transparent" && active.pseudo.end === "0px", `${label} unselected pointer active`, active);
      await page.mouse.up(); await page.mouse.move(0, 0);
      const selected = await state(page);
      check(selected.pressed === "true" && selected.slotVisibility === "visible" && selected.selection === "0 0 0 0 transparent" && selected.pseudo.end === "0px" && selected.stroke === initial.stroke, `${label} selected mark with uniform paint`, selected);
      check(sameGeometry(initial, selected), `${label} occupied geometry and text keyline stable`, { initial, selected });
      await target.focus(); await page.keyboard.press("Tab"); await page.keyboard.press("Shift+Tab");
      const focused = await state(page);
      check(sameGeometry(initial, focused) && await target.evaluate(el => el.matches(":focus-visible")) && (theme === "forced" ? focused.outline === "solid" && parseFloat(focused.outlineWidth) > 0 && focused.pseudo.outline === "solid" && parseFloat(focused.pseudo.width) > 0 && focused.pseudo.color !== focused.background : !focused.focus.includes("transparent")), `${label} independent keyboard focus`, focused);
      await page.keyboard.press("Space"); const keyboard = await state(page);
      check(keyboard.pressed === "false" && keyboard.slotVisibility === "hidden", `${label} keyboard toggle restores idle`, keyboard);
      await target.evaluate(el => { el.classList.add("is-selected"); }); const modifier = await state(page);
      check(modifier.slotVisibility === "visible", `${label} selected modifier exposes mark`, modifier);
      const ordinary = await page.locator("#ordinary").evaluate(el => ({ selection: getComputedStyle(el).getPropertyValue("--bf-overlay-selection-layer").trim(), forcedEnd: getComputedStyle(el, "::after").borderBottomWidth }));
      check(!ordinary.selection.includes("transparent") && (theme !== "forced" || parseFloat(ordinary.forcedEnd) > 0), `${label} ordinary selected bar retained`, ordinary);
      if (tier === "editorial" && !shared && root === 20 && dir === "ltr") await target.screenshot({ path: `tmp/checkable-chip/${theme}.png` });
      await page.close();
    }
    console.log(`Checkable chip behavior passed (${records.length} checks, Chrome).`);
  } catch (error) { errors.push(error instanceof Error ? error.message : String(error)); throw error; }
  finally { await browser.close(); await fs.writeFile("tmp/checkable-chip/behavior.json", JSON.stringify({ checks: records.length, records, errors }, null, 2)); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const { server, origin } = await createStaticServer(path.resolve("."));
  try { await verifyCheckableChip(origin); } finally { await closeServer(server); }
}
