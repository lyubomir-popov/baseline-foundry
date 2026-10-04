# Opus checkpoint A2 correction review

## Reviewer and scope

| Item | Value |
|---|---|
| Reviewer | Claude Opus 5.5, running as the GitHub Copilot agent in VS Code Insiders |
| Independence | Did not implement the corrections; GPT-5.6 Sol did. I wrote FR-063 and the first A2 review |
| Date | 2026-10-04 |
| Reviewed | `44a4e68`, `80dfbfc`, `aedd700`, `35a81c2` (request) |
| Evidence | `spec-024-stroke-bench-a2-corrections-20261004`, manifest SHA-256 `7a009fbb…e9ce2a1` (verified) |

Pragma is unchanged. I made no repository edits. I ran temporary Playwright
scripts from `H:\WSL_dev_projects\temp\` and deleted them afterwards.

## Verdict

**Accept with bounded corrections.**

Every finding from `opus-A2-review.md` is discharged. Importing BF's
stylesheet introduced one new forced-colours defect (P1-A), which FR-063d
prohibits. The fix is one rule and one check.

The bench is ready for owner visual sign-off of its normal-mode appearance now.
Forced-colours sign-off waits for P1-A.

## Previous findings

All are discharged. I checked each independently at launch scale 1.5, with
`--force-device-scale-factor=1.5` and `viewport: null`.

| Finding | Discharged | What I checked |
|---|---|---|
| P1-1 range in forced colours | Yes | Track and Highlight thumb visible in `scale-1-5-forced-range.png` |
| P2-1 policy on the composed owner | Yes | Section 3 owners carry every cue: `!`, underline, dashed, 2.667px focus versus 0.667px boundary |
| P2-2 dense specimen can fail | Yes | Current rows 20 / 21.333px, Proposed rows 20 / 20px |
| P2-3 surface artefacts | Yes | Two Site compact results reclassified; six Docs/App 6px results kept as the decision |
| P3-1 separate state slots | Yes | Invalid and selected owner shows both layers in its computed `box-shadow` |
| P3-2 double outline | Yes | Removed; `!` is the cue |
| P3-3 focused focusable-disabled | Yes | Dashed, 2.667px at scale 1.5 |
| P3-4 `--stroke-start` | Yes | Separate from `--stroke-left` |
| P3-5 square-corner crop | Yes | Present at every scale |
| P3-6 derived row padding | Yes | Pad = row inset + cap nudge; closure by modulo |

## New findings

### P1-A · BF's focus reset removes the forced-colours boundary on mouse focus

`dist/styles.css` ships
`:is(.bf-button, .bf-button.is-base):focus:not(:focus-visible) { outline: none; }`,
with specificity (0,4,0). That beats the bench's forced-colours boundary
`.stroke-owner { outline: 1px solid CanvasText }`. A mouse-focused button in
forced colours therefore loses its boundary entirely. FR-063d says: "No rule may
set `outline: none` on a paint owner in forced-colours mode."

The driver never mouse-focuses a control under forced colours, so all 1,045
checks pass. This is the exact hazard the second opinion named. It came in with
the move to BF's production stylesheet.

**Reproduce:** select FR-063 stroke and emulate `forcedColors: 'active'`. Click
section 3's Unfocused button and read its computed `outline-style`:

| Owner | After a mouse click |
|---|---|
| Button | `none` (boundary gone) |
| Mixed input and text input | `solid 3px` (inputs are always `:focus-visible`) |
| Chip | `solid 3px`, through `:focus-within`, which over-signals focus on a click |

**Correction:**

- Under `@media (forced-colors: active)`, restore the boundary on
  `.stroke-owner:focus:not(:focus-visible)` with specificity of at least
  (0,4,0).
- Limit the thick focus outline to `:focus-visible`. Keep `:focus-within` only on
  wrapper owners such as `.select-owner`.
- Add a mouse-click forced-colours check for every owner type.

**For checkpoint C:** Pragma and BF focus resets must get the same override when
strokes replace borders. Today the border is the boundary in forced colours, so
these resets are harmless. Under FR-063 they are not.

### P2-A · The bench depends on an untracked build artefact

`strokes/index.html` loads `../../../../dist/styles.css`. `dist/` is gitignored,
and the file on disk was built on 2026-09-29 at 12:51. A fresh checkout of
`80dfbfc` serves an unstyled page until someone builds it. The manifest hashes
the file, which anchors the evidence but does not let anyone regenerate it.

I found no stylesheet-source change after that build time; the only later commit
outside `specs/` is `4362233`, which touches documentation and specs. The input
probably matches the source, but nothing records that.

**Correction:** document `npm run build:theme` in `benches/README.md`. Record the
source commit the stylesheet was built from, and have the driver fail if a fresh
build's hash differs from the manifest.

### P3 · Bounded

- **P3-A. Overclaimed fidelity.** The request says the local stylesheet is
  limited to construction, slots, forced colours and layout. It also sets
  padding, line-height, widths and radius on the button, input, chip, panel and
  direction specimens. BF supplies colours and typography; the geometry is
  authored by the bench. Reword the claim in the README and task entry.
- **P3-B. The assembled list wins on specificity.** Proposed mode assembles the
  shadow list under `:root:has(#proposed:checked) .stroke-owner`, whose
  specificity is (1,3,0). BF's own state rules that set `box-shadow`, such as
  `.bf-chip.is-nested:hover`, lose by specificity, not by structure. The bench
  therefore shows the slot grammar, but not that production state rules were
  rewritten as slot updates (FR-063c). Record this as a checkpoint C obligation.

## Process

The hand-back says the worktree is clean. It is not: `tasks.md` has an
uncommitted change. It unchecks T011e and T011f and deletes the "Corrected
2026-10-04" and "Correction request prepared" notes that `aedd700` and `35a81c2`
committed. I did not touch it. The implementer should say whether this is
intended or a stale edit from a parallel agent, and commit or discard it before
the next request.

## Pending, not inferred

The following stay with the owner or a human and are not implied by this review:

- owner visual sign-off;
- the 4px versus 8px choice for the Docs/App standard surface;
- FR-058, whether the painted or the occupied box is square;
- real Windows contrast-theme keyboard and mouse checks in Chromium and Firefox;
- Safari coverage.

## Correction list

**Before forced-colours sign-off:** P1-A.

**Before checkpoint C:** P2-A, P3-A, and the dirty `tasks.md` resolved. Carry
P3-B and the P1-A focus-reset rule into the C request as obligations.
