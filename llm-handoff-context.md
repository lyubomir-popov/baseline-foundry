# LLM Handoff Context

## Repo orientation

| Role | Path |
|------|------|
| Primary | `C:\Users\lyubo\work\repos\baseline-foundry` |
| Reference compatibility package | `C:\Users\lyubo\work\repos\portable-vertical-rhythm` |
| Canonical design spec reference | `C:\Users\lyubo\work\repos\canonical-specs` |
| Type-scale reference | `C:\Users\lyubo\work\repos\docs-typescale` |

## Quick start

```bash
npm install
npm run setup:demo-font
npm run playwright:install
npm run build
npm run test
npm run demo
```

Demo URL:

- `http://127.0.0.1:4174/demo/`
- `http://127.0.0.1:4174/demo/panel.html`

## Current state (updated 2026-03-28)

This repo is the clean sibling to `portable-vertical-rhythm`. It keeps the metric-driven baseline pipeline but narrows the scope to typography, editorial flow, spacing, and grid primitives. The working name is `baseline-foundry`. The default root build remains IBM Plex Sans-based and editorial-first: prose elements own their own vertical spacing, prose flow boundaries keep baseline compensation on the last child, prose lists use semantic list-container spacing without double-applying compensation, rules compensate their `1px` thickness against the baseline rather than drifting by a pixel, and strip/container rhythm sits on the block end only instead of using symmetric top-and-bottom padding. Layout structure is handled by a small set of explicit primitives (`bf-page`, `bf-section`, `bf-strip`, `bf-stack`, `bf-cluster`, `bf-grid`). The broad page/layout grid is now intentionally separate from the downstream control-matrix aliases: `bf-grid` remains the canonical layout primitive, while legacy `grid-row` / `col-*` are owned by the compact compat layer so narrow inspector rails stop inheriting the broad `4 / 8 / 16` page-grid behavior. The repo now ships two built-in defaults instead of one: the root prose preset in `dist/styles.css` / `dist/tokens.json`, and a compact panel preset in `dist/presets/panel/` that scales the same three-tier paired-weight system down to a `0.75rem` body with adjusted line heights and tighter layout rhythm for dense control surfaces. That compact preset is now driven by a proper `components` block in the theme JSON, modeled on `portable-vertical-rhythm`, so control height, dense control height, panel padding, field gaps, accordion indent, border width, radius, inline padding, and the new visual control size all come from the source of truth instead of being hardcoded inside the compat CSS layer. The panel control heights were then bumped by one extra baseline unit after live inspection: the preset now uses `1.75rem` standard controls and `1.5rem` dense controls so text fields, tabs, accordion rows, and checkbox/radio labels stop visually crashing into whatever follows. The visual control size token fixes an inherited PVR regression where checkbox squares, radio dots, and slider thumbs were incorrectly tied to the baseline unit itself; in the compact preset that collapsed them to `4px`. The compat layer itself has been pulled back toward the established Vanilla/PVR visual direction: flatter bottom-border inputs and selects, square control corners, tighter dense buttons, panel-shell spacing that reads from the preset tokens rather than demo-local guesses, correctly sized selection/thumb glyphs that stay compact without becoming microscopic, a dedicated `grid-row` / `slider-pair--stacked` compatibility surface that now matches the dense parameter matrix used by `brand-layout-ops`, a newly ported `code-snippet` surface with copy support and baseline-gated demo coverage, a proper overlay drawer-panel mode for temporary inspectors, a real pinned-aside resize system upstreamed from the downstream app, and now the next missing downstream panel patterns as first-class package styles: equal-width dense panel tabs, selectable radio-row cards, style/mapping option cards, tight helper text, compact color inputs, the inline operator-selector strip, dense action rows, a fill-height panel helper, and checkbox-field density rules that no longer need app-local overrides. That shell behavior now lives in the same vocabulary as the drawer: `l-application` can expose a backdrop, `l-aside.is-overlay` / `is-drawer` sit over the stage instead of resizing it, `p-panel__toggle` provides the lightweight open/close control, `initPanelDrawers` wires toggle, backdrop, and Escape behavior, and the new `initResizableAsides` runtime handles drag, keyboard resizing, double-click reset, width persistence, and ARIA values for pinned desktop inspectors. The new component port is package-side, not demo-local: equal-width tabs are available through canonical `p-tabs--equal` / `bf-tabs--equal` and the legacy downstream `config-tabs` / `output-profile-tabs` aliases, selectable rows are now covered by canonical `p-choice-row` / `bf-choice-row` and the downstream `preset-radio-row` alias, palette/status cards are now covered by canonical `p-option-grid` / `p-option-card` and the downstream `style-palette` / `style-palette__button` aliases, tight helper text is available through `.p-form-help-text.is-tight` / `.bf-form-help.is-tight` and the downstream `control-help` alias, compact color fields are available through `.p-color-input` / `.bf-color-input` and the downstream `control-color` alias, operator strips are covered by canonical `.p-inline-options` / `.bf-inline-options` and the downstream `operator-selector` aliases, action rows are covered by `.p-actions` / `.bf-actions` and the downstream `playback-export-actions` / `main-actions` aliases, and fill-height panel shells are covered by `.p-panel.is-fill` / `.bf-panel.is-fill` and the downstream `drawer-panel` alias. Narrow-container hardening is now part of that pass too: text-like inputs, file inputs, search wrappers, and slider pairs now shrink or wrap cleanly instead of enforcing hard minimum inline sizes, shared media is fluid by default, and dedicated `demo/components/narrow-panel.html` and `demo/components/parameter-matrix.html` regression pages are baseline-gated so tight inspector content and dense multi-field rows stay inside their rail without baseline drift. `h5` is now bold uppercase with tracking rather than faux small caps across both presets, and the component demos now use real `h5` markup for their section labels instead of fake kicker paragraphs. The core Foundry color tokens now also respond to `data-bf-tone`, so the prose demo and any other `bf-theme` surface actually switch background, text, muted text, rules, and accent colors in dark mode instead of only inheriting the compat layer's foreground overrides. The root prose and panel demos now also paint `body` directly from those theme variables, and the visible baseline-grid toggle is working reliably in the live `4174` demo after the grid-color cascade and demo-module cache issues were fixed. Typography utilities still follow the JSON config directly: classes are emitted by iterating `roles` from `foundation-theme.json` / preset configs, and optional aliases like `lead`, `eyebrow`, and `meta` are not synthesized when absent. Standard prose element selectors (`p`, `h1`-`h6`, `figcaption`) are only attached when their matching role names exist. The grid keeps the `4 / 8 / 16` power-of-2 span model, and its column-count thresholds now follow the current Canonical app-grid spec directly: 4 columns below `620px`, 8 columns from `620px`, and 16 columns from `1681px`. The intermediate Canonical `1036px` split still matters conceptually as a future 8-column layout bracket, but it is not yet encoded as a separate CSS switch because the column count does not change there. The current metric source uses IBM's official Plex Sans variable Roman file, `npm run setup:demo-font` downloads the official Roman and Italic variable assets from IBM's repo, and generated CSS now rewrites `@font-face` URLs correctly for both the root default and preset output directories so none of the demos fall through to Segoe when the cache-busted stylesheet URLs are used. Visual QA includes isolated component demo pages (`demo/components/`), a visual atlas at `demo/components/index.html`, screenshot capture output in `tmp/screenshots/components/`, an automated Playwright baseline report in `tmp/screenshots/components/baseline-report.json`, and a Playwright behavior check for pinned-aside resizing. All demos now default to the dark theme, and the baseline grid toggle starts off unchecked so it behaves like an actual inspection aid instead of looking permanently stuck on. The atlas page is now the single visual index for every baseline-gated demo file: Playwright captures each component page, and the atlas turns those captures into linked preview tiles so the shipped surface can be scanned quickly before drilling into individual pages. The gate itself now runs against one saved HTML file per component family instead of checking grouped control overviews. Buttons, actions rows, text inputs, color inputs, selects, checkboxes, radios, range pairs, file input, validation states, switches, chips, badges, status labels, tables, search box, search-and-filter, code-snippet, list-tree, tabs, panel-tabs, accordion, modal, choice-row, inline-options, segmented control, breadcrumbs, pagination, contextual menu, tooltip, divider, cards, option-card, and the drawer-panel shell each have their own dedicated page and now participate in the browser-enforced baseline gate. The older grouped `controls` and `surfaces-navigation` pages still exist, but only as convenience overviews rather than as the primary inspection units. Those demos include realistic pressure-test surfaces in addition to the atomic specimens: a `brand-layout-ops` style panel composition using the new compact preset, a deliberately narrow panel rail for overflow regression, a dedicated dense parameter-matrix regression page, an overlay drawer-panel shell page, and a future portfolio/editorial composition using the prose default. They also include a read-only `brand-layout-ops` shell sample page copied from the downstream app's actual layout structure so future work can compare against a faithful stage-and-inspector scaffold here without touching that repo; that sample now uses the same pinned-aside resize behavior so downstream shell swaps can be rehearsed here first. The pulled `brand-layout-ops` sample is checked only at the shell level so low-level control QA stays concentrated in the dedicated component pages. The component demos declare the specific specimens that should sit on the rhythm, `npm run verify:components` checks them in-browser, `npm run screenshots:components` refreshes the saved preview tiles used by the atlas, and `npm test` now includes both the baseline verification gate and the pinned-aside behavior verification. The current sequencing is intentional: panel parity comes first, because that is what `brand-layout-ops` needs now. Once the shared component surface reaches parity there, the next parity phase is to make the prose/default preset equally trustworthy across the same component set and then decide whether preset switching should happen by stylesheet swap or by scoped runtime attributes such as `data-bf-preset`. The grid demo shell now widens enough for Playwright to exercise the 16-column bracket under the Canonical thresholds. `npm run build`, `npm test`, and `npm run qa:components` pass, the demo is live on port `4174`, and the Canonical comparison note has been refreshed against the latest `canonical-specs` snapshot (`142bd4e` on 2026-03-28).

## Current sprint TODO

- [x] Finish the initial lean public surface and verify the new build only ships typography, spacing, grid, and baseline utilities
- [x] Download IBM Plex demo font assets and confirm generated tokens use them successfully
- [x] Establish the first IBM Plex editorial/prose typescale and measure defaults
- [x] Verify the demo on port `4174` and keep it visually focused on prose rhythm and grid rather than app-shell components
- [x] Write the Canonical-spec comparison note and identify which concepts should transfer into this repo
- [x] Decide whether the current `4 / 8 / 12` grid should become a stricter `4 / 8 / 16` grid with power-of-2 spans for future app-facing use
- [x] Add explicit flow-boundary handling for prose, including last-child reset and possibly precision baseline compensation
- [x] Pressure-test the typescale, measure, and grid defaults against real `brand-layout-ops` content and future portfolio/editorial layouts
- [x] Decide whether the current `4 / 8 / 16` grid breakpoints should stay simple or move closer to the exact Canonical app-grid thresholds later
- [x] Decide whether to add a second preset later or keep one strong default until real reuse pressure appears
- [x] Add stronger regression checks around baseline/nudge behavior if the token model or preset count expands
- [x] Turn component screenshots into a browser-enforced baseline verification gate
- [x] Decide whether runtime CSS should also emit `@font-face` rules so the demo definitely uses the downloaded IBM Plex variable assets rather than relying on local installation or fallback
- [x] Add isolated component demos and Playwright screenshot capture for typography, prose, layout, and grid baseline QA
- [x] Move the dense panel preset's control sizing and spacing into a dedicated JSON source-of-truth block instead of hardcoded compat CSS
- [x] Pull the panel controls back toward the established Vanilla/PVR visual style while keeping the baseline gate green
- [x] Add a real component atlas page and port the next panel-relevant PVR families into isolated baseline-gated demos
- [x] Make the component demos honest inspection surfaces: dark by default, real `h5` section labels, atlas coverage for every baseline-gated page, and a baseline-grid toggle that starts off hidden
- [x] Add one more baseline unit of vertical breathing room to the compact panel controls after live downstream-style inspection
- [x] Split the grouped panel component demos into one saved HTML file per component family and make the atlas a direct index of those baseline-gated files
- [x] Fix the core Foundry dark theme so prose/background colors switch properly outside the compat layer
- [x] Add the next per-component preview pages for data-display and query/search (`chip`, `badge`, `status-label`, `table`, `search-box`, `search-and-filter`)
- [ ] Pressure-test a real `brand-layout-ops` surface against `dist/presets/panel/styles.css` and record any remaining swap blockers versus `portable-vertical-rhythm`
- [x] Port the strongest remaining downstream-specific no-analog patterns called out in `docs/brand-layout-ops-styles-replacement-report.md`, especially equal-width dense tabs, preset radio rows, and style palette cards
- [ ] Decide whether the panel preset's current compact rhythm is close enough to downstream use, or whether its gaps should move tighter toward current `portable-vertical-rhythm` app density after the first integration pass
- [x] Finish the rhythm cleanup for the newly ported `chip`, `badge`, `status-label`, `table`, `search-box`, and `search-and-filter` pages, then promote them into the automated baseline gate
- [x] Continue siphoning the remaining PVR families that still matter after the first swap pass, especially list-tree, tooltip, contextual-menu, code-snippet, and overlay-adjacent pieces
- [x] Harden the panel preset against narrow-container overflow and add a dedicated narrow-panel regression page to the browser gate
- [x] Split `grid-row` ownership away from the broad page grid so dense downstream parameter matrices use the compact compat grid instead of collapsing into `4 / 8 / 16` layout columns
- [x] Add overlay drawer panels that sit over the stage, plus runtime toggle/backdrop support and a baseline-gated drawer demo page
- [x] Upstream the pinned-aside resize behavior from `brand-layout-ops` so the shell can be rehearsed here before swap work
- [x] Upstream the remaining small shell helpers from the current `overlay-preview` audit, especially fill-height panels, checkbox-field density, and dense action rows
- [x] Turn the component atlas into a visual Playwright-backed index so each saved demo has a linked screenshot tile
- [ ] Continue the remaining parity pass after `list-tree`, `contextual-menu`, `tooltip`, `code-snippet`, and drawer panels, especially any downstream-specific pieces discovered during swap testing
- [ ] After panel parity is credible, bring the same component surface to parity under the prose/default preset and decide whether preset switching should be stylesheet-level, build-time bundling, or scoped runtime attributes
- [ ] Re-test whether the downstream `viewer-panel__content` stage-centering shell should stay local composition or deserves a tiny upstream helper once the swap is further along

## Key file map

| Purpose | File |
|---------|------|
| Main package entry | `src/index.ts` |
| Node build API | `src/build.ts` |
| Preset registry | `src/presets.ts` |
| CSS generator | `src/css.ts` |
| Grid CSS slice | `src/css-grid.ts` |
| Drawer runtime | `src/panel-drawer.ts` |
| Pinned-aside resize runtime | `src/resizable-aside.ts` |
| Theme config | `config/foundation-theme.json` |
| Panel preset config | `config/presets/panel.json` |
| Theme build script | `scripts/build-theme.ts` |
| Demo font setup | `scripts/setup-demo-font.ts` |
| Build validation | `scripts/validate-build.ts` |
| Component baseline verification | `scripts/verify-component-baselines.ts` |
| Component behavior verification | `scripts/verify-component-behavior.ts` |
| Component screenshot capture | `scripts/capture-component-screenshots.ts` |
| Demo | `demo/index.html` |
| Panel demo | `demo/panel.html` |
| Atlas enhancer | `demo/component-atlas.js` |
| Component demos | `demo/components/index.html` |
| Drawer panel demo | `demo/components/drawer-panel.html` |
| Individual control demos | `demo/components/button.html`, `demo/components/actions.html`, `demo/components/text-input.html`, `demo/components/color-input.html`, `demo/components/select.html`, `demo/components/checkbox.html`, `demo/components/radio.html`, `demo/components/range.html`, `demo/components/file-input.html`, `demo/components/validation.html`, `demo/components/switch.html`, `demo/components/tabs.html`, `demo/components/panel-tabs.html`, `demo/components/accordion.html`, `demo/components/modal.html`, `demo/components/choice-row.html`, `demo/components/inline-options.html` |
| Individual surface/navigation demos | `demo/components/segmented-control.html`, `demo/components/breadcrumbs.html`, `demo/components/pagination.html`, `demo/components/divider.html`, `demo/components/cards.html`, `demo/components/option-card.html` |
| Surfaces/navigation demo | `demo/components/surfaces-navigation.html` |
| Brand Layout Ops sample | `demo/components/brand-layout-ops-sample.html` |
| Panel pressure demo | `demo/components/panel-pressure.html` |
| Narrow panel regression demo | `demo/components/narrow-panel.html` |
| Parameter matrix regression demo | `demo/components/parameter-matrix.html` |
| Editorial pressure demo | `demo/components/editorial-pressure.html` |
| Architecture plan | `docs/rebuild-plan.md` |
| Product roadmap | `docs/product-roadmap.md` |
| Canonical concept review | `docs/canonical-concepts-review.md` |

## Notes for the next model

- Keep baseline alignment sacred.
- Favor smaller canonical primitives over broad pattern coverage.
- Avoid importing old Vanilla or compatibility assumptions unless they clearly survive modern scrutiny.
- If React becomes important later, add canonical React primitives instead of wrapping legacy markup contracts.
