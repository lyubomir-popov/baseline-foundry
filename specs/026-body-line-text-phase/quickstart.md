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
| `http://127.0.0.1:4174/demo/spec/body-line-rhythm.html` | Current and opt-in ledgers side by side; labelled nudge, phase and closure match the [contract table](contracts/body-line-phase.md#expected-values); gap row (a)/(b)/(c)/(d) and the double-space effect; one-line heading matrix on the body-line ruling; wrapped exceptions visibly off phase; tight and loose list items aligned, dots centred; nested list, metric-flush, `hr` and `blockquote` exceptions visible |
| `http://127.0.0.1:4174/demo/spec/typography.html` | Unchanged from `main` (no modifier) |
| `http://127.0.0.1:4174/demo/spec/spacing-vertical.html` | Unchanged; bU page-wide phase intact |
| `http://127.0.0.1:4174/demo/spec/typographic-specimen.html` | Unchanged |
| `http://127.0.0.1:4174/demo/components/prose.html` | Unchanged |

For the 32px-root spot check on the demo route, run
`document.documentElement.style.fontSize = "32px"` in the browser console and
re-check the heading matrix. Opted and plain columns should differ by exactly
the phase; absolute residuals of up to about 1.8px are expected and are
recorded per tier in `review.md` as metric-authority data, not failures.

What to judge at CP-A:

- whether the added blank body line after paragraphs and list items reads
  well in each tier;
- which D4 gap option to adopt – (a), (b), (c) or (d);
- whether wrapped headings, nested lists, `hr`, `blockquote` and
  metric-flush pairs are acceptable as recorded exceptions.
