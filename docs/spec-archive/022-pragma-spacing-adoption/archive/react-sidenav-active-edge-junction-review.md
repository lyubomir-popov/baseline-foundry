# React SideNavigation active-edge junction review

## Decision

Pragma `e4f837eff` gives an active SideNavigation Item a logical inline-start
emphasis edge. It is an absolutely positioned pseudo-element inside the row,
so it is paint rather than a real border and cannot change the row box, text
inset or baseline compensation. The width comes directly from the tier-owned
`--ds-stroke-thickness-emphasis` fact. SideNavigation remains outside the
closed block-end attached-row family at this junction.

## Adversarial correction

The first review was NO-GO because the initial implementation exposed a new
`--sidenav-active-edge-width` fallback. That would have let one component
drift from the shared emphasis bucket. The local alias was removed, the CSS now
consumes the tier fact directly and the static test rejects reintroduction.

The forced-colour test title was also narrowed: it proves both active and focus
paint remain present, not pixel-level non-occlusion.

## Evidence and verdict

- active and inactive rows have equal height, width and text-start inset;
- the active edge equals the tier emphasis fact and current 3px value;
- logical start mirrors in RTL;
- Site, Docs and App at 16px/18px roots pass across Chromium, Firefox and
  WebKit at DPR1/2: 20 pass and four expected Chromium-only forced-colour skips;
- focused static test: 10/10; root Chromium rerun: 4/4;
- final independent verdict: GO, no P0/P1/P2.

The seven existing React App and eight product-Button border declarations are
still to be attached to the central source manifest. Their implementation is
already consistent: regular SideNavigation rows reserve transparent block
edges, focus/active paint is zero-layout and all four Button forks use the
shared all-around row border inputs.
