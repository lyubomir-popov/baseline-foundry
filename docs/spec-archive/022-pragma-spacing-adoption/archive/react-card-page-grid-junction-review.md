# React Card page-grid junction review

Date: 2026-09-12  
Pragma implementation tip: `971d8f85a`

## Verdict

**GO for T075. No remaining P0/P1/P2 in the bounded React sectioned-Card
page-grid decision.** This does not accept the composed pilot catalog's
separate grid-host P1 or authorize Svelte Card work.

The observed text-only error was not the accepted `1cap` approximation and was
not solely the outer border. A wholly text-only four-row Card band retained a
6px half-gutter for its empty Image track, shifting every leaf by about 1.984px
modulo the 4px grid. Text-only bands now use their three real shared tracks;
their Header, Content and Footer leaves match an ordinary sibling paragraph's
grid phase, including Cards that omit Header or Footer.

Mixed media bands keep all four shared tracks. A responsive image determines a
free phase for the text that follows it; snapping that phase would require an
image-height target, which remains forbidden. Text remains mutually registered
within that band.

The outer frame is inset pseudo-element paint and consumes no layout space.
Image-to-Header/Content dividers are pseudo-element paint on the following
section. A Content/Image-to-Footer divider uses a clipped outline because making
Footer a positioned pseudo-element host changed WebKit subgrid placement by
about 7.953px. Forced-colour evidence retains real border/outline primitives,
and public border-width and colour overrides still reach every painted edge.

## Independently checked

- `971d8f85a` contains exactly five React Card source/story/test files and
  `git show --check` is clean.
- Fresh root-agent Chromium DPR1: 3/3.
- Fresh root-agent WebKit DPR1: 2 passed, one intentional Chromium-only
  forced-colours skip.
- Fresh root-agent Card source/DOM tests: 13/13; focused Biome clean.
- Implementation-agent matrix: 14 passed and four intentional forced-colours
  skips across Chromium, Firefox and WebKit at DPR1/2; full ds-global Vitest
  396 passed / 5 skipped; TypeScript and package architecture checks green.
- The Card change is scanner-neutral. The committed pre-concurrent-work basis
  remains `297/27/264/6/0`.

