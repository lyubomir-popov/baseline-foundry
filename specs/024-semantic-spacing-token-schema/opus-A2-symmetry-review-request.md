# Checkpoint A2 symmetry correction — Opus review request

**Date:** 2026-10-04  
**Verdict requested:** accept, accept with bounded corrections, or reject  
**Implementation commit:** `e25434a` — `fix(spec-024): restore symmetric control geometry`

## Why this rereview exists

Owner review found that `surface-insets/` appeared to make controls vertically
asymmetric and that its Site / Docs / App controls did not drive the new proof
panels. The first problem was a presentation ambiguity; the second was a real
implementation defect.

The governing control contract was never superseded. A text-bearing control
keeps equal block edges:

```text
padding-start = inset + nudge
padding-end   = inset + nudge
box           = padding-start + lines × line-height + padding-end
compensation  = round-up(box, rhythm-step) − box
occupied      = box + compensation
```

FR-063 removes layout-border subtraction only. Top and bottom strokes are
inset paint and contribute no layout size. FR-060 separately proposes an
asymmetric *outer surface inset* for standard Card/Tile surfaces; it does not
change the control seat or the child text's nudge and compensation.

## Corrections in `e25434a`

1. `spec.md`, the schema contract and T026b now state the equal control-seat
   equation and separate block-end modulo compensation explicitly.
2. FR-060 now scopes its asymmetry to a standard surface's outer semantic
   inset and requires the bench to show a full-action symmetric alternative
   before sign-off.
3. `surface-insets/` now loads BF's generated stylesheet and uses `bf-button`
   and `bf-panel` classes.
4. The tier controls drive the actual proof and live specimens. The hard-coded,
   control-independent proof path is gone.
5. Proposed mode now uses zero layout borders and inset strokes on the actual
   controlled surfaces. It establishes a formatting context so the text
   closure margin cannot escape when padding is zero.
6. The page begins with the symmetric control invariant, then presents the
   surface alternatives separately.
7. Docs/App now show four real surface candidates: literal 6/12, grid-aligned
   4/12 and 8/12, and fully symmetric 12/12. Site shows 8/16 beside symmetric
   16/16.
8. Every radio has a stable value, equivalent choices are explained, and the
   measurements are computed from the rendered BF-styled specimens.

The uncommitted canonical spacing draft at
`H:\WSL_dev_projects\canonical-spacing-spec\specs\spacing\draft.md` was also
corrected narrowly: stale instructions to reduce padding for borders were
replaced by stroke-independent geometry and the equal `inset + nudge` control
equation. That checkout contains unrelated owner work and was not committed.

## Evidence

Targeted Chromium verification runs separate browser launches at real scale
factors 1 and 1.5 with a null viewport:

- **112/112 checks pass**;
- Site / Docs / App panel switching is effective;
- all five standard and all three compact choices resolve to their expected
  rendered geometry;
- control padding is equal at both block edges;
- control occupied sizes are 40px Site and 32px Docs/App;
- Proposed surfaces have zero layout borders and inset strokes;
- the symmetric surface option has equal full-action edges;
- forced-colours emulation removes shadows and restores an outline;
- no page or console errors.

Evidence root:
`H:\WSL_dev_projects\temp\spec-024-surface-symmetry-20261004\`

Full repository validation also passes:

```text
npm test
  build validation: 24,200 checks
  component baselines: pass
  component behavior: pass

npm run qa:components
  screenshot capture: pass
  component baselines: pass
```

Live demo:
<http://127.0.0.1:8797/specs/024-semantic-spacing-token-schema/benches/surface-insets/>

## Review questions

1. Does the corrected contract preserve the intended sequence: stroke boundary,
   equal `inset + nudge` seats around the line box, second stroke boundary,
   then block-end modulo compensation?
2. Does the demo now make the control invariant and the separate FR-060 surface
   proposal impossible to confuse?
3. Do all tier and option controls act on the specimens being measured?
4. Is the BF fidelity claim bounded correctly: BF supplies component classes,
   tokens, colour and typography while the bench locally authors the candidate
   geometry?
5. Are the canonical-spacing corrections sufficient to remove the stale
   border-subtraction instructions?
6. Should FR-060 remain asymmetric after owner visual review, or should the
   standard surface adopt the newly exposed full-action symmetric option?

## Still pending owner or human evidence

- Owner choice for standard surface block edges. The previous “4px or 8px”
  question is now explicitly “4/12, 8/12, or symmetric 12/12” for Docs/App;
  Site compares 8/16 with symmetric 16/16.
- Owner stroke-bench sign-off.
- Real Windows contrast-theme checks in Chromium and Firefox, and Safari.
- FR-058 square painted versus occupied box before checkpoint C.

Do not infer owner sign-off from an accepted code review, and do not begin the
Pragma foundation cut until both the A2 review and owner sign-off are recorded.
