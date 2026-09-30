# React pilot dual-baseline-visualizer junction review

Date: 2026-09-12  
Pragma commit: `e26c650c0`  
Verdict: **GO; P0 0, P1 0**

## Decision

The existing orange five-band Storybook visualizer remains unchanged. A second
button controls Baseline Foundry's thin, low-opacity pink rules. Their globals,
classes, pseudo-elements and toolbar state are independent, so neither,
orange-only, BF-only and both-on are all supported.

The BF rules use the live product baseline: 8px in Site and 4px in Docs and App.
The overlay is pointer-transparent and adds no in-flow geometry. It is packaged
through `@canonical/styles-debug`, documented in the addon and Storybook pages,
and available in the stable composed React pilot on port 6114.

## Stable demo links

Both globals are explicit because the orange overlay defaults on:

- Orange only: `http://127.0.0.1:6114/?path=/story/documentation-react-pilot--inventory&globals=baseline:!true;baselineFoundry:!false;context:site`
- Pink only: `http://127.0.0.1:6114/?path=/story/documentation-react-pilot--inventory&globals=baseline:!false;baselineFoundry:!true;context:site`
- Both: `http://127.0.0.1:6114/?path=/story/documentation-react-pilot--inventory&globals=baseline:!true;baselineFoundry:!true;context:site`

## Reproduced evidence

- 12/12 focused browser cases: Chromium, Firefox and WebKit at DPR1 and DPR2.
- 9/9 addon unit cases; TypeScript, package build, architecture checks, targeted
  formatting and `git diff --check` are green.
- Both-on evidence authenticates orange `::after` and BF `::before` separately,
  including non-empty gradients, z-index 200/201, full inset, pointer
  transparency, and 5x/1x live-baseline intervals.
- The Storybook root and a real visible Continue Button keep the same x, y,
  width and height through all toggle combinations.
- The pre-existing orange `baseline-grid.css` has no diff. Port 6114 remained
  HTTP 200 and was not restarted.

## Non-blocking limits

1. Either overlay establishes the same `position: relative` containing block.
   This moves the intentionally hidden absolute SkipLink by 16px before focus;
   its visible focus state uses fixed positioning and is unaffected. Root,
   in-flow and measured visible component geometry are invariant.
2. Story-parameter/global precedence is falsifiably unit-tested in the preview
   decorator. The manager button uses the same fallback logic and explicit
   globals are exercised in-browser, but its parameter-derived pressed state is
   inspection-only.
3. Full package-wide Biome remains red on pre-existing CRLF files outside this
   change. The focused new and changed sources pass their targeted checks; no
   unrelated file was reformatted.

These limits do not block T080. T078 remains open for the lead-engineer
presentation and approval; no merge, push, publication or release is
authorized by this review.
