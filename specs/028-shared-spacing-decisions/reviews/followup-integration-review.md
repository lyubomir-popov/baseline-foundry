# October 9 follow-up integration review

Date: 2026-10-09
Branch: `feat/028-shared-spacing-decisions`
Source/runtime target: `2abf5e8576fce8780ce3a68caecaa3ef89106444`
Diff base: `5720ba3d61a3cadabbeb97089b9a6b62b42ff7db`

## Verdict

Accept the bounded N1 mobile chrome correction for the next external review.
No new implementation blocker remains in this delta. This is the orchestrator's
integration verdict, not Opus, owner visual sign-off, or merge readiness.

## Requirements and actual changes

The accepted October 7 external correction review identified a real Pages
toggle overlapping the visible SideNavigation brand at 390px. A viewport-owning
specimen drawer must retain visible, hit-testable brand and close controls.
The shared catalog and component drawer must keep independent state and focus;
the shared review controls must recover when the specimen closes.

Commit `2abf5e8576fce8780ce3a68caecaa3ef89106444` changes only `demo/page-chrome.css` and
`scripts/verify-component-behavior.ts`: 55 insertions, 2 deletions. Below the
existing 64.75rem breakpoint, shared catalog navigation yields while a real
specimen drawer is expanded, and shared header/footer paint below that drawer.
Closing the specimen restores the shared catalog. The checked-in behavior
suite now covers the real SideNavigation page, brand hit ownership, keyboard
open/close, Escape focus restoration, drawer independence and bundle switching.

No spacing values, product source/config, dependency files, frozen Before CSS
or provenance metadata changed. Generated bundles retain corrected source
`dd9db8588e549f8f8a21acf6fcdb9585200c60b1`; the new pin identifies demo runtime
and regression checks, not a newly built spacing implementation.

## Independent and root checks

- Writer: 72 Chromium states across real SideNavigation, Tooltip and spacing
  pages, Before/After, four tiers and 390/960/1440px; zero errors. A separate
  RTL extended-brand probe verifies wrapping, bounds and actual hit ownership.
  Full worker report: [followup-worker-review.md](followup-worker-review.md).
- Independent Sol 5.6 reviewer: 80 states across Before/After, all tiers,
  390/960/1035/1036/1440px and LTR/RTL. It checks settled drawer transitions, controls,
  focus, state isolation, node identity, scrolling and raw frozen bundle hashes.
  Full verdict: [followup-adversarial-review.md](followup-adversarial-review.md).
- Root: 16 independent plain-static-server states at the 1035/1036px breakpoint,
  all tiers and versions. Actual brand hit ownership, Pages keyboard/Escape,
  controls recovery, specimen identity and no overflow pass with no page errors.
- Root read the actual two-file diff and complete worker reports, inspected
  Before/After screenshots, confirmed scope against the accepted receipt,
  and verified the prior 146-file seal plus 10 protected files unchanged.

All required root gates use Node 22.21.1 and npm 11.19.0:

| Target | Exit | Log | SHA-256 |
| --- | ---: | --- | --- |
| `check:types` | 0 | `root-check-types.log` | `495868b9969288e49fe43f0c79cdcb673fe488529af95a020247b5335ddf69ea` |
| `test` | 0 | `root-test.log` | `3992ea607fbe5185c2a52ba2325b03b57dccdfe9f4c5e5b79a0efd26d4528ed3` |
| `qa:components` | 0 | `root-qa-components.log` | `f0aed169c8602d7c975934dba059f482a5b9539e5a2eb5bab52a44d8f82b4a4e` |
| `verify:spec-028-provenance` | 0 | `root-verify-spec-028-provenance.log` | `c5ce9b26b635d62b7cd40b1d3a54fcc9e9c44bfa7b0e8e7e5f779a3cf270aaeb` |

Raw follow-up evidence is under `H:/WSL_dev_projects/temp/bf-028-followup-20261009/`. The prior correction
manifest remains `9a454edc12176811ae25a6506d0bdcc5ea0d52d22be5cb6018efc7f33df62aae`.
The original requests/reports and untracked accepted receipt remain unchanged.

## Failed attempts and repair review

Writer failures were scratch-harness issues: an unsettled 160ms drawer
transition and a Windows drive path passed as an ESM import instead of a file
URL. Independent initial probes also hashed Vite-transformed CSS against raw
bundle hashes and sampled closing animations. Failed artifacts remain distinct.
Final browser probes use settled transitions and raw/plain-static hash checks.
No product requirement was waived and no source repair followed these harness
corrections. Both final matrices and the root breakpoint pass challenge the
same immutable source commit.

## Open findings and boundaries

[followup-dispositions.md](followup-dispositions.md) records the full N1–N5
dispositions. N2 requires explicit owner acceptance or a changed accessible
construction: bare native fields/raw cells use all-sided forced-colors outlines
where the governing one-sided rule expects a one-sided fallback. N3 discloses
untyped inputs joining full native-field styling. N4 prose-literal provenance
validation and N5 forced-colors leaf containing blocks remain minor deferred
items with explicit revisit conditions.

The published draft's existing CI run
[37967995190](https://github.com/lyubomir-popov/baseline-foundry/actions/runs/37967995190)
passed its engineering checks and failed `npm audit`. A fresh root audit also
exits 1: one high-severity transitive `source-map-js` advisory
([GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q)).
Dependencies are unchanged by this delta. This is an open release/CI blocker;
no audit bypass or unrelated dependency change is part of the chrome repair.

Owner visual approval, N2 disposition and B2 canonical-main activation/full-SHA
re-pin remain open. Spec 024's separate T011g popup diagnostic still needs its
actual external Opus verdict before Pragma source work. Full Firefox, Safari,
native Windows contrast themes/display scaling and fractional long-stack drift
remain the previous disclosed limits. No merge or release is authorized here.
