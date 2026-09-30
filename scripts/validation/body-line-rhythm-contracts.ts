import fs from "node:fs/promises";
import path from "node:path";
import { BaselineNudgeGenerator, readFontMetrics, type FontMetrics } from "@lyubomir-popov/baseline-nudge-generator";
import type { Rule } from "postcss";
import { BODY_LINE_RHYTHM_ROLES, computeBodyLineRhythm, type BodyLineRhythmRoleInput } from "../../src/body-line-rhythm.ts";
import { BODY_LINE_RHYTHM_SECTION_END, BODY_LINE_RHYTHM_SECTION_START, generateFoundryCss } from "../../src/css.ts";
import { resolveTierPath, tierNames, type BuiltInThemeName, type TierName } from "../../src/presets.ts";
import type { BodyLineRhythmRole, ThemeFontFile, ThemeSurface, ThemeTokens } from "../../src/types.ts";
import { parseCss } from "../css-ast-helpers.ts";
import { assert } from "../validation-assert.ts";

type RhythmRecord = Record<string, BodyLineRhythmRole>;

export interface BodyLineRhythmBundle {
  css: string;
  surfaces: Record<string, unknown>;
}

interface ManifestSurface {
  className?: string;
  tokens: ThemeTokens;
  metrics: { fontFiles: ThemeFontFile[]; };
}

const TOLERANCE = 0.00001;
const ROOT = ":where(.bf-theme.is-body-line-rhythm)";
const NOT_CAP_ENGINE = ":not(:where(.bf-engine-cap, .bf-engine-cap *))";

// [nudge, step, phase, closure] in rem, from contracts/body-line-phase.md "Expected values".
const EXPECTED: Record<TierName, Record<string, [number, number, number, number]>> = {
  editorial: {
    body: [0.41, 1.5, 0, 1.09], h5: [0.41, 1.5, 0, 1.09], h6: [0.41, 1.5, 0, 1.09],
    h3: [0.46917, 1.5, 1, 1.03083], h4: [0.46917, 1.5, 1, 1.03083],
    h1: [0.06881, 1.5, 0.5, 0.93119], h2: [0.06881, 1.5, 0.5, 0.93119]
  },
  documentation: {
    body: [0.0775, 1.25, 0.25, 0.9225],
    h5: [0.11056, 1.25, 0, 0.88944], h6: [0.11056, 1.25, 0, 0.88944],
    h3: [0.21917, 1.25, 0.75, 0.78083], h4: [0.21917, 1.25, 0.75, 0.78083],
    h1: [0.03875, 1.25, 0.5, 0.71125], h2: [0.03875, 1.25, 0.5, 0.71125]
  },
  app: {
    body: [0.0775, 1.25, 0.25, 0.9225], h5: [0.0775, 1.25, 0.25, 0.9225], h6: [0.0775, 1.25, 0.25, 0.9225],
    h3: [0.11056, 1.25, 0, 0.88944], h4: [0.11056, 1.25, 0, 0.88944],
    h1: [0.21917, 1.25, 0.75, 0.78083], h2: [0.21917, 1.25, 0.75, 0.78083]
  },
  os: {
    body: [0.245, 1, 0, 0.755], h5: [0.245, 1, 0, 0.755], h6: [0.245, 1, 0, 0.755],
    h3: [0.16, 1, 0, 0.84], h4: [0.16, 1, 0, 0.84],
    h1: [0.21917, 1, 0.5, 0.78083], h2: [0.21917, 1, 0.5, 0.78083]
  }
};

function parseRem(value: unknown): number {
  return typeof value === "string" ? Number.parseFloat(value.replace("rem", "")) : Number.NaN;
}

function offStep(value: number, step: number): number {
  return Math.abs(value - Math.round(value / step) * step);
}

async function metricsForFonts(fontFiles: ThemeFontFile[], baseDir: string): Promise<Record<string, FontMetrics>> {
  const metricsByFamily: Record<string, FontMetrics> = {};
  for (const fontFile of fontFiles.filter(candidate => !candidate.runtimeOnly)) {
    metricsByFamily[fontFile.family] = await readFontMetrics(path.resolve(baseDir, fontFile.path));
  }
  return metricsByFamily;
}

/** AC-1: the 4 × 7 tier/role records against the contract table and formulas, from each tier config's own font files. */
export async function validateBodyLineRhythmFormulas(tierTokens: Record<string, Record<string, unknown>>): Promise<void> {
  let records = 0;

  for (const tierName of tierNames) {
    const configPath = resolveTierPath(tierName);
    const config = JSON.parse(await fs.readFile(configPath, "utf8")) as { fontFiles: ThemeFontFile[]; };
    const metricsByFamily = await metricsForFonts(config.fontFiles, path.dirname(configPath));
    const tokens = tierTokens[tierName];
    const roles = tokens.roles as Record<string, BodyLineRhythmRoleInput>;
    const baselineUnit = parseRem(tokens.baselineUnit);
    const result = computeBodyLineRhythm(metricsByFamily, baselineUnit, roles);

    assert(result.failures.length === 0, `Expected ${tierName} body-line rhythm checks to pass, got: ${result.failures.join(" ")}`);

    for (const roleName of BODY_LINE_RHYTHM_ROLES) {
      const label = `${tierName}/${roleName}`;
      const expected = EXPECTED[tierName][roleName];
      const record = result.roles[roleName];
      const token = roles[roleName];
      assert(expected && record && token, `Expected a ${label} rhythm record.`);

      const [expectedNudge, expectedStep, expectedPhase, expectedClosure] = expected;
      const nudge = parseRem(token.nudgeTop);
      const lineHeight = parseRem(token.lineHeight);
      const step = parseRem(record.rhythmStep);
      const firstBaseline = parseRem(record.firstBaseline);
      const phase = parseRem(record.phaseStart);
      const closure = parseRem(record.closureEnd);
      const generatorNudge = new BaselineNudgeGenerator(metricsByFamily[token.fontFamily ?? "sans"])
        .calculateNudgeRem(parseRem(token.fontSize), lineHeight / baselineUnit, baselineUnit);

      assert(Math.abs(nudge - expectedNudge) <= TOLERANCE, `Expected ${label} nudge ${expectedNudge}rem, got ${token.nudgeTop}.`);
      assert(Math.abs(generatorNudge - nudge) <= TOLERANCE, `Expected ${label} recomputed generator nudge (line height as a bU count) to equal nudgeTop ${token.nudgeTop}, got ${generatorNudge}rem.`);
      assert(step === expectedStep && step === parseRem(roles.body.lineHeight), `Expected ${label} rhythm step to be the ${expectedStep}rem body line, got ${record.rhythmStep}.`);
      assert(offStep(step / baselineUnit, 1) <= 1e-9, `Expected ${label} rhythm step ${step}rem to be a whole ${baselineUnit}rem bU multiple.`);
      assert(Math.abs(phase - expectedPhase) <= TOLERANCE, `Expected ${label} phase ${expectedPhase}rem, got ${record.phaseStart}.`);
      assert(Math.abs(closure - expectedClosure) <= TOLERANCE, `Expected ${label} closure ${expectedClosure}rem, got ${record.closureEnd}.`);
      assert(phase >= 0 && phase < step && closure >= 0 && closure < step, `Expected ${label} phase and closure in [0, ${step}rem).`);
      assert(offStep(firstBaseline, baselineUnit) <= TOLERANCE, `Expected ${label} F* ${record.firstBaseline} on the bU grid.`);
      assert(offStep(firstBaseline + phase, step) <= TOLERANCE, `Expected ${label} (F* + phase) mod step to be 0.`);
      assert(offStep(nudge + phase + lineHeight + closure, step) <= TOLERANCE, `Expected ${label} (nudge + phase + lh + closure) mod step to be 0.`);
      records += 1;
    }
  }

  assert(records === 28, `Expected 28 tier/role rhythm records, got ${records}.`);
}

export interface MarkupElement {
  tag: string;
  classes: string[];
  parent: number;
  line: number;
}

const VOID_ELEMENTS = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
const NON_COMPONENT_CLASS = /^bf-(?:theme|tier-[a-z]+|surface-[a-z0-9-]+|page|grid|grid-item|grid-scope|span-\d+|stack|cluster|section|prose|strip|measure|fixed-width|inline-size|stage-shell|body|h[1-6]|lead|meta|text-link|engine-cap|engine-metrics)$/;

function blankPreservingLines(text: string): string {
  return text.replace(/[^\n]/g, " ");
}

export function parseMarkup(html: string): MarkupElement[] {
  const source = html
    .replace(/<!--[\s\S]*?-->/g, blankPreservingLines)
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, blankPreservingLines);
  const elements: MarkupElement[] = [];
  const open: number[] = [];

  for (const match of source.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b([^>]*)>/g)) {
    const [, closing, rawTag, attributes] = match;
    const tag = rawTag.toLowerCase();

    if (closing) {
      const index = open.findLastIndex(elementIndex => elements[elementIndex].tag === tag);
      if (index >= 0) open.length = index;
      continue;
    }

    const classes = attributes.match(/\bclass\s*=\s*(["'])([^"']*)\1/)?.[2].split(/\s+/).filter(Boolean) ?? [];
    elements.push({
      tag,
      classes,
      parent: open.at(-1) ?? -1,
      line: source.slice(0, match.index).split("\n").length
    });

    if (!VOID_ELEMENTS.has(tag) && !attributes.trimEnd().endsWith("/")) {
      open.push(elements.length - 1);
    }
  }

  return elements;
}

/** Keeps only lines inside ```html fences, blanking the rest so line numbers survive. */
export function readmeHtmlExamples(readmeMd: string): string {
  let fence: string | undefined;
  return readmeMd
    .split("\n")
    .map(line => {
      if (line.startsWith("```")) {
        fence = fence === undefined ? line.trim() : undefined;
        return "";
      }
      return fence === "```html" ? line : "";
    })
    .join("\n");
}

export function isComponentRoot(element: MarkupElement): boolean {
  return element.classes.some(className => className.startsWith("bf-") && !NON_COMPONENT_CLASS.test(className));
}

function ancestors(elements: MarkupElement[], index: number): MarkupElement[] {
  const chain: MarkupElement[] = [];
  for (let parent = elements[index].parent; parent >= 0; parent = elements[parent].parent) {
    chain.push(elements[parent]);
  }
  return chain;
}

const hasClass = (element: MarkupElement | undefined, className: string): boolean => Boolean(element?.classes.includes(className));

function isBodyText(element: MarkupElement): boolean {
  return element.tag === "p" || hasClass(element, "bf-body");
}

function isHeadingText(element: MarkupElement): boolean {
  return /^h[1-6]$/.test(element.tag) || element.classes.some(className => /^bf-h[1-6]$/.test(className));
}

/** Mirrors the Spec 026 application selectors, including the cap-engine exclusion. */
export function matchesProseFlowScope(elements: MarkupElement[], index: number): boolean {
  const element = elements[index];
  const chain = ancestors(elements, index);
  const parent = chain[0];

  if ([element, ...chain].some(candidate => hasClass(candidate, "bf-engine-cap"))) return false;

  const proseLi = (candidate: MarkupElement | undefined, candidateIndex: number): boolean =>
    candidate?.tag === "li" && ancestors(elements, candidateIndex).some(ancestor => hasClass(ancestor, "bf-prose"));

  if (hasClass(parent, "bf-prose") && (isBodyText(element) || isHeadingText(element))) return true;
  if (proseLi(element, index)) return true;
  return isBodyText(element) && proseLi(parent, element.parent);
}

export function componentRootFor(elements: MarkupElement[], index: number): MarkupElement | undefined {
  return [elements[index], ...ancestors(elements, index)].find(isComponentRoot);
}
