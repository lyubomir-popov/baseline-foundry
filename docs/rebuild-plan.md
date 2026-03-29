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
2. Baseline compensation and semantic spacing are separate responsibilities.
3. Editorial spacing is element-owned by default.
4. Layout primitives are explicit and small.
5. Compatibility concerns should not drive the public API here.
6. Additions must earn their place as durable primitives.

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

### Phase 5 - Tier and engine refactor

- [ ] Promote editorial and app modes to equal first-class runtime tiers rather than treating the compact panel build as an override of the prose default
- [ ] Split tier choice from baseline engine choice so `.bf-tier-*` and `.bf-engine-*` can switch independently at the top level
- [ ] Keep baseline compensation and baseline alignment element-owned in every tier, including app-tier text-bearing controls and components, while semantic spacing becomes tier-selected (`editorial` role-owned, `app` zeroed + container gaps)
- [ ] Evaluate whether the `pragma` cap-unit approach actually simplifies baseline-aligned text in container-owned app layouts; treat it as a possible simplification path for keeping app-tier baseline fidelity, not as a license to drop baseline alignment there
- [x] Collapse the temporary `bf-control-grid` helper back into `bf-grid` recipes so both page regions and narrow panels resolve to the same spec `4 / 8 / 16` column contexts from container width alone
- [x] Make the grid tier-aware so editorial keeps the rewrite's wider large/x-large gutters while app keeps the denser application gutter values
- [ ] Migrate text-bearing components so their internal baseline compensation follows the selected engine instead of relying on ad hoc control-height math alone
- [ ] Extend validation so the screenshot gate and build checks cover the new tier and engine contract before any default flips

## Current architectural stance

- `portable-vertical-rhythm` remains the compatibility-heavy package.
- `baseline-foundry` is the clean forward line.
- Borrow only the parts of the older package that survive as lean primitives.
- Borrow from the Canonical spec where it sharpens the model, especially around editorial spacing and grid discipline.
- The latest Canonical refresh has already informed three concrete changes here: stronger prose flow-boundary handling, a stricter grid model (`4` / `8` / `16`, power-of-2 spans), and adoption of the Canonical application container thresholds for column-count switches (`620px` and `1681px`).
- The latest grid rewrite now directly governs spacing in the grid layer too: container queries decide only the column count, while viewport breakpoints decide gutters and outer margins. The generated grid now follows that split directly: default/editorial surfaces step up to `32px` gutters at large/x-large, while `.bf-tier-app` keeps the denser `24px` gutter there and shares the same `32px` outer margin.
- For Foundry's purposes, the meaningful seam is editorial vs app. Documentation can ride the editorial side for now instead of becoming a separate implementation track.
- Foundry intentionally keeps baseline alignment in the app tier. The Canonical spec work had to accommodate stakeholders who preferred simpler application guidance, but this repo is explicitly choosing the more sophisticated path: app layouts use container-owned semantic spacing, while text-bearing controls and components still stay baseline-aligned. There is no conflict between those rules: a `bf-stack` or similar layout container can own a semantic gap, while each child still uses engine-selected nudges or cap-based alignment to land its own text and control box on the baseline grid.
- `bf-grid` is the only grid primitive now. Dense inspector rows and parameter matrices ride a `bf-grid--controls` recipe with control-span modifiers rather than preserving a second canonical grid surface.
- The stage-centering shell question is now resolved upstream too: `bf-stage-shell` is the tiny canonical helper for centering a bounded preview/stage surface inside `l-main`, so the downstream sample no longer needs a local `viewer-panel__content` layout class just to center a fixed-width stage.
- The default type preset has been reset from the temporary two-size simplification to the fuller editorial rationale: three size tiers overall, paired heading weights within each tier, and `h5` as bold uppercase with tracking rather than faux small caps.
- The build now ships two first-class defaults instead of one: the prose default at the root `dist/` output, and a compact `panel` preset under `dist/presets/panel/`. The panel preset preserves the same paired-weight logic but scales the system down to a `0.75rem` body so `brand-layout-ops` can be pressure-tested against this repo instead of only against `portable-vertical-rhythm`.
- The panel preset is now genuinely source-of-truth driven instead of "dense by compat CSS accident": `config/foundation-theme.json` and `config/presets/panel.json` both carry a `components` block, the build emits component tokens from it, and the compat layer reads those values for border width, radius, field gaps, control heights, panel padding, accordion indent, inline padding, and visual control size.
- The compat visual treatment has been pulled back toward the known Vanilla / `portable-vertical-rhythm` direction: flatter bottom-border inputs, square dense controls, tighter button sizing, and shell spacing that comes from the panel preset instead of demo-local overrides.
- The panel compat layer now covers a broader and more honest PVR slice: cards, divider blocks, segmented controls, breadcrumbs, pagination, switches, file input, and validation states have all been ported into `baseline-foundry` and exercised in isolated demos rather than being tracked only as abstract parity goals.
- The next downstream panel tranche is now upstream too: equal-width dense panel tabs, selectable preset/output rows, and style/mapping palette cards all have canonical package-side selectors, and the demos now exercise only those selectors rather than preserving downstream aliases.
- Overlay drawer panels are now part of that compat shell as well: `l-application` can expose a backdrop, `l-aside.is-overlay` / `is-drawer` can sit over the stage instead of resizing it, `p-panel__toggle` provides the lightweight shell control, and `initPanelDrawers` supplies toggle, backdrop, and Escape behavior. The drawer geometry has now been corrected so the overlay spans the full shell height and reads like a real right-edge temporary inspector rather than collapsing into the zero-height `aside` track. The drawer mode has its own saved `drawer-panel` demo plus Playwright behavior coverage for edge attachment, toggle state, and backdrop close.
- Pinned desktop asides are now resizable upstream as well: `l-application__aside-resize-handle` has package-side visuals, the shell exposes Canonical width tokens for small/medium/large drawers plus explicit pinned min/max bounds, and `initResizableAsides` now provides drag, keyboard resizing, double-click reset, persistence, and ARIA updates instead of leaving that logic in downstream app CSS/JS.
- A concrete regression inherited from `portable-vertical-rhythm` has now been corrected here: checkbox/radio glyphs and slider thumbs were previously keyed off the baseline unit, which collapsed them to `4px` in the compact preset. They now use a dedicated visual control size token instead.
- Another inherited compatibility bug has now been corrected here as well: card surfaces were still using uncompensated top padding, which left the whole card body 1px off the baseline rhythm. Cards now compensate their top padding the same way the rest of the dense panel surfaces do.
- Live inspection also pushed the compact panel preset one step denser-but-safer: standard controls now use `1.75rem` block size and dense controls use `1.5rem`, which gives tabs, accordion rows, checkboxes/radios, and text inputs one extra baseline unit of breathing room without leaving the PVR/Vanilla density band.
- Narrow-container resilience is now part of the compact preset contract: text-like fields, file inputs, search wrappers, and slider pairs no longer enforce hard minimum inline sizes, slider pairs can wrap instead of overlapping, and shared media stays fluid with `max-inline-size: 100%`.
- Runtime font loading now lives in generated CSS instead of the demo shell: `config/foundation-theme.json` can describe runtime font-face metadata, the build strips runtime-only entries before baseline token generation, and `dist/styles.css` emits the matching `@font-face` rules for IBM Plex Sans Variable in the current confirmation pass.
- Runtime font-face paths are now rewritten per output directory, so preset builds under `dist/presets/` keep working `@font-face` URLs instead of inheriting root-relative asset paths accidentally.
- The core Foundry tone system now responds to `data-bf-tone` as well, not just the compat layer. That fixes a real mismatch where the prose demo background stayed light while the compat-driven text had already gone dark-mode.
- The live root demos now also paint `body` directly from the Foundry theme variables and use a fresh cache-busted stylesheet key, because a stale-browser report showed that relying on the generated class background alone was not enough to make the live `4174` demo trustworthy during rapid iteration.
- Interactive controls now follow `:focus-visible` discipline more consistently: visible focus rings and focus-state wrappers are reserved for keyboard-style focus, while mouse focus no longer triggers the same outlines on buttons, tabs, choice rows, menus, pagination, or form fields.
- Typography rule generation is now driven by `roles` in `foundation-theme.json` instead of a hardcoded role list. If `lead`, `eyebrow`, or `meta` are not present, the build does not emit them; if additional roles are present, utility classes are emitted for them automatically. Semantic prose selectors are still layered only onto the standard role names that exist (`body`, `h1`-`h6`, `meta` for `figcaption`).
- Strip rhythm now follows the spacing-spec bottom-only rule: `bf-strip` carries block-end separation instead of symmetric block padding, leaving entry spacing to the preceding context and the strip's own contents.
- Visual QA now includes isolated component demo pages plus Playwright screenshot capture, borrowed from `portable-vertical-rhythm` but narrowed to the primitives this repo actually owns: typography, prose, layout, and grid.
- Those component demos now also declare their rhythm-critical specimens explicitly, and Playwright verifies them in-browser as part of `npm test` rather than leaving screenshot review entirely manual.
- The component demo index is now a real visual atlas rather than a bare link list, so the repo has a visible coverage snapshot for what has already been ported from PVR and what remains intentionally out of scope for now. Playwright captures each saved component page, and the atlas turns those captures into linked preview tiles so the surface can be scanned quickly before opening an individual demo.
- The visual atlas is no longer based on full-window demo crops for every page. Atomic control pages now use a fitted capture profile that clips to the real specimen footprint, while layout, shell, and pressure-test pages keep a wider capture profile so context stays legible. The atlas frames use contained previews instead of `cover`, which makes the saved component surface much more useful as an actual scan view.
- The demos now default to the dark theme, the baseline grid is hidden until explicitly toggled on, and section labels are rendered as real `h5` headings instead of demo-local kicker paragraphs. That keeps inspection honest and ties the demo chrome back to the JSON-driven type system.
- The grouped control and surface overview pages are no longer the primary inspection units. The baseline gate now runs against one saved HTML file per component family, so buttons, inputs, selects, checkboxes, radios, range pairs, file input, validation states, switches, tabs, accordion, modal, segmented control, breadcrumbs, pagination, divider, and cards can each be checked on their own.
- The former preview slice has now been cleaned up and promoted into the automated baseline gate: chips, badges, status labels, tables, search box, and search-and-filter all have dedicated saved demo pages and green browser-enforced baseline checks.
- The next parity slice has started moving past pure form/data surfaces: list-tree, contextual-menu, tooltip, and code-snippet now have their own runtime modules, generated CSS, saved component pages, and baseline-gated demos instead of existing only in `portable-vertical-rhythm`.
- The pressure-test demos now deliberately split by preset: the `brand-layout-ops` style panel surface uses the compact `panel` preset, while the future portfolio/editorial surface stays on the prose default. Both pass the same baseline gate as the lower-level demos.
- There is now a dedicated narrow-panel regression surface in `demo/components/narrow-panel.html`, and the browser gate checks container overflow there in addition to baseline alignment so shrink/wrap behavior stays honest in tight inspector rails.
- There is now a dedicated parameter-matrix regression surface in `demo/components/parameter-matrix.html`, and it is baseline-gated specifically to protect the canonical dense control-grid plus stacked slider-wrapper pattern in narrow inspector rails.
- The pulled `brand-layout-ops` sample page now participates in QA only at the shell level. The dedicated `controls` page owns the low-level form/tab/accordion assertions, so the sample page stays useful as a downstream layout reference without becoming a second component-test matrix.
- The downstream style audit now has a sharper boundary: drawer and pinned-aside resize behavior are replaceable now from `baseline-foundry`, and the former "missing" dense panel slice is upstream too as canonical package markup: equal-width dense tabs, choice rows, option cards, tight help-text modifiers, compact color input sizing, inline option strips, fill-height panel behavior, checkbox-field density handling, and dense action-row overflow helpers are all shipped package-side.
- The new `surfaces-navigation` page owns the newly ported navigation-adjacent and surface primitives, so those PVR borrowings now live under the same browser-enforced baseline gate as the older control and shell work.
- Browser QA now checks behavior as well as rhythm: `npm test` includes Playwright coverage for pinned-aside resize flow and overlay-drawer attachment/toggle behavior, so the shell cannot silently lose drag, keyboard, reset, persistence, or visible temporary-inspector geometry while the CSS still looks plausible.
- The sequencing for presets is now explicit: achieve real component parity and downstream confidence under the compact panel preset first, then bring the same component surface to parity under the prose/default preset, and only after that decide whether preset switching belongs to stylesheet swaps, multi-preset bundles, or scoped runtime attributes.
- That sequencing is now being superseded by a more explicit runtime model: the next refactor should turn the prose and app surfaces into equal first-class tiers, expose them through top-level classes rather than asymmetric preset semantics, and let a separate baseline-engine flag choose between metrics-derived nudges and the cap-unit engine.
- The current rollout rule is strict: the metrics engine remains the default until the cap-unit engine survives the same baseline screenshot gate and downstream pressure tests and proves it actually simplifies the app-tier model instead of just moving the same complexity around. The baseline invariant is the acceptance test, not a preference.
- The core architectural split for that refactor is now explicit too: baseline compensation stays element-owned for every text-bearing element and component in both tiers, including app-tier controls, while semantic spacing becomes a tier policy. Editorial keeps role-owned `spaceAfter`; app tier zeros semantic spacing and expects container-owned gaps.
- The first compat tranche has landed under that model: role-level selected nudge variables now feed actual text-entry and action controls such as inputs, file controls, buttons, tabs, segmented controls, pagination, search/filter controls, tooltip text, accordion tabs, and the panel toggle.
- That same pass also exposed a boundary that should stay explicit in the plan: row-style surfaces measured as centered boxes, such as tables, list-tree rows, and chips, did not tolerate the new control primitive cleanly and were reverted to their older centered math. They need a second primitive or an explicit exemption, not another round of ad hoc forcing.
- The widened grid demo shell and larger Playwright viewport keep 16-column behavior under test even after the Canonical thresholds moved the widest bracket out to `1681px`.
- The grid demo itself no longer hides behind a demo-local gap declaration; the visible spacing now comes from the generated Foundry grid so gutter regressions show up immediately in the demo and screenshot flow.
- The grid layer itself now ships the editorial/app gutter split at large breakpoints, and build validation checks that default/editorial surfaces widen to `2rem` while `.bf-tier-app` holds the denser `1.5rem` gutter.
- Dense panel recipes no longer depend on a separate `bf-control-grid` primitive: the saved demos and browser gate now exercise `bf-grid bf-grid--controls`, with recipe-specific item spans carrying the inspector layout behavior.
- The next high-value borrow area is now the real downstream swap test itself plus any final spacing invariants that still need to be promoted into stronger repo-level validation.
