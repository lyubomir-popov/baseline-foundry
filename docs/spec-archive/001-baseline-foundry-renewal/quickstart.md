# QA quickstart: Baseline Foundry renewal

## Automated gate

```powershell
npm test
npm run qa:components
```

## Demo server

```powershell
npm run demo:serve -- --host 127.0.0.1 --port 4174 --strictPort
```

Open `http://127.0.0.1:4174/demo/patterns/index.html` for the owner-selected
Vanilla root patterns, Sites compositions, recipes, layouts, and explicit
exclusion dispositions. Open
`http://127.0.0.1:4174/demo/components/index.html` for BF foundations and
reusable component primitives. Check console errors, visible overflow,
keyboard focus, and the baseline overlay where the page exposes it.

## Required review routes

1. `demo/components/top-navigation.html`: tagged/grid-aligned mode at desktop and
   mobile widths.
2. `demo/components/docs-layout.html`: wide navigation/content composition and
   narrow drawer/full-width content.
3. `demo/components/tiered-list.html`: flush and triple variants, including long
   content.
4. `demo/components/tabs.html`: active underline/list rule geometry in all four
   tiers.
5. `demo/components/aspect.html`: 4:3 cover and 4:3 contain specimens.
6. `demo/components/notice.html`: base and all semantic variants.
7. `demo/components/article-pagination.html`: paired, previous-only, next-only,
   long title, narrow container, and RTL.
8. `demo/components/page-shell.html`: full-bleed top navigation and page chrome.
9. `demo/components/search-and-filter.html`: compact wrapping control row.
10. `demo/components/typography.html`: eyebrow role in editorial,
    documentation, app, and OS.
11. `demo/panel.html` plus representative typography, controls, icon, navigation,
    and table component pages: OS direct/shared parity and first-class copy.

## Active parity-amendment routes

Review the closest current Vanilla example beside BF, then exercise every BF
route in all four tiers. The common matrix is wide, threshold-adjacent and
narrow widths; long copy; focus/keyboard; RTL where directional; baseline
overlay; document and local overflow; and browser logs.

| Family | Routes | Material widths and states |
|---|---|---|
| Pagination | `article-pagination.html` | 1440px, 900px, 460px and 304px; paired, previous-only, next-only, long title and RTL |
| Static and document navigation | `data-spotlight.html`, `divided-section.html`, `in-page-navigation.html`, `navigation-reduced.html`, `table-of-contents.html` | 1036/1035px and 620/619px where applicable; current state, disclosure, sticky rail, reduced search and nested links |
| Forms and feedback | `credential-validation.html`, `notification.html` | reveal lifecycle, validation/help association, dismiss/action focus and semantic variants |
| Interactive tables | `table-sortable.html`, `table-expanding.html`, `table-mobile-card.html` | sort order/ARIA, row disclosure and mobile reflow at its exact threshold |
| Logo and media | `logo-section.html`, `media-object.html`, `linked-logo-section.html` | 1036/1035px and 620/619px; intrinsic marks, full/50-50/25-75, ordering and RTL |
| Sites foundations | `basic-section.html`, `cta-section.html`, `text-spotlight.html`, `hero.html`, `quote-wrapper.html` | full and asymmetric layouts, section depths, media, signpost/citation and RTL |
| Sites cards and lists | `content-card.html`, `rich-list-horizontal.html`, `rich-list-vertical.html` | allocated-width reflows and 1036/1035px; spans, overlays/nested controls, clamps, ratios, fit and flipped order |
| Sites recipes and tabs | `empty-state.html`, `equal-heights.html`, `tab-section.html` | recipe semantics; 2/3/4 equal-height columns; full/50-50/25-75 tabs and roving keyboard state |
| Site layouts | `sticky-footer.html`, `fluid-breakout.html` | sticky activation at 620/619px; toolbar at 620/619px, tracks at 1036/1035px and tier-specific outer-padding transfer |

Article pagination additionally requires a persistent same row. Wide pairs and
boundary links retain logical halves; compact copy preserves a complete
accessible name; label/title text edges align; and occupied blocks remain
baseline-snapped. Recipe-only Sites compositions still require isolated
rendered examples but do not justify duplicate CSS primitives.

## Closeout record

Record final commands, browser sizes, routes, and findings in
`review.md`. Any unresolved visual or API concern reopens its owning task.
