# Comparison validation — 2026-11-15

Product source: `2524b24`, on isolated `feat/030-image-comparison`, based on
caption-preserving `df966ac`. Normal npm11.19 ci installs 43 packages and audits
clean. Node is 22.21.1. No unrelated worktree/root branch was switched or edited.

## Required final gates

- `npm run check:types` and `npm run build` pass.
- `npm test` exits 0: 19,471 static checks; 5,494 component checks in 336 reports,
  zero failures; 1,161 focused Chrome comparison assertions; 768 caption and
  48 Breadcrumb cases; complete existing behavior suite passes.
- `npm run qa:components` exits 0: 87 captures and the same 5,494 component checks
  in 336 reports, zero failures. Existing suite browser choices are unchanged;
  the new focused runtime/media proof explicitly uses installed Chrome.
- Focused native naming/style ownership: 44 Chrome assertions pass. Native
  consumer names, including rich/image/ARIA labels and title, survive metadata/
  source/value changes and teardown. Hidden-only unnamed markup remains a
  documented consumer error; this runtime does not infer or certify AccName.
- Independent eight-case pixel proof (four tiers, light/dark) shows opaque
  letterbox canvas at 100 with unequal image ratios and no inline backgrounds.
  The documented transparent-canvas override intentionally reveals the other slot.
- Type/build/diff checks pass; no tracked generated output is hand-edited.

Full logs and focused results are under [validation evidence](reviews/evidence/validation/).
Independent findings/rechecks are in [review.md](review.md), with separate raw
evidence under `reviews/evidence/astra/`. Their attribution and verdict remain
independent from this integrator receipt.

## Adversarial corrections

Root integration first reproduced an empty-label fallback error in `7a6123f`.
The narrow `b320266` correction still attempted textContent-based AccName
inference. Astra reproduced hidden-only false acceptance and rich/image label
false rejection. Before release, the API was narrowed: native names belong to
consumer HTML/ARIA; BF owns only endpoint value text. The speculative name
convenience/heuristic was removed rather than replacing native naming with an
incomplete accessibility algorithm. Actual positive native names remain tested.

Astra also reproduced second-panel leakage through a first image's letterbox
at 100, and a runtime-created empty style attribute left after teardown.
`2524b24` adds the opaque theme canvas and removes only an originally absent,
still-empty runtime style attribute, preserving consumer edits. Initial red
observations remain preserved beside the corrected rechecks.

## Boundary

Four direct/shared tiers, LTR/RTL/computed direction, root sizes, constrained
geometry, focus, capture/touch/cancel/reentrancy, media and teardown are verified
within the actual assertions. Physical devices, native screen-reader speech,
native 200% UI zoom and other engines are not claimed by Chrome checks. Consumer
idle direction changes call update({}); continuous controlled state and nested
comparison hosts remain outside the minimal API. Fixed 80px grip height is
out-of-flow decoration, not native/text occupied-row sizing.

This technical work does not clear portfolio CP4, accept final authored assets
or visuals, merge, push, publish or deploy. Immutable candidate packaging and
portfolio consumption follow the independent technical verdict.
