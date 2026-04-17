# Spacing specification — live examples

Build the minimum set of HTML examples that demonstrate every distinct spacing behaviour described in the Canonical spacing specification (v 0.4). Each example is a standalone `.html` file under `examples/spacing/`.

## Source material

The authoritative spec lives at:
`../canonical-spacing-spec/specs/spacing/draft.md`

The spec still references image placeholders `image-1.png` and `image.png` in the §2.1 comparison table. The local workspace only carries partial supporting assets under `../canonical-spacing-spec/specs/spacing/images/`, so the examples should replace that need with live HTML demonstrations rather than relying on the legacy Coda-export image names.

## Conventions (baseline-foundry)

- Link `../../dist/styles.css` — choose tier with `.bf-tier-editorial` or `.bf-tier-app` on `<body>`.
- Layout: `bf-fixed-width` → `bf-grid` → `bf-span-*`.
- Vertical rhythm: `bf-section` / `bf-stack`.
- Forms: `bf-form-label`, `bf-control`, `bf-input`.
- Grid spans are power-of-2 only: 1, 2, 4, 8, 16.
- All custom CSS should go in a single shared `spacing-examples.css` next to the HTML files — no inline `<style>` blocks longer than a few overrides.
- Minimal JS only where interaction is essential (tier toggle, density switch).
- Semantic HTML throughout; no wrapper divs for styling unless needed for a grid span.

## Examples to build

Each row = one `.html` file. "Spec §" points to the section the example primarily serves.

| # | File | Spec § | Tier | What to show |
|---|------|--------|------|--------------|
| 1 | `element-vs-container.html` | §2.1, §2.2 | both | Side-by-side comparison of the two spacing modes. Left half: an editorial content stack (h2, p, p, figure, h2, p) where each element carries its own `margin-bottom` — label each gap with its semantic value. Right half: the same elements inside a `bf-stack` container with `gap` — label the uniform gap. Include a tier toggle button that switches the `<body>` class between `bf-tier-editorial` and `bf-tier-app` so the viewer sees margins appear/disappear live. |
| 2 | `bottom-only-resilience.html` | §2.3.1 | editorial | Demonstrate the "bottom-only" rationale. Show a button followed by an unstyled `<div>` representing an unknown third-party widget (D3 canvas placeholder). With bottom-only margins the button's `margin-bottom` gives natural separation. Below that, show the same pair but with `margin-top`-only: the unknown div crowds the button because it has no `margin-top`. Use a red dashed outline on the unknown element and annotate the gap (or lack thereof). |
| 3 | `semantic-spacing-stack.html` | §2.3.2, §2.3.3 | editorial | A realistic editorial column: h1, p, p, h2, p, figure, blockquote, h2, p. Each element's `margin-bottom` value is shown as a tinted overlay band below the element (a `::after` pseudo-element with the height of the margin, semi-transparent). This makes the semantic spacing hierarchy directly visible — larger gaps after headings, standard gaps after paragraphs, larger gaps around figures. |
| 4 | `last-child-reset.html` | §2.3.5 | editorial | A hero pattern: padded container with h1, p, and a button. Show two versions stacked vertically: (a) **without** last-child reset — the button's `margin-bottom` visibly doubles up with the hero's `padding-bottom` (annotate "80 px — double spacing bug"). (b) **with** the reset — clean 64 px padding only (annotate "64 px — correct"). Use background colours so the padding and margin regions are distinguishable. |
| 5 | `container-density.html` | §2.4.2, §2.4.3 | app | A MAAS-style storage card with three nested density zones (from the spec's card diagram): (a) a 0 px-gap key-value list (Disk, Allocated, Free), (b) a chart placeholder, (c) an 8 px-gap button group. The card itself uses 16 px gap. Label each gap value. Below the card, show the same elements without a container (raw browser defaults) to contrast. |
| 6 | `app-provisions.html` | §2.4.4 | app | Two application-specific patterns: (a) a header bar where the gap between elements is measured baseline-to-baseline (show a thin horizontal rule at each baseline position to prove alignment), (b) a fixed-height status bar spanning the full width with inline children (icon, text label, timestamp) — show that child margins are zero and spacing comes from the bar's own gap. |
| 7 | `border-compensation.html` | §2.5, §3.3 | app | Three components side by side: a button with all-side border, an input with bottom-only border, and a button with no border. Each has a baseline grid overlay behind it (4 px stripes). Show that all three have outer heights that snap to whole-`bU` multiples despite different border configurations. Annotate the padding adjustments (e.g. "16 px padding → 15 px to compensate 1 px border"). |
| 8 | `nudge-baseline.html` | §2.6.1, §2.6.2, §2.6.3 | editorial | Stack of h1, h2, p, p with a 4 px baseline grid overlay. Show baselines landing on grid lines thanks to nudge `padding-top` values. Below, show the same stack with nudges set to 0 (app tier) — baselines drift off the grid. Use a toggle to switch between the two states. Annotate each element's nudge value. |

## Additional examples not explicitly called out in the spec but useful

| # | File | Rationale | Tier | What to show |
|---|------|-----------|------|--------------|
| 9 | `substitutability.html` | §4.1 — the spec's top-priority invariant has no visual | both | In a container-owned stack, swap a button for a text input, then for a select — spacing stays identical because the container owns it. In an element-owned column, swap h2 for h3 — spacing changes semantically (larger vs smaller gap), proving element ownership. Show both scenarios with before/after pairs. |
| 10 | `horizontal-sibling.html` | §3.2 — horizontal sibling spacing has no visual | app | A button bar (3 buttons in a row) and a chip row (5 chips), each in a container with explicit horizontal `gap`. Label the gap. Below, show the same elements without a container to contrast with browser defaults. |

**Total: 10 files.** This is the minimum set that covers every distinct spacing behaviour in the spec without redundancy.

## Build checklist

1. Create `examples/spacing/` and `examples/spacing/spacing-examples.css`.
2. Build each HTML file in order.
3. After each file, open it in the browser at 1440 px wide and verify the layout makes sense.
4. Run `npx playwright screenshot` or equivalent if available, otherwise manual check is fine.
5. Commit as a single coherent batch: `git add examples/spacing && git commit -m "Add spacing spec example pages"`.

## What NOT to do

- Do not refactor existing `examples/app-tier/` or `examples/grid/` files.
- Do not add new tokens, variables, or build steps — use only what `dist/styles.css` already provides.
- Do not over-decorate: placeholder text, solid-colour boxes, tinted overlays, and simple labels are enough. The point is spacing mechanics, not visual design.
- Do not add a JS framework. Tier toggles can be a single `<button onclick="document.body.classList.toggle(...)">`.
