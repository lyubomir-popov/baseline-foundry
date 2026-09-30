import fs from "node:fs/promises";
import path from "node:path";
import { readFontMetrics, type FontMetrics } from "@lyubomir-popov/baseline-nudge-generator";
import { BODY_LINE_RHYTHM_ROLES, computeBodyLineRhythm, type BodyLineRhythmRoleInput } from "../../src/body-line-rhythm.ts";
import { resolveTierPath } from "../../src/presets.ts";
import type { ThemeFontFile } from "../../src/types.ts";
import { waitForFonts } from "../component-demo-shared.ts";
import { assert, openBrowser } from "./browser-helpers.ts";

const TIERS = ["editorial", "documentation", "app", "os"] as const;
type Tier = typeof TIERS[number];
const ROOT_SIZES = [16, 32] as const;
const TOLERANCE_PX = 0.1;

// Contract "Wrapped qualifying" (lh mod step = 0) and the four named two-line proofs (research R3).
const WRAPPED_QUALIFYING: Record<Tier, string[]> = {
  editorial: ["h1", "h2", "h5", "h6"],
  documentation: ["h1", "h2"],
  app: ["h5", "h6"],
  os: ["h3", "h4", "h5", "h6"]
};
const WRAPPED_EXCEPTION_PROOF: Record<Tier, string> = { editorial: "h3", documentation: "h3", app: "h1", os: "h1" };
const WRAPPED_EXCEPTION_PREDICTION_REM = 0.5;

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
  children: TreeNode[];
}

export interface BodyLineRhythmRecord {
  tier: Tier;
  rootSize: number;
  epsilon: Record<string, number>;
  maxPhaseResidual: number;
  exceptions: Record<string, { measured: number; predicted: number | null; }>;
}

function rem(value: unknown): number {
  return typeof value === "string" ? Number.parseFloat(value.replace("rem", "")) : Number.NaN;
}

function offStep(value: number, step: number): number {
  return Math.abs(value - Math.round(value / step) * step);
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

function items(nodes: TreeNode[]): TreeNode[] {
  return nodes.flatMap(node => node.tag === "ul" || node.tag === "ol" ? node.children.filter(child => child.tag === "li") : []);
}

/** Spec 026 AC-5 to AC-7: differential rendered proof of the body-line opt-in on demo/spec/body-line-rhythm.html. */
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
    const runtimeErrors: string[] = [];
    page.on("pageerror", error => runtimeErrors.push(error.message));
    page.on("console", message => {
      if (message.type() === "error") runtimeErrors.push(message.text());
    });
    await page.goto(`${origin}/demo/spec/body-line-rhythm.html`, { waitUntil: "networkidle" });
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

    const tierSelect = page.locator("[data-page-chrome-tier-select]");
    await tierSelect.waitFor({ state: "visible" });

    for (const tier of TIERS) {
      await tierSelect.selectOption(tier);
      await page.waitForFunction(expected => document.body.dataset.bfTier === expected
        && Array.from(document.querySelectorAll("[data-body-line-root]")).every(root => root.classList.contains(`bf-tier-${expected}`)), tier);

      for (const rootSize of ROOT_SIZES) {
        await page.evaluate(size => { document.documentElement.style.fontSize = `${size}px`; }, rootSize);
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
        const flows: Flow[] = rawFlows.map(flow => ({ variant: flow.variant, name: flow.name, top: flow.top, children: toTree(flow.boxes) }));
        const flow = (variant: string, name: string): Flow => {
          const match = flows.find(candidate => candidate.variant === variant && candidate.name === name);
          assert(match, `Expected a ${variant} ${name} body-line fixture.`);
          return match;
        };
        const { baselineUnit, step, roles } = expectations[tier];
        const stepPx = step * rootSize;
        const label = `${tier} at a ${rootSize}px root`;
        const record: BodyLineRhythmRecord = { tier, rootSize, epsilon: {}, maxPhaseResidual: 0, exceptions: {} };
        const offset = (node: TreeNode) => node.probes[0] - node.top;

        // AC-5 phase translation and whole-step tops.
        const current = flow("current", "matrix").children;
        const opted = flow("opted", "matrix");
        assert(current.length === 9 && opted.children.length === current.length, `Expected ${label} one-line matrices of nine elements; got ${current.length} and ${opted.children.length}.`);
        assert(Math.abs(opted.children[0].top - opted.top) <= TOLERANCE_PX, `Expected ${label} opted matrix to start at the flow top; got ${opted.children[0].top - opted.top}px.`);
        opted.children.forEach((node, index) => {
          const reference = current[index];
          const expected = roles[node.role];
          assert(node.role === reference.role && node.probes.length === 1 && reference.probes.length === 1, `Expected ${label} ${node.tag}.${node.role} to be a one-line probe pair.`);
          const residual = offset(node) - offset(reference) - expected.phase * rootSize;
          record.maxPhaseResidual = Math.max(record.maxPhaseResidual, Math.abs(residual));
          assert(Math.abs(residual) <= TOLERANCE_PX, `Expected ${label} ${node.tag} (${node.role}) opt-in first baseline to move by its ${expected.phase}rem phase; opted ${offset(node)}px, current ${offset(reference)}px.`);
          if (index > 0) {
            const advance = node.top - opted.children[index - 1].top;
            assert(offStep(advance, stepPx) <= TOLERANCE_PX, `Expected ${label} ${node.tag} (${node.role}) top to sit whole body lines after the previous element top; advance ${advance}px, step ${stepPx}px.`);
          }
          record.epsilon[node.role] ??= offset(reference) - expected.firstBaseline * rootSize;
        });
        const [plainH3, classedH3] = [opted.children[3], opted.children[4]];
        assert(plainH3.tag === "h3" && classedH3.tag === "p" && classedH3.role === "h3"
          && Math.abs(plainH3.height - classedH3.height) <= 0.01 && plainH3.paddingTop === classedH3.paddingTop && plainH3.marginBottom === classedH3.marginBottom,
        `Expected ${label} opted h3 and p.bf-h3 to occupy the same box; got ${JSON.stringify([plainH3, classedH3])}.`);

        // AC-7 nested non-opted theme resolves the current ledger.
        const nested = flow("nested", "matrix");
        const currentFlow = flow("current", "matrix");
        assert(nested.children.length === current.length, `Expected ${label} nested non-opted matrix to mirror the current matrix.`);
        nested.children.forEach((node, index) => {
          const reference = current[index];
          assert(Math.abs(offset(node) - offset(reference)) <= TOLERANCE_PX, `Expected ${label} nested non-opted ${node.tag} (${node.role}) to keep the current first baseline; nested ${offset(node)}px, current ${offset(reference)}px.`);
          const advance = index === 0 ? node.top - nested.top : node.top - nested.children[index - 1].top;
          const referenceAdvance = index === 0 ? reference.top - currentFlow.top : reference.top - current[index - 1].top;
          assert(Math.abs(advance - referenceAdvance) <= TOLERANCE_PX, `Expected ${label} nested non-opted ${node.tag} (${node.role}) to keep the current element advance; nested ${advance}px, current ${referenceAdvance}px.`);
        });

        // AC-6 wrapped headings.
        for (const variant of ["current", "opted"] as const) {
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
            if (variant !== "opted") continue;
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

        // AC-7 prose dot and loose items.
        const tightCurrent = items(flow("current", "tight").children);
        const tightOpted = items(flow("opted", "tight").children);
        const looseOpted = items(flow("opted", "loose").children);
        assert(tightOpted.length === 3 && tightCurrent.length === 3 && looseOpted.length === 2, `Expected ${label} tight and loose list fixtures.`);
        tightOpted.forEach((item, index) => {
          const reference = tightCurrent[index];
          assert(item.dot !== null && reference.dot !== null, `Expected ${label} prose list items to paint their dot.`);
          const optedDot = item.dot - item.probes[0];
          const currentDot = reference.dot - reference.probes[0];
          assert(Math.abs(optedDot - currentDot) <= TOLERANCE_PX, `Expected ${label} opt-in prose dot to keep its offset from the first baseline; opted ${optedDot}px, current ${currentDot}px.`);
          if (index > 0) assert(offStep(item.top - tightOpted[index - 1].top, stepPx) <= TOLERANCE_PX, `Expected ${label} opted tight items to advance by whole body lines.`);
        });
        looseOpted.forEach((item, index) => {
          const paragraph = item.children.find(child => child.tag === "p");
          assert(paragraph && paragraph.probes.length === 1, `Expected ${label} loose items to hold a probed paragraph.`);
          const looseOffset = paragraph.probes[0] - item.top;
          const tightOffset = offset(tightOpted[index]);
          assert(Math.abs(looseOffset - tightOffset) <= TOLERANCE_PX, `Expected ${label} opted loose item text to sit where a tight item's does; loose ${looseOffset}px, tight ${tightOffset}px.`);
          const tightDot = tightOpted[index].dot;
          assert(item.dot !== null && tightDot !== null && Math.abs((item.dot - item.top) - (tightDot - tightOpted[index].top)) <= TOLERANCE_PX, `Expected ${label} opted loose item dot to sit where a tight item's does; loose ${item.dot === null ? "none" : item.dot - item.top}px, tight ${tightDot === null ? "none" : tightDot - tightOpted[index].top}px.`);
          if (index > 0) assert(offStep(item.top - looseOpted[index - 1].top, stepPx) <= TOLERANCE_PX, `Expected ${label} opted loose items to advance by whole body lines; got ${item.top - looseOpted[index - 1].top}px.`);
        });

        // AC-7 nested non-opted theme keeps the current tight and loose list ledger.
        const listGeometry = (list: TreeNode[]) => list.map((item, index) => {
          const text = item.probes.length ? item : item.children.find(child => child.tag === "p");
          assert(text && text.probes.length === 1 && item.dot !== null, `Expected ${label} list item ${index + 1} to hold one probed line and a dot.`);
          return { text: text.probes[0] - item.top, dot: item.dot - item.top, advance: index > 0 ? item.top - list[index - 1].top : 0 };
        });
        for (const kind of ["tight", "loose"] as const) {
          const nestedItems = listGeometry(items(flow("nested", kind).children));
          const currentItems = listGeometry(items(flow("current", kind).children));
          assert(nestedItems.length === currentItems.length, `Expected ${label} nested non-opted ${kind} list to mirror the current list.`);
          nestedItems.forEach((item, index) => {
            const reference = currentItems[index];
            for (const key of ["text", "dot", "advance"] as const) {
              assert(Math.abs(item[key] - reference[key]) <= TOLERANCE_PX, `Expected ${label} nested non-opted ${kind} item ${index + 1} ${key} to equal the current column; nested ${item[key]}px, current ${reference[key]}px.`);
            }
          });
        }

        // AC-7 metric-flush pair keeps its internal baseline distance.
        const flushDistance = (variant: string) => {
          const [pair] = flow(variant, "flush").children;
          const [heading, paragraph] = pair.children;
          assert(heading?.tag === "h2" && paragraph?.tag === "p", `Expected ${label} ${variant} metric-flush pair.`);
          return paragraph.probes[0] - heading.probes[0];
        };
        assert(Math.abs(flushDistance("opted") - flushDistance("current")) <= TOLERANCE_PX, `Expected ${label} metric-flush pair to keep its baseline distance; opted ${flushDistance("opted")}px, current ${flushDistance("current")}px.`);

        // Recorded exceptions (contract "Recorded exceptions"), measured, not asserted.
        const body = roles.body;
        const h2 = roles.h2;
        const flushFlow = flow("opted", "flush");
        record.exceptions["metric-flush h2 + p, following"] = {
          measured: offStep(flushFlow.children[1].top - flushFlow.top, stepPx),
          predicted: offStep((h2.nudge + h2.phase + h2.lineHeight - body.nudge - body.phase) * rootSize, stepPx)
        };
        const [outer] = items(flow("opted", "nested-list").children);
        const [child] = items(outer.children);
        record.exceptions["nested list child item"] = {
          measured: offStep(child.top - outer.top, stepPx),
          predicted: offStep((body.nudge + body.phase + body.lineHeight) * rootSize, stepPx)
        };
        const ruleFlow = flow("opted", "rule");
        record.exceptions["hr, following"] = { measured: offStep(ruleFlow.children[2].top - ruleFlow.top, stepPx), predicted: offStep(0.5 * rootSize, stepPx) };
        const quoteFlow = flow("opted", "quote");
        record.exceptions["blockquote, following"] = {
          measured: offStep(quoteFlow.children[2].top - quoteFlow.top, stepPx),
          predicted: offStep((body.lineHeight + baselineUnit) * rootSize, stepPx)
        };

        records.push(record);
      }

      await page.evaluate(() => { document.documentElement.style.fontSize = ""; });
    }

    assert(runtimeErrors.length === 0, `Expected the body-line rhythm demo console to remain clean; received ${runtimeErrors.join(" | ")}.`);
    await page.close();
  } finally {
    await browser.close();
  }

  return records;
}

export function formatBodyLineRhythmRecords(records: BodyLineRhythmRecord[]): string {
  const px = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(3)}`;
  const lines = ["Body-line rhythm epsilon (rendered first baseline - F*, px; recorded, not asserted):", "| Tier | Role | epsilon @16px | epsilon @32px |", "|---|---|---:|---:|"];
  for (const tier of TIERS) {
    const [at16, at32] = ROOT_SIZES.map(size => records.find(record => record.tier === tier && record.rootSize === size));
    for (const role of BODY_LINE_RHYTHM_ROLES) {
      lines.push(`| ${tier} | ${role} | ${px(at16?.epsilon[role] ?? Number.NaN)} | ${px(at32?.epsilon[role] ?? Number.NaN)} |`);
    }
  }
  lines.push("", "Body-line rhythm recorded exceptions (distance to the nearest body line, px, measured / predicted):", "| Tier | Case | @16px | @32px |", "|---|---|---:|---:|");
  for (const tier of TIERS) {
    const [at16, at32] = ROOT_SIZES.map(size => records.find(record => record.tier === tier && record.rootSize === size));
    for (const key of Object.keys(at16?.exceptions ?? {})) {
      const cell = (record: BodyLineRhythmRecord | undefined) => {
        const entry = record?.exceptions[key];
        return entry ? `${entry.measured.toFixed(2)} / ${entry.predicted === null ? "–" : entry.predicted.toFixed(2)}` : "–";
      };
      lines.push(`| ${tier} | ${key} | ${cell(at16)} | ${cell(at32)} |`);
    }
  }
  const maxResidual = Math.max(...records.map(record => record.maxPhaseResidual));
  lines.push("", `Max |opted - current - phase| across tiers, roles and roots: ${maxResidual.toFixed(4)}px.`);
  return lines.join("\n");
}
