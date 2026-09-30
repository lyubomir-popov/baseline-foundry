# Typography and sizing remediation — work order

**Status**: blocking. No further component restyling until sections 1–3 are done.

**Why now**: each additional restyled component copies the current typography
pattern. Twelve components already carry a duplicated spacing ledger; the same
thing is starting with font size. The cost of this remediation grows with every
slice, and it is cheapest today.

**Governing rule**: [`docs/typography-discipline.md`](../../docs/typography-discipline.md).
Read it before touching any CSS. Spec 022 FR7, FR7a, FR7b and acceptance 5 have
been amended to match; the previous 14px/20px Site mandate is withdrawn.

## Findings

Verified in the `feat/bf-spacing-model` worktree against `main` (`7193fe082`).

### The migration is already moving the right way

| Component | On `main` | Now | |
|---|---|---|---|
| Chip | `var(--font-size-small)` | `text-primary` | fixed |
| Badge | `text-tertiary-bold` | `text-primary` | fixed |
| Tabs | authored `min-block-size: baseline × 5` | removed, `block-size: auto` | fixed |
| Button | `text-secondary` | `text-secondary` | **untouched** |

Two of three font-size deviations were corrected by the migration, and an
authored target height was removed. This is not a mess being introduced — it is a
cleanup that stopped one component short.

### F1 — Button is the last non-body control, and the spec had blessed it

`packages/react/ds-global/src/lib/component/Button/styles.css`:

```css
--button-font-size: var(--typography-text-secondary-font-size);
```

This predates the migration. It was then written into Spec 022 as a MUST in three
places, converting inherited debt into a requirement. Those clauses are now
withdrawn. Site buttons are 16px/24px and inherit from the product root.

Blast radius is four files — `text-secondary` has exactly four consumers:

- `packages/react/ds-global/src/lib/component/Button/styles.css`
- `packages/react/ds-global-form/src/lib/subcomponent/ComboboxInput/styles.css`
- `packages/svelte/ds-app-launchpad/src/lib/components/Timeline/common/Event/styles.css`
- `packages/svelte/ds-app-launchpad/src/lib/styles/ds-shim.css`

Note that Site secondary (14/20) is identical to Docs/App body, so a Site button
currently renders at Docs body size. Moving it to Site body is a visible change
and needs Chromatic review, not a silent swap.

### F2 — the product root publishes the body size but never applies it

`.site`, `.docs` and `.app` define `--typography-text-primary-font-size` and never
declare `font-size`. Nothing inherits a body size, so every component must
re-declare it. That is why there are nineteen `--typography-*-font-size` reads
across component CSS for what is one decision.

This is the root cause of the duplication, and one declaration removes it.

### F3 — hardcoded and compounding sizes in unmigrated surfaces

| File | Value | Problem |
|---|---|---|
| `svelte/ds-app-launchpad/.../GitDiffViewer/common/CodeDiffViewer/styles.css` | `font-size: 13px` | raw px, immune to root scaling |
| `react/ds-global-form/.../ComboboxInput/styles.css` | `font-size: 0.75em` | **compounds with nesting depth** |
| `svelte/ds-app-launchpad/.../DiffChangeMarker/styles.css` | `0.75rem` | hardcoded |
| `svelte/ds-app-launchpad/.../MarkdownEditor/styles.css` | `0.75rem` | hardcoded |
| `svelte/ds-app-launchpad/.../FileTree/common/SearchBox/styles.css` | `1rem` | hardcoded |
| `react/ds-global-form/.../ComboboxInput/common/ResetButton/styles.css` | `1rem` | hardcoded |

The `em` case is the only outright bug: the same component renders at a different
size depending on where it is placed.

### F4 — minimum sizes are mostly fine

Most `min-*` in component CSS is `min-block-size: 0` or `min-inline-size: 0`,
which removes the automatic `min-content` floor so a flex or grid item can shrink
and truncate. That is plumbing and stays.

Only three real floors exist, all inline, none affecting block geometry:

- **Badge** `min-inline-size: var(--badge-painted-line)` — paint-derived, keep.
- **Chip** `min-inline-size: min(100%, painted block + 2 × border)` — paint-derived, keep.
- **ContextualMenu** `--contextual-menu-min-width: 12rem` / `max-width: 20rem` —
  component-local surface bounds. Keep; floating surfaces are out of scope.

No component declares a target height. Do not introduce one.

### F5 — no text measure, and one non-scaling length

Nothing constrains line length. The agreed value is `max-width: 80ch` on text
elements, published as a single token.

Separately, `--tooltip-max-width: 284px` is the only length in the React
component CSS that does not scale with root size at all.

## Tasks, in order

### 1. Apply the body role at the product root

Add to `packages/styles/main`, in the layer that owns product roots:

```css
.site, .docs, .app {
  font-family: var(--typography-text-primary-font-family);
  font-size: var(--typography-text-primary-font-size);
  font-weight: var(--typography-text-primary-font-weight);
  letter-spacing: var(--typography-text-primary-letter-spacing);
  line-height: var(--typography-text-primary-line-height-dimension);
}
```

Then add `font: inherit` to the non-inheriting elements — `button`, `input`,
`select`, `textarea`, `optgroup` — in the reset, so controls receive the tier
size instead of a UA font. This is the correction; do **not** solve a
non-inheriting control by assigning it a smaller role.

Nothing else in this task. Land it alone so a regression is attributable.

### 2. Move Button to the body role

Delete `--button-font-size`, its line-height partner, and every derived local
alias that exists only to carry them. Button inherits. Update the Button spacing
oracle and browser suite to assert the body role rather than `0.875rem`, and
review the affected Chromatic routes — this is a deliberate visual change.

Apply the same to the other three `text-secondary` consumers. If the Launchpad
Timeline event genuinely needs smaller copy, it does not get to decide that
locally: raise it as an exception with measured evidence.

### 3. Delete the per-component font declarations

With task 1 landed, every `font-size: var(--typography-text-primary-font-size)`
in component CSS is redundant. Remove them, along with the private aliases that
exist only to hold them (`--_chip-font-size`, `--_tabs-tab-font-size`,
`--_contextual-menu-item-font-size` and their font-family, font-weight and
letter-spacing siblings).

Keep `line-height` where a component's ledger reads it, until the shared row
contract lands and owns it.

Remove the public `--chip-font-size` and `--tabs-tab-font-size` override hooks.
A per-component size override contradicts the single-declaration rule, and it is
only ever safe when the ledger is formula-derived — which is not a property we
want individual components to have to guarantee.

### 4. Fix the hardcoded and compounding sizes

Convert the six values in F3 to the provider's code role or the body role. The
`0.75em` is the priority. Quarantine `packages/react/tokens` — it is a token
inspector, not product UI — with a comment saying so, and exclude it from the
checks in task 6, so nobody "helpfully" migrates a debugging surface.

### 5. Add the text measure and fix the one non-scaling length

Publish a single measure token in the shared layer at `80ch` and apply it to text
elements. Do not apply it to component boxes generally.

Convert `--tooltip-max-width: 284px` to a root-relative length. Leave
ContextualMenu's `12rem`/`20rem` alone — floating surface bounds are
component-local by decision, not an oversight, and the lint rule in task 6 must
exempt them.

### 6. Make it enforceable

Add to each package's `check:webarchitect`:

1. no numeric or `em`-relative `font-size` in component CSS;
2. every `font-size` resolves through a `--typography-<role>-*` property;
3. non-body roles only for entries in `config/type-roles.json` (currently empty);
4. in component CSS, no `block-size` other than `auto`, no `min-block-size`
   other than `0`, no `max-block-size` other than `none`;
5. an inline minimum must reference a paint-derived property.

Rules 1–3 make tasks 2–4 permanent. Without them this recurs on the next slice.

## Acceptance

- Every non-heading component's computed font size equals its product body role,
  in Site, Docs and App, at 16px and 18px roots.
- Exactly one body `font-size` declaration exists per product root; component CSS
  contains none.
- `git grep` for `text-secondary`, `text-tertiary`, `--font-size-small` and
  `--font-size-default` returns nothing in component CSS.
- No component declares a target height, block minimum other than `0`, or block
  maximum other than `none`.
- The webarchitect rules fail a deliberately introduced violation of each of
  rules 1–4. Demonstrate the red before claiming the green.
- Root `bun run check` and `bun run test` pass; affected Chromatic routes are
  reviewed, with the Button size change called out explicitly.

## Do not

- Do not add a type scale, a size modifier API, or a `size` prop.
- Do not fix a non-inheriting control by giving it a smaller role.
- Do not add a target height, block minimum or block maximum to make something
  look right. If geometry is wrong the component should look broken — that is
  the accountability the intrinsic ledger buys, and a floor throws it away.
- Do not restyle further components until tasks 1–3 are merged.
