# CP1 Claude Opus adversarial review request — spacing taxonomy

**Status:** Prepared, not yet ready to send. Send only after T001–T007 leave no
provisional denominator or measurement rows.

Do not send while any of these remain nonzero or open: deferred owners,
deferred relationships without isolated fixtures, deferred interactive
witnesses, null token-owner category assignments, unresolved App gap ordering,
or unattempted candidate-category merges. Current counts and the exact resume
task live in [`README.md`](README.md).

The narrower [`pre-CP1 Opus review`](opus-evidence-review.md) is complete and
its findings are dispositioned in [`opus-review-disposition.md`](opus-review-disposition.md).
This mandatory final taxonomy checkpoint remains blocked on the readiness
conditions below.

Read [`spec.md`](spec.md), [`plan.md`](plan.md),
[`component-bucket-matrix.md`](component-bucket-matrix.md) and
[`bucket-table.md`](bucket-table.md). This is a mandatory progression review,
not a GO/NO-GO verdict. Do not edit either worktree.

## Objective

Challenge whether the evidence has found the **absolute minimum sufficient**
set of independent horizontal and vertical semantic spacing categories for
Pragma's reusable React parts. A category must be added when a measured part
cannot safely consume an existing contract; two categories must merge when no
measured or semantic counterexample justifies the split.

Do not assume the current candidate names or counts are correct. In particular,
test padded components/controls separately from padded containers/regions on
both axes.

## Readiness preconditions

Return the packet as not ready, with the missing rows, if any of these is false:

- every public React primitive and reusable pattern is represented;
- every live CSS-only foundational spacing primitive is represented, including
  grid/flow gaps and shared element rules;
- every composite is decomposed into each independently spacing-owning part;
- every `N/A`, layout-owned or atomic-paint boundary has an owner-based reason;
- every spacing-owning row is measured in Site, Docs and App, or cites a proven
  source-equivalent measured anchor;
- no row remains `Provisional`;
- each candidate category has two independent witnesses or a documented
  unavoidable singleton;
- the semantic token file has **not** yet been generated from this taxonomy.

Aggregate workflows such as login forms are excluded when they only compose
inventoried primitives. If they introduce a new spacing-owning wrapper, that
wrapper belongs in the denominator rather than the whole workflow.

## Evidence

The broad implementation and audit pages are read-only evidence in:

`H:\WSL_dev_projects\pragma\.claude\worktrees\feat-bf-shared-alignment`

Use the running Storybook only; do not restart port 6114:

- horizontal: `http://127.0.0.1:6114/?path=/story/documentation-examples-spacing-audit--horizontal-guides&globals=baseline:!false;baselineFoundry:!true;context:site;scheme:light`
- vertical: `http://127.0.0.1:6114/?path=/story/documentation-examples-spacing-audit--vertical-guides&globals=baseline:!false;baselineFoundry:!true;context:site;scheme:light`

Browser measurements and real rendered component parts win over CSS intention.
The existing horizontal and vertical pages are the atlas: every included
foundational part must appear in the relevant aligned page, assigned to a
candidate category, mismatch lane or explicit boundary. A separate inventory
page does not satisfy this condition.

## Questions to answer adversarially

1. **Denominator:** Which public primitive, reusable pattern or spacing-owning
   composite part is missing? Which exclusion has not proved who owns the edge?
2. **Measurement:** Which row lacks relevant Site/Docs/App, bordered/unbordered,
   single/multiline, intrinsic/full-width, stateful-paint, nested or composite
   evidence? Give the missing case, not a general coverage percentage.
3. **Horizontal categories:** Which parts are over-collapsed or unnecessarily
   split? Challenge Field, Command, Marker, Continuation keyline and
   Surface/container as hypotheses, including leading/trailing asymmetry,
   bare versus painted markers, and Accordion body-to-label alignment.
4. **Vertical categories:** Derive the count from the rows. Specifically compare
   line-owning controls, fixed compact separation used as gap or edge,
   Surface/container inset, sectioned Card/Tile/Accordion compositions,
   floating Popover/Tooltip surfaces and uniformly padded boxed components such
   as RichChoices. Treat tight-host participation as a mode unless evidence
   requires a spacing family; reject the current Chip witness if it still fails
   the host line.
5. **Minimum-but-not-fewer:** Attempt every plausible merge. For each retained
   split, cite the tier vector, ownership/state behaviour or measured delta that
   makes the merge dishonest. Flag every category supported only by a component
   name or coincidental pixel value.
6. **Visual evidence:** Is each proposed category demonstrated by a real part,
   attached to the correct edge and aligned to its peers? Flag lookalikes,
   wrapper distortion, or guides computed from the wrong selector.
7. **Prior-review gap:** The existing `opus-pragma-recut-adversarial-review.md`
   did not answer its request's question 6. Explicitly resolve whether Card
   header/content/footer and Tile header/content retain distinct 16/16, 8/16
   and 8/8 block-padding patterns, and what that implies for vertical groups.
8. **Gap scale and axis semantics:** Resolve the inverted App hierarchy (field
   8, group 8, section 32, pattern 16), nominal block aliases used inline and
   inline aliases used blockwise, and the newly inventoried reusable
   grid/content-flow/editorial consumers before approving token names.

## Required output

Return a compact findings table with:

| Finding | Direct evidence or measured delta | Category/row affected | Required correction |
|---|---|---|---|

Then provide:

- the smallest defensible horizontal category list;
- the smallest defensible vertical category list;
- unresolved singletons or exceptions;
- a disposition checklist that can be copied into `bucket-table.md`.

Do not provide a verdict, severity ranking, implementation rewrite, unrelated
accessibility/theme/release findings, or a new spacing formula.
