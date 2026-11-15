# Image-comparison proof plan

The runtime/demo/tests now exist after fresh portfolio T046 Astra acceptance.
Run this matrix against the actual reviewed BF source/artifact, recording the
revision and actual results rather than relabelling earlier local proof.

Use the repository's Node/npm requirements and lockfile in the isolated
`feat-030-image-comparison` worktree. Reuse the existing supported font setup.
Avoid a global tool/config change. Before closeout run:

```powershell
npm run check:types
npm test
npm run qa:components
```

The affected demo will be `/demo/components/image-comparison.html`. Serve this
worktree on an available temporary port, use Chrome for interactive/rendered
review, and record the actual URL/source. Existing configured Chromium suites
retain their browser choice; report that distinction. No demo/server has been
started by planning.

| Area | Required proof |
|---|---|
| Rendering | Four tiers × direct/shared bundles; equal public tokens/geometry, light/dark, forced-colors, LTR/RTL; inspect actual clipping with distinct first/second panels |
| Geometry | 0/1/2/50/98/99/100; seam and grip centers agree; no independently clamped grip, duplicate control rows or frame; 1.5rem width/fixed 80px height defaults in all tiers; runway follows public grip/focus input overrides; full grip/focus visible at 240px/constrained and wide widths, root 16/20 |
| Native semantics | One effectively named range/tab stop through consumer HTML/ARIA, including rich/image labels; no runtime AccName inference or rewriting; external native naming edits survive update/destroy; endpoint value text; arrows/Home/End and RTL; Tab/Shift+Tab/pointer reentry |
| Pointer/touch | Real stage taps/drags and release-coordinate update; out-of-bounds clamp; primary/secondary buttons and multitouch; horizontal intent vs vertical scroll/pinch; Escape/cancel/unexpected capture loss; native interruption |
| Lifecycle | Repeated setup returns same handle, destroy twice, remount, multiple instances, destroy during capture/notification, no orphan global listeners or capture; fresh geometry during resize/direction changes |
| Value ownership | Default 50, explicit zero, finite clamp/round, invalid initial/API cases; runtime applies before notification; changed external setValue terminates older capture and wins; same-value setValue is a no-op; metadata/source/ratio rerender preserves value without parallel React state |
| Events | Changed input values, one commit/cancel, repeated final native change phase, no synthetic native events from API/pointer; subscribe to custom channel only; silent setValue/update cannot loop; synchronous setValue/destroy in each phase prevents stale post-callback work |
| Content/state | Replace image/slot descendants and endpoint/accessibility labels without resetting value; broken/empty media, no image metadata, reduced motion, zero width then recovery; stage/control replacement requires destroy/setup |
| Regression | Existing figure-caption metric compensation, Tab/Breadcrumb behavior and generated four-tier surface contracts remain intact; no styled data selectors or layout borders |

Save durable source/API and rendered-review evidence in this package's review.md
only once performed. Do not advertise synthetic panel proof as real portfolio
asset approval, local root-font stress as actual browser zoom, or Chrome as
physical-device/AT/multi-engine coverage.

Portfolio consumption follows a reviewed immutable BF candidate, then replaces
its local engine through the public export. Repeat its current stage/focus proof
plus runtime-value/metadata/source/teardown cases, affected routes and real
font/caption diagnostics. Portfolio owns those receipts and CP4.
