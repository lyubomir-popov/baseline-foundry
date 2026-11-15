import { chromium, type Page } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createStaticServer, closeServer } from "./component-demo-shared.ts";

const markup = (id = "comparison") => `<div id="${id}" class="bf-image-comparison" style="inline-size:100%">
  <div class="bf-image-comparison-stage" style="block-size:180px">
    <div class="bf-image-comparison-layer is-second" style="background:#132b49;color:white">Second synthetic panel</div>
    <div class="bf-image-comparison-layer is-first" style="background:#efd09b;color:black">First synthetic panel</div>
    <div class="bf-image-comparison-seam"></div>
    <input class="bf-image-comparison-value" type="range" min="0" max="100" step="1" aria-label="Synthetic image comparison" value="27">
    <div class="bf-image-comparison-grip"><svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><rect x="6" y="3" width="1.5" height="14" rx=".75"/><rect x="9.25" y="3" width="1.5" height="14" rx=".75"/><rect x="12.5" y="3" width="1.5" height="14" rx=".75"/></svg></div>
  </div>
</div>`;

export async function verifyImageComparison(origin: string): Promise<void> {
  const browser = await chromium.launch({ channel: "chrome" });
  const records: Array<{ label: string; detail: unknown }> = [];
  const errors: string[] = [];
  function check(pass: unknown, label: string, detail: unknown = {}): void {
    records.push({ label, detail });
    if (!pass) throw new Error(`${label}: ${JSON.stringify(detail)}`);
  }
  async function mount(page: Page, { tier = "editorial", shared = false, dir = "ltr", root = 16, host = 390, initial = 50, extra = "" } = {}): Promise<void> {
    await page.goto(`${origin}/demo/components/range.html`, { waitUntil: "networkidle" });
    await page.setContent(`<html class="bf-theme bf-tier-${tier}${root === 20 ? " is-dark" : ""}" dir="${dir}" style="font-size:${root}px"><head><link rel="stylesheet" href="${origin}/dist/${shared ? "styles.css" : `tiers/${tier}/styles.css`}"></head><body style="margin:0;padding:20px;min-block-size:1800px"><button id="prior">Prior target</button><main style="inline-size:${host}px;max-inline-size:100%">${markup()}${extra}</main><button id="next">Next target</button></body></html>`);
    // tsx's keep-names helper can accompany serialized nested test callbacks.
    await page.evaluate("window.__name = (callback) => callback");
    await page.waitForFunction(() => getComputedStyle(document.querySelector(".bf-image-comparison")!).getPropertyValue("--bf-image-comparison-grip-inline-size").trim() === "1.5rem");
    await page.evaluate(async ({ origin, initial }) => {
      const api = await import(`${origin}/dist/index.js`);
      const state = window as any;
      state.api = api;
      state.host = document.getElementById("comparison");
      state.events = [];
      state.nativeEvents = [];
      state.host.addEventListener("bf-image-comparison-change", (event: CustomEvent) => state.events.push({ ...event.detail, canonical: state.controller?.getValue(), native: state.host.querySelector("input").value }));
      state.host.addEventListener("input", () => state.nativeEvents.push("input"));
      state.host.addEventListener("change", () => state.nativeEvents.push("change"));
      state.controller = api.setupImageComparison(state.host, { initialValue: initial, firstLabel: "Before", secondLabel: "After" });
    }, { origin, initial });
  }
  async function state(page: Page): Promise<any> {
    return page.evaluate(() => {
      const w = window as any, host = w.host as HTMLElement, stage = host.querySelector(".bf-image-comparison-stage") as HTMLElement;
      const input = host.querySelector("input") as HTMLInputElement, grip = host.querySelector(".bf-image-comparison-grip") as HTMLElement;
      const h = host.getBoundingClientRect(), s = stage.getBoundingClientRect(), g = grip.getBoundingClientRect(), seam = host.querySelector(".bf-image-comparison-seam")!.getBoundingClientRect();
      return { value: w.controller.getValue(), native: Number(input.value), position: host.style.getPropertyValue("--bf-image-comparison-position"), valueText: input.getAttribute("aria-valuetext"), clip: getComputedStyle(host.querySelector(".is-first")!).clipPath,
        dir: getComputedStyle(stage).direction, host: { left: h.left, right: h.right }, stage: { left: s.left, right: s.right, width: s.width }, seam: seam.left + seam.width / 2, grip: { left: g.left, right: g.right, center: g.left + g.width / 2, width: g.width, height: g.height },
        focus: document.activeElement === input, pointer: host.classList.contains("is-pointer-focus"), ring: getComputedStyle(grip).outlineStyle, events: w.events, nativeEvents: w.nativeEvents };
    });
  }
  async function geometry(page: Page, label: string, expected: number): Promise<void> {
    const s = await state(page), coordinate = s.dir === "rtl" ? s.stage.right - s.stage.width * expected / 100 : s.stage.left + s.stage.width * expected / 100;
    const clip = s.dir === "rtl" ? `inset(0px 0px 0px ${100 - expected}%)` : `inset(0px ${100 - expected}% 0px 0px)`;
    check(s.value === expected && s.native === expected && s.position === `${expected}%` && Math.abs(s.seam - coordinate) < .1 && Math.abs(s.grip.center - coordinate) < .1 && s.clip === clip, `${label}: canonical/native/mask/seam/grip`, s);
    check(s.grip.left >= s.host.left && s.grip.right <= s.host.right, `${label}: full endpoint grip within runway`, s);
  }
  async function drag(page: Page, from: number, to: number, release = true): Promise<void> {
    const stage = page.locator("#comparison .bf-image-comparison-stage");
    await stage.scrollIntoViewIfNeeded();
    const b = (await stage.boundingBox())!;
    await page.mouse.move(b.x + b.width * from, b.y + b.height / 2); await page.mouse.down();
    await page.mouse.move(b.x + b.width * to, b.y + b.height / 2, { steps: 5 });
    if (release) await page.mouse.up();
  }
  async function stageZeroPointer(page: Page): Promise<void> {
    const grip = (await page.locator("#comparison .bf-image-comparison-grip").boundingBox())!;
    await page.mouse.move(grip.x + grip.width / 2, grip.y + grip.height / 2); await page.mouse.down();
    await page.mouse.move(grip.x + grip.width + 30, grip.y + grip.height / 2); await page.mouse.up();
  }
  try {
    const namingPage = await browser.newPage({ viewport: { width: 600, height: 900 } });
    for (const [kind, expected] of [["text label", "Native text label"], ["aria-label", "Native ARIA label"], ["aria-labelledby", "Native reference label"], ["image-alt label", "Native image label"], ["rich label", "Rich native label"], ["ARIA reference", "Native ARIA reference"], ["title", "Native title name"], ["hidden-only label", ""]]) {
      await mount(namingPage);
      await namingPage.evaluate(kind => {
        const w = window as any; w.controller.destroy();
        const input = w.host.querySelector("input"); input.id = "naming-range"; input.removeAttribute("aria-label");
        if (kind === "aria-label") input.setAttribute("aria-label", "Native ARIA label");
        else if (kind === "title") input.title = "Native title name";
        else if (kind === "aria-labelledby" || kind === "ARIA reference") {
          const label = document.createElement("span"); label.id = "naming-target";
          if (kind === "ARIA reference") label.setAttribute("aria-label", "Native ARIA reference");
          else label.textContent = "Native reference label";
          input.setAttribute("aria-labelledby", label.id); w.host.before(label);
        } else {
          const label = document.createElement("label"); label.htmlFor = input.id;
          if (kind === "text label") label.textContent = "Native text label";
          if (kind === "rich label") label.innerHTML = "<span>Rich</span> <strong>native label</strong>";
          if (kind === "image-alt label") label.innerHTML = '<img alt="Native image label" src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221%22 height=%221%22/%3E">';
          if (kind === "hidden-only label") label.innerHTML = '<span aria-hidden="true">This text is not a native name</span>';
          w.host.before(label);
        }
        w.nativeNameSnapshot = ["aria-label", "aria-labelledby", "title", "id"].map(name => input.getAttribute(name));
        w.controller = w.api.setupImageComparison(w.host, { firstLabel: "Before", secondLabel: "After" });
      }, kind);
      const range = namingPage.getByRole("slider");
      const named = await range.ariaSnapshot();
      check(expected ? named.includes(`slider "${expected}"`) : named.startsWith("- slider:"), `${kind}: browser computes consumer-owned native name${expected ? "" : " (documented consumer error; setup does not validate)"}`, named);
      await namingPage.evaluate(() => { const w = window as any; w.controller.update({ firstLabel: "Original", secondLabel: "Revised" }); w.host.querySelector(".is-first").innerHTML = "New source descendants"; w.controller.setValue(37); });
      const refreshed = await range.ariaSnapshot();
      check(expected ? refreshed.includes(`slider "${expected}"`) : refreshed.startsWith("- slider:"), `${kind}: source/value/endpoint metadata preserve native name`, refreshed);
      check(await namingPage.evaluate(() => { const w = window as any; return JSON.stringify(["aria-label", "aria-labelledby", "title", "id"].map(name => w.host.querySelector("input").getAttribute(name))) === JSON.stringify(w.nativeNameSnapshot); }), `${kind}: runtime never writes consumer name attributes`);
      await namingPage.evaluate(() => {
        const w = window as any, input = w.host.querySelector("input");
        const label = document.createElement("span"); label.id = "edited-name"; label.textContent = "Consumer edited association"; w.host.before(label);
        input.setAttribute("aria-labelledby", label.id); input.setAttribute("aria-label", "Consumer edited ARIA label"); input.title = "Consumer edited title";
        w.editedNameSnapshot = ["aria-label", "aria-labelledby", "title", "id"].map(name => input.getAttribute(name));
        w.controller.update({});
      });
      check((await range.ariaSnapshot()).includes('slider "Consumer edited association"'), `${kind}: consumer can change native association during lifetime`);
      await namingPage.evaluate(() => (window as any).controller.destroy());
      check(await namingPage.evaluate(() => { const w = window as any; return JSON.stringify(["aria-label", "aria-labelledby", "title", "id"].map(name => w.host.querySelector("input").getAttribute(name))) === JSON.stringify(w.editedNameSnapshot); }) && (await range.ariaSnapshot()).includes('slider "Consumer edited association"'), `${kind}: destroy preserves all external name/association edits`);
    }
    for (const kind of ["absent", "authored empty", "authored style", "consumer added style"]) {
      await mount(namingPage);
      const restored = await namingPage.evaluate(kind => {
        const w = window as any; w.controller.destroy();
        if (kind === "absent" || kind === "consumer added style") w.host.removeAttribute("style");
        if (kind === "authored empty") w.host.setAttribute("style", "");
        if (kind === "authored style") w.host.setAttribute("style", "color: red; --bf-image-comparison-position: 31% !important;");
        const before = w.host.outerHTML, style = w.host.getAttribute("style");
        w.controller = w.api.setupImageComparison(w.host, { initialValue: 63 });
        if (kind === "consumer added style") w.host.style.color = "blue";
        w.controller.destroy();
        return { before, after: w.host.outerHTML, styleBefore: style, styleAfter: w.host.getAttribute("style"), position: w.host.style.getPropertyValue("--bf-image-comparison-position"), color: w.host.style.color };
      }, kind);
      check(kind === "consumer added style" ? restored.color === "blue" && !restored.position : restored.before === restored.after && restored.styleBefore === restored.styleAfter, `${kind}: destroy restores owned style without adding/removing author attributes`, restored);
    }
    await namingPage.close();
    if (process.argv.includes("--naming")) {
      console.log(`Image comparison naming passed (${records.length} checks, Chrome).`);
      return;
    }
    // All direct/shared tiers, both native directions and both root sizes.
    for (const tier of ["editorial", "documentation", "app", "os"]) for (const shared of [false, true]) for (const dir of ["ltr", "rtl"]) {
      const page = await browser.newPage({ viewport: { width: 1100, height: 900 }, reducedMotion: "reduce" });
      page.on("pageerror", error => errors.push(error.message));
      for (const root of [16, 20]) {
        await mount(page, { tier, shared, dir, root, host: root === 16 ? 240 : 960 });
        const range = page.getByRole("slider"), label = `${tier}/${shared ? "shared" : "direct"}/${dir}/root${root}`;
        await range.focus(); await range.press("Home");
        for (let value = 0; value <= 5; value++) { if (value) await range.press("ArrowUp"); await geometry(page, `${label}/${value}`, value); }
        await range.press("End");
        for (let value = 100; value >= 95; value--) { if (value < 100) await range.press("ArrowDown"); await geometry(page, `${label}/${value}`, value); }
        await range.press(dir === "rtl" ? "ArrowRight" : "ArrowLeft"); await geometry(page, `${label}/native logical arrow`, 94);
        const g = await state(page);
        check(g.grip.width === 1.5 * root && g.grip.height === 80 && g.focus && g.ring === "solid", `${label}: original decoration and keyboard focus`, g);
        await drag(page, .5, .8); await geometry(page, `${label}/real drag`, dir === "rtl" ? 20 : 80);
        const pointer = await state(page);
        check(pointer.focus && pointer.pointer && pointer.ring === "none" && pointer.events.at(-1).phase === "change", `${label}: pointer modality and commit`, pointer);
        check(pointer.events.every((e: any) => e.value === e.canonical && Number(e.native) === e.value), `${label}: notifications see synchronized state`, pointer.events);
        await page.locator("#prior").focus(); await page.keyboard.press("Tab");
        check((await state(page)).ring === "solid", `${label}: external Tab restores focus`);
      }
      await page.close();
    }
    const page = await browser.newPage({ viewport: { width: 600, height: 900 } });
    page.on("pageerror", error => errors.push(error.message));
    await mount(page, { extra: markup("other") });
    const range = page.locator("#comparison").getByRole("slider");
    check(await page.evaluate(() => { const w = window as any; return w.api.setupImageComparison(w.host, { initialValue: 0 }) === w.controller; }), "setup idempotent with mount-only initial value");
    await geometry(page, "default/idempotent", 50);
    for (const [raw, expected] of [[0, 0], [42.6, 43], [-3, 0], [103, 100], [Infinity, 100], [NaN, 100]]) {
      await page.evaluate(raw => (window as any).controller.setValue(raw), raw); await geometry(page, `API normalization ${raw}`, expected);
    }
    check((await state(page)).events.length === 0 && (await state(page)).nativeEvents.length === 0, "imperative updates synthesize no events");
    await page.evaluate(() => { const w = window as any; w.controller.update({ firstLabel: "Original", secondLabel: "Revised" }); w.host.querySelector(".is-first").innerHTML = "Replaced source descendants"; w.other = w.api.setupImageComparison(document.getElementById("other"), { initialValue: 0 }); });
    await geometry(page, "metadata/source rerender preserves value", 100);
    check(await range.getAttribute("aria-valuetext") === "100% Original, 0% Revised" && await range.getAttribute("aria-label") === "Synthetic image comparison", "metadata updates value text while preserving consumer native name");
    check(await page.evaluate(() => (window as any).other.getValue()) === 0, "multiple controllers remain independent");
    // Same-value echoes keep capture; changed external values defeat stale release.
    await page.evaluate(() => (window as any).controller.setValue(50));
    await drag(page, .5, .8, false);
    await page.evaluate(() => { const w = window as any; w.controller.setValue(w.controller.getValue()); });
    await page.mouse.up(); await geometry(page, "same-value API echo keeps gesture", 80);
    await drag(page, .8, .6, false);
    await page.evaluate(() => (window as any).controller.setValue(23));
    await page.mouse.up(); await geometry(page, "changed API value interrupts capture", 23);
    await drag(page, .23, .7, false); await range.press("ArrowLeft"); await page.mouse.up(); await geometry(page, "native keyboard interrupts capture", 69);
    await drag(page, .69, .3, false); await page.keyboard.press("Escape"); await page.mouse.up(); await geometry(page, "Escape restores starting value", 69);
    check((await state(page)).events.at(-1).phase === "cancel", "Escape emits cancel after restoration");
    await page.locator("#comparison .bf-image-comparison-stage").evaluate(el => el.addEventListener("pointerdown", (event: PointerEvent) => (el as HTMLElement).dataset.pointer = String(event.pointerId), { once: true }));
    await drag(page, .69, .3, false);
    await page.locator("#comparison .bf-image-comparison-stage").evaluate(el => el.releasePointerCapture(Number((el as HTMLElement).dataset.pointer)));
    await page.mouse.up(); await geometry(page, "external lost capture restores start", 69);
    await page.evaluate(() => { const w = window as any; w.host.style.direction = "rtl"; w.controller.update({}); });
    await geometry(page, "idle CSS-only direction refresh", 69);
    await range.press("Home"); await range.press("ArrowLeft"); await geometry(page, "CSS-only RTL native arrow agrees", 1);
    await drag(page, .5, .2, false);
    await page.evaluate(() => (window as any).host.style.direction = "ltr");
    let box = (await page.locator("#comparison .bf-image-comparison-stage").boundingBox())!;
    await page.mouse.move(box.x + box.width * .6, box.y + box.height / 2); await page.mouse.up();
    await geometry(page, "computed direction changes during capture", 60);
    await drag(page, .6, .8, false);
    await page.evaluate(() => (window as any).host.style.inlineSize = "240px");
    box = (await page.locator("#comparison .bf-image-comparison-stage").boundingBox())!;
    await page.mouse.move(box.x + box.width * .3, box.y + box.height / 2); await page.mouse.up();
    await geometry(page, "current geometry after resize during capture", 30);
    // Entire endpoint grip is a pointer target, including outside the image.
    for (const endpoint of [0, 100]) {
      await page.evaluate(value => (window as any).controller.setValue(value), endpoint);
      const grip = (await page.locator("#comparison .bf-image-comparison-grip").boundingBox())!;
      await page.mouse.move(grip.x + grip.width * (endpoint ? .75 : .25), grip.y + grip.height / 2); await page.mouse.down();
      await page.mouse.move(box.x + box.width * .5, box.y + box.height / 2); await page.mouse.up();
      await geometry(page, `${endpoint} outer-half grip drag`, 50);
    }
    await page.evaluate(() => { const w = window as any; w.events = []; });
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2, { button: "right" });
    check((await state(page)).events.length === 0, "secondary button cannot take gesture ownership");
    // Synchronous custom-event listeners can supersede every user phase.
    for (const phase of ["input", "change", "cancel"]) for (const action of ["setValue", "destroy"]) {
      await mount(page);
      await page.evaluate(({ phase, action }) => {
        const w = window as any;
        const listener = (event: CustomEvent) => { if (event.detail.phase !== phase) return; w.host.removeEventListener("bf-image-comparison-change", listener); if (action === "destroy") w.controller.destroy(); else w.controller.setValue(17); };
        w.host.addEventListener("bf-image-comparison-change", listener);
      }, { phase, action });
      await drag(page, .5, .8, phase === "change");
      if (phase === "cancel") await page.keyboard.press("Escape");
      await page.mouse.up();
      const s = await state(page), last = s.events.at(-1);
      check(action === "setValue" ? s.value === 17 && s.native === 17 : s.native === 27 && !s.position, `${phase}/${action}: listener wins without stale writes`, s);
      check(last.phase === phase, `${phase}/${action}: no stale commit/cancel`, s.events);
    }
    // Native input/change remains asynchronous and does not double-echo.
    await mount(page);
    await page.evaluate(async () => { const w = window as any, input = w.host.querySelector("input"); input.value = "32"; input.dispatchEvent(new Event("input", { bubbles: true })); await new Promise(resolve => setTimeout(resolve, 0)); input.dispatchEvent(new Event("change", { bubbles: true })); });
    await geometry(page, "asynchronous native input/change", 32);
    let s = await state(page);
    check(s.events.map((e: any) => `${e.phase}/${e.source}`).join() === "input/native,change/native" && s.nativeEvents.join() === "input,change", "one custom notification per native phase without native synthesis", s);
    for (const phase of ["input", "change"]) for (const action of ["setValue", "destroy"]) {
      await mount(page);
      await page.evaluate(({ phase, action }) => {
        const w = window as any;
        w.host.addEventListener("bf-image-comparison-change", () => { if (action === "destroy") w.controller.destroy(); else w.controller.setValue(17); }, { once: true });
        const input = w.host.querySelector("input"); input.value = "32"; input.dispatchEvent(new Event(phase, { bubbles: true }));
      }, { phase, action });
      s = await state(page);
      check(action === "setValue" ? s.value === 17 && s.native === 17 : s.native === 27 && !s.position, `native ${phase}/${action}: synchronous listener wins`, s);
      check(s.events.length === 1, `native ${phase}/${action}: no recursive notification`, s.events);
    }
    await mount(page);
    // Destroy during capture restores only runtime-owned writes and removes globals.
    await page.evaluate(() => { const w = window as any; w.controller.destroy(); w.host.style.setProperty("--bf-image-comparison-position", "31%", "important"); w.host.style.color = "red"; w.host.classList.add("consumer-class"); w.host.querySelector("input").setAttribute("aria-valuetext", "Consumer text"); w.snapshot = w.host.outerHTML; w.controller = w.api.setupImageComparison(w.host, { initialValue: 0 }); });
    await drag(page, .1, .7, false);
    await page.evaluate(() => { const w = window as any; w.beforeDestroyEvents = w.events.length; w.controller.destroy(); w.controller.destroy(); w.controller.setValue(99); w.controller.update({ firstLabel: "Stale" }); });
    await page.keyboard.press("Escape"); await page.mouse.up();
    check(await page.evaluate(() => { const w = window as any; return w.host.outerHTML === w.snapshot && w.events.length === w.beforeDestroyEvents; }), "idempotent destruction restores snapshots and removes Escape/capture work");
    await page.evaluate(() => { const w = window as any; w.controller = w.api.setupImageComparison(w.host, { initialValue: 12 }); });
    await geometry(page, "remount gets new controller and initial value", 12);
    // Invalid initial values and required structure are handled independently of naming.
    await page.evaluate(() => { const w = window as any; w.controller.destroy(); w.controller = w.api.setupImageComparison(w.host, { initialValue: Infinity }); });
    await geometry(page, "invalid initial falls back to 50", 50);
    const invalid = await page.evaluate(() => {
      const w = window as any;
      return ["step", "stage", "duplicate", "combined layers", "nested host"].map(kind => {
        const clone = w.host.cloneNode(true) as HTMLElement; clone.id = `invalid-${kind}`;
        if (kind === "step") (clone.querySelector("input") as HTMLInputElement).step = "2";
        if (kind === "stage") clone.querySelector(".bf-image-comparison-stage")!.classList.remove("bf-image-comparison-stage");
        if (kind === "duplicate") clone.querySelector("input")!.after(clone.querySelector("input")!.cloneNode());
        if (kind === "combined layers") { clone.querySelector(".is-second")!.remove(); clone.querySelector(".is-first")!.classList.add("is-second"); }
        if (kind === "nested host") clone.querySelector(".is-first")!.appendChild(document.createElement("div")).classList.add("bf-image-comparison");
        document.body.append(clone); const before = clone.outerHTML; let threw = false;
        try { w.api.setupImageComparison(clone); } catch { threw = true; }
        const unchanged = clone.outerHTML === before; clone.remove(); return { kind, threw, unchanged };
      });
    });
    check(invalid.every(x => x.threw && x.unchanged), "invalid structures rejected before mutation", invalid);
    await page.evaluate(() => {
      const w = window as any; w.controller.destroy(); const input = w.host.querySelector("input");
      input.removeAttribute("aria-label"); input.setAttribute("aria-labelledby", "visible-comparison-name");
      const label = document.createElement("span"); label.id = "visible-comparison-name"; label.textContent = "Visible comparison name"; w.host.before(label);
      w.controller = w.api.setupImageComparison(w.host, { initialValue: 50 });
      w.controller.update({ firstLabel: "Before" });
    });
    check(await range.getAttribute("aria-label") === null && await range.getAttribute("aria-labelledby") === "visible-comparison-name" && (await range.ariaSnapshot()).includes("Visible comparison name"), "native visible label remains preferred over metadata name");
    await page.evaluate(() => { const w = window as any; w.controller.setValue(41); (w.host.querySelector("input") as HTMLInputElement).disabled = true; w.events = []; });
    await drag(page, .3, .8); await geometry(page, "disabled range disables stage editing", 41);
    check((await state(page)).events.length === 0, "disabled stage emits no user notifications");
    await page.evaluate(() => { const w = window as any; w.host.querySelector("input").disabled = false; w.host.style.inlineSize = "0px"; });
    // A zero stage cannot mutate canonical state; restoring its host recovers dragging.
    await page.locator("#comparison .bf-image-comparison-stage").evaluate(el => (el as HTMLElement).style.inlineSize = "0px");
    await page.evaluate(() => (window as any).controller.update({ firstLabel: "Before" }));
    check((await state(page)).value === 41, "zero-width metadata/source recovery preserves state");
    await stageZeroPointer(page);
    check((await state(page)).value === 41, "zero-width captured pointer cannot mutate accepted value");
    await page.evaluate(() => { const w = window as any; w.host.style.inlineSize = "100%"; w.host.querySelector(".bf-image-comparison-stage").style.inlineSize = ""; });
    await drag(page, .4, .7); await geometry(page, "zero-width recovery", 70);
    await page.close();

    // Real Chrome touch path: horizontal intent, tap, vertical pan, cancel.
    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    mobile.on("pageerror", error => errors.push(error.message));
    await mount(mobile, { host: 350 });
    const stage = mobile.locator("#comparison .bf-image-comparison-stage");
    const cdp = await mobile.context().newCDPSession(mobile);
    const touch = (type: string, x = 0, y = 0) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: ["touchEnd", "touchCancel"].includes(type) ? [] : [{ x, y, id: 1 }] });
    let b = (await stage.boundingBox())!;
    await touch("touchStart", b.x + b.width * .5, b.y + b.height / 2);
    for (let i = 1; i <= 8; i++) await touch("touchMove", b.x + b.width * (.5 + .0375 * i), b.y + b.height / 2);
    await touch("touchEnd"); await geometry(mobile, "Chrome horizontal touch", 80);
    await touch("touchStart", b.x + b.width * .8, b.y + b.height / 2); await touch("touchMove", b.x + b.width * .4, b.y + b.height / 2); await touch("touchCancel");
    await geometry(mobile, "Chrome touchCancel restores", 80);
    await mobile.locator("#prior").focus(); b = (await stage.boundingBox())!;
    const beforeScroll = await mobile.evaluate(() => scrollY);
    await touch("touchStart", b.x + b.width / 2, b.y + b.height * .9);
    for (let i = 1; i <= 8; i++) await touch("touchMove", b.x + b.width / 2, b.y + b.height * .9 - i * 15);
    await touch("touchEnd");
    check(await mobile.evaluate(() => scrollY) > beforeScroll, "vertical touch pan remains native");
    await geometry(mobile, "vertical pan preserves value", 80);
    await mobile.locator("#prior").focus(); await mobile.keyboard.press("Tab");
    check((await state(mobile)).ring === "solid", "nonfocusing vertical pan does not poison later Tab focus");
    await stage.scrollIntoViewIfNeeded(); b = (await stage.boundingBox())!;
    await mobile.touchscreen.tap(b.x + b.width * .3, b.y + b.height / 2); await geometry(mobile, "touch tap", 30);
    check((await state(mobile)).ring === "none" && (await state(mobile)).focus, "touch focus is pointer modality");
    await mobile.close();
    check(errors.length === 0, "all comparison pages avoid runtime errors", errors);
    console.log(`Image comparison behavior passed (${records.length} checks, Chrome).`);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
    throw error;
  } finally {
    await browser.close();
    await fs.mkdir("tmp/image-comparison", { recursive: true });
    await fs.writeFile(`tmp/image-comparison/${process.argv.includes("--naming") ? "naming" : "behavior"}.json`, JSON.stringify({ checks: records.length, records, errors }, null, 2) + "\n");
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const { server, origin } = await createStaticServer(path.resolve("."));
  try { await verifyImageComparison(origin); }
  finally { await closeServer(server); }
}
