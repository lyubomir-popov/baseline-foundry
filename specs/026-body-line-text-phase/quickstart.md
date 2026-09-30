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
| `http://127.0.0.1:4174/demo/spec/body-line-rhythm.html` | Default body-line and `.is-baseline-rhythm` ledgers side by side; labelled nudge, phase and closure match the [contract table](contracts/body-line-phase.md#expected-values); gap row (a)/(b)/(c)/(d) and the double-space effect; one-line heading matrix on the body-line ruling; hgroup h1 + h2 and h1 + p joined one step; wrapped exceptions visibly off phase; tight, loose, ordered and three-level lists on every body line with dots on the first line; metric-flush, `hr` and `blockquote` exceptions visible |
| `http://127.0.0.1:4174/demo/spec/typography.html` | Prose flows now on the body-line ledger; everything else unchanged |
| `http://127.0.0.1:4174/demo/spec/spacing-vertical.html` | bU page-wide phase intact; the prose-list text-run specimen occupies two body lines |
| `http://127.0.0.1:4174/demo/spec/typographic-specimen.html` | Prose flows on the body-line ledger |
| `http://127.0.0.1:4174/demo/components/prose.html` | Prose lists are single body-line blocks |

For the 32px-root spot check on the demo route, run
`document.documentElement.style.fontSize = "32px"` in the browser console and
re-check the heading matrix. Default and opt-out columns should differ by
exactly the phase; absolute residuals of up to about 1.8px are expected and are
recorded per tier in `review.md` as metric-authority data, not failures.

What is still open for the owner after CP-B:

- which D4 gap option to adopt – (a), (b), (c) or (d);
- whether wrapped headings, metric-flush pairs, `hr`, `blockquote` and
  multi-paragraph loose items are acceptable as recorded exceptions;
- whether the four limited hgroup pairs should stay unjoined.
