# Agent inbox

Spec 010 is ready for review on `feat/010-sticky-footer-hero-media`. It fixes
application-hosted sticky footer flow and adds the shallow-lead/final-media
hero composition. `npm test`, `npm run qa:components`, and manual narrow/wide
browser review are green. Merge to `main` is intentionally pending owner
review; downstream consumers must vendor the eventual immutable merge commit.

Spec 009 remains released at `be85d46a27d07794ec8f8057b35b557537e60a48`
and verified in Diagram Registry at `aec3d47`.

Preserve `tmp/chevron-audit/`, `tmp/chevron-harness/`, `tmp/vanilla-main/`, and
the duplicate `fix/typography-role-class-precedence` worktree. The sibling
Vanilla checkout has user changes in `yarn.lock`; do not clean or update it.
