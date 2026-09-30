# React pilot waves 1-2 junction review

Date: 2026-09-12  
Pragma implementation tips: `3ee53dd22`, `feba51c91`, `c52e65a3d`

## Verdict

**GO for the evidence-topology and global-primitives waves of T073. No
remaining P0/P1/P2 in these two bounded waves.** T073 itself stays open for the
remaining controls, form components and composite/overlay decisions.

The composed `Documentation/React pilot` Storybook route renders all 18 stable
`react-ds-global` exports plus Form and all 19 public Field dispatch routes. It
defaults the baseline guide on, includes a narrow wrapping fixture, and checks
real controls rather than accepting empty route wrappers. This is a coverage
route, not a replacement for each component's detailed pressure-state story.

## P1-1 correction: real grid composition

Root-agent visual inspection found that Storybook correctly makes its preview
root a responsive public grid, but the catalog `<main>` does not span that grid
and therefore occupies only one narrow column. Its nested `Cards` parent was
also a block, leaving `grid-template-columns: none`; both cards occupied the
same x position on different bands and had unequal heights. Making only that
section a new responsive grid aligned their y positions but still left the
whole catalog 312px wide, with one card 123.5px wide and the other only 21.75px.
Pragma `c52e65a3d` corrects both levels. The catalog spans the Storybook grid,
the Card section is a public responsive grid, and its heading spans the section.
The rendered oracle now requires full catalog width, a single-line heading and
same-band, comparably sized cards with registered Content tops. Root-agent live
measurement reproduced a 3066.7px catalog in a 3114px viewport, with two
497.8px cards sharing the same y position, height and Content top.

The primitives wave removes exactly 11 transition identities: Breadcrumbs 4,
InlineCode 1, Icon 1, Spinner 1 and KeyboardKey/KeyboardKeys 4. No exception or
classification was added. The scanner moved from `308/27/275/6/0` to
`297/27/264/6/0`.

KeyboardKey is treated as ordinary inline code text with horizontal inset and
an inset, zero-layout border. It therefore does not enlarge the surrounding
paragraph or enter either row family. The real pseudo-element border survives
forced-colour mode, and its width plus the key/chord spacing remain overridable.
Icon and Spinner keep their public font-relative sizing and explicit overrides;
their SVG height follows intrinsic geometry rather than a separate target.

## Independently checked

- Both commits contain only their intended files after an accidental shared
  staging collision was split locally; `git show --check` is clean.
- Fresh root-agent scanner result: `297/27/264/6/0`.
- Fresh root-agent Chromium DPR1 checks: React pilot route smoke 1/1,
  KeyboardKey 1/1 and Spinner 1/1; the focused Field dispatcher source test is
  1/1 after the composition correction.
- Implementation-agent evidence: composed pilot Chromium, Firefox and WebKit
  at DPR1/2; primitives Chromium DPR1/2 10/10; 49/49 scoped source tests and
  TypeScript green.

This review does not accept Card page-grid registration, close the remaining
55 included React transition identities, or make any Lit/Svelte readiness
claim.
