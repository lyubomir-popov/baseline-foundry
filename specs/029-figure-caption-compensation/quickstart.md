# Figure-caption QA

Use Node 22.21.1 and npm 11.19.0 (`npx --yes npm@11.19.0` avoids a global
install). Install from the lockfile and provide the existing demo fonts with
`npm run setup:demo-font`, then build.

Focused reproduction and acceptance:

```powershell
npm run build
node_modules/.bin/tsx scripts/behavior/figure-caption-compensation.ts
```

The proof builds temporary configured meta-role surfaces through BF's public
build API. Built-in tiers intentionally omit meta; a bare caption on those
surfaces would miss the failing cascade. The 512 configured-meta and 256 stock
tier cases (768 total) compare intact role
references, text wrapping, occupied closure, container gaps, style precedence
and following body/heading baselines. Chrome is required. The test fails on
the source base before the fix.

Run `npm run check:types`, `npm test` and `npm run qa:components` before
closeout. Full existing suites retain their Chromium launcher.

For visual review, serve this worktree using
`npm run demo:serve -- --host 127.0.0.1 --port 5192 --strictPort` and open
`/demo/components/figure.html?bundle=after` in Chrome. Review the native caption
and wrapped body-role caption with following heading/body, at 390px and wide
widths, light/dark and all four tier selections. The explicit body role retains
its established normal style; native captions remain italic. Configured
meta-role italic wrapping and closure are exercised by the focused fixture.
