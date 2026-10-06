# Opus review request — BF Spec 028

Date: 2026-10-06

## Requested checkpoint

Review the completed Baseline Foundry implementation of the approved Spec 024
shared-spacing rulings. This is the single external Opus checkpoint requested by
the owner. It is not owner visual sign-off and does not authorize a merge.

## Snapshot

- BF base: `6deca99776f35b85afde01b68bb0fffe817e29aa`
- Final implementation source: `12d47abb938aecb5884387c376560d8aab66a655`
- Identical-DOM review demo: `db10d20fd6c1dd67b91cd0f5b42c0035482398a4`
- BF implementation/demo review target: `db10d20fd6c1dd67b91cd0f5b42c0035482398a4`
- Governing Canonical values/rulings: `7169231`
- Canonical routing reviewed through: `c53b12b`
- Evidence root: `H:/WSL_dev_projects/temp/bf-028-20261006/`
- Overall evidence manifest: `bf-028-evidence-manifest.json`
- Overall manifest SHA-256: `934f3f05c4ac2b800d7041bd18d03cff449369e99d69f38472a996337ca4ec5d`
- Root review manifest SHA-256: `3c277d6e43d7b56a8fc196a81582bc5f40d1029749c4b7044bec78a715d7a707`

Review page while the feature server is alive:
`http://127.0.0.1:4176/demo/spec-028/index.html`.

## What changed

1. Site/Docs/App field, mark, gap and surface values now match the approved
   working matrix; OS retains its own values outside the explicit four-tier
   rules. The resolved artifact records upstream base `18f57b95...` separately
   from the Spec 024 working source `7169231`.
2. Standard icon paint and slots follow tier body size: 16/14/14/12px. The
   tagged Canonical brand keeps its named 16px anatomy.
3. Continuation is derived from start inset + body-sized icon + mark gap; the
   authored continuation field and integer-unit assumption are removed.
4. SP-13 uses BF's measured metric nudge and computes the smallest grid-closing
   compensation at least equal to that nudge in all four tiers. No body-phase,
   Spec 026 default, `1cap` replacement or custom preview config was added.
5. Semantic relationships are owned by parent gaps/padding. Ordinary text
   margins are block-end compensation, and zero-padding text containers
   establish containment without overriding stack/grid/cluster utilities.
6. Tooltip separates its compact outer frame from the contained metric text:
   field inline inset and 0/4/4px block inset for Site/Docs/App, preserving OS's
   own field value.
7. SideNavigation uses both grid-margin gutters, tier icon slots, the governed
   mark gap and one shared label keyline. Header, GroupHeader, nested labels,
   selected gutter paint and the real ContextSwitcher follow that geometry.
8. The versioned density policy automatically enrolls a Site Chip only under
   its nearest approved Table.Cell/product root. It is nominally 32px inside a
   nominal 40px host with exact text-baseline equality and no child
   compensation; standalone remains nominally 40px.
9. Row geometry no longer contains stroke width. Component families use
   locally reset, pointer-transparent, out-of-flow paint. Automatic last-child
   `::after` is the default; named anatomy/native exceptions preserve occupied
   pseudos, native parts, glyph shapes or the fieldset/legend construction.
   One-sided forced-colors paint uses logical system-color borders and
   all-sided paint uses outlines. Existing elevation/stack contracts remain
   separate from stroke ownership.
10. The real BF review demo switches only the stylesheet between freshly built
    base and feature tier bundles. It includes the real Card popup across the
    following Card, notification containing-block sentinel, edge-covering
    opaque child and keyboard focus pressure case, sticky controls, provenance,
    baseline/box overlays, all tiers and desktop/mobile widths.

## Required gates and independent checks

Every final family has exit-zero `npm run check:types`, `npm test`, and
`npm run qa:components` logs. Per-family JSON records pin commands, exits,
bytes and SHA-256 values. `initial-items-gates.json` indexes the preserved early
triplets. It explicitly discloses that the exact-tip three-log sets for
`f199993` and `955bc27` were not retained; later complete gates, the independent
48-product working-value oracle and final icon consumer/browser audits prove
those values at the final source. No missing log is reconstructed.

Key independent results:

- `root-working-values.json`: all 48 governed artifact/output products and
  provenance are exact.
- `root-text-oracle.json`: all 28 role products exact, 16 expected changes,
  nudge and line height preserved, minimal compensation and grid closure pass.
- `root-final-row-scales.json` and `root-row-scale-comparison.json`: four tiers
  at true Chromium launch scales 1/1.25/1.5/2, one and 100 repeated rows,
  actual HTTP CSS bytes and fonts. At scale 1.5 the 100-row native-field error
  falls from about -68px before to about -1–2px after; the remaining Blink
  quantization is reported rather than hidden with height hacks or tolerance.
- `root-demo-ui.json` and `paint-demo-committed-browser.json`: physical scrolled controls remain sticky, the document
  has no mobile horizontal overflow, markup stays identical, the real popup
  crosses and receives a physical click, and the notification close action
  stays in its owner.
- `paint-semantic-final-source.json`, `paint-table-sortable-anchor-repaired.json`,
  `paint-native-final-source.json`, `paint-filled-focus-repaired-centered.json`,
  `paint-filled-focus-repaired-centered-pixels.json` and
  `paint-focus-committed-mapping.json`
  and the final paint report cover tier-sized glyphs, RTL, forced colors,
  native affordances, true header anchoring, pointer routing, popup/filled-child
  pressure and visible keyboard focus. The filled-child repair is mapped to
  clean commit `12d47ab` across 64 affected normal/forced-color states.
- `root-conformance-boundaries.json` proves the Spec 024 rule and Pragma
  columns are unchanged and all applicable BF rows are `done`, never
  `signed off`.
- `root-preservation.json` proves the original reports/handovers, BF main dirty
  inbox, frozen neutral demo and canonical diagnostic source are unchanged.

## Review focus

Please verify:

1. the board rows SP-1, FR-061a, Nudge, SP-2/3/5/6/7/8/9/10/11/12/13/14/15
   are supported by actual BF consumers and checks, including the OS scope
   notes and FR-039b metric-nudge distinction;
2. automatic overlay ownership, named exceptions, forced-colors shapes,
   filled-child focus, native interactions, logical RTL paint and popup escape
   match the governing stroke contract without layout borders, new isolation
   or ordinary-content wrappers;
3. the review page uses faithful base bundles built from `6deca997`, exact
   feature bundles built from `12d47ab`, identical specimen DOM and no fixture
   normalization that creates the claimed improvement; and
4. the evidence manifest, family gate records and final contract/paint reports
   are internally consistent with the immutable `db10d20` source/demo review
   target. The later documentation-only carrier commit is recorded separately
   in Canonical routing because a file cannot contain its own commit hash.

## Explicit limits and pending human work

- Real Windows contrast-theme review and Safari remain human/platform checks.
- Owner visual sign-off is not recorded. The board status is `done`, not
  `signed off`.
- The owner decides whether to merge to BF main. No push, merge or PR was made.
- The named `bf-field-boundary` is a public native-field anatomy change. The
  base comparator discloses it; `root-before-native-markup-probe.json` shows the
  compatible wrapper does not create the before row-span delta.
- The density policy supports automatic descendants within the scoped nearest
  Table.Cell/product ownership proven by its nested-table, nested-tier,
  neutral-descendant and compatibility breakers; it exposes no public density
  opt-in toggle.
