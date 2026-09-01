import fs from "node:fs/promises";
import path from "node:path";
import { closeServer, createStaticServer, waitForFonts } from "./component-demo-shared.ts";
import { assert, disableDemoChromeHitTesting, openBrowser } from "./behavior/browser-helpers.ts";
import {
  verifyContentCardGeometry,
  verifyInteractiveTables,
  verifyLinkedLogoAndStickyFooterGeometry,
  verifyPortedCompositionGeometry,
  verifyReducedNavigationAndTableOfContents,
  verifyRichListsAndTabSectionGeometry,
  verifySiteShellPrimitiveGeometry,
  verifySitesRecipeCompositions
} from "./behavior/ported-component-contracts.ts";

async function readAsideWidth(page: import("playwright").Page): Promise<number> {
  return page.locator(".bf-aside.is-pinned").evaluate(element => element.getBoundingClientRect().width);
}

async function verifyNumberStepperChevron(origin: string): Promise<void> {
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1440, height: 720 }
    });
    const runtimeErrors: string[] = [];
    page.on("pageerror", error => runtimeErrors.push(error.message));
    page.on("console", message => {
      if (message.type() === "error") runtimeErrors.push(message.text());
    });
    await page.goto(`${origin}/demo/spec/spacing-horizontal.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await page.waitForFunction(() => {
      const brandIcon = document.querySelector('section[aria-label="Branded primary side navigation"] .bf-top-navigation-logo-icon');
      return Boolean(brandIcon?.complete && brandIcon.naturalWidth > 0);
    });
    assert(await page.locator(".pc-nav").count() === 1 && await page.locator(".pc-header").count() === 1 && await page.locator(".pc-footer").count() === 1, "Expected the horizontal audit to retain the shared page chrome and side navigation.");
    const overlay = page.locator("[data-spacing-keyline-debug]");
    const keylines = page.locator("[data-spacing-keyline]");
    assert(await overlay.count() === 1 && await keylines.count() === 3, "Expected the horizontal audit to install exactly one three-line keyline overlay.");
    const initialUpdateCount = Number(await overlay.getAttribute("data-spacing-keyline-update-count"));
    const initialKeylines = await keylines.evaluateAll(lines => lines.map(line => {
      const style = getComputedStyle(line);
      return {
        authoredLeft: (line as HTMLElement).style.left,
        authoredWidth: (line as HTMLElement).style.width,
        color: style.backgroundColor,
        left: style.left,
        opacity: style.opacity,
        width: style.width
      };
    }));
    assert(initialKeylines.every(line => line.opacity === "0.5" && line.width === "1px" && line.authoredWidth === "0.0625rem" && line.authoredLeft.endsWith("rem")), "Expected every spacing keyline to use rem-authored geometry and resolve to one CSS pixel at the default root size with 50% opacity.");
    assert(initialKeylines.map(line => line.color).join("|") === "rgb(255, 0, 0)|rgb(0, 128, 0)|rgb(0, 0, 255)", "Expected one-rem, field-text, and disclosure-label keylines to remain red, green, and blue.");
    const alignmentGeometry = await page.evaluate(`(() => {
      const number = value => Number.parseFloat(value) || 0;
      const box = selector => {
        const element = document.querySelector(selector);
        if (!element) throw new Error("Missing spacing-audit element: " + selector);
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return { left: rect.left, top: rect.top, paddingLeft: number(style.paddingLeft), gap: number(style.gap) };
      };
      const pseudo = (selector, name = "::before") => {
        const element = document.querySelector(selector);
        if (!element) throw new Error("Missing spacing-audit pseudo host: " + selector);
        const style = getComputedStyle(element, name);
        return { left: number(style.left), top: number(style.top), width: number(style.width), height: number(style.height) };
      };
      const iconLabelStart = selector => {
        const host = box(selector);
        const icon = pseudo(selector);
        return host.left + host.paddingLeft + icon.width + host.gap;
      };
      const textStart = selector => {
        const element = document.querySelector(selector);
        if (!element) throw new Error("Missing spacing-audit text host: " + selector);
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        let node = walker.nextNode();
        while (node && !node.textContent.trim()) node = walker.nextNode();
        if (!node) throw new Error("Missing spacing-audit text: " + selector);
        const range = document.createRange();
        range.selectNodeContents(node);
        return range.getBoundingClientRect().left;
      };
      const radio = box(".bf-radio-label");
      const radioOuter = pseudo(".bf-radio-label");
      const radioDot = pseudo(".bf-radio-label", "::after");
      const radioOuterStyle = getComputedStyle(document.querySelector(".bf-radio-label"), "::before");
      const checkbox = box(".bf-checkbox-label");
      const checkboxOuter = pseudo(".bf-checkbox-label");
      const checkboxCheck = pseudo(".bf-checkbox-label", "::after");
      const prose = box(".bf-prose ul > li");
      const proseDot = pseudo(".bf-prose ul > li");
      const markCenter = selector => {
        const host = box(selector);
        const mark = pseudo(selector);
        return host.left + mark.left + (mark.width / 2);
      };
      const page = box("main.bf-page");
      const brandIcon = document.querySelector('section[aria-label="Branded primary side navigation"] .bf-top-navigation-logo-icon');
      const red = document.querySelector("[data-spacing-keyline='one-rem-inset']");
      const green = document.querySelector("[data-spacing-keyline='field-text-start']");
      const blue = document.querySelector("[data-spacing-keyline='disclosure-label-start']");
      if (!red || !green || !blue) throw new Error("Missing a spacing debug keyline.");
      return {
        proseDotCenter: prose.left + proseDot.left + (proseDot.width / 2),
        radioCenter: radio.left + radioOuter.left + (radioOuter.width / 2),
        radioDotCenterX: radio.left + radioDot.left + (radioDot.width / 2),
        radioCenterY: radio.top + radioOuter.top + (radioOuter.height / 2),
        radioDotCenterY: radio.top + radioDot.top + (radioDot.height / 2),
        radioDotWidth: radioDot.width,
        borderWidth: number(radioOuterStyle.borderInlineStartWidth),
        expectedRadioDotWidth: (radioOuter.width * 0.375) + number(radioOuterStyle.borderInlineStartWidth),
        checkboxCenter: checkbox.left + checkboxOuter.left + (checkboxOuter.width / 2),
        checkboxCenterY: checkbox.top + checkboxOuter.top + (checkboxOuter.height / 2),
        checkboxCheckCenterY: checkbox.top + checkboxCheck.top + (checkboxCheck.height / 2),
        leadingMarkCenters: [".bf-prose ul > li", ".bf-list-item.is-ticked", ".bf-list-item.is-crossed", ".bf-checkbox-label", ".bf-radio-label"].map(markCenter),
        markedTextStarts: [".bf-prose ul > li", ".bf-prose ol > li", ".bf-list-item.is-ticked", ".bf-list-item.is-crossed", ".bf-checkbox-label", ".bf-radio-label", ".bf-validation-message"].map(textStart),
        fieldTextStarts: [".bf-table td", ".bf-status-label"].map(textStart),
        commandTextStarts: [".bf-button", ".bf-segmented-control-button", ".bf-tabs-link", ".bf-pagination-link"].map(textStart),
        accordionStart: iconLabelStart(".bf-accordion-tab"),
        listTreeStart: iconLabelStart(".bf-list-tree-toggle"),
        treeChildStart: textStart(".bf-list-tree .bf-list-tree .bf-list-tree-link"),
        brandTagStart: box('section[aria-label="Branded primary side navigation"] .bf-top-navigation-logo-tag').left,
        brandTitle: textStart('section[aria-label="Branded primary side navigation"] .bf-top-navigation-logo-title'),
        brandIconLoaded: Boolean(brandIcon?.complete && brandIcon.naturalWidth > 0),
        sideNavigationPlainStart: textStart('section[aria-labelledby="horizontal-icon-navigation"] .bf-side-navigation-link'),
        sideNavigationDisclosureStart: textStart('section[aria-labelledby="horizontal-icon-navigation"] .bf-side-navigation-accordion-button'),
        tableOfContentsHeadingStart: textStart(".bf-table-of-contents-heading"),
        tableOfContentsLinkStart: textStart(".bf-table-of-contents-link"),
        notificationStart: box(".bf-notification-title").left,
        panelStart: box(".bf-panel-content p").left,
        redStart: red.getBoundingClientRect().left,
        greenStart: green.getBoundingClientRect().left,
        blueStart: blue.getBoundingClientRect().left,
        expectedRedStart: page.left + page.paddingLeft + Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
      };
    })()`);
    assert(Math.max(...alignmentGeometry.leadingMarkCenters) - Math.min(...alignmentGeometry.leadingMarkCenters) < 0.51, "Expected prose-list, state-list, checkbox, and radio marks to share one leading-mark centre.");
    assert(Math.abs(alignmentGeometry.radioDotCenterX - alignmentGeometry.radioCenter) < 0.01 && Math.abs(alignmentGeometry.radioDotCenterY - alignmentGeometry.radioCenterY) < 0.01, "Expected the radio inner dot to be concentric with the outer circle.");
    assert(Math.abs(alignmentGeometry.radioDotWidth - alignmentGeometry.expectedRadioDotWidth) < 0.01, "Expected the radio inner dot to be one scalable border unit wider than its previous proportional size.");
    assert(Math.abs(alignmentGeometry.checkboxCenterY - alignmentGeometry.checkboxCheckCenterY) <= alignmentGeometry.borderWidth * 0.5, "Expected the checkbox check to sit optically within half a scalable border unit of the outer-box centre.");
    assert(alignmentGeometry.markedTextStarts.every(start => Math.abs(start - alignmentGeometry.blueStart) < 0.51), "Expected prose-list, list-row, checkbox, and radio text to share the blue continuation keyline.");
    assert(alignmentGeometry.fieldTextStarts.every(start => Math.abs(start - alignmentGeometry.greenStart) < 0.51), "Expected table-cell and status-label text to share the green field-inset keyline.");
    assert(alignmentGeometry.commandTextStarts.every(start => Math.abs(start - alignmentGeometry.redStart) < 0.51), "Expected button, segmented-control, tab, and pagination text to share the red one-rem action keyline.");
    assert(alignmentGeometry.brandIconLoaded && alignmentGeometry.brandTitle > alignmentGeometry.brandTagStart, `Expected the imported tagged brand asset and Baseline Foundry wordmark to render as one primary-navigation logo; got ${JSON.stringify(alignmentGeometry)}.`);
    const continuationStarts = [alignmentGeometry.accordionStart, alignmentGeometry.listTreeStart, alignmentGeometry.treeChildStart, alignmentGeometry.brandTagStart, alignmentGeometry.sideNavigationPlainStart, alignmentGeometry.sideNavigationDisclosureStart, alignmentGeometry.tableOfContentsHeadingStart, alignmentGeometry.tableOfContentsLinkStart, alignmentGeometry.notificationStart, alignmentGeometry.panelStart];
    assert(Math.max(...continuationStarts) - Math.min(...continuationStarts) < 0.51, `Expected the brand tag, accordion, list-tree disclosure/child, plain/disclosure side-navigation, table of contents, notification, and panel copy to share one continuation inset; got ${JSON.stringify({ continuationStarts, alignmentGeometry })}.`);
    assert(Math.abs(alignmentGeometry.redStart - alignmentGeometry.expectedRedStart) < 0.51, "Expected the red audit keyline to represent a literal one-rem page inset.");
    const tierSelect = page.getByLabel("Tier", { exact: true });
    const toneToggle = page.locator("[data-page-chrome-tone-toggle]");
    for (const tone of ["light", "dark"] as const) {
      const wantsDark = tone === "dark";
      if (await toneToggle.isChecked() !== wantsDark) {
        await toneToggle.setChecked(wantsDark, { force: true });
      }
      await page.waitForFunction(expectedDark => document.body.classList.contains("is-dark") === expectedDark, wantsDark);
      for (const tier of ["editorial", "documentation", "app", "os"] as const) {
        await tierSelect.selectOption(tier);
        await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
        await page.waitForTimeout(50);
        const matrix = await page.evaluate(`(() => {
          const textStart = selector => {
            const element = document.querySelector(selector);
            if (!element) throw new Error("Missing spacing matrix element: " + selector + ".");
            const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
            let node = walker.nextNode();
            while (node && !node.textContent?.trim()) node = walker.nextNode();
            if (!node) throw new Error("Missing spacing matrix text: " + selector + ".");
            const range = document.createRange();
            range.selectNodeContents(node);
            return range.getBoundingClientRect().left;
          };
          const line = name => {
            const element = document.querySelector("[data-spacing-keyline='" + name + "']");
            if (!element) throw new Error("Missing spacing matrix keyline: " + name + ".");
            return element.getBoundingClientRect().left;
          };
          const markCenter = selector => {
            const element = document.querySelector(selector);
            if (!element) throw new Error("Missing spacing matrix mark: " + selector + ".");
            const host = element.getBoundingClientRect();
            const mark = getComputedStyle(element, "::before");
            return host.left + Number.parseFloat(mark.left) + (Number.parseFloat(mark.width) / 2);
          };
          const numberStyle = getComputedStyle(document.querySelector('input[type="number"]'));
          const selectStyle = getComputedStyle(document.querySelector("select"));
          return {
            action: [".bf-button", ".bf-segmented-control-button", ".bf-tabs-link", ".bf-pagination-link"].map(textStart),
            continuation: [
              textStart(".bf-accordion-tab"),
              textStart(".bf-list-tree-toggle"),
              textStart(".bf-list-tree .bf-list-tree .bf-list-tree-link"),
              document.querySelector('section[aria-label="Branded primary side navigation"] .bf-top-navigation-logo-tag').getBoundingClientRect().left,
              textStart('section[aria-labelledby="horizontal-icon-navigation"] .bf-side-navigation-link'),
              textStart('section[aria-labelledby="horizontal-icon-navigation"] .bf-side-navigation-accordion-button'),
              textStart(".bf-table-of-contents-heading"),
              textStart(".bf-table-of-contents-link"),
              document.querySelector(".bf-notification-title").getBoundingClientRect().left,
              textStart(".bf-panel-content p")
            ],
            field: [".bf-table td", ".bf-status-label"].map(textStart),
            keylines: { action: line("one-rem-inset"), field: line("field-text-start"), continuation: line("disclosure-label-start") },
            markCenters: [".bf-prose ul > li", ".bf-list-item.is-ticked", ".bf-list-item.is-crossed", ".bf-checkbox-label", ".bf-radio-label"].map(markCenter),
            numberSelect: {
              positionEqual: numberStyle.backgroundPosition === selectStyle.backgroundPosition,
              sizeEqual: numberStyle.backgroundSize === selectStyle.backgroundSize,
              paddingEqual: numberStyle.paddingInlineEnd === selectStyle.paddingInlineEnd
            }
          };
        })()`);
        assert(matrix.action.every(start => Math.abs(start - matrix.keylines.action) < 0.51), `Expected ${tier}/${tone} action copy to share the action inset: ${JSON.stringify(matrix)}.`);
        assert(matrix.field.every(start => Math.abs(start - matrix.keylines.field) < 0.51), `Expected ${tier}/${tone} field copy to share the field inset: ${JSON.stringify(matrix)}.`);
        assert(matrix.continuation.every(start => Math.abs(start - matrix.keylines.continuation) < 0.51), `Expected ${tier}/${tone} disclosure, navigation, notification, and panel copy to share the continuation inset: ${JSON.stringify(matrix)}.`);
        assert(Math.max(...matrix.markCenters) - Math.min(...matrix.markCenters) < 0.51, `Expected ${tier}/${tone} leading marks to share one centre: ${JSON.stringify(matrix.markCenters)}.`);
        assert(matrix.numberSelect.positionEqual && matrix.numberSelect.sizeEqual && matrix.numberSelect.paddingEqual, `Expected ${tier}/${tone} number and select trailing artwork to remain identical: ${JSON.stringify(matrix.numberSelect)}.`);
      }
    }
    const initialTier = await tierSelect.inputValue();
    const nextTier = initialTier === "editorial" ? "documentation" : "editorial";
    await tierSelect.selectOption(nextTier);
    await page.waitForSelector(`body.bf-tier-${nextTier}`);
    await page.waitForTimeout(50);
    const tierKeylines = await keylines.evaluateAll(lines => lines.map(line => ({ authored: (line as HTMLElement).style.left, computed: getComputedStyle(line).left })));
    const tierUpdateCount = Number(await overlay.getAttribute("data-spacing-keyline-update-count"));
    assert(tierUpdateCount > initialUpdateCount && tierKeylines.every(left => left.authored.endsWith("rem") && left.computed.endsWith("px")), "Expected rem-authored spacing keylines to refresh after a tier change.");
    await page.setViewportSize({ width: 1200, height: 720 });
    await page.waitForTimeout(50);
    const resizedKeylines = await keylines.evaluateAll(lines => lines.map(line => ({ authored: (line as HTMLElement).style.left, computed: getComputedStyle(line).left })));
    const resizedUpdateCount = Number(await overlay.getAttribute("data-spacing-keyline-update-count"));
    assert(resizedUpdateCount > tierUpdateCount && resizedKeylines.every(left => left.authored.endsWith("rem") && left.computed.endsWith("px")), "Expected rem-authored spacing keylines to refresh after a viewport resize.");
    const number = page.locator('input[type="number"]').first();
    const select = page.locator("select").first();
    const box = await number.boundingBox();
    assert(box, "Expected the horizontal spacing audit to expose a measurable numeric field.");
    const [numberGeometry, selectGeometry] = await Promise.all([
      number.evaluate(element => {
        const style = getComputedStyle(element);
        return {
          appearance: style.appearance,
          backgroundImage: style.backgroundImage,
          backgroundPosition: style.backgroundPosition,
          backgroundSize: style.backgroundSize,
          paddingInlineEnd: style.paddingInlineEnd
        };
      }),
      select.evaluate(element => {
        const style = getComputedStyle(element);
        return {
          backgroundPosition: style.backgroundPosition,
          backgroundSize: style.backgroundSize,
          overflow: style.overflow,
          paddingInlineEnd: style.paddingInlineEnd,
          textOverflow: style.textOverflow,
          whiteSpace: style.whiteSpace
        };
      })
    ]);
    assert(numberGeometry.appearance === "textfield", "Expected the number field to remove the duplicate browser spin slot.");
    assert(numberGeometry.backgroundImage.includes("svg+xml"), "Expected the number field to paint one paired-chevron asset.");
    assert(numberGeometry.backgroundPosition === selectGeometry.backgroundPosition, "Expected number and select chevrons to share the same trailing position.");
    assert(numberGeometry.backgroundSize === selectGeometry.backgroundSize, "Expected number and select chevrons to share the same 16px canvas.");
    assert(numberGeometry.paddingInlineEnd === selectGeometry.paddingInlineEnd, "Expected number and select to reserve the same trailing canvas space.");
    assert(["hidden", "clip"].includes(selectGeometry.overflow) && selectGeometry.textOverflow === "ellipsis" && selectGeometry.whiteSpace === "nowrap", `Expected constrained selects to truncate before their trailing chevron; got ${JSON.stringify(selectGeometry)}.`);
    const enlargedGeometry = await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
      window.dispatchEvent(new Event("resize"));
      const numberField = document.querySelector<HTMLInputElement>('input[type="number"]');
      const selectField = document.querySelector<HTMLSelectElement>("select");
      const radioLabel = document.querySelector<HTMLElement>(".bf-radio-label");
      const red = document.querySelector<HTMLElement>("[data-spacing-keyline='one-rem-inset']");
      const pageElement = document.querySelector<HTMLElement>("main.bf-page");
      if (!numberField || !selectField || !radioLabel || !red || !pageElement) throw new Error("Missing enlarged-root spacing specimen.");
      const rootSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
      const radioOuter = getComputedStyle(radioLabel, "::before");
      const radioDot = getComputedStyle(radioLabel, "::after");
      const numberStyle = getComputedStyle(numberField);
      const selectStyle = getComputedStyle(selectField);
      return {
        rootSize,
        borderWidth: Number.parseFloat(radioOuter.borderInlineStartWidth),
        lineWidth: Number.parseFloat(getComputedStyle(red).width),
        lineAuthoredWidth: red.style.width,
        lineAuthoredLeft: red.style.left,
        redStart: red.getBoundingClientRect().left,
        expectedRedStart: pageElement.getBoundingClientRect().left + Number.parseFloat(getComputedStyle(pageElement).paddingInlineStart) + rootSize,
        radioOuterWidth: Number.parseFloat(radioOuter.width),
        radioDotWidth: Number.parseFloat(radioDot.width),
        radioOuterLeft: Number.parseFloat(radioOuter.left),
        radioDotLeft: Number.parseFloat(radioDot.left),
        numberCanvas: numberStyle.backgroundSize,
        selectCanvas: selectStyle.backgroundSize,
        chromePresent: Boolean(document.querySelector(".pc-nav") && document.querySelector(".pc-header") && document.querySelector(".pc-footer"))
      };
    });
    assert(Math.abs(enlargedGeometry.rootSize - 32) < 0.01, `Expected the enlarged-root audit to resolve to twice the default root size; got ${enlargedGeometry.rootSize}.`);
    assert(Math.abs(enlargedGeometry.borderWidth - 2) < 0.01 && Math.abs(enlargedGeometry.lineWidth - 2) < 0.01, `Expected borders and overlay keylines to scale together from their 0.0625rem source length; got ${JSON.stringify(enlargedGeometry)}.`);
    assert(enlargedGeometry.lineAuthoredWidth === "0.0625rem" && enlargedGeometry.lineAuthoredLeft.endsWith("rem"), "Expected the enlarged overlay to retain rem-authored width and position values.");
    assert(Math.abs(enlargedGeometry.redStart - enlargedGeometry.expectedRedStart) < 0.51, "Expected the red audit keyline to retain its literal one-rem inset after root enlargement.");
    const enlargedRadioCenterShift = (enlargedGeometry.radioOuterLeft + (enlargedGeometry.radioOuterWidth / 2)) - (enlargedGeometry.radioDotLeft + (enlargedGeometry.radioDotWidth / 2));
    assert(Math.abs(enlargedGeometry.radioDotWidth - ((enlargedGeometry.radioOuterWidth * 0.375) + enlargedGeometry.borderWidth)) < 0.02 && Math.abs(enlargedRadioCenterShift) < 0.02, `Expected the radio inner-dot growth to scale by the rem-based border unit while remaining concentric; got ${JSON.stringify(enlargedGeometry)}.`);
    assert(enlargedGeometry.numberCanvas === enlargedGeometry.selectCanvas && enlargedGeometry.numberCanvas === "32px 32px", "Expected number and select chevron canvases to scale together at the enlarged root size.");
    assert(enlargedGeometry.chromePresent, "Expected shared page chrome to remain present after root enlargement.");
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "";
      window.dispatchEvent(new Event("resize"));
    });
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Emulation.setPageScaleFactor", { pageScaleFactor: 1.25 });
    const zoomGeometry = await page.evaluate(() => {
      const fieldLine = document.querySelector<HTMLElement>("[data-spacing-keyline='field-text-start']");
      const continuationLine = document.querySelector<HTMLElement>("[data-spacing-keyline='disclosure-label-start']");
      const field = document.querySelector<HTMLElement>(".bf-status-label");
      const continuation = document.querySelector<HTMLElement>(".bf-panel-content p");
      if (!fieldLine || !continuationLine || !field || !continuation) throw new Error("Missing zoom keylines or specimens.");
      const fieldRange = document.createRange();
      fieldRange.selectNodeContents(field);
      const continuationRange = document.createRange();
      continuationRange.selectNodeContents(continuation);
      return {
        continuationDelta: Math.abs(continuationRange.getBoundingClientRect().left - continuationLine.getBoundingClientRect().left),
        fieldDelta: Math.abs(fieldRange.getBoundingClientRect().left - fieldLine.getBoundingClientRect().left),
        scale: window.visualViewport?.scale ?? 1
      };
    });
    assert(Math.abs(zoomGeometry.scale - 1.25) < 0.01 && zoomGeometry.fieldDelta < 0.51 && zoomGeometry.continuationDelta < 0.51, `Expected inset alignment to survive a non-100% Chromium page scale; got ${JSON.stringify(zoomGeometry)}.`);
    await cdp.send("Emulation.setPageScaleFactor", { pageScaleFactor: 1 });
    const originalValue = await number.inputValue();
    await number.focus();
    await number.press("ArrowUp");
    assert(await number.inputValue() === String(Number(originalValue) + 1), "Expected the numeric field to retain native keyboard increment behaviour.");
    await number.press("ArrowDown");
    assert(await number.inputValue() === originalValue, "Expected the numeric field to retain native keyboard decrement behaviour.");
    await page.goto(`${origin}/demo/spec/spacing-vertical.html`, {
      waitUntil: "networkidle"
    });
    await waitForFonts(page);
    const verticalTierSelect = page.getByLabel("Tier", { exact: true });
    for (const tier of ["editorial", "documentation", "app", "os"] as const) {
      await verticalTierSelect.selectOption(tier);
      await page.waitForSelector(`body.bf-tier-${tier}`);
      const occupiedBlockGeometry = await page.evaluate(() => {
        const families: Record<string, Array<{ label: string; height: number; textTop: number | null; width: number }>> = {};
        const familyGeometry: Record<string, { top: number; bottom: number; height: number; headingHeight: number; scrollHeight: number }> = {};
        for (const headingId of ["vertical-controls", "vertical-text-runs", "vertical-nested-contexts"]) {
          const section = document.getElementById(headingId)?.closest("section");
          if (!section) throw new Error(`Missing vertical audit family: ${headingId}.`);
          const sectionRect = section.getBoundingClientRect();
          const headingRect = document.getElementById(headingId)?.getBoundingClientRect();
          const scrollRect = section.querySelector<HTMLElement>(".spacing-block-scroll")?.getBoundingClientRect();
          familyGeometry[headingId] = {
            top: sectionRect.top,
            bottom: sectionRect.bottom,
            height: sectionRect.height,
            headingHeight: headingRect?.height ?? 0,
            scrollHeight: scrollRect?.height ?? 0
          };
          families[headingId] = Array.from(section.querySelectorAll<HTMLElement>(".spacing-block-sample")).map(sample => {
            const probe = sample.querySelector<HTMLElement>(".spacing-block-probe");
            const range = document.createRange();
            if (probe) range.selectNodeContents(probe);
            const textFragments = probe
              ? Array.from(range.getClientRects()).filter(rect => rect.width > 0 && rect.height > 0)
              : [];
            return {
              label: sample.getAttribute("aria-label") ?? "unlabelled",
              height: probe?.getBoundingClientRect().height ?? 0,
              textTop: textFragments[1]?.top ?? null,
              width: sample.getBoundingClientRect().width
            };
          });
        }
        const scrollRows = Array.from(document.querySelectorAll<HTMLElement>(".spacing-block-scroll"));
        const firstProbe = document.querySelector<HTMLElement>(".spacing-block-probe");
        const before = firstProbe ? getComputedStyle(firstProbe, "::before") : null;
        const after = firstProbe ? getComputedStyle(firstProbe, "::after") : null;
        const statusLabel = document.querySelector<HTMLElement>(".bf-status-label");
        const statusStyles = statusLabel ? getComputedStyle(statusLabel) : null;
        const rootSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
        const rejectedDate = document.createElement("input");
        rejectedDate.className = "bf-input is-nested";
        rejectedDate.type = "date";
        rejectedDate.style.cssText = "position:absolute;visibility:hidden";
        const rejectedLinkButton = document.createElement("button");
        rejectedLinkButton.className = "bf-button is-link is-nested";
        rejectedLinkButton.textContent = "Rejected link button";
        rejectedLinkButton.style.cssText = "position:absolute;visibility:hidden";
        document.body.append(rejectedDate, rejectedLinkButton);
        const allowedNestedInput = document.querySelector<HTMLElement>("[aria-label='Table text input']");
        const allowedNestedButton = document.querySelector<HTMLElement>("[aria-label='Table control row fit comparison'] .bf-button.is-nested");
        const nestedApi = allowedNestedInput && allowedNestedButton ? {
          allowedButtonLine: Number.parseFloat(getComputedStyle(allowedNestedButton).lineHeight),
          allowedButtonMargin: Number.parseFloat(getComputedStyle(allowedNestedButton).marginBlockEnd),
          allowedInputLine: Number.parseFloat(getComputedStyle(allowedNestedInput).lineHeight),
          allowedInputMargin: Number.parseFloat(getComputedStyle(allowedNestedInput).marginBlockEnd),
          rejectedDateLine: Number.parseFloat(getComputedStyle(rejectedDate).lineHeight),
          rejectedDateMargin: Number.parseFloat(getComputedStyle(rejectedDate).marginBlockEnd),
          rejectedLinkLine: Number.parseFloat(getComputedStyle(rejectedLinkButton).lineHeight),
          rejectedLinkMargin: Number.parseFloat(getComputedStyle(rejectedLinkButton).marginBlockEnd)
        } : null;
        rejectedDate.remove();
        rejectedLinkButton.remove();
        return {
          baseline: Number.parseFloat(getComputedStyle(document.body).getPropertyValue("--bf-baseline")) * rootSize,
          borderWidth: Number.parseFloat(getComputedStyle(document.body).getPropertyValue("--bf-border-width")) * rootSize,
          rootSize,
          nestedApi,
          interfaceRows: families["vertical-controls"],
          textRuns: families["vertical-text-runs"],
          nested: families["vertical-nested-contexts"],
          familyGeometry,
          statusPadding: statusStyles ? {
            end: Number.parseFloat(statusStyles.paddingBlockEnd),
            start: Number.parseFloat(statusStyles.paddingBlockStart)
          } : null,
          scrollRows: scrollRows.map(row => {
            const cluster = row.querySelector<HTMLElement>(".bf-cluster.is-dense.is-nowrap");
            const firstProbe = cluster?.querySelector<HTMLElement>(".spacing-block-probe");
            return {
              overflowX: getComputedStyle(row).overflowX,
              clusterPaddingBlock: cluster ? Number.parseFloat(getComputedStyle(cluster).paddingBlock) : null,
              scrollbarBlockSize: Number.parseFloat(getComputedStyle(row, "::-webkit-scrollbar").blockSize),
              renderedScrollbarBlockSize: row.offsetHeight - row.clientHeight,
              overflows: row.scrollWidth > row.clientWidth,
              clusterHeight: cluster?.getBoundingClientRect().height ?? 0,
              scrollHeight: row.getBoundingClientRect().height,
              probeStartDelta: cluster && firstProbe
                ? firstProbe.getBoundingClientRect().top - cluster.getBoundingClientRect().top
                : null
            };
          }),
          startRule: before ? { blockSize: Number.parseFloat(before.blockSize), top: Number.parseFloat(before.top) } : null,
          endRule: after ? { blockSize: Number.parseFloat(after.blockSize), bottom: Number.parseFloat(after.bottom) } : null
        };
      });
      const renderedBorderTolerance = Math.max(occupiedBlockGeometry.borderWidth, 0.51);
      const assertSharedHeight = (name: string, samples: Array<{ height: number }>) => {
        const heights = samples.map(sample => sample.height);
        assert(Math.max(...heights) - Math.min(...heights) <= renderedBorderTolerance, `Expected ${tier} ${name} specimens to share one occupied-block family within one rasterised rem-based border; got ${JSON.stringify(samples)}.`);
      };
      assert(occupiedBlockGeometry.interfaceRows.length === 29, `Expected ${tier} shared interface bucket to contain the reference plus all 28 distinct single-line specimens.`);
      assert(occupiedBlockGeometry.textRuns.length === 8, `Expected ${tier} unboxed-text bucket to contain the reference plus all seven distinct metric roles.`);
      assert(occupiedBlockGeometry.nested.length === 10, `Expected ${tier} nested bucket to contain the reference plus all nine supported host/content combinations.`);
      assert(occupiedBlockGeometry.nestedApi && occupiedBlockGeometry.nestedApi.allowedInputLine === occupiedBlockGeometry.nestedApi.allowedButtonLine && occupiedBlockGeometry.nestedApi.allowedInputMargin === 0 && occupiedBlockGeometry.nestedApi.allowedButtonMargin === 0, `Expected ${tier} allowlisted nested fields and bordered buttons to consume the nested contract: ${JSON.stringify(occupiedBlockGeometry.nestedApi)}.`);
      assert(occupiedBlockGeometry.nestedApi && occupiedBlockGeometry.nestedApi.rejectedDateLine > occupiedBlockGeometry.nestedApi.allowedInputLine && occupiedBlockGeometry.nestedApi.rejectedLinkLine > occupiedBlockGeometry.nestedApi.allowedButtonLine && occupiedBlockGeometry.nestedApi.rejectedDateMargin > 0, `Expected ${tier} date inputs and link buttons to reject the nested API and retain their non-nested line geometry: ${JSON.stringify(occupiedBlockGeometry.nestedApi)}.`);
      const interfaceReference = occupiedBlockGeometry.interfaceRows[0];
      const interfaceComponents = occupiedBlockGeometry.interfaceRows.slice(1);
      assertSharedHeight("single-line interface", interfaceComponents);
      assert(interfaceReference.label === "Baseline reference" && interfaceComponents.every(sample => sample.textTop === null || interfaceReference.textTop === null || Math.abs(sample.textTop - interfaceReference.textTop) < 0.51), `Expected ${tier} single-line interface text to share the five-letter reference baseline; got ${JSON.stringify(occupiedBlockGeometry.interfaceRows)}.`);
      assertSharedHeight("text-run", occupiedBlockGeometry.textRuns);
      const nestedReference = occupiedBlockGeometry.nested[0];
      const nestedHosts = occupiedBlockGeometry.nested.slice(1);
      assertSharedHeight("nested host", nestedHosts);
      const familyReferences = [interfaceReference, occupiedBlockGeometry.textRuns[0], nestedReference];
      const baselinePhase = (position: number) => ((position % occupiedBlockGeometry.baseline) + occupiedBlockGeometry.baseline) % occupiedBlockGeometry.baseline;
      const interfaceReferencePhase = interfaceReference.textTop === null ? null : baselinePhase(interfaceReference.textTop);
      assert(familyReferences.every(sample => sample?.label === "Baseline reference" && sample.textTop !== null) && interfaceReferencePhase !== null && familyReferences.every(sample => {
        const phase = baselinePhase(sample?.textTop ?? 0);
        const delta = Math.abs(phase - interfaceReferencePhase);
        return Math.min(delta, occupiedBlockGeometry.baseline - delta) < 0.51;
      }), `Expected ${tier} five-letter references to retain one page-wide baseline phase; references=${JSON.stringify(familyReferences)}, families=${JSON.stringify(occupiedBlockGeometry.familyGeometry)}, rows=${JSON.stringify(occupiedBlockGeometry.scrollRows)}, baseline=${occupiedBlockGeometry.baseline}.`);
      assert(occupiedBlockGeometry.textRuns.every(sample => sample.textTop === null || occupiedBlockGeometry.textRuns[0]?.textTop === null || Math.abs(sample.textTop - occupiedBlockGeometry.textRuns[0].textTop) < 0.51), `Expected ${tier} unboxed metric text to share the five-letter baseline; got ${JSON.stringify(occupiedBlockGeometry.textRuns)}.`);
      assert(occupiedBlockGeometry.nested.filter(sample => !sample.label.includes("Badge")).every(sample => sample.textTop === null || nestedReference?.textTop === null || Math.abs(sample.textTop - nestedReference.textTop) <= renderedBorderTolerance), `Expected ${tier} nested host text to retain the page baseline while badges remain optically centred; got ${JSON.stringify(occupiedBlockGeometry.nested)}.`);
      const status = occupiedBlockGeometry.interfaceRows.find(sample => sample.label === "Status label");
      assert(status?.height === interfaceComponents[0]?.height, `Expected ${tier} status label to share the control occupied height.`);
      for (const label of ["Chip", "Tab action", "Color input", "Range control"] as const) {
        const specimen = occupiedBlockGeometry.interfaceRows.find(sample => sample.label === label);
        assert(specimen && Math.abs(specimen.height - interfaceComponents[0].height) <= 0.1, `Expected ${tier} ${label} to resolve through the same rendered single-line height as the text control; control=${interfaceComponents[0].height}, specimen=${JSON.stringify(specimen)}.`);
      }
      assert(occupiedBlockGeometry.statusPadding && Math.abs(occupiedBlockGeometry.statusPadding.start - occupiedBlockGeometry.statusPadding.end) < 0.01, `Expected ${tier} status-label paint to be symmetrically padded in the block direction; got ${JSON.stringify(occupiedBlockGeometry.statusPadding)}.`);
      const tableHeight = interfaceComponents.find(sample => sample.label === "Table cell")?.height ?? 0;
      const controlHeight = interfaceComponents[0].height;
      assert(Math.abs(tableHeight - controlHeight) <= renderedBorderTolerance, `Expected ${tier} table cells to target the same single-line height as controls; controls=${controlHeight}, table=${tableHeight}.`);
      assert(nestedHosts.every(sample => Math.abs(sample.height - controlHeight) <= renderedBorderTolerance), `Expected ${tier} real nested hosts to retain the shared single-line height; controls=${controlHeight}, nested=${JSON.stringify(nestedHosts)}.`);
      const allSamples = [...occupiedBlockGeometry.interfaceRows, ...occupiedBlockGeometry.textRuns, ...occupiedBlockGeometry.nested];
      assert(allSamples.every(sample => Math.abs(sample.width - occupiedBlockGeometry.rootSize * 5) < 0.1), `Expected every ${tier} vertical specimen to retain the shared 5rem width; got ${JSON.stringify(allSamples)}.`);
      assert(occupiedBlockGeometry.scrollRows.every(row => row.overflowX === "auto" && row.clusterPaddingBlock === 0 && Math.abs(row.scrollbarBlockSize - (occupiedBlockGeometry.baseline * 2)) < 0.1 && row.probeStartDelta !== null && Math.abs(row.probeStartDelta) < 0.1), `Expected every ${tier} vertical audit bucket to use an unpadded BF cluster and a baseline-snapped scrollbar without displacing its probes; got ${JSON.stringify(occupiedBlockGeometry.scrollRows)}.`);
      assert(occupiedBlockGeometry.startRule && occupiedBlockGeometry.endRule && occupiedBlockGeometry.startRule.top === 0 && occupiedBlockGeometry.endRule.bottom === 0 && occupiedBlockGeometry.startRule.blockSize === occupiedBlockGeometry.borderWidth && occupiedBlockGeometry.endRule.blockSize === occupiedBlockGeometry.borderWidth, `Expected ${tier} red-start and blue-end rules to use the scalable border token at opposing block edges; got ${JSON.stringify(occupiedBlockGeometry)}.`);
    }
    assert(await page.locator("[data-spacing-keyline-debug]").count() === 0 && await page.locator("[data-spacing-keyline]").count() === 0, "Expected the vertical occupied-block audit to avoid the horizontal inset overlay.");
    assert(await page.locator(".pc-nav").count() === 1 && await page.locator(".pc-header").count() === 1 && await page.locator(".spacing-block-scroll").count() === 3, "Expected the vertical audit to retain shared chrome around three horizontal comparison rows.");
    assert(runtimeErrors.length === 0, `Expected the spacing audit runtime console to remain clean; received ${runtimeErrors.join(" | ")}.`);
    await page.goto(`${origin}/demo/components/side-navigation.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const theme of ["is-light", "is-dark"] as const) {
      const primaryNavigationGeometry = await page.evaluate(activeTheme => {
        document.body.classList.remove("is-light", "is-dark");
        document.body.classList.add(activeTheme);
        const aside = document.querySelector<HTMLElement>("#component-side-navigation-aside");
        const tag = aside?.querySelector<HTMLElement>(".bf-top-navigation-logo-tag");
        const title = aside?.querySelector<HTMLElement>(".bf-top-navigation-logo-title");
        const plain = aside?.querySelector<HTMLElement>(".bf-side-navigation-item.is-title > .bf-side-navigation-link");
        const disclosure = aside?.querySelector<HTMLElement>(".bf-side-navigation-accordion-button");
        if (!aside || !tag || !title || !plain || !disclosure) throw new Error("Missing branded primary side-navigation fixture.");
        const plainNode = Array.from(plain.childNodes).find(node => node.textContent?.trim()) ?? plain;
        const disclosureNode = Array.from(disclosure.childNodes).find(node => node.textContent?.trim()) ?? disclosure;
        const plainRange = document.createRange();
        plainRange.selectNodeContents(plainNode);
        const disclosureRange = document.createRange();
        disclosureRange.selectNodeContents(disclosureNode);
        return {
          tagLeft: tag.getBoundingClientRect().left,
          tagBackground: getComputedStyle(tag).backgroundColor,
          title: title.textContent?.trim(),
          plainStart: plainRange.getBoundingClientRect().left,
          disclosureStart: disclosureRange.getBoundingClientRect().left
        };
      }, theme);
      assert(primaryNavigationGeometry.title === "Baseline Foundry" && primaryNavigationGeometry.tagBackground === "rgb(233, 84, 32)", `Expected ${theme} primary navigation to expose the orange tagged Baseline Foundry brand; got ${JSON.stringify(primaryNavigationGeometry)}.`);
      assert(Math.max(primaryNavigationGeometry.tagLeft, primaryNavigationGeometry.plainStart, primaryNavigationGeometry.disclosureStart) - Math.min(primaryNavigationGeometry.tagLeft, primaryNavigationGeometry.plainStart, primaryNavigationGeometry.disclosureStart) < 0.51, `Expected ${theme} brand tag, plain row, and disclosure row to share the continuation inset; got ${JSON.stringify(primaryNavigationGeometry)}.`);
    }
    await page.goto(`${origin}/demo/spec/spacing.html`, { waitUntil: "networkidle" });
    await page.waitForSelector("#spacing-horizontal-panel .spacing-audit-panel-content", { state: "attached" });
    await page.waitForSelector("#spacing-vertical-panel .spacing-audit-panel-content", { state: "attached" });
    const chapterOverlay = page.locator("[data-spacing-keyline-debug]");
    assert(await page.locator(".pc-nav").count() === 1 && await page.locator(".pc-header").count() === 1 && await chapterOverlay.isVisible(), "Expected the spacing overview to retain shared chrome and show the horizontal keylines with the horizontal tab.");
    const chapterPathname = new URL(page.url()).pathname;
    await page.getByRole("tab", { name: "Vertical padding" }).click();
    await page.waitForFunction(() => {
      const panel = document.getElementById("spacing-vertical-panel");
      const overlay = document.querySelector<HTMLElement>("[data-spacing-keyline-debug]");
      return panel?.getAttribute("aria-hidden") === "false" && overlay?.hidden === true;
    });
    assert(await page.locator("#spacing-vertical-panel").getAttribute("aria-hidden") === "false" && !await chapterOverlay.isVisible() && new URL(page.url()).pathname === chapterPathname, "Expected the vertical audit tab to switch in place without navigation or horizontal keylines.");
    await page.close();
  } finally {
    await browser.close();
  }
}

async function verifyPageChromeNavigationScroll(origin: string): Promise<void> {
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1440, height: 720 }
    });
    const storageKey = "bf-demo-page-navigation-scroll-top";
    const targetRoute = "/demo/components/notification.html";

    await page.goto(`${origin}/index.html`, { waitUntil: "networkidle" });
    await page.evaluate(key => sessionStorage.removeItem(key), storageKey);
    const targetLink = page.locator(`.pc-nav a[href='${targetRoute}']`);
    await targetLink.scrollIntoViewIfNeeded();
    const scrollBeforeNavigation = await page.locator(".pc-nav").evaluate(nav => nav.scrollTop);
    assert(scrollBeforeNavigation > 0, "Expected the notification catalog link to require a scrolled navigation position.");

    await Promise.all([
      page.waitForURL(`**${targetRoute}`),
      targetLink.click()
    ]);
    await page.locator(`.pc-nav a[href='${targetRoute}'][aria-current='page']`).waitFor({ state: "visible" });
    await page.waitForTimeout(80);

    const readNavigationState = () => page.evaluate(() => {
      const nav = document.querySelector<HTMLElement>(".pc-nav");
      const active = nav?.querySelector<HTMLElement>(".bf-side-navigation-link[aria-current='page']");
      const brand = nav?.querySelector<HTMLElement>(".bf-panel-header.is-navigation-brand");
      const tag = brand?.querySelector<HTMLElement>(".bf-top-navigation-logo-tag");
      const icon = brand?.querySelector<HTMLImageElement>(".bf-top-navigation-logo-icon");
      const rootLink = nav?.querySelector<HTMLElement>(".bf-side-navigation-link");
      if (!nav || !active || !brand || !tag || !rootLink) return null;
      const navRect = nav.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      const rootRange = document.createRange();
      rootRange.selectNodeContents(rootLink);
      return {
        activeVisible: activeRect.top >= navRect.top && activeRect.bottom <= navRect.bottom,
        brandTop: brand.getBoundingClientRect().top,
        iconLoaded: Boolean(icon?.complete && icon.naturalWidth > 0),
        insetDelta: Math.abs(tag.getBoundingClientRect().left - rootRange.getBoundingClientRect().left),
        scrollTop: nav.scrollTop
      };
    });

    const navigatedState = await readNavigationState();
    assert(navigatedState?.activeVisible && navigatedState.scrollTop > 0 && navigatedState.brandTop === 0 && navigatedState.iconLoaded && navigatedState.insetDelta <= 0.1, `Expected page navigation to preserve its scrolled position, sticky loaded brand, and shared tag/text continuation inset: ${JSON.stringify(navigatedState)}.`);

    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(80);
    const reloadedState = await readNavigationState();
    assert(reloadedState?.activeVisible && reloadedState.brandTop === 0 && reloadedState.iconLoaded && reloadedState.insetDelta <= 0.1 && Math.abs(reloadedState.scrollTop - navigatedState.scrollTop) <= 1, `Expected page navigation scroll and sticky tagged brand to survive reload; before=${JSON.stringify(navigatedState)}, after=${JSON.stringify(reloadedState)}.`);

    await page.evaluate(key => sessionStorage.removeItem(key), storageKey);
    await page.goto(`${origin}/demo/components/data-spotlight.html`, { waitUntil: "networkidle" });
    await page.waitForTimeout(80);
    const directState = await readNavigationState();
    assert(directState?.activeVisible && directState.scrollTop > 0, "Expected a direct deep demo route to scroll its active catalog entry into view without stored state.");
  } finally {
    await browser.close();
  }
}

async function verifyPageChromeHierarchyAndKeylines(origin: string): Promise<void> {
  const tiers = ["editorial", "documentation", "app", "os"] as const;
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1440, height: 720 }
    });

    await page.goto(`${origin}/examples/grid/app-panels.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const chrome = await page.evaluate(() => {
      const bodyStyles = getComputedStyle(document.body);
      const breadcrumbs = Array.from(document.querySelectorAll<HTMLElement>(".pc-breadcrumbs .bf-breadcrumbs-item"));
      const sequence = Array.from(document.querySelectorAll<HTMLElement>("a.pc-sequence-link"));
      const footer = document.querySelector<HTMLElement>(".pc-footer");
      const header = document.querySelector<HTMLElement>(".pc-header");
      const bar = document.querySelector<HTMLElement>(".pc-bar");
      const brandTitle = document.querySelector<HTMLElement>(".pc-nav .bf-top-navigation-logo-title");
      const currentCrumb = document.querySelector<HTMLElement>(".pc-breadcrumbs [aria-current='page']");
      const brandRange = document.createRange();
      if (brandTitle) brandRange.selectNodeContents(brandTitle);
      const brandRect = brandTitle ? brandRange.getBoundingClientRect() : null;
      const crumbRange = document.createRange();
      if (currentCrumb) crumbRange.selectNodeContents(currentCrumb);
      const crumbRect = currentCrumb ? crumbRange.getBoundingClientRect() : null;
      return {
        bodyFontSize: bodyStyles.fontSize,
        bodyLineHeight: bodyStyles.lineHeight,
        brandBlockSize: brandTitle?.getBoundingClientRect().height ?? null,
        brandText: brandRect ? { top: brandRect.top, bottom: brandRect.bottom } : null,
        crumbText: crumbRect ? { top: crumbRect.top, bottom: crumbRect.bottom } : null,
        headerHeight: header?.getBoundingClientRect().height ?? null,
        barHeight: bar?.getBoundingClientRect().height ?? null,
        breadcrumbType: breadcrumbs.map(item => ({
          fontSize: getComputedStyle(item).fontSize,
          lineHeight: getComputedStyle(item).lineHeight
        })),
        footerBottomDelta: footer ? window.innerHeight - footer.getBoundingClientRect().bottom : null,
        footerHeight: footer?.getBoundingClientRect().height ?? null,
        reservedFooterSpace: Number.parseFloat(bodyStyles.paddingBlockEnd),
        sequence: sequence.map(link => ({
          accessibleName: link.getAttribute("aria-label"),
          background: getComputedStyle(link).backgroundColor,
          color: getComputedStyle(link).color,
          iconImage: getComputedStyle(link.querySelector(".bf-icon") as Element).backgroundImage,
          canonicalBase: link.classList.contains("is-base") && link.classList.contains("is-icon"),
          decoration: getComputedStyle(link).textDecorationLine,
          iconCount: link.querySelectorAll(".bf-icon").length,
          nestedTheme: Boolean(link.closest(".pc-sequence")?.classList.contains("bf-theme")),
          text: link.textContent?.trim() ?? ""
        }))
      };
    });
    assert(chrome.breadcrumbType.length === 2 && chrome.breadcrumbType.every(type => type.fontSize === chrome.bodyFontSize && type.lineHeight === chrome.bodyLineHeight), `Expected page-chrome breadcrumbs to use body typography: ${JSON.stringify(chrome)}.`);
    assert(chrome.sequence.length === 2 && chrome.sequence.every(link => link.accessibleName && link.iconCount === 1 && link.text === "" && link.canonicalBase && !link.nestedTheme && link.background === "rgba(0, 0, 0, 0)" && link.color === "rgb(0, 0, 0)" && link.iconImage.includes("stroke='%23000'") && link.decoration === "none"), `Expected canonical light-tone base/icon link-buttons to inherit the page tone and expose accessible names: ${JSON.stringify(chrome.sequence)}.`);
    assert(chrome.brandText && chrome.crumbText && Math.abs(chrome.brandText.top - chrome.crumbText.top) <= 0.1 && Math.abs(chrome.brandText.bottom - chrome.crumbText.bottom) <= 0.1, `Expected the tagged brand title and breadcrumb to share one fixed header text line: ${JSON.stringify(chrome)}.`);
    assert(chrome.brandBlockSize !== null && chrome.headerHeight !== null && chrome.barHeight !== null && Math.abs(chrome.headerHeight - chrome.brandBlockSize) <= 0.1 && Math.abs(chrome.barHeight - chrome.brandBlockSize) <= 0.1, `Expected the header rule to paint in-box while the bar occupies exactly the derived tagged-brand block: ${JSON.stringify(chrome)}.`);
    assert(chrome.footerBottomDelta !== null && Math.abs(chrome.footerBottomDelta) <= 0.1 && chrome.footerHeight !== null && Math.abs(chrome.reservedFooterSpace - chrome.footerHeight) <= 0.1, `Expected fixed bottom controls to reserve their measured height: ${JSON.stringify(chrome)}.`);

    const toneControl = page.locator("label:has([data-page-chrome-tone-toggle])");
    await toneControl.click();
    const darkSequence = await page.locator("a.pc-sequence-link").evaluateAll(links => links.map(link => ({
      color: getComputedStyle(link).color,
      iconImage: getComputedStyle(link.querySelector(".bf-icon") as Element).backgroundImage
    })));
    assert(darkSequence.length === 2 && darkSequence.every(link => link.color === "rgb(255, 255, 255)" && link.iconImage.includes("stroke='%23fff'")), `Expected adjacent-page buttons to update with the live dark page tone: ${JSON.stringify(darkSequence)}.`);
    await toneControl.click();

    const nextLink = page.locator("a.pc-sequence-link.is-next");
    await nextLink.hover();
    assert(await nextLink.evaluate(link => getComputedStyle(link).textDecorationLine === "none"), "Expected the element-qualified adjacent-page anchor state to remain non-underlined on hover.");

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(50);
    const finalClearance = await page.evaluate(() => {
      const footer = document.querySelector<HTMLElement>(".pc-footer");
      const content = document.querySelector<HTMLElement>(".pc-content, main");
      return footer && content ? footer.getBoundingClientRect().top - content.getBoundingClientRect().bottom : null;
    });
    assert(finalClearance !== null && finalClearance >= -1, `Expected reserved bottom-bar space to keep final page content visible; clearance=${finalClearance}.`);

    await page.goto(`${origin}/demo/spec/typographic-specimen.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tier of tiers) {
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
      const geometry = await page.evaluate(() => {
        const breadcrumb = document.querySelector<HTMLElement>(".pc-breadcrumbs");
        const fixed = Array.from(document.querySelectorAll<HTMLElement>("main .bf-fixed-width"));
        const host = document.querySelector<HTMLElement>("main section");
        const navigation = document.querySelector<HTMLElement>(".pc-nav .bf-side-navigation");
        const navigationGroups = Array.from(document.querySelectorAll<HTMLElement>(".pc-nav .bf-side-navigation-group"));
        const firstHeader = navigationGroups[0]?.querySelector<HTMLElement>(":scope > .bf-side-navigation-group-header");
        const firstHeading = navigationGroups[0]?.querySelector<HTMLElement>(".bf-side-navigation-heading");
        const firstList = navigationGroups[0]?.querySelector<HTMLElement>(":scope > .bf-side-navigation-list");
        const firstLink = navigationGroups[0]?.querySelector<HTMLElement>(".bf-side-navigation-link");
        const secondHeader = navigationGroups[1]?.querySelector<HTMLElement>(":scope > .bf-side-navigation-group-header");
        const secondRule = secondHeader?.querySelector<HTMLElement>(":scope > hr");
        if (!breadcrumb || fixed.length === 0 || !host || !navigation || !firstHeader || !firstHeading || !firstList || !firstLink || !secondHeader || !secondRule) return null;

        const plain = document.createElement("hr");
        host.append(plain);
        const plainStyles = getComputedStyle(plain);
        const rules = {
          plain: {
            background: plainStyles.backgroundColor,
            blockSize: plainStyles.blockSize,
            border: plainStyles.border,
            marginBlockEnd: plainStyles.marginBlockEnd
          }
        };
        plain.remove();

        const navigationRect = navigation.getBoundingClientRect();
        const firstHeaderRect = firstHeader.getBoundingClientRect();
        const headingRect = firstHeading.getBoundingClientRect();
        const firstListRect = firstList.getBoundingClientRect();
        const firstGroupRect = navigationGroups[0].getBoundingClientRect();
        const secondGroupRect = navigationGroups[1].getBoundingClientRect();
        const secondRuleRect = secondRule.getBoundingClientRect();
        const secondRuleStyles = getComputedStyle(secondRule);
        const baseline = Number.parseFloat(getComputedStyle(navigation).getPropertyValue("--bf-baseline")) * Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
        const navigationItems = Array.from(navigation.querySelectorAll<HTMLElement>(".bf-side-navigation-list > .bf-side-navigation-item"));
        const linkRange = document.createRange();
        linkRange.selectNodeContents(firstLink);
        const continuationProbe = document.createElement("span");
        continuationProbe.style.cssText = "display:block;inline-size:var(--bf-component-inline-inset-continuation);position:absolute;visibility:hidden";
        navigation.append(continuationProbe);
        const continuationInset = continuationProbe.getBoundingClientRect().width;
        continuationProbe.remove();

        return {
          breadcrumbX: breadcrumb.getBoundingClientRect().left,
          fixed: fixed.map(region => ({
            paddingInlineStart: Number.parseFloat(getComputedStyle(region).paddingInlineStart),
            x: region.getBoundingClientRect().left
          })),
          rules,
          navigation: {
            continuationInset,
            groupGap: secondGroupRect.top - firstGroupRect.bottom,
            groupGapTarget: Number.parseFloat(getComputedStyle(document.documentElement).fontSize) * 1.5,
            headingListGap: firstListRect.top - firstHeaderRect.bottom,
            headingListGapTarget: Number.parseFloat(getComputedStyle(document.documentElement).fontSize) * 0.5,
            headingTextInset: headingRect.left + Number.parseFloat(getComputedStyle(firstHeading).paddingInlineStart) - navigationRect.left,
            linkTextInset: linkRange.getBoundingClientRect().left - navigationRect.left,
            ruleInset: secondRuleRect.left - navigationRect.left,
            ruleEndSpread: navigationRect.right - secondRuleRect.right,
            ruleOccupiedBlock: secondRuleRect.height + Number.parseFloat(secondRuleStyles.marginBlockEnd),
            ruleOccupiedBlockTarget: Number.parseFloat(getComputedStyle(document.documentElement).fontSize) * 0.5,
            baseline,
            groupTops: navigationGroups.map(group => group.getBoundingClientRect().top),
            itemTracks: navigationItems.map(item => {
              const rect = item.getBoundingClientRect();
              return { top: rect.top, height: rect.height };
            }),
            headerGaps: navigationGroups.map(group => Number.parseFloat(getComputedStyle(group.querySelector<HTMLElement>(":scope > .bf-side-navigation-group-header")!).rowGap)),
            rulesPerGroup: navigationGroups.map((group, index) => ({ index, count: group.querySelectorAll(":scope > .bf-side-navigation-group-header > hr").length }))
          }
        };
      });
      assert(geometry && geometry.fixed.every(region => region.paddingInlineStart === 0), `Expected ${tier} specimen fixed-width regions to avoid a second gutter: ${JSON.stringify(geometry)}.`);
      if (tier === "editorial" || tier === "documentation") {
        assert(geometry.fixed.every(region => Math.abs(region.x - geometry.breadcrumbX) <= 1), `Expected uncapped ${tier} specimen regions to share the page keyline: ${JSON.stringify(geometry)}.`);
      }
      assert(geometry.rules.plain.blockSize === "1px" && geometry.rules.plain.marginBlockEnd !== "0px", `Expected ${tier} bare semantic hr to carry the generic rule geometry and trailing compensation: ${JSON.stringify(geometry.rules)}.`);
      assert(Math.abs(geometry.navigation.headingTextInset - geometry.navigation.continuationInset) <= 0.1 && Math.abs(geometry.navigation.linkTextInset - geometry.navigation.continuationInset) <= 0.1, `Expected ${tier} page-navigation headings and plain commands to land on the continuation inset: ${JSON.stringify(geometry.navigation)}.`);
      assert(Math.abs(geometry.navigation.groupGap - geometry.navigation.groupGapTarget) <= 0.1, `Expected ${tier} page-navigation heading/list groups to be separated by 1.5rem: ${JSON.stringify(geometry.navigation)}.`);
      assert(Math.abs(geometry.navigation.headingListGap - geometry.navigation.headingListGapTarget) <= 0.1, `Expected ${tier} page-navigation group headers to keep a 0.5rem transition to their lists: ${JSON.stringify(geometry.navigation)}.`);
      assert(geometry.navigation.headerGaps.every(gap => gap === 0), `Expected ${tier} page-navigation rules and headings to remain a tight zero-gap header unit: ${JSON.stringify(geometry.navigation)}.`);
      assert(Math.abs(geometry.navigation.ruleInset - geometry.navigation.continuationInset) <= 0.1 && Math.abs(geometry.navigation.ruleEndSpread) <= 0.1, `Expected ${tier} page-navigation rules to start on the continuation text inset and reach the navigation end edge: ${JSON.stringify(geometry.navigation)}.`);
      assert(Math.abs(geometry.navigation.ruleOccupiedBlock - geometry.navigation.ruleOccupiedBlockTarget) <= 0.1, `Expected ${tier} page-navigation rules to preserve the compensated half-rem occupied block: ${JSON.stringify(geometry.navigation)}.`);
      const phaseDistance = (a: number, b: number, baseline: number) => {
        const delta = Math.abs((((a - b) % baseline) + baseline) % baseline);
        return Math.min(delta, baseline - delta);
      };
      const navigationPhaseTolerance = 0.25;
      assert(geometry.navigation.itemTracks.every(item => phaseDistance(item.height, 0, geometry.navigation.baseline) <= navigationPhaseTolerance) && geometry.navigation.itemTracks.every(item => phaseDistance(item.top, geometry.navigation.itemTracks[0].top, geometry.navigation.baseline) <= navigationPhaseTolerance), `Expected ${tier} side-navigation item tracks to absorb rasterised border remainder and preserve one repeated baseline phase: ${JSON.stringify(geometry.navigation)}.`);
      assert(geometry.navigation.groupTops.every(top => phaseDistance(top, geometry.navigation.groupTops[0], geometry.navigation.baseline) <= navigationPhaseTolerance), `Expected ${tier} compensated rules and group spacing not to shift later side-navigation groups off phase: ${JSON.stringify(geometry.navigation)}.`);
      assert(geometry.navigation.rulesPerGroup.every(group => group.count === (group.index === 0 ? 0 : 1)), `Expected ${tier} page-navigation groups after the first to begin with exactly one real rule: ${JSON.stringify(geometry.navigation.rulesPerGroup)}.`);
    }

    await page.close();
  } finally {
    await browser.close();
  }
}

async function verifyExamplePreferencesBeforePaint(origin: string): Promise<void> {
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1440, height: 900 }
    });

    await page.goto(`${origin}/index.html`, { waitUntil: "networkidle" });
    await page.evaluate(() => {
      localStorage.setItem("baseline-foundry:living-spec-tier", "app");
      localStorage.setItem("baseline-foundry:living-spec-tone", "dark");
    });

    await page.route("**/demo/example-page.js", route => route.abort());
    await page.goto(`${origin}/examples/grid/breakpoints.html`, { waitUntil: "load" });

    const preRuntimeState = await page.evaluate(() => ({
      background: getComputedStyle(document.body).backgroundColor,
      colorScheme: document.documentElement.style.colorScheme,
      firstElementIsInitializer: document.body.firstElementChild?.getAttribute("src") === "../../demo/example-page-init.js",
      ready: document.body.dataset.examplePreferencesReady,
      tier: document.body.dataset.bfTier,
      tone: document.body.classList.contains("is-dark") ? "dark" : "light"
    }));

    assert(preRuntimeState.firstElementIsInitializer, "Expected the synchronous example preference initializer to be the first body element.");
    assert(preRuntimeState.ready === "true", "Expected example preferences to be resolved before the deferred page runtime.");
    assert(preRuntimeState.tier === "app" && preRuntimeState.tone === "dark", `Expected saved app/dark preferences before runtime; got ${preRuntimeState.tier}/${preRuntimeState.tone}.`);
    assert(preRuntimeState.colorScheme === "dark" && preRuntimeState.background === "rgb(32, 32, 32)", `Expected the first styled example state to use the saved dark App surface; got ${preRuntimeState.colorScheme}/${preRuntimeState.background}.`);
  } finally {
    await browser.close();
  }
}

async function verifyExampleMainClearsPageNavigation(origin: string): Promise<void> {
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1440, height: 900 }
    });

    await page.goto(`${origin}/examples/grid/app-panels.html`, { waitUntil: "networkidle" });
    const geometry = await page.evaluate(() => {
      const nav = document.querySelector<HTMLElement>(".pc-nav");
      const main = document.querySelector<HTMLElement>("main[data-example-grid-target]");
      const heading = main?.querySelector<HTMLElement>("h1");
      if (!nav || !main || !heading) {
        return null;
      }

      const navRect = nav.getBoundingClientRect();
      const mainRect = main.getBoundingClientRect();
      const headingRect = heading.getBoundingClientRect();
      return {
        headingVisible: headingRect.width > 0 && headingRect.height > 0,
        mainStartsAfterNavigation: mainRect.left >= navRect.right - 1,
        mainWidth: mainRect.width,
        navRight: navRect.right
      };
    });

    assert(geometry?.headingVisible, "Expected App panels to render visible main-area content.");
    assert(geometry.mainStartsAfterNavigation && geometry.mainWidth > 600, `Expected App panels main content to clear the fixed navigation; nav right=${geometry.navRight}, main width=${geometry.mainWidth}.`);
  } finally {
    await browser.close();
  }
}

async function verifyPinnedAsideResize(origin: string): Promise<void> {
  const storageKey = "demo:application-shell-aside";
  const route = "/demo/components/application-shell.html";
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1800, height: 1200 }
    });

    await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
    await waitForFonts(page);
  await disableDemoChromeHitTesting(page);
    await page.evaluate(key => localStorage.removeItem(key), storageKey);
    await page.reload({ waitUntil: "networkidle" });
    await waitForFonts(page);
  await disableDemoChromeHitTesting(page);

    const handle = page.locator(".bf-application-aside-resize-handle");
    const aside = page.locator(".bf-aside.is-pinned");
    const application = page.locator(".bf-application");
    await handle.waitFor({ state: "visible" });
    await aside.waitFor({ state: "visible" });
    await handle.scrollIntoViewIfNeeded();

    const initialWidth = await readAsideWidth(page);
    const ariaValueNow = Number.parseFloat(await handle.getAttribute("aria-valuenow") ?? "");
    assert(Number.isFinite(ariaValueNow), "Expected resize handle to expose aria-valuenow.");
    assert(Math.abs(initialWidth - ariaValueNow) <= 2, `Expected handle aria-valuenow (${ariaValueNow}) to track the current aside width (${initialWidth}).`);

    const handleBox = await handle.boundingBox();
    assert(handleBox, "Expected resize handle to have a measurable bounding box.");

    await page.mouse.move(handleBox.x + (handleBox.width / 2), handleBox.y + (handleBox.height / 2));
    await page.mouse.down();
    await page.mouse.move(handleBox.x - 96, handleBox.y + (handleBox.height / 2), { steps: 12 });
    await page.mouse.up();

    const resizedWidth = await readAsideWidth(page);
    assert(resizedWidth >= initialWidth + 60, `Expected pointer dragging to widen the aside. Initial ${initialWidth}px, resized ${resizedWidth}px.`);
    const isResizingClassApplied = await application.evaluate(element => element.classList.contains("is-resizing-aside"));
    assert(!isResizingClassApplied, "Expected the resizing class to be removed after pointer drag completes.");

    await page.reload({ waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);
    const persistedWidth = await readAsideWidth(page);
    assert(Math.abs(persistedWidth - resizedWidth) <= 2, `Expected resized aside width to persist after reload. Resized ${resizedWidth}px, reloaded ${persistedWidth}px.`);

    const minWidth = Number.parseFloat(await handle.getAttribute("aria-valuemin") ?? "");
    const maxWidth = Number.parseFloat(await handle.getAttribute("aria-valuemax") ?? "");
    assert(Number.isFinite(minWidth) && Number.isFinite(maxWidth), "Expected resize handle to expose aria-valuemin and aria-valuemax.");

    await handle.scrollIntoViewIfNeeded();
    await handle.focus();
    await page.keyboard.press("Home");
    const homeWidth = await readAsideWidth(page);
    assert(Math.abs(homeWidth - minWidth) <= 2, `Expected Home to clamp the aside to its minimum width. Min ${minWidth}px, got ${homeWidth}px.`);

    await handle.scrollIntoViewIfNeeded();
    await handle.focus();
    await page.keyboard.press("End");
    const endWidth = await readAsideWidth(page);
    assert(Math.abs(endWidth - maxWidth) <= 2, `Expected End to clamp the aside to its maximum width. Max ${maxWidth}px, got ${endWidth}px.`);

    await handle.dblclick();
    await page.reload({ waitUntil: "networkidle" });
    await waitForFonts(page);
  await disableDemoChromeHitTesting(page);
    const resetWidth = await readAsideWidth(page);
    assert(Math.abs(resetWidth - initialWidth) <= 2, `Expected double-click reset to restore the default aside width. Default ${initialWidth}px, got ${resetWidth}px.`);
  } finally {
    await browser.close();
  }
}

async function verifyDrawerOverlay(origin: string): Promise<void> {
  const route = "/demo/components/drawer-panel.html";
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1440, height: 900 }
    });

    await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
    await waitForFonts(page);
  await disableDemoChromeHitTesting(page);

    const application = page.locator(".bf-application");
    const drawer = page.locator("#drawer-panel-demo");
    const overlay = page.locator(".bf-application-overlay");
    const toggle = page.locator("[data-panel-drawer-toggle]");

    await application.waitFor({ state: "visible" });
    await drawer.waitFor({ state: "visible" });

    const openGeometry = await page.evaluate(() => {
      const app = document.querySelector(".bf-application");
      const aside = document.querySelector<HTMLElement>("#drawer-panel-demo");
      if (!(app instanceof HTMLElement) || !(aside instanceof HTMLElement)) {
        return null;
      }

      const appRect = app.getBoundingClientRect();
      const asideRect = aside.getBoundingClientRect();
      return {
        appTop: appRect.top,
        appBottom: appRect.bottom,
        appRight: appRect.right,
        asideTop: asideRect.top,
        asideBottom: asideRect.bottom,
        asideRight: asideRect.right,
        asideWidth: asideRect.width,
        asideHeight: asideRect.height
      };
    });

    assert(openGeometry, "Expected drawer geometry to be measurable.");
    assert(openGeometry.asideHeight >= openGeometry.appBottom - openGeometry.appTop - 2, `Expected open drawer to span the application height. App ${openGeometry.appBottom - openGeometry.appTop}px, drawer ${openGeometry.asideHeight}px.`);
    assert(Math.abs(openGeometry.asideTop - openGeometry.appTop) <= 2, `Expected open drawer to attach to the top edge of the application. App top ${openGeometry.appTop}px, drawer top ${openGeometry.asideTop}px.`);
    assert(Math.abs(openGeometry.asideBottom - openGeometry.appBottom) <= 2, `Expected open drawer to attach to the bottom edge of the application. App bottom ${openGeometry.appBottom}px, drawer bottom ${openGeometry.asideBottom}px.`);
    assert(Math.abs(openGeometry.asideRight - openGeometry.appRight) <= 2, `Expected open drawer to attach to the right edge of the application. App right ${openGeometry.appRight}px, drawer right ${openGeometry.asideRight}px.`);
    assert(openGeometry.asideWidth >= 320, `Expected open drawer to have a substantial visible width. Got ${openGeometry.asideWidth}px.`);

    await toggle.click();
    await page.waitForTimeout(220);
    const closedState = await page.evaluate(() => {
      const app = document.querySelector(".bf-application");
      const aside = document.querySelector<HTMLElement>("#drawer-panel-demo");
      const overlayElement = document.querySelector<HTMLElement>(".bf-application-overlay");
      if (!(app instanceof HTMLElement) || !(aside instanceof HTMLElement) || !(overlayElement instanceof HTMLElement)) {
        return null;
      }

      return {
        appOpen: app.classList.contains("is-drawer-expanded"),
        drawerOpen: aside.classList.contains("is-open"),
        ariaHidden: aside.getAttribute("aria-hidden"),
        overlayHidden: overlayElement.getAttribute("aria-hidden")
      };
    });

    assert(closedState, "Expected closed drawer state to be measurable.");
    assert(!closedState.appOpen, "Expected drawer toggle to remove the application open class.");
    assert(!closedState.drawerOpen, "Expected drawer toggle to remove the drawer open class.");
    assert(closedState.ariaHidden === "true", `Expected closed drawer aria-hidden to be true, got ${closedState.ariaHidden}.`);
    assert(closedState.overlayHidden === "true", `Expected closed overlay aria-hidden to be true, got ${closedState.overlayHidden}.`);

    await toggle.click();
    await page.waitForTimeout(220);
    const reopenedState = await page.evaluate(() => {
      const app = document.querySelector(".bf-application");
      const aside = document.querySelector<HTMLElement>("#drawer-panel-demo");
      if (!(app instanceof HTMLElement) || !(aside instanceof HTMLElement)) {
        return null;
      }

      const asideRect = aside.getBoundingClientRect();
      return {
        appOpen: app.classList.contains("is-drawer-expanded"),
        drawerOpen: aside.classList.contains("is-open"),
        ariaHidden: aside.getAttribute("aria-hidden"),
        asideHeight: asideRect.height
      };
    });

    assert(reopenedState, "Expected reopened drawer state to be measurable.");
    assert(reopenedState.appOpen, "Expected drawer toggle to restore the application open class.");
    assert(reopenedState.drawerOpen, "Expected drawer toggle to restore the drawer open class.");
    assert(reopenedState.ariaHidden === "false", `Expected reopened drawer aria-hidden to be false, got ${reopenedState.ariaHidden}.`);
    assert(reopenedState.asideHeight >= 200, `Expected reopened drawer to remain visibly tall. Got ${reopenedState.asideHeight}px.`);

    const overlayBox = await overlay.boundingBox();
    assert(overlayBox, "Expected overlay to expose a measurable bounding box.");
    await page.mouse.click(
      Math.max(overlayBox.x + 24, 240),
      overlayBox.y + (overlayBox.height / 2)
    );
    await page.waitForTimeout(220);
    const overlayCloseState = await page.evaluate(() => {
      const app = document.querySelector(".bf-application");
      const aside = document.querySelector<HTMLElement>("#drawer-panel-demo");
      if (!(app instanceof HTMLElement) || !(aside instanceof HTMLElement)) {
        return null;
      }

      return {
        appOpen: app.classList.contains("is-drawer-expanded"),
        drawerOpen: aside.classList.contains("is-open")
      };
    });

    assert(overlayCloseState, "Expected overlay-close drawer state to be measurable.");
    assert(!overlayCloseState.appOpen && !overlayCloseState.drawerOpen, "Expected clicking the overlay to close the drawer.");
  } finally {
    await browser.close();
  }
}

async function verifyApplicationLayout(origin: string): Promise<void> {
  const route = "/demo/components/application-layout.html";
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1440, height: 960 }
    });

    for (const boundary of [
      { width: 767, persistent: false, label: "below 48rem" },
      { width: 768, persistent: true, label: "at 48rem" }
    ] as const) {
      await page.setViewportSize({ width: boundary.width, height: 960 });
      await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
      const state = await page.evaluate(() => {
        const application = document.querySelector<HTMLElement>(".bf-application");
        const navigation = document.querySelector<HTMLElement>("#application-layout-navigation");
        const drawer = navigation?.querySelector<HTMLElement>(".bf-navigation-drawer");
        const overlay = navigation?.querySelector<HTMLElement>(".bf-navigation-overlay");
        const content = application?.querySelector<HTMLElement>(".bf-main .bf-panel-content");
        if (!application || !navigation || !drawer || !overlay || !content) return null;

        const fixture = document.createElement("div");
        fixture.innerHTML = `
          <section class="bf-basic-section">
            <div class="bf-basic-section-layout">
              <div class="bf-basic-section-header">Header</div>
              <div class="bf-basic-section-content">Content</div>
            </div>
          </section>
          <section class="bf-tiered-list">
            <div class="bf-tiered-list-header">
              <div>Title</div>
              <div>Description</div>
            </div>
          </section>
        `;
        content.append(fixture);
        const basicLayout = fixture.querySelector<HTMLElement>(".bf-basic-section-layout");
        const tieredHeader = fixture.querySelector<HTMLElement>(".bf-tiered-list-header");
        return {
          areas: getComputedStyle(application).gridTemplateAreas,
          basicColumns: basicLayout ? getComputedStyle(basicLayout).gridTemplateColumns.split(/\s+/).filter(Boolean).length : 0,
          drawerHidden: drawer.getAttribute("aria-hidden"),
          drawerPosition: getComputedStyle(drawer).position,
          overlayDisplay: getComputedStyle(overlay).display,
          tieredHeaderColumns: tieredHeader ? getComputedStyle(tieredHeader).gridTemplateColumns.split(/\s+/).filter(Boolean).length : 0
        };
      });
      assert(state, `Expected application navigation state ${boundary.label}.`);
      assert(state.areas.includes('"navigation main') === boundary.persistent, `Expected application navigation persistence to switch ${boundary.label}; got ${JSON.stringify(state)}.`);
      assert(state.drawerHidden === (boundary.persistent ? "false" : "true"), `Expected application navigation accessibility state to switch ${boundary.label}; got ${JSON.stringify(state)}.`);
      assert(state.drawerPosition === (boundary.persistent ? "static" : "fixed"), `Expected application navigation drawer positioning to switch ${boundary.label}; got ${JSON.stringify(state)}.`);
      assert((state.overlayDisplay === "none") === boundary.persistent, `Expected application navigation overlay lifecycle to switch ${boundary.label}; got ${JSON.stringify(state)}.`);
      const expectedColumns = boundary.persistent ? 2 : 1;
      assert(state.basicColumns === expectedColumns, `Expected application basic-section to use ${expectedColumns} column(s) ${boundary.label}; got ${JSON.stringify(state)}.`);
      assert(state.tieredHeaderColumns === expectedColumns, `Expected application tiered-list header to use ${expectedColumns} column(s) ${boundary.label}; got ${JSON.stringify(state)}.`);
    }

    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);

    const viewportFillState = await page.evaluate(() => {
      const application = document.querySelector<HTMLElement>(".bf-application");
      if (!(application instanceof HTMLElement)) {
        return null;
      }

      document.body.classList.remove("bf-tier-app");
      document.body.classList.add("bf-tier-editorial");
      application.removeAttribute("style");
      application.classList.add("is-fill");
      document.body.replaceChildren(application);
      const rect = application.getBoundingClientRect();
      return {
        blockSize: getComputedStyle(application).blockSize,
        gridGapInline: getComputedStyle(application).getPropertyValue("--bf-grid-gap-inline").trim(),
        height: rect.height,
        bottom: rect.bottom
      };
    });

    assert(viewportFillState, "Expected full-viewport application state to be measurable.");
    assert(viewportFillState.blockSize === "960px", `Expected the full-viewport application modifier to resolve against the dynamic viewport. Got block-size=${viewportFillState.blockSize}.`);
    assert(viewportFillState.gridGapInline === "1.5rem", `Expected application gutters to remain 1.5rem under editorial typography. Got --bf-grid-gap-inline=${viewportFillState.gridGapInline}.`);
    assert(Math.abs(viewportFillState.height - 960) <= 1, `Expected the full-viewport application modifier to occupy the viewport height. Got height=${viewportFillState.height}px.`);
    assert(Math.abs(viewportFillState.bottom - 960) <= 1, `Expected the full-viewport application modifier to reach the viewport bottom edge. Got bottom=${viewportFillState.bottom}px.`);

    const panelFooterState = await page.evaluate(async () => {
      const content = document.querySelector<HTMLElement>(".bf-main .bf-panel-content");
      const mainFooter = document.querySelector<HTMLElement>("[data-application-layout-main-footer]");
      if (!content || !mainFooter) return null;

      const pressure = document.createElement("div");
      pressure.style.blockSize = "1200px";
      pressure.style.flex = "0 0 auto";
      pressure.setAttribute("aria-hidden", "true");
      content.append(pressure);

      const beforeTop = mainFooter.getBoundingClientRect().top;
      content.scrollTop = 200;
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

      return {
        beforeTop,
        afterTop: mainFooter.getBoundingClientRect().top,
        mainMinBlockSize: getComputedStyle(mainFooter).minBlockSize,
        mainPaddingBlockStart: getComputedStyle(mainFooter).paddingBlockStart,
        scrollTop: content.scrollTop
      };
    });

    assert(panelFooterState, "Expected both application panel footers to be measurable.");
    assert(panelFooterState.scrollTop > 0, "Expected the main panel content to scroll under pressure.");
    assert(Math.abs(panelFooterState.afterTop - panelFooterState.beforeTop) <= 1, `Expected the main panel footer to stay fixed while panel content scrolls. Got before=${panelFooterState.beforeTop}px, after=${panelFooterState.afterTop}px.`);
    assert(Number.parseFloat(panelFooterState.mainMinBlockSize) > 0, `Expected the main panel footer to expose a minimum block size. Got ${panelFooterState.mainMinBlockSize}.`);
    assert(panelFooterState.mainPaddingBlockStart === "0px", `Expected panel footer content to rely on child control nudges instead of container start padding. Got ${panelFooterState.mainPaddingBlockStart}.`);

    const responsiveBrandState = await page.evaluate(() => {
      const bar = document.querySelector<HTMLElement>(".bf-navigation-bar.is-responsive");
      const compactBrand = bar?.querySelector<HTMLElement>(".bf-top-navigation-logo.is-canonical-tagged");
      const drawerBrand = document.querySelector<HTMLElement>(".bf-navigation-drawer .bf-top-navigation-logo.is-canonical-tagged");
      const tag = compactBrand?.querySelector<HTMLElement>(".bf-top-navigation-logo-tag");
      if (!bar || !compactBrand || !drawerBrand || !tag) {
        return null;
      }

      return {
        barDisplay: getComputedStyle(bar).display,
        compactVisible: compactBrand.checkVisibility(),
        drawerVisible: drawerBrand.checkVisibility(),
        tagHeight: tag.getBoundingClientRect().height,
        tagWidth: tag.getBoundingClientRect().width,
        visibleHomeLinks: Array.from(document.querySelectorAll<HTMLElement>("a[aria-label='MAAS control plane home']"))
          .filter(link => getComputedStyle(link).visibility !== "hidden" && link.getBoundingClientRect().width > 0).length
      };
    });

    assert(responsiveBrandState, "Expected the responsive application brand to be measurable.");
    assert(responsiveBrandState.barDisplay !== "none" && responsiveBrandState.compactVisible && !responsiveBrandState.drawerVisible, `Expected collapsed desktop navigation to expose only its compact brand. Got ${JSON.stringify(responsiveBrandState)}.`);
    assert(responsiveBrandState.visibleHomeLinks === 1, `Expected exactly one visible application-home link while collapsed. Got ${responsiveBrandState.visibleHomeLinks}.`);
    assert(Math.abs(responsiveBrandState.tagWidth - 22) <= 1 && Math.abs(responsiveBrandState.tagHeight - 38) <= 1, `Expected the compact Canonical tag to retain 22x38px geometry. Got ${responsiveBrandState.tagWidth}x${responsiveBrandState.tagHeight}px.`);

    const navigation = page.locator("#application-layout-navigation");
    const menuToggle = page.locator("[data-application-layout-toggle]").first();
    const pinToggle = page.locator("[data-application-layout-pin]");

    await navigation.waitFor({ state: "visible" });
    await menuToggle.waitFor({ state: "visible" });

    const collapsedWidth = await navigation.evaluate(element => element.getBoundingClientRect().width);
    assert(collapsedWidth <= 96, `Expected collapsed application navigation to stay narrow. Got ${collapsedWidth}px.`);

    const collapsedGeometry = await navigation.evaluate(element => {
      const links = Array.from(element.querySelectorAll<HTMLElement>(".bf-side-navigation-list > .bf-side-navigation-item > .bf-side-navigation-link"));
      const referenceBlockSize = links[0]?.getBoundingClientRect().height ?? 0;
      return links.map(link => {
        const linkRect = link.getBoundingClientRect();
        const icon = link.querySelector<HTMLElement>(".bf-side-navigation-icon");
        const iconRect = icon?.getBoundingClientRect();
        return {
          blockSize: linkRect.height,
          referenceBlockSize,
          iconCenterDelta: iconRect ? Math.abs(((iconRect.top + iconRect.bottom) / 2) - ((linkRect.top + linkRect.bottom) / 2)) : null,
          iconTransform: icon ? getComputedStyle(icon).transform : null
        };
      });
    });
    assert(collapsedGeometry.length > 0, "Expected collapsed application navigation rows to be measurable.");
    collapsedGeometry.forEach((row, index) => {
      assert(row.referenceBlockSize > 0 && (row.blockSize === 0 || Math.abs(row.blockSize - row.referenceBlockSize) <= 1), `Expected visible collapsed navigation row ${index + 1} to retain the shared single-line navigation height. Got row=${row.blockSize}px, reference=${row.referenceBlockSize}px.`);
      if (row.iconCenterDelta !== null) {
        assert(row.iconCenterDelta <= 1, `Expected collapsed navigation icon ${index + 1} to remain centred in its compact row. Got delta=${row.iconCenterDelta}px.`);
        assert(row.iconTransform === "none", `Expected collapsed navigation icon ${index + 1} to reset the expanded optical offset. Got transform=${row.iconTransform}.`);
      }
    });
    assert(await page.getByRole("link", { name: "Dashboard", exact: true }).count() === 1, "Expected the visually collapsed Dashboard label to remain the link accessible name.");

    await menuToggle.click({ force: true });
    await page.waitForTimeout(180);

    const expandedState = await page.evaluate(() => {
      const applicationElement = document.querySelector<HTMLElement>(".bf-application");
      const navigationElement = document.querySelector<HTMLElement>("#application-layout-navigation");
      const drawerElement = navigationElement?.querySelector<HTMLElement>(".bf-navigation-drawer");
      const panelElement = drawerElement?.querySelector<HTMLElement>(".bf-panel");
      const toggleElement = document.querySelector<HTMLElement>("[data-application-layout-toggle]");
      const responsiveBar = document.querySelector<HTMLElement>(".bf-navigation-bar.is-responsive");
      if (!(applicationElement instanceof HTMLElement) || !(navigationElement instanceof HTMLElement) ||
          !(drawerElement instanceof HTMLElement) || !(panelElement instanceof HTMLElement) ||
          !(toggleElement instanceof HTMLElement) || !(responsiveBar instanceof HTMLElement)) {
        return null;
      }

      return {
        applicationBottom: applicationElement.getBoundingClientRect().bottom,
        applicationRows: getComputedStyle(applicationElement).gridTemplateRows,
        applicationAreas: getComputedStyle(applicationElement).gridTemplateAreas,
        collapsed: navigationElement.classList.contains("is-collapsed"),
        drawerBlockSize: getComputedStyle(drawerElement).blockSize,
        drawerBottom: drawerElement.getBoundingClientRect().bottom,
        navigationBlockSize: getComputedStyle(navigationElement).blockSize,
        navigationGridArea: getComputedStyle(navigationElement).gridArea,
        navigationBottom: navigationElement.getBoundingClientRect().bottom,
        panelBottom: panelElement.getBoundingClientRect().bottom,
        responsiveBarDisplay: getComputedStyle(responsiveBar).display,
        responsiveBarPosition: getComputedStyle(responsiveBar).position,
        responsiveBarVisibility: getComputedStyle(responsiveBar).visibility,
        visibleHomeLinks: Array.from(document.querySelectorAll<HTMLElement>("a[aria-label='MAAS control plane home']"))
          .filter(link => getComputedStyle(link).visibility !== "hidden" && link.getBoundingClientRect().width > 0).length,
        width: navigationElement.getBoundingClientRect().width,
        expanded: toggleElement.getAttribute("aria-expanded")
      };
    });

    assert(expandedState, "Expected expanded application layout state to be measurable.");
    assert(!expandedState.collapsed, "Expected application navigation toggle to expand the navigation.");
    assert(expandedState.width >= 220, `Expected expanded application navigation to be visibly wide. Got ${expandedState.width}px.`);
    assert(expandedState.expanded === "true", `Expected application navigation toggle to expose aria-expanded=true, got ${expandedState.expanded}.`);
    assert(expandedState.responsiveBarDisplay !== "none" && expandedState.responsiveBarPosition === "absolute" && expandedState.responsiveBarVisibility === "hidden" && expandedState.visibleHomeLinks === 1, `Expected wide expanded navigation to collapse the compact bar out of layout and expose exactly one drawer brand. Got ${JSON.stringify(expandedState)}.`);
    assert(Math.abs(expandedState.drawerBottom - expandedState.navigationBottom) <= 1, `Expected desktop navigation drawer to reach the navigation bottom. Got drawer=${expandedState.drawerBottom}px, navigation=${expandedState.navigationBottom}px.`);
    assert(Math.abs(expandedState.panelBottom - expandedState.navigationBottom) <= 1, `Expected desktop navigation panel to reach the navigation bottom. Got panel=${expandedState.panelBottom}px, navigation=${expandedState.navigationBottom}px.`);
    assert(Math.abs(expandedState.navigationBottom - expandedState.applicationBottom) <= 1, `Expected desktop navigation to reach the application bottom. Got ${JSON.stringify(expandedState)}.`);

    const alignedFooterState = await page.evaluate(() => {
      const mainFooter = document.querySelector<HTMLElement>("[data-application-layout-main-footer]");
      const navigationFooter = document.querySelector<HTMLElement>("[data-application-layout-navigation-footer]");
      const navigationList = document.querySelector<HTMLElement>('[data-baseline-label="application layout nav list one"]');
      if (!mainFooter || !navigationFooter || !navigationList) return null;
      const mainFooterStyles = getComputedStyle(mainFooter);
      const navigationFooterStyles = getComputedStyle(navigationFooter);
      const navigationListStyles = getComputedStyle(navigationList);
      return {
        mainBottom: mainFooter.getBoundingClientRect().bottom,
        navigationBottom: navigationFooter.getBoundingClientRect().bottom,
        mainMinBlockSize: mainFooterStyles.minBlockSize,
        mainPaddingBlockStart: mainFooterStyles.paddingBlockStart,
        navigationMinBlockSize: navigationFooterStyles.minBlockSize,
        navigationPaddingBlockStart: navigationFooterStyles.paddingBlockStart,
        navigationListMarginBottom: navigationListStyles.marginBottom,
        navigationListPaddingBottom: navigationListStyles.paddingBottom
      };
    });
    assert(alignedFooterState, "Expected expanded navigation and main panel footers to be measurable.");
    assert(Math.abs(alignedFooterState.mainBottom - alignedFooterState.navigationBottom) <= 1, `Expected navigation and main panel footers to share the bottom edge. Got main=${alignedFooterState.mainBottom}px, navigation=${alignedFooterState.navigationBottom}px.`);
    assert(alignedFooterState.mainMinBlockSize === alignedFooterState.navigationMinBlockSize, `Expected both panel footers to share the same minimum block size. Got main=${alignedFooterState.mainMinBlockSize}, navigation=${alignedFooterState.navigationMinBlockSize}.`);
    assert(alignedFooterState.mainPaddingBlockStart === "0px" && alignedFooterState.navigationPaddingBlockStart === "0px", `Expected both panel footers to remove container start padding. Got main=${alignedFooterState.mainPaddingBlockStart}, navigation=${alignedFooterState.navigationPaddingBlockStart}.`);
    assert(alignedFooterState.navigationListPaddingBottom === "0px", `Expected side-navigation list groups to remove block-end padding. Got ${alignedFooterState.navigationListPaddingBottom}.`);
    assert(alignedFooterState.navigationListMarginBottom === "0px", `Expected side-navigation list groups not to add block-end margin. Got ${alignedFooterState.navigationListMarginBottom}.`);

    const navigationBrandState = await page.evaluate(() => {
      const header = document.querySelector<HTMLElement>("[data-navigation-brand-header]");
      const panel = header?.closest<HTMLElement>(".bf-panel");
      const logo = header?.querySelector<HTMLElement>(".bf-top-navigation-logo.is-canonical-tagged");
      const tag = header?.querySelector<HTMLElement>(".bf-top-navigation-logo-tag");
      const title = header?.querySelector<HTMLElement>(".bf-top-navigation-logo-title");
      if (!header || !panel || !logo || !tag || !title) return null;
      const headerRect = header.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      const logoRect = logo.getBoundingClientRect();
      const tagRect = tag.getBoundingClientRect();
      const headerStyles = getComputedStyle(header);
      return {
        headerLeft: headerRect.left,
        headerTop: headerRect.top,
        logoWidth: logoRect.width,
        panelWidth: panelRect.width,
        panelLeft: panelRect.left,
        panelTop: panelRect.top,
        paddingBlockStart: headerStyles.paddingBlockStart,
        paddingInlineStart: headerStyles.paddingInlineStart,
        tagHeight: tagRect.height,
        tagLeft: tagRect.left,
        tagTop: tagRect.top,
        tagWidth: tagRect.width,
        titleTransform: getComputedStyle(title).transform,
        titleVisible: title.getBoundingClientRect().width > 0
      };
    });

    assert(navigationBrandState, "Expected the application navigation brand to be measurable.");
    assert(navigationBrandState.paddingBlockStart === "0px" && Number.parseFloat(navigationBrandState.paddingInlineStart) > 0, `Expected the navigation-brand header to remove block padding and retain the panel inline inset. Got block=${navigationBrandState.paddingBlockStart}, inline=${navigationBrandState.paddingInlineStart}.`);
    assert(Math.abs(navigationBrandState.headerTop - navigationBrandState.panelTop) <= 1 && Math.abs(navigationBrandState.tagTop - navigationBrandState.panelTop) <= 1, `Expected the Canonical tag to meet the panel's top edge. Got panel=${navigationBrandState.panelTop}px, header=${navigationBrandState.headerTop}px, tag=${navigationBrandState.tagTop}px.`);
    assert(Math.abs(navigationBrandState.headerLeft - navigationBrandState.panelLeft) <= 1 && Math.abs((navigationBrandState.tagLeft - navigationBrandState.panelLeft) - Number.parseFloat(navigationBrandState.paddingInlineStart)) <= 1, `Expected the Canonical tag to share the panel content inset. Got panel=${navigationBrandState.panelLeft}px, tag=${navigationBrandState.tagLeft}px, inset=${navigationBrandState.paddingInlineStart}.`);
    assert(Math.abs(navigationBrandState.tagWidth - 22) <= 1 && Math.abs(navigationBrandState.tagHeight - 38) <= 1, `Expected the Canonical tag to retain 22x38px geometry. Got ${navigationBrandState.tagWidth}x${navigationBrandState.tagHeight}px.`);
    assert(navigationBrandState.titleTransform === "none", `Expected the navigation-brand title to use the fixed brand-line centre without a second optical transform. Got ${navigationBrandState.titleTransform}.`);
    assert(Math.abs(navigationBrandState.logoWidth - (navigationBrandState.panelWidth - Number.parseFloat(navigationBrandState.paddingInlineStart))) <= 1.5 && navigationBrandState.titleVisible, `Expected the drawer brand and title to occupy the panel width after its live grid-gutter inset. Got ${JSON.stringify(navigationBrandState)}.`);

    const wrappedAlignmentState = await page.evaluate(() => {
      const link = document.querySelector<HTMLElement>("[data-wrapped-navigation-link]");
      const icon = link?.querySelector<HTMLElement>(".bf-side-navigation-icon");
      const label = link?.querySelector<HTMLElement>(".bf-side-navigation-label");
      if (!link || !icon || !label) return null;

      const labelRange = document.createRange();
      labelRange.selectNodeContents(label);
      const lineRects = Array.from(labelRange.getClientRects()).filter(rect => rect.width > 0 && rect.height > 0);
      const iconRect = icon.getBoundingClientRect();

      return {
        alignItems: getComputedStyle(link).alignItems,
        iconBottom: iconRect.bottom,
        iconCenter: (iconRect.top + iconRect.bottom) / 2,
        iconTop: iconRect.top,
        transform: getComputedStyle(icon).transform,
        lines: lineRects.map(rect => ({ bottom: rect.bottom, top: rect.top }))
      };
    });

    assert(wrappedAlignmentState, "Expected the wrapped icon-navigation fixture to be measurable.");
    assert(wrappedAlignmentState.lines.length >= 2, `Expected the icon-navigation pressure label to wrap. Got ${wrappedAlignmentState.lines.length} line(s).`);
    assert(wrappedAlignmentState.alignItems === "baseline", `Expected expanded icon-navigation rows to use baseline alignment. Got ${wrappedAlignmentState.alignItems}.`);
    const firstLine = wrappedAlignmentState.lines[0];
    const secondLine = wrappedAlignmentState.lines[1];
    assert(wrappedAlignmentState.transform === "matrix(1, 0, 0, 1, 0, 3)", `Expected expanded icon-navigation to consume the 3px optical transform. Got ${wrappedAlignmentState.transform}.`);
    assert(wrappedAlignmentState.iconCenter >= firstLine.top - 1 && wrappedAlignmentState.iconCenter <= firstLine.bottom + 1, `Expected the navigation icon center to occupy the first label line. Got iconCenter=${wrappedAlignmentState.iconCenter}px, firstLine=${firstLine.top}-${firstLine.bottom}px.`);
    assert(wrappedAlignmentState.iconBottom <= secondLine.top + 1, `Expected the navigation icon to stay above the second label line. Got iconBottom=${wrappedAlignmentState.iconBottom}px, secondLineTop=${secondLine.top}px.`);

    const navigationCompositionState = await page.evaluate(() => {
      const content = document.querySelector<HTMLElement>("[data-flush-navigation-content]");
      const activeLink = content?.querySelector<HTMLElement>(".bf-side-navigation-link[aria-current='page']");
      const topLevelLink = content?.querySelector<HTMLElement>(".bf-side-navigation-list > .bf-side-navigation-item > .bf-side-navigation-link");
      const activeLabel = activeLink?.querySelector<HTMLElement>(".bf-side-navigation-label");
      const iconLink = content?.querySelector<HTMLElement>(".bf-side-navigation-list > .bf-side-navigation-item > .bf-side-navigation-link");
      const iconLabel = iconLink?.querySelector<HTMLElement>(".bf-side-navigation-label");
      const icon = iconLink?.querySelector<HTMLElement>(".bf-side-navigation-icon");
      const heading = content?.querySelector<HTMLElement>("[data-icon-navigation-heading]");
      const defaultContent = document.querySelector<HTMLElement>(".bf-main .bf-panel-content");
      if (!content || !activeLink || !topLevelLink || !activeLabel || !iconLink || !iconLabel || !icon || !heading || !defaultContent) {
        return null;
      }

      const baselineProbe = document.createElement("span");
      baselineProbe.style.cssText = "display:block;position:absolute;inline-size:var(--bf-baseline);block-size:0;visibility:hidden";
      content.append(baselineProbe);

      const contentRect = content.getBoundingClientRect();
      const activeRect = activeLink.getBoundingClientRect();
      const activeLabelRect = activeLabel.getBoundingClientRect();
      const contentStyles = getComputedStyle(content);
      const activeStyles = getComputedStyle(activeLink);
      const topLevelStyles = getComputedStyle(topLevelLink);
      const defaultContentStyles = getComputedStyle(defaultContent);
      const baselinePx = baselineProbe.getBoundingClientRect().width;
      baselineProbe.remove();

      return {
        activeBackground: activeStyles.backgroundColor,
        activeBoxShadow: activeStyles.boxShadow,
        activeLeft: activeRect.left,
        activeRight: activeRect.right,
        contentLeft: contentRect.left,
        contentRight: contentRect.right,
        contentPaddingBlockEnd: contentStyles.paddingBlockEnd,
        contentPaddingBlockStart: contentStyles.paddingBlockStart,
        contentPaddingInlineEnd: contentStyles.paddingInlineEnd,
        contentPaddingInlineStart: contentStyles.paddingInlineStart,
        defaultPaddingInlineStart: defaultContentStyles.paddingInlineStart,
        headingTextInset: heading.getBoundingClientRect().left + Number.parseFloat(getComputedStyle(heading).paddingInlineStart) - contentRect.left,
        iconGap: iconLabel.getBoundingClientRect().left - icon.getBoundingClientRect().right,
        iconLabelInset: iconLabel.getBoundingClientRect().left - contentRect.left,
        labelInset: activeLabelRect.left - contentRect.left,
        nestedPaddingInlineStart: Number.parseFloat(activeStyles.paddingInlineStart),
        topLevelPaddingInlineStart: Number.parseFloat(topLevelStyles.paddingInlineStart),
        baselinePx
      };
    });

    assert(navigationCompositionState, "Expected flush side-navigation composition to be measurable.");
    assert(navigationCompositionState.contentPaddingBlockStart === "0px" && navigationCompositionState.contentPaddingBlockEnd === "0px", `Expected flush navigation content to remove block padding. Got ${navigationCompositionState.contentPaddingBlockStart}/${navigationCompositionState.contentPaddingBlockEnd}.`);
    assert(navigationCompositionState.contentPaddingInlineStart === "0px" && navigationCompositionState.contentPaddingInlineEnd === "0px", `Expected flush navigation content to remove inline padding. Got ${navigationCompositionState.contentPaddingInlineStart}/${navigationCompositionState.contentPaddingInlineEnd}.`);
    assert(Math.abs(navigationCompositionState.activeLeft - navigationCompositionState.contentLeft) <= 1, `Expected active navigation background to reach the content start edge. Got active=${navigationCompositionState.activeLeft}, content=${navigationCompositionState.contentLeft}.`);
    assert(Math.abs(navigationCompositionState.activeRight - navigationCompositionState.contentRight) <= 1, `Expected active navigation background to reach the content end edge. Got active=${navigationCompositionState.activeRight}, content=${navigationCompositionState.contentRight}.`);
    assert(navigationCompositionState.activeBackground !== "rgba(0, 0, 0, 0)", `Expected active navigation row to retain a visible background. Got ${navigationCompositionState.activeBackground}.`);
    assert(navigationCompositionState.activeBoxShadow !== "none", "Expected active navigation row to retain its inset edge highlight.");
    assert(navigationCompositionState.labelInset > 0, `Expected active navigation label to retain component-owned indentation. Got ${navigationCompositionState.labelInset}px.`);
    assert(Math.abs(navigationCompositionState.iconGap - 10) <= 1, `Expected icon-navigation labels to use the shared 10px gap. Got ${navigationCompositionState.iconGap}px.`);
    assert(Math.abs(navigationCompositionState.headingTextInset - navigationCompositionState.iconLabelInset) <= 1, `Expected icon-navigation headings and labels to share an inline start. Got heading=${navigationCompositionState.headingTextInset}px, label=${navigationCompositionState.iconLabelInset}px.`);
    assert(Math.abs((navigationCompositionState.nestedPaddingInlineStart - navigationCompositionState.topLevelPaddingInlineStart) - (navigationCompositionState.baselinePx * 2)) <= 1, `Expected nested navigation padding to add two baseline units. Got nested=${navigationCompositionState.nestedPaddingInlineStart}px, top-level=${navigationCompositionState.topLevelPaddingInlineStart}px, baseline=${navigationCompositionState.baselinePx}px.`);
    assert(Number.parseFloat(navigationCompositionState.defaultPaddingInlineStart) > 0, `Expected ordinary panel content to remain padded. Got ${navigationCompositionState.defaultPaddingInlineStart}.`);

    await pinToggle.evaluate(element => {
      if (element instanceof HTMLElement) {
        element.click();
      }
    });
    await page.waitForTimeout(120);

    const pinnedState = await page.evaluate(() => {
      const navigationElement = document.querySelector<HTMLElement>("#application-layout-navigation");
      const pinElement = document.querySelector<HTMLElement>("[data-application-layout-pin]");
      if (!(navigationElement instanceof HTMLElement) || !(pinElement instanceof HTMLElement)) {
        return null;
      }

      return {
        pinned: navigationElement.classList.contains("is-pinned"),
        pressed: pinElement.getAttribute("aria-pressed")
      };
    });

    assert(pinnedState, "Expected pinned application layout state to be measurable.");
    assert(pinnedState.pinned, "Expected pin control to apply the pinned navigation state.");
    assert(pinnedState.pressed === "true", `Expected pin control aria-pressed=true after toggling, got ${pinnedState.pressed}.`);

    const mobilePage = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 767, height: 960 }
    });

    await mobilePage.goto(`${origin}${route}`, { waitUntil: "networkidle" });
    await waitForFonts(mobilePage);
    await disableDemoChromeHitTesting(mobilePage);

    const mobileToggle = mobilePage.locator("[data-application-layout-toggle]").first();
    const mobileCollapsedBrandState = await mobilePage.evaluate(() => {
      const compactBrand = document.querySelector<HTMLElement>(".bf-navigation-bar.is-responsive .bf-top-navigation-logo");
      const drawerBrand = document.querySelector<HTMLElement>(".bf-navigation-drawer .bf-top-navigation-logo");
      const application = document.querySelector<HTMLElement>(".bf-application");
      const bar = document.querySelector<HTMLElement>(".bf-navigation-bar.is-responsive");
      const compactRect = compactBrand?.getBoundingClientRect();
      const drawerRect = drawerBrand?.getBoundingClientRect();
      const drawer = drawerBrand?.closest<HTMLElement>(".bf-navigation-drawer");
      return {
        barAtApplicationStart: Boolean(application && bar && Math.abs(bar.getBoundingClientRect().top - application.getBoundingClientRect().top) <= 1),
        compactVisible: Boolean(compactBrand && compactRect && getComputedStyle(compactBrand).visibility === "visible" && compactRect.width > 0 && compactRect.right > 0 && compactRect.left < innerWidth),
        drawerVisible: Boolean(drawerBrand && drawerRect && drawer && getComputedStyle(drawerBrand).visibility === "visible" && getComputedStyle(drawer).visibility === "visible" && drawerRect.width > 0 && drawerRect.right > 0 && drawerRect.left < innerWidth),
        visibleHomeLinks: Array.from(document.querySelectorAll<HTMLElement>("a[aria-label='MAAS control plane home']"))
          .filter(link => {
            const rect = link.getBoundingClientRect();
            const ownerDrawer = link.closest<HTMLElement>(".bf-navigation-drawer");
            return getComputedStyle(link).visibility === "visible" && (!ownerDrawer || getComputedStyle(ownerDrawer).visibility === "visible") && rect.width > 0 && rect.right > 0 && rect.left < innerWidth;
          }).length
      };
    });
    assert(mobileCollapsedBrandState.barAtApplicationStart && mobileCollapsedBrandState.compactVisible && !mobileCollapsedBrandState.drawerVisible && mobileCollapsedBrandState.visibleHomeLinks === 1, `Expected narrow collapsed navigation to expose one compact brand in the application-start row. Got ${JSON.stringify(mobileCollapsedBrandState)}.`);
    await mobileToggle.click({ force: true });
    await mobilePage.waitForTimeout(180);

    const mobileOpenState = await mobilePage.evaluate(() => {
      const navigationElement = document.querySelector<HTMLElement>("#application-layout-navigation");
      const overlayElement = document.querySelector<HTMLElement>(".bf-navigation-overlay");
      const drawerElement = document.querySelector<HTMLElement>(".bf-navigation-drawer");
      const responsiveBar = document.querySelector<HTMLElement>(".bf-navigation-bar.is-responsive");
      const compactBrand = responsiveBar?.querySelector<HTMLElement>(".bf-top-navigation-logo");
      const drawerBrand = drawerElement?.querySelector<HTMLElement>(".bf-top-navigation-logo");
      if (!(navigationElement instanceof HTMLElement) || !(overlayElement instanceof HTMLElement) || !(drawerElement instanceof HTMLElement) ||
          !(responsiveBar instanceof HTMLElement) || !(compactBrand instanceof HTMLElement) || !(drawerBrand instanceof HTMLElement)) {
        return null;
      }
      const compactRect = compactBrand.getBoundingClientRect();
      const drawerBrandRect = drawerBrand.getBoundingClientRect();

      return {
        collapsed: navigationElement.classList.contains("is-collapsed"),
        overlayHidden: overlayElement.getAttribute("aria-hidden"),
        drawerHidden: drawerElement.getAttribute("aria-hidden"),
        drawerLeft: drawerElement.getBoundingClientRect().left,
        responsiveBarDisplay: getComputedStyle(responsiveBar).display,
        compactBrandVisible: getComputedStyle(compactBrand).visibility === "visible" && compactRect.width > 0 && compactRect.right > 0 && compactRect.left < innerWidth,
        drawerBrandVisible: getComputedStyle(drawerBrand).visibility === "visible" && getComputedStyle(drawerElement).visibility === "visible" && drawerBrandRect.width > 0 && drawerBrandRect.right > 0 && drawerBrandRect.left < innerWidth,
        visibleHomeLinks: Array.from(document.querySelectorAll<HTMLElement>("a[aria-label='MAAS control plane home']"))
          .filter(link => {
            const rect = link.getBoundingClientRect();
            const ownerDrawer = link.closest<HTMLElement>(".bf-navigation-drawer");
            return getComputedStyle(link).visibility === "visible" && (!ownerDrawer || getComputedStyle(ownerDrawer).visibility === "visible") && rect.width > 0 && rect.right > 0 && rect.left < innerWidth;
          }).length
      };
    });

    assert(mobileOpenState, "Expected mobile application layout state to be measurable.");
    assert(!mobileOpenState.collapsed, "Expected mobile application layout toggle to open the drawer.");
    assert(mobileOpenState.overlayHidden === "false", `Expected mobile navigation overlay to be visible, got aria-hidden=${mobileOpenState.overlayHidden}.`);
    assert(mobileOpenState.drawerHidden === "false", `Expected mobile navigation drawer to be visible, got aria-hidden=${mobileOpenState.drawerHidden}.`);
    assert(mobileOpenState.drawerLeft >= -2, `Expected mobile navigation drawer to be aligned to the viewport edge, got left=${mobileOpenState.drawerLeft}.`);
    assert(mobileOpenState.responsiveBarDisplay !== "none" && !mobileOpenState.compactBrandVisible && mobileOpenState.drawerBrandVisible && mobileOpenState.visibleHomeLinks === 1, `Expected narrow expanded navigation to retain its bar controls while exposing only the drawer brand. Got ${JSON.stringify(mobileOpenState)}.`);

    await mobilePage.keyboard.press("Escape");
    await mobilePage.waitForTimeout(180);

    const mobileClosedState = await mobilePage.evaluate(() => {
      const navigationElement = document.querySelector<HTMLElement>("#application-layout-navigation");
      const overlayElement = document.querySelector<HTMLElement>(".bf-navigation-overlay");
      const compactBrand = document.querySelector<HTMLElement>(".bf-navigation-bar.is-responsive .bf-top-navigation-logo");
      const drawerBrand = document.querySelector<HTMLElement>(".bf-navigation-drawer .bf-top-navigation-logo");
      if (!(navigationElement instanceof HTMLElement) || !(overlayElement instanceof HTMLElement) || !compactBrand || !drawerBrand) {
        return null;
      }
      const compactRect = compactBrand.getBoundingClientRect();
      const drawerBrandRect = drawerBrand.getBoundingClientRect();
      const drawer = drawerBrand.closest<HTMLElement>(".bf-navigation-drawer");

      return {
        collapsed: navigationElement.classList.contains("is-collapsed"),
        overlayHidden: overlayElement.getAttribute("aria-hidden"),
        compactBrandVisible: getComputedStyle(compactBrand).visibility === "visible" && compactRect.width > 0 && compactRect.right > 0 && compactRect.left < innerWidth,
        drawerBrandVisible: Boolean(drawer && getComputedStyle(drawerBrand).visibility === "visible" && getComputedStyle(drawer).visibility === "visible" && drawerBrandRect.width > 0 && drawerBrandRect.right > 0 && drawerBrandRect.left < innerWidth),
        visibleHomeLinks: Array.from(document.querySelectorAll<HTMLElement>("a[aria-label='MAAS control plane home']"))
          .filter(link => {
            const rect = link.getBoundingClientRect();
            const ownerDrawer = link.closest<HTMLElement>(".bf-navigation-drawer");
            return getComputedStyle(link).visibility === "visible" && (!ownerDrawer || getComputedStyle(ownerDrawer).visibility === "visible") && rect.width > 0 && rect.right > 0 && rect.left < innerWidth;
          }).length
      };
    });

    assert(mobileClosedState, "Expected mobile closed application layout state to be measurable.");
    assert(mobileClosedState.collapsed, "Expected Escape to collapse the mobile navigation drawer.");
    assert(mobileClosedState.overlayHidden === "true", `Expected mobile navigation overlay to hide after Escape, got aria-hidden=${mobileClosedState.overlayHidden}.`);
    assert(mobileClosedState.compactBrandVisible && !mobileClosedState.drawerBrandVisible && mobileClosedState.visibleHomeLinks === 1, `Expected Escape to restore exactly one compact application brand. Got ${JSON.stringify(mobileClosedState)}.`);

    await mobilePage.close();
  } finally {
    await browser.close();
  }
}

async function verifyTopNavigation(origin: string): Promise<void> {
  const route = "/demo/components/top-navigation.html";
  const browser = await openBrowser();

  try {
    const desktopPage = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1440, height: 960 }
    });

    await desktopPage.goto(`${origin}${route}`, { waitUntil: "networkidle" });
    await waitForFonts(desktopPage);
    await disableDemoChromeHitTesting(desktopPage);

    /* The shared demo shell now contributes the public page gutter. At 1280px
       the specimen's allocated content width is below the desktop navigation
       contract even though the outer viewport has crossed the media query. */
    for (const width of [1440, 2560]) {
      await desktopPage.setViewportSize({ width, height: 960 });

      for (const tier of ["editorial", "documentation", "app", "os"] as const) {
        await desktopPage.locator("[data-page-chrome-tier-select]").selectOption(tier);
        await desktopPage.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
        const taggedGeometry = await desktopPage.evaluate(() => {
        const navigation = document.querySelector<HTMLElement>("#top-navigation-default");
        const row = navigation?.querySelector<HTMLElement>(".bf-top-navigation-row");
        const banner = navigation?.querySelector<HTMLElement>(".bf-top-navigation-banner");
        const primaryNavigation = navigation?.querySelector<HTMLElement>(".bf-top-navigation-nav");
        const contentGrid = document.querySelector<HTMLElement>("[data-baseline-label='top navigation content grid']");
        const active = navigation?.querySelector<HTMLElement>(".bf-top-navigation-item.is-selected > .bf-top-navigation-link");
        const logoLink = navigation?.querySelector<HTMLElement>(".bf-top-navigation-logo.is-canonical-tagged > .bf-top-navigation-link");
        const tag = navigation?.querySelector<HTMLElement>(".bf-top-navigation-logo-tag");
        const icon = navigation?.querySelector<SVGSVGElement>(".bf-top-navigation-logo-icon");
        const title = navigation?.querySelector<HTMLElement>(".bf-top-navigation-logo-title");
        if (!navigation || !row || !banner || !primaryNavigation || !contentGrid || !active || !logoLink || !tag || !icon || !title) return null;

        const navigationRect = navigation.getBoundingClientRect();
        const rowRect = row.getBoundingClientRect();
        const bannerRect = banner.getBoundingClientRect();
        const primaryNavigationRect = primaryNavigation.getBoundingClientRect();
        const contentGridRect = contentGrid.getBoundingClientRect();
        const activeRect = active.getBoundingClientRect();
        const tagRect = tag.getBoundingClientRect();
        const iconRect = icon.getBoundingClientRect();
        const titleRect = title.getBoundingClientRect();
        const rowStyles = getComputedStyle(row);
        const contentGridStyles = getComputedStyle(contentGrid);
        const tagStyles = getComputedStyle(tag);
        const iconStyles = getComputedStyle(icon);
        const titleStyles = getComputedStyle(title);
        const viewBox = icon.viewBox.baseVal;
        const graphicBox = icon.getBBox();
        const graphicScale = iconRect.width / viewBox.width;
        const titleFirstLineCentre = titleRect.top
          + Number.parseFloat(titleStyles.paddingBlockStart)
          + (Number.parseFloat(titleStyles.lineHeight) / 2);
        const iconCentre = iconRect.top + (iconRect.height / 2);
        const tagCentre = tagRect.top + (tagRect.height / 2);
        const graphicInlineCentre = iconRect.left
          + ((graphicBox.x + (graphicBox.width / 2) - viewBox.x) * graphicScale);
        const contentGutter = Number.parseFloat(contentGridStyles.columnGap);
        const contentTrack = (contentGridRect.width - (contentGutter * 7)) / 8;
        return {
          tier: document.body.dataset.bfTier,
          barThicknessToken: getComputedStyle(navigation).getPropertyValue("--bf-bar-thickness").trim(),
          activeShadow: getComputedStyle(active).boxShadow,
          rowLeft: rowRect.left,
          rowWidth: rowRect.width,
          contentGridLeft: contentGridRect.left,
          contentGridWidth: contentGridRect.width,
          bannerLeft: bannerRect.left,
          bannerWidth: bannerRect.width,
          primaryNavigationLeft: primaryNavigationRect.left,
          thirdContentColumnStart: contentGridRect.left + (2 * (contentTrack + contentGutter)),
          navigationBottom: navigationRect.bottom,
          rowBottom: rowRect.bottom,
          activeBottom: activeRect.bottom,
          rowPaddingStart: Number.parseFloat(rowStyles.paddingBlockStart),
          rowPaddingEnd: Number.parseFloat(rowStyles.paddingBlockEnd),
          tagTopOffset: tagRect.top - navigationRect.top,
          tagWidth: tagRect.width,
          tagHeight: tagRect.height,
          tagAspect: tagRect.height / tagRect.width,
          tagRowEndResidual: rowRect.bottom - tagRect.bottom,
          tagBackground: tagStyles.backgroundColor,
          logoDisplay: getComputedStyle(logoLink).display,
          iconWidth: iconRect.width,
          iconHeight: iconRect.height,
          iconAspect: iconRect.width / iconRect.height,
          sourceAspect: viewBox.width / viewBox.height,
          iconBottomInset: tagRect.bottom - iconRect.bottom,
          iconTagCentreDelta: iconCentre - tagCentre,
          iconTitleFirstLineCentreDelta: Math.abs(iconCentre - titleFirstLineCentre),
          graphicInlineCentreDelta: Math.abs(graphicInlineCentre - (tagRect.left + (tagRect.width / 2))),
          iconOpticalOffsetInline: new DOMMatrixReadOnly(iconStyles.transform).m41
        };
        });
        assert(taggedGeometry, `Expected tagged top-navigation geometry for ${tier} at ${width}px.`);
        assert(taggedGeometry.tier === tier, `Expected tagged top-navigation fixture to use ${tier}, got ${taggedGeometry.tier}.`);
        assert(taggedGeometry.barThicknessToken === "0.1875rem", `Expected ${tier} to expose the shared 0.1875rem emphasis bar, got ${taggedGeometry.barThicknessToken}.`);
        assert(taggedGeometry.activeShadow.includes("-3px"), `Expected ${tier} desktop top-navigation highlight to resolve to 3px, got ${taggedGeometry.activeShadow}.`);
        assert(Math.abs(taggedGeometry.rowLeft - taggedGeometry.contentGridLeft) <= 0.1 && Math.abs(taggedGeometry.rowWidth - taggedGeometry.contentGridWidth) <= 0.1, `Expected ${tier} navigation and content grids to share bounds at ${width}px.`);
        assert(Math.abs(taggedGeometry.bannerLeft - taggedGeometry.contentGridLeft) <= 0.1, `Expected ${tier} banner to begin at content column one at ${width}px.`);
        assert(Math.abs(taggedGeometry.primaryNavigationLeft - taggedGeometry.thirdContentColumnStart) <= 0.1, `Expected ${tier} primary navigation to begin at content column three at ${width}px; nav=${taggedGeometry.primaryNavigationLeft}, column=${taggedGeometry.thirdContentColumnStart}.`);
        assert(taggedGeometry.bannerWidth > 0 && taggedGeometry.primaryNavigationLeft > taggedGeometry.bannerLeft + taggedGeometry.bannerWidth, `Expected ${tier} banner to occupy the first two tracks before the navigation gutter at ${width}px.`);
        assert(taggedGeometry.rowPaddingStart === 0 && taggedGeometry.rowPaddingEnd === 0, `Expected ${tier} top-navigation row to have zero block padding.`);
        assert(Math.abs(taggedGeometry.navigationBottom - taggedGeometry.rowBottom) <= 0.1, `Expected ${tier} navigation and row bottom edges to coincide.`);
        assert(Math.abs(taggedGeometry.rowBottom - taggedGeometry.activeBottom) <= 0.1, `Expected ${tier} active navigation highlight to meet the row boundary.`);
        assert(Math.abs(taggedGeometry.tagTopOffset) <= 0.1, `Expected ${tier} tagged brand block to attach to the navigation top edge.`);
        assert(taggedGeometry.tagBackground === "rgb(233, 84, 32)", `Expected ${tier} tagged brand block to use Ubuntu orange, got ${taggedGeometry.tagBackground}.`);
        assert(taggedGeometry.logoDisplay === "flex", `Expected ${tier} tagged logo to preserve the text-relative flex composition.`);
        assert(Math.abs(taggedGeometry.tagWidth - 22) <= 0.1 && Math.abs(taggedGeometry.tagHeight - 38) <= 0.1, `Expected ${tier} tagged brand block to remain 22px by 38px, got ${taggedGeometry.tagWidth}px by ${taggedGeometry.tagHeight}px.`);
        assert(Math.abs(taggedGeometry.tagAspect - (38 / 22)) <= 0.01, `Expected ${tier} tagged brand block to preserve the 38:22 aspect, got ${taggedGeometry.tagAspect}.`);
        assert(Math.abs(taggedGeometry.tagRowEndResidual - 10) <= 0.1, `Expected ${tier} tag to stop 10px before the occupied row boundary, got ${taggedGeometry.tagRowEndResidual}px.`);
        assert(Math.abs(taggedGeometry.iconWidth - 16) <= 0.1 && Math.abs(taggedGeometry.iconHeight - 16) <= 0.1 && Math.abs(taggedGeometry.iconAspect - 1) <= 0.01, `Expected ${tier} Circle of Friends to use a 16px square icon box, got ${taggedGeometry.iconWidth}px by ${taggedGeometry.iconHeight}px.`);
        assert(taggedGeometry.sourceAspect > 1, `Expected ${tier} fixture to retain the original asymmetric Circle of Friends viewBox.`);
        assert(Math.abs(taggedGeometry.iconBottomInset - 6) <= 0.1, `Expected ${tier} Circle of Friends to keep its fixed 6px tag-bottom inset, got ${taggedGeometry.iconBottomInset}px.`);
        assert(Math.abs(taggedGeometry.iconTagCentreDelta - 5) <= 0.1, `Expected ${tier} Circle of Friends to sit 5px below the tag centre while aligning to the title, got ${taggedGeometry.iconTagCentreDelta}px.`);
        assert(taggedGeometry.iconTitleFirstLineCentreDelta <= 0.1, `Expected ${tier} Circle of Friends to align with the first brand-title line, got ${taggedGeometry.iconTitleFirstLineCentreDelta}px.`);
        assert(taggedGeometry.graphicInlineCentreDelta <= 0.25, `Expected ${tier} Circle of Friends drawing to remain optically centred after compensating for its asymmetric source bounds; got ${taggedGeometry.graphicInlineCentreDelta}px.`);
        assert(Math.abs(taggedGeometry.iconOpticalOffsetInline + 0.2) <= 0.01, `Expected ${tier} Circle of Friends to retain the -0.2px source-viewBox correction, got ${taggedGeometry.iconOpticalOffsetInline}px.`);
      }
    }

    await desktopPage.setViewportSize({ width: 1440, height: 960 });

    const desktopDropdownToggle = desktopPage.locator(".bf-top-navigation-dropdown-toggle").first();
    await desktopDropdownToggle.waitFor({ state: "visible" });
    await desktopDropdownToggle.click({ force: true });
    await desktopPage.waitForTimeout(180);

    const desktopDropdownState = await desktopPage.evaluate(() => {
      const navigationElement = document.querySelector<HTMLElement>("#top-navigation-default");
      const dropdownItem = document.querySelector<HTMLElement>(".bf-top-navigation-item.is-dropdown-toggle");
      const dropdownToggle = dropdownItem?.querySelector<HTMLElement>(".bf-top-navigation-dropdown-toggle");
      const dropdownElement = dropdownItem?.querySelector<HTMLElement>(".bf-top-navigation-dropdown");
      const searchElement = document.querySelector<HTMLElement>(".bf-top-navigation-search");

      if (!(navigationElement instanceof HTMLElement) || !(dropdownItem instanceof HTMLElement) || !(dropdownToggle instanceof HTMLElement) || !(dropdownElement instanceof HTMLElement) || !(searchElement instanceof HTMLElement)) {
        return null;
      }

      const dropdownStyles = getComputedStyle(dropdownElement);

      return {
        menuOpen: Array.from(navigationElement.querySelectorAll<HTMLElement>(".bf-top-navigation-menu-toggle")).some(toggle => toggle.getAttribute("aria-expanded") === "true"),
        searchOpen: searchElement.getAttribute("aria-hidden") === "false",
        dropdownActive: dropdownItem.classList.contains("is-active"),
        expanded: dropdownToggle.getAttribute("aria-expanded"),
        hidden: dropdownElement.getAttribute("aria-hidden"),
        display: dropdownStyles.display,
        position: dropdownStyles.position
      };
    });

    assert(desktopDropdownState, "Expected desktop top-navigation dropdown state to be measurable.");
    assert(!desktopDropdownState.menuOpen && !desktopDropdownState.searchOpen, "Expected desktop dropdown toggle to leave the menu and search states closed.");
    assert(desktopDropdownState.dropdownActive, "Expected desktop dropdown toggle to activate its navigation item.");
    assert(desktopDropdownState.expanded === "true", `Expected desktop dropdown toggle aria-expanded=true, got ${desktopDropdownState.expanded}.`);
    assert(desktopDropdownState.hidden === "false", `Expected desktop dropdown aria-hidden=false, got ${desktopDropdownState.hidden}.`);
    assert(desktopDropdownState.display === "block", `Expected desktop dropdown display to become block, got ${desktopDropdownState.display}.`);
    assert(desktopDropdownState.position === "absolute", `Expected desktop dropdown to be absolutely positioned, got ${desktopDropdownState.position}.`);

    const desktopSearchToggle = desktopPage.locator(".bf-top-navigation-nav .bf-top-navigation-search-toggle").first();
    await desktopSearchToggle.waitFor({ state: "visible" });
    await desktopSearchToggle.click({ force: true });
    await desktopPage.waitForTimeout(180);

    const desktopSearchState = await desktopPage.evaluate(() => {
      const navigationElement = document.querySelector<HTMLElement>("#top-navigation-default");
      const searchElement = document.querySelector<HTMLElement>(".bf-top-navigation-search");
      const overlayElement = document.querySelector<HTMLElement>(".bf-top-navigation-search-overlay");
      const searchInput = document.querySelector<HTMLInputElement>(".bf-top-navigation-search .bf-search-box-input");
      const pressedButton = document.querySelector<HTMLElement>(".bf-top-navigation-nav .bf-top-navigation-search-toggle");
      const dropdownToggle = document.querySelector<HTMLElement>(".bf-top-navigation-dropdown-toggle");
      const dropdownElement = document.querySelector<HTMLElement>(".bf-top-navigation-item.is-dropdown-toggle .bf-top-navigation-dropdown");

      if (!(navigationElement instanceof HTMLElement) || !(searchElement instanceof HTMLElement) || !(overlayElement instanceof HTMLElement) || !(searchInput instanceof HTMLInputElement) || !(pressedButton instanceof HTMLElement) || !(dropdownToggle instanceof HTMLElement) || !(dropdownElement instanceof HTMLElement)) {
        return null;
      }

      return {
        searchOpen: searchElement.getAttribute("aria-hidden") === "false",
        menuOpen: Array.from(navigationElement.querySelectorAll<HTMLElement>(".bf-top-navigation-menu-toggle")).some(toggle => toggle.getAttribute("aria-expanded") === "true"),
        searchHidden: searchElement.getAttribute("aria-hidden"),
        overlayHidden: overlayElement.getAttribute("aria-hidden"),
        activeElementTag: document.activeElement?.tagName ?? null,
        activeElementType: document.activeElement instanceof HTMLInputElement ? document.activeElement.type : null,
        pressed: pressedButton.getAttribute("aria-pressed"),
        dropdownExpanded: dropdownToggle.getAttribute("aria-expanded"),
        dropdownHidden: dropdownElement.getAttribute("aria-hidden")
      };
    });

    assert(desktopSearchState, "Expected desktop top-navigation search state to be measurable.");
    assert(desktopSearchState.searchOpen, "Expected desktop search toggle to open the search state.");
    assert(!desktopSearchState.menuOpen, "Expected desktop search toggle to leave the menu state closed.");
    assert(desktopSearchState.searchHidden === "false", `Expected top-navigation search aria-hidden=false, got ${desktopSearchState.searchHidden}.`);
    assert(desktopSearchState.overlayHidden === "false", `Expected top-navigation overlay aria-hidden=false, got ${desktopSearchState.overlayHidden}.`);
    assert(desktopSearchState.activeElementTag === "INPUT" && desktopSearchState.activeElementType === "search", "Expected desktop search toggle to focus the search input.");
    assert(desktopSearchState.pressed === "true", `Expected desktop search toggle aria-pressed=true, got ${desktopSearchState.pressed}.`);
    assert(desktopSearchState.dropdownExpanded === "false", `Expected desktop search opening to collapse dropdown toggles, got aria-expanded=${desktopSearchState.dropdownExpanded}.`);
    assert(desktopSearchState.dropdownHidden === "true", `Expected desktop search opening to hide dropdown menus, got aria-hidden=${desktopSearchState.dropdownHidden}.`);

    const overlay = desktopPage.locator(".bf-top-navigation-search-overlay");
    const overlayBox = await overlay.boundingBox();
    assert(overlayBox, "Expected top-navigation overlay to expose a measurable bounding box.");
    await desktopPage.mouse.click(overlayBox.x + 32, overlayBox.y + 32);
    await desktopPage.waitForTimeout(180);

    const desktopClosedState = await desktopPage.evaluate(() => {
      const navigationElement = document.querySelector<HTMLElement>("#top-navigation-default");
      const searchElement = document.querySelector<HTMLElement>(".bf-top-navigation-search");
      const overlayElement = document.querySelector<HTMLElement>(".bf-top-navigation-search-overlay");

      if (!(navigationElement instanceof HTMLElement) || !(searchElement instanceof HTMLElement) || !(overlayElement instanceof HTMLElement)) {
        return null;
      }

      return {
        searchOpen: searchElement.getAttribute("aria-hidden") === "false",
        menuOpen: Array.from(navigationElement.querySelectorAll<HTMLElement>(".bf-top-navigation-menu-toggle")).some(toggle => toggle.getAttribute("aria-expanded") === "true"),
        searchHidden: searchElement.getAttribute("aria-hidden"),
        overlayHidden: overlayElement.getAttribute("aria-hidden")
      };
    });

    assert(desktopClosedState, "Expected desktop top-navigation closed state to be measurable.");
    assert(!desktopClosedState.searchOpen && !desktopClosedState.menuOpen, "Expected overlay click to close desktop top-navigation search state.");
    assert(desktopClosedState.searchHidden === "true", `Expected top-navigation search aria-hidden=true after overlay close, got ${desktopClosedState.searchHidden}.`);
    assert(desktopClosedState.overlayHidden === "true", `Expected top-navigation overlay aria-hidden=true after overlay close, got ${desktopClosedState.overlayHidden}.`);

    const desktopAccountDropdownToggle = desktopPage.locator(".bf-top-navigation-item.is-right-shifted .bf-top-navigation-dropdown-toggle");
    await desktopAccountDropdownToggle.waitFor({ state: "visible" });
    await desktopAccountDropdownToggle.click({ force: true });
    await desktopPage.waitForTimeout(180);

    const desktopAccountDropdownState = await desktopPage.evaluate(() => {
      const dropdownItem = document.querySelector<HTMLElement>(".bf-top-navigation-item.is-right-shifted.is-dropdown-toggle");
      const dropdownToggle = dropdownItem?.querySelector<HTMLElement>(".bf-top-navigation-dropdown-toggle");
      const dropdownElement = dropdownItem?.querySelector<HTMLElement>(".bf-top-navigation-dropdown");

      if (!(dropdownItem instanceof HTMLElement) || !(dropdownToggle instanceof HTMLElement) || !(dropdownElement instanceof HTMLElement)) {
        return null;
      }

      return {
        active: dropdownItem.classList.contains("is-active"),
        expanded: dropdownToggle.getAttribute("aria-expanded"),
        hidden: dropdownElement.getAttribute("aria-hidden")
      };
    });

    assert(desktopAccountDropdownState, "Expected right-aligned desktop dropdown state to be measurable.");
    assert(desktopAccountDropdownState.active, "Expected the right-aligned desktop dropdown to open.");
    assert(desktopAccountDropdownState.expanded === "true", `Expected right-aligned desktop dropdown aria-expanded=true, got ${desktopAccountDropdownState.expanded}.`);
    assert(desktopAccountDropdownState.hidden === "false", `Expected right-aligned desktop dropdown aria-hidden=false, got ${desktopAccountDropdownState.hidden}.`);

    const desktopActionItem = desktopPage.locator(".bf-top-navigation-item.is-right-shifted .bf-top-navigation-dropdown button.bf-top-navigation-dropdown-item").first();
    await desktopActionItem.waitFor({ state: "visible" });
    await desktopActionItem.click({ force: true });
    await desktopPage.waitForTimeout(180);

    const desktopActionCloseState = await desktopPage.evaluate(() => {
      const dropdownItem = document.querySelector<HTMLElement>(".bf-top-navigation-item.is-right-shifted.is-dropdown-toggle");
      const dropdownToggle = dropdownItem?.querySelector<HTMLElement>(".bf-top-navigation-dropdown-toggle");
      const dropdownElement = dropdownItem?.querySelector<HTMLElement>(".bf-top-navigation-dropdown");

      if (!(dropdownItem instanceof HTMLElement) || !(dropdownToggle instanceof HTMLElement) || !(dropdownElement instanceof HTMLElement)) {
        return null;
      }

      return {
        active: dropdownItem.classList.contains("is-active"),
        expanded: dropdownToggle.getAttribute("aria-expanded"),
        hidden: dropdownElement.getAttribute("aria-hidden")
      };
    });

    assert(desktopActionCloseState, "Expected action-item close state to be measurable.");
    assert(!desktopActionCloseState.active, "Expected activating a dropdown action item to close the desktop dropdown menu.");
    assert(desktopActionCloseState.expanded === "false", `Expected action-item activation to reset desktop dropdown aria-expanded=false, got ${desktopActionCloseState.expanded}.`);
    assert(desktopActionCloseState.hidden === "true", `Expected action-item activation to hide desktop dropdown menus, got aria-hidden=${desktopActionCloseState.hidden}.`);

    await desktopAccountDropdownToggle.click({ force: true });
    await desktopPage.waitForTimeout(180);

    await desktopPage.mouse.click(32, 320);
    await desktopPage.waitForTimeout(180);

    const desktopOutsideCloseState = await desktopPage.evaluate(() => {
      const dropdownItem = document.querySelector<HTMLElement>(".bf-top-navigation-item.is-right-shifted.is-dropdown-toggle");
      const dropdownToggle = dropdownItem?.querySelector<HTMLElement>(".bf-top-navigation-dropdown-toggle");
      const dropdownElement = dropdownItem?.querySelector<HTMLElement>(".bf-top-navigation-dropdown");

      if (!(dropdownItem instanceof HTMLElement) || !(dropdownToggle instanceof HTMLElement) || !(dropdownElement instanceof HTMLElement)) {
        return null;
      }

      return {
        active: dropdownItem.classList.contains("is-active"),
        expanded: dropdownToggle.getAttribute("aria-expanded"),
        hidden: dropdownElement.getAttribute("aria-hidden")
      };
    });

    assert(desktopOutsideCloseState, "Expected desktop outside-click dropdown state to be measurable.");
    assert(!desktopOutsideCloseState.active, "Expected outside clicks to close desktop dropdown menus.");
    assert(desktopOutsideCloseState.expanded === "false", `Expected outside clicks to reset desktop dropdown aria-expanded=false, got ${desktopOutsideCloseState.expanded}.`);
    assert(desktopOutsideCloseState.hidden === "true", `Expected outside clicks to hide desktop dropdown menus, got aria-hidden=${desktopOutsideCloseState.hidden}.`);

    await desktopPage.close();

    const mobilePage = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 640, height: 960 }
    });

    await mobilePage.goto(`${origin}${route}`, { waitUntil: "networkidle" });
    await waitForFonts(mobilePage);
    await disableDemoChromeHitTesting(mobilePage);

    // Diagram Registry consumes the same mark through an external <img> rather
    // than inline SVG. Exercise that public markup form without a network
    // dependency so square-box sizing and optical translation cannot drift.
    await mobilePage.evaluate(async () => {
      const svg = document.querySelector<SVGSVGElement>("#top-navigation-default .bf-top-navigation-logo-icon");
      if (!svg) return;
      const image = new Image();
      image.className = svg.getAttribute("class") ?? "bf-top-navigation-logo-icon";
      image.alt = "";
      image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.outerHTML)}`;
      svg.replaceWith(image);
      await image.decode();
    });

    const mobileBrandGeometry = await mobilePage.evaluate(() => {
      const navigation = document.querySelector<HTMLElement>("#top-navigation-default");
      const row = navigation?.querySelector<HTMLElement>(".bf-top-navigation-row");
      const tag = navigation?.querySelector<HTMLElement>(".bf-top-navigation-logo-tag");
      const icon = navigation?.querySelector<HTMLImageElement>("img.bf-top-navigation-logo-icon");
      const title = navigation?.querySelector<HTMLElement>(".bf-top-navigation-logo-title");
      if (!navigation || !row || !tag || !icon || !title) return null;
      const navigationRect = navigation.getBoundingClientRect();
      const rowRect = row.getBoundingClientRect();
      const tagRect = tag.getBoundingClientRect();
      const iconRect = icon.getBoundingClientRect();
      const titleRect = title.getBoundingClientRect();
      const titleStyles = getComputedStyle(title);
      const titleFirstLineCentre = titleRect.top
        + Number.parseFloat(titleStyles.paddingBlockStart)
        + (Number.parseFloat(titleStyles.lineHeight) / 2);
      return {
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        rowPaddingStart: Number.parseFloat(getComputedStyle(row).paddingBlockStart),
        rowPaddingEnd: Number.parseFloat(getComputedStyle(row).paddingBlockEnd),
        rowBottomDelta: Math.abs(navigationRect.bottom - rowRect.bottom),
        tagTopOffset: tagRect.top - navigationRect.top,
        tagWidth: tagRect.width,
        tagHeight: tagRect.height,
        tagRowEndResidual: rowRect.bottom - tagRect.bottom,
        tagBackground: getComputedStyle(tag).backgroundColor,
        iconElement: icon.tagName,
        iconOpticalOffsetInline: new DOMMatrixReadOnly(getComputedStyle(icon).transform).m41,
        iconWidth: iconRect.width,
        iconHeight: iconRect.height,
        iconBottomInset: tagRect.bottom - iconRect.bottom,
        iconTagCentreDelta: (iconRect.top + iconRect.height / 2) - (tagRect.top + tagRect.height / 2),
        iconTitleFirstLineCentreDelta: Math.abs((iconRect.top + iconRect.height / 2) - titleFirstLineCentre)
      };
    });
    assert(mobileBrandGeometry, "Expected mobile tagged-brand geometry.");
    assert(mobileBrandGeometry.overflow <= 0, `Expected mobile tagged navigation not to overflow, got ${mobileBrandGeometry.overflow}px.`);
    assert(mobileBrandGeometry.rowPaddingStart === 0 && mobileBrandGeometry.rowPaddingEnd === 0, "Expected mobile navigation row to have zero block padding.");
    assert(mobileBrandGeometry.rowBottomDelta <= 0.1 && Math.abs(mobileBrandGeometry.tagTopOffset) <= 0.1, "Expected mobile row and orange tag to attach to the navigation edges.");
    assert(mobileBrandGeometry.tagBackground === "rgb(233, 84, 32)", `Expected mobile tagged brand block to use Ubuntu orange, got ${mobileBrandGeometry.tagBackground}.`);
    assert(mobileBrandGeometry.iconElement === "IMG", `Expected mobile tagged-brand probe to exercise Registry's external image markup, got ${mobileBrandGeometry.iconElement}.`);
    assert(Math.abs(mobileBrandGeometry.tagWidth - 22) <= 0.1 && Math.abs(mobileBrandGeometry.tagHeight - 38) <= 0.1, `Expected mobile tag to remain 22px by 38px, got ${mobileBrandGeometry.tagWidth}px by ${mobileBrandGeometry.tagHeight}px.`);
    assert(Math.abs(mobileBrandGeometry.tagRowEndResidual - 10) <= 0.1, `Expected mobile tag to stop 10px before the occupied row boundary, got ${mobileBrandGeometry.tagRowEndResidual}px.`);
    assert(Math.abs(mobileBrandGeometry.iconWidth - 16) <= 0.1 && Math.abs(mobileBrandGeometry.iconHeight - 16) <= 0.1, `Expected mobile Circle of Friends to use a 16px square icon box, got ${mobileBrandGeometry.iconWidth}px by ${mobileBrandGeometry.iconHeight}px.`);
    assert(Math.abs(mobileBrandGeometry.iconBottomInset - 6) <= 0.1, `Expected mobile Circle of Friends to keep its fixed 6px tag-bottom inset, got ${mobileBrandGeometry.iconBottomInset}px.`);
    assert(Math.abs(mobileBrandGeometry.iconOpticalOffsetInline + 0.2) <= 0.01, `Expected mobile external Circle of Friends image to retain the -0.2px source-bound correction, got ${mobileBrandGeometry.iconOpticalOffsetInline}px.`);
    assert(Math.abs(mobileBrandGeometry.iconTagCentreDelta - 5) <= 0.1, `Expected mobile Circle of Friends to sit 5px below the tag centre, got ${mobileBrandGeometry.iconTagCentreDelta}px.`);
    assert(mobileBrandGeometry.iconTitleFirstLineCentreDelta <= 0.1, `Expected mobile Circle of Friends to align with the first brand-title line, got ${mobileBrandGeometry.iconTitleFirstLineCentreDelta}px.`);

    const mobileMenuToggle = mobilePage.locator(".bf-top-navigation-menu-toggle").first();
    await mobileMenuToggle.waitFor({ state: "visible" });
    await mobileMenuToggle.click({ force: true });
    await mobilePage.waitForTimeout(180);

    const mobileMenuState = await mobilePage.evaluate(() => {
      const navigationElement = document.querySelector<HTMLElement>("#top-navigation-default");
      const navElement = document.querySelector<HTMLElement>(".bf-top-navigation-nav");
      const menuToggle = document.querySelector<HTMLElement>(".bf-top-navigation-menu-toggle");
      const searchElement = document.querySelector<HTMLElement>(".bf-top-navigation-search");

      if (!(navigationElement instanceof HTMLElement) || !(navElement instanceof HTMLElement) || !(menuToggle instanceof HTMLElement) || !(searchElement instanceof HTMLElement)) {
        return null;
      }

      const navStyles = getComputedStyle(navElement);
      return {
        menuOpen: Array.from(navigationElement.querySelectorAll<HTMLElement>(".bf-top-navigation-menu-toggle")).some(toggle => toggle.getAttribute("aria-expanded") === "true"),
        searchOpen: searchElement.getAttribute("aria-hidden") === "false",
        navHidden: navElement.getAttribute("aria-hidden"),
        navDisplay: navStyles.display,
        expanded: menuToggle.getAttribute("aria-expanded")
      };
    });

    assert(mobileMenuState, "Expected mobile top-navigation menu state to be measurable.");
    assert(mobileMenuState.menuOpen, "Expected mobile menu toggle to open the top-navigation menu state.");
    assert(!mobileMenuState.searchOpen, "Expected mobile menu toggle to leave search closed.");
    assert(mobileMenuState.navHidden === "false", `Expected top-navigation nav aria-hidden=false on mobile open, got ${mobileMenuState.navHidden}.`);
    assert(mobileMenuState.navDisplay === "flex", `Expected top-navigation nav display to become flex on mobile open, got ${mobileMenuState.navDisplay}.`);
    assert(mobileMenuState.expanded === "true", `Expected mobile menu toggle aria-expanded=true, got ${mobileMenuState.expanded}.`);

    const mobileDropdownToggle = mobilePage.locator(".bf-top-navigation-dropdown-toggle").first();
    await mobileDropdownToggle.waitFor({ state: "visible" });
    await mobileDropdownToggle.click({ force: true });
    await mobilePage.waitForTimeout(180);

    const mobileDropdownState = await mobilePage.evaluate(() => {
      const navigationElement = document.querySelector<HTMLElement>("#top-navigation-default");
      const dropdownItem = document.querySelector<HTMLElement>(".bf-top-navigation-item.is-dropdown-toggle");
      const dropdownToggle = dropdownItem?.querySelector<HTMLElement>(".bf-top-navigation-dropdown-toggle");
      const dropdownElement = dropdownItem?.querySelector<HTMLElement>(".bf-top-navigation-dropdown");
      const searchElement = document.querySelector<HTMLElement>(".bf-top-navigation-search");

      if (!(navigationElement instanceof HTMLElement) || !(dropdownItem instanceof HTMLElement) || !(dropdownToggle instanceof HTMLElement) || !(dropdownElement instanceof HTMLElement) || !(searchElement instanceof HTMLElement)) {
        return null;
      }

      const dropdownStyles = getComputedStyle(dropdownElement);

      return {
        menuOpen: Array.from(navigationElement.querySelectorAll<HTMLElement>(".bf-top-navigation-menu-toggle")).some(toggle => toggle.getAttribute("aria-expanded") === "true"),
        searchOpen: searchElement.getAttribute("aria-hidden") === "false",
        dropdownActive: dropdownItem.classList.contains("is-active"),
        expanded: dropdownToggle.getAttribute("aria-expanded"),
        hidden: dropdownElement.getAttribute("aria-hidden"),
        display: dropdownStyles.display
      };
    });

    assert(mobileDropdownState, "Expected mobile top-navigation dropdown state to be measurable.");
    assert(mobileDropdownState.menuOpen, "Expected mobile dropdown expansion to keep the menu state open.");
    assert(!mobileDropdownState.searchOpen, "Expected mobile dropdown expansion to leave search closed.");
    assert(mobileDropdownState.dropdownActive, "Expected mobile dropdown toggle to activate its navigation item.");
    assert(mobileDropdownState.expanded === "true", `Expected mobile dropdown toggle aria-expanded=true, got ${mobileDropdownState.expanded}.`);
    assert(mobileDropdownState.hidden === "false", `Expected mobile dropdown aria-hidden=false, got ${mobileDropdownState.hidden}.`);
    assert(mobileDropdownState.display === "block", `Expected mobile dropdown display to become block, got ${mobileDropdownState.display}.`);

    await mobilePage.keyboard.press("Escape");
    await mobilePage.waitForTimeout(180);

    const mobileClosedState = await mobilePage.evaluate(() => {
      const navigationElement = document.querySelector<HTMLElement>("#top-navigation-default");
      const navElement = document.querySelector<HTMLElement>(".bf-top-navigation-nav");
      const menuToggle = document.querySelector<HTMLElement>(".bf-top-navigation-menu-toggle");
      const dropdownItem = document.querySelector<HTMLElement>(".bf-top-navigation-item.is-dropdown-toggle");
      const dropdownToggle = dropdownItem?.querySelector<HTMLElement>(".bf-top-navigation-dropdown-toggle");
      const dropdownElement = dropdownItem?.querySelector<HTMLElement>(".bf-top-navigation-dropdown");
      const searchElement = document.querySelector<HTMLElement>(".bf-top-navigation-search");

      if (!(navigationElement instanceof HTMLElement) || !(navElement instanceof HTMLElement) || !(menuToggle instanceof HTMLElement) || !(dropdownItem instanceof HTMLElement) || !(dropdownToggle instanceof HTMLElement) || !(dropdownElement instanceof HTMLElement) || !(searchElement instanceof HTMLElement)) {
        return null;
      }

      return {
        menuOpen: Array.from(navigationElement.querySelectorAll<HTMLElement>(".bf-top-navigation-menu-toggle")).some(toggle => toggle.getAttribute("aria-expanded") === "true"),
        searchOpen: searchElement.getAttribute("aria-hidden") === "false",
        navHidden: navElement.getAttribute("aria-hidden"),
        expanded: menuToggle.getAttribute("aria-expanded"),
        dropdownActive: dropdownItem.classList.contains("is-active"),
        dropdownExpanded: dropdownToggle.getAttribute("aria-expanded"),
        dropdownHidden: dropdownElement.getAttribute("aria-hidden")
      };
    });

    assert(mobileClosedState, "Expected mobile top-navigation closed state to be measurable.");
    assert(!mobileClosedState.menuOpen && !mobileClosedState.searchOpen, "Expected Escape to close the mobile top-navigation states.");
    assert(mobileClosedState.navHidden === "true", `Expected top-navigation nav aria-hidden=true after Escape, got ${mobileClosedState.navHidden}.`);
    assert(mobileClosedState.expanded === "false", `Expected mobile menu toggle aria-expanded=false after Escape, got ${mobileClosedState.expanded}.`);
    assert(!mobileClosedState.dropdownActive, "Expected Escape to close active mobile dropdown items.");
    assert(mobileClosedState.dropdownExpanded === "false", `Expected Escape to reset mobile dropdown aria-expanded=false, got ${mobileClosedState.dropdownExpanded}.`);
    assert(mobileClosedState.dropdownHidden === "true", `Expected Escape to hide mobile dropdown menus, got aria-hidden=${mobileClosedState.dropdownHidden}.`);

    await mobilePage.close();
  } finally {
    await browser.close();
  }
}

async function verifyBodySizedUiTypography(origin: string): Promise<void> {
  const demos = [
    { route: "/demo/components/button.html", selector: ".pc-content .bf-button", label: "button" },
    { route: "/demo/components/controls.html", selector: ".pc-content .bf-form-label", label: "form label" },
    { route: "/demo/components/controls.html", selector: ".pc-content .bf-input", label: "input" },
    { route: "/demo/components/chip.html", selector: ".pc-content .bf-chip", label: "chip" },
    { route: "/demo/components/status-label.html", selector: ".pc-content .bf-status-label", label: "status label" },
    { route: "/demo/components/badge.html", selector: ".pc-content .bf-badge", label: "badge" },
    { route: "/demo/components/breadcrumbs.html", selector: ".pc-content .bf-breadcrumbs-item", label: "breadcrumb" },
    { route: "/demo/components/side-navigation.html", selector: ".pc-content .bf-side-navigation-link", label: "side-navigation link" },
    { route: "/demo/components/tabs.html", selector: ".pc-content .bf-tabs-link", label: "tab" },
    { route: "/demo/components/accordion.html", selector: ".pc-content .bf-accordion-tab", label: "accordion tab" }
  ] as const;
  const tiers = ["editorial", "documentation", "app", "os"] as const;
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1440, height: 960 }
    });

    for (const demo of demos) {
      await page.goto(`${origin}${demo.route}`, { waitUntil: "networkidle" });
      await waitForFonts(page);
      await disableDemoChromeHitTesting(page);

      const tierSelect = page.locator("[data-page-chrome-tier-select]");
      await tierSelect.waitFor({ state: "visible" });

      for (const tier of tiers) {
        await tierSelect.selectOption(tier);
        await page.waitForFunction(
          expectedTier => document.body.dataset.bfTier === expectedTier,
          tier
        );
        await page.waitForTimeout(180);

        const state = await page.evaluate(({ selector }) => {
          const target = document.querySelector(selector);
          const body = document.body;

          if (!(target instanceof HTMLElement) || !(body instanceof HTMLElement)) {
            return null;
          }

          const targetStyles = getComputedStyle(target);
          const bodyStyles = getComputedStyle(body);
          const probe = document.createElement("span");
          probe.style.fontSize = "var(--bf-body-font-size)";
          probe.style.lineHeight = "var(--bf-body-line-height)";
          probe.style.position = "absolute";
          probe.style.visibility = "hidden";
          body.appendChild(probe);
          const probeStyles = getComputedStyle(probe);
          const resolvedBodyFontSize = probeStyles.fontSize;
          const resolvedBodyLineHeight = probeStyles.lineHeight;
          probe.remove();

          return {
            bodyTier: body.dataset.bfTier ?? null,
            bodyFontSize: bodyStyles.fontSize,
            bodyLineHeight: bodyStyles.lineHeight,
            bodyRoleFontSize: bodyStyles.getPropertyValue("--bf-body-font-size").trim(),
            bodyRoleLineHeight: bodyStyles.getPropertyValue("--bf-body-line-height").trim(),
            resolvedBodyFontSize,
            resolvedBodyLineHeight,
            targetFontSize: targetStyles.fontSize,
            targetLineHeight: targetStyles.lineHeight
          };
        }, { selector: demo.selector });

        assert(state, `Expected ${demo.label} typography state to be measurable in ${tier}.`);
        assert(state.bodyTier === tier, `Expected ${demo.label} page to switch to ${tier}, got ${state.bodyTier}.`);
        assert(state.targetFontSize === state.resolvedBodyFontSize, `Expected ${demo.label} font-size to match the active body role in ${tier}. Body role ${state.bodyRoleFontSize} (${state.resolvedBodyFontSize}), target ${state.targetFontSize}.`);
        assert(state.targetLineHeight === state.resolvedBodyLineHeight, `Expected ${demo.label} line-height to match the active body role in ${tier}. Body role ${state.bodyRoleLineHeight} (${state.resolvedBodyLineHeight}), target ${state.targetLineHeight}.`);

        if (demo.route.endsWith("/accordion.html")) {
          const keyline = await page.evaluate(() => {
            const tab = document.querySelector<HTMLElement>(".pc-content .bf-accordion-tab");
            const panel = document.querySelector<HTMLElement>(".pc-content .bf-accordion-panel[aria-hidden='false']");
            const paragraph = panel?.querySelector<HTMLElement>("p");
            if (!tab || !panel || !paragraph) return null;
            const tabRange = document.createRange();
            tabRange.selectNodeContents(tab);
            const paragraphRange = document.createRange();
            paragraphRange.selectNodeContents(paragraph);
            const tabText = Array.from(tabRange.getClientRects()).at(-1);
            const paragraphText = Array.from(paragraphRange.getClientRects()).at(0);
            const probe = document.createElement("span");
            probe.style.cssText = "position:absolute;visibility:hidden;inline-size:calc(var(--bf-disclosure-icon-inline-size) + var(--bf-disclosure-gap));block-size:1px";
            document.body.appendChild(probe);
            const disclosureOffset = probe.getBoundingClientRect().width;
            probe.remove();
            return {
              delta: Math.abs((paragraphText?.left ?? 0) - (tabText?.left ?? 0)),
              paddingStart: Number.parseFloat(getComputedStyle(panel).paddingInlineStart),
              disclosureOffset
            };
          });
          assert(keyline, `Expected ${tier} accordion label/panel keyline geometry to be measurable.`);
          assert(keyline.delta <= 1 && Math.abs(keyline.paddingStart - keyline.disclosureOffset) <= 0.05, `Expected ${tier} accordion panel copy to share the tab-label keyline from disclosure variables; got ${JSON.stringify(keyline)}.`);
        }
      }
    }

    await page.close();
  } finally {
    await browser.close();
  }
}

async function verifyNestedAuxiliaryGeometry(origin: string): Promise<void> {
  const tiers = ["editorial", "documentation", "app", "os"] as const;
  const tones = ["light", "dark"] as const;
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1440, height: 900 }
    });

    const selectTone = async (tone: typeof tones[number]): Promise<void> => {
      const toggle = page.locator("[data-page-chrome-tone-toggle]");
      const wantsDark = tone === "dark";
      if (await toggle.isChecked() !== wantsDark) {
        await toggle.setChecked(wantsDark, { force: true });
      }
      await page.waitForFunction(expectedDark => document.body.classList.contains("is-dark") === expectedDark, wantsDark);
    };

    await page.goto(`${origin}/demo/components/side-navigation.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tone of tones) {
      await selectTone(tone);
      for (const tier of tiers) {
        await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
        await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
        const navigation = await page.evaluate(() => {
          const plainHost = document.querySelector<HTMLElement>(".pc-content .bf-side-navigation-link:not(:has(.is-nested))");
          const nested = Array.from(document.querySelectorAll<HTMLElement>(".pc-content :is(.bf-chip, .bf-status-label).is-nested"));
          if (!plainHost || nested.length === 0) return null;
          const plainHeight = plainHost.getBoundingClientRect().height;
          return nested.map(child => {
            const host = child.closest<HTMLElement>(".bf-side-navigation-link, .bf-side-navigation-text");
            const childStyles = getComputedStyle(child);
            const hostStyles = host ? getComputedStyle(host) : null;
            return {
              childHeight: child.getBoundingClientRect().height,
              childKind: child.classList.contains("bf-chip") ? "chip" : "status",
              hostHeight: host?.getBoundingClientRect().height ?? 0,
              hostLineHeight: Number.parseFloat(hostStyles?.lineHeight ?? "0"),
              marginBlockEnd: Number.parseFloat(childStyles.marginBlockEnd),
              marginBlockStart: Number.parseFloat(childStyles.marginBlockStart),
              paddingBlockEnd: Number.parseFloat(childStyles.paddingBlockEnd),
              paddingBlockStart: Number.parseFloat(childStyles.paddingBlockStart),
              borderBlockEnd: Number.parseFloat(childStyles.borderBlockEndWidth),
              borderBlockStart: Number.parseFloat(childStyles.borderBlockStartWidth),
              boxShadow: childStyles.boxShadow,
              plainHeight
            };
          });
        });
        assert(navigation?.length === 5, `Expected ${tier}/${tone} side navigation to expose five nested auxiliary fixtures: ${JSON.stringify(navigation)}.`);
        assert(navigation.every(item => Math.abs(item.hostHeight - item.plainHeight) <= 0.1), `Expected ${tier}/${tone} nested auxiliary surfaces not to enlarge side-navigation rows: ${JSON.stringify(navigation)}.`);
        assert(navigation.every(item => item.childHeight <= item.hostLineHeight + 0.1), `Expected ${tier}/${tone} nested auxiliary paint to fit inside the host body line: ${JSON.stringify(navigation)}.`);
        assert(navigation.every(item => item.marginBlockStart === 0 && item.marginBlockEnd === 0 && Math.abs(item.paddingBlockStart - item.paddingBlockEnd) <= 0.1), `Expected ${tier}/${tone} nested auxiliary surfaces to use zero block margins and symmetric padding: ${JSON.stringify(navigation)}.`);
        assert(navigation.every(item => item.borderBlockStart === 0 && item.borderBlockEnd === 0 && (item.childKind !== "chip" || item.boxShadow !== "none")), `Expected ${tier}/${tone} nested auxiliary borders to paint without adding block footprint: ${JSON.stringify(navigation)}.`);
      }
    }

    await page.goto(`${origin}/demo/components/tabs.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tone of tones) {
      await selectTone(tone);
      for (const tier of tiers) {
        await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
        await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
        const tabs = await page.evaluate(() => {
          const nestedTab = document.querySelector<HTMLElement>(".bf-tabs-link:has(.bf-badge.is-nested)");
          const plainTab = document.querySelector<HTMLElement>(".bf-tabs-link:not(:has(.bf-badge))");
          const badge = nestedTab?.querySelector<HTMLElement>(".bf-badge.is-nested");
          if (!nestedTab || !plainTab || !badge) return null;
          return {
            badgeHeight: badge.getBoundingClientRect().height,
            nestedHeight: nestedTab.getBoundingClientRect().height,
            nestedLineHeight: Number.parseFloat(getComputedStyle(nestedTab).lineHeight),
            plainHeight: plainTab.getBoundingClientRect().height
          };
        });
        assert(tabs && Math.abs(tabs.nestedHeight - tabs.plainHeight) <= 0.1 && tabs.badgeHeight <= tabs.nestedLineHeight + 0.1, `Expected ${tier}/${tone} nested tab badge to fit without changing the tab row: ${JSON.stringify(tabs)}.`);
      }
    }

    await page.goto(`${origin}/demo/spec/spacing-vertical.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tone of tones) {
      await selectTone(tone);
      for (const tier of tiers) {
        await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
        await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
        const audit = await page.evaluate(() => {
          const activeTab = document.querySelector<HTMLElement>(
            "[aria-label='Tab action'] .bf-tabs-link"
          );
          const plainRow = document.querySelector<HTMLElement>(
            "[aria-label='Plain table cell'] .bf-table tr"
          );
          const nestedRow = document.querySelector<HTMLElement>(
            "[aria-label='Table chip badge'] .bf-table tr"
          );
          const nestedCell = nestedRow?.querySelector<HTMLElement>("td");
          const nestedChip = nestedRow?.querySelector<HTMLElement>(".bf-chip.is-nested");
          const nestedBadge = nestedChip?.querySelector<HTMLElement>(".bf-badge.is-nested");
          const controlTable = document.querySelector<HTMLTableElement>(
            "[aria-label='Table control row fit comparison']"
          );
          const plainTextRow = controlTable?.querySelector<HTMLElement>(
            "[aria-label='Plain text row']"
          );
          const controlRow = controlTable?.querySelector<HTMLElement>(
            "tr[aria-label='Control row']"
          );
          const plainTextCell = plainTextRow?.querySelector<HTMLElement>("td");
          const controlCell = controlRow?.querySelector<HTMLElement>("td");
          const controlTargets = controlRow
            ? [
                controlRow.querySelector<HTMLElement>("[aria-label='Table text input']"),
                controlRow.querySelector<HTMLElement>("[aria-label='Table number input']"),
                controlRow.querySelector<HTMLElement>(".bf-button"),
                controlRow.querySelector<HTMLElement>(".bf-checkbox-label"),
                controlRow.querySelector<HTMLElement>(".bf-radio-label")
              ]
            : [];
          const standaloneTargets = [
            document.querySelector<HTMLElement>("[aria-label='Text input'] .bf-input"),
            document.querySelector<HTMLElement>("[aria-label='Number input'] .bf-input"),
            document.querySelector<HTMLElement>("[aria-label='Button'] .bf-button"),
            document.querySelector<HTMLElement>("[aria-label='Checkbox'] .bf-checkbox-label"),
            document.querySelector<HTMLElement>("[aria-label='Radio'] .bf-radio-label")
          ];
          const nestedSelectionLabels = controlRow
            ? [
                controlRow.querySelector<HTMLElement>(".bf-checkbox.is-nested > .bf-checkbox-label"),
                controlRow.querySelector<HTMLElement>(".bf-radio.is-nested > .bf-radio-label")
              ]
            : [];
          if (
            !activeTab ||
            !plainRow ||
            !nestedRow ||
            !nestedCell ||
            !nestedChip ||
            !nestedBadge ||
            !plainTextRow ||
            !controlRow ||
            !plainTextCell ||
            !controlCell ||
            controlTargets.some(target => !target) ||
            standaloneTargets.some(target => !target) ||
            nestedSelectionLabels.some(label => !label)
          ) {
            return null;
          }
          const chipRect = nestedChip.getBoundingClientRect();
          const badgeRect = nestedBadge.getBoundingClientRect();
          const activeStyles = getComputedStyle(activeTab);
          const plainTextCellStyles = getComputedStyle(plainTextCell);
          const controlCellStyles = getComputedStyle(controlCell);
          const rowBorderSize = Number.parseFloat(
            plainTextCellStyles.borderBlockEndWidth
          );
          return {
            activeClass: activeTab.classList.contains("is-active"),
            activeRule: activeStyles.boxShadow,
            selected: activeTab.getAttribute("aria-selected"),
            tabIndex: activeTab.getAttribute("tabindex"),
            rowHeightDelta: Math.abs(
              plainRow.getBoundingClientRect().height -
                nestedRow.getBoundingClientRect().height
            ),
            chipHeight: chipRect.height,
            cellLineHeight: Number.parseFloat(getComputedStyle(nestedCell).lineHeight),
            badgeContained:
              badgeRect.top >= chipRect.top - 0.1 &&
              badgeRect.bottom <= chipRect.bottom + 0.1,
            controlRowHeightDelta: Math.abs(
              controlRow.getBoundingClientRect().height -
                plainTextRow.getBoundingClientRect().height
            ),
            controlTargetHeights: controlTargets.map(
              target => target!.getBoundingClientRect().height
            ),
            standaloneTargetHeights: standaloneTargets.map(
              target => target!.getBoundingClientRect().height
            ),
            nestedSelectionMarkCenterDeltas: nestedSelectionLabels.map(label => {
              const labelHeight = label!.getBoundingClientRect().height;
              const markStyles = getComputedStyle(label!, "::before");
              const markStart = Number.parseFloat(markStyles.insetBlockStart);
              const markSize = Number.parseFloat(markStyles.blockSize);
              return Math.abs(markStart + (markSize / 2) - (labelHeight / 2));
            }),
            controlCellLineHeight: Number.parseFloat(controlCellStyles.lineHeight),
            controlCellPaddingBlockStart: Number.parseFloat(
              controlCellStyles.paddingBlockStart
            ),
            controlCellPaddingBlockEnd: Number.parseFloat(
              controlCellStyles.paddingBlockEnd
            ),
            controlCellBorderBlockEnd: Number.parseFloat(
              controlCellStyles.borderBlockEndWidth
            ),
            controlCellOverflow: controlCellStyles.overflow,
            plainCellPaddingBlockStart: Number.parseFloat(
              plainTextCellStyles.paddingBlockStart
            ),
            plainCellPaddingBlockEnd: Number.parseFloat(
              plainTextCellStyles.paddingBlockEnd
            ),
            plainCellBorderBlockEnd: Number.parseFloat(
              plainTextCellStyles.borderBlockEndWidth
            ),
            plainCellOverflow: plainTextCellStyles.overflow,
            rowBorderSize
          };
        });
        assert(
          audit &&
            audit.activeClass &&
            audit.selected === "true" &&
            audit.tabIndex === "0" &&
            audit.activeRule !== "none",
          `Expected ${tier}/${tone} audit tab to paint its active rule before interaction: ${JSON.stringify(audit)}.`
        );
        assert(
          audit &&
            audit.badgeContained &&
            audit.chipHeight <= audit.cellLineHeight + 0.1 &&
            audit.rowHeightDelta <= 0.1,
          `Expected ${tier}/${tone} nested badge to fit inside the compact table chip without enlarging its row: ${JSON.stringify(audit)}.`
        );
        assert(
          audit &&
            audit.controlRowHeightDelta <= audit.rowBorderSize &&
            audit.controlTargetHeights.every(
              height => height <= audit.controlCellLineHeight + audit.rowBorderSize
            ) &&
            audit.controlTargetHeights.every(
              (height, index) =>
                audit.standaloneTargetHeights[index] - height > audit.rowBorderSize
            ) &&
            audit.nestedSelectionMarkCenterDeltas.every(
              delta => delta <= audit.rowBorderSize
            ) &&
            Math.abs(
              audit.controlCellPaddingBlockStart - audit.plainCellPaddingBlockStart
            ) <= audit.rowBorderSize &&
            Math.abs(
              audit.controlCellPaddingBlockEnd - audit.plainCellPaddingBlockEnd
            ) <= audit.rowBorderSize &&
            audit.controlCellBorderBlockEnd === audit.plainCellBorderBlockEnd &&
            audit.controlCellOverflow === audit.plainCellOverflow,
          `Expected ${tier}/${tone} explicitly nested controls to fit inside the ordinary table-cell rhythm: ${JSON.stringify(audit)}.`
        );
      }
    }

    await page.close();
  } finally {
    await browser.close();
  }
}

async function verifyBlockDerivedInlineGeometry(origin: string): Promise<void> {
  const tiers = ["editorial", "documentation", "app", "os"] as const;
  const tones = ["light", "dark"] as const;
  const browser = await openBrowser();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const shapeTolerance = 1.05;

  const setSurface = async (tier: typeof tiers[number], tone: typeof tones[number]): Promise<void> => {
    const toneToggle = page.locator("[data-page-chrome-tone-toggle]");
    const wantsDark = tone === "dark";
    if (await toneToggle.isChecked() !== wantsDark) {
      await toneToggle.setChecked(wantsDark, { force: true });
    }
    await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
    await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
  };

  const readBoxes = async (selector: string) => page.locator(selector).evaluateAll(elements => elements.map(element => {
    const target = element as HTMLElement;
    const rect = target.getBoundingClientRect();
    const style = getComputedStyle(target);
    const range = document.createRange();
    range.selectNodeContents(target);
    const contentRect = range.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      clientWidth: target.clientWidth,
      scrollWidth: target.scrollWidth,
      minInlineSize: style.minInlineSize,
      paddingInlineStart: Number.parseFloat(style.paddingInlineStart),
      paddingInlineEnd: Number.parseFloat(style.paddingInlineEnd),
      contentCenterDelta: contentRect.width > 0
        ? (contentRect.left + (contentRect.width / 2)) - (rect.left + (rect.width / 2))
        : null
    };
  }));

  const assertSquare = (box: Awaited<ReturnType<typeof readBoxes>>[number], label: string): void => {
    assert(Math.abs(box.width - box.height) <= shapeTolerance, `Expected ${label} to match painted inline and block extents within one rasterised border; got ${JSON.stringify(box)}.`);
  };

  const assertNoClip = (box: Awaited<ReturnType<typeof readBoxes>>[number], label: string): void => {
    assert(box.scrollWidth <= box.clientWidth + 1, `Expected ${label} not to clip its content; got ${JSON.stringify(box)}.`);
  };

  const assertCentered = (box: Awaited<ReturnType<typeof readBoxes>>[number], label: string): void => {
    assert(box.contentCenterDelta !== null && Math.abs(box.contentCenterDelta) <= 0.51, `Expected ${label} content to be horizontally centred inside its painted square; got ${JSON.stringify(box)}.`);
  };

  const assertTargetSizeOrSpacing = async (selector: string, label: string): Promise<void> => {
    const targets = await page.locator(selector).evaluateAll(elements => {
      type TargetGeometry = {
        element: HTMLElement;
        rect: DOMRect;
        centreX: number;
        centreY: number;
        containsMinimumSquare: boolean;
      };
      const pointerTargetSelector = "a[href], button, input, select, textarea, summary, [role='button'], [role='link'], [role='checkbox'], [role='radio'], [role='switch'], [role='tab'], [role='menuitem'], [role='menuitemcheckbox'], [role='menuitemradio'], [role='option'], [role='slider'], [role='spinbutton'], [role='textbox'], [role='combobox']";
      const allTargets = [...document.querySelectorAll<HTMLElement>(pointerTargetSelector)]
        .filter(target => {
          const rect = target.getBoundingClientRect();
          const style = getComputedStyle(target);
          return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
        })
        .map((target): TargetGeometry => {
          const rect = target.getBoundingClientRect();
          const style = getComputedStyle(target);
          const radii = [
            style.borderTopLeftRadius,
            style.borderTopRightRadius,
            style.borderBottomRightRadius,
            style.borderBottomLeftRadius
          ].map(value => {
            const parts = value.split(/\s+/).map(part => Number.parseFloat(part));
            return [parts[0] || 0, parts[1] || parts[0] || 0] as [number, number];
          });
          const scale = Math.min(
            1,
            ...[
              rect.width / Math.max(radii[0][0] + radii[1][0], 1),
              rect.width / Math.max(radii[3][0] + radii[2][0], 1),
              rect.height / Math.max(radii[0][1] + radii[3][1], 1),
              rect.height / Math.max(radii[1][1] + radii[2][1], 1)
            ]
          );
          const insetX = (rect.width - 24) / 2;
          const insetY = (rect.height - 24) / 2;
          const containsSquare = rect.width >= 24 && rect.height >= 24 && radii.every(([rawX, rawY]) => {
            const radiusX = rawX * scale;
            const radiusY = rawY * scale;
            if (radiusX === 0 || radiusY === 0 || insetX >= radiusX || insetY >= radiusY) return true;
            const x = (insetX - radiusX) / radiusX;
            const y = (insetY - radiusY) / radiusY;
            return (x * x) + (y * y) <= 1.0001;
          });
          return {
            element: target,
            rect,
            centreX: rect.left + (rect.width / 2),
            centreY: rect.top + (rect.height / 2),
            containsMinimumSquare: containsSquare
          };
        });
      return elements.map(element => {
        const ownTarget = allTargets.find(target => target.element === element);
        if (!ownTarget) throw new Error("Expected reviewed target to be present in the page target inventory.");
        const { rect, centreX, centreY, containsMinimumSquare } = ownTarget;
        const clearances = allTargets
          .filter(other => other.element !== element)
          .map(other => {
            if (!other.containsMinimumSquare) {
              return Math.hypot(other.centreX - centreX, other.centreY - centreY) - 24;
            }
            const nearestX = Math.max(other.rect.left, Math.min(centreX, other.rect.right));
            const nearestY = Math.max(other.rect.top, Math.min(centreY, other.rect.bottom));
            return Math.hypot(nearestX - centreX, nearestY - centreY) - 12;
          });
        const minimumClearance = clearances.length > 0 ? Math.min(...clearances) : Number.POSITIVE_INFINITY;
        return {
          width: rect.width,
          height: rect.height,
          containsMinimumSquare,
          minimumSpacingClearance: minimumClearance,
          passesSpacing: minimumClearance >= -0.01
        };
      });
    });
    for (const target of targets) {
      assert(target.containsMinimumSquare || target.passesSpacing, `Expected ${label} to contain an axis-aligned 24px square or pass the WCAG 2.5.8 pairwise spacing-circle test; got ${JSON.stringify(target)}.`);
    }
  };

  try {
    await page.goto(`${origin}/demo/components/chip.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tone of tones) {
      for (const tier of tiers) {
        await setSurface(tier, tone);
        const chips = await readBoxes("[data-block-derived-chip]:not(.is-nested)");
        assert(chips.length === 6, `Expected six chip shape and overflow fixtures in ${tier}/${tone}.`);
        assertSquare(chips[0], `${tier}/${tone} one-character chip`);
        assertCentered(chips[0], `${tier}/${tone} one-character chip`);
        assertSquare(chips[5], `${tier}/${tone} one-character borderless chip`);
        assertCentered(chips[5], `${tier}/${tone} one-character borderless chip`);
        assert(chips[3].width > chips[3].height + shapeTolerance && Math.abs(chips[3].height - chips[0].height) <= shapeTolerance, `Expected ${tier}/${tone} four-character chip to grow into a stadium without changing its painted block; got ${JSON.stringify(chips)}.`);
        assertNoClip(chips[1], `${tier}/${tone} two-character chip`);
        assertNoClip(chips[2], `${tier}/${tone} three-character chip`);
        assertNoClip(chips[3], `${tier}/${tone} four-character chip`);
        assertNoClip(chips[4], `${tier}/${tone} five-character chip`);
        await assertTargetSizeOrSpacing("button[data-block-derived-chip]:not(.is-nested)", `${tier}/${tone} interactive standalone chip`);
      }
    }

    for (const tone of tones) {
      for (const tier of tiers) {
        await setSurface(tier, tone);
        const nestedChips = await readBoxes("[data-block-derived-chip].is-nested");
        assert(nestedChips.length === 5, `Expected one-through-five-character nested chip fixtures in ${tier}/${tone}.`);
        assertSquare(nestedChips[0], `${tier}/${tone} nested one-character chip`);
        assertCentered(nestedChips[0], `${tier}/${tone} nested one-character chip`);
        assert(nestedChips[3].width > nestedChips[3].height + shapeTolerance && Math.abs(nestedChips[3].height - nestedChips[0].height) <= shapeTolerance, `Expected ${tier}/${tone} nested four-character chip to grow into a stadium; got ${JSON.stringify(nestedChips)}.`);
        assertNoClip(nestedChips[1], `${tier}/${tone} nested two-character chip`);
        assertNoClip(nestedChips[2], `${tier}/${tone} nested three-character chip`);
        assertNoClip(nestedChips[3], `${tier}/${tone} nested four-character chip`);
        assertNoClip(nestedChips[4], `${tier}/${tone} nested five-character chip`);
      }
    }

    await page.goto(`${origin}/demo/spec/spacing-vertical.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tone of tones) {
      for (const tier of tiers) {
        await setSurface(tier, tone);
        const [nestedInteractiveChip] = await readBoxes("[data-block-derived-interactive-nested-chip]");
        assert(nestedInteractiveChip, `Expected the table-hosted interactive nested chip in ${tier}/${tone}.`);
        assertNoClip(nestedInteractiveChip, `${tier}/${tone} table-hosted interactive nested chip`);
        await assertTargetSizeOrSpacing("[data-block-derived-interactive-nested-chip]", `${tier}/${tone} table-hosted interactive nested chip`);
      }
    }

    await page.goto(`${origin}/demo/components/badge.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tone of tones) {
      for (const tier of tiers) {
        await setSurface(tier, tone);
        const badges = await readBoxes("[data-block-derived-badge]");
        assert(badges.length === 10, `Expected standalone and nested one-through-five-character badge fixtures in ${tier}/${tone}.`);
        assertSquare(badges[0], `${tier}/${tone} one-character badge`);
        assertSquare(badges[5], `${tier}/${tone} nested one-character badge`);
        assert(badges[3].width > badges[3].height + shapeTolerance && Math.abs(badges[3].height - badges[0].height) <= shapeTolerance, `Expected ${tier}/${tone} four-character badge to grow into a stadium without changing its painted block; got ${JSON.stringify(badges)}.`);
        assert(badges[8].width > badges[8].height + shapeTolerance && Math.abs(badges[8].height - badges[5].height) <= shapeTolerance, `Expected ${tier}/${tone} nested four-character badge to grow into a stadium; got ${JSON.stringify(badges)}.`);
        for (const [index, badge] of badges.entries()) {
          if (index === 0 || index === 5) continue;
          assertNoClip(badge, `${tier}/${tone} badge fixture ${index + 1}`);
        }
      }
    }

    await page.goto(`${origin}/demo/components/button.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tone of tones) {
      for (const tier of tiers) {
        await setSurface(tier, tone);
        const buttons = await readBoxes("[data-block-derived-icon-button]");
        assert(buttons.length === 4, `Expected regular, nested, and link-style icon-only button fixtures in ${tier}/${tone}.`);
        for (const [index, button] of buttons.entries()) {
          assertSquare(button, `${tier}/${tone} icon-only button ${index + 1}`);
          assert(button.paddingInlineStart === 0 && button.paddingInlineEnd === 0, `Expected ${tier}/${tone} icon-only button ${index + 1} to omit the label-framing action inset; got ${JSON.stringify(button)}.`);
        }
        await assertTargetSizeOrSpacing("[data-block-derived-icon-button]", `${tier}/${tone} icon-only button`);
        const pageChromeButtons = await readBoxes(".pc-sequence-link");
        assert(pageChromeButtons.length > 0, `Expected real page-chrome icon-only links in ${tier}/${tone}.`);
        for (const button of pageChromeButtons) assertSquare(button, `${tier}/${tone} page-chrome icon-only link`);
        await assertTargetSizeOrSpacing(".pc-sequence-link", `${tier}/${tone} page-chrome icon-only link`);
      }
    }

    await page.goto(`${origin}/demo/components/notification.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tone of tones) {
      for (const tier of tiers) {
        await setSurface(tier, tone);
        const [close] = await readBoxes(".bf-notification-close");
        assert(close, `Expected the specialized notification close action in ${tier}/${tone}.`);
        assertSquare(close, `${tier}/${tone} notification close action`);
        assert(close.paddingInlineStart === 0 && close.paddingInlineEnd === 0, `Expected ${tier}/${tone} notification close action to omit label-framing padding; got ${JSON.stringify(close)}.`);
        await assertTargetSizeOrSpacing(".bf-notification-close", `${tier}/${tone} notification close action`);
      }
    }

    await page.goto(`${origin}/demo/components/pagination.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tone of tones) {
      for (const tier of tiers) {
        await setSurface(tier, tone);
        const numbered = await readBoxes("[data-block-derived-pagination]");
        const labelled = await readBoxes(".bf-pagination-link.is-previous, .bf-pagination-link.is-next");
        assert(numbered.length === 3 && labelled.length === 2, `Expected numbered and labelled pagination fixtures in ${tier}/${tone}.`);
        for (const number of numbered) {
          assertSquare(number, `${tier}/${tone} numbered pagination slot`);
          assert(number.paddingInlineStart === 0 && number.paddingInlineEnd === 0, `Expected ${tier}/${tone} numbered pagination to omit the Action inset; got ${JSON.stringify(number)}.`);
        }
        assert(labelled.every(link => link.paddingInlineStart > 0 && link.paddingInlineEnd > 0 && link.width > link.height), `Expected ${tier}/${tone} labelled previous/next pagination to retain the Action contract; got ${JSON.stringify(labelled)}.`);
        await assertTargetSizeOrSpacing("[data-block-derived-pagination]", `${tier}/${tone} numbered pagination`);
      }
    }

    await page.goto(`${origin}/demo/components/article-pagination.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tone of tones) {
      for (const tier of tiers) {
        await setSurface(tier, tone);
        const collapsed = await page.locator(".article-pagination-demo-narrow .bf-article-pagination").evaluate(navigation => {
          const previous = navigation.querySelector<HTMLElement>(".bf-article-pagination-link.is-previous");
          const label = previous?.querySelector<HTMLElement>(".bf-article-pagination-label");
          if (!previous || !label) return null;
          const rect = previous.getBoundingClientRect();
          const style = getComputedStyle(previous);
          const labelStyle = getComputedStyle(label);
          return {
            width: rect.width,
            height: rect.height,
            minInlineSize: style.minInlineSize,
            paddingInlineStart: Number.parseFloat(style.paddingInlineStart),
            paddingInlineEnd: Number.parseFloat(style.paddingInlineEnd),
            labelClipPath: labelStyle.clipPath,
            labelWidth: label.getBoundingClientRect().width
          };
        });
        assert(collapsed && collapsed.minInlineSize === "0px" && collapsed.paddingInlineStart > 0 && collapsed.paddingInlineEnd > 0 && collapsed.labelWidth <= 1, `Expected ${tier}/${tone} collapsed article pagination to remain a responsive labelled control outside block-derived membership; got ${JSON.stringify(collapsed)}.`);
      }
    }
  } finally {
    await page.close();
    await browser.close();
  }
}

async function verifyQualifiedAnchorStates(origin: string): Promise<void> {
  const cases = [
    { route: "/examples/grid/app-panels.html", selector: "a.pc-sequence-link", decoration: "none", label: "page sequence button" },
    { route: "/demo/components/application-layout.html", selector: ".pc-content a.bf-side-navigation-link", decoration: "none", label: "side-navigation link" },
    { route: "/demo/components/top-navigation.html", selector: ".pc-content a.bf-top-navigation-link", decoration: "none", label: "top-navigation link" },
    { route: "/demo/components/article-pagination.html", selector: ".pc-content a.bf-article-pagination-link", decoration: "none", label: "article-pagination link" },
    { route: "/demo/components/content-card.html", selector: ".pc-content a.bf-content-card-main-link", decoration: "none", label: "content-card main link" },
    { route: "/demo/components/in-page-navigation.html", selector: ".pc-content a.bf-in-page-navigation-link", decoration: "none", label: "in-page-navigation link" },
    { route: "/demo/components/table-of-contents.html", selector: ".pc-content a.bf-table-of-contents-link", decoration: "underline", label: "intentional TOC text link" },
    { route: "/demo/components/list-tree.html", selector: ".pc-content a.bf-list-tree-link", decoration: "underline", label: "intentional tree text link" },
    { route: "/demo/components/basic-section.html", selector: ".pc-content a.bf-basic-section-title-link", decoration: "underline", label: "intentional linked heading" }
  ] as const;
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    for (const testCase of cases) {
      await page.goto(`${origin}${testCase.route}`, { waitUntil: "networkidle" });
      await waitForFonts(page);
      const anchor = page.locator(testCase.selector).first();
      await anchor.hover();
      const decoration = await anchor.evaluate(element => getComputedStyle(element).textDecorationLine);
      assert(decoration === testCase.decoration, `Expected ${testCase.label} hover decoration to be ${testCase.decoration}, got ${decoration}.`);
    }
    await page.close();
  } finally {
    await browser.close();
  }
}

async function verifySemanticRoleClassPrecedence(origin: string): Promise<void> {
  const tiers = ["editorial", "documentation", "app", "os"] as const;
  type TierName = typeof tiers[number];
  type TierSource = {
    baselineUnit: number;
    elements: Array<{
      identifier: string;
      fontSize: number;
      lineHeight: number;
      fontWeight: number;
      fontStyle?: string;
    }>;
  };
  const cssPixels = (rem: number) => `${Number((rem * 16).toFixed(5))}px`;
  const expectedByTier = Object.fromEntries(await Promise.all(tiers.map(async tier => {
    const source = JSON.parse(await fs.readFile(path.resolve(`config/tiers/${tier}.json`), "utf8")) as TierSource;
    const role = (name: "h3" | "h6") => {
      const element = source.elements.find(candidate => candidate.identifier === name);
      assert(element, `Expected ${tier} source config to define ${name}.`);
      return {
        fontSize: cssPixels(element.fontSize),
        lineHeight: cssPixels(element.lineHeight * source.baselineUnit),
        fontWeight: String(element.fontWeight),
        fontStyle: element.fontStyle ?? "normal"
      };
    };
    return [tier, { h3: role("h3"), h6: role("h6"), baselinePx: source.baselineUnit * 16 }] as const;
  }))) as Record<TierName, {
    h3: { fontSize: string; lineHeight: string; fontWeight: string; fontStyle: string };
    h6: { fontSize: string; lineHeight: string; fontWeight: string; fontStyle: string };
    baselinePx: number;
  }>;
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1440, height: 960 }
    });

    await page.goto(`${origin}/demo/components/typography.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);
    await page.evaluate(() => {
      const h6Reference = document.createElement("span");
      h6Reference.className = "bf-h6";
      h6Reference.dataset.roleReference = "h6";
      h6Reference.style.cssText = "position:absolute;visibility:hidden";
      const h3Reference = document.createElement("span");
      h3Reference.className = "bf-h3";
      h3Reference.dataset.roleReference = "h3";
      const h6ReferenceProse = document.createElement("div");
      h6ReferenceProse.className = "bf-prose";
      h6ReferenceProse.style.cssText = "position:absolute;visibility:hidden";
      const h6ReferenceTail = document.createElement("span");
      h6ReferenceTail.hidden = true;
      h6ReferenceProse.append(h6Reference, h6ReferenceTail);
      const h3ReferenceProse = document.createElement("div");
      h3ReferenceProse.className = "bf-prose";
      h3ReferenceProse.style.cssText = "position:absolute;visibility:hidden";
      h3ReferenceProse.append(h3Reference);
      document.body.append(h6ReferenceProse, h3ReferenceProse);

      const boundaryCases = ["plain-body", "classed-body", "plain-h3", "classed-h3", "ul", "ol", "blockquote"] as const;
      for (const caseName of boundaryCases) {
        const targets: HTMLElement[] = [];
        for (const attributeName of ["proseBoundary", "proseReference"] as const) {
          let target: HTMLElement;
          if (caseName === "plain-body" || caseName === "classed-body") {
            target = document.createElement("p");
            if (caseName === "classed-body") target.className = "bf-body";
            target.textContent = `${caseName} paragraph`;
          } else if (caseName === "plain-h3" || caseName === "classed-h3") {
            target = document.createElement(caseName === "plain-h3" ? "h3" : "h2");
            if (caseName === "classed-h3") target.className = "bf-h3";
            target.textContent = `${caseName} heading`;
          } else if (caseName === "ul" || caseName === "ol") {
            target = document.createElement(caseName);
            const item = document.createElement("li");
            item.textContent = `${caseName} item`;
            target.append(item);
          } else {
            target = document.createElement("blockquote");
            target.textContent = "Boundary quotation";
          }
          target.dataset[attributeName] = caseName;
          targets.push(target);
        }

        const fixture = document.createElement("div");
        fixture.dataset.proseBoundaryFixture = caseName;
        fixture.style.cssText = "position:absolute;visibility:hidden;inset-block-start:0;inset-inline-start:0;inline-size:var(--bf-measure);pointer-events:none";
        const prose = document.createElement("div");
        prose.className = "bf-prose";
        prose.dataset.proseBoundaryBox = caseName;
        prose.append(targets[0]);
        const following = document.createElement("p");
        following.dataset.proseBoundaryFollowing = caseName;
        const baselineMarker = document.createElement("span");
        baselineMarker.dataset.firstBaselineMarker = caseName;
        baselineMarker.style.cssText = "display:inline-block;block-size:0;inline-size:0;margin:0;padding:0";
        following.append(baselineMarker, document.createTextNode("Following paragraph"));
        fixture.append(prose, following);

        const reference = document.createElement("div");
        reference.className = "bf-prose";
        reference.style.cssText = "position:absolute;visibility:hidden;inset-block-start:0;inset-inline-start:0;inline-size:var(--bf-measure);pointer-events:none";
        reference.append(targets[1]);
        const referenceTail = document.createElement("span");
        referenceTail.hidden = true;
        reference.append(referenceTail);
        document.body.append(fixture, reference);
      }

      const semanticListFixture = document.createElement("div");
      semanticListFixture.dataset.semanticListFixture = "true";
      semanticListFixture.style.cssText = "position:absolute;visibility:hidden;inset-block-start:0;inset-inline-start:0;inline-size:var(--bf-measure);pointer-events:none";
      const paragraphReference = document.createElement("p");
      paragraphReference.dataset.semanticListParagraphReference = "true";
      paragraphReference.textContent = "Paragraph compensation reference";
      const structuralList = document.createElement("ol");
      structuralList.className = "bf-tiered-list-items";
      structuralList.dataset.semanticListStructuralContainer = "true";
      const structuralItem = document.createElement("li");
      structuralItem.className = "bf-tiered-list-item";
      const description = document.createElement("div");
      description.className = "bf-tiered-list-item-description";
      const semanticList = document.createElement("ul");
      semanticList.dataset.semanticListProbe = "true";
      const semanticItem = document.createElement("li");
      semanticItem.textContent = "Semantic list inside a component copy slot";
      semanticList.append(semanticItem);
      description.append(semanticList);
      structuralItem.append(description);
      structuralList.append(structuralItem);
      semanticListFixture.append(paragraphReference, structuralList);
      document.body.append(semanticListFixture);

      const firstBaselineReference = document.createElement("p");
      firstBaselineReference.dataset.firstBaselineReference = "true";
      firstBaselineReference.style.cssText = "position:absolute;visibility:hidden;inset-block-start:0;inset-inline-start:0;margin:0;pointer-events:none";
      const firstBaselineReferenceMarker = document.createElement("span");
      firstBaselineReferenceMarker.dataset.firstBaselineReferenceMarker = "true";
      firstBaselineReferenceMarker.style.cssText = "display:inline-block;block-size:0;inline-size:0;margin:0;padding:0";
      firstBaselineReference.append(firstBaselineReferenceMarker, document.createTextNode("Baseline reference"));
      document.body.append(firstBaselineReference);
    });

    const tierSelect = page.locator("[data-page-chrome-tier-select]");
    await tierSelect.waitFor({ state: "visible" });
    const measuredTierSignatures = new Set<string>();

    for (const tier of tiers) {
      const expected = expectedByTier[tier];
      await tierSelect.selectOption(tier);
      await page.waitForFunction(({ expectedTier, expectedH3Size, expectedH6Size }) => {
        const h3AsH6 = document.querySelector<HTMLElement>('[data-role-probe="h3-as-h6"]');
        const h6AsH3 = document.querySelector<HTMLElement>('[data-role-probe="h6-as-h3"]');
        return document.body.dataset.bfTier === expectedTier &&
          h3AsH6 !== null && getComputedStyle(h3AsH6).fontSize === expectedH6Size &&
          h6AsH3 !== null && getComputedStyle(h6AsH3).fontSize === expectedH3Size;
      }, { expectedTier: tier, expectedH3Size: expected.h3.fontSize, expectedH6Size: expected.h6.fontSize });

      const state = await page.evaluate(() => {
        const h3AsH6 = document.querySelector<HTMLElement>('[data-role-probe="h3-as-h6"]');
        const h6AsH3 = document.querySelector<HTMLElement>('[data-role-probe="h6-as-h3"]');
        const h6Reference = document.querySelector<HTMLElement>('[data-role-reference="h6"]');
        const h3Reference = document.querySelector<HTMLElement>('[data-role-reference="h3"]');
        const firstBaselineReference = document.querySelector<HTMLElement>('[data-first-baseline-reference="true"]');
        const firstBaselineReferenceMarker = document.querySelector<HTMLElement>('[data-first-baseline-reference-marker="true"]');
        const semanticListProbe = document.querySelector<HTMLElement>('[data-semantic-list-probe="true"]');
        const semanticListParagraphReference = document.querySelector<HTMLElement>('[data-semantic-list-paragraph-reference="true"]');
        const semanticListStructuralContainer = document.querySelector<HTMLElement>('[data-semantic-list-structural-container="true"]');
        if (!h3AsH6 || !h6AsH3 || !h6Reference || !h3Reference || !firstBaselineReference || !firstBaselineReferenceMarker || !semanticListProbe || !semanticListParagraphReference || !semanticListStructuralContainer) return null;

        const [h3AsH6Typography, h6AsH3Typography, h6ReferenceTypography, h3ReferenceTypography] = [h3AsH6, h6AsH3, h6Reference, h3Reference]
          .map(element => {
            const styles = getComputedStyle(element);
            return {
              fontFamily: styles.fontFamily,
              fontSize: styles.fontSize,
              fontStyle: styles.fontStyle,
              fontVariantCaps: styles.fontVariantCaps,
              fontWeight: styles.fontWeight,
              letterSpacing: styles.letterSpacing,
              lineHeight: styles.lineHeight,
              marginBottom: styles.marginBottom,
              paddingBottom: styles.paddingBottom,
              paddingTop: styles.paddingTop,
              textTransform: styles.textTransform
            };
          });

        const boundaryCases = ["plain-body", "classed-body", "plain-h3", "classed-h3", "ul", "ol", "blockquote"];
        const proseBoundaries = Object.fromEntries(boundaryCases.map(caseName => {
          const fixture = document.querySelector<HTMLElement>(`[data-prose-boundary-fixture="${caseName}"]`);
          const prose = document.querySelector<HTMLElement>(`[data-prose-boundary-box="${caseName}"]`);
          const target = document.querySelector<HTMLElement>(`[data-prose-boundary="${caseName}"]`);
          const reference = document.querySelector<HTMLElement>(`[data-prose-reference="${caseName}"]`);
          const baselineMarker = document.querySelector<HTMLElement>(`[data-first-baseline-marker="${caseName}"]`);
          if (!fixture || !prose || !target || !reference || !baselineMarker) return [caseName, null];
          const styles = getComputedStyle(target);
          const referenceStyles = getComputedStyle(reference);
          const targetRect = target.getBoundingClientRect();
          const referenceRect = reference.getBoundingClientRect();
          const fixtureRect = fixture.getBoundingClientRect();
          const proseRect = prose.getBoundingClientRect();
          const baselineMarkerRect = baselineMarker.getBoundingClientRect();
          return [caseName, {
            marginBottom: styles.marginBottom,
            paddingBottom: styles.paddingBottom,
            paddingTop: styles.paddingTop,
            fontSize: styles.fontSize,
            fontStyle: styles.fontStyle,
            fontWeight: styles.fontWeight,
            lineHeight: styles.lineHeight,
            height: targetRect.height,
            width: targetRect.width,
            referenceMarginBottom: referenceStyles.marginBottom,
            referencePaddingBottom: referenceStyles.paddingBottom,
            referencePaddingTop: referenceStyles.paddingTop,
            referenceHeight: referenceRect.height,
            proseBottomOffset: proseRect.bottom - fixtureRect.top,
            followingBaselineOffset: baselineMarkerRect.bottom - fixtureRect.top
          }];
        }));

        return {
          tier: document.body.dataset.bfTier,
          h3AsH6: h3AsH6Typography,
          h6AsH3: h6AsH3Typography,
          h6Reference: h6ReferenceTypography,
          h3Reference: h3ReferenceTypography,
          firstBaselinePhase: firstBaselineReferenceMarker.getBoundingClientRect().bottom - firstBaselineReference.getBoundingClientRect().top,
          semanticListSpacing: {
            listMarginBottom: getComputedStyle(semanticListProbe).marginBottom,
            paragraphMarginBottom: getComputedStyle(semanticListParagraphReference).marginBottom,
            structuralListMarginBottom: getComputedStyle(semanticListStructuralContainer).marginBottom
          },
          proseBoundaries
        };
      });

      assert(state, `Expected reciprocal semantic/visual typography probes in ${tier}.`);
      assert(state.tier === tier, `Expected reciprocal typography probes to switch to ${tier}, got ${state.tier}.`);
      assert(JSON.stringify(state.h3AsH6) === JSON.stringify(state.h6Reference), `Expected ${tier} h3.bf-h6 inside .bf-prose to resolve every measured H6 role property. Probe=${JSON.stringify(state.h3AsH6)}, reference=${JSON.stringify(state.h6Reference)}.`);
      assert(JSON.stringify(state.h6AsH3) === JSON.stringify(state.h3Reference), `Expected ${tier} h6.bf-h3 inside .bf-prose to resolve every measured H3 role property. Probe=${JSON.stringify(state.h6AsH3)}, reference=${JSON.stringify(state.h3Reference)}.`);
      assert(state.semanticListSpacing.listMarginBottom === "0px", `Expected ${tier} semantic list containers not to add external semantic space, got ${state.semanticListSpacing.listMarginBottom}.`);
      assert(state.semanticListSpacing.paragraphMarginBottom !== "0px", `Expected ${tier} paragraph roles to retain non-semantic bottom-margin compensation.`);
      assert(state.semanticListSpacing.structuralListMarginBottom === "0px", `Expected ${tier} structural component lists to retain their explicit zero-margin reset, got ${state.semanticListSpacing.structuralListMarginBottom}.`);
      for (const [property, expectedValue] of Object.entries(expected.h6)) {
        assert(state.h3AsH6[property as keyof typeof state.h3AsH6] === expectedValue, `Expected ${tier} h3.bf-h6 ${property} to resolve to concrete H6 value ${expectedValue}, got ${state.h3AsH6[property as keyof typeof state.h3AsH6]}.`);
      }
      for (const [property, expectedValue] of Object.entries(expected.h3)) {
        assert(state.h6AsH3[property as keyof typeof state.h6AsH3] === expectedValue, `Expected ${tier} h6.bf-h3 ${property} to resolve to concrete H3 value ${expectedValue}, got ${state.h6AsH3[property as keyof typeof state.h6AsH3]}.`);
      }
      const boundaryCaseNames = ["plain-body", "classed-body", "plain-h3", "classed-h3", "ul", "ol", "blockquote"] as const;
      const renderedGridTolerancePx = 0.75;
      const gridDelta = (value: number) => {
        const remainder = ((value % expected.baselinePx) + expected.baselinePx) % expected.baselinePx;
        return Math.min(remainder, expected.baselinePx - remainder);
      };
      for (const caseName of boundaryCaseNames) {
        const boundary = state.proseBoundaries[caseName];
        assert(boundary, `Expected ${tier} ${caseName} prose-boundary fixture.`);
        assert(boundary.marginBottom === boundary.referenceMarginBottom, `Expected ${tier} ${caseName} flow boundaries to preserve baseline compensation. Boundary=${boundary.marginBottom}, reference=${boundary.referenceMarginBottom}.`);
        if (caseName === "ul" || caseName === "ol") {
          assert(boundary.marginBottom === "0px", `Expected ${tier} semantic list containers to remain externally neutral, got ${boundary.marginBottom}.`);
        } else if (["plain-body", "classed-body", "plain-h3", "classed-h3", "blockquote"].includes(caseName)) {
          assert(boundary.referenceMarginBottom !== "0px", `Expected ${tier} ${caseName} to retain measurable bottom-margin compensation.`);
        }
        assert(boundary.paddingBottom === "0px" && boundary.referencePaddingBottom === "0px", `Expected ${tier} ${caseName} to move end compensation out of padding. Boundary=${boundary.paddingBottom}, reference=${boundary.referencePaddingBottom}.`);
        assert(boundary.paddingTop === boundary.referencePaddingTop, `Expected ${tier} ${caseName} flow boundaries to preserve padding-top ${boundary.referencePaddingTop}, got ${boundary.paddingTop}.`);
        assert(Math.abs(boundary.height - boundary.referenceHeight) <= 0.01, `Expected ${tier} ${caseName} flow boundaries to preserve the occupied element box. Boundary=${boundary.height}, reference=${boundary.referenceHeight}.`);
        assert(gridDelta(boundary.proseBottomOffset) <= renderedGridTolerancePx, `Expected ${tier} ${caseName} prose bottom edge on the ${expected.baselinePx}px grid, offset=${boundary.proseBottomOffset}.`);
        assert(gridDelta(boundary.followingBaselineOffset - state.firstBaselinePhase) <= renderedGridTolerancePx, `Expected ${tier} ${caseName} following first baseline to retain the tier's ${expected.baselinePx}px grid phase. Offset=${boundary.followingBaselineOffset}, phase=${state.firstBaselinePhase}.`);
      }

      for (const [plainName, classedName] of [["plain-body", "classed-body"], ["plain-h3", "classed-h3"]] as const) {
        const plain = state.proseBoundaries[plainName];
        const classed = state.proseBoundaries[classedName];
        assert(plain && classed, `Expected ${tier} ${plainName}/${classedName} boundary pair.`);
        const measuredBox = (boundary: typeof plain) => ({
          marginBottom: boundary.marginBottom,
          paddingBottom: boundary.paddingBottom,
          paddingTop: boundary.paddingTop,
          fontSize: boundary.fontSize,
          fontStyle: boundary.fontStyle,
          fontWeight: boundary.fontWeight,
          lineHeight: boundary.lineHeight,
          height: boundary.height,
          width: boundary.width
        });
        assert(JSON.stringify(measuredBox(plain)) === JSON.stringify(measuredBox(classed)), `Expected ${tier} ${plainName}/${classedName} to occupy identical measured boxes. Plain=${JSON.stringify(measuredBox(plain))}, classed=${JSON.stringify(measuredBox(classed))}.`);
      }
      measuredTierSignatures.add(`${state.h6AsH3.fontSize}/${state.h6AsH3.fontWeight}/${state.h3AsH6.fontSize}/${state.h3AsH6.fontWeight}/${expected.baselinePx}`);
    }

    assert(measuredTierSignatures.size === tiers.length, `Expected four distinct computed typography signatures, got ${measuredTierSignatures.size}: ${Array.from(measuredTierSignatures).join(", ")}.`);

    await page.close();
  } finally {
    await browser.close();
  }
}

async function verifyContainerOwnedSpacing(origin: string): Promise<void> {
  const tiers = ["editorial", "documentation", "app", "os"] as const;
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
    await page.goto(`${origin}/demo/components/typography.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);

    const tierSelect = page.locator("[data-page-chrome-tier-select]");
    await tierSelect.waitFor({ state: "visible" });

    for (const tier of tiers) {
      await tierSelect.selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);

      const state = await page.evaluate(() => {
        const fixture = document.createElement("div");
        fixture.style.cssText = "position:absolute;visibility:hidden;inset:0;inline-size:20rem;pointer-events:none";

        const internalStack = document.createElement("div");
        internalStack.className = "bf-stack";
        const sectionStack = document.createElement("div");
        sectionStack.className = "bf-stack is-section";
        const densityStacks = [
          "is-flush",
          "is-extra-dense",
          "is-dense",
          "is-loose",
          "is-section-shallow",
          "is-section-deep"
        ].map(modifier => {
          const stack = document.createElement("div");
          stack.className = `bf-stack ${modifier}`;
          stack.append(document.createElement("span"), document.createElement("span"));
          return { modifier, stack };
        });

        const internalFirst = document.createElement("p");
        internalFirst.textContent = "First baseline-aligned item";
        const internalSecond = document.createElement("p");
        internalSecond.textContent = "Second baseline-aligned item";
        internalStack.append(internalFirst, internalSecond);
        const sectionFirst = document.createElement("p");
        sectionFirst.textContent = "First section";
        const sectionSecond = document.createElement("p");
        sectionSecond.textContent = "Second section";
        sectionStack.append(sectionFirst, sectionSecond);

        const basicLayout = document.createElement("div");
        basicLayout.className = "bf-basic-section-layout bf-stack";
        const rule = document.createElement("hr");
        rule.className = "bf-basic-section-rule";
        const basicHeader = document.createElement("header");
        basicHeader.className = "bf-basic-section-header";
        const basicTitle = document.createElement("h2");
        basicTitle.textContent = "Rule-adjacent heading";
        basicHeader.append(basicTitle);
        basicLayout.append(rule, basicHeader);

        const chipStack = document.createElement("div");
        chipStack.className = "bf-stack";
        const chip = document.createElement("span");
        chip.className = "bf-chip";
        chip.textContent = "Content-sized chip";
        chipStack.append(chip);

        fixture.append(internalStack, sectionStack, ...densityStacks.map(({ stack }) => stack), basicLayout, chipStack);
        document.body.append(fixture);

        const firstStylesBefore = getComputedStyle(internalFirst);
        const before = {
          internalGap: Number.parseFloat(getComputedStyle(internalStack).rowGap),
          sectionGap: Number.parseFloat(getComputedStyle(sectionStack).rowGap),
          firstToSecond: internalSecond.getBoundingClientRect().top - internalFirst.getBoundingClientRect().bottom,
          paddingTop: Number.parseFloat(firstStylesBefore.paddingTop),
          paddingBottom: Number.parseFloat(firstStylesBefore.paddingBottom),
          marginBottom: Number.parseFloat(firstStylesBefore.marginBottom),
          baseline: Number.parseFloat(getComputedStyle(document.body).getPropertyValue("--bf-baseline")) * 16
        };
        internalFirst.style.setProperty("--bf-body-space-after", "99rem");
        const firstStylesAfter = getComputedStyle(internalFirst);
        const after = {
          internalGap: Number.parseFloat(getComputedStyle(internalStack).rowGap),
          sectionGap: Number.parseFloat(getComputedStyle(sectionStack).rowGap),
          firstToSecond: internalSecond.getBoundingClientRect().top - internalFirst.getBoundingClientRect().bottom,
          paddingTop: Number.parseFloat(firstStylesAfter.paddingTop),
          paddingBottom: Number.parseFloat(firstStylesAfter.paddingBottom),
          marginBottom: Number.parseFloat(firstStylesAfter.marginBottom),
          baseline: Number.parseFloat(getComputedStyle(document.body).getPropertyValue("--bf-baseline")) * 16
        };
        const ruleRect = rule.getBoundingClientRect();
        const headerRect = basicHeader.getBoundingClientRect();
        const chipRect = chip.getBoundingClientRect();
        const chipStackRect = chipStack.getBoundingClientRect();
        const regressions = {
          basicRowGap: Number.parseFloat(getComputedStyle(basicLayout).rowGap),
          ruleMarginBottom: Number.parseFloat(getComputedStyle(rule).marginBottom),
          ruleToHeader: headerRect.top - ruleRect.bottom,
          chipWidth: chipRect.width,
          chipStackWidth: chipStackRect.width,
          chipJustifySelf: getComputedStyle(chip).justifySelf
        };
        const densityGaps = Object.fromEntries(
          densityStacks.map(({ modifier, stack }) => [modifier, Number.parseFloat(getComputedStyle(stack).rowGap)])
        );
        fixture.remove();
        return { before, after, regressions, densityGaps };
      });

      const tolerance = 0.1;
      assert(state.before.internalGap > 0, `Expected ${tier} default bf-stack to own a positive internal gap.`);
      assert(state.before.sectionGap > state.before.internalGap, `Expected ${tier} bf-stack.is-section gap (${state.before.sectionGap}px) to exceed the internal gap (${state.before.internalGap}px).`);
      assert(Math.abs(state.before.firstToSecond - (state.before.internalGap + state.before.marginBottom)) <= tolerance, `Expected ${tier} adjacent stack geometry to comprise the container gap plus baseline-compensation margin.`);
      assert(state.before.paddingBottom === 0, `Expected ${tier} text roles to retain zero padding-block-end, got ${state.before.paddingBottom}px.`);
      assert(Math.abs(state.before.paddingTop + state.before.marginBottom - state.before.baseline) <= tolerance, `Expected ${tier} top nudge plus bottom-margin compensation to equal one ${state.before.baseline}px baseline unit.`);
      assert(JSON.stringify(state.after) === JSON.stringify(state.before), `Expected ${tier} legacy --bf-body-space-after overrides not to affect production geometry. Before=${JSON.stringify(state.before)}, after=${JSON.stringify(state.after)}.`);
      assert(state.regressions.basicRowGap === 0, `Expected ${tier} bf-basic-section-layout to suppress the generic stack row gap, got ${state.regressions.basicRowGap}px.`);
      assert(Math.abs(state.regressions.ruleToHeader - state.regressions.ruleMarginBottom) <= tolerance, `Expected ${tier} basic-section text to follow only the rule's own trailing compensation. Distance=${state.regressions.ruleToHeader}px, margin=${state.regressions.ruleMarginBottom}px.`);
      assert(state.regressions.chipWidth < state.regressions.chipStackWidth, `Expected ${tier} chip grid items to hug content. Chip=${state.regressions.chipWidth}px, stack=${state.regressions.chipStackWidth}px.`);
      assert(state.regressions.chipJustifySelf === "start", `Expected ${tier} chips to opt out of grid-item stretch, got justify-self=${state.regressions.chipJustifySelf}.`);
      assert(state.densityGaps["is-flush"] === 0, `Expected ${tier} flush stacks to use a zero gap.`);
      assert(Math.abs(state.densityGaps["is-extra-dense"] - state.before.baseline / 2) <= tolerance, `Expected ${tier} extra-dense stacks to use half a baseline.`);
      assert(Math.abs(state.densityGaps["is-dense"] - state.before.baseline) <= tolerance, `Expected ${tier} dense stacks to use one baseline.`);
      assert(Math.abs(state.densityGaps["is-loose"] - state.before.baseline * 2) <= tolerance, `Expected ${tier} loose stacks to use two baselines.`);
      assert(Math.abs(state.densityGaps["is-section-shallow"] - state.before.internalGap) <= tolerance, `Expected ${tier} explicit shallow stacks to match the default pattern gap.`);
      assert(state.densityGaps["is-section-deep"] > state.before.sectionGap, `Expected ${tier} deep section stacks to exceed the regular section gap.`);

      if (tier === "editorial") {
        assert(Math.abs(state.before.internalGap - 24) <= tolerance, `Expected Sites/editorial internal stacks to resolve to 1.5rem (24px), got ${state.before.internalGap}px.`);
        assert(Math.abs(state.before.sectionGap - 64) <= tolerance, `Expected Sites/editorial section stacks to resolve to 4rem (64px), got ${state.before.sectionGap}px.`);
        assert(Math.abs(state.densityGaps["is-section-deep"] - 128) <= tolerance, `Expected Sites/editorial deep section stacks to resolve to 8rem (128px), got ${state.densityGaps["is-section-deep"]}px.`);
      }
    }

    await page.close();
  } finally {
    await browser.close();
  }
}

async function verifySharedReadableSplitThresholds(origin: string): Promise<void> {
  const browser = await openBrowser();
  const tiers = ["editorial", "documentation", "app", "os"] as const;
  const cases = [
    { route: "basic-section.html", root: ".bf-basic-section", layout: ".bf-basic-section-layout", expandedColumns: 2 },
    { route: "divided-section.html", root: ".bf-divided-section", layout: ".bf-divided-section-layout", expandedColumns: 2 },
    { route: "tiered-list.html", root: ".bf-tiered-list:not(.is-description-full-width)", layout: ".bf-tiered-list-header", expandedColumns: 2 },
    { route: "rich-list-horizontal.html", root: ".bf-rich-list.is-horizontal.is-50-50", layout: ".bf-rich-list-layout", expandedColumns: 2 },
    { route: "rich-list-vertical.html", root: ".bf-rich-list.is-vertical", layout: ".bf-rich-list-layout", expandedColumns: 2 },
    { route: "tab-section.html", root: ".bf-tab-section", layout: ".bf-tab-section-body", expandedColumns: 4 },
    { route: "linked-logo-section.html", root: ".bf-linked-logo-section.is-50-50", layout: ".bf-linked-logo-section-layout", expandedColumns: 2 }
  ] as const;

  try {
    const page = await browser.newPage({ deviceScaleFactor: 1, viewport: { width: 1600, height: 1200 } });
    for (const testCase of cases) {
      await page.goto(`${origin}/demo/components/${testCase.route}`, { waitUntil: "networkidle" });
      await waitForFonts(page);
      for (const tier of tiers) {
        await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
        await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
        for (const allocation of [
          { width: "47.9375rem", columns: 1, label: "below 48rem" },
          { width: "48rem", columns: testCase.expandedColumns, label: "at 48rem" }
        ]) {
          const state = await page.locator(testCase.root).first().evaluate((root, expected) => {
            const pattern = root as HTMLElement;
            pattern.style.inlineSize = expected.width;
            const layout = pattern.querySelector<HTMLElement>(expected.layout);
            return layout ? {
              columns: getComputedStyle(layout).gridTemplateColumns.split(/\s+/).filter(Boolean).length,
              overflow: pattern.scrollWidth - pattern.clientWidth
            } : null;
          }, { width: allocation.width, layout: testCase.layout });
          assert(state !== null && state.columns === allocation.columns && state.overflow <= 1, `Expected ${tier} ${testCase.route} to use ${allocation.columns} column(s) ${allocation.label} without overflow; got ${JSON.stringify(state)}.`);
        }
      }
    }
    await page.close();
  } finally {
    await browser.close();
  }
}

async function verifyRenewalCompositionContracts(origin: string): Promise<void> {
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });

    await page.goto(`${origin}/demo/components/article-pagination.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const paginationGeometry = await page.evaluate(() => {
      const nav = document.querySelector<HTMLElement>(".article-pagination-demo-narrow .bf-article-pagination");
      const links = Array.from(nav?.querySelectorAll<HTMLElement>(".bf-article-pagination-link") ?? []);
      const rtlPrevious = document.querySelector<HTMLElement>("[dir='rtl'] .bf-article-pagination-link.is-previous");
      const ltrPrevious = document.querySelector<HTMLElement>(".bf-article-pagination-link.is-previous");
      const rtlPreviousIcon = rtlPrevious?.querySelector<HTMLElement>(".bf-icon");
      const ltrPreviousIcon = ltrPrevious?.querySelector<HTMLElement>(".bf-icon");
      if (!nav || links.length !== 2 || !rtlPreviousIcon || !ltrPreviousIcon) {
        return null;
      }

      const navRect = nav.getBoundingClientRect();
      const linkRects = links.map(link => link.getBoundingClientRect());
      const previousLabel = links[0]?.querySelector<HTMLElement>(".bf-article-pagination-label")?.getBoundingClientRect();
      return {
        navWidth: navRect.width,
        linkWidths: linkRects.map(rect => rect.width),
        linkTops: linkRects.map(rect => rect.top),
        previousLabelWidth: previousLabel?.width ?? 0,
        ltrPreviousTransform: getComputedStyle(ltrPreviousIcon).transform,
        rtlPreviousTransform: getComputedStyle(rtlPreviousIcon).transform
      };
    });
    assert(paginationGeometry, "Expected narrow and RTL article-pagination fixtures.");
    assert(Math.abs(paginationGeometry.linkTops[1] - paginationGeometry.linkTops[0]) <= 1, "Expected narrow article destinations to remain on the same row.");
    assert(paginationGeometry.linkWidths[0] < paginationGeometry.linkWidths[1] && Math.abs((paginationGeometry.linkWidths[0] + paginationGeometry.linkWidths[1]) - paginationGeometry.navWidth) <= 1, "Expected the narrow pair to use Vanilla's compact previous link and the remaining width for next.");
    assert(paginationGeometry.previousLabelWidth <= 1.1, "Expected narrow previous copy to be visually compact while remaining in the accessibility tree.");
    assert(paginationGeometry.ltrPreviousTransform !== paginationGeometry.rtlPreviousTransform, "Expected the previous arrow to reverse visually in RTL.");
    const previousAria = await page.locator(".article-pagination-demo-narrow .bf-article-pagination-link.is-previous").ariaSnapshot();
    assert(previousAria.includes("Previous") && previousAria.includes("Configure the workspace"), `Expected compact previous copy to remain in the accessible link name. Snapshot: ${previousAria}`);
    assert(!/[←→]/.test(previousAria), `Expected decorative arrows to stay out of the accessible link name. Snapshot: ${previousAria}`);

    for (const tier of ["editorial", "documentation", "app", "os"] as const) {
      await page.goto(`${origin}/demo/components/article-pagination.html`, { waitUntil: "networkidle" });
      await waitForFonts(page);
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      const paginationIcon = await page.evaluate(() => {
        const link = document.querySelector<HTMLElement>(".bf-article-pagination-link.is-previous");
        const direction = link?.querySelector<HTMLElement>(".bf-article-pagination-direction");
        const icon = direction?.querySelector<HTMLElement>(".bf-icon");
        const label = direction?.querySelector<HTMLElement>(".bf-article-pagination-label");
        const title = link?.querySelector<HTMLElement>(".bf-article-pagination-title");
        const h5Reference = document.querySelector<HTMLElement>(".bf-h5");
        const rtlLink = document.querySelector<HTMLElement>("[dir='rtl'] .bf-article-pagination-link.is-previous");
        const rtlIcon = rtlLink?.querySelector<HTMLElement>(".bf-icon");
        const rtlLabel = rtlLink?.querySelector<HTMLElement>(".bf-article-pagination-label");
        if (!link || !direction || !icon || !label || !title || !h5Reference || !rtlIcon || !rtlLabel) return null;

        link.focus();
        const iconRect = icon.getBoundingClientRect();
        const labelRect = label.getBoundingClientRect();
        const titleRect = title.getBoundingClientRect();
        const rtlIconRect = rtlIcon.getBoundingClientRect();
        const rtlLabelRect = rtlLabel.getBoundingClientRect();
        const iconStyles = getComputedStyle(icon);
        const linkStyles = getComputedStyle(link);
        const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
        const baselinePx = Number.parseFloat(linkStyles.getPropertyValue("--bf-baseline")) * rootFontSize;
        return {
          tier: document.body.dataset.bfTier,
          iconHeight: iconRect.height,
          iconWidth: iconRect.width,
          iconToLabelGap: labelRect.left - iconRect.right,
          iconLabelCentreDelta: Math.abs((iconRect.top + (iconRect.height / 2)) - (labelRect.top + (labelRect.height / 2))),
          iconSize: iconStyles.getPropertyValue("--bf-icon-size").trim(),
          iconDefaultSize: iconStyles.getPropertyValue("--bf-icon-size-default").trim(),
          expectedMediumGap: baselinePx * 2,
          textEdgeDelta: Math.abs(labelRect.left - titleRect.left),
          titleFontSize: getComputedStyle(title).fontSize,
          h5FontSize: getComputedStyle(h5Reference).fontSize,
          outlineStyle: linkStyles.outlineStyle,
          focused: document.activeElement === link,
          rtlIconIsLogicalLeading: rtlIconRect.left > rtlLabelRect.right,
          rtlTransform: getComputedStyle(rtlIcon).transform
        };
      });
      assert(paginationIcon, `Expected article-pagination icon fixture for ${tier}.`);
      assert(paginationIcon.tier === tier, `Expected article-pagination fixture to use ${tier}, got ${paginationIcon.tier}.`);
      assert(paginationIcon.iconSize === paginationIcon.iconDefaultSize, `Expected ${tier} article-pagination to resolve to the public default icon size.`);
      assert(Math.abs(paginationIcon.iconToLabelGap - paginationIcon.expectedMediumGap) <= 0.1, `Expected ${tier} article-pagination icon/copy separation to map Vanilla medium spacing, got ${paginationIcon.iconToLabelGap}px.`);
      assert(paginationIcon.textEdgeDelta <= 0.1, `Expected ${tier} article-pagination direction and title text edges to align, got ${paginationIcon.textEdgeDelta}px.`);
      assert(paginationIcon.titleFontSize === paginationIcon.h5FontSize, `Expected ${tier} article-pagination title to use the BF h5 role.`);
      assert(paginationIcon.focused && paginationIcon.outlineStyle === "solid", `Expected ${tier} article-pagination focus to remain visible.`);
      assert(paginationIcon.rtlIconIsLogicalLeading && paginationIcon.rtlTransform !== "none", `Expected ${tier} previous icon to stay logical in RTL.`);

      await page.goto(`${origin}/demo/components/button.html`, { waitUntil: "networkidle" });
      await waitForFonts(page);
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      const buttonIcon = await page.evaluate(() => {
        const button = Array.from(document.querySelectorAll<HTMLElement>(".bf-button.is-icon"))
          .find(candidate => candidate.textContent?.includes("Continue"));
        const icon = button?.querySelector<HTMLElement>(".bf-icon");
        const label = button?.querySelector<HTMLElement>(".bf-button-label");
        if (!button || !icon || !label) return null;

        const textRect = label.getBoundingClientRect();
        const iconRect = icon.getBoundingClientRect();
        return {
          iconHeight: iconRect.height,
          iconWidth: iconRect.width,
          textToIconGap: iconRect.left - textRect.right,
          iconSize: getComputedStyle(icon).getPropertyValue("--bf-icon-size").trim()
        };
      });
      assert(buttonIcon, `Expected button-with-icon fixture for ${tier}.`);
      assert(buttonIcon.iconSize === paginationIcon.iconSize, `Expected ${tier} button-with-icon and article-pagination to resolve the same icon-size token.`);
      assert(Math.abs(paginationIcon.iconWidth - buttonIcon.iconWidth) <= 0.1 && Math.abs(paginationIcon.iconHeight - buttonIcon.iconHeight) <= 0.1, `Expected ${tier} article-pagination icon size to match button-with-icon.`);
      assert(paginationIcon.iconLabelCentreDelta <= 0.1, `Expected ${tier} article-pagination icon and direction label to be vertically aligned, got ${paginationIcon.iconLabelCentreDelta}px.`);
    }

    await page.setViewportSize({ width: 1000, height: 1000 });
    await page.goto(`${origin}/demo/components/docs-layout.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const drawerLayout = await page.evaluate(() => {
      const navigation = document.querySelector<HTMLElement>(".bf-docs-layout-navigation");
      const content = document.querySelector<HTMLElement>(".bf-docs-layout-content");
      const toggle = document.querySelector<HTMLElement>(".bf-side-navigation-toggle");
      if (!navigation || !content || !toggle) return null;
      const navigationRect = navigation.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      return {
        navigationWidth: navigationRect.width,
        contentWidth: contentRect.width,
        navigationTop: navigationRect.top,
        contentTop: contentRect.top,
        toggleDisplay: getComputedStyle(toggle).display
      };
    });
    assert(drawerLayout, "Expected docs drawer-mode geometry.");
    assert(Math.abs(drawerLayout.navigationWidth - drawerLayout.contentWidth) <= 1, "Expected docs navigation and content to stay full-width while navigation is a drawer.");
    assert(drawerLayout.contentTop > drawerLayout.navigationTop, "Expected drawer-mode docs content to follow the navigation slot in one column.");
    assert(drawerLayout.toggleDisplay !== "none", "Expected docs drawer toggle to remain available below the desktop breakpoint.");

    await page.setViewportSize({ width: 1100, height: 1000 });
    await page.reload({ waitUntil: "networkidle" });
    await waitForFonts(page);
    const desktopLayout = await page.evaluate(() => {
      const navigation = document.querySelector<HTMLElement>(".bf-docs-layout-navigation");
      const content = document.querySelector<HTMLElement>(".bf-docs-layout-content");
      const toggle = document.querySelector<HTMLElement>(".bf-side-navigation-toggle");
      if (!navigation || !content || !toggle) return null;
      const navigationRect = navigation.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      return {
        navigationWidth: navigationRect.width,
        contentWidth: contentRect.width,
        navigationTop: navigationRect.top,
        contentTop: contentRect.top,
        toggleDisplay: getComputedStyle(toggle).display
      };
    });
    assert(desktopLayout, "Expected docs desktop geometry.");
    assert(desktopLayout.contentWidth > desktopLayout.navigationWidth * 2, "Expected docs desktop content to occupy the six-column region beside the two-column navigation.");
    assert(Math.abs(desktopLayout.contentTop - desktopLayout.navigationTop) <= 1, "Expected docs desktop navigation and content to share a row.");
    assert(desktopLayout.toggleDisplay === "none", "Expected the drawer toggle to disappear when the static desktop navigation is active.");

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${origin}/demo/components/search-and-filter.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const wideControlBottoms = await page.locator(".bf-control-row > *").evaluateAll(elements => elements.map(element => {
      const rect = element.getBoundingClientRect();
      const marginEnd = Number.parseFloat(getComputedStyle(element).marginBlockEnd) || 0;
      return rect.bottom + marginEnd;
    }));
    assert(Math.max(...wideControlBottoms) - Math.min(...wideControlBottoms) <= 1, "Expected wide control-row children to align on their occupied bottom edge.");

    await page.setViewportSize({ width: 620, height: 1000 });
    await page.reload({ waitUntil: "networkidle" });
    await waitForFonts(page);
    const narrowControlTops = await page.locator(".bf-control-row > *").evaluateAll(elements => elements.map(element => element.getBoundingClientRect().top));
    assert(narrowControlTops.length === 3 && new Set(narrowControlTops.map(top => Math.round(top))).size > 1, "Expected narrow control-row children to wrap across more than one row.");

    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const route of ["/demo/components/narrow-panel.html", "/demo/components/search-and-filter.html"] as const) {
      await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
      await waitForFonts(page);
      for (const tier of ["editorial", "documentation", "app", "os"] as const) {
        await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
        await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
        const searchGeometry = await page.evaluate(() => {
          const boxes = Array.from(document.querySelectorAll<HTMLElement>(".bf-search-box, .bf-search-and-filter-box"));
          const expandedRoot = document.querySelector<HTMLElement>(".bf-search-and-filter:has(.bf-search-and-filter-panel[aria-hidden='false'])");
          const expandedBox = expandedRoot?.querySelector<HTMLElement>(".bf-search-and-filter-box");
          const expandedPanel = expandedRoot?.querySelector<HTMLElement>(".bf-search-and-filter-panel");
          const collapsedContainer = document.querySelector<HTMLElement>(".bf-search-and-filter-search-container[aria-expanded='false']");
          const heading = expandedRoot?.querySelector<HTMLElement>(".bf-filter-panel-section-heading");
          const canonicalHeading = heading ? document.createElement("h5") : null;
          if (canonicalHeading) {
            canonicalHeading.className = "bf-h5";
            canonicalHeading.style.cssText = "position:absolute;visibility:hidden";
            document.body.append(canonicalHeading);
          }
          const contractValues = Object.fromEntries([
            "--bf-interface-row-occupied-block-size",
            "--bf-interface-row-painted-block-size"
          ].map(property => {
            const probe = document.createElement("i");
            probe.style.cssText = "display:block;inset:0;position:fixed;visibility:hidden";
            probe.style.blockSize = `var(${property})`;
            document.body.appendChild(probe);
            const value = probe.getBoundingClientRect().height;
            probe.remove();
            return [property, value];
          }));
          const typeProperties = ["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "textTransform", "color"] as const;
          const result = {
            boxes: boxes.map(box => {
              const rect = box.getBoundingClientRect();
              return Array.from(box.querySelectorAll<HTMLElement>("button")).map(button => {
                const buttonRect = button.getBoundingClientRect();
                return { top: buttonRect.top - rect.top, bottom: buttonRect.bottom - rect.bottom, heightDelta: buttonRect.height - rect.height };
              });
            }),
            collapsed: collapsedContainer ? {
              height: collapsedContainer.getBoundingClientRect().height,
              marginEnd: Number.parseFloat(getComputedStyle(collapsedContainer).marginBlockEnd),
              occupied: contractValues["--bf-interface-row-occupied-block-size"],
              painted: contractValues["--bf-interface-row-painted-block-size"]
            } : null,
            panelOverlap: expandedBox && expandedPanel ? expandedBox.getBoundingClientRect().bottom - expandedPanel.getBoundingClientRect().top : null,
            headingTypeMatches: heading && canonicalHeading
              ? typeProperties.every(property => getComputedStyle(heading)[property] === getComputedStyle(canonicalHeading)[property])
              : null
          };
          canonicalHeading?.remove();
          return result;
        });
        assert(searchGeometry.boxes.flat().every(button => Math.abs(button.top) <= 0.1 && Math.abs(button.bottom) <= 0.1 && Math.abs(button.heightDelta) <= 0.1), `Expected ${tier} search actions on ${route} to stay inside the occupied input block: ${JSON.stringify(searchGeometry.boxes)}.`);
        if (route.endsWith("search-and-filter.html")) {
          assert(searchGeometry.collapsed && Math.abs(searchGeometry.collapsed.height - searchGeometry.collapsed.painted) <= 0.05 && Math.abs(searchGeometry.collapsed.height + searchGeometry.collapsed.marginEnd - searchGeometry.collapsed.occupied) <= 0.05, `Expected ${tier} collapsed search-and-filter to count its external row compensation exactly once: ${JSON.stringify(searchGeometry.collapsed)}.`);
          assert(searchGeometry.panelOverlap !== null && searchGeometry.panelOverlap <= 0.1, `Expected ${tier} search actions not to overlap the expanded filter panel; overlap=${searchGeometry.panelOverlap}.`);
          assert(searchGeometry.headingTypeMatches, `Expected ${tier} filter section headings to resolve exactly like the canonical bf-h5 role.`);
        }
      }
    }

    for (const [tier, title] of [["editorial", "Editorial"], ["documentation", "Documentation"], ["app", "App"], ["os", "OS"]] as const) {
      await page.goto(`${origin}/demo/tiers/${tier}.html`, { waitUntil: "networkidle" });
      await waitForFonts(page);
      const tierReferenceState = await page.evaluate(() => ({
        activeTier: document.body.dataset.bfTier,
        heading: document.querySelector("main h1")?.textContent?.trim(),
        section: document.querySelector(".pc-breadcrumbs .bf-breadcrumbs-item:first-child")?.textContent?.trim(),
        selectedTier: (document.querySelector("[data-page-chrome-tier-select]") as HTMLSelectElement | null)?.value,
        overflow: (() => {
          const main = document.querySelector<HTMLElement>("main");
          return main ? main.scrollWidth - main.clientWidth : Number.POSITIVE_INFINITY;
        })()
      }));
      assert(tierReferenceState.activeTier === tier && tierReferenceState.selectedTier === tier && tierReferenceState.heading === title && tierReferenceState.section === "Tier references" && tierReferenceState.overflow <= 1, `Expected the distinct ${title} tier-reference route to initialize and identify itself without overflow: ${JSON.stringify(tierReferenceState)}.`);
    }

    await page.setViewportSize({ width: 820, height: 800 });
    await page.goto(`${origin}/demo/components/tabs.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tier of ["editorial", "documentation", "app", "os"] as const) {
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      const tabRule = await page.evaluate(() => {
        const list = document.querySelector<HTMLElement>(".bf-tabs-list");
        const active = document.querySelector<HTMLElement>(".bf-tabs-link.is-active, .bf-tabs-link[aria-selected='true']");
        if (!list || !active) return null;
        const styles = getComputedStyle(active);
        return {
          boxShadow: styles.boxShadow,
          gap: Math.abs(list.getBoundingClientRect().bottom - active.getBoundingClientRect().bottom),
          token: styles.getPropertyValue("--bf-bar-thickness").trim()
        };
      });
      assert(tabRule !== null && tabRule.gap <= 1.1, `Expected ${tier} active tab rule to meet the list boundary, got ${tabRule?.gap}px.`);
      assert(tabRule.boxShadow.includes("-3px") && tabRule.boxShadow.includes("inset") && tabRule.token === "0.1875rem", `Expected ${tier} active tab rule to paint the shared inset 3px/0.1875rem emphasis bar; got ${tabRule.boxShadow}/${tabRule.token}.`);
    }

    await page.goto(`${origin}/demo/components/notice.html`, { waitUntil: "networkidle" });
    const noticeSemantics = await page.locator(".bf-notice").evaluateAll(elements => elements.map(element => {
      const styles = getComputedStyle(element);
      return {
        barThickness: Number.parseFloat(styles.borderInlineStartWidth),
        barThicknessToken: styles.getPropertyValue("--bf-bar-thickness").trim(),
        role: element.getAttribute("role"),
        titleTag: element.querySelector(".bf-notice-title")?.tagName ?? null
      };
    }));
    assert(noticeSemantics.length === 5, "Expected all five notice variants in the semantic fixture.");
    assert(noticeSemantics.every(notice => notice.role === "note" && notice.titleTag === "H2"), "Expected static notices to retain note landmarks and semantic h2 titles.");
    assert(noticeSemantics.every(notice => notice.barThickness === 3 && notice.barThicknessToken === "0.1875rem"), "Expected every notice variant to use the shared 3px/0.1875rem emphasis bar.");

    await page.setContent(`<!doctype html><link rel="stylesheet" href="${origin}/dist/tiers/editorial/styles.css"><body class="bf-theme">Scoped reset</body>`);
    await page.waitForFunction(() => Array.from(document.styleSheets).some(sheet => sheet.href?.includes("/dist/tiers/editorial/styles.css")));
    const unscopedMargin = await page.evaluate(() => Number.parseFloat(getComputedStyle(document.body).margin));
    await page.evaluate(() => document.body.classList.add("bf-page-shell"));
    const scopedMargin = await page.evaluate(() => Number.parseFloat(getComputedStyle(document.body).margin));
    assert(unscopedMargin > 0, "Expected a tier import alone to preserve the user-agent body margin.");
    assert(scopedMargin === 0, "Expected the explicit page-shell class to opt into a full-bleed body reset.");
  } finally {
    await browser.close();
  }
}

async function verifyAdversarialResponsiveGeometry(origin: string): Promise<void> {
  const tiers = ["editorial", "documentation", "app", "os"] as const;
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });

    await page.goto(`${origin}/demo/components/article-pagination.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tier of tiers) {
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      const measurements = await page.evaluate((widths) => {
        const nav = document.querySelector<HTMLElement>(".article-pagination-demo-narrow .bf-article-pagination");
        if (!nav) return null;
        const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
        const baselinePx = Number.parseFloat(getComputedStyle(nav).getPropertyValue("--bf-baseline")) * rootFontSize;
        const boundaryNavs = Array.from(document.querySelectorAll<HTMLElement>("[aria-label='First documentation page'], [aria-label='Last documentation page']"));

        const widthsMeasured = widths.map(width => {
          nav.style.inlineSize = `${width}rem`;
          const navRect = nav.getBoundingClientRect();
          const links = Array.from(nav.querySelectorAll<HTMLElement>(".bf-article-pagination-link"));
          const linkRects = links.map(link => link.getBoundingClientRect());
          const visibleTextEdgeDeltas = links.map(link => {
            const labelRect = link.querySelector<HTMLElement>(".bf-article-pagination-label")?.getBoundingClientRect();
            const titleRect = link.querySelector<HTMLElement>(".bf-article-pagination-title")?.getBoundingClientRect();
            if (!labelRect || !titleRect || labelRect.width <= 1.1) return null;
            return link.classList.contains("is-next")
              ? Math.abs(labelRect.right - titleRect.right)
              : Math.abs(labelRect.left - titleRect.left);
          }).filter((delta): delta is number => delta !== null);
          const boundaries = boundaryNavs.map(boundaryNav => {
            boundaryNav.style.inlineSize = `${width}rem`;
            const boundaryNavRect = boundaryNav.getBoundingClientRect();
            const boundaryLink = boundaryNav.querySelector<HTMLElement>(".bf-article-pagination-link");
            const boundaryRect = boundaryLink?.getBoundingClientRect();
            return boundaryRect ? {
              direction: boundaryLink?.classList.contains("is-next") ? "next" : "previous",
              navWidth: boundaryNavRect.width,
              width: boundaryRect.width,
              startOffset: boundaryRect.left - boundaryNavRect.left,
              endOffset: boundaryNavRect.right - boundaryRect.right
            } : null;
          }).filter((boundary): boundary is NonNullable<typeof boundary> => boundary !== null);

          return {
            width,
            navWidth: navRect.width,
            baselinePx,
            columnCount: new Set(linkRects.map(rect => Math.round(rect.left * 10))).size,
            rowCount: new Set(linkRects.map(rect => Math.round(rect.top * 10))).size,
            linkWidths: linkRects.map(rect => rect.width),
            baselineDeltas: linkRects.map(rect => {
              const remainder = rect.height % baselinePx;
              return Math.min(remainder, baselinePx - remainder);
            }),
            expectedGap: width < 28.75 ? 0 : baselinePx * 2,
            visibleTextEdgeDeltas,
            boundaries,
            overflow: Math.max(0, nav.scrollWidth - nav.clientWidth)
          };
        });

        const reversed = nav.cloneNode(true) as HTMLElement;
        reversed.style.cssText = "inline-size: 42rem; position: fixed; inset-block-start: -10000px; inset-inline-start: 0; visibility: hidden;";
        if (reversed.firstElementChild && reversed.lastElementChild) {
          reversed.insertBefore(reversed.lastElementChild, reversed.firstElementChild);
        }
        document.body.append(reversed);
        const reversedPreviousRect = reversed.querySelector<HTMLElement>(".is-previous")?.getBoundingClientRect();
        const reversedNextRect = reversed.querySelector<HTMLElement>(".is-next")?.getBoundingClientRect();
        const sourceOrderIndependent = Boolean(reversedPreviousRect && reversedNextRect && reversedPreviousRect.left < reversedNextRect.left);
        reversed.remove();

        return { widthsMeasured, sourceOrderIndependent };
      }, [19, 28.74, 28.75, 29, 38.25, 42]);

      assert(measurements, `Expected article-pagination threshold measurements for ${tier}.`);
      assert(measurements.sourceOrderIndependent, `Expected ${tier} article-pagination direction modifiers to place reversed-source links logically.`);
      for (const measurement of measurements.widthsMeasured) {
        const compact = measurement.width < 28.75;
        assert(measurement.columnCount === 2, `Expected ${tier} article pagination at ${measurement.width}rem to retain two logical destinations, got ${measurement.columnCount}.`);
        assert(measurement.rowCount === 1, `Expected ${tier} article pagination at ${measurement.width}rem to retain one row, got ${measurement.rowCount}.`);
        assert(Math.abs((measurement.linkWidths[0] + measurement.linkWidths[1] + measurement.expectedGap) - measurement.navWidth) <= 1, `Expected ${tier} article pagination at ${measurement.width}rem to fill the row without overflow or a missing gap.`);
        if (compact) {
          assert(Math.abs(measurement.linkWidths[0] - (measurement.baselinePx * 7)) <= 1, `Expected ${tier} compact previous link at ${measurement.width}rem to map Vanilla's combined 7-unit inline reservation.`);
          assert(measurement.linkWidths[0] < measurement.linkWidths[1], `Expected ${tier} compact previous link at ${measurement.width}rem to leave remaining space to next.`);
        } else {
          assert(Math.abs(measurement.linkWidths[0] - measurement.linkWidths[1]) <= 1, `Expected ${tier} article destinations at ${measurement.width}rem to retain equal Vanilla halves.`);
        }
        assert(measurement.visibleTextEdgeDeltas.every(delta => delta <= 0.1), `Expected ${tier} article-pagination label/title text edges to align at ${measurement.width}rem; deltas=${measurement.visibleTextEdgeDeltas.join(", ")}.`);
        for (const boundary of measurement.boundaries) {
          const expectedBoundaryWidth = compact ? boundary.navWidth : (boundary.navWidth - measurement.expectedGap) / 2;
          assert(Math.abs(boundary.width - expectedBoundaryWidth) <= 1, `Expected ${tier} ${boundary.direction}-only destination at ${measurement.width}rem to occupy the ${compact ? "full row" : "directional half"}.`);
          assert(compact || (boundary.direction === "previous" ? boundary.startOffset <= 1 : boundary.endOffset <= 1), `Expected ${tier} ${boundary.direction}-only destination at ${measurement.width}rem to align to its logical edge.`);
        }
        assert(measurement.baselineDeltas.every(delta => delta <= 0.11), `Expected ${tier} article links at ${measurement.width}rem to retain baseline-snapped block sizes; deltas=${measurement.baselineDeltas.join(", ")}.`);
        assert(measurement.overflow <= 1, `Expected ${tier} article pagination at ${measurement.width}rem to avoid inline overflow, got ${measurement.overflow}px.`);
      }
    }

    await page.goto(`${origin}/demo/components/tiered-list.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tier of tiers) {
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      const measurements = await page.evaluate((widths) => {
        const selectors = {
          default: ".bf-tiered-list:not(.is-description-full-width):not(.is-list-full-width):not(.is-flush):not(.is-triple)",
          flush: ".bf-tiered-list.is-flush",
          triple: ".bf-tiered-list.is-triple"
        } as const;

        return widths.map(width => {
          const variants = Object.fromEntries(Object.entries(selectors).map(([name, selector]) => {
            const component = document.querySelector<HTMLElement>(selector);
            const items = component?.matches("ol.bf-tiered-list, ul.bf-tiered-list")
              ? component
              : component?.querySelector<HTMLElement>(".bf-tiered-list-items");
            const item = component?.querySelector<HTMLElement>(".bf-tiered-list-item");
            const rule = item?.querySelector<HTMLElement>("hr");
            const title = item?.querySelector<HTMLElement>(".bf-tiered-list-item-title, .bf-tiered-list-item-label");
            const description = item?.querySelector<HTMLElement>(".bf-tiered-list-item-description, .bf-tiered-list-item-role, .bf-tiered-list-item-value");
            if (!component || !items || !item || !rule || !title || !description) return [name, null];

            component.style.inlineSize = `${width}rem`;
            const stackProbe = document.createElement("div");
            stackProbe.className = "bf-stack";
            stackProbe.style.cssText = "position:absolute;visibility:hidden";
            component.append(stackProbe);
            const expectedItemsGap = Number.parseFloat(getComputedStyle(stackProbe).rowGap);
            stackProbe.remove();
            const itemsStyle = getComputedStyle(items);
            const itemRect = item.getBoundingClientRect();
            const ruleRect = rule.getBoundingClientRect();
            const titleRect = title.getBoundingClientRect();
            const descriptionRect = description.getBoundingClientRect();
            const gridColumns = getComputedStyle(item).gridTemplateColumns.trim().split(/\s+/).filter(Boolean).length;
            return [name, {
              gridColumns,
              itemsDisplay: itemsStyle.display,
              itemsGap: Number.parseFloat(itemsStyle.rowGap),
              expectedItemsGap,
              overflow: Math.max(0, component.scrollWidth - component.clientWidth),
              ruleStartOffset: ruleRect.left - itemRect.left,
              ruleEndDelta: itemRect.right - ruleRect.right,
              ruleBottom: ruleRect.bottom,
              titleStartOffset: titleRect.left - itemRect.left,
              titleTop: titleRect.top,
              descriptionStartOffset: descriptionRect.left - itemRect.left,
              descriptionTop: descriptionRect.top
            }];
          }));

          return { width, variants };
        });
      }, [38.74, 38.75]);

      assert(measurements, `Expected tiered-list threshold measurements for ${tier}.`);
      for (const measurement of measurements) {
        const { default: defaultVariant, flush, triple } = measurement.variants;
        assert(defaultVariant && flush && triple, `Expected all displayed tiered-list variants at ${measurement.width}rem for ${tier}.`);
        const aboveBreakpoint = measurement.width === 38.75;
        assert(defaultVariant.gridColumns === (aboveBreakpoint ? 8 : 1), `Expected ${tier} default tiered list at ${measurement.width}rem to use ${aboveBreakpoint ? "eight" : "one"} explicit column(s), got ${defaultVariant.gridColumns}.`);
        assert(flush.gridColumns === 2, `Expected ${tier} flush tiered list at ${measurement.width}rem to retain two explicit columns, got ${flush.gridColumns}.`);
        assert(triple.gridColumns === 3, `Expected ${tier} triple tiered list at ${measurement.width}rem to retain three explicit columns, got ${triple.gridColumns}.`);

        for (const [name, variant] of Object.entries(measurement.variants)) {
          assert(variant.itemsDisplay === "grid", `Expected ${tier} ${name} tiered-list items to own a grid stack.`);
          assert(Math.abs(variant.itemsGap - variant.expectedItemsGap) <= 0.1, `Expected ${tier} ${name} tiered-list items to own the default shallow stack gap, got ${variant.itemsGap}px instead of ${variant.expectedItemsGap}px.`);
        }

        for (const [name, variant] of Object.entries({ flush, triple })) {
          assert(variant.overflow <= 1, `Expected ${tier} ${name} tiered list at ${measurement.width}rem to avoid inline overflow.`);
          assert(Math.abs(variant.ruleStartOffset) <= 1 && Math.abs(variant.ruleEndDelta) <= 1, `Expected ${tier} ${name} tiered-list rule at ${measurement.width}rem to span its explicit row.`);
          assert(variant.ruleBottom <= variant.titleTop + 1, `Expected ${tier} ${name} tiered-list rule at ${measurement.width}rem to remain above its heading.`);
        }

        assert(defaultVariant.overflow <= 1, `Expected ${tier} default tiered list at ${measurement.width}rem to avoid inline overflow.`);
        assert(defaultVariant.ruleBottom <= defaultVariant.titleTop + 1, `Expected ${tier} default tiered-list rule at ${measurement.width}rem to remain above its heading.`);
        if (aboveBreakpoint) {
          assert(defaultVariant.ruleStartOffset > 1, `Expected ${tier} hanging-indent rule to begin inside the grid at 38.75rem.`);
          assert(Math.abs(defaultVariant.ruleStartOffset - defaultVariant.titleStartOffset) <= 1, `Expected ${tier} hanging-indent rule and heading to share their start line at 38.75rem.`);
          assert(Math.abs(defaultVariant.ruleEndDelta) <= 1, `Expected ${tier} hanging-indent rule to end at the row boundary at 38.75rem.`);
          assert(defaultVariant.descriptionStartOffset > defaultVariant.titleStartOffset && Math.abs(defaultVariant.descriptionTop - defaultVariant.titleTop) <= 1, `Expected ${tier} hanging-indent title and description to share a row in distinct columns at 38.75rem.`);
        } else {
          assert(Math.abs(defaultVariant.ruleStartOffset) <= 1 && Math.abs(defaultVariant.ruleEndDelta) <= 1, `Expected ${tier} default tiered-list rule below 38.75rem to span the single-column row.`);
          assert(defaultVariant.descriptionTop > defaultVariant.titleTop, `Expected ${tier} default tiered-list content below 38.75rem to stack.`);
        }
      }
    }

    await page.goto(`${origin}/demo/components/equal-height-row.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tier of tiers) {
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      const measurement = await page.evaluate(() => {
        const row = document.querySelector<HTMLElement>(".bf-equal-height-row:not(.is-wrap)");
        if (!row) return null;
        row.style.inlineSize = "65rem";
        const columns = Array.from(row.querySelectorAll<HTMLElement>(":scope > .bf-equal-height-row-col"));
        const columnRects = columns.map(column => column.getBoundingClientRect());
        const itemRows = columns.map(column => Array.from(column.querySelectorAll<HTMLElement>(":scope > .bf-equal-height-row-item")).map(item => {
          const rect = item.getBoundingClientRect();
          return { top: rect.top, bottom: rect.bottom };
        }));
        return {
          supportsSubgrid: CSS.supports("grid-template-rows", "subgrid"),
          parentGridColumns: getComputedStyle(row).gridTemplateColumns.trim().split(/\s+/).filter(Boolean).length,
          overflow: Math.max(0, row.scrollWidth - row.clientWidth),
          columnTops: columnRects.map(rect => rect.top),
          columnBottoms: columnRects.map(rect => rect.bottom),
          itemRows
        };
      });

      assert(measurement, `Expected equal-height-row measurements for ${tier}.`);
      assert(measurement.supportsSubgrid, "Expected the component browser to support CSS subgrid.");
      assert(measurement.parentGridColumns === 8, `Expected ${tier} equal-height row at 65rem to expose the eight-column parent grid, got ${measurement.parentGridColumns}.`);
      assert(measurement.itemRows.length === 4 && measurement.itemRows.every(rows => rows.length === 2), `Expected ${tier} equal-height fixture to expose four two-row columns.`);
      assert(measurement.overflow <= 1, `Expected ${tier} equal-height row at 65rem to avoid inline overflow.`);

      const spread = (values: number[]) => Math.max(...values) - Math.min(...values);
      assert(spread(measurement.columnTops) <= 0.1 && spread(measurement.columnBottoms) <= 0.1, `Expected ${tier} equal-height columns to share their outer row bounds.`);
      for (const rowIndex of [0, 1]) {
        const rowTops = measurement.itemRows.map(rows => rows[rowIndex].top);
        const rowBottoms = measurement.itemRows.map(rows => rows[rowIndex].bottom);
        assert(spread(rowTops) <= 0.1 && spread(rowBottoms) <= 0.1, `Expected ${tier} equal-height subgrid row ${rowIndex + 1} to align across columns.`);
      }
    }
  } finally {
    await browser.close();
  }
}

async function verifyDirectAndClassSurfaceGeometry(origin: string): Promise<void> {
  const tiers = ["editorial", "documentation", "app", "os"] as const;
  const expectedCapPx = { editorial: 1440, documentation: 1280, app: 960, os: 960 } as const;
  const expectedPanelPaddingPx = { editorial: 16, documentation: 16, app: 12, os: 8 } as const;
  const expectedPanelInlinePx = { editorial: 32, documentation: 32, app: 32, os: 32 } as const;
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({ viewport: { width: 1800, height: 900 } });
    const readGeometry = async (stylesheet: string, bodyClass: string) => {
      await page.setContent(`<!doctype html>
        <link rel="stylesheet" href="${origin}/demo/demo-fonts.css">
        <link rel="stylesheet" href="${origin}${stylesheet}">
        <body class="bf-theme ${bodyClass}" style="margin:0">
          <div class="bf-page"><div class="bf-grid"><span>Fluid grid</span></div></div>
          <div class="bf-fixed-width is-start-aligned">Bounded row</div>
          <input class="bf-input" value="Parity">
          <button class="bf-button">Parity</button>
          <input class="bf-input is-nested" type="text" value="Nested parity">
          <table class="bf-table"><tbody><tr><td>Table parity</td></tr></tbody></table>
          <section class="bf-panel"><header class="bf-panel-header"><h2 class="bf-panel-title">Parity</h2></header><footer class="bf-panel-footer"><button class="bf-panel-toggle">Footer</button></footer></section>
          <span class="bf-status-label">Parity</span>
        </body>`);
      await page.waitForFunction(expected => Array.from(document.styleSheets).some(sheet => sheet.href?.includes(expected)), stylesheet);
      await waitForFonts(page);

      return page.evaluate(() => {
        const input = document.querySelector<HTMLElement>(".bf-input");
        const button = document.querySelector<HTMLElement>(".bf-button");
        const nestedInput = document.querySelector<HTMLElement>(".bf-input.is-nested");
        const tableRow = document.querySelector<HTMLElement>(".bf-table tr");
        const header = document.querySelector<HTMLElement>(".bf-panel-header");
        const footer = document.querySelector<HTMLElement>(".bf-panel-footer");
        const status = document.querySelector<HTMLElement>(".bf-status-label");
        const appPage = document.querySelector<HTMLElement>(".bf-page");
        const appGrid = appPage?.querySelector<HTMLElement>(".bf-grid");
        const fixedWidth = document.querySelector<HTMLElement>(".bf-fixed-width");
        if (!input || !button || !nestedInput || !tableRow || !header || !footer || !status || !appPage || !appGrid || !fixedWidth) {
          throw new Error("Missing surface parity fixture.");
        }

        const contractValues = Object.fromEntries([
          "--bf-body-line-height",
          "--bf-in-box-row-padding-block-end",
          "--bf-in-box-row-padding-block-start",
          "--bf-nested-framed-row-painted-block-size",
          "--bf-interface-row-compensation-block-end",
          "--bf-interface-row-occupied-block-size",
          "--bf-interface-row-painted-block-size"
        ].map(property => {
          const probe = document.createElement("i");
          probe.style.cssText = "display:block;inset:0;position:fixed;visibility:hidden";
          probe.style.blockSize = `var(${property})`;
          document.body.appendChild(probe);
          const value = probe.getBoundingClientRect().height;
          probe.remove();
          return [property, value];
        }));

        const inputStyles = getComputedStyle(input);
        const buttonStyles = getComputedStyle(button);
        const headerStyles = getComputedStyle(header);
        const footerStyles = getComputedStyle(footer);
        return {
          inputHeight: input.getBoundingClientRect().height,
          inputMarginBottom: Number.parseFloat(inputStyles.marginBottom) || 0,
          buttonHeight: button.getBoundingClientRect().height,
          buttonMarginBottom: Number.parseFloat(buttonStyles.marginBottom) || 0,
          bodyLine: contractValues["--bf-body-line-height"],
          inBoxPaddingEnd: contractValues["--bf-in-box-row-padding-block-end"],
          inBoxPaddingStart: contractValues["--bf-in-box-row-padding-block-start"],
          nestedFramedPainted: contractValues["--bf-nested-framed-row-painted-block-size"],
          nestedInputHeight: nestedInput.getBoundingClientRect().height,
          regularCompensation: contractValues["--bf-interface-row-compensation-block-end"],
          regularOccupied: contractValues["--bf-interface-row-occupied-block-size"],
          regularPainted: contractValues["--bf-interface-row-painted-block-size"],
          tableRowHeight: tableRow.getBoundingClientRect().height,
          panelPaddingStart: Number.parseFloat(headerStyles.paddingBlockStart) || 0,
          panelPaddingEnd: Number.parseFloat(headerStyles.paddingBlockEnd) || 0,
          panelGap: Number.parseFloat(headerStyles.gap) || 0,
          footerPaddingEnd: Number.parseFloat(footerStyles.paddingBlockEnd) || 0,
          footerPaddingInlineStart: Number.parseFloat(footerStyles.paddingInlineStart) || 0,
          statusHeight: status.getBoundingClientRect().height,
          pageWidth: appPage.getBoundingClientRect().width,
          gridWidth: appGrid.getBoundingClientRect().width,
          fixedStart: fixedWidth.getBoundingClientRect().left,
          fixedWidth: fixedWidth.getBoundingClientRect().width
        };
      });
    };

    const directCaps: number[] = [];
    for (const tier of tiers) {
      const direct = await readGeometry(`/dist/tiers/${tier}/styles.css`, "");
      const classSwitched = await readGeometry("/dist/tiers/editorial/styles.css", `bf-tier-${tier}`);

      for (const key of Object.keys(direct) as Array<keyof typeof direct>) {
        assert(
          Math.abs(direct[key] - classSwitched[key]) <= 0.05,
          `Expected direct ${tier} ${key} (${direct[key]}px) to match class-switched geometry (${classSwitched[key]}px).`
        );
      }

      assert(Math.abs(direct.fixedWidth - expectedCapPx[tier]) <= 1, `Expected direct ${tier} bf-fixed-width to resolve to ${expectedCapPx[tier]}px, got ${direct.fixedWidth}px.`);
      assert(Math.abs(direct.fixedStart) <= 1 && Math.abs(classSwitched.fixedStart) <= 1, `Expected direct/scoped ${tier} fixed rows to remain aligned to the logical start; direct=${direct.fixedStart}px, scoped=${classSwitched.fixedStart}px.`);
      assert(direct.panelPaddingStart === expectedPanelPaddingPx[tier] && direct.panelPaddingEnd === expectedPanelPaddingPx[tier], `Expected direct ${tier} panel headers to use ${expectedPanelPaddingPx[tier]}px block padding, got ${direct.panelPaddingStart}/${direct.panelPaddingEnd}px.`);
      assert(direct.footerPaddingEnd === expectedPanelPaddingPx[tier] && direct.footerPaddingInlineStart === expectedPanelInlinePx[tier], `Expected direct ${tier} panel footers to use ${expectedPanelPaddingPx[tier]}px block-end padding and the ${expectedPanelInlinePx[tier]}px active grid gutter inline, got ${direct.footerPaddingEnd}/${direct.footerPaddingInlineStart}px.`);
      assert(Math.abs(direct.regularPainted + direct.regularCompensation - direct.regularOccupied) <= 0.05, `Expected direct ${tier} painted row plus compensation to equal its occupied row: ${JSON.stringify(direct)}.`);
      assert(Math.abs(direct.inputHeight + direct.inputMarginBottom - direct.regularOccupied) <= 0.05 && Math.abs(direct.buttonHeight + direct.buttonMarginBottom - direct.regularOccupied) <= 0.05, `Expected direct ${tier} fields and buttons to consume one complete regular occupied row: ${JSON.stringify(direct)}.`);
      assert(Math.abs(direct.bodyLine + direct.inBoxPaddingStart + direct.inBoxPaddingEnd - direct.regularOccupied) <= 0.05, `Expected direct ${tier} in-box start, body line, and end compensation to equal the occupied row: ${JSON.stringify(direct)}.`);
      assert(Math.abs(direct.nestedInputHeight - direct.nestedFramedPainted) <= 0.05 && direct.nestedInputHeight <= direct.bodyLine + 0.05, `Expected direct ${tier} nested framed fields to use the derived paint ledger and fit inside the host body line: ${JSON.stringify(direct)}.`);
      assert(Math.abs(direct.tableRowHeight - direct.regularOccupied) <= 0.1, `Expected direct ${tier} table rows to absorb the shared occupied contract in-box: ${JSON.stringify(direct)}.`);
      directCaps.push(direct.fixedWidth);
      if (tier === "app") {
        assert(direct.pageWidth > direct.fixedWidth + 100 && direct.gridWidth > direct.fixedWidth + 100, `Expected direct App bf-page/grid to stay fluid beyond the ${direct.fixedWidth}px fixed-width cap; page=${direct.pageWidth}px, grid=${direct.gridWidth}px.`);
        assert(classSwitched.pageWidth > classSwitched.fixedWidth + 100 && classSwitched.gridWidth > classSwitched.fixedWidth + 100, `Expected class-switched App bf-page/grid to stay fluid beyond the ${classSwitched.fixedWidth}px fixed-width cap; page=${classSwitched.pageWidth}px, grid=${classSwitched.gridWidth}px.`);
      } else {
        assert(direct.pageWidth <= expectedCapPx[tier] + 1, `Expected ${tier} bf-page to retain its ${expectedCapPx[tier]}px cap, got ${direct.pageWidth}px.`);
      }
    }
    assert(directCaps.every((cap, index) => index === 0 || cap <= directCaps[index - 1]), `Expected rendered fixed-width caps to be non-increasing, got ${directCaps.join(" >= ")}px.`);
  } finally {
    await browser.close();
  }
}

async function verifyNarrowTierSwitchRangeGeometry(origin: string): Promise<void> {
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({ viewport: { width: 600, height: 480 } });
    await page.setContent(`<!doctype html>
      <link rel="stylesheet" href="${origin}/demo/demo-fonts.css">
      <link rel="stylesheet" href="${origin}/dist/tiers/editorial/styles.css">
      <body class="bf-theme bf-tier-editorial" style="margin:0;min-block-size:100vh">
        <section class="bf-panel" style="inset-block-end:0;inset-inline:0;position:fixed">
          <footer class="bf-panel-footer is-sticky bf-cluster is-split">
            <output for="tier-density">Editorial</output>
            <div class="bf-field is-range is-stacked bf-inline-size is-wide">
              <label class="bf-form-label" for="tier-density">Density</label>
              <div class="bf-control">
                <div class="bf-slider">
                  <input id="tier-density" type="range" min="0" max="3" step="1" value="0" aria-valuetext="Editorial">
                </div>
              </div>
            </div>
          </footer>
        </section>
        <script>
          const tiers = ["editorial", "documentation", "app", "os"];
          const labels = ["Editorial", "Documentation", "App", "OS"];
          const range = document.querySelector("#tier-density");
          const output = document.querySelector("output");
          window.__bfTierRangeSamples = [];
          range.addEventListener("input", () => {
            const index = Number(range.value);
            document.body.classList.remove(...tiers.map(tier => "bf-tier-" + tier));
            document.body.classList.add("bf-tier-" + tiers[index]);
            range.setAttribute("aria-valuetext", labels[index]);
            output.value = labels[index];
            const rect = range.getBoundingClientRect();
            window.__bfTierRangeSamples.push({
              tier: tiers[index],
              value: index,
              left: rect.left,
              right: rect.right
            });
          });
        </script>
      </body>`);
    await page.waitForFunction(() => document.fonts.status === "loaded");

    const range = page.locator("#tier-density");
    await range.dispatchEvent("input");
    const initialBox = await range.boundingBox();
    assert(initialBox && initialBox.width > 300, `Expected the narrow tier range to retain a generous track at 600px, got ${initialBox?.width ?? 0}px.`);
    const pointerY = initialBox.y + (initialBox.height / 2);
    await page.mouse.move(initialBox.x + 2, pointerY);
    await page.mouse.down();
    await page.mouse.move(initialBox.x + initialBox.width - 2, pointerY, { steps: 24 });
    await page.mouse.up();

    const state = await page.evaluate(() => {
      const range = document.querySelector<HTMLInputElement>("#tier-density");
      const footer = document.querySelector<HTMLElement>(".bf-panel-footer");
      const samples = (window as typeof window & { __bfTierRangeSamples: Array<{ tier: string; value: number; left: number; right: number; }>; }).__bfTierRangeSamples;
      if (!range || !footer) return null;
      const rangeRect = range.getBoundingClientRect();
      return {
        bodyTier: Array.from(document.body.classList).find(className => className.startsWith("bf-tier-")),
        footerOverflow: footer.scrollWidth - footer.clientWidth,
        rangeOverflow: range.scrollWidth - range.clientWidth,
        rangeWidth: rangeRect.width,
        samples,
        value: range.value
      };
    });

    assert(state, "Expected the narrow tier-switch range fixture to remain measurable after dragging.");
    assert(state.value === "3" && state.bodyTier === "bf-tier-os", `Expected pointer dragging to reach the OS tier; value=${state.value}, tier=${state.bodyTier}.`);
    assert(state.samples.length >= 3 && new Set(state.samples.map(sample => sample.tier)).size === 4, `Expected the drag to exercise all four tier classes, got ${JSON.stringify(state.samples)}.`);
    assert(state.footerOverflow <= 1 && state.rangeOverflow <= 1 && state.rangeWidth >= initialBox.width - 1, `Expected tier switching to preserve a usable, non-overflowing range; footer overflow=${state.footerOverflow}px, range overflow=${state.rangeOverflow}px, width=${state.rangeWidth}px.`);
    assert(state.samples.every(sample => sample.right - sample.left >= 300), `Expected every tier transition to retain the range's usable track width, got ${JSON.stringify(state.samples)}.`);
    await page.close();
  } finally {
    await browser.close();
  }
}

async function verifyNestedGridScoping(origin: string): Promise<void> {
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto(`${origin}/examples/grid/nested-grid.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);

    const states = await page.locator(".example-grid-shell").evaluateAll(shells => shells.map(shell => {
      const outerGrid = shell.querySelector<HTMLElement>(":scope > .bf-grid:not(.example-column-guide)");
      const innerGrid = shell.querySelector<HTMLElement>(".example-nested-inner");
      if (!outerGrid || !innerGrid) return null;
      const children = Array.from(innerGrid.children).map(child => (child as HTMLElement).getBoundingClientRect());
      return {
        outerColumns: getComputedStyle(outerGrid).gridTemplateColumns.split(" ").filter(Boolean).length,
        innerColumns: getComputedStyle(innerGrid).gridTemplateColumns.split(" ").filter(Boolean).length,
        childCount: children.length,
        childrenShareRow: children.length === 2 && Math.abs(children[0].top - children[1].top) <= 1,
        innerOverflow: innerGrid.scrollWidth - innerGrid.clientWidth
      };
    }));

    assert(states.length === 3 && states.every(Boolean), "Expected all three nested-grid specimens to expose measurable outer and inner grids.");
    const measured = states.filter((state): state is NonNullable<typeof state> => state !== null);
    assert(measured.map(state => state.outerColumns).join(",") === "4,8,16", `Expected nested-grid outer specimens to exercise 4/8/16 columns, got ${measured.map(state => state.outerColumns).join(",")}.`);
    assert(measured.every(state => state.innerColumns === 4 && state.childCount === 2 && state.innerOverflow <= 1), `Expected every nested grid to resolve against its own four-column module without overflow, got ${JSON.stringify(measured)}.`);
    assert(!measured[0].childrenShareRow && measured[1].childrenShareRow && measured[2].childrenShareRow, `Expected the narrow child cards to stack and the two span-2 specimens to share a row, got ${JSON.stringify(measured)}.`);
    await page.close();
  } finally {
    await browser.close();
  }
}

async function verifySkipLink(origin: string): Promise<void> {
  const route = "/demo/components/skip-link.html";
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1440, height: 960 }
    });

    await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);

    const hiddenState = await page.locator(".bf-skip-link").evaluate(element => {
      const rect = element.getBoundingClientRect();
      const styles = getComputedStyle(element);
      return {
        left: rect.left,
        top: rect.top,
        position: styles.position
      };
    });

    assert(hiddenState.position === "absolute", `Expected unfocused skip-link to stay absolutely positioned off-canvas, got ${hiddenState.position}.`);
    assert(hiddenState.left < -100 && hiddenState.top < -100, `Expected unfocused skip-link to sit off-canvas, got left=${hiddenState.left}, top=${hiddenState.top}.`);

    const skipLink = page.locator(".bf-skip-link");
    await skipLink.focus();
    await page.waitForTimeout(80);

    const focusedState = await skipLink.evaluate(element => {
      const rect = element.getBoundingClientRect();
      const styles = getComputedStyle(element);
      return {
        left: rect.left,
        top: rect.top,
        position: styles.position,
        outlineStyle: styles.outlineStyle
      };
    });

    assert(focusedState.position === "fixed", `Expected focused skip-link to switch to fixed positioning, got ${focusedState.position}.`);
    assert(focusedState.left >= 0 && focusedState.top >= 0, `Expected focused skip-link to become visible in the viewport, got left=${focusedState.left}, top=${focusedState.top}.`);
    assert(focusedState.outlineStyle !== "none", "Expected focused skip-link to expose an outline.");

    await skipLink.click();
    await page.waitForTimeout(80);

    const activatedState = await page.evaluate(() => ({
      hash: window.location.hash,
      targetId: document.activeElement instanceof HTMLElement ? document.activeElement.id : null
    }));

    assert(activatedState.hash === "#skip-link-target", `Expected skip-link activation to target #skip-link-target, got ${activatedState.hash}.`);
  } finally {
    await browser.close();
  }
}

async function verifyParityInteractions(origin: string): Promise<void> {
  const tiers = ["editorial", "documentation", "app", "os"] as const;
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 520, height: 960 }
    });

    await page.goto(`${origin}/demo/components/in-page-navigation.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);

    const inPageToggle = page.locator(".bf-in-page-navigation .bf-in-page-navigation-toggle").first();
    await inPageToggle.waitFor({ state: "visible" });
    await inPageToggle.click();
    let inPageState = await inPageToggle.evaluate(toggle => {
      const navigation = toggle.closest(".bf-in-page-navigation");
      const list = document.getElementById(toggle.getAttribute("aria-controls") ?? "");
      return {
        expanded: toggle.getAttribute("aria-expanded"),
        label: toggle.getAttribute("aria-label"),
        listExpanded: list?.getAttribute("aria-expanded"),
        rootExpanded: navigation?.classList.contains("is-expanded"),
        iconUp: toggle.querySelector(".bf-icon")?.classList.contains("is-chevron-up")
      };
    });
    assert(inPageState.expanded === "true" && inPageState.listExpanded === "true" && inPageState.rootExpanded, "Expected in-page navigation toggle to synchronize its button, controlled list, and root expanded state.");
    assert(inPageState.iconUp && inPageState.label?.toLowerCase().includes("collapse"), "Expected expanded in-page navigation to expose its collapse label and upward icon.");

    await inPageToggle.press("Escape");
    inPageState = await inPageToggle.evaluate(toggle => {
      const navigation = toggle.closest(".bf-in-page-navigation");
      const list = document.getElementById(toggle.getAttribute("aria-controls") ?? "");
      return {
        expanded: toggle.getAttribute("aria-expanded"),
        label: toggle.getAttribute("aria-label"),
        listExpanded: list?.getAttribute("aria-expanded"),
        rootExpanded: navigation?.classList.contains("is-expanded"),
        iconUp: toggle.querySelector(".bf-icon")?.classList.contains("is-chevron-up")
      };
    });
    assert(inPageState.expanded === "false" && inPageState.listExpanded === "false" && !inPageState.rootExpanded, "Expected Escape to collapse in-page navigation and synchronize its controlled state.");
    assert(!inPageState.iconUp && inPageState.label?.toLowerCase().includes("expand"), "Expected collapsed in-page navigation to restore its expand label and downward icon.");
    assert(await inPageToggle.evaluate(toggle => document.activeElement === toggle), "Expected Escape to return focus to the in-page navigation toggle.");

    await page.goto(`${origin}/demo/components/credential-validation.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);

    const reveal = page.locator(".bf-password-reveal").first();
    const credential = page.locator("#credential-current");
    await reveal.focus();
    await reveal.press("Enter");
    let revealState = await page.evaluate(() => {
      const toggle = document.querySelector<HTMLButtonElement>(".bf-password-reveal");
      const input = document.querySelector<HTMLInputElement>("#credential-current");
      return {
        pressed: toggle?.getAttribute("aria-pressed"),
        label: toggle?.textContent?.trim(),
        type: input?.type,
        value: input?.value
      };
    });
    assert(revealState.pressed === "true" && revealState.type === "text" && revealState.label === "Hide password", "Expected Enter to reveal the controlled credential and synchronize pressed state and label.");
    assert(revealState.value === "correct horse battery staple", "Expected password reveal to preserve the field value.");
    await reveal.press("Space");
    revealState = await page.evaluate(() => {
      const toggle = document.querySelector<HTMLButtonElement>(".bf-password-reveal");
      const input = document.querySelector<HTMLInputElement>("#credential-current");
      return { pressed: toggle?.getAttribute("aria-pressed"), label: toggle?.textContent?.trim(), type: input?.type };
    });
    assert(revealState.pressed === "false" && revealState.type === "password" && revealState.label === "Show password", "Expected Space to conceal the controlled credential again.");
    assert(await credential.getAttribute("aria-describedby") === "credential-current-help", "Expected credential help to remain programmatically associated with the input.");

    await page.goto(`${origin}/demo/components/notification.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);
    const tierSelect = page.locator("[data-page-chrome-tier-select]");
    await tierSelect.waitFor({ state: "visible" });

    for (const tier of tiers) {
      await tierSelect.selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
      const geometry = await page.evaluate(() => {
        const probe = document.createElement("span");
        probe.style.cssText = "position:absolute;visibility:hidden;inline-size:var(--bf-baseline);block-size:var(--bf-baseline)";
        document.body.appendChild(probe);
        const baseline = probe.getBoundingClientRect().height;
        probe.remove();
        const notifications = Array.from(document.querySelectorAll<HTMLElement>(".bf-notification:not([hidden])"));
        const borderedNotifications = notifications.filter(notification => !notification.classList.contains("is-borderless"));
        const spaceProbe = document.createElement("span");
        spaceProbe.style.cssText = "position:absolute;visibility:hidden;inline-size:var(--bf-space-1);block-size:1px";
        document.body.appendChild(spaceProbe);
        const spaceOne = spaceProbe.getBoundingClientRect().width;
        spaceProbe.style.inlineSize = "var(--bf-component-inline-inset-continuation)";
        const continuationInset = spaceProbe.getBoundingClientRect().width;
        spaceProbe.remove();
        const leadingIconGaps = borderedNotifications.map(notification => {
          const notificationRect = notification.getBoundingClientRect();
          const iconRect = (notification.querySelector(".bf-notification-icon") as HTMLElement).getBoundingClientRect();
          const barWidth = Number.parseFloat(getComputedStyle(notification).borderInlineStartWidth);
          return iconRect.left - notificationRect.left - barWidth;
        });
        const iconToTextGaps = notifications.map(notification => {
          const iconRect = (notification.querySelector(".bf-notification-icon") as HTMLElement).getBoundingClientRect();
          const contentRect = (notification.querySelector(".bf-notification-content") as HTMLElement).getBoundingClientRect();
          return contentRect.left - iconRect.right;
        });
        const referenceIcon = borderedNotifications[0]?.querySelector<HTMLElement>(".bf-notification-icon");
        const referenceIconSize = referenceIcon?.getBoundingClientRect().width ?? 0;
        const referenceBarWidth = borderedNotifications[0]
          ? Number.parseFloat(getComputedStyle(borderedNotifications[0]).borderInlineStartWidth)
          : 0;
        const iconFirstLineCentreDeltas = notifications.map(notification => {
          const iconRect = (notification.querySelector(".bf-notification-icon") as HTMLElement).getBoundingClientRect();
          const firstRole = notification.querySelector<HTMLElement>(".bf-notification-title, .bf-notification-message");
          if (!firstRole) return Number.POSITIVE_INFINITY;
          const roleRect = firstRole.getBoundingClientRect();
          const roleStyles = getComputedStyle(firstRole);
          const firstLineCentre = roleRect.top + Number.parseFloat(roleStyles.paddingBlockStart) + (Number.parseFloat(roleStyles.lineHeight) / 2);
          return Math.abs((iconRect.top + (iconRect.height / 2)) - firstLineCentre);
        });
        const metricFlushPairs = notifications.flatMap(notification => {
          const content = notification.querySelector<HTMLElement>(".bf-notification-content.is-metric-flush");
          const title = content?.querySelector<HTMLElement>(".bf-notification-title");
          const message = content?.querySelector<HTMLElement>(".bf-notification-message");
          if (!content || !title || !message) return [];
          const titleRange = document.createRange();
          titleRange.selectNodeContents(title);
          const messageRange = document.createRange();
          messageRange.selectNodeContents(message);
          const titleRect = Array.from(titleRange.getClientRects()).at(-1);
          const messageRect = Array.from(messageRange.getClientRects()).at(0);
          return [{
            glyphGap: (messageRect?.top ?? 0) - (titleRect?.bottom ?? 0),
            marginEnd: Number.parseFloat(getComputedStyle(title).marginBlockEnd),
            paddingStart: Number.parseFloat(getComputedStyle(message).paddingBlockStart),
            stackGap: Number.parseFloat(getComputedStyle(content).rowGap)
          }];
        });
        const closeClearances = notifications.flatMap(notification => {
          const close = notification.querySelector<HTMLElement>(".bf-notification-close");
          const content = notification.querySelector<HTMLElement>(".bf-notification-content");
          if (!close || !content) return [];
          const closeStyle = getComputedStyle(close);
          return [{
            reserved: Number.parseFloat(getComputedStyle(content).paddingInlineEnd),
            required: close.getBoundingClientRect().width + Number.parseFloat(closeStyle.insetInlineEnd)
          }];
        });
        const documentElement = document.documentElement;
        const originalDirection = documentElement.getAttribute("dir");
        documentElement.setAttribute("dir", "rtl");
        const rtlNotification = borderedNotifications[0];
        const rtlNotificationRect = rtlNotification.getBoundingClientRect();
        const rtlIconRect = (rtlNotification.querySelector(".bf-notification-icon") as HTMLElement).getBoundingClientRect();
        const rtlContentRect = (rtlNotification.querySelector(".bf-notification-content") as HTMLElement).getBoundingClientRect();
        const rtlBarWidth = Number.parseFloat(getComputedStyle(rtlNotification).borderInlineStartWidth);
        const rtlClose = document.querySelector<HTMLElement>(".bf-notification-close");
        const rtlCloseRootRect = (rtlClose?.closest(".bf-notification") as HTMLElement).getBoundingClientRect();
        const rtlCloseRect = rtlClose?.getBoundingClientRect();
        const rtlGeometry = {
          leadingIconGap: rtlNotificationRect.right - rtlIconRect.right - rtlBarWidth,
          iconToTextGap: rtlIconRect.left - rtlContentRect.right,
          closeAtInlineEnd: Boolean(rtlCloseRect && rtlCloseRect.left < rtlCloseRootRect.left + (rtlCloseRootRect.width / 2))
        };
        if (originalDirection === null) documentElement.removeAttribute("dir");
        else documentElement.setAttribute("dir", originalDirection);
        return {
          baseline,
          barThicknessToken: getComputedStyle(document.body).getPropertyValue("--bf-bar-thickness").trim(),
          h6FontSize: getComputedStyle(document.querySelector(".bf-notification-title.bf-h6") as Element).fontSize,
          notificationFontSizes: notifications.flatMap(notification => {
            const title = notification.querySelector(".bf-notification-title");
            return title ? [getComputedStyle(title).fontSize] : [];
          }),
          notificationTitlesUseH6: notifications.filter(notification => !notification.classList.contains("is-inline")).every(notification => notification.querySelector(".bf-notification-title")?.classList.contains("bf-h6")),
          inlineUsesSingleBodyRun: notifications.filter(notification => notification.classList.contains("is-inline")).every(notification => {
            const message = notification.querySelector(".bf-notification-message");
            return !notification.querySelector(".bf-notification-title") && message?.children.length === 1 && message.firstElementChild?.tagName === "STRONG";
          }),
          accentWidths: borderedNotifications.map(notification => Number.parseFloat(getComputedStyle(notification).borderInlineStartWidth)),
          paddingBlockStarts: notifications.map(notification => Number.parseFloat(getComputedStyle(notification).paddingBlockStart)),
          leadingIconGaps,
          iconToTextGaps,
          iconFirstLineCentreDeltas,
          metricFlushPairs,
          closeClearances,
          rtlGeometry,
          expectedLeadingIconGap: continuationInset - referenceIconSize - spaceOne - referenceBarWidth,
          expectedIconToTextGap: spaceOne,
          heights: notifications.map(notification => notification.getBoundingClientRect().height),
          overflow: notifications.map(notification => notification.scrollWidth - notification.clientWidth)
        };
      });
      assert(geometry.baseline > 0, `Expected ${tier} notification fixture to resolve a positive baseline.`);
      assert(geometry.barThicknessToken === "0.1875rem" && geometry.accentWidths.every(width => width === 3), `Expected ${tier} notification accents to use the shared 3px/0.1875rem emphasis bar; got ${geometry.accentWidths.join(", ")}px/${geometry.barThicknessToken}.`);
      assert(geometry.paddingBlockStarts.every(padding => padding === 0), `Expected ${tier} notification roots to have no top padding; got ${geometry.paddingBlockStarts.join(", ")}px.`);
      assert(geometry.leadingIconGaps.every(gap => Math.abs(gap - geometry.expectedLeadingIconGap) <= 0.05), `Expected ${tier} notification icons to preserve the shared label continuation while retaining the compact icon-to-text gap (${geometry.expectedLeadingIconGap}px after the bar); got ${geometry.leadingIconGaps.join(", ")}px.`);
      assert(geometry.iconToTextGaps.every(gap => Math.abs(gap - geometry.expectedIconToTextGap) <= 0.05), `Expected ${tier} notification icon-to-text gaps to equal the compact space-1 token (${geometry.expectedIconToTextGap}px); got ${geometry.iconToTextGaps.join(", ")}px.`);
      assert(geometry.iconFirstLineCentreDeltas.every(delta => delta <= 0.05), `Expected ${tier} notification severity icons to align to the first title/body line; centre deltas=${geometry.iconFirstLineCentreDeltas.join(", ")}px.`);
      assert(geometry.metricFlushPairs.length === 4 && geometry.metricFlushPairs.every(pair => pair.marginEnd === 0 && pair.paddingStart === 0 && pair.stackGap === 0 && pair.glyphGap <= geometry.baseline + 1), `Expected ${tier} separate notification roles to use the metric-flush relationship; got ${JSON.stringify(geometry.metricFlushPairs)} at ${geometry.baseline}px baseline.`);
      assert(geometry.closeClearances.every(clearance => clearance.reserved >= clearance.required), `Expected ${tier} notification copy to clear the close control; got ${JSON.stringify(geometry.closeClearances)}.`);
      assert(Math.abs(geometry.rtlGeometry.leadingIconGap - geometry.expectedLeadingIconGap) <= 0.05 && Math.abs(geometry.rtlGeometry.iconToTextGap - geometry.expectedIconToTextGap) <= 0.05 && geometry.rtlGeometry.closeAtInlineEnd, `Expected ${tier} notification leading geometry and close control to mirror in RTL; got ${JSON.stringify(geometry.rtlGeometry)}.`);
      assert(geometry.overflow.every(delta => delta <= 1), `Expected ${tier} notifications to avoid inline overflow; deltas=${geometry.overflow.join(", ")}.`);
      assert(geometry.notificationTitlesUseH6 && geometry.inlineUsesSingleBodyRun && geometry.notificationFontSizes.length > 0 && geometry.notificationFontSizes.every(fontSize => fontSize === geometry.h6FontSize), `Expected ${tier} separate notification headings to use bf-h6 while inline feedback stays one strong-plus-regular body run; heading classes=${geometry.notificationTitlesUseH6}, inline=${geometry.inlineUsesSingleBodyRun}, sizes=${geometry.notificationFontSizes.join(", ")}.`);
    }

    const dismissal = page.locator(".bf-notification-close");
    await dismissal.focus();
    await dismissal.press("Enter");
    assert(await page.locator("#notification-dismissible").isHidden(), "Expected notification dismissal to hide the controlled notification.");
    assert(
      await page.locator(".bf-notification.is-borderless").evaluate(notification => document.activeElement === notification),
      "Expected notification dismissal to move focus to the next stable notification.",
    );

    await page.close();
  } finally {
    await browser.close();
  }
}

async function main(): Promise<void> {
  const rootDir = path.resolve(".");
  const { server, origin } = await createStaticServer(rootDir);

  try {
    await verifyNumberStepperChevron(origin);
    await verifyPageChromeNavigationScroll(origin);
    await verifyPageChromeHierarchyAndKeylines(origin);
    await verifyExamplePreferencesBeforePaint(origin);
    await verifyExampleMainClearsPageNavigation(origin);
    await verifyPinnedAsideResize(origin);
    await verifyDrawerOverlay(origin);
    await verifyApplicationLayout(origin);
    await verifyTopNavigation(origin);
    await verifyBodySizedUiTypography(origin);
    await verifyNestedAuxiliaryGeometry(origin);
    await verifyBlockDerivedInlineGeometry(origin);
    await verifyQualifiedAnchorStates(origin);
    await verifySemanticRoleClassPrecedence(origin);
    await verifyContainerOwnedSpacing(origin);
    await verifySharedReadableSplitThresholds(origin);
    await verifyRenewalCompositionContracts(origin);
    await verifyAdversarialResponsiveGeometry(origin);
    await verifyDirectAndClassSurfaceGeometry(origin);
    await verifyNarrowTierSwitchRangeGeometry(origin);
    await verifyNestedGridScoping(origin);
    await verifySkipLink(origin);
    await verifyParityInteractions(origin);
    await verifyReducedNavigationAndTableOfContents(origin);
    await verifyInteractiveTables(origin);
    await verifyPortedCompositionGeometry(origin);
    await verifyRichListsAndTabSectionGeometry(origin);
    await verifySitesRecipeCompositions(origin);
    await verifyContentCardGeometry(origin);
    await verifyLinkedLogoAndStickyFooterGeometry(origin);
    await verifySiteShellPrimitiveGeometry(origin);

    console.log("Component behavior verification passed.");
  } finally {
    await closeServer(server);
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
