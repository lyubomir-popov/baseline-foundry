# Adversarial review request — Pragma React spacing re-cut

> **Historical request.** Completed 2026-09-15 and superseded by the
> 2026-09-18 checkpoint protocol. Do not execute this request. Branch hashes,
> task status and wording below are preserved as snapshot data.

Read `spec.md`, `plan.md`, and `tasks.md` in this directory first. This is not
a new checkpoint: CP4 remains T027. The request is a bounded design review
before further cuts turn a visible marker-geometry problem into several PRs.

## Scope and current cuts

The source of truth is still the existing Pragma spike, not a duplicate spec:

`H:\WSL_dev_projects\pragma\.claude\worktrees\feat-bf-shared-alignment`

The re-cut chain currently ends at these local, unpushed branches:

| Task | Branch | Commit | Scope |
| --- | --- | --- | --- |
| T010–T014 | contract chain | `49841db85` | provider, one `1cap` cap engine, component ledger, tier roots |
| T015 | `feat/pragma-commands` | `81e2dff56` | Button, Chip, Tabs |
| T018 | `feat/pragma-fields` | `8edb22f59` | renamed `field-geometry.css`, native inputs and textarea |
| T019 | `feat/pragma-markers` | `3a3d3cb70` | Checkbox, Radio, Switch, Choices, toggle rows, unboxed field copy, Accordion seat removal |
| T020 | `feat/pragma-attached-rows` | `49cd1a160` | ContextualMenu items and Combobox options; no production React Table exists to cut |
| T021 | `feat/pragma-surfaces` | `11b58e397` | RichChoices cards and Card sections |
| T022 | `feat/pragma-navigation` | uncommitted | SideNavigation inspection only; do not review it as a completed cut |

No branch has been pushed, merged, published, or released. The root gates are
not a review target. Do not propose unrelated test, scanner, accessibility,
colour/theme, Lit/Svelte, package, release, or coverage work.

## Evidence to inspect

Use the running Storybook only; do not restart port 6114.

- Horizontal audit: `http://127.0.0.1:6114/?path=/story/documentation-examples-spacing-audit--horizontal-guides&globals=scheme:none;baseline:!false;baselineFoundry:!true;context:site`
- Vertical audit: `http://127.0.0.1:6114/?path=/story/documentation-examples-spacing-audit--vertical-guides&globals=scheme:none;baseline:!false;baselineFoundry:!true;context:site`

Compare the relevant portions of the spike, the current cut chain, and BF's
component-spacing architecture. Browser measurements and real rendered
specimens win over CSS intention. Do not modify either repository.

## Questions to answer adversarially

1. **Marker-led geometry.** The current radio and checkbox visibly appear
   outdented, checkbox-required-marker content is similarly suspect, and marker
   vertical centring appears lost. Determine whether the model needs two
   independent horizontal marker-led groups:
   - bare marker-led content, flush with its container's real edge; and
   - padded marker-led content, whose row begins 0.5rem from that edge.

   Do not collapse those with vertical behaviour. For every real marker,
   verify whether it occupies and centres in a 1rem canvas against the first
   text line. State the smallest correct owner for the marker canvas, group
   inset, gap, and first-line vertical offset. Reject any new nudge formula:
   Pragma keeps the one existing `1cap` cap engine.

2. **Vanilla icon provenance.** Inspect Accordion and other chevrons implicated
   by the spacing pages. Decide whether their observed corner/shape behaviour
   comes from a non-Vanilla icon source or merely the audit framing. If a swap
   to the Vanilla framework icon is necessary for vertical geometry, name the
   exact component and the correct task; otherwise say it must stay out of the
   spacing re-cut. This is an alignment question, not an icon-system redesign.

3. **Audit specimens.** Check whether the horizontal and vertical audit pages
   contain real specimens for Checkbox, Radio, Switch, required-marker field
   copy, actual chevrons, and ordered/unordered lists. Identify missing real
   specimens and the smallest existing-story or audit-page location that can
   add them without turning coverage reconciliation into a goal.

4. **Block-derived paint.** Decide whether a real square Button belongs on that
   audit group. If Pragma has no such component, record that as absence; do not
   create one for the audit.

5. **Placement and reviewability.** For each supported correction, say whether
   it belongs as a small amendment to T019, in a named later task, or must wait
   until CP4. Preserve the task order and independent-reviewability of every
   cut. Call out any correction that would make an existing PR non-minimal.

6. **Header rhythm and padded parts.** In the audit header, an `h1` followed by
   a plain `p` looks optically displaced on the pink grid, although initial
   browser measurement shows the occupied `h1` end and following `p` start meet
   within 1/32px. Confirm whether that is metric paint rather than accumulating
   `1cap` layout error; do not replace the cap engine. Also assess whether Card
   header/content/footer and Tile header/content should deliberately retain the
   measured 16/16, 8/16, and 8/8 block-padding patterns. Do not make them one
   group merely because the audit image places them next to each other.

## Required output

Write the complete adversarial review to:

`specs/022-pragma-spacing-adoption/opus-pragma-recut-adversarial-review.md`

Then add one short link to that file under the active Pragma spacing work in
`AGENT-INBOX.md`; do not paste the review into chat. Use findings with direct
evidence, a measured delta where applicable, and a proposed task placement.
Do not give a GO/NO-GO verdict, priority ranking, or progress narrative.
