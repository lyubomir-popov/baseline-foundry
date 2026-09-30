# Claude Opus issue-specific review — completed 2026-09-19

This is a **pre-CP1 evidence/minimisation review**, not completion of the
mandatory CP1 gate. Prepared 2026-09-18 and answered 2026-09-19 in
[`opus-evidence-review.md`](opus-evidence-review.md). Its 21 findings are
dispositioned in [`opus-review-disposition.md`](opus-review-disposition.md).

## Read

Start with `spec.md`, `bucket-table.md` and `evidence/README.md`. Then inspect
`evidence/relationship-ledger.json`, the three source-owner maps and the raw
captures needed to test a claim. Do not treat source category labels as truth.
The source checklist is `component-bucket-matrix.md`; its old assignments are
explicitly historical hypotheses, not the current categorisation.

At the review snapshot, evidence comprised 177 original witnesses in three
tiers, 76 descendant/pseudo probes per tier, and 415 original + 86 extra
declared relationships. There were 51 extra owner/variant entries; 49 had
rendered observations and two had source-based boundary rationales. These are
historical counts; current counts live in [`evidence/README.md`](evidence/README.md).
A green `verify-evidence.cjs` proved structural consistency only. Additional
source completeness/state claims remained open.

## Decide from evidence, not from existing token names

1. What is the smallest defensible horizontal inset list? Challenge Field,
   Command, Continuation/marker composition and Container independently. Which
   equal-valued inset/gap/canvas jobs can really be interchangeable?
2. Can the vertical model remain one control-row contract plus compact and
   broad container edges, with in-box compensation as a mode and zero seams
   as composition? Cite a counterexample for every extra required category.
3. Does Nested need a spacing-token family at all? Chip inherits its host line
   with zero block padding; Badge paints16px with zero block padding. Is the
   difference typography/paint rather than a new spacing category? Tight-host
   placement/alignment is not yet approved just because the child fits a cell.
4. How should intrinsic repeated-child gaps be clustered? Compare actual tier
   vectors and behavioural ownership. A different component name is not a split;
   a shared existing CSS alias is not proof of a merge.
5. Disposition the mismatches without creating one bucket per legacy literal:
   Color popup's row-derived block inset; Markdown H8/V6 and borderless native2;
   preview-switch H8/V4/gap4; TokenTable H10/V8 cells, count/search/meta/empty
   insets; TokenSwatch gap6; GitDiff start4 plus pre8 and comment padding4.
   Recommend shared-contract normalisation, a necessary semantic split, or a
   bounded exception, with the concrete reason. Do not silently restyle them.
6. Which basic owner, internal gap, relevant state or public variant is still
   missing? In particular challenge source-to-part completeness beyond the
   authored145-row inventory. Aggregate login-form-style workflows are not new
   categories unless they introduce a genuinely new reusable spacing owner.
7. Are the two source-only exclusions defensible? Chip's API cannot render the
   nested Badge targeted by dormant CSS. Text-only Cards row-track remapping is
   external layout; Cards' actual intrinsic gutters remain in scope.

Return a compact table: finding, exact source/capture evidence, implication for
category count, required disposition. Then list candidate horizontal/vertical
categories and remaining singleton/exception decisions. No GO/NO-GO verdict,
production rewrite or assumption that the old names/counts are fixed.

After these decisions and the remaining closure work, the separate
`react-visual-poc-opus-review-request.md` is the mandatory CP1 packet. Only after
CP1 is dispositioned may `semantic-spacing-tokens.css` be generated.
