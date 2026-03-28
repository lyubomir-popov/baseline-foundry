# Rebuild Plan

## Goal

Ship a lean, versatile design-system foundation centered on:

- real font metrics
- baseline-aligned typography
- element-owned editorial spacing
- explicit grid and layout primitives

This repo is not the place for broad framework parity.

## Scope In

- typography tokens
- prose flow
- spacing rules
- baseline utilities
- section and strip rhythm
- stack, cluster, fixed-width, and grid primitives
- small demo and validation surface

## Scope Out For Now

- broad application component sets
- navigation systems
- feedback components
- tables, forms, and shell chrome as first-class package goals
- large compatibility alias layers

## Principles

1. Baseline alignment is immutable.
2. Editorial spacing is element-owned by default.
3. Layout primitives are explicit and small.
4. Compatibility concerns should not drive the public API here.
5. Additions must earn their place as durable primitives.

## Phases

### Phase 1 - Lean fork

- [x] Replace inherited package identity, docs, and demo with lean-system equivalents
- [x] Reduce the compiled surface to the intended primitives only
- [x] Set the new demo to a separate local port

### Phase 2 - Editorial core

- [x] Establish IBM Plex-based typescale
- [x] Implement prose rhythm for headings, paragraphs, lists, quotes, and rules
- [x] Validate baseline alignment from real font metrics

### Phase 3 - Layout core

- [x] Implement page, section, strip, stack, cluster, and fixed-width primitives
- [x] Implement container-query grid primitives
- [x] Keep the grid versatile enough for both editorial and future app contexts

### Phase 4 - Concept hardening

- [x] Compare against the Canonical spec work and document transferable concepts
- [x] Decide which concepts become core rules versus optional future extensions
- [ ] Add any missing validation needed to protect the baseline invariant

## Current architectural stance

- `portable-vertical-rhythm` remains the compatibility-heavy package.
- `baseline-foundry` is the clean forward line.
- Borrow only the parts of the older package that survive as lean primitives.
- Borrow from the Canonical spec where it sharpens the model, especially around editorial spacing and grid discipline.
- The latest Canonical refresh has already informed three concrete changes here: stronger prose flow-boundary handling, a stricter grid model (`4` / `8` / `16`, power-of-2 spans), and adoption of the Canonical application container thresholds for column-count switches (`620px` and `1681px`).
- `bf-grid` remains the canonical page/layout grid. Legacy `grid-row` / `col-*` now belong to the compact compat layer instead, because downstream inspector parameter matrices need a dense field grid, not the broad `4 / 8 / 16` page-grid behavior.
- The default type preset has been reset from the temporary two-size simplification to the fuller editorial rationale: three size tiers overall, paired heading weights within each tier, and `h5` as bold uppercase with tracking rather than faux small caps.
- The build now ships two first-class defaults instead of one: the prose default at the root `dist/` output, and a compact `panel` preset under `dist/presets/panel/`. The panel preset preserves the same paired-weight logic but scales the system down to a `0.75rem` body so `brand-layout-ops` can be pressure-tested against this repo instead of only against `portable-vertical-rhythm`.
- The panel preset is now genuinely source-of-truth driven instead of "dense by compat CSS accident": `config/foundation-theme.json` and `config/presets/panel.json` both carry a `components` block, the build emits component tokens from it, and the compat layer reads those values for border width, radius, field gaps, control heights, panel padding, accordion indent, inline padding, and visual control size.
- The compat visual treatment has been pulled back toward the known Vanilla / `portable-vertical-rhythm` direction: flatter bottom-border inputs, square dense controls, tighter button sizing, and shell spacing that comes from the panel preset instead of demo-local overrides.
- The panel compat layer now covers a broader and more honest PVR slice: cards, divider blocks, segmented controls, breadcrumbs, pagination, switches, file input, and validation states have all been ported into `baseline-foundry` and exercised in isolated demos rather than being tracked only as abstract parity goals.
- Overlay drawer panels are now part of that compat shell as well: `l-application` can expose a backdrop, `l-aside.is-overlay` / `is-drawer` can sit over the stage instead of resizing it, `p-panel__toggle` provides the lightweight shell control, and `initPanelDrawers` supplies toggle, backdrop, and Escape behavior. The drawer mode has its own saved `drawer-panel` demo and baseline-gated coverage.
- A concrete regression inherited from `portable-vertical-rhythm` has now been corrected here: checkbox/radio glyphs and slider thumbs were previously keyed off the baseline unit, which collapsed them to `4px` in the compact preset. They now use a dedicated visual control size token instead.
- Another inherited compatibility bug has now been corrected here as well: card surfaces were still using uncompensated top padding, which left the whole card body 1px off the baseline rhythm. Cards now compensate their top padding the same way the rest of the dense panel surfaces do.
- Live inspection also pushed the compact panel preset one step denser-but-safer: standard controls now use `1.75rem` block size and dense controls use `1.5rem`, which gives tabs, accordion rows, checkboxes/radios, and text inputs one extra baseline unit of breathing room without leaving the PVR/Vanilla density band.
- Narrow-container resilience is now part of the compact preset contract: text-like fields, file inputs, search wrappers, and slider pairs no longer enforce hard minimum inline sizes, slider pairs can wrap instead of overlapping, and shared media stays fluid with `max-inline-size: 100%`.
- Runtime font loading now lives in generated CSS instead of the demo shell: `config/foundation-theme.json` can describe runtime font-face metadata, the build strips runtime-only entries before baseline token generation, and `dist/styles.css` emits the matching `@font-face` rules for IBM Plex Sans Variable in the current confirmation pass.
- Runtime font-face paths are now rewritten per output directory, so preset builds under `dist/presets/` keep working `@font-face` URLs instead of inheriting root-relative asset paths accidentally.
- The core Foundry tone system now responds to `data-bf-tone` as well, not just the compat layer. That fixes a real mismatch where the prose demo background stayed light while the compat-driven text had already gone dark-mode.
- The live root demos now also paint `body` directly from the Foundry theme variables and use a fresh cache-busted stylesheet key, because a stale-browser report showed that relying on the generated class background alone was not enough to make the live `4174` demo trustworthy during rapid iteration.
- Typography rule generation is now driven by `roles` in `foundation-theme.json` instead of a hardcoded role list. If `lead`, `eyebrow`, or `meta` are not present, the build does not emit them; if additional roles are present, utility classes are emitted for them automatically. Semantic prose selectors are still layered only onto the standard role names that exist (`body`, `h1`-`h6`, `meta` for `figcaption`).
- Strip rhythm now follows the spacing-spec bottom-only rule: `bf-strip` carries block-end separation instead of symmetric block padding, leaving entry spacing to the preceding context and the strip's own contents.
- Visual QA now includes isolated component demo pages plus Playwright screenshot capture, borrowed from `portable-vertical-rhythm` but narrowed to the primitives this repo actually owns: typography, prose, layout, and grid.
- Those component demos now also declare their rhythm-critical specimens explicitly, and Playwright verifies them in-browser as part of `npm test` rather than leaving screenshot review entirely manual.
- The component demo index is now a real atlas page rather than a bare link list, so the repo has a visible coverage snapshot for what has already been ported from PVR and what remains intentionally out of scope for now. It now acts as the single visual index for every baseline-gated page.
- The demos now default to the dark theme, the baseline grid is hidden until explicitly toggled on, and section labels are rendered as real `h5` headings instead of demo-local kicker paragraphs. That keeps inspection honest and ties the demo chrome back to the JSON-driven type system.
- The grouped control and surface overview pages are no longer the primary inspection units. The baseline gate now runs against one saved HTML file per component family, so buttons, inputs, selects, checkboxes, radios, range pairs, file input, validation states, switches, tabs, accordion, modal, segmented control, breadcrumbs, pagination, divider, and cards can each be checked on their own.
- The former preview slice has now been cleaned up and promoted into the automated baseline gate: chips, badges, status labels, tables, search box, and search-and-filter all have dedicated saved demo pages and green browser-enforced baseline checks.
- The next parity slice has started moving past pure form/data surfaces: list-tree, contextual-menu, tooltip, and code-snippet now have their own runtime modules, generated CSS, saved component pages, and baseline-gated demos instead of existing only in `portable-vertical-rhythm`.
- The pressure-test demos now deliberately split by preset: the `brand-layout-ops` style panel surface uses the compact `panel` preset, while the future portfolio/editorial surface stays on the prose default. Both pass the same baseline gate as the lower-level demos.
- There is now a dedicated narrow-panel regression surface in `demo/components/narrow-panel.html`, and the browser gate checks container overflow there in addition to baseline alignment so shrink/wrap behavior stays honest in tight inspector rails.
- There is now a dedicated parameter-matrix regression surface in `demo/components/parameter-matrix.html`, and it is baseline-gated specifically to protect the dense downstream `grid-row` / `col-*` / `slider-pair--stacked` control pattern from collapsing again in narrow inspector rails.
- The pulled `brand-layout-ops` sample page now participates in QA only at the shell level. The dedicated `controls` page owns the low-level form/tab/accordion assertions, so the sample page stays useful as a downstream layout reference without becoming a second component-test matrix.
- The new `surfaces-navigation` page owns the newly ported navigation-adjacent and surface primitives, so those PVR borrowings now live under the same browser-enforced baseline gate as the older control and shell work.
- The widened grid demo shell and larger Playwright viewport keep 16-column behavior under test even after the Canonical thresholds moved the widest bracket out to `1681px`.
- The next high-value borrow area is now the remaining downstream-specific utility or parity families beyond the drawer pass, plus any spacing invariants that still need to be promoted into stronger repo-level validation.
