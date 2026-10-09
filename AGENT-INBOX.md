# Agent inbox — mobile prerequisite completed; popup checkpoint next

Date: 2026-10-09
Branch: `feat/028-shared-spacing-decisions`
Final demo/harness source: `6f7f4683979746f1fbf96f6de77f6767560cec00`
Product/After source: `dd9db8588e549f8f8a21acf6fcdb9585200c60b1`
Before source: `6deca99776f35b85afde01b68bb0fffe817e29aa`

ApplicationLayout's recorded mobile prerequisite is completed with demo-only
CSS and regression coverage. Real brand/Pin/Close work below 48rem; complete
forward/reverse Tab excludes hidden shared chrome. Close/Escape restore shared
controls and the recorded opener. Root types, full test, component QA and
provenance pass. Full findings and exact evidence are in
`specs/028-shared-spacing-decisions/reviews/application-chrome-integration-review.md`
and its adjacent worker/independent/sequence reports. New 192-file seal:
`a42f3bcfcf840fddd50b536e325f2d2acc46378e1d29831f4e81c234e9a24fc5`.

The external spacing correction acceptance, N2–N5 dispositions and R1
acceptance remain satisfied. The three actual untracked external receipts,
all prior requests/reviews, probes and four previous seals are unchanged.
SideNavigation's accepted CSS is unchanged; its harness now waits for settled
paint before unchanged hit assertions. Failed and cancelled attempts remain
separate from final green logs.

## Next action and stopping point

The next mandatory external Opus review is the existing Spec 024 T011g popup
correction request, not another R1 or ApplicationLayout cycle. See
`specs/028-shared-spacing-decisions/reviews/application-chrome-handoff.md`.
T011h remains open for owner real-component visual approval and N2's explicit
outline fallback decision. Equivalent governing-main activation/full-SHA repin
and the existing source-map-js dependency audit failure remain gates. T011i
contributes signed-off values to design-tokens after T011h sign-off. Do not
start token or Pragma phases through these gates. Spec 026 remains parked.

Four pre-existing wider-layout Pin pointer overlaps remain: Before/After Docs
768px and Editorial 1035px. They need separate follow-up before all-width
ApplicationLayout approval. Product non-modal background focus and DrawerPanel
shared chrome remain limits. Full Firefox/Safari/native Windows contrast and
display scaling, fractional viewport pixels and long-stack drift are unclaimed.
N3 release wording remains "inputs with no `type` attribute"; empty/invalid
types are excluded. No waiver, owner approval, main merge, release or token
publication is inferred.

Owner demo server is intentionally available at `http://127.0.0.1:4176` from
this worktree. Temporary writer/reviewer servers are closed. Open the real
ApplicationLayout specimen at 390px; Close/Escape recovers the shared footer
controls. Initially expanded SideNavigation likewise hides shared controls
until closed. Server ownership details live in the separate publication scratch.
