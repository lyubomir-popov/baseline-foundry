# User Notes — Open Items

Completed items moved to `docs/history.md`.

## Still open

1) Generate the list of examples for the specs from:
   - `grid-examples.prompt.md`
   - `spacing-examples.prompt.md`

2) Continue visual parity pass against Vanilla for remaining `Partial` rows: `forms`, `navigation`, `table-icons`, `links`, `lists`, `icons`.

3) Verify remaining regressions from the controls gallery:
   - Chips should use small caps (not uppercase)
   - Buttons should have same background as page unless semantically colored
   - Ensure no lingering bold on body-text UI elements

4) ~~Switch to Ubuntu Sans across the entire baseline-foundry project. IBM Plex was just for testing — Ubuntu Sans is the production font for all tiers.~~ **Done (Phase 6).**

5) Controls page cleanup:
   - Site navigation drawer should list all pages (currently empty except close button)
   - Two switches + tier dropdown should be in a cluster (side by side), not stacked
   - Remove the hero section, data-controls-summary, and all marketing copy
   - Do not style data-* attributes for layout; use bf-* classes (dogfooding rule)
   - Input/button padding should be symmetric top/bottom; border should be exactly 1px
   - Need an index page at / and /demo/ so the entry point is not blank

6) Continue visual parity verification against Vanilla for all controls.

