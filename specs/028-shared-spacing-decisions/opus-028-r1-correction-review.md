# Opus correction review: R1 shared mobile chrome focus

Date: 2026-10-09
Request: `specs/028-shared-spacing-decisions/reviews/opus-028-r1-correction-review-request.md` at `ca0523340798c31e98c5edaba7b231c9e003cee0`
Diff reviewed: `f52d0dde3ba267954625f65b939cec90ed914e59..36c93b6a23fe71e74dac7ea147e14e79c7372013` (`demo/page-chrome.css`, `scripts/verify-component-behavior.ts`)
Runtime check: `git diff --quiet 36c93b6 ca05233 -- demo src scripts` exits 0, so the carrier adds no runtime delta.
Prior receipt: `../opus-028-followup-review.md` SHA-256 `69882bae2c294b511e4f9ad1ced47019e07a1279140abcbcf6c041df660772aa`, verified unchanged.
Probe: `H:/WSL_dev_projects/temp/opus-028-r1-probe/` (`probe.mjs`, `probe-output.json`), outside every sealed evidence set.

## Verdict

**Accept.** R1 is resolved. No new findings above nit. The N2–N5
dispositions and the earlier spacing corrections stand; no regression to
them was found.

## What the repair does

The unconditional mobile `.pc-header, .pc-footer { z-index: 100; }` is gone,
so chrome returns to its original 130 whenever no specimen drawer is open. Under
the existing `width < 64.75rem` + `:has(… .bf-side-navigation.is-drawer-expanded)`
condition, the direct header and footer get `visibility: hidden`, alongside the
catalog's existing `display: none`. Layout boxes are kept; hit testing, tab order
and the accessibility tree all drop the hidden chrome together. This is the
construction the follow-up review suggested, and it also removes the
undocumented coupling to product z-indexes 98/101/102.

## Independent verification

Chromium via Playwright against Vite on port 4188, 12 SideNavigation
states (Before/After × 390/1035/1036 × LTR/RTL) plus Tooltip at 390.

| Check | Result |
| --- | --- |
| Expanded at 390/1035: header/footer `visibility` | `hidden` in all 8 narrow states |
| Expanded: brand and in-drawer close hit-test | Both hit themselves in all 8 |
| Expanded: any rendered chrome descendant with computed `visibility: visible` (descendant override escape) | 0 in all 8 |
| Expanded: full **Shift+Tab** cycle from close (the harness only covers forward Tab) | Never enters header/footer/nav; returns to close in all 8 |
| Escape then pointer change of Tier select | `app` → `editorial`; same specimen DOM node retained in all 8 |
| Pointer (not keyboard) reopen of specimen | Chrome hidden again, brand/close hit-testable in all 8 |
| 1036px | Chrome visible; drawer is the static rail; close control not rendered, as expected |
| Tooltip at 390 | Header/footer visible, header z-index 130 |

The harness diff is sound: focus-stop counts are taken from rendered,
`visibility: visible` controls, the cycle is bounded by that count plus two
and must close on the starting control, and the restored cycle checks
hit-testable Pages, Dark theme, Baseline grid, Version and Tier through
stable `data-page-chrome-*` hooks rather than IDs. Making the
initial-state trigger focus explicit, rather than claiming automatic return
for a markup-open drawer, is the honest framing.

## Nits (non-blocking)

- The comment above the catalog rule still describes suppressing only "the
  demo catalog rail". It now governs header and footer as well; extend it by
  a clause or move it above both rules.
- `visibility: hidden` is overridable by descendants. Today nothing escapes
  (verified above), and the shared SideNavigation's own
  `.bf-side-navigation-drawer { visibility: visible }` cannot escape because
  `.pc-nav` uses `display: none`. Keep `.pc-nav` on `display: none`; don't move
  it to `visibility`.

## Scope limits accepted as disclosed

- ApplicationLayout at 390px still has shared chrome covering its navigation
  brand, Pin and Close controls. The request records this correctly as a
  separate repair, needed before that page's mobile visual approval.
- Product SideNavigation stays non-modal; background content stops can still
  be reached under the overlay. R1 doesn't claim a focus trap, and it doesn't
  need to.
- N3 wording ("inputs with no `type` attribute"; empty/invalid `type` values
  unmatched) is now exact.

## Not re-run here

Root `check:types`, `test`, `qa:components` and
`verify:spec-028-provenance`, raw static-server CSS hashes, and the sealed
manifests were accepted as reported. Firefox, Safari, native Windows contrast
themes and display scaling remain disclosed limits. Still open: the
`source-map-js` dependency-audit failure, owner visual approval, N2's fallback
exception, governing-main activation and re-pin, and Spec 024 T011g's separate
popup review. This acceptance doesn't close any of them.
