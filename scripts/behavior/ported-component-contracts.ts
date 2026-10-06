import { waitForFonts } from "../component-demo-shared.ts";
import { assert, disableDemoChromeHitTesting, openBrowser } from "./browser-helpers.ts";

const contentCardBaselineTolerancePx = 0.75;

export async function verifyReducedNavigationAndTableOfContents(origin: string): Promise<void> {
  const tiers = ["editorial", "documentation", "app", "os"] as const;
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1036, height: 960 }
    });

    await page.goto(`${origin}/demo/components/navigation-reduced.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);
    const tierSelect = page.locator("[data-page-chrome-tier-select]");

    for (const tier of tiers) {
      await tierSelect.selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);

      for (const viewport of [
        { width: 1035, isLarge: false, label: "below 64.75rem" },
        { width: 1036, isLarge: true, label: "at 64.75rem" }
      ] as const) {
        await page.setViewportSize({ width: viewport.width, height: 960 });
        await page.waitForTimeout(80);

        const geometry = await page.locator("#reduced-navigation").evaluate(root => {
          const row = root.querySelector<HTMLElement>(".bf-top-navigation-row");
          const tag = root.querySelector<HTMLElement>(".bf-top-navigation-logo-tag");
          const title = root.querySelector<HTMLElement>(".bf-top-navigation-logo-title");
          const link = root.querySelector<HTMLElement>(".bf-top-navigation-nav .bf-top-navigation-link");
          const nav = root.querySelector<HTMLElement>(".bf-top-navigation-nav");
          const probe = document.createElement("span");
          probe.style.cssText = "position:absolute;visibility:hidden;font-size:var(--bf-body-font-size);line-height:var(--bf-body-line-height)";
          root.appendChild(probe);
          const bodyRole = getComputedStyle(probe);
          const state = row && tag && title && link && nav ? {
            tagDisplay: getComputedStyle(tag).display,
            titleFontSize: getComputedStyle(title).fontSize,
            titleLineHeight: getComputedStyle(title).lineHeight,
            titleFontWeight: getComputedStyle(title).fontWeight,
            linkFontSize: getComputedStyle(link).fontSize,
            linkLineHeight: getComputedStyle(link).lineHeight,
            navHidden: nav.getAttribute("aria-hidden"),
            navDisplay: getComputedStyle(nav).display,
            rowMinBlockSize: getComputedStyle(row).minBlockSize,
            rootOverflow: root.scrollWidth - root.clientWidth,
            rowOverflow: row.scrollWidth - row.clientWidth,
            bodyRoleFontSize: bodyRole.fontSize,
            bodyRoleLineHeight: bodyRole.lineHeight
          } : null;
          probe.remove();
          return state;
        });

        assert(geometry, `Expected ${tier} reduced-navigation geometry ${viewport.label}.`);
        assert(geometry.tagDisplay === "none", `Expected ${tier} reduced navigation to remove the canonical tag ${viewport.label}.`);
        assert(geometry.titleFontSize === geometry.bodyRoleFontSize && geometry.titleLineHeight === geometry.bodyRoleLineHeight && geometry.titleFontWeight === "400", `Expected ${tier} reduced navigation logo title to use the body role ${viewport.label}.`);
        assert(geometry.linkFontSize === geometry.bodyRoleFontSize && geometry.linkLineHeight === geometry.bodyRoleLineHeight, `Expected ${tier} reduced navigation controls to use the body role ${viewport.label}.`);
        assert(geometry.rowMinBlockSize === "0px", `Expected ${tier} reduced navigation row to remove the standard minimum block size ${viewport.label}.`);
        assert(geometry.rootOverflow <= 1 && geometry.rowOverflow <= 1, `Expected ${tier} reduced navigation to avoid inline overflow ${viewport.label}; root=${geometry.rootOverflow}, row=${geometry.rowOverflow}.`);
        assert(geometry.navHidden === (viewport.isLarge ? "false" : "true"), `Expected ${tier} reduced navigation aria-hidden to follow the ${viewport.label} breakpoint, got ${geometry.navHidden}.`);

        if (!viewport.isLarge) {
          const menuToggle = page.locator("#reduced-navigation .bf-top-navigation-banner .bf-top-navigation-menu-toggle");
          await menuToggle.focus();
          await menuToggle.press("Enter");
          await page.waitForTimeout(50);
          const menuState = await page.locator("#reduced-navigation").evaluate(root => {
            const menu = root.querySelector<HTMLElement>(".bf-top-navigation-menu-toggle");
            const nav = root.querySelector<HTMLElement>(".bf-top-navigation-nav");
            return menu && nav ? {
              expanded: menu.getAttribute("aria-expanded"),
              navHidden: nav.getAttribute("aria-hidden"),
              navDisplay: getComputedStyle(nav).display,
              focused: document.activeElement === menu,
              outline: getComputedStyle(menu).outlineStyle
            } : null;
          });
          assert(menuState && menuState.expanded === "true" && menuState.navHidden === "false" && menuState.navDisplay === "flex", `Expected ${tier} reduced menu keyboard activation to reveal its controlled nav below 64.75rem.`);
          assert(menuState.focused && menuState.outline !== "none", `Expected ${tier} reduced menu trigger to retain visible keyboard focus.`);

          const dropdownToggle = page.locator("#reduced-navigation .bf-top-navigation-dropdown-toggle");
          await dropdownToggle.focus();
          await dropdownToggle.press("Space");
          await page.waitForTimeout(50);
          const dropdownState = await page.locator("#reduced-navigation").evaluate(root => {
            const item = root.querySelector<HTMLElement>(".bf-top-navigation-item.is-dropdown-toggle");
            const toggle = item?.querySelector<HTMLElement>(".bf-top-navigation-dropdown-toggle");
            const dropdown = item?.querySelector<HTMLElement>(".bf-top-navigation-dropdown");
            return item && toggle && dropdown ? {
              active: item.classList.contains("is-active"),
              expanded: toggle.getAttribute("aria-expanded"),
              hidden: dropdown.getAttribute("aria-hidden"),
              display: getComputedStyle(dropdown).display
            } : null;
          });
          assert(dropdownState && dropdownState.active && dropdownState.expanded === "true" && dropdownState.hidden === "false" && dropdownState.display === "block", `Expected ${tier} reduced mobile dropdown to preserve its ARIA and visible lifecycle.`);

          const searchToggle = page.locator("#reduced-navigation .bf-top-navigation-banner .bf-top-navigation-search-toggle");
          await searchToggle.focus();
          await searchToggle.press("Enter");
          await page.waitForTimeout(50);
          const searchState = await page.locator("#reduced-navigation").evaluate(root => {
            const nav = root.querySelector<HTMLElement>(".bf-top-navigation-nav");
            const search = root.querySelector<HTMLElement>(".bf-top-navigation-search");
            const dropdown = root.querySelector<HTMLElement>(".bf-top-navigation-dropdown");
            const input = root.querySelector<HTMLInputElement>(".bf-top-navigation-search .bf-search-box-input");
            const toggle = root.querySelector<HTMLElement>(".bf-top-navigation-banner .bf-top-navigation-search-toggle");
            return nav && search && dropdown && input && toggle ? {
              navHidden: nav.getAttribute("aria-hidden"),
              searchHidden: search.getAttribute("aria-hidden"),
              dropdownHidden: dropdown.getAttribute("aria-hidden"),
              pressed: toggle.getAttribute("aria-pressed"),
              inputFocused: document.activeElement === input
            } : null;
          });
          assert(searchState && searchState.navHidden === "false" && searchState.searchHidden === "false" && searchState.dropdownHidden === "true" && searchState.pressed === "true" && searchState.inputFocused, `Expected ${tier} reduced mobile search to close the dropdown, expose its controlled region, and focus its input.`);
          await page.keyboard.press("Escape");
          const closed = await page.locator("#reduced-navigation").evaluate(root => {
            const menu = root.querySelector<HTMLElement>(".bf-top-navigation-menu-toggle");
            const search = root.querySelector<HTMLElement>(".bf-top-navigation-search");
            const dropdown = root.querySelector<HTMLElement>(".bf-top-navigation-dropdown");
            const toggle = root.querySelector<HTMLElement>(".bf-top-navigation-banner .bf-top-navigation-search-toggle");
            return menu && search && dropdown && toggle ? {
              menu: menu.getAttribute("aria-expanded"),
              search: search.getAttribute("aria-hidden"),
              dropdown: dropdown.getAttribute("aria-hidden"),
              focused: document.activeElement === toggle
            } : null;
          });
          assert(closed && closed.menu === "false" && closed.search === "true" && closed.dropdown === "true" && closed.focused, `Expected ${tier} Escape to restore the reduced mobile navigation lifecycle and search-trigger focus.`);
        } else {
          const dropdownToggle = page.locator("#reduced-navigation .bf-top-navigation-dropdown-toggle");
          await dropdownToggle.focus();
          await dropdownToggle.press("Enter");
          await page.waitForTimeout(50);
          assert(await dropdownToggle.getAttribute("aria-expanded") === "true", `Expected ${tier} reduced desktop dropdown keyboard activation to set aria-expanded=true.`);
          assert(await page.locator("#reduced-navigation .bf-top-navigation-dropdown").getAttribute("aria-hidden") === "false", `Expected ${tier} reduced desktop dropdown to expose its controlled menu.`);

          const searchToggle = page.locator("#reduced-navigation .bf-top-navigation-nav .bf-top-navigation-search-toggle");
          await searchToggle.focus();
          await searchToggle.press("Enter");
          await page.waitForTimeout(50);
          const desktopSearch = await page.locator("#reduced-navigation").evaluate(root => {
            const search = root.querySelector<HTMLElement>(".bf-top-navigation-search");
            const dropdown = root.querySelector<HTMLElement>(".bf-top-navigation-dropdown");
            const input = root.querySelector<HTMLInputElement>(".bf-top-navigation-search .bf-search-box-input");
            const toggle = root.querySelector<HTMLElement>(".bf-top-navigation-nav .bf-top-navigation-search-toggle");
            return search && dropdown && input && toggle ? {
              searchHidden: search.getAttribute("aria-hidden"),
              dropdownHidden: dropdown.getAttribute("aria-hidden"),
              pressed: toggle.getAttribute("aria-pressed"),
              inputFocused: document.activeElement === input,
              position: getComputedStyle(search).position
            } : null;
          });
          assert(desktopSearch && desktopSearch.searchHidden === "false" && desktopSearch.dropdownHidden === "true" && desktopSearch.pressed === "true" && desktopSearch.inputFocused && desktopSearch.position === "absolute", `Expected ${tier} reduced desktop search to preserve ARIA, focus, dropdown closure, and floating geometry.`);
          await page.keyboard.press("Escape");
          assert(await searchToggle.evaluate(toggle => document.activeElement === toggle), `Expected ${tier} Escape to restore focus to the reduced desktop search trigger.`);
        }

        const rtlState = await page.locator("#reduced-navigation").evaluate(root => {
          root.setAttribute("dir", "rtl");
          const row = root.querySelector<HTMLElement>(".bf-top-navigation-row");
          const state = {
            direction: getComputedStyle(root).direction,
            rootOverflow: root.scrollWidth - root.clientWidth,
            rowOverflow: row ? row.scrollWidth - row.clientWidth : Number.POSITIVE_INFINITY
          };
          root.removeAttribute("dir");
          return state;
        });
        assert(rtlState.direction === "rtl" && rtlState.rootOverflow <= 1 && rtlState.rowOverflow <= 1, `Expected ${tier} reduced navigation to retain logical RTL geometry without overflow ${viewport.label}.`);
      }
    }

    await page.setViewportSize({ width: 1036, height: 960 });
    await page.goto(`${origin}/demo/components/in-page-navigation.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);
    const inPageTierSelect = page.locator("[data-page-chrome-tier-select]");

    for (const tier of tiers) {
      await inPageTierSelect.selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
      const state = await page.evaluate(() => {
        const roots = Array.from(document.querySelectorAll<HTMLElement>(".bf-in-page-navigation"));
        const desktop = roots[0];
        const expanded = roots[1];
        if (!desktop || !expanded) return null;
        desktop.style.inlineSize = "50rem";
        const probeStart = document.createElement("span");
        const probeEnd = document.createElement("span");
        const probeGap = document.createElement("span");
        probeStart.style.cssText = "position:absolute;visibility:hidden;block-size:var(--bf-body-nudge-start)";
        probeEnd.style.cssText = "position:absolute;visibility:hidden;block-size:var(--bf-body-nudge-end)";
        probeGap.style.cssText = "position:absolute;visibility:hidden;block-size:var(--bf-space-1)";
        desktop.append(probeStart, probeEnd, probeGap);
        const expectedStart = probeStart.getBoundingClientRect().height;
        const expectedEnd = probeEnd.getBoundingClientRect().height;
        const expectedGap = probeGap.getBoundingClientRect().height;
        const rootStates = [desktop, expanded].map(root => ({
          links: Array.from(root.querySelectorAll<HTMLElement>(".bf-in-page-navigation-link")).map(link => {
            const style = getComputedStyle(link);
            return [Number.parseFloat(style.paddingBlockStart), Number.parseFloat(style.paddingBlockEnd)];
          }),
          listGaps: Array.from(root.querySelectorAll<HTMLElement>(".bf-in-page-navigation-list")).map(list => Number.parseFloat(getComputedStyle(list).rowGap)),
          itemGaps: Array.from(root.querySelectorAll<HTMLElement>(".bf-in-page-navigation-item")).map(item => Number.parseFloat(getComputedStyle(item).rowGap)),
          overflow: root.scrollWidth - root.clientWidth
        }));
        const result = { expectedStart, expectedEnd, expectedGap, desktop: rootStates[0], expanded: rootStates[1] };
        probeStart.remove();
        probeEnd.remove();
        probeGap.remove();
        return result;
      });
      assert(state, `Expected ${tier} in-page-navigation geometry.`);
      for (const [label, rootState] of [["desktop", state.desktop], ["expanded", state.expanded]] as const) {
        assert(rootState.links.every(([start, end]) => Math.abs(start - state.expectedStart) <= 0.1 && Math.abs(end - state.expectedEnd) <= 0.1), `Expected ${tier} ${label} in-page links to retain metric-only block padding; expected ${state.expectedStart}/${state.expectedEnd}, got ${JSON.stringify(rootState.links)}.`);
        assert(rootState.listGaps.every(gap => Math.abs(gap - state.expectedGap) <= 0.1) && rootState.itemGaps.every(gap => Math.abs(gap - state.expectedGap) <= 0.1), `Expected ${tier} ${label} in-page lists/items to own a one-baseline gap; expected ${state.expectedGap}, got lists=${rootState.listGaps}, items=${rootState.itemGaps}.`);
        assert(rootState.overflow <= 1, `Expected ${tier} ${label} in-page navigation to avoid inline overflow; got ${rootState.overflow}px.`);
      }
      const expandedCurrent = page.locator(".bf-in-page-navigation.is-expanded .bf-in-page-navigation-link[aria-current]");
      await expandedCurrent.focus();
      assert(await expandedCurrent.evaluate(link => document.activeElement === link && getComputedStyle(link).outlineStyle !== "none"), `Expected ${tier} expanded in-page current link to retain visible keyboard focus.`);
    }

    await page.goto(`${origin}/demo/components/table-of-contents.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);
    const tocTierSelect = page.locator("[data-page-chrome-tier-select]");

    for (const tier of tiers) {
      await tocTierSelect.selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);

      for (const width of ["19.99rem", "20rem"] as const) {
        const expectedSpace = width === "19.99rem" ? "var(--bf-leading-mark-gap)" : "var(--bf-component-inline-inset-action)";
        const state = await page.locator(".bf-table-of-contents").first().evaluate((root, widthValue) => {
          root.style.inlineSize = widthValue;
          const nested = root.querySelector<HTMLElement>(".bf-table-of-contents-list .bf-table-of-contents-list");
          const parentItem = nested?.parentElement;
          const parentLink = parentItem?.querySelector<HTMLElement>(":scope > .bf-table-of-contents-link");
          const nestedLink = nested?.querySelector<HTMLElement>(":scope > .bf-table-of-contents-item > .bf-table-of-contents-link");
          const current = root.querySelector<HTMLElement>(".bf-table-of-contents-link[aria-current]");
          const narrowIndentProbe = document.createElement("span");
          const regularIndentProbe = document.createElement("span");
          const sectionSpaceProbe = document.createElement("span");
          const textProbe = document.createElement("span");
          const rowPaddingProbe = document.createElement("span");
          narrowIndentProbe.style.cssText = "position:absolute;visibility:hidden;inline-size:var(--bf-leading-mark-gap)";
          regularIndentProbe.style.cssText = "position:absolute;visibility:hidden;inline-size:var(--bf-component-inline-inset-action)";
          sectionSpaceProbe.style.cssText = "position:absolute;visibility:hidden;block-size:var(--bf-section-space-shallow)";
          textProbe.style.cssText = "position:absolute;visibility:hidden;color:var(--bf-color-text-default)";
          rowPaddingProbe.style.cssText = "position:absolute;visibility:hidden;block-size:var(--bf-interface-row-padding-block)";
          root.append(narrowIndentProbe, regularIndentProbe, sectionSpaceProbe, textProbe, rowPaddingProbe);
          const direction = getComputedStyle(root).direction;
          const nestedRect = nestedLink?.getBoundingClientRect();
          const parentRect = parentLink?.getBoundingClientRect();
          const sections = Array.from(root.querySelectorAll<HTMLElement>(":scope > .bf-table-of-contents-section"));
          const secondSection = sections[1];
          const secondHeading = secondSection?.querySelector<HTMLElement>(".bf-table-of-contents-heading");
          const dividerStyle = secondSection ? getComputedStyle(secondSection, "::before") : null;
          const result = nested && nestedLink && parentLink && current && nestedRect && parentRect ? {
            actualWidth: root.getBoundingClientRect().width,
            direction,
            sectionGap: Number.parseFloat(getComputedStyle(root).rowGap),
            expectedSectionGap: sectionSpaceProbe.getBoundingClientRect().height,
            sectionPadding: sections.map(section => {
              const style = getComputedStyle(section);
              return [Number.parseFloat(style.paddingBlockStart), Number.parseFloat(style.paddingBlockEnd)];
            }),
            dividerBlockSize: Number.parseFloat(dividerStyle?.blockSize ?? "0"),
            dividerToHeading: secondSection && secondHeading ? secondHeading.getBoundingClientRect().top - secondSection.getBoundingClientRect().top : Number.POSITIVE_INFINITY,
            nestedMargin: Number.parseFloat(getComputedStyle(nested).marginInlineStart),
            nestedPadding: Number.parseFloat(getComputedStyle(nested).paddingInlineStart),
            linkPadding: Array.from(root.querySelectorAll<HTMLElement>(".bf-table-of-contents-link")).map(link => {
              const style = getComputedStyle(link);
              return [Number.parseFloat(style.paddingBlockStart), Number.parseFloat(style.paddingBlockEnd)];
            }),
            listGaps: Array.from(root.querySelectorAll<HTMLElement>(".bf-table-of-contents-list")).map(list => Number.parseFloat(getComputedStyle(list).rowGap)),
            itemGaps: Array.from(root.querySelectorAll<HTMLElement>(".bf-table-of-contents-item")).map(item => Number.parseFloat(getComputedStyle(item).rowGap)),
            expectedRowPadding: rowPaddingProbe.getBoundingClientRect().height,
            expectedNarrowIndent: narrowIndentProbe.getBoundingClientRect().width,
            expectedRegularIndent: regularIndentProbe.getBoundingClientRect().width,
            logicalIndent: direction === "rtl" ? parentRect.right - nestedRect.right : nestedRect.left - parentRect.left,
            currentState: current.getAttribute("aria-current"),
            currentWeight: getComputedStyle(current).fontWeight,
            currentColor: getComputedStyle(current).color,
            defaultTextColor: getComputedStyle(textProbe).color,
            rootOverflow: root.scrollWidth - root.clientWidth
          } : null;
          narrowIndentProbe.remove();
          regularIndentProbe.remove();
          sectionSpaceProbe.remove();
          textProbe.remove();
          rowPaddingProbe.remove();
          return result;
        }, width);
        assert(state, `Expected ${tier} table-of-contents state at ${width}.`);
        const expectedIndent = expectedSpace === "var(--bf-leading-mark-gap)" ? state.expectedNarrowIndent : state.expectedRegularIndent;
        assert(state.nestedMargin === 0 && Math.abs(state.nestedPadding - expectedIndent) <= 0.1 && Math.abs(state.logicalIndent - expectedIndent) <= 0.1, `Expected ${tier} table-of-contents nested indentation to map to ${expectedSpace} through owner padding at ${width}; margin=${state.nestedMargin}, padding=${state.nestedPadding}, logical=${state.logicalIndent}, expected=${expectedIndent}.`);
        assert(Math.abs(state.sectionGap - state.expectedSectionGap) <= 0.1 && state.sectionPadding.every(([start, end]) => start === 0 && end === 0), `Expected ${tier} table-of-contents sections to receive their shallow separation from the parent stack without item padding at ${width}.`);
        assert(state.linkPadding.every(([start, end]) => Math.abs(start - state.expectedRowPadding) <= 0.1 && Math.abs(end - state.expectedRowPadding) <= 0.1), `Expected ${tier} table-of-contents links to share symmetric single-line row padding at ${width}; expected ${state.expectedRowPadding}, got ${JSON.stringify(state.linkPadding)}.`);
        assert(state.listGaps.every(gap => Math.abs(gap) <= 0.1) && state.itemGaps.every(gap => Math.abs(gap) <= 0.1), `Expected ${tier} table-of-contents rows to match the side-navigation zero-gap rhythm at ${width}; got lists=${state.listGaps}, items=${state.itemGaps}.`);
        assert(state.dividerBlockSize === 1 && state.dividerToHeading < state.expectedSectionGap, `Expected ${tier} table-of-contents divider to paint tightly with the following heading instead of occupying the parent-owned section gap at ${width}.`);
        assert(state.currentState === "location" && Number.parseFloat(state.currentWeight) >= 600 && state.currentColor === state.defaultTextColor, `Expected ${tier} table-of-contents current link to expose its semantic current state and default-text emphasis at ${width}.`);
        assert(state.rootOverflow <= 1, `Expected ${tier} table-of-contents to avoid inline overflow at ${width}; got ${state.rootOverflow}px.`);
      }

      const currentLink = page.locator(".bf-table-of-contents").first().locator(".bf-table-of-contents-link[aria-current]");
      await currentLink.focus();
      const focusState = await currentLink.evaluate(link => ({ focused: document.activeElement === link, outline: getComputedStyle(link).outlineStyle }));
      assert(focusState.focused && focusState.outline !== "none", `Expected ${tier} table-of-contents current link to retain visible keyboard focus.`);

      const narrowState = await page.locator(".table-of-contents-demo-narrow").evaluate(section => {
        section.style.inlineSize = "19.99rem";
        const root = section.querySelector<HTMLElement>(".bf-table-of-contents");
        const longLink = root?.querySelector<HTMLElement>(".bf-table-of-contents-link");
        if (!root || !longLink) return null;
        root.setAttribute("dir", "rtl");
        const nested = root.querySelector<HTMLElement>(".bf-table-of-contents-list .bf-table-of-contents-list");
        const parentLink = nested?.parentElement?.querySelector<HTMLElement>(":scope > .bf-table-of-contents-link");
        const nestedLink = nested?.querySelector<HTMLElement>(":scope > .bf-table-of-contents-item > .bf-table-of-contents-link");
        const nestedRect = nestedLink?.getBoundingClientRect();
        const parentRect = parentLink?.getBoundingClientRect();
        const result = {
          direction: getComputedStyle(root).direction,
          rootOverflow: root.scrollWidth - root.clientWidth,
          sectionOverflow: section.scrollWidth - section.clientWidth,
          longLinkOverflowWrap: getComputedStyle(longLink).overflowWrap,
          logicalIndent: nestedRect && parentRect ? parentRect.right - nestedRect.right : 0
        };
        root.removeAttribute("dir");
        return result;
      });
      assert(narrowState && narrowState.direction === "rtl" && narrowState.rootOverflow <= 1 && narrowState.sectionOverflow <= 1 && narrowState.longLinkOverflowWrap === "anywhere" && narrowState.logicalIndent > 0, `Expected ${tier} narrow RTL table-of-contents to retain logical nesting and long-copy overflow protection.`);
    }

    await page.close();
  } finally {
    await browser.close();
  }
}

export async function verifyInteractiveTables(origin: string): Promise<void> {
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1200, height: 960 }
    });

    await page.goto(`${origin}/demo/components/table-sortable.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);
    const coresButton = page.locator(".bf-table.is-sortable").first().locator(".bf-table-sort-button", { hasText: "Cores" });
    const coresHeader = coresButton.locator("xpath=..");
    const coreValues = async (): Promise<string[]> => page.locator(".bf-table.is-sortable").first().locator("tbody tr td:nth-child(3)").allTextContents();
    const columnWidths = async (): Promise<number[]> => page.locator(".bf-table.is-sortable").first().locator("thead th").evaluateAll(headers => headers.map(header => header.getBoundingClientRect().width));
    const initialWidths = await columnWidths();
    const assertStableWidths = async (state: string): Promise<void> => {
      const widths = await columnWidths();
      assert(widths.length === initialWidths.length && widths.every((width, index) => Math.abs(width - initialWidths[index]) <= 0.1), `Expected sortable-table column widths to remain stable in ${state}; initial=${initialWidths.join(", ")}, current=${widths.join(", ")}.`);
    };

    const tierSelect = page.locator("[data-page-chrome-tier-select]");
    for (const tier of ["editorial", "documentation", "app", "os"] as const) {
      await tierSelect.selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
      const targetGeometry = await coresButton.evaluate(button => {
        const control = button as HTMLElement;
        const header = control.closest("th") as HTMLElement;
        const buttonRect = control.getBoundingClientRect();
        const headerRect = header.getBoundingClientRect();
        const buttonStyle = getComputedStyle(control);
        const headerStyle = getComputedStyle(header);
        const extensionStyle = getComputedStyle(control, "::before");
        const extensionHeight = Number.parseFloat(extensionStyle.height);
        const targetTop = buttonRect.top + ((buttonRect.height - extensionHeight) / 2);
        const targetBottom = targetTop + extensionHeight;
        const samples: Array<[number, number]> = [];
        for (let y = Math.ceil(targetTop + 1); y <= Math.floor(targetBottom - 1); y += 1) {
          for (let x = Math.ceil(buttonRect.left + 1); x <= Math.floor(buttonRect.right - 1); x += 1) samples.push([x, y]);
        }
        return {
          buttonHeight: buttonRect.height,
          lineHeight: Number.parseFloat(buttonStyle.lineHeight),
          paddingStart: Number.parseFloat(buttonStyle.paddingBlockStart),
          paddingEnd: Number.parseFloat(buttonStyle.paddingBlockEnd),
          extensionHeight,
          headerHeight: headerRect.height,
          expectedHeaderHeight: buttonRect.height
            + Number.parseFloat(headerStyle.paddingBlockStart)
            + Number.parseFloat(headerStyle.paddingBlockEnd)
            + Number.parseFloat(headerStyle.borderBlockStartWidth)
            + Number.parseFloat(headerStyle.borderBlockEndWidth),
          interiorSamples: samples.length,
          allSamplesHit: samples.every(([x, y]) => document.elementFromPoint(x, y)?.closest(".bf-table-sort-button") === control)
        };
      });
      assert(Math.abs(targetGeometry.buttonHeight - targetGeometry.lineHeight) <= 0.1 && targetGeometry.paddingStart === 0 && targetGeometry.paddingEnd === 0, `Expected ${tier} sort button to keep its text-line flow footprint after moving target extension out of layout; got ${JSON.stringify(targetGeometry)}.`);
      assert(targetGeometry.extensionHeight >= 24 && targetGeometry.interiorSamples > 0 && targetGeometry.allSamplesHit, `Expected ${tier} sort button's complete one-pixel interior 24 CSS-pixel extension scan to route to the real button; got ${JSON.stringify(targetGeometry)}.`);
      assert(Math.abs(targetGeometry.headerHeight - targetGeometry.expectedHeaderHeight) <= 0.1, `Expected ${tier} sortable header row to comprise only its text line, owned cell padding, and row strokes; got ${JSON.stringify(targetGeometry)}.`);

      const activeHeader = page.locator(".bf-table.is-sortable").nth(1).locator("th[aria-sort='ascending']").first();
      const caretGeometry = await activeHeader.evaluate(header => {
        const owner = header as HTMLElement;
        owner.dir = "ltr";
        const ltrStyle = getComputedStyle(owner, "::after");
        const ltr = {
          backgroundColor: ltrStyle.backgroundColor,
          inlineSize: Number.parseFloat(ltrStyle.inlineSize),
          maskImage: ltrStyle.maskImage || ltrStyle.webkitMaskImage,
          maskPosition: ltrStyle.maskPosition || ltrStyle.webkitMaskPosition,
          maskSize: ltrStyle.maskSize || ltrStyle.webkitMaskSize,
          paddingInlineEnd: Number.parseFloat(ltrStyle.paddingInlineEnd),
          paddingInlineStart: Number.parseFloat(ltrStyle.paddingInlineStart),
          transform: ltrStyle.transform
        };
        owner.dir = "rtl";
        const rtlStyle = getComputedStyle(owner, "::after");
        const rtl = {
          backgroundColor: rtlStyle.backgroundColor,
          inlineSize: Number.parseFloat(rtlStyle.inlineSize),
          maskImage: rtlStyle.maskImage || rtlStyle.webkitMaskImage,
          maskPosition: rtlStyle.maskPosition || rtlStyle.webkitMaskPosition,
          maskSize: rtlStyle.maskSize || rtlStyle.webkitMaskSize,
          paddingInlineEnd: Number.parseFloat(rtlStyle.paddingInlineEnd),
          paddingInlineStart: Number.parseFloat(rtlStyle.paddingInlineStart),
          transform: rtlStyle.transform
        };
        const result = {
          ltr,
          rtl
        };
        owner.removeAttribute("dir");
        return result;
      });
      const expectedIconSize = { editorial: 16, documentation: 14, app: 14, os: 12 }[tier];
      const expectedMarkGap = { editorial: 8, documentation: 8, app: 8, os: 4 }[tier];
      for (const [direction, caret] of [["ltr", caretGeometry.ltr], ["rtl", caretGeometry.rtl]] as const) {
        const maskDimensions = caret.maskSize.split(/\s+/).map(value => Number.parseFloat(value));
        assert(Math.abs(caret.inlineSize - (expectedIconSize + expectedMarkGap)) <= 0.1, `Expected ${tier}/${direction} sortable caret to reserve one tier icon plus the full mark gap without squeezing the glyph; got ${JSON.stringify(caretGeometry)}.`);
        assert(caret.paddingInlineStart === 0 && caret.paddingInlineEnd === 0 && caret.transform === "none", `Expected ${tier}/${direction} sortable caret geometry to stay independent of padding and transforms; got ${JSON.stringify(caretGeometry)}.`);
        assert(maskDimensions.length === 2 && maskDimensions.every(value => Math.abs(value - expectedIconSize) <= 0.1), `Expected ${tier}/${direction} sortable caret paint to retain the full tier icon size; got ${JSON.stringify(caretGeometry)}.`);
        assert(caret.maskImage !== "none" && caret.backgroundColor !== "rgba(0, 0, 0, 0)", `Expected ${tier}/${direction} sortable caret to use a currentColor mask that remains available to forced colors; got ${JSON.stringify(caretGeometry)}.`);
      }
      assert(caretGeometry.ltr.maskPosition !== caretGeometry.rtl.maskPosition, `Expected ${tier} sortable caret to mirror its painted-edge placement in nested RTL without moving its label gap; got ${JSON.stringify(caretGeometry)}.`);
    }
    await tierSelect.selectOption("editorial");
    await page.waitForFunction(() => document.body.dataset.bfTier === "editorial");

    const sortableHeaderBox = await page.locator(".bf-table.is-sortable th[aria-sort]").first().boundingBox();
    const cdp = await page.context().newCDPSession(page);
    const documentNode = await cdp.send("DOM.getDocument", { depth: -1, pierce: true });
    const headerNode = await cdp.send("DOM.querySelector", { nodeId: documentNode.root.nodeId, selector: ".bf-table.is-sortable th[aria-sort]" });
    const headerDescription = await cdp.send("DOM.describeNode", { nodeId: headerNode.nodeId, depth: 1, pierce: true });
    const beforePseudo = headerDescription.node.pseudoElements?.find(pseudo => pseudo.pseudoType === "before");
    assert(sortableHeaderBox && beforePseudo?.backendNodeId, "Expected the sortable header and its named ::before stroke owner to be available to CDP.");
    const pseudoBox = await cdp.send("DOM.getBoxModel", { backendNodeId: beforePseudo.backendNodeId });
    const borderQuad = pseudoBox.model.border;
    const pseudoBounds = {
      left: Math.min(borderQuad[0], borderQuad[2], borderQuad[4], borderQuad[6]),
      top: Math.min(borderQuad[1], borderQuad[3], borderQuad[5], borderQuad[7]),
      right: Math.max(borderQuad[0], borderQuad[2], borderQuad[4], borderQuad[6]),
      bottom: Math.max(borderQuad[1], borderQuad[3], borderQuad[5], borderQuad[7])
    };
    assert(
      Math.abs(pseudoBounds.left - sortableHeaderBox.x) <= 0.1 &&
      Math.abs(pseudoBounds.top - sortableHeaderBox.y) <= 0.1 &&
      Math.abs(pseudoBounds.right - (sortableHeaderBox.x + sortableHeaderBox.width)) <= 0.1 &&
      Math.abs(pseudoBounds.bottom - (sortableHeaderBox.y + sortableHeaderBox.height)) <= 0.1,
      `Expected the sortable header's exceptional ::before stroke owner to anchor to the exact header box; header=${JSON.stringify(sortableHeaderBox)}, pseudo=${JSON.stringify(pseudoBounds)}.`
    );
    await cdp.detach();

    await coresButton.focus();
    await coresButton.press("Enter");
    assert(await coresHeader.getAttribute("aria-sort") === "ascending", "Expected first sortable-table activation to set aria-sort=ascending.");
    const ascendingCaret = await coresHeader.evaluate(header => {
      const style = getComputedStyle(header, "::after");
      return { inlineSize: style.inlineSize, maskImage: style.maskImage || style.webkitMaskImage, maskPosition: style.maskPosition || style.webkitMaskPosition, transform: style.transform };
    });
    assert(JSON.stringify(await coreValues()) === JSON.stringify(["2", "4", "8", "16"]), "Expected sortable table numeric values to sort ascending.");
    assert(await page.locator(".bf-table.is-sortable").first().locator("th[aria-sort='ascending']").count() === 1, "Expected sortable table to expose exactly one active sort column.");
    await assertStableWidths("ascending state");

    await coresButton.press("Space");
    assert(await coresHeader.getAttribute("aria-sort") === "descending", "Expected second sortable-table activation to set aria-sort=descending.");
    const descendingCaret = await coresHeader.evaluate(header => {
      const style = getComputedStyle(header, "::after");
      return { inlineSize: style.inlineSize, maskImage: style.maskImage || style.webkitMaskImage, maskPosition: style.maskPosition || style.webkitMaskPosition, transform: style.transform };
    });
    assert(ascendingCaret.maskImage !== descendingCaret.maskImage && ascendingCaret.inlineSize === descendingCaret.inlineSize && ascendingCaret.maskPosition === descendingCaret.maskPosition && ascendingCaret.transform === "none" && descendingCaret.transform === "none", `Expected ascending and descending sort states to swap only their full-size glyph mask without shifting the gap or slot; ascending=${JSON.stringify(ascendingCaret)}, descending=${JSON.stringify(descendingCaret)}.`);
    assert(JSON.stringify(await coreValues()) === JSON.stringify(["16", "8", "4", "2"]), "Expected sortable table numeric values to sort descending.");
    await assertStableWidths("descending state");

    await coresButton.click();
    assert(await coresHeader.getAttribute("aria-sort") === "none", "Expected third sortable-table activation to restore aria-sort=none.");
    assert(JSON.stringify(await coreValues()) === JSON.stringify(["8", "2", "16", "4"]), "Expected sortable table to restore its original row order.");
    await assertStableWidths("restored state");
    const sortFocus = await coresButton.evaluate(button => ({
      focused: document.activeElement === button,
      outline: getComputedStyle(button).outlineStyle
    }));
    assert(sortFocus.focused && sortFocus.outline !== "none", "Expected sortable-table keyboard focus to remain visible after sorting.");

    await page.goto(`${origin}/demo/components/table-expanding.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);
    const expansionButton = page.locator(".bf-table-expand-toggle").first();
    const expansionRow = page.locator("#machine-karura-details");
    assert(await expansionRow.isHidden(), "Expected the collapsed expanding-table row to start hidden.");
    await expansionButton.focus();
    await expansionButton.press("Space");
    assert(await expansionButton.getAttribute("aria-expanded") === "true", "Expected expanding-table activation to set aria-expanded=true.");
    assert(await expansionRow.getAttribute("aria-hidden") === "false" && await expansionRow.isVisible(), "Expected expanding-table activation to reveal and expose its controlled row.");
    assert((await expansionButton.textContent())?.trim() === "Hide configuration", "Expected expanding-table activation to synchronize its visible action label.");
    await expansionButton.press("Enter");
    assert(await expansionButton.getAttribute("aria-expanded") === "false" && await expansionRow.isHidden(), "Expected expanding-table second activation to collapse its controlled row.");

    await page.goto(`${origin}/demo/components/table-mobile-card.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);
    const firstMobileTable = page.locator(".bf-table.is-mobile-card").first();
    const generatedLabels = firstMobileTable.locator(".bf-table-card-label");
    assert(await generatedLabels.count() === 15, "Expected mobile-card runtime to generate one presentation label per body cell from real headings.");
    assert((await generatedLabels.first().textContent())?.trim() === "Agent", "Expected the first mobile-card label to match its real Agent heading.");
    assert(await generatedLabels.first().getAttribute("aria-hidden") === "true", "Expected generated mobile-card labels to stay presentation-only for assistive technology.");

    await page.setViewportSize({ width: 520, height: 960 });
    await page.waitForTimeout(100);
    const cardState = await firstMobileTable.evaluate(table => {
      const frame = table.closest(".bf-table-mobile-card-frame");
      const heading = table.querySelector("thead");
      const row = table.querySelector("tbody tr");
      const label = table.querySelector(".bf-table-card-label");
      if (!(frame instanceof HTMLElement) || !(heading instanceof HTMLElement) || !(row instanceof HTMLElement) || !(label instanceof HTMLElement)) return null;
      return {
        tableDisplay: getComputedStyle(table).display,
        rowDisplay: getComputedStyle(row).display,
        headingDisplay: getComputedStyle(heading).display,
        headingClip: getComputedStyle(heading).clipPath,
        labelDisplay: getComputedStyle(label).display,
        overflow: frame.scrollWidth - frame.clientWidth
      };
    });
    assert(cardState, "Expected mobile-card table geometry to be measurable at a narrow viewport.");
    assert(cardState.tableDisplay === "block" && cardState.rowDisplay === "block", "Expected mobile-card table rows to reflow into cards below the intrinsic threshold.");
    assert(cardState.headingDisplay !== "none" && cardState.headingClip !== "none", "Expected mobile-card real headings to remain in the accessibility tree while visually clipped.");
    assert(cardState.labelDisplay === "block" && cardState.overflow <= 1, "Expected mobile-card presentation labels to appear without inline overflow.");

    await page.close();
  } finally {
    await browser.close();
  }
}

export async function verifyPortedCompositionGeometry(origin: string): Promise<void> {
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1600, height: 1200 }
    });

    await page.goto(`${origin}/demo/components/data-spotlight.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tier of ["editorial", "documentation", "app", "os"] as const) {
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      const highlightRules = await page.locator(".bf-data-spotlight-rule").evaluateAll(rules => rules.map(rule => {
        const styles = getComputedStyle(rule);
        return {
          blockSize: Number.parseFloat(styles.blockSize),
          token: styles.getPropertyValue("--bf-bar-thickness").trim()
        };
      }));
      assert(highlightRules.length === 9, `Expected ${tier} data spotlight fixture to expose all nine highlighted rules.`);
      assert(highlightRules.every(rule => rule.blockSize === 3 && rule.token === "0.1875rem"), `Expected ${tier} data spotlight rules to use the shared 3px/0.1875rem emphasis bar.`);
      const actionSpacing = await page.locator(".bf-data-spotlight-item:has(.bf-data-spotlight-action)").evaluateAll(items => items.map(item => {
        const description = item.querySelector<HTMLElement>("p:not(.bf-data-spotlight-stat)")?.getBoundingClientRect();
        const action = item.querySelector<HTMLElement>(".bf-data-spotlight-action")?.getBoundingClientRect();
        return description && action ? action.top - description.bottom : -1;
      }));
      assert(actionSpacing.length === 4 && actionSpacing.every(gap => gap >= 0), `Expected ${tier} data spotlight actions not to overlap their descriptions.`);
      const itemSpacing = await page.locator(".bf-data-spotlight").evaluateAll(roots => roots.map(root => {
        const items = Array.from(root.querySelectorAll<HTMLElement>(".bf-data-spotlight-item"));
        return {
          rootMarginEnd: Number.parseFloat(getComputedStyle(root).marginBlockEnd),
          itemPadding: items.map(item => Number.parseFloat(getComputedStyle(item).paddingBlockEnd))
        };
      }));
      assert(itemSpacing.every(state => state.rootMarginEnd === 0 && state.itemPadding.every(padding => padding === 0)), `Expected ${tier} data spotlight roots and items to own no external or inter-row spacing.`);
    }
    let layoutState = await page.locator(".bf-data-spotlight.is-four-blocks").evaluate(root => {
      const items = Array.from(root.querySelectorAll<HTMLElement>(".bf-data-spotlight-item"));
      const positions = items.map(item => item.getBoundingClientRect());
      return { columns: new Set(positions.map(rect => Math.round(rect.left))).size, rowDelta: Math.max(...positions.map(rect => rect.top)) - Math.min(...positions.map(rect => rect.top)) };
    });
    assert(layoutState.columns === 4 && layoutState.rowDelta <= 1, "Expected wide four-block data spotlight to preserve Vanilla's single four-column row.");
    layoutState = await page.locator(".bf-data-spotlight.is-four-blocks").evaluate(root => {
      (root as HTMLElement).style.inlineSize = "30rem";
      const positions = Array.from(root.querySelectorAll<HTMLElement>(".bf-data-spotlight-item")).map(item => item.getBoundingClientRect());
      return { columns: new Set(positions.map(rect => Math.round(rect.left))).size, rowDelta: Math.max(...positions.map(rect => rect.top)) - Math.min(...positions.map(rect => rect.top)) };
    });
    assert(layoutState.columns === 1 && layoutState.rowDelta > 1, "Expected constrained data spotlight to collapse intrinsically to one column.");

    await page.goto(`${origin}/demo/components/divided-section.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const dividedTierSelect = page.locator("[data-page-chrome-tier-select]");
    for (const tier of ["editorial", "documentation", "app", "os"] as const) {
      await dividedTierSelect.selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
      const listRhythm = await page.locator(".bf-divided-section-list").first().evaluate(list => {
        const items = Array.from(list.querySelectorAll<HTMLElement>(".bf-divided-section-item"));
        const distanceProbe = document.createElement("span");
        distanceProbe.style.cssText = "position:absolute;visibility:hidden;block-size:var(--bf-divided-section-rule-to-content)";
        const groupGapProbe = document.createElement("span");
        groupGapProbe.style.cssText = "position:absolute;visibility:hidden;block-size:var(--bf-section-space-shallow)";
        list.append(distanceProbe, groupGapProbe);
        const expectedRuleToContent = distanceProbe.getBoundingClientRect().height;
        const expectedGroupGap = groupGapProbe.getBoundingClientRect().height;
        distanceProbe.remove();
        groupGapProbe.remove();
        return {
          isStack: list.classList.contains("bf-stack"),
          rowGap: Number.parseFloat(getComputedStyle(list).rowGap),
          expectedGroupGap,
          expectedRuleToContent,
          items: items.map(item => {
            const styles = getComputedStyle(item);
            const dividerStyles = getComputedStyle(item, "::before");
            return {
              borderStart: Number.parseFloat(styles.borderBlockStartWidth),
              dividerBlockSize: Number.parseFloat(dividerStyles.blockSize),
              dividerInsetStart: Number.parseFloat(dividerStyles.insetBlockStart),
              marginEnd: Number.parseFloat(styles.marginBlockEnd),
              marginStart: Number.parseFloat(styles.marginBlockStart),
              paddingEnd: Number.parseFloat(styles.paddingBlockEnd),
              paddingStart: Number.parseFloat(styles.paddingBlockStart)
            };
          })
        };
      });
      assert(listRhythm.isStack && Math.abs(listRhythm.rowGap - listRhythm.expectedGroupGap) <= 0.1, `Expected ${tier} divided-section list to use the governed group gap; got ${JSON.stringify(listRhythm)}.`);
      assert(listRhythm.items.every(item => item.paddingStart === 0 && item.paddingEnd === 0 && item.marginStart === 0 && item.marginEnd === 0), `Expected ${tier} divided-section items to own no block padding or margin.`);
      assert(listRhythm.items[0]?.borderStart === 0, `Expected ${tier} first divided-section item to start without divider compensation.`);
      assert(listRhythm.items.slice(1).every(item => item.borderStart === 0 && item.dividerBlockSize === 1 && Math.abs((-item.dividerInsetStart - item.dividerBlockSize) - listRhythm.expectedRuleToContent) <= 0.1 && (listRhythm.rowGap + item.dividerInsetStart) > listRhythm.expectedRuleToContent), `Expected ${tier} divided-section dividers to preserve the governed item-gap clearance before following content; gap=${listRhythm.rowGap}px, expected clear distance=${listRhythm.expectedRuleToContent}px, items=${JSON.stringify(listRhythm.items)}.`);
    }
    const dividedState = await page.locator(".bf-divided-section").first().evaluate(root => {
      const header = root.querySelector<HTMLElement>(".bf-divided-section-header")?.getBoundingClientRect();
      const content = root.querySelector<HTMLElement>(".bf-divided-section-content")?.getBoundingClientRect();
      if (!header || !content) return null;
      const wide = { sameRow: Math.abs(header.top - content.top) <= 1, separated: Math.abs(header.left - content.left) > 1 };
      (root as HTMLElement).style.inlineSize = "30rem";
      const narrowHeader = root.querySelector<HTMLElement>(".bf-divided-section-header")?.getBoundingClientRect();
      const narrowContent = root.querySelector<HTMLElement>(".bf-divided-section-content")?.getBoundingClientRect();
      return { wide, narrowStacked: !!narrowHeader && !!narrowContent && narrowContent.top > narrowHeader.top && Math.abs(narrowContent.left - narrowHeader.left) <= 1 };
    });
    assert(dividedState?.wide.sameRow && dividedState.wide.separated && dividedState.narrowStacked, "Expected divided section to preserve its wide split and constrained stacked geometry.");

    await page.goto(`${origin}/demo/components/logo-section.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const logoState = await page.locator(".bf-logo-section").first().evaluate(root => {
      const item = root.querySelector<HTMLElement>(".bf-logo-section-item");
      const styles = item ? getComputedStyle(item) : null;
      if (!item || !styles) return null;
      const probe = document.createElement("span");
      probe.style.cssText = "position:absolute;visibility:hidden;block-size:calc(var(--bf-space-12) + var(--bf-space-1))";
      root.append(probe);
      const expected = probe.getBoundingClientRect().height;
      probe.remove();
      return { height: item.getBoundingClientRect().height, expected, marginBlockStart: Number.parseFloat(styles.marginBlockStart), overflow: root.scrollWidth - root.clientWidth };
    });
    assert(logoState && Math.abs(logoState.height - logoState.expected) <= 0.1 && logoState.marginBlockStart === 0 && logoState.overflow <= 1, "Expected logo section to retain its large intrinsic mark size without block-start margins or overflow.");
    const containedLogoSpacing = await page.locator(".bf-logo-section.is-contained").evaluate(root => {
      const itemsOwner = root.querySelector<HTMLElement>(".bf-logo-section-items");
      const items = Array.from(root.querySelectorAll<HTMLElement>(".bf-logo-section-item"));
      if (!itemsOwner || items.length < 3) return null;
      itemsOwner.style.inlineSize = "10rem";
      const rects = items.map(item => item.getBoundingClientRect()).sort((a, b) => a.top - b.top || a.left - b.left);
      const firstTop = rects[0]?.top ?? 0;
      const firstRow = rects.filter(rect => Math.abs(rect.top - firstTop) <= 0.1);
      const secondRow = rects.find(rect => rect.top > firstTop + 0.1);
      return {
        actualGap: secondRow ? secondRow.top - Math.max(...firstRow.map(rect => rect.bottom)) : -1,
        itemMargins: items.map(item => Number.parseFloat(getComputedStyle(item).marginBlockEnd)),
        rowGap: Number.parseFloat(getComputedStyle(itemsOwner).rowGap)
      };
    });
    assert(containedLogoSpacing && containedLogoSpacing.itemMargins.every(margin => margin === 0) && containedLogoSpacing.rowGap > 0 && Math.abs(containedLogoSpacing.actualGap - containedLogoSpacing.rowGap) <= 0.1, `Expected contained logo wrapping to use its parent-owned row gap with zero child relationship margins; got ${JSON.stringify(containedLogoSpacing)}.`);

    await page.goto(`${origin}/demo/components/media-object.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tier of ["editorial", "documentation", "app", "os"] as const) {
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
      const mediaState = await page.locator(".bf-media-object").first().evaluate(root => {
        (root as HTMLElement).style.removeProperty("inline-size");
        const wideLayout = root.querySelector<HTMLElement>(".bf-media-object-layout");
        const wideMedia = root.querySelector<HTMLElement>(".bf-media-object-media")?.getBoundingClientRect();
        const wideContent = root.querySelector<HTMLElement>(".bf-media-object-content")?.getBoundingClientRect();
        const wideLayoutRect = wideLayout?.getBoundingClientRect();
        const wide = wideLayout && wideLayoutRect && wideMedia && wideContent ? {
          columnCount: getComputedStyle(wideLayout).gridTemplateColumns.split(" ").length,
          sameRow: Math.abs(wideMedia.top - wideContent.top) <= 1,
          mediaAtStart: Math.abs(wideMedia.left - wideLayoutRect.left) <= 1,
          contentAfterMedia: wideContent.left > wideMedia.left,
          overflow: root.scrollWidth - root.clientWidth
        } : null;
        (root as HTMLElement).style.inlineSize = "19rem";
        const narrowLayout = root.querySelector<HTMLElement>(".bf-media-object-layout");
        const narrowMedia = root.querySelector<HTMLElement>(".bf-media-object-media")?.getBoundingClientRect();
        const narrowContent = root.querySelector<HTMLElement>(".bf-media-object-content")?.getBoundingClientRect();
        const narrowLayoutRect = narrowLayout?.getBoundingClientRect();
        const narrow = narrowLayout && narrowLayoutRect && narrowMedia && narrowContent ? {
          columnCount: getComputedStyle(narrowLayout).gridTemplateColumns.split(" ").length,
          sameRow: Math.abs(narrowMedia.top - narrowContent.top) <= 1,
          mediaAtStart: Math.abs(narrowMedia.left - narrowLayoutRect.left) <= 1,
          contentAfterMedia: narrowContent.left > narrowMedia.left,
          overflow: root.scrollWidth - root.clientWidth
        } : null;
        return { wide, narrow };
      });
      assert(mediaState.wide?.columnCount === 8 && mediaState.wide.sameRow && mediaState.wide.mediaAtStart && mediaState.wide.contentAfterMedia && mediaState.wide.overflow <= 1, `Expected ${tier} media object to use the shared eight-column wide grid with media in columns 1–2 and content from column 3.`);
      assert(mediaState.narrow?.columnCount === 4 && mediaState.narrow.sameRow && mediaState.narrow.mediaAtStart && mediaState.narrow.contentAfterMedia && mediaState.narrow.overflow <= 1, `Expected ${tier} media object to retain its first-two/remaining-column relationship on the four-column narrow grid.`);
    }

    await page.goto(`${origin}/demo/components/basic-section.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const basicState = await page.locator(".bf-basic-section").first().evaluate(root => {
      const wideHeader = root.querySelector<HTMLElement>(".bf-basic-section-header")?.getBoundingClientRect();
      const wideContent = root.querySelector<HTMLElement>(".bf-basic-section-content")?.getBoundingClientRect();
      const wide = wideHeader && wideContent ? { sameRow: Math.abs(wideHeader.top - wideContent.top) <= 1, separated: Math.abs(wideHeader.left - wideContent.left) > 1 } : null;
      (root as HTMLElement).style.inlineSize = "30rem";
      const narrowHeader = root.querySelector<HTMLElement>(".bf-basic-section-header")?.getBoundingClientRect();
      const narrowContent = root.querySelector<HTMLElement>(".bf-basic-section-content")?.getBoundingClientRect();
      const narrow = narrowHeader && narrowContent ? { sameRow: Math.abs(narrowHeader.top - narrowContent.top) <= 1, separated: Math.abs(narrowHeader.left - narrowContent.left) > 1 } : null;
      return { wide, narrow, overflow: root.scrollWidth - root.clientWidth };
    });
    assert(basicState?.wide?.sameRow && basicState.wide.separated && basicState.narrow && !basicState.narrow.sameRow && !basicState.narrow.separated && basicState.overflow <= 1, "Expected basic section to preserve its large 50/50 split and constrained stack.");

    const flushStackState = await page.locator('[data-baseline-label="basic section flush stack"]').evaluate(root => {
      const paragraphs = Array.from(root.querySelectorAll<HTMLElement>(":scope > p"));
      const first = paragraphs[0]?.getBoundingClientRect();
      const second = paragraphs[1]?.getBoundingClientRect();
      return first && second ? {
        gap: getComputedStyle(root).gap,
        internalMarginEnd: Number.parseFloat(getComputedStyle(paragraphs[0]).marginBlockEnd),
        finalMarginEnd: Number.parseFloat(getComputedStyle(paragraphs[1]).marginBlockEnd),
        visibleGap: second.top - first.bottom,
      } : null;
    });
    assert(flushStackState?.gap === "0px" && flushStackState.internalMarginEnd > 0 && Math.abs(flushStackState.internalMarginEnd - flushStackState.finalMarginEnd) <= 0.1 && Math.abs(flushStackState.visibleGap - flushStackState.internalMarginEnd) <= 0.1, `Expected the flush stack to add no semantic gap while retaining every paragraph's metric compensation; received ${JSON.stringify(flushStackState)}.`);

    await page.goto(`${origin}/demo/components/cta-section.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const ctaState = await page.locator(".bf-cta-section.is-offset").evaluate(root => {
      const rootRect = root.getBoundingClientRect();
      const contentRect = root.querySelector<HTMLElement>(".bf-cta-section-content")?.getBoundingClientRect();
      const layout = root.querySelector<HTMLElement>(".bf-cta-section-layout");
      if (!contentRect || !layout) return null;
      const content = root.querySelector<HTMLElement>(".bf-cta-section-content");
      const copy = root.querySelector<HTMLElement>(".bf-cta-section-copy");
      const cta = root.querySelector<HTMLElement>(".bf-cta-block");
      const heading = copy?.querySelector<HTMLElement>("h2");
      const paragraph = copy?.querySelector<HTMLElement>("p");
      const contentStyle = content ? getComputedStyle(content) : null;
      return {
        offsetRatio: (contentRect.left - rootRect.left) / rootRect.width,
        paddingBlockStart: Number.parseFloat(getComputedStyle(layout).paddingBlockStart),
        contentGap: Number.parseFloat(contentStyle?.rowGap ?? "0"),
        copyGap: Number.parseFloat(copy ? getComputedStyle(copy).rowGap : "0"),
        copyToCtaGap: copy && cta ? cta.getBoundingClientRect().top - copy.getBoundingClientRect().bottom : 0,
        textGap: heading && paragraph ? paragraph.getBoundingClientRect().top - heading.getBoundingClientRect().bottom : 0,
        headingCompensation: heading ? Number.parseFloat(getComputedStyle(heading).marginBlockEnd) : 0
      };
    });
    assert(ctaState && ctaState.offsetRatio > 0.2 && ctaState.paddingBlockStart === 0, "Expected wide CTA section to preserve its 25/75 offset without semantic layout padding between the rule and heading.");
    assert(ctaState && ctaState.contentGap > ctaState.copyGap && ctaState.copyGap > 0 && Math.abs(ctaState.copyToCtaGap - ctaState.contentGap) <= 0.1 && Math.abs(ctaState.textGap - ctaState.headingCompensation - ctaState.copyGap) <= 0.1, "Expected CTA section to use a dense copy gap inside the grouped text and a larger shallow boundary before the CTA block.");

    await page.goto(`${origin}/demo/components/text-spotlight.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const spotlightState = await page.locator(".bf-text-spotlight").evaluate(root => {
      const rootRect = root.getBoundingClientRect();
      const header = root.querySelector<HTMLElement>(".bf-text-spotlight-header")?.getBoundingClientRect();
      const content = root.querySelector<HTMLElement>(".bf-text-spotlight-content")?.getBoundingClientRect();
      return header && content ? { headerRatio: header.width / rootRect.width, contentRatio: content.width / rootRect.width, sameRow: Math.abs(header.top - content.top) <= 1 } : null;
    });
    assert(spotlightState?.sameRow && spotlightState.headerRatio < 0.3 && spotlightState.contentRatio > 0.65, "Expected text spotlight to preserve its wide 25/75 title/content relationship.");

    await page.goto(`${origin}/demo/components/hero.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const heroState = await page.locator(".bf-hero:has(> .bf-hero-layout)").first().evaluate(root => {
      const children = Array.from(root.querySelectorAll<HTMLElement>(":scope > .bf-hero-layout > *")).map(child => child.getBoundingClientRect());
      const styles = getComputedStyle(root);
      const probe = document.createElement("span");
      probe.style.cssText = "position:absolute;visibility:hidden;block-size:var(--bf-section-space)";
      root.append(probe);
      const sectionSpace = probe.getBoundingClientRect().height;
      probe.remove();
      return { sameRow: children.length >= 2 && Math.abs(children[0].top - children[1].top) <= 1, separated: children.length >= 2 && Math.abs(children[0].left - children[1].left) > 1, paddingEnd: Number.parseFloat(styles.paddingBlockEnd), overflow: root.scrollWidth - root.clientWidth };
    });
    assert(heroState.sameRow && heroState.separated && heroState.paddingEnd === 0 && heroState.overflow <= 1, "Expected wide hero to preserve its paired columns while leaving the section exit to its surrounding stack.");

    await page.goto(`${origin}/demo/components/quote-wrapper.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const quoteState = await page.locator(".bf-quote-wrapper").first().evaluate(root => {
      const signpost = root.querySelector<HTMLElement>(".bf-quote-wrapper-signpost")?.getBoundingClientRect();
      const content = root.querySelector<HTMLElement>(".bf-quote-wrapper-content")?.getBoundingClientRect();
      const prose = root.querySelector<HTMLElement>(".bf-quote-wrapper-prose")?.getBoundingClientRect();
      const citation = root.querySelector<HTMLElement>(".bf-quote-wrapper-citation")?.getBoundingClientRect();
      const headerLink = root.querySelector<HTMLElement>(".bf-quote-wrapper-header-link")?.getBoundingClientRect();
      const media = root.querySelector<HTMLElement>(".bf-quote-wrapper-media")?.getBoundingClientRect();
      const quote = root.querySelector<HTMLElement>("blockquote");
      const quoteStyles = quote ? getComputedStyle(quote) : null;
      return signpost && content && prose && citation && headerLink && media ? {
        signpostRatio: signpost.width / root.getBoundingClientRect().width,
        contentRatio: content.width / root.getBoundingClientRect().width,
        sameRow: Math.abs(signpost.top - content.top) <= 1,
        semanticQuote: quote?.tagName === "BLOCKQUOTE",
        citationKeylineDelta: Math.abs(citation.left - headerLink.left),
        mediaKeylineDelta: Math.abs(media.left - content.left),
        proseKeylineDelta: Math.abs(prose.left - content.left),
        quoteBorder: Number.parseFloat(quoteStyles?.borderInlineStartWidth ?? "0"),
        quotePadding: Number.parseFloat(quoteStyles?.paddingInlineStart ?? "0"),
        overflow: root.scrollWidth - root.clientWidth
      } : null;
    });
    assert(quoteState?.sameRow && quoteState.signpostRatio < 0.3 && quoteState.contentRatio > 0.65 && quoteState.semanticQuote && quoteState.overflow <= 1, "Expected quote wrapper to preserve its 25/75 signpost/content relationship around a semantic blockquote.");
    assert(quoteState && quoteState.citationKeylineDelta <= 1 && quoteState.mediaKeylineDelta <= 1 && quoteState.proseKeylineDelta <= 1, `Expected quote header, citation, prose, and media to share the large grid keylines: ${JSON.stringify(quoteState)}.`);
    assert(quoteState && quoteState.quoteBorder === 0 && quoteState.quotePadding === 0, `Expected the plain-text blockquote to keep no decorative inline rule or indent: ${JSON.stringify(quoteState)}.`);

    await page.close();
  } finally {
    await browser.close();
  }
}

export async function verifyRichListsAndTabSectionGeometry(origin: string): Promise<void> {
  const browser = await openBrowser();
  const tiers = ["editorial", "documentation", "app", "os"] as const;

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1600, height: 1200 }
    });

    await page.goto(`${origin}/demo/components/rich-list-horizontal.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tier of tiers) {
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
      const sections = page.locator(".bf-rich-list.is-horizontal");
      const markerState = await page.evaluate(() => {
        const root = document.querySelector<HTMLElement>("main[data-baseline-label='rich horizontal list page']");
        const layouts = Array.from(root?.querySelectorAll<HTMLElement>(".bf-rich-list-layout") ?? []);
        return root ? {
          markers: root.querySelectorAll("[data-baseline-check]").length,
          overflow: root.scrollWidth - root.clientWidth,
          layoutRowGaps: layouts.map(layout => Number.parseFloat(getComputedStyle(layout).rowGap))
        } : null;
      });
      assert(markerState && markerState.markers >= 18 && markerState.overflow <= 1, `Expected ${tier} rich horizontal fixtures to retain baseline markers and avoid overflow: ${JSON.stringify(markerState)}.`);
      assert(markerState.layoutRowGaps.every(gap => gap > 0), `Expected ${tier} rich-list layouts to own a dense inter-slot stack gap.`);

      for (const width of ["65ch", "66ch", "100ch"] as const) {
        const states = await sections.evaluateAll((roots, widthValue) => roots.map(root => {
          const section = root as HTMLElement;
          section.style.inlineSize = widthValue;
          const list = section.querySelector<HTMLElement>(".bf-rich-list-list");
          const slot = section.querySelector<HTMLElement>(".bf-rich-list-list-slot");
          const items = Array.from(section.querySelectorAll<HTMLElement>(".bf-rich-list-list > .bf-list-item"));
          const firstRule = items[0] ? getComputedStyle(items[0], "::after").content : "none";
          const ruleStarts = items.filter(item => getComputedStyle(item, "::after").content !== "none").length;
          return {
            className: section.className,
            columns: list ? getComputedStyle(list).gridTemplateColumns.split(/\s+/).filter(Boolean).length : 0,
            slotWidth: slot?.getBoundingClientRect().width ?? 0,
            firstRule,
            ruleStarts,
            overflow: section.scrollWidth - section.clientWidth
          };
        }), width);
        const expectedColumns = width === "65ch" ? 1 : width === "66ch" ? 2 : 4;
        assert(states.every(state => state.columns === expectedColumns), `Expected ${tier} rich horizontal lists at ${width} to use ${expectedColumns} item columns: ${JSON.stringify(states)}.`);
        assert(states.every(state => state.slotWidth > 0 && state.firstRule !== "none" && state.ruleStarts >= 1 && state.overflow <= 1), `Expected ${tier} rich horizontal lists at ${width} to retain continuous row rules and avoid overflow.`);
      }

      const splitState = await sections.nth(1).evaluate(root => {
        const section = root as HTMLElement;
        section.style.inlineSize = "66rem";
        const layout = section.querySelector<HTMLElement>(":scope > .bf-rich-list-layout");
        const header = section.querySelector<HTMLElement>(".bf-rich-list-header")?.getBoundingClientRect();
        const support = section.querySelector<HTMLElement>(".bf-rich-list-support")?.getBoundingClientRect();
        return layout && header && support ? { columns: getComputedStyle(layout).gridTemplateColumns.split(/\s+/).filter(Boolean).length, sameRow: Math.abs(header.top - support.top) <= 1, separated: Math.abs(header.left - support.left) > 1 } : null;
      });
      assert(splitState?.columns === 2 && splitState.sameRow && splitState.separated, `Expected ${tier} rich horizontal 50/50 title/support rails at the shared readable threshold.`);
    }

    await page.goto(`${origin}/demo/components/rich-list-vertical.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tier of tiers) {
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
      for (const width of [719, 720] as const) {
        const states = await page.locator(".bf-rich-list.is-vertical").evaluateAll((roots, widthValue) => roots.map(root => {
          const section = root as HTMLElement;
          section.style.inlineSize = `${widthValue}px`;
          const layout = section.querySelector<HTMLElement>(":scope > .bf-rich-list-layout");
          const content = section.querySelector<HTMLElement>(".bf-rich-list-content");
          const media = section.querySelector<HTMLElement>(".bf-rich-list-media");
          const frame = section.querySelector<HTMLElement>(".bf-rich-list-media-frame");
          const contentRect = content?.getBoundingClientRect();
          const mediaRect = media?.getBoundingClientRect();
          const frameRect = frame?.getBoundingClientRect();
          return {
            className: section.className,
            columns: layout ? getComputedStyle(layout).gridTemplateColumns.split(/\s+/).filter(Boolean).length : 0,
            sameRow: !!contentRect && !!mediaRect && Math.abs(contentRect.top - mediaRect.top) <= 1,
            mediaBeforeContent: !!contentRect && !!mediaRect && mediaRect.top < contentRect.top,
            flippedColumns: content && media ? [getComputedStyle(content).gridColumnStart, getComputedStyle(media).gridColumnStart] : [],
            frameRatio: frameRect && frameRect.height > 0 ? frameRect.width / frameRect.height : 0,
            fit: media ? getComputedStyle(media.querySelector(".bf-rich-list-media-frame > *") as Element).objectFit : "",
            overflow: section.scrollWidth - section.clientWidth
          };
        }), width);
        for (const state of states) {
          const wide = width === 720;
          assert(state.columns === (wide ? 2 : 1), `Expected ${tier} rich vertical ${state.className} to switch to ${wide ? "two" : "one"} layout column(s) at ${width}px.`);
          assert(state.overflow <= 1, `Expected ${tier} rich vertical ${state.className} to avoid overflow at ${width}px.`);
          if (wide) {
            assert(state.sameRow && (state.className.includes("is-flipped") ? state.flippedColumns.join(",") === "2,1" : state.flippedColumns.join(",") === "1,2"), `Expected ${tier} rich vertical ${state.className} to preserve its wide logical column order.`);
          } else {
            assert(!state.sameRow, `Expected ${tier} rich vertical ${state.className} to stack content and media below 720px.`);
          }
          if (state.className.includes("is-contain")) assert(state.fit === "contain", `Expected ${tier} flipped rich vertical media to use object-fit contain.`);
          if (state.className.includes("is-video")) assert(Math.abs(state.frameRatio - (16 / 9)) <= 0.04, `Expected ${tier} video rich vertical frame to retain 16:9.`);
          if (state.className.includes("is-narrow-3-2") && !wide) assert(Math.abs(state.frameRatio - (3 / 2)) <= 0.04, `Expected ${tier} narrow rich vertical frame to retain 3:2.`);
          if (state.className.includes("is-wide-2-3") && wide) assert(Math.abs(state.frameRatio - (2 / 3)) <= 0.04, `Expected ${tier} wide portrait rich vertical frame to retain 2:3.`);
        }
      }
      const verticalMarkers = await page.evaluate(() => {
        const root = document.querySelector<HTMLElement>("main[data-baseline-label='rich vertical list page']");
        return root ? root.querySelectorAll("[data-baseline-check]").length : 0;
      });
      assert(verticalMarkers >= 16, `Expected ${tier} rich vertical fixtures to retain baseline coverage.`);
    }

    await page.goto(`${origin}/demo/components/tab-section.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tier of tiers) {
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
      const geometry = await page.locator(".bf-tab-section").evaluateAll((roots, widthValue) => roots.map(root => {
        const section = root as HTMLElement;
        section.style.inlineSize = `${widthValue}px`;
        const layout = section.querySelector<HTMLElement>(".bf-tab-section-body");
        const header = section.querySelector<HTMLElement>(".bf-tab-section-header")?.getBoundingClientRect();
        const intro = section.querySelector<HTMLElement>(".bf-tab-section-intro")?.getBoundingClientRect();
        const tabs = section.querySelector<HTMLElement>(".bf-tab-section-tabs")?.getBoundingClientRect();
        return {
          className: section.className,
          columns: layout ? getComputedStyle(layout).gridTemplateColumns.split(/\s+/).filter(Boolean).length : 0,
          rowGap: layout ? Number.parseFloat(getComputedStyle(layout).rowGap) : 0,
          headerTop: header?.top ?? 0,
          introTop: intro?.top ?? 0,
          tabsTop: tabs?.top ?? 0,
          headerLeft: header?.left ?? 0,
          introLeft: intro?.left ?? 0,
          tabsLeft: tabs?.left ?? 0,
          overflow: section.scrollWidth - section.clientWidth
        };
      }), 720);
      assert(geometry.length === 3, `Expected ${tier} tab section to expose three layout specimens.`);
      for (const state of geometry) {
        assert(state.columns === 4 && state.rowGap > 0 && state.overflow <= 1, `Expected ${tier} ${state.className} tab section body to retain four large grid columns and a parent-owned shallow row gap without overflow.`);
        if (state.className.includes("is-50-50")) {
          assert(Math.abs(state.headerTop - state.tabsTop) <= 1 && Math.abs(state.headerLeft - state.tabsLeft) > 1, `Expected ${tier} unadorned 50/50 tabs to share the large row with the heading.`);
        } else {
          assert(state.introTop === 0 || Math.abs(state.headerTop - state.introTop) <= 1, `Expected ${tier} tab section heading and intro to share their large row when intro exists.`);
          assert(state.tabsTop > state.headerTop, `Expected ${tier} tab rail to follow the large heading/intro row.`);
        }
      }
      const narrowGeometry = await page.locator(".bf-tab-section").evaluateAll(roots => roots.map(root => {
        const section = root as HTMLElement;
        section.style.inlineSize = "44.9375rem";
        const layout = section.querySelector<HTMLElement>(".bf-tab-section-body");
        const children = Array.from(layout?.children ?? []).map(child => child.getBoundingClientRect());
        return { columns: layout ? getComputedStyle(layout).gridTemplateColumns.split(/\s+/).filter(Boolean).length : 0, rows: new Set(children.map(rect => Math.round(rect.top))).size, rowGap: layout ? Number.parseFloat(getComputedStyle(layout).rowGap) : 0, overflow: section.scrollWidth - section.clientWidth };
      }));
      assert(narrowGeometry.every(state => state.columns === 1 && state.rows >= 2 && state.rowGap > 0 && state.overflow <= 1), `Expected ${tier} tab-section bodies to stack with a parent-owned shallow gap below the shared 45rem threshold without overflow: ${JSON.stringify(narrowGeometry)}.`);

      const firstTab = page.locator(".bf-tab-section").first().locator("[role='tab']").first();
      await firstTab.focus();
      await page.keyboard.press("ArrowRight");
      const moved = page.locator(".bf-tab-section").first().locator("[role='tab']").nth(1);
      assert(await moved.getAttribute("aria-selected") === "true" && await moved.getAttribute("tabindex") === "0", `Expected ${tier} tab section ArrowRight to move selection and roving focus.`);
      await page.keyboard.press("Home");
      assert(await firstTab.getAttribute("aria-selected") === "true", `Expected ${tier} tab section Home to select the first tab.`);
      await page.keyboard.press("End");
      assert(await moved.getAttribute("aria-selected") === "true", `Expected ${tier} tab section End to select the final tab.`);
      const panelState = await page.locator(".bf-tab-section").first().locator("[role='tabpanel']").evaluateAll(panels => panels.map(panel => ({ hidden: panel.getAttribute("aria-hidden"), display: getComputedStyle(panel).display })));
      assert(panelState.filter(panel => panel.hidden === "false").length === 1 && panelState.filter(panel => panel.hidden === "true").length === 1, `Expected ${tier} tab section to synchronize one visible and one hidden panel.`);
    }
    await page.close();
  } finally {
    await browser.close();
  }
}

export async function verifyLinkedLogoAndStickyFooterGeometry(origin: string): Promise<void> {
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1600, height: 1200 }
    });

    await page.goto(`${origin}/demo/components/linked-logo-section.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const tiers = ["editorial", "documentation", "app", "os"] as const;
    const widths = [
      { value: "37.5rem", expectedColumns: 1, label: "below 620px" },
      { value: "38.75rem", expectedColumns: 2, label: "at 620px" },
      { value: "64.75rem", expectedColumns: 2, label: "at 1036px" }
    ] as const;

    for (const tier of tiers) {
      const tierSelect = page.locator("[data-page-chrome-tier-select]");
      await tierSelect.selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);

      for (const width of widths) {
        const measurements = await page.locator(".bf-linked-logo-section").evaluateAll((roots, widthValue) => {
          const rootWidth = Number.parseFloat(widthValue);
          return roots.map(root => {
            const section = root as HTMLElement;
            section.style.inlineSize = widthValue;
            const layout = section.querySelector<HTMLElement>(":scope > .bf-linked-logo-section-layout");
            const header = section.querySelector<HTMLElement>(":scope > .bf-linked-logo-section-layout > .bf-linked-logo-section-header");
            const logos = section.querySelector<HTMLElement>(":scope > .bf-linked-logo-section-layout > .bf-linked-logo-section-logos");
            const cards = Array.from(section.querySelectorAll<HTMLElement>(".bf-linked-logo-section-card"));
            const markRatios = cards.map(card => {
              const mark = card.querySelector<HTMLElement>(".bf-linked-logo-section-mark")?.getBoundingClientRect();
              return mark && mark.height > 0 ? mark.width / mark.height : 0;
            });
            const layoutRect = layout?.getBoundingClientRect();
            const headerRect = header?.getBoundingClientRect();
            const logosRect = logos?.getBoundingClientRect();
            const ratio = headerRect && logosRect && headerRect.width > 0 ? logosRect.width / headerRect.width : 0;
            const sectionRect = section.getBoundingClientRect();
            const starts = new Set(cards.map(card => Math.round(card.getBoundingClientRect().left)));
            const spacing = cards.map(card => {
              const mark = card.querySelector<HTMLElement>(".bf-linked-logo-section-mark");
              const rule = card.querySelector<HTMLElement>(".bf-linked-logo-section-card-rule");
              const copy = card.querySelector<HTMLElement>(".bf-linked-logo-section-card-copy");
              if (!mark || !rule || !copy) return null;
              const markRect = mark.getBoundingClientRect();
              const ruleRect = rule.getBoundingClientRect();
              const copyRect = copy.getBoundingClientRect();
              return {
                rowGap: Number.parseFloat(getComputedStyle(card).rowGap),
                markCompensation: Number.parseFloat(getComputedStyle(mark).marginBlockEnd),
                markToRule: ruleRect.top - markRect.bottom,
                ruleToCopy: copyRect.top - ruleRect.bottom,
                ruleHeight: ruleRect.height
              };
            }).filter(Boolean);
            return {
              className: section.className,
              requestedWidth: rootWidth,
              actualWidth: sectionRect.width,
              columns: starts.size,
              ratio,
              layoutColumns: layout ? getComputedStyle(layout).gridTemplateColumns.split(/\s+/).filter(Boolean).length : 0,
              markRatios,
              spacing,
              overflow: section.scrollWidth - section.clientWidth,
              layoutWidth: layoutRect?.width ?? 0
            };
          });
        }, width.value);

        assert(measurements.every(measurement => Math.abs(measurement.actualWidth - measurement.requestedWidth * 16) <= 1), `Expected ${tier} linked-logo sections to honor their ${width.label} intrinsic width.`);
        for (const measurement of measurements) {
          const expectedColumns = width.value === "64.75rem"
            ? (measurement.className.includes("is-full") ? 4 : measurement.className.includes("is-25-75") ? 3 : 2)
            : width.expectedColumns;
          assert(measurement.columns === expectedColumns, `Expected ${tier} ${measurement.className} linked-logo cards to use ${expectedColumns} column(s) ${width.label}; got ${measurement.columns}.`);
          assert(measurement.markRatios.every(ratio => Math.abs(ratio - (16 / 9)) <= 0.02), `Expected ${tier} ${measurement.className} linked-logo marks to retain a 16:9 ratio.`);
          assert(measurement.spacing.every(item => item && item.ruleHeight === 0 && Math.abs(item.ruleToCopy - item.rowGap) <= 0.1 && Math.abs(item.markToRule - item.rowGap - item.markCompensation) <= 0.1), `Expected ${tier} ${measurement.className} linked-logo cards to use the parent row gap around a zero-height divider while retaining only mark grid-closure compensation; got ${JSON.stringify(measurement.spacing)}.`);
          assert(measurement.overflow <= 1, `Expected ${tier} ${measurement.className} linked-logo section at ${width.label} to avoid inline overflow.`);

          const isLarge = width.value === "64.75rem";
          if (isLarge && measurement.className.includes("is-full")) {
            assert(measurement.columns === 4 && measurement.layoutColumns === 1, `Expected ${tier} full linked-logo rail at 1036px to use four cards across one section column.`);
          }
          if (isLarge && measurement.className.includes("is-50-50")) {
            assert(measurement.columns === 2 && measurement.layoutColumns === 2 && Math.abs(measurement.ratio - 1) <= 0.08, `Expected ${tier} 50/50 linked-logo rail at 1036px to preserve equal header/logo measures.`);
          }
          if (isLarge && measurement.className.includes("is-25-75")) {
            assert(measurement.columns === 3 && measurement.layoutColumns === 2 && Math.abs(measurement.ratio - 3) <= 0.14, `Expected ${tier} 25/75 linked-logo rail at 1036px to preserve the 1:3 header/logo measures.`);
          }
        }
      }
    }
    await page.emulateMedia({ forcedColors: "active" });
    const forcedDivider = await page.locator(".bf-linked-logo-section-card-rule").first().evaluate(rule => {
      const style = getComputedStyle(rule, "::after");
      return { color: style.borderBlockStartColor, width: Number.parseFloat(style.borderBlockStartWidth), pointerEvents: style.pointerEvents };
    });
    assert(forcedDivider.width > 0 && forcedDivider.color !== "rgba(0, 0, 0, 0)" && forcedDivider.pointerEvents === "none", `Expected the linked-logo divider to remain a pointer-transparent one-sided system-color stroke in forced colors; got ${JSON.stringify(forcedDivider)}.`);
    await page.emulateMedia({ forcedColors: "none" });

    await page.goto(`${origin}/demo/components/sticky-footer.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const footerHeightProgression = new Map<string, number[]>();
    const footerStripProgression = new Map<string, number[]>();
    for (const tier of tiers) {
      const tierSelect = page.locator("[data-page-chrome-tier-select]");
      await tierSelect.selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);

      for (const viewport of [
        { width: 360, height: 844, label: "at a narrow width" },
        { width: 1280, height: 900, label: "at a wide width" }
      ] as const) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.waitForTimeout(50);
        const state = await page.evaluate(viewportHeight => {
          const shells = Array.from(document.querySelectorAll<HTMLElement>(".bf-page-shell.is-site-layout"));
          const shortShell = shells[0];
          const longShell = shells[1];
          const shortScrollOwner = shortShell?.parentElement;
          const longScrollOwner = longShell?.parentElement;
          const shortMain = shortShell?.querySelector<HTMLElement>(":scope > .bf-site-main");
          const shortFooter = shortShell?.querySelector<HTMLElement>(":scope > .bf-site-footer.is-sticky");
          const longMain = longShell?.querySelector<HTMLElement>(":scope > .bf-site-main");
          const longFooter = longShell?.querySelector<HTMLElement>(":scope > .bf-site-footer.is-sticky");
          if (!shortShell || !longShell || !shortScrollOwner || !longScrollOwner || !shortMain || !shortFooter || !longMain || !longFooter) return null;
          let probe = longMain.querySelector<HTMLElement>(":scope > [data-sticky-footer-long-probe]");
          if (!probe) {
            probe = document.createElement("div");
            probe.dataset.stickyFooterLongProbe = "";
            probe.setAttribute("aria-hidden", "true");
            longMain.append(probe);
          }
          probe.style.blockSize = `${viewportHeight}px`;
          const shortShellStyle = getComputedStyle(shortShell);
          const longShellStyle = getComputedStyle(longShell);
          const longMainStyle = getComputedStyle(longMain);
          const shortScrollRect = shortScrollOwner.getBoundingClientRect();
          const longScrollRect = longScrollOwner.getBoundingClientRect();
          return {
            shortDisplay: shortShellStyle.display,
            shortMinBlockSize: shortShellStyle.minBlockSize,
            shortShellFillDelta: shortScrollRect.height - shortShell.getBoundingClientRect().height,
            shortFooterBottomDelta: shortScrollRect.bottom - shortFooter.getBoundingClientRect().bottom,
            longDisplay: longShellStyle.display,
            longMinBlockSize: longShellStyle.minBlockSize,
            longMainFlexShrink: longMainStyle.flexShrink,
            longFooterAfterMain: longFooter.getBoundingClientRect().top >= longMain.getBoundingClientRect().bottom - 1,
            longMainOverflow: longMain.scrollHeight - longMain.clientHeight,
            longShellTallerThanOwner: longShell.getBoundingClientRect().height > longScrollRect.height + 1,
            longFooterReachable: longScrollOwner.scrollHeight >= longFooter.offsetTop + longFooter.offsetHeight - 1,
            shortFooterHeight: shortFooter.getBoundingClientRect().height,
            stripSpace: Number.parseFloat(getComputedStyle(document.body).getPropertyValue("--bf-strip-space")),
            shortOverflow: shortShell.scrollWidth - shortShell.clientWidth,
            longOverflow: longShell.scrollWidth - longShell.clientWidth
          };
        }, viewport.height);
        assert(state, `Expected ${tier} sticky-footer shell geometry at ${viewport.label}.`);
        assert(state.shortDisplay === "flex", `Expected ${tier} sticky-footer short shell to enable flex pinning ${viewport.label}.`);
        assert(state.shortMinBlockSize !== "0px" && Math.abs(state.shortShellFillDelta) <= 1 && Math.abs(state.shortFooterBottomDelta) <= 1, `Expected ${tier} short sticky footer to meet the application-main block-end ${viewport.label}.`);
        assert(state.longDisplay === "flex" && state.longMainFlexShrink === "0" && state.longFooterAfterMain, `Expected ${tier} long sticky footer to follow the non-shrinking site main ${viewport.label}.`);
        assert(state.longMainOverflow <= 1, `Expected ${tier} long sticky-footer main not to shrink below its content ${viewport.label}; overflow=${state.longMainOverflow}px.`);
        assert(state.longShellTallerThanOwner && state.longFooterReachable, `Expected ${tier} application main to scroll to the complete long shell and footer ${viewport.label}.`);
        assert(state.shortOverflow <= 1 && state.longOverflow <= 1, `Expected ${tier} nested sticky-footer shells to avoid inline overflow ${viewport.label}.`);
        footerHeightProgression.set(viewport.label, [...(footerHeightProgression.get(viewport.label) ?? []), state.shortFooterHeight]);
        footerStripProgression.set(viewport.label, [...(footerStripProgression.get(viewport.label) ?? []), state.stripSpace]);
      }
    }
    for (const [label, heights] of footerHeightProgression) {
      assert(heights.every((height, index) => index === 0 || height <= heights[index - 1] + 0.1), `Expected site-footer height not to increase across Editorial/Documentation/App/OS ${label}; got ${heights.join(" >= ")}px.`);
      const spaces = footerStripProgression.get(label) ?? [];
      assert(spaces.every((space, index) => index === 0 || space <= spaces[index - 1] + 0.1), `Expected site-footer strip spacing not to increase across Editorial/Documentation/App/OS ${label}; got ${spaces.join(" >= ")}px.`);
    }

    await page.goto(`${origin}/demo/components/hero.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tier of tiers) {
      const tierSelect = page.locator("[data-page-chrome-tier-select]");
      await tierSelect.selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);

      for (const viewport of [
        { width: 360, height: 844, wide: false, label: "at a narrow width" },
        { width: 1280, height: 900, wide: true, label: "at a wide width" }
      ] as const) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.waitForTimeout(50);
        const state = await page.locator(".bf-hero").first().evaluate(root => {
          const lead = root.querySelector<HTMLElement>(":scope > .bf-hero-lead");
          const media = root.querySelector<HTMLElement>(":scope > .bf-hero-media.is-full:last-child");
          if (!lead || !media) return null;
          const rootRect = root.getBoundingClientRect();
          const leadRect = lead.getBoundingClientRect();
          const mediaRect = media.getBoundingClientRect();
          const probe = document.createElement("span");
          probe.style.cssText = "position:absolute;visibility:hidden;display:block;block-size:var(--bf-section-space-shallow);inline-size:var(--bf-section-space)";
          root.append(probe);
          const shallowSpace = probe.getBoundingClientRect().height;
          const sectionSpace = probe.getBoundingClientRect().width;
          probe.remove();
          const rootStyle = getComputedStyle(root);
          const overlayStyle = getComputedStyle(root, "::after");
          return {
            borderStyle: rootStyle.borderBlockStartStyle,
            borderWidth: Number.parseFloat(rootStyle.borderBlockStartWidth),
            overlayShadow: overlayStyle.boxShadow,
            overlayPointerEvents: overlayStyle.pointerEvents,
            finalSlot: root.lastElementChild === media,
            leadToMedia: mediaRect.top - leadRect.bottom,
            shallowSpace,
            mediaToHeroEnd: rootRect.bottom - mediaRect.bottom,
            paddingEnd: Number.parseFloat(getComputedStyle(root).paddingBlockEnd),
            sectionSpace,
            mediaMarginEnd: Number.parseFloat(getComputedStyle(media).marginBlockEnd),
            fullWidthDelta: rootRect.width - mediaRect.width,
            overflow: root.scrollWidth - root.clientWidth
          };
        });
        assert(state, `Expected ${tier} closing-media hero geometry ${viewport.label}.`);
        assert(state.borderStyle === "none" && state.borderWidth === 0 && state.overlayShadow !== "none" && state.overlayPointerEvents === "none", `Expected ${tier} default hero to paint one pointer-transparent entry rule outside layout ${viewport.label}; got ${JSON.stringify(state)}.`);
        assert(state.finalSlot && Math.abs(state.leadToMedia - state.shallowSpace) <= 0.1, `Expected ${tier} hero stack to own the shallow gap before final media ${viewport.label}.`);
        assert(state.mediaMarginEnd === 0 && Math.abs(state.mediaToHeroEnd - state.paddingEnd) <= 0.1, `Expected ${tier} hero exit boundary to begin immediately after closing media ${viewport.label}.`);
        assert(state.paddingEnd === 0, `Expected ${tier} hero to leave its exit boundary to the surrounding stack ${viewport.label}.`);
        assert(Math.abs(state.fullWidthDelta) <= 1 && state.overflow <= 1, `Expected ${tier} closing hero media to remain full-width without overflow ${viewport.label}.`);

        const borderlessState = await page.locator(".bf-hero.is-borderless").evaluate(root => ({
          borderStyle: getComputedStyle(root).borderBlockStartStyle,
          borderWidth: Number.parseFloat(getComputedStyle(root).borderBlockStartWidth),
          overlayContent: getComputedStyle(root, "::after").content,
          overflow: root.scrollWidth - root.clientWidth
        }));
        assert(borderlessState.borderStyle === "none" && borderlessState.borderWidth === 0 && borderlessState.overlayContent === "none", `Expected ${tier} borderless hero to remove only its entry rule ${viewport.label}.`);
        assert(borderlessState.overflow <= 1, `Expected ${tier} borderless hero to avoid inline overflow ${viewport.label}.`);

        const topFlushState = await page.locator(".bf-hero").first().evaluate(root => {
          root.classList.add("is-top-flush");
          const referenceRule = document.createElement("hr");
          root.before(referenceRule);
          const state = {
            borderStyle: getComputedStyle(root).borderBlockStartStyle,
            borderWidth: Number.parseFloat(getComputedStyle(root).borderBlockStartWidth),
            overlayShadow: getComputedStyle(root, "::after").boxShadow,
            paddingStart: Number.parseFloat(getComputedStyle(root).paddingBlockStart),
            ruleClearance: referenceRule.getBoundingClientRect().height + Number.parseFloat(getComputedStyle(referenceRule).marginBlockEnd),
            overflow: root.scrollWidth - root.clientWidth
          };
          referenceRule.remove();
          root.classList.remove("is-top-flush");
          return state;
        });
        assert(topFlushState.borderStyle === "none" && topFlushState.borderWidth === 0 && topFlushState.overlayShadow !== "none", `Expected ${tier} top-flush hero to retain its out-of-flow entry rule ${viewport.label}.`);
        assert(Math.abs(topFlushState.paddingStart - topFlushState.ruleClearance) <= 0.1, `Expected ${tier} top-flush hero to match native-rule clearance ${viewport.label}.`);
        assert(topFlushState.overflow <= 1, `Expected ${tier} top-flush hero to avoid inline overflow ${viewport.label}.`);
      }

      for (const allocation of [
        { width: "44.9375rem", columns: 1, label: "at 719px" },
        { width: "45rem", columns: 2, label: "at 720px" }
      ] as const) {
        const split = await page.locator(".bf-hero").nth(1).evaluate((root, expected) => {
          const hero = root as HTMLElement;
          hero.style.inlineSize = expected.width;
          const layout = hero.querySelector<HTMLElement>(":scope > .bf-hero-layout");
          const title = layout?.querySelector<HTMLElement>(":scope > .bf-hero-title");
          const content = layout?.querySelector<HTMLElement>(":scope > .bf-hero-content");
          const h1 = title?.querySelector<HTMLElement>("h1");
          const h2 = content?.querySelector<HTMLElement>("h2");
          const media = layout?.querySelector<HTMLElement>(":scope > .bf-hero-media.is-full");
          if (!layout || !title || !content || !h1 || !h2 || !media) return null;
          const layoutRect = layout.getBoundingClientRect();
          const titleRect = title.getBoundingClientRect();
          const contentRect = content.getBoundingClientRect();
          const mediaRect = media.getBoundingClientRect();
          return {
            columns: getComputedStyle(layout).gridTemplateColumns.split(/\s+/).filter(Boolean).length,
            h1InTitle: h1.parentElement === title,
            h2InContent: h2.parentElement === content,
            equalTracks: Math.abs(titleRect.width - contentRect.width) <= 1,
            mediaWidthDelta: Math.abs(layoutRect.width - mediaRect.width),
            overflow: hero.scrollWidth - hero.clientWidth
          };
        }, allocation);
        assert(split, `Expected ${tier} default hero split geometry ${allocation.label}.`);
        assert(split.columns === allocation.columns && split.h1InTitle && split.h2InContent && split.mediaWidthDelta <= 1 && split.overflow <= 1, `Expected ${tier} hero to place H1 left/H2 right and use ${allocation.columns} column(s) ${allocation.label}; got ${JSON.stringify(split)}.`);
        if (allocation.columns === 2) assert(split.equalTracks, `Expected ${tier} default hero tracks to remain 50/50 ${allocation.label}.`);
      }
    }

    await page.close();
  } finally {
    await browser.close();
  }
}

export async function verifySitesRecipeCompositions(origin: string): Promise<void> {
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { width: 1600, height: 1200 }
    });
    const tiers = ["editorial", "documentation", "app", "os"] as const;

    await page.goto(`${origin}/demo/components/equal-heights.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tier of tiers) {
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
      for (const width of [600, 620, 1036] as const) {
        await page.setViewportSize({ width, height: 1200 });
        await page.waitForTimeout(50);
        const measurements = await page.locator(".bf-section").evaluateAll((sections, widthValue) => sections.map(section => {
          const root = section as HTMLElement;
          root.style.inlineSize = `${widthValue}px`;
          const row = root.querySelector<HTMLElement>(".bf-equal-height-row");
          if (!row) return null;
          const rootRect = root.getBoundingClientRect();
          const rowRect = row.getBoundingClientRect();
          const columns = Array.from(row.querySelectorAll<HTMLElement>(":scope > .bf-equal-height-row-col"));
          const rects = columns.map(column => column.getBoundingClientRect());
          const baselineProbe = document.createElement("span");
          baselineProbe.style.cssText = "position:absolute;visibility:hidden;inline-size:1px;block-size:var(--bf-baseline)";
          row.append(baselineProbe);
          const baseline = baselineProbe.getBoundingClientRect().height;
          baselineProbe.remove();
          const starts = new Set(rects.map(rect => Math.round(rect.left))).size;
          const rows = new Set(rects.map(rect => Math.round(rect.top))).size;
          const ratios = columns.map(column => {
            const rect = column.getBoundingClientRect();
            return baseline > 0 ? rect.height / baseline : 0;
          });
          return {
            rowClass: row.className,
            rootWidth: rootRect.width,
            rowWidth: rowRect.width,
            rowLeft: rowRect.left,
            rootRight: rootRect.right,
            starts,
            rows,
            baseline,
            baselineRatios: ratios,
            rootOverflow: root.scrollWidth - root.clientWidth,
            rowOverflow: row.scrollWidth - row.clientWidth
          };
        }), width);

        const valid = measurements.filter((measurement): measurement is NonNullable<typeof measurement> => measurement !== null);
        assert(valid.length === 3, `Expected equal-heights to expose three measured recipe rows for ${tier} at ${width}px.`);
        for (const measurement of valid) {
          assert(Math.abs(measurement.rootWidth - width) <= 1, `Expected ${tier} ${measurement.rowClass} recipe section to honor ${width}px width.`);
          assert(measurement.baseline > 0 && measurement.baselineRatios.every(ratio => Math.abs(ratio - Math.round(ratio)) <= 0.06), `Expected ${tier} ${measurement.rowClass} row columns to remain baseline multiples at ${width}px.`);
          assert(measurement.rootOverflow <= 1 && measurement.rowOverflow <= 1, `Expected ${tier} ${measurement.rowClass} recipe to avoid overflow at ${width}px.`);
          const expectedStarts = width < 620 ? 1 : width < 1036 ? 2 : measurement.rowClass.includes("is-columns-3") ? 3 : measurement.rowClass.includes("is-columns-2") ? 2 : 4;
          assert(measurement.starts === expectedStarts, `Expected ${tier} ${measurement.rowClass} recipe to use ${expectedStarts} column(s) at ${width}px, got ${measurement.starts}.`);
          const itemCount = measurement.rowClass.includes("is-columns-3") ? 3 : measurement.rowClass.includes("is-columns-2") ? 2 : 4;
          const expectedRows = width < 620 ? itemCount : width < 1036 ? Math.ceil(itemCount / 2) : 1;
          assert(measurement.rows === expectedRows, `Expected ${tier} ${measurement.rowClass} recipe to use ${expectedRows} row(s) at ${width}px, got ${measurement.rows}.`);
          if (width >= 1036 && (measurement.rowClass.includes("is-columns-2") || measurement.rowClass.includes("is-columns-3"))) {
            const expectedRatio = measurement.rowClass.includes("is-columns-2") ? 0.5 : 0.75;
            assert(Math.abs((measurement.rowWidth / measurement.rootWidth) - expectedRatio) <= 0.04, `Expected ${tier} ${measurement.rowClass} recipe to occupy the trailing ${expectedRatio * 100}% at large width.`);
            assert(Math.abs(measurement.rootRight - (measurement.rowLeft + measurement.rowWidth)) <= 1, `Expected ${tier} ${measurement.rowClass} recipe to align to the trailing edge at large width.`);
          }
        }
      }
    }

    await page.goto(`${origin}/demo/components/empty-state.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    for (const tier of tiers) {
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
      for (const width of [600, 1036] as const) {
        await page.setViewportSize({ width, height: 1200 });
        const state = await page.evaluate(() => {
          const sections = Array.from(document.querySelectorAll<HTMLElement>("main > .bf-section"));
          const search = document.querySelector<HTMLInputElement>(".bf-search-box input[type='search']");
          const notification = document.querySelector<HTMLElement>(".bf-notification.is-negative[role='alert']");
          const notificationTitle = notification?.querySelector<HTMLElement>(".bf-notification-title.bf-h6");
          const actions = Array.from(document.querySelectorAll<HTMLElement>(".bf-button"));
          return {
            sections: sections.length,
            sectionOverflow: sections.map(section => section.scrollWidth - section.clientWidth),
            baselineMarkers: document.querySelectorAll("[data-baseline-check]").length,
            search: !!search,
            searchLabel: !!search && !!document.querySelector(`label[for='${search.id}']`),
            notification: !!notification,
            notificationTitle: !!notificationTitle,
            actions: actions.length,
            emptySelector: document.querySelector(".bf-empty-state") !== null
          };
        });
        assert(state.sections === 3 && state.baselineMarkers >= 12, `Expected ${tier} empty-state recipes to retain three sections and baseline markers at ${width}px.`);
        assert(state.sectionOverflow.every(delta => delta <= 1), `Expected ${tier} empty-state recipes to avoid inline overflow at ${width}px.`);
        assert(state.search && state.searchLabel && state.notification && state.notificationTitle && state.actions >= 2 && !state.emptySelector, `Expected ${tier} empty-state recipes to retain accessible search/actions/current-notification composition without a dedicated selector at ${width}px.`);
      }
    }
    await page.close();
  } finally {
    await browser.close();
  }
}

export async function verifyContentCardGeometry(origin: string): Promise<void> {
  const tiers = ["editorial", "documentation", "app", "os"] as const;
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({ deviceScaleFactor: 1, viewport: { width: 1200, height: 1200 } });
    await page.goto(`${origin}/demo/components/content-card.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);

    const readState = async () => page.evaluate(() => {
      const probe = document.createElement("span");
      probe.style.cssText = "position:absolute;visibility:hidden;inline-size:1px;block-size:var(--bf-baseline)";
      document.body.append(probe);
      const baseline = probe.getBoundingClientRect().height;
      probe.style.blockSize = "var(--bf-field-gap)";
      const fieldGap = probe.getBoundingClientRect().height;
      probe.remove();
      const cards = Array.from(document.querySelectorAll<HTMLElement>(".bf-content-card"));
      return {
        baseline,
        fieldGap,
        cards: cards.map(card => {
          const wrapper = card.closest<HTMLElement>(".bf-content-card-wrapper");
          const frame = card.querySelector<HTMLElement>(".bf-content-card-frame");
          const media = card.querySelector<HTMLElement>(".bf-content-card-media");
          const content = card.querySelector<HTMLElement>(".bf-content-card-content");
          const title = card.querySelector<HTMLElement>(".bf-content-card-title");
          const mainLink = card.querySelector<HTMLElement>(".bf-content-card-main-link");
          const description = card.querySelector<HTMLElement>(".bf-content-card-description");
          const cardRect = card.getBoundingClientRect();
          const wrapperRect = wrapper?.getBoundingClientRect();
          const frameRect = frame?.getBoundingClientRect();
          const mediaRect = media?.getBoundingClientRect();
          const contentRect = content?.getBoundingClientRect();
          const titleStyle = title ? getComputedStyle(title) : null;
          const linkStyle = mainLink ? getComputedStyle(mainLink) : null;
          const descriptionStyle = description ? getComputedStyle(description) : null;
          const footer = card.querySelector<HTMLElement>(".bf-content-card-footer");
          const footerInner = card.querySelector<HTMLElement>(".bf-content-card-footer-inner");
          const firstFooterItem = footerInner?.firstElementChild as HTMLElement | null;
          const footerRect = footer?.getBoundingClientRect();
          const footerItemRect = firstFooterItem?.getBoundingClientRect();
          const cardStyle = getComputedStyle(card);
          const overlayStyle = getComputedStyle(card, "::after");
          const footerOverlayStyle = footer ? getComputedStyle(footer, "::after") : null;
          return {
            className: card.className,
            width: cardRect.width,
            height: cardRect.height,
            wrapperHeight: wrapperRect?.height ?? 0,
            wrapperGridColumn: wrapper ? getComputedStyle(wrapper).gridColumn : "",
            frameDisplay: frame ? getComputedStyle(frame).display : "",
            mediaTop: mediaRect?.top ?? 0,
            contentTop: contentRect?.top ?? 0,
            mediaLeft: mediaRect?.left ?? 0,
            contentLeft: contentRect?.left ?? 0,
            titleFontSize: titleStyle?.fontSize ?? "",
            linkClamp: linkStyle?.webkitLineClamp ?? "",
            linkLineHeight: linkStyle ? Number.parseFloat(linkStyle.lineHeight) : 0,
            linkHeight: mainLink?.getBoundingClientRect().height ?? 0,
            descriptionClamp: descriptionStyle?.webkitLineClamp ?? "",
            descriptionLineHeight: descriptionStyle ? Number.parseFloat(descriptionStyle.lineHeight) : 0,
            descriptionHeight: description?.getBoundingClientRect().height ?? 0,
            footerClearance: footerRect && footerItemRect ? footerItemRect.top - footerRect.top - Number.parseFloat(getComputedStyle(footer).borderBlockStartWidth) : null,
            footerPaddingStart: footerInner ? Number.parseFloat(getComputedStyle(footerInner).paddingBlockStart) : null,
            borderWidths: [cardStyle.borderBlockStartWidth, cardStyle.borderBlockEndWidth, cardStyle.borderInlineStartWidth, cardStyle.borderInlineEndWidth],
            overlay: {
              content: overlayStyle.content,
              inset: [overlayStyle.top, overlayStyle.right, overlayStyle.bottom, overlayStyle.left],
              pointerEvents: overlayStyle.pointerEvents,
              position: overlayStyle.position,
              shadow: overlayStyle.boxShadow
            },
            footerOverlay: footerOverlayStyle ? {
              content: footerOverlayStyle.content,
              inset: [footerOverlayStyle.top, footerOverlayStyle.right, footerOverlayStyle.bottom, footerOverlayStyle.left],
              pointerEvents: footerOverlayStyle.pointerEvents,
              position: footerOverlayStyle.position,
              shadow: footerOverlayStyle.boxShadow
            } : null,
            mainLinkAfterPosition: mainLink ? getComputedStyle(mainLink, "::after").position : "",
            overflow: card.scrollWidth - card.clientWidth
          };
        })
      };
    });

    const assertBaselineSnapped = (state: Awaited<ReturnType<typeof readState>>, label: string) => {
      assert(state.baseline > 0, `Expected ${label} to resolve a positive BF baseline.`);
      for (const card of state.cards) {
        assert(Math.abs(card.height - Math.round(card.height / state.baseline) * state.baseline) <= contentCardBaselineTolerancePx, `Expected ${label} ${card.className} card height to snap to the baseline (height=${card.height}, baseline=${state.baseline}).`);
        assert(Math.abs(card.wrapperHeight - Math.round(card.wrapperHeight / state.baseline) * state.baseline) <= contentCardBaselineTolerancePx, `Expected ${label} ${card.className} wrapper height to snap to the baseline (height=${card.wrapperHeight}, baseline=${state.baseline}).`);
        assert(card.overflow <= 1, `Expected ${label} ${card.className} card to avoid inline overflow.`);
        assert(card.borderWidths.every(width => width === "0px"), `Expected ${label} ${card.className} boundary to consume no layout border; got ${card.borderWidths.join(", ")}.`);
        assert(card.overlay.content !== "none" && card.overlay.position === "absolute" && card.overlay.pointerEvents === "none" && card.overlay.inset.every(value => value === "0px") && card.overlay.shadow !== "none", `Expected ${label} ${card.className} to use an exact, pointer-transparent automatic overlay; got ${JSON.stringify(card.overlay)}.`);
        assert(card.mainLinkAfterPosition === "absolute", `Expected ${label} ${card.className} expanded main link to retain its root-card anchor.`);
        if (card.footerOverlay) assert(card.footerOverlay.content !== "none" && card.footerOverlay.position === "absolute" && card.footerOverlay.pointerEvents === "none" && card.footerOverlay.inset.every(value => value === "0px") && card.footerOverlay.shadow !== "none", `Expected ${label} ${card.className} footer rule to use its own exact automatic overlay; got ${JSON.stringify(card.footerOverlay)}.`);
        if (card.footerClearance !== null) assert(card.footerPaddingStart !== null && Math.abs(card.footerPaddingStart - state.fieldGap) <= 0.05 && card.footerClearance >= state.fieldGap - 0.05, `Expected ${label} ${card.className} footer owner to reserve the tier field gap (${state.fieldGap}px) before its aligned content; got padding=${card.footerPaddingStart}px, clearance=${card.footerClearance}px.`);
      }
    };

    for (const tier of tiers) {
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
      await page.locator(".bf-content-card").evaluateAll(cards => cards.forEach(card => {
        const element = card as HTMLElement;
        element.style.removeProperty("inline-size");
        element.style.removeProperty("max-inline-size");
        element.style.removeProperty("flex");
      }));

      for (const viewport of [
        { width: 1200, label: "1200px" },
        { width: 320, label: "320px" }
      ]) {
        await page.setViewportSize({ width: viewport.width, height: 1200 });
        await page.waitForTimeout(60);
        const state = await readState();
        assertBaselineSnapped(state, `${tier} at ${viewport.label}`);
        assert(state.cards.length >= 7, `Expected ${tier} content-card fixture to expose all image/no-image and span variants at ${viewport.label}.`);
        assert(state.cards.some(card => card.className.includes("is-cols-2")) && state.cards.some(card => card.className.includes("is-cols-4")) && state.cards.some(card => card.className.includes("is-cols-6")) && state.cards.some(card => card.className.includes("is-cols-8")), `Expected ${tier} content-card fixture to preserve 2/4/6/8 span classes at ${viewport.label}.`);
        assert(state.cards.every(card => card.width > 0), `Expected ${tier} content-card cards to retain positive allocated width at ${viewport.label}.`);
        if (viewport.width === 320) {
          const narrowWidth = Math.max(...state.cards.map(card => card.width));
          assert(state.cards.every(card => Math.abs(card.width - narrowWidth) <= 1), `Expected ${tier} content-card wrappers to occupy the shared narrow track.`);
        }
      }

      await page.setViewportSize({ width: 1200, height: 1200 });
      await page.waitForTimeout(60);
      const normalFour = page.locator(".bf-content-card.is-cols-4:not(.is-image-top)").first();
      const featureEight = page.locator(".bf-content-card.is-cols-8").first();
      const imageTop = page.locator(".bf-content-card.is-image-top").first();

      await normalFour.evaluate(card => {
        const element = card as HTMLElement;
        element.style.inlineSize = "30rem";
        element.style.maxInlineSize = "none";
        element.style.flex = "0 0 auto";
      });
      let reflow = await normalFour.evaluate(card => {
        const frame = card.querySelector<HTMLElement>(".bf-content-card-frame")?.getBoundingClientRect();
        const media = card.querySelector<HTMLElement>(".bf-content-card-media")?.getBoundingClientRect();
        const content = card.querySelector<HTMLElement>(".bf-content-card-content")?.getBoundingClientRect();
        return frame && media && content ? { display: getComputedStyle(card.querySelector(".bf-content-card-frame") as Element).display, sameRow: Math.abs(media.top - content.top) <= 1, frameWidth: frame.width } : null;
      });
      assert(reflow?.sameRow && reflow.frameWidth >= 460, `Expected ${tier} four-column content-card to reflow horizontally when allocated at least 460px.`);

      await normalFour.evaluate(card => { const element = card as HTMLElement; element.style.inlineSize = "20rem"; element.style.maxInlineSize = "none"; });
      reflow = await normalFour.evaluate(card => {
        const frame = card.querySelector<HTMLElement>(".bf-content-card-frame");
        const media = card.querySelector<HTMLElement>(".bf-content-card-media")?.getBoundingClientRect();
        const content = card.querySelector<HTMLElement>(".bf-content-card-content")?.getBoundingClientRect();
        return frame && media && content ? { display: getComputedStyle(frame).display, stacked: content.top > media.top + 1 } : null;
      });
      assert(reflow?.stacked, `Expected ${tier} four-column content-card to stack below its intrinsic 460px allocation threshold.`);

      await featureEight.evaluate(card => { const element = card as HTMLElement; element.style.inlineSize = "64rem"; element.style.maxInlineSize = "none"; });
      reflow = await featureEight.evaluate(card => {
        const frame = card.querySelector<HTMLElement>(".bf-content-card-frame");
        const media = card.querySelector<HTMLElement>(".bf-content-card-media")?.getBoundingClientRect();
        const content = card.querySelector<HTMLElement>(".bf-content-card-content")?.getBoundingClientRect();
        return frame && media && content ? { display: getComputedStyle(frame).display, sameRow: Math.abs(media.top - content.top) <= 1, separated: Math.abs(media.left - content.left) > 1 } : null;
      });
      assert(reflow?.display === "grid" && reflow.sameRow && reflow.separated, `Expected ${tier} eight-column feature content-card to preserve the wide 50/50 split.`);

      await imageTop.evaluate(card => { const element = card as HTMLElement; element.style.inlineSize = "64rem"; element.style.maxInlineSize = "none"; });
      reflow = await imageTop.evaluate(card => {
        const media = card.querySelector<HTMLElement>(".bf-content-card-media")?.getBoundingClientRect();
        const content = card.querySelector<HTMLElement>(".bf-content-card-content")?.getBoundingClientRect();
        return media && content ? { stacked: content.top > media.top + 1 } : null;
      });
      assert(reflow?.stacked, `Expected ${tier} image-top content-card to remain vertical at wide allocation.`);

      const roleState = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll<HTMLElement>(".bf-content-card"));
        const h1Probe = document.createElement("span");
        h1Probe.style.cssText = "position:absolute;visibility:hidden;font-size:var(--bf-h1-font-size)";
        document.body.append(h1Probe);
        const h1Size = getComputedStyle(h1Probe).fontSize;
        h1Probe.remove();
        const h4Probe = document.createElement("span");
        h4Probe.style.cssText = "position:absolute;visibility:hidden;font-size:var(--bf-h4-font-size)";
        document.body.append(h4Probe);
        const h4Size = getComputedStyle(h4Probe).fontSize;
        h4Probe.remove();
        return cards.map(card => ({ span: card.className.match(/is-cols-(2|4|6|8)/)?.[1], size: getComputedStyle(card.querySelector(".bf-content-card-title") as Element).fontSize }))
          .filter(item => item.span === "2" || item.span === "4" || item.span === "6" || item.span === "8")
          .reduce((result, item) => ({ ...result, [item.span as string]: item.size }), { h1: h1Size, h4: h4Size } as Record<string, string>);
      });
      assert(roleState["2"] === roleState.h4 && roleState["4"] === roleState.h4 && roleState["6"] === roleState.h4 && roleState["8"] === roleState.h1, `Expected ${tier} content-card title roles to map 2/4/6 to h4 and 8 to h1.`);

      const clampState = await page.locator(".bf-content-card.is-cols-6").first().evaluate(card => {
        const link = card.querySelector<HTMLElement>(".bf-content-card-main-link");
        const description = card.querySelector<HTMLElement>(".bf-content-card-description");
        return link && description ? { linkClamp: getComputedStyle(link).webkitLineClamp, linkHeight: link.getBoundingClientRect().height, linkLineHeight: Number.parseFloat(getComputedStyle(link).lineHeight), descriptionClamp: getComputedStyle(description).webkitLineClamp, descriptionHeight: description.getBoundingClientRect().height, descriptionLineHeight: Number.parseFloat(getComputedStyle(description).lineHeight) } : null;
      });
      assert(clampState && clampState.linkClamp === "2" && clampState.descriptionClamp === "2" && clampState.linkHeight <= clampState.linkLineHeight * 2 + 1 && clampState.descriptionHeight <= clampState.descriptionLineHeight * 2 + 16, `Expected ${tier} six-column long content-card copy to retain its two-line clamps.`);

      const revealCard = page.locator(".bf-content-card.is-cols-2.is-description-reveal").first();
      const revealLink = revealCard.locator(".bf-content-card-main-link");
      const revealDescription = revealCard.locator(".bf-content-card-description-panel");
      await revealCard.hover();
      await page.waitForTimeout(450);
      assert(await revealDescription.evaluate(element => Number.parseFloat(getComputedStyle(element).opacity) > 0.9), `Expected ${tier} content-card hover to reveal its description panel.`);
      await page.mouse.move(0, 0);
      await page.keyboard.press("Tab");
      await revealLink.focus();
      await page.waitForTimeout(450);
      const focusState = await revealCard.evaluate(card => ({ outline: getComputedStyle(card).outlineStyle, descriptionVisible: Number.parseFloat(getComputedStyle(card.querySelector(".bf-content-card-description-panel") as Element).opacity) > 0.9 }));
      assert(focusState.descriptionVisible && focusState.outline !== "none", `Expected ${tier} content-card keyboard focus to reveal copy and expose a visible focus outline (visible=${focusState.descriptionVisible}, outline=${focusState.outline}).`);

      await page.evaluate(() => history.replaceState(null, "", "#"));
      await revealCard.click({ position: { x: 4, y: 4 } });
      assert(await page.evaluate(() => location.hash === "#two-column-destination"), `Expected ${tier} expanded content-card surface click to activate its main destination.`);
      await page.locator("body").click({ position: { x: 1, y: 1 } });
      await page.waitForTimeout(450);
      await page.evaluate(() => history.replaceState(null, "", "#"));
      await revealCard.locator(".bf-content-card-author-date a").click();
      assert(await page.evaluate(() => location.hash === "#author-canonical"), `Expected ${tier} content-card author action to win over the expanded card link.`);
      await page.evaluate(() => history.replaceState(null, "", "#"));
      await revealCard.locator(".bf-content-card-resource").click();
      assert(await page.evaluate(() => location.hash === "#whitepaper"), `Expected ${tier} content-card footer action to win over the expanded card link.`);

      const rtlState = await page.locator(".bf-content-card-wrapper[dir='rtl'] .bf-content-card-footer-inner").evaluate(element => {
        const styles = getComputedStyle(element);
        return { direction: styles.direction, overflowX: styles.overflowX, mask: styles.maskImage, scrollable: element.scrollWidth >= element.clientWidth };
      });
      assert(rtlState.direction === "rtl" && rtlState.overflowX === "auto" && rtlState.mask.includes("left") && rtlState.scrollable, `Expected ${tier} RTL content-card footer rail to preserve its left-edge mask and scroll contract.`);
    }

    await page.goto(`${origin}/demo/components/cards.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);
    for (const tier of tiers) {
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
      const state = await page.evaluate(() => {
        const root = document.querySelector<HTMLElement>(".bf-card");
        const next = document.querySelectorAll<HTMLElement>(".bf-card")[1];
        const header = root?.querySelector<HTMLElement>(".bf-card-header");
        const popup = root?.querySelector<HTMLElement>("[data-card-popup]");
        const imagePreview = document.querySelector<HTMLElement>("[data-card-preview]");
        const missingPreview = document.querySelector<HTMLElement>("[data-card-preview-missing]");
        if (!root || !next || !header || !popup || !imagePreview || !missingPreview) return null;
        const rootStyle = getComputedStyle(root);
        const rootOverlay = getComputedStyle(root, "::after");
        const headerStyle = getComputedStyle(header);
        const headerOverlay = getComputedStyle(header, "::after");
        const imagePreviewStyle = getComputedStyle(imagePreview);
        const imagePreviewOverlay = getComputedStyle(imagePreview, "::after");
        const rootBefore = root.getBoundingClientRect();
        root.style.setProperty("--bf-stroke-width", "4px");
        const rootAfter = root.getBoundingClientRect();
        root.style.removeProperty("--bf-stroke-width");
        const popupRect = popup.getBoundingClientRect();
        const nextRect = next.getBoundingClientRect();
        const overlapTop = Math.max(popupRect.top, nextRect.top);
        const overlapBottom = Math.min(popupRect.bottom, nextRect.bottom);
        const sampleX = popupRect.left + Math.min(12, popupRect.width / 2);
        const sampleY = overlapTop + Math.max(1, Math.min(8, (overlapBottom - overlapTop) / 2));
        const hit = document.elementFromPoint(sampleX, sampleY);
        const missingStyle = getComputedStyle(missingPreview);
        const missingAfter = getComputedStyle(missingPreview, "::after");
        const bodyProbe = document.createElement("span");
        bodyProbe.style.cssText = "position:absolute;visibility:hidden;font-size:var(--bf-body-font-size)";
        root.append(bodyProbe);
        const expectedBodyFontSize = getComputedStyle(bodyProbe).fontSize;
        bodyProbe.remove();
        return {
          root: {
            borderWidths: [rootStyle.borderBlockStartWidth, rootStyle.borderBlockEndWidth, rootStyle.borderInlineStartWidth, rootStyle.borderInlineEndWidth],
            overlay: { content: rootOverlay.content, inset: [rootOverlay.top, rootOverlay.right, rootOverlay.bottom, rootOverlay.left], pointerEvents: rootOverlay.pointerEvents, position: rootOverlay.position, shadow: rootOverlay.boxShadow }
          },
          header: {
            borderWidths: [headerStyle.borderBlockStartWidth, headerStyle.borderBlockEndWidth, headerStyle.borderInlineStartWidth, headerStyle.borderInlineEndWidth],
            overlay: { content: headerOverlay.content, inset: [headerOverlay.top, headerOverlay.right, headerOverlay.bottom, headerOverlay.left], pointerEvents: headerOverlay.pointerEvents, position: headerOverlay.position, shadow: headerOverlay.boxShadow }
          },
          imagePreview: {
            borderWidths: [imagePreviewStyle.borderBlockStartWidth, imagePreviewStyle.borderBlockEndWidth, imagePreviewStyle.borderInlineStartWidth, imagePreviewStyle.borderInlineEndWidth],
            overlay: { content: imagePreviewOverlay.content, inset: [imagePreviewOverlay.top, imagePreviewOverlay.right, imagePreviewOverlay.bottom, imagePreviewOverlay.left], pointerEvents: imagePreviewOverlay.pointerEvents, position: imagePreviewOverlay.position, shadow: imagePreviewOverlay.boxShadow }
          },
          highlightedShadow: getComputedStyle(next, "::after").boxShadow,
          missing: {
            borderWidths: [missingStyle.borderBlockStartWidth, missingStyle.borderBlockEndWidth, missingStyle.borderInlineStartWidth, missingStyle.borderInlineEndWidth],
            content: missingAfter.content,
            fontSize: missingAfter.fontSize,
            shadow: missingStyle.boxShadow
          },
          expectedBodyFontSize,
          overflow: getComputedStyle(root).overflow,
          popupOverlap: overlapBottom - overlapTop,
          popupHit: hit instanceof Element && Boolean(hit.closest("[data-card-popup]")),
          sizeDelta: {
            height: rootAfter.height - rootBefore.height,
            width: rootAfter.width - rootBefore.width
          }
        };
      });
      assert(state, `Expected ${tier} card demo to expose surface, preview, header, and real contextual-menu specimens.`);
      for (const [label, item] of [["card", state.root], ["card header", state.header], ["image preview", state.imagePreview]] as const) {
        assert(item.borderWidths.every(width => width === "0px"), `Expected ${tier} ${label} to have zero layout borders; got ${item.borderWidths.join(", ")}.`);
        assert(item.overlay.content !== "none" && item.overlay.position === "absolute" && item.overlay.pointerEvents === "none" && item.overlay.inset.every(value => value === "0px") && item.overlay.shadow !== "none", `Expected ${tier} ${label} to use an exact pointer-transparent overlay; got ${JSON.stringify(item.overlay)}.`);
      }
      assert(Math.abs(state.sizeDelta.height) <= 0.001 && Math.abs(state.sizeDelta.width) <= 0.001, `Expected ${tier} card occupied geometry to remain exact when the paint width changes; got ${JSON.stringify(state.sizeDelta)}.`);
      assert(state.highlightedShadow !== "none", `Expected ${tier} highlighted Card to compose elevation into its overlay.`);
      assert(state.missing.borderWidths.every(width => width === "0px") && state.missing.content.includes("Capture missing") && state.missing.shadow !== "none" && state.missing.fontSize === state.expectedBodyFontSize, `Expected ${tier} missing preview to retain its named text pseudo, body-sized label, and self-painted boundary; got ${JSON.stringify(state.missing)} vs body ${state.expectedBodyFontSize}.`);
      assert(state.overflow === "visible" && state.popupOverlap > 1 && state.popupHit, `Expected ${tier} real contextual menu to escape Card clipping and win hit-testing across the following Card; got overflow=${state.overflow}, overlap=${state.popupOverlap}, hit=${state.popupHit}.`);
    }

    await page.goto(`${origin}/demo/components/option-card.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    await disableDemoChromeHitTesting(page);
    for (const tier of tiers) {
      await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
      await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
      const active = page.locator("button.bf-option-card.is-active");
      const state = await active.evaluate(element => {
        const owner = getComputedStyle(element);
        const overlay = getComputedStyle(element, "::after");
        const before = element.getBoundingClientRect();
        (element as HTMLElement).style.setProperty("--bf-stroke-width", "4px");
        const after = element.getBoundingClientRect();
        (element as HTMLElement).style.removeProperty("--bf-stroke-width");
        return {
          borderWidths: [owner.borderBlockStartWidth, owner.borderBlockEndWidth, owner.borderInlineStartWidth, owner.borderInlineEndWidth],
          overlay: { content: overlay.content, inset: [overlay.top, overlay.right, overlay.bottom, overlay.left], pointerEvents: overlay.pointerEvents, position: overlay.position, shadow: overlay.boxShadow },
          sizeDelta: { height: after.height - before.height, width: after.width - before.width }
        };
      });
      assert(state.borderWidths.every(width => width === "0px") && state.overlay.content !== "none" && state.overlay.position === "absolute" && state.overlay.pointerEvents === "none" && state.overlay.inset.every(value => value === "0px") && state.overlay.shadow !== "none", `Expected ${tier} active OptionCard to use a zero-layout-border composed overlay; got ${JSON.stringify(state)}.`);
      assert(Math.abs(state.sizeDelta.height) <= 0.001 && Math.abs(state.sizeDelta.width) <= 0.001, `Expected ${tier} OptionCard occupied geometry to remain exact when paint width changes; got ${JSON.stringify(state.sizeDelta)}.`);
      await active.focus();
      assert(await active.evaluate(element => getComputedStyle(element).outlineStyle !== "none"), `Expected ${tier} active OptionCard keyboard focus to remain visible above its overlay.`);
    }

    await page.emulateMedia({ forcedColors: "active" });
    const forcedState = await page.locator("button.bf-option-card.is-active").evaluate(element => {
      const owner = getComputedStyle(element);
      const overlay = getComputedStyle(element, "::after");
      return { ownerOutline: owner.outlineStyle, ownerOutlineWidth: owner.outlineWidth, ownerOutlineOffset: owner.outlineOffset, overlayOutline: overlay.outlineStyle, overlayOutlineWidth: overlay.outlineWidth, selectedBorder: overlay.borderBlockStartStyle, selectedWidth: overlay.borderBlockStartWidth };
    });
    assert(forcedState.ownerOutline !== "none" && Number.parseFloat(forcedState.ownerOutlineWidth) >= 3 && Number.parseFloat(forcedState.ownerOutlineOffset) <= -4 && forcedState.overlayOutline !== "none" && Number.parseFloat(forcedState.overlayOutlineWidth) > 0 && Number.parseFloat(forcedState.overlayOutlineWidth) < Number.parseFloat(forcedState.ownerOutlineWidth) && forcedState.selectedBorder === "solid" && Number.parseFloat(forcedState.selectedWidth) > 0, `Expected forced-colours OptionCard to retain a distinct inset keyboard focus ring, thinner system boundary, and one-sided selected cue; got ${JSON.stringify(forcedState)}.`);
    await page.goto(`${origin}/demo/components/cards.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const linkedCard = page.locator("a.bf-card");
    await linkedCard.focus();
    const linkedForcedState = await linkedCard.evaluate(element => {
      const owner = getComputedStyle(element);
      const overlay = getComputedStyle(element, "::after");
      return { ownerOutline: owner.outlineStyle, ownerOutlineWidth: owner.outlineWidth, ownerOutlineOffset: owner.outlineOffset, overlayOutline: overlay.outlineStyle, overlayOutlineWidth: overlay.outlineWidth };
    });
    assert(linkedForcedState.ownerOutline !== "none" && Number.parseFloat(linkedForcedState.ownerOutlineWidth) >= 3 && Number.parseFloat(linkedForcedState.ownerOutlineOffset) <= -4 && linkedForcedState.overlayOutline !== "none" && Number.parseFloat(linkedForcedState.overlayOutlineWidth) > 0 && Number.parseFloat(linkedForcedState.overlayOutlineWidth) < Number.parseFloat(linkedForcedState.ownerOutlineWidth), `Expected forced-colours linked Card to retain a distinct inset keyboard focus ring over its thinner system boundary; got ${JSON.stringify(linkedForcedState)}.`);
    await page.emulateMedia({ forcedColors: "none" });

    await page.close();
  } finally {
    await browser.close();
  }
}

export async function verifySiteShellPrimitiveGeometry(origin: string): Promise<void> {
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({ deviceScaleFactor: 1, viewport: { width: 1280, height: 900 } });

    await page.goto(`${origin}/demo/components/basic-section.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const titleLink = page.locator(".bf-basic-section-title-link");
    const titleDefault = await titleLink.evaluate(link => ({
      color: getComputedStyle(link).color,
      decoration: getComputedStyle(link).textDecorationLine,
      fontSize: getComputedStyle(link).fontSize,
      headingFontSize: getComputedStyle(link.parentElement as HTMLElement).fontSize,
      expectedColor: (() => {
        const probe = document.createElement("span");
        probe.style.color = "var(--bf-color-link-default)";
        link.parentElement?.append(probe);
        const color = getComputedStyle(probe).color;
        probe.remove();
        return color;
      })()
    }));
    assert(titleDefault.decoration === "none", `Expected a linked basic-section title to omit its default underline. Got ${titleDefault.decoration}.`);
    assert(titleDefault.color === titleDefault.expectedColor, `Expected a linked basic-section title to retain the semantic link colour. Got ${titleDefault.color}, expected ${titleDefault.expectedColor}.`);
    assert(titleDefault.fontSize === titleDefault.headingFontSize, `Expected a linked basic-section title to inherit heading type. Got link=${titleDefault.fontSize}, heading=${titleDefault.headingFontSize}.`);
    await titleLink.hover();
    assert((await titleLink.evaluate(link => getComputedStyle(link).textDecorationLine)).includes("underline"), "Expected a linked basic-section title to underline on hover.");
    assert((await titleLink.evaluate(link => getComputedStyle(link).color)) === titleDefault.expectedColor, "Expected a linked basic-section title to remain blue on hover.");
    await titleLink.focus();
    assert((await titleLink.evaluate(link => getComputedStyle(link).outlineStyle)) !== "none", "Expected a linked basic-section title to retain a visible keyboard focus outline.");

    await page.goto(`${origin}/demo/components/quote-wrapper.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const contentLink = page.locator(".bf-quote-wrapper-header-link a");
    assert((await contentLink.evaluate(link => getComputedStyle(link).textDecorationLine)) === "none", "Expected a raw content link to omit its resting underline.");
    await contentLink.hover();
    assert((await contentLink.evaluate(link => getComputedStyle(link).textDecorationLine)).includes("underline"), "Expected a raw content link to underline on hover.");
    await page.mouse.down();
    const activeDecoration = await contentLink.evaluate(link => getComputedStyle(link).textDecorationLine);
    await page.mouse.up();
    assert(activeDecoration.includes("underline"), "Expected a raw content link to remain underlined while active.");
    await page.mouse.move(0, 0);
    await contentLink.focus();
    assert((await contentLink.evaluate(link => getComputedStyle(link).textDecorationLine)) === "none", "Expected keyboard focus to use its focus ring without restoring the resting underline.");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    assert(await contentLink.evaluate(link => document.activeElement === link), "Expected keyboard navigation to return focus to the raw content link.");
    assert((await contentLink.evaluate(link => getComputedStyle(link).outlineStyle)) !== "none", "Expected a raw content link to retain a visible keyboard focus outline.");

    await page.goto(`${origin}/demo/components/application-shell.html`, { waitUntil: "networkidle" });
    await waitForFonts(page);
    const startAlignment = await page.locator(".bf-fixed-width.is-start-aligned").evaluate(element => {
      const row = element as HTMLElement;
      const parent = row.parentElement as HTMLElement;
      parent.style.inlineSize = "800px";
      row.style.maxInlineSize = "400px";
      const ltrRow = row.getBoundingClientRect();
      const ltrParent = parent.getBoundingClientRect();
      parent.dir = "rtl";
      const rtlRow = row.getBoundingClientRect();
      const rtlParent = parent.getBoundingClientRect();
      return {
        ltrStartDelta: Math.abs(ltrRow.left - ltrParent.left),
        rtlStartDelta: Math.abs(rtlRow.right - rtlParent.right),
        width: rtlRow.width
      };
    });
    assert(startAlignment.ltrStartDelta <= 1 && startAlignment.rtlStartDelta <= 1, `Expected fixed-width start alignment to follow LTR and RTL logical starts. Got LTR=${startAlignment.ltrStartDelta}px, RTL=${startAlignment.rtlStartDelta}px.`);
    assert(Math.abs(startAlignment.width - 400) <= 1, `Expected start alignment to preserve the fixed-width cap. Got ${startAlignment.width}px.`);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${origin}/demo/components/table.html`, { waitUntil: "networkidle" });
    const tableScroll = await page.locator(".bf-table-scroll").evaluate(wrapper => ({
      clientWidth: wrapper.clientWidth,
      overflowX: getComputedStyle(wrapper).overflowX,
      scrollWidth: wrapper.scrollWidth,
      tabIndex: (wrapper as HTMLElement).tabIndex
    }));
    assert(tableScroll.overflowX === "auto" && tableScroll.scrollWidth > tableScroll.clientWidth, `Expected a narrow table wrapper to scroll horizontally. Got overflow=${tableScroll.overflowX}, client=${tableScroll.clientWidth}, scroll=${tableScroll.scrollWidth}.`);
    assert(tableScroll.tabIndex === 0, `Expected the table scroll region to remain keyboard focusable. Got tabindex=${tableScroll.tabIndex}.`);

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${origin}/demo/components/hero.html`, { waitUntil: "networkidle" });
    const inset = await page.locator(".bf-figure.is-light-inset > .bf-aspect").evaluate(media => ({
      background: getComputedStyle(media).backgroundColor,
      padding: getComputedStyle(media).padding
    }));
    assert(inset.background === "rgb(255, 255, 255)", `Expected light-inset media to retain a white backing in dark mode. Got ${inset.background}.`);
    assert(Number.parseFloat(inset.padding) > 0, `Expected light-inset media to expose token padding. Got ${inset.padding}.`);
  } finally {
    await browser.close();
  }
}
