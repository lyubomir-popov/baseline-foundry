# Research: Component and Pattern Consistency

## Decision 1: Use existing stack modifiers as the abstraction

`bf-stack is-flush` already produces a near-zero visual transition between H1
and H2 while retaining each role's metric nudge and bottom compensation.
`bf-stack is-dense` supplies the tier baseline for siblings within one content
area. `bf-stack is-section-shallow` supplies the larger boundary between
complete pattern areas. A new heading-pair utility or Sass-style `@extend`
would duplicate existing semantics and introduce another drift surface.

## Decision 2: Fit search actions to the real input box

Current trailing actions use `--bf-control-box-size`, but BF inputs follow the
occupied-block model and intentionally have no target block size. Measured
input/action heights are 36.44/40px (Editorial), 21.81/36px (Documentation and
App), and 23.17/28px (OS). The action wrappers must use logical block insets or
100% of the containing input box, not the nominal control token.

## Decision 3: Compose filter headings with H5 instead of copying it

The filter section slot currently emits an H6 type declaration on semantic H5
elements, producing tier-dependent hybrids. Demo/public markup will apply the
canonical `bf-h5` role; component CSS will retain only structural reset and
color decisions. This is the native CSS composition equivalent of reuse: one
element carries both the component slot and role class.

## Decision 4: TOC hierarchy follows side navigation

TOC rows are navigation rows, so their list and item gaps are flush like side
navigation. Higher-level TOC sections retain deliberate separation; their H5,
default-color headings own the prominence that justifies a preceding rule.
Nested links express hierarchy through logical indentation, not extra vertical
space. The narrow demo wrapper is flush so its specimen label does not add an
unrelated 24px gap.

## Decision 5: Heroes split title from supporting content

At wide containers, a hero's title area occupies the left half and supporting
copy/actions occupy the right half. H1/H2 title fragments live in a flush
stack. Optional media is a following area spanning both columns. Existing
signpost and fallback variants remain source-ordered exceptions but use the
same flush/dense spacing vocabulary.

## Decision 6: Quote wrappers use the page's eight tracks

Independent 1/3 and 2/1 fractional grids do not share page keylines because
they account for different gutter counts. The wide wrapper will establish eight
tracks: signpost spans two, content spans six, and quote/citation use a six-track
subgrid spanning four/two. Header and full content therefore share exact
keylines with adjacent site sections.

## Decision 7: Blockquotes are semantic plain text

The automatic left rule, three-space indent, muted color, and expanded measure
turn every semantic blockquote into a decorative callout. Owner direction makes
the base BF prose blockquote body-sized plain text. Pattern prominence, if ever
needed, belongs to an explicit component rather than the HTML element.

## Decision 8: Catalog categories describe composition level

Individual components remain grouped by foundation, forms, data display,
navigation/disclosure, and surfaces. Bundled use-case compositions live under
Patterns; tiered list, CTA block, and equal-height row move there. Tier
references become four distinct routes so the side navigation does not imply
that OS is the only supported tier.

## Pre-implementation evidence

- Search trailing-action overflow: 4px Editorial, 14px Documentation/App, 5px
  OS in `narrow-panel`; expanded panel overlap reaches 12.68px.
- TOC list and item gaps: one baseline; outer specimen gap: 24px; headings: H6
  type and muted color.
- Pattern DOM sweep found near-zero semantic sibling gaps in content cards,
  data spotlights, divided sections, logo/media objects, notifications, CTA and
  site sections, linked logos, quote wrappers, rich lists, tab sections, empty
  states, equal heights, and sticky-footer copy groups.
- Quote-wrapper screenshot shows the 1/3 outer grid and 2/1 inner grid breaking
  shared keylines; the base blockquote rule and indent are visibly dominant.

## Second owner-review decisions

### One page-chrome baseline target

The component atlas currently contains a local checkbox in addition to the
injected top-bar switch. The injected switch targets the capture surface, so
its overlay starts after the fixed sidebar. The shared runtime will instead
target the body and make the shared content wrapper a `bf-page`; atlas-local
switches are removed.

### Explicit standalone text-link role

Raw anchors must remain inline inside prose. A public `bf-text-link` role is the
safe reusable seam for standalone anchors: inline-block plus the canonical body
nudge and trailing compensation. Pre-fix atlas measurements showed the label at
23.92px occupied height while each bare link occupied only 16px.

### Category-first navigation

One global alphabet would discard useful ownership groups. The sidebar keeps
purpose-based sections, preserves the authored Overview/chapter/tier sequence,
and sorts ordinary component/pattern/example items alphabetically within each
section. Adjacent-page links consume that rendered sequence.

### No negative-gap token family

CSS `gap` cannot be negative. Subtracting baseline multiples would also fail
for arbitrary pairs because each role has different font-metric start nudge and
end compensation. When bold and regular copy form one sentence, one paragraph
with `strong` and regular phrasing is semantically and geometrically exact.
Separate blocks use `is-extra-dense`.

### Reserve state geometry before painting state

Pre-fix sortable-table activation changes the four column widths by -5.90px,
-34.64px, +47.97px, and -7.44px because the sort pseudo-element exists only in
active states. The indicator box must exist invisibly in the `none` state.

### Borders inherit rule rhythm explicitly

The content-card divider is a footer border, not `bf-rule`. Pre-fix the first
chip starts only the border thickness (0.67px in the inspected OS state) below
it. The footer content rail must reproduce the shared `0.5rem - 1px` post-rule
inset rather than depending on element type.

## Third owner-review decisions

### Breadcrumbs replace private chrome typography

Pre-fix browser evidence on `/examples/grid/app-panels.html` shows the shared
chrome section at 12px/16px and page title at 14px/20px while the Editorial body
role is 16px/24px. The public breadcrumb component already expresses current
location and consumes the body role, so the chrome will compose it instead of
maintaining a private mini type scale.

### Page owns the only horizontal gutter

Pre-fix evidence on `/demo/spec/typographic-specimen.html` shows
`.pc-content.bf-page` contributing a 32px inset and each descendant
`.bf-fixed-width` contributing another 32px. The resulting prose starts one
gutter to the right of the page/section keyline. `bf-fixed-width` retains its
cap and centering behavior, but when it has a `bf-page` ancestor that ancestor
owns the inline inset.

### Rule semantics begin at the element selector

An unclassed `hr` is already the semantic basic rule and must not need
`.bf-prose` or `.bf-rule` to receive the system reset and compensated post-rule
rhythm. The element, class, and highlighted variants share one generated rule.

### Fixed sizes require a tight-context reason

The App preset hard-codes 14px/20px over controls and navigation even though
the tier exposes a body role. Public non-heading UI will consume body tokens;
true compact exceptions such as badge/chip internals or a missing-preview label
remain allowed only where their containing geometry requires it. The sibling
Diagram Registry uses BF breadcrumbs and button links without redefining their
type, confirming this is a producer contract rather than a downstream patch.

### Link decoration belongs to the anchor state

Generic anchors underline on hover. Components that intentionally suppress
decoration must express that decision on element-qualified anchor selectors in
both normal and interaction states. Intentional prose/text-link underlines
remain part of their distinct contract.

## Fourth owner-review evidence and decisions

### Sequence controls already have a canonical composition

Diagram Generator uses `bf-button is-base is-icon` with a nested
`bf-icon is-chevron-left|right`; it adds no local background, border, color, or
filter. BF page chrome used the same icon names but omitted `is-base`, then
recreated white paint with four hard-coded colors and `filter: invert(1)`. The
canonical public composition is sufficient in the dark chrome.

### Accordion label and panel copy are one keyline

Pre-fix Editorial browser evidence: tab label x=56px, panel paragraph x=72px,
a 16px mismatch. The tab label offset is the actual disclosure geometry
(16px icon + 16px gap = 32px); the panel used an unrelated 48px formula
(`accordionIndent + body font size + baseline`). The panel must derive its
start from the same disclosure variables as the tab.

### Metric flush is a relationship, not a negative spacing scale

With a zero-gap notification stack, the separate H6/body glyph gap is 12.66px:
1.44px H6 end compensation plus 6.56px body start nudge account for 8px of it.
A parent modifier can cancel those two adjacent metric edges and leave the
natural glyph clearance (~4.66px). It does not invent negative `gap`, change
type metrics globally, or guess a tier baseline multiple.

### Footer jump is in the site strip producer token

Pre-fix wide measurements (strip spacing / rendered footer height): Editorial
64px / 95.99px; Documentation 48px / 71.99px; App 64px / 87.99px; OS 48px /
67.99px. App grows despite sharing Documentation's 14px/20px body role. The
monotonic producer sequence is 64/48/48/32px, expressed as 8/12/12/8 baseline
units in the respective tier configs.

### Breakpoint taxonomy

Most site patterns use the shared 38.75rem and 64.75rem grid thresholds.
Intrinsic exceptions already exist for content cards (28.75rem/60rem), article
pagination (28.75rem), document navigation (20rem/40rem), and content-driven
rich lists (66ch/100ch). The default hero incorrectly waited for 64.75rem even
though its two text rails remain practical at roughly 720px. It therefore earns
a documented 45rem container threshold; the 25/75 modifier keeps its separate
38.75rem opt-in behavior.

### Panels share the active grid gutter

The current panel insets are fixed tier values (16/16/12/8px) while the active
main-grid gutter changes at viewport brackets (16/24/32px). The comparison page
needs one explainable rail, so public panel header/content/footer padding uses
the live grid-gutter variable with the configured tier inset only as fallback.

### CSS-practice and breakpoint sweep

The source/demo sweep excluded generated outputs and classified every match for
styled `data-*`, deprecated `p-*`/`ui-*`, BEM, `!important`, private icon paint,
underlines, and non-shared breakpoints.

- Public source has no styled `data-*`, deprecated public prefix, or BEM API.
  The remaining `p-*`/BEM strings are isolated comparison fixtures for the
  external framework under test; the only `!important` is injected by browser
  tests to disable page-chrome hit testing.
- Page sequence controls no longer define private colors, borders, backgrounds,
  filters, or hover paint. Public button/theme/icon contracts own all of it.
- Remaining underline declarations belong to explicit prose/link affordances
  or their interaction states. Browser contracts verify that control-like
  navigation anchors remain undecorated.
- Producer layout uses the shared 38.75rem/64.75rem/105.0625rem thresholds.
  Documented intrinsic exceptions remain content-card, pagination,
  document-navigation, rich-list, and the measured 45rem default hero split.
  Demo-only 56rem chrome wrapping and 70/72/80rem specimen framing do not alter
  public component APIs.
- The sweep exposed a direct-App scope omission: its large gutter did not match
  class-switched App. `src/css-grid.ts` now gives both entry points the same
  active 24px large gutter, which the panel-gutter comparison consumes.
- Diagram Registry remains a read-only consumer pinned to its vendored BF
  revision. It uses the canonical chevron/icon contract and adds no producer
  override for these fixes; refreshing its dependency is downstream work after
  the BF commit is selected.
