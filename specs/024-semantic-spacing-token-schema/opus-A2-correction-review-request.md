# Opus checkpoint A2 correction review request

Checkpoint A2 has been corrected after the accept-with-bounded-corrections
verdict in `opus-A2-review.md`. Review the corrected stroke bench and evidence
as a new Opus pass. Do not infer owner visual sign-off.

## Reviewer instruction

Act as the Opus reviewer for the checkpoint A2 corrections. Read FR-063 through
FR-063g, `opus-A2-review.md`, this request, and the actual diffs. Write
`opus-A2-correction-review.md` beside this file. Record the actual model
identity, reviewed commits, findings with severity and reproduction steps, and
an accept / accept with bounded corrections / reject verdict. State separately
whether P1-1, P2-1 through P2-3, and P3-1 through P3-6 are discharged. Do not
infer the pending Windows, Firefox, Safari, or owner sign-offs.

## Exact scope

Worktree:
`H:\WSL_dev_projects\baseline-foundry-worktrees\feat-024-semantic-spacing-token-schema`

Branch: `feat/024-semantic-spacing-token-schema`

- `44a4e68` — record the first A2 Opus review;
- `80dfbfc` — recut the stroke bench with BF production components and apply
  the A2 corrections;
- `aedd700` — accept T011c, reopen A2, and classify the surface evidence.

Review with:

```powershell
git diff 0e5dec5 80dfbfc -- specs/024-semantic-spacing-token-schema/benches/strokes
git show aedd700 -- specs/024-semantic-spacing-token-schema/benches/README.md specs/024-semantic-spacing-token-schema/tasks.md
```

No Pragma production file was changed. No push, PR, merge, publication, or
release was performed.

## High-fidelity visual contract

The prior bench invented its own control chrome. The correction imports this
worktree's generated `dist/styles.css`, puts `bf-theme` on the page, and
uses the shipped BF component contracts:

- `bf-button` for the uniform and composed-state specimens;
- `bf-input` for mixed fields and direction specimens;
- `bf-field`, `bf-control`, and `bf-form-label` for native controls;
- `bf-chip is-nested` inside `bf-table` for dense-host behavior;
- `bf-panel` for clearance surfaces;
- Pragma's 16px root / 8px track / 16px thumb range ownership model.

The local stylesheet is limited to the current-versus-FR-063 construction,
named shadow slots, forced-colours fallback, and evidence layout. The manifest
hashes the exact generated BF stylesheet as an input.

## Finding disposition

- **P1-1:** forced colours now gives the range track and thumb system-colour
  paint. Four range-only captures are checked pixel by pixel: a horizontal
  track spans at least 70% of the image and a thumb spans at least 60% of its
  height. Keyboard focus and ArrowRight operation are also asserted.
- **P2-1:** section 4 is explanatory only. Forced-colours checks and captures
  drive the eight section 3 `.state-owner` buttons directly; no `.fc-owner`
  exists.
- **P2-2:** table rows have no fixed height. In Current mode the bordered chip
  grows every content-sized row from 20px to 22px at scale 1 (and by the used
  border width at fractional scale). In Proposed mode both rows remain 20px at
  every scale.
- **P2-3:** the two Site compact results are classified as layout-border
  subtraction artefacts. The six Docs/App action-half results remain the real
  decision: literal 6px is off the 4px grid, so “about half” must resolve to
  4px or 8px.
- **P3-1:** invalid and selection have separate slots, with an
  invalid-and-selected specimen and ordering assertions.
- **P3-2:** the ineffective 1px double outline is removed. Invalid state uses
  the visible exclamation glyph.
- **P3-3:** focusable-disabled is statically focused, keeps a thick dashed
  forced-colours outline, and remains programmatically focusable.
- **P3-4:** logical direction uses `--stroke-start`; physical left continues
  to use `--stroke-left`. Both slots are asserted independently in RTL and
  the nested LTR island.
- **P3-5:** every scale includes separate square and rounded mixed-side crops.
- **P3-6:** uniform-button padding is derived from the row inset and cap nudge;
  positive trailing modulo compensation closes the occupied row. Evidence
  asserts the terms as well as whole-bU closure.

## Correction evidence

Live page:
<http://127.0.0.1:8797/specs/024-semantic-spacing-token-schema/benches/strokes/>

Evidence root:
`H:\WSL_dev_projects\temp\spec-024-stroke-bench-a2-corrections-20261004\`

Manifest SHA-256:
`7a009fbbaa44556eec0d1494de5b5f9af8c38a1cf507d67c5a813873fe9ce2a1`

Chromium 151.0.7922.34 ran in four separate launches with
`--force-device-scale-factor` 1, 1.25, 1.5 and 2. Every context used
`viewport: null`. All 1,045 checks pass with no page or HTTP errors. The
packet contains Current, Proposed, forced-colours, uniform, square-mixed,
rounded-mixed, focus, and range-only captures for every scale.

The checks cover the live BF stylesheet, eight unique specimens, one composed
state set, zero layout borders in Proposed, non-`none` composed shadow lists,
stable occupied geometry, row-derived closure, content-sized dense-host
behavior, independent invalid/selection and logical/physical slots, native
range geometry and keyboard operation, and forced-colours state ownership.

## Pending human and owner steps

- Real Windows contrast-theme keyboard checks in Chromium.
- Real Windows contrast-theme keyboard checks in Firefox.
- Safari normal-paint and native-control coverage on macOS.
- Owner visual sign-off of the corrected stroke bench.
- Owner choice between 4px and 8px for the Docs/App standard action-half
  surface reading.
- The later FR-058 decision between a square painted box and square occupied
  box.

If the corrections pass, state that the stroke bench is ready for owner visual
sign-off. Do not grant that sign-off on the owner's behalf.
