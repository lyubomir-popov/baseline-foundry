# Spec 024 — resume here

This package defines the new semantic spacing-token schema derived from the
Pragma component-spacing audit. It does not redefine the primitive dimension
scale and it does not treat the current 12-token provider as the final
taxonomy.

Read in this order:

1. [`spec.md`](spec.md) — problem, outcomes, requirements and acceptance.
2. [`research.md`](research.md) — settled decisions and unresolved schema work.
3. [`contracts/semantic-spacing-schema.md`](contracts/semantic-spacing-schema.md)
   — the proposed semantic source and generated-output contract.
4. [`plan.md`](plan.md) — repository boundaries and review sequence.
5. [`tasks.md`](tasks.md) — executable order and mandatory checkpoints.
6. [`evidence-manifest.md`](evidence-manifest.md) — exact evidence snapshot,
   source files, reproduction commands and known omissions.
7. [`recut-handoff.md`](recut-handoff.md) — audited legacy branch inventory,
   dependencies, final cut graph and stop/recovery rules.
8. [`opus-recut-plan-review.md`](opus-recut-plan-review.md) — the completed
   planning review of this package and the recut plan.
9. [`opus-pre-cp1-execution-review.md`](opus-pre-cp1-execution-review.md) — the
   completed execution-readiness correction for the pre-CP1 spike.
10. [`opus-pre-t004d2-scope-review.md`](opus-pre-t004d2-scope-review.md) — the
   completed scope-junction review, including the type-scale exceptions,
   expanded T004g boundaries and the original capture-lane decision.
11. [`opus-t004g-scope-clarification-review.md`](opus-t004g-scope-clarification-review.md)
   — the completed execution-junction review that bounds T004d1a, approves
   T004d2 independently and leaves only the CP1 Section choice blocking T004g.
12. [`prompts/opus-t004g-scope-clarification.md`](prompts/opus-t004g-scope-clarification.md)
   — the request that produced the execution-junction review.
13. [`implementation-handover.md`](implementation-handover.md) — **start here if
   you are implementing.** The bounded work that is ready, in order, and the
   hard stops.

## Current status

- **Status**: Owner acceptance remains outstanding. T004d0, T004d1b and T004d
  are complete. The 2026-09-23 execution-junction Opus review is complete and
  dispositioned. T004d1a remains open against its bounded four-member matrix,
  dual 6106/6107 evidence lanes and recoverable-JSON requirements. The
  mechanical `text-alignment.test.ts` correction and T004d2 may proceed
  independently of T004d1a. The complete T004g writable list is now recorded;
  T004g remains blocked only on CP1 choosing the Section inset mapping. The
  preserved rejected candidate and its diagnostic 12/12 and 8/8 Chromium DPR
  1/2 runs remain custody evidence, not completion evidence.
- **Jira home**: [WD-36041](https://warthogs.atlassian.net/browse/WD-36041).
- **Proposed Jira child**: “Define the minimal spacing taxonomy and governed
  density contract”. It has not been created.
- **Pragma evidence**: 178 catalog targets, 180 horizontal targets, 186 vertical
  targets, 456 bucket routes and 536 declared spacing facts. Fixture closure
  and semantic approval remain incomplete. These are snapshot facts, not final
  token memberships; the manifest identifies their exact source.
- **Existing provider**: the currently resolved `@canonical/design-tokens`
  spacing source contains a useful 12-token record. Package versions differ
  between the historical evidence and current Pragma main, so the exact source
  commit and artifact hash—not an old version label—are migration inputs. The
  existing record is not the answer this spec is required to prove.
- **Legacy Pragma recut**: ten clean local `feat/pragma-*` worktrees form a
  cumulative chain from a base now 75 commits behind the audited upstream.
  Preserve them as donor references and rebuild the final cuts sequentially
  under `recut-handoff.md`. Three **further** worktrees — `fix-root-gates`,
  `feat-bf-shared-alignment` and `feat-bf-metric-nudge` — are dirty, hold the
  CP1 evidence and the measurement reference. T004c captured all three plus
  this Spec 024 package under the named `refs/recovery/spec-024/...` refs listed
  in `recut-handoff.md`; the source branches and working trees remain unchanged.
- **Plan review**: complete. Claude Opus 5, 2026-09-21 —
  [`opus-recut-plan-review.md`](opus-recut-plan-review.md). Branch topology
  reproduced; two P0 findings (unprotected CP1 evidence; upstream has already
  landed a different control-geometry model) and five P1 findings are
  incorporated as FR-033 to FR-038. T004c is complete. Owner acceptance of the
  corrected plan is still outstanding, and
  the review does not replace CP1 or CP2.
- **Pre-CP1 execution review**: complete. Claude Opus 5, 2026-09-22 —
  [`opus-pre-cp1-execution-review.md`](opus-pre-cp1-execution-review.md).
  It keeps the evidence reference read-only, selects one private spike carrier,
  extracts the existing baseline-offset expression, defers grid work to 020b,
  moves density compatibility to T017a and records OS as `null` until CP2.
  It authorises only the isolated evidence spike described by the handover;
  production recut, publication, PR and push remain prohibited.
- **Pre-T004d2/T004g scope review**: complete. Claude Opus 5, 2026-09-22 —
  [`opus-pre-t004d2-scope-review.md`](opus-pre-t004d2-scope-review.md). It
  authorises `elements.css`, narrows phase acceptance to the whole-multiple
  combinations, expands/dispositions the T004g sweep and selects the existing
  port-6106 Playwright lane.
- **Execution-junction review**: complete. Claude Opus 5, 2026-09-23 —
  [`opus-t004g-scope-clarification-review.md`](opus-t004g-scope-clarification-review.md).
  It defines the four-member T004d1a denominator and dual-lane evidence packet,
  ratifies 40/32 → 45/36 root scaling, approves T004d2 independently, records
  the complete T004g writable slice and leaves Section's CP1 mapping choice as
  the sole T004g blocker.

## Repository boundaries

- This Baseline Foundry package owns the cross-repository design record.
- Pragma owns the component evidence and visual audit. Do not add Jira or
  planning files there.
- `canonical/design-tokens` will own approved DTCG source and generated token
  artifacts after the schema checkpoint.
- `jira-project-bridge` will own any private snapshot, draft, plan and apply
  result. Jira mutation requires a fresh read, reviewed plan and explicit
  confirmation.

No production implementation, Jira publication, release or downstream
migration is authorised by this draft. The bounded isolated-worktree spike in
`implementation-handover.md` is the sole implementation exception.
