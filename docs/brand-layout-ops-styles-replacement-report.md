# Brand Layout Ops Local Styles Replacement Report

Scope:

- Downstream file audited: `C:\Users\lyubo\work\repos\brand-layout-ops\apps\overlay-preview\src\styles.css`
- Upstream package audited against: current `baseline-foundry` after the overlay drawer pass (`50814bf`)

Goal:

- identify which local `brand-layout-ops` rules can be deleted now and replaced with `baseline-foundry`
- identify which local rules are still justified because they are app-specific
- identify which local rules should become the next `baseline-foundry` porting priorities

Important note:

- `baseline-foundry` no longer keeps downstream alias selectors for these patterns.
- The migration target is the canonical Foundry markup and classes, not a like-for-like class-name swap.

## Executive Summary

The file falls into three buckets:

1. Delete and replace now:
   drawer/backdrop logic, pinned-aside resize behavior, equal-width dense tabs, selectable preset/output rows, style/mapping palette cards, compact color-input sizing, operator-selector strips, fill-height panel behavior, checkbox-field density overrides, dense action-row helpers, most slider-pair styling, helper text/meta styling, and some generic wrapper grids.
2. Replace with markup changes:
   several local `display: grid` wrappers should become `bf-stack`, `bf-cluster`, `bf-fixed-width`, or the shipped tabs/forms/panel shell.
3. Keep local:
   stage rendering, authoring overlays, selection handles, inline stage editor, and other canvas/editor-specific styling.

Follow-up audit on 2026-03-30:

- The live `brand-layout-ops` preview now renders credibly against current `baseline-foundry` without depending on missing upstream panel primitives.
- The remaining stale `p-*` class usage found during the latest audit lives in `apps/overlay-preview/src/paragraph-styles-section.ts`, but that module is currently unreferenced dead code rather than part of the live inspector path.
- The practical swap risk is therefore downstream cleanup and dead-code removal, not another upstream Foundry port.

## Replace Now

| Local block | Recommendation | Replace with |
|---|---|---|
| `styles.css:86-106` `.drawer-backdrop` | Delete. This is superseded by the package drawer shell. | `l-application__overlay`, `l-aside.is-overlay` / `is-drawer`, `l-application.is-drawer-expanded`, `p-panel__toggle`, and `initPanelDrawers()` from `baseline-foundry` |
| `styles.css:47-84` `.bf-application__aside-resize-handle` | Delete or reduce to app-only overrides. The package now ships the pinned-aside resize runtime and visible handle treatment. | `l-application__aside-resize-handle` / `bf-application__aside-resize-handle` plus `initResizableAsides()` and the built-in `is-resizing-aside` shell state |
| `styles.css:299-341` `.config-tabs`, `.output-profile-tabs` | Delete. Move the markup to the canonical equal-width tab modifier. | canonical `p-tabs--equal` / `bf-tabs--equal` |
| `styles.css:363-384` `.preset-radio-row*` | Delete. Move the markup to the canonical choice-row component. | canonical `p-choice-row` / `bf-choice-row` and `p-choice-list` |
| `styles.css:417-462` `.style-palette*` | Delete. Move the markup to the canonical option-grid and option-card components. | canonical `p-option-grid` / `bf-option-grid` and `p-option-card` / `bf-option-card` |
| `styles.css:244-258` `.slider-pair` | Mostly delete. The package already owns the horizontal/stacked range wrapper and number-input pairing. | `.p-slider__wrapper`, `.p-slider__wrapper--stacked`, `.p-slider__input`, plus `initRangeControls()` |
| `styles.css:343-345` `.output-profile-meta` | Delete if the markup switches to shipped helper text. | `bf-form-help` / `p-form-help-text` |
| `styles.css:242-246` `.control-help` | Delete. Tight helper text is now a shipped modifier rather than app-local spacing repair. | `.p-form-help-text.is-tight` / `.bf-form-help.is-tight` |
| `styles.css:286-290` `.control-color` | Delete. Compact color input sizing is now a shipped treatment. | canonical `.p-color-input` / `.bf-color-input` |
| `styles.css:497-527` `.operator-selector*` | Delete. This is now a shipped inline-options micro-pattern rather than a one-off app strip. | canonical `.p-inline-options` / `.bf-inline-options` |
| `styles.css:177-184` `.drawer-panel` | Delete. Fill-height panel behavior is now a shipped helper rather than a downstream-only shell rule. | `.p-panel.is-fill` / `.bf-panel.is-fill` |
| `styles.css:186-196` checkbox-field overrides under `.mascot-app` | Delete. Dense checkbox-field rhythm is now owned package-side. | shipped checkbox/group density rules in `baseline-foundry` |
| `styles.css:200-211` `.playback-export-actions` | Delete. Dense action-row overflow handling is now a shipped helper. | `.p-actions.is-nowrap` / `.bf-actions.is-nowrap` |
| `styles.css:391-401` `.control-composite` range styling | Mostly delete. The range fill/background behavior is already owned upstream. | `input[type='range']` styling from `baseline-foundry` plus `initRangeControls()` |
| `styles.css:409-410` `.control-checkbox` | Delete. This margin reset is already covered by the shipped checkbox/control styles. | shipped checkbox/form control styles |
| `styles.css:386-389` `.preset-empty` | Delete and use base text/help styling directly. | `bf-body` or `bf-form-help` depending on the semantic role |

Relevant upstream package surface:

- `C:\Users\lyubo\work\repos\baseline-foundry\src\css-compat.ts:618`
- `C:\Users\lyubo\work\repos\baseline-foundry\src\css-compat.ts:628`
- `C:\Users\lyubo\work\repos\baseline-foundry\src\css-compat.ts:791`
- `C:\Users\lyubo\work\repos\baseline-foundry\src\css-compat.ts:947`
- `C:\Users\lyubo\work\repos\baseline-foundry\src\css-compat.ts:1007`
- `C:\Users\lyubo\work\repos\baseline-foundry\src\css-compat.ts:1040`
- `C:\Users\lyubo\work\repos\baseline-foundry\src\css-compat.ts:2394`
- `C:\Users\lyubo\work\repos\baseline-foundry\src\css-compat.ts:2422`
- `C:\Users\lyubo\work\repos\baseline-foundry\src\css-compat.ts:2466`
- `C:\Users\lyubo\work\repos\baseline-foundry\src\panel-drawer.ts:152`
- `C:\Users\lyubo\work\repos\baseline-foundry\src\resizable-aside.ts:1`

## Replace With Markup Changes

These are not really "component CSS" so much as layout wrappers that should become combinations of the existing primitives.

| Local block | Recommendation | Replace with |
|---|---|---|
| `styles.css:260-274` `.preset-panel-content`, `.config-section`, `.config-group`, `.editor-form`, `.config-sections` | Remove local wrapper classes over time. | `bf-stack` with default/tight spacing |
| `styles.css:347-360` `.preset-toolbar`, `.preset-selection`, `.preset-radio-list` | Replace the layout part now; the row-card visual part still needs a component. | `bf-stack`, optionally `bf-cluster` for horizontal action groupings |
| `styles.css:464-476` `.main-actions`, `.preset-section-header`, `.preset-panel-section` | Replace the layout wrappers now. | `bf-stack` / `bf-cluster` |
| `styles.css:109-120` `.viewer-panel__content` | Replace now. The package now ships the centered main-stage shell helper instead of leaving this as local shell composition. | `.bf-stage-shell` plus `bf-fixed-width`, keeping only app-specific stage visuals local |

Relevant upstream layout primitives:

- `C:\Users\lyubo\work\repos\baseline-foundry\src\css.ts:207`
- `C:\Users\lyubo\work\repos\baseline-foundry\src\css.ts:219`
- `C:\Users\lyubo\work\repos\baseline-foundry\src\css.ts:223`
- `C:\Users\lyubo\work\repos\baseline-foundry\src\css.ts:237`

## No Shipped Analog Yet

There is no strong reusable blocker left in this audited shell slice. The remaining local CSS is genuinely app-specific stage/editor work rather than missing panel-system primitives.

## Keep Local

These are downstream application styles, not design-system component responsibilities.

| Local block | Why it should stay local |
|---|---|
| `styles.css:1-15` root/html/body app shell rules | full-viewport app framing and body overflow behavior |
| `styles.css:17-41` `.mascot-app` token overrides | app theme values and product palette overrides |
| `styles.css:43-45` `.mascot-app .bf-aside` overscroll tweak | app-shell behavior choice, not clearly universal |
| `styles.css:123-233` `.stage*`, `.stage__authoring*`, `.stage__inline-editor` | canvas, authoring overlays, selection boxes, resize handles, baseline guides, inline editing |
| `styles.css:486-493` mobile stage tweak | stage-specific viewport adjustment |

## Concrete Removal Order

If the downstream agent wants the fastest reduction in local CSS, this is the order I would use:

1. Replace the local drawer implementation with the shipped overlay drawer shell and `initPanelDrawers()`.
2. Remove local slider-pair and range-fill helper CSS and use the shipped slider wrapper surface plus `initRangeControls()`.
3. Replace plain wrapper grids with `bf-stack` / `bf-cluster` where no visual treatment is involved.
4. Replace `output-profile-meta`, `preset-empty`, and similar plain text helpers with `bf-form-help` / base text styling.
5. Keep the app-specific stage/editor visuals local and only upstream another shell helper if swap testing reveals a new repeatable pattern.

## Suggested Instructions For The Brand Layout Ops Agent

1. Delete and replace the drawer/backdrop system first; do not keep the old `body.drawer-open` + `.drawer-backdrop` path once `baseline-foundry` drawer mode is wired in.
2. Replace only the layout wrappers that can become `bf-stack` / `bf-cluster` without changing semantics.
3. Leave stage/authoring CSS alone for now.
4. Do not preserve old local class names for `preset-radio-row`, `style-palette`, or equal-width panel tabs; switch the markup to the canonical Foundry components instead.
5. After each removal tranche, verify the panel in narrow widths, especially sliders, tabs, accordion groups, and drawer mode.

## Bottom Line

The local stylesheet is no longer "all necessary." A meaningful chunk is removable now, especially the drawer implementation and many of the panel pattern rules. The former stage-centering shell gap is now covered by `bf-stage-shell`, so the remaining local CSS in this audited slice is mostly genuine stage/editor behavior rather than missing panel-system primitives.
