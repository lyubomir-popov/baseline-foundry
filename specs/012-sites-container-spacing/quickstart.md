# Quickstart: Sites Container-Owned Spacing

```powershell
npm test
npm run qa:components
npm run demo:serve -- --host 127.0.0.1
```

## Baseline Foundry review

Open the tiered-list, basic-section, and hero component routes in Editorial at 360 × 844 and 1280 × 900.

- Internal pattern stacks measure 24px (`--bf-section-space-shallow`).
- Complete pattern siblings in a section stack measure 64px (`--bf-section-space`).
- Representative headings and paragraphs compute with non-zero top padding, zero bottom padding, and a compensation bottom margin.
- Plain and visual-role-classed equivalents occupy identical baseline-aligned boxes.
- `is-flush` remains gapless and no route develops inline overflow or console errors.

Switch the same fixtures through Documentation, App, and OS and confirm direct/class-scoped equality and baseline phase.

## Diagram Registry review

Serve the isolated Diagram Registry feature worktree and open its representative Sites route at 360 × 844 and 1280 × 900.

- The tiered-list header-to-items gap is 24px.
- Adjacent complete patterns/sections are 64px apart.
- Changing the header or final copy element does not change either relationship.
- The page has no local direct `bf-*` selector overrides, horizontal overflow, or console errors.
