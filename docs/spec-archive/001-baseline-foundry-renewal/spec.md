# Spec 001: Baseline Foundry renewal

**Feature Branch**: `feat/001-baseline-foundry-renewal`

**Created**: 2026-08-13

**Status**: Implementation and automated QA complete; in-app-browser sign-off pending

**Input**: [`raw-request.md`](raw-request.md), the rendered-quality follow-up in
[`raw-request-visual-qa.md`](raw-request-visual-qa.md), and the Vanilla/Sites
parity direction in [`raw-request-parity.md`](raw-request-parity.md)

## Amendment: Vanilla and Sites parity closure

Owner review rejected the existing article-pagination port because its primary
previous/next layout collapses into separate rows at ordinary documentation
widths. The same review exposed a larger inventory flaw: the retired roadmap
counted only `vanilla-framework/scss/_patterns_*.scss`, so it omitted named
Sites patterns composed by Vanilla's Jinja macros and layout modules.

This amendment reopens Spec 001 on its existing matching feature branch rather
than creating a second active package over uncommitted work. It uses the latest
fetched Vanilla `main` snapshot at commit
`0add9c6d829aba0c311674d617491a032f8393b7` as ancestry evidence. The original
sibling checkout remains untouched because its locally modified `yarn.lock`
overlaps the upstream fast-forward; the clean comparison worktree is
`tmp/vanilla-main/`.

### Subspec E: strict article-pagination structure and rhythm

- **FR-036**: Paired previous and next article destinations MUST occupy the
  same row at every supported container width. Long copy may wrap within its
  half but MUST NOT force the pair into separate rows or overflow.
- **FR-037**: At ordinary widths each destination MUST retain Vanilla's equal
  50/50 share. A single previous destination MUST occupy the leading half and a
  single next destination MUST occupy the trailing half; a deliberately
  documented compact fallback may use the full row only below the proven
  Vanilla-equivalent threshold.
- **FR-038**: Link padding, icon inset, icon-to-copy separation, and
  label-to-title spacing MUST map Vanilla's `$sp-medium`, `$sp-small`,
  `$sp-xx-large`, and `$sp-x-small` values to the closest public BF baseline
  spacing tokens. Panel-density tokens MUST NOT determine this editorial
  navigation geometry.
- **FR-039**: Direction copy MUST use the active body role and destination
  titles MUST use the closest legitimate BF heading role. Link borders and
  padding MUST preserve baseline-snapped occupied geometry in all four tiers.
- **FR-040**: Previous/next modifiers, logical alignment, focus, accessible
  names, boundary states, and RTL icon direction MUST remain correct regardless
  of source order.

### Subspec F: selected Vanilla component parity

- **FR-041**: BF MUST port every owner-selected non-deprecated gap listed in
  [`contracts/vanilla-sites-parity.md`](contracts/vanilla-sites-parity.md):
  data spotlight, divided section, password reveal and composed validation,
  in-page navigation, logo section, media object, reduced navigation, the full
  notification surface, expandable/mobile-card/sortable
  tables, and table of contents.
- **FR-042**: `divider`, `heading-icon`, and `matrix` MUST remain intentionally
  unported by explicit owner decision.
- **FR-043**: Existing superseding BF contracts and upstream-deprecated
  patterns MUST remain excluded; the programme MUST NOT recreate compatibility
  aliases for them.
- **FR-044**: Ports MUST preserve the rendered layout and semantic behaviour of
  their current Vanilla reference while translating spacing, typography,
  colour, naming, and responsiveness into BF's public tokens, four tiers,
  logical properties, and element-owned rhythm.

### Subspec G: Sites and layout inventory closure

- **FR-045**: The parity inventory MUST cover current Vanilla pattern docs,
  Jinja macros, standalone bundles, and layout modules in addition to root
  `_patterns_*.scss` files.
- **FR-046**: BF MUST provide rhythm-safe equivalents for the supported Sites
  compositions selected in the contract: content card, empty state, basic
  section, CTA section, equal-heights composition, hero, linked-logo section,
  quote wrapper, rich horizontal list, rich vertical list, tab section, text
  spotlight, site/sticky-footer layout, and fluid breakout.
- **FR-047**: Sites ports MUST be small composable BF structures. They MUST NOT
  import Jinja APIs, global row/column compatibility classes, page-specific
  chroma, or container rules that erase child-owned semantic spacing.
- **FR-048**: Already-covered Sites compositions such as CTA block and tiered
  list MUST be verified and extended only for a concrete missing state; they
  MUST NOT be duplicated under parallel APIs.

### Subspec H: disciplined parallel delivery

- **FR-049**: Every port MUST have an isolated BF-only demo, static contract
  assertions, relevant browser behaviour, baseline and overflow checks, and
  current-source evidence recorded in this package.
- **FR-050**: Sol agents own invariant-heavy architecture, interactive table,
  navigation, and integration work; Terra agents own bounded CSS composition
  families; Luna agents own mechanical inventory, catalog, fixture, and
  coverage work. Parallel tasks MUST be partitioned by file ownership and
  integrated centrally.
- **FR-051**: Integrated-browser Playwright review MUST cover desktop,
  constrained width, all four tiers, focus/keyboard paths, console output, RTL
  where directional, long content, and overflow before any family closes.
- **FR-052**: The demo information architecture MUST expose a dedicated
  Vanilla/Sites Pattern Atlas, distinct from the Component Atlas. It MUST group
  selected root-pattern ports, Sites compositions, recipes, and layouts; retain
  links to their isolated QA routes; and make the intentional no-port,
  superseded, and upstream-deprecated dispositions visible without presenting
  excluded patterns as demos.

### Amendment success criteria

- **SC-013**: Article-pagination geometry reports one row, two equal logical
  halves, zero overflow, and baseline-snapped occupied blocks from 19rem through
  the widest demo state in every tier.
- **SC-014**: Computed article-pagination spacing resolves only to the documented
  BF equivalents of Vanilla's 4px, 8px, 16px, and 40px relationships.
- **SC-015**: The durable parity contract accounts for all 66 current root SCSS
  patterns, the selected named Sites compositions, relevant standalone-only
  patterns, and non-deprecated layout modules without reviving excluded rows.
- **SC-016**: Every selected port has a reviewable atlas route and passes its
  independently runnable static, behavioural, baseline, and overflow checks.
- **SC-017**: Final `npm test` and `npm run qa:components` pass with all four
  tiers represented and no missing coverage.
- **SC-018**: A reviewer can reach every selected Vanilla/Sites pattern from
  `/demo/patterns/index.html`, while `/demo/components/index.html` remains a
  catalog of BF foundations and reusable component primitives rather than the
  sole discoverability surface for composed patterns and layouts.

## Amendment: rendered component quality hardening

The first downstream adoption proved that static contracts and green geometry
checks were insufficient evidence for visual quality. The owner identified
three concrete rendered defects in the newly upstreamed components:

1. Article-pagination arrow/text alignment and spacing do not match BF's
   established button-with-icon relationship.
2. `bf-top-navigation-row` introduces vertical padding that displaces the
   component boundary and leaves an unwanted line below active highlights.
3. The canonical-tagged brand treatment is visually broken in Diagram
   Registry: the tag must be Ubuntu orange, attach to the top edge, remain
   intrinsically flexible, and extend only far enough for the Circle of Friends
   mark to align optically with the adjacent wordmark.
4. Diagram Registry tiered-list heading dividers have disappeared and must be
   compared against the previous committed rendering in an isolated worktree.

This amendment makes rendered Playwright evidence—not source inspection or
token presence—the acceptance authority for these surfaces.

### Subspec A: article-pagination icon relationship

- **FR-024**: Article-pagination directional icons MUST use BF's public default
  icon-size token. Their icon/text distance MUST map current Vanilla's
  `$sp-medium` relationship to the closest BF spacing token rather than inherit
  button-specific geometry or recreate it with a component-specific multiple.
- **FR-025**: Previous and next icons MUST align optically with the direction
  label at all built-in tiers and retain logical RTL direction.
- **FR-026**: Paired, boundary, long-title, narrow, focus, and RTL states MUST
  remain overflow-free and expose accessible names without decorative glyphs.

### Subspec B: top-navigation row geometry

- **FR-027**: `bf-top-navigation-row` MUST add no vertical padding. Its block
  boundary and active/highlight boundary MUST meet without a residual strip or
  displaced bottom rule.
- **FR-028**: Removing row padding MUST preserve target sizing, horizontal
  alignment, mobile menu behaviour, and all four tier surfaces.

### Subspec C: tagged brand/logo geometry

- **FR-029**: The canonical tag MUST use the published Ubuntu-orange colour
  token, not the former light-teal treatment.
- **FR-030**: The orange tag MUST attach to the navigation's top edge, size
  intrinsically with its content, and extend only as far as required for the
  Circle of Friends mark to align optically with the adjacent brand text.
- **FR-031**: The logo/mark MUST remain intact and proportionate in the actual
  Diagram Registry consumer at desktop and mobile widths; no fixed crop,
  compressed mark, detached colour block, or accidental whitespace is allowed.
- **FR-031a**: The canonical tag MUST retain its established 38px-by-22px
  geometry (about 1.73 block-to-inline), with a 16px square mark box, a fixed
  6px mark-to-tag-bottom inset, and a top edge attached to the navigation. The
  mark aligns with the first title line rather than the tag centre and applies
  the Circle of Friends source-bound optical correction.

### Subspec D: rendered verification

- **FR-032**: Playwright checks MUST compare representative button-with-icon and
  article-pagination computed icon size/gap/alignment, and top-navigation row,
  tag, logo, highlight, and boundary rectangles.
- **FR-033**: Before/after screenshots MUST be inspected on the dedicated BF
  component pages and the real Diagram Registry consumer at desktop and mobile
  widths.
- **FR-034**: Closeout MUST include console, overflow, focus, accessibility,
  and RTL checks; a green build alone cannot satisfy this amendment.
- **FR-035**: Tiered-list headings MUST retain their intended leading divider
  at supported widths. Verification MUST compare matched current and `HEAD^`
  Diagram Registry renderings from separate worktrees, then retain a focused
  regression assertion for the recovered geometry.

### Amendment success criteria

- **SC-008**: Article-pagination icon size and icon-to-label distance match the
  button-with-icon contract within browser pixel quantization in every tier.
- **SC-009**: The top-navigation row reports zero computed block padding and no
  visible strip exists below the active/highlight boundary.
- **SC-010**: Diagram Registry screenshots show an Ubuntu-orange, top-attached,
  38px-by-22px tag with the 16px Circle of Friends aligned optically to the
  adjacent brand text at mobile and desktop widths. The tag stops 10px before
  the 48px occupied navigation boundary.
- **SC-011**: Dedicated Playwright regression assertions fail if any of the
  above geometry, colour, accessibility, or overflow contracts regress.
- **SC-012**: A matched Diagram Registry before/previous/after comparison shows
  tiered-list heading divider geometry restored without a Registry-local
  `bf-*` selector override.

## Problem

Baseline Foundry is a capable but stale design-system repository. Diagram
Registry exposes reusable gaps that currently require a vendored stylesheet
fork, direct BF selector overrides, or local compositions. The OS tier is
registered and generated but is not yet support-equivalent to editorial,
documentation, and app. Repository state is spread across large status,
roadmap, history, and TODO documents that duplicate or obscure the executable
work.

The spacing policy is also ambiguous in the current repository. This spec
settles it: **Baseline Foundry uses element-owned semantic spacing in every
built-in tier.** A container-owned policy adopted by Pragma or the Canonical
official design system does not govern this independent internal tooling
project.

## User scenarios and testing

### User story 1: Consume BF without shadowing it (P1)

As a design-tool author, I can build Diagram Registry-style navigation,
documentation layouts, lists, tabs, media, notices, pagination, filter rows,
and editorial headings from BF primitives without copying or overriding BF
component CSS.

**Independent test**: each upstream contract has a BF-owned demo and static or
browser assertion, and its stock markup works without a consumer selector that
targets the internals of another `bf-*` component.

**Acceptance scenarios**:

1. **Given** a canonical-tagged, grid-aligned header, **when** it is rendered at
   desktop and mobile widths, **then** BF owns the brand region, tag geometry,
   navigation alignment, and responsive behavior.
2. **Given** a documentation page with side navigation, **when** its available
   inline size crosses the composition breakpoint, **then** it changes between
   drawer/full-width content and the intended navigation/content columns
   without inline grid-placement styles or a runtime wrapper.
3. **Given** tiered lists, tabs, 4:3 contained media, a notice, page boundaries,
   a filter row, or an eyebrow, **when** the stock BF contract is used, **then**
   the consumer does not need a direct BF override to obtain the specified
   layout.

---

### User story 2: Navigate documentation sequentially (P1)

As a documentation reader, I can move to the previous or next article using a
clear destination label whose accessible name remains complete at narrow
widths and works in right-to-left documents.

**Independent test**: the article-pagination demo covers paired, previous-only,
next-only, long-title, narrow-container, and RTL cases with real `rel` values
and no overflow.

**Acceptance scenarios**:

1. **Given** both neighbours, **when** the component has wide space, **then** it
   presents balanced previous and next destinations.
2. **Given** constrained space, **when** the component reflows, **then** both
   visible direction labels and destination titles remain available.
3. **Given** an RTL document, **when** the component renders, **then** logical
   alignment and arrow direction follow reading order.

---

### User story 3: Trust OS as a first-class tier (P1)

As a collaborator evaluating BF's OS surface, I can use OS through every
supported entry point and receive the same public component coverage, testing,
and documentation quality as the other built-in tiers.

**Independent test**: direct `tiers/os.css` and shared `styles.css` plus
`.bf-tier-os` expose equal public properties and representative computed
styles, and the same parity check passes for every built-in tier.

**Acceptance scenarios**:

1. **Given** any built-in tier, **when** it is selected through the shared
   class-switching bundle, **then** all typography, layout, and component tokens
   match its direct tier bundle.
2. **Given** the public package, **when** a consumer imports tier and manifest
   types or any documented tier artifact, **then** the import resolves.
3. **Given** repository docs and demos, **when** OS is described, **then** it is
   called a first-class fourth tier rather than an addendum or non-canonical
   exception.

---

### User story 4: Use one spacing ownership model (P1)

As the design-system owner, I can reason about semantic vertical rhythm using
one policy: elements own their trailing spacing and baseline compensation in
editorial, documentation, app, and OS.

**Independent test**: no tier erases text-element spacing through direct-child
resets or turns stack gaps into the primary semantic-spacing owner; all four
tiers retain metric-derived nudges and non-negative semantic spacing.

**Acceptance scenarios**:

1. **Given** substitutable text/content elements in any tier, **when** one
   element replaces another, **then** its semantic spacing travels with it.
2. **Given** `.bf-stack.bf-section`, **when** it is used outside app or inside
   app, **then** it does not impersonate a section boundary; `.bf-section`
   remains the explicit boundary primitive.

---

### User story 5: Resume the project from a lean cold start (P2)

As a future agent or maintainer, I can understand current state and execute a
feature by reading a lean invariant file, live inbox, operational index, and one
Spec Kit package, without loading a global narrative history.

**Independent test**: root `ROADMAP.md`, `STATUS.md`, and `HISTORY.md` are gone;
all live links resolve to a single owner and no active requirement is lost.

---

### User story 6: Review every delivered example (P1)

As the product owner, I can open each affected demo after automated validation
and visually judge the result at its relevant desktop, narrow, and OS-tier
states.

**Independent test**: the quickstart lists every route and state, the final QA
session opens each one, and console/overflow/accessibility probes are clean.

## Functional requirements

### Upstream component contracts

- **FR-001**: BF MUST provide tagged and grid-aligned top-navigation contracts,
  including a configurable brand-region measure, without a consumer vendoring
  or extending generated BF CSS.
- **FR-002**: BF MUST provide a responsive documentation/side-navigation page
  composition that removes manual column placement and runtime wrapper needs.
- **FR-003**: `bf-tiered-list` MUST support independently useful flush two-slot
  and triple three-slot rows, including a named role slot.
- **FR-004**: BF tabs MUST keep the active underline flush with the list rule
  without a consumer `margin-bottom: 0` override, while retaining occupied-block
  baseline alignment.
- **FR-005**: `bf-aspect` MUST support an orthogonal 4:3 ratio and contained
  media fit.
- **FR-006**: BF MUST provide a content-level notice/callout with semantic
  variants and accessible markup guidance.
- **FR-007**: BF MUST provide article previous/next pagination distinct from
  numbered pagination, with paired and boundary states, long-title wrapping,
  container-responsive reflow, logical properties, RTL, `rel`, and a labelled
  navigation landmark.
- **FR-008**: BF MUST provide safe full-bleed page chrome through a scoped body
  reset or explicit page-shell primitive, without a global unscoped reset.
- **FR-009**: BF MUST provide a compact wrapping control-row/filter composition
  that owns control bottom-alignment and compensation trimming without weakening
  standalone control invariants.
- **FR-010**: BF MUST provide an editorial eyebrow/kicker role using BF type and
  spacing tokens rather than consumer hard-coded micro-type.

### Tier and spacing contracts

- **FR-011**: `editorial`, `documentation`, `app`, and `os` MUST all use
  element-owned semantic spacing and metric-derived baseline compensation.
- **FR-012**: The app-tier zero-nudge special case, direct-child spacing erasure,
  and stack-owned semantic-gap exception MUST be removed.
- **FR-013**: Every class-switched tier MUST emit the complete component token
  set used by its direct bundle.
- **FR-014**: OS MUST be documented and tested as the fourth first-class tier.
- **FR-015**: Manifest typography spacing values and emitted CSS MUST have one
  unambiguous, validated meaning.
- **FR-016**: Font descriptors and package font-loading claims MUST be coherent;
  duplicate overlapping faces for the same asset MUST NOT be emitted.
- **FR-017**: Supported package entry points MUST expose built-in tier registry
  and surface-manifest types.
- **FR-018**: Config and artifact validation MUST derive tier coverage from the
  tier registry and reject missing, duplicate, or non-finite required fields.

### Repository and evidence contracts

- **FR-019**: The repo MUST use the Spec Kit package structure for durable
  feature intent, planning, tasks, research, and QA evidence.
- **FR-020**: Root planning/status/history narratives MUST be distilled into
  `AGENTS.md`, `AGENT-INBOX.md`, `TODO.md`, `docs/agent-index.md`,
  `docs/architecture.md`, `docs/specs.md`, and active or archived spec packages.
- **FR-021**: Existing uncommitted user edits and unrelated `tmp/` harnesses
  MUST be preserved.
- **FR-022**: Every new public contract MUST have BF-only demo markup, static
  validation, and relevant browser/baseline/behavior coverage.
- **FR-023**: The completed work MUST pass the full build, component, behavior,
  and visual QA suite before closeout.

## Edge cases

- Either article-pagination destination may be absent; absent directions are
  omitted, never disabled anchors.
- Long navigation, tiered-list, notice, and pagination copy must wrap without
  horizontal overflow.
- Side navigation may be unavailable, collapsed, drawer-based, or sticky; main
  content must never retain an empty mobile rail.
- A consumer can use a direct tier bundle or the shared class-switching bundle;
  both must resolve the same public tokens for that tier.
- Element-owned spacing must remain safe at flow boundaries through explicit
  section/boundary contracts rather than broad `:last-child` guesswork.
- New logical-direction components must work in both LTR and RTL.

## Success criteria

- **SC-001**: All ten Diagram Registry upstream candidates and Vanilla article
  pagination have shipped BF contracts and independently reviewable demos.
- **SC-002**: Shared and direct bundle parity checks pass for all four tiers,
  including representative computed component geometry.
- **SC-003**: Fresh `npm test` and `npm run qa:components` runs finish with zero
  failures, missing required surfaces, or overflows.
- **SC-004**: Browser QA covers every new/changed example at its contractually
  important widths and includes OS plus at least one other tier.
- **SC-005**: No source or demo uses a styled `data-*` selector, `ui-*` role
  class, new `p-*` dependency, `!important`, or consumer-style override as the
  implementation mechanism.
- **SC-006**: Root no longer contains `ROADMAP.md`, `STATUS.md`, or `HISTORY.md`,
  and a repository-wide link scan finds no stale references to them.
- **SC-007**: A cold-start maintainer can identify current work, governing
  principles, execution order, and last-known-green state without opening more
  than `AGENTS.md`, `AGENT-INBOX.md`, `docs/agent-index.md`, and this package.

## Assumptions and scope boundaries

- OS is promoted to the fourth first-class built-in tier; intentional density
  and type-scale differences are not parity defects.
- Diagram Registry remains a downstream consumer during this programme. Its
  product-specific checkerboard, comparison board, missing-image state,
  filters, and copy remain local.
- Updating Diagram Registry's vendored BF build and deleting its now-obsolete
  overrides is a downstream integration pass after BF closeout, not a reason to
  weaken BF acceptance criteria.
- No compatibility layer is required for the removed root narrative documents;
  Git retains chronological history.
