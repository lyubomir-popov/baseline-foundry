# Reply to Opus: final owner-resolution review

Thank you for the two source-backed reviews. Your corrections to A1, A3, A4,
and A6 materially improved the proposal. The owner has now resolved the last
policy questions and asks for one final adversarial pass over the consolidated
specification.

This is read-only architecture review. Do not implement, edit the governing
specification, change `AGENT-INBOX.md`, commit, merge, push, publish, release,
archive, or switch branches. Write only:

`baseline-foundry/docs/cross-repo-token-architecture-resolution-review.md`

## Governing document

Read first:

1. `baseline-foundry/AGENTS.md`
2. `baseline-foundry/AGENT-INBOX.md`
3. `baseline-foundry/docs/cross-repo-token-architecture-spec.md`
4. `baseline-foundry/docs/spacing-architecture-proposal.md`
5. the original audit and both previous cross-repository reviews

Then re-check the cited implementation sources in Baseline Foundry, Pragma,
design-tokens, and baseline-nudge-generator. Preserve all dirty and untracked
work.

## Owner resolution of your C1 recommendation

We accept the evidence behind C1 but reject its classification as a blocker to
`spacing.baseline`.

The premise is now explicit: Pragma's current global 4px baseline,
integer-only density multipliers, selected density cell, target-baseline
calculation, runtime line-height snapping, and fixed component sizing are
temporary implementation. The shared contract must not preserve them. Pragma
must adopt BF's model and match BF's resolved geometry.

Consequently `spacing.baseline` remains in the first spacing-token
contribution:

```text
site = 0.5rem
docs = 0.25rem
app  = 0.25rem
os   = 0.25rem
```

When an intended 20px value was previously written as `5 × 4px`, preserving
that value under an 8px Site baseline means `2.5 × 8px`, not `5 × 8px`.
Moreover, line height, independent inline spacing, and component geometry must
not be represented as baseline multiplication merely to preserve Pragma's old
formulas.

The required distinction is:

- baseline adoption is normative v1 architecture;
- Pragma replacement work may be large and deliberately value-changing;
- the amount of obsolete Pragma code does not make the token optional; and
- no designer must choose between Pragma's nearest integer-cell sizes when BF
  already provides the accepted target geometry.

Challenge this for technical contradictions, but do not re-argue that current
Pragma geometry is a compatibility requirement. It is not.

## Owner resolution on line height

The earlier statement "line height is a typography decision" was too
permissive. Line height is governed typography constrained by the active
baseline:

```text
default: H / B is a positive integer
exception: H / B is a positive half-integer and the exact product/role appears
           in a reviewed exception manifest
otherwise: invalid; fail authoring/build validation
```

The system must push back on arbitrary local changes. A designer cannot add 5%
because something "feels tight" and rely on CSS `round()` to conceal it. Whole
increments are normal; half increments are deliberately rare exceptions.

The accepted first exception is Canonical Site secondary text:

```text
font size 14px / 0.875rem
line height 20px / 1.25rem
Site baseline 8px / 0.5rem
line-height count 2.5
```

Pragma must preserve 20px and remove the runtime snap that would turn it into
24px. Multiline use knowingly alternates between the primary 8px phase and its
4px half-phase; every second line returns to the primary phase. This is
intentional, isolated, and must be visible in validation rather than hidden.

Please scrutinise whether the governing spec states the consequences precisely
enough. In particular, distinguish:

- baseline alignment of glyphs;
- line-to-line advance;
- a single-line component's painted and occupied block; and
- the boundary after an arbitrary multiline half-step block.

If BF's current `nudge + compensation = baseline` assertion assumes a whole-
baseline line height, identify the exact assertion and the smallest honest
contract amendment. Do not solve the half-step role by snapping it to 24px or
changing the Site baseline to 4px.

Also determine the most exact DTCG-compatible way to encode and validate the
14px/20px relationship. The current decimal ratio `1.4286` produces a small
floating approximation; state an appropriate representation and tolerance
without allowing arbitrary fractional leading.

## Owner resolution on controls and density

Pragma must retire its selected cell and target-baseline geometry. Shared
controls use BF's inside-out ledger:

```text
line + symmetric nudge-derived padding + borders = painted block
painted block + trailing compensation = occupied block
```

There is no target `block-size`. Exact BF button/input dimensions are output
acceptance criteria, not authored height inputs. Pragma may continue to derive
alignment from `1cap`; BF continues to use extracted metrics.

Density remains governed contextual inheritance:

- initial provider categories: side-navigation item, table cell, tab item;
- initial subscriber categories: badge, eligible single-line input;
- enrolled descendants adapt automatically;
- unrelated descendants do not; and
- there is no unrestricted public density utility.

A fixed-size host is not inherently unable to provide context to descendants.
It becomes migration debt if it also subscribes, changes accidentally with
product baseline, or fails host-fit checks. Reassess the earlier claim that
`SideNavigation/Item` must lose its fixed size before the manifest ships.

Re-check the arithmetic too: Pragma currently declares
`--space-baseline: 0.25rem`, so `calc(var(--space-baseline) * 5)` computes to
1.25rem/20px at a 16px root, despite the source comment saying 40px. Under an
8px Site baseline it would compute to 40px, not 80px; under App's retained 4px
baseline it remains 20px. Identify any actual cascade evidence that changes
those results.

## Other settled architecture

Do not reopen these without new source evidence of a contradiction:

- semantic `spacing.*` IDs retain DTCG `$type: "dimension"`;
- the product axis is Site/Docs/App/OS;
- inline spacing is independent of the vertical baseline;
- grid exclusively owns page margin, gutter, content padding, subdivision, and
  responsive policy;
- the v1 component contribution has no page/grid roles, breakpoint axis, or
  `spacing.profile.*` layer;
- BF Spec 020 eventually splits into 020a/020b and 020a absorbs 019;
- optional BF root scaling is application policy and creates no token or nudge
  variants;
- the CSS-name transformer, collision detection, semantic classification,
  dimension modifier handling, number output, and public/private
  classification land before token publication; and
- one alignment nudge is supplied per role and product with provenance; the
  engines may calculate it differently.

## Required review questions

Answer each with exact source paths and line references.

1. Is the governing spec internally coherent after making whole baseline
   line-height counts the default and half counts manifest-controlled?
2. Does Site 14px/20px work without runtime snapping? State the exact phase and
   occupied-block implications for single-line and arbitrary multiline use.
3. What must change in BF's current alignment/compensation assertions, if
   anything, to tell the truth about that exception without weakening the
   ordinary whole-baseline contract?
4. What DTCG source representation, metadata, precision, and validation rule
   should prove `14px × line-height ratio = 20px = 2.5 × Site baseline`?
5. Once current Pragma behavior is explicitly non-normative, is there any
   technical dependency that requires excluding `spacing.baseline` from the
   first token PR? Separate schema blockers from downstream migration effort.
6. Does the Pragma migration section remove every selected-cell,
   target-baseline, automatic line-height-snap, and fixed-target assumption
   that conflicts with BF? List omissions only; do not preserve those concepts.
7. Can exact BF button dimensions be proven as derived output with
   `block-size: auto` across both alignment engines? Give the minimal computed
   geometry gates.
8. Is the revised provider-versus-subscriber interpretation correct? Correct
   the prior side-navigation arithmetic and state the real precondition for a
   fixed host to provide dense context.
9. Does any v1 token accidentally encode typography, control geometry, or
   page/grid policy? Recommend removals or renames only where source evidence
   shows a boundary violation.
10. Is the contribution sequence executable with baseline in PR 2? Identify
    genuine cycles and the smallest correction, without postponing the baseline
    merely because Pragma migration is extensive.

## Required output

Write `docs/cross-repo-token-architecture-resolution-review.md` with:

1. verdict: accept, accept with required corrections, or reject;
2. disposition of C1 as schema blocker versus Pragma migration scope;
3. answers to all ten questions;
4. an explicit review of the half-step line-height contract;
5. an explicit review of intrinsic no-target control parity;
6. corrected side-navigation facts;
7. only genuine remaining blockers; and
8. exact wording patches recommended for the governing spec.

This should be the final architecture pass. Prefer exposing a real exception
over weakening validation, and prefer replacing temporary consumer machinery
over distorting the canonical contract around it.
