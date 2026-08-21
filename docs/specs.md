# Spec catalog

This file owns package status and governing-source relationships. Execution
order lives in `TODO.md`; per-feature detail lives in the package.

## Current package

No numbered package is active. The navigation-grid and shared-border-thickness
defects are focused framework repairs tracked in `AGENT-INBOX.md` and do not
expand Spec 001.

## Archive

Completed and retired packages live under [`docs/spec-archive/`](spec-archive/).

| Spec | Package | Disposition |
|---|---|---|
| 001 Baseline Foundry renewal | [`001-baseline-foundry-renewal/`](spec-archive/001-baseline-foundry-renewal/) | Accepted and merged 2026-08-21; automated closeout green, with the unavailable in-app-browser pass recorded in `review.md`. |

## Candidate specifications

Candidates have no number, package, or active branch. Promote exactly one when
its evidence trigger is satisfied; until then they are boundaries, not promised
features.

| Candidate | Evidence trigger | Intended outcome | Explicit boundary |
|---|---|---|---|
| Shared authoring shell and document frame | Two consumers repeat the same top-navigation, stage, pinned-aside, or document-frame composition | A small intrinsic composition shared by authoring tools | Do not make consumer workflow state or chroma a built-in tier |
| Product-specific credential orchestration | A consumer repeats workflow state beyond the shipped BF password reveal and validation/help composition | Promote only the repeated orchestration over the existing accessible field contracts | Do not relabel existing form support as absent or port an application workflow wholesale |
| Framework-specific interactive-table orchestration | A consumer needs data-source or framework state beyond the shipped sortable, expandable and mobile-card contracts | Keep reusable BF presentation/ARIA seams separate from application data behavior | Basic and interactive `bf-table` contracts remain complete; framework state stays downstream |
| Media-object breakpoint retuning | A second consumer proves that the shipped media-object composition's intrinsic threshold fails | Adjust only the measured shared threshold | No speculative tier-specific breakpoint fork |

## Design references

| Source | Role |
|---|---|
| `../canonical-spacing-spec/specs/type scale/draft.md` | Type-scale and metric reference |
| `../canonical-spacing-spec/specs/spacing/draft.md` | Spacing research/reference; its Pragma/official container-owned decision does not override BF's local element-owned constitution |
| `../canonical-spacing-spec/specs/grid/draft.md` | Grid reference |
| `../canonical-spacing-spec/specs/typography-article/draft.md` | Supporting editorial reference |
| `../vanilla-framework/` | Ancestor pattern evidence, not a compatibility mandate |
| `../diagram-registry/` | Active consumer evidence for Spec 001 |
| `../diagram-generator/` | Lean Spec Kit operating-model reference |
| `../diagram-generator-planning/` | Broader planning reference; not the target global-state model |
| `../canonical-specs/` | Legacy snapshot only |

## Precedence

Current user direction and the active local spec come first, followed by the BF
constitution, `AGENTS.md`, durable local architecture, accepted archived specs,
and then external references. Implementation drift never silently rewrites a
higher-level decision.
