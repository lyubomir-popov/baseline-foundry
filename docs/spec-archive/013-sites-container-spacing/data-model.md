# Data Model: Sites Container-Owned Spacing

This feature has no persisted data. Its relevant entities are layout owners and their relationships.

## Metric-aligned text element

- **Measured start nudge**: Font-metric-derived top padding that positions the baseline.
- **Baseline compensation**: Non-semantic bottom margin equal to the remaining part of one baseline unit.
- **Legacy space-after**: Serialized compatibility data that does not participate in the migrated production layout.

Invariant: start nudge plus bottom compensation equals one active baseline unit; bottom padding is zero in the production metric engine.

## Internal pattern stack

- **Owner**: A `bf-stack` pattern/container.
- **Children**: Direct structural parts such as header/body, split/media, or copy/actions.
- **Gap**: The tier's shallow section token; 1.5rem in Editorial.

Invariant: child type, order, or removal does not change the gap between remaining direct children.

## Section stack

- **Owner**: A `bf-stack is-section` page/container.
- **Children**: Complete patterns or sections.
- **Gap**: The tier's regular section token; 4rem in Editorial.

Invariant: nested internal stack gaps do not add to or replace the outer section gap.

## Flush stack

- **Owner**: A `bf-stack is-flush` container.
- **Gap**: Zero.

Invariant: flush removes only semantic container gap, never a child's baseline compensation.
