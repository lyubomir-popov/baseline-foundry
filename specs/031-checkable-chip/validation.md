# Checkable Chip validation — 2026-11-15

Product source `08fe52c`, isolated branch `feat/031-checkable-chip`, preserving
accepted comparison source/artifact lineage. Normal npm11.19 ci/font setup/build
and type checks pass; source/dependency configuration is unchanged.

- Final npm test exits 0: 19,577 static checks; 5,506 component checks across
  336 reports with no failures; comparison1,161, checkable Chip960, caption768,
  existing navigation/indicator and complete behavior suites pass.
- Final qa:components exits 0: 87 captures and 5,506 checks/336 reports, zero
  failures. QA used a separate clean detached same-source worktree to avoid
  parallel generated-output writes; normal ci/font setup completed there.
- New focused Chrome matrix covers96 combinations: four direct/shared tiers,
  root16/20, light/dark/forced colors and LTR/RTL. Uniform paint, selected mark,
  native names/keyboard/focus, reserved geometry/text keyline, narrow labels and
  unchanged ordinary Chip selection all pass.
- [Independent Astra](review.md) accepts the bounded source/rendered treatment:
  966 independent assertions, 48 equal direct/shared pairs and fresh screenshots
  viewed. Its findings/verdict are separate from these integrator observations.

Closed full logs and focused evidence are under reviews/evidence/validation/;
independent evidence is under reviews/evidence/astra/. No private consumer paint
override, font nudge, target height, library filter state engine or generated
source edit was introduced. Pointer active alone does not select the mark.

Prepare and qualify an immutable package next, then adopt only public markup in
portfolio. This acceptance does not publish, merge, approve final portfolio
visuals, clear CP4 or establish physical-device/AT/native200%zoom coverage.
