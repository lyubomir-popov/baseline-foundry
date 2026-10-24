# Opus follow-up review: mobile demo chrome and review dispositions

Date: 2026-10-09
Request: `specs/028-shared-spacing-decisions/reviews/opus-028-followup-review-request.md` at `f52d0dde3ba267954625f65b939cec90ed914e59`
Diff reviewed: `5720ba3d61a3cadabbeb97089b9a6b62b42ff7db..2abf5e8576fce8780ce3a68caecaa3ef89106444` (`demo/page-chrome.css`, `scripts/verify-component-behavior.ts`)
Probe scripts and screenshots: `H:/WSL_dev_projects/temp/opus-028-followup-probe/` (outside the sealed evidence set; nothing sealed was touched)

## Verdict

**Changes requested – one medium finding (R1) against N1.** N2–N5 dispositions are
accurate and accepted as written. The already accepted spacing corrections are
not reopened; no regression to them was found.

N1 fixes what it set out to fix – the SideNavigation brand and close control are
visible and hit-testable at 390px with the specimen open – but the construction
paints shared chrome *under* the drawer without taking it out of the focus order.
That moves the footer controls from visible to obscured-while-focusable, which
N1's own acceptance criterion ("keyboard behavior") should have caught.

## What holds

- **Breakpoint pairing.** Chrome uses `width < 64.75rem`; the product drawer
  switches off at `min-width: 64.75rem`. The two ranges are exact complements,
  so 1035/1036px has no gap or overlap, including fractional widths.
- **Stacking slot.** Mobile header/footer move from 130 to 100, which sits
  between the product's sticky TopNavigation (98) and the SideNavigation
  overlay/drawer (101/102). In-flow sticky specimens still pass beneath the
  shared header; the fixed drawer paints above it. Every other product
  z-index is below 98 or above 130, so no other relative order changes –
  Tooltip, menus and popovers are unaffected.
- **Selector scope.** `body:has(> .pc-content .bf-side-navigation.is-drawer-expanded) > .pc-nav`
  cannot self-match the shared catalog (it lives outside `.pc-content`), and it
  sits inside the mobile query, so the desktop rail is unaffected.
- **Resize.** Loading at 1440px (specimen carries `is-drawer-expanded` from
  markup) then shrinking to 390px yields the expected mobile ownership state.
- **Specimen fidelity.** No component CSS, markup or frozen Before bytes change;
  the brand is not hidden or replaced.
- **Harness additions** correctly assert brand hit-testing, independent drawer
  state, keyboard open via Enter/Space and Escape focus return.

## R1 (medium, regression introduced by N1): shared footer controls are focusable but obscured while the specimen owns the viewport

**Reproduction.** 390×844, `/demo/components/side-navigation.html?bundle=after`
(identical with `before`). Specimen drawer is open on load. Focus the in-drawer
close toggle and press Tab repeatedly.

**Observed.** After the drawer links, focus leaves the specimen and reaches the
shared footer's Dark theme switch, Baseline grid switch, Bundle version select
and Tier select. For each, `elementFromPoint` at the control's centre returns the
overlay/drawer, not the control – focus is fully hidden. Probe output
(`tab-probe.mjs`): 15 obscured non-specimen stops, 4 of them in `.pc-footer`.

**Why it's new.** At `5720ba3` the mobile footer was z-index 130, above the
overlay (101), so the same Tab stops were visible. Lowering it to 100 is what
hides them. This fails WCAG 2.2 SC 2.4.11 Focus Not Obscured (Minimum) for the
demo chrome. The 11 obscured `content` stops are the product drawer being
non-modal – pre-existing, present in both bundles, and outside this chrome-only
slice; record it for the Pragma implementation rather than fixing it here.

**Affected construction.** `demo/page-chrome.css`, the mobile
`.pc-header, .pc-footer { z-index: 100; }` rule, combined with the
`.pc-nav { display: none; }` rule that only removes the catalog rail.

**Suggested construction.** Treat the shared chrome the same way the rail is
already treated: while a specimen drawer owns the viewport, take header and
footer out of rendering and focus, not just out of paint order. For example,
under the same `:has()` condition:

```css
body:has(> .pc-content .bf-side-navigation.is-drawer-expanded) > :is(.pc-header, .pc-footer) {
  visibility: hidden;
}
```

`visibility: hidden` keeps layout (no shift when the specimen closes), removes
hit-testing and removes the controls from the tab order and accessibility tree.
It also makes the z-index 100 change unnecessary, which removes an
undocumented coupling to product z-indexes 98/101/102 – if kept, that number
needs a one-line comment saying why it must stay in that band.

**Harness gap.** Add a Tab-from-close assertion: with the specimen open, no
focus stop inside `.pc-header`/`.pc-footer`/`.pc-nav` may be reached, and the
footer controls must be reachable and hit-testable again after Escape.

## Observation (pre-existing, not blocking N1): ApplicationLayout has the same defect class

At 390px, `/demo/components/application-layout.html?bundle=after`, opening the
navigation drawer gives: brand "MAAS control plane" covered by `.pc-header`,
top-left covered by the Pages toggle in `.pc-nav`, and the drawer's Pin and
Close controls covered by `.pc-footer` (screenshot `app-390.png`). Present
before N1 (the chrome was 130 then; it is 100 now, still above
`.bf-navigation`'s stacking context at 41). At 1035px the drawer is not
viewport-owning and is unobscured.

N1's remedy is keyed to `.bf-side-navigation.is-drawer-expanded`, so it does not
reach this page. If the owner's visual pass includes ApplicationLayout at
mobile widths, widen the condition, e.g.
`:is(.bf-side-navigation.is-drawer-expanded, .bf-navigation:not(.is-collapsed))`,
and check `drawer-panel.html` (`.bf-application.is-drawer-expanded`) the same
way. Otherwise, record it as a known demo-chrome limitation so the request's
claim that shared chrome no longer covers specimen branding is not read as
page-wide.

## N2–N5 dispositions

- **N2 – accepted as written.** Correctly left open: it names the two affected
  constructions (bare native fields, raw native table cells), states the
  deviation from the one-sided fallback rule, and does not infer a waiver.
- **N3 – accepted, with one wording tightening.** Confirmed in
  `src/css-components.ts` (`input:not([type])` added to the field selectors).
  The disposition's rationale ("HTML treats an untyped input as a text input")
  also holds for `type=""` and unknown values such as `type="foo"`, which are
  still unmatched. Either say "inputs with no `type` attribute" in release
  communication, or note that empty/invalid types keep browser defaults.
- **N4 – accepted.** Deferring a schema change in a chrome-only slice is the
  right call; the revisit condition is concrete.
- **N5 – accepted.** Confirmed: `position: relative` appears only inside the
  forced-colors block in `src/css-components/stroke-paint.ts`. The
  containing-block caveat and revisit condition are correctly stated.

## Limits of this review

Chromium only, via Playwright against the Vite dev server on port 4187. Raw
CSS response hashes, Firefox, Safari and native Windows contrast themes were
not re-run. The required type/test/QA/provenance gates were not re-run; their
recorded results were accepted as reported. The CI dependency-audit failure
(`source-map-js`) and the other open gates listed in the request are unchanged
by this review.
