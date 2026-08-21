# Agent inbox: live state

This file owns only the current handoff, blockers, and last-known-green state.
Durable execution order lives in `TODO.md`; completed Spec 001 intent and evidence
live in [`docs/spec-archive/001-baseline-foundry-renewal/`](docs/spec-archive/001-baseline-foundry-renewal/).

## Current task

The navigation-grid, shared emphasis-bar, notice-bar consistency, and Fluid
Breakout removal work is complete on local `main`. The verified follow-up was
fast-forwarded after the navigation-grid branch and is ready to push.

Implemented contracts:

- Desktop `bf-top-navigation.is-grid-aligned` now uses the shared eight-column
  tracks and gutter: the banner spans columns one and two, and primary
  navigation starts at column three and spans the remaining six columns.
- The obsolete fixed brand-region token was removed from config, types,
  generated-token construction, docs, demos, and tests.
- `--bf-bar-thickness: 0.1875rem` is the single generated 3px emphasis-bar
  contract used by navigation markers, tabs, notices, notifications, data
  spotlights, document/in-page navigation, and highlighted rules. Thin
  structural borders remain on `--bf-border-width`.
- Fluid Breakout has been removed from the public CSS build, generated output,
  demo catalog and Pattern Atlas, fixture inventory, and behavior/build QA.
- Data spotlight fixtures now include their required highlighted rule. Their
  five-row subgrid prevents action links from overlapping descriptions, with a
  browser regression covering the spacing.
- The fixed demo catalog sidebar preserves its session scroll position across
  page navigation and reload. Direct deep routes fall back to centring the
  active entry when it would otherwise be outside the sidebar viewport.
- The catalog and live specimen copy use project-native `Patterns` and
  `Site compositions` labels without redundant ancestor branding.
- Spacing and grid examples synchronously restore their shared tone and tier
  before specimen content is parsed, preventing the former light/unstyled
  first frame before the saved surface appeared.
- Direct example-page `main` elements occupy the content column beside the
  fixed catalog navigation. App Provisions no longer renders underneath the
  navigation rail.

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

After the example pre-paint fix on 2026-08-21, `npm test` passed with 5,090
build assertions plus the full baseline and behavior suites. The new behavior
regression verifies the saved App/dark surface while the deferred example
runtime is blocked. `npm run qa:components` also recaptured 87 screenshots and
passed all baseline records.

After the App Provisions shell fix and public naming audit on 2026-08-21,
`npm run test:build` passed all 5,090 assertions and `npm run test:behavior`
passed. Live Playwright review captured App Provisions with visible content in
the 2,272px-wide main column beside the 288px navigation rail.

After the notice-bar fix and Fluid Breakout removal on 2026-08-21, `npm test`
passed with 5,064 build assertions plus the full baseline and behavior suites.
`npm run qa:components` generated 86 screenshots and passed every record with
zero baseline, overflow, or coverage failures. Live Chrome review confirmed
the Empty State notice uses the shared `0.1875rem` emphasis-bar token.

The downstream `diagram-registry` validation also passed:
`validate_registry.py`, `audit_site_copy.py`, three Python unit tests, and seven
Node security tests. Its one unresolved immutable-revision warning is the
documented internal example warning and is unrelated to this refresh.

## Blockers

None for the fix branch. The in-app browser backend remains unavailable, so the
historical Spec 001 in-app catalog pass remains recorded as unperformed in the
archived review; repository Playwright, screenshot QA, and the downstream live
Chrome check were completed without rewriting that evidence.
