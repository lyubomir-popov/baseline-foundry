# Review: Hero divider and quiet linked titles

## Outcome

Accepted. Linked section titles keep the semantic link blue without a resting
underline, restore the underline on hover, and retain their normal focus ring.
Heroes now own a low-contrast entry divider by default and expose
`is-borderless` as the explicit opt-out.

The divider replaces one pixel of top padding, so default and borderless heroes
occupy the same baseline-aligned geometry at narrow and wide breakpoints.

## Evidence

- `npm test`: build, 5,469 static contract checks, component baselines, and
  browser behavior passed.
- `npm run qa:components`: all component captures and baseline checks passed.
- Browser assertions cover link default/hover/focus colour and decoration,
  default/borderless hero rules, overflow, and both responsive padding modes.
