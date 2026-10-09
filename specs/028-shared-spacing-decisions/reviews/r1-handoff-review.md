# Final handoff claim audit — Spec 028 R1 correction packet

Date: 2026-10-09  
Repository: `H:/WSL_dev_projects/baseline-foundry-worktrees/feat-028-shared-spacing-decisions`  
Runtime target: `36c93b6a23fe71e74dac7ea147e14e79c7372013`  
Diff base: `f52d0dde3ba267954625f65b939cec90ed914e59`  
Request: `specs/028-shared-spacing-decisions/reviews/opus-028-r1-correction-review-request.md`  
Request SHA-256: `c676bdc7111f3431602670a4b43836f35a3ef5c61bd235f71e96955e2eb8194b`  
Evidence-manifest SHA-256: `b0d995bd4be84ebac9a2358c07208a180cfe7d55b67739e8d196d9702dc52fc5`

## Verdict

**Accept the R1 correction packet for the requested external review.** I found no blocking or medium claim error in the final request, source pin, evidence summaries, live BF routing, or disclosed limitations. This is a final handoff/claim audit by the independent reviewer; it is not the requested external Opus verdict, owner visual approval, merge readiness, or release readiness.

The earlier conditional independent verdict is now satisfied. At the exact runtime target, root `check:types`, full `test`, `qa:components`, and `verify:spec-028-provenance` all exit 0. The new 166-file evidence seal verifies with zero missing or mismatched files. Root custody records verify 38 protected files and both earlier sealed sets (146 and 207 files), and report product/config/dependency/Before/provenance inputs unchanged.

## Request and source claims

The request accurately identifies the two-file R1 source range: 107 insertions and 18 deletions in `demo/page-chrome.css` and `scripts/verify-component-behavior.ts`. At widths below `64.75rem`, the direct shared header/footer become `visibility: hidden` only while a direct `.pc-content` descendant SideNavigation specimen is expanded; the existing catalog `display: none` rule remains. The unconditional mobile `z-index: 100` rule is removed. No product component runtime, markup, spacing, bundle, dependency, or provenance input is included in the correction.

The request also describes the final harness correctly. Initial and keyboard-reopened drawers each require a complete forward Tab cycle that returns to the in-drawer close control without reaching `.pc-header`, `.pc-footer`, or `.pc-nav`. After Escape, a real cycle must reach Pages and all four footer controls with centre hit ownership. The markup-initial drawer does not have a recorded opening trigger, so its recovery test explicitly focuses the now-available outer trigger. Only a keyboard-reopened drawer claims automatic Escape return to its recorded trigger.

No uncommitted runtime delta exists after `36c93b6`; the remaining worktree changes are the documented review/routing carrier and preserved untracked external receipts. The request correctly leaves that later documentation carrier to be pinned after commit.

## Evidence audit

I checked the evidence package rather than relying on the prose summaries alone:

- The manifest enumerates 166 files. Recomputing every listed SHA-256 under `H:/WSL_dev_projects/temp/bf-028-r1-20261009/` found 166/166 present and matching.
- The four final root gate receipts all name source commit `36c93b6` and exit 0: types 1.72 seconds, full test 269.41 seconds, component QA 121.50 seconds, and provenance 2.33 seconds.
- The root baseline probe has 8 cases and consistently reaches 7 shared stops under the old CSS. The final root probe has 16 cases and zero shared stops; its distinct keyed recovery records all four footer controls as keyboard reached with actual hit ownership.
- The independent matrix contains 64 SideNavigation states: Before/After × four tiers × 390/1035/1036/1440 × LTR/RTL. Its narrow initial/reopened full cycles, recovery, exact breakpoint behavior, 8 resize cases, 8 unrelated Tooltip cases, node identity, and eight filesystem bundle hashes pass.
- The writer's plain-static-server supplement contains 16 distinct 960px states: Before/After × four tiers × LTR/RTL. All have empty initial/reopened shared-stop sets, true navigation-plus-four-footer recovery, retained hidden boxes, owned brand hit, no errors/overflow, and raw HTTP CSS hashes matching provenance.
- The resulting 80-state claim is correctly presented as the union of 64 independent states and 16 writer states. The packet does not relabel all 80 as independently run states.
- The independent first failed scratch JSON was overwritten before sealing. The packet says so directly and labels the replacement as a regenerated summary derived from final raw states. It does not present that derivative as the original attempt.

## Scope and limitation claims

The exclusions are stated accurately and remain visible in the request, dispositions, worker report, independent report, integration report, and active BF routing:

- ApplicationLayout still reproduces the pre-existing 390px obstruction of its brand, Pin, and Close controls in both bundles. It uses `.bf-navigation` and requires a separate repair/review before mobile visual approval; R1 does not widen its selector.
- DrawerPanel uses `.bf-application.is-drawer-expanded`. Its inspected Close, text/select, and Apply controls remain hit-testable, while shared chrome stays above its expanded overlay/drawer. No universal drawer-ownership claim is made.
- Product SideNavigation remains non-modal. Independent full cycles still find 10–11 obscured non-specimen background stops. R1 repairs the shared-chrome regression only and does not claim a focus trap or full drawer accessibility conformance.
- N2–N5 dispositions remain accepted, while N2's all-sided forced-colors fallback exception itself still requires an owner ruling or a directed construction change. No waiver is inferred.
- N3 is worded precisely as inputs with no `type` attribute. `type=""` and invalid values such as `type="foo"` do not match the added `input:not([type])` selector.
- Owner visual approval, Canonical-main activation/full-SHA repin, Spec 024 T011g's separate popup verdict, and a green dependency audit remain open. The existing transitive `source-map-js` audit failure is disclosed; R1 changes no dependencies and does not claim merge/release readiness.
- Firefox, Safari, native Windows contrast/display scaling, and fractional long-stack drift remain explicit platform limits.

The active BF inbox, backlog, spec catalogue, Spec 028 status/plan/tasks/quickstart/review, dispositions, and request consistently route the next action to the external R1 correction review. I found no stale BF claim that R1 already has an external verdict or that the separate open gates are closed.

## Custody and publication boundary

The request and this later handoff audit are intentionally outside the 166-file manifest, avoiding a circular seal. I made no repository or sealed-evidence write during this final audit. This report is the only publication-audit artifact and lives outside the sealed evidence root at `H:/WSL_dev_projects/temp/bf-028-r1-publication-20261009/r1-handoff-review.md`.
