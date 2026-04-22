# Grid specification — live examples

Build the minimum set of HTML examples that demonstrate every distinct grid behaviour described in the current Canonical grid specification root draft. Each example is a standalone `.html` file under `examples/grid/`.

## Source material

The authoritative spec lives at:
`../canonical-spacing-spec/specs/grid/draft.md`

If you need the latest versioned review batch while auditing comment history, see:
`../canonical-spacing-spec/specs/grid/v0.3/draft.md`

Treat that `v0.3/` folder as a historical review snapshot only. The root `draft.md` above is the current latest working copy and the file this checklist must stay aligned with.

There is no checked-in local image bundle for the current grid draft in `canonical-spacing-spec`; use the live draft prose and examples rather than following a broken sibling image path.

## Conventions (baseline-foundry)

- Link `../../dist/styles.css` — choose tier with `.bf-tier-editorial` or `.bf-tier-app` on `<body>`.
- Layout: `bf-fixed-width` → `bf-grid` → `bf-span-*`.
- Vertical rhythm: `bf-section` / `bf-stack`.
- Forms: `bf-form-label`, `bf-control`, `bf-input`.
- Grid spans are power-of-2 only: 1, 2, 4, 8, 16.
- All custom CSS should go in a single shared `grid-examples.css` next to the HTML files — no inline `<style>` blocks longer than a few overrides.
- Minimal JS only where interaction is essential (drawer toggle, panel resize handle).
- Semantic HTML throughout; no wrapper divs for styling unless needed for a grid span.

## Examples to build

Below is the consolidated list. Each row = one `.html` file. The "Spec §" column points to the section the example serves. "Tier" sets the body class. "What to show" is the minimum content needed to make the point — keep it tight.

| # | File | Spec § | Tier | What to show |
|---|------|--------|------|--------------|
| 1 | `breakpoints.html` | §2.1, §2.2 | editorial | A single row of placeholder cards that reflows across all four breakpoints (4 → 8 → 8 → 16 columns). Use `bf-span-*` so the cards halve/double at each threshold. Include a visible column overlay toggle (CSS `::before` on the grid with semi-transparent columns) so the reviewer can confirm column counts. |
| 2 | `nested-grid.html` | §2.4 | app | Three explicit specimens for the same nested rule: a small 4-column parent where the nested content stacks inside a 2-column module, a large 8-column parent where the same module spans 4 columns and splits `2 + 2`, and an x-large 16-column parent proving the same keyline logic at the next octree step. |
| 3 | `editorial-site.html` | §3.1, §3.2, §3.3, §7.4 | editorial | A centered max-width landing page whose hero shows multiple component types in one view: a 50/50 text + media split plus a compact tab strip or stats/table lane. Follow that with a 4-card row and a two-column text block. Outer margins should grow at wide viewports, and the whole page should collapse cleanly back toward a 4-column editorial flow. |
| 4 | `docs-layout.html` | §4, §7.4 | editorial | Three-region documentation / article layout: left side-nav (2-col span), centre content (4-col span), right TOC (2-col span). At narrow viewport the side-nav collapses into a drawer overlay and the TOC stacks below the h1, so the same page can serve the documentation placeholder and the article-with-side-navigation placeholder. |
| 5 | `app-panels.html` | §5.1, §5.3, §5.4, §7.5 | app | A fluid application shell: icon-rail (32 px) + small left panel (240 px) + main content area. Main has its own container-based grid that reflows independently when the panel opens, closes, or resizes. Add a visible divider handle for the resizable left panel, and a right-side medium drawer (465 px) with key/value content that overlays without resizing main so the page covers common drawer configurations, drawers vs panels, and the grid-required drawer example. |
| 6 | `panel-reflow.html` | §6.1 | app | Dashboard-style main area with 4 equal cards. A left panel starts closed; opening it narrows main past the 8→4 container-query threshold, causing cards to reflow from a 4-across row to a 2×2 stack. Demonstrates panel-triggered reflow with no custom JS (pure container query). |
| 7 | `forms.html` | §8 | app + editorial | Three form variants on one page, separated by headings: (a) login form centered on 4 of 8 columns, (b) settings form left-aligned from column 1, (c) contact/newsletter form in a 50/50 split. Switch the first two between editorial and app tiers via a class toggle so the gutter difference is visible. |
| 8 | `tab-strip.html` | §7.5 | app | A sidebar+main layout where the tab strip container is assigned a column span (e.g., columns 3–8) rather than using the grid internally. |
| 9 | `toolbar.html` | §7.5 | app | A header or action bar demonstrating a grid-exempt layout: elements grouped left and right using flexbox `justify-content: space-between`, proving there is no requirement to align these small actions to grid columns. |
| 10 | `data-table.html` | §7.5 | app | A data table in the main area showing that table columns drive their own width based on content/truncation needs (grid optional/exempt), overriding strict grid alignment if necessary. |

## Future-work capture targets still referenced by the root draft

| # | File | Spec § | Tier | What to show |
|---|------|--------|------|--------------|
| 11 | `tile-grid-variants.html` | §9 | app | Three tile-grid treatments in one capture: the current standard grid, a gutter-as-padding variant, and a half-gutter variant. Label this page clearly as exploratory / future work rather than normative current guidance. |

## Additional examples not explicitly called out in the spec but useful

| # | File | Rationale | Tier | What to show |
|---|------|-----------|------|--------------|
| 12 | `gutter-comparison.html` | §2.3 — the spec defines different gutter values per tier but has no visual comparison | both | Side-by-side (or toggle) of the same 8-column card row rendered once with editorial gutters (2 rem at large) and once with app gutters (1.5 rem). Clearly label the gutter width on each. |
| 13 | `column-span-rule.html` | §2.2 — the bisection / power-of-2 rule is the spec's most distinctive constraint but has no dedicated visual | editorial | A single page showing every valid span on an 8-column grid (8, 4, 2, 1) as labelled coloured bars, then below it the same for 16-column. Include a "what NOT to do" row with a dashed-outline 3-column span labelled "invalid — thirds not allowed." |

## Root-draft placeholder coverage

Use this table to sanity-check the checklist against the root `specs/grid/draft.md` placeholders.

| Root draft placeholder | Planned example page | Notes |
|---|---|---|
| §2.4 nested grids | `nested-grid.html` | Explicit small / large / x-large specimens rather than a single static crop. |
| §4 documentation layout | `docs-layout.html` | Same page also covers the side-navigation article pattern. |
| §5.1 common drawer configurations | `app-panels.html` | Use the left panel plus right medium drawer as the paired configurations. |
| §5.3 drawers vs panels | `app-panels.html` | Left region resizes main; right region overlays main. |
| §5.4 resizable panel handle | `app-panels.html` | Visible divider handle belongs on the left panel. |
| §6.1 panel-triggered reflow | `panel-reflow.html` | Pure container-query proof. |
| §7.4 hero section | `editorial-site.html` | Hero should show more than one component type in one frame. |
| §7.4 landing page | `editorial-site.html` | Same page as the hero / editorial-layout proof. |
| §7.4 full-page form | `forms.html` | Use the centered or settings-form variant as the screenshot crop. |
| §7.4 article with side navigation | `docs-layout.html` | Reuse the same wide + narrow docs/article page. |
| §7.5 tab navigation | `tab-strip.html` | Grid optional. |
| §7.5 toolbar with left/right groups | `toolbar.html` | Grid exempt. |
| §7.5 drawer | `app-panels.html` | Make the drawer body use grid-aligned key/value content. |
| §7.5 data table in main area | `data-table.html` | Table logic can override strict grid widths if needed. |
| §8 form layouts | `forms.html` | One page covers login, settings, and contact/newsletter. |
| §9 gutter-as-padding layout | `tile-grid-variants.html` | Future-work / exploratory capture. |
| §9 half-gutter variant | `tile-grid-variants.html` | Same exploratory page as above. |

**Total: 13 files.** This is the minimum set that covers every root-draft placeholder plus the two extra helper examples needed to explain gutter and span rules clearly.

## Build checklist

1. Create `examples/grid/` and `examples/grid/grid-examples.css`.
2. Build each HTML file in order.
3. After each file, open it in the browser at 1440 px wide and verify the layout makes sense. For any 16-column / x-large proof, also verify the dedicated wide specimen or a viewport wide enough to cross the x-large threshold.
4. Run `npx playwright screenshot` or equivalent if available, otherwise manual check is fine.
5. Commit as a single coherent batch: `git add examples/grid && git commit -m "Add grid spec example pages"`.

## What NOT to do

- Do not refactor existing `examples/app-tier/` files.
- Do not add new tokens, variables, or build steps — use only what `dist/styles.css` already provides.
- Do not over-decorate: placeholder text, solid-colour boxes, and simple labels are enough. The point is layout, not content.
- Do not add a JS framework.
