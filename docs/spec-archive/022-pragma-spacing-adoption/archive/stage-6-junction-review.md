# Stage 6 shared-alignment junction review

**Date:** 2026-09-11

**Pragma worktree:** `feat-bf-shared-alignment`

**Verdict:** **GO — no remaining P0 or P1 findings**

This review covers the Stage 6 Batch B/C component junction after the corrected
foundation review authorized Stages 5–8. The review was read-only. The only
remaining Pragma worktree modification was the preserved MSW line-ending
change.

## Accepted corrections

- `818d66763` maps Form's asymmetric block borders into the shared per-edge row
  inputs.
- `333f4c7de` restores the nested Svelte Button Action inset by contributing the
  outer inline border before consuming the shared bordered lane.
- `bde3ee0a1` centralizes and protects the marker canvas, gap and group inset;
  React and Svelte SideNavigation, Accordion and the Storybook marker rows
  consume those outputs.
- `61a31a779` groups the circular Badge with Field/cell content, renames the
  marker family, moves Panel to its own grid-gutter lane and makes the guides
  follow the active product context.
- `d33581fe7` makes arbitrary legacy block-padding hooks inert on migrated
  single-line Form/TextField rows so rendered geometry cannot diverge from the
  shared compensation ledger.
- `0d6eac134` removes Form's private bordered-Field formula, contributes its
  nominal inline border to the shared contract and consumes the shared bordered
  Field output.

## Reproduced evidence

- Shared and scanner unit suites: 44/44 tests, 135 assertions.
- Form static suite: 6/6.
- Chromium focused suites: Form 8/8, SideNavigation 4/4, shared React components
  42/42.
- Post-review full engine runs: shared React components 126/126, Form 24/24 and
  SideNavigation 12/12 across Chromium, Firefox and WebKit at DPR 1 and 2 and
  16px and 18px roots.
- Global scanner: 515 raw diagnostics, 25 sanctioned classifications and 490
  transition identities, with zero new or stale entries.

The Storybook horizontal guide reproduced these product values:

| Product | Field | Badge centre | Action | Marker centre / text | Panel |
|---|---:|---:|---:|---:|---:|
| Site | 8px | 12px | 16px | 16px / 32px | 16px |
| Docs | 8px | 10px | 12px | 8px / 24px | 16px |
| App | 4px | 10px | 12px | 12px / 24px | 12px |

Accordion, Checkbox, Radio, bullet and status dot matched the common marker
rails. Table text matched Field, the circular Badge used a distinct centre
guide, and Panel text matched the grid-gutter guide.

## P2 follow-up

- Physical left/right Form border overrides still use the nominal inline
  ledger input. A 2px left override remains one pixel off the Field rail. This
  direction-aware native-glyph/per-edge work stays assigned to T019; it must not
  expand Stage 6's intentionally single-inline-input row ledger.
- Specialized Form surfaces including Textarea, Color, FileUpload and
  RichChoices still consume legacy block-padding hooks. The withdrawal proven
  here is specifically for migrated single-line rows; the remaining surfaces
  stay under T019.
- The implementation plan requested one commit per component, while
  `a2350bbe4` and `d40a5883f` are reviewable component batches. Do not rewrite
  the already reviewed history; disclose or reconcile this process deviation at
  closeout.
