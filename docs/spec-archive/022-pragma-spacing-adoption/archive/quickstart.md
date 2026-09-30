# Quickstart: Pragma spacing-model adoption QA

## Planning review

Confirm the implementation target before code starts:

```powershell
git -C H:\WSL_dev_projects\pragma status --short --branch
git -C H:\WSL_dev_projects\pragma rev-parse HEAD
bun pm view @canonical/design-tokens version
```

Expected audited Pragma base: `7193fe082`. Re-fetch before opening the future
worktree and update the recorded base if `origin/main` advances.

## Focused implementation checks

Use Bun and the affected package's own `check`/`test` scripts. Do not run
`npm install` in Pragma and do not create a repository-global workflow for one
package. While iterating, cover at least:

- provider import order and the exact scoped 3 x 12 computed matrix;
- exact typography dimensions and the product body role inherited by every
  non-heading component;
- the shared CSS `1cap` alignment contract, its authenticated font/provider
  inputs, and role inheritance after the production face is loaded;
- zero-tie, first-baseline, painted-block and occupied-block measurements;
- automatic block size for fields, buttons and navigation rows;
- Field/Action/Continuation starts, mark gaps and surface insets in LTR/RTL;
- removal of global target-cell density and immunity of unrelated descendants;
  and
- a debug-grid step equal to the active product baseline.

## Shared-alignment correction checks

Before editing, capture the complete inventory from the Pragma worktree and BF:

```powershell
rg -n --glob '*.css' --glob '*.ts' --glob '*.tsx' --glob '*.svelte' '1cap|0\.0775rem|0\.41rem' packages
rg -n --glob '!dist/**' --glob '!node_modules/**' '1cap' H:\WSL_dev_projects\baseline-foundry
```

Do not use raw search count as the exit gate. Classify each result by production
import reachability and data flow. The Pragma production path must have exactly
one shared CSS `1cap` alignment owner; component-local cap formulas, copied
nudge literals and cap-derived browser oracles are migration defects. BF's
generated metric engine remains a BF-only production contract, and BF's named
engine-comparison demo is not a Pragma acceptance oracle. Historical generator
work and its green matrices are comparison evidence only; they do not establish
acceptance for the revised Pragma contract.

From `packages/styles/typography`, the implemented package must provide:

```powershell
bun run check:authentication
bun run check
bun run test
```

`check:authentication` verifies the loaded font, provider inputs and their
recorded digests. It does not generate nudge constants: the shared CSS formula
follows the authenticated face at consumption time, including headings.

For browser evidence, use a zero-size inline baseline marker. The marker's
coordinate is measured directly after `document.fonts.ready`; expected geometry
is derived independently from the active product grid and the shared ledger,
not from cap height or a duplicated component formula.

The final static report must show:

- exactly one production/import-reachable shared `1cap` alignment owner, with
  zero component-owned `1cap` baseline or occupied-block uses;
- zero component-owned `0.0775rem`/`0.41rem` nudge copies;
- zero cap-derived baseline oracle calculations;
- all twelve inventoried component ledgers consuming the shared semantic nudge;
  and
- every remaining `1cap` occurrence assigned to the reviewed demo or icon-
  optics categories in the durable inventory.

Run the automated browser geometry suite in Chromium, Firefox and WebKit at
16px/18px roots and DPR 1/2. Wait for production fonts before measuring. The
suite must run from an affected package test command. Playwright
`deviceScaleFactor` supplies DPR/raster coverage; it is not browser-native zoom.

T012 separately requires an approved interactive/manual protocol for genuine
native 100%/125%/150% browser zoom. That pass remains outstanding and MUST NOT
be claimed from the automated DPR matrix or a diagnostic display-scale analogue.

## Repository gates

From the Pragma repository root, after focused checks are green:

```powershell
bun run check
bun run test
bun run build
```

Review affected Storybook/Chromatic routes for Site, Docs and App. Record the
authenticated Pragma font/provider provenance, exact package commands and
measurement output in the eventual Pragma PR. BF's generator provenance is
recorded separately in BF evidence; it is not a Pragma dependency.

## React pilot alignment review

Start with the two primary labs, not the component atlas. For the stable
Storybook on port 6114, the explicit light-mode meeting routes are:

```text
http://localhost:6114/?path=/story/documentation-examples-spacing-audit--horizontal-guides&globals=baseline:!false;baselineFoundry:!true;context:site;scheme:light
http://localhost:6114/?path=/story/documentation-examples-spacing-audit--vertical-guides&globals=baseline:!false;baselineFoundry:!true;context:site;scheme:light
```

Use the horizontal lab to compare inline keylines and marker centres, and the
vertical lab to compare occupied starts/ends and intrinsic growth. Switch Site,
Docs and App from the toolbar without losing the explicit light scheme. Review
the 143-row React atlas afterward as the secondary source/state/runtime
reference; it does not replace part-level spacing evidence.

Read the controls and guides consistently:

- the existing orange overlay is the developer's whole-page stepped baseline
  grid;
- the independent thin pink overlay is BF's quieter whole-page baseline grid;
- in horizontal component evidence, red is the real outside/logical-start
  reference and blue is the real content or text keyline; marker-led cases also
  expose the actual marker centre;
- in vertical component evidence, red is the occupied start and blue is the
  occupied end, including governed trailing compensation; and
- for active borders, bars and other zero-layout paint, compare both states and
  require unchanged outer and content geometry.

The orange and pink overlays are review aids. They do not replace red/blue
guides attached to real component parts.

Before lead review, reconcile the lab witnesses against the typed coverage map:
exactly 142 production renderers, 130 included in the seven closed geometry
families as visual renderers and 12 named exclusions. Heading, Tokens and
Typography are separate story-only references. Every spacing-owning part of a composite needs a live
production witness. A locally styled lookalike is not production evidence.
Record renderer reconciliation and part-witness completion separately: the
first can be green while the second is incomplete. Macro application layouts
remain outside the comparable component families and require a separate route
before any page-layout approval claim.

Run Axe against the primary story iframes with both baseline overlays off:
`baseline:!false;baselineFoundry:!false`, plus `scheme:light`. Fail the gate for
completed violations and for incomplete colour-contrast results. Hard-coded
light WIP surfaces that fail under dark/system-dark foregrounds remain a
separate blocker. The explicit-light meeting route avoids that failure but must
not be described as fixing it.

No publish, release or merge is part of this quickstart.
