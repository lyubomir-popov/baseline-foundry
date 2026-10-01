# Quickstart: Body-line text phase QA

Run from the worktree root:

```powershell
Set-Location H:/WSL_dev_projects/baseline-foundry-worktrees/feat-026-body-line-text-phase
```

## Baseline capture (T002)

Rebase first (T001). Then, before any source edit, run once – and again
after any later rebase:

```powershell
npm run setup:demo-font
npm run build
Copy-Item dist tmp/026-main-dist -Recurse
Get-ChildItem tmp/026-main-dist -Recurse -File -Include *.css,tokens.json,surfaces.json | Get-FileHash -Algorithm SHA256
```

`setup:demo-font` provides the gitignored IBM Plex font; without it the
experiment build throws before `build:lib` runs. Compiled TypeScript outputs
in `dist/` are not part of the byte-equality check.

## Iterate

```powershell
npm run build
npm run test:build
npm run test:behavior
```

## Gates (CP-A and after the gap ruling)

```powershell
npm test
npm run qa:components
```

## Browser review

```powershell
npm run demo:serve -- --host 127.0.0.1
```

The server uses port 4174 (`vite.config.ts`; set `VITE_PORT` to change it).
Switch tier with the page-chrome **Tier** select and tone with the tone
toggle; both persist through local storage. Review every route in
editorial, documentation, app and os, light and dark.

| Route | Check |
|---|---|
| `http://127.0.0.1:4174/demo/spec/body-line-rhythm.html` | Default body-line and `.is-baseline-rhythm` ledgers side by side; labelled nudge, phase and closure match the [contract table](contracts/body-line-phase.md#expected-values); ruled (c) specimens in prose, a stack and a section, and the text → component → text exception; one-line heading matrix on the body-line ruling; hgroup h1 + h2 and h1 + p joined one step; wrapped exceptions visibly off phase; tight, loose, ordered and three-level lists on every body line with dots on the first line; metric-flush, `hr` and `blockquote` exceptions visible |
| `http://127.0.0.1:4174/demo/spec/typography.html` | Prose flows now on the body-line ledger; everything else unchanged |
| `http://127.0.0.1:4174/demo/spec/spacing-vertical.html` | bU page-wide phase intact; the prose-list text-run specimen occupies two body lines |
| `http://127.0.0.1:4174/demo/spec/typographic-specimen.html` | Prose flows on the body-line ledger |
| `http://127.0.0.1:4174/demo/components/prose.html` | Prose lists are single body-line blocks |
| `http://127.0.0.1:4174/demo/spec/body-line-rhythm.html` (after T-H2) | Section and strip specimen per tier matches the R8 table (contract “Section and strip boundaries”); App `is-section-shallow` equals `is-section`; panel specimens for the five hosts show body-line text, bU chrome and an `.is-baseline-rhythm` twin equal to main |
| `http://127.0.0.1:4174/demo/components/application-layout.html` | Panel content text on body lines from the content box; titles, navigation and controls unchanged |

Final review (T-H5): four tiers, light and dark, full page, into
`tmp/026-review/final/` for `demo/spec/body-line-rhythm.html`,
`demo/spec/typography.html` and `demo/components/application-layout.html`.

For the 32px-root spot check on the demo route, run
`document.documentElement.style.fontSize = "32px"` in the browser console and
re-check the heading matrix. Default and opt-out columns should differ by
exactly the phase; absolute residuals of up to about 1.8px are expected and are
recorded per tier in `review.md` as metric-authority data, not failures.

What is still open for the owner after R8–R10 (2026-10-01):

- T-R0: confirm that R8 reaches section-boundary consumers only (C2), or
  choose the alternative in research D10;
- whether wrapped headings, metric-flush pairs, `hr`, `blockquote`,
  multi-paragraph loose items and the panel inset are acceptable as
  recorded exceptions;
- whether the four limited hgroup pairs should stay unjoined.
