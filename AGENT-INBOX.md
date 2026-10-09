# Agent inbox – Spec 028 R1 correction review checkpoint

Date: 2026-10-09
Branch: `feat/028-shared-spacing-decisions`
Runtime target: `36c93b6a23fe71e74dac7ea147e14e79c7372013`

The October 7 correction verdict accepted the bounded spacing repairs. The
October 9 follow-up verdict requested changes for medium R1: N1's z-index
adjustment left shared footer controls obscured but focusable. N2–N5 dispositions
are accepted. Both actual untracked receipts, all prior reports/requests, the
external probe and the 146/207-file evidence seals remain unchanged.

R1 is repaired with conditional shared header/footer `visibility: hidden`,
retained layout boxes, and no unconditional z-index 100 override. Complete Tab
cycles exclude shared chrome while the SideNavigation specimen is expanded;
Escape restores keyboard-reachable, hit-testable shared controls. Reopened
Escape restores trigger focus. The markup-initial drawer has no recorded
trigger; the initial recovery test explicitly focuses the available trigger.
Product CSS/runtime, values, Before/After bundles and provenance are unchanged.

## Next action and stopping point

Review `specs/028-shared-spacing-decisions/reviews/opus-028-r1-correction-review-request.md`.
Full writer, independent, root findings and dispositions are adjacent. Required
type/test/component QA/provenance gates pass at the runtime pin. The new manifest
seals 166 files, SHA-256 `b0d995bd4be84ebac9a2358c07208a180cfe7d55b67739e8d196d9702dc52fc5`.
Implementation stops at this external R1 correction checkpoint; no Opus verdict
or owner visual sign-off is inferred. Temporary servers are closed. Close the
initially expanded mobile specimen to access shared tier/version controls.

ApplicationLayout's 390px branding/Pin/Close overlap and product non-modal
background focus remain known limitations outside R1. DrawerPanel controls were
hit-testable but its shared chrome still paints above its expanded overlay.
N3 release wording is "inputs with no `type` attribute"; empty/invalid types do
not join the added selector. N2 still requires a ruling-process owner decision
or directed construction change; accepted disclosure is not a fallback waiver.

Owner visual approval, equivalent governing-main activation/full-SHA repin,
the separate Spec 024 T011g popup verdict and a green dependency audit remain
open. Prior carrier CI 37978534940 finished failing on `source-map-js` after
green engineering checks. Full Firefox/Safari/native Windows contrast/display
scaling and fractional long-stack drift remain limits. No Pragma source work,
main merge, release, token publication or exception is claimed.
