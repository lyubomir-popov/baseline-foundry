# Grid specification — live examples

Build the minimum set of HTML examples that demonstrate every distinct grid behaviour described in the Canonical grid specification (v 0.3). Each example is a standalone `.html` file under `examples/grid/`.

## Source material

The authoritative spec lives at:
`../canonical-specs/specs/grid/v0.3/draft.md`

Reference images (breakpoint diagrams, nested grid, centered layout, Workplace app, Launchpad app) are in:
`../canonical-specs/specs/grid/v0.3/images/`

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
| 2 | `nested-grid.html` | §2.4 | app | A parent 8-column grid with one cell spanning 4 columns, inside which a child grid subdivides into 2 + 2. Show that child column edges align with parent keylines. A second row nests a 2-column child inside a 4-column cell on a 16-column parent to prove the octree pattern at two levels. |
| 3 | `editorial-site.html` | §3.1, §3.2, §3.3 | editorial | A centered max-width page: hero section with a 50/50 text + image split, followed by a 4-card row, followed by a two-column text block. Outer margins should grow at wide viewports. Resize to see reflow from 8-col to 4-col. |
| 4 | `docs-layout.html` | §4 | editorial | Three-region documentation layout: left side-nav (2-col span), centre content (4-col span), right TOC (2-col span). At narrow viewport the side-nav collapses into a drawer overlay and the TOC stacks below the h1. |
| 5 | `app-panels.html` | §5.1, §5.3, §5.4 | app | A fluid application shell: icon-rail (32 px) + small nav drawer (240 px) + main content area. Main has its own container-based grid that reflows independently when the drawer opens/closes. Include a toggle button for panel open/close so the reviewer sees the main area's column count change live. Add a right-side medium drawer (465 px) that overlays without resizing main. |
| 6 | `panel-reflow.html` | §6.1 | app | Dashboard-style main area with 4 equal cards. A left panel starts closed; opening it narrows main past the 8→4 container-query threshold, causing cards to reflow from a 4-across row to a 2×2 stack. Demonstrates panel-triggered reflow with no custom JS (pure container query). |
| 7 | `forms.html` | §8 | app + editorial | Three form variants on one page, separated by headings: (a) login form centered on 4 of 8 columns, (b) settings form left-aligned from column 1, (c) contact/newsletter form in a 50/50 split. Switch the first two between editorial and app tiers via a class toggle so the gutter difference is visible. |

## Additional examples not explicitly called out in the spec but useful

| # | File | Rationale | Tier | What to show |
|---|------|-----------|------|--------------|
| 8 | `gutter-comparison.html` | §2.3 — the spec defines different gutter values per tier but has no visual comparison | both | Side-by-side (or toggle) of the same 8-column card row rendered once with editorial gutters (2 rem at large) and once with app gutters (1.5 rem). Clearly label the gutter width on each. |
| 9 | `column-span-rule.html` | §2.2 — the bisection / power-of-2 rule is the spec's most distinctive constraint but has no dedicated visual | editorial | A single page showing every valid span on an 8-column grid (8, 4, 2, 1) as labelled coloured bars, then below it the same for 16-column. Include a "what NOT to do" row with a dashed-outline 3-column span labelled "invalid — thirds not allowed." |

**Total: 9 files.** This is the minimum set that covers every distinct grid behaviour in the spec without redundancy.

## Build checklist

1. Create `examples/grid/` and `examples/grid/grid-examples.css`.
2. Build each HTML file in order.
3. After each file, open it in the browser at 1440 px wide and verify the layout makes sense.
4. Run `npx playwright screenshot` or equivalent if available, otherwise manual check is fine.
5. Commit as a single coherent batch: `git add examples/grid && git commit -m "Add grid spec example pages"`.

## What NOT to do

- Do not refactor existing `examples/app-tier/` files.
- Do not add new tokens, variables, or build steps — use only what `dist/styles.css` already provides.
- Do not over-decorate: placeholder text, solid-colour boxes, and simple labels are enough. The point is layout, not content.
- Do not add a JS framework.
