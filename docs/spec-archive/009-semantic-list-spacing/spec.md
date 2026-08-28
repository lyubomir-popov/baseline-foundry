# Feature specification: semantic list spacing

**Feature branch:** `feat/009-semantic-list-spacing`

**Created:** 2026-08-25

**Status:** In progress

## Problem

Spec 008 restored space after lists inside `.bf-prose`, but ordinary semantic
lists also appear in component copy slots. Diagram Registry's tiered-list
descriptions expose the gap: paragraphs receive the body role's space after,
while `ul` and `ol` still inherit the global zero-margin reset and touch the
next ruled row.

## Requirements

- **FR-001:** Semantic `ul` and `ol` elements MUST own the body role's semantic
  margin after wherever they appear under `.bf-theme`.
- **FR-002:** List space after MUST use the same public body margin token as a
  paragraph; no new hard-coded spacing value is introduced.
- **FR-003:** Structural list components MUST retain their explicit zero-margin
  container resets.
- **FR-004:** `.bf-prose` MUST retain list indentation as a separate composition
  contract.
- **FR-005:** All four built-in tiers MUST expose the same selector and rendered
  behavior.
- **FR-006:** Consumers MUST need no local `.bf-*` CSS.

## Success criteria

- **SC-001:** Generated validation requires the global semantic-list spacing
  selector and the independent prose-indentation selector.
- **SC-002:** Rendered behavior proves a list inside a tiered-list description
  has the same non-zero computed margin after as a paragraph in all four tiers.
- **SC-003:** Rendered behavior proves the tiered-list structural container
  retains zero margin in all four tiers.
- **SC-004:** The complete BF build, behavior, baseline, component QA, and
  downstream Registry gates pass.
