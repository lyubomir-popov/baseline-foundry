# Data model: Hero divider and quiet linked titles

## Quiet linked title

- **Role**: A route action occupying a basic-section heading slot.
- **States**: resting, visited, hovered, keyboard-focused.
- **Validation**: resting/visited remain link-coloured without underline; hover adds underline; focus remains visible.

## Hero entry boundary

- **Role**: The visual start of the hero pattern.
- **States**: default divider present; `is-borderless` divider absent.
- **Validation**: modifier changes only the divider; internal layout and block spacing are invariant.
