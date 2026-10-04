# Checkpoint A2 BF-fidelity recut — Opus review request

**Date:** 2026-10-04  
**Verdict requested:** accept, accept with bounded corrections, or reject  
**Implementation commits:**

- `15ad95a` — `docs(agents): require plain-language demo provenance`
- `18dca3f` — `fix(spec-024): recut stroke evidence against BF contracts`

## Why this rereview exists

Owner review correctly found that the prior stroke page was mostly bespoke CSS
wearing BF classes. It loaded BF's compiled stylesheet but locally rebuilt tier
metrics, control geometry, button states, glyphs, radii, select and range
chrome, direction fixtures and panel surfaces. No Pragma stylesheet was loaded,
despite Pragma labels. The earlier A2 evidence and rereview request are
superseded as component-fidelity evidence.

**FR-063 — strokes take no layout space.** The proposed construction removes a
CSS layout border and paints the same boundary inside the box with an inset
`box-shadow`. In forced colours, an inset `outline` owns the boundary. This is
the rule under review; the identifier is not used as a substitute for that
explanation.

## Corrections

1. The stroke page now activates BF's shipped editorial, documentation and app
   tier scopes and uses production Button, nested Chip, highlighted Card,
   Input and Range anatomy.
2. Local CSS is limited to comparison layout, the candidate border-to-shadow
   override, the padding restored when a layout border is removed, and the
   forced-colours fallback.
3. The locally invented invalid/selected button states, literal checkmark and
   exclamation glyphs, rounded mixed field, custom select, reconstructed range,
   direction boxes and fake BF panels are removed.
4. BF's range is rendered unchanged and explicitly excluded from this recut.
5. The fully rounded specimen is BF's shipped nested Chip, which already uses
   an inset shadow. Its layout-border peer is labelled counterfactual.
6. The highlighted Card composes the proposed inset boundary with BF's real
   elevation shadow.
7. Both pages visibly list their stylesheet provenance. They state that no
   Pragma CSS is loaded and make no Pragma integration claim.
8. `AGENTS.md` now requires plain-language definitions for requirement IDs,
   visible CSS provenance, real anatomy for fidelity claims, and no invented
   states, icons, radii or behavior presented as shipped contracts.
9. The surface page now calls its specimens anonymous local geometry instead
   of Tooltip, Card, Modal or SidePanel models.
10. The owner selected symmetric standard-surface action padding: 16px on
    every Site edge and 12px on every Docs/App edge. Twelve pixels is already
    three 4px baseline units. The former 4px-versus-8px choice concerned the
    superseded half-action value of 6px, which has no unique nearest grid step.

The same FR-060 surface correction is present, uncommitted, in
`H:\WSL_dev_projects\canonical-spacing-spec\specs\spacing\draft.md`. That
checkout contains other owner work and was deliberately not committed here.

## Evidence

The demo is served at:

- Stroke recut:
  <http://127.0.0.1:8797/specs/024-semantic-spacing-token-schema/benches/strokes/>
- Surface values:
  <http://127.0.0.1:8797/specs/024-semantic-spacing-token-schema/benches/surface-insets/>

Targeted Chromium runs at launch scale factors 1 and 1.5 confirm:

- proposed buttons have zero layout borders and inset shadows in all tiers;
- proposed button geometry changes by about 0.01px between scales, while the
  current layout-border button loses about 0.66px at 150%;
- BF's shipped paint-only nested Chip remains exactly stable, while the
  counterfactual layout-border Chip grows its host;
- a mouse-focused candidate button retains a 1px inset outline in
  forced-colours emulation;
- every candidate Button, Chip, Card and Input has a forced-colours boundary;
- the surface page resolves to 16/16/16/16px on Site and 12/12/12/12px on
  Docs/App;
- both pages load without console or page errors.

Evidence root:
`H:\WSL_dev_projects\temp\spec-024-fidelity-recut-20261004\`

Manifest SHA-256:
`2a20cfe926e0e84f5d43293baddfb61f4b91dd8b30057c4d49e9429a2a705dae`

Full repository validation passes:

```text
npm test
  build validation: 24,200 checks
  component baselines: pass
  component behavior: pass

npm run qa:components
  screenshot capture: pass
  component baselines: pass
```

## Review questions

1. Are the production-fidelity claims now accurate and bounded?
2. Does each proposed component preserve BF's shipped type, geometry, states,
   radius and anatomy while changing only boundary construction?
3. Is restoring the border-subtracted padding correct for Button, Card and
   Input in each shipped tier?
4. Does the Card correctly preserve BF elevation while adding the inset
   boundary?
5. Does the forced-colours rule prevent mouse focus from removing the required
   boundary without falsely showing a keyboard focus ring?
6. Is using BF's shipped fully rounded nested Chip the right radius evidence,
   with the generic rounded-button fixture removed?
7. Is the surface ruling now unambiguous: standard surfaces use symmetric
   16px Site and 12px Docs/App action insets, while compact and major values
   remain separate work?
8. What bounded corrections, if any, are required before owner sign-off?

## Human checks still pending

- Real Windows contrast themes in Chromium and Firefox.
- Safari normal-mode paint and focus behavior.
- Production Pragma adoption. This BF bench does not claim it.
- The separate owner decision about whether FR-058 squares a painted close
  button or its occupied box.

An accepted review does not itself record owner visual sign-off.
