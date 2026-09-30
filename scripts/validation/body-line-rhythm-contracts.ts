import fs from "node:fs/promises";
import path from "node:path";
import { BaselineNudgeGenerator, readFontMetrics, type FontMetrics } from "@lyubomir-popov/baseline-nudge-generator";
import type { Rule } from "postcss";
import { BODY_LINE_RHYTHM_ROLES, computeBodyLineRhythm, hgroupJoinClearances, type BodyLineRhythmRoleInput } from "../../src/body-line-rhythm.ts";
import { BODY_LINE_FLOW_CLASS, BODY_LINE_RHYTHM_SECTION_END, BODY_LINE_RHYTHM_SECTION_START, bodyLineComponentRootClasses, bodyLineTextBlock, generateFoundryCss } from "../../src/css.ts";
import { resolveTierPath, tierNames, type BuiltInThemeName, type TierName } from "../../src/presets.ts";
import type { BodyLineRhythm, ThemeFontFile, ThemeSurface, ThemeTokens } from "../../src/types.ts";
import { parseCss } from "../css-ast-helpers.ts";
import { assert } from "../validation-assert.ts";

type RhythmRecord = BodyLineRhythm;

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
const ROOT = ":where(.bf-theme)";
const BASELINE_ROOT = ".bf-theme.is-baseline-rhythm";
const NOT_CAP_ENGINE = ":not(:where(.bf-engine-cap, .bf-engine-cap *))";
const PROSE_LIST_ITEM = ".bf-prose li";

// Container-owned prose list block [start = body nudge + phase, closure], rem, per research R8.
const EXPECTED_LIST: Record<TierName, [number, number]> = {
  editorial: [0.41, 1.09],
  documentation: [0.3275, 0.9225],
  app: [0.3275, 0.9225],
  os: [0.245, 0.755]
};

// Owner ruling R4 prediction: h1 to h2 baseline distance in a prose hgroup (h1 occupied minus one step), rem.
const EXPECTED_HGROUP_H1_H2: Record<TierName, number> = { editorial: 3, documentation: 2.5, app: 2.5, os: 2 };

// Pairs whose one-step pull would put the following cap height inside the previous descender (research R9); not joined.
const EXPECTED_HGROUP_UNJOINED: Record<TierName, string[]> = {
  editorial: [],
  documentation: ["h1-h5", "h1-h6", "h2-h5", "h2-h6"],
  app: [],
  os: ["h1-h3", "h1-h4", "h2-h3", "h2-h4"]
};
const pairKey = (pair: { previous: string; following: string; }) => `${pair.previous}-${pair.following}`;

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

    // Owner ruling R3: one block start and one closure close any item count only because body lh is the step.
    const [expectedBlockStart, expectedListClosure] = EXPECTED_LIST[tierName];
    const list = result.list;
    assert(list, `Expected a ${tierName} list block record.`);
    const step = parseRem(result.roles.body.rhythmStep);
    const blockStart = parseRem(list.blockStart);
    const listClosure = parseRem(list.closureEnd);
    assert(parseRem(roles.body.lineHeight) === step, `Expected ${tierName} body line height ${roles.body.lineHeight} to equal the ${step}rem rhythm step.`);
    assert(Math.abs(blockStart - (parseRem(roles.body.nudgeTop) + parseRem(result.roles.body.phaseStart))) <= TOLERANCE && Math.abs(blockStart - expectedBlockStart) <= TOLERANCE, `Expected ${tierName} list block start ${expectedBlockStart}rem (body nudge + phase), got ${list.blockStart}.`);
    assert(Math.abs(listClosure - expectedListClosure) <= TOLERANCE && listClosure >= 0 && listClosure < step, `Expected ${tierName} list closure ${expectedListClosure}rem in [0, step), got ${list.closureEnd}.`);
    for (let items = 1; items <= 12; items += 1) {
      assert(offStep(blockStart + items * step + listClosure, step) <= TOLERANCE, `Expected a ${tierName} list of ${items} one-line items to occupy whole body lines.`);
    }

    // Owner ruling R4: the one-step hgroup pull never brings the following first baseline closer than cap height plus descender.
    const clearances = hgroupJoinClearances(metricsByFamily, roles, result.roles);
    assert(clearances.length === 49, `Expected 49 ${tierName} hgroup join pairs, got ${clearances.length}.`);
    const failing = clearances.filter(clearance => clearance.distance < clearance.required).map(pairKey);
    assert(JSON.stringify(failing) === JSON.stringify(EXPECTED_HGROUP_UNJOINED[tierName]), `Expected ${tierName} hgroup pairs that cannot take the pull to be ${EXPECTED_HGROUP_UNJOINED[tierName].join(", ") || "none"}, got ${failing.join(", ") || "none"}.`);
    assert(JSON.stringify(result.hgroupUnjoined?.map(pairKey)) === JSON.stringify(failing), `Expected the ${tierName} rhythm record to leave exactly the failing hgroup pairs unjoined.`);
    for (const clearance of clearances.filter(candidate => !failing.includes(pairKey(candidate)))) {
      assert(clearance.distance >= clearance.required, `Expected ${tierName} hgroup ${clearance.previous} + ${clearance.following} joined baseline distance ${clearance.distance}rem to be at least cap height plus descender ${clearance.required}rem.`);
    }
    const h1h2 = clearances.find(clearance => clearance.previous === "h1" && clearance.following === "h2");
    assert(h1h2 && Math.abs(h1h2.distance - EXPECTED_HGROUP_H1_H2[tierName]) <= TOLERANCE, `Expected ${tierName} hgroup h1 + h2 baseline distance ${EXPECTED_HGROUP_H1_H2[tierName]}rem, got ${h1h2?.distance}rem.`);
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

function ancestors(elements: MarkupElement[], index: number): MarkupElement[] {
  const chain: MarkupElement[] = [];
  for (let parent = elements[index].parent; parent >= 0; parent = elements[parent].parent) {
    chain.push(elements[parent]);
  }
  return chain;
}

function isFlowText(element: MarkupElement): boolean {
  return /^(?:p|h[1-6]|ul|ol|li|hgroup)$/.test(element.tag) || element.classes.some(className => /^bf-(?:body|h[1-6])$/.test(className));
}

/** Spec 026 R7: the component roots that redeclare the baseline-unit ledger, read from the bundle's .is-baseline-rhythm block. */
export function baselineLedgerRootClasses(css: string): string[] {
  const start = css.indexOf(BODY_LINE_RHYTHM_SECTION_START);
  const section = css.slice(start, css.indexOf(BODY_LINE_RHYTHM_SECTION_END));
  const selector = section.match(/:where\(\.bf-theme\.is-baseline-rhythm((?:, \.bf-[a-z0-9-]+)*)\) \{/);
  assert(start >= 0 && selector, "Expected the body-line rhythm section to open its bU ledger block with .bf-theme.is-baseline-rhythm and the component roots.");
  return selector[1].split(", ").filter(Boolean).map(className => className.slice(1));
}

/**
 * Spec 026 R7 markup coverage: every bf-* class in component, pattern and README markup is a flow class or a
 * reset component root, so all text inside a component keeps the bU ledger by inheritance.
 */
export async function validateBodyLineRhythmMarkupScope(readmeMd: string, css: string): Promise<void> {
  const resetClasses = new Set(baselineLedgerRootClasses(css));
  const sources: Array<[string, string]> = [["README.md", readmeHtmlExamples(readmeMd)]];
  for (const dir of ["demo/components", "demo/patterns"]) {
    for (const fileName of (await fs.readdir(dir)).filter(name => name.endsWith(".html"))) {
      sources.push([`${dir}/${fileName}`, await fs.readFile(path.join(dir, fileName), "utf8")]);
    }
  }

  const uncovered = new Map<string, string>();
  let componentText = 0;
  let flowText = 0;
  let unstyledHooks = 0;
  for (const [file, html] of sources) {
    const elements = parseMarkup(html);
    elements.forEach((element, index) => {
      const chain = [element, ...ancestors(elements, index)];
      // An unstyled hook class (for example .bf-notification-title) is not a root; its nearest styled root must be reset.
      const covered = chain.some(candidate => candidate.classes.some(name => resetClasses.has(name)));
      for (const className of element.classes.filter(name => name.startsWith("bf-") && !BODY_LINE_FLOW_CLASS.test(name) && !resetClasses.has(name))) {
        unstyledHooks += 1;
        if (!covered) uncovered.set(className, `${file}:${element.line}`);
      }
      if (!isFlowText(element) || chain.some(candidate => candidate.classes.includes("bf-engine-cap"))) return;
      const inComponent = chain.some(candidate => candidate.classes.some(name => name.startsWith("bf-") && !BODY_LINE_FLOW_CLASS.test(name)));
      if (inComponent) {
        componentText += 1;
        if (!covered) uncovered.set(`<${element.tag}>`, `${file}:${element.line}`);
      } else {
        flowText += 1;
      }
    });
  }

  assert(uncovered.size === 0, `Expected every bf-* class and component text element in component, pattern and README markup to be a flow class or sit in a reset component root; uncovered: ${[...uncovered].map(([name, at]) => `${name} (${at})`).join(", ")}.`);
  assert(sources.length > 80 && componentText > 400 && flowText > 0 && unstyledHooks > 0, `Expected the markup scan to cover the component, pattern and README sources, got ${sources.length} sources, ${componentText} component text, ${flowText} flow text and ${unstyledHooks} unstyled hook classes.`);
}

function manifestSurfaces(bundle: BodyLineRhythmBundle): Array<[string, ManifestSurface]> {
  return Object.entries((bundle.surfaces.surfaces ?? {}) as Record<string, ManifestSurface>);
}

function defaultManifestSurface(label: string, bundle: BodyLineRhythmBundle): ManifestSurface {
  const surface = manifestSurfaces(bundle).find(([name]) => name === bundle.surfaces.defaultSurface)?.[1];
  assert(surface, `Expected ${label} surfaces.json to include its default surface.`);
  return surface;
}

function asThemeSurface(name: string, surface: ManifestSurface, bodyLineRhythm?: RhythmRecord): ThemeSurface {
  return {
    name,
    className: surface.className,
    engine: "metrics-compensated",
    configPath: "",
    baselineConfigPath: "",
    baselineTokensPath: "",
    tokens: surface.tokens,
    metrics: { baselineUnit: surface.tokens.baselineUnit, fontFiles: surface.metrics.fontFiles, elements: {} },
    bodyLineRhythm
  };
}

async function surfaceRhythm(label: string, bundleDir: string, surface: ManifestSurface): Promise<RhythmRecord> {
  const metricsByFamily = await metricsForFonts(surface.metrics.fontFiles, bundleDir);
  const result = computeBodyLineRhythm(metricsByFamily, parseRem(surface.tokens.baselineUnit), surface.tokens.roles);
  assert(result.failures.length === 0 && result.list && result.hgroupUnjoined, `Expected ${label} surfaces to pass the body-line rhythm checks, got: ${result.failures.join(" ")}`);
  return { roles: result.roles, list: result.list, hgroupUnjoined: result.hgroupUnjoined };
}

function stripSection(css: string): string {
  const start = css.indexOf(BODY_LINE_RHYTHM_SECTION_START);
  const end = css.indexOf(BODY_LINE_RHYTHM_SECTION_END) + BODY_LINE_RHYTHM_SECTION_END.length;
  return css.slice(0, start) + css.slice(end);
}

function specificity(selector: string): number {
  let stripped = selector;
  let previous: string;
  do {
    previous = stripped;
    stripped = stripped
      .replace(/:where\((?:[^()]|\([^()]*\))*\)/g, "")
      .replace(/:(?:not|has|is)\(\s*[+>~]?\s*\)/g, "");
  } while (stripped !== previous);

  const ids = (stripped.match(/#[\w-]+/g) ?? []).length;
  const classes = (stripped.match(/\.[\w-]+|\[[^\]]*\]|(?<!:):[\w-]+/g) ?? []).length;
  const types = (stripped.match(/(?:^|[\s>+~])[a-zA-Z][\w-]*|::[\w-]+/g) ?? []).length;
  return ids * 10000 + classes * 100 + types;
}

function declarations(rule: Rule): Map<string, string> {
  const values = new Map<string, string>();
  rule.walkDecls(declaration => {
    values.set(declaration.prop, declaration.value);
  });
  return values;
}

function assertDeclarations(rule: Rule | undefined, expected: Record<string, string>, label: string): void {
  assert(rule, `Expected ${label} rule.`);
  const values = declarations(rule);
  assert(values.size === Object.keys(expected).length, `Expected ${label} to declare only ${Object.keys(expected).join(", ")}, got ${[...values.keys()].join(", ")}.`);
  for (const [property, value] of Object.entries(expected)) {
    assert(values.get(property) === value, `Expected ${label} ${property}: ${value}, got ${values.get(property)}.`);
  }
}

function rhythmDeclarations(rhythm: RhythmRecord, unjoinedKeys: string[]): Record<string, string> {
  const surfaceUnjoined = rhythm.hgroupUnjoined.map(pairKey);
  return Object.fromEntries([
    ...Object.entries(rhythm.roles).flatMap(([roleName, role]) => [
      [`--bf-${roleName}-rhythm-step`, role.rhythmStep],
      [`--bf-${roleName}-phase-start`, role.phaseStart],
      [`--bf-${roleName}-closure-end`, role.closureEnd]
    ]),
    ["--bf-body-list-block-start", rhythm.list.blockStart],
    ["--bf-body-list-block-end", rhythm.list.closureEnd],
    ["--bf-body-list-item-start", "0rem"],
    ["--bf-body-list-item-end", "0rem"],
    ["--bf-body-list-loose-gap", "var(--bf-body-rhythm-step)"],
    ["--bf-body-loose-text-start", "0rem"],
    ["--bf-body-loose-text-end", "0rem"],
    ["--bf-hgroup-join", "calc(-1 * var(--bf-body-rhythm-step))"],
    ["--bf-text-gap-scale", "0"],
    ...unjoinedKeys.map(key => [`--bf-hgroup-join-${key}`, surfaceUnjoined.includes(key) ? "0rem" : "var(--bf-hgroup-join)"])
  ]);
}

/** AC-2/AC-3 for one bundle; returns its root and class-block literals by selector for AC-4 parity. */
export async function validateBodyLineRhythmBundle(
  label: string,
  bundleDir: string,
  bundle: BodyLineRhythmBundle,
  presetName: BuiltInThemeName | undefined
): Promise<Map<string, RhythmRecord>> {
  const { css } = bundle;
  const defaultSurface = defaultManifestSurface(label, bundle);
  const classSurfaces = manifestSurfaces(bundle).filter(([, surface]) => surface.className);

  assert(css.split(BODY_LINE_RHYTHM_SECTION_START).length === 2 && css.split(BODY_LINE_RHYTHM_SECTION_END).length === 2, `Expected ${label} to emit exactly one body-line rhythm section.`);
  const sectionStart = css.indexOf(BODY_LINE_RHYTHM_SECTION_START);
  const sectionEnd = css.indexOf(BODY_LINE_RHYTHM_SECTION_END) + BODY_LINE_RHYTHM_SECTION_END.length;
  const section = css.slice(sectionStart, sectionEnd);
  const plainCss = generateFoundryCss(defaultSurface.tokens, {
    presetName,
    themeSurfaces: classSurfaces.map(([name, surface]) => asThemeSurface(name, surface))
  });
  assert(stripSection(css) === plainCss, `Expected ${label} CSS minus the body-line rhythm section to equal generation without rhythm data byte for byte.`);

  assert(css.lastIndexOf(":where(.bf-theme) :where(.bf-prose li) {", sectionStart) >= 0, `Expected ${label} section to follow the .bf-prose li base rule.`);
  assert(css.lastIndexOf(":where(.bf-theme) :where(.bf-prose blockquote) {", sectionStart) >= 0, `Expected ${label} section to follow the .bf-prose blockquote rule.`);
  assert(css.indexOf(":where(.bf-theme) :where(hr) {") > sectionEnd, `Expected ${label} section to precede the hr rule.`);
  assert(!/\[data-/.test(section) && !section.includes("!important"), `Expected ${label} section to avoid data-* selectors and !important.`);

  const rootRhythm = await surfaceRhythm(label, bundleDir, defaultSurface);
  const roleNames = Object.keys(rootRhythm.roles);
  assert(roleNames.join() === BODY_LINE_RHYTHM_ROLES.join(), `Expected ${label} rhythm terms for body and h1-h6 in role order, got ${roleNames.join(", ")}.`);

  const rules: Rule[] = [];
  parseCss(section).each(node => {
    if (node.type === "rule") rules.push(node);
  });

  const blockSelectors = [ROOT, ...classSurfaces.map(([, surface]) => `:where(.bf-theme.${surface.className})`)];
  const blockRhythms = [rootRhythm];
  for (const [, surface] of classSurfaces) {
    blockRhythms.push(await surfaceRhythm(label, bundleDir, surface));
  }
  const unjoinedKeys = [...new Set(blockRhythms.flatMap(rhythm => rhythm.hgroupUnjoined.map(pairKey)))]
    .sort((a, b) => {
      const [aPrevious, aFollowing] = a.split("-").map(role => roleNames.indexOf(role));
      const [bPrevious, bFollowing] = b.split("-").map(role => roleNames.indexOf(role));
      return aPrevious - bPrevious || aFollowing - bFollowing;
    });
  if (classSurfaces.length >= 4) {
    assert(unjoinedKeys.join() === [...EXPECTED_HGROUP_UNJOINED.documentation, ...EXPECTED_HGROUP_UNJOINED.os].sort().join(), `Expected ${label} to limit the documentation and OS hgroup pairs, got ${unjoinedKeys.join(", ")}.`);
  }
  const expectedRules = 1 + classSurfaces.length + 1 + roleNames.length + 2 + 1 + unjoinedKeys.length + 5;
  assert(rules.length === expectedRules, `Expected ${label} section to hold ${expectedRules} rules, got ${rules.length}.`);

  const literals = new Map<string, RhythmRecord>();
  blockSelectors.forEach((selector, index) => {
    assert(rules[index]?.selector === selector, `Expected ${label} rhythm block ${index + 1} to be ${selector}, got ${rules[index]?.selector}.`);
    assertDeclarations(rules[index], rhythmDeclarations(blockRhythms[index], unjoinedKeys), `${label} ${selector}`);
    literals.set(selector, blockRhythms[index]);
  });

  // Owner rulings R1 and R7: the opt-out and every component root share one bU ledger block after every surface block, so the nearest declaration wins.
  const trailingCss = css.slice(sectionEnd);
  const componentRoots = bodyLineComponentRootClasses(trailingCss);
  const sourceRoots = bodyLineComponentRootClasses(plainCss.slice(plainCss.indexOf(":where(.bf-theme) :where(hr) {")));
  assert(JSON.stringify(componentRoots) === JSON.stringify(sourceRoots) && componentRoots.length > 300, `Expected ${label} to derive its component roots from the component, grid and preset CSS after the section; got ${componentRoots.length} from dist and ${sourceRoots.length} from source.`);
  assert(componentRoots.every(className => !BODY_LINE_FLOW_CLASS.test(className)) && !componentRoots.includes("bf-engine-cap"), `Expected ${label} component roots to exclude flow classes and the cap engine.`);
  const baselineRule = rules[blockSelectors.length];
  assert(baselineRule?.selector === `:where(${[BASELINE_ROOT, ...componentRoots.map(className => `.${className}`)].join(", ")})`, `Expected ${label} .is-baseline-rhythm and component-root block after the surface blocks, got ${baselineRule?.selector.slice(0, 120)}.`);
  assert(JSON.stringify(baselineLedgerRootClasses(css)) === JSON.stringify(componentRoots), `Expected ${label} bU ledger block to list exactly the derived component roots.`);
  assertDeclarations(baselineRule, Object.fromEntries([
    ...roleNames.flatMap(roleName => [
      [`--bf-${roleName}-rhythm-step`, "var(--bf-baseline)"],
      [`--bf-${roleName}-phase-start`, "0rem"],
      [`--bf-${roleName}-closure-end`, `var(--bf-${roleName}-margin-bottom)`]
    ]),
    ["--bf-body-list-block-start", "0rem"],
    ["--bf-body-list-block-end", "0rem"],
    ["--bf-body-list-item-start", "var(--bf-body-nudge-start)"],
    ["--bf-body-list-item-end", "var(--bf-body-margin-bottom)"],
    ["--bf-body-list-loose-gap", "0rem"],
    ["--bf-body-loose-text-start", "var(--bf-body-nudge-start)"],
    ["--bf-body-loose-text-end", "var(--bf-body-margin-bottom)"],
    ["--bf-hgroup-join", "0rem"],
    ["--bf-text-gap-scale", "1"],
    ...unjoinedKeys.map(key => [`--bf-hgroup-join-${key}`, "0rem"])
  ]), `${label} .is-baseline-rhythm`);

  const applicationRules = rules.slice(blockSelectors.length + 1);
  roleNames.forEach((roleName, index) => {
    const tag = roleName === "body" ? "p" : roleName;
    const expectedSelectors = [
      `${ROOT} :where(${tag})${NOT_CAP_ENGINE}`,
      `${ROOT} .bf-${roleName}${NOT_CAP_ENGINE}`
    ];
    assert(applicationRules[index]?.selectors.join("\n") === expectedSelectors.join("\n"), `Expected ${label} ${roleName} rule to select every semantic and classed ${roleName} under the theme (R7), got ${applicationRules[index]?.selector}.`);
    assertDeclarations(applicationRules[index], {
      "margin-bottom": `var(--bf-${roleName}-closure-end)`,
      "padding-block-start": `calc(var(--bf-${roleName}-nudge-start) + var(--bf-${roleName}-phase-start))`
    }, `${label} ${roleName} application`);
  });

  // Owner ruling R6 (D4 option (c)): prose has no gap and a stack cancels its gap between two adjacent text blocks; the bU ledger restores both.
  const [proseGapRule, stackJoinRule, joinRule, ...rest] = applicationRules.slice(roleNames.length);
  assert(proseGapRule?.selector === `${ROOT} :where(.bf-prose)${NOT_CAP_ENGINE}`, `Expected ${label} prose gap rule after the role rules, got ${proseGapRule?.selector}.`);
  assertDeclarations(proseGapRule, { gap: "calc(var(--bf-section-space-shallow) * var(--bf-text-gap-scale))" }, `${label} prose gap`);
  const textBlock = bodyLineTextBlock(roleNames);
  assert(textBlock === ":is(p, h1, h2, h3, h4, h5, h6, hgroup, .bf-body, .bf-h1, .bf-h2, .bf-h3, .bf-h4, .bf-h5, .bf-h6, .bf-prose ul, .bf-prose ol)", `Expected ${label} text blocks to be body and h1-h6 (semantic and classed), hgroup and prose lists, got ${textBlock}.`);
  assert(stackJoinRule?.selector === `${ROOT} :where(.bf-stack:not(.bf-prose) > ${textBlock} + ${textBlock}:not(.bf-stack))${NOT_CAP_ENGINE}`, `Expected ${label} stack text-join rule to select only a text block after a text block in a non-prose stack, never a nested stack, got ${stackJoinRule?.selector}.`);
  assertDeclarations(stackJoinRule, { "margin-block-start": "calc(var(--bf-stack-space) * (var(--bf-text-gap-scale) - 1))" }, `${label} stack text join`);
  assert(joinRule?.selector === `${ROOT} :where(hgroup > * + *)${NOT_CAP_ENGINE}`, `Expected ${label} hgroup join rule after the gap rules.`);
  assertDeclarations(joinRule, { "margin-block-start": "var(--bf-hgroup-join)" }, `${label} hgroup join`);
  const pairRules = rest.slice(0, unjoinedKeys.length);
  const [listRule, itemRule, markerRule, looseTextRule, looseGapRule] = rest.slice(unjoinedKeys.length);
  const roleCompound = (roleName: string) => `:is(${roleName === "body" ? "p" : roleName}, .bf-${roleName})`;
  unjoinedKeys.forEach((key, index) => {
    const [previous, following] = key.split("-");
    assert(pairRules[index]?.selector === `${ROOT} :where(hgroup > ${roleCompound(previous)} + ${roleCompound(following)})${NOT_CAP_ENGINE}`, `Expected ${label} limited hgroup ${key} rule after the general join, got ${pairRules[index]?.selector}.`);
    assertDeclarations(pairRules[index], { "margin-block-start": `var(--bf-hgroup-join-${key})` }, `${label} hgroup ${key} join`);
  });
  assert(listRule?.selector === `${ROOT} :where(.bf-prose :is(ul, ol):not(.bf-prose li *))${NOT_CAP_ENGINE}`, `Expected ${label} container-owned block rule for every outermost prose list.`);
  assertDeclarations(listRule, {
    "margin-bottom": "var(--bf-body-list-block-end)",
    "padding-block-start": "var(--bf-body-list-block-start)"
  }, `${label} prose list block`);
  assert(itemRule?.selector === `${ROOT} :where(${PROSE_LIST_ITEM})${NOT_CAP_ENGINE}`, `Expected ${label} prose list item rule after the list block.`);
  assertDeclarations(itemRule, {
    "margin-bottom": "var(--bf-body-list-item-end)",
    "padding-block-start": "var(--bf-body-list-item-start)"
  }, `${label} prose list item`);
  assert(markerRule?.selector === `${ROOT} :where(.bf-prose ul > li)${NOT_CAP_ENGINE}::before`, `Expected ${label} prose marker rule after the item rule.`);
  assertDeclarations(markerRule, {
    "inset-block-start": "calc(var(--bf-tick-box-offset) - var(--bf-body-nudge-start) + var(--bf-body-list-item-start) + ((var(--bf-leading-mark-size) - var(--bf-list-marker-dot-size)) * 0.5))"
  }, `${label} prose marker`);
  assert(looseTextRule?.selectors.join("\n") === [`${ROOT} :where(${PROSE_LIST_ITEM}) > :where(p)${NOT_CAP_ENGINE}`, `${ROOT} :where(${PROSE_LIST_ITEM}) > .bf-body${NOT_CAP_ENGINE}`].join("\n"), `Expected ${label} loose-item text rule, got ${looseTextRule?.selector}.`);
  assertDeclarations(looseTextRule, {
    "margin-bottom": "var(--bf-body-loose-text-end)",
    "padding-block-start": "var(--bf-body-loose-text-start)"
  }, `${label} loose-item text`);
  assert(looseGapRule?.selector === `${ROOT} :where(.bf-prose li:has(> :where(p, .bf-body)) + li:has(> :where(p, .bf-body)))${NOT_CAP_ENGINE}`, `Expected ${label} loose-item gap rule last.`);
  assertDeclarations(looseGapRule, { "margin-block-start": "var(--bf-body-list-loose-gap)" }, `${label} loose-item gap`);
  assert(!section.includes("is-body-line-rhythm") && !section.includes("loose-item-") && !section.includes(":where(.bf-prose, .bf-prose > hgroup)"), `Expected ${label} section to drop the retired opt-in modifier, loose-item properties and prose-only scope.`);

  const metricFlushSelectors: string[] = [];
  parseCss(css).walkRules(rule => {
    metricFlushSelectors.push(...rule.selectors.filter(selector => selector.startsWith(":where(.bf-theme) .bf-stack.is-metric-flush >")));
  });
  assert(metricFlushSelectors.length >= 2, `Expected ${label} to keep its metric-flush text rules.`);
  const weakestFlush = Math.min(...metricFlushSelectors.map(specificity));
  for (const selector of applicationRules.flatMap(rule => rule.selectors)) {
    const subject = selector.replace(/::before$/, "");
    assert(subject.endsWith(NOT_CAP_ENGINE), `Expected ${label} application selector to exclude the cap engine demo: ${selector}.`);
    assert(specificity(subject) <= 100 && specificity(subject) < weakestFlush, `Expected ${label} ${selector} to keep base-rule specificity below the metric-flush rules.`);
  }

  return literals;
}

/** AC-4: each tier resolves its contract literals in its direct bundle and in every class-scoped surface. */
export function validateBodyLineRhythmParity(bundleLiterals: Record<string, Map<string, RhythmRecord>>): void {
  for (const tierName of tierNames) {
    const direct = bundleLiterals[tierName]?.get(ROOT);
    assert(direct, `Expected the direct ${tierName} bundle to declare root rhythm literals.`);
    for (const [roleName, [, step, phase, closure]] of Object.entries(EXPECTED[tierName])) {
      const role = direct.roles[roleName];
      assert(role && parseRem(role.rhythmStep) === step && parseRem(role.phaseStart) === phase && parseRem(role.closureEnd) === closure, `Expected direct ${tierName}/${roleName} literals to equal the contract table.`);
    }
    const [blockStart, listClosure] = EXPECTED_LIST[tierName];
    assert(parseRem(direct.list.blockStart) === blockStart && parseRem(direct.list.closureEnd) === listClosure, `Expected direct ${tierName} list block literals to equal the contract table.`);

    const classSelector = `:where(.bf-theme.bf-tier-${tierName})`;
    const scopedBundles = Object.entries(bundleLiterals).filter(([, literals]) => literals.has(classSelector));
    assert(scopedBundles.length === 7, `Expected ${tierName} class-scoped rhythm blocks in the default, four tier and two preset bundles, found ${scopedBundles.length}.`);
    for (const [bundleName, literals] of scopedBundles) {
      assert(JSON.stringify(literals.get(classSelector)) === JSON.stringify(direct), `Expected ${bundleName} ${classSelector} literals to equal the direct ${tierName} bundle.`);
    }
  }

  assert(JSON.stringify(bundleLiterals.prose?.get(ROOT)) === JSON.stringify(bundleLiterals.editorial?.get(ROOT)), "Expected the prose preset root to resolve the editorial rhythm literals.");
  assert(JSON.stringify(bundleLiterals["app-tier"]?.get(ROOT)) === JSON.stringify(bundleLiterals.app?.get(ROOT)), "Expected the app-tier preset root to resolve the app rhythm literals.");
}

/** Research T4: without complete rhythm data the section is not emitted, so text keeps the baseline-unit ledger and the opt-out is a no-op. */
export function validateBodyLineRhythmNoOp(bundle: BodyLineRhythmBundle, literals: Map<string, RhythmRecord> | undefined): void {
  const rhythm = literals?.get(ROOT);
  assert(rhythm, "Expected default bundle root rhythm literals.");
  const defaultSurface = defaultManifestSurface("default", bundle);
  const classSurfaces = manifestSurfaces(bundle).filter(([, surface]) => surface.className);
  const complete = classSurfaces.map(([name, surface]) => asThemeSurface(name, surface, rhythm));
  const oneMissing = classSurfaces.map(([name, surface], index) => asThemeSurface(name, surface, index === 0 ? undefined : rhythm));

  assert(generateFoundryCss(defaultSurface.tokens, { themeSurfaces: complete, bodyLineRhythm: rhythm }).includes(BODY_LINE_RHYTHM_SECTION_START), "Expected complete rhythm data to emit the section.");
  assert(!generateFoundryCss(defaultSurface.tokens, { themeSurfaces: complete }).includes(BODY_LINE_RHYTHM_SECTION_START), "Expected a root without rhythm data to emit no section.");
  assert(!generateFoundryCss(defaultSurface.tokens, { themeSurfaces: oneMissing, bodyLineRhythm: rhythm }).includes(BODY_LINE_RHYTHM_SECTION_START), "Expected a class surface without rhythm data to suppress the section.");
}
