# Quickstart: Verify Tier Geometry Hardening

## Focused checks

```powershell
npm run build
npm run test:build
npm run test:behavior
npm run test:components
```

## Full closeout gates

```powershell
npm test
npm run qa:components
```

## Browser routes

Start the demo with `npm run demo:serve -- --host 127.0.0.1`, then inspect:

- `/demo/components/layout.html`: switch all four tiers at a wide viewport;
  verify bounded rows narrow monotonically and App page/grid remains fluid.
- `/demo/components/table-of-contents.html`: inspect wide, narrow, focused,
  current, wrapped, nested, and RTL states.
- `/demo/components/in-page-navigation.html`: inspect desktop plus collapsed and
  expanded compact states; confirm row rhythm is unchanged and focus is visible.
- `/demo/components/divided-section.html`: verify each rule sits close above the
  heading it introduces, with most of the 24px gap above the rule.

Check the console, horizontal overflow, and baseline overlay in every route.
