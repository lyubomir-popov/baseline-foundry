# React public-field marker evidence junction review

Date: 2026-09-12  
Pragma evidence tip: `5cb70684e`

## Verdict

**GO for the evidence-first half of T073 wave 4.** Production marker CSS and
its eight transition identities are intentionally unchanged, so this is not
yet acceptance of the implementation half.

The public Form fixture now includes Checkbox, both Switch label positions and
Choices in radio, multiple and column layouts. It covers wrapped labels,
checked and disabled states, public spacing overrides and focus. Rendered tests
measure the 16px marker canvas, first-line centring, whole-grid occupied rows,
logical direction and retained consumer spacing values at 16px and 18px roots
in Site, Docs and App. Chromium additionally checks forced-colour operability.
Choices remains an ordinary marker-led row and is not treated as a
RichChoices-style framed card.

## Independently checked

- `5cb70684e` contains only the Form story, its story-only fixture CSS and the
  Form browser test; `git show --check` is clean.
- Fresh root-agent Chromium DPR1: four focused tests passed, covering both root
  sizes, state/focus and forced colours.
- Implementation-agent matrix: geometry 12/12 across Chromium, Firefox and
  WebKit at DPR1/2; Chromium state/forced-colour 2/2; focused Biome, TypeScript
  and diff check green.

The implementation must consume the existing shared marker canvas, replace
the two primitive stroke references, and classify only the unavoidable fixed
paint dimensions. It must not introduce a second row calculation.

