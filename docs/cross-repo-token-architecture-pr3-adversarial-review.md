# PR 3 adversarial review

Date: 2026-09-04

Verdict: accept with required corrections

The independent review reran the complete suite, reproduced all 48 provider
values from design-tokens `18f57b9`, drove the production reader with malformed
artifact and overlay copies, inspected generated CSS and manifests, and
confirmed that the adapter preserved BF geometry. It found no scope leak into
020a values, density, grid/page work, Pragma, publication, or release.

## Required findings

| ID | Severity | Finding | Correction |
|---|---|---|---|
| F0 | High | Production shape/provenance validation did not authenticate values. A mutation at one of the seven overlaid Canonical points could be hidden by the overlay and still pass the legacy-value guard. | Pin an ordered 4 × 12 SHA-256 digest in production and prove that all 48 individual mutations are rejected through the production validator. |
| F1 | High | The seven overlaid values were emitted under Canonical `--spacing-*` names, making those names carry non-Canonical values. | Keep Canonical properties on the final matrix; preserve the seven current values only on BF compatibility properties. |
| F3 | Medium | BF and Canonical can both emit the unnamespaced Canonical property set; import order and nested product scopes were neither tested nor documented. | Verify the real root-only provider CSS in both orders and use an explicitly synthetic product-scoped fixture as a future collision guard, including nested Docs/App/OS scopes. |
| F4 | Low/medium | Custom BF themes emitted Canonical names derived only from BF config. | Custom themes emit only BF-owned properties and omit `canonicalSpacing`. |
| F5 | Low | A baseline override and downstream mismatch throw were unreachable, but the evidence claimed that rejection. | Remove the dead override/throw and correct the evidence. |
| F6 | Low | Built-in config spacing fields had become assertion-only without edit guidance. | Make the build error and adapter documentation direct edits to the pinned artifact/overlay contract. |

The review also found that the original prompt pre-set the two weakest design
questions and did not explicitly ask about mixed ownership or custom themes.
The correction-review request now treats those as claims to attack.

## Confirmed strengths

- The full pre/post BF matrix stayed value-neutral.
- The overlay contained exactly the seven approved points and its 020a removal
  condition was enforced by production code.
- Shape, source, product, ID, DTCG type, unit, and overlay-boundary failures
  came from production validation.
- The explicit OS spacing path did not depend on Canonical's omitted identical
  `.os` typography reset.

This verdict did not authorize push, merge, publication, release, Pragma
adoption, or 020a value adoption.
