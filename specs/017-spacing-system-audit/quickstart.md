# Quickstart: Spacing System Audit QA

## Focused checks

```powershell
npm run build
npm run test:build
npm run test:behavior
```

## Browser routes

Use the owning component or pattern routes listed in
`contracts/adjacency-inventory.md`. At minimum review:

- `/demo/spec/spacing.html`
- `/demo/components/typography.html`
- `/demo/components/layout.html`
- `/demo/components/form-atlas.html`
- `/demo/components/accordion.html`
- `/demo/components/tabs.html`
- `/demo/components/panel-tabs.html`
- `/demo/components/application-layout.html`
- `/demo/components/table-of-contents.html`
- `/demo/components/notification.html`
- `/demo/components/content-card.html`
- `/demo/components/hero.html`
- `/demo/components/quote-wrapper.html`
- `/demo/components/tab-section.html`
- `/demo/patterns/index.html`

Switch Editorial, Documentation, App, and OS at 560px, 900px, and 1280px.
Check direct sibling gaps, first/last glyph clearance, rules, focus outlines,
wrapped labels, control insets, panel gutters, overflow, and hidden/collapsed
states. On the spacing chapter, compare the stacked flush/dense/default
relationships plus prose-list, checkbox/radio, disclosure-continuation, and
panel-gutter tracks; do not expect every mark and label to share one left edge.

## Closeout

```powershell
npm test
npm run qa:components
```
