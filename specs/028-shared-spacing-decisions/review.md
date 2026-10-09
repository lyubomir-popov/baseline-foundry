# Current review outcome — mobile prerequisite completed

## ApplicationLayout mobile prerequisite completed — October 9

The real mobile drawer now owns its branding, Pin and Close. Below its own
48rem breakpoint, opening it removes shared catalog/header/footer rendering
and focus; Close or Escape restores the shared review controls. Product source,
spacing values, dependencies and comparison bundles are unchanged. Final demo
and harness source is `6f7f4683979746f1fbf96f6de77f6767560cec00`. Root type, full test, component QA and provenance
gates pass. The [integration review](reviews/application-chrome-integration-review.md),
[independent review](reviews/application-chrome-adversarial-review.md) and
[sequence audit](reviews/application-chrome-sequencing-audit.md) record exact
coverage and the preserved failed/cancelled attempts. The new 192-file evidence
seal has SHA-256 `a42f3bcfcf840fddd50b536e325f2d2acc46378e1d29831f4e81c234e9a24fc5`; all four earlier seals and protected receipts/probes
verify unchanged.

This completes the below-768px mobile prerequisite, with owner visual approval
still pending. A separate pre-existing wider-layout limitation remains: the
shared footer intercepts the real Pin pointer in Before and After Docs at
768px and Editorial at 1035px (four of 32 probes; keyboard Space works in all
32). These cases need follow-up before all-width ApplicationLayout approval.
Product non-modal background focus and DrawerPanel's shared chrome remain
limits. Chromium checks do not certify native Windows, Safari, full Firefox or
fractional viewport dimensions.

The accepted spacing repairs and accepted R1 remain closed. The next mandatory
external Opus checkpoint is the existing Spec 024 T011g popup-correction
request, linked in the [handoff](reviews/application-chrome-handoff.md).
Owner real-component visual sign-off, N2's outline fallback decision,
governing-main activation/full-SHA repin and a green dependency audit remain
open. T011i token contribution follows visual sign-off; Pragma implementation
follows its remaining planning and activation gates.

## Previous R1 acceptance closeout

# Current review outcome – R1 accepted, October 9

The October 7 verdict accepts the bounded spacing repairs. The October 9
follow-up requested changes for medium R1, with N2–N5 dispositions accepted.
Opus accepts R1's conditional shared-chrome focus correction.
The completed request is [the R1 correction](reviews/opus-028-r1-correction-review-request.md),
with [complete root findings](reviews/r1-integration-review.md) and
[independent findings](reviews/r1-adversarial-review.md). All previous requests,
reports, external receipts/probe material and sealed evidence remain unchanged.
Owner visual approval, N2's explicit fallback decision, governing-main activation
and a green dependency audit remain open. ApplicationLayout and non-modal
background focus are explicit limitations. Original evidence below is historical.

The [final packet claim audit](reviews/r1-handoff-review.md) accepts the handoff
after verifying all four root gates and the 166-file seal. That later report
is separate metadata outside the seal, like the review request.

The actual accepted review remains untracked and unchanged at
`opus-028-r1-correction-review.md`, SHA-256
`04630d8de77da208b7e11c9f17af3cc3dedfed22b16aff6fedb9b2f3bc8955df`.
Opus checked 12 Chromium SideNavigation states (Before/After, 390/1035/1036px,
LTR/RTL) plus Tooltip at 390px. In all eight narrow states, reverse Tab excluded
shared chrome, no descendants escaped hiding, brand/close controls were
hit-testable, pointer tier changes retained the specimen node and pointer
reopening hid shared chrome again. Boundary and Tooltip controls stayed visible.
Opus accepted recorded gates, CSS hashes and provenance without rerunning them.

Both non-blocking notes are dispositioned: the source comment now describes
header/footer hiding, and the catalog rail retains `display: none` because its
drawer explicitly sets `visibility: visible`. Self-review verifies the source
delta contains only this comment: removing CSS comments yields identical CSS,
and the behavior harness is byte-identical to the reviewed runtime. The prior
type/test/component QA/provenance results remain tied to `36c93b6a`; no new
browser or root-gate run is claimed for this comment-only closeout.

Reviewed-carrier CI runs [37991276508](https://github.com/lyubomir-popov/baseline-foundry/actions/runs/37991276508)
and [37991272123](https://github.com/lyubomir-popov/baseline-foundry/actions/runs/37991272123)
completed with passing engineering checks on Node 22.14.0 and Node 24, then
failed on the existing `source-map-js` audit. Raw failed logs are retained in
`H:/WSL_dev_projects/temp/bf-028-r1-acceptance-20261009/`. R1 acceptance closes
its review gate; the other blockers above and separate T011g popup review stay open.

# Review

Implementation source is complete at `12d47abb938aecb5884387c376560d8aab66a655`.
The identical-DOM review demo is committed at
`db10d20fd6c1dd67b91cd0f5b42c0035482398a4`. All final family gates and the
all-tier browser matrices are green.

The single external Opus checkpoint is prepared in
[`opus-028-review-request.md`](opus-028-review-request.md). Owner visual
sign-off, real Windows contrast-theme review, Safari review and the merge
decision remain pending; no board row claims `signed off`.

The sealed overall evidence manifest is
`H:/WSL_dev_projects/temp/bf-028-20261006/bf-028-evidence-manifest.json`, SHA-256
`204fdec1e22a5474e4f288c423a8e869666f7c7e76ac2c4af6abbd9b930660cf`.
Its root review manifest is SHA-256
`a6630a06c081233b82374f699b63542208bc467a594708fecb3ef188c88014b4`.
