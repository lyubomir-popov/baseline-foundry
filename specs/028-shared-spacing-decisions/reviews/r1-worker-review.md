# Writer findings — Spec 028 R1 shared-chrome focus repair

Date: 2026-10-09  
Branch: `feat/028-shared-spacing-decisions`  
Reviewed base: `f52d0dde3ba267954625f65b939cec90ed914e59`  
Final source identity: `36c93b6a23fe71e74dac7ea147e14e79c7372013`  
Worker ownership: `demo/page-chrome.css`, `scripts/verify-component-behavior.ts`, and this new worker scratch directory only.

## Result

The bounded R1 source is ready for independent review. Under the existing mobile-only SideNavigation specimen ownership condition, the direct shared header and footer now use `visibility: hidden`; the shared `.pc-nav` remains `display: none`. The unconditional mobile `z-index: 100` override is removed. The shared header/footer boxes remain in layout while their descendants leave rendering, hit testing, the accessibility tree, and sequential focus navigation. Closing the specimen removes the condition and restores the ordinary `z-index: 130` shared chrome.

The behavior contract now starts at the specimen's in-drawer close control and completes a whole document Tab cycle. It requires a return to that close control without entering `.pc-header`, `.pc-footer`, or `.pc-nav`. It runs for both the markup-initial expanded state and a keyboard-reopened state. After Escape, a real Tab cycle must reach and centre-hit the Pages toggle plus Dark theme, Baseline grid, Bundle version, and Tier controls. Keyboard-reopened Escape must return focus to its recorded opener.

The markup-initial drawer has no recorded opener. `src/side-navigation.ts` records `lastTriggerByRoot` only in `openDrawer(sideNavigation, trigger)`, while the markup-open state is initialized by state synchronization. Initial Escape therefore closes correctly but cannot restore an opener that was never recorded. The final test explicitly focuses the outer specimen trigger after initial Escape before exercising restored shared controls. This distinction is test-only; no product runtime was widened.

## Exact source diff

Exact range: `f52d0dde3ba267954625f65b939cec90ed914e59..36c93b6a23fe71e74dac7ea147e14e79c7372013`

```text
 demo/page-chrome.css                 |   9 ++-
 scripts/verify-component-behavior.ts | 116 +++++++++++++++++++++++++++++++----
 2 files changed, 107 insertions(+), 18 deletions(-)
```

`git diff --check` is clean for that range. Final SHA-256 values:

- `demo/page-chrome.css`: `fc7e5b80601cd08e4a8fc98a51ba681c2abf6c9b478c8f5e744fbdc90adb0a9a`
- `scripts/verify-component-behavior.ts`: `a10a322478da369517dec0cc368e535423f5402de4e5f3200b038f6c473eb1b5`

The worker made no commit or push. Root created the source identity above after the worker declared the final source freeze.

## Focused validation

| Check | Result | Evidence |
|---|---|---|
| Negative control against `f52d0dd` mobile CSS with the new test | Expected failure, exit 1 | `negative-f52d0dd-test-behavior.log` (`f39225a20e6b856dca80575672d68101dbddbaf8ca9f3a17e03a8816ee46719c`) |
| Negative-control observation | Reached 7 shared stops: 4 footer controls and 3 header links | Same log |
| Final `npm run check:types` | Pass, exit 0 | Console run immediately before final behavior |
| Final `npm run test:behavior` | Pass, exit 0 | `fixed-test-behavior-attempt-3.log` (`1f115af811c7d5fb363a10aa273651e64b94b960018715fba35029595d6fb777`) |
| Requested 960 supplement: Before/After × 4 tiers × LTR/RTL | 16/16 pass | `probe-960-results.json` (`6020e48bccf089d69152450d2b552e5c9e0d24429d2dbd5fd2bff97123315a23`) and `probe-960-run-attempt-2.log` (`1a217bca5a350db261509627954881d53efbd94d8137f3c2a260219ebdf71637`) |

The 960 probe used a plain static server and raw product pages. Every initial and keyboard-reopened full Tab cycle had zero shared-chrome stops. All recovery cycles reached and centre-hit the navigation plus four footer controls. Header/footer layout boxes remained non-zero while hidden. Brand centre ownership, no horizontal overflow, no runtime/console errors, and all eight raw Before/After tier bundle hashes matched `demo/spec-028/provenance.json`.

## Full browser matrix

The completed Chromium evidence is the union of the independent reviewer matrix and the writer's 960 supplement:

- 80 SideNavigation states: Before/After × editorial/documentation/app/OS × 390/960/1035/1036/1440 × LTR/RTL.
- The independent 64-state matrix covers 390, 1035, 1036, and 1440. Its report is `H:/WSL_dev_projects/temp/bf-028-r1-20261009/reviewer/independent-adversarial-review.md`; raw results are `reviewer/r1-browser-audit.json`.
- The writer's 16-state static-server supplement covers 960 in `probe-960-results.json`.
- All 48 narrow states at 390, 960, and 1035 exclude shared chrome in initial and reopened full Tab cycles and restore real keyboard/hit access after Escape.
- All 32 states at 1036 and 1440 retain visible desktop shared chrome.
- Eight independent resize states cover 1440 → 1035 → 1036 without reload and confirm exact breakpoint activation/recovery.
- Eight unrelated Tooltip states at 390 keep shared chrome visible.
- All eight bundle hashes match provenance. No page or console errors were recorded.

The root integration probe independently passed 16 repaired states and the root full test passed at the final source identity. Root owns the final component QA, provenance, and protected-evidence closeout records.

## Preserved scope and known limitations

The selector remains exactly scoped to a direct `.pc-content` descendant `.bf-side-navigation.is-drawer-expanded`. ApplicationLayout uses `.bf-navigation`; DrawerPanel uses `.bf-application.is-drawer-expanded`. Neither was added to R1.

The independent final known-limit audit (`reviewer/preexisting-pages-audit-final.json`) confirms ApplicationLayout's pre-existing 390px overlap in both bundles: the open drawer brand does not own its centre hit, and Pin/Close are intercepted by shared footer controls. This requires a separate construction and review before mobile visual approval. DrawerPanel remains outside R1 and does not support a universal drawer-ownership selector.

The product SideNavigation itself remains non-modal. Independent full cycles still reach 10–11 obscured non-specimen content stops. R1 repairs only the new shared-chrome regression; it does not add a focus trap or claim full drawer accessibility conformance.

N2's review disposition is accepted, but there is no owner waiver for its all-sided forced-colors fallback. Owner acceptance through the governing process or a directed construction change remains required. N3–N5 remain as accepted in the follow-up review and were not changed by R1.

No product CSS/config, packages, frozen Before bytes, provenance, original reports/requests, accepted reviews, probe material, or sealed evidence was changed. Existing unrelated repository changes remain owned by other workers. Firefox, Safari, native Windows contrast/display scaling, and fractional long-stack drift remain outside this Chromium repair pass.

## Attempt ledger

All attempts were preserved separately.

- `fixed-test-behavior-attempt-1.log`: source had the CSS repair and first full-cycle helper; failed because it incorrectly required opener restoration for markup-initial expansion.
- `fixed-test-behavior-attempt-2.log`: began after restricting automatic restoration to reopened state; deliberately interrupted before an exit sentinel so the initial-state recovery could explicitly focus the trigger. It is unfinished, not a product failure.
- `fixed-test-behavior-attempt-3.log`: final source, exit 0.
- `matrix-run-attempt-1.log`: scratch TypeScript harness used top-level await under CJS output.
- `matrix-run-attempt-2.log`: scratch harness tried Playwright `selectOption` on controls correctly hidden by R1.
- `matrix-run-attempt-3.log`: scratch transpilation leaked `__name` into a browser callback.
- `matrix-run-attempt-4.log`: Windows absolute ESM imports lacked `file://` URLs.
- `matrix-run-attempt-5.log`: ESM conversion still leaked `__name` into browser callbacks. These are discarded scratch-harness failures, not product failures; the script and logs remain for custody.
- `probe-960-run.log`: the first plain-CJS probe used one marker on both hidden close and restored trigger, causing its recovery cycle to stop early with no controls recorded.
- `probe-960-run-attempt-2.log`: corrected element-identity cycle sentinels, 16/16 pass, exit 0.

No worker-owned probe, behavior test, browser, or static server remains running.
