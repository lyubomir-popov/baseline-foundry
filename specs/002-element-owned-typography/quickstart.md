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

The automated behavior route separately injects hidden paragraph, heading,
list, and blockquote boundary fixtures. It proves the scored boundary trims
only final semantic margin, preserves metric padding and occupied boxes, and
keeps the prose bottom and following first baseline on each tier's grid.

## Generated selector audit

Search generated CSS for prohibited duplicate typography selectors:

```powershell
rg -n "\.bf-prose (p|h[1-6]|figcaption)" dist
```

The command should return no typography-duplicate matches. Prose list,
blockquote, rule, and measure selectors remain. The boundary must be emitted
in this exact scored shape:

```css
:where(.bf-theme) :where(.bf-prose) > :last-child {
  margin-bottom: 0;
}
```
