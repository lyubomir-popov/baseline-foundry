# Review: navigation brand and icon optics

## Automated gates

- `npm run build`: passed.
- `npm run test:build`: passed, 5,403 checks.
- `npm run test:behavior`: passed.

## Focused Playwright evidence

Reviewed the BF application-layout demo at 1280 by 960 and 900 by 960 using
the supported in-app browser client.

- Expanded drawer and panel share their full block extent.
- Navigation-brand header padding resolves to 0 px on every side in the app
  tier; ordinary panel headers retain their padding.
- Canonical tag meets the panel top and leading edge and measures 22 by 38 px.
- Tagged-logo container fills the 239.33 px drawer content width and its title
  remains visible.
- Wrapped-label icon consumes `matrix(1, 0, 0, 1, 0, 3)`, stays within the
  first label line, and ends before the second line.
- Collapsed desktop rail remains 48 px, rows remain 32 px, the icon transform
  resolves to `none`, and icon/row centre delta is 0 px.
- The mobile drawer retains its overlay, Canonical tag, and existing controls;
  the consumer can omit the optional control footer.

## Decision

Accept for BF release. Both changes are opt-in or component-scoped, are covered
by generated and rendered assertions, and require no downstream `.bf-*` CSS.
