# Review: element-owned typography selectors

**Reviewed**: 2026-08-23

**Disposition**: Owner correction implemented and green; fresh adversarial
review requested

## Required evidence

| Gate | Result |
|---|---|
| Generated selector regression | Pass. Seven default/tier/preset surfaces each passed 26 ownership/boundary checks; the full build suite reported 5,261 assertions. |
| Reciprocal and boundary browser regression | Pass. Reciprocal H3/H6 roles plus seven prose-boundary cases passed in Editorial, Documentation, App, and OS. |
| `npm test` | Pass. Build, static validation, all component baseline records, and the complete behavior suite are green. |
| `npm run qa:components` | Pass. Captured 88 screenshots and verified every record with zero failures. |
| Rendered Typography Roles review | Pass. Editorial, Documentation, App, and OS were each selected and inspected in the in-app browser. The reciprocal hierarchy remained visible and distinct, with no console warning/error. |
| Fresh adversarial review | Requested in `AGENT-INBOX.md`; pending independent disposition. |

## Source and generated outcome

- `SEMANTIC_SELECTORS_BY_ROLE` now contains only plain element selectors for
  paragraph, H1–H6, and the dormant figcaption/meta mapping.
- Every generated default, tier, and preset bundle contains no `.bf-prose p`,
  `.bf-prose h1`–`.bf-prose h6`, or `.bf-prose figcaption` typography selector.
- `.bf-prose` retains its list, blockquote, rule, measure, and explicit
  trailing-boundary contracts. The boundary resets only final
  `margin-bottom`; metric padding remains element-owned.
- The Typography Roles demo now renders both reciprocal semantic/visual-role
  cases as durable review fixtures.

## Consumer outcome

Diagram Registry can consume the rebuilt BF stylesheet without a local
specificity override. Updating its vendored dependency is outside this spec.

## Adversarial-review remediation

The owner correction rejected removal of the prose boundary. The restored
selector keeps `:last-child` outside `:where()`, matching one-class role
specificity and winning by source order without restating typography.

Browser behavior coverage now checks final plain and `.bf-body` paragraphs,
plain H3 and `h2.bf-h3`, UL, OL, and blockquote. Every case resolves
`margin-bottom: 0px`, preserves start/end padding and occupied height against a
non-boundary reference, and keeps both the prose edge and following first-line
baseline phase on the tier grid. Plain/classed role pairs occupy equal boxes.

The reciprocal test no longer uses a fixed delay or accepts probe/reference
equality alone. It waits for the expected tier and computed sizes, asserts
concrete size, line-height, weight, and style values in both directions, and
requires four distinct tier signatures. Expected role values now derive from
`config/tiers/*.json`, eliminating the duplicated expectation table.

The partial workflow-kit migration was rolled back because it contradicted
accepted Spec 001 SC-006. All active routers again use the lean
`AGENT-INBOX.md` model; a future model change is only a catalogued candidate
pending an explicit owner decision and complete router/audit migration.

The boundary audit confirmed `.bf-card-inner`, `.bf-card`, and
`.bf-panel-content` already keep their child pseudo-class outside `:where()`.
Other zero-specificity first/last-child rules target their own component slots,
not visual-role margins. Static validation now locks the scored shapes and
source order.

`npm run qa:components` is evidence from 88 current screenshot captures plus
the baseline geometry/overflow verifier. It is not a pixel-diff visual
regression suite.
