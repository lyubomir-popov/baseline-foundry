# Shared-alignment implementation-wave review

**Verdict: GO** for starting the next T019 wave, with one P1 correction that must land
before Timeline can be recorded as accepted.

Reviewer: Claude Opus 5, read-only. Date: 2026-09-11.
Implementation reviewed: Pragma worktree `.claude/worktrees/feat-bf-shared-alignment`,
branch `feat/bf-shared-alignment`, head `02fd51c74`.

The foundation this wave rests on is sound. The scanner's claimed counts reproduce
exactly, the allowlist is provably monotonic with zero additions across its whole
history, and the component slices I could measure independently behave as claimed.
Three things are not as reported, and one of them is a live visual defect in a
component this wave explicitly claims to have corrected.

---

## Findings

### P1 — Timeline's rail is not masked at the block-end; three reproducible cases

The wave claims "Timeline rails correctly span inter-item gaps" and lists a rail
correction at `e8cf963a4` / `6f47a8691`. The *span* half is correct. The *termination*
half is not.

The shared rail is parent-owned and spans the whole padding box, which is right:

`packages/svelte/ds-app-launchpad/src/lib/components/Timeline/styles.css`

```css
.ds.timeline {
  display: grid;
  position: relative;
  grid-template-columns: [marker-start] auto [marker-end content-start] 1fr [content-end];
  row-gap: var(--dimension-gap-row-timeline);

  &::before {
    content: "";
    z-index: 0;
    position: absolute;
    grid-column: marker;
    justify-self: center;
    inset-block: 0;
    inline-size: var(--dimension-width-timeline-line);
    background-color: var(--color-background-timeline-line);
  }
}
```

The end masking, however, is scoped to grid row 1 only:

`packages/svelte/ds-app-launchpad/src/lib/components/Timeline/common/Event/styles.css`

```css
&:first-child > .marker-cell::before,
&:last-child > .marker-cell::after {
  content: "";
  z-index: 1;
  grid-column: 1;
  grid-row: 1;                     /* ← only the title row */
  inline-size: var(--dimension-width-timeline-line);
}
```

An Event is `grid-template-rows: auto auto`: row 1 is `.title-row`, row 2 is `.body`
(`Event.svelte` renders `<div class="body">` whenever `children` is passed). The mask
therefore stops at the bottom of the title row, while the rail continues to the bottom
of the timeline.

**Reproduction.** I rebuilt the three CSS files verbatim (timeline, event, hidden-events)
with token stubs and rendered them in Chromium. The conclusion is structural, not
token-dependent. Measured:

| Case | Rail bottom | Last marker centre | Unmasked rail below the last marker |
|---|---|---|---|
| Last event **has a body** | 195.44px | 163.44px | **~21.3px** |
| **Singleton** event | 528.31px | 496.31px | **~21.3px** |
| **HiddenEvents is last child** | 423.54px | n/a | **full height, no mask at all** |

The singleton case renders as a lollipop — a one-event timeline should show no rail at
all. The HiddenEvents case is the worst: `.ds.timeline-event:last-child` never matches
when the last `<li>` is `.ds.timeline-hidden-events`, so no block-end mask is created
and the rail runs straight through the "3 hidden" row to the bottom edge. That is the
documented example usage in `Timeline.svelte`'s own component doc block, so it is the
common arrangement, not an edge case.

**Smallest safe correction.** Terminate the rail from the container rather than masking
it from the event, so the selector cannot miss a non-Event last child. Give
`.ds.timeline::before` a block-end that stops at the last marker centre, or — keeping
the current mask approach — extend the mask to the full event box and add the
hidden-events last child to the same rule:

```css
.ds.timeline-event:last-child > .marker-cell::after,
.ds.timeline:has(> .ds.timeline-hidden-events:last-child) > .ds.timeline-event:last-child > .marker-cell::after {
  grid-row: 1 / -1;
}
```

The gradient split must still be computed against row 1 so the transition lands on the
marker centre; a `linear-gradient(to bottom, transparent 0 calc(var(--marker-row-half)), var(--lp-color-background-default) 0)`
form is the smaller change than re-deriving a height.

Please do not record Timeline as accepted until all three cases render clean in
Chromium, Firefox and WebKit.

---

### P2 — The "167 of 490" headline conflates a measurement change with migration

The allowlist is genuinely, strictly monotonic. I replayed every commit that touched
`config/css-contract-allowlist.json` and diffed identity sets pairwise. **No commit ever
added an identity** — `newIds` is 0 at every step. That part of the claim is stronger
than stated and worth keeping.

But the 490 → 323 delta is not 167 units of component migration:

| Commit | Identities | Δ | Subject |
|---|---|---|---|
| `9d20a70e0` | 749 | — | seed decreasing contract debt gate |
| `da58eda23` | 702 | −47 | remove component body-role aliases |
| `4b5228888` | 492 | −210 | shrink migration allowlist |
| `bde3ee0a1` | 491 | −1 | centralize marker-led alignment |
| `0d6eac134` | 490 | −1 | consume shared field inset |
| `cb060396a` | 489 | −1 | align marker-led rows |
| `ef855b630` | 488 | −1 | authenticate badge baseline evidence |
| `d224c855c` | 485 | −3 | move FileUpload onto shared row ledger |
| **`e7ad5075b`** | **361** | **−124** | **harden shared contract scanner** |
| **`56b034b5a`** | **357** | **−4** | **authenticate provider primitive names** |
| `4ce600dc5` | 355 | −2 | shrink combobox transition debt |
| `9c9c25b3a` | 347 | −8 | inherit tier body role (Tooltip) |
| `9059edbd1` | 339 | −8 | shrink app button transition debt |
| `6ccc2a5b0` | 331 | −8 | shrink ColorInput typography debt |
| `3f2fe3463` | 323 | −8 | shrink marker transition debt |

Of the 167 removed since 490, **128 (77%) come from the two scanner commits and 39 (23%)
from component migration.** The 124 dropped at `e7ad5075b` decompose as 117
`dimension-primitive` and 7 `geometry-footprint`.

I checked whether that drop hides debt, and I do not think it does. The scanner change
is a de-duplication with an explicit reporting boundary:

```ts
/* A governed alias reports its own unapproved origin. Do not make every
 * consumer of that alias a second violation. */
if (isGovernedDimensionPrimitiveUse(definition.property)) continue;
```

Previously an alias definition plus each of its consumers each counted; now the alias
reports once. The same commit *broadens* detection elsewhere — `outline` joins the
governed-name pattern and `top|right|bottom|left|outline-width|outline-offset` join the
governed-property pattern — and the 7 geometry footprints were moved to advisory, which
the suite covers with "keeps an excessive geometry footprint visible but out of the
closeout gate". So this is legitimate hardening.

The problem is only reporting. 490 and 323 are counts in **different units**, so the
34% figure overstates migration progress by roughly 3×. The honest framing is: 39
identities closed by component work this wave, 128 by putting the scanner on a correct
and now-stable basis, 323 remaining on the new basis. Going forward the basis is stable
and the percentage will mean what it says.

**Correction:** restate the wave summary, and note the basis change at `e7ad5075b` in
the inbox so future waves are not compared against pre-hardening numbers.

---

### P2 — The vertical audit story stretches its specimens, which is why the Button looks over-padded

This is the glitch reported from the demo, and the direction is the reverse of what was
described — the horizontal story is correct and the **vertical** one is distorted.

Measured live at 6114, viewport 1600, root `spacing-audit site`:

| Story | Button `display` | Width | `padding-inline` | Text-to-edge gap |
|---|---|---|---|---|
| Horizontal guides | `inline-flex` | 81.68px | 15px | **15.67px** |
| Vertical guides | `flex` | **128px** | 15px | **38.82px** |

In the horizontal story the Chip measures the same 15.67px gap and the red command guide
sits at `--spacing-audit-guide-offset: 15.666667px`, so the guide and both specimens
agree. Nothing is wrong there.

In the vertical story the specimen is a grid item:

`packages/react/ds-global-form/src/docs/examples/spacing-audit.css`

```css
.spacing-audit__block-sample { flex: 0 0 8rem; }

.spacing-audit__block-probe {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-content: start;
}
```

A grid item is blockified, so the Button's `inline-flex` becomes `flex`, and the default
`justify-self: stretch` fills the whole 8rem (128px) track. The padding is untouched at
15px — the *box* grew, and because the label is centred it reads as huge side padding.

Block size is unaffected (36.23px in both stories), so the vertical audit's actual
measurement is still valid. But it directly contradicts the story's own promise, which
the header text states: "The guides are audit chrome only: they do not alter component
geometry." A reviewer looking at that row will report a Button bug that does not exist,
which is exactly what happened.

**Smallest safe correction** — one declaration:

```css
.spacing-audit__block-probe {
  justify-items: start;
}
```

The existing `> .ds.input, > .ds.tabs, > .ds.accordion, > .spacing-audit__table
{ inline-size: 100% }` rules keep filling the track, so nothing else moves.

Worth noting that `tests/SpacingAudit.spacing.pw.ts` ("uses current shared component
geometry and container-owned audit spacing") did not catch this, because it asserts
block geometry only. Consider adding an inline assertion that a specimen's painted
inline size equals its intrinsic size.

---

### P2 — Combobox Docs/App rows measure 24px, not the claimed 32px

Claim: "Combobox options: Site 40px; Docs/App 32px instead of 56/52/44px."

Measured at 6114 on `work-in-progress-subcomponent-comboboxinput-list--default` with
`globals=context:<tier>`:

| Tier | Body role | Option row | `padding-block` | `margin-block-end` | Gap between rows |
|---|---|---|---|---|---|
| site | 16px/24px | **39.99px** | 6.456 / 9.544px | 0px | 0 |
| docs | 14px/20px | **23.99px** | 1.149 / 2.851px | 0px | 0 |
| app | 14px/20px | **23.99px** | 1.149 / 2.851px | 0px | 0 |

Site is exactly as claimed. Docs and App are 24px, not 32px. 24px is a correct result of
the contract for a 14px/20px body on an 8px baseline, so I read this as a misstated
claim rather than an implementation defect — but it should be corrected before it is
quoted anywhere, and it is worth confirming nobody expected a 32px floor.

The in-box ledger itself is confirmed good: `margin-block-end` is 0 on every option and
the measured gap between consecutive options is exactly 0 in all three tiers, so a
continuous fill has no seam.

---

### P2 — HiddenEvents keeps a private fixed-height connector

`packages/svelte/ds-app-launchpad/src/lib/components/Timeline/common/HiddenEvents/styles.css`

```css
&:not(:last-child)::after {
  /* Line spanning to the next element */
  content: "";
  position: absolute;
  grid-column: marker;
  width: var(--dimension-width-timeline-line);
  height: var(--dimension-gap-row-timeline);   /* ← target block size */
  top: 100%;
}
```

This is a second rail with a derived fixed height, painting over a parent rail that
already spans the gaps since `e8cf963a4`. It is redundant today and will diverge the
moment the row gap and this token stop agreeing. It also sits awkwardly against the
`styles.css` comment that the parent rail exists so no event "owns synthetic connector
space". Deleting the whole rule should be a no-op; please confirm visually and remove it
in the Launchpad wave.

---

### P2 — Tooltip's observer set is fixed at mount

The tier resolution is correct and the cleanup is clean — this is a note, not a defect
against the question as asked.

`packages/react/ds-global/src/lib/component/Tooltip/withTooltip.tsx` walks the full
ancestor chain, attaches **one** `MutationObserver` to every node with
`{ subtree: false, attributes: true, attributeFilter: ["class"] }`, and disconnects it in
the effect cleanup. One observer, one disconnect, no leak. SSR and hydration are safe:
every browser access is inside `useEffect`, and the portal is gated on
`mounted && productClassResolved`, so the server and first client render both emit
nothing.

The gap: the effect's dependency list is `[targetRef]`, which is stable, so the ancestor
chain is walked exactly once. A *class change* on any existing ancestor is caught. An
ancestor being **inserted** between the trigger and the product root, or the trigger
being moved into a different subtree, is not — no observed node mutates, so the tooltip
keeps a stale tier. Worth a follow-up if any product remounts trigger ancestors.

---

## What is verified

- **Scanner counts, exact.** `bun scripts/check-css-contract.ts` printed
  `356 raw diagnostics, 26 sanctioned, 323 transition identities, 7 advisory, 0 legacy-policy entries`
   — byte-for-byte the claim.
- **Contract suite.** `bun test scripts/check-css-contract.test.ts` → **57 pass, 0 fail,
  136 expect() calls**, 2.98s.
- **React global spacing.** `bun run test:spacing` in `packages/react/ds-global` →
  **186 passed** in 4.7m, across chromium/firefox/webkit at dpr1 and dpr2. Matches the
  claimed 186/186.
- **React global-form spacing.** `bun tests/run-form-spacing.ts` in
  `packages/react/ds-global-form` → **108 passed** in 10.6m, single worker, across
  chromium/firefox/webkit at dpr1 and dpr2. Matches the claimed 108/108. The suite
  includes `Combobox.spacing.pw.ts` "multiple-select keeps long options bounded and the
  reset action has no second ledger", `ColorInput.spacing.pw.ts`,
  `FileUploadInput.spacing.pw.ts` and `ChoicesField.spacing.pw.ts` "wrapped and column
  choices keep marker rows intrinsic", so questions 5, 6 and 8 have cross-engine
  coverage and not only my Chromium measurements.
- **14 package roots wired.** 14 `package.json` files reference `check-css-contract`:
  `lit/ds-prototype`, `react/ds-app{,-anbox,-landscape,-launchpad,-lxd,-portal}`,
  `react/ds-global`, `react/ds-global-form`, `react/tokens`,
  `svelte/ds-app{,-launchpad,-wpe}`, `svelte/ds-global`. Matches the claimed 14.
- **Allowlist monotonicity.** Zero identities added across all 15 commits that touched
  the file. Verified by pairwise id-set diff, not by trusting the counts.
- **Question 8, marker wrap.** Under genuine 140px labels wrapping to 4–6 lines, radio
  and checkbox markers hold **both** axes at 16×16px (18×18px at an 18px root) in site,
  docs and app, in default, checked, disabled and columns arrangements. First-line
  centring delta is **0.00px** in every one of those combinations. No collapse.
- **Question 5, Combobox.** Option rows use the in-box ledger, `margin-block-end` is 0,
  and consecutive-row gaps are exactly 0 — no seam in a continuous fill. `ResetButton`
  resolves to `padding-block: 0` and `margin-block: 0`, so it does not inherit a second
  row ledger.
- **Question 6, ColorInput.** `9ce81900e` is strictly typography-only: three blocks
  replace `font-family` / `font-size` / `line-height` with `font: inherit`, plus a new
  227-line test and one playwright config line. No padding, canvas, compensation or
  content-size derivation. The `1.25rem` preview and `2rem` swatches are still present
  and the new test asserts `previewCssHeight ≈ rootSize * 1.25`, so they are tracked
  debt, not silently claimed.
- **Question 7, Badge.** The regular Badge drops `--badge-font-family/-size/-weight/
  --badge-letter-spacing` and moves to `--ds-stroke-thickness` and
  `--ds-row-line-height`; the tests assert the regular block contains no font
  declarations and no `--dimension-stroke-thickness-medium`. The compact nested paint
  canvas is preserved with an explicit comment.
- **Question 4, app Button forks.** All four exist and consume the shared ledger.
  Sampling `packages/react/ds-app-portal/src/lib/Button/styles.css`: it sets the three
  `--ds-row-border-*` inputs and consumes `--ds-row-padding-block-*`,
  `--ds-row-compensation-block-end` as `margin-block-end`, and
  `--ds-inline-inset-action-bordered`. `block-size: auto; min-block-size: 0` means it
  grows on wrap. No `font-size` override anywhere.
- **Site Button is present and correct.** In the audit story at `spacing-audit site`,
  the Button inherits 16px/24px, paints 36.23px and occupies 40px. The earlier "missing
  14px Site button" report does not reproduce.
- **Ports.** 6114 served `/index.json` with HTTP 200 throughout; 4173 loaded and rendered.
  Neither was restarted or rebuilt.

## What remains open

- **Firefox and WebKit for Timeline.** The P1 reproduction is Chromium only. The React
  global suite does cover firefox and webkit, but it contains no Timeline test; the
  Timeline under review is Svelte Launchpad.
- **Storybook 6114 serves only `@canonical/react-ds-global-form`** — 263 entries across
  61 titles, all form subcomponents/components plus Documentation. It does **not** serve
  React ds-global's own stories, the Svelte Launchpad or WPE packages, the Lit prototype,
  or the four app Button forks. Several wave claims — Timeline rails, Tooltip, the four
  Button forks — are simply not visually inspectable there. The closeout plan's step 3,
  "inspect the complete Storybook visually", needs a composed build or per-package
  Storybooks before it can mean anything.
- **Question 1 (laundering) is only partly answered.** I read the new alias-graph walk
  and it closes cross-file aliases, self-cycles and nested fallbacks by following
  definitions to their origin with a visited set. I did not independently construct
  adversarial fixtures for case collisions or artifact-hash mismatch; the suite's own
  negative fixtures cover them and pass, but that is the implementation marking its own
  homework.
- **Question 9.** I found no new shared derivation, public override, target block size or
  allowlist addition introduced by this wave's commits — with the exception of the
  pre-existing HiddenEvents connector above, which the wave did not introduce but also
  did not remove.
- T012 native zoom and the remaining 323 T019 identities remain open scope, as agreed.

## Exact counts

| Measure | Claimed | Reproduced |
|---|---|---|
| Raw diagnostics | 356 | **356** |
| Sanctioned classifications | 26 | **26** |
| Transition identities | 323 | **323** |
| Advisory footprints | 7 | **7** |
| Legacy-policy entries | 0 | **0** |
| Package roots wired | 14 | **14** |
| `check-css-contract.test.ts` | — | **57 pass / 0 fail / 136 expects** |
| `react/ds-global test:spacing` | 186/186 | **186 passed** |
| `react/ds-global-form test:spacing` | 108/108 | **108 passed** |
| Identities removed since 490 | 167 | **167, but 128 of them are basis change** |

## Worktree status

- `feat-bf-shared-alignment` — head `02fd51c74` ("fix(form): preserve Choice marker
  canvases"). `git status --porcelain` shows exactly one entry:
  ` M packages/storybook/addon-msw/public/mockServiceWorker.js`, the expected
  line-ending-only modification. Nothing staged, nothing untracked. **Unchanged by this
  review.**
- `feat-bf-metric-nudge` — **not touched, not read, not listed.**
- No edit, stage, commit, merge, push, publish or release was performed in either
  repository. The only file written is this review.

## Ports

- **6114** — untouched and still serving. Verified repeatedly via `/index.json` (HTTP
  200) and story renders. Never restarted or rebuilt.
- **4173** — untouched and still serving. Loaded once to confirm liveness; BF was not
  rebuilt.

---

## Recommendation

Start the next T019 wave. Svelte Launchpad is the right first target and it carries the
P1, so fold the Timeline rail termination and the HiddenEvents connector removal into
that batch rather than shipping them separately. Fix the one-line audit-story stretch
first, since it is currently generating false defect reports from the demo. Restate the
490 → 323 figure before it is quoted further.
