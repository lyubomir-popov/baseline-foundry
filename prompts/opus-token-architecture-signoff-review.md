# Opus request: final sign-off on the cross-repository token architecture

Perform one final adversarial architecture review of the governing proposal at:

- `H:\WSL_dev_projects\baseline-foundry\docs\cross-repo-token-architecture-spec.md`

Review it against source in all four repositories:

- `H:\WSL_dev_projects\baseline-foundry`
- `H:\WSL_dev_projects\design-tokens`
- `H:\WSL_dev_projects\pragma`
- `H:\WSL_dev_projects\baseline-nudge-generator`

Read each repository's `AGENTS.md` first where present. Also read these evidence
records, but treat the governing spec and the owner decisions below as
authoritative where an older review conflicts:

- `baseline-foundry/docs/cross-repo-token-architecture-audit.md`
- `baseline-foundry/docs/cross-repo-token-architecture-review.md`
- `baseline-foundry/docs/cross-repo-token-architecture-final-review.md`
- `baseline-foundry/docs/cross-repo-token-architecture-resolution-review.md`
- `baseline-foundry/docs/component-spacing-architecture.md`

This is a final sign-off pass, not a request to redesign settled policy. Do not
merge, commit, push, publish, release, switch branches, or implement anything.
Do not edit the governing spec or `AGENT-INBOX.md`.

## Settled owner decisions

Do not reopen these as preference questions. Challenge only a factual error,
internal contradiction, infeasible contract, or missing executable dependency.

1. Baseline Foundry is the normative geometry reference. Pragma's current
   density cell, fixed target sizes, line-height snapping, and local component
   geometry are transitional and must not constrain the shared schema.
2. `spacing.baseline` is a required v1 token. It resolves to `0.5rem` for Site
   and `0.25rem` for Docs, App, and OS.
3. Line height remains a typography value constrained by the active product
   baseline. Whole baseline counts are the default. Explicitly reviewed
   half-counts are the only exception; quarter counts, arbitrary fractions, and
   runtime rounding fail.
4. Site secondary text remains 14px/20px, or 2.5 Site baselines. The exception
   is keyed on its semantic root role; bold/code and other `$ref` dependants
   inherit it and must be enumerated by validation.
5. Site display keeps an 84px font size and changes from 92px to 96px line
   height, exactly 12 Site baselines. Verify the safest Canonical source edit
   and its blast radius; do not assume a global primitive mutation is correct.
6. A 14px/20px instance knowingly exits on the 4px half-phase even when
   single-line. Multiline instances alternate between the 8px primary phase
   and 4px half-phase. This is accepted. There is no generic wrapper `mod()`
   repair for an arbitrary intrinsic multiline `auto` height.
7. Shared controls use BF's intrinsic inside-out ledger: governed line height,
   metric/alignment padding, borders, and complementary trailing compensation.
   There is no authored target `block-size`, density cell, or target baseline.
8. Density is governed contextual inheritance. Side-navigation items, table
   cells, and tab items are initial provider categories. Badges and eligible
   single-line inputs are initial subscriber categories. Exact identifiers
   belong in the implementation manifest.
9. Pragma may retain `1cap` for alignment because its team will not consume
   generated metric nudges. This is a known engine difference, not permission
   to weaken the spacing schema.
10. The architecture uses product as the shared resolver axis, keeps primitive
    reusable dimensions under `dimension`, publishes semantic relationships
    under `spacing`, keeps alignment under typography, and gives page/grid
    responsiveness to a separate grid owner.

## Recalculate the Ubuntu Sans comparison

Independently verify the governing spec's calculation from the actual shipped
Ubuntu Sans variable font and the real BF and Pragma formulae. The current
record says the sampled width/weight axes share:

```text
units per em = 1000
ascender      = 940
descender     = -260
cap height    = 693

BF metric anchor = (940 - 260) / 2 = 340 units
1cap anchor      = 693 / 2         = 346.5 units
delta            = 6.5 units       = 0.0065em
```

For body-sized control roles, the proposed theoretical comparison is:

| Font size | Anchor/nudge delta | Symmetric painted-block delta |
| ---: | ---: | ---: |
| 12px | 0.078px | 0.156px |
| 14px | 0.091px | 0.182px |
| 16px | 0.104px | 0.208px |

At the optional 18px root the proposed maximum painted difference is 0.234px.
The spec therefore proposes a provisional 0.25 CSS px envelope for measured
first-baseline and painted-block divergence, with exact occupied block and no
modulo-boundary crossing. A tolerance of one baseline is explicitly rejected
as too loose.

Check all of the following rather than validating the arithmetic in isolation:

- whether the compared anchors accurately reproduce BF's metric formula and
  Pragma's production `1cap` formula;
- variable-font width and weight axes;
- border subtraction and zero clamping in the occupied-block ledger;
- BF generator drift compensation for sizes above 1rem;
- CSS `cap` behavior, fractional layout, zoom, DPR, and browser rounding;
- whether a small input delta can wrap across `mod()` and change the occupied
  multiple; and
- whether `0.25 CSS px` is a defensible provisional browser gate or should be
  expressed differently.

Do not replace it with a broad percentage or a fraction of an 8px baseline. If
0.25px is not supportable, propose the smallest evidence-led gate and explain
exactly which fixtures must determine it. Distinguish clearly among first-text-
baseline position, painted border-box, occupied block, and rasterised pixels.

## Required review questions

Answer each explicitly:

1. Is the v1 spacing schema now internally sound and contribution-ready after
   the required plumbing PR?
2. Does any token still encode typography, control height, density-cell policy,
   or page/grid policy under an inappropriate `spacing.*` name?
3. Is the Site line-height lattice enforceable as a blocking PR-2 gate with
   84px/96px display and the inherited 14px/20px semantic exception?
4. Is the accepted half-phase behavior described honestly for both single- and
   multiline text, without implying a generic CSS phase-restoration mechanism?
5. Does the revised `1cap` parity contract state exactly what can be equal and
   what can only be bounded? Identify any remaining false equality claim.
6. Is the 0.25px provisional envelope supported by source arithmetic, and is
   the planned empirical test matrix sufficient to make it durable?
7. Does changing Site display to 84px/96px require a scoped semantic override,
   a new primitive, or a safe existing primitive reference? Name affected
   consumers precisely.
8. Is the PR order executable: token plumbing; baseline/component tokens and
   lattice validation; BF format adapter; approved BF values and Pragma
   adoption; grid work later; generator integration only if useful?
9. Are all previously identified Pragma migration removals represented,
   including the bare-product target baseline, four fallback owners, secondary
   line-height snapping path, legacy density aliases, `spaceAfter-button`, and
   missing OS context?
10. Is anything still a schema blocker, as distinct from implementation work or
    empirical acceptance evidence?

## Output

Write the review to:

- `H:\WSL_dev_projects\baseline-foundry\docs\cross-repo-token-architecture-signoff-review.md`

Use this structure:

1. **Verdict:** `accept`, `accept with required corrections`, or `reject`.
2. **Blocking findings:** severity, exact source evidence, consequence, and the
   smallest correction. Say `none` if there are none.
3. **Answers to questions 1–10.**
4. **Metric/cap calculation audit:** formulae, values, and any corrected bound.
5. **Implementation watchlist:** non-blocking work that must appear in the
   handoff or tests.
6. **Exact wording patches:** only if the governing spec remains factually or
   logically wrong.

Keep schema blockers separate from Pragma migration debt and from empirical
test work. Finish by stating whether implementation planning may begin.
