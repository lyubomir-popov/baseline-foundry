# React Form catalog junction review

**Reviewed Pragma checkpoint:** `9cbc3a2df`

**Verdict:** GO for the Global + Form catalog slice. This is not T073/T074
completion; 39 React rows remain to be added.

## Finding and correction

The first implementation placed one `Form` around the whole catalog and put
the specimen article, heading and stage between it and each `Field`. That was
not a valid production composition: Form and Field use a direct-child subgrid.
At 320px in Site, the 288px catalog had 317px of scrollable content and Choices,
Number and Text escaped their stages. Existing Form stories did not overflow at
the same viewport.

The correction gives each built-in specimen its own public `Form` with its
`Field` as a direct child. The Text specimen keeps its validation submit action
inside that Form. Choices uses a bounded stacked pressure state rather than a
forced two-column layout. The catalog wording now covers every built-in
component-backed Field route and records that the consumer-supplied `custom`
route has no framework component to inventory.

## Reproduced evidence

- 49/49 React Global rows and 55/55 React Form rows map exactly once to real
  rendered component DOM.
- All 20 built-in Field specimens have the direct
  `stage > form.ds.form > .ds.field/.ds.form-hidden` structure.
- At 320px Site the catalog is 288px client / 288px scroll; Choices, Number and
  Text stages are each 256px / 256px.
- Static reconciliation passes 8/8 with 393 assertions.
- Chromium passes 5/5; the focused Firefox/WebKit correction cases pass 4/4.
- The 320px catalog has zero scoped Axe violations.
- The stable Storybook at port 6114 stayed running throughout the correction.

## Remaining boundary

The horizontal and vertical examples are teaching views. Exhaustiveness belongs
to the composed catalog and source reconciliation. App, Launchpad, the four
product Button variants and the token tools are still open; Lit and Svelte are
deferred until lead-engineer approval of the complete React pilot.
