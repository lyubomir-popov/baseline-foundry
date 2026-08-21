# Implementation plan: Baseline Foundry renewal

**Branch**: `feat/001-baseline-foundry-renewal` | **Date**: 2026-08-13 | **Spec**: [`spec.md`](spec.md)

## Summary

Deliver the reusable gaps proven by Diagram Registry, port Vanilla's article
pagination as a modern BF documentation primitive, make OS a genuinely
first-class fourth tier, standardize all tiers on element-owned semantic
spacing, and replace stale global project narratives with a lean Spec Kit
operating model. Work is divided by source ownership so subagents can execute
independent groups without editing the same implementation files.

The active amendment reopens the package to correct article pagination against
the rendered Vanilla layout and close the owner-selected Vanilla/Sites gaps in
[`contracts/vanilla-sites-parity.md`](contracts/vanilla-sites-parity.md).
Inventory evidence now includes current pattern docs, macros, standalone
bundles, layouts, and integrated-browser comparisons—not only root SCSS names.

## Technical context

**Language/version**: TypeScript 5.8, generated CSS, HTML demos, Node-based QA.

**Primary dependencies**: existing BF generator and
`@lyubomir-popov/baseline-nudge-generator`; no new runtime dependency.

**Storage**: generated files under `dist/`; no application data.

**Testing**: `validate-build.ts`, Playwright component baseline/behavior suites,
component screenshots, browser visual and DOM probes.

**Target platform**: modern browsers consuming ESM, CSS, JSON, and package
subpath exports.

**Project type**: design-system library plus static demo site.

**Performance goals**: CSS-only contracts for these patterns; no runtime added
unless an existing navigation behavior initializer already owns it.

**Constraints**: BF-only public class vocabulary; element-owned semantic
spacing; logical properties; real font metrics; generated artifacts; preserve
unrelated dirty work; no direct edits to downstream vendored CSS.

**Scale/scope**: four built-in tiers, eleven public pattern contracts (ten audit
candidates plus article pagination), and one repository-structure migration.

## Constitution check

- **Design authority**: Pass. The user's explicit BF decision is recorded in
  the spec and constitution.
- **Element-owned rhythm**: Pass by planned app-tier migration and four-tier
  assertions.
- **Generated source of truth**: Pass. Source/config changes generate artifacts;
  `dist/` is not hand-authored.
- **Small composable API**: Pass. Proven consumer patterns are orthogonal
  modifiers/compositions; Diagram Registry product features remain local.
- **Accessibility/responsiveness**: Pass. Semantic navigation, visible labels,
  logical properties, container responsiveness, keyboard/focus, and overflow
  checks are explicit.
- **No override architecture**: Pass. Each consumer shadow becomes BF-owned
  source or remains explicitly local.
- **Evidence before closeout**: Pass. Each story has static/browser/demo gates
  and the programme ends in adversarial review.

## Project structure

```text
config/tiers/                         # tier values and element-owned spacing
src/
├── build.ts                          # tokens/manifests/font handling
├── css.ts                            # typography/layout tier emission
├── css-app-tier.ts                   # remove app spacing exception
├── css-components.ts                 # shared assembly + legacy families
└── css-components/
    ├── navigation-layout.ts          # tagged nav, docs layout, page shell
    ├── editorial-content.ts          # notice and eyebrow
    ├── article-pagination.ts         # sequential documentation navigation
    ├── control-row.ts                # compact wrapping filter row
    └── existing focused modules      # tabs, tiered list, aspect updates

demo/components/                      # one focused demo per public contract
scripts/                              # static, baseline, behavior, screenshot QA
docs/
├── agent-index.md                    # operations
├── architecture.md                   # durable decisions
├── specs.md                          # package catalog/status
└── spec-archive/                     # closed packages after merge
specs/001-baseline-foundry-renewal/   # this executable programme
```

## Workstream ownership

### Workstream A: navigation and shell

Own new navigation/layout module and its demos: FR-001, FR-002, FR-008. Avoid
tier/build/config files and other focused component modules.

### Workstream B: content and media patterns

Own tiered-list, aspect, notice, and eyebrow source/demos: FR-003, FR-005,
FR-006, FR-010. Avoid navigation, tabs, article pagination, and tier core.

### Workstream C: sequential and control compositions

Own tabs geometry, article pagination, and control row: FR-004, FR-007, FR-009.
Avoid navigation, content/media patterns, and tier core.

### Workstream D: tier and spacing parity

Own config/build/tier emission/public types/font contract and parity tests:
FR-011 through FR-018. This is the highest-risk stream and requires full-model
review.

### Root integration

Own Spec Kit/project structure, import assembly, catalog/task state, cross-stream
validation, adversarial review, and final browser QA.

## Delivery order

1. Freeze spec, research, contracts, tasks, constitution, and branch.
2. Land repository operating structure without deleting legacy narratives yet.
3. Run A, B, C research/implementation in parallel; keep shared imports and
   central validator integration under root ownership when conflicts arise.
4. Run D after its audit is incorporated; rebuild all tier artifacts.
5. Integrate demos and data-driven validation, then delete distilled stale root
   narratives.
6. Run full automated suites and repair regressions.
7. Perform adversarial source/API/a11y/responsive review.
8. Start the demo server and open every quickstart route/state for user QA.

## Rendered-quality amendment workstreams

The owner-requested follow-up is split into independent source ownership:

1. **Pagination geometry** owns `article-pagination.ts`, its focused demo, and
   its focused behavior assertions. It measures the button-with-icon contract
   before changing CSS.
2. **Navigation geometry** owns `navigation-layout.ts`, the focused top-nav
   demo, and focused behavior assertions. It measures row, highlight, tag,
   mark, and wordmark rectangles before changing CSS.
3. **Consumer verification** is read-only in Diagram Registry until the BF API
   is corrected, then refreshes generated artifacts centrally and verifies the
   actual consumer at mobile and desktop widths.
4. **Root integration** owns spec state, shared catalogs/validators, generated
   artifact refresh, full suites, screenshots, and final adversarial review.

## Vanilla and Sites parity amendment workstreams

### Workstream E: article-pagination correction — Root/Sol

Replace the regression-enforcing breakpoint contract with Vanilla's persistent
same-row structure. Map Vanilla spacing semantics to `--bf-space-*`, use BF
body/heading roles, retain metric-derived block compensation, and assert paired,
boundary, compact, focus, source-order, RTL, overflow, and all-tier geometry.

### Workstream F: static component families — Terra

Own focused modules and demos for data spotlight, divided section, in-page
navigation, logo section, media object, table of contents,
responsive aspect variants, CTA section, linked-logo section, quote wrapper,
text spotlight, the empty-state recipe, and site/sticky-footer layout.

### Workstream G: interactive and architecture-heavy families — Sol

Own password reveal/validation, notifications, expandable/sortable/mobile-card
tables, content card, basic-section architecture, hero, rich lists, tab section,
and fluid breakout.
Runtime and ARIA ownership must be settled per family before fixture work.

### Workstream H: bounded fixtures and coverage — Luna

After each public markup contract is frozen, add catalog entries, mechanical
demo variants, baseline labels, overflow probes, and static fixture assertions
without making API or spacing decisions.

### Root integration

Root retains shared assembly, public exports, catalog/runtime registries,
cross-family validation, generated output, and final integrated-browser QA.
Agents may not edit those shared owners concurrently.

## Amendment delivery order

1. Correct article pagination and close its Spec 001 acceptance defect.
2. Freeze the full inventory and explicit no-port boundaries.
3. Land foundation recipes plus logo/media/static families.
4. Land interactive form/navigation/table families.
5. Land Sites compositions in dependency order: basic/CTA/text spotlight,
   logo, hero/quote, rich lists, tab section, then content card.
6. Integrate Luna-authored fixtures after each family contract settles.
7. Run targeted checks per family, then full tests and integrated-browser QA.

## Complexity tracking

| Exception | Why needed | Simpler alternative rejected because |
|---|---|---|
| One programme package contains multiple independently demonstrable slices | The user explicitly requested one coordinated conversion/execution programme and Spec Kit permits user stories/tasks within a feature | Multiple active packages would violate one-active-spec-per-branch and multiply shared-source conflicts |
| App tier behavior changes during OS parity work | The explicit project-wide element-owned decision makes the current app exception invalid | Calling OS equal while retaining a contradictory tier architecture would be a false closeout |
| Latest Vanilla checkout contains overlapping dirty work | Pulling can overwrite or conflict with the local `yarn.lock` | Fetch `origin/main`, preserve the checkout, and compare the pinned clean `tmp/vanilla-main/` worktree |
| Vanilla Sites macros are WIP and monolithic | Literal API copying would destabilize BF and violate small-primitives policy | Port rendered composition outcomes over BF primitives; keep Jinja arguments and legacy grids out of the public API |
| Broad parity work creates shared-file conflicts | Parallel agents can overwrite assembly/catalog/test integration | Partition focused family modules/demos; centralize shared owners and use Luna only after markup contracts freeze |
