# Opus request — limited T004h correction re-review

Re-review only the P1 dispositions from `opus-t004h-review.md`. Do not edit
either repository and do not broaden into CP1, CP2 or the recorded downstream
P2 items. Return severity-ranked findings and an explicit accept/reject verdict
for T004h.

## Snapshot

- Pragma branch: `feat/bf-inside-out-geometry`
- Correction commit: `4325f159730554db2e61bf5fcc3281408edf290a`
- Full review range:
  `313ee82c13a126b779b9bd75902da5af13c28505..4325f159730554db2e61bf5fcc3281408edf290a`
- Correction range: `b10c4d541..4325f1597`
- The Pragma worktree was clean when the packet was captured.

Read `opus-t004h-review.md`, the updated T004d2/T004h entries in `tasks.md`,
the matching handover sections and contract §7a before the correction diff.

## Dispositions to check

1. **Section test break:** the static and rendered SurfaceFrames checks now
   enforce the accepted inherited surface inset. They no longer require or
   exercise the deleted `--section-border-start-width-with-padding` local
   override. The rendered 1px/3px border check preserves the outside inset and
   height.
2. **ColorInput control geometry:** the trigger, inline row, popover separator
   row and nested hex input route their block padding to the row outputs.
   Chromium DPR 1 checks show trigger, inline row and popover input occupied
   contributions close to 40px Site and 32px Docs/App, while their control
   insets remain below the 16/16/12px panel insets. The popover panel itself is
   not reclassified as control chrome.
3. **Rendered heading/body baselines:** every one-line pair now contains a
   zero-height inline probe in both the heading and body sibling. The check
   measures their rendered modulo-body-line delta rather than rebuilding the
   first-baseline formula.
4. **Lists:** bare `ul`/`ol` block margins are reset to zero. The continuation
   story includes four list items after two paragraphs. Persisted evidence
   shows zero list-container margins and list-item baseline deltas of
   0.031–0.078px in all three products under full closure.
5. **Material owner evidence:** the comparison uses actual Card, Tooltip and
   Form-field owners with pink baseline-unit and blue body-line guides. The
   dependency-safe combined story is on the existing 6107 lane; 6106 retains
   the gap/Section sheet and adds actual Card/Tooltip specimens.

## Corrected rendered finding requiring your disposition

The requested probes expose that the earlier `0.05–0.34px` residual was itself
formula-derived. Actual Chromium DPR 1 one-line deltas are:

- Site: `0–0.219px`;
- Docs: `0.531–0.766px`;
- App: `0–0.609px`.

The former `0.5px` claim is therefore not met by every Docs/App pair. The code
uses `1px` only as a gross-regression guard, records every value and does not
change typography or self-accept the excess. Decide whether this remains the
already-recorded metric-authority debt for CP1 or blocks T004h. If it blocks,
name the required owner decision; do not prescribe token changes inside this
limited review.

## Evidence

Packet root:

`H:\WSL_dev_projects\temp\spec-024-t004h-rereview-20260928`

Top-level `manifest.json` SHA-256:

`b921f2313a04d5a5563fefe176be50ee407e77c3b0a10b204353fb9c9ffd3d13`

The revalidated schema-v2 manifest contains:

- 45 changed source/test/fixture paths with Git blob IDs and SHA-256 hashes of
  committed blob bytes;
- 18 persisted measurement JSON paths;
- 18 comparison artifacts;
- 3 supporting paths;
- a clean capture at exact correction HEAD.

It includes the complete original T004d1a packet, the T004d1b 21/21 result,
persisted heading/list/ColorInput numbers, the old sheets for comparison and
the new material-owner and list-inclusive captures. A file-tree batch scan of
all 816 local/remote branch tips finds `_spike-geometry.css` only on
`feat/bf-inside-out-geometry`; the manifest records first appearance
`f93281eac` without relying on commit containment.

Focused results recorded in the manifest:

- typography: 21/21;
- SurfaceFrames static: 6/6;
- HeadingRhythm Chromium DPR 1: 3/3;
- SurfaceFrames Chromium DPR 1: 9/9;
- form spacing contract: 14/14;
- ColorInput Chromium DPR 1: 5/5;
- ds-global and ds-global-form TypeScript: pass;
- corrected-file Biome checks: pass.

The packet now states the full-suite situation accurately: Timeline and
Accordion are pre-existing failures; the T004g-caused SurfaceFrames failure is
fixed. The prior reviewer already ruled Timeline does not block T004h.

No independent re-review is claimed by this request.
