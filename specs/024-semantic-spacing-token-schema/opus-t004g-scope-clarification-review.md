# Opus execution-junction review — T004d1a completion / T004d2 / T004g

**Reviewer**: Claude Opus 5, via GitHub Copilot in VS Code
**Review date**: 2026-09-23
**Request**: `prompts/opus-t004g-scope-clarification.md`
**Spec worktree**: `feat/024-semantic-spacing-token-schema` at `c97ae4fca21ee1e87d23b208951abe3ed61a223f`
**Pragma spike**: `feat/bf-inside-out-geometry`, HEAD and base `313ee82c13a126b779b9bd75902da5af13c28505`,
accepted work preserved at `f93281eac01b16257027161cf0841cd559f0cef1`

Four separate verdicts are returned. A yes for one lane does not authorise another.
No change was implemented. Paths are relative to the spike worktree root unless stated.

---

## Verified current state

- Spike HEAD and branch base both resolve to `313ee82c…`; the recovery ref
  `refs/recovery/spec-024/pragma/bf-inside-out-geometry-20260922` resolves to
  `f93281eac…`. The custody blocker from the previous review is closed.
- Nine modified files plus the untracked carrier, exactly as stated in the request.
  Diffstat: 447 insertions, 101 deletions.
- The carrier declares only the four FR-050 channels; `git grep '_spike'` returns
  one hit outside it, the import at `packages/styles/main/src/component-contract.css:9`.
  `git diff 313ee82c` adds no `--spacing-*` declaration.
- The FR-039b3 / FR-039c type-scale exception table from the previous review has
  landed at `spec.md:313-324`. That blocker is closed.
- `H:\WSL_dev_projects\temp\spec-024-inside-out-evidence-20260922` is **empty**. No
  FR-052 capture packet exists yet.
- Installed Playwright engines: `chromium-1243`, `firefox-1543`, `webkit-2359`. All
  three engines are available; engine coverage is not blocked by tooling.

---

## Findings by severity

### P0-1 — the measurement artifacts do not exist on disk

`packages/react/ds-global/test-results/button-spacing-1876-1790153856778` contains
eight per-test directories, **all empty**, plus a 45-byte `.last-run.json`.

The four tests call `testInfo.attach(name, { body, contentType })`
(`Button.spacing.pw.ts` +172, `Chip.spacing.pw.ts` +145, `Form.spacing.pw.ts` +575,
`Select.spacing.pw.ts` +592). A `body` attachment is held in the reporter's report
object, not written to `outputDir`; the configured reporter is `line`
(`packages/react/ds-global/playwright.spacing.config.ts:39`), which emits no report
file. The measured values T004d1a exists to establish are therefore unrecoverable,
and nothing can be hashed into the FR-052 manifest.

### P0-2 — the resolved inset is never read

`Button.spacing.pw.ts` +55 and `Chip.spacing.pw.ts` +55 record
`insetTarget: product === "site" ? 0 : sample.baseline` — a value **computed in the
test**, not read from the DOM. `Form.spacing.pw.ts` and `Select.spacing.pw.ts` do not
read the inset at all.

Every assertion is therefore on the occupied total. The row ledger has five block-axis
terms (`--ds-row-inset-block-start|end`, `--ds-row-nudge-block-start`,
`--ds-row-border-block-start|end`) plus the compensation closer; a compensating error
between any two leaves all assertions green while the value the task purports to fix is
wrong. T004d1a's stated output — a measured, recorded inset — is not produced by this
proof.

### P0-3 — the composite-chrome borderless case mutates an undocumented internal channel

`Form.spacing.pw.ts` +530 does `row.style.setProperty("--form-input-border-width", "0px")`.

`--form-input-border-width` is **not** a public input. The documented extension-point
list is `packages/react/ds-global-form/src/index.css:41-52`, and it does not appear
there; it is declared internally at `index.css:129` as
`var(--ds-stroke-thickness)`. Its only other override is the fixture
`packages/react/ds-global-form/.storybook/select-spacing-contract.css:13`.

The handover's stop condition forbids proving a supported variant by mutating an
internal channel. `--form-input-border-width` is not `--ds-row-*`, but it is the same
category, and the request's characterisation of it as "the public
`--form-input-border-width: 0px` input" is not supported by the source.

### P0-4 — the Section block-inset mapping is not determinable from shipped roles

`packages/react/ds-global/src/lib/_work_in_progress/Section/styles.css:9-14` needs
three distinct magnitudes (shallow, default/hero, deep). The provider ships exactly two
block-axis inset roles
(`packages/styles/main/node_modules/@canonical/design-tokens/dist/modifiers.spacing.css`):

| Role | :root/Site | Docs | App | OS |
|---|---:|---:|---:|---:|
| `--spacing-inset-surface-block` | 16 | 16 | 12 | 8 |
| `--spacing-inset-strip-block` | 64 | 48 | 48 | 32 |

Mapping shallow → surface and both default and deep → strip collapses two public
variants onto one value. FR-042 requires a merge argument — "a change to one *should*
change the other" — and scarcity of roles is not one. Minting
`spacing.inset.section.block` is a CP1 taxonomy act and would need a fifth spike channel
against FR-050's four. Neither is this review's to decide, and the request forbids
guessing. FR-053a is therefore not satisfiable today.

### P1-1 — engine coverage is absent, and DPR coverage was mistaken for it

Every result directory name ends `-chromium-dpr1` or `-chromium-dpr2`. Both configs
declare six projects across three engines
(`packages/react/ds-global/playwright.spacing.config.ts:9-18`,
`packages/react/ds-global-form/playwright.spacing.config.ts:7-13`). Firefox and WebKit
are installed. The quantity under test is sub-pixel rounding of a computed length at a
1/32 px tolerance, which is exactly where engines diverge, so a Chromium-only result
does not establish the value.

### P1-2 — port 6106 structurally cannot host the form evidence

`packages/react/ds-global/.storybook/main.ts` globs only `../src/**/*.stories.*`, so the
6106 Storybook cannot serve `patterns-form--spacing-contract`, which lives in
`packages/react/ds-global-form/src`. `packages/react/ds-global-form/.storybook/main.ts`
additionally registers the `storybook-addon-msw` and `storybook-addon-form-state`
addons that ds-global does not configure. Making 6106 serve form stories requires a
config change, which FR-052 forbids. As written, FR-052 makes two of the four
denominator members unprovable.

### P1-3 — `--form-field-block-gap-default` carries a magnitude error that FR-043 would amplify

`packages/react/ds-global-form/src/index.css:315` sets a form's inter-field `row-gap`
from `--spacing-gap-pattern-block` — the page-section step (64/48/16 today). Repointing
it to `--ds-gap-pattern-block` under FR-043 would move it to 64/32/32, doubling it in
App. Fields inside a form are logical units inside a pattern, which is `group`.

### P2-1 — Button's transparent border satisfies FR-039d's letter while defeating its purpose

`packages/react/ds-global/src/lib/component/Button/styles.css:63-64` states the border
"is ALWAYS present at the nominal width (transparent when hidden), so a bordered and a
borderless importance share byte-identical geometry". The row contract reads the real
rendered border, so FR-039d's per-edge rule is literally met. But the design means the
DS ships **no** zero-border Button control row, which is the fact the waiver must state.

### P2-2 — `.ds.button.link` and `.ds.chip.is-nested` are not control rows

`Button/styles.css:228-231` sets `padding-block: 0; margin-block-end: 0`.
`Chip/styles.css:127-136` sets `padding-block: 0` and a line-height content box. Both are
deliberate text-flow / in-box rows. Checking either against 40/32 would be a category
error, and their absence from the occupied-target assertions is correct, not a gap.

### P2-3 — `--spacing-inset-strip-block` has no Pragma consumer

`git grep` over the repo returns only `--spacing-inset-surface-*`, `-action-inline`,
`-continuation-inline` and `-field-inline`. The strip role is shipped but unused, which
is relevant to the Section decision and should be recorded for CP1.

---

## 1. T004d1a denominator

**Interpretation 1 is adopted.** A bounded pre-CP1 T004d1a denominator is defined now.
T005 / T005a / T005b own the later full component inventory and are unaffected.

The bound is principled, not convenient: a member is included when it consumes the
shared **external** row ledger (`--ds-row-padding-block-*`,
`--ds-row-compensation-block-end`) and its intrinsic content block is the role line
height, so the owner-confirmed occupied target applies.

### Included — four members, each measured

| # | Member | Owner path | Selector | Note |
|---|---|---|---|---|
| 1 | Button | `packages/react/ds-global/src/lib/component/Button/styles.css:219-226` | `.ds.button`, excluding `.link` | sets its own `--ds-row-border-*` at `:49-51` |
| 2 | Chip | `packages/react/ds-global/src/lib/component/Chip/styles.css:52-53` | `.ds.chip`, excluding `.is-nested` | borders at `:16-18` |
| 3 | Composite input chrome | `packages/react/ds-global-form/src/index.css:171+` | `.ds.input.chrome` | wrapper owns the border and the row ledger |
| 4 | Direct native chrome | ds-global-form Select | the native `select` element | separate DOM owner, separate border source |

**Members 3 and 4 are separate denominator members.** They differ in which element owns
the border and the ledger: on 3 the chrome wrapper paints and the native control sits
inside it; on 4 the native element is itself the row. A compensating error in one would
not show in the other.

### Included in the denominator, explicitly deferred with a reason

| Consumer | Reason | Owner of the later decision |
|---|---|---|
| `packages/react/ds-global-form/src/lib/subcomponent/FileUploadInput/styles.css:84-101` | overrides `--ds-row-content-block-size` with a `max()` dropzone canvas; the product target is its intrinsic content, not 40/32 | T006 |
| Tabs Item, ContextualMenu Item, Accordion Item (`packages/react/ds-global/src/lib/component/*/common/Item/styles.css`) | in-box rows on `--ds-in-box-row-*`; occupied targets do not apply | T006 |
| SideNavigation Header / Item / NavTree (`packages/react/ds-app/src/lib/SideNavigation/common/*/styles.css`) | in-box continuous-fill rows | T006 |
| GitDiffViewer FileHeader, MarkdownEditor Toolbar Button (`packages/react/ds-app-launchpad/src/lib/…`) | in-box rows | T006 |

### Product-specific Button forks — static conformance, not remeasurement

`packages/react/ds-app-anbox`, `-landscape`, `-lxd`, `-portal`
`/src/lib/Button/styles.css` each set only `--ds-row-border-block-start|end`,
`--ds-row-border-inline` and consume `--ds-row-padding-block-*` /
`--ds-row-compensation-block-end` (anbox `:18-20, 35-37` is representative). They declare
**no local inset and no local geometry**. Four more browser runs would prove nothing the
shared contract does not already prove, and FR-046a forbids matrices for their own sake.

**Disposition**: a single static assertion — these four files declare no
`--ds-row-inset-*`, no `--ds-row-nudge-*` and no local `padding-block` on the button row
— discharges them for T004d1a. Their rendered confirmation belongs to T005a.

### Non-React forks — FR-036 boundary

`packages/svelte/ds-app-launchpad/src/lib/components/{Button,Chip,Select,common/InputPrimitive}/styles.css`
and `packages/svelte/ds-app-wpe/src/lib/components/Button/styles.css` consume the same
channels. They are recorded as an explicit FR-036 boundary and belong to T005b. The spike
must not edit them and must not claim them as measured.

---

## 2. Borderless disposition table

| Member | Disposition | Basis | Scope expansion |
|---|---|---|---|
| **Button** | **Waived** | No supported borderless external control row exists. Every importance paints a real 1px border, transparent when hidden (`styles.css:49-51`, `:63-64`). `.ds.button.link` zeroes row padding and compensation (`:228-231`) and is a text-flow variant, not a 40/32 control. Transparent paint is not an absent border. | **None.** Button's stylesheet stays out of the writable list. Do not assert `link` against 40/32. |
| **Chip** | **Waived** | Same basis (`styles.css:16-18`). `.ds.chip.is-nested` is deliberately an in-box line-height row with zero block padding (`:127-136`). | **None.** |
| **Composite chrome** | **Not satisfied as proved; re-prove or waive** | `--form-input-border-width` is internal (`index.css:129`), absent from the documented extension points (`index.css:41-52`), and the test mutates it inline (`Form.spacing.pw.ts` +530). | Re-prove through the **documented** per-side width hooks `--form-input-border-width-top` / `-bottom` (`index.css:69-72`), applied from `packages/react/ds-global-form/.storybook/*-spacing-contract.css`, never by inline style. Fixture scope expands to that `.storybook` directory only. **No production stylesheet becomes writable.** If no documented hook reaches a true zero-width block edge, waive with that reason recorded. |
| **Native Select** | **Waived** | The Canonical theme makes three sides transparent by colour only (`index.css:61-63`); rendered border **widths** never reach zero. No borderless native-select variant ships. | **None.** Do not manufacture one. |

**Expected geometry wherever a borderless case is actually proved**: occupied stays at
`(40 or 32) × rootSize / 16`; both computed block-edge widths are `0`; and
`--ds-row-padding-block-start|end` each grow by exactly the border removed from that
edge, per FR-039d.

---

## 3. Actual inset assertion

**`Actual inset assertion required: yes`.**

Occupied-size agreement is necessary but not sufficient — see P0-2. T004d1a completion
requires reading, recording and asserting both resolved inset edges on every measured
member, at every product and both root sizes.

### Required fields, per member × product × rootSize × project

| Field | Source |
|---|---|
| `insetBlockStart` | resolved `--ds-row-inset-block-start` |
| `insetBlockEnd` | resolved `--ds-row-inset-block-end` |
| `nudgeBlockStart` | resolved `--ds-row-nudge-block-start` |
| `baseline` | resolved `--spacing-baseline` |
| `borderBlockStart`, `borderBlockEnd` | computed `borderBlockStartWidth` / `EndWidth` |
| `paddingBlockStart`, `paddingBlockEnd` | computed |
| `marginBlockEnd` | computed |
| `renderedOccupied` | border-box height + `marginBlockEnd` |
| `contractOccupied` | resolved `--ds-row-occupied-block-size` |
| `productTarget` | `(40 \| 32) × rootSize / 16` |

Resolve custom-property lengths with the probe technique already present at
`Form.spacing.pw.ts` +505-517; do not parse the raw token string.

### Required assertions

1. `insetBlockStart === insetBlockEnd`.
2. Site: both `0`. Docs and App: both `=== baseline`.
3. The per-edge identity, on **both** edges:
   `padding === max(0, inset + nudgeBlockStart − border)`.
4. The existing occupied and baseline-count assertions, retained.

Assertion 3 is what establishes the inset independently of the occupied total: it pins
each edge against its own three inputs, so a compensating error elsewhere in the ledger
can no longer hide.

**OS**: `null` in every record, never `0`.

---

## 4. Port 6107 versus the FR-052 6106 lane

**Disposition 1, bounded and amended — 6107 is admissible evidence, not merely
diagnostic.**

Disposition 2 was tested against the source and fails: 6106 cannot reach the form
stories (P1-2), and every route to making it do so requires a config change that FR-052
forbids. Keeping "6106 only" would make members 3 and 4 unprovable, which means T004d1a
could never complete — an impossible requirement, which this programme has already
resolved not to retain.

### Amendment to FR-052

> The Spec 024 capture MUST reuse the two **pre-existing** configs
> `packages/react/ds-global/playwright.spacing.config.ts` on port 6106 and
> `packages/react/ds-global-form/playwright.spacing.config.ts` on port 6107. No new
> collector, config or port may be added. Port 6114 remains unconditionally reserved for
> Spec 022.

Both configs and both ports predate Spec 024, so this adds nothing; it corrects a
statement that was narrower than the evidence requires.

### Lane-to-member binding, normative

| Lane | Port | Output root | Members it may evidence |
|---|---|---|---|
| ds-global | 6106 | `…\spec-024-inside-out-evidence-20260922\ds-global-6106` via `PRAGMA_BUTTON_SPACING_OUTPUT` | 1 Button, 2 Chip |
| ds-global-form | 6107 | `…\spec-024-inside-out-evidence-20260922\form-6107` via `PRAGMA_FORM_SPACING_OUTPUT` | 3 composite chrome, 4 native Select |

A measurement is admissible for T004d1a completion and for T004h only when it is
produced by the lane bound to that member, persisted per §5, and hashed in the manifest.
A green focused run that is not persisted and hashed is diagnostic only and closes
nothing. The manifest must name, per record, the lane, port, config path and project.

---

## 5. Recoverable measurement JSON

**Authorised mechanism**: write the file with `node:fs/promises` to
`testInfo.outputPath(...)`, then attach **by path**, not by body.

```ts
const file = testInfo.outputPath(`t004d1a-button-${rootSize}px.json`);
await writeFile(file, `${JSON.stringify(measurements, null, 2)}\n`);
await testInfo.attach(`t004d1a-button-${rootSize}px.json`, {
  path: file,
  contentType: "application/json",
});
```

`testInfo.outputPath` resolves inside the config's `outputDir`, which FR-052 already
redirects outside the repository. This adds no collector, no config, no env var and no
port — the write happens inside the existing tests, through Playwright's own output API.

### Exact paths

```text
H:\WSL_dev_projects\temp\spec-024-inside-out-evidence-20260922\
  ds-global-6106\<test-dir>\t004d1a-button-{16,18}px.json
  ds-global-6106\<test-dir>\t004d1a-chip-{16,18}px.json
  form-6107\<test-dir>\t004d1a-input-chrome-{16,18}px.json
  form-6107\<test-dir>\t004d1a-native-select-{16,18}px.json
  manifest.json
```

### Manifest rule

`manifest.json` at the evidence root must, in addition to the FR-052 branch / base HEAD /
porcelain / source-hash content, list **every** `t004d1a-*.json` with its SHA-256,
relative path, lane, port, Playwright project name (engine × DPR), root size and test
title, and record `os: null`. A T004d1a record that is not hashed in the manifest is not
evidence.

No committed evidence table is required, and none is authorised as a substitute: the
JSON is the record, the manifest is the index.

---

## 6. Root size and the completion matrix

### Root-size target

**Ratified: `40 / 32` at root 16, scaling to `45 / 36` at root 18.**

Reason, from the source rather than from the tests: every provider dimension is
expressed in `rem` (`sets.primitive.css`, `--dimension-050: 0.25rem` … `--dimension-800: 4rem`),
and `--spacing-baseline` is itself one of them. At root 18 the Site baseline unit is 9px,
so 5 bU is 45px. Fixing the target at 40px for both roots would require a Site control to
occupy a non-integer number of baseline units, which FR-039c forbids. Rem-scaling is
therefore the only interpretation consistent with the settled model, not merely the one
the current tests happen to use.

Record it as an explicit spec clause; do not leave it inferable only from test code.

### Completion matrix

DPR coverage and engine coverage are different axes and both are required. The six
projects already exist in each config and all three engines are installed, so this is a
**run-scope** requirement, not new test code.

| Axis | Required for T004d1a completion |
|---|---|
| Engine | chromium, firefox, webkit |
| DPR | 1 and 2 |
| Root size | 16 and 18 |
| Product | site, docs, app |
| Member | 1–4 |
| OS | recorded `null`, not rendered |

Total: 6 projects × 2 roots × 3 products × 4 members.

**Acceptance authority**: Chromium is the authority at the existing `1/32` px tolerance.
Firefox and WebKit must be **run and recorded** at a tolerance of `0.5` px; any excess is
recorded in the manifest as an engine rounding fact and carried to CP1, not treated as a
model failure and not fixed by loosening the Chromium tolerance. This keeps the tight
assertion where it is meaningful without manufacturing a false blocker out of engine
layout rounding.

---

## 7. Section inset mapping

**Partially determinable. The variant mapping is not.**

### Determined and approved

| Input | Current | Approved change |
|---|---|---|
| `.ds.section.bordered` `--ds-box-inset-block` (`styles.css:40-43`) | `var(--section-border-start-width-with-padding, var(--spacing-gap-field-block))` | **Delete the `--ds-box-inset-block` override.** `.bordered` then inherits the framed-box default `--spacing-inset-surface-block` from `component-contract.css:51`. This is a genuine inset role, needs no new taxonomy, and removes the gap-derived padding. The 8 → 16/16/12 value change is recorded on the comparison sheet. The public `--section-border-start-width-with-padding` hook is unaffected; it remains a consumer override. |

### Not determined — no-proceed

| Input | Current | Status |
|---|---|---|
| shallow (`:9`) | `--spacing-gap-group-block` (24/24/8) | **Underdetermined** |
| default (`:10`) | `--spacing-gap-section-block` (32/32/32, illegal under FR-034 and FR-043a) | **Underdetermined** |
| deep (`:11`) | `--spacing-gap-pattern-block` (64/48/16) | **Underdetermined** |
| hero bottom (`:12-14`) | `= default` | **Underdetermined**, follows default |

Three distinct magnitudes are required; two block inset roles are shipped (P0-4). Every
available assignment either merges two public variants without a FR-042 merge argument,
or mints a role, which is CP1's act and would need a fifth FR-050 spike channel.

### Consequence for the illegal alias

Deleting `--spacing-gap-section-block` from `packages/styles/main/src/spacing.css:47`
while `default` is unresolved leaves `--section-padding-bottom-spacing-default` invalid
at computed value. FR-043a requires the deletion and FR-053a blocks it until Section is
decided, so the two are sequenced: **the deletion moves with the Section decision, not
before it.** Its three test consumers
(`packages/react/ds-global/src/lib/TransitionClosure.spacing.tests.ts:55`,
`packages/react/ds-global/tests/TransitionFacts.spacing.pw.ts:119`,
`packages/styles/main/test/spacing-model.test.js:26`) move with it.

### What CP1 must choose between

1. **Collapse** to two Section magnitudes — shallow → `--spacing-inset-surface-block`,
   default/hero/deep → `--spacing-inset-strip-block` — with a written FR-042 merge
   argument for why changing one *should* change the other. Note `strip-block` currently
   has no Pragma consumer at all (P2-3).
2. **Mint** `spacing.inset.section.block` as a new member of the existing inset family
   (FR-039a permits the family), with three product-resolved values, plus a recorded
   FR-050 amendment for a fifth spike channel.

Do not resolve this by measurement, by value coincidence, or in the spike.

---

## 8. Writable file and declaration list for FR-043 activation

**This spike activates FR-043 in a bounded named-owner and comparison-sheet slice. Full
migration is deferred to T007.** The writable list below is exhaustive; anything absent
from it is not writable.

### May be repointed to the carrier's `--ds-gap-*-block`

| # | File and declaration | From | To |
|---|---|---|---|
| 1 | `packages/styles/main/src/spacing.css:40` `--container-gap-tight` | `--spacing-gap-field-block` | `--ds-gap-element-block` |
| 2 | `packages/styles/main/src/spacing.css:41` `--container-gap-default` | `--spacing-gap-group-block` | `--ds-gap-group-block` |
| 3 | `packages/styles/main/src/spacing.css:42` `--container-gap-loose` | `--spacing-gap-pattern-block` | `--ds-gap-pattern-block` |
| 4 | `packages/react/ds-global-form/src/index.css:168` `--form-group-gap-default` | `--spacing-gap-field-block` | `--ds-gap-element-block` |
| 5 | `packages/react/ds-global-form/src/index.css:315` `--form-field-block-gap-default` | `--spacing-gap-pattern-block` | `--ds-gap-group-block` — see P1-3; this is a magnitude correction, not a rename, and must be called out on the sheet |
| 6 | The genuine `gap` / `row-gap` / `column-gap` declarations in the named Card, Tile and Tooltip owners | `--spacing-gap-*` | matching `--ds-gap-*-block`, enumerated per file in the T004g record before the edit |

### Resolution of the `spacing.css` deletions-only conflict

The deletions-only rule is **amended for exactly the three declarations at lines 40-42**,
and for nothing else in that file. Rationale: `--container-gap-*` are Pragma-owned
aliases, not provider properties, so repointing them declares no `--spacing-*` property
and leaves FR-034 untouched; and they are the only complete activation path for the 15
files that read them (`git grep -c -- '--container-gap'`). Line 47
(`--spacing-gap-section-block`) and lines 55-56 (`--grid-gutter`, `--grid-margin`) remain
deletions-only, and line 47 is additionally sequenced behind §7.

### Explicitly **not** writable in this spike

- Every other consumer that reads `--spacing-gap-*` directly. They keep resolving from
  the provider; proving the scale on the named slice plus the comparison sheet is the
  FR-046 standard. Full migration is T007.
- The per-instance override hooks `--form-group-gap`, `--form-field-block-gap`,
  `--form-field-inline-gap`, and the literal overrides in
  `packages/react/ds-global-form/src/lib/pattern/Form/Form.stories.tsx:226,239,280`
  (`0.75rem`, `0.5rem`) — recorded as T010 literals.
- `packages/react/ds-global-form/src/lib/component/RichChoicesField/styles.css:11,43`,
  which bypasses the alias and reads `--spacing-gap-field-block` directly — T007.
- The four boundary records already made: Summon application template, boilerplate-vite,
  the ds-app `.storybook` side-navigation fixture, and Svelte WPE Cards. Unchanged, and
  the Svelte boundary is not softened.
- Section, per §7.

---

## 9. ColorInput separation

**`ColorInput call-site correction approved: yes`.**

The two `--ds-box-inset-block` assignments at
`packages/react/ds-global-form/src/lib/subcomponent/ColorInput/styles.css:114-117` and
`:158-161` must be corrected **at the call sites**. The approved correction is to delete
both overrides, so each inherits the framed-box default `--spacing-inset-surface-block`
from `component-contract.css:51` — the same treatment as Section's bordered case, and for
the same reason.

`--form-group-gap-default` **must not** be redefined as an inset. It has nine real gap
consumers:

```text
packages/react/ds-global-form/src/lib/common/Wrapper/styles.css:38          row-gap
packages/react/ds-global-form/src/lib/common/Wrapper/ToggleWrapper.css:9    row-gap
packages/react/ds-global-form/src/lib/component/ChoicesField/styles.css:16  gap
packages/react/ds-global-form/src/lib/component/ChoicesField/styles.css:31  gap
packages/react/ds-global-form/src/lib/component/RangeField/common/RangeControl/styles.css:15  gap
packages/react/ds-global-form/src/lib/subcomponent/FileUploadInput/styles.css:7   gap
packages/react/ds-global-form/src/lib/subcomponent/FileUploadInput/styles.css:72  gap
packages/react/ds-global-form/src/lib/subcomponent/ColorInput/styles.css:61  margin-block-start
packages/react/ds-global-form/src/lib/subcomponent/ColorInput/styles.css:75  gap
```

Its only permitted change is item 4 of §8 — repointing it to `--ds-gap-element-block` as
FR-043 gap-scale activation. It stays a gap in both roles.

---

## 10. `text-alignment.test.ts` correction

**`text-alignment.test.ts assertion-only correction approved: yes`.**

### May change

| Location | Current assertion | Permitted change |
|---|---|---|
| `:134-136` | `padding-block-start: var(--_typography-text-nudge-start);` | follow the approved additive application |
| `:138-140` | `margin-block-end: var(--_typography-text-nudge-end);` | follow the approved closure application |
| `:157-159` | same `padding-block-start` assertion for the prose-list selectors | same |
| `:160-162` | same `margin-block-end` assertion for the prose-list selectors | same |
| new | assertions that each selector block maps `--_typography-text-phase-start` and `--_typography-text-closure-end` to its own role properties | additive |

### Must not change — this is the no-redefinition proof

| Location | Assertion |
|---|---|
| `:89-93` | body role maps `--_typography-text-nudge-start\|end` to `--typography-text-primary-nudge-block-start\|end` |
| `:109-113` | every heading role maps the same pair |
| `:137` | `padding-block-end: 0;` |
| `:196-197` | inline code receives no `padding-block-start` or `margin-block-end` |
| `:215-216` | every product tier publishes both `--typography-<role>-nudge-block-*` |
| `:48-49` | the export surface excludes `./src/*` and `./baseline-cap.css` |

No nudge **value**, no selector ownership and no production scope is reopened.
`packages/styles/typography/test/spacing-model.test.ts`,
`scripts/check-css-contract.test.ts` and
`packages/svelte/ds-app-launchpad/scripts/check-packed-export.ts` stay green
**unmodified**; that remains the proof that the published contract did not move.

---

## Final verdicts

### May T004d1a be marked complete? **no**

Blockers, all of which are within the current lane and none of which require a model
change:

1. **P0-2** — the resolved inset is never read. Implement the §3 fields and the four
   assertions, including the per-edge identity on both edges.
2. **P0-1** — the measurement JSON is not on disk. Implement the §5 path-attachment
   mechanism and the exact output paths.
3. **P0-3** — the composite-chrome borderless proof mutates an undocumented internal
   channel. Re-prove through the documented per-side hooks from a `.storybook` fixture,
   or waive with the §2 reason recorded.
4. **P1-1** — run and record the full §6 engine × DPR × root × product × member matrix.
5. **§1** — record the enumerated denominator, the four deferrals, the static
   conformance disposition for the four product Button forks and the FR-036 Svelte
   boundary in `tasks.md`.
6. **§4** — record the FR-052 amendment and the lane-to-member binding before the
   capture, not after.
7. **§6** — record the rem-scaling ratification as a spec clause.
8. Produce the FR-052 packet and manifest at the external root, which is currently empty.

### May the mechanical T004d2 test correction proceed? **yes**

Scope is exactly §10. No further blocker. The correction may land before or with the
T004d2 implementation, but the six protected assertion groups and the three external
gates must stay green unmodified.

### May T004d2 implementation proceed? **yes**

Scope is unchanged from the previously approved wording — additive private phase and
closure properties in `alignment.css`, additive application in `elements.css`, controls
unchanged in `component-contract.css`, with acceptance narrowed by the FR-039b3 /
FR-039c exception table now recorded at `spec.md:313-324`. That prior blocker is closed
and no new contradiction was found.

Two standing conditions: the published nudge pair keeps its values, and the qualifying
combinations proved on the sheet are exactly Site H1/H2/H5/H6, Docs H1/H2 and App H5/H6,
with every other pair carried to CP1 as a type-scale exception rather than fixed.

T004d2 does not depend on T004d1a completion and is not gated by it.

### May T004g implementation proceed? **no**

Blockers:

1. **P0-4 / §7** — Section's shallow, default, deep and hero mapping is underdetermined.
   FR-053a's first decision cannot be recorded today. CP1 must choose between the two
   admissible resolutions in §7; this review will not guess, and the deletion of
   `--spacing-gap-section-block` is sequenced behind that choice.
2. **§8 is now answerable and should be recorded** — the writable list, the three-line
   `spacing.css` amendment and the T007 deferral discharge FR-053a's second decision once
   written into the spec. Until both decisions are recorded, FR-053a keeps T004g closed.

Everything else T004g needs is settled: the ColorInput correction (§9), the four boundary
records, the FR-053 no-undispositioned-hit acceptance, and the grid-redirect deletion with
per-consumer recording. T004g becomes a yes the moment the Section decision exists.
