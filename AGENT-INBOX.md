# Agent inbox: Spec 003 implementation

Spec 002 merged to main on 2026-08-24. The active package is
`specs/003-flush-side-navigation/` on `feat/003-flush-side-navigation`.

## Scope

1. Add an explicit flush modifier to the panel-content contract while
   preserving the padded default.
2. Compose application side navigation through the modifier so active rows
   reach the drawer edge and their contents retain component-owned insets.
3. Keep the merged application viewport-fill and application-gutter behavior.
4. Prove all three contracts in generated CSS and browser geometry.
5. Release from BF main, then refresh Diagram Registry without local CSS.

## Preservation boundary

Preserve `tmp/chevron-audit/`, `tmp/chevron-harness/`, `tmp/vanilla-main/`, and
the duplicate `fix/typography-role-class-precedence` worktree. The sibling
Vanilla checkout has user changes in `yarn.lock`; do not clean or update it.

## Last known green

Spec 002 passed `npm test` and `npm run qa:components` on 2026-08-24 before
merge. The integrated viewport-fill branch was green before integration.

## Blockers

None. Duplicate-worktree cleanup remains explicitly out of scope.
