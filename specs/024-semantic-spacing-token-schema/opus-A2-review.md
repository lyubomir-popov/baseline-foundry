# Opus checkpoint A2 review

## Reviewer and scope

| Item | Value |
|---|---|
| Reviewer | Claude Opus 5.5, running as the GitHub Copilot agent in VS Code Insiders |
| Independence | Did not implement T011d–T011f; GPT-5.6 Sol did. I wrote the FR-063 text being implemented, so this review does not independently review that wording |
| Date | 2026-10-04 |
| Rulings and records | `5e200b8`, `222da73` |
| T011d | `eb7f6ab`, `b02736f`, `780579e`, `947732b`, `7c36314`, `891a22c`, `b5c729b` |
| T011e | `0e5dec5` |
| Request | `766a8f3` (documentation and task state only) |

The diff from `222da73` to `766a8f3` touches only `benches/`, `tasks.md` and the
request. Pragma is untouched at `90386bfbf`, and the worktree is clean. Both
manifest hashes match the request: corrections `6ad4b279…aab1c8`, strokes
`2d9523c6…a193e8`. The stroke driver uses separate launches with
`--force-device-scale-factor` and `viewport: null`, so its scale evidence is
valid.

## Verdict

**Accept with bounded corrections.**

**The checkpoint A correction list is discharged.** T011c can be checked.

**The stroke bench is not yet ready for owner sign-off.** P1-1 and P2-1 change
what the owner would be approving, so fix them first.

## What I verified independently

- **T011d.** Each correction is implemented as written:
  - Current nested surface is 8/16/8, with Proposed adding the 16px end.
  - Seam text is nudged.
  - Seam diagnostics include borders.
  - The two surface switches exist.
  - The fractional-scale limit is documented with the launch-scale method.
  - The process ID is gone.
  - No-JS comparison covers all six pages.
  The README states the eight failing surface alternatives as failures, not
  passes.
- **Stroke geometry at real 150% OS scaling.** I checked this in the owner's
  browser, where the layout border is used at 0.666667px:

  | Specimen | Proposed (stroke) | Current (layout border) |
  |---|---|---|
  | Uniform control | 32px | 31.333px |
  | Mixed field | 40px | 39.667px |
  | Chip | 20px | 21.333px |

  This independently confirms the FR-063 remedy.
- **Slot grammar.** Every slot defaults to `0 0 0 0 transparent` on
  `.stroke-owner`. No state rule replaces the assembled `box-shadow`, and the
  assembled value never computes to `none` in Proposed mode.
- **Direction.** The logical start stroke flips in RTL and back in the nested
  LTR island. Physical hooks stay physical.
- **Rounded corners.** The rounded mixed-edge crop at scale 2 shows the
  expected taper, and the page does not claim even rounded mixed strokes.

## Findings

### P1-1 · The range loses its affordance in forced colours, yet the evidence counts it as covered

The range draws its track and thumb with backgrounds and inset shadows on
engine pseudo-elements. Forced colours removes both, so the control renders as
an empty outlined box with no thumb and no track. The driver only checks that
the range has an outline (`verify-strokes.cjs` around lines 108–118), so this
passes all 1,346 checks. FR-063f requires native affordances to survive forced
colours, and the request lists "native controls and their affordances" as
covered.

Reproduce: open `strokes/`, select FR-063 stroke, emulate
`forcedColors: 'active'` and look at the range. The scale-1 forced-colours
screenshot in the evidence shows the same empty box.

- **Correction:**
  - give the thumb and track a forced-colours paint that survives, such as a
    `ButtonText` background with `forced-color-adjust: none` scoped to those
    pseudo-elements, or a system-colour border on the thumb;
  - add a pixel or visibility check for the thumb under forced colours;
  - re-capture the evidence.

### P2-1 · The forced-colours policy is not on the composed owner

Section 3 shows the composed states and section 4 shows the forced-colours
policy, but they are separate elements. The non-colour cues (`!`, `✓`,
underline, double and dashed outlines) are scoped to `.fc-owner`. The section 3
owners therefore render identically under forced colours for unfocused, focused
(the static `is-focus` simulation), invalid and selected. Real keyboard focus
still gets 3px through `.stroke-owner:focus-visible`.

FR-063d asks for one owner per component whose normal and forced-colours states
both work. The bench proves the policy can be written; it does not show a
component carrying it. It also renders every state twice.

Reproduce: emulate forced colours and compare sections 3 and 4.

- **Correction:** move the forced-colours rules onto `.state-owner` and delete
  section 4. Alternatively, keep section 4 only as a label and drive section 3's
  forced-colours captures from the same elements.

### P2-2 · The dense-nesting specimen cannot fail

`.stroke-table td` has a fixed `height: 32px`. At 150%, the bordered chip is
21.333px and the stroked chip is 20px, yet both rows stay at 32px. The check
"dense child preserves host height" passes for both constructions, so it
proves nothing about FR-044 or FR-063e.

- **Correction:** remove the fixed height, so rows size from content as in
  `governed-density/`. Assert that the bordered chip grows the row at
  fractional scale while the stroked chip does not.

### P2-3 · Two of the eight failing surface alternatives are border-subtraction artefacts

Site compact with the control block inset has a 0px block inset. The surface
rule `padding: calc(var(--start) - 1px)` gives −1px, which clamps to 0.
Occupied is then 1 + 32 + 1 = 34px. Under FR-063, with a stroke and no layout
border, it closes at 32px.

The six Docs/App standard failures are real: half of a 12px action inset is
6px, which is off the 4px grid. For the owner that means "about half" should
read 4px or 8px.

- **Correction:** relabel the two Site compact results in the README and
  evidence as an artefact of the layout-border construction, or run the
  surface benches' Proposed mode with FR-063 strokes. Then the owner's decision
  rests only on the real 6px finding.

### P3 · Bounded

- **P3-1.** Invalid and selected share one slot, `--shadow-state`. A selected
  and invalid owner shows only the selected layer, which I confirmed. FR-063c
  names selection or highlight as its own slot. Split it.
- **P3-2.** `outline-style: double` at 1px renders as solid, so the unfocused
  invalid cue in forced colours is really the `!` glyph. Drop the double, or
  apply it only at the focus width.
- **P3-3.** No static focused focusable-disabled specimen exists. Keyboard focus
  reaches it, but the captures don't show it. Add `is-focus` to one.
- **P3-4.** The logical start stroke is carried in `--stroke-left`. Name a
  `--stroke-start` slot so physical slot names stay physical, matching FR-063f.
- **P3-5.** Only rounded and uniform edge crops are captured. Add a
  square-corner mixed crop to show the declared top, right, bottom, left
  overlap order.
- **P3-6.** The uniform control's whole-bU check is true by construction
  (line + 2 × 4px). It is not evidence of closure. Say so, or derive the pad
  from the row contract.

## Pending, not inferred

The following stay owner or human steps and are not implied by this review:

- real Windows contrast-theme keyboard checks in Chromium and Firefox;
- Safari coverage;
- owner visual sign-off of the stroke bench;
- the surface value choice;
- FR-058 P2-2, which decides whether the painted or the occupied box is square.

## Correction list

**Before owner sign-off of the stroke bench:** P1-1, P2-1, P2-2, then re-capture
the evidence with a new manifest.

**Before the owner chooses surface values:** P2-3.

**With the next stroke-bench commit:** P3-1 to P3-6.
