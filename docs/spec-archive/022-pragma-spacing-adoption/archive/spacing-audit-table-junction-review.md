# Spacing-audit Table junction review

Date: 2026-09-12  
Pragma implementation tip: `147ec6f0e`

## Verdict

**GO for T076. No remaining P0/P1/P2.** React has no stable public Table to
render here, so the Storybook keeps one explicitly named native-cell specimen
of the already accepted Table-cell pattern.

The table now uses separate borders with zero spacing, reserves one trailing
stroke inside each cell's height, and consumes the shared in-box padding. The
closed registry admits only the exact demo path and `td` selector; sibling
selectors and a copied selector in another path fail.

Fresh root-agent checks reproduced the global scanner checkpoint
`308/27/275/6/0` and Chromium DPR1 3/3. The implementation agent's full matrix
passed 18/18 across Chromium, Firefox and WebKit at DPR1/2, Site/Docs/App and
16px/18px roots. The prior collapsed-border layout fails the new negative.
Production Svelte Table was not changed.

