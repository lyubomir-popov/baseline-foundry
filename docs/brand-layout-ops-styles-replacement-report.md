# Brand Layout Ops Local Styles Replacement Report

Scope:

- Downstream file audited: `C:\Users\lyubo\work\repos\brand-layout-ops\apps\overlay-preview\src\styles.css`
- Upstream package audited against: current `baseline-foundry` after the overlay drawer pass (`50814bf`)

Goal:

- identify which local `brand-layout-ops` rules can be deleted now and replaced with `baseline-foundry`
- identify which local rules are still justified because they are app-specific
- identify which local rules should become the next `baseline-foundry` porting priorities

## Executive Summary

The file falls into four buckets:

1. Delete and replace now:
   drawer/backdrop logic, pinned-aside resize behavior, equal-width dense tabs, selectable preset/output rows, style/mapping palette cards, compact color-input sizing, operator-selector strips, most slider-pair styling, helper text/meta styling, and some generic wrapper grids.
2. Replace with markup changes:
   several local `display: grid` wrappers should become `bf-stack`, `bf-cluster`, `u-fixed-width`, or the shipped tabs/forms/panel shell.
3. Port next into `baseline-foundry`:
   a minimal fill-height panel helper, any checkbox-field density rules that still survive as downstream overrides, and a canonical action-row helper for dense panel footers/export clusters.
4. Keep local:
   stage rendering, authoring overlays, selection handles, inline stage editor, and other canvas/editor-specific styling.

## Replace Now

| Local block | Recommendation | Replace with |
|---|---|---|
| `styles.css:86-106` `.drawer-backdrop` | Delete. This is superseded by the package drawer shell. | `l-application__overlay`, `l-aside.is-overlay` / `is-drawer`, `l-application.is-drawer-expanded`, `p-panel__toggle`, and `initPanelDrawers()` from `baseline-foundry` |
| `styles.css:47-84` `.bf-application__aside-resize-handle` | Delete or reduce to app-only overrides. The package now ships the pinned-aside resize runtime and visible handle treatment. | `l-application__aside-resize-handle` / `bf-application__aside-resize-handle` plus `initResizableAsides()` and the built-in `is-resizing-aside` shell state |
| `styles.css:299-341` `.config-tabs`, `.output-profile-tabs` | Delete. The package now ships equal-width dense tab modifiers and keeps the downstream aliases. | canonical `p-tabs--equal` / `bf-tabs--equal`, plus alias support for `config-tabs` and `output-profile-tabs` |
| `styles.css:363-384` `.preset-radio-row*` | Delete. This pattern is now a shipped component, not a local app card. | canonical `p-choice-row` / `bf-choice-row` and `p-choice-list`, plus alias support for `preset-radio-row`, `preset-radio-name`, and `preset-radio-status` |
| `styles.css:417-462` `.style-palette*` | Delete. This pattern is now a shipped component, not a local app-only palette grid. | canonical `p-option-grid` / `bf-option-grid` and `p-option-card` / `bf-option-card`, plus alias support for `style-palette`, `style-palette__button`, `style-palette__label`, and `style-palette__meta` |
| `styles.css:244-258` `.slider-pair` | Mostly delete. The package already owns the horizontal/stacked range wrapper and number-input pairing. | `.p-slider__wrapper`, `.slider-pair`, `.slider-pair--stacked`, `.p-slider__input`, plus `initRangeControls()` |
| `styles.css:343-345` `.output-profile-meta` | Delete if the markup switches to shipped helper text. | `bf-form-help` / `p-form-help-text` |
| `styles.css:242-246` `.control-help` | Delete. Tight helper text is now a shipped modifier rather than app-local spacing repair. | `.p-form-help-text.is-tight` / `.bf-form-help.is-tight`, with alias support for `.control-help` |
| `styles.css:286-290` `.control-color` | Delete. Compact color input sizing is now a shipped treatment. | canonical `.p-color-input` / `.bf-color-input`, with alias support for `.control-color` |
| `styles.css:497-527` `.operator-selector*` | Delete. This is now a shipped inline-options micro-pattern rather than a one-off app strip. | canonical `.p-inline-options` / `.bf-inline-options`, with alias support for `.operator-selector*` |
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
| `styles.css:109-120` `.viewer-panel__content` | No direct class yet, but most of this is already a composition problem, not a missing framework. | `u-fixed-width` plus `bf-stack` / panel shell composition; keep only the genuinely stage-centering bits local |

Relevant upstream layout primitives:

- `C:\Users\lyubo\work\repos\baseline-foundry\src\css.ts:207`
- `C:\Users\lyubo\work\repos\baseline-foundry\src\css.ts:219`
- `C:\Users\lyubo\work\repos\baseline-foundry\src\css.ts:223`
- `C:\Users\lyubo\work\repos\baseline-foundry\src\css.ts:237`

## No Shipped Analog Yet: Port Next Into Baseline Foundry

These are the strongest candidates for the next upstream component pass. They are repeatable product UI patterns, not one-off app hacks.

### 1. Full-height fill panel helper

Local block:

- `styles.css:177-184` `.drawer-panel`

Reason:

- most of this is already covered by `p-panel`, but `min-height: 100%` / fill behavior is still being asserted locally.

Priority:

- low to medium

Recommended upstream addition:

- a minimal fill modifier if the downstream app still needs it after the drawer shell swap, for example `p-panel.is-fill`

### 2. Dense checkbox-field compaction overrides

Local block:

- `styles.css:186-196`

Reason:

- downstream still overrides checkbox field/control spacing and minimum row height under `.mascot-app`. If those overrides still matter after swap testing, the density rule should live package-side rather than in app-local CSS.

Priority:

- medium

Recommended upstream addition:

- a small dense checkbox-field modifier or a tighter default for the compact panel preset if the current package rhythm still leaves these rows feeling different from the rest of the dense control surface

### 3. Dense action-row helper

Local block:

- `styles.css:200-211`

Reason:

- the downstream app still uses a no-wrap, horizontally scrollable export-actions row. This is a real panel pattern and would be better as a package-side action primitive than as one-off flex CSS.

Priority:

- medium

Recommended upstream addition:

- a canonical action-row helper, for example `.p-actions` / `.bf-actions`, with optional nowrap/scroll behavior for dense toolbars and panel footers

### 4. Centered viewer-panel content shell

Local block:

- `styles.css:109-120` `.viewer-panel__content`

Reason:

- most of this is already composition rather than missing component CSS, but it still has enough repeated structure that we may eventually want a canonical stage-centering helper.

Priority:

- low

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
5. Re-test whether the remaining `.drawer-panel` fill helper, checkbox-field overrides, and export-action row helper are still needed once the downstream app is fully on the current shell primitives.

## Suggested Instructions For The Brand Layout Ops Agent

1. Delete and replace the drawer/backdrop system first; do not keep the old `body.drawer-open` + `.drawer-backdrop` path once `baseline-foundry` drawer mode is wired in.
2. Replace only the layout wrappers that can become `bf-stack` / `bf-cluster` without changing semantics.
3. Leave stage/authoring CSS alone for now.
4. Do not invent new app-local replacements for `preset-radio-row`, `style-palette`, or equal-width panel tabs; treat those as upstream `baseline-foundry` gaps and either port them there or keep the existing local CSS temporarily.
5. After each removal tranche, verify the panel in narrow widths, especially sliders, tabs, accordion groups, and drawer mode.

## Bottom Line

The local stylesheet is no longer "all necessary." A meaningful chunk is removable now, especially the drawer implementation and many of the panel pattern rules. The biggest remaining blockers are smaller shell helpers rather than missing component families: fill-height panel behavior, checkbox-field density overrides, and a dense action-row helper. Those are the next upstream `baseline-foundry` priorities if the goal is to retire most of `overlay-preview/src/styles.css`.
