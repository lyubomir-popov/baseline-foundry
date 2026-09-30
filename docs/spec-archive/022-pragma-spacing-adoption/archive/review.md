# Review: Pragma spacing-model adoption

## Implementation

- Pragma branch: `feat/bf-spacing-model`
- Pragma base: `7193fe082`
- Pragma implementation commit: `2838e3d33`
- Pragma reference Button commit: `bbab24ae4`
- Pragma reference Chip commit: `ed23e62df`
- Pragma Chip evidence-correction commit: `d4b3d5668`
- Pragma reference Tabs commit: `48e70ef77`
- Pragma reference Accordion commit: `bf79d5190`
- Pragma reference Badge commit: `4e33e6d00`
- Pragma native SelectInput commit: `33e83487c`
- Pragma reference ContextualMenu commit: `533ae3e1b`
- Pragma Svelte WPE source-hardening commit: `53a510c60`
- Pragma Svelte Launchpad source-hardening commit: `b09058c80`
- BF reference: `b83396c`
- Products: Site, Docs and App; OS is excluded.
- Provider: `@canonical/design-tokens` 0.9.0 across all direct consumers.

The first broad migration pass imports the provider's resolved spacing modifier, removes
the universal baseline fallback and role `spaceAfter`, and makes product
containers own inter-component gaps. Typography and controls retain measured
top compensation, use symmetric painted geometry, and put only residual
baseline slack into trailing margin. Target cells and fixed baseline-multiple
component heights are absent from the migrated path.

## Focused gates

All affected package checks completed successfully:

- styles main and typography contract tests: 13 passed;
- React global: 385 passed, 5 skipped;
- React global form: 295 passed;
- React app: 56 passed;
- Svelte Launchpad SSR: 385 passed;
- Svelte WPE SSR: 59 passed;
- Svelte Launchpad Chromium component tests: 84 passed;
- Svelte WPE Chromium component tests: 32 passed;
- React global, global-form and app TypeScript, Webarchitect and package builds;
- Svelte Launchpad and WPE checks and builds.

Focused source audits found no active `--space-after`, target-baseline,
target-height or control-seat implementation. The only remaining
baseline-derived fixed block found by the audit is the intentionally fixed
CanonicalLogo story mark canvas.

## Rendered review

Storybook review covered representative Site, Docs and App contexts with the
baseline overlay enabled. Button matrices, form examples and App
SideNavigation rendered without clipping or overlap. Representative controls
showed equal painted top/bottom geometry and non-zero trailing compensation;
container rows supplied their own gaps. At browser DPR 1.5, border edges round
to device pixels, so measured painted heights can differ by a fraction of a
CSS pixel while retaining symmetric authored geometry.

## Repository-level findings

The repository-wide gates are not green on this Windows worktree for reasons
outside this contribution:

- `bun run check` stops in untouched `@canonical/biome-config` on checkout
  line-ending differences;
- `bun run test` fails in untouched `@canonical/harnesses` because POSIX path
  expectations receive Windows backslashes;
- `bun run build` fails in untouched `@canonical/lit-ds-prototype` because its
  Vite/Rolldown CSS imports request a missing default export.

These failures reproduce outside the changed packages. No out-of-scope fixes
are included.

## Accepted reference Button

The React global Button is now the first deep reference rather than treating
the broad pass as complete. Browser measurement exposed two substantive defects
that static contracts had missed: semantic aliases declared on `:root` froze
the Action inset at the root/Site value, and the declared 14px label role was
not applied to `font-size`, leaving the control at the inherited 16px size.
Both are corrected in the Pragma working tree.

The reference story reports the active product baseline, owning group gap,
Action inset token, physical border-edge-to-content inset, actual 14px/20px
typography, symmetric cap-derived padding, painted block, trailing compensation
and occupied block. Its package-scoped Playwright 1.61.1 oracle passes 12 cases
in 53.1 seconds: Site, Docs and App in Chromium, Firefox and WebKit at 16px and
18px roots and DPR 1/2. Every case also exercises LTR and RTL, a two-child
nested owning container, framed variants, link exclusion, production-font
readiness, and the double-modulo exact-zero tie. Package Vitest (375 pass, 5
existing skips), TypeScript and package build pass.

The BF oracle is pinned to `b83396c` with eight content-addressed Git blobs for
the governing architecture, component contracts, Button application, three
tier configs and Ubuntu Sans font. With `BF_REPO` pointing to a BF checkout,
`bun run test:spacing:provenance` verifies all eight blobs. The hidden rendered
reference independently supplies BF's metric anchor and `0.0625rem` border;
the test distinguishes the authored border fact from the browser-rasterised
used border.

Three independent reviews covered spec adherence, token cascade/schema and an
adversarial geometry audit. Their material findings were corrected, including
root-frozen semantic aliases, unapplied typography, self-referential BF facts,
font readiness, missing DPR/RTL/link/nested evidence, test-server collisions,
and a one-border error in physical inline insets. The Button reference is
accepted. Native 100%, 125% and 150% browser-zoom evidence is not yet recorded,
so the full T012 matrix and repository-wide completion claim remain open.

The browser oracle intentionally remains in the package's default `test`
command and the package carries the repository's `playwright` Nx tag. Geometry
is a required Button contract, not an optional local diagnostic; the runner
allocates a unique Storybook port and output directory for concurrent runs.

## Accepted TextField/Form ledger slice

The React global-form TextField and its Form/Field owners are the second deep
reference slice. Context-sensitive defaults now resolve on the consuming
component roots instead of freezing on `:root`. Form owns the gap between
Fields, Field owns label-to-control spacing, and the input derives its intrinsic
block geometry from the active type role, cap metric, symmetric padding and
provider stroke. No target, minimum or maximum block size participates. Any
remaining baseline slack is emitted only as trailing margin compensation.

The reference story makes the Site, Docs and App differences visible: Site uses
16px/24px body typography while Docs and App use 14px/20px; Site and Docs use an
8px Field inset at a 16px root while App uses 4px. It also reports the owning
Form and Field gaps, physical outer-border-to-content inset, symmetric padding,
painted block, trailing compensation and occupied block. A public-override
fixture proves that the migration preserves supported customization rather than
masking it with private defaults.

The final Playwright run passes 12/12 cases across Chromium, Firefox and WebKit,
DPR 1/2 and 16px/18px roots, with Site, Docs, App, LTR and RTL exercised in each
case. Package Vitest passes 297/297, TypeScript and the package build pass, and
the nine-source BF provenance check passes at `b83396c`. The hidden oracle keeps
BF's authored `0.0625rem` border distinct from Pragma's provider 1px border and
from browser-rasterised used widths. Painted-block parity retains the fixed
0.25px acceptance envelope. Occupied-block comparison additionally requires the
same rounded baseline count and uses an independently derived font-metric and
border-rasterisation envelope; Firefox Site at an 18px root was observed at
0.260010454px and is accepted only under the owner's stated cap-metric
imprecision allowance, not as strict 0.25px parity.

Independent spec, cascade/schema and geometry reviews accept this bounded
CSS-ledger slice with no remaining P0/P1 issue. They do not establish pixel-level
baseline alignment of glyphs painted inside the replaced native input, which
needs image analysis, and they do not add native browser-zoom evidence.
Asymmetric per-side border overrides are also outside this slice because the
current public ledger and provider contract assume a symmetric stroke. Those
limits must not be promoted into a claim that Spec 022 or the remaining form
families are complete.

## Accepted React SideNavigation row slice

React SideNavigation Item, Header and NavTree now form the third deep reference
slice. Browser calibration exposed defects hidden by the earlier source-only
checks: Storybook overrode the production mark column, row labels missed BF's
Continuation rail, NavTree had no group owners, the row ledger omitted its two
transparent borders, the CollapseToggle retained user-agent button geometry,
and the typography shorthand left Docs/App at 16px instead of BF's 14px/20px
body role. All are corrected in the Pragma working tree.

The production row is intrinsic: its painted block is the product line plus
twice `max(cap nudge - border, 0)` plus two transparent provider strokes. The
double-modulo remainder is the row's only trailing margin. Lists own repeated
`minmax(occupied, auto)` tracks; NavTree owns the fixed BF 1.5rem group gap and
each group owns the fixed BF 0.5rem heading/list gap. Copy starts at the product
Continuation rail, with a fixed 1rem mark canvas and product mark gap derived
backward from that rail. No positive target/minimum/maximum row size was added.
The shell's `max-height: 100%`, Content's `min-height: 0`, and list occupied-track
floor remain structural scrolling/composition constraints rather than control
targets.

The dedicated story mounts production CSS with a neutral, line-safe 1rem brand
and reports product baseline, exact typography, stroke, symmetric padding,
painted/compensated/occupied block, Continuation and mark geometry, and measured
container gaps. A second real hidden SideNavigation omits `applicationName` so
the Header's zero-width typographic strut is browser-proven rather than merely
source-asserted. The final Playwright run passes 12/12 in 1.7 minutes across
Chromium, Firefox and WebKit, DPR 1/2 and 16px/18px roots, with Site, Docs, App,
LTR and RTL in every case. It also covers real text baseline probes, BF authored
versus browser-used borders, active/icon/iconless/slot rows, wrapped rows and
titles, repeated phase, exact-zero start and compensation paths, and both titled
and untitled Header geometry.

Package Vitest passes 62/62, TypeScript, package build and focused Biome pass,
and the eleven-source BF provenance oracle verifies at `b83396c`. Independent
spec, token/cascade and adversarial geometry reviews accept the bounded slice
with no remaining P0/P1/P2 finding. The oracle derives its 0.34em metric anchor
from the pinned signed Ubuntu Sans metrics instead of storing it as an unrelated
tolerance fact.

This acceptance is intentionally React row/group geometry only. The story-only
CanonicalLogo still uses its legacy baseline-derived placeholder geometry and is
not evidence for BF's fixed tagged-brand optics. Svelte SideNavigation parity and
native 100%, 125% and 150% browser zoom are also not established here.

## Accepted React global Chip slice

React global Chip is the fourth deep reference slice. The component now resolves
its typography and spacing defaults on the consuming Chip root, so switching the
product context visibly changes Site to 16px/24px body typography while Docs and
App use 14px/20px. Its regular form uses BF's intrinsic control ledger: the cap
nudge determines equal border-aware block padding, the painted block remains
automatic, and only the residual baseline slack becomes trailing margin. There
is no target, minimum or maximum block size.

Inline geometry uses the provider's independent Action and Field properties:
Site uses 16px/8px, Docs 12px/8px and App 12px/4px at a 16px root. The short-label
floor is derived from the painted block to preserve the stadium shape, and the
dismiss mark uses BF's fixed 1rem canvas. The explicit nested form reduces its
line by one baseline and restores that amount as symmetric padding, paints its
stroke inset, emits no external compensation and does not enlarge or misalign a
body-line host. Parent stacks own all semantic gaps between complete Chips.

The production-CSS story exposes regular, lead/value, clickable, dismissible,
one-character, nested, exact-tie, BF-reference and public-override fixtures. The
final package runner passes 24/24 combined Button and Chip cases in 1.6 minutes.
Chip contributes 12/12 cases across Chromium, Firefox and WebKit, DPR 1/2 and
16px/18px roots, with Site, Docs, App, LTR and RTL exercised in every case. The
suite proves production-font readiness, exact provider values, symmetric padding,
real text baseline alignment, painted and occupied ledgers, stack-owned gaps,
one-character geometry, nested host fit and supported public overrides.

The Chip oracle pins ten BF source blobs at `b83396c`, including the component
contracts, Chip implementation, three tier configs, Ubuntu Sans font and the BF
behavior verifier that owns the 0.51px nested-host raster envelope. The combined
provenance command verifies the existing eight Button blobs and all ten Chip
blobs. Focused static contracts pass 4/4, TypeScript, package build, Storybook
build and changed-file Biome pass, and the full React global Vitest run reports
376 passed with five existing skips.

The initial independent spec, token/cascade and geometry reviews accepted the
production slice. A subsequent Opus border review found two required evidence
corrections: the suite did not bind the regular border to the provider stroke,
and the story labelled the browser-used width as the contract. Commit
`d4b3d5668` closes both without changing production CSS. The suite now resolves
the live provider stroke to exactly 1px, requires the private nominal input to
match it, checks all used edges through an explicit device-snap envelope, and
proves 0px and 2px negative controls fail the default contract. The story now
shows provider stroke, Chip input, used border and DPR separately.

At non-integer native display scale or page zoom, engines floor a regular 1px
border to a whole physical pixel. The used edges can therefore be 0.8 CSS px at
125% or 0.666667 CSS px at 150%, and the rendered painted/occupied block can be
short of its nominal ledger by the two edge deltas. That is browser paint
behavior shared by a literal 1px border and BF's reference, not a Pragma token
or production-CSS defect. The 0.25px browser assertions remain parity evidence
for the exercised root/DPR matrix; they are not absolute grid-phase proof under
native zoom.

The pre-existing combination of `onClick` and `onDismiss` can produce a nested
native button and remains adjacent semantic/API debt rather than spacing
evidence. Empty or dismiss-only Chips also remain outside the demonstrated
text-ledger states. Native browser zoom remains the package-wide T012 limitation
and is not claimed by this slice. The full findings and raster evidence are in
[`chip-border-adversarial-review.md`](chip-border-adversarial-review.md).

## Accepted React global Tabs slice

React global Tabs is the fifth deep reference slice. Each tab is now built from
its content outward with BF's in-box rail exception: two transparent nominal
1px block strokes participate in geometry, the cap nudge determines equal
border-aware start/end padding, and residual baseline slack is added only to
end padding so the tab ends at the list-owned rail. Block size remains automatic
with no target, minimum or maximum height. The rail and active indicator are
inset paint on that shared bottom edge, so neither changes layout.

Product context is resolved on the consuming tab. Site produces a 16px/24px
five-baseline row with 1rem Action inset and .5rem mark gap; Docs and App use
14px/20px six-baseline rows, .75rem Action inset, and respective .5rem/.25rem
mark gaps. The active indicator preserves BF's scalable `.1875rem` thickness.
Overflow remains horizontal, inactive/inert/disabled states keep identical
geometry, and focus consumes the canonical provider focus-ring token.

The production-CSS story includes visible product metrics plus normal, overflow,
exact-start-tie, exact-compensation-tie, BF-reference and public-override
fixtures. Its browser oracle pins ten BF source blobs at `b83396c` and proves
actual first-baseline parity, provider/nominal/used strokes, mark and Action
spacing, intrinsic occupied rows, signed bottom-edge shadow placement and RTL
mirroring. Tabs passes 12/12 cases across Chromium, Firefox and WebKit, DPR 1/2,
16px/18px roots, and all three products. The combined Button/Chip/Tabs regression
matrix passes 36/36 in 2.5 minutes.

Independent spec, token/cascade and adversarial geometry reviews accept the
slice with no remaining P0/P1/P2 finding after corrections to the active-bar
unit, focus token, mark-gap evidence, baseline probe, modulo tie coverage and
paint-edge direction. The full React global Vitest run passes 376 tests with
five existing skips; TypeScript, package build, Storybook build, focused Biome,
diff checks and all Button/Chip/Tabs provenance checks are green. Storybook's
existing unresolved SVG-at-build-time and chunk-size notices remain warnings.
Native browser zoom remains the package-wide T012 limitation and is not claimed
by this slice.

## Accepted React global Accordion slice

React global Accordion is the sixth deep reference slice. It preserves native
`details`/`summary` disclosure semantics and builds each header from its content
outward. The consuming summary owns exact body typography even when its label is
an `h1` through `h6`; the heading remains semantic but no longer invents a
second visual role. Two nominal provider strokes, cap-derived border-aware
symmetric padding and trailing margin compensation form the regular BF occupied
row. No target, minimum or maximum block size participates.

The root Accordion owns the baseline gap between direct items. A fixed private
1rem disclosure canvas and the provider Mark gap derive the Continuation start
for label and panel content. The divider is paint attached to the following
item, so it does not alter the ledger. Panels own only a baseline top inset and
Continuation start; any spacing between panel children belongs to an explicit
nested flow container. The root does not clip focus or content overflow.

The production-CSS story distinguishes provider stroke, nominal Accordion input
and browser-used edges. Its oracle pins ten BF source blobs at `b83396c` and
uses independent glyph, baseline and BF-reference measurements rather than
recomputing expectations from the subject. It covers 0px/2px stroke negative
controls, actual first-baseline parity, LTR/RTL Continuation geometry, semantic
heading equivalence, wrapping, divider paint, closed-panel visibility and tab
order, Enter/Space behavior, focus, caller-owned flow and both exact ledger
ties. Accordion passes 12/12 cases across Chromium, Firefox and WebKit, DPR 1/2,
16px/18px roots and Site, Docs and App. The final combined
Button/Chip/Tabs/Accordion regression passes 48/48 in 2.8 minutes.

Full React global Vitest passes 378 tests with five existing skips. TypeScript,
package build, Storybook build, focused Biome, diff checks and provenance are
green. Independent implementation and adversarial reviews corrected six
material self-confirming assertions and a later unsupported RTL-chevron
assumption; their final verdicts contain no P0/P1/P2 finding. Native browser
zoom remains the package-wide T012 limitation and is not claimed by this slice.

## Accepted React global Badge slice

React global Badge is the seventh deep reference slice. It uses product body
typography and treats that line as its painted block; there is no cap-derived
control ledger, target height or external compensation. The short-label floor
is the painted line and exactly one nominal provider-stroke of inline padding
fits inside that floor, producing a true one-character circle while longer
labels grow intrinsically. The explicit nested form subtracts one active
baseline from the body line, preserves the same inline inset, emits zero margin
and aligns itself within the host-owned body line.

The first implementation incorrectly reused the product Field inset, removed
nested inline padding and used a fixed 16px story host. Adversarial raster and
source review rejected those assumptions against pinned BF
`chip-badge-status.ts`. The correction binds padding to the nominal 1px provider
stroke, restores it in the nested form, adds `align-self: center`, makes the host
follow the active 20px/24px body line, and requires exact regular and nested
geometry. A reversible 7px start-margin injection now fails rather than being
ignored by the suite.

Badge passes 12/12 across Chromium, Firefox and WebKit, DPR 1/2, roots 16/18,
Site, Docs, App and LTR/RTL. The ten-source BF oracle verifies at `b83396c`;
18 focused tests, TypeScript, WebArchitect, focused Biome and diff checks pass.
The independent correction review reports no remaining P0/P1/P2.

## Accepted React global ContextualMenu slice

React global ContextualMenu is the ninth deep reference slice. Its leaf,
parent and nested commands share BF's intrinsic body-line in-box construction:
product body typography, symmetric nudge-derived block padding and no target,
minimum or maximum row height or external compensation. Action and Mark tokens
own the inline rails; the submenu caret stays inside a private fixed 1rem
canvas. The surface border and divider are nominal `.0625rem` inputs and the
focus width/offset are nominal `.125rem` inputs, while browser-used device-snap
geometry is reported separately. Group separators occupy no flow space and
paint only before a following command, so terminal groups add no trailing gap.

Because menus portal to `body`, production now captures the trigger's closest
product context and observes every trigger ancestor independently. Root and
nested portals therefore preserve Site, Docs or App on first open and after a
same-mounted product switch, including when an initially unclassified closer
ancestor later acquires a product class. SSR still renders inline before the
post-effect portal transition; hydration, keyboard navigation, focus return,
selection, close and unmount behavior remain covered.

Adversarial review rejected several initially green implementations and tests:
an invented cap-height row ledger, a caret that expanded Docs/App rows, fixed
Mark spacing, pixel-authored border/divider/focus values, stale portal classes,
absolute-value rail checks, synthetic baseline evidence and an over-broad story
observer that retriggered itself. The accepted version uses the pinned BF shared
row formula, signed logical gaps, zero-size baseline markers plus text-range
glyph measurement, exact private-token bindings and observer filtering. The
fault gates reject arbitrary numeric-pixel stroke declarations and distinguish
nominal inputs from used device-snapped paint.

The final ContextualMenu matrix passes 12/12 across Chromium, Firefox and
WebKit, DPR 1/2, roots 16/18, Site, Docs, App and LTR/RTL. Thirty-three focused
tests, the full 385-test React global suite with five existing skips,
TypeScript, package and Storybook builds, the nine-source BF oracle, focused
Biome and diff checks pass. Final Terra and Sol reviews report no remaining
P0/P1/P2.

## Accepted native SelectInput slice

React ds-global-form native SelectInput is the eighth deep reference slice. It
reuses the accepted Form block ledger and owns only its dropdown-specific inline
geometry: the first glyph reaches the Field rail and the logical end reserves
two Field insets plus a private fixed 1rem chevron canvas, with actual border
deductions. The two-layer caret mirrors in RTL, and non-multiple selects use
BF's hidden overflow, ellipsis and no-wrap contract. Native multiple/listbox
appearance, option-popup geometry and other OS-owned painting remain outside
this single-line slice.

The production story includes long/narrow, disabled, invalid, public-override,
ignored private-canvas override, multiple and real SelectField states. The
browser suite measures both caret layers, their square sizes and physical bounds
inside the fixed canvas; proves the text rail ends one Field inset before that
canvas in LTR and RTL; and compares the wrapped SelectField's complete live
ledger and paint. It distinguishes BF's nominal `.0625rem` border fact from
Pragma's live provider 1px binding.

Two adversarial rounds rejected initially green evidence. A centered RTL caret,
zero narrow-control end padding and a transparent second caret half could each
pass earlier assertions; the long-label and SelectField fixtures were also
under-measured. All are corrected, and the same reversible faults now fail at
the expected assertions. The final matrix passes 12/12 across Chromium,
Firefox and WebKit, DPR 1/2, roots 16/18, Site, Docs, App and LTR/RTL. Eighteen
focused tests, TypeScript, WebArchitect, seven-source BF provenance, focused
Biome and diff checks pass. Final independent review reports no remaining
P0/P1/P2.

## Bounded Svelte source hardening

Two additional commits move high-value Svelte paths toward the same model
without presenting source/static checks as rendered parity. WPE `53a510c60`
hardens Button product-scoped typography, Action insets, regular and nested
ledgers and canonical focus while retaining KeyboardKey as an inline code/keycap
surface rather than inventing a block-control contract. Its 301-test package
suite, Svelte check, WebArchitect, build and focused Biome checks pass.

Launchpad `b09058c80` removes universal/numeric baseline fallbacks and runtime
line-height multipliers from the migrated Button, Input, Select, Badge and
NavigationItem paths. It supplies border-aware intrinsic ledgers, a fixed 1rem
Select artwork canvas, the regular non-cap Badge model, and fixed navigation
mark/Continuation geometry with the correct Field end inset. The normal SSR
gate passes 389 tests and the targeted component matrix passes 186 tests across
Chromium, Firefox and WebKit; build, Svelte check, WebArchitect and exact-file
Biome checks pass. The full client suite retains two pre-existing WebKit
Breadcrumb focus failures outside the touched subset, and package-wide Biome
retains its pre-existing line-ending diagnostics.

Independent adversarial review accepted both commits only as bounded source
hardening. Deep Storybook/browser BF-reference oracles are still required before
claiming package/component parity, especially for the wider Svelte component
families.

## Deferred evidence

T012 remains open only for native browser zoom: completion across 100%, 125%
and 150% in Chromium, Firefox and WebKit is a follow-up hardening task. The
automated product, engine, root-size, DPR, direction and nested-container matrix
is green; it must not be described as browser-zoom evidence.

For TextField specifically, native input-glyph pixel analysis and asymmetric
per-side border overrides remain deferred acceptance evidence. T019 remains open
for the rest of the component inventory, including CanonicalLogo, form
composites and multiline controls, Tooltip, Timeline,
Card/Tile, and deep browser-backed parity for the Svelte component families.

## Generated metric-nudge correction (T044-T053)

The owner correction is implemented in the isolated Pragma worktree
`H:\\WSL_dev_projects\\pragma\\.claude\\worktrees\\feat-bf-metric-nudge` on
branch `feat/bf-metric-nudge`, based on `533ae3e1b`. No commit, merge, push or
package publication was performed.

Pragma now pins `@lyubomir-popov/baseline-nudge-generator` 1.5.1 and generates
24 authenticated Site/Docs/App role lanes from exact provider inputs and exact
Ubuntu Sans assets. The checked CSS and JSON outputs record matching artifact
digests and complete source/font/provider/generator provenance. Generation
stages both outputs, replaces them with rollback protection, and makes any
crash-interrupted mixed generation detectable through the shared digest.
Missing, stale, corrupt, unsupported or differently instanced inputs fail
closed. The corrupt Mono placeholders were replaced with Canonical's official
normal and italic v1.006 TTF assets.

The generated engine is the only production typography engine. The former cap,
trim and raw-metrics files and public escape hatches are removed. Direct and
composed entry points load the exact fonts and inherited body role, while one
namespaced occupied-block contract owns border-aware padding and modulo
compensation. The eleven inventoried cap-derived stylesheets plus
ContextualMenu's copied literals now consume that contract. Native controls use
inherited typography, and Launchpad multiple Select is explicitly excluded
from the single-line ledger.

All six React browser oracles now use zero-size inline baseline markers and
assert absolute phase against the live grid. They do not read generated JSON or
repeat the production metric calculation. Form explicitly limits native input
evidence to inherited typography and box geometry because the replaced native
control does not expose glyph baseline paint.

Final evidence:

- generated-artifact freshness and typography mutation suite: 10/10;
- import and packed-artifact matrix: 16 passed, one explicit absent-Vanilla
  adapter skip;
- React global browser matrix: 72/72 across Chromium, Firefox and WebKit, DPR
  1/2 and 16px/18px roots;
- React global focused metric contracts: 8/8. Its full Vitest run reports 384
  passed, five skipped and one unchanged Badge string assertion failing only
  because the Windows checkout converted the compared source to CRLF;
- React Form/Select browser matrix: 24/24 across the same matrix;
- React SideNavigation browser matrix: 12/12 across the same matrix;
- targeted Svelte WPE Button: 32/32 in Firefox and 32/32 in WebKit, in addition
  to its green Chromium/server/SSR gates;
- targeted Svelte Launchpad Button/Input/Select/NavigationItem: 42/42 in
  Firefox and 42/42 in WebKit, in addition to its green Chromium/server/SSR
  gates;
- BF `npm test`: green, including 24,370 build assertions and component
  behavior verification;
- BF `npm run qa:components`: green after the complete screenshot capture and
  component-baseline verification;
- Pragma React demo production build: green; isolated development server
  verified HTTP 200 and rendered the expected specimen UI on port 4174. The
  demo's existing SSR hydration recovery warning (HTML whitespace, plus an
  extension-added attribute in the connected Chrome run) remains outside the
  CSS migration; the production-CSS Storybook browser suites are green;
- BF meeting demo verified HTTP 200 and rendered on the default port 4173;
- final source sweep: no production `1cap`, copied body nudge literal, legacy
  engine import/export, component-private `mod()`, or dangling multiple-Select
  padding token. Remaining Pragma matches are rejection assertions. Remaining
  BF matches are the labelled comparison demo, the independent icon-optics
  test, or preserved historical/spec evidence.

Independent junction reviews initially rejected three seams: output variables
resolving before child paint inputs, an undefined multiple-Select token and
single-line ledger leak, and relative-only baseline oracles plus an invalid
Firefox Accordion border envelope. Each was corrected. The final React oracle
re-review is GO, and the Svelte P1 was rerun green after explicit multi-row
exclusion.

Pragma's repository-wide commands retain unrelated Windows/worktree failures:
`bun run check` stops in untouched `@canonical/biome-config` because CRLF files
differ from Biome's LF output; `bun run test` fails existing POSIX-path
expectations in harness/generator packages; and `bun run build` fails the
existing Lit prototype CSS default-export imports. Affected package TypeScript,
Webarchitect, focused Biome, unit/browser tests, package builds and packed
artifact checks pass. These environment failures were not hidden by formatting
or changing unrelated packages.

T012 remains open: DPR coverage is not native browser zoom evidence. T019 also
remains open for the previously deferred component inventory; Badge and Tooltip
were not silently pulled into this bounded twelve-ledger correction.

## React alignment-lab correction (T081-T083)

Owner review corrected the evidence hierarchy after the atlas and dual-overlay
work went green. The red/blue horizontal-keyline and vertical-rhythm labs are
now the primary spacing acceptance surfaces. The 143-row composed atlas remains
valid as a secondary source, state, runtime and accessibility reference, but its
breadth does not prove comparable-part alignment.

The corrected source contract accounts for exactly 142 production renderers:
130 visual renderers included once in seven closed geometry families and 12
named exclusions. This is renderer accounting, not part-level visual proof;
the two results must be reported and reviewed independently.
Heading, Tokens and Typography remain three separate story-only references.
Composites must be decomposed into their spacing-owning parts, each with a stable
live witness. Existing local Table, panel, choice, bullet or status-marker
lookalikes may remain explanatory examples, but cannot close production
component evidence.

The primary guide language is fixed: red/blue means actual outside/content
keylines horizontally and occupied start/end vertically, with actual marker
centres and invariant active-state geometry where relevant. The independent
orange developer and thin pink BF grids are whole-page review aids, not proof
for those parts. Macro application layouts remain outside the comparable
component families and need separate acceptance before any page-layout claim.

The two meeting routes explicitly select the light scheme. Hard-coded dark WIP
paint visible there is tracked as a separate presentation blocker; switching
the demo to dark is not an accepted workaround. Accessibility runs disable both
baseline overlays and fail if colour contrast is incomplete as well as when Axe
reports a completed contrast violation.

This correction is not yet accepted. T081-T083 remain open, so earlier green
catalog, release-shape, browser, accessibility and overlay results do not
authorize T078 or lead-engineer approval. Lit and Svelte remain deferred and no
React result is being presented as framework-parity evidence.
