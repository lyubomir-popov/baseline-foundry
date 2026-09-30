import fs from "node:fs/promises";
import path from "node:path";
import { readFontMetrics, type FontMetrics } from "@lyubomir-popov/baseline-nudge-generator";
import type { Page } from "playwright";
import { BODY_LINE_RHYTHM_ROLES, computeBodyLineRhythm, type BodyLineRhythmRoleInput } from "../../src/body-line-rhythm.ts";
import { BODY_LINE_RHYTHM_SECTION_END, BODY_LINE_RHYTHM_SECTION_START } from "../../src/css.ts";
import { resolveTierPath } from "../../src/presets.ts";
import type { ThemeFontFile } from "../../src/types.ts";
import { waitForFonts } from "../component-demo-shared.ts";
import { assert, openBrowser } from "./browser-helpers.ts";

const TIERS = ["editorial", "documentation", "app", "os"] as const;
type Tier = typeof TIERS[number];
const ROOT_SIZES = [16, 32] as const;
const TOLERANCE_PX = 0.1;
const DEMO_ROUTE = "/demo/spec/body-line-rhythm.html";

// Contract "Wrapped qualifying" (lh mod step = 0) and the four named two-line proofs (research R3).
const WRAPPED_QUALIFYING: Record<Tier, string[]> = {
  editorial: ["h1", "h2", "h5", "h6"],
  documentation: ["h1", "h2"],
  app: ["h5", "h6"],
  os: ["h3", "h4", "h5", "h6"]
};
const WRAPPED_EXCEPTION_PROOF: Record<Tier, string> = { editorial: "h3", documentation: "h3", app: "h1", os: "h1" };
const WRAPPED_EXCEPTION_PREDICTION_REM = 0.5;
// Owner ruling R4 prediction for the joined h1 to h2 baseline distance, rem.
const HGROUP_H1_H2_REM: Record<Tier, number> = { editorial: 3, documentation: 2.5, app: 2.5, os: 2 };

interface RoleExpectation {
  lineHeight: number;
  nudge: number;
  firstBaseline: number;
  phase: number;
  closure: number;
}

interface TierExpectation {
  baselineUnit: number;
  step: number;
  roles: Record<string, RoleExpectation>;
}

interface Box {
  tag: string;
  role: string;
  parent: number;
  top: number;
  height: number;
  lineHeight: number;
  marginBottom: number;
  paddingTop: number;
  probes: number[];
  dot: number | null;
}

interface TreeNode extends Box {
  children: TreeNode[];
}

interface Flow {
  variant: string;
  name: string;
  top: number;
  boxes: Box[];
  children: TreeNode[];
}

export interface BodyLineRhythmRecord {
  tier: Tier;
  rootSize: number;
  epsilon: Record<string, number>;
  maxPhaseResidual: number;
  maxWholeStepOffset: number;
  maxMainResidual: number;
  measured: Record<string, number>;
  exceptions: Record<string, { measured: number; predicted: number | null; }>;
}

function rem(value: unknown): number {
  return typeof value === "string" ? Number.parseFloat(value.replace("rem", "")) : Number.NaN;
}

function offStep(value: number, step: number): number {
  return Math.abs(value - Math.round(value / step) * step);
}

function stripSection(css: string): string {
  const start = css.indexOf(BODY_LINE_RHYTHM_SECTION_START);
  const end = css.indexOf(BODY_LINE_RHYTHM_SECTION_END);
  assert(start >= 0 && end > start, "Expected the tier bundle to carry one body-line rhythm section.");
  return css.slice(0, start) + css.slice(end + BODY_LINE_RHYTHM_SECTION_END.length);
}

async function readExpectations(): Promise<Record<Tier, TierExpectation>> {
  const entries = await Promise.all(TIERS.map(async tier => {
    const tokens = JSON.parse(await fs.readFile(path.resolve(`dist/tiers/${tier}/tokens.json`), "utf8")) as {
      baselineUnit: string;
      roles: Record<string, BodyLineRhythmRoleInput>;
    };
    const configPath = resolveTierPath(tier);
    const config = JSON.parse(await fs.readFile(configPath, "utf8")) as { fontFiles: ThemeFontFile[]; };
    const metricsByFamily: Record<string, FontMetrics> = {};
    for (const fontFile of config.fontFiles.filter(candidate => !candidate.runtimeOnly)) {
      metricsByFamily[fontFile.family] = await readFontMetrics(path.resolve(path.dirname(configPath), fontFile.path));
    }
    const baselineUnit = rem(tokens.baselineUnit);
    const result = computeBodyLineRhythm(metricsByFamily, baselineUnit, tokens.roles);
    assert(result.failures.length === 0, `Expected ${tier} body-line rhythm expectations to compute cleanly; got ${result.failures.join(" ")}`);
    const roles: Record<string, RoleExpectation> = {};
    for (const role of BODY_LINE_RHYTHM_ROLES) {
      const record = result.roles[role];
      assert(record, `Expected a ${tier}/${role} rhythm record.`);
      roles[role] = {
        lineHeight: rem(tokens.roles[role].lineHeight),
        nudge: rem(tokens.roles[role].nudgeTop),
        firstBaseline: rem(record.firstBaseline),
        phase: rem(record.phaseStart),
        closure: rem(record.closureEnd)
      };
    }
    return [tier, { baselineUnit, step: rem(result.roles.body.rhythmStep), roles }] as const;
  }));
  return Object.fromEntries(entries) as Record<Tier, TierExpectation>;
}

function toTree(boxes: Box[]): TreeNode[] {
  const nodes: TreeNode[] = boxes.map(box => ({ ...box, children: [] }));
  const roots: TreeNode[] = [];
  for (const node of nodes) {
    (node.parent < 0 ? roots : nodes[node.parent].children).push(node);
  }
  return roots;
}

/** Every list item in document order, at any nesting depth. */
function listItems(nodes: TreeNode[]): TreeNode[] {
  return nodes.flatMap(node => [...(node.tag === "li" ? [node] : []), ...listItems(node.children)]);
}

function firstLine(item: TreeNode): number {
  const text = item.probes.length ? item : item.children.find(child => child.tag === "p" && child.probes.length);
  assert(text, "Expected a list item with one probed first line.");
  return text.probes[0];
}

async function openDemo(page: Page, origin: string): Promise<string[]> {
  const runtimeErrors: string[] = [];
  page.on("pageerror", error => runtimeErrors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });
  await page.goto(`${origin}${DEMO_ROUTE}`, { waitUntil: "networkidle" });
  await waitForFonts(page);
  const probeCount = await page.evaluate(() => {
    let inserted = 0;
    for (const target of document.querySelectorAll<HTMLElement>("[data-body-line-flow] :is(p, h1, h2, h3, h4, h5, h6, li, blockquote)")) {
      const first = Array.from(target.childNodes).find(node => node.nodeType !== Node.TEXT_NODE || node.textContent?.trim());
      const lineStarts = first?.nodeType === Node.TEXT_NODE ? [first] : [];
      for (const br of target.querySelectorAll(":scope > br")) {
        if (br.nextSibling) lineStarts.push(br.nextSibling);
      }
      for (const start of lineStarts) {
        const probe = document.createElement("span");
        probe.dataset.bodyLineProbe = "";
        probe.style.cssText = "display:inline-block;block-size:0;inline-size:0;margin:0;padding:0;vertical-align:baseline";
        target.insertBefore(probe, start);
        inserted += 1;
      }
    }
    return inserted;
  });
  assert(probeCount > 0, "Expected the body-line rhythm fixtures to accept baseline probes.");
  await page.locator("[data-page-chrome-tier-select]").waitFor({ state: "visible" });
  return runtimeErrors;
}

async function setSurface(page: Page, tier: Tier, rootSize: number): Promise<void> {
  const tierSelect = page.locator("[data-page-chrome-tier-select]");
  if (await tierSelect.inputValue() !== tier) {
    await tierSelect.selectOption(tier);
  }
  await page.waitForFunction(expected => document.body.dataset.bfTier === expected
    && Array.from(document.querySelectorAll("[data-body-line-root]")).every(root => root.classList.contains(`bf-tier-${expected}`)), tier);
  await page.evaluate(size => { document.documentElement.style.fontSize = `${size}px`; }, rootSize);
  await waitForFonts(page);
}

async function readFlows(page: Page): Promise<Flow[]> {
  const rawFlows = await page.evaluate(() => Array.from(document.querySelectorAll<HTMLElement>("[data-body-line-flow]")).map(flow => {
    const elements = Array.from(flow.querySelectorAll<HTMLElement>("*"))
      .filter(element => !element.hasAttribute("data-body-line-probe") && element.tagName !== "BR");
    return {
      variant: flow.closest<HTMLElement>("[data-body-line-root]")?.dataset.bodyLineRoot ?? "",
      name: flow.dataset.bodyLineFlow ?? "",
      top: flow.getBoundingClientRect().top,
      boxes: elements.map(element => {
        const rect = element.getBoundingClientRect();
        const styles = getComputedStyle(element);
        const roleClass = Array.from(element.classList).find(name => /^bf-(body|h[1-6])$/.test(name));
        const before = element.tagName === "LI" ? getComputedStyle(element, "::before") : null;
        return {
          tag: element.tagName.toLowerCase(),
          role: roleClass ? roleClass.slice(3) : /^H[1-6]$/.test(element.tagName) ? element.tagName.toLowerCase() : "body",
          parent: elements.indexOf(element.parentElement as HTMLElement),
          top: rect.top,
          height: rect.height,
          lineHeight: Number.parseFloat(styles.lineHeight),
          marginBottom: Number.parseFloat(styles.marginBottom),
          paddingTop: Number.parseFloat(styles.paddingTop),
          probes: Array.from(element.children)
            .filter(child => child.hasAttribute("data-body-line-probe"))
            .map(child => child.getBoundingClientRect().bottom),
          dot: before && before.content !== "none" && before.position === "absolute"
            ? rect.top + Number.parseFloat(before.top) + Number.parseFloat(before.height) / 2
            : null
        };
      })
    };
  }));
  return rawFlows.map(flow => ({ ...flow, children: toTree(flow.boxes) }));
}

function flowFinder(flows: Flow[]): (variant: string, name: string) => Flow {
  return (variant, name) => {
    const match = flows.find(candidate => candidate.variant === variant && candidate.name === name);
    assert(match, `Expected a ${variant} ${name} body-line fixture.`);
    return match;
  };
}

/** Spec 026: rendered proof of the default body-line rhythm and the .is-baseline-rhythm opt-out on demo/spec/body-line-rhythm.html. */
export async function verifyBodyLineRhythm(origin: string): Promise<BodyLineRhythmRecord[]> {
  const expectations = await readExpectations();
  for (const tier of TIERS) {
    const { step, roles } = expectations[tier];
    const qualifying = ["h1", "h2", "h3", "h4", "h5", "h6"].filter(role => offStep(roles[role].lineHeight, step) < 1e-6);
    assert(JSON.stringify(qualifying) === JSON.stringify(WRAPPED_QUALIFYING[tier]), `Expected ${tier} wrapped-qualifying roles ${WRAPPED_QUALIFYING[tier].join(", ")}; computed ${qualifying.join(", ")}.`);
  }

  const records: BodyLineRhythmRecord[] = [];
  const browser = await openBrowser();

  try {
    const page = await browser.newPage({ deviceScaleFactor: 1, viewport: { width: 1440, height: 960 } });
    // The same route with the section removed renders main's baseline-unit CSS byte for byte (static identity, AC-2).
    const mainPage = await browser.newPage({ deviceScaleFactor: 1, viewport: { width: 1440, height: 960 } });
    await mainPage.route("**/dist/tiers/*/styles.css", async route => {
      const response = await route.fetch();
      await route.fulfill({ response, body: stripSection(await response.text()) });
    });
    const runtimeErrors = await openDemo(page, origin);
    const mainErrors = await openDemo(mainPage, origin);

    for (const tier of TIERS) {
      for (const rootSize of ROOT_SIZES) {
        await setSurface(page, tier, rootSize);
        await setSurface(mainPage, tier, rootSize);
        const flow = flowFinder(await readFlows(page));
        const mainFlow = flowFinder(await readFlows(mainPage));
        const { baselineUnit, step, roles } = expectations[tier];
        const stepPx = step * rootSize;
        const label = `${tier} at a ${rootSize}px root`;
        const record: BodyLineRhythmRecord = { tier, rootSize, epsilon: {}, maxPhaseResidual: 0, maxWholeStepOffset: 0, maxMainResidual: 0, measured: {}, exceptions: {} };
        const offset = (node: TreeNode) => node.probes[0] - node.top;

        // Owner ruling R1: every .is-baseline-rhythm fixture renders main's geometry exactly.
        for (const name of ["ledger", "matrix", "hgroup", "wrapped", "tight", "loose", "nested-list", "ordered", "flush", "rule", "quote"]) {
          const optOut = flow("baseline", name);
          const reference = mainFlow("baseline", name);
          assert(optOut.boxes.length === reference.boxes.length, `Expected ${label} opt-out ${name} fixture to mirror main.`);
          optOut.boxes.forEach((box, index) => {
            const main = reference.boxes[index];
            const pairs: Array<[string, number, number]> = [
              ["top", box.top - optOut.top, main.top - reference.top],
              ["height", box.height, main.height],
              ["margin-bottom", box.marginBottom, main.marginBottom],
              ["padding-top", box.paddingTop, main.paddingTop],
              ...box.probes.map((probe, line): [string, number, number] => [`line ${line + 1} baseline`, probe - optOut.top, main.probes[line] - reference.top]),
              ...(box.dot === null || main.dot === null ? [] : [["dot", box.dot - optOut.top, main.dot - reference.top] as [string, number, number]])
            ];
            assert(box.probes.length === main.probes.length && (box.dot === null) === (main.dot === null), `Expected ${label} opt-out ${name} ${box.tag} ${index} to keep main's lines and marker.`);
            for (const [what, actual, expected] of pairs) {
              const residual = Math.abs(actual - expected);
              record.maxMainResidual = Math.max(record.maxMainResidual, residual);
              assert(residual <= TOLERANCE_PX, `Expected ${label} .is-baseline-rhythm ${name} ${box.tag} ${index} ${what} to equal main; got ${actual}px, main ${expected}px.`);
            }
          });
        }

        // AC-5 phase translation and whole-step tops, now the default.
        const baseline = flow("baseline", "matrix").children;
        const bodyLine = flow("body-line", "matrix");
        assert(baseline.length === 9 && bodyLine.children.length === baseline.length, `Expected ${label} one-line matrices of nine elements; got ${baseline.length} and ${bodyLine.children.length}.`);
        assert(Math.abs(bodyLine.children[0].top - bodyLine.top) <= TOLERANCE_PX, `Expected ${label} default matrix to start at the flow top; got ${bodyLine.children[0].top - bodyLine.top}px.`);
        bodyLine.children.forEach((node, index) => {
          const reference = baseline[index];
          const expected = roles[node.role];
          assert(node.role === reference.role && node.probes.length === 1 && reference.probes.length === 1, `Expected ${label} ${node.tag}.${node.role} to be a one-line probe pair.`);
          const residual = offset(node) - offset(reference) - expected.phase * rootSize;
          record.maxPhaseResidual = Math.max(record.maxPhaseResidual, Math.abs(residual));
          assert(Math.abs(residual) <= TOLERANCE_PX, `Expected ${label} ${node.tag} (${node.role}) default first baseline to sit its ${expected.phase}rem phase below the opt-out; default ${offset(node)}px, opt-out ${offset(reference)}px.`);
          if (index > 0) {
            const advance = node.top - bodyLine.children[index - 1].top;
            assert(offStep(advance, stepPx) <= TOLERANCE_PX, `Expected ${label} ${node.tag} (${node.role}) top to sit whole body lines after the previous element top; advance ${advance}px, step ${stepPx}px.`);
          }
          record.epsilon[node.role] ??= offset(reference) - expected.firstBaseline * rootSize;
        });
        const [plainH3, classedH3] = [bodyLine.children[3], bodyLine.children[4]];
        assert(plainH3.tag === "h3" && classedH3.tag === "p" && classedH3.role === "h3"
          && Math.abs(plainH3.height - classedH3.height) <= 0.01 && plainH3.paddingTop === classedH3.paddingTop && plainH3.marginBottom === classedH3.marginBottom,
        `Expected ${label} default h3 and p.bf-h3 to occupy the same box; got ${JSON.stringify([plainH3, classedH3])}.`);

        // AC-5 independent of computeBodyLineRhythm: the step is the rendered body line height and |ε| stays under 1/16 of the root (research R2).
        const renderedStep = bodyLine.children[0].lineHeight;
        const epsilonBound = rootSize / 16;
        assert(bodyLine.children[0].role === "body" && renderedStep > 0, `Expected ${label} default matrix to open with a body paragraph.`);
        const assertOnRenderedStep = (distance: number, what: string) => {
          const off = offStep(distance, renderedStep);
          record.maxWholeStepOffset = Math.max(record.maxWholeStepOffset, off);
          assert(off <= epsilonBound, `Expected ${label} ${what} first baseline within ${epsilonBound}px of a whole ${renderedStep}px body line; off by ${off}px.`);
        };
        bodyLine.children.forEach(node => assertOnRenderedStep(node.probes[0] - bodyLine.top, `default matrix ${node.tag} (${node.role}), from the flow top,`));

        // A default theme nested in an opted-out root resolves the body-line ledger.
        const nested = flow("nested-default", "matrix");
        assert(nested.children.length === bodyLine.children.length, `Expected ${label} nested default matrix to mirror the default matrix.`);
        nested.children.forEach((node, index) => {
          const reference = bodyLine.children[index];
          assert(Math.abs(offset(node) - offset(reference)) <= TOLERANCE_PX, `Expected ${label} nested default ${node.tag} (${node.role}) to keep the body-line first baseline; nested ${offset(node)}px, default ${offset(reference)}px.`);
          const advance = index === 0 ? node.top - nested.top : node.top - nested.children[index - 1].top;
          const referenceAdvance = index === 0 ? reference.top - bodyLine.top : reference.top - bodyLine.children[index - 1].top;
          assert(Math.abs(advance - referenceAdvance) <= TOLERANCE_PX, `Expected ${label} nested default ${node.tag} (${node.role}) to keep the body-line element advance; nested ${advance}px, default ${referenceAdvance}px.`);
        });

        // AC-6 wrapped headings, now the default.
        for (const variant of ["baseline", "body-line"] as const) {
          const wrapped = flow(variant, "wrapped").children;
          assert(wrapped.length === 24, `Expected ${label} ${variant} wrapped fixture to hold twelve headings and their following paragraphs.`);
          for (let index = 0; index < wrapped.length; index += 2) {
            const heading = wrapped[index];
            const following = wrapped[index + 1];
            const { lineHeight } = roles[heading.role];
            assert(heading.probes.length === 2 || heading.probes.length === 3, `Expected ${label} ${variant} ${heading.tag} to render forced lines.`);
            for (let line = 1; line < heading.probes.length; line += 1) {
              const distance = heading.probes[line] - heading.probes[line - 1];
              assert(Math.abs(distance - lineHeight * rootSize) <= TOLERANCE_PX, `Expected ${label} ${variant} ${heading.tag} line ${line + 1} to follow line ${line} by ${lineHeight}rem; got ${distance}px.`);
            }
            if (variant !== "body-line") continue;
            assertOnRenderedStep(heading.probes[0] - heading.top, `default wrapped ${heading.tag} line 1, from its top,`);
            const advance = following.top - heading.top;
            const key = `wrapped ${heading.tag} at ${heading.probes.length} lines, following`;
            if (WRAPPED_QUALIFYING[tier].includes(heading.role)) {
              assert(offStep(advance, stepPx) <= TOLERANCE_PX, `Expected ${label} qualifying ${heading.probes.length}-line ${heading.tag} to keep the following paragraph whole body lines after its top; advance ${advance}px.`);
            } else {
              record.exceptions[key] = { measured: offStep(advance, stepPx), predicted: offStep((heading.probes.length - 1) * lineHeight * rootSize, stepPx) };
            }
            if (heading.role === WRAPPED_EXCEPTION_PROOF[tier] && heading.probes.length === 2) {
              const off = offStep(heading.probes[1] - heading.probes[0], stepPx);
              assert(Math.abs(off - WRAPPED_EXCEPTION_PREDICTION_REM * rootSize) <= TOLERANCE_PX && off >= baselineUnit * rootSize - TOLERANCE_PX, `Expected ${label} two-line ${heading.tag} line 2 to miss the nearest body line by the predicted ${WRAPPED_EXCEPTION_PREDICTION_REM}rem (at least one bU); got ${off}px.`);
              record.exceptions[`wrapped ${heading.tag} line 2 - line 1 off step`] = { measured: off, predicted: WRAPPED_EXCEPTION_PREDICTION_REM * rootSize };
            }
          }
        }

        // Owner ruling R3: container-owned list block. Every line advances one line height; loose items are two steps apart.
        const assertLineDeltas = (variant: string, name: string, expectedPx: number, what: string): number[] => {
          const fixture = flow(variant, name);
          const items = listItems(fixture.children);
          const [list] = fixture.children;
          assert(items.length > 1 && (list?.tag === "ul" || list?.tag === "ol"), `Expected ${label} ${variant} ${name} list fixture.`);
          assert(items.every(item => Math.abs(item.lineHeight - renderedStep) <= 0.01), `Expected ${label} ${variant} ${name} items to use the ${renderedStep}px body line height.`);
          const deltas = items.slice(1).map((item, index) => firstLine(item) - firstLine(items[index]));
          deltas.forEach((delta, index) => assert(Math.abs(delta - expectedPx) <= TOLERANCE_PX, `Expected ${label} ${variant} ${name} ${what} ${index + 1} to ${index + 2} first-baseline delta of ${expectedPx}px; got ${delta}px.`));
          const occupied = list.height + list.marginBottom;
          assert(offStep(occupied, stepPx) <= TOLERANCE_PX && Math.abs(list.top - fixture.top) <= TOLERANCE_PX, `Expected ${label} ${variant} ${name} list block to start at the flow top and occupy whole body lines; got ${occupied}px.`);
          assertOnRenderedStep(firstLine(items[0]) - fixture.top, `${variant} ${name} first item,`);
          return deltas;
        };
        for (const variant of ["body-line", "nested-default"]) {
          assertLineDeltas(variant, "tight", renderedStep, "tight item");
          const nestedDeltas = assertLineDeltas(variant, "nested-list", renderedStep, "nested line");
          assertLineDeltas(variant, "loose", 2 * renderedStep, "loose item");
          if (variant === "body-line") {
            assertLineDeltas(variant, "ordered", renderedStep, "ordered item");
            [record.measured["outer 1 to nested 1"], record.measured["nested 1 to third 1"], record.measured["third 1 to third 2"], record.measured["third 2 to nested 2"], record.measured["nested 2 to outer 2"]] = nestedDeltas;
          }
        }
        const tightItems = listItems(flow("body-line", "tight").children);
        const looseItems = listItems(flow("body-line", "loose").children);
        record.measured["tight item delta"] = firstLine(tightItems[1]) - firstLine(tightItems[0]);
        record.measured["loose item delta"] = firstLine(looseItems[1]) - firstLine(looseItems[0]);

        // Owner ruling R3: the dot keeps main's relation to the first baseline at every level, and loose items share the tight position.
        const dotRelation = (items: TreeNode[]) => items.map(item => {
          assert(item.dot !== null, `Expected ${label} prose list items to paint their dot.`);
          return item.dot - firstLine(item);
        });
        const mainDots = dotRelation(listItems(mainFlow("body-line", "nested-list").children));
        for (const [variant, name] of [["body-line", "nested-list"], ["body-line", "tight"], ["body-line", "loose"], ["nested-default", "nested-list"], ["nested-default", "loose"]]) {
          const dots = dotRelation(listItems(flow(variant, name).children));
          dots.forEach((relation, index) => assert(Math.abs(relation - mainDots[0]) <= TOLERANCE_PX && Math.abs(relation - (mainDots[index] ?? mainDots[0])) <= TOLERANCE_PX, `Expected ${label} ${variant} ${name} item ${index + 1} dot to keep main's ${mainDots[0]}px offset from its first baseline; got ${relation}px.`));
        }
        record.measured["dot minus first baseline (main)"] = mainDots[0];
        record.measured["dot minus first baseline (default)"] = dotRelation(tightItems)[0];
        looseItems.forEach((item, index) => {
          assert(Math.abs((firstLine(item) - item.top) - (firstLine(tightItems[index]) - tightItems[index].top)) <= TOLERANCE_PX, `Expected ${label} loose item ${index + 1} text to sit where a tight item's does.`);
        });

        // Owner ruling R4: hgroup children keep their terms; each later child is pulled one step, so the group stays in phase.
        const hgroupFlow = flow("body-line", "hgroup");
        assert(hgroupFlow.children.length === 4 && hgroupFlow.children.every((node, index) => node.tag === (index % 2 ? "p" : "hgroup")), `Expected ${label} hgroup fixture of two groups each followed by a paragraph.`);
        for (const [groupIndex, key] of [[0, "h1 + h2"], [2, "h1 + p"]] as const) {
          const group = hgroupFlow.children[groupIndex];
          const [first, second] = group.children;
          const following = hgroupFlow.children[groupIndex + 1];
          const firstTerms = roles[first.role];
          const secondTerms = roles[second.role];
          assert(Math.abs(first.paddingTop - (firstTerms.nudge + firstTerms.phase) * rootSize) <= TOLERANCE_PX && Math.abs(second.paddingTop - (secondTerms.nudge + secondTerms.phase) * rootSize) <= TOLERANCE_PX, `Expected ${label} hgroup ${key} children to keep their own nudge and phase.`);
          const expectedSecondTop = first.top + first.height + first.marginBottom - stepPx;
          assert(Math.abs(second.top - expectedSecondTop) <= TOLERANCE_PX, `Expected ${label} hgroup ${key} second child pulled up one ${stepPx}px step; top ${second.top - first.top}px after the first, expected ${expectedSecondTop - first.top}px.`);
          const distance = second.probes[0] - first.probes[0];
          record.measured[`hgroup ${key} baseline distance`] = distance;
          if (key === "h1 + h2") {
            assert(Math.abs(distance - HGROUP_H1_H2_REM[tier] * rootSize) <= TOLERANCE_PX, `Expected ${label} hgroup h1 + h2 baseline distance ${HGROUP_H1_H2_REM[tier]}rem; got ${distance}px.`);
          }
          assert(offStep(group.height, stepPx) <= TOLERANCE_PX && offStep(following.top - hgroupFlow.top, stepPx) <= TOLERANCE_PX, `Expected ${label} hgroup ${key} to occupy whole body lines and keep the following paragraph in phase; group ${group.height}px, following at ${following.top - hgroupFlow.top}px.`);
          assertOnRenderedStep(following.probes[0] - hgroupFlow.top, `paragraph after hgroup ${key},`);
        }

        // AC-7 metric-flush pair keeps its internal baseline distance.
        const flushDistance = (variant: string) => {
          const [pair] = flow(variant, "flush").children;
          const [heading, paragraph] = pair.children;
          assert(heading?.tag === "h2" && paragraph?.tag === "p", `Expected ${label} ${variant} metric-flush pair.`);
          return paragraph.probes[0] - heading.probes[0];
        };
        assert(Math.abs(flushDistance("body-line") - flushDistance("baseline")) <= TOLERANCE_PX, `Expected ${label} metric-flush pair to keep its baseline distance; default ${flushDistance("body-line")}px, opt-out ${flushDistance("baseline")}px.`);

        // Recorded exceptions (contract "Recorded exceptions"), measured, not asserted.
        const body = roles.body;
        const h2 = roles.h2;
        const flushFlow = flow("body-line", "flush");
        record.exceptions["metric-flush h2 + p, following"] = {
          measured: offStep(flushFlow.children[1].top - flushFlow.top, stepPx),
          predicted: offStep((h2.nudge + h2.phase + h2.lineHeight - body.nudge - body.phase) * rootSize, stepPx)
        };
        const ruleFlow = flow("body-line", "rule");
        record.exceptions["hr, following"] = { measured: offStep(ruleFlow.children[2].top - ruleFlow.top, stepPx), predicted: offStep(0.5 * rootSize, stepPx) };
        const quoteFlow = flow("body-line", "quote");
        record.exceptions["blockquote, following"] = {
          measured: offStep(quoteFlow.children[2].top - quoteFlow.top, stepPx),
          predicted: offStep((body.lineHeight + baselineUnit) * rootSize, stepPx)
        };

        records.push(record);
      }
    }

    await page.evaluate(() => { document.documentElement.style.fontSize = ""; });
    assert(runtimeErrors.length === 0 && mainErrors.length === 0, `Expected the body-line rhythm demo console to remain clean; received ${[...runtimeErrors, ...mainErrors].join(" | ")}.`);
    await page.close();
    await mainPage.close();

    // The demo switches tiers by class on one bundle; spot-check the direct non-editorial bundles, default and opted out.
    for (const tier of ["documentation", "app", "os"] as const) {
      const direct = await browser.newPage({ deviceScaleFactor: 1, viewport: { width: 1024, height: 600 } });
      const url = `${origin}/__body-line-direct-${tier}.html`;
      await direct.route(url, route => route.fulfill({
        contentType: "text/html",
        body: `<!doctype html><html><head><link rel="stylesheet" href="/dist/tiers/${tier}/styles.css"></head><body class="bf-theme"><div class="bf-prose" style="gap:0"><h1>Heading</h1><p>Body</p></div><div class="bf-theme is-baseline-rhythm"><div class="bf-prose" style="gap:0"><h1>Heading</h1><p>Body</p></div></div></body></html>`
      }));
      await direct.goto(url, { waitUntil: "load" });
      const [h1, p, optOutH1] = await direct.evaluate(() => Array.from(document.querySelectorAll<HTMLElement>(".bf-prose > *")).map(element => {
        const styles = getComputedStyle(element);
        return { top: element.getBoundingClientRect().top, paddingTop: Number.parseFloat(styles.paddingTop), marginBottom: Number.parseFloat(styles.marginBottom), lineHeight: Number.parseFloat(styles.lineHeight) };
      }));
      const expected = expectations[tier].roles.h1;
      const advance = p.top - h1.top;
      assert(Math.abs(h1.paddingTop - (expected.nudge + expected.phase) * 16) <= TOLERANCE_PX && Math.abs(h1.marginBottom - expected.closure * 16) <= TOLERANCE_PX,
        `Expected dist/tiers/${tier}/styles.css h1 to take nudge + phase ${(expected.nudge + expected.phase) * 16}px and closure ${expected.closure * 16}px by default; got ${h1.paddingTop}px and ${h1.marginBottom}px.`);
      assert(advance > 0 && offStep(advance, p.lineHeight) <= TOLERANCE_PX, `Expected dist/tiers/${tier}/styles.css h1 to p advance of whole ${p.lineHeight}px body lines; got ${advance}px.`);
      assert(Math.abs(optOutH1.paddingTop - expected.nudge * 16) <= TOLERANCE_PX && Math.abs(optOutH1.marginBottom - (expectations[tier].baselineUnit - expected.nudge) * 16) <= TOLERANCE_PX,
        `Expected dist/tiers/${tier}/styles.css .is-baseline-rhythm h1 to keep the nudge and bU compensation; got ${optOutH1.paddingTop}px and ${optOutH1.marginBottom}px.`);
      await direct.close();
    }
  } finally {
    await browser.close();
  }

  return records;
}

export function formatBodyLineRhythmRecords(records: BodyLineRhythmRecord[]): string {
  const px = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(3)}`;
  const byTier = (tier: Tier) => ROOT_SIZES.map(size => records.find(record => record.tier === tier && record.rootSize === size));
  const lines = ["Body-line rhythm epsilon (rendered first baseline - F*, px; recorded, not asserted):", "| Tier | Role | epsilon @16px | epsilon @32px |", "|---|---|---:|---:|"];
  for (const tier of TIERS) {
    const [at16, at32] = byTier(tier);
    for (const role of BODY_LINE_RHYTHM_ROLES) {
      lines.push(`| ${tier} | ${role} | ${px(at16?.epsilon[role] ?? Number.NaN)} | ${px(at32?.epsilon[role] ?? Number.NaN)} |`);
    }
  }
  lines.push("", "Body-line rhythm list and hgroup measurements (px):", "| Tier | Measurement | @16px | @32px |", "|---|---|---:|---:|");
  for (const tier of TIERS) {
    const [at16, at32] = byTier(tier);
    for (const key of Object.keys(at16?.measured ?? {})) {
      lines.push(`| ${tier} | ${key} | ${at16?.measured[key]?.toFixed(2) ?? "–"} | ${at32?.measured[key]?.toFixed(2) ?? "–"} |`);
    }
  }
  lines.push("", "Body-line rhythm recorded exceptions (distance to the nearest body line, px, measured / predicted):", "| Tier | Case | @16px | @32px |", "|---|---|---:|---:|");
  for (const tier of TIERS) {
    const [at16, at32] = byTier(tier);
    for (const key of Object.keys(at16?.exceptions ?? {})) {
      const cell = (record: BodyLineRhythmRecord | undefined) => {
        const entry = record?.exceptions[key];
        return entry ? `${entry.measured.toFixed(2)} / ${entry.predicted === null ? "–" : entry.predicted.toFixed(2)}` : "–";
      };
      lines.push(`| ${tier} | ${key} | ${cell(at16)} | ${cell(at32)} |`);
    }
  }
  lines.push("", `Max |default - opt-out - phase| across tiers, roles and roots: ${Math.max(...records.map(record => record.maxPhaseResidual)).toFixed(4)}px.`);
  lines.push(`Max |opt-out - main| across every fixture box, line, dot, tier and root: ${Math.max(...records.map(record => record.maxMainResidual)).toFixed(4)}px.`);
  for (const size of ROOT_SIZES) {
    const maxOffset = Math.max(...records.filter(record => record.rootSize === size).map(record => record.maxWholeStepOffset));
    lines.push(`Max first-baseline distance from a whole rendered body line @${size}px: ${maxOffset.toFixed(3)}px (bound ${size / 16}px).`);
  }
  return lines.join("\n");
}
