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

### Current handover order (2026-10-04)

This order governs the work from checkpoint A onwards. The phases below
remain the long-range shape. Stop at each checkpoint, write
`opus-<checkpoint>-review-request.md` and hand back under FR-054e. Nothing
is pushed, PR'd or published.

| Step | Tasks | Depends on | Stop |
|---|---|---|---|
| A′ – checkpoint A corrections | T011d | `opus-A-review.md` | – (reviewed with A2) |
| A2 – stroke concept bench | T011e | FR-063–FR-063g | – |
| A2 review | T011f | T011d, T011e | Opus review, then owner sign-off of the stroke bench |
| B – T013 preparation | T013 (first half) | FR-060 | Opus review. May run beside A′/A2 |
| C – Pragma foundation recut and restack | T026b | A2 accepted and signed off; owner decision on P2-2 | Opus review; root `bun run check` and `bun run test` |
| D – review bench | T011b | C | Owner sign-off on the bench |
| E – BF Spec 026 rework | Spec 026 R11–R14 | – | `npm test` green; Opus review |

**Decided by the owner, not the implementer:** the opt-in body-phase class
name; Site 24/24 against 24/48 and the 24/40 roles; whether FR-058 squares the
painted or the occupied box (`opus-A-review.md` P2-2); the surface values
after the P2-3 switches exist; Spec 026 R15 outcomes and Q4.

**Recorded by a human, never claimed by an agent:** the FR-063g Windows
contrast-theme keyboard checks in Chromium and Firefox, and Safari coverage.

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

## Owner visual gate

From CP1 onward every gate has two approvals (FR-054): the reviewer judges
whether the code follows the rules; the owner judges what the components look
like, from a before/after gallery of the real stories. Neither substitutes for
the other. In the recut this also sets the pace: one cut, one gallery, one
owner sign-off, then the next cut.

## Checkpoint crosswalk

| Gate | Spec coordinate | Dependency | Gallery before → after |
|---|---|---|---|
| Taxonomy CP1 | Pragma 022 T008; this spec T011–T013 | Reconciled current-main denominator and proposed assignments | Spike base `313ee82c1` → spike tip `1c2c6ba73` |
| Schema CP2 | This spec T014–T020 | CP1-approved taxonomy | CP1 gallery reused, or regenerated with CP2 values |
| Token implementation review | This spec T021–T025 | CP2-approved representation and policy | Pragma `main` → same commit linked to candidate tokens |
| Pragma foundation review | Recut handoff, foundation cuts | Exact reviewed provider artifact | Cut parent → cut tip |
| First-family review | Recut handoff, Commands cut | Reviewed foundation runtime | Cut parent → cut tip |
| Each later family cut | Recut handoff | Previous cut's owner sign-off | Cut parent → cut tip |
| Final recut Opus review | Recut handoff after all cuts | Complete owner partition and integration evidence | Recut-start `main` → final integration tip |

The similarly named historical Pragma contract checkpoint is not schema CP2.
The design-tokens contribution is the sole production semantic source; any CSS
shown before that gate is generated review evidence only.

## Complexity tracking

No constitution violation is proposed. The extra policy document is necessary
because DTCG cannot express implementation provider/subscriber authority.
