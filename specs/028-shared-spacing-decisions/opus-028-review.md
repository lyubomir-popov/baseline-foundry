# Opus review – BF Spec 028

Date: 2026-10-06
Request: [`opus-028-review-request.md`](opus-028-review-request.md)
Target: source `12d47ab`, demo `db10d20`, tip `4954c6e` (worktree clean at review)

## Verdict

**Changes requested before merge.** Owner visual review can proceed on the
current demo – the before/after comparison is faithful – but two items block a
merge to BF main, and four should be fixed or explicitly accepted first.

## Independently verified

- **Bundle fidelity.** Rebuilt `6deca997` and `12d47ab` in a scratch worktree:
  all eight tier bundles are byte-identical to `demo/spec-028/before/*.css` and
  `dist/tiers/*/styles.css`, and match `provenance.json`. In the live page all
  eight version/tier combinations report `PASS · bundle + identical DOM`, with no
  horizontal overflow.
- **Evidence integrity.** Overall manifest SHA-256 `204fdec1…` matches; 30/30
  listed files and 1549/1549 root-manifest files hash-verify. Boundaries
  (`db10d20`, `c53b12b`, first-seal correction) are internally consistent.
- **SP-13.** Recomputed from built `tokens.json` and emitted CSS, not the
  agent's oracle: 28/28 roles close to the grid, have c ≥ n, and are minimal.
- **SP-6/3/10/14/15 values.** The resolved artifact matches the ruling's pixel
  values. Continuation equals field inset + body size + mark gap in all four
  tiers (2 / 1.875 / 1.875 / 1.25rem).
- **SP-2 rows.** On `spacing-vertical.html`, every text-bearing control shares
  one exact text top per tier, at 40 / 32 / 32 / 24px.
- **Popup escape.** After the change, the Card popup crosses the following Card
  and receives the hit test in every tier.

## Blocking

### B1 – Unwrapped native fields lose their boundary entirely

The after bundle sets `border: 0` on `.bf-input`, `input[type=text|number|search|password|email|url]`,
`textarea` and `select`. Their only stroke is now the `.bf-field-boundary`
overlay, so a field outside that wrapper renders with **no boundary**:

- not in normal mode
- not in forced colours (base: transparent-to-CanvasText border-bottom)
- no validation-state border colour

Confirmed in Chromium: a bare input and select have a 0px border and no shadow
after the change, against a visible border-bottom before. This affects existing
consumer markup inside `.bf-theme`, including third-party forms, and it is an
accessibility regression (WCAG 1.4.11). The request presents the wrapper as an
anatomy change, but it does not say that unwrapped fields render with no
boundary.

Fix: give unwrapped fields a compatibility boundary, at least an inset
block-end `box-shadow` on the field itself plus a forced-colours fallback. Add a
breaker test asserting that a bare field is never boundaryless. Document the
migration in the PR/CHANGELOG.

### B2 – Governing rulings are not activated on canonical `main`

`7169231` exists only on the canonical branch `docs/bottom-compensation-spec`.
Canonical `main` (`cad4aac`) still lists SP-5 as *Experimental*. The rulings
file says implementation activates only after the owner merges to `main`.
`done` on the board is fine. Merging BF before that canonical merge is not,
unless the owner records an explicit exception.

Related: `config/canonical-spacing.resolved.json` and `validateCanonicalSpacingArtifact`
pin the **short** hash `7169231` from an unmerged branch. A squash or rebase on
merge leaves the provenance unresolvable. Re-pin the full hash after the
canonical merge. The artifact also still names `@canonical/design-tokens` and its
resolver as the source, but the products are no longer that resolver's output.
Regenerating from the resolver would silently revert every working value, so add
a guard or a note.

## Should fix (or owner explicitly accepts)

### S1 – Every table cell became a clipping containing block

`table.ts` applies the stroke owner with `anchor: "relative"` to
`:where(.bf-theme) :where(th:not([aria-sort]), td)`. That is every cell in every
table under the theme, not only `.bf-table`. Cells already have `overflow: hidden`.
An absolutely positioned descendant with no positioned wrapper used to escape the
cell. Now it is clipped to the cell. A probe confirmed it: a 150px absolute child
was visible below the cell before and is clipped after. SP-5 requires
containing-block establishment to be checked. The only sentinel is the
notification. Narrow the selector to `.bf-table`, or avoid the clip, and add a
table-cell breaker.

### S2 – Card `overflow: auto → visible` is an unlisted behaviour change

`c3af935` changes Card overflow, so wide content in a Card (code, tables, long
tokens) now overflows instead of scrolling. That change, not the stroke overlay,
is also why the demo's popup check fails before and passes after. The demo and
the change list present it as a paint-ownership result. List it as its own
change, and decide whether Card content needs an inner scroll affordance.

### S3 – `::after` applied universally, including leaf controls

SP-5's base construction is an inset `box-shadow` over a zero border. The
`::after` overlay is the default *"when children can paint a background"*. BF
applies `::after` plus `position: relative` to every Button, Chip, ChoiceRow,
tab, pagination link and cell. That widens the containing-block surface behind
S1. Either record the owner's confirmation that `::after` is the default for leaf
controls too, or keep owner-level inset shadows where no child can paint a
background.

### S4 – Firefox is outside both the evidence and the stated limits

The density policy relies on nested `@scope` and `:has(:scope …)`. All browser
evidence is Chromium-only, and the limits name only Safari and Windows contrast.
Either test Firefox or add it to the explicit human/platform limits.

## Minor

- **M1 – Weakened assertion.** The interface and nested-host text-top checks went
  from exact equality to modulo-baseline phase, which would accept a control
  shifted by a whole unit. The live data shows the reason: the plain-text
  reference sits 4px above the 32px Docs/App controls. Keep exact equality
  among the components themselves and use phase only against the reference.
- **M2 – Review harness.**
  - The shell's gaps consume `--bf-section-space-shallow` and `--bf-field-gap`
    from the swapped bundle, so part of the visible delta between specimens
    comes from the harness, not the components. That contradicts "the shell only
    positions".
  - Canvas padding and gap use `vw` clamps, so the baseline overlay drifts out of
    phase at intermediate widths (for example a 60px gap on the 8px Site grid at
    1000px).
  - "Mobile" narrows the canvas only, so the bundle's 17 width media queries
    never fire. Use a real 390px viewport for mobile review.
  - The containing-block check in `review.js` only tests top/right containment,
    which most layouts pass.

## Addendum – owner visual pass: the review page does not dogfood BF

Owner observation: the green and blue styling, the toolbar and the baseline are
not BF, and the card shadows look very different from BF.

### D1 – The review page uses its own shell instead of BF's demo runtime (blocking for the review gate)

Spec 028 says to "make those demo surfaces the visual review target". Every
other BF demo page (`controls.html`, `demo/spec/*`) uses `spec-shell.css`,
`spec-runtime.js` and `page-chrome`. That gives it:

- BF's tier select and tone toggle
- the BF `u-baseline-grid` overlay through `initBaselineGridToggles`
- `bf-page` and `bf-section` layout
- the `init*` behaviours for tooltips, menus and side navigation

`demo/spec-028/` replaces all of that with a hand-written `review.css` and
`review.js`:

- **Colours:** a slate `#111827`/`#1e293b` toolbar, green `#86efac` status
  text, blue dashed debug outlines, and `system-ui` and monospace fonts.
- **Baseline overlay:** a red `repeating-linear-gradient` that starts at the
  canvas edge. Canvas padding and section gaps use `vw` clamps, and the specimen
  rows use `align-items: baseline`. The overlay is not BF's grid, and its phase
  drifts from BF's grid. That is the "baseline is off".
- **Layout:** the shell's gaps read the swapped bundle's tokens, so the shell
  itself moves between before and after.
- **No BF behaviour:** no `init*` call runs, so the menu, tooltip and side
  navigation specimens are static.

The page's assertions check only harness properties: sticky controls, hashes,
DOM identity and no overflow. None of them compare against a BF demo, which is
why the gates never caught this.

Fix: rebuild the comparison on BF's own chrome. Use `#spec-tier-stylesheet`
with a before/after switch added to `spec-runtime`/`page-chrome`, BF's
baseline-grid toggle, and `bf-page`/`bf-section` layout. Better still, run the
existing BF component and spec pages with a bundle-version switch rather than a
bespoke specimen page.

### D2 – The Tooltip frame and shadow wrap the whole tooltip (real after-bundle regression)

`tooltipMessageStroke` uses `anchor: "existing"`, but a detached
`.bf-tooltip-message` is `position: static`. Its `::after` (stroke plus
`0 12px 32px` elevation) therefore anchors to the positioned `.bf-tooltip`
wrapper. It frames and shadows the trigger button and the message together, as
one full-width box.

- **Before:** the frame and shadow sit on the message itself, about 320px wide.
- **After:** they cover the wrapper, about 660px wide.

BF's own `demo/components/tooltip.html` shows the same box under the after
bundle, so this is not a harness artefact. The paint gates missed it. The fix
is to anchor the message (`anchor: "relative"` for the static/detached form),
plus a breaker test comparing the overlay rect with the message rect.

## Board rows

SP-1, FR-061a, Nudge, SP-2/3/6/7/8/9/10/11/12/13/14/15 are supported by real
consumers and checks as claimed; the OS scope notes and the FR-039b metric-nudge
distinction are correctly worded. SP-5 is implemented as specified for wrapped
owners. Its board note should name B1 and S1 until they are fixed.
