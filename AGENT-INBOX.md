# Agent inbox

Spec 009 is active on `feat/009-semantic-list-spacing`. Diagram Registry proved
that semantic lists in component copy slots still inherited the global reset's
zero margin because Spec 008 scoped space-after to `.bf-prose`. The fix must
give ordinary `ul`/`ol` the body role's space after across all four tiers while
preserving explicit zero-margin structural list resets.

Preserve `tmp/chevron-audit/`, `tmp/chevron-harness/`, `tmp/vanilla-main/`, and
the duplicate `fix/typography-role-class-precedence` worktree. The sibling
Vanilla checkout has user changes in `yarn.lock`; do not clean or update it.
