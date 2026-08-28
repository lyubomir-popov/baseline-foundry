import { componentPages } from "../component-demo-shared.ts";
import { parseCss, assertRuleHasDecl } from "../css-ast-helpers.ts";
import { assert } from "../validation-assert.ts";

export function validateRenewalComponentContracts(
  css: string,
  pageCatalogJs: string,
  componentAtlasHtml: string,
  patternAtlasHtml: string,
  componentDemoJs: string,
  pages: Record<string, string>,
  indexDts: string
): void {
  const ast = parseCss(css);
  const selectorFragments = [
    ".bf-top-navigation.is-grid-aligned",
    ".bf-top-navigation-logo.is-canonical-tagged",
    ".bf-panel-header.is-navigation-brand",
    ".bf-panel-footer",
    ".bf-panel-footer.is-sticky",
    ".bf-fixed-width.is-start-aligned",
    ".bf-docs-layout",
    "body.bf-theme.bf-page-shell",
    ".bf-tiered-list.is-triple",
    ".bf-tiered-list.is-flush",
    ".bf-tiered-list-item-role",
    ".bf-aspect.is-4-3",
    ".bf-aspect.is-contain",
    ".bf-notice.is-information",
    ".bf-notice.is-positive",
    ".bf-notice.is-caution",
    ".bf-notice.is-negative",
    ".bf-article-pagination",
    ".bf-article-pagination-link.is-previous",
    ".bf-article-pagination-link.is-next",
    ".bf-control-row",
    ".bf-data-spotlight",
    ".bf-data-spotlight-items",
    ".bf-data-spotlight-item",
    ".bf-data-spotlight-stat",
    ".bf-data-spotlight-headline",
    ".bf-data-spotlight-action",
    ".bf-divided-section",
    ".bf-divided-section-layout",
    ".bf-divided-section-rule",
    ".bf-divided-section-header",
    ".bf-divided-section-content",
    ".bf-divided-section-list",
    ".bf-divided-section-item",
    ".bf-basic-section",
    ".bf-basic-section-layout",
    ".bf-basic-section-rule",
    ".bf-basic-section-header",
    ".bf-basic-section-content",
    ".bf-basic-section-title-link",
    ".bf-cta-section",
    ".bf-cta-section-layout",
    ".bf-cta-section-content",
    ".bf-text-spotlight",
    ".bf-text-spotlight-layout",
    ".bf-text-spotlight-rule",
    ".bf-text-spotlight-header",
    ".bf-text-spotlight-content",
    ".bf-text-spotlight-items",
    ".bf-text-spotlight-item",
    ".bf-hero",
    ".bf-hero-layout",
    ".bf-hero-copy",
    ".bf-hero-chip",
    ".bf-hero-media",
    ".bf-hero-signpost",
    ".bf-hero-intro",
    ".bf-quote-wrapper",
    ".bf-quote-wrapper-header",
    ".bf-quote-wrapper-layout",
    ".bf-quote-wrapper-prose",
    ".bf-quote-wrapper-citation",
    ".bf-quote-wrapper-signpost",
    ".bf-quote-wrapper-media",
    ".bf-quote-wrapper-quote-row",
    ".bf-in-page-navigation",
    ".bf-in-page-navigation-nav",
    ".bf-in-page-navigation-toggle",
    ".bf-table-of-contents",
    ".bf-table-of-contents-link",
    ".bf-top-navigation.is-reduced",
    ".bf-credential",
    ".bf-password-reveal",
    ".bf-credential-validation",
    ".bf-notification",
    ".bf-notification-content",
    ".bf-notification-meta",
    ".bf-notification-close",
    ".bf-logo-section",
    ".bf-logo-section-items",
    ".bf-logo-section-item",
    ".bf-logo-section-link",
    ".bf-logo-section-logo",
    ".bf-media-object",
    ".bf-media-object-layout",
    ".bf-media-object-media",
    ".bf-media-object-content",
    ".bf-media-object-meta-list",
    ".bf-media-object-meta",
    ".bf-content-card-wrapper",
    ".bf-content-card",
    ".bf-content-card-frame",
    ".bf-content-card-media",
    ".bf-content-card-image",
    ".bf-content-card-content",
    ".bf-content-card-body",
    ".bf-content-card-title",
    ".bf-content-card-main-link",
    ".bf-content-card-description",
    ".bf-content-card-footer",
    ".bf-content-card-footer-inner",
    ".bf-content-card-resource",
    ".bf-table-scroll",
    ".bf-figure.is-light-inset",
    ".bf-table.is-sortable",
    ".bf-table-sort-button",
    ".bf-table.is-expanding",
    ".bf-table-expand-toggle",
    ".bf-table-expanding-row",
    ".bf-table-expanding-cell",
    ".bf-table-mobile-card-frame",
    ".bf-table.is-mobile-card",
    ".bf-table-card-label"
  ];
  const emittedSelectors: string[] = [];
  ast.walkRules(rule => emittedSelectors.push(rule.selector));
  for (const fragment of selectorFragments) {
    assert(emittedSelectors.some(selector => selector.includes(fragment)), `Expected generated CSS to include the renewal contract selector ${fragment}.`);
  }
  assert(css.includes(":where(.bf-theme) :where(.bf-top-navigation-row) {\n  padding-block: 0;"), "Expected the navigation layout contract to remove row-owned vertical padding.");
  assert(css.includes("background: var(--bf-color-brand);"), "Expected the tagged navigation brand block to use the Ubuntu-orange semantic token.");
  assert(css.includes("block-size: var(--bf-top-navigation-logo-tag-block-size);"), "Expected the tagged navigation block to preserve its fixed 38px tag height.");
  assert(css.includes("padding-block: 0 var(--bf-top-navigation-logo-icon-bottom-offset);"), "Expected the tagged navigation mark to preserve its fixed tag-bottom inset.");
  assert(css.includes("transform: translateX(var(--bf-top-navigation-logo-icon-optical-offset-inline));"), "Expected the Circle of Friends to compensate for its asymmetric source bounds.");
  assert(css.includes("--bf-side-navigation-icon-optical-offset-block: 0.1875rem;"), "Expected side-navigation to expose the shared 3px icon optical offset.");
  assert(css.includes("--bf-side-navigation-icon-gap: 0.625rem;"), "Expected icon-navigation to expose the shared 10px icon-to-label gap.");
  assert(css.includes("--bf-navigation-brand-title-optical-offset-block: 0rem;"), "Expected panel-aligned navigation brands to share the tagged mark's optical top without a downward offset.");
  assert(css.includes("padding-inline-start: var(--bf-panel-padding-inline);"), "Expected navigation-brand headers to share the opposing panel-content inset.");
  assert(css.includes("transform: translateY(var(--bf-navigation-brand-title-optical-offset-block));"), "Expected navigation-brand titles to consume the shared block-axis optical offset.");
  assert(css.includes("transform: translateY(var(--bf-side-navigation-icon-optical-offset-block));"), "Expected expanded icon navigation to consume the block-axis optical offset.");
  assert(css.includes("padding-inline-start: calc(var(--bf-panel-padding-inline) + 1rem + var(--bf-side-navigation-icon-gap));"), "Expected icon-navigation headings to align with the menu labels rather than the icons.");
  assert(css.includes(":where(.bf-navigation.is-collapsed) :where(.bf-side-navigation-icon) {\n  transform: none;"), "Expected collapsed application navigation to reset the expanded icon optical offset.");
  assert(!css.includes("block-size: calc(var(--bf-body-line-height) + (var(--bf-top-navigation-link-padding-block) * 2));"), "Expected tagged navigation not to stretch its tag to the full occupied row.");
  assert(!css.includes("--bf-top-navigation-brand-region"), "Expected generated tier CSS to remove the fixed top-navigation brand-region token.");
  assert(css.includes("grid-template-columns: repeat(8, minmax(0, 1fr));") && css.includes("grid-column: 1 / span 2;") && css.includes("grid-column: 3 / -1;"), "Expected grid-aligned navigation to share the eight-column page grid and begin primary navigation at column three.");
  assert(css.includes("--bf-bar-thickness: 0.1875rem;"), "Expected generated tier CSS to expose the shared rem-based 3px emphasis-bar token.");
  assert(css.includes("border-inline-start: var(--bf-bar-thickness) solid var(--bf-notice-border);") && css.includes("border-inline-start: var(--bf-bar-thickness) solid var(--bf-notification-accent);") && css.includes("border-bottom: var(--bf-bar-thickness) solid transparent;") && css.includes("block-size: var(--bf-bar-thickness);"), "Expected notices, notifications, tabs, and highlight rules to consume the shared emphasis-bar token.");
  assert(css.includes("container-name: bf-article-pagination;") && css.includes("grid-template-columns: auto minmax(0, 1fr);") && css.includes("inline-size: calc((100cqi - var(--bf-space-2)) / 2);"), "Expected article pagination to retain its named container and persistent equal-half structure.");
  assert(css.includes("column-gap: var(--bf-space-2);") && css.includes("row-gap: var(--bf-space-half);"), "Expected article pagination to map Vanilla's medium and x-small spacing to BF rhythm tokens.");
  assert(css.includes("padding-block: calc(var(--bf-space-2) + (var(--bf-baseline) / 4) - var(--bf-border-width));"), "Expected article pagination to use semantic medium padding with metric baseline compensation.");
  assert(!css.includes("padding-block: calc(var(--bf-panel-padding-block) + (var(--bf-baseline) / 4) - var(--bf-border-width));"), "Expected article pagination not to inherit panel-density padding.");
  assert(css.includes("@container bf-article-pagination (width < 28.75rem)") && css.includes("inline-size: calc(var(--bf-space-6) + var(--bf-space-1));"), "Expected article pagination to retain Vanilla's compact previous-link threshold and mapped width.");
  assert(css.includes("@container (width >= 38.75rem)") && css.includes(".bf-data-spotlight.is-three-blocks") && css.includes(".bf-divided-section.is-split-medium"), "Expected static content ports to expose their medium container-query compositions.");
  assert(css.includes("grid-row: span 5;") && css.includes("grid-template-rows: subgrid;"), "Expected data spotlight subgrids to reserve distinct rows for the highlight rule, statistic, headline, description, and action.");
  assert(css.includes("@container (width >= 64.75rem)") && css.includes(".bf-data-spotlight.is-two-blocks") && css.includes(".bf-divided-section) :where(.bf-divided-section-layout)"), "Expected static content ports to expose their large container-query compositions.");
  assert(!css.includes("bf-muted-heading"), "Expected the deprecated muted-heading port to remain absent from generated CSS.");
  assert(css.includes("container-name: bf-basic-section;") && css.includes("@container bf-basic-section (width >= 38.75rem)") && css.includes("@container bf-basic-section (width >= 64.75rem)"), "Expected basic section to establish medium and large container-query breakpoints.");
  assert(css.includes(".bf-basic-section.is-split-medium) :where(.bf-basic-section-layout)") && css.includes(".bf-basic-section:not(.is-split-medium)) :where(.bf-basic-section-layout)"), "Expected basic section 50/50 layout rules to target the layout descendant at both breakpoints.");
  assertRuleHasDecl(ast, ":where(.bf-theme) :where(.bf-basic-section-layout)", {
    "display": "grid",
    "row-gap": "0"
  }, "basic-section structural grids suppress the generic stack gap after their compensated rule");
  assert(css.includes("container-name: bf-cta-section;") && css.includes("padding-block: calc(var(--bf-section-space-deep) / 2);") && css.includes("padding-block: var(--bf-section-space-deep);"), "Expected CTA section to preserve half-deep narrow padding and full-deep wide descendant padding.");
  assert(css.includes(".bf-cta-section.is-offset) :where(.bf-cta-section-layout)") && css.includes("grid-template-columns: minmax(0, 1fr) minmax(0, 3fr);") && css.includes(".bf-cta-section.is-offset) :where(.bf-cta-section-content)"), "Expected CTA section to expose the wide 25/75 offset content rail on descendants.");
  assert(css.includes("container-name: bf-text-spotlight;") && css.includes(".bf-text-spotlight-layout) {") && css.includes("grid-template-columns: minmax(0, 1fr) minmax(0, 3fr);"), "Expected text spotlight to expose its 25/75 descendant layout.");
  assert(css.includes("container-name: bf-hero;") && css.includes("border-block-start: var(--bf-border-width) solid var(--bf-color-border-low-contrast);") && css.includes("padding-block-end: calc(var(--bf-section-space) / 2);") && css.includes("padding-block-start: calc(var(--bf-space-2) - var(--bf-border-width));"), "Expected hero to own its default entry rule while preserving Vanilla's half/full regular section exit and compact space-2 top boundary.");
  assert(css.includes(".bf-hero.is-borderless") && css.includes("border-block-start: 0;") && css.includes("padding-block-start: var(--bf-space-2);"), "Expected hero to expose a borderless opt-out without consumer CSS or a rhythm shift.");
  assert(css.includes("padding-block-end: var(--bf-section-space);") && css.includes("padding-block-start: calc(var(--bf-space-3) - var(--bf-border-width));") && css.includes("padding-block-start: var(--bf-space-3);"), "Expected hero to use the wide full section exit and space-3 top boundary without border drift.");
  assert(css.includes(".bf-hero-layout) {") && css.includes(".bf-hero.is-25-75) :where(.bf-hero-layout)") && css.includes(".bf-hero.is-75-25) :where(.bf-hero-layout)"), "Expected hero composition queries to target the layout descendant for 50/50, 25/75, and 75/25 tracks.");
  assert(css.includes(".bf-hero-lead") && css.includes(".bf-hero) > :where(.bf-hero-media.is-full:last-child)") && !css.includes(".bf-hero) > :where(.bf-hero-media.is-full:last-child) {\n  inline-size: 100%;\n  margin-block-end: 0;"), "Expected hero to expose a structural lead without a final-child semantic-margin reset.");
  assert(css.includes("@container bf-hero (width >= 38.75rem)") && css.includes("@container bf-hero (width >= 64.75rem)") && css.includes(".bf-hero.is-fallback) :where(.bf-hero-intro)"), "Expected hero to expose medium/large descendant queries and the fallback introduction rail.");
  assert(css.includes(".bf-hero-chip.bf-chip") && css.includes("column-gap: var(--bf-space-1);"), "Expected hero chip composition to map the Vanilla icon/value gap to the BF chip and space-1 tokens.");
  assert(css.includes("container-name: bf-quote-wrapper;") && css.includes("grid-template-columns: minmax(0, 1fr) minmax(0, 3fr);"), "Expected quote wrapper to preserve the 25/75 signpost/content rail.");
  assert(css.includes(".bf-quote-wrapper-quote-row)"), "Expected quote wrapper to expose a dedicated quote/citation rail.");
  assert(css.includes("@container bf-quote-wrapper (width >= 38.75rem)") && css.includes("@container bf-quote-wrapper (width >= 64.75rem)") && css.includes("grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);"), "Expected quote wrapper to retune quote/citation proportions at the large container threshold.");
  assert(!css.includes(".bf-basic-section.is-asymmetric") && !/\b(?:p|ui)-(?:basic-section|cta-section|text-spotlight)[-_]/.test(css) && !/\b(?:basic-section|cta-section|text-spotlight)(?:__|--)[a-z]/.test(css), "Expected Sites foundation CSS to reject asymmetric, legacy span, and Jinja compatibility APIs.");
  assert(!css.includes("bf-muted-heading") && !/\b(?:p|ui)-(?:hero|quote-wrapper)[-_]/.test(css) && !/\b(?:hero|quote-wrapper)(?:__|--)[a-z]/.test(css), "Expected hero and quote wrapper CSS to reject muted-heading, Jinja, and legacy span compatibility APIs.");
  assert(!css.includes(".bf-navigation-reduced"), "Expected reduced navigation to remain a modifier of bf-top-navigation rather than a standalone API.");
  assert(css.includes(".bf-password-reveal[aria-pressed='true']") && css.includes(".bf-notification[hidden]"), "Expected interactive feedback CSS to expose stateful reveal and dismissal contracts.");
  assert(css.includes("margin-block: calc(var(--bf-space-1) * -1);") && css.includes("padding-block: var(--bf-space-1);"), "Expected logo section to retain Vanilla's small negative row pull and matching wrapper compensation.");
  assert(css.includes("margin-block: calc(var(--bf-space-2) * -1);") && css.includes("padding-block: var(--bf-space-2);"), "Expected logo section to retain Vanilla's large negative row pull and matching wrapper compensation.");
  assert(css.includes("block-size: calc(var(--bf-space-8) + var(--bf-space-1));") && css.includes("block-size: calc(var(--bf-space-12) + var(--bf-space-1));"), "Expected logo section marks to use intrinsic small and large BF slot sizes.");
  assert(css.includes("grid-template-columns: auto minmax(0, 1fr);") && css.includes(".bf-media-object-layout"), "Expected media object to keep a persistent side-by-side intrinsic media/content grid.");
  assert(!css.includes("@container bf-media-object") && !css.includes("container-name: bf-media-object;"), "Expected media object not to introduce a collapsing container-query API.");
  assert(css.includes("container-name: bf-content-card;") && css.includes(".bf-content-card-wrapper") && css.includes(".bf-content-card-footer-inner"), "Expected content-card to expose its named allocation container, wrapper, and footer rail contracts.");
  assert(css.includes("@container bf-content-card (width >= 28.75rem)") && css.includes("@container bf-content-card (width >= 60rem)"), "Expected content-card to preserve intrinsic horizontal and feature reflow thresholds.");
  assert(css.includes("-webkit-line-clamp: 3;") && css.includes("-webkit-line-clamp: 2;"), "Expected content-card to retain the Vanilla title/description clamp contracts.");
  assert(!css.includes(".bf-content-card.has-image") && !css.includes(".bf-content-card.has-description"), "Expected content-card styling to use only is-* modifiers.");
  assert(!/\b(?:p|ui)-(?:content-card)[-_]/.test(css) && !/\bcontent-card(?:__|--)[a-z]/.test(css), "Expected content-card CSS to reject legacy Jinja/BEM compatibility APIs.");
  assert(!css.includes(".bf-logo-block") && !css.includes(".bf-logo-section.is-dense") && !css.includes(".has-misaligned"), "Expected generated CSS to reject deprecated logo-block, logo-density, and misaligned compatibility APIs without blocking the public stack density modifier.");
  assert(!/\[data-[^\]]+\]|\.(?:p|ui)-[a-z][a-z0-9_-]*/.test(css), "Expected generated CSS to avoid styled data-* selectors and deprecated p-/ui-* APIs.");
  assert(css.includes(".bf-table.is-sortable th[aria-sort]") && css.includes(".bf-table-sort-button:focus-visible"), "Expected sortable tables to expose semantic sort-header and keyboard-focus states.");
  assert(css.includes(".bf-table.is-expanding .bf-table-expand-toggle") && css.includes(".bf-table-expanding-row[hidden]"), "Expected expanding tables to expose controlled toggle and hidden-row states.");
  assert(css.includes(".bf-table-mobile-card-frame") && css.includes(".bf-table.is-mobile-card") && css.includes(".bf-table-card-label"), "Expected mobile-card tables to expose the responsive frame, table modifier, and generated heading-label contracts.");
  assert(!/\.bf-table[^{}]*\[data-[^\]]+\]/.test(css), "Expected interactive table CSS to keep data-* attributes as runtime/test hooks rather than styling selectors.");
  assert(indexDts.includes("export { initInteractiveFeedback, initNotificationDismissals, initPasswordReveals }"), "Expected public runtime exports to include the interactive feedback initializers.");
  assert(indexDts.includes("export { initExpandingTables, initInteractiveTables, initMobileCardTables, initSortableTables }"), "Expected public runtime exports to include the interactive table initializers.");
  assert(indexDts.includes("export { initInPageNavigations }"), "Expected public runtime exports to include the in-page navigation initializer.");
  for (const typeName of ["PasswordRevealInitOptions", "NotificationDismissInitOptions", "InteractiveFeedbackInitOptions"]) {
    assert(indexDts.includes(typeName), `Expected public type exports to include ${typeName}.`);
  }
  for (const typeName of ["ExpandingTableInitOptions", "InteractiveTablesInitOptions", "MobileCardTableInitOptions", "SortableTableInitOptions", "TableSortCompare", "TableSortContext", "TableSortDirection"]) {
    assert(indexDts.includes(typeName), `Expected public type exports to include ${typeName}.`);
  }
  assert(indexDts.includes("InPageNavigationInitOptions"), "Expected public type exports to include InPageNavigationInitOptions.");
  assert(componentDemoJs.includes("initInteractiveTables();"), "Expected component-demo.js to initialize interactive table behavior on fixture pages.");

  const registeredRoutes = new Set(componentPages.map(page => page.route));
  for (const [pageName, title, atlas] of [
    ["docs-layout", "Documentation layout", "component"],
    ["page-shell", "Page shell", "component"],
    ["article-pagination", "Article pagination", "pattern"],
    ["notice", "Notice", "component"],
    ["data-spotlight", "Data spotlight", "pattern"],
    ["divided-section", "Divided section", "pattern"],
    ["in-page-navigation", "In-page navigation", "pattern"],
    ["navigation-reduced", "Reduced navigation", "pattern"],
    ["table-of-contents", "Table of contents", "pattern"],
    ["credential-validation", "Password reveal and validation", "pattern"],
    ["notification", "Notification", "pattern"],
    ["logo-section", "Logo section", "pattern"],
    ["linked-logo-section", "Linked logo section", "pattern"],
    ["media-object", "Media object", "pattern"],
    ["content-card", "Content card", "pattern"],
    ["table-sortable", "Sortable table", "pattern"],
    ["table-expanding", "Expanding table", "pattern"],
    ["table-mobile-card", "Mobile card table", "pattern"],
    ["basic-section", "Basic section", "pattern"],
    ["cta-section", "CTA section", "pattern"],
    ["text-spotlight", "Text spotlight", "pattern"],
    ["hero", "Hero", "pattern"],
    ["quote-wrapper", "Quote wrapper", "pattern"],
    ["rich-list-horizontal", "Rich horizontal list", "pattern"],
    ["rich-list-vertical", "Rich vertical list", "pattern"],
    ["tab-section", "Tab section", "pattern"],
    ["sticky-footer", "Sticky footer layout", "pattern"],
    ["equal-heights", "Equal-heights composition", "pattern"],
    ["empty-state", "Empty state recipes", "pattern"]
  ] as const) {
    const route = `/demo/components/${pageName}.html`;
    assert(registeredRoutes.has(route), `Expected the component QA catalog to register ${route}.`);
    assert(pageCatalogJs.includes(`{ title: "${title}", href: "${route}" }`), `Expected the page catalog to register ${title}.`);
    if (atlas === "pattern") {
      assert(patternAtlasHtml.includes(`href="../components/${pageName}.html"`), `Expected the pattern atlas to link ${pageName}.html.`);
      assert(!componentAtlasHtml.includes(`href="./${pageName}.html"`), `Expected the component atlas not to duplicate pattern ${pageName}.html.`);
    } else {
      assert(componentAtlasHtml.includes(`href="./${pageName}.html"`), `Expected the component atlas to link ${pageName}.html.`);
    }
  }

  const articlePaginationHtml = pages["article-pagination"] ?? "";
  assert(articlePaginationHtml.includes('rel="prev"') && articlePaginationHtml.includes('rel="next"'), "Expected article pagination to expose prev/next relationship semantics.");
  assert(articlePaginationHtml.includes('dir="rtl"') && articlePaginationHtml.includes("article-pagination-demo-narrow"), "Expected article pagination to cover RTL and narrow-container specimens.");
  assert(articlePaginationHtml.includes("bf-article-pagination-direction") && articlePaginationHtml.includes("bf-icon is-chevron-left") && articlePaginationHtml.includes("bf-icon is-chevron-right"), "Expected article pagination to use accessible-markup decorative BF icons instead of generated text glyphs.");
  assert(articlePaginationHtml.includes("data-overflow-check"), "Expected article pagination to participate in overflow QA.");

  const docsLayoutHtml = pages["docs-layout"] ?? "";
  assert(docsLayoutHtml.includes("bf-docs-layout-navigation") && docsLayoutHtml.includes("bf-docs-layout-content"), "Expected docs layout to expose navigation and content slots.");
  assert(docsLayoutHtml.includes("data-overflow-check"), "Expected docs layout to participate in overflow QA.");

  const pageShellHtml = pages["page-shell"] ?? "";
  assert(pageShellHtml.includes('<body class="bf-theme bf-page-shell'), "Expected page shell demo to opt into the scoped body reset.");
  assert(pageShellHtml.includes('class="bf-top-navigation is-grid-aligned"'), "Expected page shell to compose the grid-aligned top navigation.");
  assert(!pageShellHtml.includes("component-shell.css"), "Expected page shell to prove BF's scoped reset without the component-shell reset.");

  const noticeHtml = pages.notice ?? "";
  assert(noticeHtml.includes("bf-notice is-information") && noticeHtml.includes("bf-notice is-negative"), "Expected notice demo to cover semantic variants.");
  assert(!noticeHtml.includes('role="alert"'), "Expected static notice specimens not to announce themselves as live alerts.");

  const aspectHtml = pages.aspect ?? "";
  assert(aspectHtml.includes('class="bf-aspect is-4-3"') && aspectHtml.includes('class="bf-aspect is-4-3 is-contain"'), "Expected aspect demo to prove orthogonal 4:3 and contain modifiers.");
  assert(aspectHtml.match(/src="\.\.\/assets\/aspect-wide\.svg"/g)?.length === 2, "Expected cover and contain specimens to use the same media asset.");

  const tieredListHtml = pages["tiered-list"] ?? "";
  assert(tieredListHtml.includes("bf-tiered-list is-flush") && tieredListHtml.includes("bf-tiered-list is-triple"), "Expected tiered-list demo to cover flush and triple layouts.");
  assert(tieredListHtml.includes("bf-tiered-list-item-role"), "Expected tiered-list demo to cover the role slot.");
  assert(!tieredListHtml.includes("bf-tiered-list bf-stack"), "Expected tiered-list patterns to own their internal rhythm without a stack utility.");
  assert(!tieredListHtml.includes("bf-tiered-list-items bf-stack"), "Expected tiered-list items to own their internal rhythm without a stack utility.");
  assert((tieredListHtml.match(/<hr class="bf-rule is-muted" data-baseline-check="flow">/g) ?? []).length >= 4, "Expected compact tiered-list demo rows to render and baseline-check their direct-child divider contract.");
  assert(css.includes(":where(.bf-theme) :where(.bf-tiered-list-items) {\n  display: grid;\n  gap: var(--bf-section-space-shallow);"), "Expected tiered-list items to own the shallow pattern gap.");
  assert(css.includes(".bf-tiered-list:not(.is-list-full-width):not(.is-flush):not(.is-triple)"), "Expected hanging-indent tiered-list geometry to exclude the independent flush and triple variants.");

  const searchAndFilterHtml = pages["search-and-filter"] ?? "";
  assert(searchAndFilterHtml.includes('class="bf-control-row"') && searchAndFilterHtml.includes("data-overflow-check"), "Expected the search/filter demo to cover the overflow-safe control row.");

  const dataSpotlightHtml = pages["data-spotlight"] ?? "";
  assert(dataSpotlightHtml.includes("data-component-capture") && dataSpotlightHtml.includes("data-baseline-check") && dataSpotlightHtml.includes("data-overflow-check"), "Expected data spotlight to expose capture, baseline, and overflow fixture markers.");
  assert(dataSpotlightHtml.includes("bf-data-spotlight is-two-blocks") && dataSpotlightHtml.includes("bf-data-spotlight is-three-blocks") && dataSpotlightHtml.includes("bf-data-spotlight is-four-blocks"), "Expected data spotlight to cover all three block-count modifiers.");
  assert((dataSpotlightHtml.match(/bf-data-spotlight-rule bf-rule is-highlighted/g) ?? []).length === 9, "Expected every data spotlight item to expose its required shared-thickness highlight rule.");
  assert(!dataSpotlightHtml.includes("muted-heading"), "Expected data spotlight not to introduce the deprecated muted-heading port.");

  const dividedSectionHtml = pages["divided-section"] ?? "";
  assert(dividedSectionHtml.includes("data-component-capture") && dividedSectionHtml.includes("data-baseline-check") && dividedSectionHtml.includes("data-overflow-check"), "Expected divided section to expose capture, baseline, and overflow fixture markers.");
  assert(dividedSectionHtml.includes("bf-divided-section-layout") && dividedSectionHtml.includes("bf-divided-section-rule") && dividedSectionHtml.includes("bf-divided-section-list"), "Expected divided section to cover its layout, rule, and list slots.");
  assert(!dividedSectionHtml.includes("muted-heading"), "Expected divided section not to introduce the deprecated muted-heading port.");

  for (const [pageName, requiredClass] of [
    ["basic-section", "bf-basic-section"],
    ["cta-section", "bf-cta-section"],
    ["text-spotlight", "bf-text-spotlight"]
  ] as const) {
    const pageHtml = pages[pageName] ?? "";
    assert(pageHtml.includes("data-component-capture") && pageHtml.includes("data-baseline-check") && pageHtml.includes("data-overflow-check"), `Expected ${pageName} to expose capture, baseline, and overflow fixture markers.`);
    assert(pageHtml.includes(`class="${requiredClass}`), `Expected ${pageName} to exercise ${requiredClass}.`);
    assert(!pageHtml.includes("is-asymmetric") && !/\b(?:p|ui)-(?:basic-section|cta-section|text-spotlight)[-_]/.test(pageHtml) && !/\b(?:basic-section|cta-section|text-spotlight)(?:__|--)[a-z]/.test(pageHtml), `Expected ${pageName} markup to avoid legacy span and Jinja compatibility APIs.`);
  }
  const basicSectionHtml = pages["basic-section"] ?? "";
  assert(basicSectionHtml.includes("bf-basic-section-layout") && basicSectionHtml.includes("is-split-medium") && basicSectionHtml.includes('class="bf-h5"') && basicSectionHtml.includes("bf-basic-section-title-link") && basicSectionHtml.includes('class="bf-stack is-flush"'), "Expected basic section to cover its layout, medium split, H5 role, linked title, and flush-stack contracts.");
  assert(!basicSectionHtml.includes("bf-paragraph-stack"), "Expected the basic section to compose grouped content with the generic flush stack instead of a content-specific wrapper.");
  const ctaSectionHtml = pages["cta-section"] ?? "";
  assert(ctaSectionHtml.includes("bf-cta-section-layout") && ctaSectionHtml.includes("bf-cta-section-content") && ctaSectionHtml.includes("is-offset"), "Expected CTA section to cover full and offset descendant content slots.");
  const textSpotlightHtml = pages["text-spotlight"] ?? "";
  assert((textSpotlightHtml.match(/bf-text-spotlight-item\" data-baseline-check=\"box\"/g) ?? []).length === 3, "Expected every visible text-spotlight item to participate in baseline verification.");
  assert(textSpotlightHtml.includes("bf-text-spotlight-layout") && textSpotlightHtml.includes("bf-text-spotlight-items") && textSpotlightHtml.includes("class=\"bf-h5\""), "Expected text spotlight to cover its 25/75 title rail, item list, and BF H5 title role.");

  const heroHtml = pages.hero ?? "";
  assert(heroHtml.includes("data-component-capture") && heroHtml.includes("data-baseline-check") && heroHtml.includes("data-overflow-check"), "Expected hero to expose capture, baseline, and overflow fixture markers.");
  assert(heroHtml.includes("bf-hero-layout") && heroHtml.includes("bf-hero-copy") && heroHtml.includes("bf-hero-media") && heroHtml.includes("bf-hero-chip"), "Expected hero to cover copy, media, chip, and layout slots.");
  assert(heroHtml.includes("bf-hero bf-stack") && heroHtml.includes("class=\"bf-hero-lead\"") && heroHtml.includes("bf-figure bf-hero-media is-full is-light-inset") && heroHtml.indexOf("class=\"bf-hero-lead\"") < heroHtml.indexOf("bf-figure bf-hero-media is-full"), "Expected hero to cover a stacked lead followed by light-inset closing media inside the pattern.");
  assert(heroHtml.includes("is-25-75") && heroHtml.includes("is-75-25") && heroHtml.includes("is-fallback") && heroHtml.includes("is-split-medium") && heroHtml.includes("is-borderless"), "Expected hero to cover 50/50, 25/75, 75/25, fallback, and borderless compositions.");
  assert(heroHtml.includes('dir="rtl"') && heroHtml.includes("long copy") && heroHtml.includes("<figure"), "Expected hero to cover RTL, long-copy, and image fixtures.");
  assert(!/class="[^"]*\b(?:p|ui)-[a-z][a-z0-9_-]*/.test(heroHtml) && !/\b(?:hero)(?:__|--)[a-z]/.test(heroHtml), "Expected hero markup to avoid Jinja and legacy span APIs.");

  const quoteWrapperHtml = pages["quote-wrapper"] ?? "";
  assert(quoteWrapperHtml.includes("data-component-capture") && quoteWrapperHtml.includes("data-baseline-check") && quoteWrapperHtml.includes("data-overflow-check"), "Expected quote wrapper to expose capture, baseline, and overflow fixture markers.");
  assert(quoteWrapperHtml.includes("bf-quote-wrapper-layout") && quoteWrapperHtml.includes("bf-quote-wrapper-quote-row") && quoteWrapperHtml.includes("bf-quote-wrapper-citation") && quoteWrapperHtml.includes("bf-quote-wrapper-signpost") && quoteWrapperHtml.includes("bf-quote-wrapper-media"), "Expected quote wrapper to cover its 25/75, quote, citation, signpost, and image slots.");
  assert(quoteWrapperHtml.includes("bf-prose") && quoteWrapperHtml.includes("<blockquote") && quoteWrapperHtml.includes("class=\"bf-h5\""), "Expected quote wrapper to use a real BF prose blockquote and BF H5 heading slots.");
  assert(quoteWrapperHtml.includes('dir="rtl"') && quoteWrapperHtml.includes("long") && quoteWrapperHtml.includes("citation"), "Expected quote wrapper to cover RTL, long-copy, and citation fixtures.");
  assert(!quoteWrapperHtml.includes("muted-heading") && !/class="[^"]*\b(?:p|ui)-[a-z][a-z0-9_-]*/.test(quoteWrapperHtml) && !/\b(?:quote-wrapper)(?:__|--)[a-z]/.test(quoteWrapperHtml), "Expected quote wrapper markup to reject muted-heading, Jinja, and legacy span APIs.");

  const richHorizontalHtml = pages["rich-list-horizontal"] ?? "";
  assert(richHorizontalHtml.includes("data-component-capture") && richHorizontalHtml.includes("data-baseline-check") && richHorizontalHtml.includes("data-overflow-check"), "Expected rich horizontal list to expose capture, baseline, and overflow fixture markers.");
  assert(richHorizontalHtml.includes("bf-rich-list is-horizontal") && richHorizontalHtml.includes("bf-rich-list is-horizontal is-50-50") && richHorizontalHtml.includes("bf-rich-list-visual") && richHorizontalHtml.includes("bf-rich-list-support"), "Expected rich horizontal list to cover full and 50/50 media/support compositions.");
  assert(richHorizontalHtml.includes("bf-rich-list-list") && richHorizontalHtml.includes("is-ticked") && richHorizontalHtml.includes("is-bulleted") && richHorizontalHtml.includes("<ol") && richHorizontalHtml.includes("bf-rich-list-cta"), "Expected rich horizontal list to cover tick, bullet, ordered, ruled and CTA slots.");
  assert(css.includes("@container bf-rich-horizontal-items (width >= 66ch)") && css.includes("@container bf-rich-horizontal-items (width >= 100ch)"), "Expected rich horizontal list CSS to retain the 66ch and 100ch item-grid thresholds.");
  assert(!/class="[^"]*\b(?:p|ui)-[a-z][a-z0-9_-]*/.test(richHorizontalHtml) && !richHorizontalHtml.includes("muted-heading") && !/\brich-list(?:__|--)[a-z]/.test(richHorizontalHtml), "Expected rich horizontal list markup to reject legacy span, deprecated, and Jinja/BEM APIs.");

  const richVerticalHtml = pages["rich-list-vertical"] ?? "";
  assert(richVerticalHtml.includes("data-component-capture") && richVerticalHtml.includes("data-baseline-check") && richVerticalHtml.includes("data-overflow-check"), "Expected rich vertical list to expose capture, baseline, and overflow fixture markers.");
  assert(richVerticalHtml.includes("bf-rich-list is-vertical") && richVerticalHtml.includes("is-flipped") && richVerticalHtml.includes("is-narrow-3-2") && richVerticalHtml.includes("is-wide-2-3") && richVerticalHtml.includes("is-narrow-square") && richVerticalHtml.includes("is-wide-square"), "Expected rich vertical list to cover vertical, flipped, landscape, portrait, and square media ratios.");
  assert(richVerticalHtml.includes("is-contain") && richVerticalHtml.includes("is-video") && richVerticalHtml.includes("is-auto-height") && richVerticalHtml.includes("long copy"), "Expected rich vertical list to cover contain, video, auto-height, and long-copy pressure states.");
  assert(!/class="[^"]*\b(?:p|ui)-[a-z][a-z0-9_-]*/.test(richVerticalHtml) && !richVerticalHtml.includes("muted-heading") && !/\brich-list(?:__|--)[a-z]/.test(richVerticalHtml), "Expected rich vertical list markup to reject legacy span, deprecated, and Jinja/BEM APIs.");

  const tabSectionHtml = pages["tab-section"] ?? "";
  assert(tabSectionHtml.includes("data-component-capture") && tabSectionHtml.includes("data-baseline-check") && tabSectionHtml.includes("data-overflow-check"), "Expected tab section to expose capture, baseline, and overflow fixture markers.");
  assert(tabSectionHtml.includes("bf-tab-section") && tabSectionHtml.includes("is-50-50") && tabSectionHtml.includes("is-25-75") && tabSectionHtml.includes("is-shallow") && tabSectionHtml.includes("is-deep"), "Expected tab section to cover full, 50/50, 25/75, shallow, and deep compositions.");
  assert((tabSectionHtml.match(/bf-tab-section-rule/g) ?? []).length === 2, "Expected tab section to cover the optional rule omission state.");
  assert(tabSectionHtml.includes('role="tablist"') && tabSectionHtml.includes('role="tab"') && tabSectionHtml.includes('aria-selected="true"') && tabSectionHtml.includes('aria-hidden="false"') && tabSectionHtml.includes("bf-quote-wrapper") && tabSectionHtml.includes("bf-divided-section") && tabSectionHtml.includes("bf-basic-section") && tabSectionHtml.includes("bf-logo-section"), "Expected tab section to compose accessible tabs with BF-owned nested quote, divided, basic and logo content.");
  assert(tabSectionHtml.includes('dir="rtl"') && !/class="[^"]*\b(?:p|ui)-[a-z][a-z0-9_-]*/.test(tabSectionHtml) && !tabSectionHtml.includes("muted-heading") && !/\btab-section(?:__|--)[a-z]/.test(tabSectionHtml), "Expected tab section markup to cover RTL and reject deprecated, Jinja, and BEM APIs.");

  for (const [pageName, requiredClass] of [
    ["in-page-navigation", "bf-in-page-navigation"],
    ["navigation-reduced", "bf-top-navigation is-reduced"],
    ["table-of-contents", "bf-table-of-contents"]
  ] as const) {
    const pageHtml = pages[pageName] ?? "";
    assert(pageHtml.includes("data-component-capture"), `Expected ${pageName} to expose a component capture marker.`);
    assert(pageHtml.includes("data-baseline-check"), `Expected ${pageName} to expose baseline-check fixture markers.`);
    assert(pageHtml.includes("data-overflow-check") || pageHtml.includes("data-overflow-container"), `Expected ${pageName} to expose an overflow fixture marker.`);
    assert(pageHtml.includes(`class="${requiredClass}"`), `Expected ${pageName} to exercise ${requiredClass}.`);
  }
  assert(!((pages["navigation-reduced"] ?? "").includes("bf-navigation-reduced")), "Expected navigation-reduced.html not to invent a standalone reduced-navigation class.");
  assert(!pageCatalogJs.includes("muted-heading") && !componentAtlasHtml.includes("muted-heading"), "Expected route and atlas catalogs to omit the deprecated muted-heading port.");

  const credentialValidationHtml = pages["credential-validation"] ?? "";
  assert(credentialValidationHtml.includes('data-baseline-label="credential requirements"') && !credentialValidationHtml.includes('class="bf-credential-validation" id="credential-new-rules" aria-label="Password requirements" data-baseline-ignore'), "Expected repeated credential requirements to expose strict list and item baseline coverage.");
  assert(credentialValidationHtml.includes("data-component-capture") && credentialValidationHtml.includes("data-baseline-check") && credentialValidationHtml.includes("data-overflow-container"), "Expected credential validation to expose capture, baseline, and overflow fixture markers.");
  assert(credentialValidationHtml.includes("bf-password-reveal") && credentialValidationHtml.includes("bf-credential-validation") && credentialValidationHtml.includes("aria-controls"), "Expected credential validation to cover reveal and repeated-validation contracts.");
  assert(!/class="[^"]*\b(?:p|ui)-[a-z][a-z0-9_-]*/.test(credentialValidationHtml), "Expected credential validation markup to avoid deprecated p-/ui-* APIs.");

  const notificationHtml = pages.notification ?? "";
  assert(notificationHtml.includes("data-component-capture") && notificationHtml.includes("data-baseline-check") && notificationHtml.includes("data-overflow-container"), "Expected notification to expose capture, baseline, and overflow fixture markers.");
  assert(notificationHtml.includes("bf-notification is-information") && notificationHtml.includes("bf-notification is-positive") && notificationHtml.includes("bf-notification is-caution") && notificationHtml.includes("bf-notification is-negative"), "Expected notification to cover all severity variants.");
  assert(notificationHtml.includes("bf-notification-meta") && notificationHtml.includes("bf-notification-actions") && notificationHtml.includes("bf-notification-close"), "Expected notification to cover metadata, actions, and dismissal contracts.");
  assert(!/class="[^"]*\b(?:p|ui)-[a-z][a-z0-9_-]*/.test(notificationHtml), "Expected notification markup to avoid deprecated p-/ui-* APIs.");

  const logoSectionHtml = pages["logo-section"] ?? "";
  assert(logoSectionHtml.includes("data-component-capture") && logoSectionHtml.includes("data-baseline-check") && logoSectionHtml.includes("data-overflow-check"), "Expected logo section to expose capture, baseline, and overflow fixture markers.");
  assert(logoSectionHtml.includes("bf-logo-section-items") && logoSectionHtml.includes("bf-logo-section-item bf-logo-section-link") && logoSectionHtml.includes("bf-logo-section-logo") && logoSectionHtml.includes("bf-logo-section is-contained"), "Expected logo section to cover intrinsic links, marks, and contained-ratio fixtures.");
  assert(!/<[^>]+class="[^"]*(?:logo-block|\bis-dense\b|\bhas-misaligned\b)/.test(logoSectionHtml), "Expected logo section markup to reject deprecated logo-block, dense, and misaligned compatibility APIs.");

  const mediaObjectHtml = pages["media-object"] ?? "";
  assert((mediaObjectHtml.match(/bf-media-object-content bf-stack is-flush/g) ?? []).length === 3, "Expected every media-object content slot to contain metric compensation with the generic flush stack.");
  assert(mediaObjectHtml.includes("data-component-capture") && mediaObjectHtml.includes("data-baseline-check") && mediaObjectHtml.includes("data-overflow-check"), "Expected media object to expose capture, baseline, and overflow fixture markers.");
  assert(mediaObjectHtml.includes("bf-media-object-layout") && mediaObjectHtml.includes("bf-media-object-media") && mediaObjectHtml.includes("bf-media-object-content") && mediaObjectHtml.includes("bf-media-object-meta-list"), "Expected media object to cover persistent grid, media, content, and metadata slots.");
  assert(mediaObjectHtml.includes("bf-media-object is-media-end") && mediaObjectHtml.includes("bf-media-object is-large"), "Expected media object to cover directional and large intrinsic-size fixtures.");

  const contentCardHtml = pages["content-card"] ?? "";
  assert(contentCardHtml.includes("data-component-capture") && contentCardHtml.includes("data-baseline-check") && contentCardHtml.includes("data-overflow-check"), "Expected content-card to expose capture, baseline, and overflow fixture markers.");
  assert(contentCardHtml.includes("bf-content-card-wrapper is-cols-2") && contentCardHtml.includes("bf-content-card-wrapper is-cols-4") && contentCardHtml.includes("bf-content-card-wrapper is-cols-6") && contentCardHtml.includes("bf-content-card-wrapper is-cols-8"), "Expected content-card to cover 2/4/6/8 allocated wrapper spans.");
  assert(contentCardHtml.includes("bf-content-card is-cols-2 is-image is-description-reveal") && contentCardHtml.includes("bf-content-card is-cols-4 is-image is-description-reveal") && contentCardHtml.includes("bf-content-card is-cols-4 is-image is-image-top") && contentCardHtml.includes("bf-content-card is-cols-8 is-image is-description-reveal"), "Expected content-card to cover image, description-reveal, image-top, and feature variants.");
  assert(contentCardHtml.includes("bf-content-card-main-link") && contentCardHtml.includes("bf-content-card-author-date") && contentCardHtml.includes("bf-content-card-footer-inner") && contentCardHtml.includes("dir=\"rtl\""), "Expected content-card to cover primary actions, author metadata, footer rails, and RTL pressure.");
  assert(!/class="[^"]*\bhas-(?:image|description)[^"]*/.test(contentCardHtml) && !/class="[^"]*\b(?:p|ui)-[a-z][a-z0-9_-]*/.test(contentCardHtml) && !/\bcontent-card(?:__|--)[a-z]/.test(contentCardHtml), "Expected content-card markup to reject has-* modifiers and legacy Jinja/BEM APIs.");

  const linkedLogoSectionHtml = pages["linked-logo-section"] ?? "";
  assert(linkedLogoSectionHtml.includes("data-component-capture") && linkedLogoSectionHtml.includes("data-baseline-check") && linkedLogoSectionHtml.includes("data-overflow-container"), "Expected linked-logo section to expose capture, baseline, and overflow fixture markers.");
  assert(linkedLogoSectionHtml.includes("bf-linked-logo-section is-full") && linkedLogoSectionHtml.includes("bf-linked-logo-section is-50-50") && linkedLogoSectionHtml.includes("bf-linked-logo-section is-25-75"), "Expected linked-logo section to cover full, 50/50, and 25/75 Sites rails.");
  assert((linkedLogoSectionHtml.match(/bf-linked-logo-section-card/g) ?? []).length >= 12 && linkedLogoSectionHtml.includes("bf-linked-logo-section-mark") && linkedLogoSectionHtml.includes("viewBox=\"0 0 160 90\""), "Expected linked-logo section to cover linked cards, 16:9 mark fixtures, and accessible destination copy.");
  assert(!/class="[^\"]*\b(?:p|ui)-[a-z][a-z0-9_-]*/.test(linkedLogoSectionHtml) && !linkedLogoSectionHtml.includes("logo-block"), "Expected linked-logo section markup to avoid legacy Jinja span and logo-block APIs.");

  const stickyFooterHtml = pages["sticky-footer"] ?? "";
  assert(stickyFooterHtml.includes("data-component-capture") && stickyFooterHtml.includes("data-baseline-check") && stickyFooterHtml.includes("data-overflow-container"), "Expected sticky-footer to expose capture, baseline, and overflow fixture markers.");
  assert((stickyFooterHtml.match(/bf-page-shell is-site-layout/g) ?? []).length === 2 && (stickyFooterHtml.match(/bf-site-footer is-sticky/g) ?? []).length === 2, "Expected sticky-footer to cover both short and long opt-in site shells.");
  assert((stickyFooterHtml.match(/bf-application is-fill/g) ?? []).length === 2 && (stickyFooterHtml.match(/<main class="bf-main"/g) ?? []).length === 2 && stickyFooterHtml.includes("bf-site-main bf-panel-content"), "Expected sticky-footer to cover direct application-main nesting and the panel-content site-main composition.");
  assert(stickyFooterHtml.includes("short sticky site shell") && stickyFooterHtml.includes("long sticky site shell"), "Expected sticky-footer to distinguish short-content and long-content placement fixtures.");
  assert(!/class="[^\"]*\b(?:p|ui)-[a-z][a-z0-9_-]*/.test(stickyFooterHtml), "Expected sticky-footer markup to avoid legacy span APIs.");

  const equalHeightsHtml = pages["equal-heights"] ?? "";
  assert(equalHeightsHtml.includes("data-component-capture") && equalHeightsHtml.includes("data-baseline-check") && equalHeightsHtml.includes("data-overflow-container"), "Expected equal-heights to expose capture, baseline, and overflow fixture markers.");
  assert((equalHeightsHtml.match(/bf-equal-height-row/g) ?? []).length >= 3 && equalHeightsHtml.includes("bf-equal-height-row is-wrap") && equalHeightsHtml.includes("is-columns-3") && equalHeightsHtml.includes("is-columns-2"), "Expected equal-heights to compose the existing equal-height row with wrap, three-column, and two-column recipes.");
  assert(!equalHeightsHtml.includes("bf-equal-heights") && !equalHeightsHtml.includes("equal-heights__") && !equalHeightsHtml.includes("equal-heights--"), "Expected equal-heights to avoid inventing a duplicate component selector family.");

  const emptyStateHtml = pages["empty-state"] ?? "";
  assert(emptyStateHtml.includes("data-component-capture") && emptyStateHtml.includes("data-baseline-check") && emptyStateHtml.includes("data-overflow-container"), "Expected empty-state recipes to expose capture, baseline, and overflow fixture markers.");
  assert((emptyStateHtml.match(/data-baseline-label="(?:no content empty state|user triggered empty state|error empty state)"/g) ?? []).length === 3, "Expected empty-state to cover no-content, user-triggered, and error recipes.");
  assert(!emptyStateHtml.includes("bf-empty-state"), "Expected empty-state recipes to remain pure composition without a dedicated bf-empty-state selector.");
  assert(emptyStateHtml.includes("bf-search-box") && emptyStateHtml.includes('type="search"') && emptyStateHtml.includes("bf-button") && emptyStateHtml.includes('role="alert"') && emptyStateHtml.includes("bf-notice is-negative"), "Expected empty-state recipes to use real search, action, and negative-notice primitives.");

  const sortableTableHtml = pages["table-sortable"] ?? "";
  assert(sortableTableHtml.includes("data-component-capture") && sortableTableHtml.includes("data-baseline-check") && sortableTableHtml.includes("data-overflow-check"), "Expected sortable table to expose capture, baseline, and overflow fixture markers.");
  assert(sortableTableHtml.includes("bf-table is-sortable") && sortableTableHtml.includes("bf-table-sort-button") && sortableTableHtml.includes("aria-sort") && sortableTableHtml.includes('dir="rtl"'), "Expected sortable table to cover semantic sort controls and RTL pressure fixtures.");
  assert(!/class="[^"]*\b(?:p|ui)-[a-z][a-z0-9_-]*/.test(sortableTableHtml), "Expected sortable table markup to avoid deprecated p-/ui-* APIs.");

  const expandingTableHtml = pages["table-expanding"] ?? "";
  assert(expandingTableHtml.includes("data-component-capture") && expandingTableHtml.includes("data-baseline-check") && expandingTableHtml.includes("data-overflow-check"), "Expected expanding table to expose capture, baseline, and overflow fixture markers.");
  assert(expandingTableHtml.includes("bf-table is-expanding") && expandingTableHtml.includes("bf-table-expand-toggle") && expandingTableHtml.includes("aria-controls") && expandingTableHtml.includes("bf-table-expanding-row"), "Expected expanding table to cover controlled toggles and detail rows.");
  assert(!/class="[^"]*\b(?:p|ui)-[a-z][a-z0-9_-]*/.test(expandingTableHtml), "Expected expanding table markup to avoid deprecated p-/ui-* APIs.");

  const mobileCardTableHtml = pages["table-mobile-card"] ?? "";
  assert(mobileCardTableHtml.includes("data-component-capture") && mobileCardTableHtml.includes("data-baseline-check") && mobileCardTableHtml.includes("data-overflow-container") && mobileCardTableHtml.includes("data-overflow-check"), "Expected mobile-card table to expose capture, baseline, and overflow fixture markers.");
  assert(mobileCardTableHtml.includes("bf-table-mobile-card-frame") && mobileCardTableHtml.includes("bf-table is-mobile-card") && mobileCardTableHtml.includes('dir="rtl"'), "Expected mobile-card table to cover responsive frames, the table modifier, and RTL pressure fixtures.");
  assert(!/class="[^"]*\b(?:p|ui)-[a-z][a-z0-9_-]*/.test(mobileCardTableHtml), "Expected mobile-card table markup to avoid deprecated p-/ui-* APIs.");
}
