# Agent inbox

Spec 004 is active on `feat/004-application-navigation-geometry`. Diagram
Registry exposes two shared defects: the desktop navigation drawer stops at
content height, and collapsed labels/headings retain layout height after their
inline size is reduced to zero. The fix belongs in BF source with browser
geometry coverage; do not add consumer CSS.

Specs 002 and 003 are merged, archived, and green.

Preserve `tmp/chevron-audit/`, `tmp/chevron-harness/`, `tmp/vanilla-main/`, and
the duplicate `fix/typography-role-class-precedence` worktree. The sibling
Vanilla checkout has user changes in `yarn.lock`; do not clean or update it.
