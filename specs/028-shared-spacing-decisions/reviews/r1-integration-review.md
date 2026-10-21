# Root integration review: R1 mobile chrome focus correction

Date: 2026-10-09
Branch: `feat/028-shared-spacing-decisions`
Runtime target: `36c93b6a23fe71e74dac7ea147e14e79c7372013`
Diff base: `f52d0dde3ba267954625f65b939cec90ed914e59`

## Verdict and scope

Accept the bounded R1 correction for external rereview. The actual October 9
Opus receipt requested changes for medium R1 against N1: lowering the footer
under the drawer left its shared controls focusable while obscured. That receipt
accepts N2–N5 dispositions and retains the October 7 spacing corrections. It
remains untracked and byte-preserved; it is not replaced by this integration
verdict. No new Opus verdict, owner visual approval or merge readiness is claimed.

Root inspected the actual two-file diff (107 additions, 18 removals), complete
writer and independent findings, the browser scripts/results, failure ledger,
required gate logs, and representative settled open/closed screenshots.

The correction removes the unconditional mobile z-index 100 rule and adds
`visibility: hidden` to direct shared header/footer under the same narrow
specimen-expanded `:has()` condition. The catalog retains `display: none`.
Header/footer boxes remain in layout while rendering, clicks and focus stops are
removed. Closing restores ordinary chrome. Product CSS/runtime/markup, spacing,
config, package manifests/lockfile, Before bundles and provenance are unchanged.

## Findings and disposition

- R1 construction: resolved in the code under review. Actual complete forward
  Tab cycles from the product close control cannot reach shared chrome while
  expanded. After Escape, real cycles reach Pages and all four footer controls,
  with visible hit ownership. The previous CSS negative control reaches 7 shared
  stops (4 footer, 3 header) and fails the new exclusion assertion.
- Initial/reopened harness duplication and incomplete reopened cycle: resolved
  by one helper that requires actual return to the close control, with a full
  document-cycle bound. Recovery uses distinct control data hooks, not counts or
  programmatic focus alone.
- Initial Escape focus assumption: resolved in the harness, not product runtime.
  Initial markup has no recorded opener; the runtime only records a trigger when
  opened through it. Initial Escape closes, then the recovery test explicitly
  focuses the now-available trigger. Reopened Escape must automatically return
  to that trigger. The initial focus remains on the now-hidden close control in
  independent observations; no automatic initial focus return is claimed.
- N2–N5: accepted dispositions remain intact. N2's exception itself still needs
  owner acceptance through the ruling process or a directed construction change.
  N3 wording is now inputs with no `type` attribute; empty/invalid type values
  are outside the added selector. N4 schema and N5 containing-block caveats keep
  their agreed revisit conditions.
- ApplicationLayout: reproduced pre-existing 390px obstruction of brand/Pin/Close
  by shared chrome, both bundles, including after the restored chrome z-index.
  Record a known limitation and separate future repair; do not widen R1's selector
  or imply all mobile drawer pages are corrected.
- DrawerPanel: independently inspected Close, text/select and Apply remain
  hit-testable in both bundles; shared chrome still paints above its expanded
  overlay/drawer. No universal viewport-ownership claim is made.
- Product non-modal background focus: 10–11 obscured non-specimen stops persist
  in independent narrow cycles. They predate R1 and remain disclosed outside
  this shared-chrome correction; full drawer accessibility is not certified.

## Required gates at exact runtime target

Node 22.21.1, npm 11.19.0 pinned through `npx --yes npm@11.19.0` from the repository
root. Host npm 10.9.4 was not used for the final gate runner.

| Gate | Exit | Seconds | Raw record |
| --- | --- | --- | --- |
| `check:types` | 0 | 1.72 | `root-check-types-final.json` / `.log` |
| Full `test` (build/static/component/browser behavior) | 0 | 269.41 | `root-test.json` / `.log` |
| `qa:components` (capture and component verification) | 0 | 121.50 | `root-qa-components.json` / `.log` |
| `verify:spec-028-provenance` | 0 | 2.33 | `root-verify-spec-028-provenance.json` / `.log` |

The provenance check resolves source commits, verifies four tiers and rejects
an invalid full SHA. The complete component screenshot output is copied into
the new evidence directory, separately from earlier seals.

## Browser and integration evidence

- Independent: 64 SideNavigation states, Before/After × four tiers ×
  390/1035/1036/1440 × LTR/RTL. All narrow initial/reopened exclusion and restored
  keyboard/hit checks pass. Desktop chrome stays visible. Eight resize cases
  cover 1440→1035→1036, and eight unrelated Tooltip cases keep chrome visible.
- Writer: 16 static-server states at 960px, Before/After × four tiers × LTR/RTL,
  with initial/reopened complete cycles, actual recovered keyboard/hit access,
  retained boxes, no overflow/errors and raw response hashes matching provenance.
  Together these cover 80 SideNavigation states across all five requested widths;
  root does not describe the 64 independent states as 80 independently run states.
- Root: 8 baseline states at 390 reproduce the prior regression; 16 repaired
  static-server states at 390/1035 × versions × tiers show zero shared stops and
  keyboard access to four distinct recovered footer controls with actual hits.
  Settled 390px After/App LTR and RTL screenshots and hit records show the actual
  brand and close control unobscured with shared chrome hidden.
- Root independently reproduced ApplicationLayout's blocked centres and inspected
  its screenshot. Bundle switching preserves connected real specimen nodes in
  independent evidence. Eight raw filesystem hashes match provenance independently;
  writer also verifies raw HTTP CSS bytes through a static server.

Browser checks use Chromium. Firefox/Safari, native Windows contrast/display
scaling and fractional long-stack drift remain limits.

## Attempts and custody

The writer ledger distinguishes a meaningful old-CSS negative failure, an
overstrong initial-focus assertion, an interrupted second behavior attempt,
final behavior pass, scratch TypeScript/import/serialization errors, and a
corrected 960 probe sentinel. These are not concealed as product passes.

Root's first recovery probe used empty DOM IDs, so it did not distinguish all
four footer controls. The final probe uses stable distinct data hooks and actual
control/label hits; the previous probe results/scripts are retained. Root's first
open screenshot sampled during the drawer transition; separately named settled
screenshots establish the visual claim. Neither problem required product edits.

The independent review disclosed one overwritten first scratch JSON before the
new seal. The regenerated diagnostic is explicitly derived from final raw
initial-state observations, not presented as the lost original attempt. This
limits original-attempt replay but retains the diagnosed fact and final matrix.

Root verifies both previous sealed sets (146 and 207 files), 38 protected original
reports/requests/receipts/probe/spec inputs, and unchanged product/config/dependency/
Before/provenance inputs. The new manifest enumerates the files actually sealed;
the request and later handoff review are separate metadata, outside that seal.
No original report/request/receipt, user's external probe or prior seal changed.

## Separate gates and stopping point

Prior carrier CI run 37978534940 completed failure only at the dependency audit
after engineering checks passed: transitive `source-map-js`, GHSA-68fv-2mgg-jv7q.
The raw failure log is preserved. R1 changes no dependencies; the audit remains
a CI/release blocker. No green release gate is inferred from engineering checks.

Owner visual approval, N2's fallback ruling decision, equivalent governing rules
on canonical main plus full-main-SHA repin, and Spec 024 T011g's separate popup
Opus verdict remain open. Pragma source, token publication, main merges and
releases are outside this checkpoint. Stop at the new R1 correction request;
leave the external Opus verdict to the user. Temporary worker/root/reviewer
servers must be closed before handoff. Both existing PRs stay draft/donotmerge.
