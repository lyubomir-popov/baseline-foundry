# Task: Typographic Specimen Page

## What to build

Recreate the Canonical Pragma "Typographic Specimen" page as a baseline-foundry demo page. The reference lives in the Pragma repo at:

```
../pragma/apps/react/demo/src/data/examples/TypographicSpecimen/
```

Key files:
- `TypographicSpecimen.tsx` — the markup (React, but the structure is plain HTML)
- `styles.css` — layout grid, responsive breakpoints, typography sizing via CSS custom properties

A running version is visible at `http://localhost:5174` (Pragma demo app, select "Typographic Specimen").

## Reference layout (top to bottom)

1. **Top section** — two-column layout:
   - Left column: `h1` through `h6`, each separated by horizontal rules
   - Right column: introductory paragraph, then `h4` + body copy, `h5` + body copy, `h6` + body copy
2. **Thick horizontal rule** (3 px, full-width divider)
3. **Mid section** — three-column layout:
   - "GRID" title (`h2`)
   - A `h6` + paragraph block ("Lorem ipsum dolor sit")
   - A decorative geometric pattern image (use a placeholder or CSS pattern)
4. **Bottom grid** — four equal columns, each with: `hr` + `h5` + `p`

Responsive behaviour: at narrow viewports the columns collapse to single-column stacks.

## How to build it (baseline-foundry conventions)

- **Output**: a standalone HTML file at `demo/spec/typographic-specimen.html`
- **Stylesheet**: link `../../dist/tiers/editorial/styles.css` for the editorial tier
- **Shell**: follow the same pattern as `demo/spec/typography.html` — include `spec-shell.css` and `spec-shell.js`
- **Layout primitives**: use `bf-fixed-width`, `bf-grid`, `bf-span-*` for the grid columns
- **Vertical rhythm**: use `bf-prose`, `bf-section`, `bf-stack` for content flow
- **Horizontal rules**: use `<hr>` — the system already styles them on the baseline
- **Typography**: do NOT hard-code font sizes or line heights — rely on the tier's prose defaults for `h1`–`h6` and `p`. The whole point is to show that baseline-foundry's editorial typescale already produces this layout correctly.
- **Custom CSS**: put any specimen-specific overrides in a `typographic-specimen.css` file next to the HTML, or at most a small `<style>` block. Keep it minimal — the baseline-foundry classes should do most of the work.
- **Grid structure**:
  - Top section: `bf-grid` with two `bf-span-8` children (or equivalent halves)
  - Mid section: `bf-grid` with three children spanning appropriate `bf-span-*`
  - Bottom grid: `bf-grid` with four `bf-span-4` children
- **Baseline grid overlay**: include the baseline grid debug toggle (the demo shell already supports this via the toolbar)
- **No JS frameworks**: this is plain HTML + baseline-foundry CSS, no React

## Headings text content

Use the exact same heading text from the reference:
- h1: "This is an h1 heading"
- h2: "THIS IS AN H2 HEADING" (uppercase)
- h3: "This is an h3 heading"
- h4: "THIS IS AN H4 HEADING" (uppercase)
- h5: "THIS IS AN H5 HEADING" (uppercase)
- h6: "This is an h6 heading"

Body copy: standard lorem ipsum paragraphs.

## Success criteria

- All headings and body text sit on the baseline grid without manual nudges
- The two-column, three-column, and four-column layouts work using `bf-grid` + `bf-span-*`
- Switching between editorial and app tiers (if wired up) shows different typescale sizing but preserved baseline alignment
- The page looks visually equivalent to the Pragma reference screenshot
- Horizontal rules land on grid lines

## Link to the live reference

Add this page to `demo/index.html`'s spec links nav so it's discoverable from the home page.
