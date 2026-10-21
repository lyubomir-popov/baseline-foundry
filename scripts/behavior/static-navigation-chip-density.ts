import { waitForFonts } from "../component-demo-shared.ts";
import { assert, openBrowser } from "./browser-helpers.ts";

const tiers = ["editorial", "documentation", "app", "os"] as const;
const rootFontSizes = [14, 16, 20] as const;
const deviceScaleFactors = [1, 1.5] as const;
const geometryTolerance = 0.1;
const baselineTolerance = 0.02;

export async function verifyStaticNavigationChipDensity(origin: string): Promise<void> {
  const browser = await openBrowser();
  let measuredStates = 0;
  let measuredComparisonHosts = 0;
  let measuredFocusStates = 0;
  let minimumChipHostClearance = Number.POSITIVE_INFINITY;
  let minimumBadgeChipClearance = Number.POSITIVE_INFINITY;

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
          <div class="bf-navigation is-collapsed"><div class="bf-side-navigation"><span class="bf-side-navigation-link" data-boundary-collapsed-host><span class="bf-side-navigation-status"><span class="bf-chip is-nested" data-boundary-case="collapsed-navigation"><span class="bf-chip-value">Hidden</span></span></span></span></div></div>
          <div class="bf-tabs" data-boundary-case="mixed-outer">
            <div class="bf-tabs-link">
              <span class="bf-chip" data-boundary-case="outer-valid"><span class="bf-chip-value">Outer</span></span>
              <span class="bf-theme bf-tier-os" data-boundary-inner-theme>
                <span class="bf-chip is-nested" data-boundary-case="nested-blocked"><span class="bf-chip-value">Blocked</span></span>
                <span class="bf-tabs"><span class="bf-tabs-link"><span class="bf-chip" data-boundary-case="inner-reselected"><span class="bf-chip-value">Inner</span></span></span></span>
              </span>
            </div>
          </div>
          <div class="bf-tabs" data-boundary-case="excluded-anatomy">
            <span class="bf-tabs-link"><button class="bf-chip" type="button" data-boundary-case="clickable-chip">Action</button></span>
            <span class="bf-tabs-link"><span class="bf-chip" data-boundary-case="dismissible-chip"><span class="bf-chip-value">Filter</span><button class="bf-chip-dismiss" type="button" aria-label="Remove"></button></span></span>
          </div>`;
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
          await page.waitForFunction(() => [...document.querySelectorAll<HTMLElement>("#density-deferred-track .bf-tabs-list")].every(list => list.style.getPropertyValue("--_bf-tabs-static-closure") !== ""));
          const proof = await page.evaluate(() => {
            const rect = (element: Element | Range) => {
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
            const lineCount = (element: HTMLElement) => {
              const range = document.createRange();
              range.selectNodeContents(element);
              return new Set([...range.getClientRects()].filter(box => box.width > 0).map(box => box.top.toFixed(3))).size;
            };
            const selectionPaintThickness = (boxShadow: string) => {
              const layers: string[] = [];
              let depth = 0;
              let start = 0;
              for (let index = 0; index < boxShadow.length; index += 1) {
                if (boxShadow[index] === "(") depth += 1;
                if (boxShadow[index] === ")") depth -= 1;
                if (boxShadow[index] === "," && depth === 0) {
                  layers.push(boxShadow.slice(start, index).trim());
                  start = index + 1;
                }
              }
              layers.push(boxShadow.slice(start).trim());
              return Math.max(0, ...layers.flatMap(layer => {
                if (!layer.includes("inset")) return [];
                const lengths = [...layer.matchAll(/(-?\d+(?:\.\d+)?)px/g)].map(match => Number.parseFloat(match[1]));
                return lengths.length >= 2 && lengths[1] < 0 ? [Math.abs(lengths[1])] : [];
              }));
            };
            const hosts = [...document.querySelectorAll<HTMLElement>("[data-static-navigation-host]")].map(host => {
              const label = host.querySelector<HTMLElement>("[data-static-navigation-label]");
              const hostMarker = host.querySelector<HTMLElement>("[data-indicator-static-host-baseline]");
              const chip = host.querySelector<HTMLElement>("[data-static-navigation-chip]");
              const chipMarker = host.querySelector<HTMLElement>("[data-indicator-static-chip-baseline]");
              if (!label || !hostMarker) throw new Error("Missing static navigation host label proof.");
              const hostBox = rect(host);
              const hostStyle = getComputedStyle(host);
              const chipBox = chip ? rect(chip) : null;
              const chipStyle = chip ? getComputedStyle(chip) : null;
              const selectedPainter = host.matches(".bf-tabs-link[aria-selected='true']") ? getComputedStyle(host, "::after") : null;
              const selectionThickness = selectedPainter ? selectionPaintThickness(selectedPainter.boxShadow) : null;
              const badge = chip?.querySelector<HTMLElement>("[data-static-navigation-badge]") ?? null;
              const badgeBox = badge ? rect(badge) : null;
              const badgeStyle = badge ? getComputedStyle(badge) : null;
              const badgePaintHeight = badgeStyle ? Number.parseFloat(badgeStyle.backgroundSize.split(",")[0].trim().split(/\s+/)[1]) : null;
              const badgePaintInset = badgeBox && badgePaintHeight !== null ? (badgeBox.height - badgePaintHeight) / 2 : null;
              const stroke = chip ? resolveLength(chip, "--bf-stroke-width") : null;
              return {
                placement: host.dataset.staticPlacement,
                variant: host.dataset.staticVariant,
                tagName: host.tagName.toLowerCase(),
                host: hostBox,
                hostAlignItems: hostStyle.alignItems,
                hostLineHeight: Number.parseFloat(hostStyle.lineHeight),
                hostPaddingStart: Number.parseFloat(hostStyle.paddingBlockStart),
                hostPaddingEnd: Number.parseFloat(hostStyle.paddingBlockEnd),
                comfortableInset: resolveLength(host, "--bf-interface-row-padding-block"),
                barThickness: resolveLength(host, "--bf-bar-thickness"),
                borderWidth: resolveLength(host, "--bf-border-width"),
                labelLines: lineCount(label),
                absoluteBaseline: hostMarker.getBoundingClientRect().top,
                hostBaselineOffset: hostMarker.getBoundingClientRect().top - hostBox.top,
                itemTop: host.closest(".bf-tabs-item")?.getBoundingClientRect().top ?? null,
                chip: chipBox,
                chipAlignSelf: chipStyle?.alignSelf ?? null,
                chipBaselineDelta: chipMarker ? chipMarker.getBoundingClientRect().top - hostMarker.getBoundingClientRect().top : null,
                chipBinding: chipStyle?.getPropertyValue("--bf-chip-control-block-inset").trim() ?? null,
                chipDenseInset: chip ? resolveLength(chip, "--bf-control-block-inset-dense") : null,
                chipLineHeight: chipStyle ? Number.parseFloat(chipStyle.lineHeight) : null,
                chipMarginStart: chipStyle ? Number.parseFloat(chipStyle.marginBlockStart) : null,
                chipMarginEnd: chipStyle ? Number.parseFloat(chipStyle.marginBlockEnd) : null,
                chipPaddingStart: chipStyle ? Number.parseFloat(chipStyle.paddingBlockStart) : null,
                chipPaddingEnd: chipStyle ? Number.parseFloat(chipStyle.paddingBlockEnd) : null,
                chipUnclipped: chip ? chip.scrollWidth <= chip.clientWidth + 1 && chip.scrollHeight <= chip.clientHeight + 1 : null,
                statusAlignItems: chip?.closest<HTMLElement>(".bf-side-navigation-status") ? getComputedStyle(chip.closest<HTMLElement>(".bf-side-navigation-status")!).alignItems : null,
                statusAlignSelf: chip?.closest<HTMLElement>(".bf-side-navigation-status") ? getComputedStyle(chip.closest<HTMLElement>(".bf-side-navigation-status")!).alignSelf : null,
                chipHostClearance: chipBox ? { blockStart: chipBox.top - hostBox.top, blockEnd: hostBox.bottom - chipBox.bottom } : null,
                selectedPainter: selectedPainter ? {
                  boxShadow: selectedPainter.boxShadow,
                  borderBox: rect(host),
                  thickness: selectionThickness,
                  roleThickness: resolveLength(host, "--bf-bar-thickness"),
                  paintTop: hostBox.bottom - (selectionThickness ?? 0)
                } : null,
                badge: badgeBox,
                badgeBackgroundImage: badgeStyle?.backgroundImage ?? null,
                badgeChipClearance: badgeBox && badgePaintInset !== null && chipBox && stroke !== null ? {
                  blockStart: badgeBox.top + badgePaintInset - (chipBox.top + stroke),
                  blockEnd: chipBox.bottom - stroke - (badgeBox.bottom - badgePaintInset),
                  inlineStart: badgeBox.left - (chipBox.left + stroke),
                  inlineEnd: chipBox.right - stroke - badgeBox.right
                } : null
              };
            });
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
            const selectedTab = document.querySelector<HTMLElement>("[data-static-placement='ordinary-tab'][data-static-variant='chip']");
            const selectedTabAfter = selectedTab ? getComputedStyle(selectedTab, "::after") : null;
            const collapsedHost = document.querySelector<HTMLElement>("[data-boundary-collapsed-host]");
            const collapsedStatus = collapsedHost?.querySelector<HTMLElement>(".bf-side-navigation-status") ?? null;
            const tabLists = [...document.querySelectorAll<HTMLElement>("#density-deferred-track .bf-tabs-list")].map(list => {
              const listBox = rect(list);
              const listStyle = getComputedStyle(list);
              const baseline = resolveLength(list, "--bf-baseline");
              const items = [...list.querySelectorAll<HTMLElement>(":scope > .bf-tabs-item")].map(item => {
                const link = item.querySelector<HTMLElement>(":scope > .bf-tabs-link");
                if (!link) throw new Error("Missing direct Tab link in static navigation proof.");
                const itemBox = rect(item);
                const linkBox = rect(link);
                const itemStyle = getComputedStyle(item);
                const linkStyle = getComputedStyle(link);
                const painter = getComputedStyle(link, "::after");
                return {
                  item: itemBox,
                  link: linkBox,
                  active: link.getAttribute("aria-selected") === "true",
                  itemDisplay: itemStyle.display,
                  itemAlignItems: itemStyle.alignItems,
                  itemPaddingEnd: itemStyle.paddingBlockEnd,
                  linkAlignSelf: linkStyle.alignSelf,
                  linkBlockSize: linkStyle.blockSize,
                  linkMarginEnd: linkStyle.marginBlockEnd,
                  painterBottom: linkBox.bottom,
                  painterContent: painter.content,
                  painterBoxShadow: painter.boxShadow
                };
              });
              return {
                box: listBox,
                marginEnd: Number.parseFloat(listStyle.marginBlockEnd),
                baseline,
                staticClosure: list.style.getPropertyValue("--_bf-tabs-static-closure"),
                selected: list.querySelectorAll(".bf-tabs-link[aria-selected='true']").length,
                roving: list.querySelectorAll(".bf-tabs-link[tabindex='0']").length,
                items
              };
            });
            return {
              hosts,
              boundary,
              collapsedHost: collapsedHost ? {
                paddingStart: Number.parseFloat(getComputedStyle(collapsedHost).paddingBlockStart),
                comfortablePadding: resolveLength(collapsedHost, "--bf-interface-row-padding-block"),
                statusDisplay: collapsedStatus ? getComputedStyle(collapsedStatus).display : null
              } : null,
              selectedTabAfter: selectedTabAfter ? {
                blockSize: Number.parseFloat(selectedTabAfter.blockSize),
                bottom: Number.parseFloat(selectedTabAfter.bottom),
                content: selectedTabAfter.content,
                position: selectedTabAfter.position
              } : null,
              tabLists
            };
          });

          const comparisonHosts = proof.hosts.filter(host => ["ordinary-tab", "equal-tab", "side-navigation-link", "side-navigation-text"].includes(host.placement ?? ""));
          assert(comparisonHosts.length === 12, `Expected ${tier}/${rootFontSize}px/${deviceScaleFactor}x four plain/Chip/Badge placement triplets; got ${JSON.stringify(proof.hosts)}.`);
          measuredComparisonHosts += comparisonHosts.length;
          for (const host of comparisonHosts.filter(host => host.chip)) {
            assert(host.chipDenseInset !== null && host.chipPaddingStart !== null && host.chipPaddingEnd !== null && host.chipMarginStart !== null && host.chipMarginEnd !== null && host.chipLineHeight !== null, `Expected complete ${tier}/${host.placement}/${host.variant} Chip metrics.`);
            assert(Math.abs(host.chipPaddingStart - host.chipDenseInset) <= geometryTolerance && Math.abs(host.chipPaddingEnd - host.chipDenseInset) <= geometryTolerance && Math.abs(host.chipMarginStart) <= geometryTolerance && Math.abs(host.chipMarginEnd) <= geometryTolerance, `Expected ${tier}/${host.placement}/${host.variant} the selected dense inset with no child nudge or compensation; got ${JSON.stringify(host)}.`);
            assert(Math.abs(host.chip!.height - (host.chipLineHeight + (host.chipDenseInset * 2))) <= geometryTolerance, `Expected ${tier}/${host.placement}/${host.variant} the dense Chip painted height to remain line plus two generated insets; got ${JSON.stringify(host)}.`);
            assert(host.hostAlignItems === "baseline" && Math.abs(host.chipBaselineDelta ?? Number.POSITIVE_INFINITY) <= baselineTolerance, `Expected ${tier}/${host.placement}/${host.variant} Chip value to share the host label's first baseline; got ${JSON.stringify(host)}.`);
            if (host.placement.startsWith("side-navigation")) assert(host.statusAlignItems === "baseline" && host.statusAlignSelf === "baseline", `Expected ${tier}/${host.placement}/${host.variant} the trailing status wrapper to preserve the shared baseline; got ${JSON.stringify(host)}.`);
            assert(host.chipUnclipped && host.chipHostClearance && host.chipHostClearance.blockStart > geometryTolerance && host.chipHostClearance.blockEnd > geometryTolerance, `Expected ${tier}/${host.placement}/${host.variant} full Chip paint inside its host box; got ${JSON.stringify(host)}.`);
            minimumChipHostClearance = Math.min(minimumChipHostClearance, host.chipHostClearance.blockStart, host.chipHostClearance.blockEnd);
            if (host.selectedPainter) {
              assert(host.selectedPainter.boxShadow.includes("inset") && host.selectedPainter.thickness !== null && host.selectedPainter.thickness > 0 && Math.abs(host.selectedPainter.thickness - host.selectedPainter.roleThickness) <= geometryTolerance, `Expected ${tier}/${host.placement}/${host.variant} the existing selected Tab painter to remain visible at the bar role without affecting layout; got ${JSON.stringify(host)}.`);
            }
            if (host.badge) {
              assert(host.badgeBackgroundImage?.includes("gradient") && host.badgeChipClearance && Object.values(host.badgeChipClearance).every(value => value > geometryTolerance), `Expected ${tier}/${host.placement} Badge paint to remain visible and clear every Chip painted edge; got ${JSON.stringify(host)}.`);
              minimumBadgeChipClearance = Math.min(minimumBadgeChipClearance, ...Object.values(host.badgeChipClearance));
            }
          }

          for (const placement of ["ordinary-tab", "equal-tab", "side-navigation-link", "side-navigation-text"]) {
            const group = comparisonHosts.filter(host => host.placement === placement);
            const plain = group.find(host => host.variant === "plain");
            const chip = group.find(host => host.variant === "chip");
            const badge = group.find(host => host.variant === "badge");
            assert(plain && chip && badge && chip.chip && badge.chip, `Expected a complete ${tier}/${placement} comparison.`);
            const transferredInset = chip.chipDenseInset === null ? Number.NaN : Math.max(0, chip.comfortableInset - chip.chipDenseInset);
            const expectedStart = transferredInset;
            const expectedEnd = transferredInset;
            assert(chip.chipDenseInset !== null && Math.abs(chip.hostPaddingStart - expectedStart) <= geometryTolerance && Math.abs(chip.hostPaddingEnd - expectedEnd) <= geometryTolerance, `Expected ${tier}/${placement} the participating host to transfer the generated dense inset symmetrically without paint-driven growth; got ${JSON.stringify(group)}.`);
            assert(Math.abs(chip.chip.height - badge.chip.height) <= geometryTolerance, `Expected ${tier}/${placement} Badge not to grow its dense Chip; got ${JSON.stringify(group)}.`);
            if (placement.includes("tab")) {
              assert(plain.itemTop !== null && chip.itemTop !== null && badge.itemTop !== null, `Expected ${tier}/${placement} direct Tab items for peer baseline proof.`);
              if (placement === "ordinary-tab") {
                assert(Math.max(plain.itemTop, chip.itemTop, badge.itemTop) - Math.min(plain.itemTop, chip.itemTop, badge.itemTop) <= geometryTolerance && Math.max(plain.absoluteBaseline, chip.absoluteBaseline, badge.absoluteBaseline) - Math.min(plain.absoluteBaseline, chip.absoluteBaseline, badge.absoluteBaseline) <= baselineTolerance, `Expected ${tier}/${placement} plain, Chip and Badge Tab labels to share one absolute row baseline; got ${JSON.stringify(group)}.`);
              } else {
                const relativeBaselines = [plain, chip, badge].map(host => host.absoluteBaseline - host.itemTop!);
                assert(Math.max(...relativeBaselines) - Math.min(...relativeBaselines) <= baselineTolerance, `Expected ${tier}/${placement} wrapped rows to keep the same first-baseline phase from their own item tops; got ${JSON.stringify(group)}.`);
              }
            }
            if (placement !== "equal-tab" && plain.labelLines === chip.labelLines) {
              assert(Math.abs(chip.hostBaselineOffset - plain.hostBaselineOffset) <= baselineTolerance, `Expected ${tier}/${placement} single-line plain and Chip hosts to preserve the first-baseline offset; got ${JSON.stringify(group)}.`);
              const plainIntrinsicHeight = plain.hostLineHeight + plain.hostPaddingStart + plain.hostPaddingEnd;
              assert(Math.abs(chip.host.height - plainIntrinsicHeight) <= geometryTolerance && Math.abs(chip.host.height - plain.host.height) <= geometryTolerance, `Expected ${tier}/${placement} a dense Chip to preserve the equivalent single-line plain host size; got ${JSON.stringify(group)}.`);
            }
            if (chip.labelLines === badge.labelLines) assert(Math.abs(chip.host.height - badge.host.height) <= geometryTolerance, `Expected ${tier}/${placement} Badge not to grow the same-wrap Chip host; got ${JSON.stringify(group)}.`);
          }

          const equalHosts = comparisonHosts.filter(host => host.placement === "equal-tab");
          assert(equalHosts.every(host => host.labelLines >= 2) && Math.max(...equalHosts.map(host => host.host.width)) - Math.min(...equalHosts.map(host => host.host.width)) <= geometryTolerance, `Expected ${tier} equal Tabs to retain natural wrapping and equal columns; got ${JSON.stringify(equalHosts)}.`);
          assert(proof.selectedTabAfter && proof.selectedTabAfter.content !== "none" && proof.selectedTabAfter.position === "absolute" && proof.selectedTabAfter.blockSize > 0 && Math.abs(proof.selectedTabAfter.bottom) <= geometryTolerance, `Expected ${tier} the selected Chip tab underline to remain an out-of-flow block-end painter; got ${JSON.stringify(proof.selectedTabAfter)}.`);
          assert(proof.tabLists.every(list => list.selected === 1 && list.roving === 1), `Expected ${tier} every displayed Tab set to keep one selected roving tab stop; got ${JSON.stringify(proof.tabLists)}.`);
          for (const list of proof.tabLists) {
            const occupied = list.box.height + list.marginEnd;
            const remainder = ((occupied % list.baseline) + list.baseline) % list.baseline;
            const closureError = Math.min(remainder, list.baseline - remainder);
            assert(list.items.length > 0 && list.marginEnd >= 0 && list.baseline > 0 && list.staticClosure !== "" && closureError <= geometryTolerance && Math.abs(list.box.bottom - Math.max(...list.items.map(item => item.item.bottom))) <= geometryTolerance, `Expected ${tier} each affected Tab list to close its occupied box and measured trailing remainder on the baseline; got ${JSON.stringify({ ...list, occupied, closureError })}.`);
            for (const item of list.items) assert(Math.abs(item.item.top - item.link.top) <= geometryTolerance && Math.abs(item.item.bottom - item.link.bottom) <= geometryTolerance, `Expected ${tier} every static Tab link painter to occupy its grid/flex item without clipped row closure; got ${JSON.stringify(item)}.`);
          }

          const focusProofs = await page.evaluate(async () => {
            const rect = (element: Element | Range) => {
              const value = element.getBoundingClientRect();
              return { left: value.left, right: value.right, top: value.top, bottom: value.bottom, width: value.width, height: value.height };
            };
            const textInk = (element: HTMLElement) => {
              const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
              let node = walker.nextNode();
              while (node && !node.textContent?.trim()) node = walker.nextNode();
              if (!node) throw new Error("Missing readable text in focused static navigation proof.");
              const range = document.createRange();
              range.selectNodeContents(node);
              return rect(range);
            };
            const measure = (host: HTMLElement) => {
              const chip = host.querySelector<HTMLElement>("[data-static-navigation-chip]");
              const label = host.querySelector<HTMLElement>("[data-static-navigation-label]");
              const chipValue = chip?.querySelector<HTMLElement>(".bf-chip-value");
              if (!chip || !label || !chipValue) throw new Error("Missing focused static navigation proof anatomy.");
              const hostBox = rect(host);
              const chipBox = rect(chip);
              const list = host.closest<HTMLElement>(".bf-tabs-list");
              return {
                host: hostBox,
                chip: chipBox,
                chipRelative: { top: chipBox.top - hostBox.top, bottom: hostBox.bottom - chipBox.bottom },
                labelInk: textInk(label),
                chipInk: textInk(chipValue),
                list: list ? rect(list) : null
              };
            };
            const results = [];
            const hosts = [...document.querySelectorAll<HTMLElement>("[data-static-navigation-host]")].filter(host => host.matches("button, a") && host.querySelector("[data-static-navigation-chip]"));
            for (const host of hosts) {
              const before = measure(host);
              host.focus();
              await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
              const after = measure(host);
              const style = getComputedStyle(host);
              const outlineWidth = Number.parseFloat(style.outlineWidth);
              const outlineOffset = Number.parseFloat(style.outlineOffset);
              const inwardOutline = Math.max(0, -outlineOffset);
              results.push({
                placement: host.dataset.staticPlacement,
                variant: host.dataset.staticVariant,
                before,
                after,
                focusVisible: host.matches(":focus-visible"),
                outlineStyle: style.outlineStyle,
                outlineColor: style.outlineColor,
                outlineWidth,
                outlineOffset,
                inwardOutline,
                labelColor: getComputedStyle(host.querySelector<HTMLElement>("[data-static-navigation-label]")!).color,
                chipColor: getComputedStyle(host.querySelector<HTMLElement>(".bf-chip-value")!).color
              });
              host.blur();
            }
            return results;
          });
          assert(focusProofs.length === 8, `Expected ${tier} keyboard-focus proof for the two original and six comparison Chip hosts; got ${JSON.stringify(focusProofs)}.`);
          for (const focus of focusProofs) {
            const sameRect = (before: { width: number; height: number }, after: { width: number; height: number }) => Math.abs(before.width - after.width) <= geometryTolerance && Math.abs(before.height - after.height) <= geometryTolerance;
            const transparent = (color: string) => color === "transparent" || color === "rgba(0, 0, 0, 0)";
            assert(focus.focusVisible && focus.outlineStyle !== "none" && focus.outlineWidth > 0 && focus.outlineOffset < 0 && !transparent(focus.outlineColor), `Expected ${tier}/${focus.placement}/${focus.variant} the existing inward keyboard-focus outline to remain visible; got ${JSON.stringify(focus)}.`);
            assert(sameRect(focus.before.host, focus.after.host) && sameRect(focus.before.chip, focus.after.chip) && Math.abs(focus.before.chipRelative.top - focus.after.chipRelative.top) <= geometryTolerance && Math.abs(focus.before.chipRelative.bottom - focus.after.chipRelative.bottom) <= geometryTolerance && (!focus.before.list || !focus.after.list || sameRect(focus.before.list, focus.after.list)), `Expected ${tier}/${focus.placement}/${focus.variant} focus paint to leave host, Chip and Tab-list geometry unchanged; got ${JSON.stringify(focus)}.`);
            const sameInk = (before: { left: number; top: number; width: number; height: number }, after: { left: number; top: number; width: number; height: number }) => Math.abs((before.left - focus.before.host.left) - (after.left - focus.after.host.left)) <= geometryTolerance && Math.abs((before.top - focus.before.host.top) - (after.top - focus.after.host.top)) <= geometryTolerance && sameRect(before, after);
            const chipInkInsideChip = focus.after.chipInk.left >= focus.after.chip.left - geometryTolerance && focus.after.chipInk.right <= focus.after.chip.right + geometryTolerance && focus.after.chipInk.top >= focus.after.chip.top - geometryTolerance && focus.after.chipInk.bottom <= focus.after.chip.bottom + geometryTolerance;
            assert(focus.after.labelInk.width > 0 && focus.after.labelInk.height > 0 && focus.after.chipInk.width > 0 && focus.after.chipInk.height > 0 && sameInk(focus.before.labelInk, focus.after.labelInk) && sameInk(focus.before.chipInk, focus.after.chipInk) && chipInkInsideChip && !transparent(focus.labelColor) && !transparent(focus.chipColor), `Expected ${tier}/${focus.placement}/${focus.variant} focus paint to preserve visible host and Chip text ink; got ${JSON.stringify(focus)}.`);
          }
          measuredFocusStates += focusProofs.length;

          const standalone = proof.boundary["standalone-nested"];
          const orphan = proof.boundary["orphan-status"];
          const collapsed = proof.boundary["collapsed-navigation"];
          const outer = proof.boundary["outer-valid"];
          const blocked = proof.boundary["nested-blocked"];
          const inner = proof.boundary["inner-reselected"];
          const clickable = proof.boundary["clickable-chip"];
          const dismissible = proof.boundary["dismissible-chip"];
          assert(standalone && orphan && collapsed && outer && blocked && inner && clickable && dismissible, `Expected complete ${tier} provider-boundary fixtures; got ${JSON.stringify(proof.boundary)}.`);
          for (const outside of [standalone, orphan, clickable, dismissible]) assert(Math.abs(outside.padding - outside.defaultInset) <= geometryTolerance && outside.marginEnd > -geometryTolerance, `Expected ${tier} legacy class, orphan status and interactive anatomy to retain their own standalone seat; got ${JSON.stringify(proof.boundary)}.`);
          assert(Math.abs(collapsed.padding - outer.dense) <= geometryTolerance && proof.collapsedHost && Math.abs(proof.collapsedHost.paddingStart - proof.collapsedHost.comfortablePadding) <= geometryTolerance && proof.collapsedHost.statusDisplay === "none", `Expected ${tier} the legal collapsed trailing Chip to remain dense while its hidden status has no host-layout effect; got ${JSON.stringify({ boundary: proof.boundary, host: proof.collapsedHost })}.`);
          assert(Math.abs(blocked.padding - blocked.defaultInset) <= geometryTolerance && Math.abs(blocked.dense - outer.dense) > geometryTolerance, `Expected ${tier} the opposing nested product root to block outer enrollment and expose its own standalone inputs; got ${JSON.stringify(proof.boundary)}.`);
          for (const enrolled of [outer, inner]) assert(Math.abs(enrolled.padding - enrolled.dense) <= geometryTolerance && Math.abs(enrolled.marginStart) <= geometryTolerance && Math.abs(enrolled.marginEnd) <= geometryTolerance, `Expected ${tier} valid outer and re-established inner providers to select their own dense member without child compensation; got ${JSON.stringify(proof.boundary)}.`);
          assert(Math.abs(inner.dense - outer.dense) > geometryTolerance, `Expected ${tier} the inner legal host to reselect its explicitly different product root; got ${JSON.stringify(proof.boundary)}.`);
          measuredStates += 1;
        }
      }

      await page.evaluate(() => { document.documentElement.style.fontSize = "16px"; });
      await page.locator("[data-page-chrome-tier-select]").selectOption("editorial");
      await page.waitForFunction(() => document.body.dataset.bfTier === "editorial");
      await waitForFonts(page);
      await page.waitForFunction(() => [...document.querySelectorAll<HTMLElement>("#density-deferred-track .bf-tabs-list")].every(list => list.style.getPropertyValue("--_bf-tabs-static-closure") !== ""));
      const painterMutation = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>("[data-static-placement$='tab'][data-static-variant='chip']")].map(host => {
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
        const role = (() => {
          const probe = document.createElement("span");
          probe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;inline-size:var(--bf-bar-thickness);block-size:0";
          host.append(probe);
          const width = probe.getBoundingClientRect().width;
          probe.remove();
          return width;
        })();
        const previous = host.style.getPropertyValue("--bf-overlay-stroke-layer");
        host.style.setProperty("--bf-overlay-stroke-layer", "inset 0 0 0 transparent");
        const missing = paintThickness();
        if (previous) host.style.setProperty("--bf-overlay-stroke-layer", previous);
        else host.style.removeProperty("--bf-overlay-stroke-layer");
        const restored = paintThickness();
        return { before, missing, restored, role };
      }));
      assert(painterMutation.length === 2 && painterMutation.every(result => Math.abs(result.before - result.role) <= geometryTolerance && result.missing <= geometryTolerance && Math.abs(result.restored - result.role) <= geometryTolerance), `Expected the selected-painter oracle to reject a missing actual overlay and observe its restoration at the bar role; got ${JSON.stringify(painterMutation)}.`);

      const readActiveState = (placement: "ordinary-tab" | "equal-tab") => page.evaluate(currentPlacement => {
        const links = [...document.querySelectorAll<HTMLElement>(`[data-static-placement='${currentPlacement}']`)];
        const active = links.find(link => link.getAttribute("aria-selected") === "true");
        const list = active?.closest<HTMLElement>(".bf-tabs-list");
        const item = active?.closest<HTMLElement>(".bf-tabs-item");
        if (!active || !list || !item) throw new Error(`Missing active ${currentPlacement} state.`);
        const rect = (element: Element) => element.getBoundingClientRect();
        const activeBox = rect(active);
        const painterShadow = getComputedStyle(active, "::after").boxShadow;
        const layers: string[] = [];
        let depth = 0;
        let start = 0;
        for (let index = 0; index < painterShadow.length; index += 1) {
          if (painterShadow[index] === "(") depth += 1;
          if (painterShadow[index] === ")") depth -= 1;
          if (painterShadow[index] === "," && depth === 0) {
            layers.push(painterShadow.slice(start, index).trim());
            start = index + 1;
          }
        }
        layers.push(painterShadow.slice(start).trim());
        const thickness = Math.max(0, ...layers.flatMap(layer => {
          if (!layer.includes("inset")) return [];
          const lengths = [...layer.matchAll(/(-?\d+(?:\.\d+)?)px/g)].map(match => Number.parseFloat(match[1]));
          return lengths.length >= 2 && lengths[1] < 0 ? [Math.abs(lengths[1])] : [];
        }));
        const paintedLinks = links.filter(link => {
          const painter = getComputedStyle(link, "::after");
          const shadow = painter.boxShadow;
          const shadowLayers: string[] = [];
          let shadowDepth = 0;
          let shadowStart = 0;
          for (let index = 0; index < shadow.length; index += 1) {
            if (shadow[index] === "(") shadowDepth += 1;
            if (shadow[index] === ")") shadowDepth -= 1;
            if (shadow[index] === "," && shadowDepth === 0) {
              shadowLayers.push(shadow.slice(shadowStart, index).trim());
              shadowStart = index + 1;
            }
          }
          shadowLayers.push(shadow.slice(shadowStart).trim());
          return painter.content !== "none" && shadowLayers.some(layer => {
            if (!layer.includes("inset")) return false;
            const lengths = [...layer.matchAll(/(-?\d+(?:\.\d+)?)px/g)].map(match => Number.parseFloat(match[1]));
            return lengths.length >= 2 && lengths[1] < 0;
          });
        }).length;
        const controls = active.getAttribute("aria-controls");
        return {
          variant: active.dataset.staticVariant,
          selected: links.filter(link => link.getAttribute("aria-selected") === "true").length,
          roving: links.filter(link => link.tabIndex === 0).length,
          paintedLinks,
          panelVisible: controls ? document.getElementById(controls)?.getAttribute("aria-hidden") === "false" : false,
          listHeight: rect(list).height,
          listBottom: rect(list).bottom,
          itemBottom: rect(item).bottom,
          linkBottom: activeBox.bottom,
          painterShadow,
          painterThickness: thickness,
          painterRole: (() => {
            const probe = document.createElement("span");
            probe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;inline-size:var(--bf-bar-thickness);block-size:0";
            active.append(probe);
            const width = probe.getBoundingClientRect().width;
            probe.remove();
            return width;
          })()
        };
      }, placement);

      for (const placement of ["ordinary-tab", "equal-tab"] as const) {
        const initial = await readActiveState(placement);
        for (const variant of ["plain", "badge", "chip"] as const) {
          await page.locator(`[data-static-placement='${placement}'][data-static-variant='${variant}']`).click();
          const state = await readActiveState(placement);
          assert(state.variant === variant && state.selected === 1 && state.roving === 1 && state.paintedLinks === 1 && state.panelVisible, `Expected ${placement}/${variant} activation to retain one selected roving tab, one actual selection painter and its panel; got ${JSON.stringify(state)}.`);
          assert(state.painterShadow.includes("inset") && state.painterThickness > 0 && Math.abs(state.painterThickness - state.painterRole) <= geometryTolerance && Math.abs(state.itemBottom - state.linkBottom) <= geometryTolerance && state.listBottom + geometryTolerance >= state.itemBottom && Math.abs(state.listHeight - initial.listHeight) <= geometryTolerance, `Expected ${placement}/${variant} active paint to retain its role and occupied geometry without a state-dependent jump; got ${JSON.stringify({ initial, state })}.`);
        }
      }
      if (deviceScaleFactor === 1) {
        const initialLifecycle = await page.evaluate(async () => {
          const fixture = document.createElement("div");
          fixture.dataset.staticChipLifecycleFixture = "";
          fixture.style.cssText = "position:fixed;inset-block-start:0;inset-inline-start:-10000px;visibility:hidden;inline-size:40rem";
          fixture.innerHTML = `
            <div class="bf-tabs">
              <ul class="bf-tabs-list" role="tablist" data-lifecycle-list style="block-size:4rem">
                <li class="bf-tabs-item"><button class="bf-tabs-link" type="button" role="tab" aria-selected="true" tabindex="0"><span data-lifecycle-label><span class="bucket-baseline-marker" data-lifecycle-host-baseline></span>Stable row</span></button></li>
              </ul>
            </div>
            <div class="bf-tabs">
              <ul class="bf-tabs-list" role="tablist" data-lifecycle-unrelated style="block-size:4rem">
                <li class="bf-tabs-item"><button class="bf-tabs-link" type="button" role="tab" aria-selected="true" tabindex="0">Unrelated row</button></li>
              </ul>
            </div>`;
          document.body.append(fixture);
          const { initTabs } = await import("/dist/index.js");
          const cleanup = initTabs({ root: fixture });
          (globalThis as typeof globalThis & { __staticChipLifecycleCleanup?: () => void }).__staticChipLifecycleCleanup = cleanup;
          await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
          const list = fixture.querySelector<HTMLElement>("[data-lifecycle-list]")!;
          const unrelated = fixture.querySelector<HTMLElement>("[data-lifecycle-unrelated]")!;
          return {
            listHeight: list.getBoundingClientRect().height,
            privateClosure: list.style.getPropertyValue("--_bf-tabs-static-closure"),
            rowAlign: list.style.getPropertyValue("--_bf-tabs-row-align"),
            unrelatedClosure: unrelated.style.getPropertyValue("--_bf-tabs-static-closure")
          };
        });
        assert(initialLifecycle.privateClosure === "" && initialLifecycle.rowAlign === "" && initialLifecycle.unrelatedClosure === "", `Expected initialized no-Chip lists to retain fallback closure before dynamic membership; got ${JSON.stringify(initialLifecycle)}.`);
        await page.evaluate(() => {
          const link = document.querySelector<HTMLElement>("[data-static-chip-lifecycle-fixture] [data-lifecycle-list] .bf-tabs-link");
          if (!link) throw new Error("Missing dynamic static-Chip lifecycle host.");
          const wrapper = document.createElement("span");
          wrapper.dataset.lifecycleNeutralWrapper = "";
          wrapper.innerHTML = `<span class="bf-chip" data-lifecycle-chip><span class="bf-chip-value">New<span class="bucket-baseline-marker" data-lifecycle-chip-baseline></span></span></span>`;
          link.append(wrapper);
        });
        await page.waitForFunction(() => document.querySelector<HTMLElement>("[data-lifecycle-list]")?.style.getPropertyValue("--_bf-tabs-static-closure") !== "");
        const insertedLifecycle = await page.evaluate(() => {
          const list = document.querySelector<HTMLElement>("[data-lifecycle-list]")!;
          const unrelated = document.querySelector<HTMLElement>("[data-lifecycle-unrelated]")!;
          const chip = document.querySelector<HTMLElement>("[data-lifecycle-chip]")!;
          const hostMarker = document.querySelector<HTMLElement>("[data-lifecycle-host-baseline]")!;
          const chipMarker = document.querySelector<HTMLElement>("[data-lifecycle-chip-baseline]")!;
          const resolveLength = (element: HTMLElement, property: string) => {
            const probe = document.createElement("span");
            probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;inline-size:var(${property});block-size:0;padding:0;border:0`;
            element.append(probe);
            const value = probe.getBoundingClientRect().width;
            probe.remove();
            return value;
          };
          const style = getComputedStyle(chip);
          const listStyle = getComputedStyle(list);
          const baseline = resolveLength(list, "--bf-baseline");
          const occupied = list.getBoundingClientRect().height + Number.parseFloat(listStyle.marginBlockEnd);
          const remainder = ((occupied % baseline) + baseline) % baseline;
          return {
            listHeight: list.getBoundingClientRect().height,
            privateClosure: list.style.getPropertyValue("--_bf-tabs-static-closure"),
            rowAlign: list.style.getPropertyValue("--_bf-tabs-row-align"),
            unrelatedClosure: unrelated.style.getPropertyValue("--_bf-tabs-static-closure"),
            chipPadding: Number.parseFloat(style.paddingBlockStart),
            denseInset: resolveLength(chip, "--bf-control-block-inset-dense"),
            baselineDelta: chipMarker.getBoundingClientRect().top - hostMarker.getBoundingClientRect().top,
            closureError: Math.min(remainder, baseline - remainder)
          };
        });
        assert(Math.abs(insertedLifecycle.listHeight - initialLifecycle.listHeight) <= geometryTolerance && insertedLifecycle.privateClosure !== "" && insertedLifecycle.rowAlign === "baseline" && insertedLifecycle.unrelatedClosure === "" && Math.abs(insertedLifecycle.chipPadding - insertedLifecycle.denseInset) <= geometryTolerance && Math.abs(insertedLifecycle.baselineDelta) <= baselineTolerance && insertedLifecycle.closureError <= geometryTolerance, `Expected a neutral-wrapped static Chip inserted after initialization to enroll and close without relying on list resize; got ${JSON.stringify({ initialLifecycle, insertedLifecycle })}.`);
        await page.evaluate(() => document.querySelector("[data-lifecycle-neutral-wrapper]")?.remove());
        await page.waitForFunction(() => document.querySelector<HTMLElement>("[data-lifecycle-list]")?.style.getPropertyValue("--_bf-tabs-static-closure") === "");
        const removedLifecycle = await page.evaluate(() => {
          const list = document.querySelector<HTMLElement>("[data-lifecycle-list]")!;
          const unrelated = document.querySelector<HTMLElement>("[data-lifecycle-unrelated]")!;
          return {
            listHeight: list.getBoundingClientRect().height,
            privateClosure: list.style.getPropertyValue("--_bf-tabs-static-closure"),
            rowAlign: list.style.getPropertyValue("--_bf-tabs-row-align"),
            unrelatedClosure: unrelated.style.getPropertyValue("--_bf-tabs-static-closure")
          };
        });
        assert(Math.abs(removedLifecycle.listHeight - initialLifecycle.listHeight) <= geometryTolerance && removedLifecycle.privateClosure === "" && removedLifecycle.rowAlign === "" && removedLifecycle.unrelatedClosure === "", `Expected removal to restore the initialized list fallback without affecting an unrelated list; got ${JSON.stringify({ initialLifecycle, removedLifecycle })}.`);
        await page.evaluate(() => {
          const lifecycle = globalThis as typeof globalThis & { __staticChipLifecycleCleanup?: () => void };
          lifecycle.__staticChipLifecycleCleanup?.();
          delete lifecycle.__staticChipLifecycleCleanup;
          document.querySelector("[data-static-chip-lifecycle-fixture]")?.remove();
        });
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }

  assert(measuredStates === deviceScaleFactors.length * rootFontSizes.length * tiers.length, `Expected all static navigation tier/root/device-scale states; got ${measuredStates}.`);
  console.log(`Static navigation Chip density passed: ${measuredStates} states, ${measuredComparisonHosts} comparison hosts, ${measuredFocusStates} focus states, minimum host clearance ${minimumChipHostClearance.toFixed(3)}px, minimum Badge clearance ${minimumBadgeChipClearance.toFixed(3)}px.`);
}
