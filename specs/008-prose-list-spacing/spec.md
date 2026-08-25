# Feature specification: prose list spacing

**Feature branch:** `feat/008-prose-list-spacing`

**Created:** 2026-08-25

**Status:** In progress

## Problem

Direct child lists at the end of `.bf-prose` lose their semantic space-after
because the prose boundary trims every final child's margin. When another
section follows, the list reads as if it touches that section.

## Requirements

- **FR-001:** Direct `.bf-prose` `ul` and `ol` elements MUST retain the body
  role's semantic margin after, including when they are the final child.
- **FR-002:** List space after MUST use the same public body margin token as a
  paragraph; no new hard-coded spacing value is introduced.
- **FR-003:** The prose boundary MUST continue to trim the final semantic
  margin for non-list content and retain class-role precedence.
- **FR-004:** All four built-in tiers MUST expose the same selector contract.
- **FR-005:** Consumers MUST need no local `.bf-*` CSS.

## Success criteria

- **SC-001:** Generated validation rejects a prose boundary that trims final
  lists or a list margin that diverges from the body role.
- **SC-002:** Rendered behavior proves a final list's computed margin equals a
  paragraph's normal computed margin in all four tiers.
- **SC-003:** The complete BF build, behavior, baseline, and component QA gates
  pass.

