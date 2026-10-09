# Independent adversarial review — Spec 028 R1 mobile shared-chrome repair

Date: 2026-10-09  
Repository: `H:/WSL_dev_projects/baseline-foundry-worktrees/feat-028-shared-spacing-decisions`  
Branch / reviewed commit: `feat/028-shared-spacing-decisions` / `36c93b6a23fe71e74dac7ea147e14e79c7372013`  
Diff base: `f52d0dde3ba267954625f65b939cec90ed914e59`  
Reviewed source: committed `demo/page-chrome.css` and `scripts/verify-component-behavior.ts` (107 insertions, 18 deletions)  
Source hashes at review: page chrome `fc7e5b80601cd08e4a8fc98a51ba681c2abf6c9b478c8f5e744fbdc90adb0a9a`; behavior harness `a10a322478da369517dec0cc368e535423f5402de4e5f3200b038f6c473eb1b5`.

## Verdict

**Accept the bounded R1 construction for the next external checkpoint, conditional on the root-owned full gate completing green against these source hashes.** No blocker remains in the CSS or behavior-harness delta reviewed here. This is an independent reviewer verdict, not an Opus verdict, owner visual approval, merge readiness, or release readiness.

The repair is correctly bounded. Below `64.75rem`, while the direct `.pc-content` contains an expanded real SideNavigation specimen, the direct shared header and footer use `visibility: hidden`; the already accepted shared catalog rule remains `display: none`. This preserves the shared boxes but removes their rendering, hit testing, accessibility-tree exposure, and sequential focus stops. The unconditional mobile `z-index: 100` override is removed, eliminating that product-z-index coupling. Closing the specimen removes the condition and restores the normal shared chrome.

The behavior harness now traverses a full document Tab cycle from the in-drawer close control and requires a return to that control, excluding every shared header/footer/navigation stop. After Escape it performs a real Tab cycle and requires keyboard reach plus centre hit ownership for Pages, Dark theme, Baseline grid, Bundle version, and Tier. It repeats the expanded-state cycle after a keyboard reopen and retains the shared/specimen state-independence check.

## Finding caught and resolved during review

The first worker harness applied the reopened-drawer focus-return expectation to the initially expanded markup state. My first matrix failed all 32 narrow states on that assertion. The initial HTML carries `is-drawer-expanded`, but `src/side-navigation.ts` records `lastTriggerByRoot` only when `openDrawer(sideNavigation, trigger)` runs. Therefore initial Escape closes correctly but cannot restore an unrecorded trigger; focus remains on the now-hidden in-drawer close button. After a keyboard reopen, Escape restores the recorded trigger in all 32 states.

The final harness correctly distinguishes the cases: initial Escape closes, then explicitly focuses the product trigger before testing actual shared-control reachability; reopened Escape must restore trigger focus. No product-runtime change was made or warranted in this chrome-only slice.

Custody note: the first failed `r1-browser-audit.json` was overwritten by the corrected rerun, so the original failed JSON artifact was not retained. The failure was reported immediately to root and worker. `initial-focus-negative-control-regenerated.json` is explicitly labeled as a newly derived summary from the final raw matrix, not the original attempt.

## Independent browser evidence

`r1-browser-audit.json` (SHA-256 `a8c56d563f23e4681f91c60300a3c054ee61459ec0d498b501f43a37e47a223d`) records a green Chromium matrix served by Vite on port 4191:

- 64 real SideNavigation states: Before/After × editorial/documentation/app/OS × 390/1035/1036/1440 × LTR/RTL.
- All 32 narrow states (390 and 1035) pass initial and reopened complete Tab cycles with no shared-chrome stop, retained header/footer boxes, hidden header/footer, removed catalog, and real brand/close centre hit ownership.
- All 32 narrow states pass post-Escape real Tab reach and hit ownership for Pages plus all four footer controls. Reopened Escape returns focus 32/32. Initial Escape returns focus 0/32 for the intentional runtime reason above; the subsequent explicit trigger focus and full recovery cycle pass 32/32.
- All 32 boundary/desktop states (1036 and 1440) retain visible shared header/footer and catalog.
- Eight resize states (Before/After × four tiers) pass 1440 → 1035 → 1036, proving activation and exact complementary breakpoint recovery without a reload.
- Eight unrelated Tooltip states at 390 (Before/After × four tiers) keep shared chrome visible.
- Shared Pages open/Escape and product reopen remain independent; reopening the product never reopens the catalog.
- Bundle switching preserves the connected real specimen node.
- All eight raw Before/After tier bundle SHA-256 values match `demo/spec-028/provenance.json`.
- No page or console errors were observed.

`preexisting-pages-audit-final.json` (SHA-256 `3640c63916cbb238d8e9aec98eae8043d166c76767b6c92d477625e2da0c3f6a`) separately inspects the deliberately excluded pages against the final `z-index: 130` chrome in both bundles at 390×844:

- ApplicationLayout reproduces the pre-existing overlap. The open drawer's `MAAS control plane` brand does not own its centre hit; Pin and Close are intercepted by shared footer selects in both bundles. This page uses `.bf-navigation`, so the R1 SideNavigation selector must not be widened implicitly. It needs separate repair/review before mobile visual approval.
- DrawerPanel uses `.bf-application.is-drawer-expanded`, also outside R1. Its product Close, text/select, and Apply centres remain hit-testable in both bundles, while Pages/header/footer visibly remain above the expanded product overlay/drawer. No universal drawer viewport-ownership claim is supported.

Screenshots for both pages and a representative SideNavigation RTL state are in this reviewer directory.

## Disclosed product limitation outside R1

The product SideNavigation remains non-modal. Every one of the 32 narrow initial and reopened full cycles reached 10–11 non-specimen/content stops whose centres were obscured by the product overlay/drawer. This is the pre-existing product-background-focus issue identified by the external review. R1 removes only the newly obscured shared chrome from focus. It does not supply a focus trap or full drawer accessibility conformance and must not be described that way.

## N2–N5 disposition review

- N2's disposition is accepted, but the exception itself remains an owner decision. Bare native fields and raw native cells still use an all-sided forced-colors outline where the governing rule calls for a one-sided fallback. Explicit owner acceptance through the ruling process or a directed construction change is still required.
- N3 wording is now exact: **inputs with no `type` attribute** join full BF field styling. `type=""` and invalid values such as `type="foo"` are still unmatched by `input:not([type])` and can retain browser defaults unless another selector applies.
- N4 remains a reasonable deferred schema migration to stable codes plus separate prose, with migration and negative controls at the next schema change.
- N5 remains a correctly disclosed forced-colors-only containing-block caveat with an explicit revisit trigger before positioned descendants are added.

## Validation boundary and remaining gates

I reviewed the actual final commit and diff, ran `git diff --check`, and ran the independent browser matrices above. The worker-reported focused behavior pass, root type check (1.72 seconds), and root full test (269.41 seconds) passed at `36c93b6`. Root owns the remaining component QA, provenance, and preservation checks against the earlier 146-file and 207-file seals; acceptance here is conditional until root records those green against the source hashes above.

Owner visual approval, N2 owner disposition, B2 governing-main activation/full-SHA repin, the separate Spec 024 T011g external popup verdict, and the dependency-audit repair remain open. Firefox, Safari, native Windows contrast/display scaling, and fractional long-stack drift remain outside this Chromium review.

No repository source, docs, requests, review receipts, sealed evidence, prior reviewer directories, commits, or pushes were changed by this reviewer. All reviewer writes are new files under `H:/WSL_dev_projects/temp/bf-028-r1-20261009/reviewer/`.
