# Adversarial review — Pragma shared-alignment foundation

Read-only junction review of `feat/bf-shared-alignment` at `3053d1aff`, against
BF `feat/022-pragma-spacing-adoption` at `c109f81`. Nothing was staged,
committed, cleaned or edited in either Pragma worktree; the preserved
`feat/bf-metric-nudge` tree was read only. Probe scripts live outside both
repositories, in `H:/WSL_dev_projects/tmp/bf-adv-review/`.

## 1. Verdict

**NO-GO.**

Stages 1–3 are sound and I found no drift defect in the alignment contract, the
row ledger or the font work. The junction fails on three things that are all
inside the gate it is asking to pass: one live production selector defect, a
browser suite that does not currently pass, and a Stage 4 enforcement layer that
is neither complete nor wired.

## 2. Executive finding

Component retrofit work may not begin.

The foundation itself is in good shape. Occupied blocks land exactly on the
product grid in all three engines at 16px and 18px roots; the cap technique
differs from the preserved generator by 0.09–0.39 CSS px across every role I
measured, inside the stated envelope; provider and font authentication fail
closed on all twelve negative cases I could construct. The `1cap` deferral
mechanism works exactly as the contract describes and is confirmed in Chromium,
Firefox and WebKit.

What is not ready is the machinery that is supposed to make twelve retrofits
safe. The transition allowlist does not exist, the scanner is referenced by no
package script or workflow, it silently omits eight component packages, and it
misses eight classes of violation I was able to write past on the first attempt.
Separately, the universal `li` rule is already applying prose geometry to
navigation and file-list rows in production, which means a retrofit would be
measured against a contaminated baseline. Fix those and the junction is close.

## 3. Blocking findings

### B1 — P0 — Universal `li` applies prose nudge, compensation and the 80ch measure to UI list wrappers

**Evidence.** `packages/styles/typography/src/elements.css`: `p, .p, li` assigns
the body role nudge pair, and the trailing block applies
`padding-block-start`, `margin-block-end` and
`max-inline-size: var(--typography-text-measure)` to `li` unconditionally.

Measured in Chromium against the live audit server on 6114
(`probe-li2.mjs`, 17 stories):

| Story | Element | max-inline-size | padding-block-start | margin-block-end |
|---|---|---|---|---|
| `components-fileuploadfield--max-files` | `li.file-item` in `.file-list` | 631.68px | 0.149px | 1.702px |
| `work-in-progress-component-comboboxfield--default` | `li.p` in `.ds.combobox-list` | 631.68px | 12px (component) | 2.851px |
| `subcomponents-fileuploadinput--default` | bare `li` in `ul` | 768px | 6.36px | 1.64px |
| spacing audit, vertical | `li.ds.tabs-item` in `.tabs-list` | 721.92px | 0px (component) | 0px (component) |

Tabs and Combobox override padding and margin from a later layer, so only the
measure leaks there. FileUploadField and FileUploadInput override neither, so
those rows carry the full prose nudge, the prose trailing compensation *and* the
measure.

**Consequence.** A prose reading-measure ceiling is imposed on navigation, menu
and file-list wrappers, and prose rhythm is inserted between UI rows. Any
retrofit that measures a list component now measures the mapper as much as the
component.

**Smallest fix.** Narrow the prose list rule to list items that are not part of a
component. Every Pragma component root already carries `.ds`, and the contract
already uses `.ds` as the component marker, so the narrowest contract-consistent
selector is `li:not(:where(.ds, .ds *))` in both the nudge assignment and the
trailing block. That keeps prose lists, excludes Tabs, Combobox, FileUpload,
SideNavigation, Breadcrumbs and FileTree, and adds no new concept.

### B2 — P0 — The shared-contract browser suite fails 18 of 54

```
cd packages/react/ds-global
PRAGMA_BUTTON_SPACING_PORT=6131 bunx playwright test \
  --config=playwright.spacing.config.ts SharedContracts.spacing.pw.ts
→ 36 passed, 18 failed (2.8m)
```

Two independent causes.

**(a) `baselineError` exceeds the declared tolerance — all three engines.**
`SharedContracts.spacing.pw.ts:620` asserts `baselineError <= 0.5 / dpr + 0.001`.

| Project | Root | Expected | Received |
|---|---|---|---|
| chromium-dpr1 | 16px | ≤ 0.501 | 0.546875 |
| chromium-dpr1 | 18px | ≤ 0.501 | 0.75 |
| firefox-dpr1 | 16px | ≤ 0.501 | 0.5500031 |
| webkit-dpr1 | 16px | ≤ 0.501 | 0.5625 |
| webkit-dpr2 | 18px | ≤ 0.251 | 0.375 |

This is a wrong bound, not a wrong geometry — see §9. The bound models
device-pixel snapping only. The dominant term is the engine's placement of the
baseline inside the line box, which Chromium rounds to a whole CSS pixel; I
measured a Chromium error of 0.859px on the Docs role at a 16px root, where the
grid unit is 4px. The accepted cap approximation contributes a further ≤0.39px.
The contract already says exact seating is unreachable by any CSS technique, so
the suite must decompose the two terms rather than assert one number against
both.

**(b) Eight WebKit failures are an injection fault, not geometry.**
`inherits the complete body role at a 16px/18px rem anchor` and
`keeps a 16px/18px rem anchor when the product class is on html` fail with
`page.addStyleTag: [object Event]` on `webkit-dpr1` and `webkit-dpr2`. I
reproduced the same `addStyleTag` failure independently in
`probe-baseline.mjs`, so it is environmental rather than a regression. It
matters anyway: these are two of the cases inside the claimed "42/42 after
Stage 3", and that figure is therefore not currently reproducible in this tree.

**Smallest fix.** State and justify two separate bounds per engine — an engine
line-box quantization term (Chromium whole CSS px, Firefox and WebKit half px)
and the accepted cap-approximation term — and promote the occupied-block
assertion to the primary control, since it is exact (§5). Replace the WebKit
`addStyleTag({ url })` route with a route that works in all three engines.

### B3 — P0 — Stage 4 detectors are bypassable and the scan omits eight component packages

Driving the exported `findCssContractViolations` with single-declaration
fixtures (`scanner-gaps.ts`, run under Bun from the worktree root):

| # | Fixture in component CSS or a test | Result |
|---|---|---|
| G1 | `font: 700 0.875rem/1.25rem "Ubuntu Sans"` | **missed** — the `font` shorthand is not a `font-size` property |
| G2 | `font-family: var(--typography-text-primary-code-font-family)` | **missed** — no rule constrains `font-family` |
| G3 | `font-size: var(--typography-heading-3-font-size)` | caught (`font-size-declaration`) |
| G4 | `--ds-row-line-height: 1.25rem; line-height: 1.25rem` | **missed** — a component can redefine the ledger's own line input |
| G5 | `--_probe-inset: var(--typography-heading-2-nudge-block-start)` | **missed** — cross-role nudge consumption |
| G6 | `aspect-ratio: 1; inline-size: 2rem` | **missed** — a target row expressed as a ratio |
| G7 | `` `block-size:${'1cap'}` `` and `'block-size:1' + 'cap'` in a `.pw.ts` | **missed** — cap oracle behind string construction |
| G8 | `expect(css).not.toContain("x"); const probe = "block-size: 1cap";` | **missed** — the same-line negative-assertion bypass, still open |
| G9 | `calc(0.5rem - (var(--_p) - 0.5rem * round(down, var(--_p) / 0.5rem, 1)))` | **missed** — a private modulo ledger written without `mod(` |
| G10 | a correct `--ds-row-*` consumer | clean, as intended |

G4, G5, G6 and G9 are new relative to the three P1 gaps already recorded in
`shared-alignment-review.md`. G9 matters most: it reproduces the exact defect
the rule exists to prevent, using only `round()`.

**Coverage.** `AFFECTED_PACKAGE_ROOTS` names six roots. These component packages
ship CSS and are never scanned:

| Package | CSS files under `src` |
|---|---|
| `packages/lit/ds-prototype` | 13 |
| `packages/react/tokens` | 6 |
| `packages/svelte/ds-global` | 4 |
| `packages/svelte/ds-app` | 3 |
| `packages/react/ds-app-anbox` | 2 |
| `packages/react/ds-app-landscape` | 2 |
| `packages/react/ds-app-lxd` | 2 |
| `packages/react/ds-app-portal` | 2 |

`packages/react/tokens` is meant to be quarantined per Stage 7, but no
quarantine record exists — it is simply absent from the list, which is
indistinguishable from an omission.

**Consequence.** "Seeded once from the complete repository violation set" would
be false by construction. Worse, because the allowlist may never grow, adding
any of these roots later makes the gate unpassable without breaking the
monotonicity rule the design depends on.

### B4 — P1 — No allowlist, no classifications, no wiring

```
bun run scripts/check-css-contract.ts
→ 521 unsanctioned CSS contract violation identities exist with no transition allowlist.
git grep "check-css-contract" -- package.json packages/**/package.json .github/**
→ (no matches)
```

`config/css-contract-allowlist.json` and
`config/css-contract-classifications.json` do not exist. No package's
`check:webarchitect` composes the guard. The scanner is frozen tooling, as its
own review says.

### B5 — P1 — The three non-row cases cannot all be classified as written

See §7 for the full classification. The blocker is ContextualMenu:

```
packages/react/ds-global/src/lib/component/ContextualMenu/styles.css:39
max-block-size: calc(100dvh - 2 * var(--dimension-200, 16px));
```

This trips `block-target`, `dimension-primitive` and would trip a font/length
literal rule on its `16px` fallback. A classification names an exact value, so
classifying this sanctions the primitive reference and the literal along with
the viewport bound. It must be rewritten to a semantic alias first, then
classified.

### B6 — P2 — A shared workflow was changed for a package-scoped concern

`.github/workflows/push.yml`: `fetch-depth: 1` → `fetch-depth: 0`.

Pragma's `AGENTS.md` is explicit that the CI domain is global and that a
workflow change must be justified in the PR body and expected to be challenged.
Full history is a genuine requirement of the monotonicity check, so this is
arguable — but it changes checkout cost on every push for every contributor to
serve one transitional gate, and it is currently unexplained. Either state the
argument in the PR body, or scope the history requirement to the job that needs
it.

### B7 — P2 — The contract misstates what `alignment.css` publishes

`contracts/baseline-alignment.md` says each role "publishes" a start nudge. It
publishes an unresolved token stream. `--_typography-cap-unit: 1cap` is
deliberately unregistered, so `1cap` survives substitution and is computed at
the element that finally consumes the property.

Confirmed on the live production entry, Chromium, `.site` at a 16px root
(`probe-tokens.mjs`):

```
--typography-text-primary-nudge-block-start
  serializes as: mod( calc( 0.5rem - mod( calc( ( 1.5rem + 1cap ) / 2 ), 0.5rem ) ), 0.5rem )
  consumed on a body-font element  → 6.456px      (correct)
--typography-heading-1-nudge-block-start
  consumed on a body-font element  → 2.456px      (wrong)
  consumed on the h1 itself        → 1.447px      (correct)
```

The mapper is correct because it applies each role's padding on the element that
also carries that role's font. But Stage 6 hands these properties to component
authors, nothing stops cross-role consumption, and detector gap G2 means a
component can change its `font-family` to the code role and silently move every
derived value. Document the resolution rule in the contract and cover it with a
rule.

## 4. Answers to questions 1–15

### 1. Are the three foundation commits coherent and correctly ordered?

Individually yes; as a sequence, with one real qualification.

`1af40b362` adds `alignment.css`, its export and its test only, and imports
nothing — a clean, inert increment. `054d0e5ce` adds `component-contract.css`,
its export, the three main-entry imports and the shared browser suite.
`c61365b1f` adds `body-role.css`, the reset and normalize changes and the
tier-root application, alone as required. Each builds and tests on its own.

The qualification is a hidden dependency on the dirty work, in the geometry
claim rather than the build. At `c61365b1f`:

- `git show c61365b1f:packages/styles/typography/src/body-role.css` does **not**
  import `./fonts.css`;
- `git grep "@font-face" 533ae3e1b -- packages/**/*.css` shows the only
  production owner was `packages/styles/main/src/fonts.css`, which was opt-in
  (`@canonical/styles/fonts`) and imported by no entry, and whose Mono faces were
  commented out.

So Stage 3 applied `font-family: var(--typography-text-primary-font-family)` at
the product roots while no production entry loaded a single face. Under a
technique where `1cap` resolves against whatever face is actually in use, the
Stage 3 evidence was taken against a fallback unless each fixture loaded fonts
itself. The commit order is defensible, but the font guarantee logically belongs
before or with Stage 3, and the "42/42 after Stage 3" figure should be restated
as bounded to that font state.

A second, smaller point: `git show c61365b1f:packages/styles/typography/src/index.css`
still selects `./baseline-cap.css` as the default engine. At the accepted Stage 3
tip the package shipped two alignment engines at once. That is resolved in the
dirty tree, but it means no accepted commit represents the single-engine state.

### 2. One production `1cap`, resolved against the consuming role's font?

`alignment.css` contains exactly one `1cap` occurrence, on line 21
(`--_typography-cap-unit: 1cap`), verified at `1af40b362` and at HEAD.

Resolution behaviour, `probe-cap.mjs`, three engines, synthetic contract with
`--spacing-baseline: 8px`, body line 24px, h1 line 96px:

| Case | Chromium | Firefox | WebKit |
|---|---|---|---|
| body nudge on a 16px body-font element | 6.70312px | 6.7px | 6.703125px |
| h1 nudge on a 16px body-font element | 2.70312px | 2.7px | 2.703125px |
| h1 nudge on the 64px/96px h1 | 2.8125px | 2.80833px | 2.8125px |
| body nudge on a monospace element | 6.89453px | 6.89167px | 7.429688px |
| serialized value on the root | `mod(calc(8px - mod(calc((24px + 1cap) / 2), 8px)), 8px)` | same | same |

The token stream survives substitution in all three engines and `1cap` resolves
at the consumer. That is the intended mechanism and it works.

**Nested product roots.** With `.docs { --spacing-baseline: 4px }` nested inside
`.site`: outer 6.70312px, inner 2.70312px in Chromium, and the same split in
Firefox and WebKit — the inner root re-derives correctly rather than inheriting a
frozen outer value.

**Exact ties.** Reproduced by the committed suite
(`resolves independent block edges, clamp, exact tie, and one in-box variant`),
which passes in all six projects. The double `mod()` returns `0px` rather than a
full baseline.

**Live production font and size.** `probe-tokens.mjs` on 6114: `.site` resolves
`--typography-text-primary-nudge-block-start` to **6.456px** at a 16px root and
**7.263px** at 18px, against `"Ubuntu Sans"` with `document.fonts.check` true.
The `pre` element resolves the code role against `"Ubuntu Sans Mono"` — the `ch`
advance differs (716.8px vs 721.92px for the same 80ch) while the nudge matches,
because the two faces share a cap height. That is correct, not a fallback.

**The defect.** The value is only correct when consumed on an element already in
that role's font — see B7.

### 3. Is `:where(.ds)` the correct declaration site?

Yes, and it is provably the only correct one.

`probe-cap.mjs`, all three engines, ledger declared on `:where(.ds)` with a
nudge of ~6.703px:

| Case | Chromium | Firefox | WebKit |
|---|---|---|---|
| `.ds` with border-start 1px, border-end 3px → padding start | 5.70312px | 5.7px | 5.703125px |
| the same element → padding end | 3.70312px | 3.7px | 3.703125px |
| nested `.ds` inside it → padding start / end | 6.70312 / 6.70312 | 6.7 / 6.7 | 6.703125 / 6.703125 |

Separate start and end inputs are substituted independently. Asymmetric borders
give asymmetric paddings that keep the content offset from each outer edge equal
to `N`. Zero borders clamp to the full nudge. Nested hosts reset to the
`:where(.ds)` defaults instead of inheriting the outer paint. Live product
change works: `probe-tokens.mjs` shows `--ds-row-padding-block-start` resolves to
the empty string on `.site`, which is exactly right — the ledger exists only on
component hosts.

One footgun for Stage 6, not a defect: a **non-`.ds`** descendant of a bordered
`.ds` inherits the parent's already-resolved, border-subtracted padding
(5.70312px in the probe). That follows directly from the declaration-site rule
the contract documents, but subcomponents that are not themselves `.ds` will
silently inherit their host's border correction.

### 4. Body role and native-control inheritance, once, without moving the rem anchor?

Yes.

`git show c61365b1f -- packages/styles/main/src/reset.css` removes
`font-family` from `:where(html)` and leaves no `font-size` there; the comment
states the reason. `body-role.css` selects
`:where(.site:not(:root), .docs:not(:root), .app:not(:root), :root:is(.site, .docs, .app) > body)`,
so a product marker on `html` routes the font to `body` and leaves the document
as the reader's rem anchor. Live confirmation: at a forced 18px document root,
`html` computes 18px and `.site` computes `"Ubuntu Sans" 18px / 27px`
(`probe-storybook.mjs`).

`normalize.css` replaces `font-family: inherit; font-size: 100%; line-height: 1.15`
with `font: inherit; letter-spacing: inherit` for
`button, input, optgroup, select, textarea`. That is the right shape: it does not
solve a non-inheriting control by giving it a smaller role, and it does not force
native select internals. The `select`/`optgroup` `line-height: normal` that the
engines keep is left alone, and the ledger reads the provider line-height token
rather than the control's computed one. The declaration appears once.

### 5. Was production font loading genuinely incomplete?

Yes, unambiguously, and the minimum required change is separable from the
refactor. See §6 for the full verdict.

### 6. Do font and provider authentication fail closed?

Yes, on every case I could construct. `auth-negatives.ts`, driving the exported
functions with tampered inputs and no change to tracked source:

| Case | Result |
|---|---|
| empty / missing font bytes | closed — "does not match its authenticated upstream bytes" |
| corrupt `dist/sets.primitive.css` | closed — "does not match its authenticated bytes" |
| stale provider version 0.8.0 | closed — "must resolve exactly 0.9.0" |
| normal and italic `src` swapped | closed — "unauthenticated CSS src wiring" |
| `font-display` changed to `optional` | closed — "unauthenticated CSS font-display wiring" |
| extra competing face appended to the owner file | closed — "must declare exactly 4 authenticated faces" |
| family renamed to a fallback (`"Noto Sans"`) | closed — "unauthenticated CSS font-family wiring" |
| weight range widened past the `fvar` table | closed — "unauthenticated CSS font-weight wiring" |
| normal and italic with distinct vertical metrics | closed — "has distinct capHeight; it requires its own lane" |
| Bun SRI absent for the pinned version | closed — "Missing Bun SRI" |
| config smuggling a generated nudge value | closed — "must not contain alignment outputs" |
| `truetype-variations` swapped for `woff2-variations` | closed — "unauthenticated CSS src wiring" |

`bun run src/scripts/checkAuthentication.ts` passes on the current tree.

Nothing here is generator-specific. The config schema actively rejects a file
containing `nudge` or `generator`, which is the right boundary: this
authenticates *inputs*, never alignment outputs.

Two limits worth recording. `assertSoleFontFaceOwner` skips directories named
`dist`, `example`, `examples`, `node_modules`, `test` and `tests`, and only reads
`.css` files under `apps/` and `packages/` — a face injected from JavaScript or
from a `.svelte` style block would not be seen. I checked: `git grep "@font-face"`
over `.ts`, `.tsx` and `.svelte` returns one comment and no declaration, so the
gap is currently theoretical.

### 7. Do all production entries reach the contract and the authenticated font, without a cycle?

Yes for every route that exists in this worktree, and there is no cycle.

**Cycle.** `@canonical/styles-typography` depends only on
`@canonical/design-tokens@0.9.0` and `@canonical/ds-assets@0.37.0`.
`@canonical/styles` depends on `@canonical/styles-typography`. The arrow points
one way; `component-contract.css` importing
`@canonical/styles-typography/alignment.css` follows it.

**Routes.**

| Entry | Alignment contract | Row ledger | Authenticated faces |
|---|---|---|---|
| `@canonical/styles` (`index.css`) | via `component-contract.css` | direct import, line 124 | via `tokens.css` → `body-role.css` → `fonts.css` |
| `@canonical/styles/tokens.css` | via `component-contract.css` | direct import, line 114 | line 128 → `body-role.css` → `fonts.css` |
| `@canonical/styles/elements.css` | via `component-contract.css` | direct import, line 79 | via typography `elements.css` → `body-role.css` |
| `@canonical/styles-typography` (`index.css`) | `elements.css` → `alignment.css` | n/a (typography does not own it) | `elements.css` → `body-role.css` → `fonts.css` |
| `@canonical/styles/fonts` | n/a | n/a | compatibility re-export to the single owner |
| Storybook shell theme | inherits page | inherits page | `theme/fonts.css` re-points to the owner |
| Svelte Launchpad | inherits page | inherits page | `styles/font-faces.css` re-points to the owner |
| boilerplate-vite | `@canonical/styles` | `@canonical/styles` | `@canonical/styles/fonts`, no local face |

`packages/styles/main/test/component-contract.test.js` holds the first three
rows, and it passes (8/8 with 69 assertions).

**Limits on this answer.** `@canonical/styles-vanilla-adapter` does not exist in
this worktree — `packages/styles` contains only `debug`, `main` and `typography`
— so the adapter route named in `index.css` and the main README could not be
exercised. WPE and Launchpad were checked at the source level only. I did not
pack any package; `files` for typography is `["src", "config"]`, which covers
`alignment.css`, `body-role.css`, `fonts.css` and `config/authentication.json`,
but that is a manifest reading, not packed-tarball evidence.

### 8. Is universal `li` styling safe?

No. See B1. The current mapper applies the prose nudge, the trailing
compensation margin **and** the 80ch measure to UI and navigation list wrappers,
today, in production. Recommended narrowest contract-consistent selector:
`li:not(:where(.ds, .ds *))`, applied to both the role assignment and the
trailing block.

### 9. Is the Stage 4 scanner complete?

No. Eight confirmed bypasses (B3, table G1–G9), eight unscanned component
packages (B3, coverage table), no allowlist, no classifications, no wiring (B4).

What is genuinely good and should be kept: `bun test scripts/check-css-contract.test.ts`
passes 29/29 with 60 assertions, and the parts it covers are strong. The
allowlist identity is a SHA-256 over rule, path, selector, property and
normalized value with an exact occurrence count, so a duplicate declaration
cannot hide inside an existing entry; `evaluateAllowlist` fails on new
identities, on grown counts *and* on stale counts, so the list is forced strictly
downwards; `compareAllowlistGrowth` and `compareClassificationGrowth` make both
files deletion-only; `previousTrackedFileText` selects `HEAD` for a dirty tree
and `HEAD^` for a clean commit, so monotonicity is observable in both states;
`gitHistoryErrors` fails closed on a missing or shallow repository;
`allowlistWasDeleted` and `classificationsWereDeleted` block deletion and
recreation; `seedInputErrors` refuses to seed from a dirty, staged or untracked
input; and `--seed` refuses to combine with `--package`, so a package-local seed
cannot capture one slice. Those are the right controls, correctly built.

### 10. The three non-row block-geometry cases

| Case | Source | Classification |
|---|---|---|
| Screen-reader clipping | `packages/svelte/ds-app-launchpad/src/lib/styles/index.css:33` — `.visually-hidden { height: 1px; width: 1px; clip: rect(1px,1px,1px,1px); clip-path: inset(50%) }` | **Closed semantic exception.** This is not a row and never enters the ledger; the 1px box is the accessibility idiom, not geometry. Classify `block-target` and `inline-minimum` at the exact values, with the reason recorded as accessibility clipping. Note it sits in `src/lib/styles/`, which `componentKey()` excludes from the footprint budget but `isComponentCss` still scans, so it does need a classification rather than being silently outside the rules. |
| Application viewport shell | `packages/react/ds-app/src/lib/ApplicationLayout/styles.css:13` — `block-size: 100%` (with `min-block-size: 0` at lines 25 and 29) | **Closed semantic exception.** A viewport-filling shell is a layout surface, not an intrinsic row; the two `min-block-size: 0` declarations already satisfy the rule. Classify only line 13. Separately, `100%` on an app shell is fragile on mobile viewports and `100dvh` would be better, but that is a product decision and must not ride in on this classification. |
| ContextualMenu scrolling surface | `packages/react/ds-global/src/lib/component/ContextualMenu/styles.css:39` — `max-block-size: calc(100dvh - 2 * var(--dimension-200, 16px))` | **Rewrite, then classify.** The viewport bound is right and the source already documents the keyboard-visibility reason. The expression is not classifiable as written: it names a `--dimension-*` primitive and carries a `16px` literal fallback, so classifying it would sanction both. Replace the primitive with a semantic inset alias published by the contract and drop the literal fallback, then classify the resulting exact value. Its `min-width: var(--contextual-menu-min-width)` (12rem) needs its own classification under `inline-minimum`; the 12rem/20rem surface bounds are already sanctioned by the plan. |

None of the three should be allowed to become a target *row* height, and none of
them is one. All three want classifications, not allowlist entries — they are
durable facts, not transitional debt.

### 11. Can the allowlist be seeded now?

No, for two reasons, in this order.

First, the seed would not describe the complete repository violation set while
`AFFECTED_PACKAGE_ROOTS` omits eight packages (B3). Because the allowlist may
only shrink, that omission is not recoverable later: adding those roots
afterwards produces new identities that the growth check must reject.

Second, seeding is one-shot and `seedInputErrors` correctly refuses a dirty tree.
The current tree has 30 modified, 4 deleted and 12 untracked paths, several of
them inside `SEED_INPUT_PATHS`. The support work must land as commits first.

The current strict count is 521 unsanctioned identities. That is an inventory
number and must not be mistaken for the seed: it was taken over six roots, with
the detector gaps of B3 still open, and before any classification exists. The
correct order is — fix the detectors, widen the roots, record the
classifications for the three non-row cases, commit everything, then seed once.

Package-local wiring is safe once seeded: `scopeAllowlist` filters entries by
package prefix and the tests confirm a package-local check sees only its slice.
Adding the guard to each affected package's `check` rather than to a shared
workflow is also the correct placement under Pragma's global-CI rule.

### 12. Which hunks of `feat/bf-metric-nudge` remain reusable?

See §8 for the full ledger. In summary: the font repair and authentication work
is directly reusable and has already been carried across; the twelve component
retrofits are reusable in *shape* but every one names `--_ds-occupied-block-*`
with a single symmetric padding and must be adapted to the per-edge `--ds-row-*`
contract; everything that names, generates or pins a generated nudge is
discarded. A wholesale cherry-pick would reintroduce the generator dependency and
four generated artifacts.

### 13. Do the browser tests measure baselines independently?

Partly — the important control is genuinely independent, but one assertion is
circular and the tolerance is wrong.

**Independent.** `[data-baseline-marker]` is a zero-size `inline-block` with
`vertical-align: baseline`, so its top sits on the line box baseline. Neither the
marker nor `baselineError` repeats the implementation's formula, and
`grep "1cap"` over the whole suite returns one comment and no code. This is the
right instrument and it satisfies the contract's evidence rule.

**Circular.** `expect(|paddingStart − startNudge|) <= tolerance` compares
`padding-block-start: var(--_typography-text-nudge-start)` with a probe whose
`block-size` is the same property, resolved on a child of the same element. It
agrees by construction. It is a legitimate *consumption* assertion in the Stage 8
sense, but it proves nothing about seating and should not be counted as
alignment evidence.

**Wrong bound.** `0.5 / dpr + 0.001` models device-pixel snapping. It is the
cause of ten of the eighteen failures (B2a).

**Minimum evidence before Stage 5.** Green on all 54 shared-contract cases with a
decomposed and justified tolerance; a WebKit-compatible stylesheet injection
route; one negative control per rule showing a deliberately wrong value failing;
and the occupied-block equality assertion promoted to primary, since it is exact
in all three engines (§5).

**Belongs to Stage 8, not here.** Per-component consumption assertions, the three
lane-propagation tests, the device-snap envelope reuse from `Chip.spacing.pw.ts`,
and the per-component negative controls. None of those is a precondition for the
foundation gate.

### 14. Does the Storybook audit report drift truthfully?

Mostly. No page errors in either story in Chromium; the horizontal guides compute
their lane offsets and the three lanes render.

**Production findings the story reports correctly.** The vertical story's
occupied blocks at a 16px root — 24px for the Docs-sized reference, 32px for
body-sized text, 40px for the current unretrofitted controls, 42px for the
outliers — are exactly the expected WIP spread described in the prompt. I
confirmed the components behind them still carry private ledgers, so this is
consumer debt, not foundation drift.

**Story-only defects.**

1. `packages/react/ds-global-form/src/docs/examples/spacing-audit.css:143` uses
   `var(--ds-row-padding-block-start, 0.5rem)` and
   `var(--ds-inline-inset-field, 1rem)`. Those fallbacks make the audit chrome
   render plausibly even if the ledger were entirely missing — in the one story
   whose job is to make a missing ledger visible. Remove the fallbacks so the
   audit fails loudly.
2. The audit header sets `max-inline-size: none` on its headings, so the story
   does not show the measure the production mapper actually applies. That is
   defensible as chrome, but it means the story is not evidence about the
   measure — and the measure is where B1 lives.
3. The specimen labels use `font-size: 0.75rem` and `min-block-size: 8rem`
   (lines 120, 80). Chrome only, and outside the scanner's component path.

The story does not modify component geometry: every probe I ran against it
returned the same computed values as the components' own stories.

### 15. Is the junction ready?

No. **NO-GO.** The smallest set that changes this to GO is in §10.

## 5. Foundation matrix

| Dimension | State | Evidence |
|---|---|---|
| Alignment contract | `alignment.css`, `@layer ds.tokens`, one `1cap`, eight roles + measure | file, line 21; `git show 1af40b362` |
| Alignment declaration owner | `:root, .site, .docs, .app` | file, lines 15–18 |
| Row ledger | `component-contract.css`, `@layer ds.tokens`, per-edge borders, double `mod()` compensation, one in-box variant | `main/test/component-contract.test.js`, 8/8 |
| Row ledger declaration owner | `:where(.ds)`, exactly one occurrence | same test; probe §3 |
| Import routes | `index.css`, `tokens.css`, `elements.css` all import the ledger; ledger imports the contract; `body-role.css` imports `fonts.css` | §4 Q7 table |
| Font owner | `packages/styles/typography/src/fonts.css`, sole owner enforced | `checkAuthentication.ts`, `assertSoleFontFaceOwner` |
| Engines | Chromium 149, Firefox 151, WebKit 26.5 | all probes and the Playwright run |
| DPR | 1 and 2 | `playwright.spacing.config.ts`, six projects |
| Products | Site, Docs, App, nested Docs-in-Site | §4 Q2, Q3 |
| Root sizes | 16px, 18px | §5 table below |
| Occupied block, Chromium 16px | p 31.997 / h1 55.990 / h3 39.988 / docs 23.992 → 32, 56, 40, 24 | `probe-baseline2.mjs` |
| Occupied block, Chromium 18px | p 35.987 / h1 62.997 / h3 44.996 / docs 26.989 → 36, 63, 45, 27 | same |
| Occupied block, WebKit 16/18px | 31.984 / 55.984 / 39.984 / 23.984 and 35.984 / 62.984 / 44.984 / 26.984 | same |
| Occupied block, Firefox 16px | 32.008 / 56.000 / 40.000 / 24.000; `li` 32.508 | same |
| Failure controls, provider | version, Bun SRI, three raw SHA-256 artifacts | 12/12 negatives closed |
| Failure controls, fonts | bytes, Git blob, family, subfamily, `useTypoMetrics`, no `MVAR`, five vertical metrics, axis bounds, six CSS descriptors, sole ownership | 12/12 negatives closed |
| Failure controls, contract | 29/29 scanner tests; 8 proven bypasses | §4 Q9 |

**Technique difference against the preserved generator**, both at a 16px root,
generator values read from
`feat-bf-metric-nudge:packages/styles/typography/src/alignment.generated.css`:

| Role | Generator | CSS `1cap` | Δ |
|---|---|---|---|
| body (Site) | 0.41rem = 6.560px | 6.456px | 0.104px |
| heading 3 (Site) | 0.46917rem = 7.5067px | 7.684px | 0.177px |
| heading 1 (Site) | 0.06881rem = 1.1010px | 1.447px | 0.346px |
| body (Docs/App) | 0.0775rem = 1.240px | 1.149px | 0.091px |

All inside the stated 0.4px envelope. One caveat worth stating plainly: the
generator values are in `rem`, so the difference scales with the root. At an 18px
root the heading-1 difference is 0.389px — still inside the envelope, but only
just, and a larger root would exceed it. The 0.4px figure is a property of the
root size, not of the technique, and should be recorded that way.

## 6. Font-loading verdict

**What existed.** At the accepted base `533ae3e1b`, four files declared
`@font-face`: `apps/react/boilerplate-vite/src/styles/index.css`,
`packages/storybook/addon-canonical-shell-theme/src/theme/fonts.css`,
`packages/styles/main/src/fonts.css` and
`packages/svelte/ds-app-launchpad/src/lib/styles/font-faces.css`. Four competing
owners, no single source.

**What was defective.**

1. `packages/styles/main/src/fonts.css` was opt-in only. `git grep "fonts.css"`
   over `main/src/index.css`, `elements.css` and `tokens.css` at `533ae3e1b`
   returns nothing. No production entry loaded a face.
2. Both Ubuntu Sans Mono faces were commented out, and the file itself records
   why: the two shipped `.woff2` files were ~300 KB HTML error pages, not fonts
   (tracked as PRA-146). The code role therefore had no authenticated face at
   all.
3. `@canonical/ds-assets` was an **optional peerDependency** of
   `@canonical/styles` — the asset package could legitimately be absent.
4. Launchpad's own faces carried different vertical metrics, which under a
   `1cap` contract changes every nudge in that product.

That is a genuine, pre-existing incompleteness. It is not a pretext for the
refactor.

**Minimum required production change**, separated from the rest:

- move the four `@font-face` declarations to `packages/styles/typography/src/fonts.css`;
- import that file from `body-role.css`, which every entry already reaches;
- replace the two corrupt Mono assets with authenticated v1.006 TTFs (recoverable
  in Git and in the preserved worktree);
- make `@canonical/ds-assets` an exact runtime dependency of typography;
- re-point the three competing owners at the single owner.

Everything else in the font work — the README rewrite, moving `extractFontData.ts`
to `example/scripts/`, making `opentype` development-only, removing the published
bin, retiring `baseline-cap.css`/`baseline-metrics.css`/`baseline-trim.css` to
`example/styles/`, removing the `./src/*` wildcard export — is desirable
housekeeping but is not part of the `1cap` guarantee and should be reviewable
separately.

**One thing to record rather than fix.** `font-display: swap` is authenticated as
a required descriptor. Under `1cap` the fallback face changes every nudge during
the swap period, which does not happen under generated metrics. I checked the
magnitude: at a 16px root the fallback nudge measured 6.703px against Ubuntu
Sans's 6.456px, and both land in the same modulo band, so
`--ds-row-occupied-block-size` stays 40px either way and only the sub-pixel text
position shifts. The risk is real but small, and the compensation term absorbs it
by construction. Record the reasoning in the contract so the next reader does not
have to rediscover it.

## 7. Enforcement verdict

**Scanner completeness: incomplete.** Nine rules, 29 passing unit tests, strong
allowlist and Git-monotonicity design (§4 Q9). Against that: eight proven
bypasses (G1, G2, G4, G5, G6, G7, G8, G9) and eight component packages outside
the scan. Four of the bypasses are new relative to the three already recorded.
G9 is the most serious — a private modulo ledger written with `round()` instead
of `mod()` is invisible, which defeats the rule's purpose.

Two further rule gaps worth closing while the file is open: nothing constrains
`font-family` in component CSS, so a component can select the code role and move
every derived value; and nothing constrains `line-height`, so a component can
redefine `--ds-row-line-height` and silently detach its painted block from the
product line.

**Classifications: three needed, one blocked.** Screen-reader clipping and the
application shell can be classified as they stand. ContextualMenu's viewport
bound must be rewritten to drop the `--dimension-*` primitive and the `16px`
literal before it can be classified, because a classification sanctions an exact
value and would otherwise sanction those too (§4 Q10).

**Allowlist readiness: not ready.** No file exists; 521 unsanctioned identities
over an incomplete root set; the tree is dirty and `seedInputErrors` correctly
refuses it; no package composes the guard. The one-shot, never-grows, must-shrink
design is right and the tests hold it — it simply must not be fired until the
inputs are correct, because it can only be fired once.

## 8. Reuse ledger — `feat/bf-metric-nudge`

Read at `533ae3e1b` with substantial uncommitted work. Nothing was modified.

### Direct reuse — technique-independent, already carried across

| Hunk | Note |
|---|---|
| `packages/ds-assets/fonts/ubuntu-sans/UbuntuSansMono[wght].ttf` and `UbuntuSansMono-Italic[wght].ttf` (untracked) | the authenticated v1.006 replacements |
| deletion of the two corrupt `UbuntuSansMono*.woff2` | HTML error pages, not fonts |
| `packages/styles/typography/src/fonts.css` | the four-face single owner |
| `packages/styles/typography/src/fontkit.d.ts` | needed by the authentication reader |
| `packages/styles/typography/src/body-role.css` | identical intent; already committed as Stage 3 |
| `packages/storybook/addon-canonical-shell-theme/src/theme/fonts.css` re-point | removes a competing owner |
| `packages/svelte/ds-app-launchpad/src/lib/styles/font-faces.css` re-point | removes a competing owner with different metrics |
| `packages/styles/main/src/fonts.css` → compatibility re-export | keeps `@canonical/styles/fonts` working |
| `packages/svelte/ds-app-launchpad/package.json` gaining `@canonical/styles-typography` | real dependency, not a peer |
| deletion of `tests/verify-bf-side-navigation-oracle.ts`, `tests/verify-bf-form-oracle.ts` and their `test:spacing:provenance` entries | generator provenance scripts, correctly retired |
| retiring `./src/*` and the three legacy engine exports from the typography manifest | the wildcard leaked private paths |

### Adaptation to `--ds-row-*`

| Hunk | Required change |
|---|---|
| `packages/styles/typography/src/occupied-block.css` | superseded by `component-contract.css`; the naming (`--_ds-occupied-block-*`) and the **single symmetric** `--_ds-occupied-block-padding-block` must become per-edge `--ds-row-padding-block-start` / `-end` |
| the twelve component stylesheets — Chip, Button, Tabs Item, Accordion Item, ContextualMenu Item, ColorInput, ComboboxInput, ComboboxInput ResetButton, FileUploadInput, SideNavigation (Header, Item, NavTree), Launchpad Button/Select/NavigationItem/InputPrimitive, WPE Button | the shape is exactly right — private ledger deleted, `font: inherit`, `margin-block: 0 <compensation>`, paint-derived `min-inline-size`, `block-size: auto`, `min-block-size: 0`. Rename `--_ds-occupied-block-*` → `--ds-row-*`, split the symmetric padding per edge, and replace `--_chip-border-width`-style paint inputs with `--ds-row-border-block-start` / `-end`. Sampled: `Chip/styles.css` |
| `.storybook/*-spacing-contract.css` harnesses (button, chip, tabs, accordion, form, side-navigation) | same rename; the harness shape survives |
| `spacing-contract.tests.ts` and `ContextualMenu.spacing.tests.ts` string assertions | retarget to the shared property names; delete the assertions pinning `0.0775rem` / `0.41rem` |
| `packages/styles/main/test/metric-engine-reachability.test.js` | superseded by `component-contract.test.js`; take any route it covers that the newer test does not |

### Discard — generator-coupled

| Hunk | Reason |
|---|---|
| `@lyubomir-popov/baseline-nudge-generator@1.5.1` in the typography manifest | Pragma carries no build-time generator |
| `src/scripts/generateBaselineNudges.ts` and the `generate:baseline-nudges` / `check:baseline-nudges` scripts | build-time generation is out of scope |
| `src/alignment.generated.css`, `src/alignment.generated.json`, `src/baseline-generated.css`, `config/baseline-nudges.json` | generated artifacts and pinned constants |
| `src/baseline-nudge-generator.d.ts` | types for the discarded dependency |
| the `./alignment.generated.css`, `./alignment.generated.json`, `./baseline-generated.css`, `./occupied-block.css` exports | replaced by `./alignment.css` and `@canonical/styles/component-contract.css` |
| any suite that derives an expected nudge from a generated constant | the contract forbids an oracle that agrees with the implementation by construction |

The prior green matrices and the GO in `review.md` are evidence for the
superseded implementation and are not acceptance of this contract. Keep the
worktree unchanged until the retrofits land.

## 9. Demo interpretation

**Expected WIP drift.** The vertical story's 24 / 32 / 40 / 42px occupied blocks
are the unretrofitted consumers. Eleven component stylesheets still derive `1cap`
privately and ContextualMenu still pins `0.0775rem` / `0.41rem`. The `strict`
scan's 521 unsanctioned identities are the same debt counted a different way.
None of this is grounds to reject the foundation.

**No foundation drift.** The decisive measurement is the occupied block, and it
is exact everywhere I looked. At a 16px root in Chromium: body 31.997px, h1
55.990px, h3 39.988px, Docs body 23.992px — 32, 56, 40 and 24, four, seven, five
and six baselines. At 18px: 35.987, 62.997, 44.996, 26.989 — 36, 63, 45, 27.
WebKit lands within 0.02px of the same values; Firefox lands on them exactly. The
rhythm does not accumulate. The prompt's ~6.456px body nudge at a 16px root is
reproduced exactly, and the technique difference against the generator is
0.09–0.39px across roles.

**The one genuine multi-source error is in the tests, not the geometry.** The
first-baseline error I measured with an independent marker ranges from 0.031px
(WebKit, Docs, 18px root) to 0.859px (Chromium, Docs, 16px root). Decomposed:

- **Engine line-box quantization** — dominant. Chromium rounds the baseline
  inside the line box to a whole CSS pixel. On the Docs role at a 16px root the
  ideal baseline sits at 16.000px from the box top and Chromium places it at
  15.141px; against a 4px grid that is a 0.859px error from rounding alone.
  Firefox and WebKit round to halves and land at 0.031–0.55px.
- **The accepted cap approximation** — ≤0.39px at the largest role at an 18px
  root, and 0.104px at body.

The contract already states that exact seating is unreachable by any CSS
technique and that Chromium quantizes to whole pixels. Both facts are true here.
The suite's single `0.5 / dpr` bound models neither of them, so it fails on
correct geometry.

**Story-only defects** are listed under §4 Q14. The most important is the
fallback in `spacing-audit.css:143`, which would let a completely missing ledger
render plausibly in the story built to expose it.

## 10. Required correction sequence and re-review boundary

In order. Each step is small and independently reviewable.

1. **Narrow the `li` selector** to `li:not(:where(.ds, .ds *))` in both the role
   assignment and the trailing block of
   `packages/styles/typography/src/elements.css`. Re-measure the four leaks in
   B1 and confirm prose lists are unchanged. **(B1)**
2. **Correct the baseline tolerance** in `SharedContracts.spacing.pw.ts`:
   decompose into a per-engine line-box quantization term and the accepted cap
   term, justify each in a comment, promote the occupied-block equality to the
   primary assertion, and replace the WebKit `addStyleTag({ url })` route. Run
   all 54 cases green. **(B2)**
3. **Close the eight detector gaps** — `font` shorthand, `font-family` role
   selection, `line-height` and `--ds-row-*` input overrides, cross-role nudge
   consumption, `aspect-ratio` targets, string-constructed cap oracles, the
   same-line negative-assertion bypass, and `round()`-based private ledgers — and
   add a failing fixture for each. **(B3)**
4. **Widen `AFFECTED_PACKAGE_ROOTS`** to every package that ships component CSS,
   and record `packages/react/tokens`'s quarantine explicitly rather than by
   omission. **(B3)**
5. **Rewrite ContextualMenu's `max-block-size`** to a semantic alias with no
   primitive and no literal fallback, then record all three classifications in
   `config/css-contract-classifications.json`. **(B5)**
6. **Document the `1cap` resolution rule** in `contracts/baseline-alignment.md` —
   that a role nudge is a deferred token stream and is only correct on an element
   already carrying that role's font — and record the `font-display: swap`
   reasoning from §6. **(B7)**
7. **Justify or scope the `push.yml` change** in the PR body. **(B6)**
8. **Commit the support work**, so the tree is clean.
9. **Seed the allowlist once**, from a clean tree, over the widened root set,
   with the corrected detectors and the classifications in place. Wire the guard
   into each affected package's `check`, not into a shared workflow. **(B4)**

**Re-review boundary.** A re-review is warranted once steps 1–9 are complete and
the following four things can be shown together: all 54 shared-contract cases
green with the decomposed tolerance; each of the eight new detector rules shown
failing a deliberate violation; the seeded allowlist committed with its exact
identity count and every affected package's `check` failing when an entry is
added; and the three classifications present with reason and evidence. The
re-review should re-run only §4 Q8, Q9, Q11, Q13 and the §5 occupied-block
matrix. Q2, Q3, Q4, Q6, Q7, Q10 and Q12 do not need re-examination unless the
corrections touch them.

---

**Stages 5–8 are not authorized to proceed.** Component retrofit work must not
begin. No merge, push, publication or release is authorized. `feat/bf-metric-nudge`
must remain unchanged until its reusable hunks are adapted under §8.
