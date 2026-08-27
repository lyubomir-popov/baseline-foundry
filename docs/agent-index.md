# Agent index

This is the one-page cold-start quick reference for repository operations. It
does not own product invariants, live state, cross-spec order, or spec status.

## Source map

| Concern | Owner |
|---|---|
| Theme config and tier values | `config/foundation-theme.json`, `config/tiers/*.json` |
| Token and manifest construction | `src/build.ts`, `src/types.ts`, `src/presets.ts` |
| Typography/layout CSS | `src/css.ts`, `src/css-grid.ts`, `src/css-app-tier.ts` |
| Component assembly | `src/css-components.ts`, `src/css-components/*.ts` |
| Public runtime/API exports | `src/index.ts`, `package.json` |
| Demo catalog/runtime | `demo/page-catalog.js`, `demo/component-demo.js`, `demo/spec-runtime.js` |
| Static build contract | `scripts/validate-build.ts` |
| Browser baseline contract | `scripts/verify-component-baselines.ts` |
| Browser behavior contract | `scripts/verify-component-behavior.ts` |
| Screenshot catalog | `scripts/capture-component-screenshots.ts`, `scripts/component-demo-shared.ts` |

## Commands

```powershell
npm run build
npm run test:build
npm run test:components
npm run test:behavior
npm test
npm run qa:components
npm run demo:serve -- --host 127.0.0.1
```

`npm run build:theme` regenerates CSS, tokens, surface manifests, presets, and
experiments. `npm run build:lib` compiles TypeScript. `npm test` is the full
non-screenshot gate. `npm run qa:components` captures and verifies component
surfaces.

## Efficient search and reading

- Start from the active spec's file map. Do not preload all demos, generated
  CSS, or archived specs.
- Search source and config first. Inspect `dist/` only to verify generated
  contracts.
- `src/css-components.ts` is still a large assembly/legacy owner. New cohesive
  families should use a focused module under `src/css-components/` and preserve
  output order.
- Existing consumer evidence may live in sibling repos, but downstream product
  CSS is not the BF API. Separate reusable contracts from consumer features.

## Traps

- Shared class switching must be compared against direct tier bundles. A token
  present in direct `os.css` is not proof that `.bf-tier-os` is correct in
  `styles.css`.
- Test occupied control blocks, not raw border-box heights.
- Do not restore broad direct-child resets that erase baseline compensation.
  BF containers own semantic gaps, while metric-aligned text keeps its top
  nudge and bottom-margin compensation.
- Do not add arbitrary grid spans to solve a composed documentation layout.
- Article pagination is not numbered pagination and must not inherit disabled
  page-control behavior.
- `data-*` attributes may be JS/test hooks only and must never appear in CSS
  selectors.
- Generated font URLs are part of the consumer contract. Validate package
  contents, not only the source checkout.
- Existing `tmp/chevron-audit/` and `tmp/chevron-harness/` are user work. Do not
  delete or absorb them unless explicitly requested.

## Browser review

Use the demo catalog route for the affected component. Check the relevant tier,
desktop and constrained widths, focus/keyboard behavior, console output,
overflow, long copy, and RTL when the component is directional. Save durable
closeout evidence in the active package rather than this index.
