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

`bf-cluster` owns inline sibling relationships. Its default gap is two
baselines; `is-dense` selects one baseline, `is-split` distributes the first
and final groups, and `is-nowrap` preserves one intrinsic row when horizontal
overflow belongs to an outer scroller. These modifiers do not add block
padding or erase child metric compensation.

## Controls and ruled rows

Controls use the Vanilla occupied-block model. Symmetric block padding is the
active body nudge minus border width. The natural border box is allowed to be
fractional relative to the baseline. Trailing compensation plus semantic space
snaps the occupied block to the next grid line. Density comes from the tier, not
from per-control height modifiers.

An explicit `is-nested` modifier is the narrow exception for auxiliary chips,
status labels, and badges composed inside an existing body-sized flex or grid
row. It removes up to one active baseline of leading from the child line box,
without making that line shorter than the body-font-size token (one body em),
caps symmetric block padding so
the complete paint fits within the host body line, and removes the child's
standalone block margin. A nested chip paints its border as an inset shadow so
the border does not create a second block footprint. The host owns the occupied
row and prevents margin collapse. This is not a general density scale: it is
never inferred from ancestry, and it does not shrink bordered buttons or other
standalone interactive targets. Nested table actions use the existing
inline/link-button contract.

Repeated rows that cannot use margins snap compensation inside the row box.
Table cells and contextual-menu commands target the same public single-line
occupied block as controls: they retain the measured body start nudge and real
body line height, then place remaining compensation at block end. Table cells
also reserve their real in-box separator. This is one height family with two
ownership modes—control margin compensation or host-owned in-box
compensation—not a separate density bucket.

A table row containing full inputs, bordered buttons, checkboxes, or radios
uses the explicit `tr.is-control-row` modifier. Those controls keep their normal
standalone target geometry; the row removes only the cell block inset that
would otherwise count the same occupied space twice. Intermediate separators
paint inside the row rather than adding height, and the cell leaves overflow
visible so focus rings are not clipped. This is a host-ownership contract, not
a compact-control variant, and it never applies implicitly from `:has()` or
ancestry.

Side-navigation lists preserve the same natural link paint and trailing
compensation as controls, but their grid tracks use the shared single-line row
token. The link is start-aligned inside each track so rasterised rem borders do
not stretch its text or paint; the track absorbs any subpixel remainder. This
keeps item-to-item baselines on one phase under browser zoom without inventing
a navigation-only height.

The replaced native color input composes through `bf-color-control`. Because a
color input has no body-text line box, the wrapper contributes an invisible
metric strut using the shared line, symmetric padding, rem border, and trailing
compensation; the native input stretches into that row. Composite sliders use
their paired numeric field as the occupied-row owner and stretch the range
track within it. These are explicit component compositions, not audit-page
height patches.

Canonical tagged navigation exposes one derived brand line centre: tag block
size minus the fixed mark-bottom offset and half the mark. Twice that centre is
the 3rem brand/header block. Brand titles and adjacent breadcrumbs align to the
same line without optical transforms; the fixed 2.375rem-by-1.375rem tag and
1rem mark geometry remain independent of the header's inline extension.

Unboxed text is intentionally not expanded to that interface height. Paragraph
copy, links, labels, help, list text, and breadcrumbs have no component-owned
paint or target area; their box contains only the measured font start nudge,
line box, and trailing baseline compensation. A container, not the text role,
owns any semantic separation around it.

Grouped side navigation uses three explicit spacing owners. The outer
`bf-side-navigation-groups` container separates complete groups;
`bf-side-navigation-group` owns the fixed 0.5rem transition from its header to
its list; and `bf-side-navigation-group-header` keeps a real compensated `hr`
and its H6-styled heading tight. The rule begins on the continuation text rail
and stretches to the navigation end edge. Rules never come from list pseudo-
elements, and their one-half-rem occupied block must not shift later headings
off the active baseline phase. A single-line group heading reserves four
baselines through a minimum block size; longer headings may still wrap and
grow, while the common case cannot accumulate fractional font-box drift.

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
