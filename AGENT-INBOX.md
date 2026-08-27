# Agent inbox

Spec 011 is accepted for release on `feat/011-site-shell-primitives`.
Start-aligned fixed rows, aligned pinned panel footers, quiet linked section
titles, scrollable tables and light-inset figures pass the full BF test,
capture and browser gates. Release BF before changing the consumer.

Spec 009 remains released at `be85d46a27d07794ec8f8057b35b557537e60a48`
and verified in Diagram Registry at `aec3d47`.

Preserve `tmp/chevron-audit/`, `tmp/chevron-harness/`, `tmp/vanilla-main/`, and
the duplicate `fix/typography-role-class-precedence` worktree. The sibling
Vanilla checkout has user changes in `yarn.lock`; do not clean or update it.
