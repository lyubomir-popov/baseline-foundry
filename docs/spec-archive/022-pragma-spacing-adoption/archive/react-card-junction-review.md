# React Card junction review

Date: 2026-09-12  
Pragma implementation tip: `8c8176e96`

## Verdict

**GO for T068-T069. No remaining P0/P1/P2 in the stated section-composition
scope.** The required seam correction is an unconditional `row-gap: 0` on every
Card; it cannot be changed through a `--card-row-gap` theme value.

## Independently checked

- The commit contains only four React Card source/story/test files.
- The rendered Header-to-Content and Content-to-Footer joins are zero while the
  gap between complete card bands remains the provider Surface inline spacing.
- Content and Footer tops remain registered across neighbouring cards,
  including cards that omit Header or Footer. Equal-height assertions are not
  used as a substitute for this positional check.
- Existing public section overrides remain live; no row-family property,
  target height or new card formula was introduced.
- Fresh root-agent runs reproduced Card Chromium DPR1 2/2, React ds-global
  396 passed / 5 skipped, and the global scanner checkpoint
  `308 / 27 / 275 / 6 / 0`. The implementation agent's full Card matrix was
  12/12 across Chromium, Firefox and WebKit at DPR1/2.

The zero gap also joins Image-to-Header and Content-to-Footer. An omitted named
section still owns a shared blank track, but it is smaller after removal of the
parent row gaps. Both are intended consequences of the fixed four-track Card
model.

## Separate open decision

T075 owns page-grid registration for sectioned Card. Live measurement shows a
1px outer-frame offset in image-free cards, while responsive image height and
internal divider strokes introduce additional independent phase shifts. The
uniform RichChoices framed-box correction must not be copied onto this
four-track layout without that decision.

Svelte WPE Card is deferred until the React pilot receives lead-engineer
approval. No merge, push, publication or release occurred.

