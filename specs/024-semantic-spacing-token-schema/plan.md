# Implementation plan: Semantic spacing-token schema

**Branch**: `feat/024-semantic-spacing-token-schema`

**Date**: 2026-09-21

**Spec**: [`spec.md`](spec.md)

## Summary

Turn the completed portion of the Pragma spacing audit into a minimal semantic
taxonomy, then define the DTCG source, governed density policy and generated
public/private output contracts. Keep design records in Baseline Foundry,
component evidence in Pragma, token implementation in design-tokens and Jira
execution in jira-project-bridge.

## Technical context

**Language/version**: DTCG 2025.10 JSON, JSON Schema draft 2020-12, generated
CSS, TypeScript/JavaScript validation

**Primary dependencies**: `@canonical/design-tokens`, Terrazzo resolver/build
pipeline, Pragma Storybook/Playwright evidence

**Storage**: Versioned JSON/Markdown source; generated CSS/JSON outputs

**Testing**: JSON Schema validation, DTCG resolution, generator snapshots,
public/private artifact checks and browser geometry

**Target platform**: Canonical design-system packages and web consumers

**Project type**: Cross-repository design-token schema and generator contract

**Constraints**: Minimum categories but not fewer; logical axes; no public
density utility; no target heights; no Jira/planning artifacts in Pragma

**Scale/scope**: Four product contexts, two density members for approved roles,
the frozen Pragma reusable-owner denominator

## Constitution check

- **Owner-led design authority**: Pass. The product/density decision is recorded
  as owner direction; candidate taxonomy remains reviewable.
- **Container-owned semantic spacing**: Pass. The schema names owners and keeps
  composition gaps container-owned.
- **Metric truth**: Pass. Typography nudges and compensation are excluded.
- **Four first-class tiers**: Pass. Site/Editorial, Docs, App and OS retain one
  semantic surface with value differences.
- **Small, earned primitives**: Pass. Categories require positive evidence,
  failed merges and breakers.
- **Accessible, intrinsic composition**: Pass. Density changes approved spacing
  roles only and creates no target height.
- **Generated contracts and public evidence**: Pass. Source, generated output,
  private-channel exclusion and browser proof are acceptance requirements.
- **Lean specification-owned state**: Pass. This package is the durable record;
  Pragma and Jira receive no duplicate planning files.

## Project structure

```text
baseline-foundry/
└── specs/024-semantic-spacing-token-schema/
    ├── README.md
    ├── spec.md
    ├── research.md
    ├── data-model.md
    ├── plan.md
    ├── quickstart.md
    ├── tasks.md
    ├── evidence-manifest.md
    ├── recut-handoff.md
    ├── opus-recut-plan-review-request.md
    ├── opus-pre-cp1-execution-review.md
    ├── opus-pre-t004d2-scope-review.md
    ├── opus-t004g-scope-clarification-review.md
    ├── implementation-handover.md
    ├── prompts/
    │   └── opus-t004g-scope-clarification.md
    └── contracts/
        ├── semantic-spacing-schema.md
        └── density-contract.schema.json

design-tokens/                         # future implementation worktree
└── packages/tokens/tokens/canonical/
    ├── global/semantic/spacing/
    ├── global/semantic/modifier/spacing/
    └── policy/

pragma/                                # evidence/adoption worktrees only
├── .claude/worktrees/feat-bf-shared-alignment
│   └── packages/...                   # read-only evidence reference
└── .claude/worktrees/feat-bf-inside-out-geometry
    └── packages/...                   # isolated FR-050 spike only

jira-project-bridge/
└── work/...                           # ignored private snapshots/plans
```

## Execution sequence

### Phase A — evidence and taxonomy

Complete the bounded block-geometry/gap-scale spike and its independent T004h
review first. Then freeze the current component inventory, including non-React
consumers, apply the approved model, run the hardcoded-length completeness
sweep, test candidate merges and breakers, and produce final independent
inline/block assignments. Stop for CP1 Opus review.

### Phase B — schema representation

Apply the CP1 taxonomy to the semantic ID/metadata contract. Spike simultaneous
product × density representation in an isolated design-tokens worktree. Select
the smallest valid representation and stop for CP2 adversarial review.

### Phase C — token contribution

Implement source, policy, generator and validation in design-tokens. Review
generated CSS and public metadata. No Pragma adoption is bundled.

### Phase D — adoption cuts

Rebase/rebuild bounded Pragma foundations and component-family changes from the
approved tokens. Preserve the current cumulative `feat/pragma-*` tips as donor
references, then land sequential fresh-main cuts under
[`recut-handoff.md`](recut-handoff.md). Run Pragma’s root gates for every
contribution.

### Phase E — Jira synchronisation

After owner approval, use jira-project-bridge to create or reuse the truthful
WD-36041 child, link this durable record and publish only reviewed current
status. Jira is not the source schema.

## Checkpoint crosswalk

| Gate | Spec coordinate | Dependency |
|---|---|---|
| Taxonomy CP1 | Pragma 022 T008; this spec T011–T013 | Reconciled current-main denominator and proposed assignments |
| Schema CP2 | This spec T014–T020 | CP1-approved taxonomy |
| Token implementation review | This spec T021–T025 | CP2-approved representation and policy |
| Pragma foundation review | Recut handoff, foundation cuts | Exact reviewed provider artifact |
| First-family review | Recut handoff, Commands cut | Reviewed foundation runtime |
| Final recut Opus review | Recut handoff after all cuts | Complete owner partition and integration evidence |

The similarly named historical Pragma contract checkpoint is not schema CP2.
The design-tokens contribution is the sole production semantic source; any CSS
shown before that gate is generated review evidence only.

## Complexity tracking

No constitution violation is proposed. The extra policy document is necessary
because DTCG cannot express implementation provider/subscriber authority.
