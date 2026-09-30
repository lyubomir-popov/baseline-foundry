# React Global frame junction review

**Verdict:** GO after one rejected implementation and correction.

## Scope

The shared four-edge framed-box part is consumed by React Announcement,
Section, Popover and Tooltip. ContextualMenu separately uses a zero-layout inset
outline because its continuous item fills must meet the visible menu edge.

## Adversarial findings

The first Section revision placed a tier-dependent spacing alias on `:root`.
That could resolve before the nearer Site/Docs/App context was known. The
default now resolves on `.ds.section.bordered` beside its real block-start
border.

The first Popover revision resolved the shared inputs on `.ds.popover`, while
the actual bordered box is its child `.content`. A custom border or padding set
on that child was therefore ignored. The accepted correction adds the narrow
`.ds-framed-box` marker to the painted child and extends only the shared frame
selector to that marker. Row, Field, typography and component-root contracts
remain exclusive to `.ds`.

## Evidence

- Announcement accounts its real 3px logical leading edge. A 3px to 5px change
  preserves outer width and the text keyline in LTR and RTL.
- Section accounts only its block-start edge and preserves its existing public
  override hooks.
- Popover preserves child-local border and padding overrides, its default 1px
  frame, 12px/20px custom insets, long narrow content and forced-colour paint.
- Tooltip retains zero border by default, its prior padding, geometry-stable
  nonzero theming and independent arrow geometry.
- Implementer matrix: 50 passes plus four expected non-Chromium forced-colour
  skips across Chromium, Firefox and WebKit at DPR1/DPR2.
- Corrected independent re-review: no P0/P1/P2; focused React 13/13, shared
  styles 6/6 and browser 8 passes plus four expected skips.
- The global CSS and border-inventory gates remain green. Exact React Global
  border coverage is 82/82 accepted declarations; other React packages remain
  open.
