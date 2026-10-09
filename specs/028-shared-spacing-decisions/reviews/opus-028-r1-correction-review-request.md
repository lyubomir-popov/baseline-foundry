# Opus correction request: R1 shared mobile chrome focus

Date: 2026-10-09

## Requested verdict

Review the R1 correction to N1 and its focus regression coverage. Return accept
or changes requested, with severity, reproduction and affected construction for
new findings. The prior follow-up verdict requested changes for one medium R1;
it accepted the N2–N5 dispositions and retained the earlier spacing corrections.
Do not reopen those accepted corrections without evidence of a regression.
The N2 fallback exception itself still requires the separate owner decision.

## Exact scope and pins

| Identity | Pin |
| --- | --- |
| Worktree | `H:/WSL_dev_projects/baseline-foundry-worktrees/feat-028-shared-spacing-decisions` |
| Branch | `feat/028-shared-spacing-decisions` |
| R1 runtime and regression harness | `36c93b6a23fe71e74dac7ea147e14e79c7372013` |
| Prior published follow-up / diff base | `f52d0dde3ba267954625f65b939cec90ed914e59` |
| Corrected product/After bundle source, unchanged | `dd9db8588e549f8f8a21acf6fcdb9585200c60b1` |
| Frozen Before source | `6deca99776f35b85afde01b68bb0fffe817e29aa` |
| Governing feature snapshot; main activation pending | `7169231fcc3168032275d920d32856f9669107ac` |

The subsequent documentation-only carrier saves this request, full findings,
the new seal and live routing. Find its exact pin with
`git log -1 --format=%H -- specs/028-shared-spacing-decisions/reviews/opus-028-r1-correction-review-request.md`.
Canonical T011h records the carrier after commit. No uncommitted runtime delta
is included. The two actual external receipts remain local and untracked:
`../opus-028-corrections-review.md` (accepted, SHA-256
`f3f0dc8b3409eeb3773e951b1b2ad62ce1b5bef837bd236601d65692493d4183`) and
`../opus-028-followup-review.md` (changes requested, SHA-256 `69882bae2c294b511e4f9ad1ced47019e07a1279140abcbcf6c041df660772aa`).

Read the latter full review and preserve both receipts and all original reports,
requests, the external probe directory and earlier sealed evidence. Review
`git diff f52d0dde3ba267954625f65b939cec90ed914e59 36c93b6a23fe71e74dac7ea147e14e79c7372013 -- demo/page-chrome.css scripts/verify-component-behavior.ts`.

## Repair and acceptance criteria

The previous N1 change lowered the shared header/footer to z-index 100, making
footer controls obscured but focusable under an expanded SideNavigation drawer.
The correction removes that unconditional mobile override. Under the existing
`width < 64.75rem` specimen-expanded `:has()` condition, direct shared header and
footer receive `visibility: hidden`; their layout boxes remain. The catalog's
existing `display: none` rule stays. Product CSS, markup, spacing, bundles,
dependencies and provenance are unchanged.

Challenge all of the following:

1. At 390px and 1035px, the actual SideNavigation brand and close control remain
   visible and hit-testable. A full Tab cycle starting at its close control must
   never reach shared header, footer or catalog controls while expanded.
2. Escape closes the specimen and restores shared chrome. A real full Tab cycle
   must reach Pages, Dark theme, Baseline grid, Bundle version and Tier, with
   visible hit-testable controls. Independently exercise their interaction.
3. Keyboard-reopened drawers must return focus to the actual opening trigger
   on Escape. The markup-initial expanded drawer has no recorded opening
   trigger: its initial recovery test explicitly focuses the now-available
   trigger before traversing shared controls. Automatic initial trigger return
   is not claimed or newly implemented.
4. Shared/specimen drawer state stays independent, desktop at 1036px and above
   retains visible shared chrome, resize and RTL work, bundle switching keeps
   actual specimen nodes, and raw Before/After hashes remain unchanged.
5. Unrelated Tooltip shared chrome remains available. The visibility claim is
   scoped to the SideNavigation specimen, not every drawer page.

Read [complete writer findings](r1-worker-review.md),
[independent adversarial findings](r1-adversarial-review.md),
[root integration findings](r1-integration-review.md), and
[full dispositions and limitations](r1-dispositions.md).

## Checks and evidence

At the exact runtime pin, root `check:types`, full `test`, `qa:components` and
`verify:spec-028-provenance` exit 0 with Node 22.21.1 / npm 11.19.0. Run:

```powershell
npx --yes npm@11.19.0 run check:types
npx --yes npm@11.19.0 test
npx --yes npm@11.19.0 run qa:components
npx --yes npm@11.19.0 run verify:spec-028-provenance
npx --yes npm@11.19.0 run demo:serve -- --host 127.0.0.1 --port 4176 --strictPort
```

Use `/demo/components/side-navigation.html?bundle=before` and `?bundle=after`.
Close the initial mobile specimen to operate shared tier/version controls;
reopen it independently. Browser probes use Chromium. Independent evidence
covers 64 states (2 bundles × 4 tiers × 4 widths × LTR/RTL), 8 resize cases and
8 unrelated Tooltip cases. Root verifies 16 narrow states and reproduces the
old regression in 8 baseline states. Raw static-server CSS hashes match all
8 provenance entries; Vite-transformed responses are not raw-bundle evidence.
Writer scope and exact attempts are recorded in the complete writer report.

The negative test against prior CSS fails on 7 shared focus stops (4 footer,
3 header). A first fixed attempt failed an overstrong initial-trigger-return
expectation; that existing runtime fact is now explicit. In root scratch, the
first recovery probe used ambiguous empty DOM IDs; the final probe uses distinct
control data hooks plus real hit checks. One initial reviewer scratch JSON was
overwritten before sealing. Its diagnostic is preserved in a clearly labeled
regenerated summary derived from final raw states; it is not an original log.
Other attempts and their disposition are documented. No original report,
receipt, request, external probe or prior sealed evidence was altered.

New evidence: `H:/WSL_dev_projects/temp/bf-028-r1-20261009/`.
The [manifest](r1-evidence-manifest.json) seals 166 files, SHA-256
`b0d995bd4be84ebac9a2358c07208a180cfe7d55b67739e8d196d9702dc52fc5`. The earlier 146-file and 207-file seals verify unchanged,
as do 38 protected files including both external receipts and the user's probe
material. The review request is outside the manifest to avoid a circular hash.

## Open gates and scope limits

ApplicationLayout at 390px still has shared chrome covering its navigation
branding/Pin/Close controls; it needs a separate repair before its mobile visual
approval. DrawerPanel's inspected Close, text/select and Apply controls remain
hit-testable, but its shared chrome stays above the expanded drawer/overlay.
Product SideNavigation remains non-modal: 10–11 background stops can be obscured
in the independent narrow-page cycles. R1 excludes shared chrome from focus; it
does not claim a product focus trap or full drawer accessibility conformance.

N2–N5 dispositions are accepted, with precise N3 release wording: **inputs with
no `type` attribute** join full BF field styling. Empty/invalid `type` attributes
do not match the added selector. N2's governing fallback exception, owner visual
approval, equivalent governing rulings on canonical main plus the resulting
full-main-SHA repin, and Spec 024 T011g's separate popup diagnostic Opus verdict
remain open. That [older popup request](https://github.com/lyubomir-popov/specs/blob/17ba0c431af1a18fb954b92d7cb0994db2250aec/specs/024-semantic-spacing-token-schema/opus-overlay-popup-correction-review-request.md)
is not closed by this review.

Prior carrier CI run 37978534940 completed with a dependency-audit failure on
transitive `source-map-js` (GHSA-68fv-2mgg-jv7q) after passing engineering gates.
Dependencies are unchanged in R1. A green release audit is still required; no
merge/release readiness or result for a later CI run is inferred. Full Firefox,
Safari, native Windows contrast/display scaling and fractional long-stack drift
remain limits. Pragma source, token publication, main merges and releases are
outside this checkpoint.

Write the new external verdict as a new report, e.g.
`../opus-028-r1-correction-review.md`. Preserve all original material.
