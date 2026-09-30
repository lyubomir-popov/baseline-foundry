# RichChoices framed-box border junction review

Date: 2026-09-12  
Pragma implementation tip: `0d861ae2c`

## Verdict

**GO for the reopened border-accounting clause and T077. No remaining
P0/P1/P2.** The prior implementation added two 1px borders outside the intended
Surface inset. That produced a real +2px card-height error and a 1px text phase
shift; it was not `1cap` approximation.

## Corrected composition

RichChoices remains four familiar parts: a uniform frame, a border-aware
content inset, a content column and ordinary text leaves. The shared contract
owns one `inset - border` calculation on `:where(.ds)`:

- `--ds-box-border-width` is the component-supplied uniform border input;
- `--ds-box-padding-block` and `--ds-box-padding-inline` are protected shared
  outputs; and
- `.ds.option` binds the real form border, while its plain label inherits the
  matching padding and border.

This preserves the product Surface distance from the card's outside edge in
both axes without adding RichChoices to either row family or giving it a target
height.

## Independent checks

- Source review confirmed one formula owner, protected outputs, a reset at each
  nested `.ds`, a zero clamp for an oversized border and no component selector
  in the shared contract.
- The browser negative restores the exact old full-padding behavior and must
  report the complete-height, text-phase and inline-inset failures. A real 2px
  border keeps the same corrected footprint, proving the test is not pinned to
  a 1px constant.
- Fresh root-agent runs reproduced scanner/shared source 87/87 with 243
  assertions, RichChoices Chromium DPR1 3/3, and the unchanged global scanner
  checkpoint `308 / 27 / 275 / 6 / 0`.
- The implementation agent's full matrices passed RichChoices 18/18 and shared
  contract 60/60 across Chromium, Firefox and WebKit at DPR1/2.

At a 16px root, one-line cards now occupy nominal whole-grid sizes: Site about
64px, Docs about 56px and App about 48px. The outside edge to content is 16px
in Site/Docs and 12px in App on both axes.

## Related but separate findings

- Button, Chip and TextInput already account for their borders.
- The composed Storybook's local Table imitation does not; T076 owns that demo
  correction and does not reopen the accepted Svelte production Table.
- Sectioned Card has additional image/divider phase effects; T075 owns it.

No merge, push, publication or release occurred.

