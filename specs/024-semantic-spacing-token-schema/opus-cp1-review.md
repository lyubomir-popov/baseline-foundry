# Opus CP1 taxonomy review

**Reviewer:** Claude Opus 5.5, subagent launched by the orchestrating Claude Opus 5.5 session; did not produce the reviewed packet (produced by GPT)

**Date:** 2026-09-30

**Snapshot:** Baseline Foundry HEAD `9462230` (one untracked prompt file, outside the review scope); Pragma frozen source `90386bfbf`; spike base `313ee82c1`, spike tip `1c2c6ba73`; gallery manifest SHA-256 `eb701f7fccd160bac4612e4fd81f22cde7ab83f6b7846b49235e404a0bb94bbe` (recomputed and matched).

**Scope:** `cp1-review-packet.md`, `taxonomy-merge-ledger.md`, `component-inventory.{md,json}` via `scripts/t006-dispositions.ts`, `hardcoded-length-report.{md,json}` (sampled), spec FR-021, FR-039–FR-047a, FR-053a/b, FR-054*, FR-055, contract §7a, both T004h reviews. Pragma was read only through `git show`/`git grep`. Eleven gallery images viewed.

## Verdict

**Accept with bounded corrections.**

The role set is a sound working hypothesis for components-first cuts: the inset/gap split is clean, axes are carried per edge, every one of the 169 rows has a disposition, and the ledger argues causally rather than from equal values. Two P1s block the parts of the packet the owner is being asked to sign now – the gap values (decisions 2–3) and the visual sign-off – not the role vocabulary. Both are bounded packet corrections; neither needs new capture or implementation.

## Findings

### P1-1 – full body-line closure and the proposed gap values contradict each other

The 2026-09-28 closure rule adds up to one body line after each closed text element so that later text stays on the shared body-line phase (§7a). The proposed gaps then add a value that is not a whole body line: element 8/4/4, Docs/App group 16 against a 20px body line, pattern 64/32/32. Each gap after closed text therefore knocks the following text off the phase that the closure just paid a blank line to keep.

- Visible: `ds-global / components-card-spacing-contract / site` (after). Card Content paragraph-to-paragraph baseline step is 56px (24 line + 24 closure + 8 element gap), so the second paragraph sits 8px off the 24px body-line phase. The Card header-to-content baseline step is 64px (24 + 16 seam + 24 closure), leaving 40px of white in a Card seam that was about 15px before. The story grows by 370/318/250px Site/Docs/App.
- Visible: `ds-global / components-heading-in-context / site`. Every paragraph gains a blank line and the last heading drops about 176px.
- Closure plainly applies to paragraphs inside `.ds` hosts, so packet decision 8 ("SidePanel title closure") is under-scoped. The question is whether *component* text closes to the body line at all.
- This also answers the question behind decision 2, which the packet leaves unmotivated. Site group 24px is exactly one Site body line (3 bU). The Docs/App equivalent would be 20px (5 bU), not 16px (4 bU). The 1/3/8 versus 1/4/8 asymmetry is the difference between "group = one body line" and "group = 4 bU".

**Correction:** add one owner decision ahead of decisions 2–3, and state its visible cost. Gaps between closed text elements either:

- (a) preserve the body-line phase, so group and pattern become body-line multiples (for example Site 24/72, Docs/App 20/40) and element-gapped text accepts local off-phase;
- (b) component text closes only to bU, so decision 8 is generalised to all `.ds` text; or
- (c) off-phase inside components is accepted and the cost is recorded.

Decisions 2–3 are then confirmed against that rule.

### P1-2 – the gallery renders the spike wiring, not the taxonomy, and "where to look" omits the dominant changes

The T009 corrections moved six inline relationships to inline roles on paper. The gallery "after" still routes them through block or inset channels at spike tip `1c2c6ba73`:

| Relationship | Taxonomy | Spike wiring | Visible effect |
|---|---|---|---|
| Tooltip icon to copy | `gap.mark.inline` | `--ds-gap-element-block` | Docs/App 8→4px (from source; not viewed within the image budget) |
| Tile Header artwork | `gap.mark.inline` | `--ds-gap-element-block` | – |
| Card Footer peers | `gap.element.inline` and `.block` | one `gap: --ds-gap-element-block` | chips tighten on `ds-global / components-card-header-content-footer / docs` |
| Card Header peers | `gap.element.inline` | `--spacing-inset-surface-inline`, an inset used as a gap (an FR-042a defect in the spike) | – |
| RangeControl slider/number | `gap.element.inline` | `--form-group-gap` | – |
| Choices columns | `gap.element.inline` | `--container-gap-loose` → `--ds-gap-pattern-block` | App columns widen 16→32px on `ds-global-form / components-choicesfield-columns / app` |

The where-to-look list says "Card padding – check all section edges" but not what changed or why (FR-054c). It is silent on:

- the Card height growth and closure blank lines (P1-1);
- the Cards gutter change (P2-4); and
- inline gaps moving with block values.

The packet also proposes no values for any inline role, so the owner cannot judge the mark/element inline split or seed FR-055's `spacing-roles.css`.

**Correction:**

- Add to the packet a table of every inline relationship whose gallery rendering follows legacy/block wiring.
- Rewrite where-to-look entries 4–9 to say what changed and why.
- State current and proposed Site/Docs/App values for the six inline roles.
- Scope the CP1 visual sign-off to block insets, closure and block-gap values; inline-role visuals move to the family cuts.

### P2-1 – `continuation` is a derived keyline, not an authored role

- Accordion content indent is `calc(header inline padding + chevron size + header gap)` (Accordion Item `styles.css` at `90386bfbf`).
- SideNavigation child rows indent by `--sidenav-icon-column-inline-size`.

In both members, changing the mark gap or the action/field inset *should* move the continuation. That is FR-042's own merge test, and it runs opposite to the ledger's argument. A free `spacing.inset.continuation.inline` token would let the content fall out of alignment with the summary copy. Record it as a computed composition, the same category as phase and closure, and count **9 authored component roles** unless the owner wants continuation to vary independently of its summary keyline. The Accordion and SideNavigation cuts may revise this.

### P2-2 – the Button icon-leading edge breaks the ledger's own action↔field breaker

`button-composite` assigns `spacing.inset.field.inline` to Button inline-start on the icon-and-text variant. The ledger rejects action↔field because "a field keyline change must not resize action breathing", but this binding does exactly that. The source gives no field relationship: `--button-padding-inline-start: var(--dimension-100)` is an optical tightening because "the icon then sits closer to the edge". This is a value-coincidence merge.

Before the Button cut, choose between:

- an action-owned reduction, for example action inset minus mark gap, derived; and
- a recorded magnitude under FR-047a.

### P2-3 – seam ownership is one question for Card/Modal/SidePanel *and* Section, and it decides whether `group` and `pattern` have component meaning

- FR-043 defines `group` by the example "header, body and footer". The taxonomy composes the Card/Modal/SidePanel seams from two surface insets instead, so no component implements `group`'s defining example.
- Section at `90386bfbf` pads only its block-end on default and deep, with top padding 0. That is separation from the next section carried as padding – FR-043's `pattern` relationship implemented as an inset – so `pattern` has zero consumers.

The packet's decision 4 covers only the first half.

**Correction:** frame decision 4 as one principle, adjacent insets or container gaps, applied to both seams. If insets win, record that FR-043's `group` example is not realised by components and that `pattern` is unevidenced in Pragma, owned by Spec 020b. The machine record for Section also leaves the default, deep and hero block edges without an assignment or boundary; the strip treatment exists only in exception prose, and `assertT006Coverage` does not check per-edge completeness.

### P2-4 – Cards is counted as a `group` member but its gap is the grid gutter

`ds-global/group/Cards` is one of five `group.block` members. Its `gap` is `var(--grid-row-gap, var(--grid-gutter)) var(--grid-column-gap, var(--grid-gutter))`, which FR-021 excludes and whose redirect FR-040 deleted. The gallery shows the consequence without the packet mentioning it:

- adjacent Cards abut in `ds-global / components-card-spacing-contract / site` (the 16px gutter band is filled in the diff);
- Cards gutter geometry changes in every `groups-cards-*` story (0.8–8.8% of pixels; `ds-global / groups-cards-span-four / site` is +74px).

**Correction:** either reclassify Cards as a page/grid boundary, leaving four `group` members (Form, SideNavigation root and Content, TokenTable), or record that the Cards cut rewires its row gap to `group`. Name the change in where-to-look either way.

### P2-5 – anchor offset is classified two ways

Tooltip trigger distance becomes a positioning boundary because placement may use either axis. ColorInput's trigger-to-popover offset (`margin-block-start: var(--form-group-gap)`) is instead an `element.block` member. As a result, changing label-to-control rhythm moves the ColorInput popover while the Tooltip does not move.

Use one disposition for anchored overlay offsets, a positioning magnitude or an earned role, and apply it to Popover and ColorInput alike. The ColorInput family cut owns it.

### P2-6 – the ChoicesField/RichChoicesField divergence is unrecorded

The Choices row gap falls back to `--form-group-gap-default`, which is `element` at 8/4/4. The deferred RichChoicesField row gap falls back to provider `--spacing-gap-field-block` at 8/8/8. Both rows are credited to `element.block`, so the form cut will tighten bordered rich-option cards from 8px to 4px on Docs/App. Otherwise a surface-separation breaker must be admitted.

Record this in the packet and in the semantic backlog before the form cut.

### P2-7 – decision 7 omits the numbers the owner needs

The packet names the ≤0.5px versus device-pixel choice and the −1/64px mechanism but not their magnitude:

- Docs one-line cross-size residuals are 0.531–0.766px and App 0.531–0.609px, so ≤0.5px fails **every** Docs/App cross-size pair today. Choosing it means metric-authority work before any token.
- Drift is about −1px per 64 closed elements (−1.547px at 100 paragraphs, T004h F2).
- ColorInput's 0.032px tolerance sits exactly at −1/32px.

**Correction:** add these figures to decision 7 with the consequence of each option.

### P2-8 – the 129 "no axis-correct candidate" exceptions include live role carriers

The class is 74 TokenTable, 27 `styles/main`, 23 form, 4 Svelte and 1 launchpad records. It contains:

- the live form gap scale – `--form-field-block-gap`, `--form-field-label-gap`, `--form-group-gap` and `--form-field-label-description-gap` in form `index.css`;
- the `--density-space-{lg,md,sm,xs}` comfy/dense cells in `modifiers.density.css`.

These are block gaps with obvious `group`/`element` candidates. They lack membership only because their files are not denominator rows, so the recorded reason is false for them. They also show that the density axis currently modulates gap magnitudes (App group 10 bU comfortable, 8 bU dense), which decision 10 does not address.

**Correction:** reclassify these about 32 records as role-bearing carriers pending the form and density cuts. Then state whether `element`/`group` gaps are density-governed (FR-044) or density-invariant.

The alias class (559 plus 8) is honest as labelled. However, declaration-level role evidence is only 5 alias references plus 12 semantic findings, so the 201 memberships are profile assertions, not declaration proof. The packet should say so.

## P3 notes

- About 16 of the 129 records are `DensityTestbed` and docs-example literals. The inventory already excludes `DensityTestbed` as an unexported spike, so they should be boundaries, not owned exceptions.
- The gallery's "rendered-height delta" reads +0px whenever a story fits the 900px viewport. `ds-global / components-heading-in-context / site` reports +0px despite about 176px of content growth. Measure document height instead, or label the metric.
- In `ds-global-form / work-in-progress-subcomponent-colorinput-field-contract / docs` (after), the open popover's hex/separator row sits under the following field's inline hex row. The story therefore cannot evidence decision 9's one-sided separator.
- The ColorInput swatch grid is two-axis (`gap: 0.25rem`, a raw literal), but the profile names only `element.inline` for swatches. Its row gap is covered only through the broad "between popover children" condition.
- The Tooltip change is confined to the surface block edges on Site (`ds-global / components-tooltip-with-icon / site`), as claimed.
- `section-conditional` gives block-start to the bordered frame and block-end to shallow. This matches the source but reads as an error without a one-line note.

## What the packet gets right

- Every row has a disposition, and conditions separate variant sub-boxes rather than double-assigning an edge.
- The structured checks make the T009 corrections enforceable.
- The inset/gap separation (FR-042a) is applied to every row.
- Pattern is kept external rather than given a fabricated component member.
- The App 8/8/32/16 contradiction and the `section` alias removal are correctly resolved.
- The T008 current-main sheet genuinely shows 40/32/32 occupied controls and 8/16 surface edges.
- ColorInput's per-edge exception is correctly tied to T004h F3 and not allowed to widen the general bound.

## Decisions for the owner

1. **Closure versus gaps (new, before 2–3):**
   - should gaps between closed text elements preserve body-line phase;
   - does component text close to the body line or to bU;
   - is off-phase inside components accepted?
2. **Gap values:** confirm or correct the group asymmetry in the light of 1. Site group equals one body line and Docs/App 16px does not. Then confirm App 4/16/32 and the `section` removal.
3. **Count:** 9 authored component roles plus continuation as a derived keyline, plus the external pattern candidate. Alternatively keep 10 with an explicit reason why continuation should vary independently of its summary keyline.
4. **Seam principle:** adjacent insets or container gaps, one rule for Card/Modal/SidePanel and Section, with the consequence for FR-043's `group` example and for `pattern`.
5. **Metric authority:** ≤0.5px, which Docs/App fail today by 0.531–0.766px and so means metric work first, or ≤1px at DPR 1. Settle it at CP1 or CP2, and say whether −1/64px per element (about 1px per 64 elements) is acceptable.
6. **Button icon-leading edge:** a derived action reduction or a recorded magnitude, not `field.inline`.

## What must be decided now, and what the family cuts may revise

**Now:** decisions 1–6 above, because each changes the value set or the structure the first family cut builds on. The first cut is almost certainly Button/Card.

**The family cuts may revise:**

- surface breadth and any major-overlay breaker (Modal/SidePanel cut; packet decision 5);
- the compact icon-only close action (Button with Modal/SidePanel; decision 6);
- the ColorInput separator, swatch-grid axes and anchor-offset disposition (ColorInput cut; decision 9, P2-5);
- the RichChoicesField gap (form cut; P2-6);
- whether `element`/`group` gaps are density-governed, and Chip host-fit (form and Chip cuts; decision 10, P2-8);
- the Cards row gap as `group` or grid gutter (Cards cut with Spec 020b; P2-4);
- TokenSwatch promotion (tokens cut; decision 11);
- the values of `mark.inline` and `element.inline`, which each cut records in `spacing-roles.css`;
- closing the 271/567 exception backlog family by family (decision 12), which is accepted as bounded recut work subject to the P2-8 reclassification.

Every revision is recorded in that cut's task entry under FR-055.
