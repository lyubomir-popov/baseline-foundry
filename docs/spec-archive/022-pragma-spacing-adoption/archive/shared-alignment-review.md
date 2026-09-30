# Shared CSS alignment implementation evidence

Status: implementation in progress; no acceptance is carried over from the
superseded generator migration.

## Isolation and sequence

The owner accepted the junction corrections on 2026-09-09. Implementation is
in `H:/WSL_dev_projects/pragma/.claude/worktrees/feat-bf-shared-alignment`,
branch `feat/bf-shared-alignment`, from accepted spacing commit `533ae3e1b`.
The dirty `feat/bf-metric-nudge` worktree is retained unchanged as a comparison.

Stages 1-3 land in order as separate local commits. Stage 3 contains the
tier-root typography declaration alone with its reset integration and tests.
Stages 1-4 must pass independent local review before component retrofits.
No merge, push, publication or release is authorized.

The allowlist must be seeded once from the real violations, never grow, shrink
with every retrofit, and be empty/deleted at closeout. Independent baseline
markers and newly executed matrices must validate this CSS implementation;
the earlier generator matrix is not acceptance evidence.

## Runtime and setup evidence

- BF meeting demo: `http://localhost:4173`, left running without rebuild/restart.
- Previous Pragma generator comparison: `http://localhost:4174`, unchanged.
- Revised Pragma development: `http://localhost:4176`, fresh worktree; HTTP 200.
  Bun parent PID at launch: 25892. Logs are under
  `H:/WSL_dev_projects/tmp/pragma-shared-demo-4176/`.
- `bun install --frozen-lockfile` populated dependencies, but its root prepare
  build failed at the existing `@canonical/lit-ds-prototype` CSS-export errors
  on the accepted base before new implementation. This is not a green root gate.
- Focused `bunx lerna run build --scope=@canonical/react-boilerplate-vite
  --include-dependencies` passed all 23 selected projects (19 cached).
- Install/build touched the generated MSW worker's line endings, with no
  semantic diff. Do not include that incidental file in feature commits.

## Junction evidence

Stage 1: committed as `1af40b362`, `feat(typography): add shared live-font
alignment contract`. Only alignment.css, its export and its dedicated test
landed; no production entry imported it in this commit. Independent source
review GO; its test-hardening finding was corrected before commit. Fresh
typography tests passed 9/9; TypeScript, architecture and changed-file Biome
passed. Full package formatting still includes unrelated CRLF debt.

The independent reviewer resolved the standalone browser-launch problem:
Playwright 1.61.1 under direct Bun 1.3.14 stalls at its pipe handshake on this
Windows environment; Node 22.21.1 using the identical installation succeeds.
Use Node for direct API probes and Bun's existing Playwright CLI scripts for
package suites. All probe-launched processes were closed or timeout-cleaned.

Fresh Stage 1 browser proof passed Chromium 149.0.7827.55, Firefox 151.0 and
WebKit 26.5: the unregistered cap token stayed serialized as `1cap`, consuming
16px/32px text resolved distinct nudges, and a constructed exact tie returned
0px in all three. This is a contract-mechanism proof, not the production-font
authentication or full component matrix.

Stage 2: committed as `054d0e5ce`, `feat(styles): centralize intrinsic row and
lane contracts`, after independent GO. Main tests passed 8/8, formatting and
architecture passed. Fresh shared-contract browser suite passed 18/18 across
three engines and DPR 1/2: per-edge borders, clamping, exact tie, nested host
reset, lanes and semantic strokes in LTR/RTL.

Stage 3: committed alone as `c61365b1f`, `feat(typography): apply body role once
at product roots`, after independent GO and 42/42 shared-contract browser
checks. Coverage includes Site/Docs/App, nested tiers, roots 16/18 and native
controls. The review corrected native letter-spacing inheritance and preserved
the rem anchor when html carries the product marker (body receives the role).
Native select/optgroup retain engine-owned `line-height: normal` even with an
inline numeric important declaration in all three engines; their other four
properties inherit, and the row ledger reads the provider line-height token.
Typography tests passed 15/15 (including auth work in progress), TypeScript and
both styles architecture checks passed; main tests passed 8/8.

The development demo revealed an existing CSR/SSR bootstrap mismatch: Vite's
empty document was hydrated as SSR, so recovery removed injected CSS. A separate
bootstrap correction is in progress after the isolated Stage 3 commit. Vite
also needed a development-only restart to pick up the new package exports;
neither the BF meeting server nor the previous generator server was restarted.

Stage 4: detector tooling has 29 passing tests (60 assertions), focused Biome and
diff hygiene. Independent verdict is **NO-GO**, not accepted enforcement.
Exact declaration identities/counts prevent hidden debt growth.
Neither the allowlist nor the reviewed classification inventory is seeded yet.

## Current support work and gate boundary

Uncommitted support work loads all four authenticated Sans/Mono faces through
the typography owner, replaces the corrupt Mono HTML-disguised-as-WOFF2 files
with authenticated v1.006 TTF assets, and repoints main, Storybook and Launchpad
imports. The removed corrupt files remain recoverable in Git and the preserved
comparison worktree. Runtime dependencies and Bun lockfile are updated.
Authentication (provider version/SRI/raw hashes and font bytes/tables/axes),
typography 19/19, main 8/8 and focused TypeScript checks pass. The React demo
client build passes and includes all four font assets; existing icon runtime
URL warnings remain. This is not a root-build or component acceptance claim.

The text mapper now consumes shared role nudge pairs, retains list compensation
as margin and applies the shared 80ch measure. Legacy engines moved into the
comparison example and their production exports/wildcard path are removed.
Static production-entry integration passes 12/12 focused assertions (within the
19-test suite). The added browser cases did not execute: isolated Storybook
startup on 6112 exceeded its 120-second limit; that port is clear afterwards.
The new cases are unaccepted work in progress, not green evidence. Their
half-device-pixel baseline bound also needs correction/review: font baseline
quantization and the accepted cap approximation must not be conflated with
device-snapped borders. Existing Stage 3's earlier 42/42 evidence remains
bounded to its source state.

Independent support review leaves the plain `li` mapper scope open: it must
not accidentally apply prose nudges/measure to UI/navigation wrappers. This
needs resolution before production-entry acceptance, not a component workaround.
The legacy font-extraction executable was also found during review; it is now
an example-only helper with no published bin and an example-only script, and
opentype is development-only. The old README was replaced with current
production ownership/entry/authentication guidance.

The font gate now checks CSS face sources/descriptors and rejects swapped
normal/italic wiring and competing named faces. JSON metadata accepts platform
line endings (this repo uses core.autocrlf); the authenticated provider/font
bytes still retain their exact hash requirements. Final focused typography
19/19, TypeScript and authentication pass. Support work remains uncommitted;
only the three isolated serial foundation commits are accepted so far.

The development demo's CSR bootstrap and obsolete renderer-wide font reset
are corrected. Its shell now computes Ubuntu Sans 16px/24px at a 16px document
root with no page errors. The interactive Typographic Specimen retains its own
experimental CSS, so its screenshot is not a production geometry oracle.
BF 4173 was separately rechecked: Living Spec renders, with no page errors and
without rebuilding or restarting it.

Independent Stage 4 review found seed and history loopholes: a package-local
seed could capture only one package; dirty sources could add debt at seeding;
shallow CI history could skip committed-growth checks. Those corrections are
implemented, including full-history checkout for the existing push check job.
Missing/shallow history fails closed; classification deletion/recreation is
also checked. No new workflow was added.

Remaining P1 checker work is explicitly open: cap-derived oracle scanning can
be bypassed by same-line `.not.toContain` and misses some geometry arithmetic;
non-body detection misses heading/code shorthand roles; nested `common`
component paths can be incorrectly aggregated for the eight-property budget.
The strict scan currently reports 521 unsanctioned identities; this is an
inventory observation, NOT the one-shot seed. Tooling is frozen pending the
next review cycle and must not be wired as an accepted gate yet.

There is also an owner policy boundary, not an implementation waiver: the
blanket height ban catches Launchpad `.visually-hidden` 1px clipping, React
ApplicationLayout's 100% viewport fill, and ContextualMenu's viewport-bound
scrolling surface (whose source documents keyboard visibility). Current
exceptions do not explicitly cover these non-row uses. Do not invent durable
classifications or seed the transition allowlist before the owner decides.
No component retrofit has started and no migration-closeout gate is claimed.

## Closeout

Pending: authentication and production-entry integration, serial foundation
commits/reviews, monotone enforcement, component retrofits, all lane negatives,
package and root gates, packed imports and rendered review. T012 genuine native
zoom remains separately open.
