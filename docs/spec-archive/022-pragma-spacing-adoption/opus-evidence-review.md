# Opus evidence review — spec 022 spacing taxonomy

Reviewer: Claude Opus 5, run against the `fix-root-gates` evidence set and the
`feat-bf-shared-alignment` reference worktree. Date: 2026-09-19.

This is the pre-CP1 evidence and minimisation review requested in
[`opus-evidence-review-request.md`](opus-evidence-review-request.md). It is not
the mandatory CP1 gate, and it deliberately returns no GO/NO-GO verdict. No file
in either worktree was modified.

## Method

Everything below is derived from the evidence artifacts, not from the category
labels in `bucket-table.md` or `component-bucket-matrix.md`. For every
relationship in `relationship-ledger.json` I resolved its per-tier owner capture
in `browser-measurements.json` or `variant-measurements.json`, extracted the
outside edge (padding + that edge's real border), gap, and trailing
compensation, and clustered the resulting Site/Docs/App triples. Source claims
were then checked against the reference worktree CSS directly.

Working set: 442 numeric `token-owner` observations across 501 declared
relationships, yielding **34 distinct value-vectors** — 25 horizontal, 23
vertical (some shared). Scripts were scratch only and are not left in the repo;
the extraction is reproducible from the two measurement artifacts plus the
ledger, with no browser run required.

### The discriminator the current table is missing

Splitting those 34 vectors by two independent axes — does the value respond to
the tier, and does its source expression read a semantic contract token —
separates the corpus cleanly:

| Class | Rows | Distinct vectors | Meaning |
|---|---:|---:|---|
| A — tier-varying, semantic token | 200 | **14** | the actual design-system surface |
| B — tier-varying, no semantic token | 14 | 7 | typography nudges, `em` units, raw baseline |
| C — tier-invariant, semantic token | 65 | 6 | deliberate invariants plus the field-block gap |
| D — tier-invariant, literal or magnitude alias | 163 | 16 | unmigrated legacy |

**Class A is the whole question.** 200 of 442 observations, and those 14 vectors
collapse further because eight of them are arithmetic compositions of the other
six (proved below). Classes B and D are not candidate categories at all; they
are a migration backlog that the current table has been treating as taxonomy
pressure. That reframing is the single most useful thing in this review: the
bucket table currently says "hold as explicit unmatched relationships" for the
legacy numbers without a criterion, and this is the criterion.

Caveat on class C: tier-invariance is a *signal* requiring justification, not
proof of error. Two invariants are defensible and documented in source —
`--ds-stroke-thickness` (1px) and `--ds-leading-mark-canvas` (16px, described in
`CheckboxInput/styles.css` as "an intentional fixed paint box, independent of
the baseline grid"). The third, `--spacing-gap-field-block` (8/8/8), is the one
that matters, and it is discussed as finding F4.

## Findings

| # | Finding | Evidence | Implication for the category count | Required disposition |
|---|---|---|---|---|
| F1 | "Continuation" is a **keyline**, not an inset, and `--ds-leading-mark-group-inset` is its arithmetic residual | `--ds-inline-inset-continuation` = 32/24/24. Accordion summary, `.ds.side-navigation-item > .row`, `.ds.node` and `.ds.side-navigation-header` all measure **8/0/4** via `--ds-leading-mark-group-inset`, which is exactly `continuation − (mark canvas 16/16/16 + mark gap 8/8/4)`. `.ds.side-navigation-header` reaches the keyline as `8+16+8 = 32` (Site), `0+16+8 = 24` (Docs), `4+16+4 = 24` (App), while `.ds.nav-tree > .group > .header` reaches the identical 32/24/24 by reading the continuation token directly. Docs residual is **zero** | Removes one horizontal candidate. 8/0/4 is not a spacing value: it is a composition remainder that legitimately reaches 0 | Keep one continuation keyline contract. Express the group inset as derived (`continuation − marker lane`), not as a token in the semantic file. This is the same argument the table already accepts for the Card header seam — apply it consistently |
| F2 | The Select trailing artwork lane is the marker lane | `.ds.input.select` trailing edge measures **32/32/24** = field inset 8/8/4 + canvas 16/16/16 + mark gap 8/8/4. Start edge is the plain field inset | Removes the "field inset plus trailing artwork canvas" candidate | Derived composition. Do not mint a Select-specific end-edge category |
| F3 | The field inset and the marker gap are numerically **identical in all three tiers**, and are the single largest cluster in the corpus | `--ds-inline-inset-field`, `--spacing-gap-mark-inline` and `--ds-leading-mark-gap` all resolve to 8/8/4. Combined, 55 observations across 37 owners | The measurement cannot justify two categories. Keeping them separate is a purely semantic decision | Decide it as a semantics question and record the reason. There is **zero** numeric evidence for two names; if they stay separate, the spec must say what would have to change for them to diverge |
| F4 | The "compact container block edge" is not a container inset — it is the **block gap token used as padding** | Card, Tile, Accordion content, Tooltip, Popover and Announcement all take block-start from `--spacing-gap-field-block` (8/8/8, tier-invariant) and block-end from `--spacing-inset-surface-block` (16/16/12, tier-varying). Confirmed on the unjoined-header capture: `pbs 8 / pbe 16` Site and Docs, `pbs 8 / pbe 12` App | Does **not** add a category. It changes what the asymmetry *is*: not "compact edge vs broad edge", but "a gap value standing in for an inset on one edge" | Decide explicitly. Either the start edge is an inset and must tier (today it does not), or the asymmetry is unintended. Note the side effect: the header ratio is 8:16 in Site but 8:12 in App, so the asymmetry is not a constant proportion — no one has signed that off |
| F5 | The block-gap scale is **non-monotonic in the App tier** | field 8/8/8, group 24/24/8, section 32/32/32, pattern 64/48/16. In App that reads 8, 8, 32, 16: group is indistinguishable from field, and pattern is **half** of section | Directly affects how many block-gap steps are real. A four-step scale that collapses to three values with an inversion in one tier is not four steps | Resolve before any semantic file is generated. This is a scale defect, not a component mismatch, and it is currently invisible in the bucket table because that table only tests inset merges |
| F6 | The in-box row is the regular row with compensation folded in — exactly, not approximately | ContextualMenu items, Tabs links and Combobox options measure **9.544/2.851/2.851**; regular row is 6.456/1.149/1.149 and compensation is 3.088/1.702/1.702. `6.456+3.088 = 9.544`, `1.149+1.702 = 2.851` | Confirms the request's hypothesis: in-box compensation is a **mode**, not a category | Express as a mode. Reject any proposal for an in-box row bucket |
| F7 | Four more class-A vectors are border arithmetic, not contracts | `7/7/3` = field − stroke; `5.456/0.149/0.149` = row − stroke; `9/9/5` = field + stroke (phone country divider); TokenTable `9/9/9` = 8 + 1px border and `.search` `8/8/8` = 7 + 1px border | Removes four apparent horizontal/vertical candidates | Record the per-edge border-aware rule once. Every one of these is the same rule applied at a different node |
| F8 | Nested needs **no** spacing-token family | Nested Chip: `padding-inline` 16/12/12 (unchanged Action inset), `padding-block: 0`, `margin-block: 0`, line-height inherited 24/20/20. Nested Badge: `padding-inline` 1/1/1 (unchanged), `padding-block: 0`, line-height forced to **16px in every tier** via `--badge-nested-line-height`, rect exactly 16×16 | Removes the Nested candidate entirely | Both nested forms are an existing zero block boundary plus their own unchanged inline inset. Badge's only non-zero change is a line-height, which is typography — and it lands on precisely the marker-canvas value (16). Say so, and stop treating a class name as a bucket. Tight-host placement approval remains separate and is not settled by this |
| F9 | The GitDiff file header is the corpus's only **`em`-based** spacing | `--git-diff-file-header-horizontal-padding: 1em` and `--git-diff-file-header-items-gap: 0.5em` → 16/14/14 and 8/7/7, tracking font-size (16/14/14), not the spacing scale | Explains a listed "mismatch" without a new category. 16/14/14 sits within 2px of Action 16/12/12 in every tier | Shared-contract normalisation to Action + mark gap. This is the clearest normalisation candidate in the whole mismatch list |
| F10 | MarkdownEditor is the corpus's only **raw `px`** spacing | `--markdown-editor-toolbar-horizontal-padding: 8px`, `-vert-padding: 4px`, `-input-horizontal-padding: 8px`, `-input-vert-padding: 6px` | No new category. These are unmigrated literals (class D) | Bounded exception with an expiry, or normalise. Do not model H8/V6 as a contract |
| F11 | `.ds.accordion` uses the **raw baseline** as an item gap | `gap: var(--spacing-baseline)` → 8/4/4, the only 8/4/4 in the entire corpus | A singleton produced by reading a magnitude instead of a semantic gap | Normalise to the field-block gap or state why Accordion rhythm is baseline-locked. A one-off vector with one witness is not a category |
| F12 | Block-gap tokens are used on the **inline** axis, and an inline gap token on the **block** axis | `.ds.categories-section > .payload` and `.ds.icon-section > .payload` use `--container-gap-default` (group, 24/24/8) as `column-gap`. `.ds.form-choices` uses `--container-gap-loose` (pattern, 64/48/16) as `column-gap` while its `row-gap` is 8/8/8 — a 64px inline separation between radio options in Site. `.ds.input.color > .color-popover` uses `--form-field-inline-gap` for `row-gap` | Either the gap scale is axis-neutral, in which case the `-block` suffix in its name is wrong, or these are misuses | Decide the axis question once, at the scale level. Do not disposition these component-by-component |
| F13 | Three components bypass the `--ds-*` contract layer and read upstream names directly | `component-contract.css:132` defines `--ds-inline-inset-field: var(--spacing-inset-field-inline)`. Chip, Announcement and SelectInput read `--spacing-inset-field-inline` directly | No effect on the count — the values are identical — but it means the contract layer is not the only surface a rename must consider | Normalise to the `--ds-*` alias, or drop the alias. Two live names for one value in a spec about minimisation is hard to defend |
| F14 | The Chip→Badge boundary is **dead code**, not a boundary | `Chip/types.ts` omits `children` from *both* the interactive and static prop unions. The CSS at `Chip/styles.css:120` can therefore never match. Its two relationships are `margin-inline-start: var(--spacing-inset-field-inline)` and `margin-inline-end: calc(var(--ds-stroke-thickness) * -0.75)` | Exclusion is correct, rationale is weaker than it should be | Delete the rule rather than carrying a permanent "source-only boundary" for a selector the public API cannot produce. A rationale keeps the obligation alive; deletion ends it |
| F15 | The Cards text-only exclusion is right for the **wrong stated reason** | The four relationships are `grid-row: span 3`, `grid-row: 1`, `grid-row: 2`, `grid-row: 3` — integers, not lengths. And they live in `Card/styles.css`, i.e. Card's own stylesheet, so "external layout" does not describe them | Exclusion holds; the denominator should not have contained them | Re-state as "carries no length" — a criterion that also cleanly excludes the other grid-placement rows, rather than a per-case judgement |
| F16 | `verify-evidence.cjs` does not validate the 86 extra relationships' references at all | The script asserts `refs.has(relation.measurementRef)` only for the **string** form. The 86 extras use the `measurementRefs` object form, and nothing checks that the `captureId` exists, that its status is `measured`, or that `targetIndex` is in range | The "green verify proves structural consistency" claim covers 415 of 501 relationships, not 501 | Extend the check, or scope the claim in `README.md` and `bucket-table.md` to what it actually covers |
| F17 | **Seven capture IDs exist twice** in `variant-measurements.json` with contradictory statuses | `extra-select-multiple-no-artwork-variant`, `extra-color-inline-hex-row-variant`, `extra-section-hero`, `extra-section-deep-unbordered`, `extra-markdown-editor-preview-switch`, `extra-git-diff-comment-icon`, `extra-token-table-empty-inset` each appear in `captures` as `measured` **and** in `ownerExtraProbes` as `missing-or-hidden / matched: 0`, in all three tiers. The ledger refs name an artifact and an ID but not which list | No taxonomy effect — I confirmed the measured records are real. But an ID-keyed reader silently reads the failing record and concludes these variants were never rendered. I did exactly that on the first pass | Namespace the probe IDs or add the list to the ref. Assert ID uniqueness within an artifact in `verify-evidence.cjs`. Left as-is, this will mislead the CP1 reviewer the same way it misled this one |
| F18 | 14 of 51 direct owner probes fail in every tier | `extra-badge-nested-variant`, `extra-chip-nested-variant`, `extra-card-header-standalone`, `extra-markdown-editor-borderless-content`, `extra-tooltip-caret-other-placements` and the seven above | The headline claims resting on these — notably "unjoined fixture now confirms compact/broad composition" — rest on **live-DOM mutation**, not on any rendered inventory state | Already flagged in `sourceFixtureModifications`, but `bucket-table.md` does not carry the caveat where the claim is made. Move it there |
| F19 | The inventory misses real spacing owners in scope | No relationship anywhere covers `.ds.view-layout` (`gap: var(--view-layout-gap, var(--container-gap-default, 1rem))`), `.token-table-container` (`gap: 0.75rem`, adjacent to in-scope TokenTable rows), `.ds.tabs-item` (`margin: 0; padding: 0`), or `packages/styles/main/src/grid.css` `.content-flow` / `.editorial`, which read `--spacing-gap-group-block` and `--spacing-gap-field-block` — in-scope tokens with out-of-scope owners | T001/T002 stay open, correctly. The missing owners are layout-gap owners, which is the family the current table covers least | Add them, or state a scope rule that excludes layout containers and apply it to `.ds.cards` too — which *is* in the ledger, with `--grid-gutter` |
| F20 | `packages/react/tokens` ships a **duplicate, orphaned** TokenTable/TokenSwatch implementation | `TokenTable/TokenSwatch.tsx`, `TokenSwatch.css` and `TokenTable.css` are imported by nothing; `TokenTable.tsx` imports `./styles.css` and `./common/TokenSwatch/`. Both stylesheets define `--token-table-cell-padding`, with **different** values (`0.625rem 0.75rem` vs `0.5rem 0.625rem`) | No effect on measured values — the dead files never render — but `source-manifest.json` hashes them, and anyone grepping TokenTable spacing finds two contradictory answers | Note as dead code. Do not let the duplicate values enter the mismatch list as if both were live |
| F21 | `.ds.button.link` drops the inset **and** the row compensation | Measured 0 on every edge and `margin-block-end: 0`, against 3.088/1.702/1.702 on every other Button | Correctly a zero boundary, but the missing compensation means a link Button cannot share a baseline with a sibling Button | Confirm this is intended for an inline-text variant. If it is, record it as a boundary with a reason; it currently reads as an omission |

RTL: `icon-button-ltr` and `icon-button-rtl` report identical logical padding
(start 7/7/3, end 15/11/11). Because the capture records logical properties, a
physical `padding-left` implementation *would* have shown as a swap — so this
does discharge the RTL concern for Button. It discharges it for Button only.

## Candidate categories the evidence actually supports

### Horizontal — four tier-varying inset values plus one invariant canvas

| Candidate | Site / Docs / App | Source | Witnesses |
|---|---|---|---|
| Field inline inset | 8 / 8 / 4 | `--ds-inline-inset-field` | large, across form and global |
| Action inline inset | 16 / 12 / 12 | `--ds-inline-inset-action` | 24 observations, 12 owners |
| Surface inline inset | 16 / 16 / 12 | `--spacing-inset-surface-inline` | 30 observations |
| Continuation keyline | 32 / 24 / 24 | `--ds-inline-inset-continuation` | 2 direct + 4 composed (F1) |
| Marker canvas | 16 / 16 / 16 | `--ds-leading-mark-canvas` | deliberate invariant |
| *Marker gap* | *8 / 8 / 4* | `--ds-leading-mark-gap` | numerically identical to Field (F3) |

Derived, not categories: 8/0/4 (F1), 32/32/24 (F2), 7/7/3 and 9/9/5 (F7).

So the answer to question 1 is **four**, or five if the marker gap survives F3 on
semantic grounds. Every other horizontal vector in the corpus is class B or D.

### Vertical — one row contract, one container inset, one gap scale

| Candidate | Site / Docs / App | Source | Note |
|---|---|---|---|
| Row block padding | 6.456 / 1.149 / 1.149 | `--ds-row-padding-block-*` | cap-metric derived |
| Row trailing compensation | 3.088 / 1.702 / 1.702 | `--ds-row-compensation-block-end` | mode, with F6 |
| Surface block inset | 16 / 16 / 12 | `--spacing-inset-surface-block` | the only tier-varying container inset |
| Block gap: field | 8 / 8 / 8 | `--spacing-gap-field-block` | invariant; also acting as an inset (F4) |
| Block gap: group | 24 / 24 / 8 | `--spacing-gap-group-block` | |
| Block gap: section | 32 / 32 / 32 | `--spacing-gap-section-block` | invariant, `--dimension-400` |
| Block gap: pattern | 64 / 48 / 16 | `--spacing-gap-pattern-block` | scale inverts in App (F5) |

The request asks whether the vertical model can stay "one control-row contract
plus compact and broad container edges". On this evidence, **yes, with one
correction**: there is exactly one container *inset* (16/16/12). The thing being
called the compact container edge is the field-block gap. So the model is one
row contract, one container inset, a block-gap scale that a container may read
on an edge, zero as a seam, and compensation as a mode. That is fewer moving
parts than the current draft, not more.

One counterexample to the stated "compact start + broad end" phrasing:
`.ds.form-rich-choices > .ds.option > label` measures 16/16/12 on **both** block
edges. It is not a new category — it is a container that reads the inset on both
edges — but it shows the asymmetry is a per-edge choice, not a fixed pattern.
The per-edge schema already in `tasks.md` handles it; the prose does not.

Confirmed from the evidence, needing no change: Card/Tile asymmetry composes
shared edges (F4, and the unjoined capture), and the joined-header zero is a
seam.

## Remaining singleton and exception decisions

Ordered by how much they block the token file.

1. **Blocking.** The App-tier gap-scale inversion (F5). No semantic file should
   be generated over a scale that is non-monotonic in one of its three products.
2. **Blocking.** Whether a container edge may read a gap token (F4). It decides
   whether the start edge tiers, which changes measured output in App.
3. **Blocking, cheap.** Field vs marker gap (F3) — one semantic decision,
   recorded with its reason.
4. **Blocking, cheap.** Gap-scale axis neutrality (F12) — one decision at the
   scale level, disposing of three component-level mismatches.
5. **Normalise.** GitDiff `em` spacing (F9) — the strongest normalisation case.
6. **Normalise or time-box.** MarkdownEditor `px` literals (F10); Accordion
   baseline gap (F11); the `--spacing-inset-field-inline` bypass (F13).
7. **Bounded exception, with an owner and an expiry.** The `.ds.token-table` /
   `.ds.token-swatch` family: 10/10/10, 6/6/6, 5/5/5, 13/13/13, 12/12/12, 4/4/4,
   1/1/1. Every one is class D, tier-invariant, off-grid, and confined to one
   package. They are a migration list, not seven categories. `.ds.token-table
   .search` at `0.4375rem` (7px) and cells at `0.625rem` (10px) are not on any
   step of any scale in this system.
8. **Delete, do not rationalise.** Chip→Badge (F14).
9. **Re-state the criterion.** Cards text-only (F15).
10. **Still open, unchanged by this review.** Tight-host placement and alignment
    approval for nested children; full state coverage beyond the named variants;
    the 145-row inventory's completeness, which F19 shows is not yet closed.

## What this review did not establish

- It did not re-run the browser capture. Every measurement quoted is read from
  the committed artifacts, so a collector error would propagate into it.
- It did not verify glyph-font authentication, screenshots, or the source-hash
  provenance chain beyond reading `verify-evidence.cjs`.
- F19 comes from a CSS scan of the reference worktree with a class-name match
  against the ledgers. It is a lower bound on missing owners, not a complete
  denominator — a rule whose classes appear elsewhere in the ledger under a
  different selector would not show up.
- Nothing here approves a taxonomy. The mandatory CP1 packet
  (`react-visual-poc-opus-review-request.md`) is unaffected and still outstanding.
