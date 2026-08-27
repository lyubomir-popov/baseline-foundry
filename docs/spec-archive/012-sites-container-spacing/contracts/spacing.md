# Public Spacing Contract

## Pattern internals

```html
<section class="bf-tiered-list bf-stack" aria-labelledby="routes-title">
  <header class="bf-tiered-list-header">
    <h2 id="routes-title">Pick a route</h2>
  </header>
  <ol class="bf-tiered-list-items">…</ol>
</section>
```

- `bf-stack` owns the vertical relationship between direct pattern parts.
- In Editorial, the default stack gap is `--bf-section-space-shallow` (1.5rem).
- Pattern children retain metric compensation but no semantic role space-after.

## Complete pattern and section siblings

```html
<main class="bf-stack is-section">
  <section class="bf-hero bf-stack">…</section>
  <section class="bf-basic-section bf-stack">…</section>
  <section class="bf-tiered-list bf-stack">…</section>
</main>
```

- `is-section` changes the owning stack gap to `--bf-section-space` (4rem in Editorial).
- Each nested pattern stack keeps its default shallow internal gap.
- Complete pattern roots do not require element-owned trailing semantic margins.

## Flush composition

```html
<div class="bf-stack is-flush">…</div>
```

- `is-flush` sets the semantic gap to zero.
- It does not reset child `padding-block-start` or compensation `margin-block-end`.

## Density options

All stack modifiers select existing public tokens; none hard-code a consumer
spacing value:

| Stack | Token | Editorial value |
|---|---|---:|
| `bf-stack is-flush` | `0px` | 0px |
| `bf-stack is-extra-dense` | `--bf-space-half` | 4px |
| `bf-stack is-dense` | `--bf-space-1` | 8px |
| `bf-stack is-loose` | `--bf-space-2` | 16px |
| `bf-stack` or `bf-stack is-section-shallow` | `--bf-section-space-shallow` | 24px |
| `bf-stack is-section` | `--bf-section-space` | 64px |
| `bf-stack is-section-deep` | `--bf-section-space-deep` | 128px |

## Metric text contract

For every generated role in the production metrics engine:

```text
padding-block-start = measured role nudge
padding-block-end = 0
margin-block-end = baseline unit - measured role nudge
```

The margin is compensation, not semantic spacing. Container gap owns the authored relationship to the next sibling.
