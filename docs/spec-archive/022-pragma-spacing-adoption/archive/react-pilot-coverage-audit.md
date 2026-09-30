# React pilot coverage audit

Date: 2026-09-12

This is the T073 starting point for the frozen inventory in
`react-pilot-inventory.md`. It records evidence gaps, not acceptance.

## Current debt basis

| Scope | Raw | Sanctioned | Transition | Advisory |
|---|---:|---:|---:|---:|
| `react-ds-global` | 70 | 7 | 61 | 2 |
| Included stable global exports | — | — | 38 | — |
| Excluded global work-in-progress exports | — | — | 23 | — |
| `react-ds-global-form` | 35 | 6 | 28 | 1 |

The pilot must close the 38 included global and 28 form transitions. Excluded
React, Lit and Svelte entries remain visible to the global monotonic check.

## Global coverage

Already has direct multi-engine spacing evidence: Accordion, Badge, Button,
Card, Chip, ContextualMenu, Tabs and Tooltip. Cards is covered indirectly
through Card. Icon and Spinner are covered only through consumers.

Missing direct browser evidence or a pilot pressure state:

- Breadcrumbs: narrow/overflow/RTL;
- Icon: standalone sizing;
- InlineCode: narrow and RTL;
- KeyboardKey and KeyboardKeys: standalone and composed commands;
- Popover: open overlay behavior and a stable story location;
- Spinner: standalone sizing;
- Tile: its own composite/padding decision;
- Timeline: marker/date/layout decision and stable story location; and
- Tooltip: retain its direct evidence while closing remaining overlay/observer
  work.

## Form coverage

The form-only Storybook on port 6114 exposes individual stories for all Field
routes, but its `AllInputTypes` story contains only 13 of 19. It omits Color,
DateTime, Hidden, Rating, RichChoices and Switch. Color, Combobox and Rating
still appear under work-in-progress story titles even though their Field routes
are public.

The Field dispatcher test is currently a placeholder. ColorField,
ComboboxField, DateField, DateTimeField and TimeField have no direct source
test. Existing input-level browser tests do not by themselves prove each public
Field route.

## Bounded implementation waves

1. Evidence topology: one composed pilot catalog containing all 18 global
   exports and all 19 real Field dispatches; replace the Field placeholder test.
2. Global primitives: Breadcrumbs, Icon, InlineCode, KeyboardKey, KeyboardKeys
   and Spinner (11 transitions).
3. Already-browsered controls: Badge, Button, Chip, ContextualMenu and Tabs
   (8 transitions).
4. Form markers: Checkbox, Choices and Switch (8 transitions), tested through
   public Field routes.
5. Form controls: simple native routes first, then Range, Rating and Select;
   close all 28 form transitions and promote evidence to Field routes.
6. Separate composite/overlay decisions: Popover, Tooltip, Tile and Timeline
   (19 global transitions). Card's zero-transition page-grid work remains T075.

Each wave requires a decreasing scanner count, focused browser evidence and an
independent review before the next materially different layout family starts.

## Progress checkpoint

Waves 1-2 are accepted through Pragma `feba51c91` and P1 correction
`c52e65a3d`; the complete inventory now composes on the real public grid. The
primitives wave removed all 11 of its transition identities without adding an
exception. Waves 3-4 are accepted through `cb6f8cb84`: controls remove four
identities, four preserved Chip/Badge paint facts move from transition debt to
exact classifications, and markers remove all eight of their identities. The
committed global checkpoint is `291 / 37 / 248 / 6 / 0`; the included package
slices are `react-ds-global` `55 / 11 / 42 / 2 / 0` and
`react-ds-global-form` `33 / 12 / 20 / 1 / 0`. Detailed evidence is in
`react-pilot-wave-1-2-junction-review.md` and
`react-controls-markers-junction-review.md`. Waves 5-6 and the exhaustive
T073-T074 closeout are now accepted locally at Pragma `362eeae1e`; T075-T077
remain accepted. The final state is `240/64/169/7/0`, with all 169 transition
entries outside React. Exact closeout evidence is in
`react-pilot-closeout-review.md`; only external review T078 remains open.

The final catalog has 143 rendered rows (49 Global, 55 Form and 39
application-side). The source inventory separately owns 145 records: 142 real
production renderers and three story-only records. Heading is rendered;
Tokens and Typography are documentation artwork and stay out of the catalog.
The exact border gate accepts 315/315 declarations across 62 CSS paths, with no
unresolved or unaudited React border.

## Live composed-review findings

The first root-agent visual pass found two classes of issue that presence tests
alone could not detect:

- The catalog initially occupied one Storybook grid column and nested Cards had
  no direct grid host. Pragma `c52e65a3d` closes this P1 with the full catalog
  span, comparable card widths, a shared band and registered Content tops.
- The first Storybook accessibility scan reported four violation instances:
  invalid `aria-required` on the Color and FileUpload buttons, unresolved
  Combobox labelling and an interactive file input nested inside the drop-zone
  button. Pragma `90e5f45d4` routes Field attributes to the actual interactive
  leaves, makes the hidden file input a sibling, and retains file-chooser
  activation. Fresh live Storybook now reports zero violations; the two
  remaining results are inconclusive checks rather than failures. The exact
  visually-hidden classification moved selector one-for-one under scanner gate
  `2a567111c`, with no new classification or allowlist entry.
