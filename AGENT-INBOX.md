# Agent inbox: live state

This file owns only the current handoff, blockers, and last-known-green state.
Durable execution order lives in `TODO.md`; completed Spec 001 intent and evidence
live in [`docs/spec-archive/001-baseline-foundry-renewal/`](docs/spec-archive/001-baseline-foundry-renewal/).

## Current task

The navigation-grid and shared emphasis-bar fixes are complete on
`fix/navigation-grid-border-thickness`, based on local `main` after Spec 001 was
closed, fast-forwarded, and archived. The branch is ready for review and merge.

Implemented contracts:

- Desktop `bf-top-navigation.is-grid-aligned` now uses the shared eight-column
  tracks and gutter: the banner spans columns one and two, and primary
  navigation starts at column three and spans the remaining six columns.
- The obsolete fixed brand-region token was removed from config, types,
  generated-token construction, docs, demos, and tests.
- `--bf-bar-thickness: 0.1875rem` is the single generated 3px emphasis-bar
  contract used by navigation markers, tabs, notifications, data spotlights,
  document/in-page navigation, and highlighted rules. Thin structural borders
  remain on `--bf-border-width`.
- Data spotlight fixtures now include their required highlighted rule. Their
  five-row subgrid prevents action links from overlapping descriptions, with a
  browser regression covering the spacing.
- The fixed demo catalog sidebar preserves its session scroll position across
  page navigation and reload. Direct deep routes fall back to centring the
  active entry when it would otherwise be outside the sidebar viewport.
- The pattern catalog uses project-native `Patterns` and `Site compositions`
  labels, without redundant Vanilla port naming.

The rebuilt editorial CSS and tokens were copied to the sibling
`diagram-registry` checkout without adding a consumer override. Its documented
validation suite passed. Live Chrome review at 1,280px and 2,560px confirmed
that the primary navigation starts at the computed third content column; the
2,560px positions were exactly 944px in both cases, with no browser warnings or
errors.

## Preservation boundary

Preserve `tmp/chevron-audit/`, `tmp/chevron-harness/`, and the Vanilla comparison
snapshot under `tmp/vanilla-main/`. The sibling Vanilla checkout has user
changes in `yarn.lock`; do not pull over or clean that checkout. The sibling
`diagram-registry` checkout is outside this repository; treat any consumer work
there as unrelated. Only its two vendored Baseline Foundry assets belong to this
handoff.

## Last known green

On 2026-08-21, final `npm test` passed with 5,071 build assertions, all component
baseline records, and the complete behavior suite. Final
`npm run qa:components` generated 87 screenshots and passed every record with
zero baseline, overflow, or coverage failures. Affected screenshots were
reviewed for top navigation, tabs, notifications, data spotlight, side
navigation, and in-page navigation.

After the demo-navigation restoration on 2026-08-21, `npm run test:build` and
`npm run test:behavior` passed. Live Chrome review confirmed the Notification
entry remained visible at the same 1,620px sidebar scroll position after
navigation and reload.

After the catalog naming cleanup on 2026-08-21, `npm run test:build` passed all
5,071 assertions.

The downstream `diagram-registry` validation also passed:
`validate_registry.py`, `audit_site_copy.py`, three Python unit tests, and seven
Node security tests. Its one unresolved immutable-revision warning is the
documented internal example warning and is unrelated to this refresh.

## Blockers

None for the fix branch. The in-app browser backend remains unavailable, so the
historical Spec 001 in-app catalog pass remains recorded as unperformed in the
archived review; repository Playwright, screenshot QA, and the downstream live
Chrome check were completed without rewriting that evidence.
