# Agent inbox — Spec 028 Opus corrections

Date: 2026-10-07
Branch: `feat/028-shared-spacing-decisions`
Worktree: `../baseline-foundry-worktrees/feat-028-shared-spacing-decisions`
Base: `6deca99776f35b85afde01b68bb0fffe817e29aa`
Governing feature snapshot: `7169231fcc3168032275d920d32856f9669107ac`

## Current objective

Address the actual **changes requested** verdict in
[`opus-028-review.md`](specs/028-shared-spacing-decisions/opus-028-review.md), then
prepare the next external Opus checkpoint. The report is preserved unchanged in
`94a9025535b26bfd9f872f328e82a70ee387188e`. It accepts the first cut's bundle
fidelity and numerical proofs, not its custom review shell or newly identified
regressions.

Do not resume parked Spec 026, implement body-line phase or Pragma, edit the main
checkout's dirty inbox, push, merge or open a PR. BF retains metric-derived
alignment; future Pragma alignment uses element-local `1cap`. OS takes SP-13
and retains its separately governed values elsewhere.

## Correction progress

- B1: bare native fields keep normal, validation and forced-color boundaries.
  `94dea088b6c1fdfd7d1066388140b2c4dcfd0e41`; all three required gates pass.
- D2: detached Tooltip paint anchors to its message; positioned behavior stays
  intact. `9a7d7c8fa99551428206ec8eae7ca38cf5449318`; all three gates and the
  independent 16-state message/frame audit pass.
- S1/S3: `959b5599f4cb2e8a0836e71d867def3d7cc34445`; all three required gates
  pass, with the independent final audit pending. Preserve raw-table
  clipping/ellipsis, rowspan geometry and static
  anchors; correct conditional leaf paint. Raw cells use inset system-color
  outlines in forced colors, with the added cell edges disclosed. Named BF
  tables retain one-sided paint.
- S2: disclose Card overflow and prove separate content scrolling/popup escape.
- M1: restore exact component text-top assertions with explicit optical cases.
- D1/M2: move Before/After into BF's shared controls, layout, grid and scripts;
  test actual mobile viewports and retire the custom review shell.
- B2/S4: correct full-SHA/effective-override provenance and regeneration guards;
  name untested Firefox explicitly. Canonical main activation remains pending.

Source/demo/scripts/config and component docs have one writer; root owns this
inbox and Spec 028 routing/progress docs. Commit final routing after the source
and runtime freeze. See [tasks](specs/028-shared-spacing-decisions/tasks.md).

## First-cut history (not the corrected review target)

- `b496f26` Spec 028 package and catalog routing.
- `f199993` control values and 0/4/4px compact block inset.
- `955bc27` 16/14/14/12px body-sized icon source; tagged brand exception kept.
- `49bae12` continuation derived from field + body icon + gap; no authored field.
- `6717ccc` SP-6 gaps and SP-3 standard surface values.
- `b4a6b13` four-tier SP-13 text compensation; independent 28-role oracle green.
- `948f240` Tooltip compact frame and contained metric text owner.
- `5184484` removes nonzero block-start spacing, contains final text margins,
  and preserves control/navigation geometry. Its type, test, and component-QA
  logs are `margins-check-types.log`, `margins-npm-test.log`, and
  `margins-qa-components.log`.
- The current SideNavigation item owns page-margin gutters on both edges,
  derives one tier icon/gap label keyline for Header, GroupHeader and nested
  rows, adds a real ContextSwitcher, and paints selection in the start gutter.
  Its required gates are green in `sidenav-check-types.log`,
  `sidenav-npm-test.log`, and `sidenav-qa-components.log`.
- The current governed dense Site Chip item uses a versioned Table.Cell/Chip
  policy and nested CSS scopes to resolve the nearest provider and product
  root through neutral descendants. Site Chips occupy 32px in the provider,
  align exactly with adjacent text, and leave the host row and standalone seat
  at 40px. Nested tables/products and the legacy class boundary cases are
  covered. Its required gates are green in `dense-chip-check-types.log`,
  `dense-chip-npm-test.log`, and `dense-chip-qa-components.log`.
- The current row-contract item removes layout-border arithmetic from the
  regular and nested ledgers, removes the bordered Action alias and obsolete
  build guards, and drops transparent frame borders from row-only geometry.
  Its required gates are green in `row-contract-check-types.log`,
  `row-contract-npm-test.log`, and `row-contract-qa-components.log`.
- The current row-bearing command-family item migrates Button, Chip, ChoiceRow,
  SegmentedControl and Pagination to locally reset paint slots. The automatic
  last-child overlay is the default. Icon-only Button retains its metric strut
  and pointer-target pseudos as a named leaf self-paint exception; Pagination
  moves both directional arrows to `::before` so `::after` remains the overlay.
  Its required gates are green in `commands-check-types.log`,
  `commands-npm-test.log`, and `commands-qa-components.log`.
- The current native-field item adds the named `bf-field-boundary` anatomy,
  moves row compensation and one-sided paint to that owner, and preserves the
  native select, number, textarea, file, colour and range interactions. Search
  compositions use their existing outer owners. Its required gates are green
  in `fields-check-types.log`, `fields-npm-test.log`, and
  `fields-qa-components.log`.
- `cbcabbe` migrates navigation bars, drawers, pagination and navigation
  actions to out-of-flow paint while preserving the tagged Canonical brand,
  icon slots, SideNavigation selection and existing navigation stack contract.
  Its required gates are green in `navigation-check-types.log`,
  `navigation-npm-test.log`, and `navigation-qa-components.log`.
- `c3af935` migrates Card, OptionCard and ContentCard surface boundaries and
  seams to out-of-flow paint, moves standard surface ownership to the Card
  root, preserves the missing-preview leaf exception, and proves a real menu
  can escape the following Card. Its required gates are green in
  `cards-check-types.log`, `cards-npm-test.log`, and
  `cards-qa-components.log`.
- `1b00248` migrates Panel, Modal, ContextualMenu, Tooltip, SearchAndFilter and
  CodeSnippet boundaries and seams to automatic overlays, with root-owned
  surface spacing, local RTL paint, forced-colors edges and real pointer
  routing. Its required gates are green in `overlays-check-types.log`,
  `overlays-npm-test.log`, and `overlays-qa-components.log`.
- `f32f9ce` migrates Notice, Notification and metadata seams to automatic
  overlays. Checkbox, Radio, Switch and Range native parts plus the
  fieldset/legend anatomy use bounded self-paint exceptions with zero layout
  borders, inset forced-colors outlines and preserved native slots. Its
  required gates are green in `feedback-check-types.log`,
  `feedback-npm-test.log`, and `feedback-qa-components.log`.
- `ebe54a0` migrates table row rules, mobile table-card frames, divided-list
  separators, Tabs rules and InlineOptions boundaries to automatic overlays.
  It also splits the Range thumb forced-colors vendor rules so Chromium keeps
  the WebKit rule in its CSSOM. Its required gates are green in
  `tables-check-types.log`, `tables-npm-test.log`, and
  `tables-qa-components.log`.
- `0410c72` migrates token rows, rules, CTA blocks, Hero, equal-height columns
  and ArticlePagination to out-of-flow paint, and binds DividedSection/rule
  clearance to the governed group/item roles. It also anchors the sortable
  header exception to its real cell and proves exact pseudo bounds through
  CDP. Its required gates are green in `static-check-types.log`,
  `static-npm-test.log`, and `static-qa-components.log`.
- `cf48e2f` migrates TopNavigation dropdown/search popup frames and application
  drawer/aside edges to automatic logical overlays while preserving their
  existing elevation and stack contract. Desktop dropdowns retain all-sided
  forced-colors paint while mobile dropdowns retain their top-only edge. Its
  required gates are green in `shells-check-types.log`,
  `shells-npm-test.log`, and `shells-qa-components.log`.
- `65a1436` closes the emitted border/root-shadow, compensation-only margin,
  peer-spacing and icon-slot inventories. Its required gates are green in
  `governance-check-types-final.log`, `governance-npm-test-final.log`, and
  `governance-qa-components-final.log`.
- `12d47ab` moves linked Card and OptionCard keyboard focus paint onto their
  automatic overlay, so normal and forced-colors focus stays visible above an
  edge-covering opaque child. Its required gates are green in
  `focus-overlay-check-types.log`, `focus-overlay-npm-test.log`, and
  `focus-overlay-qa-components.log`; the independent 64-state pixel matrix is
  also green.

Gate logs live under `H:/WSL_dev_projects/temp/bf-028-20261006/`, named by item.

## Evidence and active change

The first immutable review target was `db10d20`, built from `12d47ab`.
Its internal paint/runtime acceptance is superseded by the actual Opus findings.
Keep its accepted numerical proofs and sealed evidence unchanged. Its manifest is
`H:/WSL_dev_projects/temp/bf-028-20261006/bf-028-evidence-manifest.json`, SHA-256
`204fdec1e22a5474e4f288c423a8e869666f7c7e76ac2c4af6abbd9b930660cf`.

New correction evidence is being assembled under
`H:/WSL_dev_projects/temp/bf-028-opus-corrections-20261006/`; it is not sealed yet.
The BF server runs at `http://127.0.0.1:4176/`. Use existing BF component/spec
pages. The shared Before/After control is still pending, and the custom shell is
being retired. Frozen Canonical diagnostics are unchanged and are not the owner
sign-off surface.

## Remaining order

1. Finish correction gates, independent paint/runtime review and root integration.
2. Seal separate evidence and save a new correction request; do not overwrite
   the original report, request or sealed evidence.
3. Stop for the external Opus review. Owner visual sign-off remains pending.

Canonical main at receipt is `cad4aacf91b7e70bee81730552b76ef0d8291a34`; the
ruling snapshot is still feature-branch-only. Before BF main adoption, the owner
must merge the governing rulings and the artifact must be re-pinned to the
resulting full main commit, or the owner must record an explicit exception.
No exception is inferred. Feature corrections do not satisfy this prerequisite.

Browser forced-color emulation is not Windows contrast-theme sign-off. Firefox,
Safari and actual Windows display scaling require recorded coverage or limits.

Run `npm run check:types`, `npm test`, and `npm run qa:components` after each
atomic item. Do not edit frozen neutral diagnostics, push, merge, or open a PR.
