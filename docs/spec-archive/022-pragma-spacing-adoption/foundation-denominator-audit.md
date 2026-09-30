# Foundation spacing denominator audit

> **Historical audit snapshot.** Its omissions were subsequently added and
> recaptured. Use [`README.md`](README.md) and
> [`evidence/README.md`](evidence/README.md) for current counts and status;
> retain this file for the reasoning that found the supplement.

Date: 2026-09-19. Independent source audit after `opus-evidence-review.md`.

Reference source: `H:/WSL_dev_projects/pragma/.claude/worktrees/feat-bf-shared-alignment`.
Evidence assessed: global/form/app owner maps, catalog witnesses, relationship
ledger, `config/react-spacing-inventory.ts`, `ReactPilot.catalog.ts`,
`ReactAlignmentLab.catalog.ts`, focused horizontal/vertical stories, and the
relevant imported stylesheets. Storybook edits were in progress during this
audit; this report assesses the source denominator and the proposed all-family
page, not their final browser rendering.

## Finding

The corpus is **not yet a comprehensive live foundational-owner denominator**.
It is an impressively broad React renderer/catalog denominator, but some live
spacing declarations never enter that catalog. Mounting its seven existing
families together fixes discoverability, not these omissions. The omissions
below do not establish a need for more inset categories: most are existing gap
consumers, zero boundaries, or legacy declarations awaiting normalization.

The pre-expansion report of 177 catalog witnesses and 501 relationships could
not be used as a completeness proof. Its input set was authored. The expanded
536-relationship ledger likewise proves coverage of its reconciled input set,
not that no source owner remains. This audit also remains a lower bound: it performs source-file
reconciliation and targeted declaration inspection, not a complete parsed-CSS
selector/declaration-to-owner bijection.

## Final selector pass and implemented supplement

A second read-only pass used the repository's CSS declaration parser. Every
live React spacing stylesheet found by the file scan is now represented; the
remaining unmatched files are the documented TokenTable orphans and token-story
presentation CSS. File-level closure did not imply selector-level closure:
the pass found the five cases below, now added to the owner maps.

| Added owner | Exact omitted relationship | Interpretation |
|---|---|---|
| `.ds.field-label[data-required]::before` | `margin-inline-end: var(--form-required-marker-gap, 0.25ch)` | Typography-relative required-mark separation; normalization or explicit text-adornment boundary decision. |
| `.ds.markdown-editor > div.editor-content ul.contains-task-list input[type='checkbox']` | `margin-inline-start: -1.25em`; physical `margin-right: 0.313em` | Legacy marker placement/separation, including an RTL migration issue; exercise real task-list Preview. |
| `.ds.indentation-block:has(> .indent-block.empty)` | `width: 0`; `margin-inline-start: calc(-1 * var(--ds-leading-mark-gap))` | Public zero-depth mode cancels an otherwise present gap; zero inline size is intentional. |
| `.ds.side-navigation > .ds.content::after` | Fade `block-size` and equal negative `margin-block-start` from `--overflow-gradient-height` | Sticky canvas compensation over separately reserved clearance. |
| `.ds.markdown-editor > .top-bar` | `margin-bottom: -1px` | Border/seam normalization evidence. |

None establishes a new spacing category. The new heading record measures the
native h1 role's alignment/compensation; h1–h6 are visible in the heading scene,
but this single record does not assert six independent measured roles.

The live pages now select 59 specimens and 184 unique witness IDs. The saved
catalog input contains 178 IDs; `page-witness-reconciliation.json` explicitly
maps the other six IDs (highlighted code and five CSS primitive/list witnesses)
to existing extra owners. The verifier reads the live TypeScript registry and
fails if a page-only ID lacks that mapping or a catalog selector diverges. The
two native-list aliases require separate captured ul and ol targets.

Duplicate declared relationships remain intentional multiple observations, not
unique owners: Timeline actor/datetime/body repeat the same content gap/end
padding; TokenSwatch variants repeat root gap and shared chip/sample/mini-box
geometry. Category-count evidence must collapse by source owner/relationship
before treating their repetitions as independent supporting examples.

The 536-row model contains 524 observed relationships and 12 explicit
source-only boundaries. Both collectors were rerun after the supplement; the
strict current-source freshness and completion gate passes. The real review-page
fixture now includes checked and unchecked task-list content as well as fenced
code, so the same public Preview interaction exposes both conditional owners.

## Boundary used

The unit is a live, reusable **spacing owner**, not a component name or an entire
workflow. A component can contribute several owners, and several components can
share one behavior.

1. Include a reusable component/subcomponent's own inset, sibling gap, margin,
   reserved canvas, occupied-row compensation, and per-edge border arithmetic.
   Include CSS-only reusable layout primitives such as a stack or grid, because
   they own the relationship between foundational children.
2. Keep page/application shell slot allocation, viewport positioning, responsive
   columns and track spans outside component-inset category counting. Record
   their consumed semantic gaps as **external layout consumers**, with actual
   source expressions. They are not literally non-spacing elements. Their
   dependency records help audit gap-scale renames and axis use without making
   every application screen a required specimen.
3. Exclude compositions that merely assemble existing owners (for example a
   login flow or the hard-coded SettingsView demo). Decompose any unique
   reusable owner they expose; do not inherit the children's category at the
   composition root.
4. Zero resets, paint-only leaves and dimensionless track placement get explicit
   boundary dispositions. Dead/orphan CSS gets a provenance exclusion. Neither
   creates tokens. A missing rendered state remains open, rather than becoming
   a boundary by default.

This boundary admits `.ds.cards`, `.grid`, `.content-flow` and `.editorial` on
the same basis: they are reusable layout mechanisms whose direct-child gaps
are authored by the design system. It does not admit an assembled application
page simply because that page contains cards or uses a gap token.

## Actionable inclusion and exclusion matrix

Paths in this table are relative to the reference worktree.

| Owner / source | Current evidence | Disposition and required action | Category effect |
|---|---|---|---|
| `.grid`, `packages/styles/main/src/grid.css:97` | No owner relationship for its row/column gaps. React `ContentLayout` indirectly consumes it, and the whole renderer is runtime-excluded. | **Include foundational layout owner.** Record `column-gap: var(--grid-column-gap, var(--grid-gap, var(--grid-gutter, 1.5rem)))` and corresponding row-gap. Add a minimal two-dimensional grid specimen to the existing axis pages. Separate column templates from the length relationships. | Tests gutter/shared-gap semantics and per-axis overrides; no new inset family. |
| `.content-flow`, `grid.css:142` | Missing from owner maps and React catalog. | **Include foundational stack owner.** Record `gap: var(--content-flow-gap, var(--spacing-gap-group-block))`; render two baseline-governed children on the vertical page. | Existing group gap; needed for the gap-scale proof. |
| `.editorial`, `grid.css:151` | Missing from owner maps and React catalog. | **Include foundational flow owner.** Record `gap: var(--editorial-flow-gap, var(--spacing-gap-field-block))`; render text and a component without removing their compensation. | Existing field gap. Demonstrates parent separation versus child metric compensation. |
| `.ds.cards`, `packages/react/ds-global/src/lib/group/Cards/styles.css` | Present as `alignment-card-shared-tracks` with row/column gaps. | **Keep included.** Name the group gutter as a layout relationship rather than a component inset. Its inclusion must not be used to exclude equivalent CSS-only primitives. | Existing grid gutter; no new bucket. |
| `.ds.side-navigation`, `packages/react/ds-app/src/lib/SideNavigation/styles.css:19` | Header, Content, Footer, NavTree and NavTree group owners exist; the root gap is missing. | **Include missing intrinsic root owner.** `gap: var(--_sidenav-group-gap)` separates Header/Content/Footer and resolves through `--sidenav-group-gap` to `--spacing-gap-group-block`. Add this relationship to the existing app-shell specimen. | Existing group gap. This is distinct ownership from the NavTree gap even when equal. |
| `.ds.code-diff-viewer .diff-table`, `packages/react/ds-app-launchpad/src/lib/GitDiffViewer/common/CodeDiffViewer/styles.css:12` | Diff cells, gutters and rows are represented, but table `border-spacing: 1px 0` is not. | **Include missing table-separation owner.** Measure the used horizontal cell separation and record the zero vertical separation. Keep the table's `display:block` and separate-border context in the evidence. | Candidate border/seam arithmetic or legacy normalization; not automatically a 1px spacing category. |
| Same stylesheet, `.diff-table tr`, lines 19–20 | `margin-left/right: -1px` absent. | **Disposition the authored correction.** Table-row margins may not affect used table layout; capture computed and used geometry before calling it a real separation. If ineffective, mark ineffective legacy declaration rather than a new owner value. | No category until a used spacing effect is established. |
| Markdown preview `pre code.hljs`, `.../CodeDiffViewer/HighlighTheme.css:4–7` | Missing. The theme is imported by MarkdownEditor; its highlighting effect calls `highlightElement` on preview `pre code`. The current catalog default contains no fenced code. | **Include a live conditional code-block owner.** Render fenced code in preview and record `.hljs { display:block; padding:0.5em }` on both axes, nested within the editor-content inset. Inspect the actual highlighted DOM rather than forcing the class. | Legacy typography-relative inset requiring normalization/exception. It disproves any broader claim that GitDiff FileHeader is the only live `em` spacing source; Opus F9 is true only of the captured corpus. |
| Native `ul, ol`, `packages/styles/typography/src/elements.css:103` | Focused horizontal story displays them, but owner maps contain only reset Category/Breadcrumb lists. | **Include shared element primitive.** Record `padding-inline-start: calc(marker-canvas + marker-gap)`. Keep default list-item typography compensation as a dependent relationship. | Existing marker-lane composition; no new inset category. |
| `.ds.tabs-item`, `packages/react/ds-global/src/lib/component/Tabs/common/Item/styles.css:17–19` | `.tabs-link` relationships exist; the enclosing Item's zero margin/padding is absent. | **Add explicit zero-wrapper boundary**, optionally measured using the existing Tabs fixture. Attribute positive inset/row geometry to `.tabs-link`. | No new category. Opus F19 is a provenance/ownership correction here, not missing positive spacing. |
| `.ds.form-checkbox`, `packages/react/ds-global-form/src/lib/subcomponent/CheckboxInput/styles.css` | ToggleWrapper owns gap/row/offset in the ledger, but the CheckboxInput stylesheet is absent from `ownerSource`. The atomic input is visible as the marker target. | **Clarify leaf ownership.** The input owns its `margin:0`, fixed marker canvas and border; the wrapper owns placement/gap. Add its source to the canvas/boundary record rather than attributing the canvas to the wrapper. | Existing fixed canvas and zero-margin boundary. |
| App `.ds.application-layout` / `.ds.view-layout`, corresponding `packages/react/ds-app/src/lib/*/styles.css` | Aggregated `extra-app-layout-boundary`, no relationships; the app map calls them external layout. | **Keep outside component-inset count; add explicit external-consumer relationships.** Both own a shell-slot gap resolving through `--container-gap-default`; record their override/fallback chains separately. No full application workflow specimen is required. A minimal gap-scale example can exercise the common contract. | Existing group gap; relevant to Opus F12 axis semantics. Do not describe them as having no spacing. |
| App `.ds.content-layout`, `ContentLayout.tsx` | Aggregated with the shell exclusions. | **Record delegation to `.grid`**. It renders `className="ds content-layout grid responsive/intrinsic"`; its local CSS adds alignment only. Measure the included grid owner once, and retain this renderer as a dependency/boundary row. | No independent category. |
| WIP `ApplicationLayout`, `InnerGridDemo`, `SettingsView` in `ds-global/_work_in_progress/grid` | Runtime-excluded. Source owns `--container-gap-default` uses, but these fixtures hard-code assembled demo content. | **Keep composition/demo exclusions**, record semantic-gap dependencies for migration, and reuse foundational input/grid owners. These files are live exports, so call them demo compositions, not dead code. | No component-specific category; source usage still matters to renames. |
| `.token-table-container`, `packages/react/tokens/src/lib/TokenTable/TokenTable.css` | Opus F19 calls this a missing live owner. | **Exclude as orphan stylesheet**, as suggested by F20. Live TokenTable imports `./styles.css`, and its TokenSwatch comes from `./common/TokenSwatch/index.js`. No import of legacy `TokenTable.css` / sibling `TokenSwatch.css` was found. Do not add its `gap:0.75rem` to the live corpus. | No effect. A source-manifest hash does not establish a runtime consumer. |
| `Tokens.css`, `Typography.css`, `packages/react/tokens/src/lib` | File-name scan finds many unrecorded padding/gap rules. | **Exclude story presentation chrome.** Imports come from `Tokens.stories.tsx` / `Typography.stories.tsx`. These are page wrappers and pedagogical samples, not reusable production owners. They still must not contaminate axis-page grid origins. | No effect. |
| Native table on focused spacing page, `spacing-audit.css:232–251` | Visible, with shared candidate cell padding. | **Label reference/host specimen, not production-component proof.** Its CSS explicitly states React has no public Table export and authors the cell contract in the story. Use real TokenTable/GitDiff cells for implementation evidence. | Can demonstrate a proposed contract; cannot independently validate that contract or close a production Table inventory row. |
| `.responsive`, `.intrinsic`, `.subgrid`; Cards text-only track remapping | Some track placement is recorded among extras. | **Dimensionless/layout boundary.** Column count, span and placement do not own a spacing length. Gap ownership remains at `.grid`/`.cards`. | No category. F15 exclusion holds for this reason. |

## Axis-page acceptance conditions

The complete specimen set belongs on the existing horizontal and vertical
pages. The proposed union of family selections is useful, but the union needs
the newly identified CSS primitives and conditional states too. Each positive
owner should be visible in the axis/category that it tests, with its actual
edge or gap identified. Composite fixtures may supply required parents; their
outer height or arbitrary editorial wrapper must not masquerade as a baseline
reference for the next specimen.

An owner-to-page map should distinguish: present by default, revealed through
a real interaction, supporting child of another specimen, external layout
consumer, and source-proven boundary. A catalog ID alone does not answer this.
The 67 extra owner/variant/foundational records particularly need that map. The
current registry dispositions five through page aliases, four as source-only
boundaries and the remaining 58 as explicitly deferred owners. Measuring them
through a temporary DOM alteration is not the same as showing them on the
comparison page.

The user's Accordion issue is a relationship between **two existing owners**:
the summary label keyline and expanded content start. Their individual captures
do not prove alignment. Record the comparison explicitly before assigning the
panel to Surface or creating an Accordion-specific category. Existing
Continuation keyline composition is the first candidate to test.

Similarly, an ordinary Chip inside a cell does not demonstrate the nested
variant. Show the real implemented variant and its measured occupied block.
The known 24/20/20 line-height versus a 16px tight-host reference remains a fit
gap; removing a Nested token family does not repair that fit.

## Consequences for the minimum model

No new semantic inset bucket is justified by this audit. The new gap consumers
make the gap scale, axis semantics and override policy part of the deliverable,
not optional layout follow-up. Shared value triples cannot merge owners whose
semantic dependencies differ; equally, each newly found owner must not mint a
new category just because its source value is currently a literal.

The all-family page should not be described as comprehensive until the additions
above have either rendered evidence or explicit scoped boundary records. The
final closure should reconcile live spacing declarations from imported CSS to
owner relationships, including CSS-only primitives, not just reconcile React
render modules to existing catalog IDs. A practical closure key is:
`source file + selector/state + logical relationship -> owner -> specimen or
boundary -> accepted contract / migration decision`.

## Unilateral judgments and limitations

The user authorized autonomous auditing. This report uses the design-auditor
skill's distinction between measured data and judgment, but source inspection
is necessary here because the skill's graph coverage cannot certify built
implementation coverage. No visual quality conclusion was drawn from metadata.

The main judgment is the boundary above: reusable stack/grid mechanisms are
foundations; whole application shell allocations are external consumers; demos
and page chrome are compositions. It is deliberately applied by ownership,
not by directory or the presence of a React component. At the time of this
audit, it did not change production code, owner maps, token definitions or
evidence, and fresh browser capture was still pending. Those owner-map
additions and captures were completed later; current status lives in the
evidence README. The source omissions remain the historical finding this
document establishes.
