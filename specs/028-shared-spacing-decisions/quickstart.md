# Quickstart

```powershell
npm install
npm run check:types
npm test
npm run qa:components
npm run demo:serve -- --host 127.0.0.1 --port 4176 --open false
```

Open `http://127.0.0.1:4176/demo/spec-028/index.html`. The sticky controls
switch only the BF stylesheet between the freshly built `6deca997` base and
`12d47ab` feature bundles. Exercise Before/After, all four tiers, desktop/mobile,
light/dark, baselines and boxes. The page reports the actual response hash,
content type and identical specimen-DOM signature.

The popup, containing-block, filled-child and focus specimens are real BF
components. The filled child is deliberate diagnostic pressure: it reaches the
owner edges without fixture isolation or z-index so the automatic overlay and
keyboard focus must remain visible above it.
