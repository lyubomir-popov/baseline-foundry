# Quickstart: semantic list spacing

```powershell
npm test
npm run qa:components
npm run demo:serve -- --host 127.0.0.1
```

Inspect `/demo/components/prose.html` in all four tiers. Confirm that the
semantic list inside the component copy slot has the same computed space after
as a paragraph, the following rule does not touch it, and the structural
`.bf-tiered-list-items` container remains flush.
