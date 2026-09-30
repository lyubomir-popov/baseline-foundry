# React border foundation junction review

Date: 2026-09-12  
Pragma commit: `0be29df3f`  
Verdict: **GO for React consumer migration; not React-pilot closeout**

## Decision under review

Pragma now has one border-aware calculation with four logical edge inputs.
Named cases such as no border, bottom-only border and all-around border are
examples of that one part rather than separate component formulas. Normal and
emphasis stroke widths are tier facts; the calculation runs on each `.ds`
component so its own actual edges participate.

Stateful emphasis paint has two valid forms:

- reserve the same real border width in every state and change only its colour;
- paint with an inset shadow, pseudo-element or outline that contributes no
  layout size.

A real edge wider than the applicable inset/nudge cannot preserve the promised
text offset and must use the second form.

## Independent checks

- `bun test scripts/check-css-contract.test.ts`: 106/106, 348 assertions.
- `bun test packages/styles/main/test/component-contract.test.js`: 6/6,
  82 assertions in the focused file.
- Chromium DPR1 `SharedContracts.spacing.pw.ts`: 11/11.
- Chromium DPR1 `RichChoicesField.spacing.pw.ts`: 3/3.
- RichChoices source/DOM/SSR Vitest: 20/20.
- The implementing agent's complete browser runs: SharedContracts 66/66 and
  RichChoices 18/18 across Chromium, Firefox and WebKit at DPR1/2.

The browser matrix covers 3,168 border specimens: no edge, each single edge,
all edges, asymmetric/custom edges, reserved 3px emphasis and zero-layout 3px
paint at 16px/18px roots, LTR/RTL and nested/standalone Site/Docs/App contexts.
An intentional omitted-border case moves text and occupied size by 1px, proving
that the oracle can fail for the defect it is meant to detect.

## Adversarial findings

1. A suspected input/output ownership contradiction was not present.
   `--ds-field-content-inset` is the allowed component input; its derived
   default and the end/artwork padding values are protected outputs. A real
   Select source-path test now distinguishes them.
2. The old diagnostic said components could set only three row inputs. It now
   names the governed input set without a stale count.
3. The foundation does not itself prove that every existing component border
   is connected to it. The 143-row React manifest records the intended
   disposition, while T073 still owes exact selector/property bindings and a
   parsed-CSS reconciliation gate. This is an explicit completion boundary,
   not a P1 against the reusable calculation.
4. Tabs' existing 3px inset active bar is correctly zero-layout paint and must
   not be subtracted from padding. SideNavigation still needs its own state
   decision; this foundation does not invent a new active border for it.

## Authorization

React components may migrate to the shared four-edge and framed-box outputs.
No component may copy the arithmetic locally. Lit/Svelte work, final React
approval, merge, publication and release remain unauthorized.
