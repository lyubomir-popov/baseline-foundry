# Public Markup Contract

## Sticky site layout inside an application

```html
<div class="bf-application is-fill">
  <main class="bf-main">
    <div class="bf-page-shell is-site-layout">
      <header class="bf-top-navigation">…</header>
      <main class="bf-site-main bf-panel-content">…</main>
      <footer class="bf-site-footer is-sticky">…</footer>
    </div>
  </main>
</div>
```

- `is-site-layout` is the opt-in sticky-footer contract.
- `bf-main` remains the scroll owner.
- `bf-site-main` is a non-shrinking document-flow child, including when composed with `bf-panel-content`.
- `is-sticky` means pinned by remaining flex space, not positioned over content.

## Hero with final full-width media

```html
<section class="bf-hero" aria-labelledby="hero-title">
  <div class="bf-hero-lead bf-section is-shallow">
    <div class="bf-hero-copy">
      <h1 id="hero-title">…</h1>
      <p>…</p>
    </div>
  </div>
  <figure class="bf-figure bf-hero-media is-full">
    <img src="…" alt="…">
    <figcaption>…</figcaption>
  </figure>
</section>
```

- `bf-hero-lead` is structural and adds no alternative typography.
- `bf-section is-shallow` owns the internal lead-to-media boundary.
- The direct `bf-hero-media is-full` figure closes the hero content.
- The hero root's existing block-end padding owns the larger boundary after media.
- Existing heroes using `bf-hero-layout` remain supported unchanged.
