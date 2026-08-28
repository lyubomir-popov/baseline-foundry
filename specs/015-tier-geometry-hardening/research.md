# Research: Tier Geometry Hardening

## Content-cap derivation

The prior caps (`90/96/90/67.5rem`) widened from Editorial to Documentation and
then narrowed again. That sequence did not express the documented progression
toward denser contexts.

| Tier | Cap | Derivation |
|---|---:|---|
| Editorial | `90rem` | Preserve BF's established widest site canvas and its existing 40rem reading measure. |
| Documentation | `80rem` | Adopt the rounded maximum in the governing Canonical grid evidence. It comfortably accommodates left navigation, the 38rem article measure, right TOC, and gutters without exceeding Editorial. |
| App fixed-width | `60rem` | Three quarters of the Documentation cap, a rounded 960px bounded row for breadcrumbs and focused application content. This affects only explicit `.bf-fixed-width`; `.bf-page` and application grids remain fluid. |
| OS fixed-width | `60rem` | Use the smallest change that restores the required order: OS must not exceed App. A narrower value has no independent consumer evidence, so equality avoids inventing an unsupported constraint. |

This gives `90 >= 80 >= 60 >= 60`. The progression is intentionally
non-increasing, not strictly decreasing. Semantic tier and density remain one
coupled BF choice; this package does not create an independent density axis.

## Direct and class-scoped delivery

The build emits each tier twice: as a direct bundle root and as a
`.bf-theme.bf-tier-*` surface inside the shared stylesheet. Existing static
parity walks every layout token. The package adds explicit cap/order assertions
and browser measurements of both delivery paths so token equality cannot hide a
selector or layout regression.

App fluidity is selector-based: `.bf-theme.bf-tier-app .bf-page` has
`max-inline-size: none`, while `.bf-fixed-width` consumes
`--bf-content-max-width`. Both selectors must be exercised at a viewport wider
than 60rem.

## Downstream Registry evidence

The sibling Diagram Registry is readable and its durable design contract uses
`.bf-fixed-width.is-start-aligned` for bounded breadcrumb/content rows while
requiring the application main region to remain free of an editorial cap.
Registry validation also requires that public selector. No Registry-local
`.bf-*` override or explicit width was found, so changing the App token upstream
is the correct seam and selector parity is directly relevant downstream.

## Metric-only navigation links

TOC links currently calculate both padding edges as body metric compensation
plus `--bf-space-half`. In Documentation that makes the start padding appear as
roughly 10px even though the density grid is 4px: most is a legitimate font
nudge, but the extra half-space is semantic rhythm hidden on the link.

The corrected occupied text block is:

```css
padding-block: var(--bf-body-nudge-start) var(--bf-body-nudge-end);
```

The owning list uses `gap: var(--bf-space-1)`. Items also become small grid
containers so a parent link and its nested list receive the same owned gap.
This preserves the previous total inter-row rhythm because two half-space link
edges become one full-space container gap.

The exact same defect exists in desktop and expanded
`.bf-in-page-navigation-link` rules. It is confirmed and corrected in scope.
Compact collapsed mobile navigation is a control-like horizontal rail and keeps
its occupied-control padding. The expanded heading's padding is a deliberate
surface inset, not repeated link rhythm, so it also remains.

## Divided-list rule placement

The list retains a fixed `24px` row gap. The old pseudo-rule was placed at
`calc(var(--bf-stack-space) / -2)`, exactly the midpoint. The owner decision is
to make the rule belong visually to the following item.

With a 1px border and an 8px rule-to-content rhythm envelope, the rule's start
relative to the following item's border box is:

```css
inset-block-start: -0.5rem;
```

The measurable clear distance from the rule's bottom edge to following content
is therefore `calc(0.5rem - var(--bf-border-width))`, 7px at the built-in 1px
border. The remaining 16px of the 24px parent gap sits before the rule. Items
continue to own zero block padding and margin.

## Deferred split pane

The Diagram Registry and its standalone Mermaid playground are two surfaces in
one product family. They do not provide an independent second consumer. The
existing application-aside resize handle remains the supported scoped seam;
promoting a generic split-pane primitive would be speculative and is deferred.
