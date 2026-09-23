# Opus execution-scope review — pre-T004d2 / pre-T004g junction

**Reviewer**: Claude Opus 5, via GitHub Copilot in VS Code
**Review date**: 2026-09-22
**Request**: `prompts/opus-spec-024-pre-t004d2-scope-review.md`
**Reviewed worktree**: `H:\WSL_dev_projects\pragma\.claude\worktrees\feat-bf-inside-out-geometry`
at exact recovery base `313ee82c13a126b779b9bd75902da5af13c28505`
**Scope**: follow-up to `opus-pre-cp1-execution-review.md`. Custody, the historical
branch base and the settled model are not reopened. T004d0, T004d1b and T004d are
treated as accepted context.

All file references below are relative to the spike worktree root unless stated
otherwise.

---

## Verified state

Custody is intact.

- The reference worktree matches the recovery snapshot byte for byte:
  `config/react-alignment-coverage.ts` and
  `scripts/check-react-alignment-coverage.test.ts` hash-compare identical to
  `313ee82c:<path>` (`f2d3ac06…`, `10d80b58…`).
- The three Spec 022 worktrees still show exactly the recorded counts:
  `fix-root-gates` 44 tracked / 129 with `-uall`, `feat-bf-shared-alignment`
  85 / 104, `feat-bf-metric-nudge` 81 / 94.
- The spike is at `313ee82c1` with five modified files plus the carrier.
- Private-channel confinement holds. The only `_spike` occurrence outside the
  carrier is the import at `packages/styles/main/src/component-contract.css:9`.
- `git diff 313ee82c` adds no `--spacing-*` declaration anywhere.

**Verdict on T004d0**: accepted. The four FR-050 channels, the expiry header and
the provider-role annotations are present and correct; the bindings match FR-050
exactly; nothing consumes a `--_spike-*` property outside the carrier.

**Verdict on T004d1b**: accepted. All eight production roles carry
`--_typography-<role>-first-baseline-offset` and the existing nudge formulas
consume it. The substitution is exactly algebraic and the published nudge values
are unchanged.

---

## Findings by severity

### P0-1 — §7a's phase premise is false in 14 of 18 product × heading combinations

§7a justifies putting the phase term at block-start with the claim that "heading
line-height is already a whole multiple of the body line advance". The installed
provider disagrees.

Evidence: `packages/styles/main/node_modules/@canonical/design-tokens/dist/modifiers.typography.css`,
with `.app` at line 184, `.docs` at line 360 and `.site` at line 535; primitive
values from `sets.primitive.css` (`--dimension-250: 1.25rem` = 20px,
`--dimension-300` = 24px, `--dimension-400` = 32px, `--dimension-500` = 40px,
`--dimension-600` = 48px).

| Product | body advance | H1 | H2 | H3 | H4 | H5 | H6 |
|---|---:|---:|---:|---:|---:|---:|---:|
| App | 20 | 32 ✗ | 32 ✗ | 24 ✗ | 24 ✗ | 20 ✓ | 20 ✓ |
| Docs | 20 | 40 ✓ | 40 ✓ | 32 ✗ | 32 ✗ | 24 ✗ | 24 ✗ |
| Site | 24 | 48 ✓ | 48 ✓ | 32 ✗ | 32 ✗ | 24 ✓ | 24 ✓ |

A block-start phase term lifts the first baseline. It cannot make line 2 of an
App H1 land on the body grid, because that line starts 32px below line 1 while
the adjacent column steps 20px.

**T004d2's done-when — an H1 of one, two and three lines aligning in all three
products — is therefore unsatisfiable in App as written.** That is the acceptance
criterion, not an aside. The underlying fix is a type-scale change, which FR-037
keeps out of this programme.

This is a new contradiction, so it is in scope. It does not reopen T004d.

### P0-2 — `alignment.css` alone cannot carry T004d2, and the obvious shortcut silently redefines a published contract

Headings apply their geometry at `packages/styles/typography/src/elements.css:136-140`:

```css
  margin-block: 0;
  padding-block-start: var(--_typography-text-nudge-start);
  padding-block-end: 0;
  margin-block-end: var(--_typography-text-nudge-end);
```

Changing only `alignment.css` leaves the applied properties untouched — inert —
unless the implementer redefines `--typography-<role>-nudge-block-*`.

That is worse than it looks:

1. `--typography-<role>-nudge-block-end` is **not** a metric nudge. It is
   `calc(var(--spacing-baseline) - var(--typography-<role>-nudge-block-start))`,
   i.e. already a closure term against the baseline.
2. The nudge pair is consumed by 20 files, including
   `packages/svelte/ds-app-launchpad/scripts/check-packed-export.ts` and
   `scripts/check-css-contract.test.ts`.

Redefining it is a cross-package contract change disguised as a spike edit.
Outcome 1 of the review request is correct: authorise `elements.css`.

### P1-1 — "remove the grid redirects without replacing them" is unsafe as worded

Deleting `packages/styles/main/src/spacing.css:55-56` leaves:

| Consumer | Behaviour after deletion |
|---|---|
| `packages/styles/main/src/grid.css:102,104` | silently falls back to a `1.5rem` literal — resolved Site value changes with nothing on screen to reveal it |
| `packages/react/ds-global/src/lib/group/Cards/styles.css:56-57` | no fallback; `gap` becomes invalid |
| `packages/svelte/ds-app-wpe/src/lib/group/Cards/styles.css:21-22` | no fallback; **outside the permitted file list** — this is the FR-036 case |
| `apps/react/storybook-hub/src/docs/Grid.stories.tsx:29,81,97` | `--grid-margin` with no fallback; padding collapses to zero |

### P1-2 — the spike's accepted work is entirely uncommitted

`git status --porcelain` in the spike returns five modified files plus the
untracked carrier, and no recovery ref exists for `feat/bf-inside-out-geometry`.
T004d0, T004d1b and T004d are accepted and unpreserved. FR-038 is the spec's own
rule and applies here exactly as it did at T004c.

### P1-3 — the whitelist / completeness contradiction is real

Confirmed by sweep. `rg` is not on `PATH` in this environment (the recorded
trap), so the reviewed command was run as its `git ls-files '*.css'` +
multi-line regex equivalent. It returns the three files named in the request
plus `packages/react/ds-app/.storybook/side-navigation-spacing-contract.css:11,51`.

The chains are live, not undefined-with-fallback:

- `--container-gap-tight|default|loose` are declared at
  `packages/styles/main/src/spacing.css:40-42` over
  `--spacing-gap-field-block`, `--spacing-gap-group-block` and
  `--spacing-gap-pattern-block`.
- `--form-group-gap-default` is declared at
  `packages/react/ds-global-form/src/index.css:168` over
  `--spacing-gap-field-block`.

So all three sites really do derive container padding from a gap token, and
leaving "the completeness sweep remains authoritative" beside a whitelist that
excludes them is the contradiction the request names.

### P2-1 — port 6115 is already allocated

`packages/react/ds-app-launchpad/playwright.spacing.config.ts:3` defaults to
6115. Lane B as drafted collides with an existing in-repo harness.

### P2-2 — the `round()` precedent cited in §7a does not exist in the spike base

`git grep 'round('` over `*.css` returns nothing.
`packages/styles/main/src/modifiers.density.css` is a 12-line no-op in this
snapshot. The capability is still proven — `mod()`, from the same CSS Values 4
stepped-value family, is used throughout `alignment.css` — but the citation is
wrong and will send a cold reader to a file that no longer contains it.

### P2-3 — no owner record exists for the branch-base exception

A search of the package for owner authorisation returns only FR-037b and FR-045.
The AGENTS.md branch-base exception is currently reviewer- and spec-recorded
only. Because nothing is pushed, AGENTS.md's PR-workflow contract is not
violated — this is a record gap, not a breach.

### P2-4 — the carrier is not exported, but it would publish

`packages/styles/main/package.json` declares `"files": ["src"]`, and the public
`"./component-contract.css"` export resolves to `./src/component-contract.css`,
which imports the carrier by relative path. So the claim "not exported as a
public subpath" is literally true, but the file would ship in the tarball and is
transitively reachable from a public export.

---

## Exact approved scope for T004d2

### Authorised files — additive only

1. `packages/styles/typography/src/alignment.css` — already permitted.
2. `packages/styles/typography/src/elements.css` — **newly authorised**.
3. `packages/styles/main/src/component-contract.css` — already permitted;
   controls only.
4. `packages/styles/typography/test/alignment.test.ts` and the comparison-sheet
   fixture/story.

### Exact private property names

Per role, in `alignment.css`:

```text
--_typography-<role>-rhythm-step
--_typography-<role>-phase-block-start
--_typography-<role>-closure-block-end
```

### Composition with the existing metric nudge

Phase is defined as the **additional** lift beyond the already-published nudge,
so the nudge value is never rewritten and the applied padding still equals §7a's
phase total:

```css
--_typography-<role>-rhythm-step:
  var(--typography-text-primary-line-height-dimension);

--_typography-<role>-phase-block-start: calc(
  round(up,
    var(--_typography-<role>-first-baseline-offset),
    var(--_typography-<role>-rhythm-step)) -
  var(--_typography-<role>-first-baseline-offset) -
  var(--typography-<role>-nudge-block-start)
);
```

so that

```text
nudge-block-start + phase-block-start == round(up, offset, step) - offset
```

which is §7a's `--phase-block-start` exactly.

It is non-negative because the rhythm step is a whole multiple of
`--spacing-baseline` in every product — Site 24 = 3 × 8, Docs and App 20 = 5 × 4.
Assert that precondition in the focused test rather than assuming it. It computes
to zero for the body and code roles in every product, which is the correct no-op.

`--_typography-<role>-closure-block-end` closes the non-line contribution plus one
line box to the rhythm step. **It is only correct for all line counts where
`mod(line-height, rhythm-step) = 0`.** The focused test must evaluate that
predicate per role per product and report the failures as the P0-1 exception
list. It must not silently emit wrong geometry for App headings.

### Application in `elements.css`

Extend the shared rule at lines 136–140 to:

```css
  margin-block: 0;
  padding-block-start: calc(
    var(--_typography-text-nudge-start) +
    var(--_typography-text-phase-start)
  );
  padding-block-end: 0;
  margin-block-end: var(--_typography-text-closure-end);
```

and set `--_typography-text-phase-start` and `--_typography-text-closure-end` in
**every** selector block that already sets the nudge pair — h1–h6, the
`p` / `.p` / `li` group, and the code group. Do not rely on `var()` fallbacks:
custom properties inherit, so a partially-set selector would pick up an ancestor
heading's phase.

### Controls

No change expected. `--ds-row-compensation-block-end` at
`packages/styles/main/src/component-contract.css:113-119` is already the closer,
its rhythm step is `--spacing-baseline`, and a control's phase is zero. If no
edit is needed, record that rather than adding an inert one.

### Prohibited

Any change to the **value** of `--typography-<role>-nudge-block-start` or
`--typography-<role>-nudge-block-end`. The no-redefinition proof is that
`packages/styles/typography/test/text-alignment.test.ts`,
`packages/styles/typography/test/spacing-model.test.ts`,
`scripts/check-css-contract.test.ts` and
`packages/svelte/ds-app-launchpad/scripts/check-packed-export.ts` stay green
**unmodified**.

### Narrowed acceptance

Replacing the current done-when: one comparison sheet per product showing H1 at
one, two and three lines beside body copy. Alignment of the heading's **own**
lines is required only where `mod(line-height, rhythm-step) = 0` — Site and Docs
H1/H2, Site H5/H6, App H5/H6. Every other combination is recorded as a type-scale
exception carried to CP1. It is not a T004d2 failure and not a reason to patch
the model.

---

## Exact approved scope for T004g

### Added owners

- `packages/react/ds-global-form/src/lib/subcomponent/ColorInput/styles.css:114`
  and `:158` — `--ds-box-inset-block` must read an inset role, not
  `--form-group-gap-default`.
- `packages/react/ds-global-form/src/index.css:168` — authorised so the fix may
  land at the alias if that reads better than at the two call sites.

### Explicit boundary dispositions — do not edit in this spike

| File | Disposition |
|---|---|
| `packages/summon/application/src/application/react/templates/src/styles/app.css:14,18` | scaffolding **template** shipped to users; `.app-shell` block padding is a page/application-shell relationship, excluded from the component taxonomy by FR-021/FR-022 and entangled with `--grid-gap`, which FR-040 defers to Spec 020b |
| `apps/react/boilerplate-vite/src/styles/app.css:5,9` | same relationship, and an app rather than a DS package |
| `packages/react/ds-app/.storybook/side-navigation-spacing-contract.css:11,51` | Storybook fixture; already covered by the audit-fixture allowance. Edit only if a comparison sheet needs it |
| `packages/svelte/ds-app-wpe/src/lib/group/Cards/styles.css:21-22` | non-React consumer; FR-036 boundary |

All four go into the T010 disposition backlog with a named owner, recorded in
`tasks.md` now, not at T004h.

### Narrowed acceptance

Replacing "the completeness sweep remains authoritative": the sweep must return
**no undispositioned hit** — each hit is either repointed to an inset role or
carries a one-line recorded boundary. Full FR-045a completeness remains T007.
Because `rg` is not on `PATH` here, record the sweep as its reproducible
`git ls-files '*.css'` regex equivalent.

### Deletions

`--spacing-gap-section-block` has one production consumer
(`packages/react/ds-global/src/lib/_work_in_progress/Section/styles.css:10`)
plus three test fixtures
(`packages/react/ds-global/src/lib/TransitionClosure.spacing.tests.ts:55`,
`packages/react/ds-global/tests/TransitionFacts.spacing.pw.ts:119`,
`packages/styles/main/test/spacing-model.test.js:26`). Repoint Section and update
the fixtures.

For `--grid-gutter` / `--grid-margin`: delete as FR-040 requires, **and record the
resolved value per consumer**, naming the `grid.css` silent literal fallback and
the three unfallbacked consumers as measured outcomes of the deletion. Do not
edit the Svelte file to soften it.

---

## Selected capture lane

**Neither lane as drafted. Lane B in substance, on infrastructure that already
exists and has already been accepted.**

`packages/react/ds-global/playwright.spacing.config.ts` already:

- spawns its own Storybook from the spike worktree via `webServer`;
- defaults to **port 6106**, overridable with `PRAGMA_BUTTON_SPACING_PORT`;
- writes to `test-results/button-spacing`, overridable with
  `PRAGMA_BUTTON_SPACING_OUTPUT`;
- is the harness that produced the accepted T004d 24/24 proof.

Authoring a new collector on 6115 would duplicate it and collide with
ds-app-launchpad (P2-1). Standing up lane A would take 6114 from the reference.

### Normative lane

1. Run the existing config with
   `PRAGMA_BUTTON_SPACING_OUTPUT=H:\WSL_dev_projects\temp\spec-024-inside-out-evidence-20260922`.
   Port stays 6106.
2. Write a `manifest.json` beside the artifacts recording the branch, HEAD
   `313ee82c…`, the `git status --porcelain -uall` listing, and per-file SHA-256
   of the five modified files plus the carrier. That is what makes the packet
   recoverable for T004h and what identifies the spike as the source.
3. Record OS as `null`.
4. No new collector, no new config, no new port.

### Why lane A is rejected

It reruns a 178-target × 3-tier plus 20-variant matrix into roughly 28 MB of JSON
(`browser-measurements.json` 11.6 MB, `owner-ledger.json` 9.9 MB,
`variant-measurements.json` 6.5 MB), which FR-046, FR-046a and FR-046b explicitly
defer. And `verify-evidence.cjs` hash-asserts collector identity and the source
manifest, so the result would look like the Spec 022 packet while describing the
spike — precisely the misattribution the handover's trap list warns about.

### Port 6114 disposition

**Remains reserved to Spec 022, unconditionally. Spec 024 never binds it.**
Nothing is currently listening on 6114, 6115, 6106 or 4173, so the reservation is
documentary and costs nothing to keep. Record one line in `evidence-manifest.md`:
the Spec 024 spike capture binds 6106 only.

---

## Carrier and branch exception

| Claim | Verdict |
|---|---|
| candidate `spacing.inset.control.block` maps to both `--ds-row-inset-block-start` and `--ds-row-inset-block-end` | **Confirmed** — `_spike-geometry.css` lines 17–18 and 34–35, in both product blocks |
| `element` / `group` / `pattern` map to the matching `--ds-gap-*-block` inputs | **Confirmed**, with `element` annotated as the post-CP2 rename of shipped `spacing.gap.field.block` |
| carrier imported only through `component-contract.css`, not a public subpath | **Confirmed as stated**, with the P2-4 caveat: `"files": ["src"]` publishes it and it is transitively reachable from the public `./component-contract.css` export. Add a T004h static check that the file exists on no branch but this one |
| owner explicitly authorises the branch-base exception | **Cannot confirm** — no owner record exists (P2-3). The exception is reviewer- and spec-recorded only. Since nothing is pushed, AGENTS.md is not breached; one owner line closes the gap |

---

## May implementation resume past T004d1a?

**Yes** — for T004d1a and T004g immediately, and for T004d2 once the two record
edits in blockers 1 and 2 land.

## Remaining blockers

1. **P0-1 record correction, before T004d2 starts.** Correct §7a's
   whole-multiple claim with the measured table above, and replace T004d2's
   done-when in `tasks.md` with the narrowed acceptance. Without this the
   implementer will chase an App result that no block-start term can produce.
2. **P1-2 recovery ref for the spike, before any further edit.** Snapshot
   `feat/bf-inside-out-geometry`'s full working tree to
   `refs/recovery/spec-024/pragma/bf-inside-out-geometry-20260922` and pin it in
   `recut-handoff.md`. Three accepted tasks are currently unpreserved.
3. **P2-3 owner line** authorising the recovery-snapshot branch base as the
   single non-mergeable exception, with every other repository rule active.
4. **P2-2 citation fix** in §7a — point the `round()` precedent at `mod()` in
   `alignment.css`, not at `modifiers.density.css`.

Blockers 1 and 2 are prerequisites. Blockers 3 and 4 are single-line record edits
that may land alongside the work but must be done before T004h packaging.

---

## Out of scope for this review

T004h, CP1 and CP2 remain mandatory and untouched. The settled gap scale, merge
principle, inset/gap distinction, density constraint and inside-out geometry are
unchanged. The T004d per-edge formula and its rendered-border proof were not
reopened, and nothing here contradicts them.
