# Plan: flush side-navigation composition

## Implementation strategy

1. Keep `.bf-panel-content` as the padded default and add `.is-flush` in
   `src/css-components/panel.ts`.
2. Apply the modifier only to the application-layout navigation content slot.
3. Extend generated-CSS validation for the modifier and existing application
   fill/gutter rules.
4. Extend browser behavior coverage with panel/link/label geometry and a
   default-panel padding control.
5. Rebuild, run the complete Foundry gates, inspect the rendered application
   layout, merge the feature branch, and refresh Diagram Registry from the
   resulting Foundry commit.

## Release integration

Spec 003 includes the already tested `fix/application-viewport-fill` commits.
They were merged into this feature branch after Spec 002 reached main so the
next BF release exposes typography precedence, application fill/gutters, and
the flush navigation composition together.

## Public contract

```html
<section class="bf-panel is-fill">
  <div class="bf-panel-content is-flush">
    <nav class="bf-side-navigation">...</nav>
  </div>
</section>
```

The modifier changes padding only. The content slot continues to own flex
growth, minimum block size, scroll behavior under `.is-fill`, and its
last-child flow boundary.
