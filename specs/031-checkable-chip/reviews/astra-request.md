# Independent Astra request — checkmarked filter Chips

Owner selected **Uniform outline with a checkmark** for portfolio filters.
Review exact source `08fe52c32e7e700f1bc0063d41961d39af484e58` on isolated
`feat/031-checkable-chip`, against `79e8055`/preserved base `0b026be`.
Spec031 owns this new scope; accepted comparison Spec030 remains unchanged.

Read BF instructions/spec/plan/tasks/README. Product source is frozen. Current
standalone demo is `http://127.0.0.1:64528/demo/components/chip.html`; it serves
this branch, not the accepted comparison server58656. Focused build/types/static
pass (19,577 checks), and integrated focused behavior passes 960 Chrome checks
over96 tier/direct-shared/root/theme/direction combinations. Full npm test is
running here; QA runs in a separate clean detached worktree at the same source,
`H:/WSL_dev_projects/baseline-foundry-worktrees/qa-031-checkable-chip`, avoiding
concurrent writes to generated output. Final exits will be supplied.

Challenge the opt-in public `bf-chip is-checkable`/`bf-chip-mark` anatomy:

- Uniform all-sided stroke, no extra bottom selection bar in hover/active/
  selected/focus or forced colors; ordinary Chip styling remains unchanged.
- Reserved governed icon space and leading gap preserve occupied height,
  compensation and text keyline through state changes. No hardcoded target size,
  local font nudge, layout border or consumer-private variable override.
- Selected check is visible/non-color and decorative; pointer press alone must
  not check an unselected button. Truthful native pressed state/filter behavior
  stay consumer-owned, with unchanged accessible name and one native focus stop.
- Existing semantic fill and independent keyboard focus remain clear. Exercise
  actual demo pointer/Space/Enter, narrow/long labels, LTR/RTL, all four direct/
  shared tiers, root16/20, light/dark/forced-colors; view fresh screenshots.
- Source changes are limited to Chip CSS, its demo wiring/docs and meaningful
  static/behavior coverage. Existing comparison/caption/Tab/Breadcrumb/runtime/
  font/manifest/config contracts must not regress. No new library filter engine.

Write full ranked findings/verdict/rechecks to this package's review.md and
separate independent evidence under reviews/evidence/astra/. You own only those
paths, not product/tasks/checkpoints. Do not build/install/stop services. The
coordinator will repair/recheck material findings before final qualification.
Complete required suite exits precede final acceptance; counts alone are not
rendered proof. Do not conflate Chrome automation with physical devices/native
AT/native UI zoom, owner visual/CP4 acceptance, or publishing permission.
