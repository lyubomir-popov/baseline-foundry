# Agent inbox: live state

This file owns only the current handoff, blockers, and last-known-green state.
Durable intent and evidence live in the active spec package; execution order
lives in `TODO.md`.

## Current task

Spec 001's Vanilla and Sites parity renewal is implemented on
`feat/001-baseline-foundry-renewal`. The implementation commit containing this
handoff is the immutable source for downstream refreshes. Owner acceptance and
the explicitly requested in-app-browser catalog pass remain before merge and
archive.

The durable contract and review evidence live in
[`specs/001-baseline-foundry-renewal/`](specs/001-baseline-foundry-renewal/),
especially [`review.md`](specs/001-baseline-foundry-renewal/review.md) and
[`contracts/vanilla-sites-parity.md`](specs/001-baseline-foundry-renewal/contracts/vanilla-sites-parity.md).

## Preservation boundary

Preserve `tmp/chevron-audit/`, `tmp/chevron-harness/`, and the clean Vanilla
comparison snapshot under `tmp/vanilla-main/`. The sibling Vanilla checkout has
user changes in `yarn.lock`; do not pull over or clean that checkout.

## Last known green

On 2026-08-17, `npm test` passed with 5,061 static assertions, all 338
four-tier records, and the complete behavior suite. `npm run qa:components`
generated 87 screenshots and passed all 338 records with zero baseline,
overflow, or coverage failures. Opus's notification-dismissal Low is fixed with
a keyboard-focus regression. The canonical-tag regression screenshot is now
durable Spec 001 evidence; the unrelated GPU debug log was removed.

## Blockers

The in-app browser backend is unavailable; browser discovery exposed Chrome
only, and Chrome was not substituted. T102/T105 therefore remain open. An
earlier in-app pass covered corrected pagination at 900px and 304px, while the
complete catalog and responsive matrix remain covered by repository Playwright
and screenshot QA.
