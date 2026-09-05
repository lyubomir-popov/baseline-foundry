# Quickstart: Horizontal token adoption QA

Run focused checks while iterating:

```powershell
npm run test:build
npm run test:behavior
```

Before review:

```powershell
npm test
npm run qa:components
```

Review the horizontal spacing and component routes for Editorial,
Documentation, App and OS. Check light/dark, wide/constrained, LTR/RTL, a
larger root font and non-100% page zoom. Measure Field, Action and Continuation
text starts, mark/icon gaps, panel padding, checkbox/radio paint and target
sizes, and the 020b-owned page/grid values.
