# Spec 022: Pragma component spacing — the bucket model

> **Cold start:** begin with [`README.md`](README.md). It is the authoritative
> current-state, worktree, next-action and verification handoff. This document
> defines the durable objective and method.

**Status**: Design spike. React only. For lead-engineer evaluation.
**Not** a production migration, a release gate, or a framework-parity claim.

**Date**: 2026-09-13. Rewritten from the earlier production-migration plan.
**Scope/denominator revision**: 2026-09-19. Per-edge minimum-sufficient categories;
controls and containers distinguished; internal relationships and deferred
extra owners included.

---

## Purpose

Show that Pragma's components can be rebuilt from the inside out using a small,
explicit geometry contract, and discover the smallest sufficient set of named
horizontal and vertical spacing groups that explains every spacing-owning React
part.

The groups are the point. Once a component's spacing comes from a named group
rather than from a number someone chose, adding the next component becomes a
decision anyone can make and defend: *"a Segmented control is closest to the
command group, so it takes the command group's horizontal padding."*

The north star is **the absolute minimum number of groups, but not fewer**. Two
parts share a group only when they share both the same spacing behaviour and
the same ownership semantics across tiers and relevant states. A new group is
required when a measured part cannot honestly fit an existing one; a group is
removed when its members can be expressed by another group without an
exception or component-specific arithmetic.

The spike is finished when that test has been applied to every spacing-owning
React part, and the resulting groups have been emitted as a traceable semantic
token file.

## The method

Every component is styled from the inside out, using:

1. **line-height** — the text line the component is built around
2. **block-edge geometry** — vertical padding derived for line-owning rows;
   container-region insets, real borders and trailing compensation accounted
   per logical edge
3. **inline-edge geometry** — each logical inset chosen from a group, with real
   borders subtracted per edge
4. **owned internal relationships** — marker canvas, marker-to-text gap and
   other intrinsic child gaps, only where the rendered part owns them

Nothing else sets size. No target height, no minimum height, and no private
component magic number.

## Two axes, two independent lists

**Every spacing-owning edge or internal spacing relationship is classified, and
the horizontal and vertical axes are unrelated.** A symmetric part may use one
group on both edges; an asymmetric part may use different groups at logical
start and end. A Button with a leading icon, for example, can use the Field
inset at start, the Command inset at end, and the Marker gap internally without
becoming a new three-purpose group. A Tab can use Command horizontally and a
Regular/control-row category vertically. A compact child can retain its
horizontal assignments while participating in a tight host with zero
child-owned block inset; that mode is not itself a spacing category.

This is normal and expected. It is **not** a conflict to resolve, and a part
does not need its axes or opposing edges to "match". Do not attempt to collapse
the two lists into one. The previous version of this spec tried that, and the
resulting seven-way classification was unsatisfiable, because half its
categories described horizontal insets and half described vertical behaviour.

### Candidate horizontal groups — what sets the inline padding

| Group | What it is | Typical members |
|---|---|---|
| **Field group** | Content sits at the field inset from the outside edge | Text/number/select/search/password inputs, table cells, status labels |
| **Command group** | A wider inset that makes the control read as an action. More padding makes it bigger, which is what a CTA wants | Buttons, chips, tabs, segmented actions, pagination, file-selector buttons |
| **Marker group** | A fixed-size icon or bullet canvas plus one shared gap to the text. Every icon-to-text and bullet-to-text pairing in the system uses the same gap | Checkbox, radio, list bullets, validation marks, accordion disclosure, tree rows, side-navigation copy, table of contents, notifications |
| **Continuation keyline** | Copy after a leading marker aligns to one outside-edge keyline; the marker-group entry inset is derived by subtracting canvas and gap | Side navigation and navigation trees; Accordion header label and the body text that continues beneath it |
| **Surface/container group** | A container or region owns the inset around child content, measured from its outside edge | Choice cards, panels, tiles, fieldsets, modal and drawer regions |
| **Block-derived boundary** | No horizontal spacing token: the inline size follows the painted block, so the component comes out square or circular rather than padded | Badges, icon-only buttons, bare numbered pagination |
| **Layout-owned boundary** | Not a component bucket: page gutters, grid columns and navigation nesting remain layout spacing | Page and grid composition |

Field, Command, Marker, Continuation and Surface/container are the candidates
observed so far, not a target count. Continuation is a keyline rather than
another inset: its marker-group entry padding is a derived output, not another
bucket. In particular, **padded component/control** and
**padded container/region** are different semantic jobs even when one tier
happens to give them the same number. They may not be collapsed under a generic
`padded` bucket. The completed table must decide whether painted and bare
Marker cases, trailing artwork, or other measured parts require further splits.
Block-derived and Layout-owned remain explicit boundary classifications, but
they do not create component inset tokens.

Accordion is a composition test, not an Accordion-specific bucket. Its header
label reaches the 32/24/24 Continuation keyline through marker canvas and gap;
the expanded body text must reach that same start keyline. The current panel
starts at the 16/16/12 Surface inset, leaving a measured 16/8/12 mismatch. Its
opposite edge may still consume the Surface inset independently.

### Candidate vertical groups — what sets the block behaviour

| Group | What it is | Typical members |
|---|---|---|
| **Regular/control row** | An ordinary line-owning component's vertical spacing, derived from its line-height and nudge | Standalone controls, fields, buttons, tabs and cells |
| **Compact separation** | Candidate fixed 8/8/8 relationship, used as an intrinsic child gap or at a compact container edge only where ownership is interchangeable | Tooltip/Popover block edges; sectioned-region starts; field child separation |
| **Surface/container inset** | Candidate tier-dependent 16/16/12 inset around child content | RichChoices frame; broad Card/Tile region edges |
| **Tight-host participation mode** | Zero child-owned block inset inside an approved line-owning host; any reduced line is a typography/fit contract, not yet a spacing family | Badge, and—only after it actually fits—Chip or another eligible short child in a cell/navigation row |

These are current candidates, not a closed count. The current measurements
support compact 8/8/8 and Surface 16/16/12 (Site/Docs/App) as distinct vectors;
asymmetric pairs compose them rather than automatically adding a region
category. The compact value currently comes from a field-gap alias, so the
merge test is whether the relationship is semantically interchangeable when
used as a gap or an edge—not whether the CSS property happens to be `padding`.
Tight-host participation does not justify a spacing family on current evidence:
the nested Chip still has a 24/20/20 line and fails the intended compact fit,
while Badge's reduced line is role/host geometry.
Padded container regions are specifically unresolved on the vertical axis:
Card header/content/footer, Tile parts, panels and similar regions must be
measured as parts and must not be folded into Regular merely because both are
called padding. Attached-edge compensation may remain an implementation detail
only if the complete table proves that it does not change the semantic block
behaviour. Region ownership and unboxed text may be boundaries rather than
buckets, but that too is a conclusion to demonstrate. A part names the
contracts used by each owned edge/relationship; it does not re-derive their
formulas.

Source inspection currently puts pressure on line-derived rows, compact
separation, Surface/container insets and compositions of those relationships.
Zero block padding is an explicit boundary value, not automatically a semantic
token. The App gap aliases are also internally out of their documented order
(field 8, group 8, section 32, pattern 16); that hierarchy must be corrected or
the ordering contract explicitly revised before a semantic scale can be emitted.
These are measurement questions, not a predetermined final list.

## Nesting in tight contexts

Some hosts already own a line — a table cell, a tab, a side-navigation row, a
dense toolbar. A component placed inside one of those shrinks to fit it. **A chip
in a table cell should become denser; that is the point.**

The present implementation does not satisfy that claim: adding `.is-nested`
removes Chip block padding but leaves its 24/20/20 line-height. A regular-looking
Chip in a cell is a failed witness, not evidence for a Nested bucket. The audit
must show the regular and candidate host form honestly until a supported
host/child contract fits.

What must not happen is the behaviour this model replaces, where a generic
`.dense` or `.comfortable` class on any wrapper resized every descendant beneath
it, whether or not that descendant could cope. The difference is that density
here is a **pairing between two named things**, not a global switch:

- **The host must be a named host that owns a line** — table cell, tab,
  side-navigation row, accordion header, dense toolbar. An arbitrary `div` or
  layout wrapper does not make its children denser.
- **The child must be something that makes sense there.** Ask it directly: would
  anyone ever put this inside that host? A badge, chip, status label, checkbox
  or short input in a table cell — yes, so those need a dense form. A side
  navigation, a table, an accordion or a modal inside a table cell — no, so
  those never need one and should not have one. The set is not frozen; it is
  whatever passes that question and has been shown to fit.
- **A container does not nest inside itself or inside a peer container.** A table
  in a table cell keeps its normal size, or the inner table would be smaller than
  the outer one for no reason.
- **Fitting is the gate, not membership.** If a candidate cannot fit the nested
  line with its real borders, it does not get a dense form, and adding a class
  cannot override that.

So density *is* inferred from context — but only from context that was designed
for it, on both sides.

Geometry:

- **The nested line is the body line minus one active baseline**, block axis
  only. Horizontal padding is unaffected by nesting.
- Two paint cases cover the real work: one with **no layout-bearing border**
  (chip, status label, badge) and one with **two real block borders** (input,
  bordered button, checkbox, radio). Both must fit inside the nested line.

If a tier's nested line cannot contain its body font plus two real borders, that
is a failure to report, not a value to clamp away.

## Border-aware padding

Padding and border are accounted together, so the distance from the **outside
edge** to the content is the same whether or not a border is painted.

```text
padding on an edge = max(inset for that edge − border on that edge, 0)
```

- **Per edge, not per component.** Four logical edge inputs support no border,
  any single edge, all four edges, and asymmetric combinations. An underlined
  input subtracts only its block-end border from its block-end padding.
- **Per rendered box, not per public component.** A composite's frame, header
  and cells each account for their own edges.
- **Zero-layout paint is not a border.** An inset shadow, pseudo-element or
  outline does not enter the calculation. A 3px active edge on a tab or
  navigation item is paint: it must not move text or change the component's
  outside size, and the inactive and active states must measure identically.
- **A real stateful border reserves its width transparently in every state.**
  Changing only its colour must never change geometry.
- Compensation belongs **outside** the border, as `margin-block-end`, so padding
  stays symmetric. Inflating one padding edge to force the border box onto the
  grid is not permitted. The attached-edge group is the named exception.

## Where the nudge comes from

The vertical padding derives from the text's start nudge. **Baseline Foundry and
Pragma derive that nudge differently on purpose, and the rest of the model is
identical.**

- **BF** generates nudges from the real production font metrics, using
  `@lyubomir-popov/baseline-nudge-generator`. Higher fidelity; BF is a
  single-owner sandbox and can take the dependency.
- **Pragma** computes `(line-height + 1cap) / 2` in CSS, for every role,
  headings included. Pragma is multi-stakeholder and cannot mandate a build-time
  generator. The difference is about 0.10 CSS px at body sizes.

Neither repository's output is evidence for the other's. Two consequences for
Pragma:

- The nudge is **published once** from a shared contract and consumed
  everywhere. No component stylesheet contains `1cap`, a copied nudge literal,
  or a private baseline formula.
- `1cap` resolves against whichever font actually loads, so **font
  authentication matters more under this technique, not less.** A fallback face
  silently changes every nudge in the system.

Components inherit the product body role. A component must not declare its own
font family, font size or line height, and the override hooks that used to allow
that are withdrawn.

## The two comparison pages

Two Storybook pages make the groups judgeable by eye. They are the working
instrument of the spike, not its deliverable.

- **Horizontal page** — red marks the real outside/logical-start edge, blue
  marks the real content or text keyline. Marker cases additionally show the
  real marker centre. Members of a horizontal group should line up.
- **Vertical page** — red marks the occupied start, blue the occupied end
  including trailing compensation. Members of a vertical group should line up.

Live review routes:

- [Horizontal keylines](http://127.0.0.1:6114/?path=/story/documentation-examples-spacing-audit--horizontal-guides&globals=baseline:!false;baselineFoundry:!true;context:site;scheme:light)
- [Vertical rhythm](http://127.0.0.1:6114/?path=/story/documentation-examples-spacing-audit--vertical-guides&globals=baseline:!false;baselineFoundry:!true;context:site;scheme:light)

Guides must attach to real rendered component parts. A locally styled lookalike
can illustrate a rule but cannot stand in for the component.

A faint pink baseline overlay at the live product baseline is available for
reading these pages, independently of the existing orange developer overlay.
Either can be on or off without touching the other. Both are review aids and add
no layout geometry.

The comparison surface and every framing element must preserve the live
baseline phase. Token-valued wrapper padding is necessary but not sufficient:
tests must measure representative specimen/text starts against the active grid
origin in both axes, all three tiers and the supported root sizes. A legend,
border or specimen frame that introduces a one-pixel phase shift invalidates
the comparison even when the component's own spacing is correct.

## Assignment rule

For a component that is not yet grouped:

1. Style it inside out — line-height, then block-edge geometry, inline-edge
   geometry and any owned internal spacing relationships.
2. Measure the real rendered part that owns each padding edge and internal gap.
3. **Horizontally**: for each logical edge and internal relationship, does it
   match an existing group's value/formula *and*
   ownership semantics at every tier and relevant state? If yes, it joins. If
   it is close but not equal, say by how many pixels. A near-miss usually means
   the component is wrong, not that a new group is needed.
4. **Vertically**: apply the same test independently to block start/end,
   including any compensation. Do not assume a control row and a padded
   container region share a bucket.
5. Open a new group when a part fails an existing group's value/formula or
   semantic-ownership test. Record the counterexample in one line.
6. After all parts are assigned, try to merge every pair of groups. Keep a
   split only when a named counterexample shows the merge would lose real
   behaviour or ownership. This minimisation pass determines the final count.

Composites are decomposed first. If a Card's header, content and footer own
different padding, that is three assignments, not one. Public exports and
inventory rows are only a source checklist: completion is counted against the
rendered parts that actually own a logical edge or internal spacing
relationship.

## Deliverables

The spike is complete when these four exist, and not before. There is no fifth.

1. Every React spacing-owning part restyled through the shared geometry
   contract — line-height, logical-edge geometry and any owned internal
   relationship — or explicitly classified as a proven non-owner.
2. **The bucket table** — one row per spacing-owning part/variant, giving its measured
   horizontal padding, vertical padding and line-height, and its horizontal and
   vertical edge/relationship groups.
   [`component-bucket-matrix.md`](component-bucket-matrix.md) starts from the
   145-row source inventory and expands into the dynamic part-level completion
   ledger; [`bucket-table.md`](bucket-table.md) holds the measured values and
   decisions.
3. This method, written up.
4. **The full semantic spacing-token file**,
   `semantic-spacing-tokens.css`, derived from the completed and minimised
   table. Every emitted token family/contract must point back to a
   real bucket, every real bucket must be represented, and every spacing-owning
   row must trace each owned edge/relationship to a horizontal or vertical
   semantic token (or to an explicit boundary classification). One bucket may
   require related properties, such as marker canvas plus gap or distinct
   logical start/end aliases; this is one semantic contract, not one literal.

Token names are deliberately open. They follow from the table; do not spend
spike time debating them, and expect to rename later.

## After the spike — how this ships

**The `feat/bf-shared-alignment` reference branch is not the proposal.** It is
456 files and roughly 46,600 insertions across 162 commits. No engineer will
approve that, and none should be asked to. It is *evidence* — proof that the
model survives contact with the whole React set without inflating anything.

The numbers that matter are much smaller, and they are what gets reviewed:

| | Size |
|---|---|
| The model — `component-contract.css` + `typography/alignment.css` | ~400 lines |
| Applying it — 115 component stylesheets | **net +106 lines** |
| Everything else — scanner, allowlist, catalogs, tests | ~40,000 lines |

Applying the model across 115 components was size-neutral, because it replaces
bespoke per-component arithmetic with shared consumption rather than adding to
it. That is the argument.

So production is neither a rewrite nor a merge of this branch:

- **Not from scratch.** The expensive part is already decided — which component
  consumes which token, where each border is accounted, what compensates where,
  which rows attach to their edge. Re-deriving it reaches the same answers at
  full cost.
- **Not this branch.** Its history is the record of working the problem out,
  including reversals. It also carries apparatus built for a goal that has been
  withdrawn, which production would then own forever.
- **Re-cut it.** The same diff, sliced into small reviewable pull requests, each
  copied from this branch as a working reference. Contract first, then one
  component family per request.

The apparatus is left behind unless it is proposed separately on its own merits:
the CSS contract scanner and its allowlist, the composed catalogs, and most of
the test volume, replaced by something proportionate per family.

## Mandatory adversarial review checkpoints

Work stops at four decision points, asks for an independent adversarial read,
waits, and incorporates the corrections before continuing. Reviews report
counterexamples and corrections, not verdicts or severity rankings.

1. **Completed denominator and minimised bucket table** — before generating the
   semantic token file. This is the first mandatory **Claude Opus** review
   because enough evidence has accumulated to challenge omissions and the
   category count, especially padded controls versus padded containers and the
   vertical surface question.
2. **Semantic token file and contract** — ask whether each token family has one
   semantic job, every table row traces to it, and the contract contains no
   private component arithmetic.
3. **First consuming family** — ask whether a real family consumes the reviewed
   contract end to end without private exceptions.
4. **Complete sequence** — before handover. This is the final mandatory Claude
   Opus review of omissions, accidental categories and independent
   reviewability.

Do not request an Opus review of a seed table or half-decomposed denominator;
there is not yet enough evidence for a useful category-count review. Ordinary
independent adversarial reviews may be used inside a batch, but they do not
replace these four mandatory checkpoints.

## Worked examples

Awkward components, recorded because they show the model under load, not because
they are special cases.

- **Table cell** — Field group horizontally, Regular vertically. Cells own
  padding and compensation; rows own neither. Keeping compensation inside the
  painted cell is an implementation detail, not a separate vertical bucket.
  The tallest cell owns the row height, and each additional line adds exactly
  one line-height. An eligible child rendered inside a cell may use the
  tight-host mode only when its actual line and paint fit.
- **Log line** — as above, but on the governed code role rather than the body
  role, with a continuous row fill. Shows the model is role-parametric without
  letting a component choose its own role.
- **Choice card** — Surface/container candidate horizontally; its vertical
  container category remains evidence-derived. Border plus padding equals the
  surface inset from the outside edge on all four sides. The content stack
  inside owns its gaps and the text leaves keep their ordinary alignment. It is
  not a control row and must not be forced into the row bucket.
- **Sectioned card** — Region-owned. One outer frame owns border, radius and
  clipping; header, content and footer each own their padding, and the
  header/content seam is deliberate. This is *not* the equal-padding choice-card
  rule, and the two must not be merged.
- **Active tab and active navigation item** — the 3px edge is paint. Inactive
  and active must measure identically in both axes, in LTR and RTL.

## Out of scope

Do not start any of the following, and do not treat them as prerequisites. If
one looks necessary, stop and ask in one sentence.

- Accessibility and Axe audits
- Release, build, package or publish readiness
- Lit and Svelte — deferred until the React model is approved
- Exhaustive engine and DPR matrices; one engine is sufficient for a spike
- Colour, theme and contrast work, except where it prevents *seeing* spacing on
  the two pages
- Coverage reporting as a goal in itself. The source inventory is a starting
  denominator, while rendered part decomposition and measurement are required
  evidence for completion.
- GO/NO-GO verdicts or P0/P1/P2 rankings. Adversarial review artifacts are
  allowed only at the mandatory checkpoints above and should contain findings,
  evidence and corrections.

## Constraints

- React only. Spec/evidence work is written in
  `H:\WSL_dev_projects\pragma\.claude\worktrees\fix-root-gates`. During
  evidence closure, production component geometry in the broad reference
  worktree is read-only; outside an active Spec 024 T004c0–T004h pause, only
  audit fixtures, catalogs, pages and their tests may be edited there to
  isolate and measure existing owners. During that pause every reference file
  is read-only. Measure released fixtures in
  `H:\WSL_dev_projects\pragma\.claude\worktrees\feat-bf-shared-alignment`;
  never measure the differently modified component CSS in `fix-root-gates`.
  Pre-CP1 inside-out geometry exploration runs separately in
  `H:\WSL_dev_projects\pragma\.claude\worktrees\feat-bf-inside-out-geometry`,
  branched from the T004c recovery snapshot of the reference. The reference
  worktree remains read-only and its evidence snapshot is not invalidated by
  spike results; comparisons must identify the spike source explicitly.
- Keep the spacing-audit Storybook available on port 6114 while the table is
  being reviewed.
- Do not merge, push, publish or release.
