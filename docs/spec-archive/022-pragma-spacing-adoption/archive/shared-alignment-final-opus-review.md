# Final Pragma shared-alignment and RichChoices review

Date: 2026-09-12
Range reviewed: `d186c422c..a8441f45d` (RichChoices/T053/T066/T067 slice)
Worktree tip observed: `5dacf4902` (Card T068/T069 slice, reviewed separately below)
Repository: `H:\WSL_dev_projects\pragma\.claude\worktrees\feat-bf-shared-alignment`

## 1. Verdict

**`GO` for the RichChoices range `d186c422c..a8441f45d`. T053, T066 and T067 can
remain complete.**

**The owner's proposed seam decision is `GO with required corrections`** — the
recommendation is sound and I endorse proceeding, but the stated form of the
change ("one Card rule") is under-specified in a way my probes prove is
load-bearing. See finding P1-1. This does not reopen the accepted range.

## 2. Findings

### P1-1 — The seam rule must be unthemable and card-invariant, not a per-card knob

The recommendation is stated as "one Card rule plus adjacency/band tests". That
is correct only if the rule is *unconditional* on `.ds.card`. A three-engine
probe of a mixed band — one card with `row-gap: 0`, two without — shows the
section tracks are shared by the band, so a card that opts out of the gap
**loses cross-card alignment entirely**:

| Mixed band, one card zeroed | Chromium | Firefox | WebKit |
|---|---:|---:|---:|
| Zeroed card Header→Content | 0 | 0 | 0 |
| Default card Header→Content | 16px | 16px | 16px |
| Content tops aligned across cards | **false** | **false** | **false** |
| Footer tops aligned across cards | **false** | **false** | **false** |
| Card heights equal | true | true | true |

The card box heights stay equal (the band still sizes them), which makes this
failure *invisible to a height-equality assertion* and visible only as
mis-registered section content — precisely the property the contract calls
cross-card alignment. Two consequences:

1. The rule must be a raw, unthemable `row-gap: 0` on `.ds.card`, in the same
   spirit as the existing `padding-block-end: 0` seam collapse, which the source
   already documents as "raw 0: unthemable by design". It must **not** become
   `var(--card-row-gap, 0)` or any public knob; a consumer setting it on one card
   silently breaks the band.
2. The required band test must assert **section-edge registration across cards**
   (content tops and footer tops on a shared line), not merely equal card
   heights. The existing suite's `neighbor subgrid alignment` and
   `shared footer track` checks do compare `top` values, so the shape is already
   present — it needs extending to a card that omits a named section.

### P2-1 — "Adjacent existing sections touch" is not what `row-gap: 0` produces

`row-gap: 0` removes the gutter from **all four** shared tracks at once, not
just the Header→Content seam. My probe confirms it also collapses
Content→Footer from 16px to 0 in all three engines. That is very likely intended
(a card is one delimited object separated by its dividers, and Content/Footer
already carry their own Surface block padding plus a divider stroke), but the
review's table only reports the Header→Content row. The decision record should
state explicitly that Content→Footer and Image→Header also go to 0, so a later
reader does not treat that as regression. My measurement:

| Card 1, two-line content | Current | `row-gap: 0` |
|---|---:|---:|
| Header → Content | 16px | 0 |
| Content → Footer | 16px | 0 |
| Card height | 186px | 146px |

### P2-2 — An omitted section leaves a *smaller* blank slot after the change

The recommendation says an omitted named section "leaves a blank slot so cards
remain aligned". True, but the slot shrinks, because the removed gutters were
part of what the empty track contributed:

| Omitted-section slot | Current | `row-gap: 0` |
|---|---:|---:|
| Card omitting Header: card top → content top | 65px | 41px |
| Card omitting Footer: content bottom → card bottom | 57px | 41px |

All three engines agree. Alignment is preserved in both cases
(`contentTopsAligned`, `footerTopsAligned`, `cardHeightsEqual` all true when
every card carries the rule). The blank slot is not eliminated, so cards with
and without a given section still register — which is the recommendation's
stated goal, and it holds.

No P0. No other P1. Nothing in the reviewed range regresses Table or Log.

## 3. Answers to the required questions

**Q1 — Does production RichChoices implement exactly the three-part card model,
with no hidden row-family consumption, border subtraction, target height or new
formula? Yes.**

`packages/react/ds-global-form/src/lib/component/RichChoicesField/styles.css` is
the whole implementation, and it is exactly three parts:

- the card (`& > label`) owns `border` / `background-color` / `border-radius`
  from the existing `--form-input-*` family and *equal* padding from
  `--spacing-inset-surface-block` / `--spacing-inset-surface-inline`;
- the same element is the content stack (`display: flex; flex-direction:
  column`) owning `gap: var(--form-group-gap, var(--spacing-gap-field-block))`;
- text spans carry their own typography.

Verified absences: no `--ds-row-*`, no `--ds-in-box-row-*`, no `1cap`, no
`mod(`, no `calc()` subtracting `--form-input-border-width` from any padding, and
no `block-size` / `min-block-size` / `height` on the card. `box-sizing:
border-box` is present but that is a containment choice, not a border
subtraction from the inset, and the browser suite independently measures the four
resolved paddings against the two Surface tokens rather than trusting the
declaration. The group is not in either row family; the
`spacing-contract.tests.ts` oracle asserts `tokens` does **not** match
`/\.ds\.form-rich-choices,/`, i.e. the selector was not added to the row
ledger's selector list.

**Q2 — Are scalar labels wrapped exactly once and rich nodes preserved, with
valid label markup and native semantics? Yes.**

`Option.tsx` branches on `typeof option.label === "string" || … === "number"`
and wraps only that case in a single `<span className="p">`; every other node is
passed through untouched. `RichChoices.tests.tsx` proves both directions
positively *and negatively* — `label` itself must not carry `.p`, and a rich
label must yield no `label > span.p`. The SSR suite additionally asserts the
serialized string contains `<span class="p">Plain</span>`, matches
`/<label[^>]* for=/`, and does **not** contain `<label class="p"`. Markup is
phrasing-valid: the story fixtures use `<span className="p">`, and the source
gate asserts the story file contains no `<p>` (a block element inside `<label>`).
Native semantics are a real `<input type=radio|checkbox>` plus `<label for>`
with an `aria-labelledby` back-reference; the browser suite checks
`labelFor === inputId && labelledBy === labelId` on every card.

**Q3 — Does the source gate reject exact definitions and real `var()` references
to `--start-nudge` / `--end-nudge` across all the listed evasions? Yes.**

I ran 16 adversarial *positive* probes against `retiredRichChoicesNameErrors`
directly (not through the committed test file), all rejected correctly: exact
definition of each name; plain reference; single- and double-nested `var()`
fallback; one-hop alias then use; a quoted string sitting beside the real token;
a comment between `var(` and the name; interior whitespace; uppercase `VAR(`; an
escaped *function* name (`v\61 r`); an escaped *property* name
(`\2d\2dstart-nudge`); an escape inside the name (`--start-nud\67 e`); a
reference inside a nested rule; a final declaration with no semicolon; and a
CRLF-terminated escape. The CRLF case is the one `a8441f45d` exists to fix, and
it is the only case where the gate needs `rawValue`: `blankComments` is now a
character scanner that preserves escapes and string state, and
`consumeCssEscape` consumes `\r\n` as a single escape terminator.

**Q4 — Does the gate avoid false positives, and leave raw diagnostics and
allowlist identities unchanged? Yes to both.**

Ten *negative* probes all returned zero: a commented-out declaration; the name
inside a quoted string; a longer name (`--start-nudge-extra`); a prefixed name
(`--choice-start-nudge`); `myvar(--start-nudge)`; `#var(…)` and `@var(…)` hash/at
tokens; an escape that decodes to a *different* property (`--start-nudge\!`); a
Unicode-differing name (`--start-nudgeé`); and the subtle one — an escape whose
terminating whitespace splits the function name (`v\61  r(…)`, two spaces),
which must *not* be read as `var`. Scope is also correct: the gate filters to
`isProductionCss`, and my probes confirm a `tests/fixtures/*.css` and a
`.storybook/*.css` copy of the same violation are ignored.

Separation from the raw basis is structural, not incidental:
`retiredRichChoicesNameErrors` is its own exported function whose result is
joined with `inBoxConsumerErrors` at the CLI, never folded into
`findCssContractViolations`. So it cannot be silenced by an allowlist entry, and
it cannot move a count. The global count is unchanged from the recorded
expectation (see §4), and `config/css-contract-allowlist.json` in this range only
*loses* 99 lines — the direction the monotonicity guard permits.

**Q5 — Do browser tests authenticate tier, root size, DPR, exact leading family
and a loaded real face, and does removing the real font make the same assertion
fail? Yes.**

`cardContractErrors` fails on any of: wrong tier (read from the nearest
`.site/.docs/.app` ancestor, not assumed), root `font-size` off by >0.01px,
wrong computed `direction`, wrong `devicePixelRatio`, a leading body family that
is not exactly `Ubuntu Sans` after quote-stripping, and the absence of a
`document.fonts` entry for `Ubuntu Sans` with `status === "loaded"`. The negative
control is real and correctly bounded: `expectRemovedFontToFail` opens a
**disposable** page, forces the face to load, then walks `document.styleSheets`
(recursing through `CSSImportRule`) deleting `CSSFontFaceRule`s whose family is
`Ubuntu Sans`, deletes the matching `FontFace` records, asserts
`rulesRemoved > 0`, and then asserts the *same* `cardContractErrors` call now
contains `"Ubuntu Sans does not have an exact loaded FontFace record"`. That is a
genuine falsifiability proof, not a tautology.

I separately confirmed **no production font loading was changed**: `git diff
d186c422c..HEAD --name-only` filtered for `font|typography|styles/` returns
nothing, and the whole-range `--stat` for `packages/styles/` is empty. The claim
holds.

**Q6 — Do tests prove equal padding, the exact Field gap, real wrapping,
unequal-content neighbours at equal heights, scalar and rich leaves, RTL,
keyboard focus independent of selection, a real Space transition, disabled
clicks, native semantics and restored negatives? Yes.**

All four card edges are compared against the two Surface tokens resolved *at the
card* through an appended probe span (`calc(var(--token) + 17px)` then subtract
17), which reads the value in the card's own inheritance context rather than
trusting a root value — the correct technique given the declaration-site rule in
the contract. `stackGap` is compared to the resolved `--spacing-gap-field-block`,
tolerance 1/32px. Wrapping is proven by measured leaf height exceeding 1.5
line-heights, not by a wrap declaration. Unequal neighbours are compared for
equal `top` and equal `height` while requiring `left` to *differ* (so the
assertion cannot pass by comparing an element to itself). RTL flips
`document.documentElement.dir` and re-reads computed direction. Keyboard focus is
reached by real `Tab` presses, asserted `toBeFocused()` **and**
`not.toBeChecked()` — that is the focus/selection independence — with focus paint
compared against an unfocused sibling; then `Space` produces a real checked
transition. Disabled cards are clicked with `force: true` and must remain
unchecked, and a `.focus()` call must not focus them.
`injectWrongPaddingAndRestore` verifies the oracle notices an injected +5px
padding and that removing the injection restores a clean sample, so the negative
probes are restored rather than left mutated.

**Q7 — Reproduced evidence.** See §4. Scanner unit suite 81/81, global count
`308 / 27 / 275 / 6 / 0`, form vitest 314/314, global vitest 396 passed /
5 skipped, RichChoices Chromium DPR1 3/3, Card Chromium DPR1 2/2. Evidence was
internally consistent, so per the prompt I did not expand the *product* suites to
all engines; I did run my own three-engine probes for the seam decision.

**Q8 — Can T053, T066 and T067 remain closed? Yes.**

The RichChoices correction is complete and independently verified above; the
retired-name gate is fail-closed with no false positives and no change to the raw
diagnostic or allowlist basis; and nothing in `d186c422c..a8441f45d` touches
Table or Log sources. I found no reason to reopen any of the three, and no reason
to reopen Table or Log.

**Q9 — Boundaries confirmed.** The Vanilla adapter remains unavailable and out of
scope. Native 100%/125%/150% zoom remains **T012, open** — nothing here claims
it; the browser matrix varies DPR and root font size, which is explicitly *not*
native zoom. The remaining component inventory remains **T019, open**. Svelte WPE
Card (T070) has not started, so T071's cross-framework matrix cannot run. **No
merge, push, publication or release is authorized, and none occurred.**

## 4. Reproduced evidence — exact commands and results

All commands run from the worktree
`H:\WSL_dev_projects\pragma\.claude\worktrees\feat-bf-shared-alignment`
(Node v22.21.1, Bun 1.3.14).

```text
$ git --no-pager rev-parse HEAD
5dacf4902de4b0a55dd15a46fe58d7bc90ef8504

$ bun run scripts/check-css-contract.ts
✓ CSS contract: 308 raw diagnostics, 27 sanctioned, 275 transition identities,
  6 advisory, 0 legacy-policy entries.        ← matches the recorded 308/27/275/6/0

$ bun test scripts/check-css-contract.test.ts
81 pass, 0 fail, 186 expect() calls (3.46s)

$ (packages/react/ds-global-form) bun run test:vitest
Test Files 76 passed (76);  Tests 314 passed (314)

$ (packages/react/ds-global) bun run test:vitest
Test Files 85 passed (85);  Tests 396 passed | 5 skipped (401)

$ (packages/react/ds-global-form) bun tests/run-form-spacing.ts \
    --project=chromium-dpr1 --grep RichChoices
3 passed (27.6s)
  · card insets and normal text leaves follow the contract
  · wrapped cards grow intrinsically while the card stays a flex composition
  · native choice semantics and states remain intact

$ (packages/react/ds-global) bun tests/run-button-spacing.ts \
    --project=chromium-dpr1 --grep Card
2 passed (11.4s)
```

### Independent gate probe (26 cases, written and run outside the committed tests)

16 evasion cases must be rejected, 10 lookalikes must pass, plus 2 scope checks.
Result: **26/26 as expected, 0 failures** — full case list in Q3/Q4 above.

### Independent three-engine seam probe

A self-contained page reproducing the Cards/Card structure (parent grid, four
`auto` row tracks, 16px gutter, `grid-template-rows: subgrid` card spanning 4
rows). No design-system CSS, no server, no demo port touched. Chromium, Firefox
and WebKit returned **identical numbers**, confirming the owner's table:

| Result | Current | With card `row-gap: 0` |
|---|---:|---:|
| Header → Content | 16px | **0** |
| Content → Footer | 16px | **0** (not in the owner's table — P2-1) |
| Gap between wrapped bands of whole cards | 16px | **16px** (preserved) |
| Cross-card content/footer track registration | aligned | **aligned** |
| Card heights equal across the band | true | **true** |
| Omitted-Header blank slot | 65px | 41px (P2-2) |
| Omitted-Footer blank slot | 57px | 41px (P2-2) |
| Card height (two-line content) | 186px | 146px |

The 12px App figure in the owner's table is consistent with the same mechanism:
the seam is the Cards **gutter** (`--grid-gutter` →
`--spacing-inset-surface-inline`), which is tier-scoped, so Site/Docs read 16px
and App reads 12px. That also confirms the seam is *not* Header padding —
`padding-block-end: 0` and `border-block-end: 0` on
`.card-header:has(+ .card-content)` are already correct and already asserted by
the suite, which is exactly why the 16px/12px was never caught: the accepted
oracle asserts the declared Header seam is 0 but never measures the rendered
Header→Content distance.

### Mixed-band probe (basis for P1-1)

One card zeroed, two default, same band — all three engines: zeroed seam 0,
default seam 16px, **content tops not aligned, footer tops not aligned**, card
heights still equal (162px both). This is why the rule must be unthemable.

### Contract-cleanliness of the proposed change

I applied `row-gap: 0` to `.ds.card` **in memory only** (no file edited) and ran
the scanner core over it:

```text
current:              0 violation(s);  in-box: 0, retired-nudge: 0
proposed row-gap: 0:  0 violation(s);  in-box: 0, retired-nudge: 0
```

So the recommended change is scanner-neutral: no new raw diagnostic, no allowlist
growth, no row-family consumption, and no effect on the `308 / 27 / 275 / 6 / 0`
accounting.

### Working-tree integrity

Before and after this review, `git status --porcelain` reports exactly:

```text
M packages/storybook/addon-msw/public/mockServiceWorker.js
```

— the known unrelated line-ending change, preserved. `HEAD` is unchanged at
`5dacf4902`. Every probe file I created was removed. No implementation or spec
file was edited, nothing was staged, committed, pushed, merged, published or
released, no branch was switched, and the demos on 4173/6114/6115/6116 were not
restarted or contacted.

## 5. Answer to the owner's question, boundaries and next authorized work

### Should you proceed with the recommended version? Yes — with P1-1 folded in

The recommended reading of "joined" is the right one. It is also the only one
available without redesigning `Cards`: the seam is the parent's shared row
gutter, so the *only* way to make sections touch across an omitted slot is to
stop the omitted track from existing — which means abandoning the fixed
four-track vocabulary that produces cross-card alignment in the first place. The
alternative is therefore not a spacing decision at all; it is a different layout
model, and the contract already says a sectioned Card's structure and public API
are a separate matter. Do not infer that redesign from this migration.

Proceed on these terms:

1. Add `row-gap: 0` to `.ds.card` as a **raw, unthemable** declaration, with a
   comment saying why (band-shared tracks; a per-card opt-out desynchronizes the
   band) — mirroring the existing `padding-block-end: 0` seam comment.
2. Add band tests that assert **cross-card section-edge registration** — content
   tops and footer tops on a shared line — including a card that omits Header and
   a card that omits Footer. Equal card heights alone does not catch P1-1.
3. Add adjacency tests for Header→Content **and** Content→Footer at 0, in
   Site/Docs/App, so the tier-scoped 16px/12px cannot come back unnoticed.
4. Record in the T068/T069 note that the blank slot for an omitted section
   shrinks (65→41px, 57→41px) and that this is intended, so it is not later read
   as a regression.
5. Keep the existing declared-seam assertions (`headerPaddingEnd`,
   `headerBorderEnd` = 0). They remain correct; they were just insufficient.

### Boundaries

- Vanilla adapter: unavailable, out of scope.
- **T012** native 100%/125%/150% browser zoom: still open. DPR and root-size
  variation is not zoom.
- **T019** wider component inventory: still open.
- **T070** Svelte WPE Card: not started. **T071** cross-framework matrix: blocked
  on T070, and must preserve the RichChoices distinction and leave every row
  registry unchanged.
- RichChoices must stay out of both row families and must not acquire a target
  height or a private alignment formula.

### Next authorized work

Implement P1-1's `row-gap: 0` plus the band/adjacency tests to close T068-T069
for React Card, then re-run the root gate (`bun run check` and `bun run test`
from the repository root) and the three-engine Card matrix. No merge,
publication or release is authorized by this review.
