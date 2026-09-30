# RichChoices card adversarial review

Date: 2026-09-12  
Pragma branch: `feat/bf-shared-alignment`  
Accepted tip: `a8441f45d`

## Verdict

**GO.** T064-T067 are accepted with no remaining P0, P1 or P2 findings. The
RichChoices blocker for T053 is closed.

## Accepted composition

RichChoices is built from ordinary known parts:

1. The selectable card owns its border, background, radius and equal padding
   from the existing Surface block/inline inset tokens.
2. Its content column owns the gap between children.
3. Each normal text span owns its existing typography alignment.

Scalar string and number labels receive one normal text span automatically.
Rich React content remains intact and supplies its own text spans. The card has
no target height, private spacing formula or dependency on either row family.

## Corrections made during review

The first evidence pass was not accepted. It was strengthened so that:

- the source check reads CSS token boundaries without being confused by
  strings, comments, escapes, Unicode names, punctuation or CRLF line endings;
- harmless lookalikes are not reported, while disguised uses of the retired
  `--start-nudge` and `--end-nudge` names fail;
- the valid-card assertion rejects deliberately wrong padding;
- the browser cases verify the actual tier, root size, DPR, leading font family
  and loaded Ubuntu Sans face;
- a disposable page removes the real Ubuntu Sans rules and proves the check
  fails closed;
- scalar and rich text content, wrapping, equal-height neighbors and the exact
  inner gap are measured;
- keyboard focus is measured before selection, Space changes selection, and a
  disabled-card click changes nothing.

## Reproduced evidence

- Source checker: 81/81 tests, 186 assertions.
- Global source result: `320 raw / 27 sanctioned / 286 transition / 7 advisory /
  0 legacy`; no allowlist or classification growth.
- Focused component/source/SSR tests: 29/29.
- RichChoices browser matrix: 18/18 across Chromium, Firefox and WebKit at DPR
  1/2, including Site/Docs/App and 16px/18px roots.
- Final Chromium check after the checker-only CRLF correction: 3/3.
- Stable Storybook 6114: card story renders cleanly; scoped accessibility scan
  reports zero violations.

## Boundaries

The unavailable Vanilla adapter is not claimed as tested. Native browser zoom
remains T012 and the wider component inventory remains T019. Table and Log were
not reopened. No merge, push, publication or release was performed. The final
external Opus review remains pending.
