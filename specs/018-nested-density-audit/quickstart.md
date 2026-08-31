# Quickstart: Nested density audit QA

## Composition contracts

The side-navigation brand is optional composition, not a required navigation
slot. Put the existing tagged-logo primitive in the owning panel header:

```html
<nav class="bf-panel bf-side-navigation-drawer" aria-label="Primary">
  <div class="bf-panel-header is-sticky is-navigation-brand">
    <div class="bf-top-navigation-logo is-canonical-tagged">
      <!-- linked tag asset and wordmark -->
    </div>
  </div>
  <div class="bf-side-navigation-groups">...</div>
</nav>
```

Use `is-nested` only on an auxiliary chip, status label, or badge inside an
existing body-sized flex/grid row:

```html
<span class="bf-side-navigation-status">
  <span class="bf-chip is-information is-nested">Beta</span>
</span>
```

Do not infer the modifier from ancestry or apply it to a bordered button. Use
`bf-button is-link` for an inline table action.

## Focused checks

```powershell
npm run build
npm run test:build
npm run test:behavior
```

Review `/demo/components/side-navigation.html` and
`/demo/components/tabs.html` in Editorial, Documentation, App, and OS, in both
light and dark. Confirm the shared rail brand remains visible after navigation
scroll restoration, tag and root row share a rail, nested auxiliary surfaces do
not enlarge their host row, and nested copy retains the host text baseline.
For grouped navigation, confirm the rule and heading remain a tight header, the
heading-to-list gap is 0.5rem, the rule's complete occupied block is 0.5rem,
and the rule runs from the continuation text rail to the navigation end edge.

Review `/demo/spec/spacing-vertical.html` in the same tier/tone matrix. The
first row contains distinct shared-height primitives, the second contains
unboxed metric text, and the third contains every supported real nested host.
Red and blue rules must share their starts/ends within one rasterised border at
enlarged browser zoom. Cross-check any apparent omission against
[`contracts/vertical-coverage.md`](contracts/vertical-coverage.md).

## Closeout

```powershell
npm test
npm run qa:components
```
