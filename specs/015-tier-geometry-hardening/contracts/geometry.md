# Geometry Contract

## Tier caps

| Tier | `--bf-content-max-width` | `.bf-fixed-width` | `.bf-page` |
|---|---:|---|---|
| Editorial | `90rem` | capped | existing site behavior |
| Documentation | `80rem` | capped | existing documentation behavior |
| App | `60rem` | capped | uncapped and fluid |
| OS | `60rem` | capped | existing OS behavior |

- Values are identical in direct tier bundles and shared `bf-tier-*` switching.
- At a wide viewport, the App page consumes available inline space while a
  sibling fixed-width row resolves to 60rem including its public box contract.
- Existing start alignment and container-query behavior remain unchanged.

## TOC and adjacent document navigation

- `.bf-table-of-contents-link` block padding equals
  `--bf-body-nudge-start` / `--bf-body-nudge-end` exactly.
- `.bf-table-of-contents-list` owns a one-baseline inter-item gap.
- `.bf-table-of-contents-item` owns a one-baseline gap between its direct link
  and any nested list.
- Desktop and expanded `.bf-in-page-navigation-link` follow the same metric-only
  contract; their lists/items own the row rhythm.
- The compact collapsed in-page rail remains a control-like exception and keeps
  compact control padding.
- Hover/current/focus behavior, two-line or arbitrary wrapping, logical nested
  indentation, and RTL overflow safety remain intact in all tiers.

## Divided list

- `.bf-divided-section-list` owns a fixed `24px` gap.
- `.bf-divided-section-item` has zero block margin, border, and padding.
- Each item after the first paints one `--bf-border-width` pseudo-rule.
- The rule starts `0.5rem` before the following item, so the visual rule-to-item
  distance is `calc(0.5rem - var(--bf-border-width))`.
- The rule does not participate in layout and therefore does not change the
  24px parent-owned gap.
