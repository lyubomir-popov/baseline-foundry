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

## Element-owned rhythm

All four tiers use one ownership model:

- each typographic/content element owns its metric-derived
  `padding-block-start` and `padding-block-end`;
- each element owns its semantic `margin-block-end`;
- layout containers arrange children but do not erase semantic spacing or
  replace it with generic gaps;
- `bf-section` is the explicit boundary for page-section rhythm;
- boundary trimming is an explicit composition concern, not a universal
  `:last-child` reset.

This is a local design decision. A container-owned direction in Pragma or the
Canonical official design system is a separate product constraint and does not
override BF.

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
