# Opus review — semantic spacing schema and Pragma recut plan

**Reviewer**: Claude Opus 5, via GitHub Copilot in VS Code.
**Review date**: 2026-09-21.
**Packet**: [`opus-recut-plan-review-request.md`](opus-recut-plan-review-request.md).

This is the planning review required by T004a and FR-030. It is not CP1 taxonomy
approval, not CP2 schema approval, and not permission to mutate, push, merge,
publish or release anything.

## Reviewed identities

| Artifact | Identity |
|---|---|
| Pragma `origin/main` | `1530f31566fe3c4d2fc538f42e99c6909e88faaa` — `feat(NumberInput): migrate to design tokens (#1320)` |
| Donor base | `7193fe082` (also the HEAD of the primary `H:\WSL_dev_projects\pragma` checkout) |
| Donor stack tip | `9b3c9c41f` — shared by `feat/pragma-navigation` **and** `fix/root-gates` |
| Evidence worktree | `fix-root-gates`, 48 tracked changes + 81 untracked files |
| Measurement reference | `feat-bf-shared-alignment` at `e26c650c0`, 104 uncommitted changes |
| Spec 022 evidence | 536 relationships (419 catalog + 117 extra), 178 catalog targets, 12 source-only boundaries |
| Verifier | `evidence/verify-evidence.cjs` — run green on 2026-09-21, output quoted in F13 |
| Spec 024 package | `feat/024-semantic-spacing-token-schema`, files dated 2026-09-21 |

## What I reproduced

Every branch-topology claim in `recut-handoff.md` holds, with two numeric
corrections recorded as P2.

| Claim | Result |
|---|---|
| Ten `feat/pragma-*` worktrees clean | **Confirmed** — all ten report zero changes including untracked |
| One cumulative 11-commit chain | **Confirmed** — `git log --oneline 7193fe082..9b3c9c41f` = 11; all nine earlier tips are ancestors of `9b3c9c41f` |
| 75 commits upstream movement | **Confirmed** |
| Final branch exposes 69 files | **Confirmed** — `git diff --shortstat origin/main...9b3c9c41f` = 69 files, +1552/−1217 |
| 19 files changed on both sides | **20** — including `bun.lock` |
| 20 conflict markers | **21**, across 13 conflicted files (12 content + 1 modify/delete) |
| design-tokens 0.10.0 / typography ^0.40.0 on main, 0.9.0 / ^0.37.0 on the donor | **Confirmed exactly** |

The modify/delete conflict is worth naming: `packages/react/ds-global-form/src/density.css`
is deleted by `c341c30e4` (`feat/pragma-fields`) and modified upstream by
`38c7e7178`. The handoff's instruction to exclude the density deletion from the
Fields cut is therefore correct and load-bearing, not a precaution.

## Progress since the 2026-09-19 evidence review

Real and substantial:

- Relationships went 501 → **536**; catalog targets 177 → 178; owner probes
  51 → 63 per tier; source-only boundaries 6 → 12.
- `verify-evidence.cjs` grew from 3.4 KB to 11.5 KB and now validates the
  object-form `measurementRefs`, closing F16, and resolves tier + collection +
  capture status + target bounds, closing F17.
- `foundation-denominator-audit.md` is new and explicitly works F19, adding
  `.content-flow`, `.ds.side-navigation` parts, `.ds.tabs-item`,
  `.ds.application-layout` / `.ds.view-layout` and `.token-table-container`.
- `styles-owners.json` and `page-witness-reconciliation.json` are new owner
  surfaces.
- All 21 findings are dispositioned in `opus-review-disposition.md`.

That disposition corrected me on five points and I accept all five: the Select
trailing formula reads twice the field inset plus canvas, not the marker gap
(F2); Tooltip, Announcement and Popover measure 8/8 on **both** block edges, so
"every listed container ends broad" was an overgeneralisation (F4); "the only
`em` spacing" and "the only raw `px`" were both false (F9, F10); and my F20
value conflict compared a default against a dense override in the same file.
The manifest's root-cause for the App gap inversion — the provider has no
Section role and Pragma's alias inserts `dimension-400` between Group and
Pattern — is better than mine and should be the one that goes to CP1.

I also accept the rejection of "class A is the whole question" as a closure
rule. It was offered as a way to locate the legacy backlog, and the disposition
is right that using current token consumption as the classifier lets the old
token set decide the taxonomy.

## Findings

Priority: **P0** blocks owner review of this plan. **P1** must close before the
checkpoint named. **P2** is precision and record-keeping.

### P0-1 — The CP1 evidence has no recoverable ref and is not in the preservation list

`recut-handoff.md` preserves ten branch tips. The evidence does not live on any
of them.

- `fix/root-gates` and `feat/pragma-navigation` both point at `9b3c9c41f`. The
  evidence worktree therefore adds **nothing** to the ten refs being preserved.
- That worktree carries **48 tracked modifications** — production CSS for
  Button, Card, Chip, Tabs, Tile, Accordion, ChoicesField, RichChoicesField,
  `field-geometry.css`, `ToggleWrapper.css` and Timeline — plus **81 untracked
  files**, which is the entire Spec 022 package: `bucket-table.md`,
  `component-bucket-matrix.md`, `foundation-denominator-audit.md`, all four
  owner maps and ~29 MB of measurement JSON.
- `feat-bf-shared-alignment`, the worktree every measurement was taken from,
  has **104 uncommitted changes**. `feat-bf-metric-nudge` has 94.

`evidence-manifest.md` already concedes this — "the anchor commit alone is not a
claim that the dirty generated snapshot can be recreated from Git" — but no rule
anywhere protects it. The stop-and-recovery section says "preserve the old
reference tips and all user-owned changes", which reads as covering it and does
not: a `git worktree remove` on `fix-root-gates` or `feat-bf-shared-alignment`
is not blocked by any preserved ref, and both would take CP1 with them.

**Smallest correction**: before any worktree or branch operation, commit or
`git bundle` the three dirty worktrees to named recovery refs, and list them in
the handoff's preservation table alongside the ten. **Owns it**: `recut-handoff.md`
preservation rule; precondition of T026.

### P0-1b — Spec 024 itself is untracked, in a worktree parked twelve days back

The same exposure exists on the Baseline Foundry side, and it was found while
writing this review. `feat/024-semantic-spacing-token-schema` is at `c97ae4f`
(2026-09-09, `fix(forms): restore clickable number steppers`), and the whole
`specs/024-semantic-spacing-token-schema/` directory — 13 files including
`spec.md`, `recut-handoff.md`, `tasks.md`, `evidence-manifest.md` and this
review — is **untracked**. `AGENT-INBOX.md`, `TODO.md` and `docs/specs.md` are
modified and uncommitted.

`feat/023-tiered-list-title-alignment` shares that exact tip, so the branch ref
protects nothing here either. The primary `H:\WSL_dev_projects\baseline-foundry`
checkout is separately parked on `feat/022-pragma-spacing-adoption` at
`29577f6`, not main.

So at present the governing design record and the evidence it governs are both
uncommitted, in two repositories, on branch tips shared with unrelated work.
Every link in this package points at a file that exists only in one working
directory.

**Smallest correction**: commit the Spec 024 package on its own branch before
anything else. It is a documentation-only commit with no gate exposure.
**Owns it**: T004c, extended to cover both repositories.

### P0-2 — Upstream has already landed a different vertical model, so several cuts need splitting rather than rebuilding

This is the adversarial question the packet asks. The answer is more useful than
"the donor is obsolete": upstream's work splits cleanly into a part worth
keeping and a part that conflicts, and the two have almost no overlap.

`362b612d4 feat(Button)!: migrate to design tokens. Adopt new density across the
design system (#1119)` landed upstream after the donor base, followed by
`e5f9de6af` ButtonPrimitive, `b135f611f` Checkbox, `3a88504a2` Radio,
`9d4d53315` Breadcrumbs, `8100cd22c` TextInput, `1530f3156` NumberInput,
`050550fb3` Svelte and `9388df0af fix(button): center icon in the
density-seated Button (#1197)`.

#### The token migrations do not commit to a vertical model

Counting seat references and `--dimension-*` additions per commit:

| Commit | Component | Seat references | `--dimension-*` added | Size |
|---|---|---:|---:|---|
| `9d4d53315` | Breadcrumbs | 0 | 13 | 3 files, +22/−24 |
| `b135f611f` | Checkbox | 0 | 4 | 2 files, +30/−17 |
| `3a88504a2` | Radio | 0 | 7 | 1 file, +24/−16 |
| `8100cd22c` | TextInput | 0 | 2 | 6 files, +35/−21 |
| `1530f3156` | NumberInput | 0 | 1 | 5 files, +25/−21 |
| `e5f9de6af` | ButtonPrimitive | 0 | 3 | 2 files, +15/−12 |
| `362b612d4` | Button + density move | 1 | 12 | 21 files, +260/−97 |

Six of the seven are pure substitutions of hardcoded pixels for primitive token
references. They are small, they are correct, and they are orthogonal to the
taxonomy. The recut should keep them and never re-derive them.

The box-on-grid model is confined to one commit and lands in five files:
`packages/styles/main/src/modifiers.density.css` (definition),
`packages/react/ds-global-form/src/density.css`, Accordion `Item/styles.css`,
React `Button/styles.css` and the Svelte `Button/styles.css`. That is the whole
surface — not "the design system".

#### Where the two models agree

`Button/styles.css` on main declares component-local bindings:
`--button-padding-inline-start/-end: var(--dimension-200)` (16px),
`--button-gap: var(--dimension-100)` (8px), and the icon variant tightens the
start to `--dimension-100` (8px).

| Inline fact | Main | Taxonomy | Site | Docs | App |
|---|---|---|---|---|---|
| Action inset | `--dimension-200` | action inline inset | 16 = 16 | 16 ≠ 12 | 16 ≠ 12 |
| Icon-side start | `--dimension-100` | field inline inset | 8 = 8 | 8 = 8 | 8 ≠ 4 |
| Icon-to-label gap | `--dimension-100` | mark gap | 8 = 8 | 8 = 8 | 8 ≠ 4 |

The two models **agree exactly at Site** on every inline fact. They differ only
because main binds a fixed primitive, so the value does not change per product.

That makes the inline axis additive, not contested. The shape main already uses
— a component-local `--button-*` property bound to a token — is the correct
shape. Adoption changes the right-hand side of three declarations. It is not a
rewrite, and the cut graph should say so.

#### Where they genuinely conflict

Main derives the control's line box from its box — outside-in:

```
--control-seat-line      = density cell − 2 baselines
--control-seat-basis     = target-baseline − (seat-line + 1cap) / 2
line-height: var(--control-seat-line);
padding-block: var(--seat-before) var(--seat-after);
```

Border + pads + line-height then sum to exactly the density cell, so both outer
edges land on grid lines. Button computes `--button-line-height` from
`--typography-text-secondary-*` and the seat rule then overrides it; the file
notes the typographic value is "still exposed for any consumer that reads them",
which is an accurate description of a value that no longer governs the element.

The taxonomy does the reverse. Line-height stays the typographic line; block
padding is cap-derived (`--ds-row-padding-block-*`); a trailing
`--ds-row-compensation-block-end` restores grid phase after the box.

Concretely, for a Site Button — secondary type tier, 14px text whose natural
line is 20px:

| | Main (seat) | Taxonomy (intrinsic row) |
|---|---|---|
| Label line box | **28px** — cell 36 − 2 baselines | **20px** — the type's own line |
| Visible box height | exactly 36px | 36.912px |
| Trailing compensation | none | 3.088px |
| Occupied height | 36px | exactly 40px |
| Rhythm restored by | snapping the box | the trailing margin |

So under the seat, a Button label's leading is 40 % larger than the identical
text set anywhere else on the page. Put a Button inline with a sentence and the
two line boxes no longer match. That is the regression risk to test before
adopting the seat wholesale, and it is a direct consequence of deriving the line
from the box.

The model also already fails inside its own dense cell. `density.css` carries:

```css
/* (measured: dense's 16px line rendered 16.8px tall, pushing the chrome to 24.8).
   So the seat computes with the FLOORED line the UA will actually use */
--seat-line-floored: max(var(--control-seat-line), 1.2em);
```

In App dense the derived line box (24 − 8 = 16px) is smaller than what the
browser will render for 14px text, so the box overflows its own cell by 0.8px
and has to be floored and recomputed. A model that derives the line from the box
will keep meeting that wall wherever the cell is tighter than the type; a model
that starts from the type and adds to it does not have the failure mode.

One further consequence, if Site's baseline unit is 8px: upstream's cells are
built on a 4px unit, and at 8px the Site pair falls off the grid — 36 ÷ 8 = 4.5
and 28 ÷ 8 = 3.5. The App pair survives (32 ÷ 8 = 4, 24 ÷ 8 = 3). So the seat's
Site geometry is silently dependent on the 4px assumption. Note also that
`--density-lh-comfy` is named a line-height but functions as the control cell;
the value actually assigned to `line-height` is the cell minus two baselines.

#### What this means for the cuts

Not "obsolete" — **split**. Each affected cut has a keep half and a replace half:

| Cut | Keep from main | Replace |
|---|---|---|
| 5 Commands | `--button-*` binding shape, `--dimension-*` migration, icon centring fix `9388df0af` | rebind to tiering semantic roles; replace the seat's block rule |
| 6 Field geometry | TextInput/NumberInput token migrations entirely | the `.ds.input` seat rules in `density.css` |
| 8 Marker controls | Checkbox and Radio migrations entirely | nothing — no seat lines in either |
| 15 Navigation | nothing; SideNavigation was rebuilt twice (`4949aea9e`, `57096e694`) | reimplement on the current architecture |

**Smallest correction**: record the owner decision as a scoped one — the
taxonomy supersedes the **seat's block rule** in five named files; upstream's
token migrations are kept and not re-derived. Then prove it before CP1 with a
single before/after comparison of a Site Button label against body copy under
both models. **Owns it**: owner, before CP1; the comparison belongs in Spec 022
evidence.

### P0-3 — The reference implementation omits the spacing-unit term, so the evidence understates the model

Found while checking the comparison in P0-2, and it must be fixed before any
model comparison is run.

The intended model is inside-out: start from the type, add the nudge that seats
it, then add a whole spacing unit per edge where the component needs one, then
subtract the border. The contract in `component-contract.css` on
`feat-bf-shared-alignment` implements only the first and last steps:

```css
--ds-row-padding-block-start: max(0px,
  calc(var(--ds-row-nudge-block-start) - var(--ds-row-border-block-start)));
--ds-row-padding-block-end: max(0px,
  calc(var(--ds-row-nudge-block-start) - var(--ds-row-border-block-end)));
```

Padding is nudge minus border. There is no term for the spacing unit, and no
place to put one.

The measured consequence, from the 2026-09-21 capture:

| Tier | Type | Block padding | Visible box | Occupied |
|---|---|---|---|---|
| Site | 16 / 24 | 5.456 each | 36.912 | 40.000 |
| Docs | 14 / 20 | **0.149 each** | **22.298** | 24.000 |
| App | 14 / 20 | **0.149 each** | **22.298** | 24.000 |

A Docs/App Button carries 0.149px of padding — a pure nudge, no spacing unit at
all — and comes out 22.3px tall. The intended comfortable App Button is 32px.
The Site figure only looks right because the 16/24 cap metrics happen to yield a
large nudge, not because a unit was added.

So the reference implementation currently produces an App comfortable Button the
same height as upstream's App **dense** cell (24px). Comparing the two models
today would show the taxonomy's controls as undersized and would reach the wrong
conclusion — not because the model is wrong, but because a step of it is
unimplemented.

**Smallest correction**: add the per-edge spacing-unit term to the row contract,
remeasure, and only then run the FR-037a comparison. Until that lands, no
measured control height in the evidence should be cited as the model's intended
output. **Owns it**: Spec 022, before CP1 and before T004b.

### P0-2b — The `--ds-*` spacing vocabulary is ours, but the prefix is house style

Worth separating, because the naming objection is weaker than it looks.

`--ds-*` is an established Pragma convention on main, used for 19 distinct
properties across three families: `--ds-color-*`, `--ds-transition-*` and
`--ds-typography-*`. There is no spacing family. The spacing nouns
(`--ds-row-padding-block-*`, `--ds-inline-inset-*`, `--ds-leading-mark-*`,
`--ds-box-*`, `--ds-row-compensation-*`, `--ds-stroke-thickness`) were
introduced by `054d0e5ce feat(styles): centralize intrinsic row and lane
contracts` on `feat/bf-shared-alignment` — our own reference branch.

So the prefix is consistent with house style and `--ds-typography-*` is the
direct precedent for a semantic contract layer named this way. Two rules keep it
defensible:

1. The `--ds-*` spacing layer must be a thin alias over provider names — the
   pattern `component-contract.css` already uses
   (`--ds-inline-inset-field: var(--spacing-inset-field-inline)`) — never a
   second vocabulary with its own values. Duplicated semantics under two names
   is the thing to avoid, not the prefix.
2. Components bind a component-local property to the contract, as main already
   does with `--button-padding-inline-start`. That is one convention, already
   live, and it works for both models.

Under those rules the naming question is settled and needs no CP1 time.


### P1-1 — The coexistence contract names two aliases; the foundation commit repoints nine

`recut-handoff.md` warns about `--baseline-height` and the density modifier.
Diffing `8894e8aa5` (cut 2, `feat/pragma-alignment-contract`) against main in
`packages/styles/main/src/spacing.css` shows nine redirects. For attribution:
that commit is **ours** — Lyubomir Popov, 2026-09-09 — as is every commit in the
eleven-commit donor chain. None of this is upstream's work.

| Alias | On main | In the donor cut | Effect Site / Docs / App |
|---|---|---|---|
| `--space-baseline` | `0.25rem` fixed | `var(--spacing-baseline)` | 8 / 4 / 4 |
| `--baseline-height` | `var(--space-baseline)` | `var(--spacing-baseline)` | 8 / 4 / 4 |
| `--container-gap-tight` | `--space-050` (4px) | `--spacing-gap-field-block` | 8 / 8 / 8 |
| `--container-gap-default` | `--space-200` (16px) | `--spacing-gap-group-block` | 24 / 24 / 8 |
| `--container-gap-loose` | `--space-300` (24px) | `--spacing-gap-pattern-block` | 64 / 48 / 16 |
| `--component-padding-block` | `--space-100` (8px) | `--spacing-inset-surface-block` | 16 / 16 / 12 |
| `--component-padding-inline` | `--space-200` (16px) | `--spacing-inset-action-inline` | 16 / 12 / 12 |
| `--grid-gutter` | `--space-200` (16px) | `--spacing-inset-surface-inline` | 16 / 16 / 12 |
| `--grid-margin` | `--space-400` (32px) | `--spacing-inset-surface-inline` | 16 / 16 / 12 |

The Site baseline move from 4px to 8px is **intentional** and matches the
shipped provider, which resolves `--spacing-baseline` to `0.5rem` for Site and
`0.25rem` for Docs/App. The defect is not the value — it is that nothing
downstream of the alias was recalculated for it. See P1-2.

The last two rows are a different kind of error. Grid gutter and page margin
belong to the grid specification, which FR-021 and FR-022 already exclude from
this taxonomy, and the donor values are wrong against it. Per
`canonical-spacing-spec/specs/grid/draft.md` §2.3, at the Large and X-Large
breakpoints sites and documentation take **32px** gutters while applications
stay at **24px**; outer margins are **32px** at Large, stepping down to 24px at
Small and 16px at X-Small. The donor collapses all of that to one component
inset of 16/16/12, which is neither the old value nor the specified one.

The same commit also adds `--spacing-gap-section-block: var(--dimension-400)`
inside Pragma's `packages/styles`, minting a property in the provider's
`--spacing-*` namespace. Under the cross-repo architecture that namespace
belongs to design-tokens.

**Smallest correction**: replace the two examples with the complete pinned-alias
list above, stated as a hard invariant with a test asserting the computed values
are unchanged; add a rule that Pragma may not define `--spacing-*` properties;
and correct `--grid-gutter` / `--grid-margin` to the specified breakpoint values
as an acknowledged drive-by, called out in the PR body, rather than leaving them
bound to a component inset. **Owns it**: `recut-handoff.md` coexistence
contract, before the foundation cut.

### P1-1b — The Site baseline change is settled policy but is absent from the spec

`baseline-foundry/AGENT-INBOX.md` records it as settled — "`spacing.baseline`
resolves to 0.5rem for Site and 0.25rem for Docs/App/OS" — and the provider
implements exactly that. But `canonical-spacing-spec/specs/spacing/draft.md`
line 187 still reads "In our design system, the default baseline unit is 4px
(previously 8px)", with no tier-specific variant recorded anywhere in that repo.

A CP1 reviewer reading the specification will conclude the Site value is wrong,
and the whole Site column of the taxonomy rests on it.

**Smallest correction**: record the tier-specific baseline unit in the spacing
draft, or record why the provider and the draft differ. **Owns it**:
`canonical-spacing-spec`, before CP1.

### P1-2 — The `--baseline-height` blast radius is larger than "can double", and sentinels are too weak to catch it

Every value in `packages/styles/main/src/modifiers.density.css` is
`calc(var(--baseline-height) * N)` — twelve channels per context, across
`.app` and `.site, .docs`, plus ten pre-namespace back-compat aliases
(`--lh-comfy`, `--pad-inline-comfy`, `--space-lg-comfy` and siblings) that the
file says apps may still read directly.

With the donor redirect, Site's whole matrix doubles: comfortable cell 36 →
72px, `space-lg` 44 → 88px, `padding-inline` 16 → 32px. Because the Site
baseline move to 8px is intended, the fix is not to revert the alias — it is
that these multipliers were written against a 4px unit and must be recalculated
for an 8px one before the alias moves. Note too that `--density-lh-comfy` is
named a line-height but is the control cell; the value actually assigned to
`line-height` is the cell minus two baselines, so 28px for Site.

"Run sentinel browser checks for representative migrated and unmigrated
controls" cannot be trusted against a change this broad. A representative sample
that happens to miss a Site surface passes while the tier is visibly broken.

**Smallest correction**: state the foundation invariant positively — the
foundation cut does not modify `spacing.css`'s alias block at all — and assert
it mechanically (computed-value equality for the named aliases, pre and post)
rather than by sampling components. **Owns it**: `recut-handoff.md`, foundation
review.

### P1-3 — A public density API already ships, and FR-013 contradicts FR-028 because of it

The density acceptance matrix requires that "no public `.dense`, `.comfortable`
or arbitrary density opt-in is introduced", and FR-013 requires that regular
geometry inside an approved host "MUST NOT be a supported public state".

On current main, `packages/styles/main/src/modifiers.density.css` ships
`.app` / `.site` / `.docs` × `.comfortable` / `.dense` as a documented 2×3
matrix, and `packages/react/ds-global-form/src/docs/Density.mdx` instructs
consumers: "Apply one class from each axis on an ancestor (the app root, or the
Storybook toolbar in this workspace)." `BaselineGrid.mdx` and
`SeatingByElement.mdx` document the seat.

So a consumer can already place `.comfortable` on an ancestor and obtain regular
geometry anywhere, including inside a future approved tight host. FR-013 is
unreachable without overriding or removing that class API, and FR-028 forbids
removing it without the CP2 disposition. The two requirements cannot both hold
as written.

A second collision sits underneath: FR-015 forbids density altering line height,
while the density axis being "retained" is one whose primary output *is* a line
height. Calling both "the independent density axis" hides that these are two
different systems.

**Owner position, recorded 2026-09-21**: keep the density concept and reuse the
existing mechanism, but remove the free choice. Dense is applied only where a
sanctioned tight context calls for it — a table cell or similar — and never as a
per-instance decision a downstream designer makes for one button and not
another. That resolves the contradiction by narrowing, not by discarding: the
channels and the cascade stay, the `.comfortable` / `.dense` opt-in goes.

**Smallest correction**: name the live system explicitly in FR-025 / T017a as a
required migration input — the classes, the twelve `--density-*` channels, the
ten back-compat aliases and the three docs pages — and record the narrowing
decision above as the target state: mechanism retained, public selector retired
through the FR-025 disposition, dense reachable only through an approved
provider. Scope FR-013 to "through the new schema" until that retirement lands,
since until then a `.comfortable` ancestor can still defeat it. **Owns it**: CP2.

### P1-4 — The denominator is React-only; the affected consumer set is not

`packages/svelte/ds-app-wpe/src/lib/components/Button/styles.css` reads
`--control-seat-*`, and `050550fb3 feat(svelte): migrate to design tokens (#1311)`
landed upstream. T005a scopes reconciliation to "reusable owners — including
Modal and recently migrated controls", and the cut graph contains only
`packages/react/*` slices. FR-025 already mentions non-React consumers for the
density API; the denominator does not inherit that.

**Smallest correction**: extend T005a to non-React packages that consume shared
spacing or seat channels, and either add a Svelte slice or record an explicit
boundary. **Owns it**: T005a, before CP1.

### P1-5 — The donor Commands cut carries an undeclared breaking change

`98cf5be36 feat(react)!: align command component spacing` is in the chain with a
`!`. The cut graph's per-cut manifest has no semver column, so the rebuilt cut's
release impact is unplanned — and a breaking title on a foundation-adjacent
component changes the landing order for every dependent package.

**Smallest correction**: add an "expected semver impact" column to the per-cut
manifest and populate it during T026a. **Owns it**: `recut-handoff.md`.

### P2 — precision and record

- **P2-1** The handoff's "19 files / 20 conflict markers" should read 20 files
  and 21 markers across 13 conflicted files, with the commands recorded so a
  reviewer reproduces the same numbers:
  `git merge-tree --write-tree --name-only origin/main 9b3c9c41f`.
- **P2-2** The 69-file figure is the three-dot merge-base view. The two-dot
  divergence is **1305 files, +7663 / −138165**. Stating both prevents anyone
  reading 69 as the content distance.
- **P2-3** `verify-evidence.cjs` shells out to `rg` via `execFileSync` and dies
  with a stack trace when ripgrep is absent. The manifest's reproduction block
  lists only `node evidence/*.cjs`. Document the prerequisite or use Node's own
  directory walk.
- **P2-4** The verifier emits `"evidenceComplete": true` while T005 and T005a
  are open. That is exactly the reading FR-031 exists to prevent. Rename it
  `structurallyComplete`.
- **P2-5** The primary checkout `H:\WSL_dev_projects\pragma` is on `main` at
  `7193fe082` — 75 behind, one dirty file. `AGENTS.md` requires the root gate to
  run from the repo root; that root is currently stale.

## Verdict on the eight conclusions

| # | Conclusion | Verdict |
|---|---|---|
| 1 | Contract is relationship-based, not the provider record | **Holds.** The contract separates primitive, semantic and resolution layers and marks every example `status: candidate`. |
| 2 | Baseline and page/grid correctly excluded | **Holds in the spec, violated by the donor foundation.** FR-021/FR-022 exclude grid gutter and page margin; `8894e8aa5` repoints both. See P1-1. |
| 3 | Branches clean, cumulative, 75 behind, donor-only | **Holds, reproduced exactly.** |
| 4 | Sequential fresh-main cuts are the smallest safe recovery | **Holds as a strategy**, and P0-2 refines it: the affected cuts split into keep and replace halves rather than needing full rebuilds. |
| 5 | Cut graph covers likely owner classes, partition after CP1 | **Partially.** React coverage is good; non-React is missing (P1-4). |
| 6 | One density authority, no public chooser | **Not yet true.** A public chooser already ships and must be retired through CP2 (P1-3). |
| 7 | Crosswalk keeps the gates distinct | **Holds.** The CP2 naming disambiguation is handled well. |
| 8 | Coexistence prevents a foundation alias change reaching unmigrated consumers | **Intent holds, mechanism insufficient.** Two aliases named, nine repointed; sampling sentinels (P1-1, P1-2). |

## Answers to the adversarial questions

- **Can anything escape the denominator?** Yes — non-React consumers of the seat
  channel (P1-4), and everything upstream changed in the 75 commits beyond Modal
  (P0-2).
- **Does any cut mix concerns or depend on a later cut?** Not in the graph as
  drafted; the Select conditional and the Fields/Markers splits are correctly
  separated. The dependency problem is the reverse one: cuts 5, 6, 8 and 15
  depend on a decision that has not been taken (P0-2).
- **Should foundation cuts be combined or reordered?** No. Cut 2 must stay
  separate precisely because P1-1 shows it is the dangerous one.
- **Does main make a legacy cut obsolete rather than stale?** Partly, and the
  boundary is sharp: upstream's token migrations supersede the donor's
  equivalent work and should be kept; upstream's seat block rule conflicts and
  is confined to five files. Commits and the split table are in P0-2.
- **Does the density contract leak a public API?** The *new* contract does not.
  The *retained* one already has one, and the owner's position is to retire the
  selector while keeping the mechanism (P1-3).
- **Are portal ancestry and bridges unambiguous?** Yes. §5 and §6 of the schema
  contract are precise, and the "one identifier may not be both provider and
  reset" rule closes the same-element ambiguity.
- **Does the plan prematurely remove a compatibility API, or conflate spacing
  density with typography?** It does not remove prematurely. It does conflate:
  the retained axis is line-height-driven while FR-015 forbids that (P1-3).
- **Can the foundation land without changing legacy consumers?** Not as the
  donor patch is written. It can with the pinned-alias invariant in P1-1.
- **Are the gate, rebase, rollback and state rules sufficient?** Yes, with one
  hole: nothing protects uncommitted evidence (P0-1).
- **Is any historical finding being replayed after newer evidence superseded
  it?** Yes, one — the coexistence contract's description of current main's
  density is written from the donor base. It is still accurate for
  `--baseline-height` (I verified `spacing.css:31` on main), but it predates
  `#1119`, which is why it understates the scope.

## Is the plan safe for owner review?

**Yes, with P0-1 and P0-1b actioned first.** The strategy is sound and the
branch analysis is honest and reproducible. But P0-1 and P0-1b are a live
data-loss exposure that should be closed before anyone touches a worktree —
right now neither the evidence nor the plan that governs it has a recoverable
ref — and P0-2 is a decision the owner has to take before CP1 can mean
anything, because the taxonomy's adoption path currently assumes it may replace
a control model that shipped upstream three weeks ago.

## On the number of open worktrees

Fifteen Pragma worktrees, 8.1 GB, plus four in Baseline Foundry. The exposure is
not the count — it is that three of them hold the only copy of something.

The ten donor worktrees are individually redundant: every earlier tip is an
ancestor of `9b3c9c41f`, so one worktree at that tip reproduces all of them
through `git show`. Seven of them carry no `node_modules` and occupy 0.02 GB
each, so they cost little; `git worktree remove` on them is safe and reversible
because it does not delete the branch. The three dirty ones are the opposite:
cheap to keep, unrecoverable to remove. Consolidation should therefore run in
that order — bundle the three, then thin the ten if the disk matters.

## What I did not verify

- I did not run Pragma's root gates, build any package, or start the reference
  Storybook; no geometry was measured in this review.
- I did not inspect the live design-tokens source or confirm what `0.10.0`
  contains beyond its presence in Pragma's manifests. The provider's semantic
  spacing names appear on main only inside the CLI's generated graph pack, so no
  component CSS consumes them yet — but I did not audit the package itself.
- I did not review `research.md`, `data-model.md`, `quickstart.md` or
  `density-contract.schema.json` line by line; my schema comments come from
  `contracts/semantic-spacing-schema.md` §§1–7 and `spec.md`.
- The Spec 022 evidence numbers are read from the committed artifacts and the
  green verifier run, not independently re-measured.
