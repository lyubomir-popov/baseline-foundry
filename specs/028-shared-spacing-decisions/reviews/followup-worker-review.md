# BF Spec 028 N1 mobile demo-chrome correction — worker findings

Date: 2026-10-09  
Branch: `feat/028-shared-spacing-decisions`  
Candidate commit: `2abf5e8576fce8780ce3a68caecaa3ef89106444`  
Verdict: ready for independent/root review. The bounded N1 correction and its regression test pass.

## Scope and diagnosis

The real `/demo/components/side-navigation.html` page starts with its documentation SideNavigation specimen expanded below the 64.75rem breakpoint. That specimen drawer is viewport-owning (`z-index: 102`), but the shared demo navigation/header/footer were stacked above it (`140`/`130`). At 390px the shared Pages toggle occupied the same top-left region as the specimen brand. It also hid the specimen's own close control and the upper part of its drawer.

The correction is owned by `demo/page-chrome.css` under the existing narrow breakpoint:

- while a SideNavigation inside `.pc-content` is expanded, the shared `.pc-nav` is removed from layout (`display: none`);
- the responsive shared header/footer use `z-index: 100`, below the public SideNavigation overlay/drawer (`101`/`102`);
- after the specimen closes, the shared rail returns with its existing root stack, so the Pages drawer remains above ordinary page content.

This is state-based shared-chrome behavior. It does not name a page, alter specimen markup/state, change component spacing, or add per-page CSS.

`scripts/verify-component-behavior.ts` now includes the real SideNavigation page in the Spec 028 review matrix. At narrow width it asserts that the initially expanded specimen owns brand hit testing while shared navigation has zero rendered area. It then closes the specimen, opens Pages with Enter, closes it with Escape and checks focus restoration, reopens the specimen with Space, and proves the two drawer roots retain independent state and focus.

## Before/after evidence

Before the fix, the 390px shared Pages toggle had nonzero area at `(0, 0)` in both bundles and intersected the first specimen brand. The local Chromium reproduction measured 703.20px² against the brand title in Before and 504.14px² in After; the external receipt measured the full visible brand/link overlap at about 1,400px².

After the fix, in every narrow SideNavigation state:

- the specimen remains expanded and unchanged;
- the shared rail is `display: none` and its toggle is `0 × 0`;
- the real specimen brand is visible and owns its centre hit test;
- the specimen close control is visible;
- document horizontal overflow is at most 1px (observed 0px in the direct 390px probe).

Representative screenshots:

- `before-fix-side-navigation-390-before.png`
- `before-fix-side-navigation-390-after.png`
- `after-fix-initial-side-navigation-390-before.png`
- `after-fix-initial-side-navigation-390-after.png`

## Validation

Commands run from the repository root:

```powershell
npm run demo:serve -- --host 127.0.0.1 --port 4176 --strictPort
npm run check:types
npm run test:behavior
node H:\WSL_dev_projects\temp\bf-028-followup-20261009\worker-mobile\focused-matrix.mjs
```

Results:

- `npm run check:types`: exit 0.
- `npm run test:behavior`: exit 0, `Component behavior verification passed.` This runs the amended checked-in Spec 028 regression.
- Focused Chromium matrix: 72/72 states pass with zero console/page errors and 72 screenshots.
  - Routes: real SideNavigation, Tooltip, and vertical-spacing pages.
  - Bundles: Before and After.
  - Tiers: editorial, documentation, app, and OS.
  - Widths: 390, 960, and 1440px.
  - SideNavigation: 16 narrow specimen-ownership/independence states plus 8 desktop states.
  - Tooltip and spacing unaffected checks: 48 states.
  - Mobile/responsive Pages interactions use focus + Enter, drawer focus entry, Escape, and trigger focus restoration.
  - Specimen node identity stays connected through tier changes and interactions.
- Separate 390px RTL/long-brand probe passes. The extended brand wraps to 68px high, remains within the viewport, owns hit testing, and produces zero horizontal overflow while shared chrome stays suppressed.

Primary artifacts:

| Artifact | SHA-256 |
|---|---|
| `check-types.log` | `315ddf78ae96d26254506037f4909ac94e140b75754d9fd7fd7e604ef854d68c` |
| `test-behavior.log` | `7ee5d07cfb220a32e023c4b96b51f72d8127b34c151ae957d1dc48fd285106b8` |
| `focused-matrix.json` | `b9e92ac48fc2dcf8a960b0aab47ab3872358ea4fb29490527bedbbed305ec6d0` |
| `focused-matrix-green2.log` | `303c995778d2761c75b8ff6408db560f085256088e78fc564a04f35eb060f66e` |
| `rtl-long-brand.json` | `055fabd631c61fb94ed790660d0dd86373fd8e56e83b70b5cb7780450f53a2fc` |
| `rtl-long-brand.log` | `b95e156401fea10bcfeed9ede26fa6b91dcc1e3e52c70d8823cf52fc9589a95c` |
| `before-fix-side-navigation-390.json` | `6fea4b583905ed5876d428388b5bee51e8613e38c386cf507c5066da4713d7ac` |
| `after-fix-initial-side-navigation-390.json` | `8424d7412b8317b40104c51fa9e049c6a6dba495629d68f90b79d007a7179705` |

Two harness-only failed attempts are retained rather than overwritten:

- `focused-matrix-transition-sampling-failed.log`: sampled the 160ms specimen transform before it settled.
- `focused-matrix-import-failed.log`: the scratch runner initially used a Windows drive path as an ESM specifier; `focused-matrix.mjs` now uses a `file:///H:/...` URL.

## Scope integrity and limits

Commit `2abf5e8` changes only `demo/page-chrome.css` and `scripts/verify-component-behavior.ts` (55 insertions, 2 deletions). Its diff contains no product source/config, generated `dist`, frozen Before CSS, provenance metadata, spec/status/plan/docs, or protected receipt edits. `opus-028-corrections-review.md` remains byte-identical at SHA-256 `f3f0dc8b3409eeb3773e951b1b2ad62ce1b5bef837bd236601d65692493d4183`.

The worker did not run the full `npm test` or `qa:components`; root owns those final gates and reported the full npm test green while this report was being prepared. This focused pass is Chromium on Windows at DPR 1. It does not add Firefox, Safari, real Windows contrast-theme, or native display-scaling coverage. B2 activation, governing text, source CSS, and provenance remain outside N1 and unchanged.
