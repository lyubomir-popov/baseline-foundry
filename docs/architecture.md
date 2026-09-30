# Architecture

This document owns durable technical decisions. Feature-specific rationale and
evidence live in the relevant Spec Kit package.

## Product boundary

Baseline Foundry is a lean, forward-looking baseline-aligned design system for
internal design tooling. `portable-vertical-rhythm` is the compatibility line.
Consumer-specific product features stay downstream unless repeated evidence
shows a reusable BF contract.

## Four first-class tiers

The built-in tiers are `editorial`, `documentation`, `app`, and `os`. Each tier
selects its own type scale, density, layout values, and component values from
the same public shape. OS is intentionally denser, not supplemental.

Every tier is available as:

- a direct CSS bundle;
- a direct token JSON file;
- a direct surfaces manifest;
- a class-scoped surface inside the shared bundle;
- a demo selection and QA target;
- a public registry/type value.

Direct and class-scoped paths must resolve equal public tokens and representative
component geometry.

The built-in content caps form a non-increasing density progression:
Editorial `90rem`, Documentation `80rem`, App `60rem`, and OS `60rem`.
Documentation follows the rounded site-grid maximum; the App value applies only
to explicit bounded rows such as `bf-fixed-width`. App `bf-page` and application
grids remain fluid and edge-to-edge. OS does not exceed App, but stays equal
until an independent consumer proves a narrower system-surface cap.

Semantic tier and density are not independent BF axes today. Choosing a tier
selects typography, rhythm, layout values, and component geometry together.
Consumers must not mix a tier's type metrics with another tier's density tokens.

Structural surface padding follows the same non-increasing density rule as
capped content: Editorial and Documentation use `1rem`, App uses `0.75rem`,
and OS uses `0.5rem`. Fieldsets, modal regions, drawer chrome, and other
layout-owned surfaces consume that token. The copy-bearing `bf-panel`
component instead places its header, content, and footer on the continuation
inset; its block padding remains tier-owned. This keeps component copy on one
of the three declared insets without treating structural surface placement as
a fourth inset.

## Container-owned rhythm

All four tiers use one ownership model:

- flow text anywhere under `.bf-theme` defaults to body-line phase (Spec 026,
  owner rulings 2026-09-30): `p`/`.bf-body` and `h1`–`h6`/`.bf-h1`–`.bf-h6`
  own their measured `padding-block-start` plus a build-time phase inset, and
  a `margin-block-end` closure to whole body lines;
- text blocks space themselves: the closure supplies one blank body line, so
  `.bf-prose` has no gap and a `bf-stack` cancels its gap between two adjacent
  text blocks (paragraphs, headings, `hgroup`, prose lists); text next to any
  other child keeps the stack gap, so body-line phase after a component is not
  guaranteed;
- a prose `ul`/`ol` is a container-owned block: the outermost list carries the
  body nudge and phase once as `padding-block-start` and the closure once as
  `margin-block-end`, and its items and nested lists carry no block padding or
  margin, so every item line advances one body line; loose items are one body
  line apart;
- each child of an `hgroup` after the first is pulled up one whole body
  line, except pairs whose static cap-height-plus-descender proof fails, which
  stay unjoined;
- component internals keep the baseline-unit ledger: every class styled by
  the component, grid and preset CSS (except flow containers and page shells)
  shares the `.bf-theme.is-baseline-rhythm` block, which redeclares every term
  to its bU equivalent; the nearest theme or component root wins through
  inherited private properties;
- baseline-unit-ledger text owns its measured `padding-block-start`
  and only the complementary, non-semantic `margin-block-end` required to
  complete a baseline unit;
- production text uses no bottom-padding compensation and role space-after
  does not contribute to layout;
- layout containers and patterns own semantic spacing between direct children;
- nested `bf-stack` containers express different densities, including the
  larger boundary between complete patterns or sections;
- flow boundaries preserve compensation and therefore do not need semantic
  last-child margin trimming.

Nudge and compensation properties keep their meaning under both ledgers.
Under `.is-baseline-rhythm` every prose and stack gap is the authored one and
rendered text geometry equals the pre-Spec 026 output exactly.

This owner decision aligns BF with the current container-owned direction in the
Canonical spacing reference while preserving BF's independent tier values and
public API.

Semantic typography follows the same ownership boundary. Plain elements are
styled once through zero-specificity selectors under `.bf-theme`; explicit
`.bf-body` and `.bf-h1`–`.bf-h6` visual-role classes may override the semantic
tag in either direction. `.bf-h5` is the sole public role for the small-caps
H5/eyebrow presentation; BF does not publish a duplicate `bf-eyebrow` alias.
`.bf-prose` owns prose-flow composition only and must not restate paragraph,
heading, or figcaption typography.

Semantic `ul` and `ol` containers do not carry a body-role space-after. Their
text items retain baseline compensation, while the owning prose or pattern
stack controls separation before and after the list. Structural list resets
and prose indentation remain separate composition concerns.

Flow and boxed containers do not zero a final child's entire bottom margin:
that margin is metric compensation, not semantic spacing. Their owning stack
sets the boundary to the next sibling, and the following first baseline stays
on the active grid.

`bf-cluster` owns inline sibling relationships. Its default gap is two
baselines; `is-dense` selects one baseline, `is-split` distributes the first
and final groups, and `is-nowrap` preserves one intrinsic row when horizontal
overflow belongs to an outer scroller. These modifiers do not add block
padding or erase child metric compensation.

## Controls and ruled rows

Product tiers supply component input facts while shared contracts derive leaf
geometry once; the complete formulas, ownership modes, allowlists,
classifications, and reviewed exceptions live in
[Component spacing architecture](component-spacing-architecture.md).

## Surface and manifest pipeline

Config is parsed into a complete `ThemeTokens` surface. CSS, token JSON, and
surface manifests are generated from that object. Each manifest entry records
the production alignment engine and the font metrics used to derive runtime
nudges. Every manifest field with a CSS representation must have one documented
meaning and a generated equality assertion.

The metrics-compensated engine is the production default. The cap-unit engine
is demo-only. Custom fonts are separate metric-derived surfaces, not font-family
overrides on a surface whose nudges came from another face.

## Font contract

Ubuntu Sans Variable is the built-in font family. All built-in tiers that refer
to the same asset use one coherent descriptor. The package must either ship the
asset paths emitted by its CSS or document and expose a supported consumer URL
injection/override mechanism; it must not claim self-contained rendering while
omitting required files.

IBM Plex remains an experiment/downstream custom-build example, not a built-in
tier preset.

## CSS and public API

- Flat `bf-*` classes and `is-*` modifiers only.
- No styled `data-*`, `ui-*`, BEM, broad compatibility aliases, or `!important`.
- Logical properties for directional behavior.
- CSS-only layout/content patterns unless behavior genuinely requires runtime.
- Focused modules under `src/css-components/` for cohesive families; central
  assembly controls ordering and shared tokens.
- Generated artifacts are never hand-edited.

## Validation model

Static validation asserts config completeness, generated CSS structure, public
exports, BF-only demo markup, and token/manifest consistency. Browser validation
asserts baseline alignment, behavior, overflow, tier switching, focus, and
responsive state. Screenshot QA is evidence, not a substitute for DOM and
computed-style assertions.
