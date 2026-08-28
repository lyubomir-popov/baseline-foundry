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

Panel insets follow the same non-increasing density rule as capped content:
Editorial and Documentation use `1rem`, App uses `0.75rem`, and OS uses
`0.5rem`. Both inline and block panel padding move in complete baseline-grid
increments, so denser tiers never create roomier panel headers, content, or
footers than the tier before them.

## Container-owned rhythm

All four tiers use one ownership model:

- each metric-aligned text element owns its measured `padding-block-start`;
- each element owns only the complementary, non-semantic
  `margin-block-end` required to complete a baseline unit;
- production text uses no bottom-padding compensation and role space-after
  does not contribute to layout;
- layout containers and patterns own semantic spacing between direct children;
- nested `bf-stack` containers express different densities, including the
  larger boundary between complete patterns or sections;
- flow boundaries preserve compensation and therefore do not need semantic
  last-child margin trimming.

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

## Controls and ruled rows

Controls use the Vanilla occupied-block model. Symmetric block padding is the
active body nudge minus border width. The natural border box is allowed to be
fractional relative to the baseline. Trailing compensation plus semantic space
snaps the occupied block to the next grid line. Density comes from the tier, not
from per-control height modifiers.

Repeated rows that cannot use margins snap the row box instead: symmetric
padding, a real in-box separator, and a solved line height inside a block size
that is a baseline multiple.

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
