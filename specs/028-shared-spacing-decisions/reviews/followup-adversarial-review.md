# Independent adversarial review: October 9 follow-up

Date: 2026-10-09  
Baseline: `5720ba3d61a3cadabbeb97089b9a6b62b42ff7db`  
Reviewed runtime target: `2abf5e8576fce8780ce3a68caecaa3ef89106444`  
Review type: independent bounded-delta review, not an Opus verdict

## Verdict

**Accept the bounded N1 runtime delta.** I found no blocking defect in the two-file
change from `5720ba3` to `2abf5e8`. The mobile SideNavigation specimen keeps its
real visible brand and close control, while only the shared page-catalog rail is
suppressed for the lifetime of the expanded specimen drawer. The shared catalog
and the fixed review controls recover after the specimen closes. Keyboard
operation, focus restoration, independent drawer state, bundle identity, real
specimen identity, responsive behavior, RTL, scrolling and horizontal overflow
all passed the independent Chromium checks described below.

This verdict is limited to N1 and its regression coverage. It is not owner visual
sign-off, acceptance of N2, Canonical-main activation, a T011g verdict, an Opus
verdict, or merge readiness. The existing npm audit failure is also a separate
CI/release blocker.

## Scope and diff integrity

`2abf5e8` has exactly two files relative to its `5720ba3` parent:

- `demo/page-chrome.css`
- `scripts/verify-component-behavior.ts`

No product source, config, generated tier bundle, frozen Before bundle, component
specimen markup, package manifest or lockfile changed in the runtime commit.
`git diff --check HEAD^ HEAD` is clean. The untracked October 7 external receipt
still hashes to
`f3f0dc8b3409eeb3773e951b1b2ad62ce1b5bef837bd236601d65692493d4183`.

The CSS repair is appropriately narrow. Below the existing `64.75rem` breakpoint,
the selector hides the shared `.pc-nav` only while an expanded
`.bf-side-navigation` exists inside `.pc-content`. It does not hide or replace the
specimen brand. Lowering the shared header/footer stacking level to 100 places
them below the public SideNavigation overlay/drawer at 101/102 while the specimen
owns the viewport. Once the specimen closes, the selector stops matching, the
catalog returns, and the review controls become hit-testable after the public
drawer transition settles.

The committed behavior test adds the real SideNavigation component page to the
Spec 028 Before/After matrix. At 390px it establishes all of the important N1
ownership facts: one real specimen, an expanded specimen drawer, a nonzero visible
brand whose centre hit belongs to the brand, zero shared-toggle area, keyboard
catalog operation, Escape focus restoration, and independent specimen/shared
drawer state. Later matrix assertions retain bundle/tier synchronization,
specimen-node connectivity, control hit testing and no horizontal overflow.

## Independent browser evidence

I used Playwright from this checkout's `node_modules` and an ephemeral plain-file
server. The final matrix covered 80 states:

- widths `390`, `960`, `1035`, `1036` and `1440`;
- Before and After;
- editorial, documentation, app and OS tiers;
- LTR and RTL.

All 80 states passed with no page or console errors. The `1035`/`1036` pair checks
both sides of the `64.75rem` breakpoint in addition to the requested
390/960/1440 widths.

For every narrow state, the initial expanded specimen had one real
`#component-side-navigation-docs`, a visible and centre-hit-testable
`Baseline Foundry` brand, a visible and hit-testable specimen close control, and
a zero-area shared catalog rail/toggle. After a keyboard close and a 250ms settled
transition, the Pages toggle and Before/After and tier controls were visible and
hit-testable. Enter opened the shared catalog, Escape closed it and restored focus
to Pages, Space independently reopened the specimen, and Escape restored focus to
the specimen trigger. Opening either drawer did not open the other.

Every state had at most one CSS pixel of permitted horizontal overflow (the
observed value was zero), used the declared version/tier bundle, and matched the
frozen provenance hash. A retained DOM marker and element handle proved the same
specimen node stayed connected through all version/tier switches. At desktop
widths the shared catalog rail remained visible and the specimen retained its
public static drawer layout. The 390px Before and After screenshots were also
visually inspected: both show the actual branded specimen and close control with
no Pages toggle over the brand.

The repository's full browser behavior verifier was run independently with the
repo-local runner and passed:

```powershell
.\node_modules\.bin\tsx.cmd scripts\verify-component-behavior.ts
```

Result: exit 0, `Component behavior verification passed.`

Raw reviewer evidence is under
`H:/WSL_dev_projects/temp/bf-028-followup-20261009/reviewer/`:

- `browser-audit.cjs` — independent plain-static Playwright harness;
- `browser-audit.json` — final 80-state result, `failureCount: 0`, SHA-256
  `5ac6441a93cc925dfe91cbaae40f2c2616b61cdaf9e62e41cfca8a223105c495`
  at the time of review;
- `reviewer-sidenav-390-{before,after}-documentation-ltr.png` — inspected
  branded initial states;
- `browser-audit-48-state-green.json` — earlier green requested-width matrix;
- `browser-audit-initial-failed.json` and
  `browser-audit-vite-hash-expected-failure.json` — preserved harness failures
  explained below.

## Harness failure disposition

The first reviewer harness run reported 139 failures. They were not accepted as
product failures. The harness incorrectly demanded that the fixed review footer
win hit testing while the intentionally full-viewport specimen drawer was open,
sampled the closing drawer before its 180ms hide timer and transform transition
settled, and hashed Vite's transformed CSS-module responses instead of plain CSS
bytes. A second Vite run reduced the result to exactly 48 hash mismatches, one per
matrix state, which confirmed the geometry/interaction failures were sampling
errors. Both failed artifacts remain in the reviewer directory.

The corrected harness used the same plain static serving model as the repository
behavior verifier, waited 250ms after close, required review-control recovery
after that settled state, and retained strict brand/pointer/focus checks. It first
passed the requested 48 states, then passed the expanded 80-state matrix.

## Repository gates and custody

I inspected the root-owned gate records pinned to `2abf5e8`. Using npm 11.19.0,
`check:types`, full `test`, `qa:components`, and
`verify:spec-028-provenance` all exited 0. The root custody check also verifies all
146 prior correction-evidence files against the sealed manifest and confirms the
protected reports, Before bundles, provenance file, product/config/dependency
inputs are unchanged. These root records supplement, rather than replace, the
independent browser run above.

The exact root commands recorded in their JSON receipts are:

```powershell
npx.cmd --yes npm@11.19.0 run check:types
npx.cmd --yes npm@11.19.0 run test
npx.cmd --yes npm@11.19.0 run qa:components
npx.cmd --yes npm@11.19.0 run verify:spec-028-provenance
```

## Remaining findings and limits

- **N2 remains an owner decision.** Bare native fields and raw native cells still
  use an all-sided inset outline in forced colors. This review neither accepts
  that deviation nor changes the one-sided accessible-paint rule.
- **N3 remains a consumer-visible disclosure.** Untyped inputs now receive the
  full BF field treatment; the follow-up disposition records that scope change.
- **N4 and N5 remain deferred minor findings.** This chrome-only change does not
  alter the prose-literal validator or the forced-colors-only containing block.
- **B2 remains open.** Equivalent Canonical-main rulings and a resulting full-SHA
  BF repin, or an explicit owner exception, are still required before BF main
  adoption.
- **T011g remains pending and mandatory before Pragma source work.** The accepted
  BF correction receipt does not supply its popup-diagnostic Opus verdict.
- Owner visual review, full Firefox interactions, Safari, native Windows contrast
  themes and native display scaling remain outside this browser pass.
- The committed regression matrix exercises SideNavigation at 390px and desktop
  at 1100px in LTR. The independent evidence adds 960/1440, exact breakpoint and
  RTL coverage, but those additional combinations are not permanent committed
  cases.
- A fresh read-only npm audit reports one high-severity transitive
  `source-map-js` advisory (`GHSA-68fv-2mgg-jv7q`, affected `>=1.0.0 <1.2.2`, a
  fix is available). The same audit failure predates `2abf5e8`; this two-file
  delta changes no dependency input. It is still an external CI/release blocker
  and must not be presented as an N1 regression or silently folded into this
  chrome slice.

## Commands run by this reviewer

```powershell
git rev-parse HEAD
git rev-parse HEAD^
git diff --name-only HEAD^ HEAD
git diff --check HEAD^ HEAD
Get-FileHash -Algorithm SHA256 specs/028-shared-spacing-decisions/opus-028-corrections-review.md
node H:\WSL_dev_projects\temp\bf-028-followup-20261009\reviewer\browser-audit.cjs
.\node_modules\.bin\tsx.cmd scripts\verify-component-behavior.ts
```

The final two commands exited 0. No source, config, demo, package, lockfile,
generated bundle, frozen report or prior evidence file was edited by this
reviewer.
