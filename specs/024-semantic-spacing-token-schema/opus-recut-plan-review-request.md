# Opus review request: Semantic spacing schema and Pragma recut plan

## Reviewer requirement

This packet requires an actual Claude Opus review. Record the exact model,
review date and reviewed Git/source identities in the result. Do not substitute
an ordinary adversarial review or describe another model as Opus.

Write the completed review to `opus-recut-plan-review.md`. Do not edit the spec
while reviewing.

## Read first

Read the complete Spec 024 package, especially:

1. `spec.md`
2. `research.md`
3. `data-model.md`
4. `contracts/semantic-spacing-schema.md`
5. `contracts/density-contract.schema.json`
6. `evidence-manifest.md`
7. `recut-handoff.md`
8. `tasks.md`

Then inspect, read-only:

- Pragma Spec 022 at
  `H:\WSL_dev_projects\pragma\.claude\worktrees\fix-root-gates\specs\022-pragma-spacing-adoption`;
- the ten local Pragma `feat/pragma-*` worktrees named in the handoff;
- current Pragma `origin/main`; and
- the live design-tokens spacing source named in `quickstart.md`.

## Conclusions to verify

1. The semantic contract is relationship-based and does not mistake primitive
   values or the current provider record for the result.
2. Baseline and page/grid relationships are correctly excluded from the
   component count without losing compatibility responsibility.
3. The old branches are clean but cumulative, based 75 commits behind the
   audited mainline, and must be donor references rather than landing branches.
4. Sequential fresh-main cuts are the smallest safe recovery strategy.
5. The cut graph covers likely owner classes and requires a mechanically
   complete owner-to-slice partition after CP1.
6. The retained density axis has one authority: products select defaults;
   approved hosts select dense automatically for allow-listed subscribers and
   roles; no public global chooser is added.
7. The checkpoint crosswalk prevents token generation before schema approval
   and keeps taxonomy, schema, implementation, foundation, first-family and
   final-sequence reviews distinct.
8. The coexistence contract prevents a foundation alias change from altering
   current unmigrated density consumers before their owning cut lands.

## Adversarial questions

- Can any semantic category, owner family, component state or logical edge
  escape the proposed denominator or owner partition?
- Does any cut still mix unrelated concerns or depend on a later cut?
- Should any foundation cuts be combined or reordered to remain independently
  buildable and reviewable?
- Does current `origin/main` make a legacy cut obsolete rather than merely
  stale? Cite exact files and commits.
- Does the density contract permit regular Chip geometry in an approved tight
  host, alter non-subscribers, cross product/reset boundaries or leak a public
  density API?
- Are target-side portal ancestry and explicit portal bridges unambiguous?
- Does the plan prematurely remove a compatibility density API or conflate
  spacing density with typography/line-height changes?
- Can the proposed provider/alignment foundation land without changing legacy
  `--baseline-height`/density consumers, especially Site controls? Verify the
  activated-owner and unmigrated-sentinel mechanism against current source.
- Are the root-gate, rebase, rollback and state-transition rules sufficient for
  a human engineer to review and land the sequence safely?
- Is any historical finding being replayed after newer evidence or owner
  direction superseded it?

## Required result

Return findings by priority with exact file/line, branch/commit and measurement
references. For each, state the smallest correction and which checkpoint owns
it. Explicitly say whether the spec/recut plan is safe for owner review.

This review is not CP1 taxonomy approval, CP2 schema approval, permission to
mutate the legacy branches or permission to push, merge, publish or release.
