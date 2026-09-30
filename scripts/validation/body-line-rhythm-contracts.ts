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

/** AC-3 markup scan: no prose-flow application selector reaches text inside a component root. */
export async function validateBodyLineRhythmMarkupScope(readmeMd: string): Promise<void> {
  const sources: Array<[string, string]> = [["README.md", readmeHtmlExamples(readmeMd)]];
  for (const dir of ["demo/components", "demo/patterns"]) {
    for (const fileName of (await fs.readdir(dir)).filter(name => name.endsWith(".html"))) {
      sources.push([`${dir}/${fileName}`, await fs.readFile(path.join(dir, fileName), "utf8")]);
    }
  }

  let matches = 0;
  for (const [file, html] of sources) {
    const elements = parseMarkup(html);
    elements.forEach((element, index) => {
      if (!matchesProseFlowScope(elements, index)) return;
      matches += 1;
      const root = componentRootFor(elements, index);
      assert(!root, `Expected ${file}:${element.line} <${element.tag}> to stay outside the body-line prose-flow scope inside component root .${root?.classes.join(".")}.`);
    });
  }

  assert(sources.length > 80 && matches > 0, `Expected the markup scan to cover the component, pattern and README sources and find prose-flow text, got ${sources.length} sources and ${matches} matches.`);
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
  assert(result.failures.length === 0, `Expected ${label} surfaces to pass the body-line rhythm checks, got: ${result.failures.join(" ")}`);
  return result.roles;
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

function rhythmDeclarations(rhythm: RhythmRecord): Record<string, string> {
  return Object.fromEntries(Object.entries(rhythm).flatMap(([roleName, role]) => [
    [`--bf-${roleName}-rhythm-step`, role.rhythmStep],
    [`--bf-${roleName}-phase-start`, role.phaseStart],
    [`--bf-${roleName}-closure-end`, role.closureEnd]
  ]));
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
  assert(!/data-/.test(section) && !section.includes("!important"), `Expected ${label} section to avoid data-* selectors and !important.`);

  const rootRhythm = await surfaceRhythm(label, bundleDir, defaultSurface);
  const roleNames = Object.keys(rootRhythm);
  assert(roleNames.join() === BODY_LINE_RHYTHM_ROLES.join(), `Expected ${label} rhythm terms for body and h1-h6 in role order, got ${roleNames.join(", ")}.`);

  const rules: Rule[] = [];
  parseCss(section).each(node => {
    if (node.type === "rule") rules.push(node);
  });
  const expectedRules = 1 + classSurfaces.length + 1 + roleNames.length + 3;
  assert(rules.length === expectedRules, `Expected ${label} section to hold ${expectedRules} rules, got ${rules.length}.`);

  const literals = new Map<string, RhythmRecord>([[ROOT, rootRhythm]]);
  const blockSelectors = [ROOT, ...classSurfaces.map(([, surface]) => `:where(.bf-theme.${surface.className}.is-body-line-rhythm)`)];
  const blockRhythms = [rootRhythm];
  for (const [, surface] of classSurfaces) {
    blockRhythms.push(await surfaceRhythm(label, bundleDir, surface));
  }
  blockSelectors.forEach((selector, index) => {
    assert(rules[index]?.selector === selector, `Expected ${label} rhythm block ${index + 1} to be ${selector}, got ${rules[index]?.selector}.`);
    assertDeclarations(rules[index], rhythmDeclarations(blockRhythms[index]), `${label} ${selector}`);
    literals.set(selector, blockRhythms[index]);
  });

  const resetRule = rules[blockSelectors.length];
  assert(resetRule?.selector === `${ROOT} :where(.bf-theme:not(.is-body-line-rhythm))`, `Expected ${label} nested non-opted theme reset after the surface blocks.`);
  assertDeclarations(resetRule, Object.fromEntries(roleNames.flatMap(roleName => [
    [`--bf-${roleName}-rhythm-step`, "var(--bf-baseline)"],
    [`--bf-${roleName}-phase-start`, "0rem"],
    [`--bf-${roleName}-closure-end`, `var(--bf-${roleName}-margin-bottom)`]
  ])), `${label} nested reset`);

  const applicationRules = rules.slice(blockSelectors.length + 1);
  roleNames.forEach((roleName, index) => {
    const tag = roleName === "body" ? "p" : roleName;
    const parents = roleName === "body" ? [":where(.bf-prose)", ":where(.bf-prose li)"] : [":where(.bf-prose)"];
    const expectedSelectors = parents.flatMap(parent => [
      `${ROOT} ${parent} > :where(${tag})${NOT_CAP_ENGINE}`,
      `${ROOT} ${parent} > .bf-${roleName}${NOT_CAP_ENGINE}`
    ]);
    assert(applicationRules[index]?.selectors.join("\n") === expectedSelectors.join("\n"), `Expected ${label} ${roleName} rule to select its semantic and class prose-flow shapes, got ${applicationRules[index]?.selector}.`);
    assertDeclarations(applicationRules[index], {
      "margin-bottom": `var(--bf-${roleName}-closure-end)`,
      "padding-block-start": `calc(var(--bf-${roleName}-nudge-start) + var(--bf-${roleName}-phase-start))`
    }, `${label} ${roleName} application`);
  });

  const [liRule, markerRule, looseRule] = applicationRules.slice(roleNames.length);
  assert(liRule?.selector === `${ROOT} :where(.bf-prose li)${NOT_CAP_ENGINE}`, `Expected ${label} prose li rule after the role rules.`);
  assertDeclarations(liRule, {
    "margin-bottom": "var(--bf-body-closure-end)",
    "padding-block-start": "calc(var(--bf-body-nudge-start) + var(--bf-body-phase-start))"
  }, `${label} prose li`);
  assert(markerRule?.selector === `${ROOT} :where(.bf-prose ul > li)${NOT_CAP_ENGINE}::before`, `Expected ${label} prose marker shift after the li rule.`);
  assertDeclarations(markerRule, {
    "inset-block-start": "calc(var(--bf-tick-box-offset) + var(--bf-body-phase-start) + ((var(--bf-leading-mark-size) - var(--bf-list-marker-dot-size)) * 0.5))"
  }, `${label} prose marker`);
  assert(looseRule?.selector === `${ROOT} :where(.bf-prose li:has(> :where(p, .bf-body)))${NOT_CAP_ENGINE}`, `Expected ${label} loose-item rule to follow the li rule.`);
  assertDeclarations(looseRule, { "margin-bottom": "0rem", "padding-block-start": "0rem" }, `${label} loose item`);

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
      const role = direct[roleName];
      assert(role && parseRem(role.rhythmStep) === step && parseRem(role.phaseStart) === phase && parseRem(role.closureEnd) === closure, `Expected direct ${tierName}/${roleName} literals to equal the contract table.`);
    }

    const classSelector = `:where(.bf-theme.bf-tier-${tierName}.is-body-line-rhythm)`;
    const scopedBundles = Object.entries(bundleLiterals).filter(([, literals]) => literals.has(classSelector));
    assert(scopedBundles.length === 7, `Expected ${tierName} class-scoped rhythm blocks in the default, four tier and two preset bundles, found ${scopedBundles.length}.`);
    for (const [bundleName, literals] of scopedBundles) {
      assert(JSON.stringify(literals.get(classSelector)) === JSON.stringify(direct), `Expected ${bundleName} ${classSelector} literals to equal the direct ${tierName} bundle.`);
    }
  }

  assert(JSON.stringify(bundleLiterals.prose?.get(ROOT)) === JSON.stringify(bundleLiterals.editorial?.get(ROOT)), "Expected the prose preset root to resolve the editorial rhythm literals.");
  assert(JSON.stringify(bundleLiterals["app-tier"]?.get(ROOT)) === JSON.stringify(bundleLiterals.app?.get(ROOT)), "Expected the app-tier preset root to resolve the app rhythm literals.");
}

/** Research T4: without complete rhythm data the section is not emitted and the modifier is a no-op. */
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
