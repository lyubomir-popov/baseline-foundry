import { waitForFonts } from "../component-demo-shared.ts";
import { assert, openBrowser } from "./browser-helpers.ts";

const tiers = ["editorial", "documentation", "app", "os"] as const;
const rootFontSizes = [14, 16, 20] as const;
const directions = ["ltr", "rtl"] as const;
const deviceScaleFactors = [1, 1.5] as const;
const geometryTolerance = 0.1;
const baselineTolerance = 0.02;

export async function verifyStaticNavigationIndicators(origin: string): Promise<void> {
  const browser = await openBrowser();
  let measuredStates = 0;
  let measuredTabHosts = 0;
  let measuredNavigationHosts = 0;
  let minimumBadgeHostClearance = Number.POSITIVE_INFINITY;
  let minimumChipHostClearance = Number.POSITIVE_INFINITY;

  try {
    for (const deviceScaleFactor of deviceScaleFactors) {
      const page = await browser.newPage({ deviceScaleFactor, viewport: { width: 1440, height: 1100 } });
      await page.addInitScript("globalThis.__name = value => value;");
      await page.goto(`${origin}/demo/spec/buckets/08-density.html?bundle=after`, { waitUntil: "networkidle" });
      await waitForFonts(page);
      await page.evaluate(() => {
        const fixture = document.createElement("div");
        fixture.dataset.staticNavigationBoundaryFixture = "";
        fixture.style.cssText = "position:fixed;inset-block-start:0;inset-inline-start:-10000px;visibility:hidden;inline-size:40rem";
        fixture.innerHTML = `
          <span class="bf-chip is-nested" data-boundary-case="standalone-nested"><span class="bf-chip-value">Standalone</span></span>
          <span class="bf-side-navigation-status" data-boundary-case="orphan-status"><span class="bf-chip is-nested"><span class="bf-chip-value">Orphan</span></span></span>
          <div class="bf-navigation is-collapsed"><div class="bf-side-navigation"><span class="bf-side-navigation-link" data-boundary-collapsed-host><span class="bf-side-navigation-label">Hidden</span><span class="bf-side-navigation-status"><span class="bf-chip is-nested" data-boundary-case="collapsed-navigation"><span class="bf-chip-value">Hidden</span></span></span></span></div></div>
          <div class="bf-side-navigation"><span class="bf-side-navigation-link"><span class="bf-side-navigation-label">Outer</span><span class="bf-side-navigation-status">
            <span class="bf-chip" data-boundary-case="outer-valid"><span class="bf-chip-value">Outer</span></span>
            <button class="bf-chip" type="button" data-boundary-case="clickable-chip">Action</button>
            <span class="bf-chip" data-boundary-case="dismissible-chip"><span class="bf-chip-value">Filter</span><button class="bf-chip-dismiss" type="button" aria-label="Remove"></button></span>
            <span class="bf-theme bf-tier-os" data-boundary-inner-theme>
              <span class="bf-chip is-nested" data-boundary-case="nested-blocked"><span class="bf-chip-value">Blocked</span></span>
              <span class="bf-side-navigation"><span class="bf-side-navigation-link"><span class="bf-side-navigation-status"><span class="bf-chip" data-boundary-case="inner-reselected"><span class="bf-chip-value">Inner</span></span></span></span></span>
            </span>
          </span></span></div>
          <div class="bf-tabs" data-strip-plain><ul class="bf-tabs-list" role="tablist"><li class="bf-tabs-item"><button class="bf-tabs-link" type="button" role="tab" aria-selected="true" tabindex="0">State</button></li></ul></div>
          <div class="bf-tabs" data-strip-badge><ul class="bf-tabs-list" role="tablist"><li class="bf-tabs-item"><button class="bf-tabs-link" type="button" role="tab" aria-selected="true" tabindex="0"><span>State</span><span class="bf-badge">3</span></button></li></ul></div>`;
        document.body.append(fixture);
      });

      for (const rootFontSize of rootFontSizes) {
        await page.evaluate(size => { document.documentElement.style.fontSize = `${size}px`; }, rootFontSize);
        for (const tier of tiers) {
          await page.locator("[data-page-chrome-tier-select]").selectOption(tier);
          await page.waitForFunction(expectedTier => document.body.dataset.bfTier === expectedTier, tier);
          await page.evaluate(currentTier => {
            const inner = document.querySelector<HTMLElement>("[data-boundary-inner-theme]");
            if (!inner) throw new Error("Missing nested product-boundary fixture.");
            inner.classList.remove("bf-tier-editorial", "bf-tier-documentation", "bf-tier-app", "bf-tier-os");
            inner.classList.add(currentTier === "os" ? "bf-tier-editorial" : "bf-tier-os");
          }, tier);
          await waitForFonts(page);

          for (const direction of directions) {
            await page.evaluate(value => { document.documentElement.dir = value; }, direction);
            const proof = await page.evaluate(() => {
              const rect = (element: Element) => {
                const value = element.getBoundingClientRect();
                return { left: value.left, right: value.right, top: value.top, bottom: value.bottom, width: value.width, height: value.height };
              };
              const resolveLength = (element: HTMLElement, property: string) => {
                const probe = document.createElement("span");
                probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;inline-size:var(${property});block-size:0;padding:0;border:0`;
                element.append(probe);
                const value = probe.getBoundingClientRect().width;
                probe.remove();
                return value;
              };

              const hosts = [...document.querySelectorAll<HTMLElement>("#density-deferred-track [data-static-navigation-host]")].map(host => {
                const labelMarker = host.querySelector<HTMLElement>("[data-indicator-static-host-baseline]");
                if (!labelMarker) throw new Error("Missing static navigation label baseline marker.");
                const hostBox = rect(host);
                const hostStyle = getComputedStyle(host);
                const chip = host.querySelector<HTMLElement>("[data-static-navigation-chip]");
                const chipMarker = host.querySelector<HTMLElement>("[data-indicator-static-chip-baseline]");
                const chipBox = chip ? rect(chip) : null;
                const chipStyle = chip ? getComputedStyle(chip) : null;
                const badge = host.querySelector<HTMLElement>("[data-static-navigation-badge]");
                const badgeMarker = host.querySelector<HTMLElement>("[data-indicator-static-badge-baseline]");
                const badgeBox = badge ? rect(badge) : null;
                const badgeStyle = badge ? getComputedStyle(badge) : null;
                const badgePaintHeight = badgeStyle ? Number.parseFloat(badgeStyle.backgroundSize.split(",")[0].trim().split(/\s+/)[1]) : null;
                const badgePaintInset = badgeBox && badgePaintHeight !== null ? (badgeBox.height - badgePaintHeight) / 2 : null;
                const chipStroke = chip ? resolveLength(chip, "--bf-stroke-width") : null;
                return {
                  placement: host.dataset.staticPlacement ?? "",
                  variant: host.dataset.staticVariant ?? "",
                  host: hostBox,
                  alignItems: hostStyle.alignItems,
                  labelBaseline: labelMarker.getBoundingClientRect().top,
                  chip: chipBox,
                  chipPadding: chipStyle ? Number.parseFloat(chipStyle.paddingBlockStart) : null,
                  chipDenseInset: chip ? resolveLength(chip, "--bf-control-block-inset-dense") : null,
                  chipMarginStart: chipStyle ? Number.parseFloat(chipStyle.marginBlockStart) : null,
                  chipMarginEnd: chipStyle ? Number.parseFloat(chipStyle.marginBlockEnd) : null,
                  chipBaseline: chipMarker?.getBoundingClientRect().top ?? null,
                  chipHostClearance: chipBox ? {
                    blockStart: chipBox.top - hostBox.top,
                    blockEnd: hostBox.bottom - chipBox.bottom
                  } : null,
                  badge: badgeBox,
                  badgeFontSize: badgeStyle ? Number.parseFloat(badgeStyle.fontSize) : null,
                  badgeLineHeight: badgeStyle ? Number.parseFloat(badgeStyle.lineHeight) : null,
                  badgeBaseline: badgeMarker?.getBoundingClientRect().top ?? null,
                  badgeHostClearance: badgeBox && badgePaintInset !== null ? {
                    blockStart: badgeBox.top + badgePaintInset - hostBox.top,
                    blockEnd: hostBox.bottom - (badgeBox.bottom - badgePaintInset)
                  } : null,
                  badgeChipClearance: badgeBox && badgePaintInset !== null && chipBox && chipStroke !== null ? {
                    blockStart: badgeBox.top + badgePaintInset - (chipBox.top + chipStroke),
                    blockEnd: chipBox.bottom - chipStroke - (badgeBox.bottom - badgePaintInset),
                    inlineStart: document.documentElement.dir === "rtl"
                      ? chipBox.right - chipStroke - badgeBox.right
                      : badgeBox.left - (chipBox.left + chipStroke),
                    inlineEnd: document.documentElement.dir === "rtl"
                      ? badgeBox.left - (chipBox.left + chipStroke)
                      : chipBox.right - chipStroke - badgeBox.right
                  } : null,
                  hasChipInTab: host.matches(".bf-tabs-link") && Boolean(chip)
                };
              });

              const tabLists = [...document.querySelectorAll<HTMLElement>("#density-deferred-track .bf-tabs-list")].map(list => ({
                height: list.getBoundingClientRect().height,
                marginEnd: Number.parseFloat(getComputedStyle(list).marginBlockEnd),
                equalClosure: list.style.getPropertyValue("--bf-tabs-equal-closure"),
                legacyStaticClosure: list.style.getPropertyValue("--_bf-tabs-static-closure"),
                legacyRowAlign: list.style.getPropertyValue("--_bf-tabs-row-align"),
                selected: list.querySelectorAll(".bf-tabs-link[aria-selected='true']").length,
                roving: list.querySelectorAll(".bf-tabs-link[tabindex='0']").length
              }));
              const boundary = Object.fromEntries([...document.querySelectorAll<HTMLElement>("[data-boundary-case]")].map(element => {
                const chip = element.matches(".bf-chip") ? element : element.querySelector<HTMLElement>(".bf-chip");
                if (!chip) return [element.dataset.boundaryCase!, null];
                const style = getComputedStyle(chip);
                return [element.dataset.boundaryCase!, {
                  padding: Number.parseFloat(style.paddingBlockStart),
                  dense: resolveLength(chip, "--bf-control-block-inset-dense"),
                  defaultInset: resolveLength(chip, "--bf-interface-row-padding-block"),
                  marginStart: Number.parseFloat(style.marginBlockStart),
                  marginEnd: Number.parseFloat(style.marginBlockEnd)
                }];
              }));
              const collapsedHost = document.querySelector<HTMLElement>("[data-boundary-collapsed-host]");
              const collapsedStatus = collapsedHost?.querySelector<HTMLElement>(".bf-side-navigation-status") ?? null;
              const stripPair = Object.fromEntries(["plain", "badge"].map(kind => {
                const root = document.querySelector<HTMLElement>(`[data-strip-${kind}]`);
                const list = root?.querySelector<HTMLElement>(".bf-tabs-list");
                const link = root?.querySelector<HTMLElement>(".bf-tabs-link");
                if (!root || !list || !link) throw new Error(`Missing ${kind} tab-strip comparison fixture.`);
                return [kind, { list: rect(list), link: rect(link), marginEnd: Number.parseFloat(getComputedStyle(list).marginBlockEnd) }];
              }));

              return {
                hosts,
                tabLists,
                boundary,
                collapsedHost: collapsedHost ? {
                  paddingStart: Number.parseFloat(getComputedStyle(collapsedHost).paddingBlockStart),
                  comfortablePadding: resolveLength(collapsedHost, "--bf-interface-row-padding-block"),
                  statusDisplay: collapsedStatus ? getComputedStyle(collapsedStatus).display : null
                } : null,
                stripPair,
                tabChipCount: document.querySelectorAll("#density-deferred-track .bf-tabs-link .bf-chip").length
              };
            });

            assert(proof.tabChipCount === 0 && proof.hosts.every(host => !host.hasChipInTab), `Expected ${tier}/${rootFontSize}px/${direction}/${deviceScaleFactor}x no Chip inside any tab; got ${JSON.stringify(proof.hosts)}.`);
            assert(proof.tabLists.every(list => list.legacyStaticClosure === "" && list.legacyRowAlign === "" && list.selected === 1 && list.roving === 1), `Expected ${tier}/${rootFontSize}px/${direction}/${deviceScaleFactor}x standard tab runtime state with no retired Chip variables; got ${JSON.stringify(proof.tabLists)}.`);
            assert(Math.abs(proof.stripPair.plain.list.height - proof.stripPair.badge.list.height) <= geometryTolerance && Math.abs(proof.stripPair.plain.link.height - proof.stripPair.badge.link.height) <= geometryTolerance && Math.abs(proof.stripPair.plain.marginEnd - proof.stripPair.badge.marginEnd) <= geometryTolerance, `Expected ${tier}/${rootFontSize}px/${direction}/${deviceScaleFactor}x a Badge-only strip to match a separate plain-only strip; got ${JSON.stringify(proof.stripPair)}.`);

            const standalone = proof.boundary["standalone-nested"];
            const orphan = proof.boundary["orphan-status"];
            const collapsed = proof.boundary["collapsed-navigation"];
            const outer = proof.boundary["outer-valid"];
            const blocked = proof.boundary["nested-blocked"];
            const inner = proof.boundary["inner-reselected"];
            const clickable = proof.boundary["clickable-chip"];
            const dismissible = proof.boundary["dismissible-chip"];
            assert(standalone && orphan && collapsed && outer && blocked && inner && clickable && dismissible, `Expected complete ${tier} SideNavigation provider-boundary fixtures; got ${JSON.stringify(proof.boundary)}.`);
            for (const outside of [standalone, orphan, clickable, dismissible]) assert(Math.abs(outside.padding - outside.defaultInset) <= geometryTolerance && outside.marginEnd > -geometryTolerance, `Expected ${tier} standalone, orphan and interactive Chips to retain their default control layout; got ${JSON.stringify(proof.boundary)}.`);
            assert(Math.abs(collapsed.padding - outer.dense) <= geometryTolerance && proof.collapsedHost && Math.abs(proof.collapsedHost.paddingStart - proof.collapsedHost.comfortablePadding) <= geometryTolerance && proof.collapsedHost.statusDisplay === "none", `Expected ${tier} collapsed legal trailing Chip membership without hidden-host geometry transfer; got ${JSON.stringify({ boundary: proof.boundary, host: proof.collapsedHost })}.`);
            assert(Math.abs(blocked.padding - blocked.defaultInset) <= geometryTolerance && Math.abs(blocked.dense - outer.dense) > geometryTolerance, `Expected ${tier} an opposing nested product root to block the outer SideNavigation provider; got ${JSON.stringify(proof.boundary)}.`);
            for (const enrolled of [outer, inner]) assert(Math.abs(enrolled.padding - enrolled.dense) <= geometryTolerance && Math.abs(enrolled.marginStart) <= geometryTolerance && Math.abs(enrolled.marginEnd) <= geometryTolerance, `Expected ${tier} valid outer and re-established inner SideNavigation providers to select their own dense member; got ${JSON.stringify(proof.boundary)}.`);
            assert(Math.abs(inner.dense - outer.dense) > geometryTolerance, `Expected ${tier} the inner legal SideNavigation host to reselect its different product root; got ${JSON.stringify(proof.boundary)}.`);

            for (const placement of ["ordinary-tab", "equal-tab"] as const) {
              const group = proof.hosts.filter(host => host.placement === placement);
              assert(group.length === 3, `Expected ${tier}/${placement} plain, one-digit Badge and long-count Badge hosts; got ${JSON.stringify(group)}.`);
              const plain = group.find(host => host.variant === "plain");
              const badges = group.filter(host => host.badge);
              assert(plain && badges.length === 2, `Expected complete ${tier}/${placement} Badge-only tab comparison; got ${JSON.stringify(group)}.`);
              for (const host of badges) {
                const expectedFontSize = rootFontSize * (tier === "os" ? 0.625 : 0.75);
                assert(host.alignItems === "baseline" && host.badgeBaseline !== null && Math.abs(host.badgeBaseline - host.labelBaseline) <= baselineTolerance, `Expected ${tier}/${placement}/${host.variant} Badge and label to share one baseline; got ${JSON.stringify(host)}.`);
                assert(host.badgeFontSize !== null && Math.abs(host.badgeFontSize - expectedFontSize) <= geometryTolerance && host.badgeLineHeight !== null && Math.abs(host.badgeLineHeight - rootFontSize) <= geometryTolerance, `Expected ${tier}/${placement}/${host.variant} invariant Badge type; got ${JSON.stringify(host)}.`);
                assert(Math.abs(host.host.height - plain.host.height) <= geometryTolerance, `Expected ${tier}/${placement}/${host.variant} Badge not to grow the tab; got ${JSON.stringify(group)}.`);
                assert(host.badgeHostClearance && host.badgeHostClearance.blockStart > geometryTolerance && host.badgeHostClearance.blockEnd > geometryTolerance, `Expected ${tier}/${placement}/${host.variant} Badge paint to remain inside the tab body line; got ${JSON.stringify(host)}.`);
                minimumBadgeHostClearance = Math.min(minimumBadgeHostClearance, host.badgeHostClearance.blockStart, host.badgeHostClearance.blockEnd);
              }
              measuredTabHosts += group.length;
            }

            for (const placement of ["side-navigation-link", "side-navigation-text"] as const) {
              const group = proof.hosts.filter(host => host.placement === placement);
              assert(group.length === 3, `Expected ${tier}/${placement} plain, Chip and Badge-in-Chip hosts; got ${JSON.stringify(group)}.`);
              const plain = group.find(host => host.variant === "plain");
              const chips = group.filter(host => host.chip);
              assert(plain && chips.length === 2, `Expected complete ${tier}/${placement} Chip comparison; got ${JSON.stringify(group)}.`);
              for (const host of chips) {
                assert(host.alignItems === "baseline" && host.chipBaseline !== null && Math.abs(host.chipBaseline - host.labelBaseline) <= baselineTolerance, `Expected ${tier}/${placement}/${host.variant} Chip and label to share one baseline; got ${JSON.stringify(host)}.`);
                assert(host.chipPadding !== null && host.chipDenseInset !== null && Math.abs(host.chipPadding - host.chipDenseInset) <= geometryTolerance && Math.abs(host.chipMarginStart ?? Number.POSITIVE_INFINITY) <= geometryTolerance && Math.abs(host.chipMarginEnd ?? Number.POSITIVE_INFINITY) <= geometryTolerance, `Expected ${tier}/${placement}/${host.variant} generated dense Chip inset without compensation; got ${JSON.stringify(host)}.`);
                assert(Math.abs(host.host.height - plain.host.height) <= geometryTolerance && host.chipHostClearance && host.chipHostClearance.blockStart > geometryTolerance && host.chipHostClearance.blockEnd > geometryTolerance, `Expected ${tier}/${placement}/${host.variant} Chip not to grow or escape its host; got ${JSON.stringify(group)}.`);
                minimumChipHostClearance = Math.min(minimumChipHostClearance, host.chipHostClearance.blockStart, host.chipHostClearance.blockEnd);
                if (host.badge) assert(host.badgeChipClearance && Object.values(host.badgeChipClearance).every(value => value > geometryTolerance), `Expected ${tier}/${placement} Badge paint to clear every Chip edge; got ${JSON.stringify(host)}.`);
              }
              measuredNavigationHosts += group.length;
            }
            measuredStates += 1;
          }
        }
      }

      await page.evaluate(() => {
        document.documentElement.style.fontSize = "16px";
        document.documentElement.dir = "ltr";
      });
      await page.locator("[data-page-chrome-tier-select]").selectOption("editorial");
      await page.waitForFunction(() => document.body.dataset.bfTier === "editorial");
      await waitForFonts(page);

      for (const placement of ["ordinary-tab", "equal-tab"] as const) {
        const initialHeight = await page.locator(`[data-static-placement='${placement}'][data-static-variant='plain']`).evaluate(element => element.getBoundingClientRect().height);
        for (const variant of ["plain", "badge", "long-badge"] as const) {
          const tab = page.locator(`[data-static-placement='${placement}'][data-static-variant='${variant}']`);
          await tab.click();
          const state = await tab.evaluate(element => {
            const host = element as HTMLElement;
            const list = host.closest<HTMLElement>(".bf-tabs-list");
            const item = host.closest<HTMLElement>(".bf-tabs-item");
            const controls = host.getAttribute("aria-controls");
            const painter = getComputedStyle(host, "::after");
            const layers: string[] = [];
            let depth = 0;
            let start = 0;
            for (let index = 0; index < painter.boxShadow.length; index += 1) {
              if (painter.boxShadow[index] === "(") depth += 1;
              if (painter.boxShadow[index] === ")") depth -= 1;
              if (painter.boxShadow[index] === "," && depth === 0) {
                layers.push(painter.boxShadow.slice(start, index).trim());
                start = index + 1;
              }
            }
            layers.push(painter.boxShadow.slice(start).trim());
            const painterThickness = Math.max(0, ...layers.flatMap(layer => {
              if (!layer.includes("inset")) return [];
              const lengths = [...layer.matchAll(/(-?\d+(?:\.\d+)?)px/g)].map(match => Number.parseFloat(match[1]));
              return lengths.length >= 2 && lengths[1] < 0 ? [Math.abs(lengths[1])] : [];
            }));
            const probe = document.createElement("span");
            probe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;inline-size:var(--bf-bar-thickness);block-size:0";
            host.append(probe);
            const painterRole = probe.getBoundingClientRect().width;
            probe.remove();
            return {
              height: host.getBoundingClientRect().height,
              selected: list?.querySelectorAll(".bf-tabs-link[aria-selected='true']").length,
              roving: list?.querySelectorAll(".bf-tabs-link[tabindex='0']").length,
              panelVisible: controls ? document.getElementById(controls)?.getAttribute("aria-hidden") === "false" : false,
              painterContent: painter.content,
              painterPosition: painter.position,
              painterBottom: Number.parseFloat(painter.bottom),
              painterThickness,
              painterRole,
              itemBottomDelta: item ? item.getBoundingClientRect().bottom - host.getBoundingClientRect().bottom : Number.NaN
            };
          });
          assert(state.selected === 1 && state.roving === 1 && state.panelVisible && Math.abs(state.height - initialHeight) <= geometryTolerance, `Expected ${placement}/${variant} activation to preserve one action and stable geometry; got ${JSON.stringify(state)}.`);
          assert(state.painterContent !== "none" && state.painterPosition === "absolute" && Math.abs(state.painterBottom) <= geometryTolerance && state.painterThickness > 0 && Math.abs(state.painterThickness - state.painterRole) <= geometryTolerance && Math.abs(state.itemBottomDelta) <= geometryTolerance, `Expected ${placement}/${variant} selected underline to remain an out-of-flow block-end painter; got ${JSON.stringify(state)}.`);
        }
      }

      const painterTab = page.locator("[data-static-placement='ordinary-tab'][data-static-variant='badge']");
      await painterTab.click();
      const painterMutation = await painterTab.evaluate(element => {
        const host = element as HTMLElement;
        const paintThickness = () => {
          const shadow = getComputedStyle(host, "::after").boxShadow;
          const layers: string[] = [];
          let depth = 0;
          let start = 0;
          for (let index = 0; index < shadow.length; index += 1) {
            if (shadow[index] === "(") depth += 1;
            if (shadow[index] === ")") depth -= 1;
            if (shadow[index] === "," && depth === 0) {
              layers.push(shadow.slice(start, index).trim());
              start = index + 1;
            }
          }
          layers.push(shadow.slice(start).trim());
          return Math.max(0, ...layers.flatMap(layer => {
            if (!layer.includes("inset")) return [];
            const lengths = [...layer.matchAll(/(-?\d+(?:\.\d+)?)px/g)].map(match => Number.parseFloat(match[1]));
            return lengths.length >= 2 && lengths[1] < 0 ? [Math.abs(lengths[1])] : [];
          }));
        };
        const before = paintThickness();
        const previous = host.style.getPropertyValue("--bf-overlay-stroke-layer");
        host.style.setProperty("--bf-overlay-stroke-layer", "inset 0 0 0 transparent");
        const missing = paintThickness();
        if (previous) host.style.setProperty("--bf-overlay-stroke-layer", previous);
        else host.style.removeProperty("--bf-overlay-stroke-layer");
        return { before, missing, restored: paintThickness() };
      });
      assert(painterMutation.before > 0 && painterMutation.missing <= geometryTolerance && Math.abs(painterMutation.restored - painterMutation.before) <= geometryTolerance, `Expected the Badge-tab underline oracle to observe painter removal and restoration; got ${JSON.stringify(painterMutation)}.`);

      const focusTab = page.locator("[data-static-placement='ordinary-tab'][data-static-variant='badge']");
      const beforeFocus = await focusTab.evaluate(element => ({ width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height }));
      await page.keyboard.press("Tab");
      await focusTab.focus();
      const afterFocus = await focusTab.evaluate(element => ({
        width: element.getBoundingClientRect().width,
        height: element.getBoundingClientRect().height,
        outlineWidth: Number.parseFloat(getComputedStyle(element).outlineWidth),
        outlineOffset: Number.parseFloat(getComputedStyle(element).outlineOffset),
        focusVisible: element.matches(":focus-visible"),
        labelVisibility: getComputedStyle(element.querySelector<HTMLElement>("[data-static-navigation-label]")!).visibility,
        badgeVisibility: getComputedStyle(element.querySelector<HTMLElement>("[data-static-navigation-badge]")!).visibility
      }));
      assert(Math.abs(afterFocus.width - beforeFocus.width) <= geometryTolerance && Math.abs(afterFocus.height - beforeFocus.height) <= geometryTolerance && afterFocus.focusVisible && afterFocus.outlineWidth > 0 && afterFocus.outlineOffset < 0 && afterFocus.labelVisibility === "visible" && afterFocus.badgeVisibility === "visible", `Expected inward Badge-tab focus paint without layout growth or hidden content; got ${JSON.stringify({ beforeFocus, afterFocus })}.`);

      const navigationFocus = await page.evaluate(async () => {
        const textBounds = (element: HTMLElement) => {
          const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
          let node = walker.nextNode();
          while (node && !node.textContent?.trim()) node = walker.nextNode();
          if (!node) throw new Error("Missing SideNavigation focus text.");
          const range = document.createRange();
          range.selectNodeContents(node);
          const box = range.getBoundingClientRect();
          return { width: box.width, height: box.height };
        };
        const results = [];
        const hosts = [...document.querySelectorAll<HTMLElement>("[data-static-placement='side-navigation-link']:is([data-static-variant='chip'], [data-static-variant='badge'])")];
        for (const host of hosts) {
          const chip = host.querySelector<HTMLElement>("[data-static-navigation-chip]");
          const label = host.querySelector<HTMLElement>("[data-static-navigation-label]");
          const chipValue = chip?.querySelector<HTMLElement>(".bf-chip-value");
          if (!chip || !label || !chipValue) throw new Error("Missing SideNavigation focus anatomy.");
          const beforeHost = host.getBoundingClientRect();
          const beforeChip = chip.getBoundingClientRect();
          host.focus();
          await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
          const afterHost = host.getBoundingClientRect();
          const afterChip = chip.getBoundingClientRect();
          const style = getComputedStyle(host);
          results.push({
            variant: host.dataset.staticVariant,
            hostDelta: { width: afterHost.width - beforeHost.width, height: afterHost.height - beforeHost.height },
            chipDelta: { top: afterChip.top - beforeChip.top, bottom: afterChip.bottom - beforeChip.bottom, width: afterChip.width - beforeChip.width, height: afterChip.height - beforeChip.height },
            focusVisible: host.matches(":focus-visible"),
            outlineWidth: Number.parseFloat(style.outlineWidth),
            outlineOffset: Number.parseFloat(style.outlineOffset),
            labelText: textBounds(label),
            chipText: textBounds(chipValue),
            labelVisibility: getComputedStyle(label).visibility,
            chipVisibility: getComputedStyle(chipValue).visibility
          });
          host.blur();
        }
        return results;
      });
      assert(navigationFocus.length === 2 && navigationFocus.every(result => result.focusVisible && result.outlineWidth > 0 && result.outlineOffset < 0 && Math.abs(result.hostDelta.width) <= geometryTolerance && Math.abs(result.hostDelta.height) <= geometryTolerance && Object.values(result.chipDelta).every(value => Math.abs(value) <= geometryTolerance) && result.labelText.width > 0 && result.labelText.height > 0 && result.chipText.width > 0 && result.chipText.height > 0 && result.labelVisibility === "visible" && result.chipVisibility === "visible"), `Expected retained SideNavigation Chip focus to remain inward, geometry-neutral and text-visible; got ${JSON.stringify(navigationFocus)}.`);
      await page.close();
    }
  } finally {
    await browser.close();
  }

  const expectedStates = deviceScaleFactors.length * rootFontSizes.length * tiers.length * directions.length;
  assert(measuredStates === expectedStates, `Expected all static indicator tier/root/direction/device-scale states; got ${measuredStates}.`);
  console.log(`Static navigation indicators passed: ${measuredStates} states, ${measuredTabHosts} Badge-tab hosts, ${measuredNavigationHosts} SideNavigation hosts, minimum Badge host clearance ${minimumBadgeHostClearance.toFixed(3)}px, minimum Chip host clearance ${minimumChipHostClearance.toFixed(3)}px.`);
}
