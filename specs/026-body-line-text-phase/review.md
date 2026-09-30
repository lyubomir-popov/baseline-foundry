# Review: Body-line text phase

Closeout evidence for Spec 026. Phase A tasks T001–T021 are recorded first,
with the implementation-review corrections. The CP-B default flip (rulings
R1–R5) is recorded in commits `2cff295`–`9be5d63` and in tasks T027–T036; no
separate CP-B section was written here. The R6–R7 wave (flow text everywhere,
D4 closed as (c)) is recorded in
[R6–R7](#r6r7--flow-text-everywhere-self-spacing-text-blocks-2026-09-30) at the
end and supersedes the prose-only wording above. T022 dark-tone review and
T023 are still open.

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

## T011–T014 – comparison demo

`demo/spec/body-line-rhythm.html` (route listed after the typographic
specimen), `demo/body-line-rhythm.js` and the page-local
`demo/body-line-rhythm.css`. Every comparison column is a nested `.bf-theme`
root whose tier and tone classes the script mirrors from the page chrome; the
opt-in columns add `is-body-line-rhythm`. Sections: ledgers with computed
nudge, phase, end term and occupied height; the D4 row with (a) default gaps
and labelled page-local candidates (b), (c) and (d); the one-line matrix
(current, opt-in, and a non-opted theme nested in an opted root); wrapped
headings; tight, loose and nested lists; metric-flush, `hr` and `blockquote`.
Specimen CSS is limited to the zero-gap flow, the body-line ruling and the
five D4 candidate rules, each scoped to a `body-line-*` class.

Live D4 read-outs (stack gap / prose gap, rem) match research R7:

| Tier | (a) | (b) up | (c) | (d) down |
|---|---|---|---|---|
| Editorial | 1.5 / 1.5 | 1.5 / 1.5 | 1.5 / 0 | 1.5 / 1.5 |
| Documentation | 1.5 / 1.5 | 2.5 / 2.5 | 1.5 / 0 | 1.25 / 1.25 |
| App | 0.5 / 0.5 | 1.25 / 1.25 | 0.5 / 0 | 0 / 0 |
| OS | 1.5 / 1.5 | 2 / 2 | 1.5 / 0 | 1 / 1 |

“Body-line rhythm demo” in `npm run test:build` adds 52 checks: catalog
registration, four-tier boot, assets, no inline styles, opt-in only on the
opted roots, the nested non-opted root, every fixture flow and its count,
the metric-flush container shape, labelled (a)–(d), the “not public API”
labels, the exact candidate formulas, `body-line-*`-only selectors and the
tier/tone mirror. The stylesheet also joins the demo selector-hygiene check.

## T015–T018 – rendered proof

`scripts/behavior/body-line-rhythm-contracts.ts`, called from the end of
`main()` in `scripts/verify-component-behavior.ts`; no existing family
changed. Chromium DPR 1, viewport 1440 × 960, roots 16px and 32px, all four
tiers. Expected phase, F* and step come from `computeBodyLineRhythm` with each
tier's `tokens.json` and font files, not from the rendered CSS. The test
inserts zero-size inline-block probes at the start of each line. Tolerance
0.1px throughout.

Asserted per tier and root:

- AC-5: for the nine matrix elements (body, h1–h6, `p.bf-h3`, body),
  `(probe − top)` opted minus current equals the phase; the opted matrix
  starts at the flow top and every element top is whole body lines after the
  previous one. `h3` and `p.bf-h3` occupy the same box. The largest phase
  residual across all 4 × 2 runs is 0.0000px.
- AC-6: every line of every two- and three-line h1–h6 follows the previous
  by the role line height in both columns; for the contract's qualifying
  roles the following paragraph is whole body lines after the heading top.
  The computed qualifying set equals the contract list in every tier.
  Editorial h3, documentation h3, app h1 and os h1 at two lines miss the
  nearest body line by 8.00px at 16px and 16.00px at 32px (R3: 0.5rem, at
  least one bU).
- AC-7: the nested non-opted theme matches the current column for
  `probe − top` and element advance; the metric-flush pair's internal
  baseline distance is unchanged; the prose dot keeps its offset from the
  first probe; a loose item's text sits where a tight item's does, and tight
  and loose items advance by whole body lines; the page console stays clean.

### Measured ε (rendered first baseline − F*, px; data, not asserted)

Measured on the current column; the opt-in column carries the same value
because the phase residual is 0. Every value equals the research R2
cross-check.

| Tier | Role | ε @16px | ε @32px |
|---|---|---:|---:|
| Editorial | body, h5, h6 | −0.453 | +0.109 |
| Editorial | h3, h4 | −0.500 | −1.000 |
| Editorial | h1, h2 | −0.906 | −1.813 |
| Documentation | body | −0.766 | −0.531 |
| Documentation | h5, h6 | −0.234 | −0.469 |
| Documentation | h3, h4 | −0.500 | −1.000 |
| Documentation | h1, h2 | −0.391 | −1.766 |
| App | body, h5, h6 | −0.766 | −0.531 |
| App | h3, h4 | −0.234 | −0.469 |
| App | h1, h2 | −0.500 | −1.000 |
| OS | body, h5, h6 | −0.094 | −0.172 |
| OS | h3, h4 | −0.453 | +0.109 |
| OS | h1, h2 | −0.500 | −1.000 |

### Recorded exceptions (distance to the nearest body line, px; data)

Measured on the opt-in column as measured / predicted. Predictions come from
the contract's recorded-exceptions table and research R3; every measurement
is within 0.03px of its prediction (Chromium's 1/64px layout snapping).

| Case | Editorial @16 / @32 | Documentation @16 / @32 | App @16 / @32 | OS @16 / @32 |
|---|---|---|---|---|
| Metric-flush h2 + p, following | 2.53 / 5.06 (2.54 / 5.08) | 3.36 / 6.75 (3.38 / 6.76) | 2.25 / 4.52 (2.27 / 4.53) | 0.42 / 0.84 (0.41 / 0.83) |
| Nested list child item | 6.55 / 13.11 (6.56 / 13.12) | 5.23 / 10.47 (5.24 / 10.48) | 5.23 / 10.47 (5.24 / 10.48) | 3.91 / 7.83 (3.92 / 7.84) |
| `hr`, following | 7.98 / 15.98 (8 / 16) | 7.98 / 15.98 (8 / 16) | 7.98 / 15.98 (8 / 16) | 7.98 / 15.98 (8 / 16) |
| `blockquote`, following | 7.97 / 15.97 (8 / 16) | 3.97 / 7.97 (4 / 8) | 3.97 / 7.97 (4 / 8) | 3.97 / 7.97 (4 / 8) |

Wrapped non-qualifying headings, following paragraph at two / three lines,
@16px (the @32px values are twice these within 0.04px):

| Tier | Roles | 2 lines | 3 lines |
|---|---|---:|---:|
| Editorial | h3, h4 | 7.98 | 8.02 |
| Documentation | h3, h4 | 8.02 | 3.98 |
| Documentation | h5, h6 | 3.98 | 7.98 |
| App | h1, h2 | 8.02 | 3.98 |
| App | h3, h4 | 3.98 | 7.98 |
| OS | h1, h2 | 7.98 | 0.02 (back in phase) |

No exception outside the contract table was observed. The full console
output is kept at `tmp/026-review/body-line-records.md` (not committed).

## T019–T020 – docs

`README.md` gains a “Body-line rhythm (provisional opt-in)” subsection under
the theme model with an example; `docs/architecture.md` gains an opt-in note
in the container-owned rhythm section; `AGENTS.md` gains the research D6
scoped-exception bullet without changing the invariant wording. The note
lands on the feature branch before merge rather than in the T008 commit.

## T021 – gates

Run 2026-09-30 at `729395d`:

- `npm test`: green. `test:build` 26,741 checks (26,686 before, plus 52
  demo, 1 selector hygiene and 2 markup-scope matches from the README
  example); `test:components` 332 surface verifications, 5,410 checks,
  0 failures; `test:behavior` passed with the new family appended.
- `npm run qa:components`: green. 86 pages captured to
  `tmp/screenshots/components/`, then 332 verifications, 5,410 checks,
  0 failures. The new route is a spec page, not in the component capture
  catalog (`scripts/component-demo-shared.ts`), so no capture was added and
  no existing capture was rebaselined.

Review screenshots for T022 (light, full page, 1440 px wide, DPR 1):
`tmp/026-review/body-line-rhythm-{editorial,documentation,app,os}-light.png`.
The fixed page chrome appears mid-page in full-page captures.

## Review corrections

Implementation review verdict: ready with corrections (1 × P1, 3 × P2,
5 × P3). All nine findings are resolved.

| Finding | Resolution | Commit |
|---|---|---|
| 1 (P1) loose-item rule broke nested non-opted themes | Rule 6 reads `--bf-body-loose-item-start`/`-end`; the opted root and class blocks set `0rem`, the nested reset restores `var(--bf-body-nudge-start)` and `var(--bf-body-margin-bottom)`. Nested tight and loose lists added inside a non-opted theme in an opted host; text offset, dot offset and item advance equal the current column. Contract rule 6 and the static assertion updated | `57d158d` |
| 2 (P2) `requireBodyLineRhythm` public | `@internal` plus `stripInternal`; `dist/build.d.ts` no longer declares it and is the only changed declaration file. Contract failure handling, research T4 and plan amended: custom surfaces get rhythm data when computable, otherwise no section | `be239ef` |
| 3 (P2) rendered checks shared the formula under test | Opted matrix `probe − flowTop` and wrapped line 1 `probe − elementTop` must sit within `root / 16` of a whole step read from computed `line-height` | `900f8c8` |
| 4 (P2) ledger showed 1.999rem | Occupied column rounded to 2 decimals; every tier now reads whole values (for example OS opt-in `p` 2rem, Documentation opt-in `h2` 3.75rem, current 2.75rem, OS current body 1.25rem) | `d73ad36` |
| 5 (P3) live-state docs stale | `AGENT-INBOX.md` (this worktree) and `docs/specs.md`: “T001–T021 done; T022–T023 open (owner review)” | `834648c` |
| 6 (P3) README wording | “their direct paragraphs”, plus one line on custom themes | `834648c` |
| 7 (P3) direct bundles unrendered | Spot check through `dist/tiers/{documentation,app,os}/styles.css`: `h1` padding equals nudge + phase, margin equals closure, `h1` to `p` advance is whole rendered body lines | `900f8c8` |
| 8 (P3) F* rounding | `F* = bU · ceil(b / bU − 1e-9)`, the line `calculateNudgeRem` targets; contract and research T1 updated. All 24 CSS/JSON artifacts byte-identical before and after | `3800560` |
| 9 (P3) loose dot unasserted | Opted loose-item dot offset from the item top equals the tight item's | `57d158d` |

The new nested-list check was run against the pre-fix `dist/` before the
rebuild and failed as expected: “editorial at a 16px root nested non-opted
loose item 1 text to equal the current column; nested 23.546875px, current
30.09375px”.

### Finding 3 mutation evidence

A temporary edit to `src/body-line-rhythm.ts` moved F* one bU down for `h3`
(drift check bypassed for `h3`), so phase gained one bU mod step and the
closure was recomputed; `computeBodyLineRhythm` fed both the build and the
test expectations. `npm run build:theme` then emitted Documentation
`--bf-h3-phase-start: 1rem` and `--bf-h3-closure-end: 0.53083rem`
(correct: 0.75rem and 0.78083rem).

- New rendered family: failed with “Expected editorial at a 16px root opted
  matrix h3 (h3), from the flow top, first baseline within 1px of a whole
  24px body line; off by 7.453125px.”
- Rendered family at `5898bae` (before the corrections), same build: passed.

The edit was reverted (no diff in `src/`), the theme rebuilt, Documentation
`h3` read 0.75rem and 0.78083rem again, and the family passed. Scratch
runners are in `tmp/026-fix/` (not committed).

### Gates after the corrections

Run at `d73ad36`:

- `npm run build`: green.
- `npm test`: green. `test:build` 26,833 checks (body-line section 258 per
  built-in bundle and 177 for the experiment; demo 54; markup scope 61);
  `test:components` 332 verifications, 5,410 checks, 0 failures;
  `test:behavior` passed. Max phase residual 0.0000px; max first-baseline
  distance from a whole rendered body line 0.938px at 16px (bound 1px) and
  1.844px at 32px (bound 2px).
- `npm run qa:components`: green. 86 pages captured, 332 verifications,
  5,410 checks, 0 failures.

`test:build` re-run at `834648c` (docs only): 26,833 checks.

## R6–R7 – flow text everywhere, self-spacing text blocks (2026-09-30)

Owner rulings R6 (D4 = option (c)) and R7 (default everywhere), recorded in
the spec and research D8. Wave start `6211aca`; commits `1cf47ce` (CSS and
static contracts), `6be0fa9` (rendered contracts and behaviour updates),
`47c97cd` (demo), `56fa1e4` (README and invariants), `9a239c2` (spec
package), `6c1b65f` (demo readout rounding).

### What changed

- Role rules select every `p`/`.bf-body` and `h1`–`h6`/`.bf-h1`–`.bf-h6`
  under `.bf-theme`; hgroup rules select every `hgroup`; the list block
  selects every outermost prose list (`.bf-prose :is(ul, ol)` not inside a
  prose `li`) and the item, dot and loose rules every `.bf-prose li`.
- `--bf-text-gap-scale` (0 in surface blocks, 1 in the bU block) drives the
  prose gap and the stack text join (research T13–T15).
- Component roots share the `.bf-theme.is-baseline-rhythm` block.

### Component-root reset list

Derived by `bodyLineComponentRootClasses` in `src/css.ts` from the CSS that
`generateFoundryCss` emits after the section (component modules, grid and
app preset CSS): every `.bf-*` class, minus `BODY_LINE_FLOW_CLASS`, sorted.
356 classes in all eight bundles (the app preset adds no class the
components lack). Flow classes: theme, tier and surface roots; text roles
and `bf-text-link`; `bf-engine-cap`/`bf-engine-metrics`; layout primitives
`bf-page`, `bf-grid`, `bf-grid-item`, `bf-grid-scope`, `bf-span-*`,
`bf-stack`, `bf-cluster`, `bf-section`, `bf-prose`, `bf-strip`, `bf-measure`,
`bf-fixed-width`, `bf-inline-size`, `bf-stage-shell`, `bf-token-row`; page
shells `bf-page-shell`, `bf-application`, `bf-main`, `bf-site-main`,
`bf-docs-layout`, `bf-docs-layout-content`. The section is 22.3KB of a
391KB tier bundle, most of it the root list.

Static checks (`npm run test:build`, “Body-line rhythm section” and “markup
scope”): the block's selector equals `:where(.bf-theme.is-baseline-rhythm,
.<roots>)`; the roots derived from `dist` equal the roots derived from a
no-rhythm source generation; no root is a flow class or the cap engine; every
`bf-*` class and every text element inside a component in the 91 sources (89
component pages, the pattern index and the README examples) has itself or an
ancestor in the list. Eight
classes are unstyled hooks (for example `.bf-notification-title`,
`.bf-tiered-list-header-title`); each sits inside a reset root.

### Component geometry proof

- `npm run test:components`: 332 surfaces, 5,442 checks, 0 failures.
  `git diff 6211aca..HEAD -- scripts/verify-component-baselines.ts` is empty;
  the only change to the checker is CP-B's `7c68130`.
- Scratch differential (`tmp/026-r7/component-diff.ts`, not committed): every
  component demo page and tier rendered with and without the section, every
  element inside a component root compared relative to its outermost root
  (roots by size), transitions disabled. 9,844 boxes; 3 differences, all
  `.bf-top-navigation-search-overlay`, a viewport-fixed overlay whose offset
  from its root changes because page text above the root moved. No component
  box, margin, padding or gap changed.

### Changed behaviour assertions

*The `spacing-vertical.html` rows are reverted to main by F3, and the
pointer-target row is reworked by F9; see “Behaviour assertions still
differing from main” below.*

All in `scripts/verify-component-behavior.ts`, each with a one-line reason
comment. Tolerances unchanged.

| Family (page) | Before | After | Reason |
|---|---|---|---|
| `verifyNativeNumberStepper` (`spacing-vertical.html`), interface row | every component `textTop` within 0.51px of the reference `p`'s | within 0.51px of the reference's `textTop − bodyPhase` | the reference is a bare page `p`, now body-line phased; components keep bU |
| same, text-run shared height | every run except “Prose list” shares one height | every run except “Baseline reference”, “Paragraph” and “Prose list” shares one height | those three are body-line flow text |
| same, body-line runs | “Prose list” occupies two body lines | “Baseline reference”, “Paragraph” and “Prose list” each occupy two body lines | a one-line paragraph closes to two body lines in every tier |
| same, run baselines | “Prose list” normalised by `bodyPhase`, compared to the raw reference | all three body-line runs normalised by `bodyPhase`, compared to the reference's bU baseline | same |
| same, nested hosts | every nested sample (including the reference) within tolerance of the reference | every nested host within tolerance of the reference's `textTop − bodyPhase` | the nested reference is a bare page `p` |
| `verifyContainerOwnedSpacing` (`typography.html`), bare `p + p` in a default stack | `firstToSecond = stack gap + margin-bottom` | `firstToSecond = margin-bottom` (the body-line closure) | R6: the stack gap is cancelled between adjacent text blocks |
| same | `padding-top + margin-bottom = one bU` | `padding-top + line-height + margin-bottom` is a whole number of body lines | R7: page text closes to whole body lines |
| `verifyBlockDerivedInlineGeometry` (`button.html`), extended pointer targets | sampled with the demo chrome hit-testable | demo chrome `pointer-events` suspended during sampling only, restored after | taller page text moved the fixtures under the fixed demo footer, which intercepted 4 rows; not an assertion change |

The prose-list assertions from CP-B are subsumed into the rows above. No
other family changed; `verifySemanticRoleClassPrecedence` and the page-wide
bU phase contract pass unmodified.

### New rendered contracts

`scripts/behavior/body-line-rhythm-contracts.ts`: `prose-gap`, `stack`,
`section` and `component` fixtures join the opt-out-equals-main check
(max residual 0.0000px across every fixture box, line and dot, all tiers,
16px and 32px). Default: h2 → p follows the h2 occupied block and is whole
steps; one-line p → p is exactly two steps; every first baseline within
`root / 16` of a whole step; default prose gap 0, opt-out prose gap positive;
opt-out stack keeps main's gap; text ↔ component keeps the stack gap both
ways.

### Measured (px, @16px / @32px)

| Tier | p → p (prose, stack, section) | h2 → p top | opt-out stack p → p | text → component / component → text | tight / loose list | hgroup h1 → h2 / h1 → p | text after component, off step |
|---|---|---|---|---|---|---|---|
| Editorial | 47.98 / 95.98 | 71.98 / 143.98 | 55.98 / 111.98 | 24.00 / 24.00 (48 / 48) | 24 / 48 (48 / 96) | 47.98 / 24.44 (95.98 / 49.91) | 8.05 / 16.05 |
| Documentation | 39.98 / 79.98 | 59.98 / 119.98 | 47.98 / 95.98 | 23.99 / 24.00 (48 / 48) | 20 / 40 (40 / 80) | 39.98 / 19.61 (79.98 / 41.22) | 8.03 / 16.05 |
| App | 39.98 / 79.98 | 59.98 / 119.98 | 31.98 / 63.98 | 7.99 / 8.00 (16 / 16) | 20 / 40 (40 / 80) | 39.98 / 19.72 (79.98 / 40.45) | 0.03 / 0.05 |
| OS | 31.98 / 63.98 | 47.98 / 95.98 | 43.98 / 87.98 | 24.00 / 24.00 (48 / 48) | 16 / 32 (32 / 64) | 31.98 / 16.39 (63.98 / 32.81) | 7.95 / 15.95 |

p → p is identical in prose, stack and section. List deltas, dot offsets
and hgroup distances equal the CP-B values. The −0.02px on whole-line values
is Chromium's −1/64px layout drift.

### Risk: stack gaps larger than a text block

*Superseded by F4: section stacks no longer cancel (see “Adversarial review
F1–F11”).*

`tmp/026-r7/gap-clamp.ts` (not committed), three bare one-line paragraphs per
stack, p1 → p2 / p2 → p3 top advance at 16px:

| Tier | default | dense | loose | section | section-deep |
|---|---|---|---|---|---|
| Editorial | 47.98 / 47.98 | 47.98 / 47.98 | 47.98 / 47.98 | 47.98 / **64** | 47.98 / **128** |
| Documentation | 39.98 / 39.98 | 39.98 / 39.98 | 39.98 / 39.98 | 39.98 / **48** | 39.98 / **96** |
| App | 39.98 / 39.98 | 39.98 / 39.98 | 39.98 / 39.98 | 39.98 / 39.98 | 39.98 / 39.98 |
| OS | 31.98 / 31.98 | 31.98 / 31.98 | 31.98 / 31.98 | 31.98 / **48** | 31.98 / **96** |

When the gap exceeds the following text block's occupied height, the grid
track clamps at zero and the next block lands one full gap later (research
T18). Section stacks normally separate whole patterns, not bare paragraphs,
so this is recorded, not fixed; the ruled formula is kept verbatim. An owner
decision is needed if section stacks of bare text must also self-space (for
example, cancelling through `margin-block-end` of the previous block as well
as the following one, or treating section stacks as non-text containers).

### Gates

Run at `9a239c2` (the demo readout fix `6c1b65f` was re-validated with
`npm run test:build`, 28,560 checks):

- `npm run build`: green.
- `npm test`: green. `test:build` 28,560 checks (body-line section 432 per
  built-in bundle and 323 for the experiment; formulas 581; parity 70; demo
  56; markup scope 3); `test:components` 332 surfaces, 5,442 checks,
  0 failures; `test:behavior` passed.
- `npm run qa:components`: green. 86 pages captured, 332 surfaces, 5,442
  checks, 0 failures.

The Playwright Chromium revision this worktree needs (1234) had been removed
from the shared user cache by another process mid-wave; it was reinstalled
with `npm run playwright:install` before the gates.

### Screenshots (light, full page, 1440 px, DPR 1)

`tmp/026-review/default/`:
`body-line-rhythm-{editorial,documentation,app,os}-light.png`,
`typography-{editorial,documentation,app,os}-light.png`,
`patterns-index-{editorial,documentation,app,os}-light.png`. The fixed page
chrome appears mid-page in full-page captures.

### Open

- Section-stack gap clamp (above) – owner decision.
- Page shells are flow classes by judgement (research T16); if the owner
  wants application shells on bU, add them to the reset list.
- Dark-tone review (T022), T023, T031 serialization and the rest of T032.

## Adversarial review F1–F11 – fixes (2026-09-30)

Orchestrator rulings (spec, research D9), pending owner confirmation.
“Before” is the reviewer's measurement at `f175ca3` (`tmp/r67/`); “after” is
`verifyBodyLineRhythmAdjacency` and `tmp/026-fix/measure.mjs` at `4fe0ddd`,
Chromium DPR 1, 16px root, main = the same bundle with the section stripped
(AC-2 identity), each fixture in a whole-pixel slot.

| Finding | Fix | Commit |
|---|---|---|
| F1 prose gap 0 removed space after non-text children | Prose keeps main's gap; prose and stacks cancel it only between two text blocks | `4fe0ddd` |
| F2 hidden first text block pulled the next one above the stack | `:not([hidden])` on the preceding compound | `4fe0ddd` |
| F3 row text out of line with controls; masked by an assertion rewrite | `.bf-cluster > *` is a bU ledger root; main's vertical-audit assertions and demo copy restored | `4fe0ddd` |
| F4 section-stack gaps clamped | Section stacks keep their gap; static `occupied − gap ≥ 0` and rendered two-line advance per pattern modifier | `4fe0ddd` |
| F5 `blockquote`, `table`, `fieldset` text on body lines | Element roots in the bU ledger block; markup scan and element-selector check | `4fe0ddd` |
| F6 component text followed by page text lost the gap | Join excludes reset roots on both sides, from the same list | `4fe0ddd` |
| F7 prose/stack/hgroup children, `display: contents` | Per-modifier `--bf-text-join-gap` on children; `hgroup.bf-stack` gap scaled by the ledger; child containers and `display: contents` recorded | `4fe0ddd` |
| F8 no release or migration note | README “Unreleased” note; `0.3.0` floor in `docs/publishing.md`, spec FR-025 and plan | docs commit |
| F9 behaviour script hygiene | Chrome suspension via `addStyleTag`, removed in `finally`; one statement per line | `4fe0ddd` |
| F10 AGENTS bullet | Five lines; detail in `docs/architecture.md` and `docs/agent-index.md` | docs commit |
| F11 panels keep the bU ledger | README, architecture and spec open question Q2 | docs commit |

### Before and after (px, @16px)

| Case | Tier | Before | After | Main |
|---|---|---|---|---|
| Clearance after `pre`, `table`, `figure`, `.bf-card` in prose | all | 0.00 | 24.00 (App 8.00) | 24.00 (App 8.00) |
| Clearance after `hr` in prose | ed / doc / app / os | 7.00 | 31.00 / 31.00 / 15.00 / 31.00 | same |
| Clearance after `blockquote` in prose | ed / doc / app / os | 1.43 / 2.75 / 2.75 / 0.07 | 25.44 / 26.75 / 10.75 / 24.08 | same |
| Clearance after `nav.bf-breadcrumbs`, `ul.bf-list` in prose | all | 0.00 / 0.01 | 24.00 (App 8.00) | same |
| `stack > p[hidden] + p + p`, first visible top | ed / doc / os / app | −24 / −24 / −24 / −8 | 0 | 0 |
| Cluster row baselines `p` / `.bf-button` / `.bf-status-label` | doc, app | 19.23 / 15.23 / 15.23 | 15.23 / 15.23 / 15.23 | 15.23 all |
| Pattern stack p → p advance (default, extra-dense, dense, loose) | ed / doc / app / os | 47.98 / 39.98 / 39.98 / 31.98 | same, now asserted per modifier | – |
| `is-section` p → p clearance after the closure | ed / doc / app / os | clamped (p2 → p3 advance 64 / 48 / – / 48) | 64.00 / 47.99 / 15.99 / 48.00 (the gap) | same gap |
| `is-section-deep` p → p clearance | ed / doc / app / os | clamped (128 / 96 / – / 96) | 128.00 / 95.99 / 31.99 / 96.00 | same gap |
| `blockquote > p` occupied (ed), `td > p`, `fieldset > p` | all | body-line closure (54.53 / 63.97 / 103.98) | equals main | – |
| `p.bf-form-help + p` clearance | ed / doc / app / os | 1.43 / 2.75 / 2.75 / 0.07 | 25.43 / 26.75 / 10.75 / 24.07 | same |
| `hgroup.bf-stack.is-dense` h2 → p top advance | ed / doc / app / os | 55.99 / 44.00 / – / – | 47.99 / 39.99 / 39.99 / 31.99 (two lines) | – |
| `p + hgroup.bf-stack` in a dense stack | all | gap kept | joined on the closure (clearance 0) | – |
| `h1 + .bf-prose` in a stack (recorded) | ed / doc / app / os | 24 (doc 38.75 incl. closure) | 23.99 / 23.99 / 7.99 / 23.99 gap kept | – |
| Hidden or `display: contents` sibling between text blocks (recorded) | ed / doc / app / os | gap kept | 24.00 / 23.99 / 7.99 / 24.00 | – |

Every adjacency fixture under `.is-baseline-rhythm` equals main (0.1px) in
all four tiers. The demo route family is unchanged: max |opt-out − main|
0.0000px; max |default − opt-out − phase| 0.0000px; first baselines within
0.938px (16px root) and 1.844px (32px root) of a whole body line; recorded
exceptions as before (text after a component 8.05 / 8.03 / 0.03 / 7.95).

### Behaviour assertions still differing from main

`scripts/verify-component-behavior.ts` against `main`:

| Family | Difference | Reason |
|---|---|---|
| `verifyNativeNumberStepper` (`spacing-vertical.html`) | none | F3 restored main's five assertions and dropped the added `bodyLine`/`bodyPhase` fields |
| `verifyBlockDerivedInlineGeometry`, `assertExtendedPointerTarget` | page chrome `pointer-events` suspended with `page.addStyleTag` while sampling, removed in `finally`; assertion unchanged | taller page text leaves the last `button.html` icon button under the fixed footer even at maximum scroll (top 879.6px of a 960px viewport, scroll 88px), so scrolling to the centre is not enough |
| `verifySemanticRoleClassPrecedence`, direct-child prose `ul`/`ol` boundary | `margin-bottom` equals the list closure instead of `0px` | R3: the prose list is a container-owned block that carries the closure once |
| `verifyContainerOwnedSpacing`, bare `p + p` in a default stack | `firstToSecond` equals the closure instead of gap + margin-bottom | R6: the default stack is pattern-internal and cancels its gap between text blocks |
| same, occupied block | nudge + phase + line + closure is whole body lines instead of nudge + margin-bottom = one bU | R7: page text closes to whole body lines |
| `main()` | also runs `verifyBodyLineRhythm` and `verifyBodyLineRhythmAdjacency` | new families |

`scripts/verify-component-baselines.ts` is unchanged since `f175ca3`.

### Demo

The ledger, matrix, hgroup and wrapped fixtures run on BF's own prose gap,
because a page-local `gap: 0` under a text-to-text join over-cancels; the
list, rule, quote and metric-flush fixtures keep the zero-gap specimen.
Screenshots in `tmp/026-fix/shots/` (light, four tiers): the default column
joins text blocks on their closures, the opt-out column shows main's gaps,
and the console is clean.

### Gates (after the fixes)

- `npm run build`: green.
- `npm test`: green. `test:build` 29,142 checks (body-line formulas 745;
  section 478 per built-in bundle, 369 for the experiment; parity 70; demo
  57; markup scope 3); `test:components` 332 surfaces, 5,442 checks,
  0 failures; `test:behavior` passed, including the adjacency family.
- `npm run qa:components`: green. 86 pages captured, 332 surfaces, 5,442
  checks, 0 failures.

### Open owner questions

- Q1 – body-line phase after a section boundary is not guaranteed, because
  section gaps are baseline-unit tokens.
- Q2 – component panels keep the bU ledger.
- Q3 – confirm orchestrator rulings F1–F11.
