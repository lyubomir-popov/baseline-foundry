# Quickstart: Component and Pattern Consistency QA

## Focused validation

```powershell
npm run build
npm run test:build
npm run test:components
npm run test:behavior
```

## Browser routes

Review each route in Editorial, Documentation, App, and OS:

- `/demo/components/application-layout.html`
- `/demo/components/narrow-panel.html`
- `/demo/components/search-and-filter.html`
- `/demo/components/table-of-contents.html`
- `/demo/components/hero.html`
- `/demo/components/linked-logo-section.html`
- `/demo/components/quote-wrapper.html`
- `/demo/components/tab-section.html`
- `/demo/components/accordion.html`
- `/demo/components/content-card.html`
- `/demo/components/media-object.html`
- `/demo/components/notification.html`
- `/demo/components/table-sortable.html`
- `/demo/components/index.html`
- `/demo/patterns/index.html`
- `/demo/tiers/{editorial,documentation,app,os}.html`
- `/examples/grid/app-panels.html`
- `/examples/grid/editorial-site.html`
- `/demo/spec/typographic-specimen.html`

At desktop and constrained widths check focus, wrapping, overflow, hidden tab
panels, popup stacking, global baseline coverage, page gutters, Previous/Next
order, divider clearance, stable sort columns, shared keylines, and the spacing
levels in `contracts/composition.md`.

For the third owner-review pass also verify plain `hr`/`.bf-rule` equivalence,
body-sized breadcrumb/control typography, chevron-only top navigation, fixed
bottom controls and final-content clearance, absence of accidental component
anchor underlines, and one horizontal gutter across nested fixed-width regions.

## Closeout

```powershell
npm test
npm run qa:components
```

Delete the two owner-supplied root screenshots only after the replacement
rendered states have been reviewed. Record final measurements and adversarial
findings in `review.md`.
