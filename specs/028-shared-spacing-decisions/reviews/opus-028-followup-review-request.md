# Opus follow-up request: mobile demo chrome and review dispositions

Date: 2026-10-09

## Requested verdict and stopping point

Review the new N1 shared demo-chrome correction and the accuracy of the N2–N5
dispositions. Return an accept or changes-requested verdict with severity,
reproduction and the exact affected construction for any new finding.
Do not reopen the already accepted spacing corrections without evidence of a
regression. The October 7 receipt accepted those bounded corrections; it did
not mandate another review after N1. This focused boundary follows the owner's
current request to work through the next Opus checkpoint.

The separate mandatory Spec 024 T011g request is
[overlay popups and dense Chip source](../../../../../canonical-spacing-spec-worktrees/docs-bottom-compensation-spec/specs/024-semantic-spacing-token-schema/opus-overlay-popup-correction-review-request.md).
Its actual verdict is still missing. This BF follow-up is not a substitute for
that diagnostic review. Owner visual approval and B2 activation remain separate.

## Exact review targets

| Identity | Pin |
| --- | --- |
| Repository/worktree | `H:/WSL_dev_projects/baseline-foundry-worktrees/feat-028-shared-spacing-decisions` |
| Branch | `feat/028-shared-spacing-decisions` |
| New demo runtime and regression-check source | `2abf5e8576fce8780ce3a68caecaa3ef89106444` |
| Diff base / prior published carrier | `5720ba3d61a3cadabbeb97089b9a6b62b42ff7db` |
| Corrected product and After bundle source, unchanged | `dd9db8588e549f8f8a21acf6fcdb9585200c60b1` |
| Frozen Before source | `6deca99776f35b85afde01b68bb0fffe817e29aa` |
| Governing feature snapshot, activation pending | `7169231fcc3168032275d920d32856f9669107ac` |
| Governing local main / published main at inspection | `cad4aacf91b7e70bee81730552b76ef0d8291a34` / `a601f4c3e8df558c1bd0ca8d3918d523377d659b` |

The following documentation-only carrier adds this request, complete worker and
integration reports, the manifest and live routing. Discover its exact commit
with `git log -1 --format=%H -- specs/028-shared-spacing-decisions/reviews/opus-028-followup-review-request.md`;
Canonical T011h records that carrier after commit. No uncommitted source delta
is part of the review target. The actual prior external acceptance remains a
local untracked file, `../opus-028-corrections-review.md`, SHA-256
`f3f0dc8b3409eeb3773e951b1b2ad62ce1b5bef837bd236601d65692493d4183`.

## Read and challenge

1. The original [correction request](../opus-028-corrections-review-request.md)
   and accepted external receipt; preserve their bytes and the prior seal.
2. `git diff 5720ba3d61a3cadabbeb97089b9a6b62b42ff7db 2abf5e8576fce8780ce3a68caecaa3ef89106444 -- demo/page-chrome.css scripts/verify-component-behavior.ts`.
3. [Complete writer findings](followup-worker-review.md),
   [independent findings](followup-adversarial-review.md), and
   [root integration verdict](followup-integration-review.md).
4. [Full N1–N5 dispositions](followup-dispositions.md), especially the unresolved
   N2 accessible one-sided boundary exception and N3 untyped-input scope change.

At 390px, the real SideNavigation page starts with a viewport-owning specimen
drawer expanded. Shared chrome previously obscured its brand and close control.
The fix hides shared catalog navigation while that specimen is open and paints
the shared header/footer beneath it. Closing the specimen restores the catalog and review
controls. It changes shared demo chrome only; no component spacing or markup
changes and no hidden/replaced brand may be accepted as a remedy.

Challenge actual brand and close-control visibility/hit testing, shared Pages
and specimen drawer independence, keyboard open/Escape/focus return, controls
recovery after settled transitions, the 1035/1036px breakpoint, wrapping/RTL,
version switching and preserved real specimen nodes. Check unaffected Tooltip
and spacing pages and raw Before/After bundle identity.

## Reproduction and evidence

From the BF worktree:

```powershell
npx --yes npm@11.19.0 run check:types
npx --yes npm@11.19.0 test
npx --yes npm@11.19.0 run qa:components
npx --yes npm@11.19.0 run verify:spec-028-provenance
npx --yes npm@11.19.0 run demo:serve -- --host 127.0.0.1 --port 4176 --strictPort
```

Use `/demo/components/side-navigation.html?bundle=before` and `?bundle=after`.
Close the specimen drawer to access shared Before/After and tier controls, then
exercise the catalog and reopen the specimen independently. Use actual viewports
at 390/960/1440px; include 1035/1036px breakpoint checks. A temporary plain static
server is required for raw CSS response hashes: Vite transforms CSS responses.
The saved root and reviewer harnesses start and close their own static servers.

Required type/test/QA/provenance gates all exit 0 at `2abf5e8576fce8780ce3a68caecaa3ef89106444`.
Writer: 72 states plus RTL long-brand; independent: 80 states; root: 16
breakpoint states. Failed harness attempts are retained with their final
dispositions. Prior seal: 146/146 files unchanged; 10 protected files unchanged.

Follow-up evidence: `H:/WSL_dev_projects/temp/bf-028-followup-20261009/`.
The [manifest](followup-evidence-manifest.json) records 207 files,
SHA-256 `6a305e7a81edd28b893747ec223005a336f6d45aef4a88ed5bec307e18be513d`. All copied screenshot and final gate artifacts are
sealed separately from the old evidence. Scripts and raw logs permit independent
reproduction; no browser platform sign-off beyond the stated probes is claimed.

## Open gates and limits

The existing published draft's CI and fresh root audit fail on one high-severity
transitive `source-map-js` advisory. See the integration report and preserved
CI/audit logs. Dependency repair and a green release audit remain outstanding;
no merge or release readiness is claimed by the green engineering gates.

Owner visual approval, N2's explicit acceptance or changed construction, B2
governing-main activation/full-SHA re-pin, and Spec 024 T011g remain open. N3
must remain visible in owner/release communication. N4/N5 retain their stated
revisit conditions. Full Firefox, Safari, actual Windows contrast/display
scaling and fractional long-stack drift remain disclosed limits. Pragma source,
design-token publication, main merges and releases are outside this checkpoint.

Write the external verdict as a new report. Leave the original reports,
requests, accepted receipt and sealed evidence unchanged.
