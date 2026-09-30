# React pilot final Opus review

**1. Verdict: `GO with required corrections`**

The implementation is clean. Every count, gate and structural claim reproduced exactly,
and the two things I checked hardest — the per-edge border model and the Choice-card
inset fix — hold up under independent measurement rather than only under their own
tests. I found no P0 and no P1.

The required corrections are all **documentation**. No code change is requested. They
matter because this packet goes to a lead engineer next, and one of the headline numbers
means something materially narrower than it reads.

Reviewer: Claude Opus 5, read-only. Date: 2026-09-12.
Reviewed: `H:\WSL_dev_projects\pragma\.claude\worktrees\feat-bf-shared-alignment`,
branch `feat/bf-shared-alignment`, range `971d8f85a..362eeae1e` (29 commits), tip
confirmed at `362eeae1e`.

---

## 2. Findings

### P2-1 — "Zero React transition entries" is true, but 40% of it is classification, not migration

This is the one finding a lead engineer needs before reading the closeout report.

React transition identities went from **95 to 0** across the range. That is real and the
allowlist confirms it. But over the same range the sanctioned classification file grew
from **27 to 64**, and **every one of the 38 new classifications is a React path**:

| Package | Transition identities at base | New classifications | Genuinely migrated |
|---|---|---|---|
| `react/ds-global` | 50 | 11 | 39 |
| `react/ds-global-form` | 28 | 18 | **10** |
| `react/ds-app-launchpad` | 16 | 8 | 8 |
| `react/ds-app` | 1 | 1 | **0** |
| **Total** | **95** | **38** | **57** |

So of the 95, **57 (60%) were fixed and 38 (40%) were promoted to reviewed exemptions.**
For `ds-global-form` the split inverts — 18 of its 28 were classified, only 10 migrated.
The single `ds-app` identity was classified, not fixed.

**I am not challenging the promotions.** I read all 38. They are substantive, specific and
evidence-bearing, not boilerplate — 32 `block-target` entries for genuine fixed artwork
canvases (native Range thumb/track paint, marker canvases, ColorInput swatches, rating
glyphs, icon canvases, absolute overlays, one-pixel a11y clip boxes), 3 `inline-minimum`
entries that are genuinely inline rather than block constraints, and 3
`typography-override` entries for the already-accepted compact nested Badge paint from
`4e33e6d00`. Promotion is a tested mechanism with its own guards
(`promotes one exact transition identity into a reviewed classification`,
`rejects promotion when the previous or current raw identity is not exactly one`,
`rejects double-booking and unrelated allowlist growth during a promotion`). One
classification was also *removed* — the hidden FileUpload native input, a real fix.

The problem is only that "315/315 classified and checked" and "zero React transition
entries" read as "React is migrated". A reader who later compares Lit or Svelte progress
against React on the transition count alone will be comparing different things.

**Required correction:** state the 57/38 split in
`react-pilot-closeout-review.md` and in whatever summary reaches the lead. One sentence
is enough.

### P2-2 — The stable demo 404s on `fonts.css` in its manager shell

Loading the stable demo URL produces:

```
GET http://127.0.0.1:6114/@canonical/styles-typography/fonts.css
  → 404 (Not Found), net::ERR_ABORTED
```

I chased this because font fallback is exactly the failure the packet says the tests
exist to catch. **It does not affect any measurement.** The 404 is on the Storybook
*manager* page only. Instrumenting the preview iframe across a full load gives **zero**
failed requests and zero 4xx responses, and the font genuinely resolves:

- tier root class `grid responsive comfortable site with-baseline-grid`, 16px/24px
- `document.fonts.check('16px "Ubuntu Sans"')` → `true`; loaded faces include
  `Ubuntu Sans 100 800 normal` and `Ubuntu Sans Mono 100 700 normal`
- `1cap` resolves to **11.0833px** at a 16px root → ratio **0.69271**, which is Ubuntu
  Sans's real cap-height ratio, not a fallback's

So the alignment in the demo is measured against the intended font. But a reviewer who
opens devtools on the stable demo sees a 404 on a typography stylesheet and has to redo
this work to find out it is harmless.

**Required correction:** either fix the manager-side reference or note it in the
inventory doc as known and measurement-irrelevant.

### P2-3 — Four of the twelve "non-renderer" exclusions do render

The exclusion boundary is exact and frozen — I confirmed all twelve and the test
`fails closed when the reviewed exclusion boundary is changed` guards it. But the label
is imprecise. The twelve are 3 React contexts, 4 hooks, **3 `icons.tsx` modules**, **1
`GitDiffViewer/fixtures.tsx`**, and 1 compatibility re-export. The icon modules and the
fixtures module do return JSX; they are excluded because they own no spacing or row
geometry, which is a different and weaker claim than "not a renderer".

`GitDiffViewer/fixtures.tsx` is the one I would ask about: it sits in `src/lib`, so it
ships, and "fixtures" in shipped library code is worth a deliberate note either way.

**Required correction:** describe the exclusions as "non-spacing-owning" rather than
"non-renderer", and say which four are renderers excluded on that basis.

---

## 3. Answers to questions 1–11

**1. Source discovery — yes, 142 exact; exclusions exact at 12.**
`bun scripts/check-react-spacing-inventory.ts` reports
`145 rows, 142 render sources, 3 story-only specimens`. The partition is enforced by
`partitions every production TSX into one row or one reviewed exclusion`,
`audits package src roots and freezes non-production CSS exclusions` and
`fails closed when the audited scope shrinks or a new CSS owner appears`. The twelve
exclusions are `ContextualMenu/common/MenuContext.tsx`, `useDelayedToggle.tsx`,
`useIsMounted.tsx`, `useWindowFitment.tsx`, `DiffChangeMarker/icons.tsx`,
`EditableBlock/Context.tsx`, `FileTree/Context.tsx`, `FileTree/hooks/useFileTree.tsx`,
`CodeDiffViewer/common/icons.tsx`, `GitDiffViewer/fixtures.tsx`,
`MarkdownEditor/common/icons.tsx`, `tokens/TokenTable/TokenSwatch.tsx`. See P2-3 on
wording.

**2. Composed Storybook — yes, exactly 143 rows, and it fails closed.**
Measured live at 6114, not inferred: **49** `[data-react-spacing-row]` + **55**
`[data-react-form-spacing-row]` + **39** `[data-react-app-spacing-row]` = **143 total,
143 unique, zero duplicates**. That reconciles with 145 inventory rows as 142 render
sources + 3 story-only specimens, of which Heading renders and the two Token
documentation artworks do not — covered by
`keeps source-only token documentation out of the rendered catalog` and
`keeps visual token tooling and story-only documentation explicit`. Fail-closed is
covered by `maps every manifest row exactly once`,
`fails closed for a missing or duplicated source` and
`rejects stale, duplicated and unresolved manifest ownership`.

**3. Border binding — yes, 315/315 across 62 paths, each bound once.**
The scanner reports
`315/315 declarations across 62 authenticated CSS paths (315 accepted, 0 decision-needed); 0 declarations remain outside the audited set`.
All four probes you asked for are held by named tests:
changed selector → `fails closed for selector drift and duplicate declaration occurrences`;
changed value and new/removed declaration →
`fails closed for new, removed and changed declarations in an audited path`;
duplicate occurrence → same test plus
`rejects duplicate border-part ids and unknown accounting`;
new CSS owner → `fails closed when the audited scope shrinks or a new CSS owner appears`.

**4. Shared border rules — yes, and the emphasis stroke is layout-neutral.**
`packages/styles/main/src/component-contract.css` now puts the raw widths on tier roots:

```css
:where(:root, .site, .docs, .app) {
  --ds-stroke-thickness: var(--dimension-stroke-thickness-medium);
  --ds-stroke-thickness-emphasis: var(--dimension-stroke-thickness-large);
}
```

and runs one per-edge formula on the bordered element:

```css
--ds-box-border-block-start: var(--ds-box-border-width);   /* ...-block-end, -inline-start, -inline-end */
--ds-box-padding-block-start: max(0px, calc(var(--spacing-inset-surface-block) - var(--ds-box-border-block-start)));
--ds-box-padding-inline-start: max(0px, calc(var(--spacing-inset-surface-inline) - var(--ds-box-border-inline-start)));
```

Because each edge subtracts *its own* border, no border, one edge, all edges and
asymmetric combinations all fall out of the same expression. No component repeats the
arithmetic. The contract states the emphasis rule explicitly: *"A wider stroke is
zero-layout paint, not a clamp-based promise of the same keyline. Reserve stateful
borders transparently in every state; changing only their colour must never change
geometry."*

I measured SideNavigation active vs inactive directly rather than trusting
`e4f837eff`'s own test:

| | LTR active | LTR inactive | RTL active | RTL inactive |
|---|---|---|---|---|
| row width | 118.823 | 118.823 | 118.823 | 118.823 |
| `padding-inline-start` / `-end` | 8px / 8px | 8px / 8px | 8px / 8px | 8px / 8px |
| `border-inline-start-width` | 0px | 0px | 0px | 0px |
| label inset from logical start | 8 | 8 | 8 | 8 |
| `::before` | `absolute`, `inline-size: 3px` | `content: none` | `absolute`, `inline-size: 3px` | `content: none` |

Text position and outside size are identical in every cell. The 3px edge is an absolutely
positioned pseudo-element with `pointer-events: none`, placed logically so it mirrors in
RTL, with a `forced-colors: active` branch. It is not `border-inline-start`, and the test
asserts that negatively.

**5. Composite parts — yes, no target heights or private baseline formulas found.**
The 32 new `block-target` classifications are all fixed artwork or zero-layout paint, not
rows: native Range thumb/track canvases, `--ds-leading-mark-canvas` marker paint for
checkbox/radio/announcement, switch track and knob derived from that shared canvas,
ColorInput preview and swatches, rating glyphs, tooltip zero-height anchor, FileTree
indentation rail, SideNavigation overflow fade, diff change markers. Narrow and
multiline behaviour is covered at both tiers by
`keeps every built-in Field direct and bounded at 320px Site`,
`keeps every application-side specimen bounded at 320px`,
`reconciles all 55 form rows with real output and pressure states` and
`samples one distinct application family without state-driven geometry shifts`, all green
on three engines.

I verified the Choice-card correction independently, since it is the defect this wave
claims to have fixed. On `components-richchoicesfield--default`, in both Site and Docs,
in both axes:

```
--spacing-inset-surface-inline  = 16px   (nominal)
border-inline-start             = 0.666667px  (1px nominal, device-snapped at DPR 1.5)
padding-inline-start            = 15px
border + padding                = 15.6667px
measured outside edge → text    = 15.667px     ✓ agrees
nominal 1px + 15px              = 16px         ✓ equals the surface inset
```

The border thickness is inside the outside-edge inset, as claimed.

**6. Global contract scan — exact, and deferred debt did not move.**

```
✓ CSS contract: 240 raw diagnostics, 64 sanctioned, 169 transition identities,
  7 advisory, 0 legacy-policy entries.
```

Byte-for-byte `240/64/169/7/0`. The 169 transition identities are **134 Svelte + 35 Lit
and zero React**. At the pilot base `971d8f85a` the allowlist held 264: React 95, Svelte
134, Lit 35. **Svelte and Lit are unchanged — no growth, and no shrinkage either**, which
is the correct outcome for deferred scope. Pairwise identity-set diff over the range
returns **0 identities added**. See P2-1 for how the React 95 was cleared.

**7. Three-engine catalog — 27/27.**

```
bun tests/run-form-spacing.ts --project=chromium-dpr1 --project=firefox-dpr1 \
  --project=webkit-dpr1 tests/ReactPilot.spacing.pw.ts
Running 27 tests using 1 worker
...
27 passed (2.6m)
```

Nine specs × three engines at DPR1. Row counts, interaction states, the 320px pressure
cases and the whole-document accessibility check are the specs themselves — including
`has no accessibility violations in the composed React catalog`, green on all three. The
runner allocates its own ephemeral port, so the stable demo on 6114 was never touched.
Console cleanliness in the stable demo: the preview iframe produced zero errors and zero
failed requests across a full load; see P2-2 for the manager-shell 404.

**8. Release shape — yes, 9/9.**

```
bun scripts/check-react-release-shape.ts
...
React release shape: 9/9 packages built and loaded; 5/5 hydration cases passed.
```

Each package built via `tsc -p tsconfig.build.json` + CSS copy, then loaded *by bare
package name* from `dist` with exports, declarations, transitive CSS roots and local
assets verified — e.g. `@canonical/react-tokens` reports
`7 exports; 10 declarations; 2 transitive CSS roots; 2 CSS files, local assets verified`.
The manifest guards are real, not decorative:
`owns exactly the nine visual React package families`,
`rejects a ninth-package substitution and any path outside packages/react`,
`fails closed when a public sentinel export is absent`,
`fails on a broken nested declaration reference`,
`fails on a broken nested CSS asset reference`, and — for your bare-alias question —
`rejects an internal-looking bare declaration alias even when its file exists`.

**9. Hydration — yes, 5/5, through built output.**
Run as the final stage of the same gate, against the built package entries rather than
source: `Test Files 1 passed (1); Tests 5 passed (5)`. The corrected Launchpad
`SimpleChangeMarker` declaration now resolves through a relative
`import type { DiffChangeType } from "../../types.js"` rather than a bare internal alias,
which is precisely what the bare-alias guard above rejects; since the gate passes with
that guard active, a package consumer can use it.

**10. Stable demo — yes, available.**
`http://127.0.0.1:6114/?path=/story/documentation-react-pilot--inventory&globals=baseline:!true;context:site`
loads and renders. The `context:site` global applies (tier root carries `site`) and
`baseline:!true` applies (`with-baseline-grid` present). 143 rows render. Not restarted,
not rebuilt.

**11. T073 and T074 — yes, both may remain complete; the pilot may proceed to lead review.**
`tasks.md` shows `[x] T073` and `[x] T074`, and both are substantiated by the evidence
above. `T019`, `T070` and `T071` remain `[ ]` and must stay open: React validates the
shared model, and nothing here is production proof for Lit or Svelte markup, style
loading, state or browser behaviour. T078 is the gate this review feeds.

---

## 4. Reproduced evidence

| Command | Result |
|---|---|
| `git status --porcelain` | exactly the 4 known line-ending files, nothing else |
| `git rev-parse --short HEAD` | `362eeae1e` |
| `git rev-list --count 971d8f85a..362eeae1e` | `29` |
| `bun scripts/check-css-contract.ts` | `240 raw, 64 sanctioned, 169 transition, 7 advisory, 0 legacy-policy` |
| allowlist by area at tip | Svelte 134 + Lit 35 = 169; **React 0** |
| allowlist identity-set diff over range | **0 added** |
| classifications base → tip | 27 → 64 (+38 new, all React; 1 removed) |
| `bun scripts/check-react-spacing-inventory.ts` | `145 rows, 142 render sources, 3 story-only` |
| same, border line | `315/315 across 62 authenticated CSS paths (315 accepted, 0 decision-needed); 0 outside` |
| `bun test` × inventory + catalog + release-shape specs | **41 pass, 0 fail, 1871 expect() calls** |
| `ReactPilot.spacing.pw.ts` × chromium/firefox/webkit dpr1 | **27 passed (2.6m)** |
| `bun scripts/check-react-release-shape.ts` | **9/9 packages built and loaded; 5/5 hydration passed** |
| live row count at 6114 | 49 + 55 + 39 = **143**, 143 unique, 0 duplicates |
| live `1cap` at 16px Site root | **11.0833px** (ratio 0.69271, Ubuntu Sans) |
| SideNav active vs inactive, LTR + RTL | width/padding/label inset identical in all four |
| RichChoicesField card | border 0.666667 + padding 15 = 15.667 = measured outside→text |

Independent measurements were taken with my own DOM probes against the running demo, not
by reading the suites' expected values.

---

## 5. Boundaries and next authorized work

**What this review does not do.** It does not authorize Lit or Svelte implementation,
does not close T019, T070 or T071, and does not authorize any merge, push, publication or
release. It is not a parity claim for Lit or Svelte, whose 169 deferred identities remain
untouched and correctly out of scope.

**Preservation.** Nothing in either repository was edited, staged, committed, merged,
pushed, published or released. No worktree was switched. The four known line-ending-only
files are intact and are still the only entries in `git status`. Port 6114 was read only
and never restarted; the three-engine matrix ran on its own ephemeral port. The only file
written is this review.

**Note on build output.** `check-react-release-shape.ts` compiles the nine packages into
`dist/` by design. That output is ignored by Git — `git status` after the run is still
exactly the four known files — but the worktree now holds fresh build artifacts.

**Next authorized work.** Apply the three documentation corrections above, then take the
pilot to lead-engineer review under T078. Only that approval authorizes T070–T071 or any
broader rollout.
