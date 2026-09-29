import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import postcss, {
  type AnyNode,
  type AtRule,
  type Declaration,
  type Rule,
} from "postcss";
import {
  getT010AliasUseDisposition,
  getT010LengthDisposition,
  type AliasUseDisposition,
  type LengthDisposition,
} from "./t010-length-dispositions.js";
import { t010SemanticFindings } from "./t010-semantic-backlog.js";

type Assignment = { role: string };
type Boundary = { reason: string };
type InventoryRow = {
  id: string;
  source: string;
  styles: string | Array<{ path: string }>;
  t006Disposition: {
    assignments: Assignment[];
    boundaries: Boundary[];
  };
};

type Inventory = {
  source: {
    commit: string;
    ref: string;
    upstreamCommit: string;
    upstreamRef: string;
  };
  react: InventoryRow[];
  nonReact: InventoryRow[];
  boundary: { candidateRoles: string[] };
};

const args = new Map<string, string>();
for (let index = 2; index < process.argv.length; index += 2) {
  const key = process.argv[index];
  const value = process.argv[index + 1];
  if (!key?.startsWith("--") || !value) {
    throw new Error(`Expected --key value arguments; stopped at ${key ?? "EOF"}`);
  }
  args.set(key.slice(2), value);
}

const required = (name: string) => {
  const value = args.get(name);
  if (!value) throw new Error(`Missing --${name}`);
  return resolve(value);
};

const pragmaRepo = required("pragma-repo");
const inventoryPath = required("inventory");
const outputPath = required("output");
const sourceRef = args.get("source-ref") ?? "main";
const upstreamRef = args.get("upstream-ref") ?? "origin/main";

const git = (arguments_: readonly string[]) =>
  execFileSync("git", [...arguments_], {
    cwd: pragmaRepo,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  }).trim();
const sourceCommit = git(["rev-parse", sourceRef]);
const upstreamCommit = git(["rev-parse", upstreamRef]);
if (sourceCommit !== upstreamCommit) {
  throw new Error(
    `Pragma ${sourceRef} (${sourceCommit}) is not synced with ${upstreamRef} (${upstreamCommit}). Fetch and fast-forward local main before rebuilding the completeness report.`,
  );
}

const inventory = JSON.parse(
  readFileSync(inventoryPath, "utf8"),
) as Inventory;
if (
  inventory.source.ref !== sourceRef ||
  inventory.source.upstreamRef !== upstreamRef ||
  inventory.source.commit !== sourceCommit ||
  inventory.source.upstreamCommit !== upstreamCommit
) {
  throw new Error(
    "The component inventory and requested Pragma source do not identify the same synced main commit.",
  );
}

const reactPackagePrefixes = [
  "packages/react/ds-app-anbox/",
  "packages/react/ds-app-landscape/",
  "packages/react/ds-app-launchpad/",
  "packages/react/ds-app-lxd/",
  "packages/react/ds-app-portal/",
  "packages/react/ds-app/",
  "packages/react/ds-global-form/",
  "packages/react/ds-global/",
  "packages/react/tokens/",
] as const;

const productionPackagePrefixes = [
  "packages/styles/main/",
  ...reactPackagePrefixes,
  "packages/svelte/ds-app/",
  "packages/svelte/ds-app-launchpad/",
  "packages/svelte/ds-app-wpe/",
] as const;

const treePaths = git(["ls-tree", "-r", "--name-only", sourceRef]).split(
  /\r?\n/,
);
const trackedChanges = git([
  "status",
  "--porcelain=v1",
  "--untracked-files=no",
  "--",
  ...productionPackagePrefixes,
]);
if (trackedChanges) {
  throw new Error(
    `Pragma has tracked package changes outside ${sourceRef}; refusing to mix them into the report:\n${trackedChanges}`,
  );
}
const blobByPath = new Map<string, string>();
for (const line of git(["ls-tree", "-r", sourceRef]).split(/\r?\n/)) {
  const match = line.match(/^\d+ blob ([0-9a-f]+)\t(.+)$/);
  if (match) blobByPath.set(match[2], match[1]);
}
const blobFor = (path: string) => {
  const blob = blobByPath.get(path);
  if (!blob) throw new Error(`Missing Git blob for ${path} at ${sourceRef}`);
  return blob;
};
const blobBuffers = new Map<string, Buffer>();
const loadBlobBuffers = (paths: readonly string[]) => {
  const blobs = [
    ...new Set(paths.map(blobFor).filter((blob) => !blobBuffers.has(blob))),
  ];
  if (!blobs.length) return;
  const output = execFileSync("git", ["cat-file", "--batch"], {
    cwd: pragmaRepo,
    input: Buffer.from(`${blobs.join("\n")}\n`),
    maxBuffer: 256 * 1024 * 1024,
  });
  let offset = 0;
  for (const requestedBlob of blobs) {
    const headerEnd = output.indexOf(0x0a, offset);
    if (headerEnd < 0) throw new Error(`Missing cat-file header for ${requestedBlob}`);
    const header = output.subarray(offset, headerEnd).toString("utf8");
    const match = header.match(/^([0-9a-f]+) blob (\d+)$/);
    if (!match || match[1] !== requestedBlob) {
      throw new Error(`Unexpected cat-file header for ${requestedBlob}: ${header}`);
    }
    const size = Number(match[2]);
    const bodyStart = headerEnd + 1;
    const bodyEnd = bodyStart + size;
    blobBuffers.set(requestedBlob, output.subarray(bodyStart, bodyEnd));
    offset = bodyEnd + 1;
  }
};
const blobBufferFor = (path: string) => {
  const blob = blobFor(path);
  const cached = blobBuffers.get(blob);
  if (!cached) throw new Error(`Git blob ${blob} for ${path} was not preloaded`);
  return cached;
};
const semanticIds = new Set<string>();
const allowedRoles = new Set(inventory.boundary.candidateRoles);
for (const finding of t010SemanticFindings) {
  if (semanticIds.has(finding.id)) {
    throw new Error(`Duplicate T010 semantic finding ${finding.id}`);
  }
  semanticIds.add(finding.id);
  if (
    finding.disposition.kind === "role" &&
    !allowedRoles.has(finding.disposition.role)
  ) {
    throw new Error(
      `Unknown semantic role ${finding.disposition.role} on ${finding.id}`,
    );
  }
}
const productionCss = treePaths.filter(
  (path) =>
    path.endsWith(".css") &&
    productionPackagePrefixes.some((prefix) => path.startsWith(prefix)),
);
const cssPaths = [...new Set(productionCss)].sort();
loadBlobBuffers(cssPaths);

const rowsByStyle = new Map<string, InventoryRow[]>();
const rowsBySource = new Map<string, InventoryRow[]>();
for (const row of [...inventory.react, ...inventory.nonReact]) {
  const paths =
    typeof row.styles === "string"
      ? [row.styles]
      : row.styles.map(({ path }) => path);
  for (const path of paths) {
    const rows = rowsByStyle.get(path) ?? [];
    rows.push(row);
    rowsByStyle.set(path, rows);
  }
  const sourceRows = rowsBySource.get(row.source) ?? [];
  sourceRows.push(row);
  rowsBySource.set(row.source, sourceRows);
}

const number = "[-+]?(?:\\d*\\.\\d+|\\d+\\.?\\d*)(?:[eE][-+]?\\d+)?";
const lengthUnits =
  "px|rem|em|ch|ex|cap|ic|lh|rlh|dvw|dvh|dvi|dvb|dvmin|dvmax|svw|svh|svi|svb|svmin|svmax|lvw|lvh|lvi|lvb|lvmin|lvmax|vw|vh|vi|vb|vmin|vmax|cm|mm|Q|in|pc|pt";
const cssLength = new RegExp(
  `(?<![\\w.#-])${number}(?:${lengthUnits})(?![\\w-])`,
  "gi",
);
const cssPercentage = new RegExp(`(?<![\\w.#-])${number}%(?![\\w-])`, "gi");
const cssFlexFraction = new RegExp(`(?<![\\w.#-])${number}fr(?![\\w-])`, "gi");
const unitlessZero = /(?<![\w.#-])[-+]?0+(?:\.0+)?(?![\w.%-])/g;
const derivedMultiplier = new RegExp(
  `(?:(?<left>${number})\\s*\\*\\s*var\\(|var\\([^)]*\\)\\s*\\*\\s*(?<right>${number}))`,
  "gi",
);
const acceptsLengthZero = (property: string) =>
  /(?:padding|margin|gap|inset|top|right|bottom|left|width|height|size|radius|border|outline|shadow|font|line-height|letter-spacing|translate|transform|position|clip|basis|columns|rows|grid)/.test(
    property,
  ) ||
  (/^--/.test(property) &&
    /(?:padding|margin|gap|inset|offset|position|size|width|height|radius|border|outline|shadow|line-height|letter-spacing|translate|basis|columns|rows|grid)/.test(
      property,
    ));

const maskColorFunctions = (value: string) => {
  const characters = [...value];
  for (const match of value.matchAll(
    /(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color-mix)\(/gi,
  )) {
    let depth = 1;
    for (let index = match.index + match[0].length; index < value.length; index += 1) {
      const character = value[index];
      if (character === "(") depth += 1;
      if (character === ")") depth -= 1;
      characters[index] = " ";
      if (depth === 0) break;
    }
  }
  return characters.join("");
};

type SyntaxKind =
  | "length"
  | "percentage"
  | "flex-fraction"
  | "unitless-zero"
  | "derived-multiplier";

const tokenMatches = (value: string, property: string) => {
  const masked = maskColorFunctions(maskQuotedAndUrlContent(value));
  const matches: Array<{
    index: number;
    literal: string;
    syntaxKind: SyntaxKind;
  }> = [];
  const add = (expression: RegExp, syntaxKind: SyntaxKind) => {
    expression.lastIndex = 0;
    for (const match of masked.matchAll(expression)) {
      matches.push({
        index: match.index,
        literal: value.slice(match.index, match.index + match[0].length),
        syntaxKind,
      });
    }
  };
  add(cssLength, "length");
  add(cssPercentage, "percentage");
  add(cssFlexFraction, "flex-fraction");
  if (acceptsLengthZero(property)) add(unitlessZero, "unitless-zero");

  derivedMultiplier.lastIndex = 0;
  for (const match of masked.matchAll(derivedMultiplier)) {
    const literal = match.groups?.left ?? match.groups?.right;
    if (!literal || Number(literal) === 0) continue;
    const relative = match[0].indexOf(literal);
    matches.push({
      index: match.index + relative,
      literal,
      syntaxKind: "derived-multiplier",
    });
  }

  return matches
    .filter(
      (candidate, index, all) =>
        !all.some(
          (other, otherIndex) =>
            otherIndex !== index &&
            other.index <= candidate.index &&
            other.index + other.literal.length >=
              candidate.index + candidate.literal.length &&
            other.syntaxKind !== "derived-multiplier",
        ),
    )
    .sort((left, right) => left.index - right.index);
};

const maskQuotedAndUrlContent = (value: string) => {
  const characters = [...value];
  let quote: "\"" | "'" | null = null;
  let escaped = false;
  let urlDepth = 0;
  let comment = false;
  for (let index = 0; index < characters.length; index += 1) {
    const character = characters[index];
    if (comment) {
      characters[index] = " ";
      if (character === "*" && value[index + 1] === "/") {
        characters[index + 1] = " ";
        index += 1;
        comment = false;
      }
      continue;
    }
    if (escaped) {
      characters[index] = " ";
      escaped = false;
      continue;
    }
    if (character === "\\") {
      if (quote || urlDepth) characters[index] = " ";
      escaped = true;
      continue;
    }
    if (quote) {
      characters[index] = " ";
      if (character === quote) quote = null;
      continue;
    }
    if (!urlDepth && character === "/" && value[index + 1] === "*") {
      characters[index] = " ";
      characters[index + 1] = " ";
      index += 1;
      comment = true;
      continue;
    }
    if (character === "\"" || character === "'") {
      quote = character;
      characters[index] = " ";
      continue;
    }
    if (!urlDepth && value.slice(index, index + 4).toLowerCase() === "url(") {
      urlDepth = 1;
      index += 3;
      continue;
    }
    if (urlDepth) {
      characters[index] = " ";
      if (character === "(") urlDepth += 1;
      if (character === ")") urlDepth -= 1;
    }
  }
  return characters.join("");
};

const hash = (value: string | Buffer) =>
  createHash("sha256").update(value).digest("hex");
const slash = (path: string) => path.replaceAll("\\", "/");
const packageFor = (path: string) => path.split("/").slice(0, 3).join("/");

const ancestryFor = (node: Declaration | AtRule) => {
  const ancestry: string[] = [];
  let parent: AnyNode | undefined = node.parent;
  while (parent) {
    if (parent.type === "rule") ancestry.unshift((parent as Rule).selector);
    if (parent.type === "atrule") {
      const atRule = parent as AtRule;
      ancestry.unshift(`@${atRule.name} ${atRule.params}`.trim());
    }
    parent = parent.parent;
  }
  return ancestry;
};

const functionPathAt = (value: string, offset: number) => {
  const stack: string[] = [];
  const prefix = value.slice(0, offset);
  for (const token of prefix.matchAll(/([a-z-][\w-]*)\(|\)/gi)) {
    if (token[0] === ")") stack.pop();
    else stack.push(token[1]);
  }
  return stack;
};

const shorthandSlotAt = (property: string, value: string, offset: number) => {
  const shorthand = ["padding", "margin", "gap"].find(
    (name) => property === name || property.endsWith(`-${name}`),
  );
  if (!shorthand) return null;
  const spans: Array<{ start: number; end: number }> = [];
  let depth = 0;
  let start = -1;
  for (let index = 0; index <= value.length; index += 1) {
    const character = value[index] ?? " ";
    if (character === "(") depth += 1;
    if (character === ")") depth -= 1;
    if (/\s/.test(character) && depth === 0) {
      if (start >= 0) spans.push({ start, end: index });
      start = -1;
    } else if (start < 0) start = index;
  }
  const tokenIndex = spans.findIndex(
    ({ start: tokenStart, end }) => tokenStart <= offset && offset < end,
  );
  if (tokenIndex < 0) return null;
  if (shorthand === "gap") {
    return spans.length === 1
      ? "block-and-inline"
      : tokenIndex === 0
        ? "block"
        : "inline";
  }
  const slots =
    spans.length === 1
      ? ["all"]
      : spans.length === 2
        ? ["block", "inline"]
        : spans.length === 3
          ? ["block-start", "inline", "block-end"]
          : ["block-start", "inline-end", "block-end", "inline-start"];
  return slots[tokenIndex] ?? null;
};
const occurrences: Array<{
  id: string;
  package: string;
  path: string;
  blob: string;
  line: number;
  column: number;
  offset: number;
  node: "at-rule" | "declaration" | "embedded";
  selector: string | null;
  ancestry: string[];
  property: string;
  value: string;
  literal: string;
  syntaxKind: SyntaxKind;
  literalIndex: number;
  functionPath: string[];
  shorthandSlot: string | null;
  members: string[];
  candidateRoles: string[];
  boundaries: string[];
  disposition: LengthDisposition | null;
}> = [];
const files: Array<{
  package: string;
  path: string;
  blob: string;
  sha256: string;
  members: string[];
  occurrenceCount: number;
}> = [];
const aliases: Array<{
  path: string;
  line: number;
  selector: string | null;
  property: string;
  value: string;
  references: string[];
}> = [];
const aliasUses: Array<{
  path: string;
  line: number;
  declarationLine: number;
  selector: string | null;
  property: string;
  value: string;
  reference: string;
  members: string[];
  candidateRoles: string[];
  boundaries: string[];
  disposition: AliasUseDisposition | null;
  chains?: string[][];
}> = [];

for (const path of cssPaths) {
  const sourceBuffer = blobBufferFor(path);
  const source = sourceBuffer.toString("utf8");
  const blob = blobFor(path);
  const root = postcss.parse(source, { from: path });
  const pathRows = rowsByStyle.get(path) ?? [];
  const occurrenceStart = occurrences.length;
  let nodeOrdinal = 0;
  const inspect = (
    node: Declaration | AtRule,
    property: string,
    value: string,
    kind: "at-rule" | "declaration",
  ) => {
    const currentNodeOrdinal = nodeOrdinal;
    nodeOrdinal += 1;
    const rawValue =
      kind === "declaration"
        ? ((node as Declaration).raws.value?.raw ?? value)
        : value;
    let literalIndex = 0;
    for (const match of tokenMatches(rawValue, property)) {
      const { literal, syntaxKind } = match;
      const ancestry = ancestryFor(node);
      const identity = [
        path,
        kind,
        ancestry.join(" > "),
        property,
        currentNodeOrdinal,
        literalIndex,
        syntaxKind,
        literal,
      ].join(":");
      const rows = pathRows;
      const members = rows.map(({ id }) => id).sort();
      const candidateRoles = [
        ...new Set(
          rows.flatMap(({ t006Disposition }) =>
            t006Disposition.assignments.map(({ role }) => role),
          ),
        ),
      ].sort();
      const boundaries = [
        ...new Set(
          rows.flatMap(({ t006Disposition }) =>
            t006Disposition.boundaries.map(({ reason }) => reason),
          ),
        ),
      ].sort();
      const context = {
        path,
        property,
        value: rawValue,
        literal,
        syntaxKind,
        selector:
          kind === "declaration" && node.parent?.type === "rule"
            ? (node.parent as Rule).selector
            : null,
        candidateRoles,
        boundaries,
      };
      const nodeOffset = node.source?.start?.offset ?? 0;
      const valueOffset = source.indexOf(rawValue, nodeOffset);
      if (valueOffset < 0) {
        throw new Error(
          `Cannot locate value for ${path}:${node.source?.start?.line ?? "unknown"} ${property}`,
        );
      }
      const offset = valueOffset + match.index;
      const lineStart = source.lastIndexOf("\n", offset - 1) + 1;
      const line = source.slice(0, offset).split("\n").length;
      occurrences.push({
        id: `length-${hash(identity).slice(0, 16)}`,
        package: packageFor(path),
        path,
        blob,
        line,
        column: offset - lineStart + 1,
        offset,
        node: kind,
        selector: context.selector,
        ancestry,
        property,
        value: rawValue,
        literal,
        syntaxKind,
        literalIndex,
        functionPath: functionPathAt(rawValue, match.index),
        shorthandSlot: shorthandSlotAt(property, rawValue, match.index),
        members,
        candidateRoles,
        boundaries,
        disposition: getT010LengthDisposition(context),
      });
      literalIndex += 1;
    }
  };
  root.walkDecls((declaration) =>
    inspect(declaration, declaration.prop, declaration.value, "declaration"),
  );
  root.walkAtRules((atRule) =>
    inspect(atRule, `@${atRule.name}`, atRule.params, "at-rule"),
  );
  root.walkDecls((declaration) => {
    const rawDeclarationValue =
      declaration.raws.value?.raw ?? declaration.value;
    const referenceMatches = [
      ...rawDeclarationValue.matchAll(/var\((--[\w-]+)/g),
    ];
    const references = [
      ...new Set(referenceMatches.map((match) => match[1])),
    ].sort();
    if (referenceMatches.length) {
      const selector =
        declaration.parent?.type === "rule"
          ? (declaration.parent as Rule).selector
          : null;
      const rows = pathRows;
      const members = rows.map(({ id }) => id).sort();
      const candidateRoles = [
        ...new Set(
          rows.flatMap(({ t006Disposition }) =>
            t006Disposition.assignments.map(({ role }) => role),
          ),
        ),
      ].sort();
      const boundaries = [
        ...new Set(
          rows.flatMap(({ t006Disposition }) =>
            t006Disposition.boundaries.map(({ reason }) => reason),
          ),
        ),
      ].sort();
      const nodeOffset = declaration.source?.start?.offset ?? 0;
      const valueOffset = source.indexOf(rawDeclarationValue, nodeOffset);
      if (valueOffset < 0) {
        throw new Error(
          `Cannot locate alias value for ${path}:${declaration.source?.start?.line ?? "unknown"} ${declaration.prop}`,
        );
      }
      for (const match of referenceMatches) {
        const reference = match[1];
        const offset = valueOffset + match.index;
        aliasUses.push({
          path,
          line: source.slice(0, offset).split("\n").length,
          declarationLine: declaration.source?.start?.line ?? 0,
          selector,
          property: declaration.prop,
          value: declaration.value,
          reference,
          members,
          candidateRoles,
          boundaries,
          disposition: getT010AliasUseDisposition({
            path,
            property: declaration.prop,
            value: declaration.value,
            selector,
            reference,
            candidateRoles,
            boundaries,
          }),
        });
      }
    }
    if (!declaration.prop.startsWith("--")) return;
    aliases.push({
      path,
      line: declaration.source?.start?.line ?? 0,
      selector:
        declaration.parent?.type === "rule"
          ? (declaration.parent as Rule).selector
          : null,
      property: declaration.prop,
      value: declaration.value,
      references,
    });
  });
  files.push({
    package: packageFor(path),
    path,
    blob,
    sha256: hash(sourceBuffer),
    members: pathRows.map(({ id }) => id).sort(),
    occurrenceCount: occurrences.length - occurrenceStart,
  });
}

const aliasDefinitionsByName = new Map<string, typeof aliases>();
for (const definition of aliases) {
  const definitions = aliasDefinitionsByName.get(definition.property) ?? [];
  definitions.push(definition);
  aliasDefinitionsByName.set(definition.property, definitions);
}
const aliasChainsFor = (
  property: string,
  trail: readonly string[] = [],
): string[][] => {
  if (trail.includes(property)) return [[...trail, property, "<cycle>"]];
  if (trail.length >= 32) return [[...trail, property, "<depth-limit>"]];
  const nextTrail = [...trail, property];
  const definitions = aliasDefinitionsByName.get(property) ?? [];
  const references = [
    ...new Set(definitions.flatMap((definition) => definition.references)),
  ].sort();
  if (!references.length) return [nextTrail];
  return references.flatMap((reference) => aliasChainsFor(reference, nextTrail));
};
for (const use of aliasUses) use.chains = aliasChainsFor(use.reference);
for (const use of aliasUses) {
  if (use.disposition?.kind !== "role") continue;
  for (const role of use.disposition.roles) {
    if (!allowedRoles.has(role)) {
      throw new Error(
        `Unknown alias-use semantic role ${role} on ${use.path}:${use.line} ${use.property}`,
      );
    }
  }
}

const colorInputAliasUses = aliasUses.filter(
  ({ path }) =>
    path ===
    "packages/react/ds-global-form/src/lib/subcomponent/ColorInput/styles.css",
);
const requiredColorInputAliasRoles: ReadonlyArray<{
  property: string;
  reference: string;
  selector?: string;
  roles: readonly string[];
}> = [
  {
    property: "margin-block-start",
    reference: "--form-group-gap",
    roles: ["spacing.gap.element.block"],
  },
  {
    property: "gap",
    reference: "--form-field-inline-gap",
    selector: "> .color-popover",
    roles: ["spacing.gap.element.block"],
  },
  {
    property: "gap",
    reference: "--form-group-gap",
    selector: "> .swatch-grid",
    roles: ["spacing.gap.element.block", "spacing.gap.element.inline"],
  },
];
for (const requiredUse of requiredColorInputAliasRoles) {
  const match = colorInputAliasUses.find(
    (use) =>
      use.property === requiredUse.property &&
      use.reference === requiredUse.reference &&
      (!requiredUse.selector || use.selector?.includes(requiredUse.selector)),
  );
  if (!match || match.disposition?.kind !== "role") {
    throw new Error(
      `Missing explicit ColorInput alias-use role for ${requiredUse.property} ${requiredUse.reference} ${requiredUse.selector ?? ""}`.trim(),
    );
  }
  const actualRoles = [...match.disposition.roles].sort();
  const expectedRoles = [...requiredUse.roles].sort();
  if (JSON.stringify(actualRoles) !== JSON.stringify(expectedRoles)) {
    throw new Error(
      `Wrong ColorInput alias-use roles for ${requiredUse.property} ${requiredUse.reference}: ${actualRoles.join(", ")}`,
    );
  }
}

const embeddedSourcePaths = treePaths.filter(
  (path) =>
    /\.(?:ts|tsx|svelte)$/.test(path) &&
    productionPackagePrefixes.some((prefix) => path.startsWith(prefix)),
);
loadBlobBuffers(embeddedSourcePaths);
const maskJavaScriptComments = (source: string) => {
  const characters = [...source];
  let quote: "\"" | "'" | "`" | null = null;
  let escaped = false;
  for (let index = 0; index < characters.length; index += 1) {
    const character = source[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (quote) {
      if (character === "\\") escaped = true;
      else if (character === quote) quote = null;
      continue;
    }
    if (character === "\"" || character === "'" || character === "`") {
      quote = character;
      continue;
    }
    if (character === "/" && source[index + 1] === "/") {
      while (index < characters.length && source[index] !== "\n") {
        characters[index] = " ";
        index += 1;
      }
      continue;
    }
    if (character === "/" && source[index + 1] === "*") {
      characters[index] = " ";
      characters[index + 1] = " ";
      index += 2;
      while (
        index < characters.length &&
        !(source[index] === "*" && source[index + 1] === "/")
      ) {
        if (source[index] !== "\n" && source[index] !== "\r") {
          characters[index] = " ";
        }
        index += 1;
      }
      if (index < characters.length) {
        characters[index] = " ";
        characters[index + 1] = " ";
      }
    }
  }
  return characters.join("");
};
const embeddedFiles: Array<{
  package: string;
  path: string;
  blob: string;
  sha256: string;
  occurrenceCount: number;
}> = [];
for (const path of embeddedSourcePaths) {
  const sourceBuffer = blobBufferFor(path);
  const source = sourceBuffer.toString("utf8");
  cssLength.lastIndex = 0;
  const matches = [...maskJavaScriptComments(source).matchAll(cssLength)];
  if (!matches.length) continue;
  const blob = blobFor(path);
  const rows = rowsBySource.get(path) ?? [];
  const members = rows.map(({ id }) => id).sort();
  const candidateRoles = [
    ...new Set(
      rows.flatMap(({ t006Disposition }) =>
        t006Disposition.assignments.map(({ role }) => role),
      ),
    ),
  ].sort();
  const boundaries = [
    ...new Set(
      rows.flatMap(({ t006Disposition }) =>
        t006Disposition.boundaries.map(({ reason }) => reason),
      ),
    ),
  ].sort();
  for (let literalIndex = 0; literalIndex < matches.length; literalIndex += 1) {
    const match = matches[literalIndex];
    const offset = match.index;
    const lineStart = source.lastIndexOf("\n", offset - 1) + 1;
    const lineEnd = source.indexOf("\n", offset);
    const value = source
      .slice(lineStart, lineEnd < 0 ? source.length : lineEnd)
      .trim();
    const line = source.slice(0, offset).split("\n").length;
    const evidenceOnly =
      /(?:\.stories\.|\.test\.|\.spec\.|\/docs\/|\/\.storybook\/|\/storybook\/|\/fixtures?\/|\/__fixtures__\/)/.test(
        path,
      );
    const disposition: LengthDisposition | null = evidenceOnly
      ? {
          kind: "boundary",
          owner: `${packageFor(path)} story/test owner`,
          reason:
            "The embedded length belongs to excluded story, documentation, test or fixture chrome; it is reported so that exclusion remains visible.",
        }
      : {
          kind: "exception",
          owner: `${packageFor(path)} component owner`,
          reason:
            "Embedded CSS cannot be silently covered by an external stylesheet sweep; the component recut must normalize it to a role or retain an exact source-owned boundary.",
        };
    const identity = [
      path,
      "embedded",
      literalIndex,
      match[0],
      value,
    ].join(":");
    occurrences.push({
      id: `length-${hash(identity).slice(0, 16)}`,
      package: packageFor(path),
      path,
      blob,
      line,
      column: offset - lineStart + 1,
      offset,
      node: "embedded",
      selector: null,
      ancestry: [],
      property: "embedded-source",
      value,
      literal: match[0],
      syntaxKind: "length",
      literalIndex,
      functionPath: [],
      shorthandSlot: null,
      members,
      candidateRoles,
      boundaries,
      disposition,
    });
  }
  embeddedFiles.push({
    package: packageFor(path),
    path,
    blob,
    sha256: hash(sourceBuffer),
    occurrenceCount: matches.length,
  });
}

const packages = [...new Set(cssPaths.map(packageFor))].sort();
const sourceCommittedAt = git(["show", "-s", "--format=%cI", sourceCommit]);
const definedAliasNames = new Set(aliases.map(({ property }) => property));
const referencedAliasNames = new Set(aliasUses.map(({ reference }) => reference));
const undispositionedOccurrences = occurrences.filter(
  ({ disposition }) => disposition === null,
);
const undispositionedAliasUses = aliasUses.filter(
  ({ disposition }) => disposition === null,
);
const aliasDeclarationUseCount = new Set(
  aliasUses.map(
    ({ path, declarationLine, selector, property, value }) =>
      `${path}:${declarationLine}:${selector ?? ""}:${property}:${value}`,
  ),
).size;
const result = {
  schemaVersion: 2,
  generatedAt: sourceCommittedAt,
  source: {
    repository: "canonical/pragma",
    ref: sourceRef,
    commit: sourceCommit,
    upstreamRef,
    upstreamCommit,
    committedAt: sourceCommittedAt,
    componentInventory: slash(relative(dirname(outputPath), inventoryPath)),
    componentInventorySha256: hash(readFileSync(inventoryPath)),
  },
  scope: {
    foundation:
      "all tracked CSS below packages/styles/main/src because it owns the shared channels consumed by migrated component packages",
    react:
      "every tracked CSS file in the nine React package roots represented by the frozen denominator",
    nonReact:
      "every tracked CSS file in the three package roots containing the eleven frozen FR-036/non-React rows; files outside the named rows are reportable boundaries, not added denominator members",
    excluded: [],
    packages,
    cssFileCount: cssPaths.length,
    cssPaths,
    embeddedSource:
      "raw CSS length dimensions in tracked TypeScript, TSX and Svelte sources under the same package roots; story/test values remain explicit boundaries",
    embeddedFilesWithLengths: embeddedFiles.length,
  },
  counts: {
    occurrences: occurrences.length,
    dispositioned: occurrences.length - undispositionedOccurrences.length,
    undispositioned: undispositionedOccurrences.length,
    byDisposition: Object.fromEntries(
      ["role", "boundary", "exception"].map((kind) => [
        kind,
        occurrences.filter(({ disposition }) => disposition?.kind === kind)
          .length,
      ]),
    ),
    bySyntaxKind: Object.fromEntries(
      [
        "length",
        "percentage",
        "flex-fraction",
        "unitless-zero",
        "derived-multiplier",
      ].map((syntaxKind) => [
        syntaxKind,
        occurrences.filter(
          (occurrence) => occurrence.syntaxKind === syntaxKind,
        ).length,
      ]),
    ),
    bySourceKind: Object.fromEntries(
      ["declaration", "at-rule", "embedded"].map((node) => [
        node,
        occurrences.filter((occurrence) => occurrence.node === node).length,
      ]),
    ),
    packagesComplete: packages.length,
    packagesTotal: packages.length,
  },
  files,
  embeddedFiles,
  aliases: {
    definitions: aliases,
    uses: aliasUses,
    definitionCount: aliases.length,
    useCount: aliasDeclarationUseCount,
    referenceCount: aliasUses.length,
    dispositionedUseCount:
      aliasUses.length - undispositionedAliasUses.length,
    undispositionedUseCount: undispositionedAliasUses.length,
    byDisposition: Object.fromEntries(
      ["role", "boundary", "exception"].map((kind) => [
        kind,
        aliasUses.filter(({ disposition }) => disposition?.kind === kind).length,
      ]),
    ),
    unresolvedNames: [...referencedAliasNames]
      .filter((name) => !definedAliasNames.has(name))
      .sort(),
  },
  semanticFindings: {
    counts: Object.fromEntries(
      ["role", "boundary", "exception"].map((kind) => [
        kind,
        t010SemanticFindings.filter(
          ({ disposition }) => disposition.kind === kind,
        ).length,
      ]),
    ),
    undispositioned: 0,
    records: t010SemanticFindings.map((finding) => ({
      ...finding,
      sourceState: blobByPath.has(finding.path)
        ? "present"
        : "not-on-source-ref",
      blob: blobByPath.get(finding.path) ?? null,
    })),
  },
  occurrences,
};

writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result.counts, null, 2));
if (undispositionedOccurrences.length || undispositionedAliasUses.length) {
  throw new Error(
    `Completeness gate failed: ${undispositionedOccurrences.length} hardcoded syntax occurrences and ${undispositionedAliasUses.length} alias uses are undispositioned.`,
  );
}
