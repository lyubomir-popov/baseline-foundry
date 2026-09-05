# Contract: 020a component horizontal matrix

Every count uses `inlineUnitRem = 0.25rem`. Page margin, grid inline gutter and
content inline padding are intentionally absent because 020b owns them.

| Fact | Editorial | Documentation | App | OS |
|---|---:|---:|---:|---:|
| Surface inline inset | 4u / 1rem | 4u / 1rem | 3u / 0.75rem | 2u / 0.5rem |
| Field inset | 2u / 0.5rem | 2u / 0.5rem | 1u / 0.25rem | 1u / 0.25rem |
| Action inset | 4u / 1rem | 3u / 0.75rem | 3u / 0.75rem | 2u / 0.5rem |
| Continuation inset | 8u / 2rem | 6u / 1.5rem | 6u / 1.5rem | 5u / 1.25rem |
| Mark/icon gap | 2u / 0.5rem | 2u / 0.5rem | 1u / 0.25rem | 1u / 0.25rem |

The seven changes are Docs action/continuation, App mark/action/continuation,
and OS action/continuation. All other rows already match Canonical.

For comparison, the removed compatibility overlay produced this pre-020a
effective matrix:

| Fact | Editorial | Documentation | App | OS |
|---|---:|---:|---:|---:|
| Surface inline inset | 1rem | 1rem | 0.75rem | 0.5rem |
| Field inset | 0.5rem | 0.5rem | 0.25rem | 0.25rem |
| Action inset | 1rem | 1rem | 1rem | 1rem |
| Continuation inset | 2rem | 2rem | 2rem | 2rem |
| Mark/icon gap | 0.5rem | 0.5rem | 0.5rem | 0.25rem |
