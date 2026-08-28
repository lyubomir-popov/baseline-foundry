# Review: Baseline Foundry renewal

**Reviewed**: 2026-08-13; reopened 2026-08-16; final automation 2026-08-21

**Disposition**: Accepted for merge on 2026-08-21 with implementation and
automated closeout complete. The explicitly requested in-app-browser catalog
sign-off was not performed because that backend remained unavailable; only
Chrome was exposed and it was not substituted.

## 2026-08-28 contract supersession

The owner accepted removal of the duplicate `bf-eyebrow` hook. Semantic `h5`
and `.bf-h5` now exclusively own that small-caps presentation. The amended
task and public contract above supersede the original Spec 001 eyebrow name;
no compatibility alias or second implementation is retained.

## 2026-08-28 browser-gate disposition

Spec 014 served the current demo and retried the explicitly requested in-app
browser. Runtime discovery again exposed Chrome only; the requested backend was
unavailable and Chrome was not substituted. The accepted 2026-08-21 owner
disposition already approved merge with implementation and automated closeout
complete. T102/T105 are therefore closed as an explicit waiver, not as a claim
that the missing visual review occurred. All automated and later ordinary
browser evidence below remains valid.

## 2026-08-21 owner closeout

The owner directed the feature branch to be wrapped up and merged before the
incoming framework defects were implemented. Fresh `npm test` and
`npm run qa:components` runs passed on commit `e500ae1`: 5,061 static
assertions, the complete baseline and behavior suites, 87 screenshots, and all
338 four-tier records were green with zero reported baseline, overflow, or
coverage failures. In-app browser selection was retried; the backend remained
unavailable and browser discovery exposed Chrome only. T102/T105 remain
unchecked as an honest record of the unperformed browser portion rather than a
claim that another browser surface was equivalent.

## 2026-08-17 final automation and adversarial-review resolution

Opus found no Critical, High, or Medium defect in the complete dirty-tree
implementation. Its notification-dismissal Low is resolved in the public
runtime: keyboard activation moves focus to the next visible notification
before hiding the controlled notification, and the behavior suite asserts that
focus destination. The artifact-hygiene Low was partly based on an incorrect
premise: `image.png` was referenced by the captured owner request, so it is now
preserved as `evidence/canonical-tag-regression.png`; only the unrelated
Chromium GPU `debug.log` was deleted.

Fresh closeout evidence after those changes:

| Gate | Result |
|---|---|
| `npm test` | Pass; build, 5,061 static assertions, all 338 four-tier records, and the complete behavior suite are green. |
| `npm run qa:components` | Pass; 87 screenshots and all 338 records report zero baseline, overflow, or coverage failures. |
| Notification focus regression | Pass; the dismissed region is hidden and focus moves to the next stable notification. |
| In-app browser | Blocked by unavailable backend. Browser discovery exposed Chrome only; it was not substituted. T102/T105 remain open. |

This review is the durable owner of the completed Opus findings. The live inbox
contains only current state and the remaining browser gate; the fulfilled
review prompt and transient full findings are not retained as operational
clutter.

## 2026-08-16 parity amendment — implementation evidence

Owner review found that article pagination stacks at an ordinary 900px demo
viewport even though current Vanilla keeps paired destinations on one row.
Playwright measured a 596.67px BF navigation stacking into two rows while the
latest clean Vanilla snapshot keeps equal same-row links at comparable 612px
and 640px widths. BF also misaligns title and direction text edges and lets
panel-density tokens determine editorial navigation padding. Phase 9 replaces
those contracts and reopens all final gates.

The corrected component now passes focused static and behaviour suites. The
four-tier browser probe covers 19rem, 28.74rem, the exact 28.75rem/460px
threshold, 29rem, 38.25rem and 42rem. Every paired state remains one row with
zero overflow and baseline-snapped link blocks; ordinary states retain equal
logical halves, narrow states retain the compact accessible previous link, and
boundary links retain their directional half. Source-order reversal, RTL icon
direction, h5/body roles, focus, complete compact accessible names and aligned
label/title text edges also pass. Integrated-browser review at 900x1000 and
304x900 confirms the rendered result across all four tiers.

Every owner-selected root, Sites-composition, standalone and layout row is now
integrated. `divider`, `heading-icon` and `matrix` remain explicit owner
no-ports; the superseded and upstream-deprecated rows remain excluded. The
clean comparison snapshot is Vanilla `origin/main`
`0add9c6d829aba0c311674d617491a032f8393b7` in `tmp/vanilla-main/`; the dirty
sibling checkout was preserved rather than pulled over.

The final rhythm pass fixed issues that behavior-only checks could not expose:
hero semantic tracks no longer stretch, rich-list auto-height media follows
Vanilla's positioned model with baseline-rounded clamps, credential/disclosure
and TOC separators retain occupied-grid compensation, and linked-logo cards
keep exact 16:9 marks while placing only their fractional residual after the
mark. Reduced navigation is emitted after its base navigation contract so the
modifier reliably removes the canonical tag.

Owner review then exposed an information-architecture gap: implemented Sites
compositions and layouts were discoverable only through a page named Component
Atlas. The demo now has a distinct Pattern Atlas at
`/demo/patterns/index.html`, grouping 14 selected Vanilla root-pattern ports,
9 Sites compositions, and 4 recipes/layouts. The Component Atlas retains BF
foundations and reusable primitives. Explicit no-port, superseded, and
upstream-deprecated rows are visible as unlinked dispositions rather than
appearing to be missing demos. Static validation enforces the 27 unique routes,
the catalog boundary, cross-links, grouping, and exclusion treatment.

## 2026-08-16 parity amendment — closeout evidence

| Gate | Result |
|---|---|
| `npm test` | Pass; build, 5,061 static assertions, 338 four-tier baseline/overflow/coverage records, and the complete behavior suite are green. |
| `npm run qa:components` | Pass; 87 screenshots and 338 records with zero baseline failures, zero overflow failures, and zero missing coverage. |
| `git diff --check` | Pass; checkout line-ending advisories only. |
| Integrated browser | Partial: corrected pagination was reviewed earlier at 900px and 304px across all four tiers. The backend later became unavailable for the complete catalog; Chrome was not substituted. |

Focused Playwright coverage includes pagination widths from 19rem through
42rem; 619/620px and 1035/1036px layout boundaries; tier-specific fluid
breakout padding transfer; Sites ratios and reflows; reduced-navigation and
TOC thresholds; credential, notification and interactive-table lifecycles;
content-card hit targets; tab keyboard state; RTL, focus, long copy, overflow
and semantic type roles. The remaining sections preserve the pre-amendment
closeout record for chronology; the parity evidence above is current.

## Pre-amendment outcome

- All ten Diagram Registry upstream candidates are implemented as BF-owned
  contracts and registered demos.
- The downstream adoption pass confirmed that flush rows also need to accept
  the established rich title/description slots; BF now maps those slots to the
  public two-column modifier without a consumer override.
- Vanilla's article-pagination pattern is ported as an intrinsic, logical,
  boundary-safe BF component with long-copy, narrow-container, RTL, and
  accessible-name coverage.
- Editorial, documentation, app, and OS are equal first-class tiers across the
  registry, direct and shared CSS, manifests, package exports, demos, and tests.
- Element-owned semantic spacing now governs every tier. Obsolete stack density
  and section modifiers were removed from the product and demos.
- Root project state now follows the lean Spec Kit operating model; the raw
  request remains preserved in `raw-request.md`.

## Pre-amendment automated evidence

| Gate | Result |
|---|---|
| `npm test` | Pass; build, 4,486 static assertions, component matrix, behavior, and direct/class geometry parity are green. |
| `npm run qa:components` | Pass; screenshots generated and 234 tier/page baseline records report zero baseline failures, zero overflow failures, and zero missing coverage. |
| Package consumer smoke | Pass; an actual `npm pack` tarball was installed into `tmp/package-smoke/consumer`, and root, `./types`, and `./presets` imports resolved. |
| Markdown relative-link scan | Pass; no stale local documentation target remains. |
| `git diff --check` | Pass; only configured LF-to-CRLF checkout notices were emitted. |

Behavior probes exercise article pagination at a 448px component width, docs
layout at 1000px and 1100px viewports, control-row composition at 1440px and
620px, tabs at 820px, scoped page-shell behavior, and direct/class component
geometry for all four tiers at 1200px.

## Pre-amendment rendered and browser review

The generated screenshot set was inspected for the new and materially changed
surfaces: article pagination, documentation layout, page shell, top navigation,
tiered list, aspect/media, notice, typography/eyebrow, tabs, and search/filter.

The live browser then visited all 64 pages exposed by the component atlas at a
2560px desktop viewport. All 64 loaded; none had document-level horizontal
overflow, broken images, console warnings, or console errors. The article
pagination accessibility tree exposes only direction and destination text, not
decorative arrows. The tier selector was switched to OS and the first-class OS
class path applied successfully.

The live server is available at
`http://127.0.0.1:4174/demo/components/index.html`. Required owner routes remain
listed in `quickstart.md`.

### Rendered-quality amendment

The owner follow-up was verified on dedicated component pages and the real
Diagram Registry consumer, not the root atlas:

- Article-pagination now uses real, `aria-hidden` BF chevrons and the same
  `--bf-icon-size-default`/`--bf-space-1` relationship as icon buttons. Across
  all four tiers the icon is 16px, the rendered gap exactly matches the button
  (8px Editorial; 4px Documentation/App/OS), and the vertical centre delta is
  0px. Narrow, focus, RTL, boundary, long-title, overflow, and accessible-name
  checks pass.
- The top-navigation row changed from 4px/4px block padding and a 4px residual
  highlight strip to 0px/0px padding and 0px residual. In Diagram Registry the
  resulting row is 48px tall, the orange tag starts at the navigation top edge,
  and the active highlight meets the bottom edge.
- The Registry tag changed from teal `rgb(112, 187, 194)` to Ubuntu orange
  `rgb(233, 84, 32)`. An owner review rejected the later full-row stretch: the
  canonical tag is restored to 22x38px inside the 48px occupied row. Its 16px
  square Circle of Friends box aligns to the first title line, retains a fixed
  6px bottom inset, sits intentionally 5px below the tag centre, and applies a
  -0.2px inline correction for asymmetric SVG whitespace. Desktop, constrained,
  and four-tier probes report no overflow.
- An isolated Diagram Registry worktree at
  `H:\WSL_dev_projects\diagram-registry-prev-f74ebd4` preserves detached
  `HEAD^` (`8505028`) for the requested tiered-list comparison. The regression
  was a compact-row selector accidentally inheriting hanging-indent columns:
  before, the divider was 160px wide on an off-edge implicit track; reference
  and fixed renderings are 1024/1024px (`grid-column: 1 / -1`). Triple rows are
  likewise 640/640px. The fix is BF-owned; Registry adds no `bf-*` override.

Matched screenshots are stored outside both repositories under
`H:\WSL_dev_projects\temp\diagram-registry-tiered-list-qa\`.

## Adversarial findings and resolution

| Finding | Resolution |
|---|---|
| Article pagination queried its own container and could collapse into half-width columns. | Replaced with intrinsic auto-fit composition; narrow destinations are full-width stacked rows. |
| Docs layout entered 2/6 mode while navigation was still a drawer. | Synchronized composition with the 64.75rem navigation transition. |
| Dead stack modifiers caused the reported crowding. | Migrated section composition to `.bf-section` and removed retired density examples/contracts. |
| Direct and class-switched control geometry diverged. | Tokenized semantic control spacing and added computed geometry parity for every tier. |
| Direct App omitted App-only component geometry. | Direct generation now includes the App preset contract. |
| Generated arrow text polluted accessible names. | Replaced generated glyphs with real `aria-hidden` BF icons and added an accessibility snapshot assertion. |
| A full-span utility required `!important`. | Reordered the utility after generated span rules. |
| Legacy BEM tooltip compatibility remained public. | Removed the selector and validation now rejects its return. |
| Demo shells overrode BF internals or stack spacing. | Removed component-internal overrides and container-owned semantic gaps. |
| New behavior lacked focused regression assertions. | Added responsive, RTL, accessibility, semantics, alignment, full-bleed, and rule-geometry probes. |
| Package evidence only imported local `dist`. | Added the isolated packed-consumer smoke test. |
| Tier switching cache-busted an unchanged stylesheet. | Removed the reload race; class switching is synchronous. |
| Hidden descendants and a dead box/flow label weakened baseline evidence. | Hidden and `aria-hidden` ancestors are excluded; the harness now reports one honest occupied-block measure including element-owned trailing spacing. |
| Duplicate App config and stale tier/font copy implied multiple owners. | Removed the duplicate config and aligned terminology and font-loading claims with the canonical registry. |

## Opus adversarial-review remediation — 2026-08-15

The recommended contract and test hardening is implemented. The tagged-logo
geometry is explicit in source and `AGENTS.md`. The 13rem brand-region
default now flows through required theme config, generated `ComponentTokens`,
direct and class-switched CSS, token JSON, public docs, and parity validation;
a browser assertion also proves a component-local 15rem override changes the
rendered rail to 240px.

The behavior suite now checks all four tiers at the material boundaries:

- article pagination at 19rem, 20rem, 21rem, and a 42rem two-column control,
  including column/row count, full-width fallback, baseline-snapped link block
  sizes, long content, and overflow;
- default, full-width, flush, and triple tiered lists at 38.74rem and 38.75rem,
  including explicit track count, rule extent/order, hanging-indent alignment,
  stacking, and overflow;
- equal-height rows at 65rem, including four-column outer bounds and both
  corresponding subgrid row edges across all columns.
- canonical tagged navigation at 22x38px with a 16px square inline-SVG or
  external-image mark, 6px bottom inset, first-line alignment, 5px tag-centre
  displacement, and the Circle of Friends source-bound correction.

The last probe exposed a confirmed product defect that the prose review had
classified only as a test gap: `.bf-equal-height-row` attempted to change its
own grid from an `@container` query, but a query container cannot query itself.
At desktop this produced two implicit tracks rather than the intended eight
logical tracks/four visible columns. The component now owns eight logical
tracks at every width, while its descendant columns validly switch between
full-, half-, and quarter-row spans from the row's container size.

Fresh closeout evidence: `npm test` passes with 4,486 static checks;
`npm run qa:components` reports 234 records, zero baseline failures, zero
overflow failures, and zero missing coverage. In-app browser review at
1440×1000, 900×1000, and 640×900 confirmed the corrected equal-height columns,
tiered-list wide/stacked rules, OS article-pagination stacking, and OS tagged
navigation desktop/mobile geometry with no document overflow or console
warnings/errors.

## Remaining boundary

No additional BF implementation spec is outstanding from this request.
Diagram Registry now consumes the refreshed generated Editorial artifact, its
pagination markup uses the public icon contract, its tiered-list dividers are
restored without local BF overrides, and its registry/freshness/JavaScript
checks pass. The only Registry validator warning is the deliberately internal
example pattern whose source revision and preview were already unresolved.

The feature branch and working changes remain local and uncommitted. The
unrelated `tmp/chevron-audit/` and `tmp/chevron-harness/` directories were
preserved.

## Health-audit reconciliation — 2026-08-15

The final project-health audit reached the same production-ready verdict and is
now distilled here rather than retained as a second root status narrative. Its
recommendations were classified against the final source:

- the generated `--bf-top-navigation-brand-region` token, component-local
  override contract, four-tier parity checks, and downstream Diagram Registry
  refresh are complete;
- `docs/agent-index.md` already owns the requested one-page operational quick
  reference;
- claims that BF lacks forms, validation, range, modal/drawer, switch, or
  segmented-control support were stale inventory errors. Future form work is
  limited to demand-backed compositions such as password reveal, not a basic
  form-system port;
- repeated statements about element-owned spacing and four-tier support remain
  intentionally scoped: the constitution governs, `AGENTS.md` supplies
  always-on invariants, architecture records technical consequences, and the
  README documents the consumer contract;
- genuinely unproven work is captured as unnumbered, evidence-gated candidates
  in `docs/specs.md`. No second package is active on this branch.

The only remaining action is Git closeout controlled by the owner: accept,
commit, merge, then archive Spec 001. It is operational state, not another
product specification.
