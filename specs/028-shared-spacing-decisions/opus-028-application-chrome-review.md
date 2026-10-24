# Opus review: ApplicationLayout mobile chrome

Date: 2026-10-10
Target: `feat/028-shared-spacing-decisions` at `f81b81e`; runtime pin `6f7f4683979746f1fbf96f6de77f6767560cec00` (`git diff --quiet 6f7f468 HEAD -- demo src scripts` exits 0)
Diff reviewed: `ca05233..6f7f468` – `demo/page-chrome.css` (+15/−3 comment), `scripts/verify-component-behavior.ts`
Live page: `http://127.0.0.1:4176/demo/components/application-layout.html`, served from this worktree (the served `page-chrome.css` contains the new 48rem rule)
Probes: `H:/WSL_dev_projects/temp/opus-028-application-chrome-probe/` (three scripts, three JSON outputs, two PNGs), outside every sealed evidence set

The handoff says this slice doesn't create another external review requirement. The owner asked for one anyway, so this report is additive. It doesn't replace the integration or independent reports.

## Verdict

**Accept the navigation-drawer repair. Narrow two claims before owner
approval of ApplicationLayout at mobile and tablet widths.** No regression
found. Three findings: two P2 scope/disclosure issues and one P3, all
pre-existing and none caused by this change.

## The repair holds

The construction mirrors the accepted R1 pattern: `display: none` on the
rail, `visibility: hidden` on header/footer. It's gated by
`width < 48rem`, the exact complement of the product's `min-width: 48rem`,
and by the direct-child anatomy
`> .pc-content > .bf-application > .bf-navigation:not(.is-collapsed)`, so it
can't match the SideNavigation specimen. The SideNavigation comment nit from
the R1 review is addressed.

The live check covered 12 states: Before/After × 390/767/768 × LTR/RTL, with the drawer opened by a real pointer click.

| Check | Result |
| --- | --- |
| 390/767 open: brand, Pin, Close own their centres | 8/8 |
| 390/767 open: header/footer `hidden`, rail `none`, visible chrome descendants | 8/8, 0 leaks |
| Full Tab **and** Shift+Tab cycle from Close | Never enters chrome; returns to Close, 8/8 |
| Pin while in mobile drawer mode (`is-pinned`) | Chrome stays hidden; brand/Pin/Close still own centres, 8/8 |
| Unpin → Escape | Collapsed, chrome restored, focus on Navigation toggle, Tier select owns its centre, 8/8 |
| 768 open | Rule correctly not applied; chrome visible |
| Resize 1440→390 with nav expanded | Chrome hides, drawer controls own centres |
| Resize 390→1440 | Chrome returns |

## A1 (P2, pre-existing, product): Activity drawer header and Close are covered at 390px

**Reproduction.** 390×844, either bundle. Click **Activity** in the product navigation bar.

**Observed.** The Activity aside's title row and Close button sit under the
product's own responsive navigation bar. The Close centre is owned by
`.bf-top-navigation-link` (the MAAS brand). See `after-app-390-activity.png`. The
aside starts mid-sentence below the bar. Shared chrome is not the cause.

**Construction.** In the product CSS, `.bf-aside.is-overlay` is
`position: absolute` at `z-index: 30` spanning `grid-row: 1 / -1`, and
`.bf-navigation-bar` is `z-index: 40`. The bar wins.

**Required.** This is the same page and width the owner is now asked to approve.
Either fix it in the product layer (aside above the bar when it overlays, or
start it below the bar) or record it as a known limitation. Then scope the
"mobile overlap is fixed" claim to the navigation drawer. The fix belongs to
ApplicationLayout, not the demo chrome. Route it to the component's own
follow-up, not to `page-chrome.css`.

## A2 (P2, disclosure accuracy): the 48–64.75rem Pin limitation is a geometry class, not four states

The independent report lists four fixed failures: Docs/768 and Editorial/1035 in
both bundles. My After-bundle probe at 768px across viewport heights 700/844/1000 and four
tiers shows the fixed shared footer covering **Pin and Close together**, in
**both expanded and pinned** states, for a different set at each height:

| 768 × height | Footer owns Pin and Close |
| --- | --- |
| 700 | OS (expanded and pinned) |
| 844 | App (expanded and pinned) |
| 1000 | Documentation (expanded and pinned) |

Other cells are self-owned or, while expanded and unpinned, below the fold.
The condition is: the persistent navigation's bottom control row falls in the
fixed footer's band. Which tier hits it depends on viewport height. 768×1000
is close to a common tablet portrait size.

**Required.** Restate the limitation in the handoff, tasks and independent
disposition as that condition, naming Close as well as Pin. Then the owner
won't read "four states" as the full extent. Keyboard activation working
doesn't change the pointer result.

## A3 (P3, pre-existing, demo chrome): the footer's scroll padding is set on the wrong element

`body:has(> .pc-root)` sets `scroll-padding-block-end`, but the document's
scrolling element is `html`. Computed `scroll-padding-block-end` there is
`auto`, so the rule has no effect. There's also no block-start padding for the
sticky header.

**Measured.** Forward Tab through ApplicationLayout at 390px with the drawer
closed: 3 of 13 in-content focus stops are fully owned by visible shared
chrome (`maas-worker-17` and `maas-db-03` by the footer, `Export` by the
header). The same probe finds 0 on SideNavigation and Tooltip, and 0 at 1440. One
of my 12 Escape states also returned focus to the Navigation toggle while it
sat under the sticky header.

**Suggested.** Move the padding to the scroller and add the header:
`html:has(> body > .pc-root) { scroll-padding-block: <header size> var(--pc-footer-block-size, 0rem); }`.
Check whether the remaining stops sit in an inner scroll container, which needs its own padding. This
is a WCAG 2.2 SC 2.4.11 risk for the demo, not the product, and doesn't block
this slice.

## Not re-run

Root types, full test, component QA, provenance, raw CSS hashes and the
192-file seal were accepted as reported. Chromium only. Still open: Firefox,
Safari, native contrast themes, the `source-map-js` audit, owner visual
approval, N2, governing activation, and the Spec 024 popup review.
