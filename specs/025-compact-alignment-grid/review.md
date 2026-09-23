# Review evidence

## Scope and governance

- Implemented on `feat/025-compact-alignment-grid` from clean base
  `c97ae4fca21ee1e87d23b208951abe3ed61a223f` in the isolated
  `baseline-foundry-alignment-grid` clone.
- Direct user authorization promotes Spec 025 and permits the reviewed fixed
  spatial-control exception without changing Spec 022.
- Generated `dist/`, `generated/`, screenshots, and dependencies remain
  untracked build artifacts.

## Automated evidence

- `npx --yes npm@11.19.0 test`: pass. The static build suite reports 24,463
  checks; all component baseline checks and the real-Chromium behavior suite
  pass.
- `npx --yes npm@11.19.0 run qa:components`: pass. The affected demo is
  captured at `tmp/screenshots/components/alignment-grid.png` and reports zero
  baseline failures in editorial, documentation, app, and OS tiers.
- Browser assertions resolve the control to 58 by 58 CSS px in all four tiers,
  with nine 16px targets, 2px gaps/padding, 6px dots, and no overflow.
- Browser interaction covers pointer selection, one roving tab stop,
  Up/Down/Left/Right, Home/End, RTL horizontal direction, and runtime errors.
- Responsive runtime coverage proves a custom 75rem application breakpoint at
  1024px and 1216px, plus drawer-first aside binding that remains inert until
  the aside becomes pinned and then accepts keyboard resize input.
- Follow-up CSS coverage proves the paired
  `is-wide-workspace-breakpoint` modifier remains a drawer with overlay at
  1024px and becomes persistent at exactly 1200px, while an unmodified
  application remains persistent from the default 768px boundary.
- Wide-viewport Chromium coverage proves `is-navigation-drawer-forced`
  suppresses persistent geometry at 1440px, synchronizes drawer and overlay
  ARIA without reinitialization, moves focus into the opened drawer, closes and
  restores focus on Escape, then restores persistent CSS/runtime state when
  removed.
- Chromium focus-return coverage opens application navigation and panel drawers
  from contextual-menu-like triggers that become hidden, then proves
  `data-bf-focus-return` restores each persistent target through Escape,
  explicit Close, and overlay dismissal. Missing and unresolved IDREFs retain
  the trigger fallback, and the suite reports no browser runtime errors.
- Both drawer runtimes also open with a persistent Stage return target and
  honor a View target declared on the explicit Close control for that close
  only. An absent Close attribute retains the Stage opener, and a Close ID that
  resolves only outside the configured root falls back to Stage rather than
  the disappearing Close control; Escape and overlay behavior remain intact.
- Chromium collapsed-rail coverage proves a pinned application aside carrying
  `is-collapsed` computes to `display: none` with a zero-sized rectangle, while
  the main region retains positive height. `elementsFromPoint` includes the
  main drawer command and a real pointer click opens the BF-owned drawer.
- The `implement-component` live Pragma standards pull and independent
  `standards-review` lookup were unavailable because this environment has no
  `pragma` executable. The BF repository instructions, active Spec 025, static
  build contract, full component baselines, and Chromium behavior suite were
  used as the fallback quality gate.

## Visual review

The affected dark component capture was inspected after final QA. The grid is
intrinsic rather than stretched, its selected centre target is unambiguous,
all nine dots remain centred, the BF border and active tokens are visible, and
the specimen has no clipping or inline overflow. Automated computed-style
review covers the same geometry across all four tier stylesheets.
