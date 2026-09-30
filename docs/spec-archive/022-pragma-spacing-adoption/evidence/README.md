# Spacing evidence snapshot — 2026-09-21

This is local design-spike evidence, not production code or a release gate.
The implementation under measurement is the
`feat-bf-shared-alignment` worktree. The differently modified `fix-root-gates`
worktree contains these audit artifacts; do not confuse their CSS states.

## What is covered

- 178 catalog witness IDs, including the newly added heading reference, each
  captured in Site/Docs/App: 534 observations.
- 77 additional descendant/pseudo selectors per tier, separating actual owners
  from wrappers. These are probes, not 77 new components or categories.
- 419 declared relationships in the catalog and 117 in 67 extras,
  across the global, form, app and CSS styles-primitives owner maps.
- Of 536 current relationships, 524 have exact current capture references and
  12 belong to four source-only boundaries. The strict freshness gate passes.
- Source-only boundaries cover unsupported Chip-Badge CSS, dimensionless
  text-only Cards track remapping, demo-layout consumers and external app-shell
  gap consumers. The zero Tabs wrapper is captured rather than waived.
- 63 direct extra-owner probes run per tier; 52 are visible in their requested
  default/interaction state and targeted evidence resolves the 11 absent direct
  states. All capture IDs are unique within a tier.
- 20 targeted variant/state captures per tier, including real public-prop
  React mounts for inline ColorInput, Markdown preview checkbox and interactive
  GitDiff comments. Default-state probes and variant captures are separately
  namespaced and retain distinct provenance.
- The live page registry has 59 specimens and 186 unique witness IDs. Its 178
  catalog IDs and eight explicit aliases are reconciled by
  `page-witness-reconciliation.json`; the native ul and ol aliases must each
  resolve to a captured target of the correct tag.
- The semantic review-bucket registry currently records 456 bucket routes
  across 180 horizontal and 186 vertical unique measurement targets. Its
  browser proof checks settled activation, zero missing witnesses,
  `shown + awaiting activation = registered`, the exact target union and the
  mounted specimen set. Route rows expose target ID, status and
  relationship IDs; shared whole fixtures and the catalog-only denominator are
  explicit caveats, not production coverage claims. Twenty stateful targets
  await safe activation pending minimal, instance-safe fixtures.
- The typed extra-owner registry separately enumerates 56 source owners and
  95 spacing facts awaiting isolated fixtures outside the catalog-target registry. These are
  explicit denominator entries, not aliases or completed fixtures; extra-owner
  and state closure remains open.
- The final adversary review keeps the hard cases visible: the SideNavigation
  group-header relationship routes to both `continuation` and `field`, the
  GitDiff row-margin correction remains an unresolved mismatch, Switch exposes
  a Marker dependency, the navigation row exposes a Control-row dependency,
  and duplicate pseudo display is deduplicated rather than counted again.

These counts do **not** prove all source owners or all relevant states have
been found, nor that every captured property has an approved semantic category.
A visible owner is not proof of every branch in its selector or source rule.

## Reading order

1. `../bucket-table.md`: candidate merge tests and outstanding mismatches.
2. `measured-relationships.md`: original witness capture index and extra-entry
   observations; outer geometry is not a substitute for child geometry.
3. `relationship-ledger.json`: per-declared-relationship owner selectors and
   capture references. All `categoryAssignment` fields intentionally remain null.
4. `{global,form,app,styles}-owners.json`: source expressions and exclusion reasons.
5. `browser-measurements.json`: authoritative full computed-property captures;
   refs resolve by ID in each tier's `measurements` or `ownerMeasurements`.
6. `variant-measurements.json`: explicit fixture states, public props, visible
   matching targets, pseudo styles, source hashes and CDP glyph-font evidence.

`owner-ledger.json` is a joined, partly compact view, not the full property set.
For positions and grid-track facts, use the referenced raw browser capture.
The screenshots show restored catalog states, **not** every temporary variant.
CDP authenticates representative body/code glyph runs, not every text run.

The additional CSS map covers `.grid`, `.content-flow`, `.editorial` and bare
`ul/ol`. Their fixture ID is `styles-primitives`; the grid needs two occupied
rows and columns, and lists must be outside component-owned list resets. The
Markdown highlighted-code owner requires fenced code and a real Preview
interaction followed by syntax highlighting. Existing Checkbox, Tabs,
SideNavigation and GitDiff fixtures should supply the other newly added owners
on recapture. The styles-primitives scene and real highlighted preview now exist
on both axis pages and are collected through extra-owner probes. Their six
page IDs now have machine-checked aliases. The last supplement adds the
required-label pseudo gap, Markdown task-list checkbox margins, empty tree
indentation correction, sticky navigation-fade compensation and editor top-bar
seam. These are source owners/modes or normalization backlog, not new buckets.
The collector activates task lists through the real Preview interaction; the
visible Markdown scene now contains the same checked and unchecked task content.

The shell/demo rows have `capturePolicy: "source-only"`. They preserve exact
semantic-gap dependencies without inventing application workflow specimens.
The collector skips these rows, and the join never reuses old coincidental
matches as evidence for them. An owner map is an ownership partition, not a
strict package partition: the global supplement records the Checkbox atomic
canvas's actual form-package source, while the form map owns its wrapper.
The empty indentation owner alone permits a zero-width visible box, because
that public depth-zero state deliberately has width zero and a negative gap
correction. Pseudo-owner references require generated pseudo content/styles.

## Reproduce

Keep the existing reference Storybook on port 6114 running. From the spec folder:

```powershell
Set-Location 'H:\WSL_dev_projects\pragma\.claude\worktrees\fix-root-gates\specs\022-pragma-spacing-adoption'
$env:SPACING_REFERENCE = 'H:\WSL_dev_projects\pragma\.claude\worktrees\feat-bf-shared-alignment'
node evidence/measure-spacing.cjs
node evidence/measure-variants.cjs
node evidence/build-ledger.cjs
node evidence/verify-evidence.cjs
```

Before browser fixtures are ready, run:

```powershell
node evidence/verify-evidence.cjs --structure-only
```

This checks the current joined model and every existing reference, but
explicitly skips capture freshness and permits declared missing evidence.
It reports `evidenceComplete: false`. The default verifier is strict, including
a comparison of the stored source manifest with the current reference files,
and passes only after both collectors have been rerun against the settled page;
structure-only is not a replacement for that gate.

Node is used because Bun's Playwright transport hangs in this environment;
Bun remains the canonical package manager. No dependencies were installed by
these scripts. `SPACING_REFERENCE` may name the reference worktree explicitly.

The collectors change only disposable browser fixture state, restore mutations,
unmount temporary React roots, and write generated evidence here. They do not
edit component CSS. Source manifests include non-ignored untracked fixture
sources. Verification checks IDs, the current reference source set and hashes,
owner-map hashes, captures and variant target isolation. It also resolves every
declared extra-relationship reference
to an exact tier, collection, capture and matching target; it is not the
mandatory semantic adversarial review.
