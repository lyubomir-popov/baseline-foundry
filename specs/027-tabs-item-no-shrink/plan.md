# Plan: Tabs item no-shrink

**Branch**: `feat/027-tabs-item-no-shrink` | **Date**: 2026-09-30 |
**Spec**: [spec.md](spec.md)

## Summary

Add `flex: 0 0 auto` to `:where(.bf-theme) :where(.bf-tabs-item)` in
`src/css-components/tabs-choice-breadcrumbs.ts`. The list already declares
`display: flex`, `overflow-x: auto`, `white-space: nowrap` and
`min-inline-size: 0`, so once items stop shrinking the existing list scrolls
and the page does not overflow. No container change is needed.

`is-equal` switches the list to `display: grid`, so the flex rule is inert
there. Tabs that fit are laid out at their flex basis already, so their widths
do not change.

## Technical context

- Source: `src/css-components/tabs-choice-breadcrumbs.ts`; `dist/` is rebuilt.
- Static contract: `scripts/validate-build.ts` asserts the item flex rule and
  the list's `overflow-x: auto` / `white-space: nowrap`.
- Rendered contract: the existing four-tier tabs loop in
  `scripts/verify-component-behavior.ts` measures a six-tab specimen at 390px
  for overlap, clipping, list scroll and containment, then End/Home keyboard
  selection, focus, scroll-into-view and the active bar.
- Demo: no long-list specimen existed, so `demo/components/tabs.html` gains one
  six-tab list using the existing markup and no local CSS.

## Constitution check

Flat `bf-*` classes only; no `data-*` selectors; four tiers equivalent;
generated output untouched by hand. Pass.
