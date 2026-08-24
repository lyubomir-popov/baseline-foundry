# Agent inbox

Spec 005 is active on `feat/005-side-navigation-icon-alignment`. Icon-bearing
side-navigation rows currently center an icon against the complete label block,
placing it between lines when text wraps. Align it to the label's first-line
baseline in BF, prove expanded/collapsed geometry, then refresh Registry from
the released generated bundle without consumer CSS.

Preserve `tmp/chevron-audit/`, `tmp/chevron-harness/`, `tmp/vanilla-main/`, and
the duplicate `fix/typography-role-class-precedence` worktree. The sibling
Vanilla checkout has user changes in `yarn.lock`; do not clean or update it.
