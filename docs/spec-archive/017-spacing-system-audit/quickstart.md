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

- `/demo/spec/spacing.html` (switch both axis audits in place)
- `/demo/spec/spacing-horizontal.html` (direct source/QA route)
- `/demo/spec/spacing-vertical.html` (direct source/QA route)
- `/demo/components/typography.html`
- `/demo/components/layout.html`
- `/demo/components/form-atlas.html`
- `/demo/components/accordion.html`
- `/demo/components/tabs.html`
- `/demo/components/panel-tabs.html`
- `/demo/components/application-layout.html`
- `/demo/components/side-navigation.html`
- `/demo/components/select.html`
- `/demo/components/table-of-contents.html`
- `/demo/components/notification.html`
- `/demo/components/content-card.html`
- `/demo/components/hero.html`
- `/demo/components/quote-wrapper.html`
- `/demo/components/tab-section.html`
- `/demo/patterns/index.html`

Switch Editorial, Documentation, App, and OS at 35rem, 56.25rem, and 80rem.
Check direct sibling gaps, first/last glyph clearance, rules, focus outlines,
wrapped labels, control insets, panel gutters, overflow, and hidden/collapsed
states. Confirm the axis tabs change panels without changing the spacing-page
pathname. On the horizontal audit, compare only the named inline variable
family; on the vertical audit, compare each 5rem specimen's red shared start
with its blue occupied end and its text against the leading five-letter
paragraph. All body-sized single-line interface specimens must share one height
and baseline across all tiers. Metric prose and repeated-data/document-trail
rows remain named non-control contracts.

## Closeout

```powershell
npm test
npm run qa:components
```
