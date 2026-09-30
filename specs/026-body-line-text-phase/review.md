# Review: Body-line text phase

Closeout evidence for Spec 026. Phase A tasks T001–T010 are recorded here;
later sections are added by T015–T023.

## T002 – baseline capture

Captured 2026-09-30 on `feat/026-body-line-text-phase` at `c6016b2` (the
planning commit on top of `main` `6c43f99`; no source change), after
`npm run setup:demo-font` and `npm run build`. `dist/` was copied to
`tmp/026-main-dist/`. SHA-256 of every CSS, `tokens.json` and
`surfaces.json`:

```text
93733628aa60d0fa863129557423fde4399ad50358ba4f153fa8ac116f0a8425  experiments/ibm-plex-engine-smoke/styles.css
6c33a79cb1ba0dd9a1c6c2056f5a93ab7b9f453a780286a4798bcd97aa50b07a  experiments/ibm-plex-engine-smoke/surfaces.json
9368ab163021202cb943f80c6b04d64dff1cbaebbb2bffc23bd0116583152a08  experiments/ibm-plex-engine-smoke/tokens.json
e8762af44572614d6b8b6df7fe811b9afda1bd1d5ef87e7c8b054578cd39f94e  presets/app-tier/styles.css
5ca1732eed4c3c1016d53759009766bb929da0355ab690e5d3d0054564e78960  presets/app-tier/surfaces.json
35c18330e627bb449ea7c21e693b90e0447097aa905848a605df36dfcf7bb2a5  presets/app-tier/tokens.json
50b61a6472416a242dae790631ebad78765dfd5786babacfc9b962cb066c24d0  presets/prose/styles.css
f0bb5168124ae7e8286692af901221ed5f6c621c69b0784418dcccc2e072c537  presets/prose/surfaces.json
9ccc8ad0d4cd11b7e085c054ce884bac719ee58b373ad84cfe830c9d97076c90  presets/prose/tokens.json
e8762af44572614d6b8b6df7fe811b9afda1bd1d5ef87e7c8b054578cd39f94e  tiers/app/styles.css
5ca1732eed4c3c1016d53759009766bb929da0355ab690e5d3d0054564e78960  tiers/app/surfaces.json
35c18330e627bb449ea7c21e693b90e0447097aa905848a605df36dfcf7bb2a5  tiers/app/tokens.json
140fd485eeea8a6dbd04ec324206cca66f84e922426de9234db63da4b28681c0  tiers/documentation/styles.css
70da76fa6aa510b618be20276c45ec799200b8a38952721dfa40dafa8fa15cc9  tiers/documentation/surfaces.json
2ebd45e7c324130226132daf584f62c2deda8072e93a7eaef4f8b54cad70794d  tiers/documentation/tokens.json
50b61a6472416a242dae790631ebad78765dfd5786babacfc9b962cb066c24d0  tiers/editorial/styles.css
f0bb5168124ae7e8286692af901221ed5f6c621c69b0784418dcccc2e072c537  tiers/editorial/surfaces.json
9ccc8ad0d4cd11b7e085c054ce884bac719ee58b373ad84cfe830c9d97076c90  tiers/editorial/tokens.json
e7337b3e09efc1ba5be00303df25e9eba367c56c1b9ebd65965ae39afa728b76  tiers/os/styles.css
6e5d22e3e2b429aa6c59954ef6fe958b8d2e56ed4bafd099c3cf0d5c0e256f34  tiers/os/surfaces.json
85c3c07a0e8ed1d40b3bb59702f787e800b1ac71ef96bf207473f98b450bfd77  tiers/os/tokens.json
50b61a6472416a242dae790631ebad78765dfd5786babacfc9b962cb066c24d0  styles.css
178795e31e890cdba400d1a7a783c94bdb8c3fa03f2ae503c32ecdf5499dff23  surfaces.json
53beb57c7443b6418a91b5663abd1e0110c045d904806feeb545489de8592e27  tokens.json
```

No rebase has happened since the capture.

## T003 – component markup inventory

Scanned from markup, not CSS: 90 HTML files in `demo/components` and
`demo/patterns`, plus the `html` fences of `README.md`. Comments, `script`
and `style` bodies are ignored. A component root is any element carrying a
`bf-*` class other than the layout primitives, text roles, theme, tier and
surface classes and the cap-engine markers (`bf-theme`, `bf-tier-*`,
`bf-surface-*`, `bf-page`, `bf-grid*`, `bf-span-*`, `bf-stack`, `bf-cluster`,
`bf-section`, `bf-prose`, `bf-strip`, `bf-measure`, `bf-fixed-width`,
`bf-inline-size`, `bf-stage-shell`, `bf-body`, `bf-h1`–`bf-h6`, `bf-lead`,
`bf-meta`, `bf-text-link`, `bf-engine-cap`, `bf-engine-metrics`). Application
shells (`bf-main`, `bf-site-main`, `bf-page-shell`, `bf-docs-layout-*`) count
as component roots, which is conservative.

Totals:

- 478 bare `p`, `h1`–`h6` and `li` inside component roots.
- 136 `.bf-body`/`.bf-hN` inside component roots.
- 3 `.bf-prose` inside component roots, all the quote wrapper
  (`div.bf-prose.bf-quote-wrapper-prose`), each with a single `blockquote`
  child: `demo/components/quote-wrapper.html` lines 25 and 40,
  `demo/components/tab-section.html` line 37.
- 58 elements match the prose-flow scope (research D1); **0 of them are
  inside a component root**. No defect to resolve before T008.

Every `.bf-prose` and its direct children:

```text
demo/components/editorial-pressure.html:12  div.bf-prose.bf-measure > h5.bf-h5, h1, p
demo/components/editorial-pressure.html:32  div.bf-prose.bf-measure > h2, p, p, blockquote
demo/components/engine-illustration.html:13 div.bf-prose.bf-measure > h5.bf-h5, h2, p, p
demo/components/engine-illustration.html:30 div.bf-prose.bf-inline-size.is-x-wide > h3, p
demo/components/engine-illustration.html:81 div.bf-prose.bf-inline-size.is-x-wide > h3, p
demo/components/engine-illustration.html:131 div.bf-prose.bf-measure > h4, p
demo/components/engine-smoke.html:13        div.bf-prose.bf-measure > h5.bf-h5, p, p
demo/components/engine-smoke.html:23        div.bf-prose > h5.bf-h5, p, h1, p, h2, p, h3, h4, h5.bf-h5, h6
demo/components/engine-smoke.html:38        div.bf-prose > h5.bf-h5, p, h1, p, h2, p, h3, h4, h5.bf-h5, h6
demo/components/index.html:13               div.bf-prose > h5.bf-h5, h1, p
demo/components/panel-pressure.html:34      div.bf-prose > h5.bf-h5, p.bf-h3, p
demo/components/panel-pressure.html:42      div.bf-prose > h5.bf-h5, p.bf-h4, ul
demo/components/panel-pressure.html:54      div.bf-prose > h5.bf-h5, p.bf-h4, p
demo/components/prose.html:26               section.bf-prose > h3, ul
demo/components/quote-wrapper.html:25       div.bf-prose.bf-quote-wrapper-prose (component) > blockquote
demo/components/quote-wrapper.html:40       div.bf-prose.bf-quote-wrapper-prose (component) > blockquote
demo/components/tab-section.html:37         div.bf-prose.bf-quote-wrapper-prose (component) > blockquote
demo/components/typography.html:19          div.bf-prose > h3.bf-h6, h6.bf-h3
demo/patterns/index.html:13                 div.bf-prose > h5.bf-h5, h1, p
README.md:302                               div.bf-prose.bf-stack > h1, p
README.md:309                               div.bf-prose.bf-stack > h1, p
README.md:316                               div.bf-prose.bf-stack > h1, p
README.md:409                               div.bf-prose > h1, p
```

Bare text elements and role-classed text inside component roots, per file,
with the nearest component root and count (none is in prose-flow scope):

```text
accordion                bare 2,  role 2   li.bf-accordion-group 2, div.bf-accordion-panel 2
application-layout       bare 17, role 13  h3.bf-side-navigation-heading 1, li.bf-side-navigation-item 9, li.bf-breadcrumbs-item 2, h2.bf-panel-title 3, div.bf-panel-content 13, li.bf-inline-list-item 2
application-shell        bare 1,  role 15  main.bf-main 2, h2.bf-panel-title 1, div.bf-panel-content 13
basic-section            bare 8,  role 1   header.bf-basic-section-header 3, div.bf-basic-section-content 4, li.bf-list-item 2
breadcrumbs              bare 3,  role 0   li.bf-breadcrumbs-item 3
cards                    bare 0,  role 9   header.bf-card-header 6, div.bf-card-content 3
code-snippet             bare 2,  role 0   h5.bf-code-snippet-title 2
content-card             bare 16, role 0   h3.bf-content-card-title 7, p.bf-content-card-author-date 5, p.bf-content-card-description 4
contextual-menu          bare 2,  role 0   li.bf-contextual-menu-group 2
controls                 bare 7,  role 4   p.bf-form-help 2, li.bf-tabs-item 2, div.bf-tabs-panel 2, li.bf-accordion-group 2, div.bf-accordion-panel 2, h2.bf-modal-title 1
credential-validation    bare 7,  role 0   p.bf-validation-message 4, li.bf-validation 3
cta-block                bare 3,  role 0   div.bf-cta-block 3
cta-section              bare 3,  role 0   div.bf-cta-section-copy 3
data-spotlight           bare 27, role 3   header.bf-data-spotlight-header 3, p.bf-data-spotlight-stat 9, h3.bf-data-spotlight-headline 9, article.bf-data-spotlight-item 9
divided-section          bare 10, role 3   header.bf-divided-section-header 2, div.bf-divided-section-content 2, li.bf-divided-section-item 9
docs-layout              bare 4,  role 6   h2.bf-side-navigation-heading 1, li.bf-side-navigation-item 3, main.bf-docs-layout-content 6
drawer-panel             bare 1,  role 4   main.bf-main 2, h2.bf-panel-title 1, div.bf-panel-content 2
empty-state              bare 1,  role 1   h2.bf-notification-title 1, p.bf-notification-message 1
engine-illustration      bare 6,  role 12  header.bf-card-header 6, div.bf-card 6, article.bf-card 6
equal-height-row         bare 32, role 0   div.bf-equal-height-row-item 32
equal-heights            bare 18, role 9   div.bf-equal-height-row-item 27
file-input               bare 1,  role 0   p.bf-form-help 1
form-atlas               bare 10, role 5   li.bf-segmented-control-item 3, li.bf-tabs-item 5, div.bf-tabs-panel 5, p.bf-form-help 1, p.bf-validation-message 1
hero                     bare 11, role 0   header.bf-hero-title 4, div.bf-hero-content 5, header.bf-hero-intro 2
in-page-navigation       bare 11, role 0   h2.bf-in-page-navigation-heading 1, li.bf-in-page-navigation-item 9, h3.bf-in-page-navigation-heading 1
inline-list              bare 6,  role 0   li.bf-inline-list-item 6
linked-logo-section      bare 2,  role 3   header.bf-linked-logo-section-header 5
list-tree                bare 4,  role 0   li.bf-list-tree-item 4
list                     bare 12, role 0   li.bf-list-item 12
logo-section             bare 1,  role 2   section.bf-logo-section 3
media-object             bare 6,  role 0   h2.bf-media-object-title 2, div.bf-media-object-content 2, li.bf-media-object-meta 2
modal                    bare 11, role 0   h2.bf-modal-title 2, p.bf-form-help 1, div.bf-modal-body 8
navigation-reduced       bare 8,  role 0   li.bf-top-navigation-item 6, ul.bf-top-navigation-dropdown 2
notice                   bare 10, role 0   h2.bf-notice-title 5, div.bf-notice-content 5
notification             bare 5,  role 4   h2.bf-notification-title 4, p.bf-notification-message 5
page-shell               bare 2,  role 4   li.bf-top-navigation-item 2, body.bf-page-shell 4
pagination               bare 6,  role 0   li.bf-pagination-item 6
panel-tabs               bare 3,  role 3   li.bf-tabs-item 3, div.bf-tabs-panel 3
prose                    bare 3,  role 0   li.bf-tiered-list-item 1, div.bf-tiered-list-item-title 1, div.bf-tiered-list-item-description 1
quote-wrapper            bare 3,  role 2   header.bf-quote-wrapper-header 2, p.bf-quote-wrapper-header-link 1, p.bf-quote-wrapper-citation 2
rich-list-horizontal     bare 22, role 0   header.bf-rich-list-header 3, div.bf-rich-list-support 3, li.bf-list-item 16
rich-list-vertical       bare 15, role 0   div.bf-rich-list-copy 9, li.bf-list-item 6
search-and-filter        bare 0,  role 2   h5.bf-filter-panel-section-heading 2
segmented-control        bare 3,  role 0   li.bf-segmented-control-item 3
select                   bare 1,  role 0   p.bf-form-help 1
side-navigation          bare 23, role 2   h3.bf-side-navigation-heading 3, li.bf-side-navigation-item 20, main.bf-main 2
sticky-footer            bare 17, role 2   main.bf-site-main 17, footer.bf-site-footer 2
surfaces-navigation      bare 16, role 9   li.bf-breadcrumbs-item 3, li.bf-segmented-control-item 3, li.bf-pagination-item 6, header.bf-card-header 6, div.bf-card-content 3, p.bf-form-help 1, p.bf-validation-message 3
tab-section              bare 19, role 5   header.bf-tab-section-header 3, div.bf-tab-section-intro 2, li.bf-tabs-item 6, p.bf-quote-wrapper-citation 1, section.bf-logo-section 1, header.bf-divided-section-header 1, div.bf-divided-section-content 1, li.bf-divided-section-item 6, header.bf-basic-section-header 1, div.bf-basic-section-content 1, div.bf-tabs-panel 1
table-expanding          bare 3,  role 2   td.bf-table-expanding-cell 5
table-of-contents        bare 11, role 3   h2.bf-table-of-contents-heading 3, li.bf-table-of-contents-item 11
tabs                     bare 2,  role 2   li.bf-tabs-item 2, div.bf-tabs-panel 2
text-spotlight           bare 6,  role 1   header.bf-text-spotlight-header 1, li.bf-text-spotlight-item 6
tiered-list              bare 30, role 0   div.bf-tiered-list-header-title 3, div.bf-tiered-list-header-description 3, li.bf-tiered-list-item 10, div.bf-tiered-list-item-title 6, div.bf-tiered-list-item-description 6, div.bf-tiered-list-cta-block 2
tooltip                  bare 1,  role 0   p.bf-tooltip-message 1
top-navigation           bare 18, role 0   li.bf-top-navigation-item 8, ul.bf-top-navigation-dropdown 10
validation               bare 3,  role 0   p.bf-validation-message 3
patterns/index           bare 3,  role 3   article.bf-card 6
```

Rows without a directory are under `demo/components/`. The README examples
contain no component roots. The same scan runs as the AC-3 markup check in
`npm run test:build` (“Body-line rhythm markup scope”).

## T010 – dist identity

Rebuilt 2026-09-30 at `223865e`. Against `tmp/026-main-dist/`:

- All 8 `styles.css` bundles (default, four tiers, `prose`, `app-tier`,
  `ibm-plex-engine-smoke`) contain exactly one opt-in section and are
  byte-equal to the capture once the section, opening to closing comment
  inclusive, is removed.
- All 8 `tokens.json` and all 8 `surfaces.json` are byte-equal.
- Compiled TypeScript outputs differ as expected: `body-line-rhythm.js` and
  `.d.ts` are new; `build.js`, `build.d.ts`, `css.js`, `css.d.ts` and
  `types.d.ts` changed. Nothing else in `dist/` changed.

`npm run test:build` passes with 26,686 checks, 2,336 of them in the
body-line rhythm invariants (formulas 313; section 246 per built-in bundle
and 171 for the experiment; parity 66; no-op 5; markup scope 59).
