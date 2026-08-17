# Vanilla and Sites parity contract

**Reference snapshot**: `../vanilla-framework` fetched `origin/main` at
`0add9c6d829aba0c311674d617491a032f8393b7`; clean comparison worktree at
`tmp/vanilla-main/`.

**Inventory rule**: compare root pattern SCSS, standalone pattern bundles,
layout modules, documentation pattern routes, macros, and rendered examples.
The retired roadmap's `_patterns_*.scss` filename count is insufficient.

## Owner decisions

| Decision | Patterns |
|---|---|
| Port | Every item in the selected tables below |
| Do not port | `divider`, `heading-icon`, `matrix` |
| Keep superseded | `grid`, `grid-8`, `headings`, `pull-quotes`, `rule`, `section`, `separator`, `strip`, inline-form layout |
| Keep upstream-deprecated exclusion | `article-block`, `blog`, `newsletter-signup`, `pricing-block`, `resources-block`, `suru`, `muted-heading`, `p-button--brand`, deprecated `logo-block`, deprecated `full-width` layout |

## Complete root-SCSS reconciliation

The current snapshot contains exactly 66 `_patterns_*.scss` roots. These
disposition groups are exhaustive; their counts sum to 66.

| Disposition | Count | Root patterns |
|---|---:|---|
| Shipped BF contract or deliberate BF supersession; verification only | 41 | `accordion`, `badge`, `breadcrumbs`, `buttons`, `card`, `chip`, `code-snippet`, `contextual-menu`, `cta`, `equal-height-row`, `form-help-text`, `form-tick-elements`, `form-validation`, `forms`, `grid`, `grid-8`, `headings`, `icons`, `image`, `links`, `list-tree`, `lists`, `media-container`, `modal`, `navigation`, `pagination`, `rule`, `search-and-filter`, `search-box`, `section`, `segmented-control`, `separator`, `side-navigation`, `side-navigation-expandable`, `slider`, `status-label`, `strip`, `switch`, `table-icons`, `tabs`, `tooltips` |
| Owner-selected correction or port | 14 | `article-pagination`, `content-card`, `data-spotlight`, `divided-section`, `form-password-toggle`, `in-page-navigation`, `logo-section`, `media-object`, `navigation-reduced`, `notifications`, `table-expanding`, `table-mobile-card`, `table-of-contents`, `table-sortable` |
| Explicit owner no-port | 3 | `divider`, `heading-icon`, `matrix` |
| Upstream-deprecated permanent exclusion | 7 | `article-block`, `blog`, `muted-heading`, `newsletter-signup`, `pricing-block`, `resources-block`, `suru` |
| Intentionally superseded composition | 1 | `pull-quotes` (BF prose `blockquote`) |

`p-button--brand`, `logo-block`, and the `full-width` layout are recorded above
but are not members of the 66 root-pattern count.

## Active correction

| Vanilla evidence | BF surface | Required outcome | Owner/model | Status |
|---|---|---|---|---|
| `scss/_patterns_article-pagination.scss` and current rendered examples | `bf-article-pagination` | Same-row 50/50 pair, correct half-width boundaries, Vanilla-equivalent spacing mapped to BF tokens, BF heading/body roles, baseline-safe occupied geometry | Root/Sol | Implemented; automated QA green; in-app catalog sign-off pending |

## Selected root-pattern ports

| Vanilla source | Proposed BF contract | Required scope | Owner/model | Status |
|---|---|---|---|---|
| `_patterns_data-spotlight.scss` | `bf-data-spotlight` | Primary layout, semantic copy and responsive states | Terra | Implemented; automated QA green; in-app catalog sign-off pending |
| `_patterns_divided-section.scss` | `bf-divided-section` | Responsive divided content composition without container-owned child rhythm | Terra | Implemented; automated QA green; in-app catalog sign-off pending |
| `_patterns_form-password-toggle.scss` plus form/validation examples | password reveal composition over BF fields and validation | Accessible reveal state, help and repeated validation composition | Sol | Implemented; automated QA green; in-app catalog sign-off pending |
| `_patterns_in-page-navigation.scss` | `bf-in-page-navigation` | Section navigation, current state, long copy and narrow behaviour | Terra/root | Implemented with public runtime; automated QA green; in-app catalog sign-off pending |
| `_patterns_logo-section.scss` | `bf-logo-section` | Intrinsic logo sizing, responsive negative row-pull geometry and accessible links | Terra/root | Implemented; automated QA green; in-app catalog sign-off pending |
| `_patterns_media-object.scss` | `bf-media-object` | Persistent media/content ordering and alignment without speculative collapse | Terra/root | Implemented; automated QA green; in-app catalog sign-off pending |
| `_patterns_navigation-reduced.scss` | `bf-top-navigation.is-reduced` | Reduced layout over the existing responsive/keyboard navigation contract | Terra | Implemented; automated QA green; in-app catalog sign-off pending |
| `_patterns_notifications.scss` | full notification surface distinct from content-only `bf-notice` | Semantic variants, title/message, close, metadata, actions, inline and borderless states | Sol | Implemented; automated QA green; in-app catalog sign-off pending |
| `_patterns_table-expanding.scss` | expandable `bf-table` composition | ARIA-owned row disclosure and expanded content | Sol | Implemented; automated QA green; in-app catalog sign-off pending |
| `_patterns_table-mobile-card.scss` | mobile-card `bf-table` presentation | Responsive card reflow without losing header associations | Sol | Implemented; automated QA green; in-app catalog sign-off pending |
| `_patterns_table-of-contents.scss` | `bf-table-of-contents` | Nested links, current state and narrow layout | Terra | Implemented; automated QA green; in-app catalog sign-off pending |
| `_patterns_table-sortable.scss` | sortable `bf-table` composition | Sort affordance, stable state and keyboard/ARIA ownership | Sol | Implemented; automated QA green; in-app catalog sign-off pending |

## Sites and composed-pattern ports

These named patterns are present in current Vanilla documentation/macros but
were hidden by the old root-SCSS filename inventory. WIP status upstream does
not waive the owner's explicit parity direction; rendered examples remain
evidence, not an API compatibility mandate.

| Vanilla evidence | Proposed BF contract | Required scope | Owner/model | Status |
|---|---|---|---|---|
| `scss/_patterns_content-card.scss`, `templates/_macros/vf_card.jinja`, `templates/docs/patterns/content-card/` | `bf-content-card` | Supported spans, image/no-image, metadata, chips, vertical/horizontal reflow | Sol/root | Implemented; automated QA green; in-app catalog sign-off pending |
| Current empty-state examples | existing section, heading, copy, list, search and button primitives | Publish an isolated recipe/demo; no dedicated Vanilla selector or macro exists, so do not invent duplicate CSS | Root/Luna | Recipe verified; automated QA green; in-app catalog sign-off pending |
| `templates/docs/patterns/basic-section/` and its macro/examples | `bf-basic-section` composition | Header/content blocks and full/50-50 layouts without resetting child spacing | Terra | Implemented; automated QA green; in-app catalog sign-off pending |
| `templates/docs/patterns/cta-section/` and macro/examples | `bf-cta-section` | Full and 25/75 layouts composed from headings, copy and `bf-cta-block` | Terra/root | Implemented; automated QA green; in-app catalog sign-off pending |
| `templates/_macros/vf_equal-heights.jinja` and `templates/docs/patterns/equal-heights/` | existing `bf-equal-height-row` plus section/grid composition | Verify current responsive/equal-row coverage and add only a named recipe/demo if useful; no duplicate primitive | Root/Luna | Recipe and 2/3/4-column proportions verified; automated QA green; in-app catalog sign-off pending |
| `templates/_macros/vf_hero.jinja`, `templates/docs/patterns/hero/` | `bf-hero` | Supported 50/50, 25/75, 75/25 and fallback compositions using BF roles/CTA/media | Terra/root | Implemented; automated QA green; in-app catalog sign-off pending |
| `templates/docs/patterns/linked-logo-section/` and macro/examples | `bf-linked-logo-section` | Full, 50/50 and 25/75 linked-logo layouts composed from logo section | Terra/root | Implemented; automated QA green; in-app catalog sign-off pending |
| `templates/docs/patterns/quote-wrapper/` and macro/examples | `bf-quote-wrapper` | Heading, quote, signpost image and citation states using semantic quote markup | Terra/root | Implemented; automated QA green; in-app catalog sign-off pending |
| `templates/docs/patterns/rich-list-horizontal/` and macro/examples | `bf-rich-list.is-horizontal` | List styles, media/logo/CTA slots and full/50-50 layouts | Sol/root | Implemented; automated QA green; in-app catalog sign-off pending |
| `templates/_macros/vf_rich-vertical-list.jinja`, `templates/docs/patterns/rich-list-vertical/` | `bf-rich-list.is-vertical` | Flipped/minimal/media ratio/fit/video states and responsive composition | Sol/root | Implemented; automated QA green; in-app catalog sign-off pending |
| `templates/docs/patterns/tab-section/` and macro/examples | `bf-tab-section` | Full/50-50/25-75 layouts composed from `bf-tabs`, headings, copy and CTA | Sol/root | Implemented; automated QA green; in-app catalog sign-off pending |
| `templates/docs/patterns/text-spotlight/` and macro/examples | `bf-text-spotlight` | Two-to-seven ruled items using explicit BF heading roles | Terra/root | Implemented; automated QA green; in-app catalog sign-off pending |
| `scss/_layouts_site.scss` | site/sticky-footer extension to the existing page shell | Full-height column flow and sticky footer without global body leakage | Terra/root | Implemented; automated QA green; in-app catalog sign-off pending |
| `scss/_layouts_fluid-breakout.scss` | `bf-fluid-breakout` | Intrinsic breakout bounded by BF page/grid contracts | Sol/root | Implemented with tier-specific alignment thresholds; automated QA green; in-app catalog sign-off pending |

## Already covered and verification-only

| Vanilla/Sites composition | BF evidence | Action |
|---|---|---|
| CTA block | `bf-cta-block` | Verify current default; do not revive deprecated border aliases |
| Tiered list | `bf-tiered-list` | Compare current Sites examples; extend only for a concrete missing variant |
| Application layout | `bf-application` family | Verify layout parity; no duplicate API |
| Documentation layout | `bf-docs-layout` | Verify layout parity; no duplicate API |
| Skip link | `bf-skip-link` | Verification only |
| Table base | `bf-table` | Keep presentation complete while interactive variants remain explicit compositions |
| Navigation and mega-navigation examples | `bf-top-navigation`, `bf-side-navigation`, expandable navigation and consumer-owned runtime | Verify concrete rendered gaps before extending; the owner-selected deferred row is `navigation-reduced`, not a wholesale navigation rewrite |
| Processing-button state | Unnumbered demand-gated backlog | Do not silently promote it through this parity amendment |
| Responsive image/aspect variants | `bf-image`, `bf-figure`, `bf-aspect` including 4:3 and contain | Verify current coverage; add a variant only when a selected Sites composition proves a missing state |

## Parallel ownership boundary

- Family agents may create or edit their focused `src/css-components/<family>.ts`
  modules and matching `demo/components/<family>.html` pages.
- Root integration owns `src/css-components.ts`, `src/index.ts`, shared runtime
  entry points, `demo/page-catalog.js`, `demo/components/index.html`,
  `demo/patterns/index.html`, `scripts/component-demo-shared.ts`, and
  cross-family validation files.
- Luna fixture work starts only after a family's public markup contract is
  settled by Sol or Terra; it does not make API or spacing decisions.
- A family is not complete until integrated-browser Playwright review and the
  package's quickstart evidence are recorded.
