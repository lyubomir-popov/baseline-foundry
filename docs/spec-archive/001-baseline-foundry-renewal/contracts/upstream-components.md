# Public component contracts

This document fixes the intended API before implementation. Exact internal CSS
may change, but these public responsibilities and class names are stable for
Spec 001.

## 1. Tagged, grid-aligned top navigation

```html
<header class="bf-top-navigation is-grid-aligned">
  <div class="bf-top-navigation-row">
    <div class="bf-top-navigation-logo is-canonical-tagged">
      <a class="bf-top-navigation-link" href="/">
        <span class="bf-top-navigation-logo-tag" aria-hidden="true"></span>
        <span class="bf-top-navigation-logo-title">Diagram Registry</span>
      </a>
    </div>
    <!-- normal BF navigation -->
  </div>
</header>
```

- `--bf-top-navigation-brand-region` is a generated component token, defaults
  to `13rem` in every built-in tier, and can be overridden on an individual
  navigation without styling its internal slots.
- Grid alignment follows the BF fixed-width/grid contract without inline
  placement.
- Tagged mode owns tag/title gap and remains usable at mobile widths.
- The canonical geometry is a 22px-by-38px Ubuntu-orange tag with a 16px
  square mark box. The mark keeps a 6px tag-bottom inset, aligns to the first
  title line, and is deliberately 5px below the tag's geometric centre. The
  Circle of Friends default includes a small physical-left correction for its
  asymmetric source bounds.

## 2. Documentation layout

```html
<div class="bf-docs-layout">
  <aside class="bf-docs-layout-navigation">...</aside>
  <main class="bf-docs-layout-content">...</main>
</div>
```

- Wide composition is the BF equivalent of a 2/6 navigation/content split.
- Narrow composition has full-width content and no empty rail; existing side
  navigation drawer/toggle behavior remains the navigation owner.
- No arbitrary span-6 helper or runtime wrapper is added.

## 3. Tiered-list variants

```html
<ul class="bf-tiered-list is-flush">...</ul>
<ul class="bf-tiered-list is-triple">
  <li class="bf-tiered-list-item">
    <span class="bf-tiered-list-item-label">...</span>
    <span class="bf-tiered-list-item-role">...</span>
    <span class="bf-tiered-list-item-value">...</span>
  </li>
</ul>
```

- Flush is a reusable aligned two-slot row.
- Triple is a reusable aligned three-slot row with a named role slot.
- Narrow widths wrap/stack without overlap.

## 4. Tabs geometry

- Existing `bf-tabs*` markup stays public.
- The active rule touches the list boundary without consumer margin resets.
- Link text remains baseline aligned and the component's occupied block stays on
  the tier grid.

## 5. Aspect modifiers

```html
<figure class="bf-aspect is-4-3 is-contain">...</figure>
```

- Ratio and fit modifiers are orthogonal.
- `is-contain` affects media fit only; background/checkerboard remains local.

## 6. Notice

```html
<aside class="bf-notice is-caution" role="note">
  <h2 class="bf-notice-title">Review before use</h2>
  <div class="bf-notice-content">...</div>
</aside>
```

- Base notice plus `is-information`, `is-positive`, `is-caution`, and
  `is-negative` semantic variants.
- The component does not infer live-region behavior. Consumers choose `role`
  based on message semantics.

## 7. Article pagination

```html
<nav class="bf-article-pagination" aria-label="Documentation pages">
  <a class="bf-article-pagination-link is-previous" href="../intro/" rel="prev">
    <span class="bf-article-pagination-label">Previous</span>
    <span class="bf-article-pagination-title">Introduction</span>
  </a>
  <a class="bf-article-pagination-link is-next" href="../install/" rel="next">
    <span class="bf-article-pagination-label">Next</span>
    <span class="bf-article-pagination-title">Install the CLI</span>
  </a>
</nav>
```

- Distinct from numbered `bf-pagination`.
- Wide layout balances directions; narrow container layout stacks complete
  links. Boundary directions are omitted, not disabled.
- `.is-previous` and `.is-next` are required semantic modifiers. They own
  direction independently of link order and select the RTL-aware decorative
  chevron treatment.

## 8. Page shell

```html
<body class="bf-theme bf-page-shell">...</body>
```

- `bf-page-shell` removes the user-agent body margin and supplies a safe page
  background/minimum block size.
- No unscoped `body { margin: 0 }` is emitted.

## 9. Control row

```html
<form class="bf-control-row" role="search">
  <div class="bf-field">...</div>
  <div class="bf-field">...</div>
  <button class="bf-button">Apply</button>
</form>
```

- Row owns wrapping, bottom alignment, gaps, and trimming of direct standalone
  control/field trailing compensation.
- Standalone control invariants are unchanged outside the row.

## 10. H5 visual role

```html
<p class="bf-h5">Visual language</p>
```

- Semantic `h5` and the `.bf-h5` visual-role class share the same tokenized,
  element-owned presentation.
- Use the semantic element when the text is a heading and `.bf-h5` when the
  visual role must not alter document hierarchy.
- No separate `bf-eyebrow` alias is published; two public names for the same
  presentation would create duplicate implementations and migration burden.
