# Quickstart: flush side-navigation composition

## Authoring

Use a flush content slot when the child composition already owns its own
edge-to-content spacing:

```html
<div class="bf-panel-content is-flush">
  <nav class="bf-side-navigation" aria-label="Primary">...</nav>
</div>
```

Do not add `.is-flush` to ordinary prose, form, or inspector panels.

## Verification

```powershell
npm test
npm run qa:components
git diff --check
```

In the application-layout fixture, confirm the selected row background and
highlight bar touch the navigation edges, text remains aligned with peer rows,
the shell reaches the viewport bottom, and no horizontal overflow or console
error is present.
