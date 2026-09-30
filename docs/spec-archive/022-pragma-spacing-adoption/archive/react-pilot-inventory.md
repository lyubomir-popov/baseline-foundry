# React pilot inventory

This was the first frozen breadth boundary for the lead-engineer milestone. The
owner reopened it on 2026-09-12 because stable global exports plus Field routes
were not exhaustive enough to expose every border and composition edge case.
The revised milestone is a production-quality, exhaustive React reference, not
a whole-Pragma or cross-framework completion claim.

The 2026-09-12 source audit found 140 production React render/composition
modules across the eight initially named component packages, plus two public
visual components in `@canonical/react-tokens`: 142 rendered sources in total.
The lists below are entry-point
summaries only. T072 requires a machine-readable row for every public and
internal rendered module, reconciled against source, CSS and stories. A parent
story may exercise an internal leaf, but it may not erase that leaf from the
inventory.

The horizontal and vertical spacing labs are the primary part-level visual
proof. The composed React catalog remains the secondary renderer, state and
runtime breadth reference. These are independent gates: the typed map can
account for all 142 production renderers (130 included plus 12 reasoned
exclusions) while a composite still lacks proof for one or more of its real
spacing-owning parts. Local Table, panel, bullet or status-dot lookalikes may
teach a rule but cannot close a Pragma renderer's witness requirement.

## Included: `@canonical/react-ds-global`

The 18 stable root exports:

- Accordion
- Badge
- Breadcrumbs
- Button
- Card
- Cards
- Chip
- ContextualMenu
- Icon
- InlineCode
- KeyboardKey
- KeyboardKeys
- Popover
- Spinner
- Tabs
- Tile
- Timeline
- Tooltip

This package contains 48 production render/composition modules. `Heading` is a
story-only native-typography specimen, not a production component or root
export, and remains catalogued as a specimen rather than represented as an
implementation.

## Included: `@canonical/react-ds-global-form`

Form and Field are public. The composed Storybook must exercise Form plus all
19 built-in component-backed Field type routes:

- Checkbox
- Choices
- Color
- Combobox
- Date
- DateTime
- FileUpload
- Hidden
- Number
- Password
- Phone
- Range
- Rating
- RichChoices
- Select
- Switch
- Text
- Textarea
- Time

Text covers the default native text-input types. The consumer-supplied
`custom` Field route has no framework component to inventory. The package contains 55
production render/composition modules. Low-level inputs, Field implementations,
wrappers and rendered support leaves are separate inventory rows even when a
public Field route supplies their browser evidence.

Pragma `9cbc3a2df` supplies the first exhaustive catalog slice: all 49 Global
rows and all 55 Form rows are tied to real rendered DOM. Every built-in Form
specimen preserves the production `Form > Field` relationship; a 320px Site
check proves the catalog and every specimen remain bounded. The remaining 39
App, Launchpad, product-button and token rows are still required before the
catalog is complete.

## Additional required React inventory

The following `react-ds-global` exports are marked `_work_in_progress` and now
do block the exhaustive React pilot: Announcement, CategoriesSection, ChatSection,
DescriptionSection, grid, IconSection, Label, Link, Rule, Section, SkipLink and
TSection. Heading has a source folder and story but is not in the public root
barrel; it is still included. Direct `RatingInput` is included separately from
the public Rating Field route.

Product-specific visual packages are now included: `react-ds-app`,
`react-ds-app-launchpad`, `react-ds-app-anbox`, `react-ds-app-landscape`,
`react-ds-app-lxd` and `react-ds-app-portal`. Already accepted work in those
packages, including SideNavigation and the Button forks, remains reusable
evidence but is now also a completion dependency. Confirmed root exports are:

- `react-ds-app`: ApplicationLayout, ContentLayout, SideNavigation and
  ViewLayout;
- `react-ds-app-launchpad`: DiffChangeMarker, EditableBlock, FileTree,
  GitDiffViewer, MarkdownEditor and RelativeTime; and
- `react-ds-app-anbox`, `react-ds-app-landscape`, `react-ds-app-lxd` and
  `react-ds-app-portal`: each package's Button.

Pragma commit `a4fc62ad2` froze the initial source/export audit. The completed
manifest at `362eeae1e` has 145 records: 142 production render sources and three
story-only specimens. The composed catalog has 143 rows: every production
source plus Heading. Tokens and Typography remain explicit story-only
documentation-artwork records but are not presented as component rows. Every
separately rendered internal component or subcomponent that already owns
production CSS or a Storybook story is present, including form inputs and Field
support leaves. A parent route may provide the rendered test case, but the child
remains an explicit record with its own composition and border disposition.
T073's exact CSS reconciliation accepts 315/315 border declarations across 62
authenticated paths, with no unresolved or unaudited React border.

## Additional visual package

`@canonical/react-tokens` publicly exports styled `TokenTable` and
`TokenSwatch`, with production CSS and stories. It is part of the exhaustive
React catalog unless the owner later approves an explicit documentation-tool
exception with its own evidence. Its current scanner quarantine does not make
it non-visual.

The border audit also retains 34 declarations outside those two live renderer
styles: 18 belong to the package's own Storybook documentation pages and 16 to
shipped, unimported legacy BEM compatibility CSS. They remain source-audited
under T073. The documentation CSS uses its real stories for evidence; the
legacy CSS needs a small compatibility fixture or an explicit owner-approved
removal. Neither is represented as a fake component row in the 143-item
catalog.

## Non-visual packages

`head`, `hooks`, `i18n`, `ssr` and the Cloudflare, Deno and Vercel SSR adapters
are non-visual. `router` renders unstyled application infrastructure such as
Link and Outlet but owns no design-system CSS or spacing; record it as rendered
infrastructure, not a visual Pragma component. Lit and Svelte packages are the
only framework exclusions authorized now.

## Final external-review clarifications

The transition result must not be summarized as if every item was rewritten.
Across the final React range, 95 transition identities reached zero: 57 were
migrated to the shared contract and 38 became exact, evidence-bearing sanctioned
classifications. The package split is Global 39/11, Global Form 10/18,
Launchpad 8/8 and App 0/1 (migrated/classified). The classifications cover fixed
artwork, genuinely inline minima and the previously accepted compact nested
Badge typography. They are accepted, but remain classifications.

The 12 discovery exclusions are **non-spacing-owning**, not all non-renderers.
Three `icons.tsx` modules and `GitDiffViewer/fixtures.tsx` return JSX but own no
independent spacing or row geometry. The shipped fixture under `src/lib` is a
deliberate audited exclusion; moving real component geometry into it would make
the source gate fail.

The stable Storybook manager shell currently requests
`@canonical/styles-typography/fonts.css` and receives a 404. The preview iframe,
which owns all geometry evidence, has zero failed font requests, loads the real
Ubuntu Sans faces and resolves `1cap` at the authenticated face's cap ratio.
This manager-only request is known and measurement-irrelevant; it must not be
used to waive preview font authentication.

## Part-level visual-proof completion

This is the concrete React-only completion checklist for T081. A checked
renderer record is source accounting, not an automatic check for every item
below. Each proof must use a stable selector on the actual production DOM or
pseudo-element, show the relevant pressure/state case, and appear in the
horizontal or vertical primary lab. The current broad family outlines are
navigation aids until these decompositions are complete.

- [x] **Padded and framed boxes:** expose outside edge and border-aware content
  inset for Announcement, Button variants, Chip, form fields, RichChoices
  cards, Card/Tile sections, Popover/Tooltip, FileTree, MarkdownEditor,
  GitDiffViewer and TokenTable. Keep Label, InlineCode and KeyboardKey in this
  category when they paint a frame; do not call them unboxed text.
- [x] **Rows and cells:** expose the actual row box and its content box for
  Accordion, ContextualMenu (including `SubMenu`), Tabs, Choices, FileUpload,
  Combobox, SideNavigation, FileTree, GitDiffViewer, MarkdownEditor toolbars
  and tabs, and TokenTable rows/cells. A parent renderer id does not prove its
  internal item or cell.
- [x] **Marker-led content:** expose the real marker centre and the first text
  keyline for Announcement icons, Accordion chevrons, checkbox/radio/switch
  choices, Breadcrumb separators, Button/Chip icons, ContextualMenu markers,
  Timeline, SideNavigation, FileTree, DiffChangeMarker, MarkdownEditor icon
  buttons and Tooltip caret/trigger cases. Use a wrapped-label pressure case
  where first-line alignment matters. Do not claim a RichChoices native marker
  witness when its native input is visually hidden; prove the visible selected
  paint separately.
- [x] **Stateful emphasis edges:** pair resting and active geometry only where
  a production state can change the rendered footprint: Tabs active bar,
  SideNavigation 3px active edge, FileTree selection/focus, RichChoices
  selection/focus, and ColorInput's selected/focused swatch. Assert that the
  state paint moves neither the outer box nor the content keyline; the fixture
  must actually activate the requested state.
- [x] **Static seams, dividers and fills:** Announcement's configured emphasis
  edge, Accordion divider, ContextualMenu fills/separators, Section border,
  field validation/focus paint, MarkdownEditor seams and TokenTable/GitDiff
  dividers are normal-state paint evidence unless their production CSS gains a
  footprint-changing state. Record the real selector and its outside/content
  or zero-layout-paint coordinate. Do not fabricate a before/after comparison
  for a divider or fill that has no corresponding state.
- [x] **Sectioned composites:** decompose Card, Tile, EditableBlock and WIP
  CategoriesSection, ChatSection, DescriptionSection, IconSection and TSection
  into each real title/header, content/payload and footer/action section that
  owns spacing. Prove seams and section keylines rather than one outline around
  the parent.
- [x] **Unboxed text:** prove ordinary title/body/metadata leaves, field labels,
  descriptions and errors, links, Timeline content and RelativeTime using their
  actual occupied starts/ends and text keylines. Rule, Spinner, Icon,
  DiffChangeMarker, Badge and other paint-only leaves need a paint/marker
  oracle, not a fictional text box.
- [x] **Macro-layout boundary:** keep the six global/App application layouts
  out of the seven comparable component families. `InvisibleWrapper`,
  `withTooltip`, `withToggleWrapper`, dispatching `Field`, `HiddenField` and
  `HiddenInput` retain explicit nonvisual or hidden-output exclusions. Any
  later page-layout approval needs its own route and criteria; none of these
  exclusions closes component-part evidence.
- [x] **Reconcile witnesses independently:** reject missing or dead selectors,
  duplicate part assignments and lookalike-only witnesses even when the
  142/130/12 renderer partition remains green. Report renderer coverage and
  visual-part coverage as two separate totals at review.

## Historical atlas exit evidence

The following secondary atlas evidence was green locally at `362eeae1e`. It is
reusable breadth evidence, but it predates and does not close the primary-lab
part checklist above; the external T078 review remains outstanding.

- One stable composed Storybook contains every included item in a normal state
  and each relevant pressure state: long or wrapped copy, narrow width,
  disabled/selected, RTL and multiline where the component supports it.
- Chromium covers the complete inventory. Firefox and WebKit cover each
  distinct layout family rather than repeating every equivalent state.
- Package build, public imports, SSR/hydration, interaction and accessibility
  checks are green.
- Transition entries under every React design-system package reach zero. The
  global scan remains active; deferred Lit/Svelte entries may only stay frozen
  or decrease.
- An independent adversarial review is clean before lead-engineer approval is
  requested.
- A machine-readable manifest records package, source, export/story status,
  composition family, actual border widths per edge and state, required states,
  scanner debt and evidence route for every row. A reconciliation test fails
  when a production React render module with CSS or a story is missing.
