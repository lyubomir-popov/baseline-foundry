# Review: element-owned typography selectors

**Reviewed**: 2026-08-23

**Disposition**: Implemented and green; awaiting owner review and merge

## Required evidence

| Gate | Result |
|---|---|
| Generated selector regression | Pass. Seven default/tier/preset surfaces each passed 22 ownership checks; the full build suite reported 5,218 assertions. |
| Reciprocal four-tier browser regression | Pass. H3-with-H6 and H6-with-H3 matched every measured role property in Editorial, Documentation, App, and OS. |
| `npm test` | Pass. Build, static validation, all component baseline records, and the complete behavior suite are green. |
| `npm run qa:components` | Pass. Captured 88 screenshots and verified every record with zero failures. |
| Rendered Typography Roles review | Pass. Editorial, Documentation, App, and OS were each selected and inspected in the in-app browser. The reciprocal hierarchy remained visible and distinct, with no console warning/error. |
| Fresh adversarial review | Pass after remediation. No critical finding and no blocking implementation defect remained; stale closeout claims and duplicate-worktree cleanup were the only high/medium operational findings. |

## Source and generated outcome

- `SEMANTIC_SELECTORS_BY_ROLE` now contains only plain element selectors for
  paragraph, H1–H6, and the dormant figcaption/meta mapping.
- Every generated default, tier, and preset bundle contains no `.bf-prose p`,
  `.bf-prose h1`–`.bf-prose h6`, or `.bf-prose figcaption` typography selector.
- `.bf-prose` retains its list, blockquote, rule, and measure composition
  contracts. Its broad last-child reset is removed so both plain and classed
  semantic elements retain element-owned trailing rhythm.
- The Typography Roles demo now renders both reciprocal semantic/visual-role
  cases as durable review fixtures.

## Consumer outcome

Diagram Registry can consume the rebuilt BF stylesheet without a local
specificity override. Updating its vendored dependency is outside this spec.

## Adversarial-review remediation

Claude's first review correctly identified that removing the prose-prefixed
typography selectors exposed the later `.bf-prose > :last-child` reset. That
reset is now absent, and browser behavior coverage proves final plain and
`.bf-body` paragraphs retain the same concrete tier-owned margin.

The reciprocal test no longer uses a fixed delay or accepts probe/reference
equality alone. It waits for the expected tier and computed sizes, asserts
concrete size, line-height, weight, and style values in both directions, and
requires four distinct tier signatures.

The partial workflow-kit migration was rolled back because it contradicted
accepted Spec 001 SC-006. All active routers again use the lean
`AGENT-INBOX.md` model; a future model change is only a catalogued candidate
pending an explicit owner decision and complete router/audit migration.

The fresh independent review identified a formatting-sensitive substring check;
the final validator now extracts rule selectors and rejects prose-prefixed
semantic elements across whitespace and direct-child spellings. The remaining
non-blocking scope boundary is deliberate: the reciprocal browser case covers
H3/H6 typography metrics rather than every possible role-specific layout
property.

`npm run qa:components` is evidence from 88 current screenshot captures plus
the baseline geometry/overflow verifier. It is not a pixel-diff visual
regression suite.
