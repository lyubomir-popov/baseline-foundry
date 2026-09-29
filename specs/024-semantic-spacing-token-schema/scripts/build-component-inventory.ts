import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  existsSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  assertT006Coverage,
  getT006Disposition,
  t006CandidateRoles,
} from "./t006-dispositions.js";

type LegacyRow = {
  id: string;
  package: string;
  source: string | null;
  exportStatus: "public" | "compound" | "internal" | "story-only";
  composition: string;
  storySource?: string;
};

type AddedRow = Omit<LegacyRow, "source"> & { source: string };

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

const pragmaSnapshot = required("pragma-snapshot");
const pragmaRepo = required("pragma-repo");
const legacyInventoryPath = required("legacy-inventory");
const legacyManifestPath = required("legacy-source-manifest");
const outputPath = required("output");
const sourceRef = args.get("source-ref") ?? "main";
const upstreamRef = args.get("upstream-ref") ?? "origin/main";
const resolveRef = (ref: string) =>
  execFileSync("git", ["rev-parse", ref], {
    cwd: pragmaRepo,
    encoding: "utf8",
  }).trim();
const sourceCommit = resolveRef(sourceRef);
const upstreamCommit = resolveRef(upstreamRef);
if (sourceCommit !== upstreamCommit) {
  throw new Error(
    `Pragma ${sourceRef} (${sourceCommit}) is not synced with ${upstreamRef} (${upstreamCommit}). Fetch and fast-forward local main before rebuilding the current denominator.`,
  );
}
const sourceCommittedAt = execFileSync(
  "git",
  ["show", "-s", "--format=%cI", sourceCommit],
  { cwd: pragmaRepo, encoding: "utf8" },
).trim();

const legacyModule = (await import(pathToFileURL(legacyInventoryPath).href)) as {
  reactSpacingInventory: readonly LegacyRow[];
};
const legacyRows = legacyModule.reactSpacingInventory;
const legacyManifest = JSON.parse(
  readFileSync(legacyManifestPath, "utf8"),
) as Array<{ path: string; sha256: string }>;
const legacyHashes = new Map(
  legacyManifest.map(({ path, sha256 }) => [path, sha256]),
);

const addedRows: readonly AddedRow[] = [
  {
    id: "ds-global/component/Tooltip/TooltipEngine",
    package: "@canonical/react-ds-global",
    source:
      "packages/react/ds-global/src/lib/component/Tooltip/TooltipEngine.tsx",
    exportStatus: "public",
    composition: "nonvisual-composer",
  },
  {
    id: "ds-global/pattern/Modal/Modal",
    package: "@canonical/react-ds-global",
    source: "packages/react/ds-global/src/lib/pattern/Modal/Provider.tsx",
    exportStatus: "public",
    composition: "layout-shell",
  },
  {
    id: "ds-global/pattern/Modal/common/Header/Header",
    package: "@canonical/react-ds-global",
    source:
      "packages/react/ds-global/src/lib/pattern/Modal/common/Header/Header.tsx",
    exportStatus: "compound",
    composition: "sectioned-card-panel",
  },
  {
    id: "ds-global/pattern/Modal/common/Content/Content",
    package: "@canonical/react-ds-global",
    source:
      "packages/react/ds-global/src/lib/pattern/Modal/common/Content/Content.tsx",
    exportStatus: "compound",
    composition: "sectioned-card-panel",
  },
  {
    id: "ds-global/pattern/Modal/common/Footer/Footer",
    package: "@canonical/react-ds-global",
    source:
      "packages/react/ds-global/src/lib/pattern/Modal/common/Footer/Footer.tsx",
    exportStatus: "compound",
    composition: "sectioned-card-panel",
  },
  {
    id: "ds-global/pattern/Modal/withModal",
    package: "@canonical/react-ds-global",
    source: "packages/react/ds-global/src/lib/pattern/Modal/withModal.tsx",
    exportStatus: "public",
    composition: "nonvisual-composer",
  },
  ...[
    ["ContextSwitcher", "bordered-field-trailing-artwork"],
    ["Group", "layout-shell"],
    ["GroupHeader", "ordinary-text"],
    ["ItemButton", "painted-marker-led"],
    ["ItemExpandable", "painted-marker-led"],
  ].map(
    ([name, composition]): AddedRow => ({
      id: `ds-app/SideNavigation/common/${name}/${name}`,
      package: "@canonical/react-ds-app",
      source: `packages/react/ds-app/src/lib/SideNavigation/common/${name}/${name}.tsx`,
      exportStatus: "internal",
      composition,
    }),
  ),
  {
    id: "ds-app/SidePanel/SidePanel",
    package: "@canonical/react-ds-app",
    source: "packages/react/ds-app/src/lib/SidePanel/Provider.tsx",
    exportStatus: "public",
    composition: "layout-shell",
  },
  ...["Header", "Content", "Footer"].map(
    (name): AddedRow => ({
      id: `ds-app/SidePanel/common/${name}/${name}`,
      package: "@canonical/react-ds-app",
      source: `packages/react/ds-app/src/lib/SidePanel/common/${name}/${name}.tsx`,
      exportStatus: "compound",
      composition: "sectioned-card-panel",
    }),
  ),
  {
    id: "ds-app/SidePanel/withSidePanel",
    package: "@canonical/react-ds-app",
    source: "packages/react/ds-app/src/lib/SidePanel/withSidePanel.tsx",
    exportStatus: "public",
    composition: "nonvisual-composer",
  },
];

const nonReactRows = [
  {
    id: "svelte-ds-app-launchpad/Button",
    source:
      "packages/svelte/ds-app-launchpad/src/lib/components/Button/Button.svelte",
    styles:
      "packages/svelte/ds-app-launchpad/src/lib/components/Button/styles.css",
    reason: "reads density line-height and inline-padding channels",
  },
  {
    id: "svelte-ds-app-launchpad/NumberInput",
    source:
      "packages/svelte/ds-app-launchpad/src/lib/components/NumberInput/NumberInput.svelte",
    styles:
      "packages/svelte/ds-app-launchpad/src/lib/components/NumberInput/styles.css",
    reason: "reads the shared density block-padding channel",
  },
  {
    id: "svelte-ds-app-launchpad/TextInput",
    source:
      "packages/svelte/ds-app-launchpad/src/lib/components/TextInput/TextInput.svelte",
    styles:
      "packages/svelte/ds-app-launchpad/src/lib/components/TextInput/styles.css",
    reason: "reads the shared density block-padding channel",
  },
  {
    id: "svelte-ds-app-launchpad/Chip",
    source:
      "packages/svelte/ds-app-launchpad/src/lib/components/Chip/Chip.svelte",
    styles:
      "packages/svelte/ds-app-launchpad/src/lib/components/Chip/styles.css",
    reason: "named FR-036 spacing fork; no shared density channel on current main",
  },
  {
    id: "svelte-ds-app-launchpad/Select",
    source:
      "packages/svelte/ds-app-launchpad/src/lib/components/Select/Select.svelte",
    styles:
      "packages/svelte/ds-app-launchpad/src/lib/components/Select/styles.css",
    reason: "named FR-036 spacing fork; uses Launchpad-local inset channels",
  },
  {
    id: "svelte-ds-app-launchpad/InputPrimitive",
    source:
      "packages/svelte/ds-app-launchpad/src/lib/components/common/InputPrimitive/InputPrimitive.svelte",
    styles:
      "packages/svelte/ds-app-launchpad/src/lib/components/common/InputPrimitive/styles.css",
    reason: "named FR-036 internal spacing owner composed by field controls",
  },
  {
    id: "svelte-ds-app-launchpad/density-shim",
    source: "packages/svelte/ds-app-launchpad/src/lib/styles/ds-shim.css",
    styles: "packages/svelte/ds-app-launchpad/src/lib/styles/ds-shim.css",
    reason: "defines the package-local comfortable/dense block-padding channel",
  },
  {
    id: "svelte-ds-app-wpe/Button",
    source:
      "packages/svelte/ds-app-wpe/src/lib/components/Button/Button.svelte",
    styles: "packages/svelte/ds-app-wpe/src/lib/components/Button/styles.css",
    reason: "reads control-seat and density channels directly",
  },
  {
    id: "svelte-ds-app-wpe/Rule",
    source:
      "packages/svelte/ds-app-wpe/src/lib/_work_in_progress/Rule/Rule.svelte",
    styles:
      "packages/svelte/ds-app-wpe/src/lib/_work_in_progress/Rule/styles.css",
    reason: "reads the legacy shared vertical-spacing channel",
  },
  {
    id: "svelte-ds-app-wpe/Cards",
    source:
      "packages/svelte/ds-app-wpe/src/lib/group/Cards/Cards.svelte",
    styles: "packages/svelte/ds-app-wpe/src/lib/group/Cards/styles.css",
    reason: "reads shared grid row/column gap channels",
  },
  {
    id: "svelte-ds-app/ContentLayout",
    source:
      "packages/svelte/ds-app/src/lib/layout/ContentLayout/ContentLayout.svelte",
    styles: "packages/svelte/ds-app/src/lib/layout/ContentLayout/styles.css",
    reason: "consumes the shared grid gutter contract",
  },
] as const;

const slash = (path: string) => path.replaceAll("\\", "/");
const hash = (path: string) =>
  createHash("sha256").update(readFileSync(path)).digest("hex");
const walk = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });

const blobByPath = new Map<string, string>();
for (const line of execFileSync("git", ["ls-tree", "-r", sourceRef], {
  cwd: pragmaRepo,
  encoding: "utf8",
  maxBuffer: 32 * 1024 * 1024,
}).split(/\r?\n/)) {
  const match = line.match(/^\d+ blob ([0-9a-f]+)\t(.+)$/);
  if (match) blobByPath.set(match[2], match[1]);
}

const stylesForSource = (source: string) => {
  const absolute = join(pragmaSnapshot, source);
  const paths = new Set<string>();
  const sameDirectory = join(dirname(absolute), "styles.css");
  if (existsSync(sameDirectory)) {
    paths.add(slash(relative(pragmaSnapshot, sameDirectory)));
  }
  const text = readFileSync(absolute, "utf8");
  for (const match of text.matchAll(/import\s+["'](\.\/[^"']+\.css)["']/g)) {
    const imported = resolve(dirname(absolute), match[1]);
    if (existsSync(imported)) paths.add(slash(relative(pragmaSnapshot, imported)));
  }
  return [...paths].sort();
};

const blobFor = (path: string) => {
  const blob = blobByPath.get(path);
  if (!blob) throw new Error(`Missing Git blob for ${path} at ${sourceCommit}`);
  return blob;
};

const productionRows = legacyRows.filter(
  (row): row is LegacyRow & { source: string } => row.source !== null,
);
const allRows = [...productionRows, ...addedRows]
  .map((row) => {
    const absolute = join(pragmaSnapshot, row.source);
    if (!existsSync(absolute)) throw new Error(`Missing current source ${row.source}`);
    const currentHash = hash(absolute);
    const legacyHash = legacyHashes.get(row.source) ?? null;
    const styles = stylesForSource(row.source);
    return {
      id: row.id,
      package: row.package,
      source: row.source,
      sourceBlob: blobFor(row.source),
      sourceSha256: currentHash,
      currentMainState:
        legacyHash === null
          ? "added"
          : legacyHash === currentHash
            ? "unchanged"
            : "changed",
      exposure: row.exportStatus,
      compositionClue: row.composition,
      styles: styles.map((path) => ({
        path,
        blob: blobFor(path),
        sha256: hash(join(pragmaSnapshot, path)),
      })),
      t006Disposition: getT006Disposition(row.id),
    };
  })
  .sort((left, right) => left.id.localeCompare(right.id));

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
];
const inReactScope = (path: string) =>
  reactPackagePrefixes.some((prefix) => path.startsWith(prefix));
const recordedCss = legacyManifest.filter(
  ({ path }) => inReactScope(path) && path.includes("/src/") && path.endsWith(".css"),
);
const currentCss = walk(join(pragmaSnapshot, "packages/react"))
  .map((path) => slash(relative(pragmaSnapshot, path)))
  .filter(
    (path) => inReactScope(path) && path.includes("/src/") && path.endsWith(".css"),
  );
const recordedCssPaths = new Set(recordedCss.map(({ path }) => path));
const changedCss = recordedCss
  .filter(({ path, sha256 }) => {
    const absolute = join(pragmaSnapshot, path);
    return existsSync(absolute) && hash(absolute) !== sha256;
  })
  .map(({ path }) => path)
  .sort();
const removedCss = recordedCss
  .filter(({ path }) => !existsSync(join(pragmaSnapshot, path)))
  .map(({ path }) => path)
  .sort();
const addedCss = currentCss
  .filter((path) => !recordedCssPaths.has(path))
  .sort();

const nonReact = nonReactRows.map((row) => {
  const source = join(pragmaSnapshot, row.source);
  const styles = join(pragmaSnapshot, row.styles);
  if (!existsSync(source) || !existsSync(styles)) {
    throw new Error(`Missing non-React source for ${row.id}`);
  }
  return {
    ...row,
    sourceBlob: blobFor(row.source),
    sourceSha256: hash(source),
    stylesBlob: blobFor(row.styles),
    stylesSha256: hash(styles),
    t006Disposition: getT006Disposition(row.id),
  };
});

assertT006Coverage([
  ...allRows.map(({ id }) => id),
  ...nonReact.map(({ id }) => id),
]);

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
    legacyInventorySha256: hash(legacyInventoryPath),
    legacySourceManifestSha256: hash(legacyManifestPath),
  },
  boundary: {
    unit:
      "exported React render part plus each internal or compound render part already known to own or bound spacing; named non-React shared-channel consumers are separate rows",
    semanticAssignmentsCompletedBy: "T006",
    candidateRoles: t006CandidateRoles,
    excluded:
      "stories, tests, docs chrome, application fixtures, hooks and context-only modules unless an existing row records a spacing boundary",
  },
  counts: {
    legacyProductionRows: productionRows.length,
    legacyStoryOnlyRows: legacyRows.length - productionRows.length,
    currentReactRows: allRows.length,
    addedCurrentMainReactRows: addedRows.length,
    changedLegacyReactRenderSources: allRows.filter(
      ({ currentMainState }) => currentMainState === "changed",
    ).length,
    unchangedLegacyReactRenderSources: allRows.filter(
      ({ currentMainState }) => currentMainState === "unchanged",
    ).length,
    nonReactRows: nonReact.length,
    t006RowsWithAssignments: [...allRows, ...nonReact].filter(
      ({ t006Disposition }) => t006Disposition.assignments.length > 0,
    ).length,
    t006BoundaryOnlyRows: [...allRows, ...nonReact].filter(
      ({ t006Disposition }) => t006Disposition.assignments.length === 0,
    ).length,
    changedRecordedCss: changedCss.length,
    removedRecordedCss: removedCss.length,
    addedCurrentMainCss: addedCss.length,
  },
  excludedEvidenceRows: legacyRows
    .filter(({ source }) => source === null)
    .map(({ id, storySource }) => ({
      id,
      storySource: storySource ?? null,
      reason: "story-only evidence, not a production component denominator member",
    })),
  react: allRows,
  nonReact,
  currentMainReconciliation: {
    changedRecordedCss: changedCss,
    removedRecordedCss: removedCss,
    addedCurrentMainCss: addedCss,
    exclusions: [
      {
        paths: addedCss.filter((path) => path.includes("/DensityTestbed/")),
        reason: "unexported work-in-progress Storybook testbed, not a reusable component",
      },
      {
        paths: removedCss,
        reason: "removed Storybook evidence chrome, not production owners",
      },
    ],
  },
};

writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result.counts, null, 2));
