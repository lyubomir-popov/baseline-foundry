# Spec sequencing audit — 2026-10-09

Read-only audit of BF `feat/028-shared-spacing-decisions` at `9d23de59d02582039c07f644a48c2617af13613d` and Canonical `docs/bottom-compensation-spec` at `1d4f2f68769dc28de2d46606faf1e03ee33e9a26`. No source/spec/receipt files were changed.

## Finding

A narrowly scoped ApplicationLayout demo chrome/harness repair is supported before approving that mobile composition. BF Spec 028 `tasks.md:151-155` explicitly tracks the 390px brand/Pin/Close overlap for “a separate shared-chrome repair before its mobile visual approval.” `spec.md:66-68` and `plan.md:17-23` preserve it as a known limitation outside the accepted R1 correction. Therefore it is not an R1 correction/reopen, but it is a prerequisite to approving the affected mobile visual. Cross-spec `TODO.md:8-13` says the overlap remains a known limitation while requesting owner visual sign-off; read with the narrower per-spec task, this means other visual decisions can proceed, while that composition's mobile approval should wait for repair.

## Next sequence and gates

1. Complete the bounded demo-only overlap repair and its targeted evidence before visual approval of the affected mobile composition (`specs/028-shared-spacing-decisions/tasks.md:151-155`). Keep the R1 receipt, sealed evidence and accepted correction untouched (`AGENT-INBOX.md:23-36, 39-44`).
2. The next outstanding external Opus checkpoint is Canonical Spec 024 T011g's popup-correction review, not another Spec 028 R1 review. Current owner-direction text says T011g closes when `opus-overlay-popup-correction-review-request.md` is accepted and P2/P3 findings are recorded on the conformance board without rereview (`specs/024-semantic-spacing-token-schema/tasks.md:801-807`). The 2026-10-05 BF-switch handover says that review is pending and to close T011g after it lands (`gpt-handover-bf-switch-2026-10-05.md:13-15`). T011g and T011h are distinct: BF real-component owner sign-off is T011h (`tasks.md:808-815`); T011g is a mandatory diagnostic checkpoint before Pragma source work (`tasks.md:932-939`). Thus T011g does not block the App repair or T011h visual work, but it must close before Pragma work.
3. Keep owner-only gates open: N2 requires an explicit owner fallback decision (`BF AGENT-INBOX.md:42-44`; `tasks.md:932-936`); owner visual sign-off remains pending (`BF tasks.md:151`; `AGENT-INBOX.md:35-36`); equivalent SP-5/SP-15 ruling activation on Canonical main and the resulting BF full-SHA repin remain open (`tasks.md:937-939`; `TODO.md:8-13`). A green dependency audit also remains required; the reviewed-carrier CI audit failed on `source-map-js` after engineering checks passed (`tasks.md:940-943`; `TODO.md:11-13`).
4. No token/Pragma phase yet. T011i follows T011h sign-off and contributes signed-off values to design-tokens, then BF repins (`tasks.md:945-948`). T026a is still planning before source edits, and SP-5/SP-15 must reach Canonical main before C (`tasks.md:973-990`).

## Supersession

The authoritative implementation handover is `gpt-handover-bf-switch-2026-10-05.md`, which identifies itself as from Opus “on the owner's instruction” (`:1-4`). The older `owner-handover-2026-10-03.md` and the earlier “Current handover order (2026-10-04)” plan table (`plan.md:101-126`) are historical. Current tasks explicitly say the 2026-10-05 BF-switch handover supersedes the historical sequential-cut instructions and prohibits Pragma implementation at this stage (`tasks.md:952-959, 997-1014`).
