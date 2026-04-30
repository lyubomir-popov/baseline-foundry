# Linked Specs

## Purpose

This file records the concrete external spec inputs that govern baseline-foundry. When source documents disagree with local implementation, these paths win according to `.github/copilot-instructions.md`.

## Primary live spec workspace

The primary live spec workspace for this repo is `../canonical-spacing-spec/`.

| Spec | Path | Role in this repo |
|------|------|-------------------|
| Type scale | `../canonical-spacing-spec/specs/type scale/draft.md` | Canonical type roles, weights, scale structure, and typography semantics |
| Spacing | `../canonical-spacing-spec/specs/spacing/draft.md` | Vertical spacing model, nudge model, and spacing invariants |
| Grid | `../canonical-spacing-spec/specs/grid/draft.md` | Canonical 4/8/16 grid behavior and tier-specific layout rules |
| Typography article | `../canonical-spacing-spec/specs/typography-article/draft.md` | Supporting editorial rationale and reference material |

## Secondary references

| Reference | Path | Use |
|-----------|------|-----|
| Legacy spec snapshot | `../canonical-specs/` | Historical comparison only, not the primary live source |
| Compatibility line | `../portable-vertical-rhythm/` | Implementation comparison only, not a normative spec |

## Notes

- `canonical-spacing-spec` is the source of truth for new spec alignment work.
- `canonical-specs` is a legacy snapshot/reference workspace only.
- If a behavior is only present in local code but not in the linked specs or roadmap, treat it as implementation drift until proven intentional.
