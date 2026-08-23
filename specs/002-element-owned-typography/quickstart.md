# QA quickstart: element-owned typography selectors

## Automated route

```powershell
npm run build
npm run test:build
npm run test:behavior
npm test
npm run qa:components
```

The Typography Roles page contains visible reciprocal visual-role fixtures. The
behavior suite supplies hidden class-only references and prose-boundary
fixtures, then checks concrete Editorial, Documentation, App, and OS computed
styles after each tier has finished loading.

## Rendered review

Start the demo:

```powershell
npm run demo:serve -- --host 127.0.0.1
```

Open `/demo/components/typography.html` and verify:

- ordinary H1–H6 and paragraph roles retain their expected hierarchy;
- switching through all four tiers remains stable;
- there is no horizontal overflow or console warning/error;
- `<h3 class="bf-h6">` visibly follows the H6 role and `<h6 class="bf-h3">`
  visibly follows the H3 role inside `.bf-prose`.

The automated behavior route separately injects hidden final plain and
`.bf-body` paragraphs and proves both retain the tier's element-owned body
margin; those boundary fixtures are not part of the manual visual inspection.

## Generated selector audit

Search generated CSS for prohibited duplicate typography selectors:

```powershell
rg -n "\.bf-prose (p|h[1-6]|figcaption)" dist
```

The command should return no matches. Prose list, blockquote, rule, and measure
selectors remain, while `.bf-prose > :last-child` must also be absent so the
container does not erase element-owned trailing rhythm.
